// ==UserScript==
// @name         Onestop Strategy News Scroll
// @namespace    https://github.com/sunilkumarba
// @version      0.25
// @description  Auto fetch Onestop Strategy news items on scroll, instead of user having to click "Next Page" button
// @author       Sunil Kumar B A
// @match        https://onestopstrategy.com/
// @match        https://onestopstrategy.com/news/
// @match        https://onestopstrategy.com/news/page/*
// @icon         https://www.google.com/s2/favicons?domain=onestopstrategy.com
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js
// @copyright    2021+, Sunil Kumar B A
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423853/Onestop%20Strategy%20News%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/423853/Onestop%20Strategy%20News%20Scroll.meta.js
// ==/UserScript==

(function () {
  "use strict";

  $(function () {
    GM_addStyle(`
        .title-first-word {font-size: 140%;display: inline-block;background: none;color: #e30614;}
        #autoFetchOnScrollToggleBtn {position:fixed; bottom:10px; right:10px;}
        #fetchSpinner {text-align: center;padding: 5px;background-color: #e3061494;color: #000000bd;font-size: 14px;text-transform: uppercase;}
    `);

    var fetchingNewsItems = false,
      isCustomCssStylesEnabled = true,
      disableAutoFetchOnScroll = false;

    function stopEvent(e) {
      if (!e) return;
      e.stopPropagation();
      e.preventDefault();
    }

    function enableCustomCssStyles() {
      if (isCustomCssStylesEnabled)
        GM_addStyle(`
          body {background-color: #7f7f7f !important;}
          .mini-news img{border: 1px solid #a3a3a3 !important; border-radius: 0%; padding: 3px 2px; background: white;}
          #news > .container, .container.txt-posts{padding: 0px; background-color: #ececec; margin-top: 20px;}
          #news > .container > .row,.container.txt-posts > .row{padding: 15px; margin:0;}
          #main-news{margin-bottom: 10px;}
          #news > .container > .row > .col-sm-3 > .row,.container.txt-posts > .row > .col-sm-3 > .row{margin:0; margin-right: -15px;}
          .title-first-word{font-size: 140%;display: inline-block;color: #e30614;}
          .paginacja-wpisow{font-family: 'Poppins', sans-serif !important;float: left;width: 100%;margin-bottom: 10px;text-align: left;padding: 10px 20px; font-weight: normal;}
          .paginacja-wpisow a{font-weight: 500;font-size: 12px;text-decoration: none;}
          .maintext{background-color: #fff6; padding: 15px 15px 15px 15px !important; text-align: justify; font-family: 'Source Serif Pro', 'Cambria', 'Bookman Old Style', 'Times New Roman', serif !important; line-height: 1.5; font-weight: 400; color: #343434 !important; font-size: 16px;}
          @media (min-width: 1170px){.maintext{font-size: 20px;}}
          .thumb-posts img{border-radius: 0; border: 2px solid #e30614;}
          .posts-title{text-align: left !important;}
          .posts-title::first-letter{font-size: 140%; display: inline-block; background: #e30614; padding: 0 6px; color: #fff;}
          .posts-ad{display: none !important;}
          .other-post{float: left;width: 100%;padding-top: 10px;margin-bottom: 40px;border-top: 1px solid #dadada;margin-top: 40px;}
          .other-post .t-news .title-news{text-align: left;}
          .sidebar{line-height: 17px;font-size: 14px; background-color: #7f7f7f29; overflow: auto;}
          .popular-posts{float: left; width: 100%; margin-bottom: 40px;}
          .popular-posts h4{float: left; width: 100%; font-size: 15px; line-height: 17px; text-transform: uppercase; font-weight: 700; text-align: left; margin-bottom: 20px; border-bottom: 1px solid #eee; background-color: #e30614; color: white; padding: 5px; margin-top: 0; border:0;}
          .popular-posts .boxes-news .row{margin-left: -10px;margin-right: -10px;}
          .cat-news .post-categories li{margin-right: 4px; font-family: 'Poppins', sans-serif !important;}
          .cat-news .post-categories li a{font-size:10px; padding: 6px 6px;}
          .sidebar .cat-news .post-categories li{margin-right: 2px;}
          .sidebar .cat-news .post-categories li a{padding: 6px 8px;float: left;color: #FFF;font-size: 9px;line-height: 9px;font-weight: normal;text-decoration: none;}
          a.t-news .title-sidebar{font-size: 12px;margin-top: 5px;margin-bottom: 5px;font-weight: 500;float: left;width: 100%;hyphens: auto;color: #000;}
          .date-sidebar{font-size: 10px;line-height: 11px;color: #3f3f3f;}
        `);
    }

    function updateAutoFetchOnScrollButton() {
      const btnToggleAutoFetchOnScroll = $(document.getElementById("autoFetchOnScrollToggleBtn")),
        enableClass = "check-square",
        disableClass = "square";

      btnToggleAutoFetchOnScroll
        .find("[data-fa-i2svg]")
        .toggleClass(`fa-${disableClass}`, disableAutoFetchOnScroll)
        .toggleClass(`fa-${enableClass}`, !disableAutoFetchOnScroll);

      displayPager(disableAutoFetchOnScroll);

      checkAndFetchNewsItems();
    }

    function addFetchSpinner() {
      const pagerEle = $(".paginacja-wpisow");
      pagerEle.prepend(`<div id="fetchSpinner"><i class=\"fas fa-stroopwafel fa-spin\"></i> Loading news items</div>`);
    }

    function addAutoFetchToggleButton() {
      var iconClass = disableAutoFetchOnScroll ? "square" : "check-square",
        toggleAutoFetchOnScrollButtonHtml =
          "<button id='autoFetchOnScrollToggleBtn'><i class='far fa-" + iconClass + "'></i> Auto Fetch</button>";

      $("body").append(toggleAutoFetchOnScrollButtonHtml);

      const btnToggleAutoFetchOnScroll = $(document.getElementById("autoFetchOnScrollToggleBtn"));

      btnToggleAutoFetchOnScroll.on("click", function (e) {
        stopEvent(e);
        disableAutoFetchOnScroll = !disableAutoFetchOnScroll;
        updateAutoFetchOnScrollButton();
      });

      updateAutoFetchOnScrollButton();
    }

    function displayPager(shouldDisplay) {
      const pagerControls = $(".paginacja-wpisow > ul");
      pagerControls.toggle(shouldDisplay);
    }

    function getUpdatedNewsTitle(titleText) {
      titleText = $.trim(titleText);

      if (titleText.indexOf('<span class="title-first-word">') >= 0) return titleText;

      var titleFrags = titleText.split(" "),
        titleFirstWord = titleFrags.splice(0, 1),
        titleHtml = '<span class="title-first-word">' + titleFirstWord + "</span> " + titleFrags.join(" ");

      return titleHtml;
    }

    // Add custom style for news item title
    function updateNewsTitles() {
      $("#news .title-news").each(function (index) {
        $(this).html(getUpdatedNewsTitle($(this).text()));
      });
    }

    // Check if the pager element is visible
    function isPagerVisible() {
      var pagerEle = $("div.paginacja-wpisow"),
        navBar = $(".navbar.navbar-default"),
        navBarHeight = navBar.outerHeight(),
        eleTop = pagerEle.offset().top,
        eleBottom = eleTop + pagerEle.outerHeight(),
        viewTop = $(window).scrollTop() /* + navBarHeight, */,
        viewBottom = viewTop + window.innerHeight;

      return eleBottom <= viewBottom && eleTop >= viewTop;
    }

    // Display
    function notifyFetching(active) {
      fetchingNewsItems = active;
      $("#fetchSpinner").toggle(active);
    }

    // Load contents of next page
    function fetchNewsItems() {
      if (fetchingNewsItems) return;

      notifyFetching(true);

      // Get next page link from "Next Page" button
      const pagerEle = $("div.paginacja-wpisow"),
        nextButtonLink = $("div.next.page-numbers > a"),
        nextLinkToFetch = nextButtonLink.attr("href");

      // Get content by making ajax call
      $.ajax({
        url: nextLinkToFetch,
        type: "GET",
        timeout: 5000,
        datattype: "html",
        success: function (result) {
          // Extract "boxes-news"
          const resDom = $(result),
            newsItems = resDom.find(".maintext .boxes-news");

          // Append news items before pager element
          newsItems.each(function (i) {
            const ni = newsItems[i];

            // Update news item title to add custom "first-word" style
            const title = $(ni).find(".title-news");
            if (title) title.html(getUpdatedNewsTitle(title.text()));
          });

          pagerEle.before(newsItems);

          // Update link of the "Next Page" button in the pager element
          const nextPageButton = resDom.find(".maintext .paginacja-wpisow .next.page-numbers a"),
            nextUrl = nextPageButton ? nextPageButton.attr("href") : "";

          if (nextUrl) nextButtonLink.attr("href", nextUrl);

          notifyFetching(false);
        }
      });
    }

    function checkAndFetchNewsItems() {
      if (!disableAutoFetchOnScroll && isPagerVisible()) fetchNewsItems();
    }

    function initialize() {
      $(window).scroll(checkAndFetchNewsItems);

      let moreButton = $('.link-more a');
      moreButton = moreButton ? moreButton[0] : null;

      if(moreButton) {
        moreButton.click();
        return;
      }
      else {
        updateNewsTitles();
        addAutoFetchToggleButton();
        addFetchSpinner();

        enableCustomCssStyles();
      }
    }

    initialize();
  });
})();
