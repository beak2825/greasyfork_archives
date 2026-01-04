// ==UserScript==
// @name         Pixiv Collection Plus
// @namespace    niaier pixiv collection
// @license MIT
// @version      0.1
// @description  pixiv收藏拓展
// @author       niaier
// @match        *://www.pixiv.net/*
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
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.3/cpexcel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js
// @resource css https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5.2.2/dist/echarts.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/441001/Pixiv%20Collection%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/441001/Pixiv%20Collection%20Plus.meta.js
// ==/UserScript==

window.onload = function () {
  // 替换element字体源
  const styleText = GM_getResourceText("css").replace('fonts/element-icons.woff', 'https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/fonts/element-icons.woff').replace('fonts/element-icons.ttf', 'https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/fonts/element-icons.ttf')
  // GM_addStyle(GM_getResourceText("css"));
  GM_addStyle(styleText);

  class Database extends Dexie {
    constructor() {
      super('pixiv');
      this.version('1.0').stores({
        production: '++id,&url,title,custom_category,tag',
        collection: '++id,url,title,custom_category,tag,collection_list,collection_list_id',
        collection_class_list: '++id,list_name'
      });

      this.collection = this.table('collection');
      this.collectionClassList = this.table('collection_class_list');
    }
    // 当前有关收藏
    async getCurCollection (url) {
      let curCollection = []
      curCollection = await this.collection.where('url').equals(url).toArray()
      return curCollection
    }
    // 添加收藏
    async addToCollection (data) {
      return await this.collection.add(data)
    }
    // 删除收藏
    async deleteCollection (id, url) {
      console.log(id, url);
      return await this.collection
        .where({ 'collection_list_id': id, url }).delete()
    }
    // 获取收藏列表
    async getCollectionList () {
      let collectionClassList = []
      collectionClassList = await this.collection_class_list.orderBy('id').toArray();
      return collectionClassList
    }
    // 添加收藏列表
    async addCollectionList (data) {
      return await this.collection_class_list.add(data)
    }
    //删除收藏列表
    async deleteCollectionList (id) {
      await this.collection_class_list.where('id').equals(id).delete()
      await this.collection.where('collection_list_id').equals(id).delete()
      return
    }
    //获取收藏列表下的藏品
    async getCollectionListContent (collection_list_id) {
      // 参数 收藏列表id collection_list_id
      let collectionListContent = []
      collectionListContent = await this.collection.where('collection_list_id').equals(collection_list_id).toArray()
      return collectionListContent
    }
    // 获取自定义标签
    async getCustomCategory (url) {
      let custom_category = []
      const production = await this.production.where('url').equals(url).toArray()
      custom_category = production[0] ? production[0].custom_category : []
      console.log(custom_category);
      return custom_category
    }
    // 添加自定义标签
    // 添加作品
    async putProduction (data) {
      return await this.production.put(data)
    }
    //获取作品
    async getProduction (url) {
      let arr = []
      arr = await this.production.where('url').equals(url).toArray()
      return arr[0]
    }
    // 修改自定义标签
    async putCustomCategory (url, custom_category) {
      console.log(url, custom_category);
      await this.production.where('url').equals(url).modify({
        custom_category
      })
    }
    async getAllData () {
      const production = await this.production.toArray()
      const collection = await this.collection.toArray()
      const collection_class_list = await this.collection_class_list.toArray()
      return { production, collection, collection_class_list }

    }
    async importAllData (data) {
      // 先清空
      // await this.production.delete()
      // await this.collection.delete()
      // await this.collection_class_list.delete()

      await this.production.bulkPut(data.production)
      await this.collection.bulkPut(data.collection)
      await this.collection_class_list.bulkPut(data.collection_class_list)
    }


  }








  const viewCollection =
    `
    <div id="viewCollection">
    <el-button type="primary" size="small" :style="{
       'margin-left': '10px'
     }" @click="showCollection">查看收藏</el-button>


    <el-dialog title="查看收藏列表" :visible.sync="collectionVisible" width="60%" center append-to-body :style="{
        height: '80%',
      }">
      <el-container>
        <el-aside width="200px">
          <h5>收藏列表</h5>
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item :index="index" :key="item.id" v-for="(item, index) in collectionList">
              <i class="el-icon-menu"></i>
              <span slot="title" @click="getCollectionListContent(item)">{{ item.list_name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div>
            <div
            :style="{
              'margin-bottom': '10px'
            }"
            >
             <h5>收藏展示</h5>
            <el-button type="primary" @click="exportJson" size="small">导出json</el-button>

            <input type="file" name="file" id="importJson" v-show="false" @change="handleImport">
            <el-button size="small" type="primary" @click="importJson" :style="{
            'margin-left': '10px',
          }">导入Json</el-button>
            </div>
            <el-row :gutter="10">
              <el-col :span="8" :key="item.id" v-for="item in collectionListContent">
                <div :style="{ height: 250 }">
                  <div class="pic" :style="{ 'text-align': 'center' }">
                    <img :src="item.preview_url" alt="" height="184" />
                  </div>
                  <div class="title" :style="{
                    'display':'flex',
                    'justify-content':'center'
                  }">
                    <h5 :style="{width:'130px'}">
                      <el-link :href="item.url" target="_blank">
                        {{ item.title }}
                      </el-link>
                    </h5>
                  </div>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
    `
  const addCollection =
    ` <div id="addCollection">
    <el-button
     type="primary"
     size="small"
     @click="showCollectionList"
     :style="{
       'margin-right': '10px'
     }"
     >
      添加到收藏</el-button
    >
    <el-dialog
      title="收藏列表"
      :visible.sync="collectionListVisible"
      width="30%"
      center
      append-to-body
    >
      <div class="currentTag">
        <h5
        :style="{
          'margin-bottom': '10px',
        }"
        >
        当前标签：
        </h5>
        <span>
          <el-tag
            v-for="item in tag"
            :key="item"
            type="info"
            size="mimi"
            :style="{
              'margin-left': '10px',
              'margin-bottom': '10px',
            }"
          >
            {{ item.originTag + " | " + item.translatedTag }}
          </el-tag>
        </span>
      </div>
      <div
        class="customTag"
        :style="{
          'margin-top': '10px',
          'margin-bottom': '10px',
        }"
      >
        <h5
        :style="{
          'margin-bottom': '10px',
        }"
        >
        自定义标签：
        </h5>

        <span>
          <el-tag
            :key="item"
            size="mimi"
            v-for="item in custom_category"
            closable
            :disable-transitions="false"
            @close="deleteCustomCategory(item)"
            :style="{
              'margin-left': '10px',
              'margin-button': '10px',
            }"
          >
            {{ item.originTag + " | " + item.translatedTag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="customCategoryInputVisible"
            v-model="selfCategory"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="addSelfCategory"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showSelfCategoryInput"
            >+ New Tag</el-button
          >
        </span>
      </div>

      <el-input
        placeholder="新建收藏列表"
        v-model="inputListName"
        class="input-with-select"
        :style="{
        'margin-top': '10px',
        'margin-button': '10px',
        }"
      >
        <el-button
          slot="append"
          @click="addCollectionList"
          size="small"
          type="primary"
          icon="el-icon-plus"
        ></el-button>
      </el-input>

      <div class="collectionList">
        <el-row>
          <el-col
            :span="24"
            v-for="(item, index) in collectionList"
            :key="index"
            :style="{
              'display':'flex',
              'justify-content':'space-between',
              'margin-top':'10px'
            }"
          >
            <el-checkbox
              v-model="item.checked"
              @change="changeChecked(index, item)"
              >{{ item.list_name }}</el-checkbox
            >
            <i
            class="el-icon-delete"
            @click="deleteCollectionList(item)"
            :style="{
              cursor:'pointer'
            }"
            ></i>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="collectionListVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="collectionListVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>`

  $('#root > div:nth-child(2) > div.sc-12xjnzy-0.dIGjtZ > div:nth-child(1) > div:nth-child(1) > div > div.sc-4nj1pr-2.fDmigA').append(viewCollection)
  $('#root > div:nth-child(2) > div.sc-1nr368f-0.beQeCv > div > div.sc-1nr368f-3.dkdRNk > main > section > div.sc-171jvz-0.gcrJTU > div > div.sc-rsntqo-0.fPeueM > div > div.sc-ye57th-1.lbzRfC > section').append(addCollection)
  new Vue({
    el: '#viewCollection',
    data: () => ({
      collectionVisible: false,
      collectionList: [],
      collectionListContent: []
    }),
    created () {
      this.db = new Database()
    },
    methods: {
      showCollection () {
        this.collectionVisible = true
        this.getCollectionList()
      },
      async getCollectionList () {
        const collectionList = await this.db.getCollectionList()
        this.collectionList = collectionList
      },
      async getCollectionListContent (item) {
        const collection_list_id = item.id

        const collectionListContent = await this.db.getCollectionListContent(collection_list_id)
        this.collectionListContent = collectionListContent
        console.log('collectionListContent', collectionListContent)
      },
      // 导出
      async exportJson () {
        const curDate = moment().format('YYYY_MM_hh_mm_ss');
        const jsonObj = await this.db.getAllData()
        const data = JSON.stringify(jsonObj)
        let blob = new Blob([data], { type: 'text/json' })
        let a = document.createElement('a')
        a.download = `pixiv收藏数据${curDate}.json`
        a.href = window.URL.createObjectURL(blob)
        document.body.appendChild(a);
        a.click()
        document.body.removeChild(a);
      },
      //导入
      importJson () {
        const input = document.querySelector('#importJson')
        input.click()
      },
      handleImport () {
        const that = this
        const selectedFile = document.querySelector('#importJson').files[0]
        const reader = new FileReader()
        reader.readAsText(selectedFile)
        let JsonObj = {}
        reader.onload = function () {
          JsonObj = JSON.parse(this.result)
          that.db.importAllData(JsonObj)
        }

      }
    }
  })

  new Vue({
    el: '#addCollection',
    data: () => ({
      collectionListVisible: false,
      inputListName: '',
      defaultChecked: false,
      collectionList: [],
      db: {},
      url: window.location.href,
      title: '',
      tag: [],
      selfCategory: '',
      custom_category: [],
      customCategoryInputVisible: false,
      production: {},
      previewUrl: ''
    }),
    created () {
      this.db = new Database()
    },
    mounted () {
      this.getTitle()
      this.getTag()
      this.initData()
      this.getPreviewUrl()
    },
    methods: {
      initData () {
        this.getProduction()
        this.getCollectionList()
        this.getCurCollection()
      },
      showCollectionList () {
        this.collectionListVisible = true
        this.initData()
      },
      getTitle () {
        const title = document.querySelector("#root > div:nth-child(2) > div.sc-1nr368f-0.beQeCv > div > div.sc-1nr368f-3.dkdRNk > main > section > div.sc-171jvz-0.gcrJTU > div > figcaption > div > div > h1").innerText
        this.title = title
        console.log(this.title);
      },
      getTag () {
        const tagList = []
        const liList = document.querySelectorAll('.sc-pj1a4x-0 .sc-h7k48h-0.lhUcKZ')
        liList.forEach(item => {
          originTag = item.querySelector('.gtm-new-work-tag-event-click').innerText
          translatedTag = item.querySelector('.gtm-new-work-translate-tag-event-click') ? item.querySelector('.gtm-new-work-translate-tag-event-click').innerText : ''
          const obj = {
            originTag,
            translatedTag
          }
          tagList.push(obj)

        })
        this.tag = tagList
        console.log(this.tag);

      },
      getCustomCategory () {
        console.log("this.production", this.production);
        this.custom_category = this.production ? this.production.custom_category : []
      },
      getPreviewUrl () {
        this.previewUrl = document.querySelector("a.gtm-expand-full-size-illust").href
      },
      async putCustomCategory () {
        console.log('custom_category', this.custom_category);
        await this.db.putCustomCategory(window.location.href, this.custom_category)
      },
      showSelfCategoryInput () {
        this.customCategoryInputVisible = true
      },
      addSelfCategory () {
        const categoryList = this.selfCategory.split("|")
        let originTag = ''
        let translatedTag = ''
        if (categoryList.length > 1) {
          originTag = categoryList[0]
          translatedTag = categoryList[1]
        } else if (categoryList.length == 1) {
          originTag = categoryList[0]
          translatedTag = ''
        }
        const obj = {
          originTag,
          translatedTag
        }
        this.custom_category.push(obj)
        this.custom_category = Array.from(new Set(this.custom_category))
        this.putCustomCategory()
        this.customCategoryInputVisible = false
        this.initData()

      },

      deleteCustomCategory (tag) {
        this.custom_category.splice(this.custom_category.indexOf(tag), 1);
        this.putCustomCategory()
        this.initData()
      },

      changeChecked (index, item) {
        if (item.checked == true) {
          this.addToCollection(item)
        } else {
          this.deleteCollection(item.id, window.location.href)
        }
      },
      async getProduction () {
        this.production = await this.db.getProduction(window.location.href)
        this.getCustomCategory()
        this.production = this.production || {}
      },
      async putProduction () {

        const data = {
          id: this.production.id,
          title: this.title,
          url: window.location.href,
          tag: this.tag,
          custom_category: this.custom_category,
          preview_url: this.previewUrl
        }
        console.log('putProduction', data);
        await this.db.putProduction(data)
      },

      async addToCollection (item) {
        const data = {
          title: this.title,
          url: window.location.href,
          tag: this.tag,
          custom_category: this.custom_category,
          collection_list: item.list_name,
          collection_list_id: item.id,
          preview_url: this.previewUrl
        }
        await this.db.addToCollection(data);
        this.putProduction()
        this.getCurCollection()
      },
      async deleteCollection (id, url) {
        await this.db.deleteCollection(id, url)
        this.getCurCollection()
      },
      // 获取当前作品相关的收藏记录
      async getCurCollection () {
        const url = window.location.href
        const curCollection = await this.db.getCurCollection(url)
        this.curCollection = curCollection
        this.handleCurChecked()
      },
      async getCollectionList () {
        const collectionList = await this.db.getCollectionList()
        this.collectionList = collectionList
      },
      // 添加列表
      async addCollectionList () {
        const listName = this.inputListName
        const data = {
          list_name: listName
        }
        await this.db.addCollectionList(data)
        this.getCollectionList()
      },
      //删除列表
      async deleteCollectionList (item) {
        console.log('deleteCollectionList', item.id);
        this.db.deleteCollectionList(item.id)
        this.initData()
        this.getCurCollection()
      },
      // 处理收藏列表的显示效果
      handleCurChecked () {
        const arr = this.collectionList.map(item1 => {
          this.curCollection.forEach(item2 => {
            if (item1.id == item2.collection_list_id) {
              item1.checked = true
            }
          })
          return item1
        })
        console.log(arr);
        this.collectionList = arr
      },

    }
  })
}