// ==UserScript==
// @name        Reddit Overwrite Comments ✍️
// @author      Agreasyforkuser
// @namespace   Reddit
// @description Edit all comments with randomly selected words/phrases
// @match       https://old.reddit.com/user/*
// @version     1.0
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484005/Reddit%20Overwrite%20Comments%20%E2%9C%8D%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484005/Reddit%20Overwrite%20Comments%20%E2%9C%8D%EF%B8%8F.meta.js
// ==/UserScript==

// Define a list of phrases here
var words = ["wow", "cool", "nice"];

var commentstabpage = /https:\/\/.*\.reddit\.com\/user.*\/comments\/.*/;
if (commentstabpage.test(location.href)) {

    to_delete = [];
    num_user_comments = 0;
    deleted = 0;
    span = '';
    user = '';

    delete_comment = function (thing_id, from_delete_all) {
        try {
            var thing = document.querySelector("input[name='thing_id'][value='" + thing_id + "']");
            var status = thing.parentNode.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > span.status").innerHTML;
            var error = false;
            if ((status.indexOf("error") != -1) || (status.indexOf("submitting") != -1)) {
                error = true;
            } else {
                deleted++;
            }
            if (from_delete_all) {
                if (to_delete.length != 0) {
                    span.innerHTML = "OVERWRITING COMMENT " + (deleted + 1) + " OF " + num_user_comments;
                    var next_thing_id = to_delete.pop();
                    setTimeout(overwrite_comment, 2000, next_thing_id, from_delete_all);
                } else {
                    if (num_user_comments - deleted != 0) {
                        num_user_comments = num_user_comments - deleted;
                        UpdateDeleteAllSpan();
                        span.innerHTML = "<span>Failed to overwrite " + num_user_comments + " comments</span><br>" + span.innerHTML;
                    } else
                        span.style.display = 'none';
                }
            } else {
                if (error)
                    alert("Failure");
                else
                    num_user_comments--;
                UpdateDeleteAllSpan();
            }
            return (error ? -1 : 0);
        } catch (er) {
            alert(er);
            if (from_delete_all) location.reload();
            return -99;
        }
    }

    overwrite_comment = function (thing_id, from_delete_all) {
        try {
            var edit_form = document.querySelector("input[name='thing_id'][value='" + thing_id + "']").parentNode;
            edit_form.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > button.cancel").click();
            var edit_btn = edit_form.parentNode.querySelector("ul > li > a.edit-usertext");
            if (edit_btn) edit_btn.click();
            var edit_textbox = edit_form.querySelector("div.usertext-edit > div > textarea");
            var repl_str = '';
            var randomIndex = Math.floor(Math.random() * words.length);
            edit_textbox.value = words[randomIndex];
            edit_form.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > button.save").click();
            setTimeout(delete_comment, 2000, thing_id, from_delete_all);
            return 0;
        } catch (e) {
            alert("Error with form: " + e);
            return -99;
        }
    };

    delete_all = function () {
        try {
            num_user_comments = 0;
            deleted = 0;
            to_delete = [];
            var comments = document.querySelectorAll("a.author");
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].innerHTML != user) continue;
                var thing_id = comments[i].parentNode.parentNode.querySelector("form.usertext > input[name='thing_id']").value;
                if (to_delete.indexOf(thing_id) == -1) {
                    to_delete.push(thing_id);
                    num_user_comments++;
                }
            }
            span.innerHTML = "TRYING TO Overwrite COMMENT 1 OF " + num_user_comments;
            var next_thing_id = to_delete.pop();
            overwrite_comment(next_thing_id, true);
        } catch (e) {
            alert("YOU ARE MOST LIKELY NOT ON THE COMMENTS TAB! /n/n Error trying to delete all your comments.\nError: " + e + " Stack:" + e.stack);
            location.reload()
        }
    };

    function add_delete_links(ev) {
        user = document.querySelector("span.user > a:not(.login-required)").innerHTML;
        if (!user) { return; }
        var comments = document.querySelectorAll("a.author");
        num_user_comments = 0;
        for (var i = 0; i < comments.length; i++) {
            if (comments[i].innerHTML != user) continue;
            try {
                var main_parent = comments[i].parentNode.parentNode;
                var thing_id = main_parent.querySelector("form > input[name='thing_id']").value;
                var list = main_parent.querySelector("ul.flat-list");
                if (list.querySelector("li.secure_delete")) continue;
                num_user_comments++;
                var addedlink = document.createElement("li");
                addedlink.setAttribute('class', 'secure_delete');
                var dlink = document.createElement("a");
                dlink.setAttribute('class', 'bylink secure_delete');
                dlink.setAttribute('onClick', 'javascript:var ret = overwrite_comment("' + thing_id + '", false);');
                dlink.setAttribute('href', 'javascript:void(0)');
                addedlink.appendChild(dlink);
                main_parent.querySelector("ul.flat-list").appendChild(addedlink);
            } catch (e) { }
        }
        span = document.createElement("span");
        span.setAttribute('class', 'secure_delete_all');
        UpdateDeleteAllSpan();
    }

    deleteConfirm = function () {
        if (confirm('Are you sure you want to overwrite all comments with "' + words + '" ?')) {
            delete_all();
        }
    }

    function UpdateDeleteAllSpan() {
        if (num_user_comments) {
            var dlink = document.createElement("a");
            dlink.setAttribute('class', 'bylink');
            dlink.setAttribute('onClick', 'javascript:return deleteConfirm()');
            dlink.setAttribute('href', 'javascript:void(0)');
            dlink.appendChild(document.createTextNode('OVERWRITE ALL visible comments on this page with "' + words + '"'));
            dlink.style.border = 'none';
            dlink.style.fontWeight = 'bold';
            dlink.style.color = 'white';
            span.appendChild(dlink);
            span.style.backgroundColor = 'red';
            span.style.borderRadius = '20px';
            span.style.padding = '5px';
            span.style.display = 'inline-table';
            var menuarea = document.querySelector("div.menuarea");
            var firstChild = menuarea.firstChild;
            menuarea.insertBefore(span, firstChild.nextSibling);
        } else if (span != null) {
            span.style.display = 'none';
        }
    }

    add_delete_links();
    document.addEventListener("DOMContentLoaded", add_delete_links, false);
} else {
    // Place a reminder
    var alink = document.createElement('a');
    var overviewURL = location.href;
    var commentstabURL = overviewURL + 'comments/';
    alink.href = commentstabURL;
    alink.textContent = 'go to comments-tab to overwrite✍️';
    alink.style.color = 'white';
    alink.style.backgroundColor = 'black';
    alink.style.padding = '5px';
    alink.style.fontWeight = 'bold';
    alink.style.borderRadius = '20px';
    alink.style.display = 'inline-table';
    document.querySelector('.menuarea').appendChild(alink);
}