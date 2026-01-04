// ==UserScript==
// @name         webwork_extension
// @namespace    webwrok.math.ntu.edu.tw
// @version      3.4
// @description  Adds correct ratio to each homework.
// @author       bert30702, oToToT, WengH
// @match        *://*.webwork.math.ntu.edu.tw/*
// @match        *://webwork.marianopolis.com/*
// @match        *://wwserver.marianopolis.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411711/webwork_extension.user.js
// @updateURL https://update.greasyfork.org/scripts/411711/webwork_extension.meta.js
// ==/UserScript==

(async function(){
  
  function parseScore(str) {
    return parseFloat(str);
  }
  
  function round(f) {
    return Math.round(f * 10) / 10;
  }
  
  function getGrade(html_text) {
    var m = {};
    let d = new DOMParser();
    let doc = d.parseFromString(html_text, 'text/html');
    let nodes = doc.querySelectorAll("#grades_table tr:not([class=grades-course-total])");
    
    nodes.forEach(function(ele) {
      let e = ele.getElementsByTagName('td');
      if (e.length > 3) {
        m[e[0].innerText] = [parseScore(e[1].innerText), parseScore(e[2].innerText)];
      }
    });
    
    return m;
  }
  
  let grades_url = location.pathname + "/grades/";
  let grades_html = await (await fetch(grades_url)).text();
  let map = getGrade(grades_html);
  
  document.querySelectorAll('td a').forEach(function(ele) {
    // to hide score in closed problems, please uncomment the statement below
    // if (ele.parentNode.parentNode.innerText.includes('closed')) return;
    
    let key = ele.innerText;
    let span = document.createElement("span");
    
    if (!map[key]) return;
    
    let score = map[key][0];
    let total = map[key][1];
    
    if (total == 100) {
      span.innerText = ` ${score}%`;
    }
    else {
      span.innerText = ` ${round(score / total * 100)}% (${score} / ${total})`;
    }
    
    if (score >= total) {
      span.style.color = '#00a000'
    }
    else if (score === 0) {
      span.style.color = '#ff0000'
    }
    else if (score <= 0.6 * total) {
      span.style.color = '#c14900'
    }
    else {
      span.style.color = '#1e90ff'
    }
    
    ele.parentNode.appendChild(span);
  });
})();