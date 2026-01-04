// ==UserScript==
// @name         TC Crimes 2.0
// @namespace    namespace
// @version      0.2
// @description  description
// @license      MIT
// @author       tos
// @match        *.torn.com/loader.php*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470593/TC%20Crimes%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/470593/TC%20Crimes%2020.meta.js
// ==/UserScript==

const original_fetch = fetch
unsafeWindow.fetch = async (input, init) => {
  const response = await original_fetch(input, init)
  const clone = response.clone()
  if (input.includes('crimesData')) {
    crimes_main(clone).catch(console.error)
  }
  return response
}

async function crimes_main(res) {
  const crimesData = await res.json()
  const crimeType = crimesData?.DB?.currentUserStatistics?.[1]?.value
  switch(crimeType) {
    case 'Counterfeiting':
      conterfeiting(crimesData.DB)
      break
    default:
      console.log(crimesData)
      break
  }
}

async function conterfeiting(db) {
  //console.log(db)
  const CDs = {
    have: db.generalInfo.CDs,
    sold: {
      1: db.currentUserStats.CDType1Sold,
      2: db.currentUserStats.CDType2Sold,
      3: db.currentUserStats.CDType3Sold,
      4: db.currentUserStats.CDType4Sold,
      5: db.currentUserStats.CDType5Sold,
      6: db.currentUserStats.CDType6Sold,
      7: db.currentUserStats.CDType7Sold,
      8: db.currentUserStats.CDType8Sold
    },
    genres: {
      'Action': '1',
      'Comedy': '2',
      'Drama': '3',
      'Fantasy': '4',
      'Horror': '5',
      'Romance': '6',
      'Thriller': '7',
      'Sci-Fi': '8'
    }
  }
  const current_queue = db?.crimesByType?.['0']?.additionalInfo?.currentQueue
  if (current_queue.length > 0) current_queue.forEach(cdID => CDs.have[cdID] += 1)
  const total_have = Object.values(CDs.have).reduce((a, b) => a + b, 0)
  const total_sold = Object.values(CDs.sold).reduce((a, b) => a + b, 0)
  Array.from(document.querySelectorAll('button[class^=genreStock]')).forEach((genre_button) => {
    const genre = genre_button.getAttribute('aria-label').split(' - ')[0].replace('Copying ', '')
    const typeID = CDs.genres[genre]
    const target = parseInt( ( CDs.sold[typeID] / total_sold ) * total_have )
    let h = parseInt( (CDs.have[typeID] / target) * 120 ) //120 is green hsl value
    //console.log(genre, {h:h, target:target, current:CDs.have[typeID]})
    if (h > 240) h = 240
    genre_button.style.backgroundColor = `hsl(${h}, 100%, 90%)`
  })
}
