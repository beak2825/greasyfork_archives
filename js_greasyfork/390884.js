// ==UserScript==
// @name         智放数据获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       iblilife@outlook.com
// @match        http://www.maywant.com/zefun/member/view/list
// @grant        none
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require           https://cdn.jsdelivr.net/npm/vue
// @downloadURL https://update.greasyfork.org/scripts/390884/%E6%99%BA%E6%94%BE%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/390884/%E6%99%BA%E6%94%BE%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
    $(function(){
        let total = totalRecord; // 总条数
        let pageInit = false;
        let appId = 'vue_app_' + new Date().getTime();
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
                    pageInit = true;
                    // 初始化vue实例
                    new Vue({
                        el: '#' + appId,
                        data: {
                            isDone: false,
                            progressLoading: false,
                            progressCurrent:0,
                            progressTotal: total,
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
                                let memberListRes = await $.ajax({
                                    type : "post",
                                    url : baseUrl + "member/serch/by/nameOrPhone",
                                    data : "pageNo=1&pageSize="+ total +"&content=&sex=全部&levelId=0&isDeleted=0",
                                    dataType : "json"
                                });
                                let list = memberListRes.msg.results;
                                let title = "姓名\t手机号码\t性别\t生日\t积分\t卡号\t会员卡类型\t开卡门店\t储值余额\t礼金余额\t项目折扣\t商品折扣\t挂账余额\t有效期\t备注\r\n"
                                let rt = '';
                                for (let member of list) {
                                    let memberData = await this.fetchMemberDetail(member.memberId);
                                    if (memberData) {
                                        rt += memberData;
                                    }
                                    this.progressCurrent++;
                                    // break;
                                }
                                this.progressLoading = false;
                                this.isDone = true;
                                this.memberListDataString = title + rt;
                            },
                            fetchMemberDetail: async function (memberId) {
                                let data = await $.ajax({
                                     type: "post",
                                     url: baseUrl + "member/action/selectByMemberDto",
                                     data: `memberId=${memberId}`,
                                     dataType: "json"
                                 })
                                 let member = data.msg.memberInfo
                                 // console.log(member);
                                 if (member) {
                                     let cards = member.subAccountDtoList || []
                                     let rt = '';
                                     cards.forEach(card => {
                                         rt += `${member.name}\t${member.phone}\t${member.sex}\t${member.birthday}\t${member.balanceIntegral}\t${card.cardNo}\t${card.levelName}\t${card.storeName}\t${card.balanceAmount}\t${card.balanceGiftmoneyAmount}\t${card.projectDiscount}\t${card.goodsDiscount}\t${card.debtAmount}\t${card.endDate ? card.endDate : ''}\t${card.remarks ? this.trim(card.remarks) : ''}\r\n`;
                                     })
                                     return rt;
                                 }
                                return false;
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