// ==UserScript==
// @name         PKU-treeHole backup
// @author       PKUer
// @namespace    http://tampermonkey.net/
// @version      1.9.11
// @license      GPL-3.0 License
// @description  backup for the deleted file. 
// @match        https://treehole.pku.edu.cn/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pku.edu.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      cn.bing.com
// @connect      wallhaven.cc
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464305/PKU-treeHole%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/464305/PKU-treeHole%20backup.meta.js
// ==/UserScript==

// 部分代码借鉴了项目https://greasyfork.org/zh-CN/scripts/419081-知乎增强 ，因此基于GPL-3.0 License进行开源
// 壁纸刷新小风车图片来自	https://infinityicon.infinitynewtab.com/assets/windmill.svg

console.log('PKUtreeHole优化脚本来啦！');

//================================================================================================================
// 显示脚本菜单 start （前800行）
//================================================================================================================
/** 配置 */
const Config = {
    copyFullText: { ID: 'menu_copyFullText', text: '复制全文', value: GM_getValue('menu_copyFullText', true), shownInMainMenu: true, hasSetPage: true },
    showCopyFullTextAlert: { ID: 'menu_showCopyFullTextAlert', text: '复制长文成功时显示提醒框', value: GM_getValue('menu_showCopyFullTextAlert', true) },

    cancelMaxHeight: { ID: 'menu_cancelMaxHeight', text: '取消长文限制', value: GM_getValue('menu_cancelMaxHeight', true), shownInMainMenu: true, hasSetPage: false },

    configureWallPaperHub: { ID: 'menu_configureWallPaperHub', text: '配置壁纸库', value: GM_getValue('menu_configureWallPaperHub', true), shownInMainMenu: true, hasSetPage: true },
    wallPaperHubSite: { ID: 'menu_wallPaperHubSite', text: '壁纸仓库', value: GM_getValue('menu_wallPaperHubSite', 'Bing') },
    WallHavenUrl: { ID: 'menu_WallHavenUrl', text: 'WallHaven壁纸分类地址', value: GM_getValue('menu_WallHavenUrl', 'https://wallhaven.cc/search?categories=100&purity=100&sorting=toplist&order=desc&ai_art_filter=1'), tips: '填写WallHaven对应类别的网址' },

    addSiteButton: { ID: 'menu_addSiteButton', text: '添加网站图标', value: GM_getValue('menu_addSiteButton', true), shownInMainMenu: true, hasSetPage: true },
    addCourseEvaluationSiteButton: { ID: 'menu_addCourseEvaluationSiteButton', text: '添加课程评估网站图标', value: GM_getValue('menu_addCourseEvaluationSiteButton', true) },
    addBBSSiteButton: { ID: 'menu_addBBSSiteButton', text: '添加未名BBS网站按钮', value: GM_getValue('menu_addBBSSiteButton', true) },

    recordAlias: { ID: 'menu_recordAlias', text: '收藏树洞', value: GM_getValue('menu_recordAlias', true), shownInMainMenu: true, hasSetPage: true },
    showAliasSuggestions: { ID: 'menu_showAliasSuggestions', text: '在搜索时触发收藏建议', value: GM_getValue('menu_showAliasSuggestions', true) },

    recordHistory: { ID: 'menu_recordHistory', text: '保存搜索记录（关闭该功能会同时清除搜索记录）', value: GM_getValue('menu_recordHistory', true), shownInMainMenu: true, hasSetPage: true },
    showHistorySuggestions: { ID: 'menu_showHistorySuggestions', text: '在搜索时触发历史记录建议', value: GM_getValue('menu_showHistorySuggestions', true) },
    maxHistorySize: { ID: 'menu_maxHistorySize', text: '最大历史记录数量', value: parseInt(GM_getValue('menu_maxHistorySize', '200')), tips: '默认200,建议100~500' },
    maxShownHistorySize: { ID: 'menu_maxShownHistorySize', text: '最大展示历史记录数量', value: parseInt(GM_getValue('menu_maxShownHistorySize', '10')), tips: '默认10,建议5~20' },

    blockKeywords: { ID: 'menu_blockKeywords', text: '屏蔽指定关键词', value: GM_getValue('menu_blockKeywords', true), shownInMainMenu: true, hasSetPage: true },
    customBlockKeywords: { ID: 'menu_customBlockKeywords', text: '自定义屏蔽关键词', value: GM_getValue('menu_customBlockKeywords', []), tips: "关键词不分大小写，使用 '|' 分隔" },

    showLastestReplyTime: { ID: 'menu_showLastestReplyTime', text: '显示最近回复时间', value: GM_getValue('menu_showLastestReplyTime', true), shownInMainMenu: true, hasSetPage: false },

    clickAgreeServiceAgreement: { ID: 'menu_clickAgreeServiceAgreement', text: '点击“同意北大树洞服务协议”选中框', value: GM_getValue('menu_clickAgreeServiceAgreement', false), shownInMainMenu: true, hasSetPage: false },

    beGoodAtSearch: { ID: 'menu_beGoodAtSearch', text: '善用搜索', value: GM_getValue('menu_beGoodAtSearch', false), shownInMainMenu: true, hasSetPage: true },
    beGoodAtSearchLength: { ID: 'menu_beGoodAtSearchLength', text: '搜索最近的N条树洞：', value: parseInt(GM_getValue('menu_beGoodAtSearchLength', '5000')), tips: '默认5000条, 限制最大100000条' },
    beGoodAtSearchNotification: { ID: 'menu_beGoodAtSearchNotification', text: '显式通知善用搜索相关信息', value: GM_getValue('menu_beGoodAtSearchNotification', true) },

    searchInAttentionList: { ID: 'menu_searchInAttentionList', text: '在关注列表中搜索', value: GM_getValue('menu_searchInAttentionList', false), shownInMainMenu: true, hasSetPage: false },
}

const wallPaperHub = {
    Bing: "https://cn.bing.com",
    WallHaven: "https://wallhaven.cc/"
}


// 注册脚本菜单
function registerMenuCommand() {
    GM_registerMenuCommand('功能菜单', raiseMenu)
    GM_registerMenuCommand('💬 反馈 & 建议', function () { window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/460666-pku-treehole%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC/feedback', { active: true, insert: true, setParent: true }) })
}


/** 唤起设置UI */
function raiseMenu() {
    if (document.querySelector("#zhmMenu")) return /* Safari兼容 */

    GM_addStyle(menuSetStyle)
    const root_body = document.querySelector('body')
    const zhmMenu = document.createElement('div')
    zhmMenu.id = 'zhmMenu'
    zhmMenu.innerHTML = sidebar_menu_html + main_menu_html
    root_body.appendChild(zhmMenu)
    addcustomEvents()
}


/** 给UI绑定各种点击事件 */
function addcustomEvents() {
    /* 给所有开关型的标签绑定事件，包括主页面和侧边页面（侧边栏） */
    const circular = document.querySelectorAll('.circular')
    circular.forEach(function (item) {
        item.addEventListener('click', function (_e) {
            const buttonStyle = item.children[0].style // 判断按钮开关情况
            let left = buttonStyle.left
            left = parseInt(left)
            let listLeftValue
            if (left == 0) { // 点击之前按钮是关闭状态，改成打开
                buttonStyle.left = '22px'
                buttonStyle.background = '#fe6d73'
                item.style.background = '#ffE5E5'
                if (item.nextElementSibling && item.nextElementSibling.getAttribute('data')) { // 如果是有右侧栏的按钮，右侧栏开放
                    item.nextElementSibling.setAttribute('style', 'border: solid #ccc;border-width: 0 3px 3px 0;')
                }
                listLeftValue = true
            } else {        // 点击之前按钮是打开状态，改成关闭
                buttonStyle.left = '0px'
                buttonStyle.background = '#fff'
                item.style.background = '#fff'
                if (item.nextElementSibling) { // 如果有右侧栏，则关闭右侧栏
                    item.nextElementSibling.setAttribute('style', 'border: solid #EEE;border-width: 0 3px 3px 0;')
                }
                listLeftValue = false
            }
            const setListID = item.id // 去除Enter后缀

            GM_setValue(setListID, listLeftValue)   // 将开关状态回写
        })
    })

    /*  给所有的右箭头标签绑定事件 */
    const toRight = document.querySelectorAll('.to-right')
    toRight.forEach(function (item) {
        item.addEventListener('click', function (e) {
            let left = item.previousElementSibling.children[0].style.left // 忽略文本节点，找到.circular节点
            left = parseInt(left) // 根据按钮开关情况选择是否给右箭头绑定事件
            if (left != 22) return

            const setPageID = item.getAttribute('data')
            const pageId = document.getElementById(setPageID)
            if (pageId) pageId.className = 'iconSetPage toLeftMove' // 进入右侧侧边栏
        })
    })

    /*  给所有的左上角返回键标签绑定事件 */
    const toBack = document.querySelectorAll('.back')
    toBack.forEach(function (item) {
        item.addEventListener('click', function (e) {
            const parentDom = item.parentNode.parentNode.parentNode
            parentDom.className = 'iconSetPage toRightMove'
            // document.querySelector('#zhmTakePlace').style = 'height:40px;'
        })
    })

    /* 给所有的关闭按钮标签绑定事件 */
    const setSave = document.querySelectorAll('.iconSetSave')
    setSave.forEach(function (item) {
        item.addEventListener('click', () => {
            let _customBlockKeywords = document.getElementById(Config.customBlockKeywords.ID).value
            _customBlockKeywords = _customBlockKeywords.length ? _customBlockKeywords.split("|") : []    // 判断屏蔽关键词是否为空
            let _wallPaperHubSite = document.getElementById(Config.wallPaperHubSite.ID).value
            let _wallHavenUrl = document.getElementById(Config.WallHavenUrl.ID).value
            let _maxHistorySize = document.getElementById(Config.maxHistorySize.ID).value
            let _maxShownHistorySize = document.getElementById(Config.maxShownHistorySize.ID).value
            let _beGoodAtSearchLength = document.getElementById(Config.beGoodAtSearchLength.ID).value
            GM_setValue(Config.customBlockKeywords.ID, _customBlockKeywords)    // 保存屏蔽的关键词
            GM_setValue(Config.wallPaperHubSite.ID, _wallPaperHubSite)      // 保存壁纸选项
            GM_setValue(Config.WallHavenUrl.ID, _wallHavenUrl)              // 保存壁纸类别URL
            GM_setValue(Config.maxHistorySize.ID, _maxHistorySize)          // 保存最大历史记录数量
            GM_setValue(Config.maxShownHistorySize.ID, _maxShownHistorySize)  // 保存最大显示历史记录数量
            try {
                let num = parseInt(_beGoodAtSearchLength) // 判断输入的是否是数字
                if (num < 0)
                    alert('请输入大于0的数字')
                else if (num > 100000)
                    alert('请输入小于100000的数字')
                else
                    GM_setValue(Config.beGoodAtSearchLength.ID, num)  // 保存最佳搜索长度
            } catch (error) {
                alert('请输入数字')
                return false
            }
            history.go(0)
        })
    })

}

/**侧边栏HTML */
let sidebar_menu_html = `
<div id='setMask' class='zhmMask'></div>
<div class='wrap-box' id='setWrap'>
    <!-- ${Config.copyFullText.text} -->
    <div class='zhm_set_page' id='${Config.copyFullText.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.copyFullText.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
            <li>
                <div class="zhm_set_page_content">
                    <span>${Config.showCopyFullTextAlert.text}</span>
                    <div class="circular" style="background-color:${Config.showCopyFullTextAlert.value ? '#FFE5E5' : '#FFF'}" id="${Config.showCopyFullTextAlert.ID}">
                        <div class="round-button" style="background: ${Config.showCopyFullTextAlert.value ? '#fe6d73' : '#fff'} ; left: ${Config.showCopyFullTextAlert.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <!-- ${Config.configureWallPaperHub.text} -->
    <div class='zhm_set_page' id='${Config.configureWallPaperHub.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.configureWallPaperHub.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        
        <ul class='zhm_set_page_list'>
            <li  style='display: inline-flex;'>
                <span style='padding-top:4px;'>${Config.wallPaperHubSite.text}：</span>
                <div class='select-box'>
                    <select class='select-box__body' id='${Config.wallPaperHubSite.ID}'>`

/* 这个for循环是遍历所有壁纸库 */
for (let item in wallPaperHub) {
    let siteSelected = Config.wallPaperHubSite.value === item ? 'selected' : '';
    sidebar_menu_html += `<option value=${item} ${siteSelected}>${item}</option>`
}

sidebar_menu_html += `
                    </select>
                </div>
            </li>
            <li>
            <div>${Config.WallHavenUrl.text}</div>
            <div style="margin-top: 10px; display: block; padding: 5px 0px;" id="">
                <span class="text-input">
                    <input value="${Config.WallHavenUrl.value}" id="${Config.WallHavenUrl.ID}" class="text-input__body" placeholder="${Config.WallHavenUrl.tips}" style="width:88%">
                </span>
            </div>
        </li>
        </ul>
    </div>

    <!-- ${Config.addSiteButton.text} -->
    <div class='zhm_set_page' id='${Config.addSiteButton.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.addSiteButton.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
            <li>
                <div class="zhm_set_page_content">
                    <span>${Config.addBBSSiteButton.text}</span>
                    <div class="circular" style="background-color:${Config.addBBSSiteButton.value ? '#FFE5E5' : '#FFF'}" id="${Config.addBBSSiteButton.ID}">
                        <div class="round-button" style="background: ${Config.addBBSSiteButton.value ? '#fe6d73' : '#fff'}; left: ${Config.addBBSSiteButton.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
            <li>
                <div class="zhm_set_page_content">
                    <span>${Config.addCourseEvaluationSiteButton.text}</span>
                    <div class="circular" style="background-color:${Config.addCourseEvaluationSiteButton.value ? '#FFE5E5' : '#FFF'}" id="${Config.addCourseEvaluationSiteButton.ID}">
                        <div class="round-button" style="background: ${Config.addCourseEvaluationSiteButton.value ? '#fe6d73' : '#fff'}; left: ${Config.addCourseEvaluationSiteButton.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <!-- ${Config.recordAlias.text} -->
    <div class='zhm_set_page' id='${Config.recordAlias.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.recordAlias.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
            <li>
                <div class="zhm_set_page_content">
                    <span>${Config.showAliasSuggestions.text}</span>
                    <div class="circular" style="background-color:${Config.showAliasSuggestions.value ? '#FFE5E5' : '#FFF'} id="${Config.showAliasSuggestions.ID}">
                        <div class="round-button" style="background:${Config.showAliasSuggestions.value ? '#fe6d73' : '#fff'}; left: ${Config.showAliasSuggestions.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <!-- ${Config.recordHistory.text} -->
    <div class='zhm_set_page' id='${Config.recordHistory.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.recordHistory.text.substring(0, 6)}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
            <li>
                <div class="zhm_set_page_content">
                    <span>${Config.showHistorySuggestions.text}</span>
                    <div class="circular" style="background-color:#${Config.showHistorySuggestions.value ? '#FFE5E5' : '#FFF'}" id="${Config.showHistorySuggestions.ID}">
                        <div class="round-button" style="background: ${Config.showHistorySuggestions.value ? '#fe6d73' : '#fff'}; left: ${Config.showHistorySuggestions.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
            <li>${Config.maxHistorySize.text}
                    <span class="text-input">
                        <input value="${Config.maxHistorySize.value}" id="${Config.maxHistorySize.ID}" class="text-input__body" placeholder="${Config.maxHistorySize.tips}" style="width:88%">
                    </span>
            </li>
            <li>
                ${Config.maxShownHistorySize.text}
                    <span class="text-input">
                        <input value="${Config.maxShownHistorySize.value}" id="${Config.maxShownHistorySize.ID}" class="text-input__body" placeholder="${Config.maxShownHistorySize.tips}" style="width:88%">
                    </span>
            </li>
        </ul>
    </div>

    <!-- ${Config.blockKeywords.text} -->
    <div class='zhm_set_page' id='${Config.blockKeywords.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.blockKeywords.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
        
        <li>
            <div>${Config.customBlockKeywords.text}</div>
            <div style="margin-top: 10px; display: block; padding: 5px 0px;" id="">
                <span class="text-input">
                    <input value="${Config.customBlockKeywords.value.length ? Config.customBlockKeywords.value.join('|') : ''}" id="${Config.customBlockKeywords.ID}" class="text-input__body" placeholder="${Config.customBlockKeywords.tips}" style="width:88%">
                </span>
            </div>
        </li>
       
        <!-- 多行文本框的写法：（这种写法目前无法屏蔽表情包，先不用）
            <li>
                <div>${Config.customBlockKeywords.text}</div>
                <div class="form__textarea">
                    <div class="textarea js-flexible-textarea" style="padding: 5px 0px;" id="">
                        <textarea rows="9" class="textarea__body zhm_scroll" placeholder="${Config.customBlockKeywords.tips}" style="width:250px;font-size:12px;padding:4px;resize:none;" id="playVideoLineTextarea"></textarea>
                    </div>
                </div>
            </li>
        -->
        </ul>
    </div>

    <!-- ${Config.beGoodAtSearch.text} -->
    <div class='zhm_set_page' id='${Config.beGoodAtSearch.ID + 'Enter'}'>
        <ul class='iconSetUlHead'>
            <li class='iconSetPageHead'>
                <span class='back'></span>
                <span>${Config.beGoodAtSearch.text}</span>
                <span class='iconSetSave'>×</span>
            </li>
        </ul>
        <ul class='zhm_set_page_list'>
        <li>
                <div class="zhm_set_page_content">
                    <span>${Config.beGoodAtSearchNotification.text}</span>
                    <div class="circular" style="background-color:#${Config.beGoodAtSearchNotification.value ? '#FFE5E5' : '#FFF'}" id="${Config.beGoodAtSearchNotification.ID}">
                        <div class="round-button" style="background: ${Config.beGoodAtSearchNotification.value ? '#fe6d73' : '#fff'}; left: ${Config.beGoodAtSearchNotification.value ? '22' : '0'}px;"></div>
                    </div>
                </div>
            </li>
        <li>
            <div>${Config.beGoodAtSearchLength.text}</div>
            <div style="margin-top: 10px; display: block; padding: 5px 0px;" id="">
                <span class="text-input">
                    <input value="${Config.beGoodAtSearchLength.value ? Config.beGoodAtSearchLength.value : '5000'}" id="${Config.beGoodAtSearchLength.ID}" class="text-input__body" placeholder="${Config.beGoodAtSearchLength.tips}" style="width:88%">
                </span>
            </div>
        </li>
       
        </ul>
    </div>
`



/** 主界面UI的HTML  */
let main_menu_html = `
    <!-- 下面是主界面UI -->
    <ul class="iconSetUlHead">
        <li class="iconSetPageHead">
            <span></span>
            <span>设置</span>
            <span class="iconSetSave">×</span>
        </li>
    </ul>

    <ul class="setWrapLi">`

/** 绑定右箭头的跳转页面 */
for (let item in Config) {
    if (Config[item].shownInMainMenu) {
        var listValue = Config[item].value; // 查找之前的记录
        let backColor, arrowColor, switchBackCorlor;
        if (!listValue) {
            backColor = '#fff';
            arrowColor = '#EEE';
            switchBackCorlor = '#FFF';
        } else {
            backColor = '#fe6d73';
            arrowColor = '#CCC';
            switchBackCorlor = '#FFE5E5';
        }
        if (!Config[item].hasSetPage) {
            arrowColor = '#EEE';
        };

        main_menu_html +=
            `
            <li><span>${Config[item].text}</span>
                <div class='setWrapLiContent'>
                    <div class='circular' id='${Config[item].ID}' style='background-color: ${switchBackCorlor};'>
                        <div class='round-button' style='background: ${backColor}; left: ${listValue ? 22 : 0}px'></div>
                    </div>
                <span class='to-right' data='${Config[item].hasSetPage ? Config[item].ID + 'Enter' : ""}' takePlace='${Config[item].takePlace ? 220 : 0}' style='border: solid ${arrowColor}; border-width: 0 3px 3px 0;'></span>
                </div>
            </li>
        `
    }
}

main_menu_html += `
    <div style='height:40px;' id='zhmTakePlace'></div>
    <div class='iconSetFoot' style=''>
        <ul class='iconSetFootLi'>
        <li></li>
        </ul>
        </ul>
    </div>
</div>
`
/** UI的CSS样式 */
var menuSetStyle = `
                        .zhmMask{
                            z-index:999999999;
                            background-color:#000;
                            position: fixed;top: 0;right: 0;bottom: 0;left: 0;
                            opacity:0.8;
                        }
                        .wrap-box{
                            z-index:1000000000;
                            position:fixed;;top: 40%;left: 50%;transform: translate(-50%, -200px);
                            width: 300px;
                            color: #555;
                            background-color: #fff;
                            border-radius: 5px;
                            overflow:hidden;
                            font:16px numFont,PingFangSC-Regular,Tahoma,Microsoft Yahei,sans-serif !important;
                            font-weight:400 !important;
                        }
                        .setWrapHead{
                            background-color:#f24443;height:40px;color:#fff;text-align:center;line-height:40px;
                        }
                        .setWrapLi{
                            margin:0px;padding:0px;
                        }
                        .setWrapLi li{
                            background-color: #fff;
                            border-bottom:1px solid #eee;
                            margin:0px !important;
                            padding:12px 20px;
                            display: flex;
                            justify-content: space-between;align-items: center;
                            list-style: none;
                        }
                        .setWrapLiContent{
                            display: flex;justify-content: space-between;align-items: center;
                        }
                        .setWrapSave{
                            position:absolute;top:-2px;right:10px;font-size:24px;cursor:pointer
                        }
                        .iconSetFoot{
                            position:absolute;bottom:0px;padding:10px 20px;width:100%;
                        z-index:1000000009;background:#fef9ef;
                        }
                        .iconSetFootLi{
                            margin:0px;padding:0px;
                        }
                        .iconSetFootLi li{
                            display: inline-flex;
                            padding:0px 2px;
                            justify-content: space-between;align-items: center;
                            font-size: 12px;
                        }
                        .iconSetFootLi li a{
                            color:#555;
                        }
                        .iconSetFootLi a:hover {
                            color:#fe6d73;
                        }
                        .iconSetPage{
                            z-index:1000000001;
                            position:absolute;top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .iconSetUlHead{
                        padding:0px;
                        margin:0px;
                        }
                        .iconSetPageHead{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .iconSetPageLi{
                            margin:0px;padding:0px;
                        }
                        .iconSetPageLi li{
                            list-style: none;
                            padding:8px 20px;
                            border-bottom:1px solid #eee;
                        }
                        .zhihuSetPage{
                            z-index:1000000002;position:absolute;top:0px;left:300px;background:#fff;width:300px;height:100%;
                        }
                        .iconSetPageInput{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhihuSetPageLi{
                            margin:0px;padding:0px;
                            height:258px;
                            overflow-y: scroll;
                        }
                        .zhihuSetPageContent{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .circular{
                            width: 40px;height: 20px;border-radius: 16px;transition: .3s;cursor: pointer;box-shadow: 0 0 3px #999 inset;
                        }
                        .round-button{
                            width: 20px;height: 20px;;border-radius: 50%;box-shadow: 0 1px 5px rgba(0,0,0,.5);transition: .3s;position: relative;
                        }
                        .back{
                            border: solid #FFF; border-width: 0 3px 3px 0; display: inline-block; padding: 3px;transform: rotate(135deg);  -webkit-transform: rotate(135deg);margin-left:10px;cursor:pointer;
                        }
                        .to-right{
                            margin-left:20px; display: inline-block; padding: 3px;transform: rotate(-45deg); -webkit-transform: rotate(-45deg);cursor:pointer;
                        }
                        .iconSetSave{
                            font-size:24px;cursor:pointer;margin-right:5px;margin-bottom:4px;color:#FFF;
                        }
                        .zhm_set_page{
                            z-index:1000000003;
                            position:absolute;
                            top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .zhm_set_page_header{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .zhm_set_page_content{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhm_set_page_list{
                            margin:0px;padding:0px;
                            height: 220px;
                            overflow-y: scroll;
                        }
                        .zhm_set_page_list::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        .zhm_set_page_list li{
                            /*border-bottom:1px solid #ccc;*/
                            padding:12px 20px;
                            display:block;
                            border-bottom:1px solid #eee;
                        }
                        li:last-child{
                            border-bottom:none;
                        }
                        .zhm_scroll{
                        overflow-y: scroll !important;
                        }
                        .zhm_scroll::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_scroll::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_scroll::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        /*-form-*/
                        :root {
                            --base-color: #434a56;
                            --white-color-primary: #f7f8f8;
                            --white-color-secondary: #fefefe;
                            --gray-color-primary: #c2c2c2;
                            --gray-color-secondary: #c2c2c2;
                            --gray-color-tertiary: #676f79;
                            --active-color: #227c9d;
                            --valid-color: #c2c2c2;
                            --invalid-color: #f72f47;
                            --invalid-icon: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%3Cpath%20d%3D%22M13.41%2012l4.3-4.29a1%201%200%201%200-1.42-1.42L12%2010.59l-4.29-4.3a1%201%200%200%200-1.42%201.42l4.3%204.29-4.3%204.29a1%201%200%200%200%200%201.42%201%201%200%200%200%201.42%200l4.29-4.3%204.29%204.3a1%201%200%200%200%201.42%200%201%201%200%200%200%200-1.42z%22%20fill%3D%22%23f72f47%22%20%2F%3E%3C%2Fsvg%3E");
                        }
                        .text-input {
                            font-size: 16px;
                            position: relative;
                            right:0px;
                            z-index: 0;
                        }
                        .text-input__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            height: 1.7em;
                            line-height: 1.7;
                            overflow: hidden;
                            padding: 2px 1em;
                            text-overflow: ellipsis;
                            transition: background-color 0.3s;
                            width:55%;
                            font-size:14px;
                        }
                        .text-input__body:-ms-input-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::-moz-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::placeholder {
                            color: var(--gray-color-secondary);
                        }
                        *, ::after, ::before {
                        box-sizing: initial !important;
                        }
                        .text-input__body[data-is-valid] {
                            padding-right: 1em;
                        }
                        .text-input__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                        }
                        .text-input__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .text-input__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .text-input__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .text-input__validator {
                            background-position: right 0.5em center;
                            background-repeat: no-repeat;
                            background-size: 1.5em;
                            display: inline-block;
                            height: 100%;
                            left: 0;
                            position: absolute;
                            top: 0;
                            width: 100%;
                            z-index: -1;
                        }
                        .text-input__body[data-is-valid=false] + .text-input__validator {
                            background-image: var(--invalid-icon);
                        }
                        .select-box {
                            box-sizing: inherit;
                            font-size: 16px;
                            position: relative;
                            transition: background-color 0.5s ease-out;
                            width:90px;
                        }
                        .select-box::after {
                            border-color: var(--gray-color-secondary) transparent transparent transparent;
                            border-style: solid;
                            border-width: 6px 4px 0;
                            bottom: 0;
                            content: "";
                            display: inline-block;
                            height: 0;
                            margin: auto 0;
                            pointer-events: none;
                            position: absolute;
                            right: -72px;
                            top: 0;
                            width: 0;
                            z-index: 1;
                        }
                        .select-box__body {
                            box-sizing: inherit;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            cursor: pointer;
                            height: 1.7em;
                            line-height: 1.7;
                            padding-left: 1em;
                            padding-right: calc(1em + 16px);
                            width: 140%;
                            font-size:14px;
                            padding-top:2px;
                            padding-bottom:2px;
                        }
                        .select-box__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .select-box__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .select-box__body.focus-visible {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .select-box__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .textarea__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 0;
                            box-sizing: border-box;
                            font: inherit;
                            left: 0;
                            letter-spacing: inherit;
                            overflow: hidden;
                            padding: 1em;
                            position: absolute;
                            resize: none;
                            top: 0;
                            transition: background-color 0.5s ease-out;
                            width: 100%;
                            }
                        .textarea__body:only-child {
                            position: relative;
                            resize: vertical;
                        }
                        .textarea__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .textarea__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .textarea__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .textarea ._dummy-box {
                            border: 1px solid;
                            box-sizing: border-box;
                            min-height: 240px;
                            overflow: hidden;
                            overflow-wrap: break-word;
                            padding: 1em;
                            visibility: hidden;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                        }
                        .toLeftMove{
                            nimation:moveToLeft 0.5s infinite;
                            -webkit-animation:moveToLeft 0.5s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }
                        @keyframes moveToLeft{
                            from {left:200px;}
                            to {left:0px;}
                        }
                        @-webkit-keyframes moveToLeft /*Safari and Chrome*/{
                            from {left:200px;}
                            to {left:0px;}
                        }
                        .toRightMove{
                            nimation:moveToRight 2s infinite;
                            -webkit-animation:moveToRight 2s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }
                        @keyframes moveToRight{
                            from {left:0px;}
                            to {left:2000px;}
                        }
                        @-webkit-keyframes moveToRight /*Safari and Chrome*/{
                            from {left:0px;}
                            to {left:2000px;}
                        }
                    `;


/** 注册功能开关 */
registerMenuCommand()

//================================================================================================================
// 显示脚本菜单 end
//================================================================================================================


//================================================================================================================
// 功能函数，用于对付树洞版本更新带来的节点属性data-v-xxxx的改变 start
//================================================================================================================ 

/** 
 * 返回节点的 data-v-xxxx 属性名称
 * @param {Node} Node
 * @return {String|undefined} attribute 
 * 由于树洞在更新版本之后，会将节点属性data-v-xxxx作更新，对应的css属性也会更新。为了更好的兼容后续版本，需要将对应节点的data-v也作实时更新
 */
function getDataVersionByNode(Node) {
    if (Node.hasAttributes()) {
        const attributes_names_array = Node.getAttributeNames();
        for (var i = 0; i < attributes_names_array.length; ++i) {
            if (attributes_names_array[i].startsWith("data-v-")) {
                return attributes_names_array[i]
            }
        }
    }
    return undefined
}

/** 将cookie转换成对象 */
function _getCookieObj() {
    var cookieObj = {};
    var cookieStr = document.cookie;
    var pairList = cookieStr.split(';');
    for (var _i = 0, pairList_1 = pairList; _i < pairList_1.length; _i++) {
        var pair = pairList_1[_i];
        var _a = pair.trim().split('='), key = _a[0], value = _a[1];
        cookieObj[key] = value;
    }
    return cookieObj;
}

//================================================================================================================
// 功能函数，用于对付树洞版本更新带来的节点属性data-v-xxxx的改变 end
//================================================================================================================ 

//================================================================================================================
// 取消最大高度限制 start
//================================================================================================================ 

function cancelMaxHeight() {
    if (!Config.cancelMaxHeight.value) return

    console.log('取消最大高度限制')
    document.styleSheets[0].insertRule('.left-container .sidebar .box-content { max-height: none !important }', 0)
}

//================================================================================================================
// 取消最大高度限制 end
//================================================================================================================



//================================================================================================================
// 添加“复制全文”标签 start
//================================================================================================================

// 添加“复制全文”css图标
function addCopyFullTextButtonIcon() {
    if (!Config.copyFullText.value) return

    // 判断是否为夜晚模式
    var dark_mode = document.querySelector("body").getAttribute("style").indexOf("--theme_bgc_color:rgba(31,31,31,0.8); --theme_font_color:#ededed;") > -1;

    GM_addStyle(`div.box-header.box-header-top-icon{
        overflow: visible;
    }`) // 这一步是为了“复制全文”标签超出header框之后仍然能显示

    GM_addStyle(`
        div:nth-child(3) > div.box-header.box-header-top-icon > code:hover:before {
            content: "复制全文";
            position: relative;
            width: 5em;
            height: 1.3em;
            line-height: 1.3em;
            margin-bottom: -1.3em;
            border-radius: 3px;
            text-align: center;
            top: -1.5em;
            display: block;
            color: #fff;
            background-color: rgba(0,0,0,.6);
            pointer-events: none;
        } `
    )// “复制全文”标签

    GM_addStyle(`
        div:nth-child(3) > div.box-header.box-header-top-icon > code:hover{
            text-decoration: underline; /* 下划线 */
            color: ${dark_mode ? "#9BF" : "#00C"};
    }
    `)
}


// 使用MutationObserver观察器观察dom子节点变动，判断是否进入树洞详情页，从而判断是否添加“复制全文”点击事件
function addCopyFullTextButton() {
    if (!Config.copyFullText.value) return

    console.log('新增复制全文按钮');

    waitForKeyElements('#eagleMapContainer div.sidebar > div.sidebar-content.sidebar-content-show > div > div:nth-child(3) > div.box-header.box-header-top-icon > code',
        (codeNodes) => {
            let codeNode = codeNodes[0]
            var triggered = false;
            codeNode.addEventListener("click", async (event) => {
                if (triggered) { console.log("请耐心等待复制结果，不要多次点击复制全文"); return }

                triggered = true;  // 防止重复触发
                event.stopPropagation();    // 停止点击事件传播
                const content = await _copy_content_now(codeNode.innerText.replace("#", "").trim());
                GM_setClipboard(content);    // 复制文本进入剪切板
                if (Config.showCopyFullTextAlert.value)  // 判断复制成功是否需要提醒
                    alert("复制成功！");
                else
                    console.log("复制成功！")

                triggered = false;  // 重置触发状态
            }, { capture: true })
        }
    )
}

// 获取树洞的内容，以及关注数、回复数
async function _getBoxIdDetail(box_id) {
    const content = await new Promise((resolve, reject) => {
        fetch("https://treehole.pku.edu.cn/api/pku/" + box_id, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": "Bearer " + _getCookieObj()["pku_token"],
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "uuid": localStorage.getItem("pku-uuid"),
            },
            "referrer": "https://treehole.pku.edu.cn/web/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            resolve(response.json())
        }).catch(err => {
            reject(err)
        })
    })
    return content;
}

async function _getReplys(box_id, pages, sort = "asc") {
    try {
        var fetch_list = []
        var timeout = 0
        // 每隔一段时间进行一次请求，避免被封，也减小服务器压力
        for (let page = 1; page <= pages; ++page) {
            timeout = timeout + 200;
            fetch_list.push(new Promise((resolve, reject) => {
                setTimeout(() => {
                    fetch(
                        `https://treehole.pku.edu.cn/api/pku_comment_v3/${box_id}?page=${page}&limit=15&sort=${sort}`, {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "authorization": "Bearer " + _getCookieObj()["pku_token"],
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "uuid": localStorage.getItem("pku-uuid"),
                        },
                        "referrer": "https://treehole.pku.edu.cn/web/",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    }
                    ).then((response) => resolve(response.json())).catch((err) => reject(err))
                }, timeout);
            }))
        }
        const data_list = await Promise.all(fetch_list)
        return data_list
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _copy_content_now(box_id) {
    const box_id_detail = await _getBoxIdDetail(box_id);
    var copy_content = ""
    if (box_id_detail.code === 20000) {
        const box_id_reply_num = box_id_detail.data.reply    // 回复数
        const box_id_like_num = box_id_detail.data.likenum // 关注数
        const box_id_content = box_id_detail.data.text  // 内容
        const box_id_time = box_id_detail.data.timestamp // 时间
        let box_id_replys = await _getReplys(box_id, Math.ceil(box_id_reply_num / 15)) // 回复列表
        box_id_replys = box_id_replys.map((reply) => reply.data.data).flat(1)
        copy_content = `#${box_id} ${timeFormat(box_id_time)} 关注数：${box_id_like_num} 回复数：${box_id_reply_num}\n${box_id_content}\n`
        box_id_replys.forEach((reply) => {
            copy_content += `#${reply.cid} ${timeFormat(reply.timestamp)}\n[${reply.name}] ${reply.text}\n`
        })
    }
    return copy_content;
}
//================================================================================================================
// 添加“复制全文”标签 end
//================================================================================================================



//================================================================================================================
// 设置随机壁纸 start
// ===============================================================================================================

/**
 * 在页面的右下角插入一张风车svg图片，点击风车会切换壁纸
 * 
 */
var angle = 0; // 旋转角度
var speed_up_acceleration = 0.05;   // 加速加速度
var speed_down_acceleration = 0.02;   // 减速加速度
var speed = 0.5;    // 初始旋转速度
var min_speed = 0.1;    // 最小旋转速度，小于该速度风车停下
var max_speed = 5.4;    // 最大旋转速度（一秒钟转一圈半），大于该速度风车不再加速
var is_rotating = false;    // 是否正在旋转，防止多次点击风车


/**
 * Define a function to rotate the image with easing
 * @param {HTMLImageElement} img 
 * @returns {number} setInterval's ID
 */
function rotateImage(img) {
    speed = 0.5;
    is_rotating = true;

    const rotateInterval = setInterval(() => {
        if (speed < max_speed) {
            angle = (angle - speed) % 360;
            speed += speed_up_acceleration;
        }
        else {
            angle = (angle - max_speed) % 360;
        }
        img.style.transform = `rotate(${angle}deg)`;
    }, 10);
    return rotateInterval;
}


/**
 * Define a function to stop the rotation with easing
 * @param {number} rotateInterval 
 * @param {HTMLImageElement} img 
 */
function stopRotation(rotateInterval, img) {
    clearInterval(rotateInterval);
    const stopRotateInterval = setInterval(() => {
        if (speed >= min_speed) {
            angle = (angle - speed) % 360;
            speed -= speed_down_acceleration;
        }
        else {
            speed = 0;
            clearInterval(stopRotateInterval);
        }
        img.style.transform = `rotate(${angle}deg)`;
    }, 10);
    is_rotating = false;
}



// 配置随机壁纸库
function configureWallPaperHub() {
    if (!Config.configureWallPaperHub.value) return

    // 添加右下角风车图标
    var windMillNode = document.createElement("div")
    windMillNode.setAttribute("class", "windmill")
    var windMillImageNode = document.createElement("img")
    windMillImageNode.id = "windmill"
    windMillImageNode.src = "https://infinityicon.infinitynewtab.com/assets/windmill.svg"
    var windMillStickNode = document.createElement("span")
    windMillNode.appendChild(windMillImageNode)
    windMillNode.appendChild(windMillStickNode)
    document.querySelector("body").appendChild(windMillNode)

    // 给风车添加css样式
    GM_addStyle(`
        .windmill {
            position: absolute;
            right: 60px;
            bottom: 0px;
            display: flex;
            flex-direction: column;
        }
        .windmill img {
            z-index: 1;
            cursor: pointer;
            width: 40px;
            height: 40px;
        }
        .windmill span {
            display: block;
            margin-top: -30px;
            margin-left: auto;
            margin-right: auto;
            width: 5px;
            height: 56px;
            background-color: rgb(254, 254, 254);
    }
    `)

    if (localStorage.getItem("pku_background_id") != "6") {
        localStorage.setItem("pku_background_id", "6") // 设置背景图片来自图片网址
    }

    if (Config.wallPaperHubSite.value == 'Bing') {
        windMillImageNode.addEventListener("click", function () {
            if (!is_rotating) {
                const rotateInterval = rotateImage(windMillImageNode);
                getOneBingWallPaper(callback = () => { stopRotation(rotateInterval, windMillImageNode) });
            }
        })
    } else if (Config.wallPaperHubSite.value == 'WallHaven') {
        windMillImageNode.addEventListener("click", function () {
            if (!is_rotating) {
                const rotateInterval = rotateImage(windMillImageNode);
                getOneWallHavenPaper(callback = () => { stopRotation(rotateInterval, windMillImageNode) });
            }
        })
    }
}

/** 获取一张Bing随机壁纸 */
function getOneBingWallPaper(callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10",
        onload: function (res) {
            try {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);

                    // console.log(json);
                    const img = json.images[Math.round(Math.random() * (8))];
                    const figure_href = `https://cn.bing.com${img.url.split("_1920x1080")[0]}_UHD.jpg`;

                    // 先请求看图片网址是否有效，如果有效再将图片网址存入localStorage
                    // 这一步利用了HTTP的缓存机制，网页不会重复发送请求
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: figure_href,
                        onload: function (response) {
                            if (response.status == 200) {
                                let tempImgNode = document.createElement('img');
                                tempImgNode.src = figure_href;
                                tempImgNode.onload = function () {
                                    localStorage.setItem("pku_background_data", figure_href);
                                    document.querySelector("#app > div.bg-img").style = `background: url("${figure_href}") center center / cover rgb(29, 71, 134);`
                                    console.log(`从Bing获取壁纸成功：网址：${figure_href}`);
                                    callback(); // 停止风车旋转
                                }
                            } else {
                                throw new Error(`wallhaven网址 ${figure_dic.href} 请求失败：状态码 + ${response.status}`);
                            }
                        }
                    });
                } else {
                    throw new Error(`Bing网址 ${url} 请求失败：状态码 + ${res.status}`);
                }
            } catch (error) {
                console.error(error)
                console.log("无法从Bing获取最新壁纸！");
                callback(); // 停止风车旋转
            }
        }
    });
}

/**获取一张WallHaven随机壁纸 */
function getOneWallHavenPaper(callback) {
    if (Config.WallHavenUrl.value) {
        var _url = Config.WallHavenUrl.value;
        var given_page = false; // 是否指定了页数

        // 如果url以“&page=数字”结尾，则去直接在该页获取壁纸
        if (_url.match(/&page=\d+$/)) {
            given_page = true;
        }

        // 根据url请求壁纸的第一页
        GM_xmlhttpRequest({
            method: "GET",
            url: _url,
            onload: async function (res) {
                try {
                    if (res.status == 200) {
                        var text = res.responseText;
                        const figure_dic = await _getRandomOneHref(text, given_page);  // 获取随机一页的随机一张图片

                        // 先请求看图片网址是否有效，如果有效再将图片网址存入localStorage
                        // 这一步利用了HTTP的缓存机制，网页不会重复发送请求
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: figure_dic.href,
                            onload: function (response) {
                                if (response.status == 200) {
                                    // 使用img节点监听图片是否加载完成，完成了再显示壁纸
                                    let tempImgNode = document.createElement('img');
                                    tempImgNode.src = figure_dic.href;
                                    tempImgNode.onload = function () {
                                        localStorage.setItem("pku_background_data", figure_dic.href);
                                        document.querySelector("#app > div.bg-img").style = `background: url("${figure_dic.href}") center center / cover rgb(29, 71, 134);`
                                        console.log(`从wallhaven获取壁纸成功：第${figure_dic.page}页，第${figure_dic.index}张壁纸，网址：${figure_dic.href}`);
                                        callback(); // 停止风车旋转
                                    }
                                } else {
                                    throw new Error(`wallhaven网址 ${figure_dic.href} 请求失败：状态码 + ${response.status}`);
                                }
                            }
                        })
                    }
                    else {
                        throw new Error(`wallhaven网址 ${figure_dic.href} 请求失败：状态码 + ${response.status}`);
                    }
                } catch (error) {
                    console.error(error)
                    console.log("无法从wallhaven获取最新壁纸！请尝试手动访问Wallhaven网站，以确保访问正常！");
                    callback(); // 停止风车旋转
                }
            }
        })
    } else {
        console.log("请在功能开关里输入WallHaven分类地址！")
    }

    /**
     * 随机一张壁纸 
     * @param {string} text 从网页获取的html文本
     * @param {boolean} given_page 是否指定了页数；若指定，则text为指定页数的网页html文本，否则text为主页的网页html文本
     */
    async function _getRandomOneHref(text, given_page = false) {
        /* 使用doc节点的加载方式解析第一页（主页） */
        var WallHavenDoc = document.createElement('wallhaven')
        WallHavenDoc.innerHTML = text

        // 如果没有给定页数，则随机一个页数
        if (!given_page) {
            // 获取总页数
            var total_pages = 1 // 总页数
            // 解析总页数所在json字符串
            try {
                var pages_json_string = WallHavenDoc.querySelector("ul.pagination").getAttribute("data-pagination")
                let pages_json = JSON.parse(pages_json_string)
                total_pages = pages_json.total
            } catch (error) {
                console.log(error)
                console.log("解析总页数失败（可能是因为总页数为1），只返回第一页的壁纸。")
            }

            // 在总页数中随机一个页数（如果只有一页，这种计算方式下page=1）
            var page = Math.floor(Math.random() * total_pages) + 1

            // 如果随机到第一页（主页），由于已经请求过了，就不再做请求
            // 如果随机到的不是第一页（主页），需要再做一次请求
            if (page != 1) {
                _url = _url + `&page=${page}`

                // 做一次fetch，请求随机的一页
                async function fetchOnePage(_url) {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: _url,
                            onload: function (response) {
                                resolve(response);
                            },
                            onerror: function (error) {
                                reject(error);
                            }
                        });
                    });
                }
                var res = await fetchOnePage(_url)
                if (res.status == 200) {
                    WallHavenDoc.innerHTML = res.responseText // 重新加载doc节点为第page页的html文本
                }
            }
        }

        // 随机获取该页的一张图片
        var thumbs = WallHavenDoc.querySelectorAll("div.thumb-info")
        var arr = []
        for (let thumb_info of thumbs) {
            let id = thumb_info.querySelector("a.jsAnchor.thumb-tags-toggle.tagged").getAttribute("data-href", "").replace('https://wallhaven.cc/wallpaper/tags/', '').trim()
            if (id && thumb_info.querySelector('span.png')) {
                arr.push(`https://w.wallhaven.cc/full/${id.substring(0, 2)}/wallhaven-${id}.png`)
            } else {
                arr.push(`https://w.wallhaven.cc/full/${id.substring(0, 2)}/wallhaven-${id}.jpg`)
            }
        }
        let index = Math.floor(Math.random() * arr.length)

        // 返回壁纸信息
        const figure_dic = {
            index: index,
            page: page,
            href: arr[index],
        }
        return figure_dic
    }
}

//================================================================================================================
// 设置随机壁纸 end
// ===============================================================================================================



//================================================================================================================
// 屏蔽关键词 start
// ===============================================================================================================

// 屏蔽主页面树洞关键词
function blockChunkKeywords(item) {
    if (!Config.blockKeywords.value) return
    if (!Config.customBlockKeywords.value || Config.customBlockKeywords.value.length < 1) return

    _checkNode(item)
}


// 屏蔽侧边栏（详情页）关键词
function blockSidebarKeywords() {
    if (!Config.blockKeywords.value) return
    if (!Config.customBlockKeywords.value || Config.customBlockKeywords.value.length < 1) return

    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const item of mutation.addedNodes) { _checkNode(item) }
        }
    };
    const sidebar_container_observer = new MutationObserver(callback)   // 这个观察器是用来观察侧边栏的box

    waitForKeyElements("div.sidebar-content.sidebar-content-show > div", (sidebar_container) => {
        sidebar_container_observer.observe(sidebar_container[0], { childList: true });
        for (let item of sidebar_container[0].childNodes) { _checkNode(item) } // 这个for循环是为了避免在加载评论时，观察器晚加载导致前面的节点没进行关键词检测
    })
}

// 检查节点中是否含有屏蔽词
function _checkNode(Node) {
    for (const keyword of Config.customBlockKeywords.value) { // 遍历关键词黑名单
        let text = Node.content || Node.textContent;
        if (keyword != '' && text.toLowerCase().indexOf(keyword.toLowerCase()) > -1) { // 找到就删除该信息流
            console.log('已屏蔽：' + text);
            Node.hidden = true;
            Node.style.display = 'none';
            break;
        }
    }
}


//================================================================================================================
// 屏蔽关键词 end
// ===============================================================================================================




//================================================================================================================
// 记录别名 start
// ===============================================================================================================
/**
 * 这个函数的作用是在“账户”侧边栏里显示收藏的树洞别名
  */
function recordAlias(params) {
    if (!Config.recordAlias.value) return
    if (!GM_getValue("Alias_json", "")) GM_setValue("Alias_json", "{}");

    waitForKeyElements('#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(2) > div > a:nth-child(3)', (abouts) => {
        const callback = () => {
            // 在sidebar区添加文本框
            var text_area_nodes = _create_text_area_nodes()
            // 等待侧边栏唤起
            waitForKeyElements('#eagleMapContainer div.box.box-right',
                (nodes) => {
                    var box_right_node = nodes[0]
                    var hr = document.createElement('hr') // 空行
                    hr.setAttribute('style', 'margin: 16px 0')
                    box_right_node.appendChild(hr)  // 添加空行
                    box_right_node.appendChild(text_area_nodes)  // 添加别名文本框节点
                    load_alias()
                    let config_text_area_node = text_area_nodes.querySelector('.config-textarea')
                    config_text_area_node.addEventListener("change", save_alias)
                }
            )
        }
        var about = abouts[0] // “搜索”右侧的“账户”按钮的选择器
        about.addEventListener('click', callback)   // 点击“账户”按钮，唤起侧边栏时，给侧边栏添加别名文本框

        function _create_text_area_nodes() {
            var text_area_nodes = document.createElement('div')
            text_area_nodes.innerHTML = `
                <div>
                    <div class="row-bg el-row" style="margin-left: -5px; margin-right: -5px;">
                        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-5 el-col-md-5 el-col-lg-5 el-col-xl-5" style="padding-left: 5px; padding-right: 5px;">
                            <b >洞号别名：</b>
                        </div> 
                        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-19 el-col-md-19 el-col-lg-19 el-col-xl-19" style="padding-left: 5px; padding-right: 5px;">
                            <textarea name="config-alias" id="config-t  extarea-alias" class="config-textarea" style="
                            margin-top: 0.5em; \
                            width: 100%; \
                            max-width: 100%; \
                            min-width: 100%; \
                            height: 7em; \
                            min-height: 2em;">
                            </textarea>
                        </div>
                    </div>
                    <p class="config-description">在这里记录别名和洞号（请用“别名+空格+洞号”的格式记录，以支持搜索提醒）</p>
                </div>
            `
            return text_area_nodes
        }
    }
    )
}

/** 将收藏的树洞加载到“账户”的侧边栏详情页中 */
function load_alias() {
    let alias_json_str = GM_getValue("Alias_json", "{}");
    if (alias_json_str) {
        try {
            let alias_dic = JSON.parse(alias_json_str)
            let config_text_area_node = document.querySelector('.config-textarea')
            let alias = "";
            for (let key in alias_dic) {
                alias = alias + key + "  " + alias_dic[key] + "\n"
            }
            config_text_area_node.value = alias;
        } catch (error) {
            console.log("解析洞号别名错误！" + error)
        }
    } else {
        let config_text_area_node = document.querySelector('.config-textarea')
        let alias = "";
        config_text_area_node.value = alias;
    }
}

/** 将“账户”侧边栏的收藏树洞保存 */
function save_alias() {
    let config_text_area_node = document.querySelector('.config-textarea');
    let alias = config_text_area_node.value;
    let alias_arr = alias.split("\n")
    let alias_dic = {}
    for (let alia_str of alias_arr) {
        if (alia_str.length > 0) {  // 不是空行
            // alia_str = alia_str.trim()
            // let alia_arr = alia_str.split(" ").filter(d => d)    // 去掉中间多余的空格
            let alia_arr = alia_str.split(" ")
            if (alia_arr.length) {
                let key = "", value = ""

                if (alia_arr.length == 2) { key = alia_arr[0], value = alia_arr[1]; }   // 刚好是key-value键值对
                else if (alia_arr.length == 1) { key = alia_arr[0], value = ""; }       // 这一行没有空格
                else { key = alia_arr.slice(0, alia_arr.length - 1).join(" "), value = alia_arr[alia_arr.length - 1] } // 这一行有多个空格，以最后一个空格为分界

                alias_dic[key] = value
            }
        }
    }
    try {
        let alias_json_str = JSON.stringify(alias_dic)
        GM_setValue("Alias_json", alias_json_str)
    } catch (error) {
        console("保存Alias_json发生错误！" + error)
    }
}

/** 
 * 添加一条树洞别名
 * @param {string} comment 树洞描述
 * @param {string} hole_id 洞号
  */
function addOneAlia(comment, hole_id) {
    let alias_json_str = GM_getValue("Alias_json", "{}");
    if (!comment) { console.log("请输入树洞描述/别名！"); return }

    try {
        let alias_dic = JSON.parse(alias_json_str)
        if (typeof (comment) != 'string')
            throw "comment is not string"
        else if (comment in alias_dic)
            throw "现有描述（别名）已存在！"
        else {
            alias_dic[comment] = hole_id;
            try {
                alias_json_str = JSON.stringify(alias_dic)
                GM_setValue("Alias_json", alias_json_str)
            } catch (error) {
                alert("保存Alias_json发生错误：" + error)
            }
        }
    } catch (error) {
        alert("存储洞号别名失败：" + error)
    }

}

/** 
 * 在树洞详情页添加“添加别名”按钮
  */
function addAddAliaButton() {
    if (!Config.recordAlias.value) return

    let toolbar = document.querySelector("div.box.box-tip.sidebar-toolbar")
    if (toolbar) {
        let add_alia_button = document.createElement("span")
        add_alia_button.classList.add("sidebar-toolbar-item")
        add_alia_button.innerHTML = `
        <a>
            <span class="icon icon-star"></span>
            <label>添加别名</label>
        </a>
        `
        add_alia_button.addEventListener("click", () => {
            let newComment = prompt('请输入对该洞的描述（不需要输入洞号）：', '');
            if (newComment === '') {
                alert("未输入别名，无法储存")
            } else {
                var hole_id = document.querySelector("#eagleMapContainer > div:nth-child(3) > div > div:nth-child(2) > div.sidebar > div.sidebar-content.sidebar-content-show > div > div:nth-child(3) > div.box-header.box-header-top-icon > code")
                if (hole_id)
                    addOneAlia(newComment, hole_id.innerText)
                else
                    alert("洞号不存在，无法储存")
            }
        })
        toolbar.insertBefore(add_alia_button, toolbar.lastChild)
    }
}

//================================================================================================================
// 记录别名 end
// ===============================================================================================================



//================================================================================================================
// 添加课程评估网站、bbs网站按钮 start
// ===============================================================================================================

function addSiteButton() {
    if (!Config.addSiteButton.value) return

    waitForKeyElements("#eagleMapContainer > div.title-bar > div.app-switcher", (app_switcher_list) => {
        let app_switcher = app_switcher_list[0]

        if (Config.addCourseEvaluationSiteButton.value) {
            let app_switcher_item = document.createElement("a")
            let app_switcher_right = document.querySelector("#eagleMapContainer > div.title-bar > div.app-switcher > span.app-switcher-desc.app-switcher-right") // 参考位置节点
            app_switcher_item.setAttribute(`${getDataVersionByNode(app_switcher_right)}`, "")
            app_switcher_item.setAttribute("class", "app-switcher-item ")
            app_switcher_item.setAttribute("href", "https://courses.pinzhixiaoyuan.com/")

            // course_evalution_site_icon_base64 是课程网站的图标icon，这里直接用base64给出是为了减少跨域请求
            let course_evalution_site_icon_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACwBAMAAABdmfltAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURUdwTPOWmvOWmfOWmfOWmfOWmvOWmfOWmv////e9wPShpfWrrv3r6/rU1tbOSnAAAAAHdFJOUwDpI6NMyHnu6qNXAAAHmklEQVRo3sVbS1MiSRA28HFnfHD1tXN2Rx2uOsPqecZwuers7HommKGCZrg3IZyFEc7Eip5xUc+L6JwFw/kvS1c30FWVWZ3dNLF5MqKbz+qsrzLzq6yamvq/LbK6nkgk3q0uhwq6/tfmYTTGGItGDzc/vwsJdnVv28IcWfTgcwjjjrz/wFRbHBt6D4K1bP7TOLAzf8YYZqnfgw/69Qems/mgs/g+xvT29VOwWfPC7btjKwDwb4xg/pEjJNy+bU1ivAGQ12Jk4NQbPzyj4/a5cURfF0nmx9I71Ik7Zv5saTnsiRu4+SMJdy7GfCNT3ByJM/82vzwBR3D7OAlHcGd4MuOYBbMlryXHgtpR+DPnLJPlyQyYMV3MiCTHANYN+RfGJjLksQasGzLRw9mWzyFTKXFZ7MHQaQR4mvjJ16ZZ7NV9cPmECFw2+/YIQS+NFyXaJrcf53VaxNgl4uYcYAuaEuTIXMuaQyvK0F+Xg08dy5umG7rlNX3UqWPfTMFE7n1RU744dQYOfGuaOHRqWRsmjNqLOjEC20R7bA6fbug8YVStt3sIcLf/rPSzLSCfDZ9mdJ5wPvYZxDUsyFPj7xe3M+qoL9yeyDqjKTZBGluPOv0//hlBl1zPN1BPGEMnPqA0fuIvDqELrueiLyIxaAGAQ867fJpzoE/RNTIN0+kJCprCf7yoDjwDr5FdadaBT3SzzTVZWWUAr9zASWlyzMe2NNsi26R1eIaF+xnZh/etBh94Ew6ap5hn5Ng5K/nQAszCTuZBsyOkE7MovuIi3L6YePincoQnDdtAz1i2ALqYAxcGK6wDs20EbHTVOU6DLuazXhg4swOyzeV6/l0PWIKaZoArkBFfA2z7lyFO3pXDbXFAuyeQxiV4HapMjivf2n/1CvqJPVkF1DNiuIjElGkvVWrt4U8uXNaQfMo907qAU+oMkt2dbzYqLqtJoYEv8IqcbXbU5SGmngcYWKaxArwBViqXUnQTgKui5zl1VOBXYOIf+aJUV4DLYmjg1LlXgL+o604IyHbSE4C7YmjIw8BpqKIYDdkesApckIB7CrCdUecUrl7ZwdhxpQDcBmhcUYBtWgBF213/94/fGQAMsk0F5rRYAfJPo1IZlU03o/VxJYUGzrZWqwWWs/s+hFEeYBuUGBeUSOGla4Cg2QHey0Bs89A1+hTt4lvEzwYFJWgOwtCMH/FJCZqDJDLnA9eQcv81UntwIk/7AM4BNC6Bb274U/yEFD0ChtaHcQdLhbzoU6ON1brWCgHWByoVbkWf5kyExjwi76O66BmmMfOmMY/IJ6j0VOtuz0rTDRzH9daDB9tuUaFirek4rpXlH0FsKzJsTySpUZ5P3pVmAQNWRT8uFeTQIHlGCBZqDLKlQhGSCtSgCQMLUuEsUNCEgQeiAvgZFDQR4JSa/HGpYFCDpg2MxXK18DagSrNOBr5GpUJOStF40PQ54jydxoypwLhUgHL/A33EuFS4BCrNDh3YlgrnFVUqlIFK89l+RKEbLhWggrDHn5wDwGpZ0cWkAhA0zYoP4G+IVIB1DQIMLGlUKsC6BgdO4luBolSoAkFTAwzUhIhUqEpB05YfCHAaLDZhqQBtBumAofIYlArSiPMjtgHAGWR7t1EZ7bAaNw1ud6KPOY3PW5bdtGh1hW6n+75OCZpcK5AliLNvNugm6IImL7FWyMBiN6GtC5pWUTjrq+oeQmdNPPfbZSy98O66uwlVaDNI2OCkSwX3HnrRxAtCRyrMBAI29cCWSqfLsUsZt4Syje8KAWsa7ioowB10DGm4s4JIhbzc/2iiwBlYpCNSgTPsx4up3cJ3ifQVqlRw4lnt0WvqnG0FmchoVyFnOqG9je6zCxshc1Sp4OyF2TkKrTNHWzcy31CpYDhZrqo0VUC2KXzDpULXzsttTcNI2Jo+gaIjJBXshF81TW0oHm3oreBSoalUuGal68W14RbkNKhgAKnAH/003ZlWQwqZFpquAv+YF0+uDTfpxZpF01XIE+KaU60As6fpKmTBBh4SKZQNZE1XIWeKxZd2QSuzN9jsALoKw6yn5Zqr8SYU37quQts7rjGhbRondhWcRVn8fiEZ0hISnKzrKjjApYpk51gTa5bYVXCAe3rgDaQrrekqlOEBi8DCIYs4ratgx597PXAaPbSBdxU4cLGiBxaasXO0rkINHrAIfIQfB0G7CjV+6EEPLB0KOaF1FcCpE4EXtAdN3F0FoyE03Sx1IK+PFkw2sH2DVbIFjzeU4zE0KVLWJn3LloIduimX6h5vKEdNaNXsbcevJ4i+uGp6vLAQ8ACS4fXCUejH84A4Ec6BQinbBaAypaAI6fSqdurgHqffAWPHWONjAmcmcYAV4drYR25RroUx5DcTOSXscc57bRIeHpMYmYmcHSccpT8Od9EFvgAxDPDeFyHWwqZa4LsVYAoF5y85CUcEcwb1dsxx2IwIuLIpdzaCuJnoYN/XhFL+LpCRLzb5utZEuuoWEJeIHACXhBzsgt7Uay9uLAa9B7n+qxb3YGcqqOluFaa2xroRur4NQ6cOxr0fG9kDoFPh3I1NbArXQlOLb9+FdVV4NfHH9mE0mopGDw/eJlYpP/kPFTPisdwfrLcAAAAASUVORK5CYII="
            app_switcher_item.innerHTML = `
                <img ${getDataVersionByNode(app_switcher_right)}="" src="${course_evalution_site_icon_base64}" class="app-switcher-logo-normal" />
                <img ${getDataVersionByNode(app_switcher_right)}="" src="${course_evalution_site_icon_base64}" class="app-switcher-logo-hover" /> 
                <span ${getDataVersionByNode(app_switcher_right)}="">课程测评</span>
                `
            app_switcher.insertBefore(app_switcher_item, app_switcher_right)
        }

        if (Config.addBBSSiteButton.value) {
            let app_switcher_item = document.createElement("a")
            let app_switcher_right = document.querySelector("#eagleMapContainer > div.title-bar > div.app-switcher > span.app-switcher-desc.app-switcher-right") // 参考位置节点
            app_switcher_item.setAttribute(`${getDataVersionByNode(app_switcher_right)}`, "")
            app_switcher_item.setAttribute("class", "app-switcher-item ")
            app_switcher_item.setAttribute("href", "https://bbs.pku.edu.cn/v2/home.php") //未名bbs网站


            let bbs_site_icon_src = "https://bbs.pku.edu.cn/v2/images/logo.jpg"
            app_switcher_item.innerHTML = `
                <img ${getDataVersionByNode(app_switcher_right)}="" src="${bbs_site_icon_src}" class="app-switcher-logo-normal" />
                <img ${getDataVersionByNode(app_switcher_right)}="" src="${bbs_site_icon_src}" class="app-switcher-logo-hover" />
                <span ${getDataVersionByNode(app_switcher_right)}="">未名BBS</span>
                `
            app_switcher.insertBefore(app_switcher_item, app_switcher_right)
        }
    })
}

//================================================================================================================
// 添加课程评估网站按钮 end
// ===============================================================================================================


//================================================================================================================
// 搜索建议功能（历史记录+收藏） begin
// ===============================================================================================================

function showSuggestionBlock() {
    var record_history = Config.recordHistory.value
    var show_history_suggestion = Config.showHistorySuggestions.value && record_history // 显示历史记录必须先打开保存历史记录功能
    var show_alias_suggestion = Config.showAliasSuggestions.value

    if (!record_history) clearAllHistory();

    if (!record_history && !show_history_suggestion && !show_alias_suggestion) { // 如果三个功能都没开启，那就直接返回
        return
    }

    if (show_history_suggestion && (!localStorage.getItem("search_history"))) { // 如果没有历史记录，则创建一个空的历史记录
        localStorage.setItem("search_history", "")
    }

    addSuggestionBlockCSS()

    var search_box; // 搜索框

    waitForKeyElements("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input",
        (search_boxs) => {
            search_box = search_boxs[0];
            let search_box_cache = ""

            //<div id="selectedId" /> 用来显示历史记录栏
            var selectedId = document.createElement("div")
            selectedId.setAttribute("id", "selectedId")

            search_box.oninput = function refreshItem() {
                if (!document.querySelector("#selectedId"))
                    search_box.parentNode.parentNode.appendChild(selectedId) // 添加历史记录栏

                //删除ul
                var drop = document.getElementById("drop");
                if (drop) selectedId.removeChild(drop);
                //把ul添加回来
                var originalUl = document.createElement("ul");
                originalUl.id = "drop";
                selectedId.appendChild(originalUl);

                showList(search_box, show_alias_suggestion, show_history_suggestion);
            }

            // 添加获取焦点事件
            search_box.onfocus = function () {
                // 初始下拉列表
                if (!document.querySelector("#selectedId"))
                    search_box.parentNode.parentNode.appendChild(selectedId) // 添加历史记录栏

                var originalUl = document.createElement("ul");
                originalUl.id = "drop";
                selectedId.appendChild(originalUl);
                showList(search_box, show_alias_suggestion, show_history_suggestion);
            }

            //添加失去焦点事件
            search_box.onblur = function () {
                //	console.log("soutsout")
                var drop = document.getElementById("drop");
                if (drop) {
                    selectedId.removeChild(drop);
                    search_box.parentNode.parentNode.removeChild(selectedId)
                }
            }

            // 添加键盘按键事件，按下按键时，下拉列表的选中框会移动，输入框的文本会填充
            search_box.onkeydown = function (event) {
                var drop = document.getElementById("drop");
                if (drop) {
                    var lis = drop.getElementsByTagName("li");
                    var len = lis.length;
                    var index = -1;

                    // 查找当前上下键选中框
                    for (var i = 0; i < len; i++) {
                        if (lis[i].style.backgroundColor == "darkgrey") {
                            index = i;
                            break;
                        }
                    }

                    if (event.keyCode === 38) { // 上箭头
                        if (index == -1) { // 当前没有选中框
                            search_box_cache = search_box.value // 暂存当前值
                            search_box.value = lis[len - 1].querySelector("span").innerText;
                            lis[len - 1].style.backgroundColor = "darkgrey";
                        } else if (index == 0) {// 当前选中框为第一个
                            search_box.value = search_box_cache
                            lis[index].style.backgroundColor = "";
                        } else {
                            search_box.value = lis[index - 1].querySelector("span").innerText;
                            lis[index - 1].style.backgroundColor = "darkgrey";
                            lis[index].style.backgroundColor = ""
                        }
                    } else if (event.keyCode === 40) { // 下箭头
                        if (index == -1) { // 当前没有选中框
                            search_box_cache = search_box.value // 暂存当前值
                            search_box.value = lis[index + 1].querySelector("span").innerText;
                            lis[index + 1].style.backgroundColor = "darkgrey";
                        } else if (index == len - 1) {
                            search_box.value = search_box_cache
                            lis[index].style.backgroundColor = "";
                        } else {
                            search_box.value = lis[index + 1].querySelector("span").innerText;
                            lis[index + 1].style.backgroundColor = "darkgrey";
                            lis[index].style.backgroundColor = "";
                        }
                    } else if (event.keyCode === 13) { // 回车，真正选中（此时触发input事件，文本框的值真正被修改）
                        search_box.dispatchEvent(new Event('input'))
                        if (Config.recordHistory.value)
                            addOneHistory(search_box.value);
                    }
                }
            }

            // 给搜索按钮也绑定click事件，点击后存储搜索记录
            waitForKeyElements("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(2) > div > div > button", (buttons) => {
                let button = buttons[0];
                button.addEventListener('mousedown', () => {
                    search_box.dispatchEvent(new Event('input'))
                })
                button.addEventListener('click', () => {
                    if (Config.recordHistory.value)
                        addOneHistory(search_box.value);
                })
            })
        });
}


/**
     * 添加历史记录框的CSS
      */
function addSuggestionBlockCSS() {
    let historyBlockCSS = `
        /* 搜索下拉框*/
        ul#drop {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            padding: 0;
            margin: 0;
            list-style-type: disc;
            margin-block-start: 0em;
            margin-block-end: 0em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
        }
        ul#drop li {
            display: flex;
            min-width: 0;
            max-height: none;
            padding: 0;
            flex-direction: column;
            border-radius: 4px;
        }
        
        ul#drop li:hover {
            background-color: darkgrey;
            border-radius: 4px;
        }
        
        ul#drop li div.li_block{
            padding-left:10px;
            padding-right:10px;
            display: inline-block;
            float: left
        }
        
        ul#drop li div.li_content{
            font-size:15px;
            display: block;
        }
        
        ul#drop li span{
            float: left
        }

        ul#drop li span.alias{
        }

        ul#drop li span.history.light_mode{
            color: #52188c;     /* 亮色主题下历史记录文字用紫色显示 */
        }

        ul#drop li span.history.dark_mode{
            color: #00CCFF;     /* 暗色主题下历史记录文字用天蓝色显示 */
        }
        
        ul#drop li div.delete_item{
            display: block;
            float: right;
        }
        
        ul#drop li div.delete_button{
            color: #70757a;
            font-size: 15px;
            cursor: pointer;
            align-self: center;
            opacity: 0              /*光标没有悬浮在“删除”按钮上时，透明化（相当于不显示）  */
        }

        ul#drop li div.delete_button:hover{
            color: #1558d6;
            text-decoration: underline;
            text-decoration-line: underline;
            text-decoration-thickness: initial;
            text-decoration-style: initial;
            text-decoration-color: initial;
        }

        ul#drop li:hover div.delete_button{
            opacity: 1;
        }

        ul#drop li div.alias{ /* 别名显示框 */
            display: inline-block;
            float: right;
        }

        ul#drop li div.alias span{
            color: #D3D3D3;
            font-size: 12px;
            width: 100%;
            width: -moz-available;          /* WebKit-based browsers will ignore this. */
            width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
            width: fill-available;
            text-align: right
        }

        
        div#selectedId {
            position: relative;
            text-align: left;
            -webkit-user-select: none;
            width: 100%;
            padding-left: 144px;
        }

        @media screen and (max-width: 900px){ /* 页面缩小时自适应 */
            div#selectedId{
                padding-left: 80px;
            }
        }
    `
    GM_addStyle(historyBlockCSS)
}

/** 
     * 显示li标签（显示搜索时的下拉列表）
     * @param search_box {Node} 搜索文本框的dom节点
     * @param show_alias_suggestion {bool} 是否显示别名/收藏建议
     * @param show_history_suggestion {bool} 是否显示历史记录建议
      */
function showList(search_box, show_alias_suggestion, show_history_suggestion) {
    if (show_alias_suggestion && search_box.value) {
        // 解析别名字典
        var alias_json_str = GM_getValue("Alias_json", "{}");
        if (alias_json_str) {
            try {
                var alias_dic = JSON.parse(alias_json_str)
                var alias = "";
            } catch (error) {
                console.log("解析洞号别名错误！" + error)
            }
        }

        // alias_arr是别名数组
        var alias_arr = Object.keys(alias_dic)
        var alias_res = searchByIndexOf(search_box.value, alias_arr);
        for (var i = 0; i < alias_res.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = `
            <div class="li_block">
                <div class="li_content">
                    <span class="suggestion alias">${alias_dic[alias_res[i]]}</span>
                </div>
                <div class="alias">
                    <span class="alias_suggestion_content">${alias_res[i]}</span>
                </div>
            </div>
        `
            li.addEventListener("click", (event) => {
                event.stopPropagation();
                if (event.target.nodeName === "SPAN")   // 如果直接点击的是文本span标签，则
                    search_box.value = event.target.innerText;
                else
                    search_box.value = event.target.querySelector("span.suggestion").innerText;

                search_box.dispatchEvent(new Event('input'))
                $("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(2) > div > div > button").click()
            })
            // 添加mousedown事件，防止blur事件先于click发生
            li.addEventListener("mousedown", (event) => {
                event.preventDefault()
            })

            document.getElementById("drop").appendChild(li);
        }
    }

    if (show_history_suggestion) {
        // history_arr是历史记录
        var history_arr = getALLHistory();
        var history_res = searchByIndexOf(search_box.value, history_arr);
        var dark_mode = document.querySelector("body").getAttribute("style").indexOf("--theme_bgc_color:rgba(31,31,31,0.8); --theme_font_color:#ededed;") > -1;
        for (var i = 0; i < history_res.length && i < Config.maxShownHistorySize.value; i++) {
            let li = document.createElement("li");
            li.innerHTML = `
            <div class="li_block">
                <div class="li_content">
                    <span class="suggestion history ${dark_mode ? 'dark_mode' : 'light_mode'}">${history_res[i]}</span>
                </div>
                <div class="delete_item">
                    <div class="delete_button">删除</div>
                </div>
            </div>
        `
            li.addEventListener("click", (event) => {
                event.stopPropagation();
                if (event.target.nodeName === "SPAN")   // 如果直接点击的是文本span标签，则直接输入文本
                    search_box.value = event.target.innerText;
                else                                    // 如果是文本span标签的父标签，则查找span标签
                    search_box.value = event.target.querySelector("span.suggestion").innerText;

                search_box.dispatchEvent(new Event('input'))
                $("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(2) > div > div > button").click()
            })
            // 添加mousedown事件，防止blur事件先于click发生
            li.addEventListener("mousedown", (event) => {
                event.preventDefault()
            })

            var delete_button = li.querySelector(".delete_button");
            delete_button.addEventListener("click", (event) => {    // 点击删除按钮
                event.stopPropagation()
                let parent_li = $(event.target).parents("li")
                deleteOneHistory(parent_li.find("span").text())
                parent_li.remove()
            })

            document.getElementById("drop").appendChild(li);
        }
    }
}


/**
 *   模糊查询:利用字符串的indexOf方法 
 */
function searchByIndexOf(keyWord, list) {
    if (!(list instanceof Array)) {
        return;
    }
    if (keyWord == "") {
        return list;
    } else {
        var len = list.length;
        var arr = [];
        for (var i = 0; i < len; i++) {
            //如果字符串中不包含目标字符会返回-1
            if (list[i].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0) { // 查找字符串方法不区分大小写
                arr.push(list[i]);
            }
        }
        return arr;
    }

}


/**  
* 
* 获取搜索关键词设置历史记录
*  过滤一个结果的空记录添加，过滤空搜索  默认保存200条记录  可修改
*    （这种记录方式有个小bug，就是搜索记录里不能有|，先用着吧）
*/
function addOneHistory(keyword) {
    keyword = keyword.trim(); // 过滤字符串左右的空格（不过滤字符串中间的空格）
    if (!keyword) {
        return false; // 字符串为空时禁止
    }
    let historyIndexSearchItems = localStorage.getItem("search_history"); // 获取历史记录的字符串
    if (!historyIndexSearchItems) {
        localStorage.setItem("search_history", keyword);
    } else {
        const onlyItem = historyIndexSearchItems.split('|').filter(e => e != keyword);
        if (onlyItem.length > 0) {
            historyIndexSearchItems = keyword + '|' + onlyItem.slice(0, Config.maxHistorySize.value).join('|');
        }
        localStorage.setItem("search_history", historyIndexSearchItems)
    }
}

/**
* 删除一条历史记录
*/
function deleteOneHistory(keyword) {
    keyword = keyword.trim(); // 过滤字符串左右的空格（不过滤字符串中间的空格）
    if (!keyword) {
        return false; // 字符串为空时禁止
    }
    let historyIndexSearchItems = localStorage.getItem("search_history"); // 获取历史记录的字符串
    if (!historyIndexSearchItems) {
        return false;
    } else {
        const onlyItem = historyIndexSearchItems.split('|').filter(e => e);
        if (onlyItem.length > 0) {
            const index = onlyItem.indexOf(keyword);
            if (index > -1) {
                onlyItem.splice(index, 1);
                historyIndexSearchItems = onlyItem.slice(0, Config.maxHistorySize.value).join('|');
                localStorage.setItem("search_history", historyIndexSearchItems);
                return true;
            }
            return false;
        }
        return false;
    }



}


/**
 * 获取所有历史记录
 * @return: String Array
 */
function getALLHistory() {
    let historyIndexSearchItems = localStorage.getItem("search_history");
    if (historyIndexSearchItems)
        return historyIndexSearchItems.split('|').filter(e => e)
    else
        return []
}

/**
 * 清除所有历史记录
 */
function clearAllHistory() {
    localStorage.removeItem('search_history');
}

//================================================================================================================
// 搜索历史记录功能 end
// ===============================================================================================================



//================================================================================================================
// 显示最新回复时间 start
// ===============================================================================================================

/**
 * 该函数将一个时间戳转换为时间格式
 * dateTimeStamp是时间戳，10位
 * @param {string} dateTimeStamp 
 * @returns 标准时间格式字符串
 */
function timeFormat(dateTimeStamp) {
    let datetime = new Date(dateTimeStamp * 1000);

    let Nyear = datetime.getFullYear();
    let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate + " " + Nhour + ":" + Nminute
    return result;
}


/**
 * dateTimeStamp是评论的发送时间戳，10位
 * @author https://blog.csdn.net/Aurora_____/article/details/110390353
 * @param dateTimeStamp
 * @returns {string}
 */
function timeAgo(dateTimeStamp) {
    let result = "";
    let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();   //获取当前时间毫秒


    let diffValue = now - dateTimeStamp * 1000;//时间差

    if (diffValue < 0) {
        return result;
    }
    let minC = Math.floor(diffValue / minute);  //计算时间差的分，时，天，周，月
    let hourC = Math.floor(diffValue / hour);
    let dayC = Math.floor(diffValue / day);
    let weekC = Math.floor(diffValue / week);
    let monthC = Math.floor(diffValue / month);
    if (monthC >= 1 && monthC <= 11) {
        result = " " + parseInt(monthC) + "月前"
    } else if (weekC >= 1 && weekC <= 3) {
        result = " " + parseInt(weekC) + "周前"
    } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + "天前"
    } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + "小时前"
    } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚"
    } else {
        result = timeFormat(dateTimeStamp)
    }
    return result;
}

// 最新回复时间记录字典
var last_reply_time_dic = {}

/** 修改xhr的open方法，监听返回值，截取最近回复时间 */
function listenLastestReplyTime() {
    if (!Config.showLastestReplyTime.value) return

    const url_regexp = RegExp('/api/pku_comment_v3/(\\d+)\\?limit=10');

    // 重写open方法，截取最近回复时间
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const matched = url.match(url_regexp)
        if (matched) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.response);
                    const box_id = matched[1]
                    const total_reply = res.data.total  // 总回复数
                    var last_page = res.data.last_page
                    var lastest_reply_time
                    if (last_page == 1) { // 如果总评论少于10条，可以直接提取出最近回复
                        lastest_reply_time = res.data.data[res.data.data.length - 1]['timestamp']
                        last_reply_time_dic[box_id] = lastest_reply_time
                        // console.log(box_id + "最新回复时间：" + lastest_reply_time)
                    }
                    else { // 如果总评论多于10条，需要再次发请求

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://treehole.pku.edu.cn/api/pku_comment_v3/" + box_id + "?limit=50000",
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9",
                                "authorization": "Bearer " + _getCookieObj()["pku_token"],
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "uuid": localStorage.getItem("pku-uuid"),
                            },
                            "referrer": "https://treehole.pku.edu.cn/web/",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": null,
                            "mode": "cors",
                            "credentials": "include",
                            onload: function (again_res) {
                                if (again_res.status == 200) {
                                    try {
                                        const again_res_json = JSON.parse(again_res.responseText);
                                        lastest_reply_time = again_res_json.data.data[again_res_json.data.data.length - 1]['timestamp']
                                        last_reply_time_dic[box_id] = lastest_reply_time
                                        // console.log(box_id + "最新回复时间：" + lastest_reply_time)
                                    } catch (error) {
                                        console.log(error)
                                        console.log("无法获取最新回复时间！" + box_id);
                                    }
                                } else {
                                    console.log("请求失败：状态码" + again_res.status);
                                }
                            }
                        })
                    }
                    this.response = JSON.stringify(res);
                }
            });
        }

        originOpen.apply(this, arguments);
    };
}
//================================================================================================================
// 显示最新回复时间 end
// ===============================================================================================================



//================================================================================================================
// 点击同意服务协议 start
// ===============================================================================================================

/** 点击登录页面的“同意北大树洞服务协议”，回车登录 */
function clickToAgreeToTheServiceAgreement() {
    if (Config.clickAgreeServiceAgreement.value) {
        waitForKeyElements('div.main-login > p.bottom-footer > input[type=checkbox]', (check_boxs) => {
            let check_box = check_boxs[0]
            if (!check_box.checked)
                check_box.click()
            // setTimeout(()=>{document.querySelector("#app button").click()}, 1000) 
            document.querySelector("#app input[type=text]").focus()
            document.querySelector("#app input[type=text]").addEventListener("keydown", (event) => {
                if (event.keyCode === 13) {
                    // console.log("监听到回车键，点击登录！")
                    document.querySelector("#app button").click()
                }
            }, true)
        }, true)
    }
}
//================================================================================================================
// 点击同意服务协议 end
// ===============================================================================================================



//================================================================================================================
// 善用搜索 start
// ===============================================================================================================

// 上一次获取最近树洞列表时间
var recent_data_timestamp = localStorage.getItem("recent_data_timestamp")
if (recent_data_timestamp == null) {
    recent_data_timestamp = 0
} else {
    try {
        recent_data_timestamp = parseInt(recent_data_timestamp)
    } catch (error) {
        console.log("上一次获取最近树洞列表时间解析失败！")
        console.error(error)
        recent_data_timestamp = 0
    }
}

// 最近树洞数据列表
var recent_data_list = localStorage.getItem("recent_data_list")
if (recent_data_list == null) {
    recent_data_list = []
} else {
    try {
        recent_data_list = JSON.parse(recent_data_list)
    } catch (error) {
        console.log("历史树洞数据列表解析失败！")
        console.error(error)
        recent_data_list = []
    }
}

// 最近N条树洞请求状态
var is_fetching_recent_data = false

/** 
 * @param {number} page
 * @returns {Promise} data_list
 * @description 模拟获取一次最近树洞数据的请求，等待fetch的结果再返回 
 */
async function getOnceFetch(page, api = "pku_hole") {
    let _url = `https://treehole.pku.edu.cn/api/${api}?page=${page}&limit=100`
    try {
        const response = await fetch(_url, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": "Bearer " + _getCookieObj()["pku_token"],
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "uuid": localStorage.getItem("pku-uuid"),
            },
            "referrer": "https://treehole.pku.edu.cn/web/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching page=${page}:`, error);
        throw error;
    }
}

/**
* 用于获取最近的所有树洞数据
* @param {number} start 起始页（含）
* @param {number} end 结束页（含）
* @returns {array} 用户数据列表
*/
async function getSomeFetch(start, end, api = "pku_hole") {
    try {
        var fetch_list = []
        var timeout = 0
        // 每隔一段时间进行一次请求，避免被封，也减小服务器压力
        for (let page = start; page <= end; ++page) {
            timeout = timeout + getTimeout(page);
            fetch_list.push(new Promise((resolve, reject) => {
                setTimeout(() => {
                    getOnceFetch(page, api).then((data) => resolve(data)).catch((err) => reject(err))
                }, timeout);
            }))
        }
        const data_list = await Promise.all(fetch_list)
        return data_list
    } catch (error) {
        console.error(error);
        throw error;
    }

    /**
     * 
     * @param {number} page 
     * @returns 搜索第几页时的延迟时间，每隔第5页延迟500ms，每隔第20页延迟2000ms，每隔第100页延迟5000ms
     */
    function getTimeout(page) {
        if (page % 5) {
            return 250 + Math.random() * (100);
        } else if (page % 100 === 0) {
            return 5000 + Math.random() * (100);
        }
        else if (page % 20 === 0) {
            return 2000 + Math.random() * (100);
        }
        else {
            return 500 + Math.random() * (100);
        }
    }
}


/**
 * 
 * @param {number} num 
 * @returns {number} 
 * 根据请求数据的数量设置有效期，对于数据量越大的请求，有效期时间越长
 */
function getValidityPeriod(num) {
    if (num <= 10000) {
        return 10 * 60 * 1000
    } else if (num <= 50000) {
        return 30 * 60 * 1000
    } else if (num <= 100000) {
        return 60 * 60 * 1000
    }
}


/** 
 * @param {number} num: length of search
 */
async function getRecentDataList(num = 5000) {
    var validity_period = getValidityPeriod(num)    // 请求数据的有效期
    //  如果请求时间不超过有效期，且没有修改请求条数或修改的请求条数小于之前的条数，就直接读取本地存储的数据
    if (new Date().getTime() - recent_data_timestamp <= validity_period && recent_data_list.length >= num / 100) {
        if (recent_data_list.length > num / 100) {
            recent_data_list = recent_data_list.slice(0, num / 100)
        }
        if (Config.beGoodAtSearchNotification.value) { // 显式通知
            GM_notification({
                text: `读取记录：检测到距离上次请求时间不超过${validity_period / 60000}分钟，直接从请求记录中读取最近${num}条树洞，已开启善用搜索功能！`,
                title: "【善用搜索】：已开启",
                timeout: 10000
            })
        }

        // 静默通知，更换搜索栏的提示
        var search_box;
        const search_box_Interval = setInterval(() => {
            if (document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input")) {
                clearInterval(search_box_Interval)
                search_box = document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input");
                search_box.placeholder = `【善用搜索】：已开启，搜索最近${num}条树洞`;
            }
        }, 500)
    }
    // 如果是第一次使用善用搜索功能，或者要搜索的条数超过请求记录条数，或者请求时间超过有效期，就重新请求最近的N条树洞
    else {
        if (Config.beGoodAtSearchNotification.value) { // 显式通知
            GM_notification({
                text: `重新请求：距上次请求时间超过${validity_period / 60000}分钟，或者搜索条数增加，故重新请求最近${num}条树洞，预计${Math.ceil(num / 10000 * 0.8)}分钟，请求完成会提醒，并自动开启善用搜索功能。`,
                title: "【善用搜索】：稍后开启",
                timeout: 10000
            })
        }
        // 静默通知，更换搜索栏的提示
        var search_box;
        const search_box_Interval = setInterval(() => {
            if (document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input")) {
                clearInterval(search_box_Interval)
                search_box = document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input");
                search_box.placeholder = `【善用搜索】：稍后开启，预计时间${Math.ceil(num / 10000 * 0.8)}分钟，目前使用树洞原本API`;
            }
        }, 500)
        is_fetching_recent_data = true; // 设置状态为正在请求

        recent_data_list = []
        let start = 1, end = num / 100
        recent_data_list = await getSomeFetch(start, end, "pku_hole")

        is_fetching_recent_data = false; // 设置状态为请求完成

        if (Config.beGoodAtSearchNotification.value) { // 显式通知
            GM_notification({
                text: `请求完成：请求最近${num}条树洞已完成，已开启善用搜索功能！`,
                title: "【善用搜索】：已开启",
                timeout: 10000
            })
        }
        // 静默通知，更换搜索栏的提示
        search_box.placeholder = `【善用搜索】：已开启，搜索最近${num}条树洞`;

        // 存储请求时间戳和请求结果
        localStorage.setItem("recent_data_list", JSON.stringify(recent_data_list))
        localStorage.setItem("recent_data_timestamp", new Date().getTime())
    }
}

function beGoodAtSearch() {
    if (!Config.beGoodAtSearch.value) return
    if (!Config.beGoodAtSearchLength.value) return

    if (Config.beGoodAtSearchLength.value <= 100000) {
        getRecentDataList(Config.beGoodAtSearchLength.value)   // 预先获取最近的N条树洞
    } else {
        getRecentDataList(5000)
    }


    const url_regexp = RegExp('/api/pku_hole\\?page=\\d+?&limit=25&keyword=');

    // 重写open方法，拦截搜索请求，自定义搜索方法
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const matched = url.match(url_regexp)
        if (matched && !is_searching_attention) { // 如果是否最新树洞页，且匹配搜索url 才hook
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
            Object.defineProperty(xhr, 'responseText', {
                get: () => {
                    try {
                        let my_res = {
                            "code": 20000,
                            "data": {
                                "current_page": 1,
                                "data": [],
                                "first_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "from": 1,
                                "last_page": 1,
                                "last_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "next_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "path": "http://treehole.pku.edu.cn/api/pku_hole",
                                "per_page": "100",
                                "prev_page_url": null,
                                "to": 0,
                                "total": 0
                            },
                            "message": "success",
                            "success": true,
                            "timestamp": new Date().getTime()
                        }

                        // console.log(recent_data_list)
                        let keywords = document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").value.trim().split(/\s+/)
                        keywords = keywords.filter(item => item && item.trim()) // 去除空格
                        for (let i = 0; i < recent_data_list.length; ++i) {
                            my_res.data.data.push(...recent_data_list[i].data.data.filter(item => {
                                let text = item.text;
                                if (!text) return false;
                                if (!keywords.length) return false;
                                let flag = true;
                                for (let k = 0; k < keywords.length; ++k) {
                                    // 带-的删除逻辑
                                    if (keywords[k].startsWith('-') && keywords[k].length > 1) {
                                        if (text.toLowerCase().indexOf(keywords[k].toLowerCase().slice(1)) != -1) {
                                            flag = false;
                                            break;
                                        }
                                    }
                                    // 不带-的搜索逻辑
                                    else if (text.toLowerCase().indexOf(keywords[k].toLowerCase()) == -1) {
                                        flag = false;
                                        break;
                                    }
                                }
                                return flag;
                            }));
                        }

                        my_res.data.to = my_res.data.data.length;
                        my_res.data.total = my_res.data.data.length;
                        console.log(my_res)
                        if (my_res.data.total === 0)
                            throw new Error('没有在最近的树洞中找到相关内容，所以返回原始的API搜索结果');
                        return my_res;
                    } catch (e) {
                        // 如果出错，或者没有找到相关内容，或者还在请求阶段，就返回原来的搜索结果
                        console.log(e)
                        var result = getter.call(xhr);
                        return result
                    }
                }
            });
        }

        originOpen.apply(this, arguments);
    };

}

//================================================================================================================
// 善用搜索 end
// ===============================================================================================================


//================================================================================================================
// 在关注列表中搜索 start
// ===============================================================================================================

// 存储关注树洞的数据
var attention_list = []

// 当前页面是否为关注列表页面
var is_searching_attention = false

async function preGetAttentionList(max_num = 10000) {
    if (!Config.searchInAttentionList.value) return

    // 提前加载关注树洞
    var first_page_data;
    first_page_data = await getOnceFetch(1, "follow")

    if (first_page_data && first_page_data.code == 20000 && first_page_data.message == "success") {
        attention_list.push(first_page_data)
        try {
            var last_page = first_page_data.data.last_page
            if (last_page > 1) {
                const left_pages = await getSomeFetch(2, last_page, "follow")
                attention_list.push(...left_pages.filter(item => item.code == 20000 && item.message == "success"))
            }
            return true
        } catch (error) {
            console.error(error)
            console.log("请求关注列表失败")
            return false
        }
    }
    return false
}

/**
 * 在关注列表中搜索
 * @param {HTMLElement} attention_list_button 
 * @returns 
 */
function searchInAttentionList(attention_list_button) {
    if (!Config.searchInAttentionList.value) return

    // 给关注按钮绑定点击事件，点击后请求关注列表所有数据，并hook搜索框
    attention_list_button.addEventListener("click", function () {
        document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").setAttribute("placeholder", "获取关注列表所有数据中...")
        if (preGetAttentionList()) { // 获取所有关注树洞列表
            is_searching_attention = true;
            document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").setAttribute("placeholder", "在关注列表中搜索")
        } else {
            document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").setAttribute("placeholder", "获取关注列表所有数据失败，无法在关注列表中搜索")
        }
    })

    // 给最新按钮绑定点击事件，点击后清空请求到的关注列表数据
    var recent_list_button = document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > a:nth-child(1)")
    recent_list_button.addEventListener("click", function () {
        is_searching_attention = false;
        attention_list = []; // 清空关注列表

        var text_placeholder = ""
        if (!Config.beGoodAtSearch.value) { // 如果不启用善用搜索，就恢复默认的搜索提示
            text_placeholder = "搜索内容 或 #PID"
        } else {
            if (is_fetching_recent_data) {
                text_placeholder = `【善用搜索】：稍后开启，预计时间${Math.ceil(Config.beGoodAtSearchLength.value / 10000 * 0.8)}分钟，目前使用树洞原本API`
            } else {
                text_placeholder = `【善用搜索】：已开启，搜索最近${Config.beGoodAtSearchLength.value}条树洞`
            }
        }
        document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").setAttribute("placeholder", text_placeholder)
    })

    // 根据是否在关注页面，决定搜索框的逻辑
    const url_regexp = RegExp('/api/pku_hole\\?page=\\d+?&limit=25&keyword=');
    // 重写open方法，拦截搜索请求，自定义搜索方法
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const matched = url.match(url_regexp)
        if (matched && is_searching_attention) { // 判断是搜索请求，并且是在关注列表中搜索
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
            Object.defineProperty(xhr, 'responseText', {
                get: () => {
                    try {
                        let my_res = {
                            "code": 20000,
                            "data": {
                                "current_page": 1,
                                "data": [],
                                "first_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "from": 1,
                                "last_page": 1,
                                "last_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "next_page_url": "http://treehole.pku.edu.cn/api/pku_hole?page=1",
                                "path": "http://treehole.pku.edu.cn/api/pku_hole",
                                "per_page": "100",
                                "prev_page_url": null,
                                "to": 0,
                                "total": 0
                            },
                            "message": "success",
                            "success": true,
                            "timestamp": new Date().getTime()
                        }

                        // console.log(attention_list)
                        let keywords = document.querySelector("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > input").value.trim().split(/\s+/)
                        keywords = keywords.filter(item => item && item.trim()) // 去除空格
                        for (let i = 0; i < attention_list.length; ++i) {
                            my_res.data.data.push(...attention_list[i].data.data.filter(item => {
                                let text = item.text;
                                if (!text) return false;
                                if (!keywords.length) return false;
                                let flag = true;
                                for (let k = 0; k < keywords.length; ++k) {
                                    // 带-的删除逻辑
                                    if (keywords[k].startsWith('-') && keywords[k].length > 1) {
                                        if (text.toLowerCase().indexOf(keywords[k].toLowerCase().slice(1)) != -1) {
                                            flag = false;
                                            break;
                                        }
                                    }
                                    // 不带-的搜索逻辑
                                    else if (text.toLowerCase().indexOf(keywords[k].toLowerCase()) == -1) {
                                        flag = false;
                                        break;
                                    }
                                }
                                return flag;
                            }));
                        }

                        my_res.data.to = my_res.data.data.length;
                        my_res.data.total = my_res.data.data.length;
                        console.log(my_res)
                        return my_res;
                    } catch (e) {
                        // 如果出错，或者没有找到相关内容，或者还在请求阶段，就返回原来的搜索结果
                        console.log(e)
                        var result = getter.call(xhr);
                        return result
                    }
                }
            });
        }

        originOpen.apply(this, arguments);
    };

}

//================================================================================================================
// 在关注列表中搜索 end
// ===============================================================================================================


//================================================================================================================
// 滚动穿透：解除点击详情页时不能滚动外部树洞列表的问题 begin
// ===============================================================================================================
// !!!!!!!!!!!!!!!!!!开发中，尚未实现

function cancelScrollLimit(params) {
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && mutation.addedNodes && mutation.addedNodes[0].nodeName === 'DIV')
                    var sidebar_shadow = document.querySelector(".sidebar-shadow").remove()
                break
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });
}

//================================================================================================================
// 滚动穿透：解除点击详情页时不能滚动外部树洞列表的问题 end
// ===============================================================================================================


(function () {
    // 登录页面优化
    if (location.pathname.indexOf("/web/login") > -1)
        clickToAgreeToTheServiceAgreement()

    // 登录之后页面优化
    if (location.pathname.endsWith("/web/")) {
        addCopyFullTextButtonIcon() // 添加复制全文图标
        cancelMaxHeight()           // 取消全文最大长度限制
        configureWallPaperHub()     // 随机壁纸功能
        recordAlias()               // 别名记录
        addSiteButton()             // 添加课程测评按钮
        showSuggestionBlock()       // 显示搜索建议（包括历史记录和收藏）
        listenLastestReplyTime()     // 监听最后一次回复的时间chunk
        beGoodAtSearch()            // 善用搜索

        waitForKeyElements("#eagleMapContainer > div.title-bar > div.control-bar > div > div:nth-child(1) > div > a:nth-child(2)", (attention_list_buttons) => {
            searchInAttentionList(attention_list_buttons[0])
        }, true)     // 在关注列表中搜索

        GM_addStyle(`.box-footer{opacity:0.5;}`)

        // 这个是监听网页插入事件，用来判断后续网页动态插入的元素（动态插入树洞）
        waitForKeyElements("div.flow-chunk", (chunk) => {
            var flow_chunk = chunk[0];

            // 这个观察器是用来观察主页面的box流
            let chunk_observer = new MutationObserver((mutationsList, observer) => {
                // console.log(`debug`)
                for (const mutation of mutationsList) {
                    for (const item of mutation.addedNodes) {
                        blockChunkKeywords(item)
                    }
                    if (mutation.addedNodes) {
                        setTimeout(() => {  // 懒得用查找了，直接延时
                            let flow_item_row_list = document.querySelectorAll("#table_list > div.flow-chunk > div > div")
                            for (let flow_item_row of flow_item_row_list) {
                                // console.log(flow_item_row)
                                let exist_reply_icon = flow_item_row.querySelector("div.box-header > span:nth-child(3)") // 回复数图标
                                let exist_box_footer = flow_item_row.querySelector("div.flow-item > div.box > div.box-footer")  // 最新回复时间文本

                                if (!exist_reply_icon || exist_box_footer) // 已经没有回复，或者已经有最新回复时间，跳过
                                    continue;
                                else {
                                    let box_id = flow_item_row.querySelector("div.flow-item > div.box > div.box-header > code.box-id.--box-id-copy-content").innerText.replace("#", "").trim() // 洞号
                                    let box = flow_item_row.querySelector("div.flow-item > div.box")

                                    // console.log(box)
                                    if (last_reply_time_dic[box_id]) {
                                        let box_footer = document.createElement("div")
                                        box_footer.setAttribute(`${getDataVersionByNode(box.querySelector("div.box-header"))}`, "")
                                        box_footer.classList.add("box-footer")
                                        box_footer.innerText = "最新回复时间：" + timeAgo(last_reply_time_dic[box_id])
                                        box.appendChild(box_footer)
                                    }

                                }
                            }
                        }, 1000)
                    }
                }
            }
            );
            chunk_observer.observe(flow_chunk, { childList: true, subtree: true });
        })

        // 绑定侧边栏观察器
        waitForKeyElements('.left-container', (value) => {
            var left_container = value[0];
            let sidebar_rise_observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.addedNodes.length && mutation.addedNodes[0].nodeName != "#comment" && document.querySelector("div.box.box-tip.sidebar-toolbar")) { // 确实唤起了详情页侧边栏（而不是关闭侧边栏，以及打开账户、发表树洞的侧边栏）
                        addCopyFullTextButton();
                        blockSidebarKeywords();
                        addAddAliaButton()
                        break
                    }
                }

            });
            sidebar_rise_observer.observe(left_container, { childList: true }); // 观察子节点的变动
        })
    }
}())












/** 
 * 这段代码来自于 https://gist.github.com/BrockA/2625891 ，将其复制下来是因为油猴脚本对github的跨域访问不太友好，不然可以直接在最前面require
此外还有一些安全性的考虑
*/
/**--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements(
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                    actionFunction,
                    bWaitOnce,
                    iframeSelector
                );
            },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}