// ==UserScript==
// @name           今日优读
// @description    主要搭建一个知识平台以及读书辅助工具，提供书籍搜索，中图分类和学科搜索。
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/32927-md5-hash/code/MD5%20Hash.js?version=225078
// @require        https://unpkg.com/vue/dist/vue.js
// @require        https://unpkg.com/element-ui/lib/index.js
// @include        http://uread.today/*
// @include        http://127.0.0.1:9090/*
// @include        http://book.ucdrs.superlib.net/views/specific/*
// @include        http://product.dangdang.com/*
// @include        https://item.jd.com/*
// @include        https://book.douban.com/subject/*
// @include        https://kns.cnki.net/*
// @include        https://ct.istic.ac.cn/*
// @include        https://weread.qq.com/*
// @include        https://yabook.org/*
// @include        https://yabook.blog/*
// @include        https://www.jiumodiary.com/*
// @include        http://www.ncpssd.org/*
// @version        0.4.1
// @icon           http://uread.today/static/img/favicon.ico
// @run-at         document-end
// @namespace      http://uread.today
// @downloadURL https://update.greasyfork.org/scripts/429927/%E4%BB%8A%E6%97%A5%E4%BC%98%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/429927/%E4%BB%8A%E6%97%A5%E4%BC%98%E8%AF%BB.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        if (location.href.includes('http://book.ucdrs.superlib.net/views/specific')) {
            addViewOrEmbody('.tubox dl', '.tutilte');
        } else if (location.href.includes('http://product.dangdang.com')) {
            addViewOrEmbody('#detail_describe', '.name_info h1');
        } else if (location.href.includes('https://item.jd.com')) {
            addViewOrEmbody('.p-parameter-list', '.sku-name');
        } else if (location.href.includes('https://book.douban.com/subject')) {
            addViewOrEmbody('#info', '#wrapper > h1 > span');

            addZoteroCapture();
        } else if (location.href.includes('https://kns.cnki.net/kns8/defaultresult/index')) {
            handleCNKI();
        } else if (location.href.includes('https://ct.istic.ac.cn/site/organize/welcome')) {
            handleIsticWelcome();
        } else if (location.href.includes('https://ct.istic.ac.cn/site/organize/word')) {
            handleIstic();
        } else if (location.href.includes('https://weread.qq.com/')) {
            handleWeread();
        } else if (location.href.includes('https://yabook.')) {
            handleYabook();
        } else if (location.href.includes('https://www.jiumodiary.com/')) {
            handleJiumodiary();
        } else if (location.href.includes('http://www.ncpssd.org/index.aspx')) {
            handleNcpssd();
        } else if (location.href.includes('http://uread.today/')) {
            handleuRead();
        } else if (location.href.includes('http://127.0.0.1:9090/')) {
            handleuRead();
        }
    })

    function addZoteroCapture() {
        //$('body').append('<div tabindex="-1" class="el-drawer__wrapper zotero" id="zotero-capture" style="z-index: 2003; position: fixed; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; margin: 0;" initd="true">' +
        //                 '<div role="document" tabindex="-1" style="background-color: rgba(0,0,0,0.4); position: relative; left: 0; right: 0; top: 0; bottom: 0; height: 100%; width: 100%;"></div>' + '</div>')

        $('body').append(`
        <div id="zotero-plus">
        <a href="javascript:void(0)" style="position: fixed; top: 40px; right: 10px;" @click="showZotero()" title="自定义Zotero抓取"><img src="https://www.zotero.org/static/images/theme/zotero-logo.1519224037.svg" height="20px" /></a>
    <el-drawer
      id="zotero-capture"
      :visibled="zotero.drawer"
      class="zotero"
      :visible.sync="zotero.drawer">
      <span slot="title" style="display: flex;align-items: center;">
        <img src="https://www.zotero.org/static/images/theme/zotero-logo.1519224037.svg" height="40px">
        <div style="display: flex;flex-direction: column;margin: 0 10px;">
          <span>自定义Zotero抓取</span>
          <span style="color: #b8b5b5;font-size: 12px;">请保持显示状态下抓取</span>
        </div>
      </span>
      <div class="drawer-content">
        <el-tabs value="info">
          <el-tab-pane label="信息" name="info">
            <div>
              <el-form ref="form" :model="zotero" label-width="90px" size="mini">
                <el-form-item label="标题">
                  <el-input id="zotero-title" v-model="zotero.title">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('title')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item class="zotero-class-creators" v-for="(creator, index) in zotero.creators" :key="index">
                  <el-select v-model="creator.creatorType" placeholder="请选择" slot="label" :creatorType="creator.creatorType" class="creatorType">
                    <el-option label="作者" value="author" class="minor-size"></el-option>
                    <el-option label="译者" value="translator" class="minor-size"></el-option>
                  </el-select>
                  <el-input v-model="creator.lastName" class="lastName">
                    <i class="el-icon-top el-input__icon"
                      slot="suffix"
                      v-if="index !== 0"
                      @click="zoteroCreatorUp(index)">
                    </i>
                    <i class="el-icon-bottom el-input__icon"
                      slot="suffix"
                      v-if="index !== zotero.creators.length - 1"
                      @click="zoteroCreatorDown(index)">
                    </i>
                    <i class="el-icon-plus el-input__icon"
                      slot="suffix"
                      @click="zoteroCreatorAdd(creator, index)">
                    </i>
                    <i class="el-icon-minus el-input__icon"
                      slot="suffix"
                      @click="zoteroCreatorRemove(creator, index)">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="摘要">
                  <el-input id="zotero-abstractNote" v-model="zotero.abstractNote"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8}">
                  </el-input>
                </el-form-item>
                <el-form-item label="系列">
                  <el-input id="zotero-series" v-model="zotero.series">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('series')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="系列编号">
                  <el-input id="zotero-seriesNumber" v-model="zotero.seriesNumber">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('seriesNumber')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="卷">
                  <el-input id="zotero-volume" v-model="zotero.volume">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('volume')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="总卷数">
                  <el-input id="zotero-numberOfVolumes" v-model="zotero.numberOfVolumes">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('numberOfVolumes')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="图书版本">
                  <el-input id="zotero-edition" v-model="zotero.edition">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('edition')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="地点">
                  <el-input id="zotero-place" v-model="zotero.place">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('place')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="出版社">
                  <el-input id="zotero-publisher" v-model="zotero.publisher">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('publisher')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="日期">
                  <el-input id="zotero-date" v-model="zotero.date">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('date')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="总页数">
                  <el-input id="zotero-numPages" v-model="zotero.numPages">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('numPages')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="语言">
                  <el-input id="zotero-language" v-model="zotero.language">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('language')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="ISBN">
                  <el-input id="zotero-ISBN" v-model="zotero.ISBN" :disabled="true">
                  </el-input>
                </el-form-item>
                <el-form-item label="短标题">
                  <el-input id="zotero-shortTitle" v-model="zotero.shortTitle">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('shortTitle')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="URL">
                  <el-input id="zotero-url" v-model="zotero.url" :disabled="true">
                  </el-input>
                </el-form-item>
                <el-form-item label="档案">
                  <el-input id="zotero-archive" v-model="zotero.archive">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('archive')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="存档位置">
                  <el-input id="zotero-archiveLocation" v-model="zotero.archiveLocation">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('archiveLocation')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="引用次数">
                  <el-input id="zotero-callNumber" v-model="zotero.callNumber">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('callNumber')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="版权">
                  <el-input id="zotero-rights" v-model="zotero.rights">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('rights')">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item label="其他">
                  <el-input id="zotero-extra" v-model="zotero.extra">
                    <i class="el-icon-refresh-left el-input__icon"
                      slot="suffix"
                      @click="zoteroReset('extra')">
                    </i>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="笔记" name="notes">
            <el-checkbox id="zotero-note1-enabled" v-model="zotero.notes[0].enabled" class="minor-size"><span class="minor-size">初步评价：</span></el-checkbox>
            <el-input id="zotero-note1" v-model="zotero.notes[0].note"
              @input="zoteroNote2Input"
              type="textarea"
              placeholder="请输入对该书籍的初步评价"
              size="mini"
              :rows="4">
            </el-input>

            <div class="tools">
              <el-checkbox id="zotero-note3-enabled" v-model="zotero.notes[2].enabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureComments', e)"><span class="minor-size">豆瓣短评：</span></el-checkbox>
            </div>
            <span id="zotero-note3" v-html="zotero.notes[2].note"></span>

            <div class="tools">
              <el-checkbox id="zotero-note2-enabled" v-model="zotero.notes[1].enabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureCatalogues', e)"><span class="minor-size">目录：</span></el-checkbox>
              <el-button type="text" class="minor-size" icon="el-icon-refresh-left" @click="zoteroReset('catalogues')">重置</el-button>
            </div>
            <el-image id="zotero-coverurl" class="image" :src="zotero.cover_url">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <el-input id="zotero-note2" v-model="zotero.notes[1].note"
              @input="zoteroNote2Change"
              type="textarea"
              placeholder="请输入对该书籍的目录"
              size="mini"
              :autosize="{ minRows: 10}">
            </el-input>
          </el-tab-pane>
          <el-tab-pane label="标签" name="tags">
            <div>
            <el-checkbox id="zotero-tags-enabled" v-model="zotero.tagenabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureTags', e)"><span class="minor-size"> {{zotero.tags.length}} 个标签。</span></el-checkbox>
              <el-button type="text" size="mini" class="minor-size" icon="el-icon-delete" @click="zoteroClearTags">清空</el-button>
              <el-button type="text" size="mini" class="minor-size" icon="el-icon-refresh-left" @click="zoteroReset('tags')">重置</el-button>
            </div>
            <div id="zotero-tags">
              <el-tag
                v-for="(tag, index) in zotero.tags"
                :key="index"
                closable
                size="medium"
                class="tag"
                type="warning"
                :disable-transitions="false"
                @close="zoteroRemoveTag(tag)">
                {{tag}}
              </el-tag>
              <el-autocomplete
                class="input-new-tag"
                v-if="zotero.tagVisible"
                v-model="zotero.tagValue"
                :fetch-suggestions="zoteroTagsHistoryQuerySearch"
                ref="zoteroSaveTagInput"
                size="mini"
                @select="zoteroSelectTagConfirm"
              >
              <i class="el-icon-check el-input__icon"
                slot="suffix"
                @click="zoteroInputTagConfirm">
              </i>
              <template slot-scope="{ item }">
                <div>{{ item.keyword }}</div>
              </template>
              </el-autocomplete>
              <el-button plain v-else class="button-new-tag" size="small" @click="zoteroShowInputTag" icon="el-icon-plus"></el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="附件" name="attachments">
            <div class="minor-content">需要安装油猴插件「<a href="https://greasyfork.org/zh-CN/scripts/408682" target="_blank">豆瓣京东当当中图法分类</a>」。</div>
            <el-button type="text" class="minor-size" icon="el-icon-refresh-left" @click="zoteroReset('attachments')">刷新</el-button>
            <p class="p-item" v-if="zotero.attachments[0].url"><el-checkbox id="zotero-attachment1-enabled" v-model="zotero.attachments[0].enabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureAssistUrl', e)"><a id="zotero-attachment1" :linkMode="zotero.attachments[0].linkMode" :mimeType="zotero.attachments[0].mimeType" class="minor-size" :href="zotero.attachments[0].url">辅助页(版权页、前言页、目录页)</a></el-checkbox></p>
            <p class="p-item" v-if="zotero.attachments[1].url"><el-checkbox id="zotero-attachment2-enabled" v-model="zotero.attachments[1].enabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureCntUrl', e)"><a id="zotero-attachment2" :linkMode="zotero.attachments[1].linkMode" :mimeType="zotero.attachments[1].mimeType" class="minor-size" :href="zotero.attachments[1].url">正文试读</a></el-checkbox></p>
            <p class="p-item" v-if="zotero.attachments[2].url"><el-checkbox id="zotero-attachment3-enabled" v-model="zotero.attachments[2].enabled" class="minor-size" @change="(e) => zoteroEnabledChange('captureWereadUrl', e)"><a id="zotero-attachment3" :linkMode="zotero.attachments[2].linkMode" :mimeType="zotero.attachments[2].mimeType" class="minor-size" :href="zotero.attachments[2].url">微信读书《{{zotero.title}}》</a></el-checkbox></p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
    </div>`);

        GM_addStyle(`
.uread-color {
  color: #009193 !important;
}

.major-color {
  color: #303133 !important;
}

.minor-color {
  color: #909399 !important;
}

.placeholder-color {
  color: #C0C4CC !important;
}

.headline-size {
  font-size: 20px !important;
}

.headline-content {
  font-size: 20px !important;
  color: #303133 !important;
}

.major-size {
  font-size: 13px !important;
}

.minor-size {
  font-size: 12px !important;
}

.article-content {
  color: #303133 !important;
  font-size: 14px !important;
}

.major-content {
  color: #303133 !important;
  font-size: 13px !important;
}

.minor-content {
  color: #909399 !important;
  font-size: 12px !important;
}
.zotero .el-drawer__body {
  overflow: scroll;
}
.zotero .drawer-content {
  margin: 0 10px 20px;
}
.zotero .el-form-item--mini.el-form-item {
  margin-bottom: 5px;
}
.zotero .el-form-item__label {
  color: #909399;
  font-size: 12px;
}
.zotero .el-tag {
  margin-right: 15px;
  margin-bottom: 10px;
}
.zotero .button-new-tag {
  margin-right: 10px;
  width: 70px;
  padding-top: 7px;
  height: 27px;
}
.zotero .input-new-tag {
  width: 70px;
  margin-right: 10px;
}
.zotero .image {
  width: 100px;
  height: 120px;
}
.zotero .el-drawer__header {
  margin-bottom: 10px;
}
.zotero .tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}
.fill {
  width: 100%;
}`);

        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = 'https://unpkg.com/element-ui/lib/theme-chalk/index.css';
        document.getElementsByTagName('head')[0].appendChild(style);

        const LocalStorage = {
            get (key, item, def) {
                if (!item) {
                    const sk = window.localStorage.getItem(key)
                    if (sk) {
                        return JSON.parse(sk)
                    }
                } else {
                    var obj = this.get(key)
                    return (obj && `${item}` in obj) ? obj[`${item}`] : def
                }
            },

            set (key, objectOrItem, value) {
                if (objectOrItem && typeof objectOrItem === 'object' && objectOrItem.constructor === Object) {
                    window.localStorage.setItem(key, JSON.stringify(objectOrItem))
                } else {
                    var obj = this.get(key)
                    if (!obj) {
                        obj = {}
                    }
                    obj[`${objectOrItem}`] = value
                    window.localStorage.setItem(key, JSON.stringify(obj))
                }
            },

            remove (key, item) {
                if (!item) {
                    window.localStorage.removeItem(key)
                } else {
                    var obj = this.get(key)
                    if (obj && `${item}` in obj) {
                        delete obj[`${item}`]
                        this.set(key, obj)
                    }
                }
            },

            keys () {
                return Object.keys(window.localStorage)
            }
        }

        const LocalHistory = {
            max: 10,
            localHistorys: undefined,

            get (key) {
                const sk = window.localStorage.getItem(key)
                if (sk) {
                    this.localHistorys = JSON.parse(sk)
                } else {
                    this.localHistorys = []
                }
                return this.localHistorys
            },

            activate (key, obj) {
                this.push(key, obj)
                return this.get(key)
            },

            push (key, obj) {
                this.localHistorys = this.get(key)
                let find
                for (let index = 0; index < this.localHistorys.length; index++) {
                    const element = this.localHistorys[index]
                    if (element.keyword === obj.keyword) {
                        find = index
                        break
                    }
                }
                if (find >= 0) {
                    this.localHistorys.splice(find, 1)
                }
                if (this.localHistorys.length >= this.max) {
                    this.localHistorys.pop()
                }
                this.localHistorys = [obj, ...this.localHistorys]
                window.localStorage.setItem(key, JSON.stringify(this.localHistorys))
                return this.localHistorys
            },

            splice (key, index) {
                if (index >= 0) {
                    this.localHistorys.splice(index, 1)
                    window.localStorage.setItem(key, JSON.stringify(this.localHistorys))
                }
            }
        }

        new Vue({
            el: '#zotero-plus',
            data: function() {
                return {
                    zotero: {
                        title: '',
                        creators: [{
                            creatorType: 'author',
                            lastName: ''
                        }],
                        abstractNote: '',
                        series: '',
                        seriesNumber: '',
                        volume: '',
                        numberOfVolumes: '',
                        edition: '',
                        place: '',
                        publisher: '',
                        date: '',
                        numPages: '',
                        language: '',
                        ISBN: '',
                        shortTitle: '',
                        url: '',
                        archive: '',
                        archiveLocation: '',
                        callNumber: '',
                        rights: '',
                        extra: '',
                        notes: [{
                            enabled: false,
                            note: ''
                        }, {
                            enabled: true,
                            note: ''
                        }, {
                            enabled: true,
                            note: ''
                        }],
                        attachments:[{
                            enabled: true,
                            linkMode: '',
                            mimeType: 'application/pdf',
                            url: ''
                        }, {
                            enabled: true,
                            linkMode: '',
                            mimeType: 'application/pdf',
                            url: ''
                        }, {
                            enabled: true,
                            linkMode: 'linked_url',
                            mimeType: '',
                            url: ''
                        }],
                        tags: [],
                        tagenabled: true,
                        initd: false,
                        drawer: false,
                        tagVisible: false,
                        tagValue: '',
                        zoteroTagsHistory: []
                    }
                }
            },
            methods: {
                doPerson(data, creatorType) {
                    if (!data || data.length <= 0) return;
                    const persons = data.split('/');
                    var creators = []
                    for (var person of persons) {
                        creators.push({
                            lastName: person.trim().replace(/(更多\.\.\.|. 著)/, ''),
                            creatorType: creatorType,
                            fieldMode: 1
                        });
                    }
                    return creators;
                },
                getIDFromURL(url) {
                    if (!url) return '';

                    var id = url.match(/subject\/.*\//g);
                    if (!id) return '';

                    return id[0].replace(/subject|\//g, '');
                },
                showZotero() {
                    if (!this.zotero.initd) {
                        this.zotero.title = text(document, 'h1 span[property="v:itemreviewed"]');
                        this.zotero.creators = [];
                        var infos = text(document, 'div[class*="subject"] div#info');
                        infos = infos.replace(/^[\xA0\s]+/gm, '')
                            .replace(/[\xA0\s]+$/gm, '')
                            .replace(/\n+/g, '\n')
                            .replace(/:\n+/g, ': ')
                            .replace(/]\n/g, ']')
                            .replace(/】\n/g, '】')
                            .replace(/\n\/\n/g, '/');
                        for (var section of Object.values(infos.split('\n'))) {
                            if (!section || section.trim().length <= 0) continue;

                            let index = section.indexOf(':');
                            if (index <= -1) continue;

                            let key = section.substr(0, index).trim();
                            let value = section.substr(index + 1).trim();
                            switch (key) {
                                    // book
                                case "作者":
                                    this.zotero.creators.push(...this.doPerson(value, "author"));
                                    break;
                                case "译者":
                                    this.zotero.creators.push(...this.doPerson(value, "translator"));
                                    break;
                                case "原作名":
                                case "副标题":
                                    if (this.zotero.shortTitle && this.zotero.shortTitle.length >= 1) {
                                        this.zotero.shortTitle += " / " + value;
                                    }
                                    else {
                                        this.zotero.shortTitle = value;
                                    }
                                    break;
                                case "ISBN":
                                    this.zotero.ISBN = value;
                                    break;
                                case "页数":
                                    this.zotero.numPages = value;
                                    break;
                                case "出版社":
                                    this.zotero.publisher = value;
                                    break;
                                case "出品方":
                                    this.zotero.rights = value;
                                    break;
                                case "丛书":
                                    this.zotero.series = value;
                                    break;
                                case "出版年":
                                    this.zotero.date = value;
                                    break;
                                case "语言":
                                    this.zotero.language = value;
                                    break;
                                default:
                                    break;
                            }
                        }
                        this.zotero.seriesNumber = '';
                        this.zotero.volume = '';
                        this.zotero.numberOfVolumes = '';
                        this.zotero.place = '';
                        var edition = this.zotero.title.match(/第(.*?)版/);
                        this.zotero.edition = edition ? edition[1] : '';
                        this.zotero.url = location.href;
                        this.zotero.callNumber = '';
                        this.zotero.cover_url = document.querySelector('.nbg').href;

                        // 中图clc作为标签，需要安装油猴插件：https://greasyfork.org/zh-CN/scripts/408682
                        var clc = text(document, '#clc');
                        if (clc) {
                            this.zotero.archiveLocation = clc;
                        }
                        var subject = text(document, '#subject');
                        if (subject) {
                            this.zotero.archive = subject;
                        }

                        // 摘要
                        let abstractNote;
                        var h2s = document.querySelectorAll('div.related_info h2');
                        for (var i = 0; i < h2s.length; i++) {
                            let h2 = h2s[i];
                            let span = h2.querySelector('span');
                            if (span && span.textContent === '内容简介') {
                                var intro = h2.nextElementSibling.querySelector('.all div.intro');
                                if (!intro) {
                                    intro = h2.nextElementSibling.querySelector('div.intro');
                                }
                                if (intro) {
                                    abstractNote = intro.textContent;
                                }
                                break;
                            }
                        }
                        if (abstractNote) {
                            this.zotero.abstractNote = abstractNote.trim().replace(/(([\xA0\s]*)\n([\xA0\s]*))+/g, '\n');
                        }

                        this.zotero.notes = [{
                            enabled: false,
                            note: ''
                        }, {
                            enabled: LocalStorage.get('Zotero-config', 'captureCatalogues', true),
                            note: ''
                        }, {
                            enabled: LocalStorage.get('Zotero-config', 'captureComments', true),
                            note: ''
                        }];
                        let id = this.getIDFromURL(this.zotero.url);
                        let dir = text(document, '#dir_' + id + '_full');
                        if (dir) {
                            dir = dir.replace(/(([\xA0\s]*)\n([\xA0\s]*))+/g, '\n').replace('· · · · · ·     (收起)', '');
                            this.zotero.notes[1].note = dir;
                        }

                        this.zotero.attachments = [{
                            enabled: LocalStorage.get('Zotero-config', 'captureAssistUrl', true),
                            mimeType: 'application/pdf',
                            url: ''
                        }, {
                            enabled: LocalStorage.get('Zotero-config', 'captureCntUrl', true),
                            mimeType: 'application/pdf',
                            url: ''
                        }, {
                            enabled: LocalStorage.get('Zotero-config', 'captureWereadUrl', true),
                            linkMode: 'linked_url',
                            url: ''
                        }];
                        var assistUrl = document.getElementById('assistUrl');
                        this.zotero.attachments[0].url = assistUrl ? assistUrl.href : '';
                        var cntUrl = document.getElementById('cntUrl');
                        this.zotero.attachments[1].url = cntUrl ? cntUrl.href : '';
                        var weread = document.querySelector('#weread a');
                        this.zotero.attachments[2].url = weread ? weread.href : '';

                        // 豆瓣短评
                        /*for (let item of document.querySelectorAll('#new_score li.comment-item')) {
                            var people = item.querySelector('.comment-info a').textContent;
                            var time = item.querySelector('.comment-time').textContent;
                            var count = item.querySelector('.vote-count').textContent;
                            var content = item.querySelector('.comment-content .short').textContent;
                            var stars = item.querySelector('.user-stars').getAttribute('class').match(/\d/g).join('.');
                            this.zotero.notes[2].note += `<p style="margin: 0;><b>${people}</b><span style="color: #A0A0A0;">(${time})</span>: <span style="color: #FFA228;">[${stars}]</span> ${content} <span style="color: #2D6CA0;">(${count}有用)</span></p>\n`;
                        };
                        this.zotero.notes[2].note += '<p>' + document.querySelector('#comment-list-wrapper + p a').outerHTML + '</p>';*/

                        this.zotero.notes[2].note = '获取中...';
                        loadDoc(`${this.zotero.url}/comments`, {vue: this}, function(doc, responseDetail, meta) {
                            meta.vue.zotero.notes[2].note = '';
                            for (let item of doc.querySelectorAll('#comments li.comment-item')) {
                                var people = item.querySelector('.comment-info a').textContent;
                                var time = item.querySelector('.comment-time').textContent;
                                var count = item.querySelector('.vote-count').textContent;
                                var content = item.querySelector('.comment-content .short').textContent;
                                var stars = item.querySelector('.user-stars') ? item.querySelector('.user-stars').getAttribute('class').match(/\d/g).join('.') : '0';
                                meta.vue.zotero.notes[2].note += `<p style="margin: 0;"><b>${people}</b><span style="color: #A0A0A0;">(${time})</span>: <span style="color: #FFA228;">[${stars}]</span> ${content} <span style="color: #2D6CA0;">(${count}有用)</span></p>\n`;
                            };
                            meta.vue.zotero.notes[2].note += '<p>' + document.querySelector('#comment-list-wrapper + p a').outerHTML + '</p>';
                        }, function(err, meta) {
                            meta.vue.zotero.notes[2].note = '发生异常，请刷新重试。';
                        });

                        this.zotero.tags = [];
                        var tags = text(document, 'div#db-tags-section div.indent');
                        if (tags) {
                            tags = tags.replace(/((\s*)\n(\s*))+/g, '\n');
                            for (var tag of tags.split('\n')) {
                                if (!tag || tag.trim().length <= 0) continue;
                                this.zotero.tags.push(tag);
                            }
                        }

                        // 评分 & 评价人数
                        var rating = text(document, 'strong[property*="v:average"]');
                        if (rating && (rating = rating.trim()).length >= 1) {
                            var ratingPeople = text(document, 'div.rating_sum a.rating_people span[property="v:votes"]');
                            if (!ratingPeople || ratingPeople.toString().trim().length <= 0) {
                                ratingPeople = 0;
                            }
                            this.zotero.extra = rating + "/" + ratingPeople;
                        }

                        this.zotero.tagenabled = LocalStorage.get('Zotero-config', 'captureTags', true);

                        this.zotero.zoteroTagsHistory = LocalHistory.get('ZoteroTagsHistory');
                        this.zotero.initd = true;
                    }
                    this.zotero.drawer = true;

                },
                zoteroReset(field) {
                    switch (field) {
                        case 'title':
                            this.zotero.title = text(document, 'h1 span[property="v:itemreviewed"]');
                            break;
                        case 'series':
                            var infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (var section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "丛书":
                                        this.zotero.series = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'seriesNumber':
                            this.zotero.seriesNumber = '';
                            break;
                        case 'volume':
                            this.zotero.volume = '';
                            break;
                        case 'numberOfVolumes':
                            this.zotero.numberOfVolumes = '';
                            break;
                        case 'edition':
                            var title = text(document, 'h1 span[property="v:itemreviewed"]');
                            var edition = title.match(/第(.*?)版/);
                            this.zotero.edition = edition ? edition[1] : '';
                            break;
                        case 'place':
                            this.zotero.place = '';
                            break;
                        case 'publisher':
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "出版社":
                                        this.zotero.publisher = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'date':
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "出版年":
                                        this.zotero.date = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'numPages':
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "页数":
                                        this.zotero.numPages = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'language':
                            this.zotero.language = '';
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "语言":
                                        this.zotero.language = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'shortTitle':
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            this.zotero.shortTitle = '';
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "原作名":
                                    case "副标题":
                                        if (this.zotero.shortTitle && this.zotero.shortTitle.length >= 1) {
                                            this.zotero.shortTitle += " / " + value;
                                        }
                                        else {
                                            this.zotero.shortTitle = value;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'archive':
                            this.zotero.archive = '';
                            var subject = text(document, '#subject');
                            if (subject) {
                                this.zotero.archive = subject;
                            }
                            break;
                        case 'archiveLocation':
                            this.zotero.archiveLocation = '';
                            var clc = text(document, '#clc');
                            if (clc) {
                                this.zotero.archiveLocation = clc;
                            }
                            break;
                        case 'callNumber':
                            this.zotero.callNumber = '';
                            break;
                        case 'rights':
                            this.zotero.rights = '';
                            infos = text(document, 'div[class*="subject"] div#info');
                            infos = infos.replace(/^[\xA0\s]+/gm, '')
                                .replace(/[\xA0\s]+$/gm, '')
                                .replace(/\n+/g, '\n')
                                .replace(/:\n+/g, ': ')
                                .replace(/]\n/g, ']')
                                .replace(/】\n/g, '】')
                                .replace(/\n\/\n/g, '/');
                            for (section of Object.values(infos.split('\n'))) {
                                if (!section || section.trim().length <= 0) continue;

                                let index = section.indexOf(':');
                                if (index <= -1) continue;

                                let key = section.substr(0, index).trim();
                                let value = section.substr(index + 1).trim();
                                switch (key) {
                                    case "出品方":
                                        this.zotero.rights = value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'extra':
                            this.zotero.extra = '';
                            var rating = text(document, 'strong[property*="v:average"]');
                            if (rating && (rating = rating.trim()).length >= 1) {
                                var ratingPeople = text(document, 'div.rating_sum a.rating_people span[property="v:votes"]');
                                if (!ratingPeople || ratingPeople.toString().trim().length <= 0) {
                                    ratingPeople = 0;
                                }
                                this.zotero.extra = rating + "/" + ratingPeople;
                            }
                            break;
                        case 'catalogues':
                            this.zotero.notes[1].note = '';
                            var id = this.getIDFromURL(this.zotero.url);
                            var dir = text(document, '#dir_' + id + '_full');
                            if (dir) {
                                dir = dir.replace(/(([\xA0\s]*)\n([\xA0\s]*))+/g, '\n').replace('· · · · · ·     (收起)', '');
                                this.zotero.notes[1].note = dir;
                            }
                            break;
                        case 'tags':
                            this.zotero.tags = [];
                            var tags = text(document, 'div#db-tags-section div.indent');
                            if (tags) {
                                tags = tags.replace(/((\s*)\n(\s*))+/g, '\n');
                                for (var tag of tags.split('\n')) {
                                    if (!tag || tag.trim().length <= 0) continue;
                                    this.zotero.tags.push(tag);
                                }
                            }
                            break;
                        case 'attachments':
                            this.zotero.attachments = [{
                                enabled: LocalStorage.get('Zotero-config', 'captureAssistUrl', true),
                                mimeType: 'application/pdf',
                                url: ''
                            }, {
                                enabled: LocalStorage.get('Zotero-config', 'captureCntUrl', true),
                                mimeType: 'application/pdf',
                                url: ''
                            }, {
                                enabled: LocalStorage.get('Zotero-config', 'captureWereadUrl', true),
                                linkMode: 'linked_url',
                                url: ''
                            }];
                            var assistUrl = document.getElementById('assistUrl');
                            this.zotero.attachments[0].url = assistUrl ? assistUrl.href : '';
                            var cntUrl = document.getElementById('cntUrl');
                            this.zotero.attachments[1].url = cntUrl ? cntUrl.href : '';
                            var weread = document.querySelector('#weread a');
                            this.zotero.attachments[2].url = weread ? weread.href : '';
                            this.$message.success('刷新成功');
                            break;
                        default:
                            break;
                    }
                },
                zoteroCreatorUp(index) {
                    let {creatorType, lastName} = this.zotero.creators[index];
                    this.zotero.creators[index].creatorType = this.zotero.creators[index - 1].creatorType;
                    this.zotero.creators[index].lastName = this.zotero.creators[index - 1].lastName;
                    this.zotero.creators[index - 1].creatorType = creatorType;
                    this.zotero.creators[index - 1].lastName = lastName;
                },
                zoteroCreatorDown(index) {
                    let {creatorType, lastName} = this.zotero.creators[index];
                    this.zotero.creators[index].creatorType = this.zotero.creators[index + 1].creatorType;
                    this.zotero.creators[index].lastName = this.zotero.creators[index + 1].lastName;
                    this.zotero.creators[index + 1].creatorType = creatorType;
                    this.zotero.creators[index + 1].lastName = lastName;
                },
                zoteroCreatorAdd(creator, index) {
                    this.zotero.creators.splice(index + 1, 0, {
                        creatorType: creator.creatorType,
                        lastName: ''
                    });
                },
                zoteroCreatorRemove(creator, index) {
                    this.zotero.creators.splice(index, 1);
                },
                zoteroRemoveTag(tag) {
                    this.zotero.tags.splice(this.zotero.tags.indexOf(tag), 1);
                    this.zotero.tagenabled = this.zotero.tags.length > 0;
                    this.zoteroEnabledChange('captureTags', this.zotero.tagenabled);
                },
                zoteroClearTags() {
                    this.zotero.tags = [];
                    this.zotero.tagenabled = false;
                    this.zoteroEnabledChange('captureTags', this.zotero.tagenabled);
                },
                zoteroShowInputTag() {
                    this.zotero.tagValue = '';
                    this.zotero.tagVisible = true;
                    this.$nextTick(_ => {
                        this.$refs.zoteroSaveTagInput.focus();
                    });
                },
                zoteroInputTagConfirm() {
                    let tagValue = this.zotero.tagValue;
                    if (tagValue) {
                        this.zotero.tags.push(tagValue);
                        this.zotero.zoteroTagsHistory = LocalHistory.activate('ZoteroTagsHistory', {keyword: tagValue});

                        this.zotero.tagenabled = true;
                        this.zoteroEnabledChange('captureTags', this.zotero.tagenabled);
                    }
                    this.zotero.tagVisible = false;
                    this.zotero.tagValue = '';
                },
                zoteroSelectTagConfirm(tagHistory) {
                    this.zotero.tags.push(tagHistory.keyword);
                    this.zotero.zoteroTagsHistory = LocalHistory.activate('ZoteroTagsHistory', tagHistory);
                    this.zotero.tagenabled = true;
                    this.zoteroEnabledChange('captureTags', this.zotero.tagenabled);
                    this.zotero.tagVisible = false;
                    this.zotero.tagValue = '';
                },
                zoteroEnabledChange(item, checked) {
                    LocalStorage.set('Zotero-config', item, checked)
                },
                zoteroNote2Input() {
                    this.zotero.notes[0].enabled = this.zotero.notes[0].note.length > 0;
                },
                zoteroNote2Change() {
                    this.zotero.notes[1].enabled = this.zotero.notes[1].note.length > 0;
                    this.zoteroEnabledChange('captureCatalogues', this.zotero.notes[1].enabled);
                },
                zoteroTagsHistoryQuerySearch(queryString, cb) {
                    var zoteroTagsHistory = this.zotero.zoteroTagsHistory || [];
                    var results = queryString ? zoteroTagsHistory.filter((tag) => {
                        return (tag.keyword.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                    }) : zoteroTagsHistory;
                    cb(results);
                }
            }
        })
    }

    function addViewOrEmbody(isbnselecter, titleselecter) {
        let match = document.querySelector(isbnselecter).innerText.match(/ISBN.*/)
        if (match) {
            let isbn = match[0].replace(/\D/g, '');
            doGet('http://api.uread.today/master/anon/book/get?isbn=' + isbn, {isbn: isbn}, function(ret, responseDetail, meta) {
                if (ret && ret.resultcode === 1) {
                    $(titleselecter).append('<a target="_blank" href="http://uread.today/book?doi=' + ret.data + '" style="margin-left: 20px !important"><img title="查看" width="15px" src="data:image/jpeg;base64,/9j/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//dAAQAAv/uAA5BZG9iZQBkwAAAAAH/wAARCAAPAA8DABEAAREBAhEB/8QAbAABAQEAAAAAAAAAAAAAAAAACAkKAQEBAQAAAAAAAAAAAAAAAAAFBgQQAAEFAAIDAQEAAAAAAAAAAAUCAwQGBwEICRESEyIRAAICAgEDBAIDAAAAAAAAAAECAxEEBSESEzEABiJBFBUyUXH/2gAMAwAAARECEQA/ANNvm77NTOtHUMNO+XBgHS9goVGslyZuJCkSqyOFyZOk8xBhcRHlFeSVuTQli/hpvn3DkSPf9fHHNL7Y1eDtcuSLOyvxQkJZWpWJawvh6U0CSQSOBf1RN2+xzdTrptjrtadxnQxsyYQmXGOSwHEQyHKpEx8qzkKzAISOsEVVza8D9LoFOv4tthiFb66KPNw45oDY0DnSERp6UJcOVYmZrZSUJlqXGedgy5MVTzSvzcWn0rmemjEUrRg9QViLoiwPBo8gHyL59a8WWWbGjmnjMM7opaMlWKMQCUZkLIWU/ElGZSQelmFE/wD/0HB526b3G7jGcspNj69RMko+I2bRTIQ4F7DVXSoGgyTMULHrJktnkuvZy3WjbMYKthmTyRIuQIxaY3wlfClfdp7f/W4/UZJj81Bvtm1K8hf5chjwTxVA0ar0Pu591jYAm0GJDm7LvxL2pZzjp2WcLPL3RFN84YyZEj7dTMvbLx31hU+FU524wzND+JBuklNgZwc0MtoabKz2jrAxusqmZ1Ta48OFZwMzsoJRyesNKWRIOwpQ5qQTMS5rkdT7j7j523jw5ZTO0xElVXQT9k+bHi6FjwB/gXIVXKxnqjs0TwSPokc0SPqzX9n1/9k="></a>');
                } else {
                    $(titleselecter).append('<a target="_blank" href="http://uread.today/embody?isbn=' + meta.isbn + '" style="margin-left: 20px !important"><img title="收录" width="15px" src="data:image/jpeg;base64,/9j/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//dAAQAAv/uAA5BZG9iZQBkwAAAAAH/wAARCAAPAA8DABEAAREBAhEB/8QAbAABAQEAAAAAAAAAAAAAAAAACAkKAQEBAQAAAAAAAAAAAAAAAAAFBgQQAAEFAAIDAQEAAAAAAAAAAAUCAwQGBwEICRESEyIRAAICAgEDBAIDAAAAAAAAAAECAxEEBSESEzEABiJBFBUyUXH/2gAMAwAAARECEQA/ANNvm77NTOtHUMNO+XBgHS9goVGslyZuJCkSqyOFyZOk8xBhcRHlFeSVuTQli/hpvn3DkSPf9fHHNL7Y1eDtcuSLOyvxQkJZWpWJawvh6U0CSQSOBf1RN2+xzdTrptjrtadxnQxsyYQmXGOSwHEQyHKpEx8qzkKzAISOsEVVza8D9LoFOv4tthiFb66KPNw45oDY0DnSERp6UJcOVYmZrZSUJlqXGedgy5MVTzSvzcWn0rmemjEUrRg9QViLoiwPBo8gHyL59a8WWWbGjmnjMM7opaMlWKMQCUZkLIWU/ElGZSQelmFE/wD/0HB526b3G7jGcspNj69RMko+I2bRTIQ4F7DVXSoGgyTMULHrJktnkuvZy3WjbMYKthmTyRIuQIxaY3wlfClfdp7f/W4/UZJj81Bvtm1K8hf5chjwTxVA0ar0Pu591jYAm0GJDm7LvxL2pZzjp2WcLPL3RFN84YyZEj7dTMvbLx31hU+FU524wzND+JBuklNgZwc0MtoabKz2jrAxusqmZ1Ta48OFZwMzsoJRyesNKWRIOwpQ5qQTMS5rkdT7j7j523jw5ZTO0xElVXQT9k+bHi6FjwB/gXIVXKxnqjs0TwSPokc0SPqzX9n1/9k="></a>');
                }
            }, function(err, meta) {
                console.warn(err)
            });
        }
    }

    function similar(s, t) {
        if (!s || !t) {
            return 0
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        var min = function(a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res
    }

    function handleuRead() {
        // 试读
        $('#tags').parent().after('<tr><td valign="top" width="60px" class="minor-content">试读：</td> <td class="placeholder-color" id="tryread">...</td></tr>')
        var a = $('#superlibnet');
        if (a) {
            loadSrcDoc (a.attr('href'), {}, function (doc, responseDetail, meta) {
                var element = Object.values(doc.scripts).find(element => element.textContent.includes('send_requestajax'))
                if (element) {
                    var pattern = /".*?"/
                    if (pattern.test(element.textContent)) {
                        var url = pattern.exec(element.textContent)[0].replaceAll('"', '');

                        doText ('http://book.ucdrs.superlib.net/' + url, {}, function (responseText, responseDetail, meta) {
                            var htmlText = unescape(responseText.trim());
                            var html = (new DOMParser()).parseFromString(htmlText, 'text/html');
                            var as = '';
                            var href;
                            for(var a of html.querySelectorAll('.link a')) {
                                if (as.length > 0) {
                                    as += '<span> | </span>'
                                }
                                if (a.textContent === '图书馆文献传递') {
                                    as += '<a href="http://book.ucdrs.superlib.net' + a.href.replace('javascript:subtoRefer(true,', '').replace('\'', '').replace(')', '') + '" target="_blank">' + a.textContent + '</a>'
                                } else {
                                    href = a.href.replace(location.origin, 'http://book.ucdrs.superlib.net');
                                    as += '<a href="' + href + '" target="_blank">' + a.textContent + '</a>'
                                }
                            }

                            loadDoc(href, {}, function(doc, responseDetail, meta) {
                                let $assistUrl = $(doc.querySelector('#downpdf [name=assistUrl]'));
                                let assistUrl = $assistUrl.attr('value');
                                let $cntUrl = $(doc.querySelector('#downpdf [name=cntUrl]'));
                                let cntUrl = $cntUrl.attr('value');

                                as += '<span> | </span><a id="assistUrl" target="_blank" href="' + assistUrl + '" title="版权页、前言页、目录页。">下载辅助页</a>';
                                if (cntUrl) {
                                    as += '<span> | </span><a id="cntUrl" target="_blank" href="' + cntUrl + '">下载正文试读</a>';
                                }
                                $('#tryread').html(as)
                            }, function (responseDetail, meta) {
                                $('#tryread').html(as)
                            });

                        }, function (responseDetail, meta) {
                            $('#tryread').html('<div>无</div>')
                        })
                    }
                }
            }, function (responseDetail, meta) {
                $('#tryread').html('<div>发生异常，请刷新重试。</div>')
            })
        } else {
            $('#tryread').html('<div>无</div>')
        }

        // 电子书
        let title = $('#title').text();
        let srctitle = $('#title > span:nth-child(1)').text();
        let isbn = $('#isbn').text();
        $('#ebook').parent().after('<tr><td valign="top" width="60px" class="minor-content">其他：</td> <td class="placeholder-color" id="otherebook"><span id="ZLibrary"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library(...)' +
                                   '</span><span> | </span><span id="libgen"><img width="12px" src="https://libgen.rs/favicon.ico"> Library Genesis(...)</span>' +
                                   '</span><span> | </span><span id="weread"><img width="12px" src="https://weread.qq.com/favicon.ico"> 微信读书(...)</span>' +
                                   '</span><span> | </span><span id="readersteam">互助联盟(...)</span>' +
                                   '</span><span> | </span><span id="LoreFree"><img width="12px" src="https://ebook2.lorefree.com/favicon.ico"> LoreFree(...)</span>' +
                                   '</span><span> | </span><a id="yabook" target="_blank" href="https://yabook.blog/?q=' + title + '" class="link-item"><img width="12px" src="https://yabook.org/favicon.ico"> 雅书搜索</a>' +
                                   '</td></tr>')
        // Z-Library
        loadDoc('https://1lib.us/s/' + isbn, {title: title, isbn: isbn}, function(doc, responseDetail, meta) {
            let found = false;
            for (let a of doc.querySelectorAll('table.resItemTable h3[itemprop=name] a')) {
                //if (a.textContent.includes(meta.title) || meta.title.includes(a.textContent)) {
                if (similar(a.textContent, meta.title) > 0.5) {
                    let url = a.href.replace(location.host, 'b-ok.global').replace('http:', 'https:');
                    found = true;
                    loadDoc(url, {}, function(doc, responseDetail, meta) {
                        let addDownloadedBook = doc.querySelector('.addDownloadedBook');
                        if (addDownloadedBook) {
                            let txt = addDownloadedBook.textContent.match(/\(.*\)/g);
                            url = addDownloadedBook.href.replace(location.host, 'b-ok.global').replace('http:', 'https:');
                            if ($('#ZLibrary').text().includes('(...)')) {
                                $('#ZLibrary').html('<a target="_blank" href="' + url + '"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library' + txt + '</a>');
                            } else {
                                $('#ZLibrary').append('<a target="_blank" href="' + url + '"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library' + txt + '</a>');
                            }
                        } else {
                            $('#ZLibrary').html('<span style="color:#989B9B"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library(暂无资源)</span>');
                        }
                    }, function(err, meta) {
                        $('#ZLibrary').html('<span style="color:#989B9B"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library(发生异常，请刷新重试。)</span>');
                    });
                }
            }

            if (!found) {
                $('#ZLibrary').html('<span style="color:#989B9B"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library(暂无资源)</span>');
            }
        }, function(err, meta) {
            $('#ZLibrary').html('<span style="color:#989B9B"><img width="12px" src="https://1lib.us/favicon.ico"> Z-Library(发生异常，请刷新重试。)</span>');
        });

        // Library Genesis
        loadDoc('https://libgen.rs/search.php?req=' + isbn + '&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=identifier', {title: title, isbn: isbn}, function(doc, responseDetail, meta) {
            let tr = doc.querySelector('body > table.c > tbody > tr:nth-child(2)');
            if (tr) {
                let size = tr.querySelector('td:nth-child(8)').textContent;
                let extension = tr.querySelector('td:nth-child(9)').textContent;
                let download = tr.querySelector('td:nth-child(10) a');
                $('#libgen').html('<a target="_blank" href="' + download.href + '"><img width="12px" src="https://libgen.rs/favicon.ico"> Library Genesis(' + extension + ', ' + size + ')</a>');
            } else {
                $('#libgen').html('<span style="color:#989B9B"><img width="12px" src="https://libgen.rs/favicon.ico"> Library Genesis(暂无资源)</span>');
            }
        }, function(err, meta) {
                $('#libgen').html('<span style="color:#989B9B"><img width="12px" src="https://libgen.rs/favicon.ico"> Library Genesis(发生异常，请刷新重试。)</span>');
        });

        // 微信读书
        doGet('https://weread.qq.com/web/search/global?keyword=' + title + '&maxIdx=0&fragmentSize=120&count=40', {title: title, isbn: isbn}, function(json, responseDetail, meta) {
            if (json.books && json.books.length > 0) {
                let bookId
                let paring = function (val) {
                    return val.replace(/（/g, '')
                        .replace(/）/g, '')
                        .replace(/【|﹝|〔/g, '')
                        .replace(/】|﹞|〕/g, '')
                        .replace(/ *编|著|译|等|校/g, '')
                        .replace(/翻译/g, '')
                        .replace(/\(审校\)/g, '')
                        .replace(/译校/g, '')
                        .replace(/编译/g, '')
                        .replace(/正校/g, '')
                        .replace(/•|・|▪/g, '')
                        .replace(/\] +/g, '')
                        .replace(/ *· */g, '')
                        .replace(/ /g, '')
                        .replace(/．/g, '')
                        .replace(/\. */g, '.')
                }

                let createId = function (bookId) {
                    let str = MD5(bookId, false)
                    let strSub = str.substr(0, 3)

                    let func = function (id) {
                        if (/^\d*$/.test(id)) {
                            for (var len = id['length'], c = [], a = 0; a < len; a += 9) {
                                var b = id['slice'](a, Math.min(a + 9, len))
                                c['push'](parseInt(b)['toString'](16))
                            }
                            return ['3', c]
                        }
                        for (var d = '', i = 0; i < id['length']; i++) {
                            d += id['charCodeAt'](i)['toString'](16)
                        }
                        return ['4', [d]]
                    }

                    let fa = func(bookId)
                    strSub += fa[0],
                        strSub += 2 + str['substr'](str['length'] - 2, 2)
                    for (var m = fa[1], j = 0; j < m.length; j++) {
                        var n = m[j].length.toString(16)
                        1 === n['length'] && (n = '0' + n), strSub += n, strSub += m[j], j < m['length'] - 1 && (strSub += 'g')
                    }
                    return strSub.length < 20 && (strSub += str.substr(0, 20 - strSub.length)), strSub += MD5(strSub, false).substr(0, 3)
                }
                for (let index = 0; index < json.books.length; index++) {
                    const book = json.books[index]

                    var creators = document.querySelectorAll('#author a')
                    if (creators) {
                        for (const creator of creators) {
                            let author = paring(book.bookInfo.author)
                            let lastName = paring(creator.textContent || '')
                            if (lastName && (lastName.startsWith(author) || lastName.endsWith(author) || author.startsWith(lastName) || author.endsWith(lastName))) {
                                bookId = book.bookInfo.bookId
                                break
                            }
                        }
                    }

                    if (bookId) {
                        break
                    }
                }

                if (bookId) {
                    let urlid = createId(bookId)
                    let url = `https://weread.qq.com/web/reader/${urlid}`
                    $('#weread').html('<a target="_blank" href="' + url + '"><img width="12px" src="https://weread.qq.com/favicon.ico"> 微信读书</a>');
                } else {
                    $('#weread').html('<span style="color:#989B9B"><img width="12px" src="https://weread.qq.com/favicon.ico"> 微信读书(暂无资源)</span>');
                }
            } else {
                $('#weread').html('<span style="color:#989B9B"><img width="12px" src="https://weread.qq.com/favicon.ico"> 微信读书(暂无资源)</span>');
            }
        }, function(err, meta) {
            $('#weread').html('<span style="color:#989B9B">互助联盟(发生异常，请刷新重试。)</span>');
        });

        // 互助联盟
        loadDoc('https://www.readersteam.com/vip/?aff=readersteam&q=' + isbn, {title: title, isbn: isbn}, function(doc, responseDetail, meta) {
            let a = doc.querySelector('dl.result-list > dt:nth-child(1) a');
            if (a) {
                $('#readersteam').html('<a target="_blank" href="' + a.href.replace(location.origin, 'https://www.readersteam.com/vip') + '">互助联盟(发起互助)</a>');
            } else {
                $('#readersteam').html('<span style="color:#989B9B">互助联盟(暂无资源)</span>');
            }
        }, function(err, meta) {
            $('#readersteam').html('<span style="color:#989B9B">互助联盟(发生异常，请刷新重试。)</span>');
        });

        // LoreFree
        let lorefreeurl = 'https://ebook2.lorefree.com/site/index?s=' + srctitle
        loadDoc(lorefreeurl, {title: title, isbn: isbn}, function(doc, responseDetail, meta) {
            let divs = doc.querySelectorAll('div.body-content > div:nth-child(2) div');
            if (divs && divs.length > 0) {
                $('#LoreFree').html('<a target="_blank" href="' + lorefreeurl + '"><img width="12px" src="https://ebook2.lorefree.com/favicon.ico"> LoreFree(' + divs.length + '+)</a>');
            } else {
                $('#LoreFree').html('<span style="color:#989B9B"><img width="12px" src="https://ebook2.lorefree.com/favicon.ico"> LoreFree(暂无资源)</span>');
            }
        }, function(err, meta) {
            $('#LoreFree').html('<span style="color:#989B9B"><img width="12px" src="https://ebook2.lorefree.com/favicon.ico"> LoreFree(发生异常，请刷新重试。)</span>');
        });
    }

    function handleCNKI() {
        let q = getQuery(location.search)
        if (q) {
            $('#txt_search').val(decodeURIComponent(q))
            $('.search-btn').click()
        }
    }

    function handleIsticWelcome() {
        if (document.referrer) {
            let q = getQuery(document.referrer)
            if (q) {
                location.href = `https://ct.istic.ac.cn/site/organize/word?q=${q}`
            }
        }

    }

    function handleIstic() {
        let q = getQuery(location.search)
        if (q) {
            $('#termname').val(decodeURIComponent(q))
            $('#btn-search').click()
        }
    }

    function handleWeread() {
        let q = getQuery(location.search)
        if (q) {
            setTimeout(() => {
                $('.search_input_text').val(decodeURIComponent(q))
                $('.search_input_right').click()
            }, 2000)
        }
    }

    function handleYabook() {
        let q = getQuery(location.search)
        if (q) {
            $('#bdcsMain').val(decodeURIComponent(q))
            $('.btn').click()
        }
    }

    function handleJiumodiary() {
        let q = getQuery(location.search)
        if (q) {
            $('#SearchWord').val(decodeURIComponent(q))
            $('#SearchButton').click()
        }
    }

    function handleNcpssd() {
        let q = getQuery(location.search)
        if (q) {
            $('#text_search').val(decodeURIComponent(q))
            $('#but_search').click()
        }
    }

    function getQuery(url) {
        if (!url) return false;
        var q = url.match(/[?&]q=([^&#]*)/i);
        if (!q || !q[1]) return false;

        return q[1];
    }

    // 判断，空返回空字符串
    function opt(val) {
        if (!val) return '';

        if (val instanceof Array) {
            if (val.length > 0) {
                return val[0];
            }
        } else {
            return val;
        }
    }

    // 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
    function page_parser(responseText, src) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        if (!src) {
            responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
            responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        }
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    // 加载网页
    function loadDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText, false)
                    callback(doc, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // 加载网页
    function loadSrcDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText, true)
                    callback(doc, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // get请求
    function doText (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(responseDetail.responseText, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // get请求
    function doGet (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // post请求
    function doPost (url, headers, data, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: data,
            headers: headers,
            onload: function(responseDetail){
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    function text(docOrElem,selector,index) {
        var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
        return elem ? elem.textContent : null;
   }
})()