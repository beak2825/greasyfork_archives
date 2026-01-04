// ==UserScript==
// @name        Remove HTML Hidden Links
// @namespace   http://98y89hurdfg
// @include     https://*
// @include     http://*
// @description Remove hidden links on modern HTML anchor elements.  a.href should ALWAYS be the real link.  DOWN WITH W3 CONSORTIUM! DOWN WITH THE INTERNET TAKEOVER!  DEATH TO THE CONSPIRATORS!
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33577/Remove%20HTML%20Hidden%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/33577/Remove%20HTML%20Hidden%20Links.meta.js
// ==/UserScript==


var a = document.getElementsByTagName("a");
for (var x=1; x<=a.length; x++) {
  try {
  if (a[x].getAttribute("data-outbound-url")) {
    a[x].removeAttribute("data-outbound-url");
  }} catch(e){}
  try {
  if (a[x].getAttribute("data-href-url")) {
    a[x].removeAttribute("data-href-url");
  }} catch(e){}
  try {
  if (a[x].getAttribute("data-outbound-expiration")) {
    a[x].removeAttribute("data-outbound-expiration");
  }} catch(e){}
  try {
  if (a[x].getAttribute("data-event-action")) {
    a[x].removeAttribute("data-event-action");
  }} catch(e){}
  try {
  if (a[x].getAttribute("rel")) {
    a[x].removeAttribute("rel");
  }} catch(e){}
  try {
  if (a[x].getAttribute("data-inbound-url")) {
    a[x].removeAttribute("data-inbound-url");
  }} catch(e){}
}

