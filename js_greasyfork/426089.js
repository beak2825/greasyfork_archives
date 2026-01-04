   // ==UserScript==
        // @name         cauly partner
        // @namespace    http://tampermonkey.net/
        // @version      0.1
        // @description  apply offer in cauly.net
        // @author       Abiu
        // @include      https://performance.cauly.net/*
        // @icon         https://www.google.com/s2/favicons?domain=cauly.net
        // @require https://unpkg.com/vue/dist/vue.js
        // @require https://unpkg.com/element-ui/lib/index.js
        // @grant        GM_log

// @downloadURL https://update.greasyfork.org/scripts/426089/cauly%20partner.user.js
// @updateURL https://update.greasyfork.org/scripts/426089/cauly%20partner.meta.js
        // ==/UserScript==


        var pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            console.log('url changed');
            change();
            // Some event-handling function
        };
        change();

        function change() {
            const elcss = createElementFromHTML('<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">');
            document.body.appendChild(elcss);
            let app;
            const iv = setInterval(function() {
                const body = document.querySelector('api-swagger');
                if (window.location.href.indexOf('api-library') === 0) {
                    clearInterval(iv);
                }
                if (body) {
                    for (let i = 0; i <= body.children.length; i++) {
                        //body.children[0].remove()
                    }
                    body.children[0].remove()
                    body.children[0].remove()
                    body.children[2] && body.children[2].remove()
                    body.children[2] && body.children[2].remove()
                    clearInterval(iv);
                    body.appendChild(createElementFromHTML('<div id="to-insert"></div>'));

                    app = new Vue({
                        el: '#to-insert',
                        data() {
                            return {
                                tabledata: [],
                            };
                        },
                        methods: {
                            setData(data) {
                                this.tabledata = data;
                            },
                            applyOffer(row) {
                                let u = document.querySelector('input').value.replace('allCampaigns','afiliateOffer');
                                u = u + `&campaign_ids=${row.campaign_id}`;
                                fetch(u);
                            },
                        },
                        template: `
            <el-table :data="tabledata" border stripe style="width: 100%">
                <el-table-column prop="campaign_id" label="id"/>
                <el-table-column prop="campaign_name" label="name"/>
                <el-table-column prop="approval_status" label="approval_status" width="120"/>
                <el-table-column prop="country" label="country" width="100"/>
                <el-table-column prop="price" label="price" width="120"/>
                <el-table-column prop="day_cap" label="day_cap" width="100"/>
                <el-table-column prop="bundle_id" label="bundle_id"/>
                <el-table-column  label="action" >
                    <template slot-scope="scope">
                        <el-button @click="applyOffer(scope.row)">Apply</el-button>
                    </template>
                </el-table-column>

            </el-table>

        `
                    })


                }
            }, 100);
            (function() {
                console.log('replace XMLHttpRequest');
                var origOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function() {
                    // console.log('request started!', arguments);
                    try {
                        if (arguments[1] && arguments[1].indexOf("campaign/allCampaigns") == -1) {
                            origOpen.apply(this, arguments);
                            return;
                        }
                        this.addEventListener('load', function() {
                            const res = JSON.parse(this.responseText);
                            console.log(res);
                            res.result.forEach(function(row) {
                                row.price = `${row.pay.payout}/${row.pay.payout_type}`;
                                row.day_cap = row.pay.day_cap;
                                row.country = row.target.country;
                            })
                            app.setData(res.result);
                        });
                    } catch (e) {
                        console.error(e);
                    }

                    origOpen.apply(this, arguments);
                };
            })();
        }

        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();

            // Change this to div.childNodes to support multiple top-level nodes
            return div.firstChild;
        }