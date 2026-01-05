// ==UserScript==
// @name          Hacker News Comment Search Filter
// @description   Hides comments on a page via regular expression search fields
// @version       1.0.0
// @author        sdca
// @namespace     sdca.hncsf
// @include       https://news.ycombinator.com/item?id=*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19233/Hacker%20News%20Comment%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19233/Hacker%20News%20Comment%20Search%20Filter.meta.js
// ==/UserScript==

(function(){

    // Delay comment count threshold
    var filter_delay_min_comments = 300;
    // Delay time in seconds
    var filter_delay_time = 0.5;

    if(document.querySelector('.comment-tree')) {
        var filter_count = 0;
        var filter_delay;
        if(filter_delay_min_comments >= (document.querySelectorAll('.athing').length - 1)) {
            filter_delay_time = 0;
        }
        GM_addStyle('#fc-wrapper{margin:0 20px;} .filter-comments{width:100%;} .fid{display:none;}');
        document.querySelector('.comment-tree').insertAdjacentHTML('beforebegin', '<div id="fc-wrapper"><form id="fc-form"><input id="filter-comments-add" type="button" value="+"/></form></div>');
        document.getElementById('filter-comments-add').addEventListener('click', filter_add, false);
        document.getElementById("fc-form").addEventListener("submit", function(event){
            event.preventDefault();
        });
        filter_add();
    }

    function filter_add() {
        filter_count++;
        document.getElementById('filter-comments-add').insertAdjacentHTML('beforebegin', '<input id="filter-comment-'+filter_count+'" class="filter-comments" placeholder="Search Comments..." />');
    }

    function filter_comments() {
        var re = new RegExp();
        var st = this.value;
        var ex = false;
        var fid = this.id.replace(/^filter-comment-/, '');

        if(this.value.charAt(0) == '-') {
            ex = true;
            st = st.replace(/^-/, '');
            if(this.value == '-') {
                ex = false;
            }
        }

        try {
            re = new RegExp(st, 'i');
        } catch(err){}

        if(re !== 'undefined') {
            clearTimeout(filter_delay);
            filter_delay = setTimeout(function() {

                Array.prototype.forEach.call(document.querySelectorAll('.athing'), function(el, i){
                    if (!i) return;

                    var comment = el.querySelector('.default').textContent;
                    var filter_remove = false;
                    if(ex === false) {
                        if(re.test(comment)) {
                            el.classList.remove('fid'+fid);
                            filter_remove = true;
                        } else {
                            el.classList.add('fid','fid'+fid);
                        }
                    } else {
                        if(!re.test(comment)) {
                            el.classList.remove('fid'+fid);
                            filter_remove = true;
                        } else {
                            el.classList.add('fid','fid'+fid);
                        }
                    }

                    if(filter_remove === true && el.classList.contains('fid')) {
                        var filter_remain = false;
                        for (var filter = 0; filter < filter_count; filter++) {
                            if(el.classList.contains('fid'+filter)) {
                                filter_remain = true;
                            }
                        }
                        if(!filter_remain) {
                            el.classList.remove('fid');
                        }
                    }
                });
            }, filter_delay_time * 1000);
        }
    }

    document.addEventListener('input', function (event) {
        var el = event.target, index = -1;
        while (el && ((index = Array.prototype.indexOf.call(document.querySelectorAll('.filter-comments'), el)) === -1)) {
            el = el.parentElement;
        }
        if (index > -1) {
            filter_comments.call(el, event);
        }
    });
    document.addEventListener('keydown', function (event) {
        var el = event.target, index = -1;
        while (el && ((index = Array.prototype.indexOf.call(document.querySelectorAll('.filter-comments'), el)) === -1)) {
            el = el.parentElement;
        }
        if (index > -1) {
            if(event.keyCode == 27) {
                el.value = '';
                filter_comments.call(el, event);
            }
        }
    });

})();