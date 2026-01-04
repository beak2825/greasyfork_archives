// ==UserScript==
// @name Shopify - Always log-in from Partner Dashboard
// @description If your Shopify store session expires, this will redirect you
// from regular user login page, to specified partner dashboard.
// Please make sure to change PARTNER_ID (you can find it by going to partner
// dashboard and taking it from the URL)
// @version 0.1
// @author Patryk Jakubik
// @namespace Violentmonkey Scripts
// @match https://*.myshopify.com/admin/auth/login
// @grant none
// @esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/393811/Shopify%20-%20Always%20log-in%20from%20Partner%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/393811/Shopify%20-%20Always%20log-in%20from%20Partner%20Dashboard.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

const PARTNER_ID = CHANGE_ME

const url_string = window.location.href
const shop = url_string.replace("https://", "").replace("/admin/auth/login", "")
const redirect = `https://partners.shopify.com/${PARTNER_ID}/stores?search_value=${shop}`

window.location.href = redirect