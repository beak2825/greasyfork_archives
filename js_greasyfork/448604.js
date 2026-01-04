// ==UserScript==
// @name        World Athletics Enhanced Results
// @namespace   https://habs.sdf.org/
// @match       https://*.worldathletics.org/athletes/*
// @grant       none
// @version     1.3
// @author      habs
// @description click on any athlete's performances under "Results" of their profile to see the entire heat result
// @license     AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/448604/World%20Athletics%20Enhanced%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/448604/World%20Athletics%20Enhanced%20Results.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

const headToHeadQuery = `
query headToHead($id: Int, $headToHeadDiscipline: String, $headToHeadOpponent: Int, $headToHeadStartDate: String, $headToHeadEndDate: String, $headToHeadFinalOnly: Boolean) {
  headToHead(id: $id, headToHeadDiscipline: $headToHeadDiscipline, headToHeadOpponent: $headToHeadOpponent, headToHeadStartDate: $headToHeadStartDate, headToHeadEndDate: $headToHeadEndDate, headToHeadFinalOnly: $headToHeadFinalOnly) {
    disciplines {
      id
      name
      __typename
    }
    opponents {
      birthDate
      country
      familyName
      gender
      givenName
      id
      __typename
    }
    parameters {
      headToHeadDiscipline
      headToHeadEndDate
      headToHeadFinalOnly
      headToHeadOpponent
      headToHeadStartDate
      __typename
    }
    results {
      athlete1Wins
      athlete2Wins
      results {
        athlete1Wins
        athlete2Wins
        competition
        date
        discipline
        place1
        place2
        race
        raceType
        result1
        result2
        __typename
      }
      __typename
    }
    __typename
  }
}`;

const id = +[...document.querySelectorAll('div[class^=profileBasicInfo_stats]')].find(stat => (stat.querySelector('div[class^=profileBasicInfo_statName]') || {}).innerText.toUpperCase() === 'ATHLETE CODE').querySelector('div[class^=profileBasicInfo_statValue]').innerText;
const athName = document.querySelector('span[class^=profileBasicInfo_firstName]').innerText + ' ' + document.querySelector('span[class^=profileBasicInfo_lastName]').innerText;
const headers = { "x-api-key": "da2-ur5cyitdenbvlpx4rbtfc23qv4" };
const GRAPHQL_ENDPOINT = 'https://ogggth7qqvc4lkshalmx3tv6rq.appsync-api.us-west-2.amazonaws.com/graphql';

const disciplines = {};

(async () => {
  (await (await fetch(GRAPHQL_ENDPOINT, {
    headers,
    method: "POST",
    body: JSON.stringify({
      operationName: "headToHead",
      variables: { id },
      query: headToHeadQuery
    }),
  })).json()).data.headToHead.disciplines.forEach(d => {
    const name = d.name.replace(' ind.', '');
    disciplines[name] = { ids: name in disciplines ? [...disciplines[name].ids, d.id] : [d.id], opponents: [] };
  });

  const contentInner = document.querySelector('div[class^=profileStatistics_contentInner]');
  new MutationObserver(list => {
    const dateResults = list.find(rec => [...rec.addedNodes].find(node => [...(node.classList || [])].find(cls => cls.startsWith('profileStatistics_table'))));
    const evtResults = list.find(rec => [...rec.addedNodes].find(node => [...(node.classList || [])].find(cls => cls.startsWith('profileStatistics_results') || cls.startsWith('profileStatistics_statsTable'))));

    if (dateResults || evtResults) {
      const trs = 
        dateResults ? document.querySelector('tbody[class^=profileStatistics_tableBody]').querySelectorAll('tr')
        : [...document.querySelector('div[class^=profileStatistics_contentInner]').querySelectorAll('tbody[class^=profileStatistics_tableBody]')].flatMap(tbody => [...tbody.querySelectorAll('tr')]);
      trs.forEach(tr => {
        let date, comp, initialEvent, cnt, cat, race, place, result;
        if (dateResults) [date, comp, initialEvent, cnt, cat, race, place, result] = [...tr.querySelectorAll('td')].map(td => td.innerText);
        else if (evtResults) {
          [date, comp, cnt, cat, race, place, result] = [...tr.querySelectorAll('td')].map(td => td.innerText);
          initialEvent = tr.parentElement.parentElement.parentElement.previousElementSibling.innerText;
        }
        const event = initialEvent.replace(' ind.', '');
        const slug = `${date}-${comp.split(',')[0]}-${race}`;
        tr.style.cursor = 'pointer';
        tr.addEventListener('mouseenter', () => tr.style.backgroundColor = 'rgb(255, 192, 203)');
        tr.addEventListener('mouseleave', () => tr.style.backgroundColor = '');
        tr.addEventListener('click', async () => {
          if (!disciplines[event]) return window.alert('Event not supported');
          if (!disciplines[event].opponents.length) {
            const loadingTr = document.createElement('tr');
            const loadingTd = document.createElement('td');
            loadingTd.setAttribute('colspan', '999');
            loadingTd.innerText = `Loading...`;
            loadingTd.style.textAlign = 'center';
            loadingTr.appendChild(loadingTd);
            tr.parentNode.replaceChild(loadingTr, tr);
            for (const eventId of disciplines[event].ids) {
              disciplines[event].opponents.push(...(await (await fetch(GRAPHQL_ENDPOINT, {
                headers, method: "POST",
                body: JSON.stringify({
                  operationName: "headToHead",
                  variables: {
                    id, headToHeadDiscipline: eventId,
                  },
                  query: headToHeadQuery,
                }),
              })).json()).data.headToHead.opponents.map(opp => ({ ...opp, eventId })));
            }
            for (const opp of disciplines[event].opponents) {
              loadingTd.innerText = `Loading... (${disciplines[event].opponents.indexOf(opp) + 1}/${disciplines[event].opponents.length})`;
              opp.results = {};
              (await (await fetch(GRAPHQL_ENDPOINT, {
                headers, method: "POST",
                body: JSON.stringify({
                  operationName: "headToHead",
                  variables: {
                    id, headToHeadDiscipline: opp.eventId, headToHeadOpponent: opp.id,
                  },
                  query: headToHeadQuery,
                }),
              })).json()).data.headToHead.results.results.forEach(res => {
                opp.results[`${res.date}-${res.competition}-${res.race}`] = res;
              });
            }
            loadingTr.parentNode.replaceChild(tr, loadingTr);
            console.log(disciplines);
          }
          const heatObjs = disciplines[event].opponents.filter(opp => opp.results[slug]).map(opp => ({
            place: +opp.results[slug].place2.split('.')[0] || Infinity,
            text: `${opp.results[slug].place2} ${opp.givenName} ${opp.familyName} (${opp.country}), ${opp.results[slug].result2}`,
          }));
          heatObjs.push({
            place: +place.split('.')[0] || Infinity,
            text: `${place} ${athName}, ${result}`,
          });
          const displayHeat = heatObjs.sort((a, b) => a.place - b.place).map(obj => obj.text);
          window.alert(displayHeat.join('\n'));
        });
      }); 
    }
  }).observe(contentInner, { subtree: true, childList: true });
})();