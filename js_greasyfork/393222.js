// ==UserScript==
// @name         armory xanax usage
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393222/armory%20xanax%20usage.user.js
// @updateURL https://update.greasyfork.org/scripts/393222/armory%20xanax%20usage.meta.js
// ==/UserScript==

const APIKEY = 'API_KEY_HERE'

const torn_api = async (args) => {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${APIKEY}`,
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

torn_api('faction..armorynewsfull').then((res) => {
  let total_xanax_used = 0
  let members_used_xanax = {}
  let other_news = []
  let oldest_event = null
  for (eid in res.armorynews) {
    const news = res.armorynews[eid].news
    const timestamp = res.armorynews[eid].timestamp
    if (news.includes('Xanax')) {
      if (!oldest_event || timestamp < oldest_event) {
        oldest_event = timestamp
      }
      if (news.includes('used one of')) {
        player_name = news.split('>')[1].split('<')[0]
        if (!(player_name in members_used_xanax)) {
          members_used_xanax[player_name] = 1
        }
        else {
          members_used_xanax[player_name] += 1
        }
        total_xanax_used += 1
      }
      else other_news.push(news)
    }
  }
  console.log('Oldest Event:', (new Date(oldest_event * 1000)).toUTCString())
  console.log('Total Xanax Used:', total_xanax_used)
  console.log('Members Xanax Used:', members_used_xanax)
  console.log('Other Xanax News:', other_news)
})