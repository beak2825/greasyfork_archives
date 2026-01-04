// ==UserScript==
// @name         Amazon - Clean UI
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7) <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  removes annoying largely not useful elements from Amazon
// @copyright    2019-2021, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.9.0

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/amazon-clean-ui.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Amazon_-_Clean_UI
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @include      https://*amazon.com*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419641/Amazon%20-%20Clean%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/419641/Amazon%20-%20Clean%20UI.meta.js
// ==/UserScript==

let STYLES = ""
let READY = false
const QUEUE = []

/**********************
 *  helper functions  *
 **********************/

/**
 * read from global `STYLES` and append string to document head as CSS
 *
 * @returns {void}
 */
const attachStyles = () => {
  const stylesheet = document.createElement("style")
  const head = document.head || document.querySelectorAll("head")[0]
  stylesheet.id = "hiding" // to edit later
  stylesheet.type = "text/css"
  stylesheet.append(document.createTextNode(STYLES))
  head.append(stylesheet)
}

/**
 * retrieves node from selector or passes through el(s) or false otherwise,
 * designed to allow repeatedly calling on return value without breaking
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {number} i - position of item to return if selector finds multiple matches
 * @returns {HTMLElement | object | boolean} targeted DOM el or input object or false otherwise
 */
const getElX = (target, i = 0) =>
  typeof target === "string" ? document.querySelectorAll(target)[i] : target

/**
 * retrieves nodes from selector or passes through el(s) or false otherwise,
 * designed to allow repeatedly calling on return value without breaking
 *
 * @param {DOMTargetItems} target - selector or els
 * @returns {HTMLElement[]} targeted DOM el or input object or false otherwise
 */
const getElAll = (target) => {
  if (typeof target === "string") return [...document.querySelectorAll(target)]
  if (target instanceof Element) return [target]
  return [...target]
}

/**
 * adds an event listener func to a given selector (if it exists)
 * NOTE: queues event if page not loaded
 *
 * @param {DOMTargetItem} target - selector or els
 * @param {string} event - trigger to listen for
 * @param {Function} func - executed after event trigger
 * @returns {void}
 */
const on = (target, event, func) => {
  const statement = () => {
    const el = getElX(target)
    if (el && el.addEventListener) el.addEventListener(event, func)
  }
  READY ? statement() : QUEUE.push(statement)
}

/**
 * sets property on a given selector (if it exists)
 * NOTE: queues action if page not loaded
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {string} attr - trigger to listen for
 * @param {string} val - desired property value
 * @param {number} i - position of item to assign to if selector finds multiple matches
 * @returns {void}
 */
const setAttrX = (target, attr, val, i = 0) => {
  const statement = () => {
    const el = getElX(target, i)
    if (el) el[attr] = val
  }
  READY ? statement() : QUEUE.push(statement)
}

/**
 * sets style on a given selector (if it exists), extends setAttr
 * NOTE: queues action if page not loaded
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {string} val - desired style property value
 * @param {number} i - position of item to assign to if selector finds multiple matches
 * @returns {void}
 */
const setStyleX = (target, val, i = 0) => {
  setAttrX(target, "style", val, i)
}

/**
 * sets style on a given selector via a StyleSheet
 *
 * @param {DOMTargetItem} target - selector or els
 * @param {string} val - desired style property value
 * @returns {void}
 */
const setStyle = (target, val) => {
  STYLES += `
    ${target} {
      ${val}
    }
  `
}

/**
 * sets style to 'display: none' on a given selector (if it exists), extends setStyle
 * NOTE: queues action if page not loaded
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {number} i - position of item to hide if selector finds multiple matches
 * @returns {void}
 */
const hideX = (target, i = 0) => {
  setStyleX(target, "display: none !important;", i)
}

/**
 * sets style to `display: none !important;` on a given selector via a StyleSheet,
 *
 * @param {DOMTargetItem} target - selector or el
 * @returns {void}
 */
const hide = (target) => {
  setStyle(target, "display: none !important;")
}

/**
 * sets style to 'display: none' on a given selector's `X`
 * parent (if chain exists), extends setStyle
 * NOTE: queues action if page not loaded
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {number} x - vertical upward depth of item from child to hide
 * @param {number} i - position of item to assign to if selector finds multiple matches
 * @returns {void}
 */
const hideParentX = (target, x = 0, i = 0) => {
  const statement = () => {
    let el = getElX(target, i)

    for (let count = 0; count < x; count += 1) {
      el = el && el.parentElement
    }

    hideX(el)
  }

  READY ? statement() : QUEUE.push(statement)
}

/**
 * sets style to 'display: none' on each given selector's `X`
 * parent (if chain exists), extends setStyle
 * NOTE: queues action if page not loaded
 *
 * @param {DOMTargetItem} target - selector or el
 * @param {number} x - vertical upward depth of item from child to hide
 * @returns {void}
 */
const hideAllParentX = (target, x = 0) => {
  const statement = () => {
    for (const el of getElAll(target)) {
      hideParentX(el, x)
    }
  }

  READY ? statement() : QUEUE.push(statement)
}

/**
 * create functions to add null checking and prevent script errors
 *
 * @typedef {string | NodeListOf<HTMLElement> | HTMLElement | HTMLElement[] | null} DOMTargetItems
 * @typedef {string | HTMLElement | null} DOMTargetItem
 */
function addElementsToHideQueue() {
  const link = window.location.href

  // product-based pages
  if (
    /https*:\/\/.*?amazon\.com\/dp\/.*/g.test(link) ||
    /https*:\/\/.*?amazon\.com\/gp\/product\/.*/g.test(link) ||
    /https*:\/\/.*?amazon\.com\/.*\/dp\/.*/g.test(link)
  ) {
    // hide nav junk / banner ads
    hide("#navSwmHoliday")
    hide("#universal-detail-ilm")
    hide("#detail-ilm_div")
    // hideX("#dp div", 0) // TODO: eats whole page sometimes
    hideX("#dp div", 1) // TODO: dangerous, replace with more precise selector

    // hide sharing
    hide("#tellAFriendBox_feature_div")
    hide("#tellAFriendBylineBox_feature_div")

    // hide product sales help & options nobody uses (protection plan, etc)
    hide("#image-canvas-caption")
    hide("#issuancePriceblockAmabot_feature_div")
    hide("#alternativeOfferEligibilityMessaging_feature_div")
    hide("#productSupportAndReturnPolicy_feature_div")
    hide("#smileEligibility_feature_div")
    hide("#addServices_feature_div")
    hide("#edpIngress_feature_div")
    hide("#hqpWrapper")
    hide("#HLCXComparisonJumplink_feature_div")
    hide("#olp_feature_div")
    hide(
      "#moreBuyingChoices_feature_div > div > .a-section.a-padding-base:first-child"
    )
    hide("#hqp")
    hide("#mbb_feature_div")
    hide("#simpleBundle_feature_div")
    hide("#buyNow_feature_div")
    hide("#oneClick_feature_div")
    hideParentX("#oneClickSignIn", 1)
    hide("#glowContextualIngressPt_feature_div")
    hide("#digitalDashLowProminence_feature_div")
    hide("#digitalDashLowProminenceAccordion_feature_div")
    hide("#digital-dash-create-high-prominence")
    hide("#buyNow")
    hideParentX("#add-to-registry-wedding-button", 2)
    hideParentX(".oneclick-guide", 1)
    hideParentX(".oneclick-guide", 2, 1)
    hide("#tradeInInstantSavings_feature_div")
    hide("#digital-dash-create")
    hide("#tradeInButton_feature_div")
    hide("#add-to-baby-button-group")
    hide("#productSupportInsideMOBB_feature_div") // tech support included
    hide("#cpsiaProductSafetyWarning_feature_div") // choking hazard
    hide("#b2bUpsell_feature_div") // save w business acct
    // getEl('.a-column.a-span6.a-span-last').lastElementChild.style = 'display: none'

    // misc ads -- does not prevent loading or tracking
    hide("#amsDetailRight_feature_div")
    hide("#dp-ads-center-promo_feature_div")
    hide("#ape_Detail_dp-ads-center-promo_Desktop_placement")
    hide("#ADPlaceholder")
    hide("#ape_Detail_ad-endcap-1_Glance_placement")
    hide("#productAlert_feature_div") // amazon hub

    // clean up empty section dividers
    setStyle(".bucket", "display: block;")
    hide(".bucketDivider")
    hide("#promoGrid")
    hide("#messages")

    // hide related products and recommendations
    hide("#sp_detail_thematic")
    hide("#skyCitySoftMerge_feature_div")
    hide("#recommendations_feature_div")
    hide(".a-section.similarities-widget")
    hide('[name="goKindleStaticPopDiv"]:first-child')
    hide("#sims-fbt")
    hide("#heroQuickPromoBooksAtf_feature_div") // book suggestion under product summary
    hide("#heroQuickPromo_feature_div") // get alexa for Win10
    hide("#bundleV2_feature_div")
    hide("#cerberus_feature_div")
    hide("#p13n-m-desktop-dp-sims_session-similarities-sims-feature-3")
    hide("#p13n-m-desktop-dp-sims_purchase-similarities-sims-feature-3")
    hide("#p13n-m-desktop-dp-sims_purchase-similarities-sims-feature-2")
    hide("#relatedMaterials_feature_div")
    hide("#beautyRecommendations_feature_div")
    hide("#rhf")
    hide("#sponsoredProducts2_feature_div")
    hide("#sims-consolidated-2_feature_div")
    hide("#dpx-btf-hlcx-comparison_feature_div")
    hide("#HLCXComparisonWidget_feature_div")
    hide("#featureAwarenessWidget_feature_div")
    hideParentX("#widget_container .a-carousel-container", 1)
    hideX(".a-section", getElAll(".a-section").length - 5)
    hide("#beautyBadging_feature_div") // Luxury Beauty green tag
    hide("#almMultiOfferEgress_feature_div") // "other ways to buy"
    hide("#ccxssContent") // post ATC recommendations panel
    // hide('#attach-accessories') // post ATC recommendations panel FIXME: broken due to lazy load
    // REVIEW: experimental, hide junk at the bottom of the page without ID or class
    hide("#dpx-giveaway_feature_div ~ div")
    hide("#dpx-giveaway_feature_div ~ table")
    // TEST: sub components already hidden, hiding parent makes weird spacing
    // hide("#va-related-videos-widget_feature_div") // videos for related products
    hide("#rvs-vse-related-videos") // videos for this item and related products
    hide(".threepsl.MultiBrandCreativeDesktop.celwidget") // brands related to category
    hide(".threepsl.MultiBrandLifestyleCreativeDesktop.celwidget") // brands related to category
    hide(".thirdPartySponsorLink--twoAds") // brands related to category
    hide('[cel_widget_id="desktop-dp-sims_amazonlive-percolate-detail-page"]') // live streams
    hide('[cel_widget_id="desktop-dp-sims_SponsoredProductsSimsDpDesktop"]') // related products
    hide('[cel_widget_id="desktop-dp-sims_day0-sims-6523"]') // page w related products bottom text
    hide(
      '[cel_widget_id="desktop-dp-sims_SponsoredProductsSimsDpDesktopThematic"]'
    ) // 4 star related prods
    hide("#valuePick_feature_div") // similar item to consider

    // hide other junk sections
    hide("#sp_detail")
    hide("#quickPromoBucketContent")
    hideParentX(".celwidget .a-section.askDetailPageSearchWidgetSection", 1)
    hide("#vse-related-videos")
    hide("#vseVideoWidget_cardDeck")
    hide(".a-section.vse-empty-view-container.bucket:first-child")
    hide("#importantInformation")
    hide("#giveaway_feature_div")
    hide("#view_to_purchase-sims-feature")
    hide("#store-disclaimer_feature_div")
    hideParentX("#fiona-publisher-signup-link", 2)
    hideParentX("#hero-quick-promo-grid_feature_div #hero-quick-promo", 1)
    hide("#extraProductInfoTxtBookFeatureGroup")
    setStyle("#aplus", "padding: 15px 0; border-top: lightgrey 1px solid;")
    setStyle("#reviewsMedley", "margin-bottom: 0 !important;")
    hide("#superleafProductAlert_feature_div")
    hide("#dpx-legal_feature_div")
    hide("#cm_cr_skyfall_medley .cr-skyfall-feedback-section") // is feedback helpful? // FIXME:
    hide("#flipAndSampleAudio")
    hide("#authorFollow_feature_div")
    hide(".askQuestionExamples:first-child")
    hide("#acBadge_feature_div")
    hide("#hsxShCelDpAmznCertBdg") // works w alexa
    hide("#dpx-smarthome-hub_feature_div") // add alexa for voice control
    hide("#pldn-deep-link") // suggestion to use smile
    hide("#productDetailsTable td.bucket div.content div.bucket") // better price & seller support links
    hide("#moreBuyingChoices_feature_div") // have one to sell?
    hide("#trialBox") // report copyright issues

    // remove unnatural black background of title bar on some pages (video game consoles)
    setStyle("#ppd-top", "background: none;")
    setStyle("#titleBar.superleaf", "background: none;")
    setStyle(
      ".superleafParent #wayfinding-breadcrumbs_container",
      "background: none;"
    )

    // fix colors
    setStyle(
      ".superleafParent #wayfinding-breadcrumbs_feature_div .a-color-tertiary",
      "color: #111 !important;"
    )
    setStyle(
      "a#breadcrumb-back-link.a-link-normal.a-color-tertiary",
      "color: #111 !important;"
    )
    setStyle(
      "#superLeafTitleFeatureGroup #titleSection #title",
      "color: black;"
    )
    setStyle(
      "#titleBar.superleaf .a-color-secondary:first-child",
      "color: #555 !important;"
    )
    setStyle("#titleBar-left", "color: black;")
    setStyle(
      "#superLeafGameReviews_feature_div .a-icon-popover:first-child",
      "filter: none;"
    )
    setStyle(
      "#titleBar a:link, #titleBar.superleaf .a-link-normal",
      "color: #0066c0 !important;"
    )
    setStyle(".superleaf .ac-for-text:first-child", "color: #888;")
    setStyle(
      "#superleafActionPanelWrapper",
      "box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 4px -1px;"
    )
  }

  // subscribe & save page
  if (/https*:\/\/.*?amazon\.com\/gp\/subscribe-and-save\/.*/g.test(link)) {
    // onElementReady('#recommendations', false, e => hide(e))
    // setStyle('.a-section.deliveries', 'margin-bottom: 0px;')
    // console.log('test')
    hide("#recommendations") // all main sections
    // hideParentX('.a-section.deliveries > div.a-fixed-right-grid') // history related
  }

  // search page
  if (/https*:\/\/.*?amazon\.com\/s.*/g.test(link)) {
    hide(".AdHolder")
    hide("#centerBelowExtra") // search feedback
    hide('div[data-component-type="sp-sponsored-result"]') // sponsored res
    hide(
      '#rhf[aria-label="Your recently viewed items and featured recommendations"]'
    ) // footer full of junk
    hideAllParentX(".a-section #pdagEncapsulated .slot__ad", 2)
    hideAllParentX(
      ".s-result-item .sg-col-inner .celwidget div .s-shopping-adviser",
      4
    ) // editorial recs
    hideAllParentX(".s-result-item .sg-col-inner div .s-shopping-adviser", 3) // similar connectors
    hideAllParentX(
      '.s-result-item .sg-col-inner div .sg-row .sg-col .sg-col-inner .a-section .s-visual-card-navigation-carousel-title-wrapper div[aria-label*="Search for"]',
      8
    ) // search in a category
    hideAllParentX(
      'span[data-component-type="s-bottom-slot"] .a-section span[data-component-type="s-searchgrid-carousel"]',
      2
    ) // inspired by your views
    hideAllParentX(
      'span[data-component-type="s-brand-footer-slot"] .a-section #thirdPartySponsorLinkOuter',
      2
    ) // related brands
    hide('span[data-component-type="s-feedback-slot"]') // feedback
    hideAllParentX('span[data-component-type="s-ads-metrics"]', 1) // sponsored product search brand (little giant)
    hideAllParentX("div[data-ad-feedback]", 1) // sponsored product search brand (little giant)
    // div.a-section.a-spacing-none.s-result-item.s-flex-full-width.s-widget.s-widget-spacing-large:nth-of-type(1)
    // #ad-feedback-text-auto-sparkle-hsa-tetris
    hideAllParentX('[cel_widget_id="MAIN-VIDEO_SINGLE_PRODUCT"]', 1) // sponsored product search brand (little giant)
    // .a-section.sbv-product .sbv-ad-feedback
    hideAllParentX('[cel_widget_id="MAIN-FEEDBACK"]', 1) // sponsored product search brand (little giant)
  }

  // wishlist page
  if (/https*:\/\/.*?amazon\.com\/hz\/wishlist\/ls.*/g.test(link)) {
    // hide recommendations
    hide("#rhf")
    hide("#loaded-items")

    // increase spacing of filter icon
    setStyle("#filter-and-sort span:first-child", "padding-right: 5px;")
  }

  // ideas page
  if (/https*:\/\/.*?amazon\.com\/ideas\/.*/g.test(link)) {
    hide("#rhf") // hide recommendations
  }

  /* site-wide modifications */
  // hide nav ads
  hide("#nav-upnav")
  hide("#nav-subnav")
  hide("#nav-main") // delivery location & useless links
  // hide("#nav-main .nav-right")

  // hide recent items
  hide("#raw-sitewide-rhf")

  // minimize size and hide useless giant footer section
  setStyle("#navFooter", "margin-top: 0px;")
  hideX(".navFooterLine.navFooterLinkLine.navFooterPadItemLine")
  hideX(".navFooterLine.navFooterLinkLine.navFooterDescLine")
  setStyle(
    "#navFooter.navLeftFooter .navFooterCopyright",
    "padding-bottom: 10px !important;"
  )

  // hide generally useless last remaining part of footer section
  hideX("#navFooter .navFooterVerticalColumn.navAccessibility")
  hideX("#navFooter .navFooterCopyright")
  setStyleX(".nav-footer-line", "margin-top: 0px;")
  setStyleX("#navBackToTop div", "margin-bottom: 0px;")

  // add button to allow footer display restore
  setAttrX(
    "#navFooter .nav-footer-line",
    "innerHTML",
    `
    <a
      id='view-footer'
      style='color: #fff; padding: 15px 0; display: block; text-align: center;'
    >
      View Footer Site Links
    </a>
  `
  )

  // activate button to restore footer display
  QUEUE.push(() =>
    on(getElX("#view-footer"), "click", () => {
      hideX("#view-footer")
      setStyleX(".nav-footer-line", "margin-top: 30px;")
      setStyleX("#navBackToTop div", "margin-bottom: 30px !important;")
      setStyleX(
        "#navFooter .navFooterVerticalColumn.navAccessibility",
        "display: table;"
      )
    })
  )

  if (STYLES) attachStyles()
}

window.addEventListener("load", executeHideElementsJS)
addElementsToHideQueue()

function executeHideElementsJS() {
  READY = true
  for (const statement of QUEUE) {
    statement()
  }
}
