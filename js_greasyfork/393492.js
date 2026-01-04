// ==UserScript==
// @name         revives test
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393492/revives%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/393492/revives%20test.meta.js
// ==/UserScript==

const APIKEY = 'API_KEY_HERE'

get_revives(1, 1575835200)


async function get_revives(start_t, end_t) {
  const revives = await torn_api('faction..revivesfull', `&from=${start_t}&to=${end_t}`).then(r => r.revives)
  console.log(revives)
  console.log('TOTAL REVIVES:', Object.keys(revives).length)
  let n = 0
  for (const rid in revives) {
    //console.log(revives[rid])
    if (revives[rid].target_faction === 0) {
      //console.log(revives[rid])
      n += 1
    }
  }
  console.log('target faction revives:', n)
}

//args is a string "section.id.selection"
async function torn_api(args, params=null) {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}${params ? params : ''}&key=${APIKEY}`,
      headers: {
        "Content-Type": "application/json"
      },
      onload: (response) => {
          try {
            const resjson = JSON.parse(response.responseText)
            resolve(resjson)
          } catch(err) {
            reject(err)
          }
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}
