// ==UserScript==
// @name         Hpoi Price Statistics
// @namespace    niaier Hpoi Price Statistics
// @version      0.2
// @description  统计预定想买的预计价格和相关信息
// @match        *://*.hpoi.net/user/*
// @author       niaier
// @license MIT
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14
// @require      https://unpkg.com/element-ui/lib/index.js
// @connect      *
// @resource css https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @downloadURL https://update.greasyfork.org/scripts/435216/Hpoi%20Price%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/435216/Hpoi%20Price%20Statistics.meta.js
// ==/UserScript==

(async function () {
  GM_addStyle(GM_getResourceText("css"));
  const vueApp = ` <div id="app">
  <el-button @click="handleShow()" type="primary">价格统计</el-button>
  <div>
    <el-dialog title="提示" :visible="priceDialogVisible" :show-close="false" :close-on-click-modal="false" width="80%">


      <el-radio-group v-model="mode" :disabled="true" change="changeMode">
        <el-radio-button label="all" v-if="mode=='all'">全部</el-radio-button>
        <el-radio-button label="pre" v-if="mode=='pre'">预定</el-radio-button>
      </el-radio-group>
      <!-- 数据部分 s -->
      <div style="margin-top:20px;" v-if="(mode=='all'||mode=='pre')">
        <el-row :gutter=16>
          <el-col :span="4">
            <el-button type="primary" @click="syncData">{{syncDataTip}}</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="clearData">清空数据</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="addData">添加数据</el-button>
          </el-col>
        </el-row>
        <el-row style="text-align: center;margin-top:20px">
          <el-col :span="8">名称</el-col>
          <el-col :span="3" style="margin-left:20px">价格</el-col>
          <el-col :span="3" style="margin-left:20px">预付</el-col>
          <el-col :span="3" style="margin-left:20px">待付</el-col>
          <el-col :span="3" style="margin-left:20px">操作</el-col>
        </el-row>
        <el-row v-for="(item,index) in listData" style="margin-top: 20px;" :key="index">
          <el-col :span="8">
            <el-input v-model="item.name"></el-input>
          </el-col>
          <el-col :span="3" style="margin-left:20px">
            <el-input v-model="item.price"></el-input>
          </el-col>
          <el-col :span="3" style="margin-left:20px">
            <el-input v-model="item.prepay"></el-input>
          </el-col>
          <el-col :span="3"
            style="margin-left:20px;display:flex;align-items:center;justify-content:center;height:40px;">
            <div>
              <span>{{unpaidResult[index]&&unpaidResult[index].unpaid}}</span>
            </div>
          </el-col>
          <el-col :span="3" style="margin-left:20px;text-align:center">
            <el-button @click="deleteData(index)">删除</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;" type="flex" justify="end">
          <el-col :span="4"><span>总价: {{totalPrice}}</span></el-col>
        </el-row>
        <el-row style="margin-top: 20px;" type="flex" justify="end">
          <el-col :span="4">
            <span>总待付: {{totalUnpaid}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 数据部分 e -->


      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</div>`
  $('.info').eq(0).append(vueApp)
  // Your code here...
  async function getFigurePrice (url) {
    let price = 0
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        "method": "GET",
        "url": url,
        "headers": {
          "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        },
        "onload": function (result) {
          // console.log(result);
          var list = $.parseHTML(result.response);
          list.forEach(function (item) {
            const priceText = $(item).find('.hpoi-infoList-item span:contains("定价")').parent().find('p').text()
            if (priceText) {
              if (priceText.match(/\d+元/g) && priceText.match(/\d+元/g)[0]) {
                price = priceText.match(/\d+元/g)[0].replace('元', "")
              } else {
                price = 0
              }
              resolve(price)
            }

          })
        }
      });
    })
  }


  async function getAllCollection (mode) {
    return new Promise(async function (resolve, reject) {
      // const content = $('#content')
      const itemList = $('#content .item')
      // console.log(itemList);
      const figureList = []
      console.log(itemList.length);
      for (const i in itemList) {
        // const href = $(this).find('a').attr('href')
        let href = ''
        if ($(itemList[i]).find('a') && $(itemList[i]).find('a')[0]) {
          href = $(itemList[i]).find('a')[0].href
          // console.log(full);
          const name = $(itemList[i]).find('.name').text().trim().replace(/\s/g, "")
          const price = await getFigurePrice(href)
          const obj = {
            url: href,
            name: name,
            price: Number(price),
            prepay: 0,
            unpaid: 0
          }
          console.log(i);
          figureList.push(obj)

        }
        if (i == itemList.length - 1) {
          let itemMode;
          if (mode == 'all') itemMode = 'figureList'
          if (mode == 'pre') itemMode = 'preList'
          const oldList = JSON.parse(window.localStorage.getItem(itemMode))
          if (oldList) {
            figureList.forEach(item => {
              oldList.forEach(el => {
                if (el.url == item.url) {
                  item.prepay = el.prepay
                }
              })
            })
          }
          window.localStorage.setItem(itemMode, JSON.stringify(figureList))
          resolve(figureList)
        }

      }
    })

    // console.log(figureList);
  }


  function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }


  new Vue({
    el: '#app',
    data: {
      syncDataTip: '同步数据',
      message: 'Hello Vue!',
      show: false,
      priceDialogVisible: false,
      // figureList: []
      figureList: JSON.parse(window.localStorage.getItem('figureList')) || [{
        url: '',
        name: '',
        price: 0,
        prepay: 0,
        unpaid: 0
      }],
      preList: JSON.parse(window.localStorage.getItem('preList')) || [{
        url: '',
        name: '',
        price: 0,
        prepay: 0,
        unpaid: 0
      }],
      mode: 'all',
      listData: [{
        url: '',
        name: '',
        price: 0,
        prepay: 0,
        unpaid: 0
      }]
    },
    computed: {
      totalPrice () {
        let total = 0
        this.listData.forEach(item => {
          total += Number(item.price)
        })
        return total
      },
      unpaidResult () {
        let result = [{}]
        if (this.listData) {
          this.listData.forEach(item => {
            item.unpaid = item.price - item.prepay
          })
        }
        result = this.listData
        return result
      },
      totalUnpaid () {
        let total = 0
        this.unpaidResult.forEach(item => {
          total += Number(item.unpaid)
        })
        return total
      }
    },
    created () {
      // want preorder null
      if (getQueryString('favState') == null) this.mode = "all"
      if (getQueryString('favState') == 'preorder') this.mode = "pre"
      if (getQueryString('favState') == 'want') this.mode = "want"
      if (getQueryString('favState') == 'care') this.mode = "care"
      if (getQueryString('favState') == 'buy') this.mode = "buy"
      if (getQueryString('favState') == 'resell') this.mode = "resell"
      this.changeMode()
      console.log(this.listData);
    },
    methods: {
      async syncData () {
        this.syncDataTip = "同步数据中"
        this.listData = await getAllCollection(this.mode)
        this.syncDataTip = "同步完成"
      },
      handleShow () {
        this.priceDialogVisible = true
      },
      handleClose () {
        this.priceDialogVisible = false
      },
      getResult () {
        console.log(this.figureList);
      },
      handleSave () {
        let itemMode;
        if (this.mode == 'all') itemMode = 'figureList'
        if (this.mode == 'pre') itemMode = 'preList'
        window.localStorage.setItem(itemMode, JSON.stringify(this.listData))
        this.handleClose()
      },
      changeMode () {
        if (this.mode == 'all') this.listData = this.figureList
        if (this.mode == 'pre') this.listData = this.preList
      },
      clearData () {
        this.listData = []
      },
      addData () {
        this.listData.push({
          name: '',
          price: 0,
          prepay: 0,
          unpaid: 0
        })
      },
      deleteData (index) {
        this.listData.splice(index, 1)
      }
    }
  })

})();