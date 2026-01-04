// ==UserScript==
// @name        quebps
// @namespace   Violentmonkey Scripts
// @match       https://query.web.bps.go.id/*
// @grant       none
// @version     1.1
// @author      Karom
// @description 8/5/2024, 2:17:06 PM
// @license MIT
// @run-at document-idle
// @require https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/502393/quebps.user.js
// @updateURL https://update.greasyfork.org/scripts/502393/quebps.meta.js
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
    //   run_getData()
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
    d_dropitem1.textContent = 'Kueri UPB'
    d_dropitem1.onclick = async () => window.userscript.run_getData('sep2024_upb')
    var d_dropitem2 = document.createElement('a')
    d_dropitem2.classList.add('dropdown-item');
    d_dropitem2.textContent = 'Kueri UTL'
    d_dropitem2.onclick = async () => window.userscript.run_getData('sep2024_utl')
    var d_dropitem3 = document.createElement('a')
    d_dropitem3.classList.add('dropdown-item');
    d_dropitem3.textContent = 'Kueri UTP'
    d_dropitem3.onclick = async () => window.userscript.run_getData('sep2024_utp')

    d_dropmenu.appendChild(d_dropitem1)
    d_dropmenu.appendChild(d_dropitem2)
    d_dropmenu.appendChild(d_dropitem3)

    d_li.appendChild(d_dropbtn)
    d_li.appendChild(d_dropmenu)

    d_ul.appendChild(d_li)

    window.d_bf = document.querySelector('.c-header-nav')
    d_bf.insertAdjacentElement('afterend', d_ul)
  }
  window.renderButton = renderButton

  /**
   * melakukan fetch untuk mendapatkan daftar query yang telah dibuat oleh PUSAT PENGOLAHAN
   * @param {String} queryfamily
   * @returns Object
   */
  async function fetchQueryServer(queryfamily = "sep2024_upb") {
    const response = await fetch("https://query.web.bps.go.id/resource/query/"+queryfamily+"/index", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": window.csrfToken,
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://query.web.bps.go.id/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    const movies = await response.json();  return movies;
  }
  window.fetchQueryServer = fetchQueryServer

  /**
   * Melakukan fetch query pusat sesuai dengan familinya menggunakan rawSQL
   * @param {String} queryfamily string query (sep2024_upb, sept2024_utp, sep2024_utl)
   * @param {Object} query_obj
   * @param {String} kd_kab kode kab 2 digit ("00")
   * @returns Object
   */
  async function fetchRawQuery(queryfamily = "sep2024_upb", query_obj, kd_kab = "00", page=1) {
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
                "raw": btoa(`${query_obj.sql}`),
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
    console.log( query_obj.updated_date ,"🤞 Querying:", query_obj.no, query_obj.query_name, "🔎 Found:", movies.data?.total, movies.message ? "⛔"+movies.message : "🤘")
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
   * combine query pusat dengan local patch query
   * @param {Array} pusat_queries
   * @param {Array} local_queries
   * @returns Array
   */
  function combineQuery(pusat_queries, local_queries) {
    gabung_queries = []
    for(let kueri of pusat_queries) {
      lidx = local_queries.findIndex(e => e.queryName == ("Patch " + kueri.no))
      if (lidx > -1) {
        var lkueri = local_queries[lidx]
        kueri.patched = "1"
        kueri.sql = `/* #Patched with local query ${lkueri.queryName}# */` + lkueri.raw
      }

      gabung_queries.push(kueri)
    }
    return gabung_queries
  }


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



  async function run_prereqs() {
    try {
      var db_upb = await idb.openDB("sep2024_upb_query")
      var lq_upb = await db_upb.getAll('query')
      var db_utl = await idb.openDB("sep2024_utl_query")
      var lq_utl = await db_utl.getAll('query')
      var db_utp = await idb.openDB("sep2024_utp_query")
      var lq_utp = await db_utp.getAll('query')
    } catch (error) {
      console.log("Kueri Local tidak ditemukan atau error", )
    } finally {
      window.queriesPatchLocal = {utp: lq_utp ?? [], utl: lq_utl ?? [], upb: lq_upb ?? []}
    }

    window.queriesPusat = {utp: [], upb: [], utl: []}
    queriesPusat.utp = await fetchQueryServer("sep2024_utp")
    queriesPusat.upb = await fetchQueryServer("sep2024_upb")
    queriesPusat.utl = await fetchQueryServer("sep2024_utl")

    window.queriesCombined = {utp: [], upb: [], utl: []}
    queriesCombined.utp = combineQuery(queriesPusat.utp, queriesPatchLocal.utp)
    queriesCombined.upb = combineQuery(queriesPusat.upb, queriesPatchLocal.upb)
    queriesCombined.utl = combineQuery(queriesPusat.utl, queriesPatchLocal.utl)

    // cara cek ada yang di patch atau tidak
    // window.queriesCombined.upb.filter(e => e?.patched == 1)

    window.resultsRowIdentitySQL = {utp: [], upb: [], utl: []}

    window.resultsRawPerQuery = {utp: [], upb: [], utl: []}
    console.log('done preparing')

  }

  async function run_before_querying(qfamily) {
    window.kd_kab = await document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value

    // get identitas
    window.RowIdentitySQL = {
      utp: {"sql": "SELECT prov, kab, kec, des, nama_krt, nama_utp, id FROM Blok1", name:"identity_utp"},
      upb: {"sql": "SELECT prov, kab, kec, des, nama, validasi, link, id FROM Assignment", name:"identity_upb"},
      utl: {"sql": "SELECT prov, kab, kec, des, nama, validasi, link, id FROM Assignment", name:"identity_utl"}
    }
    if (resultsRowIdentitySQL.utp.length == 0) {
      resultsRowIdentitySQL.utp = await fetchRawQuery("sep2024_utp", window.RowIdentitySQL.utp, window.kd_kab)
    }
    if (resultsRowIdentitySQL.upb.length == 0) {
      resultsRowIdentitySQL.upb = await fetchRawQuery("sep2024_upb", window.RowIdentitySQL.upb, window.kd_kab)
    }
    if (resultsRowIdentitySQL.utl.length == 0) {
      resultsRowIdentitySQL.utl = await fetchRawQuery("sep2024_utl", window.RowIdentitySQL.utl, window.kd_kab)
    }

  }
  window.userscript.run_before_querying = run_before_querying


  function run_getData(qfamily = 'sep2024_upb') {
    var qf = qfamily.split("_")[1]
    run_before_querying().then(async () => {

      console.log("getting data of", qfamily)

      // reset dlu hasil sebelumnya
      resultsRawPerQuery[qf] = []

      // tetep liat lagi di variabel ini, berubah gk nilainya
      window.kd_kab = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value

      // fetch semua yang combined (asumsi tidak melebihi 5000 untuk record nya)
      for (const kueri of queriesCombined[qf]) {
        const res = await fetchRawQuery(qfamily, kueri, kd_kab);
        const newres = {
          ...res,
          query: { id: kueri.id, no: kueri.no, query_name: kueri.query_name, updated_date: kueri.updated_date }
        };
        window.resultsRawPerQuery[qf] = [...window.resultsRawPerQuery[qf], newres];
      }


      console.log("membuat rekap dari", qfamily)

      var workbook, id_
      workbook = sheetjs.utils.book_new()
      id_ = {utp: [], upb: [], utl: []}

      selectProvEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(1)')
      selectKabEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)')

      // Command untuk Sheet Rekap Individu
      id_[qf] = resultsRowIdentitySQL[qf].data.data.map(e => ({...e, flag:[]}))
      resultsRawPerQuery[qf].filter(e => {
        let total = e.data?.total ?? 0
        let has_id = e.column?.findIndex(e => e.column_name == "id") != -1
        return total > 0 && has_id
      }).forEach(vsel => {
        console.log("grouping query no", vsel.query.no)
        vsel.data.data.forEach(e => {
          id_qf_selected_idx = id_[qf].findIndex(i => i.id == e.id)
          console.log("| found in idx", id_qf_selected_idx)
          if (id_qf_selected_idx != -1) {
            id_[qf][id_qf_selected_idx].flag.push(vsel.query.no)
          }
        })
      })
      wsrekap_data = id_[qf].map(e => {
        let newMe = {...e}
        newMe.flag = [...new Set(e.flag)].join("; ")
        return newMe
      })
      wsrekap_res = {
        sheetname: "rekap",
        no: "0",
        name: "Rekap Flag Query Per Id",
        prov: selectProvEl.options[selectProvEl.selectedIndex].text,
        kab: selectKabEl.options[selectKabEl.selectedIndex].text ,
        exectime: resultsRawPerQuery[qf][0].exectime
      }
      wsrekap = generateWorkbookOf(wsrekap_data, wsrekap_res)
      sheetjs.utils.book_append_sheet(workbook, wsrekap, wsrekap_res.sheetname)

      // Command untuk Sheet Log
      wslog_data = resultsRawPerQuery[qf].map(e => {
        return {
          "No": e.query.no,
          "Nama": e.query.query_name,
          "Jumlah Baris": e.data?.total,
          "Query Updated Date": e.query.updated_date,
          "Error DoesNotHaveId": (e.data?.total > 0 && e.column?.findIndex(e => e.column_name == "id") == -1)
                                ? "gagal matching di rekap, karena hasil query tidak memiliki kolom id"
                                : "",
          "Error FailedToRunQuery": e.message ?? ""
        }
      })
      wslog_res = {
        sheetname: "log",
        no: "0",
        name: "Rekap Log Error Running Query",
        prov: selectProvEl.options[selectProvEl.selectedIndex].text,
        kab: selectKabEl.options[selectKabEl.selectedIndex].text ,
        exectime: resultsRawPerQuery[qf][0].exectime
      }
      wslog = generateWorkbookOf(wslog_data, wslog_res)
      sheetjs.utils.book_append_sheet(workbook, wslog, wslog_res.sheetname)


      // Command untuk menambahkan sheet query
      resultsRawPerQuery[qf].filter(e => {
        let total = e.data?.total ?? 0
        // let has_id = e.column?.findIndex(e => e.column_name == "id") != -1
        // return total > 0 && has_id
        return total > 0
      }).forEach(vsel => {
        console.log("Append sheet query no", vsel.query.no)
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
      sheetjs.writeFile(workbook, `${qfamily}_RekapQuery ${resultsRawPerQuery[qf][0].exectime}.xlsx`)

    }).catch(err => {
      console.log('error on querying', err)

    }).finally(() => {
      console.log('success')
    })
  }
  window.userscript.run_getData = run_getData


