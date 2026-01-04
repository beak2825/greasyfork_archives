// ==UserScript==
// @name         阿里云盘一键秒传到115云盘播放
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  先通过alist将阿里云盘资源秒传到115网盘，然后再通过cd2播放，alist转存有缓存时间，cd2是实时，所以用它来播放,需要alist添加阿里云盘和115的存储，挂载路径为阿里云盘和115且需要设置缓存时间设置为1分钟，不然转存后可能要等很久才能够秒传，cd2需添加115网盘，名称为115,阿里云盘需设置默认转存目录进入目标目录后按ALT+S保存，设置的临时目录需和alist挂载设备一致，不可一个在资源库，一个在备份盘
// @author       bygavin
// @match        https://www.aliyundrive.com/drive*
// @match        https://www.alipan.com/drive*
// @match        https://www.aliyundrive.com/s/*
// @match        https://www.alipan.com/s/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501986/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%B8%80%E9%94%AE%E7%A7%92%E4%BC%A0%E5%88%B0115%E4%BA%91%E7%9B%98%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501986/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%B8%80%E9%94%AE%E7%A7%92%E4%BC%A0%E5%88%B0115%E4%BA%91%E7%9B%98%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

//#region 变量定义
var savedevice_id, alistaliyun, getundone, getalist, oneclicksave, startbatch, morethen5G, videonamelist
var obj = {}, pathinfo = {}
const alist115yun = "/115/阿里云转存"
var cd2url = GM_getValue("cd2url") || ''
var alisturl = GM_getValue("alisturl") || ''
var alisttoken = GM_getValue("alisttoken") || ''
var oldxhr = unsafeWindow.XMLHttpRequest
var savemode = GM_getValue("savemode") || 'save115'
const saveinfo = GM_getValue('saveinfo') || {}
const default_drive_id = JSON.parse(localStorage.getItem('token'))?.default_drive_id
function newobj() { }
//#endregion

//#region 劫持send
(function (send) {
    unsafeWindow.XMLHttpRequest.prototype.send = function (sendParams) {
        const sendurl = new URL(this.__recordInfo__.url).pathname
        if (sendurl.endsWith("/file/list") || sendurl.endsWith("/file/list_by_share")) {//修改获取列表数量为200
            const oldargument = JSON.parse(sendParams)
            oldargument.limit && (oldargument.limit = 200)
            arguments[0] = JSON.stringify(oldargument);
        }
        else if (sendurl.endsWith('/batch')) {//强制修改转存路径
            const oldargument = JSON.parse(sendParams)
            oldargument.requests.map(item => {
                if (item.body.to_parent_file_id) {
                    item.body.to_parent_file_id = saveinfo.savefile_id
                    item.body.to_drive_id = saveinfo.savedevice_id
                }
            })
            arguments[0] = JSON.stringify(oldargument);
        }
        send.apply(this, arguments);
    };
})(unsafeWindow.XMLHttpRequest.prototype.send);
//#endregion

//#region 劫持xhr
unsafeWindow.XMLHttpRequest = function () {
    let tagetobk = new newobj();
    tagetobk.oldxhr = new oldxhr();
    let handle = {
        get: function (target, prop) {
            if (prop === 'oldxhr')
                return Reflect.get(target, prop);
            if (typeof Reflect.get(target.oldxhr, prop) === 'function') {
                if (Reflect.get(target.oldxhr, prop + 'proxy') === undefined) {
                    target.oldxhr[prop + 'proxy'] = new Proxy(Reflect.get(target.oldxhr, prop), {
                        apply: function (target, thisArg, argumentsList) {
                            return Reflect.apply(target, thisArg.oldxhr, argumentsList);
                        }
                    });
                }
                return Reflect.get(target.oldxhr, prop + 'proxy')
            }
            const responseURL = new URL(target.oldxhr.responseURL).pathname
            if (responseURL.endsWith('/batch') && prop.indexOf('response') !== -1 && saveinfo.savedevice_id) {
                const res = JSON.parse(target.oldxhr?.response || target.oldxhr?.responseText);
                const resstatus = res.responses.pop()?.status
                if ((resstatus === 200 || resstatus === 201)) {
                    alito115play(saveinfo.alistaliyun, true)
                }
            }
            else if (responseURL.endsWith('file/get_path') && prop.indexOf('response') !== -1) {
                const res = JSON.parse(target.oldxhr?.response || target.oldxhr?.responseText);
                savedevice_id = res.items[0].drive_id
                let dirlist = res.items.map(item => item.name).reverse()
                if (savedevice_id === default_drive_id)
                    dirlist = ["备份文件", ...dirlist]
                alistaliyun = ["阿里云盘", ...dirlist].join('/')
                pathinfo.alistaliyun = alistaliyun
                pathinfo.pathname = location.pathname
            }
            else if ((responseURL.endsWith("file/list") || responseURL.endsWith("file/list_by_share")) && prop.indexOf('response') !== -1) {
                const res = JSON.parse(target.oldxhr?.response || target.oldxhr?.responseText);
                if (res.items?.length) {
                    morethen5G = res.items.filter((item) => { return item.size > 5368709120 }).map(item => item.name).join(',')
                    videonamelist = res.items.map(item => item.name)
                }
            }
            return Reflect.get(target.oldxhr, prop);
        },
        set(target, prop, value) {
            return Reflect.set(target.oldxhr, prop, value);
        },
        has(target, key) {
            return Reflect.has(target.oldxhr, key);
        }
    }
    return new Proxy(tagetobk, handle);
}

//#region 功能主体
function alito115play(videopath, isshare) {
    startbatch && clearTimeout(startbatch)
    startbatch = setTimeout(() => {
        if (videopath)
            obj.showNotify("开始转存:" + videopath);
        else {
            obj.showNotify("无效的资源路径", "fail");
            return
        }
        const resfun = function (response) {
            if (response.status === 200) {
                const alistlistinfo = JSON.parse(response.responseText).data.content
                if (!alistlistinfo) {
                    getalist && clearTimeout(getalist)
                    getalist = setTimeout(() => {
                        obj.showNotify("缓存未刷新，请等待");
                        alistfun("api/fs/list", JSON.stringify({ "path": videopath, "password": "", "page": 1, "per_page": 0, "refresh": false }), resfun)
                    }, 1000)
                }
                else {
                    const savedir = alistlistinfo.length == 1 && alistlistinfo[0].is_dir ? ('/' + alistlist[0]) : ''
                    const pandir = isshare ? '' : ('/' + videopath.split('/').pop())
                    const alistlist = alistlistinfo.map(item => item.name);
                    const potplayerrun = function () {
                        const cd2 = new URL(cd2url)
                        const potplayerurl = `potplayer://${cd2url}static/${cd2.protocol.slice(0, -1) + '/' + cd2.host}/True/${encodeURIComponent(alist115yun + savedir + pandir)}.clfsplaylist.m3u`
                        const dl = document.createElement('a');
                        dl.href = potplayerurl
                        dl.click();
                    }
                    if (!isshare) {
                        if (new Set([...videonamelist, ...alistlist]).size === alistlist.length) {
                            obj.showNotify("资源已存在115网盘中，无需转存，启动potplayer播放115网盘资源");
                            potplayerrun()
                            return
                        }
                    }
                    const copyjson = { "src_dir": videopath, "dst_dir": alist115yun + pandir, "names": alistlist }
                    const removejson = { "dir": videopath, "names": alistlist }
                    obj.showNotify("开始秒传到115");
                    alistfun("api/fs/copy", JSON.stringify(copyjson), function (res1) {
                        if (res1.status === 200) {
                            const removealiyun = function () {
                                alistfun("api/admin/task/copy/undone", null, function (res2) {
                                    if (res1.status === 200) {
                                        const undonelist = JSON.parse(res2.responseText).data.length
                                        if (undonelist) {
                                            obj.showNotify("秒传进行中，请等待");
                                            getundone && clearTimeout(getundone)
                                            getundone = setTimeout(removealiyun, 1000)
                                        }
                                        else {
                                            const play115 = function () {
                                                obj.showNotify("启动potplayer播放115网盘资源");
                                                potplayerrun()
                                            }
                                            if (isshare) {
                                                obj.showNotify("开始删除阿里云转存");
                                                alistfun("api/fs/remove", JSON.stringify(removejson), play115)
                                            }
                                            else {
                                                setTimeout(play115, 0)
                                            }
                                        }
                                    }
                                }, 'GET')
                            }
                            getundone && clearTimeout(getundone)
                            getundone = setTimeout(removealiyun, 1000)
                        }
                    })
                }
            }
        }
        if (savemode === 'save115')
            alistfun("api/fs/list", JSON.stringify({ "path": videopath, "password": "", "page": 1, "per_page": 0, "refresh": false }), resfun)
        else {
            const alist115yuns = alist115yun.split('/')
            const dirname = alist115yuns.pop()
            const removejson = { "dir": alist115yuns.join('/'), "names": [dirname] }
            alistfun("api/fs/remove", JSON.stringify(removejson), function () {
                alistfun("api/fs/list", JSON.stringify({ "path": videopath, "password": "", "page": 1, "per_page": 0, "refresh": false }), resfun)
            })
        }
    }, 333)
}
//#endregion

//#region alist请求
function alistfun(url, data, fun, method) {
    GM_xmlhttpRequest({
        method: (method || 'POST'), url: alisturl + url,
        data: data,
        headers: {
            "authorization": alisttoken,
            "content-type": "application/json;charset=UTF-8",
        },
        onload: fun
    });
}
//#endregion
//#endregion

//#region 键盘快捷键
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.code == 'KeyS') {
        if (savedevice_id && alistaliyun) {
            saveinfo.savedevice_id = savedevice_id
            saveinfo.savefile_id = (this.location.pathname.split('/')[4] || 'root')
            saveinfo.alistaliyun = alistaliyun
            obj.confirm('确定设置此目录为临时转存目录?', () => GM_setValue("saveinfo", saveinfo))
        }
    }
});
//#endregion

//#region  svg图标
const aliyunto115 = '<svg class="aliyunto115" fill="#637dff" width="3.7em" height="3.7em"><use xlink:href="#PDSsetting"></use></svg>'
//#endregion

//#region 自定义样式
function setStyle() {
    document.querySelector('#newsetstyle1')?.remove();
    var style = document.createElement('style');
    style.id = 'newsetstyle1'
    style.innerHTML = `
    #setting-panel .breadcrumb-item-link--9zcQY,#confirm-panel .breadcrumb-item-link--9zcQY{color:var(--theme_hover)}
    .history-item{display:flex;margin-bottom:10px}.history-item .breadcrumb-item--j8J5H{max-width:50%}.history-item .breadcrumb-item-link--9zcQY{overflow: hidden;text-overflow: ellipsis;}.history-item input::placeholder{color: #3b8f4c;}
    .right-bottom-container--6JaaW{right:-47px !important;transition:right 0.3s;}.right-bottom-container--6JaaW:hover{right:0px !important;}
    .aliyunto115{position:relative;right:-47px;transition:right 0.3s}.aliyunto115:hover{fill:var(--theme_hover);right:0px;}
    #setting-panel,#confirm-panel{position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:99}
    #setting-panel>div,#confirm-panel>div{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);width:800px}
    #confirm-panel .ant-input{box-shadow:0 0 0 1px var(--theme_primary)}
    .btnsetting{position:absolute;right:10px}
    .btnsetting:hover>.mymemu:not(:empty){display:flex}
    .mymemu{position:relative;display:none;top:-20px}
    .mymemu button{padding:5px 10px;border:none;color:#fff;border-radius:4px;cursor:pointer;margin-top:15px;margin-right:10px}
    .breadcrumb--gnRPG.play-button:hover{color:rebeccapurple}
    .oneclicksave{margin-left:16px;background-color: #00c270 !important;}
    `;
    const Notifycss = [
        ".notify{display:none;position:absolute;top:0;left:25%;width:50%;text-align:center;overflow:hidden;z-index:1010}",
        ".alert-success,.alert-loading{background:#36be63 !important;}",
        ".alert-fail{background:#ff794a !important;}",
        ".alert.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}",
        ".alert.fade.in{opacity:1}"
    ]
    style.innerHTML += Notifycss.join(' ')
    document.head.appendChild(style);
}
setStyle();
//#endregion

//#region 显示管理面板
function showManagementPanel() {
    document.querySelector('#confirm-panel,#setting-panel')?.remove()
    var panelsetting = document.createElement('div');
    panelsetting.id = 'setting-panel';
    panelsetting.style = `z-index: 100;`
    panelsetting.innerHTML =
        `<div><div style="display: flex; "><h2 style="margin-top: 0; margin-bottom: 10px; font-size: 24px;">设置</h2><h2 style="margin:0 auto 10px auto; font-size: 24px;">${!saveinfo.alistaliyun ? '请到目标文件夹按Alt+S设置转存目录' : ('当前转存目录：' + saveinfo.alistaliyun.replace('阿里云盘/', ''))}</h2><div style="display: flex; justify-content: flex-end;top:30px" class="btnsetting"><div class="mymemu" style="right:10px;display:block"><button class="save-button" playinfo-index="-1" style="background-color: #00c270;">保存</button></div></div></div><hr style="margin-bottom: 20px;"><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">115盘存储模式</div></div><ul class="tabs--dur-d tabs--SWY-k" style="flex: 4;margin-left: 10px;"><li class="save115 tab--j-QyM active--SEscZ"><span class="title--la5nd" title="不会进行清理，如115盘容量不够时会失败">保留</span></li><li class="clear115 tab--j-QyM"><span class="title--la5nd" title="转存到115盘之前会删除该文件夹再重新创建">清空</span></li></ul></div><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">CD2网址</div></div><input placeholder="例如：http://192.168.99.211:19798/ 最后需要有/" value='${cd2url}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">Alist网址</div></div><input placeholder="例如：http://192.168.99.211:5244/ 最后需要有/" value='${alisturl}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">Alist Token</div></div><input placeholder="登录alist后，按F12,获取 应用程序>>本地存储>>token 的值" value='${alisttoken}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div>
    </div>`
    document.body.appendChild(panelsetting);
    panelsetting.querySelectorAll('.tab--j-QyM').forEach(item => item.classList.toggle('active--SEscZ', false))
    panelsetting.querySelector('.tab--j-QyM.' + savemode).classList.toggle('active--SEscZ', true)
    panelsetting.addEventListener('click', function (event) {
        let el = event.target;
        if (el == panelsetting)
            panelsetting.parentNode.removeChild(panelsetting);
        else if (el.classList.contains('save-button')) {
            const inputs = panelsetting.querySelectorAll('input')
            GM_setValue('cd2url', inputs[0].value)
            GM_setValue('alisturl', inputs[1].value)
            GM_setValue('alisttoken', inputs[2].value)
            location.reload()
        }
        else if (el.classList.contains('title--la5nd') || el.classList.contains('tab--j-QyM')) {
            el = el.classList.contains('tab--j-QyM') ? el : el.parentElement
            if (!el.classList.contains('active--SEscZ')) {
                panelsetting.querySelectorAll('.tab--j-QyM').forEach(item => item.classList.toggle('active--SEscZ'))
                savemode = el.classList.contains('save115') ? 'save115' : 'clear115'
                GM_setValue('savemode', savemode)
            }
        }
    })
}
//#endregion

//#region 显示提示信息

obj.showNotify = function (message, ...args) {
    if (unsafeWindow.application) {
        unsafeWindow.application.showNotify(message, ...args);
    }
    else {
        document.body.insertAdjacentHTML('beforeend', '<div id="J_Notify" class="notify" style="margin: 10px auto; display: none;"></div>')
        unsafeWindow.application = {
            notifySets: {
                type_class_obj: { success: "alert-success", fail: "alert-fail", loading: "alert-loading" },
                count: 0,
                delay: 3e3
            },
            showNotify: function (message, ...args) {
                const opts = { message: message }
                args.forEach(arg => {
                    if (typeof arg === 'number')
                        opts.time = arg
                    else if (typeof arg === 'string')
                        opts.type = ["success", "fail", "loading"].includes(arg) ? arg : "success"
                });
                var that = this, class_obj = that.notifySets.type_class_obj, count = that.notifySets.count;
                opts.type == "loading" && (delay *= 5);
                var JNotify = document.getElementById('J_Notify');
                if (!document.querySelector(".alert")) {
                    if (JNotify) {
                        JNotify.innerHTML = '<div class="alert in fade button--WC7or primary--NVxfK medium--Pt0UL"></div>';
                        JNotify.style.display = 'block';
                    }
                }
                else {
                    Object.keys(class_obj).forEach(function (key) {
                        JNotify.classList.toggle(class_obj[key], false);
                    });
                }
                var alert = document.querySelector('.alert');
                alert.textContent = opts.message;
                alert.classList.add(class_obj[opts.type]);
                that.notifySets.count += 1;
                var delay = opts.time || that.notifySets.delay;
                setTimeout(function () {
                    if (++count == that.notifySets.count) {
                        that.hideNotify();
                    }
                }, delay);
            },
            hideNotify: function () {
                document.getElementById('J_Notify').innerHTML = '';
            }
        };
        obj.showNotify(message, ...args);
    }
};

obj.hideNotify = function () {
    if (unsafeWindow.application) {
        unsafeWindow.application.hideNotify();
    }
};
//#endregion

//#region 页面完全加载完成执行
new MutationObserver(function () {
    const savebtn = document.querySelector('.right-wrapper--cxNFP,.header--wVY7B')
    if (savebtn && alisturl && alisttoken && !savebtn.querySelector('.oneclicksave')) {
        savebtn.insertAdjacentHTML('beforeend', '<button class="oneclicksave button--WC7or primary--NVxfK medium--Pt0UL btn-save--SqM8z">一键转存播放</button>')
        savebtn.querySelector('.oneclicksave').addEventListener('click', () => {
            const thisrun = function () {
                if (savebtn.classList[0] === 'header--wVY7B') {
                    alistaliyun = pathinfo?.alistaliyun == alistaliyun && pathinfo?.pathname == location.pathname ? alistaliyun : ''
                    alito115play(alistaliyun, false)
                }
                else {
                    oneclicksave = true
                    document.querySelector('.button--WC7or.primary--NVxfK.medium--Pt0UL.btn-save--SqM8z').click()
                }
            }
            if (morethen5G) {
                obj.confirm(morethen5G + "\n超过了5G不支持秒传,是否继续？", () => thisrun())
            } else {
                thisrun()
            }
        })
    }
    const savenow = document.querySelector('.button--WC7or.primary--NVxfK.small--e7LRt.button--a4hgk')
    if (savenow && oneclicksave) {
        oneclicksave = false
        savenow.click()
    }
    const setbutton = document.getElementById('setting-button')
    if (!setbutton) {
        var settingsButton = document.createElement('div');
        settingsButton.innerHTML = `<div id="setting-button" style="cursor:pointer;position: fixed; right: 0px; bottom:92px; z-index:112;border:none;width:auto;">${aliyunto115}</div>`;
        document.body.appendChild(settingsButton);
        settingsButton.addEventListener('click', showManagementPanel);
    }
}).observe(document.body, { childList: true, subtree: true });
//#endregion

//#region 确认框
obj.confirm = function (message, fun) {
    document.querySelector('#confirm-panel,#setting-panel')?.remove()
    var panelconfirm = document.createElement('div');
    panelconfirm.id = 'confirm-panel';
    panelconfirm.style = `z-index: 100;`
    panelconfirm.innerHTML =
        `<div style="background-color: rgb(225, 230, 215);"><div style="display: flex; "><h2 style="margin:0 auto 10px auto; font-size: 24px;">${message}</h2></div><div class="history-item"><div class="mymemu" style="display:block;margin: auto;top: 0px;"><button class="cancel-button" style="background-color: #E6A23C;">取消</button><button class="save-button" style="background-color: #1681FF;">确定</button></div></div>
    </div>`
    document.body.appendChild(panelconfirm);
    panelconfirm.addEventListener('click', function (event) {
        event.target.classList.contains('save-button') && fun && fun();
        (event.target == panelconfirm || event.target.classList.contains('save-button') || event.target.classList.contains('cancel-button')) && panelconfirm.parentNode.removeChild(panelconfirm);
    })

}
//#endregion
