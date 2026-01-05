// ==UserScript==
// @name         Xenforo Exporter
// @version      1.03
// @description  Export threads from XenForo
// @author       Thathanka Iyothanka
// @include     https://forum.the-west.fr/index.php?threads/*
// @grant        none
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/18446/Xenforo%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/18446/Xenforo%20Exporter.meta.js
// ==/UserScript==
(function(fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    //Date / heure du post => $(this).find('.DateTime').attr('title')
    //Pour afficher un post => url/index.php?goto/post&id=1708138#post-1708138
    var data = '';

    function export_thread() {
        data = '';
        if ($('.pageNav-main').length !== 0) {
            var calls = [];
            var url = document.URL.split('/');
            url.pop();
            url = url.join('/') + '/page-';
            for (i = 1; i <= parseInt($('.pageNav-main .pageNav-page:last').text()); i++) {
                calls.push($.get(url + i));
            }
            $.when.apply($, calls).done(function() {
                for (var i = 0; i < calls.length; i++) {
                    var page = $(arguments[i][0]);
                    process_posts(page);
                }
                save_file(data);
            }).fail(function(jqXHR, status, error) {
                console.log('Failed due to: ' + status + " " + error);
            });
        } else {
            process_posts($('body'));
            save_file(data);
        }
    }

    function process_posts(page) {
        posts = page.find('article.message').each(function() {
            data += $(this).attr('data-author') + '|' + $(this).attr('data-content').slice(5) + '|' + $(this).find('.message-userContent').text().trim().replace(/(\r\n|\n|\r)/gm, "¤").replace(/	/gm, "").replace(/↑/gm, "").replace(/¤¤¤¤¤/gm, "") + '\r\n';
        });
    }

    function save_file(content) {
        var title = $('h1.p-title-value').text();
        var blob = new Blob([content], {
            type: "text/csv;charset=utf-8"
        });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", url);
        var date = new Date();
        link.setAttribute("download", title + ' ' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ".txt");
        document.body.appendChild(link);
        link.click();
    }
    $('div.buttonGroup').append($('<a id="download_thread" class="button--link button" href="javascript:void(0)">Exporter la discussion</a>'));
    $('#download_thread').on('click', function() {
        export_thread();
    });
});