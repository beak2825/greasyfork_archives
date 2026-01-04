// ==UserScript==
// @name        Tumblr - Mass Post Editor Features
// @namespace   https://jakejilg.com/mass_post_features
// @description MassReblog ArchiveDashTaggedLikes SelectShowBy:TagType MouseMultiSelect BackdateSchedule CaptionLink BatchPhotoset FollowersFollowees +more
// @include     https://www.tumblr.com/mega-editor
// @include     https://www.tumblr.com/mega-editor/*
// @include     https://www.tumblr.com/mega-editor/*/*/*
// @include     https://*/archive?fetch=first_post_timestamp&jump=*&name=*&to=*&year=*
// @version     4.01
// @grant       none
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537416/Tumblr%20-%20Mass%20Post%20Editor%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/537416/Tumblr%20-%20Mass%20Post%20Editor%20Features.meta.js
// ==/UserScript==

// May 2020, Mass Post Editor Features 4 (from scratch) by Jake Jilg (benign-mx)

// this month widget stuff for both includes pages
var MassPostEditorFeatures4 = function () {

  // first, these 3 functions I didn't write myself
  // begin ripped functions here:
  // a java short code thing from StackOverflow
  var shortCode = function (str) {
    var hash = 0;
    var chr;
    for (var i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  // a basic setCookie function from w3schools
  var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };
  // a basic readCookie function from w3schools
  var getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };
  // end: my ripped functions ^ here
  // begin all original script below

  // and I begin my own flurb src="greasemonkey.user.js"... :P
  // drop an "end" in the missing lcontent
  if (typeof l === "undefined") {
    var lcontentDiv = document.createElement("div");
    lcontentDiv.classList.add("l-content");
    lcontentDiv.classList.add("albino");
    document.body.appendChild(lcontentDiv);
  }
  // for the custom month widget that doesn't open dead months like the default
  var doubleCheckDisabledMonths = function (currentYr, lTs, fTs, jump, jumpTo) {
    var mw = document.getElementById("browse_months_widget");
    var cy = mw.getElementsByClassName(
      "current_year"
    )[0].innerText;
    var yr1 = parseInt(cy);
    var timestampF;
    var timestampL;
    var mo = mw.getElementsByClassName("months")[0].
      getElementsByTagName("li");
    var a;
    var span;
    for (var i = 0; i < 12; i++) {
      timestampF = new Date(yr1, i+1, 1).getTime();
      timestampL = new Date(yr1, i, 1).getTime();
      if (timestampL >= lTs || timestampF <= fTs) {
        if (!mo[i].classList.contains("empty")) {
          mo[i].classList.add("empty");
        }
        a = mo[i].getElementsByTagName("a");
        if (a.length > 0) {
          span = document.createElement("span");
          span.appendChild(
            document.createTextNode(
              a[0].innerText
            )
          );
          mo[i].replaceChild(span, a[0]);
        }
      } else {
        if (mo[i].classList.contains("empty")) {
          mo[i].removeAttribute("class");
        }
        a = mo[i].getElementsByTagName("span");
        var month = i;
        var ts = (new Date(yr1, month + 1, 0)).getTime() / 1000;
        var href2g2 = "http://www.tumblr.com/mega-editor/published/" +
            name + "?" + jump + "&" + jumpTo + "&" + ts +
            "#month" + (i+1) + "year" + yr1;
        if (a.length > 0) {
          span = document.createElement("a");
          span.href = href2g2;
          span.target = "_top";
          span.setAttribute("data-month-index", i.toString());
          span.appendChild(
            document.createTextNode(
              a[0].innerText
            )
          );
          mo[i].replaceChild(span, a[0]);
        } else {
          mo[i].getElementsByTagName("a")[0].href = href2g2;
        }
      }
    }
  };

  // these ^v functions function on both includes pages... coding in 3D! :)

  var i;
  var lTs;
  var fTs;
  var name;
  var makeBrowseMonthsWidget = function (currentYr, lTs, fTs, jump, jumpTo) {
    // last timestamp, first timestamp
    var browseMonthsWidget2 = document.createElement("div");
    browseMonthsWidget2.classList.add("popover");
    browseMonthsWidget2.classList.add("popover_gradient");
    browseMonthsWidget2.id = "browse_months_widget";
    var browseMonthsPopInner = document.createElement("div");
    browseMonthsPopInner.classList.add("popover_inner");
    var browseMonthsYear = document.createElement("div");
    browseMonthsYear.classList.add("year");
    var browseMonthsYearNavigation = document.createElement("div");
    browseMonthsYearNavigation.classList.add("year_navigation");
    var prevYearVis = function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      var cy = document.getElementsByClassName(
        "current_year"
      )[0];
      var yr = parseInt(cy.innerText);
      if (this.classList.contains("previous_year")) {
        --yr;
        cy.innerText = yr;
      } else {
        ++yr;
        cy.innerText = yr;
      }
      doubleCheckDisabledMonths(yr, lTs, fTs, jump, jumpTo);
    };
    var browseMonthPrevYearA = document.createElement("a");
    browseMonthPrevYearA.href = "#";
    browseMonthPrevYearA.addEventListener("click", prevYearVis);
    var prevYearSpan = document.createElement("span");
    prevYearSpan.appendChild(
      document.createTextNode("prev")
    );
    browseMonthPrevYearA.classList.add("previous_year");
    browseMonthPrevYearA.appendChild(prevYearSpan);
    var browseMonthNextYearA = document.createElement("a");
    browseMonthNextYearA.href = "#";
    browseMonthNextYearA.addEventListener("click", prevYearVis);
    var nextYearSpan = document.createElement("span");
    nextYearSpan.appendChild(
      document.createTextNode("next")
    );
    browseMonthNextYearA.classList.add("next_year");
    browseMonthNextYearA.appendChild(nextYearSpan);
    var currentYearSpan = document.createElement("span");
    currentYearSpan.classList.add("current_year");
    currentYearSpan.appendChild(
      document.createTextNode(currentYr)
    );
    browseMonthsYearNavigation.appendChild(browseMonthPrevYearA);
    browseMonthsYearNavigation.appendChild(currentYearSpan);
    browseMonthsYearNavigation.appendChild(browseMonthNextYearA);
    browseMonthsYear.appendChild(browseMonthsYearNavigation);
    browseMonthsPopInner.appendChild(browseMonthsYear);
    var clear1 = document.createElement("div");
    clear1.classList.add("clear");
    browseMonthsYearNavigation.appendChild(clear1);
    var browseMonths = document.createElement("div");
    browseMonths.classList.add("months");
    var browseMonthsUl = document.createElement("ul");
    var month = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var browseMonthsLi;
    var browseMonthsA;
    for (i = 0; i < 12; i++) {
      browseMonthsA = document.createElement("span");
      browseMonthsA.appendChild(
        document.createTextNode(month[i])
      );
      browseMonthsLi = document.createElement("li");
      browseMonthsLi.appendChild(browseMonthsA);
      browseMonthsUl.appendChild(browseMonthsLi);
    }
    browseMonths.appendChild(browseMonthsUl);
    browseMonthsYear.appendChild(browseMonths);
    browseMonthsPopInner.appendChild(browseMonthsYear);
    browseMonthsWidget2.appendChild(browseMonthsPopInner);
    return browseMonthsWidget2;
  };
  if (
    document.location.href.match( // really big RegEx
/\/archive\?fetch=first_post_timestamp&jump=[^&]+&name=[^&]+&to=[^&]+&year=\d+/i
    ) !== null
  ) {
    var megaCss = document.createElement("link");
    megaCss.setAttribute("rel", "stylesheet");
    megaCss.setAttribute("type", "text/css");
    megaCss.setAttribute(
      "href", 'https://assets.tumblr.com/assets/styles/mega-editor.css'
    );
    var glbCss = document.createElement("link");
    glbCss.setAttribute("rel", "stylesheet");
    glbCss.setAttribute("type", "text/css");
    glbCss.setAttribute(
      "href", "https://assets.tumblr.com/client/prod/app/global.build.css"
    );
    var iCss = document.createElement("style");
    iCss.type = "text/css";
    iCss.appendChild(
      document.createTextNode(
(function () {/*
body {
  background: none transparent;
}
#browse_months_widget {
  height: 422px;
  width: 225px;
  padding: 0px;
  top: 0px;
  left: 0px;
}
*/}).toString().slice(16, -3))
    );
    // this browMoWidget ^ is inside the iframe
    var newH = document.createElement("html");
    var head = document.createElement("head");
    head.appendChild(glbCss);
    head.appendChild(megaCss);
    head.appendChild(iCss);
    newH.appendChild(head);
    var body = document.createElement("body");
    var currentYr = document.location.href.match(/year=(\d+)/i)[1];
    name = document.location.href.match(/&name=([^&]+)/i)[1];
    var jump = document.location.href.match(/jump=([^&]+)/i)[1];
    var jumpTo = document.location.href.match(/to=([^&]+)/i)[1];
    var html = document.documentElement.innerHTML;
    fTs = parseInt(html.match(
      /"firstPostTimestamp":(\d+)/
    )[1]) * 1000;
    lTs = parseInt(html.match(
      /"updated":(\d+)/
    )[1]) * 1000;
    // the default archive URL makes weird dead pages...
    // I want to replace the default glitchy/month/panel/2014
    // with a more simple yet functional panel ?month&beforetimestamp
    body.appendChild(makeBrowseMonthsWidget(currentYr, lTs, fTs, jump, jumpTo));
    newH.appendChild(body);
    document.getElementsByTagName("html")[0].parentNode.replaceChild(
      newH,
      document.getElementsByTagName("html")[0]
    );
    doubleCheckDisabledMonths(currentYr, lTs, fTs, jump, jumpTo);
    return;
    // prevent the other page stuff from going
  }
  // this ^ runs on archive page only :)

  // this v runs on the megaEditor page only
  var removeS = document.getElementsByTagName("script");
  for (i = 0; i < removeS.length; i++) {
    if (
      typeof removeS[i].src.split(/\/+/g)[1] === "undefined" ||
      removeS[i].src.split(/\/+/g)[1] !== "assets.tumblr.com"
    ) {
      removeS[i].parentNode.removeChild(removeS[i]);
    }
  }
  var rewrite1 = function () { // <= outside of plugin scope
    // Tumblr was animating with
    // JQuery DOM manipulation instead of CSS3 >:P
    window.way_too_big_to_animate = true;
    window.neueCorrectionIndex = 0;
    // Tumblr was written with prototype.js in 2014 and
    // it used a lot of clumsy intervals as listeners
    // which were passed down the the jQuery Tumbr MPE
    // in 2016 and are still being used...
    for (var i = 500; i > 0; i--) {
      clearInterval(i); // their intervals have no var names
    }
    // but we use intervals too because it's still Tumblr in 2014 :)
    var href = document.location.href.split(/[\/\?&#=]+/g);
    if (
      href[3] === "published" &&
      href[5] === "follows" ||
      href[5] === "followers" ||
      href[5] === "fans"
    ) {
      window.insert_tag = function(){};
      window.render_tag_editor = function(){};
    }
    window.cleanCssAnimate = setInterval(function () {
      if (
        href[5] === "photos"
      ) {
        clearInterval(window.cleanCssAnimate);
        return;
      }
      var l = document.getElementsByClassName("l-content")[0];
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      if (typeof l === "undefined") {
        return;
      }
      if (typeof l !== "undefined" && !l.classList.contains("albino")) {
        l.innerHTML = "";
        return;
      }
      var pause = document.getElementById(
        "pause_button"
      );
      var canvas = document.getElementById("status");
      var ctx = canvas.getContext("2d");
      if (
        canvas !== null &&
        typeof canvas !== "undefined" &&
        data.classList.contains("fetching-from-tumblr-api") &&
        pause !== null &&
        typeof pause !== "undefined" &&
        pause.classList.contains("playing")
      ) {
        var toSeconds = parseFloat(
          data.getAttribute("data-to-seconds")
        );
        toSeconds++;
        if (toSeconds > 30) {
          toSeconds = 0;
        }
        ctx.fillStyle = "#9da6af";
        ctx.fillRect(
          0, 0, canvas.width, canvas.height
        );
        var width = (canvas.width - 16) * (toSeconds / 30);
        ctx.fillStyle = "#74797e";
        ctx.fillRect(
          0, canvas.height / 2 + 2, canvas.width - 16, canvas.height / 2
        );
        ctx.fillStyle = "turquoise";
        ctx.fillRect(0, canvas.height/ 2 + 2, width, canvas.height/ 2);
        ctx.fillStyle = "#9da6af";
        for (var i = canvas.width/11; i < canvas.width; i+=canvas.width/11) {
          ctx.fillRect(
            i - 3, canvas.height/ 2 + 2, 2, canvas.height / 2
          );
        }
        ctx.font = "bold 10px Arial, sans-serif";
        ctx.fillStyle = "#fff"
        ctx.fillText(
          "Posts Loaded",
          canvas.width/2 - ctx.measureText("Posts Loaded").width / 2 - 3,
          canvas.height / 2
        );
        data.setAttribute("data-to-seconds", toSeconds);
      } else if (
        pause !== null &&
        canvas !== null &&
        typeof pause !== "undefined" &&
        pause.classList.contains("paused")
      ) {
        ctx = canvas.getContext("2d");
        ctx.font = "bold 10px Arial, sans-serif";
        ctx.fillStyle = "#9da6af";
        ctx.fillRect(
          0, 0, canvas.width, canvas.height / 2
        );
        ctx.fillStyle = "#fff";
        ctx.fillText(
          "Paused",
          canvas.width/2 - ctx.measureText("Paused").width / 2 - 6,
          canvas.height / 2
        );
      }
      var fChild = l.querySelectorAll(":scope > :not(.laid)");
      if (fChild.length !== 0) {
        fChild[0].classList.add("laid");
      } else if (data.classList.contains("next_page_false")) {
        clearInterval(window.cleanCssAnimate);
        // see ^ we clear our own animate interval, Tumblr!
        // (Tumblr doens't clear theirs...)
        var p = l.querySelectorAll(":scope > a");
        document.getElementById("p_loaded").innerHTML = "x" + p.length;
        pause.classList.add("done");
        pause.classList.remove("playing");
        pause.classList.remove("paused");
        var allDone = href[5] !== "followers" && href[5] !== "follows" ?
            "All posts loaded." : "All blogs loaded.";
        pause.setAttribute("title", allDone);
        document.getElementById(
          "ajax-info_button"
        ).setAttribute("title", allDone);
        var smi = new Image();
        smi.addEventListener("load", function() {
          var canvas = document.getElementById("status");
          var ctx = canvas.getContext("2d");
          ctx.font = "bold 10px Arial, sans-serif";
          ctx.fillStyle = "#9da6af";
          ctx.fillRect(
            0, 0, canvas.width, canvas.height
          );
          ctx.fillStyle = "#fff";
          ctx.fillText(
            href[5] === "fans" ||
            href[5] === "followers" ||
            href[5] === "follows" ?
            "All Blogs" : "All Posts",
            14,
            7
          );
          ctx.fillText(
            "Loaded",
            17,
            15
          );
          ctx.drawImage(this, 1, 1);
        });
        smi.src = "data:image/gif;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyu" +
          "AP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOa" +
          "GcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7";
      }
    }, 25);
    // we will need to rebuild on show only too
    (function (alias) {
      window.columns_need_rebuilding = function () {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        if (document.getElementById("p_loaded") !== null) {
          var lcontent = document.getElementsByClassName("l-content");
          var p = lcontent[0].querySelectorAll(":scope > a");
          document.getElementById("p_loaded").innerHTML = "x" + p.length;
        }
        var rebuildAnyway = data.classList.contains("rebuild_anyway");
        window.column_gutter = parseInt(
          data.getAttribute("data-column_gutter")
        );
        window.column_full_width = window.column_width + window.column_gutter;
        if (
          rebuildAnyway ||
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth
        ) {
          data.classList.remove("rebuild_anyway");
          return true;
        }
        return alias.apply(this, arguments);
      }
    })(window.columns_need_rebuilding);
    (function (alias) {
      // this fires after a delete to rebuild columns...
      window.get_selected_post_ids = function () {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        data.classList.add("rebuild_anyway");
        var masonry = new CustomEvent("resize");
        window.dispatchEvent(masonry);
        return alias.apply(this, arguments);
      };
    })(window.get_selected_post_ids);
    // this ^ the pro way to alias
    clearInterval(window.timerid_auto_paginator);
    window.fetch_next_page = function () {};
    window.auto_paginator = function () {};
    // pagination? where we are going, we do not need pagination
  };
  var rewrite2 = function () {
    // my batch photos doesn't need certain functions :0
    var href = document.location.href.split(/[\/\?&#=]+/g);
    (function (alias) {
      // don't fear. these window scope references are
      // NOT unSafeWindow breaches from the plugin scope.
      // these rewrites are going into the DOM, and then
      // the plugin can no longer touch them.
      window.add_tags_to_selected_posts = function() {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        // we must remove the tag from our own custom data first
        var tagsAllArr = JSON.parse(
          data.getAttribute("data-tags_all_arr")
        );
        var tagToIds = JSON.parse(
          data.getAttribute("data-tag_to_ids")
        );
        var idToTags = JSON.parse(
          data.getAttribute("data-id_to_tags")
        );
        var hl = document.getElementsByClassName("highlighted");
        var tokens = document.getElementById("tokens");
        var tags = tokens.getElementsByClassName("tag");
        var tag;
        var id;
        var tc;
        for (var i = 0; i < tags.length; i++) {
          tag = tags[i].innerHTML;
          if (tagsAllArr.indexOf(tag) === -1) {
            tagsAllArr.push(tag); // new Tag
          }
          for (var l = 0; l < hl.length; l++) {
            id = hl[l].getAttribute("data-id");
            if (typeof idToTags[id] === "undefined") {
              idToTags[id] = [tags];
            }
            if (idToTags[id].indexOf(tag) === -1) {
              idToTags[id].push(tag);
            }
            if (typeof tagToIds[tag] === "undefined") {
              tagToIds[tag] = [id];
            }
            if (tagToIds[tag].indexOf(id) === -1) {
              tagToIds[tag].push(id);
            }
            tc = hl[l].getElementsByClassName("tag-container")[0];
            if (
              typeof idToTags[id] !== "undefined" ||
              idToTags[id].length !== 0
            ) {
              // this will happen always
              tc.innerHTML = "#" + idToTags[id].join(" #");
            } else {
              tc.innerHTML = ""; // < this might not happen
            }
          }
        }
        data.setAttribute("data-tags_all_arr", JSON.stringify(tagsAllArr));
        data.setAttribute("data-tag_to_ids", JSON.stringify(tagToIds));
        data.setAttribute("data-id_to_tags", JSON.stringify(idToTags));
        return alias.apply(this, arguments);
      };
    })(window.add_tags_to_selected_posts);
    // this takes tags out of elements when removed...
    // pry easier/better than reloading each post
    (function (alias) {
      window.remove_tags_from_selected_posts = function() {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        // we must remove the tag from our own custom data first
        var tagsAllArr = JSON.parse(
          data.getAttribute("data-tags_all_arr")
        );
        var tagToIds = JSON.parse(
          data.getAttribute("data-tag_to_ids")
        );
        var idToTags = JSON.parse(
          data.getAttribute("data-id_to_tags")
        );
        // you can take the w3c out of the jQuery,
        // but you can't take the jQuery out of w3c
        var tags2remove = document.querySelectorAll("#tags input:checked");
        // I love these new querySelector ^ things :)
        var hl = document.getElementsByClassName("highlighted");
        var id;
        var alt;
        var index;
        var tc;
        for (var i = 0; i < hl.length; i++) {
          id = hl[i].getAttribute("data-id");
          for (var l = 0; l < tags2remove.length; l++) {
            alt = tags2remove[l].getAttribute("alt");
            index = idToTags[id].indexOf(alt);
            idToTags[id].splice(index, 1);
            tc = hl[i].getElementsByClassName("tag-container")[0];
            if (
              typeof idToTags[id] !== "undefined" ||
              idToTags[id].length !== 0
            ) {
              tc.innerHTML = "#" + idToTags[id].join(" #");
            } else {
              tc.innerHTML = "";
            }
            index = tagToIds[alt].indexOf(id);
            tagToIds[alt].splice(index, 1);
            // remove when last tag removed
            if (
              typeof tagToIds[alt] === "undefined" ||
              tagToIds[alt].length === 0 // it could become undefined on shift
            ) {
              index = tagsAllArr.indexOf(alt);
              tagsAllArr.splice(index, 1);
            }
          }
        }
        data.setAttribute("data-tags_all_arr", JSON.stringify(tagsAllArr));
        data.setAttribute("data-tag_to_ids", JSON.stringify(tagToIds));
        data.setAttribute("data-id_to_tags", JSON.stringify(idToTags));
        return alias.apply(this, arguments);
      };
    })(window.remove_tags_from_selected_posts);
    // I've been told: this is the best way to alias a function
    (function (alias) {
      window.get_selected_post_ids = function () {
        window.postCountMake();
        return alias.apply(this, arguments);
      };
    })(window.get_selected_post_ids);
  };
  // some rewrites ^ to Tumblr's default code,  to use later...
  // this function is plugin scope
  var appendRichButtons = function(pbe, rich, brick) {
    // pbe meanse photo brick edit, but I recycled this
    // to make buttons for the caption adder thing too :)
    var addTextFormatting = function(e) {
      e.preventDefault();
      e.stopPropagation();
      var sel = window.getSelection();
      if(
        typeof sel.rangeCount !== "undefined" &&
        sel.rangeCount === 0
      ) {
        return;
      }
      var rng = sel.getRangeAt(0);
      var preRange = 0;
      var postRange = 0;
      var nod;
      var frag;
      var ancestor;
      var ancClone;
      var middle;
      var isNode = this.getAttribute("data-node") !== "none";
      if (isNode) {
        nod = document.createElement(this.getAttribute("data-node"));
        nod.appendChild(
          document.createTextNode(sel.toString())
        );
        if (this.getAttribute("data-class") !== "none") {
          nod.classList.add(
            this.getAttribute("data-class")
          );
        }
        if (
          this.getAttribute("data-node") === "a" &&
          this.getAttribute("data-attr") === "href"
        ) {
          nod.href = pbe.getElementsByClassName(
            "a_button_input"
          )[0].value;
        }
      } else {
        nod = document.createTextNode(sel.toString());
      }
      rng.deleteContents();
      // data-parent is like ul li || ol li...
      if (this.getAttribute("data-parent") !== "none") {
        var pnt = document.createElement(
          this.getAttribute("data-parent")
        );
        pnt.appendChild(nod);
        rng.insertNode(pnt);
      } else {
        rng.insertNode(nod);
      }
      if (!isNode) {
        if (rng.commonAncestorContainer !== rich) {
          frag = document.createDocumentFragment();
          ancestor = rng.commonAncestorContainer.cloneNode(true);
          ancClone = ancestor.cloneNode(true);
          middle = document.createDocumentFragment();
          middle.appendChild(
            document.createTextNode(
              sel.toString()
            )
          );
          ancestor.innerText = ancestor.innerText.substring(
            0, sel.anchorOffset
          );
          ancClone.innerText = ancClone.innerText.substring(
            sel.anchorOffset + sel.toString().length,
            ancClone.innerText.length
          );
          if(ancestor.innerHTML.length > 0) {
            frag.appendChild(ancestor);
          }
          frag.appendChild(middle);
          if(ancClone.innerHTML.length > 0) {
            frag.appendChild(ancClone);
          }
          rng.commonAncestorContainer.parentNode.replaceChild(
            frag, rng.commonAncestorContainer
          );
        }
      }
      brick.classList.remove("visible-colors");
      brick.classList.remove("visible-url");
      window.getSelection().removeAllRanges();
    };
    var xb = butt("X");
    xb.classList.add(xb.id);
    xb.setAttribute("data-node", "none");
    xb.setAttribute("data-class", "none");
    xb.setAttribute("data-attr", "none");
    xb.setAttribute("data-parent", "none");
    xb.removeAttribute("id");
    xb.setAttribute(
      "title", "Remove Formatting"
    );
    xb.addEventListener("click", addTextFormatting);
    var hb = butt("H");
    hb.classList.add(hb.id);
    hb.setAttribute("data-node", "h2");
    hb.setAttribute("data-class", "none");
    hb.setAttribute("data-attr", "none");
    hb.setAttribute("data-parent", "none");
    hb.removeAttribute("id");
    hb.setAttribute(
      "title", "Heading"
    );
    hb.addEventListener("click", addTextFormatting);
    var bb = butt("B");
    bb.classList.add(bb.id);
    bb.setAttribute("data-node", "b");
    bb.setAttribute("data-class", "none");
    bb.setAttribute("data-attr", "none");
    bb.setAttribute("data-parent", "none");
    bb.removeAttribute("id");
    bb.setAttribute(
      "title", "Bold"
    );
    bb.addEventListener("click", addTextFormatting);
    var ib = butt("i");
    ib.classList.add(ib.id);
    ib.setAttribute("data-node", "i");
    ib.setAttribute("data-class", "none");
    ib.setAttribute("data-attr", "none");
    ib.setAttribute("data-parent", "none");
    ib.removeAttribute("id");
    ib.setAttribute(
      "title", "Italic"
    );
    ib.addEventListener("click", addTextFormatting);
    var so = butt("S");
    so.classList.add(so.id);
    so.removeAttribute("id");
    so.setAttribute("data-node", "strike");
    so.setAttribute("data-class", "none");
    so.setAttribute("data-attr", "none");
    so.setAttribute("data-parent", "none");
    so.setAttribute(
      "title", "Strike"
    );
    so.addEventListener("click", addTextFormatting);
    var ab = butt("a");
    ab.classList.add(ab.id);
    ab.removeAttribute("id");
    var ok = butt("ok");
    ok.classList.add(ok.id);
    ok.removeAttribute("id");
    var urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.addEventListener("focus", function () {
      this.select();
    });
    urlInput.classList.add("a_button_input");
    urlInput.value = "https://";
    ok.setAttribute("data-node", "a");
    ok.setAttribute("data-class", "none");
    ok.setAttribute("data-attr", "href");
    ok.setAttribute("data-parent", "none");
    ab.setAttribute(
      "title", "Link"
    );
    ok.addEventListener("click", addTextFormatting);
    ab.addEventListener("click", function() {
      brick.classList.add("visible-url");
    });
    var ol = butt("ol");
    ol.classList.add(ol.id);
    ol.removeAttribute("id");
    ol.setAttribute("data-node", "li");
    ol.setAttribute("data-class", "none");
    ol.setAttribute("data-attr", "none");
    ol.setAttribute("data-parent", "ol");
    ol.firstChild.innerHTML = "1.";
    ol.setAttribute(
      "title", "Ordered List"
    );
    ol.addEventListener("click", addTextFormatting);
    var ul = butt("ul");
    ul.classList.add(ul.id);
    ul.removeAttribute("id");
    ul.setAttribute("data-node", "li");
    ul.setAttribute("data-class", "none");
    ul.setAttribute("data-attr", "none");
    ul.setAttribute("data-parent", "ul");
    ul.firstChild.innerHTML = "&#x26AB;";
    ul.setAttribute(
      "title", "Unordered List (Bullet Point)"
    );
    ul.addEventListener("click", addTextFormatting);
    var bq = butt("bq");
    bq.classList.add(bq.id);
    bq.removeAttribute("id");
    bq.setAttribute("data-node", "blockquote");
    bq.setAttribute("data-class", "none");
    bq.setAttribute("data-attr", "none");
    bq.setAttribute("data-parent", "none");
    bq.firstChild.innerHTML = "&#x2590;";
    bq.setAttribute(
      "title", "Blockquote"
    );
    bq.addEventListener("click", addTextFormatting);
    var colorB = butt("colors");
    colorB.classList.add(colorB.id);
    colorB.removeAttribute("id");
    var color = document.createElement("div");
    color.classList.add("color");
    colorB.firstChild.innerHTML = color.outerHTML;
    colorB.setAttribute(
      "title", "Text Color"
    );
    colorB.addEventListener("click", function() {
      brick.classList.add("visible-colors");
    });
    var colors = [
      ["Pink", "#ff62ce", "niles"],
      ["Red", "#ff492f", "joey"],
      ["Orange", "#ff8a00", "monica"],
      ["Yellow", "#e8d73a", "phoebe"],
      ["Green", "#00cf35", "ross"],
      ["Cerulean", "#00b8ff", "rachel"],
      ["Blue", "#7c5cff", "chandler"]
    ];
    var cb;
    for (i = 0; i < colors.length; i++) {
      cb = butt(colors[i][0]);
      cb.classList.add(cb.id);
      cb.removeAttribute("id");
      cb.setAttribute(
        "title",
        colors[i][0] + " " +
        colors[i][2].charAt(0).toUpperCase() + colors[i][2].slice(1)
      );
      cb.classList.add("colors_buttons");
      cb.firstChild.innerHTML = "";
      cb.style.backgroundColor = colors[i][1];
      cb.setAttribute("data-node", "span");
      cb.setAttribute("data-class", "npf_color_" + colors[i][2]);
      cb.setAttribute("data-attr", "none");
      cb.setAttribute("data-parent", "none");
      cb.addEventListener("click", addTextFormatting);
      pbe.appendChild(cb);
    }
    var fb = butt("Q");
    fb.classList.add(fb.id);
    fb.removeAttribute("id");
    fb.setAttribute(
      "title", "Quirky/Fancy"
    );
    fb.setAttribute("data-node", "p");
    fb.setAttribute("data-class", "npf_quirky");
    fb.setAttribute("data-attr", "none");
    fb.setAttribute("data-parent", "none");
    fb.addEventListener("click", addTextFormatting);
    pbe.appendChild(xb);
    pbe.appendChild(bb);
    pbe.appendChild(ib);
    pbe.appendChild(so);
    pbe.appendChild(ab);
    pbe.appendChild(hb);
    pbe.appendChild(ol);
    pbe.appendChild(ul);
    pbe.appendChild(bq);
    pbe.appendChild(colorB);
    pbe.appendChild(fb);
    pbe.appendChild(urlInput);
    pbe.appendChild(ok);
  };
  var pluginBuildColumns = function() {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    data.classList.add("rebuild_anyway");
    // we'll dispatch a masonry event, with window resize
    // because I don't want to appendChild script xMany
    // times, to communicate to window wrapper/scope...
    var masonry = new CustomEvent("resize");
    window.dispatchEvent(masonry);
  };
  // here are some button making things
  var butt = function (nam) { // buttons for widgets
    var sel = document.createElement("button");
    sel.id = nam.toLowerCase().replace(/\s+/, "_") + "_button";
    sel.classList.add("chrome");
    sel.classList.add("big_dark");
    var div = document.createElement("div");
    div.classList.add("chrome_button"); // numbers for same name buttons
    div.appendChild(document.createTextNode(nam.replace(/\d+$/,"")));
    sel.appendChild(div);
    return sel;
  };
  var newChromeButton = function (id, text, withWidget) {
    var container = document.createElement("span");
    container.classList.add("header_button");
    var button = document.createElement("button");
    button.id = id + "_button";
    button.classList.add("chrome");
    button.classList.add("big_dark");
    var cb;
    cb = document.createElement("div");
    cb.classList.add("chrome_button");
    if (typeof text === "string") {
      cb.innerHTML = text;
    } else { // assumed element/fragment
      cb.appendChild(text);
      var sv = cb.getElementsByTagName("svg");
      for (var i = 0; i < sv.length; i++) {
        sv[i].setAttribute("fill", "#fff");
        sv[i].setAttribute("width", "15");
        sv[i].setAttribute("height", "15");
      }
    }
    if (withWidget) {
      var arrow = document.createElement("div");
      arrow.classList.add("arrow");
      cb.appendChild(arrow);
      var input = document.createElement("input");
      input.type = "checkbox";
      input.id = id;
      button.addEventListener("click", function () {
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change"));
      });
      button.appendChild(cb);
      container.appendChild(button);
      container.appendChild(input);
      var widget = document.createElement("div");
      widget.classList.add("widget");
      widget.id = id + "_widget";
      container.appendChild(widget);
    } else {
      button.appendChild(cb);
    }
    container.appendChild(button);
    return container;
  };
  // end buttons stuff
  var lcontent = document.getElementsByClassName("l-content")[0];
  if (typeof lcontent !== "undefined") {
    lcontent.innerHTML = "";
  }
  var en = document.getElementsByClassName("editor_navigation");
  var enable = en[0].getElementsByTagName("button");
  for (i = 0; i < enable.length; i++) {
    enable[i].classList.add("disable-when-none-selected");
  }
  // these functions & vars may be both plugin and window
  var postCountMake = function () {
    var hl = document.getElementsByClassName("highlighted");
    var x = hl.length;
    var i;
    var privateButton = document.getElementById("private_button");
    var privateCount = 0;
    for (i = 0; i < x; i++) {
      if (hl[i].classList.contains("private")) {
        privateCount++;
      }
    }
    if (
      privateButton !== null &&
      typeof privateButton !== "undefined" &&
      privateCount === hl.length && hl.length !== 0 &&
      privateButton.getElementsByTagName("span")[0].innerText !== "(Public)"
    ) {
      privateButton.getElementsByTagName("span")[0].innerText = "(Public)";
      privateButton.setAttribute(
        "data-edit_action",'{"post[state]":"0"}'
      ); // "0" is public usually
    } else if (
      privateButton !== null &&
      typeof privateButton !== "undefined" &&
      privateButton.getElementsByTagName("span")[0].innerText !== "Private"
    ) {
      privateButton.getElementsByTagName("span")[0].innerText = "Private";
      privateButton.setAttribute(
        "data-edit_action",'{"post[state]":"private"}'
      );
    }
    // make follow or unfollow
    var href = document.location.href.split(/[\/\?&#=]+/g);
    // make public if mostly private selected
    if (href[5] === "followers" || href[5] === "following" || href[5] === "fans") {
      var followButton = document.getElementById("unfollow_button");
      var followCount = 0;
      for (i = 0; i < x; i++) {
        if (hl[i].classList.contains("unfollowed")) {
          followCount++;
        }
      }
    }
    if (
      followButton !== null &&
      typeof followButton !== "undefined" &&
      followCount === hl.length && hl.length !== 0 &&
      followButton.getElementsByTagName("span")[0].innerText !== "Follow"
    ) {
      followButton.getElementsByTagName("span")[0].innerText = "Follow";
      followButton.setAttribute(
        "data-follow", "true"
      );
      followButton.setAttribute("title", "follow selected");
      followButton.getElementsByTagName("svg")[0].parentNode.replaceChild(
        svgForType.happy.cloneNode(true),
        followButton.getElementsByTagName("svg")[0]
      );
    } else if (
      followButton !== null &&
      typeof followButton !== "undefined" &&
      followButton.getElementsByTagName("span")[0].innerText !== "UnFollow"
    ) {
      followButton.setAttribute("title", "unfollow selected");
      followButton.getElementsByTagName("span")[0].innerText = "UnFollow";
      followButton.setAttribute(
        "data-follow", "false"
      );
      followButton.getElementsByTagName("svg")[0].parentNode.replaceChild(
        svgForType.sad.cloneNode(true),
        followButton.getElementsByTagName("svg")[0]
      );
    }
    var unsel = document.getElementById("unselect");
    var count = unsel.getElementsByClassName("chrome_button_right")[0];
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var del = document.getElementById("delete_posts");
    if (data.getAttribute("data-highlight-count") !== x.toString()) {
      data.setAttribute("data-select-all_needle", "0");
      data.setAttribute("data-select-by_needle", "0");
      document.getElementById(
        "select-all_button"
      ).getElementsByTagName("span")[0].innerHTML = "Select 100";
      data.setAttribute("data-highlight-count", x);
      document.title = data.getAttribute("doc-title") + " (" + x + ")";
      count.innerHTML = "&nbsp;(" + x + ")";
      if (del !== null) {
        del.getElementsByClassName(
          "chrome_button_right"
        )[0].innerHTML = "&nbsp;(" + x + ")";
      }
      var en = document.getElementsByClassName("editor_navigation");
      var enable = en[0].getElementsByClassName(
        "disable-when-none-selected"
      );
      // disable certain edit buttons, when 0 selected posts
      if (x === 0) {
        for (i = 0; i < enable.length; i++) {
          if (enable[i].id === "select-by_button") {
            continue;
          }
          enable[i].disabled = true;
        }
        count.innerHTML = "";
        if (del !== null) {
          del.getElementsByClassName(
            "chrome_button_right"
          )[0].innerHTML = "";
        }
        document.title = data.getAttribute("doc-title");
        data.classList.add("disable-temp");
      } else if (data.classList.contains("disable-temp")) {
        for(var l = 0; l < enable.length; l++) {
          enable[l].disabled = false;
        }
        data.classList.remove("disable-temp");
      }
    }
    // populate remove_tags widget...
    // sans ajax && sans%20escaped%20labels && sans jQuery
    var idToTags = JSON.parse(
      data.getAttribute("data-id_to_tags")
    );
    var createTagThing = function (i, tag) {
      var div = document.createElement("div");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.id = "tag_checkbox_" + i;
      input.setAttribute("alt", tag);
      var label = document.createElement("label");
      label.setAttribute("for", "tag_checkbox_" + i);
      label.appendChild(
        document.createTextNode(tag)
      );
      div.appendChild(input);
      div.appendChild(label);
      return div;
    };
    var id;
    var tag;
    var tags;
    var tagsAdded = [];
    var tagsWidget = document.getElementById("tags");
    if (
      window.getComputedStyle(
        tagsWidget.parentNode
      ).getPropertyValue("display") !== "block"
    ) {
      tagsWidget.innerHTML = "";
      for (i = 0; i < hl.length; i++) {
        id = hl[i].getAttribute("data-id");
        tags = idToTags[id];
        if( typeof tags !== "undefined") {
          for (l = 0; l < tags.length; l++) {
            tag = tags[l];
            if (tagsAdded.indexOf(tag) === -1) {
              tagsAdded.push(tag);
              tagsWidget.appendChild(
                createTagThing(tagsAdded.length, tag)
              );
            }
          }
        }
      }
    }
    return x;
  };
  // end dual wrapper functions

  // these are pluginScope, but all DOM, so regardless
  var precountTheSelection = function () {
    var pick = document.getElementsByClassName("picked");
    while (pick.length > 0) {
      pick[0].classList.remove("picked");
    }
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var allToSelect = JSON.parse(
      data.getAttribute("data-all-to-select")
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var tagToIds = JSON.parse(
      data.getAttribute("data-tag_to_ids")
    );
    var idToTags = JSON.parse(
      data.getAttribute("data-id_to_tags")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    var idToOrigin = JSON.parse(
      data.getAttribute("data-id_to_origin")
    );
    var idToState = JSON.parse(
      data.getAttribute("data-id_to_state")
    );
    var gt2select = JSON.parse(
      data.getAttribute("data-gt-to-select")
    );
    var lt2select = JSON.parse(
      data.getAttribute("data-lt-to-select")
    );
    // less than notes, the ID is the generated java shortcode thing
    var ltIs = data.classList.contains(// not more
      "istype-1902356151"
    );
    var gtIs = data.classList.contains( // more than notes
      "istype-454920947"// not less :)
    );
    var type;
    var id;
    var post;
    var tag;
    var ltgt;
    var toSelect = [];
    // contains tag
    for (var l = 0; l < allToSelect.istag.length; l++) {
      tag = allToSelect.istag[l];
      for (var i = 0; i < tagToIds[tag].length; i++) {
        id = tagToIds[tag][i];
        if(toSelect.indexOf(id) === -1) {
          toSelect.push(id);
        }
      }
    }
    var index;
    var spliceAfter;
    var originType;
    var origin = [
      "original",
      "reblog-self",
      "reblog-other"
    ];
    var stateType;
    if (toSelect.length === 0) {
      // contains type, go from 0, capture all
      for (l = 0; l < allToSelect.istype.length; l++) {
        type = allToSelect.istype[l];
        if (
          type === "notes-more-than" || type === "notes-less-than"
        ) {
          continue;
        }
        for (i = 0; i < typeToIds[type].length; i++) {
          id = typeToIds[type][i];
          if (
            allToSelect.istype.length > 1 && // capture some
            allToSelect.istype.indexOf(idToOrigin[id]) === -1 &&
            allToSelect.istype.indexOf(idToState[id]) === -1
          ) {
            continue; // has type1, but not type2
          } else {
            if(toSelect.indexOf(id) === -1) {
              toSelect.push(id);
            }
          }
        }
      }
    }
    if (toSelect.length !== 0) { // go twice, for 2 or 3 typeTypes
      // if doesn't contain type, remove  from selection
      for (l = 0; l < allToSelect.istype.length; l++) {
        type = allToSelect.istype[l];
        if (
          type === "notes-more-than" || type === "notes-less-than"
        ) {
          continue;
        }
        originType = origin.indexOf(type) !== -1;
        stateType = type === "private";
        for (i = 0; i < toSelect.length; i++) {
          id = toSelect[i];
          if (
            idToTypes[id] !== type && !originType && !stateType ||
            idToOrigin[id] !== type && originType ||
            idToState[id] !== type && stateType
          ) {
            index = toSelect.indexOf(id);
            if (index !== -1) {
              toSelect.splice(i, 1);
              i--;
            }
          }
        }
      }
    }
    // intermission/break here, continued from @ var notesLtGt
    if (ltIs) { // no :not, so no opposite-day ui confusion :)
      if (toSelect.length !== 0) {
        // after thought types like note count for LT
        for (i = 0; i < toSelect.length; i++) {
          id = toSelect[i];
          if(lt2select.indexOf(id) === -1) {
            toSelect.splice(i, 1);
            i--;
          }
        }
      } else {
        for (i = 0; i < lt2select.length; i++) {
          id = lt2select[i];
          if(toSelect.indexOf(id) === -1) {
            toSelect.push(id);
          }
        }
      }
    }
    if (gtIs) { // this has no :not, less confusion
      if (toSelect.length !== 0) {
        // after thought types like note count for GT
        for (i = 0; i < toSelect.length; i++) {
          id = toSelect[i];
          if(gt2select.indexOf(id) === -1) {
            toSelect.splice(i, 1);
            i--;
          }
        }
      } else {
        for (i = 0; i < gt2select.length; i++) {
          id = gt2select[i];
          if(toSelect.indexOf(id) === -1) {
            toSelect.push(id);
          }
        }
      }
    }
    // back to the normal function
    if (toSelect.length !== 0) { // remove from selection
      // doesn't contain tag
      for (l = 0; l < allToSelect.nottag.length; l++) {
        tag = allToSelect.nottag[l];
        for (i = 0; i < toSelect.length; i++) {
          id = toSelect[i];
          if(tagToIds[tag].indexOf(id) !== -1) {
            toSelect.push(id);
          }
        }
      }
    } else { // or wild select from 0, so add to selection
      for (l = 0; l < allToSelect.nottag.length; l++) {
        tag = allToSelect.nottag[l];
        for (id in idToTags) {
          if (idToTags[id] !== tag) {
            if(toSelect.indexOf(id) === -1) {
              toSelect.push(id);
            }
          }
        }
      }
    }
    if (toSelect.length !== 0) {
      // doesn't contain type, exclusive or whatever
      for (l = 0; l < allToSelect.nottype.length; l++) {
        type = allToSelect.nottype[l];
        if (
          type === "notes-more-than" || type === "notes-less-than"
        ) {
          continue;
        }
        originType = origin.indexOf(type) !== -1;
        stateType = type === "private";
        for (i = 0; i < toSelect.length; i++) {
          id = toSelect[i];
          if (
            idToTypes[id] === type && !originType && !stateType ||
            idToOrigin[id] === type && originType ||
            idToState[id] === type && originType
          ) {
            index = toSelect.indexOf(id);
            if (index !== -1) {
              toSelect.splice(i, 1);
              i--;
            }
          }
        }
      }
    } else { // select from nothing
      for (l = 0; l < allToSelect.nottype.length; l++) {
        type = allToSelect.nottype[l];
        if (
          type === "notes-more-than" || type === "notes-less-than"
        ) {
          continue;
        }
        for (var type2 in typeToIds) {
          if (type === type2) {
            continue;
          }
          for (i = 0; i < typeToIds[type2].length; i++) {
            id = typeToIds[type2][i];
            if (
              typeToIds[type].indexOf(id) !== -1 ||
              allToSelect.nottype.length > 1 && // capture some
              allToSelect.nottype.indexOf(idToOrigin[id]) !== -1 &&
              allToSelect.nottype.indexOf(idToState[id]) === -1
            ) {
              continue; // has type1, but not type2
            } else {
              if(toSelect.indexOf(id) === -1) {
                toSelect.push(id);
              }
            }
          }
        }
      }
    }
    // proudly show the posts select count
    var titleD = document.getElementById("select-by-widget_title");
    var countEl = titleD.getElementsByClassName("preselect-count")[0];
    countEl.classList.add("noanim");
    setTimeout(function (){
      countEl.classList.remove("noanim");
      countEl.innerHTML = " (x" + toSelect.length + ")";
    }, 1);
    var sb = document.getElementById("select_button");
    if (toSelect.length === 0) {
      if (!data.classList.contains("show-only")) {
        sb.disabled = true;
      }
    } else {
      sb.disabled = false;
      var sel;
      for (i = 0; i < toSelect.length; i++) {
        id = toSelect[i];
        sel = document.getElementById("post_" + id);
        if (sel !== null) {
          sel.classList.add("picked");
        }
      }
      data.setAttribute(
        "data-to-select",
        JSON.stringify(toSelect)
      );
    }// to be continued @ var selecto
  };
  var highlightBrick = function (brick, sel) {
    var x = postCountMake();
    var visible = !brick.classList.contains("display-none");
    var hilite = brick.classList.contains("highlighted");
    if(!hilite && sel && x < 100 && visible){
      brick.classList.remove("prevent-anim");
      brick.classList.add("highlighted");
    }
    if(hilite && !sel){
      brick.classList.add("prevent-anim");
      brick.classList.remove("highlighted");
      brick.classList.remove("edit-reblog-queue");
    }
    postCountMake();
  };
  var SVG = function (width, height, fill, viewBox, d) {
    var svg = document.createElementNS(
      "http://www.w3.org/2000/svg", "svg"
    );
    var path = document.createElementNS(
      "http://www.w3.org/2000/svg", "path"
    );
    path.setAttribute("d", d);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("fill", fill);
    svg.appendChild(path);
    return svg;
  };
  // these SVG are stringed wierdly... TODO, clean decimals, maybe?
  var svgForType = {
    "home": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 21,13 V 23 H 15 V 15 H 9 v 8 H 3 V 13 H 0 L 12,1 24,13 Z'
    ),
    "message": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 10.5 0 C 4.7 0 0 4.7 0 10.5 c 0 2.2 0.' +
      '7 4.2 1.8 5.8 l -0.7 4.1 l 4.5 -0.7 C 7.' +
      '1 20.5 8.8 21 10.5 21 C 16.3 21 21 16.2 ' +
      '21 10.4 S 16.3 0 10.5 0 Z M 5.9 7.6 c 0 ' +
      '-0.9 0.8 -1.7 1.7 -1.7 c 0.9 0 1.7 0.8 1' +
      '.7 1.7 c 0 0.9 -0.8 1.7 -1.7 1.7 c -0.9 ' +
      '0 -1.7 -0.8 -1.7 -1.7 Z m 4.6 8.4 c -2.1' +
      ' 0 -3.9 -1.1 -4.6 -2.7 c -0.3 -0.6 0.3 -' +
      '1.3 1.1 -1.3 h 6.8 c 0.8 0 1.4 0.7 1.1 1' +
      '.3 c -0.5 1.6 -2.3 2.7 -4.4 2.7 Z m 2.9 ' +
      '-6.8 c -0.9 0 -1.7 -0.8 -1.7 -1.7 c 0 -0' +
      '.9 0.8 -1.7 1.7 -1.7 c 0.9 0 1.7 0.8 1.7' +
      ' 1.7 c 0 0.9 -0.7 1.7 -1.7 1.7 Z'
    ),
    "friendly": SVG(
      20, 20, "rgba(0,0,0,0.65)", "-4 -4 30 30",
      'M 12 -2.2 C 7.5 -2.2 3.9 1.8 3.9 7.0 C 3.9 10' +
      '.5 5.7 13.6 8.3 15.1 C 7.7 14.9 7.1 14.5 6.5 ' +
      '14.1 C 2.5 15.9 0 21.5 0 24 L 24 24 C 24 21.5' +
      ' 21.4 15.9 17.4 14.1 C 16.8 14.5 16.3 14.9 15' +
      '.6 15.1 C 18.2 13.6 20.0 10.5 20.0 7.0 C 20.0' +
      ' 1.8 16.4 -2.2 12 -2.2 z '
    ),
    "mutual": SVG(
      20, 20, "rgba(0,0,0,0.65)", "-4 -4 30 30",
      'M 12 -2.2 C 7.5 -2.2 3.9 1.8 3.9 7.0 C 3.9 10' +
      '.5 5.7 13.6 8.3 15.1 C 7.7 14.9 7.1 14.5 6.5 ' +
      '14.1 C 2.5 15.9 0 21.5 0 24 L 24 24 C 24 21.5' +
      ' 21.4 15.9 17.4 14.1 C 16.8 14.5 16.3 14.9 15' +
      '.6 15.1 C 18.2 13.6 20.0 10.5 20.0 7.0 C 20.0' +
      ' 1.8 16.4 -2.2 12 -2.2 z M 11.8 15.2 C 12.7 1' +
      '5.1 13.6 15.5 14.1 16.4 C 15.2 14.4 18.5 15.0' +
      ' 18.5 17.5 C 18.5 19.3 16.4 21.1 14.1 23.6 C ' +
      '11.7 21.1 9.7 19.3 9.7 17.5 C 9.7 16.1 10.7 1' +
      '5.3 11.8 15.2 z '
    ),
    "happy": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 12 0.2 C 5.3 0.2 0 5.5 0 12.2 C 0 18.8 5.3 ' +
      '24.2 12 24.2 C 18.6 24.2 24 18.8 24 12.2 C 24' +
      ' 5.5 18.6 0.2 12 0.2 z M 16.1 4.5 A 2.2 3.3 0' +
      ' 0 1 18.4 7.9 A 2.2 3.3 0 0 1 16.1 11.2 A 2.2' +
      ' 3.3 0 0 1 13.9 7.9 A 2.2 3.3 0 0 1 16.1 4.5 ' +
      'z M 7.8 4.6 A 2.2 3.3 0 0 1 10.0 7.9 A 2.2 3.' +
      '3 0 0 1 7.8 11.3 A 2.2 3.3 0 0 1 5.6 7.9 A 2.' +
      '2 3.3 0 0 1 7.8 4.6 z M 4.2 11.4 C 6.3 13.3 8' +
      '.6 14.5 11.9 14.6 C 15.2 14.7 17.5 13.6 19.7 ' +
      '11.8 L 20.4 12.6 C 18.7 15.2 15.7 18.0 11.8 1' +
      '7.9 C 7.9 17.8 5.0 14.8 3.5 12.2 L 4.2 11.4 z' +
      ' '
    ),
    "sad": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 12 0.2 C 5.3 0.2 0 5.5 0 12.2 C 0 18.8 5.3 ' +
      '24.2 12 24.2 C 18.6 24.2 24 18.8 24 12.2 C 24' +
      ' 5.5 18.6 0.2 12 0.2 z M 16.1 4.5 A 2.2 3.3 0' +
      ' 0 1 18.4 7.9 A 2.2 3.3 0 0 1 16.1 11.2 A 2.2' +
      ' 3.3 0 0 1 13.9 7.9 A 2.2 3.3 0 0 1 16.1 4.5 ' +
      'z M 7.8 4.6 A 2.2 3.3 0 0 1 10.0 7.9 A 2.2 3.' +
      '3 0 0 1 7.8 11.3 A 2.2 3.3 0 0 1 5.6 7.9 A 2.' +
      '2 3.3 0 0 1 7.8 4.6 z M 11.8 12.6 C 15.7 12.5' +
      ' 18.7 15.3 20.3 18.0 L 19.6 18.8 C 17.5 16.9 ' +
      '15.1 15.8 11.8 15.8 C 8.5 15.9 6.2 17.0 4.1 1' +
      '8.9 L 3.4 18.1 C 5.0 15.5 7.9 12.6 11.8 12.6 ' +
      'z '
    ),
    "caption": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 2.3 2.8 L 2.3 4.8 L 21.2 4.8 L 21.2 2.' +
      '8 L 2.3 2.8 z M 2.5 8.6 L 2.5 10.6 L 21.' +
      '4 10.6 L 21.4 8.6 L 2.5 8.6 z M 2.5 14.5' +
      ' L 2.5 16.4 L 21.4 16.4 L 21.4 14.5 L 2.' +
      '5 14.5 z M 2.5 20.3 L 2.5 22.3 L 14.1 22' +
      '.3 L 14.1 20.3 L 2.5 20.3 z '
    ),
    "clock": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 12 0 C 5.3 0 -7.9e-17 5.3 0 12 C 0 18.' +
      '6 5.3 24 12 24 C 18.6 24 24 18.6 24 12 C' +
      ' 24 5.3 18.6 -7.9e-17 12 0 z M 12 3.9 C ' +
      '16.5 3.9 20.2 7.5 20.2 12 C 20.2 15.0 18' +
      '.4 17.7 15.8 19.1 C 14.6 19.7 13.3 20.0 ' +
      '12 20.0 C 7.4 20.0 3.7 16.4 3.7 12 C 3.7' +
      ' 7.5 7.4 3.9 12 3.9 z M 9.7 7.8 L 9.7 15' +
      '.0 L 15.3 15.0 L 15.3 12.3 L 12.3 12.3 L' +
      ' 12.3 7.8 L 9.7 7.8 z '
    ),
    "symlink": SVG( // symbol link :D
      20, 20, "#FFF", "0 0 17 17",
      'M 10.8 3.2 C 10.0 3.2 9.3 3.5 8.8 4.0 C ' +
      '8.0 4.8 7.8 7.2 7.8 8.5 L 7.6 9.4 C 7.5 ' +
      '10.8 7.2 11.7 7.0 11.9 C 6.4 12.4 5.5 12' +
      '.4 5.0 11.9 C 4.4 11.3 4.4 10.5 5.0 9.9 ' +
      'C 5.1 9.9 5.4 9.7 6.6 9.4 L 6.6 7.9 C 5.' +
      '5 8.0 4.5 8.3 4.0 8.8 C 2.9 9.9 2.9 11.8' +
      ' 4.0 12.9 C 5.1 14.1 7.0 14.0 8.1 12.9 C' +
      ' 8.7 12.2 9.0 10.6 9.1 9.3 L 10.4 9.0 C ' +
      '11.4 8.9 12.4 8.6 12.9 8.1 C 14.1 6.9 14' +
      '.1 5.1 12.9 4.0 C 12.3 3.4 11.5 3.2 10.8' +
      ' 3.2 z M 10.9 4.7 C 11.2 4.7 11.6 4.8 11' +
      '.9 5.0 C 12.5 5.6 12.5 6.4 11.9 7.0 C 11' +
      '.7 7.2 11.1 7.4 10.4 7.5 L 9.3 7.6 C 9.4' +
      ' 6.4 9.7 5.3 9.9 5.0 C 10.2 4.8 10.5 4.7' +
      ' 10.9 4.7 z '
    ),
    "select": SVG(
      20, 20, "rgba(255,255,255,1)", "0 0 1800 1800",
      'M 1190.5,1425 H 981.9 v 300 h 208.6 z m -445.0,0 H 536.' +
      '8 v 300 H 745.4 Z M 300.4,5 H 5 V 285.6 H 300.4 Z M 5,5' +
      '22.1 V 730.7 H 300.4 V 522.1 Z M 5,967.1 V 1175.8 H 300' +
      '.4 V 967.1 Z M 5,1412.2 V 1725 H 300.4 V 1412.2 Z M 142' +
      '7.0,1725 H 1725 V 1412.2 H 1427.0 Z M 1725,1175.8 V 967' +
      '.1 h -300 v 208.6 z m 0,-445.0 V 522.1 h -300 v 208.6 z' +
      ' m 0,-445.0 V 5 h -297.9 l -0.0,280.6 z M 536.8,305 H 7' +
      '45.4 V 5 H 536.8 Z m 445.0,0 H 1190.5 V 5 H 981.9 v 300'
    ),
    "unselect": SVG(
      20, 20, "rgba(255,255,255,1)", "0 0 1800 1800",
      'M 1190.5,1425 H 981.9 v 300 h 208.6 z m -445.0,0 H 536.' +
      '8 v 300 H 745.4 Z M 300.4,5 H 5 V 285.6 H 300.4 Z M 5,5' +
      '22.1 V 730.7 H 300.4 V 522.1 Z M 5,967.1 V 1175.8 H 300' +
      '.4 V 967.1 Z M 5,1412.2 V 1725 H 300.4 V 1412.2 Z M 142' +
      '7.0,1725 H 1725 V 1412.2 H 1427.0 Z M 1725,1175.8 V 967' +
      '.1 h -300 v 208.6 z m 0,-445.0 V 522.1 h -300 v 208.6 z' +
      ' m 0,-445.0 V 5 h -297.9 l -0.0,280.6 z M 536.8,305 H 7' +
      '45.4 V 5 H 536.8 Z m 445.0,0 H 1190.5 V 5 H 981.9 Z M 5' +
      '26.1,1392.8 870.3,1048.6 1214.6,1392.8 1402.4,1204.9 10' +
      '58.2,860.7 1402.4,516.5 1214.6,328.7 870.3,672.9 526.1,' +
      '328.7 338.3,516.5 682.5,860.7 338.3,1204.9 526.1,1392.8'
    ),
    "private": SVG(
      20, 20, "rgba(0,0,0,0.65)", "0 0 25 25",
      'M 12 0 C 8.687 0 6 2.687 6 6 L 6 10 L 3 ' +
      '10 L 3 24 L 21 24 L 21 10 L 18 10 L 18 6' +
      ' C 18 2.687 15.313 0 12 0 z M 12 2 C 14.' +
      '205 2 16 3.794 16 6 L 16 10 L 8 10 L 8 6' +
      ' C 8 3.794 9.794 2 12 2 z '
    ),
    "view": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M 5 2 C 3.9 2 3 2.9 3 4 L 3 19 C 3 20.1 3' +
      '.9 21 5 21 L 9.90625 21 C 9.40625 20.4 9.' +
      '1125 19.7 8.8125 19 L 5 19 L 5 4 L 17 4 L' +
      ' 17 10.8125 C 17.7 11.0125 18.4 11.40625 ' +
      '19 11.90625 L 19 4 C 19 2.9 18.1 2 17 2 L' +
      ' 5 2 z M 15 12 C 12.254545 12 10 14.25454' +
      '5 10 17 C 10 19.745455 12.254545 22 15 22' +
      ' C 16.014334 22 16.958627 21.71405 17.75 ' +
      '21.1875 L 20.59375 24 L 22 22.59375 L 19.' +
      '1875 19.75 C 19.71405 18.958627 20 18.014' +
      '334 20 17 C 20 14.254545 17.745455 12 15 ' +
      '12 z M 15 14 C 16.654545 14 18 15.345455 ' +
      '18 17 C 18 18.654545 16.654545 20 15 20 C' +
      ' 13.345455 20 12 18.654545 12 17 C 12 15.' +
      '345455 13.345455 14 15 14 z'
    ),
    "see": SVG(
      20, 20, "#fff", "0 0 25 25",
      'M12.0 7c4.7 0 8.0 3.0 9.5 4.6-1.4 1.8-4.7 ' +
      '5.3-9.5 5.3-4.4 0-7.9-3.5-9.4-5.4 1.4-1.6 ' +
      '4.8-4.5 9.4-4.5zm0-2c-7.5 0-12.0 6.5-12.0 ' +
      '6.5s4.8 7.4 12.0 7.4c7.7 0 11.9-7.4 11.9-7' +
      '.4s-4.2-6.5-11.9-6.5zm-.0 3c-2.2 0-4 1.7-4' +
      ' 4s1.7 4 4 4c2.2 0 4-1.7 4-4s-1.7-4-4-4zm-' +
      '.0 3.9c-.5.5-1.4.5-2.0 0s-.5-1.4 0-2.0c.5-' +
      '.5 1.4-.5 2.0 0s.5 1.4 0 2.0z'
    ),
    "edit": SVG(
      20, 20, "#fff", "0 0 17.6 17.6",
      'M5.3 13.8l-2.1.7.7-2.1L10.3 6l1.4 1.4-6.' +
      '4 6.4zm6.4-9.3l-1.4-1.4-1.4 1.4-6.7 6.7-' +
      '.2.5-2 5.9 3.8-1.3 2.1-.7.4-.1.3-.3 7.8-' +
      '7.8c.1 0-2.7-2.9-2.7-2.9zm5.6-1.4L14.5.3' +
      'c-.4-.4-1-.4-1.4 0l-1.4 1.4L15.9 6l1.4-1' +
      '.4c.4-.5.4-1.1 0-1.5'
    ),
    "tag": SVG(
     20, 20, "rgba(0,0,0,0.65)", "0 0 25 25",
    'M 22.548,9 C 23.206256,8.9700327 23.650255,7.910999 23,7 H 1' +
    '7.636 L 19,1 C 18.752094,0.59934281 17.927011,0.1886722 17,1' +
    ' l -1.364,6 h -5 L 12,1 C 11.549885,0.14080067 10.499307,0.2' +
    '4688203 10,1 L 8.636,7 H 2.452 C 1.4285746,7.5060381 1.19403' +
    '09,8.6369341 2,9 H 8.182 L 6.818,15 H 1.458 C 0.88718577,15.' +
    '077045 -0.12646423,15.930092 1,17 H 6.364 L 5,23 c 0.085861,' +
    '0.788259 1.3877329,1.432281 2,0 l 1.364,-6 h 5 L 12,23 c -0.' +
    '149456,1.256123 1.798475,1.024039 2,0 l 1.364,-6 h 6.185 C 2' +
    '2.966246,16.643398 22.272209,14.963206 22,15 h -6.182 l 1.36' +
    '4,-6 z m -8.73,6 h -5 l 1.364,-6 h 5 z'
    ),
    "ask": SVG(
      20, 20, "rgba(0,0,0,0.65)", "0 0 17 17",
      'M8.7 0C4.1 0 .4 3.7.4 8.3c0 1.2.2 2.3.7 3.4-.2.6-.4 1.5-.7 2' +
      '.5L0 15.8c-.2.7.5 1.4 1.2 1.2l1.6-.4 2.4-.7c1.1.5 2.2.7 3.4.' +
      '7 4.6 0 8.3-3.7 8.3-8.3C17 3.7 13.3 0 8.7 0zM15 8.3c0 3.5-2.' +
      '8 6.3-6.4 6.3-1.2 0-2.3-.3-3.2-.9l-3.2.9.9-3.2c-.5-.9-.9-2-.' +
      '9-3.2.1-3.4 3-6.2 6.5-6.2S15 4.8 15 8.3z'
    ),
    "reblog-self": SVG(
      20, 20, "rgba(0,0,0,0.65)", "0 0 17 18.1",
      'M12.8.2c-.4-.4-.8-.2-.8.4v2H' +
      '2c-2 0-2 2-2 2v5s0 1 1 1 1-1' +
      ' 1-1v-4c0-1 .5-1 1-1h9v2c0 .' +
      '6.3.7.8.4L17 3.6 12.8.2zM4.2' +
      ' 17.9c.5.4.8.2.8-.3v-2h10c2 ' +
      '0 2-2 2-2v-5s0-1-1-1-1 1-1 1' +
      'v4c0 1-.5 1-1 1H5v-2c0-.6-.3' +
      '-.7-.8-.4L0 14.6l4.2 3.3z'
      ),
    "original": SVG(
      20, 20, "rgba(0,0,0,0.65)", "0 0 27 27",
      'M 12.2,5.3 14.1,9.9 l 4.3,0.5 -2.9,4.1 0' +
      '.9,4.7 -4.8,-2.1 C 7.2,11.3 10.6,11.3 12' +
      '.2,5.3 Z M 12,0.5 8.3,8.1 0,9.3 6.0,15.1' +
      ' 4.5,23.4 12,19.4 19.4,23.4 17.9,15.1 24' +
      ',9.3 15.6,8.1 Z'
    ),
    "reblog-other": SVG(
      20, 20, "rgba(0,0,0,0.6)", "18 10 67 67",
      'M 64.7 10.1 C 63.9 10.2 63.3 11.0 63.3 12.' +
      '4 L 63.3 20.0 L 25.5 20.0 C 17.9 20.0 18 2' +
      '7.5 18 27.5 L 18 46.4 C 18 46.4 17.9 50.2 ' +
      '21.7 50.2 C 25.5 50.2 25.5 46.4 25.5 46.4 ' +
      'L 25.5 31.3 C 25.5 27.5 27.4 27.5 29.3 27.' +
      '5 L 63.3 27.5 L 63.3 35.1 C 63.3 37.4 64.4' +
      ' 37.7 66.3 36.6 L 82.2 23.7 L 66.3 10.9 C ' +
      '65.8 10.3 65.2 10.1 64.7 10.1 z M 50.5 30.' +
      '1 C 42.2 30.1 35.5 36.7 35.5 44.9 C 35.5 5' +
      '3.1 42.2 59.8 50.5 59.8 C 58.8 59.8 65.5 5' +
      '3.1 65.5 44.9 C 65.5 36.7 58.8 30.1 50.5 3' +
      '0.1 z M 50.5 32.6 C 55.1 32.6 59.2 35.1 61' +
      '.3 38.8 L 39.7 38.8 C 41.8 35.1 45.9 32.6 ' +
      '50.5 32.6 z M 78.4 38.9 C 74.6 38.9 74.6 4' +
      '2.6 74.6 42.6 L 74.6 57.8 C 74.6 61.5 72.8' +
      ' 61.5 70.9 61.5 L 36.8 61.5 L 36.8 54.0 C ' +
      '36.8 51.7 35.7 51.3 33.8 52.5 L 18 65.3 L ' +
      '33.8 78.2 C 34.4 78.7 35.0 79.0 35.4 79.0 ' +
      'C 36.3 78.9 36.8 78.1 36.8 76.7 L 36.8 69.' +
      '1 L 74.6 69.1 C 82.2 69.1 82.2 61.5 82.2 6' +
      '1.5 L 82.2 42.6 C 82.2 42.6 82.2 38.9 78.4' +
      ' 38.9 z M 38.5 41.2 L 40.9 41.2 C 41.6 43.' +
      '1 43.3 44.9 45.9 44.9 C 49.0 44.9 48.6 42.' +
      '1 50.5 42.1 C 52.4 42.1 52.0 44.9 55.1 44.' +
      '9 C 57.7 44.9 59.4 43.1 60.1 41.2 L 62.4 4' +
      '1.2 C 62.8 42.4 63.0 43.7 63.0 44.9 C 63.0' +
      ' 51.8 57.4 57.3 50.5 57.3 C 43.6 57.3 38.0' +
      ' 51.8 38.0 44.9 C 38.0 43.7 38.2 42.4 38.5' +
      ' 41.2 z M 43.6 47.3 L 43.0 48.0 C 44.4 50.' +
      '1 47.0 52.4 50.5 52.4 C 54.0 52.4 56.6 50.' +
      '1 58.0 48.0 L 57.4 47.3 C 55.5 48.8 53.4 4' +
      '9.7 50.5 49.7 C 47.6 49.7 45.5 48.8 43.6 4' +
      '7.3 z '
    ),
    "notes": SVG(
      20, 20, "rgba(0,0,0,0.65)", "0 0 20 18",
      'M14.658 0c-1.625 0-3.21.767-4.463 2.156-' +
      '.06.064-.127.138-.197.225-.074-.085-.137' +
      '-.159-.196-.225C8.547.766 6.966 0 5.35 0' +
      ' 4.215 0 3.114.387 2.162 1.117c-2.773 2.' +
      '13-2.611 5.89-1.017 8.5 2.158 3.535 6.55' +
      '6 7.18 7.416 7.875A2.3 2.3 0 0 0 9.998 1' +
      '8c.519 0 1.028-.18 1.436-.508.859-.695 5' +
      '.257-4.34 7.416-7.875 1.595-2.616 1.765-' +
      '6.376-1-8.5C16.895.387 15.792 0 14.657 0' +
      'h.001zm0 2.124c.645 0 1.298.208 1.916.68' +
      '3 1.903 1.461 1.457 4.099.484 5.695-1.97' +
      '3 3.23-6.16 6.7-6.94 7.331a.191.191 0 0 ' +
      '1-.241 0c-.779-.631-4.966-4.101-6.94-7.3' +
      '32-.972-1.595-1.4-4.233.5-5.694.619-.475' +
      ' 1.27-.683 1.911-.683 1.064 0 2.095.574 ' +
      '2.898 1.461.495.549 1.658 2.082 1.753 2.' +
      '203.095-.12 1.259-1.654 1.752-2.203.8-.8' +
      '87 1.842-1.461 2.908-1.461h-.001z'
    ),
    "liked": SVG(
      20, 20, "rgba(255,0,0,1)", "0 0 20 18",
      'M17.888 1.1C16.953.38 15.87 0 14.758 0c-1.' +
      '6 0-3.162.76-4.402 2.139-.098.109-.217.249' +
      '-.358.42a12.862 12.862 0 0 0-.36-.421C8.4.' +
      '758 6.84 0 5.248 0 4.14 0 3.06.381 2.125 1' +
      '.1-.608 3.201-.44 6.925 1.14 9.516c2.186 3' +
      '.59 6.653 7.301 7.526 8.009.38.307.851.474' +
      ' 1.333.474a2.12 2.12 0 0 0 1.332-.473c.873' +
      '-.71 5.34-4.42 7.526-8.01 1.581-2.597 1.75' +
      '5-6.321-.968-8.418'
    ),
    "text": SVG(
      20, 20, "#000", "0 0 20.8 13",
      'M.1 13h2.8l.9-3h4.7l.8 3h2.9L7.7 0h-3L.1' +
      ' 13zm6-10.1l2 5.1H4.2l1.9-5.1zM20 10V6c0' +
      '-1.1-.2-1.9-1-2.3-.7-.5-1.7-.7-2.7-.7-1.' +
      '6 0-2.7.4-3.4 1.2-.4.5-.6 1.2-.7 2h2.4c.' +
      '1-.4.2-.6.4-.8.2-.3.6-.4 1.2-.4.5 0 .9.1' +
      ' 1.2.2.3.1.4.4.4.8 0 .3-.2.5-.5.7-.2.1-.' +
      '5.2-1 .2l-.9.1c-1 .1-1.7.3-2.2.6-.9.5-1.' +
      '4 1.3-1.4 2.5 0 .9.3 1.6.8 2 .6.5 1.3.9 ' +
      '2.2.9.7 0 1.2-.3 1.7-.6.4-.2.8-.6 1.2-.9' +
      ' 0 .2 0 .4.1.6 0 .2.1.8.2 1h2.7v-.8c-.1-' +
      '.1-.3-.2-.4-.3.1-.3-.3-1.7-.3-2zm-2.2-1.' +
      '1c0 .8-.3 1.4-.7 1.7-.4.3-1 .5-1.5.5-.3 ' +
      '0-.6-.1-.9-.3-.2-.2-.4-.5-.4-.9 0-.5.2-.' +
      '8.6-1 .2-.1.6-.2 1.1-.3l.6-.1c.3-.1.5-.1' +
      '.7-.2.2-.1.3-.1.5-.2v.8z'
    ),
    "image": SVG(
      20, 20, "#ff492f", "0 0 17 15",
      'M14.6 1h-2.7l-.6-1h-6l-.6 1H2.4C1.1 1 0 ' +
      '2 0 3.3v9.3C0 13.9 1.1 15 2.4 15h12.2c1.' +
      '3 0 2.4-1.1 2.4-2.4V3.3C17 2 15.9 1 14.6' +
      ' 1zM8.3 13.1c-2.9 0-5.2-2.3-5.2-5.1s2.3-' +
      '5.1 5.2-5.1c2.9 0 5.2 2.3 5.2 5.1s-2.3 5' +
      '.1-5.2 5.1zm5.9-8.3c-.6 0-1.1-.5-1.1-1.1' +
      ' 0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1c0 .6-.' +
      '5 1.1-1.1 1.1zm-10 3.1c0 1.2.5 2.2 1.3 3' +
      ' 0-.2 0-.4-.1-.6 0-2.2 1.8-4 4.1-4 1.1 0' +
      ' 2 .4 2.8 1.1-.3-2-2-3.4-4-3.4-2.2-.1-4.' +
      '1 1.7-4.1 3.9z'
    ),
    "link": SVG(
      20, 20, "#00cf35", "0 0 17 17",
      'M9.9 5.1c-.2.3-.5 1.4-.6 2.6l1.1-.1c.7-.' +
      '1 1.3-.3 1.5-.5.6-.6.6-1.4 0-2-.6-.5-1.4' +
      '-.5-2 0zM8.5 0C3.8 0 0 3.8 0 8.5S3.8 17 ' +
      '8.5 17 17 13.2 17 8.5 13.2 0 8.5 0zm4.4 ' +
      '8.2c-.5.5-1.5.8-2.5.9l-1.2.2c-.1 1.3-.4 ' +
      '2.9-1 3.6-1.1 1.1-3 1.2-4.1 0-1.1-1.1-1.' +
      '1-3 0-4.1.5-.5 1.5-.8 2.6-.9v1.5c-1.2.3-' +
      '1.5.5-1.6.5-.6.6-.6 1.4 0 2 .5.5 1.4.5 2' +
      ' 0 .2-.2.5-1.1.6-2.5l.1-.9c0-1.3.2-3.6 1' +
      '-4.4 1.1-1.1 3-1.2 4.1 0 1.2 1.1 1.2 2.9' +
      ' 0 4.1z'
    ),
    "quote": SVG(
      20, 20, "#ff8a00", "0 0 17 13",
      'M3.5 5.5C4 3.7 5.8 2.4 7.2 1.3L5.9 0C3 1' +
      '.8 0 5 0 8.5 0 11 1.3 13 4 13c2 0 3.7-1.' +
      '5 3.7-3.6C7.7 7 6 5.5 3.5 5.5zm9.3 0c.4-' +
      '1.8 2.2-3.1 3.7-4.2L15.2 0c-2.8 1.8-5.9 ' +
      '5-5.9 8.5 0 2.4 1.3 4.5 4 4.5 2 0 3.7-1.' +
      '5 3.7-3.6 0-2.4-1.7-3.9-4.2-3.9z'
    ),
    "chat": SVG(
      20, 20, "#00b8ff", "0 0 18.7 17",
      'M16 6.1V2.6C16 .8 15 0 13.1 0H2.9C1 0 0 ' +
      '1.1 0 3.3v10.4C0 15.9 1 17 2.9 17h10.2c1' +
      '.9 0 2.9-.8 2.9-2.6v-2.9l2.7-2.9c0-.1-2.' +
      '7-2.5-2.7-2.5zm-4.5-.7c0-.5.3-.8.7-.8s.8' +
      '.3.8.8v1.7l-.3 2.5c0 .3-.2.4-.4.4s-.4-.1' +
      '-.4-.4l-.3-2.5V5.4zm-3.8 6.4c0 .4-.1.8-.' +
      '7.8-.5 0-.7-.4-.7-.8V9.1C6.3 8.4 6 8 5.4' +
      ' 8c-.5 0-1 .4-1 1.2v2.6c0 .4-.1.8-.7.8s-' +
      '.7-.4-.7-.8V5.4c0-.5.3-.8.7-.8.4 0 .7.3.' +
      '7.8v2.1c.3-.4.7-.8 1.5-.8s1.7.5 1.7 2c.1' +
      '.1.1 3.1.1 3.1zm2.5 0c0 .4-.1.8-.7.8-.5 ' +
      '0-.7-.4-.7-.8V7.5c0-.4.1-.8.7-.8.5 0 .7.' +
      '4.7.8v4.3zm-.7-5.6c-.4 0-.7-.4-.7-.8s.3-' +
      '.8.7-.8c.4 0 .7.4.7.8s-.3.8-.7.8zm2.8 6.' +
      '3c-.4 0-.8-.4-.8-.9s.3-.9.8-.9.8.4.8.9-.' +
      '4.9-.8.9z'
    ),
    "audio": SVG(
      20, 20, "#7c5cff", "0 0 19 16",
      'M17.7 7.3c-.4-4.4-4-7.3-8.3-7.3-4.3 0-7.' +
      '9 2.9-8.3 7.4C.5 7.4 0 8 0 8.6v5c0 .8.6 ' +
      '1.4 1.3 1.4H4c.2.4.8 1 1.2 1 .6 0 .8-1 .' +
      '8-1.6V7.8c0-.5-.2-1.6-.8-1.6-.4 0-1 .8-1' +
      '.2 1.1H2.9c.4-3.5 3.2-5.6 6.5-5.6s6.2 2.' +
      '1 6.5 5.6H15c0-.3-.7-1.1-1.1-1.1-.6 0-.9' +
      ' 1-.9 1.6v6.6c0 .5.3 1.6.9 1.6.4 0 1.1-.' +
      '6 1.2-1h2.6c.7 0 1.3-.6 1.3-1.3v-5c0-.8-' +
      '.6-1.3-1.3-1.4zM3 8.5v1l-2 1.3V8.5h2zm15' +
      ' .9l-2 1.3V8.5h2v.9zm-6.4.3l-1.6.5V6.4c0' +
      '-.1-.1-.2-.2-.2s-.2 0-.2.1L7.2 12v.2c.1.' +
      '1.1.1.2.1L9 12v3.8c0 .1-.2.2-.1.2h.3c.1 ' +
      '0 .2 0 .2-.1l2.4-5.9v-.2c-.1-.1-.2-.1-.2' +
      '-.1z'
    ),
    "video": SVG(
      20, 20, "#ff62ce", "0 0 16 15",
      'M15.7 7.8c-.2-.1-.5 0-.6.1l-2.9 2.2c-.1.' +
      '1-.1.1-.2.1V8H0v3h2v3.2c0 .4.3.8.8.8h8.4' +
      'c.5 0 .8-.4.8-.8V12c0 .1.1.2.2.2l2.9 2.2' +
      'c.2.2.4.2.6.1.2-.1.3-.3.3-.5V8.4c0-.2-.1' +
      '-.5-.3-.6zM2.8 6.9c.3 0 .8.1 1.1.1h5.5c.' +
      '3 0 .8-.1 1-.1 1.6-.3 2.8-1.7 2.8-3.4 0-' +
      '1.9-1.6-3.5-3.5-3.5-1.2 0-2.4.6-3 1.7h-.' +
      '1C5.9.6 4.8 0 3.6 0 1.6 0 0 1.6 0 3.5c0 ' +
      '1.7 1.2 3 2.8 3.4zM9 4.2c1 0 1.8-.8 1.8-' +
      '1.8v-.3c.4.3.6.8.6 1.4 0 1-.8 1.8-1.8 1.' +
      '8-.9 0-1.6-.6-1.8-1.5.3.3.7.4 1.2.4zm-6.' +
      '2.1c1 0 1.8-.8 1.8-1.8v-.3c.4.2.6.7.6 1.' +
      '3 0 1-.8 1.8-1.8 1.8-.9 0-1.6-.6-1.8-1.5' +
      '.3.3.7.5 1.2.5z'
    ),
  };
  svgForType.secondary = svgForType.friendly;
  // the profile user icon thing ^

  // begin the giant selectBy widget population things
  var populateSelectByWidget = function () {
    if (!document.getElementById("select-by").checked) {
      return;
    }
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    // these are large JSON attributes DOM, but it should run ok
    // as long as no mutation events/observers on Tumblr's side
    var tagsAllArr = JSON.parse(
      data.getAttribute("data-tags_all_arr")
    );
    var typesAllArr = JSON.parse(
      data.getAttribute("data-types_all_arr")
    );
    var idsAllArr = JSON.parse(
      data.getAttribute("data-ids_all_arr")
    );
    var idToTags = JSON.parse(
      data.getAttribute("data-id_to_tags")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    var idToOrigin = JSON.parse(
      data.getAttribute("data-id_to_origin")
    );
    var idToState = JSON.parse(
      data.getAttribute("data-id_to_state")
    );
    var idToNotes = JSON.parse(
      data.getAttribute("data-id_to_notes")
    );
    var tagToIds = JSON.parse(
      data.getAttribute("data-tag_to_ids")
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var widgetFirstFocus = data.getAttribute(
      "widget_first-focus"
    );
    var rowsLength = 0;
    var anti = function () { // is and not checkboxes
      var ante = document.getElementById(
        this.getAttribute("anti")
      );
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var allToSelect = JSON.parse(
        data.getAttribute("data-all-to-select")
      );
      var tp = document.getElementsByClassName("type");
      var tg;
      var tg2;
      var tgi;
      if (this.checked && ante.checked) {
        ante.parentNode.classList.remove("ch");
        ante.classList.remove(this.id);
        ante.checked = false;
        tg = ante.getAttribute("data-is");
        tg2 = ante.getAttribute("data-tag");
        tgi = allToSelect[tg].indexOf(tg2);
        if (tgi !== -1) {
          allToSelect[tg].splice(tgi, 1);
        }
      }
      var tag = this.getAttribute("data-tag");
      var is = this.getAttribute("data-is");
      var i = allToSelect[is].indexOf(tag);
      var originSelected = false;
      if (this.checked) {
        this.parentNode.classList.add("ch");
        data.classList.add(this.id);
        var origin = ["original","reblog-self","reblog-other"];
        if(i === -1) {
          if (this.classList.contains("type")) {
            for (i = 0; i < tp.length; i++) {
              if (tp[i] !== this) {
                tg = tp[i].getAttribute("data-is");
                tg2 = tp[i].getAttribute("data-tag");
                if (tg2 === null) {
                  continue;
                }
                if (
                    (
                      data.classList.contains(tp[i].id) &&
                      tg2 !== "reblog-self" &&
                      tg2 !== "reblog-other" &&
                      tg2 !== "original" &&
                      tg2 !== "notes-less-than" &&
                      tg2 !== "notes-more-than" &&
                      tg2 !== "private" &&
                      tag !== "private"
                    ) || (
                      data.classList.contains(tp[i].id) &&
                      origin.indexOf(tg2) !== -1 &&
                      origin.indexOf(tag) !== -1
                    )
                ) {
                  // there can be only one...
                  tgi = allToSelect[tg].indexOf(tg2);
                  tp[i].parentNode.classList.remove("ch");
                  tp[i].checked = false;
                  data.classList.remove(tp[i].id);
                  if (tgi !== -1) {
                    allToSelect[tg].splice(tgi, 1);
                  }
                  // you can't select 1 post, with 2 basic types...
                  // it doesn't exist
                }
              }
            }
          }
          allToSelect[is].push(tag);
        }
      } else {
        this.parentNode.classList.remove("ch");
        data.classList.remove(this.id);
        if(i !== -1) {
          allToSelect[is].splice(i, 1);
        }
      }
      data.setAttribute(
        "data-all-to-select",
        JSON.stringify(allToSelect)
      );
      //istag, nottag, istype, nottype
      // step 1 ^ gain the checkBoxes
      // step 2 v preCount the selection
      precountTheSelection();
    };
    var notesLtGt = function () {
      var row = this.parentNode;
      var recount = row.getElementsByClassName("input_is")[0];
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var idToNotes = JSON.parse(
        data.getAttribute("data-id_to_notes")
      );
      var alreadyHidden = data.classList.contains(
         "some-posts-already-hidden"
       );
      var visibleIdsAllArr = JSON.parse(
        data.getAttribute("data-visible_ids_all_arr")
      );
      var op = this.getAttribute("data-operator")
      var ltb = op === "lt";
      var gtb = op === "gt";
      var count = 0;
      var ids = [];
      var nh; // not hidden
      var countEl = row.getElementsByClassName("count")[0];
      for (var id in idToNotes) {
        nh = ( // do not count for hidden posts
          alreadyHidden &&
          visibleIdsAllArr.indexOf(id) !== -1
        ) || !alreadyHidden;
        if(
          (idToNotes[id] < this.value && ltb && nh) ||
          (idToNotes[id] > this.value && gtb && nh)
        ) {
          ids.push(id);
          count++; // count the posts to select
        }
      }
      if (ltb) {
        data.setAttribute(
          "select-by-note_lt",
          this.value
        );
        data.setAttribute(
          "data-lt-to-select",
          JSON.stringify(ids)
        );
      }
      // to be continued @ var precountTheSelection
      if (gtb) {
         data.setAttribute(
          "select-by-note_gt",
          this.value
        );
        data.setAttribute(
          "data-gt-to-select",
          JSON.stringify(ids)
        );
      }
      countEl.innerHTML = count;
      if (recount.checked) {
        precountTheSelection();
      }
    };
    // make row function makeRow
    var widgetRow = function (tag, count, isType, tagIcon) {
      var row = document.createElement("div");
      var rowId = (isType? "type" : "tag") + shortCode(tag);
      row.id = rowId;
      row.setAttribute("data-row", rowsLength);
      row.classList.add("row");
      if (isType) {
        row.classList.add("type");
        row.classList.add(tag);
      } else {
        row.classList.add("tag");
      }
      var countColumn = document.createElement("div");
      countColumn.classList.add("count");
      countColumn.appendChild(
        document.createTextNode(
          count.toLocaleString(
            "en", {useGrouping:true}
          )
        )
      );
      var label1 = document.createElement("label");
      var label2 = document.createElement("label");
      var input1 = document.createElement("input");
      var input2 = document.createElement("input");
      input1.setAttribute("data-tag", tag);
      input2.setAttribute("data-tag", tag);
      var lb = (isType ? "type" : "tag");
      input1.setAttribute("data-is", "is" + lb);
      input2.setAttribute("data-is", "not" + lb);
      input1.classList.add(lb);
      input2.classList.add(lb);
      input1.classList.add("yes");
      input2.classList.add("no");
      input1.setAttribute("data-yn", "yes");
      input2.setAttribute("data-yn", "no");
      var id1 = "is" + rowId;
      var id2 = "not" + rowId;
      input1.setAttribute(
        "anti", "not" + rowId
      );
      input1.classList.add("input_is");
      input2.setAttribute(
        "anti", "is" + rowId
      );
      input2.classList.add("input_not");
      input1.id = id1;
      input2.id = id2;
      input1.addEventListener("change", anti);
      input2.addEventListener("change", anti);
      input1.type = "checkbox";
      input2.type = "checkbox";
      label1.setAttribute("for", id1);
      label2.setAttribute("for", id2);
      var div = document.createElement("div");
      div.classList.add("row-child");
      row.setAttribute("title", tag);
      label1.appendChild(countColumn);
      // we use html instead of textNode for emoji :(
      if (isType) {
        div.innerHTML = tag.replace(/-/g, " ").
        replace(/^.|\s./g, function (m){
          return m.toUpperCase();
        }).replace("Original","Original (op)");
      } else {
        div.innerHTML = tag;
      }
      tagIcon.classList.add("tag-icon");
      label1.appendChild(tagIcon);
      label1.appendChild(div);
      var is = document.createElement("span");
      is.appendChild(document.createTextNode("is: "))
      is.appendChild(input1);
      label2.appendChild(
        document.createTextNode("not: ")
      );
      label2.appendChild(input2);
      label1.classList.add("is");
      label2.classList.add("not");
      if (data.classList.contains("is" + rowId)) {
        input1.checked = true;
        is.classList.add("ch");
      } else if (data.classList.contains("not" + rowId)) {
        label2.classList.add("ch");
        input2.checked = true;
      }
      label1.appendChild(is);
      row.appendChild(label2);
      row.appendChild(label1);
      rowsLength++;
      return row;
    };
    var tag;
    var type;
    var widget = document.getElementById("select-by_widget");
    widget.innerHTML = "";
    var topPart = document.createElement("div");
    topPart.id = "widget-top-buttons";
    var abcSort = document.createElement("div");
    abcSort.classList.add("sort");
    abcSort.classList.add("abc");
    abcSort.appendChild(document.createTextNode("abc"));
    var numSort = document.createElement("div");
    numSort.classList.add("sort");
    numSort.classList.add("num");
    numSort.appendChild(document.createTextNode("123"));
    var dateSort = document.createElement("div");
    dateSort.classList.add("sort");
    dateSort.classList.add("date");
    dateSort.appendChild(document.createTextNode("date"));
    var redSort = document.createElement("div");
    redSort.classList.add("red");
    // the sorting method gets the arrow
    var arrow = document.createElement("div");
    arrow.classList.add("arrow");
    var widgetSortBy = data.getAttribute("widget_sort-by");
    dateSort.setAttribute("widget_sort-by", "date-down");
    abcSort.setAttribute("widget_sort-by", "abc-down");
    numSort.setAttribute("widget_sort-by", "num-down");
    if (widgetSortBy === "date-down") {
      dateSort.appendChild(arrow);
      // this is default sort method, do nothing
      dateSort.setAttribute("widget_sort-by", "date-up");
    }
    if (widgetSortBy === "date-up") {
      arrow.classList.add("reverse");
      dateSort.appendChild(arrow);
      // this is default sort method reversed
      typesAllArr.reverse();
      tagsAllArr.reverse();
    }
    if (widgetSortBy === "abc-down") {
      abcSort.appendChild(arrow);
      // sort by alphabetical
      typesAllArr.sort();
      tagsAllArr.sort();
      abcSort.setAttribute("widget_sort-by", "abc-up");
    }
    if (widgetSortBy === "abc-up") {
      arrow.classList.add("reverse");
      abcSort.appendChild(arrow);
      // sort by reverse alphabetical
      typesAllArr.sort();
      tagsAllArr.sort();
      typesAllArr.reverse();
      tagsAllArr.reverse();
    }
    var sortByCounts = function () {
      var typeArr = [];
      for(var type in typeToIds) {
        typeArr.push([typeToIds[type].length, type]);
      }
      typeArr.sort(function (a, b) {
        return parseFloat(b[0]) - parseFloat(a[0]);
      });
      for (var i = 0; i < typeArr.length; i++) {
        typesAllArr[i] = typeArr[i][1];
      }
      var tagArr = [];
      for(var tag in tagToIds) {
        tagArr.push([tagToIds[tag].length, tag]);
      }
      tagArr.sort(function (a, b) {
        return parseFloat(b[0]) - parseFloat(a[0]);
      });
      for (i = 0; i < tagArr.length; i++) {
        tagsAllArr[i] = tagArr[i][1];
      }
    };
    if (widgetSortBy === "num-down") {
      numSort.appendChild(arrow);
      // sort by counts
      sortByCounts();
      numSort.setAttribute("widget_sort-by", "num-up");
    }
    if (widgetSortBy === "num-up") {
      arrow.classList.add("reverse");
      numSort.appendChild(arrow);
      // sort by reverse counts
      sortByCounts();
      typesAllArr.reverse();
      tagsAllArr.reverse();
    }
    var sortBy = function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      data.setAttribute(
        "widget_sort-by",
        this.getAttribute("widget_sort-by")
      );
      populateSelectByWidget();
    };
    var reSte = typesAllArr.indexOf("private");
    if(reSte !== -1) {
      typesAllArr.splice(reSte, 1);
      typesAllArr.unshift("private");
    }
    var reOthr = typesAllArr.indexOf("reblog-other");
    if(reOthr !== -1) {
      typesAllArr.splice(reOthr, 1);
      typesAllArr.unshift("reblog-other");
    }
    var reSelf = typesAllArr.indexOf("reblog-self");
    if(reSelf !== -1) {
      typesAllArr.splice(reSelf, 1);
      typesAllArr.unshift("reblog-self");
    }
    var reOrgi = typesAllArr.indexOf("original");
    if(reOrgi !== -1) {
      typesAllArr.splice(reOrgi, 1);
      typesAllArr.unshift("original");
    }
    // ^ the last shall be first
    var inputFocus = function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      data.setAttribute(
        "widget_first-focus",
        this.id
      );
    };
    var memValue = function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var alreadyHidden = data.classList.contains(
        "some-posts-already-hidden"
      );
      var sb;
      var s;
      if (this.id === "uncheck") {
        s = document.getElementById(
          "select_button"
        );
        sb = s.firstChild;
        sb.innerHTML = this.checked ? "UnSelect" : "Select";
      }
      if (this.id === "show-only") {
        s = document.getElementById(
          "select_button"
        );
        sb = s.firstChild;
        sb.innerHTML = this.checked ?
          (alreadyHidden ? "ShowAll" : "Hide=!X") : "Select";
      }
      if (this.checked) {
        data.classList.add(this.id);
      } else {
        data.classList.remove(this.id);
      }
    };
    var memAndRePopulate = function () {
      var ante = document.getElementById(
        this.getAttribute("anti")
      );
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var href = document.location.href.split(/[\/\?&#=]+/g);
      if (this.checked && ante.checked) {
        ante.checked = false;
      }
      if (this.checked) {
        data.classList.add(this.id);
        data.classList.remove(ante.id);
      } else {
        data.classList.remove(this.id);
        if (ante.checked) {
          data.classList.add(ante.id);
        }
      }
    };
    dateSort.addEventListener("click", sortBy);
    abcSort.addEventListener("click", sortBy);
    numSort.addEventListener("click", sortBy);
    topPart.appendChild(numSort);
    topPart.appendChild(abcSort);
    topPart.appendChild(dateSort);
    topPart.appendChild(redSort);
    widget.appendChild(topPart);
    var scrollingPart = document.createElement("div");
    scrollingPart.classList.add("overflow-auto");
    scrollingPart.id = "widget_scrolling_part";
    widget.appendChild(scrollingPart);
    // the types / tags rows begin
    var div1 = document.createElement("div");
    div1.classList.add("tags_title");
    div1.appendChild(
      document.createTextNode(
        href[5] === "followers" || href[5] === "follows" || href[5] === "fans"?
        "Blogs By Type" :
        "Posts By Type"
      )
    );
    var wsp = document.getElementById("widget_scrolling_part");
    wsp.appendChild(div1);
    // firstly, add some integral buttons that need to go first
    var ltgtInput = document.createElement("input");
    ltgtInput.addEventListener("focus", inputFocus);
    ltgtInput.id = "hide-ltgt-than-tags";
    ltgtInput.type = "number";
    ltgtInput.addEventListener("change", function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      data.setAttribute("hide-ltgt-than-tags", this.value);
      var gtl = document.getElementById("gt_input");
      var ltl = document.getElementById("lt_input");
    });
    ltgtInput.value = parseFloat(data.getAttribute("hide-ltgt-than-tags"));
    var lt = document.createElement("input");
    lt.type = "checkbox";
    lt.id = "lt_input";
    lt.setAttribute("anti", "gt_input");
    var ltlabel = document.createElement("label");
    ltlabel.setAttribute("for", "lt_input");
    ltlabel.appendChild(document.createTextNode("Less Than"));
    var gt = document.createElement("input");
    gt.type = "checkbox";
    gt.id = "gt_input";
    gt.setAttribute("anti", "lt_input");
    var gtlabel = document.createElement("label");
    gtlabel.setAttribute("for", "gt_input");
    gtlabel.appendChild(document.createTextNode("More Than"));
    lt.checked = data.classList.contains("lt_input");
    gt.checked = data.classList.contains("gt_input");
    var hider = butt("Hide");
    hider.setAttribute("title", "Hide/Show");
    hider.addEventListener("click", function () {
      populateSelectByWidget();
    });
    var acheck = butt("Clear");
    acheck.firstChild.innerHTML = "UnCheck";
    acheck.setAttribute("title", "Uncheck All");
    acheck.addEventListener("click", function () {
      var ch = new CustomEvent("change");
      var wgt = document.getElementById("select-by_widget");
      var check = wgt.getElementsByTagName("input");
      for (var i = 0; i < check.length; i++) {
        if (
          check[i].getAttribute("type") === "checkbox" &&
          check[i].checked
        ) {
          check[i].checked = false;
          check[i].dispatchEvent(ch);
        } //else {
          //TODO ??
        //}
      }
      populateSelectByWidget();
    });
    var ltgtContainer = document.createElement("div");
    ltgtContainer.setAttribute(
      "title",
      "Hide tags that occur less than: X#"
    );
    gt.addEventListener("change", memAndRePopulate);
    lt.addEventListener("change", memAndRePopulate);
    ltgtContainer.appendChild(lt);
    ltgtContainer.appendChild(ltlabel);
    ltgtContainer.appendChild(gt);
    ltgtContainer.appendChild(gtlabel);
    ltgtContainer.appendChild(ltgtInput);
    ltgtContainer.classList.add("select-by_ltgt");
    ltgtContainer.appendChild(ltgtInput);
    ltgtContainer.appendChild(hider);
    widget.appendChild(ltgtContainer);
    // append rows for types
    var count;
    var countOver = document.getElementById("hide-ltgt-than-tags").value;
    // this boolean says to check post counts, to hide
    var lti = document.getElementById("lt_input");
    var gti = document.getElementById("gt_input");
    var postTypeTagHiddenCount = 0;
    var alreadyHidden = data.classList.contains(
      "some-posts-already-hidden"
    );
    var visibleIdsAllArr = JSON.parse(
      data.getAttribute("data-visible_ids_all_arr")
    );
    // start the types with note count rows
    var ltrow = widgetRow(
      "notes-less-than", "0", 1, svgForType.notes.cloneNode(true)
    );
    ltrow.getElementsByClassName("input_not")[0].disabled = true;
    ltrow.getElementsByClassName("not")[0].classList.add("disabled");
    var gtrow = widgetRow(
      "notes-more-than", "0", 1, svgForType.notes.cloneNode(true)
    );
    gtrow.getElementsByClassName("input_not")[0].disabled = true;
    gtrow.getElementsByClassName("not")[0].classList.add("disabled");
    var ltnumber = document.createElement("input");
    ltnumber.type = "number";
    // input focus, remembers focus, for constant DOM rebuild
    ltnumber.addEventListener("focus", inputFocus);
    var gtnumber = document.createElement("input");
    gtnumber.addEventListener("focus", inputFocus);
    gtnumber.type = "number";
    ltnumber.classList.add("number-input");
    gtnumber.classList.add("number-input");
    ltnumber.setAttribute("data-operator", "lt");
    gtnumber.setAttribute("data-operator", "gt");
    ltnumber.value = parseFloat(
      data.getAttribute("select-by-note_lt")
    );
    gtnumber.value = parseFloat(
      data.getAttribute("select-by-note_gt")
    );
    ltnumber.addEventListener("input", notesLtGt);
    gtnumber.addEventListener("input", notesLtGt);
    var quickInput = new CustomEvent("input");
    ltnumber.id = "select-by-notes_less-than";
    gtnumber.id = "select-by-notes_more-than";
    ltrow.append(ltnumber);
    gtrow.append(gtnumber);
    if (href[5] !== "follows" && href[5] !== "followers") {
      wsp.appendChild(ltrow);
      wsp.appendChild(gtrow);
    }
    // this func just counts the posts w/ note counts
    if(
      document.getElementById(
        "select-by-notes_less-than"
      ) !== null &&
      document.getElementById(
        "select-by-notes_more-than"
      ) !== null
    ) {
      document.getElementById(
        "select-by-notes_less-than"
      ).dispatchEvent(quickInput);
      document.getElementById(
        "select-by-notes_more-than"
      ).dispatchEvent(quickInput);
    }
    var div2 = document.createElement("div");
    div2.classList.add("tags_title");
    var newCount;
    var id;
    var l;
    for (var i = 0; i < typesAllArr.length; i++) {
      type = typesAllArr[i];
      if (type === "notes-more-than" || type === "notes-less-than") {
        continue;
      }
      count = typeToIds[type].length;
      if (alreadyHidden) {
        newCount = 0;
        // also do this for tags scroll below,
        // make sure id is visible
        for(l = 0; l < typeToIds[type].length; l++) {
          id = typeToIds[type][l];
          if (visibleIdsAllArr.indexOf(id) !== -1) {
            newCount++;
          }
        }
        // hide counts--; and rows that are invisible
        if(newCount === 0) {
          postTypeTagHiddenCount++;
          continue;
        } else {
          count = newCount;
        }
      }
      // skip if less than tags/type count :)
      if (
        // get both countOvers (type and tag, scroll down :)
        (
          type !== "reblog-self" &&
          type !== "reblog-other"
        ) && (
          (count < countOver && lti.checked) ||
          (count > countOver && gti.checked)
        )
      ) {
        postTypeTagHiddenCount++;
        continue;
      }
      wsp.appendChild(
        widgetRow(
          type, count, 1, svgForType[type].cloneNode(true)
        )
      );
    }
    // types / tags seperator
    div2.appendChild(
      document.createTextNode(
        href[5] === "followers" || href[5] === "follows" ?
        "" :
        "Posts By Tag"
      )
    );
    wsp.appendChild(div2);
    // append rows for tags
    for (i = 0; i < tagsAllArr.length; i++) {
      tag = tagsAllArr[i];
      count = tagToIds[tag].length;
      if (alreadyHidden) {
        newCount = 0;
        // also do this for types up above
        for(l = 0; l < tagToIds[tag].length; l++) {
          id = tagToIds[tag][l];
          if (visibleIdsAllArr.indexOf(id) !== -1) {
            newCount++;
          }
        }
        // hide counts--; and rows that are invisible (AGAIN)
        if(newCount === 0) {
          postTypeTagHiddenCount++;
          continue;
        } else {
          count = newCount;
        }
      }
      // skip if tags amount to lessThan / moreThan
      if (
        // get both countOvers (scroll up :)
        (count < countOver && lti.checked) ||
        (count > countOver && gti.checked)
      ) {
        postTypeTagHiddenCount++;
        continue;
      }
      wsp.appendChild(
        widgetRow(
          tag, count, 0, svgForType.tag.cloneNode(true)
        )
      );
    }
    // finish with the tags, show hidden count in top
    var wigTB = document.getElementById("widget-top-buttons");
    var redTB = wigTB.getElementsByClassName("red")[0];
    if (postTypeTagHiddenCount !== 0) {
      redTB.innerHTML = postTypeTagHiddenCount + " rows hidden";
    } else {
      wigTB.removeChild(redTB);
    }
    var re = butt("List");
    re.setAttribute("title", "Refresh Tags/Type List...");
    re.firstChild.innerHTML = "Refresh";
    re.addEventListener("click", function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var wsp = document.getElementById("widget_scrolling_part");
      data.setAttribute("widget_scroll-top", wsp.scrollTop);
      // refresh the tag select by widget
      document.getElementById("lt_input").checked = false;
      document.getElementById("gt_input").checked = false;
      data.classList.remove("lt_input");
      data.classList.remove("gt_input");
      populateSelectByWidget();
    });
    var cancel = butt("Cancel1");
    cancel.firstChild.innerHTML = "&#x274C;";
    cancel.setAttribute("title", "Cancel and Close Widget...");
    cancel.addEventListener("click", function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var pick = document.getElementsByClassName("picked");
      while (pick.length > 0) {
        pick[0].classList.remove("picked");
      }
      var wsp = document.getElementById("widget_scrolling_part");
      data.setAttribute("widget_scroll-top", wsp.scrollTop);
      document.getElementById("select-by").checked = false;
    });
    var needle = parseFloat(
      data.getAttribute("data-select-by_needle")
    );
    var selecto = butt("Select"); // this is the select-by/show-by button
    if (data.classList.contains("show-only")) {
      selecto.firstChild.innerHTML = (alreadyHidden ? "ShowAll" : "Hide=!X");
    } else if (
      needle > 0 &&
      !data.classList.contains("uncheck")
    ) {
      selecto.firstChild.innerHTML = "100more";
    }
    // "select by tag" "select by type"
    selecto.addEventListener("click", function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var limit = 100; // tumblr limit, for classic mass tag api
      var needle = parseFloat(
        data.getAttribute("data-select-by_needle")
      );
      var s = document.getElementById(
        "select_button"
      );
      var sb = s.firstChild;
      // Mass Post Features v3 by benign-mx (me) Jake Jilg
      // oh wait. I don't need this^ anymore... :) sorry...
      precountTheSelection();
      // continued from this^ function @ var precountTheSelection
      var toSelect = JSON.parse(
        data.getAttribute("data-to-select")
      );
      var idsAllArr = JSON.parse(
        data.getAttribute("data-ids_all_arr")
      );
      var alreadyHidden = data.classList.contains(
        "some-posts-already-hidden"
      );
      var visibleIdsAllArr = JSON.parse(
        data.getAttribute("data-visible_ids_all_arr")
      );
      var hl;
      var un = data.classList.contains("uncheck");
      var regularSelect = !data.classList.contains("show-only");
      // and finally select some posts
      var i = 0;
      var id;
      var hlBrick;
      hl = document.getElementsByClassName("highlighted");
      var needleBefore = needle;
      var selectedCount = 0;
      if (regularSelect) {
        while (hl.length > 0 && needle !== 0) {
          highlightBrick(hl[0], 0);
        }
        for (i = needle; i < toSelect.length; i++) {
          hlBrick = document.getElementById("post_" + toSelect[i]);
          if (hlBrick !== null) {
            // or deselect if uselect is checked
            if (!un) {
              needle++;
              if (needle > needleBefore + limit) { // stop at 100 select
                break;
              }
            }
            selectedCount++;
            highlightBrick(hlBrick, !un);
          }
        }
        if (selectedCount < limit) {
          needle = 0;
        }
        data.setAttribute("data-select-by_needle", needle);
      } else {
        // but this is the ShowOnly mode thing... :)
        var needRebuild = false;
        var brick;
        if (!alreadyHidden) {
          sb.innerHTML = "ShowAll";
          s.disabled = false;
          data.classList.add(
            "some-posts-already-hidden"
          );
          for (i = 0; i < idsAllArr.length; i++) {
            id = idsAllArr[i];
            brick = document.getElementById("post_" + id);
            if (toSelect.indexOf(id) !== -1){
               visibleIdsAllArr.push(id);
            }// a clone of toSelect,
            // but this staggers back for more after selections :)
            if (
              toSelect.indexOf(id) === -1 &&
              brick !== null
            ) {
              needRebuild = true;
              brick.classList.remove("brick");
              brick.classList.remove("laid");
              brick.classList.remove("highlighted");
              brick.classList.add("display-none");
            } else if (
              toSelect.indexOf(id) !== -1 &&
              brick !== null &&
              brick.classList.contains("display-none")
            ) {
              needRebuild = true;
              brick.classList.add("brick");
              brick.classList.add("laid");
              brick.classList.remove("display-none");
            }
          }
        } else {
          sb.innerHTML = "Hide=!X";
          var dn = document.getElementsByClassName("display-none");
          data.classList.remove(
            "some-posts-already-hidden"
          );
          needRebuild = dn.length > 0;
          while (dn.length > 0) {
            dn[0].classList.add("brick");
            dn[0].classList.add("laid");
            // this goes lass, or else dn[0] becomes undefined :)
            dn[0].classList.remove("display-none");
          }
        }
        if (needRebuild) {
          pluginBuildColumns();
        }
      }
      data.setAttribute(
        "data-visible_ids_all_arr",
        JSON.stringify(visibleIdsAllArr)
      );
      postCountMake();
      populateSelectByWidget();
    });
    cancel.setAttribute("title", "Close Widget");
    selecto.setAttribute("title", "Select or Show");
    widget.appendChild(selecto);
    widget.appendChild(cancel);
    widget.appendChild(acheck);
    widget.appendChild(re);
    var unlabel = document.createElement("label");
    var uncheck = document.createElement("input");
    uncheck.type = "checkbox";
    uncheck.id = "uncheck";
    uncheck.addEventListener("change", memValue);
    if (data.classList.contains("uncheck")) {
      uncheck.checked = true;
    }
    unlabel.setAttribute("for", "uncheck");
    unlabel.appendChild(document.createTextNode("Un"));
    var h1 = document.createElement("div");
    var shoLabel = document.createElement("label");
    var shoInput = document.createElement("input");
    shoInput.id = "show-only";
    shoInput.addEventListener("change", memValue);
    if (data.classList.contains("show-only")) {
      shoInput.checked = true;
    }
    shoInput.type = "checkbox";
    shoLabel.setAttribute("for", "show-only");
    shoLabel.appendChild(document.createTextNode("Show Only"));
    h1.appendChild(shoInput);
    h1.appendChild(shoLabel);
    h1.appendChild(uncheck);
    h1.appendChild(unlabel);
    h1.id = "select-by-widget_title";
    var innerSpan = document.createElement("span");
    innerSpan.appendChild(document.createTextNode("Select"));
    var countSpan = document.createElement("span");
    countSpan.classList.add("preselect-count");
    countSpan.appendChild(document.createTextNode("(x0)"));
    countSpan.setAttribute("title", "Selecting X Many...")
    innerSpan.appendChild(countSpan);
    h1.appendChild(innerSpan);
    // refocus number inputs
    var ff = document.getElementById(widgetFirstFocus);
    ff.focus();
    // all elements added, go back down/up scrollTop
    wsp.scrollTo(
      0,
      parseFloat(
        data.getAttribute("widget_scroll-top")
      )
    );
    // lastly, the title element textNode
    widget.appendChild(h1);
    precountTheSelection();
  }; // end var populateSelectByWidget

  // this had an alert(); yucky
  document.getElementById("unselect").
  parentNode.setAttribute(
    "onclick",
    (function () {
      var hl = document.getElementsByClassName("highlighted");
      while(hl.length > 0) {
        hl[0].classList.add("prevent-anim");
        hl[0].classList.remove("edit-reblog-queue");
        hl[0].classList.remove("highlighted");
      }
      window.postCountMake();
      return false;
    }).toString().slice(13,-1)
  );
  // end alert fix

  // this had escaped%20spaces in the tags eww!
  document.getElementById(
    "tags_loading"
  ).parentNode.removeChild(
    document.getElementById(
      "tags_loading"
    )
  );
  document.getElementById("remove_tags").
  parentNode.setAttribute(
    "onclick",
    (function () {
      window.just_clicked_remove_tags = !0;
      var hl = document.getElementsByClassName("highlighted");
      if (hl.length === 0) {
        document.getElementById(
          "no_tags_message"
        ).style.display = "block";
        document.getElementById(
          "remove_tag_button"
        ).style.display = "none";
      } else {
        document.getElementById(
          "remove_tag_button"
        ).style.display = "block";
        document.getElementById(
          "no_tags_message"
        ).style.display = "none";
      }
      document.getElementById(
        "remove_tags_widget"
      ).style.display = "block";
      return false;
    }).toString().slice(13,-1)
  );
  // end escape fix up in

  // these functions are only in plugin scope

  // API...? Where we are going, we won't need API :)
  var getResponseText = function (url, read, header) {
    var post = undefined;
    if (typeof url === "object") {
      post = url.post;
      url = url.url;
      // this ^ twist, maybe not elegant?
    }
    var get = "GET";
    if (// special URLs, make POST
      "/svc/secure_form_key" === url ||
      "/svc/post/update" === url.split(/\?/)[0] ||
      "/svc/post/upload_photo" === url.split(/\?/)[0] ||
      "/svc/post/upload_text_image" === url.split(/\?/)[0] ||
      "customize_api" === url.split("/")[1] &&
      typeof post !== "undefined"
    ) {
      get = "POST";
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (
        this.readyState == 4 && this.status == 200 &&
        typeof this.responseText !== "undefined"
      ) {
        read(
          "/svc/secure_form_key" === url ?
          { // we need the puppies, to make a new post
            puppies: this.getResponseHeader("x-tumblr-secure-form-key"),
            kittens: /* this.getAllResponseHeaders() */ 0
          } :// Idk what kittens is, but it happens after success
              this.responseText
        );
      }
      if (this.readyState == 4 && this.status != 200) {
        if (typeof responseText !== "undefined") {
          read("{\"response\":{\"is_friend\":false}}");
        } else {
          read(400);
        }
      }
    };
    xhttp.open(get, url, true);
    xhttp.onerror = function(){
      read(400);
    };
    // headers only after open and only before send
     if(typeof header !== "undefined") {
      for(var i = 0; i < header.length; i++) {
         xhttp.setRequestHeader(header[i][0], header[i][1]);
      }
    }
    if (get === "GET") {
      xhttp.send();
    } else {
      xhttp.send(post);
    }
  };

  // add a bouncey reblog or heart
  var reblogAnimation = function(id) {
    var cb = document.getElementById("post_" + id);
    var bigReblog = svgForType["reblog-self"].cloneNode(true);
    bigReblog.setAttribute("fill", "#7EFF29");
    bigReblog.setAttribute("width", "125");
    bigReblog.setAttribute("height", "125");
    bigReblog.classList.add("big-reblog");
    bigReblog.addEventListener("mousedown", function(){
      this.parentNode.removeChild(this);
    });
    setTimeout(function(){
      bigReblog.parentNode.removeChild(bigReblog);
    }, 1700);
    cb.appendChild(bigReblog);
  }
  // a bouncey horsey ^

  // this v creates a post template with selected blogs
  var blogDropping = false;
  var newPostNameDrop = function() {
    if (blogDropping) {
      return;
    }
    blogDropping = true;
    var highlighted = document.getElementsByClassName("highlighted");
    var portraits = document.createElement("canvas");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var pCtx = portraits.getContext("2d");
    var img;
    var l = 0;
    var t = 0;
    var w = 5;
    var d;
    portraits.width = w * 128;
    portraits.height = Math.ceil(highlighted.length / w) * 128;
    var blogList = [];
    for (var i = 0; i < highlighted.length; i++) {
      img = highlighted[i].getElementsByClassName("follower-avatar")[0];
      blogList.push(highlighted[i].getAttribute("data-name"));
      ctx.drawImage(img, 0, 0);
      pCtx.drawImage(canvas, l * 128, t * 128);
      l++;
      if (l >= w) {
        l = 0;
        t++;
      }
    }
    portraits.toBlob(function(blob) {
      var formData = new FormData();
      formData.append("image", blob, "image" + (new Date()).getTime() + ".png");
      var apiKey = data.getAttribute("data-x-tumblr-form-key");
      getResponseText(
        {url: "/svc/post/upload_text_image?post_id=undefined&channel=" + name, post: formData},
        function(re){
          api = JSON.parse(re);
          var img = new Image();
          var rawWidth = portraits.width;
          var rawHeight = portraits.height;
          if (
            typeof api !== "undefined" &&
            typeof api[0] !== "undefined" &&
            typeof api[0].url !== "undefined"
          ) {
            img.src = api[0].url;
            rawWidth = api[0].raw_width;
            rawHeight = api[0].raw_height;
          } else {
            img.src = portraits.toDataURL();
          }// whether we get the URL or not, the show must go on
          var mediaHolder = document.createElement("div");
          mediaHolder.classList.add("media-holder");
          mediaHolder.classList.add("media-holder-draggable");
          mediaHolder.classList.add("media-holder-figure");
          mediaHolder.setAttribute("contenteditable", "false");
          mediaHolder.setAttribute("draggable", "true");
          mediaHolder.style.display = "block";
          var mediaFigure = document.createElement("figure");
          mediaFigure.setAttribute("data-orig-width", rawWidth);
          mediaFigure.setAttribute("data-orig-height", rawHeight);
          img.setAttribute("data-orig-width", rawWidth);
          img.setAttribute("data-orig-height", rawHeight);
          var mediaRemove = document.createElement("div");
          mediaRemove.classList.add("media-button");
          mediaRemove.classList.add("icon_close");
          mediaRemove.classList.add("media-killer");
          mediaFigure.appendChild(img);
          mediaHolder.appendChild(mediaFigure);
          mediaHolder.appendChild(mediaRemove);
          var iframe2 = document.createElement("iframe");
          iframe2.id = "neue_post_form-iframe";
          iframe2.addEventListener("load", function () {
            blogDropping = false;
            var posterPending = true;
            var titlePending = true;
            // this checks if done editing/closed
            var reminisce2 = setInterval(function () {
              var w = document.getElementById(
                "neue_post_form-iframe"
              ).contentWindow;
              var p = w.document.getElementsByClassName(
                "post-forms-modal"
              )[0];
              var span;
              var ul;
              var br;
              var a;
              var editor = w.document.getElementsByClassName("editor-richtext");
              var title = w.document.getElementsByClassName("editor-plaintext");
              if (editor.length > 0 && posterPending) {
                span = document.createElement("p"); // it was going to be a span
                span.appendChild(
                   document.createTextNode(
                     "I want to give a shout out to these awesome blags!"
                   )
                );
                ul = document.createElement("p"); // and a ul, but the links
                for (var i = 0; i < blogList.length; i++) {
                  br = document.createElement("br");
                  ul.appendChild(
                    document.createTextNode(
                      " @" + blogList[i] + " "
                    )
                  );
                  ul.appendChild(br); // didn't refer popovers for some reason
                }
                posterPending = false;
                editor[0].appendChild(span);
                editor[0].appendChild(mediaHolder);
                editor[0].appendChild(ul);
                editor[0].focus();
                editor[0].dispatchEvent(new Event("input"));
              }
              if (editor.length > 0 && titlePending) {
                titlePending = false;
                span = document.createElement("span");
                span.appendChild(
                   document.createTextNode(
                     "Blog Name Drop"
                   )
                );
                title[0].appendChild(span);
              }
              if (
                typeof p === "undefined" ||
                typeof p !== "undefined" &&
                p.length === 0 ||
                typeof p !== "undefined" &&
                (
                  w.getComputedStyle(p).
                  getPropertyValue("display") === "none" ||
                  w.getComputedStyle(p).
                  getPropertyValue("opacity").toString() === "0"
                )
              ) {
                clearInterval(reminisce2);
                document.body.removeChild(
                  document.getElementById("neue_post_form-iframe")
                );
              }
            }, 500);
          });
          iframe2.src = "https://www.tumblr.com/neue_web/iframe/blog/" +
            name + "/new/text";
          iframe2.setAttribute("scrolling", "no");
          iframe2.setAttribute("frameborder", "0");
          iframe2.setAttribute("title", "Post forms");
          document.body.appendChild(iframe2);
        },
        [
          ["X-tumblr-form-key", apiKey],
          ["X-Requested-With", "XMLHttpRequest"]
        ]
      )
    });
  };
  // this ^ creates a post template with selected blogs

  // this function follows and unfollows
  var followOrUnFollow = function(liked, info, button, repeat) {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    var apiKey = data.getAttribute("data-x-tumblr-form-key");
    var v2url = liked ?
        "/svc/unfollow" : "/svc/follow";
    var xhttp = new XMLHttpRequest();
    var whiteHeart;
    xhttp.onreadystatechange = function () {
      var href = document.location.href.split(/[\/\?&#=]+/g);
      if (this.readyState == 4 && this.status == 200) {
        data.setAttribute(
          "data-unstable-next-href",
          parseInt(
            data.getAttribute("data-unstable-next-href")
          ) + (liked ? -1 : 1)
        );
        button.innerHTML = "";
        var cb = document.getElementById(
          "post_" + button.getAttribute("data-id")
        );
        if (liked) {
          if (button.classList.contains("return-to-secondary")) {
            whiteHeart = svgForType.secondary.cloneNode(true);
            whiteHeart.setAttribute("fill", "#fff");
            button.setAttribute(
              "title",
              "UnFollowed Secondary. " +
              "It will be gone after you leave."
            );
          } else {
            whiteHeart = svgForType.notes.cloneNode(true);
            whiteHeart.setAttribute("fill", "#fff");
            button.setAttribute(
              "title",
              href[5] === "follows" ?
              "You no longer follow this blog." +
              "It will be gone after you leave." :
              "Click to Follow this Follower back :)"
            );
          }
          button.classList.remove("liked");
          button.classList.add("not-liked");
          cb.classList.remove("fellow");
          idToTypes[
            button.getAttribute("data-id")
          ] = "friendly";
          typeToIds["mutual"].splice(
            typeToIds["mutual"].indexOf(
              button.getAttribute("data-id")
            ), 1
          );
          typeToIds["friendly"].push(button.getAttribute("data-id"));
        } else {
          idToTypes[
            button.getAttribute("data-id")
          ] = "mutual";
          typeToIds["friendly"].splice(
            typeToIds["friendly"].indexOf(
              button.getAttribute("data-id")
            ), 1
          );
          typeToIds["mutual"].push(button.getAttribute("data-id"));
          if (button.classList.contains("return-to-secondary")) {
            whiteHeart = svgForType.secondary.cloneNode(true);
            whiteHeart.setAttribute("fill", "#9af");
            button.setAttribute(
              "title",
              "Secondary Blog:\n" +
              "Only primaries can follow you back." +
              "\n(click to unfollow)"
            );
          } else {
            whiteHeart = svgForType.liked.cloneNode(true);
            whiteHeart.setAttribute("fill", "#56f");
            button.setAttribute("title", "Mutual (Click to UnFollow)");
          }
          button.classList.add("liked");
          button.classList.remove("not-liked");
          // graphical aftertaste for reblog/follow
          var bigHeart = svgForType.liked.cloneNode(true);
          bigHeart.setAttribute("fill", "#56f");
          bigHeart.setAttribute("width", "125");
          bigHeart.setAttribute("height", "125");
          bigHeart.classList.add("big-heart");
          setTimeout(function(){
            bigHeart.parentNode.removeChild(bigHeart);
          }, 1700);
          cb.appendChild(bigHeart);
          button.classList.add("new-liked");
        }// liked means followed here; this saves css space
        button.appendChild(whiteHeart);
        button.classList.remove("clicked");
        var erq = document.getElementsByClassName("edit-reblog-queue");
        if (typeof repeat !== "undefined" && erq.length > 0) {
          erq[erq.length-1].classList.remove("edit-reblog-queue");
          repeat();
        }
        data.setAttribute(
          "data-id_to_types",
          JSON.stringify(idToTypes)
        );
        data.setAttribute(
          "data-type_to_ids",
          JSON.stringify(typeToIds)
        );
      }
    };
    xhttp.open("POST", v2url, true);
    // headers only after open and only before send
    xhttp.setRequestHeader(
      "X-tumblr-form-key", apiKey
    );
    xhttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    xhttp.setRequestHeader(
      "X-Requested-With", "XMLHttpRequest"
    );
    xhttp.send(info);
  };
  var followOrUnfollowSelected = function() {
    var erq = document.getElementsByClassName("edit-reblog-queue");
    var hl = document.getElementsByClassName("highlighted");
    while (erq.length < hl.length) {
      hl[erq.length].classList.add("edit-reblog-queue");
    }
    var repeat = function () {
      var erq = document.getElementsByClassName("edit-reblog-queue");
      var key = erq[erq.length-1].getAttribute("data-follower-key");
      var button = document.getElementById("follow_heart_" + key);
      var info = button.getAttribute("data-like-info");
      var liked = document.getElementById(
        "unfollow_button"
      ).getAttribute("data-follow") !== "true";
      followOrUnFollow(liked, info, button, repeat);
    };
    repeat(); // and follow/unfollow
  };
  // this v runs on a button ^ this runs 1 or many buttons
  var followOrUnFollowButton = function (e) {
    e.cancelBubble = true;
    e.stopPropagation();
    e.preventDefault();
    if (this.classList.contains("clicked")) {
      return;
    }
    this.classList.remove("new-liked");
    this.classList.add("clicked");
    var button = this;
    var liked = this.classList.contains("liked");
    var info = this.getAttribute("data-like-info");
    followOrUnFollow(liked, info, button);
  };
  // fun :)
  var stopToFindMutuals = function (
  me, them, url, key, link3, followerBrick, finished
  ) { // since the following API has no followback property...
    // the followers API has a followback propery tho; I guess
    // it's only because we know they already follow you...
    followerBrick.classList.add("following");
    // also ^ since these are your follows/following
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var tblg = JSON.parse(
      data.getAttribute("data-tumblelogs")
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    if (typeof typeToIds["friendly"] === "undefined") {
      typeToIds["friendly"] = [];
    }
    if (typeof typeToIds["mutual"] === "undefined") {
      typeToIds["mutual"] = [];
    }
    if (typeof typeToIds["secondary"] === "undefined") {
      typeToIds["secondary"] = [];
    }
    var apiKey = data.getAttribute("data-x-tumblr-form-key");
    var primary = data.getAttribute("data-primary-blog");
    getResponseText(
      "/svc/blog/followed_by?tumblelog=" + tblg[me] + "&query=" + them,
      function (re) {
        link3.classList.add("liked");
        // this ^ comes in for all blogs on this page, because we already follow
        var whiteHeart;
        if(re === 400) { // these fill the error console with
          // ajax err messages, but this is the Tumblr server's own
          // throw; I don't know how to stop it... try catch, doesn't
          // work for asynchronous...
          // regardless, it still works :D
          console.log(
            "/svc/blog/followed_by?tumblelog=" + tblg[me] + "&query=" + them +
            "\nSecondary blogs can't follow blogs. Error 400 is thrown when" +
            "\nthose do not exist in the mutual followers database."
          );
          typeToIds["secondary"].push(key);
          idToTypes[key] = "secondary";
          whiteHeart = svgForType.friendly.cloneNode(true);
          whiteHeart.setAttribute("fill", "#9af");
          link3.href = url;
          link3.setAttribute(
            "title",
            "Secondary Blog:\n" +
            "Only primaries can follow you back." +
            "\n(click to unfollow)"
          );
          link3.classList.add("not-liked");
          link3.appendChild(whiteHeart);
          link3.classList.add("return-to-secondary");
          data.setAttribute(
            "data-id_to_types",
            JSON.stringify(idToTypes)
          );
          data.setAttribute(
            "data-type_to_ids",
            JSON.stringify(typeToIds)
          );
          link3.addEventListener("click", followOrUnFollowButton);
          followerBrick.classList.remove("missing-follows-info");
          setTimeout(finished, 40);
          return;
          // I use timeouts to slow it down on the repeat
          // checkIfFollowing seeIfFollowing etc. stuff
          // because when I leave the connection open too long
          // it makes more error 400s which are false errs
          // not to be confused with the true error 400s which
          // come from secondary blogs that can't follow you
        }
        var api = JSON.parse(re);
        if (
          typeof api !== "undefined" &&
          typeof api.response !== "undefined" &&
          typeof api.response.is_friend !== "undefined"
        ) {
          if (
            api.response.is_friend
          ) {
            typeToIds["mutual"].push(key);
            followerBrick.classList.add("mutual");
            idToTypes[key] = "mutual";
            whiteHeart = svgForType.liked.cloneNode(true);
            whiteHeart.setAttribute("fill", "#56f");
            link3.href = url + "#unfollow:" + tblg[me];
            link3.setAttribute(
              "title",
              "Mutual of " + tblg[me] + " and more..."+
              "\n(Click to UnFollow)"
            );
            link3.appendChild(whiteHeart);
            data.setAttribute(
              "data-id_to_types",
              JSON.stringify(idToTypes)
            );
            data.setAttribute(
              "data-type_to_ids",
              JSON.stringify(typeToIds)
            );
            link3.addEventListener("click", followOrUnFollowButton);
            followerBrick.classList.remove("missing-follows-info");
            setTimeout(finished, 40);
            // mutual doesn't need to be retested again...
            // a friend is a friend, if they follow any
            // of your blogs
            return;
          } else {
            // not a 2ndary, but not a follower
            // see if following other blogs instead...?
            if (me >= tblg.length - 1) {
              // not following anyone; df just a friendly
              typeToIds["friendly"].push(key);
              idToTypes[key] = "friendly";
              whiteHeart = svgForType.liked.cloneNode(true);
              whiteHeart.setAttribute("fill", "#56f");
              link3.href = url + "#unfollow:" + them;
              link3.setAttribute("title", "Click to UnFollow");
              // these will all be unfollow buttons, because
              // we are following everybody on this page
              link3.classList.add("not-liked");
              link3.appendChild(whiteHeart);
              data.setAttribute(
                "data-id_to_types",
                JSON.stringify(idToTypes)
              );
              data.setAttribute(
                "data-type_to_ids",
                JSON.stringify(typeToIds)
              );
              link3.addEventListener("click", followOrUnFollowButton);
              followerBrick.classList.remove("missing-follows-info");
              setTimeout(finished, 40);
            } else {
              // we have more blogs to check
              setTimeout(
                function () {
                  stopToFindMutuals(
                    (me + 1), them, url, key, link3, followerBrick, finished
                  );
                }, 40
              );
            }
          }
        }
      }
    );
  };
  // this ^ checks if blogs you follow, follow back

  // this v makes the snapshot saves to a theme page
  var makeSnap = function (cat) {
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var fblg = JSON.parse(
      data.getAttribute("data-follow-blogs-all")
    );
    var mblg = JSON.parse(
      data.getAttribute("data-missing-blogs-all")
    );
    var nblg = JSON.parse(
      data.getAttribute("data-new-blogs-all")
    );
    var fblgTimestamp = JSON.parse(
      data.getAttribute("data-follow-blogs-all-updated")
    );
    var mblgTimestamp = JSON.parse(
      data.getAttribute("data-missing-blogs-all-updated")
    );
    var nblgTimestamp = JSON.parse(
      data.getAttribute("data-new-blogs-all-updated")
    );
    if (nblgTimestamp === 0) {
      nblgTimestamp = (new Date()).getTime();
    }
    if (mblgTimestamp === 0) {
      mblgTimestamp = (new Date()).getTime();
    }
    if (fblgTimestamp === 0) {
      fblgTimestamp = (new Date()).getTime();
    }
    var body = {
      "missing": mblg,
      "new": nblg,
      "all": fblg,
      "all-ch" : fblgTimestamp, // followers
      "new-ch" : nblgTimestamp, // new followers
      "missing-ch" : mblgTimestamp // missing followers
    };
    getResponseText( // this is SnapShot thing step #1
      "/customize/" + href[4],
      function(re2) {
        var div = document.createElement("div");
        div.innerHTML = re2. // parse the dom
        replace(/<(\/?)script[^>]*>/g, "<$1flurb>"). // no eval
        replace(/<img/g,"<space"); // do not onload img tags
        var flurb = div.getElementsByTagName("flurb");
        var userFormKey = false;
        var secureFormKey = false;
        var i;
        var reg1 = /Tumblr._init.user_form_key\s?=\s?['"]([^'"]+)['"]/;
        var reg2 = /Tumblr._init.secure_form_key\s?=\s?['"]([^'"]+)['"]/;
        for (i = 0; i < flurb.length; i++) {
          if (flurb[i].innerHTML.match(reg1) !== null) {
            userFormKey = flurb[i].innerHTML.match(reg1)[1];
          }
          if (flurb[i].innerHTML.match(reg2) !== null) {
            secureFormKey = flurb[i].innerHTML.match(reg2)[1];
          }
        }
        if (secureFormKey === false || userFormKey === false) {
          return;
        }
        var dogTreat = {
          "type": "custom_layout",
          "request_uri": "/mass-post-editor-snapshot-" + cat + "-data",
          "native_uri": false,
          "label": "",
          "show_link": false,
          "title": "",
          "body": JSON.stringify(body),
          "redirect_to": "",
          "user_form_key": userFormKey, // kittens
          "secure_form_key": secureFormKey // puppies
        };
        getResponseText(
          { // this is SnapShot thing step #2
            url: "/customize_api/blog/" + href[4] + "/pages",
            post: JSON.stringify(dogTreat)
          },
          function(re3) {
            // success
          },
          [ // the prev request brought us some puppies :)
            ["X-Requested-With", "XMLHttpRequest"],
            ["Content-Type", "application/json"],
            ["Accept", "application/json, text/javascript, */*; q=0.01"]
          ]
        );
      },
      [
        ["X-Requested-With", "XMLHttpRequest"]
      ]
    );
  };
  // this ^ makes a snapshot

  // this v reads the snapshot saves of a theme page
  var readSnap = function (cat, old) {
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var fblg = JSON.parse(
      data.getAttribute("data-follow-blogs-all")
    );
    var mblg = JSON.parse(
      data.getAttribute("data-missing-blogs-all")
    );
    var nblg = JSON.parse(
      data.getAttribute("data-new-blogs-all")
    );
    var fblgTimestamp = JSON.parse(
      data.getAttribute("data-follow-blogs-all-updated")
    );
    var mblgTimestamp = JSON.parse(
      data.getAttribute("data-missing-blogs-all-updated")
    );
    var nblgTimestamp = JSON.parse(
      data.getAttribute("data-new-blogs-all-updated")
    );
    var snapBody = document.getElementById("snapshot-info_body");
    var bodyNew = {
      "missing": mblg,
      "new": nblg,
      "all": fblg,
      "all-ch" : fblgTimestamp, // followers
      "new-ch" : nblgTimestamp, // new followers
      "missing-ch" : mblgTimestamp // missing followers
    };
    getResponseText(
      {
        url: "/customize_api/blog/" + href[4] + "/pages",
        post:
          "method=read&uri=/mass-post-editor-snapshot-" +
          cat + "-data"
      },
      function (re) {
        if (re === 400) {
          var h2 = document.createElement("h2");
          h2.appendChild(
            document.createTextNode(
              "There is no recorded snapshot prior, " +
              "but one was just now made for future."
            )
          );
          snapBody.appendChild(h2);
          // normally data changes would go here,
          // but there is no old data to compare to
          if (!old) {
            makeSnap(cat);
          }
          // ^ blank new snapshot
        } else if (typeof re === "string") {
          var bodyOld = JSON.parse(JSON.parse(re).body);
          // 1 parse for object, +1 parse for its property
          var i;
          var blog;
          if (!old) {
            // first find new followers
            for (i = 0; i < bodyNew.all.length; i++) {
              blog = bodyNew.all[i];
              if (bodyOld.all.indexOf(blog) === -1) {
                bodyNew.new.push(blog);
              }
            }
            // then find missing followers
            for (i = 0; i < bodyOld.all.length; i++) {
              blog = bodyOld.all[i];
              if (bodyNew.all.indexOf(blog) === -1) {
                bodyNew.missing.push(blog);
              }
            }
            // now mind the new timestamps if any
            if (bodyNew.new.length > 0) {
              nblgTimestamp = (new Date).getTime(); // new
              fblgTimestamp = (new Date).getTime(); // all
            }
            if (bodyNew.missing.length > 0) {
              mblgTimestamp = (new Date).getTime(); // missing
              fblgTimestamp = (new Date).getTime(); // all
            }
          // tally the old with the new for record purposes
            for (i = 0; i < bodyNew.new.length; i++) {
              blog = bodyNew.new[i];
              if (bodyOld.new.indexOf(blog) === -1) {
                bodyOld.new.push(blog);
              }
            }
            for (i = 0; i < bodyNew.missing.length; i++) {
              blog = bodyNew.missing[i];
              if (bodyOld.missing.indexOf(blog) === -1) {
                bodyOld.missing.push(blog);
              }
            }
          }
          // sit down and show the results
          var snapCell1 = document.createElement("div");
          var snapCell2 = document.createElement("div");
          snapCell1.id = "missing-blogs";
          snapCell2.id = "new-blogs";
          var title1 = document.createElement("h2");
          var title2 = document.createElement("h2");
          title1.appendChild(
            document.createTextNode(
              "Missing Blogs"
            )
          );
          title2.appendChild(
            document.createTextNode(
              "New Blogs"
            )
          );
          snapBody.appendChild(title1);
          snapBody.appendChild(title2);
          // I'm running out of dexterity for making variable names
          var toTheBuns = function () {
            data.setAttribute(
              this.getAttribute("data-representing"),
              JSON.stringify([]) // this clears only
            );
            var a = document.getElementById(
              this.getAttribute("data-links-id")
            ).children;
            while (a.length > 0) {
              a[0].parentNode.removeChild(a[0]);
            }
            // "this parent node remove child this" :)
            this.parentNode.removeChild(this);
            // ^ what I said to my parents when I realized the
            // meaning of life is only a constructed meaning....
            makeSnap(cat);
          };
          var a;
          var leftBuns = butt("Forget1");
          leftBuns.setAttribute(
            "title",
            "Forget/Clear missing blogs from database."
          );
          leftBuns.setAttribute(
            "data-representing",
            "data-missing-blogs-all"
          );
          leftBuns.setAttribute(
            "data-links-id",
            "missing-blogs"
          );
          leftBuns.addEventListener("click", toTheBuns);
          var rightBuns = butt("Forget2");
          rightBuns.setAttribute(
            "title",
            "Forget/Clear new blogs from database."
          );
          rightBuns.setAttribute(
            "data-representing",
            "data-new-blogs-all"
          );
          rightBuns.setAttribute(
            "data-links-id",
            "new-blogs"
          );
          rightBuns.addEventListener("click", toTheBuns);
          for (i = 0; i < bodyOld.new.length; i++) {
            a = document.createElement("a");
            a.href = "https://www.tumblr.com/dashboard/blog/" + bodyOld.new[i];
            a.appendChild(
              document.createTextNode(
                bodyOld.new[i]
              )
            );
            a.target = "_blank";
            a.setAttribute(
              "title",
              bodyOld.new[i] + " is a new blag :)"
            );
            snapCell2.appendChild(a);
          }
          for (i = 0; i < bodyOld.missing.length; i++) {
            a = document.createElement("a");
            a.href = "https://" + bodyOld.missing[i] + ".tumblr.com/";
            a.appendChild(
              document.createTextNode(
                bodyOld.missing[i]
              )
            );
            a.target = "_blank";
            a.setAttribute(
              "title",
              bodyOld.missing[i] + " is missing, but mayhaps changed their name"
            );
            snapCell1.appendChild(a);
          }
          snapBody.appendChild(snapCell1);
          snapBody.appendChild(snapCell2);
          // but only if there is any news when compared to the past
          if (bodyOld.missing.length > 0 && !old) {
            snapBody.appendChild(leftBuns);
          }
          if (bodyOld.new.length > 0 && !old) {
            snapBody.appendChild(rightBuns);
          }
          if (!old) {
            data.setAttribute(
              "data-follow-blogs-all",
              JSON.stringify(bodyNew.all) // this adds or subtracts
            );
            data.setAttribute(
              "data-new-blogs-all",
              JSON.stringify(bodyOld.new) // this adds only
            );
            data.setAttribute(
              "data-missing-blogs-all",
              JSON.stringify(bodyOld.missing) // this adds only
            );
            data.setAttribute(
              "data-follow-blogs-all-updated",
              JSON.stringify(fblgTimestamp)
            );
            data.setAttribute(
              "data-new-blogs-all-updated",
              JSON.stringify(nblgTimestamp)
            );
            data.setAttribute(
              "data-missing-blogs-all-updated",
              JSON.stringify(mblgTimestamp)
            );
            // all this ^ data
            // goes v into this database
            makeSnap(cat);
          }
        }
      },
      [
        ["Accept", "application/json, text/javascript, */*; q=0.01"],
        ["X-Requested-With", "XMLHttpRequest"],
        ["Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"]
      ]
    );
  };
  // this ^ reads the snapshot saves of a theme page

  // this processes the snapshots
  var snapShotFollowers = function (cat) {
    if (document.getElementsByClassName("im-ready").length === 0) {
      if (document.getElementById("snapshot-info") !== null) {
        document.getElementById(
          "snapshot-info"
        ).parentNode.classList.add("im-ready");
        document.getElementById(
          "snapshot-load-gif"
        ).parentNode.removeChild(
          document.getElementById(
            "snapshot-load-gif"
          )
        );
      }
      document.getElementById("snapshot-info_body").innerHTML = "";
      readSnap(cat, false);
    }
  };
  var snapInfoGo = true;
  // this ^ runs on the follows/followers page only

  // this v also only runs on the follows/followers page
  var loadFollowers = function(nextHref) {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var unstableOffset = data.getAttribute("data-unstable-next-href");
    if (
      href[5] === "follows" &&
      unstableOffset !== "0" &&
      typeof nextHref !== "undefined" &&
      nextHref.match(/offset=\d+/) !== null
    ) {
      nextHref = nextHref.replace(/offset=\d+/, function (m) {
        return "offset=" +
          (
            parseInt(m.replace(/\D+/g,"")) +
          parseInt(unstableOffset)
        );
      });
    }
    if (document.getElementById("followers-css") === null) {
      var flrCss = document.createElement("style");
      flrCss.type = "text/css";
      flrCss.id = "followers-css";
      flrCss.appendChild(
        document.createTextNode(
          (function () {/*
#select-by_widget {
  height: 190px;
}
*/}).toString().slice(16, -3))
      );
      document.head.appendChild(flrCss);
      var npfrag = document.createDocumentFragment();
      npfrag.appendChild(
        svgForType.happy.cloneNode(true)
      );
      npfrag.appendChild(
        document.createTextNode("Name Drop")
      );
      var nameDrop_chrome = newChromeButton("namedrop", npfrag, false);
      nameDrop_chrome.setAttribute(
        "title",
        "Give a shout out to your (selected) closest " +
        "followers, to show your love. <3"
      );
      nameDrop_chrome.
      getElementsByTagName("button")[0].
      addEventListener("click", newPostNameDrop);
      nameDrop_chrome.
      getElementsByTagName("button")[0].
      classList.add("disable-when-none-selected");
      nameDrop_chrome.
      getElementsByTagName("button")[0].disabled = true;
      en.appendChild(nameDrop_chrome);
      var uffrag = document.createDocumentFragment();
      uffrag.appendChild(
        svgForType.sad.cloneNode(true)
      );
      var unfollowSpan = document.createElement("span");
      unfollowSpan.appendChild(
        document.createTextNode("Unfollow")
      );
      uffrag.appendChild(
        unfollowSpan
      );
      var unfollow_chrome = newChromeButton("unfollow", uffrag, false);
      unfollow_chrome.setAttribute(
        "title",
        "Unfollow :("
      );
      unfollow_chrome.
      getElementsByTagName("button")[0].
      addEventListener("click", followOrUnfollowSelected);
      unfollow_chrome.
      getElementsByTagName("button")[0].
      classList.add("disable-when-none-selected");
      unfollow_chrome.
      getElementsByTagName("button")[0].disabled = true;
      en.appendChild(unfollow_chrome);
      var snapshotInfo_frag = document.createDocumentFragment();
      snapshotInfo_frag.appendChild(svgForType.image.cloneNode(true));
      snapshotInfo_frag.appendChild(
        document.createTextNode(
          "Snapshot Info"
        )
      );
      var snapshotInfo_chrome = newChromeButton(
        "snapshot-info", snapshotInfo_frag, true
      );
      var snapshotInfo_widget = snapshotInfo_chrome.
      getElementsByClassName("widget")[0];
      var snapshotInfo_input = snapshotInfo_chrome.
      getElementsByTagName("input")[0];
      snapshotInfo_widget.style.top = "50px";
      snapshotInfo_widget.style.right = "90px";
      var snapshotInfo_body = document.createElement("div");
      snapshotInfo_body.id = "snapshot-info_body";
      var snapshot_h2 = document.createElement("h1"); // I changes the nodeName
      snapshot_h2.appendChild(
        document.createTextNode(
          "Snapshot Info"
        )
      );
      var snapShotLoadGif = new Image();
      snapShotLoadGif.src = "https://assets.tumblr.com/images/loading_ddd.gif";
      var snapshotInfo_info = document.createElement("div");
      snapshotInfo_info.id = "snapshot-load-gif";
      snapshot_h2.appendChild(snapShotLoadGif);
      snapshotInfo_body.appendChild(snapshot_h2);
      snapshotInfo_info.appendChild(
        document.createTextNode("loading...")
      );
      snapshotInfo_info.setAttribute(
        "title",
        "This feature is might not be possible for super huge blog lists."
      );
      snapshotInfo_body.appendChild(snapshotInfo_info);
      snapshotInfo_widget.appendChild(snapshotInfo_body);
      snapshotInfo_chrome.setAttribute(
        "title",
        "SnapShot Options"
      );
      en.appendChild(snapshotInfo_chrome);
      readSnap(href[5], true);
    }
    var idsAllArr = JSON.parse(
      data.getAttribute("data-ids_all_arr")
    );
    var typesAllArr = JSON.parse(
      data.getAttribute("data-types_all_arr")
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    var tblg = JSON.parse(
      data.getAttribute("data-tumblelogs")
    );
    var fblg = JSON.parse(
      data.getAttribute("data-follow-blogs-all")
    );
    if (typeof typeToIds["friendly"] === "undefined") {
      typeToIds["friendly"] = [];
    }
    if (typeof typeToIds["mutual"] === "undefined") {
      typeToIds["mutual"] = [];
    }
    if (typeof typeToIds["secondary"] === "undefined") {
      typeToIds["secondary"] = [];
    }
    if (typesAllArr.indexOf("mutual") === -1) {
      typesAllArr.push("mutual");
    }
    if (typesAllArr.indexOf("friendly") === -1) {
      typesAllArr.push("friendly");
    }
    if (
      typesAllArr.indexOf("secondary") === -1 &&
      href[5] === "follows"
    ) {
      typesAllArr.push("secondary");
    }
    var ritpm = document.getElementsByClassName(
      "remove-in-third-party-mode"
    );
    while (ritpm.length > 0) {
      ritpm[0].parentNode.removeChild(ritpm[0]);
    }
    var csrfToken = data.getAttribute("data-csrf-token");
    var token = data.getAttribute("data-api-token");
    var apiKey = data.getAttribute("data-x-tumblr-form-key");
    var hasPrimary = JSON.parse(
      data.getAttribute("data-primary-known")
    );
    var followersLoading = JSON.parse(
      data.getAttribute("data-followers-loading")
    );
    if ( // this was firing twice, because I have to
      // check for two x headers twice...
      followersLoading
    ) {
      return;
    }
    if (token === "0" || !hasPrimary) {
      return;
    }
    data.setAttribute("data-followers-loading", "true");
    var primary = data.getAttribute("data-primary-blog");
    var isFollowersPage = href[5] === "followers";
    var isFollowsPage = href[5] === "follows";
    data.classList.add("fetching-from-tumblr-api");
    var mo = [
      "Jan ", "Feb ", "Mar ", "Apr ",
      "May ", "Jun ", "Jul ", "Aug ",
      "Sep ", "Oct ", "Nov ", "Dec "
    ];
    getResponseText(
      typeof nextHref !== "undefined" ?
      "/api" + nextHref :
      isFollowersPage ?
      "/api/v2/blog/" + name + "/followers?limit=50" :
      isFollowsPage ?
      "/api/v2/blog/" + primary + "/following?limit=5" :
      "/api/v2/blog/" + name + "/following?limit=5"
      ,
      function (re) {
        data.classList.remove("fetching-from-tumblr-api");
        var api = re;
        var ing = isFollowsPage;
        if(
         typeof api === "string"
        ) {
          api = JSON.parse(re);
        }
        if(
          !ing &&
          typeof api !== "undefined" &&
          typeof api.response !== "undefined" &&
          typeof api.response.users !== "undefined" ||
          ing &&
          typeof api !== "undefined" &&
          typeof api.response !== "undefined" &&
          typeof api.response.blogs !== "undefined"
        ) {
          if (!lcontent.classList.contains("albino")) {
            lcontent.classList.add("albino");
          }// this ^ is to clear away the vanilla editor posts,
          // which do not have our extra buttons,
          // but it seems to run on my other things too :/ oops
          if (lcontent.children.length === 0) {
            var followerHeader = document.createElement("div");
            var dt = (new Date());
            followerHeader.id = "who-follows-who";
            dt.setYear(dt.getFullYear() + 1);
            if (isFollowersPage) {
              followerHeader.classList.add("heading");
              followerHeader.appendChild(
                document.createTextNode(
                  "Blogs following your blogs, \u201C" + name + "\u201D"
                )
              );
              followerHeader.setAttribute("data-timestamp", dt.getTime());
              lcontent.appendChild(followerHeader);
            }
            if (!isFollowersPage) {
              followerHeader.classList.add("heading");
              followerHeader.appendChild(
                document.createTextNode(
                  "Blogs followed by your primary, \u201C" + primary + "\u201D"
                )
              );
              followerHeader.setAttribute("data-timestamp", dt.getTime());
              lcontent.appendChild(followerHeader);
            }
          }
          var user = ing ? api.response.blogs : api.response.users;
          var followerBrick;
          var firstChild;
          var cm;
          var nm;
          var nc;
          var tc;
          var middleChild;
          var middleChildT;
          var middleChildTR;
          var middleChildTD;
          var middleChildIB;
          var lastChild;
          var avatar;
          var date;
          var px;
          var b;
          var d;
          var date;
          var jz;
          var dt;
          var nextPage;
          var groupName;
          var group;
          var hding = document.getElementsByClassName("heading");
          var dt1 = new Date();
          var dt2 = new Date();
          var link1;
          var link2;
          var link3;
          var link4;
          var whiteHeart;
          var key;
          var uuid;
          var url;
          var descript;
          var title;
          var theme;
          var cancelProp = function (e){
            e.cancelBubble = true;
            e.stopProgagation();
          };
          for (var i = 0; i < user.length; i++) {
            dt1 = new Date(
              parseInt(hding[hding.length-1].getAttribute("data-timestamp"))
            );
            dt2 = new Date(
              ing ?
              user[i].resources[0].updated * 1000 :
              user[i].blog.updated * 1000
            );
            groupName = dt2.getFullYear() === (new Date()).getFullYear() ?
              "group_" + dt2.getMonth() + "_" + dt2.getFullYear() :
              "group_yesterdays_" + dt2.getFullYear()
            ;
            group = document.getElementsByClassName(groupName);
            followerBrick = document.createElement("a");
            followerBrick.classList.add(groupName);
            if (
              group.length === 0 &&
              (
                dt2.getFullYear() === (new Date()).getFullYear() &&
                (
                  dt2.getMonth() !== dt1.getMonth() ||
                  dt2.getFullYear() !== dt1.getFullYear()
                ) || dt2.getFullYear() !== dt1.getFullYear()
              )
            ) {
              followerHeader = document.createElement("div");
              followerHeader.classList.add("heading");
              followerHeader.appendChild(
                document.createTextNode(
                  dt2.getFullYear() === (new Date()).getFullYear() ?
                  "updated in " + mo[dt2.getMonth()] + dt2.getFullYear() :
                  "updated in " + dt2.getFullYear()
                )
              );
              followerHeader.setAttribute("data-timestamp", dt2.getTime());
              lcontent.appendChild(followerHeader);
            }
            followerBrick.style.width = "125px";
            followerBrick.style.height = "125px";
            followerBrick.classList.add("brick");
            followerBrick.classList.add("follow");
            followerBrick.classList.add("photo");
            followerBrick.addEventListener("click", function (e) {
              e.stopPropagation();
              e.preventDefault();
              e.cancelBubble = true;
              highlightBrick(this, !this.classList.contains("highlighted"));
            });
            key = ing ? user[i].resources[0].key : user[i].blog.key;
            uuid = ing ? user[i].resources[0].uuid : user[i].blog.uuid;
            url = ing ? user[i].resources[0].url : user[i].blog.url;
            title = ing ? user[i].resources[0].title : user[i].blog.title;
            descript = ing ?
			  user[i].resources[0].description : user[i].blog.description;
            theme = ing ? user[i].resources[0].theme : user[i].blog.theme;
            followerBrick.id = "post_" + key;
            followerBrick.setAttribute("target", "_blank");
            followerBrick.setAttribute("data-id", key);
            followerBrick.setAttribute("data-follower-key", key);
            followerBrick.setAttribute("data-follower-uuid", uuid);
            firstChild = document.createElement("div");
            firstChild.classList.add("highlight");
            cm = new Image();
            cm.src = "https://assets.tumblr.com/images/" +
                     "small_white_checkmark.png";
            cm.classList.add("checkmark");
            nm = ing ? user[i].resources[0].name : user[i].name;
            fblg.push(nm); // <= this array is for the snapshot later
            followerBrick.setAttribute("title", nm);
            followerBrick.setAttribute("href", url);
            idsAllArr.push(key);
            firstChild.appendChild(cm);
            tc = document.createElement("div");
            tc.classList.add("tag_count");
            tc.id = "tag_count_" + key;
            tc.appendChild(document.createTextNode(nm));
            firstChild.appendChild(tc);
            nc = document.createElement("div");
            nc.classList.add("note_count");
            firstChild.appendChild(nc);
            followerBrick.appendChild(firstChild);
            // meat & tators middle child (repeat)
            middleChild = document.createElement("div");
            middleChildT = document.createElement("div");
            middleChildTR = document.createElement("div");
            middleChildTD = document.createElement("div");
            middleChildIB = document.createElement("div");
            middleChild.classList.add("overflow-hidden");
            middleChildT.classList.add("links-layer");
            middleChildTR.classList.add("trow");
            middleChildTD.classList.add("tags-layer");
            middleChildIB.classList.add("tag-container");
            middleChildIB.innerHTML = "<h2>" + title + "</h2>" +
                                              descript;
            avatar = new Image();
            avatar.setAttribute("crossorigin", "anonymous");
            avatar.width = 125;
            avatar.height = 125;
            avatar.style.width = avatar.width + "px";
            avatar.style.height = avatar.height + "px";
            followerBrick.setAttribute("data-name", nm);
            avatar.src = "https://api.tumblr.com/v2/blog/" + nm + "/avatar/128";
            avatar.classList.add("follower-avatar");
            // some followers links
            link1 = document.createElement("a");
            link1.setAttribute("target", "_blank");
            link1.classList.add("link-edit");
            link1.href = "/dashboard/blog/" + nm;
            link1.setAttribute("title", "Peepr.");
            link1.appendChild(svgForType.view.cloneNode(true));
            link1.addEventListener("click", cancelProp);
            middleChildTD.appendChild(link1);
            link4= document.createElement("a");
            link4.setAttribute("target", "_blank");
            link4.classList.add("link-reblog");
            link4.href = "/dashboard/blog/" + nm + "#avatar";
            link4.setAttribute("title", "Large Avatar.");
            link4.setAttribute("data-name", nm);
            link4.setAttribute(
              "data-font", theme.title_font
            );
            link4.setAttribute(
              "data-weight", theme.title_font_weight
            );
            link4.setAttribute(
              "data-color", theme.title_color
            );
            link4.setAttribute(
              "data-bg", theme.background_color
            );
            link4.setAttribute(
              "data-title", title
            );
            link4.appendChild(svgForType.see.cloneNode(true));
            link4.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              e.cancelBubble = true;
              var popoverT = document.createElement("div");
              popoverT.addEventListener("click", function() {
                this.parentNode.removeChild(this);
              });
              popoverT.classList.add("follower-pop-t");
              var popoverTR = document.createElement("div");
              popoverTR.classList.add("follower-pop-tr");
              var popoverTD = document.createElement("div");
              popoverTD.classList.add("follower-pop-td");
              var popoverAv = document.createElement("div");
              popoverAv.classList.add("follower-pop-av");
              var popoverInner = document.createElement("div");
              popoverInner.classList.add("follower-pop-inner");
              var popoverImg = new Image();
              popoverImg.classList.add("follower-pop-img");
              popoverImg.src = "https://api.tumblr.com/v2/blog/" +
                               this.getAttribute("data-name") +
                               "/avatar/512";
              var popoverTitle = document.createElement("h1");
              popoverTitle.style.fontFamily = this.getAttribute("data-font");
              popoverTitle.style.color = this.getAttribute("data-color");
              popoverInner.style.backgroundColor = this.getAttribute("data-bg");
              popoverTitle.classList.add("follower-pop-title");
              popoverTitle.innerHTML = this.getAttribute("data-title");
              popoverAv.appendChild(popoverImg);
              popoverInner.appendChild(popoverAv);
              popoverInner.appendChild(popoverTitle);
              popoverTD.appendChild(popoverInner);
              popoverTR.appendChild(popoverTD);
              popoverT.appendChild(popoverTR);
              document.body.appendChild(popoverT);
            });
            // this ^ is neat. I'm proud of this ^ :)
            middleChildTD.appendChild(link4);
            link2 = document.createElement("a");
            link2.setAttribute("target", "_blank");
            link2.classList.add("link-view");
            link2.setAttribute("title", "Visit.");
            link2.appendChild(svgForType.symlink.cloneNode(true));
            link2.addEventListener("click", cancelProp);
            middleChildTD.appendChild(link2);
            link3 = document.createElement("a");
            link3.setAttribute("target", "_blank");
            link3.classList.add("link-like");
            link3.setAttribute("data-id", key);
            link3.setAttribute(
              "data-like-info", "data[tumblelog]=" + nm
            );
            link3.id = "follow_heart_" + key;
            link3.setAttribute("target", "_blank");
            // link3: start of the giant link3 follow button
            if (href[5] === "followers") {
              if (
                typeof user[i].following !== "undefined" &&
                user[i].following
              ) { // this only runs on ?followers...
                // it is absent on the ?follows (api/following)
                followerBrick.classList.add("following");
                // so if you follow, it's auto-mutuals
                typeToIds["mutual"].push(key);
                followerBrick.classList.add("mutual");
                idToTypes[key] = "mutual";
                whiteHeart = svgForType.liked.cloneNode(true);
                whiteHeart.setAttribute("fill", "#56f");
                link3.href = url + "#unfollow:" + nm;
                link3.setAttribute("title", "(Mutual) Click to UnFollow");
                link3.classList.add("liked");
                link3.appendChild(whiteHeart);
              } else if (
                typeof user[i].following !== "undefined" &&
                !user[i].following
              ) {
                typeToIds["friendly"].push(key);
                idToTypes[key] = "friendly";
                followerBrick.classList.add("unfollowed");
                whiteHeart = svgForType.notes.cloneNode(true);
                whiteHeart.setAttribute("fill", "#fff");
                link3.href = url + "#follow:" + nm;
                link3.setAttribute("title", "Click to Follow");
                link3.classList.add("not-liked");
                link3.appendChild(whiteHeart);
              }
              link3.addEventListener("click", followOrUnFollowButton);
            } else {
              followerBrick.classList.add("missing-follows-info");
            }
            // end 1 of link3 ^ giant follow button, but there is more of it
            // to be added below/later for the ?follows api/following part
            // because Tumblr doesn't include a property for follows/mutuals
            middleChildTD.appendChild(link3);
            // end followersBricks links... Woot! finally
            middleChild.appendChild(avatar);
            middleChildTD.appendChild(middleChildIB)
            middleChildTR.appendChild(middleChildTD);
            middleChildT.appendChild(middleChildTR)
            middleChild.appendChild(middleChildT);
            followerBrick.appendChild(middleChild);// < don't forget KEVIN!
            // close off the brick and return below     (home alone)
            lastChild = document.createElement("div");
            lastChild.classList.add("overlay");
            jz = document.createElement("div");
            jz.classList.add("inner");
            dt = document.createElement("div");
            d = new Date(
              ing ?
              user[i].resources[0].updated * 1000 :
              user[i].blog.updated * 1000
            );
            b = d.getDate();
            px = ["th ", "st ", "nd ", "rd ", "th ", "th ",
                      "th ", "th ", "th ", "th ", "th "][b % 10];
            if (b === 12 || b === 11) {
              px = "th ";
            }
            date = [
              "Sun - ", "Mon - ", "Tue - ", "Wed - ",
              "Thu - ", "Fri - ", "Sat - "
            ][d.getDay()] + mo[d.getMonth()] + b + px + d.getFullYear();
            dt.classList.add("date");
            dt.appendChild(document.createTextNode(date));
            jz.appendChild(dt);
            lastChild.appendChild(jz);
            followerBrick.appendChild(lastChild);
            if (group.length > 0) {
              lcontent.insertBefore(
                followerBrick, group[group.length-1].nextSibling
              );
            } else {
              lcontent.appendChild(followerBrick);
            }
          }
          data.setAttribute(
            "data-id_to_types",
            JSON.stringify(idToTypes)
          );
          data.setAttribute(
            "data-type_to_ids",
            JSON.stringify(typeToIds)
          );
          data.setAttribute(
            "data-types_all_arr",
            JSON.stringify(typesAllArr)
          );
          data.setAttribute(
            "data-ids_all_arr",
            JSON.stringify(idsAllArr)
          );
          data.setAttribute(
            "data-follow-blogs-all",
            JSON.stringify(fblg)
          );
          data.setAttribute("data-unstable-next-href", "0");
          pluginBuildColumns();
          nextPage = false; // maybe? find out later...
          data.setAttribute("data-id_to_types", JSON.stringify(idToTypes));
          data.setAttribute("data-type_to_ids", JSON.stringify(typeToIds));
          data.setAttribute("data-types_all_arr", JSON.stringify(typesAllArr));
          var repeatedTimeOut2;
          var nextPageOfFollowers = function() {
            data.setAttribute("data-page-repeat", nextPage); // loop much?
            // this delays pagination slightly, but it may be better...
            // it's steadier, non-bot-ish, and is easier to process :)
            var tagAlongDiff = document.getElementsByClassName("brick").length -
                document.getElementsByClassName("laid").length;
            if(
              document.getElementById(
                "pause_button"
              ).classList.contains("paused") ||
              tagAlongDiff > 10 // < this :)
            ) {// the CSS3 animation thing is also crash prevention :)
              return;
            }
            clearInterval(repeatedTimeOut2);
            data.setAttribute("data-followers-loading", "false");
            loadFollowers(nextPage);
          };
          var pauseBeforeNext = function() {
            // f stands for first followed
            var fBrick = document.getElementsByClassName(
              "missing-follows-info"
            );
            if (
              typeof fBrick !== "undefined" &&
              fBrick.length > 0
            ) {
              var fName = fBrick[0].getAttribute("data-name");
              var fKey = fBrick[0].getAttribute("data-follower-key");
              var fLink3 = document.getElementById(
                "follow_heart_" + fKey
              );
              var fUrl = fBrick[0].getAttribute("href");
              stopToFindMutuals(
                0 /* primary 1st and down the line */,
                fName,
                fUrl,
                fKey,
                fLink3,
                fBrick[0],
                pauseBeforeNext
              );
            } else if (!data.classList.contains("next_page_false")){
              // stop fetching mutual info and goto next page
              repeatedTimeOut2 = setInterval(nextPageOfFollowers, 500);
            }
          };
          if(
            typeof api !== "undefined" &&
            typeof api.response !== "undefined" &&
            typeof api.response._links !== "undefined" &&
            typeof api.response._links.next !== "undefined" &&
            typeof api.response._links.next.href !== "undefined"
          ) {
            nextPage = api.response._links.next.href;
            var fBrick = document.getElementsByClassName(
              "missing-follows-info"
            );
            if (
              (href[5] === "followers") &&
              nextPage !== false &&
              nextPage !== data.getAttribute("data-page-repeat")
            ) {
              // walk, don't run :)
              repeatedTimeOut2 = setInterval(nextPageOfFollowers, 500);
            } else if (
              href[5] === "follows" &&
              nextPage !== false &&
              nextPage !== data.getAttribute("data-page-repeat")
            ) {
              // this is unique, because if we unfollow any blogs
              // during pagination, we must step back the offset,
              // by -1, or else the blogs will be off by 1
              // &&
              // if we re-follow blog during pagination, we must
              // jostle back +1... it's very unstable, but solid
              data.setAttribute(
                "data-id_to_types",
                JSON.stringify(idToTypes)
              );
              data.setAttribute(
                "data-type_to_ids",
                JSON.stringify(typeToIds)
              );
              pauseBeforeNext();
            }
          } else {
            data.classList.add("next_page_false");
            if (
              href[5] === "follows" &&
              typeof fBrick !== "undefined" &&
              fBrick.length > 0
            ) {
              pauseBeforeNext();
            }
            snapShotFollowers(href[5]);
          }
        } else {
          snapShotFollowers(href[5]);
          // this ^ would run on an api fetch with 0 results
          data.classList.add("next_page_false");
          // but so far, that never happens...
        }
      },
      [
        ["Authorization", "Bearer " + token]
      ]
    );
  };
  // load followers ^ followers mode follow mode

  // load fans v
  var loadFans = function (notesList) {
    var firstRun = typeof notesList === "undefined";
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var idsAllArr = JSON.parse(
      data.getAttribute("data-ids_all_arr")
    );
    var typesAllArr = JSON.parse(
      data.getAttribute("data-types_all_arr")
    );
    var typeToIds = JSON.parse(
      data.getAttribute("data-type_to_ids")
    );
    var idToTypes = JSON.parse(
      data.getAttribute("data-id_to_types")
    );
    if (typeof typeToIds["friendly"] === "undefined") {
      typeToIds["friendly"] = [];
    }
    if (typeof typeToIds["mutual"] === "undefined") {
      typeToIds["mutual"] = [];
    }
    if (typeof typeToIds["secondary"] === "undefined") {
      typeToIds["secondary"] = [];
    }
    var token = data.getAttribute("data-api-token");
    getResponseText(
      firstRun?
      "/activity/" + name :
      "/activity/" + notesList.channel + // name
      "/2/" + notesList.first +
      "?last_timestamp=" + notesList.last +
      "&c=" + notesList.c,
      function (re) {
        if (!firstRun) {
          re = JSON.parse(re).html;
        }
        var div = document.createElement("div");
        div.innerHTML = re. // parse the dom
        replace(/<(\/?)script[^>]*>/g, "<$1flurb>"). // no eval
        replace(/<img/g,"<space"); // do not onload img tags
        var flurb = div.getElementsByTagName("flurb");
        var notesListReg = /Tumblr\.NotesList\((\{[\s\S]*?\})\);/;
        var notesList = {}; // reset
        var i;
        for (i = 0; i < flurb.length; i++) {
          if (flurb[i].innerText.match(notesListReg) !== null) {
            eval("notesList = " + flurb[i].innerText.match(notesListReg)[1]);
            // eval('JSON.stringify...')... {bad: 'structure'}...
          }
        }
        var an = div.getElementsByClassName("activity-notification");
        var isFollower = an[0].classList.contains("is_follower");
        var isLike = an[0].classList.contains("is_like");
        var isReblog = an[0].classList.contains("is_reblog");
        var loopFirstBrick = function (an0) {
          var anName = an0.getElementsByClassName(
            "ui_avatar_tumblelog_name"
          )[0].innerText.replace(/\s+/g,"");
          var fanBrick = document.getElementById("post_" + anName);
          if (fanBrick === null) {
            // create fan brick
            getResponseText(
              "/api/v2/blog/" + anName + "/info",
              function (re2) {
                var api = JSON.parse(re2)
                if (
                  typeof api !== "undefined" &&
                  typeof api.response !== "undefined" &&
                  typeof api.response.blog !== "undefined"
                ) {// ...---***---... LOAD FANS ...---***---...
                  // with much casual copy over from load fans
                  if (!lcontent.classList.contains("albino")) {
                    lcontent.classList.add("albino");
                  }
                  if (lcontent.children.length === 0) {
                    var fanHeader = document.createElement("div");
                    var dt = (new Date());
                    fanHeader.id = "who-follows-who";
                    dt.setYear(dt.getFullYear() + 1);
                    fanHeader.classList.add("heading");
                    fanHeader.appendChild(
                      document.createTextNode(
                        "Fans of \u201C" + name + "\u201D"
                      )
                    );
                    fanHeader.setAttribute("data-timestamp", dt.getTime());
                    lcontent.appendChild(fanHeader);
                  }
                  var isFollower = an0.classList.contains("is_follower");
                  var isLike = an0.classList.contains("is_like");
                  var isReblog = an0.classList.contains("is_note");
                  var mo = [
                    "Jan ", "Feb ", "Mar ", "Apr ",
                    "May ", "Jun ", "Jul ", "Aug ",
                    "Sep ", "Oct ", "Nov ", "Dec "
                  ];
                  var hding = document.getElementsByClassName("heading");
                  var blog = api.response.blog;
                  var dt1 = new Date(
                    parseInt(hding[hding.length-1].getAttribute("data-timestamp"))
                  );
                  var dt2 = new Date(blog.updated * 1000);
                  var groupName = dt2.getFullYear() === (new Date()).getFullYear() ?
                      "group_" + dt2.getMonth() + "_" + dt2.getFullYear() :
                  "group_yesterdays_" + dt2.getFullYear()
                  ;
                  var group = document.getElementsByClassName(groupName);
                  var fanBrick = document.createElement("a");
                  fanBrick.classList.add(groupName);
                  if (
                    group.length === 0 &&
                    (
                      dt2.getFullYear() === (new Date()).getFullYear() &&
                      (
                        dt2.getMonth() !== dt1.getMonth() ||
                        dt2.getFullYear() !== dt1.getFullYear()
                      ) || dt2.getFullYear() !== dt1.getFullYear()
                    )
                  ) {
                    var fanHeader = document.createElement("div");
                    fanHeader.classList.add("heading");
                    fanHeader.appendChild(
                      document.createTextNode(
                        dt2.getFullYear() === (new Date()).getFullYear() ?
                        "updated in " + mo[dt2.getMonth()] + dt2.getFullYear() :
                        "updated in " + dt2.getFullYear()
                      )
                    );
                    fanHeader.setAttribute("data-timestamp", dt2.getTime());
                    lcontent.appendChild(fanHeader);
                  }
                  fanBrick.style.width = "125px";
                  fanBrick.style.height = "125px";
                  fanBrick.classList.add("brick");
                  fanBrick.classList.add("follow");
                  fanBrick.classList.add("photo");
                  fanBrick.addEventListener("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.cancelBubble = true;
                    highlightBrick(this, !this.classList.contains("highlighted"));
                  });
                  var nm = blog.name;
                  var key = blog.key;
                  var uuid = blog.uuid;
                  var url = blog.url;
                  var title = blog.title;
                  var descript = blog.description;
                  var theme = blog.theme;
                  fanBrick.id = "post_" + nm;
                  fanBrick.setAttribute("target", "_blank");
                  fanBrick.setAttribute("data-id", nm);
                  fanBrick.setAttribute("data-fan-key", key);
                  fanBrick.setAttribute("data-fan-uuid", uuid);
                  var firstChild = document.createElement("div");
                  firstChild.classList.add("highlight");
                  var cm = new Image();
                  cm.src = "https://assets.tumblr.com/images/" +
                    "small_white_checkmark.png";
                  cm.classList.add("checkmark");
                  fanBrick.setAttribute("title", nm);
                  fanBrick.setAttribute("href", url);
                  idsAllArr.push(key);
                  firstChild.appendChild(cm);
                  var tc = document.createElement("div");
                  tc.classList.add("tag_count");
                  tc.id = "tag_count_" + key;
                  tc.appendChild(document.createTextNode("0 Likes"));
                  firstChild.appendChild(tc);
                  var nc = document.createElement("div");
                  nc.classList.add("note_count");
                  firstChild.appendChild(nc);
                  nc.appendChild(document.createTextNode("0 Reblog"));
                  if (isReblog) {
                    nc.innerText = (parseInt(nc.innerText.replace(/\D+/g,"")) + 1) + " Notes";
                  }
                  if (isLike) {
                    tc.innerText = (parseInt(tc.innerText.replace(/\D+/g,"")) + 1) + " Likes";
                  }
                  fanBrick.appendChild(firstChild);
                  // meat & tators middle child (repeat)
                  var middleChild = document.createElement("div");
                  var middleChildT = document.createElement("div");
                  var middleChildTR = document.createElement("div");
                  var middleChildTD = document.createElement("div");
                  var middleChildIB = document.createElement("div");
                  middleChild.classList.add("overflow-hidden");
                  middleChildT.classList.add("links-layer");
                  middleChildTR.classList.add("trow");
                  middleChildTD.classList.add("tags-layer");
                  middleChildIB.classList.add("tag-container");
                  middleChildIB.innerHTML = "<h2>" + title + "</h2>" +
                    descript;
                  var avatar = new Image();
                  avatar.setAttribute("crossorigin", "anonymous");
                  avatar.width = 125;
                  avatar.height = 125;
                  avatar.style.width = avatar.width + "px";
                  avatar.style.height = avatar.height + "px";
                  fanBrick.setAttribute("data-name", nm);
                  avatar.src = "https://api.tumblr.com/v2/blog/" + nm + "/avatar/128";
                  avatar.classList.add("fan-avatar");
                  // some fans links
                  var cancelProp = function (e){
                    e.cancelBubble = true;
                    e.stopProgagation();
                  };
                  var link1 = document.createElement("a");
                  link1.setAttribute("target", "_blank");
                  link1.classList.add("link-edit");
                  link1.href = "/dashboard/blog/" + nm;
                  link1.setAttribute("title", "Peepr.");
                  link1.appendChild(svgForType.view.cloneNode(true));
                  link1.addEventListener("click", cancelProp);
                  middleChildTD.appendChild(link1);
                  var link4= document.createElement("a");
                  link4.setAttribute("target", "_blank");
                  link4.classList.add("link-reblog");
                  link4.href = "/dashboard/blog/" + nm + "#avatar";
                  link4.setAttribute("title", "Large Avatar.");
                  link4.setAttribute("data-name", nm);
                  link4.setAttribute(
                    "data-font", theme.title_font
                  );
                  link4.setAttribute(
                    "data-weight", theme.title_font_weight
                  );
                  link4.setAttribute(
                    "data-color", theme.title_color
                  );
                  link4.setAttribute(
                    "data-bg", theme.background_color
                  );
                  link4.setAttribute(
                    "data-title", title
                  );
                  link4.appendChild(svgForType.see.cloneNode(true));
                  link4.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    var popoverT = document.createElement("div");
                    popoverT.addEventListener("click", function() {
                      this.parentNode.removeChild(this);
                    });
                    popoverT.classList.add("fan-pop-t");
                    var popoverTR = document.createElement("div");
                    popoverTR.classList.add("fan-pop-tr");
                    var popoverTD = document.createElement("div");
                    popoverTD.classList.add("fan-pop-td");
                    var popoverAv = document.createElement("div");
                    popoverAv.classList.add("fan-pop-av");
                    var popoverInner = document.createElement("div");
                    popoverInner.classList.add("fan-pop-inner");
                    var popoverImg = new Image();
                    popoverImg.classList.add("fan-pop-img");
                    popoverImg.src = "https://api.tumblr.com/v2/blog/" +
                      this.getAttribute("data-name") +
                      "/avatar/512";
                    var popoverTitle = document.createElement("h1");
                    popoverTitle.style.fontFamily = this.getAttribute("data-font");
                    popoverTitle.style.color = this.getAttribute("data-color");
                    popoverInner.style.backgroundColor = this.getAttribute("data-bg");
                    popoverTitle.classList.add("fan-pop-title");
                    popoverTitle.innerHTML = this.getAttribute("data-title");
                    popoverAv.appendChild(popoverImg);
                    popoverInner.appendChild(popoverAv);
                    popoverInner.appendChild(popoverTitle);
                    popoverTD.appendChild(popoverInner);
                    popoverTR.appendChild(popoverTD);
                    popoverT.appendChild(popoverTR);
                    document.body.appendChild(popoverT);
                  });
                  // this ^ is neat. I'm proud of this ^ :)
                  middleChildTD.appendChild(link4);
                  var link2 = document.createElement("a");
                  link2.setAttribute("target", "_blank");
                  link2.classList.add("link-view");
                  link2.setAttribute("title", "Visit.");
                  link2.appendChild(svgForType.symlink.cloneNode(true));
                  link2.addEventListener("click", cancelProp);
                  middleChildTD.appendChild(link2);
                  var link3 = document.createElement("a");
                  link3.setAttribute("target", "_blank");
                  link3.classList.add("link-like");
                  link3.setAttribute("data-id", key);
                  link3.setAttribute(
                    "data-like-info", "data[tumblelog]=" + nm
                  );
                  link3.id = "follow_heart_" + key;
                  link3.setAttribute("target", "_blank");
                  // link3: start of the giant link3 follow button
                  var whiteHeart;
                  if (
                    typeof blog.followed !== "undefined" &&
                    blog.followed
                  ) { // this only runs on ?fans...
                    fanBrick.classList.add("following");
                    // so if you follow, it's auto-mutual
                    typeToIds["mutual"].push(key);
                    fanBrick.classList.add("mutual");
                    idToTypes[key] = "mutual";
                    whiteHeart = svgForType.liked.cloneNode(true);
                    whiteHeart.setAttribute("fill", "#56f");
                    link3.href = url + "#unfollow:" + nm;
                    link3.setAttribute("title", "(Mutual) Click to UnFollow");
                    link3.classList.add("liked");
                    link3.appendChild(whiteHeart);
                  } else if (
                    typeof blog.followed !== "undefined" &&
                    !blog.followed
                  ) {
                    typeToIds["friendly"].push(key);
                    idToTypes[key] = "friendly";
                    fanBrick.classList.add("unfollowed");
                    whiteHeart = svgForType.notes.cloneNode(true);
                    whiteHeart.setAttribute("fill", "#fff");
                    link3.href = url + "#follow:" + nm;
                    link3.setAttribute("title", "Click to Follow");
                    link3.classList.add("not-liked");
                    link3.appendChild(whiteHeart);
                  }
                  link3.addEventListener("click", followOrUnFollowButton);
                  // end 1 of link3 ^ giant follow button, but there is more of it
                  // to be added below/later for the ?follows api/following part
                  // because Tumblr doesn't include a property for follows/mutuals
                  middleChildTD.appendChild(link3);
                  // end fansBricks links... Woot! finally
                  middleChild.appendChild(avatar);
                  middleChildTD.appendChild(middleChildIB)
                  middleChildTR.appendChild(middleChildTD);
                  middleChildT.appendChild(middleChildTR)
                  middleChild.appendChild(middleChildT);
                  fanBrick.appendChild(middleChild);// < don't forget KEVIN!
                  // close off the brick and return below     (home alone)
                  var lastChild = document.createElement("div");
                  lastChild.classList.add("overlay");
                  var jz = document.createElement("div");
                  jz.classList.add("inner");
                  var dt = document.createElement("div");
                  var d = new Date(blog.updated * 1000);
                  var b = d.getDate();
                  var px = ["th ", "st ", "nd ", "rd ", "th ", "th ",
                            "th ", "th ", "th ", "th ", "th "][b % 10];
                  if (b === 12 || b === 11) {
                    px = "th ";
                  }
                  var date = [
                    "Sun - ", "Mon - ", "Tue - ", "Wed - ",
                    "Thu - ", "Fri - ", "Sat - "
                  ][d.getDay()] + mo[d.getMonth()] + b + px + d.getFullYear();
                  dt.classList.add("date");
                  dt.appendChild(document.createTextNode(nm));
                  jz.appendChild(dt);
                  lastChild.appendChild(jz);
                  fanBrick.setAttribute("title", nm + " " + date);
                  fanBrick.appendChild(lastChild);
                  if (group.length > 0) {
                    lcontent.insertBefore(
                      fanBrick, group[group.length-1].nextSibling
                    );
                  } else {
                    lcontent.appendChild(fanBrick);
                  }
                }
                data.setAttribute(
                  "data-id_to_types",
                  JSON.stringify(idToTypes)
                );
                data.setAttribute(
                  "data-type_to_ids",
                  JSON.stringify(typeToIds)
                );
                data.setAttribute(
                  "data-types_all_arr",
                  JSON.stringify(typesAllArr)
                );
                data.setAttribute(
                  "data-ids_all_arr",
                  JSON.stringify(idsAllArr)
                );
                data.setAttribute("data-unstable-next-href", "0");
                pluginBuildColumns();
                var nextPage = false; // maybe? find out later...
                data.setAttribute("data-id_to_types", JSON.stringify(idToTypes));
                data.setAttribute("data-type_to_ids", JSON.stringify(typeToIds));
                data.setAttribute("data-types_all_arr", JSON.stringify(typesAllArr));
                an0.classList.remove("activity-notification");
                if (an.length > 0) {
                  loopFirstBrick(an[0]);
                } else {
                  loadFans(notesList);
                }
              },
              [
                ["Authorization", "Bearer " + token]
              ]
            );
          } else {
            var nc = fanBrick.getElementsByClassName("note_count")[0]; // reblog
            var tc = fanBrick.getElementsByClassName("tag_count")[0]; // like count
            if (isReblog) {
              nc.innerText = (parseInt(nc.innerText.replace(/\D+/g,"")) + 1) + " Notes";
            }
            if (isLike) {
              tc.innerText = (parseInt(tc.innerText.replace(/\D+/g,"")) + 1) + " Likes";
            }
          }
        };
        loopFirstBrick(an[0]);
        notesList.last = an[an.length-1].getAttribute("data-timestamp");
        if (notesList.has_more) {
          setTimeout(function(){
            loadFans(notesList)
          }, 500);
        }
      },
      [
        // I don't want to parse HTML data
        ["X-Requested-With", "XMLHttpRequest"]
        // accept text/html    (-.-)_o  -BOO!
      ]
    );
  };
  // load fans ^

  // we'll need our own masonry for batch photo bricks
  var rebuildPhotoColumn = function() {
    // this fires once for each image
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var column = 150;
    var brk = document.getElementsByClassName("photo-brick");
    var rect;
    var iRct;
    var img;
    var mt; // margin Top
    var brkHeight = 0;
    var tallH;
    for (var i = 0; i < brk.length; i++) {
      img = brk[i].getElementsByClassName("photo-brick-img");
      if (
        img.length === 0 || img.length === 1 &&
        typeof img[0] !== "undefined" &&
        typeof img[0].children !== "undefined" &&
        img[0].children.length === 0
      ) {
        brk[i].parentNode.removeChild(brk[i]);
        i--;
        if (i > 0 && typeof brk[i] === "undefined") {
          break;
        }
      } else {
        brkHeight = 0;
        for (var l = 0; l < img.length; l++) {
          if(
            img[l].classList.contains("row-with-two-img") &&
            img[l].classList.contains("data-photoset-a") &&
            typeof img[l+1] !== "undefined" // nextSibling
          ){
            // neat row...? row same height #1
            tallH = Math.round(Math.min(
              img[l].children[0].clientHeight*
              (60/img[l].children[0].clientWidth),
              img[l+1].children[0].clientHeight*
              (60/img[l+1].children[0].clientWidth)
            )); //2
            img[l].style.height = tallH + "px";
            img[l+1].style.height = tallH + "px";
          }
          if(
            img[l].classList.contains("row-with-three-img") &&
            img[l].classList.contains("data-photoset-a") &&
            typeof img[l+1] !== "undefined" && // nextSibling
            typeof img[l+2] !== "undefined" // nextSibling&nextSibling
          ){
            // neat row...? row same height #1
            tallH = Math.round(Math.min(
              img[l].children[0].clientHeight*
              (38/img[l].children[0].clientWidth),
              img[l+1].children[0].clientHeight*
              (38/img[l+1].children[0].clientWidth),
              img[l+2].children[0].clientHeight*
              (38/img[l+2].children[0].clientWidth)
            )); //3
            img[l].style.height = tallH + "px";
            img[l+1].style.height = tallH + "px";
            img[l+2].style.height = tallH + "px";
          }
          if (
            typeof img[l] !== "undefined" &&
            typeof img[l].children[0] !== "undefined"
          ) {
            rect = img[l].getBoundingClientRect();
            iRct = img[l].children[0].getBoundingClientRect();
            mt = Math.round((rect.height - iRct.height) / 2);
            img[l].children[0].style.marginTop = mt + "px";
            if (
              img[l].classList.contains("row-with-one-img") ||
              img[l].classList.contains("data-photoset-a") &&
              !img[l].classList.contains("brick-dragging")
            ) {
              brkHeight += rect.height + 6;
            }
          }
        }
        if (brkHeight !== 0) {
          brk[i].style.height = Math.round(brkHeight) + "px";
          brk[i].getElementsByClassName("rich")[0].
            style.maxHeight = Math.round(brkHeight-42) > 100 ?
            Math.round(brkHeight-42) + "px" : "100px";
        }
      }
    }
    for (i = 0; i < brk.length; i++) {
      brk[i].style.top = column + "px";
      brk[i].style.left = "420px"; // :P
      column += brk[i].getBoundingClientRect().height + 6;
    }
    data.setAttribute("data-photos_height", column);
    lcontent.style.height = column + "px";
  };
  // end rebuildColumns for batch photos rebuildPhotoColumn

  // alternative name: makePhotoBrickFromUpload
  var allResized = 0;
  var brickIndex = 0;
  var reading = [{
    read: rebuildPhotoColumn
  }];
  var unreadFile = {};
  var readers = [];
  var loadPhotoIntoDOM = function(reloadedImg){
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    // new photo-brick
    var bricks = document.getElementsByClassName("photo-brick");
    var brick = document.createElement("div");
    var brickInner = document.createElement("div");
    brickInner.classList.add("photo-inner");
    brick.classList.add("photo-brick");
    brick.style.top = "-150px";
    brick.style.left = "420px";
    brick.setAttribute("onclick", "window.just_clicked_add_tags = true;");
    brick.id = "photo-brick_" + brickIndex;
    var img = new Image();
    if (
      typeof reloadedImg !== "undefined" &&
      typeof reloadedImg.target !== "undefined" &&
      typeof reloadedImg.target.imgCode !== "undefined"
    ) {
      img.setAttribute("img-code", reloadedImg.target.imgCode);
    }
    img.style.visibility = "hidden";
    img.setAttribute("data-id", brick.id);
    var pbi = document.createElement("div");
    pbi.setAttribute("data-id", brick.id);
    pbi.classList.add("row-with-one-img");
    pbi.classList.add("photo-brick-img");
    var pbic = document.createElement("div");
    pbic.classList.add("photo-brick-img-cell");
    var observer = document.createElement("div");
    observer.classList.add("resize-observer");
    // rebuildColumn after single photo dragged / resized
    new ResizeObserver(rebuildPhotoColumn).observe(observer);
    // these ^ are cool :)
    // editor portion
    var pbe = document.createElement("div");
    pbe.classList.add("photo-brick-edit");
    var rich = document.createElement("div");
    rich.setAttribute("title", "caption");
    rich.id = "rich_text_" + brickIndex;
    rich.setAttribute("data-id", brickIndex);
    var tags = document.createElement("div");
    tags.setAttribute("data-id", brickIndex);
    tags.classList.add("photo-tags");
    tags.addEventListener("click", function() {
      if (!brick.classList.contains("focused-rich")) {
        rich.focus();
      }
    });
    tags.id = "photo_tags_" + brickIndex;
    rich.contentEditable = true;
    rich.designMode = "on";
    rich.classList.add("rich");
    rich.addEventListener("focus", function () {
      if (data.classList.contains("photo-upload-in-progress")) {
        return;
      }
      if (!brick.classList.contains("focused-rich")) {
        var fr = document.getElementsByClassName("focused-rich");
        while (fr.length > 0 ) {
          fr[0].classList.remove("focused-rich");
        }
        var addTagsWidget = document.getElementById("add_tags_widget");
        addTagsWidget.style.display = "block";
        brick.classList.add("focused-rich");
      }
    });
    pbe.appendChild(rich);
    pbe.appendChild(tags);
    var stripe = document.createElement("div");
    stripe.classList.add("stripe");
    var clone = butt("Clone ABC");
    clone.classList.add(clone.id);
    clone.removeAttribute("id");
    clone.addEventListener("click", function () {
      var otherRich = document.getElementsByClassName("rich");
      for (var i = 0; i < otherRich.length; i++){
        if (otherRich[i] === rich) {
          continue;
        }
        otherRich[i].innerHTML = rich.innerHTML;
      }
    });
    clone.setAttribute(
      "title", "Copy this caption, to all photo captions."
    );
    pbe.appendChild(clone);
    appendRichButtons(pbe, rich, brick);
    pbe.appendChild(stripe);
    // end editor portion
    img.addEventListener("load", function() {
      var brick = document.getElementById(
        this.getAttribute("data-id")
      );
      var column = parseInt(
        data.getAttribute("data-photos_height")
      );
      var minBrickHeight = 120;
      this.removeAttribute("style");
      column += (this.height > minBrickHeight ?
	    this.height: minBrickHeight) + 6;
      data.setAttribute("data-photos_height", column);
      lcontent.style.height = column + "px";
    });
    img.src = typeof reloadedImg.nodeName === "undefined" ?
      this.result : reloadedImg.src;
    pbi.appendChild(img);
    observer.appendChild(pbi);
    pbic.appendChild(observer);
    brickInner.appendChild(pbic); // mayo?
    brickInner.appendChild(pbe); // lettuce?
    brick.appendChild(brickInner);
    if (typeof reading !== "undefined" && reading.length > 0) {
      reading.pop();
    }
    if (typeof reading !== "undefined" && reading.length > 0) {
      reading[reading.length - 1].read();
    }
    if (typeof reloadedImg.nodeName !== "undefined") {
      var hlb = document.getElementsByClassName("hl-bottom");
      var hlt = document.getElementsByClassName("hl-top");
      reloadedImg.parentNode.removeChild(reloadedImg);
      document.body.insertBefore(
        brick,
        hlb.length > 0 ? hlb[0].nextSibling : hlt.length > 0 ? hlt[0] :
        document.body.firstChild // < but not this usually
      );
    } else {
      document.body.appendChild(brick);
    }
    brickIndex++;
  };
  // end the batch photo brick maker thing

  // tampermonkey say this needs to be defined first Catch22
  // our own DOM builder for the Dash/Archive/Tagged API; end at return brick
  var makeBrickFromApiPost = function (post, type, content, index) {
    if (type === "undefined") {
      return false;
    }
    var i;
    var tp = {
      "chat": "conversation",
      "ask": "note",
      "image": "photo",
      "text": "regular",
      "link": "link",
      "video": "video",
      "audio": "audio",
      "quote": "quote"
    }; // tumblr 2014 post type names (archive.js)
    var smallestMedia = function (media) {
      var url = media[0].url;
      var width = 100000;
      var height = 125;
      for (var i = 0; i < media.length; i++) {
        if (typeof media[i].width === "undefined") {
          continue;
        }
        if (media[i].width === media[i].height) {
          width = media[i].width;
          height = media[i].height;
          url = media[i].url;
          break;
        }
        if (media[i].width < width && media[i].width >= 125) {
          width = media[i].width;
          height = media[i].height;
          url = media[i].url;
        }
      }
      if (width === 100000) {
        width = 125;
      }
      var img = new Image();
      img.src = url;
      img.width = 125;
      img.height = ((125/width) * height);
      img.style.width = img.width + "px";
      img.style.height = img.height + "px";
      return img;
    };
    var formatText = function (text, f, q) {
      if (typeof f === "undefined") {
        f = [];
      }
      if (typeof q === "undefined") {
        q = "nothing";
      }
      if (typeof text === "undefined") {
        text = "";
      }
      var chars = text.split("");
      chars.push("");
      var open;
      var close = "</span>";
      for (var i = 0; i < f.length; i++) {
        open = {
          "mention":
          "<span style=\"text-decoration:underline;\">",
          "link":
          "<span style=\"text-decoration:underline;\">",
          "bold":
          "<span style=\"font-weight:bold;\">",
          "color":
          "<span style=\"color:" + f[i].hex + ";\">",
          "italic":
          "<span style=\"font-style:italic;\">"
        }[f[i].type];
        chars[f[i].start] = open + chars[f[i].start];
        chars[f[i].end] = chars[f[i].end] + close;
      }
      if(q === "quirky") {
        chars.unshift(
          "<p class=\"quirky\">"
        );
        chars.push("</p>");
      }
      if(q === "heading1") {
        chars.unshift(
          "<p class=\"h1\">"
        );
        chars.push("</p>");
      }
      if(q === "heading2") {
        chars.unshift(
          "<p class=\"h2\">"
        );
        chars.push("</p>");
      }
      if(q === "link") {
        chars.unshift(
          "<div class=\"rq\">&#x2192;</div>" +
          "<p class=\"link\">"
        );
        chars.push("</p>");
      }
      if(q === "chat") {
        chars.unshift(
          "<p class=\"monospace\">"
        );
        chars.push("</p>");
      }
      if(q === "ordered-list-item") {
        chars.unshift(
          "<p class=\"ol\">"
        );
        chars.push("</p>");
      }
      if(q === "unordered-list-item") {
        chars.unshift(
          "<p class=\"ul\">"
        );
        chars.push("</p>");
      }
      if(q === "quote") {
        chars.unshift(
          "<div class=\"rq\">&rdquo;</div>" +
          "<p class=\"quote\">"
        );
        chars.push("</p>");
      }
      if(q === "note") {
        chars.unshift(
          "<div class=\"rq\">?</div>" +
          "<p class=\"quote\">"
        );
        chars.push("</p>");
      }
      return chars.join("");
    }; // format text
    var brick = document.createElement("a");
    brick.setAttribute("data-index", index);
    brick.classList.add("brick");
    brick.classList.add(tp[type]);
    brick.classList.add("timestamp_" + post.timestamp);
    brick.setAttribute("data-id", post.id);
    brick.setAttribute("data-timestamp", post.timestamp);
    brick.setAttribute("data-reblog_key", post.reblog_key);
    brick.id = "post_" + post.id;
    var firstChild = document.createElement("div");
    firstChild.classList.add("highlight");
    var cm = new Image();
    cm.src = "https://assets.tumblr.com/images/" +
      "small_white_checkmark.png";
    cm.classList.add("checkmark");
    firstChild.appendChild(cm);
    var tc = document.createElement("div");
    tc.classList.add("tag_count");
    tc.id = "tag_count_" + post.id;
    tc.appendChild(
      document.createTextNode(
        typeof post.tags === "undefined" ? "0 tags" :
        post.tags.length === 1 ? "1 tag" :
        post.tags.length + " tags"
      )
    );
    firstChild.appendChild(tc);
    var nc = document.createElement("div");
    nc.classList.add("note_count");
    nc.id = "note_count_" + post.id;
    nc.appendChild(
      document.createTextNode(
        typeof post.note_count === "undefined" ? "0 notes" :
        post.note_count === 1 ? "1 note" :
        post.note_count.toLocaleString("en", {useGrouping:true}) + " notes"
      )
    );
    firstChild.appendChild(nc);
    brick.appendChild(firstChild);
    // meat & tators middle child (again)
    var middleChild = document.createElement("div");
    var middleChildT = document.createElement("div");
    var middleChildTR = document.createElement("div");
    var middleChildTD = document.createElement("div");
    var middleChildIB = document.createElement("div");
    var fade = document.createElement("div");
    fade.classList.add("fade");
    var childTitle;
    var imgs;
    var h;
    var url;
    var av;
    var nm;
    var orly;
    var line;
    var op;
    var l;
    middleChild.classList.add("overflow-hidden");
    middleChildT.classList.add("overflow-table");
    middleChildTR.classList.add("overflow-row");
    middleChildTD.classList.add("overflow-cell");
    middleChildIB.classList.add("overflow-inline");
    if (
      type === "text" ||
      type === "chat" ||
      type === "quote" ||
      type === "ask" ||
      type === "link"
    ) {
      childTitle = document.createElement("div");
      childTitle.classList.add("title");
      if (
        typeof content[0] !== "undefined" &&
        typeof content[0].text !== "undefined"
      ) {
        childTitle.innerHTML = formatText(
          content[0].text,
          content[0].formatting,
          content[0].subtype
        );
      }
      if (type === "ask") {
        nm = typeof post.trail[0].layout[0].attribution !== "undefined" ?
          post.trail[0].layout[0].attribution.blog.name :
        post.trail[0].blog.name;
        url = "https://api.tumblr.com/v2/blog/" + nm + "/avatar/64";
        av = new Image();
        av.width = 24;
        av.height = 24;
        av.style.width = av.width + "px";
        av.style.height = av.height + "px";
        av.src = url;
        av.classList.add("ask-av");
        childTitle.appendChild(av);
        if (
          typeof post.trail[0] !== "undefined" &&
          typeof post.trail[0].content[0] !== "undefined" &&
          typeof post.trail[0].content[0].text !== "undefined"
        ) {
          childTitle.innerHTML += "<div class=\"rq\">?</div>" +
            "<div class=\"asker\">" +
            formatText(
            post.trail[0].content[0].text,
            post.trail[0].content[0].formatting,
            post.trail[0].content[0].subtype
          ) + "</div>";
        }
      }
      if (
        type === "ask" &&
        typeof post.trail[0] !== "undefined" &&
        typeof post.trail[0].content[1] !== "undefined" &&
        (
          typeof post.trail[0].content[1].text !== "undefined" ||
          typeof post.trail[0].content[1].media !== "undefined"
        )
      ) {
        if (typeof post.trail[0].content[1].text !== "undefined") {
          childTitle.innerHTML += "<div class=\"answer\">" +
            formatText(
            post.trail[0].content[1].text,
            post.trail[0].content[1].formatting,
            post.trail[0].content[1].subtype
          ) + "</div>";
        } else {
          imgs = post.trail[0].content[1].media;
          brick.classList.add("has-img");
          line = smallestMedia(imgs);
          h = line.height;
          childTitle.innerHTML +=
            line.outerHTML;
          childTitle.appendChild(fade);
        }
      }
      middleChildIB.appendChild(childTitle);
      if (
        typeof content[1] !== "undefined" &&
        typeof content[1].text !== "undefined"
      ) {
        op = document.createElement("div");
        op.classList.add("overprint");
        var alt = true;
        if (type === "chat") {
          for (i = 1; i < content.length; i++) {
            if (typeof content[i].text === "undefined") {
              continue;
            }
            line = document.createElement("div");
            line.classList = "line";
            if (alt) {
              line.classList.add("alt");
            }
            alt = !alt;
            line.innerHTML = formatText(
              content[i].text,
              content[i].formatting,
              content[i].subtype
            );
            op.appendChild(
              line
            );
          }
          middleChildIB.appendChild(op);
        }
        if (
          type === "text" || type === "quote" ||
          type === "ask" || type === "link"
        ) {
          if (
            typeof content === "undefined" ||
            typeof content !== "undefined" &&
            content.length === 0
          ) {
            if (
              typeof post.trail !== "undefined" &&
              typeof post.trail[0] !== "undefined" &&
              typeof post.trail[0].content !== "undefined" &&
              post.trail[0].content.length > 0
            ) {
              content = post.trail[0].content;
            }
          }
          for (i = 1; i < content.length; i++) {
            if (typeof content[i].text !== "undefined") {
              line = document.createElement("div");
              line.innerHTML = formatText(
                content[i].text,
                content[i].formatting,
                content[i].subtype
              );
              op.appendChild(
                line
              );
            }
            if (
              typeof content[i].media !== "undefined" &&
              content[i].media.length > 0 ||
              typeof content[i].poster !== "undefined" &&
              content[i].poster.length > 0
            ) {
              imgs = typeof content[i].poster === "undefined" ?
                content[i].media : content[i].poster;
              brick.classList.add("has-img");
              line = smallestMedia(imgs);
              h = line.height;
              op.appendChild(
                line
              );
              op.appendChild(fade);
            }
          }
          middleChildIB.appendChild(op);
        }
      }
    } // photo images, audio, video
    if (
      !(
        typeof content !== "undefined" &&
        typeof content[0] !== "undefined" &&
        typeof content[0].media !== "undefined" &&
        content[0].media.length > 0 ||
        typeof content !== "undefined" &&
        typeof content[0] !== "undefined" &&
        typeof content[0].poster !== "undefined" &&
        content[0].poster.length > 0
      )
    ) {
      if(
        typeof content !== "undefined" &&
        typeof post.content !== "undefined"
      ) {
        content = post.content; // another backflip :)
        // I'm done with ^ NPF neue posts here :)
      }
    }
    if (
      type === "link" &&
      typeof content !== "undefined" &&
      typeof content[0] !== "undefined" &&
      typeof content[0].title !== "undefined"
    ) {
      line = document.createElement("div");
      line.innerHTML = formatText(
        content[0].title,
        content[0].formatting,
        "link"
      );
      if (typeof content[0].description !== "undefined") {
        line.innerHTML += formatText(
          content[0].description,
          content[0].formatting,
          "normal"
        );
      }
      middleChildIB.appendChild(
        line
      );
    }
    if (
      typeof content !== "undefined" &&
      typeof content[0] !== "undefined" &&
      typeof content[0].media !== "undefined" &&
      content[0].media.length > 0 ||
      typeof content !== "undefined" &&
      typeof content[0] !== "undefined" &&
      typeof content[0].poster !== "undefined" &&
      content[0].poster.length > 0
    ) {
      imgs = typeof content[0].poster === "undefined" ?
        content[0].media : content[0].poster;
      line = smallestMedia(imgs);
      brick.classList.add("has-img");
      h = line.height;
      middleChildIB.appendChild(line);
      if (type === "text") {
        middleChildIB.appendChild(fade);
      }
    } else if (
      typeof content[1] !== "undefined" &&
      typeof content[1].media !== "undefined" &&
      content[1].media.length > 0 ||
      typeof content[1] !== "undefined" &&
      typeof content[1].poster !== "undefined" &&
      content[1].poster.length > 0
    ) {
      imgs = typeof content[1].poster === "undefined" ?
        content[1].media : content[1].poster;
      line = smallestMedia(imgs);
      brick.classList.add("has-img");
      h = line.height;
      middleChildIB.appendChild(line);
      if (type === "text") {
        middleChildIB.appendChild(fade);
      }
    }
    if (
      type === "image" || h < 125 &&
      type !== "text" &&
      type !== "ask"
    ) {
      brick.style.height = Math.round(h) + "px";
    } else {
      brick.style.height = "125px";
    }
    if (
      type === "image" || type === "video" || type === "audio"
    ) {
      // I discovered this looks nice, so I'm doing some design
      var captionInlineBlock = document.createElement("div");
      captionInlineBlock.classList.add("caption-inline-block");
      var captionTR = document.createElement("div");
      captionTR.classList.add("caption-tr");
      var captionTD = document.createElement("div");
      captionTD.classList.add("caption-td");
      var caption = document.createElement("div");
      caption.classList.add("caption");
      var capContent;
      if (
        typeof post.trail !== "undefined" &&
        post.trail.length > 0
      ) {
        for (i = 0; i < post.trail.length; i++) {
          if (
            typeof post.trail[i].content !== "undefined" &&
            post.trail[i].content.length > 0
          ) {
            capContent = post.trail[i].content;
            for (l = 0; l < capContent.length; l++) {
              if (
                typeof capContent[l].text !== "undefined"
              ) {
                captionInlineBlock.innerHTML += "<div>" + formatText(
                  capContent[l].text,
                  capContent[l].formatting,
                  capContent[l].subtype
                ) + "</div>";
              }
            }
          }
        }
      }
      if (captionInlineBlock.innerHTML.length === 0) {
        capContent = typeof post.content !== "undefined" &&
          post.content.length > 0 ?
          post.content : content;
        for (i = 0; i < capContent.length; i++) {
          if (typeof capContent[i].text !== "undefined") {
            captionInlineBlock.innerHTML += "<div>" + formatText(
              capContent[i].text,
              capContent[i].formatting,
              capContent[i].subtype
            ) + "</div>";
          }
        }
      }
      captionTD.appendChild(captionInlineBlock);
      captionTR.appendChild(captionTD);
      caption.appendChild(captionTR);
      brick.appendChild(caption);
    }
    if (type === "image") {
      var imgCount = -1;
      for (i = 1; i < content.length; i++) {
        if (typeof content[i].media !== "undefined") {
          ++imgCount;
        }
      }
      if (imgCount > 0) {
        var imgCountDiv = document.createElement("div");
        imgCountDiv.classList.add("img-count");
        imgCountDiv.appendChild(
          document.createTextNode("+" + imgCount + " more")
        );
        brick.appendChild(imgCountDiv);
      }
    }
    if (type === "video") {
      orly = document.createElement("div");
      orly.classList.add("play_overlay");
      brick.appendChild(orly);
    }
    if (type === "audio") {
      orly = document.createElement("div");
      orly.classList.add("listen_overlay");
      brick.appendChild(orly);
    }
    if (post.state === "private") {
      orly = document.createElement("div");
      orly.classList.add("private_overlay");
      brick.classList.add("private");
      brick.appendChild(orly);
    }
    // this is the tags and links thingy
    brick.href = post.post_url;
    brick.setAttribute("target", "_blank");
    var linksLayer = document.createElement("div");
    linksLayer.classList.add("links-layer");
    var linksTrow = document.createElement("div");
    linksTrow.classList.add("trow");
    var tagsLayer = document.createElement("div");
    tagsLayer.classList.add("tags-layer");
    if (typeof post.tags !== "undefined") {
      var tagsLayerContainer = document.createElement("div");
      tagsLayerContainer.classList.add("tag-container");
      post.tags.sort(function (a, b) {
        return a.length - b.length;
      });
      for (i = 0; i < post.tags.length; i++) {
        tagsLayerContainer.appendChild(
          document.createTextNode(
            "#" + post.tags[i] + " "
          )
        );
      }
      tagsLayer.appendChild(tagsLayerContainer);
    }
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var noEdit = typeof href[5] !== "undefined" &&
        (
          href[5] === "dashboard" ||
          href[5] === "archive" ||
          href[5] === "tagged" ||
          href[5] === "likes" ||
          href[5] === "search"
        );
    // post bricks edit button
    var link1 = document.createElement("a");
    link1.setAttribute("target", "_blank");
    link1.classList.add("link-edit");
    link1.href = noEdit ?
      "/dashboard/blog/" + post.blog_name + "/" + post.id :
    "/edit/" + post.id;
    link1.setAttribute("title",
                       (noEdit ? "Peepr" : "Edit")
                      );
    link1.appendChild(
      (noEdit?
       svgForType.view.cloneNode(true):
       svgForType.edit.cloneNode(true)
      )
    );
    link1.setAttribute("data-id", post.id);
    // only add like/reblog buttons if posts are visible
    if (!noEdit) {
      link1.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("data-id", this.getAttribute("data-id"));
        document.getElementById(
          "post_" + this.getAttribute("data-id")
        ).classList.remove("prevent-anim");
        iframe.id = "neue_post_form-iframe";
        var reminisce = 0;
        iframe.addEventListener("load", function () {
          var replaceAfterEdit = this;
          var id = this.getAttribute("data-id");
          // this checks if done editing/closed
          clearInterval(reminisce);
          reminisce = setInterval(function () {
            var w = document.getElementById(
              "neue_post_form-iframe"
            ).contentWindow;
            var p = w.document.getElementsByClassName(
              "post-forms-modal"
            )[0];
            if (
              typeof p === "undefined" ||
              typeof p !== "undefined" &&
              p.length === 0 ||
              typeof p !== "undefined" &&
              (
                w.getComputedStyle(p).
                getPropertyValue("display") === "none" ||
                w.getComputedStyle(p).
                getPropertyValue("opacity").toString() === "0"
              )
            ) {
              clearInterval(reminisce);
              document.body.removeChild(
                document.getElementById("neue_post_form-iframe")
              );
              reloadBrick(replaceAfterEdit);
            }
          }, 500);
        });
        iframe.src = "https://www.tumblr.com/neue_web/iframe/edit/" +
          post.id;
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("title", "Post forms");
        document.body.appendChild(iframe);
      });
    } else {
      link1.addEventListener("click", function (e){
        e.cancelBubble = true;
        e.stopProgagation();
      });
    }
    // post bricks view post link
    var link2 = document.createElement("a");
    link2.setAttribute("target", "_blank");
    link2.addEventListener("click", function (e){
      e.cancelBubble = true;
      e.stopProgagation();
    });
    link2.classList.add("link-view");
    link2.href = post.post_url;
    link2.setAttribute("target", "_blank");
    link2.setAttribute("title", "View Post");
    link2.appendChild(
      svgForType.see.cloneNode(true)
    );
    // post bricks like button
    var isReblogable = href[3] !== "draft" && href[3] !== "queued";
    if (isReblogable) {
      var link3 = document.createElement("a");
      link3.setAttribute("target", "_blank");
      link3.classList.add("link-like");
      link3.setAttribute("data-id", post.id);
      link3.href = post.post_url + "#like" + post.reblog_key;
      link3.setAttribute(
        "data-like-info",
        JSON.stringify({"id":post.id,"reblog_key":post.reblog_key})
      );
      link3.setAttribute("target", "_blank");
      link3.setAttribute("title", "Like Post");
      var whiteHeart = post.liked ?
          svgForType.liked.cloneNode(true):
      svgForType.notes.cloneNode(true);
      whiteHeart.setAttribute("fill", post.liked ? "#f56": "#fff");
      link3.appendChild(
        whiteHeart
      );
      link3.classList.add(post.liked ? "liked" : "not-liked");
      link3.addEventListener("click", function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
        if (this.classList.contains("clicked")) {
          return;
        }
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        this.classList.remove("new-liked");
        this.classList.add("clicked");
        var button = this;
        var liked = this.classList.contains("liked");
        var info = this.getAttribute("data-like-info");
        var v2url = liked ?
            "/api/v2/user/unlike" : "/api/v2/user/like";
        var token = data.getAttribute("data-api-token");
        var href = document.location.href.split(/[\/\?&#=]+/g);
        var name = href[4];
        var csrfToken = data.getAttribute("data-csrf-token");
        if (csrfToken !== "0") {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              button.innerHTML = "";
              var cb = document.getElementById(
                "post_" + button.getAttribute("data-id")
              );
              if (liked) {
                whiteHeart = svgForType.notes.cloneNode(true);
                whiteHeart.setAttribute("fill", "#fff");
                button.classList.remove("liked");
                button.classList.add("not-liked");
                cb.classList.remove("liked");
              } else {
                whiteHeart = svgForType.liked.cloneNode(true);
                whiteHeart.setAttribute("fill", "#f56");
                button.classList.add("liked");
                button.classList.remove("not-liked");
                cb.classList.add("liked");
                // graphical aftertaste for reblog
                var bigHeart = svgForType.liked.cloneNode(true);
                bigHeart.setAttribute("fill", "#f56");
                bigHeart.setAttribute("width", "125");
                bigHeart.setAttribute("height", "125");
                bigHeart.classList.add("big-heart");
                setTimeout(function(){
                  bigHeart.parentNode.removeChild(bigHeart);
                }, 1700);
                cb.appendChild(bigHeart);
                button.classList.add("new-liked");
              }
              button.appendChild(whiteHeart);
              button.classList.remove("clicked");
            }
          };
          xhttp.open("POST", v2url, true);
          // headers only after open and only before send
          xhttp.setRequestHeader(
            "Accept", "application/json;format=camelcase"
          );
          xhttp.setRequestHeader(
            "Authorization", "Bearer " + token
          );
          xhttp.setRequestHeader(
            "X-CSRF", csrfToken
          );
          xhttp.setRequestHeader(
            "Content-Type", "application/json; charset=utf8"
          );
          xhttp.setRequestHeader(
            "X-Version", "redpop/3/0//redpop/"
          );
          xhttp.send(info);
        } // else {
        // TODO, (just in case) get a new CSRF token here?
        // this may not be needed...?
        // the token seems to stay ok, so far :)
        //}
      });
      // posts bricks reblog button
      var link4 = document.createElement("a");
      link4.setAttribute("target", "_blank");
      link4.classList.add("link-reblog");
      link4.href = post.post_url + "#like" + post.reblog_key;
      link4.setAttribute("data-id", post.id);
      link4.setAttribute("data-reblog_key", post.reblog_key);
      link4.setAttribute("target", "_blank");
      link4.setAttribute("title", "Reblog Post");
      var whiteReblog = svgForType["reblog-self"].cloneNode(true);
      whiteReblog.setAttribute("fill", "#fff");
      link4.appendChild(
        whiteReblog
      );
      link4.addEventListener("click", function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
        if (
          this.classList.contains("clicked") ||
          this.classList.contains("reblogged")
        ) {
          return;
        }
        var id = this.getAttribute("data-id");
        var key = this.getAttribute("data-reblog_key");
        var button = this;
        this.classList.remove("new-liked");
        this.classList.add("clicked");
        data.setAttribute("data-single_edit_id", id);
        data.setAttribute("data-current_edit_index", "-1");
        data.setAttribute("data-current_edit_action", "reblog");
        // negative index for outside of queue single reblogs
        fetchEditSubmit(
          function(){
            var cb = document.getElementById(
              "post_" + button.getAttribute("data-id")
            );
            button.children[0].setAttribute("fill", "#7EFF29");
            button.classList.remove("clicked");
            button.classList.add("reblogged");
            cb.classList.add("reblogged");
            reblogAnimation(button.getAttribute("data-id"));
          });
      });
    }
    tagsLayer.addEventListener("click", function (e) {
      e.cancelBubble = true;
      e.stopPropagation();
      e.preventDefault();
      var clickParentBrick = new Event("click");
      this.parentNode.parentNode.
      parentNode.dispatchEvent(clickParentBrick);
    });
    tagsLayer.appendChild(link1);
    tagsLayer.appendChild(link2);
    if (isReblogable) {
      tagsLayer.appendChild(link3);
      tagsLayer.appendChild(link4);
    }
    linksTrow.appendChild(tagsLayer);
    linksLayer.appendChild(linksTrow);
    brick.appendChild(linksLayer);
    // sandwich, yum
    middleChildTD.appendChild(middleChildIB);
    middleChildTR.appendChild(middleChildTD);
    middleChildT.appendChild(middleChildTR);
    middleChild.appendChild(middleChildT);
    brick.appendChild(middleChild);
    // close off the brick and return below
    var lastChild = document.createElement("div");
    lastChild.classList.add("overlay");
    var jz = document.createElement("div");
    jz.classList.add("inner");
    var dt = document.createElement("div");
    var d = new Date(post.timestamp * 1000);
    var b = d.getDate();
    var px = ["th ", "st ", "nd ", "rd ", "th ", "th ",
              "th ", "th ", "th ", "th ", "th "][b % 10];
    if (b === 12 || b === 11) {
      px = "th ";
    }
    var date = [
      "Sun - ", "Mon - ", "Tue - ", "Wed - ",
      "Thu - ", "Fri - ", "Sat - "
    ][d.getDay()] + [
      "Jan ", "Feb ", "Mar ", "Apr ",
      "May ", "Jun ", "Jul ", "Aug ",
      "Sep ", "Oct ", "Nov ", "Dec "
    ][d.getMonth()] + b + px + d.getFullYear();
    dt.classList.add("date");
    dt.appendChild(document.createTextNode(date));
    jz.appendChild(dt);
    lastChild.appendChild(jz);
    brick.appendChild(lastChild);
    if (
      typeof content !== "undefined" &&
      typeof content[0] !== "undefined" &&
      typeof content[0].attribution !== "undefined" &&
      typeof content[0].attribution.url !== "undefined"
    ) {
      var sourceLabel2 = document.createElement("div");
      sourceLabel2.setAttribute(
        "title",
        "link: " + content[0].attribution.url
      );
      var symlink1 = svgForType.symlink.cloneNode(true); //:D
      symlink1.setAttribute("fill", "rgba(100,110,255,1)");
      sourceLabel2.appendChild(symlink1);
      sourceLabel2.classList.add("source-label2");
      brick.appendChild(sourceLabel2);
    }
    if (
      typeof post.source_url_raw !== "undefined" &&
      post.source_url_raw !== "" &&
      post.source_url_raw !== false
    ) {
      var sourceLabel1 = document.createElement("div");
      sourceLabel1.setAttribute(
        "title",
        "source: " + post.source_url_raw
      );
      var symlink2 = svgForType.symlink.cloneNode(true); //:D
      symlink2.setAttribute("fill", "#eee");
      sourceLabel1.appendChild(symlink2);
      sourceLabel1.classList.add("source-label1");
      brick.appendChild(sourceLabel1);
    }
    // lastly create the event to highlight single stuff
    brick.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.cancelBubble = true;
      highlightBrick(this, !this.classList.contains("highlighted"));
    });
    return brick; // end from var makeBrickFromAPIPost
  }
  // end giant makeBrick brick building function

  // since tumblr put a somewhat api/v2 on the main domain,
  // instead of api.tumblr.com ect...
  // greasemonkey can use an api
  // without registering an oauth key (_-.-)shh
  var asyncRepeatApiRead = function (api) {
    if(typeof api === "string") {
      api = JSON.parse(api);
    }
    var lcontent = document.getElementsByClassName("l-content")[0];
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var name = href[4];
    var endHeader;
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    data.classList.add("fetching-from-tumblr-api");
    if ( // this is the liked/by page if any JSON
      href[5] === "likes" &&
      typeof api.response.liked_posts !== "undefined" &&
      api.response.liked_posts.length > 0
    ) {
      api.response.posts = api.response.liked_posts;
    }
    if ( // this is the dashboards JSON
      typeof api.response.posts === "undefined" &&
      typeof api.response.timeline !== "undefined" &&
      typeof api.response.timeline.elements !== "undefined"
    ) {
      api.response.posts = api.response.timeline.elements;
    }
    if ( // tagged & search JSON
      typeof api.response.posts !== "undefined" &&
      typeof api.response.posts.data !== "undefined"
    ) {
      api.response.posts = api.response.posts.data;
      if (
        typeof api.response._links === "undefined" &&
        api.response.posts.length - 1 > 0
      ) {
        api.response._links = {
          "next": {
            "href":  data.getAttribute("data-ajax-first-subpage") +
            "&post_offset=" + api.response.posts[
              api.response.posts.length - 1
            ].timestamp
          }
        }
      };
      // I know, these ^ are endless
      // idea: [pause button]
    }
    if (
      typeof api.response.posts !== "undefined"
    ) {
      if(api.response.posts.length === 0) {
        endHeader = document.createElement("div");
        endHeader.classList.add("heading");
        endHeader.id = "heading_solum"; // end latin
        endHeader.appendChild(
          document.createTextNode("END") // idky... :)
        );
        lcontent.appendChild(endHeader);
        // done here too, should be
        data.classList.add("next_page_false");
        return;
      }
      var tagsAllArr = JSON.parse(
        data.getAttribute("data-tags_all_arr")
      );
      var idsAllArr = JSON.parse(
        data.getAttribute("data-ids_all_arr")
      );
      var typesAllArr = JSON.parse(
        data.getAttribute("data-types_all_arr")
      );
      var typeToIds = JSON.parse(
        data.getAttribute("data-type_to_ids")
      );
      var idToTags = JSON.parse(
        data.getAttribute("data-id_to_tags")
      );
      var idToTypes = JSON.parse(
        data.getAttribute("data-id_to_types")
      );
      var lastMonthTimestamp = parseFloat(
        data.getAttribute("data-last_month_timestamp")
      );
      var lastYearTimestamp = parseFloat(
        data.getAttribute("data-last_year_timestamp")
      );
      var idToOrigin = JSON.parse(
        data.getAttribute("data-id_to_origin")
      );
      var idToState = JSON.parse(
        data.getAttribute("data-id_to_state")
      );
      var idToTimestamp = JSON.parse(
        data.getAttribute("data-id_to_timestamp")
      );
      var idToNotes = JSON.parse(
        data.getAttribute("data-id_to_notes")
      );
      var tagToIds = JSON.parse(
        data.getAttribute("data-tag_to_ids")
      );
      var post = api.response.posts;
      var tag;
      var id;
      var type;
      var url;
      var reblog;
      var me;
      var media;
      var j;
      var newBrick;
      var monthHeader;
      var lastTimestamp;
      var lastYearstamp;
      if (!lcontent.classList.contains("albino")) {
        lcontent.classList.add("albino");
      }
      var t = [
        "text", "image", "chat", "ask", "video", "audio", "link", "quote"
      ];
      for (var i = 0; i < post.length; i++) {
        id = post[i].id;
        if (idsAllArr.indexOf(id) !== -1) {
          continue;
        }
        type = post[i].type;
        me = post[i];
        media = me.media;
        if (t.indexOf(type) === -1) { // neue type blocks???
          if (
            typeof post[i].trail != "undefined" &&
            typeof post[i].trail[0] !== "undefined" &&
            typeof post[i].trail[0].layout !== "undefined" &&
            typeof post[i].trail[0].layout[0] !== "undefined"
          ) {
            me = post[i].trail[0].layout;
            type = me[0].type;
          }
          if (
            t.indexOf(type) === -1 &&
            typeof post[i].trail != "undefined" &&
            typeof post[i].trail[0] !== "undefined" &&
            typeof post[i].trail[0].content !== "undefined" &&
            typeof post[i].trail[0].content[0] !== "undefined"
          ) {
            me = post[i].trail[0].content;
            type = me[0].type;
          }
          if (
            t.indexOf(type) === -1 &&
            typeof post[i].content !== "undefined" &&
            typeof post[i].content[0] === "undefined" &&
            typeof post[i].trail !== "undefined" &&
            typeof post[i].trail[0] !== "undefined" &&
            typeof post[i].trail[0].content !== "undefined"
          ) {
            me = post[i].trail[0].content;
            type = me[0].type;
          }
          if (
            t.indexOf(type) === -1 &&
            typeof post[i].content !== "undefined" &&
            typeof post[i].content[1] !== "undefined" &&
            typeof post[i].content[1].subtype !== "undefined"
          ) {
            me = post[i].content;
            type = me[1].subtype; // chat, maybe
          }
          if (
            t.indexOf(type) === -1 &&
            typeof post[i].content !== "undefined" &&
            typeof post[i].content[0] !== "undefined"
          ) {
            me = post[i].content;
            type = me[0].type;
          }
          if (
            typeof me !== "undefined" &&
            typeof me[0] !== "undefined" &&
            typeof me[0].subtype !== "undefined" &&
            type !== me[0].subtype &&
            t.indexOf(me[0].subtype) !== -1
          ) {
            type = me[0].subtype;
          }
        }
        if(typeof post[i].timestamp === "undefined") {
          continue;
        }
        lastTimestamp = (new Date(
          post[i].timestamp * 1000)
                        ).getMonth();
        lastYearstamp = (new Date(
          post[i].timestamp * 1000)
                        ).getFullYear();
        if(
          lastTimestamp !== lastMonthTimestamp ||
          lastYearstamp !== lastYearTimestamp
        ) {
          lastMonthTimestamp = lastTimestamp;
          lastYearTimestamp = lastYearstamp;
          data.setAttribute(
            "data-last_month_timestamp", lastMonthTimestamp
          );
          data.setAttribute(
            "data-last_year_timestamp", lastYearTimestamp
          );
          monthHeader = document.createElement("div");
          monthHeader.classList.add("heading");
          monthHeader.id = "heading_" + post[i].timestamp;
          monthHeader.appendChild(
            document.createTextNode([
              "Jan ", "Feb ", "Mar ", "Apr ",
              "May ", "Jun ", "Jul ", "Aug ",
              "Sep ", "Oct ", "Nov ", "Dec "
            ][lastTimestamp] + lastYearstamp)
          );
          lcontent.appendChild(monthHeader);
        }
        // this replaces everything Tumblr wrote inside the bricks
        // with our own flavor, of brick, new brick
        newBrick = makeBrickFromApiPost(
          post[i], type, me, i + parseInt(data.getAttribute("data-last-post-index"))
        );
        if (newBrick !== false) {
          lcontent.appendChild(newBrick);
        }
        idsAllArr.push(id);
        if (typesAllArr.indexOf(type) === -1) {
          typesAllArr.push(type);
          typeToIds[type] = [];
        }
        typeToIds[type].push(id);
        if (
          typeof post[i].reblogged_from_name !== "undefined"
        ) {
          reblog = post[i].reblogged_from_name;
          if (reblog === name) {
            if (
              typesAllArr.indexOf("reblog-self") === -1
            ) {
              typesAllArr.push("reblog-self");
              typeToIds["reblog-self"] = [];
            }
            typeToIds["reblog-self"].push(id);
            idToOrigin[id] = "reblog-self";
          } else {
            if (
              typesAllArr.indexOf("reblog-other") === -1
            ) {
              typesAllArr.push("reblog-other");
              typeToIds["reblog-other"] = [];
            }
            typeToIds["reblog-other"].push(id);
            idToOrigin[id] = "reblog-other";
          }
        } else {
          if (
            typesAllArr.indexOf("original") === -1
          ) {
            typesAllArr.push("original");
            typeToIds.original = [];
          }
          typeToIds.original.push(id);
          idToOrigin[id] = "original";
        }
        if (post[i].state === "private") {
          if (
            typesAllArr.indexOf("private") === -1
          ) {
            typesAllArr.push("private");
            typeToIds.private = [];

          }
          idToState[id] = "private";
          typeToIds.private.push(id);
        } else {
          idToState[id] = "public";
        }
        idToNotes[id] = post[i].note_count;
        idToTimestamp[id] = post[i].timestamp;
        idToTypes[id] = type;
        if (typeof post[i].tags !== "undefined") {
          for (var l = 0; l < post[i].tags.length; l++) {
            tag = post[i].tags[l];
            if (tagsAllArr.indexOf(tag) === -1) {
              tagsAllArr.push(tag);
              tagToIds[tag] = [];
            }
            tagToIds[tag].push(id);
            if (typeof idToTags[id] === "undefined") {
              idToTags[id] = [];
            }
            if (idToTags[id].indexOf(tag) === -1) {
              idToTags[id].push(tag)
            }
          }
        }
        if (i + 1 > post.length) {
          data.setAttribute(
            "data-last-post-index",
            parseInt(data.getAttribute("data-last-post-index")) + i
          );
        }
      }
      pluginBuildColumns();
      // the later onclick event to select-by runs outside of plugin scope
      // so we use the DOM for var memory
      data.setAttribute(
        "data-tags_all_arr", JSON.stringify(tagsAllArr)
      );
      data.setAttribute(
        "data-ids_all_arr", JSON.stringify(idsAllArr)
      );
      data.setAttribute(
        "data-types_all_arr", JSON.stringify(typesAllArr)
      );
      data.setAttribute(
        "data-id_to_tags", JSON.stringify(idToTags)
      );
      data.setAttribute(
        "data-id_to_types", JSON.stringify(idToTypes)
      );
      data.setAttribute(
        "data-id_to_origin", JSON.stringify(idToOrigin)
      );
      data.setAttribute(
        "data-id_to_state", JSON.stringify(idToState)
      );
      data.setAttribute(
        "data-id_to_timestamp", JSON.stringify(idToTimestamp)
      );
      data.setAttribute(
        "data-id_to_notes", JSON.stringify(idToNotes)
      );
      data.setAttribute(
        "data-tag_to_ids", JSON.stringify(tagToIds)
      );
      data.setAttribute(
        "data-type_to_ids", JSON.stringify(typeToIds)
      );
    }
    var token = data.getAttribute("data-api-token");
    var nextPage = false;
    if (
      typeof api.response !== "undefined" &&
      typeof api.response._links !== "undefined" &&
      typeof api.response._links.next !== "undefined" &&
      typeof api.response._links.next.href !== "undefined"
    ) {
      nextPage = api.response._links.next.href;
    } else if (
      typeof api.response !== "undefined" &&
      typeof api.response.timeline !== "undefined" &&
      typeof api.response.timeline._links.next !== "undefined" &&
      typeof api.response.timeline._links.next.href !== "undefined"
    ) {
      nextPage = api.response.timeline._links.next.href;
    }
    if (
	  nextPage !== false && nextPage !== data.getAttribute("data-page-repeat")
	) {
      data.setAttribute("data-page-repeat", nextPage); // loop much?
      // walk, don't run :)
      data.classList.add("fetching-from-tumblr-api");
      var repeatedTimeOut = setInterval(function() {
        // this delays pagination slightly, but it may be better...
        // it's steadier, non-bot-ish, and is easier to process :)
        var tagAlongDiff = document.getElementsByClassName("brick").length -
            document.getElementsByClassName("laid").length;
        if(
          document.getElementById(
            "pause_button"
          ).classList.contains("paused") ||
          tagAlongDiff > 10 // < this :)
        ) {// the CSS3 animation thing is also crash prevention :)
          return;
        }
        clearInterval(repeatedTimeOut);
        getResponseText(
          "/api" + nextPage,
          asyncRepeatApiRead,
          [
            ["Authorization", "Bearer " + token]
          ]
        );
      }, 500);
    } else {
      endHeader = document.createElement("div");
      endHeader.classList.add("heading");
      endHeader.id = "heading_solum"; // end latin
      endHeader.appendChild(
        document.createTextNode("END")
      );
      lcontent.appendChild(endHeader);
      // this is where it usually ends, mostly
      data.classList.add("next_page_false");
    }
  };
  // end var asyncRepeatApiRead

  // re the brick building for edits replaceBrick
  var reloadBrick = function (replaceAfterEdit) {
    if (
      typeof replaceAfterEdit === "undefined" || // what is this?
      replaceAfterEdit.classList.contains("reload-in-progress")
    ) {
      return;
    }
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var idsAllArr = JSON.parse(
      data.getAttribute("data-ids_all_arr")
    );
    replaceAfterEdit.classList.add("reload-in-progress");
    var highlightAfterReload = replaceAfterEdit.classList.contains("highlighted");
    var preloadContainer = document.createElement("div");
    preloadContainer.classList.add("edited-gif");
    var preloadTrow = document.createElement("div");
    preloadTrow.classList.add("trow");
    var preloadInner = document.createElement("div");
    preloadInner.classList.add("edited-center");
    // show spinner until post re-caches/updates
    var preLoad = new Image();
    preLoad.src = loderGifSrc;
    preLoad.style.width = "32px;"
    preLoad.style.height = "32px";
    preLoad.classList.add("bm_load_img");
    preloadInner.appendChild(preLoad);
    preloadTrow.appendChild(preloadInner);
    preloadContainer.appendChild(preloadTrow);
    replaceAfterEdit.appendChild(preloadContainer);
    setTimeout(function () {
      // this reloads the brick DOM after edit/close
      var href = document.location.href.split(/[\/\?&#=]+/g);
      var isDraft = href[3] === "draft";
      var isQueue = href[3] === "queued";
      var draftQueue = isQueue ? "/posts/queue" :
                       isDraft ? "/posts/draft" : "/posts";
      var id = replaceAfterEdit.getAttribute("data-id");
      var idBefore = idsAllArr.indexOf(id) - 1 > -1 ?
                     idsAllArr[idsAllArr.indexOf(id) - 1] : -1;
      var index = idsAllArr.indexOf(id);
      getResponseText(
        "/api/v2/blog/" + name + draftQueue +
        "?limit=1&reblog_info=1&npf=1&" +
        (
          isDraft ?
            idBefore !== -1 ?
            "before_id=" + idBefore :
            ""
          :// sloppy ^ yet functional :)
          isQueue ? // thanks oddly Tumblr draft and queue API
          index !== -1 ?
            "offset=" + index :
            ""
          :
          "id=" + id
        ),
        function (api) {// post to replace
          if(typeof api === "string") {
            api = JSON.parse(api);
          }
          var t = ["text", "image", "chat", "ask",
                   "video", "audio", "link", "quote"];
          var p2r = document.getElementById("post_" + id);
          var me;
          var type;
          // TODO, delete the superflous content/me argument
          // and put this inside the makeBrick function...
          // but only if it breaks...
          // not broken; don't fix it :)
          if (
            typeof api.response !== "undefined" &&
            typeof api.response.posts !== "undefined"
          ) {
            var post = api.response.posts;
            if (
              typeof post[0].trail != "undefined" &&
              typeof post[0].trail[0] !== "undefined" &&
              typeof post[0].trail[0].layout !== "undefined" &&
              typeof post[0].trail[0].layout[0] !== "undefined"
            ) {
              me = post[0].trail[0].layout;
              type = me[0].type;
            }
            if (
              t.indexOf(type) === -1 &&
              typeof post[0].trail != "undefined" &&
              typeof post[0].trail[0] !== "undefined" &&
              typeof post[0].trail[0].content !== "undefined" &&
              typeof post[0].trail[0].content[0] !== "undefined"
            ) {
              me = post[0].trail[0].content;
              type = me[0].type;
            }
            if (
              t.indexOf(type) === -1 &&
              typeof post[0].content !== "undefined" &&
              typeof post[0].content[0] === "undefined" &&
              typeof post[0].trail !== "undefined" &&
              typeof post[0].trail[0] !== "undefined" &&
              typeof post[0].trail[0].content !== "undefined"
            ) {
              me = post[0].trail[0].content;
              type = me[0].type;
            }
            if (
              t.indexOf(type) === -1 &&
              typeof post[0].content !== "undefined" &&
              typeof post[0].content[1] !== "undefined" &&
              typeof post[0].content[1].subtype !== "undefined"
            ) {
              me = post[0].content;
              type = me[1].subtype; // chat, maybe
            }
            if (
              t.indexOf(type) === -1 &&
              typeof post[0].content !== "undefined" &&
              typeof post[0].content[0] !== "undefined"
            ) {
              me = post[0].content;
              type = me[0].type;
            }
            if (
              typeof me !== "undefined" &&
              typeof me[0] !== "undefined" &&
              typeof me[0].subtype !== "undefined" &&
              type !== me[0].subtype &&
              t.indexOf(me[0].subtype) !== -1
            ) {
              type = me[0].subtype;
            }
            var newBrick = makeBrickFromApiPost(
              post[0], type, me, p2r.getAttribute("data-index")
            ); // this third ^ me argument could be expunged
            newBrick.classList.add("laid");
            var lcontent = document.getElementsByClassName(
              "l-content"
            )[0];
            lcontent.replaceChild(newBrick, p2r);
            if (highlightAfterReload) {
              highlightBrick(
                document.getElementById("post_" + id), true
              );
            }
            pluginBuildColumns();
          }
        },
        [
          [
            "Authorization",
            "Bearer " + data.getAttribute("data-api-token")
          ]
        ]
      );
    }, 1000); // delay 1 secode for cache update, perhaps?
  };
  // end the brick reload function

  // this is how we upload photos/images
  var photoUploadAndSubmit = function () { // and repeat asynchronously
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var asDraftCheck = document.getElementById("photos_as_draft");
    var papb = document.getElementById("post_all_photos_button");
    if (!data.classList.contains("photo-upload-in-progress")) {
      data.classList.add("photo-upload-in-progress");
      asDraftCheck.disabled = true;
      papb.disabled = true;
    }
    var asDraft = asDraftCheck.checked;
    var apiKey = data.getAttribute("data-x-tumblr-form-key");
    var brk = document.getElementsByClassName("photo-brick");
    var brick = brk[brk.length - 1];
    brick.classList.add("upload-working");
    brick.scrollIntoView({behavior: "smooth"});
    var i;
    var rich = brick.getElementsByClassName("rich")[0];
    var img = brick.getElementsByClassName("photo-brick-img");
    var uploaded = brick.getElementsByClassName("uploaded");
    var squeakyToy = {};
    var code;
    var formData;
    var upImg;
    var api;
    // upload first or return or repeat
    if (uploaded.length !== img.length) {
      code = img[uploaded.length].firstChild.getAttribute("img-code");
      formData = new FormData();
      formData.append("photo", unreadFile[code]);
      getResponseText(
        {url: "/svc/post/upload_photo?source=post_type_form", post: formData},
        function(re){
          api = JSON.parse(re);
          if (
            typeof api !== "undefined" &&
            typeof api.response !== "undefined" &&
            typeof api.response[0] !== "undefined" &&
            typeof api.response[0].url !== "undefined"
          ) {
            img[uploaded.length].firstChild.src = api.response[0].url;
          }// whether we get the URL or not, the show must go on
          img[uploaded.length].classList.add("uploaded");
          photoUploadAndSubmit();
          // the fallback is to post a straight data url and let
          // Tumblr backend convert it to image/png etc on post
          // but that shouldn't have to happen
        },
        [
          ["X-tumblr-form-key", apiKey],
          ["X-Requested-With", "XMLHttpRequest"]
        ]
      );
      return;
    }
    // AFTER THE UPLOAD, SUMMER HAS GONE...
    brick.style.top = (0 - brick.clientHeight) + "px";
    // this v runs after that ^ runs for each photo to upload
    squeakyToy["post[two]"] = rich.innerHTML;
    squeakyToy["post[three]"] = "";
    // this post is an edit
    squeakyToy.channel_id = name;
    squeakyToy["post[type]"] = "photo";
    squeakyToy["post[state]"] = asDraft ? "1" : "0";
    squeakyToy["post[slug]"] = "";
    squeakyToy["post[date]"] = "";
    squeakyToy["post[publish_on]"] = "";
    if (img.length > 0) {
      var order = [];
      var oneone = "";
      var one = 0;
      for (i = 0; i < img.length; i++) {
        order.push("o" + (i+1));
        if (img[i].classList.contains("row-with-one-img")) {
          oneone += "1"; // new photoset order
          one = 0;
        }
        if (img[i].classList.contains("row-with-two-img")) {
          if (one === 0) {
            oneone += "2"; // new photoset order
          }
          ++one;
          if (one >= 2) {
            one = 0;
          }
        }
        if (img[i].classList.contains("row-with-three-img")) {
          if (one === 0) {
            oneone += "3"; // new photoset order
          }
          ++one;
          if (one >= 3) {
            one = 0;
          }
        }
        squeakyToy["images[o" + (i+1) + "]"] = img[i].firstChild.src;
        squeakyToy["caption[o" + (i+1) + "]"] = "";
      }
      squeakyToy["post[photoset_order]"] = order.join(",");
      squeakyToy["post[photoset_layout]"] = oneone;
    }
    squeakyToy["post[tags]"] = "";
    var tag = brick.getElementsByClassName("tag");
    var tags = [];
    if (tag.length > 0) {
      for (i = 0; i < tag.length; i++) {
        tags.push(tag[i].innerHTML);
      }
      squeakyToy["post[tags]"] = tags.join(",");
    }
    getResponseText( // this is step #2
      "/svc/secure_form_key",
      function(re2) {
        getResponseText(
          { // this is step #3
            url: "/svc/post/update",
            post: JSON.stringify(squeakyToy)
          },
          function(re3) {
            if (!JSON.parse(re3).errors) { // success image posted!
              if (brk.length > 0) {
                brick.parentNode.removeChild(brick);
              }
              if (brk.length > 0) {
                photoUploadAndSubmit();
              } else {
                var blogLink = document.createElement("a");
                var bigHome = svgForType.home.cloneNode(true);
                bigHome.setAttribute("width", "40");
                bigHome.setAttribute("height", "40");
                bigHome.setAttribute("fill", "#555");
                blogLink.appendChild(bigHome);
                blogLink.appendChild(
                  document.createTextNode(
                    "Visit your new posts..."
                  )
                );
                blogLink.id = "return_to_dash_link";
                blogLink.href = "/blog/" + name + (asDraft ? "/drafts" : "");
                data.classList.remove("photo-upload-in-progress");
                asDraftCheck.disabled = false;
                papb.disabled = false;
                document.body.appendChild(blogLink);
              }
            }
          },
          [ // the prev request brought us some puppies :)
            ["X-tumblr-puppies", re2.puppies],
            ["X-tumblr-form-key", apiKey],
            ["X-Requested-With", "XMLHttpRequest"],
            ["Content-Type", "application/json"],
            ["Accept", "application/json, text/javascript, */*; q=0.01"]
          ]
        );
      },
      [
        ["Accept", "application/json, text/javascript, */*; q=0.01"],
        ["X-tumblr-form-key", apiKey],
        ["X-Requested-With", "XMLHttpRequest"]
      ]
    );
  };
  // end photoUploadAndSubmit

  // this edits posts and reblogs posts,
  // and it can even clone posts accidentally :P
  var fetchEditSubmit = function (success) {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var isDraft = document.getElementById("re-as-draft").checked;
    var action = data.getAttribute("data-current_edit_action");
    var isReblog = action === "reblog";
    var href = document.location.href.split(/[\/\?&#=]+/g);
    var name = href[4];
    var reblogger = data.getAttribute("data-reblog-to-here"); // if any
    var apiKey = data.getAttribute("data-x-tumblr-form-key");
    var id;
    var key;
    var changes;
    var change;
    var brick;
    var editQueue = document.getElementsByClassName("edit-reblog-queue");
    // editReblog queue index
    var qIndex = parseInt(data.getAttribute("data-current_edit_index"));
    if (qIndex === -1) {
      id = data.getAttribute("data-single_edit_id");
      brick = document.getElementById("post_" + id);
      brick.classList.add("edit-reblog-queue");
      if (id === "0") {
        return; // just in case
      }
    } else { // batch  reblogEdit v / ^ single reblogEdit
      id = editQueue[qIndex].getAttribute("data-id");
      brick = document.getElementById("post_" + id);
    }
    var postInEdit = document.getElementById("post_" + id);
    key = postInEdit.getAttribute("data-reblog_key");
    if (apiKey !== "0") {
      getResponseText(// A Reblog/Edit Takes 4 AJAX Steps
        "/svc/post/fetch?" + (
          isReblog ?
          "reblog_id=" + id + "&reblog_key=" + key :
          "post_id=" + id
        ),
        // this is step #1
        function(re1) {
          var fetch = JSON.parse(re1).post;
          var bone = {}; // puppies / fetch / bone :)
          var reblog_post_id = typeof fetch.parent_id !== "undefined" ?
              fetch.parent_id :
          typeof fetch.root_id !== "undefined" ?
              fetch.root_id : id; // this is step #2// this is step #2
          // text chat quote
          if (typeof fetch.one !== "undefined") {
            bone["post[one]"] = fetch.one;
          }
          if (typeof fetch.two !== "undefined") {
            bone["post[two]"] = fetch.two;
          }
          if (typeof fetch.three !== "undefined") {
            bone["post[three]"] = fetch.three;
          }
          if (typeof fetch.source_url !== "undefined") {
            bone["post[source_url]"] = fetch.source_url;
          }
          if (typeof fetch["post[state]"] !== "undefined") {
            bone["post[state]"] = fetch["post[state]"];
          }
          bone["post[type]"] = fetch.type;
          if (isReblog) {
            // this post is a reblog
            bone.channel_id = reblogger;
            bone.reblog = true;
            bone.reblog_key = key;
            bone.reblog_post_id = reblog_post_id;
            bone.context_id = reblogger;
            bone["post[state]"] = isDraft ? "1" : "0";
            bone["post[slug]"] = ""; // bone, slug, and harmony :);
            bone["post[tags]"] = "";
            bone["post[date]"] = "";
            bone["post[publish_on]"] = "";
          } else {
            // this post is an edit
            bone.channel_id = name;
            bone.post_id = id;
            bone.edit_post_id = id;
            bone.reblog = false;
            bone["post[state]"] = fetch.state.toString();
            bone["post[slug]"] = fetch.slug; // lol what? :);
            bone["post[tags]"] = fetch.tags;
            bone["post[date]"] = fetch.date;
            bone["post[publish_on]"] = "";
            if (
              action !== "caption" &&
              action !== "backdate"
            ) {
              // simple edits, less dynamic and easy
              changes = JSON.parse(action);
              if(Array.isArray(changes)) {
                change = changes[qIndex];
              } else {
                change = changes;// turn and face the strange :)
              }
              for (var ch in change) {
                bone[ch] = change[ch];
              }
              var removeWhenDone =
                  typeof changes["post[state]"] !== "undefined" &&
                  changes["post[state]"] === "1" ||
                  changes["post[state]"] === "0" &&
                  href["3"] === "queued" ||
                  changes["post[state]"] === "0" &&
                  href["3"] === "draft" ||
                  changes["post[state]"] === "on.2" ||
                  changes["post[state]"] === "2"
            } else if (action === "caption") {
              var rich2 = document.getElementById(
                "rich_text_caption"
              );
              var b4 = document.getElementById(
                "prepend-caption-option"
              ).checked;
              var ow = document.getElementById(
                "overwrite-caption-option"
              ).checked;
              var af = document.getElementById(
                "append-caption-option"
              ).checked;
              bone["post[two]"] = af ? bone["post[two]"] + rich2.innerHTML:
                                  ow ? rich2.innerHTML:
                                  b4 ? rich2.innerHTML + bone["post[two]"] :
                                       bone["post[two]"] + rich2.innerHTML;//""?
            } else if (action === "backdate") {
              var isOneDay = document.getElementById(
                "bd-one-day"
              ).checked;
              var isTwoDay = document.getElementById(
                "bd-two-day"
              ).checked;
              var isNoDay = document.getElementById(
                "bd-no-day"
              ).checked;
              var isOneTime = document.getElementById(
                "bt-one-time"
              ).checked;
              var isTwoTime = document.getElementById(
                "bt-two-time"
              ).checked;
              var isNoTime = document.getElementById(
                "bt-no-time"
              ).checked;
              var mo1 = document.getElementById("moleft").value - 1;
              var mo2 = document.getElementById("moright").value - 1;
              var dt1 = document.getElementById("dtleft").value;
              var dt2 = document.getElementById("dtright").value;
              var yr1 = document.getElementById("yrleft").value;
              var yr2 = document.getElementById("yrright").value;
              var ho1 = document.getElementById("holeft").value;
              var ho2 = document.getElementById("horight").value;
              var mt1 = document.getElementById("mtleft").value;
              var mt2 = document.getElementById("mtright").value;
              var pm1 = document.getElementById("pmleft").checked;
              var pm2 = document.getElementById("pmright").checked;
              // 1000 because seconds to miliseconds...
              var ts = parseInt(editQueue[qIndex].getAttribute("data-timestamp"));
              var d1 = new Date();
              var d2 = new Date();
              if (isOneDay || isTwoDay) {
                d1.setMonth(mo1);
                d1.setDate(dt1);
                d1.setYear(yr1);
              }
              if (isOneTime || isTwoTime) {
                d1.setMinutes(mt1);
                d1.setHours(ho1 + pm1 ? 12 : 0);
              }
              if (isTwoDay) {
                d2.setMonth(mo2);
                d2.setDate(dt2);
                d2.setYear(yr2);
              }
              if (isTwoTime) {
                d2.setMinutes(mt2);
                d2.setHours(ho2 + pm2 ? 12 : 0);
              }
              var df = (d1.getTime() - d2.getTime()) / (editQueue.length+1);
              var b = new Date();
              b.setTime(d1.getTime() - df * qIndex);
              var dt = [
                "Jan ", "Feb ", "Mar ", "Apr ",
                "May ", "Jun ", "Jul ", "Aug ",
                "Sep ", "Oct ", "Nov ", "Dec "
              ][b.getMonth()] + b.getDate() + ", " + b.getFullYear();
              var h = (b.getHours() < 12 ? b.getHours() : b.getHours()-12);
              if (h === 0) {
                h = 12;
              }
              var time = " " + h + ":" +
                  (b.getMinutes()/100).toFixed(2).split(".")[1] + ":" +
                  (b.getSeconds()/100).toFixed(2).split(".")[1] +
                  (b.getHours() < 12 ? "am" : "pm");
              if (href[3] === "draft") {
                bone["post[publish_on]"] = dt + time;
                bone["post[state]"] = "on.2";
              } else {
                bone["post[date]"] = dt + time;
              }
            }
          }
          // photo posts
          if (typeof fetch.photos !== "undefined") {
            var order = [];
            var oneone = "";
            var photo;
            for (var i = 0; i < fetch.photos.length; i++) {
              photo = fetch.photos[i];
              order.push(photo.id);
              oneone += "1"; // backup photoset order
              bone["images[" + photo.id + "]"] = "";
              bone["caption[" + photo.id + "]"] = "";
            }
            bone["post[photoset_order]"] = order.join(",");
            bone["post[photoset_layout]"] = (
              typeof fetch.photoset_layout !== "undefined"
            ) ?
              fetch.photoset_layout : oneone;
          }
          getResponseText( // this is step #3
            "/svc/secure_form_key",
            function(re2) {
              getResponseText(
                { // this is step #4
                  url: "/svc/post/update",
                  post: JSON.stringify(bone)
                },
                function(re3) {
                  if (!JSON.parse(re3).errors) { // success reblogged!
                    brick.classList.remove("edit-reblog-queue");
                    if (!isReblog) {// assume edited appearance
                      if (
                        removeWhenDone
                      ) {
                        brick.parentNode.removeChild(brick);
                        pluginBuildColumns();
                      } else {
                        reloadBrick(brick);
                      }
                    } else {
                      reblogAnimation(id);
                    }
                    success(success);
                  } else {
                    brick.classList.remove("edit-reblog-queue");
                    success(success);// repeat for next
                  }
                },
                [ // the prev request brought us some puppies :)
                  ["X-tumblr-puppies", re2.puppies],
                  ["X-tumblr-form-key", apiKey],
                  ["X-Requested-With", "XMLHttpRequest"],
                  ["Content-Type", "application/json"],
                  ["Accept", "application/json, text/javascript, */*; q=0.01"]
                ]
              );
            },
            [
              ["Accept", "application/json, text/javascript, */*; q=0.01"],
              ["X-tumblr-form-key", apiKey],
              ["X-Requested-With", "XMLHttpRequest"]
            ]
          );
        },
        [
          ["Accept", "application/json, text/javascript, */*; q=0.01"],
          ["X-tumblr-form-key", apiKey],
          ["X-Requested-With", "XMLHttpRequest"]
        ]
      );
    }
  };
  // end the single fetchEdit reblog/edit

  // this function runs once v ^ then this goes repeatedly
  var fetchEditSubmitMulti = function () {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var highlighted = document.getElementsByClassName("highlighted");
    var qIndex = -1;
    for (var i = 0; i < highlighted.length; i++) {
      if (
        this.getAttribute("data-edit_action") === "reblog" &&
        highlighted[i].classList.contains("private")
      ) {
        continue;
      }
      qIndex++;
      highlighted[i].classList.add("edit-reblog-queue");
    }
    data.setAttribute("data-current_edit_index", qIndex);
    data.setAttribute(
      "data-current_edit_action",
      this.getAttribute("data-edit_action")
    );
    fetchEditSubmit(function(success){
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var qIndex = parseInt(data.getAttribute("data-current_edit_index"));
      qIndex--;
      if (qIndex >= 0) {
        data.setAttribute("data-current_edit_index", qIndex);
        fetchEditSubmit(success);
        // repeat
      }
    });
  };
  // end edit/reblogging stuff

  // extra chrome buttons and widgets, and nav-links
  var mpe = document.createElement("div");
  var mpeIcon = new Image();
  mpeIcon.width = 18;
  mpeIcon.height = 16;
  mpeIcon.src = // PNG is the monkey emoji from windows 8.1
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC' +
    'AAAAAcCAYAAAAAwr0iAAAABmJLR0QA/wD/AP+gvaeTAAAACX' +
    'BIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AUIEy8cVCgtoA' +
    'AAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTV' +
    'BkLmUHAAAGt0lEQVRIx62Xa2wU1xXHf/fO7MO7awMOdkyIU1' +
    'roIynhUbWGEh4BVB4NKDWvuGkaCkHQVHGkkGLvAkXFIpm1oa' +
    'QNBaXIxRAItagbmkARKCpQIkxJoUrSDy2VEESkYIgxNvauvb' +
    'Mzc/rBNjH4RSTOt7mPc/73f849/zuKPqzWmhe28RelVPBlD/' +
    '2QgbPHw3xjVnTHh9wj071N/Dn+s3CbCpZk0FI5UK4/nC2fhQ' +
    'dIw4qINFbVxF/8Tue6E9aiewfgT/HiLhPekDSBdVqpW2MKEP' +
    'SYCDefA/ib9ZQxObbv3gA4Fi9ifnQLAFs3rFXipEK+rBzyCn' +
    '6A63oACAo/KbKlfkWtVSjAi/csBVOj1VyMj+VQfGnOg8a1X2' +
    'aFfbu/PGYC949bSOQrBYhj39okdLCiZNAXCbaz/BfdvlXXgW' +
    'PxokEaryFDkngChHMZPGIM/ztzhAy/RrqsdTFOtapI8fTonr' +
    'P9BT5tzWVc7AAAr1f8ytB46oWSVU5nWrssnJMN6vrnRxVEXJ' +
    'Q27/RZB/LSuNjB6qPxp5kW3dvv6c9as7SJGzmnR84AFcj1Lr' +
    '8HXoPu81Io1S24oPAw3h0XO1hdVb7WnBbdS61V2GvgyooyAN' +
    'L4JyUJ3/iSd756mPffbRr3qofxxG0RUwRsm8BhUCkPLT05VA' +
    'gad8pR6+lNg+XaDNng0xNi+zlhLegRwLKSdQA4+GpctL6ihv' +
    '6wIHZwQFKFd6eVP3YLwPvWAibH/tgyKVYzu0Vlrb+psk8p5B' +
    'LwiaDq7/D79TA3X86Ruv21xtxigMmxGo5ZRT2C+G3Fpu8bOK' +
    'GkimwOqtTbALOiO58VjJG3AEyK1XA83u5genSPNTNa9VhB7O' +
    'BD42IHhtWrvFKFdONCIX6FV37CWrAYYGqsukcAGZIYrEA3M9' +
    'B/jSG+zvFMaVxzWwoej3Z38E78+SEZJGb3lmMDN2DgFh62fp' +
    'Lf3r6718M549EjHjr5gHwyNFOaMjrH3whEd+j+qjdEImziDO' +
    '9tXiEI+skgbc8BTIjtvw3E9ooNVPx83tWkCp8FVQgy/7Xy1z' +
    'TA7pUFzf0CsAnm2gTGgvRYlJ3dMUhyVa1VuEKWtYMAOBBfzv' +
    'KSte1APe/HIOdy5fLakfLPnN9VvNq3GHUxr4sU0BsIhYQ03u' +
    'aTw+cXv1P+fB7A3Oh2AE5ahUxfvffqVZW/UuMNVVCyhG19O+' +
    '20v8SXj/fTdmqgXMfrB69CsFUAm8AxQb2ukI+mRfdeADhq/Y' +
    'hpsbf4a/yZ4z7sKQkiI9L4z5v9EyCdrbcVVFLh3dcXEz5JiZ' +
    '/UVFsFpnro0yeshb9JqKxj06K/rwNIkLkxTy5NbFUZq/2klv' +
    'XLwKH4svEG7imT9Acm9p6gJNeAur+/faq9ZpSHxiZQ7eArTR' +
    'K6NCdWKSetefUe+sZEu+Zr+m6VzMCpmxLdtwXUprtZLyjVUR' +
    'sSoLUoSHLRABr9AAkVed9PasSrocqA7t+RxsAhU5pMgFbCV9' +
    'L46d6YeidDAR7GIx7aBzBI6o8D5EjdhNsAVJaX9VQBKQ9Nig' +
    'AALWpAwlYB94u8A1xMmtWAs3Uq326/VoYfREKSmGUesRYzM7' +
    'arXThK24VjS/mmoeO9o1kJssw20tMVQpPK1gAZJC74JfUPYH' +
    'znw6QvNhRCSgXrw7T8YXZ0h93BqqdxlY3/72Zn8APW8pyQSn' +
    'w3JIlhzfLxY4LO85PKVOKN9ZGmUWWfAwhJS1rjtTqYOJhnTJ' +
    'xWA3dSXwy0EVy/zb+2EfZ1KKNZYABLS9e/bbY/LhfOhRvzXX' +
    'wPGzj5A6WhzUN7HloE9ZGHrs3zPt3aUYxtCkm3EaRJZVc+4F' +
    '1811H+3QqZ3uvVxPG/YJeNKo4/kw5LIlfhLrLxf3rhlW8p83' +
    'B8yUxTGnfYBK5pvBhws7OCr+tc75wa3VBS8tN/hX8t5uH40l' +
    'GuNIxWyFdBofEGfXv14SsfWHNWuhhrBDXfwDXuTElEbq52MA' +
    'pBpTTuGA+DpIpE/22MxTRwy3zYg8/rRxY+W/rK8a4byza+mT' +
    'XZPTT5pDXvCaf1qeEG7miF5AH5HW00CFAQO/jxkfIlL2V4za' +
    'cdfGMc5RsuqJBPbFchuSbpfBNnIigczIaEytw6O1r1FoCpca' +
    'ua1H037gx+IL4ikuG+V2xKeh3gBmm9qBBXUA3AdZAmkDMAx+' +
    'NF6vHSqsvAZqrE2PrZplEGTmSwXHMypPnBgdLwqMYLeGidVJ' +
    'EPZ2TtrIZdn2tB2cZd31i3avF/rI3bia1a3vFbVhjSuE8q5J' +
    'spgmdNnMsGju64RoaNP2mr4PnvRd9s6iq9nep3N2Zt3M7/Ad' +
    'nvxY2Pj+AwAAAAAElFTkSuQmCC';
  mpe.id = "mpe_title";
  mpe.appendChild(mpeIcon);
  mpe.setAttribute("title", "Mass Post Editor Features 4");
  en = document.getElementsByClassName("editor_navigation")[0];
  var selectAllFrag = document.createDocumentFragment();
  selectAllFrag.appendChild(svgForType.select.cloneNode(true));
  var selectAllSpan = document.createElement("span");
  selectAllSpan.appendChild(document.createTextNode("Select 100"));
  selectAllFrag.appendChild(selectAllSpan);
  var selectAll_chrome = newChromeButton("select-all", selectAllFrag, false);
  var selectByFrag = document.createDocumentFragment();
  selectByFrag.appendChild(svgForType.select.cloneNode(true));
  selectByFrag.appendChild(document.createTextNode("Select By"));
  var selectBy_chrome = newChromeButton("select-by", selectByFrag, true);
  var selectBy_widget = selectBy_chrome.getElementsByClassName(
    "widget"
  )[0];
  selectBy_widget.style.top = "50px";
  selectBy_widget.style.right = "90px";
  // this shows the select-by widget and populates it with tags/types
  selectBy_chrome.getElementsByTagName("input")[0].
    addEventListener("change", populateSelectByWidget);
  var pauseFrag1 = document.createDocumentFragment();
  var playSpan = document.createElement("span");
  playSpan.classList.add("play");
  playSpan.innerHTML = "&#x25B6;";
  var pauseSpan = document.createElement("span");
  pauseSpan.classList.add("pause");
  pauseSpan.innerHTML = "&#x2590;&#x2590;";
  pauseFrag1.appendChild(playSpan);
  pauseFrag1.appendChild(pauseSpan);
  var pause_chrome = newChromeButton(
    "pause", pauseFrag1, false
  );
  var pauseFrag2 = document.createDocumentFragment();
  var canvas = document.createElement("canvas");
  canvas.id = "status";
  canvas.width = 72;
  canvas.height = 15;
  var pLoaded = document.createElement("span");
  pLoaded.id = "p_loaded";
  pLoaded.appendChild(
    document.createTextNode("x0")
  );
  pauseFrag2.appendChild(canvas);
  pauseFrag2.appendChild(pLoaded);
  var ajaxInfo_chrome = newChromeButton(
    "ajax-info", pauseFrag2, false
  );
  // gutter control (easy)
  var gutterFrag = document.createDocumentFragment();
  var gutterInputCheck = document.createElement("input");
  gutterInputCheck.type = "checkbox";
  gutterInputCheck.checked = false;
  var gutterInputNumber = document.createElement("input");
  gutterInputNumber.type = "number";
  gutterInputNumber.value = 6;
  gutterInputCheck.id = "gutter-checkbox";
  var gutterLabel = document.createTextNode("Gutter");
  var newGutterChange = function () {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var newGutter = gutterInputNumber.value;
    if (gutterInputCheck.checked) {
      data.setAttribute("data-column_gutter", newGutter);
    } else {
      data.setAttribute("data-column_gutter", "6");
    }
    pluginBuildColumns();
  };
  gutterInputCheck.addEventListener("change", newGutterChange);
  gutterInputNumber.addEventListener("change", newGutterChange);
  gutterFrag.appendChild(gutterInputCheck);
  gutterFrag.appendChild(gutterLabel);
  gutterFrag.appendChild(gutterInputNumber);
  gutterInputNumber.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
  });
  gutterInputCheck.addEventListener("click", function(e) {
    this.checked = !this.checked;
  });
  var gutter_chrome = newChromeButton(
    "gutter", gutterFrag, false
  );
  gutter_chrome.getElementsByTagName("button")[0].
    addEventListener("click", function() {
    var b = this.getElementsByTagName("input")[0];
    b.checked = !b.checked;
    newGutterChange();
  });
  // view captions
  var hoverSpan = document.createElement("span");
  var hoverLabel = document.createElement("label");
  var hoverCheck = document.createElement("input");
  hoverCheck.type = "checkbox";
  hoverCheck.id = "hover-only";
  hoverCheck.addEventListener("change", function () {
    var lcontent = document.getElementsByClassName("l-content")[0];
    if (this.checked) {
      lcontent.classList.remove("hoverless");
      setCookie("view_hover", "on", 99);
    } else {
      lcontent.classList.add("hoverless");
      setCookie("view_hover", "", -1);
    }
  });
  hoverLabel.appendChild(
    svgForType.see.cloneNode(true)
  );
  hoverLabel.appendChild(
    document.createTextNode("+Hover")
  );
  hoverLabel.setAttribute("for", "hover-only");
  hoverSpan.appendChild(hoverCheck);
  hoverSpan.appendChild(hoverLabel);
  var captionsFrag = document.createDocumentFragment();
  captionsFrag.appendChild(svgForType.see.cloneNode(true));
  captionsFrag.appendChild(svgForType.caption.cloneNode(true));
  var captions_chrome = newChromeButton(
    "view-captions", captionsFrag, false
  );
  captions_chrome.getElementsByTagName(
    "button"
  )[0].addEventListener("click", function () {
    var lcontent = document.getElementsByClassName("l-content")[0];
    if (lcontent.classList.contains("with-captions")) {
      lcontent.classList.remove("with-captions");
      setCookie("view_captions", "", -1);
      this.removeAttribute("style");
      for (i = 0; i < 2; i++) {
        this.getElementsByTagName("svg")[i].setAttribute("fill", "#fff");
      }
    } else {
      lcontent.classList.add("with-captions");
      setCookie("view_captions", "on", 99);
      this.style.color = "rgba(0,65,100,1)";
      this.children[0].setAttribute("fill", "rgba(0,65,100,1");
      this.style.boxShadow = "inset 0 3px 2px 2px rgba(0,0,0,0.4)";
      for (i = 0; i < 2; i++) {
        this.getElementsByTagName("svg")[i].setAttribute(
		  "fill", "rgba(0,65,100,1)"
		);
      }
    }
  });
  // editlinksReblogLikeButton
  var linksFrag = document.createDocumentFragment();
  linksFrag.appendChild(svgForType.see.cloneNode(true));
  linksFrag.appendChild(svgForType.notes.cloneNode(true));
  linksFrag.appendChild(svgForType["reblog-self"].cloneNode(true));
  linksFrag.appendChild(svgForType.edit.cloneNode(true));
  var links_chrome = newChromeButton(
    "view-links", linksFrag, false
  );
  links_chrome.getElementsByTagName(
    "button"
  )[0].addEventListener("click", function () {
    var i;
    var lcontent = document.getElementsByClassName("l-content")[0];
    if (lcontent.classList.contains("with-links")) {
      for (i = 0; i < 4; i++) {
        this.getElementsByTagName("svg")[i].setAttribute("fill", "#fff");
      }
      this.removeAttribute("style");
      lcontent.classList.remove("with-links");
      setCookie("view_links", "", -1);
    } else {
      for (i = 0; i < 4; i++) {
        this.getElementsByTagName("svg")[i].setAttribute("fill", "rgba(0,65,100,1)");
      }
      this.style.boxShadow = "inset 0 3px 2px 2px rgba(0,0,0,0.4)";
      lcontent.classList.add("with-links");
      setCookie("view_links", "on", 99);
    }
  });
  // pause buttons
  pause_chrome.getElementsByTagName(
    "button"
  )[0].classList.add("playing");
  pause_chrome.getElementsByTagName(
    "button"
  )[0].addEventListener("click", function () {
    if (this.classList.contains("done")) {
      return;
    }
    var b = this.classList.contains("playing");
    this.classList.add(b?"paused":"playing");
    this.classList.remove(!b?"paused":"playing");
  });
  ajaxInfo_chrome.getElementsByTagName(
    "button"
  )[0].addEventListener("click", function () {
    var pause = document.getElementById(
      "pause_button"
    );
    if (pause.classList.contains("done")) {
      return;
    }
    var b = pause.classList.contains("playing");
    pause.classList.add(b?"paused":"playing");
    pause.classList.remove(!b?"paused":"playing");
  });
  ajaxInfo_chrome.setAttribute(
    "title", "Time Till Next Page - Posts Loaded"
  );
  pause_chrome.setAttribute("title", "Pause Page Loading");
  selectAll_chrome.getElementsByTagName("button")[0].
    addEventListener(
    "click",
    function () {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      var idsAllArr = JSON.parse(
        data.getAttribute("data-ids_all_arr")
      );
      var alreadyHidden = data.classList.contains(
        "some-posts-already-hidden"
      );
      var visibleIdsAllArr = JSON.parse(
        data.getAttribute("data-visible_ids_all_arr")
      );
      var needle = parseFloat(
        data.getAttribute("data-select-all_needle")
      );
      var id;
      var hlBrick;
      var unSelctBrick;
      var firstNeedle = needle;
      var i;
      var limit = 100; // tumblr limit; not mine
      var selectedCount = 0;
      unSelctBrick = document.getElementsByClassName("highlighted");
      while (unSelctBrick.length > 0 ) {
        highlightBrick(unSelctBrick[0], 0);
      }
      if (alreadyHidden) { // select from visible
        while(
          needle < visibleIdsAllArr.length &&
          needle < firstNeedle + limit
        ) {
          id = visibleIdsAllArr[needle];
          hlBrick = document.getElementById("post_" + id);
          if (hlBrick !== null) {
            highlightBrick(hlBrick, 1);
            selectedCount++;
          }
          needle++;
        }
      } else { // select from all
        while(
          needle < idsAllArr.length &&
          needle < firstNeedle + limit
        ) {
          id = idsAllArr[needle];
          hlBrick = document.getElementById("post_" + id);
          if (hlBrick !== null) {
            highlightBrick(hlBrick, 1);
            selectedCount++;
          }
          needle++;
        }
      }
      this.getElementsByTagName("span")[0].innerHTML = "100 More";
      if (selectedCount < limit) {
        needle = 0;
        this.getElementsByTagName("span")[0].innerHTML = "Select 100";
      }
      data.setAttribute("data-select-all_needle", needle);
    }
  );
  document.getElementById(
    "delete_posts"
  ).parentNode.classList.add("remove-in-third-party-mode");
  document.getElementById(
    "delete_posts"
  );
  document.getElementById(
    "remove_tags"
  ).parentNode.classList.add("remove-in-third-party-mode");
  document.getElementById(
    "add_tags"
  ).parentNode.classList.add("remove-in-third-party-mode");
  var href = document.location.href.split(/[\/\?&#=]+/g);
  var name = href[4];
  links_chrome.setAttribute(
    "title",
    href[5] !== "follows" && href[5] !== "following" ?
    "Links: See tags. View Posts. Edit posts." :
    "Links: Follow/Unfollow URL Peepr ect."
  );
  captions_chrome.setAttribute("title", "See photo captions.");
  selectBy_chrome.setAttribute("title", "Select posts by tag.");
  ajaxInfo_chrome.setAttribute("title", "Pause posts loading.");
  selectBy_chrome.setAttribute("title", "Pause posts loading.");
  selectAll_chrome.setAttribute("title", "Select all posts.");
  gutter_chrome.setAttribute("title", "Create bigger gutters.");
  // this is the make private button
  var privateFrag = document.createDocumentFragment();
  privateFrag.appendChild(svgForType.private.cloneNode(true));
  var privateSpan = document.createElement("span");
  privateSpan.appendChild(document.createTextNode("Private"));
  privateFrag.appendChild(privateSpan);
  var private_chrome = newChromeButton("private", privateFrag, false);
  private_chrome.classList.add("remove-in-third-party-mode");
  private_chrome.getElementsByTagName(
    "button"
  )[0].addEventListener("click", fetchEditSubmitMulti);
  private_chrome.getElementsByTagName("button")[0].
    disabled = true;
  private_chrome.getElementsByTagName("button")[0].
    classList.add("disable-when-none-selected");
  private_chrome.classList.add("remove-in-third-party-mode");
  private_chrome.classList.add("remove-in-drafts-queue-mode");
  private_chrome.setAttribute("title", "Make selected private/unprivate.");
  // append chromeButtons
  var unselectFrag = document.createDocumentFragment();
  var unselectIcon = svgForType.unselect.cloneNode(true);
  unselectIcon.setAttribute("width", "15");
  unselectIcon.setAttribute("height", "15");
  unselectFrag.appendChild(unselectIcon);
  var unselectSpan = document.createElement("span");
  unselectSpan.classList.add("chrome_button");
  unselectSpan.appendChild(document.createTextNode("UnSelect"));
  unselectFrag.appendChild(unselectSpan);
  var cbr = document.createElement("span");
  cbr.classList.add("chrome_button_right");
  unselectFrag.appendChild(cbr);
  var unslect = document.getElementById("unselect")
  unslect.innerHTML = "";
  unslect.appendChild(unselectFrag);
  var unPnt = unslect.parentNode;
  var rtPnt = document.getElementById("remove_tags").parentNode;
  var dlPnt = document.getElementById("delete_posts").parentNode;
  // editor navigation
  var remTag = document.getElementById("remove_tags").children[0];
  remTag.innerHTML = "";
  var remFrag = document.createDocumentFragment();
  var remSymbol = document.createElement("h2");
  remSymbol.appendChild(document.createTextNode("-"));
  var addTag = document.getElementById("add_tags").children[0];
  addTag.innerHTML = "";
  remFrag.appendChild(remSymbol);
  remFrag.appendChild(document.createTextNode("Tags"));
  var addSymbol = document.createElement("h2");
  var addFrag = document.createDocumentFragment();
  addSymbol.appendChild(document.createTextNode("+"));
  addFrag.appendChild(addSymbol);
  var captionFrag = document.createDocumentFragment();
  captionFrag.appendChild(addSymbol.cloneNode(true));
  captionFrag.appendChild(document.createTextNode("Caption"));
  var caption_chrome = newChromeButton("add-caption", captionFrag, true);
  caption_chrome.classList.add("remove-in-third-party-mode");
  var caption_widget = caption_chrome.getElementsByClassName("widget")[0];
  var caption_check = caption_chrome.getElementsByTagName("input")[0];
  caption_check.classList.add("disable-when-none-selected");
  caption_check.disabled = true;
  caption_chrome.setAttribute("title", "Caption selected posts.");
  // this part is all add caption widget
  var rich2 = document.createElement("div");
  rich2.setAttribute("title", "caption");
  rich2.id = "rich_text_caption";
  rich2.contentEditable = true;
  rich2.designMode = "on";
  rich2.classList.add("rich");
  appendRichButtons(caption_widget, rich2, caption_widget);
  var captionTitle = document.createElement("h2");
  captionTitle.appendChild(
    document.createTextNode("Caption Posts")
  );
  var captionSubtitle = document.createElement("div");
  captionSubtitle.appendChild(
    document.createTextNode("Image,Video,Audio,Quote,Link,Chat, and Text")
  );
  caption_widget.appendChild(captionTitle);
  caption_widget.appendChild(captionSubtitle);
  caption_widget.appendChild(rich2);
  var pendContainer = document.createElement("div");
  pendContainer.classList.add("pend-container");
  var pend1 = document.createElement("div");
  var pend2 = document.createElement("div");
  var pend3 = document.createElement("div");
  var b4Radio = document.createElement("input");
  b4Radio.id = "prepend-caption-option";
  var b4Label = document.createElement("label");
  b4Label.setAttribute("for", "prepend-caption-option");
  b4Label.appendChild(document.createTextNode("Prepend"));
  var owRadio = document.createElement("input");
  owRadio.id = "overwrite-caption-option";
  var owLabel = document.createElement("label");
  owLabel.setAttribute("for", "overwrite-caption-option");
  owLabel.appendChild(document.createTextNode("Overwrite"));
  var owWarn = document.createElement("span");
  owWarn.classList.add("robot-warning");
  owWarn.appendChild(
    document.createTextNode(
      "This will erase and replace the whole text body of any post."
    )
  );
  var afRadio = document.createElement("input");
  afRadio.id = "append-caption-option";
  var afLabel = document.createElement("label");
  afLabel.setAttribute("for", "append-caption-option");
  afLabel.appendChild(document.createTextNode("Append"));
  b4Radio.type = "radio";
  b4Radio.name = "pend";
  b4Radio.classList.add("pend");
  pend1.appendChild(b4Radio);
  pend1.appendChild(b4Label);
  owRadio.type = "radio";
  owRadio.name = "pend";
  owRadio.classList.add("pend");
  pend2.appendChild(owRadio);
  pend2.appendChild(owLabel);
  pend2.appendChild(owWarn);
  afRadio.type = "radio";
  afRadio.name = "pend";
  afRadio.classList.add("pend");
  afRadio.checked = true;
  pend3.appendChild(afRadio);
  pend3.appendChild(afLabel);
  pendContainer.appendChild(pend1);
  pendContainer.appendChild(pend2);
  pendContainer.appendChild(pend3);
  caption_widget.appendChild(pendContainer);
  var capButt = butt("Add Caption");
  capButt.id = "add-caption_button2";
  capButt.setAttribute("data-edit_action", "caption");
  capButt.style.top = "268px";
  capButt.style.right = "9px";
  capButt.style.padding = "0 7px";
  capButt.addEventListener("click", fetchEditSubmitMulti);
  caption_widget.appendChild(capButt);
  var cancelCaption = butt("Cancel3");
  cancelCaption.addEventListener("click", function () {
    document.getElementById("add-caption").checked = false;
  });
  cancelCaption.style.top = "238px";
  cancelCaption.style.right = "9px";
  cancelCaption.style.padding = "0 7px";
  cancelCaption.setAttribute("title", "Close widget");
  caption_widget.appendChild(cancelCaption);
  // this part is backdate widget
  var scheduleInstead = href[3] === "draft";
  var backdateFrag = document.createDocumentFragment();
  backdateFrag.appendChild(
    svgForType.clock.cloneNode(true)
  );
  backdateFrag.appendChild(
    document.createTextNode(scheduleInstead ? "Schedule" : "BackDate")
  );
  var backdate_chrome = newChromeButton(
    "backdate", backdateFrag, true
  );
  backdate_chrome.classList.add("remove-in-third-party-mode");
  var backdate_widget = backdate_chrome.getElementsByClassName("widget")[0];
  var backdate_check = backdate_chrome.getElementsByTagName("input")[0];
  backdate_check.addEventListener("change", function () {
    if (!this.checked) {
      return;
    }
    var hl = document.getElementsByClassName("highlighted");
    var d1 = new Date(
      parseInt(
        hl[0].getAttribute("data-timestamp")
      ) * 1000
    );
    var d2 = new Date(
      parseInt(
        hl[hl.length-1].getAttribute("data-timestamp")
      ) * 1000
    );
    var inp = new Event("input");
    document.getElementById("moleft").value = d1.getMonth() + 1;
    document.getElementById("moright").value = d2.getMonth() + 1;
    document.getElementById("dtleft").value = d1.getDate();
    document.getElementById("dtright").value = d2.getDate();
    document.getElementById("yrleft").value = d1.getFullYear();
    document.getElementById("yrright").value = d2.getFullYear();
    document.getElementById("holeft").value = d1.getHours() >= 12 ?
      d1.getHours() - 12 : d1.getHours();
    document.getElementById("horight").value = d2.getHours()>= 12 ?
      d2.getHours() - 12 : d2.getHours();
    document.getElementById("mtleft").value = d1.getMinutes();
    document.getElementById("mtright").value = d2.getMinutes();
    document.getElementById("pmleft").checked = d1.getHours() >= 12;
    document.getElementById("pmright").checked = d2.getHours() >= 12;
    document.getElementById("moleft").dispatchEvent(inp);
    document.getElementById("moright").dispatchEvent(inp);
    document.getElementById("mtleft").dispatchEvent(inp);
    document.getElementById("mtright").dispatchEvent(inp);
  });
  backdate_check.classList.add("disable-when-none-selected");
  backdate_check.disabled = true;
  backdate_chrome.setAttribute(
    "title", scheduleInstead ?
    "Schedule up to 200 posts." :
    "Backdate selected posts."
  );
  var bdBody = document.createElement("div");
  bdBody.id = "backdate-body";
  var backdateTitle = document.createElement("h2");
  var backdateRules = document.createElement("div");
  backdateTitle.appendChild(
    document.createTextNode(
      scheduleInstead ?
      "Schedule Month/Date/Year":
      "BackDate Month/Date/Year"
    )
  );
  backdateRules.appendChild(
    document.createTextNode(" ")
  );
  bdBody.appendChild(backdateTitle);
  bdBody.appendChild(backdateRules);
  // I don't like new-fangled type="date" inputs that throw NaN sometimes
  var dateByNumbers = function(id){ // I'm old fashioned like Safari
    var d = new Date();
    var container = document.createElement("div");
    container.classList.add("date-input-bunch");
    var day = document.createElement("label");
    var thday = [
      "Sun ", "Mon ", "Tue ", "Wed ",
      "Thu ", "Fri ", "Sat "
    ];
    day.innerText = thday[d.getDay()];
    var mo = document.createElement("input");
    mo.type = "number";
    mo.value = d.getMonth() + 1;
    mo.id = "mo" + id;
    mo.classList.add("linput");
    var moLabel = document.createElement("label");
    moLabel.classList.add("rlabel");
    moLabel.setAttribute("for", "mo" + id);
    var month = [0,
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];
    moLabel.innerText = month[d.getMonth()+1];
    var dt = document.createElement("input");
    dt.type = "number";
    dt.value = d.getDate();
    dt.id = "dt" + id;
    var dtLabel = document.createElement("label");
    dtLabel.setAttribute("for", "dt" + id);
    dtLabel.classList.add("narrow");
    dt.classList.add("linput");
    dtLabel.classList.add("rlabel");
    var px = function (b) {
      var px = ["th", "st", "nd", "rd", "th", "th",
                "th", "th", "th", "th", "th"][b % 10];
      if (b === 12 || b === 11) {
        px = "th ";
      }
      return px;
    };
    var yr = document.createElement("input");
    yr.type = "number";
    yr.id = "yr" + id;
    yr.value = d.getFullYear();
    dtLabel.innerText = px(d.getDate());
    var inputs = function () {
      if (this === mo && mo.value < 1) {
        mo.value = 12;
      }
      if (this === mo && mo.value > 12) {
        mo.value = 1;
      }
      var s = mo.value.toString();
      if (
        this === mo &&
        (
          s.length >= 2 && s.charAt(0) === "1" ||
          s.length >= 1 && s.charAt(0) !== "1"
        )
      ) {
        dt.focus();
      }
      s = dt.value.toString();
      if (
        this === dt &&
        (
          s.length >= 2 && s.charAt(0) === "1" ||
          s.length >= 1 && s.charAt(0) !== "1" &&
          s.charAt(0) !== "2" && s.charAt(0) !== "3"
        )
      ) {
        yr.focus();
      }
      var newD = new Date(yr.value, mo.value, 0);
      if (this === dt && dt.value <= 0) {
        dt.value = newD.getDate();
      }
      if (this === dt && dt.value > newD.getDate()) {
        dt.value = 1;
      }
      if (this === yr && dt.value < 0) {
        dt.value = 1;
      }
      if (this === yr && dt.value > newD.getDate()) {
        dt.value = newD.getDate();
      }
      newD = new Date(yr.value, mo.value-1, dt.value);
      day.innerText = thday[newD.getDay()];
      moLabel.innerText = month[mo.value];
      dtLabel.innerText = px(dt.value);
    };
    mo.addEventListener("input", inputs);
    dt.addEventListener("input", inputs);
    yr.addEventListener("input", inputs);
    var thisSelect = function () {
      this.select();
    };
    mo.addEventListener("focus", thisSelect);
    dt.addEventListener("focus", thisSelect);
    yr.addEventListener("focus", thisSelect);
    container.appendChild(mo);
    container.appendChild(moLabel);
    container.appendChild(dt);
    container.appendChild(dtLabel);
    container.appendChild(yr);
    container.appendChild(day);
    return container;
  };
  var bddate1 = dateByNumbers("left");
  var bddate2 = dateByNumbers("right");
  var bdrowDate = document.createElement("div");
  var bdinput1 = document.createElement("input");
  var bdinput2 = document.createElement("input");
  var bdinput3 = document.createElement("input");
  var bdlabel1 = document.createElement("label");
  var bdlabel2 = document.createElement("label");
  var bdlabel3 = document.createElement("label");
  bdinput1.id = "bd-no-day";
  bdinput2.id = "bd-one-day";
  bdinput3.id = "bd-two-day";
  bdinput2.checked = true;
  bdinput1.name = "bd-date-option";
  bdinput2.name = "bd-date-option";
  bdinput3.name = "bd-date-option";
  bdlabel1.setAttribute("for", "bd-no-day");
  bdlabel2.setAttribute("for", "bd-one-day");
  bdlabel3.setAttribute("for", "bd-two-day");
  bdlabel1.appendChild(
    document.createTextNode("Keep Same Date")
  );
  bdlabel2.appendChild(
    document.createTextNode("All Same Date")
  );
  bdlabel3.appendChild(
    document.createTextNode("Between Dates")
  );
  bdinput1.type = "radio";
  bdinput2.type = "radio";
  bdinput3.type = "radio";
  bdrowDate.appendChild(bdinput2);
  bdrowDate.appendChild(bdlabel2);
  bdrowDate.appendChild(bdinput3);
  bdrowDate.appendChild(bdlabel3);
  bdrowDate.appendChild(bdinput1);
  bdrowDate.appendChild(bdlabel1);
  bdrowDate.appendChild(bddate1);
  bdrowDate.appendChild(bddate2);
  bdBody.appendChild(bdrowDate);
  backdateTitle = document.createElement("h2");
  backdateRules = document.createElement("div");
  backdateTitle.appendChild(
    document.createTextNode(
      scheduleInstead ?
      "Schedule Hour:Minute":
      "BackDate Hour:Minute"
    )
  );
  backdateRules.appendChild(
    document.createTextNode(" ")
  );
  bdBody.appendChild(backdateTitle);
  bdBody.appendChild(backdateRules);
  var btrowTime = document.createElement("div");
  var btinput1 = document.createElement("input");
  var btinput2 = document.createElement("input");
  var btinput3 = document.createElement("input");
  var btlabel1 = document.createElement("label");
  var btlabel2 = document.createElement("label");
  var btlabel3 = document.createElement("label");
  btinput1.id = "bt-no-time";
  btinput2.id = "bt-one-time";
  btinput3.id = "bt-two-time";
  btinput1.checked = true;
  btinput1.name = "bt-time-option";
  btinput2.name = "bt-time-option";
  btinput3.name = "bt-time-option";
  btlabel1.setAttribute("for", "bt-no-time");
  btlabel2.setAttribute("for", "bt-one-time");
  btlabel3.setAttribute("for", "bt-two-time");
  btlabel1.appendChild(
    document.createTextNode("Keep Same Time")
  );
  btlabel2.appendChild(
    document.createTextNode("All Same Time")
  );
  btlabel3.appendChild(
    document.createTextNode("Between Times")
  );
  btinput1.type = "radio";
  btinput2.type = "radio";
  btinput3.type = "radio";
  btrowTime.appendChild(btinput2);
  btrowTime.appendChild(btlabel2);
  btrowTime.appendChild(btinput3);
  btrowTime.appendChild(btlabel3);
  btrowTime.appendChild(btinput1);
  btrowTime.appendChild(btlabel1);
  var timeByNumbers = function(id){
    var d = new Date();
    var container = document.createElement("div");
    container.classList.add("date-input-bunch");
    var ho = document.createElement("input");
    ho.type = "number";
    ho.value = d.getHours();
    ho.id = "ho" + id;
    ho.classList.add("linput");
    var hoLabel = document.createElement("label");
    hoLabel.classList.add("rlabel");
    hoLabel.setAttribute("for", "ho" + id);
    hoLabel.innerText = ":"
    hoLabel.classList.add("narrow");
    var mt = document.createElement("input");
    mt.type = "number";
    mt.value = d.getMinutes();
    mt.id = "mt" + id;
    mt.classList.add("linput");
    var pm = document.createElement("input");
    pm.type = "checkbox";
    pm.id = "pm" + id;
    var pmLabel = document.createElement("label");
    pmLabel.checked = d.getHours() >= 12;
    pmLabel.setAttribute("for", "pm" + id);
    pmLabel.classList.add("rlabel");
    var inputs = function () {
      if (ho.value >= 12) {
        ho.value = 1;
      }
      if (ho.value <= 0) {
        ho.value = 12;
      }
      if (mt.value > 60) {
        mt.value = 1;
      }
      if (mt.value < 0) {
        mt.value = 60;
      }
      var s = ho.value.toString();
      if (
        this === ho &&
        (
          s.length >= 2 && s.charAt(0) === "1" ||
          s.length >= 1 && s.charAt(0) !== "1"
        )
      ) {
        mt.focus();
      }
      if (mt.value <= 9) {
        mt.value = "0" + mt.value;
      }
    };
    inputs();
    ho.addEventListener("input", inputs);
    mt.addEventListener("input", inputs);
    var thisSelect = function () {
      this.select();
    };
    ho.addEventListener("focus", thisSelect);
    mt.addEventListener("focus", thisSelect);
    container.appendChild(ho);
    container.appendChild(hoLabel);
    container.appendChild(mt);
    container.appendChild(pm);
    container.appendChild(pmLabel);
    return container;
  };
  var btTime1 = timeByNumbers("left");
  var btTime2 = timeByNumbers("right");
  btrowTime.appendChild(btTime1);
  btrowTime.appendChild(btTime2);
  bdBody.appendChild(btrowTime);
  backdateRules = document.createElement("i");
  backdateRules.appendChild(
    document.createTextNode(
      "Visual Post-Brick-Re-Order Happens After Reload"
    )
  );
  var backdate2 = butt("Backdate2");
  if (scheduleInstead) {
    backdate2.children[0].innerHTML = "Schedule";
  }
  backdate2.setAttribute("data-edit_action", "backdate");
  var cancelBackdate = butt("Cancel4");
  cancelBackdate.addEventListener("click", function () {
    document.getElementById("backdate").checked = false;
  });
  backdate2.addEventListener("click", fetchEditSubmitMulti);
  bdBody.appendChild(backdateRules);
  bdBody.appendChild(backdate2);
  bdBody.appendChild(cancelBackdate);
  backdate_widget.appendChild(bdBody);
  // this is the other stuff that squeezes into a widget/button
  var urlFrag = document.createDocumentFragment();
  var urlSVG = svgForType.symlink.cloneNode(true);
  urlSVG.setAttribute("viewBox", "2 2 13 13");
  urlFrag.appendChild(urlSVG); // :D
  urlFrag.appendChild(
    document.createTextNode("URLs")
  );
  var url_chrome = newChromeButton(
    "urlstuff", urlFrag, true
  );
  url_chrome.classList.add("remove-in-third-party-mode");
  var url_widget = url_chrome.getElementsByClassName("widget")[0];
  var url_check = url_chrome.getElementsByTagName("input")[0];
  url_check.disabled = true;
  url_check.classList.add("disable-when-none-selected");
  var urlRow1 = document.createElement("div");
  var urlTitle1 = document.createElement("h2");
  urlTitle1.appendChild(
    document.createTextNode("Source URL")
  );
  urlRow1.appendChild(urlTitle1);
  var urlInput1 = document.createElement("input"); // source URL
  urlInput1.type = "text";
  urlInput1.id = "source_url";
  var urlRow2 = document.createElement("div");
  var urlTitle2 = document.createElement("h2");
  urlTitle2.appendChild(
    document.createTextNode("ClickThrough Link")
  );
  var urlInput2 = document.createElement("input"); // clickthrough
  urlInput2.type = "text";
  urlInput2.id = "clickthrough";
  var urlRow3 = document.createElement("div");
  var urlTitle3 = document.createElement("h2");
  urlTitle3.innerHTML = ".../URL/<b>slug</b>";
  var urlInput3 = document.createElement("input"); // slug
  urlInput3.type = "text";
  urlInput3.id = "slug";
  var urlThing = document.createElement("div");
  urlThing.id = "urlstuff_body";
  var addURL = butt("Add URLs");
  addURL.addEventListener("click", fetchEditSubmitMulti);
  var setURLValues = function () {
    var changes = {
      "post[three]": urlInput2.value,
      "post[source_url]": urlInput1.value,
      "post[slug]": urlInput3.value
    };
    addURL.setAttribute("data-edit_action", JSON.stringify(changes));
  };
  setURLValues();
  urlInput1.addEventListener("input", setURLValues);
  urlInput2.addEventListener("input", setURLValues);
  urlInput3.addEventListener("input", setURLValues);
  var urlRules1 = document.createElement("div");
  urlRules1.appendChild(
    document.createTextNode("(Original Posts Only)")
  );
  var urlRules2 = document.createElement("div");
  urlRules2.appendChild(
    document.createTextNode("Leave Blank to Remove")
  );
  var urlRules3 = document.createElement("div");
  urlRules3.appendChild(
    document.createTextNode("Media/Image Posts Only")
  );
  urlRow1.appendChild(urlTitle1);
  urlRow1.appendChild(urlInput1);
  urlRow2.appendChild(urlTitle2);
  urlRow2.appendChild(urlInput2);
  urlRow3.appendChild(urlTitle3);
  urlRow3.appendChild(urlInput3);
  urlThing.appendChild(urlRules2);
  urlThing.appendChild(urlRow3);
  urlThing.appendChild(urlRow1);
  urlThing.appendChild(urlRules1);
  urlThing.appendChild(urlRow2);
  urlThing.appendChild(urlRules3);
  var cancelURL = butt("Cancel5");
  cancelURL.addEventListener("click", function () {
    document.getElementById("urlstuff").checked = false;
  });
  urlThing.appendChild(cancelURL);
  urlThing.appendChild(addURL);
  url_widget.appendChild(urlThing);
  // this part is mixing the editor nav panel a bit
  addFrag.appendChild(document.createTextNode("Tags"));
  addTag.appendChild(addFrag);
  addTag.setAttribute("title", "Add tags, from selected posts...");
  remTag.appendChild(remFrag);
  remTag.setAttribute("title", "Remove tags, from selected posts...");
  // get rid of oddly inline style attributes
  document.getElementById("tags").removeAttribute("style");
  // append all our new buttons "buttoned"
  en.insertBefore(pause_chrome, rtPnt);
  en.insertBefore(ajaxInfo_chrome, rtPnt);
  en.insertBefore(gutter_chrome, rtPnt);
  en.insertBefore(links_chrome, rtPnt);
  en.insertBefore(captions_chrome, rtPnt);
  en.insertBefore(hoverSpan, rtPnt);
  en.insertBefore(caption_chrome, rtPnt);
  en.insertBefore(backdate_chrome, rtPnt);
  en.insertBefore(url_chrome, rtPnt);
  en.insertBefore(private_chrome, rtPnt);
  en.appendChild(dlPnt);
  // turn links on by default
  if (getCookie("view_links") === "on") {
    document.getElementById("view-links_button").dispatchEvent(
      new Event("click")
    );
  }
  if (getCookie("view_captions") === "on") {
    document.getElementById("view-captions_button").dispatchEvent(
      new Event("click")
    );
  }
  if (getCookie("view_hover") === "on") {
    document.getElementById("hover-only").checked = true;
    document.getElementById("hover-only").dispatchEvent(
      new Event("change")
    );
  } else {
    lcontent.classList.add("hoverless");
  }
  // extra buttons for queue/drafts
  if (href[3] === "draft" || href[3] === "queued") {
    var publish_chrome = newChromeButton("publish", "Publish", false);
    publish_chrome.getElementsByTagName("button")[0].
      setAttribute(
        "data-edit_action", '{"post[state]":"0"}'
      );
    publish_chrome.getElementsByTagName("button")[0].
      addEventListener("click", fetchEditSubmitMulti);
    en.insertBefore(publish_chrome, rtPnt);
  }
  if (href[3] === "draft") {
    var queue_chrome = newChromeButton(
      "queue", "Queue Drafts", false
    );
    queue_chrome.getElementsByTagName("button")[0].
      setAttribute(
        "data-edit_action", '{"post[state]":"2"}'
      );
    queue_chrome.getElementsByTagName("button")[0].
      addEventListener("click", fetchEditSubmitMulti);
    en.insertBefore(queue_chrome, rtPnt);
  }
  if (href[3] === "queued") {
    var makeDraft_chrome = newChromeButton(
      "make-draft", "ReDraft", false
    );
    makeDraft_chrome.getElementsByTagName("button")[0].
      setAttribute(
        "data-edit_action", '{"post[state]":"1"}'
      );
    makeDraft_chrome.getElementsByTagName("button")[0].
      addEventListener("click", fetchEditSubmitMulti);
    en.insertBefore(makeDraft_chrome, rtPnt);
  }
  en.insertBefore(selectBy_chrome, unPnt);
  en.insertBefore(selectAll_chrome, dlPnt);
  var navLinks = document.getElementsByClassName("post-state-nav-item");
  var navDash = document.createElement("a");
  var navInputContainer = document.createElement("div");
  navInputContainer.classList.add("widget");
  navInputContainer.id = "reblog_widget";
  var navWidgetTrow = document.createElement("div");
  navWidgetTrow.classList.add("trow");
  var navWidgetInner = document.createElement("div");
  navWidgetInner.classList.add("inner");
  var navWidgetH2 = document.createElement("h2");
  navWidgetH2.appendChild(
    document.createTextNode("Load From Page for ReBlog")
  );
  navWidgetH2.id = "reblog-widget_h2";
  navWidgetInner.appendChild(navWidgetH2);
  var reblogDescription = document.createElement("div");
  reblogDescription.innerHTML = "Reblogging from the \"dashboard\"...";
  reblogDescription.id = "reblog-widget_description";
  var reblogInputText = document.createElement("input");
  reblogInputText.type = "text";
  reblogInputText.addEventListener("focus", function () {
    this.select();
  });
  reblogInputText.disabled = true;
  reblogInputText.id = "reblog-widget_input";
  reblogInputText.value = "dashboard";
  var loadp = butt("Load Page");
  var loadpSubmit = function () {
    var wGinput = document.getElementById(
      "reblog-widget_input"
    );
    var url = wGinput.getAttribute("data-url") + wGinput.value;
    if (wGinput.getAttribute("data-member-input") !== null) {
      setCookie(
        wGinput.getAttribute("data-member-input"),
        wGinput.value, 99
      );
    }
    document.location.href = url.replace(/\s+/g, "+");
  };
  reblogInputText.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      loadpSubmit();
    }
  });
  loadp.addEventListener("click", loadpSubmit);
  var cancelp = butt("Cancel2");
  cancelp.setAttribute( // so these aren't "undefined"
    "data-default-input", "null"
  );
  cancelp.setAttribute(
    "data-default-disabled", "null"
  );
  cancelp.setAttribute(
    "data-default-description", "null"
  );
  cancelp.setAttribute(
    "data-default-url", "null"
  );
  var openReblogsWidget = function (e) {
    e.preventDefault();
    e.cancelBubble = true;
    e.stopPropagation();
    var navLinks = document.getElementsByClassName(
      "post-state-nav-item"
    );
    var nav = navLinks[0].parentNode;
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
    } else {
      var data = document.getElementById(
        "mass_post_features-plugin_data"
      );
      data.classList.add("open-blog_menu");
      var wGinput = document.getElementById(
        "reblog-widget_input"
      );
      wGinput.value = this.getAttribute("data-default-input");
      wGinput.setAttribute(
        "data-member-input", this.getAttribute("data-member-input")
      );
      wGinput.disabled = this.getAttribute("data-default-disabled") === "1";
      wGinput.setAttribute("data-url", this.getAttribute("data-default-url"));
      document.getElementById(
        "reblog-widget_description"
      ).innerHTML = "Reblogging from the \"" +
        this.getAttribute("data-default-description") +
        "\"...";
      nav.classList.add("open");
    }
  };
  cancelp.addEventListener("click", openReblogsWidget);
  navWidgetInner.appendChild(reblogInputText);
  navWidgetInner.appendChild(loadp);
  navWidgetInner.appendChild(cancelp);
  var robotWarningReblogs = document.createElement("div");
  var robotTitleReblogs = document.createElement("strong");
  robotTitleReblogs.appendChild(
    document.createTextNode(
      "Friendly Robot Warning"
    )
  );
  robotWarningReblogs.classList.add("robot-warning");
  robotWarningReblogs.appendChild(robotTitleReblogs);
  robotWarningReblogs.appendChild(
    document.createTextNode(
      "Please: utilize \"Pause Button\" for extra long feeds. " +
      "Please: Reblog responsibly!"
    )
  );
  navWidgetInner.appendChild(reblogDescription);
  navWidgetInner.appendChild(robotWarningReblogs);
  navWidgetTrow.appendChild(navWidgetInner);
  navInputContainer.appendChild(navWidgetTrow);
  navLinks[0].parentNode.appendChild(navInputContainer);
  navDash.appendChild(
    svgForType["reblog-self"].cloneNode(true)
  );
  navDash.appendChild(
    document.createTextNode("Dashboard")
  );
  navDash.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navDash.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navDash.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  var navChive = document.createElement("a");
  navChive.appendChild(
    svgForType["reblog-self"].cloneNode(true)
  );
  navChive.appendChild(
    document.createTextNode("Archive")
  );
  navChive.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navChive.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navChive.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  var navTagged = document.createElement("a");
  navTagged.appendChild(
    svgForType["reblog-self"].cloneNode(true)
  );
  navTagged.appendChild(
    document.createTextNode("Tagged")
  );
  navTagged.id = "nav-tagged";
  navTagged.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navTagged.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navTagged.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  var navSearch = document.createElement("a");
  navSearch.appendChild(
    svgForType["reblog-self"].cloneNode(true)
  );
  navSearch.appendChild(
    document.createTextNode("Search")
  );
  navSearch.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navSearch.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navSearch.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  var navLikes = document.createElement("a");
  navLikes.id = "nav-likes";
  navLikes.appendChild(
    svgForType["reblog-self"].cloneNode(true)
  );
  navLikes.appendChild(
    document.createTextNode("Likes")
  );
  navLikes.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navLikes.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navLikes.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  var navPhoto = document.createElement("a");
  navPhoto.appendChild(
    svgForType.image.cloneNode(true)
  );
  navPhoto.appendChild(
    document.createTextNode("Batch")
  );
  navPhoto.id = "nav-photo";
  navPhoto.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navPhoto.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navPhoto.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  navPhoto.classList.add("post-state-nav-item");
  navPhoto.setAttribute(
    "href", "/mega-editor/published/" + name + "?photos"
  );
  navLinks[0].parentNode.appendChild(mpe);
  var navFollows = document.createElement("a");
  navFollows.appendChild(
    svgForType.friendly.cloneNode(true)
  );
  navFollows.appendChild(
    document.createTextNode("I Follow")
  );
  navFollows.id = "nav-follows";
  navFollows.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navFollows.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navFollows.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  navFollows.classList.add("post-state-nav-item");
  navFollows.setAttribute(
    "href", "/mega-editor/published/" + name + "?follows"
  );
  var navFollowers = document.createElement("a");
  navFollowers.appendChild(
    svgForType.friendly.cloneNode(true)
  );
  navFollowers.appendChild(
    document.createTextNode("Followers")
  );
  navFollowers.id = "nav-followers";
  navFollowers.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navFollowers.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navFollowers.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  navFollowers.classList.add("post-state-nav-item");
  navFollowers.setAttribute(
    "href", "/mega-editor/published/" + name + "?followers"
  );
  var navFans = document.createElement("a");
  navFans.appendChild(
    svgForType.mutual.cloneNode(true)
  );
  navFans.appendChild(
    document.createTextNode("Fans")
  );
  navFans.id = "nav-fans";
  navFans.getElementsByTagName("svg")[0].setAttribute("width", 15);
  navFans.getElementsByTagName("svg")[0].setAttribute("height", 15);
  navFans.getElementsByTagName("svg")[0].setAttribute("fill", "#fff");
  navFans.classList.add("post-state-nav-item");
  navFans.setAttribute(
    "href", "/mega-editor/published/" + name + "?fans"
  );
  var four = [// < there were only 4 when I named this...
    "dashboard", "archive", "tagged", "search", "likes", // reblogging pages
    "photos", "follows", "followers", "fans" //special features
  ];
  if (typeof href[5] !== "undefined" && four.indexOf(href[5]) !== -1) {
    document.getElementsByClassName("active")[0].classList.remove("active");
    if (href[5] === "dashboard") {
      navDash.classList.add("active");
    }
    if (href[5] === "archive") {
      navChive.classList.add("active");
    }
    if (href[5] === "tagged") {
      navTagged.classList.add("active");
    }
    if (href[5] === "search") {
      navSearch.classList.add("active");
    }
    if (href[5] === "likes") {
      navLikes.classList.add("active");
    }
    if (href[5] === "photos") {
      navPhoto.classList.add("active");
    }
    if (href[5] === "follows") {
      navFollows.classList.add("active");
    }
    if (href[5] === "followers") {
      navFollowers.classList.add("active");
    }
    if (href[5] === "fans") {
      navFans.classList.add("active");
    }
  }
  navTagged.setAttribute(
    "data-default-input", getCookie("cats") !== "" ? getCookie("cats") : "cats"
  );
  navTagged.setAttribute(
    "data-member-input", "cats"
  );
  navTagged.setAttribute(
    "data-default-description", "Tagged Page"
  );
  navTagged.setAttribute(
    "data-default-url", "/mega-editor/published/" + name + "?tagged&"
  );
  navTagged.addEventListener("click", openReblogsWidget);
  navTagged.href = "/mega-editor/published/" + name + "?tagged&" +
    (getCookie("cats") !== "" ? getCookie("cats") : "cats");
  navTagged.classList.add("post-state-nav-item");
  navLinks[0].parentNode.appendChild(navTagged);
  navLikes.setAttribute(
    "data-default-input", name
  );
  navLikes.setAttribute(
    "data-default-description", "Liked/By Page"
  );
  navLikes.setAttribute(
    "data-default-url", "/mega-editor/published/" + name + "?likes&"
  );
  navLikes.addEventListener("click", openReblogsWidget);
  navLikes.href = "/mega-editor/published/" + name + "?likes&" + name;
  navLikes.classList.add("post-state-nav-item");
  navLikes.setAttribute(
    "data-member-input", "name1"
  );
  navLinks[0].parentNode.appendChild(navLikes);
  navSearch.setAttribute(
    "data-default-input", getCookie("cats2") !== "" ? getCookie("cats2") : "cats"
  );
  navSearch.setAttribute(
    "data-default-disabled", "0"
  );
  navSearch.setAttribute(
    "data-default-description", "Search Page"
  );
  navSearch.setAttribute(
    "data-default-url", "/mega-editor/published/" + name + "?search&"
  );
  navSearch.addEventListener("click", openReblogsWidget);
  navSearch.href = "/mega-editor/published/" + name + "?search&" +
    (getCookie("cats2") !== "" ? getCookie("cats2") : "cats");
  navSearch.setAttribute(
    "data-member-input", "cats2"
  );
  navSearch.classList.add("post-state-nav-item");
  navLinks[0].parentNode.appendChild(navSearch);
  navChive.setAttribute(
    "data-default-input", getCookie("david") !== "" ? getCookie("david") : "david"
  );
  navChive.setAttribute(
    "data-member-input", "david"
  );
  navChive.setAttribute(
    "data-default-disabled", "0"
  );
  navChive.setAttribute(
    "data-default-description", "Archive Page"
  );
  navChive.setAttribute(
    "data-default-url", "/mega-editor/published/" + name + "?archive&"
  );
  navChive.addEventListener("click", openReblogsWidget);
  navChive.href = "/mega-editor/published/" + name + "?archive&" +
    (getCookie("david") !== "" ? getCookie("david") : "david");
  navChive.classList.add("post-state-nav-item");
  navLinks[0].parentNode.appendChild(navChive);
  navDash.setAttribute(
    "data-default-input", "dashboard"
  );
  navDash.setAttribute(
    "data-default-disabled", "1"
  );
  navDash.setAttribute(
    "data-default-description", "Dashboard"
  );
  navDash.setAttribute(
    "data-default-url", "/mega-editor/published/" + name + "?dashboard&"
  );
  navDash.addEventListener("click", openReblogsWidget);
  navDash.href = "/mega-editor/published/" + name + "?dashboard";
  navDash.classList.add("post-state-nav-item");
  navLinks[0].parentNode.appendChild(navDash);
  navLinks[0].parentNode.appendChild(navPhoto);
  navLinks[0].parentNode.appendChild(navFollows);
  navLinks[0].parentNode.appendChild(navFollowers);
  // navLinks[0].parentNode.appendChild(navFans); // html api, too unstable...
  navLinks[0].insertBefore(
    svgForType.edit.cloneNode(true), navLinks[0].firstChild
  );
  navLinks[1].insertBefore(
    svgForType.edit.cloneNode(true), navLinks[1].firstChild
  );
  navLinks[2].insertBefore(
    svgForType.edit.cloneNode(true), navLinks[2].firstChild
  );
  navLinks[0].getElementsByTagName("svg")[0].setAttribute("width", 15);
  navLinks[0].getElementsByTagName("svg")[0].setAttribute("height", 15);
  navLinks[1].getElementsByTagName("svg")[0].setAttribute("width", 15);
  navLinks[1].getElementsByTagName("svg")[0].setAttribute("height", 15);
  navLinks[2].getElementsByTagName("svg")[0].setAttribute("width", 15);
  navLinks[2].getElementsByTagName("svg")[0].setAttribute("height", 15);
  // end extra chrome buttons and widgets, and nav-links

  // the replace/alias some of the default functions
  var rewriterScript = document.createElement("script");
  rewriterScript.type = "text/javascript";
  rewriterScript.id = "mass_post_features-plugin_functions";
  rewriterScript.appendChild(
    document.createTextNode(
      rewrite1.toString().slice(13, -1)
    )
  );
  rewriterScript.appendChild(
    document.createTextNode(
      "// The doc_title (#) is superfluous; use a visible (#)\n" +
      "window.postCountMake = " +
      postCountMake.toString() + ";\n"
    )
  );
  rewriterScript.appendChild(
    document.createTextNode(
      rewrite2.toString().slice(13, -1)
    )
  );
  document.head.appendChild(rewriterScript);
  // end the default script replacements/aliases

  // begin the plugin css below
  // (I tweaked this CSS for hours upon days to be utmost pretty)
  var pluginStyle = document.createElement("style");
  pluginStyle.id = "mass_post_features-plugin_style";
  pluginStyle.type = "text/css";
  pluginStyle.appendChild(
    document.createTextNode(
      (function () {/*

h2 {
  display: block;
  font-weight: 600;
}

a {
  text-decoration: underline;
}

b, strong {
  font-weight: 700;
}

h2 b, h2 strong {
  font-weight: 900;
}

em, i {
  font-style: italic;
}

ol, ul {
  list-style: none;
}

blockquote, q {
  quotes: none;
}

blockquote {
  border-left: 3px solid #000;
  padding-left: 4px;
}

blockquote:after,
blockquote:before,
q:after,
q:before {
  content: none;
}

ol, ul {
  margin-bottom: .75em;
  padding-left: 2.8em;
}

ol ol,
ol ul,
ul ol,
ul ul {
  margin: 0;
  padding-left: 1.1em;
}

ul li {
  list-style-type: disc;
}

ul li li {
  list-style-type: circle;
}

ol li {
  list-style-type: decimal;
  font-feature-settings: "tnum";
}

blockquote, p,
pre {
  margin-bottom: .75em;
}

p.npf_quirky {
  font-family: Fairwater, serif;
  font-size: 24px;
  line-height: 1.3em;
}

p.npf_chat {
  font-family: Source Code Pro, monospace;
}

p.npf_color_joey,
span.npf_color_joey {
  color: #ff492f;
}

p.npf_color_monica,
span.npf_color_monica {
  color: #ff8a00;
}

p.npf_color_phoebe,
span.npf_color_phoebe {
  color: #e8d73a;
}

p.npf_color_ross,
span.npf_color_ross {
  color: #00cf35;
}

p.npf_color_rachel,
span.npf_color_rachel {
  color: #00b8ff;
}

p.npf_color_chandler,
span.npf_color_chandler {
  color: #7c5cff;
}

p.npf_color_niles,
span.npf_color_niles {
  color: #ff62ce;
}

p.npf_color_frasier,
span.npf_color_frasier {
  color: #001935;
}

p.npf_color_mr_big,
span.npf_color_mr_big {
  color: #000c1a;
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-light-0db5d248.woff) format("woff");
  font-weight: 100;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-regular-d83b428c.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-semibold-b0fc2672.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-bold-c6132b6e.woff) format("woff");
  font-weight: 900;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-light-italic-ed49facd.woff) format("woff");
  font-weight: 100;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-italic-e1dcd616.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Gibson;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-semibold-italic-ae8d9810.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Bold;
  src: url(https://assets.tumblr.com/pop/fonts/gibson/gibson-bold-italic-94b05ba2.woff) format("woff");
  font-weight: 900;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Franklin Gothic Medium;
  src: url(https://assets.tumblr.com/pop/fonts/franklingothic/franklingothic-medium-1beb5103.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  font-display: swap
}

@font-face {
  font-family: Franklin Gothic Medium Condensed;
  src: url(https://assets.tumblr.com/pop/fonts/franklingothic/franklingothic-medium-compressed-58222bfb.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Franklin Gothic Compressed;
  src: url(https://assets.tumblr.com/pop/fonts/franklingothic/franklingothic-compressed-02ac5e26.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Walsheim;
  src: url(https://assets.tumblr.com/pop/fonts/walsheim/walsheim-medium-40fd0505.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Fairwater;
  src: url(https://assets.tumblr.com/pop/fonts/fairwater/fairwater-regular-b7ab7a58.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Favorit;
  src: url(https://assets.tumblr.com/pop/fonts/favorit/favorit-85-8ff1c986.woff2) format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap
}

@font-face {
  font-family: Favorit;
  src: url(https://assets.tumblr.com/pop/fonts/favorit/favorit-85-italic-a883bce7.woff2) format("woff2");
  font-style: italic;
  font-weight: 400;
  font-display: swap
}

@font-face {
  font-family: Favorit;
  src: url(https://assets.tumblr.com/pop/fonts/favorit/favorit-medium-be005cc5.woff2) format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap
}

@font-face {
  font-family: Favorit;
  src: url(https://assets.tumblr.com/pop/fonts/favorit/favorit-medium-italic-4d1adc26.woff2) format("woff2");
  font-style: italic;
  font-weight: 700;
  font-display: swap
}

@font-face {
  font-family: "1785 GLC Baskerville";
  src: url(https://assets.tumblr.com/pop/fonts/1785glcbaskerville/1785glcbaskerville-regular-2c131a72.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: "1785 GLC Baskerville";
  src: url(https://assets.tumblr.com/pop/fonts/1785glcbaskerville/1785glcbaskerville-italic-1a724410.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Alternate Gothic;
  src: url(https://assets.tumblr.com/pop/fonts/alternategothic/alternategothic-regular-d11d1e96.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Arquitecta;
  src: url(https://assets.tumblr.com/pop/fonts/arquitecta/arquitecta-book-cee560b5.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Arquitecta;
  src: url(https://assets.tumblr.com/pop/fonts/arquitecta/arquitecta-bold-5ec6543e.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Avalon;
  src: url(https://assets.tumblr.com/pop/fonts/avalon/avalon-book-de1d38eb.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Avalon;
  src: url(https://assets.tumblr.com/pop/fonts/avalon/avalon-bold-26f8ad53.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Bodoni Recut FS;
  src: url(https://assets.tumblr.com/pop/fonts/bodonirecutfs/bodonirecutfs-regular-283bd6c9.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Bodoni Recut FS;
  src: url(https://assets.tumblr.com/pop/fonts/bodonirecutfs/bodonirecutfs-demi-1c2ff649.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Bodoni Recut FS;
  src: url(https://assets.tumblr.com/pop/fonts/bodonirecutfs/bodonirecutfs-italic-54315813.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Bodoni Recut FS;
  src: url(https://assets.tumblr.com/pop/fonts/bodonirecutfs/bodonirecutfs-demi-italic-b5e01932.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Bookmania;
  src: url(https://assets.tumblr.com/pop/fonts/bookmania/bookmania-regular-271d947c.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Bookmania;
  src: url(https://assets.tumblr.com/pop/fonts/bookmania/bookmania-bold-5e09e821.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Brutal Type;
  src: url(https://assets.tumblr.com/pop/fonts/brutaltype/brutaltype-regular-ef623c78.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Brutal Type;
  src: url(https://assets.tumblr.com/pop/fonts/brutaltype/brutaltype-bold-a5e007f4.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Calluna;
  src: url(https://assets.tumblr.com/pop/fonts/calluna/calluna-regular-60172bcd.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Calluna;
  src: url(https://assets.tumblr.com/pop/fonts/calluna/calluna-black-cfbfc0fb.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Calluna;
  src: url(https://assets.tumblr.com/pop/fonts/calluna/calluna-italic-405661eb.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Calluna;
  src: url(https://assets.tumblr.com/pop/fonts/calluna/calluna-bold-italic-760a50f4.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Calluna Sans;
  src: url(https://assets.tumblr.com/pop/fonts/callunasans/callunasans-regular-4c9b1de7.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Calluna Sans;
  src: url(https://assets.tumblr.com/pop/fonts/callunasans/callunasans-black-9c48542e.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Calluna Sans;
  src: url(https://assets.tumblr.com/pop/fonts/callunasans/callunasans-italic-83d2e0f0.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Calluna Sans;
  src: url(https://assets.tumblr.com/pop/fonts/callunasans/callunasans-black-italic-55e41442.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Capita;
  src: url(https://assets.tumblr.com/pop/fonts/capita/capita-regular-b20fa714.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Capita;
  src: url(https://assets.tumblr.com/pop/fonts/capita/capita-bold-16bd5c46.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Caslon FS;
  src: url(https://assets.tumblr.com/pop/fonts/caslonfs/caslonfs-book-b1f3d7b2.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Caslon FS;
  src: url(https://assets.tumblr.com/pop/fonts/caslonfs/caslonfs-bold-c9f15be5.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Clarendon Text Pro;
  src: url(https://assets.tumblr.com/pop/fonts/clarendontextpro/clarendontextpro-regular-8665c534.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Clarendon Text Pro;
  src: url(https://assets.tumblr.com/pop/fonts/clarendontextpro/clarendontextpro-bold-f0e91a3c.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Clarendon Text Pro;
  src: url(https://assets.tumblr.com/pop/fonts/clarendontextpro/clarendontextpro-italic-f50fadcc.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Clarendon Text Pro;
  src: url(https://assets.tumblr.com/pop/fonts/clarendontextpro/clarendontextpro-bold-italic-0b93f3fe.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Clearface FS;
  src: url(https://assets.tumblr.com/pop/fonts/clearface/clearface-regular-0877705c.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Clearface FS;
  src: url(https://assets.tumblr.com/pop/fonts/clearface/clearface-black-7307513a.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Clearface FS;
  src: url(https://assets.tumblr.com/pop/fonts/clearface/clearface-italic-12dd08d2.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Clearface FS;
  src: url(https://assets.tumblr.com/pop/fonts/clearface/clearface-black-italic-95e89c47.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Garamond Classic FS;
  src: url(https://assets.tumblr.com/pop/fonts/garamondclassicfs/garamondclassicfs-regular-37325adf.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Garamond Classic FS;
  src: url(https://assets.tumblr.com/pop/fonts/garamondclassicfs/garamondclassicfs-heavy-d6b7cb51.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Garamond Classic FS;
  src: url(https://assets.tumblr.com/pop/fonts/garamondclassicfs/garamondclassicfs-italic-a9e735d6.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Garamond Classic FS;
  src: url(https://assets.tumblr.com/pop/fonts/garamondclassicfs/garamondclassicfs-bold-italic-73da3cdb.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Grumpy Black\ 48;
  src: url(https://assets.tumblr.com/pop/fonts/grumpyblack48/grumpyblack48-60ad3944.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Grumpy Black\ 48;
  src: url(https://assets.tumblr.com/pop/fonts/grumpyblack48/grumpyblack48-60ad3944.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Lorimer No\ 2;
  src: url(https://assets.tumblr.com/pop/fonts/lorimerno2/lorimerno2-medium-5ed17651.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Lorimer No\ 2;
  src: url(https://assets.tumblr.com/pop/fonts/lorimerno2/lorimerno2-semibold-c615f79e.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Lorimer No\ 2;
  src: url(https://assets.tumblr.com/pop/fonts/lorimerno2/lorimerno2-medium-italic-a7cb2829.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Lorimer No\ 2;
  src: url(https://assets.tumblr.com/pop/fonts/lorimerno2/lorimerno2-semibold-italic-803dc0f4.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: News Gothic FS;
  src: url(https://assets.tumblr.com/pop/fonts/newsgothicfs/newsgothicfs-book-b71e5c48.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: News Gothic FS;
  src: url(https://assets.tumblr.com/pop/fonts/newsgothicfs/newsgothicfs-bold-dad27eb5.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: News Gothic FS;
  src: url(https://assets.tumblr.com/pop/fonts/newsgothicfs/newsgothicfs-book-oblique-0a0ccd73.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: News Gothic FS;
  src: url(https://assets.tumblr.com/pop/fonts/newsgothicfs/newsgothicfs-bold-oblique-4767b553.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Pratt Pro;
  src: url(https://assets.tumblr.com/pop/fonts/prattpro/prattpro-regular-27555c58.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Pratt Pro;
  src: url(https://assets.tumblr.com/pop/fonts/prattpro/prattpro-bold-f978900f.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Quadrat;
  src: url(https://assets.tumblr.com/pop/fonts/quadrat/quadrat-regular-eade9dc0.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Quadrat;
  src: url(https://assets.tumblr.com/pop/fonts/quadrat/quadrat-serial-f6e71145.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Sofia Pro;
  src: url(https://assets.tumblr.com/pop/fonts/sofiapro/sofiapro-regular-f2aae9ec.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Sofia Pro;
  src: url(https://assets.tumblr.com/pop/fonts/sofiapro/sofiapro-bold-cdb403a0.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Spade;
  src: url(https://assets.tumblr.com/pop/fonts/spade/spade-6085b923.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Spade;
  src: url(https://assets.tumblr.com/pop/fonts/spade/spade-6085b923.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Square Serif;
  src: url(https://assets.tumblr.com/pop/fonts/squareserif/squareserif-book-0a547297.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Square Serif;
  src: url(https://assets.tumblr.com/pop/fonts/squareserif/squareserif-demi-1bdcd0c8.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Square Serif;
  src: url(https://assets.tumblr.com/pop/fonts/squareserif/squareserif-book-italic-0ecc7c19.woff) format("woff");
  font-weight: 400;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Square Serif;
  src: url(https://assets.tumblr.com/pop/fonts/squareserif/squareserif-demi-italic-b4286785.woff) format("woff");
  font-weight: 700;
  font-style: italic;
  font-display: swap
}

@font-face {
  font-family: Streetscript;
  src: url(https://assets.tumblr.com/pop/fonts/streetscript/streetscript-e1665af6.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Streetscript;
  src: url(https://assets.tumblr.com/pop/fonts/streetscript/streetscript-e1665af6.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Typewriter FS;
  src: url(https://assets.tumblr.com/pop/fonts/typewriterfs/typewriterfs-regular-c0a07f03.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Typewriter FS;
  src: url(https://assets.tumblr.com/pop/fonts/typewriterfs/typewriterfs-bold-d4592705.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Ziclets;
  src: url(https://assets.tumblr.com/pop/fonts/ziclets/ziclets-b6989e95.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}

@font-face {
  font-family: Ziclets;
  src: url(https://assets.tumblr.com/pop/fonts/ziclets/ziclets-b6989e95.woff) format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap
}

@keyframes happy-bounce {
  0% {
    opacity: 0;
    transform: rotate(40deg) translateY(0);
  }

  10% {
    transform: rotate(0deg) translateY(-50px);
    opacity: 1;
  }

  20% {
    transform: rotate(-40deg) translateY(0);
  }

  30% {
    transform: rotate(0deg) translateY(-40px);
  }

  40% {
    transform: rotate(40deg) translateY(0);
  }

  50% {
    transform: rotate(0deg) translateY(-30px);
  }

  60% {
    transform: rotate(-40deg) translateY(0);
  }

  70% {
    transform: rotate(0deg) translateY(-20px);
  }

  80% {
    transform: rotate(40deg) translateY(0);
  }

  90% {
    opacity: 1;
    transform: rotate(0deg) translateY(-10px);
  }

  100% {
    opacity: 0;
    transform: rotate(-40deg) translateY(0);
  }
}

@keyframes blinking {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes updown {
  100% {
    margin-top: 0;
  }

  50% {
    margin-top: -15px;
  }

  0% {
    margin-top: 0;
  }
}

@keyframes flip {
  100% {
    transform: rotateX(0);
    opacity: 1;
  }

  0% {
    transform: rotateX(-180deg);
    opacity: 0;
  }
}

.l-content {
  min-height: calc(100vh - 177px);
}

.l-content>* {
  opacity: 0;
  transition: all 0.4s ease-out;
}

.l-content>*.display-none {
  display: none;
}

#select-by-widget_title .preselect-count,
#select-by_widget .row,
.l-content>*.laid {
  opacity: 1;
  animation: flip 0.25s ease-in-out both;
}

#select-by-widget_title .preselect-count.noanim,
#select-by_widget .row:active {
  animation: none;
  opacity: 1;
}

#mass_post_features-plugin_data {
  display: none;
}

#mass_post_features-plugin_selection_box {
  position: absolute;
  background-color: rgba(50, 90, 250, 0.4);
  box-shadow: inset 0 0 0 1px rgba(50, 90, 250, 1);
  z-index: 100;
  cursor: pointer;
}

a.blog_title {
  cursor: pointer;
}

#delete_posts {
  background-color: #c00;
}

#unselect .chrome_button_right {
  display: inline-block;
}

.blue_bar .editor_navigation {
  text-align: center;
  float: none;
  display: block;
}

.blue_bar .editor_navigation .header_button {
  display: inline-block;
  vertical-align: top;
}

#status {
  margin: 0px 0px -3px 0px;
}

#pause_button .play,
#pause_button .pause {
  color: #fff;
  font-size: 10px;
  padding: 0 2px;
}

#pause_button.playing .play,
#pause_button.paused .pause,
#pause_button.done .play,
#pause_button.done .pause {
  color: rgba(255, 255, 255, 0.3);
}

.chrome h2 {
  display: inline-block;
  font-size: 25px;
  vertical-align: top;
  color: inherit;
  font-weight: bold;
}


.chrome_button h2 {
  vertical-align: sub;
  font-family: monospace;
  position: relative;
}

#add_tag_button,
#cancel_add_tag_button,
#cancel_remove_tag_button,
#remove_tag_button {
  margin-bottom: -30px;
}

#tag_editor,
#tags {
  font: normal 11px 'Lucida Grande', Verdana, sans-serif;
  width: 326px;
  position: absolute;
  left: 20px;
  top: 19px;
  text-align: left;
  height: 170px;
  overflow: auto;
  color: #555;
  background-color: rgba(255, 255, 255, 0.7);
}

#unselect.chrome,
#select-all_button.chrome,
#select-by_button.chrome,
#view-links_button.chrome,
#view-captions_button.chrome {
  background: #7D99FF none;
}

.blue_bar .editor_navigation .header_button button.chrome {
  padding: 0 4px 0 0;
  margin: 1px 0 0 2px;
}

#gutter_button input[type="number"] {
  width: 40px;
  height: 18px;
  padding: 0 3px;
  background-color: #ccc;
  border: 0 none;
  box-shadow: inset 0 2px 2px 0px #000;
  top: -2px;
  position: relative;
}

#cancel5_button,
#add_urls_button,
#post_all_photos_button,
#cancel2_button,
#cancel1_button,
#select_button,
#clear_button,
#hide_button,
#list_button {
  border: 0 none;
  padding: 0 5px;
}

#select_button {
  position: absolute;
  bottom: 13px;
  left: 10px;
  width: 68px;
}

#reblog_widget .robot-warning {
  width: 190px;
  margin: 10px 10px 11px 10px;
}

#cancel2_button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#cancel1_button {
  position: absolute;
  top: 10px;
  right: 10px;
}

#clear_button {
  position: absolute;
  bottom: 13px;
  right: 10px;
}

#hide_button {
  position: absolute;
  bottom: 7px;
  right: 6px;
  height: 24px;
}

#list_button {
  position: absolute;
  bottom: 13px;
  right: 307px;
  height: 24px;
}

#photos-drop-zone *,
#photos-drop-zone,
.blog_title,
#jump_to_month,
#mpe_title,
.post-state-nav-item,
.l-content>*,
button,
label {
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.l-content .brick.photo {
    min-height: 50px;
    vertical-align: ;
}

.l-content .heading {
  padding-top: 20px;
}

.l-content .brick .overprint {
  width: 120px;
  top: 0px;
  left: 5px;
}

.l-content .brick.video .play_overlay,
.l-content .brick.audio .listen_overlay {
  z-index: 9;
}

.l-content .brick {
  overflow: visible;
  background: linear-gradient(135deg,
      rgba(242, 242, 242, 1) 0%,
      rgba(209, 209, 209, 1) 44%,
      rgba(209, 209, 209, 1) 100%,
      rgba(226, 226, 226, 1) 100%);
}

.l-content .brick .overflow-hidden {
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 125px;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}

.l-content .brick .monospace *,
.l-content .brick .monospace {
  font-family: "Courier", monospace;
}

.l-content .brick .ol {
  display: list-item;
  list-style: decimal inside;
}

.l-content .brick .ul {
  display: list-item;
  list-style: disc inside;
}

.l-content .brick .h1 {
  font-size: 115%;
  text-align: center;
}

.l-content .brick .quote {
  font-size: 125%;
  font-family: "Times", "Times New Roman", serif;
}

.l-content .brick .rq {
  font-size: 140px;
  font-weight: bold;
  font-family: "Times", "Times New Roman", "Times", serif;
  color: rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 0px;
  right: 0;
  line-height: 110px;
}

.l-content .brick.link .rq {
  bottom: -20px;
}

.l-content .brick.note .ask-av {
  display: inline-block;
  vertical-align: middle;
  border-radius: 20px;
}

.l-content .brick.has-img .fade {
  width: 125px;
  height: 90px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
      rgba(206, 206, 206, 0) 0%,
      rgba(208, 208, 208, 0) 73%,
      rgba(209, 209, 209, 1) 100%);
}

.l-content .brick .asker {
  display: inline-block;
  vertical-align: middle;
}

.l-content .brick .answer {
  font-weight: normal;
  padding-top: 30px;
}

.l-content .brick .h2 {
  font-size: 105%;
}

.l-content .brick .link {
  text-decoration: underline;
}

.l-content .brick .quirky {
  font-family: Fairwater, serif;
  font-size: 112%;
}

.l-content .brick.highlighted .overlay {
  background: none;
  border: 0 none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  color: #fff;
  opacity: 1;
  filter: none;
  z-index: 999;
  display: block;
}

.l-content .brick.highlighted .overlay .inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 0;
  height: 100%;
}

.l-content .brick.highlighted .overlay .inner .date {
  color: #fff;
  position: absolute;
  left: 0px;
  right: 0px;
  padding: 2px 6px 0px 2px;
  background-color: #73bae7;
  height: 13px;
  font-size: 10px;
  line-height: 11px;
}

.l-content .brick.highlighted .highlight .tag_count {
  display: block !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 115px;
}

.tag_count[style]:after {
    content: " tags";
}

.l-content .brick.highlighted .highlight .note_count {
  color: #fff;
  position: absolute;
  right: 0px;
  bottom: 0px;
  padding: 2px 6px 0px 2px;
  background-color: #73bae7;
  background-color: rgba(115,186,231,0.8);
  height: 11px;
  font-size: 10px;
  line-height: 11px;
  border-top-left-radius: 5px;
  display: block !important;
}

.l-content .brick.highlighted .overlay .inner .notes {
  margin-top: 5px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  padding: 3px 6px 0px 5px;
  background-color: #73bae7;
  height: 13px;
  font-size: 10px;
  line-height: 10px;
  border-top-left-radius: 5px;
  display: block !important;
}

#widget-top-buttons .red {
  border: 1px rgba(255, 0, 0, 0.4) solid;
  background-color: rgba(255, 0, 0, 0.1);
  color: rgba(255, 0, 0, 0.6);
  position: absolute;
  right: 7px;
  top: 30px;
  font-size: 10px;
  padding: 1px 6px;
  font-weight: bold;
}

#widget-top-buttons .arrow,
.blue_bar .arrow {
  display: inline-block;
  position: relative;
  top: -1px;
  width: 0;
  height: 0;
  margin-left: 4px;
  border-top: 6px solid;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
#widget-top-buttons .arrow {
  border-top-color: #555;
}
#widget-top-buttons .arrow.reverse {
  border-bottom: 6px solid;
  border-bottom-color: #99a3ae;
  border-top: 0;
}

.blue_bar .chrome {
  cursor: pointer;
}

.blue_bar .chrome label .arrow {
  border-top-color: #fff;
}

.blue_bar .small_text {
  width: 280px;
  position: relative;
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  left: 10px;
  text-align: center;
}

.blue_bar .title .blog_title {
  color: #99a3ae;
  text-decoration: none;
  top: -3px;
}

#blog_menu {
  display: none;
}

#blog_menu .avatar_img,
#blog_menu .avatar {
  display: inline-block;
  float: left;
  width: 36px;
  height: 36px;
  margin: 3px 0px 0px 3px;
  vertical-align: bottom;
}

#blog_menu .avatar_img {
  border: 1px solid #000;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
}

#blog_menu .avatar {
  position: relative;
  top: 0;
  left: 0;
}

#blog_menu .avatar svg {
  display: none;
}

#blog_menu .avatar.reblog-to-here svg {
  display: block;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 0 2px #7D99FF;
  border-radius: 2px;
  top: 4px;
  left: 4px;
  width: 26px;
  height: 26px;
  padding: 5px;
}

.blog_menu_child {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.13);
  padding: 2px 0px 4px 0px;
}

.subt {
  text-align: center;
  height: 40px;
  width: 300px;
  top: 5px;
  position: relative;
  margin: 0px 0px 0px 48px;
}

.subt a {
  padding: 2px;
  color: #7D99FF;
  margin: 2px;
}

.subt button,
.subt a {
  cursor: pointer;
}

.subt .blank-space,
.subt button,
.subt a {
  height: 24px;
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 10px;
  line-height: 14px;
  font-weight: bold;
  text-decoration: none;
}

.subt .blank-space,
.subt button {
  display: inline-block;
  min-height: 52px;
  position: relative;
  margin: 0;
}

.subt button {
  width: 82px;
  min-height: 52px;
  white-space: normal;
  top: -17px;
  padding: 3px 8px 3px 8px;
  border-color: #000;
  border-radius: 2px;
  background-color: #444;
  border-width: 1px;
  border-style: solid;
  color: #fff;
  position: relative;
  left: 5px;
}

.subt .blank-space {
  width: 60px;
  height: 30px;
  top: -19px;
  vertical-align: middle;
}

.subt a:active {
  text-decoration: underline;
}

.subt button:active {
  background-color: #969696;
  border-color: #8a8f96;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: none
}

.open #blog_menu {
  display: block;
  position: fixed;
  text-align: center;
  left: 0;
  width: 400px;
  height: auto;
  max-height: calc(100vh - 50px);
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #001935;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.13);
  z-index: 100;
  top: 0;
  padding-bottom: 10px;
}

a.open {
  cursor: normal;
}

#blog_menu::-webkit-scrollbar,
#widget_scrolling_part::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

#blog_menu::-webkit-scrollbar-thumb,
#widget_scrolling_part::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #c2c9d2;
}

.editor_navigation span input+.widget {
  display: none;
}

.editor_navigation span input:checked+.widget {
  display: block;
}

#urlstuff_widget {
  padding: 30px;
}

#urlstuff_widget .chrome {
  margin: 14px;
}

.row label.not.disabled {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 0.3;
}

.row label.not.ch {
  background-color: rgba(250, 170, 100, 0.2);
}

#snapshot-info_widget,
#backdate_widget,
#urlstuff_widget,
#add-caption_widget,
#reblog_widget,
#remove_tags_widget,
#add_tags_widget,
#select-by_widget {
  cursor: grab !important;
}

#select-by,
#backdate,
#snapshot-info,
#urlstuff,
#add-caption {
  opacity: 0;
  width: 0;
  height: 0;
}

#urlstuff_body,
#backdate-body,
#reblog_widget button,
#reblog_widget input,
#tags {
  cursor: auto;
}

.brick-dragging *,
.brick-dragging,
#snapshot-info_widget.widget-dragging *,
#snapshot-info_widget.widget-dragging,
#backdate_widget.widget-dragging *,
#backdate_widget.widget-dragging,
#urlstuff_widget.widget-dragging *,
#urlstuff_widget.widget-dragging,
#add-caption_widget.widget-dragging *,
#add-caption_widget.widget-dragging,
#reblog_widget.widget-dragging *,
#reblog_widget.widget-dragging,
#remove_tags_widget.widget-dragging *,
#remove_tags_widget.widget-dragging,
#add_tags_widget.widget-dragging *,
#add_tags_widget.widget-dragging,
#select-by_widget.widget-dragging *,
#select-by_widget.widget-dragging {
  cursor: grabbing !important;
}

#reblog_widget h2,
#reblog_widget div,
#reblog_widget span,
#remove_tags_widget div,
#add-caption_widget div,
#add-caption_widget h2,
#backdate_widget h2,
#backdate_widget span,
#backdate_widget div,
#snapshot-info_widget h2,
#snapshot-info_widget span,
#snapshot-info_widget div,
#urlstuff_widget h2,
#urlstuff_widget span,
#urlstuff_widget div,
#add-caption_widget span,
#select-by_widget span,
#select-by_widget div {
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#backdate-body {
  top: 20px;
  position: relative;
}

#select-by_widget .row span.ch {
  background-color: rgba(100, 170, 250, 0.2);
}

#select-by_widget .row label.is {
  position: absolute;
  left: 0;
  top: 0;
  right: 50px;
  height: 20px;
}

#select-by_widget .row svg {
  position: absolute;
  left: 78px;
  top: 0;
  width: 20px;
  height: 20px;
}

#select-by_widget .row label.is .row-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 255px;
  font-size: 11px;
  line-height: 19px;
  left: 102px;
  top: 0;
  position: absolute;
  height: 20px;
}

#select-by_widget .row .is span {
  height: 20px;
  line-height: 25px;
  font-size: 10px;
  position: absolute;
  width: 40px;
  right: 0px;
  text-align: center;
  top: 0;
}

#select-by_widget .row .not {
  height: 20px;
  line-height: 25px;
  font-size: 10px;
  position: absolute;
  width: 44px;
  right: 0;
  top: 0;
  text-align: center;
}

#select-by_widget .row label {
  cursor: pointer;
}

#select-by_widget .row div.count {
  width: 72px;
  background-color: rgba(50, 50, 50, 0.1);
  height: 20px;
  text-align: right;
  text-overflow: unset;
  padding-right: 4px;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
}

#select-by_widget .row {
  height: 20px;
  position: relative;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.6);
}

#select-by_widget .row,
#select-by_widget .tags_title {
  border-bottom: 1px solid #ccc;
}

#select-by_widget .tags_title {
  color: #555;
  height: 15px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  background-color: rgba(50, 50, 50, 0.1);
}

#select-by_widget {
  height: 480px;
}

.widget,
#remove_tags_widget,
#add_tags_widget,
#reblog_widget,
#backdate_widget,
#snapshot-info_widget,
#urlstuff_widget,
#add-caption_widget,
#select-by_widget {
  background: rgba(235, 235, 235, 0.9) none !important;
  box-shadow: inset 0 0 4px 5px #fff,
    inset 0 0 5px 2px #000,
    0 0 8px 1px #000;
  border-radius: 9px;
  position: fixed;
}

#select-by_widget {
  font: normal 12px 'Lucida Grande', Verdana, sans-serif;
  padding: 9px;
  width: 440px;
  text-align: left;
  z-index: 10;
}

#tag_editor * {
  font: normal 14px/1.4 "Helvetica Neue",
    "HelveticaNeue", Helvetica, Arial, sans-serif;
}

#tags,
#tag_editor,
#widget_scrolling_part {
  box-shadow: inset 0 0 0 1px #ccc,
    inset 0px 3px 6px 0px #ccc;
}

#tag_editor {
  background: none rgba(255, 255, 255, 0.7);
}

#widget_scrolling_part {
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 48px;
  left: 4px;
  right: 4px;
  bottom: 48px;
  cursor: default;
}

#widget-top-buttons,
#widget-top-buttons .sort {
  position: absolute;
}

#widget-top-buttons {
  top: 0;
  left: 0;
  right: 0;
}

#widget-top-buttons .sort {
  top: 30px;
  font-size: 12px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
}

#widget-top-buttons .sort.num {
  left: 15px;
}

#widget-top-buttons .sort.abc {
  left: 90px;
}

#widget-top-buttons .sort.date {
  left: 185px;
}

.row .tag-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 1px;
  opacity: 0.6;
}

.row.type.notes-more-than .number-input,
.row.type.notes-less-than .number-input {
  border: 1px solid #555;
  width: 90px;
  position: absolute;
  right: 88px;
  height: 18px;
  top: 0;
  border: 1px solid #555;
  box-shadow: inset 0 1px 2px 0px #ccc;
}

#urlstuff_widget input {
  width: 180px;
  height: 22px;
  border: 1px solid #999;
  padding: 2px;
  box-shadow: inset 0 1px 2px 0px #555;
}

#select-by-widget_title {
  font-size: 17px;
  font-weight: bold;
  color: #555;
}

#select-by-widget_title .preselect-count {
  color: rgba(0, 130, 0, 0.6);
  font-size: 12px;
  background-color: #fff;
  height: 21px;
  min-width: 60px;
  border-radius: 12px;
  box-shadow: inset 0 1px 2px 0px #555;
  margin-left: 12px;
  position: absolute;
  top: 8px;
  left: 160px;
  text-align: center;
  line-height: 21px;
  transform: translateX(-505%);
}

#uncheck+label {
  color: #999;
}

#show-only:checked+label+#uncheck+label+span,
#show-only+label {
  color: #999;
}

#show-only:checked+label,
#uncheck:checked+label {
  color: #555;
}

#show-only:checked+label+#uncheck+label,
#show-only:checked+label+#uncheck {
  visibility: hidden;
}

#show-only {
  margin-top: 5px;
  margin-right: 60px;
}

#show-only,
#show-only+label {
  float: right;
}

#select-by_widget .select-by_ltgt {
  position: absolute;
  bottom: 5px;
  right: 90px;
  border: 1px solid #888;
  width: 203px;
  height: 39px;
}

#gt_input,
#lt_input {
  position: absolute;
  left: 78px;
}

#lt_input,
#lt_input+label {
  top: 4px;
}

#gt_input,
#gt_input+label {
  top: 22px;
}

#gt_input+label,
#lt_input+label {
  left: 0px;
  width: 72px;
  position: absolute;
  color: #999;
  text-align: right;
  cursor: pointer;
}

#gt_input:checked+label,
#lt_input:checked+label {
  color: #555;
}

#lt_input+label+#gt_input+label+#hide-ltgt-than-tags {
  opacity: 0.5;
  width: 55px;
  position: absolute;
  top: 8px;
  left: 97px;
  border: 1px solid #555;
  box-shadow: inset 0 1px 2px 0px #ccc;
  height: 23px;
}

#lt_input+label+#gt_input:checked+label+#hide-ltgt-than-tags,
#lt_input:checked+label+#gt_input+label+#hide-ltgt-than-tags {
  opacity: 1;
}

.l-content .brick .title {
  margin: 0;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  width: 110px;
}

.l-content .brick>* {
  max-width: 125px;
}

.l-content .brick.picked {
  overflow: visible;
  box-shadow: 0 0 12px 2px rgba(14, 19, 84, 0.5);
  z-index: 60;
}

.l-content .brick.highlighted {
  animation: updown 0.1s ease-in both;
}

.l-content .brick.highlighted.picked {
  overflow: visible;
  box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.5);
  z-index: 60;
}

.l-content .brick.prevent-anim,
.l-content .brick.highlighted.picked {
  animation: none;
}
*/}).toString().slice(15,-3) + // this is a pointing hand graphic
'.l-content .brick.picked:before { content: ""; top: -35px;\n'+
'width: 50px; height: 50px; position: absolute;left: 25px;\n' +
'animation: updown 0.5s infinite ease-out both;\n' + // bounces up&down :)
'background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iM' +
'S4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM' +
'6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0ia' +
'HR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly9' +
'3d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0ia' +
'HR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9' +
'yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY' +
'2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR' +
'0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9I' +
'jI0IgogICBoZWlnaHQ9IjI0IgogICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHZlcnNpb24' +
'9IjEuMSIKICAgaWQ9InN2ZzQiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImI2NC5zdmciCiAgI' +
'Glua3NjYXBlOnZlcnNpb249IjAuOS41ICgyMDYwZWMxZjlmLCAyMDIwLTA0LTA4KSI+CiA' +
'gPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTAiPgogICAgPHJkZjpSREY+CiAgICAgI' +
'DxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0Pml' +
'tYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgI' +
'HJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2U' +
'iIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KI' +
'CAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM4IiA' +
'vPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgI' +
'CAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICB' +
'vYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1a' +
'WRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICB' +
'pbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iN' +
'zMyIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjQ4MCIKICAgICBpZD0ibmFtZWR' +
'2aWV3NiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iOS44I' +
'gogICAgIGlua3NjYXBlOmN4PSIxMiIKICAgICBpbmtzY2FwZTpjeT0iMTIiCiAgICAgaW5' +
'rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAga' +
'W5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWx' +
'heWVyPSJzdmc0IiAvPgogIDxwYXRoCiAgICAgZD0ibSA1LjQsMTYuNCBjIDEuMSwwLjIgN' +
'C42LDAuOSA1LjUsMS4wIHYgMy41IGMgMCwxLjYgMS4zLDIuOSAzLDIuOSAxLjYsMCAzLC0' +
'xLjMgMywtMi45IHYgLTcuNCBjIDAuNSwwLjMgMS4xLDAuNiAxLjgsMC43IEMgMjAuNiwxN' +
'C41IDIyLDEzLjMgMjIsMTEuOCAyMiwxMSAyMS42LDEwLjEgMjAuOSw5LjUgMTcuMCw1LjU' +
'gMTUuMiw0LjQgMTQuOSwwIEggNSB2IDEuNyBjIDAsNS4xIC0zLDYuMCAtMywxMC4wIDAsM' +
'i40IDEuMCw0LjEgMy40LDQuNiB6IgogICAgIGlkPSJwYXRoMTQiIC8+CiAgPHBhdGgKICA' +
'gICBkPSJNIDUuMSw4LjQgQyA1LjksNi45IDYuOSw1LjEgNi45LDIgaCA2LjEgYyAwLjcsM' +
'y44IDMuOCw2LjMgNi40LDguOSAwLjYsMC42IDAuMywxLjMgLTAuNCwxLjMgQyAxNy44LDE' +
'yLjMgMTYuMCwxMC40IDE1LDkuMSBWIDIxLjAgQyAxNSwyMS41IDE0LjUsMjIgMTQsMjIgM' +
'TMuNCwyMiAxMywyMS41IDEzLDIxLjAgdiAtNi45IGMgMCwtMC4zIC0wLjIsLTAuNSAtMC4' +
'1LC0wLjUgLTAuMywwIC0wLjUsMC4yIC0wLjUsMC41IHYgMC41IGMgMCwwLjUgLTAuNCwwL' +
'jkgLTEuMCwwLjggLTAuMywtMC4wIC0wLjYsLTAuNCAtMC42LC0wLjggdiAtMS4yIGMgMCw' +
'tMC4zIC0wLjIsLTAuNSAtMC41LC0wLjUgLTAuMywwIC0wLjUsMC4yIC0wLjUsMC41IHYgM' +
'C44IGMgMCwwLjUgLTAuNCwwLjkgLTEuMCwwLjggQyA3LjYsMTQuOSA3LjMsMTQuNiA3LjM' +
'sMTQuMiB2IC0xLjUgYyAwLC0wLjMgLTAuMiwtMC41IC0wLjUsLTAuNSAtMC4zLDAgLTAuN' +
'SwwLjIgLTAuNSwwLjUgdiAwLjkgYyAwLDAuNSAtMC41LDAuOCAtMS4wLDAuNiBDIDQuNSw' +
'xMy45IDQsMTMuMyA0LDExLjcgNCwxMC40IDQuNCw5LjUgNS4xLDguNCBaIgogICAgIGlkP' +
'SJwYXRoMiIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmIiAvPgo8L3N2Zz4K") 0 0 ' +
'no-repeat transparent;\nbackground-size: 50px 50px; z-index: 1001;}' +
// this ^ is a hand pointing pointer graphic
// this v is a tiny robot head icon
'.robot-warning { padding: 8px 9px 8px 21px;' + // :) tampermonkey tells
'background: 4px 2px no-repeat url("' + //  me it's superfluous to combine
'data:image/png;base64,iVBORw0KGgoAAAANSU' + //  string literals with the
'hEUgAAABAAAAAYBAMAAAABjmA/AAAAElBMVEUAAA' + // + operator! but it's
'ABBABHSEajnp28trX8//tPIl81AAAAAXRSTlMAQO' + // also not lint to
'bYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC' + // go above 80 characters
'4jAXilP3YAAAAHdElNRQfkBQgSLgK2/ku1AAAAa0' + // in width...
'lEQVQI123O2w3AIAgFUNygoAxANzBxAasL+OH+qx' + // dear StackExchange...
'R8tGnS+3USLgEAAIQZ148J7m0jr9G1Rk8Z3Be4An' +
'SOCIQ6khWp1mKIkgp5BfeQe/tFxFTQOsW2k4KIRM' + // kumate!
'Q6zK1ZxxuiQuwk5ffWfuMG6yMYLhjK67sAAAAASU' +
'VORK5CYII=") rgba(255,190,170,1);' +
'box-shadow: 0 0 0 1px red;font-size: 12px;font-weight: normal;'+
'color: red; width: 172px;overflow-wrap: normal;'+
'white-space: normal;margin: 9px;display:block;}' +
(function () {/*
.l-content .brick .private_overlay {
  z-index: 9;
}

.robot-warning strong {
  font-size: 13px;
  font-weight: bold;
  display: block;
}

.blue_bar .editor_navigation .notice {
  color: rgba(150, 150, 150, 1);
  margin: 0;
  padding: 5px 0px 0px 5px;
  float: right;
}

.l-content .brick .caption {
  display: none;
}

.l-content.with-captions.hoverless .brick .caption,
.l-content.with-captions .brick:hover .caption {
  display: table;
  background: rgba(40, 50, 60, 0.6);
  box-shadow: inset 0 0 0 4px rgba(40, 50, 60, 0.6);
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  text-align: left;
  width: 125px;
  height: 100%;
  animation: fadein 0.5s ease-in-out both;
}

.overflow-table {
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 125px;
  height: 100%;
}

.overflow-row,
.caption-tr {
  display: table-row;
}

.overflow-cell,
.caption-td {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.overflow-inline {
  display: inline-block;
  text-align: left;
}

.caption-inline-block {
  display: inline-block;
  text-align: left;
  max-width: 115px;
  max-height: 115px;
  overflow: hidden;
}

.header_button > input[disabled]+.widget+.chrome svg,
.header_button > input[disabled]+.widget+.chrome .arrow,
.chrome.big_dark[disabled] svg {
  opacity: 0.5;
}

.blue_bar .editor_navigation .header_button .chrome .chrome_button {
  padding: 1px 0px 0px 2px;
  font-family: Franklin Gothic Medium Compressed, Arial, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 14px;
  font-weight: normal;
}

.chrome.big_dark svg, .chrome_button svg {
  opacity: 1;
  margin-right: 1px;
  vertical-align: baseline;
  max-width: 13px;
  max-height: 13px;
  margin-left: 4px;
  position: relative;
}

#neue_post_form-iframe {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 10, 30, 0.9);
  animation: fadein 0.5s ease-in-out both;
}

.l-content .links-layer {
  display: none;
}

.l-content .brick .edited-gif,
.l-content.with-links .brick:hover .links-layer,
.l-content.with-links.hoverless .brick .links-layer {
  background-color: rgba(40, 50, 60, 0.6);
  box-shadow: inset 0 0 0 4px rgba(40, 50, 60, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  z-index: 100;
  display: table;
  width: 125px;
  height: 100%;
  animation: fadein 0.5s ease-in-out both;
}

.tags-layer h2, .tags-layer a {
  color: inherit;
}

.follow .tag-container {
  max-width: 89px;
  overflow: hidden;
  max-height: 100px;
}

.l-content.with-links .brick:hover .tags-layer,
.l-content.with-links .brick:hover .links-layer,
.l-content.with-links.hoverless .brick .tags-layer,
.l-content.with-links.hoverless .brick .links-layer {
  transition: all 0.2s ease-out;
}

.l-content.with-links.hoverless .brick:hover .links-layer,
.l-content.with-links.hoverless .brick:hover .tags-layer {
  color: rgba(255, 255, 255, 0);
  background-color: rgba(0, 0, 0, 0);
}

.l-content.with-links .brick.highlighted:hover .links-laye
.l-content.with-links.hoverless .brick.highlighted .links-layer {
  z-index: 1000;
  background-color: rgba(0, 80, 255, 0.5);
  box-shadow: inset 0 0 0 4px rgba(115, 186, 231, 1);
}

.l-content.with-links.hoverless .brick.highlighted:hover .links-layer {
  background-color: rgba(0, 80, 255, 0.05);
}

.brick.highlighted a.link-reblog,
.brick.highlighted a.link-like,
.brick.highlighted a.link-edit,
.brick.highlighted a.link-view {
  background: rgba(115, 186, 231, 1);
}

.l-content .brick .edited-gif .trow,
.l-content.with-links .brick:hover .links-layer .trow,
.l-content.with-links.hoverless .brick .links-layer .trow {
  display: table-row;
  vertical-align: middle;
  text-align: center;
}

.l-content .brick .tags-layer,
.l-content .brick .edited-center {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding: 0px 18px 0 18px;
}

.links-layer a.link-view {
  position: absolute;
  right: 4px;
  top: 4px;
  border-bottom-left-radius: 5px
}

.links-layer a.link-edit {
  position: absolute;
  left: 4px;
  bottom: 4px;
  border-top-right-radius: 5px;
}

.links-layer a.link-like {
  right: 4px;
  bottom: 4px;
  border-top-left-radius: 5px;
}

.links-layer a.link-reblog {
  left: 4px;
  top: 4px;
  border-bottom-right-radius: 5px;
}

.links-layer a.link-reblog,
.links-layer a.link-like,
.links-layer a.link-edit,
.links-layer a.link-view {
  background-color: rgba(40, 50, 60, 0.6);
  padding: 3px;
  width: 20px;
  height: 20px;
  text-align: center;
  position: absolute;
}

svg.big-heart,
svg.big-reblog {
  position: absolute;
  left:0;
  bottom:0;
  width: 125px;
  height: 125px;
  z-index: 999;
  animation: happy-bounce 1.7s ease-out both;
}

.links-layer a.link-reblog.clicked svg,
.links-layer a.link-like.clicked svg {
  animation: flip 0.75s infinite ease-out both;
  position: relative;
}

.links-layer a.link-reblog.reblogged {
  cursor: default;
}

#view-links_button svg {
  margin: 0;
}

#mpe_title {
  position: relative;
  display: inline-block;
}

.post-state-nav-item {
  display: inline-block;
  text-decoration: none;
}

.post-state-nav-item svg {
  opacity: 0.5;
  display: inline-block;
  vertical-align: text-top;
}

.post-state-nav-item.active svg {
  opacity: 1;
}

.blue_bar .post-state-nav .post-state-nav-item {
  color: #99a3ae;
  font-weight: bold;
  padding: 3px 6px;
  top: -3px;
  left: 0;
  z-index: 9;
  position: relative;
  background: #001935 none;
}

#re-as-draft:checked+label+.robot-warning {
  display: none;
}

#re-as-draft+label {
  color: #7D99FF;
  padding-left: 5px;
  font-size: 20px;
}

#reblog_widget {
  display: none;
}

.open #reblog_widget {
  width: 300px;
  height: 200px;
  z-index: 999;
  left: 340px;
  display: table;
}

#urlstuff_widget,
#backdate_widget,
#snapshot-info_widget,
#add-caption_widget {
  z-index: 9;
}

#reblog_widget .trow {
  display: table-row;
}

#reblog_widget .inner {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

#reblog_widget h2 {
  color: #555;
  font-size: 17px;
}

#reblog-widget_input {
  width: 190px;
  padding: 6px;
  box-shadow: inset 0 2px 3px 0px rgba(0, 0, 0, 0.5);
  margin: 0;
  border: 0 none;
}

.header_button > input[disabled]+.widget+.chrome,
#reblog-widget_input[disabled] {
  color: #ccc;
}

#browse_months {
  position: relative;
  top: -3px;
  left: 0;
}

iframe#browse_months_widget {
  height: 423px;
  width: 226px;
  border-radius: 5px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
}

div#browse_months_widget {
  height: 422px;
  width: 225px;
  padding: 0px;
  top: 0px;
  left: 0px;
}

.post-state-nav,
#mpe_title,
#nav-photo {
  border-left: 1px solid #122943;
  padding-left: 20px;
}

#nav_archive {
    text-align: center;
    line-height: 18px;
}

.blue_bar .title, #browse_months {
    display: inline-block;
    flex-direction: unset;
    float: none;
}

.chrome_button_right, .chrome_button_left {
  display: inline;
}

#tags {
  padding: 5px;
}

#tags div {
  margin: 0px 5px 5px 0px;
  overflow: hidden;
  display: inline-block;
  border: solid 1px rgba(255,75,35,1);
  background-color: rgba(255,75,35,0.4);
  padding: 5px;
  border-radius: 2px;
  color: #111;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#photos-drop-zone.full {
  cursor: copy;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(200,255,200,0.5);
  z-index: 1000;
}

#photos-drop-zone {
  top: 90px;
  left: 20px;
  width: 300px;
  height: 190px;
  transition: all 0.4s ease-out;
  background-color: rgb(220, 220, 220);
  position: fixed;
  display: block;
  text-align: center;
  border-radius: 14px;
  box-shadow: inset 0 0 0 5px #f4f4f4, 0 0 0 4px rgb(220, 220, 220);
  z-index: 9;
}

#photos-drop-zone h2 {
  color: #f4f4f4;
  display: inline;
  font-size: 25px;
  font-weight: bold;
  top: 20px;
  position: relative;
  text-align: center;
  display: block;
}

#photos-drop-zone input {
  position: relative;
  top: 210px;
}

#drop_images_here {
  position: fixed;
  top: 168px;
  left: 70px;
  z-index: 12;
  font-size: 23px;
}

#photo_file_input {
  position: fixed;
  bottom: 40px;
  left: 40px;
}

#post_all_photos_button {
  position:fixed;
  top: 300px;
  cursor: pointer;
  color: #fff;
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 14px;
  left: 40px;
}

#post_all_photos_button[disabled] {
  color: #ccc;
}

.photo-brick.upload-working {
  animation: updown 0.3s infinite linear;
}

span.im-ready {
  animation: updown 0.25s 5 ease-out;
  position: relative;
  display: inline-block;
  z-index: 9;
}

.photo-brick-img,
.photo-brick {
  transition: all 0.4s ease-out;
}
.photo-brick {
  position: absolute;
  width: 500px;
  background-color: rgb(220, 220, 220);
  cursor: grab;
  display: table;
  min-height: 150px;
}

.img-count {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 21px;
  color: rgba(255,255,255,0.9);
  z-index: 9;
  font-weight: bold;
  background-color: rgba(0,0,0,0.65);
  padding: 6px 9px;
  border-top-left-radius: 9px;
}

.photo-inner {
  display: table-row;
  height: 100%;
  width: 100%;
}

.photo-brick-img.brick-dragging,
.photo-brick.brick-dragging {
  z-index: 1000;
  opacity: 0.3;
  box-shadow: 0 0 5px 2px #000;
  transition: none;
  postion: absolute;
}

.photo-brick.hl-top {
  border-top: 3px dashed #0cf;
  margin-top: 5px;
}

.photo-brick.hl-bottom {
  margin-top: -5px;
  border-bottom: 3px dashed #0cf;
}

.hl-up {
  border-top: 3px dashed #0cf;
  margin-top: 5px;
}

.hl-down {
  border-bottom: 3px dashed #0cf;
  margin-bottom: 5px;
}

.hl-left {
  border-left: 3px dashed #0cf;
  margin-left: 5px;
}

.hl-right {
  border-right: 3px dashed #0cf;
  margin-right: 5px;
}

.photo-brick-edit {
  display: table-cell;
}

.photo-brick-img-cell {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  top: 0;
  left: 0;
  width: 137px;
  background-color: #001935;
}

.pre-photoset .photo-brick-img-cell {
  background-color: #405975;
  box-shadow: inset 0 0 8px 1px #fff;
}

.photo-brick-img:first-child {
  margin-top: 5px;
}

.photo-brick-img {
  display: inline-block;
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 5px;
}

.photo-brick-img.brick-dragging,
.photo-brick-img.brick-dragging img,
.row-with-one-img,
.row-with-one-img img {
  width: 125px;
}

.row-with-two-img,
.row-with-two-img img {
  width: 60px;
}

.row-with-three-img,
.row-with-two-img {
  overflow: hidden;
}

.row-with-three-img img,
.row-with-two-img img {
  width: 100%;
  height: auto;
  max-width: 125px;
}

.row-with-two-img.data-photoset-a {
  margin-right: 5px;
}

.row-with-three-img,
.row-with-three-img img {
  width: 38px;
}

.row-with-three-img.data-photoset-a,
.row-with-three-img.data-photoset-b {
  margin-right: 5px;
}

.photo-brick img {
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.photo-brick-edit .rich {
  background-color: rgba(255,255,255,0.8);
  margin: 34px 6px 0px 6px;
  box-shadow: inset 0 2px 3px 0 #999;
  padding: 5px;
  cursor: auto;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;
  display: block;
  width: 340px;
  height: calc(100% - 42px);
}

#add-caption_widget .rich {
  background-color: rgba(255,255,255,0.8);
  margin: 30px 7px 0px 7px;
  box-shadow: inset 0 2px 3px 0 #999;
  padding: 5px;
  cursor: auto;
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
  width: 340px;
  height: 150px;
  text-align: left;
}

#add-caption_widget.visible-url .chrome,
#add-caption_widget .chrome,
.focused-rich.visible-url .photo-brick-edit .chrome,
.photo-brick-edit .chrome {
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 14px;
  display: none;
  position: absolute;
  cursor: pointer;
  min-width: 30px;
}

#add-caption_widget {
  height: 300px;
  width: 365px;
}

#snapshot-info_body {
  cursor: auto;
}

#snapshot-info_widget {
  padding: 20px;
  width: 400px;
  height: 320px;
}

#snapshot-info_body {
  position: relative;
  top: 0;
  left: 0;
  height: 360px;
}

#new-blogs {
  right: 10px;
  bottom: 55px;
}

#missing-blogs {
  left: 10px;
  bottom: 55px;
}

#snapshot-info_body h2 {
  display: inline-block;
  width: 190px;
  text-align: center;
}

#missing-blogs, #new-blogs {
  border: 1px solid #555;
  height: 240px;
  width: 169px;
  padding: 8px;
  position: absolute;
  overflow-x: hidden;
  text-overflow: ellipsis;
  overflow-y: auto;
  font: normal 11px 'Lucida Grande', Verdana, sans-serif;
  color: #555;
  background-color: rgba(255, 255, 255, 0.7);
}

#backdate_widget {
  height: 260px;
  width: 540px;
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 14px;
}

#backdate_widget .chrome{
  margin: 5px;
  float: right;
  padding: 0 8px;
}

#snapshot-info_widget .chrome,
#backdate_widget .chrome,
#add-caption_widget .chrome {
  border: 0 none;
}

.focused-rich.visible-url .photo-brick-edit .chrome,
.photo-brick-edit .chrome {
  top: 3px;
}

#add-caption_widget .chrome {
  top: 45px;
}

.photo-brick.focused-rich {
  z-index: 100;
  box-shadow: 0 0 5px 1px #03f;
  margin: -2px 0px 0px 5px;
}

.photo-brick-edit .photo-tags {
  max-height: 135px;
  display: inline-block;
  position: absolute;
  right: 0;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  top: 0;
  transform: translateX(100%);
}

.focused-rich .photo-tags {
  overflow: auto;
  background-color: rgba(0, 33, 255, 0.5);
  padding: 4px 0px 0px 6px;
}

#add-caption_widget.visible-url .chrome,
#add-caption_widget .chrome,
.focused-rich .photo-brick-edit .chrome {
  display: block;
}

.stripe {
  position: absolute;
  top: 7px;
  left: 143px;
  border-top: 5px solid #BBB;
  height: 10px;
  width: calc(100% - 150px);
  display: block;
  border-bottom: 5px solid #BBB;
}

.focused-rich .photo-brick-edit .stripe {
  display: none;
}

.focused-rich .photo-brick-edit .photo-tags .token {
  float: left;
  padding: 3px 5px;
  border: solid 1px #b7c963;
  background-color: #C7DA76;
  color: #111;
  margin: 0px 5px 5px 0px;
  border-radius: 2px;
  font: normal 14px/1.4 "Helvetica Neue",
    "HelveticaNeue", Helvetica, Arial, sans-serif;
  text-decoration: none;
  cursor: auto;
}

.photo-brick-edit .photo-tags .token .tag:before {
  content: "#";
  display: inline-block;
}

.focused-rich .photo-brick-edit .photo-tags .token .tag:before {
  content: "";
  display: none;
}

.photo-brick-edit .token a {
  display: none;
}

#add-caption_widget a,
.focused-rich .photo-brick-edit .token a {
  font-weight: bold;
  margin-left: 7px;
  text-decoration: none;
  color: #749440;
  display: inline-block;
}

.photo-brick-edit .photo-tags .token {
  float: left;
  padding: 3px 5px;
  color: #999;
  font-weight: bold;
  margin: 0px 5px 5px 0px;
  font: normal 14px/1.4 "Helvetica Neue",
    "HelveticaNeue", Helvetica, Arial, sans-serif;
  text-decoration: underline;
  display: inline-block;
  cursor: auto;
}

.photo-brick-edit .clone_abc_button {
  right: 265px;
  width: 94px;
  line-height: 11px;
  top: -31px;
  box-shadow: 0 1px 0 3px rgb(220, 220, 220),
              0 0 5px 3px #03f;
}

#add-caption_widget .pink_button,
#add-caption_widget .x_button,
.photo-brick-edit .pink_button,
.photo-brick-edit .x_button {
  right: 327px;
  font-weight: 900;
  color: #f00;
}

#add-caption_widget .red_button,
#add-caption_widget .b_button,
.photo-brick-edit .red_button,
.photo-brick-edit .b_button {
  right: 295px;
  font-weight: 900;
}

#add-caption_widget .orange_button,
#add-caption_widget .i_button,
.photo-brick-edit .orange_button,
.photo-brick-edit .i_button {
  right: 263px;
  font-style: italic;
}

#add-caption_widget .yellow_button,
#add-caption_widget .s_button,
.photo-brick-edit .yellow_button,
.photo-brick-edit .s_button {
  right: 231px;
  font-style: italic;
  text-decoration-line: line-through;
}

#add-caption_widget .green_button,
#add-caption_widget .a_button,
.photo-brick-edit .green_button,
.photo-brick-edit .a_button {
  right: 199px;
  color: #009;
  text-decoration-line: underline;
}

#add-caption_widget .ok_button,
.focused-rich .photo-brick-edit .ok_button {
  right: 7px;
  display: none;
}

#add-caption_widget.visible-url .chrome,
#add-caption_widget.visible-colors .chrome,
#add-caption_widget .colors_buttons,
.focused-rich.visible-colors .photo-brick-edit .chrome,
.photo-brick-edit .colors_buttons,
.focused-rich .photo-brick-edit .colors_buttons {
  display: none;
}

#add-caption_widget .a_button_input,
.photo-brick-edit .a_button_input,
.focused-rich .photo-brick-edit .a_button_input {
  display: none;
  right: 199px;
  color: #009;
  text-decoration-line: underline;
  position: absolute;
  top: 3px;
  height: 30px;
  width: 318px;
  padding: 0 3px;
  left: 143px;
  background-color: #fff;
  box-shadow: 0 0 0 1px #eee, inset 0 2px 2px 0 #000;
}

#add-caption_widget.visible-url .a_button_input,
#add-caption_widget.visible-url .ok_button,
.focused-rich.visible-url .photo-brick-edit .a_button_input,
.focused-rich.visible-url .photo-brick-edit .ok_button {
  display: block;
}

#add-caption_widget.visible-colors .colors_buttons,
.focused-rich.visible-colors .photo-brick-edit .colors_buttons {
  display: block;
}

#add-caption_widget .cerulean_button,
#add-caption_widget .h_button,
.photo-brick-edit .cerulean_button,
.photo-brick-edit .h_button {
  right: 167px;
  font-weight: 900;
}

#add-caption_widget .blue_button,
#add-caption_widget .ol_button,
.photo-brick-edit .blue_button,
.photo-brick-edit .ol_button {
  right: 135px;
}

#add-caption_widget .ul_button,
.photo-brick-edit .ul_button {
  right: 103px;
}

#add-caption_widget .bq_button,
.photo-brick-edit .bq_button {
  right: 71px;
}

#add-caption_widget .colors_button,
.photo-brick-edit .colors_button {
  right: 39px;
}

#add-caption_widget .q_button,
.photo-brick-edit .q_button {
  right: 7px;
  font-family: Fairwater, serif;
  font-size: 17px;
  line-height: 26px;
}

#add-caption_widget .colors_button .color,
.photo-brick-edit .colors_button .color {
  width: 14px;
  height: 17px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px #fff;
  background: linear-gradient(
    to bottom,
    rgba(255,0,0,1) 0%,
    rgba(255,85,0,1) 20%,
    rgba(255,255,0,1) 40%,
    rgba(0,255,0,1) 60%,
    rgba(0,0,255,1) 80%,
    rgba(255,0,255,1) 100%
  );
}

#photos_as_draft_container {
    position: fixed;
    top: 340px;
    left: 50px;
}

#photos_as_draft + label + .robot-warning {
  display: block;
}

#photos_as_draft:checked + label + .robot-warning {
  display: none;
}

#return_to_dash_link {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #555;
  font-size: 45px;
}

#add-caption_widget .robot-warning {
  display: inline-block;
}

.pend-container {
  text-align: left;
}

.pend-container div {
  height: 20px;
}

.pend-container label {
  cursor: pointer;
}

#overwrite-caption-option + label +.robot-warning {
  position: absolute;
  left: 70px;
  bottom: -11px;
  width: 136px;
  display: none;
  height: 50px;
}

#overwrite-caption-option:checked + label +.robot-warning {
  display: block;
}

.pend-container {
  position: relative;
  left: 6px;
  bottom: -6px;
}

#bt-no-time + label,
#bt-one-time + label,
#bt-two-time + label,
#bd-no-day + label,
#bd-one-day + label,
#bd-two-day + label {
  width: 130px;
  text-align: left;
  height: 19px;
  background-color: rgba(14,20,25,0.5);
  border-radius: 10px;
  color: #fff;
  padding: 5px 20px;
}

#bt-no-time:checked + label,
#bt-one-time:checked + label,
#bt-two-time:checked + label,
#bd-no-day:checked + label,
#bd-one-day:checked + label,
#bd-two-day:checked + label {
  background-color: #0ae;
}

#bt-no-time,
#bt-one-time,
#bt-two-time,
#bd-no-day,
#bd-one-day,
#bd-two-day {
  position: relative;
  left: 18px;
}

.date-input-bunch * {
  float: left;
  line-height: 17px;
}

.date-input-bunch {
  display: inline-block;
  background-color: rgba(30,85,125,1);
  color: #fff;
  margin: 0px 3px;
  width: 245px;
  height: 22px;
  top: 9px;
  position: relative;
  padding: 3px 0px 3px 5px;
}

.date-input-bunch input[type="number"] {
  margin-left: 3px;
  max-width: 50px;
  box-shadow: inset 0px 1px 3px 0px #000;
}

.date-input-bunch label {
  text-align: center;
  color: #0ae;
  width: 40px;
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
}

.date-input-bunch label.rlabel {
  background-color: #3bc;
  color: #fff;
  border-bottom-right-radius: 9px;
  border-top-right-radius: 9px;
  height: 21px;
}

.date-input-bunch label.rlabel.narrow {
  width: 20px;
}

.date-input-bunch .linput {
 width: 40px;
}

#bt-no-time:checked+label+.date-input-bunch+.date-input-bunch,
#bt-no-time:checked+label+.date-input-bunch,
#bd-no-day:checked+label+.date-input-bunch+.date-input-bunch,
#bd-no-day:checked+label+.date-input-bunch {
  opacity: 0.3;
}

#bt-one-time:checked+label+input+label+input+label+
.date-input-bunch+.date-input-bunch,
#bd-one-day:checked+label+input+label+input+label+
.date-input-bunch+.date-input-bunch {
  opacity: 0.3;
}

#backdate_widget div {
  margin-bottom: 7px;
}

#pmright+label:before,
#pmleft+label:before {
  position: relative;
  content: "am";
  display: inline-block;
}

#pmright:checked+label:before,
#pmleft:checked+label:before {
  content: "pm";
}

.source-label1 {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9;
  background-color: rgba(0,0,0,0.5);
  border-radius: 30px;
}

.source-label2 {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
  background-color: rgba(100,110,255,0.4);
  border-radius: 30px;
}

.follower-pop-t {
  display: table;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  z-index: 1000;
}

.follower-pop-tr {
  display: table-row;
  width: 100%;
  height: 100%;
}

.follower-pop-td {
  display: table-cell;
  width: 100%;
  height: 100%;
  text-align: center;
  vertical-align: middle;
}

.follower-pop-inner {
  display: inline-block;
  width: 512px;
}

.follower-pop-av,
.follower-pop-img {
  display: inline-block;
  width: 512px;
  height: 512px;
}

.follower-pop-title {
  font-size: 45px;
  padding: 9px;
  line-height: 45px;
}

.l-content .brick.follow.missing-follows-info .overlay {
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(https://assets.tumblr.com/images/loading_ddd.gif)
              50% 20px no-repeat rgba(255,255,255,0.9);
  width: 125px;
  height: 125px;
  border: 0 none;
}
.l-content .brick.edit-reblog-queue .highlight {
  background: url(https://assets.tumblr.com/images/loading_ddd.gif)
              50% 20px no-repeat rgba(225,185,35,0.9);
  display: block;
  border-color: rgba(225,95,35,1);
}

.l-content .brick.edit-reblog-queue .highlight .note_count,
.l-content .brick.edit-reblog-queue .highlight .tag_count,
.l-content .brick.edit-reblog-queue .highlight .tag_count:after,
.l-content .brick.edit-reblog-queue .overlay .inner .date {
  background-color: rgba(225,95,35,1);
}

#hover-only {
  margin-left: 3px;
}

#hover-only,
#hover-only+label svg {
  vertical-align: text-bottom;
}

#hover-only+label svg {
  width: 10px;
  height: 10px;
}

#hover-only+label {
  font-weight: bold;
  color: #fff;
  opacity: 0.5;
  font-size: 10px;
}

#hover-only:checked+label {
  opacity: 1;
}

#hover-only, #hover-only+label {
  top: 3px;
  position: relative;
}

#who-follows-who {
    font-size: 24px;
}

#snapshot-info_body * {
  font-family: "Helvetica Neue",
    "HelveticaNeue", Helvetica, Arial, sans-serif;
}

#forget1_button, #forget2_button {
  position: absolute;
  bottom: 29px;
  padding: 0 9px;
}

#snapshot-info_body a {
  display: block;
  text-align: left;
  margin: 4px;
  font-size: 14px;
}

#forget1_button {
  left: 65px;
}

#forget2_button {
  right: 65px;
}

#snapshot-info_body h1 {
  color: #555;
  font-size: 20px;
  display: block;
  font-weight: bold;
}

#snapshot-load-gif {
  position: absolute;
  top: 0;
  left: 0;
}

#new-blogs a {
  color: #59f;
}

#missing-blogs a {
  color: #f00;
}

.l-content~.l-content {
  display: none;
}
*/}).toString().slice(15,-3)
    )
  );
  // all of my extra css are in this ^ inline style
  document.head.appendChild(pluginStyle);
  // end extra CSS

  // my plugin will not use unSafeWindow, so instead
  // this v, is how I shall use fake window scope wrapper variables
  // for asynchronous window functions, the plugin data must be in the DOM
  // the DOM can be accessed by both wrapper scopes
  // it's like a 4 dimensional being :)
  var pluginData = document.createElement("div");
  pluginData.id = "mass_post_features-plugin_data";
  pluginData.classList.add("blog-menu-preload");
  pluginData.classList.add("month-menu-preload");
  pluginData.setAttribute("widget_sort-by", "date-down");
  pluginData.setAttribute("data-last-post-index", "0");
  pluginData.setAttribute("data-select-all_needle", "0");
  pluginData.setAttribute("data-select-by_needle", "0");
  pluginData.setAttribute("data-last_month_timestamp", "0")
  pluginData.setAttribute("data-last_year_timestamp", "0");
  pluginData.setAttribute("widget_scroll-top", "0");
  pluginData.setAttribute("widget_first-focus", "hide-ltgt-than-tags");
  pluginData.setAttribute("select-by-note_lt", "10");
  pluginData.setAttribute("select-by-note_gt", "5");
  pluginData.setAttribute("hide-ltgt-than-tags", "5");
  pluginData.setAttribute("data-to-seconds", "0");
  pluginData.setAttribute("data-unstable-next-href", "0");
  pluginData.setAttribute("data-lt-to-select", "[]");
  pluginData.setAttribute("data-gt-to-select", "[]");
  pluginData.setAttribute(
    "data-all-to-select",
    "{\"istag\":[],\"nottag\":[],\"istype\":[],\"nottype\":[]}"
  );// this ^ has the 4 dimensions of the select-by widget
  pluginData.setAttribute("data-to-select", "[]");
  pluginData.setAttribute("data-tags_all_arr", "[]");
  pluginData.setAttribute("data-ids_all_arr", "[]");
  pluginData.setAttribute("data-visible_ids_all_arr", "[]");
  pluginData.setAttribute("data-types_all_arr", "[]");
  pluginData.setAttribute("data-follow-blogs-all", "[]");
  pluginData.setAttribute("data-new-blogs-all", "[]");
  pluginData.setAttribute("data-missing-blogs-all", "[]");
  pluginData.setAttribute("data-follow-blogs-all-updated", "0");
  pluginData.setAttribute("data-new-blogs-all-updated", "0");
  pluginData.setAttribute("data-missing-blogs-all-updated", "0");
  pluginData.setAttribute("data-id_to_tags", "{}");
  pluginData.setAttribute("data-id_to_types", "{}")
  pluginData.setAttribute("data-id_to_image", "{}");
  pluginData.setAttribute("data-id_to_origin", "{}");
  pluginData.setAttribute("data-id_to_state", "{}");
  pluginData.setAttribute("data-id_to_timestamp", "{}");
  pluginData.setAttribute("data-id_to_notes", "{}");
  pluginData.setAttribute("data-tag_to_ids", "{}");
  pluginData.setAttribute("data-type_to_ids", "{}");
  pluginData.setAttribute("data-csrf-token", "0");
  pluginData.setAttribute("data-reblog-to-here", name);
  pluginData.setAttribute("data-primary-blog", name); // correct guess later
  pluginData.setAttribute("data-tumblelogs", "[]"); // all blogss
  pluginData.setAttribute("data-primary-known", "false");
  pluginData.setAttribute("data-followers-loading", "false");
  pluginData.setAttribute("data-x-tumblr-form-key", "0");
  pluginData.setAttribute("data-column_gutter", "6");
  pluginData.setAttribute("data-current_edit_index", "-1");
  pluginData.setAttribute("data-single_edit_id", "0");
  pluginData.setAttribute("data-current_edit_action", "reblog");
  pluginData.setAttribute("data-photos_height", "150");
  var pluginDataShell = document.createElement("div");
  pluginDataShell.appendChild(pluginData);
  document.body.insertBefore(pluginDataShell, document.body.firstChild);
  // this ^, per classList booleans and data-attributes, etc.
  // one giant DOM element attribute tree,
  // like every post on the Tumblr dashboard 2016

  // this v, is how I shall draw a selection box
  var data = document.getElementById(
    "mass_post_features-plugin_data"
  );
  data.setAttribute("doc-title", document.title);

  // the mousedown contains a variety of things for other functions
  window.addEventListener("mousedown", function (e) {
    if (e.which !== 1) {
      return true;
    }
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var selectionBox = document.getElementById(
      "mass_post_features-plugin_selection_box"
    );
    var targ = e.target;
    var cont = targ; // container(parent)
    // this only runs on the photos page
    if (data.classList.contains("is-uploading-photos")) {
      // batch photos dragging
      while (
        cont.parentNode !== null &&
        typeof cont.parentNode !== "undefined" &&
        cont.nodeName !== "BODY" &&
        cont.id !== "add_tags_widget" &&
        cont.nodeName !== "A" &&
        cont.nodeName !== "BUTTON" &&
        !cont.classList.contains("photo-tags") &&
        !cont.classList.contains("photo-brick") &&
        !cont.classList.contains("photo-brick-img") &&
        !cont.classList.contains("rich") // edit
      ) {
        cont = cont.parentNode;
      }
      if (
        !data.classList.contains("photo-upload-in-progress") &&
        typeof cont !== "undefined" &&
        typeof cont.nodeName !== "undefined" &&
        (
          cont.nodeName === "A" ||
          cont.nodeName === "BUTTON"
        )
      ) {
        if (cont.parentNode.classList.contains("token")) {
          cont.parentNode.parentNode.removeChild(
            cont.parentNode
          );
        }
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        return true;
      }
      if (
        !data.classList.contains("photo-upload-in-progress") &&
        typeof cont !== "undefined" &&
        typeof cont.classList !== "undefined" &&
        (
          cont.classList.contains("photo-brick") ||
          cont.classList.contains("photo-brick-img")
        )
      ) {
        if (cont.classList.contains("focused-rich")) {
          var addTagsWidget = document.getElementById(
            "add_tags_widget"
          );
          addTagsWidget.style.display = "block";
        }
        var bcr = cont.getBoundingClientRect();
        cont.setAttribute("original-x", bcr.left);
        cont.setAttribute("original-y", bcr.top);
        var bmx = bcr.left - e.clientX;
        var bmy = bcr.top - e.clientY;
        if (cont.classList.contains("photo-brick-img")) {
          bmx -= 360;
          bmy -= cont.parentNode.getBoundingClientRect().top +
                 document.documentElement.scrollTop;
        }
        cont.setAttribute("mouse-x-from-left", bmx);
        cont.setAttribute("mouse-y-from-top", bmy - cont.clientHeight);
        cont.classList.add("brick-dragging");
        cont.style.marginBottom = "-" + cont.clientHeight + "px";
      } else if (
        typeof cont !== "undefined" &&
        typeof cont.classList !== "undefined" &&
        !cont.classList.contains("rich") &&
        cont.id !== "add_tags_widget"
      ) {
        var fr = document.getElementsByClassName("focused-rich");
        while (fr.length > 0 ) {
          fr[0].classList.remove("focused-rich");
        }
      }
    }
    targ = e.target;
    cont = targ;
    var initialMouseX = e.pageX;
    var initialMouseY = e.pageY;
    while (
      cont.parentNode !== null &&
      typeof cont.parentNode !== "undefined" &&
      cont.nodeName !== "BODY" &&
      cont.id !== "nav_archive" &&
      cont.id !== "blog_menu" &&
      cont.id !== "select-by_widget" &&
      cont.id !== "add-caption_widget" &&
      cont.id !== "backdate_widget" &&
      cont.id !== "snapshot-info_widget" &&
      cont.id !== "snapshot-info_body" &&
      cont.id !== "urlstuff_widget" &&
      cont.id !== "urlstuff_body" &&
      cont.id !== "backdate-body" &&
      cont.id !== "reblog_widget" &&
      cont.id !== "select-by-widget_title" &&
      cont.id !== "remove_tags_widget" &&
      cont.id !== "add_tags_widget" &&
      cont.id !== "tags" &&
      cont.id !== "tags_to_add" &&
      cont.id !== "tag_editor" &&
      cont.id !== "widget_scrolling_part" &&
      cont.id !== "reblog-widget_input" &&
      cont.id !== "rich_text_caption"
    ) {
      cont = cont.parentNode;
    }
    if (
        cont.id === "select-by_widget" ||
        cont.id === "select-by-widget_title" ||
        cont.id === "remove_tags_widget" ||
        cont.id === "add_tags_widget" ||
        cont.id === "reblog_widget" ||
        cont.id === "add-caption_widget" ||
        cont.id === "backdate_widget" ||
        cont.id === "snapshot-info_widget" ||
        cont.id === "urlstuff_widget"
    ) {
      var sbw = document.getElementById(
        cont.id === "select-by-widget_title" ? "select-by_widget": cont.id
      );
      // grabbing and dragging step #1
      var mx = sbw.getBoundingClientRect().left - e.clientX;
      var my = sbw.getBoundingClientRect().top - e.clientY;
      sbw.setAttribute("mouse-x-from-left", mx);
      sbw.setAttribute("mouse-y-from-top", my);
      sbw.classList.add("widget-dragging");
    }
    // close snapshot-info_widget
    var snapshotInfo = document.getElementById("snapshot-info");
    if (
      cont.id !== "snapshot-info_widget" &&
      cont.id !== "snapshot-info_body" &&
      snapshotInfo !== null && snapshotInfo.checked
    ) {
      snapshotInfo.checked = false;
    }
    // close urlstuff_widget
    var urlstuff = document.getElementById("urlstuff");
    if (
      cont.id !== "urlstuff_widget" &&
      cont.id !== "urlstuff_body" &&
      urlstuff !== null && urlstuff.checked
    ) {
      urlstuff.checked = false;
    }
    // close backdate_widget
    var backdate = document.getElementById("backdate");
    if (
      cont.id !== "backdate_widget" &&
      cont.id !== "backdate-body" &&
      backdate !== null && backdate.checked
    ) {
      backdate.checked = false;
    }
    // close add-caption_widget
    var addCaption = document.getElementById("add-caption");
    if (
      cont.id !== "add-caption_widget" &&
      cont.id !== "rich_text_caption" &&
      addCaption !== null && addCaption.checked
    ) {
      addCaption.checked = false;
    }
    // close select-by_widget
    var selectBy = document.getElementById("select-by");
    if (
      cont.id !== "select-by_widget" &&
      cont.id !== "select-by-widget_title" &&
      cont.id !== "widget_scrolling_part" &&
      selectBy !== null && selectBy.checked
    ) {
      var wsp = document.getElementById("widget_scrolling_part");
      data.setAttribute("widget_scroll-top", wsp.scrollTop);
      var pick = document.getElementsByClassName("picked");
      while (pick.length > 0) {
        pick[0].classList.remove("picked");
      }
      selectBy.checked = false;
    }
    // close blog menu, close reblog widget
    if (
      cont.id !== "blog_menu" &&
      cont.id !== "reblog_widget" &&
      cont.id !== "reblog-widget_input" &&
      data.classList.contains("open-blog_menu") &&
      !data.classList.contains("closing-blog_menu")
    ) {
      var o = document.getElementsByClassName("open");
      while (o.length > 0) {
        o[0].classList.remove("open");
      }
      data.classList.remove("open-blog_menu");
      e.cancelBubble = true;
      e.stopPropagation();
      data.classList.add("closing-blog_menu");
      data.classList.remove("open-blog_menu");
      return false;
    }
    if (data.classList.contains("closing-blog_menu")) {
      data.classList.remove("closing-blog_menu");
    }
    if (data.classList.contains("is-uploading-photos")) {
      return true;
      // we return here, because all this other thing
      // stuff is for other editor modes...
    }
    // draw selection box
    if (
      e.shiftKey &&
      !data.classList.contains("shift_key")
    ) {
      data.classList.add("shift_key");
    }
    if (
      !data.classList.contains("mousedown") &&
      cont !== null &&
      typeof cont === "object" &&
      cont.nodeName === "BODY" &&
      cont.id !== "nav_archive"
    ) {
      data.classList.add("mousedown");
      data.setAttribute("data-initial_mouse_x", initialMouseX);
      data.setAttribute("data-initial_mouse_y", initialMouseY);
    }
  });
  window.addEventListener("mouseup", function (e) {
    var drg = document.getElementsByClassName("widget-dragging");
    while (drg.length > 0) {
      drg[0].classList.remove("widget-dragging");
    }
    var pre = document.getElementsByClassName("pre-photoset");
    var hu;
    var hd;
    var hl;
    var hr;
    var hlb = document.getElementsByClassName("hl-bottom");
    var hlt = document.getElementsByClassName("hl-top");
    var bd = document.getElementsByClassName("brick-dragging");
    if (bd.length > 0 && bd[0].classList.contains("photo-brick")) {
      // drop row inbetween rows
      if (hlb.length + hlt.length === 0) {
        bd[0].style.left = bd[0].getAttribute("original-x") + "px";
        bd[0].style.top = bd[0].getAttribute("original-y") + "px";
      } else if (hlt.length > 0) {
        document.body.insertBefore(bd[0], hlt[0]);
      } else if (hlb.length > 0) {
        document.body.insertBefore(bd[0], hlb[0].nextSibling);
      }
      while (hlb.length > 0) {
        hlb[0].classList.remove("hl-bottom");
      }
      while (hlt.length > 0) {
        hlt[0].classList.remove("hl-top");
      }
      while (bd.length > 0) {
        bd[0].style.removeProperty("margin-bottom");
        bd[0].classList.remove("brick-dragging");
      }
      // rebuildColumn after row dragged
      rebuildPhotoColumn();
    } else if (
      bd.length > 0 && bd[0].classList.contains("photo-brick-img")
    ) {
      // drop into photoset instead...
      hu = document.getElementsByClassName("hl-up");
      hd = document.getElementsByClassName("hl-down");
      hl = document.getElementsByClassName("hl-left");
      hr = document.getElementsByClassName("hl-right");
      if (
        hlb.length + hlt.length > 0 &&
        hu.length + hd.length + hl.length + hr.length === 0
      ) {
        // drop into new Editor row thing, instead...
        bd[0].style.left = "0px";
        bd[0].style.top = "0px";
        loadPhotoIntoDOM(bd[0].children[0]);
      } else if (hu.length + hd.length + hl.length + hr.length > 0) {
        if (hu.length > 0) {
          // insert photo above, above (clap, clap, clap)
          if (
            hu[0].classList.contains("row-with-one-img") ||
            (
              (
                hu[0].classList.contains("row-with-two-img") &&
                hu[0].classList.contains("data-photoset-a")
              ) || (
                hu[0].classList.contains("row-with-three-img") &&
                hu[0].classList.contains("data-photoset-a")
              )
            )
          ) {
            // insertBefore... :P
            hu[0].parentNode.insertBefore(bd[0], hu[0]);
          } else if (
            (
              hu[0].classList.contains("row-with-two-img") &&
              hu[0].classList.contains("data-photoset-b")
            ) || (
              hu[0].classList.contains("row-with-three-img") &&
              hu[0].classList.contains("data-photoset-b")
            )
          ) {
            // insertBefore&Before
            hu[0].parentNode.insertBefore(
              bd[0], hu[0].previousSibling
            );
          } else if (
            hu[0].classList.contains("row-with-three-img") &&
            hu[0].classList.contains("data-photoset-c")
          ) {
            // insertAfter&Before&Before
            hu[0].parentNode.insertBefore(
              bd[0], // weird: siblings ARE always there and !== undefined
              hu[0].previousSibling.previousSibling
            ); // because everything is correct :P
          } else {
            hu[0].parentNode.insertBefore(bd[0], hu[0]);
          }
          bd[0].classList.add("row-with-one-img");
          bd[0].classList.remove("data-photoset-a");
          bd[0].classList.remove("data-photoset-b");
          bd[0].classList.remove("data-photoset-c"); // abc...
          bd[0].classList.remove("row-with-two-img");
          bd[0].classList.remove("row-with-three-img");
        } else if (hd.length > 0) {
          // insert photo below, below photo (clap, clap, clap)
          if (
            hd[0].classList.contains("row-with-one-img") ||
            (
              (
                hd[0].classList.contains("row-with-two-img") &&
                hd[0].classList.contains("data-photoset-b")
              ) || (
                hd[0].classList.contains("row-with-three-img") &&
                hd[0].classList.contains("data-photoset-c")
              )
            )
          ) {
            // insertAfter... :P
            hd[0].parentNode.insertBefore(bd[0], hd[0].nextSibling);
          } else if (
            (
              hd[0].classList.contains("row-with-two-img") &&
              hd[0].classList.contains("data-photoset-a")
            ) || (
              hd[0].classList.contains("row-with-three-img") &&
              hd[0].classList.contains("data-photoset-b")
            )
          ) {
            // insertAfter&After
            hd[0].parentNode.insertBefore(
              bd[0], hd[0].nextSibling.nextSibling
            );
          } else if (
            hd[0].classList.contains("row-with-three-img") &&
            hd[0].classList.contains("data-photoset-a")
          ) {
            // insertAfter&After&After
            hd[0].parentNode.insertBefore(
              bd[0], // assumed: my siblings ARE there and !== undefined
              hd[0].nextSibling.nextSibling.nextSibling
            ); // because everything is correct :P
          }
          bd[0].classList.add("row-with-one-img");
          bd[0].classList.remove("row-with-two-img");
          bd[0].classList.remove("row-with-three-img");
          // insert to the left, to the left... (clap, clap, clap)
        } else if (hl.length > 0) {
          // START: these next few chucks are: long and similar; don't get lost
          if (hl[0].classList.contains("row-with-one-img")) {
            bd[0].classList.add("data-photoset-a");
            hl[0].classList.add("data-photoset-b");
            // 123...
            bd[0].classList.remove("data-photoset-c");
            bd[0].classList.remove("data-photoset-b");
            hl[0].classList.remove("data-photoset-a");
            hl[0].classList.remove("data-photoset-c");
            // abc...
            hl[0].classList.remove("row-with-one-img");
            hl[0].classList.add("row-with-two-img");
            bd[0].classList.remove("row-with-one-img");
            bd[0].classList.add("row-with-two-img");
            bd[0].classList.remove("row-with-three-img");
          } else if (hl[0].classList.contains("row-with-two-img")) {
            // left of an "a" goes to the left
            if (hl[0].classList.contains("data-photoset-a")) {
              bd[0].classList.add("data-photoset-a");
              hl[0].classList.add("data-photoset-b");
              hl[0].nextSibling.classList.add("data-photoset-c");
              // 123...
              hl[0].nextSibling.classList.remove("data-photoset-b");
              hl[0].nextSibling.classList.remove("data-photoset-a");
              bd[0].classList.remove("data-photoset-c");
              bd[0].classList.remove("data-photoset-b");
              hl[0].classList.remove("data-photoset-a");
              hl[0].classList.remove("data-photoset-c");
              // abc...
              hl[0].classList.remove("row-with-two-img");
              hl[0].classList.add("row-with-three-img");
              hl[0].nextSibling.classList.remove("row-with-two-img");
              hl[0].nextSibling.classList.add("row-with-three-img");
              // left of a "b" goes in-between
            } else if (hl[0].classList.contains("data-photoset-b")) {
              hl[0].classList.add("data-photoset-c");
              bd[0].classList.add("data-photoset-b");
              hl[0].previousSibling.classList.add("data-photoset-a");
              // 123...
              hl[0].previousSibling.classList.remove("data-photoset-b");
              hl[0].previousSibling.classList.remove("data-photoset-c");
              bd[0].classList.remove("data-photoset-c");
              bd[0].classList.remove("data-photoset-a");
              hl[0].classList.remove("data-photoset-b");
              hl[0].classList.remove("data-photoset-a");
              // abc...
              hl[0].classList.remove("row-with-two-img");
              hl[0].classList.add("row-with-three-img");
              hl[0].previousSibling.classList.remove("row-with-two-img");
              hl[0].previousSibling.classList.add("row-with-three-img");
            }
            bd[0].classList.remove("row-with-one-img");
            bd[0].classList.remove("row-with-two-img");
            bd[0].classList.add("row-with-three-img");
          }
          // regardless, it's to the left...
          hl[0].parentNode.insertBefore(bd[0], hl[0]);
        } else if (hr.length > 0) {
          // insert to the right, to the right... (clap, clap, clap)
          if (hr[0].classList.contains("row-with-one-img")) {
            hr[0].classList.add("data-photoset-a");
            bd[0].classList.add("data-photoset-b");
            // 123...
            bd[0].classList.remove("data-photoset-c");
            bd[0].classList.remove("data-photoset-a");
            hr[0].classList.remove("data-photoset-b");
            hr[0].classList.remove("data-photoset-c");
            // abc...
            hr[0].classList.remove("row-with-one-img");
            hr[0].classList.add("row-with-two-img");
            bd[0].classList.remove("row-with-one-img");
            bd[0].classList.add("row-with-two-img");
            bd[0].classList.remove("row-with-three-img");
          } else if (hr[0].classList.contains("row-with-two-img")) {
            // right of an "a" goes to the in-between
            if (hr[0].classList.contains("data-photoset-a")) {
              hr[0].classList.add("data-photoset-a");
              bd[0].classList.add("data-photoset-b");
              hr[0].nextSibling.classList.add("data-photoset-c");
              // 123...
              hr[0].nextSibling.classList.remove("data-photoset-b");
              hr[0].nextSibling.classList.remove("data-photoset-a");
              bd[0].classList.remove("data-photoset-c");
              bd[0].classList.remove("data-photoset-a");
              hr[0].classList.remove("data-photoset-b");
              hr[0].classList.remove("data-photoset-c");
              // abc...
              hr[0].classList.remove("row-with-two-img");
              hr[0].classList.add("row-with-three-img");
              hr[0].nextSibling.classList.remove("row-with-two-img");
              hr[0].nextSibling.classList.add("row-with-three-img");
              // right of a "b" goes to the right
            } else if (hr[0].classList.contains("data-photoset-b")) {
              hr[0].previousSibling.classList.add("data-photoset-a");
              hr[0].classList.add("data-photoset-b");
              bd[0].classList.add("data-photoset-c");
              // 123...
              hr[0].previousSibling.classList.remove("data-photoset-b");
              hr[0].previousSibling.classList.remove("data-photoset-c");
              bd[0].classList.remove("data-photoset-a");
              bd[0].classList.remove("data-photoset-b");
              hr[0].classList.remove("data-photoset-a");
              hr[0].classList.remove("data-photoset-c");
              // abc...
              hr[0].classList.remove("row-with-two-img");
              hr[0].classList.add("row-with-three-img");
              hr[0].previousSibling.classList.remove("row-with-two-img");
              hr[0].previousSibling.classList.add("row-with-three-img");
            }
            bd[0].classList.remove("row-with-one-img");
            bd[0].classList.remove("row-with-two-img");
            bd[0].classList.add("row-with-three-img");
          }
          // regardless, it's to the right...
          hr[0].parentNode.insertBefore(bd[0], hr[0].nextSibling);
        }
      }
      if (
        !bd[0].classList.contains("row-with-one-img") &&
        !bd[0].classList.contains("row-with-two-img") &&
        !bd[0].classList.contains("row-with-three-img")
      ){
        bd[0].classList.add("row-with-one-img")
      }
      // END: thanks for bearing with me.
      pre = document.getElementsByClassName("pre-photoset");
      hu = document.getElementsByClassName("hl-up");
      hd = document.getElementsByClassName("hl-down");
      hl = document.getElementsByClassName("hl-left");
      hr = document.getElementsByClassName("hl-right");
      hlb = document.getElementsByClassName("hl-bottom");
      hlt = document.getElementsByClassName("hl-top");
      while (hlt.length > 0) {
        hlt[0].classList.remove("hl-top");
      }
      while (hlb.length > 0) {
        hlb[0].classList.remove("hl-bottom");
      }
      while (pre.length > 0) {
        pre[0].classList.remove("pre-photoset");
      }
      while (bd.length > 0) {
        bd[0].style.left = "0px";
        bd[0].style.top = "0px";
        bd[0].style.removeProperty("margin-bottom");
        bd[0].classList.remove("brick-dragging");
      }
      while (hu.length > 0) {
        hu[0].classList.remove("hl-up");
      }
      while (hd.length > 0) {
        hd[0].classList.remove("hl-down");
      }
      while (hl.length > 0) {
        hl[0].classList.remove("hl-left");
      }
      while (hr.length > 0) {
        hr[0].classList.remove("hl-right");
      }
      // observers should rebuildPhotoColumn
      setTimeout(rebuildPhotoColumn, 800);
      // but here goes one more time just in case :P
      // I thinks my pretty transition is delaying
      // the top/left/height... or something IDK...
    }
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var selectionBox = document.getElementById(
      "mass_post_features-plugin_selection_box"
    );
    if (data.classList.contains("mousedown")) {
      data.classList.remove("mousedown");
    }
    if (data.classList.contains("shift_key")) {
      data.classList.remove("shift_key");
    }
    if (selectionBox !== null) {
      selectionBox.parentNode.removeChild(selectionBox);
    }
    var ts = document.getElementsByClassName("temp-select");
    while (ts.length > 0) {
      ts[0].classList.remove("temp-select");
    }
  });
  var blueUp = 0;
  // resize the selection box and stuff :)
  window.addEventListener("mousemove", function (e) {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    var i;
    if (
      document.getElementsByClassName(
        "brick-dragging"
      ).length === 1
    ) {
      var bdrg = document.getElementsByClassName(
        "brick-dragging"
      )[0]; // being dragged
      var brk = document.getElementsByClassName(
        "photo-brick"
      );
      var img = document.getElementsByClassName(
        "photo-brick-img-cell"
      );
      var bmx = parseFloat(bdrg.getAttribute("mouse-x-from-left"));
      var bmy = parseFloat(bdrg.getAttribute("mouse-y-from-top"));
      var pre = document.getElementsByClassName("pre-photoset");
      var st = document.documentElement.scrollTop;
      var bx = e.clientX + bmx;
      var by = e.clientY + bmy + st;
      bdrg.style.left = bx + "px";
      bdrg.style.top = by + "px";
      var t;
      var b;
      var l;
      var pbi;
      var pr;
      var hlb = document.getElementsByClassName("hl-bottom");
      var hlt = document.getElementsByClassName("hl-top");
      if (
        !data.classList.contains("blueup-drag-scroll") &&
        e.clientY < 90 &&
        typeof bdrg !== "undefined"
      ) {
        data.classList.add("blueup-drag-scroll");
        clearInterval(blueUp);
        blueUp = setInterval(function () {
          var doc = document.documentElement;
          window.scrollTo(doc.scrollLeft, doc.scrollTop - 10);
        }, 10);
      } else if (
        !data.classList.contains("blueup-drag-scroll") &&
        e.clientY > window.innerHeight - 90 &&
        typeof bdrg !== "undefined"
      ) {
        data.classList.add("blueup-drag-scroll");
        clearInterval(blueUp);
        blueUp = setInterval(function () {
          var doc = document.documentElement;
          window.scrollTo(doc.scrollLeft, doc.scrollTop + 10);
        }, 10);
      } else {
        data.classList.remove("blueup-drag-scroll");
        clearInterval(blueUp);
      }
      if (bdrg.classList.contains("photo-brick")) {
        for (i = 0; i < brk.length; i++) {
          b = brk[i].getBoundingClientRect();
          t = b.top + st; // dragging photo-brick over <this
          if (
            (by > t && by < t + b.height) ||
            (i === 0 && by < t) ||
            (i === brk.length -1 && by > t)
          ) {
            if (
              (by + b.height / 2 > t) ||
              (i === brk.length -1 && by > t)
            ) { // highlight bottom
              brk[i].classList.add("hl-bottom");
              brk[i].classList.remove("hl-top");
            } else if (
              (by - b.height / 2 < t) ||
              (i === 0 && by < t)
            ) { // highlight top
              brk[i].classList.add("hl-top");
              brk[i].classList.remove("hl-bottom");
            }
          } else {
            brk[i].classList.remove("hl-bottom");
            brk[i].classList.remove("hl-top");
          }
        }
      }else if (bdrg.classList.contains("photo-brick-img")) {
        while (hlb.length > 0) {
          hlb[0].classList.remove("hl-bottom");
        }
        while (hlt.length > 0) {
          hlt[0].classList.remove("hl-top");
        }
        // this part withdraws the dragged image bdrg from current row
        if (// this may seem repetative...
          bdrg.classList.contains("row-with-two-img") &&
          bdrg.classList.contains("data-photoset-a") &&
          bdrg.nextSibling.classList.contains("data-photoset-b")
        ) {
          bdrg.style.removeProperty("height");
          bdrg.nextSibling.style.removeProperty("height");
          // 2
          bdrg.classList.remove("row-with-two-img");
          bdrg.nextSibling.classList.remove("row-with-two-img");
          // 1
          bdrg.nextSibling.classList.add("row-with-one-img");
          // and shift pop around
          bdrg.nextSibling.classList.remove("data-photoset-b");
          // remove remnant
          bdrg.classList.remove("data-photoset-a");
        } else if (
          bdrg.classList.contains("row-with-two-img") &&
          bdrg.classList.contains("data-photoset-b") &&
          bdrg.previousSibling.classList.contains("data-photoset-a")
        ) {
          bdrg.style.removeProperty("height");
          bdrg.previousSibling.style.removeProperty("height");
          // 2
          bdrg.classList.remove("row-with-two-img");
          bdrg.previousSibling.classList.remove("row-with-two-img");
          // 1
          bdrg.previousSibling.classList.add("row-with-one-img");
          // and shift pop around
          bdrg.previousSibling.classList.remove("data-photoset-a");
          // remove remnant
          bdrg.classList.remove("data-photoset-b");
        } else if (
          bdrg.classList.contains("row-with-three-img") &&
          bdrg.classList.contains("data-photoset-a") &&
          bdrg.nextSibling.classList.contains("data-photoset-b")
        ) {
          bdrg.style.removeProperty("height");
          bdrg.nextSibling.style.removeProperty("height");
          bdrg.nextSibling.nextSibling.
          style.removeProperty("height");
          // 3
          bdrg.classList.remove("row-with-three-img");
          bdrg.nextSibling.classList.remove("row-with-three-img");
          bdrg.nextSibling.nextSibling.
          classList.remove("row-with-three-img");
          // 2
          bdrg.nextSibling.classList.add("row-with-two-img");
          bdrg.nextSibling.nextSibling.
          classList.add("row-with-two-img");
          // and shift pop around
          bdrg.nextSibling.classList.add("data-photoset-a");
          bdrg.nextSibling.classList.remove("data-photoset-b");
          bdrg.nextSibling.nextSibling.
          classList.add("data-photoset-b");
          bdrg.nextSibling.nextSibling.
          classList.remove("data-photoset-c");
          // remove remnant
          bdrg.classList.remove("data-photoset-a");
        } else if (
          bdrg.classList.contains("row-with-three-img") &&
          bdrg.classList.contains("data-photoset-b") &&
          bdrg.nextSibling.classList.contains("data-photoset-c")
        ) {
          bdrg.style.removeProperty("height");
          bdrg.nextSibling.style.removeProperty("height");
          bdrg.previousSibling.style.removeProperty("height");
          // 3
          bdrg.classList.remove("row-with-three-img");
          bdrg.nextSibling.classList.remove("row-with-three-img");
          bdrg.previousSibling.classList.remove("row-with-three-img");
          // 2
          bdrg.nextSibling.classList.add("row-with-two-img");
          bdrg.previousSibling.classList.add("row-with-two-img");
          // and shift pop around
          bdrg.nextSibling.classList.add("data-photoset-b");
          bdrg.nextSibling.classList.remove("data-photoset-c");
          // this is a rare chance flip around
          bdrg.parentNode.insertBefore(bdrg.nextSibling, bdrg);
          // remove remnant
          bdrg.classList.remove("data-photoset-b");
        } else if (
          bdrg.classList.contains("row-with-three-img") &&
          bdrg.classList.contains("data-photoset-c") &&
          bdrg.previousSibling.classList.contains("row-with-three-img")
        ) {
          bdrg.style.removeProperty("height");
          bdrg.previousSibling.style.removeProperty("height");
          bdrg.previousSibling.previousSibling
            .style.removeProperty("height");
          // 3
          bdrg.classList.remove("row-with-three-img");
          bdrg.previousSibling.classList.remove("row-with-three-img");
          bdrg.previousSibling.previousSibling.
          classList.remove("row-with-three-img");
          // 2
          bdrg.previousSibling.classList.add("row-with-two-img");
          bdrg.previousSibling.previousSibling.
          classList.add("row-with-two-img");
          // and shift pop around
          // b stays b, a stays a
          // remove remnant
          bdrg.classList.remove("data-photoset-c");
        } // last one ^
        bdrg.classList.remove("hl-up");
        bdrg.classList.remove("hl-down");
        bdrg.classList.remove("hl-left");
        bdrg.classList.remove("hl-right");
        rebuildPhotoColumn();
        for (i = 0; i < brk.length; i++) { // dragging image
          b = brk[i].getBoundingClientRect();
          if (
            e.clientX > b.left &&
            e.clientX < b.left + 137 &&
            e.clientY > b.top &&
            e.clientY < b.bottom
          ) {
            brk[i].classList.add("pre-photoset");
            pbi = brk[i].getElementsByClassName("photo-brick-img");
            for (l = 0; l < pbi.length; l++) {
              if (typeof pbi[l] === "undefined" || pbi[l] === bdrg) {
                continue;
              }
              if (
                pbi.length >= 10 &&
                brk[i].getElementsByClassName(
                  "brick-dragging"
                ).length === 0
              ) {
                break;
              }
              pr = pbi[l].getBoundingClientRect();
              if (
                e.clientX > pr.left &&
                e.clientX < pr.right &&
                e.clientY > pr.top &&
                e.clientY < pr.bottom &&
                brk[i].classList.contains("pre-photoset")
              ) { // I should use dragover, but this is (sophisticated :p)
                if (e.clientY < pr.top + pr.height / 3) {
                  pbi[l].classList.add("hl-up");
                  // sliding to the above
                  pbi[l].classList.remove("hl-down");
                  pbi[l].classList.remove("hl-left");
                  pbi[l].classList.remove("hl-right");
                  // sliding to the under
                } else if (e.clientY > pr.top + pr.height * 0.75) {
                  pbi[l].classList.add("hl-down");
                  pbi[l].classList.remove("hl-up");
                  pbi[l].classList.remove("hl-left");
                  pbi[l].classList.remove("hl-right");
                  // sliding to the right
                } else if (e.clientX > pr.left + pr.width / 2) {
                  if (!pbi[l].classList.contains("row-with-three-img")) {
                    pbi[l].classList.remove("hl-up");
                    pbi[l].classList.remove("hl-down");
                    pbi[l].classList.remove("hl-left");
                    pbi[l].classList.add("hl-right");
                  }
                  // sliding to the left
                } else if (e.clientX < pr.left + pr.width / 2) {
                  if (!pbi[l].classList.contains("row-with-three-img")) {
                    pbi[l].classList.remove("hl-up");
                    pbi[l].classList.remove("hl-down");
                    pbi[l].classList.add("hl-left");
                    pbi[l].classList.remove("hl-right");
                  }
                }
              } else {
                pbi[l].classList.remove("hl-up");
                pbi[l].classList.remove("hl-down");
                pbi[l].classList.remove("hl-left");
                pbi[l].classList.remove("hl-right");
              }
            }
          } else { // dragging out of a photoset into new row
            brk[i].classList.remove("pre-photoset");
            if (
              e.clientX > b.left + 177 &&
              e.clientX < b.left + b.width &&
              e.clientY > b.top &&
              e.clientY < b.bottom
            ) {
              if (
                (e.clientY + b.height / 2 > b.top) ||
                (i === brk.length -1 && e.clientY > b.bottom)
              ) { // highlight bottom
                brk[i].classList.add("hl-bottom");
                brk[i].classList.remove("hl-top");
              } else if (
                (e.clientY - b.height / 2 < b.top) ||
                (i === 0 && e.clientY < b.top)
              ) { // highlight top
                brk[i].classList.add("hl-top");
                brk[i].classList.remove("hl-bottom");
              }
            } else {
              brk[i].classList.remove("hl-bottom");
              brk[i].classList.remove("hl-top");
            }
          }
        }
      }
    }
    if (
      document.getElementsByClassName(
        "widget-dragging"
      ).length === 1
    ) {
      var drg = document.getElementsByClassName(
        "widget-dragging"
      )[0];
      // grabbing and dragging step #2
      var mx = parseFloat(drg.getAttribute("mouse-x-from-left"));
      var my = parseFloat(drg.getAttribute("mouse-y-from-top"));
      if (document.getElementById("reblog_widget") !== null) {
        document.getElementById(
          "reblog_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "reblog_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("select-by_widget") !== null) {
        document.getElementById(
          "select-by_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "select-by_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("remove_tags_widget") !== null) {
        document.getElementById(
          "remove_tags_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "remove_tags_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("add_tags_widget") !== null) {
        document.getElementById(
          "add_tags_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "add_tags_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("add-caption_widget") !== null) {
        document.getElementById(
          "add-caption_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "add-caption_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("backdate_widget") !== null) {
        document.getElementById(
          "backdate_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "backdate_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("urlstuff_widget") !== null) {
        document.getElementById(
          "urlstuff_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "urlstuff_widget"
        ).style.top = (e.clientY + my) + "px";
      }
      if (document.getElementById("snapshot-info_widget") !== null) {
        document.getElementById(
          "snapshot-info_widget"
        ).style.left = (e.clientX + mx) + "px";
        document.getElementById(
          "snapshot-info_widget"
        ).style.top = (e.clientY + my) + "px";
      }
    }
    var targ = e.target;
    var cont = targ;
    var initialMouseX = parseFloat(
      data.getAttribute("data-initial_mouse_x")
    );
    var initialMouseY = parseFloat(
      data.getAttribute("data-initial_mouse_y")
    );
    var newMouseX = e.pageX;
    var newMouseY = e.pageY;
    var mouseWidth = Math.abs(initialMouseX - newMouseX);
    var mouseHeight = Math.abs(initialMouseY - newMouseY);
    var mouseDiff = Math.hypot(mouseWidth, mouseHeight);
    var selectionBox = document.getElementById(
      "mass_post_features-plugin_selection_box"
    );
    if (
      mouseDiff > 6 &&
      data.classList.contains("mousedown") &&
      selectionBox === null
    ) {
      var pluginSelectionBox = document.createElement("div");
      pluginSelectionBox.id = "mass_post_features-" +
                              "plugin_selection_box";
      document.body.appendChild(pluginSelectionBox);
      selectionBox = document.getElementById(
        "mass_post_features-plugin_selection_box"
      );
      if (!data.classList.contains("shift_key")) {
        var hl = document.getElementsByClassName("highlighted");
        while (hl.length > 0) {
          highlightBrick(hl[0], 0);
        }
      }
    }
    if (
      mouseDiff > 6 &&
      data.classList.contains("mousedown") &&
      selectionBox !== null
    ) {
      var selLeft;
      var selTop;
      if (initialMouseX < newMouseX) {
        selectionBox.style.left = initialMouseX + "px";
        selLeft = initialMouseX;
      }
      if (initialMouseY < newMouseY) {
        selectionBox.style.top = initialMouseY + "px";
        selTop = initialMouseY;
      }
      if (initialMouseX > newMouseX) {
        selectionBox.style.left = (initialMouseX - mouseWidth) + "px";
        selLeft = initialMouseX - mouseWidth;
      }
      if (initialMouseY > newMouseY) {
        selectionBox.style.top = (initialMouseY - mouseHeight) + "px";
        selTop = initialMouseY - mouseHeight;
      }
      selectionBox.style.width = mouseWidth + "px";
      selectionBox.style.height = mouseHeight + "px";
      var brick = document.getElementsByClassName("brick");
      var rec;
      var sT = document.documentElement.scrollTop;
      var sL = document.documentElement.scrollLeft; // 0
      for (i = 0; i < brick.length; i++) {
        rec = brick[i].getBoundingClientRect();
         if (
           !brick[i].classList.contains("highlighted") &&
           !brick[i].classList.contains("temp-select") &&
           rec.right + sL > selLeft &&
           rec.left + sL < selLeft + mouseWidth &&
           rec.bottom + sT > selTop &&
           rec.top + sT < selTop + mouseHeight
         ) {
           brick[i].classList.add("temp-select");
           highlightBrick(brick[i], 1);
         } else if (
           brick[i].classList.contains("temp-select") &&
           brick[i].classList.contains("highlighted") &&
           (
             (
               rec.right + sL < selLeft ||
               rec.left + sL > selLeft + mouseWidth
             ) || (
               rec.bottom + sT < selTop ||
               rec.top + sT > selTop + mouseHeight
             )
           )
         ) {
           brick[i].classList.remove("temp-select");
           highlightBrick(brick[i], 0);
         }
      }
    }
  });
  // end of selection box feature

  // begin blogs menu / blog menu dropdown
  var loderGifSrc =
        'data:image/gif;base64,R0lGODlhIAAgAPUZAA' +
        'QEBDo6OhYWFg4ODi4uLoCAgAgICBgYGAICAmxsbH' +
        'h4eBwcHF5eXsDAwLS0tJKSkvLy8v///xISEhAQEE' +
        'ZGRqioqGRkZFBQUCIiIiYmJjY2Np6enk5OTuDg4D' +
        'AwMNLS0lZWVoKCgqCgoLKysgAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAA' +
        'Ah/hlPcHRpbWl6ZWQgdXNpbmcgZXpnaWYuY29tAC' +
        'H5BAUKABkALAAAAAAgACAAAAbkwIxwSCQOIJBFcc' +
        'k0GoiBSCRQBDSZl8YGKqUOB4fnFdpoUIbR6Tc8GB' +
        'crZXHamwEf3EVCOSGcCwFseEUhcRl+dWFuBARVZQ' +
        '+GXYiJTl8FlkpDDGUYAwEBdpN/EoF1FpYFDG2ljF' +
        'UTCKJsqmgKp5+CoKNMABSnIHi4bgMMBZhjCKS/gn' +
        'VNgLhgyojNzZ7U1ALK07EH1dV3t9rgztjS0szY0A' +
        'ahV82/o+rMsfDa7fNO8aJL7JLI+/bkx+rSBUznrx' +
        '+oVsEClZMEDZaYhQKtoAu1kOE4isgqJpxQcI3Ehh' +
        '4/glz37koQACH5BAkKABIALAAAAAAZABgAAAaVQI' +
        'lwSCQaHA5BcWkEEAmNBqEYYEo0BcszOh2KIg8moV' +
        'DoXrnDQARsTZCdZ+nwsx5YF2SKECqXMNYFVkIgb3' +
        'FTAxARHU1FA3mGEgVrVUIGAZd2aW+WBAYLaw1GHp' +
        'eYlSALS1CojaQBCwiCsQgYrbG2AASutrsGu00AwM' +
        'GwvpUHxsfGxMXIx8oSCMLCztPU1dbX2NfDgkEAIf' +
        'kECQoAFgAsAAAAAB8AGAAABr9Ai3BIJAIUikFxyR' +
        'waEMZCYVEkNJeHgCc6JSoaiatRK3BKqUJCAywmas' +
        'jp83CzNrSdcMtCbqGsGXducHtdBg5rYgAARQBaVo' +
        'RUDGtWXmEWCAeZi3gBTwufAmsPbh0REZQTmgNQlx' +
        'lKVRtleg2mEQ1GqnZ3AyK1HYBYqncjtV1NmJl3BB' +
        'EiaG2sykyYitSKgUKbuKqa19aM29yB3rjV1N3Zz9' +
        '3n6MfJiRLh7wdXyMLPq+32rcGs7Hju2HI9qXclCA' +
        'Ah+QQJCgAZACwAAAAAIAAYAAAGvcCMcEgkIgIBQH' +
        'HJNBYHyMGzyTQcJsYokVOgUJ9XpRCaHC4K3S/4YN' +
        'YKLWixehweuwnowHyNyJClAApoagBydFd+WgFxRR' +
        'cXQwhhhlaSA5FoDFsVDQ0YZpWQhmMWUn4PnA0PfI' +
        'hzBgqoFV5VknMhqAwGX5GsXxgNCgJ7fsKes4XHhc' +
        'RIy1FhzrxqARHT1NPPtHvS1dSRyMfKzG5LfXvk5d' +
        'BN34QSdevt45bYuvHvh+8Ton749tDy+pW7+rULAg' +
        'Ah+QQJCgAUACwAAAAAIAAZAAAGwECKcEgsHo7FpJ' +
        'KIMB4BxqXSgBwCnsRMACN1VinX72Cb6XqtWKGHbG' +
        'amw1Awu+1GwuVb89U7AGMXc0MaGmhpQlR2UACBFB' +
        'kJBQUChYYDcUwecQIMkAUMfF9di5wJBEuIoEsgnA' +
        'GWU5Wtpp19dE20ple4uHR4BL2+T8CoUgQNxcbFwc' +
        'C7xMfGCLm5y7+/psu7frBKARGRehKGUh8R456uwW' +
        '0LDeMRHwGflhPZuo0d6w91BvjPVM+gBRDjru0a0E' +
        'lIEAAh+QQJCgAWACwAAAAAIAAeAAAG2ECLcEgsHo' +
        '7FpJKIMB4BxqXSgBwCnsyq1IoVXrXfwdZ54IK1Y2' +
        '83rEanLQMsG+5OXsliNtV97rabdwh+cBoBAQZmfn' +
        'F2E02EhoZ4dVMZkBoCS3uTRpALjplxUGMGhqJpn6' +
        'OgV6t3b2ELsLFPs6ajBbe4t7O7b3C5uYKsq71xsr' +
        'GZxL10tUsEDQyIW69pGw3WFKqzpw/WDRsEkqaNSQ' +
        'EfC0LO3QlZaJrBghERIkQMDtZZqO/LUCLxAUwMLi' +
        'izAyHCh4FvCsRjgDBNh3hiGkoJsFDilgYROCgJAg' +
        'Ah+QQJCgAYACwAAAAAIAAgAAAF4CAmjmR5nGWqko' +
        'h5AuaqGugIvGwt27h467/BznXgAXVDXy+oRCYxAx' +
        'wT6kzdiEImzUkzSmBeKhUZbDV7YpcZEUWfq6u2Oz' +
        'efvQxDNhz7hPbNVjeCgn9ybUEvdXEBjI2MiZB/jo' +
        '56g1dPZYdxf31jSQsFAWAyiEkWBagEcYaApAyoBR' +
        'YLWF88KQQbAj4JsBR0eF6gBQsCDQ0KJAEKqDmtlR' +
        'gBEREBGArGqjaMeTjR01AODRudZyLd1BgM1+NfRe' +
        'XS5xgVxsCfaOYjBMYXhRPJ7yQPGsAb584bwR0DIE' +
        'CY9SQEACH5BAkKABQALAAAAAAgACAAAAXmICWOZH' +
        'mcZaqSiHkC5qoa6Ai8bC3buHjrv8HOdeABdUNfL6' +
        'hEJikDHBPqTN2IQibNSTNKYF4qFRlsNXtilxkRRZ' +
        '+rq7Y7N5+9DEM2HPuE9s1WN4KCfVSDZS91cYmMjX' +
        'uBjnqHgHmTVzN/hVtJAwELlHaKJgGkAouMnASkpV' +
        'hfPh8BVhZCUBqrGHR4Iw8REQQCDAwCAwUFHCQLqz' +
        'mUC70NFAQNDQQUHMULdEMNvdjR01AKxoUiAb0F5N' +
        'LU0NfjHdzo3yIJxWBJDL0MI97q6+JPHBE+IEtHgk' +
        'GBDONMEEy4w4ADB6aehAAAIfkECQoAFgAsAAAAAC' +
        'AAIAAABeCgJY5keZxlqpKIeQLmqhroCLxsLdu4eO' +
        'u/wc514AF1Q18vqEQmLQMcE+pM3YhCJs1JM0pgXi' +
        'oVGWw1e2KXGRFFn6urtjs3n70MQzYc+4T2zVY3go' +
        'J9VINlL3VxiYyNe4GOeoeAeZNXM39/BRABSYRDDB' +
        '0RER2eiSsEDaMRDQSmjCUPqx0cPhuuRG94I6sFQi' +
        'IJDa0DAQFtxXRFIwkPCyzCD1AFvlDFvzxDD8IC0t' +
        'QIxR6FIqkNDLbU1cbiFdvnzuPWfRTCFDbT7+nKSQ' +
        'ENGyQL9/6pE/cvIMEdABQouDYkBAAh+QQJCgAaAC' +
        'wAAAAAIAAgAAAF2aAmjmR5nGWqkoh5AuaqGugIvG' +
        'wt27h467/BznXgAXVDXy+oRCY1AxwT6kzdiEImzU' +
        'kzSmBeKhUZbDV7YpcZEUWfq6u2OzefvQxDNhz7hP' +
        'bNVgGCgwELfVQ3iRoQEY2OEQx/L5MHjI+NkU9BlA' +
        'uEg4aaiaKAMZp/DA4ESYpDFBUNsKuTcQ+wDQ8Ysp' +
        'QlCbYVAT4WoHRveCO2DMYaFAUFAmVuW0UjFwkCLM' +
        '2RA4JZc107DM1Z3E2HPs3AUORjYH0J4j7rY4cE6D' +
        'byU0kZBRYs8vPm/BUKmOffjhAAIfkECQoAFQAsAA' +
        'AAACAAIAAABujAinBILB6OxaSSiDAeAcal0oAcAp' +
        '7MqtSKFV6138HWeeCCtWNvN6xGpysDLBvuTjIYZD' +
        'Gb6qYOCRERHQFZSFd0aGFNcB+BESMLXEkIE4uUT2' +
        'JEDBCOBZljcZhTD44jaaF1Rg0RhKBdaQRvcEsCBL' +
        'a3trJ0V7wVDg3AwQ0UsmGYB7/CwMRvxse4uMW804' +
        'uTxcUBCpGuBrAJBeCnolMM4AUMAuLHRRTmCRltk5' +
        'VtrxXmAVBCGAH4l/6fiMr8oQAQAL9Ye+rRGRNtjs' +
        'JTB+lJ1KWBn6VXElLRijgxIDYPhfLF05WHZDONSY' +
        'IAACH5BAUKABYALAAAAAAgACAAAAbuQItwSCwejs' +
        'WkkkgYEAFHgHGpTEQ+z2jWQC0yIhHGEIoUkp1dYg' +
        'eMPo/L6WEA/DBrLe44scHG3+9UFBRGYA1+SAaAdn' +
        'INjQREBWCPUIdodn8bjQ0hAmYjAUkIEwiXihYUDp' +
        'oMXHEDURJSoQmaIa2vaQIPDY+4plQYenhLrgvFxp' +
        'a2UMoWCgXOzwW8ya9HzdDO0r3U28fIXaLK4cPBpH' +
        'qiAd5Ky7gaAe7TsaEE7u6s38SmGPQaE2+ho6XgnK' +
        'pXrhI4cAITJcQQr5JDfEbsDdOSx5c2VhUt/oKT51' +
        'Awh6XeCLzXT2RDYh//jUw5sWCaIAA7';
  var navArchive = document.getElementById("nav_archive");
  var blogMenu = document.createElement("div");
  blogMenu.id = "blog_menu";
  var blogMenuLink = navArchive.
    getElementsByClassName("title")[0].
    getElementsByTagName("a")[0];
  blogMenuLink.innerHTML = "Blogs";
  blogMenuLink.insertBefore(blogMenu, blogMenuLink.firstChild);
  var arrow = document.createElement("div");
  arrow.classList.add("arrow");
  blogMenuLink.removeAttribute("href");
  blogMenuLink.insertBefore(arrow, blogMenuLink.firstChild);
  // this makes a batch reblog button
  var reblogMenuButton = function (name) {
    var button = document.createElement("button");
    button.setAttribute(
	  "title", "Batch reblog selected posts to \"" + name + "\""
	);
    var svg = svgForType["reblog-self"].cloneNode(true);
    svg.setAttribute("width","11");
    svg.setAttribute("height","11");
    svg.setAttribute("fill","#fff");
    button.appendChild(svg);
    button.appendChild(
      document.createTextNode(
        " BATCH REBLOG SELECTED"
      )
    );
    button.setAttribute("data-edit_action", "reblog");
    button.setAttribute("data-name", name);
    button.addEventListener(
      "click",
      function() {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        data.setAttribute(
          "data-reblog-to-here", this.getAttribute("data-name")
        );
        var rb = document.getElementsByClassName("reblog-to-here");
        while (rb.length > 0) {
          rb[0].classList.remove("reblog-to-here");
        }
        document.getElementById(
          "reblog-to_" + this.getAttribute("data-name")
        ).classList.add("reblog-to-here");
        data.setAttribute(
          "data-reblog-to-here", this.getAttribute("data-name")
        );
        fetchEditSubmitMulti.apply(this, arguments);
      }
    );
    return button;
  }
  // this loads the secondaries for menu and data
  if (
    document.getElementById("bm_load_img") === null &&
    data.classList.contains("blog-menu-preload")
  ) {
    data.classList.remove("blog-menu-preload");
    // first time open, fetch the blogs, if any
    var xhttp = new XMLHttpRequest();
    var preLoad = new Image();
    preLoad.src = loderGifSrc;
    preLoad.style.width = "32px;"
    preLoad.style.height = "32px";
    preLoad.id = "bm_load_img";
    document.getElementById("blog_menu").appendChild(preLoad);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = document.getElementById(
          "mass_post_features-plugin_data"
        );
        var div = document.createElement("div");
        div.innerHTML = this.responseText. // parse the dom
        replace(/<(\/?)script[^>]*>/g, "<$1flurb>"). // no eval
        replace(/<img/g,"<space"); // do not onload img tags
        var apiKey = div.querySelectorAll(
          "meta[name=tumblr-form-key]"
        )[0].getAttribute("content");
        data.setAttribute("data-x-tumblr-form-key", apiKey);
        var l = div.getElementsByClassName("l-container")[0];
        var li = l.getElementsByClassName("is_tumblelog");
        var tumblelogs = [];
        var st;
        var a;
        var av;
        var ho;
        var tray;
        var subt;
        var name1;
        var link0;
        var link1;
        var link2;
        var link3;
        var link4;
        var edIcon;
        var visIcon;
        var reIcon;
        var primIcon;
        var frIcon;
        var phIcon;
        var href = document.location.href.split(/[\/\?&#=]+/g);
        var name = href[4];
        var reAsDraftContainer = document.createElement("div");
        reAsDraftContainer.classList.add("blog_menu_child");
        var reAsDraft = document.createElement("input");
        reAsDraft.type = "checkbox";
        reAsDraft.id = "re-as-draft";
        reAsDraft.checked = true;
        reAsDraftContainer.appendChild(reAsDraft);
        var reAsDraftLabel = document.createElement("label");
        reAsDraftLabel.setAttribute("for", "re-as-draft");
        reAsDraftLabel.appendChild(
          document.createTextNode("Reblog Posts as Draft")
        );
        var navFollows1;
        var robotWarning = document.createElement("div");
        var robotTitle = document.createElement("strong");
        robotTitle.appendChild(
          document.createTextNode(
            "Friendly Robot Warning"
          )
        );
        robotWarning.classList.add("robot-warning");
        robotWarning.appendChild(robotTitle);
        robotWarning.appendChild(
          document.createTextNode(
            "Dash flooding might make you lose followers!"
          )
        );
        reAsDraftContainer.appendChild(reAsDraftLabel);
        reAsDraftContainer.appendChild(robotWarning);
        document.getElementById("blog_menu").appendChild(reAsDraftContainer);
        for (var i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("a")[0];
          av = a.getElementsByClassName("avatar")[0];
          av.removeAttribute("style");
          av.innerHTML = av.innerHTML.replace(/<space/g,"<img");
          st = a.getElementsByClassName("small_text")[0];
          ho = a.getElementsByClassName("hide_overflow")[0];
          tray = document.createElement("div");
          tray.classList.add("blog_menu_child");
          name1 = ho.innerHTML.replace(/\s+/g, "");
          tray.setAttribute("data-name", name1);
          tumblelogs.push(name1);
          if (i === 0) { // assuming primary is first blog :)
            data.setAttribute("data-primary-blog", name1);
            navFollows1 = document.getElementById("nav-follows");
            navFollows1.setAttribute(
              "href", "/mega-editor/published/" + name1 + "?follows"
            );
            data.setAttribute("data-primary-known", "true");
            // this is the follows and followers
            if (
              href[3] === "published" &&
              (
                href[5] === "follows" ||
                href[5] === "followers"
              )
            ) {
              loadFollowers();
            }
            var navLikes = document.getElementById("nav-likes");
            navLikes.setAttribute(
              "data-default-input", getCookie("name1") !== "" ? getCookie("name1") : name1
            );
            primIcon = svgForType.original.cloneNode(true);
            primIcon.setAttribute("width", 20);
            primIcon.setAttribute("height", 20);
            primIcon.setAttribute("title", "Primary Blog");
            primIcon.setAttribute("fill", "rgba(0,65,100,1)");
            st.insertBefore(primIcon, st.firstChild);
          }
          reIcon = svgForType["reblog-self"].cloneNode(true);
          reIcon.setAttribute("width", "26");
          reIcon.setAttribute("height", "26");
          reIcon.setAttribute("fill", "#7D99FF");
          av.appendChild(reIcon);
          av.setAttribute("title", "Select Avatar for Quick-Reblogs");
          av.setAttribute("data-name", name1);
          av.id = "reblog-to_" + name1;
          av.addEventListener("click", function() {
            var data = document.getElementById(
              "mass_post_features-plugin_data"
            );
            var rb = document.getElementsByClassName("reblog-to-here");
            while (rb.length > 0) {
              rb[0].classList.remove("reblog-to-here");
            }
            this.classList.add("reblog-to-here");
            data.setAttribute(
              "data-reblog-to-here", this.getAttribute("data-name")
            );
          });
          if (name.toLowerCase() === name1.toLowerCase()) {
            av.classList.add("reblog-to-here");
            data.setAttribute("data-reblog-to-here", name);
          }
          tray.appendChild(av);
          tray.appendChild(st);
          link0 = document.createElement("a");
          link1 = document.createElement("a");
          link2 = document.createElement("a");
          link3 = document.createElement("a");
          link4 = document.createElement("a");
          subt = document.createElement("div");
          link0.setAttribute(
            "title", "edit \"" + name1 + "\" drafts"
          );
          link0.setAttribute(
            "href", "https://www.tumblr.com/mega-editor/draft/" + name1
          );
          link1.setAttribute(
            "title", "visit \"" + name1 + "\""
          );
          link1.setAttribute(
            "href", "https://www.tumblr.com/blog/" + name1
          );
          link1.setAttribute(
            "target", "_blank"
          );
          link3.setAttribute(
            "title", "batch photo upload to \"" + name1 + "\""
          );
          link4.setAttribute(
            "title", "\"" + name1 + "\" followers"
          );
          link2.setAttribute(
            "href",
            "https://www.tumblr.com/mega-editor/published/" + name1
          );
          link3.setAttribute(
            "href",
            "https://www.tumblr.com/mega-editor/publish/" + name1 + "?photos"
          );
          link4.setAttribute(
            "href",
            "https://www.tumblr.com/mega-editor/published/" + name1 + "?followers"
          );
          link0.appendChild(
            document.createTextNode(
              "Drafts"
            )
          );
          link1.appendChild(
            document.createTextNode(
              "Visit"
            )
          );
          link2.appendChild(
            document.createTextNode(
              "Editor"
            )
          );
          link3.appendChild(
            document.createTextNode(
              "Photos"
            )
          );
          link4.appendChild(
            document.createTextNode(
              "Followers"
            )
          );
          edIcon = svgForType.edit.cloneNode(true);
          edIcon.setAttribute("width", 12);
          edIcon.setAttribute("height", 12);
          edIcon.setAttribute("fill", "#7D99FF");
          frIcon = svgForType.mutual.cloneNode(true);
          frIcon.setAttribute("width", 12);
          frIcon.setAttribute("height", 12);
          frIcon.setAttribute("fill", "#7D99FF");
          phIcon = svgForType.image.cloneNode(true);
          phIcon.setAttribute("width", 12);
          phIcon.setAttribute("height", 12);
          phIcon.setAttribute("fill", "#7D99FF");
          visIcon = svgForType.home.cloneNode(true);
          visIcon.setAttribute("width", 12);
          visIcon.setAttribute("height", 12);
          visIcon.setAttribute("fill", "#7D99FF");
          link0.appendChild(edIcon.cloneNode(true));
          link1.appendChild(visIcon.cloneNode(true));
          link2.appendChild(edIcon.cloneNode(true));
          link3.appendChild(phIcon.cloneNode(true));
          link4.appendChild(frIcon.cloneNode(true));
          subt.appendChild(link2);
          subt.appendChild(link0);
          subt.appendChild(link3);
          subt.appendChild(link4);
          subt.appendChild(link1);
          if (
            !data.classList.contains("is-uploading-photos") &&
            href[5] !== "followers" && href[5] !== "follows"
          ) {
            subt.appendChild(reblogMenuButton(name1));
          } else {
            var blankSpace = document.createElement("div");
            blankSpace.classList.add("blank-space");
            subt.appendChild(blankSpace);
          }
          subt.classList.add("subt");
          tray.appendChild(subt);
          document.getElementById("blog_menu").appendChild(tray);
        }
        data.setAttribute(
          "data-tumblelogs", JSON.stringify(tumblelogs)
        );
        document.getElementById("blog_menu").removeChild(
          document.getElementById("bm_load_img")
        );
      }
    };
    xhttp.open("GET", "/settings", true);
    xhttp.send();
  } // this loads the blog menu

  // this opens the blog menu
  blogMenuLink.addEventListener("click", function (e) {
    var data = document.getElementById(
      "mass_post_features-plugin_data"
    );
    // any other time, just open menu
    if (
      !this.classList.contains("open") &&
      !data.classList.contains("open-blog_menu") &&
      !data.classList.contains("closing-blog_menu")
    ) {
      data.classList.add("open-blog_menu");
      this.classList.add("open");
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();
    }
    e.cancelBubble = true;
    e.stopPropagation();
  });
  // end of blogs menu blog dropdown...

  // tumblr now has its own default queue/drafts pages
  // so we'll fake a query with userscript booleans
  if(
    href[3] === "published" || href[3] === "draft" || href[3] === "queued"
  ) {
    getResponseText("/blog/" + name, function (re){
      var div = document.createElement("div");
      div.innerHTML = re. // parse the dom
      replace(/<(\/?)script[^>]*>/g, "<$1flurb>"). // no eval
      replace(/<img/g,"<space"); // do not onload img tags
      var flurb = div.getElementsByTagName("flurb");
      var keyReg = /"API_TOKEN"[^:]*:[^"]*"([^"]+)"/i;
      var csrfReg = /"CSRFTOKEN"[^:]*:[^"]*"([^"]+)"/i;
      // find the flurb :) not joking
      var apiToken = 0;
      var csrfToken = 0;
      var primary = name;
      for (var i = 0; i < flurb.length; i++) {
        if (flurb[i].innerText.match(keyReg) !== null) {
          apiToken = flurb[i].innerText.match(keyReg)[1];
          break;
        }
      }
      for (i = 0; i < flurb.length; i++) {
        if (flurb[i].innerText.match(csrfReg) !== null) {
          csrfToken = flurb[i].innerText.match(csrfReg)[1];
          break;
        }
      }
      if (apiToken !== 0) {
        // this is Tumblr's own API key! (0_0)
        data.setAttribute("data-api-token", apiToken);
        data.setAttribute("data-csrf-token", csrfToken);
        // please use this ^ responsibly! (O.O)
        if (
          href[3] === "published" &&
          href[5] === "fans"
        ) {
          var token = data.getAttribute("data-api-token");
        }
        if (
          href[3] === "published" &&
          (
            href[5] === "dashboard" ||
            href[5] === "archive" ||
            href[5] === "tagged" ||
            href[5] === "likes" ||
            href[5] === "search"
          )
        ) {
          // hide editor functions for archive view / reblog mode
          var ritpm = document.getElementsByClassName(
            "remove-in-third-party-mode"
          ); // edit buttons don't work in reblog mode... I tried :)
          while (ritpm.length > 0) {
            ritpm[0].parentNode.removeChild(ritpm[0]);
          }
          var notice = document.createElement("div");
          notice.classList.add("notice");
          notice.appendChild(
            document.createTextNode(
              "Page may be endless; Utilize pause button."
            )
          );
          document.getElementsByClassName(
            "editor_navigation"
          )[0].appendChild(notice);
          if (href[5] === "dashboard") {
            i = "dash";
          }
          if (href[5] === "archive") {
            i = "archive";
          }
          if (href[5] === "tagged") {
            i = "tagged";
          }
          if (href[5] === "likes") {
            i = "likes";
          }
          if (href[5] === "search") {
            i = "search";
          }
        } else {
          i = href[3];
          // this is the fans
          if (
            href[3] === "published" &&
            href[5] === "fans"
          ) {
           // loadFans(); // html api; too unstable
          }
        }
        if (
          href[3] === "published" && href[5] === "archive" ||
          href[3] === "published" && href[5] === "likes" ||
          href[3] === "published" && href[5] === "dashboard" ||
          href[3] === "published" && href[5] === "tagged" ||
          href[3] === "published" && href[5] === "search" ||
          (
            i === "published" && href[5] !== "photos" &&
            i === "published" && href[5] !== "follows" &&
            i === "published" && href[5] !== "followers" &&
            i === "published" && href[5] !== "fans"
          ) ||
          i === "queued" ||
          i === "draft"
        ) {
          var q = typeof href[6] !== "undefined" ? href[6] : "cats";
          var o = typeof href[7] !== "undefined" && !isNaN(href[7]) ?
              "&before=" + href[7] : "";
          if (q === name) {
            q = data.getAttribute("data-primary-blog");
            // all secondaries goto the blog that likes, for likes :)
          }
          var subpage = {
            "published" :
              "/v2/blog/" + name +
			  "/posts?limit=50&reblog_info=1&npf=1&page=1" + o,
            "likes":
              "/v2/blog/" + q +
			  "/likes?limit=50&reblog_info=1&npf=1&page=1" + o,
            "draft":
              "/v2/blog/" + name +
			  "/posts/draft?limit=50&reblog_info=1&npf=1&page=1" + o,
            "queued":
              "/v2/blog/" + name +
			  "/posts/queue?limit=50&reblog_info=1&npf=1&page=1" + o,
            "archive":
              "/v2/blog/" + q +
			  "/posts?limit=50&reblog_info=1&npf=1&page=1" + o,
            "dash" :
              "/v2/timeline/dashboard",
            "search" :
              "/v2/mobile/search/posts?blog_limit=0&post_limit=50&query=" + q +
              "&mode=top" + o,
            "tagged" : // why is these mobile? I'm not quite sure...
              "/v2/mobile/search/posts?blog_limit=0&post_limit=50m&query=" + q +
              "&mode=top&mode=recent" + o
          }[i];
          data.setAttribute("data-ajax-first-subpage", subpage);
          asyncRepeatApiRead({
            "response": { // we wil use all neue npf format, because
              "_links": { // some posts are neue npf, no matter what
                "next": { // (if you can't beat 'em, join 'em)
                  "href":  subpage
                }
              }
            }
          });// this thing paginates itself
        }
        // this is the follows and followers
        if (
          href[3] === "published" &&
          (
            href[5] === "follows" ||
            href[5] === "followers"
          )
        ) {
          loadFollowers();
        }
      }
    });
  };

  // the month widget must be modified to accomidate Archives
  var broMo = document.createElement("div");
  broMo.id = "browse_months";
  broMo.setAttribute("onclick", "just_clicked_browse_months = true;");
  var jum2mo = document.createElement("div");
  jum2mo.id = "jump_to_month";
  var aro2 = document.createElement("span");
  aro2.classList.add("arrow");
  jum2mo.appendChild(aro2);
  broMo.addEventListener("click", function () {
    var bmw = document.getElementById(
      "browse_months_widget"
    );
    if (
      window.getComputedStyle(bmw).
        getPropertyValue("display") === "none"
     ) {
      bmw.style.display = "block";
    } else {
      bmw.style.display = "none";
    }
  });
  var mo2;
  var jum = typeof href[5] !== "undefined" ? href[5] : "jump";
  var jumto = typeof href[6] !== "undefined" ? href[6] : name;
  var year = typeof href[7] !== "undefined" && !isNaN(href[7]) ?
        (new Date(parseInt(href[7]) * 1000)).getFullYear() :
        (new Date()).getFullYear();
  if (href[3] === "queued" || href[3] === "draft") {
    var ridqm = document.getElementsByClassName(
      "remove-in-drafts-queue-mode"
    );
    while (ridqm.length > 0) {
      ridqm[0].parentNode.removeChild(ridqm[0]);
    }
  }
  if (href[3] === "published" &&
      (
        typeof href[5] === "undefined" ||
        href[5] === "jump" ||
        href[5] === "archive"
      )
  ) {
    mo2 = document.createElement("span");
    mo2.classList.add("month");
    mo2.appendChild(document.createTextNode("Month"));
    jum2mo.appendChild(mo2);
    // this is a sneaky trick to get that elusive "firstPostTimeStamp"
    var monthIframe = document.createElement("iframe");
    monthIframe.style.display = "none";
    monthIframe.id = "browse_months_widget";
    monthIframe.setAttribute("scrolling", "no");
    monthIframe.setAttribute("frameborder", "0");
    monthIframe.setAttribute("title", "Post forms");
    monthIframe.src = "https://" + jumto + ".tumblr.com/" +
                      "archive?fetch=first_post_timestamp" +
                      "&jump=" + jum + "&name=" + name + "&to=" +
                      jumto + "&year=" + year;
    // these ^ url parameters need to be in alphabetical order
    jum2mo.appendChild(monthIframe);
    broMo.appendChild(jum2mo);
    document.getElementById(
      "browse_months"
    ).parentNode.replaceChild(
      broMo,
      document.getElementById(
        "browse_months"
      )
    );
  } else {
    mo2 = document.createElement("span");
    mo2.classList.add("month");
    mo2.appendChild(document.createTextNode("Month"));
    jum2mo.appendChild(mo2);
    // this is for getting before timestamps for other feeds
    jum = typeof href[5] !== "undefined" ? href[5] : "jump";
    jumto = typeof href[6] !== "undefined" ? href[6] : name;
    year = typeof href[7] !== "undefined" && !isNaN(href[7]) ?
        (new Date(parseInt(href[7]) * 1000)).getFullYear() :
        (new Date()).getFullYear();
    lTs = (new Date()).getTime();
    fTs = (new Date(1970, 0, 1)).getTime();
    var monthDiv = makeBrowseMonthsWidget(year, lTs, fTs, jum, jumto);
    monthDiv.style.display = "none";
    jum2mo.appendChild(monthDiv);
    broMo.appendChild(jum2mo);
    document.getElementById(
      "browse_months"
    ).parentNode.replaceChild(
      broMo,
      document.getElementById(
        "browse_months"
      )
    );
    doubleCheckDisabledMonths(year, lTs, fTs, jum, jumto);
  }

  // this is the new batch photos page! BATCH PHOTOS PAGE
  if (href[3] === "published" && href[5] === "photos") {
    navArchive = document.getElementById("nav_archive");
    navArchive.style.zIndex = "1000";
    var addTagsWidget = document.getElementById("add_tags_widget");
    navArchive.appendChild(addTagsWidget);
    var addTagButton = document.getElementById("add_tag_button");
    addTagButton.removeAttribute("onclick");
    var addTagButton2 = addTagButton.cloneNode(true);
    addTagButton.firstChild.innerHTML = "Add Tags (single)";
    addTagButton2.firstChild.innerHTML = "Add Tags to All";
    addTagButton2.id += "2";
    addTagButton2.style.position = "absolute";
    addTagButton2.style.bottom = "8px";
    addTagButton2.style.left = "161px";
    addTagButton2.addEventListener("click", function () {
      var token = document.getElementById("tokens").children;
      var pb = document.getElementsByClassName("photo-brick");
      var phTags;
      var aToken;
      var child;
      var a;
      var addToken = true;
      for (var j = 0; j < pb.length; j++) {//pb & j :)
        phTags = pb[j].getElementsByClassName("photo-tags")[0];
        aToken = phTags.children;
        for (var i = 0; i < token.length; i++) {
          addToken = true;
          for (var l = 0; l < aToken.length; l++) {
            if (token[i].innerHTML === aToken[l].innerHTML) {
              addToken = false;
              break;
            }
          }
          if (addToken) {
            child = token[i].cloneNode(true);
            a = child.getElementsByTagName("a");
            a[0].removeAttribute("onclick");
            phTags.appendChild(child);
          }
        }
      }
    });
    addTagButton.addEventListener("click", function () {
      var fr = document.getElementsByClassName("focused-rich");
      if (fr.length === 0) {
        return;
      }
      var token = document.getElementById("tokens").children;
      var phTags = fr[0].getElementsByClassName("photo-tags")[0];
      var aToken = phTags.children;
      var addToken = true;
      for (var i = 0; i < token.length; i++) {
        addToken = true;
        for (var l = 0; l < aToken.length; l++) {
          if (token[i].innerHTML === aToken[l].innerHTML) {
            addToken = false;
            break;
          }
        }
        if (addToken) {
          phTags.appendChild(token[i].cloneNode(true));
        }
      }
    });
    addTagButton.parentNode.parentNode.appendChild(addTagButton2);
    addTagsWidget.style.top = "83px";
    addTagsWidget.style.left = "15px";
    addTagsWidget.style.removeProperty("right");
    lcontent.classList.add("albino");
    lcontent.classList.add("hoverless");
    lcontent.classList.add("photo-page");
    data.classList.add("is-uploading-photos");
    var dragEnter = function(e){
      e.preventDefault();
      if (
        document.getElementsByClassName(
          "brick-dragging"
        ).length > 0
      ) {
        return;
      }
      var pdz = document.getElementById("photos-drop-zone");
      pdz.classList.add("full");
    };
    var dragLeave = function(e) {
      e.preventDefault();
      var pdz = document.getElementById("photos-drop-zone");
      pdz.classList.remove("full");
    };
    var drop = function(e) {
      e.preventDefault();
      var papb = document.getElementById("post_all_photos_button");
      if (papb.getAttribute("disabled") !== null) {
        papb.removeAttribute("disabled");
      }
      var pdz = document.getElementById("photos-drop-zone");
      pdz.classList.remove("full");
      var files;
      if (typeof e.dataTransfer !== "undefined") {
        files = e.dataTransfer.files;
      } else if (typeof this.files !== "undefined") {
        files = this.files;
      }
      var r;
      for (var i = 0; i < files.length; i++) {
        if(files[i].type.toString().split(/\//)[0] !== "image") {
          continue;
        }
        r = new FileReader();
        r.imgCode = "img"+shortCode(files[i].name);
        r.addEventListener("load", loadPhotoIntoDOM);
        reading.push(
          {
            read: function(){
              reading[reading.length - 1].reader.readAsDataURL(
                reading[reading.length - 1].file
              );
            },
            file: files[i],
            reader: r
          }
        );
        unreadFile["img"+shortCode(files[i].name)] = files[i];
      }
      reading[reading.length - 1].read();
    };
    en = document.getElementsByClassName("editor_navigation");
    // remove all navigation buttons, editor widgets, and start anew
    en[0].parentNode.removeChild(en[0]);
    var dropZone = document.createElement("div");
    dropZone.id = "photos-drop-zone";
    var dropTitle = document.createElement("h2");
    dropTitle.appendChild(
      document.createTextNode("Drop Photos Here")
    );
    dropTitle.id = "drop_images_here";
    var inputBackup = document.createElement("input");
    inputBackup.type = "file";
    inputBackup.accept = "image/x-png,image/gif,image/jpeg,image/png";
    inputBackup.multiple = true;
    inputBackup.addEventListener("change", drop);
    inputBackup.id = "photo_file_input";
    var postPhotos = butt("Post Photos");
    postPhotos.disabled = true;
    postPhotos.id = "post_all_photos_button";
    postPhotos.setAttribute("title", "Post All Photos");
    postPhotos.addEventListener("click", photoUploadAndSubmit);
    var photosAsDraft = document.createElement("input");
    photosAsDraft.id = "photos_as_draft";
    photosAsDraft.type = "checkbox";
    photosAsDraft.checked = true;
    var photosAsDraftLabel = document.createElement("label");
    photosAsDraftLabel.setAttribute("for", "photos_as_draft");
    photosAsDraftLabel.appendChild(
      document.createTextNode(
        "New Photo/Photoset Posts"
      )
    );
    var asB = document.createElement("strong");
    asB.appendChild(
      document.createTextNode(" as Draft")
    );
    photosAsDraftLabel.appendChild(asB);
    var photosAsDraftContainer = document.createElement("div");
    photosAsDraftContainer.id = "photos_as_draft_container";
    photosAsDraftContainer.appendChild(photosAsDraft);
    photosAsDraftContainer.appendChild(photosAsDraftLabel);
    var photosRobotWarning = document.createElement("div");
    photosRobotWarning.classList.add("robot-warning");
    var robotTitlePhotos = document.createElement("strong");
    robotTitlePhotos.appendChild(
      document.createTextNode(
        "Friendly Robot Warning"
      )
    );
    photosRobotWarning.appendChild(robotTitlePhotos);
    photosRobotWarning.appendChild(
      document.createTextNode(
        "Dash flooding might make you lose followers. " +
        "Perhaps \"check\" post \"as draft\" instead?"
      )
     );
    photosAsDraftContainer.appendChild(photosRobotWarning);
    document.body.appendChild(photosAsDraftContainer);
    document.body.appendChild(inputBackup);
    document.body.appendChild(postPhotos);
    document.body.appendChild(dropTitle);
    document.body.appendChild(dropZone);
    document.documentElement.addEventListener("dragenter", dragEnter, false);
    document.documentElement.addEventListener("dragover", dragEnter, false);
    document.documentElement.addEventListener("dragleave", dragLeave, false);
    document.documentElement.addEventListener("drop", drop, false);
  }
};
// May 2020, Mass Post Editor Features 4 (from scratch) by Jake Jilg (benign-mx)
document.onreadystatechange = function () {
  // Hello :)
  if (document.readyState === "interactive") {
    MassPostEditorFeatures4();
  }
}; // Hello world!