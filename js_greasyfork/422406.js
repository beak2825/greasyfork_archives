// ==UserScript==
// @name         Goatlings: Closet Check
// @version      0.1
// @description  try to take over the world!
// @author       Felix G.
// @namespace    https://greasyfork.org/users/322117
// @match        https://www.goatlings.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422406/Goatlings%3A%20Closet%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/422406/Goatlings%3A%20Closet%20Check.meta.js
// ==/UserScript==

+(function() {
    'use strict';
	function setStoredValue(key, value) {
		if (value == null || value == undefined || !value) {
			sessionStorage.removeItem(key);
		} else {
			if (typeof value != 'number' && typeof value != 'string') {
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);
		}
	}
	function getStoredValue(key, safety) {
		let value = sessionStorage.getItem(key);
		if (value) {
			if (typeof value == 'string') {
				try {
					return JSON.parse(value);
				} catch (ex) {
					console.log(ex);
				}
			}
			return value;
		}
		return safety;
	}

    let stored = getStoredValue('closetCheck', {});
    const url = document.URL;
    const findMatch = (a, b) => {
        let result = { total_match: [], not_match: [] }
        a.forEach(x => !b.includes(x) ? result.not_match.push(x + `<br>`) : result.total_match.push(x))
        return result
    }
    const addGlobalStyle = (css) => {
        if (!document.head) return;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML += css;
        document.head.appendChild(style);
    }
    if (url.includes('shops/view')){
        let shopArray = [];
        let shopItems = document.querySelectorAll('.shopItem')
        shopItems.forEach(cur => shopArray.push(cur.children[3].textContent))
        if(stored["Closet Array"]){
            let search = findMatch(shopArray, stored["Closet Array"]),
            neededItems = search.not_match.join(' '),
            itemsOwned = search.total_match;
            addGlobalStyle(`
               #shoppingList {
                   position: fixed;
                   left: 100px;
                   top: 450px;
                   background-color: white;
                   border: 1px solid #ccc;
                   z-index: 999;
                   padding: 5px;
               }
            `)
            let shoppingList = `<div id="shoppingList"><b>Not In Closet:</b><br>${neededItems}</div>`;
            document.querySelector('#content').insertAdjacentHTML('beforebegin', shoppingList)
            console.log(neededItems)
        }
    }

    if (url.includes('habuddy')){
        let closetArray = [];
        let closetItems = document.querySelectorAll('.closetItem');
        let clickArr = [
            document.querySelector('input[value="Faces"]'),
            document.querySelector('input[value="Hats"]'),
            document.querySelector('input[value="Body"]'),
            document.querySelector('input[value="Bases"]'),
            document.querySelector('input[value="Accessories"]'),
            document.querySelector('input[value="Backgrounds"]')
        ]

        function arrayGather(i) {
            closetItems = document.querySelectorAll('.closetItem');
            closetItems.forEach(cur => closetArray.push(cur.childNodes[2].textContent));
            if (i < 6) {
                setTimeout(function(){clickArr[i].click()}, 500);
            } else {
                stored["Closet Array"] = closetArray;
                setStoredValue("closetCheck", stored)
                console.log(getStoredValue("closetCheck"));
            }
        }

        for(let i = 0; i < 7; i++){
            setTimeout(function() {arrayGather(i)}, 2500 * i)
        }

    }
    //console.log(stored)
})();