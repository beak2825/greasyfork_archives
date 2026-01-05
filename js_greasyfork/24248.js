// ==UserScript==
// @name         RedditRestore
// @namespace    https://www.reddit.dynu.net
// @version      0.8
// @description  Restores edits and deletes on Reddit
// @author       /u/PortugalCache
// @match        https://www.reddit.com/r/*/comments/*/*/
// @exclude      https://www.reddit.com/r/*/comments/*/*/*/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.6/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/24248/RedditRestore.user.js
// @updateURL https://update.greasyfork.org/scripts/24248/RedditRestore.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var postId = location.pathname.match(/comments\/(.+?)\//i)[1];
    var postCacheUrl = 'https://www.reddit.dynu.net'+location.pathname;

    // time ago
    var timeSince = function(date) {
        var format = function (intervalType) { return interval + ' ' + intervalType + (interval > 1 || interval === 0 ? 's' : '') + ' ago'; };
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return format('year');
        if ((interval = Math.floor(seconds / 2592000)) >= 1) return format('month');
        if ((interval = Math.floor(seconds / 86400)) >= 1) return format('day');
        if ((interval = Math.floor(seconds / 3600)) >= 1) return format('hour');
        if ((interval = Math.floor(seconds / 60)) >= 1) return format('minute');
        interval = seconds;
        return format('second');
    };

    // time html
    var timeHtml = function (timestamp) {
        var date = new Date(timestamp*1000);
        return `<time title="${date.toString()}" datetime="${date.toISOString()}" class="">${timeSince(date)}</time>`;
    };

    // compare html strings
    var compareHtml = function(html1, html2) {
        var el1 = document.createElement('span'); el1.innerHTML = html1;
        var el2 = document.createElement('span'); el2.innerHTML = html2;
        return el1.innerHTML == el2.innerHTML;
    };

    // comment text html
    var editsHtml = function (plainTexts, original) {
        var html = '', text = '', lastHtml, edits = Object.keys(plainTexts), onlyIns = true, onlyDel = true, texts = {};
        for (var i in plainTexts) texts[i] = marked(plainTexts[i]);

        if (original && !compareHtml(original.replace(/\n/g, ''), texts[edits[edits.length-1]].replace(/\n/g, ''))) {
            var i = Math.floor(Date.now()/1000);
            texts[i] = original;
            edits.push(i);
        }
        //if (edits.length == 1) return texts[edits[0]];
        for (var i in texts) {
            if (edits.length != 1) html += '<p class="tagline" style="font-size: 11px; font-weight: bold;">'+(Number(i) ? 'Edited ' + timeHtml(i) : 'Original')+':</p>';
            html += lastHtml = text ? htmlDiff(text, text = texts[i]) : text = texts[i];
            if (/<span class="del">/.test(lastHtml)) onlyIns = false;
            if (/<span class="ins">/.test(lastHtml)) onlyDel = false;
        }
        if (onlyIns || onlyDel) return htmlDiff(texts[edits[0]], text);
        return text + `<div><a href="javascript:" onclick="this.parentNode.childNodes[1].style.display = (this.parentNode.childNodes[1].style.display ? '' : 'none');">Show ${edits.length-1} edits</a><div style="display: none;">${html}</div></div>`;
    };

    // comment html
    var commentHtml = function (id, comment, childInnerHTML) {
        return `
<div class="midcol unvoted">
<div class="arrow up login-required access-required" data-event-action="upvote" role="button" aria-label="upvote" tabindex="0"></div>
<div class="arrow down login-required access-required" data-event-action="downvote" role="button" aria-label="downvote" tabindex="0"></div>
</div>
<div class="entry unvoted">
<p class="tagline">
<a href="javascript:void(0)" class="expand" onclick="return togglecomment(this)">[–]</a>
<a href="https://www.reddit.com/user/${comment.author}" class="author may-blank id-t2_ydhqk">${comment.author}</a>
<span class="userattrs"></span>
<span class="score dislikes"></span>
<span class="score unvoted"></span>
<span class="score likes"></span>
${timeHtml(comment.created)}
<span class="del">DELETED</span>
&nbsp;
<a href="javascript:void(0)" class="numchildren" onclick="return togglecomment(this)">(- childs)</a>
</p>
<form action="#" class="usertext warn-on-unload" onsubmit="return post_form(this, 'editusertext')" id="form-t1_${id}6t3"><input type="hidden" name="thing_id" value="t1_${id}">
<div class="usertext-body may-blank-within md-container ">
<div class="md">${editsHtml(comment.text)}</div>
</div>
</form>
<ul class="flat-list buttons">
<li class="first"><a href="${postCacheUrl+id}/" target="_blank" data-event-action="permalink" class="bylink" rel="nofollow">cachelink</a></li>
<li class="reply-button"><a class="access-required" href="javascript:void(0)">reply</a></li>
</ul>
<div class="reportform report-t1_${id}"></div>
</div>
<div class="child">${childInnerHTML ? childInnerHTML : ''}</div>
<div class="clearleft"></div>`;
    };

    // add cachelink button
    var addCacheLinkButton = function (id) {
        var buttons = document.querySelector('#thing_'+id+' .buttons');
        if (buttons) {
            var button = document.createElement('li');
            button.innerHTML = '<a href="'+postCacheUrl+(/^t1_/.test(id) ? id.replace(/^t1_/, '') + '/' : '')+'" target="_blank">cachelink</a>';
            buttons.insertBefore(button, buttons.childNodes[1]);
        }
        else console.log('Could not add cachelink button to ' + id);
    };

    // add cachelink button to post
    addCacheLinkButton('t3_'+postId);

    // add styles for the green and red background
    var style = document.createElement('style');
    style.textContent = ".ins, .ins * { background-color: #dfffd1!important; }\n.del, .del * { background-color: #faa!important; }";
    document.head.appendChild(style);

    // retrieve ids of visible comments
    var visibleComments = [];
    var editedComments = [];
    var els = document.getElementsByClassName('parent'); //this way it doesn't match 'morechildren' comments
    for (var i = 0; i < els.length; i++) {
        var el = els[i].firstChild;
        if (el) {
            var name = el.getAttribute('name');
            if (document.querySelector('#thing_t1_'+name+' > div > p > .edited-timestamp')) {
                editedComments.push(name);
            }
            else visibleComments.push(name);
        }
    }

    var moreCommentsLoadedTimer = {};
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (!mutation.target.querySelector(':scope > .morechildren')) {
                var id = mutation.target.parentNode.parentNode.id;
                if (moreCommentsLoadedTimer[id]) clearTimeout(moreCommentsLoadedTimer[id]);
                moreCommentsLoadedTimer[id] = setTimeout(function () {
                    console.log("more comments for:", id);
                }, 100);
            }
        });
    });
    // configuration of the observer:
    var config = {attributes: true, childList: true, characterData: true, attributeOldValue: true};

    // retrieve ids of morechildren comments
    var hiddenComments = [];
    var els = document.querySelectorAll('.morechildren, .morerecursion');
    for (var i = 0; i < els.length; i++) {
        observer.observe(els[i].parentNode, config);
        var id = els[i].parentNode.parentNode.parentNode.id;
        if (id) hiddenComments.push(id.replace(/^thing_t1_/, ''));
    }

    // fixme: will repeat ids already in visible comments
    // retrieve ids of orphan comments
    var orphanComments = [];
    var deletedComments = document.getElementsByClassName('deleted');
    var getFirstOrphanComment = function (deletedComment) {
        return deletedComment.querySelector('.child > div > .comment:not(.deleted)');
    };
    for (var i = 0; i < deletedComments.length; i++) {
        var child = getFirstOrphanComment(deletedComments[i]);
        if (child) orphanComments.push(child.id.replace(/^thing_t1_/, ''));
    }

    // retrieve ids of comments from deleted users
    //var it = function (xpath) { var r = [], n = null; while (n = xpath.iterateNext()) r.push(n); return r; };
    var deletedUsersComments = [], deletedUserPost = false;
    var els = document.evaluate('//span[@class="author" and text()="[deleted]"]/../../..', document, null, XPathResult.ANY_TYPE, null), el;
    while ((el = els.iterateNext())) {
        if (/^thing_t3_/.test(el.id)) deletedUserPost = true;
        else deletedUsersComments.push(el.id.replace(/^thing_t1_/, ''));
    }

    // is removed post
    var deletedPost = document.evaluate('//em[text()="[removed]"]/..', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (deletedPost) deletedPost.innerHTML = `<div class="md"><p></p></div>`;

    // handle response
    var responseHandler = function (responseText) {
        var result = JSON.parse(responseText);
        console.log(result);

        var addReplyButton = function (el, comment) {
            el.querySelector('.reply-button').addEventListener('click', function (e) {
                var parent = e.target.parentNode.parentNode.parentNode.parentNode, replyButton;
                do {
                    parent = parent.parentNode;
                    replyButton = parent.querySelector(':scope > .entry > .buttons .reply-button');
                    console.log(parent, replyButton);
                } while (parent.className != 'commentarea' && !replyButton);
                if (replyButton) replyButton.firstChild.click();

                var text; for (var i in comment.text) text = comment.text[i];
                text = text.split("\n");
                for (var i = 0; i < text.length; i++) if (text[i]) text[i] = ' > /u/' + comment.author + ': ' + text[i];
                text = text.join("\n");

                var textarea = parent.querySelector('textarea');
                textarea.value = text + "\n\n";
                textarea.focus();
            });
        };

        for (var id in result.edits) {
            // add edits
            var md = document.querySelector('#thing_'+id+' .md');
            if (md) {
                md.innerHTML = editsHtml(result.edits[id], md.innerHTML);
                addCacheLinkButton(id);
            }
            else console.log('could not add edits to ' + id);
        }

        // restore deleted authors
        if (result.authors) {
            for (var id in result.authors) {
                var span = document.querySelector('#thing_'+(/^t3_/.test(id) ? '' : 't1_')+id+' .author');
                var author = result.authors[id];
                span.innerHTML = `<a href="https://www.reddit.dynu.net/user/${author}" class="author del" target="_blank">${author}</a>`;
            }
        }

        // restore parent of orphan comments
        var deletedComments = document.getElementsByClassName('deleted');
        for (var i = 0; i < deletedComments.length; i++) {
            var firstOrphan = getFirstOrphanComment(deletedComments[i]);
            if (firstOrphan) {
                var orphanName = firstOrphan.id.replace(/^thing_t1_/, '');
                var parent = result.parents && result.parents[orphanName];
                if (parent) {
                    deletedComments[i].innerHTML = commentHtml(parent.id, parent, deletedComments[i].querySelector('.child').innerHTML);
                    addReplyButton(deletedComments[i], parent);
                    deletedComments[i].className = deletedComments[i].className.replace(/deleted/i,''); // becomes null after this
                }
                else console.log('parent not received for ' + orphanName);
            }
        }

        // restore remaining deleted comments
        if (result.dels) {
            var siteTable = document.getElementById('siteTable_t3_'+postId, true);
            var keys = Object.keys(result.dels).sort(function(a,b) { return a > b ? 1 : -1;}); // we want to add comments by chronological order
            for (var i = 0; i < keys.length; i++) {
                var name = keys[i];
                var comment = result.dels[name];
                var parentEl = comment.parent_id ? document.querySelector('#thing_t1_'+comment.parent_id+' .child') : siteTable;
                if (parentEl) {
                    var div = document.createElement('div');
                    div.className = 'thing comment noncollapsed';
                    div.id = 'thing_t1_' + name;
                    div.innerHTML = commentHtml(name, comment);
                    addReplyButton(div, comment);
                    parentEl.appendChild(div);
                }
                else console.log('add comment ' + name + ' to ' + comment.parent_id + ': ERROR');
            }
        }

    };

    // the request to the cache site
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.responseText) {
            responseHandler(this.responseText);
        }
    };
    xhttp.open("POST", "https://www.reddit.dynu.net/?gm=0.8&p="+postId, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(
        function (post) {
            var r = [];
            for (var i in post.arrays) if (post.arrays[i].length) r.push(i + '=' + post.arrays[i].join(','));
            for (var i in post.booleans) if (post.booleans[i]) r.push(i + '=');
            return r.join('&');
        }({
            arrays: {c: visibleComments, o: orphanComments, uc: deletedUsersComments, e: editedComments, h: hiddenComments},
            booleans: {up: deletedUserPost, dp: deletedPost}
        })
    );
})();

// compute diff between two strings
this.diff = function(oldStr, newStr) {
    var array_keys = function (a, s) {
        var r = [];
        if (!a) return r;
        for (var i = 0; i < a.length; i++) {
            if (a[i] == s) r.push(i);
        }
        return r;
    };
    var maxlen = 0, omax = 0, nmax = 0, matrix = [];
    for (var oindex = 0; oindex < oldStr.length; oindex++) {
        var ovalue = oldStr[oindex];
        var nkeys = array_keys(newStr, ovalue);
        for (var i = 0; i < nkeys.length; i++) {
            var nindex = nkeys[i];
            if (!matrix[oindex]) matrix[oindex] = [];
            matrix[oindex][nindex] = (matrix[oindex - 1] && matrix[oindex - 1][nindex - 1]) ?
                matrix[oindex - 1][nindex - 1] + 1 : 1;
            if (matrix[oindex][nindex] > maxlen) {
                maxlen = matrix[oindex][nindex];
                omax = oindex + 1 - maxlen;
                nmax = nindex + 1 - maxlen;
            }
        }
    }
    if (maxlen === 0) return [{d: oldStr, i: newStr}];
    return diff(oldStr.slice(0, omax), newStr.slice(0, nmax)).concat(
        newStr.slice(nmax, nmax + maxlen)).concat(
        diff(oldStr.slice(omax + maxlen), newStr.slice(nmax + maxlen)));
};

// pretty print the diff
this.htmlDiff = function(oldStr, newStr) {
    var explode = function (str) { return str.trim().match(/<.+?>|[a-záéíóúâêîôûãõç0-9]+[ \n]*|[^a-záéíóúâêîôûãõç0-9]/ig); };
    var diffResult = diff(explode(oldStr), explode(newStr));
    var ret = '';
    for (var i = 0; i < diffResult.length; i++) {
        var k = diffResult[i];
        if (k instanceof Object) {
            ret += (k.d.length ? '<span class="del">'+k.d.join('')+"</span>" : '') +
                (k.i.length ? '<span class="ins">'+k.i.join('')+"</span>" : '');
        }
        else ret += k;
    }
    return ret;
};
