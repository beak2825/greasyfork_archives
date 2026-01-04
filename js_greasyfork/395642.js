// ==UserScript==
// @name         corp_online
// @namespace    Virtonomica
// @version      0.01
// @description  Онлайн членов корпорации
// @author       Thunderfit
// @include        http*://*virtonomic*.*/*/main/company/view/*/corporation
// @downloadURL https://update.greasyfork.org/scripts/395642/corp_online.user.js
// @updateURL https://update.greasyfork.org/scripts/395642/corp_online.meta.js
// ==/UserScript==

(function() {
    var corp_online = function () {

        let tf_corp_online =  {
            init: function () {
                $('form[name="corporation"]').find('tr.wborder').each(this.eachCallback.bind(this));
            },
            eachCallback: function (index, element) {
                let tableCol = $(element).children('td').first();
                let href = tableCol.find('a').attr('href');
                if (href) {
                    this.loadActivity(href, element);
                }

            },
            loadActivity: function (href, element) {
                $.get(href, function(data){
                    let text = $(data).find('.owner-data .name span').text();
                    if (text) {
                        $(element).children('td').first().next().next().append('<div>'+text+'</div>')
                    }
                });

            },
        }
        tf_corp_online.init();
    }

    if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + corp_online.toString() + ')();';
    document.documentElement.appendChild(script);
    }
})();