// ==UserScript==
// @name         知乎美化
// @namespace    http://tampermonkey.net/
// @version      2026.1.5.1
// @description  1.【重要更新】增加夜间模式按钮     2.知乎题目栏增加举报、匿名、问题日志、快捷键四个按钮     3.知乎按钮图标在鼠标悬停时变色(题目按钮、回答下方按钮、评论按钮等)     4.回答的发布时间移至顶部     5.图片原图显示     6.文字和卡片链接从知乎跳转链接改为直链     7.隐藏侧边栏     8.GIF图自动播放【默认不开启】     9.问题增加创建时间和最后编辑时间     10.鼠标悬停在回答时显示浅蓝色聚焦框    11.引用角标高亮    12.首页信息流增加不感兴趣按钮  13.【重要更新】增加设置界面    14.显示信息流标签【默认不开启】
// @author       AN drew
// @match        *://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @resource     zhihu-beautify https://update.greasyfork.org/scripts/523346/zhihu-beautify.user.css
// @connect      zhihu.com
// @connect      vzuu.com
// @grant        GM_info
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402808/%E7%9F%A5%E4%B9%8E%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/402808/%E7%9F%A5%E4%B9%8E%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

/*
var hideIndexSidebar; //隐藏首页侧边栏
var hideQuestionSidebar; //隐藏回答侧边栏
var hideSearchSideBar; //隐藏搜索侧边栏
var hideTopicSideBar; //隐藏话题侧边栏
var hideCollectionSideBar; //隐藏收藏侧边栏

//var hideClubSideBar; //隐藏圈子侧边栏(X)
//var hideDraftSideBar; //隐藏草稿侧边栏
//var hideLaterSideBar; //隐藏稍后答侧边栏

var hideRingSideBar; //隐藏圈子侧边栏
var hideProfileSidebar; //隐藏用户主页侧边栏
var hideColumnSideBar; //隐藏专栏文章侧边栏
var hideRecommendedReading; //隐藏专栏推荐阅读
var publishTop; //置顶回答时间
var GIFAutoPlay; //GIF自动播放
var hoverShadow; //悬停时显示浅蓝色边框
var blockingPictureVideo; //隐藏图片/视频
var flowTag; //显示信息流标签
var prefersColorScheme; //跟随系统夜间模式
var hideFeedSource; //隐藏动态来源
*/


class ZhihuConfig {
    constructor() {
        // 定义配置项
        this.configItems  = [
            { name: 'hideIndexSidebar', label: '隐藏首页侧边栏', type: 'select', default: '1'},
            { name: 'hideQuestionSidebar', label: '隐藏回答侧边栏', type: 'select', default: '1'},
            { name: 'hideSearchSideBar', label: '隐藏搜索侧边栏', type: 'select', default: '1'},
            { name: 'hideTopicSideBar', label: '隐藏话题侧边栏', type: 'select', default: '1'},
            { name: 'hideCollectionSideBar', type: 'select', default: '1', label: '隐藏收藏侧边栏'},
            /*
            { name: 'hideClubSideBar', label: '隐藏圈子侧边栏', type: 'select', default: '1'},
            { name: 'hideDraftSideBar', label: '隐藏草稿侧边栏', type: 'select', default: '1'},
            { name: 'hideLaterSideBar', label: '隐藏稍后答侧边栏', type: 'select', default: '1'},
            */
            { name: 'hideRingSideBar', label: '隐藏圈子侧边栏', type: 'select', default: '0'},
            { name: 'hideRecentSideBar', label: '隐藏最近浏览侧边栏', type: 'select', default: '1'},
            { name: 'hideProfileSidebar', label: '隐藏用户主页侧边栏', type: 'select', default: '0'},
            { name: 'hideColumnSideBar', label: '隐藏专栏文章侧边栏', type: 'select', default: '1'},

            { name: 'hideRecommendedReading', label: '隐藏专栏推荐', type: 'checkbox', default: '1'},
            { name: 'publishTop', label: '置顶回答时间', type: 'checkbox', default: '1'},
            { name: 'GIFAutoPlay', label: 'GIF自动播放', type: 'checkbox', default: '0'},
            { name: 'hoverShadow', label: '悬停时显示浅蓝色边框', type: 'checkbox', default: '1'},
            { name: 'blockingPictureVideo', label: '隐藏图片/视频', type: 'checkbox', default: '0'},
            { name: 'flowTag', label: '显示信息流标签', type: 'checkbox', default: '0'},
            { name: 'prefersColorScheme', label: '跟随系统夜间模式', type: 'checkbox', default: '0'},
            { name: 'hideFeedSource', label: '隐藏动态来源', type: 'checkbox', default: '1'}
        ];
        this.currentValues = {};
        this.initConfig();
    }

    // 初始化配置
    initConfig() {
        this.configItems.forEach(item  => {
            const value = GM_getValue(item.name);
            if (value === undefined) {
                GM_setValue(item.name,  item.default);
                this.currentValues[item.name]  = item.default;
            } else {
                this.currentValues[item.name]  = value;
            }
        });
    }

    // 打印当前配置值
    printValue() {
        console.log('当前值\n');
        this.configItems.forEach(item  => {
            console.log(`${item.name}=${this.currentValues[item.name]}`);
        });
        console.log('\n');
    }

    // 打印保存配置值
    printStorageValue() {
        console.log('保存值\n');
        this.configItems.forEach(item  => {
            console.log(`${item.name}=${GM_getValue(item.name)}`);
        });
        console.log('\n');
    }

    // 生成设置界面 HTML
    generateSettingsHTML() {
        let settingHTML = `
<div id="settingLayerMask" style="display: flex;">
    <div id="settingLayer">
        <div id="itemlist">`;
        this.configItems.forEach(item  => {
            if (item.type  === 'select') {
                settingHTML += `
            <section class="switch"><span>${item.label}</span>
                <select name="${item.name}"  id="${item.name}">
                    <option value="0">不隐藏</option>
                    <option value="1" ${this.currentValues[item.name]  === '1' ? 'selected="selected"' : ''}>隐藏，拉宽显示内容</option>
                    <option value="2" ${this.currentValues[item.name]  === '2' ? 'selected="selected"' : ''}>隐藏，居中显示内容</option>
                </select>
            </section>`;
            } else if (item.type  === 'checkbox') {
                settingHTML += `
            <section class="switch"><span>${item.label}</span>
                <div class="checkbox ${this.currentValues[item.name]  === '1' ? 'on' : ''}"><input type="checkbox" name="${item.name}"  id="${item.name}"  value="${this.currentValues[item.name]}"><label  class="switchLabel"></label></div>
            </section>`;
            }
        });
        settingHTML += `
            <section style="visibility:hidden" class="switch"><span>占位</span>
                <select name="占位"  id="占位">
                    <option value="0">不隐藏</option>
                    <option value="1">隐藏，拉宽显示内容</option>
                    <option value="2">隐藏，居中显示内容</option>
                </select>
            </section>
        </div>
        <div id="btnEle">
            <div class="btnEleLayer">
                <span id="settings-save" >保存并刷新</span>
            </div>
        </div><span id="settings-close" ></span></div>
</div>`;
        return settingHTML;
    }

    // 保存设置
    saveSettings() {
        this.configItems.forEach(item  => {
            if (item.type  === 'select') {
                this.currentValues[item.name]  = $(`#${item.name}`).val();
            } else if (item.type  === 'checkbox') {
                this.currentValues[item.name]  = $(`#${item.name}`).val();
            }
            GM_setValue(item.name,  this.currentValues[item.name]);
        });
        $('#settingLayerMask').hide();
        window.location.reload();
    }

    // 清空所有设置值
    clearValue() {
        this.configItems.forEach(item  => {
            GM_deleteValue(item.name);
        });
    }
}


const Config = new ZhihuConfig();


//日间模式图标(base64)
var light = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIC' +
    'ItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjA2NzI5MzM4IiB' +
    'jbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkxNSIgd2lk' +
    'dGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mY' +
    'WNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vYmJha2hubWZramVuZmJoamRkZGlwY2VmbmhwaWtqYmovZm9udH' +
    'MvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnR' +
    'zL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyLjEgNzQzLjVjLTEyNy42IDAtMjMxLjQtMTAz' +
    'LjgtMjMxLjQtMjMxLjRzMTAzLjgtMjMxLjQgMjMxLjQtMjMxLjQgMjMxLjQgMTAzLjggMjMxLjQgMjMxLjQtMTAzLjggMjMxLjQtMjMxLjQgMjMxLjR6IG0wLTM5My40Yy04O' +
    'S4zIDAtMTYyIDcyLjctMTYyIDE2MnM3Mi43IDE2MiAxNjIgMTYyIDE2Mi03Mi43IDE2Mi0xNjItNzIuNy0xNjItMTYyLTE2MnpNNTEyLjEgMjI3LjFjLTE5LjIgMC0zNC43LT' +
    'E1LjUtMzQuNy0zNC43Vjk4LjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjEtMTUuNSAzNC43LTM0Ljc' +
    'gMzQuN3pNMjg2IDMyMC43Yy04LjkgMC0xNy44LTMuNC0yNC41LTEwLjJsLTY2LjMtNjYuM2MtMTMuNi0xMy42LTEzLjYtMzUuNSAwLTQ5LjEgMTMuNS0xMy42IDM1LjUtMTMu' +
    'NiA0OS4xIDBsNjYuMyA2Ni4zYzEzLjYgMTMuNiAxMy42IDM1LjUgMCA0OS4xYTM0LjY4IDM0LjY4IDAgMCAxLTI0LjYgMTAuMnpNMTkyLjQgNTQ2LjhIOTguN2MtMTkuMiAwL' +
    'TM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAzNC43LTM0Lj' +
    'cgMzQuN3pNMjE5LjggODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42IDM1LjUtMTM' +
    'uNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS43IDEwLjItMjQuNiAxMC4yek01MTIuMSA5NjAuMmMtMTkuMiAwLTM0' +
    'LjctMTUuNS0zNC43LTM0Ljd2LTkzLjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjItMTUuNSAzNC43L' +
    'TM0LjcgMzQuN3pNODA0LjQgODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMmwtNjYuMy02Ni4zYy0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMSAxMy41LTEzLjYgMz' +
    'UuNS0xMy42IDQ5LjEgMGw2Ni4zIDY2LjNjMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFhMzQuNjggMzQuNjggMCAwIDEtMjQuNiAxMC4yek05MjUuNSA1NDYuOGgtOTMuN2M' +
    'tMTkuMiAwLTM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAz' +
    'NC43LTM0LjcgMzQuN3pNNzM4LjIgMzIwLjdjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42I' +
    'DM1LjUtMTMuNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS44IDEwLjItMjQuNiAxMC4yeiIgZmlsbD0iI2Y0ZWEyYS' +
    'IgcC1pZD0iOTE2Ij48L3BhdGg+PC9zdmc+';

//夜间模式图标(base64)
var dark = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDI' +
    'CItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjAzODE3ODAwI' +
    'iBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDEiI' +
    'HhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvb' +
    'nQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL' +
    '2ZvbnRzL2VsZW1lbnQtaWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRkaXBjZWZuaHBpa2pia' +
    'i9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUwMy40IDk1OS4yYy0xNTYuMSAwLTMwM' +
    'y4xLTgzLjItMzgzLjUtMjE3LjNsLTQ1LjgtNzYuMyA4Ny4yIDE3LjNjNDQgOC44IDg4LjkgOC42IDEzMy4yLTAuNkMzODIuNiA2NjQuNCA0NTguMyA2MTMgNTA3LjggNTM4Y' +
    'zQ5LjUtNzUuMSA2Ni44LTE2NC45IDQ4LjctMjUzLTExLjgtNTcuMy0zOC40LTExMC43LTc2LjktMTU0LjRsLTU4LjctNjYuNyA4OC44IDEuMmMyNDMuMSAzLjQgNDQwLjggM' +
    'jAzLjkgNDQwLjggNDQ3IDAgMjQ2LjUtMjAwLjYgNDQ3LjEtNDQ3LjEgNDQ3LjF6TTIzOC4zIDc2OC4xYzY4LjUgNzEuNCAxNjMgMTEyLjMgMjY1LjEgMTEyLjMgMjAzLjEgM' +
    'CAzNjguMy0xNjUuMiAzNjguMy0zNjguMyAwLTE3MS42LTExOS42LTMxNy40LTI3OS44LTM1Ny40IDE5LjQgMzUuNyAzMy41IDc0LjMgNDEuOCAxMTQuNCA0Ni4xIDIyNC40L' +
    'Tk4LjkgNDQ0LjQtMzIzLjMgNDkwLjUtMjQgNS00OCA3LjgtNzIuMSA4LjV6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSIxMTAyIj48L3BhdGg+PC9zdmc+';

//显示快捷键窗口
var $hint = $(`
<div>
  <div>
    <div>
      <div class="Modal-wrapper undefined Modal-enter-done">
        <div class="Modal-backdrop"></div>
        <div class="Modal Modal--default ShortcutHintModal" tabindex="0">
          <div class="Modal-inner">
            <h3 class="Modal-title">快捷键帮助</h3>
            <div class="Modal-content">
              <div class="ShortcutHintModal-content">
                <div class="ShortcutHintModal-hintListContainer">
                  <div class="ShortcutHintModal-hintList">
                    <div class="ShortcutHintModal-hintTitle">操作</div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">V</kbd>
                        </div>
                      </div>
                      <div>：赞同</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">D</kbd>
                        </div>
                      </div>
                      <div>：反对</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">L</kbd>
                        </div>
                      </div>
                      <div>：喜欢</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">C</kbd>
                        </div>
                      </div>
                      <div>：展开 / 收起评论</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">O</kbd>
                        </div>
                      </div>
                      <div>：展开 / 收起全文</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">F</kbd>
                        </div>
                      </div>
                      <div>：收藏</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">S</kbd>
                        </div>
                      </div>
                      <div>：分享</div>
                    </div>
                  </div>
                  <div class="ShortcutHintModal-hintList">
                    <div class="ShortcutHintModal-hintTitle">导航</div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">J</kbd>
                        </div>
                      </div>
                      <div>：主内容下一项</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">K</kbd>
                        </div>
                      </div>
                      <div>：主内容上一项</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">G</kbd>
                          <div class="KeyHint-separator KeyHint-separator--space">
                          </div>
                        </div>
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">G</kbd>
                        </div>
                      </div>
                      <div>：滚动到页面顶部</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">Shift</kbd>
                          <div class="KeyHint-separator">+</div>
                        </div>
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">G</kbd>
                        </div>
                      </div>
                      <div>：滚动到页面底部</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">Shift</kbd>
                          <div class="KeyHint-separator">+</div>
                        </div>
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">U</kbd>
                        </div>
                      </div>
                      <div>：向上滚动半屏</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">Shift</kbd>
                          <div class="KeyHint-separator">+</div>
                        </div>
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">D</kbd>
                        </div>
                      </div>
                      <div>：向下滚动半屏</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">Shift</kbd>
                          <div class="KeyHint-separator">+</div>
                        </div>
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">S</kbd>
                        </div>
                      </div>
                      <div>：侧边栏第一项</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">/</kbd>
                        </div>
                      </div>
                      <div>：搜索</div>
                    </div>
                    <div class="KeyHint">
                      <div class="KeyHint-keyContainer">
                        <div class="KeyHint-key">
                          <kbd class="KeyHint-kbd">?</kbd>
                        </div>
                      </div>
                      <div>：快捷键帮助</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            aria-label="关闭"
            type="button"
            class="Button Modal-closeButton Button--plain"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="Zi Zi--Close Modal-closeIcon"
              fill="currentColor"
            >
              <path d="M5.619 4.381A.875.875 0 1 0 4.38 5.62L10.763 12 4.38 18.381A.875.875 0 1 0 5.62 19.62L12 13.237l6.381 6.382a.875.875 0 1 0 1.238-1.238L13.237 12l6.382-6.381A.875.875 0 0 0 18.38 4.38L12 10.763 5.619 4.38Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>;
`);

/*
//添加"匿名"按钮
function addAnonymous($QuestionHeaderActions, $more) {
    var a = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\">' +
        '<span style=\"display: inline-flex; align-items: center; vertical-align:middle;\">' +
        '<svg class=\"Zi Zi--Anonymous Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.2em\" height=\"1.2em\">' +
        '<path d=\"M831.994 442.66v436.364c0 24.906 7.312 45.124 42.654 45.124 35.344 0 42.656-20.218 42.656-45.124V442.66h-85.31z\"></path>' +
        '<path d=\"M895.992 582.814c0 11.78 9.532 21.342 21.312 21.342v-42.654a21.3 21.3 0 0 0-21.312 21.312zM895.992 668.156c0 11.78 9.532 21.342 21.312 21.342v-42.686c-11.78 0-21.312 9.564-21.312 21.344zM895.992 753.496a21.3 21.3 0 0 0 21.312 21.312v-42.656c-11.78 0-21.312 9.562-21.312 21.344zM895.992 838.806c0 11.812 9.532 21.344 21.312 21.344v-42.654c-11.78 0-21.312 9.562-21.312 21.31zM853.306 582.814c0 11.78-9.532 21.342-21.312 21.342v-42.654a21.3 21.3 0 0 1 21.312 21.312zM853.306 668.156c0 11.78-9.532 21.342-21.312 21.342v-42.686c11.782 0 21.312 9.564 21.312 21.344zM853.306 753.496a21.3 21.3 0 0 1-21.312 21.312v-42.656c11.782 0 21.312 9.562 21.312 21.344zM853.306 838.806c0 11.812-9.532 21.344-21.312 21.344v-42.654c11.782 0 21.312 9.562 21.312 21.31z\"></path><path d=\"M831.994 590.688c26.25-14.124 56.592-34.404 85.31-62.402V442.66h-85.31v148.028z\"></path>' +
        '<path d=\"M1021.52 168.916c-15.532-160.26-413.238 8.594-509.516 8.594S17.986 8.656 2.486 168.916c-29.436 303.68 212.838 396.178 254.65 405.772 147.84 33.904 201.15-48.044 254.868-48.044 53.686 0 107.028 81.95 254.836 48.044 41.812-9.592 284.086-102.092 254.68-405.772zM392.85 399.318c-23.624 8.328-52.154 12.906-80.342 12.906-24.78 0-47.904-3.594-66.904-10.39-18.75-6.718-32.812-16.204-41.842-28.202-14.75-19.67-16.906-48.578-6.436-85.95 2.5-1.156 9.342-3.532 23.592-3.532 36.062 0 88.216 15.03 132.84 38.28 44.75 23.312 66.342 46.624 71.81 59.25-3.97 3.904-13.844 10.982-32.718 17.638z m427.364-25.688c-9 12-23.094 21.484-41.844 28.202-18.968 6.796-42.124 10.39-66.874 10.39-28.218 0-56.748-4.578-80.342-12.906-18.906-6.656-28.75-13.734-32.75-17.64 5.468-12.624 27.062-35.936 71.812-59.25 44.622-23.25 96.778-38.28 132.872-38.28 14.25 0 21.06 2.376 23.56 3.532 10.502 37.376 8.314 66.282-6.434 85.952z\" ></path>' +
        '<path d=\"M867.71 276.15a42.61 42.61 0 0 0-22.998-27.124c-10.718-5-24.716-7.546-41.624-7.546-43.094 0-101.56 16.516-152.59 43.11-46.406 24.186-79.688 53.404-91.248 80.154a42.642 42.642 0 0 0 9.342 47.466c7.532 7.344 22.032 18.062 48.376 27.342 28.032 9.89 61.592 15.344 94.53 15.344 29.592 0 57.716-4.468 81.28-12.89 26.75-9.578 47.436-23.968 61.56-42.764 12.31-16.406 19.404-36.186 21.124-58.764 1.436-19.284-1.158-40.938-7.752-64.328z m-47.496 97.48c-9 12-23.094 21.484-41.844 28.202-18.968 6.796-42.124 10.39-66.874 10.39-28.218 0-56.748-4.578-80.342-12.906-18.906-6.656-28.75-13.734-32.75-17.64 5.468-12.624 27.062-35.936 71.812-59.25 44.622-23.25 96.778-38.28 132.872-38.28 14.25 0 21.06 2.376 23.56 3.532 10.502 37.376 8.314 66.282-6.434 85.952zM464.722 364.742c-11.562-26.75-44.81-55.968-91.248-80.154-51.03-26.594-109.498-43.11-152.558-43.11-16.906 0-30.906 2.532-41.624 7.532a42.69 42.69 0 0 0-23.03 27.14c-6.562 23.39-9.156 45.044-7.718 64.326 1.688 22.578 8.782 42.358 21.092 58.764 14.124 18.796 34.842 33.188 61.592 42.764 23.562 8.422 51.654 12.89 81.278 12.89 32.906 0 66.468-5.454 94.53-15.344 26.312-9.28 40.812-20 48.342-27.342a42.638 42.638 0 0 0 9.344-47.466z m-71.872 34.576c-23.624 8.328-52.154 12.906-80.342 12.906-24.78 0-47.904-3.594-66.904-10.39-18.75-6.718-32.812-16.204-41.842-28.202-14.75-19.67-16.906-48.578-6.436-85.95 2.5-1.156 9.342-3.532 23.592-3.532 36.062 0 88.216 15.03 132.84 38.28 44.75 23.312 66.342 46.624 71.81 59.25-3.97 3.904-13.844 10.982-32.718 17.638z\"></path>' +
        '</svg></span> 匿名</button>';
    var $anonymous = $(a);
    $anonymous.bind("click", function() {
        $more.find("button").click();
        $(".Menu.QuestionHeader-menu").children().eq(0).click();
    });
    $QuestionHeaderActions.append($anonymous);
}
*/

//添加"问题日志"按钮
function addLog($QuestionHeaderActions) {
    var url = window.location.href;
    var end, href;
    if (url.indexOf("?") > -1) {
        end = url.indexOf("?");
        url = url.substring(0, end);
    }

    if (url.indexOf("answer") > -1) {
        end = url.indexOf("answer");
        href = url.substring(0, end);
    } else {
        href = url + "/";
    }
    var L = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><a href=\"' + href + 'log\" target=\"_self\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Zi Zi--Log Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.2em\" height=\"1.2em\"><path d=\"M733.129568 1.700997H1.700997v1020.598006h1020.598006v-765.448505z m204.119601 935.548172h-850.498338v-850.498338h614.910299l235.588039 206.671096z\"></path><path d=\"M170.099668 171.800664h279.813953v85.049834H170.099668zM170.099668 372.518272h683.800664v85.049834H170.099668zM170.099668 567.282392h683.800664v85.049834H170.099668zM170.099668 762.046512h683.800664v85.049834H170.099668z\"></path></svg></span>问题日志</a></button>';
    var $log = $(L);
    $QuestionHeaderActions.append($log);
}

//添加"快捷键"按钮
function addShortCut($QuestionHeaderActions) {
    var s = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Zi Zi--ShortCut Button-zi\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" width=\"1.5em\" height=\"1.2em\"><path d=\"M1088 128H64C28.8 128 0 156.8 0 192v640c0 35.2 28.8 64 64 64h1024c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64zM640 256h128v128h-128V256z m192 192v128h-128v-128h128zM448 256h128v128h-128V256z m192 192v128h-128v-128h128zM256 256h128v128H256V256z m192 192v128h-128v-128h128zM128 256h64v128H128V256z m0 192h128v128H128v-128z m64 320H128v-128h64v128z m576 0H256v-128h512v128z m256 0h-192v-128h192v128z m0-192h-128v-128h128v128z m0-192h-192V256h192v128z\"></path></svg></span>  快捷键</button>';
    var $shortcut = $(s);
    $shortcut.css({
        "margin-left": "10px"
    });
    $shortcut.click(function() {
        $(".Modal-wrapper").show();
    });
    $QuestionHeaderActions.append($shortcut);

}

//UTC标准时转UTC+8北京时间
function getUTC8(datetime) {
    let month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let hours = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let minutes = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let seconds = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return (datetime.getFullYear() + "-" + month + "-" + date + "\xa0\xa0" + hours + ":" + minutes + ":" + seconds);
}



//回答页
function question() {
    if (Config.currentValues.hideQuestionSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".Question-sideColumn.Question-sideColumn--sticky").hide();
        if ($(".ListShortcut").length > 0) {
            $(".ListShortcut").width($(".Question-main").width());
            $(".Question-mainColumn").width($(".ListShortcut").width());
            $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中

        } else {
            $(".Question-mainColumn").width($(".Question-main").width());
            $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中
        }
    } else if (Config.currentValues.hideQuestionSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".Question-sideColumn.Question-sideColumn--sticky").hide();

        $(".Question-main").attr("style", "display:flex;justify-content:center;");
        $(".ContentItem-actions").width($(".Question-mainColumn").width() - 40); //每个回答的的margin-left + margin-right=40px，减去才能正好居中
    }

    //首页顶部导航栏"等你来答"页
    if (window.location.href.indexOf("waiting") > -1) {
        if (Config.currentValues.hideIndexSidebar == 1) //隐藏侧边栏并拉宽内容
        {
            $('.css-1qyytj7').hide();
            $(".GlobalSideBar").hide();
            $(".QuestionWaiting-mainColumn").width($(".QuestionWaiting").width());
        } else if (Config.currentValues.hideIndexSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
        {
            $('.css-1qyytj7').hide();
            $(".GlobalSideBar").hide();
            $(".QuestionWaiting").attr("style", "display:flex;justify-content:center;");
        }
    }

    /*
    //稍后答功能
    if (Config.currentValues.hideLaterSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".QuestionLater-mainColumn").width($(".QuestionLater").width());
    } else if (Config.currentValues.hideLaterSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".QuestionLater").attr("style", "display:flex;justify-content:center;");
    }
*/

    //问题编辑时间参考：https://greasyfork.org/zh-CN/scripts/398195
    if ($(".QuestionPage .QuestionHeader-side p").length == 0 && window.location.href.indexOf("log") == -1) //非问题日志页
    {
        let createtime = $(".QuestionPage>[itemprop~=dateCreated]").attr("content");
        let modifiedtime = $(".QuestionPage>[itemprop~=dateModified]").attr("content");
        createtime = getUTC8(new Date(createtime));
        modifiedtime = getUTC8(new Date(modifiedtime));

        $(".QuestionPage .QuestionHeader-side").append('<div style=\"color:#8590a6; margin-top:15px\"><p>创建时间:&nbsp;&nbsp;' + createtime + '</p><p>最后编辑:&nbsp;&nbsp;' + modifiedtime + '</p></div>');
    }

    //快捷键提示框
    if ($(".Modal-wrapper").length == 0) {
        $(document.body).append($hint);
        $(".Modal-wrapper").hide();
        $(".Modal-closeButton").click(function() {
            $(".Modal-wrapper").hide();
        });
    }

    //问题标题
    var $QuestionHeaderActions = $("div.QuestionHeaderActions");

    var $titlemore = $QuestionHeaderActions.find(".Zi--Dots").parent().parent().parent(); //更多
    var $titlereport = $QuestionHeaderActions.find(".Title.Zi--Report"); //举报
    /*var $anonymous = $(".Zi--Anonymous"); //匿名*/
    var $log = $(".Zi--Log"); //日志
    var $shortcut = $(".Zi--ShortCut"); //快捷键

    if ($(".AppHeader-profileAvatar").length > 0) //已登录
    {
        if ($titlereport.length == 0) //题目未添加举报
        {
            $titlemore.hide();
            let button_text = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Title Zi--Report \" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function() {
                $titlemore.find("button").click();
                $(".Menu.QuestionHeader-menu").children().eq(2).click();
            });
            $titlemore.after($report);
        }
        /*
        if ($anonymous.length == 0) //未添加匿名
        {
            addAnonymous($QuestionHeaderActions, $titlemore);
        }
        */
        if ($log.length == 0) //未添加查看问题日志
        {
            addLog($QuestionHeaderActions);
        }
        if ($shortcut.length == 0) //未添加快捷键帮助
        {
            addShortCut($QuestionHeaderActions);
        }

        /*
        //回答举报按钮
        $(".ContentItem-actions").each(function() {

            if ($(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加举报 且 不是自己的回答
            {
                let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
                $question_dot.hide();
                let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
                let $report = $(button_text);
                $report.bind("click", function() {
                    $question_dot.find("button").click();
                    $(".Menu.AnswerItem-selfMenu").find("button").each(function() {
                        if ($(this).text().indexOf("举报") > -1)
                            $(this).click();
                    });
                });
                $question_dot.before($report);
            } else {
                $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
            }
        });
        */

        //不感兴趣按钮
        $(".Zi--Disinterested").parent().parent().hover(function() {
            $(this).find(".Zi--Disinterested").attr("fill", "rgb(252,96,123)");
            $(this).attr("style", "color:rgb(252,96,123)");
        }, function() {
            $(this).find(".Zi--Disinterested").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        });

        //问题回答举报按钮、不感兴趣按钮
        $(".ContentItem-actions").each(function() {

            if (window.location.href.indexOf('/follow') == -1 && $(this).find(".Zi--Disinterested").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加不感兴趣 且 不是自己的回答
            {
                let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
                $question_dot.hide();
                let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Disinterested\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3931\" width=\"14\" height=\"14\"><path d=\"M512 32C251.4285715625 32 32 251.4285715625 32 512s219.4285715625 480 480 480 480-219.4285715625 480-480-219.4285715625-480-480-480z m205.7142853125 617.142856875c20.5714284375 20.5714284375 20.5714284375 48 0 61.714286249999994-20.5714284375 20.5714284375-48 20.5714284375-61.714285312499996 0l-137.142856875-137.1428578125L374.857143125 717.7142853125c-20.5714284375 20.5714284375-48 20.5714284375-68.5714284375 0s-20.5714284375-54.857143125 0-68.5714284375l144-144-137.1428578125-137.142856875c-20.5714284375-13.714285312500001-20.5714284375-41.142856875 0-61.714285312499996 20.5714284375-20.5714284375 48-20.5714284375 61.714286249999994 0l137.142856875 137.142856875 144-144c20.5714284375-20.5714284375 48-20.5714284375 68.5714284375 0 20.5714284375 20.5714284375 20.5714284375 48 0 68.5714284375L580.5714284375 512l137.142856875 137.142856875z\"  p-id=\"3932\"></path></svg></span> 不感兴趣</button>';
                let $disinterested = $(button_text);

                $disinterested.bind("click", function() {

                    let $disinterestedBtn = $(this);
                    let buttonPos = $disinterestedBtn.offset();
                    let buttonWidth = $disinterestedBtn.outerWidth();

                    // 创建一个观察器来监听DOM变化
                    let observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.addedNodes.length) {
                                mutation.addedNodes.forEach(function(node) {
                                    if (node.nodeType === 1) { // 元素节点
                                        if ($(node).hasClass('Popover-content') ||
                                            $(node).find('.Popover-content').length) {

                                            let $popover = $(node).hasClass('Popover-content') ?
                                                $(node) : $(node).find('.Popover-content');

                                            // 立即计算并设置位置
                                            let popoverWidth = $popover.outerWidth();
                                            let left = buttonPos.left + (buttonWidth / 2) - (popoverWidth / 2);
                                            let top = buttonPos.top + $disinterestedBtn.outerHeight();

                                            // 在元素插入DOM后立即设置位置，避免重绘
                                            requestAnimationFrame(function() {
                                                $popover.css({
                                                    'left': left + 'px',
                                                    'top': top + 'px',
                                                    'opacity': '1'
                                                });

                                                // 设置箭头位置
                                                $popover.find('.Popover-arrow--bottom').css({
                                                    'left': (popoverWidth / 2) + 'px'
                                                });

                                                // 查找举报按钮并隐藏
                                                let $lastButton = $popover.find('button:last-child');
                                                if ($lastButton.length && $lastButton.text().indexOf('举报') !== -1) {
                                                    $lastButton.hide();
                                                }

                                            });
                                        }
                                    }
                                });
                            }
                        });
                    });

                    // 开始观察文档变化
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });

                    // 触发原始按钮点击
                    $question_dot.find("button").click();

                    // 3秒后停止观察
                    setTimeout(() => {
                        observer.disconnect();
                    }, 3000);
                });

                $question_dot.before($disinterested);

            } else {
                $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
            }


            if ($(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加举报 且 不是自己的回答
            {
                let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
                $question_dot.hide();
                let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
                let $report = $(button_text);
                $report.bind("click", function() {
                    $question_dot.find("button").click();
                    $(".Menu.AnswerItem-selfMenu").find("button").each(function() {
                        if ($(this).text().indexOf("举报") > -1)
                        {
                            $(this).click();
                            $('.Popover-content').hide();
                        }
                    });
                });
                $question_dot.before($report);
            } else {
                $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
            }

        });


    } else //未登录
    {
        $(".Zi--Dots").parent().parent().parent().hide();

        $log = $(".Zi--Log"); //日志
        $shortcut = $(".Zi--ShortCut"); //快捷键

        if ($log.length == 0) //未添加查看问题日志
        {
            addLog($QuestionHeaderActions);
        }
        if ($shortcut.length == 0) //未添加快捷键帮助
        {
            addShortCut($QuestionHeaderActions);
        }
    }

    //调整问题的按钮间距
    $(".QuestionHeaderActions .QuestionHeader-Comment").css({
        "margin": "0px 0px 0px 0px"
    });
    $(".QuestionHeaderActions .Popover.ShareMenu").css({
        "margin": "0px 0px 0px 0px"
    });
    $(".QuestionHeaderActions .Button.Button--plain.Button--withIcon.Button--withLabel").css({
        "margin": "0px 0px 0px 9px"
    });

    var $QuestionButtonGroup = $(".QuestionHeader-footer-main").find(".QuestionButtonGroup");
    $QuestionButtonGroup.children().eq(0).css({
        "margin": "0px 0px 0px 8px"
    });
    $QuestionButtonGroup.children().eq(1).css({
        "margin": "0px 0px 0px 8px"
    });

    $(".QuestionHeaderActions").children().eq(0).css({
        "margin": "0px 8px 0px 0px"
    });

    $(".GoodQuestionAction-commonBtn").css("margin", "0px 0px 0px 0px");

    $('.css-8pep6o').width($('.AnswerForm.css-1ot8pew').width());
    $('.css-29tdoj').width($('.css-8pep6o').width());
    $('.InputLike.AnswerForm-editor').width($('.css-29tdoj').width());

    $('.css-arjme8').width($('.toolbarV3.css-10r8x72').width());
    $('.css-jis2as').width($('.css-arjme8').width());
    $('.css-29tdoj').width($('.css-arjme8').width());
    $('.css-1pfsia3').width($('.css-arjme8').width());

    //回答的发布时间
    $(".ContentItem.AnswerItem").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".ContentItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                } else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    if ($(this).find(".RichContent").length > 0) {
                        $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    } else //没有RichContent
                    {
                        $(this).find(".ContentItem-time:not(.css-18wtfyc):nth-of-type(2)").hide();
                    }
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }

        /*
        //移动关注按钮到用户名旁边
        if($(this).find('.FollowButton').length>0  && !$(this).find('.FollowButton').hasClass('left'))
        {
            let width=$(this).find('.AuthorInfo:not(.AnswerItem-authorInfo)').width()+10;
            $(this).find('.FollowButton').css({'position':'absolute', 'left': width});
            $(this).find('.FollowButton').addClass('left');
        }
        */
    });

    //关怀版回答的发布时间
    $(".List-item.aria-answer-item").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                $(this).find(".aria-content").prepend(temp_time);
            }
        }
    });


    $(".Pc-card.Card").attr("style", "display:none");

    //查看全部回答按钮变色
    $(".QuestionMainAction").attr("style", "color:white;background-color:#0084FF");

    //将问题描述中的转义字符进行转义
    if (!$('.QuestionRichText--expandable.QuestionRichText--collapsed').hasClass('done')) {
        let description = $('.QuestionRichText--expandable.QuestionRichText--collapsed>div>span').text();
        description = description.replace(/&quot;/g, '"');
        description = description.replace(/&amp;/g, '&');
        description = description.replace(/&lt;/g, '<');
        description = description.replace(/&gt;/g, '>');
        description = description.replace(/&nbsp;/g, ' ');
        $('.QuestionRichText--expandable.QuestionRichText--collapsed>div>span').text(description);
        $('.QuestionRichText--expandable.QuestionRichText--collapsed').addClass('done');
    }
}


//知乎跳转链接转为直链
function directLink() {
    var equal, colon, external_href, protocol, path, new_href;
    //文字链接
    $("a.external").each(function() {
        if ($(this).find("span").length > 0) {
            new_href = $(this).text();
            $(this).attr("href", new_href);
        } else if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            new_href = external_href.substring($(this).attr("href").indexOf("link.zhihu.com/?target=") + "link.zhihu.com/?target=".length);

            new_href.replace(/%/g, '%25');
            $(this).attr("href", decodeURIComponent(new_href));
        } else {
            external_href = $(this).attr("href");
            if (external_href.lastIndexOf("https%3A"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("https%3A"));
            else if (external_href.lastIndexOf("http%3A%2F%2F"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("http%3A"));

            new_href.replace(/%/g, '%25');
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });

    //卡片链接
    $("a.LinkCard:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)").each(function() {
        if ($(this).find(".LinkCard-title").length > 0 && $(this).find(".LinkCard-title").text().indexOf("http") > -1) {
            new_href = $(this).find(".LinkCard-title").text();
            $(this).attr("href", new_href);
        } else if ($(this).find(".LinkCard-desc").length > 0 && $(this).find(".LinkCard-desc").text().indexOf("http") > -1) {
            new_href = $(this).find(".LinkCard-desc").text();
            $(this).attr("href", new_href);
        } else if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            new_href = external_href.substring($(this).attr("href").indexOf("link.zhihu.com/?target=") + "link.zhihu.com/?target=".length);

            new_href.replace(/%/g, '%25');
            $(this).attr("href", decodeURIComponent(new_href));
        } else {
            external_href = $(this).attr("href");
            if (external_href.lastIndexOf("https%3A"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("https%3A"));
            else if (external_href.lastIndexOf("http%3A%2F%2F"))
                new_href = $(this).attr("href").substring($(this).attr("href").lastIndexOf("http%3A"));

            new_href.replace(/%/g, '%25');
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });

    //旧版视频卡片链接
    $("a.VideoCard-link").each(function() {
        if ($(this).attr("href").indexOf("link.zhihu.com/?target=") > -1) {
            external_href = $(this).attr("href");
            equal = external_href.lastIndexOf("http");
            colon = external_href.lastIndexOf("%3A");
            protocol = external_href.substring(equal, colon);
            path = external_href.substring(colon + 5, external_href.length);
            new_href = protocol + "://" + path;

            new_href.replace(/%/g, '%25');
            $(this).attr("href", decodeURIComponent(new_href));
        }
    });

    //隐藏首页广告卡片
    $(".TopstoryItem--advertCard").hide();

    //隐藏回答广告卡片
    $('.RichText-Ecommerce').hide();
    $('.RichText-EduCardContainer').hide();

}

//专栏文章
function zhuanlan() {
    //隐藏推荐文章
    if (Config.currentValues.hideRecommendedReading == 1) {
        $(".Recommendations-Main").hide();
    }

    //隐藏专栏文章侧边栏
    if (Config.currentValues.hideColumnSideBar == 1)
    {
        $(".Post-Row-Content-right").hide();
        $(".Post-Row-Content-left").width($(".Post-Row-Content").width());
    }
    else if(Config.currentValues.hideColumnSideBar == 2)
    {
        $(".Post-Row-Content-right").hide();
        $(".Post-Row-Content").attr("style", "display:flex;justify-content:center;");
    }


    //专栏举报按钮
    if ($(".Zi--Report").length == 0) //未添加举报
    {
        let $lastchild = $(".ContentItem-actions").children().eq(-1);
        if ($lastchild.find(".Zi--Dots").length > 0)
            $lastchild.hide();
        var button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
        var $report = $(button_text);
        $report.bind("click", function() {
            $lastchild.find("button").click();
            $(".Menu.Post-ActionMenu").find("button").click();
        });
        $lastchild.after($report);
    }

    //有"编辑于"时，增加发布时间
    if ($(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1 && !$(".ContentItem-time:not(.css-18wtfyc)").hasClass("done")) {
        let bianjiyu = $(".ContentItem-time:not(.css-18wtfyc)").text();
        $(".ContentItem-time:not(.css-18wtfyc)").click();
        $(".ContentItem-time:not(.css-18wtfyc)").text($(".ContentItem-time:not(.css-18wtfyc)").text() + "\xa0\xa0，\xa0\xa0" + bianjiyu);
        $(".ContentItem-time:not(.css-18wtfyc)").addClass("done");
    }

    //发布时间置顶
    if (Config.currentValues.publishTop == 1 && $(".Post-Header").find(".ContentItem-time").length == 0) {
        let temp_time = $('.Post-content').find(".ContentItem-time").clone();
        console.log(temp_time)
        $('.Post-content').find(".ContentItem-time").hide();
        temp_time.css({
            "padding": "0px 0px 0px 0px",
            "margin-top": "14px"
        });
        temp_time.appendTo($(".Post-Header"));
    }

    //专栏设置的已选菜单项变色
    $(".css-17px4ve").parent().each(function() {
        if ($(this).find(".css-17px4ve").children().length > 0) {
            $(this).css("color", "black");
            $(this).find(".Zi--Check").attr("fill", "black");
        }
    });

    $('.css-sdgtgb').width($('.css-10r8x72').width());
}

let pinbg=0;

//想法
function pin() {
    if(pinbg==0)
    {
        GM_addStyle(`
        html[data-theme=light] body{background:white!important;}
        html[data-theme=dark] body{background:rgb(18,18,18)!important;}
        .PinToolbar-menuContainer .Menu{display:none!important;}
        `);
        pinbg=1;
    }


    /*
    //想法喜欢按钮
    if ($(".Zi--Heart").length == 0) //未添加喜欢
    {
        let $lastchild = $(".ContentItem-actions").children().eq(-1);
        if ($lastchild.find(".ZDI--Dots24").length > 0)
            $lastchild.hide();
        let button_text = '<button type="button" class="Button ContentItem-action Button--plain Zi--Heart"><span style="display: inline-flex; align-items: center"><svg class="Zi Zi--Heart" fill="currentColor" viewBox="0 0 24 24" width="14" height="14"><path d="M17.142 3.041c1.785.325 3.223 1.518 4.167 3.071 1.953 3.215.782 7.21-1.427 9.858a23.968 23.968 0 0 1-4.085 3.855c-.681.5-1.349.923-1.962 1.234-.597.303-1.203.532-1.748.587a.878.878 0 0 1-.15.002c-.545-.04-1.162-.276-1.762-.582a14.845 14.845 0 0 1-2.008-1.27 24.254 24.254 0 0 1-4.21-4.002c-2.1-2.56-3.16-6.347-1.394-9.463.92-1.624 2.362-2.892 4.173-3.266 1.657-.341 3.469.097 5.264 1.44 1.75-1.309 3.516-1.76 5.142-1.464Z"   fill-rule="evenodd" ></path></svg  ></span>  喜欢</button>';var $report = $(button_text);
        let $heart = $(button_text);
        $heart.bind("click", function() {
            $lastchild.find("button").click();
            let $button=$(".PinToolbar-menuContainer .Menu").find("button").eq(0);
            if($button.text().indexOf("取消喜欢")>-1)
            {
                $button.click();
                $('.Button.Zi--Heart').prop('lastChild').nodeValue=' 喜欢';
            }
            else if($button.text().indexOf("喜欢")>-1)
            {
                $button.click();
                $('.Button.Zi--Heart').prop('lastChild').nodeValue=' 已喜欢';
            }

        });
        $lastchild.before($heart);
    }
    */


    //想法举报按钮
    if ($(".Zi--Report").length == 0) //未添加举报
    {
        let $lastchild = $(".ContentItem-actions").children().eq(-1);
        if ($lastchild.find(".ZDI--Dots24").length > 0)
            $lastchild.hide();
        let button_text = '<button type="button" class="Button ContentItem-action Button--plain"><span style="display: inline-flex; align-items: center;"><svg class="Zi Zi--Report" fill="currentColor" viewBox="0 0 24 24" width="14" height="14"><path d="M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z" fill-rule="evenodd"></path></svg></span> 举报</button>';
        let $report = $(button_text);
        $report.bind("click", function() {
            $lastchild.find("button").click();
            $(".PinToolbar-menuContainer .Menu").find("button").eq(-1).click();
        });
        $lastchild.before($report);
    }

    //有"编辑于"时，增加发布时间
    if ($(".ContentItem-time:not(.css-18wtfyc)").find('a span').text().indexOf("编辑于") > -1 && !$(".ContentItem-time:not(.css-18wtfyc)").hasClass("done")) {
        let data_tooltip = $(".ContentItem-time:not(.css-18wtfyc)").find('a span').attr('data-tooltip');
        let old_text=$(".ContentItem-time:not(.css-18wtfyc)").find('a span').text();
        $(".ContentItem-time:not(.css-18wtfyc)").find('a span').text(data_tooltip+ "\xa0\xa0，\xa0\xa0" + old_text);
        $(".ContentItem-time:not(.css-18wtfyc)").addClass("done");
    }

    //发布时间置顶
    if (Config.currentValues.publishTop == 1 && $(".ContentItem-meta").find(".ContentItem-time:not(.css-18wtfyc)").length == 0) {
        let $ContentItem_time_old=$(".ContentItem-time:not(.css-18wtfyc)");
        $ContentItem_time_old.hide();
        let $ContentItem_time=$ContentItem_time_old.clone();
        $ContentItem_time.css({
            "padding": "0px 0px 0px 0px",
            "margin-top": "14px",
            "display":"block"
        });
        $ContentItem_time.appendTo($(".ContentItem-meta"));
    }
}

var upload_video_main_flag = 0; //上传视频页标志

//视频页
function zvideo() {

    //隐藏推荐视频
    $(".ZVideo-sideColumn").hide();

    if (upload_video_main_flag == 0 && window.location.href.indexOf('upload-video') > 0) {
        GM_addStyle('html[data-theme=dark] main{background:rgb(18,18,18)}');
        upload_video_main_flag = 1;
    }
}

/*
//知乎圈子
function club() {
    if (Config.currentValues.hideClubSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".ClubSideBar").hide();
        $(".Club-mainColumn").width($(".Club-container").width());
        $(".ClubEdit").width($(".Club-mainColumn").width() - 40); //每个提问的的margin-left + margin-right=40px，减去才能正好居中
        $('.ClubTopPosts').width($(".Club-mainColumn").width() - 32);
        $('.ClubPostList').width($(".Club-mainColumn").width());
        $('.PostItem.css-1b27c42').width($(".Club-mainColumn").width() - 32);
        $('section').css('border-right', 'none');
    } else if (Config.currentValues.hideClubSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".ClubSideBar").hide();
        $(".Club-mainColumn").parent().attr("style", "display:flex;justify-content:center;");
        $(".ClubEdit").width($(".Club-mainColumn").width() - 40); //每个提问的的margin-left + margin-right=40px，减去才能正好居中
        $('.ClubTopPosts').width($(".Club-mainColumn").width() - 32);
        $('.ClubPostList').width($(".Club-mainColumn").width());
        $('.PostItem.css-1b27c42').width($(".Club-mainColumn").width() - 32);
        $('section').css('border-right', 'none');
    }

    //退出圈子按钮
    var $ClubHeaderInfo_buttonGroup = $(".ClubHeaderInfo-buttonGroup");
    var $child1 = $ClubHeaderInfo_buttonGroup.children().eq(1 - 1);
    var $child2 = $ClubHeaderInfo_buttonGroup.children().eq(2 - 1);
    if ($child2.length > 0 && $child2.text().indexOf("签到") > -1 && $child2.text().indexOf("加入") == -1) //退出圈子
    {
        $child1.hide();
        let button_text = '<button class=\"ClubJoinOrCheckinButton\" style=\"margin-right:20px\"><img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUxOTQxMTM1MTI0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg2NDgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnRzL2VsZW1lbnQtaWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRkaXBjZWZuaHBpa2piai9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTEwMjEuNzM4IDUxMS45OTggNzQzLjA4MiA2OTcuNzczIDc0My4wODIgNTU4LjQ0IDI3OC42NTYgNTU4LjQ0IDI3OC42NTYgNDY1LjU2bDQ2NC40MjYgMEw3NDMuMDgyIDMyNi4yMzIgMTAyMS43MzggNTExLjk5OHpNNTEwLjg2OSAyMzMuMzQ3IDkyLjg4NSAyMzMuMzQ3bDAgNTU3LjMwNyA0MTcuOTg0IDBMNTEwLjg2OSA2NTEuMzI2bDkyLjg4NSAwIDAgMjMyLjIxOC05Mi44ODUgMEw5Mi44ODUgODgzLjU0NCAwIDg4My41NDRsMC05Mi44OUwwIDIzMy4zNDdsMC05Mi44OSA5Mi44ODUgMCA0MTcuOTg0IDAgOTIuODg1IDAgMCAyMzIuMjE4LTkyLjg4NSAwTDUxMC44NjkgMjMzLjM0N3oiIHAtaWQ9Ijg2NDkiIGZpbGw9IiNmZjAwMDAiPjwvcGF0aD48L3N2Zz4=\"/><span style=\"color:red\">&nbsp;退出圈子</span></button>';
        let $report = $(button_text);
        $report.bind("click", function() {
            $child1.find("button").click();
            $(".ClubHeaderInfoMoreButton-item").click();
        });
        $child1.after($report);
    }

    //圈子中提问举报按钮
    $(".PostReaction").each(function() {
        var $post_dot = $(this).find(".Zi--Dots").closest(".Popover");
        if ($(this).find(".Zi--Report").length == 0) //未添加举报
        {
            $post_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button PostWebActionButtons-comment Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function() {
                $post_dot.find("button").click();
                $(".PostWebActionButtons-item").click();
            });
            $post_dot.after($report);
        }
    });

    //有"最后回复"时，增加发布时间
    $(".PostItem-time").each(function() {

        if ($(this).text().indexOf("发布时间") == -1 && $(this).parent().text().indexOf("最后回复") > -1) {
            let datetime = new Date($(this).attr("datetime"));
            let posttime = getUTC8(datetime);
            let replytime = $(this).text();

            $(this).parent().get(0).childNodes[1].nodeValue = "";
            $(this).parent().get(0).childNodes[2].nodeValue = "";
            $(this).text("发布时间 " + posttime + "\xa0\xa0，\xa0\xa0" + "最后回复 " + replytime);

        }
    });
}
*/

let widthFlag=0;

//知乎圈子
function ring() {

    if(window.location.href.includes('/ring-feeds'))
    {
        if (Config.currentValues.hideRingSideBar == 1) //隐藏侧边栏并拉宽内容
        {
            if(widthFlag==0)
            {
                let totalWidth=$(".Topstory-container").width();
                $(".css-1qyytj7").hide();
                $(".Topstory-mainColumn").width(totalWidth);
                $(".Topstory-mainColumnCard").width(totalWidth);
                $(".Topstory-content").width(totalWidth);
                $(".css-1g878q7").width(totalWidth);
                $(".css-ekkpum").width(totalWidth);

                let coverWidth=$(".css-19assbf").width();
                let coverHeight=$(".css-19assbf").height();
                $(".css-19assbf").width(totalWidth).height(coverHeight*totalWidth/coverWidth);

                GM_addStyle(`.css-1im5po3{width:700px !important;}`);
                widthFlag=1;
            }
        }
        else if (Config.currentValues.hideRingSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
        {
            if(widthFlag==0)
            {
                let totalWidth=$(".Topstory-container").width();
                $(".css-1qyytj7").hide();

                $(".Topstory-mainColumn").attr("style", "display:flex;justify-content:center;");
                $(".Topstory-mainColumn").width(totalWidth);

                GM_addStyle(`.css-1im5po3{width:700px !important;}`);

                widthFlag=1;
            }
        }
    }



    if (Config.currentValues.hideRingSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        if(widthFlag==0)
        {
            let totalWidth=$(".css-kboer3").width() + $(".css-ill7fe").width();
            $(".css-ill7fe").hide();
            $(".css-kboer3").width(totalWidth);
            $(".css-1lo6frp").width(totalWidth);
            $(".css-exh6me").width(totalWidth);

            let coverWidth=$(".css-19assbf").width();
            let coverHeight=$(".css-19assbf").height();
            $(".css-19assbf").width(totalWidth).height(coverHeight*totalWidth/coverWidth);

            GM_addStyle(`.css-11uaof3 .RichContent-actions.is-fixed{width:${totalWidth}px !important;}`);
            widthFlag=1;
        }
    }
    else if (Config.currentValues.hideRingSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {

        $(".css-ill7fe").hide();
        $(".css-14pitda").parent().attr("style", "display:flex;justify-content:center;");
        GM_addStyle(`.css-11uaof3 .RichContent-actions.is-fixed{width:${$(".css-kboer3").width()}px !important;}`);
    }

    //圈子的发布时间
    $(".ContentItem.PinItem").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }
            else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".ContentItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                }
                else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    if ($(this).find(".RichContent").length > 0) {
                        $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    }
                    else //没有RichContent
                    {
                        $(this).find(".ContentItem-time:not(.css-18wtfyc):nth-of-type(2)").hide();
                    }
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }

        if($(this).find('.Button.ContentItem-more').length>0)
        {
            $(this).find('.Button.ContentItem-more').click();
        }
    });
}

//获取url中?后面的参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

//搜索结果页
function search() {
    if (Config.currentValues.hideSearchSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.css-knqde').hide();
        $(".SearchSideBar").hide();
        $(".SearchMain").width($(".Search-container").width());
    } else if (Config.currentValues.hideSearchSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.css-knqde').hide();
        $(".SearchSideBar").hide();
        $(".Search-container").attr("style", "display:flex;justify-content:center;");
    }


    $(".ContentItem.AnswerItem, .ContentItem.ArticleItem").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时，增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".SearchItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                } else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("SearchItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    $(this).find(".SearchItem-meta").append(temp_time);
                }
            }
        }

    });

    //隐藏相关推荐的卡片，仅保留问题卡片
    /*
    $(".RelevantQuery").closest(".Card.SearchResult-Card").hide();
    $(".KfeCollection-PcCollegeCard-wrapper").closest(".Card.SearchResult-Card").hide();
    if (getQueryVariable("type") == "content") {
        $('.Card.SearchResult-Card[data-za-detail-view-path-module=\"UserItem\"]').hide();
    }
    */

    //显示搜索页综合信息流标签
    if (Config.currentValues.flowTag == 1 && getQueryVariable("type") == "content") {
        $('.Card .List-item .ContentItem').each(function() {
            if ($(this).find('.Tag').length == 0) {
                let type;
                if ($(this).attr('itemprop') != undefined)
                    type = $(this).attr('itemprop');
                else if ($(this).attr('itemtype') != undefined && $(this).attr('itemtype').indexOf('Zvideo') > -1)
                    type = 'zvideo';

                let typebackground = "",
                    typename = "";
                if (type == 'answer') {
                    typebackground = "#0084FF";
                    typename = '问题';
                } else if (type == 'article') {
                    typebackground = "orange";
                    typename = '文章';
                } else if (type == 'zvideo') {
                    typebackground = "red";
                    typename = '视频';
                }

                if (typename != "") {
                    let tag = '<div class="Button Tag flowTag" style="background:' + typebackground + '"><span class="Tag-content">' + typename + '</span></div>';
                    $(this).find('.ContentItem-title a').before($(tag));
                }
            }
        });

        $('.Card.css-oo264i .css-ywimgq').each(function() {
            if ($(this).find('.Tag').length == 0) {
                let tag = '<div class="Button Tag flowTag" style="background:red"><span class="Tag-content">视频</span></div>';
                $(this).prepend($(tag));
            }
        });
    }
}

//知乎讲座
function lives() {
    $("[class*=\'LiveWechatSpread\']").hide(); //隐藏微信推荐
}

//收藏夹
function collection() {
    if (Config.currentValues.hideCollectionSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".CollectionDetailPageSideBar").hide();
        $(".CollectionsDetailPage-mainColumn").width($(".CollectionsDetailPage").width());

        $(".GlobalSideBar").hide();
        $(".Collections-mainColumn").width($(".Collections-container").width());

        $(".css-1qyytj7").hide();
    } else if (Config.currentValues.hideCollectionSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".CollectionDetailPageSideBar").hide();
        $(".CollectionsDetailPage-mainColumn").parent().attr("style", "display:flex;justify-content:center;");

        $(".GlobalSideBar").hide();
        $(".Collections-mainColumn").parent().attr("style", "display:flex;justify-content:center;");

        $(".css-1qyytj7").hide();
    }

    //收藏夹举报按钮
    $(".ContentItem-actions").each(function() {
        var $collect_dot = $(this).find(".Zi--Dots").closest(".Popover");
        if ($(this).find(".Zi--Report").length == 0) //未添加举报
        {
            $collect_dot.hide();
            var button_text = '<button type="button" class="Button ContentItem-action FEfUrdfMIKpQDJDqkjte Button--plain fEPKGkUK5jyc4fUuT0QP" style="color:#8590A6"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Report ZDI ZDI--FlagFill24" fill="currentColor"><path d="M12.842 4.421c-1.86-1.24-3.957-1.408-5.798-1.025-1.827.38-3.467 1.313-4.47 2.381a.75.75 0 0 0-.171.732l4.44 14.546a.75.75 0 1 0 1.434-.438l-1.08-3.542c.025-.018.053-.036.083-.054.298-.184.801-.415 1.568-.523 1.386-.197 2.307.129 3.341.543l.187.075c1.005.405 2.161.872 3.791.804 1.401-.003 2.707-.45 3.67-1.015.483-.284.903-.612 1.212-.953.284-.312.581-.752.581-1.255V5.046a.75.75 0 0 0-1.17-.622c-1.82 1.23-4.881 1.823-7.618-.003Z"></path></svg></span> 举报</button>'
            let $report = $(button_text);
            $report.bind("click", function() {
                $collect_dot.find("button").click();
                $('.Popover-content').hide();
                $(".AnswerItem-selfMenu button").click();
            });
            $collect_dot.after($report);
        }
    });
}

//按钮变色
function iconColor() {

    //引用角标高亮
    $('.ztext sup[data-draft-type=reference]').click(function() {

        $('.ReferenceList li').removeClass('is-active');
        let ref_id = $(this).find('a').attr('href');
        $(this).closest('.List-item').find(ref_id).addClass('is-active');
        $(this).closest('.ContentItem.AnswerItem').find(ref_id).addClass('is-active');
        $(this).closest('.Post-content').find(ref_id).addClass('is-active');
        $(this).closest('.TopicIntroContent').find(ref_id).addClass('is-active');
    });

    //悬停时显示浅蓝色边框
    if (Config.currentValues.hoverShadow == 1) {
        if (typeof($("html").attr("data-hover-visible")) == "undefined") {
            $("html").attr("data-hover-visible", "1");
        }
        $("html").removeAttr("data-focus-visible"); //避免快捷键变色的影响
    }

    //折叠按钮
    $(".Zi--EyeSlash").parent().parent().hover(function() {
        $(this).find(".Zi--EyeSlash").attr("fill", "#22d3c3");
        $(this).attr("style", "color:#22d3c3");
    }, function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消折叠") > -1) {
            $(this).find(".Zi--EyeSlash").attr("fill", "#22d3c3");
            $(this).attr("style", "color:#22d3c3");
        } else {
            $(this).find(".Zi--EyeSlash").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });

    //推荐按钮
    $(".Zi--Recommend").parent().parent().hover(function() {
        if (!$(this).hasClass('QuestionWaiting-types')) {
            $(this).find(".Zi--Recommend").attr("fill", "#fcd02d");
            $(this).attr("style", "color:#fcd02d");
        }
    }, function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消推荐") > -1) {
            $(this).find(".Zi--Recommend").attr("fill", "#fcd02d");
            $(this).attr("style", "color:#fcd02d");
        } else {
            $(this).find(".Zi--Recommend").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });

    $(".Zi--List").parent().parent().hover(function() {
        $(this).find(".Zi--List").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).find(".Zi--List").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    //评论按钮
    $(".Zi--Comment").parent().parent().hover(function() {
        $(this).find(".Zi--Comment").attr("fill", "#0084FF");

        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:#0084FF;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:#0084FF");

    }, function() {
        if ($(this).closest(".QuestionHeaderActions").length > 0) {
            $(this).find(".Zi--Comment").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        } else if ($(this).closest(".css-b2n9t9").length > 0) {
            $(this).find(".Zi--Comment").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        } else if ($(this).prop('lastChild').nodeValue.indexOf("收起评论") == -1) {
            $(this).find(".Zi--Comment").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });

    //评论按钮（展开评论时）
    $(".Zi--Comment").parent().parent().each(function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("收起评论") > -1) {
            $(this).find(".Zi--Comment").attr("fill", "#0084FF");
            $(this).attr("style", "color:#0084FF");
        }
    });

    $('.Zi--Catalog').closest('button').hover(function() {
        $(this).attr('style', 'color:#10dede');
    }, function() {
        $(this).attr('style', 'color:#8590a6');
    });

    //评论弹窗关闭按钮
    $(".Zi--Close").on("click", function() {
        $(".Zi--Comment").parent().parent().each(function() {
            if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("收起评论") > -1) {
                $(this).find(".Zi--Comment").attr("fill", "currentColor");
                $(this).attr("style", "color:#8590A6");
            }
        });
    });

    /*
    //私信按钮
    $(".Zi--Comments").parent().parent().hover(function () {
        $(this).find(".Zi--Comments").find("path").attr("fill", "#00FF7F");
        $(this).css({ "color": "#00FF7F" });
    }, function () {

        if ($(this).hasClass("CommentItemV2-talkBtn")) //评论区查看回复按钮变色
        {
            $(this).find(".Zi--Comments").find("path").attr("fill", "#8590a6");
            $(this).css({ "color": "#8590a6" });
        }
        else if ($(this).hasClass("CreationCard-ActionButton")) //内容管理查看评论按钮变色
        {
            $(this).css({ "color": "#8590a6" });
            //图标变色在css中实现
        }
        else if ($(".Messages-content").length == 0) //私信框消失，私信按钮变色
        {
            if ($("html").attr("data-theme") == "dark") {
                $(this).find(".Zi--Comments").find("path").attr("fill", "#8590a6");
                $(this).css({ "color": "#8590a6" });
            }
            else {
                $(this).find(".Zi--Comments").find("path").attr("fill", "rgb(68,68,68)");
                $(this).css({ "color": "rgb(68,68,68)" });
            }
        }
    });
    */

    //回复按钮
    $(".Zi--Reply").parent().parent().hover(function() {
        $(this).find(".Zi--Reply").attr("fill", "#32CD32");
        $(this).attr("style", "color:#32CD32");
    }, function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消回复") == -1) {
            $(this).find(".Zi--Reply").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });

    //回复按钮（点击后持续变色）
    $(".Zi--Reply").parent().parent().each(function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消回复") > -1) {
            $(this).find(".Zi--Reply").attr("fill", "#32CD32");
            $(this).attr("style", "color:#32CD32");
        }
    });

    //回复按钮（点击后持续变色）
    $('.css-1o56bgb').click(function() {
        if ($(this).closest('.css-14nvvry').find('.css-fw5oj4').length == 0) {
            $(this).attr('style', 'color:#32CD32');
        } else {
            $(this).removeAttr('style');
        }
    })

    //点赞按钮
    $(".Zi--Like:not(.css-4ky835)").parent().parent().hover(function() {
        if (window.location.href.indexOf("search") > -1) {
            if ($(this).hasClass("SearchTopicReview-Icon--like") || $(this).hasClass("SearchTopicReview-Icon--liked")) {
                $(this).find(".Zi--Like").find("path").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            } else {
                $(this).find(".Zi--Like").find("path").attr("fill", "black");
                $(this).attr("style", "color:black;");
            }
        } else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            $(this).find(".Zi--Like").attr("fill", "#FF4D82");
            //$(this).attr("style", "color:#FF4D82;");
        } else if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("踩") > -1 || $(this).attr("data-tooltip") == "不推荐") {
            if ($("html").attr("data-theme") == "dark") {
                $(this).find(".Zi--Like").attr("fill", "white");
                $(this).css("color", "white");
            } else {
                $(this).find(".Zi--Like").attr("fill", "black");
                $(this).css("color", "black");
            }
        } else if ($(this).hasClass('css-8mg22s')) {
            $(this).find(".Zi--Like").attr("fill", "#FF4D82");
            $(this).attr("style", "color:#FF4D82;");
        } else {
            $(this).find(".Zi--Like").attr("fill", "#FF4D82");
            $(this).attr("style", "color:#FF4D82;margin:0px;");
        }
    }, function() {
        if ($(this).find("#topic-recommend").length > 0 || $(this).find("#topic-against").length > 0 || $(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消踩") == -1)
            $(this).find(".Zi--Like").attr("fill", "currentColor");

        if (window.location.href.indexOf("search") > -1) {
            $(this).find(".Zi--Like").find("path").attr("fill", "#8590A6");
            $(this).attr("style", "color:#8590A6;");
        } else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            $(this).attr("style", "color:#646464;");
        } else if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("取消踩") > -1) {
            $(this).attr("style", "color:black;");
        } else if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue.indexOf("踩") > -1 || $(this).attr("data-tooltip") == "不推荐") {
            $(this).attr("style", "color:#8590A6;");
        } else if ($(this).hasClass('css-8mg22s')) {
            $(this).find(".Zi--Like").attr("fill", "#8590A6");
            $(this).attr("style", "color:#8590A6;");
        } else
            $(this).attr("style", "color:#8590A6; margin:0px;");
    });

    //踩按钮（点击后持续变色）
    $(".Zi--Like").parent().parent().each(function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "取消踩")
            $(this).find(".Zi--Like").attr("fill", "black");

        if (window.location.href.indexOf("search") > -1) {
            if ($(this).hasClass("SearchTopicReview-Icon--liked")) {
                $(this).find(".Zi--Like").find("path").attr("fill", "#FF4D82");
                $(this).attr("style", "color:#FF4D82;");
            }
        } else if (window.location.href.indexOf("people") > -1 || window.location.href.indexOf("org") > -1) {
            if ($(this).hasClass("css-zkfaav") || $(this).hasClass("is-liked")) {
                $(this).find(".Zi--Like").attr("fill", "#FF4D82");
                //$(this).attr("style", "color:#FF4D82;");
            }
        }
    });

    //评论区点赞按钮
    $(".ZDI--ThumbFill24").parent().parent().hover(function() {
        $(this).find(".Zi--Like").attr("fill", "#FF4D82");
        $(this).attr("style", "color:#FF4D82;");
    }, function() {
        if ($(this).hasClass("css-h1yvwn")) {
            $(this).find(".Zi--Like").attr("fill", "#8590A6");
            $(this).attr("style", "color:#8590A6;");
        }
    });

    $(".GoodQuestionAction-highLightBtn").attr("style", "color:#FF4D82;margin:0px;"); //题目点赞后保持变色
    $(".is-liked").attr("style", "color:#FF4D82;margin:0px;"); //评论点赞后保持变色

    //分享按钮
    $(".Zi--Share").parent().parent().parent().hover(function() {
        $(this).find(".Zi--Share").attr("fill", "blue");

        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).find("button").attr("style", "color:blue;margin: 0px 0px 0px 9px;");
        else if ($(this).find(".Post-SideActions-icon").length > 0)
            $(this).attr("style", "color:blue;");
        else
            $(this).find("button").attr("style", "color:blue;");

    }, function() {
        $(this).find(".Zi--Share").attr("fill", "currentColor");

        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).find("button").attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        else if ($(this).find(".Post-SideActions-icon").length > 0)
            $(this).attr("style", "color:#8590A6;");
        else
            $(this).find("button").attr("style", "color:#8590A6;");
    });

    //收藏按钮
    $(".Zi--Star").parent().parent().hover(function() {
        if (!$(this).hasClass("ExploreHomePage-ContentSection") && !$(this).hasClass("css-18biwo") && !$(this).hasClass("css-g9eqf4-StrutAlign")) {
            $(this).find(".Zi--Star").attr("fill", "orange");
            $(this).attr("style", "color:orange");
        }
    }, function() {
        if (!$(this).hasClass("ExploreHomePage-ContentSection") && !$(this).hasClass("css-18biwo") && !$(this).hasClass("css-g9eqf4-StrutAlign")) {
            $(this).find(".Zi--Star").attr("fill", "currentColor");
            $(this).attr("style", "color:#8590A6");
        }
    });

    //喜欢按钮
    $(".Zi--Heart").parent().parent().hover(function() {
        if (!$(this).hasClass('AppHeaderProfileMenu') && !$(this).hasClass('MobileAppHeader-actions')) {
            $(this).find(".Zi--Heart").attr("fill", "red");
            $(this).attr("style", "color:red");
        }
    }, function() {
        if ($(this).prop('lastChild').nodeValue == "喜欢")
            $(this).find(".Zi--Heart").attr("fill", "currentColor");

        $(this).attr("style", "color:#8590A6");
    });

    //喜欢按钮（点击后持续变色）
    $(".Zi--Heart").parent().parent().each(function() {
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "取消喜欢")
            $(this).prop('lastChild').nodeValue = "已喜欢";
        if ($(this).prop('lastChild').nodeValue != null && $(this).prop('lastChild').nodeValue == "已喜欢") {
            $(this).find(".Zi--Heart").attr("fill", "red");
            $(this).attr("style", "color:red");
        }
    });

    //喜欢按钮
    $(".Like-likeWrapper-ejWmr").hover(function() {
        $(this).find('svg path').attr("style", 'fill:red');
        $(this).find('span').attr("style", 'color:red');
        $(this).addClass('hover');
    }, function() {
        if ($(this).find('span').text().indexOf('已喜欢') > -1 || $(this).find('span').text().indexOf('取消喜欢') > -1) {
            $(this).find('svg path').attr("style", 'fill:red');
            $(this).find('span').attr("style", 'color:red');
        } else {
            $(this).find('svg path').attr("style", 'fill:#8590A6');
            $(this).find('span').attr("style", 'color:#8590A6');
        }

        $(this).removeClass('hover');
    });

    //喜欢按钮（点击后持续变色）
    $(".Like-likeWrapper-ejWmr").each(function() {
        if ($(this).find('span').text().indexOf('取消喜欢') > -1)
            $(this).find('span').text("已喜欢");
        if ($(this).find('span').text().indexOf('已喜欢') > -1) {
            $(this).find('svg path').attr("style", 'fill:red');
            $(this).find('span').attr("style", 'color:red');
        } else {
            if (!$(this).hasClass('hover')) {
                $(this).find('svg path').attr("style", 'fill:#8590A6');
                $(this).find('span').attr("style", 'color:#8590A6');
            }
        }
    });

    //举报按钮
    $(".Zi--Report").parent().parent().hover(function() {
        $(this).find(".Zi--Report").attr("fill", "brown");

        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:brown;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:brown");

    }, function() {
        $(this).find(".Zi--Report").attr("fill", "currentColor");

        if ($(this).closest(".QuestionHeaderActions").length > 0)
            $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
        else
            $(this).attr("style", "color:#8590A6");
    });

    //评论区举报按钮
    $(".ZDI--FlagFill24").parent().parent().hover(function() {
        $(this).attr("style", "color:brown");
    }, function() {
        $(this).attr("style", "color:#8590A6");
    });

    /*
    $(".Zi--Bell").parent().parent().hover(function () {
        $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
    }, function () {
        if ($(".PushNotifications-content").length == 0) //没有通知框，恢复原色
        {
            if ($("html").attr("data-theme") == "light") //日间模式
            {
                $(this).find(".Zi--Bell path").attr("fill", "rgb(68,68,68)");
            }
            else //夜间模式
            {
                $(this).find(".Zi--Bell path").attr("fill", "#8590A6");
            }
        }
        else //有通知框，持续变色
        {
            $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
        }
    });

    $(".Zi--Bell").parent().parent().on("click", function () {
        if ($(".PushNotifications-content").length == 0) {
            $(this).find(".Zi--Bell path").attr("fill", "#FACB62");
        }
        else {
            $(this).find(".Zi--Bell path").attr("fill", "currentColor");
        }
    });
*/

    $(".Zi--Heart.PushNotifications-tabIcon").parent().parent().hover(function() {
        $(this).find(".Zi--Heart").attr("fill", "#0084FF");
    }, function() {
        $(this).find(".Zi--Heart").attr("fill", "currentColor");
    });

    $(".Zi--Users").parent().parent().hover(function() {
        $(this).find(".Zi--Users").attr("fill", "#0084FF");
    }, function() {
        $(this).find(".Zi--Users").attr("fill", "currentColor");
    });

    /*
    //匿名按钮
    $(".Zi--Anonymous").parent().parent().hover(function() {
        if ($("html").attr("data-theme") == "dark") {
            $(this).find(".Zi--Anonymous").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3;margin: 0px 0px 0px 9px;");
        } else {
            $(this).find(".Zi--Anonymous").attr("fill", "black");
            $(this).attr("style", "color:black;margin: 0px 0px 0px 9px;");
        }
    }, function() {
        $(this).find(".Zi--Anonymous").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });
    */

    //查看问题日志按钮
    $(".Zi--Log").parent().parent().hover(function() {
        $(this).find(".Zi--Log").attr("fill", "purple");
        $(this).parent().attr("style", "color:purple;margin: 0px 0px 0px 9px;");
    }, function() {
        $(this).find(".Zi--Log").attr("fill", "currentColor");
        $(this).parent().attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });

    //快捷键按钮
    $(".Zi--ShortCut").parent().parent().hover(function() {
        $(this).find(".Zi--ShortCut").attr("fill", "#44B8A1");
        $(this).attr("style", "color:#44B8A1;margin: 0px 0px 0px 9px;");
    }, function() {
        $(this).find(".Zi--ShortCut").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 0px 0px 9px;");
    });

    //邀请回答按钮
    $(".Zi--Invite").parent().parent().hover(function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Invite").attr("fill", "black");
            $(this).attr("style", "color:black;margin: 0px 8px 0px 0px;");
        } else {
            $(this).find(".Zi--Invite").attr("fill", "white");
            $(this).attr("style", "color:white;margin: 0px 8px 0px 0px;");
        }
    }, function() {
        $(this).find(".Zi--Invite").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6;margin: 0px 8px 0px 0px;");
    });

    //删除草稿按钮
    $(".Zi--Trash").parent().parent().hover(function() {
        $(this).find(".Zi--Trash").attr("fill", "#C70000");
        $(this).attr("style", "color:#C70000");
    }, function() {
        $(this).find(".Zi--Trash").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".SelfCollectionItem-actions .Zi--EditSurround").parent().parent().hover(function() {
        $(this).find(".Zi--EditSurround").attr("fill", "orange");
        $(this).attr("style", "color:orange");
    }, function() {
        $(this).find(".Zi--EditSurround").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".CollectionDetailPageHeader-actions .Zi--EditSurround").parent().parent().hover(function() {
        $(this).find(".Zi--EditSurround").attr("fill", "orange");
        $(this).attr("style", "color:orange");
    }, function() {
        $(this).find(".Zi--EditSurround").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".Zi--Emotion").parent().parent().hover(function() {
        $(this).find(".Zi--Emotion").find("path").attr("fill", "#0084FF");
    }, function() {
        $(this).find(".Zi--Emotion").find("path").removeAttr("fill");
    });

    $(".Zi--AddImage").parent().parent().hover(function() {
        $(this).find(".Zi--AddImage").find("path").attr("fill", "#0084FF");
    }, function() {
        $(this).find(".Zi--AddImage").find("path").removeAttr("fill");
    });

    $(".Zi--InsertImage").find("path").attr("fill", "blue");
    $(".Zi--Image").find("path").attr("fill", "blue");

    $(".Zi--InsertVideo, .Zi--FormatClear").find("path").attr("fill", "red");

    $(".Zi--InsertFormula").find("path").attr("fill", "rgb(115,216,244)");

    $(".Zi--InsertLink").find("path").attr("fill", "#0084FF");

    $(".Zi--Folder").find("path").attr("fill", "#FF8C00");

    $(".Zi--EditCircle").find("path").attr("fill", "#82480E");

    $(".Zi--Juror").find("path").attr("fill", "brown");

    $(".Zi--Marked").find("path").attr("fill", "blue");

    $(".ZDI--AgreeFill24").find("path").attr("fill", "#FB7299");

    if ($("html").attr("data-theme") == "light") {
        $(".MathToolbar-button svg").attr("fill", "black");
        $(".MathToolbar-paletteIcon").css("color", "black");
    } else {
        $(".MathToolbar-button svg").attr("fill", "#d3d3d3");
        $(".MathToolbar-paletteIcon").css("color", "#d3d3d3");
    }

    $(".AnswerAdd-topicBiosButton").attr("style", "color:#0084FF");
    $(".AnswerAdd-topicBiosButton .Zi--Edit").attr("fill", "#0084FF");

    //内容管理-编辑按钮
    $(".CreationCard-ActionButton .Zi--Edit").closest('.CreationCard-ActionButton').hover(function() {
        $(this).find(".Zi--Trash").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).find(".Zi--Trash").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    //内容管理-数据按钮
    $(".css-5i9hgn .Zi--Statistics").closest('a').hover(function() {
        $(this).find(".Zi--Statistics").attr("fill", "#8763f2");
        $(this).attr("style", "color:#8763f2");
    }, function() {
        $(this).find(".Zi--Statistics").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    //内容管理-更多按钮的具体菜单项
    $('.Button.Menu-item.css-cn5m5x').each(function() {
        if ($(this).find('.Zi--Check').length > 0) {
            if ($('html').attr('data-theme') == 'light') {
                $(this).attr("style", "color:black; background:#f6f6f6");
            } else {
                $(this).attr("style", "color:#d3d3d3; background:#1b1b1b");
            }
        }
    })

    $(".Zi--Document").parent().parent().hover(function() {
        $(this).find(".Zi--Document").find("path").attr("fill", "#FF8C00");
        $(this).attr("style", "color:#FF8C00");
    }, function() {
        $(this).find(".Zi--Document").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });


    $(".Zi--Time").parent().hover(function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".Zi--Time").find("path").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".Zi--Time").find("path").attr("fill", "white");
            $(this).attr("style", "color:white");
        }
    }, function() {
        $(this).find(".Zi--Time").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });

    $(".Zi--Deliver").parent().parent().hover(function() {
        if ($(this).hasClass('css-1uan5v7')) //专栏列表上方的"推荐文章"按钮
        {
            $('.css-119896g').hover(function() {
                $(this).find(".Zi--Deliver").find("path").attr("fill", "#02E6B8");
                $(this).attr("style", "color:#02E6B8");
            }, function() {
                $(this).find(".Zi--Deliver").find("path").removeAttr("fill");
                $(this).attr("style", "color:#8590A6");
            })
        } else //专栏文章下方的"申请转载"按钮
        {
            $(this).find(".Zi--Deliver").find("path").attr("fill", "#02E6B8");
            $(this).attr("style", "color:#02E6B8");
        }
    }, function() {
        if (!$(this).hasClass('css-1uan5v7')) //专栏文章下方的"申请转载"按钮
        {
            $(this).find(".Zi--Deliver").find("path").removeAttr("fill");
            $(this).attr("style", "color:#8590A6");
        }
    });

    $(".Zi--FullscreenEnter").parent().parent().hover(function() {
        $(this).find(".Zi--FullscreenEnter").find("path").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).find(".Zi--FullscreenEnter").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });

    $(".Zi--FullscreenExit").parent().parent().hover(function() {
        $(this).find(".Zi--FullscreenExit").find("path").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).find(".Zi--FullscreenExit").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });

    $(".AnswerForm-exitFullscreenButton").hover(function() {
        $(this).find(".AnswerForm-exitFullscreenButton").find("path").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).find(".AnswerForm-exitFullscreenButton").find("path").removeAttr("fill");
        $(this).attr("style", "color:#8590A6");
    });

    $(".Notifications-footer .Zi--Settings").parent().parent().hover(function() {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function() {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".Post-ActionMenuButton .Zi--Settings").parent().parent().hover(function() {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function() {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".TopicActions .Zi--Settings").parent().parent().hover(function() {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function() {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    $(".ContentItem-action .Zi--Settings, .AnswerForm-footerRight .Zi--Settings").parent().parent().hover(function() {
        $(this).find(".Zi--Settings").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function() {
        $(this).find(".Zi--Settings").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });
    /*
    //无障碍按钮
    $('.AppHeaderProfileMenu .ZDI--HeartFill16').parent().hover(function() {
        $(this).find(".ZDI--HeartFill16").attr("fill", "#ff7d7d");
        $(this).attr("style", "color:#ff7d7d");
    }, function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".ZDI--HeartFill16").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".ZDI--HeartFill16").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });

    //设置按钮
    $(".AppHeaderProfileMenu .ZDI--GearFill24").parent().hover(function() {
        $(this).find(".ZDI--GearFill24").attr("fill", "purple");
        $(this).attr("style", "color:purple");
    }, function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".ZDI--GearFill24").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".ZDI--GearFill24").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });

    //退出按钮
    $(".AppHeaderProfileMenu .ZDI--PowerFill24").parent().hover(function() {
        $(this).find(".ZDI--PowerFill24").attr("fill", "red");
        $(this).attr("style", "color:red");
    }, function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".ZDI--PowerFill24").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".ZDI--PowerFill24").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });

    //我的主页按钮
    $(".AppHeaderProfileMenu .ZDI--UserFill24").parent().hover(function() {
        $(this).find(".ZDI--UserFill24").attr("fill", "#08a500");
        $(this).attr("style", "color:#08a500");
    }, function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".ZDI--UserFill24").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".ZDI--UserFill24").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });

    //关怀版按钮
    $(".AppHeaderProfileMenu .ZDI--ElderFill16").parent().hover(function() {
        $(this).find(".ZDI--ElderFill16").attr("fill", "#0084FF");
        $(this).attr("style", "color:#0084FF");
    }, function() {
        if ($("html").attr("data-theme") == "light") {
            $(this).find(".ZDI--ElderFill16").attr("fill", "black");
            $(this).attr("style", "color:black");
        } else {
            $(this).find(".ZDI--ElderFill16").attr("fill", "#d3d3d3");
            $(this).attr("style", "color:#d3d3d3");
        }
    });
*/
    $('.ZDI--UserFill24').closest('.AppHeaderProfileMenu-item').addClass('UserFill24');
    $('.ZDI--ClockFill24').closest('.AppHeaderProfileMenu-item').addClass('ClockFill24');
    $('.ZDI--HeartFill16').closest('.AppHeaderProfileMenu-item').addClass('HeartFill16');
    $('.ZDI--ElderFill16').closest('.AppHeaderProfileMenu-item').addClass('ElderFill16');
    $('.ZDI--GearFill24').closest('.AppHeaderProfileMenu-item').addClass('GearFill24');
    $('.ZDI--PowerFill24').closest('.AppHeaderProfileMenu-item').addClass('PowerFill24');

    $(".CommentMoreReplyButton .Button").hover(function() {
        $(this).attr("style", "color:#00FF7F");
    }, function() {
        $(this).attr("style", "color:#8590A6");
    });

    $(".CommentCollapseButton").hover(function() {
        $(this).find("Zi--ArrowUp").attr("fill", "#0084FF");
        $(this).css({
            "color": "#0084FF"
        });

    }, function() {
        $(this).find("Zi--ArrowUp").attr("fill", "currentColor");
        $(this).css({
            "color": "#8590A6"
        });

    });

    //点击评论列表右下角出现的"收起评论"时，将评论按钮恢复灰色
    $(".CommentCollapseButton").on("click", function() {
        let $t = $(this).closest(".Comments-container").prev().find(".Zi--Comment").parent().parent();
        $t.find(".Zi--Comment").attr("fill", "currentColor");
        $t.attr("style", "color:#8590A6");
    });

    $(".ContentItem-time:not(.css-18wtfyc)").each(function() {
        $(this).find("a").attr("style", "border-bottom: 1px solid rgba(133,144,166,.72)");
    });

    $(".Button.ContentItem-action.ContentItem-rightButton.Button--plain").attr("style", "color:#175199");
    $(".QuestionRichText-more").attr("style", "color:#0084FF");
    $(".QuestionHeader-actions .Button").attr("style", "color:#0084FF");

    $(".Zi--Switch").attr("fill", "#0084FF");
    $(".Zi--Switch").parent().parent().css("color", "#0084FF");

    $(".Zi--Select").attr("fill", "#0084FF");
    $(".Zi--Select").parent().css("color", "#0084FF");

    $(".Zi--Dots").hover(function() {
        $(this).find("path").attr("fill", "#0084FF");
    }, function() {
        $(this).find("path").attr("fill", "#8590A6");
    });

    $(".Zi--FormatCode").find("path").attr("fill", "#0084FF");

    $(".List-headerText").css("top", "-5px");

    $(".Post-ActionMenu .Button.Menu-item.Button--plain .Zi--Check").each(function() {
        $(this).parent().parent().parent().addClass('is-active');
    });


    $(".AnswerItem-selectMenuItem .Zi--Check, .CommentPermission-item .Zi--Check").each(function() {
        $(this).parent().parent().parent().addClass('is-active');
    });

    /*
    $(".AnswerItem-selectMenuItem").hover(function () {
        if ($("html").attr("data-theme") == "dark")
            $(this).attr("style", "color:#d3d3d3");
        else
            $(this).attr("style", "color:black");
    }, function () {
        if ($(this).find(".Zi--Check").length == 0)
            $(this).attr("style", "color:#8590A6");
    });

    $(".CommentPermission-item").hover(function () {
        if ($("html").attr("data-theme") == "dark")
            $(this).attr("style", "color:#d3d3d3");
        else
            $(this).attr("style", "color:black");
    }, function () {
        if ($(this).find(".Zi--Check").length == 0)
            $(this).attr("style", "color:#8590A6");
    });
*/

    /*
    $(".AnswerAdd-toggleAnonymous").hover(function() {
        $(this).attr("style", "color:#0084FF");
    }, function() {
        $(this).attr("style", "color:#8590A6");
    });
    */

    $(".DisclaimerEntry").hover(function() {
        if ($("html").attr("data-theme") == "dark") {
            $(this).find("path").attr("fill", "#d3d3d3");
            $(this).find("button").attr("style", "color:#d3d3d3");
        } else {
            $(this).find("path").attr("fill", "black");
            $(this).find("button").attr("style", "color:black");
        }
    }, function() {
        $(this).find("path").attr("fill", "currentColor");
        $(this).find("button").attr("style", "color:#8590A6");
    });

    $(".ImageView.CommentRichText-ImageView.is-active").css({
        "z-index": "1000"
    });

    if ($(".css-70qvj9 .Zi--CheckboxOn").length > 0)
        $(".css-70qvj9 .css-1d83bu8").attr("style", "color:#0084FF");
    if ($(".css-70qvj9 .Zi--CheckboxOff").length > 0)
        $(".css-70qvj9 .css-1d83bu8").attr("style", "color:#8590A6");

    if ($.cookie('nightmode') == undefined)
        $.cookie('nightmode', 0, {
            expires: 365,
            path: "/",
            domain: "zhihu.com"
        });

    var $nightmode = $('<div><button id=\"nightmode\" class="nightmode" style=\"margin-left:15px; margin-top:6px; user-select:none; -webkit-user-select:none; width:100px\">' +
                       '<img style=\"vertical-align:middle; width:18px; height:18px; user-select:none; -webkit-user-select:none; \" src=\"' + dark + '\">' +
                       '<span style=\"vertical-align:middle; user-select:none; -webkit-user-select:none; \" > 夜间模式</span></button></div>');


    $nightmode.click(function() {
        if ($("html").attr("data-theme") == "light") {
            $("html").attr("data-theme", "dark");
            $(this).find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
            $(this).find("span").text(" 日间模式");
            $.cookie('nightmode', 1, {
                expires: 365,
                path: "/",
                domain: "zhihu.com"
            });
        } else {
            $("html").attr("data-theme", "light");
            $(this).find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
            $(this).find("span").text(" 夜间模式");
            $.cookie('nightmode', 0, {
                expires: 365,
                path: "/",
                domain: "zhihu.com"
            });
        }
    });

    if ($("#nightmode").length == 0) {
        $(".SearchBar").after($nightmode);

        var $nightmode_question_log = $('<button id=\"nightmode\" class="nightmode" style=\"background:transparent; user-select: none; border:none; margin-top:11px; color:#eee; cursor:pointer; width:80px\">' +
                                        '<img style=\"vertical-align:middle; width:18px; height:18px; user-select:none; -webkit-user-select:none; \" src=\"' + dark + '\">' +
                                        '<span style=\"vertical-align:middle; user-select:none; -webkit-user-select:none; \" > 夜间模式</span></button>');

        $nightmode_question_log.hover(function() {
            $(this).find('span').css('color', 'white');
        }, function() {
            $(this).find('span').css('color', '#eee');
        });

        $("#zu-top-add-question").before($nightmode_question_log); //问题日志

        $nightmode_question_log.click(function() {
            if ($("html").attr("data-theme") == "light") {
                $("html").attr("data-theme", "dark");
                $(this).find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
                $(this).find("span").text(" 日间模式");
                $.cookie('nightmode', 1, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            } else {
                $("html").attr("data-theme", "light");
                $(this).find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
                $(this).find("span").text(" 夜间模式");
                $.cookie('nightmode', 0, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            }
        });


        var $nightmode_vip = $('<button id=\"nightmode\" class="nightmode" style=\"background:transparent; user-select: none; border:none; margin-left:15px; margin-top:15px; color:#eee; cursor:pointer; width:100px\">' +
                               '<img style=\"vertical-align:middle; width:18px; height:18px; user-select:none; -webkit-user-select:none; \" src=\"' + dark + '\">' +
                               '<span style=\"vertical-align:middle; user-select:none; -webkit-user-select:none; font-size:15px;\" > 夜间模式</span></button>');

        $nightmode_vip.hover(function() {
            $(this).find('span').css('color', 'white');
        }, function() {
            $(this).find('span').css('color', '#eee');
        });

        $(".TopNavBar-root-f2drS .TopNavBar-searchBar-uo31N").after($nightmode_vip);

        $nightmode_vip.click(function() {
            if ($("html").attr("data-theme") == "light") {
                $("html").attr("data-theme", "dark");
                $(this).find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
                $(this).find("span").text(" 日间模式");
                $.cookie('nightmode', 1, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            } else {
                $("html").attr("data-theme", "light");
                $(this).find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
                $(this).find("span").text(" 夜间模式");
                $.cookie('nightmode', 0, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            }
        });

        var $nightmode_zhuanlan = $nightmode.clone(true);
        $nightmode_zhuanlan.find('button').css({
            "margin": "0px 50px 0px 0px"
        });



        $(".ColumnPageHeader-Button").before($nightmode_zhuanlan); //专栏文章

        $(".ColumnPageHeader-WriteButton").before($nightmode_zhuanlan); //专栏文章
        $(".PublishPanel-wrapper").before($nightmode_zhuanlan); //写文章
    }

    if ($(".TopNavBar-root-f2drS.TopNavBar-fixMode-4nQmh").length > 0 && $(".TopNavBar-root-f2drS.TopNavBar-fixMode-4nQmh #nightmode").length == 0) //VIP页固定悬浮导航栏
    {
        var $nightmode_vip2 = $('<div><button id=\"nightmode\" class="nightmode" style=\"margin-left:15px; margin-top:15px; user-select:none; -webkit-user-select:none; width:100px; padding: 0;cursor: pointer;background: none;border: none;outline: none;-webkit-appearance: none;-moz-appearance: none;appearance: none;\">' +
                                '<img style=\"vertical-align:middle; width:18px; height:18px; user-select:none; -webkit-user-select:none; \" src=\"' + dark + '\">' +
                                '<span style=\"vertical-align:middle; user-select:none; -webkit-user-select:none; font-size:15px;\" > 夜间模式</span></button></div>');

        $(".TopNavBar-root-f2drS.TopNavBar-fixMode-4nQmh .TopNavBar-userInfo-bqiw4").before($nightmode_vip2);


        $nightmode_vip2.click(function() {
            if ($("html").attr("data-theme") == "light") {
                $("html").attr("data-theme", "dark");
                $(this).find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
                $(this).find("span").text(" 日间模式");
                $.cookie('nightmode', 1, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            } else {
                $("html").attr("data-theme", "light");
                $(this).find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
                $(this).find("span").text(" 夜间模式");
                $.cookie('nightmode', 0, {
                    expires: 365,
                    path: "/",
                    domain: "zhihu.com"
                });
            }
        });
    }

    if(Config.currentValues.prefersColorScheme == 1)
    {
        const is_sys_darkmode = Number(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        if(is_sys_darkmode != $.cookie('nightmode'))
            $.cookie('nightmode', is_sys_darkmode, {
                expires: 365,
                path: "/",
                domain: "zhihu.com"
            })
    }

    if ($.cookie('nightmode') == 1) {
        $("html").attr("data-theme", "dark");
        $(".nightmode").find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
        $(".nightmode").each(function() {
            if ($(this).find("span").text().indexOf(" 日间模式") == -1)
                $(this).find("span").text(" 日间模式");
        });
    } else {
        $("html").attr("data-theme", "light");
        $(".nightmode").find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
        $(".nightmode").each(function() {
            if ($(this).find("span").text().indexOf(" 夜间模式") == -1)
                $(this).find("span").text(" 夜间模式");
        });
    }

    //自动展开楼中楼评论
    $('.css-7dh30y').each(function() {
        if ($(this).text().indexOf('展开') > -1) {
            $(this).click();
        }
    })

    $(".css-6f4i93").hide();
}

let index_addstyle = 0;

function index() {
    if (index_addstyle == 0) {
        GM_addStyle(`.ContentItem-action {margin-left: 16px;}
        .App-main .Topstory div[style="opacity: 1;"]{display:none!important}
        .App-main .Topstory div[style="height: 180px;"]{display:none!important}
        `);
        index_addstyle = 1;
    }

    setInterval(function() {

        if(Config.currentValues.hideFeedSource==1)
        {
            if(window.location.href.indexOf('/follow')>-1)
            {
                $('.TopstoryItem').each(function(){
                    let FeedSource=$(this).find('.FeedSource-firstline').text()
                    if(FeedSource.indexOf('赞同')>-1 || FeedSource.indexOf('收藏')>-1)
                    {
                        $(this).hide();
                    }
                });
            }
        }

        if ($('header.AppHeader').length > 0) {
            if (!$('header.AppHeader').hasClass('css-1x8hcdw'))
                $('header.AppHeader').addClass('css-1x8hcdw');
            let arr1 = $('header.AppHeader').attr('class').split(' ');
            let arr2 = "Sticky AppHeader is-hidden is-fixed css-1x8hcdw".split(' ');
            let arr = arr1.filter(x => arr2.includes(x)); //交集
            $('header.AppHeader').attr('class', arr.join(' '));
        }

        if ($('.SearchBar-input').length > 0) {
            if (!$('.SearchBar-input').hasClass('css-11bw1mm'))
                $('.SearchBar-input').addClass('css-11bw1mm');
            let arr1 = $('.SearchBar-input').attr('class').split(' ');
            let arr2 = "SearchBar-input SearchBar-input--focus css-11bw1mm Input-wrapper QZcfWkCJoarhIYxlM_sG Input-wrapper--grey is-focus evPjxqnqXpIBzSRrcIDv".split(' ');
            let arr = arr1.filter(x => arr2.includes(x)); //交集
            $('.SearchBar-input').attr('class', arr.join(' '));
        }

        if ($('.SearchBar-searchIcon').length > 0) {
            if (!$('.SearchBar-searchIcon').hasClass('css-1dlt5yv'))
                $('.SearchBar-searchIcon').addClass('css-1dlt5yv');
            let arr1 = $('.SearchBar-searchIcon').attr('class').split(' ');
            let arr2 = "Zi Zi--Search SearchBar-searchIcon css-1dlt5yv".split(' ');
            let arr = arr1.filter(x => arr2.includes(x)); //交集
            $('.SearchBar-searchIcon').attr('class', arr.join(' '));
        }

        if ($('.SearchBar-askButton').length > 0) {
            $('.SearchBar-askButton').removeClass('css-47os02');
        }

        if (!$('.Tabs-link.AppHeader-TabsLink').hasClass('css-1f6tgea')) {
            $('.Tabs-link.AppHeader-TabsLink').removeClass('css-11e2zdz').addClass('css-1f6tgea');
        }
        if ($('.AppHeader-inner .css-1hlrcxk').attr('fill') != '#0066FF') {
            $('.AppHeader-inner .css-1hlrcxk').attr('fill', '#0066FF');
        }
        if (!$('.SearchBar-input').hasClass('css-11bw1mm')) {
            $('.SearchBar-input').removeClass('css-v1juu7').addClass('css-11bw1mm');
        }
        if (!$('.SearchBar-searchIcon').hasClass('css-1dlt5yv')) {
            $('.SearchBar-searchIcon').removeClass('css-1mo564z').addClass('css-1dlt5yv');
        }
        if (!$('.SearchBar-askButton').hasClass('css-3q84jd')) {
            $('.SearchBar-askButton').removeClass('css-146z333').removeClass('css-rf6mh0').addClass('css-3q84jd');
        }
        if (!$('.AppHeader-userInfo .Zi').hasClass('css-7dgah8')) {
            $('.AppHeader-userInfo .Zi').removeClass('css-1iyiq0j').addClass('css-7dgah8');
        }
    }, 100);

    setTimeout(function() {
        $('.ContentItem.ZVideoItem').closest('.TopstoryItem').hide(); //隐藏视频信息流
        $('.VideoAnswerPlayer').closest('.TopstoryItem').hide(); //隐藏视频回答
        $('.ContentItem.EduSectionItem').closest('.TopstoryItem').hide(); //隐藏视频信息流
        $('.ContentItem.ZVideoItem').remove();
        $('.VideoAnswerPlayer').remove();
        $('.ContentItem.EduSectionItem').remove();
    }, 500);

    if (Config.currentValues.hideIndexSidebar == 1) {
        $('#TopstoryContent .css-cazg48').removeClass('css-cazg48').addClass('css-1tane06');
        $('#TopstoryContent .css-yhjwoe').css('padding', '16px 52px');
    }

    $(".Zi--Hot").find("path").css({
        "fill": "red"
    });

    $(".Zi--Share").closest(".Button").hover(function() {
        $(this).find("path").css({
            "fill": "blue"
        });
        $(this).css({
            "color": "blue"
        });
    }, function() {
        $(this).find("path").css({
            "fill": "#8590A6"
        });
        $(this).css({
            "color": "#8590A6"
        });
    });

    $(".TopstoryItem").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".ContentItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                } else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }

    });

    $(".Card.GlobalSideBar-category>a").hide();

    $('.LoadingBar').removeClass('is-active');

    $(".Zi--Disinterested").parent().parent().hover(function() {
        $(this).find(".Zi--Disinterested").attr("fill", "rgb(252,96,123)");
        $(this).attr("style", "color:rgb(252,96,123)");
    }, function() {
        $(this).find(".Zi--Disinterested").attr("fill", "currentColor");
        $(this).attr("style", "color:#8590A6");
    });

    //首页隐藏侧边栏
    if (Config.currentValues.hideIndexSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        //$(".Topstory-mainColumn").width($(".Topstory-container").width());
        $(".Topstory-mainColumn").width("1000px");
    } else if (Config.currentValues.hideIndexSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        $(".Topstory-container").attr("style", "display:flex;justify-content:center;");
    }

    //首页回答举报按钮、不感兴趣按钮
    $(".ContentItem-actions").each(function() {

        if (window.location.href.indexOf('/follow') == -1 && $(this).find(".Zi--Disinterested").length == 0 && $(this).find(".Zi--Settings").length == 0) //未添加不感兴趣 且 不是自己的回答
        {
            let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
            $question_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Disinterested\" fill=\"currentColor\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3931\" width=\"14\" height=\"14\"><path d=\"M512 32C251.4285715625 32 32 251.4285715625 32 512s219.4285715625 480 480 480 480-219.4285715625 480-480-219.4285715625-480-480-480z m205.7142853125 617.142856875c20.5714284375 20.5714284375 20.5714284375 48 0 61.714286249999994-20.5714284375 20.5714284375-48 20.5714284375-61.714285312499996 0l-137.142856875-137.1428578125L374.857143125 717.7142853125c-20.5714284375 20.5714284375-48 20.5714284375-68.5714284375 0s-20.5714284375-54.857143125 0-68.5714284375l144-144-137.1428578125-137.142856875c-20.5714284375-13.714285312500001-20.5714284375-41.142856875 0-61.714285312499996 20.5714284375-20.5714284375 48-20.5714284375 61.714286249999994 0l137.142856875 137.142856875 144-144c20.5714284375-20.5714284375 48-20.5714284375 68.5714284375 0 20.5714284375 20.5714284375 20.5714284375 48 0 68.5714284375L580.5714284375 512l137.142856875 137.142856875z\"  p-id=\"3932\"></path></svg></span> 不感兴趣</button>';
            let $disinterested = $(button_text);
            $disinterested.bind("click", function() {

                let $disinterestedBtn = $(this);
                let buttonPos = $disinterestedBtn.offset();
                let buttonWidth = $disinterestedBtn.outerWidth();

                // 创建一个观察器来监听DOM变化
                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // 元素节点
                                    if ($(node).hasClass('Popover-content') ||
                                        $(node).find('.Popover-content').length) {

                                        let $popover = $(node).hasClass('Popover-content') ?
                                            $(node) : $(node).find('.Popover-content');

                                        // 立即计算并设置位置
                                        let popoverWidth = $popover.outerWidth();
                                        let left = buttonPos.left + (buttonWidth / 2) - (popoverWidth / 2);
                                        let top = buttonPos.top + $disinterestedBtn.outerHeight();

                                        // 在元素插入DOM后立即设置位置，避免重绘
                                        requestAnimationFrame(function() {
                                            $popover.css({
                                                'left': left + 'px',
                                                'top': top + 'px',
                                                'opacity': '1'
                                            });

                                            // 设置箭头位置
                                            $popover.find('.Popover-arrow--bottom').css({
                                                'left': (popoverWidth / 2) + 'px'
                                            });

                                            // 查找举报按钮并隐藏
                                            let $lastButton = $popover.find('button:last-child');
                                            if ($lastButton.length && $lastButton.text().indexOf('举报') !== -1) {
                                                $lastButton.hide();
                                            }

                                        });
                                    }
                                }
                            });
                        }
                    });
                });

                // 开始观察文档变化
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 触发原始按钮点击
                $question_dot.find("button").click();

                // 3秒后停止观察
                setTimeout(() => {
                    observer.disconnect();
                }, 3000);

                /*
                $(".Menu.AnswerItem-selfMenu").find("button").each(function() { //回答
                    if ($(this).text().indexOf("不感兴趣") > -1) {
                        $(this).click();
                    }
                });
                $(".Menu.ItemOptions-selfMenu").find("button").each(function() { //专栏
                    if ($(this).text().indexOf("不感兴趣") > -1) {
                        $(this).click();
                    }
                });
                */

                //$('.ZVideoToolbar-menuItem').click(); //视频
            });
            $question_dot.before($disinterested);
        } else {
            $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
            /*
            // 将原来的 hide() 改为设置透明和禁用交互
            $(this).find(".Zi--Dots").closest(".ContentItem-action").css({
                'opacity': '0',
                'pointer-events': 'none',  // 禁用鼠标事件
                'visibility': 'hidden'     // 隐藏但仍占据位置
            });
            */
        }

        if (!$(this).closest('.ContentItem').hasClass('ArticleItem') && !$(this).closest('.ContentItem').hasClass('ZVideoItem') && $(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) //非文章非视频 且 未添加举报 且 不是自己的回答
        {
            let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
            $question_dot.hide();
            var button_text = '<button type="button" class="Button ContentItem-action FEfUrdfMIKpQDJDqkjte Button--plain fEPKGkUK5jyc4fUuT0QP" style="color:#8590A6"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Report ZDI ZDI--FlagFill24" fill="currentColor"><path d="M12.842 4.421c-1.86-1.24-3.957-1.408-5.798-1.025-1.827.38-3.467 1.313-4.47 2.381a.75.75 0 0 0-.171.732l4.44 14.546a.75.75 0 1 0 1.434-.438l-1.08-3.542c.025-.018.053-.036.083-.054.298-.184.801-.415 1.568-.523 1.386-.197 2.307.129 3.341.543l.187.075c1.005.405 2.161.872 3.791.804 1.401-.003 2.707-.45 3.67-1.015.483-.284.903-.612 1.212-.953.284-.312.581-.752.581-1.255V5.046a.75.75 0 0 0-1.17-.622c-1.82 1.23-4.881 1.823-7.618-.003Z"></path></svg></span> 举报</button>'
            var $report = $(button_text);
            $report.bind("click", function() {
                $question_dot.find("button").click();
                $(".Menu.AnswerItem-selfMenu").hide();
                $(".Menu.AnswerItem-selfMenu").find("button").each(function() {
                    if ($(this).text().indexOf("举报") > -1)
                    {
                        $(this).click();
                        $('.Popover-content').hide();
                    }
                });
            });
            $question_dot.before($report);
        } else {
            $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
        }

    });

    //视频清晰度自动选择超清
    if ($('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > button > span').length > 0 && !$('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > button > span').hasClass('clear')) {
        if ($('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > button > span').text().indexOf('超清') == -1 && $('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > div').text().indexOf('超清') > -1) {
            $('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > div').find('button').eq(0).click();
            $('#player > div > div > div._1sxyvns > div._1jqeghjq > div > div._1c1cvug > div:nth-child(2) > div:nth-child(2) > button > span').addClass('clear');
        }
    }

    //显示首页信息流标签
    if (Config.currentValues.flowTag == 1) {
        $('.Card .Feed .ContentItem').each(function() {
            if ($(this).find('.Tag').length == 0) {

                let typebackground = "",
                    typename = "";
                /*
                let zop= $(this).attr('data-zop');
                let type = JSON.parse(zop)['type'];
                if(type=='answer')
                {
                    typebackground="#0084FF";
                    typename='问题';
                }
                else if(type=='article')
                {
                    typebackground="orange";
                    typename='文章';
                }
                else if(type=='zvideo')
                {
                    typebackground="red";
                    typename='视频';
                }
                */
                if ($(this).hasClass('AnswerItem')) {
                    typebackground = "#0084FF";
                    typename = '问题';
                } else if ($(this).hasClass('ArticleItem')) {
                    typebackground = "orange";
                    typename = '文章';
                } else if ($(this).hasClass('ZVideoItem') || $(this).hasClass('EduSectionItem')) {
                    typebackground = "red";
                    typename = '视频';
                }

                if (typename != "") {
                    let tag = '<div class="Button Tag flowTag" style="background:' + typebackground + '"><span class="Tag-content">' + typename + '</span></div>';
                    $(this).find('.ContentItem-title a').before($(tag));
                }
            }
        });
    }
}

var view_details = 0; //详细资料是否被点击的标志

//用户主页
function people() {
    //自动点击"查看详细资料"按钮
    if ($(".ProfileHeader-expandButton").text().indexOf("查看详细资料") > -1 && view_details == 0) {
        $(".ProfileHeader-expandButton").click();
        view_details = 1;
    }

    if (Config.currentValues.hideProfileSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $(".Profile-sideColumn").hide();
        $(".Profile-mainColumn").width($(".Profile-main").width());
    } else if (Config.currentValues.hideProfileSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $(".Profile-sideColumn").hide();
        $(".Profile-main").attr("style", "display:flex;justify-content:center;");
    }

    $(".ContentItem.AnswerItem, .ContentItem.ArticleItem").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".ContentItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                } else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }

    });

    $("#Profile-pins .List-item").each(function() {
        if (!($(this).find(".ContentItem-time:not(.css-18wtfyc)").hasClass("full")) && $(this).find(".ContentItem-time:not(.css-18wtfyc)").length > 0 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text() != null) {
            if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") == -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") > -1) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                var oldtext = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text();
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            } else if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("发布于") > -1 && $(this).find(".ContentItem-time:not(.css-18wtfyc)").text().indexOf("编辑于") == -1) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").attr("data-tooltip");
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").find("a span").text(data_tooltip);
                $(this).find(".ContentItem-time:not(.css-18wtfyc)").addClass("full");
            }

            //发布时间置顶
            if (Config.currentValues.publishTop == 1) {
                if ($(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("css-18wtfyc") && !$(this).find('.ContentItem-time.css-18wtfyc').hasClass('full')) {
                    let temp_out_time = $(this).find('.ContentItem-time.css-18wtfyc').clone();
                    $(this).find('.ContentItem-time.css-18wtfyc').hide();
                    $(this).find(".ContentItem-meta").append(temp_out_time);
                    $(this).find('.ContentItem-time.css-18wtfyc').addClass('full');
                } else if (!$(this).find(".ContentItem-time:not(.css-18wtfyc)").parent().hasClass("ContentItem-meta")) {
                    let temp_time = $(this).find(".ContentItem-time:not(.css-18wtfyc)").clone();
                    $(this).find(".RichContent .ContentItem-time:not(.css-18wtfyc)").hide();
                    $(this).find(".ContentItem-meta").append(temp_time);
                }
            }
        }

    });
}

function column() {
    $('.css-7q9l37').hide();
    $('.Menu .Menu-item').hide();

    //专栏列表举报按钮
    if ($('.css-16qos9m').find('.Zi--Report').length == 0) {
        let report = `<div style="margin-left:8px;"><button type="button" class="Button Button--plain" style="color:#8590A6">
<span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Report" fill="currentColor" viewBox="0 0 24 24" width="14" height="14">
<path d="M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z" fill-rule="evenodd">
</path></svg></span> 举报</button></div>`;
        let $report = $(report);
        $report.click(function() {
            $('.css-7q9l37 button').click();
            $('.Menu .Menu-item button').eq(0).click();
        });
        $('.css-16qos9m').append($report);
    }

    //取消关注专栏按钮
    if ($('.css-16qos9m').find('.unfollow_columns').length == 0) {
        let $unfollow_columns = $('<button type="button" class="Button Button--plain unfollow_columns" style="margin-left:15px; display:none">取消关注专栏</button>');
        $unfollow_columns.click(function() {
            $('.css-7q9l37 button').click();
            $('.Menu .Menu-item button').eq(1).click();
        });
        $('.css-16qos9m').append($unfollow_columns);
    }

    let left1=$('.css-44kk6u').css('margin-left');
    let left2=$('.css-1pariuy').css('margin-left');
    if(left1 != left2)
    {
        $('.css-1pariuy').css('margin-left', left1)
    }
}

//图片调整到最高清晰度
function originalPic() {

    if (Config.currentValues.blockingPictureVideo == 1) //隐藏图片/视频
    {
        $('img').each(function() {
            if ($(this).closest('.RichContent-cover').length > 0 && !$(this).closest('.RichContent-cover').hasClass('hide')) //未隐藏
            {
                $(this).closest('.RichContent-cover').hide(); //隐藏首页回答封面
                $(this).closest('.RichContent-cover').addClass('hide');
            }

            if ($(this).parent().attr('id') != 'nightmode' && !$(this).hasClass('Avatar')) //非夜间模式按钮，非头像
            {
                if (!$(this).hasClass('hide')) //未隐藏
                {
                    $(this).hide();
                    $(this).addClass('hide');
                }
            }
        });
        $('.TitleImage').hide(); //隐藏专栏文章封面图
    } else {
        $("img").each(function() {
            if ($(this).attr("data-original") != undefined && !$(this).hasClass("comment_sticker")) {
                if ($(this).attr("src") != $(this).attr("data-original"))
                    $(this).attr("src", $(this).attr("data-original"));
            }
        });
    }
}

function addLocalCSS() {
    GM_addStyle(`
    /* ==UserStyle==
@name        zhihu-beautify
@description zhihu
@version     2026.1.4
@namespace   zhihu
@license     MIT
@downloadURL https://update.greasyfork.org/scripts/523346/zhihu-beautify.user.css
@updateURL https://update.greasyfork.org/scripts/523346/zhihu-beautify.meta.css
==/UserStyle== */
html[data-theme=dark] .css-1qefhqu {
    background-color: #1A1A1A
}

html[data-theme=dark] .LeftItem {
    color: #606A80
}

html[data-theme=dark] .LeftItem:hover {
    background-color: #F0F2F7 !important
}

#nightmode {
    color: black
}

#nightmode:hover {
    color: #0084FF
}

html[data-theme=dark] #nightmode {
    color: hsla(0, 0%, 100%, .8)
}

html[data-theme=dark] #nightmode:hover {
    color: #0084FF
}

.Reward {
    display: none !important
}

html[data-hover-visible] .VoterList-content .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0.6px 0.4px 0 4px rgba(0, 132, 255, .3) inset;
    box-shadow: 0 0 0 2px #fff, 0.6px 0.6px 0 4px rgba(0, 132, 255, .3) inset
}

html[data-theme=dark][data-hover-visible] .VoterList-content .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0.6px 0.4px 0 4px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0.6px 0.4px 0 4px rgba(58, 118, 208, .6) inset
}

html[data-hover-visible] .QuestionInvitation .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset
}

html[data-theme=dark][data-hover-visible] .QuestionInvitation .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset
}

html[data-hover-visible] .List-item .List-item:hover {
    -webkit-box-shadow: none;
    box-shadow: none
}

html[data-theme=dark][data-hover-visible] .List-item .List-item:hover {
    -webkit-box-shadow: none;
    box-shadow: none
}

html[data-hover-visible] .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .QuestionAnswer-content:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .QuestionAnswer-content:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .List-item:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .QuestionItem.QuestionWaiting-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .QuestionItem.QuestionWaiting-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .QuestionItem.ToolsQuestionInvited-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .QuestionItem.ToolsQuestionInvited-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .QuestionItem.ToolsQuestionRecommend-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .QuestionItem.ToolsQuestionRecommend-questionItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .css-1v8e53u:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .css-1v8e53u:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-theme=dark][data-hover-visible] .QuestionItem.css-1ob7sqq {
    border: none;
}

html[data-hover-visible] .QuestionItem.css-1ob7sqq:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset;
}

html[data-theme=dark][data-hover-visible] .QuestionItem.css-1ob7sqq:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
}

html[data-hover-visible] .HotItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset
}

html[data-theme=dark][data-hover-visible] .HotItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset
}

html[data-hover-visible] .Card.TopstoryItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 132, 255, .3) inset
}

html[data-theme=dark][data-hover-visible] .Card.TopstoryItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset
}

html[data-hover-visible] .CollectionDetailPageItem:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .CollectionDetailPageItem:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset;
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 3px rgba(58, 118, 208, .6) inset
}

html[data-hover-visible] .Card.TopstoryItem .ContentItem-actions {
    margin-top: 0px;
    margin-right: -17px;
    margin-bottom: -10px;
    margin-left: -17px;
    padding-top: 10px;
    padding-right: 17px;
    padding-bottom: 10px;
    padding-left: 17px;
}

html[data-hover-visible] .Card.TopstoryItem .ContentItem-actions.is-fixed {
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
}

.ModalExp-content {
    display: none !important;
}

html .ColumnPageHeader-Menu .Menu-item {
    color: black
}

html[data-theme=dark] .ColumnPageHeader-Menu .Menu-item {
    color: hsla(0, 0%, 100%, .8)
}

html .ColumnPageHeader-Menu .Menu-item.is-active {
    color: #0084FF
}

.Tabs-link.AppHeader-TabsLink {
    color: black !important
}

html[data-theme=dark] .Tabs-link.AppHeader-TabsLink {
    color: #d3d3d3 !important
}

.Tabs-link.AppHeader-TabsLink.is-active {
    color: #0084FF !important
}

html[data-theme=dark] .Tabs-link.AppHeader-TabsLink.is-active {
    color: #0084FF !important
}

.Tabs-link.AppHeader-TabsLink:hover {
    color: #0084FF
}

html[data-theme=dark] .Tabs-link.AppHeader-TabsLink:hover {
    color: #0084FF
}

html[data-theme=dark] .QuestionHeader-title {
    color: #d3d3d3
}

html[data-theme=dark] .QuestionRichText {
    color: #d3d3d3
}

html[data-theme=dark] .RichContent-inner {
    color: #d3d3d3
}

html[data-theme=dark] .List-headerText {
    color: #d3d3d3
}

html[data-theme=dark] .QuestionInvitation-title {
    color: #d3d3d3
}

html[data-theme=dark] div[itemprop="zhihu:question"] {
    color: #d3d3d3
}

html[data-theme=dark] .ContentItem-title {
    color: #d3d3d3
}

html[data-theme=dark] .HotItem-title {
    color: #d3d3d3
}

html[data-theme=dark] .CommentTopbar-title {
    color: #d3d3d3 !important
}

html[data-theme=dark] .UserLink-link {
    color: #d3d3d3
}

html[data-theme=dark] .CommentItemV2-content .RichText {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreHomePage-ContentSection-header {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreSpecialCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreSpecialCard-contentTitle {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreRoundtableCard-questionTitle {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreCollectionCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreCollectionCard-contentTitle {
    color: #d3d3d3
}

html[data-theme=dark] .ExploreColumnCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ClubItem-name {
    color: #d3d3d3
}

html[data-theme=dark] .ClubHeaderInfo-name {
    color: #d3d3d3
}

html[data-theme=dark] .ClubHeaderInfo-description {
    color: #d3d3d3
}

html[data-theme=dark] .NumberBoard-itemValue {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Tabs-link.ClubTabs {
    color: #d3d3d3
}

html[data-theme=dark] .ClubTopPosts-title {
    color: #d3d3d3
}

html[data-theme=dark] .PostItem-headNameText {
    color: #d3d3d3
}

html[data-theme=dark] .PostItem-titleText {
    color: #d3d3d3
}

html[data-theme=dark] .PostItem-Title {
    color: #d3d3d3
}

html[data-theme=dark] .PostItem-Summary {
    color: #d3d3d3
}

html[data-theme=dark] .LinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .css-bb9ulb {
    color: #d3d3d3
}

html[data-theme=dark] .CollectionDetailPageHeader-title {
    color: #d3d3d3
}

html[data-theme=dark] .CollectionsHeader-tabsLink {
    color: #d3d3d3
}

html[data-theme=dark] .SelfCollectionItem-title {
    color: #d3d3d3
}

html[data-theme=dark] .Card-headerText {
    color: #d3d3d3
}

html[data-theme=dark] .Modal-title {
    color: #d3d3d3
}

html[data-theme=dark] .Favlists-itemNameText {
    color: #d3d3d3
}

html[data-theme=dark] .ReportMenu-itemValue {
    color: #d3d3d3
}

html[data-theme=dark] .ShortcutHintModal-hintTitle {
    color: #d3d3d3
}

html[data-theme=dark] .KeyHint {
    color: #d3d3d3
}

/*
html[data-theme=dark] .Anonymous-confirm {
color: #d3d3d3
}
*/
html[data-theme=dark] .css-sumlaa svg {
    fill: #d3d3d3
}

html[data-theme=dark] .Post-Title {
    color: #d3d3d3
}

html[data-theme=dark] .Post-RichTextContainer p {
    color: #d3d3d3
}

body.WhiteBg-body {
    color: black !important;
    background: white !important;
}

body.ZVideo-body {
    color: black !important;
    background: white !important;
}

html[data-theme=dark] body {
    color: #d3d3d3 !important;
    background: rgb(18, 18, 18) !important
}

.QuestionInvitation .Topbar {
    cursor: pointer;
}

html[data-theme=dark] .WriteIndexLayout-main.WriteIndex {
    border: 1px solid #222
}

html[data-theme=dark] .zhi {
    color: #d3d3d3;
    background-color: rgb(18, 18, 18)
}

.Zi--FormatBold,
.Zi--FormatItalic,
.Zi--FormatHeader,
.Zi--FormatBlockquote,
.Zi--InsertOrderedList,
.Zi--InsertUnorderedList,
.Zi--InsertReference,
.Zi--InsertDivider,
.Zi--InsertCatalog {
    fill: black
}

html[data-theme=dark] .Zi--FormatBold,
html[data-theme=dark] .Zi--FormatItalic,
html[data-theme=dark] .Zi--FormatHeader,
html[data-theme=dark] .Zi--FormatBlockquote,
html[data-theme=dark] .Zi--InsertOrderedList,
html[data-theme=dark] .Zi--InsertUnorderedList,
html[data-theme=dark] .Zi--InsertReference,
html[data-theme=dark] .Zi--InsertDivider,
html[data-theme=dark] .Zi--InsertCatalog {
    fill: #d3d3d3
}

.Zi--Bell path {
    fill: rgb(68, 68, 68)
}

.Zi--Comments path {
    fill: rgb(68, 68, 68)
}

.CarouselBanner-root-gGE8m .Zi--Bell path {
    fill: #8590a6
}

.CarouselBanner-root-gGE8m .Zi--Comments path {
    fill: #8590a6
}

html[data-theme=dark] .Zi--Bell path {
    fill: #8590a6
}

html[data-theme=dark] .Zi--Comments path {
    fill: #8590a6
}

.Zi--Bell:hover path {
    fill: #FACB62
}

.Zi--Comments:hover path {
    fill: #00FF7F
}

html[data-theme=dark] .Zi--Bell:hover path {
    fill: #FACB62
}

html[data-theme=dark] .Zi--Comments:hover path {
    fill: #00FF7F
}

.CommentItemV2-talkBtn .Zi--Comments path {
    fill: #8590a6
}

html[data-theme=dark] .CommentItemV2-talkBtn .Zi--Comments path {
    fill: #8590a6
}

.CommentItemV2-talkBtn:hover .Zi--Comments path {
    fill: #00FF7F
}

html[data-theme=dark] .CommentItemV2-talkBtn:hover .Zi--Comments path {
    fill: #00FF7F
}

.HoverCard-item .FollowButton+.Button:hover {
    color: #00FF7F
}

html[data-theme=dark] .Zi--Browser {
    fill: #8590A6
}

html[data-theme=dark] .css-w8abe7 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-12qxk2 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-huwkhm {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-wgpue5 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-z0yjns {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-yoby3j {
    background: #191b1f;
}

html[data-theme=dark] .css-13445jb {
    animation: none !important;
}

html[data-theme=dark] .css-akuk2k {
    background: rgb(18, 18, 18);
    border: none
}

html[data-theme=dark] .css-1v8e53u {
    border: none
}

html[data-theme=dark] .css-k0fmhp {
    color: #d3d3d3
}

html[data-theme=dark] .css-k0fmhp:hover {
    color: #6385a6
}

html[data-theme=dark] .css-t3ae3e {
    color: #d3d3d3
}

html[data-theme=dark] .css-1b3v2ql {
    color: #d3d3d3;
}

html[data-theme=dark] .css-ke5ir5 {
    color: rgb(133, 144, 166);
}

html[data-theme=dark] .CreatorHomeDeltaCount-compare {
    color: #d3d3d3
}

html[data-theme=dark] .CreatorHomeAnalyticsData-title {
    color: #d3d3d3
}

html[data-theme=dark] .CreatorHomeAnalyticsDataItem-type {
    color: #d3d3d3
}

html[data-theme=dark] .CreatorHomeUpgradeGuide-title {
    color: #d3d3d3
}

html[data-theme=dark] .Tabs-link {
    color: #d3d3d3
}

html[data-theme=dark] .CreatorRecruitTitle {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Title-title-3QaE {
    color: #d3d3d3
}

html[data-theme=dark] .ToolsCopyright-FieldName {
    color: #d3d3d3
}

html[data-theme=dark] .ToolsCopyright-input {
    background: rgb(18, 18, 18) !important;
    color: #d3d3d3 !important
}

html[data-theme=dark] .ToolsCopyright-input::placeholder {
    color: #8590A6
}

html[data-theme=dark] .community-copyright-form input {
    background: rgb(18, 18, 18) !important;
    border: 1px solid #444;
}

html[data-theme=dark] .community-copyright-form input::placeholder {
    color: #8590A6 !important;
}

html[data-theme=dark] .community-copyright-form textarea {
    background: rgb(18, 18, 18) !important;
    border: 1px solid #444;
}

html[data-theme=dark] .community-copyright-form textarea::placeholder {
    color: #8590A6 !important;
}

html[data-theme=dark] .community-copyright-form .copies-item-add-button .text {
    color: #8590A6 !important;
}

html[data-theme=dark] .community-copyright-form .copies-item-add-button .sprite-community-copyright-icon-add {
    filter: invert(1);
}

html[data-theme=dark] .CopyrightCenter-sideNavItem {
    color: #d3d3d3
}

html[data-theme=dark] .CopyrightCenter-sideNavItem.is-active {
    color: #0084ff
}

html[data-theme=dark] .Title-main-1ldU {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Title-border-1vTk {
    background: #8590a65c
}

html[data-theme=dark] .iframeLive-iframe_live-WojO {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .iframeLive-certifiedWrapper-pfzZ {
    background: rgb(18, 18, 18);
    border: 1px solid #8590a65c
}

html[data-theme=dark] .iframeLive-description-2C6O {
    background: rgb(18, 18, 18);
    border: 1px solid #8590a65c
}

html[data-theme=dark] .iframeLive-explanation-2IxQ {
    color: #d3d3d3
}

html[data-theme=dark] .iframeLive-what_zhihu_title-1yQe {
    color: #d3d3d3
}

html[data-theme=dark] .iframeLive-public_number_title-3kRs {
    color: #d3d3d3
}

html[data-theme=dark] .SettingsFAQ-pageTitle {
    color: #d3d3d3
}

html[data-theme=dark] .VideoGallery-root-7Z1Ci {
    background: rgb(18, 18, 18) !important
}

html[data-theme=dark] .css-17714ul {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1bwzp6r {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-w215gm {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-ul9l2m {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-m1yuwo {
    border-left: 1px solid #8590a65c
}

html[data-theme=dark] .css-9ytsk0 {
    border-bottom: 1px solid #8590a65c
}

html[data-theme=dark] .css-1pp4h0z {
    border-top: 1px solid #8590a65c
}

html[data-theme=dark] .css-xevy9w tbody tr:nth-of-type(odd) {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1dah1m2 .css-wdqmif {
    background: rgb(18, 18, 18);
    border-bottom: 1px solid #8590a65c
}

.RichText .lazy[data-lazy-status=ok] {
    animation: none;
}

html[data-theme=dark] img {
    filter: brightness(0.6) !important;
}

/*
html[data-theme=dark] svg:not(.Zi):not(.ZDI) {
filter: brightness(0.6);
}
*/

html[data-theme=dark] .ImageAlias {
    filter: brightness(0.6);
}

html[data-theme=dark] .ExploreRoundtableCard-headerContainer {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .TitleImage {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .ecommerce-ad-arrow-img {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] circle {
    fill-opacity: 0.6 !important;
}

html[data-theme=dark] .GifPlayer-icon {
    opacity: 0.6 !important;
}

html[data-theme=dark] .css-iue0mv {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-tpyajk {
    background: rgb(18, 18, 18)
}

.AppHeaderProfileMenu .Button.Menu-item {
    color: black
}

html[data-theme=dark] .AppHeaderProfileMenu .Button.Menu-item {
    color: #d3d3d3
}

.UserLink-link {
    color: black
}

html[data-theme=dark] .UserLink-link {
    color: #d3d3d3
}

.css-g9ynb2 {
    color: black
}

html[data-theme=dark] .css-g9ynb2 {
    color: #d3d3d3
}

/*评论区*/
.CommentContent {
    color: black
}

html[data-theme=dark] .CommentContent {
    color: #d3d3d3
}

html[data-theme=dark] .css-10u695f {
    color: #d3d3d3
}

.Button--secondary.Button--grey.css-7dh30y {
    color: #0084FF
}

html[data-theme=dark] .Button--secondary.Button--grey.css-7dh30y {
    color: #0084FF
}

.css-wu78cf {
    color: #0084FF
}

html[data-theme=dark] .css-wu78cf .css-vurnku {
    color: #0084FF
}

.css-8v0dsd {
    color: #0084FF
}

html[data-theme=dark] .css-14zbeoe {
    border: 1px solid #444
}

html[data-theme=dark] .css-u76jt1 {
    border: 1px solid #444
}

html[data-theme=dark] .css-hzocic::before {
    border: 1px solid #444
}

html[data-theme=dark] .InputLike {
    border: 1px solid #444!important;
}

html[data-theme=dark] .css-wu78cf::before {
    border-top: 1px solid #444
}

html[data-theme=dark] .css-7wvdjh {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-r4op92 {
    color: #d3d3d3
}

.css-1503iqi:hover {
    color: #0084FF
}

html[data-theme=dark] .css-1503iqi {
    background: rgb(18, 18, 18);
    color: #929aab
}

html[data-theme=dark] .css-1503iqi:hover {
    color: #0084FF
}

html[data-theme=dark] .css-97fdvh {
    background: #8080801c;
    color: #d3d3d3;
    border: none;
}

html[data-theme=dark] .css-m0zh86 {
    background: rgba(0, 102, 255, .08);
    color: #0062ff;
    border: none;
}


.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel {
    color: rgb(68, 68, 68);
}

.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel:hover .Zi--Comments path {
    fill: #00FF7F
}

html[data-theme=dark] .MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel {
    color: #8590A6 !important
}

.MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel {
    color: rgb(68, 68, 68);
}

.MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel:hover .Zi--Comments path {
    fill: #00FF7F
}

html[data-theme=dark] .MemberButtonGroup.AnswerAuthor-buttons .Button--grey.Button--withIcon.Button--withLabel {
    color: #8590A6;
}

.ztext sup[data-draft-type=reference] {
    background: yellow;
    color: black
}

html[data-theme=dark] .ztext sup[data-draft-type=reference] {
    background: yellow;
    color: black
}

.ReferenceList .ReferenceList-backLink {
    color: #0084ff;
}

html[data-theme=dark] .ReferenceList .ReferenceList-backLink {
    color: #0084ff;
}


.zm-item-tag {
    color: #0084ff;
    background: #0084ff1a;
    font-size:14px;
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
}

/*
 *问题日志页修改内容
html[data-theme=dark] .zg-item-log-detail {
    border-left: 3px solid #d3d3d340;
}

html[data-theme=dark] del {
    background: #0084ff1a;
}

.zg-item-log-detail ins,
.zg-item-log-detail ins a {
    color: #0084ff;
    background: #0084ff1a
}
*/

.ReportMenu-inner.ReportMenu-options {
    margin-bottom: 20px
}

.ModalButtonGroup.ModalButtonGroup--horizontal {
    margin-top: 20px
}

.TopstoryItem-actionButton {
    color: #8590A6
}

.TopstoryItem-actionButton:hover {
    color: #0084FF
}

.TopstoryItem-uninterestTag {
    color: #8590A6
}

.TopstoryItem-uninterestTag:hover {
    color: #0084FF
}

html[data-theme=dark] .TopstoryItem-actionButton {
    color: #8590A6
}

html[data-theme=dark] .TopstoryItem-actionButton:hover {
    color: #0084FF
}

html[data-theme=dark] .TopstoryItem-uninterestTag {
    color: #8590A6
}

html[data-theme=dark] .TopstoryItem-uninterestTag:hover {
    color: #0084FF
}

.Button.Menu-item {
    color: #8590A6
}

.Button.Menu-item.is-active {
    color: black
}

html[data-theme=dark] .Button.Menu-item.is-active {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Post-ActionMenu .Button.Menu-item.Button--plain.is-active {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Post-ActionMenu .Button.Menu-item.Button--plain.is-active .css-17px4ve svg {
    fill: #d3d3d3 !important
}

html[data-theme=dark] .AnswerItem-selectMenuItem.is-active {
    color: #d3d3d3 !important
}

html[data-theme=dark] .AnswerItem-selectMenuItem.is-active .css-17px4ve svg {
    fill: #d3d3d3 !important
}

html[data-theme=dark] .CommentPermission-item.is-active {
    color: #d3d3d3 !important
}

html[data-theme=dark] .CommentPermission-item.is-active .css-17px4ve svg {
    fill: #d3d3d3 !important
}

.ToolsQuestion-header--action {
    color: #0084FF
}

html[data-theme=dark] .ToolsQuestion-header--action {
    color: #0084FF
}

html[data-theme=dark] .Button.css-jamz70 {
    color: white;
    border: none
}

html[data-theme=dark] .css-l0zkw9 {
    color: #8590A6
}

.Card.css-1y7nlna {
    display: none !important
}

.SettingsNav-link[href="/settings/mcn"] {
    display: none !important
}

.SettingsNav-link {
    color: black
}

html[data-theme=dark] .SettingsNav-link {
    color: #d3d3d3
}

html[data-theme=dark] .SettingsNav-link .Zi--Bell path {
    fill: #d3d3d3
}

.SettingsNav-link.is-active {
    color: #0084ff
}

.SettingsNav-link.is-active svg {
    fill: #0084ff
}

.SettingsNav-link.is-active .Zi--Bell path {
    fill: #0084ff
}

html[data-theme=dark] .SettingsNav-link.is-active {
    color: #0084ff
}

html[data-theme=dark] .SettingsNav-link.is-active svg {
    fill: #0084ff
}

html[data-theme=dark] .SettingsNav-link.is-active .Zi--Bell path {
    fill: #0084ff
}

.SettingsNav-link:hover {
    color: #0084ff
}

.SettingsNav-link:hover svg {
    fill: #0084ff
}

.SettingsNav-link:hover .Zi--Bell path {
    fill: #0084ff
}

html[data-theme=dark] .SettingsNav-link:hover {
    color: #0084ff
}

html[data-theme=dark] .SettingsNav-link:hover svg {
    fill: #0084ff
}

html[data-theme=dark] .SettingsNav-link:hover .Zi--Bell path {
    fill: #0084ff
}

.Zi--InsertTable {
    fill: #0084ff
}

.Zi--TableRowNum {
    fill: #0084ff
}

.Zi--TableColumnNum {
    fill: #0084ff
}

.ReportMenu-item:hover {
    background: #8080801c;
}

.ReportInfringement-item:hover {
    background: #0084ff26;
}

.css-520aav {
    display: none !important;
}

.Pc-Business-Card-PcTopFeedBanner {
    display: none !important;
}

#nightmode img {
    filter: brightness(1) !important
}

html[data-theme=dark] .QuestionTopicReviewCardExtraInfo-cardTitle {
    color: #d3d3d3
}

html[data-theme=dark] .MCNLinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .label-input-label {
    background-color: #e1eaf2;
}

div.ModalButtonGroup.ModalButtonGroup--horizontal>button:nth-child(1):not([class="ReportMenu-button"]):hover {
    background: #8080801c;
}

.Modal:not([class*="BaiduFileSelector"]) .Modal-inner {
    overflow-y: hidden
}

.Modal.Modal--default.css-zelv4t .Modal-inner {
    overflow-y: scroll
}

.Modal-content {
    overflow-y: hidden
}

.BaiduFileSelector-content {
    overflow-y: hidden;
}

html[data-theme=dark] .TopTabNavBar-isLight-bYRj {
    background: rgb(18, 18, 18) !important
}

html[data-theme=dark] .Card-card-2K6v {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .LiveItem-title-2qes {
    color: #d3d3d3
}

html[data-theme=dark] .GlobalSidebar-introItem-24PB h3 {
    color: #d3d3d3
}

html[data-theme=dark] .Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .UserLivesPage-page-GSje {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Menu-menuInner-2eRf {
    background: rgb(18, 18, 18)
}

.Menu-menuItem-1oId:hover {
    background: #8080801c
}

html[data-theme=dark] .Menu-menuItem-1oId:hover {
    background: #8080801c
}

html[data-theme=dark] .EditorAttachment {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-ovbogu {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .AppHeader {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .PubIndex-CategoriesHeader {
    background: rgb(26, 26, 26);
    border: none
}

html[data-theme=dark] .BottomBar-wrapper-kXb19 {
    background: rgb(18, 18, 18) !important
}

html[data-theme=dark] .css-1cs7y3i {
    color: #d3d3d3
}

html[data-theme=dark] .TabNavBarItem-tab-MS9i {
    color: #d3d3d3
}

html[data-theme=dark] .TabNavBarItem-tab-MS9i.TabNavBarItem-isActive-1iXL {
    color: rgb(17, 133, 254);
}

.ToolsQuestionInvited-questionList {
    padding: 0px 20px 20px 20px
}

html[data-theme=dark] .FeedbackButton-button-3waL {
    background: #d3d3d3
}

html[data-theme=dark] .Pub-reader-clear-body {
    background: #000;
    color: #000
}

html[data-theme=dark] .Pub-reader-body {
    background: #000;
    color: #000
}

html[data-theme=dark] .Pub-reader-app-header {
    background: rgb(18, 18, 18);
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .Pub-reader-app-header .reader-nav {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Pub-reader-bottom-bar {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Pub-reader-bottom-bar .reader-app-qrcode {
    color: #d3d3d3;
}

html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance.pc {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Pub-web-reader .reader-container {
    background: rgb(0, 0, 0);
}

html[data-theme=dark] .Pub-web-reader .reader-chapter-content {
    background: rgb(33, 33, 35);
}

html[data-theme=dark] .reader-chapter-content {
    background: rgb(33, 33, 35);
    color: rgb(115, 118, 125)
}

html[data-theme=dark] .Pub-web-reader .reader-chapter-content .MPub-reader-trial-finish {
    color: #d3d3d3
}

html[data-theme=dark] .Pub-PageHeaderWrapper .PageHeader {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Pub-BookInfo h1 {
    color: #d3d3d3
}

html[data-theme=dark] .Overview .left {
    color: #d3d3d3
}

html[data-theme=dark] .reviewHeader div {
    color: #d3d3d3
}

html[data-theme=dark] .ReviewCell .content {
    color: gray
}

html[data-theme=dark] .TopNavBar-root {
    background: rgb(18, 18, 18);
    border: none
}

html[data-theme=dark] .TopNavBar-logout {
    color: #d3d3d3
}

html[data-theme=dark] .Main {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Pub-BookInfo .Label {
    color: #0084ff;
    background: #0084ff1a;
}

html[data-theme=dark] .Labels-labelButton-ioRsP {
    color: #0084ff;
    background: #0084ff1a;
}

html[data-theme=dark] .PubBook-RelativeListItem-info {
    color: #8590A6
}

html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .Description {
    color: #8590A6
}

html[data-theme=dark] .Pub-BookAuthorItem .AuthorName {
    color: #d3d3d3
}

html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ShortDesc {
    color: #d3d3d3
}

html[data-theme=dark] .css-k7kepf {
    color: #d3d3d3
}

html[data-theme=dark] .App-root-63J6a {
    border: 1px solid #444
}

html[data-theme=dark] .Pub-reader-app-header .reader-nav li:after {
    background: #444
}

html[data-theme=dark] .Pub-reader-app-header .reader-logo span:before {
    background: #444
}

html[data-theme=dark] .Pub-web-reader .Pub-reader-catalogue li {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .Pub-web-reader .Pub-reader-catalogue:before {
    background: #444
}

html[data-theme=dark] .css-lcfru7,
html[data-theme=dark] .css-xnl4yp {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .zm-topic-topbar {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .SelfCollectionItem-innerContainer {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .zm-item+.zm-item {
    border-top: 1px solid #444
}

html[data-theme=dark] .zh-footer .content {
    border-top: 1px solid #444
}

html[data-theme=dark] .zm-side-section+.zm-side-section>.zm-side-section-inner {
    border-top: 1px solid #444
}

html[data-theme=dark] .zg-btn-white.zu-button-more {
    background: rgb(18, 18, 18);
    color: #3a76d0 !important;
    border-color: #3a76d0;
    box-shadow: none;
    text-shadow: none
}

html[data-theme=dark] .css-r9mkgf {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-jwse5c,
html[data-theme=dark] .css-1zcaix,
html[data-theme=dark] .css-4a3k6y,
html[data-theme=dark] .css-eonief {
    color: #d3d3d3;
}

html[data-theme=dark] .css-hd7egx {
    color: #d3d3d3;
    border-color: #444
}

html[data-theme=dark] .css-iin461 {
    border: 1px solid #444
}

html[data-theme=dark] .css-1ki0pxd {
    border: none
}

html[data-theme=dark] .Pub-BookVipEntrance {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] div.css-1b0ypf8>div.css-1sqjzsk>div.css-tr5tvs>img {
    filter: brightness(1) !important;
}

html[data-theme=dark] .ColumnHomeTop:before {
    background: none
}

html[data-theme=dark] .ColumnHomeBottom {
    background: none
}

html[data-theme=dark] .HybridLink.Home-topic {
    cursor: pointer
}

html[data-theme=dark] .WikiLandingWelcome-main h2 {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingExcellentItems-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingExcellentItems-calcWrapper .WikiLandingExcellentItems-name {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingItemCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingGuide-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingCarousel-author .UserLink-link {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingContributor-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingRight-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingRight-right .WikiLandingRight-name {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingEditBoard-title {
    color: #d3d3d3
}

html[data-theme=dark] .WikiLandingNavSelector-navItem {
    color: #d3d3d3
}

html[data-theme=dark] .BalanceDashboard-Currency-Number {
    color: #d3d3d3
}

html[data-theme=dark] .BalanceDashboard h1 {
    color: #d3d3d3
}

html[data-theme=dark] .BalanceDashboard-Currency-Label {
    color: #d3d3d3
}

html[data-theme=dark] .ClubSliderList-name {
    color: #d3d3d3
}

html[data-theme=dark] .BalanceTransactionList-Item:nth-child(2n) {
    background-color: hsla(0, 0%, 97%, 0.03);
}

.WikiLandingNavSelector-navItem--active,
html[data-theme=dark] .WikiLandingNavSelector-navItem--active {
    color: #5868d1;
}

html[data-theme=dark] .WikiLandingGuide-wiki .WikiLandingGuide-image {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .WikiLandingGuide-abstract .WikiLandingGuide-image {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] ._Coupon_intro_1kIo {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] ._Coupon_item_34n9 {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .Community-ContentLayout {
    background: black
}

html[data-theme=dark] .css-dainun {
    background: rgb(18, 18, 18);
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-1t8cvcr {
    border-right: 1px solid #444
}

html[data-theme=dark] .css-104x2kz {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-16kxzh3 {
    border-bottom: 1px solid #444;
    border-left: 1px solid #444
}

html[data-theme=dark] .css-18xitnw {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-11v4451 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-m9gn5f {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-bnfl40 {
    background: rgb(18, 18, 18);
    border-bottom: 20px solid rgb(18, 18, 18);
}

html[data-theme=dark] .css-19e7d80 {
    background: rgb(18, 18, 18);
    color: #8590A6
}

html[data-theme=dark] .css-19e7d80:hover {
    color: #0084FF
}

.css-19e7d80:hover {
    color: #0084FF
}

.css-5gbrzs:hover {
    color: #0084FF
}

html[data-theme=dark] .css-5gbrzs:hover {
    color: #0084FF
}

.css-tcdp81:hover {
    color: #0084FF
}

html[data-theme=dark] .css-cmuys0 {
    color: #d3d3d3
}

html[data-theme=dark] .css-14chytt {
    color: #d3d3d3
}

html[data-theme=dark] .css-1hhi6j5 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1d7g4vp {
    color: #d3d3d3
}

html[data-theme=dark] .css-1c4skpi {
    color: #d3d3d3;
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-yu9w3k {
    color: #d3d3d3;
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1117lk0:hover .css-yu9w3k {
    color: rgb(68, 68, 68);
    border: none
}

html[data-theme=dark] .css-m9gn5f:hover {
    background-color: rgb(246, 246, 246);
}

html[data-theme=dark] .css-m9gn5f:hover .css-yu9w3k {
    background-color: rgb(246, 246, 246);
    color: rgb(68, 68, 68);
    border: none
}

html[data-theme=dark] .AbstractCard-header:after,
html[data-theme=dark] .AbstractCard-header:before {
    opacity: 0.1
}

html[data-theme=dark] .css-gvm7n2::before {
    background-image: linear-gradient(to right, #0084ff00, #0084ffd4);
}

html[data-theme=dark] .css-gvm7n2 {
    color: #f6f6f6;
    background: #0084ffd4;
}

html[data-theme=dark] .css-1dz0u0s {
    background: #d3d3d3;
}

html[data-theme=dark] .community-copyright-form input,
html[data-theme=dark] .community-copyright-form textarea {
    background: #ddd;
}

html[data-theme=dark] ._Slogan_sloganWrapper_2E5y {
    background: #d3d3d3;
}

html[data-theme=dark] .CopyrightSettings h2 {
    color: #d3d3d3;
}

html[data-theme=dark] .CopyrightSettings-setall-tip {
    color: #d3d3d3;
}

html[data-theme=dark] .community-copyright-form .copies-item-add-button .text {
    color: #d3d3d3;
}

html[data-theme=dark] .sprite-community-copyright,
html[data-theme=dark] [class*=sprite-community-copyright-] {
    border: none;
    border-radius: 16px;
}

html[data-theme=dark] .tab-navs {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .community-copyright-faq dt:first-child {
    border-top: 1px solid #444
}

html[data-theme=dark] .community-copyright-faq dt {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-19mtex {
    border-top: 1px solid #444
}

.AdblockBanner {
    display: none !important
}

.Pc-word {
    display: none !important
}

._7akbfp {
    color: white !important
}

html[data-theme=dark] #player {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .PubIndex-book-main .BasicInfo .Actions {
    border-top: 1px solid #444;
}

html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ToggleCollapse {
    border-top: 1px solid #444;
}

html[data-theme=dark] .ReviewCell {
    border-top: 1px solid #444;
}

html[data-theme=dark] .PubIndex-book-aside .ToggleCollapse {
    border-top: 1px solid #444;
}

html[data-theme=dark] .PubIndex-book-main .Summary .TabContent .ExtInfo {
    border-top: 1px solid #444;
}

html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li {
    border-bottom-color: #444
}

html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li:hover span {
    color: #404040
}

html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li.level-1:before {
    background: #d3d3d3
}

html[data-theme=dark] .PubIndex-book-main .Summary .MPub-reader-chapter li.level-1:hover:before {
    background: #404040
}

html[data-theme=dark] .PubIndex-book-aside .ToBePublisher .Link {
    color: #404040
}

html[data-theme=dark] .PubAsideNavs .NavItem:after {
    background: rgb(26, 26, 26)
}

html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance h3 span.title {
    color: #bfbfbf
}

html[data-theme=dark] .Pub-web-reader .Pub-reader-guidance .operation-names {
    color: #bfbfbf
}

html[data-theme=dark] .CornerButton {
    background: #1a1a1a;
}

.CornerButton .Zi--BackToTop {
    fill: #8590A6;
}

.CornerButton:hover .Zi--BackToTop {
    fill: #0084FF;
}

.CornerButton:hover .Zi--BackToTop:hover {
    fill: #0084FF;
}

html[data-theme=dark] .CornerButton .Zi--BackToTop {
    fill: #8590A6;
}

html[data-theme=dark] .CornerButton:hover .Zi--BackToTop {
    fill: #0084FF;
}

html[data-theme=dark] .CornerButton:hover .Zi--BackToTop:hover {
    fill: #0084FF;
}

html[data-theme=dark] .Main header {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .Main .params section {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .App-root-fNRdG {
    border: 1px solid #444;
}

html[data-theme=dark] .Popover-content-fGkPm.Bubble-content-fdv1v {
    border: none !important;
}

html[data-theme=dark] .SignFlowHomepage {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .css-zvnmar {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1pk3pp1 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .SignFlow-captchaContainer.Captcha-chinese {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .SignContainer-inner {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Login-socialLogin {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .SignContainer-content input {
    background: rgb(18, 18, 18) !important;
    color: white !important
}

html[data-theme=dark] .css-1vs8y1g {
    border-top: 1px solid #444;
}

html[data-theme=dark] .ZVideoLinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ZVideo-title {
    color: #d3d3d3
}

html[data-theme=dark] .LinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ecommerce-ad-arrow-main-content-des span {
    color: #d3d3d3 !important
}

html[data-theme=dark] .ArticleLinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ProfileHeader-detail {
    color: #d3d3d3
}

html[data-theme=dark] .BlockTitle {
    color: #d3d3d3
}

html[data-theme=dark] .FormulaModal-formula img {
    filter: invert(1) !important;
}

html[data-theme=dark] .MCNLinkCard-price {
    color: #ff7955cc
}

html[data-theme=dark] .MCNLinkCard-button {
    color: #ff7955cc
}

html[data-theme=dark] .css-10rt8mt {
    background: #D3D3D3
}

html[data-theme=dark] .css-j3ksul {
    color: #D3D3D3
}

html[data-theme=dark] .css-13ry121 {
    color: #D3D3D3
}

html[data-theme=dark] .css-17sk48h {
    background: #D3D3D3
}

html[data-theme=dark] .css-6pi7dw {
    background: #D3D3D3
}

html[data-theme=dark] .css-1djl0i {
    color: #D3D3D3
}

html[data-theme=dark] .css-ya4ahl {
    color: #D3D3D3
}

html[data-theme=dark] .css-rpq3do {
    background: #D3D3D3
}

html[data-theme=dark] .css-1fod326 {
    background: #D3D3D3
}

html[data-theme=dark] .css-1lywtmg {
    color: #D3D3D3
}

html[data-theme=dark] .css-1sxqbyv {
    color: #D3D3D3
}

html[data-theme=dark] .css-noi2nm {
    background: #f6f6f699
}

html[data-theme=dark] .OpenInAppButton {
    display: none !important
}

html[data-theme=dark] .css-1rmxt0r {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-17cflso {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-148dlpw {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-pxupqe {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-u6lvao {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-u6lvao:before {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-u6lvao:after {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-i6cwu4 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Section-title-6pXgn {
    color: #D3D3D3
}

html[data-theme=dark] .NewVipJointCard-info-kVD8s {
    color: #D3D3D3;
}

html[data-theme=dark] .SectionTitle-title-hm9BX {
    color: #D3D3D3
}

html[data-theme=dark] .OtherPrivileges-vipPrivilegeItem-2wWQh .OtherPrivileges-title-5TbKp {
    color: #D3D3D3
}

html[data-theme=dark] .App-vipCard-smjUr {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .App-rightsTitle-mSEk4 {
    color: #D3D3D3
}

html[data-theme=dark] .App-vipBookItem-cdBqb {
    color: #D3D3D3
}

html[data-theme=dark] .App-contentRightsItem-8pbnH {
    color: #D3D3D3
}

html[data-theme=dark] .App-activityItem-9ttFQ {
    color: #D3D3D3
}

html[data-theme=dark] .AlbumColumnMagazineWebPage-title-wN4vV {
    color: #D3D3D3
}

html[data-theme=dark] .Tabs-tab-rmJ5e.Tabs-active-modB7 {
    color: #D3D3D3
}

html[data-theme=dark] .Section-title-pJASK {
    color: #D3D3D3
}

html[data-theme=dark] .Contents-chapterCommonTitle-ss2nC {
    color: #D3D3D3
}

html[data-theme=dark] .ChapterCard-title-wFeeZ {
    color: #D3D3D3
}

html[data-theme=dark] .SkuCell-title-bHvuZ {
    color: #D3D3D3
}

html[data-theme=dark] .css-14mfnik {
    background: rgb(27, 27, 27)
}

html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-icon {
    opacity: 0 !important
}

html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-gif2mp4 {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .GifPlayer.isPlaying .GifPlayer-gif2mp4+img {
    opacity: 0 !important
}

html[data-theme=dark] .css-1sry9ao {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-a3trda .css-b1npk4 {
    color: #0084ff
}

html[data-theme=dark] .css-1stnbni .css-b1npk4 {
    color: #D3D3D3
}

html[data-theme=dark] .css-1stnbni:hover {
    background: #8080801c;
}

html[data-theme=dark] .css-1myg3er path {
    fill: #d3d3d3
}

html[data-theme=dark] .VersatileModuleRenderer-module-kEzfc .VersatileModuleRenderer-skuTitle-mDcPo {
    color: #D3D3D3
}

html[data-theme=dark] .CreatorRecruitHeader-title {
    color: #D3D3D3 !important
}

html[data-theme=dark] .css-1b1irul {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .css-125jmqu {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .css-1y2wwyj {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .css-1xxg9xm {
    color: #0084FF
}

html[data-theme=dark] .css-17oyyq4:hover {
    color: #0084FF
}

html[data-theme=dark] .css-uq88u1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-dh57eh {
    color: #d3d3d3
}

html[data-theme=dark] .css-1j6wofp {
    color: #d3d3d3
}

html[data-theme=dark] .css-jwu58x {
    color: #d3d3d3
}

html[data-theme=dark] .css-1851dda {
    color: #d3d3d3
}

html[data-theme=dark] .css-1yhwbu2 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1xg9zz8 {
    color: #d3d3d3
}

html[data-theme=dark] .css-147d5r2 {
    color: #d3d3d3
}

html[data-theme=dark] .css-103ktxc {
    color: #d3d3d3
}

html[data-theme=dark] .css-1g2163c {
    color: #d3d3d3
}

html[data-theme=dark] .css-sfliv9 {
    color: rgb(153, 153, 153);
}

html[data-theme=dark] .css-jt1vdv {
    border-bottom: 1px solid #d3d3d3;
    border-color: #d3d3d3
}

html[data-theme=dark] .css-1da4iq8 {
    background: rgb(18, 18, 18);
    border: 1px solid #2e2e2e
}

html[data-theme=dark] .css-oqge09 {
    background: rgb(18, 18, 18);
    border: 1px solid #2e2e2e
}

html[data-theme=dark] .css-1s46lii {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .KfeCollection-GoodsCardV2-detail-title {
    color: #d3d3d3
}

html[data-theme=dark] .KfeCollection-GoodsCardV2-cover-label {
    color: black
}

html[data-theme=dark] .ColumnMagazineWeb-newBottomBar-idP5i {
    background: rgb(18, 18, 18);
    border-top: 1px solid #2e2e2e
}

html[data-theme=dark] svg.NewBottomBar-defaultColor-3FMr6:not([class*="NewBottomBar-active-hvaTK"]) {
    filter: invert(1) brightness(0.6) !important
}

html[data-theme=dark] .index-logo-cb3Kk .Image-image-bdKjJ {
    filter: invert(1) brightness(0.6) !important
}

html[data-theme=dark] .index-contactCard-gjgfA .index-logo-krbeE .Image-image-bdKjJ {
    filter: invert(1) brightness(0.6) !important
}

html[data-theme=dark] .HeaderInfo-root-gnEfo {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .AuthorsSection-headerTitle-xjzpp {
    color: #d3d3d3
}

html[data-theme=dark] .CatalogModule-title-sggN4 {
    color: #d3d3d3
}

html[data-theme=dark] a.UserCell-link-hyWMo {
    color: #d3d3d3
}

html[data-theme=dark] .MyShelf-title-qA1gu {
    color: #d3d3d3
}

html[data-theme=dark] .RecommendFeed-title-x2nEt {
    color: #d3d3d3
}

html[data-theme=dark] .RecommendFeed-skuTitle-otRGK {
    color: #d3d3d3 !important
}

html[data-theme=dark] .MemberInfoPanel-userName-boKER {
    color: #d3d3d3 !important
}

html[data-theme=dark] .TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a {
    color: #d3d3d3
}

.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f {
    color: #0084ff
}

html[data-theme=dark] .TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f {
    color: #0084ff
}

html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-tabItem-pTnCd {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-tabItem-pTnCd.RankingList-active-mh1YB {
    color: #ce994f
}

html[data-theme=dark] .RankingList-header-eSGqm .RankingList-tabList-usmMt .RankingList-title-nDS4G {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-skuItem-hpJpz .RankingList-title-nDS4G {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-skuItem-hpJpz .RankingList-author-fH328 {
    color: #d3d3d3
}

html[data-theme=dark] .SaltItem-title-th5Li {
    color: #d3d3d3
}

html[data-theme=dark] .ShelfCell-title-bztZM {
    color: #d3d3d3
}

.TopNavBar-root-hektz .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path {
    fill: #d3d3d3
}

.TopNavBar-root-hektz .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path {
    fill: #d3d3d3
}

.TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path {
    fill: black
}

.TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path {
    fill: black
}

html[data-theme=dark] .TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Bell path {
    fill: #8590A6
}

html[data-theme=dark] .TopNavBar-root-hektz.TopNavBar-fixMode-29iHi .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7 .Zi--Comments path {
    fill: #8590A6
}

html[data-theme=dark] .RankingList-root-ontG8 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .ProductCell-title-ar7kK {
    color: #d3d3d3
}

html[data-theme=dark] .ProductItemVertical-title-7SkbW {
    color: #d3d3d3
}

html[data-theme=dark] .LiveAppointmentItem-title-djRgc {
    color: #d3d3d3
}

html[data-theme=dark] .CoverStory-bigTitle-r5fk8 {
    color: #d3d3d3
}

html[data-theme=dark] .CarouselBanner-leftTurnPageBtn-jxet9,
html[data-theme=dark] .CarouselBanner-rightTurnPageBtn-gFDYQ {
    color: #d3d3d3
}

html[data-theme=dark] .css-1v0m2e8 {
    color: #d3d3d3
}

html[data-theme=dark] .MyShelf-bookCell-d1F4t .MyShelf-bookInfo-rXqus .MyShelf-bookTitle-sYXGP {
    color: #d3d3d3
}

html[data-theme=dark] .SuperStarList-title-iem6E {
    color: #d3d3d3
}

html[data-theme=dark] .SuperStarList-starCell-b5kon.SuperStarList-active-fqY4e .SuperStarList-name-fXz2f {
    color: #d3d3d3
}

html[data-theme=dark] .SuperStarList-starCell-b5kon .SuperStarList-name-fXz2f:hover {
    color: #d3d3d3
}

html[data-theme=dark] .MenuBar-root-v61Qh {
    border-bottom: 10px solid rgb(18, 18, 18)
}

.Card.css-8z7gkt {
    display: none !important;
}

html[data-theme=dark] .ManuscriptTitle-root-vhZzG {
    color: #d3d3d3
}

html[data-theme=dark] .ProductCardNew-title-7X4Ff {
    color: #d3d3d3
}

html[data-theme=dark] .TopNavBar-inner-baxks .TopNavBar-searchBar-wM9EY .TopNavBar-searchBtn-n4UgZ {
    filter: brightness(0.9) !important
}

html[data-theme=dark] .MemberInfoPanel-info-fqJU8 .MemberInfoPanel-memberBtn-9B2nK {
    filter: brightness(0.9) !important
}

html[data-theme=dark] .css-1pwpt4d {
    color: #d3d3d3
}

html[data-theme=dark] .css-piu9of {
    color: #d3d3d3
}

html[data-theme=dark] .css-rk0pq {
    color: #d3d3d3
}

html[data-theme=dark] .css-p8hfce {
    color: #d3d3d3
}

html[data-theme=dark] .css-kwnxmp {
    color: #d3d3d3
}

html[data-theme=dark] .css-bc6idi {
    color: #d3d3d3
}

html[data-theme=dark] .css-8u7moq {
    color: #d3d3d3
}

html[data-theme=dark] .css-c0lyvn {
    color: #d3d3d3
}

html[data-theme=dark] .css-1204lgo {
    color: #d3d3d3
}

html[data-theme=dark] .css-17t0kok {
    color: #8590a6
}

html[data-theme=dark] .css-1xegbra {
    background-color: #d3d3d3
}

html[data-theme=dark] .css-80i0x3 {
    background-color: #d3d3d3
}

html[data-theme=dark] .css-1akafz2 {
    background-color: #d3d3d3
}

html[data-theme=dark] .css-16zrry9 {
    background-color: rgb(18, 18, 18)
}

html[data-theme=dark] .css-ygii7h {
    background-color: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1f47p0s {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-19rbssv {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-wooxo5 .CreationManage-CreationCard {
    border-top: 1px solid #444
}

html[data-theme=dark] .css-90w7z {
    border-color: #444
}

html[data-theme=dark] .SkuTitle-skuTitleText-iVc91 {
    color: #d3d3d3 !important
}

html[data-theme=dark] .GalleryCell-title-38fBA {
    color: #d3d3d3 !important
}

html[data-theme=dark] .GalleryCell-footer-h9wzn {
    color: #d3d3d3 !important
}

html[data-theme=dark] .VideoMask-duration-2dQ3k {
    color: #d3d3d3 !important
}

.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons .Button--grey:hover .Zi--Comments path {
    fill: rgb(0, 255, 127)
}

.MemberButtonGroup.ProfileButtonGroup.ProfileMain-buttons .Button--grey:hover .Zi--Comments path {
    fill: rgb(0, 255, 127) !important
}

html[data-theme=dark] .MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons .Button--grey.Button--withIcon.Button--withLabel:hover {
    color: rgb(0, 255, 127) !important
}

html[data-theme=dark] .PushNotifications-item {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Messages-item {
    color: #d3d3d3
}

html[data-theme=dark] .Messages-myMessageTab {
    color: #d3d3d3
}

html[data-theme=dark] .Messages-myMessageTab:hover {
    color: #d3d3d3
}

html[data-theme=dark] .ChatBoxModal-closeIcon {
    fill: #d3d3d3
}

.Notifications-footer>a:nth-child(2):hover {
    color: #0084ff
}

html[data-theme=dark] .Notifications-Main>header h1 {
    color: #d3d3d3
}

html[data-theme="dark"] .Notifications-Section-header h2 {
    color: #d3d3d3
}

html[data-theme=dark] .NotificationList-Item-content {
    color: #d3d3d3
}

.Messages-footer .Button:hover {
    color: #0084ff !important
}

html[data-theme=dark] .TopSearch-itemLink {
    color: #d3d3d3
}

html[data-theme=dark] .RelatedCommodities-subject {
    color: #d3d3d3
}

html[data-theme=dark] .SearchTopicHeader-IntroductionWrapper {
    color: #d3d3d3
}

html[data-theme=dark] .RichContent-cover-duration {
    color: #d3d3d3
}

html[data-theme=dark] .WriteIndex-pageTitle {
    color: #d3d3d3
}

html[data-theme=dark] .Club-Search-Name {
    color: #d3d3d3
}

html[data-theme=dark] .Club-Search-WebContent .Club-Search-Desc {
    color: #d3d3d3
}

html[data-theme=dark] .Search-container .SearchItem-meta {
    color: #d3d3d3
}

html[data-theme=dark] .ContentItem-title a:hover .Highlight em {
    color: #6385a6
}

html[data-theme=dark] .Club-Search-Name:hover {
    color: #6385a6
}

html[data-theme=dark] .Club-Search-Name:hover em {
    color: #6385a6
}

html[data-theme=dark] .SearchClubCard-avatar {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .ClubSideTitle-title {
    color: #d3d3d3
}

html[data-theme=dark] .ClubInfoCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .ClubInfoCard-admins .ClubAdmin-name {
    color: #d3d3d3
}

html[data-theme=dark] .Search-container {
    color: #d3d3d3
}

html[data-theme=dark] .css-1v840mj {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-a9sbyu {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1wof2n {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-5abu0r {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-6mdg56 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-n7efg0 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-12t64ov {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-lpo24q {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-mzh2tk {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1vm3b1t {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-u8y4hj {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-c23k4l {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-mjg7l1 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-wcswpi {
    background: rgb(18, 18, 18);
    border: 1px solid rgb(18, 18, 18);
}

html[data-theme=dark] .index-bannerItem-3o3D7 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .LearningRouteCard-wrapper-8Yu5u {
    background: rgb(18, 18, 18) !important
}

html[data-theme=dark] .ProfileMenu-root-mkEES {
    background: rgb(18, 18, 18);
    color: #d3d3d3
}

html[data-theme=dark] .ProfileMenu-item-iT1iQ:hover {
    background: #1b1b1b
}

.ProfileMenu-item-iT1iQ:nth-child(1):hover {
    color: rgb(5, 107, 0)
}

.ProfileMenu-item-iT1iQ:nth-child(2):hover {
    color: #0084ff
}

.ProfileMenu-item-iT1iQ:nth-child(3):hover {
    color: red
}

.ProfileMenu-item-iT1iQ:nth-child(4):hover {
    color: purple
}

.ProfileMenu-item-iT1iQ:nth-child(5):hover {
    color: red
}

.index-activityTabItemLabel-cPuZy {
    color: #0084ff
}

html[data-theme=dark] .LearningRouteCard-pathContent-j3jVv {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Recruit-buttonFix-placeholder {
    background: rgb(18, 18, 18) !important
}

html[data-theme=dark] .CreatorRecruitFooter--fix {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .index-tab-qQX4H {
    border: none
}

html[data-theme=dark] .css-17ephyd {
    background: rgb(18, 18, 18);
    border-bottom: 1px solid #444
}

html[data-theme=dark] .LearningRouteCard-seeAll-xnUqk .LearningRouteCard-text-jkiXH {
    color: #0084ff
}

html[data-theme=dark] .LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-title-do7ND {
    color: #d3d3d3
}

html[data-theme=dark] .LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-detail-i7CrR {
    color: #d3d3d3
}

html[data-theme=dark] .index-extraLink-eCWnW.index-extraLink-ptmhQ.index-downLoadIcon-ofcPm {
    color: #d3d3d3
}

html[data-theme=dark] .index-extraLink-ptmhQ {
    color: #d3d3d3
}

html[data-theme=dark] .index-recordCourseTitle-eT8nU {
    color: #d3d3d3
}

html[data-theme=dark] .index-root-pqCRt .title .index-hover-mfuGW {
    color: #d3d3d3
}

html[data-theme=dark] .index-root-pqCRt .title:hover .index-hover-mfuGW {
    color: #0084ff
}

html[data-theme=dark] .index-authorName-qsoxS {
    color: #d3d3d3
}

html[data-theme=dark] .css-vl4iaa {
    color: #d3d3d3
}

html[data-theme=dark] .css-1ng3oge {
    color: #d3d3d3
}

html[data-theme=dark] .css-1myqwel {
    color: #d3d3d3
}

html[data-theme=dark] .css-p52k8h {
    color: #d3d3d3
}

html[data-theme=dark] .css-25wprl {
    color: #d3d3d3
}

html[data-theme=dark] .css-1g4zjtl {
    color: #d3d3d3
}

html[data-theme=dark] .css-1m63gvn {
    color: #d3d3d3
}

html[data-theme=dark] .css-1k10w8f {
    color: #d3d3d3
}

html[data-theme=dark] .css-o7lu8j {
    color: #d3d3d3
}

html[data-theme=dark] .css-74475r {
    color: #d3d3d3
}

html[data-theme=dark] .css-cgmw6p {
    color: #d3d3d3
}

.ContentItem-convertVideoButton:hover {
    color: red
}

.ContentItem-convertVideoButton:hover svg {
    fill: red
}

html[data-theme=dark] .ContentItem-convertVideoButton:hover {
    color: red
}

html[data-theme=dark] .ContentItem-convertVideoButton:hover svg {
    fill: red;
    filter: brightness(1) !important;
}

.CommentItemV2-footer .Button:last-of-type {
    margin-left: 20px;
}

.CreationCard-ActionButton.css-r3cz0w .Zi--Comments path {
    fill: #8590A6
}

.CreationCard-ActionButton.css-r3cz0w:hover .Zi--Comments path {
    fill: #00FF7F
}

.css-s8vbhp button:hover {
    color: purple
}

.css-s8vbhp button:hover .Zi--More {
    fill: purple
}

html[data-theme=light] a.Menu-item.is-active {
    color: black
}

.css-90wyh8 {
    color: black !important
}

html[data-theme=dark] .css-90wyh8 {
    color: #8590A6 !important
}

.css-1m60na {
    color: black !important
}

html[data-theme=dark] .css-1m60na {
    color: #8590A6 !important
}

.VessayTabs .Tabs-item.active .Tabs-link {
    color: white
}

.VessayTabs .Tabs-item.active:after {
    background: white
}

.ShareMenu-wechat:hover {
    background: #f6f6f6
}

html[data-theme=dark] .ShareMenu-wechat:hover {
    background: #1b1b1b
}

.ExploreHeader-tab {
    color: black
}

html[data-theme=dark] .ExploreHeader-tab {
    color: #d3d3d3
}

.css-1uan5v7 {
    color: black
}

html[data-theme=dark] .css-1uan5v7 {
    color: #d3d3d3
}

.css-119896g {
    color: #8590A6
}

html[data-theme=dark] .css-1bnklpv {
    color: #d3d3d3
}

html[data-theme=dark] .css-wh3ya8 {
    color: #d3d3d3
}

.Button.unfollow_columns:hover {
    color: #0084ff
}

.Button.Tag.flowTag {
    margin: 0px 8px 3px 0px;
    border-radius: 100px;
    border: none;
    padding: 0px;
    width: 52px;
}

.Button.Tag.flowTag .Tag-content {
    color: white;
    font-weight: 400
}

.TopNavBar-searchBar-wM9EY {
    margin-left: 30px !important
}

button.Button:hover .Zi--SquareDots {
    color: #FF8C00
}

.css-1x8hcdw {
    -webkit-transition-duration: 0s;
    transition-duration: 0s;
}

.css-ug457g {
    -webkit-transition-duration: 0s;
    transition-duration: 0s;
}

.css-1f6tgea {
    -webkit-transition-duration: 0s;
    transition-duration: 0s;
}

html[data-theme=dark] .css-z3cdac {
    border-bottom: 1px solid #2e2e2e
}

html[data-theme=dark] .css-1e9xwcu {
    border: 1px solid #2e2e2e
}

html[data-theme=dark] .AnswerForm-footer {
    border: 1px solid #2e2e2e
}

html[data-theme=dark] .css-ir23yd .InputLike {
    border: none !important
}

html[data-theme=dark] .css-ir23yd {
    border: 1px solid #2e2e2e
}

html[data-theme=dark] .css-x0pxoz .InputLike {
    border: none !important
}

html[data-theme=dark] .css-i20zrt {
    background: #2e2e2e;
    display: none
}

html[data-theme=dark] .css-zadorc {
    background: #2e2e2e
}

html[data-theme=dark] .css-16eulm {
    background: #2e2e2e
}

html[data-theme=dark] .css-1rffuvb {
    background: #2e2e2e
}

html[data-theme=dark] .css-10175to {
    color: #2e2e2e
}

html[data-theme=dark] .css-qlh3fm::before {
    border-top: 1px solid #2e2e2e
}

html[data-theme=dark] .css-1et71w6::before {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-1dmyrh6::before {
    border-top: 1px solid #444
}

html[data-theme=dark] .css-132sfb2::before {
    border-top: 1px solid #444
}

html[data-theme=dark] .css-1qjzmdv {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-g3xs10 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-qlh3fm {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1shga26 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1vk6f8t {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-6lfjtn {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-qniote-Header {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .AnswerForm-fullscreenScroller {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .AnswerForm-fullscreenContent .AnswerForm-footer {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-vurnku {
    color: #d3d3d3
}

html[data-theme=dark] .MyShelf-bookCell-oATrk .MyShelf-bookInfo-jchSK .MyShelf-bookTitle-5bHFD {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-skuItem-iDCBE .RankingList-author-dk4vg {
    color: #d3d3d3
}

html[data-theme=dark] .RecommendFeed-skuRecommendCell-goXoC .RecommendFeed-skuTitle-86JQc {
    color: #444
}

html[data-theme=dark] .RankingList-header-epvWm .RankingList-tabList-dRs8z .RankingList-title-qhXL3 {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-header-epvWm .RankingList-tabList-dRs8z .RankingList-tabItem-hWjTE {
    color: #d3d3d3
}

html[data-theme=dark] .SuperStarList-title-9SLN8 {
    color: #d3d3d3
}

html[data-theme=dark] .MyShelf-title-dKjJS {
    color: #d3d3d3
}

html[data-theme=dark] .ShelfCell-title-v5pbX {
    color: #d3d3d3
}

html[data-theme=dark] .RecommendFeed-title-r8118 {
    color: #d3d3d3
}

html[data-theme=dark] .css-13brsx3 {
    color: #d3d3d3
}

html[data-theme=dark] .SuperStarList-skuCell-8Fyd4 .SuperStarList-skuTitle-rj46b {
    color: #d3d3d3
}

html[data-theme=dark] .RankingList-skuItem-iDCBE .RankingList-title-qhXL3 {
    color: #d3d3d3
}

html[data-theme=dark] .CarouselBanner-leftTurnPageBtn-4Us1a,
html[data-theme=dark] .CarouselBanner-rightTurnPageBtn-soR95 {
    color: #444
}

html[data-theme=dark] .MemberInfoPanel-info-x6X35 .MemberInfoPanel-userName-vctAu {
    color: #444
}

html[data-theme=dark] .MemberInfoPanel-info-x6X35 .MemberInfoPanel-memberBtn-xkU3p {
    filter: brightness(0.6) !important;
}

html[data-theme=dark] .SuperStarList-starCell-vgecF.SuperStarList-active-4BdFk .SuperStarList-name-3yW7u {
    color: #444;
    background: #dbaf72
}

html[data-theme=dark] .MenuBar-root-rQeFm {
    border-bottom: 10px solid rgb(18, 18, 18)
}

html[data-theme=dark] .css-9gcdwe {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-dpj044 {
    background: rgb(18, 18, 18)
}

.TopNavBar-inner-77oXV .TopNavBar-searchBar-uo31N {
    margin-left: 30px
}

html[data-theme=dark] .ZhihuEPub h1,
html[data-theme=dark] .ZhihuEPub h2,
html[data-theme=dark] .ZhihuEPub h3,
html[data-theme=dark] .ZhihuEPub h4,
html[data-theme=dark] .ZhihuEPub h5,
html[data-theme=dark] .ZhihuEPub h6 {
    color: #8590A6
}

html[data-theme=dark] .ZhihuEPub p {
    color: #8590A6
}

html[data-theme=dark] .ZhihuEPubCopyright p {
    color: #8590A6
}

html[data-theme=dark] .App-root-r8X6V {
    border: 1px solid rgb(18, 18, 18)
}

html[data-theme=dark] .Labels-labelButton-oroWw {
    background: #f6f6f629
}

html[data-theme=dark] .css-1sclke5-Label {
    background: #f6f6f629
}

html[data-theme=dark] .css-14olo3l {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] span.Formula.isEditable {
    filter: invert(1) brightness(0.7) !important;
}

html[data-theme=dark] .ztext img[eeimg] {
    filter: invert(1) brightness(0.7) !important;
}

html[data-theme=dark] textarea.Input {
    color: #d3d3d3
}

.AnswerForm-fullscreenContent .AnswerForm-container {
    max-width: 1000px
}

.AnswerForm-fullscreenContent .Editable-toolbar.css-1yorl4t {
    width: 1000px;
}

.AnswerForm-fullscreenContent .Dropzone.Editable-content.RichText.RichText--editable.RichText--clearBoth.ztext {
    width: 1000px;
}

.AnswerForm-fullscreenContent .AnswerForm-footer {
    margin-left: 23px
}

.AnswerForm-fullscreenContent .css-1vk6f8t {
    max-width: 1040px;
    width: 1040px;
}

.AnswerForm-fullscreenContent .css-6lfjtn {
    max-width: 1040px;
    width: 1040px;
}

html[data-theme=dark] .css-q78bto {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bstlqk {
    color: #d3d3d3
}

html[data-theme=dark] .css-16p5ii9 {
    color: #d3d3d3
}

html[data-theme=dark] .SearchQustion-item-title {
    color: #d3d3d3
}

html[data-theme=dark] .css-1gnydn2 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1ravq34 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-iebf30 {
    background: rgb(18, 18, 18)
}

.RichText-MCNLinkCardContainer {
    display: none !important
}

.RichText-ADLinkCardContainer {
    display: none !important
}

.css-zxzkug {
    border: none !important
}

.AppHeader-userInfo .Popover button div {
    border: none !important
}

.AppHeaderProfileMenu-item.css-1e76yen {
    color: black
}

.css-arjme8 .AnswerForm-editor .RichText--editable {
    padding: 12px 20px;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.css-1e76yen {
    color: #d3d3d3
}

html[data-theme=dark] .css-13ooiry {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-sfrmtq {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1ql7em1 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-muf5zb {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-h2vgdz {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1kjuah9 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1pfsia3 {
    background: rgb(18, 18, 18);
    padding-left: 0px;
    padding-right: 0px
}

.css-1pfsia3 {
    padding-left: 0px;
    padding-right: 0px
}

html[data-theme=dark] .css-jis2as {
    background: rgb(18, 18, 18);
    border: 1px solid #444;
    padding: 20px 0px 0px 0px;
}

.css-jis2as {
    padding: 20px 0px 0px 0px;
}

html[data-theme=dark] .CollectionDetailPageItem .ContentItem-actions {
    margin: 0 -15px -10px;
}

html[data-theme=dark] .css-1k7a5k5 {
    background: rgb(18, 18, 18);
    border: 1px solid #444;
}

html[data-theme=dark] .css-6tr06j {
    background: rgb(18, 18, 18);
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-1jly315 {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
    border: none;
    margin-left: 20px
}

html[data-theme=dark] .css-1wj5qng {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
}

html[data-theme=dark] .css-58rhkd {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1q919rp {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
}

html[data-theme=dark] .css-1fjt1kp {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
}

.css-1jly315 {
    margin-left: 20px
}

.css-ae93cn {
    margin: 0px 0px 0px 20px
}

.css-be2u3 {
    margin: 0px 0px 0px 10px
}

html[data-theme=dark] .css-dvxtzn {
    color: #d3d3d3
}

html[data-theme=dark] .css-ae93cn {
    color: #d3d3d3
}

html[data-theme=dark] .css-1nj8b26 {
    color: #d3d3d3
}

html[data-theme=dark] .css-16u8gs4 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1wi0qk8 {
    box-shadow: #444 0px -0.5px 0px 0px inset
}

html[data-theme=dark] .css-sfrmtq {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1js8um3.Button.Button--plain:hover {
    background: #4444449e;
}

html[data-theme=dark] .css-k5tfim.Button.Button--plain:hover {
    background: #4444449e;
}

html[data-theme=dark] .css-suv4d2.Button.Button--plain:hover {
    background: #4444449e;
}

html[data-theme=dark] .css-tg2k1h.Button.Button--plain {
    color: #d3d3d3;
}

html[data-theme=dark] .css-tg2k1h.Button.Button--plain:hover {
    background: #4444449e;
    color: #d3d3d3;
}

html[data-theme=dark] .css-bq0zzv {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-1r0kkal {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1zj9li {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .Avatar {
    background: #fff
}

html[data-theme=dark] .css-19v79p5 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-10fqe38 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-sdgtgb {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1r0kkal {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-tgvbkv {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1envny0 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .EditorHelpDoc {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-p7qmtz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1aryoh2 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .CreatorSalt-personal-information .CreatorSalt-modal-tips {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-8br8qd {
    background: rgb(18, 18, 18);
    color: #8590A6;
    border: 2px solid #2e2e2e;
}

html[data-theme=dark] .css-o1wuhr {
    background: rgb(18, 18, 18);
    color: #8590A6;
    border: 2px solid #2e2e2e;
}

html[data-theme=dark] .css-gifp1u {
    background: rgb(18, 18, 18);
    color: #d3d3d3;
    border: 1px solid #8590a65c;
}

html[data-theme=dark] .css-18ve2gf {
    background: rgb(18, 18, 18);
    color: #8590A6;
    border-bottom: 1px solid #2e2e2e;
}

html[data-theme=dark] .css-1niwbj7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-15etoc5 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1trd12v {
    color: #d3d3d3
}

html[data-theme=dark] .css-1e8kdsc {
    color: #d3d3d3
}

html[data-theme=dark] .css-ibcizu {
    color: #d3d3d3
}

html[data-theme=dark] .css-111m6w7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1ft9ymu {
    color: #d3d3d3
}

html[data-theme=dark] .css-g03cqe {
    color: #d3d3d3
}

html[data-theme=dark] .css-1ak5q6x {
    color: #d3d3d3
}

html[data-theme=dark] .css-1z0ztic {
    color: #d3d3d3
}

html[data-theme=dark] .css-1iw0hlv {
    color: #d3d3d3
}

html[data-theme=dark] .css-1nd7dqm {
    color: #d3d3d3
}

html[data-theme=dark] .css-1t9bp9f {
    color: #d3d3d3
}

.css-1t9bp9f {
    color: black
}

html[data-theme=dark] .css-4c3rcz svg {
    fill: #d3d3d3 !important
}

html[data-theme=dark] .Creator-QuestionShared-title.css-1m2h1o9 {
    color: #d3d3d3
}

.css-ot0irg {
    margin: 0px 0px 0px 20px !important
}

/*.Menu.AnswerItem-selfMenu{display:none!important}*/
.Menu.QuestionHeader-menu {
    display: none !important
}

.TopNavBar-vectorIcon-73v25 {
    display: none !important
}

input.Input.setfont.ariafont14 {
    background: transparent !important
}

.HotItem:hover .HotItem-metrics {
    color: #ff0000d6
}

html[data-theme=dark] .Header-module-title-1Q5e {
    color: #d3d3d3
}

html[data-theme=dark] css-3dzvwq {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bj56ke {
    color: #d3d3d3
}

html[data-theme=dark] .css-1nne2a7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-18b1ycz {
    color: #d3d3d3
}

html[data-theme=dark] .css-kbzfrw {
    color: #d3d3d3
}

html[data-theme=dark] .css-1hj35rq {
    color: #d3d3d3
}

html[data-theme=dark] .css-13erwii {
    color: #d3d3d3
}

html[data-theme=dark] .css-jzr1wa {
    color: #d3d3d3
}

html[data-theme=dark] .css-1j9cunp {
    color: #d3d3d3
}

html[data-theme=dark] .css-10abirk {
    color: #d3d3d3
}

html[data-theme=dark] .css-1hwbgi1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-l22qv5 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1gip1fb {
    color: #d3d3d3
}

html[data-theme=dark] [class*="GotoAppDialog-line_"] {
    color: #d3d3d3
}

html[data-theme=dark] .GotoAppDialog-triangle-gNmhi {
    border-top-color: #d3d3d3
}

html[data-theme=dark] .GotoAppDialog-triangle_circle-hFW6W {
    background: #d3d3d3
}

html[data-theme=dark] .GotoAppDialog-qrcode-u9uCN {
    background: #d3d3d3
}

html[data-theme=dark] .HeaderInfo-title-h6ouo {
    color: #d3d3d3
}

html[data-theme=dark] .Section-title-7anGr {
    color: #d3d3d3
}

html[data-theme=dark] .AuthorsSection-headerTitle-4NeB7 {
    color: #d3d3d3
}

html[data-theme=dark] .ReviewsList-title-isoCs {
    color: #d3d3d3
}

html[data-theme=dark] a.UserCell-link-mRcUN {
    color: #d3d3d3
}

html[data-theme=dark] .CatalogModule-title-9caZz {
    color: #d3d3d3
}

html[data-theme=dark] .BookItem-title-nTgtT {
    color: #d3d3d3
}

html[data-theme=dark] .ReviewInfo-reviewCount-3Sk8Z {
    color: #d3d3d3
}

html[data-theme=dark] .Interpreters-title-hCj2x {
    color: #d3d3d3
}

html[data-theme=dark] .SkuCell-title-9LGVz {
    color: #d3d3d3
}

html[data-theme=dark] .QuestionItem-title-3XX9w {
    color: #d3d3d3
}

html[data-theme=dark] .UserCell-name-vkTkJ {
    color: #d3d3d3 !important
}

html[data-theme=dark] .UserCell-desc-ety4W {
    color: #d3d3d3 !important
}

html[data-theme=dark] .css-169dic9 {
    color: #d3d3d3 !important
}

html[data-theme=dark] .css-r7nsay {
    color: #d3d3d3 !important
}

html[data-theme=dark] .NewHeader-module-title--1-3Xu3 {
    color: #d3d3d3 !important
}

html[data-theme=dark] .ManuscriptTitle-root-pE6Xx {
    color: #d3d3d3 !important
}

html[data-theme=dark] .ProductCardNew-title-rymdz {
    color: #d3d3d3 !important
}

html[data-theme=dark] .BookInfo-section-uWdft .BookInfo-title-88mBY {
    color: #d3d3d3
}

html[data-theme=dark] .SearchBar-input input.Input {
    color: #d3d3d3 !important
}

html[data-theme=dark] .RecommendFeed-skuRecommendCell-goXoC .RecommendFeed-skuTitle-86JQc {
    color: #d3d3d3
}

html[data-theme=dark] .css-uliqdc .css-0.setfont.ariafont15 {
    color: #d3d3d3
}

html[data-theme=dark] .NewBottomBar-defaultColor-9kLGw path:nth-child(2) {
    fill: #d3d3d3
}

html[data-theme=dark] .NewBottomBar-root-dVXzD {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-yhjwoe {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-13dk2dh {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1crdb1y {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1sasmtd .css-vurnku {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-70dlgi {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-42epbo {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-v48dmn {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-jlyj5p {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-ndqbqd {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-g7m146 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1nu6k5h {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-6m0gz1 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-gay8qr {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1gip1fb {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1gvsmgz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1onq0ea {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1k3jzd0 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1sgk1dw {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-blkyql {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1h84h63 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-4fbeq5 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1kyqks8 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-geku0 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-f955pw {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-pslzz3 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-19dx6uk {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-xqep55 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1l6scuv {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1vwsb96 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-2vw1x6 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-vsscmp {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-2kn3ar {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1r9j229 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-jukrrm {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1k8sxfm {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-qc26up {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1pd8hyb {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-99cxhp {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-lmhi8a {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-jpzy4w {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-17oyyq4 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-rtxt89 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-uog1ui {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-t65k75 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-805ti0 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1gg5c0d {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1pw1ln {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-ibhcpf {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Learned-tab-9Lce5 .Learned-tabTitle-j1ygz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .PcContentBought-root-bRUMJ {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .index-learningRecord-eGQjv {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .StickerPopover {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .StickerPopoverArrow {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .ImgContainer-Bg {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .QuestionWaiting-typesTopper {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-userInfo-djuAz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-card-vZ9YC {
    background: rgb(18, 18, 18);
    color: #d3d3d3
}

html[data-theme=dark] .Tab-tab-b9fvk .Tab-tabTitle-nrMPz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Tab-tab-b9fvk .Tab-placeHolder-2QhHS {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Structure-structure-PMEqr {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Structure-structure-PMEqr .Structure-item-os59r {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .LecturerCard-lectureCardWrapper-qnnTg {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .PcContent-coverFix-3T97g {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .Article-article-6PZ5y .Article-header-eNnYf {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-mNnq8 .VideoCourseCard-cover-eitUq {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .PcContent-content-9URDE .PcContent-learningRecord-mAzPm {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .LearningPathWayCard-pathItem-iv5Ey {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .VideoCourseList-title-i5Gf5 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .PcContent-root-eFGC1 {
    background: rgb(18, 18, 18);
}

.EpisodeList-duration-vPSzj {
    color: #0084ff
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-userInfo-djuAz img {
    background: white
}

html[data-theme=dark] .EpisodeList-duration-vPSzj {
    background: rgb(18, 18, 18);
    color: #0084ff
}

html[data-theme=dark] .EpisodeList-sectionItem-5wzFz {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .EpisodeList-chapterTitle-koA6R {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .EpisodeList-episodeListCon-dhDT7 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .index-content-jNRgg {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .index-tabWrap-4Smyx {
    background: rgb(18, 18, 18);
    border: 1px solid #444
}

html[data-theme=dark] .index-tabList-3wASC {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1ulkprw::before {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1ulkprw {
    background: rgb(18, 18, 18);
    border-bottom: 1px solid #2e2e2e;
}

html[data-theme=dark] .css-1c1uom {
    background: rgb(18, 18, 18);
    border: 1px solid #2e2e2e;
}

html[data-theme=dark] .css-1j144gx {
    background: #9e9e9e;
}

html[data-theme=dark] .css-n0ut2q {
    background: #0084FF;
}

html[data-theme=dark] .css-1eddc7k {
    background: #d3d3d3;
}

html[data-theme=dark] .css-1ne387d {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1lb5y3y {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1bi2006 {
    background: rgb(18, 18, 18);
    animation: none
}

html[data-theme=dark] .css-1w5juwq {
    background: rgb(18, 18, 18);
    animation: none
}

html[data-theme=dark] .css-1ggwojn {
    background: rgb(18, 18, 18);
    border-bottom: 20px solid rgb(18, 18, 18)
}

html[data-theme=dark] .Button.css-1slasee {
    background: rgb(18, 18, 18);
    color: #8590A6;
    border: 1px solid #444
}

html[data-theme=dark] .Button.css-1slasee:hover {
    color: #0084FF;
}

.Button.css-1slasee:hover {
    color: #0084FF;
}

html[data-theme=dark] .css-ixdvjo {
    background: rgb(18, 18, 18);
    border: 1px solid #444
}

html[data-theme=dark] .css-1w9xlll {
    background: rgb(18, 18, 18);
    border: none
}

html[data-theme=dark] .css-1wqupar {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-juilaj div {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .entry___B74c- {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .UserCell-root-rxd1i {
    background: rgb(18, 18, 18) !important;
}

html[data-theme=dark] .StickerPreview-User img {
    background: white
}

html[data-theme=dark] .css-1crdb1y {
    color: #d3d3d3
}

html[data-theme=dark] .css-1evsiqj {
    color: #d3d3d3
}

html[data-theme=dark] .css-nymych {
    color: #d3d3d3
}

html[data-theme=dark] .css-25boxq {
    color: #d3d3d3
}

html[data-theme=dark] .css-15991wd {
    color: #d3d3d3
}

html[data-theme=dark] .css-zo9z3h {
    color: #d3d3d3
}

html[data-theme=dark] .css-p54g1l {
    color: #d3d3d3
}

html[data-theme=dark] .css-13eoys0 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1dgkfnj {
    color: #d3d3d3
}

html[data-theme=dark] .css-3dx4z1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-13asnfo {
    color: #d3d3d3
}

html[data-theme=dark] .css-uk6oel {
    color: #d3d3d3
}

html[data-theme=dark] .css-1dpmqsl {
    color: #d3d3d3
}

html[data-theme=dark] .css-1grt2f7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-jlrtgs {
    color: #d3d3d3
}

html[data-theme=dark] .css-xwnz4l {
    color: #d3d3d3
}

html[data-theme=dark] .css-g5pox1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-vn6wag {
    color: #d3d3d3
}

html[data-theme=dark] .css-13jf0ln {
    color: #d3d3d3
}

html[data-theme=dark] .css-qwfeb4 {
    color: #d3d3d3
}

html[data-theme=dark] .css-jn7ejp {
    color: #d3d3d3
}

html[data-theme=dark] .css-mrpzg7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-120h9fi {
    color: #d3d3d3
}

html[data-theme=dark] .css-12y95y7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-3y6j4x {
    color: #d3d3d3
}

html[data-theme=dark] .css-9q2iac {
    color: #d3d3d3
}

html[data-theme=dark] .css-kiaw5d {
    color: #d3d3d3
}

html[data-theme=dark] .css-13ilkp4 {
    color: #d3d3d3
}

html[data-theme=dark] .css-jn6bg1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-81kmzo {
    color: #d3d3d3
}

html[data-theme=dark] .css-3ibr72 {
    color: #d3d3d3
}

html[data-theme=dark] .css-2orvqp {
    color: #d3d3d3
}

html[data-theme=dark] .css-18w9eo6 {
    color: #d3d3d3
}

html[data-theme=dark] .css-4zqdza {
    color: #d3d3d3
}

html[data-theme=dark] .css-1j0bytm {
    color: #d3d3d3
}

html[data-theme=dark] .css-zl3dgz {
    color: #d3d3d3
}

html[data-theme=dark] .css-1xgvjg8 {
    color: #d3d3d3
}

html[data-theme=dark] .css-xa9jmo {
    color: #d3d3d3
}

html[data-theme=dark] .css-uaxmgr {
    color: #d3d3d3
}

html[data-theme=dark] .css-cwwtjd {
    color: #d3d3d3
}

html[data-theme=dark] .css-3karba {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bxoeey {
    color: #d3d3d3
}

html[data-theme=dark] .css-1rxve6k {
    color: #d3d3d3
}

html[data-theme=dark] .css-1nwtaha {
    color: #d3d3d3
}

html[data-theme=dark] .css-348wka {
    color: #d3d3d3
}

html[data-theme=dark] .css-1fg3px3 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bu0eui {
    color: #d3d3d3
}

html[data-theme=dark] .css-1esj255 {
    color: #d3d3d3
}

html[data-theme=dark] .css-gtgb1u {
    color: #d3d3d3
}

html[data-theme=dark] .css-1uz8l7v {
    color: #d3d3d3
}

html[data-theme=dark] .css-jkt44i {
    color: #d3d3d3
}

html[data-theme=dark] .css-a7cxzt {
    color: #d3d3d3
}

html[data-theme=dark] .css-wsl5m6 {
    color: #d3d3d3
}

html[data-theme=dark] .css-c52bb {
    color: #d3d3d3
}

html[data-theme=dark] .css-116ccuj {
    color: #d3d3d3
}

html[data-theme=dark] .css-2f1ndz {
    color: #d3d3d3
}

html[data-theme=dark] .css-40rjat {
    color: #d3d3d3
}

html[data-theme=dark] .css-1iw8gi5 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1y4e8ra {
    color: #d3d3d3
}

html[data-theme=dark] .css-6orcwk {
    color: #d3d3d3
}

html[data-theme=dark] .css-9pivh5 {
    color: #d3d3d3
}

html[data-theme=dark] .css-gd3e4d {
    color: #d3d3d3
}

html[data-theme=dark] .css-kihs6l {
    color: #d3d3d3
}

html[data-theme=dark] .css-tnsaxh {
    color: #d3d3d3
}

html[data-theme=dark] .css-1vgfg1a {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bbvash {
    color: #d3d3d3
}

html[data-theme=dark] .css-43a2pm {
    color: #d3d3d3
}

html[data-theme=dark] .css-1ozlzcd {
    color: #d3d3d3
}

html[data-theme=dark] .css-1efbqx7 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1bfi5pu {
    color: #d3d3d3
}

html[data-theme=dark] .css-195d1c3 {
    color: #d3d3d3
}

html[data-theme=dark] .css-gsyo2n {
    color: #d3d3d3
}

html[data-theme=dark] .css-1ygdre8 {
    color: #d3d3d3
}

html[data-theme=dark] .css-9cejo9 {
    color: #d3d3d3
}

html[data-theme=dark] .css-14wq2b1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-4fdgaw {
    color: #d3d3d3
}

html[data-theme=dark] .css-owmotd {
    color: #d3d3d3
}

html[data-theme=dark] .css-1rjujr1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-12squ1l {
    color: #d3d3d3
}

html[data-theme=dark] .css-1rr6cp2 {
    color: #d3d3d3
}

html[data-theme=dark] .css-1a1ypbl {
    color: #d3d3d3
}

html[data-theme=dark] .Structure-structure-pD2Y3 .Structure-item-rNKiF a {
    color: #d3d3d3
}

html[data-theme=dark] .Structure-structure-pD2Y3 .Structure-item-rNKiF.Structure-activeItem-sE3wB a {
    color: #06f
}

html[data-theme=dark] span.index-left-hgVhw.index-text-6fdDo {
    color: #d3d3d3
}

html[data-theme=dark] a.index-right-bpc5y.index-text-6fdDo {
    color: #8590A6
}

html[data-theme=dark] .css-1nwr96x .CreatorTable-tableData {
    color: #d3d3d3
}

.css-1ygdre8 {
    color: black
}

.css-1tww9qq span:nth-child(1) {
    color: black;
    font-weight: bold
}

html[data-theme=dark] .ZDI--QuestionCircle24 {
    fill: #8590A6 !important;
    filter: brightness(1) !important;
}

html[data-theme=dark] .css-1tww9qq span:nth-child(1) {
    color: #d3d3d3;
    font-weight: bold
}

html[data-theme=dark] .ReviewCell-pc-xqgr3 .ReviewCell-headline-fTt5d {
    color: #999
}

html[data-theme=dark] .Header-pc-tuEpA .Header-chapterButton-nBx53 {
    color: #d3d3d3
}

html[data-theme=dark] .ReviewCell-pc-xqgr3 .ReviewCell-authorName-rntXj {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-card-vZ9YC .Achievement-first-pWK1D .Achievement-num-dCdEa {
    color: #d3d3d3
}

html[data-theme=dark] .css-9cejo9 p {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-card-vZ9YC .Achievement-first-pWK1D .Achievement-label-w9tg9 {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-c53Uo .Achievement-userInfo-djuAz .Achievement-userName-n8maR {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-xvwNy .VideoCourseCard-rightContent-uAj3N .VideoCourseCard-title-siFeQ {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-xvwNy .VideoCourseCard-rightContent-uAj3N .VideoCourseCard-author-qeat7 .VideoCourseCard-authorName-g8Cva {
    color: #d3d3d3;
}

html[data-theme=dark] .Tab-tab-b9fvk .Tab-tabTitle-nrMPz .Tab-item-gGXLM {
    color: #d3d3d3;
}

html[data-theme=dark] .Tab-tab-b9fvk .Tab-tabTitle-nrMPz .Tab-activeItem-2Pp4v {
    color: #0084ff;
}

html[data-theme=dark] .RecommendModule-moduleWrapper-2gVnZ .RecommendModule-moduleTitle-ehV2F {
    color: #d3d3d3
}

html[data-theme=dark] .CourseItem-rightContent-4p3qc .CourseItem-courseTitle-2hYnF {
    color: #d3d3d3
}

html[data-theme=dark] .CourseItem-rightContent-4p3qc .CourseItem-courseTitle-2hYnF:hover {
    color: #0084ff
}

html[data-theme=dark] .LecturerCard-desc-wLJBX {
    color: #d3d3d3
}

html[data-theme=dark] .LecturerCard-intro-k1BG1 {
    color: #d3d3d3
}

html[data-theme=dark] .LecturerCard-fullname-hNRR4 {
    color: #d3d3d3
}

html[data-theme=dark] .CourseDescription-playCount-kwVHf {
    color: #d3d3d3
}

html[data-theme=dark] .LecturerList-title-omdNR {
    color: #d3d3d3
}

html[data-theme=dark] .LecturerCard-dialog-e6BZW .LecturerCard-introduction-5GRpX {
    color: #d3d3d3
}

html[data-theme=dark] .Banner-desc-ssgsA {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseList-title-i5Gf5 .VideoCourseList-text-h7we6 {
    color: #d3d3d3
}

html[data-theme=dark] .Article-article-6PZ5y .Article-header-eNnYf .Article-title-whVN2 {
    color: #d3d3d3
}

html[data-theme=dark] .LearningPathWayCard-pathItem-iv5Ey .LearningPathWayCard-right-tBY2X .LearningPathWayCard-detail-ir7kn {
    color: #d3d3d3
}

html[data-theme=dark] .LearningPathWayCard-pathItem-iv5Ey .LearningPathWayCard-right-tBY2X .LearningPathWayCard-title-saKKa {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-mNnq8 .VideoCourseCard-title-jGQDV {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-mNnq8 .VideoCourseCard-author-axmAy .VideoCourseCard-authorName-ikENW {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-mNnq8 .VideoCourseCard-records-nEMPH {
    color: #d3d3d3
}

html[data-theme=dark] .Article-article-6PZ5y .Article-header-eNnYf .Article-superior-bFEUh {
    color: #d3d3d3
}

html[data-theme=dark] .PcContent-content-9URDE .PcContent-learningRecord-mAzPm .PcContent-text-bRqSw span {
    color: #d3d3d3
}

html[data-theme=dark] .artic .pages_content .pages_title h2 {
    color: #d3d3d3
}

html[data-theme=dark] .ZhiPlusApplyCommon-title {
    color: #d3d3d3
}

html[data-theme=dark] .ZhiPlusApplyHome-descTitle {
    color: #d3d3d3
}

html[data-theme=dark] .EpisodeList-catalog-s9XZz {
    color: #d3d3d3
}

html[data-theme=dark] .EpisodeList-chapterTitle-koA6R {
    color: #d3d3d3
}

html[data-theme=dark] .css-74475r a.internal,
html[data-theme=dark] .css-74475r a.external {
    color: #d3d3d3;
    border-bottom: 1px solid #999;
}

html[data-theme=dark] .css-74475r a.internal:hover,
html[data-theme=dark] .css-74475r a.external:hover {
    color: #6385a6;
    border-bottom: 1px solid #6385a6;
}

html[data-theme=dark] .index-text-syTkE {
    color: #d3d3d3
}

html[data-theme=dark] .index-title-6Yv3N {
    color: #d3d3d3
}

html[data-theme=dark] .index-title-dhShT {
    color: #d3d3d3
}

html[data-theme=dark] .index-authorName-7ESKF {
    color: #d3d3d3
}

html[data-theme=dark] .index-title-mPEZh {
    color: #d3d3d3
}

html[data-theme=dark] .index-item-mo6Mb {
    color: #d3d3d3
}

html[data-theme=dark] .index-answerItemtitle-aHRVV {
    color: #d3d3d3
}

html[data-theme=dark] .index-item-mo6Mb.index-selectTab-cNKP9 {
    background: rgba(0, 102, 255, .08);
    border: none;
    color: #0084FF
}

html[data-theme=dark] .css-14fro2i .RichText.ztext.css-18edm6j {
    color: #d3d3d3
}

html[data-theme=dark] .css-1crzugl {
    color: #0084FF
}

html[data-theme=dark] .css-kkip9h {
    fill: #d3d3d3
}

html[data-theme=dark] .css-1ujuaq7 {
    fill: #d3d3d3
}

html[data-theme=dark] .css-1xzy5dd {
    background: #d3d3d3
}

html[data-theme=dark] .css-1yofszl:hover svg.ZDI {
    color: #d3d3d3;
    filter: brightness(1)
}

html[data-theme=dark] .css-1yofszl:hover div {
    color: #d3d3d3
}

html[data-theme=dark] .DraftHistory-title {
    color: #d3d3d3
}

html[data-theme=dark] .DraftHistory-versionDate {
    color: #d3d3d3
}

html[data-theme=dark] .DraftHistory-draftTitle {
    color: #d3d3d3
}

html[data-theme=dark] .LinkCard.new .LinkCard-title {
    color: #d3d3d3
}

html[data-theme=dark] .DraftHistory-version--selected:after {
    background: #d3d3d3;
    box-shadow: 0 0 0 2px #121212, 0 0 0 3px #d3d3d3;
}

html[data-theme=dark] .css-tf8o0f {
    background: #d3d3d3
}

html[data-theme=dark] a.NavItemActiveClassName {
    color: #d3d3d3
}

html[data-theme=dark] .NavItemClassName {
    color: #d3d3d3
}

html[data-theme=dark] .UserHeader-NameSpan {
    color: #d3d3d3
}

html[data-theme=dark] .WechatBind-bounded {
    color: #d3d3d3
}

html[data-theme=dark] .SelectorField-title h4 {
    color: #d3d3d3
}

html[data-theme=dark] .CreatorSalt-textarea-input {
    color: #d3d3d3
}

html[data-theme=dark] .Calendar-topToolDate {
    color: #d3d3d3
}

html[data-theme=dark] .css-1epee6j .CreatorTable-tableData {
    color: #d3d3d3
}

html[data-theme=dark] .css-f7rzgf {
    color: #8590a6;
    background: rgb(18, 18, 18);
    border: 1px solid #2e2e2e !important
}

html[data-theme=dark] .css-19dx6uk {
    border: 1px solid #2e2e2e !important
}

html[data-theme=dark] .css-hte1to {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .css-ko9eoy {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .css-1136uqd {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .css-1p32f2 {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .css-hhy36c {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .Structure-structure-PMEqr .Structure-item-os59r {
    color: #d3d3d3;
    background: #8080801c;
    border: 0.5px solid transparent;
}

html[data-theme=dark] .Structure-structure-PMEqr .Structure-activeItem-57Tw9 {
    color: #06f;
    font-weight: 500;
    background: rgba(0, 102, 255, .08);
    border: .5px solid rgba(0, 102, 255, .08);
}

html[data-theme=dark] .css-a7cxzt:hover {
    color: #d3d3d3;
    background: #8080801c;
}

html[data-theme=dark] .index-secondaryTabItem-ceH9p:not(.index-secondaryTabItemSelected-q4PmP) {
    color: #d3d3d3;
    background: #8080801c;
    border: 0.5px solid transparent
}

html[data-theme=dark] .Structure-structure-pD2Y3 .Structure-item-rNKiF {
    color: #d3d3d3;
    background: #8080801c;
    border: 0.5px solid transparent
}

html[data-theme=dark] .Structure-structure-pD2Y3 .Structure-activeItem-sE3wB {
    color: #06f;
    background: rgba(0, 102, 255, .08);
    border: .5px solid rgba(0, 102, 255, .08);
}

html[data-theme=dark] .css-1bm62rf {
    color: #0084FF;
    background: #8080801c;
    border: 1px solid #444;
}

html[data-theme=dark] .css-qogdkd {
    color: #d3d3d3;
    border: 1px solid #d3d3d38f;
}

html[data-theme=dark] .css-1bjcw8z {
    color: #d3d3d3;
    border: 1px solid #d3d3d38f;
}

html[data-theme=dark] .css-1bjcw8z:nth-of-type(n 2) {
    border-left: 1px solid transparent;
}

html[data-theme=dark] .css-1wrebao {
    color: #0084FF;
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-3dzvwq {
    color: #d3d3d3
}

html[data-theme=dark] .css-k6u7gr {
    color: #0084FF;
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-m974kf {
    color: #8590A6
}

.css-12squ1l {
    font-weight: bold
}

.css-17ndvmh {
    font-weight: bold
}

html[data-theme=dark] .css-17ndvmh {
    color: #8590A6
}

html[data-theme=dark] .css-1woyqhc {
    color: #8590A6
}

html[data-theme=dark] .VipInterests-Span {
    color: #ce994f
}

html[data-theme=dark] .UserHeader-LeftInfo img {
    background: white;
}

.zu-top-nav-userinfo .Avatar {
    background: white;
}

html[data-theme=dark] .css-fwzsfb {
    box-shadow: none
}

html[data-theme=dark] .css-1bdx86i {
    background: transparent;
}

html[data-theme=dark] .css-1pvv774 {
    color: transparent;
    background: transparent;
}

html[data-theme=dark] .css-1wvaud {
    color: transparent;
    background: transparent;
}

.Image-module-image-uorig {
    background: white;
    cursor: pointer
}

.MemberInfoPanel-info-x6X35 {
    height: 180px;
    padding-top: 40px
}

html[data-theme=dark] .css-1dszf3z {
    color: #37f;
    background: rgba(51, 119, 255, .1);
}

html[data-theme=dark] .Label-root-m9g5B {
    border: none
}

html[data-theme=dark] .IntroModule-synopsis-nCbKy {
    filter: brightness(0.8) !important
}

html[data-theme=dark] .css-1i5eh5t {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .creation-ranking-8ur6kw {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .creation-ranking-o89df3 {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .creation-ranking-1bcsc6 {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .creation-ranking-1c80dmb {
    filter: brightness(0.6) !important
}

html[data-theme=dark] .creation-ranking-9taffg {
    filter: none !important
}

html[data-theme=dark] .creation-ranking-1tc0xd3 {
    filter: none !important
}

.RowUserList-wrapper-4E2Ct {
    overflow-x: hidden;
}

html[data-theme=dark] .TopNavBar-inner-77oXV .TopNavBar-tab-gdypM a {
    color: #d3d3d3
}

html[data-theme=dark] .TopNavBar-logoContainer-3Ubcr .TopNavBar-zhihuLogo-4KKCK {
    color: white
}

html[data-theme=dark] .css-1xodv9x::after {
    background: #444;
}

html[data-theme=dark] .css-oietxg::after {
    background: #444;
}

html[data-theme=dark] .css-1vvynlj {
    background: #444;
}

html[data-theme=dark] .css-2m6vwd {
    background: #444;
}

html[data-theme=dark] .css-1fbmj9d {
    background: #444;
}

html[data-theme=dark] .css-1vwmxb4:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-1stnbni:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-1gip1fb:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-1lpxgo5:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-pt9hcx:not(:last-child) .Creator-Home-HotQuestionCard {
    border-bottom: 0.5px solid #444;
}

html[data-theme=dark] .css-w53kso {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-26ys39 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .is-fixed.css-26ys39 {
    background: rgb(18, 18, 18) !important;
}

html[data-theme=dark] .css-3yxeqs {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-e45g0t {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-laelx8 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-11zq2oq {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-iebf30 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-vkc1l8 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-8m4yif {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-en77lo {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-ts3erk {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1r0njij {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1niwbj7 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1vgfk12 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-geku0 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1gcxsjq {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1842imd {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-py1o25 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-tfglki {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-3v0iam {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-197xs71 {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-xvwNy {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .Interaction-root-esGak {
    border: none
}

html[data-theme=dark] .index-tabWrap-4Smyx {
    border: none
}

html[data-theme=dark] .Tab-tab-b9fvk .Tab-tabTitle-nrMPz {
    border: 1px solid transparent
}

html[data-theme=dark] .index-answerItem-29PGb {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-we6n55::before {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .ToolsCopyright-cardHeader {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-1epee6j .CreatorTable-tableRow {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-vlniwe {
    border-bottom: 1px solid #1b1b1b;
}

html[data-theme=dark] .css-dwparj {
    border: 2px dashed #444;
}

html[data-theme=dark] .css-1njot3d {
    border: 1px solid #444;
}

html[data-theme=dark] .css-100f15l {
    border: 1px solid #444;
}

html[data-theme=dark] .css-16rb3m9 {
    border: 1px solid #444;
}

html[data-theme=dark] .css-1rzq96j {
    border: 1px solid #444;
}

html[data-theme=dark] .css-1ql23fg {
    border: 1px solid #444;
}

html[data-theme=dark] .css-m8zr0l {
    border: 1px solid #444;
}

html[data-theme=dark] .css-v79isy {
    border: 1px solid #444;
}

html[data-theme=dark] .css-16vm0j7 {
    border: 1px solid #444;
}

html[data-theme=dark] .Input-wrapper {
    border: 1px solid #444;
}

html[data-theme=dark] .css-13j624k {
    border: 1px solid #444;
}

html[data-theme=dark] .css-kzr6qe {
    border: 1px solid #444;
}

html[data-theme=dark] .css-x0pxoz {
    border: 1px solid #444;
}

html[data-theme=dark] .css-90uup7 {
    border: 1px solid #444;
}

html[data-theme=dark] .css-1odu5n9 {
    border: 1px solid #444;
}

html[data-theme=dark] .css-10kdvgx {
    border: 1px solid #444;
}

html[data-theme=dark] .TopNavBar-fixInner-8MxBW .TopNavBar-searchBar-hDE1u .TopNavBar-input-sjsdr {
    border: 1px solid #444;
}

html[data-theme=dark] .css-10kl0bc {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-lmhi8a div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-a44f8k div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-yqsr75 {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-wx1uwz .CreationManage-CreationCard {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-m163kg .CreationManage-CreationCard {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-1uc08pw::before {
    border: 1px solid #444;
}

html[data-theme=dark] .css-z07uxh {
    border: none;
}

html[data-theme=dark] .css-18w5wl0 {
    border: none;
}

html[data-theme=dark] .css-asds7r::before {
    border: none;
}

html[data-theme=dark] .css-8wos8n::before {
    border: none;
}

html[data-theme=dark] .css-mzh2tk .CommentManage-CreationCard>div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-5abu0r .CommentManage-CreationCard>div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-n7efg0 .CommentManage-CreationCard>div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-9m1zov .CommentManage-CommentCard>div {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-1vm3b1t {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-lq4o9h {
    border-top: 1px solid #444;
}

html[data-theme=dark] .css-x4pr7v {
    border-right: 1px solid #444;
}

.css-qx4v2b:hover .Popover {
    background: #0084FF;
}

.css-qx4v2b:hover .css-r3cz0w {
    color: white !important;
}

html[data-theme=dark] .css-prt2gy {
    color: #0084FF;
}

html[data-theme=dark] .css-1x8xb90 .css-vurnku {
    color: #0084FF;
}

html[data-theme=dark] .css-1x8xb90 svg {
    fill: #0084FF;
}

html[data-theme=dark] .css-1sgk1dw {
    border: none
}

html[data-theme=dark] .css-1ynwv5b {
    border: none
}

html[data-theme=dark] .css-12294lk {
    border: none
}

html[data-theme=dark] .public-DraftStyleDefault-block.public-DraftStyleDefault-ltr {
    border: none
}

html[data-theme=dark] .css-blkyql {
    border: 1px solid #444;
}

html[data-theme=dark] .css-t6zj4u {
    color: #8590A6;
    background: #ffffff1c;
}

html[data-theme=dark] .css-1woo4vw:hover {
    background: #ffffff1c;
}

html[data-theme=dark] input.Input {
    color: #d3d3d3
}

html[data-theme=dark] .SelectorField-options .Select-option {
    color: #8590a6;
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-1f6hmyt {
    border-bottom: 1px solid #444;
}

html[data-theme=dark] .css-110i2yo {
    color: #37f;
    background: rgba(51, 119, 255, .1);
}

html[data-theme=dark] .css-k5567v {
    color: #37f;
    background: rgba(51, 119, 255, .1);
}

html[data-theme=dark] .css-1ygdre8 a.internal,
.css-1ygdre8 a.external {
    color: rgb(23, 81, 153);
}

.css-h9ndtl {
    color: #0084FF
}

html[data-theme=dark] .css-x7xsnd {
    background: rgb(18, 18, 18);
    color: #8590A6
}

.css-x7xsnd:hover {
    color: #0084FF
}

html[data-theme=dark] .css-x7xsnd:hover {
    color: #0084FF
}

.css-1evwjhc:hover {
    color: #0084FF
}

html[data-theme=dark] .css-1evwjhc {
    background: rgb(18, 18, 18);
    color: #8590A6
}

html[data-theme=dark] .css-1evwjhc:hover {
    color: #0084FF
}

.css-1uc08pw {
    color: #0084FF
}

.css-1yeqy9h::before {
    border: none
}

.css-1yeqy9h {
    color: #0084FF
}

html[data-theme=dark] .css-1yeqy9h,
html[data-theme=dark] .css-1yeqy9h .css-vurnku {
    color: #0084FF
}

.css-1k10w8f,
.css-o7lu8j {
    color: black
}

.css-12ta2mu,
html[data-theme=dark] .css-12ta2mu {
    color: #0084FF
}

.css-1o56bgb:hover {
    color: #32CD32
}

html[data-theme=dark] .css-1o56bgb:hover {
    color: #32CD32
}

.css-h1yvwn:hover,
.css-1h9r04p,
.css-1h9r04p:hover {
    color: #FF4D82
}

html[data-theme=dark] .css-h1yvwn:hover,
html[data-theme=dark] .css-1h9r04p,
html[data-theme=dark] .css-1h9r04p:hover {
    color: #FF4D82
}

.css-15ivzwa {
    background: white;
}

html[data-theme=dark] .css-15ivzwa {
    background: rgb(30, 30, 30);
}

html[data-theme=dark] .css-h7rrn2 {
    background: rgb(18, 18, 18);
}

html[data-theme=dark] .css-12yl4eo {
    background: rgb(18, 18, 18)
}

.css-qwboob:hover {
    background: #ffffff1c
}

html[data-theme=dark] .css-1iyxdkz {
    background: #ffffff1c
}

.css-1s7s3n5:hover .ZDI--ImagePlus24 {
    fill: rgb(221, 178, 116);
}

.css-1s7s3n5:hover .ZDI--EmoHappy24 {
    fill: #0084FF;
}

.css-gm5a0s:hover .ZDI--ImagePlus24 {
    fill: rgb(221, 178, 116);
}

.css-gm5a0s:hover .ZDI--EmoHappy24 {
    fill: #0084FF;
}

html[data-theme=dark] .css-glctcg {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1hnxfhy {
    background: rgb(18, 18, 18);
    border: 2px solid #444;
}

html[data-theme=dark] .css-gjiv4z {
    color: #0084FF;
    background: #0066ff14;
}

html[data-theme=dark] .css-1v9si9f {
    color: #8590A6;
    background: #8080801c;
}

html[data-theme=dark] .css-16ywuwq {
    color: rgb(0, 102, 255);
    background: rgba(0, 102, 255, 0.08);
}

html[data-theme=dark] .css-1bsypu2 {
    color: #0084FF
}

html[data-theme=dark] .css-1c354jk:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-a44f8k:hover {
    background: #ffffff1c;
}

.css-1dq2715 {
    cursor: pointer
}

.css-1pcum0z {
    box-shadow: none
}

.ZDI--Dots24:hover {
    color: #0084FF
}

html[data-theme=dark] .css-82zxhc {
    color: white
}

html[data-theme=dark] .index-hover-qmVRA {
    color: #d3d3d3
}

html[data-theme=dark] .index-hover-qmVRA:hover {
    color: #0066ff
}

.css-19aqy0w {
    color: black
}

.css-19aqy0w:hover {
    background: rgb(246, 246, 246)
}

html[data-theme=dark] .css-19aqy0w {
    color: #8590A6;
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-19aqy0w:hover {
    color: #8590A6;
    background: #8080801c;
}

html[data-theme=dark] .CopyrightCenter-sideNavItem.is-active,
html[data-theme=dark] .CopyrightCenter-sideNavItem:hover {
    background: #8080801c;
}

html[data-theme=dark] .tab-navs .tab-nav>a {
    color: #d3d3d3 !important;
    border: none
}

html[data-theme=dark] .tab-navs .tab-nav.active>a {
    background: #8080801c !important;
    color: #0084FF !important;
    border: 1px solid #444;
}

html[data-theme=dark] .tab-navs .tab-nav>a:hover {
    background: #8080801c !important;
}

html[data-theme=dark] .tab-navs .tab-nav.active>a:hover {
    background: #8080801c !important;
    color: #0084FF !important;
    border: 1px solid #444;
}

html[data-theme=dark] .CopyrightCenter-main .icon.empty-list {
    filter: brightness(0.6)
}

html[data-theme=dark] .CopyrightSettings {
    color: #d3d3d3
}

html[data-theme=dark] .CopyrightCenter-Help p,
html[data-theme=dark] .CopyrightCenter-Help ul {
    color: #d3d3d3
}

html[data-theme=dark] ._Slogan_boxArrow_3K5o::before {
    border-top-color: #444;
}

html[data-theme=dark] ._Slogan_boxArrow_3K5o::after {
    border-top-color: #444;
}

html[data-theme=dark] ._Slogan_sloganWrapper_2E5y {
    background: rgb(18, 18, 18);
    border: 1px solid #444
}

html[data-theme=dark] .CopyrightCenter-main hr {
    background: #444;
}

html[data-theme=dark] .css-1hwwfws {
    border: 1px solid #000000d9;
    background: rgb(18, 18, 18) !important;
    color: #d3d3d3
}

.ToolsQuestion-header--action:focus {
    outline: none
}

.ToolsQuestion-header--action span:focus {
    outline: none
}

.TopNavBar-inner-77oXV .TopNavBar-searchBar-uo31N .TopNavBar-input-kbgKK {
    padding: 0 0px 0 16px;
    width: 323px;
}

html[data-theme=dark] .css-1va6xs3 {
    background: #8080801c;
    color: #d3d3d3
}

html[data-theme=dark] .index-more-j3pAc {
    background: #8080801c;
    color: #d3d3d3
}

html[data-theme=dark] .index-more-j3pAc:hover {
    background: #8080801c;
    color: #0084ff
}

html[data-theme=dark] .index-item-mo6Mb {
    background: #8080801c;
    border: none
}

html[data-theme=dark] .Learned-tab-9Lce5 .Learned-tabTitle-j1ygz .Learned-item-8B3JQ {
    background: #8080801c;
    border: none;
    color: #d3d3d3
}

html[data-theme=dark] .Learned-tab-9Lce5 .Learned-tabTitle-j1ygz .Learned-item-8B3JQ.Learned-activeItem-qogUr {
    background: rgba(0, 102, 255, .08);
    border: .5px solid rgba(0, 102, 255, .08);
    color: #06f
}

.css-1tm97em {
    display: none !important
}

.css-1dwcfxl {
    display: none !important
}

html[data-theme=dark] .index-content-jNRgg .index-item-tPBTL {
    color: #d3d3d3
}

html[data-theme=dark] .index-content-jNRgg .index-item-tPBTL:hover {
    color: #0084FF
}

html[data-theme=dark] .ZVideoTag {
    color: #0084FF
}

html[data-theme=dark] .Creator-entityLink {
    color: #0084FF
}

html[data-theme=dark] .Creator-hintLink:focus {
    outline: none;
}

html[data-theme=dark] .ToolsRecommendList-hintLinkDivider+Creator-hintLink {
    outline: none;
}

input[class*="TopNavBar"]:not(.ariaskiptheme) {
    color: white !important;
    background: transparent !important
}

.TopNavBar-inner-77oXV .TopNavBar-searchBar-uo31N .TopNavBar-input-kbgKK {
    padding: 0px 0px 0px 16px;
    width: 323px;
}

html[data-theme=dark] .TopNavBar-inner-77oXV .TopNavBar-searchBar-uo31N .TopNavBar-input-kbgKK {
    background: #1b1b1b !important;
    border: 1px solid #444;
}

html[data-theme=dark] .TopNavBar-inner-77oXV .TopNavBar-searchBar-uo31N .TopNavBar-input-kbgKK::placeholder {
    color: transparent
}

html[data-theme=dark] .TopNavBar-fixInner-wr5x1 .TopNavBar-searchBar-uo31N .TopNavBar-input-kbgKK {
    border: 1px solid #444;
}

.TopNavBar-inner-eTRQC .TopNavBar-searchBar-hDE1u {
    margin-left: 20px !important
}

.TopNavBar-inner-eTRQC .TopNavBar-searchBar-hDE1u .TopNavBar-input-sjsdr {
    padding: 0px 0px 0px 16px;
    width: 323px;
}

html[data-theme=dark] .css-dnz5h8 {
    border: 1px solid #444;
}

html[data-theme=dark] .CarouselBanner-topNavBarShow-utQMU {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .TopNavBar-fixInner-8MxBW .TopNavBar-activeTab-nN4v9 a {
    color: #0084FF !important
}

.TopNavBar-fixInner-wr5x1 .TopNavBar-activeTab-2qfUG.TopNavBar-tab-gdypM a {
    color: #ce994f
}

.TopNavBar-fixInner-wr5x1 .TopNavBar-tab-gdypM a {
    color: black
}

html[data-theme=dark] .TopNavBar-fixInner-wr5x1 .TopNavBar-tab-gdypM a {
    color: #d3d3d3
}

.TopNavBar-fixInner-8MxBW .TopNavBar-tab-d8yaD a {
    color: black
}

html[data-theme=dark] .TopNavBar-fixInner-8MxBW .TopNavBar-tab-d8yaD a {
    color: #d3d3d3
}

.TopNavBar-fixInner-8MxBW .TopNavBar-tab-d8yaD.TopNavBar-activeTab-nN4v9 a {
    color: #0084FF !important
}

html[data-theme=dark] .TopNavBar-inner-eTRQC .TopNavBar-activeTab-nN4v9 a {
    color: #d3d3d3 !important
}

html[data-theme=dark] .css-b1ywb6 {
    color: white
}

:focus {
    outline: none
}

html[data-theme=dark] .index-listCard-crTRa {
    background: rgb(153 153 153)
}

.css-w9oz6h:first-child {
    margin-top: 10px
}

html[data-theme=dark] .index-hover-ok9Jt {
    color: #d3d3d3
}

html[data-theme=dark] .index-hover-ok9Jt:hover {
    color: #0084ff
}

html[data-theme=dark] .LearningRouteCard-categoryInfo-2Awbz .LearningRouteCard-categoryTitle-oAZLT {
    color: #d3d3d3
}

html[data-theme=dark] .LearningRouteCard-pathItem-xin1f .LearningRouteCard-right-uzafZ .LearningRouteCard-title-do7ND {
    color: #d3d3d3
}

html[data-theme=dark] .LearningRouteCard-pathItem-xin1f .LearningRouteCard-right-uzafZ .LearningRouteCard-title-do7ND:hover {
    color: #0084ff
}

html[data-theme=dark] .LearningRouteCard-pathItem-xin1f .LearningRouteCard-right-uzafZ .LearningRouteCard-detail-i7CrR {
    color: #d3d3d3
}

html[data-theme=dark] .index-title-iYS6y {
    color: #d3d3d3
}

html[data-theme=dark] .index-number-nbTN6 {
    color: #d3d3d3
}

html[data-theme=dark] .LearningRouteCard-wrapper-8Yu5u {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .LearningRouteCard-seeAll-xnUqk {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .index-item-u9evS {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-13ld3zv {
    background: rgb(18, 18, 18);
    border: 1px solid #444;
}

html[data-theme=dark] .css-qj8kyw {
    background: #d3d3d3;
    border: 0.5px solid transparent;
}

html[data-theme=dark] .css-qj8kyw:hover {
    /*background:#0066ff;*/
    color: white
}

html[data-theme=dark] .css-klsxws {
    background: #d3d3d3;
    border: 0.5px solid transparent;
}

html[data-theme=dark] .css-klsxws:hover {
    /*background:rgb(100, 100, 100);*/
    color: white
}

html[data-theme=dark] .css-3y87e3 {
    border: 0.5px solid transparent;
}

html[data-theme=dark] .css-2jhrb {
    border: 0.5px solid transparent;
}

html[data-theme=dark] .css-smeeif {
    filter: brightness(0.6)
}

html[data-theme=dark] .css-1xgftsj::before {
    border-top: 1px solid #1B1B1B;
}

html[data-theme=dark] .css-1sqyxpr::before {
    border-top: 1px solid #1B1B1B;
}

html[data-theme=dark] .css-dpj044::before {
    border-top: 1px solid #1B1B1B;
}

html[data-theme=dark] .TopNavBar-fixMode-qXKMs {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .PcContent-content-9URDE .PcContent-learningRecord-mAzPm .PcContent-text-bRqSw {
    color: #8590A6
}

html[data-theme=dark] .Vote-voteUpBtn-9a8tV {
    background: rgba(85, 142, 255, .1);
    color: #558eff;
}

html[data-theme=dark] .Vote-voteDownBtn-sK2an {
    background: rgba(85, 142, 255, .1);
    color: #558eff;
}

.AuthorInfo.AnswerItem-authorInfo {
    max-width: none !important
}

html[data-theme=dark] .css-5qaofe {
    background: white
}

html[data-theme=dark] .css-asds7r {
    color: #0084ff
}

html[data-theme=dark] .css-asds7r .css-vurnku {
    color: #0084ff
}

html[data-theme=dark] .css-3dzvwq:hover {
    color: #0084ff
}

html[data-theme=dark] .Interaction-favorites-7qKEU svg {
    filter: brightness(1)
}

html[data-theme=dark] .Interaction-favorites-7qKEU:hover {
    color: orange
}

html[data-theme=dark] .Interaction-favorites-7qKEU:hover svg path {
    fill: orange
}

html[data-theme=dark] .Interaction-root-esGak>div:nth-child(3):hover {
    color: #0084ff
}

html[data-theme=dark] .Interaction-root-esGak>div:nth-child(3) svg {
    filter: brightness(1)
}

html[data-theme=dark] .Interaction-root-esGak>div:nth-child(3):hover svg path {
    fill: #0084ff
}

html[data-theme=dark] .Interaction-root-esGak>div:nth-child(4) svg {
    filter: brightness(1)
}

.css-82fsyv {
    color: #8590A6
}

.css-1rjujr1 {
    color: #8590A6
}

.css-1bb86fo {
    color: #8590A6
}

.css-12cl38p {
    color: #8590A6
}

.css-nm6sok {
    color: #8590A6
}

.css-owuz05 {
    color: #0084ff;
}

.css-1n5shmo {
    color: black
}

.css-1iyxy9k {
    color: black !important
}

html[data-theme=dark] .css-1iyxy9k {
    color: #d3d3d3 !important
}

.css-1o4uqdq {
    color: black !important
}

html[data-theme=dark] .css-1o4uqdq {
    color: #d3d3d3 !important
}

html[data-theme=dark] .css-1n5shmo {
    color: #8590A6 !important
}

.AppHeader-notifications .Zi--Bell path {
    fill: black
}

.AppHeader-messages .Zi--Comments path {
    fill: black
}

.css-owuz05::before {
    border: 1px solid #0084ff;
}

html[data-theme=dark] .LearningPathWayCard-pathItem-oCd3q .LearningPathWayCard-right-qowQR .LearningPathWayCard-title-p62ZV {
    color: #d3d3d3
}

html[data-theme=dark] .LearningPathWayCard-pathItem-oCd3q .LearningPathWayCard-right-qowQR .LearningPathWayCard-detail-mNgef {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseList-title-o7MUU .VideoCourseList-text-37JQa {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-h2ewn .VideoCourseCard-title-4zMJA {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-h2ewn .VideoCourseCard-author-viP6g .VideoCourseCard-authorName-xwrLd {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-h2ewn .VideoCourseCard-records-e1dJN {
    color: #d3d3d3
}

html[data-theme=dark] .PcContent-content-n3TNS .PcContent-learningRecord-vDRHw .PcContent-left-4tmUS {
    color: #d3d3d3
}

html[data-theme=dark] .Article-article-8UHAq .Article-header-r1Qd7 .Article-title-r1RkE {
    color: #d3d3d3
}

html[data-theme=dark] .Article-article-8UHAq .Article-header-r1Qd7 .Article-superior-cyVwv {
    color: #d3d3d3
}

html[data-theme=dark] .PcContent-content-n3TNS .PcContent-learningRecord-vDRHw .PcContent-right-bLRQH {
    color: #8590A6
}

html[data-theme=dark] .PcContent-coverFix-5zWd3 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Banner-wrapper-qANiD {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .PcContent-content-n3TNS {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .VideoCourseList-title-o7MUU {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Article-article-8UHAq .Article-header-r1Qd7 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .LearningPathWayCard-pathItem-oCd3q {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .PcContent-content-n3TNS .PcContent-learningRecord-vDRHw {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Structure-structure-pD2Y3 {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-userInfo-kpbvq {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-userInfo-kpbvq .Achievement-userName-8PUaH {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-userInfo-kpbvq img {
    background: white
}

html[data-theme=dark] .Tab-tab-xnLDq .Tab-tabTitle-nueHF .Tab-item-vBYm1 {
    color: #d3d3d3
}

html[data-theme=dark] .Tab-tab-xnLDq .Tab-tabTitle-nueHF .Tab-activeItem-aW8jh {
    color: #06f
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-oGG6U .VideoCourseCard-rightContent-gdG5T .VideoCourseCard-title-rzU56 {
    color: #d3d3d3
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-oGG6U .VideoCourseCard-rightContent-gdG5T .VideoCourseCard-author-qXzAV .VideoCourseCard-authorName-svABa {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-card-6KACL .Achievement-first-pCy1T .Achievement-label-kkRmZ {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-card-6KACL .Achievement-first-pCy1T .Achievement-num-uyphg {
    color: #d3d3d3
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-card-6KACL .Achievement-item-t2YEj .Achievement-num-uyphg {
    color: #d3d3d3
}

html[data-theme=dark] .Bubble-content-4n2tu {
    background: rgb(18, 18, 18) !important;
}

html[data-theme=dark] .Achievement-contentPopup-iVfwy {
    color: #d3d3d3 !important
}

html[data-theme=dark] .Tab-tab-xnLDq .Tab-tabTitle-nueHF {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Tab-tab-xnLDq .Tab-placeHolder-qa6gk {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .Achievement-userRecord-7FBSL .Achievement-card-6KACL {
    background: rgb(18, 18, 18)
}

html[data-theme=dark] .css-1t76iew {
    background: rgb(18, 18, 18)
}

.css-1afbq0c {
    color: #d3d3d3;
    border-bottom: 0.5px solid #444
}

html[data-theme=dark] .css-10xcm3x {
    background: #8080801c;
}

html[data-theme=dark] .css-7tluok {
    background: #8080801c;
}

html[data-theme=dark] .VideoCourseCard-videoCourseCard-oGG6U {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .Tab-tab-xnLDq .Tab-tabTitle-nueHF {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .CollectionDetailPageItem-innerContainer {
    border-bottom: 1px solid #444
}

html[data-theme=dark] .css-1woo4vw {
    color: #d3d3d3
}

html[data-theme=dark] .css-3v0iam>div {
    color: #d3d3d3
}

html[data-theme=dark] .css-1229yg4 {
    color: #d3d3d3
}

html[data-theme=dark] .css-64vor1 {
    color: #d3d3d3
}

html[data-theme=dark] .css-9iuyhq {
    color: #d3d3d3
}

html[data-theme=dark] .css-1rd0h6f {
    color: #d3d3d3
}

.css-1pr8gk5.is-active::after {
    background-color: #1772F6 !important;
}

html[data-theme=dark] .css-tad50r:hover {
    background: #ffffff1c;
}

html[data-theme=dark] .css-tj0ab2 {
    fill: #d3d3d3
}

.css-8kjoqe+div:not(.css-1kg4pro)::before {
    opacity: 0.1
}

.css-8kjoqe+div:not(.css-1v2mb5y)::after {
    opacity: 0.1
}

html[data-theme=dark] .VideoUploadHint-buttonGroup {
    justify-content: center;
}

html[data-theme=dark] .css-tad50r .css-vurnku {
    background: transparent
}

html[data-theme=dark] .css-1afbq0c:focus-visible {
    box-shadow: none;
}

html[data-theme=dark] .ZDI--ToolBarVipSetting {
    fill: #d3d3d3
}

html[data-theme=dark] .css-12mpbz1 .css-vurnku {
    background: transparent
}

html[data-theme=dark] .css-w39bbk .css-vurnku {
    background: transparent
}

html[data-theme=dark] .css-1v31w62 {
    background: rgba(133, 144, 166, 0.05);
    border: 1px solid transparent
}

html[data-theme=dark] svg._11u3rwe {
    filter: brightness(1) !important;
}

.css-1gn92fl {
    position: absolute;
    left: 155px;
    top: 410px;
}

.css-10fy1q8 {
    width: 372.88px
}

.css-1vqda4a {
    display: none !important
}

#div-gpt-ad-bannerAd {
    display: none !important
}

#div-gpt-ad-hotFeedAd {
    display: none !important
}

.KfeCollection-VipRecommendCard {
    display: none !important
}

.RelatedReadings {
    display: none !important
}

.HotQuestions-title {
    display: none !important
}

.HotQuestions-section {
    display: none !important
}

html[data-theme=dark] .css-w9oz6h {
    border: none;
}

html[data-hover-visible] .css-w9oz6h:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .css-w9oz6h:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-hover-visible] .css-1f6hmyt:hover {
    -webkit-box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3);
    box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(0, 132, 255, .3)
}

html[data-theme=dark][data-hover-visible] .css-1f6hmyt:hover {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6);
    box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 5px rgba(58, 118, 208, .6)
}

html[data-theme=dark] .css-1qcx8mz {
    border: none
}

/*顶部导航栏-点击头像-我的主页*/
.AppHeaderProfileMenu-item.UserFill24 {
    color: black !important;
}

.AppHeaderProfileMenu-item.UserFill24 .ZDI--UserFill24 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.UserFill24:hover {
    color: #08a500 !important;
}

.AppHeaderProfileMenu-item.UserFill24:hover .ZDI--UserFill24 {
    fill: #08a500 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.UserFill24 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.UserFill24 .ZDI--UserFill24 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.UserFill24:hover {
    color: #08a500 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.UserFill24:hover .ZDI--UserFill24 {
    fill: #08a500 !important;
}

/*顶部导航栏-点击头像-最近浏览*/
.AppHeaderProfileMenu-item.ClockFill24 {
    color: black !important;
}

.AppHeaderProfileMenu-item.ClockFill24 .ZDI--ClockFill24 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.ClockFill24:hover {
    color: #a77706 !important;
}

.AppHeaderProfileMenu-item.ClockFill24:hover .ZDI--ClockFill24 {
    fill: #a77706 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ClockFill24 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ClockFill24 .ZDI--ClockFill24 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ClockFill24:hover {
    color: #a77706 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ClockFill24:hover .ZDI--ClockFill24 {
    fill: #a77706 !important;
}

/*顶部导航栏-点击头像-无障碍*/
.AppHeaderProfileMenu-item.HeartFill16 {
    color: black !important;
}

.AppHeaderProfileMenu-item.HeartFill16 .ZDI--HeartFill16 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.HeartFill16:hover {
    color: #ff7d7d !important;
}

.AppHeaderProfileMenu-item.HeartFill16:hover .ZDI--HeartFill16 {
    fill: #ff7d7d !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.HeartFill16 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.HeartFill16 .ZDI--HeartFill16 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.HeartFill16:hover {
    color: #ff7d7d !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.HeartFill16:hover .ZDI--HeartFill16 {
    fill: #ff7d7d !important;
}

/*顶部导航栏-切换模式（未登录）-无障碍*/
html[data-theme=dark] .Menu > button.css-7ynnma {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .Menu > button.css-7ynnma .ZDI--HeartFill16 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .Menu > button.css-7ynnma:hover {
    color: #ff7d7d !important;
}

html[data-theme=dark] .Menu > button.css-7ynnma:hover .ZDI--HeartFill16 {
    fill: #ff7d7d !important;
}


/*顶部导航栏-点击头像-关怀版*/
.AppHeaderProfileMenu-item.ElderFill16 {
    color: black !important;
}

.AppHeaderProfileMenu-item.ElderFill16 .ZDI--ElderFill16 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.ElderFill16:hover {
    color: #0084FF !important;
}

.AppHeaderProfileMenu-item.ElderFill16:hover .ZDI--ElderFill16 {
    fill: #0084FF !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ElderFill16 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ElderFill16 .ZDI--ElderFill16 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ElderFill16:hover {
    color: #0084FF !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.ElderFill16:hover .ZDI--ElderFill16 {
    fill: #0084FF !important;
}

/*顶部导航栏-切换模式（未登录）-关怀版*/
html[data-theme=dark] .Menu > a.css-7ynnma {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .Menu > a.css-7ynnma .ZDI--ElderFill16 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .Menu > a.css-7ynnma:hover {
    color: #0084ff !important;
}

html[data-theme=dark] .Menu > a.css-7ynnma:hover .ZDI--ElderFill16 {
    fill: #0084ff !important;
}


/*顶部导航栏-点击头像-设置*/
.AppHeaderProfileMenu-item.GearFill24 {
    color: black !important;
}

.AppHeaderProfileMenu-item.GearFill24 .ZDI--GearFill24 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.GearFill24:hover {
    color: purple !important;
}

.AppHeaderProfileMenu-item.GearFill24:hover .ZDI--GearFill24 {
    fill: purple !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.GearFill24 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.GearFill24 .ZDI--GearFill24 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.GearFill24:hover {
    color: purple !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.GearFill24:hover .ZDI--GearFill24 {
    fill: purple !important;
}

/*顶部导航栏-点击头像-退出*/
.AppHeaderProfileMenu-item.PowerFill24 {
    color: black !important;
}

.AppHeaderProfileMenu-item.PowerFill24 .ZDI--PowerFill24 {
    fill: black !important;
}

.AppHeaderProfileMenu-item.PowerFill24:hover {
    color: red !important;
}

.AppHeaderProfileMenu-item.PowerFill24:hover .ZDI--PowerFill24 {
    fill: red !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.PowerFill24 {
    color: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.PowerFill24 .ZDI--PowerFill24 {
    fill: #d3d3d3 !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.PowerFill24:hover {
    color: red !important;
}

html[data-theme=dark] .AppHeaderProfileMenu-item.PowerFill24:hover .ZDI--PowerFill24 {
    fill: red !important;
}

.Catalog.isCatalogV2.css-2hy5iv {
    display: none !important;
}

html[data-theme=dark] .css-zprod6 {
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    border-radius: 6px;
    position: absolute;
    width: 242px;
    height: 242px;
    top: 62px;
    left: 174px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

/*==知乎热榜==*/
/*热榜滚动条-背景*/
html[data-theme=dark] .css-172osot {
    background: #191b1f !important;
}
/*热榜滚动条-边框*/
html[data-theme=dark] .css-z19u8v {
    border-bottom: 1px solid #444 !important;
}
/*热榜滚动条-标题背景*/
html[data-theme=dark] .css-3dzt4y {
    background: #191b1f !important;
}
/*热榜滚动条-标题文字*/
html[data-theme=dark] .css-1851sov {
    color: #d3d3d3 !important;
}



/*==知乎首页==*/
/*导航栏图标*/
.css-16zsfw9 {
    color: black !important;
}

html[data-theme=dark] .css-16zsfw9 {
    color: #8590A6 !important;
}

/* 第一个图标 - 通知按钮 */
.css-1vbrp2j > .Popover:nth-of-type(1) .css-16zsfw9:hover .ZDI--BellFill24 {
    fill: #FACB62 !important;
}
.css-1vbrp2j > .Popover:nth-of-type(1) .css-16zsfw9:hover .css-vurnku {
    color: #FACB62 !important;
}

/* 第二个图标 - 私信按钮 */
.css-1vbrp2j > .Popover:nth-of-type(2) .css-16zsfw9:hover .ZDI--ChatBubbleTwoFill24 {
    fill: #00FF7F !important;
}
.css-1vbrp2j > .Popover:nth-of-type(2) .css-16zsfw9:hover .css-vurnku {
    color: #00FF7F !important;
}

/* 第三个图标 - 创作中心链接 */
.css-1vbrp2j > a.css-16zsfw9:hover .ZDI--UserPencilFill24 {
    fill: #0084FF !important;
}
.css-1vbrp2j > a.css-16zsfw9:hover .css-vurnku {
    color: #0084FF !important;
}


/*导航栏菜单*/
.css-c400lu{
    color: black !important;
}
html[data-theme=dark] .css-c400lu{
    color: #d3d3d3 !important;
}

/*提问框*/
.css-hv22zf{
    color: black !important;
}
html[data-theme=dark] .css-hv22zf{
    color: #d3d3d3 !important;
}


/*
.css-79elbk .ZDI--UserPencilFill24 {
    fill: black
}

.css-79elbk .ZDI--BellFill24 {
    fill: black
}

.css-79elbk .ZDI--ChatBubbleTwoFill24 {
    fill: black
}

html[data-theme=dark] .css-79elbk .ZDI--UserPencilFill24 {
    fill: #8590A6
}

html[data-theme=dark] .css-79elbk .ZDI--BellFill24 {
    fill: #8590A6
}

html[data-theme=dark] .css-79elbk .ZDI--ChatBubbleTwoFill24 {
    fill: #8590A6
}

.css-79elbk:hover .css-1n5shmo {
    color: #0084FF
}

.AppHeader-notifications:hover .css-1n5shmo {
    color: #FACB62
}

.AppHeader-notifications:hover .Zi--Bell path {
    fill: #FACB62
}

.AppHeader-messages:hover .css-1n5shmo {
    color: #00FF7F
}

.AppHeader-messages:hover .Zi--Comments path {
    fill: #00FF7F
}

.css-79elbk:hover .ZDI--UserPencilFill24 {
    fill: #0084FF
}

.css-79elbk:hover .ZDI--BellFill24 {
    fill: #FACB62
}

.css-79elbk:hover .ZDI--ChatBubbleTwoFill24 {
    fill: #00FF7F
}

html[data-theme=dark] .css-79elbk:hover .ZDI--UserPencilFill24 {
    fill: #0084FF
}

html[data-theme=dark] .css-79elbk:hover .ZDI--BellFill24 {
    fill: #FACB62
}

html[data-theme=dark] .css-79elbk:hover .ZDI--ChatBubbleTwoFill24 {
    fill: #00FF7F
}
*/

/*不感兴趣-设置屏蔽关键词-背景*/
html[data-theme=dark] .css-1ckpczh{
    background:#191b1f;
}
/*不感兴趣-设置屏蔽关键词-标题*/
html[data-theme=dark] .css-tnpjv7{
    color:#d3d3d3;
}
/*不感兴趣-设置屏蔽关键词-顶距增大*/
.css-l3rx45{
    margin-top: 35px;
}

/*分享按钮-hover*/
.ShareMenu-toggler > button:hover{
    color:blue;
}

/*登录小提示-背景*/
html[data-theme=dark] .css-woosw9{
    box-shadow:none;
}
html[data-theme=dark] .css-zr60jh{
    background:#191b1f;
}
/*登录小提示-标题*/
html[data-theme=dark] .css-1niyb0o{
    color:#d3d3d3;
}
/*登录小提示-标题*/
html[data-theme=dark] .css-1qk9jmi{
    color:#d3d3d3;
}

/*登录权益-背景*/
html[data-theme=dark] .css-l63y2t{
    background:#121212;
}


/*弹出登录框-背景*/
html[data-theme=dark] .signQr-container{
    background:#121212;
}
/*弹出登录框-左侧文字*/
html[data-theme=dark] .css-1cebn6m,
html[data-theme=dark] .css-1ho20wb,
html[data-theme=dark] .css-30i747
{
    color: #d3d3d3;
}
/*弹出登录框-左侧按钮*/
html[data-theme=dark] .css-bmu90a,
html[data-theme=dark] .css-15nn8kw
{
    color: #d3d3d3;
    border: 1px solid #444;
}
/*弹出登录框-左侧按钮-hover*/
html[data-theme=dark] .css-bmu90a:hover,
html[data-theme=dark] .css-15nn8kw:hover
{
    color:#0084ff!important;
    background:#1772f60f!important;
}


/*弹出登录框-顶部标题*/
html[data-theme=dark] .css-v6yqll{
    background: #bccde717;
}
html[data-theme=dark] .css-abudlb{
    color: #0084ffb0;
}
/*弹出登录框-登录方式*/
html[data-theme=dark] .SignFlow-tab{
    color: #d3d3d3;
}
html[data-theme=dark] .SignFlow-tab--active{
    color: #0084ff;
}

/*弹出登录框-手机号*/
html[data-theme=dark] .SignContainer-content input {
    background: #121212 !important;
    color: #d3d3d3 !important;
    border-color: #333 !important;
}
html[data-theme=dark] .SignContainer-content input:focus {
    color: #d3d3d3 !important;
    background: #121212 !important;
}
html[data-theme=dark] .SignContainer-content input:-webkit-autofill {
    -webkit-box-shadow: inset 0 0 0 30px #121212 !important;
    -webkit-text-fill-color: #d3d3d3 !important;
    caret-color: #d3d3d3 !important;
}

/*弹出登录框-其他方式登录-容器背景*/
html[data-theme=dark] .css-hvo7ig{
    background:#121212;
}
/*弹出登录框-其他方式登录-边框线*/
html[data-theme=dark] .css-1vli2z{
    border-color:#444;
}

/*弹出登录框-拖动验证码-背景*/
html[data-theme=dark] .yidun_popup.yidun_popup--light .yidun_modal{
    background:#121212;
    border: 1px solid #444;
    box-shadow:none;
}
/*弹出登录框-拖动验证码-标题*/
html[data-theme=dark] .yidun_popup.yidun_popup--light .yidun_modal__header{
    color:#d3d3d3;
    border-bottom: 1px solid #444;
}
/*弹出登录框-拖动验证码-拖动条背景*/
html[data-theme=dark] .yidun.yidun--light .yidun_control{
    background:#121212;
    border: 1px solid #444;
}
/*弹出登录框-拖动验证码-拖动条提示词*/
html[data-theme=dark] .yidun.yidun--light .yidun_tips{
    color:#d3d3d3;
}
/*弹出登录框-拖动验证码-拖动条滑块*/
html[data-theme=dark] .yidun.yidun--light .yidun_slider{
    background:#121212;
    border: 1px solid #444;
}

/*弹出登录框-语音验证码-语音背景*/
html[data-theme=dark] .yidun.yidun--light.yidun--voice .yidun_bgimg{
    background:#191b1f;
    border: 1px solid #444;
}
/*弹出登录框-语音验证码-文字按钮*/
html[data-theme=dark] .yidun.yidun--light .yidun_voice__back, .yidun.yidun--light .yidun_voice__refresh{
    color:#8590a6 !important;
}
/*弹出登录框-语音验证码-验证按钮*/
html[data-theme=dark] .yidun.yidun--light.yidun--voice .yidun_control[role=button] .yidun_tips{
    background:#0084ff;
    color:#d3d3d3;
}
/*弹出登录框-语音验证码-输入框*/
html[data-theme=dark] .yidun.yidun--light .yidun_voice__input{
    background:#121212;
    color:#d3d3d3;
    border:1px solid #444;
}


/*登录页-其他方式登录-容器背景*/
html[data-theme=dark] .css-10wc74s{
    background:#121212;
}

/*==知乎首页==*/


/*==知乎文章==*/
/*代码的滚动条样式*/
.css-ob6uua pre::-webkit-scrollbar {
    height: 12px;
}

.css-ob6uua pre::-webkit-scrollbar-track {
    background: #d3d3d3;
    border-radius: 10px;
}

.css-ob6uua pre::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.css-ob6uua pre::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/*代码背景*/
html[data-theme=dark] .css-1olvdus pre {
    background: #212429 !important;
}

html[data-theme=dark] .css-1olvdus code {
    background: #212429 !important;
}

/*作者边框*/
html[data-theme=dark] .css-zein01 {
    border: none !important;
}

.css-b7erz1 {
    color: #0084ff !important;
}

/*引用内容*/
blockquote{
    color: #535861 !important;
}
html[data-theme=dark] blockquote{
    color: #c4c7cec7 !important;
}

/*导航栏*/
.ColumnPageHeader-Title{
    width:150px;
}

html[data-theme=dark] .css-j3g3pk{
    color:#d3d3d3;
}

/*
@用户
.PostIndex-body .css-1gomreu a.UserLink-link {
    color: #0084ff;
}
*/

/*图片保持原大小*/
.css-10o75c2 img.content_image[data-size="normal"], .css-10o75c2 img.origin_image[data-size="normal"]{
    width: auto !important;
    max-width: 100% !important;
}

/*文章点赞用户列表*/
html[data-theme=dark] .VoterList-content {
    background:#191b1f !important;
}

/*==知乎文章==*/


/*==等你来答==*/
/*为你推荐-问题标题*/
html[data-theme=dark] .css-bjox9u {
    color: #d3d3d3 !important;
}

/*邀请回答-问题背景*/
html[data-theme=dark] .css-19nug30 {
    background: none !important;
}

/*邀请回答-提问者名称*/
html[data-theme=dark] .css-1w0nc6z {
    color: #d3d3d3 !important;
}

/*问题底部边框*/
html[data-theme=dark] .css-1cdnuuo {
    border-bottom: 1px solid #444;
}

/*问题加载占位*/
html[data-theme=dark] .PlaceHolder {
    background: #121212 !important;
    color:black !important;
}
html[data-theme=dark] .PlaceHolder-inner {
    background: #121212 !important;
    color:black !important;
}
html[data-theme=dark] .PlaceHolder-bg {
    background-color: #1b1b1b !important;
    background-image: -webkit-gradient(linear,left top,right top,from(#1b1b1b),color-stop(25%,#2e2e2e),color-stop(75%,#2e2e2e),to(#1b1b1b)) !important;
    background-image: linear-gradient(90deg,#1b1b1b 0,#2e2e2e 25%,#2e2e2e 75%,#1b1b1b) !important;
}
html[data-theme=dark] .PlaceHolder-bg svg path {
    fill: #121212 !important;
}


/*==等你来答==*/


/*==知乎问题==*/
/*隐藏广告*/
.Pc-word-new{
    display:none !important;
}
/*继续追问*/
html[data-theme=dark] .css-jghqwm {
    background: #121212 !important;
    border: 1px solid #444 !important;
}

html[data-theme=dark] .css-lzd0h4 {
    color: #d3d3d3 !important;
}

/*继续追问-问题列表*/
html[data-theme=dark] .css-i0heim {
    color: #d3d3d3 !important;
}

/*发布回答-回答类型*/
html[data-theme=dark] .css-7tlwbh{
    background: #121212 !important;
    border-bottom: 1px solid #444 !important;
}
/*发布回答-回答类型-active*/
html[data-theme=dark] .Tabs-link.css-54sq2w{
    color:#0084ff !important;
}
/*发布回答-视频回答-上传框*/
html[data-theme=dark] .css-d5xqx7{
    border: 2px dashed #8491a5 !important;
}
/*发布回答-视频回答-上传图标*/
html[data-theme=dark] .css-8z1cs{
    background:#d3d3d3 !important;
}
/*发布回答-编辑区*/
.css-6a8ffv{
    width:auto !important;
}
/*发布回答-编辑区空白边框*/
html[data-theme=dark] .css-v0rptr{
    background:#191b1f !important;
}
/*发布回答-发布设置-背景*/
html[data-theme=dark] .css-jtt4ph{
    background:#121212 !important;
}
/*发布回答-发布设置-顶部边框*/
html[data-theme=dark] .css-6qkgb{
    border-top: 1px solid #444 !important;
}
/*发布回答-发布设置-标题*/
html[data-theme=dark] .css-9rfw7f{
    color: #d3d3d3 !important;
}
/*发布回答-发布设置-固定底栏*/
html[data-theme=dark] .css-q7c9ay{
    border-top: 1px solid #444 !important;
}

/*发布回答(全屏模式)-顶栏背景*/
html[data-theme=dark] .css-2lvw8d{
    background:#121212 !important;
}
/*发布回答(全屏模式)-编辑区-问题背景*/
html[data-theme=dark] .css-qf4x08{
    background:#191b1f !important;
    border: 1px solid #444 !important;
}
/*发布回答(全屏模式)-编辑区-问题文字*/
html[data-theme=dark] .css-1y416g7{
    background:#191b1f !important;
    color: #d3d3d3 !important;
    border: none !important;
}
/*发布回答(全屏模式)-发布设置-背景*/
html[data-theme=dark] .css-1p9otau{
    background:#121212 !important;
}

/*==知乎问题==*/


/*==知乎文章==*/
/*目录列表*/
html[data-theme=dark] .css-17v5fjs {
    background: #151a23 !important
}

html[data-theme=dark] .css-1e6hvbc {
    background: #151a23 !important
}

html[data-theme=dark] .css-1e6hvbc {
    background: #151a23 !important
}

html[data-theme=dark] .css-1ifd8ga {
    background: #151a23 !important
}

/*展开目录*/
html[data-theme=dark] .css-1hrberl {
    background: #151a23 !important
}

/*目录hover高亮*/
html[data-theme=dark] .css-h0sxub:hover{
    background: #8080801c !important
}

/*插入代码段*/
html[data-theme=dark] .css-1yl6ec1 .highlight pre,html[data-theme=dark] .css-1yl6ec1 code{
    background: #212429 !important;
    color: #d3d3d3 !important;
}
/*块引用*/
html[data-theme=dark] .css-1yl6ec1 blockquote{
    color: #8590a6 !important;
}
/*问题描述 插入卡片*/
html[data-theme=dark] .css-10o75c2 .LinkCard.new{
    background: #212429 !important;
}
/*插入卡片*/
html[data-theme=dark] .css-1yl6ec1 .LinkCard.new{
    background: #212429 !important;
}
/*插入卡片描述*/
.LinkCard.new .LinkCard-desc .LinkCard-tag,
.LinkCard.new .LinkCard-desc .tag{
    background: #1772f61a !important;
    color:#1772f6 !important;
}
/*插入卡片描述*/
html[data-theme=dark] .LinkCard.new .LinkCard-desc .LinkCard-tag,
html[data-theme=dark] .LinkCard.new .LinkCard-desc .tag{
    background: #1772f61a !important;
    color:#1772f6 !important;
}
/*所属专栏卡片*/
html[data-theme=dark] .css-34mzkj{
    background: #212429 !important;
}
html[data-theme=dark] .css-1b0xgmx{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-573q3{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-13lpifz{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-6tjr2x{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-fx0vze::before{
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-pqko58{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-fkrpal{
    color: #d3d3d3 !important;
}
/*专栏图片*/
.css-1yl6ec1 img.content_image[data-size="normal"],
.css-1yl6ec1 img.origin_image[data-size="normal"]{
    width: auto !important;
}
/*举报文章-背景*/
html[data-theme=dark] .css-1j23ebo{
    background: #191b1f !important;
}
/*举报文章-举报类型*/
html[data-theme=dark] .css-x8j6cj{
    color: #d3d3d3 !important;
}
/*举报文章-举报标签*/
html[data-theme=dark] .css-1e4t0n7{
    background: #212429 !important;
    color: #d3d3d3 !important;
}
/*举报文章-举报文字说明*/
html[data-theme=dark] .css-1lnoo9k .Input-wrapper{
    background: #212429 !important;
    color: #d3d3d3 !important;
}
/*举报文章-举报图片说明*/
html[data-theme=dark] .css-1ol5wx9{
    background: #212429 !important;
    border:1px solid #444!important;
}
/*举报文章-了解规则*/
html[data-theme=dark] .css-bi9r1t{
    color: #d3d3d3 !important;
}
/*举报文章-知乎社区规范*/
html[data-theme=dark] .css-bi9r1t a{
    color: #0084ff !important;
}
/*文章评论区链接*/
html[data-theme=dark] .css-1jpzztt a.internal,
html[data-theme=dark] .css-1jpzztt a.external{
    color: #d3d3d3 !important;
    border-bottom: 1px solid #81858f !important;
}
html[data-theme=dark] .css-1jpzztt a.internal:hover,
html[data-theme=dark] .css-1jpzztt a.external:hover{
    color: #09408e !important;
    border-bottom: 1px solid #09408e !important;
}
/*参考列表*/
.ReferenceList li {
    background: white;
    color: black
}

html[data-theme=dark] .ReferenceList li {
    background: #191b1f;
    color: #d3d3d3
}

.ReferenceList li.is-active {
    background: yellow;
    color: black
}

html[data-theme=dark] .ReferenceList li.is-active {
    background: yellow;
    color: black
}

/*==知乎文章==*/


/*==知乎知学堂==*/
/*导航栏*/
html[data-theme=dark] .TopNavBar-root-oL4f5 {
    background: #121212 !important;
}

/*导航栏文字*/
.TopNavBar-inner-eTRQC .TopNavBar-tab-d8yaD a{
    color: black !important;
}
html[data-theme=dark] .TopNavBar-inner-eTRQC .TopNavBar-tab-d8yaD a {
    color: #d3d3d3 !important;
}
.TopNavBar-inner-eTRQC .TopNavBar-activeTab-nN4v9 a{
    color: #0084ff !important;
}
html[data-theme=dark] .TopNavBar-inner-eTRQC .TopNavBar-activeTab-nN4v9 a{
    color: #0084ff !important;
}

/*导航栏图标*/
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no{
    color: black !important;
}
html[data-theme=dark] .TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no{
    color: #8590A6 !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:hover .ZDI--BellFill24{
    fill: #FACB62 !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:hover .ZDI--BellFill24 + span{
    color: #FACB62 !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:hover .ZDI--UserPencilFill24:first-of-type{
    fill: #00FF7F !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:hover .ZDI--UserPencilFill24:first-of-type + span{
    color: #00FF7F !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:nth-of-type(3):hover .ZDI--UserPencilFill24{
    fill: #0084FF !important;
}
.TopNavBar-userInfo-rSUG5 .TopNavBar-icon-x37no:nth-of-type(3):hover .ZDI--UserPencilFill24 + span{
    color: #0084FF !important;
}


/*导航栏-知乎直答*/
html[data-theme=dark] .TopNavBar-inner-eTRQC .TopNavBar-tab-d8yaD a svg:nth-of-type(2) path {
    fill: #d3d3d3 !important;
}

/*导航栏按钮*/
html[data-theme=dark] .TopNavBar-userInfo-rSUG5 {
    background: #121212 !important;
}

/*轮播图*/
html[data-theme=dark] .index-root-7Tjww {
    background: #121212 !important;
}

/*左侧菜单*/
html[data-theme=dark] .index-navtab-tySe5 {
    background: #121212 !important;
    border: 1px solid #444 !important;
}

/*左侧菜单-菜单项hover*/
html[data-theme=dark] .index-navtab-tySe5 .index-card-xeNbD:hover {
    background: #ffffff1c !important;
}

/*左侧菜单-一级标题*/
html[data-theme=dark] .index-navtab-tySe5 .index-card-xeNbD .index-name-7ip2f {
    color: #d3d3d3 !important
}

/*左侧菜单-二级菜单*/
html[data-theme=dark] .index-hoverCard-jc4Zu {
    background: #191b1f !important;
    border: none !important;
}

/*右侧菜单*/
html[data-theme=dark] .index-root-3h4H5 {
    background: #121212 !important;
    border: 1px solid #444 !important;
}

/*更多回答*/
html[data-theme=dark] .index-firstTitleInfo-khQSM{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-title-7SosK{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-info-3cNeG{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-bd-98u3g svg{
    fill:#121212 !important;
    filter: brightness(0.38) !important;
}
html[data-theme=dark] .index-dividing-covgT{
    background:#444 !important;
}

/*课程介绍-回到顶部*/
html[data-theme=dark] .CornerButtonToTop-cornerButton-thbFX{
    background: #1a1a1a !important;
    color:#d3d3d3 !important;
    border:none !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-thbFX svg path{
    fill:#d3d3d3 !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-thbFX:hover{
    background: #151a23 !important;
    border:none !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-thbFX:hover svg path{
    fill:#0084ff !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-thbFX:hover .CornerButtonToTop-tip-kZ89p{
    color:#0084ff !important;
}

.CornerButtonToTop-cornerButton-qrpjx:hover svg {
    fill: #0084FF !important;
}
/*课程视频-回到顶部*/
html[data-theme=dark] .CornerButtonToTop-cornerButton-qrpjx {
    background: #1a1a1a;
    color:#d3d3d3 !important;
    border:none !important;
}

html[data-theme=dark] .CornerButtonToTop-cornerButton-qrpjx svg {
    fill: #d3d3d3 !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-qrpjx:hover{
    color: #0084FF !important;
}
html[data-theme=dark] .CornerButtonToTop-cornerButton-qrpjx:hover svg {
    fill: #0084FF !important;
}

/*课程分类*/
html[data-theme=dark] .index-goodCourseContainerHeader-j88VF > img{
    filter: brightness(0.6) invert(1) !important;
}
html[data-theme=dark] .index-title-cZ7Ux > img{
    filter: brightness(0.6) invert(1) !important;
}
html[data-theme=dark] .index-title-oxWVR > img{
    filter: brightness(0.6) invert(1) !important;
}

/*课程背景*/
html[data-theme=dark] .index-goodCourseCardContainer-mYGZe .index-goodCourseCards-bwKSm .index-goodCourseCard-tJhQ5 {
    background: #0062ff0f !important
}
html[data-theme=dark] .index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza{
    background: #0062ff0f !important
}
html[data-theme=dark] .index-moreCourse-i41VD .index-courseContainer-7ugwD .index-moreShow-4ViPd .index-courseCard-ebw4r{
    background: #0062ff0f !important
}
html[data-theme=dark] .index-videoCardItem-bzeJ1{
    background: #0062ff0f !important
}


/*课程标题*/
html[data-theme=dark] .index-title-gHxNQ .index-text-vqAEU {
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza .index-title-cZ7Ux{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-moreCourse-i41VD .index-courseContainer-7ugwD .index-moreShow-4ViPd .index-courseCard-ebw4r .index-title-oxWVR{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-title-8Nqsa a{
    color: #d3d3d3 !important;
}


/*课程作者*/
html[data-theme=dark] .index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza .index-teacher-iS5qX .index-left-3uJ9a .index-info-nMxUt .index-name-xvcEq{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-moreCourse-i41VD .index-courseContainer-7ugwD .index-moreShow-4ViPd .index-courseCard-ebw4r .index-teacher-7bo8p .index-left-i7iyK .index-info-aXZTV .index-name-gBZqv{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-teacher-4xeNi .index-left-c1R6s .index-info-8mHSm .index-name-mytRy{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .index-teacher-oRzg6 .index-left-jbZXH .index-info-spqbi .index-name-eRKoT{
    color: #d3d3d3 !important;
}


/*课程报名人数*/
html[data-theme=dark] .index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza .index-teacher-iS5qX .index-left-3uJ9a .index-desc-i4UK7 .index-descLeft-6oRth{
    border:none;
}
html[data-theme=dark] .index-moreCourse-i41VD .index-courseContainer-7ugwD .index-moreShow-4ViPd .index-courseCard-ebw4r .index-teacher-7bo8p .index-left-i7iyK .index-desc-2TFdt .index-descLeft-2Dnem{
    border:none;
}
html[data-theme=dark] .index-teacher-4xeNi .index-left-c1R6s .index-desc-qfkzi .index-descLeft-mTCLz{
    border:none;
}


/*课程直播时间*/
html[data-theme=dark] .index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza .index-teacher-iS5qX .index-left-3uJ9a .index-tags-tr5ZQ .index-tag-dGyNz{
    border:none;
}
html[data-theme=dark] .index-teacher-4xeNi .index-left-c1R6s .index-tag-jYChY .index-tagLeft-cRqGw{
    border:none;
}

/*课程播放量*/
html[data-theme=dark] .index-teacher-oRzg6 .index-left-jbZXH .index-desc-fPsXa .index-descLeft-8JgCq{
    border:none;
}


/*兴趣标签列表*/
html[data-theme=dark] .popover-root-jPqox {
    background: #121212 !important;
}

html[data-theme=dark] .popover-header-xeHyh {
    background: #121212 !important;
}

html[data-theme=dark] .popover-header-xeHyh div:last-of-type {
    background: #444 !important;
}

/*兴趣标签列表-知乎知学堂*/
html[data-theme=dark] .popover-logoRight-qcJwZ {
    filter: brightness(0.6) invert(1) !important;
}

/*兴趣标签列表-标签*/
html[data-theme=dark] .ItemComponent-unselectItemContainer-ozjFn {
    background: #ffffff1c !important;
}

html[data-theme=dark] .ItemComponent-unSecelectItemText-cXXHM {
    color: #d3d3d3 !important;
}

/*搜索框*/
.TopNavBar-searchBar-hDE1u {
    border-radius: 999px;
    background: #f8f8fa;
    border: 1px solid #ebeced;
}

html[data-theme=dark] .TopNavBar-searchBar-hDE1u {
    border-radius: 999px;
    background: #212429;
    border: 1px solid #282430;
}

/*搜索框文字*/
.TopNavBar-input-sjsdr {
    border: none;
    color: black !important;
}

html[data-theme=dark] .TopNavBar-input-sjsdr {
    border: none;
    color: #d3d3d3 !important;
}

/*搜索icon*/
.TopNavBar-searchIcon-bwNDS{
    margin-top: 4px;
}

/*更多课程按钮*/
html[data-theme=dark] .index-learnPath-dfrcu .index-more-3mk2z{
    background:#0084ff;
    color:white;
}
html[data-theme=dark] .index-learnPath-dfrcu .index-more-3mk2z svg path{
    fill:white;
}
html[data-theme=dark] .index-moreCourse-i41VD .index-more-re5tv{
    background:#0084ff;
    color:white;
}
html[data-theme=dark] .index-moreCourse-i41VD .index-more-re5tv svg path{
    fill:white;
}

/*分类标签(圆形)*/
html[data-theme=dark] .index-subMenu-qKavE .index-tag-b6PXp{
    background:#8080801c;
    color:#d3d3d3;
    border: none!important;
}
html[data-theme=dark] .index-subMenu-qKavE .index-tag-b6PXp.index-active-eQAh4{
    background:#0066ff1a;
    color:#06f;
    border: none!important;
}
/*悬浮条背景*/
html[data-theme=dark] .CourseConsultation-corner-mddzk{
    background: #151a23 !important;
    border: .5px solid #444;
}
html[data-theme=dark] .CourseConsultation-corner-mddzk .CourseConsultation-cornerButton-7ycYw{
    background: #151a23 !important
}
html[data-theme=dark] div[style="box-sizing:border-box;width:100%;margin:8px 0"] > div{
    background: #444 !important
}
/*悬浮条图标*/
html[data-theme=dark] .CourseConsultation-corner-mddzk .CourseConsultation-cornerButton-7ycYw:not(:first-of-type) path{
    fill:#d3d3d3 !important;
}
/*悬浮条文字*/
html[data-theme=dark] .CourseConsultation-corner-mddzk .CourseConsultation-cornerButton-7ycYw .CourseConsultation-tip-qBHqt{
    color: #d3d3d3 !important;
}

/*课程购买-知学堂logo*/
html[data-theme=dark] .ShelfTopNav-logo-5nfWk svg g path:nth-of-type(-n+29) {
    fill: #d3d3d3!important;
}
/*课程购买-标题*/
html[data-theme=dark] .ProductCard-titleWrap-swj39{
    color: #d3d3d3!important;
}
html[data-theme=dark] .Tabs-tab-fg7zz.Tabs-active-dv4R2{
    color: #d3d3d3!important;
}
/*课程购买须知*/
html[data-theme=dark] .Section-title-chTHJ{
    color: #d3d3d3!important;
}
/*课程购买-内容更新*/
html[data-theme=dark] .Catalog-tipsText-4qrRq{
    color: #0084ff!important;
}
/*课程购买-目录*/
html[data-theme=dark] .Catalog-chapterCommonTitle-dHpf9{
    color: #d3d3d3!important;
}
html[data-theme=dark] .SectionCell-title-iqyj6{
    color: #d3d3d3!important;
}

/*课程视频-标签*/
.CourseDescription-courseLabel-qPDMp{
    overflow: hidden;
}
/*课程视频-目录*/
html[data-theme=dark] .Tabs-active-tab-2CpLg{
    color: #0062ff!important;
}
/*课程视频-目录背景*/
html[data-theme=dark] .Tabs-container-feZhG{
    background: #121212!important;
}
/*课程视频-目录滚动条*/
.EpisodeList-episodeList-m3CAU::-webkit-scrollbar {
    width: 12px;
}
.EpisodeList-episodeList-m3CAU::-webkit-scrollbar-track {
    background: #d3d3d3;
    border-radius: 10px;
}
.EpisodeList-episodeList-m3CAU::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
.EpisodeList-episodeList-m3CAU::-webkit-scrollbar-thumb:hover {
    background: #555;
}
/*课程视频-笔记背景*/
html[data-theme=dark] .StudyNotesList-bgGray-faf74{
    background: #121212!important;
}
html[data-theme=dark] .Empty-emptyWrapper-dEdmh{
    background: #121212!important;
}
/*课程视频-推荐视频标题*/
html[data-theme=dark] .CourseItem-rightContent-pc-fTpTc .CourseItem-courseTitle-2hYnF{
    color: #d3d3d3!important;
}

/*精选回答、文章——点赞恢复蓝色*/
.index-agree-6ZwyG svg path{
    fill: #0062ff!important;
}

/*==知乎知学堂==*/

/*==创作中心==*/
/*固定导航栏*/


/*固定导航栏-创作中心label*/
html[data-theme=dark] .css-mv0sgu{
    background: #151a23 !important;
}
html[data-theme=dark] .css-hudw2e{
    color: #d3d3d3!important;
}

/*固定导航栏-当前等级*/
html[data-theme=dark] .css-i9ss08{
    color: #d3d3d3!important;
}
/*固定导航栏-活跃领域*/
html[data-theme=dark] .css-dj639p{
    color: #d3d3d3!important;
}
/*固定导航栏-内容创作*/
html[data-theme=dark] .css-15aftra > .css-4mbc0 + div{
    color: #d3d3d3!important;
    background: #151a23 !important;
}
html[data-theme=dark] .css-1ooxkda:hover{
    background:#1772f60f!important;
}
html[data-theme=dark] .css-1ooxkda:hover .ZDI{
    fill:#0084ff!important;
}
html[data-theme=dark] .css-1ooxkda:hover .css-vurnku{
    color:#0084ff!important;
}
/*固定导航栏-大菜单*/
html[data-theme=dark] .css-1b31wiw{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1b31wiw:hover{
    color:#0084ff!important;
    background:#1772f60f!important;
}
/*固定导航栏-小菜单*/
html[data-theme=dark] .css-ic1i93{
    color:#d3d3d3!important;
}
html[data-theme=dark] .css-ic1i93:hover{
    color: #1772F6!important;
    font-weight: 600;
}


/*开始创作-开始创作*/
html[data-theme=dark] .css-1qqs9rl{
    color: #d3d3d3!important;
    font-size: 19px;
    line-height: 20px;
    font-weight: 600;
}
/*开始创作-编辑区*/
html[data-theme=dark] .css-1lkz3hi{
    color: #8590a6!important;
}
html[data-theme=dark] .css-18i781m{
    color: #d3d3d3!important;
}

/*开始创作-编辑区按钮*/
html[data-theme=dark] .css-1io725t{
    color: #d3d3d3!important;
}
/*开始创作-编辑区-任何人都可以评论*/
html[data-theme=dark] .css-b0g50k{
    background: #191b1f!important;
    border: 1px solid #191b1f!important;
}
/*开始创作-编辑区-同步到圈子*/
html[data-theme=dark] .css-ksdfxq{
    background: #191b1f!important;
    border: 1px solid #191b1f!important;
}
/*开始创作-编辑区-同步到圈子-选择圈子*/
html[data-theme=dark] .css-1u2jvnm{
    color: #d3d3d3!important;
}
/*开始创作-编辑区-同步到圈子-圈子搜索框*/
html[data-theme=dark] .css-1l03w1b{
    background: #191b1f !important;
}
/*开始创作-编辑区-同步到圈子-圈子名称*/
html[data-theme=dark] .css-1fbz9r3{
    color: #d3d3d3!important;
}
/*开始创作-编辑区下框线*/
html[data-theme=dark] .css-1o927pu{
    border-bottom: 1px solid #444;
}

/*开始创作-提问题，写回答，写文章，发视频*/
html[data-theme=dark] .css-90apc9,
html[data-theme=dark] .css-1csrgc8,
html[data-theme=dark] .css-byu4by,
html[data-theme=dark] .css-nmsc95{
    color: #d3d3d3!important;
}

/*开始创作-关联同步账号，导入文档，播客转文章*/
html[data-theme=dark] .css-kwaq2d:hover,
html[data-theme=dark] .css-1qs639:hover,
html[data-theme=dark] .css-1ggwcl9:hover{
    color:#0084ff!important;
    background:#1772f60f!important;
}

/*开始创作-关联同步账号，导入文档，播客转文章label*/
html[data-theme=dark] .css-13uu85k,
html[data-theme=dark] .css-qbngl8{
    color: #d3d3d3!important;
    background: #151a23 !important;
}

/*打卡瓜分盐粒-背景*/
html[data-theme=dark] .css-h4qwk4{
    background: #191b1f !important;
    border:1px solid #282b30 !important;
}
/*打卡瓜分盐粒-标题*/
html[data-theme=dark] .css-115e8pr{
    color: #d3d3d3 !important;
}
/*打卡瓜分盐粒-橙色奖励*/
html[data-theme=dark] .css-16t5hun{
    background: #191b1f !important;
}
/*打卡瓜分盐粒-盐粒*/
html[data-theme=dark] .css-nnul91{
    background: #151a23 !important;
}
/*打卡瓜分盐粒-盐粒数量*/
html[data-theme=dark] .css-1yxi74z{
     color: #d3d3d3 !important;
}


/*最新创作-边框*/
html[data-theme=dark] .css-1h6aqd2{
    border:1px solid #282b30 !important;
}
/*最新创作-背景*/
html[data-theme=dark] .css-6fkoqt{
    background: #191b1f !important;
}
/*最新创作-标签*/
html[data-theme=dark] .css-yzcc7h{
    color: #d3d3d3 !important;
}
/*最新创作-最新创作*/
html[data-theme=dark] .css-1tthggp{
    color: #d3d3d3 !important;
}
/*最新创作-问题颜色*/
html[data-theme=dark] .css-1yxqd58{
    color: #d3d3d3 !important;
}
/*最新创作-卡片背景*/
html[data-theme=dark] .css-1ms3yqq{
    background: #151a23 !important;
}
/*最新创作-卡片数字*/
html[data-theme=dark] .css-1b40e4e{
    color: #d3d3d3 !important;
}
/*最新创作-卡片详情箭头*/
html[data-theme=dark] .css-w1lktj svg{
    fill: #d3d3d3 !important;
}

/*最新创作-竖向间隔线-创作数据*/
html[data-theme=dark] .css-dsr9g1::after{
    background:#444 !important;
}


/*创作数据-背景*/
html[data-theme=dark] .css-1mxey1w{
    background: #191b1f !important;
}
/*创作数据-数字*/
html[data-theme=dark] .css-15zm0bh{
    color: #d3d3d3 !important;
}
/*创作数据-创作数据*/
html[data-theme=dark] .css-qj59oc{
    color: #d3d3d3 !important;
}


/*创作灵感-背景*/
html[data-theme=dark] .css-p555uj{
    background: #191b1f !important;
}
/*创作灵感-边框*/
html[data-theme=dark] .css-14wefvy{
    border: 1px solid #282b30 !important;
}
/*创作灵感-创作灵感*/
html[data-theme=dark] .css-1st2s4x{
    color: #d3d3d3 !important;
}
/*创作灵感-问题分类按钮*/
html[data-theme=dark] .css-tzviga{
    background: #1772f60f !important;
}
/*创作灵感-问题分类按钮-active*/
html[data-theme=dark] .css-1643czp{
    color:#0084ff !important;
}
/*创作灵感-问题分类按钮-normal*/
html[data-theme=dark] .css-w5flr2{
    color:#d3d3d3 !important;
}
/*创作灵感-问题标题*/
html[data-theme=dark] .css-i3d39x{
    color: #d3d3d3 !important;
}
/*创作灵感-问题边框*/
html[data-theme=dark] .css-11hgvqy{
    border-bottom: 1px solid #444 !important;
}
/*创作灵感-灰色渐变条*/
html[data-theme=dark] .css-20hwyq{
    background: linear-gradient(180deg, #191b1f00 0%, #191b1f 100%);
}


/*近期热点-背景*/
html[data-theme=dark] .css-142ik2i{
    background: #191b1f !important;
}
/*近期热点-问题标题*/
html[data-theme=dark] .css-w0iiiv{
    color: #d3d3d3 !important;
}
/*近期热点-问题搜索框*/
html[data-theme=dark] .css-1e31h8y{
    background: #191b1f !important;
    border: 1px solid #444 !important;
}


/*圆桌-圆桌*/
html[data-theme=dark] .css-x6heq4{
    color: #d3d3d3 !important;
}
/*近期热点-背景*/
html[data-theme=dark] .css-1na61gt{
    background: #191b1f !important;
}
/*近期热点-间隔*/
html[data-theme=dark] .css-ov3mmw{
    background: #191b1f !important;
}
/*近期热点-图片文字*/
html[data-theme=dark] .css-8945o6{
    color: #d3d3d3 !important;
}




/*发布想法-编辑区*/
html[data-theme=dark] .css-16q9zcp{
    color: #d3d3d3!important;
    background: #151a23 !important;
    border:1px solid #444 !important;
}
/*发布想法-标题*/
html[data-theme=dark] .css-odpg9{
    color: #d3d3d3!important;
    background: #151a23 !important;
}
/*发布想法-内容*/
html[data-theme=dark] .css-tl7t4z{
    color: #d3d3d3!important;
    background: #151a23 !important;
}
/*发布想法-标签*/
html[data-theme=dark] .css-1knhl7g{
    color:#d3d3d3!important;
    background:#8080801c!important;
    border: none!important;
}
/*发布想法-评论权限*/
html[data-theme=dark] .css-1qwha0s{
    background: #191b1f!important;
    border: none!important;
}
html[data-theme=dark] .css-13ev0i{
    background: #191b1f!important;
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-13ev0i:hover{
    color: #0084ff!important;
}


/*创作助手-背景*/
html[data-theme=dark] .AIAssistantPanelV2-container{
    background: transparent !important;
}
html[data-theme=dark] .css-1t81og5{
    background: #191b1f !important;
}
/*创作助手-按钮背景*/
html[data-theme=dark] .css-1m7gidr{
    background: #151a23 !important
}
/*创作助手-按钮背景（更多功能）*/
html[data-theme=dark] .css-5rqv84{
    background: #151a23 !important
}

/*创作助手-按钮背景-进行中*/
html[data-theme=dark] .css-jjc8wi{
    background: #151a23 !important
}
/*创作助手-下方圆按钮背景*/
html[data-theme=dark] .css-frq7ol{
    color: #d3d3d3 !important;
    background: #151a23 !important
}


/*创作助手-创作助手*/
html[data-theme=dark] .css-q0tc2e{
    color: #d3d3d3 !important;
}
/*创作助手-文字颜色*/
html[data-theme=dark] .css-1rhsjve{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-vjnexy{
    color: #d3d3d3 !important;
}

/*创作助手-内容检测-建议*/
html[data-theme=dark] .css-kmgwru{
    color: #d3d3d3 !important;
}

/*创作助手-智能排版-建议*/
html[data-theme=dark] .css-nxjkto{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-1wmdc2e{
    color: #d3d3d3 !important;
}

/*创作助手-智能标题-建议*/
html[data-theme=dark] .css-15a9fqm{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-1qa45vk{
    color: #d3d3d3 !important;
}
/*创作助手-智能标题-建议-hover*/
html[data-theme=dark] .css-fwxkla:hover{
    background: #f8f8fa14 !important;
}

/*创作助手-提取导语-建议-hover*/
html[data-theme=dark] .css-1dzu56:hover{
    background: #f8f8fa14 !important;
}
/*创作助手-提取导语-建议-左侧条*/
html[data-theme=dark] .css-j9sitb{
    border-left: 3px solid #d3d3d3;
}




/*发布文章-背景*/
html[data-theme=dark] .css-1losy9j{
    background: #121212 !important;
}
html[data-theme=dark] .css-1t2bime {
    background: #191b1f!important;
}
html[data-theme=dark] .css-6m6j2m {
    background: #191b1f!important;
}
html[data-theme=dark] .css-h01sv1 {
    background: #191b1f!important;
}


/*发布文章-工具栏背景*/
html[data-theme=dark] .css-1ykdma4 {
    background: #191b1f!important;
}

/*发布文章-工具栏*/
html[data-theme=dark] .css-10r8x72{
    box-shadow: 0px -0.5px 0px 0px #444 inset;
}
/*发布文章-工具栏按钮*/
html[data-theme=dark] .ToolbarButton:hover{
    background: #8080801c !important;
}
html[data-theme=dark] .ToolbarButton:hover .ZDI{
    fill: #0084ff !important;
}
html[data-theme=dark] .ToolbarButton:hover .css-8atqhb{
    color: #0084ff !important;
}
/*发布文章-工具栏二级按钮*/
html[data-theme=dark] .Menu > button{
    color:#d3d3d3 !important;
}
html[data-theme=dark] .Menu > button:hover{
    color:#0084ff !important;
    background: #8080801c !important;
}

/*发布文章-工具栏更多*/
html[data-theme=dark] .css-1pmadmj.Button.Button--plain{
    background: #191b1f!important;
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-15bmk8d.Button.Button--plain{
    background: #191b1f!important;
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1pmadmj.Button.Button--plain:hover{
    background: #8080801c!important;
    color: #0084ff!important;
}


/*发布文章-底栏*/
html[data-theme=dark] .css-1ppjin3{
    background: #121212 !important;
    border-top: 1px solid #444 !important;
}
html[data-theme=dark] .css-1ulchq2:hover{
    background: #8080801c !important;
}
/*发布文章-编辑区*/
html[data-theme=dark] .css-1so3nbl{
    background: #191b1f!important;
}
/*
html[data-theme=dark] .PostEditor .DraftEditor-root{
    border: 1px solid #444 !important;
}
*/
html[data-theme=dark] .css-1gopqwh{
    border: 1px solid #444 !important;
}

/*发布文章-发布设置*/
html[data-theme=dark] .css-13mrzb0{
    background: #191b1f!important;
}
html[data-theme=dark] .css-19m36yt{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1yj4uzm{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-qhzfje{
    background: #191b1f!important;
}
/*发布文章-创作声明*/
html[data-theme=dark] .css-1rrt0uk{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1rrt0uk:hover{
    color: #0084ff!important;
}
/*发布文章-文章话题*/
html[data-theme=dark] .css-jkribc{
    color: #d3d3d3!important;
}
/*发布文章-添加话题*/
html[data-theme=dark] .css-1gtqxw0{
    color: #d3d3d3!important;
    background: #191b1f!important;
    border: 1px solid #444 !important;
}
html[data-theme=dark] .css-1gtqxw0:hover {
    background: #8080801c !important;
}
/*发布文章-搜索话题*/
html[data-theme=dark] .css-4cffwv>div{
    background: #191b1f!important;
    color:#0084ff!important;
    /*border: 1px solid #444 !important;*/
}
html[data-theme=dark] .css-4cffwv>label{
    background: #191b1f!important;
    border: 1px solid #444 !important;
}
/*发布文章-搜索话题列表*/
html[data-theme=dark] .css-ogem9c{
    background: #191b1f!important;
    border:none!important;
}
html[data-theme=dark] .css-gfrh4c{
    background: #191b1f!important;
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-gfrh4c:hover{
    color: #0084ff!important;
}
/*发布文章-内容来源*/
html[data-theme=dark] .css-16tjfny{
    border: 1px solid #444 !important;
}
html[data-theme=dark] .css-19bjnr2 {
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-19bjnr2:hover {
    background: #8080801c !important;
}




/*满意度-标题*/
html[data-theme=dark] .css-1eht88d{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1hk30kn{
    color: #d3d3d3!important;
}





/*=主页=*/
/*公告栏*/
html[data-theme=dark] #creator-announcement{
    color: #d3d3d3!important;
}
/*公告栏-公告列表-菜单边框*/
html[data-theme=dark] .css-9cy5i3{
     border-bottom:1px solid #444 !important;
}
/*公告栏-公告列表-菜单-active*/
html[data-theme=dark] .css-rut08n{
    color: #0084ff!important;
}
/*公告栏-公告列表-菜单-normal*/
html[data-theme=dark] .css-kyq2af{
    color: #d3d3d3!important;
}
/*公告栏-公告列表-链接*/
html[data-theme=dark] .css-awfp1g{
    color: #d3d3d3!important;
}
/*公告栏-公告列表-链接边框*/
html[data-theme=dark] .css-19bu5d0{
    border-bottom:1px solid #444 !important;
}
/*公告栏-公告详情-公告顶部边框*/
html[data-theme=dark] .css-1wdohh9{
     color:#8090a6 !important;
     border-bottom:1px solid #444 !important;
}
/*公告栏-公告详情-公告背景*/
html[data-theme=dark] .css-lcuhwd{
     background: #191b1f !important;
}
/*公告栏-公告详情-公告标题*/
html[data-theme=dark] .css-9oqw35 > div{
     color: #d3d3d3!important;
}
/*公告栏-公告详情-内容链接*/
html[data-theme=dark] .announcement_Article a{
     background: #191b1f !important;
}



/*热门问题*/
html[data-theme=dark] .css-2kp40o{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-12kq1qx{
    color: #d3d3d3!important;
}
/*创作学院*/
html[data-theme=dark] #creator-manual{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-cnnstd{
    color: #d3d3d3!important;
}
/*提等级*/
html[data-theme=dark] .css-1mbpn2d{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1kki0ei{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-hm67sn:nth-of-type(n + 3){
    border-top: 1px solid #444!important;
}
/*等级任务*/
html[data-theme=dark] .css-pq1tj9{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-180vb7x{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-risksa{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-6j0ktf{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1yn8tbw{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-n0arjk{
    filter:invert(1)!important;
}
html[data-theme=dark] .css-33pnco{
    color: #d3d3d3!important;
}
/*赚收益*/
html[data-theme=dark] .css-1yjqd5z{
    background: #191b1f!important;
}
html[data-theme=dark] .css-rwh8c6{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1wp1nud{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1fu8ne5{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1946lac{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1nk6mv0{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-pjaw30{
    filter:invert(1)!important;
}
/*=主页=*/

/*=圈子=*/
/*圈子背景*/
html[data-theme=dark] .css-1g878q7{
    background: #191b1f!important;
}
/*分享想法背景*/
html[data-theme=dark] .css-17pkp3f{
    background: #191b1f!important;
}
/*=圈子=*/

/*=创作灵感=*/

/*问题推荐-高考季banner*/
html[data-theme=dark] .css-guh6n2{
    background: #191b1f!important;
}
html[data-theme=dark] .css-guh6n2 font[color="#646464"]{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-lvugaq{
    background: #191b1f!important;
}
/*问题推荐-表格*/
html[data-theme=dark] .css-e4rh9a{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-n9ov20{
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-1hbj689{
    border-bottom: 1px solid #444!important;
}
/*问题推荐-问题标题*/
html[data-theme=dark] .css-1o7uqnr{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-ms14rw{
    color: #d3d3d3!important;
}
/*问题推荐-提问用户*/
html[data-theme=dark] .css-1nr5ql7{
    color: #d3d3d3!important;
}
/*问题推荐-推荐理由*/
html[data-theme=dark] .css-1czelnl{
    color: #9196a1!important;
}
/*问题推荐-赞同过你*/
html[data-theme=dark] .css-n5qv0h{
    color: #0084ff!important;
}
/*问题推荐-擅长话题*/
html[data-theme=dark] .css-1232est{
    color: #0084ff!important;
    background:#1772f60f!important;
    border:none!important;
}


/*近期热点-背景*/
html[data-theme=dark] .css-35pmty{
    background: #191b1f!important;
}
/*近期热点-固定表头*/
html[data-theme=dark] .css-1w5avc2{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
/*近期热点-分类标签*/
html[data-theme=dark] .css-hdz1a3{
    color: #d3d3d3!important;
    background:#8080801c!important;
}
html[data-theme=dark] .css-12c1djq{
    color: #1772f6!important;
    background:#1772f614!important;
}
/*近期热点-问题*/
html[data-theme=dark] .css-dpt3mb{
    color: #d3d3d3!important;
}
html[data-theme=dark] .css-1fd22oq{
    border-bottom: 1px solid #444!important;
}
/*近期热点-问题标签*/
html[data-theme=dark] .css-1q65fkr{
    color: #0084ff!important;
    background:#8080801c!important;
}
/*近期热点-热力值*/
html[data-theme=dark] .css-1dydzuy{
    color: #d3d3d3!important;
}
/*近期热点-增量*/
html[data-theme=dark] .css-1ggwcl9{
    color: #d3d3d3!important;
}
/*近期热点-加载占位*/
html[data-theme=dark] .skeleton {
    background: #121212 !important;
}
html[data-theme=dark] .skeleton__line {
    background-color: #1b1b1b !important;
    background-image: -webkit-gradient(linear,left top,right top,from(#1b1b1b),color-stop(25%,#2e2e2e),color-stop(75%,#2e2e2e),to(#1b1b1b)) !important;
    background-image: linear-gradient(90deg,#1b1b1b 0,#2e2e2e 25%,#2e2e2e 75%,#1b1b1b) !important;
}
html[data-theme=dark] .skeleton__line::after{
    background-color: #1b1b1b !important;
    box-shadow:none!important;
}
/*近期热点-日榜/周榜*/
html[data-theme=dark] .css-1vu7v1r{
    border: 1px solid #444!important;
}


/*问题搜索-背景*/
html[data-theme=dark] .css-xpmfhx{
    background: linear-gradient(#121314,#191b1f)!important;
}
/*问题搜索-问题卡片*/
html[data-theme=dark] .css-3zr8ne{
    background: #151a23 !important
}
/*问题搜索-知乎热词*/
html[data-theme=dark] .css-atxtl4{
    color: #d3d3d3 !important;
}
/*问题搜索-热门问题*/
html[data-theme=dark] .css-qlj5ur{
    color: #d3d3d3 !important;
}
/*=创作灵感=*/



/*=内容管理=*/
/*内容管理-背景*/
html[data-theme=dark] .css-1t0dqk7{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-1t0dqk7::before{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1357f6{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1ury69a{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-1cr4989{
    background: #191b1f!important;
}
html[data-theme=dark] .css-d70ruc{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-slqtjm{
    background: #191b1f!important;
}
/*内容管理-顶部菜单边框*/

html[data-theme=dark] .css-1ndmaqd::before{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1ndmaqd{
    border-bottom: 1px solid #444!important;
    background: #191b1f!important;
}

/*内容管理-暂无内容*/
html[data-theme=dark] .css-xoei2t{
    background: #191b1f!important;
}
html[data-theme=dark] .css-7aol5k{
    background: #191b1f!important;
}
/*内容管理-内容数量*/
html[data-theme=dark] .css-1jrei64{
    color: #d3d3d3 !important;
}
/*内容管理-问题标题*/
html[data-theme=dark] .css-1brgq4x{
    color: #d3d3d3 !important;
}
/*内容管理-问题回答*/
html[data-theme=dark] .css-1yuw5jz{
    color: #d3d3d3 !important;
}
/*内容管理-问题分割线*/
html[data-theme=dark] .css-htr1wb + .CreationManage-CreationCard{
    border-top: 1px solid #444!important;
}
/*内容管理-草稿箱分类*/
html[data-theme=dark] css-1wi98sv{
    color: #d3d3d3 !important;
}
html[data-theme=dark] css-1wi98sv.is-active{
    color: #1772f6 !important;
}
/*内容管理-排序按钮*/
html[data-theme=dark] .css-pi8g4d{
    border:1px solid #444!important;
}


/*评论管理-背景*/
html[data-theme=dark] .css-1edot45{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1615dnb {
    background: #191b1f!important;
}
html[data-theme=dark] .css-bl1k5s {
    background: #191b1f!important;
    border-right:1px solid #444!important;
}
html[data-theme=dark] .css-k5im1d {
    background: #191b1f!important;
}
html[data-theme=dark] .css-k5im1d + .CommentManage-CreationCard > div{
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-986uza {
    background: #191b1f!important;
}
html[data-theme=dark] .css-986uza + .CommentManage-CreationCard > div{
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-kl7j3m {
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-1soxxcw + .CommentManage-CommentCard > div {
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-5jdstw {
    background: #191b1f!important;
}
html[data-theme=dark] .css-5jdstw + .CommentManage-CreationCard > div {
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-1rniuv1 {
    background: #191b1f!important;
}
html[data-theme=dark] .css-1w24404 {
    background: #191b1f!important;
}
html[data-theme=dark] .css-1w24404 + .CommentManage-CreationCard > div {
    border-top:1px solid #444!important;
}

/*评论管理-最新评论*/
html[data-theme=dark] .css-1kq86bv{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-k5im1d .css-1kq86bv{
    color:#0084ff!important;
}
/*评论管理-评论内容*/
html[data-theme=dark] .css-z06s02{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-1w24404 .css-z06s02{
    color:#0084ff!important;
}
/*评论管理-问题标题*/
html[data-theme=dark] .css-4uviby{
    color: #d3d3d3 !important;
}
/*评论管理-作者标志*/
html[data-theme=dark] .css-zcrcer{
    color: #0084ff !important;
    border:1px solid #444!important;
}
/*=内容管理=*/



/*=数据分析=*/
/*内容分析-边框*/
html[data-theme=dark] .css-158a5mc{
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-15e49nr{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1ebn9t9{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-32kpjn{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1gvwuyu{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1xydvrl{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1u0mb11{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-x2zg2y{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-j970ps .CreatorTable-tableRow{
    border-bottom: 1px solid #444!important;
}
/*内容分析-数据总览*/
html[data-theme=dark] .css-1k65ame{
    color: #d3d3d3 !important;
}
/*内容分析-阅读总量*/
html[data-theme=dark] .css-anmzua{
    color: #d3d3d3 !important;
}
/*内容分析-最近统计*/
html[data-theme=dark] .AnalyticsDetailRangePicker .Button {
    color: #d3d3d3 !important;
}
html[data-theme=dark] .AnalyticsDetailRangePicker .Button.is-active {
    color: #1772f6 !important;
}
/*内容分析-高级数据*/
html[data-theme=dark] .css-1yijwry{
    color: #d3d3d3 !important;
}
/*内容分析-数据趋势*/
html[data-theme=dark] .css-1xvfl67{
    color: #d3d3d3 !important;
}
/*内容分析-数据列表*/
html[data-theme=dark] .css-38vuf7 .CreatorTable-tableData{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-38vuf7 .CreatorTable-tableRow{
    border-bottom: 1px solid #444!important;
}
/*内容分析-流量来源*/
html[data-theme=dark] .css-1rspjpf{
    color: #d3d3d3 !important;
}
/*内容分析-导出Excel*/
.css-ywo81i{
    color: #1c9b55 !important
}
/*内容分析-单篇回答分析*/
html[data-theme=dark] .css-1bcljsj{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-j970ps .CreatorTable-tableData{
    color: #d3d3d3 !important;
}
/*内容分析-单篇回答详细分析*/
html[data-theme=dark] .css-zj15zn{
    border-bottom: 1px solid #444!important;
}
html[data-theme=dark] .css-zi9b3g{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-7olrk9{
    border: 1px solid #444!important;
}
html[data-theme=dark] .css-1q42e85{
    color: #8590a6 !important;
}
html[data-theme=dark] .css-713e0k{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-od6vy7{
    border: 1px solid #444!important;
}


/*收益分析-背景*/
html[data-theme=dark] .css-1m8gbjc{
    background: #191b1f!important;
}
/*收益分析-表头*/
html[data-theme=dark] .css-1jw6urh{
    border-bottom: 1px solid #444!important;
}
/*收益分析-数据总览*/
html[data-theme=dark] .css-1oqbvad{
    background: #191b1f!important;
}
html[data-theme=dark] .css-urncze{
    color: #d3d3d3 !important;
}
/*收益分析-今日收益*/
html[data-theme=dark] .css-15box0{
    color: #d3d3d3 !important;
}
/*收益分析-收益数字*/
html[data-theme=dark] .css-1woiwqg{
    color: #d3d3d3 !important;
}
/*收益分析-导出Excel*/
.css-rhskwy{
    color: #1c9b55 !important
}
/*收益分析-详细数据*/
html[data-theme=dark] .css-h4o1q9{
    border: 1px solid #444!important;
}


/*关注者分析-背景*/
html[data-theme=dark] .css-1ta275q{
    background: #191b1f!important;
}
/*关注者分析-表头*/
html[data-theme=dark] .css-ohrujx{
    border-bottom: 1px solid #444!important;
}
/*关注者分析-大标题*/
html[data-theme=dark] .css-1t3in1{
    color: #d3d3d3 !important;
}
/*关注者分析-详细数据*/
html[data-theme=dark] .css-g62hty{
    color: #1772f6 !important
}
/*关注者分析-关注者画像*/
html[data-theme=dark] .css-1iz9tag{
    color: #d3d3d3 !important;
}
/*收益分析-导出Excel*/
.css-j8tcr6{
    color: #1c9b55 !important
}
/*=数据分析=*/

/*=芝士平台=*/
/*好物推荐-基础权限*/
html[data-theme="dark"] .RecruitTab-itemContainer{
    color: #d3d3d3 !important;
}
/*好物推荐-新手教学*/
html[data-theme="dark"] .CreatorRecruitAuditPassed-title{
    color: #d3d3d3 !important;
}
/*好物推荐-问题推荐*/
html[data-theme=dark] .Creator-SubTabItem.Creator-SubTabItem--active{
    color: #0084ff!important
}
/*好物推荐-问题标题*/
html[data-theme=dark] .MCNQuestionListItem-title{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .MCNQuestionListItem-title:hover{
    color: #0084ff!important
}
/*好物推荐-写回答*/
html[data-theme=dark] .MCNQuestionListItem-answerBtn{
    color: #d3d3d3 !important;
}
/*好物推荐-加载占位*/
html[data-theme=dark] .skeleton {
    background: #121212 !important;
}
html[data-theme=dark] .skeleton__line {
    background-color: #1b1b1b !important;
    background-image: -webkit-gradient(linear,left top,right top,from(#1b1b1b),color-stop(25%,#2e2e2e),color-stop(75%,#2e2e2e),to(#1b1b1b)) !important;
    background-image: linear-gradient(90deg,#1b1b1b 0,#2e2e2e 25%,#2e2e2e 75%,#1b1b1b) !important;
}
/*好物推荐-背景*/
html[data-theme="dark"] .ProfitMCN{
    background: #191b1f!important;
}
/*好物推荐-预估收入*/
html[data-theme="dark"] .ProfitMCN-statisticsCard{
    background: #191b1f!important;
}
/*好物推荐-订单详情*/
html[data-theme="dark"] .Tabs-link.is-active{
    color:#0084ff!important;
}
html[data-theme="dark"] .css-ndiv23{
    box-shadow: none!important;
    background: #191b1f!important;
    border: 1px solid #444!important;
}
html[data-theme="dark"] .css-yoot9h{
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
/*好物推荐-订单信息表头*/
html[data-theme="dark"] .CreatorTable{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme="dark"] .CreatorTable-tableHead{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme="dark"] .css-d5vvj{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme="dark"] .css-ai90om{
    color: #d3d3d3 !important;
    background: #191b1f!important;
    border-bottom: 1px solid #444!important;
}
html[data-theme="dark"] .css-6phhh0{
    border-bottom: 1px solid #444!important;
}
/*推广设置*/
html[data-theme=dark] .ggrSettings{
    background: #191b1f!important;
}
html[data-theme=dark] .MCNSettingItem{
    background: #121212 !important;
}
/*芝士平台导航栏*/
html[data-theme="dark"] .middle___3vOfh a{
    color: #d3d3d3 !important;
}
html[data-theme="dark"] .middle___3vOfh a.active{
    color: #056de8 !important;
}
/*芝士平台banner*/
html[data-theme=dark] .entryBg___1If_d{
    filter: brightness(0.6)!important;
}
/*任务广场*/
html[data-theme=dark] .taskCenter___WSAED .top___M5CzR .ant-tabs-nav .ant-tabs-tab{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .taskCenter___WSAED .top___M5CzR .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active{
    color: #0084ff !important;
}
html[data-theme=dark] .taskCenter___WSAED .part___1klFQ{
    background: #191b1f!important;
}
html[data-theme=dark] .bg-GBK99A{
    background: #191b1f!important;
}
html[data-theme=dark] .bg-GBK99A{
    background: #191b1f!important;
}

/*任务广场-输入框与选择框*/
html[data-theme=dark] .ant-input{
    color: #d3d3d3 !important;
    background: #191b1f!important;
    border:1px solid #444!important;
}
html[data-theme=dark] .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled){
    border:1px solid #2c8df5!important;
}
html[data-theme=dark] .ant-input-suffix svg{
    fill: #d3d3d3!important;
}
html[data-theme=dark] .ant-select-selection{
    color: #d3d3d3 !important;
    background: #191b1f!important;
    border:1px solid #444!important;
}
html[data-theme=dark] .ant-select-selection:hover{
    border:1px solid #2c8df5!important;
}
html[data-theme=dark] .ant-select-arrow svg{
    fill: #d3d3d3!important;
}
/*任务广场-下拉列表*/
html[data-theme=dark] .ant-select-dropdown{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme=dark] .ant-select-dropdown-menu-item-selected{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme=dark] .ant-select-dropdown-menu-item{
    color: #d3d3d3 !important;
    background: #191b1f!important;
}
html[data-theme=dark] .ant-select-dropdown-menu-item-selected{
    color: #0084ff !important;
    background: #191b1f!important;
}
html[data-theme=dark] .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled){
    color: #0084ff !important;
    background: #191b1f!important;
}
/*=芝士平台=*/

/*=权益中心=*/
/*创作权益*/
html[data-theme=dark] .css-9gnnsk{
    filter: opacity(0.6) !important;
}
/*创作权益-标题*/
html[data-theme=dark] .css-1oq372o{
    color: #d3d3d3 !important;
}
/*创作分明细-总览*/
html[data-theme=dark] .GrowthLevel-panelCard{
    filter: opacity(0.6) !important;
}
/*创作分明细-更新时间*/
html[data-theme=dark] .css-ttldhb{
    color: #d3d3d3 !important;
}
/*创作分明细-说明*/
html[data-theme=dark] .css-gmeku3{
    color: #d3d3d3 !important;
}
/*创作分明细-查询时间范围*/
html[data-theme=dark] .css-yt5ue7{
    color: #d3d3d3 !important;
    background: #191b1f!important;
    border:none!important;
}
html[data-theme=dark] .css-yt5ue7:hover{
    color: #0084ff !important;
}
/*创作分明细-分值列表*/
html[data-theme=dark] .css-1h7b043{
    border:1px solid #444!important;
}
html[data-theme=dark] .css-kgp89k{
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-kgp89k > div{
    color: #d3d3d3 !important;
}
/*创作分明细-创作分变更详情*/
html[data-theme=dark] .css-zhnajm{
    border-bottom:none!important;
}
html[data-theme=dark] .css-1e58emc{
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-1e58emc > div{
    color: #d3d3d3 !important;
}
/*=权益中心=*/

/*=创作成长=*/
/*活动中心*/
html[data-theme=dark] .css-9qcwm9{
    color: #d3d3d3 !important;
}

/*创作者学院-表头*/
html[data-theme=dark] .css-obieaf{
    background: #121212!important;
}
html[data-theme=dark] .css-yykvn6{
    color: #d3d3d3 !important;
    background: #121212!important;
    border-bottom:1px solid #444!important;
}
/*创作者学院-视频标题*/
html[data-theme=dark] .css-141xy67{
    color: #d3d3d3 !important;
}
/*创作者学院-课程总数*/
html[data-theme=dark] .css-11prr91{
    color: #d3d3d3 !important;
}

/*创作榜单*/
html[data-theme=dark] .css-he18ou{
    color: #d3d3d3 !important;
}
/*创作榜单-边框*/
html[data-theme=dark] .css-hz4ajc{
    border-bottom:1px solid #444!important;
}
/*=创作成长=*/

/*=个人中心=*/
/*创作设置-编辑器设置*/
html[data-theme=dark] .css-fqja0q{
    background: #121212!important;
}
html[data-theme=dark] .css-bmqzl{
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-1gb1bqz{
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-cdfqm + .CreatorEditorSettingItem{
    border-top:1px solid #444!important;
}
html[data-theme=dark] .css-vm9s9s{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-iotqsc{
    color: #d3d3d3 !important;
}
/*账号信息-关联账号*/
html[data-theme=dark] .css-114mqx8{
    background: #12121230!important;
}
html[data-theme=dark] .css-ipuq3s{
    background: #191b1f!important;
    border-bottom:1px solid #444!important;
}
.css-ipuq3s.is-fixed {
    left:226.5px !important;
}
html[data-theme=dark] .css-3if57f{
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-3if57f div{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-9ofz8q .MultiUploadButton-addWrapper{
    border:1px solid #444!important;
}

/*常见问题*/
html[data-theme=dark] .css-15sganu{
    box-shadow: #444 0px -1px 0px 0px inset;
}
/*瓦力保镖*/
html[data-theme=dark] .css-onu91o{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-yckfye{
    background: #191b1f!important;
}
html[data-theme=dark] .css-1vrab86{
    border:1px solid #444!important;
}
html[data-theme=dark] .css-lztgnc{
    background: #191b1f!important;
}
html[data-theme=dark] .css-our8ff tbody tr:nth-of-type(2n+1){
    background: #212429!important;
}
/*版权服务-常见问题*/
html[data-theme=dark] .ToolsCopyright-answer{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .ToolsCopyright-question{
    color: #d3d3d3 !important;
}
/*=个人中心=*/

/*==创作中心==*/



/*==盐选作者平台==*/
/*固定导航栏-过渡边框*/
.ant-menu-item:not(.ant-menu-item-disabled):focus-visible, .ant-menu-submenu-title:not(.ant-menu-item-disabled):focus-visible{
    box-shadow:none!important;
}
/*固定导航栏-大菜单*/
html[data-theme=dark] .Creator-salt-new-author-menu .ant-menu{
    color: #d3d3d3 !important;
    background: #151a23 !important;
}
html[data-theme=dark] .ant-menu-submenu-title:hover{
    color:#0084ff!important;
    background:#1772f60f!important;
}
html[data-theme=dark] .Creator-salt-new-author-route{
    border-right: none!important;
}
/*固定导航栏-小菜单*/
html[data-theme=dark] .Creator-salt-new-author-route .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
    color:#03a9f4!important;
    background:none!important;
}
html[data-theme=dark] .Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover{
    color:#03a9f4!important;
    background:#1772f60f!important;
}
/*=认识我们=*/
/*盐选作者福利*/
html[data-theme=dark] .Creator-salt-new-author-content{
    background:#070300 !important;
}
html[data-theme=dark] .Creator-salt-author-welfare{
    filter:invert(1)!important
}
html[data-theme=dark] .Creator-salt-author-welfare .Creator-salt-author-welfare-subtitle{
    color: grey !important;
}
html[data-theme=dark] .Creator-salt-author-welfare .Creator-salt-author-welfare-title{
    filter: invert(0.66) !important;
}
html[data-theme=dark] .Creator-salt-author-welfare .Creator-salt-author-welfare-card h1{
    color: grey !important;
}
html[data-theme=dark] .css-15eqbps{
    background:#070300 !important
}
/*=认识我们=*/

/*=如何赚钱=*/
/*作者经纪签、作者独家签*/
html[data-theme=dark] .Create-author-salt-content-title{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .Create-author-salt-sub-title{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .Creator-salt-author-exclusive-sign-list{
    color: #d3d3d3 !important;
}
/*=如何赚钱=*/

/*=影响力打造=*/
/*影视改造-作品分类*/
html[data-theme=dark] .Creator-salt-author-collect-activity .ant-tabs-tab{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .Creator-salt-author-collect-activity .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
    color: #0084ff !important;
}
html[data-theme=dark] .ant-tabs-bottom>.ant-tabs-nav:before,
html[data-theme=dark] .ant-tabs-bottom>div>.ant-tabs-nav:before,
html[data-theme=dark] .ant-tabs-top>.ant-tabs-nav:before,
html[data-theme=dark] .ant-tabs-top>div>.ant-tabs-nav:before{
    border: 1px solid #444!important;
}
/*=影响力打造=*/

/*=官方有话说=*/
/*管理规范*/
html[data-theme=dark] .Creator-salt-author-manage-specification-sub-title{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .Creator-salt-author-manage-specification-third-title{
    color: #d3d3d3 !important;
}
/*=官方有话说=*/

/*==盐选作者平台==*/

/*==知乎问题==*/
/*问题标签卡片*/
html[data-theme=dark] .css-wmwsyx {
    background: #191b1f !important;
    border: 1px solid #191b1f;
}

/*超链接卡片*/
html[data-theme=dark] .css-19tsar1.LinkCard{
    background: #26292a !important;
}

/*视频卡片*/
html[data-theme=dark] .css-ob6uua .LinkCard.new{
    background: #121212 !important;
}
/*评论输入框*/
html[data-theme=dark] .InputLike.css-1rl4wxv{
    border: none !important;
}
/*评论输入框-固定*/
html[data-theme=dark] .css-kt4t4n {
    background: #191b1f !important;
}
/*评论区-更多*/
html[data-theme=dark] .css-pu97ow {
    fill: #2e2e2e !important
}
html[data-theme=dark] .css-h9kawn {
    background: #191b1f !important;
}
html[data-theme=dark] .css-wqf2py:hover {
    color: #0084ff !important;
}
/*评论区-查看全部回复*/
html[data-theme=dark] .css-70t8h2 {
    background: #121212 !important;
    border-bottom: 20px solid #121212;
}
html[data-theme=dark] .css-1onritu::before{
    border-bottom: 1px solid #444;
}

/*评论区-回复按钮*/
.css-1ij6qqc:focus-visible {
    box-shadow:none !important;
    color:#32CD32;
}
.css-1ij6qqc:hover {
    color:#32CD32;
}
/*评论区-点赞按钮*/
.css-1vd72tl:focus-visible {
    box-shadow:none !important;
}
.css-1staphk:focus-visible {
    box-shadow:none !important;
}
/*评论区-表情按钮*/
.css-iuqaea:focus-visible {
    box-shadow:none !important;
    color:#0084ff;
}

/*评论区-表情分类*/
html[data-theme=dark] .css-1c21y8s {
    background: #191b1f !important;
}
html[data-theme=dark] .css-1dq2715 {
    background: #121212 !important;
}



/*标题评论区-加载占位*/
html[data-theme=dark] path[d="M0 0h656v44H0V0zm0 0h480v12H0V0zm0 32h238v12H0V32z"]{
    fill:#121212 !important;
}
/*私信聊天框*/
html[data-theme=dark] .css-h07o3w {
    background: #191b1f !important;
}
html[data-theme=dark] .css-11lk6sp {
    border-bottom: 1px solid #444!important;
}
/*私信聊天框-滚动条*/
.MessagesBox::-webkit-scrollbar {
    width: 12px;
}
.MessagesBox::-webkit-scrollbar-track {
    background: #d3d3d3;
    border-radius: 10px;
}
.MessagesBox::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
.MessagesBox::-webkit-scrollbar-thumb:hover {
    background: #555;
}
/*私信-搜索联系人*/
html[data-theme=dark] .ChatSideBar-Search-Input input{
    background: #191b1f!important;
    color:#d3d3d3!important;
    border: 1px solid #444 !important;
}
html[data-theme=dark] .ChatUserListItem .Chat-ActionMenuPopover-Button{
    background: #191b1f!important;
    color:#d3d3d3!important;
}
html[data-theme=dark] .ChatListGroup-SectionTitle--bottomBorder:after{
    background: #444 !important;
}
/*私信-当前联系人*/
html[data-theme=dark] .ChatUserListItem--active{
    background: #8080801c !important;
}
html[data-theme=dark] .ChatUserListItem--active .Chat-ActionMenuPopover-Button{
    background: #8080801c!important;
    color:#d3d3d3!important;
}
html[data-theme=dark] .ChatUserListItem:after{
    background: #444 !important;
}
/*私信-当前联系人-滚动条*/
.ChatListGroup-SectionContent::-webkit-scrollbar {
    width: 12px;
}
.ChatListGroup-SectionContent::-webkit-scrollbar-track {
    background: #d3d3d3;
    border-radius: 10px;
}
.ChatListGroup-SectionContent::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
.ChatListGroup-SectionContent::-webkit-scrollbar-thumb:hover {
    background: #555;
}


/* 自定义滚动条的箭头 */
/*
.ChatListGroup-SectionContent::-webkit-scrollbar-button {
background-color: c1c1c1;
}
*/
/* 或者针对滚动条的上下箭头分别设置*/
/*
.ChatListGroup-SectionContent::-webkit-scrollbar-button:vertical:start {
background-color: #c1c1c1;
}

.ChatListGroup-SectionContent::-webkit-scrollbar-button:vertical:end {
background-color: #c1c1c1;
}
*/

/*回答表格-表头*/
html[data-theme=dark] .css-1olvdus table[data-draft-type='table'] th{
    background: #9da2a7;
}
/*回答表格-边框*/
html[data-theme=dark] .css-1olvdus table[data-draft-type='table'] td,html[data-theme=dark]  .css-1olvdus table[data-draft-type='table'] th{
    border:1px solid #444;
}


/*==知乎问题==*/

/*==知乎文章==*/
/*文章标签*/
html[data-theme=dark] .css-127i0sx {
    background: #191b1f !important;
}
html[data-theme=dark] .css-1x8apwm{
    border-bottom:1px solid #444!important;
}
/*没有评论svg*/
html[data-theme=dark] .css-1jroejq{
    filter:brightness(0.6)!important;
}
/*底栏背景*/
html[data-theme=dark] .App-main{
    background: #121212 !important;
}
html[data-theme=dark] .ContentItem-actions{
    background: #191b1f !important;
}
/*文中提示*/
html[data-theme=dark] .css-ob6uua blockquote{
    color: #0084ff !important
}
/*==知乎文章==*/


/*==搜索结果==*/
/*搜索分类*/
html[data-theme=dark] .SearchTabs.SearchTab-bottomShadow{
    background: #121212 !important;
}
/*AI搜索*/
html[data-theme=dark] .css-10kzyet{
    background: #191b1f !important;
}

/*AI回答-提示*/
html[data-theme=dark] .css-146c3p1{
    color: #d3d3d3 !important
}
/*AI回答-背景*/
html[data-theme=dark] .css-q1rdu9{
    background: #191b1f !important;
}
/*搜索结果-背景*/
html[data-theme=dark] .KfeCollection-PcCollegeCard-root{
    background: #191b1f !important;
}
/*搜索结果-论文*/
html[data-theme=dark] .css-5ug749{
    background: #191b1f !important;
    border-bottom:none!important;
}
html[data-theme=dark] .css-ot1wt0{
    color: #d3d3d3 !important
}
html[data-theme=dark] .css-ewblx3{
    color: #0084ff !important
}
/*搜索结果-论文分类*/
html[data-theme=dark] .css-4jezjh{
    background: #151a23 !important;
}
html[data-theme=dark] .css-e7s7cv{
    border:1px solid #444!important;
}
html[data-theme=dark] .css-zul5nu{
    border:1px solid #444!important;
}
html[data-theme=dark] .css-1cgjjzc{
    border:1px solid #444!important;
    opacity:1 !important;
}
html[data-theme=dark] .css-172ot2f{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-o296kv{
    color: #d3d3d3 !important;
}
/*搜索结果-论文分类展开列表*/
html[data-theme=dark] .css-1xj1964{
    background: #151a23 !important;
}
html[data-theme=dark] .css-ggid2{
    background: #151a23 !important;
}
/*搜索结果-论文分类展开列表选项*/
html[data-theme=dark] .E211w_M7Hzs0GMB7BEyA{
    color: #d3d3d3 !important;
    background:#8080801c !important;
}
html[data-theme=dark] .E211w_M7Hzs0GMB7BEyA.css-181c5a9{
    color:#0084ff!important;
    background:#1772f60f!important;
}
/*搜索结果-阅读全文*/
html[data-theme=dark] .ContentItem-more{
    color: #0084ff !important
}
/*搜索结果-电子书标签*/
html[data-theme=dark] .KfeCollection-PcCollegeCard-type{
    color: #0084ff !important
}
/*搜索结果-更多电子书*/
html[data-theme=dark] .KfeCollection-PcCollegeCard-searchMore{
    color: #0084ff !important
}
/*搜索结果-相关搜索*/
html[data-theme=dark] .RelevantQuery h2{
    color: #d3d3d3 !important
}
html[data-theme=dark] .RelevantQuery li{
    color: #0084ff !important
}
/*侧边栏-更多按钮*/
html[data-theme=dark] .css-1kxql2v{
    color: #8590a6 !important;
    background: #2e2e2e !important;
}
/*侧边栏-更多展开列表*/
html[data-theme=dark] .css-i9srcr{
    background: #191b1f !important;
}
html[data-theme=dark] .css-2habnn > a:hover{
    background: #8080801c !important;
}
html[data-theme=dark] .css-6lgbq5:hover{
    color: #0084ff !important
}
/*==搜索结果==*/


/*==专栏==*/
/*专栏介绍*/
html[data-theme=dark] .css-h5rdys{
    color: #d3d3d3 !important
}
html[data-theme=dark] .css-2sopzd{
    background: #191b1f !important;
}
html[data-theme=dark] .css-44kk6u{
    background: #191b1f !important;
}
/*
.css-1byd3cx{
    transform: translateX(-7px);
}
*/
html[data-theme=dark] .css-1byd3cx{
    background: #191b1f !important;
}
html[data-theme=dark] .css-1pariuy{
    background: #191b1f !important;
}
html[data-theme=dark] .css-1symrae{
    color: #d3d3d3 !important
}
/*分类标签*/
html[data-theme=dark] .css-1tvhjhb{
    color: #1772F6 !important
}
html[data-theme=dark] .css-5ons2k{
    color: #d3d3d3 !important;
}
/*作者介绍*/
html[data-theme=dark] .css-15k5nix{
    background: #191b1f !important;
}
html[data-theme=dark] .css-f3930v{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-705zp9{
    color: #d3d3d3 !important;
}
html[data-theme=dark] .css-9w3zhd{
    border-bottom:1px solid #444!important;
}
.AuthorInfo{
    max-width:none !important;
}
/*==专栏==*/


/*==话题讨论==*/
/*次级导航栏*/
html[data-theme=dark] .Topic-pageHeader .Topic-tabs{
    overflow: hidden !important;
}
/*百科-简介*/
html[data-theme=dark] .TopicIntroSection-title{
    color: #d3d3d3 !important
}
/*百科-摘录*/
html[data-theme=dark] .TopicAbstract-title{
    color: #d3d3d3 !important
}
/*==话题讨论==*/


/*==用户主页==*/
/*搜索按钮*/
html[data-theme=dark] .css-3f82om{
    background: #191b1f !important;
}
html[data-theme=dark] .css-zduc1z{
    background: #191b1f !important;
}
/*==用户主页==*/

/*==知乎圆桌==*/
/*圆桌首页背景*/
html[data-theme=dark] .css-lxxesj{
    background: #191b1f !important;
}
/*圆桌首页封面标题*/
html[data-theme=dark] .css-1sjs4ns{
    color: #d3d3d3 !important
}
/*圆桌介绍*/
html[data-theme=dark] .css-1fnir59,
html[data-theme=dark] .css-t3f0zn,
html[data-theme=dark] .css-1cj0s4z {
    background: #191b1f !important;
}
/*圆桌标题*/
html[data-theme=dark] .css-1f0fpoe{
    color: #d3d3d3 !important;
}
/*详细介绍*/
html[data-theme=dark] .css-f5u07t{
    color: #d3d3d3 !important;
}
/*浏览量*/
html[data-theme=dark] .css-185ew1i{
    color: #d3d3d3 !important;
}
/*主办方及主持人*/
html[data-theme=dark] .css-bgcgf1{
    color: #d3d3d3 !important;
    border-bottom:1px solid #444!important;
}
html[data-theme=dark] .css-7b4wc9{
    background: #191b1f !important;
}
html[data-theme=dark] .css-1d1aerp{
    border-top:1px solid #444!important;
}
/*嘉宾*/
html[data-theme=dark] .css-1xvgm7g{
    background: #191b1f !important;
}
html[data-theme=dark] .css-tsxvph{
    color: #d3d3d3 !important;
}
/*正在热议-用户名*/
html[data-theme=dark] .css-1vo4fqo{
    color: #d3d3d3 !important;
}
/*正在热议-标题*/
html[data-theme=dark] .css-1kwr5sb{
    color: #d3d3d3 !important;
}
/*正在热议-分割线*/
html[data-theme=dark] .css-1wpnzlt{
    border-bottom:1px solid #444!important;
}
/*正在热议-文章标签*/
.css-18mnslu{
    background: orange !important;
    color:white !important;
}
html[data-theme=dark] .css-18mnslu{
    color: #d3d3d3 !important;
}
/*最新提问-分割线*/
html[data-theme=dark] .css-1ppskpm{
    border-bottom:1px solid #444!important;
}
/*关注圆桌按钮*/
html[data-theme=dark] .css-1ypq6gi{
    color: #d3d3d3 !important;
}
/*参与讨论按钮*/
html[data-theme=dark] .css-lc30l3{
    color: #d3d3d3 !important;
}
/*抢先回答按钮*/
html[data-theme=dark] .css-37j01z{
    color: #d3d3d3 !important;
}
/*==知乎圆桌==*/
    `);
}
function addCSS() {
    //GM_addStyle(GM_getResourceText('zhihu-beautify'));
    addLocalCSS();
}

//话题页
function topic() {
    if (Config.currentValues.hideTopicSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.css-1q32xh5').hide();
        $(".ContentLayout-sideColumn").hide();
        $(".ContentLayout-mainColumn").width($(".ContentLayout").width());
    } else if (Config.currentValues.hideTopicSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.css-1q32xh5').hide();
        $(".ContentLayout-sideColumn").hide();
        $(".ContentLayout").attr("style", "display:flex;justify-content:center;");
    }
}

/*
//草稿页
function draft() {
    if (Config.currentValues.hideDraftSideBar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.GlobalSideBar').hide();
        $(".DraftList-mainColumn").width($(".DraftList").width());
    } else if (Config.currentValues.hideDraftSideBar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.GlobalSideBar').hide();
        $(".DraftList").attr("style", "display:flex;justify-content:center;");
    }
}
*/

//知乎圆桌页
function roundtable() {
    //增加遮罩层
    if ($('html[data-theme=dark] .css-zprod6').length == 0) {
        $('html[data-theme=dark] div.css-1b0ypf8 > div.css-1sqjzsk > div.css-tr5tvs > img').after('<div class=\"css-zprod6\"></div>');
    }
}

let cheese_addstyle = 0;

function cheese() {

    if (cheese_addstyle == 0) {
        GM_addStyle(`html[data-theme=dark] .navbarWrap___wvkSj{background:rgb(18,18,18);}
    html[data-theme=dark] #root, body, html{background:rgb(18,18,18);}
    html[data-theme=dark] .container___cOXUf>main{background:rgb(18,18,18);}
    html[data-theme=dark] .introduce___14YE0{background:rgb(18,18,18);}
    html[data-theme=dark] .conditionItemTag___3SNgb{background:rgb(18,18,18); color:#d3d3d3;}
    html[data-theme=dark] .hometitle___2_1Bm p{color:#d3d3d3;}
    html[data-theme=dark] .conditionItemInfo___2277d{color:#d3d3d3;}
    html[data-theme=dark] .taskcardTitle___13gHK{color:#d3d3d3;}
    html[data-theme=dark] .taskcardInfo___XkANs{color:#d3d3d3;}
    html[data-theme=dark] .taskcardCondition___32u1P p{color:#d3d3d3;}
    html[data-theme=dark] .taskcardCondition___32u1P span{color:#d3d3d3;}`);

        cheese_addstyle = 1
    }
}

//GIF自动播放
function gifPlaying() {
    if (Config.currentValues.GIFAutoPlay == 1) {
        $(".GifPlayer .ztext-gif").each(function() {
            if ($(this).hasClass('GifPlayer-gif2mp4')) {
                if ($(this).get(0).paused) {
                    $(this).get(0).play();
                    $(this).addClass('play');
                }
            } else {
                $(this).parent().addClass("isPlaying");
                if ($(this).attr("src").indexOf("webp") == -1) {
                    $(this).attr("src", $(this).attr("src").replace("jpg", "webp"));
                    //$(this).wrap("<a target=\'_blank\' href=\'" + $(this).attr("src") + "\'></a>");
                }
            }
        });

    }

}

//盐选专栏、知乎讲书
function xen() {
    if ($('.css-18vw6y4').length > 0)
        $('.css-18vw6y4').get(0).click();

    if ($('.IntroSummary-expandButton-iZSs9').length > 0)
        $('.IntroSummary-expandButton-iZSs9').get(0).click();
}

//创作中心
function creator() {
    //内容的发布时间
    $(".CreationManage-CreationCard.css-wooxo5").each(function() {
        if (!($(this).find(".css-w1ffsg").hasClass("full")) && $(this).find(".css-w1ffsg").length > 0 && $(this).find(".css-w1ffsg").text() != null) {
            if ($(this).find(".css-w1ffsg").text().indexOf("发布于") == -1 && $(this).find(".css-w1ffsg").text().indexOf("编辑于") > -1 && $(this).find(".css-w1ffsg").attr("data-tooltip") != null) //只有"编辑于"时增加具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".css-w1ffsg").attr("data-tooltip");
                var oldtext = $(this).find(".css-w1ffsg").text();
                $(this).find(".css-w1ffsg").text(data_tooltip + "\xa0\xa0，\xa0\xa0" + oldtext);
                $(this).find(".css-w1ffsg").addClass("full");
            } else if ($(this).find(".css-w1ffsg").text().indexOf("发布于") > -1 && $(this).find(".css-w1ffsg").text().indexOf("编辑于") == -1 && $(this).find(".css-w1ffsg").attr("data-tooltip") != null) //只有"发布于"时替换为具体发布时间data-tooltip
            {
                let data_tooltip = $(this).find(".css-w1ffsg").attr("data-tooltip");
                $(this).find(".css-w1ffsg").text(data_tooltip);
                $(this).find(".css-w1ffsg").addClass("full");
            }
        }
    });

    //"被折叠"提示
    $('html[data-theme=dark]  .Zi--HelpOutline').closest('.css-vurnku').css('background', '#ffffff1c')
}

//无障碍
function wza() {
    GM_addStyle('html[data-theme=dark] .content{background:rgb(18,18,18);}');
}


let log_flag = 0;
let asc_flag = 1; // 1=升序，0=降序

// 问题日志
function question_log() {
    if($('.zm-item').length > 0) {
        if(log_flag == 0) {
            log_flag = 1;

            // 获取日志列表容器
            const logListWrap = $('#zh-question-log-list-wrap');
            if (!logListWrap.length) return;

            // 获取页面标题
            const pageTitle = $('title').text().replace(' - 知乎', '');

            // 创建时间轴容器
            const timelineContainer = $(`
        <div class="timeline-container">
            <div class="timeline-header">
                <h1 class="timeline-title">问题编辑日志</h1>
                <!-- 添加排序按钮 -->
                <div class="sort-container">
                    <div class="sort-button" id="sort-toggle">
                        <span class="sort-text">${asc_flag === 1 ? '升序' : '降序'}</span>
                        <svg class="sort-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"/>
                        </svg>
                    </div>
                    <div class="sort-dropdown" id="sort-dropdown">
                        <div class="sort-option" data-value="1">
                            <span>升序</span>
                            <svg class="sort-check" viewBox="0 0 24 24" width="16" height="16" style="display: none;">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </div>
                        <div class="sort-option" data-value="0">
                            <span>降序</span>
                            <svg class="sort-check" viewBox="0 0 24 24" width="16" height="16" style="display: none;">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="timeline" id="timeline-content"></div>
        </div>
    `);

            // 获取所有日志条目
            let logItems = logListWrap.find('.zm-item');

            // 存储所有日志条目的HTML，以便后续重新排序
            const logItemsData = [];

            // 先处理所有日志条目，存储数据
            logItems.each(function(index, item) {
                const $item = $(item);

                // 提取用户信息
                const userElement = $item.find('div:first > a');
                let userHtml = userElement.text().trim();
                // 保持a标签的链接功能
                if (userElement.attr('href')) {
                    const userHref = userElement.attr('href');
                    const targetAttr = userElement.attr('target') ? `target="${userElement.attr('target')}"` : '';
                    const dataHovercard = userElement.attr('data-hovercard') ? `data-hovercard="${userElement.attr('data-hovercard')}"` : '';
                    userHtml = `<a href="${userHref}" ${targetAttr} ${dataHovercard}>${userHtml}</a>`;
                } else if (userElement.text().trim() === '知乎管理员' || userElement.text().trim() === '匿名用户') {
                    // 特殊用户处理
                    userHtml = `<span>${userElement.text().trim()}</span>`;
                }

                // 提取操作类型
                const actionElement = $item.find('.zg-gray-normal');
                let actionType = actionElement.text().trim();
                if (!actionType) {
                    actionType = '未知操作';
                }

                // 检查是否是锁定操作
                const isLockAction = actionType.includes('锁定');
                // 检查是否是解锁操作（新增） - 修改判断条件
                const isUnlockAction = actionType.includes('取消') && actionType.includes('锁定');
                // 检查是否是关闭操作
                const isCloseAction = actionType.includes('设置问题状态') && actionElement.closest('div').next().text().includes('关闭');


                // 提取时间
                const timeElement = $item.find('time');
                let timeText = timeElement.attr('datetime') || timeElement.text();

                // 提取序列号
                const metaElement = $item.find('.zm-item-meta');
                let logId = '';
                if (metaElement.length) {
                    const metaText = metaElement.text();
                    // 查找#开头的数字序列号
                    const idMatch = metaText.match(/#\d+/);
                    if (idMatch) {
                        logId = idMatch[0];
                    }
                }

                // 提取修改内容 - 这里需要特别处理锁定/解锁操作
                const detailElement = $item.find('.zg-item-log-detail');
                let changeContent = '';
                let supplementContent = ''; // 专门存储补充说明

                if (detailElement.length) {
                    // 处理"添加问题"的特殊情况
                    if (actionType.includes('添加了问题')) {
                        // 提取问题标题
                        const questionTitleElement = detailElement.find('div:first ins');
                        const questionTitle = questionTitleElement.length ?
                              questionTitleElement.html().trim() : '';

                        // 提取补充说明
                        const supplementElement = detailElement.find('div:contains("补充说明")');
                        let supplement = '';
                        if (supplementElement.length) {
                            supplement = supplementElement.html()
                                .replace('补充说明：', '')
                                .replace(/<p[^>]*>/gi, '')
                                .replace(/<\/p>/gi, '')
                                .replace(/<ins[^>]*>/gi, '')
                                .replace(/<\/ins>/gi, '')
                                .trim();
                        }

                        // 构建显示内容
                        changeContent = `<div class="question-title">${questionTitle}</div>`;
                        if (supplement) {
                            supplementContent = `<div class="question-supplement">补充说明：${supplement}</div>`;
                        }
                    } else if (isLockAction || isUnlockAction || isCloseAction) {
                        // 对于锁定/解锁/关闭操作，直接获取整个文本内容
                        changeContent = detailElement.text().trim();
                    } else {
                        // 其他类型的修改内容
                        changeContent = detailElement.html()
                            .replace(/<div[^>]*>/gi, '')
                            .replace(/<\/div>/gi, '<br>')
                            .replace(/<p[^>]*>/gi, '')
                            .replace(/<\/p>/gi, '<br>')
                            .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>')
                            .trim();
                    }
                }

                // 提取修改理由/锁定理由
                let reasonText = '';

                // 遍历所有子节点，查找包含"修改理由"或"锁定理由"的文本
                $item.contents().each(function() {
                    if (this.nodeType === 3) { // 文本节点
                        const text = $(this).text().trim();
                        // 检查是否包含"修改理由"或"锁定理由"
                        if (text.includes('修改理由') || text.includes('锁定理由')) {
                            // 尝试提取冒号后的内容
                            const colonIndex = text.indexOf('：');
                            if (colonIndex !== -1) {
                                reasonText = text.substring(colonIndex + 1).trim();
                            } else {
                                // 尝试英文冒号
                                const colonIndex2 = text.indexOf(':');
                                if (colonIndex2 !== -1) {
                                    reasonText = text.substring(colonIndex2 + 1).trim();
                                }
                            }
                        }
                    }
                });

                // 如果通过文本节点没找到，尝试直接查找包含理由的文本
                if (!reasonText) {
                    const itemText = $item.text();
                    const reasonMatch = itemText.match(/(?:修改理由|锁定理由)[：:]\s*(.+?)(?:\n|$)/);
                    if (reasonMatch) {
                        reasonText = reasonMatch[1].trim();
                    }
                }

                // 创建时间轴条目HTML
                let contentSections = '';

                if (actionType.includes('添加了问题')) {
                    // 对于添加问题，分开显示标题和补充说明
                    contentSections = `
                    <div class="content-change">
                        <div class="change-text">
                            ${changeContent}
                            ${supplementContent ? `<div class="supplement-separator"></div>${supplementContent}` : ''}
                        </div>
                    </div>
                    `;
                } else if (isLockAction || isUnlockAction) {
                    // 锁定或解锁操作
                    let lockIcon = '';
                    let lockClass = '';

                    // 根据操作类型设置不同的样式
                    if (isUnlockAction) {
                        // 解锁操作 - 绿色
                        lockIcon = `
                            <div class="lock-icon lock-green">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"/>
                                </svg>
                            </div>
                        `;
                        lockClass = ' unlock-success';
                    } else {
                        // 锁定操作 - 红色
                        lockIcon = `
                            <div class="lock-icon lock-red">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                </svg>
                            </div>
                        `;
                        lockClass = ' lock-warning';
                    }

                    contentSections = `
                    <div class="content-change${lockClass}">
                        ${lockIcon}
                        <div class="change-text">${changeContent || actionType}</div>
                    </div>
                    `;
                }else if (isCloseAction) {
                    // 关闭操作 - 灰色叉号图标，使用.close-warning类
                    const closeIcon = `
					<div class="lock-icon lock-gray">
						<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6352" width="16" height="16">
	                         <path d="M666.737778 739.555556L512 584.248889 357.262222 739.555556 284.444444 666.737778 439.751111 512 284.444444 357.262222 357.262222 284.444444 512 439.751111 666.737778 284.444444 739.555556 357.262222 584.248889 512 739.555556 666.737778z m207.644444-589.937778a512 512 0 1 0 0 724.764444 512 512 0 0 0 0-724.764444z" fill="#8c8c8c" p-id="6353">
                             </path>
                        </svg>
					</div>
				`;

                    contentSections = `
				<div class="content-change close-warning">
					${closeIcon}
					<div class="change-text">${changeContent || actionType}</div>
				</div>
				`;
                }else if (changeContent) {
                    // 其他有修改内容的操作
                    contentSections = `
                    <div class="content-change">
                        <div class="change-text">${changeContent}</div>
                    </div>
                    `;
                }
                // 判断是否为特殊用户，决定是否显示"用户："前缀
                const userText = userElement.text().trim();
                const isSpecialUser = userText === '匿名用户' || userText === '知乎管理员';
                const userPrefix = isSpecialUser ? '' : '用户：';

                const timelineItem = `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time-container">
                    <span class="timeline-time">${timeText}</span>
                    ${logId ? `<span class="timeline-log-id">${logId}</span>` : ''}
                </div>
                <div class="timeline-content">
                    <div class="content-header">
                        <div class="content-meta">${userPrefix}${userHtml}</div>
                        <div class="content-title">&nbsp;&nbsp;&nbsp;&nbsp;${actionType}</div>
                    </div>
                    ${contentSections}
                    ${reasonText ? `
                    <div class="content-reason">
                        <div class="reason-label">修改理由</div>
                        <div class="reason-text">${reasonText}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

                // 存储日志数据
                logItemsData.push({
                    html: timelineItem,
                    time: timeText
                });
            });

            // 根据升序标志调整顺序
            let sortedData = logItemsData;
            if (asc_flag === 0) {
                // 降序：保持原顺序（最新的在最前面）- 知乎默认顺序
                // 不需要做任何操作
            } else {
                // 升序：反转顺序（最旧的在最前面）
                sortedData = [...logItemsData].reverse();
            }

            // 将排序后的条目添加到时间轴
            sortedData.forEach(item => {
                timelineContainer.find('#timeline-content').append(item.html);
            });

            // 替换原内容
            logListWrap.replaceWith(timelineContainer);

            // 设置排序功能
            setupSortFunction(timelineContainer, logItemsData);

            GM_addStyle(`
            /* 隐藏原日志内容 */
        .zm-item, #zh-question-title + h2, .zm-editable-editor-wrap, .zh-answers-title, .zu-main-sidebar {
            display: none !important;
        }

        .zu-main-content-inner{
            width:100%;
        }

        #zh-question-title{
            margin:15px 0px;
        }

        .zh-backtotop .btn-action{
            position:fixed;
            right:30px;
            bottom:50px;
        }

        #zh-question-title>.zm-item-title{
            font-size:22px;
        }

        /* 时间轴样式 */
        .timeline-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 40px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .timeline-header {
            margin-bottom: 40px;
            padding-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f0f2f7;
        }

        .timeline-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        /* 排序容器样式 */
        .sort-container {
            position: relative;
        }

        .sort-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f6f6f6;
            border: 1px solid #e7e9ed;
            border-radius: 20px;
            color: #8590a6;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }

        .sort-button:hover {
            background: #f0f2f7;
            border-color: #c2c9d1;
        }

        .sort-icon {
            fill: #8590a6;
            transition: transform 0.2s ease;
        }

        .sort-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: white;
            border: 1px solid #e7e9ed;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            min-width: 120px;
            z-index: 1000;
            display: none;
        }

        .sort-dropdown.show {
            display: block;
        }

        .sort-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .sort-option:hover {
            background: #f6f6f6;
        }

        .sort-option.active {
            color: #0084ff;
        }

        .sort-check {
            fill: #0084ff;
        }

        /* 锁定警告样式 */
        .lock-warning {
            background-color: #fff1f0 !important;
            border-left-color: #ff4d4f !important;
        }

        /* 解锁成功样式（新增） */
        .unlock-success {
            background-color: #e7ffcf !important;
            border-left-color: #52c41a !important;
        }

        /* 关闭警告样式（新增） */
		.close-warning {
			background-color: #f5f5f5 !important;
			border-left-color: #d9d9d9 !important;
		}

		.close-warning .change-text {
			font-weight: normal !important; /* 关闭操作取消加粗 */
		}

        .lock-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 10px;
            flex-shrink: 0;
        }

        .lock-red {
            color: #ff4d4f;
        }

        .lock-green {
            color: #52c41a;
        }

        .lock-gray {
			color: #8c8c8c;
		}

        .content-change.lock-warning,
        .content-change.unlock-success,
        .content-change.close-warning {
            display: flex;
            align-items: flex-start;
        }

        .content-change.lock-warning .change-text,
        .content-change.unlock-success .change-text,
        .content-change.close-warning .change-text {
            flex: 1;
        }


        /* 时间轴其他样式保持不变... */
        .timeline-subtitle {
            font-size: 16px;
            color: #8590a6;
        }

        .timeline {
            position: relative;
            margin-top: 30px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e7e9ed;
            z-index: 1;
        }

        .timeline-item {
            position: relative;
            margin-bottom: 36px;
            padding-left: 50px;
            min-height: 80px;
        }

        .timeline-dot {
            position: absolute;
            left: 10.5px;
            top: 4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #0084ff;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #0084ff33;
            z-index: 2;
        }

        .timeline-time-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .timeline-time {
            font-size: 14px;
            font-weight: 500;
            color: #0084ff;
            background: #0084ff0d;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
        }

        .timeline-log-id {
            font-size: 14px;
            color: #8590a6;
            background: #8590a61a;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
            margin-left: 8px;
        }

        .timeline-content {
            background: #fafbfc;
            border: 1px solid #e7e9ed;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .timeline-content:hover {
            border-color: #c2c9d1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .content-header {
            display: flex;
            justify-content: start;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f2f7;
        }

        .content-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .content-meta {
            font-size: 13px;
            color: #8590a6;
        }

        .content-meta a {
            color: #0084ff;
            text-decoration: none;
        }

        .content-meta a:hover {
            text-decoration: underline;
        }

        .content-change {
            margin-top: 12px;
            padding: 12px;
            background: #f0f7ff;
            border-radius: 6px;
            border-left: 3px solid #0084ff;
        }

        .change-label {
            font-size: 13px;
            font-weight: 500;
            color: #0084ff;
            margin-bottom: 6px;
        }

        .change-text {
            font-size: 14px;
            color: #1a1a1a;
            line-height: 1.5;
        }

        .question-title {
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .question-supplement {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed #e0e0e0;
            font-size: 14px;
            color: #595959;
        }

        .supplement-separator {
            height: 8px;
        }

        .change-text del {
            color: #f56c6c;
            background-color: #fef0f0;
            text-decoration: line-through;
            margin: 0 5px 5px 0;
            padding: 1px 10px 0;
            border-radius: 6px;
        }

        .change-text ins {
            color: #3e5e00;
            background-color: #adda4d;
            text-decoration: none;
            margin: 0 5px 5px 0;
            padding: 1px 10px 0;
            border-radius: 6px;
        }

        .content-reason {
            margin-top: 10px;
            padding: 10px;
            background: #fff7e6;
            border-radius: 6px;
            border-left: 3px solid #fa8c16;
        }

        .reason-label {
            font-size: 13px;
            font-weight: 500;
            color: #fa8c16;
            margin-bottom: 4px;
        }

        .reason-text {
            font-size: 14px;
            color: #595959;
        }

        /* 暗色模式适配 */
        html[data-theme="dark"] .timeline-container {
            background: #1f1f23;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        html[data-theme="dark"] .timeline-title {
            color: #e6e6e6;
        }

        html[data-theme="dark"] .timeline-header {
            border-bottom: 1px solid #444;
        }

        html[data-theme="dark"] .timeline-subtitle {
            color: #8a8f9d;
        }

        html[data-theme="dark"] .timeline::before {
            background: #2d2d32;
        }

        html[data-theme="dark"] .timeline-dot {
            background: #3a76d0;
            border-color: #1f1f23;
            box-shadow: 0 0 0 3px #3a76d033;
        }

        html[data-theme="dark"] .timeline-time {
            color: #3a76d0;
            background: #3a76d01a;
        }

        html[data-theme="dark"] .timeline-log-id {
            color: #8a8f9d;
            background: #8a8f9d1a;
        }

        html[data-theme="dark"] .timeline-content {
            background: #25252a;
            border-color: #2d2d32;
        }

        html[data-theme="dark"] .content-header {
            border-bottom-color: #2d2d32;
        }

        html[data-theme="dark"] .content-title {
            color: #e6e6e6;
        }

        html[data-theme="dark"] .content-meta {
            color: #8a8f9d;
        }

        html[data-theme="dark"] .content-meta a {
            color: #3a76d0;
        }

        html[data-theme="dark"] .content-change {
            background: #2a3a5a;
        }

        html[data-theme="dark"] .change-text {
            color: #e6e6e6;
        }

        html[data-theme="dark"] .question-title {
            color: #e6e6e6;
        }

        html[data-theme="dark"] .question-supplement {
            color: #a6a6a6;
            border-top-color: #2d2d32;
        }

        html[data-theme="dark"] .change-text del {
            color: #f56c6c;
            background-color: #fef0f0;
        }

        html[data-theme="dark"] .change-text ins {
            color: #3e5e00;
            background-color: #adda4d;
        }

        html[data-theme="dark"] .content-reason {
            background: #3a2b1f;
        }

        html[data-theme="dark"] .reason-label {
            color: #fa8c16;
        }

        html[data-theme="dark"] .reason-text {
            color: #a6a6a6;
        }

        /* 暗色模式下的排序按钮 */
        html[data-theme="dark"] .sort-button {
            background: #2d2d32;
            border-color: #3d3d42;
            color: #8a8f9d;
        }

        html[data-theme="dark"] .sort-button:hover {
            background: #3d3d42;
            border-color: #4d4d52;
        }

        html[data-theme="dark"] .sort-icon {
            fill: #8a8f9d;
        }

        html[data-theme="dark"] .sort-dropdown {
            background: #2d2d32;
            border-color: #3d3d42;
        }

        html[data-theme="dark"] .sort-option:hover {
            background: #3d3d42;
        }

        html[data-theme="dark"] .sort-option.active {
            color: #3a76d0;
        }

        /* 暗色模式下的锁定警告 */
        html[data-theme="dark"] .lock-warning {
            background-color: #3a1f1f !important;
            border-left-color: #ff4d4f !important;
        }

        /* 暗色模式下的解锁成功样式（新增） */
        html[data-theme="dark"] .unlock-success {
            background-color: #1d3711 !important;
            border-left-color: #52c41a !important;
        }

        /* 暗色模式下的关闭警告样式（新增） */
		html[data-theme="dark"] .close-warning {
			background-color: #3a3a42 !important;
			border-left-color: #595959 !important;
		}

        html[data-theme="dark"] .lock-red {
            color: #ff4d4f;
        }

        html[data-theme="dark"] .lock-green {
            color: #52c41a;
        }

        html[data-theme="dark"] .lock-gray {
			color: #8c8c8c;
		}
            `);
        }
    }
}

// 添加排序功能
function setupSortFunction(container, logItemsData) {
    const sortToggle = container.find('#sort-toggle');
    const sortDropdown = container.find('#sort-dropdown');
    const sortOptions = container.find('.sort-option');
    const sortText = container.find('.sort-text');
    const sortIcon = container.find('.sort-icon');
    const timelineContent = container.find('#timeline-content');

    // 显示当前选中的排序选项
    sortOptions.each(function() {
        const option = $(this);
        const value = parseInt(option.data('value'));
        const checkIcon = option.find('.sort-check');

        if (value === asc_flag) {
            option.addClass('active');
            checkIcon.show();
        } else {
            option.removeClass('active');
            checkIcon.hide();
        }
    });

    // 切换下拉框显示/隐藏
    sortToggle.on('click', function(e) {
        e.stopPropagation();
        const isShowing = sortDropdown.hasClass('show');

        if (isShowing) {
            sortDropdown.removeClass('show');
            sortIcon.css('transform', 'rotate(0deg)');
        } else {
            sortDropdown.addClass('show');
            sortIcon.css('transform', 'rotate(180deg)');
        }
    });

    // 选择排序选项
    sortOptions.on('click', function() {
        const option = $(this);
        const value = parseInt(option.data('value'));

        // 如果已经是当前选项，则不执行
        if (value === asc_flag) {
            sortDropdown.removeClass('show');
            sortIcon.css('transform', 'rotate(0deg)');
            return;
        }

        // 更新排序标志
        asc_flag = value;

        // 更新按钮文本
        sortText.text(value === 1 ? '升序' : '降序');

        // 更新下拉框中的选中状态
        sortOptions.each(function() {
            const opt = $(this);
            const optValue = parseInt(opt.data('value'));
            const checkIcon = opt.find('.sort-check');

            if (optValue === value) {
                opt.addClass('active');
                checkIcon.show();
            } else {
                opt.removeClass('active');
                checkIcon.hide();
            }
        });

        // 关闭下拉框
        sortDropdown.removeClass('show');
        sortIcon.css('transform', 'rotate(0deg)');

        // 重新排序时间轴内容
        reorderTimelineItems(container, logItemsData);
    });

    // 点击页面其他区域关闭下拉框
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.sort-container').length) {
            sortDropdown.removeClass('show');
            sortIcon.css('transform', 'rotate(0deg)');
        }
    });

    // 防止下拉框内的点击事件冒泡到document
    sortDropdown.on('click', function(e) {
        e.stopPropagation();
    });
}

// 重新排序时间轴条目
function reorderTimelineItems(container, logItemsData) {
    const timelineContent = container.find('#timeline-content');

    // 清空当前内容
    timelineContent.empty();

    // 根据升序标志调整顺序
    let sortedData = logItemsData;
    if (asc_flag === 0) {
        // 降序：保持原顺序（最新的在最前面）
        sortedData = [...logItemsData];
    } else {
        // 升序：反转顺序（最旧的在最前面）
        sortedData = [...logItemsData].reverse();
    }

    // 重新添加排序后的条目
    sortedData.forEach(item => {
        timelineContent.append(item.html);
    });
}


let recent_flag=0;
function recent(){
    if(recent_flag==0)
    {
        GM_addStyle(`
/*span样式*/
.css-12wb4o1 + span{
	margin: 0px 8px 0px 1px;
    padding-bottom: 1.5px;
	font-size: 14px;
	white-space: nowrap;
}

/*问题-绿色*/
.css-12wb4o1 + span.question{
	border-bottom: 2px solid #67c23a;
}

/*回答-蓝色*/
.css-12wb4o1 + span.answer{
	border-bottom: 2px solid #1772f6;
}

/*视频-橙色*/
.css-12wb4o1 + span.video{
	border-bottom: 2px solid #f77932;
}

/*文章-黄色*/
.css-12wb4o1 + span.p{
	border-bottom: 2px solid #ffc400;
}

/*用户-粉色*/
.css-12wb4o1 + span.user{
	border-bottom: 2px solid #ff6080;
}

/*想法-青色*/
.css-12wb4o1 + span.idea{
	border-bottom: 2px solid #00caa6;
}

/*专栏-紫色*/
.css-12wb4o1 + span.column{
	border-bottom: 2px solid #6a5ff3;
}

    `);
        recent_flag=1;
    }

    $('.css-zkfaav').each(function(){
        if(!$(this).hasClass('done'))
        {
            let imgsrc=$(this).find('img').attr('src');
            if(imgsrc=='https://picx.zhimg.com/80/v2-0139ff9927193d3052ab601ee0464a3e_1440w.png')
            {
                $(this).find('img').after('<span class="question">问题</span>')
            }
            else if(imgsrc=='https://picx.zhimg.com/80/v2-1f5a5f4aad4dec4dcbda90fa885416d7_1440w.png')
            {
                $(this).find('img').after('<span class="answer">回答</span>')
            }
            else if(imgsrc=='https://pic1.zhimg.com/80/v2-6ecdf27cd93a8a9bb91b012c5c651b61_1440w.png')
            {
                $(this).find('img').after('<span class="p">文章</span>')
            }
            else if(imgsrc=='https://pic1.zhimg.com/80/v2-8b591da926c5bd8ad2c283f58bc5a6f2_1440w.png')
            {
                $(this).find('img').after('<span class="user">用户</span>')
            }
            else if(imgsrc=='https://pic1.zhimg.com/80/v2-05536818d4d094610bbf54c6c6821664_1440w.png')
            {
                $(this).find('img').after('<span class="idea">想法</span>')
            }
            else if(imgsrc=='https://picx.zhimg.com/80/v2-70c60bf304da4cb85687bfea6daf1022_1440w.png')
            {
                $(this).find('img').after('<span class="column">专栏</span>')
            }
            $(this).addClass('done')
        }

    });

    //首页隐藏侧边栏
    if (Config.currentValues.hideIndexSidebar == 1) //隐藏侧边栏并拉宽内容
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        //$(".Topstory-mainColumn").width($(".Topstory-container").width());
        $(".css-9511cm").width("1000px");
    } else if (Config.currentValues.hideIndexSidebar == 2) //隐藏侧边栏，仅水平居中内容，不拉宽
    {
        $('.css-1qyytj7').hide();
        $(".GlobalSideBar").hide();
        $(".GlobalLeftSideBar").hide();
        $(".css-8gasvh").attr("style", "display:flex;justify-content:center;");
    }

}


/*
function printValue() {
    console.log('\n');
    console.log('hideIndexSidebar=' + hideIndexSidebar);
    console.log('hideQuestionSidebar=' + hideQuestionSidebar);
    console.log('hideSearchSideBar=' + hideSearchSideBar);
    console.log('hideTopicSideBar=' + hideTopicSideBar);
    console.log('hideCollectionSideBar=' + hideCollectionSideBar);

    //console.log('hideClubSideBar=' + hideClubSideBar);
    //console.log('hideDraftSideBar=' + hideDraftSideBar);
    //console.log('hideLaterSideBar=' + hideLaterSideBar);

    console.log('hideProfileSidebar=' + hideProfileSidebar);
    console.log('hideColumnSideBar=' + hideColumnSideBar);
    console.log('hideRecommendedReading=' + hideRecommendedReading);
    console.log('publishTop=' + publishTop);
    console.log('GIFAutoPlay=' + GIFAutoPlay);
    console.log('hoverShadow=' + hoverShadow);
    console.log('blockingPictureVideo=' + blockingPictureVideo);
    console.log('flowTag=' + flowTag);
    console.log('prefersColorScheme=' + prefersColorScheme);
    console.log('hideFeedSource=' + hideFeedSource);
    console.log('\n');
}
*/

//设置框样式参考https://greasyfork.org/zh-CN/scripts/37988
/*
function settings() {
    let settingHTML=`
<div id="settingLayerMask" style="display: flex;">
	<div id="settingLayer">
		<div id="itemlist">
			<section class="switch"><span>隐藏首页侧边栏</span>
				<select name="hideIndexSidebar" id="hideIndexSidebar">
						<option value="0">不隐藏</option>
						<option value="1" selected="selected">隐藏，拉宽显示内容</option>
						<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏回答侧边栏</span>
				<select name="hideQuestionSidebar" id="hideQuestionSidebar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏搜索侧边栏</span>
				<select name="hideSearchSideBar" id="hideSearchSideBar">
						<<option value="0">不隐藏</option>
						<option value="1" selected="selected">隐藏，拉宽显示内容</option>
						<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏话题侧边栏</span>
				<select name="hideTopicSideBar" id="hideTopicSideBar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏收藏侧边栏</span>
				<select name="hideCollectionSideBar" id="hideCollectionSideBar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
<!--
			<section class="switch"><span>隐藏圈子侧边栏</span>
				<select name="hideClubSideBar" id="hideClubSideBar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏草稿侧边栏</span>
				<select name="hideDraftSideBar" id="hideDraftSideBar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏稍后答侧边栏</span>
				<select name="hideLaterSideBar" id="hideLaterSideBar">
							<option value="0">不隐藏</option>
							<option value="1" selected="selected">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
-->
			<section class="switch"><span>隐藏用户主页侧边栏</span>
				<select name="hideProfileSidebar" id="hideProfileSidebar">
							<option value="0" selected="selected">不隐藏</option>
							<option value="1">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
            <section class="switch"><span>隐藏专栏文章侧边栏</span>
				<select name="hideColumnSideBar" id="hideColumnSideBar">
							<option value="0" selected="selected">不隐藏</option>
							<option value="1">隐藏，拉宽显示内容</option>
							<option value="2">隐藏，居中显示内容</option>
				</select>
			</section>
			<section class="switch"><span>隐藏专栏推荐</span>
				<div class="checkbox on"><input type="checkbox" name="hideRecommendedReading" id="hideRecommendedReading" value="1"><label class="switchLabel"></label></div>
			</section>
			<section class="switch"><span>置顶回答时间</span>
				<div class="checkbox on"><input type="checkbox" name="publishTop" id="publishTop" value="1"><label class="switchLabel"></label></div>
			</section>
			<section class="switch"><span>GIF自动播放</span>
				<div class="checkbox"><input type="checkbox" name="GIFAutoPlay" id="GIFAutoPlay" value="0"><label class="switchLabel"></label></div>
			</section>
			<section class="switch"><span>悬停时显示浅蓝色边框</span>
				<div class="checkbox on"><input type="checkbox" name="hoverShadow" id="hoverShadow" value="1"><label class="switchLabel"></label></div>
			</section>
			<section class="switch"><span>隐藏图片/视频</span>
				<div class="checkbox on"><input type="checkbox" name="blockingPictureVideo" id="blockingPictureVideo" value="0"><label class="switchLabel"></label></div>
			</section>
			<section class="switch"><span>显示信息流标签</span>
				<div class="checkbox on"><input type="checkbox" name="flowTag" id="flowTag" value="0"><label class="switchLabel"></label></div>
			</section>
            <section class="switch"><span>跟随系统夜间模式</span>
				<div class="checkbox on"><input type="checkbox" name="prefersColorScheme" id="prefersColorScheme" value="0"><label class="switchLabel"></label></div>
			</section>
            <section class="switch"><span>隐藏动态来源</span>
				<div class="checkbox on"><input type="checkbox" name="hideFeedSource" id="hideFeedSource" value="1"><label class="switchLabel"></label></div>
			</section>
<!--
            <section class="switch" style="visibility:hidden"><span>XXX</span>
				<div class="checkbox on"><input type="checkbox" name="hideFeedSource" id="hideFeedSource" value="1"><label class="switchLabel"></label></div>
			</section>
-->
		</div>
		<div id="btnEle">
			<div class="btnEleLayer">
				<span id="settings-save" >保存并刷新</span>
			</div>
		</div><span id="settings-close" ></span></div>
</div>`;

    $('body').append(settingHTML);

    GM_addStyle(`
#settingLayer #itemlist {
    display: flex;
    display: -webkit-flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;
}

#settingLayer section {
    display: grid;
    float: left;
    width: 200px;
    padding: 10px 20px;
    border-right: 1px solid #0084ff;
}

#settingLayer section:nth-of-type(3n) {
    border-right: none;
}

#settingLayer .switch span {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    vertical-align: top;
}

#settingLayer .switch .checkbox {
    float: right;
}

#settingLayer .checkbox {
    position: relative;
    display: inline-block;
}

#settingLayer .checkbox:after,
#settingLayer .checkbox:before {
    -webkit-font-feature-settings: normal;
    -moz-font-feature-settings: normal;
    font-feature-settings: normal;
    -webkit-font-kerning: auto;
    font-kerning: auto;
    -moz-font-language-override: normal;
    font-language-override: normal;
    font-stretch: normal;
    font-style: normal;
    font-synthesis: weight style;
    font-variant: normal;
    font-weight: normal;
    text-rendering: auto;
}

#settingLayer .checkbox label {
    width: 80px;
    height: 30px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
}

#settingLayer .checkbox label:after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    left: 0;
    top: -5px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
}

#settingLayer .checkbox input {
    display: none;
}

#settingLayer .checkbox.on label:after {
    left: 40px;
}

#settingLayer .checkbox.on label {
    background: #4BD865;
}

#settingLayer .switch .checkbox label {
    width: 70px;
}

#settingLayer .switch .checkbox label:after {
    top: 0;
    width: 30px;
    height: 30px;
}

#settingLayerMask {
    display: none;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 200000000;
    overflow: auto;
    font-family: arial, sans-serif;
    min-height: 100%;
    font-size: 16px;
    transition: 0.5s;
    opacity: 1;
    user-select: none;
    -moz-user-select: none;
    padding-bottom: 80px;
    box-sizing: border-box;
}

#settingLayer {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    margin: 45px 25px 50px 5px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    width: 800px;
    transition: 0.5s;
}

#settingLayer #btnEle {
    position: absolute;
    width: 100%;
    bottom: 4px;
    right: 0;
    background: #fff;
    border-radius: 4px;
}

#settingLayer #btnEle span {
    display: inline-block;
    background: #EFF4F8;
    border: 1px solid #3abdc1;
    margin: 12px auto 10px;
    color: #3abdc1;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    transition: 0.3s;
}

#settingLayer #btnEle a {
    color: #999;
    text-decoration: none;
}

#settingLayer #btnEle a:hover {
    text-decoration: underline;
    color: #ef8957;
}

#settingLayer #btnEle span.feedback:hover {
    border-color: #ef8957;
}

#settingLayer #btnEle span:not(.feedback):hover {
    background: #3ACBDD;
    color: #fff;
}

#settingLayer #btnEle .feedback {
    border-color: #aaa;
}

#settingLayer #btnEle>div {
    width: 100%;
    margin-bottom: -100%;
    display: flex;
    justify-content: space-around;
    background: #EFF4F8;
    border-radius: 4px;
}

#settingLayer #settings-close {
    background: white;
    color: #3ABDC1;
    line-height: 20px;
    text-align: center;
    height: 20px;
    width: 20px;
    font-size: 20px;
    padding: 10px;
    border: 3px solid #3ABDC1;
    border-radius: 50%;
    transition: .5s;
    top: -20px;
    right: -20px;
    position: absolute;
    cursor: pointer;
}

#settingLayer #settings-close::before {
    content: "\\2716";
}

#settingLayer #settings-close:hover {
    background: indianred;
    border-color: indianred;
    color: #fff;
}

#settingLayer select {
    appearance:none;
    -webkit-appearance: none;
    -moz-appearance:none;
    height: 30px;
    width: 180px;
    color: #0084FF;
    background: white url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfElEQVQ4T2NkoBAwUqifYdQABixh0PL/AQMDgzyOwH3IUMOogCyHGYit/w0Y/jMcYGBg4Ecz5CMDI4MDQzXjBfwGgGRBhvxjWMDAyKAPVvyf4SIDE0MCumaQFO5obPgvwMAMdgkDw18GB4YGxg/YvDWaDvAFIpG5jOJABABKFBYRvq528AAAAABJRU5ErkJggg==") no-repeat right;
    font-size: 16px;
    position: relative;
    display: inline-block;
    border: 1px solid rgb(118, 118, 118);
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
    padding-left: 10px;
}
html[data-theme=dark] #settingLayer{
    background: #191c25;
}
html[data-theme=dark] #settingLayer #btnEle>div{
    background: #25282f;
}
html[data-theme=dark] #settingLayer #settings-save{
    background: #8080801c;
}
html[data-theme=dark] #settingLayer select{
    background: #8080801c url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfElEQVQ4T2NkoBAwUqifYdQABixh0PL/AQMDgzyOwH3IUMOogCyHGYit/w0Y/jMcYGBg4Ecz5CMDI4MDQzXjBfwGgGRBhvxjWMDAyKAPVvyf4SIDE0MCumaQFO5obPgvwMAMdgkDw18GB4YGxg/YvDWaDvAFIpG5jOJABABKFBYRvq528AAAAABJRU5ErkJggg==") no-repeat right;
}
html[data-theme=dark] #settingLayer option{
    background: #24272f;
}
html[data-theme=dark] #settingLayer #settings-close{
    background: #25282f;
}
    `)


    //默认隐藏
    $('#settingLayerMask').hide();

    //读取值
    hideIndexSidebar = GM_getValue('hideIndexSidebar');
    hideQuestionSidebar = GM_getValue('hideQuestionSidebar');
    hideSearchSideBar = GM_getValue('hideSearchSideBar');
    hideTopicSideBar = GM_getValue('hideTopicSideBar');
    hideCollectionSideBar = GM_getValue('hideCollectionSideBar');

    //hideClubSideBar = GM_getValue('hideClubSideBar');
    //hideDraftSideBar = GM_getValue('hideDraftSideBar');
    //hideLaterSideBar = GM_getValue('hideLaterSideBar');

    hideProfileSidebar = GM_getValue('hideProfileSidebar');
    hideColumnSideBar = GM_getValue('hideColumnSideBar');
    hideRecommendedReading = GM_getValue('hideRecommendedReading');
    publishTop = GM_getValue('publishTop');
    GIFAutoPlay = GM_getValue('GIFAutoPlay');
    hoverShadow = GM_getValue('hoverShadow');
    blockingPictureVideo = GM_getValue('blockingPictureVideo');
    flowTag = GM_getValue('flowTag');
    prefersColorScheme = GM_getValue('prefersColorScheme');
    hideFeedSource = GM_getValue('hideFeedSource');

    printValue(); //输出所有设置值

    //在设置界面设置相应值
    $('select option').removeAttr('selected');

    $('#hideIndexSidebar').val(hideIndexSidebar);
    $('#hideQuestionSidebar').val(hideQuestionSidebar);
    $('#hideSearchSideBar').val(hideSearchSideBar);
    $('#hideTopicSideBar').val(hideTopicSideBar);
    $('#hideCollectionSideBar').val(hideCollectionSideBar);

    //$('#hideClubSideBar').val(hideClubSideBar);
    //$('#hideDraftSideBar').val(hideDraftSideBar);
    //$('#hideLaterSideBar').val(hideLaterSideBar);

    $('#hideProfileSidebar').val(hideProfileSidebar);
    $('#hideColumnSideBar').val(hideColumnSideBar);
    $('#hideRecommendedReading').val(hideRecommendedReading);
    $('#publishTop').val(publishTop);
    $('#GIFAutoPlay').val(GIFAutoPlay);
    $('#hoverShadow').val(hoverShadow);
    $('#blockingPictureVideo').val(blockingPictureVideo);
    $('#flowTag').val(flowTag);
    $('#prefersColorScheme').val(prefersColorScheme);
    $('#hideFeedSource').val(hideFeedSource);

    $('.checkbox').each(function() {
        if ($(this).find('input').val() == 1)
            $(this).addClass('on');
        else
            $(this).removeClass('on');
    });

    //点击关闭按钮隐藏
    $('#settings-close').click(function() {
        $('#settingLayerMask').hide();
    });

    //按ESC键隐藏
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('#settingLayerMask').hide();
        }
    });

    //开关按钮
    $('.checkbox').click(function() {
        if ($(this).hasClass('on')) {
            $(this).find('input').val('0');
        } else {
            $(this).find('input').val('1');
        }
        $(this).toggleClass('on');
    })

    //保存设置
    $('#settings-save').click(function() {
        hideIndexSidebar = $('#hideIndexSidebar').val();
        hideQuestionSidebar = $('#hideQuestionSidebar').val();
        hideSearchSideBar = $('#hideSearchSideBar').val();
        hideTopicSideBar = $('#hideTopicSideBar').val();
        hideCollectionSideBar = $('#hideCollectionSideBar').val();

        //hideClubSideBar = $('#hideClubSideBar').val();
        //hideDraftSideBar = $('#hideDraftSideBar').val();
        //hideLaterSideBar = $('#hideLaterSideBar').val();

        hideProfileSidebar = $('#hideProfileSidebar').val();
        hideColumnSideBar = $('#hideColumnSideBar').val();
        hideRecommendedReading = $('#hideRecommendedReading').val();
        publishTop = $('#publishTop').val();
        GIFAutoPlay = $('#GIFAutoPlay').val();
        hoverShadow = $('#hoverShadow').val();
        blockingPictureVideo = $('#blockingPictureVideo').val();
        flowTag = $('#flowTag').val();
        prefersColorScheme = $('#prefersColorScheme').val();
        hideFeedSource = $('#hideFeedSource').val();


        GM_setValue('hideIndexSidebar', hideIndexSidebar);
        GM_setValue('hideQuestionSidebar', hideQuestionSidebar);
        GM_setValue('hideSearchSideBar', hideSearchSideBar);
        GM_setValue('hideTopicSideBar', hideTopicSideBar);
        GM_setValue('hideCollectionSideBar', hideCollectionSideBar);

        //GM_setValue('hideClubSideBar', hideClubSideBar);
        //GM_setValue('hideDraftSideBar', hideDraftSideBar);
        //GM_setValue('hideLaterSideBar', hideLaterSideBar);

        GM_setValue('hideProfileSidebar', hideProfileSidebar);
        GM_setValue('hideColumnSideBar', hideColumnSideBar);
        GM_setValue('hideRecommendedReading', hideRecommendedReading);
        GM_setValue('publishTop', publishTop);
        GM_setValue('GIFAutoPlay', GIFAutoPlay);
        GM_setValue('hoverShadow', hoverShadow);
        GM_setValue('blockingPictureVideo', blockingPictureVideo);
        GM_setValue('flowTag', flowTag);
        GM_setValue('prefersColorScheme', prefersColorScheme);
        GM_setValue('hideFeedSource', hideFeedSource);


        $('#settingLayerMask').hide(); //隐藏设置
        window.location.reload(); //刷新当前页面.
    });

}
*/

/*
function clearValue() {
    GM_deleteValue('hideIndexSidebar');
    GM_deleteValue('hideQuestionSidebar');
    GM_deleteValue('hideSearchSideBar');
    GM_deleteValue('hideTopicSideBar');
    GM_deleteValue('hideCollectionSideBar');

    //GM_deleteValue('hideClubSideBar');
    //GM_deleteValue('hideDraftSideBar');
    //GM_deleteValue('hideLaterSideBar');

    GM_deleteValue('hideProfileSidebar');
    GM_deleteValue('hideColumnSideBar');
    GM_deleteValue('hideRecommendedReading');
    GM_deleteValue('publishTop');
    GM_deleteValue('GIFAutoPlay');
    GM_deleteValue('hoverShadow');
    GM_deleteValue('blockingPictureVideo');
    GM_deleteValue('flowTag');
    GM_deleteValue('prefersColorScheme');
    GM_deleteValue('hideFeedSource');
}
*/

// 设置界面
function settings() {
    const settingHTML = Config.generateSettingsHTML();
    $('body').append(settingHTML);

    GM_addStyle(`
#settingLayer #itemlist {
    display: flex;
    display: -webkit-flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;
}

#settingLayer section {
    display: grid;
    float: left;
    width: 200px;
    padding: 10px 20px;
    border-right: 1px solid #0084ff;
}

#settingLayer section:nth-of-type(3n) {
    border-right: none;
}

#settingLayer .switch span {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    vertical-align: top;
}

#settingLayer .switch .checkbox {
    float: right;
}

#settingLayer .checkbox {
    position: relative;
    display: inline-block;
}

#settingLayer .checkbox:after,
#settingLayer .checkbox:before {
    -webkit-font-feature-settings: normal;
    -moz-font-feature-settings: normal;
    font-feature-settings: normal;
    -webkit-font-kerning: auto;
    font-kerning: auto;
    -moz-font-language-override: normal;
    font-language-override: normal;
    font-stretch: normal;
    font-style: normal;
    font-synthesis: weight style;
    font-variant: normal;
    font-weight: normal;
    text-rendering: auto;
}

#settingLayer .checkbox label {
    width: 80px;
    height: 30px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
}

#settingLayer .checkbox label:after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    left: 0;
    top: -5px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
}

#settingLayer .checkbox input {
    display: none;
}

#settingLayer .checkbox.on  label:after {
    left: 40px;
}

#settingLayer .checkbox.on  label {
    background: #4BD865;
}

#settingLayer .switch .checkbox label {
    width: 70px;
}

#settingLayer .switch .checkbox label:after {
    top: 0;
    width: 30px;
    height: 30px;
}

/* 弹出层 */

#settingLayerMask {
    display: none;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 200000000;
    overflow: auto;
    font-family: arial, sans-serif;
    min-height: 100%;
    font-size: 16px;
    transition: 0.5s;
    opacity: 1;
    user-select: none;
    -moz-user-select: none;
    padding-bottom: 80px;
    box-sizing: border-box;
}

#settingLayer {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    margin: 45px 25px 50px 5px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    width: 800px;
    transition: 0.5s;
}

#settingLayer #btnEle {
    position: absolute;
    width: 100%;
    bottom: 4px;
    right: 0;
    background: #fff;
    border-radius: 4px;
}

#settingLayer #btnEle span {
    display: inline-block;
    background: #EFF4F8;
    border: 1px solid #3abdc1;
    margin: 12px auto 10px;
    color: #3abdc1;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    transition: 0.3s;
}

#settingLayer #btnEle a {
    color: #999;
    text-decoration: none;
}

#settingLayer #btnEle a:hover {
    text-decoration: underline;
    color: #ef8957;
}

#settingLayer #btnEle span.feedback:hover  {
    border-color: #ef8957;
}

#settingLayer #btnEle span:not(.feedback):hover {
    background: #3ACBDD;
    color: #fff;
}

#settingLayer #btnEle .feedback {
    border-color: #aaa;
}

#settingLayer #btnEle>div {
    width: 100%;
    margin-bottom: -100%;
    display: flex;
    justify-content: space-around;
    background: #EFF4F8;
    border-radius: 4px;
}


/*close button*/

#settingLayer #settings-close {
    background: white;
    color: #3ABDC1;
    line-height: 20px;
    text-align: center;
    height: 20px;
    width: 20px;
    font-size: 20px;
    padding: 10px;
    border: 3px solid #3ABDC1;
    border-radius: 50%;
    transition: .5s;
    top: -20px;
    right: -20px;
    position: absolute;
    cursor: pointer;
}

#settingLayer #settings-close::before {
    content: "\\2716";
}

#settingLayer #settings-close:hover {
    background: indianred;
    border-color: indianred;
    color: #fff;
}

#settingLayer select {
    appearance:none;
    -webkit-appearance: none;
    -moz-appearance:none;
    height: 30px;
    width: 180px;
    color: #0084FF;
    background: white url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfElEQVQ4T2NkoBAwUqifYdQABixh0PL/AQMDgzyOwH3IUMOogCyHGYit/w0Y/jMcYGBg4Ecz5CMDI4MDQzXjBfwGgGRBhvxjWMDAyKAPVvyf4SIDE0MCumaQFO5obPgvwMAMdgkDw18GB4YGxg/YvDWaDvAFIpG5jOJABABKFBYRvq528AAAAABJRU5ErkJggg==") no-repeat right;
    font-size: 16px;
    position: relative;
    display: inline-block;
    border: 1px solid rgb(118, 118, 118);
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;
    padding-left: 10px;
}
html[data-theme=dark] #settingLayer{
    background: #191c25;
}
html[data-theme=dark] #settingLayer #btnEle>div{
    background: #25282f;
}
html[data-theme=dark] #settingLayer #settings-save{
    background: #8080801c;
}
html[data-theme=dark] #settingLayer select{
    background: #8080801c url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfElEQVQ4T2NkoBAwUqifYdQABixh0PL/AQMDgzyOwH3IUMOogCyHGYit/w0Y/jMcYGBg4Ecz5CMDI4MDQzXjBfwGgGRBhvxjWMDAyKAPVvyf4SIDE0MCumaQFO5obPgvwMAMdgkDw18GB4YGxg/YvDWaDvAFIpG5jOJABABKFBYRvq528AAAAABJRU5ErkJggg==") no-repeat right;
}
html[data-theme=dark] #settingLayer option{
    background: #24272f;
}
html[data-theme=dark] #settingLayer #settings-close{
    background: #25282f;
}
        `);

    // 默认隐藏
    $('#settingLayerMask').hide();

    Config.printValue();

    // 开关按钮
    $('.checkbox').click(function () {
        if ($(this).hasClass('on')) {
            $(this).find('input').val('0');
        } else {
            $(this).find('input').val('1');
        }
        $(this).toggleClass('on');
    });

    // 点击关闭按钮隐藏
    $('#settings-close').click(function () {
        $('#settingLayerMask').hide();
    });

    // 按 ESC 键隐藏
    $(document).keyup(function (e) {
        if (e.key  === "Escape") {
            $('#settingLayerMask').hide();
        }
    });

    // 保存设置
    $('#settings-save').click(() => {
        Config.saveSettings();
    });
}

(function() {
    'use strict';

    //根据当前cookie，判断是否设置夜间模式
    if ($.cookie('nightmode') != undefined) {
        if ($.cookie('nightmode') == 1) {
            $("html").attr("data-theme", "dark");
            $(".ightmode").find("img").attr("src", light).attr("style", "vertical-align:middle; width:20px; height:20px;");
            $(".nightmode").find("span").text(" 日间模式");
        } else {
            $("html").attr("data-theme", "light");
            $(".nightmode").find("img").attr("src", dark).attr("style", "vertical-align:middle; width:18px; height:18px;");
            $(".nightmode").find("span").text(" 夜间模式");
        }
    }

    $('head').append(`<meta http-equiv="Content-Security-Policy" content="script-src * 'unsafe-eval'">`);

    //clearValue(); //清空所有设置值

    /*
    //设置默认值
    if (GM_getValue('hideIndexSidebar') == undefined) {
        GM_setValue('hideIndexSidebar', '1');
    }

    if (GM_getValue('hideQuestionSidebar') == undefined) {
        GM_setValue('hideQuestionSidebar', '1');
    }

    if (GM_getValue('hideSearchSideBar') == undefined) {
        GM_setValue('hideSearchSideBar', '1');
    }

    if (GM_getValue('hideTopicSideBar') == undefined) {
        GM_setValue('hideTopicSideBar', '1');
    }

    if (GM_getValue('hideCollectionSideBar') == undefined) {
        GM_setValue('hideCollectionSideBar', '1');
    }
*/
    /*
    if (GM_getValue('hideClubSideBar') == undefined) {
        GM_setValue('hideClubSideBar', '1');
    }

    if (GM_getValue('hideDraftSideBar') == undefined) {
        GM_setValue('hideDraftSideBar', '1');
    }

    if (GM_getValue('hideLaterSideBar') == undefined) {
        GM_setValue('hideLaterSideBar', '1');
    }
*/
    /*
    if (GM_getValue('hideProfileSidebar') == undefined) {
        GM_setValue('hideProfileSidebar', '0');
    }

    if (GM_getValue('hideColumnSideBar') == undefined) {
        GM_setValue('hideColumnSideBar', '1');
    }

    if (GM_getValue('hideRecommendedReading') == undefined) {
        GM_setValue('hideRecommendedReading', '1');
    }

    if (GM_getValue('publishTop') == undefined) {
        GM_setValue('publishTop', '1');
    }

    if (GM_getValue('GIFAutoPlay') == undefined) {
        GM_setValue('GIFAutoPlay', '0');
    }

    if (GM_getValue('hoverShadow') == undefined) {
        GM_setValue('hoverShadow', '1');
    }

    if (GM_getValue('blockingPictureVideo') == undefined) {
        GM_setValue('blockingPictureVideo', '0');
    }

    if (GM_getValue('flowTag') == undefined) {
        GM_setValue('flowTag', '0');
    }

    if (GM_getValue('prefersColorScheme') == undefined) {
        GM_setValue('prefersColorScheme', '0');
    }

    if (GM_getValue('hideFeedSource') == undefined) {
        GM_setValue('hideFeedSource', '1');
    }
*/


    /*
    //恢复默认设置
    Config.clearValue();
    Config.initConfig();
*/


    //设置界面
    settings();

    //注册设置按钮
    GM_registerMenuCommand("知乎 美化 设置", function() {
        $('#settingLayerMask').show();
    });

    //添加自定义CSS
    addCSS();

    //全局功能函数
    setInterval(directLink, 100);
    setInterval(iconColor, 100);
    setInterval(originalPic, 100);
    setInterval(gifPlaying, 100);

    //清空搜索框占位符
    setInterval(function() {
        $(".SearchBar-input input").attr("placeholder", "");
    }, 100);

    //折叠谢邀
    let timer = setInterval(function() {
        if ($(".QuestionInvitation-content").text().indexOf("更多推荐结果") > -1) {
            clearInterval(timer);
            $(".QuestionInvitation-content").addClass("hide");
            $(".QuestionInvitation-content").hide();

            $(".QuestionInvitation-title").html($(".QuestionInvitation-title").text() + '<span style=\"color:#8590A6;\">(点击此处展开/折叠)</span>');

            $(".Topbar").click(function() {

                if (($(".QuestionInvitation-content").hasClass("hide"))) {
                    $(".QuestionInvitation-content").removeClass("hide").addClass("show");
                    $(".QuestionInvitation-content").show();
                } else {
                    $(".QuestionInvitation-content").removeClass("show").addClass("hide");
                    $(".QuestionInvitation-content").hide();
                }
            });
        }
    }, 100);


    //剪切板仅保留选中内容
    //代码来源：https://greasyfork.org/scripts/367724
    function addLink(e) {
        e.preventDefault();
        var copytext = window.getSelection().toString();
        var clipdata = e.clipboardData || window.clipboardData;
        if (clipdata) {
            clipdata.setData('Text', copytext);
        }
    }
    document.addEventListener('copy', addLink);


    //每个页面对应的功能函数
    if (window.location.href.indexOf("/topic/") > -1) //话题页
        setInterval(topic, 300);
    else if (window.location.href.indexOf("/log") > -1)//问题日志
        setInterval(question_log, 300);
    else if (window.location.href.indexOf("/question/") > -1) //回答页
        setInterval(question, 300);
    else if (window.location.href.indexOf("/zvideo/") > -1) //知乎视频页
        setInterval(zvideo, 300);
    /*
    else if (window.location.href.indexOf("/club/") > -1) //知乎圈子页
        setInterval(club, 300);
    */
    else if (window.location.href.indexOf("/ring/") > -1 || window.location.href.indexOf("/ring-feeds") > -1) //知乎圈子页
        setInterval(ring, 300);
    else if (window.location.href.indexOf("/search") > -1) //搜索结果页
        setInterval(search, 300);
    else if (window.location.href.indexOf("/lives") > -1) //知乎讲座页
        setInterval(lives, 300);
    else if (window.location.href.indexOf("/collection/") > -1) //收藏夹
        setInterval(collection, 300);
    else if (window.location.href.indexOf("zhuanlan.") > -1) //专栏文章
        setInterval(zhuanlan, 300);
    else if (window.location.href.indexOf("/pin/") > -1) //想法
        setInterval(pin, 300);
    else if (window.location.href.indexOf("/people/") > -1 || window.location.href.indexOf("/org/") > -1) //用户主页
        setInterval(people, 300);
    else if (window.location.href.indexOf("/draft") > -1) //草稿页
        setInterval(draft, 300);
    else if (window.location.href.indexOf("/roundtable/") > -1) //知乎圆桌页
        setInterval(roundtable, 300);
    else if (window.location.href.indexOf("/column/") > -1) //专栏列表
        setInterval(column, 300);
    else if (window.location.href.indexOf("cheese.") > -1) //芝士平台
        setInterval(cheese, 300);
    else if (window.location.href.indexOf("/xen/") > -1 || window.location.href.indexOf("/remix/") > -1) //盐选专栏、知乎讲书
        setInterval(xen, 300);
    else if (window.location.href.indexOf("/creator") > -1) //创作中心
        setInterval(creator, 300);
    else if (window.location.href.indexOf("/wza/public/") > -1) //无障碍说明
        setInterval(wza, 300);
    else if (window.location.href.indexOf("/recent-viewed") > -1) //最近浏览
        setInterval(recent, 300);
    else
        setInterval(index, 300); //首页

})();