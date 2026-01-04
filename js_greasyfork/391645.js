// ==UserScript==
// @name         Reorder Google Categories
// @version      0.5
// @description  Reorganizes the google search categories to the wanted order
// @author       CoilBlimp
// @grant        none
// @include      http://*.google.com/search*
// @include      https://*.google.com/search*
// @include      https://*.google.*/search*
// @namespace https://greasyfork.org/users/392376
// @downloadURL https://update.greasyfork.org/scripts/391645/Reorder%20Google%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/391645/Reorder%20Google%20Categories.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    let properOrganized = ["All", "Images", "Videos", "News", "Maps", "Books", "Shopping", "Flights", "Finance"],
        categoriesVisible = document.getElementById("hdtb-msb"),
        categoriesMore = document.getElementsByClassName("cF4V5c zriOQb UU8UAb gLSAk rShyOb")[0],
        categories = [];

    if(categoriesVisible === null || categoriesMore === null ){
        console.log("404 - Google categories not found");
        return;
    }

    let categoriesVisibleChildren = categoriesVisible.childNodes[0].childNodes[0].childNodes,
        categoriesMoreChildren = categoriesMore.childNodes,
		categoriesTools = categoriesVisible.childNodes[1];
	console.log(categoriesTools);

    categoriesVisibleChildren.forEach(function(item) {
        if(item.classList.contains("hdtb-msel")){
          	categories.push([item.innerText, item]);
        }
        else{
          	categories.push([item.firstChild.innerText, item]);
        }
    });
    categoriesMoreChildren.forEach(function(item) {
      	let inner = item.firstChild.firstChild.cloneNode(true);
      	inner.classList.remove("znKVS");
      	inner.classList.remove("tnhqA");
      	let outerDiv = document.createElement("div");
      	outerDiv.className = "hdtb-mitem hdtb-imb";
      	outerDiv.appendChild(inner);
        categories.push([item.innerText, outerDiv]);
    });
	console.log(categories)

    let result = [];

    properOrganized.forEach(function(key) {
        let found = false;
        categories.filter(function(item) {
			console.log(item[0]);
			console.log(key);
            if(!found && item[0] == key) {
                result.push(item);
                found = true;
				return false;
            }
			else{
				return true;
			}
        });
    });

	console.log(result);

    while (categoriesVisible.firstChild) {
        categoriesVisible.removeChild(categoriesVisible.firstChild);
    };

    result.forEach(function(item) {
      categoriesVisible.appendChild(item[1]);
    });

	categoriesVisible.appendChild(categoriesTools);
}, false);