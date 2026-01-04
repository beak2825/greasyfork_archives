// ==UserScript==
// @name     8chan IDs
// @version  1
// @grant    none
// @include  https://8chan.moe/*/res/*
// @include  https://8chan.se/*/res/*
// @run-at   document-idle
// @license AGPL
// @description Show statistics about 8chan post IDs
// @namespace https://greasyfork.org/users/1461466
// @downloadURL https://update.greasyfork.org/scripts/533764/8chan%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/533764/8chan%20IDs.meta.js
// ==/UserScript==

// use https://webutility.io/csv-to-chart-online to create bar graphs with csv
// remove the bottom rows with (1) posters to get a better graph

let lastresult = '';

let trash = document.createElement('div');

let button = document.createElement('button');
button.setAttribute('type', 'button');
button.innerHTML = 'Find schizos (click to update)';
trash.append(button);

let button2 = document.createElement('button');
button2.setAttribute('type', 'button');
button2.innerHTML = 'Copy CSV';
trash.append(button2);

button2.addEventListener('click', () => navigator.clipboard.writeText(lastresult));

let button3 = document.createElement('button');
button3.setAttribute('type', 'button');
button3.innerHTML = 'Hide';
trash.append(button3);

let moretrash = document.createElement('div');
trash.append(moretrash);

button3.addEventListener('click', () => moretrash.innerHTML = '');

document.getElementById('threadList').append(trash);

async function stalk(id)
{
  console.log('stalking', id);
  let dates = {};
  for (let hour = 0; hour < 24; hour++)
  {
    dates[hour] = 0;
  }
  for (let post of document.getElementsByClassName('postCell'))
  {
    let labelids = post.getElementsByClassName('labelId');
    if (labelids.length == 1 && labelids[0].innerText == id)
    {
      let date = post.getElementsByClassName('labelCreated')[0].innerText;
      let hour = parseInt(/ (\d{2}):\d{2}:\d{2}/.exec(date)[1]);
      dates[hour] = dates[hour] + 1;
    }
  }
  console.log(dates);
  let csv = `#hour,posts by ${id}\n`;
  for (let hour = 0; hour < 24; hour++)
  {
    csv += `${hour},${dates[hour]}\n`;
  }
  await navigator.clipboard.writeText(csv);
  alert('copied to clipboard');
}

function shit()
{
  moretrash.innerHTML = '';
  
  let pairs = Array.from(document.getElementsByClassName('labelId'))
    // get ID
    .map(x => x.innerText)
    // drop empty ID (post template?)
    .filter(x => x.length > 0)
    // count IDs
    .reduce((dict, x) => {dict[x] = dict[x] === undefined ? 1 : dict[x] + 1; return dict;}, {});

  let list = Object.entries(pairs);

  // sort by ID
  list.sort((a, b) => {return a[0].localeCompare(b[0]);});
  // sort by most schizo
  list.sort((a, b) => {return b[1] - a[1];});

  // number of posts with IDs
  let allcount = list.reduce((count, x) => count + x[1], 0);

  // f*ck it I love strings
  let html = '<table>';
  let csv = '#ID,posts\n';
  for (const [id, count] of list)
  {
    let style = 'border: 1px solid';
    html += `<tr><td style="${style}">${count} (${(count / allcount * 100).toFixed(1)}%)</td><td style="${style}"><span class="labelId">${id}</span></td><td><button type="button" class="stalkbtn" data-id="${id}">stalk</button></tr>`;
    csv += `${id},${count}\n`;
  }
  html += '</table>';
  html += `All: ${list.length} / ${allcount}`
  moretrash.innerHTML = html;
  lastresult = csv;
  
  // oh no I'm a retard
  for (let btn of document.getElementsByClassName('stalkbtn'))
  {
    btn.addEventListener('click', (ev) => stalk(ev.currentTarget.dataset.id));
  }
}

button.addEventListener('click', shit);
