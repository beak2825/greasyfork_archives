// ==UserScript==
// @name           Quick-load Dreamwidth comment pages
// @namespace       rallamajoop@gmail.com
// @description     Loads top comments from all pages and threads in any Dreamwidth post into a single page
// @include         https://*.dreamwidth.org/*.html*view=top-only*
// @include         https://*.dreamwidth.org/*.html*view=top-only&page=1*
// @exclude         /^.*page=(1\d+|[2-9]\d*).*/
// @version         1.11
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/452046/Quick-load%20Dreamwidth%20comment%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/452046/Quick-load%20Dreamwidth%20comment%20pages.meta.js
// ==/UserScript==

//Loads top comments of every thread in any Dreamwidth post in one place by appending contents of pages 2-n to bottom of page 1 under ?view=top-only
//'Threaded' links redirected to threaded comments for that page, rather than threaded comments page 1.
//NOTE: Breaks "Show [x] comments" links on every page after page 1. I have tried to find a workaround to fix this and given up.
//NOTE: Does not change behaviour on top-level pages from 2-max
// V1.1: Minor update to fix TamperMonkey bug


//Retrieve page as javascript object
function getSourceAsDOM(url)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    var parser=new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");     
}

//Remove all children of className (used for stripping redundant/broken material out of later pages)
function removeAll(doc, className, keepCommentText=false) {
    var children = doc.getElementsByClassName(className);
    var leng = children.length;
    if (leng<1) {
        return;
    }
    for (var j=0; j<leng; j++) {
        var par = children[0].parentNode;
        if (keepCommentText) {
          var span=document.createElement('span');
          span.innerHTML = children[0].innerText.replace("Show ", "");
          par.insertBefore(span, children[0].nextSibling);
        }
        par.removeChild(children[0]);
        
    }
}

var topLinks = document.getElementsByClassName("comment-pages toppages");
var pages = topLinks[0].getElementsByTagName("a");
var comments = document.getElementById("comments");
removeAll(comments, "bottomcomment");

var loc = location.href;
var parts = loc.split(".html");
loc=parts[0] + ".html";
var head = document.getElementsByTagName('head')[0];

for (var i=1; i<pages.length; i++) {
 
      //Print notification that next page is loading
    var loading=document.createElement('div');
      loading.innerHTML="<p><h3>(Loading page " + (i+1) + ")<br><marquee style='width:50px' direction='right'>...</marquee></b></h3><br></p>";
    comments.appendChild(loading);

      //Load next page
      var pagehref=loc + "?view=top-only&page=" + (i+1) + "#comments";
    var pg = getSourceAsDOM(pagehref);

    //Trim out redundant links
    var comm = pg.getElementById("comments");
    //removeAll(comm, "comment-pages toppages");   //strip out surplus page links
    if (i<pages.length-1) {
    removeAll(comm, "bottomcomment");   //strip out surplus page links
    }
    //strip out 'Show comments' links, as these will be broken on pages>1
    removeAll(comm, "link cmt_unhide", true);   
    removeAll(comm, "link expand");


    //Modify 'Threaded' links in header/footer of each page to point threaded page corresponding to this page number
    var num=i+1;
    var threaded=comm.getElementsByClassName("view-threaded");
    for (var j=0; j<threaded.length; j++) {
      var lnks=threaded[j].getElementsByTagName("a");
      for (var k=0; k<lnks.length; k++) {
        lnks[k].href=loc+"?page=" + num + "#comments";
        lnks[k].text+=" (Page "+num+")";
        var newlink=document.createElement('span');
        newlink.innerHTML=" | <a href=\""+pagehref+"\">Top-Level (Page "+num+")</a>";
        lnks[k].parentNode.parentNode.appendChild(newlink);
      }
    }

 
    //Print summary on last page
    if (i==pages.length-1) {
          var pgs=pages.length;
        num=comm.getElementsByClassName("comment-thread comment-depth-odd comment-depth-1").length;
        var div = document.createElement('div');
        div.innerHTML="<p><b>Threads on last page: "+num+"/25<br>Threads total: "+(num+(pgs-1)*25)+"</b></p>";
        comm.appendChild(div);
        //alert(num);
    }
 
    //Add new page to end of current
    comments.appendChild(comm);
   
	  //Remove notification that next page is loading and replace with generic title
  	loading.innerHTML="<p><a href=\""+pagehref+"\"><h1>Page " + (i+1) + "</h1></a></p>";
 
}



