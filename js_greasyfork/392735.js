// ==UserScript==
// @name     哔哩哔哩会员解析
// @namespace  https://greasyfork.org/zh-CN/users/400035-sh-m
// @version    0.0.7
// @description  2020-08-20更新。[内嵌解析哔哩哔哩]会员视频 [Tampermonkey | Violentmonkey | Greasymonkey 4.0+]
// @author     MS
// require  
// @noframes
// @match    *://*.bilibili.com/*
// @exclude  *://*.bilibili.com/blackboard/*
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @grant    GM.openInTab
// @require  https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @downloadURL https://update.greasyfork.org/scripts/392735/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BC%9A%E5%91%98%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/392735/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BC%9A%E5%91%98%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
/**!
 * 第一部分，函数功能区
 * 以及接口数据
 */
/**
 * addStyle  GMgetValue  GMsetValue 
 * 这几个函数，稍加改进，就可以兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
 */
function addStyle(cssText) {
    let a = document.createElement('style');
    a.textContent = cssText;
    let doc = document.head || document.documentElement;
    doc.appendChild(a);
}

function GMgetValue(name, defaultValue) {
    return GM_getValue(name, defaultValue)
}

function GMsetValue(name, value) {
    GM_setValue(name, value)
}

function fullScreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else {
        elem.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExiFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

function getSite() {
    return location.hostname.replace(/\./g, '');
}

// 把不同的集数据，以站点名为键，分开存储
function saveSet(name, value) {
    let site = getSite();
    let thisSet = GM_getValue(name, {});
    thisSet[site] = value;
    GM_setValue(name, thisSet);
}

function getSet(name, defaultValue) {
    let site = getSite();
    let thisSet = GM_getValue(name, {});
    return thisSet[site] || defaultValue;
}

// 把所有的集数据，以站点名为键放在一起，统一存储
function saveSetValueByName(name, value) {
    let site = getSite();
    let thisSet = GM_getValue("SetValues", {});
    if (!thisSet.hasOwnProperty(site)) { thisSet[site] = {} }
    thisSet[site][name] = value;
    GM_setValue(SetValues, thisSet);
}

function getSetValueByName(name, defaultValue) {
    let site = getSite();
    let thisSet = GM_getValue('SetValues', {});
    try {
        return thisSet[site][name];
    } catch (error) {
        return defaultValue;
    }
}

/**
 * 破解 API，2020-5-13 更新
 */
const APIS = [
       {name:"BZ一号",url:"https://jx.shunyiwenxiu.com/?url=",title:"BZ",intab:1},
       {name:"BZ二号",url:"https://vip.52jiexi.top/?url=",title:"BZ",intab:1},
       {name:"BZ三号",url:"https://jx.688ing.com/?search=",title:"BZ",intab:1},
       {name:"BZ四号",url:"https://api.69ne.com/?url=",title:"BZ",intab:1},    
];

/**
 * 页内播放器组件 intabPlayer.vue
 */
const comIntabPlayer = {
    template: `<div id="intabPlayer" v-if="isShow" ref="intabPlayer" :style="intabPlayerStyle">
    <div id="bar" @mousedown="move">
      <button @click="sizeCode='small'">🗕</button>
      <button @click="sizeCode='medium'">🗗</button>
      <button @click="sizeCode='large'">🗖</button>
      <button @click="sizeCode='fill'">🗔</button>
      <button @click="fullScreen">🡧🡥</button>
      <button @click="closePlayer">🗙</button>
    </div>
    <iframe v-if="src.length" :src="src"></iframe>
  </div>`,
    data() {
        return {
            src: '',
            isShow: 0,
            position: { left: 100, top: 100 },
            sizeCode: 'medium',
            size: { small: 40, medium: 65, large: 90, fill: 100 },
        }
    },
    methods: {
        move(e) {
            let div = this.$refs.intabPlayer;
            let disX = e.clientX - div.offsetLeft;
            let disY = e.clientY - div.offsetTop;
            document.onmousemove = (e) => {
                this.position.left = e.clientX - disX;
                this.position.top = e.clientY - disY;
            };
            document.onmouseup = (e) => {
                saveSet('intabPosition', this.position);
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        fullScreen() {
            let elem = this.$refs.intabPlayer;
            fullScreen(elem);
        },
        closePlayer() {
            this.src = '';
            this.isShow = 0;
        }
    },
    computed: {
        intabPlayerStyle() {
            let width, height, override = '';
            if (this.sizeCode == 'fill') {
                width = window.innerWidth + 'px';
                height = window.innerHeight + 'px';
                override = "left: 0; top: 0;"
            } else {
                width = this.size[this.sizeCode] + '%';
                height = (this.size[this.sizeCode] / 100 * 0.6 * window.innerWidth) + 'px';
            }
            return `left:${this.position.left}px;top:${this.position.top}px;width:${width};height:${height};${override}`;
        }
    },
    mounted: function() {
        this.$nextTick(() => {
            this.$tele.$on('updateSrc', src => {
                this.src = src;
                this.isShow = 1;
            });
            let position = getSet('intabPosition', { left: 100, top: 100 })
            this.position = position;
        });
    }
};

/**
 * intabPlayer CSS
 */
addStyle(`
  button{cursor:pointer}
  #intabPlayer{z-index:999998;position:fixed;display:block;overflow:hidden;resize:both!important;box-shadow:0 0 5px 5px #ffff33cc;color:#3a3a3a!important;padding-bottom:10px}
  #intabPlayer #bar{visibility:hidden;position:absolute;width:100%}
  #intabPlayer:hover #bar{visibility:visible;cursor:move}
  #intabPlayer #bar button{background:yellow;padding:0px 10px;font-size:20px;line-height:30px;border:1px solid #3a3a3a}
  #intabPlayer #bar button:hover{background:red}
  #intabPlayer iframe{width:100%;height:100%;border:0}
`);


/**
 * 编辑API组件 editApis.vue
 */
const comEditApis = {
    template: `<div v-if="isShow" id="editApis">
    <div>
      <button @click="saveApis" class="bigger">保存</button>
      <button @click="closeEdit" class="bigger">关闭</button>
    </div>
    <li v-for="(api,index) in defaultApis.apis" :key="'default'+index">
      <input v-model="api.name" class="short" placeholder="名称" @change="isChanged=1">
      <input v-model="api.url" class="long" placeholder="API地址" @change="isChanged=1">
      <input v-model="api.title" class="short" placeholder="备注" @change="isChanged=1">
      <label><input v-model="api.intab" type="checkbox"><span>页内播放</span></label>
      <button @click="testApi(index, 1)">测试</button>
      <button @click="addApi(index, 1)">增加</button>
      <button @click="deleteApi(index, 1)">删除</button>
    </li>
    <hr>
    <li v-for="(api,index) in myApis.apis" :key="'my'+index">
      <input v-model="api.name" class="short" placeholder="名称" @change="isChanged=1">
      <input v-model="api.url" class="long" placeholder="API地址" @change="isChanged=1">
      <input v-model="api.title" class="short" placeholder="备注" @change="isChanged=1">
      <label><input v-model="api.intab" type="checkbox"><span>页内播放</span></label>
      <button @click="testApi(index, 0)">测试</button>
      <button @click="addApi(index, 0)">增加</button>
      <button @click="deleteApi(index, 0)">删除</button>
    </li>
  </div>`,
    data() {
        return {
            isShow: 0,
            isChanged: 0,
            defaultApis: { apis: [] },
            myApis: { apis: [] }
        }
    },
    methods: {
        saveApis() {
            let defaultApis = this.defaultApis.apis.filter(item => {
                if (item.url) { return item; }
            })
            let myApis = this.myApis.apis.filter(item => {
                if (item.url) { return item; }
            });
            // console.log(defaultApis,myApis);
            GMsetValue("defaultApis", defaultApis);
            GMsetValue("myApis", myApis);
            this.$tele.$emit("updateApis", 0);
            setTimeout(() => {
                this.isShow = 0;
                this.isChanged = 0;
            }, 500);
        },
        closeEdit() {
            if (this.isChanged) {
                let cf = confirm("有改动，未保存就关闭吗?");
                if (cf) {
                    this.isShow = 0;
                    this.isChanged = 0;
                } else {
                    return false;
                }
            } else {
                this.isShow = 0;
                this.isChanged = 0;
            }
        },
        testApi(index, isDefault) {
            let api = isDefault ? this.defaultApis.apis[index].url : this.myApis.apis[index].url;
            window.open(api + location.href, '_blank');
        },
        addApi(index, isDefault) {
            let blankItem = { name: '', url: '', title: '', intab: 0 };
            if (isDefault) {
                this.defaultApis.apis.splice(index + 1, 0, blankItem);
            } else {
                this.myApis.apis.splice(index + 1, 0, blankItem)
            }
        },
        deleteApi(index, isDefault) {
            if (isDefault) {
                this.defaultApis.apis.splice(index, 1)
            } else {
                this.myApis.apis.splice(index, 1)
            }
        }
    },
    mounted: function() {
        this.$nextTick(() => {
            this.$tele.$on("editApis", (defaultApis) => {
                this.defaultApis.apis = GMgetValue('defaultApis', defaultApis);
                let myApis = GMgetValue('myApis', []);
                this.myApis.apis = myApis.length ? myApis : [{ name: '', url: '', title: '', intab: 0 }];
                this.isShow = 1;
            })
        })
    }
};

/**
 * editApis.vue CSS
 */
addStyle(`
  #editApis{z-index:999998;position:fixed;top:0;width:100%;height:100%;background:#3a3a3acc;color:white;text-align:center;overflow:auto}
  #editApis li{list-style-type:none;display:block;margin-bottom:3px}
  #editApis input{border:1px solid #999;padding:3px;margin-right:5px;border-radius:3px}
  #editApis .short{width:100px}
  #editApis .long{width:250px}
  #editApis button{display:inline-block;padding:3px;margin:2px;color:#3a3a3a;background:#ff0;border:0}
  #editApis .bigger{font-size:20px;padding:5px 10px}
`);

/**
 * 主界面 组件
 */
const comMain = {
    template: `<div id="crackVIPSet" ref="crackVIPSet" :style="styleTop">
    <div id="nav">
    <button @mouseover="nav='apis'" @click="quickJump" @mousedown.prevent="moveY" name="quickJump">▶</button>
    <button @mouseover="nav='settings'">☑</button>
    </div>
    <div id="list">
      <div v-if="nav=='apis'">
        <b v-for="(api,index) in apis"
          @click="jump(index)"
          :key="index" :title="api.title||''"
          :data-icon="api.intab ? '🗖' : '🗗'">{{api.name||'未命名'}}</b>
      </div>
      <div v-else-if="nav=='settings'" style="position:relative;top:50px;">
        <b v-for="(key,index) in Object.keys(settings)" :key="index">
          <label>
            <input v-model="settings[key].value" @change="changeSetting(key)" type="checkbox">
            <span>{{settings[key].name}}</span>
          </label>
        </b>
      </div>
    </div>
    <intab-player></intab-player>
    <edit-apis></edit-apis>
  </div>`,
    data() {
        return {
            apis: [],
            defaultApis: [],
            myApis: [],
            settings: {
                openIntab: { value: 0, name: "页内播放" },
                myApisFirst: { value: 0, name: "我的API优先" },
                editApis: { value: 0, name: "管理API" },
            },
            nav: 'apis',
            topOffset: 50,
        }
    },
    components: {
        'intab-player': comIntabPlayer,
        'edit-apis': comEditApis,
    },
    methods: {
        moveY(e) {
            let div = this.$refs.crackVIPSet;
            let disY = e.clientY - div.offsetTop;
            document.onmousemove = (e) => {
                this.topOffset = e.clientY - disY;
            };
            document.onmouseup = (e) => {
                saveSet("topSet", this.topOffset);
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        quickJump() {
            this.jump(0);
        },
        jump(index) {
            let link = this.apis[index].url + location.href;
            // let link = this.apis[index].url+'https://www.iqiyi.com/v_19rr2aihnc.html?vfrm=pcw_home&vfrmblk=CW&vfrmrst=812211_wdljxk_image1';
            if (this.settings.openIntab.value && this.apis[index].intab) {
                // 确保销毁原来的iframe
                this.$tele.$emit('updateSrc', '');
                setTimeout(() => {
                    this.$tele.$emit('updateSrc', link);
                }, 200);
            } else {
                window.open(link, '_blank');
            }

        },
        changeSetting(name) {
            GMsetValue("Settings", this.settings);
            if (name == 'editApis') {
                this.$tele.$emit('editApis', this.defaultApis)
            } else if (name == 'myApisFirst') {
                this.updateApis();
            }
        },
        updateApis() {
            this.defaultApis = GMgetValue('defaultApis', APIS);
            this.myApis = GMgetValue("myApis", []);
            let settings = GMgetValue("Settings", {});
            if (this.settings.myApisFirst.value) {
                this.apis = this.myApis.concat(this.defaultApis);
            } else {
                this.apis = this.defaultApis.concat(this.myApis);
            }
        }
    },
    computed: {
        styleTop() {
            return `top:${this.topOffset}px;`;
        }
    },
    mounted: function() {
        this.$tele.$on('updateApis', () => { this.updateApis() });
        this.$nextTick(() => {
            let topOffset = getSet('topSet', 50);
            this.topOffset = topOffset;

            Object.assign(this.settings, GMgetValue("Settings", {}));
            this.updateApis();
        });
    }
};

/**
 * 主界面 CSS
 */
addStyle(`
  body{padding:0;margin:0}
  #crackVIPSet input[type=checkbox],#editApis input[type=checkbox]{display:none}
  #crackVIPSet input[type=checkbox] + span:before,#editApis input[type=checkbox] + span:before{content:'☒';margin-right:5px}
  #crackVIPSet input[type=checkbox]:checked + span:before,#editApis input[type=checkbox]:checked + span:before{content:'☑';margin-right:5px}
  #crackVIPSet,#editApis,#intabPlayer{font-family:"微软雅黑"}
  #crackVIPSet{z-index:999999;position:fixed;display:grid;grid-template-columns:30px 150px;width:30px;height:50px;overflow:hidden;padding:5px 0 5px 0;opacity:0.4;font-size:12px}
  #crackVIPSet button{cursor:pointer}
  #crackVIPSet:hover{width:180px;height:450px;padding:5px 5px 5px 0;opacity:1}
  #crackVIPSet #nav{display:grid;grid-auto-rows:50px 50px 200px;grid-row-gap:5px}
  #crackVIPSet #nav [name=quickJump]:active{cursor:move}
  #crackVIPSet #nav button{background:yellow;color:red;font-size:20px;padding:0;border:0;cursor:pointer;border-radius:0 5px 5px 0}
  #crackVIPSet #list{overflow:auto;margin-left:2px}
  #crackVIPSet #list b{display:block;cursor:pointer;color:#3a3a3a;font-weight:normal;font-size:14px;padding:5px;background-color:#ffff00cc;border-bottom:1px dashed #3a3a3a}
  #crackVIPSet #list b:before{content:attr(data-icon);padding-right:5px}
  #crackVIPSet #list b:first-child{border-radius:5px 5px 0 0}
  #crackVIPSet #list b:last-child{border-radius:0 0 5px 5px}
  #crackVIPSet #list b:hover{background-color:#3a3a3a;color:white}
`);


/**
 * 第二部分，开始生成主界面
 */
// 通讯总线
Vue.prototype.$tele = new Vue();

let crackApp = document.createElement("div");
crackApp.id = "crackVIPSet";
document.body.appendChild(crackApp);

new Vue({
    el: "#crackVIPSet",
    render: h => h(comMain)
});
