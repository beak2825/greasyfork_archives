// ==UserScript==
// @id             arch.413chan.net-580a3d1c-2425-453d-9c9f-1b9f1d6c0630@scriptish
// @name           4chan cap helper
// @version        4.03
var version = 4.03;
// anybody with half a brain will tell you that duplicated variables like this is bad. Tough shit.
// @namespace      
// @author         subby
// @description    hides posts that are not selected with the tickbox, for capping
// @include        *://boards.4chan.org/*/thread/*
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/1207/4chan%20cap%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/1207/4chan%20cap%20helper.meta.js
// ==/UserScript==
var despoilcount = 0;
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
function showPosts() {
    //unhide all posts
    var posts = [].slice.call(document.getElementsByClassName("replyContainer"));
    var op = [].slice.call(document.getElementsByClassName("opContainer"));
    for (var i = 0; i < posts.length; i++) {
       posts[i].hidden = false;
    }
    //we do both because one works in 4chanx and one works without.
    op[0].style.display = '';
    op[0].hidden = false;
    startbutton.setAttribute('value', 'Hide unchecked posts'); // What the enduser sees on button
    startbutton.onclick = function() {
        hidePosts();
        onClick();
    };
}
function hidePosts() {
    //get checkboxes
    //get the postcontainers
    //hide the post containers if their id isn't in a checked checkbox
    var postInfos = [].slice.call(document.getElementsByClassName("postInfo"));
    var savenums = ["pc1"];
    var posts = [].slice.call(document.getElementsByClassName("replyContainer"));
    var op = [].slice.call(document.getElementsByClassName("opContainer"));
    for (var i = 0; i < postInfos.length; i++) {
        if(postInfos[i].firstChild.checked) {
            //we do both because one works in 4chanx and one works without.
            postInfos[i].firstChild.checked = false;
            savenums.push("pc".concat(postInfos[i].firstChild.name));
        }
    }
    if(!contains(savenums,op[0].id)) {
       op[0].hidden = true;
       op[0].style.display = 'none';
    }
    for (var i = 0; i < posts.length; i++) {
        if(!contains(savenums,posts[i].id)) {
            posts[i].hidden = true;
        }
    }
    startbutton.setAttribute('value', 'Reveal hidden posts'); // What the enduser sees on button
    startbutton.onclick = function() {
        showPosts();
        onClick();
    };
}

function removeSpoilers() {
    var s = document.createElement("style");
    s.innerHTML = "s, s a:not(:hover) {background: none repeat scroll 0% 0% #000000 ! important;color: #ffffff ! important;text-decoration: none;} .spoiler {background: none repeat scroll 0% 0% #000000 ! important;color: #ffffff ! important;text-decoration: none;}";
    s.setAttribute("id", "despoilsheet" + despoilcount);
    document.getElementsByTagName("head")[0].appendChild(s);
    document.getElementById("styleSelector").setAttribute("onchange", "document.getElementById('despoilsheet" + despoilcount + "').disabled = true; setActiveStyleSheet(this.value);document.getElementById('despoilbutton').click(); return false;");
    despoilcount++;
    despoil.setAttribute('value', 'Hide spoilers'); // What the enduser sees on button
    despoil.onclick = function() {
        returnSpoilers();
        onClick();
    };
}

function returnSpoilers() {
    var s = document.createElement("style");
    s.innerHTML = "s, s a:not(:hover) {background: none repeat scroll 0% 0% #000000 ! important;color: #000000 ! important;text-decoration: none;} .spoiler {background: none repeat scroll 0% 0% #000000 ! important;color: #000000 ! important;text-decoration: none;}";
    s.setAttribute("id", "despoilsheet" + despoilcount);
    document.getElementsByTagName("head")[0].appendChild(s);
    document.getElementById("styleSelector").setAttribute("onchange", "document.getElementById('despoilsheet" + despoilcount + "').disabled = true; setActiveStyleSheet(this.value); return false;");
    despoilcount++;
    despoil.setAttribute('value', 'Show spoilers'); // What the enduser sees on button
    despoil.onclick = function() {
        removeSpoilers();
        onClick();
    };
}

function removeBacklinks() {
        var nodelist = document.getElementsByClassName("backlink-container");
        var backlinks = [];
        for (var i = 0; i < nodelist.length; ++i) {
            backlinks[i] = nodelist[i];
        }
        for (var i = 0; i < backlinks.length; ++i) {
            backlinks[i].hidden = true;
        }
    }
// find the bottom
var bottom = document.getElementsByClassName("absBotText").item(0);
bottom.innerHTML = bottom.innerHTML + '<br>4chan Cap Helper is running, Version: ' + version + ' You can always find the latest version of 4chan Cap helper at <a rel="nofollow" target="_top" href="https://sleazyfork.org/en/scripts/1207-4chan-cap-helper">sleazyfork.org</a><br>';
// init hideposts button
var startbutton = document.createElement('input');
startbutton.setAttribute('type', 'button');
startbutton.setAttribute('value', 'Hide unchecked posts'); // What the enduser sees on button
startbutton.setAttribute('name', 'gottagofast');
startbutton.onclick = function() {
    hidePosts();
    onClick();
};
bottom.appendChild(startbutton);
// init despoil button
var despoil = document.createElement('input');
despoil.setAttribute('id', 'despoilbutton');
despoil.setAttribute('type', 'button');
despoil.setAttribute('value', 'Show spoilers'); // What the enduser sees on button
despoil.setAttribute('name', 'despoiler');
despoil.onclick = function() {
    removeSpoilers();
    onClick();
};
bottom.appendChild(despoil);
// init remove backlinks button
var remBack = document.createElement('input');
remBack.setAttribute('type', 'button');
remBack.setAttribute('value', 'Remove Backlinks'); // What the enduser sees on button
remBack.setAttribute('name', 'rembacklinks');
remBack.onclick = function() {
    removeBacklinks();
    onClick();
};
bottom.appendChild(remBack);