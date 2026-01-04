// ==UserScript==
// @name         When2meet group-ifier
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  try to take over the world and other clan related stuff
// @author       myklosbotond
// @match        https://www.when2meet.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397683/When2meet%20group-ifier.user.js
// @updateURL https://update.greasyfork.org/scripts/397683/When2meet%20group-ifier.meta.js
// ==/UserScript==

/* global TimeOfSlot, AvailableAtSlot, PeopleNames, PeopleIDs, moment */
/*jshint esversion: 6 */

const SLOT_DUR = 15 * 60;
const MIN_MEETING_DUR = 30 * 60;
// below this hoghlight the person as narrowly available
const RECOMMENDED_SLOTS_AVALAIBLE = 4;

// const ALL_PEOPLE = new Set(PeopleIDs);
// Only take into account people who actually voted...
const ALL_PEOPLE = [...AvailableAtSlot].reverse().reduceRight((acc, cur) => {
    cur.forEach(id=>acc.add(id));
    return acc;
}, new Set())

const MIN_IN_GROUP = Math.max(3, Math.min(5, Math.floor(ALL_PEOPLE.size / 2)));

moment.locale("hu", {
  weekdays: [
    "Vasárnap",
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat"
  ]
});

// Set operations

const isSetsEqual = (a, b) =>
  a.size === b.size && [...a].every(value => b.has(value));

const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

const diff = (a, b) => new Set([...a].filter(x => !b.has(x)));

// --------------

const toEntry = slot => ({
  start: slot.time,
  end: slot.time + SLOT_DUR,
  ids: slot.ids
});

const isPairFor = entry => otherEntry => {
  return [...diff(ALL_PEOPLE, entry.ids)].every(id => otherEntry.ids.has(id));
}

const separateCommonPersons = slot => pairSlot => ({
  ...pairSlot,
  ids: diff(pairSlot.ids, slot.ids),
  commonIds: intersection(pairSlot.ids, slot.ids)
});


(function() {
  "use strict";

  GM_addStyle(`
    .results {
        width: 630px;
        margin: 0 auto;
        margin-top: -160px;
        padding-bottom: calc(160px + 30px);
    }

    #pairing:not(:empty) {
        margin-bottom: 20px;
        background: #e0e0e0;
        display: inline-block;
        padding: 20px;
        padding-right: 50px;
        cursor: pointer;
        position: relative;
    }

    #pairing:not(:empty) ::after {
        content: "";
        background: url(https://img.icons8.com/carbon-copy/100/000000/copy.png);
        width: 30px;
        height: 30px;
        position: absolute;
        background-size: 30px;
        top: 7px;
        right: 7px;
    }

    .slot-description {
        font-size: 16px;
        cursor: pointer;
    }

    .slot-pairs div {
        cursor: pointer;
    }

    .slot-entry .slot-pairs {
        display: none;
        font-size: 14px;
        opacity: 0.9;
    }

    .slot-description:hover,
    .slot-pairs div:hover {
        opacity: 0.6;
    }

    .slot-entry.selected .slot-pairs {
        display: block;
        background: #eaece9;
        padding: 10px 20px;
        margin-left: -10px;
    }

    span.narrow-available {
        color: #bd3e16;
    }

    .legend {
        font-size: 14px;
        color: #333;
        margin-top: 20px;
    }

    .legend p {
        margin: 5px 0;
    }
    `);

  const data = AvailableAtSlot.map((ids, i) => ({
    time: TimeOfSlot[i],
    ids: new Set(ids)
  }))
    .map(toEntry)
    .sort((a, b) => a.start - b.start)
    // reduce is overwritten for reasons, so reverse reduceRight is a hack
    .reverse()
    .reduceRight((acc, cur) => {
      if (acc.length === 0) {
        return [cur];
      }

      const last = acc[acc.length - 1];
      if (cur.start === last.end && isSetsEqual(last.ids, cur.ids)) {
        last.end = cur.end;
        return acc;
      }

      return [...acc, cur];
    }, []);

  const validSlots = data
    .filter(entry => entry.ids.size >= MIN_IN_GROUP)
    .filter(entry => entry.end - entry.start >= MIN_MEETING_DUR);

  let slotsWithPairs = validSlots
    .map(entry => ({
      slot: entry,
      pairs: validSlots.filter(isPairFor(entry))
    }))

  const slotsHavingPairs = slotsWithPairs.filter(pairData => pairData.pairs.length > 0);
    if(slotsHavingPairs.length > 0) {
        // Only set it if there are pairs. If no pairing is valid, at least show some valid slots.
        slotsWithPairs = slotsHavingPairs;
    }

  const paired = slotsWithPairs
    .map(({ slot, pairs }) => ({
      slot: { ...slot, commonIds: new Set() },
      pairs: pairs.map(separateCommonPersons(slot))
    }));

  // =====================================================

  const resultsDiv = document.createElement("div");
  document.getElementById("MainBody").appendChild(resultsDiv);

  resultsDiv.innerHTML =
    '<div class="results">' +
    '<div id="pairing"></div>' +
    paired
      .map(
        pair => `<div class="slot-entry">
            <div class="slot-description" data-ids="${[...pair.slot.ids].join(
              ","
            )}" data-time="${pair.slot.start}">
                ${toReadableOneLine(pair.slot)}
            </div>
            <div class="slot-pairs">
                ${pair.pairs
                  .map(
                    data =>
                      `<div data-ids="${[...data.ids, ...data.commonIds].join(
                        ","
                      )}"  data-time="${data.start}" class="pair-description">${toReadableOneLine(data)}</div>`
                  )
                  .join("")}
            </div>
        </div>`
      )
      .join("<br/>") +
    `<div class="legend">
         <p>Legend:</p>
         <p><span class="narrow-available">█</span> - Only available for a short time (< 1h)</p>
         <p><span style="color: black;">█</span> - Available for longer (>= 1h)</p>
     </div>` +
    "</div>";

  const descriptionElements = document.getElementsByClassName(
    "slot-description"
  );

  document.getElementById("pairing").addEventListener("click", event => {
    const sel = window.getSelection();

    const range = document.createRange();
    range.selectNodeContents(event.target.closest("#pairing"));
    sel.removeAllRanges();
    sel.addRange(range);

    document.execCommand("copy");
  });

  Array.from(descriptionElements).forEach(function(element) {
    element.addEventListener("click", event => {
      event.target.closest(".slot-entry").toggleClassName("selected");
    });
  });

  const pairElements = document.querySelectorAll(".slot-pairs div");
  Array.from(pairElements).forEach(function(element) {
    element.addEventListener("click", event => {
      const mainEl = event.target
        .closest(".slot-entry")
        .querySelector(".slot-description");

      const pairEl = event.target.closest(".pair-description");

      const mainIds = extractIds(mainEl);
      const pairIds = extractIds(pairEl);

      const [firstGroup, secondGroup] = calculateGroups(mainIds, pairIds);

      const mainDate = extractDate(mainEl);
      const pairDate = extractDate(pairEl);

      const firstLine = `<strong>${mainDate}:</strong> ${firstGroup.join(
        ", "
      )}`;
      const secondLine = `<strong>${pairDate}:</strong> ${secondGroup.join(
        ", "
      )}`;

      document.getElementById(
        "pairing"
      ).innerHTML = `${firstLine}<br/>${secondLine}`;
    });
  });
})();

function calculateGroups(mainIds, pairIds) {
  const firstGroup = diff(mainIds, pairIds);
  const secondGroup = diff(pairIds, mainIds);

  const pool = intersection(mainIds, pairIds);
  const randomizedPool = shuffle([...pool]);

  const peopleCount = ALL_PEOPLE.size;
  const firstGroupCount =
    Math.floor(peopleCount / 2) +
    (peopleCount % 2) * Math.floor(Math.random() * 2);

  const missingFromFirstGroup = firstGroupCount - firstGroup.size;
  const firstGroupFinal = [
    ...firstGroup,
    ...randomizedPool.slice(0, missingFromFirstGroup)
  ];
  const secondGroupFinal = [
    ...secondGroup,
    ...randomizedPool.slice(missingFromFirstGroup)
  ];

  return [
    [...firstGroupFinal].map(idToName),
    [...secondGroupFinal].map(idToName)
  ];
}

const extractIds = target =>
  new Set(target.dataset.ids.split(",").map(id => parseInt(id, 10)));

const extractDate = target =>
  moment.unix(parseInt(target.dataset.time, 10)).format("dddd HH:mm");

// src: https://stackoverflow.com/a/2450976/6932518
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function idToName (id){
    return PeopleNames[PeopleIDs.indexOf(id)];
}

const toReadable = entry => ({
  period: `${moment.unix(entry.start).format("ddd DD HH:mm")} - ${moment
    .unix(entry.end)
    .format("HH:mm")}`,
  people: [...entry.ids].map(idToName),
  commonPeople: [...entry.commonIds].map(idToName)
});

function toReadableOneLine(entry) {
    const period = `${moment.unix(entry.start).format("ddd DD HH:mm")} - ${moment.unix(entry.end).format("HH:mm")}`;

    return `${period}: [${entry.ids.size + entry.commonIds.size}] ${
        entry.commonIds.size
            ? readablePeopleList(entry.commonIds, entry.start) + "&nbsp;&nbsp; | &nbsp;&nbsp;"
        : ""
    } ${readablePeopleList(entry.ids, entry.start)}`;
}

function readablePeopleList (ids, start) {
    return [...ids].map(id => {
        const availableRecommended = isAvailableRecommended(id, start);

        return `<span class="${!availableRecommended ? "narrow-available" : ""}">${idToName(id)}</span>`;

    }).join(", ");
}

function isAvailableRecommended (id, start) {
    const slotIndex = TimeOfSlot.indexOf(start);
    for(let i = 0; i < RECOMMENDED_SLOTS_AVALAIBLE; ++i) {
        if (!AvailableAtSlot[slotIndex + i].includes(id)) {
            return false;
        }
    }

    return true;
}
