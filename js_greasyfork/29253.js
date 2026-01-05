// ==UserScript==
// @name         Github PR Incremental Diffs
// @version      1.2
// @namespace    https://tampermonkey.net/
// @homepage     https://github.com/sociomantic-tsunami/kelpie
// @supportURL   https://github.com/sociomantic-tsunami/kelpie/issues
// @description  Provides you incremental diffs with the help of an extra server
// @author       Mathias L. Baumann
// @copyright    Copyright (c) 2017-2018 dunnhumby Germany GmbH. All rights reserved.
// @license      Boost Software License 1.0 (https://www.boost.org/LICENSE_1_0.txt)
// @match        *://github.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @require     https://cdn.rawgit.com/cemerick/jsdifflib/da7da27640a30537cea9069622dc71600c5a1d61/difflib.js
// @require     https://cdn.rawgit.com/cemerick/jsdifflib/da7da27640a30537cea9069622dc71600c5a1d61/diffview.js
// @resource    CSSDIFF https://cdn.rawgit.com/cemerick/jsdifflib/da7da27640a30537cea9069622dc71600c5a1d61/diffview.css
// @downloadURL https://update.greasyfork.org/scripts/29253/Github%20PR%20Incremental%20Diffs.user.js
// @updateURL https://update.greasyfork.org/scripts/29253/Github%20PR%20Incremental%20Diffs.meta.js
// ==/UserScript==

class FileTree
{
    /* Params:
          sha = sha of the file tree
          url = api url of the file tree
    */
    constructor ( sha, url, root_path )
    {
        this.root_path = root_path;
        this.sha = sha;
        this.url = url;
        this.list = [];
    }

    // Fetches the tree from using the API and calls callback with the result
    fetch ( cbthis, callback )
    {
        if (this.list && this.list.length > 0)
        {
            callback(this);
            return;
        }

        var request = new XMLHttpRequest();

        var receiveTree = function ( )
        {
            var response = JSON.parse(this.responseText);

            for (var i=0; i < response.tree.length; i++)
            {
                var obj = { "path" : this.outside.root_path + response.tree[i].path,
                            "sha"  : response.tree[i].sha,
                            "url"  : response.tree[i].url,
                            "type" : response.tree[i].type };

                // Don't get the blob for tree's, get it as another tree
                if (response.tree[i].type == "tree")
                    obj.url = obj.url.replace(/blobs/, "trees");

                this.outside.list.push(obj);
                //console.log("entry info " + obj.path + ", " + obj.sha);
            }

            this.userCb.call(this.cbthis, this.outside);
        };

        request.outside = this;
        request.onload = receiveTree;
        request.userCb = callback;
        request.cbthis = cbthis;

        // Initialize a request
        request.open('get', this.url);

        var usertoken = GM_getValue("username") + ":" + GM_getValue("token");
        request.setRequestHeader("Authorization", "Basic " + btoa(usertoken));
        // Send it
        request.send();
    }
}

class FileDiffer
{
    constructor ( base, head, original )
    {
        // List of files that have changed
        this.changed = [];

        this.base = base;
        this.head = head;
        this.original = original;
    }

    fetch ( cbthis, callback )
    {
        this.cbthis = cbthis;
        this.callback = callback;

        if (this.base === null)
            this.base = { "list" : [] };
        else
        {
            var tmp_base = this.base;
            this.base = null;
            tmp_base.fetch(this, this.assignBase);
        }

        if (this.head === null)
            this.head = { "list" : [] };
        else
        {
            var tmp_head = this.head;
            this.head = null;
            tmp_head.fetch(this, this.assignHead);
        }

        if (this.original === null)
            this.original = { "list" : [] };
        else
        {
            var tmp_orig = this.original;
            this.original = null;
            tmp_orig.fetch(this, this.assignOriginal);
        }
    }

    assignBase ( base ) { this.base = base; this.checkComplete(); }
    assignHead ( head ) { this.head = head; this.checkComplete(); }
    assignOriginal ( original ) { this.original = original; this.checkComplete(); }

    checkComplete ( )
    {
        if (!this.base || !this.head || !this.original)
            return;

        console.log("Received all trees, extracting required files");

        var diff = null;
        var i = 0;
        var head_el = null;

        var matchPath = function (el) { return el.path==head_el.path; };

        // Find all paths differing from base
        for (i=0; i < this.head.list.length; i++)
        {
            head_el = this.head.list[i];

            var orig_path = this.original.list.find(matchPath);

            // If this path exists in original with the same sha, it was added through a rebase
            if (orig_path !== undefined && orig_path.sha == head_el.sha)
                continue; // so ignore it

            var base_path = this.base.list.find(matchPath);

            if (orig_path === undefined)
                orig_path = null;

            // base doesn't have that file?
            if (base_path === undefined)
            {   // completely new file
                diff = { "base" : null, "head" : head_el,
                         "orig" : null };
                console.log("File differs (no base): " + head_el.path);
                this.changed.push(diff);
                continue;
            }

            // file exists in base and differs
            if (base_path.sha != head_el.sha)
            {   // changes have been made
                diff = { "base" : base_path, "head" : head_el,
                         "orig" : orig_path };

                console.log("File differs: " + head_el.path);
                this.changed.push(diff);
                continue;
            }
        }

        // Find any files not existing in head, but existing in base
        for (i=0; i < this.base.list.length; i++)
        {
            var base_el = this.base.list[i];

            head_el = this.head.list.find(matchPath);

            if (head_el !== undefined)
                continue;

            diff = { "base" : base_el, "head" : null, "orig" : null };
            console.log("File differs (no head): " + base_el.path);
            this.changed.push(diff);
        }

        this.recurseTree();
    }

    // recurses into tree objects in our "changed" paths list and looks for diffs
    recurseTree ( )
    {
        var i = 0;
        var el = {};
        var base_tree = {};
        var head_tree = {};
        var orig_tree = {};
        var did_recurse = false;
        var path = "";

        console.log("Recursing...");

        // Prepare to recurse
        for (i=0; i < this.changed.length; i++)
        {
            el = this.changed[i];

            // No need to recurse if one is null
            if (el.head === null || el.base === null)
                continue;

            // we can only recurse into trees
            if (el.head.type != "tree" && el.base.type != "tree")
                continue;

            if (el.base.type == "tree")
                base_tree = new FileTree(el.base.sha, el.base.url, el.base.path + "/");
            else
                base_tree = null;

            if (el.head.type == "tree")
                head_tree = new FileTree(el.head.sha, el.head.url, el.head.path + "/");
            else
                head_tree = null;

            if (el.orig !== null && el.orig.type == "tree")
                orig_tree = new FileTree(el.orig.sha, el.orig.url, el.orig.path + "/");
            else
                orig_tree = null;

            console.log("Recurse task " + el.head.path);

            el.pending = new FileDiffer(base_tree, head_tree, orig_tree);
        }

        // Actually do the recursion
        for (i=0; i < this.changed.length; i++)
        {
            el = this.changed[i];

            if ("pending" in el)
            {
                console.log("Starting task.. " + el.base.path);
                el.pending.fetch(this, this.recurseCallback);
                did_recurse = true;
            }
        }

        if (did_recurse === false)
            this.fetchAllFiles();
    }

    // called once for every recursion
    // * merges the recursed tree with ours
    // * if no more callbacks pending, calls user cb
    recurseCallback ( file_differ )
    {
        var still_waiting = false;

        for (var i=0; i < this.changed.length; i++)
        {
            var el = this.changed[i];

            if ("pending" in el && el.pending == file_differ)
            {
                console.log("recurseCb for " + el.base.path + " updated");
                this.changed = this.changed.concat(file_differ.changed);
                el.pending = null;
                continue;
            }

            if ("pending" in el && el.pending !== null)
            {
                console.log("Still waiting for " + el.base.path);
                still_waiting = true;
            }
        }

        if (still_waiting)
        {
            return;
        }

        this.fetchAllFiles();
    }

    fetchAllFiles ( )
    {
        console.log("Fetching files...");
        for (var i=0; i < this.changed.length; i++)
        {
            var el = this.changed[i];

            if (el.base && el.base.url && !("content" in el.base))
                this.fetchFile(el.base.url);

            if (el.head && el.head.url && !("content" in el.head))
                this.fetchFile(el.head.url);
        }

        if (this.changed.length === 0)
            this.checkReceivedFiles();
    }

    fetchFile ( url )
    {
        console.log("Fetching " + url);
        var request = new XMLHttpRequest();

        var receiveBlob = function ( )
        {
            var response = JSON.parse(this.responseText);

            function findMatch (elem)
            {
                if (elem.base && elem.base.sha == response.sha)
                    return true;
                else if (elem.head && elem.head.sha == response.sha)
                    return true;

                return false;
            }

            var el = this.outside.changed.find(findMatch);

            if (el === undefined)
            {
                console.log("received unexpected sha " + response.sha);
                return;
            }

            console.log("Received content for " + el.head.path);

            var content = "content" in response && response.content.length > 0 ? atob(response.content) : "";

            if (el.base !== null && el.base.sha == response.sha)
                el.base.content = content;
            else if (el.head !== null && el.head.sha == response.sha)
                el.head.content = content;
            else
                console.log("Unmatched sha?!");

            this.outside.checkReceivedFiles();
        };

        request.outside = this;
        request.onload = receiveBlob;

        // Initialize a request
        request.open('get', url);

        var usertoken = GM_getValue("username") + ":" + GM_getValue("token");
        request.setRequestHeader("Authorization", "Basic " + btoa(usertoken));
        // Send it
        request.send();
    }

    checkReceivedFiles ( )
    {
        var all_content_received = true;

        for (var i=0; i < this.changed.length; i++)
        {
            var el = this.changed[i];

            if (el.base && !("content" in el.base) ||
                el.head && !("content" in el.head))
            {
                all_content_received = false;
                break;
            }
        }

        if (all_content_received)
        {
            console.log("Received all content, calling cb");
            this.callback.call(this.cbthis, this);
        }
    }
}


class Fetcher
{
    constructor ( )
    {
        this.files = [];
    }

    start ( owner, repo, pr, commit1, commit2, element )
    {
        this.sha_base = commit1;
        this.sha_head = commit2;
        this.owner = owner;
        this.repo = repo;
        this.element = element;
        this.base_tree = null;
        this.head_tree = null;
        this.orig_tree = null;

        this.usertoken = GM_getValue("username") + ":" + GM_getValue("token");

        //this.fetchCommit(this.sha_update, "update");
        this.fetchPrBase(pr);
    }

    // Fetches the base branch for the PR and extracts the latest commits sha
    fetchPrBase ( pr )
    {
        console.log("Fetching PR base");
        var receivePr = function ( )
        {
            var response = JSON.parse(this.responseText);

            this.outside.fetchTreeShas(this.outside.sha_base, this.outside.sha_head, response.base.sha);
        };

        var request = new XMLHttpRequest();

        request.outside = this;
        request.onload = receivePr;
        // Initialize a request
        request.open('get', "https://api.github.com/repos/"+this.owner+"/"+this.repo+"/pulls/" + pr);

        request.setRequestHeader("Authorization", "Basic " + btoa(this.usertoken));
        // Send it
        request.send();
    }

    // Extracts the tree shas from base/head/orig commit
    fetchTreeShas ( base, head, orig )
    {
        console.log("Fetching trees");
        this.fetchTreeFromCommit(base, "base_tree", this.checkTreesDone);
        this.fetchTreeFromCommit(head, "head_tree", this.checkTreesDone);
        this.fetchTreeFromCommit(orig, "orig_tree", this.checkTreesDone);
    }

    checkTreesDone ( )
    {
        console.log("checkTreesDone()");

        if (!this.base_tree || !this.head_tree || !this.orig_tree)
        {
            console.log("Not all done: " + this.base_tree + " " + this.head_tree + " " + this.orig_tree);
            return;
        }

        console.log("Received all trees-shas, fetching content..");
        var differ = new FileDiffer(this.base_tree, this.head_tree, this.orig_tree);

        differ.fetch(this, this.render);
    }

    printMe ( )
    {
        for (var key in this)
            console.log("key: " + key);
    }

    fetchTreeFromCommit ( commit, name, usercb )
    {
        console.log("Fetching " + name + " " + commit);
        var receiveCommit = function ( )
        {
            var response = JSON.parse(this.responseText);

            console.log("Received " + this.commit_name);
            this.outside[this.commit_name] = new FileTree(response.tree.sha, response.tree.url, "");

            this.usercb.call(this.outside);
        };

        var request = new XMLHttpRequest();

        request.outside = this;
        request.onload = receiveCommit;
        request.commit_name = name;
        request.usercb = usercb;

        // Initialize a request
        request.open('get', "https://api.github.com/repos/"+this.owner+"/"+this.repo+"/git/commits/" + commit);

        request.setRequestHeader("Authorization", "Basic " + btoa(this.usertoken));
        // Send it
        request.send();
    }

    // Generate the diff, append the elements to this.element
    render ( differ )
    {
        "use strict";

        var contents = this.element.getElementsByClassName("file");
        var content = contents[0];
        content.innerHTML = "";
        content.style.backgroundColor = "white";
        content.style.textAlign = "center";

        for (var i = 0; i < differ.changed.length; i++)
        {
            var el = differ.changed[i];

            if ((el.head === null || el.head.type != "blob") &&
                (el.base === null || el.base.type != "blob"))
                continue;

            var base_content = el.base ? el.base.content : "";
            var head_content = el.head ? el.head.content : "";

            var fname = el.head ? el.head.path : el.base.path;

            var base = difflib.stringAsLines(base_content),
                newtxt = difflib.stringAsLines(head_content),
                sm = new difflib.SequenceMatcher(base, newtxt),
                opcodes = sm.get_opcodes(),
                contextSize = 5; //byId("contextSize").value;

            var filename = document.createElement("DIV");
            filename.className = "file-header";
            filename.innerText = fname;

            content.appendChild(filename);
            contextSize = contextSize || null;

            var diff = diffview.buildView({
                baseTextLines: base,
                newTextLines: newtxt,
                opcodes: opcodes,
                baseTextName: "Old",
                newTextName: "New",
                contextSize: contextSize,
                viewType: 0 // 0 for side-by-side
            });

            diff.className = diff.className + " blob-wrapper";
            diff.style.margin = "auto";
            diff.style.textAlign = "left";
            content.appendChild(diff);
        }

        var pos = content.getBoundingClientRect();

        content.style.left = "" + (-pos.left + 15) + "px";
        content.style.width = "" + (document.documentElement.clientWidth - 30) + "px";

        var close_link = document.createElement("A");
        close_link.href = "#" + this.element.id;
        close_link.onclick = function () { this.parentElement.parentElement.getElementsByClassName("btn")[0].onclick(); };
        close_link.innerText = "Close";
        content.appendChild(close_link);
    }
}

var fetcher = new Fetcher();

var DefaultURLHelper = "Optional default hash data URL";


function deleteYourself ( ) { this.outerHTML = ""; }

// Renders a box with user/token fields and button to ask for credentials
function askCredentials ( )
{
    if(document.getElementById("github-credentials-box"))
        return;

    console.log("Asking credentials");

    var box = document.createElement("DIV");
    box.style.backgroundColor = "white";
    box.style.position = "fixed";
    box.style.border = "solid black 2px";
    box.style.zIndex = 999999;
    box.style.left = "40%";
    box.style.top = "40%";
    box.style.padding = "20px";
    box.id = "github-credentials-box";

    var textfield_user = document.createElement("INPUT");
    var textfield_token = document.createElement("INPUT");
    var textfield_hash_data_url = document.createElement("INPUT");

    textfield_user.type = "text";

    var user = GM_getValue("username");
    if (!user)
        user = "Username";

    textfield_user.value = user;
    textfield_user.id = "github-user";

    var token = GM_getValue("token");
    if (!token)
        token = "Github Token";

    textfield_token.type = "text";
    textfield_token.value = token;
    textfield_token.id = "github-token";

    var url = GM_getValue("hash_data_url");
    if (!url)
        url = DefaultURLHelper;

    textfield_hash_data_url.type = "text";
    textfield_hash_data_url.value = url;
    textfield_hash_data_url.id = "hash-data-url";

    var note = document.createElement("P");
    note.href = "https://github.com/settings/tokens";
    note.innerHTML = "The token required here can be created at <a href=\"https://github.com/settings/tokens\">your settings page</a>.<br>Required scope is 'repo'.";

    var button = document.createElement("BUTTON");
    button.className = "btn";
    button.innerText = "Save";
    button.style.margin = "5px";
    button.onclick = saveCredentials;

    box.appendChild(textfield_user);
    box.appendChild(textfield_token);
    box.appendChild(document.createElement("BR"));
    box.appendChild(textfield_hash_data_url);
    box.appendChild(button);
    box.appendChild(note);

    document.body.appendChild(box);
}

// saves the credentials and removes the box and the button
function saveCredentials ( )
{
    var user = document.getElementById("github-user");
    var token = document.getElementById("github-token");
    var hash_data_url = document.getElementById("hash-data-url");

    if (hash_data_url.value != DefaultURLHelper)
    {
        hash_data_url = hash_data_url.value.trim();

        if (hash_data_url.length > 0 && hash_data_url.substr(-1, 1) != "/")
            hash_data_url = hash_data_url + "/";

        GM_setValue("hash_data_url", hash_data_url);
    }

    GM_setValue("username", user.value.trim());
    GM_setValue("token", token.value.trim());

    var box = document.getElementById("github-credentials-box");
    box.outerHTML = "";

    fetchUpdates();
}

function getTimeline ( )
{
    var timeline;
    var timeline_content;

    for (var i=0; i<discussion_bucket.children.length; i++)
        if (discussion_bucket.children[i].classname == "discussion-sidebar")
            continue;
        else
            timeline = discussion_bucket.children[i];

    for (i=0; i < timeline.children.length; i++)
        if (timeline.children[i].className == "discussion-timeline-actions")
            continue;
        else
            timeline_content = timeline.children[0];

    return timeline_content;
}


function getTimelineItems ( times_only, type )
{
    var timeline_content = getTimeline();

    // Walks up the parent chain until the direct parent is timeline_content
    var findTopMostChild = function ( child )
    {
        var my_child = child;

        while (my_child.parentElement != timeline_content)
            my_child = my_child.parentElement;

        return my_child;
    };

    var times = timeline_content.getElementsByTagName("relative-time");

    var return_array = [];
    var last;
    var last_was_review = false;

    for (var o=0; o < times.length; o++)
    {
        var topmost = findTopMostChild(times[o]);

        if (topmost == last)
            continue;

        if (type == "review")
        {
            // Only review tags have this class
            var is_review = /discussion-item-review/g.test(topmost.className);


            if (!is_review)
            {
                last_was_review = false;
                continue;
            }
        }
        else if (type == "comment")
        {
            // Only comments have this class
            if (!/timeline-comment-wrapper/g.test(topmost.className))
                continue;
        }

        if (times_only)
        {
            var date = times[o].getAttribute("datetime");
            var parsed_date = Date.parse(date);

            // Collaps reviews that directly follow each other into one
            if (last_was_review)
                return_array[return_array.length-1] = parsed_date;
            else
                return_array.push(parsed_date);
        }
        else
        {
            // Collaps reviews that directly follow each other into one
            if (last_was_review)
                return_array[return_array.length-1] = topmost;
            else
                return_array.push(topmost);
        }

        last = topmost;
        last_was_review = true;
    }

    return return_array;
}

function makeTimelineEntry ( time, text, action, id )
{
    console.log("Creating entry " + text + " " + id);

    var timeline_content = getTimeline();

    // Walks up the parent chain until the direct parent is timeline_content
    var findTopMostChild = function ( child )
    {
        var my_child = child;

        while (my_child.parentElement != timeline_content)
            my_child = my_child.parentElement;

        return my_child;
    };

    var times = timeline_content.getElementsByTagName("relative-time");

    var insert_before;

    // Find the right place in the timeline to insert
    for (var o=0; o < times.length; o++)
    {
        var date = times[o].getAttribute("datetime");

        // Ignore review discussion timestamps
        if (/discussion/.test(times[o].parentElement.getAttribute("href")))
            continue;

        if (Date.parse(date) > time)
        {
            insert_before = findTopMostChild(times[o]);
            break;
        }
    }

    // Construct item to insert
    var timeline_item = document.createElement("DIV");
    timeline_item.className = "discussion-item-header discussion-item";

    // Copied from github src code for push icon
    timeline_item.innerHTML = '<span class="discussion-item-icon"><svg aria-hidden="true" class="octicon octicon-repo-push" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg></span>';
    timeline_item.id = id;
    timeline_item.appendChild(document.createTextNode(text));

    var link = document.createElement("A");

    link.className = "btn btn-sm btn-outline";
    link.innerText = "View changes";
    link.onclick = function () { action(this); return false; };
    link.href = "#";

    timeline_item.appendChild(link);

    timeline_content.insertBefore(timeline_item, insert_before);
}

// Creates a button in the github sidebar in PRs
function makeButton ( text, action, id )
{
    var sidebar = document.getElementById("github-incremental-diffs-sidebar-item");

    var buttondiv = document.createElement("DIV");
    buttondiv.id = id;

    var button = document.createElement("A");

    button.appendChild(document.createTextNode(text));
    button.onclick = function () { action(); return false; };
    button.href = "#";

    buttondiv.appendChild(button);
    sidebar.appendChild(buttondiv);
}

// Fetches the sha heads from hash_data_url
function fetchUpdates ( base_url )
{
    var urlsplit = document.URL.split("/");
    var owner = urlsplit[3];
    var repo  = urlsplit[4];
    var prid_and_anker = urlsplit[6].split("#");

    var prid = prid_and_anker[0];

    var url = base_url+owner+'/'+repo+'/' + prid + "?cachebust=" + new Date().getTime();

    console.log("Fetching updates from " + url);

    // Create a new request object
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            if (response.status == 200)
                injectTimeline(response.responseText);
            else
                console.log("No pushes found at "+url+": " + response.status);
        }});
}

/* Injects "Author pushed" events into the PR timeline
 *
 * Params:
 *     shas = list of sha's and unix timestamp pairs. Sha and timestamp are separated by ";".
 *            Each pair is separated by "\n"
*/
function injectTimeline ( shas )
{
    var sidebar = document.getElementsByClassName("discussion-sidebar")[0];

    if (sidebar.removeEventListener)
    {
        sidebar.removeEventListener ('DOMSubtreeModified', fetchDelayed);
    }

    var sha_list = shas.split("\n");

    var base, head, update;

    update = 1;

    function makeShowDiffFunc ( inner_base, inner_head )
    {
        var func = function ( item )
        {
            if (item.innerText == "Hide changes")
            {
                var elem = item.parentElement.getElementsByClassName("file")[0];
                elem.outerHTML = "";

                item.innerText = "View changes";
                return;
            }

            var cont = document.createElement("DIV");
            cont.className = "file";
            cont.innerHTML = "Loading...";
            cont.style.backgroundColor = "yellow";

            item.parentElement.appendChild(cont);

            var urlsplit = document.URL.split("/");
            var owner = urlsplit[3];
            var repo  = urlsplit[4];

            item.innerText = "Hide changes";

            console.log("pressed.. " + inner_base + " " + inner_head);

            var prid_and_anker = document.URL.split("/")[6].split("#");
            var prid = prid_and_anker[0];

            fetcher.start(owner, repo, prid, inner_base, inner_head, item.parentElement);
        };
        return func;
    }

    var pairs = [];

    // Build pairs of commits to create diff from
    for (var i = 0; i < sha_list.length; i++)
    {
        if (sha_list[i].length === 0)
            continue;

        var sha_data = sha_list[i].split(";");
        var sha = sha_data[0];
        var time;

        if (sha_data[1] !== undefined)
            time = new Date(parseInt(sha_data[1]) * 1000);

        if (base === undefined)
        {
            base = sha;
            continue;
        }

        head = sha;

        var pair = {};
        pair.base = base;
        pair.head = head;
        pair.time = time;

        pairs.push(pair);

        base = head;
    }

    console.log("Pairs: " + pairs.length + " last: " + head);

    // Next, merge the pairs between reviews/comments
    var timeline_items = getTimelineItems(true, "review");

    console.log("Found " + timeline_items.length + " items");

    var base_pair = null;

    var merged_pairs = [];
    var merged_pair = {};

    var timeline_it = 0;

    // Only try to merge pairs if more than one exists
    if (pairs.length > 1)
    {
        for (i=0; i < pairs.length; i++)
        {
                // Find the first review that is right before newer than our current
                while (pairs[i].time.getTime() > timeline_items[timeline_it] &&
                       timeline_it+1 < timeline_items.length &&
                       pairs[i].time.getTime() > timeline_items[timeline_it+1])
                    timeline_it++;

                //console.log("Comparing " + pairs[i].time + " > " + new Date(timeline_items[timeline_it]) + " " + i + " > " + timeline_it);

                if (pairs[i].time.getTime() > timeline_items[timeline_it])
                {
                    if (base_pair === null)
                    {
                        console.log("Set base at " + i);
                        base_pair = pairs[i];
                        timeline_it++;
                        continue;
                    }

                    console.log("Merging a pair");

                    // And use the pair one before that as head
                    var head_pair = pairs[i-1];

                    merged_pair = {};
                    merged_pair.base = base_pair.base;
                    merged_pair.head = head_pair.head;
                    merged_pair.time = head_pair.time;

                    merged_pairs.push(merged_pair);

                    base_pair = pairs[i];

                    timeline_it++;

                    if (timeline_it >= timeline_items.length)
                        break;

                    continue;
                }
        }

        // Merge any remaining pairs
        if (merged_pairs.length === 0 ||
            merged_pairs[merged_pairs.length-1].head != pairs[pairs.length-1].head)
        {
            merged_pair = {};
            merged_pair.base = base_pair.base;
            merged_pair.head = pairs[pairs.length-1].head;
            merged_pair.time = pairs[pairs.length-1].time;

            merged_pairs.push(merged_pair);
        }
    }
    else
    {
        merged_pairs = pairs;
    }

    console.log("Merged pairs: " + merged_pairs.length);

    for (i=0; i < merged_pairs.length; i++)
    {
        var it = merged_pairs[i];

        // Don't remake a button that already exists
        if (!document.getElementById("diffbutton-" + update))
        {
            var formatted_time = update;

            var addZero = function ( num )
            {
                if (num < 10)
                    num = "0" + num;

                return num;
            };

            if (it.time !== undefined)
                formatted_time = it.time.getDate() + "." +
                                 addZero((it.time.getMonth()+1)) + "." +
                                 it.time.getFullYear() + " " +
                                 addZero(it.time.getHours()) + ":" +
                                 addZero(it.time.getMinutes());

            makeTimelineEntry(it.time.getTime(), "Author pushed code changes at " + formatted_time, makeShowDiffFunc(it.base, it.head), "diffbutton-" + update);
        }

        update++;
    }

    if (sidebar.addEventListener)
    {
        sidebar.addEventListener ('DOMSubtreeModified', fetchDelayed, false);
    }
}

function fetchDelayed ( )
{
    // Don't fetch again if there are still diff buttons
    if (document.getElementById("diffbutton-1"))
    {
        return;
    }

    var sidebar = document.getElementsByClassName("discussion-sidebar")[0];
    sidebar.removeEventListener ('DOMSubtreeModified', fetchDelayed);
    setTimeout(fetchUpdates, 1000);
}

function render ( )
{
    'use strict';

    var need_setup = !GM_getValue("username") || !GM_getValue("token");

    var css_style = GM_getResourceText ("CSSDIFF");
    GM_addStyle (css_style);

    var sidebar = document.getElementById("partial-discussion-sidebar");

    if (sidebar !== null)
    {
        var item = document.createElement("DIV");
        item.className = "discussion-sidebar-item";
        item.id = "github-incremental-diffs-sidebar-item";

        var button = document.createElement("BUTTON");
        button.className = "btn btn-sm";
        button.type = "submit";

        button.appendChild(document.createTextNode("Incremental Diffs Setup"));
        button.onclick = askCredentials;

        item.appendChild(button);

        sidebar.appendChild(item);

        fetchBaseUrl();
    }
}

function fetchBaseUrl ( )
{
    var baseUrlCb = function ( )
    {
        if (this.status == 404)
        {
            console.log("No project specific base URL, using global one: " + GM_getValue("hash_data_url"));
            fetchUpdates(GM_getValue("hash_data_url"));
            return;
        }

        var response = JSON.parse(this.responseText);

        var blobCb = function ( )
        {
            var resp = JSON.parse(this.responseText);
            var base_url = atob(resp.content);

            console.log("Found project specific base url " + base_url);
            fetchUpdates(base_url);
        };

        var request2 = new XMLHttpRequest();
        request2.onload = blobCb;
        request2.open('get', response.object.url);
        var usertoken = GM_getValue("username") + ":" + GM_getValue("token");
        request2.setRequestHeader("Authorization", "Basic " + btoa(usertoken));
        request2.send();
    };

    var request = new XMLHttpRequest();

    request.onload = baseUrlCb;

    var urlsplit = document.URL.split("/");
    var owner = urlsplit[3];
    var repo  = urlsplit[4];

    // Initialize a request
    request.open('get', "https://api.github.com/repos/" + owner + "/" + repo + "/git/refs/meta/incremental-diff-url");

    var usertoken = GM_getValue("username") + ":" + GM_getValue("token");
    request.setRequestHeader("Authorization", "Basic " + btoa(usertoken));
    // Send it
    request.send();
}


(function()
{
    var parts = document.URL.split("/");

    if (parts[5] == "pull")
        render();
    // This is required for this script to be run upon ajax load.. not sure why
    window.onbeforeunload = function()
    {
        console.log("window changed!");
    };
})();
