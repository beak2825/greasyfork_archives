// ==UserScript==
// @name         Cassiopeiae R
// @version      0.1
// @description  //
// @author       Cassiopeiae
// @match        http://www.jeuxvideo.com/forums/*
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/127468
// @downloadURL https://update.greasyfork.org/scripts/369999/Cassiopeiae%20R.user.js
// @updateURL https://update.greasyfork.org/scripts/369999/Cassiopeiae%20R.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Rate = function(post) {
        var author = document.querySelectorAll('.bloc-pseudo-msg')[post].innerHTML.trim(),
            div = document.createElement('div');
        div.style.float = 'right';
        div.style.lineHeight = '2.875rem';
        var p = document.createElement('p');
        p.style.padding = '5px';
        p.style.display = 'inline';
        p.style.border = '1px rgb(0, 0, 0) dashed';
        p.className = 'score-rate';
        p.number = 0;
        p.innerHTML = p.number;
        div.appendChild(p);
        var update = function(value) {
            asyncUpdate(post, value);
        }, add = function(int) {
            for (let i = 0, j = document.querySelectorAll('.bloc-pseudo-msg').length; i < j; i++) {
                if (author == document.querySelectorAll('.bloc-pseudo-msg')[i].innerHTML.trim()) {
                    document.querySelectorAll('.score-rate')[i].number += int;
                    document.querySelectorAll('.score-rate')[i].innerHTML = document.querySelectorAll('.score-rate')[i].number;
                }
            }
            update(p.number);
        }, down = function(span) {
            colorDes(span);
            span.isActive = false;
            add(-span.number);
            if (!document.querySelectorAll('.upvote')[post].isActive && !document.querySelectorAll('.downvote')[post].isActive) {
                remove(post);
            }
        }, span1 = document.createElement('span'),
            span2 = document.createElement('span');
        span1.innerHTML = '+1';
        span1.number = 1;
        span1.className = 'upvote';
        span1.style.marginLeft = '5px';
        span1.style.marginRight = '5px';
        span2.innerHTML = '-1';
        span2.number = -1;
        span2.className = 'downvote';
        span1.addEventListener('click', function() {
            if (span2.isActive) down(span2);
        });
        span2.addEventListener('click', function() {
            if (span1.isActive) down(span1);
        });
        for (let span of [span1, span2]) {
            span.isActive = false;
            span.style.padding = '5px';
            span.style.cursor = 'pointer';
            colorDes(span);
            span.addEventListener('click', function() {
                this.isActive = !this.isActive;
                if (!this.isActive) down(this);
                else {
                    colorAct(span);
                    add(span.number);
                }
            });
            div.appendChild(span);
        }
        return div;
    };
    if (document.querySelectorAll('.bloc-header').length > 0) {
        for (let i = 0, j = document.querySelectorAll('.bloc-header').length; i < j; i++) {
            document.querySelectorAll('.bloc-header')[i].appendChild(new Rate(i));
        }
    }
})();

function colorAct(span) {
    if (span.number == 1) span.style.backgroundColor = 'rgb(0, 255, 0)';
    else span.style.backgroundColor = 'rgb(255, 0, 0)';
    span.style.border = '1px rgb(0, 0, 0) solid';
    span.style.color = 'rgb(0, 0, 0)';
    span.style.fontWeight = 'bold';
}

function colorDes(span) {
    span.style.backgroundColor = '';
    span.style.border = '1px rgb(170, 170, 170) solid';
    span.style.color = 'rgb(170, 170, 170)';
    span.style.fontWeight = 'normal';
}

window.addEventListener('load', function() {
    Active();
});

async function remove(post) {
    var str = await GM.getValue('/messages/'),
        data = document.querySelectorAll('.bloc-message-forum')[post].getAttribute('data-id'),
        n = str.search(data);
    if (n != -1) {
        str = str.replace(str.substring(n - 1, n + data.length), '');
        await GM.setValue('/messages/', str);
    }
}

async function asyncUpdate(post, value) {
    let str = await GM.getValue('/messages/'),
        data = document.querySelectorAll('.bloc-message-forum')[post].getAttribute('data-id');
    if (str.search(data) == -1) {
        document.querySelectorAll('.upvote')[post].isActive ? await GM.setValue('/messages/', str + '+' + data) : await GM.setValue('/messages/', str + '-' + data);
    }
    await GM.setValue(document.querySelectorAll('.bloc-pseudo-msg')[post].innerHTML.trim(), value);
}

var known = [];
function Active() {
    for (let i = 0, j = known.length; i < j; i++) {
        let span;
        if (known[i] > 0) span = document.querySelectorAll('.upvote')[known[i]];
        else span = document.querySelectorAll('.downvote')[Math.abs(known[i])];
        colorAct(span);
        span.isActive = true;
    }
}

(async () => {
    var str = await GM.getValue('/messages/');
    if (!str) await GM.setValue('/messages/', '');
    if (document.querySelectorAll('.bloc-header').length > 0) {
        for (var i = 0, j = document.querySelectorAll('.bloc-header').length; i < j; i++) {
            var gm = await GM.getValue(document.querySelectorAll('.bloc-pseudo-msg')[i].innerHTML.trim());
            if (gm) {
                document.querySelectorAll('.score-rate')[i].number = parseInt(gm);
                document.querySelectorAll('.score-rate')[i].innerHTML = parseInt(gm);
            }
            var n = str.search(document.querySelectorAll('.bloc-message-forum')[i].getAttribute('data-id'));
            if (n != -1) {
                if (str.charAt(n - 1) == '+') known.push(i);
                else known.push(-i);
            }
        }
    }
})();