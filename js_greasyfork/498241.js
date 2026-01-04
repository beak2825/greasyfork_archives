// ==UserScript==
// @name        My Script
// @namespace   Violentmonkey Scripts
// @description This is a userscript.
// @match       https://www.99.co/singapore/*
// @version     0.0.0
// @author      fg
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.js
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498241/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/498241/My%20Script.meta.js
// ==/UserScript==

(function (web, solidJs, ui) {
'use strict';

var css_248z = "";

var stylesheet="*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.style-module_count__pvt1a{--un-text-opacity:1;color:rgba(249,115,22,var(--un-text-opacity))}.style-module_plus1__bz4vm{float:right}";

const getListings = (page_num, listing_type, query_ids) => {
  let url = '/api/v10/web/search/listings?';
  url += new URLSearchParams({
    query_ids: query_ids,
    query_type: 'district',
    query_limit: 'radius',
    query_coords: '1.3039947, 103.8298507',
    map_bounds: '1.5827095153768858, 103.49449749970108, 1.1090706240313446, 104.12483807587296',
    page_size: 100,
    page_num: page_num,
    zoom: 11,
    show_future_mrts: true,
    property_segments: 'residential',
    isFilterUnapplied: false,
    path: `/singapore/${listing_type}`,
    show_cluster_preview: false,
    show_description: true,
    show_internal_linking: true,
    show_meta_description: true,
    show_nearby: true,
    sort: 'recency,desc',
    listing_type: listing_type,
    // main_category: main_category,
    // condo_sub_type: condo_sub_type,
    // hdb_sub_categories: '',
    //landed_sub_type: '',
    rooms: 'any',
    bathrooms: 'any',
    composite_property_status: 'any',
    tenure: 'any',
    has_floor_plan: false,
    composite_floor_level: 'any',
    period_of_availability: 'any',
    composite_furnishing: 'any',
    composite_views: 'any',
    features_and_amenities: 'any'
  });
  return fetch(url, {
    headers: {
      "accept": "application/json"
    },
    method: 'GET'
  });
};

const _tmpl$ = /*#__PURE__*/web.template(`<div><button>Start</button><button>Sale</button><button>Rent</button><p><span>listingType:<br>district:<br>count:<!>/<!>/<br>currentPage:<!>/<!>--<br>`);
//import { jsx } from '@gera2ld/jsx-dom';

function Counter() {
  const [page, setPage] = solidJs.createSignal(1);
  const [count, setCount] = solidJs.createSignal(1000);
  const [tCount, setTCount] = solidJs.createSignal(0);
  const [postCount, setPostCount] = solidJs.createSignal(0);
  const [pageCount, setPageCount] = solidJs.createSignal(0);
  const [pageSize, setPageSize] = solidJs.createSignal(100);
  const [district, setDistrice] = solidJs.createSignal('');
  const [listingType, setListingType] = solidJs.createSignal('sale');
  const start = async () => {
    await sale();
    await rent();
  };
  const sale = async () => {
    setListingType('sale');
    await get(listingType());
  };
  const rent = async () => {
    setListingType('rent');
    await get(listingType());
  };
  setPageSize(100);
  const get = async listing_type => {
    for (let i = 1; i <= 28; i++) {
      setDistrice(`dtdistrict${i.toString().padStart(2, '0')}`);
      setPage(1);
      setCount(1000);
      setPostCount(0);
      while (count() / pageSize() > page()) {
        const res = await getListings(page(), listing_type, district());
        const section = (await res.json()).data.sections[0];
        const {
          listings,
          count
        } = section;
        setCount(count);
        setPageCount(parseInt((count / pageSize()).toString()) + 1);
        for (let e = 0; e < listings.length; e++) {
          const element = listings[e];
          console.log(element.id);
          setPostCount(count => {
            return count + 1;
          });
          setTCount(count => {
            return count + 1;
          });
          try {
            await post(element);
          } catch (_unused) {}
        }

        //setPage(10000)
        setPage(page => {
          return page + 1;
        });
      }
    }
  };
  return (() => {
    const _el$ = _tmpl$(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.nextSibling,
      _el$5 = _el$4.nextSibling,
      _el$6 = _el$5.firstChild,
      _el$7 = _el$6.firstChild,
      _el$8 = _el$7.nextSibling,
      _el$9 = _el$8.nextSibling,
      _el$10 = _el$9.nextSibling,
      _el$11 = _el$10.nextSibling,
      _el$19 = _el$11.nextSibling,
      _el$12 = _el$19.nextSibling,
      _el$20 = _el$12.nextSibling,
      _el$13 = _el$20.nextSibling,
      _el$14 = _el$13.nextSibling,
      _el$15 = _el$14.nextSibling,
      _el$21 = _el$15.nextSibling,
      _el$16 = _el$21.nextSibling,
      _el$22 = _el$16.nextSibling,
      _el$17 = _el$22.nextSibling,
      _el$18 = _el$17.nextSibling;
    _el$2.$$click = start;
    _el$3.$$click = sale;
    _el$4.$$click = rent;
    web.insert(_el$6, listingType, _el$8);
    web.insert(_el$6, district, _el$10);
    web.insert(_el$6, count, _el$19);
    web.insert(_el$6, postCount, _el$20);
    web.insert(_el$6, tCount, _el$14);
    web.insert(_el$6, page, _el$21);
    web.insert(_el$6, pageCount, _el$22);
    web.insert(_el$6, pageSize, _el$18);
    return _el$;
  })();
}
function post(json) {
  //const url = "https://localhost:44398/api/Listing99/PostListing";
  const url = "http://collectdata-api.propnex.net/api/Listing99/PostListing";
  return new Promise((reslove, reject) => {
    GM_xmlhttpRequest({
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json",
      data: JSON.stringify(json),
      onload: function (res) {
        reslove(res);
      },
      onerror: function (err) {
        //reject(new Error("request error"));
        reject(null);
      }
    });
  });
}

// Let's create a movable panel using @violentmonkey/ui
const panel = ui.getPanel({
  theme: 'dark',
  style: [css_248z, stylesheet].join('\n')
});
Object.assign(panel.wrapper.style, {
  top: '10vh',
  left: '10vw'
});
panel.setMovable(true);
panel.show();
web.render(Counter, panel.body);
web.delegateEvents(["click"]);

})(VM.solid.web, VM.solid, VM);
