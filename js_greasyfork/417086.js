// ==UserScript==
// @name         LuminusForumThread
// @namespace    https://scripts.lirc572.com/
// @version      0.1
// @description  fetch forum posts from a thread
// @author       lirc572
// @match        https://luminus.nus.edu.sg/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/417086/LuminusForumThread.user.js
// @updateURL https://update.greasyfork.org/scripts/417086/LuminusForumThread.meta.js
// ==/UserScript==

/**
 * GET
 * https://luminus.nus.edu.sg/v2/api/forum/Reply/?populate=<populate-params>&CategoryID=<cat-id>&ThreadID=<thd-id>
 * 
 * Query parameters:
 * - populate (array)
 *   - creator
 *   - photo
 *   - attachment
 *   - averageRate
 *   - follower
 * - CategoryID
 * - ThreadID
 */

let send = XMLHttpRequest.prototype.send;
let postsRes;
let postsURL = 'https://luminus.nus.edu.sg/v2/api/forum/Reply/';

/**
 * Doanload a dynamically generated file
 * @param {*} data 
 * @param {*} filename 
 * @param {*} type 
 */
function downloadFile(data, filename, type) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * Download all posts as a <del>csv</del>json file
 */
function downloadPosts() {
  const posts = postsRes.data;
  console.log('Downloading posts');
  let data = JSON.stringify(posts);
  downloadFile(data, 'posts.json', 'application/json');
}

/**
 * Add download button
 */
function addBtn(text, callback) {
  const btnNode = document.createElement('div');
  btnNode.setAttribute('id', 'lft-container');
  btnNode.innerHTML = '<button id="lft-btn">'
    + text
    + '</button>';
  document.body.appendChild(btnNode);
  document.getElementById("lft-btn").addEventListener(
    "click", callback, false
  );
}

// overload XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.send = function () {
  this.addEventListener('readystatechange', function () {
    if (this.responseURL.includes(postsURL) && this.readyState === 4) {
      console.log('Posts received!');
      postsRes = JSON.parse(this.responseText);
      if (postsRes.status === 'success') {
        // load download button
        addBtn(`Download (${postsRes.total})`, downloadPosts);
      }
    }
  }, false);
  send.apply(this, arguments);
};

// listen to url change
(function () {
  let oldURL = window.location.href;
  const detect = function () {
    if (oldURL != window.location.href) {
      if (oldURL.match(/https?:\/\/luminus.nus.edu.sg\/modules\/[-0-9a-f]*\/forum\/categories\/[-0-9a-f]*\/[-0-9a-f]*/i)) {
        const lftElem = document.getElementById('lft-container')
        if (lftElem) {
          console.log('Removing button');
          document.body.removeChild(lftElem);
        }
      }
      if (window.location.href.match(/https?:\/\/luminus.nus.edu.sg\/modules\/[-0-9a-f]*\/forum\/categories\/[-0-9a-f]*\/[-0-9a-f]*/i)) {
        console.log(`In forum thread: ${window.location.href}`);
      }
      oldURL = window.location.href;
    }
  };
  let check = window.setInterval(function () { detect() }, 500);
})();


GM_addStyle(`
    #lft-container {
        position:               absolute;
        bottom:                 5px;
        left:                   5px;
        opacity:                0.8;
        z-index:                2147483647;
    }
    #lft-btn {
        cursor:                 pointer;
        border:                 none;
        background:             SeaGreen;
        font-size:              20px;
        color:                  white;
        padding:                5px 5px;
        text-align:             center;
    }
`);