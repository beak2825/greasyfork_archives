// ==UserScript==
// @name         4chan Post Randomizer
// @namespace    http://www.4chan.org/
// @version      0.8
// @description  Adds a button that redirects to a random post on a random board
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368381/4chan%20Post%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/368381/4chan%20Post%20Randomizer.meta.js
// ==/UserScript==

function insertBefore(node, reference) {
  if (node && reference !== null) {
    reference.parentNode.insertBefore(node, reference);
    return true;
  } else {
    return false;
  }
}

function insertAfter(node, reference) {
  if (reference !== null) {
    if (reference.nextSibling) {
      return insertBefore(node, reference.nextSibling);
    } else {
      return node && reference.parentNode.appendChild(node);
    }
  } else {
    return false;
  }
}

// use fancy mobile-like buttons on 4chan X, simple HTML form button otherwise
var is_4chanx = document.documentElement.classList.contains('fourchan-x');
if (is_4chanx) {
  var randomizer_button = document.createElement('a');
  randomizer_button.classList.add('qr-link');
  // dummy href like original button
  randomizer_button.href = 'javascript:;';
  var randomizer_container = document.createElement('div');
  randomizer_container.classList.add('qr-link-container');
  // always force visible (Onee-Chan hides the quicklink by default)
  randomizer_container.style['display'] = 'block';
  // no extra margins please
  randomizer_container.appendChild(randomizer_button);
} else {
  var randomizer_button = document.createElement('button');
  randomizer_button.style['display'] = 'block';
  randomizer_button.style['margin-left'] = 'auto';
  randomizer_button.style['margin-right'] = 'auto';
  randomizer_button.style['margin-bottom'] = '8px';
  randomizer_button.style['font-family'] = 'inherit';
  var randomizer_container = randomizer_button;
}
randomizer_button.setAttribute('id', 'throwthedice');
randomizer_button.appendChild(document.createTextNode('Go to Random Post'));
// insert below blotter, or the full-width <hr> on /f/, or "Back to (board)" link on the 404 page
if (location.pathname.startsWith('/f/')) {
  if (!insertAfter(randomizer_container, document.querySelector('form[name="post"]'))) {
    console.log('Could not find insertion anchor on /f/!');
    return;
  }
// hehe, lambda bracket mayhem
} else if ((() => {
  var boxbar = document.querySelector('div.boxbar > h2');
  return boxbar !== null && (boxbar.textContent === '404 Not Found' ||
                             boxbar.textContent === '403 Forbidden')})()) {
  var insert_parent = document.querySelector('.boxcontent');
  if (insert_parent !== null && insertAfter(randomizer_container, insert_parent.lastChild)) {
    // 4chan X does not apply styles to error pages
    if (is_4chanx) {
      randomizer_container.classList.remove('qr-link-container');
      randomizer_container.style['text-align'] = 'center';
      // DOM functions not invented here, or at least one reason to keep insertBefore around :P
      insertBefore(document.createTextNode('['), randomizer_container.firstChild);
      insertAfter(document.createTextNode(']'), randomizer_container.lastChild);
    }
  } else {
    console.log('Could not find insertion anchor on error page!');
    return;
  }
// native catalog -- 4chan X catalog mode behaves like index page
} else if (location.pathname.endsWith('/catalog')) {
  if (!insertAfter(randomizer_container, document.querySelector('body > form'))) {
    console.log('Could not find insertion anchor on catalog!');
    return;
  }
} else {
  if (!insertAfter(randomizer_container, document.querySelector('body > hr.aboveMidAd'))) {
    console.log('Could not find insertion anchor on board!');
    return;
  }
}

randomizer_button.addEventListener('click', function() {
  randomizer_button.textContent = 'Picking random board...';
  var xhr = new XMLHttpRequest();
  // cascaded re-use of the XMLHttpRequest for the board list, catalog and thread
  xhr.open('GET', '//a.4cdn.org/boards.json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.getResponseHeader("Content-Type") == "application/json") {
      var boards = JSON.parse(xhr.response)['boards'].map(b => b.board);
      var random_board = boards[Math.floor(boards.length * Math.random())];
      randomizer_button.textContent = 'Picking random thread on /' + random_board + '/...';
      xhr.open('GET', '//a.4cdn.org/' + random_board + '/catalog.json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.getResponseHeader("Content-Type") == "application/json") {
          var threads = JSON.parse(xhr.response).map(page => page['threads'].map(thread => thread['no'])).reduce((p1, p2) => p1.concat(p2), []).slice(-150);
          var random_thread = threads[Math.floor(threads.length * Math.random())];
          randomizer_button.textContent = 'Picking random post in thread...';
          xhr.open('GET', '//a.4cdn.org/' + random_board + '/thread/' + random_thread + '.json');
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.getResponseHeader("Content-Type") == "application/json") {
              var posts = JSON.parse(xhr.response)['posts'].map(p => p.no);
              var redirect_link = '//boards.4chan.org/' + random_board + '/thread/' + random_thread;
              var post_index = Math.floor(posts.length * Math.random());
              if (post_index > 0) {
                redirect_link += '#p' + posts[post_index];
              }
              randomizer_button.textContent = 'Off we go!';
              location.href = redirect_link;
            }
          };
          xhr.send();
        }
      };
      xhr.send();
    }
  };
  xhr.send();
});