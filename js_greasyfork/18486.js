// ==UserScript==
// @name         byfandom blog link
// @version      0.2
// @description  insert link to your own blog
// @namespace    https://greasyfork.org/users/36620
// @match        http*://*.byfandom.org/blogs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18486/byfandom%20blog%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/18486/byfandom%20blog%20link.meta.js
// ==/UserScript==
(function($) {
    $('body').ready(function() {
        var toblog = document.createElement('li');
        var link = document.createElement('a');
    
        var name = $('.ow_console_dropdown_hover a').attr('href');
        name = '/blogs/user/'+name.slice(name.lastIndexOf('/')+1);
        link.setAttribute('href',name);
    
        var view = document.createTextNode('view my blog');
        var span = document.createElement('span');
        span.appendChild(view);
        link.appendChild(span);
        toblog.appendChild(link);
    
        $('.ow_content_menu').append(toblog);
    });
})(window.jQuery);