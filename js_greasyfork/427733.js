// ==UserScript==
// @name         fenoblocker9000 (AimIsADick too)
// @description     Adds cringe warning to feno and AimIsADick posts
// @include      *://*teamfortress.tv/*
// @include      *://*tf.gg/*
// @version 0.0.1.20210610015506
// @namespace https://greasyfork.org/users/749376
// @downloadURL https://update.greasyfork.org/scripts/427733/fenoblocker9000%20%28AimIsADick%20too%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427733/fenoblocker9000%20%28AimIsADick%20too%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var thread_container = document.getElementById("thread-container");
    if(thread_container) {
        var post_array = thread_container.getElementsByClassName("post");
        var cringe_posts = [];
        for (let post of post_array) {
            if(/fenomeno|AimIsADick/.test(post.querySelector(".post-header .post-author").innerHTML)) {
                cringe_posts.push(post);
            }
        }
        while(cringe_posts.length > 0) {
            let post = cringe_posts.shift();
            post.getElementsByClassName("post-body")[0].style.display="none";
            post.getElementsByClassName("post-footer")[0].style.display="none";
            post.innerHTML += "<div class=\"cringe-warning\" style=\"text-align:center;height:112px;background-color:#C76B6B;\"><p style=\"font-size:24px;color:white;\"><br>⚠️CRINGE WARNING⚠️</p><br><span onclick=\"this.parentElement.parentElement.getElementsByClassName('post-body')[0].removeAttribute('style');this.parentNode.parentNode.getElementsByClassName('post-footer')[0].removeAttribute('style');this.parentNode.parentNode.removeChild(this.parentNode);\" class=\"btn\">Show Me Anyways</span></div>";
        }
    }
})();