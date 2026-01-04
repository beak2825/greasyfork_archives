// ==UserScript==
// @name         YouTube Timestamp Saver (Optimized UI)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Save YouTube timestamps with simplified UI, exportable CSV, and persistent storage
// @author       You
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538354/YouTube%20Timestamp%20Saver%20%28Optimized%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538354/YouTube%20Timestamp%20Saver%20%28Optimized%20UI%29.meta.js
// ==/UserScript==

(function () {
  const timeFields = [
    ['Start', 'startTime'],
    ['End', 'endTime'],
    ['Query', 'queryTime'],
    ['TgtStart', 'targetStartTime'],
    ['TgtEnd', 'targetEndTime'],
    ['TgtStart2', 'targetStart2'],
    ['TgtEnd2', 'targetEnd2'],
    ['TgtStart3', 'targetStart3'],
    ['TgtEnd3', 'targetEnd3']
  ];

  let label = '', videoURL = location.href.split('&')[0];
  let values = Object.fromEntries(timeFields.map(([_, k]) => [k, '']));
  let savedRows = JSON.parse(localStorage.getItem('yt_savedRows') || '[]');

  const saveToLocal = () => localStorage.setItem('yt_savedRows', JSON.stringify(savedRows));

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const ms = Math.round((s % 1) * 1000);
    const formatted = `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    return h > 0 ? `${h}:${formatted}` : formatted;
  };

  const parseTime = (str) => {
    const p = str.split(/[:.]/).map(Number);
    return p.length === 4 ? p[0]*3600 + p[1]*60 + p[2] + p[3]/1000 : p[0]*60 + p[1] + p[2]/1000;
  };

  const getTime = () => {
    const v = document.querySelector('video');
    return v ? formatTime(v.currentTime) : '';
  };

  const seekTo = (key) => {
    const v = document.querySelector('video');
    const t = parseTime(inputs[key].value);
    if (v && !isNaN(t)) v.currentTime = t;
  };

  const setTime = (key) => {
    values[key] = getTime();
    inputs[key].value = values[key];
  };

  const saveRow = () => {
    const row = [videoURL, label, ...timeFields.map(([_, k]) => values[k])];
    savedRows.push(row);
    saveToLocal();
    preview.textContent = savedRows.map(r => r.join('\t')).join('\n');
    labelInput.value = '';
    timeFields.forEach(([_, k]) => inputs[k].value = values[k] = '');
  };

  const downloadCSV = () => {
    const header = ['videoURL', 'label', ...timeFields.map(([_, k]) => k)];
    const csv = [header, ...savedRows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'timestamps.csv';
    a.click();
    savedRows = [];
    localStorage.removeItem('yt_savedRows');
    preview.textContent = '';
  };

  // Create UI
  const bar = document.createElement('div');
  bar.style.cssText = `position:fixed;bottom:0;left:0;width:100%;background:#fff;padding:5px 8px;display:flex;flex-wrap:wrap;gap:4px;font:12px sans-serif;z-index:99999;box-shadow:0 -1px 6px rgba(0,0,0,0.1)`;

  const inputs = {};

  const labelInput = document.createElement('input');
  labelInput.placeholder = 'Label';
  labelInput.style.width = '80px';
  labelInput.oninput = () => label = labelInput.value;
  bar.appendChild(labelInput);

  timeFields.forEach(([labelText, key]) => {
    const input = document.createElement('input');
    input.placeholder = labelText;
    input.style.width = '70px';
    inputs[key] = input;
    bar.appendChild(input);
    bar.appendChild(Object.assign(document.createElement('button'), {
      textContent: 'Set', onclick: () => setTime(key), style: 'font-size:11px'
    }));
    bar.appendChild(Object.assign(document.createElement('button'), {
      textContent: 'Go', onclick: () => seekTo(key), style: 'font-size:11px'
    }));
  });

  bar.appendChild(Object.assign(document.createElement('button'), {
    textContent: 'Save Row', onclick: saveRow, style: 'background:#4caf50;color:#fff;padding:3px 8px'
  }));

  bar.appendChild(Object.assign(document.createElement('button'), {
    textContent: 'Download CSV', onclick: downloadCSV, style: 'padding:3px 8px'
  }));

  const preview = document.createElement('div');
  preview.style.cssText = 'white-space:pre;overflow:auto;max-height:60px;width:100%';
  bar.appendChild(preview);

  document.body.appendChild(bar);
  preview.textContent = savedRows.map(r => r.join('\t')).join('\n');

  // URL change detection
  let lastURL = videoURL;
  const observer = new MutationObserver(() => {
    const newURL = location.href.split('&')[0];
    if (newURL !== lastURL) {
      lastURL = videoURL = newURL;
      label = '';
      Object.keys(values).forEach(k => values[k] = '');
      timeFields.forEach(([_, k]) => inputs[k].value = '');
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
