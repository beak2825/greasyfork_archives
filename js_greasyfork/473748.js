// ==UserScript==
// @name         Whova Session Streamlined
// @namespace    https://github.com/amclark42/whova-session-streamlined
// @version      1.1
// @description  Remove obtrusive elements of a Whova browser session
// @author       Ash Clark
// @match        https://whova.com/portal/webapp/*
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/473748/Whova%20Session%20Streamlined.user.js
// @updateURL https://update.greasyfork.org/scripts/473748/Whova%20Session%20Streamlined.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log("Userscript loaded.");
  
  /* Create an internal CSS stylesheet for this page. */
  let addStyles = function () {
    var css, styles = '';
    css = document.createElement('style');
    styles += ".no-notify .small-red-dot, .no-notify .notification-circle,\n"
      + ".no-notify .red-tag.solid-tag { display: none; }\n";
    styles += ".btn-toggle { padding: 1em 0.5em; }\n";
    styles += ".btn-toggle:hover, .btn-toggle:focus { background-color: #cde }\n";
    styles += ".btn-toggle svg { margin: 0 0.5em; }\n";
    styles += ".whova-side-navigation-menu.collapsed { min-width:unset; width: auto; }\n"
    styles += ".collapsed.whova-side-navigation-menu #whova-side-navigation-base-section, "
      + ".collapsed.whova-side-navigation-menu #whova-side-nav-scroll { display:none; }\n"
    styles += ".main-content .page-content { flex: 1 1 90%; width: auto; }\n";
    styles += ".session-media-hub-video-player #session-video-iframe, .session-media-hub-video-player .session-external-player-wrapper"
      + "{ height: 80vh; }";
    styles += ".agendav3-session-details-page-container .agenda-v3-compact-boards-container" 
      + "{ min-width: fit-content; }\n";
    styles += ".tab-list-container { min-width: 350px; }\n";
    styles += ".collapsed.tab-list-container { min-width: unset; }\n";
    styles += ".collapsed.tab-list-container .tabs { flex-direction: column; }\n";
    styles += ".collapsed.tab-list-container .tab-panel-container { display: none; }\n";
    /* Add CSS styles to <head>. */
    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(css);
  };
  // END addStyles()
  
  /* Recreate a SVG icon from Bootstrap:
      https://icons.getbootstrap.com/icons/signpost-split/ */
  const expandIcon = function () {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttributeNS(null, 'width', 16);
    svg.setAttributeNS(null, 'height', 16);
    svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
    svg.setAttributeNS(null, 'fill', 'currentColor');
    title.appendChild(document.createTextNode('Toggle site navigation'));
    path.setAttributeNS(null, 'd', 
      'M7 7V1.414a1 1 0 0 1 2 0V2h5a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L14.8 5.6a1 1 0 0 1-.8.4H9v10H7v-5H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7h5zm1 3V8H2l-.75 1L2 10h6zm0-5h6l.75-1L14 3H8v2z');
    svg.appendChild(title);
    svg.appendChild(path);
    return svg;
  };
  // END expandIcon()
  
  /* Test a location pathname to determine if the current page is a Whova session. */
  let isSessionPage = function(page) {
    var regex = /\/portal\/webapp\/[\w_]+\/Agenda\/\w+/g;
    return regex.test(page);
  };
  // END isSessionPage()
  
  /* Tweak the DOM, set up styles, create event listeners. */
  let onLoad = function() {
    var sidebarNav, collapseBtnSide,
        pageNow, pagePrev, sessionModded,
        mutationOptions, mutationObserver;
    pageNow = window.location.pathname;
    pagePrev = pageNow;
    /* Clone the base toggle button for other uses. */
    collapseBtnSide = document.createElement('button');
    collapseBtnSide.classList.add('btn-toggle');
    /* Prepare the left-hand sidebar. */
    sidebarNav = document.getElementsByClassName('whova-side-navigation-menu');
    collapseBtnSide.setAttribute('id', 'toggle-sidenav');
    collapseBtnSide.addEventListener('click', toggleCollapse);
    collapseBtnSide.appendChild(expandIcon());
    /* Add custom CSS rules before directly modifying the DOM. */
    addStyles();
    if ( sidebarNav.length > 0 ) {
      sidebarNav = sidebarNav[0];
      try {
        sidebarNav.prepend(collapseBtnSide);
      } catch (err) {
        console.warn("Could not modify the sidebar nav.");
      }
    }
    /* Only modify the session page if the first page IS the session page. */
    if ( isSessionPage(pageNow) ) {
      updateSessionNav();
    }
    /* Monitor changes to the page, since Whova doesn't fully reload the page when 
      navigating around. */
    mutationObserver = new MutationObserver( function(records) {
      pageNow = window.location.pathname;
      if ( pageNow !== pagePrev ) {
        pagePrev = pageNow;
        console.log("Whova site navigated to new page: "+pageNow);
        if ( isSessionPage(pageNow) ) {
          console.log("Navigated to a Whova session.");
          sessionModded = false;
        }
      }
      /* Make sure that the session tabs navbar has been loaded before making any 
        changes. */
      if ( isSessionPage(pageNow) && !sessionModded
            && document.getElementsByClassName('tab-list-container').length > 0 ) {
        /* Wait a bit before modifying the session navbar. */
        setTimeout( function() { 
          if ( !sessionModded ) {
            sessionModded = true;
            console.log("Modifying the session navbar.");
            /* There is a possibility that updateSessionNav() will not have worked. 
              If so, sessionModded will be re-set and a future mutation may have 
              better luck. */
            sessionModded = updateSessionNav();
          }
        }, 300);
      }
    });
    // The kinds of observations to make.
    mutationOptions = { childList: true, subtree: true };
    mutationObserver.observe(document, mutationOptions);
  };
  // END onLoad()
  
  /* When a button is clicked to toggle a sidebar, try to toggle the 'collapsed' 
    class on the button's parent. */
  let toggleCollapse = function(event) {
    var container = event.target;
    if ( container.nodeName === "BUTTON" ) {
      container = container.parentElement;
    } else if ( container.nodeName === 'svg' ) {
      container = container.parentElement.parentElement;
    } else if ( container.nodeName === 'path' ) {
      container = container.parentElement.parentElement.parentElement;
    } else {
      console.warn(container.nodeName);
      return;
    }
    //console.log(container);
    container.classList.toggle('collapsed');
  };
  // END toggleCollapse()
  
  /* When one of the visible tabs is clicked on the right, open the sidebar. */
  let toggleCollapseIncidentally = function() {
    document.getElementsByClassName('tab-list-container')[0].classList.toggle(
      'collapsed', false);
  };
  // END toggleCollapseIncidentally()
  
  /* Use a class to prevent notifications from showing up. */
  let toggleNotifications = function() {
    document.getElementsByTagName('body')[0].classList.toggle('no-notify');
  };
  // END toggleNotifications()
  
  /* Prepare the right-hand sidebar inside a Whova session. Returns a boolean 
    indicating whether modifications have been successfully made. */
  let updateSessionNav = function() {
    var tabListNav, collapseBtnTab, notifyBtn;
    try {
      collapseBtnTab = document.createElement('button');
      collapseBtnTab.classList.add('btn-toggle');
      notifyBtn = collapseBtnTab.cloneNode(true);
      tabListNav = document.getElementsByClassName('tab-list-container');
      /* Make sure the tabs nav is available before making changes. */
      if ( tabListNav.length > 0 ) {
        tabListNav = tabListNav[0];
        tabListNav.classList.add('collapsed');
      } else {
        /* If there's nothing in the DOM we can augment, return early. */
        return false;
      }
      collapseBtnTab.setAttribute('id', 'toggle-tablist');
      collapseBtnTab.addEventListener('click', toggleCollapse);
      collapseBtnTab.appendChild(document.createTextNode("Toggle sidebar"));
      notifyBtn.appendChild(document.createTextNode("Toggle notifications"));
      notifyBtn.addEventListener('click', toggleNotifications);
      /* Add new elements to the page. */
      tabListNav.prepend(notifyBtn);
      tabListNav.prepend(collapseBtnTab);
      /* Make sure that clicking a tab in the right-hand nav will toggle the sidebar 
        open. */
      document.querySelectorAll('.tabs .tab-btn').forEach( function(btn) {
        btn.addEventListener('click', toggleCollapseIncidentally);
      });
    } catch (err) {
      /* Report the error in the console but recover from it. */
      console.warn(err);
      console.log("Userscript recovering.")
      return false;
    }
    return true;
  };
  // END updateSessionNav()
  
  /* Whova keeps loading content after the page is "complete". As such, we wait a 
    bit before running this userscript. */
  if (document.readyState == 'complete') {
    setTimeout(function() { onLoad(); }, 2500);
  } else {
    // Wait until page has loaded, then wait a bit more.
    window.addEventListener('load',function() {
      setTimeout(function() { onLoad(); }, 2500);
    });
  }
  
})();