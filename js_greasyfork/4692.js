// ==UserScript==
// @name        RT_Consensus
// @namespace   none
// @author      n33t0r
// @description Adds RottenTomatoes Consensus under Google Knowledge Graph display
// @include     https://www.google.co.*/*
// @include     https://www.google.com/*
// @icon http://n33t0r.neocities.org/Tomato-256.png
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4692/RT_Consensus.user.js
// @updateURL https://update.greasyfork.org/scripts/4692/RT_Consensus.meta.js
// ==/UserScript==
var start = function () {

  //var kng_check = document.getElementsByClassName('kp-blk _Rg _Ry _u2');
  var kng_check = document.getElementsByClassName('kp-blk _Jw _Rqb _LXc');
  if (kng_check.length) {
    var mov_check = document.querySelectorAll('div.ellip:nth-child(2) > span:nth-child(3) > a:nth-child(1)');
    if (mov_check.length) {
      var m_uri = mov_check[0].href;
      var base_uri = 'https://query.yahooapis.com/v1/public/yql?q=';
      var enc_muri = encodeURIComponent(m_uri);
      var query_url = 'select%20*%20from%20html%20where%20url%3D%22' + enc_muri + '%22%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22all-critics-numbers%22%5D%2Fdiv%2Fp\'&format=json&diagnostics=true';
      var fin_q = base_uri + query_url;
      var xhr = new XMLHttpRequest;
      if (!xhr) {
        console.error('Cant be created');
      }
      xhr.open('GET', fin_q, true);
      xhr.send();
      xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            add_data(response);
          } else {
            console.error('There was a problem with the request.');
          }
        }
      };
    }
  }
};
function add_data(data) {
  var consensus = data.query.results.p.content;
  var node = document.createTextNode(consensus);
  var el = document.createElement('div');
  root = document.querySelectorAll('.kno-rdesc');
  el.innerHTML += '<strong>Consensus: </strong>';
  el.appendChild(node);
  el.innerHTML += '<br><br>';
  root[0].insertBefore(el, root[0].firstChild);
}
start();
