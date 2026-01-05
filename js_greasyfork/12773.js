// ==UserScript==
// @name Soundcloud:Sort comments by timestamp
// @description Sort comments by timestamp on Soundcloud
// @include *soundcloud.com/*
// @grant none
// @namespace https://greasyfork.org/users/4252
// @version 0.0.1.20180417234419
// @downloadURL https://update.greasyfork.org/scripts/12773/Soundcloud%3ASort%20comments%20by%20timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/12773/Soundcloud%3ASort%20comments%20by%20timestamp.meta.js
// ==/UserScript==
//Note: Only been tested in firefox
var SortButton = document.createElement("button");
SortButton.type = "button";
SortButton.className = "sc-button sc-button-medium sc-button-responsive";
SortButton.innerHTML = "Sort by timestamp";
SortButton.onclick = sortComments;

var CancelScrollButton = document.createElement("button");
CancelScrollButton.type = "button";
CancelScrollButton.className = "sc-button sc-button-medium sc-button-responsive";
CancelScrollButton.innerHTML = "Cancel scrolling";
CancelScrollButton.onclick = cancelLoadingComments;

var CancelScrollDiv = document.createElement("div");
CancelScrollDiv.style = "display:none; position: fixed; bottom: 0; left: 0; right: 0; height: 80px; text-align:center;";
CancelScrollDiv.appendChild(CancelScrollButton);


(function() {//when page loads, add the buttons
  XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      if(this.readyState !== 4) return;
      if(this.status !== 200) return;
      if(/\/(tracks)/.test(this.responseURL)) {
        appendButtons();
      }
    });
    XMLHttpRequest.prototype.__open.apply(this, arguments);
  };
})();

function appendButtons() {
    if (document.getElementsByClassName("commentsList__title").length && !document.getElementsByClassName("sort-button")[0]) {//if comment header exists and sort button hasn't already been added
        document.getElementsByClassName("commentsList__title")[0].appendChild(SortButton);
    }
    if (!document.body.contains(CancelScrollDiv)) {//if cancel scroll button hasn't already been added
        document.body.appendChild(CancelScrollDiv);
    }
}

function loadComments(){
    CancelScrollDiv.style.display = "block";
    window.myInterval = setInterval(function(){
        window.scrollTo(0,document.body.scrollHeight);
        if(document.getElementsByClassName("paging-eof").length){
            cancelLoadingComments();
            sortComments();
            window.scrollTo(0,0);
        }
    }, 500);
}

function cancelLoadingComments(){
    clearInterval(myInterval);
    CancelScrollDiv.style.display = "none";
}

function sortComments() {
    if (document.getElementsByClassName("paging-eof").length === 0) {
        if (window.confirm("All comments must be loaded before sorting. Auto scroll to load?")) {
            loadComments();
        }
        return;
    }

    var commentContainer = document.getElementsByClassName("lazyLoadingList__list")[0];
    var allcomments = [].slice.call(commentContainer.children);
    var k = 0.001; //decimal to stick at end of timestamp so that threads (replies) stay together 
    for (i = 0; i < allcomments.length; i++) {
        if (allcomments[i].firstChild.classList.contains("isReply")) {
            allcomments[i].setAttribute("data-timestamp4sort", getTimestampInSeconds(allcomments[i]) + k);
            k = k + 0.001; //theoretically correctly sort 1000 consecutive replies
        } else {
            allcomments[i].setAttribute("data-timestamp4sort", getTimestampInSeconds(allcomments[i]));
            k = 0.001; //reset
        }
    }

    allcomments.sort(compare);

    while (commentContainer.lastChild) {
        commentContainer.removeChild(commentContainer.lastChild);
    }

    var docFrag = document.createDocumentFragment();
    for (i = 0; i < allcomments.length; i++) {
        docFrag.appendChild(allcomments[i]);
    }
    commentContainer.appendChild(docFrag);

    alert("Comments sorted successfully");
}


function compare(a, b) {
    var avalue = parseFloat(a.getAttribute("data-timestamp4sort"));
    var bvalue = parseFloat(b.getAttribute("data-timestamp4sort"));
    if (avalue < bvalue)
        return -1;
    if (avalue > bvalue)
        return 1;
    return 0;
}

function hmsToSecondsOnly(str) { //This function handles "HH:MM:SS" as well as "MM:SS" or "SS".
    var p = str.split(':'),
        s = 0,
        m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function getTimestampInSeconds(licomment) { //takes  the <li> element of a comment. returns an integer
    if (licomment.getElementsByClassName("commentItem__timestampLink").length !== 0) {
        return hmsToSecondsOnly(licomment.getElementsByClassName("commentItem__timestampLink")[0].innerHTML);
    } else {
        return 0;
    }
}