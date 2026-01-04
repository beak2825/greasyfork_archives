// ==UserScript==
// @name           Flickr - Go to User's Shots in this Group (Photo + User's Groups list Page) + Pool Interesting
// @version        2.5
// @description	   In the groups list of the Photo page or User's Groups Page, at each group name, Add an icon to go to user's shots posted in this group (by Interesting). Add too an icon to show Poll  by Interesting
// @icon           https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @namespace      https://greasyfork.org/users/8

// @match          http*://www.flickr.com/photos/*
// @match          http*://www.flickr.com/people/*/groups/*  // Match user groups page

// @author         decembre
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/508422/Flickr%20-%20Go%20to%20User%27s%20Shots%20in%20this%20Group%20%28Photo%20%2B%20User%27s%20Groups%20list%20Page%29%20%2B%20Pool%20Interesting.user.js
// @updateURL https://update.greasyfork.org/scripts/508422/Flickr%20-%20Go%20to%20User%27s%20Shots%20in%20this%20Group%20%28Photo%20%2B%20User%27s%20Groups%20list%20Page%29%20%2B%20Pool%20Interesting.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to add buttons on user's photo page
  function addButtons() {
    const useridElement = document.querySelector('.sub-photo-container.centered-content .attribution-view a.avatar');
    if (!useridElement) {
      console.log('User ID element not found. Retrying...');
      setTimeout(addButtons, 1000); // Retry after 1 second
      return;
    }

    const useridValue = useridElement.getAttribute('data-person-nsid');
    console.log('USERid trouvé :', useridValue);

    const groupidElements = document.querySelectorAll('.sub-photo-contexts-view .sub-photo-context.sub-photo-context-groups .context-list li');
    if (groupidElements.length === 0) {
      console.log('No group elements found. Retrying...');
      setTimeout(addButtons, 1000); // Retry after 1 second
      return;
    }

    groupidElements.forEach(function(groupidElement, index) {
      const groupidLink = groupidElement.querySelector('a');
      if (groupidLink) {
        const groupidValue = groupidLink.getAttribute('data-group-nsid');
        if (groupidValue) {
          const linkUrl = `https://www.flickr.com/groups/${groupidValue}/pool/${useridValue}/`;
                    const linkHtml = `<a href="${linkUrl}" class="GoToPool" style="display: inline-block; position: absolute; top: 0; right: 0; height: 15px; line-height: 15px; width: 15px; background-color: green; font-size: 10px; border-radius: 50%; text-align: center; padding: 1px; opacity: 0.5; transition: opacity 0.7s ease;" title="Voir les photos de l'utilisateur dans ce groupe">🔴</a>`;

          // Check if the button already exists
          const existingButton = groupidElement.querySelector('.GoToPool');
          if (!existingButton) {
            const linkElement = document.createElement('span');
            linkElement.innerHTML = linkHtml;
            groupidElement.appendChild(linkElement);
            console.log('Lien inséré dans le DOM pour le pool #' + (index + 1));
          }
        } else {
          console.log('Aucun attribut data-group-nsid trouvé dans l\'élément a');
        }
      } else {
        console.log('No anchor element found in groupidElement.');
      }
    });
  }

  // Function to add buttons on Groups list page
  function addButtonsToGroupsList() {
    const useridElement = document.querySelector('.fluid.html-person-groups-page-view .fluid-magic-subnav-view .fluid-subnav-shim .fluid-subnav.with-overflow-menu .subnav-content.fluid-centered .subnav-items-container ul.links.extraitems li#about.link a');
    if (!useridElement) {
      console.log('User ID element not found on Groups list page. Retrying...');
      setTimeout(addButtonsToGroupsList, 1000); // Retry after 1 second
      return;
    }

    const useridValue = useridElement.getAttribute('href').split('/people/')[1].split('/')[0];
    console.log('USERid trouvé sur la page des groupes :', useridValue);

     const groupidElements = document.querySelectorAll('.fluid.html-person-groups-page-view .sortable-table-view:not(:empty):first-of-type .sortable-table-wrapper table.with-avatar tbody tr:not(.header) td.show-after-locked > span.avatar + a');
    if (groupidElements.length === 0) {
      console.log('No group elements found on Groups list page. Retrying...');
      setTimeout(addButtonsToGroupsList, 1000);
      return;
    }

    groupidElements.forEach(function(groupidElement, index) {
      const groupidValue = groupidElement.getAttribute('href').split('/groups/')[1].split('/')[0];
      if (groupidValue) {
        const linkUrl = `https://www.flickr.com/groups/${groupidValue}/pool/${useridValue}/`;
        const linkHtml = `<a href="${linkUrl}" class="GoToPool" style="display: inline-block; position: absolute; top: 0; right: 0; height: 15px; line-height: 15px; width: 15px; background-color: green; font-size: 10px; border-radius: 50%; text-align: center; padding: 1px; opacity: 0.5; transition: opacity 0.7s ease;" title="Voir les photos de l'utilisateur dans ce groupe">🔴</a>`;

        // Check if the button already exists
        const existingButton = groupidElement.parentElement.querySelector('.GoToPool');
        if (!existingButton) {
          const linkElement = document.createElement('span');
          linkElement.innerHTML = linkHtml;
          groupidElement.parentElement.appendChild(linkElement);
          console.log('Lien inséré dans le DOM pour le groupe #' + (index + 1));
        }
      } else {
        console.log('Aucun attribut data-group-nsid trouvé dans l\'élément a');
      }
    });
  }

  // Function to modify the URL of the "Back to group" button
  function modifyBackToGroupUrl() {
    var backToGroupButton = document.querySelector('.photo-content-upper-container .entry-type.do-not-evict[href^="/groups/"]');
    if (backToGroupButton) {
      var url = backToGroupButton.getAttribute('href');
      var modifiedUrl = url.replace(/\|[^/]+/, '');
      backToGroupButton.setAttribute('href', modifiedUrl);
      console.log('URL du bouton "Back to group" modifiée :', modifiedUrl);
    }
  }

  modifyBackToGroupUrl();

  // Add style rules for the button hover effect
  var style = document.createElement('style');
  style.innerHTML = `
.GoToPool {
            display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      height: 15px;
      line-height: 15px;
      width: 15px;
      background-color: green;
      font-size: 10px;
      border-radius: 50%;
      text-align: center;
      padding: 1px;
      opacity: 0.5;
      transition: opacity 0.7s ease !important;
}
.GoToPool:hover {
    font-size: 8px !important;
    background-color: #b3ddb3 !important;
    opacity: 1 !important;
    transition: opacity 0.7s ease !important;
}
.GoToPool:visited {
    background-color: gold !important;
  }
/* GO TO POOL - USER - GROUP LIST  */
.fluid.html-person-groups-page-view .sortable-table-view:not(:empty):first-of-type .sortable-table-wrapper .GoToPool  {
    position: relative !important;
    display: inline-block;
    top: 0;
    right: 0;
    height: 15px;
    line-height: 15px;
    width: 15px;
}

/* POOL BY INTERESTING - TEST */
.sub-photo-contexts-view .sub-photo-context-groups .context-list li span:has(.search-pool-by-interesting) {
    position: absolute;
    display: block;
    float: left;
    left: 50px;
    top: -0.5vh;
    text-decoration: none;
    opacity: 0.5;
    z-index: 5000;
}
/* HOVER */
.sub-photo-contexts-view .sub-photo-context-groups .context-list li span:has(.search-pool-by-interesting):hover {
    opacity: 1 !important;
}`;
  document.head.appendChild(style);

  // Function to add "Search Pool by interesting" link
function addSearchPoolLink() {
  const poolElements = document.querySelectorAll('.sub-photo-contexts-view .sub-photo-context-groups .context-list li');
  if (poolElements.length === 0) {
    console.log('No pool elements found. Retrying...');
    setTimeout(addSearchPoolLink, 1000); // Retry after 1 second
    return;
  }

  poolElements.forEach(function(poolElement) {
    const poolIdValue = poolElement.getAttribute('data-context-id');
    if (poolIdValue) {
      const poolIdConverted = poolIdValue.replace('@', '%40');
      const linkUrl = `https://www.flickr.com/search/?group_id=${poolIdConverted}&sort=interestingness-desc&view_all=1&text=`;
      const linkHtml = `<a href="${linkUrl}" title="Search Pool by interesting" class="search-pool-by-interesting" style="display: inline-block; position: relative; top: 2px; margin-right: 5px;">👁️</a>`;

      // Check if the link already exists
      const existingLink = poolElement.querySelector('a[href^="https://www.flickr.com/search/?group_id"]');
      if (!existingLink) {
        const linkElement = document.createElement('span');
        linkElement.innerHTML = linkHtml;
        poolElement.insertBefore(linkElement, poolElement.querySelector('.avatar.group.thumbnail'));
        console.log('Search Pool link inserted for pool ID:', poolIdValue);
      }
    } else {
      console.log('No data-context-id attribute found in pool element.');
    }
  });
}

  // Wait for the DOM to be fully loaded before executing the script
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded. Running addButtons and addButtonsToGroupsList...');
    addButtons();
    addButtonsToGroupsList();
    addSearchPoolLink();
  });

  // Optionally, you can also set up a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        console.log('DOM changed, checking for buttons and search pool links...');
        addButtons();
        addButtonsToGroupsList();
        addSearchPoolLink();
      }
    });
  });

  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });
})();


