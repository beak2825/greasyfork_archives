// ==UserScript==
// @name         Skin Manager (gota.io)
// @namespace    http://tampermonkey.net/
// @version      0.63
// @description  Just a simple script that helps you manage your skins.
// @author       Amy
// @match        https://skins.gota.io/skins
// @downloadUrl
// @icon         https://skin-data.gota.io/e6e200b3-5e6d-406f-8ab6-0338f4ba09cf.png
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/Aymayy/css-files/main/style.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430853/Skin%20Manager%20%28gotaio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430853/Skin%20Manager%20%28gotaio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    const local__storage = window.localStorage;
    const default__skin__size = 250;
    const default__cols = 5;
    const container__of__container = document.querySelector('.px-8.py-3.border-t.border-gray-700');
    const submit__button = document.querySelector('.button.is-primary');
    let gallery__skins__data = {};
    let gallery__skins = {};
    let searched__gallery__skins = {};
    let skin__data = {};
    let skin__elements = {};
    let searched__skins = {};
    let gallery__state = false;
    let skin__code = '';
    let bottom__scrolls = 1;
    let skins__each__scroll = 50;
    let is__sorted = false;
    let randomized__skins = {};
    let randomized__gallery__skins = {};


    //Create and Add and Remove DOM elements
    const container__header = document.querySelector('.flex.justify-between')
    const navbar = document.querySelector('nav');


    const remove__element = container__header.querySelector('.flex.items-center');
    remove__element.remove();

    const submit__button__parent = submit__button.parentElement;
    submit__button__parent.classList.add('submit__button__parent');

    const myskins__container = document.querySelector('.grid.grid-cols-4.gap-4');
    myskins__container.classList.add('myskins__container');


    const skinSliderString = `<div class="slider-container" style="display: flex; justify-content: space-between; align-items: center; width: 15rem;"><label>Size</label><input type="range" min="50" max="1000" value="${default__skin__size}" class="slider skinSlider" id="myRange"><span class="skinSpan">${default__skin__size}</span></div>`;
    const columsSliderString = `<div class="slider-container" style="display: flex; justify-content: space-between; align-items: center; width: 15rem;"><label>Cols</label><input type="range" min="1" max="25" value="${default__cols}" class="slider colSlider" id="myRange"><span class="colSpan">${default__cols}</span></div>`;
    const searchInputString = `<div class="form__group field"><input type="input" class="search__input form__field" autocapitalize="off" spellcheck="false" placeholder="Search" name="name" id='name' required /><label for="name" class="form__label">Search</label></div>`;
    const sortButtonString = `<button class="corner-button"><span>Sort</span></button>`;
    const galleryString = `<a class="gallery__icon__container flex items-center"><svg class="gallery__icon" height="30pt" viewBox="1 -47 511.999 511" width="30pt" xmlns="http://www.w3.org/2000/svg"><path d="m469.488281 84.417969h-4.390625c-2.570312-22.023438-20.292968-39.484375-42.441406-41.621094-2.542969-23.742187-22.683594-42.296875-47.085938-42.296875h-302.21875c-40.445312 0-73.351562 32.90625-73.351562 73.347656v211.902344c0 24.574219 18.804688 44.828125 42.773438 47.144531 2.515624 23.488281 22.261718 41.886719 46.3125 42.273438.0625 4.167969.714843 8.191406 1.898437 11.988281 5.386719 17.292969 21.550781 29.882812 40.59375 29.882812h337.910156c23.441407 0 42.511719-19.070312 42.511719-42.507812v-247.601562c0-23.441407-19.070312-42.511719-42.511719-42.511719zm22.511719 42.511719v163.738281l-43.5-32.859375c-11.886719-8.976563-27.960938-9.117188-40-.347656l-55.027344 40.09375-104.9375-108.1875c-12.5-12.890626-32.839844-13.683594-46.304687-1.800782l-93.160157 82.191406v-142.828124c0-12.414063 10.097657-22.511719 22.507813-22.511719h337.910156c12.414063 0 22.511719 10.097656 22.511719 22.511719zm0 247.597656c0 12.414062-10.097656 22.511718-22.507812 22.511718h-337.914063c-10.082031 0-18.640625-6.667968-21.492187-15.824218-.660157-2.113282-1.015626-4.359375-1.015626-6.683594v-78.105469l106.394532-93.863281c5.441406-4.804688 13.660156-4.484375 18.714844.726562l47.359374 48.828126c0 .003906 0 .003906.003907.003906l94.261719 97.183594c1.960937 2.023437 4.566406 3.039062 7.179687 3.039062 2.507813 0 5.019531-.9375 6.960937-2.820312 3.960938-3.847657 4.058594-10.175782.214844-14.140626l-22.625-23.328124 52.742188-38.425782c4.867187-3.546875 11.363281-3.492187 16.167968.136719l55.554688 41.964844zm-429.5-46.707032v-236.109374c0-1.003907.050781-2 .152344-2.976563 1.492187-14.675781 13.925781-26.164063 28.988281-26.164063h122.320313c5.523437 0 10-4.476562 10-10 0-5.523437-4.476563-10-10-10h-122.320313c-27.097656 0-49.140625 22.042969-49.140625 49.140626v220.976562c-12.777344-2.300781-22.5-13.503906-22.5-26.9375v-211.902344c0-29.414062 23.933594-53.347656 53.351562-53.347656h302.21875c13.273438 0 24.371094 9.503906 26.84375 22.070312h-108.453124c-5.523438 0-10 4.476563-10 10 0 5.523438 4.476562 10 10 10h118.96875.011718 5.128906c13.195313 0 24.242188 9.394532 26.800782 21.847657h-313.292969c-23.4375 0-42.507813 19.070312-42.507813 42.511719v164.976562.007812 63.253907c-14.722656-.417969-26.570312-12.523438-26.570312-27.347657zm0 0"></path><path d="m388.515625 145.117188c-23.601563 0-42.796875 19.199218-42.796875 42.792968 0 23.597656 19.199219 42.796875 42.796875 42.796875 23.59375 0 42.792969-19.199219 42.792969-42.796875 0-23.59375-19.199219-42.792968-42.792969-42.792968zm0 65.589843c-12.570313 0-22.796875-10.226562-22.796875-22.792969 0-12.570312 10.226562-22.796874 22.796875-22.796874 12.566406 0 22.792969 10.226562 22.792969 22.796874 0 12.566407-10.226563 22.792969-22.792969 22.792969zm0 0"></path><path d="m244.730469 56.398438c.25.601562.558593 1.179687.917969 1.722656.363281.546875.78125 1.058594 1.242187 1.519531.460937.457031.96875.878906 1.519531 1.25.539063.359375 1.128906.667969 1.730469.917969.597656.25 1.230469.441406 1.871094.570312.636719.128906 1.296875.191406 1.949219.191406.660156 0 1.308593-.0625 1.960937-.191406.636719-.128906 1.257813-.320312 1.867187-.570312.601563-.25 1.179688-.558594 1.722657-.917969.546875-.371094 1.058593-.792969 1.519531-1.25.46875-.460937.878906-.972656 1.25-1.519531.359375-.542969.667969-1.121094.917969-1.722656.25-.609376.441406-1.238282.570312-1.867188.128907-.652344.191407-1.3125.191407-1.960938 0-.652343-.0625-1.3125-.191407-1.949218-.128906-.640625-.320312-1.273438-.570312-1.871094-.25-.609375-.558594-1.191406-.917969-1.730469-.371094-.550781-.78125-1.058593-1.25-1.519531-.460938-.460938-.972656-.878906-1.519531-1.242188-.542969-.359374-1.121094-.667968-1.722657-.917968-.609374-.25-1.230468-.441406-1.867187-.570313-1.292969-.261719-2.621094-.261719-3.910156 0-.640625.128907-1.273438.320313-1.871094.570313-.601563.25-1.191406.558594-1.730469.917968-.550781.363282-1.058594.78125-1.519531 1.242188s-.878906.96875-1.242187 1.519531c-.359376.539063-.667969 1.121094-.917969 1.730469-.25.597656-.441407 1.230469-.570313 1.871094-.128906.636718-.199218 1.296875-.199218 1.949218 0 .648438.070312 1.308594.199218 1.960938.128906.628906.320313 1.257812.570313 1.867188zm0 0"></path></svg><h3 class="gallery__label text-lg leading-6 font-medium text-gray-200">My Skins</h3></a>`;
    const empty__gallery__container__string = `<div class="gallery__container grid grid-cols-4 gap-4"></div>`;
    const empty__myskins__container__string = `<div class="myskins__container grid grid-cols-4 gap-4"></div>`;
    const gallery__navbar__string = `<div class="gallery__navbar__container px-4 py-5 sm:px-6 flex justify-between "></div>`;
    const add__skin__button__string = `<div class="add__skin__button__container"><a class="add__skin__button button is-primary">Add Skin By Code</a></div>`;
    const dice__string = `<svg id="Layer_9" enable-background="new 100 100 412 412" height="40" viewBox="0 0 512 512" width="40"><path class="path_one" d="m491 128.984v254.034c0 12.6-7.252 24.078-18.638 29.498l-202.286 96.303c-4.448 2.124-9.268 3.181-14.076 3.181s-9.617-1.057-14.065-3.181l-202.296-96.303c-11.387-5.42-18.639-16.898-18.639-29.498v-254.034c0-6.546 1.952-12.788 5.441-18.038 3.206-4.858 7.731-8.866 13.204-11.459l202.29-96.31c8.897-4.237 19.234-4.237 28.142 0l202.29 96.31c5.473 2.592 9.987 6.601 13.193 11.459 3.488 5.25 5.44 11.491 5.44 18.038z" fill="#e53935"/><path class="path_two" d="m485.559 110.946c-3.206-4.858-7.72-8.866-13.193-11.459l-202.29-96.31c-8.908-4.237-19.244-4.237-28.142 0l-1.39.662 200.9 95.648c5.473 2.592 9.988 6.601 13.193 11.459 3.489 5.25 5.441 11.491 5.441 18.038v254.034c0 12.6-7.252 24.078-18.638 29.498l-200.896 95.641 1.39.662c4.449 2.124 9.258 3.181 14.066 3.181s9.628-1.057 14.076-3.181l202.286-96.303c11.386-5.42 18.638-16.898 18.638-29.498v-254.034c0-6.547-1.952-12.788-5.441-18.038z" fill="#d32f2f"/><path class="path_three" d="m256 220.239v291.761c-4.808 0-9.617-1.057-14.065-3.181l-202.296-96.303c-11.387-5.42-18.639-16.898-18.639-29.498v-254.034c0-6.546 1.952-12.788 5.441-18.038z" fill="#f44336"/><path class="path_four" d="m491 128.984v254.041c0 12.461-7.109 23.843-18.296 29.333-.109.054-.229.109-.338.163l-202.29 96.299c-4.448 2.123-9.268 3.18-14.076 3.18v-291.761l229.559-109.293c3.489 5.25 5.441 11.491 5.441 18.038z" fill="#d32f2f"/><path class="path_five" d="m485.559 110.946-25.994 12.376c.326 1.851.513 3.741.513 5.662v254.041c0 12.461-7.109 23.843-18.296 29.333-.109.054-.229.109-.338.163l-185.444 88.28v11.199c4.808 0 9.628-1.057 14.076-3.181l202.29-96.299c.109-.054.229-.109.338-.163 11.187-5.49 18.296-16.872 18.296-29.333v-254.04c0-6.547-1.952-12.788-5.441-18.038z" fill="#c62828"/><g fill="#f1f1f1"><ellipse cx="389.64" cy="306.507" rx="26.736" ry="19.708" transform="matrix(.134 -.991 .991 .134 33.735 651.612)"/><ellipse cx="190.492" cy="263.252" rx="19.607" ry="26.736" transform="matrix(.999 -.055 .055 .999 -14.066 10.775)"/><ellipse cx="78.302" cy="360.193" rx="19.607" ry="26.736" transform="matrix(.999 -.055 .055 .999 -19.517 4.803)"/><ellipse cx="161.083" cy="104.225" rx="26.736" ry="19.607" transform="matrix(.999 -.055 .055 .999 -5.442 8.935)"/><ellipse cx="253.668" cy="58.477" rx="26.736" ry="19.607" transform="matrix(.999 -.055 .055 .999 -2.81 13.914)"/><ellipse cx="350.609" cy="107.492" rx="26.736" ry="19.607" transform="matrix(.999 -.055 .055 .999 -5.338 19.27)"/><ellipse cx="260.203" cy="149.972" rx="26.736" ry="19.607" transform="matrix(.999 -.055 .055 .999 -7.788 14.406)"/></g></svg>`;
    const star__string = `<svg class='star' width="35" height="35" viewBox="0 -10 511.98685 511"><path class='star_path' d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0" fill="#ffc107"/></svg>`;
    const spacer_string = `<div class='spacer'></div>`;

    const skinSlider = document.createRange().createContextualFragment(skinSliderString);
    const columnSlider = document.createRange().createContextualFragment(columsSliderString);
    const searchInput = document.createRange().createContextualFragment(searchInputString);
    const sortButton = document.createRange().createContextualFragment(sortButtonString);
    const gallery = document.createRange().createContextualFragment(galleryString);
    const dice = document.createRange().createContextualFragment(dice__string);
    const star = document.createRange().createContextualFragment(star__string);
    const spacer = document.createRange().createContextualFragment(spacer_string);

    const slidersContainer = document.createElement('div');
    slidersContainer.classList.add('sliders-container');
    slidersContainer.style = 'display: flex; justify-content: space-around; align-items: center; width: 40%';
    slidersContainer.appendChild(skinSlider);
    slidersContainer.appendChild(spacer.cloneNode(true));
    slidersContainer.appendChild(columnSlider);
    slidersContainer.appendChild(spacer.cloneNode(true));

    container__header.insertBefore(slidersContainer, container__header.children[0]);
    container__header.insertBefore(searchInput, container__header.children[0]);
    container__header.insertBefore(sortButton, container__header.children[0]);
    container__header.insertBefore(gallery, container__header.children[0]);
    container__header.insertBefore(dice, container__header.children[2]);
    container__header.insertBefore(star, container__header.children[1]);
    container__header.insertBefore(spacer.cloneNode(true), container__header.children[1]);
    container__header.insertBefore(spacer.cloneNode(true), container__header.children[3]);

    //Initialize defaults
    (function() {
        const container = document.querySelector('.myskins__container');
        const skins = container.querySelectorAll('.flex.flex-col');
        const slider1 = document.querySelector('.skinSlider');
        const slider2 = document.querySelector('.colSlider');
        const searchInput = document.querySelector('.search__input');

        get__myskins();
        fetch__skins();
        update__skins();

        slider1.value = default__skin__size;
        slider2.value = default__cols;
        const grid = document.querySelector('.grid.grid-cols-4.gap-4');
        grid.style.gridTemplateColumns = `repeat(${default__cols},minmax(0,1fr))`;
        //Fix/custom some styling
        skins.forEach(skin => {
            const img = skin.querySelector('img');
            img.style.maxWidth = 'none';
            img.style.width = `${default__skin__size}px`;
            skin.style.justifyContent = 'center'
            skin.style.alignItems = 'center';
        });
    })();


    //Event Listeners
    document.querySelector('.gallery__icon__container').addEventListener('click', function (e) {
        gallery__state = !gallery__state;
        searched__skins = {};
        searched__gallery__skins = {};

        if(gallery__state) {
            const container = document.querySelector('.myskins__container');
            const empty__container = document.createRange().createContextualFragment(empty__gallery__container__string);
            const add__skin__button = document.createRange().createContextualFragment(add__skin__button__string);
            const gallery__text = document.querySelector('.gallery__label');
            const search__bar = document.querySelector('.search__input');
            search__bar.value = '';

            gallery__text.innerText = 'Gallery';

            container.remove();

            container__of__container.appendChild(empty__container);
            submit__button__parent.remove();
            container__header.appendChild(add__skin__button);

            randomized__gallery__skins = {};
            randomized__skins = {};
            sort__handler(undefined, false);
            //Add skins here
            update__skins();

            document.querySelector('.add__skin__button').addEventListener('click', handle__click);
        }else {
            const gallery__text = document.querySelector('.gallery__label');
            const container = document.createRange().createContextualFragment(empty__myskins__container__string);
            const search__bar = document.querySelector('.search__input');
            search__bar.value = '';

            gallery__text.innerText = 'My Skins';

            document.querySelector('.add__skin__button').removeEventListener("click", handle__click, false);
            document.querySelector('.add__skin__button__container').remove();
            container__header.appendChild(submit__button__parent);
            document.querySelector('.gallery__container').remove();
            container__of__container.appendChild(container);
            randomized__gallery__skins = {};
            randomized__skins = {};
            sort__handler(undefined, false);

            //Add skins here
            update__skins();
        }
    });

    document.querySelector('.corner-button').addEventListener('click', sort__handler);

    document.querySelector('#Layer_9').addEventListener('click', randomize__skins);

    document.querySelector('.star').addEventListener('click', get__favorite__skins);

    document.querySelector('.search__input').addEventListener('input', input__search, false);

    document.querySelector('.skinSlider').addEventListener('input', update__skin__size, false);

    document.querySelector('.colSlider').addEventListener('input', update__skin__col, false);

    document.querySelector('.skinSlider').addEventListener('change', scroll__event__onchange, false);

    document.querySelector('.colSlider').addEventListener('change', scroll__event__onchange, false);

    window.onscroll = scroll__event;

    //Remove the annoying logo
    const containerSize = document.querySelector('.container.flex.flex-col.items-center.justify-center.mx-auto');
    containerSize.firstElementChild.remove();

    containerSize.firstElementChild.style.width = '100%';



    //                        ⬇------⬇ Functions ⬇------⬇
    //Remove skins from DOM
    function remove__skins() {
        const container = document.querySelector('.myskins__container');
        if(gallery__state) {
            const gal__container = document.querySelector('.gallery__container');
            gal__container.innerHTML = '';
        }else {
            container.innerHTML = '';
        }
    };
    function update__skin__size() {
        const span = document.querySelector('.skinSpan');
        const e = document.querySelector('.skinSlider');
        span.innerText = e.value;
        if(gallery__state) {
            const container = document.querySelector('.gallery__container');
            const gallery__skins = container.querySelectorAll('.flex.flex-col');
            gallery__skins.forEach(skin => {
                const img = skin.querySelector('img');
                img.style.width = `${e.value}px`;
            });
        }else {
            const container = document.querySelector('.myskins__container');
            const skins = container.querySelectorAll('.flex.flex-col');
            skins.forEach(skin => {
                const img = skin.querySelector('img');
                img.style.width = `${e.value}px`;
            });
        }
    }
    function update__skin__col() {
        const span = document.querySelector('.colSpan');
        const e = document.querySelector('.colSlider');
        span.innerText = e.value;
        const grid = document.querySelector('.grid.grid-cols-4.gap-4');
        grid.style.gridTemplateColumns = `repeat(${e.value},minmax(0,1fr))`;
    }

    function sort__object(o) {
        var sorted = {},
            key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        a.sort(collator.compare);

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    }
    function is__empty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }
    async function handle__click(e) {
        skin__code = prompt("Enter skin code:\nHere you find how to get code for a skin:\nhttps://github.com/Aymayy/css-files", "");
        if(skin__code === null || skin__code === '') {
            console.log("Cancelled");
            return 0;
        }else {
            await submit__skin__code(skin__code);
            fetch__skins();
        }
    }
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                callback(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
     async function submit__skin__code(code) {
         const url = `https://skins-data.com/skins/${code}`;
         let username = document.querySelector('.mx-2.text-base.text-semibold.text-gray-300');
         username.style.fontFamily = 'Arial, Helvetica, sans-serif';
         username = username.innerText.toString();
         console.log(username);
         const headers = {
             'Content-Type': 'application/json'
         }
         const body = {
             username
         }
         var fetch__data;
         await fetch(url, {
             method: 'POST',
             headers,
             body: JSON.stringify(body)
         })
             .then((response) => {
             return response.text();
         })
             .then((data) => {
             fetch__data = JSON.parse(data);
             if(fetch__data.message) {
                 alert(fetch__data.message);
                 update__local__storage();
                 update__skins();
             }else if(fetch__data.error) {
                 alert(fetch__data.error);
             }
         });
     }
    function update__skins() {
        if(gallery__state) {
            if(local__storage.getItem('__skins')) {
                gallery__skins = JSON.parse(local__storage.getItem('__skins'));
            }
            if(is__empty(searched__gallery__skins) && document.querySelector('.search__input').value !== ''){
                gallery__skins = {};
            }else if(!is__empty(searched__gallery__skins)) {
                gallery__skins = searched__gallery__skins;
            }
            if(is__sorted) {
                gallery__skins = sort__object(gallery__skins);
                randomized__gallery__skins = {};
            }
            if(!is__empty(randomized__gallery__skins)) {
                gallery__skins = randomized__gallery__skins;
            }
            const gal__container = document.querySelector('.gallery__container');
            gal__container.innerHTML = '';
            let i = 0;
            remove__skins();
            for(const skin in gallery__skins) {
                if(i === bottom__scrolls * skins__each__scroll) break;
                const skin__template__string = `<div class="gallery__skin flex flex-col" style="justify-content: center; align-items: center;"><a href="/skins/${gallery__skins[skin]}"><img class="rounded-full" src="https://skin-data.gota.io/${gallery__skins[skin]}.png" style="max-width: none; width: 250px;"></a><div class="inline-flex justify-center items-center"><span class="text-lg font-bold">${skin}</span></div></div>`;
                const skin__template = document.createRange().createContextualFragment(skin__template__string);
                skin__template.querySelector('img').setAttribute('loading', 'lazy');
                document.querySelector('.gallery__container').appendChild(skin__template);
                i++;
            }
        }else {
            const container = document.querySelector('.myskins__container');
            skin__elements = skin__data;
            if(is__empty(searched__skins) && document.querySelector('.search__input').value !== ''){
                skin__elements = {};
            }else if(!is__empty(searched__skins)) {
                skin__elements = searched__skins;
            }
            if(is__sorted) {
                skin__elements = sort__object(skin__elements);
                randomized__skins = {};
            }else if(!is__empty(randomized__skins)) {
                skin__elements = randomized__skins;
            }
            remove__skins();
            for(const element in skin__elements) {
                //const add_favorite__button__string = `<svg class='add_favorite' version="1.1" id="Layer_1" x="0px" y="0px" width="40" height="40" viewBox="0 0 286.054 286.054" style="enable-background:new 0 0 286.054 286.054;" xml:space="preserve"><path class="add_favorite_path" style="fill:#3DB39E;" d="M143.027,0C64.031,0,0,64.04,0,143.027c0,78.996,64.031,143.027,143.027,143.027 c78.987,0,143.027-64.031,143.027-143.027C286.045,64.04,222.014,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209s52.026-116.2,116.209-116.2c64.174,0,116.209,52.017,116.209,116.2 S207.201,259.236,143.027,259.236z M196.832,125.149h-35.936V89.392c0-4.934-4.005-8.939-8.939-8.939h-17.878 c-4.943,0-8.939,4.005-8.939,8.939v35.757H89.401c-4.952,0-8.957,4.005-8.957,8.939v17.878c0,4.943,4.005,8.939,8.957,8.939h35.748 v35.676c0,4.934,3.996,8.93,8.939,8.93h17.878c4.934,0,8.939-3.996,8.939-8.93v-35.676h35.936c4.952,0,8.957-3.996,8.957-8.939 v-17.878C205.789,129.162,201.775,125.149,196.832,125.149z"/></svg>`;
                const skin__template__string = `<div class="gallery__skin flex flex-col" style="justify-content: center; align-items: center;"><a href="/skins/${skin__elements[element]}"><img class="rounded-full" src="https://skin-data.gota.io/${skin__elements[element]}.png" style="max-width: none; width: 250px;"></a><div class="inline-flex justify-center items-center"><span class="text-lg font-bold">${element}</span></div></div>`;
                const skin__template = document.createRange().createContextualFragment(skin__template__string);
                //const add__favorite__button = document.createRange().createContextualFragment(add_favorite__button__string);
                //skin__template.querySelector('.gallery__skin').append(add__favorite__button);
                skin__template.querySelector('img').setAttribute('loading', 'lazy');
                container.appendChild(skin__template);

            }
        }
        update__skin__size();
        update__skin__col();
    }
    function update__local__storage() {
         local__storage.setItem('__skins', JSON.stringify(gallery__skins));
    }
    function merge__objects(obj1, obj2) {
        return Object.assign(obj1, obj2);
    }

    async function fetch__skins() {
        const url = `https://skins-data.com/skins`;
        var fetch__data;
        await fetch(url, {
            method: 'GET'
        })
            .then((response) => {
            return response.text();
        })
            .then((data) => {
            fetch__data = data;
        });
        gallery__skins__data = JSON.parse(fetch__data);
        local__storage.setItem('__skins', fetch__data);
        update__skins();
    }
    function scroll__event() {
        if(Object.keys(gallery__skins).length >= bottom__scrolls * skins__each__scroll) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                bottom__scrolls++;
                update__skins();
            }
        }
    }
    function scroll__event__onchange() {
        if(Object.keys(gallery__skins).length >= bottom__scrolls * skins__each__scroll) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                bottom__scrolls += Math.floor(window.innerHeight / 15);
                update__skins();
            }
        }
    }
    function sort__handler(ev, value) {
        const e = document.querySelector('.corner-button');
        if(value !== null && value !== undefined) {
            is__sorted = value;
        } else {
            is__sorted = !is__sorted;
        }
        if(is__sorted) {
            e.innerText = 'Unsort';
        }else {
            e.innerText = 'Sort';
        }
        update__skins();
    }
    function get__myskins() {
        const container = document.querySelector('.myskins__container');
        const skins = container.querySelectorAll('.flex.flex-col');
        const names = container.querySelectorAll('.text-lg.font-bold');
        skins.forEach(skin => {
            const img = skin.querySelector('img');
            const name = skin.querySelector('span').innerText;
            let code__url = img.src;
            code__url = code__url.replace('https://skin-data.gota.io/', '');
            code__url = code__url.replace('.png', '');
            skin__data[name] = code__url;
        });
        return skin__data;
    }
    function input__search(e) {
        if(gallery__state) {
            searched__gallery__skins = {};
            for(const element in gallery__skins__data) {
                if(element.includes(e.srcElement.value)) {
                    searched__gallery__skins[element] = gallery__skins__data[element];
                }
            }
        }else {
            update__skins();
            searched__skins = {};
            for(const element in skin__data) {
                if(element.includes(e.srcElement.value)) {
                    searched__skins[element] = skin__data[element];
                }
            }
        }
        if(e.srcElement.value === null || e.srcElement.value === '' || e.srcElement.value === undefined) {
            searched__skins = {};
            searched__gallery__skins = {};
        }
        randomized__gallery__skins = {};
        randomized__skins = {};
        update__skins();
    }
    function randomize__object(obj) {
        const randomized__object = {};
        var keys = Object.keys(obj);
        keys.sort(function(a,b) {return Math.random() - 0.5;});
        keys.forEach(function(key) {
            randomized__object[key] = obj[key];
        });
        return randomized__object;
    }
    function randomize__skins(e) {
        sort__handler(undefined, false);
        if(gallery__state) {
            if(!is__empty(searched__gallery__skins)) {
                randomized__gallery__skins = randomize__object(searched__gallery__skins);
            } else {
                randomized__gallery__skins = randomize__object(gallery__skins__data);
            }
        } else {
            if(!is__empty(searched__skins)) {
                randomized__skins = randomize__object(searched__skins);
            } else {
                randomized__skins = randomize__object(skin__data);
            }
        }
        update__skins();
    }
    function get__favorite__skins() {
        alert('Coming soon...')
    }
})();