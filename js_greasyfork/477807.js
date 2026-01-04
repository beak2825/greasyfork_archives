// ==UserScript==
// @name           brickmerge® Prices
// @name:de        brickmerge® Preise
// @namespace      https://brickmerge.de/
// @version        1.27.4
// @license        MIT
// @description    Displays lowest brickmerge® price next to offer price
// @description:de Zeigt den bisherigen Bestpreis von brickmerge® parallel zum aktuellen Preis an
// @author         Philipp Kursawe <pke@pke.fyi>
// @match          https://www.alternate.de/LEGO/*
// @match          https://www.alternate.de/html/product/*
// @match          https://www.alza.de/spielzeug/lego-*
// @match          https://www.alza.at/spielzeug/lego-*
// @match          https://www.amazon.*/LEGO-*
// @match          https://www.amazon.*/*LEGO*
// @match          https://www.amazon.*/*p/*
// @match          https://www.amazon.*/*/*p/*
// @match          https://www.bol.de/shop/home/artikeldetails/*
// @match          https://www.digitalo.de/products/*/*-LEGO-*
// @match          https://www.ebay.de/itm/*
// @match          https://www.galeria.de/produkt/lego-*
// @match          https://www.jb-spielwaren.de/*
// @match          https://www.kleinanzeigen.de/s-anzeige/lego-*
// @match          https://www.lego.com/de-de/product/*
// @match          https://www.mediamarkt.de/de/product/_lego-*
// @match          https://www.mueller.de/p/lego-*
// @match          https://www.otto.de/p/lego-*
// @match          https://www.proshop.de/LEGO/*
// @match          https://www.shopdisney.de/lego-*
// @match          https://www.saturn.de/de/product/_lego-*
// @match          https://www.smythstoys.com/de/de-de/spielzeug/lego/*
// @match          https://steinehelden.de/*
// @match          https://www.thalia.de/shop/home/artikeldetails/*
// @match          https://www.toys-for-fun.com/de/lego*
// @match          https://www.toymi.eu/LEGO-*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=brickmerge.de
// @homepageURL	   https://github.com/pke/brickmerge-userscript
// @supportURL     https://github.com/pke/brickmerge-userscript/discussions
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @grant          GM_info
// @connect        hypermedia.rocks
// @connect        *
// @downloadURL https://update.greasyfork.org/scripts/477807/brickmerge%C2%AE%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/477807/brickmerge%C2%AE%20Prices.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'use esversion:11';

    // In tests this function is not defined and can't be injected via Page.evaluate nor Page.evaluateOnNewDocument
    if (!window.GM_xmlhttpRequest) {
      window.GM_xmlhttpRequest = function({ url, onload, headers }) {
        fetch(url, { headers })
          .then(response => response.text())
          .then(responseText => onload({ responseText }))
      }
    }

    if (!window.GM_info) {
      window.GM_info = {
        scriptHandler: "Violentmonkey",
        version: "4.0.0",
        script: {
          version: "1.27.0",
        }
      }
    }

    const style = `
     .brickmerge-price {
       background-color: #b00 !important;
       color: #fff !important;
       margin: 1rem 0 !important;
       padding: 0.3rem 0.5rem !important;
     }
     .brickmerge-price a {
       color: #fff !important;
       font-weight: bold !important;
       text-decoration: underline !important;
     }
     .brickmerge-price a:hover {
       text-decoration: none !important;
     }
     .brickmerge-price img {
       height: 16px;
       display: inline;
       vertical-align: middle;
       margin-right: 0.3rem;
     }
     .brickmerge-price img.small {
       width: 16px;
     }`;

    const logo = `https://raw.githubusercontent.com/pke/brickmerge-userscript/master/public/images/brickmerge.svg`;

    const resolvers = {
        "www.amazon.de": {
            targetSelector: "#corePriceDisplay_desktop_feature_div,#corePrice_feature_div",
            testURL: "https://www.amazon.de/LEGO-43230-Disney-Kamera-Maus-Minifiguren/dp/B0BV7BMPVS",
        },
        "www.amazon.fr": "www.amazon.de",
        "www.amazon.es": "www.amazon.de",
        "www.smythstoys.com": {
            targetSelector: "#product-info div[itemprop=price]",
            testURL: "https://www.smythstoys.com/de/de-de/spielzeug/lego/lego-fuer-erwachsene/lego-icons-set-10266-nasa-apollo-11-mondlandefaehre/p/183613",
        },
        "www.toys-for-fun.com": {
            targetSelector: ".product-info-price",
            testURL: "https://www.toys-for-fun.com/de/legor-disney-43230-kamera-hommage-an-walt-disney.html",
        },
        "www.jb-spielwaren.de": {
            targetSelector: ".widget-availability",
            testURL: "https://www.jb-spielwaren.de/lego-10293-besuch-des-weihnachtsmanns/a-10293/",
        },
        "steinehelden.de": {
            articleExtractor: /(\d{4,})/,
            targetSelector: "div[itemprop=offers] .product--tax",
            testURL: "https://steinehelden.de/city-arktis-schneemobil-60376/",
        },
        "www.proshop.de": {
            targetSelector: "#site-product-price-stock-buy-container span.site-currency-wrapper",
            testURL: "https://www.proshop.de/LEGO/LEGO-Ideas-21343-Wikingerdorf/3195765",
        },
        "www.alternate.de": {
          parent: true,
          prepend: true,
          targetSelector: "#product-top-right .price",
          testURL: "https://www.alternate.de/LEGO/10311-Creator-Expert-Orchidee-Konstruktionsspielzeug/html/product/1818749",
        },
        "www.saturn.de": {
            targetSelector: "div[data-test='mms-pdp-offer-selection']",
            prepend: true,
            dynamic: "h1", // Site changes its DOM via script and could remove our element
            styleSelector: "div[data-test='mms-branded-price'] p > span",
            style(element) {
                element.style = "text-align: right";
            },
            testURL: "https://www.saturn.de/de/product/_lego-10281-bonsai-baum-2672008.html",
        },
        "www.mediamarkt.de": "www.saturn.de", // just an alias, same as saturn
        "www.otto.de": {
            targetSelector: ".pdp_price__inner",
            prepend: true,
            testURL: "https://www.otto.de/p/lego-konstruktionsspielsteine-kamera-hommage-an-walt-disney-43230-lego-disney-811-st-made-in-europe-C1725197870/#variationId=1725014125",
        },
        "www.mueller.de": {
            targetSelector: ".mu-product-price.mu-product-details-page__price",
            testURL: "https://www.mueller.de/p/lego-icons-10281-bonsai-baum-kunstpflanzen-set-fuer-erwachsene-deko-2681620/",
        },
        "www.thalia.de": {
            targetSelector: "artikel-informationen",
            style(element) {
                element.classList.add("element-text-small");
            },
            testURL: "https://www.thalia.de/shop/home/artikeldetails/A1068002914",
        },
        "www.bol.de": "www.thalia.de", // https://www.bol.de/shop/home/artikeldetails/A1066075411
        "www.ebay.de": {
            parent: true,
            prepend: true,
            style: "text-align: center",
            targetSelector: ".x-bin-price",
            testURL: "https://www.ebay.de/itm/204515604952",
        },
        "www.alza.de": {
            parent: true,
            prepend: true,
            targetSelector: ".price-detail__row",
            testURL: "https://www.alza.de/spielzeug/lego-disney-43230-kamera-hommage-an-walt-disney-d7744520.htm",
        },
        "www.alza.at": "www.alza.de",
        "www.kleinanzeigen.de": {
            parent: true,
            prepend: true,
            targetSelector: "#viewad-title,.ad-keydetails--price-and-shipping",
        },
        "www.digitalo.de": {
            parent: true,
            prepend: true,
            articleExtractor: /(\d{4,}) LEGO/,
            targetSelector: ".large_order_5",
        },
        "www.galeria.de": {
            targetSelector: "div[data-testid=productDetails] h1",
        },
        "www.shopdisney.de": {
            targetSelector: "div.prices",
        },
        "www.lego.com": {
            articleExtractor: /(\d{4,})/,
            parent: true,
            dynamic: true,
            targetSelector: "div[class^='ProductOverviewstyles__PriceAvailabilityWrapper-'] span[data-test='product-price']",
        },
        "www.toymi.eu": {
            targetSelector: ".price.h1",
            parent: true,
            prepend: true,
        },
    };

    function renderError(element, error, operation = "append") {
        if (!element) {
            return;
        }
        const errorElement = document.createElement("div");
        errorElement.innerText = error.message;
        element[operation]?.(errorElement);
    }

    function addLowestPrice(element, title = "Bestpreis wird geladen", url, lowestPrice, operation = "append", icon, iconClass = []) {
        if (!element) {
            return;
        }
        let brickmergeBox = element.querySelector(".brickmerge-price");
        let isNew = !brickmergeBox;
        // console.log("addLowestPrice isNew: ", isNew);
        if (!brickmergeBox) {
            brickmergeBox = document.createElement("div");
            brickmergeBox.className = "brickmerge-price";
        }
        const brickmergeLink = url ? `<a href="${url}">${lowestPrice}</a>` : "...";
        const iconImage = icon ? `<img src="${icon}" class="${iconClass.join(" ")}"/>` : "";
        brickmergeBox.innerHTML = `${iconImage}${title}: ${brickmergeLink}`;
        if (isNew) {
            element[operation]?.(brickmergeBox);
        }
        return brickmergeBox;
    }

    function addPriceToTargets(resolver, priceOrError, url, styleClasses, title, icon, iconClass) {
        const wait = (resolver.dynamic && priceOrError !== "...") ? new Promise(resolve => setTimeout(resolve, 1000)) : Promise.resolve()
        wait.then(() => {
          const targets = document.querySelectorAll(resolver.targetSelector);
          if (targets.length === 0) {
              // console.log(`Target ${resolver.targetSelector} not found`);
              return;
          }
          if (!document.querySelector("head style.brickmerge")) {
              const styleElement = document.createElement("style");
              styleElement.className = "brickmerge";
              styleElement.type = 'text/css';
              styleElement.innerHTML = style;
              document.head.appendChild(styleElement);
          }
          const error = priceOrError instanceof Error && priceOrError
          const price = error ? undefined : priceOrError
          if (error instanceof Error) {
              for (let element of targets) {
                  if (resolver.parent) {
                      element = element.parentElement
                  }
                  renderError(element, error, resolver.prepend ? "prepend" : "append");
              }
          } else if (price) {
              for (let element of targets) {
                  if (resolver.parent) {
                      element = element.parentElement
                  }
                  //console.log("target:", element.innerHTML);
                  const box = addLowestPrice(element, title, url, price, resolver.prepend ? "prepend" : "append", icon, iconClass);
                  if (styleClasses) {
                      box.classList.add(...styleClasses.split(" "));
                  }
                  if (typeof resolver.style === "function") {
                      resolver.style(box);
                  } else if (typeof resolver.style === "string") {
                      box.style = resolver.style;
                  }
              }
          }
        })
    }

    let resolver = resolvers[document.location.host]
    // Do we have an alias for another resolver?
    if (typeof resolver === "string") {
        resolver = resolvers[resolver];
    }
    if (!resolver) {
        return;
    }

    const styleNode = document.querySelector(resolver.styleSelector);
    // console.log("styleNode", styleNode);
    const styleClasses = styleNode?.className;

    function getSetNumber() {
      const [, setNumber] = (resolver.articleExtractor || /LEGO.*?(\d{4,})/i).exec(document.title) || [];
      return setNumber
    }

    function fetchPrice() {
      addPriceToTargets(resolver, "...", "", styleClasses);

      GM_xmlhttpRequest({
          url: "https://brickmerge-userscript.hypermedia.rocks/lowest/" + getSetNumber(),
          headers: {
            "User-Agent": `${navigator.userAgent} brickmerge/${GM_info.script.version} ${GM_info.scriptHandler}/${GM_info.version}`,
          },
          onload(response) {
            const json = JSON.parse(response.responseText);
            const { title, links } = json;
            const icon = links.find(link => link.rel.includes("icon")) || { href: logo };
            const link = links.find(link => link.rel.includes("self"));
            addPriceToTargets(resolver, link.title, link.href, styleClasses, title, icon.href, icon.class);
          }
      });
    }

    if (!getSetNumber()) {
        return;
    }

    if (resolver.dynamic) {
      new MutationObserver(function(mutations) {
          console.log(mutations[0].target.nodeValue);
          fetchPrice();
      }).observe(
          document.querySelector('title'),
          { subtree: true, characterData: true, childList: true }
      );
    }
        // Create an observer instance linked to the callback function
        /*const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    if (mutation.target.querySelector?.(resolver.targetSelector)) {
                        fetchPrice();
                    }
                } else if (mutation.type === "childList" && mutation.addedNodes?.length) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.querySelector?.(resolver.targetSelector)) {
                            fetchPrice();
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { characterData: true, childList: true, subtree: true });
    }*/
    fetchPrice();
})();
