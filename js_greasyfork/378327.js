// ==UserScript==
// @namespace Planetsuzy
// @name Planetsuzy Threads - Auto fold posts
// @description This script will automatically fold some of the forum posts based on their content
// @version 1.3.1
// @license MIT
// @icon http://ps.fscache.com/styles/style1/images/statusicon/forum_old.gif
// @include /^https?://(www\.)?planetsuzy\.org/showthread\.php/
// @include /^https?:\/\/(www\.)?planetsuzy\.org\/t\d+[\w-]+\.html$/
// @require https://cdnjs.cloudflare.com/ajax/libs/autolinker/1.8.3/Autolinker.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378327/Planetsuzy%20Threads%20-%20Auto%20fold%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/378327/Planetsuzy%20Threads%20-%20Auto%20fold%20posts.meta.js
// ==/UserScript==

const decoratePosts = function() {

  /**
   * Posts containing only links from these domains will be less visible (values stored in settings).
   */
  const blacklistedDomains = GM_getValue('blacklistedDomains', []);

  /**
   * Returns two top levels of the URL's hostname.
   */
  const parseDomain = function (href) {
    return new URL(href, document.location).hostname.split('.').slice(-2).join('.');
  };

  /**
   * Returns 'inner' URL if it wrapped by a link anonymizer.
   */
  const unwrapUrl = function (href) {
    const baseUrl = new URL(href, document.location);
    if (baseUrl.pathname === '/' && baseUrl.search.length > 1) {
      const innerParam = baseUrl.search.slice(1);
      try {
        new URL(innerParam);
        return innerParam;
      } catch (e) {}
    }
    return href;
  };

  /**
   * Store domain of current document for later.
   */
  const documentDomain = parseDomain(document.location.href);

  /**
   * Class representing list of links in each post message sorted by link domains.
   */
  class LinksList {
    constructor() {
      this.links = {};
    }
    add(href) {
      let domain;
      try {
        domain = parseDomain(unwrapUrl(href));
      } catch (e) {
        // Invalid link, ignore.
        return;
      }
      // Local links ignored.
      if (domain !== documentDomain) {
        if (!(domain in this.links)) {
          this.links[domain] = [];
        }
        this.links[domain].push(href);
      }
    }
    get domains() {
      return Object.keys(this.links);
    }
  };

  /**
   * Class representing lists of elements linked with a tag such as a domain name
   * with a function to change multiple elements appearance at once.
   */
  class TaggedElementsList {
    constructor(decoratorFn) {
      this.elements = {};
      this.decoratorFn = decoratorFn;
    }
    addElement(tag, element) {
      if (this.elements[tag] === undefined) {
        this.elements[tag] = [];
      }
      this.elements[tag].push(element);
    }
    filter(tag, fn) {
      if (this.elements[tag] === undefined) {
        return [];
      }
      return this.elements[tag].filter(fn);
    }
    decorateElement(element) {
      const args = Array.from(arguments).slice(1);
      this.decoratorFn.apply(element, args);
    }
    decorateElements(tag) {
      const args = Array.from(arguments).slice(1);
      const that = this;
      this.elements[tag].forEach(function (element) {
        that.decoratorFn.apply(element, args);
      });
    }
  };

  const domainSwitches = new TaggedElementsList(function (isBlacklisted) {
    this.style.fontWeight = isBlacklisted ? 'normal' : 'bold';
    this.style.textDecoration = isBlacklisted ? 'line-through' : 'none';
  });
  const expandToggles = new TaggedElementsList(function (makeVisible) {
    const needTriggerClick = (makeVisible === true && this.getAttribute('data-initial-state') === '0' && this.getAttribute('data-state') === '0')
      || (makeVisible === false && this.getAttribute('data-initial-state') === '0' && this.getAttribute('data-state') === '1');
    if (needTriggerClick) {
      this.click();
    }
  });
  const refreshLabels = new TaggedElementsList(function (makeVisible) {
    this.style.display = makeVisible ? 'inline' : 'none';
  });

  document.querySelectorAll('table[id^=post]')
    .forEach(function (post) {
      // Find messages in thread and examine them for any links.
      const postId = post.getAttribute('id').substring(4);
      const message = post.querySelector('[id^=post_message_]');
      if (message) {
        const links = new LinksList();
        // Find anchors in post message.
        Array.from(message.querySelectorAll('a[href]'))
          .filter(function(link) {
            // Function to determine whether the image element inside anchor can be excluded due to not being a file hoster link.
            const canExcludeImage = function (image) {
              const parseUrlSegments = function (href) {
                // Returns URL pathname except the file name.
                return new URL(href, document.location).pathname.substring(1).split('/').slice(0, -1);
              };
              const isWorthlessLink = function (href) {
                const url = new URL(href, document.location);
                return (url.pathname.length === 1 && url.search.length <= 1)  // href is to website root URL
                  || url.hostname.indexOf('.') === -1;                        // hostname is TLD
              };
              const imageSrc = image.getAttribute('src');
              try {
                const linkHref = unwrapUrl(link.getAttribute('href'));
                const linkDomain = parseDomain(linkHref);
                return isWorthlessLink(linkHref)                                   // exclude if linked to the root of a website ("worthless link")
                  || [linkDomain, documentDomain].includes(parseDomain(imageSrc))  // exclude if same domain or local image
                  || parseUrlSegments(imageSrc).includes(linkDomain);              // exclude if link domain is contained in URL (eg. 3rd part CDN used for previews)
              } catch (e) {
                return false;  // invalid link, exclude for sure
              }
            };
            // Exclude images inside anchors if images hostnames match anchors hostnames (previews) or local images.
            // May cause false positives when download link contains an image (eg icon) of a file hoster directly from its domain name.
            const images = link.querySelectorAll('img');
            if (images.length) {
              const hostnamesExcluded = Array.from(images)
                .reduce(function (acc, cur) { return acc && canExcludeImage(cur) }, true);
              return !hostnamesExcluded;
            }
            return true;
          })
          .forEach(function(link) {
            const deemphasise = function (element) {
              element.style.opacity = '0.2';
            };
            const href = link.getAttribute('href').toString();
            links.add(href);
            try {
              if (blacklistedDomains.includes(parseDomain(unwrapUrl(href)))) {
                deemphasise(link);
              }
            } catch (e) {
              if (link.querySelectorAll('*').length === 0) {
                deemphasise(link);  // invalid link containing no other elements such as image previews, deemphasise for sure
              }
            }
          });
        // Additionally, parse links in 'pre' elements.
        message.querySelectorAll('pre')
          .forEach(function (pre) {
            Autolinker.parse(message.innerHTML, {urls: true})
              .forEach(function (match) {
                links.add(match.getUrl());
              });
          });

        // Set up additional elements.
        const postCountElement = post.querySelector('#postcount' + postId);
        const postAnchorElement = post.querySelector('a[name=' + post.getAttribute('id') + ']');
        const hasBlacklistedLinks = links.domains.length && !links.domains.filter(function (domain) { return !blacklistedDomains.includes(domain) }).length;
        const contentRemoved = message.innerText.replace(/Removed at request of claimed rights holder/, '').length < 10;
        const hiddenPost = hasBlacklistedLinks || contentRemoved;

        // Collapse/reveal post toggle switches.
        postCountElement.parentElement.prepend((function () {
          const labels = ['►', '▼'];
          const initialState = hiddenPost ? 0 : 1;
          const el = document.createElement('a');
          el.innerHTML = labels[1];
          el.setAttribute('data-state', 1);
          el.setAttribute('data-initial-state', initialState);
          el.style.cursor = 'pointer';
          el.addEventListener('click', function (e) {
            const newState = (parseInt(el.getAttribute('data-state')) + 1) % labels.length;
            Array.from(postCountElement.closest('tbody').querySelectorAll(':scope > tr'))
              .filter(function (row) { return row !== postCountElement.closest('tr') })
              .forEach(function (row) { row.style.display = newState ? 'table-row' : 'none' });
            post.parentElement.querySelectorAll('#post_thanks_box_' + postId)
              .forEach(function (row) { row.style.display = newState ? 'block' : 'none' });
            
            el.innerHTML = labels[newState];
            el.setAttribute('data-state', newState);
          });
          if (!initialState) {
            el.click();
          }
          expandToggles.addElement('a', el);
          return el;
        })());

        // Refresh label that shows up to indicate that a refresh is needed to apply changes.
        postCountElement.parentElement.prepend((function () {
          const el = document.createElement('a')
          el.innerHTML = 'F5 ⟳';
          el.classList.add('post-thead-label');
          el.classList.add('button');
          el.style.cursor = 'pointer';
          el.addEventListener('click', function () {
            window.location.reload();
          });
          refreshLabels.addElement('F5', el);
          refreshLabels.decorateElement(el, false);
          return el;
        })());

        // Domain name toggle switches.
        postCountElement.parentElement.prepend((function () {
          const el = document.createElement('span');
          if (hiddenPost) {
            el.appendChild(document.createTextNode('⚠️ '));
          }
          links.domains.forEach(function (domain, i) {
            const ch = document.createElement('span');
            ch.innerHTML = domain;
            ch.style.cursor = 'pointer';
            ch.addEventListener('click', function () {
              // Update domains blacklist property and redecorate elements.
              const oldBlacklist = GM_getValue('blacklistedDomains', []);
              const wasBlacklisted = oldBlacklist.includes(domain);
              const newBlacklist = wasBlacklisted
                ? oldBlacklist.filter(function (value) { return value !== domain})
                : oldBlacklist.concat([domain]);
              domainSwitches.decorateElements(domain, !wasBlacklisted);
              GM_setValue('blacklistedDomains', newBlacklist);
              const needRefresh = blacklistedDomains.length !== newBlacklist.length
                || blacklistedDomains.filter(function(a) { return newBlacklist.indexOf(a) === -1; }).length;
              refreshLabels.decorateElements('F5', needRefresh);
            });
            el.appendChild(ch);
            el.appendChild(document.createTextNode(i < links.domains.length - 1 ? ', ' : ' '));
            domainSwitches.addElement(domain, ch);
            domainSwitches.decorateElement(ch, blacklistedDomains.includes(domain));
          });
          return el;
        })());

        // Mark linked post.
        if (document.location.hash.slice(1) === post.getAttribute('id')) {
          post.classList.add('thread-tools-linked-post');
          postAnchorElement.parentElement.appendChild((function () {
            const label = document.createElement('div');
            const container = document.createElement('div');
            label.classList.add('thread-tools-linked-post-id-label');
            label.innerHTML = '#' + post.getAttribute('id');
            container.classList.add('thread-tools-linked-post-id-label-container');
            container.appendChild(label);
            return container;
          })());
        }

        if (contentRemoved) {
          // Refresh label that shows up to indicate that a refresh is needed to apply changes.
          postCountElement.parentElement.prepend((function () {
            const el = document.createElement('span')
            el.innerHTML = 'Removed';
            el.classList.add('post-thead-label');
            el.classList.add('removed');
            return el;
          })());
        }
      }
    });

  // Toggle buttons for multiple posts at once.
  const threadToolsMenu = document.querySelector('#threadtools_menu tbody');
  if (threadToolsMenu !== null) {
    const createThreadToolsMenuElement = function (autoFoldedElements, caption, nothingCaption) {
      const labels = ['►', '▼'];
      const tr = document.createElement('tr');
      tr.setAttribute('data-feature-multi-toggle', true);
      const td = document.createElement('td');
      const toggle = document.createElement('a');
      toggle.innerHTML = caption;
      const icon = document.createElement('span');
      icon.innerHTML = labels[0];
      icon.style.padding = '0 .7em';
      const onMouseOver = function () {
        td.setAttribute('class', 'vbmenu_hilite vbmenu_hilite_alink');
        td.style.cursor = 'pointer';
      };
      const onMouseOut = function () {
        td.setAttribute('class', 'vbmenu_option vbmenu_option_alink');
        td.style.cursor = 'default';
      };
      onMouseOut();
      if (autoFoldedElements.length) {
        td.addEventListener('mouseover', onMouseOver);
        td.addEventListener('mouseout', onMouseOut);
        toggle.setAttribute('data-state', 0);
        toggle.addEventListener('click', function () {
          const newState = (parseInt(toggle.getAttribute('data-state')) + 1) % labels.length;
          autoFoldedElements.forEach(function (el) {
            expandToggles.decorateElement(el, newState === 1);
          });
          toggle.setAttribute('data-state', newState);
          icon.innerHTML = labels[newState];
        });
        const threadToolsButton = document.querySelector('#threadtools');
        if (threadToolsButton !== null) {
          threadToolsButton.classList.add('thread-tools-have-additions')
        }
      } else {
        toggle.innerHTML += ' (' + nothingCaption + ')';
        toggle.style.opacity = '0.7';
      }
      toggle.prepend(icon);
      td.appendChild(toggle);
      tr.appendChild(td);
      return tr;
    };

    threadToolsMenu.appendChild(createThreadToolsMenuElement(
      expandToggles.filter('a', function (element) {
        return element.getAttribute('data-initial-state') === '0';
      }),
      'Toggle all auto-hidden posts',
      'nothing hidden'
    ));

    threadToolsMenu.appendChild(createThreadToolsMenuElement(
      expandToggles.filter('a', function (element) {
        if (element.getAttribute('data-initial-state') === '0') {
          const statusImage = element.closest('tr').querySelector('td a[name^=post] img.inlineimg');
          if (statusImage !== null) {
            return statusImage.getAttribute('alt') === 'Unread';
          }
        }
        return false;
      }),
      'Toggle unread auto-hidden posts',
      document.querySelector('a[name=newpost]') !== null ? 'nothing hidden' : 'no unread posts',
    ));

    // New feature notifier.
    const isMultiToggleNewFeature = GM_getValue('featureMultiToggleSeen', false);
    if (isMultiToggleNewFeature === false) {
      const threadToolsButton = document.querySelector('#threadtools');
      if (threadToolsButton !== null) {
        threadToolsMenu.querySelectorAll('tr[data-feature-multi-toggle]').forEach(function (tr) {
          const el = document.createElement('span')
          el.innerHTML = 'new';
          el.classList.add('post-thead-label');
          tr.querySelector(':scope > td').appendChild(el);
        });
        threadToolsButton.addEventListener('click', function () {
          GM_setValue('featureMultiToggleSeen', true);
          if (threadToolsButton.classList.contains('thread-tools-have-additions-feature')) {
            threadToolsButton.classList.remove('thread-tools-have-additions-feature');
          }
        });
        if (threadToolsButton.classList.contains('thread-tools-have-additions')) {
          threadToolsButton.classList.add('thread-tools-have-additions-feature')
        }
      }
    }
  }
};

GM_addStyle(`
  @-webkit-keyframes BackgroundPositionAnimation {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  @-moz-keyframes BackgroundPositionAnimation {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  @keyframes BackgroundPositionAnimation {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  .thread-tools-have-additions {
    background: #2c539e;
    transition: background 300ms linear;
  }
  .thread-tools-have-additions-feature {
    background: linear-gradient(270deg, #f2a304, #314ff5);
    background-size: 400% 400%;
    -webkit-animation: BackgroundPositionAnimation 30s ease infinite;
    -moz-animation: BackgroundPositionAnimation 30s ease infinite;
    animation: BackgroundPositionAnimation 30s ease infinite;
  }
  .post-thead-label {
    background: white;
    border-radius: 1px;
    color: #0b198c;
    font-weight: bold;
    margin: 0 3px;
    padding: 1px 3px;
  }
  .post-thead-label.removed {
    color: white;
    background: red;
  }
  .thead .post-thead-label.button:hover {
    color: #0b198c;
  }
  .thread-tools-linked-post {
    border-width: 2px;
    margin: -2px;
    width: calc(100% + 4px);
  }
  .thread-tools-linked-post-id-label  {
    background: #0B198C;
    margin-top: -7px;
    cursor: default;
    padding: 3px;
  }
  .thread-tools-linked-post-id-label-container {
    display: none;
    margin-left: 15px;
    vertical-align: top;
  }
  .thread-tools-linked-post-id-label-container + .thread-tools-linked-post-id-label-container {
    margin-left: 2px;
  }
  .thread-tools-linked-post:hover .thread-tools-linked-post-id-label-container {
    display: inline-block;
  }
`);

decoratePosts();
