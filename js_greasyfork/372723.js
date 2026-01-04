// ==UserScript==
// @name         屏蔽Linda
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to save your eyes
// @author       SoftwareSing
// @match        https://r4-museum.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372723/%E5%B1%8F%E8%94%BDLinda.user.js
// @updateURL https://update.greasyfork.org/scripts/372723/%E5%B1%8F%E8%94%BDLinda.meta.js
// ==/UserScript==


function findImgUrls() {
  const companyData = Meteor.connection._mongo_livedata_collections.companies.find("RvFQeL7eERB84h85z").fetch();
  if (companyData && companyData.length > 0) {
    const { pictureSmall, pictureBig } = companyData[0];

    return [ pictureSmall, pictureBig ];
  }

  return [];
}

function shield() {
  const urls = findImgUrls();
  urls.forEach((url) => {
    if (! url) {
      return;
    }
    const lindaImg = $(`img[src="${url}"]`);
    if (lindaImg.length > 0) {
      lindaImg[0].src = "https://i.imgur.com/N1qXujc.jpg";
    }
  })
}

setTimeout(() => {
  shield();
  Template.companyListCard.onRendered(() => {
    shield();
  });
  Template.companyDetailTable.onRendered(() => {
    shield();
  });
}, 1000);
