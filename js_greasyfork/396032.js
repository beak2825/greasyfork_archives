// ==UserScript==
// @name bilibili时间线筛选——分组查看b站动态
// @namespace hi94740
// @author hi94740
// @version 2.0.3
// @license MIT
// @description 这个脚本能帮你通过关注分组筛选b站时间线上的动态
// @include https://t.bilibili.com/*
// @run-at document-idle
// @noframes
// @grant unsafeWindow
// @grant GM.getResourceUrl
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require https://cdn.jsdelivr.net/npm/vant@2.8/lib/vant.min.js
// @resource css https://cdn.jsdelivr.net/npm/vant@2.8/lib/index.css
// @downloadURL https://update.greasyfork.org/scripts/396032/bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E7%AD%9B%E9%80%89%E2%80%94%E2%80%94%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/396032/bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E7%AD%9B%E9%80%89%E2%80%94%E2%80%94%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

if (document.URL == "https://t.bilibili.com/" || document.URL.startsWith("https://t.bilibili.com/?")) {

var vmTab
var vmBWList
var validTagIDs
var tagged
var selectedUp
var cardObserver
var tabObserver

const darkStyle = '<style id="btf-dark-style" type="text/css">\
.van-collapse{background-color:#444 !important}\
.van-cell__title{color:white !important}\
.van-switch__node{background-color:#444 !important}\
.van-checkbox__label{color:white !important}\
.van-tab{color:#aaa !important}\
.van-tabs__nav{background-color:#444 !important}\
.van-tab.van-tab--active{color:#00a1d6 !important}\
</style>'

const filterDynamicWithTags = function(selections,excluded) {
  cardObserver.disconnect()
  if (selections == "shamiko"){
    clearFilters()
    autoPadding()
  } else {
    selections = _.castArray(selections).filter(t => validTagIDs.includes(t))
    excluded = _.castArray(excluded).filter(t => validTagIDs.includes(t))
    let excludedUp = excluded.map(t => (tagged[t] || {list:[]}).list).flat()
    let newSelectedUp = _.difference(_.uniq(selections.map(t => (tagged[t] || {list:[]}).list).flat()),excludedUp)
    if (newSelectedUp.length > 0) {
      selectedUp = newSelectedUp
      console.log(selections)
      new Promise(res => {
        let siid = setInterval(function () {
          if ($(".bili-dyn-item").length > 0) {
            clearInterval(siid)
            res()
          }
        })
      }).then(function() {
        clearFilters()
        filterWorker()
        cardObserver.observe($(".bili-dyn-item").parent().parent()[0],{childList:true,subtree:true})
      })
    }
  }
}

function filterWorker() {
  $(".bili-dyn-item").toArray().forEach(c => {
    let author = c.__vue__.author
    if (!(selectedUp.some(up => up.mid == author.mid || author.label == "番剧"))) $(c)[0].hidden = true
  })
  loadMoreDynamics()
  autoPadding()
}

function loadMoreDynamics() {
  if ($(window).height()/($(document).height() - $(document).scrollTop()) > 0.2) {
    $(".load-more").click()
    setTimeout(loadMoreDynamics,100)
  } else {
    if ($(".skeleton").length > 0) {
      if (($($(".skeleton")[0]).offset().top - $(document).scrollTop()) < ($(window).height() + 1000)) {
        forceLoad()
        setTimeout(loadMoreDynamics,100)
      }
    }
  }
}

function forceLoad() {
  let currentY = $(document).scrollTop()
  $(document).scrollTop($(document).height())
  $(document).scrollTop(currentY)
}

function clearFilters() {
  $(".bili-dyn-item").toArray().forEach(c => c.hidden = false)
}

function autoPadding() {
  $("#btf-tab-area").css("padding",($(".bili-dyn-item")[0] && $(".new-notice-bar").length == 0) ? ($(".bili-dyn-item")[0].hidden ? "0px 0px 0px 0px" : "0px 0px 8px 0px") : "0px 0px 8px 0px")
}

function isBangumiTimeline() {
  if ($(".selected").text().includes("番") || $(".selected").text().includes("剧")) {
    $("#btf-tab-area")[0].hidden = true
    $("#btf-bwlist-area")[0].hidden = true
    cardObserver.disconnect()
    clearFilters()
  } else {
    $("#btf-tab-area")[0].hidden = false
    $("#btf-bwlist-area")[0].hidden = false
    vmTab.activeName = "shamiko"
    if (vmTab.complexMode) vmBWList.changed()
  }
}


const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))

function ajaxWithCredentials(url) {
  return new Promise((res,rej) => {
    $.ajax({
      url:url,
      xhrFields: {
        withCredentials: true
      },
      success:res,
      error:rej
    })
  })
}

function fetchTags(requestWithCredentials) {
  let tags = {}
  return requestWithCredentials("https://api.live.bilibili.com/User/getUserInfo")
    .then(data => {
      let uid = data.data.uid
      console.log("uid: " + uid)
      let followingsRequests = requestWithCredentials("https://api.bilibili.com/x/relation/followings?vmid=" + uid + "&pn=1&ps=50")
        .then(data => {
          let gf = range(2,Math.ceil(data.data.total/50),1)
            .map(i => {
              return requestWithCredentials("https://api.bilibili.com/x/relation/followings?vmid=" + uid + "&pn=" + i + "&ps=50")
            })
          gf.unshift(Promise.resolve(data))
          return gf
        })
      return requestWithCredentials("https://api.bilibili.com/x/relation/tags?vmid=" + uid)
        .then(data => {
          let tagsList = data.data
          tagsList.map(tag => {
            tag.list = []
            return tag
          }).forEach(tag => tags[tag.tagid] = tag)
          return {
            tags:tagsList,
            tagged:followingsRequests.then(gf => {
              return Promise.all(gf.map(request => {
                return request.then(data => {
                  let followings = data.data.list
                  followings.forEach(f => {
                    if (f.tag) {
                      let noAliveTag = true
                      f.tag.forEach(t => {
                        if (tags[t]) {
                          tags[t].list.push(f)
                          noAliveTag = false
                        } else console.log("迷之tag：" + t)
                      })
                      if (noAliveTag) tags[0].list.push(f)
                    } else {
                      tags[0].list.push(f)
                    }
                  })
                })
              })).then(() => tags)
            })
          }
        })
    })
}



Promise.all([
  fetchTags(ajaxWithCredentials),
  GM.getResourceUrl("css")
    .then(u => $("head").append([
      '<link rel="stylesheet" href="' + u + '">',
      '<style type="text/css">',
      '.van-collapse-item__title, .van-collapse-item__content {background-color:rgba(0,0,0,0) !important}',
      '.van-cell__value {height:24px;overflow:visible !important}',
      '.van-tab.van-tab--active{color:#00b5e5 !important}',
      '</style>'
    ].join("\n"))),
  new Promise(res => {
    cardObserver = new MutationObserver(filterWorker)
    tabObserver = new MutationObserver(isBangumiTimeline)
    Vue.use(vant.Tab)
    Vue.use(vant.Tabs)
    let siid = setInterval(function () {
      if ($(".bili-dyn-list-tabs").length == 1 && $(".bili-dyn-live-users").length == 1) {
        clearInterval(siid)
        res()
      }
    })
  }).then(function() {
    $(".bili-dyn-list-tabs").after('<div id="btf-tab-area"><div id="btf-tab"></div></div>')
    $(".bili-dyn-live-users").after('<div id="btf-bwlist-area" style="padding-top:8px"><div id="btf-bwlist"></div></div>')
    $("#btf-tab-area")[0].hidden = true
    $("#btf-bwlist-area")[0].hidden = true
    autoPadding()
    tabObserver.observe($(".bili-dyn-list-tabs")[0],{childList:true,subtree:true,attributes:true})
  })
]).then(data => {
  let tagOptions = data[0].tags.filter(t => t.count != 0)
  validTagIDs = tagOptions.map(t => t.tagid)
  let loadCompleted = false
  vmTab = new Vue({
    el:"#btf-tab",
    template: '<van-tabs v-model="activeName" line-height="2px" color="#00a1d6" title-inactive-color="#99a2aa" swipe-threshold="10" :border="false" @click="onClick"><van-tab v-for="tag in (complexMode ? [{tagid:\'shamiko\',name:\'已启用高级筛选\'}] : tags)" :title="tag.name" :name="tag.tagid"></van-tab></van-tabs>',
    data:{
      activeName:"shamiko",
      tags:[{tagid:"shamiko",name:"全部"}].concat(tagOptions),
      complexMode:false
    },
    methods:{onClick:s => {
      if (loadCompleted) setTimeout(filterDynamicWithTags,300,s)
      else {
        setTimeout(() => {vmTab.activeName = "shamiko"},100)
        vant.Toast.fail("分组名单尚未加载完成，请稍后再试！")
      }
    }}
  })
  vmBWList = new Vue({
    el:"#btf-bwlist",
    template:'<van-collapse v-model="nc" :border="false" style="border-radius:4px;background-color:white;" @change="switched"><van-collapse-item title="高级筛选" :border="true" :is-link="false" name="1"><template #value><van-switch :value="sw" size="22px"/></template><div style="display:flex"><van-checkbox-group v-model="blackList" checked-color="#ff2d55" style="padding-right:8px" @change="changed"><van-checkbox v-for="tag in tags" :name="tag.tagid" style="height:40px"><template #icon="{checked}"><van-icon name="cross" :color="checked?\'white\':\'#c8c9cc\'" style="line-height:19.9px" /></template></van-checkbox></van-checkbox-group><van-checkbox-group v-model="whiteList" style="flex-grow:1" @change="changed"><van-checkbox v-for="tag in tags" :name="tag.tagid" style="height:40px">{{tag.name}}<template #icon="{checked}"><van-icon name="success" :color="checked?\'white\':\'#c8c9cc\'" /></template></van-checkbox></van-checkbox-group></div></van-collapse-item></van-collapse>',
    data:{
      nc:[],
      tags:tagOptions,
      whiteList:tagOptions.map(t => t.tagid),
      blackList:[]
    },
    methods:{
      switched:function(sw) {
        console.log(sw)
        if (sw.length > 0) {
          console.log("on")
          vmTab.activeName = "shamiko"
          vmTab.complexMode = true
          this.changed()
        } else {
          console.log("off")
          vmTab.complexMode = false
          filterDynamicWithTags("shamiko")
        }
      },
      changed:function() {
        setTimeout(filterDynamicWithTags,300,this.whiteList,this.blackList)
      }
    },
    computed:{
      sw:function() {
        return this.nc.length > 0
      }
    },
    watch:{
      whiteList:function(n,o) {
        if (n.length > o.length) this.blackList = this.blackList.filter(b => b != n.filter(t => !o.includes(t)))
      },
      blackList:function(n,o) {
        if (n.length > o.length) this.whiteList = this.whiteList.filter(w => w != n.filter(t => !o.includes(t)))
      }
    }
  })
  isBangumiTimeline()
  data[0].tagged.then(data => {
    tagged = data
    loadCompleted = true
  })
  $(".van-tabs__wrap")[0].style["border-radius"] = "4px"
  try {
    if (unsafeWindow.bilibiliEvolved.settings.useDarkStyle) $("head").append(darkStyle)
    unsafeWindow.bilibiliEvolved.addSettingsListener("useDarkStyle",value => value ? $("head").append(darkStyle) : $("#btf-dark-style").remove())
  } catch(e) {
    console.log("dark mode error: ",e)
  }
}).catch(err => {
  console.error(err)
  alert("【b站时间线筛选】脚本出错了！\n请查看控制台以获取错误信息")
})

}
