// ==UserScript==
// @name         redirect bgm search to cityhunter.me with autocomplete
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  将 bgm.tv bangumi.tv 和 chii.in 的顶栏分类搜索替换为 cityhunter.me 多标签搜索
// @author       oscardoudou
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in).*/
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/500470/redirect%20bgm%20search%20to%20cityhunterme%20with%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/500470/redirect%20bgm%20search%20to%20cityhunterme%20with%20autocomplete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add jQuery UI CSS
    GM_addStyle(`
        .ui-autocomplete {
            max-height: 200px;
            overflow-y: auto;
            /* prevent horizontal scrollbar */
            overflow-x: hidden;
        }
        /* IE 6 doesn't support max-height
         * we use height instead, but this forces the menu to always be this tall
         */
        * html .ui-autocomplete {
            height: 200px;
        }
    `);

    // 替换搜索类别
    const catMapping = {
        '2': 'anime',
        '1': 'book',
        '4': 'game',
        '3': 'music',
        '6': 'real',
    };

    // 添加搜索表单提交事件监听器
    document.querySelector('#headerSearch form').addEventListener('submit', function(event) {

        // 获取选择的搜索类别和搜索关键词
        var catValue = document.getElementById('siteSearchSelect').value;
        var searchTextValue = document.getElementById('search_text').value;

        // 阻止默认的表单提交行为(只对以上分类,全部和人物沿用bangumi搜索)
        if(catValue in catMapping)  {
                event.preventDefault();
        }
        var catReplacement = catMapping[catValue];

        // 构造跳转的 URL
        var redirectURL = 'https://cityhunter.me/'+catReplacement+'/tags/?q=' + encodeURIComponent(searchTextValue);

        // 跳转到指定的 URL
        window.location.href = redirectURL;
    });

    // 添加搜索栏标签补全
    // Wait for the page to load
    $(document).ready(function() {
        // Ensure the jQuery UI CSS is loaded
        GM_addElement('link', {
            href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
            rel: 'stylesheet',
            type: 'text/css'
        });
        var request_terms = []
        // Initialize autocomplete
        $('#search_text').autocomplete({
            source: function(request, response) {
                let cat = $('#siteSearchSelect').val();
                if (!(cat in catMapping)){
                    response([]); // No suggestions for disallowed categories(all|person)
                    return;
                }
                // Get the last tag (the part after the last space)
                request_terms = request.term.split(' ')
                let lastTerm = request_terms.pop();
                let apiUrl = `https://cityhunter.me/api/tags/?size=20&cat=${cat}&prefix=${lastTerm}`;

                GM.xmlHttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    responseType: 'json',
                    onload: function(res) {
                        if (res.status === 200) {
                            var suggestions = res.response['results'].map(function(item) {
                                return {
                                    label: item['name'],
                                    value: item['name'],
                                    count: item['count']
                                };
                            });
                            response(suggestions);
                        } else {
                            response([]);
                            console.log('res.status not 200');
                        }
                    },
                    onerror: function() {
                        response([]);
                    }
                });
            },

            minLength: 1,
            select: function(event, ui) {
                request_terms.push(ui.item.value);
                this.value = request_terms.join(' ')
                return false;
            }
        });

        // Ensure the input keeps focus on tab
        /*$('#search_text').on('keydown', function(event) {
            if (event.key === 'Tab') {
                $(this).autocomplete('search', this.value.split(' ').pop());
            }
        });*/
    });

})();
