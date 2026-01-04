// ==UserScript==
// @name         WaniKani Lesson Batch Resizer
// @namespace    wklr
// @version      0.1
// @description  Simple script to add lesson batch resize slider
// @author       You
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423368/WaniKani%20Lesson%20Batch%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/423368/WaniKani%20Lesson%20Batch%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const getCSRFToken = page => {

        let temp_html = document.createElement('html')

        temp_html.innerHTML = page;

        console.log(temp_html);

        const metas = temp_html.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {

            if (metas[i].getAttribute('name') === 'csrf-token') {

                console.log(metas[i].getAttribute('content'));

                return metas[i].getAttribute('content');

            }

        }

        return null;

    }


    const getPage = async () => {

        const page_response = await fetch('https://www.wanikani.com/settings/app', {credentials: 'same-origin'});

        const page_data = await page_response.text();

        return page_data;

    }


    const postBatchSize = async (batchSize, CSRFToken) => {

        const url = "https://www.wanikani.com/settings/app.json"

        const request = new XMLHttpRequest();

        request.onreadystatechange = (event) => { console.log(event.target.response); }

        request.open('POST', url, true);

        request.setRequestHeader("X-CSRF-Token", CSRFToken);

        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        request.send(`utf8=%E2%9C%93&_method=patch&user%5Blessons_batch_size%5D=${batchSize}`);

        console.log("IT IS DONE");

    }


    const createSlider = () => {

        const current_lesson_size = localStorage.getItem('Lesson Batch Size')

        const div = document.createElement('div');

        div.className = "slider-container";

        div.style.width = "70px";

        const slider = document.createElement('input');

        slider.type = "range";

        slider.className = "slider";

        slider.min = 3;

        slider.max = 10;

        slider.value = current_lesson_size ? current_lesson_size : 5;

        slider.style["-webkit-appearance"] = "slider-vertical";

        slider.style.cssText += "box-shadow: none !important";

        slider.style.width = "50px";

        //slider.style.padding = "10px";

        slider.style.height = "75px";

        slider.style.margin = "10px";

        slider.style["margin-top"] = "15px";

        const text = document.createElement('div');

        text.innerHTML = `Lesson size: ${current_lesson_size ? current_lesson_size : 5}`

        text.style.padding = "15px";

        text.style["padding-right"] = "0px";

        text.style["padding-top"] = "0px";

        div.appendChild(slider);

        div.appendChild(text);

        const entry_element = document.getElementsByClassName("lessons-and-reviews")[0].querySelector('ul');

        entry_element.prepend(div);

        return {div, slider, text};

    }



    //getPage().then(page => {

      //  const CRSFToken = getCSRFToken(page)

        //postBatchSize(7, CRSFToken);

    //});


    const {div, slider, text} = createSlider();

    slider.oninput = () => {

        text.innerHTML = `Lesson size: ${slider.value}`;

    }

    slider.onchange = () => {

        getPage().then(page => {

            const CRSFToken = getCSRFToken(page);

            postBatchSize(slider.value, CRSFToken);

            localStorage.setItem('Lesson Batch Size', slider.value);

        });

    }



})();