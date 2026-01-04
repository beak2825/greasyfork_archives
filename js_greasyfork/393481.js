// ==UserScript==
// @name			  AO3 author+tags quick-search
// @version		  1.2
// @include		  https://archiveofourown.org/works*
// @include		  https://archiveofourown.org/chapters*
// @description Generates quick links from AO3 fics to more by the same author in the same fandom (or character/pairing/any other tag). 
// @namespace   rallamajoop
// @downloadURL https://update.greasyfork.org/scripts/393481/AO3%20author%2Btags%20quick-search.user.js
// @updateURL https://update.greasyfork.org/scripts/393481/AO3%20author%2Btags%20quick-search.meta.js
// ==/UserScript==

/* Adds extra links to the tags section at the top of an AO3 work page, redirecting user to any use of same tags by the same author.
* ie. a quick way to find out if the writer of the great fic you just read has written anything else for the same fandom/pairing/trope/etc.

* If printCounts is set to 'true', code will also calculate and display the number of uses of each tag in the fandom/relationship/character sections.
* This will also make the links take longer to load, as code must pre-load each link individually. To limit load, I have not implemented this for freeform 
* or other tags.

* Author-based search links are a bit of a hack, but most cases should now select correctly in the tags menu on the right. I've added a subheading identifing the tag to cover all bases.
*/

//Setting variables! Change these if you like
var printCounts = true; 		// setting this to false will prevent script for printing tag counts, which may decrease loading times and server load
var quickSearchText = "*"; 	// text for new links - change this if you want something other than an *. You can put <sup>TEXT</sup> to make it superscript
var autoSortResultsBy = ""; // valid options are "Kudos", "Word Count", "Date" or "" (none, usually defaults to date)
var importantTags = ["fandom","relationship","character"]; // these are the tags which the script prints counts for

//Proper code starts here
var loc = location.href;
var href="https://archiveofourown.org/works?utf8=%E2%9C%93&commit=Sort+and+Filter&work_search"; //[relationship_names]=";
var workPage=["https://archiveofourown.org/works/", "https://archiveofourown.org/chapters/"];
var scriptTag = "&greasemonkey"; //tag to flag that we've clicked an author quicktag link

var sortOpts = {"Kudos": "&work_search[sort_column]=kudos_count", "Word Count": "&work_search[sort_column]=word_count", "Date" : "&work_search[sort_column]=revised_at" };

if (isWorkPage(loc)) {
  // Story page, add extra links user-based search to each tag

  var h3=document.body.getElementsByClassName("byline heading");
  var authors=h3.item(0).getElementsByTagName('a');
  authors=parseAuthors(authors);

  var allTags=document.body.getElementsByClassName("work meta group").item(0);
  var dds = allTags.getElementsByTagName('dd');

  var links = dds.item(1).getElementsByTagName('a');

  for (var j=0; j<dds.length; j++) {
    var tags = dds.item(j);
    var tagType = getTagType(tags);
    if (!tagType) break;

    links = tags.getElementsByTagName('a');
    for (var i=links.length-1; i>=0; i--) {

      for (var a=0; a<authors.length; a++) {

        var author=authors[a];
        var tag = getTag(links.item(i).href);
        var newHref = buildSearch(tag, author, tagType);
        
        var isCreatedLink = tag.includes(links.item(i).href);
        var existing = document.querySelectorAll('[href="' + newHref + '"]');
        if (!isCreatedLink && existing.length==0) { //check that we aren't creating a duplicate link - can happen when page partially loads from cache 

          var text = quickSearchText;
          var newlink=document.createElement('span');
          
          if (printCounts && printCountFor(tags) && !ignoreAuthor(author)) {
            //If this is an important tag, count search results
            var count = getNumFics(newHref);
            if (count>1) {
              text = "<b><sup>(" + count.toString() + ")<sup></b>";
            }
            else {
              text = "<sup>(1)<sup></b>";
            }
          }

          var toolTip = "'" + unformatTag(tag) + "' fic by " + author;
          newlink.innerHTML = " <a href=\"" + newHref + "\" title=\"" + toolTip + "\">" + text + "</a>";

          links.item(i).parentNode.appendChild(newlink);
        }
      }
    }
  }
}


else if (loc.includes(scriptTag)) {
  // Quicktags search results page, add title to show which tag is in use

  //var sTag = getBetween("work_search[relationship_names]=", loc, "&user_id=");
  let sTag, tagType;
  [tagType, sTag] = parseLoc(loc);
  var main = document.getElementById("main");
  var heading = main.getElementsByClassName("heading").item(0);

  sTag = unformatTag(sTag);
  
  var subTitle = "<br> Author QuickSearch: " + sTag;
  var span=document.createElement('h3');
  span.innerHTML = subTitle;
  
//  const sortBys = sortLinks(loc);
//  heading.parentNode.insertBefore(sortBys, heading.nextSibling); //not really necessary as of v1.2
  heading.parentNode.insertBefore(span, heading.nextSibling);

  checkTagBox(tagType, sTag);
}

//don't bother counting fics by orphan_account - these won't all be by same author anyway
function ignoreAuthor(author) {
  if (author == "orphan_account") return true;
  return false;
}

function getTagType(element) {
  var name = element.className;
  if (!name.includes(" tags")) return false;
  name = name.replace(" tags", "");
  return name;
}

//True if work or chapter
function isWorkPage(href) {
  for (var i=0; i<workPage.length; i++) {
    if (href.includes(workPage[i])) return true;
  }
  return false;
}

//Make sure tag is selected on the right menu
function checkTagBox(tagType, tag) {
  if (tagType == "warning") tagType = "archive_warning";
  debugger
/*  let btn = document.getElementById("toggle_include_" + tagType + "_tags");
  btn = btn.getElementsByTagName("button");
  btn = btn[0];
  if (btn.getAttribute("aria-expanded") == "false") {
    btn.click();
  }*/
  const par = document.getElementById("include_" + tagType + "_tags");
  const entries = par.getElementsByTagName("label");
  for (let i=0; i<entries.length; i++) {
    let entry = entries[i];
    if (entry.textContent.includes(tag)) {
      entry.getElementsByTagName("input")[0].checked=true;
      return;
    }
  }
}


//Generate links to sort by kudos etc
function sortLinks(urlStr) {
  var sortBys=document.createElement('div');
  
  let baseUrl = urlStr.replace(scriptTag, "");
  let keys = Object.keys(sortOpts);
  let inc = [true, true, true];
  for (var i =0; i<keys.length; i++) {
    let opt = sortOpts[keys[i]];
    if (baseUrl.includes(opt)) {
      baseUrl = baseUrl.replace(opt, "");
      inc[i] = false;
    }
  }

  for (var i =0; i < keys.length; i++) {
    if(inc[i]) {
      let link=document.createElement('a');
      let key=keys[i];
      link.href=baseUrl + sortOpts[key] + scriptTag;
      link.innerHTML = "Sort by " + key;
      sortBys.append("\u2003");
      sortBys.appendChild(link);
    }
  }
  
  return sortBys;
}

//Author+tag search address
function buildSearch(tag, author, tagType="relationship"){
	var href="https://archiveofourown.org/works?utf8=%E2%9C%93&commit=Sort+and+Filter&work_search[" + tagType + "_names]="
  href+=tag + "&user_id=" + author;
  
  const sortBy = sortOpts[autoSortResultsBy];
  if (sortBy != undefined) href+= sortBy;

  href+=scriptTag;
  return href;
}

//Limit tag counts to fandom, relationship and character tags
function printCountFor(element) {
  var name = getTagType(element);
  for (var i=0; i<importantTags.length; i++) {
    if (importantTags[i] == name) return true;
  }
  return false;

}

//Retrieve page as javascript object
function getSourceAsDOM(url)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    var parser=new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");
}

//Counts results of author+tag search
function getNumFics(url) {
  var results = getSourceAsDOM(url);
  var works = results.getElementsByClassName("work index group")[0];

  if (works.children.length < 20) {
	  return works.children.length;
  }

  var h=results.getElementsByTagName("h2");
  if (h.length>0) {
    h=h[0];
	  var text = h.textContent;
    if (text.includes(" of ")) {
      text = getBetween(" of ", text, " Works");
      return text; //could convert this into an integer, but not much point
    }
  }
	return 20;
}

//May be multiple authors, may have pseudonyms. Returns as array
function parseAuthors(links) {
  var authors = [""];
  for (var i=0; i<links.length; i++) {
    var text = links.item(i).toString();
		authors[i] = getBetween("/users/", text, "/pseuds");
  }
  return authors;
}

//Retrieve tag and tag type from search string
function parseLoc(href) {
  const re=/.+&work_search\[(.+)_names\]=(.+)&user_id=.+/;
  const res = re.exec(href);
  if (res.length == 3) {
    return res.slice(1);
  }
  return ["",""];
}

//Format tag to pass to search
function getTag(href){
  var tag = getBetween("/tags/", href, "/works");
  tag = replaceAll(tag, "*s*","%2F");
  tag = replaceAll(tag, "*d*",".");
  tag = replaceAll(tag, "%20","+");
  return tag;
}

//Format tag from href for display in title
function unformatTag(tag) {
  tag = decodeURIComponent(tag);
  tag = replaceAll(tag, "*s*","/");
  tag = replaceAll(tag, "*a*","&");
  tag = replaceAll(tag, "*d*",".");
  tag = replaceAll(tag, "+", " ");
  return tag;
}


function getBetween(tag1, str, tag2) {
	var ret = str.split(tag1);
  if (ret.length<2) return "";
  ret=ret[1];
	ret = ret.split(tag2);
  if (ret.length<1) return "";
  ret = ret[0];
  return ret;
}

function replaceAll(str, search, replacement) {
	return str.split(search).join(replacement);
}



