// ==UserScript==
// @name          Endless MAL Search Pages
// @description   Load the next page automatically and endlessly. You just need to scroll down to the page bottom. Now there's no need to click on the "next page" button ever again!
// @version       24
// @author        hacker09
// @namespace     Endless MAL
// @match         https://myanimelist.net/featured
// @match         https://myanimelist.net/*/genre/*
// @match         https://myanimelist.net/profile/*
// @match         https://myanimelist.net/users.php*
// @match         https://myanimelist.net/clubs.php*
// @match         https://myanimelist.net/anime.php?*
// @match         https://myanimelist.net/manga.php?*
// @match         https://myanimelist.net/people.php*
// @match         https://myanimelist.net/reviews.php*
// @match         https://myanimelist.net/*/*/*/forum*
// @match         https://myanimelist.net/topanime.php*
// @match         https://myanimelist.net/topmanga.php*
// @match         https://myanimelist.net/character.php*
// @match         https://myanimelist.net/forum/?board=*
// @match         https://myanimelist.net/forum/?subboard=*
// @match         https://myanimelist.net/featured/tag/*
// @match         https://myanimelist.net/*/*/*/reviews*
// @match         https://myanimelist.net/mymessages.php*
// @match         https://myanimelist.net/forum/?clubid=*
// @match         https://myanimelist.net/forum/?animeid=*
// @match         https://myanimelist.net/anime/producer/*
// @match         https://myanimelist.net/manga/magazine/*
// @match         https://myanimelist.net/watch/promotion*
// @match         https://myanimelist.net/forum/?topicid=*
// @match         https://myanimelist.net/comments.php?id=*
// @match         https://myanimelist.net/*/*/*/stats?m=all*
// @match         https://myanimelist.net/comtocom.php?id1=*
// @include       https://myanimelist.net/anime/*/*/userrecs
// @match         https://myanimelist.net/mymessages.php?go=sent*
// @match         https://myanimelist.net/featured/search?cat=featured&q=*
// @match         https://myanimelist.net/recommendations.php?s=recentrecs&t=*
// @match         https://myanimelist.net/stacks/search*
// @exclude       https://myanimelist.net/anime.php?id=*
// @exclude       https://myanimelist.net/people.php?id=*
// @exclude       https://myanimelist.net/*/*/*/forum?p=*
// @exclude       https://myanimelist.net/*/*/*/reviews?p=*
// @exclude       https://myanimelist.net/clubs.php?action=*
// @exclude       https://myanimelist.net/*/*/friends?offset=*
// @exclude       https://myanimelist.net/profile/*/reviews?p=*
// @exclude       https://myanimelist.net/watch/promotion/popular
// @exclude       https://myanimelist.net/reviews.php?st=mosthelpful
// @exclude       https://myanimelist.net/mymessages.php?go=read&id=*
// @exclude       https://myanimelist.net/profile/*/recommendations?p=*
// @exclude       https://myanimelist.net/mymessages.php?go=send&toname=*
// @exclude       https://myanimelist.net/mymessages.php?go=send&replyid=*
// @require       https://cdnjs.cloudflare.com/ajax/libs/findAndReplaceDOMText/0.4.6/findAndReplaceDOMText.min.js
// @icon          https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant         GM_registerMenuCommand
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/409957/Endless%20MAL%20Search%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/409957/Endless%20MAL%20Search%20Pages.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var Element;
  var nextpage;
  var pagenum = 1;
  var increaseby = 1;
  var nextpagenum = 1;
  var page = '&show=';
  var callFunction = true;
  var href = location.href;
  var pagenumincreaseby = 1;
  var url = window.location.pathname.split('/');
  var numberofthenextpage = document.createElement("center");
  //******************************************************************************************************************
  if (url[4] === "userrecs") {
    if (url[1] === 'anime') {
      var Text = 'PTW';
    } else {
      var Text = 'PTR';
    }

    document.querySelector("div.border_solid").insertAdjacentHTML('beforeend', "<br><input type='checkbox' class='filterbox1'><label style='font-weight: normal;font-size: 10px;'>Hide Recommendations that you doesn't have on your list. (Show " + Text + ":</label><input type='checkbox' class='filterbox2' disabled><label style='font-weight: normal; font-size: 10px;'>)</label>");

    document.querySelector("input.filterbox1").onclick = function() {
      if (document.querySelector("input.filterbox1").checked) {
        document.querySelector("input.filterbox2").disabled = false;
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="button_add"],a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => link.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none');
      } else {
        document.querySelector("input.filterbox2").disabled = true;
        setTimeout(function() {
          if (!document.querySelector("input.filterbox1").checked) {
            document.querySelector("input.filterbox2").checked = false;
          }
        }, 1000);
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="button_add"],a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => link.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = '');
      }
    };

    setTimeout(function() {
      if (document.querySelector("a.header-profile-link").innerText === 'hacker09') {
        document.querySelector("input.filterbox1").click();
      }
    }, 2500);

    document.querySelector("input.filterbox2").onclick = function() {
      if (document.querySelector("input.filterbox2").checked) {
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => link.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = '');
      } else {
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => link.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none');
      }
    };

  }

  //******************************************************************************************************************
  if (url[1] === 'anime.php' || url[1] === 'manga.php' || url[2] === 'genre' || url[2] === 'producer' || url[2] === 'magazine' || url[1] === 'topanime.php' || url[1] === 'topmanga.php' && href !== 'https://myanimelist.net/anime.php') {
    var CorrectPages = true;

    if (url[1] === 'anime.php' || url[2] === 'genre' || url[2] === 'producer' || url[1] === 'topanime.php' || url[1] === 'topmanga.php') {
      var Text = 'PTW';
    } else {
      var Text = 'PTR';
    }

    if (url[1] === 'anime.php' || url[1] === 'manga.php' || url[2] === 'genre' || url[2] === 'producer' || url[2] === 'magazine') {
      var Selector = document.querySelectorAll('div[class*="normal_header"]')[1];
      var Position = "beforeend";
    }

    if (url[1] === 'topanime.php' || url[1] === 'topmanga.php') {
      Selector = document.querySelector("span.fs10.fw-n.ff-Verdana.di-ib.ml16");
      Position = "afterend";
    }

    Selector.insertAdjacentHTML(Position, '<br><input type="checkbox" class="filterbox1"><label style="font-weight: normal;font-size: 10px;">Hide Search Results that you have on your list. (Show ' + Text + ':</label><input type="checkbox" class="filterbox2" disabled><label style="font-weight: normal; font-size: 10px;">)</label>');
    document.querySelector("input.filterbox1").onclick = function() {
      if (document.querySelector("input.filterbox1").checked) {
        document.querySelector("input.filterbox2").disabled = false;
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="dropped"],a.Lightbox_AddEdit[class*="completed"],a.Lightbox_AddEdit[class*="watching"],a.Lightbox_AddEdit[class*="on-hold"],a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => document.querySelector("div.js-categories-seasonal.js-block-list.tile.mt16") === null ? Element = link.parentElement.parentElement.style.display = 'none' : Element = link.parentElement.parentElement.parentElement.style.display = 'none');
      } else {
        document.querySelector("input.filterbox2").disabled = true;
        setTimeout(function() {
          if (!document.querySelector("input.filterbox1").checked) {
            document.querySelector("input.filterbox2").checked = false;
          }
        }, 1000);
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="dropped"],a.Lightbox_AddEdit[class*="completed"],a.Lightbox_AddEdit[class*="watching"],a.Lightbox_AddEdit[class*="on-hold"],a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => document.querySelector("div.js-categories-seasonal.js-block-list.tile.mt16") === null ? link.parentElement.parentElement.style.display = '' : link.parentElement.parentElement.parentElement.style.display = '');
      }
    };

    document.querySelector("input.filterbox2").onclick = function() {
      if (document.querySelector("input.filterbox2").checked) {
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => document.querySelector("div.js-categories-seasonal.js-block-list.tile.mt16") === null ? Element = link.parentElement.parentElement.style.display = '' : Element = link.parentElement.parentElement.parentElement.style.display = '');
      } else {
        Array.from(document.querySelectorAll('a.Lightbox_AddEdit[class*="plantowatch"]')).forEach(link => document.querySelector("div.js-categories-seasonal.js-block-list.tile.mt16") === null ? Element = link.parentElement.parentElement.style.display = 'none' : Element = link.parentElement.parentElement.parentElement.style.display = 'none');
      }
    };
    //******************************************************************************************************************
    GM_registerMenuCommand("Click To Toggle The Add Button Action", AddBTNAction);

    if (GM_getValue("AddBTN_UseIframes") !== true && GM_getValue("AddBTN_UseIframes") !== false) {
      GM_setValue("AddBTN_UseIframes", true);
    }

    function AddBTNAction() {
      if (GM_getValue("AddBTN_UseIframes") === false) {
        GM_setValue("AddBTN_UseIframes", true);
        alert('The Add Button Action Will Follow The Default MAL Behavior.\nThe Page Will Be Reloaded.');
        location.reload(); //Reload the page
      } else {
        GM_setValue("AddBTN_UseIframes", false);
        alert('The Add Button Will Be Opened On A New Tab.\nThe Page Will Be Reloaded.');
        location.reload(); //Reload the page
      }
    }

    if (GM_getValue("AddBTN_UseIframes") === false) {
      setTimeout(function() {
        for (var i = 0; i < document.querySelectorAll('a[class*="Lightbox_AddEdit"]').length; i++) {
          document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].setAttribute("target", "_blank");
          document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].parentElement.parentElement.innerHTML = document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].parentElement.parentElement.innerHTML;
        }
      }, 0);
    }

    if (GM_getValue("AddBTN_UseIframes") === true) {
      setTimeout(function() {
        document.querySelector("#fancybox-wrap").outerHTML = '<div id="fancybox-wrap" style="opacity: 1; width: 1010px; height: 492.95px; top: 8%; left: 12%; position: fixed; display: none;"><div id="fancybox-outer"><div class="fancy-bg" id="fancy-bg-n"></div><div class="fancy-bg" id="fancy-bg-ne"></div><div class="fancy-bg" id="fancy-bg-e"></div><div class="fancy-bg" id="fancy-bg-se"></div><div class="fancy-bg" id="fancy-bg-s"></div><div class="fancy-bg" id="fancy-bg-sw"></div><div class="fancy-bg" id="fancy-bg-w"></div><div class="fancy-bg" id="fancy-bg-nw"></div><div id="fancybox-inner" style="top: 10px; left: 10px; width: 990px; height: 472.95px; overflow: hidden;"><iframe id="fancybox-frame" scrolling="auto"></iframe></div><a id="fancybox-close" style="display: inline;"></a><div id="fancybox-title" class="fancybox-title-outside" style="width: 990px; padding-left: 10px; padding-right: 10px; bottom: -37px;"><span id="fancybox-title-wrap"><span id="fancybox-title-left"></span><span id="fancybox-title-main">Quick add anime to my list</span><span id="fancybox-title-right"></span></span></div></div></div>';
        document.querySelector("#fancybox-close").onclick = function() {
          document.querySelector("#fancybox-overlay").style.display = 'none';
          document.querySelector("#fancybox-wrap").style.display = 'none';
        };
      }, 0);

      for (var i = 0; i < document.querySelectorAll('a[class*="Lightbox_AddEdit"]').length; i++) {
        document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].setAttribute("target", "fancybox-frame");
        document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].onclick = function() {
          document.querySelector("#fancybox-frame").src = this.href;
          setTimeout(function() {
            document.querySelector("#fancybox-wrap").style.display = 'block';
          }, 500);
          document.querySelector("#fancybox-overlay").setAttribute("style", 'background-color: rgb(102, 102, 102); opacity: 0.3; display: block;');
          return false;
        };
      }
    }
  }
  //******************************************************************************************************************
  numberofthenextpage.setAttribute("style", "font-size:14px;");
  if (document.querySelector('div.mauto.clearfix.pt24') !== null) document.querySelector('div.mauto.clearfix.pt24').style.width = null;

  if (url[1] === 'users.php')(increaseby = 24, nextpagenum = 0);
  if (href.match("&t=members"))(increaseby = 36, nextpagenum = 0);
  if (url[1] === 'recommendations.php')(increaseby = 100, nextpagenum = 0);
  if (href.match('myanimelist.net\/(?:[^\/]+\/){2}friends'))(page = '?offset=', increaseby = 100, nextpagenum = 0);
  if (url[1] === 'character.php' || url[1] === 'people.php' && href.match("\\?letter="))(increaseby = 50, nextpagenum = 0);
  if ((url[2] === 'genre' || url[2] === 'producer' || url[2] === 'magazine') && !(href.match("\\?page=")))(page = '?page=');
  if (url[1] === 'topanime.php' || url[1] === 'topmanga.php' && href.match("type"))(page = '&limit=', increaseby = 50, nextpagenum = 0);
  if (href.match("featured/search") || href.match("stacks/search") || href.match("clubs.php\\?sort=") || href.match("clubs.php\\?cat=") || url[1] === 'reviews.php' && !href.match("&t=members"))(page = '&p=');
  if (href.match("stacks/search") && !href.match("search\\?"))(page = '?p=', nextpagenum = 1);
  if (url[1] === 'anime.php' || url[1] === 'manga.php' || href.match("clubid=") || href.match("forum/\\?board=") || href.match("forum/\\?subboard=") || href.match("forum/\\?animeid="))(increaseby = 50, nextpagenum = 0);
  if ((url[1] === 'comments.php' || href.match("clubs.php\\?id=") || href.match("clubs.php\\?cid=") || url[1] === 'mymessages.php') && (!href.match("&t=members")))(increaseby = 20, nextpagenum = 0);
  if (href === "https://myanimelist.net/topanime.php" || href === "https://myanimelist.net/topmanga.php" || href === "https://myanimelist.net/character.php" || href === "https://myanimelist.net/people.php")(page = '?limit=', increaseby = 50, nextpagenum = 0);
  if (href === "https://myanimelist.net/featured" || href.match("featured/tag") || href === "https://myanimelist.net/clubs.php" || url[2] === 'promotion' || url[3] === 'reviews' || url[3] === 'recommendations' || href.match('myanimelist.net\/(?:[^\/]+\/){3}reviews'))(page = '?p=');
  var fetchpage = href + page;
  if (url[1] === 'mymessages.php')(fetchpage = 'https://myanimelist.net/mymessages.php?go=' + page);
  if (url[1] === 'comtocom.php')(fetchpage = document.querySelector("a.ml8").href, nextpagenum = '#');
  if (href.match("clubs.php\\?cid="))(fetchpage = document.querySelector("a[href*='comments']").href + page, document.querySelector("div[style='padding-left: 7px;']").setAttribute("style", "height: 2800px; overflow: scroll;)"));
  if (href.match("mymessages.php\\?go=sent"))(fetchpage = 'https://myanimelist.net/mymessages.php?go=sent' + page);
  if (href.match("stats\\?m=all#members")) {
    fetchpage = href.replace("#members", '' + page), increaseby = 75, nextpagenum = 0;
  }
  if ((url[2] === 'genre' || url[2] === 'producer' || url[2] === 'magazine') && (href.match("\\?page=")))(fetchpage = href.split('?page=')[0] + '?page=', nextpagenum = pagenum = parseInt(href.split('?page=')[1]));
  if (href.match('myanimelist.net\/(?:[^\/]+\/){3}forum'))(fetchpage = document.querySelector("a[href*='animeid']").href + page, increaseby = 50, nextpagenum = 0);
  if (url[1] === 'profile' && url[3] !== 'reviews' && url[3] !== 'recommendations' && url[3] !== 'friends')(fetchpage = document.querySelector("a[href*='comments']").href + page, increaseby = 20, nextpagenum = 0, document.querySelector("div.pt16.pb8.ac").setAttribute("style", "text-align: left !important;"));
  if (href.match("\\?topicid=")) {
    if (href.match('&show=') !== null) {
      nextpagenum = parseInt(href.split('&show=')[1]);
      pagenum = nextpagenum / 50 + 1;
    } else {
      nextpagenum = 0;
    }
    increaseby = 50, fetchpage = href.split('&show=')[0].split('#')[0] + page;

    GM_registerMenuCommand("Enable/Disable On Forum Topics", ForumTopicsAction);
    if (GM_getValue("Activate_EndlessMalOnForumTopics") !== true && GM_getValue("Activate_EndlessMalOnForumTopics") !== false) {
      GM_setValue("Activate_EndlessMalOnForumTopics", true);
    }

    function ForumTopicsAction() {
      if (GM_getValue("Activate_EndlessMalOnForumTopics") === false) {
        GM_setValue("Activate_EndlessMalOnForumTopics", true);
        alert('Endless MAL will run on Forum Pages.\nThe Page Will Be Reloaded.');
        location.reload(); //Reload the page
      } else {
        GM_setValue("Activate_EndlessMalOnForumTopics", false);
        alert("Endless MAL WON'T run on Forum Pages.\nThe Page Will Be Reloaded.");
        location.reload(); //Reload the page
      } //Finishes the else condition
    } //Finishes the function
  }; //Finishes the if condition

  async function requestNextPage() //Creates a function to get the next page
  { //Starts the function
    nextpagenum += increaseby;
    pagenum += pagenumincreaseby;
    const response = await fetch(fetchpage + nextpagenum); //Fetch
    const html = await response.text(); //Gets the fetch response
    const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response

    numberofthenextpage.innerHTML = '■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Page ' + pagenum + '  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■';

    if (url[3] === 'reviews') {
      document.querySelector("td.pl8").append(numberofthenextpage);
      nextpage = newDocument.querySelector('td.pl8');
      nextpage.querySelector('div#horiznav_nav').remove();
      document.querySelector("td.pl8").append(nextpage);
      for (var i = $("a:contains('Previous')").length; i--;) {
        $("a:contains('Previous')")[i].remove();
      }
      for (var i = $("a:contains('More Reviews')").length; i--;) {
        $("a:contains('More Reviews')")[i].remove();
      }
    }
    if (url[2] === 'promotion') {
      document.querySelector('div.pagination.pagination-numbers.di-b.ac').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div.watch-anime-list.watch-video.ml12.clearfix');
      document.querySelector('div.pagination.pagination-numbers.di-b.ac').append(nextpage);
    }
    if (url[1] === 'featured') {
      document.querySelector('div.news-list').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div.news-list');
      document.querySelector('div.news-list').append(nextpage);
    }
    if (url[1] === 'users.php') {
      document.querySelectorAll('div.spaceit')[1].append(numberofthenextpage);
      nextpage = newDocument.querySelectorAll('table')[1];
      document.querySelectorAll('div.spaceit')[1].append(nextpage);
    }
    if (GM_getValue("Activate_EndlessMalOnForumTopics") === true && href.match("\\?topicid=") && document.querySelector("div.fl-r.pb4").textContent !== '') {

      if (document.querySelectorAll("div[style*='height: 15px; margin: 5px 0px;']")[pagenum - 2].innerText.search("»") > -1) //If the fetched page number has the next page '»' symbol
      { //Starts the if condition
        document.querySelector('div.mauto.clearfix.pt24').append(numberofthenextpage);
        nextpage = newDocument.querySelector("#content");
      } //Finishes the if condition
      else //If the fetched page number doesn't have the next page '»' symbol
      {
        callFunction = false; //Stop the script
      }

      if (response.status === 200) {
        nextpage.querySelector("div.clearfix.mt4").remove();
        nextpage.querySelector("div.clearfix.pt4.pb8").remove();
        nextpage.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").remove();
        if (document.querySelector("div.forum_category").innerText.match('Poll') !== null) {
          nextpage.querySelector("div.forum_category").remove();
          nextpage.querySelector("div.forum_boardrow1").remove();
        }
      }
      var PastLength = document.querySelectorAll("#showQuickReply").length;
      var PastQuoteBTNsLength = document.querySelectorAll("a.js-forum-quote-button").length;
      document.querySelector('div.mauto.clearfix.pt24').append(nextpage);
      setTimeout(function() {
        for (let i = PastLength; i < document.querySelectorAll("#showQuickReply").length; i++) {
          document.querySelectorAll("#showQuickReply")[i].addEventListener("click", function() {
            document.querySelectorAll("#quickReply")[i].style.display = '';
          });
          document.querySelectorAll("#postReply")[i].addEventListener("click", e => {
            setTimeout(function() {
              document.querySelectorAll("#quickReply")[i].style.display = "none";
            }, 1000);
            document.querySelector("#postReply").click();
            document.querySelector("#messageText").value = document.querySelectorAll("#messageText")[i].value;
          });
          document.querySelectorAll("#clearQuickReply")[i].addEventListener("click", function() {
            document.querySelectorAll("#messageText")[i].value = '';
          });
        }
        for (let i = PastQuoteBTNsLength; i < document.querySelectorAll("a.js-forum-quote-button").length; i++) {
          document.querySelectorAll("a.js-forum-quote-button")[i].addEventListener("click", function() {
            var token = document.head.querySelector("[name='csrf_token']").content;
            var msgid = document.querySelectorAll("a.js-forum-quote-button")[i].dataset.id;
            $("a#showQuickReply").last()[0].click();
            $("textarea#messageText.textarea").last()[0].focus();
            async function BBCodes() //Creates a function to get the BBCodes
            { //Starts the function
              const response = await fetch('https://myanimelist.net/includes/quotetext.php', {
                "headers": {
                  "content-type": "application/x-www-form-urlencoded"
                },
                "body": "msgid=" + msgid + "&csrf_token=" + token + "",
                "method": "POST"
              }); //Finishes the fetch
              const html = await response.text(); //Gets the fetch response
              var newDocument = new DOMParser().parseFromString(html, "text/html");
              var BBCodes = newDocument.documentElement.textContent;
              $("textarea#messageText.textarea").last()[0].value = BBCodes;
            } //Finishes the async BBCodes function
            BBCodes(); //Starts the BBCodes function
          });
        }
      }, 2000);
    }
    if (url[1] === 'comtocom.php') {
      document.querySelector('div#content').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div#content');
      fetchpage = newDocument.querySelectorAll("a.ml8")[2].href;
      document.querySelector('div#content').append(nextpage);
      for (var i = $("a:contains(' Prev')").length; i--;) {
        $("a:contains(' Prev')")[i].remove();
      }
      for (var i = $("a:contains('Next ')").length; i--;) {
        $("a:contains('Next ')")[i].remove();
      }
    }
    if (url[1] === 'mymessages.php') {
      document.querySelector('div#content').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div.message-container');
      document.querySelector('div#content').append(nextpage);
      findAndReplaceDOMText(document.body, {
        find: 'null',
        replace: "There's no next page..."
      });
    }
    if (url[3] === 'recommendations') {
      document.querySelector("div[style='padding: 0 8px;']").append(numberofthenextpage);
      nextpage = newDocument.querySelector("div[style='padding: 0 8px;']");
      document.querySelector("div[style='padding: 0 8px;']").append(nextpage);
      for (var i = $("a:contains('Previous')").length; i--;) {
        $("a:contains('Previous')")[i].remove();
      }
      for (var i = $("a:contains('More Recommendations')").length; i--;) {
        $("a:contains('More Recommendations')")[i].remove();
      }
    }
    if (href.match("clubs.php\\?cid=")) {
      document.querySelector("div[style='width: 733px; overflow: hidden;']").append(numberofthenextpage);
      nextpage = newDocument.querySelector('div#content');
      document.querySelector("div[style='width: 733px; overflow: hidden;']").append(nextpage);
    }
    if (href.match("stats\\?m=all#members")) {
      document.querySelector('table.table-recently-updated').nextElementSibling.append(numberofthenextpage);
      nextpage = newDocument.querySelector('table.table-recently-updated');
      document.querySelector('table.table-recently-updated').nextElementSibling.append(nextpage);
    }
    if (href.match('myanimelist.net\/(?:[^\/]+\/){3}forum')) {
      document.querySelector("div.page-forum").append(numberofthenextpage);
      nextpage = newDocument.querySelector('#forumTopics');
      document.querySelector("div.page-forum").append(nextpage);
    }
    if (href.match('myanimelist.net\/(?:[^\/]+\/){2}friends')) {
      document.querySelector("div.majorPad").append(numberofthenextpage);
      nextpage = newDocument.querySelector('div.majorPad');
      document.querySelector("div.majorPad").append(nextpage);
    }
    if (href.match('myanimelist.net\/(?:[^\/]+\/){3}reviews')) {
      document.querySelector('div.mauto.clearfix.pt24').append(numberofthenextpage);
      nextpage = newDocument.querySelector("div.js-scrollfix-bottom-rel");
      nextpage.querySelector("#horiznav_nav").remove();
      nextpage.querySelector("div.breadcrumb").remove();
      nextpage.querySelector("div.border_solid").remove();
      nextpage.querySelector("div.reviews-horiznav-nav-sort-block.js-reviews-horiznav-nav-sort-block.mb4.pb8").remove();
      document.querySelector('div.mauto.clearfix.pt24').append(nextpage);
      for (var i = $("a:contains('Previous')").length; i--;) {
        $("a:contains('Previous')")[i].remove();
      }
      for (var i = $("a:contains('More Reviews')").length; i--;) {
        $("a:contains('More Reviews')")[i].remove();
      }
    }
    if (url[1] === 'reviews.php' || url[1] === 'recommendations.php') {
      document.querySelector('div.mauto.clearfix.pt24').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div#content');
      nextpage.querySelector('div.breadcrumb').remove();
      nextpage.querySelector('div#horiznav_nav').remove();
      document.querySelector('div.mauto.clearfix.pt24').append(nextpage);
    }
    if (href.match("comments.php\\?id=") || href.match("clubs.php\\?id=")) {
      document.querySelector('div#content').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div#content');
      document.querySelector('div#content').append(nextpage);
    }
    if (url[1] === 'profile' && url[3] !== 'reviews' && url[3] !== 'recommendations' && url[3] !== 'friends') {
      document.querySelector("div.pt16.pb8.ac").append(numberofthenextpage);
      nextpage = newDocument.querySelector('div#content');
      document.querySelector("div.pt16.pb8.ac").append(nextpage);
    }
    if (url[1] === 'anime.php' || url[1] === 'manga.php' || url[2] === 'genre' || url[2] === 'producer' || url[2] === 'magazine') {
      document.querySelector("[class*='js-block-list']").append(numberofthenextpage);
      nextpage = newDocument.querySelector("[class*='js-block-list']");
      var ADDBTNPastLength = document.querySelectorAll('a[class*="Lightbox_AddEdit"]').length;
      document.querySelector("[class*='js-block-list']").append(nextpage);
    }
    if (href.match("stacks")) {
      document.querySelector('div.search-list').append(numberofthenextpage);
      nextpage = newDocument.querySelector('div.search-list');
      document.querySelector('div.search-list').append(nextpage);
    }
    if ((url[1] === 'clubs.php' || url[1] === 'topanime.php' || url[1] === 'topmanga.php' || url[1] === 'character.php' || url[1] === 'people.php' || href.match("clubid=") || href.match("forum/\\?board=") || href.match("forum/\\?subboard=") || href.match("forum/\\?animeid=")) && (!href.match("clubs.php\\?id=") && !href.match("clubs.php\\?cid="))) {
      document.querySelector('div.mauto.clearfix.pt24').append(numberofthenextpage);
      nextpage = newDocument.querySelector('table');
      document.querySelector('div.mauto.clearfix.pt24').append(nextpage);
    }
    if (response.status === 404 || document.body.innerText.search("Total Recommendations:") > -1) {
      numberofthenextpage.innerHTML = "■■■■■■■■■■■■■■■■■■■■■■■■■■■■ There's no next page... ■■■■■■■■■■■■■■■■■■■■■■■■■■■■";
      findAndReplaceDOMText(document.body, {
        find: 'null',
        replace: " "
      });
      findAndReplaceDOMText(document.body, {
        find: 'undefined',
        replace: " "
      });
      nextpage.innerHTML = " ";
      if (document.body.innerText.search("Total Recommendations:") > -1) {
        $("div.pt4:contains('Total Recommendations:')")[1].textContent = " ";
      }
    }
    //******************************************************************************************************************
    if (CorrectPages) {
      if (document.querySelector("input.filterbox1").checked) {
        document.querySelector("input.filterbox1").click();
        document.querySelector("input.filterbox1").click();
      }
      if (document.querySelector("input.filterbox2").checked) {
        document.querySelector("input.filterbox2").click();
        document.querySelector("input.filterbox2").click();
      }
      if (GM_getValue("AddBTN_UseIframes") === false) {
        for (var i = ADDBTNPastLength; i < document.querySelectorAll('a[class*="Lightbox_AddEdit"]').length; i++) {
          document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].setAttribute("target", "_blank");
        }
      }
      if (GM_getValue("AddBTN_UseIframes") === true) {
        for (var i = ADDBTNPastLength; i < document.querySelectorAll('a[class*="Lightbox_AddEdit"]').length; i++) {
          document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].setAttribute("target", "fancybox-frame");
          document.querySelectorAll('a[class*="Lightbox_AddEdit"]')[i].onclick = function() {
            document.querySelector("#fancybox-frame").src = this.href;
            setTimeout(function() {
              document.querySelector("#fancybox-wrap").style.display = 'block';
            }, 500);
            document.querySelector("#fancybox-overlay").setAttribute("style", 'background-color: rgb(102, 102, 102); opacity: 0.3; display: block;');
            return false;
          }
        }
      }
    }
    //******************************************************************************************************************
  } //Finishes the async function

  window.onscroll = async function() {
    var BodyoffsetHeight = document.querySelector('body').offsetHeight;
    if (callFunction && window.scrollY * 1.2 >= BodyoffsetHeight - window.innerHeight) {
      callFunction = false;
      await requestNextPage();
      setTimeout(function() {
        if (document.body.innerText.search("There's no next page...") > -1 || document.body.innerText.search("This user currently has no comments") > -1 || document.body.innerText.search("No reviews were found.") > -1 || document.body.innerText.search("This page doesn't exist.") > -1 || document.body.innerText.search("No friends found :") > -1 || $("div.pt4:contains('Total Recommendations:')").length > 1) {
          callFunction = false;
        } else {
          callFunction = true;
        }
      }, 700);
    }
  };

})();