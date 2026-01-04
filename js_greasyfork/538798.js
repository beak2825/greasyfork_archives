// ==UserScript==
// @name         FanFiction.Net Modern Theme
// @namespace    https://ko-fi.com/awesome97076
// @version      1.1
// @description  Modern dark/light theme for FanFiction.Net with enhanced metadata display
// @author       Awesome158
// @license      MIT
// @match        https://www.fanfiction.net/*
// @match        https://www.fictionpress.com/*
// @match        https://m.fanfiction.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538798/FanFictionNet%20Modern%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/538798/FanFictionNet%20Modern%20Theme.meta.js
// ==/UserScript==


(function () {
  "use strict";
  function GM_getValue(key, defaultValue) {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.GM_getValue) {
      return unsafeWindow.GM_getValue(key, defaultValue);
    }
    return localStorage.getItem('gm_' + key) || defaultValue;
  }

  function GM_setValue(key, value) {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.GM_setValue) {
      return unsafeWindow.GM_setValue(key, value);
    }
    localStorage.setItem('gm_' + key, value);
  }

  // Check for saved theme preference
  const savedTheme = GM_getValue("theme", "auto");
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme =
    savedTheme === "auto" ? (systemPrefersDark ? "dark" : "light") : savedTheme;

  // Inject critical CSS immediately to prevent FOUC
  document.documentElement.setAttribute("data-theme", initialTheme);

  const style = document.createElement("style");
  style.innerHTML = `
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --bg-card: #ffffff;
  --bg-hover: #f1f3f5;
  --bg-accent: #6098ff;
  --bg-accent-hover: #4a68ff;
  --text-primary: #212529;
  --text-secondary: #495057;
  --text-tertiary: #868e96;
  --text-inverse: #ffffff;
  --text-link: #4263eb;
  --text-link-hover: #364fc7;
  --border-color: #dee2e6;
  --border-subtle: #e9ecef;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.3);
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-modal: 1050;
  --z-tooltip: 1070;
}

[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;
  --bg-card: #1a1a1a;
  --bg-hover: #262626;
  --bg-accent: #456aff;
  --bg-accent-hover: #2450ff;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
  --text-tertiary: #868e96;
  --text-inverse: #0a0a0a;
  --text-link: #748ffc;
  --text-link-hover: #91a7ff;
  --border-color: #343a40;
  --border-subtle: #262626;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
  --glass-bg: rgba(26, 26, 26, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}

@media (max-width: 1024px) {
  :root {
    --font-size-xs: 0.7rem;
    --font-size-sm: 0.8rem;
    --font-size-base: 0.9rem;
    --font-size-lg: 1rem;
    --font-size-xl: 1.125rem;
    --font-size-2xl: 1.25rem;
    --font-size-3xl: 1.5rem;
    --font-size-4xl: 1.875rem;
  }
}

@media (max-width: 768px) {
  :root {
    --font-size-xs: 0.625rem;
    --font-size-sm: 0.75rem;
    --font-size-base: 0.875rem;
    --font-size-lg: 1rem;
    --font-size-xl: 1.125rem;
    --font-size-2xl: 1.25rem;
    --font-size-3xl: 1.5rem;
    --font-size-4xl: 1.75rem;
  }
}

* {
  box-sizing: border-box;
  transition: background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}

body, body[style] {
  margin: 0 !important;
  padding: 0 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  font-size: var(--font-size-base) !important;
  line-height: 1.6 !important;
  color: var(--text-primary) !important;
  background-color: var(--bg-primary) !important;
  background-image: radial-gradient(ellipse at top, var(--bg-secondary) 0%, transparent 50%), radial-gradient(ellipse at bottom, var(--bg-tertiary) 0%, transparent 50%) !important;
  min-height: 100vh !important;
  word-wrap: break-word !important;
}

.maxwidth {
  max-width: 95% !important;
  width: 100% !important;
  margin: 0 auto !important;
  padding: 0 var(--spacing-md) !important;
}

@media (max-width: 768px) {
  .maxwidth {
    padding: 0 var(--spacing-sm) !important;
  }
}

#top, .t_head {
  background: var(--bg-secondary) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-md);
}

#top .menulink {
  padding: var(--spacing-md) !important;
  align-items: center;
  gap: var(--spacing-md);
}

#top a, .t_text a, .menulink, .menulink a:visited, .menulink a:link, .menulink a:active, .menulink a:hover {
  color: var(--text-primary) !important;
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
  letter-spacing: normal !important;
}

#top a:hover, .t_text a:hover {
  color: var(--bg-accent) !important;
}

.zmenu {
  background: var(--bg-secondary) !important;
  border-bottom: 1px solid var(--border-color);
}

#zmenu {
  padding: 0 !important;
}

.xmenu_item {
  margin: 0 !important;
}

.dropdown-toggle {
  padding: var(--spacing-md) var(--spacing-lg) !important;
  background: transparent !important;
  border: none !important;
  color: var(--text-primary) !important;
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);
}

.dropdown-toggle:hover {
  background: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
}

.dropdown-menu, #t_drop {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-xl) !important;
  padding: var(--spacing-sm) !important;
  margin-top: var(--spacing-xs) !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  z-index: var(--z-dropdown) !important;
  display: none !important;
  float: left !important;
  min-width: 200px !important;
  list-style: none !important;
  background-clip: padding-box !important;
}

.dropdown-menu li {
  margin: 0 !important;
}

.dropdown-menu a, .dropdown-menu > li > a {
  display: block !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  border-radius: var(--radius-md) !important;
  transition: all var(--transition-fast) !important;
  clear: both !important;
  font-weight: 400 !important;
  line-height: 1.4 !important;
  white-space: nowrap !important;
  background-color: transparent !important;
}

.dropdown-menu a:hover, .dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {
  background: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
  background-image: none !important;
}

#content_wrapper {
  background: var(--bg-card) !important;
  border-radius: var(--radius-xl) !important;
  box-shadow: var(--shadow-lg) !important;
  margin: var(--spacing-xl) auto !important;
  overflow: hidden;
}

#content_wrapper_inner {
  padding: var(--spacing-xl) !important;
}

@media (max-width: 768px) {
  #content_wrapper {
    margin: var(--spacing-md) auto !important;
    border-radius: 0 !important;
  }
  #content_wrapper_inner {
    padding: var(--spacing-md) !important;
  }
}

.z-list {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle) !important;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  width: 100%;
}

.z-list:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--border-color) !important;
}

.z-list::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--bg-accent), var(--text-link));
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.z-list:hover::before {
  transform: scaleX(1);
}

.z-indent {
  padding-left: 60px;
}

.cimage, .lazy {
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-sm) !important;
  transition: all var(--transition-base) !important;
}

.cimage:hover, .lazy:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md) !important;
}

a {
  color: var(--text-link) !important;
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--text-link-hover) !important;
  text-decoration: underline;
}

.btn, button, input[type="button"], input[type="reset"], input[type="submit"] {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--spacing-xs) !important;
  padding: var(--spacing-sm) var(--spacing-lg) !important;
  margin-bottom: 0 !important;
  background: var(--bg-accent) !important;
  color: var(--text-inverse) !important;
  border: none !important;
  border-radius: var(--radius-full) !important;
  font-size: var(--font-size-sm) !important;
  font-weight: 500 !important;
  line-height: 1.4 !important;
  text-align: center !important;
  text-shadow: none !important;
  vertical-align: middle !important;
  cursor: pointer !important;
  transition: all var(--transition-fast) !important;
  box-shadow: var(--shadow-sm) !important;
  -webkit-appearance: button !important;
  appearance: button !important;
  background-image: none !important;
}

.btn:hover, .btn:focus, button:hover, button:focus, input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover {
  background: var(--bg-accent-hover) !important;
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-md) !important;
  outline: none !important;
  color: var(--text-inverse) !important;
  background-image: none !important;
  background-position: 0 0 !important;
  text-decoration: none !important;
}

.btn:active, .btn.active, button:active {
  background: var(--bg-accent-hover) !important;
  transform: translateY(0) !important;
  box-shadow: var(--shadow-sm) !important;
  outline: none !important;
  background-image: none !important;
}

input[type="text"], input[type="email"], input[type="password"], textarea, select, .uneditable-input {
  display: inline-block !important;
  width: auto !important;
  height: auto !important;
  min-height: 40px !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  margin-bottom: 0 !important;
  font-size: var(--font-size-base) !important;
  line-height: 1.4 !important;
  color: var(--text-primary) !important;
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  transition: all var(--transition-fast) !important;
  vertical-align: baseline !important;
  box-shadow: none !important;
  background-image: none !important;
}

input:focus, textarea:focus, select:focus {
  outline: none !important;
  border-color: var(--bg-accent) !important;
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1) !important;
}

.table, .table th, .table td {
  background-color: var(--bg-card) !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

.table th, .table td, .thead {
  padding: var(--spacing-md) !important;
  line-height: 1.6 !important;
  text-align: left !important;
  vertical-align: top !important;
  border-top: 1px solid var(--border-color) !important;
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.table td {
  background: var(--bg-card) !important;
  border-color: var(--border-subtle) !important;
}

.table td a {
  color: var(--text-link) !important;
  font-weight: 500;
}

.table td a:hover {
  color: var(--text-link-hover) !important;
}

.table-striped tbody > tr:nth-child(odd) > td, .table-striped tbody > tr:nth-child(odd) > th {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

.table td img {
  filter: var(--icon-filter, none);
  opacity: 0.7;
  margin-right: var(--spacing-xs);
}

[data-theme="dark"] .table td img {
  filter: brightness(0.8) contrast(1.2);
}

.alert {
  padding: var(--spacing-md) !important;
  margin-bottom: var(--spacing-md) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  text-shadow: none !important;
}

.well {
  min-height: auto !important;
  padding: var(--spacing-lg) !important;
  margin-bottom: var(--spacing-lg) !important;
  background-color: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(5px) !important;
}

.modal {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(5px);
  border: none !important;
  border-radius: var(--radius-xl) !important;
  box-shadow: var(--shadow-xl) !important;
}

.modal-header, .modal-body, .modal-footer {
  background-color: var(--bg-card) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.modal-header {
  border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
  padding: var(--spacing-lg) !important;
}

.modal-body {
  padding: var(--spacing-xl) !important;
  max-height: 70vh !important;
  overflow-y: auto !important;
}

.modal-footer {
  border-radius: 0 0 var(--radius-xl) var(--radius-xl) !important;
  padding: var(--spacing-lg) !important;
  background-color: var(--bg-secondary) !important;
}

.nav {
  margin-left: 0 !important;
  margin-bottom: 0 !important;
  list-style: none !important;
}

.nav > li > a {
  display: block !important;
  padding: var(--spacing-md) var(--spacing-lg) !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  border-radius: var(--radius-md) !important;
  transition: all var(--transition-fast) !important;
}

.nav > li > a:hover, .nav > li > a:focus {
  text-decoration: none !important;
  background-color: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
}

.breadcrumb {
  padding: var(--spacing-sm) var(--spacing-md) !important;
  margin: var(--spacing-md) 0 !important;
  list-style: none !important;
  background-color: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
}

.breadcrumb > li {
  display: inline-block !important;
  color: var(--text-secondary) !important;
  text-shadow: none !important;
}

.breadcrumb > .active {
  color: var(--text-primary) !important;
}

.pagination ul {
  display: inline-flex !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-sm) !important;
}

.pagination ul > li {
  display: inline !important;
}

.pagination ul > li > a, .pagination ul > li > span {
  display: block !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  margin: 0 !important;
  line-height: 1.4 !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-left-width: 0 !important;
  transition: all var(--transition-fast) !important;
}

.pagination ul > li:first-child > a, .pagination ul > li:first-child > span {
  border-left-width: 1px !important;
  border-radius: var(--radius-md) 0 0 var(--radius-md) !important;
}

.pagination ul > li:last-child > a, .pagination ul > li:last-child > span {
  border-radius: 0 var(--radius-md) var(--radius-md) 0 !important;
}

.pagination ul > li > a:hover, .pagination ul > .active > a {
  background-color: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
  border-color: var(--border-color) !important;
}

[class^="icon-"]:before, [class*=" icon-"]:before {
  font-family: "fontello" !important;
  font-style: normal !important;
  font-weight: 400 !important;
  display: inline-block !important;
  text-decoration: inherit !important;
  width: 1em !important;
  margin-right: 0.2em !important;
  text-align: center !important;
  font-variant: normal !important;
  text-transform: none !important;
  line-height: 1em !important;
  margin-left: 0.2em !important;
  color: inherit !important;
}

[class*="icon-"] {
  font-size: var(--font-size-base) !important;
  vertical-align: middle;
}

.clearfix:before, .clearfix:after {
  display: table !important;
  line-height: 0 !important;
  content: "" !important;
}

.clearfix:after {
  clear: both !important;
}

hr {
  margin: var(--spacing-lg) 0 !important;
  height: 1px !important;
  border: none !important;
  background: var(--border-color) !important;
  background-image: none !important;
}

h1, h2, h3, h4, h5, h6 {
  margin: var(--spacing-md) 0 !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  color: var(--text-primary) !important;
}

h1 { font-size: var(--font-size-4xl) !important; }
h2 { font-size: var(--font-size-3xl) !important; }
h3 { font-size: var(--font-size-2xl) !important; }
h4 { font-size: var(--font-size-xl) !important; }
h5 { font-size: var(--font-size-lg) !important; }
h6 { font-size: var(--font-size-base) !important; }

blockquote {
  margin: var(--spacing-lg) 0 !important;
  padding: var(--spacing-md) var(--spacing-lg) !important;
  border-left: 4px solid var(--bg-accent) !important;
  background-color: var(--bg-secondary) !important;
  color: var(--text-secondary) !important;
  border-radius: 0 var(--radius-md) var(--radius-md) 0 !important;
}

code, pre {
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace !important;
  font-size: 0.9em !important;
  color: var(--text-primary) !important;
  background-color: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-sm) !important;
}

pre {
  display: block !important;
  padding: var(--spacing-md) !important;
  margin: var(--spacing-md) 0 !important;
  line-height: 1.4 !important;
  word-break: break-all !important;
  word-wrap: break-word !important;
  white-space: pre-wrap !important;
  border-radius: var(--radius-md) !important;
  overflow-x: auto !important;
}

@media (min-width: 1000px) {
  p, div, span {
    margin: 0 !important;
    padding: 0 !important;
  }
}

.storytext p {
  margin: var(--spacing-md) 0 !important;
  padding: 0 !important;
}

.z-list p {
  margin: var(--spacing-sm) 0 !important;
  padding: 0 !important;
}

.z-high, .zhover:hover {
  background: var(--bg-hover) !important;
  filter: none !important;
}

.alt0, .alt1, .alt2 {
  background: var(--bg-card) !important;
  border: none !important;
}

.alt1Active, .alt2Active {
  background: var(--bg-secondary) !important;
  border: none !important;
}

.tcat, .panel_normal {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  padding: var(--spacing-md) !important;
  border-radius: var(--radius-md) !important;
}

.thead {
  color: var(--text-secondary) !important;
}

.thead a:link, .thead a:visited, .thead a:hover, .thead a:active {
  color: var(--text-link) !important;
  text-decoration: none !important;
  border-bottom: none !important;
}

.storytext {
  font-size: var(--font-size-lg);
  line-height: 1.8;
  color: var(--text-primary);
  max-width: 90%;
  margin: 0 auto;
  padding: var(--spacing-xl) !important;
}

@media (max-width: 768px) {
  .storytext {
    font-size: var(--font-size-base);
    padding: var(--spacing-md) !important;
  }
}

#profile_top {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

#name_login > span {
  color: var(--text-secondary) !important;
  letter-spacing: 0.5px;
}

.nav-tabs {
  border-bottom: 2px solid var(--border-color) !important;
  margin-bottom: var(--spacing-lg) !important;
}

.nav-tabs li {
  margin-bottom: -2px !important;
}

.nav-tabs a {
  padding: var(--spacing-sm) var(--spacing-lg) !important;
  color: var(--text-secondary) !important;
  border: none !important;
  border-bottom: 2px solid transparent !important;
  transition: all var(--transition-fast) !important;
}

.nav-tabs li.active a, .nav-tabs a:hover {
  color: var(--bg-accent) !important;
  border-bottom-color: var(--bg-accent) !important;
  background: transparent !important;
}

.badge {
  background: var(--bg-accent) !important;
  color: var(--text-inverse) !important;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  border-radius: var(--radius-full) !important;
  font-size: var(--font-size-xs) !important;
  font-weight: 600;
}

#p_footer {
  background: var(--bg-secondary);
  padding: var(--spacing-2xl) var(--spacing-md) !important;
  margin-top: var(--spacing-2xl);
  border-top: 1px solid var(--border-color);
}

#p_footer a {
  color: var(--text-secondary) !important;
  margin: 0 var(--spacing-sm);
}

@media (max-width: 768px) {
  .dropdown {
    display: block !important;
    width: 100% !important;
  }
  .dropdown-toggle {
    width: 100% !important;
    text-align: left !important;
  }
  .dropdown-menu {
    position: static !important;
    width: 100% !important;
    margin: 0 !important;
  }
}

#t_drop select, #t_drop input[type="search"], #t_drop input[type="text"] {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  padding: var(--spacing-sm) !important;
}

#t_drop .btn, #t_drop input[type="submit"] {
  background: var(--bg-accent) !important;
  color: var(--text-inverse) !important;
  border: none !important;
  border-radius: var(--radius-full) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  font-weight: 500;
  transition: all var(--transition-fast) !important;
}

#t_drop .btn:hover, #t_drop input[type="submit"]:hover {
  background: var(--bg-accent-hover) !important;
  transform: translateY(-1px);
}

.table-bordered table {
  background: var(--bg-card) !important;
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  box-shadow: var(--shadow-sm) !important;
}

.hv_center {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-top: 1px solid var(--border-color) !important;
}

#cookie_notice a {
  color: var(--text-link) !important;
}

#cookie_notice div[onclick] {
  background: var(--bg-accent) !important;
  color: var(--text-inverse) !important;
  border: none !important;
  border-radius: var(--radius-md) !important;
  transition: all var(--transition-fast) !important;
}

#cookie_notice div[onclick]:hover {
  background: var(--bg-accent-hover) !important;
}

button, html input[type="button"], input[type="reset"], input[type="submit"] {
  cursor: pointer;
  -webkit-appearance: button;
  appearance: button;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

#share_providers > div > button > span, #share_providers > div > button > span:hover {
  background: unset !important;
  color: var(--text-primary) !important;
  padding: 0 !important;
  border-radius: unset !important;
  border: none !important;
}

.theme-toggle {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  background: var(--bg-accent);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: var(--z-sticky);
  transition: all var(--transition-fast);
  padding: 0 !important;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

@media (max-width: 768px) {
  .theme-toggle {
    bottom: var(--spacing-md);
    right: var(--spacing-md);
    width: 40px;
    height: 40px;
  }
}

.lc {
  background: var(--bg-secondary) !important;
  border-radius: var(--radius-md) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  margin-bottom: var(--spacing-md) !important;
  border: 1px solid var(--border-color) !important;
}

.lc .xcontrast_txt:not(.hide), .lc [class*="icon-"]:not(.hide) {
  background: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--border-color) !important;
  cursor: pointer !important;
  transition: all var(--transition-fast) !important;
  margin: 0 2px !important;
  display: inline-flex;
  align-items: center !important;
  gap: 2px !important;
  font-size: 14px !important;
}

.lc .xcontrast_txt:hover, .lc [class*="icon-"]:hover {
  background: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-sm) !important;
}

#f_width, #f_size {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  padding: var(--spacing-sm) !important;
  margin-top: var(--spacing-xs) !important;
  box-shadow: var(--shadow-md) !important;
  position: absolute !important;
  z-index: var(--z-dropdown) !important;
}

#f_width span, #f_size span {
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  margin: 0 2px !important;
  border-radius: var(--radius-sm) !important;
  cursor: pointer !important;
  transition: all var(--transition-fast) !important;
  color: var(--text-primary) !important;
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-subtle) !important;
  display: inline-block !important;
}

#f_width span:hover, #f_size span:hover {
  background: var(--bg-hover) !important;
  color: var(--bg-accent) !important;
  transform: translateY(-1px) !important;
}

.story-meta, .community-meta {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: var(--spacing-sm) !important;
  align-items: center !important;
  margin: var(--spacing-md) 0 !important;
  padding: var(--spacing-md) !important;
  background: var(--bg-secondary) !important;
  border-radius: var(--radius-md) !important;
  border: 1px solid var(--border-subtle) !important;
  box-shadow: var(--shadow-sm) !important;
}

.meta-item {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--spacing-xs) !important;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  border-radius: var(--radius-full) !important;
  font-size: var(--font-size-sm) !important;
  font-weight: 500 !important;
  transition: all var(--transition-fast) !important;
  position: relative !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}

.meta-item::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  opacity: 0.1 !important;
  z-index: -1 !important;
}

.meta-item:hover {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-sm) !important;
  animation: pulse 0.3s ease !important;
}

.meta-item:hover::before {
  opacity: 0.2 !important;
}

.meta-language { background: rgba(59, 130, 246, 0.1) !important; color: #3b82f6 !important; border: 1px solid rgba(59, 130, 246, 0.2) !important; }
.meta-language::before { background: #3b82f6 !important; }

.meta-genre { background: rgba(168, 85, 247, 0.1) !important; color: #a855f7 !important; border: 1px solid rgba(168, 85, 247, 0.2) !important; }
.meta-genre::before { background: #a855f7 !important; }

.meta-characters { background: rgba(236, 72, 153, 0.1) !important; color: #ec4899 !important; border: 1px solid rgba(236, 72, 153, 0.2) !important; }
.meta-characters::before { background: #ec4899 !important; }

.meta-chapters { background: rgba(16, 185, 129, 0.1) !important; color: #10b981 !important; border: 1px solid rgba(16, 185, 129, 0.2) !important; }
.meta-chapters::before { background: #10b981 !important; }

.meta-words { background: rgba(245, 158, 11, 0.1) !important; color: #f59e0b !important; border: 1px solid rgba(245, 158, 11, 0.2) !important; }
.meta-words::before { background: #f59e0b !important; }

.meta-reviews { background: rgba(139, 92, 246, 0.1) !important; color: #8b5cf6 !important; border: 1px solid rgba(139, 92, 246, 0.2) !important; }
.meta-reviews::before { background: #8b5cf6 !important; }

.meta-favs { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; border: 1px solid rgba(239, 68, 68, 0.2) !important; }
.meta-favs::before { background: #ef4444 !important; }

.meta-follows { background: rgba(34, 197, 94, 0.1) !important; color: #22c55e !important; border: 1px solid rgba(34, 197, 94, 0.2) !important; }
.meta-follows::before { background: #22c55e !important; }

.meta-updated { background: rgba(14, 165, 233, 0.1) !important; color: #0ea5e9 !important; border: 1px solid rgba(14, 165, 233, 0.2) !important; }
.meta-updated::before { background: #0ea5e9 !important; }

.meta-published { background: rgba(99, 102, 241, 0.1) !important; color: #6366f1 !important; border: 1px solid rgba(99, 102, 241, 0.2) !important; }
.meta-published::before { background: #6366f1 !important; }

.meta-status { background: rgba(16, 185, 129, 0.1) !important; color: #10b981 !important; border: 1px solid rgba(16, 185, 129, 0.2) !important; }
.meta-status.incomplete { background: rgba(251, 146, 60, 0.1) !important; color: #fb923c !important; border: 1px solid rgba(251, 146, 60, 0.2) !important; }
.meta-status.incomplete::before { background: #fb923c !important; }

.meta-id { background: rgba(107, 114, 128, 0.1) !important; color: #6b7280 !important; border: 1px solid rgba(107, 114, 128, 0.2) !important; }
.meta-id::before { background: #6b7280 !important; }

.meta-staff { background: rgba(59, 130, 246, 0.1) !important; color: #3b82f6 !important; border: 1px solid rgba(59, 130, 246, 0.2) !important; }
.meta-staff::before { background: #3b82f6 !important; }

.meta-archive { background: rgba(168, 85, 247, 0.1) !important; color: #a855f7 !important; border: 1px solid rgba(168, 85, 247, 0.2) !important; }
.meta-archive::before { background: #a855f7 !important; }

.meta-followers { background: rgba(236, 72, 153, 0.1) !important; color: #ec4899 !important; border: 1px solid rgba(236, 72, 153, 0.2) !important; }
.meta-followers::before { background: #ec4899 !important; }

.meta-since { background: rgba(14, 165, 233, 0.1) !important; color: #0ea5e9 !important; border: 1px solid rgba(14, 165, 233, 0.2) !important; }
.meta-since::before { background: #0ea5e9 !important; }

.meta-founder { background: rgba(245, 158, 11, 0.1) !important; color: #f59e0b !important; border: 1px solid rgba(245, 158, 11, 0.2) !important; }
.meta-founder::before { background: #f59e0b !important; }

.meta-item.meta-rating.rating-k { background-color: var(--rating-k-bg, rgba(76, 175, 80, 0.15)); color: var(--rating-k-text, #2e7d32); border: 1px solid var(--rating-k-border, rgba(76, 175, 80, 0.3)); border-radius: 4px; padding: 2px 6px; font-weight: bold; }

.meta-item.meta-rating.rating-kplus { background-color: var(--rating-kplus-bg, rgba(33, 150, 243, 0.15)); color: var(--rating-kplus-text, #1565c0); border: 1px solid var(--rating-kplus-border, rgba(33, 150, 243, 0.3)); border-radius: 4px; padding: 2px 6px; font-weight: bold; }

.meta-item.meta-rating.rating-t { background-color: var(--rating-t-bg, rgba(255, 152, 0, 0.15)); color: var(--rating-t-text, #f57c00); border: 1px solid var(--rating-t-border, rgba(255, 152, 0, 0.3)); border-radius: 4px; padding: 2px 6px; font-weight: bold; }

.meta-item.meta-rating.rating-m { background-color: var(--rating-m-bg, rgba(244, 67, 54, 0.15)); color: var(--rating-m-text, #c62828); border: 1px solid var(--rating-m-border, rgba(244, 67, 54, 0.3)); border-radius: 4px; padding: 2px 6px; font-weight: bold; }

[data-theme="dark"] .meta-item {
  filter: brightness(1.2) !important;
}

[data-theme="dark"] .meta-item::before {
  opacity: 0.2 !important;
}

[data-theme="dark"] .meta-item:hover::before {
  opacity: 0.3 !important;
}

[data-theme="dark"] .meta-item.meta-rating.rating-k { background-color: var(--rating-k-bg-dark, rgba(76, 175, 80, 0.2)); color: var(--rating-k-text-dark, #81c784); border-color: var(--rating-k-border-dark, rgba(76, 175, 80, 0.4)); }

[data-theme="dark"] .meta-item.meta-rating.rating-kplus { background-color: var(--rating-kplus-bg-dark, rgba(33, 150, 243, 0.2)); color: var(--rating-kplus-text-dark, #64b5f6); border-color: var(--rating-kplus-border-dark, rgba(33, 150, 243, 0.4)); }

[data-theme="dark"] .meta-item.meta-rating.rating-t { background-color: var(--rating-t-bg-dark, rgba(255, 152, 0, 0.2)); color: var(--rating-t-text-dark, #ffb74d); border-color: var(--rating-t-border-dark, rgba(255, 152, 0, 0.4)); }

[data-theme="dark"] .meta-item.meta-rating.rating-m { background-color: var(--rating-m-bg-dark, rgba(244, 67, 54, 0.2)); color: var(--rating-m-text-dark, #e57373); border-color: var(--rating-m-border-dark, rgba(244, 67, 54, 0.4)); }

@media (max-width: 768px) {
  .story-meta, .community-meta {
    gap: var(--spacing-xs) !important;
    padding: var(--spacing-sm) !important;
  }
  .meta-item {
    font-size: var(--font-size-xs) !important;
    padding: 2px 8px !important;
  }
}

.mce-panel, div.mce-edit-area {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

.loading {
  background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-tertiary) 50%, var(--bg-secondary) 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.meta-processed {
  display: none !important;
}

html {
  scroll-behavior: smooth;
}

::selection {
  background: var(--bg-accent);
  color: var(--text-inverse);
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  border: 2px solid var(--bg-secondary);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.lc-wrapper {
  margin: var(--spacing-md) 0 !important;
}

.lc-left a {
  color: var(--text-secondary) !important;
  font-size: var(--font-size-sm);
}

.lc-left {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.icon-chevron-right {
  margin: 0 var(--spacing-xs) !important;
  color: var(--text-tertiary) !important;
}

.xgray {
  color: var(--text-tertiary) !important;
  font-size: var(--font-size-sm) !important;
}

#review {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

a:focus, button:focus, input:focus, select:focus, textarea:focus {
  outline: 2px solid var(--bg-accent) !important;
  outline-offset: 2px;
}

.open {
    *z-index: 1000
}

.open > .dropdown-menu {
    display: block !important
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@media print {
  .theme-toggle, #top, .zmenu, #p_footer {
    display: none !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
}
`;
  document.head.appendChild(style);

  // Genre list for parsing
  const GENRES = new Set([
    'Adventure', 'Angst', 'Crime', 'Drama', 'Family', 'Fantasy', 'Friendship', 'General', 'Horror',
    'Humor', 'Hurt/Comfort', 'Mystery', 'Parody', 'Poetry', 'Romance', 'Sci-Fi',
    'Spiritual', 'Supernatural', 'Suspense', 'Tragedy', 'Western'
  ]);

  // Rating symbols with CSS-based badges for better compatibility
  function createRatingBadge(rating) {
    const colors = {
      'K': { bg: '#4caf50', border: '#2e7d32' },
      'K+': { bg: '#2196f3', border: '#1565c0' },
      'T': { bg: '#ff9800', border: '#f57c00' },
      'M': { bg: '#f44336', border: '#c62828' }
    };

    const color = colors[rating] || { bg: '#757575', border: '#424242' };

    return `<span class="rating-badge rating-${rating}" style="
      display: inline-block;
      border-radius: ${rating === 'K+' ? '12px' : rating === 'K' ? '50%' : '4px'};
      color: white;
      font-size: 15px;
      font-weight: bold;
      padding: ${rating === 'K+' ? '2px 6px' : '3px'};
      min-width: ${rating === 'K+' ? '20px' : '16px'};
      height: 23px;
      text-align: center;
      font-family: Arial, sans-serif;
      margin-right: 4px;
      vertical-align: middle;
    ">${rating}</span>`;
  }

  // Helper function to get rating symbol
  function getRatingSymbol(rating) {
    return createRatingBadge(rating);
  }

  // Preserve existing FF.net functions and make them work with the new theme
  const originalFunctions = {};

  // Wait for page to load before overriding functions
  function initializeFunctionOverrides() {
    // Store original FF.net functions
    if (window._fontastic_change_size) {
      originalFunctions._fontastic_change_size = window._fontastic_change_size;
    }
    if (window._fontastic_change_width) {
      originalFunctions._fontastic_change_width = window._fontastic_change_width;
    }
    if (window._fontastic_change_line_height) {
      originalFunctions._fontastic_change_line_height = window._fontastic_change_line_height;
    }

    // Global theme toggle function
    window.toggleTheme = function () {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      GM_setValue('theme', newTheme);

      // Update our theme toggle button if it exists
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        if (newTheme === 'dark') {
          if (sunIcon) sunIcon.style.display = 'none';
          if (moonIcon) moonIcon.style.display = 'block';
        } else {
          if (sunIcon) sunIcon.style.display = 'block';
          if (moonIcon) moonIcon.style.display = 'none';
        }
      }
    };
  }

function enhanceMetadata() {
  console.log('Running metadata enhancement...');

  // Helper function to parse metadata from different formats
  function parseStoryMetadata(element, html, text) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let rating = '';
    let language = '';
    let foundGenres = [];
    let characters = [];
    let fandom = '';
    let fandomLabel = 'Fandom';
    let fandomValue = '';

    // Extract fandom (appears at the beginning before "Rated:")
    // Handle both regular fandoms and crossovers
    const fandomMatch = text.match(/^((?:Crossover\s*-\s*)?.+?)\s*-\s*Rated:/);

    if (fandomMatch) {
      fandom = fandomMatch[1].trim();

      // Normalize dashes and check for crossover
      const normalized = fandom.replace(/\s*[-–—]\s*/g, ' - ').trim();

      if (normalized.startsWith('Crossover - ')) {
        fandomLabel = 'Crossover';
        fandomValue = normalized.replace(/Crossover - /, '').trim();
      } else {
        fandomLabel = 'Fandom';
        fandomValue = normalized;
      }
    }

    // Extract rating - FIXED to ignore "Fiction" prefix
    const ratingLink = tempDiv.querySelector('a[href*="fictionratings"]');
    if (ratingLink) {
      const ratingText = ratingLink.textContent.trim();
      // Remove "Fiction" prefix and extract just the rating (K, K+, T, M)
      rating = ratingText.replace(/^Fiction\s*/, '').trim();
    } else {
      const ratingMatch = html.match(/Rated:\s*([^-\s<]+)/);
      if (ratingMatch) rating = ratingMatch[1];
    }

    // Extract language - usually the first item after "Rated:"
    const afterRated = text.split('Rated:')[1];
    if (afterRated) {
      const langMatch = afterRated.match(/^\s*[^-]*?\s*-\s*([A-Za-z]+)\s*-/);
      if (langMatch) language = langMatch[1];
    }

    // Extract genres - look for known genres in the text
    GENRES.forEach(g => {
      const regex = new RegExp(`\\b${g}\\b`, 'i');
      if (regex.test(html)) foundGenres.push(g);
    });

    // Alternative genre extraction for format like "Adventure/Fantasy"
    if (foundGenres.length === 0) {
      const genreMatch = text.match(/-\s*[A-Za-z]+\s*-\s*([^-]+?)\s*-\s*Chapters:/);
      if (genreMatch) {
        const genreText = genreMatch[1].trim();
        const genreParts = genreText.split(/[\/,]/).map(g => g.trim());
        genreParts.forEach(part => {
          if (GENRES.has(part)) {
            foundGenres.push(part);
          }
        });
      }
    }

    // Extract characters - look for characters at the end or in brackets
    const charsMatch = html.match(/\[([^\]]+)\]/);
    if (charsMatch) {
      characters = charsMatch[1].split(',').map(s => s.trim());
    } else {
      // For div format, characters are usually at the end after the last span
      const afterPublished = text.split('Published:')[1];
      if (afterPublished) {
        const charMatch = afterPublished.match(/>\s*([^<]+?)\s*-\s*(.+)$/);
        if (charMatch) {
          characters = charMatch[2].split(/[,&]/).map(c => c.trim()).filter(c => c);
        }
      }
    }

    // Extract numeric values
    const chapters = (html.match(/Chapters:\s*([\d,]+)/i) || [])[1] || '';
    const words = (html.match(/Words:\s*([\d,]+)/i) || [])[1] || '';
    const reviewsNum = (html.match(/Reviews:\s*([\d,]+)/i) || [])[1] || '';
    const favsNum = (html.match(/Favs:\s*([\d,]+)/i) || [])[1] || '';
    const followsNum = (html.match(/Follows:\s*([\d,]+)/i) || [])[1] || '';

    // Extract dates from span elements
    const timeSpans = tempDiv.querySelectorAll('span[data-xutime]');
    let updated = '';
    let published = '';

    if (timeSpans.length > 0) {
      if (text.includes('Updated:')) {
        updated = timeSpans[0].textContent.trim();
        if (timeSpans.length > 1) {
          published = timeSpans[1].textContent.trim();
        }
      } else {
        published = timeSpans[0].textContent.trim();
      }
    }

    // Fallback date extraction
    if (!updated && !published) {
      updated = (html.match(/Updated:\s*<span[^>]*>([^<]+)<\/span>/i) || [])[1] || '';
      published = (html.match(/Published:\s*<span[^>]*>([^<]+)<\/span>/i) || [])[1] || '';
    }

    // Extract ID
    const id = (html.match(/id:\s*(\d+)/i) || [])[1] || '';

    // Detect completion status
    const isComplete = html.includes('Complete');

    return {
      fandom, fandomLabel, fandomValue, rating, language, foundGenres, characters, chapters, words,
      reviewsNum, favsNum, followsNum, updated, published, id, isComplete, tempDiv
    };
  }

  // Helper function to create metadata items
  function addMetaItem(container, className, icon, label, value, link = null) {
    if (!value) return;

    const item = document.createElement('span');
    item.className = `meta-item ${className}`;

    // Add rating-specific color class
    if (className === 'meta-rating') {
      item.classList.add(`rating-${value.toLowerCase().replace('+', 'plus')}`);
    }

    if (link) {
      const a = document.createElement('a');
      a.href = link;
      a.style.color = 'inherit';
      a.style.textDecoration = 'none';

      // For rating badges (HTML content), use innerHTML
      if (className === 'meta-rating' && typeof icon === 'string' && icon.includes('<span')) {
        a.innerHTML = `${icon} ${label}: ${value}`;
      } else {
        a.textContent = `${icon} ${label}: ${value}`;
      }

      item.appendChild(a);
    } else {
      // For rating badges (HTML content), use innerHTML
      if (className === 'meta-rating' && typeof icon === 'string' && icon.includes('<span')) {
        item.innerHTML = `${icon} ${label}: ${value}`;
      } else {
        item.textContent = `${icon} ${label}: ${value}`;
      }
    }

    container.appendChild(item);
  }

    // Process story metadata spans (original format)
    const storySpans = document.querySelectorAll('span.xgray.xcontrast_txt');
    storySpans.forEach(span => {
      if (span.classList.contains('meta-processed') || span.querySelector('.story-meta')) {
        return;
      }

      const html = span.innerHTML;
      const text = span.textContent || '';

      // Skip if doesn't look like story metadata
      if (!text.includes('Rated:') && !text.includes('Chapters:') && !text.includes('Words:')) {
        return;
      }

      const metadata = parseStoryMetadata(span, html, text);

      // Create new metadata container
      const metaContainer = document.createElement('div');
      metaContainer.className = 'story-meta';

      // Add metadata items
      if (metadata.fandom) addMetaItem(metaContainer, 'meta-fandom', '📖', metadata.fandomLabel, metadata.fandomValue);
      if (metadata.rating) addMetaItem(metaContainer, 'meta-rating', getRatingSymbol(metadata.rating), 'Rated', metadata.rating);
      if (metadata.language) addMetaItem(metaContainer, 'meta-language', '🌐', 'Language', metadata.language);
      if (metadata.foundGenres.length) addMetaItem(metaContainer, 'meta-genre', '🎭', 'Genres', metadata.foundGenres.join('/'));
      if (metadata.characters.length) addMetaItem(metaContainer, 'meta-characters', '👥', 'Characters', metadata.characters.join(', '));
      if (metadata.chapters) addMetaItem(metaContainer, 'meta-chapters', '📚', 'Chapters', metadata.chapters);
      if (metadata.words) addMetaItem(metaContainer, 'meta-words', '📝', 'Words', metadata.words);

      if (metadata.reviewsNum) {
        const reviewsLink = metadata.tempDiv.querySelector('a[href^="/r/"]');
        addMetaItem(metaContainer, 'meta-reviews', '💬', 'Reviews', metadata.reviewsNum, reviewsLink ? reviewsLink.href : null);
      }

      if (metadata.favsNum) addMetaItem(metaContainer, 'meta-favs', '❤️', 'Favs', metadata.favsNum);
      if (metadata.followsNum) addMetaItem(metaContainer, 'meta-follows', '👣', 'Follows', metadata.followsNum);
      if (metadata.updated) addMetaItem(metaContainer, 'meta-updated', '📆', 'Updated', metadata.updated);
      if (metadata.published) addMetaItem(metaContainer, 'meta-published', '📅', 'Published', metadata.published);

      if (metadata.isComplete) {
        addMetaItem(metaContainer, 'meta-status', '✅', 'Status', 'Complete');
      } else if (metadata.chapters) {
        addMetaItem(metaContainer, 'meta-status incomplete', '📝', 'Status', 'In Progress');
      }

      if (metadata.id) addMetaItem(metaContainer, 'meta-id', '🔢', 'ID', metadata.id);

      // Replace original span with new metadata
      span.style.display = 'none';
      span.classList.add('meta-processed');
      span.parentNode.insertBefore(metaContainer, span.nextSibling);
    });

    // Process div format (new format compatibility)
    const storyDivs = document.querySelectorAll('div.z-padtop2.xgray');
    storyDivs.forEach(div => {
      if (div.classList.contains('meta-processed') || div.querySelector('.story-meta')) {
        return;
      }

      const html = div.innerHTML;
      const text = div.textContent || '';

      // Check if this div contains story metadata (has Rated: and story stats)
      if (text.includes('Rated:') && (text.includes('Chapters:') || text.includes('Words:'))) {
        const metadata = parseStoryMetadata(div, html, text);

        // Create new metadata container
        const metaContainer = document.createElement('div');
        metaContainer.className = 'story-meta';

        // Add metadata items
        if (metadata.fandom) addMetaItem(metaContainer, 'meta-fandom', '📖', metadata.fandomLabel, metadata.fandomValue);
        if (metadata.rating) addMetaItem(metaContainer, 'meta-rating', getRatingSymbol(metadata.rating), 'Rated', metadata.rating);
        if (metadata.language) addMetaItem(metaContainer, 'meta-language', '🌐', 'Language', metadata.language);
        if (metadata.foundGenres.length) addMetaItem(metaContainer, 'meta-genre', '🎭', 'Genres', metadata.foundGenres.join('/'));
        if (metadata.characters.length) addMetaItem(metaContainer, 'meta-characters', '👥', 'Characters', metadata.characters.join(', '));
        if (metadata.chapters) addMetaItem(metaContainer, 'meta-chapters', '📚', 'Chapters', metadata.chapters);
        if (metadata.words) addMetaItem(metaContainer, 'meta-words', '📝', 'Words', metadata.words);

        if (metadata.reviewsNum) {
          const reviewsLink = metadata.tempDiv.querySelector('a[href^="/r/"]');
          addMetaItem(metaContainer, 'meta-reviews', '💬', 'Reviews', metadata.reviewsNum, reviewsLink ? reviewsLink.href : null);
        }

        if (metadata.favsNum) addMetaItem(metaContainer, 'meta-favs', '❤️', 'Favs', metadata.favsNum);
        if (metadata.followsNum) addMetaItem(metaContainer, 'meta-follows', '👣', 'Follows', metadata.followsNum);
        if (metadata.updated) addMetaItem(metaContainer, 'meta-updated', '📆', 'Updated', metadata.updated);
        if (metadata.published) addMetaItem(metaContainer, 'meta-published', '📅', 'Published', metadata.published);

        if (metadata.isComplete) {
          addMetaItem(metaContainer, 'meta-status', '✅', 'Status', 'Complete');
        } else if (metadata.chapters) {
          addMetaItem(metaContainer, 'meta-status incomplete', '📝', 'Status', 'In Progress');
        }

        if (metadata.id) addMetaItem(metaContainer, 'meta-id', '🔢', 'ID', metadata.id);

        // Replace original div with new metadata
        div.style.display = 'none';
        div.classList.add('meta-processed');
        div.parentNode.insertBefore(metaContainer, div.nextSibling);
        return; // Skip community processing for this div
      }
    });

    // Process community metadata (remaining divs that aren't story metadata)
    const communityDivs = document.querySelectorAll('div.z-padtop2.xgray:not(.meta-processed)');
    communityDivs.forEach(div => {
      const text = div.textContent || '';

      // Skip if already processed, contains story metadata, or doesn't contain community metadata
      if (div.classList.contains('meta-processed') ||
          div.querySelector('.community-meta') ||
          text.includes('Rated:') ||
          (!text.includes('Staff:') && !text.includes('Archive:') && !text.includes('Founder:'))) {
        return;
      }

      const metaContainer = document.createElement('div');
      metaContainer.className = 'community-meta';

      function addCommunityMeta(className, icon, label, pattern) {
        const match = text.match(pattern);
        if (match) {
          const item = document.createElement('span');
          item.className = `meta-item ${className}`;
          item.textContent = `${icon} ${label}: ${match[1].trim()}`;
          metaContainer.appendChild(item);
        }
      }

      addCommunityMeta('meta-staff', '🧑‍💼', 'Staff', /Staff:\s*(\d+)/);
      addCommunityMeta('meta-archive', '📦', 'Archive', /Archive:\s*(\d+)/);
      addCommunityMeta('meta-followers', '👥', 'Followers', /Followers:\s*(\d+)/);
      addCommunityMeta('meta-since', '📅', 'Since', /Since:\s*(\d{2}-\d{2}-\d{2})/);
      addCommunityMeta('meta-founder', '👑', 'Founder', /Founder:\s*(.+?)(?:\s*-|$)/);

      if (metaContainer.children.length > 0) {
        div.style.display = 'none';
        div.classList.add('meta-processed');
        div.parentNode.insertBefore(metaContainer, div.nextSibling);
      }
    });
  }

  // Initialize when DOM is ready
  function initialize() {
    initializeFunctionOverrides();

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="sun-icon" d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="moon-icon" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="currentColor" style="display: none;"/>
      </svg>
    `;

    document.body.appendChild(themeToggle);
    themeToggle.addEventListener('click', window.toggleTheme);

    // Set initial theme and icon state
    const currentTheme = GM_getValue('theme', 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);

    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    if (currentTheme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }

    // Run metadata enhancement
    setTimeout(enhanceMetadata, 100);

    // Watch for dynamic content changes
    const observer = new MutationObserver(enhanceMetadata);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Handle different loading states
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();