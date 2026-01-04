// ==UserScript==
// @name         tyyy
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @author       You
// @include      *://t66y.com/thread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34113/tyyy.user.js
// @updateURL https://update.greasyfork.org/scripts/34113/tyyy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MinHeap {
        constructor(size, key) {
            this.size = size;
            this.objs = [];
            this.compareFunc = getCompareFunc(key);
            function getCompareFunc(key) {
                if(typeof(key) === "undefined"){
                    return (a, b) => {
                        if(a > b) return 1;
                        if(a < b) return -1;
                        return 0;
                    };
                } else {
                    return (a, b) => {
                        if(a[key] > b[key]) return 1;
                        if(a[key] < b[key]) return -1;
                        return 0;
                    };
                }
            }
        }

        insert(obj) {
            if(this.objs.length < this.size){
                this.objs.push(obj);
                return;
            }

            if(this.compareFunc(obj, this.objs[0]) === 1){
                this.objs.shift();
                this.objs.unshift(obj);
            }
            this.objs.sort(this.compareFunc);
        }
    }

    // Your code here...
    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);

    var table = $('#ajaxtable > tbody:nth-child(2)');
    highlightLines(table);

    function highlightLines(table){
        var trs = getValidLines(table);
        if(trs.length === 0) {
        	return;
        }
        var top15 = getTopReplied(trs, 15);
        const firstLine = trs[0];
        trs = trs.sort((a, b) => {
        	if(getReplyNumber(a) < getReplyNumber(b)) {
        		return -1;
        	}
        	if(getReplyNumber(a) > getReplyNumber(b)) {
        		return 1;
        	}
        	return 0;
        });
        trs.reverse();

        for(let tr of trs) {
        	firstLine.before(tr);
        }
        
        changeStyle(top15,'backgroundColor', '#66ccff');
        showTimeTag(trs);



        function showTimeTag(elements) {
            var todays = elements.filter(e => isToday(e.querySelector('td:nth-child(3) div').textContent));
            todays.forEach(e => e.querySelector('td:nth-child(1) a').textContent = 'T');

            var yestodays = elements.filter(e => isYestoday(e.querySelector('td:nth-child(3) div').textContent));
            yestodays.forEach(e => e.querySelector('td:nth-child(1) a').textContent = 'Y');

            function isToday(date) {
                var datetime = new Date(date);
                var now = new Date();
                return datetime.getFullYear() === now.getFullYear() &&
                    datetime.getMonth() === now.getMonth() &&
                    datetime.getDate() === now.getDate();
            }

            function isYestoday(date) {
                var datetime = new Date(date);
                var now = new Date();
                return datetime.getFullYear() === now.getFullYear() &&
                    datetime.getMonth() === now.getMonth() &&
                    datetime.getDate() + 1 === now.getDate();
            }
        }

        function getTopReplied(elements, size) {
            var replies = elements
                .map(e => parseInt(e.querySelector('td:nth-child(4)').textContent))
                .map((r, index) => ({
                    index: index,
                    replyNum: r
                }));
            var heap = new MinHeap(size, 'replyNum');
            replies.forEach(r => heap.insert(r));
            return heap.objs.map(o => elements[o.index]);
        }

        function getReplyNumber(tr) {
        	return parseInt(tr.querySelector('td:nth-child(4)').textContent);
        }

        function changeStyle(elements, key, value) {
            elements.forEach(tr => tr.style[key] = value);
        }
        function getValidLines(table) {
            var all = Array.from(table.querySelectorAll('tr'));
            var index = all.findIndex(tr => tr.querySelectorAll('.tr2 td').length === 1);
            all = all.slice(index + 1);
            return all.filter(tr => tr.className.includes('tr3'));
        }
    }

})();