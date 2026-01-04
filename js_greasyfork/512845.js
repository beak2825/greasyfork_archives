// ==UserScript==
// @name         baijia
// @description  bjjb
// @version      7
// @match        https://baijiahao.baidu.com/builder/rc/content*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/1381758
// @downloadURL https://update.greasyfork.org/scripts/512845/baijia.user.js
// @updateURL https://update.greasyfork.org/scripts/512845/baijia.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const baijiahao_apiserver = 'baijiahao-api.chagt.cn';
    window.account_name = '';
    window.article_list = [];
    window.subscribe_article_order_amount_list = [];

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            const url_obj = new URL(this.responseURL);
            if (url_obj.pathname == '/pcui/article/lists') handleArticleList(this);
            if (url_obj.pathname == '/builder/app/appinfo') handleAppInfo(this);
        });
        send.apply(this, arguments);
    };

    function handleArticleList(request) {
        const resp_json = JSON.parse(request.responseText);
        for (let article of resp_json.data.list) {
            if (window.article_list.filter(art => art.id == article.id).length == 0) window.article_list.push(article);
        }
        setTimeout(check, 500);
    }

    function handleAppInfo(request) {
        const resp_json = JSON.parse(request.responseText);
        window.account_name = resp_json.data.user.name;
    }

    function check() {
        for (let item of document.querySelectorAll('.client_pages_content_v2_components_articleItem')) {
            let a = item.querySelector('a');
            let a_url = new URL(a.href);
            let a_id = a_url.searchParams.get('id');
            let article = window.article_list.find(art => art.id == a_id);
            if (!article) continue;
            if (item.querySelector('.client_pages_content_v2_components_articleHint')) {
                if (!item.querySelector('.client_pages_content_v2_components_articleHint>.quality_not_pass_reason')) item.querySelector('.client_pages_content_v2_components_articleHint').innerHTML += '<span class="quality_not_pass_reason" style="color:orange;"></span>';
                item.querySelector('.quality_not_pass_reason').innerHTML = article.quality_not_pass_reason;
            }
            if (article.first_publish_at) {
                if (item.querySelector('.client_pages_content_v2_components_articleTitle .time')) {
                    let time_html = item.querySelector('.client_pages_content_v2_components_articleTitle .time').innerHTML;
                    if (time_html.indexOf('<br>') == -1) {
                        item.querySelector('.client_pages_content_v2_components_articleTitle .time').innerHTML = `${time_html}<br><div style="color:blue;display:contents;">${article.first_publish_at}</div>`;
                    }
                }
            }
            if (article.has_edited_times > 0) {
                if (item.querySelector('.client_pages_content_v2_components_data2action_commonData')) {
                    item.querySelector('.client_pages_content_v2_components_data2action_commonData').style.whiteSpace = 'nowrap';
                    if (!item.querySelector('.client_pages_content_v2_components_data2action_commonData .update_count')) {
                        let update_span = document.createElement('span');
                        update_span.classList.add('update_count');
                        update_span.style.color = 'red';
                        update_span.innerHTML = `修改了 ${article.has_edited_times} 次`;
                        item.querySelector('.client_pages_content_v2_components_data2action_commonData').insertAdjacentElement('beforeend', update_span);
                    }
                }
            }
            const subscribe_article = window.subscribe_article_order_amount_list.find(x => x.nid == article.nid);
            if (subscribe_article) {
                if (item.querySelector('.client_pages_content_v2_components_data2action_commonData')) {
                    if (!item.querySelector('.client_pages_content_v2_components_data2action_commonData .subscribe_amount')) {
                        let subscribe_amount_span = document.createElement('span');
                        subscribe_amount_span.classList.add('subscribe_amount');
                        subscribe_amount_span.style.color = 'green';
                        subscribe_amount_span.style.marginLeft = '5px';
                        subscribe_amount_span.innerHTML = `订阅量 ${subscribe_article.order_amount}`;
                        item.querySelector('.client_pages_content_v2_components_data2action_commonData').insertAdjacentElement('beforeend', subscribe_amount_span);
                    }

                }
            }
        }
    }

    setInterval(check, 5000);

    function get_account_name() {
        if (window.account_name) return;
        if (document.querySelector('.domain')) {
            window.account_name = document.querySelector('.domain').innerText.trim();
        } else if (document.querySelector('.user-name')) {
            window.acount_name = document.querySelector('.user-name').innerText.split('\n').filter(Boolean).pop().trim();
        }
    }

    function load_subscribe_order_amount_list() {
        get_account_name();
        fetch(`https://${baijiahao_apiserver}/get_subscribe_article_order_amount_list?account_name=${window.account_name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(resp_text => resp_text.json()).then(resp_json => {
            if (resp_json.success) {
                window.subscribe_article_order_amount_list = resp_json.data;
                check();
            } else {
                console.log(resp_json.error);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    window.addEventListener('load', function () {
        get_account_name();
        load_subscribe_order_amount_list();
    });

    function checkForUpdates() {
        const updateURL = GM_info.scriptUpdateURL;
        GM.xmlHttpRequest({
            method: 'GET',
            url: updateURL,
            onload: response => {
                const currentVersion = parseFloat(GM_info.script.version);
                const latestVersion = parseFloat(response.responseText.match(/@version\s+(\S+)/)[1]);
                if (latestVersion > currentVersion) {
                    GM_openInTab(updateURL + '?r=' + Math.random(), { active: false, insert: true });
                }
            }
        });
    }

    // checkForUpdates();

    // setInterval(checkForUpdates, 10000);
})();
