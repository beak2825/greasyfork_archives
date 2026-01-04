// ==UserScript==
// @name         Rank HN comments by engagement
// @description  Ranks HN comments by number of direct or indirect children, or by custom criteria
// @version      1
// @author       heartbeats
// @namespace    https://news.ycombinator.com/user?id=heartbeats
// @include      *://news.ycombinator.com/*
// @downloadURL https://update.greasyfork.org/scripts/411957/Rank%20HN%20comments%20by%20engagement.user.js
// @updateURL https://update.greasyfork.org/scripts/411957/Rank%20HN%20comments%20by%20engagement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Change this variable to change the ranking algorithm. 
     * Presently available ranking algorithms are:
     *   bump: Whenever someone comments on a post, the entire tree gets moved to the top. Like old forums. Tiebreaker: hn_engagement
     *   count: Most children first. New comments without children go on the bottom.
     *   hn_engagement: One child (direct or indirect) is treated as 1 vote, HN's standard ranking algorithm is then applied
     */
    let SORT_METHOD = 'bump';
    let ageCache = {};

    function sortOp() {
        if (SORT_METHOD === 'bump')
            return 'max';
        else
            return 'add';
    }

    function rankComment(age, sortMethod) {
        // TODO: https://news.ycombinator.com/item?id=1782473
        // Rank. Higher is better.
        let gravity = 1.8;
        let timeBase = 7200; // from https://news.ycombinator.com/item?id=1781417
        console.assert(age !== undefined);
        switch (sortMethod) {
            case 'bump': return age; break;
            case 'count': return 1; break;
            case 'hn_engagement': return 1.0 / Math.pow(-age + timeBase, gravity); break;
            default: console.assert(false); break;
        };
    }

    function getIndent(id) {
        let iwidth = 40; // hardcoded in document HTML
        return Math.round(document.getElementById(id).querySelector(".ind > img").width/iwidth);
    }

    function getAge(id) {
        // relative time, in negative seconds
        let timeHuman = {
            minute: 60,
            hour: 3600,
            day: 86400
        };
        
        let text = document.getElementById(id).querySelector(".age").textContent;
        let tokenized = text.split(' ');
        console.assert((tokenized.length == 3 && tokenized[2] === "ago") ||
                       (tokenized.length == 4 &&  tokenized[0] === "on"));
        let rel = tokenized.length == 3;
        if (rel)
            return -tokenized[0] * timeHuman[/^.*[^s]/.exec(tokenized[1])];
        else
            return (Date.parse(tokenized.slice(1,).join(' ')) - Date.now())/1000;
    }

    function parseList(list) {
        let ret = [];
        let nodes = {};
        nodes[0] = 0;
        for (let i = 0; i < list.length; i++) {
            let ind = getIndent(list[i]);
            ret.push([list[i], nodes[ind-1]]); // set to ID of last ancestor
            nodes[ind] = list[i]; // prepare for children
        }
        return ret;
    }

    function flattenTree(tree) {
        // Get (sorted) all comments in tree
        let list = [tree.name];
        for (let i = 0; i < tree.children.length; i++) {
            list = list.concat(flattenTree(tree.children[i]));
        }
        return list;
    }

    function rankComments(subtree, sortMethod) {
        // tree's rank is sum or max of all children's rank
        // TODO: decay by say 0.8 for each level
        let reductions = {max: (a, b) => (a > b) ? a : b,
                          add: (a, b) =>  a + b};
        let rc = flattenTree(subtree).flatMap(id => (id == null) ? [] : rankComment(getAge(id), sortMethod)).reduce(reductions[sortOp()]);
        return rc;
    }

    function compareTree(a, b) {
        let rank_a = rankComments(a, SORT_METHOD);
        let rank_b = rankComments(b, SORT_METHOD);
        if (rank_a == rank_b) {
            /* HN's times aren't very granular, especially for old posts.
             * We thus use hn_engagement as a tiebreaker.
             * This converges to "number of descendants" for old posts.
             */
            rank_a = rankComments(a, 'hn_engagement');
            rank_b = rankComments(b, 'hn_engagement');
        }
        if (rank_a == rank_b)
            return 0;
        if (rank_a < rank_b)
            return 1;
        if (rank_a > rank_b)
            return -1;
        // TODO: stack
    }

    function appendSubtree(arg, ptr, item) {
        // this inserts an item into a tree
        // tree structure:
        // {children: [
        //   {name: 123, children: undefined},
        //   {name: 124, children: [
        //    {name: 125, children: undefined
        //   ]}
        //  ]
        // }
        // TODO refactor
        let idx = 0;
        console.assert(ptr !== undefined);
        if (ptr.length > 0)
            [arg.children[ptr[0]], idx] = appendSubtree(arg.children[ptr[0]], ptr.slice(1,), item);
        else
            idx = arg.children.push({name: item, children: []}) - 1;
        return [arg, idx];
    }

    function listToTree(list) {
        // will only append
        let tree = {children: []};
        let idx2root = {}; // ID: [3, 1, 4] = 3rd comment's 1st child's 4th child
        for (let i = 0; i < list.length; i++) {
            let subtree_ptr = [];
            let id = list[i][0];
            parent = list[i][1];
            if (parent !== undefined) {
                console.assert(idx2root[parent]);
                subtree_ptr = idx2root[parent];
                console.assert(subtree_ptr !== undefined);
            }
            let last_ptr; // This is the lowest idx of the appended comment
            console.assert(subtree_ptr !== undefined);
            [tree, last_ptr] = appendSubtree(tree, subtree_ptr, id);
            idx2root[id] = ((parent === undefined) ? [] : idx2root[parent]).concat(last_ptr);
        }
        return tree;
    }

    function getIndent(id) {
        let iwidth = 40;
        return Math.round(document.getElementById(id).querySelector(".ind > img").width/iwidth);
    }

    function parseList(list) {
        let ret = []
        let nodes = {}
        nodes[0] = undefined;
        for (let i = 0; i < list.length; i++) {
            let id = list[i];
            let ind = getIndent(id);
            ret.push([id, nodes[ind-1]]); // set to ID of last ancestor
            nodes[ind] = id; // prepare for children
        }
        return ret;
    }

    function getComments() {
        return document.getElementsByClassName("comment-tree")[0].children[0].children;
    }

    function getCommentsList(comments) {
        let l = [];

        for (let i = 0; i < comments.length; i++)
            l.push(comments[i].id);
        return l;
    }

    function treeSort(tree, compar) {
        for (let i = 0; i < tree.children.length; i++) {
                tree.children[i] = treeSort(tree.children[i], compar);
        }
        tree.children = tree.children.sort(compar);
        return tree;
    }

    function sortComments() {
        //TODO: hide comments
        let comments = getComments();
        let commentsEl = document.getElementsByClassName("comment-tree")[0].children[0]; // TODO
        let list = getCommentsList(comments);
        let tree = parseList(list); // bottom-up tree
        let tree2 = listToTree(tree); // real tree

        tree2 = treeSort(tree2, compareTree);
        let flat = flattenTree(tree2);
        for (let i = 0; i < flat.length; i++) {
            let child = document.getElementById(flat[i]);
            if (child != null) commentsEl.appendChild(child);
        }

        //TODO: Show the comments again
    }

    sortComments();
})();
