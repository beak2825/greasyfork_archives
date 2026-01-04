// ==UserScript==
// @name         3x攻略格式化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  攻略格式化
// @author       You
// @match        https://jingyan.baidu.com/article/*.html
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432089/3x%E6%94%BB%E7%95%A5%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432089/3x%E6%94%BB%E7%95%A5%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn=document.createElement("button");
    btn.innerHTML = '点击格式化';
    $(btn).click(() => {
        $('.exp-content-container').removeClass('fold');
        let html = $('#format-exp').html();

        //console.log(html.match(/<h2(([\s\S])*?)<\/h2>/g));

        html = html.replace(/(\s*&nbsp;)+/g, '');
        html = html.replace(/(<p><\/p>)+/g, '<p></p>');
        html = html.replace(/<p><strong>\s*引言\s*<\/strong><\/p>/g, '<h3 class="h3">引言</h3>');
        html = html.replace(/<h2(([\s\S])*?)<\/h2>/g, (match) => {
            const h2 = match.match(/<\/a>\S+<div/)[0];
            return `<h2 class="h2">${h2.slice(4, h2.length - 4)}</h2>`;
        });
        html = html.replace(/<ol/g, '<div').replace(/<\/ol/g, '</div').replace(/<li/g, '<div').replace(/<\/li/g, '</div');

        $('#format-exp').html(html);

        $('#format-exp .list-icon').each(function() {
            const h3 = $(this).next().children()[0];
            $(h3).parent().html(`<h3 class="h3">${$(h3).text().trim()}</h3>`);
        });

        $('#format-exp .list-icon').remove();
         $('#format-exp .last-item').remove();

        $('#format-exp p').css('text-indent', '2em');

        $('#format-exp img:not([src])').each(function(){
            $(this).attr('src', $(this).attr('data-src'));
            $(this).css('visibility', 'visible');
        })
    });

    $('#exp-article').prepend(btn);
})();