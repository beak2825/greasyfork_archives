// ==UserScript==
// @name         密控数据获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       iblilife@outlook.com
// @match        http://vip.mikong.com/**
// @grant        none
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require           https://cdn.jsdelivr.net/npm/vue
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/390885/%E5%AF%86%E6%8E%A7%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/390885/%E5%AF%86%E6%8E%A7%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        let pageInit = false;
        let appId = 'vue_app_' + new Date().getTime();

        // 获取门店列表内容
        let fetchShopList = (callback) => {
            $.ajax({
                type: 'get',
                url: `http://vip.mikong.com/iframepage/apppage/member_list.aspx`,
                success: (res) => {
                    if (res) {
                        let shopList = []
                        $(res).find('select#ddlcompany>option').each(function(){
                            let shopId = $(this).attr('value')
                            let shopName = $(this).text()
                            shopList.push({
                                id: shopId,
                                name: shopName
                            })
                        })
                        callback(shopList)
                    }
                }
            })
        }

        let pageLCInit = false;
        let appLCId = 'vue_app_lc_' + new Date().getTime();
        hotkeys('ctrl+shift+f,ctrl+shift+l', function (event, handler){
            if (handler.key === 'ctrl+shift+f') {
                $(`#${appLCId}`).hide();

                if (!pageInit) {
                    console.log('初始化抓取会员数据界面...');
                    let containerHtml = $(`
                      <div id="${appId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;">
                          <div style="background-color: rgba(0, 0, 0, 0.3); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                          <div style="width: 80%; margin-left: 10%; margin-top: 100px; background: #fff; z-index: 10001; position: relative; padding: 10px; border-radius: 4px; box-shadow: 0 0 32px 1px rgba(0, 0, 0, 0.4);">
                              <div style="font-size: 16px; height: 45px; line-height: 45px; border-bottom: solid 1px #ddd; padding: 0 8px;">会员数据抓取<span style="font-size: 12px; color: #aaa; margin-left: 10px;">(Power by: iblilife@outlook.com)</span></div>
                              <div style="height: 220px; padding: 10px 0;">
                                  <textarea style="width: 100%; height: 100%;" placeholder="获取会员数据成功后将在此处展示">{{memberListDataString}}</textarea>
                              </div>
                              <div>进度：{{progressRate}}% （{{progressCurrent}}/{{progressTotal}}）</div>
                              <div style="background: #eee; height: 8px; border-radius: 8px; overflow: hidden; position: relative; margin-top: 6px">
                                  <div style="position: absolute: width: 0; left: 0; height: 100%; top: 0; background: #42b983; border-radius: 8px;" :style="{ 'width': progressRate + '%' }"></div>
                              </div>
                              <div style="margin: 18px 0; text-align: right;">
                                  <div style="display: inline-block; margin-right: 18px;">
                                    <select v-model="currentShopId" style="height: 40px; line-height: 40px; padding: 0 8px; border-radius: 4px;">
                                      <option v-for="shop in shopList" :key="shop.id" :value="shop.id">{{shop.name}}</option>
                                    </select>
                                  </div>
                                  <div @click="beginFetchData" style="display: inline-block; background: #42b983; color: #fff; height: 40px; line-height: 40px; padding: 0 18px; border-radius: 4px; cursor: pointer;" :style="{ backgroundColor: progressLoading ? '#999': '#42b983' }">
                                    <span v-if="!progressLoading && !isDone">开始抓取数据</span>
                                    <span v-else-if="progressLoading && !isDone">数据抓取中，请稍后...</span>
                                    <span v-else-if="!progressLoading && isDone">恭喜，数据抓取完成！</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    `);

                    $(document.body).append(containerHtml);
                    pageInit = true;
                    // 初始化vue实例
                    new Vue({
                        el: '#' + appId,
                        data: {
                            isDone: false,
                            progressLoading: false,
                            progressCurrent:0,
                            progressTotal: 0,
                            memberListDataString: '',
                            currentShopId: '0',
                            shopList: []
                        },
                        computed: {
                            progressRate () {
                                if (this.progressTotal > 0) {
                                    return (this.progressCurrent / this.progressTotal * 100).toFixed(2);
                                }
                                return '0';
                            }
                        },
                        mounted () {
                            fetchShopList((shopList) => {
                                this.shopList = [...shopList];
                            })
                        },
                        methods: {
                            trim (str) {
                                if(str){
                                    return str.replace(/\s/g, '');
                                }
                                return str;
                            },
                            async beginFetchData () {
                                if (this.isDone || this.progressLoading) {
                                    return;
                                }
                                this.progressLoading = true;

                                // TODO: 处理开始获取的代码
                                // 获取总记录数量
                                let totalResponse = await $.ajax({
                                    type: 'get',
                                    url: 'http://vip.mikong.com/iframepage/apppage/member_list.aspx?p=1&scid=' + this.currentShopId
                                })
                                let pageTd = $(totalResponse).find('table.ntcplist td.pagerTD')
                                pageTd.find(':nth-child(n)').remove();
                                let totalMatchs = pageTd.text().match(/\d+/g)
                                let rowTotal = 0;
                                if (totalMatchs.length > 0) {
                                    rowTotal = parseInt(totalMatchs[0]);
                                }
                                this.progressTotal = rowTotal;

                                let pageSize = 0;
                                // 密控默认分页大小是50
                                if (rowTotal%50 === 0) {
                                    pageSize = rowTotal/50;
                                } else {
                                    pageSize = rowTotal/50 + 1;
                                }

                                // 循环页码获取每页数据
                                let title = '手机号码\t会员卡号\t会员姓名\t项目折扣\t卖品折扣\t会员卡名称\t余额\t欠款\t积分\t赠送金\t分期赠送金\t备注\r\n'
                                let membersData = '';

                                for (let pageIndex = 1; pageIndex <= pageSize; pageIndex++) {
                                    let pageResponse = await $.ajax({
                                        type: 'get',
                                        url: 'http://vip.mikong.com/iframepage/apppage/member_list.aspx?p=' + pageIndex + '&scid=' + this.currentShopId
                                    })
                                    let memberTRList = $(pageResponse).find('table.datalist>tbody>tr').not(':eq(0)')

                                    let trs = [];
                                    memberTRList.each(function(){
                                        trs.push($(this))
                                    })

                                    for (let j = 0; j < trs.length; j++) {
                                        let tdList = trs[j].find('>td');
                                        let phoneNumber = this.trim( $(tdList[0]).text() );
                                        let cardNumber = this.trim( $(tdList[1]).text() );
                                        let memName = this.trim( $(tdList[2]).text() );
                                        let serveDiscount = this.trim( $(tdList[3]).text() );
                                        let productDiscount = this.trim( $(tdList[4]).text() );

                                        let cardName = this.trim( $(tdList[5]).text() );
                                        let balance = this.trim( $(tdList[6]).text() );
                                        let allowBalance = this.trim( $(tdList[8]).text() ); // 欠款
                                        let point = this.trim( $(tdList[9]).text() ); // 积分

                                        // 获取赠送金、备注
                                        let detailHref = $(tdList[11]).find('>a[href^=member_kkcz]').attr('href');
                                        let detailResponse = await $.ajax({
                                            type: 'get',
                                            url: `http://vip.mikong.com/iframepage/apppage/${detailHref}`
                                        })

                                        let giftBalance = 0; // 赠送金
                                        let giftBalanceWidthMutil = 0; // 分期赠送金
                                        let remark = '';
                                        if (detailResponse) {
                                            let detail = $(detailResponse)
                                            console.log(detail.find('input[name=txbRemark]'))
                                            remark = this.trim( detail.find('input[name=txbRemark]').val() )
                                            giftBalance = this.trim( detail.find('input[name=txbZSMoney]').val() )
                                            giftBalanceWidthMutil = this.trim( detail.find('input[name=txbFQMoney]').val() )
                                        }
                                        membersData += `${phoneNumber}\t${cardNumber}\t${memName}\t${serveDiscount}\t${productDiscount}\t${cardName}\t${balance}\t${allowBalance}\t${point}\t${giftBalance}\t${giftBalanceWidthMutil}\t${remark}\r\n`;
                                        this.progressCurrent++;
                                    }
                                }
                                this.progressLoading = false;
                                this.isDone = true;

                                this.memberListDataString = title + membersData;
                            }
                        }
                    });
                } else {
                    $(`#${appId}`).toggle();
                }
                return;
            }

            if (handler.key === 'ctrl+shift+l') {
                $(`#${appId}`).hide();

                if (!pageLCInit) {
                    console.log('初始化抓取疗程数据界面...');
                    let containerHtml = $(`
                      <div id="${appLCId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;">
                          <div style="background-color: rgba(0, 0, 0, 0.3); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                          <div style="width: 80%; margin-left: 10%; margin-top: 100px; background: #fff; z-index: 10001; position: relative; padding: 10px; border-radius: 4px; box-shadow: 0 0 32px 1px rgba(0, 0, 0, 0.4);">
                              <div style="font-size: 16px; height: 45px; line-height: 45px; border-bottom: solid 1px #ddd; padding: 0 8px;">疗程数据抓取<span style="font-size: 12px; color: #aaa; margin-left: 10px;">(Power by: iblilife@outlook.com)</span></div>
                              <div style="height: 220px; padding: 10px 0;">
                                  <textarea style="width: 100%; height: 100%;" placeholder="获取会员数据成功后将在此处展示">{{memberListDataString}}</textarea>
                              </div>
                              <div>进度：{{progressRate}}% （{{progressCurrent}}/{{progressTotal}}）</div>
                              <div style="background: #eee; height: 8px; border-radius: 8px; overflow: hidden; position: relative; margin-top: 6px">
                                  <div style="position: absolute: width: 0; left: 0; height: 100%; top: 0; background: #42b983; border-radius: 8px;" :style="{ 'width': progressRate + '%' }"></div>
                              </div>
                              <div style="margin: 18px 0; text-align: right;">
                                  <div @click="beginFetchData" style="display: inline-block; background: #42b983; color: #fff; height: 40px; line-height: 40px; padding: 0 18px; border-radius: 4px; cursor: pointer;" :style="{ backgroundColor: progressLoading ? '#999': '#42b983' }">
                                    <span v-if="!progressLoading && !isDone">开始抓取数据</span>
                                    <span v-else-if="progressLoading && !isDone">数据抓取中，请稍后...</span>
                                    <span v-else-if="!progressLoading && isDone">恭喜，数据抓取完成！</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    `);

                    $(document.body).append(containerHtml);
                    pageLCInit = true;
                    // 初始化vue实例
                    new Vue({
                        el: '#' + appLCId,
                        data: {
                            isDone: false,
                            progressLoading: false,
                            progressCurrent:0,
                            progressTotal: 0,
                            memberListDataString: ''
                        },
                        computed: {
                            progressRate () {
                                if (this.progressTotal > 0) {
                                    return (this.progressCurrent / this.progressTotal * 100).toFixed(2);
                                }
                                return '0';
                            }
                        },
                        methods: {
                            Decrypt(word, key, iv) {
                                let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
                                let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
                                let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
                                let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
                                return decryptedStr.toString();
                            },
                            trim (str) {
                                if(str){
                                    return str.replace(/\s/g, '');
                                }
                                return str;
                            },
                            async beginFetchData () {
                                if (this.isDone || this.progressLoading) {
                                    return;
                                }
                                this.progressLoading = true;

                                let totalResponse = await $.ajax({
                                    type: 'get',
                                    url: 'http://vip.mikong.com/iframepage/apppage/member_ckrm.aspx'
                                });
                                let totalNav = $(totalResponse).find('#NoRecordUSpan').parent();
                                totalNav.find(':nth-child(n)').remove();
                                let totalMatchs = totalNav.text().match(/\d+/g)
                                let rowTotal = 0;
                                if (totalMatchs.length > 0) {
                                    rowTotal = parseInt(totalMatchs[0]);
                                }
                                this.progressTotal = rowTotal;

                                let pageSize = 0;
                                // 密控默认分页大小是20
                                if (rowTotal%50 === 0) {
                                    pageSize = rowTotal/20;
                                } else {
                                    pageSize = rowTotal/20 + 1;
                                }

                                // 获取解密key
                                let keyResponse = await $.ajax({
                                    type: 'get',
                                    url: 'http://vip.mikong.com/ajaxapp/commonajaxquery.ashx',
                                    data: {
                                        a: "GetEncryptKeyIV",
                                        ts: Math.random()
                                    },
                                    dataType : "json"
                                });
                                let key_val = CryptoJS.enc.Utf8.parse(keyResponse.key);
                                let key_iv = CryptoJS.enc.Utf8.parse(keyResponse.iv);

                                let title = '会员名称\t手机号码\t会员卡号\t项目名称\t来源\t剩余次数\t有效期\r\n'
                                let rowData = '';
                                for (let pageIndex = 1; pageIndex <= pageSize; pageIndex++) {
                                    let pageResponse = await $.ajax({
                                        type: 'get',
                                        url: 'http://vip.mikong.com/iframepage/apppage/member_ckrm.aspx?p=' + pageIndex
                                    });

                                    let memberTRList = $(pageResponse).find('table.table>tbody>tr')
                                    let trs = [];
                                    memberTRList.each(function(){
                                        trs.push($(this))
                                    })

                                    for (let j = 0; j < trs.length; j++) {
                                        let tdList = trs[j].find('>td');

                                        let memName = '';
                                        let cardNumber = '';
                                        let phoneNumber = this.trim( $(tdList[0]).text() );
                                        let dataMinfo = $(tdList[0]).attr('data-minfo');
                                        let dataValue = this.Decrypt(dataMinfo, key_val, key_iv); // 解密数据内容
                                        if (dataValue) {
                                            // 从中解析出 姓名卡号
                                            if (dataValue.indexOf('【') !== -1 && dataValue.split('【').length > 1) {
                                                // 存在卡号
                                                cardNumber = this.trim( dataValue.split('【')[1].replace('】', '') )
                                                memName = this.trim( dataValue.split('【')[0] )
                                            } else {
                                                memName = this.trim( dataValue );
                                            }
                                        }
                                        let serveName = this.trim( $(tdList[2]).text() );
                                        let origin = this.trim( $(tdList[3]).text() );
                                        let qty = this.trim( $(tdList[5]).text() );
                                        let dateThru = this.trim( $(tdList[6]).text() );
                                        rowData += `${memName}\t${phoneNumber}\t${cardNumber}\t${serveName}\t${origin}\t${qty}\t${dateThru}\r\n`;

                                        this.progressCurrent++;
                                    }
                                }

                                this.progressLoading = false;
                                this.isDone = true;

                                this.memberListDataString = title + rowData;
                            }
                        }
                    });
                } else {
                    $(`#${appLCId}`).toggle();
                }
                return;
            }
        });
    })
})();