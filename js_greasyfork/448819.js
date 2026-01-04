// ==UserScript==
// @name         MiGerritPlus
// @namespace    thbeliefNameSpace
// @icon         https://cnbj1.fds.api.xiaomi.com/info-app-webfile/common-resource/ico/favicon.ico
// @version      2.0.0
// @description  some extention for miui gerrit
// @author       thbelief
// @match        *://gerrit.pt.mioffice.cn/*
// @match        *://corgi.pt.miui.com/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @resource css2 https://www.layuicdn.com/layui-v2.5.6/css/layui.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @grant        GM.notification
// @grant        GM.setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @license      AGPL

// @downloadURL https://update.greasyfork.org/scripts/448819/MiGerritPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/448819/MiGerritPlus.meta.js
// ==/UserScript==
(function () {
    'use strict'

    // code region start

    /**
     * some config
     */
    var TAG = "MiGerritPlus"
    // control is print log
    var isDebug = false
    var dashBoardSelf = "https://gerrit.pt.mioffice.cn/dashboard/self"
    var gerritTask = "https://corgi.pt.miui.com/build/tiny/task?copyId="
    var intervalTime = 150
    var checkboxInsertIndex = 3
    // need hide group array
    var hideGroupArray = new Array("Your Turn", "Incoming reviews", "CCed on", "Recently closed")

    print("origin start")
    toastr().info("welcome to use " + TAG)
    loadCss()
    loadLayui()
    // cur url
    var curHerf = window.location.href
    // reload because not success sometimes
    var isNeedReloadMain = false
    // save checkbox and change
    var selectChangeMap = new Map()
    // main header buttons
    var buttonArray = new Array(getCopyButton(), getPackagingButton(), getPackagingSettingsButton(), getResetButton())
    // settings config table
    var configs = new Array()
    const TABLE_DATA = "TABLE_DATA"
    if (GM_getValue(TABLE_DATA) != null) {
        configs = GM_getValue(TABLE_DATA)
    }
    const PACKAGE_CHANGE_ID = "changeIds"

    window.onload = function () {
        var changeIds = GM_getValue(PACKAGE_CHANGE_ID)
        sleep(300).then(() => {
            if (changeIds != null) {
                GM_setValue(PACKAGE_CHANGE_ID, null)
                if (curHerf.indexOf(gerritTask) !== -1) {
                    var badData = document.body.querySelectorAll('.del-btn')
                    for (var i = 0; i < badData.length; i++) {
                        badData[i].click()
                    }
                    var insertButton = document.body.querySelector('.insert-btn')
                    var inputChangeId = insertButton.parentNode.parentNode.querySelector('input')
                    var taskName = '';
                    for (var change of changeIds) {
                        taskName += change['name'] + " "
                        tryInput(change['id'], inputChangeId)
                        insertButton.click()
                    }
                    var go = document.body.querySelector('.bottom-btn-box').querySelector('button')
                    go.click()
                    sleep(300).then(() => {
                        var dialog = document.body.querySelector(".el-dialog")
                        var dialogInput = dialog.querySelector('input')
                        dialogInput.value = taskName
                        dialog.querySelectorAll('button')[2].click()
                        window.location.href = "about:blank"
                        window.close()
                    })
                }
            }
        });
        main()
    }
    /**
     * History and window.hashchange is not role
     * so use interval
     */
    setInterval(function () {
        if (curHerf != window.location.href || isNeedReloadMain) {
            isNeedReloadMain = false;
            curHerf = window.location.href
            print("cur url = " + curHerf)
            if (curHerf != dashBoardSelf) {
                for (var i = 0; i < buttonArray.length; i++) {
                    buttonArray[i].remove()
                }
                print("Not dashBoardSelf.Remove button")
            }
            main()
        }
    }, intervalTime);

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function tryInput(text, tempInput) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: text,
            dataTransfer: null,
            isComposing: false
        });
        tempInput.value = text;
        tempInput.dispatchEvent(evt);
    }
    function loadCss() {
        var css = ".toast-title{font-weight:bold}.toast-message{-ms-word-wrap:break-word;word-wrap:break-word}.toast-message a,.toast-message label{color:#fff}.toast-message a:hover{color:#ccc;text-decoration:none}.toast-close-button{position:relative;right:-0.3em;top:-0.3em;float:right;font-size:20px;font-weight:bold;color:#fff;-webkit-text-shadow:0 1px 0 #fff;text-shadow:0 1px 0 #fff;opacity:.8;-ms-filter:alpha(opacity=80);filter:alpha(opacity=80)}.toast-close-button:hover,.toast-close-button:focus{color:#000;text-decoration:none;cursor:pointer;opacity:.4;-ms-filter:alpha(opacity=40);filter:alpha(opacity=40)}button.toast-close-button{padding:0;cursor:pointer;background:transparent;border:0;-webkit-appearance:none}.toast-top-center{top:0;right:0;width:100%}.toast-bottom-center{bottom:0;right:0;width:100%}.toast-top-full-width{top:0;right:0;width:100%}.toast-bottom-full-width{bottom:0;right:0;width:100%}.toast-top-left{top:12px;left:12px}.toast-top-right{top:12px;right:12px}.toast-bottom-right{right:12px;bottom:12px}.toast-bottom-left{bottom:12px;left:12px}#toast-container{position:fixed;z-index:999999}#toast-container *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}#toast-container>div{position:relative;overflow:hidden;margin:0 0 6px;padding:15px 15px 15px 50px;width:300px;-moz-border-radius:3px 3px 3px 3px;-webkit-border-radius:3px 3px 3px 3px;border-radius:3px 3px 3px 3px;background-position:15px center;background-repeat:no-repeat;-moz-box-shadow:0 0 12px #999;-webkit-box-shadow:0 0 12px #999;box-shadow:0 0 12px #999;color:#fff;opacity:.8;-ms-filter:alpha(opacity=80);filter:alpha(opacity=80)}#toast-container>:hover{-moz-box-shadow:0 0 12px #000;-webkit-box-shadow:0 0 12px #000;box-shadow:0 0 12px #000;opacity:1;-ms-filter:alpha(opacity=100);filter:alpha(opacity=100);cursor:pointer}#toast-container.toast-top-center>div,#toast-container.toast-bottom-center>div{width:300px;margin:auto}#toast-container.toast-top-full-width>div,#toast-container.toast-bottom-full-width>div{width:96%;margin:auto}.toast{background-color:#030303}.toast-success{background-color:#51a351}.toast-error{background-color:#bd362f}.toast-info{background-color:#2f96b4}.toast-warning{background-color:#f89406}.toast-progress{position:absolute;left:0;bottom:0;height:4px;background-color:#000;opacity:.4;-ms-filter:alpha(opacity=40);filter:alpha(opacity=40)}@media all and (max-width:240px){#toast-container>div{padding:8px 8px 8px 50px;width:11em}#toast-container .toast-close-button{right:-0.2em;top:-0.2em}}@media all and (min-width:241px) and (max-width:480px){#toast-container>div{padding:8px 8px 8px 50px;width:18em}#toast-container .toast-close-button{right:-0.2em;top:-0.2em}}@media all and (min-width:481px) and (max-width:768px){#toast-container>div{padding:15px 15px 15px 50px;width:25em}}"
        GM_addStyle(css)
    }
    function loadLayui() {
        var jsUrl = "https://www.layuicdn.com/layui-v2.5.6/layui.all.js"
        var cssUrl = "https://www.layuicdn.com/layui-v2.5.6/css/layui.css"
        var link = document.createElement("link")
        link.setAttribute("ref", "stylesheet")
        link.setAttribute("type", "text/css")
        link.setAttribute("href", cssUrl)
        document.head.appendChild(link)
        var script = document.createElement("script")
        script.setAttribute("src", jsUrl)
        document.body.appendChild(script)
        var css2 = GM_getResourceText("css2")
        GM_addStyle(css2)

    }
    function print(content) {
        if (!isDebug) {
            return;
        }
        console.log(TAG + ": " + content)
    }
    function packageTask() {
        toastr().info("test")
    }
    function main() {
        if (curHerf !== dashBoardSelf) {
            return
        }
        print("main")
        var rootDom = document.body.querySelector("gr-app").shadowRoot.getElementById("app-element").shadowRoot.getRootNode();
        var mainHeader = rootDom.querySelector("gr-main-header").shadowRoot.getRootNode()
        // insert copy button
        insertClipIcon(mainHeader.querySelector(".links"))
        // remove footer
        var footerDom = rootDom.querySelector("footer")
        if (footerDom != null) {
            print("remove footer")
            footerDom.remove()
        }
        var mainDom = rootDom.querySelector("main")
        if (mainDom === null) {
            print("main is null")
            return
        }
        var changeDom = mainDom.querySelector("gr-dashboard-view")
        if (changeDom === null) {
            isNeedReloadMain = true
            return
        }
        var changeList = changeDom.shadowRoot.getRootNode().querySelector("gr-change-list").shadowRoot.getRootNode().querySelectorAll("gr-change-list-section")
        // cardArray is per change card
        var cardArray = new Array()
        for (var i = 0; i < changeList.length; i++) {
            cardArray[i] = changeList[i].shadowRoot.getRootNode()
        }
        if (cardArray.length === 0) {
            toastr().warning("operate fail.try to retry")
            isNeedReloadMain = true
        }
        print("cardArray = " + cardArray)
        for (var i = 0; i < cardArray.length; i++) {
            var curGroupDom = cardArray[i].querySelector(".section-name")
            var groupHeaderDom = cardArray[i].querySelector(".groupHeader")
            // hide which need to hide group
            if (curGroupDom != null && hideGroupArray.includes(curGroupDom.innerText)) {
                print("remove " + curGroupDom.innerText)
                if (groupHeaderDom !== null) {
                    groupHeaderDom.remove()
                }
                var groupContentDom = cardArray[i].querySelector(".groupContent")
                if (groupContentDom !== null) {
                    groupContentDom.remove()
                }
                // remove noChanges item
                var noChangesDom = cardArray[i].querySelector(".noChanges")
                if (noChangesDom !== null) {
                    noChangesDom.remove()
                }
                // remove group title
                if (i != 0) {
                    var groupTitleDom = cardArray[i].querySelector(".groupTitle")
                    if (groupTitleDom !== null) {
                        groupTitleDom.remove()
                    }
                }
            }
            var groupContentDom = cardArray[i].querySelector(".groupContent")
            if (groupContentDom !== null) {
                var groupTitleDom = groupContentDom.querySelector(".groupTitle")
                if (groupTitleDom.querySelectorAll(".subject").length <= 1) {
                    insertCheckBoxTitle(groupTitleDom)
                    var list = groupContentDom.querySelectorAll("gr-change-list-item")
                    insertCheckBox(list)
                }
            }
        }
        toastr().success("operate success")
    }
    /**
     * insert checkbox title
     * @param list 
     */
    function insertCheckBoxTitle(groupTitle) {
        var tdList = groupTitle.querySelectorAll("td")
        groupTitle.insertBefore(createCheckBoxTitle(), tdList[checkboxInsertIndex])
    }
    /**
     * create checkbox title
     * @returns 
     */
    function createCheckBoxTitle() {
        var td = document.createElement("td")
        td.className = "subject"
        td.innerText = "Select"
        return td
    }
    /**
     * insert checkbox to every change
     * @param {*} list 
     */
    function insertCheckBox(list) {
        for (var i = 0; i < list.length; i++) {
            var tdList = list[i].shadowRoot.getRootNode().querySelectorAll("td")
            var cellNumberNode = list[i].shadowRoot.getRootNode().querySelector(".number")
            var titleNode = list[i].shadowRoot.getRootNode().querySelector(".content")
            var repoNode = list[i].shadowRoot.getRootNode().querySelector(".fullRepo")
            var branchNode = list[i].shadowRoot.getRootNode().querySelector(".branch")
            const change = new Change(cellNumberNode.querySelector("a").innerText, titleNode.innerText, cellNumberNode.querySelector("a").href, repoNode.innerText, branchNode.querySelector("a").innerText)
            list[i].shadowRoot.getRootNode().insertBefore(createCheckBox(change), tdList[checkboxInsertIndex])
        }
    }
    /**
     * create checkbox
     * @param {*} change 
     * @returns 
     */
    function createCheckBox(change) {
        var td = document.createElement("td")
        var input = document.createElement("input")
        input.type = "checkbox"
        input.setAttribute("style", "width:20px;height:20px;")
        input.onclick = function () {
            selectChangeMap.get(this).setIsChecked(this.checked)
            //console.log(selectChangeMap.get(this))
        }
        td.setAttribute("display", "table-cell")
        td.setAttribute("vertical-align", "middle")
        td.setAttribute("white-space", "nowrap")
        td.setAttribute("style", "padding-top:5px;padding-bottom:5px;padding-left:10px;padding-right:10px;")
        td.appendChild(input)
        selectChangeMap.set(input, change)
        return td
    }
    /**
     * insert copy button
     * @param {*} links 
     */
    function insertClipIcon(links) {
        if (links == null) {
            return
        }
        var button = links.querySelector(".copyToClipboard")
        // just need one
        if (button == null) {
            for (var i = 0; i < buttonArray.length; i++) {
                links.appendChild(buttonArray[i])
            }
        }
    }
    /**
     * get changes which checked by myselef
     * @returns 
     */
    function getCheckedChange() {
        var changes = new Array()
        var index = 0
        selectChangeMap.forEach(function (value, key) {
            if (value.isChecked()) {
                key.click()
                changes[index++] = value
            }
        })
        return changes
    }


    function getAllChanges() {
        var changes = new Array()
        var index = 0
        selectChangeMap.forEach(function (value, key) {
            changes[index++] = value
        })
        return changes
    }

    function getPackagingButton() {
        var button = getBaseButton()
        button.innerHTML = "package"
        button.onclick = function () {
            var array = getCheckedChange()
            if (array.length == 0) {
                toastr().error("not selected")
                print("not select any change")
                return
            }
            var datas = new Array()

            var curRepo = array[0].getRepo()
            var curBranch = array[0].getBranch()
            for (var item of array) {
                if (curRepo !== item.getRepo() || curBranch !== item.getBranch()) {
                    toastr().error("must simple repo and branch")
                    return;
                }
                datas[datas.length] = item.getData()
            }
            layer.open({
                type: 1,
                area: ['1000px', '500px'],
                title: "package",
                content: '<div style="padding:30px"><table id="table" class="layui-table" lay-filter="table"></table><form class="layui-form layui-form-pane" action=""><div class="layui-form-item"><label class="layui-form-label">CopyTask</label><div class="layui-input-block"><select name="copyTask" lay-verify="required" lay-filter="copyTask"></select></div></div><div class="layui-form-item"><button id="package" class="layui-btn" lay-submit lay-filter="package">package</button><button id ="reset" type="reset" class="layui-btn layui-btn-primary">reset</button></div></form></div>'
            })
            document.body.querySelector("#reset").click()
            loadSelectChanges(datas)
            var formItemArray = document.body.querySelectorAll(".layui-form-item")
            var copyTaskDom = formItemArray[0].querySelector("select")
            copyTaskDom.options.length = 0
            for (item of configs) {
                if (item['repo'] !== curRepo || item['branch'] !== curBranch) {
                    continue
                }
                copyTaskDom.add(new Option(item['name'], item['copyTaskId']))
            }
            var form = layui.form;
            form.render()
            form.on('submit(package)', function (data) {
                var copyTask = data.field['copyTask']
                if (copyTask === '') {
                    toastr().error("not select copyTask")
                } else {
                    GM_setValue(PACKAGE_CHANGE_ID, array)
                    GM_openInTab(gerritTask + copyTask)
                    layer.closeAll('page')
                }
                return false;
            });
        }
        var li = document.createElement("li")
        li.appendChild(button)
        return li
    }

    function getPackagingSettingsButton() {
        var button = getBaseButton()
        button.innerHTML = "settings"
        button.onclick = function () {
            // var div = document.createElement("div");
            // div.innerHTML = '<form class="layui-form" action=""><div class="layui-form-item"><label class="layui-form-label">输入框</label><div class="layui-input-block"><input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">密码框</label><div class="layui-input-inline"><input type="password" name="password" required lay-verify="required" placeholder="请输入密码" autocomplete="off" class="layui-input"></div><div class="layui-form-mid layui-word-aux">辅助文字</div></div><div class="layui-form-item"><label class="layui-form-label">选择框</label><div class="layui-input-block"><select name="city" lay-verify="required"><option value=""></option><option value="0">北京</option><option value="1">上海</option><option value="2">广州</option><option value="3">深圳</option><option value="4">杭州</option></select></div></div><div class="layui-form-item"><label class="layui-form-label">复选框</label><div class="layui-input-block"><input type="checkbox" name="like[write]" title="写作"><input type="checkbox" name="like[read]" title="阅读" checked><input type="checkbox" name="like[dai]" title="发呆"></div></div><div class="layui-form-item"><label class="layui-form-label">开关</label><div class="layui-input-block"><input type="checkbox" name="switch" lay-skin="switch"></div></div><div class="layui-form-item"><label class="layui-form-label">单选框</label><div class="layui-input-block"><input type="radio" name="sex" value="男" title="男"><input type="radio" name="sex" value="女" title="女" checked></div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">文本域</label><div class="layui-input-block"><textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea></div></div><div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button><button type="reset" class="layui-btn layui-btn-primary">重置</button></div></div></form>'
            // console.log( div.childNodes[0])
            // document.body.appendChild( div.childNodes[0])
            layer.open({
                type: 1,
                area: ['1000px', '500px'],
                title: "settings",
                content: '<div style="padding:30px"><table id="table" class="layui-table" lay-filter="table"></table><form class="layui-form layui-form-pane" action=""><div class="layui-form-item"><label class="layui-form-label">Name</label><div class="layui-input-block"><input type="text" name="name" required lay-verify="required" placeholder="please input name" autocomplete="off"                    class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">Repo</label><div class="layui-input-block"><select name="repo" lay-verify="required" lay-filter="repo"></select></div></div><div class="layui-form-item"><label class="layui-form-label">Branch</label><div class="layui-input-block"><select name="branch" lay-verify="required" lay-filter="branch"></select></div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">CopyTaskId</label><div class="layui-input-block"><textarea name="copyTaskId" placeholder="please input task id" class="layui-textarea"></textarea></div></div><div class="layui-form-item"><div class="layui-input-block"><button id="add" class="layui-btn" lay-submit lay-filter="add">sure to add config</button><button id="reset" type="reset" class="layui-btn layui-btn-primary">reset form</button></div></div></form></div>'
            })
            loadConfigs()
            document.body.querySelector("#reset").click()
            // class use . id use #
            var formItemArray = document.body.querySelectorAll(".layui-form-item")
            var nameDom = formItemArray[0].querySelector("input")
            var repoDom = formItemArray[1].querySelector("select")
            var branchDom = formItemArray[2].querySelector("select")
            var taskidDom = formItemArray[3].querySelector("textarea")

            var allChange = getAllChanges()
            if (allChange.length > 0) {
                selectRepo(allChange[0].getRepo(), true)
            }

            var form = layui.form;
            form.on('select(repo)', function (data) {
                selectRepo(data.value, false)
            });
            form.on('submit(add)', function (data) {
                configs[configs.length] = data.field
                GM_setValue(TABLE_DATA, configs)
                loadConfigs()
                return false;
            });
        }
        var li = document.createElement("li")
        li.appendChild(button)
        return li
    }

    function getResetButton() {
        var button = getBaseButton()
        button.innerHTML = "Reset"
        button.onclick = function () {
            GM_deleteValue(TABLE_DATA, null)
            GM_deleteValue(PACKAGE_CHANGE_ID, null)
            configs = new Array();
            toastr().success("clear all configs")
        }
        var li = document.createElement("li")
        li.appendChild(button)
        return li
    }

    function loadSelectChanges(datas) {
        var table = layui.table;
        // id, title, repo, branch
        print(datas)
        table.render({
            elem: '#table'
            , title: "config"
            , height: 200
            , data: datas
            , page: true
            , cols: [[
                { field: 'id', title: 'Id' }
                , { field: 'title', title: 'Title' }
                , { field: 'repo', title: 'Repo' }
                , { field: 'branch', title: 'Branch' }
            ]]
        });
    }

    function loadConfigs() {
        var table = layui.table;
        table.render({
            elem: '#table'
            , title: "config"
            , height: 200
            , data: configs
            , page: true
            , cols: [[
                { field: 'name', title: 'Name' }
                , { field: 'repo', title: 'Repo' }
                , { field: 'branch', title: 'Branch' }
                , { field: 'copyTaskId', title: 'CopyTaskId' }
            ]]
        });
        table.on('row', function(obj){
            configs.map((value,i) =>{
                if(value['name'] == obj.data['name']){
                    configs.splice(i,1)
                }
            })
            GM_setValue(TABLE_DATA, configs)
            obj.del();
            toastr().info("delete config")
        });
    }

    function selectRepo(repo, isFirst) {
        var formItemArray = document.body.querySelectorAll(".layui-form-item")
        var repoDom = formItemArray[1].querySelector("select")
        var branchDom = formItemArray[2].querySelector("select")
        branchDom.options.length = 0;
        var changes = getAllChanges()
        var tempMap = new Map()
        for (var change of changes) {
            var tempArray = new Array()
            if (!tempMap.has(change.getRepo())) {
                tempArray[0] = change.getBranch()
            } else {
                tempArray = tempMap.get(change.getRepo())
                var isHave = false
                for (var i of tempArray) {
                    if (i === change.getBranch()) {
                        isHave = true
                    }
                }
                if (!isHave) {
                    tempArray[tempArray.length] = change.getBranch()
                }
            }
            tempMap.set(change.getRepo(), tempArray)
        }
        tempMap.forEach(function (value, key) {
            var repoOption = createOption(key, key)
            if (isFirst) {
                repoDom.add(repoOption)
            }
            if (repo === key) {
                for (var item of value) {
                    branchDom.add(createOption(item, item))
                }
            }
        })
        var form = layui.form;
        form.render()
    }

    function createOption(value, text) {
        return new Option(text, value)
    }

    function getCopyButton() {
        var button = getBaseButton()
        button.innerHTML = "copy"
        button.onclick = function () {
            var array = getCheckedChange()
            if (array.length == 0) {
                toastr().error("not selected")
                print("not select any change")
                return
            }
            var result = "";
            for (var i = 0; i < array.length; i++) {
                var extra = ""
                if (i != 0) {
                    extra += "\n"
                }
                result += extra + array[i].getString()
                if (i != array.length - 1) {
                    result += "\n"
                }
            }
            toastr().success("copy selected changes")
            print("copy \n" + result)
            GM_setClipboard(result)
        }
        var li = document.createElement("li")
        li.appendChild(button)
        return li
    }

    function getBaseButton() {
        var targetButton = document.createElement("gr-button")
        var paperButton = document.createElement("paper-button")
        targetButton.setAttribute("class", "copyToClipboard")
        targetButton.setAttribute("role", "button")
        targetButton.setAttribute("aria-disabled", "false")
        targetButton.appendChild(paperButton)
        targetButton.setAttribute("style", "padding:8px;")
        return targetButton
    }

    function removeArray(array, item) {
        var index = 0
        for (a in array) {
            if (item === a) {
                break;
            }
            index = index + 1
        }
        array.splice(index, 1)
    }

    class setting {
        constructor(name, repo, branch, taskid) {
            this.name = name
            this.repo = repo
            this.branch = branch
            this.taskid = taskid
        }

        getName() {
            return this.name
        }

        getrepo() {
            return this.repo
        }

        getBranch() {
            return this.branch
        }

        getTaskId() {
            return this.taskid
        }
    }

    /**
     * change class 
     * save information about change
     */
    class Change {
        constructor(id, title, url, repo, branch) {
            this.id = id.trim()
            this.title = title.trim()
            this.url = url.trim()
            this.repo = repo.trim()
            this.branch = branch.trim()
            this.ischecked = false
        }

        getId() {
            return this.id
        }

        isChecked() {
            return this.ischecked
        }

        setIsChecked(ischecked) {
            this.ischecked = ischecked
        }

        getRepo() {
            return this.repo
        }

        getBranch() {
            return this.branch
        }

        getString() {
            var result = "ChangeId: " + this.id + " Title: " + this.title + " Repo: " + this.repo + " Branch: " + this.branch + "\nUrl: " + this.url
            return result
        }

        getData() {
            var result = { 'id': this.id, 'title': this.title, 'repo': this.repo, 'branch': this.branch }
            return result
        }
    }
    function toastr() {
        var $container;
        var listener;
        var toastId = 0;
        var toastType = {
            error: 'error',
            info: 'info',
            success: 'success',
            warning: 'warning'
        };

        var toastr = {
            clear: clear,
            remove: remove,
            error: error,
            getContainer: getContainer,
            info: info,
            options: {},
            subscribe: subscribe,
            success: success,
            version: '2.1.1',
            warning: warning
        };

        var previousToast;

        return toastr;

        ////////////////

        function error(message, title, optionsOverride) {
            return notify({
                type: toastType.error,
                iconClass: getOptions().iconClasses.error,
                message: message,
                optionsOverride: optionsOverride,
                title: title
            });
        }

        function getContainer(options, create) {
            if (!options) { options = getOptions(); }
            $container = $('#' + options.containerId);
            if ($container.length) {
                return $container;
            }
            if (create) {
                $container = createContainer(options);
            }
            return $container;
        }

        function info(message, title, optionsOverride) {
            return notify({
                type: toastType.info,
                iconClass: getOptions().iconClasses.info,
                message: message,
                optionsOverride: optionsOverride,
                title: title
            });
        }

        function subscribe(callback) {
            listener = callback;
        }

        function success(message, title, optionsOverride) {
            return notify({
                type: toastType.success,
                iconClass: getOptions().iconClasses.success,
                message: message,
                optionsOverride: optionsOverride,
                title: title
            });
        }

        function warning(message, title, optionsOverride) {
            return notify({
                type: toastType.warning,
                iconClass: getOptions().iconClasses.warning,
                message: message,
                optionsOverride: optionsOverride,
                title: title
            });
        }

        function clear($toastElement, clearOptions) {
            var options = getOptions();
            if (!$container) { getContainer(options); }
            if (!clearToast($toastElement, options, clearOptions)) {
                clearContainer(options);
            }
        }

        function remove($toastElement) {
            var options = getOptions();
            if (!$container) { getContainer(options); }
            if ($toastElement && $(':focus', $toastElement).length === 0) {
                removeToast($toastElement);
                return;
            }
            if ($container.children().length) {
                $container.remove();
            }
        }

        // internal functions

        function clearContainer(options) {
            var toastsToClear = $container.children();
            for (var i = toastsToClear.length - 1; i >= 0; i--) {
                clearToast($(toastsToClear[i]), options);
            }
        }

        function clearToast($toastElement, options, clearOptions) {
            var force = clearOptions && clearOptions.force ? clearOptions.force : false;
            if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
                $toastElement[options.hideMethod]({
                    duration: options.hideDuration,
                    easing: options.hideEasing,
                    complete: function () { removeToast($toastElement); }
                });
                return true;
            }
            return false;
        }

        function createContainer(options) {
            $container = $('<div/>')
                .attr('id', options.containerId)
                .addClass(options.positionClass)
                .attr('aria-live', 'polite')
                .attr('role', 'alert');

            $container.appendTo($(options.target));
            return $container;
        }

        function getDefaults() {
            return {
                tapToDismiss: true,
                toastClass: 'toast',
                containerId: 'toast-container',
                debug: false,

                showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
                showDuration: 300,
                showEasing: 'swing', //swing and linear are built into jQuery
                onShown: undefined,
                hideMethod: 'fadeOut',
                hideDuration: 1000,
                hideEasing: 'swing',
                onHidden: undefined,

                extendedTimeOut: 1000,
                iconClasses: {
                    error: 'toast-error',
                    info: 'toast-info',
                    success: 'toast-success',
                    warning: 'toast-warning'
                },
                iconClass: 'toast-info',
                positionClass: 'toast-top-right',
                timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
                titleClass: 'toast-title',
                messageClass: 'toast-message',
                target: 'body',
                closeHtml: '<button type="button">&times;</button>',
                newestOnTop: true,
                preventDuplicates: false,
                progressBar: false
            };
        }

        function publish(args) {
            if (!listener) { return; }
            listener(args);
        }

        function notify(map) {
            var options = getOptions();
            var iconClass = map.iconClass || options.iconClass;

            if (typeof (map.optionsOverride) !== 'undefined') {
                options = $.extend(options, map.optionsOverride);
                iconClass = map.optionsOverride.iconClass || iconClass;
            }

            if (shouldExit(options, map)) { return; }

            toastId++;

            $container = getContainer(options, true);

            var intervalId = null;
            var $toastElement = $('<div/>');
            var $titleElement = $('<div/>');
            var $messageElement = $('<div/>');
            var $progressElement = $('<div/>');
            var $closeElement = $(options.closeHtml);
            var progressBar = {
                intervalId: null,
                hideEta: null,
                maxHideTime: null
            };
            var response = {
                toastId: toastId,
                state: 'visible',
                startTime: new Date(),
                options: options,
                map: map
            };

            personalizeToast();

            displayToast();

            handleEvents();

            publish(response);

            if (options.debug && console) {
                console.log(response);
            }

            return $toastElement;

            function personalizeToast() {
                setIcon();
                setTitle();
                setMessage();
                setCloseButton();
                setProgressBar();
                setSequence();
            }

            function handleEvents() {
                $toastElement.hover(stickAround, delayedHideToast);
                if (!options.onclick && options.tapToDismiss) {
                    $toastElement.click(hideToast);
                }

                if (options.closeButton && $closeElement) {
                    $closeElement.click(function (event) {
                        if (event.stopPropagation) {
                            event.stopPropagation();
                        } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                            event.cancelBubble = true;
                        }
                        hideToast(true);
                    });
                }

                if (options.onclick) {
                    $toastElement.click(function () {
                        options.onclick();
                        hideToast();
                    });
                }
            }

            function displayToast() {
                $toastElement.hide();

                $toastElement[options.showMethod](
                    { duration: options.showDuration, easing: options.showEasing, complete: options.onShown }
                );

                if (options.timeOut > 0) {
                    intervalId = setTimeout(hideToast, options.timeOut);
                    progressBar.maxHideTime = parseFloat(options.timeOut);
                    progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                    if (options.progressBar) {
                        progressBar.intervalId = setInterval(updateProgress, 10);
                    }
                }
            }

            function setIcon() {
                if (map.iconClass) {
                    $toastElement.addClass(options.toastClass).addClass(iconClass);
                }
            }

            function setSequence() {
                if (options.newestOnTop) {
                    $container.prepend($toastElement);
                } else {
                    $container.append($toastElement);
                }
            }

            function setTitle() {
                if (map.title) {
                    $titleElement.append(map.title).addClass(options.titleClass);
                    $toastElement.append($titleElement);
                }
            }

            function setMessage() {
                if (map.message) {
                    $messageElement.append(map.message).addClass(options.messageClass);
                    $toastElement.append($messageElement);
                }
            }

            function setCloseButton() {
                if (options.closeButton) {
                    $closeElement.addClass('toast-close-button').attr('role', 'button');
                    $toastElement.prepend($closeElement);
                }
            }

            function setProgressBar() {
                if (options.progressBar) {
                    $progressElement.addClass('toast-progress');
                    $toastElement.prepend($progressElement);
                }
            }

            function shouldExit(options, map) {
                if (options.preventDuplicates) {
                    if (map.message === previousToast) {
                        return true;
                    } else {
                        previousToast = map.message;
                    }
                }
                return false;
            }

            function hideToast(override) {
                if ($(':focus', $toastElement).length && !override) {
                    return;
                }
                clearTimeout(progressBar.intervalId);
                return $toastElement[options.hideMethod]({
                    duration: options.hideDuration,
                    easing: options.hideEasing,
                    complete: function () {
                        removeToast($toastElement);
                        if (options.onHidden && response.state !== 'hidden') {
                            options.onHidden();
                        }
                        response.state = 'hidden';
                        response.endTime = new Date();
                        publish(response);
                    }
                });
            }

            function delayedHideToast() {
                if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                    intervalId = setTimeout(hideToast, options.extendedTimeOut);
                    progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
                    progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                }
            }

            function stickAround() {
                clearTimeout(intervalId);
                progressBar.hideEta = 0;
                $toastElement.stop(true, true)[options.showMethod](
                    { duration: options.showDuration, easing: options.showEasing }
                );
            }

            function updateProgress() {
                var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
                $progressElement.width(percentage + '%');
            }
        }

        function getOptions() {
            return $.extend({}, getDefaults(), toastr.options);
        }

        function removeToast($toastElement) {
            if (!$container) { $container = getContainer(); }
            if ($toastElement.is(':visible')) {
                return;
            }
            $toastElement.remove();
            $toastElement = null;
            if ($container.children().length === 0) {
                $container.remove();
                previousToast = undefined;
            }
        }

    }


    // code region end
})();