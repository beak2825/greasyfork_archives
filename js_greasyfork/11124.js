// ==UserScript==
// @name        xREL Release Filter
// @namespace   tag:https://github.com/0657code/greasemonkey-xrel-filter,2015-07-16
// @description Release filter for xREL. Also hides the "new comments" box upon clicking on its title. Special thanks to GarionCZ for his SteamGifts filter script.
// @author      0657_Code
// @include     http://www.xrel.to/movie/*/releases.html*
// @include     http://www.xrel.to/tv/*/releases.html*
// @version     1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/11124/xREL%20Release%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/11124/xREL%20Release%20Filter.meta.js
// ==/UserScript==

// Constants
{
  var ID_DIV_HEADER = "idDivHeader";
  var ID_DIV_CONTENT = "idDivContent";

  var KEY_FILTER_MASTERSWITCH = "filterMasterSwitch";
  var KEY_FILTER_HIDE = "hideFilter";
  var KEY_HIDE_NEW_COMMENTS = "hideNewComments";
  
  var DEFAULT_FILTER_STATUS = false;
}

// Variables, settings
{
  var HIDE_FILTER_DEFAULT = true;
  var HIDE_NEW_COMMENTS_DEFAULT = true;
  var HIDE_BOTTOM_CLEARFIX = true; // autimatically deactivated if there more than one page
  var HIDE_BOTTOM_BANNER = false;
  
  var FILTER_US_RELEASE = false;
  var FILTER_SEASON_WHITELIST = [
  ]
  var FILTER_GROUP_WHITELIST = [
  ]

  var filter_MasterSwitch = GM_getValue(KEY_FILTER_MASTERSWITCH, DEFAULT_FILTER_STATUS);

  var contentDivStyleDisplay;
  var commentDivStyleDisplay;

  var FILTERS = {
    CATEGORIES : {
      name : "Category",
      VALUE : {
        XVID : {name: 'XviD', key: "filterCatXvid", func: function(){onCheckboxClick(FILTERS.CATEGORIES.VALUE.XVID);}},
        X264 : {name: 'x264', key: "filterCatX264", func: function(){onCheckboxClick(FILTERS.CATEGORIES.VALUE.X264);}},
        DVD : {name: 'DVD-R', key: "filterCatDvd", func: function(){onCheckboxClick(FILTERS.CATEGORIES.VALUE.DVD);}},
        HDTV : {name: 'HDTV', key: "filterCatHdtv", func: function(){onCheckboxClick(FILTERS.CATEGORIES.VALUE.HDTV);}},
        COMPLETEHD : {name: 'Compl. HD', key: "filterCatCompleteHd", func: function(){onCheckboxClick(FILTERS.CATEGORIES.VALUE.COMPLETEHD);}}
      }
    },
    TYPES : {
      name : "Type",
      VALUE : {
        TELESYNC : {name: ' TeleSync', key: "filterTypeTeleSync", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.TELESYNC);}},
        WEBRIP : {name: ' Web-Rip', key: "filterTypeWebRip", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.WEBRIP);}},
        DVDRIP : {name: ' DVD-Rip', key: "filterTypeDvdRip", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.DVDRIP);}},
        DVDSCR : {name: ' DVD-Scr.', key: "filterTypeDvdScr", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.DVDSCR);}},
        DVD : {name: ' DVD-R', key: "filterTypeDvd", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.DVD);}},
        HDTV : {name: ' HDTV', key: "filterTypeHdtv", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.HDTV);}},
        BLURAY : {name: ' Blu-ray', key: "filterTypeBluray", func: function(){onCheckboxClick(FILTERS.TYPES.VALUE.BLURAY);}}
      }
    },
    RLSNAME : {
      name : "Rls.-Name",
      VALUE : {
        BDRIP : {name: ' BD-Rip', searchtext: /BDRip/i, key: "filterRlsnameBdRip", func: function(){onCheckboxClick(FILTERS.RLSNAME.VALUE.BDRIP);}},
        P720 : {name: ' 720p', searchtext: /720p/i, key: "filterRlsname720p", func: function(){onCheckboxClick(FILTERS.RLSNAME.VALUE.P720);}},
        P1080 : {name: ' 1080p', searchtext: /1080p/i, key: "filterRlsname1080p", func: function(){onCheckboxClick(FILTERS.RLSNAME.VALUE.P1080);}},
        COMPLETEBLURAY : {name: ' Compl. Blu-Ray', searchtext: /Complete.Bluray/i, key: "filterRlsnameCompleteBluRay", func: function(){onCheckboxClick(FILTERS.RLSNAME.VALUE.COMPLETEBLURAY);}}
      }
    }
  };
}

drawUi();
filterReleases();
clickableNewComments();

// Filter function
function filterReleases() {
  var releases = getReleases();

  // Remove the filtering
  for (i = 0; i < releases.length; i++)
    removeFiltering(releases[i]);
  
  // Filter
  if(filter_MasterSwitch)
  {
    var releasesToRemove = [];

    // Outside filter loop (releases)
    for (i = 0; i < releases.length; i++) {
      // Remove the filtering
      removeFiltering(releases[i]);
      
      // Inside filter loop (filtertypes, filters)
      for (var t in FILTERS){
        var filtertype = FILTERS[t];
        for (var f in filtertype.VALUE){
          var filter = filtertype.VALUE[f];
          if(filter.bool){
            if(isRelease(releases[i], filtertype.name, filter)){
              releasesToRemove.push(releases[i]);
              break;
            }
          }
        }
        // Break the (filtertypes) loop if the releases is already marked to remove
        var releasesToRemoveLength = releasesToRemove.length;
        if (releasesToRemoveLength > 0 && releasesToRemove[releasesToRemoveLength-1] == releases[i])
          break;
      }

      // US-Release filter
      if (typeof FILTER_US_RELEASE !== 'undefined' && FILTER_US_RELEASE) {
        if (releases[i].className == "release_item release_us") {
          releasesToRemove.push(releases[i]);
          continue;
        }
      }

      // Season filter
      if (typeof FILTER_SEASON_WHITELIST !== 'undefined' && FILTER_SEASON_WHITELIST.length > 0 && window.location.pathname.search(/\/tv\//i) != -1) {
        if (!isReleaseSeason(releases[i], FILTER_SEASON_WHITELIST)) {
          releasesToRemove.push(releases[i]);
          continue;
        }
      }

      // Group filter
      if (typeof FILTER_GROUP_WHITELIST !== 'undefined' && FILTER_GROUP_WHITELIST.length > 0) {
        if (!isReleaseByGroup(releases[i], FILTER_GROUP_WHITELIST)) {
          releasesToRemove.push(releases[i]);
          continue;
        }
      }
    }

    // Remove the releases in releasesToRemove[]
    for (i = 0; i < releasesToRemove.length; i++) {
      releasesToRemove[i].style.display = 'none';
      releasesToRemove[i].nextElementSibling.style.display = 'none';
    }
  }
}

// Parses the release elements from the whole page
function getReleases() {
  var releasesOdd = document.getElementsByClassName('release_item release_odd');
  var releasesEven = document.getElementsByClassName('release_item release_even');
  var releasesUS = document.getElementsByClassName('release_item release_us');
  var releasesHighlight = document.getElementsByClassName('release_item release_highlight');
  var allReleases = [];
  allReleases.push.apply(allReleases, releasesOdd);
  allReleases.push.apply(allReleases, releasesEven);
  allReleases.push.apply(allReleases, releasesUS);
  allReleases.push.apply(allReleases, releasesHighlight);
  return allReleases;
}

function isRelease(release, filtertypename, filter){
  switch (filtertypename){
    case FILTERS.TYPES.name: {return isReleaseType(release, filter.name)};
    case FILTERS.CATEGORIES.name: {return isReleaseCat(release, filter.name)};
    case FILTERS.RLSNAME.name: {return isReleaseName(release, filter.searchtext)};
  }
}

function isReleaseType(release, type) {
  var release_type = release.getElementsByClassName('release_type') [0];
  return release_type.firstChild.textContent == type;
}

function isReleaseCat(release, cat) {
  var release_cat = release.getElementsByClassName('release_cat') [0];
  var sub_link = release_cat.getElementsByClassName('sub_link') [0];
  var span = sub_link.getElementsByTagName('span') [0];
  return span.textContent == cat;
}

function isReleaseName(release, filter) {
  var release_title = release.getElementsByClassName('release_title') [0];
  var sub_link = release_title.getElementsByClassName('sub_link') [0];
  var span = sub_link.getElementsByTagName('span') [0];
  return span.textContent.search(filter) != -1;
}

function isReleaseSeason(release, seasonArray) {
  var release_title = release.getElementsByClassName('release_title')[0];
  var sub = release_title.getElementsByClassName('sub') [0];
  for (j = 0; j < seasonArray.length; j++)
    if (sub.textContent.indexOf(seasonArray[j]) != - 1)
      return true;
  return false;
}

function isReleaseByGroup(release, groupArray) {
  var release_grp = release.getElementsByClassName('release_grp')[0];
  for (j = 0; j < groupArray.length; j++)
    if (release_grp.textContent.indexOf(groupArray[j]) != - 1)
      return true;
  return false;
}

// Removes filtering from a given release
function removeFiltering(release) {
  release.style.display = '';
}

// Draws the UI
function drawUi() {
  // HeaderDiv
  {
    // HeaderTextSpan
    {
      var headerTextSpan = document.createElement("span");
      headerTextSpan.appendChild(document.createTextNode(" Filter "/*getFilterCaption()*/));
      headerTextSpan.onclick = function() {
        // Clicking on the header opens/closes the filter details UI
        var contentDiv = document.getElementById(ID_DIV_CONTENT);
        if (contentDiv.style.display !== "none"){
          GM_setValue(KEY_FILTER_HIDE, true);
          contentDivStyleDisplay = contentDiv.style.display;
          contentDiv.style.display = "none";
        }
        else{
          GM_setValue(KEY_FILTER_HIDE, false);
          contentDiv.style.display = contentDivStyleDisplay;
        }
      };
      unselectable(headerTextSpan);
    }
    
    // HeaderCheckbox
    {
      var headerCheckbox = document.createElement("input");
      headerCheckbox.setAttribute("type", "checkbox");
      //filter_MasterSwitch = GM_getValue(KEY_FILTER_MASTERSWITCH, DEFAULT_FILTER_STATUS);
      headerCheckbox.checked = filter_MasterSwitch;
      headerCheckbox.onclick = function() {
        GM_setValue(KEY_FILTER_MASTERSWITCH, headerCheckbox.checked);
        filter_MasterSwitch = headerCheckbox.checked;
        filterReleases();
      };
    }
    
    var headerDiv = document.createElement("div");
    headerDiv.id = ID_DIV_HEADER;
    headerDiv.style.fontWeight = "700";
    headerDiv.style.paddingTop = "5px";
    headerDiv.style.paddingBottom = "5px";
    headerDiv.style.paddingLeft = "10px";
    headerDiv.style.paddingRight = "10px";
    headerDiv.style.cursor = "pointer";
    headerDiv.style.font = '700 14px/22px "Open Sans",sans-serif';
    headerDiv.appendChild(headerTextSpan);
    headerDiv.appendChild(headerCheckbox);
  }

  // ContentDiv
  {
    var contentDiv = document.createElement("div");
    contentDiv.id = ID_DIV_CONTENT;
    contentDiv.style.display = "flex";
    contentDiv.style.paddingTop = "5px";
    contentDiv.style.paddingBottom = "5px";
    
    for (var t in FILTERS){
      var filtertype = FILTERS[t];
      var typeDiv = document.createElement("div");
      typeDiv.style.paddingLeft = "15px";
      
      var typeSpan = document.createElement("span");
      typeSpan.appendChild(document.createTextNode(filtertype.name));
      unselectable(typeSpan);
      typeDiv.appendChild(typeSpan);
      
      for (var f in filtertype.VALUE){
        var filter = filtertype.VALUE[f];
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(filter.name));
        unselectable(span);
        
        filter.checkbox = document.createElement("input");
        filter.checkbox.setAttribute("type", "checkbox");
        filter.bool = GM_getValue(filter.key, DEFAULT_FILTER_STATUS);
        filter.checkbox.checked = !filter.bool;
        filter.checkbox.onclick = filter.func;
        
        var div = document.createElement("div");
        div.appendChild(span);
        div.appendChild(filter.checkbox);
        typeDiv.appendChild(div);
      }
      contentDiv.appendChild(typeDiv);
    }
  }
  
  // Hide the filter
  if ( GM_getValue(KEY_FILTER_HIDE, (typeof HIDE_FILTER_DEFAULT !== 'undefined') ? HIDE_FILTER_DEFAULT : false) ){
    contentDivStyleDisplay = contentDiv.style.display;
    contentDiv.style.display = "none";
  }

  // Add the filter UI to the correct place on the current page
  insertFilterUi(headerDiv);
  insertFilterUi(contentDiv);
  
  // Remove bottom banner
  if (typeof HIDE_BOTTOM_BANNER !== 'undefined' && HIDE_BOTTOM_BANNER)
  {
    document.getElementById('bottom').style.display = 'none';
  }

  // Remove bottom clearfix (if only one page exists)
  if (typeof HIDE_BOTTOM_CLEARFIX !== 'undefined' && HIDE_BOTTOM_CLEARFIX)
  {
    var clearfix = document.getElementsByClassName('releases_bottom clearfix')[0];
    if(clearfix.childElementCount == 0)
      clearfix.style.display = 'none';
  }

}

function onCheckboxClick(filter){
  GM_setValue(filter.key, !filter.checkbox.checked);
  filter.bool = !filter.checkbox.checked;
  filterReleases();
}

// Inserts a node into the rls_filter_selection div
function insertFilterUi(filterUi) {
  var element = document.getElementById("rls_filter_selection");
  if (element !== 'undefined') {
    if(element.firstElementChild.className == "sub")
      element.replaceChild(filterUi, element.firstElementChild);
    else
      element.appendChild(filterUi);
  }
}

// Makes the "new comments" header clickable (hide/unhide)
function clickableNewComments(){
  var divs_titles = document.getElementsByClassName('box_title1');
  if (divs_titles.length > 1){
    commentTitleDiv = divs_titles[1];
    commentTitleDiv.style.cursor = "pointer";
    commentTitleDiv.onclick = function() {
      var commentDiv = commentTitleDiv.nextElementSibling;
      GM_setValue(KEY_HIDE_NEW_COMMENTS, commentDiv.style.display !== "none");
      if (commentDiv.style.display !== "none"){
        commentDivStyleDisplay = commentDiv.style.display;
        commentDiv.style.display = "none";
      }
      else
        commentDiv.style.display = commentDivStyleDisplay;
    };
  }
  if (GM_getValue(KEY_HIDE_NEW_COMMENTS, HIDE_NEW_COMMENTS_DEFAULT)){
    var commentDiv = commentTitleDiv.nextElementSibling;
    commentDivStyleDisplay = commentDiv.style.display;
    commentDiv.style.display = "none";
  }
}

// Make span text unselectable
function unselectable(span){
  if ('unselectable' in span)       // Internet Explorer, Opera
    span.unselectable = !span.unselectable;
  else {
    if (window.getComputedStyle) {
      var style = window.getComputedStyle (span, null);
      if ('MozUserSelect' in style) { // Firefox
        span.style.MozUserSelect = (style.MozUserSelect == "none") ? "text" : "none";
      }
      else
        if ('webkitUserSelect' in style)      // Google Chrome and Safari
          span.style.webkitUserSelect = (style.webkitUserSelect == "none") ? "text" : "none";
    }
  }
}
