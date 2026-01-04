// ==UserScript==
// @name        MAL VS
// @version     1.0
// @description Adds video search buttons to anime lists on MAL.
// @author      Ivan Yancharkin
// @license     MIT
// @namespace   http://github.com/yancharkin/malvs
// @homepageURL https://github.com/yancharkin/malvs
// @supportURL  https://github.com/yancharkin/malvs/issues
// @icon        https://github.com/yancharkin/malvs/blob/webextension/assets/icons/icon-48.png?raw=true
// @match       *://myanimelist.net/animelist/*
// @match       *://myanimelist.net/anime/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/532958/MAL%20VS.user.js
// @updateURL https://update.greasyfork.org/scripts/532958/MAL%20VS.meta.js
// ==/UserScript==

(async () => {
let icon = 'data:image/webp;base64,UklGRoYFAABXRUJQVlA4WAoAAAAQAAAAKQAAKQAAQUxQSEsAAAABYNxGkqLKP+laPOiFd0RMAOdU/c23H6h2fvnJ94DDgIcDNkMeAeSwN3dk4s7cC3Geiq2RA/zGjZEEv/B6QK/AEz5UeT4i0Z5UuUoAVlA4IBQFAADwGQCdASoqACoAPjESh0KiIQuO/mYQAYJbACdMuz/h7hxcHHXgDJz6iPqA2wHmA/V71kvQf0LnqAegB5cHsR/ut6TmaAdJPnyu3/rv6ATM/9c/HjzAN8A/jX+A3gji/83/uv2s8Ll6mf4d/kfyn9gOMA/jH8b/vf5j/5L6E/1j/Sfd37GvyD+0/6T3AP43/Jf8V/eP2+/t//6+of1q/qr7EH6hmDYASG/vJOZnHOGfTO8xl1SD6fN2Sej0qMXOHDbpFfEZtKwY98sfcy/aDwqlO+rz+7Rr78AA/vjhzSetupX8vvGApvh05L4/4x6f5Z3M7JANOJzEdxNV2PwXSgDrBPHj/cD1uPp8qZxsZWvTEWFNl8iW9kUSwDkKTHTw4N6XdCfhvaM6IdYM9xLo36t+hECYXO50OEjIMxTGgIcMf9mGUJz0KD9VnJDmS4eMy1911Cb9N+4lloThs3saJ/KcgLVU/a62URE4bB9MUjj3sO1c2x6s7XNVHXTCH9uovrfl5yjOm5WYYIGkE/KRQfALgfsyGxahj9Wf/udZupAyYIZmgR/qDd7QQl9Ri0MJNc4SkfkVcLVXTZjoj/uq3BTsx+7APN4hY9QeqBCL0Iz7FbFuD6ldBUB2hwuM16JTOxKTTNwTMhmNHzvXQYLACTeckkbWuywCfO5a0gxr0i4f/IdD/1pJ3b/1r4ZwqArtzl6fkfZbNnAbXDC5paGpV97L1VS9BPvb+CBTofoH+tG81FcBW3+1xvi0BZoYq+S/ui340Q35iwJlJhhcSI9sZ6Ie+KJIBCl6GFhIBcaZts1UYRu/pl3Wfpk9R7DBa4fGttRHLS/8XWezpoVxTGyFGAyaiDp//Mc73yk1oO3nPxO0q1y+hHIJ1PtqWG7Gqw0CUaJEu//3OneWPr/x8Of/1vU//81/nVzDb4zlA8QwfPH29WZxAMmctOqaN7RQOifmzmHUYfsPO08Z7hrwfgBvxRXVS9eO6HLmuazO3n3unIclW26bL8cAsju4Tyoy6uDYh3t1NIWgDL5qJI5s/Hu1n+TzGf3XedmML6EplvZk3Mkhm8npoaaF9v/R2jUAdvtBD8OhjPZgiCZKL03Vh392NTK+L17DT3Igg4D4R48q/PMLMmPnm9wwkTLJvEvOxnuZMJ4R8sswHVqV+6Lb2wvm5rigtMwfljnDhtM2AAo+088uSXIIYuRGNLuPY/0YXYUXJfh+cQLyRW3bhA/aX1CxVp8MfZdqE7fH6uchZmB7+MrecMm3H9RP/9cx4v1r89UfIzHvMnCcETeXn/rdNVYnFU3qnz/whrIhZhMZqJEq+vSu4IVybV/Pmp4zTq02Pgpn9bTjvm8XA9QYD+ctVnbenCn//yUG9IMRIQ0pZyKDybaZUzVY4ok6C2v+9CVxifsrFbuei7Uk97s+PS0/HUiEWmiHvGjpW56n5j/nZCbR/70rHRjCZl00HYm8f0C/7htdYbSBMJB7rGR1of3V77vmsAUKr33Ui/ACDKstKxmCK1DMU8EFpnzzX7/mttikenlzLwaAMkE4yysGxtbCISId1evr8lr8yaOioc3+Sqv/aeR1s+ij4Q1V1ZK7mZIFK9V/99lans9UbcsnlxfQdvze2RY1Bh1f5fkSR1iR9e54HQiRxwVekvxyKaeaxwY9Wna1rLuu9yYWNjHUXQsO/mU4D6znNh/k/LTMTbzvRklk0qfRWRnUDBwiXdGMSV5/5/l20x5Uu4AA';
    let sitesList = await GM.getValue('sitesList', "https://www.crunchyroll.com/search?from=&q=");
    sitesList = sitesList.split(",")

    function removeButtons() {
        let buttons = document.getElementsByClassName("searchanimebutton");
        while (buttons.length > 0) {
            buttons[0].parentNode.removeChild(buttons[0]);
        };
    };

    function setupButton(button, title){
        button.src = icon;
        button.alt = title;
        button.style.width = "32px";
        button.style.cursor = "pointer";
        button.onmouseover = function(){
            this.style.filter="brightness(1.5)";
            this.style.transform="scale(-1.1, 1.1)";
        };
        button.onmouseout = function(){
            this.style.filter="brightness(1)";
            this.style.transform="scale(1, 1)";
        };
        button.onclick = function(){loadDataAndSearch(this.alt)};
        return button;
    };

    function addButtons() {
        let allAnimes = document.getElementsByClassName("data title clearfix");
        let existingButtons = document.getElementsByClassName("searchanimebutton");
        if (existingButtons.length < allAnimes.length) {
            for (let anime of allAnimes) {
                if (anime.parentElement.getElementsByClassName("searchanimebutton").length === 0) {
                    let title = anime.firstChild.innerHTML;
                    let button = document.createElement("img");
                    button = setupButton(button, title);
                    let malvsTd = document.createElement("td");
                    malvsTd.className = "data searchanimebutton";
                    malvsTd.appendChild(button);
                    anime.parentElement.appendChild(malvsTd);
                }
            }
        }
    };

    function loadDataAndSearch(title) {
        for (let site of sitesList) {
            if (!site.startsWith("-")) {
                window.open(site + title);
            }
        };
    };

    function addSettingsButton() {
        async function settingsEdit() {
            let newList = prompt("Sites list: ", await GM.getValue('sitesList', "https://www.crunchyroll.com/search?from=&q="));
            if (newList) {
                await GM.setValue('sitesList', newList);
                newList = newList.split(",")
                sitesList = newList;
            };
        };

        let settingsDiv = document.createElement("div");
        settingsDiv.className = "icon-menu";
        let settingsText = document.createElement("span");
        settingsText.className = "text";
        settingsText.innerHTML = "MAL VS";
        settingsText.style.cursor = "pointer";
        settingsText.onclick = settingsEdit;
        let settingsButton = document.createElement("img");
        settingsButton.src = icon;
        settingsButton.style.transform="scaleX(-1)";
        settingsButton.alt = "MAL VS Settings";
        settingsButton.style.width = "24px";
        settingsButton.style.height = "24px";
        settingsButton.style.position = "absolute";
        settingsButton.style.left = "13px";
        settingsButton.style.top = "13px";
        settingsButton.style.cursor = "pointer";
        settingsButton.onmouseover = function() {this.style.filter="brightness(1.5)"};
        settingsButton.onmouseout = function() {this.style.filter="brightness(1)"};
        settingsButton.onclick = settingsEdit;
        settingsDiv.appendChild(settingsButton);
        settingsDiv.appendChild(settingsText);
        let listMenu = document.getElementsByClassName("list-menu-float")[0];
        let settingsMenu;
        if (!listMenu) {
            settingsDiv.className = "icon-menu";
            let menuPlaceholder = document.createElement("div");
            menuPlaceholder.className = "list-menu-float";
            menuPlaceholder.appendChild(settingsDiv);
            document.body.appendChild(menuPlaceholder);
            settingsMenu = menuPlaceholder;
        } else {
            listMenu.appendChild(settingsDiv);
            settingsMenu = listMenu;
        }
        let listMenuOffset = Math.round((window.innerHeight - settingsMenu.offsetHeight)/2);
        if (listMenuOffset < 0) listMenuOffset = 0;
        settingsMenu.style.top = listMenuOffset + "px";
    };

    const regexp = RegExp("myanimelist.net/animelist//*")
    let curUrl = window.location.href;
    if (regexp.test(curUrl)) {
        addSettingsButton();
        if (document.getElementsByClassName("malvs-header").length === 0) {
            let tableHeader = document.getElementsByClassName("list-table-header")[0]
            let malvsHeader = document.createElement("th");
            malvsHeader.className = "header-title malvs-header";
            malvsHeader.innerHTML ='<a class="link hover_info">MAL VS</a>';
            tableHeader.appendChild(malvsHeader);
        };
        removeButtons();
        setInterval(addButtons, 1000);
    } else {
        for (let malvsButton of document.getElementsByClassName("searchanimebutton")) {
            malvsButton.parentNode.removeChild(malvsButton);
        }
        let titleDiv = document.getElementsByClassName("h1-title")[0]
        titleDiv.style.verticalAlign = "middle";
        titleDiv.style.float = "none";
        let targetElement = document.getElementsByClassName("h1 edit-info")[0];
        targetElement.style.minHeight = "32px";
        let title;
        try {
            title = document.getElementsByClassName("title-name h1_bold_none")[0].firstElementChild.textContent;
        } catch(error) {
            console.log(error);
            title = document.getElementsByClassName("title-name")[0].innerHTML;
        }
        let malvsDiv = document.createElement("div");
        malvsDiv.className = "searchanimebutton";
        malvsDiv.style.display = "table-cell";
        malvsDiv.style.verticalAlign = "middle";
        malvsDiv.style.width = "48px";
        malvsDiv.style.transform = "scaleX(-1)";
        malvsDiv.style.textAlign = "right";
        let button = document.createElement("img");
        button = setupButton(button, title);
        malvsDiv.appendChild(button);
        targetElement.prepend(malvsDiv);
    };

})();
