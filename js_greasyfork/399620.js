// ==UserScript==
// @name         领英批量加人
// @namespace    ༺黑白༻
// @version      1.8.7
// @description  领英批量加人功能
// @author       Paul
// @connect      *
// @match        *linkedin.com/search/results/people*
// @include      *linkedin.com/search/results/people*
// @match        *linkedin.com/in/*?local_name=*
// @include      *linkedin.com/in/*?local_name=*
// @require      https://cdn.bootcss.com/vue/2.6.11/vue.min.js
// @require      https://cdn.bootcss.com/element-ui/2.13.0/index.js
// @resource elementui https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @run-at       document-end
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/399620/%E9%A2%86%E8%8B%B1%E6%89%B9%E9%87%8F%E5%8A%A0%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/399620/%E9%A2%86%E8%8B%B1%E6%89%B9%E9%87%8F%E5%8A%A0%E4%BA%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';

    class AntBase {
        constructor() {
            this.queueStorageName = 'local_name';
        }

        appendHtml(html, dom = document.body) {
            var temp = document.createElement('div');
            temp.innerHTML = html;
            var frag = document.createDocumentFragment();
            frag.appendChild(temp.firstElementChild);
            dom.appendChild(frag);
        }

        execByPromiseAsync(scope, fn) {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 2)
            return new Promise((resolve, reject) => {
                args.unshift({
                    resolve: resolve,
                    reject: reject
                });
                fn.apply(scope, args);
            });
        }

        waitAsync(chkFn, ts = 1000) {
            var hasChkFn = typeof chkFn == 'function';
            var setTimeoutFn = hasChkFn ?
                async (dfd) => {
                    var chkResult = chkFn();
                    var resolve = chkResult == null ? false : typeof chkResult == 'object' ? chkResult.success : chkResult;
                    if (resolve) {
                        dfd.resolve(chkResult);
                    }
                    else setTimeout(setTimeoutFn, ts, dfd);
                }
                : (dfd) => {
                    setTimeout(() => dfd.resolve(), ts);
                }
            return this.execByPromiseAsync(this, setTimeoutFn);
        }

        sleepAsync(ts = 1000) {
            return this.waitAsync(null, ts);
        }

        getRandom(n, m) {
            return parseInt(Math.random() * (m - n + 1) + n);
        }

        log(msg) {
            console.log(msg);
        }

        appendURLParam(url, name, val) {
            if (typeof url != 'string' || url.length <= 0) return url;
            if (url.indexOf('?') == -1) {
                url += "?"
            } else {
                url += "&"
            }
            return url += `${name}=${val}`;
        }

        getURLParam(name) {
            var query = unsafeWindow.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == name) { return pair[1]; }
            }
            return "";
        }

        appendURLStorageParam(url, val) {
            return this.appendURLParam(url, this.queueStorageName, val);
        }

        getURLStorageParam() {
            return this.getURLParam(this.queueStorageName);
        }

        fireKeyEvent(el, evtType, keyCode) {
            var evtObj;
            if (document.createEvent) {
                if (unsafeWindow.KeyEvent) {//firefox 浏览器下模拟事件
                    evtObj = document.createEvent('KeyEvents');
                    evtObj.initKeyEvent(evtType, true, true, unsafeWindow, true, false, false, false, keyCode, 0);
                } else {//chrome 浏览器下模拟事件
                    evtObj = document.createEvent('UIEvents');
                    evtObj.initUIEvent(evtType, true, true, unsafeWindow, 1);

                    delete evtObj.keyCode;
                    if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                        Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                    } else {
                        evtObj.key = String.fromCharCode(keyCode);
                    }

                    if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                        Object.defineProperty(evtObj, "ctrlKey", { value: true });
                    } else {
                        evtObj.ctrlKey = true;
                    }
                }
                el.dispatchEvent(evtObj);

            } else if (document.createEventObject) {//IE 浏览器下模拟事件
                evtObj = document.createEventObject();
                evtObj.keyCode = keyCode
                el.fireEvent('on' + evtType, evtObj);
            }
        }
    }

    class TMBase extends AntBase {
        constructor() {
            super();
            this.GM_getValue_old = GM_getValue;
            this.GM_setValue = GM_setValue;
            this.GM_deleteValue = GM_deleteValue;
            this.GM_addValueChangeListener = GM_addValueChangeListener;
            this.GM_openInTab = GM_openInTab;
            this.GM_removeValueChangeListener = GM_removeValueChangeListener;
            this.GM_addStyle = GM_addStyle;
            this.GM_getResourceText = GM_getResourceText;
        }

        GM_getValue(name, defaultValue = '') {
            return this.GM_getValue_old(name, defaultValue);
        }
    }

    class PersonListAnt extends TMBase {

        constructor() {
            super();

            this.App = null;

            this.GM_addStyle(this.GM_getResourceText("elementui"));
            // 加载 element 字体
            this.GM_addStyle('@font-face{font-family:element-icons;src:url(https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/fonts/element-icons.woff) format("woff"),url(https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/fonts/element-icons.ttf) format("truetype");font-weight:400;font-display:"auto";font-style:normal}');
            // 加载自定义样式
            this.GM_addStyle(`
input.people_ck{ position: absolute;top: 20px;opacity: 100;cursor: pointer;pointer-events:all;}
.ellipsisText{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height: 23px; }
.ctrpanel{ position:fixed;top:0;right:0;height:100%;z-index:999;background-color:#fff; }
.ctrpanel .el-main { width:220px; }
.ctrpanel .hide { display:none; }
`);

            // 创建Vue承载容器
            this._buildHtml();

            // 扩展Vue
            this._buildVueExtends();

            // 创建Vue
            this.App = this._buildVue();
            this.App.instance = this;
            this.App.$mount('#vue');

        }

        _buildHtml() {
            this.appendHtml(
                `<div id="vue" >
                     <el-container class="ctrpanel" >
                         <el-aside width="10px" style="background-color:red;cursor: pointer;" >
                             <span @click="toggleHidePanel=!toggleHidePanel" style="height:100%;widht:100%;display:block;">&nbsp;</span>
                          </el-aside>
                         <el-main :class="{ hide : toggleHidePanel }">
                             <span style="color:red;">软件、网页工具定制，请联系1292956082@qq.com</span>
                             <span v-if="loading">
                                 正在加载数据...
                             </span>
                             <template v-else>
                                 <el-row style="margin-top:10px;">
                                     <el-col :span="12"><el-button type="primary"  @click="sellectedAll" >全选</el-button></el-col>
                                     <el-col :span="12"><el-button type="primary"  @click="refreshInitPage" >刷新</el-button></el-col>
                                 </el-row>
                                 <el-row style="margin-top:10px;">
                                     <el-col :span="24"><el-button type="primary"  @click="selectedSendText" >下一步</el-button></el-col>
                                 </el-row>
                             </template>
                          </el-main>
                     </el-container>
                     <el-dialog title="发送内容模板" :close-on-click-modal="false" :modal="false" :visible.sync="textListDialogVisible" width="50%" >
                         <el-container>
                             <el-header height="50px">
                                 <el-link type="primary" @click="showAddTextContent(true)">添加模板</el-link>
                             </el-header>
                             <el-main>
                                 <el-table :data="textListData" max-height="300" >
                                    <el-table-column type="index"  width="50"></el-table-column>
                                    <el-table-column label="内容">
                                        <template slot-scope="scope">
                                             <div class="ellipsisText">{{scope.row.content}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  label="状态" width="80" >
                                          <template slot-scope="scope">
                                             <span v-if="scope.row.enabled" style="color:#67C23A;">启用中</span>
                                             <span v-else style="color:#E6A23C;">已禁用</span>
                                          </template>
                                    </el-table-column>
                                    <el-table-column  label="状态" width="120" >
                                         <template slot-scope="scope">
                                             <el-dropdown split-button type="primary" @click="editTextContent(scope.$index)" width="120">
                                                 编辑
                                                 <el-dropdown-menu slot="dropdown">
                                                      <el-dropdown-item v-if="scope.row.enabled" @click.native.prevent="toggleSendTextRowStatus(scope.$index,false)" style="color:#E6A23C;">禁用</el-dropdown-item>
                                                      <el-dropdown-item v-else style="color:#67C23A;" @click.native.prevent="toggleSendTextRowStatus(scope.$index,true)">启用</el-dropdown-item>
                                                      <el-dropdown-item style="color:#F56C6C;" @click.native.prevent="deleteSendTextRow(scope.$index, textListData)">移除</el-dropdown-item>
                                                 </el-dropdown-menu>
                                             </el-dropdown>
                                         </template>
                                     </el-table-column>
                                 </el-table>
                             </el-main>
                             <el-footer height="50px">
                                 <el-button type="primary" @click="beginConnectedPeople">开始联系</el-button>
                             </el-footer>
                        </el-container>
                     </el-dialog>
                     <el-dialog title="添加发送内容" :close-on-click-modal="false" :modal="false" :visible.sync="textAddDialogVisible" width="30%" >
                        <el-container>
                             <el-main>
                                <el-form ref="textAddForm" :rules="textAddFormRules" :model="textAddForm" label-width="80px">
                                      <el-form-item label="内容" prop="content">
                                         <el-input type="textarea" :rows="10" v-model="textAddForm.content"></el-input>
                                      </el-form-item>
                                     <el-form-item>
                                         <el-button type="primary" @click="updateTextContent('textAddForm')">确定</el-button>
                                         <el-button @click="closeTextAddDialog('textAddForm')">取消</el-button>
                                     </el-form-item>
                                </el-form>
                             </el-main>
                        </el-container>
                     </el-dialog>
                     <el-dialog v-dialogdrag title="发送情况" :close-on-click-modal="false" :modal="false" :show-close="false" :visible.sync="sendingDialogVisible" width="20%" >
                            <el-row>
                                <el-col :span="24">{{executedMessage}}</el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <el-col :span="8">进度({{totalConnectPeopleCount}})：</el-col>
                                <el-col :span="16"><el-progress :text-inside="true" :stroke-width="20" :percentage="progress"></el-progress></el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <el-col :span="24">
                                     <el-button v-if="isCompleted" size="small" @click="closeSendingDialog">关闭</el-button>
                                     <el-button type="danger" size="small" @click="stopSending" v-else >取消</el-button></el-col>
                            </el-row>
                     </el-dialog>
                 </div>`
            );
        }

        _buildVueExtends() {
            // v-dialogDrag: 弹窗拖拽
            Vue.directive('dialogdrag', {
                bind(el, binding, vnode, oldVnode) {
                    const dialogHeaderEl = el.querySelector('.el-dialog__header')
                    const dragDom = el.querySelector('.el-dialog')
                    dialogHeaderEl.style.cursor = 'move'

                    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
                    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

                    dialogHeaderEl.onmousedown = (e) => {
                        // 鼠标按下，计算当前元素距离可视区的距离
                        const disX = e.clientX - dialogHeaderEl.offsetLeft
                        const disY = e.clientY - dialogHeaderEl.offsetTop

                        // 获取到的值带px 正则匹配替换
                        let styL, styT

                        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
                        if (sty.left.includes('%')) {
                            styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
                            styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
                        } else {
                            styL = +sty.left.replace(/\px/g, '')
                            styT = +sty.top.replace(/\px/g, '')
                        }

                        document.onmousemove = function (e) {
                            // 通过事件委托，计算移动的距离
                            const l = e.clientX - disX
                            const t = e.clientY - disY

                            // 移动当前元素
                            dragDom.style.left = `${l + styL}px`
                            dragDom.style.top = `${t + styT}px`

                            // 将此时的位置传出去
                            // binding.value({x:e.pageX,y:e.pageY})
                        }

                        document.onmouseup = function (e) {
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            })
        }

        _buildVue() {
            return new Vue({
                data() {
                    this.selectedCheckboxList = [];
                    this.sendList = [];
                    this.sendTextListKey = "linkin_SendTextList";
                    this.editorIdx = -1;
                    return {
                        loading: false,
                        textListDialogVisible: false,
                        textListData: [],
                        textAddDialogVisible: false,
                        sendingDialogVisible: false,
                        isExecuting: false,
                        isCompleted: false,
                        currentPeopleName: '',
                        connectSeconds: 0,
                        totalConnectPeopleCount: 0,
                        currentConnectPeopleCount: 0,
                        toggleHidePanel: false,
                        textAddForm: {
                            content: ""
                        },
                        textAddFormRules: {
                            content: [
                                { required: true, message: '请输入内容', trigger: 'blur' },
                                { min: 1, max: 290, message: '长度在 1 到 290 个字符', trigger: 'blur' }
                            ]
                        }
                    };
                },
                mounted() {
                    this.initPeopleAsync().then(() => {
                        var dom = document.querySelector('artdeco-pagination ul');
                        if (dom) {
                            dom.parentElement.addEventListener('click', async e => {
                                if (e && e.target) {
                                    if (e.target.tagName.toLowerCase() != 'ul') {
                                        document.querySelectorAll('.search-results__list li').forEach(o => {
                                            o.parentNode.removeChild(o);
                                        });
                                        await this.instance.waitAsync(() => {
                                            return document.querySelectorAll('.search-results__list li').length > 0;
                                        }, 500);
                                        this.initPeopleAsync();
                                    }
                                }
                            });
                        }
                    });
                },

                computed: {
                    executedMessage() {
                        return this.isExecuting ? `正在联系 ${this.currentPeopleName}...` : this.isCompleted ? "联系完成!" : `${this.connectSeconds}秒后联系下一个人。`;
                    },
                    progress() {
                        return Math.round((this.currentConnectPeopleCount / this.totalConnectPeopleCount) * 100);
                    }
                },

                methods: {
                    async _initPeopleAsync(dfd) {
                        this.loading = true;
                        var domlis, scrollY = 0;
                        await this.instance.waitAsync(() => {
                            if (document.querySelectorAll('.search-results__list li.search-result__occlusion-hint').length <= 0) {
                                return true;
                            }
                            scrollY += 100;
                            if (scrollY > document.body.scrollHeight) scrollY = 0;
                            unsafeWindow.scrollBy(0, scrollY);
                            return false;
                        }, 20);

                        await this.instance.sleepAsync(2000);

                        domlis = document.querySelectorAll('.search-results__list li');
                        domlis.forEach(item => {
                            var btn = item.querySelector('button')
                            if (!item.querySelector("input.people_ck")
                                && btn
                                && ['message', 'connect'].indexOf(btn.innerText.toLowerCase()) != -1
                            ) {
                                item.style.position = "relative";
                                this.instance.appendHtml('<input type="checkbox" class="people_ck" />', item);
                            }
                        });
                        dfd.resolve();
                        this.loading = false;
                    },
                    initPeopleAsync() {
                        return this.instance.execByPromiseAsync(this, this._initPeopleAsync);
                    },
                    sellectedAll() {
                        var cks = document.querySelectorAll('input.people_ck');
                        cks.forEach(item => { if (!item.checked) item.checked = true });
                    },
                    refreshInitPage() {
                        this.initPeopleAsync().then(() => {
                            this.$message({
                                type: 'success',
                                message: '已刷新选择框!'
                            });
                        });
                    },
                    getCheckedPeopleList() {
                        return document.querySelectorAll('input.people_ck:checked');
                    },
                    // 选择发送文本
                    selectedSendText() {
                        var cks = this.getCheckedPeopleList();
                        if (cks.length <= 0) {
                            alert("请选择要联系的人员！")
                            return;
                        }
                        // 组合数据
                        //this.selectedCheckboxList = cks;
                        this.refreshSendTextList();
                        this.textListDialogVisible = true;
                    },
                    // 从缓存中获取发送文本列表
                    getSendTextListByCahce() {
                        return this.instance.GM_getValue(this.sendTextListKey, '[]');
                    },
                    // 设置发送文本列表到缓存
                    setSendTextListToCache() {
                        this.instance.GM_setValue(this.sendTextListKey, JSON.stringify(this.textListData));
                    },
                    // 删除列表项
                    deleteSendTextRow(index, rows) {
                        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            rows.splice(index, 1);
                            this.setSendTextListToCache();
                        }).catch(() => {
                        });
                    },
                    // 切换列表项状态
                    toggleSendTextRowStatus(index, enabled) {
                        this.textListData[index].enabled = enabled;
                    },
                    // 刷新列表
                    refreshSendTextList() {
                        var dataJson = this.getSendTextListByCahce();
                        this.textListData = JSON.parse(dataJson);
                    },
                    // 显示添加内容
                    showAddTextContent(isAdd) {
                        if (isAdd) this.editorIdx = -1;
                        this.textAddDialogVisible = true;
                    },
                    // 编辑内容
                    editTextContent(index) {
                        this.editorIdx = index;
                        this.textAddForm.content = this.textListData[index].content;
                        this.showAddTextContent(false);
                    },
                    // 更新内容
                    updateTextContent(formName) {
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                if (this.editorIdx != -1) {
                                    this.textListData[this.editorIdx].content = this.textAddForm.content;
                                } else {
                                    this.textListData.push({
                                        content: this.textAddForm.content,
                                        enabled: true
                                    });
                                }
                                this.setSendTextListToCache();
                                this.closeTextAddDialog(formName);
                            } else {
                                return false;
                            }
                        });
                    },
                    // 关闭显示添加内容
                    closeTextAddDialog(formName) {
                        this.$refs[formName].resetFields();
                        this.textAddDialogVisible = false;
                    },
                    // 关闭选择文本框
                    closeSelectSendTextDialog() {
                        this.textListDialogVisible = false;
                    },
                    // 关闭发送框
                    closeSendingDialog() {
                        this.sendingDialogVisible = false;
                    },
                    // 停止联系
                    stopSending() {
                        this.$confirm('此操作将终止本轮联系发送, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '取消成功!'
                            });
                            this.isCompleted = true;
                        }).catch(() => {
                        });
                    },
                    // 开始联系
                    beginConnectedPeople() {
                        var sendList = this.textListData.filter(o => o.enabled);
                        if (sendList.length <= 0) {
                            alert("没有可发送文本");
                            return;
                        }

                        var cks = this.getCheckedPeopleList();
                        if (cks.length <= 0) {
                            alert("没有可以联系的人员！")
                            return;
                        }

                        this.selectedCheckboxList = Array.prototype.slice.call(cks);
                        this.sendList = sendList;
                        this.closeSelectSendTextDialog();
                        this.totalConnectPeopleCount = this.selectedCheckboxList.length;
                        this.currentConnectPeopleCount = 0;
                        this.sendingDialogVisible = true;

                        this.connect();
                    },
                    // 执行联系
                    connect() {
                        if (this.selectedCheckboxList.length <= 0) {
                            this.isCompleted = true;
                            return;
                        }
                        this.isCompleted = false;
                        this.currentConnectPeopleCount += 1;
                        this.currentPeopleName = '';
                        this.isExecuting = true;
                        setTimeout(this.doConnectAsync.bind(this, this.selectedCheckboxList.shift()), 100);
                    },
                    // 处理单个联系
                    async doConnectAsync(checkbox) {
                        var item = checkbox.parentElement;
                        var btn = item.querySelector('button.search-result__action-button');
                        // 随机获取一篇 文章
                        var idx = this.instance.getRandom(0,  100) % this.sendList.length;
                        var sendText = this.sendList[idx].content;
                        if (sendText.indexOf("{{Name}}") != -1) {
                            var replaceText = '';
                            var actorNameDom = item.querySelector('span.actor-name');
                            if (actorNameDom) {
                                replaceText = actorNameDom.innerHTML.split(' ')[0];
                            }
                            this.currentPeopleName = replaceText;
                            sendText = sendText.replace('{{Name}}', replaceText);
                        }
                        this.instance.log(sendText);

                        await this.doDetailConnectAsync(item, sendText);

                        this.isExecuting = false;
                        if (this.selectedCheckboxList.length > 0) {
                            // 等待多少秒后执行
                            this.connectSeconds = this.instance.getRandom(10, 60);
                            await this.instance.waitAsync(() => {
                                if (this.isCompleted) return true;
                                this.connectSeconds -= 1;
                                return this.connectSeconds <= 0;
                            }, 1000);
                        }
                        if (!this.isCompleted) {
                            setTimeout(this.connect.bind(this), 100);
                        }
                    },
                    // 开tab页联系
                    async doDetailConnectAsync(item, sendText) {
                        var a, href;
                        if ((a = item.querySelector('a')) && (href = a.getAttribute('href')) && href.indexOf('/in/') != -1) {
                            this.instance.GM_setValue("linkin_sendtext", sendText);
                            await this.openLoadPageAsync(unsafeWindow.location.origin + href);
                        } else {
                            this.instance.log("无法跳转详情！");
                        }
                    },
                    _valueChangeListener: function (dfd, listennerName, listennerTabName, name, old_v, new_v, remote) {
                        if (new_v && remote) {
                            this.instance.log(new_v);
                            this.instance.GM_deleteValue(name);
                            this.instance.GM_removeValueChangeListener(this[listennerName]);
                            delete this[listennerName];
                            if (this[listennerTabName]) this[listennerTabName].close();
                            delete this[listennerTabName];
                            dfd.resolve();
                        }
                    },
                    openLoadPageAsync: async function (url) {
                        return this.instance.execByPromiseAsync(this, dfd => {
                            var index = 0;
                            var name = +new Date() + '_' + index, listennerName = "listener_" + index, listennerTabName = 'listener_tab_' + index;

                            url = this.instance.appendURLParam(url, this.instance.queueStorageName, name);

                            this[listennerName] = this.instance.GM_addValueChangeListener(name, this._valueChangeListener.bind(this, dfd, listennerName, listennerTabName));
                            this[listennerTabName] = this.instance.GM_openInTab(url);
                        });
                    }
                }
            });
        }
    }

    class PersionInfoAnt extends TMBase {
        constructor() {
            super();

            var name = this.getURLParam(this.queueStorageName);

            this.getInfoAsync().then(rs => {
                this.log("name:" + name);
                this.log("getmessage:" + rs);
                // 存入数据
                this.GM_setValue(name, rs);
            });

        }

        async _getInfoAsync(dfd) {
            this.log("_getInfoAsync");
            await this.waitAsync(() => {
                var dom = document.querySelector('section.pv-top-card');
                return dom && dom.innerHTML.length > 0;
            }, 500);
            // 先找 connect btn
            var connectBtn = document.querySelector('section.pv-top-card button.pv-s-profile-actions--connect');
            if (!connectBtn) {
                await this.waitAsync(() => document.querySelectorAll('section.pv-top-card .artdeco-dropdown__content-inner li')
                    .length >
                    0);
                this.log("_getInfoAsync wait complete");
                var items = document.querySelectorAll('section.pv-top-card .artdeco-dropdown__content-inner li')
                connectBtn = Array.prototype.find.call(items,
                    o => {
                        var span = o.querySelector('span.pv-s-profile-actions__label');
                        if (!span) return false;
                        return span.innerHTML.toLowerCase().indexOf('connect') != -1;
                    });
            }
            var message = "not";
            if (connectBtn) {
                this.log("connectBtn");
                connectBtn.click();
                await this.waitAsync(() => {
                    var chkDom = document.querySelector('#artdeco-modal-outlet');
                    return chkDom && chkDom.innerHTML.trim().length > 0
                }, 1000);
                await this.sleepAsync(1000);
                var addNoteBtn = document.querySelector('button[aria-label="Add a note"]');
                if (addNoteBtn) {
                    this.log("addNoteBtn");
                    addNoteBtn.click();
                    await this.sleepAsync(1000);
                    
                }
                var textdom = document.querySelector('#custom-message');
                if(textdom){
                    textdom.value = GM_getValue("linkin_sendtext", '');
                    this.fireKeyEvent(textdom, "keyup");
                    await this.sleepAsync(1000);
                    var doneBtn = document.querySelector('button[aria-label="Done"]');
                    if (!doneBtn) doneBtn = document.querySelector('button[aria-label="Send invitation"]');
                    if (doneBtn) {
                        this.log("doneBtn");
                        doneBtn.click();
                        await this.waitAsync(() => {
                            var chkDom = document.querySelector('#artdeco-modal-outlet');
                            return !chkDom || chkDom.innerHTML.trim().length <= 0
                        }, 1000);
                    }
                }
                message = "ok";
            }
            dfd.resolve(message);
        }
        getInfoAsync() {
            return this.execByPromiseAsync(this, this._getInfoAsync);
        }
    }

    if (unsafeWindow.location.href.toLowerCase().indexOf('linkedin.com/search/results/people') != -1) {
       unsafeWindow.Linkin.AutoAddAnt = new PersonListAnt();
    } else {
       unsafeWindow.Linkin.AutoAddAnt = new PersionInfoAnt();
    }
})();