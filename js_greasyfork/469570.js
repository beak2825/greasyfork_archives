// ==UserScript==
// @name         回到顶部
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键回到网页顶部；让页面回到最顶部。
// @author       三号元素
// @license      MIT

// @match        *://*/*

// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjg3ODYxMzg1ODkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxwYXRoIGQ9Ik0zOS4zODQ2IDBoOTQ1LjIzMDc2OTIzMDc2OTN2MTU3LjUzODQ2MTUzODQ2MTU1aC05NDUuMjMwNzY5MjMwNzY5M1Ywek05ODQuNjE1NCA3MDguOTIzMWgtMjM2LjMwNzY5MjMwNzY5MjMydjMxNS4wNzY5MjMwNzY5MjMxaC00NzIuNjE1Mzg0NjE1Mzg0NjRWNzA4LjkyMzA3NjkyMzA3NjloLTIzNi4zMDc2OTIzMDc2OTIzMmw0NzIuNjE1NC00NzIuNjE1NEw5ODQuNjE1NCA3MDguOTIzMXoiIHAtaWQ9IjIzNzAiIGZpbGw9IiM3MDcwNzAiPjwvcGF0aD48L3N2Zz4=
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469570/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469570/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var style = document.createElement('style');
    style.innerHTML = `
        .add_gotop {
            cursor: pointer;
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 99999;
            display: block;
            width: 50px;
            height: 50px;
            background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjg3ODYxMzg1ODkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxwYXRoIGQ9Ik0zOS4zODQ2IDBoOTQ1LjIzMDc2OTIzMDc2OTN2MTU3LjUzODQ2MTUzODQ2MTU1aC05NDUuMjMwNzY5MjMwNzY5M1Ywek05ODQuNjE1NCA3MDguOTIzMWgtMjM2LjMwNzY5MjMwNzY5MjMydjMxNS4wNzY5MjMwNzY5MjMxaC00NzIuNjE1Mzg0NjE1Mzg0NjRWNzA4LjkyMzA3NjkyMzA3NjloLTIzNi4zMDc2OTIzMDc2OTIzMmw0NzIuNjE1NC00NzIuNjE1NEw5ODQuNjE1NCA3MDguOTIzMXoiIHAtaWQ9IjIzNzAiIGZpbGw9IiM3MDcwNzAiPjwvcGF0aD48L3N2Zz4=) no-repeat 0 0;
            opacity: 0.5;
            filter: alpha(opacity=50);

            //动画效果
            outline: none;
            transition: all 0.30s ease-in-out;
            -webkit-transition: all 0.30s ease-in-out;
            -moz-transition: all 0.30s ease-in-out;
            -o-transition: all 0.30s ease-in-out;
            -ms-transition: all 0.30s ease-in-out;
        }
        .add_gotop:hover {
            background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjg3ODYxMzg1ODkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxwYXRoIGQ9Ik0zOS4zODQ2IDBoOTQ1LjIzMDc2OTIzMDc2OTN2MTU3LjUzODQ2MTUzODQ2MTU1aC05NDUuMjMwNzY5MjMwNzY5M1Ywek05ODQuNjE1NCA3MDguOTIzMWgtMjM2LjMwNzY5MjMwNzY5MjMydjMxNS4wNzY5MjMwNzY5MjMxaC00NzIuNjE1Mzg0NjE1Mzg0NjRWNzA4LjkyMzA3NjkyMzA3NjloLTIzNi4zMDc2OTIzMDc2OTIzMmw0NzIuNjE1NC00NzIuNjE1NEw5ODQuNjE1NCA3MDguOTIzMXoiIHAtaWQ9IjIzNzAiIGZpbGw9IiNkODFlMDYiPjwvcGF0aD48L3N2Zz4=) no-repeat 0 0px;
        }`;
    document.head.appendChild(style);



    let top_div = document.createElement('div');
    top_div.setAttribute('id','add_gotop')
    top_div.innerHTML = `<a class="add_gotop"></a>`;
    /*

    */
    document.getElementsByTagName('head')[0].after(top_div);

    $("#add_gotop").hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            $("#add_gotop").fadeIn()
        } else {
            $("#add_gotop").fadeOut()
        }
    });
    $("#add_gotop").click(function () {
        $('html,body').animate({
            'scrollTop': 0
        }, 500)
    });

})();