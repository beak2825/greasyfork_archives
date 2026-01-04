// ==UserScript==
// @name         我的白菜菊花
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cloud sync for bcjh.xyz
// @author       You
// @match        https://bcjh.gitee.io/
// @icon         https://www.google.com/s2/favicons?domain=gitee.io
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432094/%E6%88%91%E7%9A%84%E7%99%BD%E8%8F%9C%E8%8F%8A%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/432094/%E6%88%91%E7%9A%84%E7%99%BD%E8%8F%9C%E8%8F%8A%E8%8A%B1.meta.js
// ==/UserScript==

GM_addStyle ( `
    .el-input input {
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 4px;
    height: 26px;
    line-height: 24px;
    padding-left: 10px;
    padding-right: 23px;
    color: #606266;
    }
    .sync-indicator {
    position: absolute;
    right:0;
    top:0;
    width: 10px;
    height: 10px;
    opacity: 0.8;
    border-radius: 50%;
    background: gray;
    }
    .sync-indicator.unsync {
    background: red;
    }
    .sync-indicator.sync {
    background: green;
    }
    .sync-indicator.syncing {
    background: yellow !important;
    }
` );

const server = "https://keystore.mactype.win:10512"

let localstore = {
    _setItem: window.localStorage.setItem,
    _getItem: window.localStorage.getItem,
    setItem(name, value) {
        return this._setItem.call(window.localStorage, name, value)
    },
    getItem(name) {
        return this._getItem.call(window.localStorage, name)
    }
}

let lastUser = localStorage.getItem("fishcloud") || ""
let vueRoot = null, importCloud = false

let cloudServer = {
    delayedupload() {
        let value = window.localStorage.getItem("data")
        syncIndicator.syncing()
        console.log("Changes detected, uploading...")
        GM_xmlhttpRequest({
            url: server + "/put",
            method: "post",
            data: JSON.stringify({
                user: lastUser,
                key: "data",
                value: value
            }),
            onload: ()=>{
                syncIndicator.synced()
            }
        })
    },
    t: null,
    upload() {
        if (!lastUser) return
        syncIndicator.syncing()
        if (this.t) {
            clearTimeout(this.t)
        }
        this.t = setTimeout(()=>{
            this.t = null
            this.delayedupload()
        }, 1000)
    },
    download(quiet = true) {
        if (!lastUser) return
        syncIndicator.syncing()
        GM_xmlhttpRequest({
            url: server + "/get",
            method: "post",
            data: JSON.stringify({
                user: lastUser,
                key: "data"
            }),
            onload: ({responseText})=>{
                if (responseText) {
                    importCloud = true
                    localstore.setItem("data", responseText)
                    vueRoot && vueRoot.getUserData()
                    setTimeout(()=>{
                        importCloud = false
                    }, 500)
                }
                syncIndicator.synced()
                if (!quiet) {
                    vueRoot && vueRoot.$message({
                        message: "数据已同步",
                        type: "success"
                    })
                }
            },
            onerror: err=>{
                syncIndicator.fail()
                if (!quiet) {
                    alert("同步失败")
                }
            }
        })
    }
}

var syncIndicator = {
    el: null,
    create() {
        $("body").append("<div class='sync-indicator'></div>")
        this.el = $(".sync-indicator")
    },
    syncing() {
        this.el.addClass("syncing")
    },
    fail() {
        this.el.removeClass("syncing sync").addClass("unsync")
    },
    synced() {
        this.el.removeClass("syncing unsync").addClass("sync")
    },
    nop() {
        this.el.removeClass("syncing unsync sync")
    }
}

function updateUser(newUser) {
    lastUser = newUser
    localstore.setItem("fishcloud", newUser)
}

function hookUltimateNavi(e) {
    if (document.getElementById("mycloud")) return
    let box = document.getElementsByClassName("ultimate-box")
    if (box.length) {
        $(box).prepend('<div class="title" id="mycloud">大鱼云同步</div><div class="hr"></div><div class="box-body"><div class="el-input"><span style="margin-right:5px">请输入雨云用户名:</span><input type="text" value="'+lastUser+'" name="fishcloud"></div></div>')
        $(box).find("input[name=fishcloud]").on("change", async function (){
            let newUser = this.value
            if (newUser !== lastUser && lastUser !=="") {
                try {
                    let action = await vueRoot.$confirm("确定要从用户 \""+lastUser+"\" 切换到用户 \""+newUser+"\" 吗？", '切换账户', {
                        type: 'warning'
                    })
                    } catch {
                        this.value = lastUser
                        return
                    }
            }
            updateUser(newUser)
            vueRoot.$confirm("您已登录为用户 "+newUser+"，请选择同步操作。如误操作请关闭对话框。", '提示', {
                confirmButtonText: '下载',
                cancelButtonText: '上传',
                distinguishCancelAndClose: true,
                type: 'success'
            }).then(()=>{
                cloudServer.download(false)
            }).catch((action)=>{
                if (action === 'cancel') {
                    cloudServer.upload()
                } else {
                    this.value = ""// 登出用户
                    updateUser("")
                    syncIndicator.nop()
                }
            })

        })
    }
}

function hookOpIcon(e) {
    let navs = document.getElementsByClassName("nav")
    if (navs.length) {
        console.log("found navigators")
        $(e.currentTarget).off("click", hookOpIcon)
        $(navs[8]).on("click", hookUltimateNavi)
    }
}

var i = 0

function hookLocalStorage() {
    window.localStorage.__proto__.setItem = function(name, value) {
        let result = localstore.setItem(name, value)
        if (vueRoot && !vueRoot.loading && !importCloud) {  // 忽略所有中途读写
            cloudServer.upload()
        }
        return result
    }
}

function hookVue() {
    let pVue = null
    Object.defineProperty(unsafeWindow,'Vue',{
        get: function(){
            return pVue
        },

        set: function(val){
            pVue = new Proxy(val, {
                construct: function(target, args) {
                    var obj = new target(...args)
                    if (args.length && typeof args[0]==="object" && args[0].el==="#main") {
                        vueRoot = obj
                    }
                    return obj
                },
            })
        },
        configurable: true,
    });
}

function oneTimeSyncOnLoad() {
    if (!lastUser) return
    if (!vueRoot || vueRoot.loading) {
        setTimeout(oneTimeSyncOnLoad, 1000)
    } else {
        console.log("Syncing cloud profile...")
        cloudServer.download()
    }
}

(function() {
    'use strict';
    console.log("Welcome to MyBCJHCloud 1.0")

    hookLocalStorage()
    hookVue()
    window.addEventListener('load', ()=>{
        new Promise(r=>{
            let checker = ()=>{
                let opIcon = document.getElementsByClassName("el-icon-s-operation icon-btn")
                if (opIcon.length) {
                    r(opIcon)
                } else {
                    setTimeout(checker, 500)
                }
            }
            checker()
        }).then((icon)=>{
            $(icon).on("click", hookOpIcon)
            syncIndicator.create()
            oneTimeSyncOnLoad()
        })
    })
})();