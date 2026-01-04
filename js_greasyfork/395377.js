// ==UserScript==
// @name         total_corp_knowledge
// @namespace    Virtonomica
// @version      0.01
// @description  Общая квалификация
// @author       Thunderfit
// @include        http*://*virtonomic*.*/*/main/corporation/knowledge
// @downloadURL https://update.greasyfork.org/scripts/395377/total_corp_knowledge.user.js
// @updateURL https://update.greasyfork.org/scripts/395377/total_corp_knowledge.meta.js
// ==/UserScript==

(function() {
    var total_corp_knowledge = function () {

        let tf_total_corp_knowledge =  {
            init: function () {
                this.maxCount = 16;
                this.setRealm();
                this.storageData = [];
                this.table = $('#mainContent');
                this.initEvents();

                this.rows = this.table.children('div:not(".knowledge_header, #childMenu")').not('div:first');
                this.calculate();
            },
            initEvents: function () {
                this.table.on('loadingKnowledge', this.public.bind(this));
            },
            setRealm: function (){
                this.realm = window.location.href.match(/\/(\w+)\/main\/corporation\/knowledge/)[1];
            },
            calculate: function () {
                this.rows.each(this.parse.bind(this));
            },
            parse: function (index, row) {
                let knowledgeId = $(row).find('.c_row_l').attr('id');
                this.loadStorage(knowledgeId);
            },
            public: function () {
                if (this.maxCount !== this.storageData.length) {
                    return;
                }
                let total = {};
                this.storageData.forEach(function (item, index) {
                    item.forEach(function (userData, userIndex) {

                        if (!total[userData['user_name']]) {
                            total[userData['user_name']] = {};
                            total[userData['user_name']]['user_id'] = parseInt(userData['user_id']);
                            total[userData['user_name']]['base_level'] = parseInt(userData['base_level']);
                            total[userData['user_name']]['bonus_level'] = parseInt(userData['bonus_level']);
                            total[userData['user_name']]['sum_level'] = parseInt(userData['sum_level']);
                        } else {
                            total[userData['user_name']]['base_level'] += parseInt(userData['base_level']);
                            total[userData['user_name']]['bonus_level'] += parseInt(userData['bonus_level']);
                            total[userData['user_name']]['sum_level'] += parseInt(userData['sum_level']);
                        }
                    });
                });
                let realm = this.realm;
                let html = $('<div>');
                $.each(total, function(userName, userData) {
                    let container = $('<div class="c_row_l">');
                        container
                            .append('<span class="c_small">')
                            .append('<span class="c_small">')
                            .append('<span class="c_name_l">&nbsp;&nbsp;<a href="/' + realm + '/main/user/view/' + userData.user_id + '">' + userName + '</a></span>')
                            .append('<span class="c_gen">' + sayNumber(userData.base_level) + '</span>')
                            .append('<span class="c_gen">' + sayNumber(userData.bonus_level) + '</span>')
                            .append('<span class="c_gen">' + sayNumber(userData.sum_level) + '</span>')
                            .append('<span class="c_gen progress"></span>')
                            .append('<span class="c_gen progress_delta"></span>')
                    ;
                    html.append(container);
                })


                this.table
                    .append('<div class="knowledge_header">Итого</div>')
                    .append(html)
                ;

            },
            loadStorage: function (knowledgeId) {

                let realm = this.realm;
                $.ajax({
                    url: '/' + realm + '/ajax/report/company/knowledge_by_alliance/' + knowledgeId,
                    type: 'GET',
                    dataType: 'json',
                    success: this.successLoadCallback.bind(this)
                });

            },
            successLoadCallback: function (data) {
                this.storageData.push(data);
                this.table.trigger('loadingKnowledge');
            }
        }
        tf_total_corp_knowledge.init();
    }

    if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + total_corp_knowledge.toString() + ')();';
    document.documentElement.appendChild(script);
    }
})();