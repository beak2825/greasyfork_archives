// ==UserScript==
// @name        Twitter Lists Sidebar
// @description Show your Twitter Lists in sidebar
// @version     0.3
// @grant       GM.xmlHttpRequest
// @include     https://twitter.com/*
// @namespace https://greasyfork.org/users/173161
// @downloadURL https://update.greasyfork.org/scripts/39220/Twitter%20Lists%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/39220/Twitter%20Lists%20Sidebar.meta.js
// ==/UserScript==

// Note: Avoid using jQuery as it may not be avialble on page load yet
(function(){
  // Cache data using localStorage or sessionStorage
  // class definion have to be placed before its usage
  class Cache {
    constructor(){
      // Key name prefix. Avoid clashes with Twitter itself
      this.prefix = 'lists-sidebar:';
      // Use sessionStorage or localStorage
      this.storage = window.sessionStorage;
    }
    get(name) {
      return this.storage.getItem(this.prefix + name);
    }
    set(name, value) {
      return this.storage.setItem(this.prefix + name, value);
    }
    clear() {
      for (let key in this.storage) {
        if (key.indexOf(this.prefix) === 0) {
          this.storage.removeItem(key);
        }
      }
    }
  }

  let usernameTag = document.querySelector('.DashUserDropdown-userInfo .username b');
  const username = usernameTag && usernameTag.innerText;
  // Not login
  if (!username) {
    return;
  }

  const cache = new Cache();
  // Clear cache if user changed
  if (cache.get('username') && cache.get('username') !== username) {
    cache.clear();
  }

  let sidebar;

  // Execute once on page load
  pageChanged();
  // Poll to detect page navigation.
  // Twitter.com is an SPA and thus document ready event is only fired once.
  // history.onpopstate event is not reliable as history.pushState does not trigger it
  let currentPathname = location.pathname;
  setInterval(function(){
    if (location.pathname !== currentPathname) {
      currentPathname = location.pathname;
      pageChanged();
    }
  }, 300);

  function ajaxRequest(url, callback) {
    // "Referer" header is required for the request to succeed,
    // but native XMLHttpRequest does not alllow to set this header
    // https://wiki.greasespot.net/GM.xmlHttpRequest
    GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      timeout: 3000,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://twitter.com/',
        'X-Push-State-Request': 'true',
        'X-Twitter-Active-User': 'yes',
        'X-Requested-With': 'XMLHttpRequest',
      },
      onload: function(details) {
        callback(JSON.parse(details.responseText).page.replace(/\\n|\\/g, ''));
      },
      onerror: function() {
        callback(null);
      },
      ontimeout: function() {
        callback(null);
      }
    });
  }

  // Retrive lists by requesting lists page and parsing returned HTML
  function retriveLists(username, callback) {
    const pattern = /<a class="ProfileListItem-name[^>]*href="([^"]+)">([^<]*)<\/a>/g;
    ajaxRequest(
      'https://twitter.com/' + username + '/lists',
      function(html) {
        if (!html) {
          return;
        }
        let lists = [];
        let match = null;
        while (match = pattern.exec(html)) {
          lists.push({
            url: match[1],
            name: match[2],
          });
        }
        // Sort by name
        lists.sort(function(a, b){
          return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
        });
        callback && callback(lists.length > 0 ? lists : null);
      }
    );
  }

  function createSidebar(lists) {
    if (!lists || !lists.length) {
      return;
    }
    sidebar = document.createElement('sidebar');
    sidebar.id = 'lists-sidebar';
    // Reuse existing style for consistent color and backgroud-color
    sidebar.className = 'DashboardProfileCard'

    let title = document.createElement('h3');
    title.innerHTML = 'Lists';
    sidebar.appendChild(title);

    let ul = document.createElement('ul');
    ul.id = 'sidebar-lists';
    sidebar.appendChild(ul);

    for (let i = 0; i < lists.length; i++) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.className = 'js-nav u-textUserColor';
      a.href = lists[i].url;
      a.innerHTML = lists[i].name;
      li.appendChild(a);
      ul.appendChild(li);
    }

    document.body.appendChild(sidebar);
    addSidebarStyle();
  }

  function addSidebarStyle() {
    if (document.getElementById('lists-sidebar-style')) {
      return;
    }
    let style = document.createElement('style');
    style.id = 'lists-sidebar-style';
    style.innerHTML = `
      #lists-sidebar {
        position: fixed;
        left: 20px;
        top: 30%;
        padding: 1em 1.5em;
        line-height: 1.5;
        z-index: 1000000;
      }

      #lists-sidebar h3 {
        margin-bottom: 0.5em;
        text-align: center;
      }

      #lists-sidebar ul {
        margin: 0;
        padding: 0;
        list-style-type: disc;
        list-style-position: inside;
      }
    `;
    document.head.appendChild(style);
  }

  function updateSidebar() {
    // Cache only valid for 10 minutes
    let lastUpdate = cache.get('lastUpdate');
    if (lastUpdate && new Date() - new Date(lastUpdate) > 600000) {
      cache.clear();
      removeSidebar();
    }

    // Already exists and do not need to update
    if (sidebar) {
      return;
    }

    let lists = JSON.parse(cache.get('lists'));
    if (lists) {
      createSidebar(lists);
    } else {
      retriveLists(username, function(lists) {
        if (lists && lists.length > 0) {
          cache.set('lists', JSON.stringify(lists));
          cache.set('username', username);
          cache.set('lastUpdate', new Date().toString());
          createSidebar(lists);
        }
      });
    }
  }

  function removeSidebar() {
    if (sidebar) {
      sidebar.remove();
      sidebar = null;
    }
  }

  // Create or remove sidebar when page changed
  // Only show sidebar on homepage and lists related pages
  function pageChanged() {
    if (location.pathname === '/' || /^\/[^/]+\/lists/.test(location.pathname)) {
      updateSidebar();
    } else {
      removeSidebar();
    }
  }
}());
