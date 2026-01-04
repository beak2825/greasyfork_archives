// ==UserScript==
// @name        TF.TV sort by frag count
// @namespace   sheybey
// @description Sort TF.TV posts by frag count
// @include     https://www.teamfortress.tv/*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32829/TFTV%20sort%20by%20frag%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/32829/TFTV%20sort%20by%20frag%20count.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var container = document.getElementById('thread-container');

    function create_option(name, value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        return option;
    }

    if (container !== null) {
        var select = document.createElement('select');
        select.appendChild(create_option('Sort by date', 'date'));
        select.appendChild(create_option('Sort by frags', 'frags'));
        select.style.marginBottom = '0';
        select.style.width = '110px';

        select.addEventListener('change', function () {
            var posts = Array.from(container.children);
            var cmp;

            function frag_count(post) {
                if (post.classList.contains('self')) {
                    return Infinity;
                }
                return parseInt(
                    post.querySelector('.post-frag-count').textContent,
                    10
                );
            }

            function post_id(post) {
                return parseInt(post.firstElementChild.id, 10);
            }

            if (select.value === 'frags') {
                cmp = function (a, b) {
                    return frag_count(b) - frag_count(a);
                };
            } else {
                cmp = function (a, b) {
                    return post_id(a) - post_id(b);
                };
            }

            posts.sort(cmp);

            posts.forEach(function (post) {
                container.appendChild(post);
            });
        });

        document.querySelector('.thread-frag-container').appendChild(select);
    }
}());
