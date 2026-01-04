// ==UserScript==
// @name Dark Theme for Kadokawa Taiwan
// @namespace https://jasonhk.dev/
// @version 1.3.0
// @description A tailor-made dark theme for Kadokawa Taiwan.
// @author Jason Kwok
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.kadokawa.com.tw/*
// @downloadURL https://update.greasyfork.org/scripts/492778/Dark%20Theme%20for%20Kadokawa%20Taiwan.user.js
// @updateURL https://update.greasyfork.org/scripts/492778/Dark%20Theme%20for%20Kadokawa%20Taiwan.meta.js
// ==/UserScript==

(function() {
let css = `
    :root
    {
        --background-color: #212529;
        --primary-color: #748ffc;
        --primary-hover-color: #4c6ef5;
        --primary-focus-outline-color: #748ffc7f;
        --primary-active-color: #91a7ff;
        --primary-text-color: #212529;
        --header-background-color: #343a40;
        --text-color: #f1f3f5;
        --footer-text-color: #adb5bd;
    }
    
    html, body
    {
        background-color: var(--background-color);
    }
    
    body
    {
        color: var(--text-color);
    }
    
    
    /* Common Elements */
    
    .button-primary, .product-form--atc-button
    {
        border: 1px solid var(--primary-color);
        color: var(--primary-text-color);
        background-color: var(--primary-color);
    }
    
    :is(.button-primary, .product-form--atc-button):not(.disabled):hover
    {
        border: 1px solid var(--primary-hover-color);
        background-color: var(--primary-hover-color);
    }
    
    :is(.button-primary, .product-form--atc-button):active
    {
        border: 1px solid var(--primary-active-color);
        background-color: var(--primary-active-color);
    }
    
    
    .site-header-wrapper
    {
        color: var(--primary-color);
        background-color: var(--background-color);
        box-shadow: 0 1px 4px #495057;
    }
    
    .site-header-main
    {
        background-color: var(--background-color);
    }
    
    .site-header-menu-toggle--button, .site-header-mobile-search-button--button, .site-header-cart--button
    {
        color: var(--primary-color);
    }
    
    .site-header-menu-toggle--button .toggle-icon--bar
    {
        background-color: var(--primary-color);
    }
    
    .site-logo-image
    {
        filter: brightness(250%);
    }
    
    .site-navigation-wrapper, .site-navigation, .site-navigation .navmenu-submenu
    {
        background-color: var(--background-color);
    }
    
    .site-navigation a
    {
        color: var(--primary-color);
    }
    
    .site-navigation a:focus
    {
        outline: solid var(--primary-focus-outline-color);
    }
    
    .mobile-nav-panel
    {
        color: var(--text-color);
        background-color: var(--background-color);
    }
    
    .navmenu-button
    {
        color: var(--text-color);
    }
    
    .mobile-nav-content .navmenu-link-parent-active
    {
        color: var(--primary-hover-color);
    }
    
    .mobile-nav-content .navmenu-link-parent-active ~ .navmenu-button
    {
        color: var(--primary-hover-color);
        background-color: #343a40;
    }
    
    .mobile-nav-content .navmenu-depth-2
    {
        background-color: #343a40;
    }
    
    .mobile-nav-content .navmenu-depth-2 .navmenu-link-parent-active ~ .navmenu-button
    {
        background-color: #495057;
    }
    
    .productgrid--search-button, .live-search-button
    {
        border: 1px solid var(--primary-color);
        color: var(--primary-text-color);
        background-color: var(--primary-color);
    }
    
    .productgrid--search-button:not(.disabled):hover, .live-search-button:not(.disabled):hover
    {
        border: 1px solid var(--primary-hover-color);
        background-color: var(--primary-hover-color);
    }
    
    .productgrid--search-button:active, .live-search-button:active
    {
        border: 1px solid var(--primary-active-color);
        background-color: var(--primary-active-color);
    }
    
    .breadcrumbs-container span
    {
        color: #e9ecef;
    }
    
    .site-footer-wrapper
    {
        color: var(--footer-text-color);
        background: var(--background-color);
    }
    
    .site-footer-information .navmenu .navmenu-item:not(:last-child)
    {
        border-right: 1px solid var(--footer-text-color);
    }
    
    .site-footer-wrapper .navmenu-link:hover, .site-footer-wrapper .site-footer-credits a:hover, .site-footer-wrapper .rte a:hover
    {
        color: #868e96;
    }
    
    .site-footer-credits
    {
        color: var(--footer-text-color);
    }
    
    .product-reviews--content .spr-content .spr-pagination a, .product-reviews--content .spr-content .spr-review .spr-review-footer a, .product-reviews--content .spr-summary-caption a.spr-summary-actions-togglereviews, .product-recently-viewed__clear, .shopify-payment-button .shopify-payment-button__more-options, .product-vendor a, .utils-showby-item.utils-showby-item--active, .utils-sortby-button, .utils-filter-button, .productgrid--sidebar-menu .navmenu-link--active, .productgrid-listview .productitem--link, .productgrid--footer-results-list a, .filter-item--grid-simple a, [data-filter-active="true"], .filter-item a.filter-text--link, .pagination--inner a, .search-flydown--content-item a, .search-flydown--continue, .live-search-takeover-cancel, .collection__item-title, .breadcrumbs-container a, .article--excerpt-readmore, .account-page-content a, .tweet--content a, .menulist-menu__show-more-trigger, .blogposts--footer-link, .product-link, .passwordentry-contents a, .password-page-footer--item a, .cart-continue, .cart-shipping .cart-shipping-toggle, .article--pagination .article--pagination-item-left > a, .article--pagination .article--pagination-item-right > a, .article--tags a, .rte a, .pxs-newsletter-text a, .shoppable-image__text-box-subheading a, .image-with-text__text a
    {
        color: var(--primary-color);
    }
    
    .product-reviews--content .spr-content .spr-pagination a:hover, .product-reviews--content .spr-content .spr-review .spr-review-footer a:hover, .product-reviews--content .spr-summary-caption a.spr-summary-actions-togglereviews:hover, .product-recently-viewed__clear:hover, .shopify-payment-button .shopify-payment-button__more-options:hover, .product-vendor a:hover, .utils-showby-item.utils-showby-item--active:hover, .utils-sortby-button:hover, .utils-filter-button:hover, .productgrid--sidebar-menu .navmenu-link--active:hover, .productgrid-listview .productitem--link:hover, .productgrid--footer-results-list a:hover, .filter-item--grid-simple a:hover, [data-filter-active="true"]:hover, .filter-item a.filter-text--link:hover, .pagination--inner a:hover, .search-flydown--content-item a:hover, .search-flydown--continue:hover, .live-search-takeover-cancel:hover, .collection__item-title:hover, .breadcrumbs-container a:hover, .article--excerpt-readmore:hover, .account-page-content a:hover, .tweet--content a:hover, .menulist-menu__show-more-trigger:hover, .blogposts--footer-link:hover, .product-link:hover, .passwordentry-contents a:hover, .password-page-footer--item a:hover, .cart-continue:hover, .cart-shipping .cart-shipping-toggle:hover, .article--pagination .article--pagination-item-left > a:hover, .article--pagination .article--pagination-item-right > a:hover, .article--tags a:hover, .rte a:hover, .pxs-newsletter-text a:hover, .shoppable-image__text-box-subheading a:hover, .image-with-text__text a:hover
    {
        color: var(--primary-hover-color);
    }
    
    .rte .tabs li, .rte .tabs li > a, .site-navigation .navmenu-meganav--image-link, .site-navigation .navmenu-depth-2 .navmenu-link, .utils-showby-item, .productgrid--sidebar-menu .navmenu-link, .filter-item, .productitem--title a, .cart-item--remove-link, .tweet--footer, .tweet--header-screenname, .hotspot__tooltip, .menulist-menu__link
    {
        color: var(--text-color);
    }
    
    .productitem, .productitem--info
    {
        background: var(--background-color);
    }
    
    .productitem__price .price__current
    {
        color: var(--primary-color);
    }
    
    .product__tax, .productitem__tax
    {
        color: var(--text-color);
    }
    
    .product-details
    {
        color: var(--text-color);
    }
    
    .product-title
    {
        color: var(--text-color);
    }
    
    .home-section--title, .cart-title, .account-page-title, .collection--title, .blog-title
    {
        color: var(--text-color);
    }
    
    .article--excerpt-title
    {
        color: var(--text-color);
    }
    
    .productitem, .disclosure-list, .cart-item, .article--excerpt-wrapper, .account-address, .pxs-map-card, .pxs-map-section-layout-x-outside-left .pxs-map-card-wrapper, .pxs-map-section-layout-x-outside-right .pxs-map-card-wrapper, .pxs-map-wrapper, .testimonial, .twitter--inner:not(.flickity-enabled), .twitter--inner .flickity-slider, .hotspot__tooltip-wrapper, .menulist-inner, .featured-product--container .featured-product--inner, #shopify-product-reviews, .rte table, .pxs-newsletter-text table, .shoppable-image__text-box-subheading table, .image-with-text__text table
    {
        border: 1px solid #495057;
        box-shadow: 0 1px 4px #495057;
    }
    
    
    /* Home Page */
    
    .highlights-banner__1621847442b3f81c63.highlights-banner__container
    {
        background-color: var(--background-color);
    }
    
    .highlights-banner__1621847442b3f81c63 .highlights-banner__content::before
    {
        background: linear-gradient( to right, var(--background-color) 10%, rgba(255, 255, 255, 0) 100%);
    }
    
    .highlights-banner__1621847442b3f81c63 .highlights-banner__content::after
    {
        background: linear-gradient( to left, var(--background-color) 10%, rgba(255, 255, 255, 0) 100%);
    }
    
    .highlights-banner__1621847442b3f81c63 .highlights-banner__block
    {
        color: var(--primary-color);
    }
    
    .highlights-banner__icon .highlights-banner__custom-icon
    {
        filter: brightness(250%);
    }
    
    
    /* Cart Page */
    
    .cart-item--content-title
    {
        color: var(--text-color);
    }
    
    .cart-item--product-options, .cart-item--content-price, .cart-item--unit-price
    {
        color: var(--text-color);
    }
    
    .cart-item--total
    {
        color: var(--text-color);
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
