// ==UserScript==
// @name         4Chan WinRAR Finder
// @version      1.0
// @description  Creates a list of all GET's in current thread
// @author        VVind0wM4ker
// @namespace    firewaterairanddirt
// @license	     http://creativecommons.org/licenses/by-nc/4.0/
// @grant        none
// @include      http*://boards.4chan.org/*/thread/*
// @downloadURL https://update.greasyfork.org/scripts/13053/4Chan%20WinRAR%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/13053/4Chan%20WinRAR%20Finder.meta.js
// ==/UserScript==

function setup () {
	
    if(detect404() == "0") {
        //changeThreadTitle();    //Just for test purposes
        createBox();	
		collectGets();
    }
    else {console.log("...Script not loaded ^");}
}

function detect404 () {

    var get404 = document.querySelectorAll("h2");

    if (get404.length > 0) {

        for (var i = 0; i < get404.length; i++) {

            if (get404[i].innerHTML == "404 Not Found") {

                console.log("########################################");
                console.log("GetScript not loaded cause thread is 404");
                console.log("########################################");

                return 1;
            }
        }

        console.log("#################################");
        console.log("h2 existing, but thread isn't 404");
        console.log("#################################");
		
		return 0;		
    }
    else {return 0;}
}

function changeThreadTitle() {

    var threadTitle = document.getElementsByClassName("boardTitle");
	
    for (i = 0; i < threadTitle.length; i++) {
        threadTitle[i].innerHTML = "Modified";
    }
}

function createBox() {

    var thread = document.getElementsByClassName("thread")[0];
	
    thread.innerHTML +=
        '<div id="getsBox" class="reply" style="height: auto; width: 222px; padding: 5px 5px 10px; float: right;">' +
            '<div id="getsHeader" style="height: auto; width: 100%; padding: 0px 0px 10px; font-weight: bold; color: black; text-align: center;">' +
                'GET\'s in this Thread' +
            '</div>' +
            '<div id="getsContainer" style="width: 100%; text-align: center;">' +
                '<div id="Dubs" class="get">' +
                    'Dubs<br>' +
                '</div>' +
                '<div id="Trips" class="get">' +
                    '<br>Trips<br>' +
                '</div>' +
                '<div id="Quads" class="get">' +
                    '<br>Quads<br>' +
                '</div>' +
                '<div id="Quints" class="get">' +
                    '<br>Quints<br>' +
                '</div>' +
                '<div id="WinRAR" class="get">' +
                    '<br>WinRAR<br>' +
                '</div>' +
            '</div>' +
        '</div>';

	//hide all categories
    var categories = document.getElementsByClassName("get");
    for (var i = 0; i < categories.length; i++) {
        categories[i].style.display = "none";
        categories[i].style.margin = "5px 0px";
    }

    var getsBox = document.getElementById("getsBox");
    thread.insertBefore(getsBox, thread.childNodes[0]);
}

function collectGets () {
	
    var getscontainer = document.getElementById("getsContainer");
    var posts = document.querySelectorAll("a[title='Reply to this post']");
    var post = document.getElementByClassName;
    var prevnum = null;

    for (var i = 0; i < posts.length; i++) {

        var postnum = posts[i].innerHTML;

        if (postnum != prevnum) {

            var postnum_c = postnum;
            var gettype = 1;

            //ANALYSE
            while (1) {

                var postnum_digit1 = postnum_c.substr(postnum_c.length - 2, 1);
                var postnum_digit2 = postnum_c.substr(postnum_c.length - 1, 1);

                if (postnum_digit1 == postnum_digit2) {gettype++;}
                else {break;}
                
				if (postnum_c.length <= 2) {break;}
                postnum_c = postnum_c.substr(0, postnum_c.length - 1);
            }

			if (gettype >= 2) {				//gettype >= 2 adds all dubs or higher - change to filter
				
				addGets(gettype, postnum); 
                //highlightGet (gettype, postnum, posts[i]);     //Highlighting currently disabled, because I'm not satisfied with it
                //highlightGet (gettype, postnum, posts[i+1]);   //yes my english is kill
			}
			
            prevnum = postnum;
        }
    }
}

function addGets (gettype, postnum) {
	
	if (gettype <= 1) {return;}
	if (gettype == 2) {gettype = "Dubs"}
    if (gettype == 3) {gettype = "Trips"}
    if (gettype == 4) {gettype = "Quads"}
    if (gettype == 5) {gettype = "Quints"}
    if (gettype >= 5) {gettype = "WinRAR"}

    document.getElementById(gettype).style.display = "inline";
    document.getElementById(gettype).innerHTML += '<a class="quotelink" href="#p' + postnum + '">' + postnum + '</a><br>';
}

function highlightGet (gettype, postnum, getHandle) {  //currently disabled (->129)
	
	var postnum_pre = postnum.substr(0, postnum.length - gettype);
    var postnum_post = postnum.substr(postnum.length - gettype);
	getHandle.innerHTML = "<a>" + postnum_pre + "<a style='background-color: rgb(255,153,153);'>" + postnum_post + "</a></a>";		
}

window.onload = function () {setup();};