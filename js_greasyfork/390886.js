// ==UserScript==
// @name         盛传数据获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.meiguanjia.net/**
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require           https://cdn.jsdelivr.net/npm/vue
// @downloadURL https://update.greasyfork.org/scripts/390886/%E7%9B%9B%E4%BC%A0%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/390886/%E7%9B%9B%E4%BC%A0%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
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
                url: `${location.protocol}//${location.host}/shair/shopAchiStat!shopAchi.action?set=manage&r=${Math.random()}`,
                success: (res) => {
                    if (res) {
                        let shopList = []
                        $(res).find('div.page_selector_container>dl>dd>div.item>div.shop').each(function(){
                            let shopId = $(this).attr('data-val')
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

        hotkeys('ctrl+shift+f', function (event, handler){
            if (handler.key === 'ctrl+shift+f') {
                if (!pageInit) {
                    console.log('开始初始化抓取数据界面...');
                    let containerHtml = $(`
                      <div id="${appId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;">
                          <div style="background-color: rgba(0, 0, 0, 0.3); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                          <div style="width: 80%; margin-left: 10%; margin-top: 100px; background: #fff; z-index: 10001; position: relative; padding: 10px; border-radius: 4px; box-shadow: 0 0 32px 1px rgba(0, 0, 0, 0.4);">
                              <div style="font-size: 16px; height: 45px; line-height: 45px; border-bottom: solid 1px #ddd; padding: 0 8px;">会员数据抓取<span style="font-size: 12px; color: #aaa; margin-left: 10px;">(Power by: iblilife@outlook.com)</span></div>
                              <div style="height: 220px; padding: 10px 0;">
                                  <textarea style="width: 100%; height: 100%;" placeholder="获取会员数据成功后将在此处展示">{{memberListDataString}}</textarea>
                              </div>
                              <div style="width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                进度：{{progressRate}}% （{{progressCurrent}}/{{progressTotal}}）&nbsp;&nbsp;
                                <span style="color: #888;">{{progressCurrentDes}}</span>
                                <span v-if="leftTimeFomart" style="color: red; float: right;">估计剩余时间: {{leftTimeFomart}}</span>
                               </div>
                              <div style="background: #eee; height: 8px; border-radius: 8px; overflow: hidden; position: relative; margin-top: 6px">
                                  <div style="position: absolute: width: 0; left: 0; height: 100%; top: 0; background: #42b983; border-radius: 8px;" :style="{ 'width': progressRate + '%' }"></div>
                              </div>
                              <div style="margin: 18px 0; text-align: right;">
                                  <div style="display: inline-block; margin-right: 18px;" v-if="shopList.length > 0">
                                    <select v-model="currentShopId" style="height: 40px; line-height: 40px; padding: 0 8px; border-radius: 4px;" :disabled="progressLoading">
                                      <option value="">请选择拉取数据门店</option>
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
                            shopList: [],
                            currentShopId: '',
                            progressCurrentDes: '',
                            beginTime: 0, // 开始拉取时间毫秒数
                            leftTimeFomart: ''
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
                            // 获取门店列表
                            fetchShopList((shopList) => {
                                this.shopList = [...shopList]
                            })
                        },
                        watch: {
                            progressCurrent (val) {
                                if (val === 0 || this.progressTotal === 0) {
                                    return;
                                }
                                let timeTotal = new Date().getTime() - this.beginTime
                                let timeUnit = timeTotal/val

                                if (this.progressTotal === val) {
                                    return '' // 已完成
                                }

                                let secTotal = parseInt((this.progressTotal - val) * timeUnit / 1000); // 单位: 秒

                                let rt = ''

                                if (secTotal >= 60) {
                                    let minutes = parseInt(secTotal/60.0)
                                    if (minutes >= 60) {
                                        let hours = parseInt(minutes/60.0)
                                        rt = `${hours}时${minutes%60}分${secTotal%60}秒`
                                    } else {
                                        rt = `${minutes}分${secTotal%60}秒`
                                    }
                                } else {
                                    rt = `${secTotal}秒`
                                }
                                this.leftTimeFomart = rt
                            }
                        },
                        methods: {
                            trim (str) {
                                if(str){
                                    return str.replace(/\s/g, '');
                                }
                                return str;
                            },
                            sleep (val) {
                                return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        resolve();
                                    }, val);
                                });
                            },
                            async beginFetchData () {
                                if (!this.currentShopId && this.shopList.length > 0) {
                                    alert('请选择需要拉取数据的门店');
                                    return;
                                }
                                if (this.isDone || this.progressLoading) {
                                    return;
                                }
                                this.progressLoading = true;

                                this.progressCurrentDes = '获取店面下会员数据量...';
                                let total = 0;
                                try {
                                    let pageTotalResponse = await $.ajax({
                                        type: 'post',
                                        url: `${location.protocol}//${location.host}/shair/memberInfo!memberlist.action?set=manage&memberForm.isAdvancedQuery=0&memberForm.shopid=${this.currentShopId}`
                                    });
                                    let totalText = $(pageTotalResponse).find('div#page>span.height-large:eq(0)').text()
                                    let totalMatchs = totalText.match(/\d+/g)
                                    if (totalMatchs.length > 0) {
                                        total = parseInt(totalMatchs[0]);
                                    }
                                    this.progressTotal = total
                                } catch (e) {
                                    console.log('error:', e);
                                    this.progressCurrentDes = '获取店面下会员数据总量失败！！！请检查...'
                                    this.progressLoading = false;
                                    this.isDone = true;
                                    return;
                                }

                                let pageSize;
                                if (total%30 === 0) {
                                  pageSize = total/30;
                                } else {
                                  pageSize = total/30 + 1;
                                }

                                this.beginTime = new Date().getTime();

                                let title = '手机号码\t姓名\t性别\t注册日期\t卡号\t卡名称\t卡类型\t折扣\t卡内余额\t卡内次数\t赠送余额\t失效日期\t积分\t欠款\t卡备注\t用户备注\t生日\r\n';
                                let memberAllRT = '';
                                for (let pageIndex = 1; pageIndex <= pageSize; pageIndex++) {
                                    try {
                                        this.progressCurrentDes = `页码: ${pageIndex} 请求会员数据...`
                                        let memberListResponse = await $.ajax({
                                            type: 'post',
                                            url: `${location.protocol}//${location.host}/shair/memberInfo!memberlist.action?set=manage&memberForm.isAdvancedQuery=0&memberForm.shopid=${this.currentShopId}&page.rpp=30&page.currNum=${pageIndex}`
                                        });
                                        this.progressCurrentDes = `页码: ${pageIndex} 会员数据获取成功开始解析...`
                                        let trList = $(memberListResponse).find('table#content_table>tbody>tr');
                                        this.progressCurrentDes = `页码: ${pageIndex} 会员数据获取成功开始解析，当前页会员数量${trList.length}...`
                                        let trObjList = [];
                                        trList.each(function(){
                                            trObjList.push($(this))
                                        })

                                        let _this = this;
                                        for (let j = 0; j < trObjList.length; j++) {
                                            let tdTags = trObjList[j].find(">td");
                                            let userId = $(tdTags[6]).attr("id").replace('date', '');
                                            let tableTrTags = $(tdTags[7]).find("table>tbody>tr");
                                            let points = _this.trim( $(tdTags[9]).find(">input").val() ).replace('分', '');
                                            let tableTrTagObjs = []
                                            tableTrTags.each(function(){
                                                tableTrTagObjs.push($(this));
                                            });

                                            for (let k = 0; k < tableTrTagObjs.length; k++) {
                                                let subTdTags = tableTrTagObjs[k].find(">td");
                                                if (subTdTags.length <= 5) {
                                                    continue;
                                                }
                                                let cardId = tableTrTagObjs[k].attr("id").replace('cardtr', '');
                                                let phoneNumber = _this.trim( $(tdTags[1]).find(">a").text() ); // 手机号码
                                                let userName = _this.trim( $(tdTags[2]).find(">span").text() ); // 姓名
                                                let sex = _this.trim( $(tdTags[3]).text() ); // 性别
                                                let registerDate = _this.trim( $(tdTags[5]).text() ); // 注册日期
                                                let cardNumber = _this.trim( $(subTdTags[0]).find(">a").text() ); // 卡号
                                                let cardName = _this.trim( $(subTdTags[1]).text() ); // 卡名称
                                                let cardType = _this.trim( $(subTdTags[2]).text() ); // 卡类型
                                                let cardDis = _this.trim( $(subTdTags[3]).text() );// 折扣
                                                let cardAmountAndQtyTxt = _this.trim( $(subTdTags[6]).text() ); // 卡内余额/次数
                                                let cardAmount = '';
                                                let cardQty = '';

                                                this.progressCurrentDes = `页码: ${pageIndex}, 处理会员[${userName}-${cardName}]的基本信息`
                                                if (cardAmountAndQtyTxt.indexOf('元余:') != -1) {
                                                    let strs = cardAmountAndQtyTxt.split('元余:');
                                                    cardAmount = strs[0];
                                                    cardQty = strs.length >=1 ? strs[1].replace('次', '') : '0';
                                                } else {
                                                    cardAmount = cardAmountAndQtyTxt.replace('元', '');
                                                    cardQty = '0';
                                                }
                                                let cardAmount1 = _this.trim( $(subTdTags[7]).text() ).replace('元', ''); // 赠送余额
                                                let loseDate = _this.trim( $(subTdTags[8]).text() ); // 失效日期

                                                // 获取欠款数据
                                                // http://vip1.meiguanjia.net/shair/memberArchives!debtlist.action?id=63432639&shopid=10620
                                                let sumArrearsAmount = 0;
                                                try {
                                                    this.progressCurrentDes = `页码: ${pageIndex}, 处理会员[${userName}-${cardName}]的欠款信息`
                                                    let arrearResponse = await $.ajax({
                                                        type: 'get',
                                                        url:`${location.protocol}//${location.host}/shair/memberArchives!debtlist.action?id=${userId}&shopid=${_this.currentShopId}`
                                                    });
                                                    let tdTagTemps = $(arrearResponse).find("table.table.table-striped.table-hover.table_fixed_head>tbody>tr").find(">td:eq(6)");
                                                    tdTagTemps.each(function(){
                                                        let amountText = _this.trim($(this).text());
                                                        let amountTemp = parseFloat(amountText);
                                                        if(!isNaN(amountTemp)){
                                                            sumArrearsAmount += amountTemp;
                                                        }
                                                    });
                                                } catch (e1) {
                                                    console.log('获取用户[' + userName + ']欠款数据失败', e1)
                                                }
                                                await _this.sleep(1500); // 暂停1.5秒

                                                // 获取用户备注
                                                // http://vip1.meiguanjia.net/shair/memberArchives!editMember.action?id=248062020&shopid=138755&flag=2&dickey=1
                                                // http://vip1.meiguanjia.net/shair/memberArchives!editMember.action?id=248062020&shopid=138755&flag=2&dickey=1
                                                let cardCommon = '';
                                                let userCommon = '';
                                                let birthday = '';
                                                try {
                                                    this.progressCurrentDes = `页码: ${pageIndex}, 处理会员[${userName}-${cardName}]的备注生日信息`
                                                    let remarkResponse = await $.ajax({
                                                        type: 'get',
                                                        url:`${location.protocol}//${location.host}/shair/memberArchives!editMember.action?id=${cardId}&shopid=${_this.currentShopId}&flag=2&dickey=1`
                                                    });
                                                    let $data = $(remarkResponse);
                                                    let inputTag = $data.find('#edit_form input[name="memberForm.cardRemark"]');
                                                    let userCommonTag = $data.find('#edit_form input[name="member.page"]');
                                                    let birthdayTag = $data.find('#edit_form input[name="memberForm.birthday"]');
                                                    cardCommon = _this.trim(inputTag.val());
                                                    userCommon = _this.trim(userCommonTag.val());
                                                    birthday = _this.trim(birthdayTag.val());
                                                } catch (e2) {
                                                    console.log('获取用户[' + userName + ']备注&生日数据失败', e2)
                                                }
                                                await _this.sleep(1500); // 暂停1.5秒

                                                memberAllRT += `${phoneNumber}\t${userName}\t${sex}\t${registerDate}\t${cardNumber}\t${cardName}\t${cardType}\t${cardDis}\t${cardAmount}\t${cardQty}\t${cardAmount1}\t${loseDate}\t${points}\t${sumArrearsAmount}\t${cardCommon}\t${userCommon}\t${birthday}\r\n`
                                                // 积分只保留一份
                                                points = '0';
                                            }

                                            _this.progressCurrent++;
                                        }
                                    } catch (e) {
                                        console.log('获取会员分页数据出错，pageIndex: ' + pageIndex, e)
                                    }
                                    await this.sleep(1500); // 暂停1.5秒
                                }
                                this.progressLoading = false;
                                this.isDone = true;
                                this.progressCurrentDes = '';
                                this.memberListDataString = title + memberAllRT;
                            }
                        }
                    });

                } else {
                    $(`#${appId}`).toggle();
                }
            }
        });
    })
})();