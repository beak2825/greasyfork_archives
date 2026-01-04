// ==UserScript==
// @name         SCP Foundation - No Necroposting
// @author       RandomUsername404
// @namespace    https://greasyfork.org/en/users/105361-randomusername404
// @version      1.01
// @description  Hides the 'Reply' button under comments older than 5 months.
// @run-at       document-start
// @include      *://www.scp-wiki.net/forum/*/*
// @include      *://fondationscp.wikidot.com/forum/*/*
// @include      *://scp-wiki-cn.wikidot.com/forum/*/*
// @include      *://scp-wiki-de.wikidot.com/forum/*/*
// @include      *://fondazionescp.wikidot.com/forum/*/*
// @include      *://ja.scp-wiki.net/forum/*/*
// @include      *://ko.scp-wiki.net/forum/*/*
// @include      *://scp-wiki.net.pl/forum/*/*
// @include      *://scp-pt-br.wikidot.com/forum/*/*
// @include      *://scpfoundation.ru/forum/*/*
// @include      *://lafundacionscp.wikidot.com/forum/*/*
// @include      *://scp-th.wikidot.com/forum/*/*
// @include      *://scp-ukrainian.wikidot.com/forum/*/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @icon         http://www.scp-wiki.net/local--files/component:theme/logo.png
// @downloadURL https://update.greasyfork.org/scripts/370073/SCP%20Foundation%20-%20No%20Necroposting.user.js
// @updateURL https://update.greasyfork.org/scripts/370073/SCP%20Foundation%20-%20No%20Necroposting.meta.js
// ==/UserScript==

$.noConflict();
jQuery(document).ready(function($) {

    var currentDate = (new Date).getTime() / 1000;
    preventNecroposts();

    $(document).on("click", ".target", function() {
        setTimeout(function() {
            preventNecroposts();
        }, 500);
    });

    function preventNecroposts() {

        $('.post').each(function() {
            var postID = $(this).attr('id');
            var classList = $('#' + postID + ' .odate').attr('class').split(/\s+/);

            $.each(classList, function(index, item) {
                if (item.includes('time_')) {
                    var postDate = item.split("_").pop();

                    if (currentDate - postDate > 13150000) { // 5 months in seconds
                        $('#' + postID + ' .btn-primary').hide();
                    }
                }
            });
        });
    }
});