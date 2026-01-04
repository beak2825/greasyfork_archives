// ==UserScript==
// @name        grid organize device values (airthings dashboard)
// @namespace   Violentmonkey Scripts
// @match       https://dashboard.airthings.com/*
// @grant       GM_addStyle
// @version     1.2
// @author      popular-software
// @description 11/21/2023, 2:01:51 PM add some classes and re-style the dashboard that shows device sensor data, using CSS grid.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480473/grid%20organize%20device%20values%20%28airthings%20dashboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480473/grid%20organize%20device%20values%20%28airthings%20dashboard%29.meta.js
// ==/UserScript==


let styleElement = GM_addStyle(`
@media screen and (min-width: 1286px) {
    .list-tile__body {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
    }

    .list-tile__body .sensor__block--radon {
        grid-column-start: 1;
        grid-row-start: 1;
    }
    .list-tile__body .sensor__block--co2 {
        grid-column-start: 2;
        grid-row-start: 1;
    }
    .list-tile__body .sensor__block--voc {
        grid-column-start: 3;
        grid-row-start: 1;
    }
    .list-tile__body .sensor__block--temp {
        grid-column-start: 4;
        grid-row-start: 1;
    }
    .list-tile__body .sensor__block--humidity {
        grid-column-start: 5;
        grid-row-start: 1;
    }
    .list-tile__body .sensor__block--pressure {
        grid-column-start: 6;
        grid-row-start: 1;
    }
}
`);

const disconnect = VM.observe(document.body, () => {

  console.log('RUN grid organize device values')

  let devices = document.querySelectorAll('.list-tile__body');

  devices.forEach((device) => {
    let sensor_blocks = device.querySelectorAll('.sensor__block');

    sensor_blocks.forEach((sensor_block) => {

      let sensor_name = sensor_block.querySelector('.sensor__name').innerText.toLowerCase();

      if (sensor_name === 'radon') {
        sensor_block.classList.add('sensor__block--radon');
      }
      if (sensor_name === 'voc') {
        sensor_block.classList.add('sensor__block--voc');
      }
      if (sensor_name === 'co₂') {
        sensor_block.classList.add('sensor__block--co2');
      }
      if (sensor_name === 'humidity') {
        sensor_block.classList.add('sensor__block--humidity');
      }
      if (sensor_name === 'temp') {
        sensor_block.classList.add('sensor__block--temp');
      }
      if (sensor_name === 'pressure') {
        sensor_block.classList.add('sensor__block--pressure');
      }

    });
  });

});
