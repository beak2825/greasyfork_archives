// ==UserScript==
// @name Hiển thị mã giảm giá và chặn nhảy trang
// @description Hiển thị mã giảm giá và chặn nhảy trang tại các trang chia sẽ mã giảm giá
// @namespace None
// @version 0.0.11
// @match  http*://bloggiamgia.vn/*
// @match  http*://magiamgialazada.vn/*
// @match  http*://magiamgiashopee.vn/*
// @match  http*://mgg.vn/*
// @match  http*://chanhtuoi.com/*
// @match  http*://hieuvoz.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/384522/Hi%E1%BB%83n%20th%E1%BB%8B%20m%C3%A3%20gi%E1%BA%A3m%20gi%C3%A1%20v%C3%A0%20ch%E1%BA%B7n%20nh%E1%BA%A3y%20trang.user.js
// @updateURL https://update.greasyfork.org/scripts/384522/Hi%E1%BB%83n%20th%E1%BB%8B%20m%C3%A3%20gi%E1%BA%A3m%20gi%C3%A1%20v%C3%A0%20ch%E1%BA%B7n%20nh%E1%BA%A3y%20trang.meta.js
// ==/UserScript==
if (window.location.host === 'bloggiamgia.vn' || window.location.host === 'magiamgialazada.vn' || window.location.host === 'magiamgiashopee.vn') {
  unsafeWindow.open = function () {};

  document.querySelectorAll('.polyxgo_get_coupon').forEach(function (element) {
    if (element.classList.contains('polyxgo_no_coupons')) return;
    var REGEX = /prompt\('.+?', '(.*?)'\)/;
    var TEXT = element.querySelector('.btn-your-voucher-code').getAttribute('onclick');
    var COUPON_CODE = TEXT.match(REGEX)[1];
    element.querySelector('.coupon-button').textContent = COUPON_CODE;
    element.querySelector('.code-coupon').remove();
  });
}

if (window.location.host === 'mgg.vn') {
  unsafeWindow.open = function () {};

  document.querySelectorAll('.get-code').forEach(function (element) {
    element.remove();
  });
}

if (window.location.host === 'chanhtuoi.com') {
  unsafeWindow.open = function () {};

  document.querySelectorAll('.cs-btn-coupon').forEach(function (element) {
    element.querySelector('.ec-text').remove();
  });
}

if (window.location.host === 'hieuvoz.com') {
  unsafeWindow.open = function () {};

  document.querySelectorAll('.su-button').forEach(function (element) {
    element.href = "javascript:void(0)";
    var TEXT = element.getAttribute('onclick');
    if (typeof TEXT != 'string') return;
    if (TEXT === null) return;
    if (TEXT === '') return;
    var REGEX = /prompt\('.+?','(.*?)'\)/;
    var match = TEXT.match(REGEX);
    if (!match) return;
    var COUPON_CODE = match[1];
    element.querySelector('span').textContent = COUPON_CODE;
  });
}