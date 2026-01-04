// ==UserScript==
// @name         TEMUHOOK
// @namespace    SAN
// @version      1.1
// @description  TEMUHOOK 提交
// @author       XIAOSAN
// @match        *://seller.kuajingmaihuo.com/*

// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.min.js

// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.9.1/dist/index.full.min.js
// @resource     ELEMENT_CSS https://unpkg.com/element-plus@2.3.12/dist/index.css

// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527299/TEMUHOOK.user.js
// @updateURL https://update.greasyfork.org/scripts/527299/TEMUHOOK.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    // 引入UI的CSS
    const elementPlusCss = GM_getResourceText("ELEMENT_CSS");
    GM_addStyle(elementPlusCss);
  
    // 自定义CSS
    GM_addStyle(`
          #vueApp{
              position: fixed;
              top: 50%;
              right: 30px;
              z-index: 99999;
          }
          #vueApp .fix-tabs{
              display: flex;
              flex-direction: column-reverse;
          }
          #vueApp .logBox{
              margin-bottom: 20px;
              max-height: 300px;
              overflow: auto;
          }
          #vueApp .process-progress{
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 10px;
              justify-content: space-between;
              align-items: center;
          }
          .is-blockPopUps [data-testid="beast-core-modal-mask"],
          .is-blockPopUps [data-testid="beast-core-modal"]{
              display: none !important;
          }
      `);
  
    // HTML模板
    let appHtml = `
          <div id="vueApp">
              <el-button type="info" @click="settingDrawer = true">面板</el-button>
  
              <el-drawer v-model="settingDrawer" title="设置面板" :with-header="false">
  
                  <el-tabs type="border-card" class="fix-tabs">
  <!--                     <el-tab-pane label="全局">
                          <el-form :model="configSetting" label-width="auto">
                              <el-form-item label="隐藏弹窗">
                                  <el-switch v-model="configSetting.blockPopUps" :disabled="fetchState" />
                              </el-form-item>
                              <el-form-item label="页面大小">
                                  <el-input v-model="configSetting.pageSize" :disabled="fetchState" />
                              </el-form-item>
                              <el-form-item label="起始页码">
                                  <el-input v-model="configSetting.pageNum" :disabled="fetchState" />
                              </el-form-item>
                              <el-form-item label="自动翻页">
                                  <el-switch v-model="configSetting.autoPage" :disabled="fetchState" />
                              </el-form-item>
                              <el-form-item label="等待时间">
                                  <el-input v-model="configSetting.waitSeconds" :disabled="fetchState" />
                              </el-form-item>
                          </el-form>
                      </el-tab-pane> -->
  <!--                     <el-tab-pane label="上新生命周期">
                          <el-form :model="configSetting" label-width="auto">
                              <el-table :data="configSetting.abandonPriceRule" style="width: 100%">
                                  <el-table-column label="≥价格(分)">
                                      <template #default="scope">
                                          <el-input-number v-model="scope.row.price" :min="0" :precision="0" :disabled="fetchState" controls-position="right" />
                                      </template>
                                  </el-table-column>
                                  <el-table-column label="≤放弃价格(分)">
                                      <template #default="scope">
                                          <el-input-number v-model="scope.row.abandonPrice" :min="0" :precision="0" :disabled="fetchState" controls-position="right" />
                                      </template>
                                  </el-table-column>
                                  <el-table-column label="" width="100">
                                      <template #default="scope">
                                          <el-button size="small" type="danger" @click="SMZQ_abandonPriceRuleDelete(scope.$index, scope.row)" :disabled="fetchState">
                                          Delete
                                          </el-button>
                                      </template>
                                  </el-table-column>
                              </el-table>
                              <div style="margin-top: 30px;">
                                  <el-button type="info" @click="SMZQ_abandonPriceRuleAdd">添加放弃规则</el-button>
                              </div>
                          </el-form>
                      </el-tab-pane> -->
                      <el-tab-pane label="活动报名">
                          <el-form :model="configSetting" label-width="auto">
                              <el-table :data="configSetting.activityPriceRule" style="width: 100%">
                                  <el-table-column label="价格(分)">
                                      <template #default="scope">
                                          <el-input-number v-model="scope.row.price" :min="0" :precision="0" :disabled="fetchState" controls-position="right" />
                                      </template>
                                  </el-table-column>
                                  <el-table-column label="最高价格(分)">
                                      <template #default="scope">
                                          <el-input-number v-model="scope.row.maxPirce" :min="0" :precision="0" :disabled="fetchState" controls-position="right" />
                                      </template>
                                  </el-table-column>
                                  <el-table-column label="" width="100">
                                      <template #default="scope">
                                          <el-button size="small" type="danger" @click="HDSB_activityPirceDelete(scope.$index, scope.row)" :disabled="fetchState">
                                          Delete
                                          </el-button>
                                      </template>
                                  </el-table-column>
                              </el-table>
                              <div style="margin-top: 30px;">
                                  <el-button type="info" @click="HDSB_activityPirceAdd" :disabled="configSetting.activityPriceRule.length > 0">添加金额规则</el-button>
                              </div>
                          </el-form>
                      </el-tab-pane>
                  </el-tabs>
  
                  <div style="margin-top: 30px;" v-if="malInfoList.length">
                      <el-radio-group v-model="configSetting.mallId">
                          <el-radio v-for="item in malInfoList" :key="item.mallId" :value="item.mallId" :disabled="fetchState">{{item.mallName}}</el-radio>
                      </el-radio-group>
                  </div>
  
                  <div style="margin-top: 30px;">
                      <el-button type="info" @click="dialogLogVisible = true">日志</el-button>
                  <div>
  
  
                  <div style="margin-top: 30px;" v-if="getUserInfoState && configSetting.mallId && !fetchState">
  <!--                     <el-button type="info" @click="handleClick('上新生命周期')">上新生命周期</el-button>
  
                      <el-button type="info" @click="handleClick('批量签署JIT规则')">批量签署JIT规则</el-button> -->
  
                      <el-button  @click="handleClick('批量活动申报')">批量活动申报</el-button>
                  </div>
  
              </el-drawer>
  
              <el-dialog v-model="dialogLogVisible" :title="'日志: ' + clickState" destroy-on-close>
                  <template v-if="clickState == '上新生命周期'">
                      <div class="logBox" v-if="logList.length">
                          <ul>
                              <li v-for="item in logList">
                                  {{item.text}}
                              </li>
                          </ul>
                      </div>
                      <template v-if="logInfo.totals > 0">
                          <div><el-progress :percentage="Number((logInfo.index / logInfo.totals * 100).toFixed(2))" /></div>
                          <div class="process-progress"><span>SKC: {{logInfo.text}}</span><span>{{logInfo.index}}/{{logInfo.totals}}</span></div>
                      </template>
                  </template>
                  <template v-if="clickState == '批量签署JIT规则'">
                      <div class="logBox" v-if="logList.length">
                          <ul>
                              <li v-for="item in logList">
                                  {{item.text}}
                              </li>
                          </ul>
                      </div>
                  </template>
                  <template v-if="clickState == '批量活动申报'">
                      <div class="logBox" v-if="logList.length">
                          <ul>
                              <li v-for="item in logList">
                                  {{item.text}}
                              </li>
                          </ul>
                      </div>
                  </template>
              </el-dialog>
          </div>
      `;
    let vueEl = document.createElement("div");
    vueEl.innerHTML = appHtml;
    document.body.append(vueEl);
    console.log(GM_getValue("configSetting"));
    const App = {
      data() {
        return {
          settingDrawer: false,
          dialogLogVisible: false,
          configSetting: Object.assign(
            {
              Cookie: "",
              blockPopUps: false,
              pageSize: 50,
              pageNum: 1,
              autoPage: true,
              waitSeconds: 5,
              abandonPriceRule: [],
              activityPriceRule: [],
            },
            GM_getValue("configSetting"),
            { Cookie: document.cookie }
          ),
          getUserInfoState: false,
          clickState: "",
          fetchState: false,
          malInfoList: [],
          logList: [],
          logInfo: {
            index: 0,
            totals: 0,
            text: "",
          },
        };
      },
      mounted() {
        this.$nextTick(() => {
          this.getUserInfo();
          const body = unsafeWindow.document.body;
          if (this.configSetting.blockPopUps) {
            body.classList.add("is-blockPopUps");
          }
          this.configSetting;
        });
      },
      methods: {
        /**
         * 获取商品
         * @param {*}pageToken 下一页token
         * @returns
         */
        HDSB_getMatch: function (pageToken) {
          const configSetting = this.configSetting;
          const urlParams = new URLSearchParams(window.location.search);
  
          let type = urlParams.get("type");
          let thematicId = urlParams.get("thematicId");
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/scroll/match";
  
          // pageSize = typeof pageSize == "undefined" ? configSetting.pageSize : pageSize;
          // 定义要发送的数据
          const data = {
            activityThematicId: thematicId * 1,
            activityType: type * 1,
            addSite: true,
            rowCount: 50,
          };
          if (pageToken) {
            data["searchScrollContext"] = pageToken;
          }
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
        HDSB_submit: async function (productList) {
          const configSetting = this.configSetting;
          const urlParams = new URLSearchParams(window.location.search);
          const url =
            "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/submit";
          let type = urlParams.get("type");
          let thematicId = urlParams.get("thematicId");
          const data = {
            activityThematicId: thematicId,
            activityType: type,
            productList: productList,
          };
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
        /**
         * 等待时间
         * @param {*} seconds 秒
         * @returns
         */
        waitSeconds: function (seconds) {
          return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        },
  
        /**
         * 获取用户信息
         */
        getUserInfo: function () {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/bg/quiet/api/mms/userInfo";
          // 定义要发送的数据
          const data = {};
          // 使用fetch API发起POST请求
          fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("getUserInfo: ", data);
              console.log("configSetting: ", configSetting);
              if (data.success) {
                this.malInfoList = data.result.companyList[0].malInfoList;
                this.getUserInfoState = true;
              } else {
                console.warn(`获取用户信息失败: ${data.errorMsg}`);
              }
            })
            .catch((error) => {
              console.error("获取用户信息失败: ", error); // 打印错误信息
            }); // 解析JSON响应
        },
  
        /**
         * 新生命周期-添加价格规则
         */
        SMZQ_abandonPriceRuleAdd: function () {
          this.configSetting.abandonPriceRule.push({
            price: 0,
            abandonPrice: 0,
          });
        },
  
        /**
         * 新生命周期-删除价格规则
         */
        SMZQ_abandonPriceRuleDelete: function (index, data) {
          this.configSetting.abandonPriceRule.splice(index, 1);
        },
  
        /**
         * 新生命周期-判断是否放弃
         */
        SMZQ_isAbandonPriceRule: function (supplyPrice, suggestSupplyPrice) {
          let isAbandon = false;
  
          for (
            let index = 0;
            index < this.configSetting.abandonPriceRule.length;
            index++
          ) {
            let curRule = this.configSetting.abandonPriceRule[index];
            if (
              supplyPrice >= curRule.price &&
              suggestSupplyPrice <= curRule.abandonPrice
            ) {
              isAbandon = true;
              break;
            }
          }
  
          return isAbandon;
        },
  
        /**
         * 新生命周期-获取上新生命周期的价格申报中列表
         * @returns
         */
        SMZQ_searchForChainSupplier: function (pageNum, pageSize) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/xmen/select/searchForChainSupplier";
  
          pageSize =
            typeof pageSize == "undefined" ? configSetting.pageSize : pageSize;
          // 定义要发送的数据
          const data = {
            pageSize: pageSize,
            pageNum: pageNum,
            secondarySelectStatusList: [7],
            supplierTodoTypeList: [],
          };
  
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 新生命周期-请求价格信息
         * @param {*} orderId 订单id
         * @returns
         */
        SMZQ_rejectRemark: function (orderId) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/gmp/bg/magneto/api/price-review-order/no-bom/reject-remark";
          // 定义要发送的数据
          const data = {
            orderId: orderId,
          };
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 新生命周期-放弃报价
         * @param {*} priceOrderId
         * @returns
         */
        SMZQ_reviewNoBom: function (priceOrderId) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/gmp/bg/magneto/api/price-review-order/no-bom/review";
          // 定义要发送的数据
          const data = {
            priceOrderId: priceOrderId,
          };
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 新生命周期-讨价还价
         * @param {*} postData
         * @returns
         */
        SMZQ_bargainNoBom: function (postData) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/magneto/price/bargain-no-bom";
  
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(postData), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 批量活动申报-匹配提交数据
         */
        HDSB_match_procution_data: function (data) {
          const configSetting = this.configSetting;
          const price = configSetting.activityPriceRule[0].price;
          const maxPirce = configSetting.activityPriceRule[0].maxPirce;
          const _Vue = this;
          _Vue.fetchState = true;
          _Vue.logList = [];
          let matchList = data;
          let productList = [];
          matchList.forEach((value) => {
            let productList_item = {
              productId: value.productId,
              activityStock: value.targetActivityStock,
              skcList: [],
              sessionIds: value.suggestEnrollSessionIdList,
            };
            value.skcList.forEach((val) => {
              let skcList = {
                skcId: val.skcId,
                skuList: [],
              };
              if (val.sitePriceList) {
                //外层存在sitePriceList
                skcList["siteActivityPriceList"] = (
                  val.sitePriceList ? val.sitePriceList : []
                )
                  .filter((v) => v.suggestActivityPrice >= price)
                  .map((v) => {
                    let activityPrice =
                      v.suggestActivityPrice > maxPirce
                        ? maxPirce
                        : v.suggestActivityPrice;
                    _Vue.logList.push({
                      text: `${value.productId}---价格 ${v.suggestActivityPrice}=>${activityPrice}`,
                    });
                    return { activityPrice: activityPrice, siteId: v.siteId };
                  });
                skcList["skuList"] = val.skuList.map((v) => ({
                  skuId: v.skuId,
                }));
                if (skcList.siteActivityPriceList.length) {
                  productList_item.skcList.push(skcList);
                }
              } else {
                val.skuList.forEach((v) => {
                  let sku_item = {
                    skuId: v.skuId,
                    siteActivityPriceList: v.sitePriceList
                      .filter((j) => j.suggestActivityPrice >= price)
                      .map((j) => {
                        let activityPrice =
                          j.suggestActivityPrice > maxPirce
                            ? maxPirce
                            : j.suggestActivityPrice;
                        _Vue.logList.push({
                          text: `${value.productId}---价格 ${j.suggestActivityPrice}=>${activityPrice}`,
                        });
                        return {
                          activityPrice: activityPrice,
                          siteId: j.siteId,
                        };
                      }),
                  };
                  if (sku_item.siteActivityPriceList.length) {
                    skcList.skuList.push(sku_item);
                  }
                });
                if (skcList.skuList.length) {
                  productList_item.skcList.push(skcList);
                }
              }
            });
            if (productList_item.skcList.length) {
              productList.push(productList_item);
            }
          });
          return productList;
        },
        /**
         * 批量活动申报
         */
        HDSB_execute: async function () {
          const configSetting = this.configSetting;
          const waitSeconds = this.waitSeconds;
          const _Vue = this;
          _Vue.fetchState = true;
          _Vue.logList = [];
          let hasMore = true;
          let pageToken = null;
          do {
            let res = await this.HDSB_getMatch(pageToken);
            if (res.success) {
              let matchList = res.result.matchList;
              hasMore = res.result.hasMore;
              pageToken = hasMore ? res.result.searchScrollContext : null;
              _Vue.logList.push({
                text: `服务器返回数据成功, 共${matchList.length}条数据`,
              });
              let productList = this.HDSB_match_procution_data(matchList);
              if (productList.length) {
                let result = await this.HDSB_submit(productList);
                if (result.success) {
                  _Vue.logList.push({
                    text: `活动申报成功,该页总归申报${productList.length}个`,
                  });
                } else {
                  _Vue.logList.push({
                    text: `活动申报失败`,
                  });
                  console.warn(`活动申报失败: ${data.errorMsg}`);
                }
              } else {
                _Vue.logList.push({
                  text: `该页没有符合条件的数据`,
                });
              }
            } else {
              _Vue.logList.push({
                text: `获取商品信息失败`,
              });
              console.warn(`获取商品信息失败: ${data.errorMsg}`);
            }
            _Vue.logList.push({
              text: `等待${configSetting.waitSeconds}秒请求....`,
            });
            await waitSeconds(configSetting.waitSeconds);
          } while (hasMore);
          _Vue.fetchState = false;
          _Vue.logList.push({
            text: `全部处理完成`,
          });
        },
        /**
         * 批量申报价格
         */
        SMZQ_execute: async function () {
          const configSetting = this.configSetting;
          const waitSeconds = this.waitSeconds;
          const getDataList = this.SMZQ_searchForChainSupplier;
          const rejectRemark = this.SMZQ_rejectRemark;
          const isAbandonPriceRule = this.SMZQ_isAbandonPriceRule;
          const reviewPrice = this.SMZQ_reviewNoBom;
          const revisePrice = this.SMZQ_bargainNoBom;
  
          const _Vue = this;
          _Vue.fetchState = true;
          _Vue.logList = [];
          _Vue.logInfo = {
            index: -1,
            totals: 0,
            text: "",
          };
  
          let maxPage = 0;
          let curPageIndex = configSetting.pageNum;
  
          if (configSetting.autoPage) {
            await getDataList(1, 1)
              .then((data) => {
                console.log("getDataList(1,1): ", data);
                if (data.success) {
                  maxPage = Math.ceil(data.result.total / configSetting.pageSize);
                } else {
                  _Vue.logList.push({
                    text: `获取商品信息失败`,
                  });
                  console.warn(`获取商品信息失败: ${data.errorMsg}`);
                }
              })
              .catch((error) => {
                console.error("获取商品信息失败: ", error); // 打印错误信息
              });
          }
  
          let arrDataList = [];
          do {
            _Vue.logList.push({
              text: `等待${configSetting.waitSeconds}秒请求: 发送请求第${curPageIndex}页`,
            });
            await waitSeconds(configSetting.waitSeconds);
            arrDataList.push(getDataList(curPageIndex));
  
            curPageIndex++;
            if (curPageIndex > maxPage) {
              _Vue.logList.push({
                text: `请求商品列表结束,等待服务器返回数据`,
              });
            }
          } while (curPageIndex <= maxPage);
  
          Promise.all(arrDataList)
            .then(async (resource) => {
              let dataList = [];
              resource.forEach((element) => {
                if (element.success) {
                  dataList.push(...element.result.dataList);
                }
              });
              _Vue.logList.push({
                text: `服务器返回数据成功, 共${dataList.length}条数据`,
              });
              console.log(dataList);
  
              // 循环处理数据
              for (let i = 0; i < dataList.length; i++) {
                const curData = dataList[i];
  
                for (let j = 0; j < curData.skcList.length; j++) {
                  const curSkc = curData.skcList[j];
  
                  _Vue.logInfo = {
                    index: i,
                    totals: dataList.length,
                    text: curSkc.skcId,
                  };
  
                  _Vue.logList.push({
                    text: `正在处理SKC: ${curSkc.skcId}`,
                  });
  
                  for (
                    let m = 0;
                    m < curSkc.supplierPriceReviewInfoList.length;
                    m++
                  ) {
                    const curSupplier = curSkc.supplierPriceReviewInfoList[m];
  
                    /**
                     * status
                     * 0 价格申报中
                     * 1 待卖家确认
                     */
                    const curStatus = curSupplier.status;
  
                    if (curStatus == 0) {
                      _Vue.logList.push({
                        text: `跳过: 价格申报中`,
                      });
                      continue;
                    }
  
                    let IsChangePrice = true;
                    let curSuggestSupplyPrice = 0;
  
                    _Vue.logList.push({
                      text: `等待${configSetting.waitSeconds}秒请求: 价格推荐信息`,
                    });
                    await waitSeconds(configSetting.waitSeconds);
                    _Vue.logList.push({
                      text: `正在请求: 价格推荐信息`,
                    });
                    await rejectRemark(curSupplier.priceOrderId)
                      .then((data) => {
                        console.log("rejectRemark: ", data);
  
                        if (data.success) {
                          if (
                            isAbandonPriceRule(
                              data.result.supplyPrice,
                              data.result.suggestSupplyPrice
                            )
                          ) {
                            IsChangePrice = false;
                            curSuggestSupplyPrice =
                              data.result.suggestSupplyPrice;
                          }
                        } else {
                          console.warn(`获取拒绝信息失败: ${data.errorMsg}`);
                        }
                      })
                      .catch((error) => {
                        console.error("获取拒绝信息失败: ", error); // 打印错误信息
                      });
  
                    if (!IsChangePrice) {
                      _Vue.logList.push({
                        text: `商品的推荐价格是${curSuggestSupplyPrice}`,
                      });
                      _Vue.logList.push({
                        text: `等待${configSetting.waitSeconds}秒请求: 放弃当前商品`,
                      });
                      await waitSeconds(configSetting.waitSeconds);
                      _Vue.logList.push({
                        text: `正在请求: 放弃当前商品`,
                      });
                      await reviewPrice(curSupplier.priceOrderId)
                        .then((data) => {
                          console.log("reviewPrice: ", data);
  
                          if (data.success) {
                            _Vue.logList.push({
                              text: `放弃成功`,
                            });
                          } else {
                            _Vue.logList.push({
                              text: `放弃失败`,
                            });
                            console.warn(`放弃失败: ${data.errorMsg}`);
                          }
                        })
                        .catch((error) => {
                          console.error("放弃失败: ", error); // 打印错误信息
                        });
  
                      continue;
                    }
  
                    let postData = {
                      supplierResult: 2,
                      priceOrderId: curSupplier.priceOrderId,
                      items: [],
                      bargainReasonList: [
                        {
                          componentList: [
                            {
                              type: 2,
                              detail: {
                                value: "应与底板同价",
                              },
                            },
                          ],
                        },
                      ],
                    };
  
                    for (let n = 0; n < curSupplier.productSkuList.length; n++) {
                      const curSku = curSupplier.productSkuList[n];
  
                      postData.items.push({
                        productSkuId: curSku.skuId,
                        price: curSku.supplierPriceValue,
                      });
                    }
  
                    _Vue.logList.push({
                      text: `等待${configSetting.waitSeconds}秒请求: 重新调整报价`,
                    });
                    await waitSeconds(configSetting.waitSeconds);
                    _Vue.logList.push({
                      text: `正在请求: 重新调整报价`,
                    });
                    await revisePrice(postData)
                      .then((data) => {
                        console.log("revisePrice: ", data);
                        if (data.success) {
                          _Vue.logList.push({
                            text: `修改成功`,
                          });
                        } else {
                          _Vue.logList.push({
                            text: `修改失败`,
                          });
                          console.warn(`修改数据失败: ${data.errorMsg}`);
                        }
                      })
                      .catch((error) => {
                        console.error("修改数据失败: ", error); // 打印错误信息
                      });
                  }
                }
              }
  
              _Vue.logList.push({
                text: `全部处理完成`,
              });
              _Vue.logInfo = {
                index: _Vue.logInfo.index + 1,
                totals: dataList.length,
                text: "",
              };
              _Vue.fetchState = false;
            })
            .catch((error) => {
              console.error("服务器返回数据失败: ", error); // 打印错误信息
            });
        },
  
        /**
         * 商品列表-请求商品列表
         * @returns
         */
        SPLB_pageQuery: function (pageNum, pageSize) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery";
  
          pageSize =
            typeof pageSize == "undefined" ? configSetting.pageSize : pageSize;
          // 定义要发送的数据
          const data = {
            pageSize: pageSize,
            page: pageNum,
            skcJitStatus: 3,
            skcSiteStatus: 0,
          };
  
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 商品列表-签JIT
         * @returns
         */
        SPLB_signJIT: function (postData) {
          const configSetting = this.configSetting;
          // 定义请求的URL
          const url =
            "https://seller.kuajingmaihuo.com/bg-visage-mms/product/agreement/batch/sign";
  
          // 定义要发送的数据
          const data = {
            skcList: postData,
          };
  
          // 使用fetch API发起POST请求
          return fetch(url, {
            method: "POST", // 指定请求方法为POST
            headers: {
              "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON数据
              Cookie: configSetting.Cookie, // 添加Cookie标头
              mallid: configSetting.mallId, // 添加mallid标头
            },
            body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
          }).then((response) => response.json()); // 解析JSON响应
        },
  
        /**
         * 批量签署JIT规则
         */
        SPLB_execute: async function () {
          const configSetting = this.configSetting;
          const waitSeconds = this.waitSeconds;
  
          const pageQuery = this.SPLB_pageQuery;
          const signJIT = this.SPLB_signJIT;
  
          const _Vue = this;
          _Vue.fetchState = true;
          _Vue.logList = [];
  
          let maxPage = 0;
          let curPageIndex = configSetting.pageNum;
  
          if (configSetting.autoPage) {
            await pageQuery(1, 1)
              .then((data) => {
                console.log("pageQuery(1,1): ", data);
                if (data.success) {
                  maxPage = Math.ceil(data.result.total / configSetting.pageSize);
                } else {
                  _Vue.logList.push({
                    text: `获取商品信息失败`,
                  });
                  console.warn(`获取商品信息失败: ${data.errorMsg}`);
                }
              })
              .catch((error) => {
                console.error("获取商品信息失败: ", error); // 打印错误信息
              });
          }
  
          let arrDataList = [];
          do {
            _Vue.logList.push({
              text: `等待${configSetting.waitSeconds}秒请求: 发送请求第${curPageIndex}页`,
            });
            await waitSeconds(configSetting.waitSeconds);
            arrDataList.push(pageQuery(curPageIndex));
  
            curPageIndex++;
            if (curPageIndex > maxPage) {
              _Vue.logList.push({
                text: `请求商品列表结束,等待服务器返回数据`,
              });
            }
          } while (curPageIndex <= maxPage);
  
          Promise.all(arrDataList)
            .then(async (resource) => {
              let dataList = [];
              resource.forEach((element) => {
                if (element.success) {
                  dataList.push(...element.result.pageItems);
                }
              });
              _Vue.logList.push({
                text: `服务器返回数据成功, 共${dataList.length}条数据`,
              });
              console.log(dataList);
  
              let postData = [];
              for (let index = 0; index < dataList.length; index++) {
                const curItem = dataList[index];
                postData.push({
                  productId: curItem.productId,
                  productSkcId: curItem.productSkcId,
                });
              }
  
              // 数据分组,因为请求的最大数量是20个
              let postGroup = [];
              for (let index = 0; index < postData.length; index += 20) {
                postGroup.push(postData.slice(index, index + 20));
              }
  
              if (postGroup.length) {
                for (let index = 0; index < postGroup.length; index++) {
                  const curPostData = postGroup[index];
                  _Vue.logList.push({
                    text: `等待${configSetting.waitSeconds}秒请求: 第${
                      index + 1
                    }次签署,签署${curPostData.length}个`,
                  });
                  await waitSeconds(configSetting.waitSeconds);
                  await signJIT(curPostData)
                    .then((data) => {
                      if (data.success) {
                        _Vue.logList.push({
                          text: `签署成功: ${data.result.successNum}`,
                        });
                        _Vue.logList.push({
                          text: `签署失败: ${data.result.failedNum}`,
                        });
                        if (data.result.failedDetailList.length) {
                          for (
                            let i = 0;
                            i < data.result.failedDetailList.length;
                            i++
                          ) {
                            const curFailed = data.result.failedDetailList[i];
                            _Vue.logList.push({
                              text: `Skc: ${curFailed.productSkcId}, ${curFailed.errorMsg}`,
                            });
                          }
                        }
                      } else {
                        console.warn(`签署失败: ${data.errorMsg}`);
                      }
                    })
                    .catch((error) => {
                      console.error("签署失败: ", error); // 打印错误信息
                    });
                }
              } else {
                _Vue.logList.push({
                  text: `需要签署为空`,
                });
              }
  
              _Vue.fetchState = false;
            })
            .catch((error) => {
              console.error("服务器返回数据失败: ", error); // 打印错误信息
            });
        },
  
        /**
         * 活动申报-添加价格规则
         */
        HDSB_activityPirceAdd: function () {
          this.configSetting.activityPriceRule.push({
            price: 0,
            maxPirce: 0,
          });
        },
        /**
         * 活动申报-删除价格规则
         */
        HDSB_activityPirceDelete: function (index, data) {
          this.configSetting.activityPriceRule.splice(index, 1);
        },
        /**
         * 点击执行类型
         * @param {*} state
         */
        handleClick: function (state) {
          if (state == "上新生命周期") {
            this.SMZQ_execute();
          }
  
          if (state == "批量签署JIT规则") {
            this.SPLB_execute();
          }
  
          if (state == "批量活动申报") {
            this.HDSB_execute();
          }
          this.clickState = state;
          this.dialogLogVisible = true;
        },
      },
      watch: {
        configSetting: {
          handler(newVal, oldVal) {
            this.$nextTick(() => {
              const body = unsafeWindow.document.body;
              body.classList.toggle("is-blockPopUps", newVal.blockPopUps);
              GM_setValue("configSetting", newVal);
            });
          },
          // 开启深度监听
          deep: true,
        },
      },
    };
    const app = Vue.createApp(App);
    app.use(ElementPlus);
    app.mount("#vueApp");
  })();
  