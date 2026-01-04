// ==UserScript==
// @name         Download Link Skipper (suprafiles, zippyshare, filemack, dbree, cloudyfiles, 9clacks)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Skips the extra clicking needed when downloading stuff
// @author       spyruf
// @include      *9clacks*.*
// @include      *srcleaks*.*
// @include      *----suprafiles.*/*
// @include      *----cloudyfiles.*/*
// @include      *filemack.com/*
// @include      *zippyshare.com/*
// @include      *asdfasdfdbr.ee/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/34638/Download%20Link%20Skipper%20%28suprafiles%2C%20zippyshare%2C%20filemack%2C%20dbree%2C%20cloudyfiles%2C%209clacks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34638/Download%20Link%20Skipper%20%28suprafiles%2C%20zippyshare%2C%20filemack%2C%20dbree%2C%20cloudyfiles%2C%209clacks%29.meta.js
// ==/UserScript==


if (window.top != window.self) //-- Don't run on frames or iframes
  return;


(function() {
  'use strict';

  console.log("window.location.href is: " + window.location.href);
  console.log("Link Skipper is running!");
  console.log("localStorage variable download is: " + localStorage.getItem("download"));

  // 9clacks stuff, ignore for most ppl

  if (localStorage.getItem("download") === null) {

    //console.log("settinglocalstorage");

    localStorage.setItem('download', 'null');
  }

  if (window.location.href.indexOf("9clacks") != -1) {

    console.log("I am on 9clacks page");

    $('a:contains("Read More")').click(
      function() {

        console.log("Read More clicked, proceeding to download");

        localStorage.setItem('download', 'true');

      });
  }
  if (window.location.href.indexOf("9clacks2") != -1 && localStorage.getItem("download") == 'true') {

    console.log("finding Link");

    var link = $('a:contains("cloudyfiles")').attr('href');
    link = link.slice(link.indexOf("=") + 1);
    console.log("Link is: " + link);


    localStorage.setItem('download', 'false');

    var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || safari.pushNotification);

    if (isSafari == false)
      window.history.back();
    window.open(link, "_blank");


  } else if (window.location.href.indexOf("srcleaks") != -1) {

    console.log("getting dl link");

    // First try dbree
    // Then suprafiles
    // Then any iTunes DL
    // Then any at all

    //iTunes
    if ($('a:contains("iTunes DL"):contains("dbree")').length !== 0)
      $('a:contains("iTunes DL"):contains("dbree")')[0].click();
    else if ($('a:contains("iTunes DL"):contains("suprafiles")').length !== 0)
      $('a:contains("iTunes DL"):contains("suprafiles")')[0].click();
    else if ($('a:contains("iTunes")').length !== 0)
      $('a:contains("iTunes")')[0].click();

    //320
    else if ($('a:contains("320 DL"):contains("dbree")').length !== 0)
      $('a:contains("320 DL"):contains("dbree")')[0].click();
    else if ($('a:contains("320 DL"):contains("suprafiles")').length !== 0)
      $('a:contains("320 DL"):contains("suprafiles")')[0].click();
    else if ($('a:contains("320 DL")').length !== 0)
      $('a:contains("320 DL")')[0].click();

    //M4A
    else if ($('a:contains("M4A DL"):contains("dbree")').length !== 0)
      $('a:contains("M4A DL"):contains("dbree")')[0].click();
    else if ($('a:contains("M4A DL"):contains("suprafiles")').length !== 0)
      $('a:contains("M4A DL"):contains("suprafiles")')[0].click();
    else if ($('a:contains("M4A DL")').length !== 0)
      $('a:contains("M4A DL")')[0].click();

    //CDQ
    else if ($('a:contains("CDQ DL"):contains("dbree")').length !== 0)
      $('a:contains("CDQ DL"):contains("dbree")')[0].click();
    else if ($('a:contains("CDQ DL"):contains("suprafiles")').length !== 0)
      $('a:contains("CDQ DL"):contains("suprafiles")')[0].click();
    else if ($('a:contains("CDQ DL")').length !== 0)
      $('a:contains("CDQ DL")')[0].click();

    window.close();


  } else if (window.location.href.indexOf("filemack") != -1) {

    //selects the element that has the link -- jquery obj version
    var f = $('a.truncate[href*="zs_"]').each(function() {

    });


    //f.css( "text-decoration", "bold" );

    var fValue = f.attr("href");

    //console.log("Link Address filemack : " + fValue);

    window.open(fValue, "_self");

    //console.log("Still running filemack : " + fValue);


  } else if (window.location.href.indexOf("zippyshare") != -1) {

    //console.log("boutta cop");

    $('#dlbutton')[0].click();


    localStorage.setItem('download', 'false');


  } else if (window.location.href.indexOf("suprafiles") != -1) {

    var supraSubmit = $(':submit').each(function() {
      (this).click();
    });

    $('a:contains("fs")')[0].click();

  } else if (window.location.href.indexOf("cloudyfiles") != -1) {

    var cloudysubmit = $(':submit').each(function() {
      (this).click();
    });

    $('.btn-xs')[0].click();

    alert($('a:contains("s1")'));
    $('a:contains("s1")')[0].click();


  } else if (window.location.href.indexOf("dbr") != -1) {
    // Disabled via include

    setTimeout(function() {

      console.log("Done Waiting");
      $('#download_btn')[0].click();


    }, 6000);



  } else if (window.location.href.indexOf("nofile") != -1) {
    $('.downloadButton')[0].click();
  }

})();
