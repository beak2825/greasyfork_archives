// ==UserScript==
// @name         NPM Favorites ❤
// @namespace    http://tampermonkey.net/
// @version      2024-08-11
// @description  Will allow you to easily organize and sort packages you might want to use in the future
// @author       GV3Dev
// @match        https://www.npmjs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504198/NPM%20Favorites%20%E2%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504198/NPM%20Favorites%20%E2%9D%A4.meta.js
// ==/UserScript==

let $ = window.jQuery;
var j = $.noConflict();

const main = async () => {
    if (location.href.includes("https://www.npmjs.com")) {
        setupPage(); monitorUrlChanges();
    }
}
main();


function setupPage() {
    const mainMenu = document.querySelector("#main-menu");
    if (!mainMenu) return;
    let bookmarksBtn = document.querySelector("#open-favorites-npm");
    if (!bookmarksBtn) {
        bookmarksBtn = document.createElement("li");
        bookmarksBtn.innerHTML = `<a style="cursor:pointer;" role="menuitem" class="c6c55db4 no-underline f6-ns f7 fw5 dim pr2 pl2" id="open-favorites-npm">Favorites</a>`;
        bookmarksBtn.className = "dib";
        bookmarksBtn.title = "view favorited packages ♥";
        mainMenu.append(bookmarksBtn);
        bookmarksBtn.addEventListener("click", openFavorites);
    }
    const heart = mainMenu.parentElement.parentElement.querySelector("span");
    if (location.href.includes("https://www.npmjs.com/package/")) {
        const packageName = location.href.split("/").pop();
        const savedPackage = GM_getValue(packageName);
        heart.style = "cursor:pointer; transition: .5s;";
        heart.title = savedPackage ? `Remove package from favorites` : `Add package to favorites`;
        heart.style.color = savedPackage ? "red" : "";
        heart.addEventListener("click", () => {
            toggleFavorite(packageName, heart);
        });
        if (savedPackage) {
            addHeartEmojiToHeader();
        }else{
            removeHeartEmojiFromHeader();
        }
    }else{
        heart.title = ""; heart.style = "";
    }
}

function openFavorites(evt) {
    evt.preventDefault();

    let menu = document.querySelector('#favorites-menu-npm');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        if (menu.style.display === 'flex') {
            const toBeFilled = document.querySelector("#fav-contain");
            populateFavorites(toBeFilled);
        }
    } else {
        menu = document.createElement('div');
        menu.id = 'favorites-menu-npm';
        menu.style.cssText = `
            position: fixed; top: 10px;
            right: 10px; width: 300px;
            min-height: 250px; max-height: 500px; background-color: #fff;
            border: 1px solid lightgray;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            z-index: 1000; display: flex;
            justify-content:flex-start;align-items:center;
            flex-direction:column;border-radius:5px;
            padding:5px; font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
        `;
        menu.innerHTML = `
            <h2 style="width:100%; text-align:center;margin-bottom:0; padding-bottom:0;">NPM Favorites <span style="color:red">❤</span></h2>
            <p style="text-align:center;width:95%;">Your favorite packages, within reach!</p>
            <div style="display:flex;justify-content:flex-start;align-items:center;flex-direction:row;background-color:rgba(0,0,0,0.04);padding:8px;padding-left:12px;border-radius:5px;width:90%;margin-top:5px;margin-bottom:10px;">
              <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" aria-hidden="true"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g stroke="#777777" stroke-width="1.3"><g><path d="M13.4044,7.0274 C13.4044,10.5494 10.5494,13.4044 7.0274,13.4044 C3.5054,13.4044 0.6504,10.5494 0.6504,7.0274 C0.6504,3.5054 3.5054,0.6504 7.0274,0.6504 C10.5494,0.6504 13.4044,3.5054 13.4044,7.0274 Z"></path><path d="M11.4913,11.4913 L17.8683,17.8683"></path></g></g></g></svg>
              <input id="search-fav-npm" type="text" placeholder="Search favorites" style="outline:none;border:none;background-color:transparent; padding-left:10px; font-family: var(--code); font-size:12px;">
            </div>
            <div id="fav-contain" style="margin-top:5px; width:95%; height:fit-content; max-height:85%; overflow:hidden; overflow-y:auto; padding:5px; margin-bottom:10px;"></div>
            <p style="padding:0;margin:0;text-align:center;margin-top:15px;margin-bottom:20px;font-size:13px;opacity:0.85;">Brought to you by <a href="https://github.com/gv3dev" target="_blank" style="font-weight:bold; color:red; cursor:pointer; text-decoration:none;">GV3Dev</a<p>
        `;
        document.body.appendChild(menu);
        $(menu).draggable();
        injectScrollbarCSS();
        const searchBar = menu.querySelector("#search-fav-npm");
        const toBeFilled = document.querySelector("#fav-contain");
        populateFavorites(toBeFilled);
        searchBar.addEventListener("keyup", (evt)=>{handleSearch(evt, toBeFilled)})
    }
}


function handleSearch(evt, toBeFilled) {
    const searchQuery = evt.target.value.toLowerCase();
    const favorites = GM_listValues();
    if (searchQuery === '') {
        populateFavorites(toBeFilled);
    } else {
        const filteredFavorites = favorites.filter(packageName => {
            const packageData = GM_getValue(packageName);
            return packageName.toLowerCase().includes(searchQuery) ||
                (packageData.description && packageData.description.toLowerCase().includes(searchQuery));
        });
        populateFavorites(toBeFilled, filteredFavorites);
    }
}

function populateFavorites(menu, filteredFavorites = null) {
    menu.innerHTML = '';
    const favorites = filteredFavorites || GM_listValues();

    if (favorites.length > 0) {
        const sortedFavorites = favorites
        .map(packageName => {
            const packageData = GM_getValue(packageName);
            return {
                name: packageName,
                data: packageData
            };
        })
        .sort((a, b) => new Date(b.data.addedAt) - new Date(a.data.addedAt));

        sortedFavorites.forEach(({ name, data }) => {
            let item = document.createElement("div");
            item.style = `
                width: 100%;
                min-height: 50px;
                height: fit-content;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-direction: column;
                padding: 5px;
                padding-bottom:8px;
                margin-top:5px;
                margin-bottom:5px;
                cursor:pointer;
                transition: background-color 0.3s ease;
            `;
            item.innerHTML = `
                <span style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <h2 style="margin: 0; font-size: 16px;">${name}</h2>
                    <span title="remove from favorites" style="cursor: pointer; transition: color 0.3s; font-size: 18px; padding: 2px 5px;" class="removeFavorite">&times;</span>
                </span>
                <p style="margin: 0; font-size: 14px; color: gray; text-align:left;">${data.description.length > 0 ? data.description : "For use in future projects."}</p>
            `;
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#f5f5f5';
            });

            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = '';
            });
            item.addEventListener('click', () => {
                window.location.href = data.url;
            });

            item.querySelector('.removeFavorite').addEventListener('click', (e) => {
                e.stopPropagation();
                GM_deleteValue(name);
                populateFavorites(menu);
            });
            item.querySelector('.removeFavorite').addEventListener('mouseover', (e) => {
                e.target.style.color = 'red';
            });

            item.querySelector('.removeFavorite').addEventListener('mouseout', (e) => {
                e.target.style.color = '';
            });
            menu.append(item);
        });
    } else {
        menu.innerHTML = `<p style="text-align:center;">You have no favorites</p>`;
    }
}


function toggleFavorite(packageName, btn) {
    if (location.href.includes("https://www.npmjs.com/package/")) {
        const savedPackage = GM_getValue(packageName);

        if (savedPackage) {
            GM_deleteValue(packageName);
            btn.style = "color:; transition:.5s; cursor:pointer;";
            btn.title = `Add package to favorites`;
            removeHeartEmojiFromHeader();
        } else {
            const description = prompt("💡 Add a reminder\n\nWhat do you plan to use this package for? Describe it here to help you remember later!\n\nYou can leave empty if you would like.\n","For use in future projects.");
            if (description !== null) {
                GM_setValue(packageName, { url: location.href, description, addedAt: new Date().toISOString() });
                btn.style = "color:red; transition:.5s; cursor:pointer;";
                btn.title = `Remove package from favorites`;
                addHeartEmojiToHeader();
            }
        }
    }
}

function addHeartEmojiToHeader() {
    const header = document.querySelector("#top").firstChild.firstChild;
    if (header && !header.innerText.includes("😍")) {
        header.innerText += "😍";
        header.title = "You have favorited this package ♥";
    }
}

function removeHeartEmojiFromHeader() {
    const header = document.querySelector("#top").firstChild.firstChild;
    if (header) {
        header.innerText = header.innerText.replace("😍", "");
        header.title = "";
    }
}




function monitorUrlChanges() {
    let previousUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== previousUrl) {
            previousUrl = currentUrl;
            setupPage();
        }
    }, 100);
}


// helper functions

function injectScrollbarCSS() {
    const css = `
            #fav-contain::-webkit-scrollbar {
                width: 5px;
            }
            #fav-contain::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            #fav-contain::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
            }
            #fav-contain::-webkit-scrollbar-thumb:hover {
                background:rgba(0,0,0,0.5);
            }
        `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

async function waitForElem(selector, all = false) {
    return new Promise((resolve) => {
        const checkElements = () => {
            const elements = all ? document.querySelectorAll(selector) : document.querySelector(selector);
            if (!all) {
                if (elements) {
                    resolve(elements);
                } else {
                    requestAnimationFrame(checkElements);
                }
            } else {
                if (elements.length > 0) {
                    resolve(elements);
                } else {
                    requestAnimationFrame(checkElements);
                }
            }
        };
        checkElements();
    });
}
