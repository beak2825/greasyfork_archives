// ==UserScript==
// @name     	Ordit blacklist
// @namespace	http://tampermonkey.net/
// @version  	0.4
// @description  Hides irrelevant restaurants from Ordit main page, and creates new categories
// @author   	Andrea Dusza
// @match    	https://www.ordit.hu/restaurants
// @grant    	none
// @downloadURL https://update.greasyfork.org/scripts/36123/Ordit%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/36123/Ordit%20blacklist.meta.js
// ==/UserScript==

$(document).ready(function() {
    var personalBlacklist = [/* ... */];
    hideRestaurants(personalBlacklist);

    hideCatering();

    var exotic = ["wasabi-sushi-podmaniczky", "sushi-futar", "maguro-sushi-bar", "wokame", "the-fruit-sushi", "yamato-grill-sushi",
                 "manga-express", "banh-mi-vietnamese-sandwich", "tandoori-indiai-etterem", "darband-perzsa-etterem"];
    moveRestaurantsToNewSection("Egzotikus ételek (sushi, ázsiai konyha)", exotic, "append");
    //hideRestaurants(exotic);

    var overpriced = ["maharaja-indiai-es-himalaya-nepali-etterem", "maharaja-lounge-pest",
                    "maharaja-indiai-es-nepali-etterem-belvaros", "maharaja-lounge-belvaros",
                    "koleskonyha-glutenmentes-etterem", "great-bistro-vegan-etterem",
                    "nordsee-westend", "mexican", "fresh-grill", "nemo-fish-chips-salad", ];

    var minOrderLimit = 2999;
    var deliveryFeeLimit = 999;

    overpriced = overpriced.concat(getRestaurantIdsAbovePriceLimit(minOrderLimit, deliveryFeeLimit));
    moveRestaurantsToNewSection("Túl drága éttermek", overpriced, "append");
    //hideRestaurants(overpriced);

    var notProperFood = ["moritz-eis", "biotech-usa-futar", "haagen-dazs-westend", "kitchenbox-a-fozes-elmenye-a-tied",
                     "strandcafe-westend", "mr-gofri-sutodeje","pickies-snack-box"];
    moveRestaurantsToNewSection("Nem rendes étel", notProperFood, "append");
    //hideRestaurants(notProperFood);


    var favorites = ["center-food", "center-food-fizetes", /* ... */];
    moveRestaurantsToNewSection("Kedvencek", favorites, "prepend");

    /* If window is zoomed, sizes become like 440.660px/392.969px
           with 0.01 px differences and this breaks the layout. */
    resizeFoodCardsToUniformSize("430px", "392px");

    replaceOriginalHeaderWith("Többi (szűrt) étterem");
});

function hideRestaurants(restaurantIds){
    var restaurantUrls = restaurantIds.map(a => "https://www.ordit.hu/restaurants/" + a);
	for (const card of getRestaurantCardList()) {
  	  if (restaurantUrls.indexOf(card.href) > -1){
      	card.parentElement.remove();
  	  }
	}
}

function hideCatering(){
	for (const card of getRestaurantCardList()) {
  	  if (isCatering(card)){
      	card.parentElement.remove();
  	  }
	}
}

function getRestaurantIdsAbovePriceLimit(minOrderLimit, deliveryFeeLimit){
    var restrntIds = [];
	for (const card of getRestaurantCardList()) {
  	  if (minOrderHigherThan(card, minOrderLimit)
          || deliveryMoreExpensiveThan(card, deliveryFeeLimit)) {
      	restrntIds.push(card.href.substring(card.href.lastIndexOf('/') + 1));
  	  }
	}
    console.log(restrntIds);
    return restrntIds;
}

function resizeFoodCardsToUniformSize(width, height){
    for (const card of getRestaurantCardList()) {
        card.parentElement.style.width = width;
        card.parentElement.style.height = height;
    }
}

function getRestaurantCardList(){
    return Array.from(document.querySelectorAll("a.restaurant-card-item"));
}

function isCatering(restaurantCard){
    return restaurantCard.innerHTML.indexOf("Catering") > -1;
}

function minOrderHigherThan(restaurantCard, upperLimit){
    var price = findNumberForRegexp(restaurantCard.innerHTML, /Min\.:[\s]*([0-9 ]{1,8}) Ft/g)
    return (price != null) && (price > upperLimit);
}

function deliveryMoreExpensiveThan(restaurantCard, upperLimit){
    var price = findNumberForRegexp(restaurantCard.innerHTML, /delivery-info">[\s]*([0-9 ]{1,8}) Ft/g)
    return (price != null) && (price > upperLimit);
}

function findNumberForRegexp(text, regexp){
    var match = regexp.exec(text);
    if (match!= null){
        var numberStr = match[1];
        numberStr = numberStr.replace(" ", "");
        return parseInt(numberStr);
    }
    return null;
}

function replaceOriginalHeaderWith(newText){
    document.querySelector("span.restaurant-item-count-on-location").parentElement.innerHTML = newText;
}

function moveRestaurantsToNewSection(name, restaurantIds, mode){
    var mainContainer = document.querySelector("body > div.base-container > div > form > section > div");
    var newH1 = document.createElement("h1");
    newH1.classList.add("restaurant-list-header");
    var textnode = document.createTextNode(name);
    newH1.appendChild(textnode);

    var newFluidContainer = document.createElement("div");
    newFluidContainer.classList.add("container-fluid","location-check-container", "restaurant-list");

    if (mode === "prepend"){
      mainContainer.prepend(newFluidContainer);
      mainContainer.prepend(newH1);
    } else {
      mainContainer.append(newH1);
      mainContainer.append(newFluidContainer);
    }

    var restaurantsUrls = restaurantIds.map(a => "https://www.ordit.hu/restaurants/" + a);
    var allCards = getRestaurantCardList();
    for (const restaurantUrl of restaurantsUrls) {
      var matchingCard = allCards.find(obj => {return obj.href === restaurantUrl});
  	  if ( matchingCard != null ) {
      	newFluidContainer.appendChild(matchingCard.parentElement);
  	  }
    }
}
