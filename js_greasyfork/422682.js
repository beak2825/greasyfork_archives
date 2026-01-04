// ==UserScript==
// @name         Roblox Action Searcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Good tool for roblox!
// @author       YT_Xaos
// @match        https://www.roblox.com/home
// @include      https://www.roblox.com/*
// @homepage     https://flounder.epizy.com/
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422682/Roblox%20Action%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/422682/Roblox%20Action%20Searcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // New scrollbar :)
    let scrollbar = document.createElement('style');
    scrollbar.innerHTML = `
::-webkit-scrollbar {
  width: 15px;
}
::-webkit-scrollbar-track {
  display: none;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
    `
    document.head.appendChild(scrollbar);
    // Snackbar for errors
    let snackbar = document.createElement('style');
    snackbar.innerHTML = `
 #snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
  border-radius: 10px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: snackin 0.5s, snackout 0.5s 2.5s;
  animation: snackin 0.5s, snackout 0.5s 2.5s;
}

@-webkit-keyframes snackin {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes snackin {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes snackout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes snackout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
 #snackbar2{
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
  border-radius: 10px;
}

#snackbar2.show {
  visibility: visible;
  -webkit-animation: snackin 0.5s, snackout 0.5s 2.5s;
  animation: snackin 0.5s, snackout 0.5s 2.5s;
}
`
    document.head.appendChild(snackbar);
    // The actual snackbar
    let ssnackbar = document.createElement('div');
    ssnackbar.setAttribute('id', 'snackbar');
    ssnackbar.innerHTML = 'We can\'t search for nothing'
    document.querySelector('.content').appendChild(ssnackbar);
    let snackbar2 = document.createElement('div');
    snackbar2.setAttribute('id', 'snackbar2');
    snackbar2.innerHTML = 'Made by YT_Xaos';
    document.querySelector('.content').appendChild(snackbar2);
    let x = document.getElementById("snackbar2");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    // Set a timeout to load everything
    setTimeout(() => {
        // Create the button
        let actions = document.createElement('button');

        // Attributes
        actions.setAttribute('title', 'Search Actions');
        actions.setAttribute('style', 'color: black; margin: 4px; outline: none; border: none; background: transparent; position: absolute; right: 334px;');
        actions.innerHTML = "<span class='icon-nav-search'></span>";

        // Add an onclick event for the search
        actions.addEventListener('click', () => {
            let list = document.createElement('datalist');
            list.setAttribute('id', 'new-data');
            list.innerHTML = `
<option value="reload">
<option value="close/x">
<option value="home/dashboard">
<option value="url/href/link">
<option value="/on hashchange alert">
<option value="/on windowclick close">
`
            document.querySelector('.content').appendChild(list);
            actions.style.pointerEvents = 'none';
            actions.style.opacity = '0.7';
            let input = document.createElement('input');
            input.setAttribute('id', 'navbar-search');
            input.setAttribute('placeholder', 'Search');
            input.setAttribute('maxlenght', '120');
            input.setAttribute('list', 'new-data');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('style', 'position: absolute; top: 5px; left: 450px; width: 25%; border: 1px solid lightgrey; outline: none; z-index: 9999;');
            input.className = "form control input-field";
            document.querySelector('.content').appendChild(input);
            let searchbtn = document.createElement('input');
            searchbtn.setAttribute('type', 'submit');
            searchbtn.setAttribute('style', 'outline: none; background: transparent; position: absolute; right: 380px; top: 9px; border: none; z-index: 9999;');
            searchbtn.value = "Go";
            searchbtn.addEventListener('click', () => {
                let search = document.getElementById('navbar-search').value;
                console.log(search)
                // Actions:
                if (search === 'reload') {
                    window.location.reload();
                }
                if (search.length === 0) {
                    let x = document.getElementById("snackbar");
                    x.className = "show";
                    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
                }
                if (search === 'x' || search === 'close') {
                    input.remove();
                    searchbtn.remove();
                    actions.style.pointerEvents = 'auto';
                    actions.style.opacity = '1';
                }
                if (search === 'home' || search === 'dashboard') {
                    window.location = 'https://www.roblox.com/home';
                }
                if (search === 'url' || search === 'href' || search === 'link') {
                    alert(window.location.href);
                }
                if (search === 'path' || search == '/') {
                    alert(window.location.pathname);
                }
                // Commands:
                if (search === '/on hashchange alert') {
                    document.addEventListener('hashchange', () => {
                    alert(location.hash)
                    });
                }
                if (search === '/on windowclick close') {
                  window.onclick = () => {
                    input.remove();
                    searchbtn.remove();
                    actions.style.pointerEvents = 'auto';
                    actions.style.opacity = '1';
                  }
                }
            });
            document.querySelector('.content').appendChild(searchbtn);
        });

        // Make it appear in the right place
        document.querySelector('.navbar-right').appendChild(actions);
    }, 500);
})();