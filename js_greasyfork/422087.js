// ==UserScript==
// @name         FuckShortenedUrl
// @namespace    https://greasyfork.org/en/users/173996-wtfjs
// @version      0.25
// @description  Replace shortened URLs with real URLs
// @author       wtfjs
// @license      MIT
// @run-at       document-start
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422087/FuckShortenedUrl.user.js
// @updateURL https://update.greasyfork.org/scripts/422087/FuckShortenedUrl.meta.js
// ==/UserScript==

;(function __FuckShortenedUrl() {
  "use strict";
  var utils = {
    $: function $(selector, parent) {
      var _parent = parent || document
      return _parent.querySelector(selector)
    },

    $$: function $$(selector, parent) {
      var _parent = parent || document
      return _parent.querySelectorAll(selector)
    },

    forEachRight: function forEachRight(arr, fn) {
      for (var i = (arr.length >>> 0) - 1; i >= 0; i -= 1) {
        var it = arr[i]
        var res = fn(it, i, arr)
        if (res === false) {
          break;
        }
      }
    },

    concurrent: function concurrent(job) {
      var dispatch = window.requestIdleCallback || window.requestAnimationFrame || window.setTimeout
      dispatch(job)
    },

    isElement: function isElement(any) {
      return typeof any === "object" && any.nodeType === 1 // Node.ELEMENT_NODE
    },

    getSearchParams: function getSearchParams(urlStr) {
      try {
        return new URL(urlStr).searchParams
      } catch (e) {}
      return null
    },

    findParent: function findParent(el, elOrMatchFn) {
      var matchFn = typeof elOrMatchFn === "function" ? elOrMatchFn : function matchFn(it) {
        return it === elOrMatchFn
      }

      var node = el.parentElement
      while (node !== null) {
        if (matchFn(node)) {
          return node
        }
        node = node.parentElement
      }
      return null
    }
  }

  var handlers = [
    [
      /https?:\/\/link\.zhihu\.com/,
      function transform($link) {
        var searchParams = utils.getSearchParams($link.href)
        if (searchParams && searchParams.get("target")) {
          var realHref = searchParams.get("target")
          $link.href = realHref
          return realHref
        }
      }
    ],
    [
      /https?:\/\/douc\.cc/,
      function transform($link) {
        if (/https?:\/\//.test($link.title)) {
          var realHref = $link.title
          $link.textContent = $link.textContent.replace($link.href, realHref)
          $link.href = realHref
          return realHref
        }
      }
    ],
    [
      /https?:\/\/(www.)?douban\.com\/link2/,
      function transform($link) {
        var searchParams = utils.getSearchParams($link.href)
        if (searchParams && searchParams.get("url")) {
          var realHref = searchParams.get("url")
          $link.href = realHref
          return realHref
        }
      }
    ],
    [
      /https?:\/\/t\.co/,
      function transform($link) {
        var $cardWrapper = utils.findParent($link, function(node) {
          return node.dataset.testid === "card.wrapper"
        })
        var isCardLink = !!$cardWrapper
        var realHref
        if (isCardLink) {
          try {
            var $textContent = $cardWrapper.parentElement.parentElement.parentElement.previousElementSibling
            var $textLink = utils.$("a[href^=http]", $textContent)
            if ($textLink) {
              realHref = getTextLinkHref($textLink)
              $link.href = realHref
              return realHref
            }
          } catch (e) {}
        } else {
          realHref = getTextLinkHref($link)
          $link.href = realHref
          return realHref
        }

        function getTextLinkHref($el) {
          return $el.textContent.replace(/((\.\.\.)|(…))$/, '')
        }
      }
    ],
    [
      /https?:\/\/(www\.)?youtube\.com\/redirect\?/,
      function transform($link) {
        var searchParams = utils.getSearchParams($link.href)
        if (searchParams && searchParams.get("q")) {
          var realHref = searchParams.get("q")
          $link.href = realHref
          return realHref
        }
      }
    ]
  ]

  var REDIRECT_URL_SELECTORS = [
    "t.co","link.zhihu.com","douc.cc","douban.com/link2",
    "youtube.com/redirect"
  ]
    .map(function(url) {return 'a[href*="' + url + '/"]'})
    .join(",")

  function selectLinks(parent) {
    return utils.$$(REDIRECT_URL_SELECTORS, parent)
  }

  function transformLinks($links, cache) {
    utils.forEachRight($links, function($link) {
      utils.concurrent(function transform() {
        if (!$link || !$link.href) return

        var href = $link.href
        var cachedHref = cache[href]
        if (cachedHref) {
          if (href !== cachedHref) {
            $link.href = cachedHref
          }
          return 
        }

        utils.forEachRight(handlers, function(handler) {
          var pattern = handler[0]
          var fn = handler[1]
          if (pattern.test(href)) {
            var res = fn($link)
            if (res) {
              cache[href] = res
            }
            return false
          }
        })
      })
    })
  }

  function onDomMutation(mutationList) {
    var cache = {}
    utils.forEachRight(mutationList, function(mutation) {
      utils.concurrent(function () {
        var target = mutation.target
        if (!target || !utils.isElement(target)) return

        var $newLinks = []

        utils.forEachRight(selectLinks(target), function addNewLink($link) {
          $newLinks.push($link)
        })

        transformLinks($newLinks, cache)
      })
    })
  }

  function start() {
    console.log("----------- FuckShortenedUrl -------------")

    transformLinks(selectLinks(), {})

    var observer = new MutationObserver(onDomMutation)
    observer.observe(document.body, {subtree: true, childList: true})
  }

  window.addEventListener("load", start)
})()
