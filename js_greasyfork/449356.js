// ==UserScript==
// @name         Rock Paper Shotgun [RPS] & Eurogamer comment order fix
// @version      2
// @description  Fix the broken ordering of the comments on RPS, Eurogamer and a few other ReedPop sites
// @author       Tim Smith
// @license      GPL-3.0 License
// @match        *://www.rockpapershotgun.com/*
// @match        *://www.eurogamer.net/*
// @match        *://www.vg247.com/*
// @match        *://www.dicebreaker.com/*
// @match        *://www.thepopverse.com/*

// @namespace https://greasyfork.org/users/945293
// @downloadURL https://update.greasyfork.org/scripts/449356/Rock%20Paper%20Shotgun%20%5BRPS%5D%20%20Eurogamer%20comment%20order%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/449356/Rock%20Paper%20Shotgun%20%5BRPS%5D%20%20Eurogamer%20comment%20order%20fix.meta.js
// ==/UserScript==

(function() {

class CommentOrderFixer {
    constructor() {
        this.commentsContainer = document.querySelector('#comments > .container');
        if (this.commentsContainer === null) return;
        this.replySets = [];
        this.loaded = false;
        this.ascending = false;
        this.observeMutations();
        this.addCustomStyle();
    }

    observeMutations() {
        if (!this.checkLoaded()) {
            this.mutationObserver = new MutationObserver(() => this.mutation());
            this.mutationObserver.observe(this.commentsContainer, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }
    }

    addCustomStyle() {
        const customStyle = document.createElement('style');
        document.head.appendChild(customStyle);
        customStyle.sheet.insertRule('#comments .container .replies._reordered {display: flex; flex-direction: column;}', 0);
        customStyle.sheet.insertRule('#comments .container .replies._reordered > .post:last-of-type {padding-bottom: 20px;}', 0);
    }

    mutation() {
        if (this.loaded)
            this.orderReplies();
        else
            this.checkLoaded();
    }

    checkLoaded() {
        this.loaded = this.commentsContainer.dataset.loaded === 'true';
        if (this.loaded) {
            for (const rootPost of this.commentsContainer.querySelectorAll('.thread > .posts > .post'))
                this.findReplies(rootPost);
            this.orderReplies();
        }
        return this.loaded;
    }

    findReplies(post) {
        const replyContainer = document.querySelector('#'+post.id+' > .replies');
        if (replyContainer === null) return;
        if (replyContainer.childElementCount > 1) {
            const replies = [];
            for (const reply of replyContainer.children)
                replies.push([reply, new Date(document.querySelector('#'+reply.id+' > .metadata > .when').dateTime)]);
            replies.sort((a, b) => a[1] - b[1]);
            this.replySets.push([replyContainer, replies.map(replyData => replyData[0])]);
        }
        for (const reply of replyContainer.children)
            this.findReplies(reply);
    }

    orderReplies() {
        const ascending = this.commentsContainer.dataset.order != 'desc';
        if (this.ascending == ascending) return;
        for (const [replyContainer, replies] of this.replySets) {
            replyContainer.classList.toggle('_reordered', ascending);
            for (const [order, reply] of replies.entries())
                if (ascending) {
                    reply.style.order = order;
                    if (order == replies.length - 1)
                        reply.style.paddingBottom = 0;
                } else {
                    reply.style.removeProperty('order');
                    if (order == replies.length - 1)
                        reply.style.removeProperty('padding-bottom');
                }
        }
        this.ascending = ascending;
    }
}

new CommentOrderFixer();

})();