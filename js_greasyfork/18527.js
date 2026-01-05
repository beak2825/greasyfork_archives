// ==UserScript==
// @name             Thread Watcher
// @namespace        com.kongregate.resterman
// @author           resterman
// @version          1.0.1
// @include          http://www.kongregate.com/community*
// @include          http://www.kongregate.com/forums/*
// @description      Watch threads for new posts.
// @downloadURL https://update.greasyfork.org/scripts/18527/Thread%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/18527/Thread%20Watcher.meta.js
// ==/UserScript==



function Thread(threadId, threadTitle, lastPostId, lastPostAuthor, forumId) {
    this.threadId   = threadId;
    this.threadTitle    = threadTitle;
    this.lastPostId = lastPostId;
    this.lastPostAuthor = lastPostAuthor;
    this.forumId    = forumId;
}

Thread.prototype = {

    THREADS_KEY: "thread",

    save: function () {
        var threadsWatched = localStorage.getItem(this.THREADS_KEY);
        if (threadsWatched === null)
            threadsWatched = {};
        else
            threadsWatched = JSON.parse(threadsWatched);

        threadsWatched[this.threadId] = {
            threadId: this.threadId,
            forumId: this.forumId,
            lastPostId: this.lastPostId,
            threadTitle: this.threadTitle,
            lastPostAuthor: this.lastPostAuthor
        };

        localStorage.setItem(this.THREADS_KEY, JSON.stringify(threadsWatched));
    },

    watch: function () {
        this.save();
    },

    unwatch: function () {
        var threadsWatched = JSON.parse(localStorage.getItem(this.THREADS_KEY));
        if (threadsWatched === null || !this.isWatched())
            return;

        delete threadsWatched[this.threadId];
        localStorage.setItem(this.THREADS_KEY, JSON.stringify(threadsWatched));
    },

    wasUpdated: function () {
        if (!this.isWatched())
            return false;

        var storedThread = Thread.get(this.threadId);
        return storedThread ? storedThread.lastPostId < this.lastPostId : false;
    },

    isOlder: function (aThread) {
        return this.lastPostId < aThread.lastPostId;
    },

    isWatched: function () {
        return !!Thread.get(this.threadId);
    },

    getUrl: function () {
        return '/forums/'+ this.forumId +'/topics/'+ this.threadId;
    },

    createWatchButton: function () {
        var link = new Element('a', {href: 'javascript:void(0);'})
                .update(this.isWatched() ? Thread.UNWATCH : Thread.WATCH);
        link.setAttribute('class', this.isWatched() ? 'unwatch-btn' : 'watch-btn');

        var self = this;
        link.observe('click', function (e) {
            e.stop();

            if (self.isWatched()) {
                self.unwatch();
                link.update(Thread.WATCH)
                    .setAttribute('class', 'watch-btn');
            } else {
                self.watch();
                link.update(Thread.UNWATCH)
                    .setAttribute('class', 'unwatch-btn');
            }
        });

        return link;
    }

};

Thread.WATCH = 'watch';
Thread.UNWATCH = 'unwatch';

Thread.getPostIdFromUrl = function (url) {
    var matches = url.match(/posts-([0-9]+)-row/);
    return matches !== null ? parseInt(matches[1]) : null;
};

Thread.getThreadIdFromUrl = function (url) {
    var matches = url.match(/topics\/([0-9]+)-/);
    return matches !== null ? parseInt(matches[1]) : null;
};

Thread.getForumIdFromUrl = function (url) {
    var matches = url.match(/forums\/([0-9]+)-/);
    return matches !== null ? parseInt(matches[1]) : null;
};

Thread.create = function (threadId, threadTitle, lastPostId, lastPostAuthor, forumId) {
    return new Thread(threadId, threadTitle, lastPostId, lastPostAuthor, forumId);
};

Thread.createFromUrl = function (url) {
    return Thread.create(
        Thread.getThreadIdFromUrl(url),
        null,
        Thread.getPostIdFromUrl(url),
        null,
        Thread.getForumIdFromUrl(url)
    );
};

Thread.get = function (threadId) {
    var threadsWatched = Thread.getAllWatched();
    if (threadsWatched === null)
        return null;

    return threadsWatched[threadId];
};

Thread.getAllWatched = function () {
    var threadsWatched = localStorage.getItem(Thread.prototype.THREADS_KEY);
    if (threadsWatched === null)
            return null;

    threadsWatched = JSON.parse(threadsWatched);
    for (var i in threadsWatched) {
        var obj = threadsWatched[i];
        threadsWatched[i] = Thread.create(
            obj.threadId,
            obj.threadTitle,
            obj.lastPostId,
            obj.lastPostAuthor,
            obj.forumId
        );
    }

    return threadsWatched;
};

/* url: http://www.kongregate.com/forums/ */
function threads(){
    var css = document.createElement('style');
    css.innerHTML = 'td.lp span a.unwatch-btn { color: #336699; } td.lp span a.unwatch-btn { color: #900; }';
    document.head.appendChild(css);

    var threads = $$('.hentry');
    threads.each(function (thread) {
        var links = thread.select('a');
        var url = links[links.length - 1].href;
        var t = Thread.createFromUrl(url);
        t.threadTitle = thread.select('.entry-title')[0].innerText;
        t.lastPostAuthor = thread.select('.author')[0].firstChild.innerText;

        var actionLink = t.createWatchButton();
        actionLink.setStyle({
            'margin-left': '2px'
        });
        thread.select('.lp')[0]
            .insert(new Element('span').insert(actionLink));

        if (t.isWatched() && t.wasUpdated()) {
            thread.select('.icon')[0].setStyle({
                transition: 'all ease 0.5s',
                backgroundColor: 'deepskyblue'
            });
        }
    });
}

// url: http://www.kongregate.com/forums/*/topics/*
function thread() {
    var id = Thread.getThreadIdFromUrl(location.href),
        thread = Thread.get(id);
    
    var titleClone = $$('.forum_header h1')[0].clone(true);
    var threadTools = titleClone.select('#topic_mod')[0];
    if (threadTools)
        threadTools.remove();
    
    var threadTitle = titleClone.innerText.match(/(.*?)(\s+page\s+[0-9]+|$)/m)[1];
    
    if (!thread) {
        thread = Thread.createFromUrl(location.href);
        // Avoid fetching real last id, setting to negative id
        thread.lastPostId = -1;
        thread.lastPostAuthor = null; // Doesn't matter

        thread.threadTitle = threadTitle;
    }
    
    if (thread.isWatched() && thread.threadTitle !== threadTitle) {
        thread.threadTitle = threadTitle;
        thread.save();
    }

    var lastPost = $$('.post:last')[0];
    if (!lastPost)
        return;

    var lastId = lastPost.getAttribute('id').match(/posts-([0-9]+)-row/)[1];
    if (thread.isWatched() && lastId > thread.lastPostId) {
        thread.lastPostId = lastId;
        thread.save();
    }

    var watchButton = thread.createWatchButton().setStyle({ marginLeft: '10px' });
    $$('.media.mbs').each(function (i) {
        i.select('.utility').each(function (j) {
            j.insert({
                after: watchButton
            });
        });
    });
}


/* url: http://www.kongregate.com/community/ */
function community() {
    var containerTitle = new Element('h3', {
        id: 'watched_threads_title',
        class: 'forum_group_title h2 mtl'
    }).update('Watched Threads');

    var threadsTable = new Element('table');
    $('forums_title').parentNode.insert({ bottom: containerTitle });
    $('forums_title').parentNode.insert({ bottom: threadsTable });

    var threadsTableBody = new Element('tbody');
    threadsTable.insert(threadsTableBody);

    var onUnwatchClick = function (thread, row) {
        return function(e) {
            e.stop();
            thread.unwatch();
            row.remove();
        };
    };

    var threads = Thread.getAllWatched();
    for (var i in threads) {
        var t = threads[i];
        var row = new Element('tr');
        threadsTableBody.insert(row);

        var titleContainer = new Element('td', {
            class: 'c2 pts'
        });
        row.insert(titleContainer);

        var title = new Element('a', {
            class: 'title h3',
            href: t.getUrl()
        }).update(t.threadTitle);
        titleContainer.insert(title);

        var unwatchButton = new Element('a', {
            href: 'javascript:void(0);'
        }).update('unwatch')
        .setStyle({
            'float': 'right'
        });

        unwatchButton.observe('click', onUnwatchClick(t, row));

        titleContainer.insert(unwatchButton);
    }

}

(function() {
    'use strict';
    if (/\.com\/forums\/.*\/topics/.test(location.href))
        thread();
    else if (/\.com\/forums/.test(location.href))
        threads();
    else if (/\.com\/community/.test(location.href))
        community();
})();
