// ==UserScript==
// @name         快捷弹幕
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  B站直播间发送快捷弹幕
// @author       mianju
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.staticfile.org/axios/0.27.2/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439088/%E5%BF%AB%E6%8D%B7%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439088/%E5%BF%AB%E6%8D%B7%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
  function main() {
    initLib()
    initCss()
    waitForLoaded(() => {
      initUi()
    })
  }

  function initLib() {
    let scriptElement = document.createElement('script')
    scriptElement.src = 'https://cdn.staticfile.org/vue/2.6.9/vue.min.js'
    document.head.appendChild(scriptElement)

    let linkElement = document.createElement('link')
    linkElement.rel = 'stylesheet'
    linkElement.href = 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/theme-chalk/index.css'
    document.head.appendChild(linkElement)

    scriptElement = document.createElement('script')
    scriptElement.src = 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/index.js'
    document.head.appendChild(scriptElement)
  }

  function initCss() {
    let css = `
      .el-select .el-input {
          width: 80px;
        }
        .input-with-select .el-input-group__prepend {
          background-color: #fff;
        }
    `
    let styleElement = document.createElement('style')
    styleElement.innerText = css
    document.head.appendChild(styleElement)
  }

  function waitForLoaded(callback, timeout = 10 * 1000) {
    let startTime = new Date()
    function poll() {
      if (isLoaded()) {
        callback()
        return
      }

      if (new Date() - startTime > timeout) {
        return
      }
      setTimeout(poll, 1000)
    }
    poll()
  }

  function isLoaded() {
    if (window.ELEMENT === undefined) {
      return false
    }
    if (document.querySelector('#control-panel-ctnr-box') === null) {
      return false
    }
    return true
  }
  function initUi() {
      var father = document.getElementsByClassName('icon-left-part')[0];
      let quickDanmakuElement = document.createElement('div');
      father.appendChild(quickDanmakuElement);

      new Vue({
          el: quickDanmakuElement,
          template: `
          <span>
        <template style="width: 200px" >
            <el-select v-model="value" placeholder="选择" @change="sendDanmaku" style="width: 80px;height: 24px" size="mini">
                <el-option-group
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                    v-for="danmaku in group.danmakus"
                    :key="danmaku.label"
                    :label="danmaku.label"
                    :value="danmaku.label">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-button icon="el-icon-message" size="mini" circle @click="sendDanmaku(value)"></el-button>
            <el-popover
                placement="bottom"
                title="快捷弹幕设置"
                width="300px"
                trigger="click"
                >
                <span class="demonstration">添加： </span>
                <el-tooltip class="item" effect="dark" content="添加表情包教程：https://bbs.nga.cn/read.php?pid=594434351&opt=128" placement="top">
                <el-input placeholder="请输入内容" v-model="danmaku4add" class="input-with-select" maxlength="20" size="mini" style="width: 300px">
                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="当前" value="cur"></el-option>
                        <el-option label="所有" value="all"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-check" @click="addDanmaku" size="mini"></el-button>
                </el-input>
                </el-tooltip>
                <div class="block" style="margin-top: 10px">
                    <span class="demonstration">删除： </span>
                    <el-cascader
                      size="mini"
                      v-model="danmakus4del"
                      :options="options"
                      :props="{ expandTrigger: 'hover','children': 'danmakus','multiple': 'true','emitPath':'false' }"
                      ></el-cascader>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delDanmakus"></el-button>
                </div>
                <el-button slot="reference" icon="el-icon-setting" size="mini" circle></el-button>
                <div style="margin-top: 10px">
                    自动发送：
                    <el-radio-group v-model="freq" size="mini">
                         <el-radio-button label="高频"></el-radio-button>
                         <el-radio-button label="正常"></el-radio-button>
                         <el-radio-button label="低频"></el-radio-button>
                    </el-radio-group>
                    <el-switch
                        size="mini"
                        v-model="value4switch"
                        :disabled="flag4switch"
                        @change="autoSend">
                    </el-switch>
                </div>
            </el-popover>
        </template>
    </span>
          `,
          data: {
                options: [
                    {
                        label: '所有直播间',
                        value: 'all',
                        danmakus: []
                    },
                    {
                        label: '当前直播间',
                        value: 'cur',
                        danmakus: []
                    }
                ],
                value: '',
                danmaku4add: '',
                select: 'cur',
                danmakus4del: [],
                roomId: 0,
                allRoomDanmakus: [],
                curRoomDanmakus: [],
                key4all: 'allRoomDanmukus',
                key4cur: '',
                value4switch: false,
                interval: null,
                freq: '正常',
                freqopts: {'高频':[30,6000],'正常':[15,12000],'低频':[10,18000]},
                chatInput: null
            },
            methods: {
                "delDanmakus": function () {
                    function del(val,danmakus) {
                        let index = danmakus.indexOf(val);
                        danmakus.splice(index,1);
                    };
                    for (let i=0;i<this.danmakus4del.length;i++){
                        let danmaku = this.danmakus4del[i];
                        if (danmaku[0] == "cur") {
                            del(danmaku[1],this.curRoomDanmakus);
                        } else {
                            del(danmaku[1],this.allRoomDanmakus);
                        }
                    }
                    localStorage.setItem(this.key4cur,JSON.stringify(this.curRoomDanmakus));
                    localStorage.setItem(this.key4all,JSON.stringify(this.allRoomDanmakus));
                    this.danmakus4del = [];
                    this.$message.success("删除成功");
                    this.handleDanmakus();
                },
                "getRoomId": function () {
                    if (window.__NEPTUNE_IS_MY_WAIFU__) {
                        this.roomId = window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.room_info.room_id;
                    } else {
                        let url = document.URL;
                        var re = /\/\d+/.exec(url);
                        this.roomId = re[0].substr(1);
                    }
                },
                "getDanmakus": function (key) {
                    if (localStorage.getItem(key)){
                        return JSON.parse(localStorage.getItem(key));
                    }
                    return [];
                },
                "handleDanmakus": function () {
                    function handle(danmakus4opt,danmakus4room){
                        danmakus4opt.splice(0);
                        for (let i=0;i<danmakus4room.length;i++) {
                            danmakus4opt.push({label:danmakus4room[i],value:danmakus4room[i]});
                        }
                    }
                    handle(this.options[0].danmakus,this.allRoomDanmakus);
                    handle(this.options[1].danmakus,this.curRoomDanmakus);
                },
                "addDanmaku": function () {
                    function add(key,danmakus,danmaku){
                        danmakus.push(danmaku);
                        localStorage.setItem(key,JSON.stringify(danmakus));
                    };
                    if (this.select == "cur") {
                        add(this.key4cur,this.curRoomDanmakus,this.danmaku4add);
                    } else {
                        add(this.key4all,this.allRoomDanmakus,this.danmaku4add);
                    }
                    this.danmaku4add = '';
                    this.$message.success("添加成功");
                    this.handleDanmakus();
                },
                "sendDanmaku": function (danmaku4send) {
                    var patt = /(room|official)(_\d+){1,2}/
                    var jct = getCookie('bili_jct');
                    var date = new Date();
                    var data = new FormData();
                    data.append('bubble',0);
                    data.append('color',16777215);
                    data.append('fontsize',25);
                    data.append('mode',1);
                    data.append('msg',danmaku4send);
                    data.append('rnd',parseInt(date.getTime()/1000));
                    data.append('roomid',this.roomId);
                    data.append('csrf',jct);
                    data.append('csrf_token',jct);
                    if (patt.test(danmaku4send)) {
                        data.set('msg',patt.exec(danmaku4send)[0])
                        data.append('dm_type',1);
                    }
                    let apiClient = axios.create({
                        baseURL: 'https://api.live.bilibili.com',
                        withCredentials: true
                    });
                    apiClient.post('/msg/send',data).then((res)=>{
                        if (res.data.code == 0) {
                            switch (res.data.msg) {
                                case '':
                                    this.$message.success('发送成功 - ' + danmaku4send);
                                    break;
                                /*case 'f':
                                    this.$message.error('发送失败 - 包含B站屏蔽词: ' + danmaku4send);
                                    break;
                                case 'k':
                                    this.$message.error('发送失败 - 包含直播间屏蔽词: ' + danmaku4send);
                                    break;*/
                                case 'same restriction':
                                    this.$message.error('发送失败，该弹幕已被限制，请选择其它弹幕！');
                                    break;
                                case 'max limit exceeded':
                                    this.$message.error('发送失败，弹幕池达到上限！');
                                    break;
                                default:
                                    this.$message.error('发送失败 - ' + res.data.message);
                            }
                        } else {
                            this.$message.error('发送失败 - ' + res.data.message);
                        }
                    }).catch(()=>{
                        this.$message.error('发送失败 - ' + danmaku4send);
                    });
                },
                "autoSend": function(flag) {
                    if (flag) {
                        this.$message.info('自动发送已开启');
                        let count = 0;
                        let _this = this
                        let opt = this.freqopts[this.freq]
                        this.interval = setInterval(
                            ()=>{
                                count++;
                                if (count == opt[0]) {
                                    _this.value4switch = false;
                                    clearInterval(_this.interval)
                                    _this.$message.info('自动发送已关闭');
                                }
                                _this.sendDanmaku(_this.value);
                            },opt[1]
                        );
                    } else {
                        this.$message.info('自动发送已关闭');
                        clearInterval(this.interval);
                    }
                },
                "sendListener": function() {
                    var _this = this;
                    function keydown(event) {
                        if (event.keyCode == 13) {
                            if (_this.chatInput.chatInput != '') {
                                _this.sendDanmaku(_this.chatInput.chatInput);
                            }
                            setTimeout(_this.chatInput.clearInput, 10);
                        }
                    };
                    this.chatInput.onKeyDown = keydown;
                }
            } ,
            created: function () {
                this.getRoomId();
                this.key4cur = this.roomId + '-danmukus';
                this.curRoomDanmakus = this.getDanmakus(this.key4cur);
                this.allRoomDanmakus = this.getDanmakus(this.key4all);
                this.handleDanmakus();
                this.chatInput = document.querySelector('#control-panel-ctnr-box').__vue__;
                this.sendListener();
            },
            computed: {
                flag4switch: function() {
                    return (this.value == '')
                }
            }
      });
  }
  function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
  }
  main()
})();