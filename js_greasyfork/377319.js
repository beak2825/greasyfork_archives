// ==UserScript==
// @name         Wanikani: Dashboard Vacation Mode
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds a vacation mode shortcut button to the dashboard menu.
// @author       kumirei
// @include      /^https://(www|preview).wanikani.com*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377319/Wanikani%3A%20Dashboard%20Vacation%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/377319/Wanikani%3A%20Dashboard%20Vacation%20Mode.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function($) {
    let header = document.getElementsByClassName('global-header')[0];
    if (!header) return;

    $.ajax('/settings/account')
        .then(extract_vacation_form)
        .then(function(form) {
        var btn = $(form.btn)[0];
        btn.className = 'sitemap__page dashboardVacationMode';
        $('head').append(`<style id="dashboardVacationModeCSS">
                              .dashboardVacationMode {
                                  background: transparent;
                                  color: #e5e5e5;
                                  border: none;
                                  margin: 0 -8px 5px;
                                  padding: 8px;
                                  width: -webkit-fill-available;
                                  text-align: left;
                                  border-radius: 4px;
                                  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
                              }
                              .dashboardVacationMode:hover {
                                  background: rgba(255, 255, 255, 0.2);
                              }
                              .system-alert > h3 > a:not([href]) {
                                  cursor: pointer;
                              }
                          </style>`);
        var post = function() { $.post(form.url, form.data, function() { window.location.reload(); } );};
        btn.onclick = post;
        $('.sitemap__expandable-chunk--account >> .sitemap__page')[1].after(btn);
        $('[href="/settings/account#vacation-mode').text('Deactivate vacation mode').removeAttr('href').click(post);
    });

    function extract_vacation_form(html){
        let HTML = $(html);
        let state = HTML.find('#vacation-btn')[0].value == "Activate vacation mode";
        var form = HTML.find('#edit_user_vacation');
        var url = form.attr('action');
        var data = {};
        form.find('input').toArray().forEach(function(i){
            var name = $(i).attr('name');
            var value = $(i).attr('value');
            data[name] = value;
        });
        var btn = $(html).find('#vacation-btn')[0].outerHTML;
        return ({btn:btn, url:url, data:data, state:state});
    }
})(window.jQuery);
