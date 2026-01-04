// ==UserScript==
// @name         Zillow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Display all homes within the map view.
// @author       Shoshi
// @match        https://www.zillow.com/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/395723/Zillow%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/395723/Zillow%20Enhancer.meta.js
// ==/UserScript==

let listings = [];

$(".action-bar-right-content").prepend(`
<div>
<select class="homeType">
<option value="ALL">All</option>
<option value="CONDO">Condo</option>
<option value="SINGLE_FAMILY">Single Family</option>
<option value="APARTMENT">Apartment</option>
<option value="MULTI_FAMILY">Multi-Family</option>
</select><br>
<input id="sqft" type="text" placeholder="sqft">
</div>
<button id="search">Search</button>

`);

$("#search").click(function() {
    listings = [];
    $(".list").empty();
    getJSON();
});

$(".search-page-list-header").append(`
<div class="list">
</div>
`)


function listing(e) {
    $(".list").append(`
<div>
<img src=${e.imgSrc} /><br>
<a href="https://zillow.com${e.detailUrl}">${e.addr}</a> - ${e.homeType} - <a href="https://www.google.com/maps/search/?api=1&query=${e.latLong}" target="_blank">${e.latLong}</a> - Images: ${e.imgCount} SqFt: ${e.sqft} - Beds: ${e.beds} Baths: ${e.baths}
</div>
`)
}

const render = () => {
    const squareft = document.querySelector("#sqft").value
        listings.forEach((e)=>{
            if(parseInt(squareft) === e.sqft || squareft === "") {
      if($(".homeType").val() === "ALL") {
          listing(e);
    } else if(e.homeType === $(".homeType").val()) {
          listing(e);
    }
            }
});
}

$(".homeType").change(function(){
    $(".list").empty();
    render();
});

function getJSON() {
    let url = "https://www.zillow.com/search/GetSearchPageState.htm" + window.location.search;
 $.getJSON(url, function(data) {
    let addr;
    let imgSrc;
    let detailUrl;
    let homeType;
    let latLong;
    let imgCount;
    let sqft;
    let beds;
    let baths;;

    for( let i in data.searchResults.mapResults) {
        if(data.searchResults.mapResults[i].zpid || data.searchResults.mapResults[i].buildingId) {
            addr = data.searchResults.mapResults[i].buildingId ? data.searchResults.mapResults[i].buildingId : data.searchResults.mapResults[i].hdpData.homeInfo.streetAddress;
            imgSrc = data.searchResults.mapResults[i].imgCount === 0 ? data.searchResults.mapResults[i].streetViewURL : data.searchResults.mapResults[i].imgSrc;
            detailUrl = data.searchResults.mapResults[i].detailUrl;
            homeType = data.searchResults.mapResults[i].buildingId ? "APARTMENT" : data.searchResults.mapResults[i].hdpData.homeInfo.homeType;
            latLong = data.searchResults.mapResults[i].latLong.latitude + ',' + data.searchResults.mapResults[i].latLong.longitude;
            imgCount = data.searchResults.mapResults[i].imgCount;
            sqft = data.searchResults.mapResults[i].area;
            beds = data.searchResults.mapResults[i].beds;
            baths = data.searchResults.mapResults[i].baths;
            listings.push({addr: addr, imgSrc: imgSrc, detailUrl: detailUrl, homeType: homeType, latLong: latLong, imgCount: imgCount, sqft: sqft, beds: beds, baths: baths});
          
        }
    }
     render();
});
}

getJSON();