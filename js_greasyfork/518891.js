// ==UserScript==
// @name         彪扑
// @namespace    https://greasyfork.org/gmail
// @version      0.3.2
// @description  （从“烂虎扑屏蔽器”修改而来。）根据屏蔽标题和作者的关键词
// @author       biopsy
// @license      Apache Licence 2.0
// @match        https://bbs.hupu.com/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        unSafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/518891/%E5%BD%AA%E6%89%91.user.js
// @updateURL https://update.greasyfork.org/scripts/518891/%E5%BD%AA%E6%89%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const Keys = {blacklist: "banKeyword", tour: "firstTime"};

    function appendAssets() {
        const $head = $("head");
        $head.append($(`<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`));
        $head.append($(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">`));
        $head.append($(`<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`));
    }

    function appendElements() {
        // 添加右下角fab
        const $body = $("body");
        $body.append($(`<div class="fixed-action-btn">
  <a id="fab" class="btn-floating btn-large white">
    <i class="red-text large material-icons">lightbulb_outline</i>
  </a>
  <ul>
    <li id="fab-first"><a class="btn-floating white tooltip" data-tooltip="调试"><i class="red-text material-icons">mode_edit</i></a></li>
    <li id='showBanList'><a class="btn-floating white tooltip" data-tooltip="屏蔽词"><i class="red-text material-icons">reorder</i></a></li>
  </ul>
</div>
`));
        // 添加屏蔽词的chips
        $body.append($(`<div id="keywordList" class="card-panel teal lighten-1" style="background:grey;display:none; z-index:999;text-align:center;width: 66vw;height: 20vh;position: fixed;inset:0;margin: auto;">
    <div class="white-text">语法: %A% 开头屏蔽作者昵称， %I%开头屏蔽作者ID</div>
    <div class="chips chips-placeholder chips-initial"/>
    </div>`));
        // 添加个click事件，用于判断是否点击在chips组件之外
        $('#container').click(() => $('#keywordList').fadeOut(500));

        // 初始化 FAB
        M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction: 'left'});

        // 初始化 tooltip
        M.Tooltip.init(document.querySelectorAll('.tooltip'), {
            enterDelay: 200, exitDelay: 0, inDuration: 200, outDuration: 200, position: 'top', transitionMovement: 10
        });
    }


    // 添加新用户引导
    function addTour(count) {
        $('body').append($(`<div class="tap-target" data-target="fab">
    <div class="tap-target-content">
      <h5 style="color:white">自定义设置</h5><br/>
      <p style="color:white">在这里进行自定义配置</p><br/>
      <p style="color:white">此新用户引导只显示3次，这是第` + count + `次</p>
    </div>
  </div>`))

        // FeatureDiscovery初始化
        //$('.tap-target').tapTarget()
        let tapTargetElems = document.querySelectorAll('.tap-target')
        let tapTargetOptions = {
            open() {
                console.log('open')
            }, close() {
                console.log('close')
            }
        }
        M.TapTarget.init(tapTargetElems, tapTargetOptions)
        $('.tap-target').tapTarget('open')
    }


    // 显示屏蔽关键字列表（设置过多关键字会导致显示有点不和谐，待修复）
    function showBanKeyword() {
        // 挂载需要填入数据并设置可见性为true
        if ($('#keywordList').length > 0) {
            let elems = document.querySelectorAll('.chips')
            const words = GM_getValue(Keys.blacklist)
            const data = words.map(tag => ({tag}));
            let options = {
                data,
                placeholder: '添加一个屏蔽词',
                secondaryPlaceholder: '继续添加',
                onChipAdd: saveChipsData,
                onChipDelete: saveChipsData,
            }
            M.Chips.init(elems, options)
            alterChipsCardSize(data.length)
        }
    }

    // 根据chips数量来改变该card-panel的大小
    function alterChipsCardSize(length) {
        let height = ((length / 4 & 0) + 1) * 32 + 120;
        $('#keywordList').css({'display': 'inline', 'height': height + 'px'})
    }

    // 用于chips触发“添加”和“删除”事件后保存数据
    function saveChipsData() {
        let data = M.Chips.getInstance($('.chips')).chipsData
        let banKeyword = []
        data.forEach(function (e) {
            let keyword = e.tag
            banKeyword.push(keyword)
        })
        GM_log(banKeyword)
        alterChipsCardSize(banKeyword.length)
        // 将数据存储起来
        GM_setValue(Keys.blacklist, banKeyword)
    }


    //region filter

    /**
     * 语法： %A% %I%
     * @param {string}str
     * @return {(function(text:string): boolean)}
     */
    function createMatcher(str) {
        function createIndexMatcher(key) {
            return (text) => text.indexOf(key) > -1;
        }

        function createRegMatcher(key) {
            const pattern = new RegExp(key);
            return (text) => pattern.test(text);
        }

        if (str.startsWith('/') && s.endsWith('/')) {
            return createRegMatcher(str.substring(1, str.length - 1));
        } else {
            let fuzzy = false;
            if (str.indexOf('*') > -1) {
                fuzzy = true;
                str = str.replaceAll('*', '.*');
            }
            if (str.indexOf('?') > -1) {
                fuzzy = true;
                str = str.replaceAll('?', '.?');
            }
            return fuzzy ? createRegMatcher(str) : createIndexMatcher(str);
        }
    }

    /**
     *
     * @param {string[]} arr
     * @return {function(text:string): boolean}
     */
    function createFluxMatcher(arr) {
        const matchers = arr.map(x => createMatcher(x.trim()));
        return function (text) {
            if (!text) return false;
            for (let i = 0; i < matchers.length; i++) {
                if (matchers[i](text)) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * @param {string[]} words
     * @return {{filterAuthor: boolean, author({id: string, name: string}): boolean, title(string): boolean}}
     */
    function createFilter(words = []) {
        const titles = [], ids = [], names = [];
        for (let i = 0; i < words.length; i++) {
            const s = words[i];
            if (s.length > 3) {
                const codes = [0, 1, 2].map(i => s.charCodeAt(i));
                if (codes[0] === 37 && codes[2] === 37) {
                    const c = codes[1];
                    if (c === 65 || c === 97) { // A
                        names.push(s.substring(3));
                    } else if (c === 73 || c === 105) { //I
                        ids.push(s.substring(3));
                    } else {
                        titles.push(s.substring(3));
                    }
                } else {
                    titles.push(s);
                }
            } else {
                titles.push(s);
            }
        }
        const titleMatcher = createFluxMatcher(titles);
        const idMatcher = createFluxMatcher(ids);
        const nameMatcher = createFluxMatcher(names);
        return {
            filterAuthor: ids.length > 0 || names.length > 0, title(text) {
                return titleMatcher(text);
            }, author({id, name}) {
                if (idMatcher(id)) return true;
                return nameMatcher(name);
            }
        }
    }

    function hidePostList(filter) {
        const articles = document.querySelectorAll('.bbs-sl-web-post li');

        function shouldHide(elem) {
            if (filter.filterAuthor) {
                const el = elem.querySelector('.post-auth a');
                const name = el.innerText;
                const id = el.getAttribute('href').split('/').at(-1);
                if (filter.author({id, name})) {
                    console.info('hide author:', name, id);
                    return true;
                }
            }
            const title = elem.querySelector('.post-title').innerText;
            if (filter.title(title)) {
                console.info('hide title:', title);
                return true;
            }
            return false;
        }

        for (let i = 0; i < articles.length; i++) {
            const foo = articles[i];
            if (shouldHide(foo)) {

                $(foo).css({'background-color': '#81c784', 'color': 'grey'}).fadeOut(500);
            }
        }
    }

    function hideAd() {
        // 屏蔽虎扑游戏
        $('.game-center-sidebar').remove()
        $('.game-center-entrance-container-title').remove()
        $('#game-center-entrance-container').remove()
        const $hotGame = $(':contains("热门游戏-即点即玩")');
        const el = $hotGame[$hotGame.length - 2]
        if (el) el.innerHTML = '';
    }

    //endregion

    appendAssets();
    appendElements();

    $(document).ready(function () {
        $('#showBanList').click(() => showBanKeyword());

        // 调试
        $('#fab-first').click(() => {
            const arr = GM_getValue(Keys.blacklist);
            console.info('黑名单', arr)
            const filter = createFilter();
            console.info('filter author', filter.filterAuthor)
            console.info(filter)
            console.info('author id', filter.author({id: '1234567', name: 'foobar'}))
            console.info('author name', filter.author({id: 'gg', name: '彭嘎'}))
            console.info('title contains', filter.title('战绩六芒星'))
            console.info('title *', filter.title('一起迎着上'))
            window.filter = filter;
        });
        // hideAd();
        const filter = createFilter(GM_getValue(Keys.blacklist));
        hidePostList(filter);
    })
})();
