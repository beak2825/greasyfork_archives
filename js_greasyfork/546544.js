// ==UserScript==
//
// Written by Glenn Wiking
// Script Version: 0.1.5
//
//
// @name        Craft Pro
// @namespace   CP
// @description Provides Dark Mode for Craft CMS as well as a few small but useful features
// @version     0.1.5
// @icon        https://i.imgur.com/800xoXB.png
// @license			MIT
// @grant       GM.xmlHttpRequest
// @connect     liveavirgin.be

// @include			*

// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require		https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require		https://code.jquery.com/ui/1.14.1/jquery-ui.js

// @downloadURL https://update.greasyfork.org/scripts/546544/Craft%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/546544/Craft%20Pro.meta.js
// ==/UserScript==

if ( $("craft-global-sidebar").length ) {

  console.clear();
  const iconSections = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M160 64c-17.7 0-32 14.3-32 32l0 320c0 11.7-3.1 22.6-8.6 32L432 448c26.5 0 48-21.5 48-48l0-304c0-17.7-14.3-32-32-32L160 64zM64 480c-35.3 0-64-28.7-64-64L0 160c0-35.3 28.7-64 64-64l0 32c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32L96 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 304c0 44.2-35.8 80-80 80L64 480zM384 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zM160 304c0-8.8 7.2-16 16-16l256 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-256 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l256 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-256 0c-8.8 0-16-7.2-16-16zm32-144l128 0 0-96-128 0 0 96zM160 120c0-13.3 10.7-24 24-24l144 0c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24l0-112z'></path></svg>`
  const iconEntryTypes = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M160 384c-17.7 0-32-14.3-32-32l0-288c0-17.7 14.3-32 32-32l144 0 0 80c0 17.7 14.3 32 32 32l80 0c0 .3 0 .5 0 .8L416 352c0 17.7-14.3 32-32 32l-224 0zM336 57.5L390 112l-54 0 0-54.5zM160 0C124.7 0 96 28.7 96 64l0 288c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-207.2c0-12.7-5-24.8-13.9-33.8l-96-96.8C329.1 5.1 316.8 0 304 0L160 0zM32 112c0-8.8-7.2-16-16-16s-16 7.2-16 16L0 384c0 70.7 57.3 128 128 128l208 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-208 0c-53 0-96-43-96-96l0-272z'></path></svg>`
  const iconFields = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144L0 432c0 44.2 35.8 80 80 80l288 0c44.2 0 80-35.8 80-80l0-128c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 128c0 26.5-21.5 48-48 48L80 480c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48l128 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L80 64z'></path></svg>`
  const iconBulb = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path d='M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z'></path></svg>`
  const iconBlank = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class='icon-base'><path d="M32 480a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm96-64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0-384a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM320 416a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0-320a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 128a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM224 480a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0-448a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM416 416a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0-384a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM32 96a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM416 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM32 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm192 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm192 64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM32 320a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM416 192a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM32 128a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm192 64a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"></path></svg>`;
  const iconClose = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`
  const iconDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg>`
  const iconTag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z"/></svg>`
  const iconTags = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z"/></svg>`
  const iconReverse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M406.6 202.6c-7.7-21.8-20.2-42.3-37.8-59.8c-62.5-62.5-163.8-62.5-226.3 0L125.5 160l34.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48.3 224c0 0 0 0 0 0l-.4 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32s32 14.3 32 32l0 35.2L97.4 97.6c87.5-87.5 229.3-87.5 316.8 0c24.4 24.4 42.1 53.1 52.9 83.7c5.9 16.7-2.9 34.9-19.5 40.8s-34.9-2.9-40.8-19.5zm66.1 86.6c5 1.5 9.8 4.2 13.7 8.2c4 4 6.7 8.9 8.1 14c.3 1.2 .6 2.5 .8 3.8c.3 1.7 .4 3.4 .4 5.1l0 111.6c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-35.1-17.6 17.5c0 0 0 0 0 0c-87.5 87.4-229.3 87.4-316.7 0C73 390 55.3 361.3 44.5 330.6c-5.9-16.7 2.9-34.9 19.5-40.8s34.9 2.9 40.8 19.5c7.7 21.8 20.2 42.3 37.8 59.8c62.5 62.5 163.8 62.5 226.3 0l.1-.1L386.1 352l-34.4 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l111.6 0c1.6 0 3.2 .1 4.8 .3s3.1 .5 4.6 1z"></path></svg>`;
  const iconCopy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"></path></svg>`
  const iconPaste = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></svg>`
  const iconAlert = `<svg viewBox="0 0 640 640"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"/></svg>`
  let styleBase = "";
  let styleBookmarks = "";
  let styleDarkmode = "";


  styleBase = ""
  + ".darkmode-toggler {display: flex; flex-direction: row; justify-content: flex-start; align-items: flex-start; gap: 8px; cursor: pointer; padding: 5px 0;}"
  + ".darkmode-toggler > svg {height: 22px; width: 20px; fill: var(--blue-600);}"
  + ".darkmode-toggler > span {width: auto; display: inline-block; color: var(--blue-600);}"
  + ".pro-autotrace-cont {margin-bottom: 18px; margin-top: -10px;}"
  + ".message-container {background: var(--gray-800);}"
  + "";

  stylesheet( "style-base", "Base styles", styleBase );

  console.log( $(".sidebar-actions") );
  $(".sidebar-actions").before("<div class='cp-bookmarks-cont'><div class='bookmarks-ui'><div class='bookmarks-import-export'>"+ iconReverse +"</div><div class='bookmarks-tag'>"+ iconTag +"</div></div><div class='cp-bookmarks'></div></div>");
  //$(".cp-bookmarks").append("<a class='cp-bookmark' href='http://laserdays.ddev.site/admin/settings/sections' nth='0'>"+ iconSections +"</a>");
  //$(".cp-bookmarks").append("<a class='cp-bookmark' href='http://laserdays.ddev.site/admin/settings/entry-types' nth='1'>"+ iconEntryTypes +"</a>");
  //$(".cp-bookmarks").append("<a class='cp-bookmark' href='http://laserdays.ddev.site/admin/settings/fields' nth='2'>"+ iconFields +"</a>");
  let proBookmarks = [];

  // Bookmarks
  if ( localStorage.getItem("pro-bookmarks")!= null ) {
    const bmLoaded = localStorage.getItem("pro-bookmarks").split("‰");
    if ( bmLoaded.length && bmLoaded[0].length ) {
      //console.log( bmLoaded );
      bmLoaded.forEach( function( loaded ) {
        //console.log( loaded );
        const loadedID = loaded.split("id=")[1].split("¥")[0];
        const loadedUnique = loaded.split("¥unique=")[1].split("¥")[0];
        const loadedLink = loaded.split("¥link=")[1].split("¥")[0];
        const loadedSVG = loaded.split("¥svg=")[1].split("¥")[0];
        const loadedLabel = loaded.split("¥label=")[1].split("¥")[0];
        addBookmark( loadedID, loadedUnique, loadedLink, loadedSVG, loadedLabel );
      });
    }
  }

  let baseBookmarks = "";
  if ( localStorage.getItem("pro-bookmarks") == null ) {
    localStorage.setItem("pro-bookmarks", "");
  } else {
    if ( localStorage.getItem("pro-bookmarks").length )	{
      baseBookmarks = localStorage.getItem("pro-bookmarks").split("‰");

      //proBookmarks = baseBookmarks.split("‰");
    }
  }

  const genLib = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZY0123456789-_²³!?";
  function unique( count ) {
    let output = "";
    for ( i = 0; i < count; i++ ) {
      output = output + genLib[ Math.round( Math.random() * (genLib.length - 1) ) ];
    }
    return output;
  }

  styleBookmarks = ""
  + ".cp-bookmarks-cont {position: relative;}"
  + ".bookmarks-ui {position: absolute; top: 4px; right: 10px; display: flex; gap: 5px; flex-direction: row;}"
  + ".bookmarks-tag, .bookmarks-import-export {fill: var(--gray-900); height: 16px; width: 16px; z-index: 2; cursor: pointer;}"
  + ".bookmarks-tag:hover, .bookmarks-import-export:hover {fill: var(--gray-700);}"
  + ".bookmarks-import-export {width: 13px;}"
  + ".cp-bookmarks:empty, .cp-bookmarks-cont:has(.cp-bookmarks:empty) .bookmarks-tag, .cp-bookmarks-cont:has(.cp-bookmarks:empty) .bookmarks-import-export {display: none;}"
  + ".cp-bookmarks {position: relative; height: auto; padding: 28px 16px 8px 16px; justify-content: left; border-bottom: 1px solid var(--gray-150); text-align: center; display: flex; align-items: flex-start; flex-wrap: wrap; gap: 12px;}"
  + ".cp-bookmarks::before {content: 'Bookmarks';position: absolute; top: 0px; font-size: 12px; cursor: text; color: var(--gray-900);}"
  + ".cp-bookmarks.tagged {gap: 26px; padding-bottom: 14px;}"
  + ".cp-bookmark {height: 20.2px; width: 20px; padding: 4px 4px; box-sizing: content-box; color: var(--gray-800); position: relative;}"
  + ".cp-bookmark:hover {opacity: .85;}"
  + ".cp-bookmark > svg {height: inherit;}"
  + ".cp-bookmark svg.dark, .cp-bookmark svg.dark path {fill: var(--gray-800) !important;}"
  + ".bookmark-svg-buttons {display: flex; gap: 10px; width: 100%; margin-bottom: 8px;}"
  + "#global-sidebar[data-state='collapsed'] .cp-bookmarks {display: none}"
  + ".bookmark-dialog, .bookmark-modal, .bookmark-list-modal {position: fixed; top: 50%; left: 50%; height: auto; width: auto; min-height: 15vh; min-width: 50vw; background: var(--gray-150); border-radius: 7px; box-sizing: var(--pane-shadow); transform: translateX(-50%) translateY(-50%); z-index: 255; padding: 30px 35px 35px; opacity: 0; pointer-events: none;}"
  + ".bookmark-dialog.on, .bookmark-modal.on, .bookmark-list-modal.on {opacity: 1; pointer-events: all;}"
  + ".bookmark-modal, .bookmark-list-modal {z-index: 257;}"
  + ".dialog-closer, .modal-closer {height: 20px;width: 20px; position: absolute; top: 20px; right: 20px; cursor: pointer; opacity: 1;}"
  + ".dialog-closer:hover, .modal-closer {opacity .8}"
  + ".bookmark-dialog-icon {display: inline-block; height: auto; width: 25px; padding: 5px 5px; box-sizing: content-box; background: var(--gray-200); border: 1px solid var(--gray-300); border-radius: 5px;}"
  + ".bookmark-dialog-icon:hover {background: var(--gray-300); border: 1px solid var(--gray-400);}"
  + ".bookmark-dialog-icon svg {max-width: 27px; height: auto !important;}"
  + ".bookmark-dialog-icon svg.dark path, .cp-bookmark:has(svg.dark) {fill: currentColor;}"
  + ".bookmark-form-item {display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; position: relative;}"
  + ".bookmark-form-item textarea {padding: 5px 8px; border-radius: 3px; max-width: 600px; min-width: 500px; min-height: 120px; max-height: 400px; font-size: 12px; line-height: 1.3em; width: 100%}"
  + ".bookmark-form-item input {padding: 5px 8px; border-radius: 3px; max-width: 600px;}"
  + ".bookmark-form-item:has(.bookmark-dialog-icon) {flex-direction: row; flex-wrap: wrap;}"
  + ".bookmark-form-item label[for='bookmark-svg'] {width: 100%;}"
  + ".bookmark-form-item:has([name='bookmark-unique']) {display: none;}"
  + ".bookmark-toggle-dark {height: 37px;}"
  + ".bookmark-toggle-dark svg {width: 12px; height: 16px;}"
  + ".bookmark-toggle-dark.on {background: var(--gray-900); color: var(--white); fill: var(--white);}"
  + ".bookmark-title, .bookmark-modal-title {margin-top: 0;}"
  + ".bookmark-title span {font-style: italic;}"
  + ".bookmark-shield, .bookmark-modal-shield, .bookmark-list-modal-shield {position: fixed; top: 0; left: 0; height: 100%; width: 100%; background: rgba(0,0,0,.7); z-index: 254; cursor: pointer; opacity: 0; pointer-events: none;}"
  + ".bookmark-shield.on, .bookmark-modal-shield.on, .bookmark-list-modal-shield.on {opacity: .7; pointer-events: all;}"
  + ".bookmark-modal-shield, .bookmark-list-modal-shield {z-index: 256;}"
  + ".bookmark-form-buttons, .bookmark-dialog-buttons {display: flex; gap: 8px;}"
  + ".bookmark-dialog[error='exists'] .bookmark-save, .btn.locked {background: var(--rose-900) !important; filter: grayscale(0.7); opacity: .6;}"
  + ".bookmark-dialog-error {font-size: 14px; color: var(--red-500)}"
  + ".bookmark-dialog[error='exists'] input[name='bookmark-href'] {box-shadow: 0 0 0 2px var(--red-600),0 0 5px 1px hsl(from var(--red-600) h s 1/0.85);}"
  + ".cp-bookmark-close {position: absolute; top: -3px; right: -3px; height: 12px; width: 12px; background: var(--gray-800); color: var(--white); fill: var(--white); border-radius: 50%; padding: 2px 2px; image-rendering: crisp-edges; cursor: pointer; pointer-events: none; opacity: 0;}"
  + ".pro-bookmarking .cp-bookmark:hover .cp-bookmark-close {opacity: 1; pointer-events: all;}"
  + ".bookmark-dialog-info {display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 24px;}"
  + ".bookmark-href-text {width: 100%;}"
  + ".bookmarks-ui {opacity: 0; pointer-events: none;}"
  + ".pro-bookmarking .bookmarks-ui { opacity: 1; pointer-events: all;}"
  + ".bookmarks-tag {fill: var(--gray-900); }"
  + ".global-sidebar[data-state='collapsed'] .bookmarks-tag {display: none;}"
  + ".tagged .cp-bookmark::after {content: attr(label); position: absolute; left: 50%; transform: translateX(-50%); font-size: 9px; letter-spacing: -.25px; line-height: 1.1em; margin-top: 4px;}"
  + ".bookmark-modal-icons ul {display: flex;}"
  + ".bookmark-modal-icons {max-height: 400px; overflow-y: scroll; margin-top: 20px;}"
  + ".bookmark-modal-icons ul {display: flex; flex-wrap: wrap; gap: 5px 5px;}"
  + ".icon-picker--icon:hover {background: var(--gray-150);}"
  + "label[for='bookmark-export'] {display: flex; align-items: center;}"
  + ".bookmark-export-copy, .bookmark-import-paste {position: relative; margin-left: 8px;}"
  + ".bookmark-export-copy svg, .bookmark-import-paste svg {height: 14px; width: 14px;}"
  + ".bookmark-form-item.copied::before {content: 'Copied'; position: absolute; bottom: 0; left: 0; background: #FFF; padding: 4px 12px 5px; opacity: 1; animation: fadeout 2000ms ease-out 0s forwards;}"
  + "@keyframes fadeout {0% {opacity: 1;} 50% {opacity: 1} 100% {opacity: 0;}}"
  + ".bookmarks-modal-search {position: relative; width: 300px;}"
  + ".bookmarks-modal-search-input {padding: 4px 12px 4px 30px; width: 100%}"
  + ".bookmarks-search-icon {position: absolute; left: 6px; top: 50%; transform: translateY(-50%); margin-top: -2px; fill: var(--gray-800);}"
  + ".bookmarks-search-clear {position: absolute; top: 50%; right: 0; transform: translateY(-50%); opacity: 0; pointer-events: none;}"
  + ".bookmarks-search-clear.on {opacity: 1; pointer-events: all;}"
  + ".searched li:has(> .icon-picker--icon.shown) {display: inline;}"
  + ".searched li:has(> .icon-picker--icon:not(.shown)) {display: none;}"
  + "label[for='swap-hostnames'] {gap: 6px; display: flex;}"
  + ".bmi-items {margin-bottom: 25px;}"
  + ".bmi-item {margin-bottom: 14px;}"
  + ".bmi-label-icon {display: flex; gap: 8px; align-items: center; margin: 4px 0 8px 0;}"
  + ".bmi-link {padding: 4px 8px; width: 100%; max-width: 600px;}"
  + ".bmi-label + svg {height: 22px; width: 22px; background: var(--gray-100); padding: 3px; border-radius: 2px;}"
  + "label.bmi-alt-hostname {margin-top: 12px; align-items: flex-start; display: flex; flex-direction: column; gap: 6px;}"
  + "label.bmi-alt-hostname > input {padding: 4px 8px; width: 100%; max-width: 600px;}"
  + ".bmi-link {display: none;}"
  + ".bmi-link-inputs {display: flex; background: #FFF; padding: 4px 8px; width: 100%; max-width: 600px;}"
  + ".bmi-link-inputs p {margin: unset !important;}"
  + ".bmi-link-host {color: var(--red-600); display: none;}"
  + ".bmi-link-local {color: var(--gray-350); font-style: italic; display: none;}"
  + ".bmi-link-host.on, .bmi-link-local.on {display: block;}"
  + ".bmi-label {display: flex; gap: 6px;}"
  + ".toggle-select-all {display: flex; gap: 6px; margin: -4px 0 18px 0;}"
  + ".bookmark-form-error {color: var(--red-600); margin-top: 12px; margin-bottom: 0; opacity: 0; pointer-events: none;}"
  + ".bookmark-form-error.on {opacity: 1; pointer-events: all;}"
  + ".pro-bookmarking .cp-bookmarks-cont {min-height: 20px;}"
  + ".pro-bookmarking .bookmarks-import-export, .pro-bookmarking .bookmarks-tag {display: block !important;}"
  + ".bookmark-modal-overwrite-cont {margin-bottom: 20px;}"
  + ".bmi-alt-hostname > span, label[for='bookmark-modal-overwrite'] {display: flex; gap: 6px;}"
  + ".bmi-item.exists > .bmi-label-icon::after {content: attr(errorexists); color: var(--red-600); font-size: 13px; cursor: text;}"
  + ".card .label .label-link, .chip .label .label-link {white-space: collapse; font-size: 12.5px; line-height: 1.25em;}"
  + "#alerts > li {position: relative;}"
  + ".alert-closer {height: 20px; width: 20px; position: absolute; top: 11px; right: 25px; fill: var(--gray-100); cursor: pointer; transition: all 200ms ease-in-out 0s;}"
  + ".alert-closer:hover {color: var(--white); transition: all 120ms ease-in-out 0s;}"
  + ".alert-count {cursor: pointer; position: absolute; right: 90px; top: 10px; background: var(--gray-200); color: var(--gray-800); padding: 2px 10px; border-radius: 50px; font-size: 12px; display: flex; align-items: center; gap: 2px;}"
  + ".alert-count i svg {height: 17px; fill: var(--red-600);}"
  + "#alerts:not(:has(.dismissed)) + .alert-count, #alerts .dismissed {display: none;}"
  + ".dropzone-new-field {background: var(--gray-800) !important; color: var(--gray-200);}";
  + "";

  if ( $(".cp-bookmarks").length ) {
    $("head").append("<style class='style-bookmarks'>"+ styleBookmarks +"</style>");
  }

  let iconsLoaded = false;

  $(window).on("keydown", function(e) {
    if ( e.key == "Alt" ) {
      $("body").addClass("pro-bookmarking");
      $(".cp-bookmarks").sortable();
      $(".cp-bookmarks").on("sortstop", function( e, ui ) {
        console.log( e );
        reorderBookmarks();
      });
    }
    if ( e.key == "Enter" ) {
      if ( $(".bookmark-dialog.on").length && $(".bookmark-dialog").is("[which='remove']") ) {
        e.preventDefault();
        $(".bookmark-confirm").trigger("click");
      }
    }
  });
  $(window).on("keyup", function(e) {
    if ( e.key == "Alt" ) {
      $("body").removeClass("pro-bookmarking");
      $(".cp-bookmarks").sortable("destroy");
    }
  });
  $(window).on("click", function(e) {
    const closestLink = $(e.target).closest("a");
    if ( closestLink != undefined ) {
      if ( closestLink.length && $("body").is(".pro-bookmarking") ) {
        e.preventDefault();
        e.stopPropagation();
        //console.log( closestLink );
        if ( closestLink.is(".cp-bookmark") ) { // Bookmark Closer
          const bmID = parseInt( closestLink.attr("nth") );
          const bmUnique = closestLink.attr("unique");
          const bmLink = closestLink.attr("href");
          const bmSVG = closestLink.find("svg")[0].outerHTML;
          const bmLabel = closestLink.attr("label");
          if ( e.target.closest(".cp-bookmark-close") == null ) {
            bookmarkDialog( bmID, bmUnique, bmLink, bmSVG, bmLabel, "Edit" );
          } else {
            bookmarkDialog( bmID, bmUnique, bmLink, bmSVG, bmLabel, "Remove" );
          }
        } else { // Any Other Link
          let bmID = 0;
          const bmUnique = unique( 12 );
          if ( $(".cp-bookmark").length ) { bmID = $(".cp-bookmark").length }
          const bmLink = closestLink.attr("href");
          let bmSVG = iconBlank;
          let bmLabel = closestLink.text().trim();
          if ( bmLabel.split("  ").length > 1 ) {
            bmLabel = bmLabel.split("  ")[0];
          }
          if ( closestLink.find("span.label").length ) {
            bmLabel = closestLink.find("span.label").text();
          }
          if ( closestLink.find("svg").length ) {
            const svgViewbox = closestLink.find("svg").attr("viewBox");
            bmSVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='"+ svgViewbox +"' focusable='false' aria-hidden='true'>"+ closestLink.find("svg")[0].innerHTML +"</svg>";
          } else if ( closestLink.closest(".chip").find("svg:first").length ) {
            const svgViewbox = closestLink.closest(".chip").find("svg:first").attr("viewBox");
            bmSVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='"+ svgViewbox +"' focusable='false' aria-hidden='true'>"+ closestLink.closest(".chip").find("svg:first")[0].innerHTML +"</svg>";
          } else if ( closestLink.closest(".inline-chips").find("svg:first").length ) {
            const svgViewbox = closestLink.closest(".inline-chips").find("svg:first").attr("viewBox");
            bmSVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='"+ svgViewbox +"' focusable='false' aria-hidden='true'>"+ closestLink.closest(".inline-chips").find("svg:first")[0].innerHTML +"</svg>";
          }
          bookmarkDialog( bmID, bmUnique, bmLink, bmSVG, bmLabel, "Create" );

          //const memString = "id=" + bmID + "¥link=" + bmLink + "¥svg=" + bmSVG + "¥label=" + bmLabel;
          //localStorage.setItem("pro-bookmarks", localStorage.getItem("pro-bookmarks") + "‰" + memString );
          //console.log( bmSVG );
        }
      }
    }
    if ( $(e.target).closest("li:has(> .icon-picker--icon)").length ) { // Bookmark Icon Picker Icon
      console.log( $(e.target) );
      let targetIcon = "";
      if ( $(e.target).find("svg").length ) {
        targetIcon = $(e.target).find("svg")[0].outerHTML;
      } else {
        targetIcon = $(e.target).closest("svg")[0].outerHTML;
      }
      $(".bookmark-modal, .bookmark-modal-shield").removeClass("on");
      if ( $(".bookmark-dialog-icon").length ) {
        if ( $(".bookmark-toggle-dark").is(".on") ) {
          targetIcon = targetIcon.replace('<svg ', '<svg class="dark" ');
        }
        $(".bookmark-dialog-icon").html( targetIcon );
        $("textarea[name='bookmark-svg']").val( targetIcon );
        $("input[name='bookmark-label']:visible").select();
      }
      console.log( targetIcon );
    }
    //console.log( e.target.nodeName );
  });

  // Show/Hide Labels
  $(".bookmarks-tag").on("click", function() {
    $(this).toggleClass("on");
    if ( $(this).is(".on") ) {
      $(this).html( iconTags );
      $(".cp-bookmarks").addClass("tagged");
      localStorage.setItem("bookmarks-tagged", true);
    } else {
      $(this).html( iconTag );
      $(".cp-bookmarks").removeClass("tagged");
      localStorage.setItem("bookmarks-tagged", false);
    }
  });
  if ( localStorage.getItem("bookmarks-tagged") != null ) {
    if ( localStorage.getItem("bookmarks-tagged") == "true" ) {
      $(".bookmarks-tag").trigger("click");
    }
  }

  // Import/Export
  $(".bookmarks-import-export").on("click", bookmarksExportDialog);

  // Add, Remove, Edit
  function addBookmark( id, unique, url, svg, label ) {
    proBookmarks.push({
      id: id,
      unique: unique,
      url: url,
      svg: svg,
      label: label
    });
    proBookmarks.sort(function(a, b) {
      return a.id - b.id;
    });

    //if ( $(".cp-bookmark").length ) { nth = $(".cp-bookmark").length }
    $(".cp-bookmarks").empty();
    proBookmarks.forEach( function( bm ) {
      $(".cp-bookmarks").append("<a class='cp-bookmark' draggable='false' nth='"+ bm.id +"' unique='"+ bm.unique +"' href='"+ bm.url +"' label='"+ bm.label +"'>"+ bm.svg +"</a>");
      $(".cp-bookmark[nth='"+ bm.id +"']").append( "<div class='cp-bookmark-close'>"+ iconClose +"</div>" );
    });
    console.log( proBookmarks );
  }
  function removeBookmark( url ) {
    let match = -1;
    proBookmarks.forEach( function( bm, i ) {
      //console.log( bm.url + " + " + i );
      if ( bm.url == url ) {
        match = i;
      }
    });
    proBookmarks.splice( match, 1 );
    //console.log( proBookmarks.splice( match, 1) );
    $(".cp-bookmarks").empty();
    proBookmarks.forEach( function( bm ) {
      $(".cp-bookmarks").append("<a class='cp-bookmark' draggable='false' nth='"+ bm.id +"' unique='"+ bm.unique +"' href='"+ bm.url +"' label='"+ bm.label +"'>"+ bm.svg +"</a>");
      $(".cp-bookmark[nth='"+ bm.id +"']").append( "<div class='cp-bookmark-close'>"+ iconClose +"</div>" );
    });
    console.log( proBookmarks );
  }
  function editBookmark( id, unique, url, svg, label ) {
    const cur = $(".cp-bookmark[unique='"+ unique +"']");
    cur.attr("nth", id );
    cur.attr("href", url );
    console.log( cur );
    cur.attr("label", label );

    $(".cp-bookmark[unique='"+ unique +"'] > svg").remove();
    $(".cp-bookmark[unique='"+ unique +"']").prepend( svg );

    const prevBM = $(".cp-bookmark[nth='"+ (id - 1) +"']");
    if ( $(".cp-bookmark[nth='"+ (id - 1) +"']").length ) {
      cur.insertAfter( prevBM );
    }
    if ( id == 0 ) { cur.prependTo( $(".cp-bookmarks") ); }

    proBookmarks = [];
    $(".cp-bookmark").each( function() {
      const id = parseInt( $(this).attr("nth") );
      const unique = $(this).attr("unique");
      const url = $(this).attr("href");
      const svg = $(this).find("svg")[0].outerHTML;
      const label = $(this).attr("label");

      proBookmarks.push({
        id: id,
        unique: unique,
        url: url,
        svg: svg,
        label: label
      });
    });
    $(".cp-bookmarks").empty();
    proBookmarks.forEach( function( bm ) {
      $(".cp-bookmarks").append("<a class='cp-bookmark' draggable='false' nth='"+ bm.id +"' unique='"+ bm.unique +"' href='"+ bm.url +"' label='"+ bm.label +"'>"+ bm.svg +"</a>");
      $(".cp-bookmark[nth='"+ bm.id +"']").append( "<div class='cp-bookmark-close'>"+ iconClose +"</div>" );
    });
    updateBookmarkMem( "", "Edit");
    //console.log( proBookmarks );
  }
  function reorderBookmarks() {
    proBookmarks = [];
    $(".cp-bookmark").each( function() {
      const index = $(this).index();
      const id = parseInt( $(this).attr("nth") );
      const unique = $(this).attr("unique");
      const url = $(this).attr("href");
      const svg = $(this).find("svg")[0].outerHTML;
      const label = $(this).attr("label");
      console.log( index );
      $(this).attr("nth", index );

      proBookmarks.push({
        id: index,
        unique: unique,
        url: url,
        svg: svg,
        label: label
      });
    });
    updateBookmarkMem( "", "Edit");
    console.log( proBookmarks );
  }

  function updateBookmarkMem( memString, method ) {
    let newID = "";
    let newUnique = "";
    let newLink = "";
    let newSVG = "";
    let newLabel = "";
    //console.log( memString );
    if ( memString.length ) {
      newID = memString.split("id=")[1].split("¥")[0];
      newUnique = memString.split("¥unique=")[1].split("¥")[0];
      newLink = memString.split("¥link=")[1].split("¥")[0];
      newSVG = memString.split("¥svg=")[1].split("¥")[0];
      newLabel = memString.split("¥label=")[1].split("¥")[0];
    }
    let mem = "";
    if ( localStorage.getItem("pro-bookmarks") != null ) {
      mem = localStorage.getItem("pro-bookmarks").split("‰");
    }
    if ( method == "Add" ) {
      const memFound = "";
      console.log( mem );
      if ( mem.length && mem[0].length ) { // If At Least One Bookmark in Memory
        let linkMatches = 0;
        mem.forEach( function( memItem ) {
          //console.log( memItem );
          const memLink = memItem.split("¥link=")[1].split("¥")[0];
          if ( memLink == newLink ) {
            linkMatches = linkMatches + 1;
            //console.log( memLink + " + " + newLink + " = Same" );
          } else {
            //console.log( memLink + " + " + newLink + " = Not Same" );
          }
        });
        if ( linkMatches == 0 ) {
          mem.push( "id=" + newID + "¥unique=" + newUnique + "¥link=" + newLink + "¥svg=" + newSVG + "¥label=" + newLabel );
        }
      } else { // If No Bookmarks in Memory
        mem.push( "id=" + newID + "¥unique=" + newUnique + "¥link=" + newLink + "¥svg=" + newSVG + "¥label=" + newLabel );
        //console.log( mem );
      }
      if ( mem.length > 1 && mem[0].length == 0 ) { mem.shift() }
      const newMem = mem.join("‰");
      //console.log( mem );
      //console.log( newMem );

      localStorage.setItem("pro-bookmarks", newMem );
    }
    // Remove
    if ( method == "Remove" ) {
      if ( mem.length && mem[0].length ) { // If At Least One Bookmark in Memory
        let memMatch = -1;
        const newMemSet = [];
        console.log( mem );
        mem.forEach( function( memItem, i ) {
          const memID = memItem.split("id=")[1].split("¥")[0];
          const memUnique = memItem.split("¥unique=")[1].split("¥")[0];
          const memLink = memItem.split("¥link=")[1].split("¥")[0];
          const memSVG = memItem.split("¥svg=")[1].split("¥")[0];
          const memLabel = memItem.split("¥label=")[1].split("¥")[0];
          console.log( memLink + " + " + newLink );
          if ( memLink == newLink ) {
            memMatch = i;
            console.log( memLink + " matched (" + i + ")" );
          } else {
            newMemSet.push( "id=" + memID + "¥unique=" + memUnique + "¥link=" + memLink + "¥svg=" + memSVG + "¥label=" + memLabel );
          }
        });
        const newMem = newMemSet.join("‰");
        //console.log( newMemSet );

        localStorage.setItem("pro-bookmarks", newMem );
      }
    }
    // Edit
    if ( method == "Edit") {
      const newMemSet = [];
      proBookmarks.forEach( function( bm ) {
        //console.log( bm );
        newMemSet.push( "id=" + bm.id + "¥unique=" + bm.unique + "¥link=" + bm.url + "¥svg=" + bm.svg + "¥label=" + bm.label );
      });
      const newMem = newMemSet.join("‰");
      //console.log( newMemSet );

      localStorage.setItem("pro-bookmarks", newMem );
    } // / Edit
  }

  if ( $(".cp-bookmarks").length ) {
    $("body").append("<div class='bookmark-dialog'></div><div class='bookmark-shield'></div><div class='bookmark-modal'></div><div class='bookmark-modal-shield'></div><div class='bookmark-list-modal'></div><div class='bookmark-list-modal-shield'></div>");
    $(".bookmark-dialog").append("<div class='dialog-closer'>"+ iconClose +"</div><h2 class='bookmark-title'></h2><p class='bookmark-desc'></p><div class='bookmark-form'></div><div class='bookmark-dialog-info'></div>");
    $(".bookmark-modal").append("<div class='modal-closer'>"+ iconClose +"</div><h2 class='bookmark-modal-title'></h2><p class='bookmark-modal-desc'></p><div class='bookmarks-modal-search'><input class='bookmarks-modal-search-input'><span class='texticon-icon search icon bookmarks-search-icon' aria-hidden='true'></span><button class='clear-btn bookmarks-search-clear'></button></div><div class='bookmark-modal-icons'></div>");
    $(".bookmark-list-modal").append("<div class='modal-closer'>"+ iconClose +"</div><h2 class='bookmark-modal-title'></h2><p class='bookmark-modal-desc'></p><div class='bookmark-form'></div>");
  }
  $(".bookmark-modal .modal-closer").on("click", function() {
    $(".bookmark-modal").removeClass("on");
  });
  $(".bookmarks-modal-search-input").on("change input", function() {
    const q = $(this).val().toLowerCase();
    console.log( q );
    if ( q.length ) {
      $(".bookmarks-search-clear").addClass("on");
      $(".icon-picker--icon.shown").removeClass("shown");
      if ( q.length >= 3 ) {
        $(".bookmark-modal-icons").addClass("searched");
        $(".bookmark-modal-icons .icon-picker--icon[title*='"+ q +"']").addClass("shown");
      } else {
        $(".bookmark-modal-icons").removeClass("searched");
      }
    } else {
      $(".bookmarks-search-clear").removeClass("on");
    }
  });

  function limitBookmarkID() {
    const allowedKeys = ["Enter", "Delete", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Escape", "Tab", "Control", "Shift", "Alt", "Meta"];
    const inputID = $("input[name='bookmark-nth']:visible");
    const bookmarkIDs = [];
    let highestID = 0;
    $(".cp-bookmark").each( function() {
      bookmarkIDs.push( parseInt( $(this).attr("nth" ) ) );
    });
    highestID = Math.max.apply( null, bookmarkIDs ) + 1;
    inputID.attr("min", 0).attr("max", highestID );
    inputID.on("keydown", function(e) {
      console.log( e.key );
      if ( e.key.length > 1 ) {
        if ( allowedKeys.indexOf( e.key ) == -1 ) {
          e.preventDefault();
        }
      } else {
        if ( isNaN( parseInt( e.key ) ) ) {
          e.preventDefault();
        }
      }
    });
    inputID.on("change input", function() {
      if ( parseInt( $(this).val() ) > highestID ) {
        $(this).val( highestID );
      }
    });
  }

  function bookmarksExportDialog() {
    const bookmarkMem = btoa( localStorage.getItem("pro-bookmarks").replace(/‰/g,"Ã") );
    //console.log( bookmarkMem );
    $(".bookmark-dialog").removeAttr("error");
    $(".bookmark-dialog").removeAttr("which").attr("which", "ie");
    $(".bookmark-title").text("Import / Export bookmarks");
    $(".bookmark-desc").html("Export bookmarks for use in another environment. Import them in this dialog window and adjust the base URL if necessary. Please keep in mind that links to locations that are specific to one project will not make sense in other projects. For example, <code>admin/settings/fields/edit/9</code> will not refer to the same field in an unrelated project because the ID will either be unused or be used for something else.");
    $(".bookmark-form, .bookmark-dialog-info").empty();
    $(".bookmark-form-buttons, .bookmark-dialog-buttons").remove();
    $(".bookmark-dialog").append("<div class='bookmark-form-buttons'><button class='bookmarks-import btn submit locked'>Import</button><button class='bookmark-cancel btn'>Close</button></div>");
    $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-export'>Export current bookmarks <button class='btn bookmark-export-copy'>"+ iconCopy +"</button></label><textarea name='bookmarks-export' type='text' readonly='true'></textarea></div>");
    $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-import'>Import current bookmarks</label><textarea name='bookmark-import' type='text'></textarea></div>");
    $(".bookmark-form textarea[name='bookmarks-export']").val( bookmarkMem );
    if ( $(".bookmark-form-error").length == 0 ) {
      $(".bookmark-dialog .bookmark-form").after("<p class='bookmark-form-error'>No bookmarks were discovered in the value you pasted. Please try again.</p>");
    }

    $(".bookmark-dialog").addClass("on");
    $(".bookmark-dialog, .bookmark-shield").addClass("on");
    $(".dialog-closer, .bookmark-shield").on("click", function() {
      $(".bookmark-dialog, .bookmark-shield").removeClass("on");
    });
    $(".bookmark-cancel").off("click").on("click", function() {
      $(".bookmark-dialog, .bookmark-shield").removeClass("on");
    });
    $(".bookmarks-import").off("click").on("click", function() {
      if ( $(this).is(".locked") ) {
      } else {
        bookmarksExportListModal( $("textarea[name='bookmark-import']").val() );
      }
    });

    $(".bookmark-export-copy").off("click").on("click", function() {
      $("textarea[name='bookmarks-export']").select();
      document.execCommand("copy");
      $("textarea[name='bookmarks-export']")[0].setSelectionRange(0,0);
      $("textarea[name='bookmarks-export']").parent().addClass("copied");
      setTimeout( function() {
        $("textarea[name='bookmarks-export']").parent().removeClass("copied");
      }, 2000);
    });
    $("textarea[name='bookmark-import']").off("change input").on("change input", function() {
      if ( $(this).val().length ) {
        $(".bookmark-dialog[which='ie'] .bookmarks-import").removeClass("locked");
      } else {
        $(".bookmark-dialog[which='ie'] .bookmarks-import").addClass("locked");
      }
    });
  }

  function bookmarksExportListModal( val ) {
    $(".bookmark-form-error").removeClass("on");
    function decode( val ) {
      try {
        return atob( val );
      } catch (e) {
        if (e instanceof DOMException && e.name === "InvalidCharacterError") {
          $(".bookmark-form-error").addClass("on");
          return null;
        } else {
          throw e;
        }
      }
    }
    const decoded = decode( val );

    if ( decoded.includes("¥") ) { // Valid Bookmark
      $(".bookmark-list-modal .bookmark-modal-title").text("Discovered bookmarks");
      $(".bookmark-list-modal .bookmark-modal-desc").text("These bookmarks have been gleaned from your export. Would you like to import them? By default, the hostname will be swapped with the current one. You can also choose an alternate host for all of them or adjust individually.");
      $(".bookmark-list-modal .bookmark-form").empty();
      $(".bookmark-list-modal .bookmark-form").append("<label for='swap-hostnames'><input name='swap-hostnames' class='swap-hostnames' type='checkbox'><span>Swap hostnames</span></label><label class='bmi-alt-hostname' for='bmi-alt-hostname'><span><input type='checkbox' name='bmi-alt-hostname-use'><span>Alternative host</span></span><input type='text' name='bmi-alt-hostname'></label><hr></div><label class='toggle-select-all' for='toggle-select-all'><input type='checkbox' name='toggle-select-all'><span>Select/Deselect all</span></label><div class='bmi-items'></div>");

      const bookmarksImported = atob( val ).replace(/Ã/g,"‰").split("‰");
      const localHost = location.protocol + "//" + location.host;
      const firstDigit = location.href.split( localHost )[1].split("/")[1];
      bookmarksImported.forEach( function( bmI ) {
        const bmIID = bmI.split("id=")[1].split("¥")[0];
        const bmIUnique = bmI.split("¥unique=")[1].split("¥")[0];
        const bmILink = bmI.split("¥link=")[1].split("¥")[0];
        const bmISVG = bmI.split("¥svg=")[1].split("¥")[0];
        const bmILabel = bmI.split("¥label=")[1].split("¥")[0];
        console.log( bmILink );
        const bmIProtocol = bmILink.split("//")[0];
        const bmILinkHost = bmILink.split("//")[1].split("/")[0];
        const bmIFirstDigit = bmILink.split("//")[1].split("/")[1];
        const bmILinkOriginal = bmIProtocol + "//" + bmILinkHost + "/" + bmIFirstDigit + "/";
        const bmILinkRemainder = bmILink.split( bmILinkOriginal )[1];
        
        console.log( bmILinkOriginal );
        console.log( bmILinkRemainder );
        
        $(".bookmark-list-modal .bmi-items").append("<div class='bmi-item' nth='"+ bmIID +"' unique='"+ bmIUnique +"'><div class='bmi-label-icon' errorexists='A bookmark with this unique identifier already exists on this domain'><label class='bmi-label'><input class='bmi-check' type='checkbox'>"+ bmILabel +"</label>"+ bmISVG +"</div><input class='bmi-link' value='"+ bmILink +"'><div class='bmi-link-inputs' memlink='"+ bmILinkOriginal +"'><p class='bmi-link-host' contenteditable='true'>"+ bmILinkOriginal +"</p><p class='bmi-link-local'>"+ localHost + "/" + bmIFirstDigit + "/" +"</p><p class='bmi-link-admin' contenteditable='true'>"+ bmILinkRemainder +"</p></div></div>");
      });
      $(".bookmark-list-modal .bookmark-form").append("<hr><div class='bookmark-modal-overwrite-cont'><label for='bookmark-modal-overwrite' class='on'><input type='checkbox' name='bookmark-modal-overwrite'><span>Overwrite existing bookmarks?</span></label></div><div class='bookmark-form-buttons'><button class='bookmarks-import btn submit locked'>Import</button><button class='bookmark-cancel btn'>Cancel</button></div>");
      $("label[for='swap-hostnames']").addClass("on");
      $("label[for='swap-hostnames'] input, .bmi-check").prop("checked", true);
      $("label[for='swap-hostnames']").on("click", function() {
        $(this).toggleClass("on");
        checkHostnamesSwap();
      });
      checkHostnamesSwap();
      function checkHostnamesSwap() {
        const label = $("label[for='swap-hostnames']");
        if ( label.is(".on") ) {
          label.find("input").prop("checked", true);
          $(".bmi-link-host").removeClass("on");
          $(".bmi-link-local").addClass("on");
          $(".bmi-alt-hostname").hide();
        } else {
          label.find("input").prop("checked", false);
          $(".bmi-link-host").addClass("on");
          $(".bmi-link-local").removeClass("on");
          $(".bmi-alt-hostname").show();
          $("input[name='bmi-alt-hostname']").val( localHost + "/" + firstDigit + "/" );
        }
      }
      $("input[name='bmi-alt-hostname']").val( localHost + "/" + firstDigit + "/" );

      $("input[name='bmi-alt-hostname']").off("change input").on("change input", function() {
        $(".bmi-alt-hostname").addClass("on");
        $(".bmi-alt-hostname input").prop("checked", true);
        $(".bmi-link-host").text( $(this).val() );
      });

      function selectedBookmarks() {
        if ( $(".bmi-item .bmi-check:checked").length ) {
          $(".bookmarks-import").removeClass("locked");
        } else {
          $(".bookmarks-import").addClass("locked");
        }
      }

      $(".bmi-alt-hostname > span").off("click").on("click", function() {
        $(this).parent().toggleClass("on");
        if ( $(this).parent().is(".on") ) {
          $(this).find("input").prop("checked", true);
          $(".bmi-link-host").text( $("input[name='bmi-alt-hostname']").val() );
        } else {
          $(this).find("input").prop("checked", false);
          $(".bmi-link-host").text( $(".bmi-link-inputs").attr("memlink") );
        }
      });
      
      $("label[for='bookmark-modal-overwrite'] > input").prop("checked", true);
      $("label[for='bookmark-modal-overwrite']").off("click").on("click", function() {
        $(this).toggleClass("on");
        if ( $(this).is(".on") ) {
          $(this).find("input").prop("checked", true);
          checkImportExists( false );
        } else {
          $(this).find("input").prop("checked", false);
          checkImportExists( true );
        }
        if ( $(".bmi-check:not(:checked)").length == 0 ) {
        	$(".toggle-select-all input").prop("checked", true);
          $(".toggle-select-all").addClass("on");
        }
      });
			
      if ( $(".bmi-item").length ) {
        $(".toggle-select-all").show();
        $(".toggle-select-all").addClass("on");
        $(".toggle-select-all").on("click", function() {
          $(this).toggleClass("on");
          if ( $(this).is(".on") ) {
            $(this).find("input").prop("checked", true);
            $(".bmi-check:not([disabled])").prop("checked", true);
          } else {
            $(this).find("input").prop("checked", false);
            $(".bmi-check:not([disabled])").prop("checked", false);
          }
          selectedBookmarks();
        });
        $(".toggle-select-all input").off("change input").on("change input", function() {
          if ( $(this).is(":checked") ) {
            $(".bmi-check:not([disabled])").prop("checked", true);
          } else {
            $(".bmi-check:not([disabled])").prop("checked", false);
          }
          selectedBookmarks();
        });
        $(".bmi-check").on("change input", function() {
          if ( $(".bmi-check:checked").length ) {
            if ( $(".bmi-check:not(:checked)").length == 0 ) {
              $(".toggle-select-all").addClass("on");
              $(".toggle-select-all input").prop("checked", true);
            }
            $(".bookmark-list-modal .bookmarks-import").removeClass("locked");
          } else {
            $(".toggle-select-all").removeClass("on");
            $(".toggle-select-all input").prop("checked", false);
            $(".bookmark-list-modal .bookmarks-import").addClass("locked");
          }
        });
        if ( $(".bmi-check:checked").length ) {
          $(".bookmark-list-modal .bookmarks-import").removeClass("locked");
        }
        
        function checkImportExists( state ) {
          $(".bmi-check").prop("checked", true);
          $(".bmi-item").each( function() {
            if ( state == true ) {
              if ( $(".cp-bookmark[unique='"+ $(this).attr("unique") +"']").length ) {
                $(this).addClass("exists");
                $(this).find(".bmi-check").attr("disabled", "disabled");
                $(this).find(".bmi-check").prop("checked", false);
              }
            } else {
              $(this).removeClass("exists");
              $(this).find(".bmi-check").removeAttr("disabled");
              $(this).find(".bmi-check").prop("checked", true);
            }
          });
          if ( $(".bmi-check:checked").length == 0 ) {
            $(".toggle-select-all input").prop("checked", false );
            $(".toggle-select-all").removeClass("on");
            $(".bookmarks-import").addClass("locked");
          } else {
            $(".bookmarks-import").removeClass("locked");
          }
        }
        checkImportExists( false );
        
      } else {
        $(".toggle-select-all").hide();
      }

      $(".bookmark-list-modal .bookmarks-import").on("click", function() {
        if ( ! $(this).is(".locked") ) {
          let proBookmarks = [];
          localStorage.setItem("pro-bookmarks", "");
          
          if ( ! $("input[name='bookmark-modal-overwrite']").is(":checked") ) {
         		$(".cp-bookmark").each( function() {
            	const curID = $(this).attr("nth");
              const curUnique = $(this).attr("unique");
              const curLink = $(this).attr("href");
              const curSVG = $(this).find("> svg")[0].outerHTML;
              const curLabel = $(this).attr("label");
              proBookmarks.push({
                id: curID,
                unique: curUnique,
                url: curLink,
                svg: curSVG,
                label: curLabel
              });
              const memString = "id=" + curID + "¥unique=" + curUnique + "¥link=" + curLink + "¥svg=" + curSVG + "¥label=" + curLabel;
              updateBookmarkMem( memString, "Add" );
            });
          }
          
          console.log( proBookmarks );
          
          $(".bmi-item:has( .bmi-check:checked )").each( function() {
            if ( $(this).find(".bmi-check:checked").length ) {
              const bmID = parseInt( $(this).attr("nth") );
              const bmUnique = $(this).attr("unique");
              let bmLink = "";
              $(this).find(".bmi-link-inputs p:visible").each( function() {
                bmLink = bmLink + $(this).text();
              });
              const bmSVG = $(this).find("svg")[0].outerHTML;
              const bmLabel = $(this).find(".bmi-label").text();
              proBookmarks.push({
                id: bmID,
                unique: bmUnique,
                url: bmLink,
                svg: bmSVG,
                label: bmLabel
              });
              const memString = "id=" + bmID + "¥unique=" + bmUnique + "¥link=" + bmLink + "¥svg=" + bmSVG + "¥label=" + bmLabel;
              updateBookmarkMem( memString, "Add" );
            }
          });
          
          console.log( proBookmarks );
          
          $(".cp-bookmarks").empty();
          proBookmarks.forEach( function( bm ) {
            console.log( bm.unique );
            $(".cp-bookmarks").append("<a class='cp-bookmark' draggable='false' nth='"+ bm.id +"' unique='"+ bm.unique +"' href='"+ bm.url +"' label='"+ bm.label +"'>"+ bm.svg +"</a>");
            $(".cp-bookmark[nth='"+ bm.id +"']").append( "<div class='cp-bookmark-close'>"+ iconClose +"</div>" );
          });
          $(".bookmark-dialog, .bookmark-shield").removeClass("on");
          $(".bookmark-list-modal, .bookmark-list-modal-shield").removeClass("on");
        }
      });

      $(".toggle-select-all input").prop("checked", true);
      $(".bookmark-form-error").removeClass("on");
      $(".bookmark-list-modal, .bookmark-list-modal-shield").addClass("on");
      $(".bookmark-list-modal .bookmark-cancel, .bookmark-list-modal-shield, .bookmark-list-modal .modal-closer").off("click").on("click", function() {
        $(".bookmark-list-modal, .bookmark-list-modal-shield").removeClass("on");
      });
      console.log( bookmarksImported.length );
    } else { // No Bookmarks Found / Invalid Value
      $(".bookmark-form-error").addClass("on");
      /*$(".bookmark-list-modal .bookmark-modal-title").text("Discovered bookmarks");
      $(".bookmark-list-modal .bookmark-modal-desc").text("No bookmarks were discovered in the value you pasted. Please try again.");
      $(".bookmark-list-modal .bookmark-form").empty();
      $(".bookmark-list-modal .bookmark-form")
      $(".bookmark-list-modal, .bookmark-list-modal-shield").addClass("on");
      $(".bookmark-list-modal .bookmark-cancel, .bookmark-list-modal-shield, .bookmark-list-modal .modal-closer").off("click").on("click", function() {
        $(".bookmark-list-modal, .bookmark-list-modal-shield").removeClass("on");
      });*/
    }
  }


  function bookmarkDialog( id, unique, url, svg, label, method ) {
    $(".bookmark-dialog").removeAttr("error");
    if ( method == "Create" ) {
      $(".bookmark-dialog").removeAttr("which").attr("which", "create");
      $(".bookmark-title").text("Create new bookmark");
      $(".bookmark-desc").text("Change anything before saving this new bookmark?");
      $(".bookmark-form, .bookmark-dialog-info").empty();
      $(".bookmark-form-buttons, .bookmark-dialog-buttons").remove();
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-nth'>Order</label><input name='bookmark-nth' type='number' value='"+ (id + 1) +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-unique'>Unique</label><input name='bookmark-unique' type='text' disabled='disabled' value='"+ unique +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-label'>Label</label><input name='bookmark-label' type='text' value='"+ label +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-href'>Destination URL</label><input name='bookmark-href' type='text' value='"+ url +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-svg'>SVG Icon</label><div class='bookmark-svg-buttons'><div class='bookmark-dialog-icon'>"+ svg +"</div><button class='btn bookmark-toggle-dark'>"+ iconDark +"</button></div><textarea name='bookmark-svg' type='text'>" );
      $(".bookmark-form textarea[name='bookmark-svg']").val( svg );
      $(".bookmark-dialog").append("<div class='bookmark-form-buttons'><button class='bookmark-save btn submit'>Save</button><button class='bookmark-cancel btn'>Cancel</button></div>");
      errorExists("", "");

      limitBookmarkID();
      $(".bookmark-save").on("click", function() {
        if ( ! $(".bookmark-dialog").is("[error='exists']") && ! $(this).is(".locked") ) {
          let id = $("input[name='bookmark-nth']").val();
          const label = $("input[name='bookmark-label']").val();
          const newSVG = $("textarea[name='bookmark-svg']").val();
          console.log( label );
          const memString = "id=" + id + "¥unique=" + unique + "¥link=" + url + "¥svg=" + newSVG + "¥label=" + label;
          addBookmark( id, unique, url, newSVG, label );
          updateBookmarkMem( memString, "Add" );
          $(".bookmark-dialog, .bookmark-shield").removeClass("on");
        }
        if ( $(".bookmarks-modal-search-input").length ) {
          $(".bookmarks-modal-search-input").val("");
          $(".bookmark-modal-icons").removeClass("searched");
          $(".icon-picker--icon.shown").removeClass("shown");
        }
      });
      $(".bookmark-form input").off("keypress").on("keypress", function(e) {
        if ( e.key == "Enter" ) {
          $(".bookmark-save").trigger("click");
        }
      });

      $("input[name='bookmark-href']").on("change input", function() {
        errorExists( "Typing", "" );
        if ( $(this).val().length ) {
          $(".bookmark-save:visible").removeClass("locked");
        } else {
          $(".bookmark-save:visible").addClass("locked");
        }
      });

      $("textarea[name='bookmark-svg']").on("change input", function() {
        $(".bookmark-dialog-icon").html( $(this).val() );
      });
      $("input[name='bookmark-label']").select();
    } // / Create

    if ( method == "Remove" ) { // Remove
      $(".bookmark-dialog").removeAttr("which").attr("which", "remove");
      $(".bookmark-title").html("Delete bookmark " + "<span>"+ label + "</span>?");
      $(".bookmark-desc").text("Are you sure you want to delete this bookmark?");
      $(".bookmark-form, .bookmark-dialog-info").empty();
      $(".bookmark-form-buttons, .bookmark-dialog-buttons").remove();
      $(".bookmark-dialog-info").append("<span class='bookmark-dialog-icon'>"+ svg +"</span>");
      $(".bookmark-dialog-info").append("<span class='bookmark-label-text'>"+ label +"</span>");
      $(".bookmark-dialog-info").append("<span class='bookmark-nth-text'>("+ id +")</p>");
      $(".bookmark-dialog-info").append("<span class='bookmark-unique-text'>["+ unique +"]</p>");
      $(".bookmark-dialog-info").append("<span class='bookmark-href-text'>"+ url +"</span>");
      $(".bookmark-dialog").append("<div class='bookmark-dialog-buttons'><button class='bookmark-confirm btn submit'>Delete</button><button class='bookmark-cancel btn'>Cancel</button></div>");

      $(".bookmark-confirm").on("click", function() {
        const memString = "id=" + id + "¥unique=" + unique + "¥link=" + url + "¥svg=" + svg + "¥label=" + label;
        removeBookmark( url );
        updateBookmarkMem( memString, "Remove" );
        $(".bookmark-dialog, .bookmark-shield").removeClass("on");
      });
    } // / Remove

    if ( method == "Edit" ) { // Edit
      $(".bookmark-dialog").removeAttr("which").attr("which", "edit");
      $(".bookmark-title").html("Editing bookmark " + "<span>"+ label + "</span>");
      $(".bookmark-desc").text("What do you want to change? Keep in mind that the order of bookmarks can be changed by holding ALT and dragging them around in the bookmarks tray.");
      $(".bookmark-form, .bookmark-dialog-info").empty();
      $(".bookmark-form-buttons, .bookmark-dialog-buttons").remove();
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-nth'>Order</label><input name='bookmark-nth' type='number' value='"+ id +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-unique'>Unique</label><input name='bookmark-unique' type='text' disabled='disabled' value='"+ unique +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-label'>Label</label><input name='bookmark-label' type='text' value='"+ label +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-href'>Destination URL</label><input name='bookmark-href' type='text' value='"+ url +"'></div>");
      $(".bookmark-form").append("<div class='bookmark-form-item'><label for='bookmark-svg'>SVG Icon</label><div class='bookmark-svg-buttons'><div class='bookmark-dialog-icon'>"+ svg +"</div><button class='btn bookmark-toggle-dark'>"+ iconDark +"</button></div><textarea name='bookmark-svg' type='text'>");
      $(".bookmark-form textarea[name='bookmark-svg']").val( svg );
      $(".bookmark-dialog").append("<div class='bookmark-form-buttons'><button class='bookmark-save btn submit'>Save</button><button class='bookmark-cancel btn'>Cancel</button></div>");

      $("input[name='bookmark-label']").select();

      limitBookmarkID();
      $(".bookmark-save").on("click", function() {
        if ( ! $(".bookmark-dialog").is("[error='exists']") && ! $(this).is(".locked") ) {
          const newID = $("input[name='bookmark-nth']").val();
          const newURL = $("input[name='bookmark-href']").val();
          const newSVG = $("textarea[name='bookmark-svg']").val();
          const newLabel = $("input[name='bookmark-label']").val();
          const memString = "id=" + newID + "¥unique=" + unique + "¥link=" + newURL + "¥svg=" + newSVG + "¥label=" + newLabel;

          console.log( newSVG );
          editBookmark( newID, unique, newURL, newSVG, newLabel );
          reorderBookmarks();
          updateBookmarkMem( memString, "Edit" );
          $(".bookmark-dialog, .bookmark-shield").removeClass("on");
          if ( $(".bookmarks-modal-search-input").length ) {
            $(".bookmarks-modal-search-input").val("");
            $(".bookmark-modal-icons").removeClass("searched");
            $(".icon-picker--icon.shown").removeClass("shown");
          }
        }
      });

      console.log( $(".bookmark-form input") );
      $(".bookmark-form input").off("keypress").on("keypress", function(e) {
        if ( e.key == "Enter" ) {
          $(".bookmark-save").trigger("click");
          console.log( "GG" );
        }
      });

      $("input[name='bookmark-href']").on("change input", function() {
        errorExists( "Typing", unique );
        if ( $(this).val().length ) {
          $(".bookmark-save:visible").removeClass("locked");
        } else {
          $(".bookmark-save:visible").addClass("locked");
        }
      });

      if ( svg.includes('class="dark"') ) {
        $(".bookmark-toggle-dark").addClass("on");
      }
      $("textarea[name='bookmark-svg']").on("change input", function() {
        $(".bookmark-dialog-icon").html( $(this).val() );
      });
    } // / Edit

    $(".bookmark-dialog-icon").on("click", function() {
      GM.xmlHttpRequest({
        method: "GET",
        url: "https://liveavirgin.be/Craft%20Icons.html",
        onload: function(res) {
          if ( iconsLoaded == false ) {
            $(".bookmark-modal-icons").append( res.responseText );
            iconsLoaded = true;
          }
        }
      });
      $(".bookmark-modal-title").text("Pick out a new icon");
      $(".bookmark-modal, .bookmark-modal-shield").addClass("on");
      $(".modal-closer, .bookmark-modal-shield").on("click", function() {
        $(".bookmark-modal, .bookmark-modal-shield").removeClass("on");
      });
      $(".bookmarks-modal-search-input").select();
    });

    $(".bookmark-toggle-dark").off("click").on("click", function() {
      const formItem = $(this).closest(".bookmark-form-item");
      const dialogIcon = formItem.find(".bookmark-dialog-icon > svg");
      console.log( dialogIcon );
      $(this).toggleClass("on");
      let newSVG = dialogIcon[0].outerHTML;
      if ( $(this).is(".on") ) {
        newSVG = newSVG.replace("<svg", `<svg class="dark"`).replace(/class=""/g,"");
        formItem.find("svg").addClass("dark");
      } else {
        newSVG = newSVG.replace(`<svg class="dark"`, "<svg").replace(/class="dark"/g,"").replace(/class=""/g,"");
        formItem.find("svg").removeClass("dark");
      }
      formItem.find("textarea").val( newSVG );
      //console.log( newSVG );
    });
    $(".bookmark-dialog, .bookmark-shield").addClass("on");
    $(".dialog-closer, .bookmark-shield").on("click", function() {
      $(".bookmark-dialog, .bookmark-shield").removeClass("on");
    });
    $(".bookmark-cancel").on("click", function() {
      $(".bookmark-dialog, .bookmark-shield").removeClass("on");
    });
  }

  function errorExists( inputMethod, unique ) {
    let matches = 0;
    let checkUnique = false;
    console.log( proBookmarks );
    if ( unique.length ) {
      checkUnique = true;
    }
    proBookmarks.forEach( function( curBM ) {
      const curID = curBM.id;
      const curLink = curBM.url;
      const curUnique = curBM.unique;
      const typedURL = $("input[name='bookmark-href']").val();
      //console.log( curBM );
      //console.log( typeof( curBM ) );
      //console.log( typedURL + " + " + curLink );
      //console.log( unique + " + " + curUnique + " + " + checkUnique );
      if ( typedURL == curLink ) {
        if ( checkUnique == true ) {
          if ( unique != curUnique ) {
            matches = matches + 1;
          }
        } else {
          matches = matches + 1;
        }
      }
      console.log( "Existing bookmark matches: " + matches );
      if ( matches == 0 ) {
        $(".bookmark-dialog").removeAttr("error").removeAttr("exists");
        $(".bookmark-form-item .bookmark-dialog-error").remove();
      } else {
        $(".bookmark-dialog").attr("error", "exists").attr("exists", curID);
        if ( $(".bookmark-dialog-error").length == 0 ) {
          $(".bookmark-form-item:has(input[name='bookmark-href'])").append("<span class='bookmark-dialog-error'>This URL is already in use by a bookmark.</span>");
        }
      }
    });
  };
  
  // Sluggify
  function sluggify( input ) {
    const sluggified = input.toLowerCase().replace(/_/g,"-").replace(/ /g,"-").replace(/[^a-zA-Z0-9-_]/gmi,"");
    return sluggified;
  }
  
  // Closable Alerts
  if ( $("#alerts").length ) {
    const alerts = $("#alerts > li");
    const baseCSS = "bottom: auto !important; filter: none !important; height: auto !important; left: auto !important; position: relative !important; right: auto !important; top: auto !important; transform: none !important; width: auto !important;";
    let dismissed = [];
    
  	alerts.each( function() {
      $(this).append("<i class='alert-closer'>"+ iconClose +"</i>");
      $(this).attr("style", baseCSS);
      $(this).attr("which", sluggify( $(this).text().trim().slice(0,25) ) );
    });
    $("#alerts").after("<div class='alert-count'><i>"+ iconAlert +"</i><span>"+ alerts.length +"</span></div>");
    
    $(".alert-closer").on("click", function() {
      const alert = $(this).parent("li");
      const which = alert.attr("which");
      alert.addClass("dismissed");
      
      if ( dismissed.indexOf( which == -1 ) ) {
        dismissed.push( which );
      }
      localStorage.setItem("alerts-dismissed", dismissed );
    });
    $(".alert-count").on("click", function() {
    	$("#alerts > li").removeClass("dismissed");
    });
    
    if ( localStorage.getItem("alerts-dismissed") != undefined ) {
      if ( localStorage.getItem("alerts-dismissed").length ) {
    		dismissed = localStorage.getItem("alerts-dismissed").split(",");
        dismissed.forEach( function(which) {
        	$("#alerts > li[which='"+ which +"']").addClass("dismissed");
        });
      }
    }
    console.log( dismissed );
  }

	$("#alerts").css({"background-color": "var(--red-900)", "border-left": "6px solid var(--red-600)", "color": "var(--white)"});
  
  // Dark Mode
  styleDarkmode = ""
  + "a {color: var(--blue-400);}"
  + ".light {color: var(--gray-200) !important;}"
  + ".global-sidebar {background-color: var(--gray-1000)}"
  + ".sidebar-action, .dark .darkmode-toggler span, .h4, .h5, h4, h5 {color: var(--gray-100)}"
  + ".dark .darkmode-toggler svg {fill: var(--gray-100)}"
  + ".dark .darkmode-toggler:hover::after {content: ''; background: var(--gray-600); position: absolute; left: -13px; width: calc(100% + 13px); margin-top: -10px; height: 43px; z-index: -1;}"
  + ".sel .sidebar-action {color: var(--gray-100)}"
  + ".nav-item.sel, .sidebar-action:hover, .sidebar-action:focus-visible, .menu-item.sel {background-color: var(--gray-800); color: var(--gray-100)}"
  + "#global-sidebar #system-info {color: var(--gray-050)}"
  + "#global-sidebar #system-info:hover {background-color: var(--gray-800)}"
  + "#system-info #site-icon {filter: invert(1)}"
  + ".cp-bookmarks {border-bottom: 1px solid var(--gray-800)}"
  + ".cp-bookmark {fill: var(--gray-100)}"
  + "#global-header, #notifications .notification, #language-menu, .menu, .ui-datepicker, .ui-timepicker-list {background-color: var(--gray-800)}"
  + "#crumb-list li.crumb > .crumb-link, #sites-btn, #notifications .notification, .btn, #language-menu .menu-item, #account-menu ul li a {color: var(--blue-050)}"
  + "#crumb-list li.crumb > .crumb-link:hover, #global-header .btn:hover, #user-info:hover::after {color: var(--blue-200)}"
  + "#crumb-list li.crumb:not(.current)::after, #crumb-list li.crumb:not(.current)::before {filter: invert(1); mix-blend-mode: multiply;}"
  + ".context-label, .context-menu-container {border: 1px solid var(--gray-900)}"
  + "#user-info .header-photo .thumb.rounded {background-color: #FFF; border-radius: 50%;}"
  + "#user-info::after, .menu-toggle::after, .menubtn:not(.action-btn)::after {border-color: var(--gray-050);}"
  + ".context-menu-container .menubtn:not(.action-btn) {border-inline-start: 1px solid var(--gray-900);}"
  + ".nav-item__trigger .menubtn:hover, .menu--disclosure ul li > .menu-item:hover, .menu--disclosure ul li > .menu-option:hover, .menu--disclosure ul li > a:not(.crumb-link):hover {background-color: var(--gray-600); color: var(--blue-050);}"
  + ".global-sidebar__footer {border-block-start: 1px solid var(--gray-800);}"
  + "#user-info:hover::after {border-color: var(--blue-200):}"
  + "#page-container {background-color: var(--gray-900); color: var(--gray-050);}"
  + "hr {border-bottom: 1px solid var(--gray-550);}"
  + "#page-container .pane, #trial-info, .content-pane {background: var(--gray-1000); box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + "#page-container .back > .pane {background: var(--gray-1000);}"
  + "#page-container .pane .cs-opt:hover {background: var(--gray-800);}"
  + "#page-container .pane .cs-screen-home .cs-opt p {color: var(--gray-300);}"
  + "#page-container .pane .cs-screen-home .cs-opt:not(:first-child) {border-block-start: 1px solid var(--gray-800);}"
  + ".main {background: var(--gray-1000); color: var(--gray-050);}"
  + "table.data tbody tr:not(.disabled):hover td, table.data tbody tr:not(.disabled):hover th {background-color: var(--gray-900);}"
  + ".hud .tip-top {filter: brightness(0.1);}"
  + ".slide-picker a {border: 1px solid var(--gray-200);}"
  + ".active-hover, .last-active-hover {border: 1px solid var(--gray-400) !important;}"
  + ".sidebar nav li a .label {color: var(--blue-100);}"
  + ".sidebar .heading .type-heading-small, .sidebar .heading > span {color: var(--gray-300);}"
  + "#sidebar nav li a:not(.sel):hover {background-color: var(--gray-800);}"
  + "@supports ((-webkit-backdrop-filter:blur(10px)) or (backdrop-filter:blur(10px))) {body.fixed-header #header { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); background-color: rgba(120,120,125,.55); }}"
  + "table.data thead td, table.data thead th {background-color: var(--gray-700);}"
  + "#footer {background: var(--gray-1000); border-block-start: 2px solid var(--gray-800);}"
  + "@supports ((-webkit-backdrop-filter:blur(10px)) or (backdrop-filter:blur(10px))) {#footer.stuck {background-color: rgba(50,50,55,.85);}}"
  + "#toolbar .text {background-color: var(--gray-1000);}"
  + ".field p, .select:not(.selectize) select {color: var(--gray-100);}"
  + "p .code, p code {background-color: var(--blue-900);}"
  + ".card .label a.label-link, .chip .label a.label-link {color: var(--blue-300);}"
  + ".selectize.multiselect .selectize-input, .text > input, .text > textarea, input.text, table.editable textarea, textarea.text {background-color: var(--gray-900); color: var(--gray-200); border: 1px solid var(--gray-400);}"
  + ".site--default .text-gray-600 {color: var(--gray-300);}"
  + ".icon.delete::before {color: var(--gray-050);}"
  + "table.data.vuetable th.sortable:hover, .btn:hover:not(.chromeless) {background-color: var(--gray-600); color: var(--gray-050);}"
  + ".status-label .status-label-text {color: var(--gray-200);}"
  + ".status-label.teal, .status-label.turquoise {--status-label-text-color: var(--teal-200); --status-label-bg-color: var(--bg-enabled);}"
  + ".link-input > .flex > div.text-link {background-color: var(--gray-800);}"
  + ".context-label, .context-menu-container {color: var(--gray-300);}"
  + ".menu ul li .menu-item:not(.flex, .hidden), .menu ul li .menu-option:not(.flex, .hidden), .menu ul li a:not(.flex, .hidden) {color: var(--blue-300);}"
  + ".menu-group h3 {color: var(--gray-150);}"
  + ".pane-header {background-color: var(--gray-800); box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + ".pane-tabs [role='tablist'] [role='tab'], #details .details .meta:not(.read-only, .warning), .card:not(.chromeless, .hairline), .chip:not(.chromeless, .hairline), .matrixblock:not(.chromeless, .hairline) {box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25) !important;}"
  + ".pane-tabs [role='tablist'] [role='tab'] .tab-label {background-color: var(--gray-700); color: var(--gray-100);}"
  + ".pane-tabs [role='tablist'] [role='tab']:not([aria-selected='true']):hover .tab-label {background-color: var(--gray-800); color: var(--gray-100);}"
  + ".pane-tabs [role='tablist'] [role='tab'][aria-selected='true'] .tab-label {background-color: var(--gray-1000); color: var(--gray-100);}"
  + "#details-toggle > button:focus .details-toggle__inner, #details-toggle > button:focus-visible .details-toggle__inner, #details-toggle > button:hover .details-toggle__inner {background-color: var(--gray-200);}"
  + "#details .details .meta:not(.read-only, .warning) {background: var(--gray-800);}"
  + ".details .meta > .data > .heading, .details .meta > .data > .heading > label, .details .meta > .field > .heading, .details .meta > .field > .heading > label {color: var(--gray-100); background: var(--gray-900);}"
  + ".details .meta:not(.read-only) {background-color: var(--gray-1000) !important;}"
  + "@media screen and (min-width: 400px) {.meta > .field > .heading, .meta > .flex-fields > .field > .heading {border-inline-end: 1px solid var(--gray-700);}}"
  + ".card:not(.chromeless, .hairline), .chip:not(.chromeless, .hairline), .matrixblock:not(.chromeless, .hairline) {background-color: var(--gray-800,var(--gray-700));}"
  + ".chip > .thumb.rounded img, .chip > .thumb.rounded svg {background-color: #FFF;}"
  + ".card:not(.chromeless)::before, .chip:not(.chromeless)::before, .matrixblock:not(.chromeless)::before {box-shadow: inset 0 0 0 1px var(--gray-500,var(--gray-200));}"
  + "#details .details > .field > .input > .text.fullwidth {background: var(--gray-1000) !important; box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25) !important;}"
  + ".cp-icon svg {filter: brightness(4);}"
  + ".tableview .cp-icon svg {filter: brightness(1);}"
  + ".cp-icon svg circle, .cp-icon svg ellipse, .cp-icon svg line, .cp-icon svg path, .cp-icon svg polygon, .cp-icon svg polyline, .cp-icon svg rect, .cp-icon svg text {fill: var(--blue-400,var(--ui-control-color));}"
  + ".tableview [data-title='Link'] svg path {fill: var(--blue-400) !important;}"
  + "#details-toggle > button .details-toggle__inner {background-color: var(--gray-1000); border: 1px solid var(--gray-500);}"
  + "#details-toggle > button:focus .details-toggle__inner, #details-toggle > button:focus-visible .details-toggle__inner, #details-toggle > button:hover .details-toggle__inner {background-color: var(--gray-700);}"
  + "body:not(.dragging) table.data thead th.orderable:not(.ordered):hover {background-color: var(--gray-600);}"
  + "table.data thead th.orderable.ordered {background-color: var(--gray-1000);}"
  + "flex-fields > :not(h2, hr, .line-break)::before, .flex-fields > :not(h2, hr, .line-break):last-child::before {background-color: var(--blue-700);}"
  + ".meta dd {color: var(--blue-300);}"
  + ".element-index .source-path {background-color: var(--gray-800);}"
  + ".element-index .source-path .chevron-btns {background: var(--gray-800-hsl);}"
  + ".element-index .source-path .chevron-btns::after {border-block-end: calc(var(--ui-control-height)/2) solid var(--gray-800) !important;}"
  + ".element-index .source-path .chevron-btns::before {border-block-start: calc(var(--ui-control-height)/2) solid var(--gray-800) !important;}"
  + ".so-content {background: var(--gray-900);}"
  + "@container (width > 700px) {.slideout.showing-sidebar .so-body > .so-content {border-inline-end: 1px solid var(--gray-1000);}}"
  + ".slideout > .so-footer {background: var(--gray-900); box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + ".slideout {background-color: var(--gray-1000); box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + ".slideout.showing-sidebar .so-body > .so-sidebar {background: var(--gray-1000) !important;}"
  + ".so-body h2, .so-body .heading label, .field > .heading > label, .field > .heading > legend {color: var(--gray-100);}"
  + "svg text {color: var(--blue-050); fill: var(--blue-050)}"
  + ".hud .main, .modal .body {background: var(--gray-600); color: var(--blue-050);}"
  + ".apexcharts-tooltip {background-color: var(--gray-800);}"
  + ".apexcharts-tooltip {background: #222 !important; color: #FFF !important; border: 1px solid #444 !important; border-radius: 4px !important;} .apexcharts-tooltip-title { background: #333 !important; border-bottom: 1px solid #444 !important;}"
  + ".apexcharts-radialbar-hollow {fill: var(--gray-900);}"
  + "li.checkboxChecklist.checked {color: var(--green-400);}"
  + ".readable li + li {color: var(--gray-150);}"
  + ".warning {color: var(--gray-150) !important;}"
  + ".warning .code, .warning code {background-color: var(--blue-100); border-color: var(--blue-400); background-color: var(--blue-900);}"
  + ".notice {color: var(--blue-300) !important;}"
  + ".sidebar nav li a, .vue-treeselect__single-value {color: var(--gray-200);}"
  + "div.displaypreview {border: 1px solid var(--gray-700);}"
  + "div.vue-treeselect > div.vue-treeselect__control {background-color: var(--gray-900);}"
  + ".vue-treeselect__menu {background: var(--gray-900) !important;color: var(--gray-050) !important;border: 1px solid var(--gray-400) !important;}.vue-treeselect__option {background: transparent !important;color: var(--gray-050) !important;}.vue-treeselect__option--highlight {background: var(--gray-800) !important;} .vue-treeselect__option--selected {var(--gray-700) !important;font-weight: bold; }.vue-treeselect__option--disabled { var(--gray-400) !important;}"
  + ".vue-treeselect__control {background-color: var(--gray-900); border: 1px solid var(--gray-600)}"
  + "div.vue-treeselect__multi-value-item, span.vue-treeselect__value-remove {color: var(--gray-050); background-color: var(--gray-700);}"
  + ".vue-treeselect__value-remove {border-left: 1px solid var(--gray-400);}"
  + "body.ltr .monaco-editor-codefield {background: var(--gray-900);}"
  + "h4.metadata-title-separator span {background: var(--gray-700); color: var(--gray-100);}"
  + "div[style*='/no_image_set.png'] {filter: invert(1) contrast(0.7);}"
  + ".card-seo-twitter {border: 1px solid var(--gray-700); background-color: var(--gray-800);}"
  + ".card-seo-twitter:hover  {border: 1px solid var(--gray-600); background-color: var(--gray-700);}"
  + ".card-seo-twitter__title {color: var(--blue-200);}"
  + ".card-seo-twitter__description-summary {color: var(--gray-050);}"
  + ".card-seo-twitter__link {color: var(--blue-400);}"
  + "a.googleDisplay:visited {color: #C26EEC;}"
  + ".card-seo-google__url-title {color: #24BC55;}"
  + ".card-seo-google__description {color: var(--gray-150);}"
  + ".monaco-editor > .overflow-guard {filter: invert(0.9) hue-rotate(220deg) brightness(1.1);}"
  + ".card-seo-facebook__text {color: var(--gray-100); background: var(--gray-800); border: 1px solid var(--gray-550);}"
  + ".card-seo-facebook__link {color: var(--blue-200);}"
  + ".card-seo-facebook__title {color: var(--blue-400);}"
  + ".card-seo-facebook__description {color: var(--gray-200)}"
  + ".playground .sprig-component, .playground textarea.field, .playground input.field {background: var(--gray-800);}"
  + ".translate-table tr:nth-child(2n) td:not(:hover) {background-color: var(--gray-900) !important;}"
  + "#details-container .details > .field > .heading > label, #details-container .details > fieldset > legend {color: var(--blue-100);}"
  + ".draft-notice .discard-changes-btn {border: 2px solid var(--blue-300) !important; color: var(--blue-400) !important;}"
  + ".draft-notice {color: var(--blue-300);}"
  + ".ck.ck-editor__main > .ck-editor__editable {background: var(--gray-1000);}"
  + ".ck.ck-toolbar {background: var(--gray-800);}"
  + ".ck.ck-button.ck-button_with-text, a.ck.ck-button.ck-button_with-text, .ck.ck-toolbar > .ck-toolbar__items > :not(.ck-toolbar__line-break), .ck.ck-toolbar > .ck.ck-toolbar__grouped-dropdown, .ck-toolbar__items button, .ck-button {color: var(--gray-050) !important;}"
  + ".elements.busy::after {background: rgba(50,50,55,.75); mix-blend-mode: darken;}"
  + ".element-index-view-menu .menu-footer {background-color: var(--gray-800);}"
  + "div.checkbox, input.checkbox + label {color: var(--blue-050);}"
  + ".icon.move::before {color: var(--custom-text-color,var(--blue-300));}"
  + "th[data-title='Asset'] svg g path + path {fill: rgba(39, 52, 92, 0.8) !important}"
  + ".card > .card-actions-container > .card-actions > .action-btn::before, .card > .card-actions-container > .card-actions > .move::before, .card > .chip-content > .chip-actions > .action-btn::before, .card > .chip-content > .chip-actions > .move::before, .chip > .card-actions-container > .card-actions > .action-btn::before, .chip > .card-actions-container > .card-actions > .move::before, .chip > .chip-content > .chip-actions > .action-btn::before, .chip > .chip-content > .chip-actions > .move::before {color: var(--blue-050,var(--ui-control-color));}"
  + ".zilch {color: var(--blue-200);}"
  + ".select:not(.selectize) select {background-color: var(--gray-800);}"
  + ".select:not(.selectize)::after {color: var(--blue-050);}"
  + ".select:not(.selectize) select:hover:not(:disabled) {background-color: var(--gray-600);}"
  + "ul.icons li a {border: 1px solid var(--gray-500); color: var(--gray-050);}"
  + "ul.icons li a .icon.icon-mask svg circle, ul.icons li a .icon.icon-mask svg ellipse, ul.icons li a .icon.icon-mask svg line, ul.icons li a .icon.icon-mask svg path, ul.icons li a .icon.icon-mask svg polygon, ul.icons li a .icon.icon-mask svg polyline, ul.icons li a .icon.icon-mask svg rect, ul.icons li a .icon.icon-mask svg text {fill: var(--gray-100);}"
  + "ul.icons li a:hover {background-color: var(--gray-800); border-color: var(--gray-300);}"
  + "ul.icons li a:hover .icon.icon-mask svg circle, ul.icons li a:hover .icon.icon-mask svg ellipse, ul.icons li a:hover .icon.icon-mask svg line, ul.icons li a:hover .icon.icon-mask svg path, ul.icons li a:hover .icon.icon-mask svg polygon, ul.icons li a:hover .icon.icon-mask svg polyline, ul.icons li a:hover .icon.icon-mask svg rect, ul.icons li a:hover .icon.icon-mask svg text {fill: var(--gray-150);}"
  + ".selectize.select .selectize-control, .selectize.select .selectize-input, .selectize-input, #live-selectized, .selectize-control.single .selectize-input.input-active, .selectize-input, body .selectize-dropdown-content {background-color: var(--gray-800); color: var(--gray-100);}"
  + ".selectize.select .selectize-control::after {color: var(--gray-100);}"
  + "body .selectize-dropdown .active:not(.selected), body .selectize-dropdown .option:hover {background-color: var(--gray-700)}"
  + ".optgroup .option {color: var(--gray-050);}"
  + ".modal .body {background: var(--gray-1000); background: var(--gray-1000); border: none; box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + ".readable .h1, .readable h1 {color: var(--blue-050);}"
  + ".login-modal-intro p {color: var(--gray-300);}"
  + ".CodeMirror, .border-box, .multiselect > select, .passwordwrapper, .selectize.multiselect .selectize-input, .text {background: var(--gray-900);}"
  + "body.login header {background: var(--gray-800);}"
  + "#system-name .h2, #system-name h2 {color: var(--gray-100);}"
  /*+ "#system-info #site-icon img, #site-icon svg {filter: brightness(20);}"*/
  + ".chevron-btns .btn .btn-body {background-color: var(--gray-1000);}"
  + ".chevron-btns .first-step .btn-body, body .selectize-dropdown .optgroup-header {background-color: var(--gray-800);}"
  + ".chevron-btns .btn.active-drop-target, .chevron-btns .btn.current-step {--ui-control-bg-color: var(--gray-1000);}"
  + ".chevron-btns .btn .chevron-right {border-inline-start: calc(var(--ui-control-height)/2) solid var(--gray-1000);}"
  + ".chevron-btns .first-step .btn .chevron-right {border-inline-start: calc(var(--ui-control-height)/2) solid var(--gray-800);}"
  + ".chevron-btns .btn .chevron-left {border-block-start: calc(var(--ui-control-height)/2) solid var(--gray-1000);}"
  + ".chevron-btns .btn .chevron-left::after {border-block-end: calc(var(--ui-control-height)/2) solid var(--gray-1000);}"
  + ".element-index table.data.vuetable th.sortable:hover, .element-index .btn:hover:not(.chromeless) {background-color: unset;}"
  + "path.apexcharts-radialbar-area[stroke='rgba(139,1,0,0.85)'] {stroke: #E00D0D;}"
  + ".pagination .page-number.active {background: var(--gray-700);}"
  + "table.editable tbody tr td {background-color: var(--gray-800); color: var(--gray-050);}"
  + ".content-notice p {color: var(--blue-050);}"
  + "#sections-vue-admin-table .cell-bold {color: var(--gray-050);}"
  + "#entrytypes-vue-admin-table .chip .cp-icon path {fill: var(--blue-100)}"
  + "#entrytypes-vue-admin-table .chip .chip-content .chip-label, #entrytypes-vue-admin-table .chip .chip-content .chip-label a {color: var(--blue-100)}"
  + "craft-copy-attribute button {color: var(--blue-100);}"
  + "craft-copy-attribute button:focus, craft-copy-attribute button:hover {border-color: var(--gray-350); color: var(--gray-100);}"
  + ".vue-admin-table-footer {background-color: var(--gray-800); border-top: 1px solid var(--gray-600);}"
  + ".content-notice .content-notice-icon {box-shadow: none;}"
  + "body .selectize-dropdown .optgroup-header, body .selectize-dropdown .option, body .selectize-dropdown, .selectize-dropdown .active:not(.selected), body .selectize-dropdown .optgroup-header [data-selectable], .autosuggest__results-container .autosuggest__results-item {color: var(--gray-100);}"
  + "body .selectize-dropdown .optgroup-header, .autosuggest__results-container .autosuggest__results-before {color: var(--gray-350)}"
  + ".pane.secondary {background: var(--gray-900); border: none; box-shadow: 0 0 0 1px rgba(0,0,0,.2), 0 2px 12px rgba(0,0,0,.25);}"
  + ".autosuggest__results-container {background-color: var(--gray-800);}"
  + ".fui-pages-menu {background: var(--gray-900); border-bottom: 1px solid var(--gray-1000);}"
  + ".fui-tab-item {background: var(--gray-800); color: var(--gray-100);}"
  + ".fui-field-tabs .fui-tab-btn {background-image: linear-gradient(#3f4d5a,#263647) !important;}"
  + ".fui-settings-wrap {background: var(--gray-900);}"
  + ".fui-settings-wrap {background: var(--gray-900); border: 1px solid var(--gray-700);}"
  + ".fui-editor-toolbar {background: var(--gray-800);}"
  + ".fui-toolbar-btn .custom-svg, .fui-field-tabs .fui-tab-btn {fill: var(--gray-100) !important;}"
  + ".fui-field-tabs .fui-tab-btn {border: 1px solid var(--gray-700)}"
  + ".btn.fui-toolbar-btn.v-popper--has-tooltip:hover {background-color: var(--gray-700) !important;}"
  + ".fui-rich-text .ProseMirror {background: var(--gray-900);}"
  + ".tippy-box[data-theme~='light-border'] {background: var(--gray-900); border: 1px solid var(--gray-600);}"
  + ".fui-list-item-heading {border-bottom: 1px solid var(--gray-600) !important;}"
  + ".fui-list-item {color: var(--gray-050) !important;}"
  + ".fui-list-item.is-selected {background-color: var(--gray-800) !important; color: var(--blue-050);}"
  + ".fui-list-item.is-selected, .fui-list-item:hover {background: var(--gray-700);}"
  + ".fui-list-item:hover {background: var(--gray-800) !important;}"
  + ".fui-tab-btn::after {color: var(--gray-050);}"
  + ".fui-field-info .fui-field-label, .fui-pages-sidebar-item h4 {color: var(--gray-100);}"
  + ".fui-field-block:hover, .fui-sidebar-wrapper {background: var(--gray-900);}"
  + " {background: var(--gray-900);}"
  + ".sidebar-title {color: var(--gray-100);}"
  + ".fui-sidebar-wrapper .add.btn:hover {background: var(--gray-700) !important;}"
  + ".fui-field-preview .fui-field-input, .fui-field-preview .fui-field-select {background: var(--gray-900); color: var(--gray-050); border: 1px solid var(--gray-600);}"
  + ".fui-field-icon {opacity: .7 !important}"
  + ".fui-field-icon svg {color: #FFF !important; fill: #FFF !important}"
  + ".fui-modal-header, .fui-pages-sidebar {background-color: var(--gray-800);}"
  + ".fui-modal-title {color: #FFF !important;}"
  + ".fui-dialog-close {filter: brightness(5); opacity: 1 !important;}"
  + ".fui-pages-wrap {background: var(--gray-900);}"
  + ".fui-pages-sidebar {background: var(--gray-800) !important;}"
  + ".fui-pages-sidebar-item {background: var(--gray-700) !important;}"
  + ".fui-pages-sidebar-item h4 {color: var(--gray-100) !important;}"
  + ".fui-modal-footer, .fui-email-header, .fui-email-footer {background: var(--gray-800);}"
  + ".formkit-form, .fui-modal-content, #modalDescription {background: var(--gray-900);}"
  + ".field-wrapper .input {color: var(--blue-200);}"
  + "table.editable td.action, table.editable td.heading, table.editable th {background-color: var(--gray-800); color: var(--gray-100);}"
  + "table.editable {border: 1px solid var(--gray-500);}"
  + ".fui-tags-list .ProseMirror:not(.read-only) {background: var(--gray-1000);}"
  + ".fui-field-add-variable-icon:hover, .is-open .fui-field-add-variable-icon {background: var(--gray-700) !important; border-left-color: var(--gray-800) !important;}"
  + ".fui-field-add-variable-icon {color: var(--gray-050) !important;}"
  + ".fui-field-add-variable-icon:hover svg, .is-open .fui-field-add-variable-icon svg, .fui-field-add-variable-icon svg {color: var(--gray-050) !important}"
  + ".fui-email-header {border-bottom: 1px var(--gray-700) solid;}"
  + ".fui-email-meta {background: var(--gray-800); color: var(--gray-100);}"
  + ".modal {background-color: var(--gray-900);}"
  + ".customize-sources-modal > .footer, .customize-sources-modal > .cs-sidebar {background: var(--gray-800);}"
  + ".customize-sources-item {background-color: var(--gray-900); color: var(--gray-050);}"
  + ".instructions {color: var(--blue-300) !important;}"
  + ".elements .header {background-color: var(--gray-800);}"
  + ".elements .thumbsview li:hover .chip {background-color: var(--gray-500);}"
  + ".card > .card-titlebar {background-color: var(--gray-900,var(--gray-100));}"
  + ".ps-wrapper .ps-sidebar {background-color: var(--gray-800);}"
  + ".nav-items ul li a.router-link-exact-active {background-color: var(--gray-900); color: var(--gray-100);}}"
  + ".nav-items ul li a {color: var(--blue-050);}"
  + ".ps-sidebar {border-right: 1px solid var(--gray-800);}"
  + ".nav-items ul li a {color: var(--gray-100);}"
  + ".nav-items ul li a:hover {background-color: var(--gray-700);}"
  + ".plugin-name {color: var(--gray-050);}"
  + ".plugin-name + div {color: var(--blue-200);}"
  + "a.plugin-card:hover strong {color: var(--blue-300) !important;}"
  + ".tw-border-gray-200 {border-color: var(--gray-600);}"
  + "hr {border-color: var(--gray-500);}"
  + ".update .pane.release {background: var(--gray-800) !important;}"
  + "#content .update .releases .release .release-info.fieldtoggle::before {border-color: var(--gray-050);}"
  + ".release-heading a span:first-child {color: var(--blue-050);}"
  + ".release-heading a span:nth-child(2) {color: var(--blue-300) !important;}"
  + ".readable code, .readable pre {background-color: var(--blue-900);}"
  + ".tw-bg-white {background: var(--gray-800); color: var(--blue-200);}"
  + ".tw-text-gray-500, .tw-text-gray-700, .changelog-release .version .date {color: var(--gray-200);}"
  + ".changelog-release {border-color: var(--gray-700);}"
  + ".tw-text-blue-600 {color: var(--blue-400);}"
  + ".tw-bg-gray-50 {background-color: var(--gray-800); border: 1px solid var(--gray-700);}"
  + ".tw-bg-gray-50:hover, .tw-bg-white:hover {background-color: var(--gray-700); border: 1px solid var(--gray-600);}"
  + ".tw-text-black {color: var(--gray-50);}"
  + ".tw-bg-blue-50 {background: var(--gray-700); color: var(--blue-300);}"
  + ".footer, .header, .hud-footer, .hud-header {color: var(--gray-100); background-color: var(--gray-800);}"
  + "#pluginstore-modal .pluginstore-modal-flex .pluginstore-modal-main .pluginstore-modal-content {color: var(--gray-050);}"
  + ".elementselect .progress-shade {background-color: var(--gray-1000); opacity: .5;}"
  + ".card-body {color: var(--blue-050);}"
  + ".cp-bookmarks {border-bottom: 1px solid var(--gray-1000);}"
  + ".cp-bookmarks::before {color: var(--gray-300);}"
  + ".bookmarks-tag svg {fill: var(--gray-300);}"
  + ".tagged .cp-bookmark::after {color: var(--gray-200);}"
  + ".dark .cp-bookmark svg.dark, .dark .cp-bookmark svg.dark path {fill: var(--gray-100) !important;}"
  + ".cp-bookmark-close {background: var(--gray-100); color: var(--gray-800); fill: var(--gray-800);}"
  + ".bookmark-dialog, .bookmark-modal, .bookmark-list-modal {background: var(--gray-800);}"
  + ".bookmark-title, .bookmark-desc, .bookmark-dialog-info, .bookmark-modal-title, .bookmark-modal-desc {color: var(--gray-100);}"
  + ".bookmark-form-item label, .bookmark-list-modal label {color: var(--gray-200);}"
  + ".bookmark-form-item input, .bookmark-form-item textarea {background: var(--gray-900); color: var(--gray-100);}"
  + ".bookmark-toggle-dark {background: var(--gray-200);}"
  + ".elements .tableview .message-text textarea {color: var(--gray-400);}"
  + ".elements .tableview .language-label {background: var(--gray-700); color: var(--gray-050);}"
  + ".elements > .tableview > table tbody td.modified {background-color: var(--gray-600) !important;}"
  + ".log-result {background: var(--gray-500);}"
  + "td.col-label code {background: var(--gray-800) !important;}"
  + ".dark .bookmark-toggle-dark:hover {background: var(--gray-300);}"
  + ".dark .dialog-closer svg, .dark .modal-closer svg, .bookmark-export-copy {fill: var(--gray-100);}"
  + ".dark .icon-picker--icon {background: var(--gray-1000);}"
  + ".dark .icon-picker--icon svg path {fill: var(--gray-100);}"
  + ".bookmarks-import-export svg {fill: var(--gray-300);}"
  + ".bmi-link-inputs {background: var(--gray-900);}"
  + ".bmi-link-admin {color: var(--gray-100);}"
  + ".bmi-alt-hostname input {background: var(--gray-900);}"
  + ".bmi-link-host {color: var(--blue-300);}"
  + ".bmi-item.exists > .bmi-label-icon::after {color: var(--red-400);}"
  + "#page-container > #alerts {background-color: var(--red-900) !important; border-left: 6px solid var(--red-600) !important; color: var(--white) !important;}"
  + "#page-container > #alerts > li {box-shadow: inset 0 -1px 0 0 var(--red-800);}"
  + "#page-container > #alerts > li a:not(.btn), #alerts > li a:not(.btn).go::after {color: var(--red-200);}"
  + "#page-container > #alerts > li .btn, #alerts > li a.go {border: 1px solid var(--red-200);}"
  + "#page-container > #alerts > li .btn:hover, #alerts > li a.go:hover {border-color: var(--red-400);}"
  + ".retour-import-list-group-item {background-color: var(--gray-800); border: 1px solid var(--gray-500);}"
  + ".retour-empty-item {background: repeating-linear-gradient(-55deg,var(--gray-600),var(--gray-600) 10px,var(--gray-800) 10px,var(--gray-800) 20px);}"
  + ".retour-import-field-group-item {background-color: var(--gray-800); border: 1px solid var(--gray-500);}"
  + ".details .meta .datewrapper .text + div[data-icon], .details .meta .text::placeholder, .details .meta .timewrapper .text + div[data-icon] {color: var(--gray-100);}"
  + ".ui-datepicker-month {color: var(--gray-050);}"
  + ".ui-datepicker-calendar td a {color: var(--gray-200);}"
  + ".ui-datepicker-calendar td a:hover, .ui-timepicker-list li:hover {background-color: var(--gray-400);}"
  + ".ui-datepicker-prev::after, .ui-datepicker-next::after {color: var(--white);}"
  + ".ui-datepicker-calendar th span {color: var(--gray-300);}"
  + ".ui-timepicker-list li {color: var(--gray-200);}"
  + ".clear-btn {color: var(--gray-200);}"
  + ".card > .card-titlebar .card-titlebar-label, .lightswitch-outer-container .lightswitch-inner-container span {color: var(--gray-100);}"
  + ".card > .card-titlebar > .card-actions-container > .card-actions > .action-btn::before, .card > .card-titlebar > .card-actions-container > .card-actions > .btn.chromeless::before, .chip > .chip-content > .chip-actions > .action-btn::before, .chip > .chip-content > .chip-actions > .btn.chromeless::before, .matrixblock > .actions > .action-btn::before, .matrixblock > .actions > .btn.chromeless::before {color: var(--gray-050);}"
  + ".card .card-content .card-heading, .lightswitch-inner-container span {color: var(--gray-100);}"
  + ".menu li > .menu-item span.icon:not([data-icon]) svg circle, .menu li > .menu-item span.icon:not([data-icon]) svg ellipse, .menu li > .menu-item span.icon:not([data-icon]) svg line, .menu li > .menu-item span.icon:not([data-icon]) svg path, .menu li > .menu-item span.icon:not([data-icon]) svg polygon, .menu li > .menu-item span.icon:not([data-icon]) svg polyline, .menu li > .menu-item span.icon:not([data-icon]) svg rect, .menu li > .menu-item span.icon:not([data-icon]) svg text, .menu li > a span.icon:not([data-icon]) svg circle, .menu li > a span.icon:not([data-icon]) svg ellipse, .menu li > a span.icon:not([data-icon]) svg line, .menu li > a span.icon:not([data-icon]) svg path, .menu li > a span.icon:not([data-icon]) svg polygon, .menu li > a span.icon:not([data-icon]) svg polyline, .menu li > a span.icon:not([data-icon]) svg rect, .menu li > a span.icon:not([data-icon]) svg text, .menu li > button span.icon:not([data-icon]) svg circle, .menu li > button span.icon:not([data-icon]) svg ellipse, .menu li > button span.icon:not([data-icon]) svg line, .menu li > button span.icon:not([data-icon]) svg path, .menu li > button span.icon:not([data-icon]) svg polygon, .menu li > button span.icon:not([data-icon]) svg polyline, .menu li > button span.icon:not([data-icon]) svg rect, .menu li > button span.icon:not([data-icon]) svg text {fill: var(--gray-100);}"
  + "div.seomatic-field {background-color: var(--gray-800); border: 1px solid var(--gray-400);}"
  + "div.seomatic-tab-content {background: var(--gray-1000);}"
  + ".inherited.value-wrapper .instructions p, .inherited.value-wrapper .heading > label, .inherited.value-wrapper div.vue-treeselect__control {opacity: 1;}"
  + "nav.seomatic-tabs ul li a.sel {background: var(--gray-600); color: var(--gray-100);}"
  + "nav.seomatic-tabs {box-shadow: inset 0 -1px var(--gray-800);}"
  + ".chars-left {color: var(--gray-300);}"
  + ".draft-notice .draft-icon::before {color: var(--blue-200) !important;}"
  + ".draft-notice .draft-icon {box-shadow: 0 1px 1px 1px var(--gray-500);}"
  + ".error-summary {background: var(--gray-800); background-color: var(--gray-800); border-radius: var(--radius-lg); box-shadow: 0 0 5px 2px var(--blue-500);}"
  + ".error-summary > ul.errors li, .error-summary > ul.errors li a {color: var(--gray-050);}"
  + ".sidebar:not(.drag-helper) {background-color: var(--gray-900);}"
  + ".tip + .body .main {background: var(--gray-1000); overflow: hidden; border-radius: 4px;}"
  + ".datatablesorthelper {background: var(--black); color: var(--gray-200)}"
  + ".fld-container .fld-workspace {background-color: var(--gray-900); background-image: linear-gradient(to right,var(--gray-800) 1px,transparent 0),linear-gradient(to bottom,var(--gray-800) 1px,transparent 1px); background-position: -1px -1px;}"
  + ".fld-tab .fld-tabcontent, .fld-tab .tabs .tab, .layoutdesigner .fld-library {background-color: var(--gray-1000);}"
  + ".fld-workspace .btn {background: var(--gray-800);}"
  + ".fld-new-tab-btn {background: var(--gray-700) !important;}"
  + ".fld-element.fld-field {background-color: var(--gray-900);}"
  + ".fld-element .field-name .fld-element-label h4 {color: var(--blue-100);}"
  + ".error {color: var(--red-500) !important;}"
  + ".menu li > .menu-item.error span.icon:not([data-icon]) svg circle, .menu li > .menu-item.error span.icon:not([data-icon]) svg ellipse, .menu li > .menu-item.error span.icon:not([data-icon]) svg line, .menu li > .menu-item.error span.icon:not([data-icon]) svg path, .menu li > .menu-item.error span.icon:not([data-icon]) svg polygon, .menu li > .menu-item.error span.icon:not([data-icon]) svg polyline, .menu li > .menu-item.error span.icon:not([data-icon]) svg rect, .menu li > .menu-item.error span.icon:not([data-icon]) svg text, .menu li > a.error span.icon:not([data-icon]) svg circle, .menu li > a.error span.icon:not([data-icon]) svg ellipse, .menu li > a.error span.icon:not([data-icon]) svg line, .menu li > a.error span.icon:not([data-icon]) svg path, .menu li > a.error span.icon:not([data-icon]) svg polygon, .menu li > a.error span.icon:not([data-icon]) svg polyline, .menu li > a.error span.icon:not([data-icon]) svg rect, .menu li > a.error span.icon:not([data-icon]) svg text, .menu li > button.error span.icon:not([data-icon]) svg circle, .menu li > button.error span.icon:not([data-icon]) svg ellipse, .menu li > button.error span.icon:not([data-icon]) svg line, .menu li > button.error span.icon:not([data-icon]) svg path, .menu li > button.error span.icon:not([data-icon]) svg polygon, .menu li > button.error span.icon:not([data-icon]) svg polyline, .menu li > button.error span.icon:not([data-icon]) svg rect, .menu li > button.error span.icon:not([data-icon]) svg text {fill: var(--red-500);}"
  + ".ck.ck-toolbar {background: var(--gray-800) !important;}"
  + ".ck.ck-editor__main > .ck-editor__editable, .ck.ck-color-selector .ck-color-picker-fragment .ck.ck-color-picker, .ck.ck-color-selector .ck-color-picker-fragment .ck.ck-color-selector_action-bar {background: var(--gray-1000) !important;}"
  + ".ck.ck-list-styles-list, .ck-dropdown__panel {background: var(--gray-1000) !important; overflow: auto;}"
  + ".ck-color-grids-fragment {background: var(--gray-1000) !important;}"
  + ".ck.ck-input {background: var(--gray-900); color: var(--gray-100);}"
  + "a.fieldtoggle, button.fieldtoggle:not(.lightswitch) {color: var(--gray-100);}"
  + ".fieldtoggle + div .heading label {color: var(--blue-300) !important;}"
  + ".ck.ck-list {background: var(--gray-1000) !important;}"
  + ".ck.ck-button.ck-list-item-button, .ck.ck-button.ck-list-item-button.ck-on {background: var(--gray-900) !important;}"
  + ".thumbsview li .label-link {color: var(--gray-200);}"
  + ".card .label .label-link, .chip .label .label-link {color: var(--blue-300);}"
  + ".details > .field > .heading > label, .details > fieldset > legend {color: var(--gray-300);}"
  + ".matrixblock .flex-fields {position: relative; z-index: 1;}"
  + ".card:not(.chromeless, .hairline) > .fields::after, .chip:not(.chromeless, .hairline) > .fields::after, .matrixblock:not(.chromeless, .hairline) > .fields::after {content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 100%; mix-blend-mode: soft-light; z-index: 0; opacity: .5;}"
  + ".matrixblock .titlebar {background: var(--gray-800); color: var(--gray-100);}"
  + ".matrixblock[style*='rose-'] .titlebar {background: var(--rose-950); color: var(--rose-100);}"
  + ".matrixblock[style*='rose-'] > .fields::after {background: var(--rose-900);}"
  + ".matrixblock[style*='rose-']::before {box-shadow: inset 0 0 0 1px var(--rose-800,var(--gray-200));}"
  + ".matrixblock[style*='violet-'] .titlebar {background: var(--violet-950); color: var(--violet-100);}"
  + ".matrixblock[style*='violet-'] > .fields::after {background: var(--violet-900);}"
  + ".matrixblock[style*='violet-']::before {box-shadow: inset 0 0 0 1px var(--violet-800,var(--gray-200));}"
  + ".matrixblock[style*='green-'] .titlebar {background: var(--green-950); color: var(--green-100);}"
  + ".matrixblock[style*='green-'] > .fields::after {background: var(--green-900);}"
  + ".matrixblock[style*='green-']::before {box-shadow: inset 0 0 0 1px var(--green-800,var(--gray-200));}"
  + ".matrixblock > .titlebar > .matrixblock-tabs .pane-tabs {position: relative; z-index: 2;}"
  + ".matrixblock > .actions {z-index: 2;}"
  + ".seo--wrap {border-bottom: 1px solid var(--gray-700);}"
  + ".seo--tabs::after, .seo--tabs::before {background-color: var(--blue-700);}"
  + ".seo--tabs::before {background-color: var(--gray-800);}"
  + ".seo--tabs::after, .seo--tabs::before {border-bottom: 1px solid var(--gray-800);}"
 	+ ".seo--tabs {background-color: var(--gray-800);}"
  + ".seo--tabs a {border: 1px solid var(--gray-500); color: var(--gray-200);}"
  + ".seo--tabs a.active {background-color: var(--gray-600); border-bottom-color: var(--gray-600); border-top: 1px solid var(--gray-800); color: var(--gray-100);}"
  + ".seo--panel {background: var(--gray-900); border: 1px solid var(--gray-700);}"
  + ".seo--snippet-title-editable {background-color: var(--gray-700);}"
  + ".seo--snippet-title-locked {color: var(--blue-100);}"
  + ".seo--snippet-title-editable {color: var(--blue-300);}"
  + ".seo--snippet-description {background-color: var(--gray-800); color: var(--gray-100);}"
  + ".seo--label em, .seo--keywords-details-keyword {color: var(--gray-100);}"
  + ".seo--keywords-input, .seo--keywords-input input {background-color: var(--gray-800); border: var(--gray-800);}"
  + ".seo--snippet-url {color: var(--green-400);}"
  + ".seo--keywords-details-checklist li {color: var(--gray-300);}"
  + ".seo--social {background: var(--gray-900) !important; border: 1px solid var(--gray-700);}"
  + ".seo--social-preview {background-color: var(--gray-800);}"
  + ".seo--social-preview {border: 1px solid var(--gray-700);}"
  + ".seo--social-preview-content textarea {background: var(--gray-600); color: var(--gray-100) !important; padding: 4px 6px;}"
  + ".seo--social-preview-image {background: var(--gray-900) 50% no-repeat;}"
  + ".seo--social-preview-content {border-top: 1px solid var(--gray-700);}"
  + ".seo--social-preview-content input {background: var(--gray-800); color: var(--gray-100) !important;}"
  + ".seo--keywords-input > a {background: var(--gray-900); border: 1px solid var(--gray-700); color: var(--blue-050);}"
  + ".seo--keywords-input > a.active, .seo--keywords-input > a:hover {color: var(--blue-200)}"
  + ".ck-source-editing-area textarea {background: var(--gray-900);}"
  + ".ck.ck-editor li {color: var(--gray-100)}"
  + ".chips.chips-small li {height: unset;}"
  + "#notifications .copied-elements-notification .notification-inner {background: var(--gray-800) !important;}"
  + ".seo--sitemap-tag {background-color: var(--blue-900);}"
  + "table.data tbody tr.sel:hover td, table.data tbody tr.sel:hover th {background: var(--gray-700);}"
  + ".details > .field > .input > .text.fullwidth {background-color: var(--gray-800) !important;}"
  + "#content .pane, .lp-content .pane, .pane .pane, .slideout .pane {background: var(--gray-800); color: var(--gray-100);}"
  + ".chip-label > div {color: var(--blue-300);}"
  + ".fld-element-settings-footer {background: var(--gray-900) !important; box-shadow: var(--gray-700);}"
  + ".btn.secondary.submit {background: var(--red-600) !important;}"
  + ".condition-rule {background-color: var(--gray-900);}"
  + ".selectize.multiselect .selectize-input > .item {background-color: var(--gray-700); color: var(--gray-100);}"
  + ".selectize.multiselect .selectize-input > .item > .remove {color: var(--gray-200);}"
  + ".ck.ck-balloon-panel, .ck.ck-labeled-field-view > .ck.ck-labeled-field-view__input-wrapper > .ck.ck-label {background: var(--gray-900);}"
  + ".ck.ck-labeled-field-view > .ck.ck-labeled-field-view__input-wrapper > .ck.ck-label, .ck-reset_all :not(.ck-reset_all-excluded *), .ck.ck-reset_all {color: var(--gray-100);}"
  + ".ck.ck-button-action, a.ck.ck-button-action {background: var(--red-600);}"
  + ".ck.ck-button-action:not(.ck-disabled):hover, a.ck.ck-button-action:not(.ck-disabled):hover {background: var(--red-500);}"
  + ".ck.ck-balloon-panel[class*='arrow_s']::after {border-color: var(--gray-900) transparent transparent transparent;}"
  + ".ck-widget.raw-html-embed {background-color: var(--gray-700);}"
  + ".ck-widget.raw-html-embed .raw-html-embed__source[disabled], .ck-widget.raw-html-embed .raw-html-embed__source[disabled]::placeholder {background: var(--gray-900); color: var(--gray-300); -webkit-text-fill-color: var(--gray-300);}"
  + ".ck-source-editing-area textarea {color: var(--gray-200);}"
  + ".card:not(.chromeless), .chip:not(.chromeless), .matrixblock:not(.chromeless) {color: var(--blue-200);}"
  + ".slideout > .so-body.so-full-details, .slideout > .so-body > .so-sidebar {background-color: var(--gray-900) !important;}"
  + ".fui-field-pill {background: var(--gray-700); border: 1px solid var(--gray-500); color: var(--gray-100);}"
  + ".customize-sources-item.heading .label {color: var(--blue-200);}"
  + ".customize-sources-item:not(.sel) .handle {color: var(--gray-400);}"
  + ".ckeditor-tb::after {background: linear-gradient(to bottom,hsl(var(--gray-800-hsl),0),hsl(var(--gray-800-hsl),1)) !important;}"
  + ".chip[style*='amber']:not([data-cp-url]) {background: var(--amber-900);}"
  + ".chip[style*='amber']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--amber-700,var(--gray-200));}"
  + ".chip[style*='blue']:not([data-cp-url]) {background: var(--blue-900);}"
  + ".chip[style*='blue']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--blue-700,var(--gray-200));}"
  + ".chip[style*='cyan']:not([data-cp-url]) {background: var(--cyan-900);}"
  + ".chip[style*='cyan']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--cyan-700,var(--gray-200));}"
  + ".chip[style*='emerald']:not([data-cp-url]) {background: var(--emerald-900);}"
  + ".chip[style*='emerald']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--emerald-700,var(--gray-200));}"
  + ".chip[style*='fuchsia']:not([data-cp-url]) {background: var(--fuchsia-900);}"
  + ".chip[style*='fuchsia']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--fuchsia-700,var(--gray-200));}"
  + ".chip[style*='gray']:not([data-cp-url]) {background: var(--gray-900);}"
  + ".chip[style*='gray']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--gray-700,var(--gray-200));}"
  + ".chip[style*='green']:not([data-cp-url]) {background: var(--green-900);}"
  + ".chip[style*='green']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--green-700,var(--gray-200));}"
  + ".chip[style*='indigo']:not([data-cp-url]) {background: var(--indigo-900);}"
  + ".chip[style*='indigo']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--indigo-700,var(--gray-200));}"
  + ".chip[style*='lime']:not([data-cp-url]) {background: var(--lime-900);}"
  + ".chip[style*='lime']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--lime-700,var(--gray-200));}"
  + ".chip[style*='orange']:not([data-cp-url]) {background: var(--orange-900);}"
  + ".chip[style*='orange']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--orange-700,var(--gray-200));}"
  + ".chip[style*='pink']:not([data-cp-url]) {background: var(--pink-900);}"
  + ".chip[style*='pink']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--pink-700,var(--gray-200));}"
  + ".chip[style*='purple']:not([data-cp-url]) {background: var(--purple-900);}"
  + ".chip[style*='purple']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--purple-700,var(--gray-200));}"
  + ".chip[style*='red']:not([data-cp-url]) {background: var(--red-900);}"
  + ".chip[style*='red']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--red-700,var(--gray-200));}"
  + ".chip[style*='rose']:not([data-cp-url]) {background: var(--rose-900);}"
  + ".chip[style*='rose']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--rose-700,var(--gray-200));}"
  + ".chip[style*='sky']:not([data-cp-url]) {background: var(--sky-900);}"
  + ".chip[style*='sky']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--sky-700,var(--gray-200));}"
  + ".chip[style*='teal']:not([data-cp-url]) {background: var(--teal-900);}"
  + ".chip[style*='teal']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--teal-700,var(--gray-200));}"
  + ".chip[style*='violet']:not([data-cp-url]) {background: var(--violet-900);}"
  + ".chip[style*='violet']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--violet-700,var(--gray-200));}"
  + ".chip[style*='yellow']:not([data-cp-url]) {background: var(--yellow-900);}"
  + ".chip[style*='yellow']:not([data-cp-url])::before {box-shadow: inset 0 0 0 1px var(--yellow-700,var(--gray-200));}"
  + ".fld-element {background-color: var(--gray-800);}"
  + ".hud .tip-leftn .hud .tip-left {filter: brightness(0.17) sepia(1) hue-rotate(150deg);}"
  + ".message .subject {border-block-end: 1px solid var(--gray-500);}"
  + ".message .body {color: var(--blue-200);}"
  + "table.editable tbody tr th ~ td:not(:first-child) {border-inline-start: 1px solid var(--gray-600);}"
  + "table.editable tbody tr td.disabled::after {background-color: rgba(0,0,0,.25);}"
  + ".entry-type-group {background-color: var(--gray-900);}"
  + ".entry-type-group--titlebar {color: var(--gray-100)}"
  + "#sidebar .btn.hairline, #sidebar .btn.link-btn {border: 1px solid var(--gray-600);}"
  + ".selectize.select input::placeholder, .selectize.select textarea::placeholder {color: var(--gray-200);}"
  + ".alert-count {background: var(--gray-900); color: var(--gray-200);}"
  + ".fui-field-select {background: var(--gray-700) !important;}"
  + ".fui-integrations-sidebar-wrapper {background: var(--gray-800);}"
  + ".fui-subfield-workspace {background-color: var(--gray-800); background-image: linear-gradient(to right,var(--gray-900) 1px,transparent 0),linear-gradient(to bottom,var(--gray-900) 1px,transparent 1px);}"
  + ".fui-subfield-block {background-color: var(--gray-900);}"
  + ".fui-subfield-content-title {color: var(--gray-100);}"
  + "";


  if ( $("#account-menu").length ) {
    $("#account-menu hr:first").after("<div class='darkmode-toggler'>"+ iconBulb +"<span>Dark mode</span></div><hr>");
    function darkmodeCheck() {
      stylesheet( "darkmode", "Dark mode" ,styleDarkmode );
      if ( $("head .darkmode").length ) {
        $(this).addClass("on");
        $("body").addClass("dark");
        localStorage.setItem("darkmode", true);
      } else {
        $("body").removeClass("dark");
        $(this).removeClass("on");
        localStorage.setItem("darkmode", false);
      }
    }
    $(".darkmode-toggler").on("click", darkmodeCheck);
    if ( localStorage.getItem("darkmode") != null ) {
      if ( localStorage.getItem("darkmode") == "true" ) { darkmodeCheck() }
    }
  }

  function stylesheet(className, label, styleCont) {
    if ( $("head ."+ className ).length ) {
      $("head ."+ className).remove();
    } else {
      $("head").append( "<style class='"+ className +"'>"+ styleCont +"</style>");
    }
  }

  // Redirects Autoscroll (Retour)
  if ( $("h1#page-heading").attr("title") == "Redirects" ) {
    $("#main-content #cp-nav-content > div:first").after("<div class='pro-autotrace-cont'></div>");
    $(".pro-autotrace-cont").append("<div class='checkbox-select-item'><input type='checkbox' value='link' class='checkbox' id='pro-autotrace'><label for='pro-autotrace'>Automatically Scroll to next item after saving</label></div>");
    $("#pro-autotrace").on("change input", function() {
      if ( $(this).prop("checked") ) {
        localStorage.setItem("pro-autotrace", true);
      } else {
        localStorage.removeItem("pro-autotrace");
      }
    });
    if ( localStorage.getItem("pro-autotrace") != null ) {
      if ( localStorage.getItem("pro-autotrace") == "true" ) {
        $("#pro-autotrace").prop("checked", true);
      }
    }

    let findRedirects = setInterval( function() {
      if ( $(".vuetable-body tr[item-index] a.go").length ) {
        clearInterval( findRedirects );
        $(".vuetable-pagination select[data-target-prefix]").append("<option value='1000000'>All</option>");

        setTimeout( function() {
          // Save
          $(window).on("click", function(e) {
            console.log( $(e.target).closest("tr[item-index] a.go").length );
            if ( $(e.target).closest("tr[item-index] a.go").length ) {
              if ( localStorage.getItem("pro-autotrace") != null ) {
                if ( localStorage.getItem("pro-autotrace") == "true" ) {
                  e.preventDefault();
                  e.stopPropagation();
                  let nth = parseInt( $(e.target).closest("tr").attr("item-index") );
                  if ( nth != null && nth != undefined ) {
                    if ( $(e.target).closest("tbody").find("tr[item-index='"+ (nth + 1) +"']").length ) { nth = (nth + 1) }
                    localStorage.setItem("pro-autotrace-id", nth );
                  }
                  console.log( $(e.target).closest("tr[item-index] a.go") );
                  window.location.href = $(e.target).closest("tr[item-index] a.go").attr("href");
                }
              }
            }
          });
          console.log( $("tr[item-index] a.go").length );

          // Load
          if ( localStorage.getItem("pro-autotrace") == "true" && localStorage.getItem("pro-autotrace-id") != null ) {
            const nth = parseInt( localStorage.getItem("pro-autotrace-id") );
            const item = $("tr[item-index='"+ nth +"']:has(a.go)");
            console.log( item );
            $(window).scrollTop( item.offset().top - 110 );
          }
        }, 100);
      }
    }, 120);    
  }

}


