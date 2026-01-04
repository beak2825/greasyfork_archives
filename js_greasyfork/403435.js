// ==UserScript==
// @name         领英导出好友信息
// @namespace    ༺黑白༻
// @version      1.3
// @description  基于领英好友列表界面，导出好友信息 excel
// @author       Paul
// @connect      *
// @match        *linkedin.com/search/results/people*
// @include      *linkedin.com/search/results/people*
// @match        *linkedin.com/mynetwork/invite-connect/connections/*
// @include      *linkedin.com/mynetwork/invite-connect/connections/*
// @match        *linkedin.com/in/*/detail/contact-info/*
// @include      *linkedin.com/in/*/detail/contact-info/*
// @require      https://lib.baomitu.com/vue/2.6.11/vue.js
// @require      https://lib.baomitu.com/element-ui/2.12.0/index.js
// @resource elementui https://lib.baomitu.com/element-ui/2.12.0/theme-chalk/index.css
// @require      https://cdn.staticfile.org/xlsx/0.15.1/xlsx.core.min.js
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
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403435/%E9%A2%86%E8%8B%B1%E5%AF%BC%E5%87%BA%E5%A5%BD%E5%8F%8B%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/403435/%E9%A2%86%E8%8B%B1%E5%AF%BC%E5%87%BA%E5%A5%BD%E5%8F%8B%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function () {
    'use strict';

    class AntBase {
        constructor() {
            this.queueStorageName = 'local_name';
            this.ArrayPrototype = Array.prototype;
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

        find(source, fn) {
            return this.ArrayPrototype.find.call(source, fn);
        }

        filter(source, fn) {
            return this.ArrayPrototype.filter.call(source, fn);
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
            this.GM_addStyle('@font-face{font-family:element-icons;src:url(https://lib.baomitu.com/element-ui/2.12.0/theme-chalk/fonts/element-icons.woff) format("woff"),url(https://lib.baomitu.com/element-ui/2.12.0/theme-chalk/fonts/element-icons.ttf) format("truetype");font-weight:400;font-display:"auto";font-style:normal}');

            var id = `vue${Date.now()}`;

            this.GM_addStyle(`

.${id}-drawerswitch{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 60px;
    width: 60px;
    z-index: 999;
    border-radius: 50%;
    background-color: #fff; }


`);

            // 创建Vue承载容器
            this._buildHtml(id);

            //  // 创建Vue
            this.App = this._buildVue();
            this.App.instance = this;
            this.App.$mount(`#${id}`);

        }

        _buildHtml(id) {
            this.appendHtml(`
                <div id="${id}">
                    <el-button class="${id}-drawerswitch" @click="drawer = true" ><i class="el-icon-thumb"></i></el-button>
                    <el-drawer
                      title="抓取用户信息"
                      :visible.sync="drawer"
                      :close-on-press-escape="false"
                      :before-close="closeDrawer"
                      direction="ltr"
                      size="20%"
                        >
                      <el-container>
                        <el-main>
                            <el-row>
                                 <el-col :span="8"><el-button type="primary" @click="refresh">刷新</el-button></el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                 <el-col :span="8"><el-button type="primary" @click="starting" :disabled="!canExecute" >开始抓取</el-button></el-col>
                                 <el-col :span="5">&nbsp;</el-col>
                                 <el-col :span="8"><el-button type="primary" @click="stop" :disabled="!this.isRunning" >停止</el-button></el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <el-col :span="8">进度(共{{progressTotal}} 个)：</el-col>
                                <el-col :span="14"><el-progress :text-inside="true" :stroke-width="20" :percentage="progress"></el-progress></el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <el-col :span="24"><el-button type="primary" :disabled="!canExprot" @click="exportData" >导出</el-button></el-col>
                            </el-row>
                        </el-main>
                      </el-container>
                    </el-drawer>
                </div>
            `)
        }

        _buildVue() {
            return new Vue({
                data() {
                    this.currentDictionary = {};
                    this.userStop = false;
                    this.excelCfg = {
                        'firstName': 'firstName',
                        'lastName': 'lastName',
                        '历任公司': 'company',
                        '职位': 'headline',
                        '地址': 'locationName',
                        '邮箱': 'Email'
                    };

                    return {
                        drawer: false,
                        dataLinks: [],
                        isRunning: false,
                        progressTotal: 0,
                        progressIdx: 0,
                    };
                },
                computed: {
                    progress: function () {
                        if (this.progressTotal <= 0) return 0;
                        return Math.round((this.progressIdx / this.progressTotal) * 100);
                    },
                    canExecute() {
                        return !this.isRunning && this.progressIdx != this.progressTotal;
                    },
                    canExprot() {
                        return !this.isRunning && this.progressIdx > 0 ;
                    }
                },
                methods: {
                    refresh() {
                        var links = document.querySelectorAll('.mn-connection-card a.mn-connection-card__link');
                        links.forEach(item => {
                            var href = item.getAttribute('href');
                            if (!this.currentDictionary.hasOwnProperty(href)) {
                                this.currentDictionary[href] = null;
                            }
                            if (this.currentDictionary[href] === null) {
                                this.currentDictionary[href] = {};
                                this.dataLinks.push({ href });
                                this.progressTotal++;
                            }
                        });
                    },
                    closeDrawer(done) {
                        if (this.isRunning) return;
                        done();
                    },
                    // 停止
                    stop() {
                        this.userStop = true;
                    },
                    // 开始抓取
                    starting() {
                        if (this.dataLinks.length <= 0) {
                            this.$message.error('当前没有可执行的记录哦~~');
                            return;
                        }
                        this.isRunning = true;
                        this.userStop = false;
                        this.singleExecuteAsync();
                    },
                    async singleExecuteAsync() {
                        var obs = false;
                        if (!this.userStop) {
                            obs = this.dataLinks.shift();
                        }
                        if (!obs) {
                            this.isRunning = false;
                            this.$message({
                                message: this.userStop ? '用户停止' : '执行完成！',
                                type: 'success'
                            });
                            return;
                        }
                        var href = obs.href;
                        if (Object.keys(this.currentDictionary[href]).length == 0) {
                            this.currentDictionary[href] = await this.openLoadPageAsync(`${unsafeWindow.location.origin}${href}detail/contact-info/`);
                            this.progressIdx++;
                        }
                        setTimeout(this.singleExecuteAsync.bind(this), 100);
                    },
                    openLoadPageAsync(link) {
                        return this.instance.execByPromiseAsync(this, dfd => {
                            var index = 0;
                            var name = `${Date.now()}_${index}`,
                                listennerName = `listener_${name}`,
                                listennerTabName = `listener_tab_${name}`;

                            link = this.instance.appendURLParam(link, this.instance.queueStorageName, name);
                            this[listennerName] = this.instance.GM_addValueChangeListener(name, this._valueChangeListener.bind(this, dfd, listennerName, listennerTabName));
                            this[listennerTabName] = this.instance.GM_openInTab(link);
                        });
                    },
                    _valueChangeListener(dfd, listennerName, listennerTabName, name, old_v, new_v, remote) {
                        if (new_v && remote) {
                            this.instance.log(new_v);
                            this.instance.GM_deleteValue(name);
                            this.instance.GM_removeValueChangeListener(this[listennerName]);
                            delete this[listennerName];
                            if (this[listennerTabName]) this[listennerTabName].close();
                            delete this[listennerTabName];
                            dfd.resolve(JSON.parse(new_v));
                        }
                    },
                    //调整公司数据
                    adjustCompanyData: function (key,dataJson) {
                        var companyArray =[],values = [];
                        try{
                         companyArray =  JSON.parse(dataJson);
                        }catch(e){
                            console.log(key,'error');
                        }
                        companyArray.sort((item1, item2) => {
                            if (!item1.hasOwnProperty('dateRange')) return -1;
                            if (!item2.hasOwnProperty('dateRange')) return 1;

                            if (!item1.dateRange.hasOwnProperty('start')) return -1;
                            if (!item2.dateRange.hasOwnProperty('start')) return 1;

                            if (!item1.dateRange.start.hasOwnProperty('year')) return -1;
                            if (!item2.dateRange.start.hasOwnProperty('year')) return -1;

                            var styear = item1.dateRange.start.year - item2.dateRange.start.year;
                            if (styear != 0) return styear;

                            if (!item1.dateRange.start.hasOwnProperty('month')) return -1;
                            if (!item2.dateRange.start.hasOwnProperty('month')) return -1;

                            var stmonth = item1.dateRange.start.month - item2.dateRange.start.month;
                            if (stmonth != 0) return stmonth;

                            if (!item1.dateRange.hasOwnProperty('end')) return -1;
                            if (!item2.dateRange.hasOwnProperty('end')) return 1;

                            if (!item1.dateRange.end.hasOwnProperty('year')) return -1;
                            if (!item2.dateRange.end.hasOwnProperty('year')) return -1;

                            var etyear = item1.dateRange.end.year - item2.dateRange.end.year;
                            if (etyear != 0) return etyear;

                            if (!item1.dateRange.end.hasOwnProperty('month')) return -1;
                            if (!item2.dateRange.end.hasOwnProperty('month')) return -1;

                            var etmonth = item1.dateRange.end.month - item2.dateRange.end.month;
                            if (etmonth != 0) return etmonth;

                            return 0;
                        });
                        companyArray.forEach(function (item) {
                            var str = "头衔:";
                            if (item.title) {
                                str += item.title;
                            }
                            str += "\n";
                            str += "公司名称:"
                            if (item.companyName) {
                                str += item.companyName;
                            }
                            str += "\n";
                            str += "任期:";
                            if (item.dateRange) {
                                if (item.dateRange.start) {
                                    if (item.dateRange.start.year) {
                                        str += item.dateRange.start.year;
                                    } else {
                                        str += "****";
                                    }
                                    str += "-";
                                    if (item.dateRange.start.month) {
                                        str += item.dateRange.start.month;
                                    } else {
                                        str += "**";
                                    }
                                } else {
                                    str += "****-**";
                                }
                                str += " 至 "
                                if (item.dateRange.end) {
                                    if (item.dateRange.end.year) {
                                        str += item.dateRange.end.year;
                                    } else {
                                        str += "****";
                                    }
                                    str += "-";
                                    if (item.dateRange.end.month) {
                                        str += item.dateRange.end.month;
                                    } else {
                                        str += "**";
                                    }
                                } else {
                                    str += "****-**";
                                }
                            }
                            str += "\n-------------------------------";

                            values.push(str);
                        });
                        return values.join('\n');
                    },
                    exportData: function () {
                        var aoa = [], item, fileds = [], name = [], i, len, temp, key, j, jlen, values, filedName;
                        for (item in this.excelCfg) {
                            fileds.push(this.excelCfg[item]);
                            name.push(item);
                        }
                        aoa.push(name);
                        for (key in this.currentDictionary) {
                            temp = this.currentDictionary[key];
                            if (!temp || typeof (temp) != 'object' || Object.keys(temp).length <= 0) continue;
                            values = [];
                            for (j = 0, jlen = fileds.length; j < jlen; j++) {
                                filedName = fileds[j];
                                values.push(filedName == this.excelCfg["历任公司"] ? this.adjustCompanyData(key,temp[filedName]) : temp[filedName]);
                            }
                            aoa.push(values);
                        }
                        this.exportExcel(aoa);
                    },
                    exportExcel: function (aoa) {
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        this.openDownloadDialog(this.sheet2blob(sheet), "导出数据" + (+new Date()) + '.xlsx');
                    },
                    sheet2blob: function (sheet, sheetName) {
                        sheetName = sheetName || 'sheet1';
                        var workbook = {
                            SheetNames: [sheetName],
                            Sheets: {}
                        };
                        workbook.Sheets[sheetName] = sheet;
                        // 生成excel的配置项
                        var wopts = {
                            bookType: 'xlsx', // 要生成的文件类型
                            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                            type: 'binary'
                        };
                        var wbout = XLSX.write(workbook, wopts);
                        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
                        // 字符串转ArrayBuffer
                        function s2ab(s) {
                            var buf = new ArrayBuffer(s.length);
                            var view = new Uint8Array(buf);
                            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                            return buf;
                        }
                        return blob;
                    },
                    /**
                       * 通用的打开下载对话框方法，没有测试过具体兼容性
                       * @param url 下载地址，也可以是一个blob对象，必选
                       * @param saveName 保存文件名，可选
                       */
                    openDownloadDialog: function (url, saveName) {
                        if (typeof url == 'object' && url instanceof Blob) {
                            url = URL.createObjectURL(url); // 创建blob地址
                        }
                        var aLink = document.createElement('a');
                        aLink.href = url;
                        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                        var event;
                        if (window.MouseEvent) event = new MouseEvent('click');
                        else {
                            event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        }
                        aLink.dispatchEvent(event);
                    },
                }
            });
        }
    }

    class UserInfoAnt extends TMBase {
        constructor() {
            super();
            var name = this.getURLParam(this.queueStorageName);
            this.getInfoAsync().then(rs => {
                this.log("name:" + name);
                this.log(rs);
                // 存入数据
                this.GM_setValue(name, JSON.stringify(rs));
            });
        }

        getInfoAsync() {
            return this.execByPromiseAsync(this, this._getInfoAsync);
        }

        async _getInfoAsync(dfd) {
            this.log("_getInfoAsync");
            var chkResultInfo = await this.waitAsync(() => {
                var domList = document.querySelectorAll('h2');
                var chkResult = this.find(domList, item => item.innerHTML.indexOf('Contact Info') != -1);
                if (!chkResult) return false;
                return { success: true, dom: chkResult }
            }, 500);
            this.log(chkResultInfo);
            var findObj = {};
            // /voyager/api/identity/dash/profiles
            var findDomCode = this.find(document.querySelectorAll('code'), item => item.innerHTML.indexOf('/voyager/api/identity/dash/profiles') != -1 && item.innerHTML.indexOf('FullProfileWithEntities') != -1);
            if (findDomCode) {
                // 找出
                var findCodeObj = JSON.parse(findDomCode.innerHTML);
                var targetCodeDom = document.getElementById(findCodeObj.body);
                if (targetCodeDom) {
                    var tempObj = JSON.parse(targetCodeDom.innerHTML);
                    //  com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities
                    var fullProfileWithEntities = this.find(tempObj.included, item => item.hasOwnProperty('$recipeTypes') && item['$recipeTypes'][0] == 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities');
                    this.log(fullProfileWithEntities);
                    if (fullProfileWithEntities) {
                        Object.assign(findObj, {
                            firstName: fullProfileWithEntities.firstName,
                            lastName: fullProfileWithEntities.lastName,
                            headline: fullProfileWithEntities.headline,
                            locationName: fullProfileWithEntities.locationName
                        });
                    }
                    // com.linkedin.voyager.dash.deco.identity.profile.FullProfilePosition
                    var fullProfilePositionArray = this.filter(tempObj.included, item => item.hasOwnProperty('$recipeTypes') && item['$recipeTypes'][0] == 'com.linkedin.voyager.dash.deco.identity.profile.FullProfilePosition');
                    this.log(fullProfilePositionArray);
                    var companys = [];
                    fullProfilePositionArray.forEach(position => {
                        var dateRange = position.dateRange || {};
                        companys.push({
                            title: position.title,
                            companyName: position.companyName,
                            dateRange: dateRange
                        });
                    });
                    if (companys.length > 0) findObj['company'] = JSON.stringify(companys);

                };
            }
            var findEmailDom = this.find(chkResultInfo.dom.parentElement.querySelectorAll('a'), item => item.getAttribute('href').indexOf('mailto:') != -1);
            findObj.Email = findEmailDom ? findEmailDom.innerText : "";
            dfd.resolve(findObj);
        }
    }

    unsafeWindow.Linkin = {};
    if (unsafeWindow.location.href.toLowerCase().indexOf('/detail/contact-info/') != -1) {
        unsafeWindow.Linkin.AutoCollectionAnt = new UserInfoAnt();
    } else {
        unsafeWindow.Linkin.AutoCollectionAnt = new PersonListAnt();
    }
})();