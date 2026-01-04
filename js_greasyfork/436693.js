// ==UserScript==
// @name         hipda-ID笔记
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  来自地板带着爱，记录上网冲浪的美好瞬间
// @author       屋大维
// @license      MIT
// @match        https://www.hi-pda.com/forum/*
// @match        https://www.4d4y.com/forum/*
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @icon         https://icons.iconarchive.com/icons/iconshock/real-vista-project-managment/64/task-notes-icon.png
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436693/hipda-ID%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436693/hipda-ID%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // CONST
    const BROWSER_KEY = 'alt+I';
    const MANAGEMENT_KEY = "alt+U";

    // CSS
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    GM_addStyle(".no-close .ui-dialog-titlebar-close{display:none} textarea{height:100%;width:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box} .card{box-shadow:0 4px 8px 0 rgba(0,0,0,.2);transition:.3s;width:100%;overflow-y: scroll;}.card:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,.2)}.container{padding:2px 16px}");
    GM_addStyle(".flex-container{display:flex;flex-wrap: wrap;}.flex-container>div{background-color:#f1f1f1;width:500px;max-height:500px;margin:15px; padding:5px;text-align:left;}");
    GM_addStyle(`.lds-roller{display:inline-block;position:fixed;top:50vh;left:50vh;width:80px;height:80px}.lds-roller div{animation:1.2s cubic-bezier(.5,0,.5,1) infinite lds-roller;transform-origin:40px 40px}.lds-roller div:after{content:" ";display:block;position:absolute;width:7px;height:7px;border-radius:50%;background:#bfa1cf;margin:-4px 0 0 -4px}.lds-roller div:first-child{animation-delay:-36ms}.lds-roller div:first-child:after{top:63px;left:63px}.lds-roller div:nth-child(2){animation-delay:-72ms}.lds-roller div:nth-child(2):after{top:68px;left:56px}.lds-roller div:nth-child(3){animation-delay:-108ms}.lds-roller div:nth-child(3):after{top:71px;left:48px}.lds-roller div:nth-child(4){animation-delay:-144ms}.lds-roller div:nth-child(4):after{top:72px;left:40px}.lds-roller div:nth-child(5){animation-delay:-.18s}.lds-roller div:nth-child(5):after{top:71px;left:32px}.lds-roller div:nth-child(6){animation-delay:-216ms}.lds-roller div:nth-child(6):after{top:68px;left:24px}.lds-roller div:nth-child(7){animation-delay:-252ms}.lds-roller div:nth-child(7):after{top:63px;left:17px}.lds-roller div:nth-child(8){animation-delay:-288ms}.lds-roller div:nth-child(8):after{top:56px;left:12px}@keyframes lds-roller{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`);

    // Your code here...
    // helpers
    function showLoader() {
        let loader = $(`<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`);
        $("body").append(loader);
    }

    function hideLoader() {
        $(".lds-roller").remove();
    }

    function getKeys(e) { // keycode 转换
        var codetable = {
            '96': 'Numpad 0',
            '97': 'Numpad 1',
            '98': 'Numpad 2',
            '99': 'Numpad 3',
            '100': 'Numpad 4',
            '101': 'Numpad 5',
            '102': 'Numpad 6',
            '103': 'Numpad 7',
            '104': 'Numpad 8',
            '105': 'Numpad 9',
            '106': 'Numpad *',
            '107': 'Numpad +',
            '108': 'Numpad Enter',
            '109': 'Numpad -',
            '110': 'Numpad .',
            '111': 'Numpad /',
            '112': 'F1',
            '113': 'F2',
            '114': 'F3',
            '115': 'F4',
            '116': 'F5',
            '117': 'F6',
            '118': 'F7',
            '119': 'F8',
            '120': 'F9',
            '121': 'F10',
            '122': 'F11',
            '123': 'F12',
            '8': 'BackSpace',
            '9': 'Tab',
            '12': 'Clear',
            '13': 'Enter',
            '16': 'Shift',
            '17': 'Ctrl',
            '18': 'Alt',
            '20': 'Cape Lock',
            '27': 'Esc',
            '32': 'Spacebar',
            '33': 'Page Up',
            '34': 'Page Down',
            '35': 'End',
            '36': 'Home',
            '37': '←',
            '38': '↑',
            '39': '→',
            '40': '↓',
            '45': 'Insert',
            '46': 'Delete',
            '144': 'Num Lock',
            '186': ';:',
            '187': '=+',
            '188': ',<',
            '189': '-_',
            '190': '.>',
            '191': '/?',
            '192': '`~',
            '219': '[{',
            '220': '\|',
            '221': ']}',
            '222': '"'
        };
        var Keys = '';
        e.shiftKey && (e.keyCode != 16) && (Keys += 'shift+');
        e.ctrlKey && (e.keyCode != 17) && (Keys += 'ctrl+');
        e.altKey && (e.keyCode != 18) && (Keys += 'alt+');
        return Keys + (codetable[e.keyCode] || String.fromCharCode(e.keyCode) || '');
    };

    function addHotKey(codes, func) { // 监视并执行快捷键对应的函数
        document.addEventListener('keydown', function(e) {
            if ((e.target.tagName != 'INPUT') && (e.target.tagName != 'TEXTAREA') && getKeys(e) == codes) {
                func();
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
    };

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function getEpoch(date_str, time_str) {
        let [y, m, d] = date_str.split("-").map(x => parseInt(x));
        let [H, M] = time_str.split(":").map(x => parseInt(x));
        return new Date(y, m - 1, d, H, M, 0).getTime() / 1000;
    }

    // classes
    class HpThread {
        constructor() {}

        getThreadTid() {
            return location.href.match(/tid=(\d+)/) ? parseInt(location.href.match(/tid=(\d+)/)[1]) : -999;
        }

        getUserUid() {
            return parseInt($("cite > a").attr("href").split("uid=")[1]);
        }

        getThreadTitle() {
            let l = $('#nav').text().split(" » ");
            return l[l.length - 1];
        }

        getHpPosts() {
            let threadTid = this.getThreadTid();
            let threadTitle = this.getThreadTitle();
            let divs = $('#postlist > div').get();
            return divs.map(d => new HpPost(threadTid, threadTitle, d));
        }

        addNoteBrowserUI(_notebook) {
            $('#menu>ul').append($(`<li class="menu_2"><a href="javascript:void(0)" hidefocus="true" id="noteButton_browser">搜索笔记</a></li>`));
            var that = this;
            // create dialog
            let dialog = htmlToElement(`
              <div id="noteDialog_browser" style="display: none;">
                <div id="noteDialog_browser_search_bar" style="width: 80%; margin: 20px auto 20px auto;">
                    <select style="display: inline-block;" name="searchMethod" id="noteDialog_browser_search_method">
                        <option value="content">笔记内容</option>
                        <option value="userName">用户名</option>
                    </select>
                    <input type="text" autofocus="true" style="display: inline-block; width: 300px;" id="noteDialog_browser_search_input">
                </div>
                <div id="noteDialog_browser_note_list" style="width: 95%; margin: 10px auto 10px auto;" class="flex-container">
                </div>
              </div>
            `);
            $("body").append(dialog);

            function updateNoteList() {
                $('#noteDialog_browser_note_list').empty(); // remove all notes from the list
                var notes;
                var searchMethod = $('#noteDialog_browser_search_method').val();
                var searchInput = $('#noteDialog_browser_search_input').val();
                if (searchMethod === "userName") {
                    notes = _notebook.getNotesByUsername(searchInput);
                } else if (searchMethod === "content") {
                    notes = _notebook.getNotesByKeyword(searchInput);
                } else {
                    return;
                }
                console.log(notes.length)
                for (let i = 0; i < notes.length; i++) {
                    let element = noteToHtmlElement(notes[i]);
                    $('#noteDialog_browser_note_list').append(element);
                }
            }

            function noteToHtmlElement(note) {
                var searchMethod = $('#noteDialog_browser_search_method').val();
                var searchInput = $('#noteDialog_browser_search_input').val();
                var userName = note.userName;
                var uid = note.uid;
                var content = note.note;
                if (searchMethod === 'userName') {
                    userName = userName.replaceAll(searchInput, '<mark class="highlight">$&</mark>');
                }
                if (searchMethod === 'content') {
                    content = content.replaceAll(searchInput, '<mark class="highlight">$&</mark>');
                }
                // highlight all URLs
                var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                var regex = new RegExp(expression);
                content = content.replace(regex, '<a style="color:blue;" href="$&" target="_blank">$&</a>')

                var html = `
                <div class="card">
                    <div style="font-size: 2em; float: left; margin: 10px;">${userName}</div>
                    <div style="float: right;">
                        <button class="noteEditButton">编辑</button>
                        <button class="noteDeleteButton" style="margin-right: 2px;">删除</button>
                    </div>
                    <div class="container" style="word-break: break-all; white-space: pre-wrap;">
                    ${content}
                    </div>
                </div>
                `;
                var element = $(html);
                // delete
                element.find("button.noteDeleteButton").click(function() {
                    let r = confirm(`确定要删除 ${note.userName} 的ID笔记吗？`);
                    if (!r) {
                        return;
                    }
                    _notebook.delete(uid);
                    updateNoteList();
                });
                // edit
                element.find("button.noteEditButton").click(function() {
                    // note dialog (this will be different from the one opened in posts)
                    let dialog = htmlToElement(`
                        <div id="noteDialog_${uid}" style="display: none;">
                        <textarea rows="10" wrap="hard" placeholder="暂时没有笔记">
                        </div>
                    `);
                    $("body").append(dialog);

                    // bind event listener
                    console.log("open note for", userName);
                    // freshly fetched from DB
                    $(`#noteDialog_${uid}`).find('textarea').first().val(_notebook.get(uid));
                    $(`#noteDialog_${uid}`).dialog({
                        title: `ID笔记：${userName}`,
                        dialogClass: "no-close",
                        closeText: "hide",
                        closeOnEscape: true,
                        height: Math.max(parseInt($(window).height() * 0.4), 350),
                        width: Math.max(parseInt($(window).width() * 0.4), 600),
                        buttons: [{
                                text: "确认",
                                click: function() {
                                    // save the new note before close
                                    let newNote = $(`#noteDialog_${uid}`).find('textarea').first().val();
                                    if (newNote.length === 0) {
                                        _notebook.delete(uid);
                                    } else {
                                        _notebook.put(uid, userName, newNote);
                                    }
                                    $(this).dialog("close");
                                    // update the Note List
                                    updateNoteList();
                                }
                            },
                            {
                                text: "取消",
                                click: function() {
                                    // close without saving
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });

                });
                return element;
            }

            function openBrowser() {
                $('#menu>ul>li').first().removeClass("current");
                $('#menu>ul>li').first().addClass("menu_2");
                $('#noteButton_browser').parent().removeClass("menu_2");
                $('#noteButton_browser').parent().addClass("current");
                console.log("open notebook browser dialog");

                $(`#noteDialog_browser`).dialog({
                    title: "ID笔记：浏览器",
                    modal: true,
                    height: parseInt($(window).height() * 0.8),
                    width: parseInt($(window).width() * 0.8),
                    closeOnEscape: true,
                    open: function(event, ui) {
                        $('.ui-widget-overlay').css("background-color", "black");
                        $('.ui-widget-overlay').css("opacity", "0.6");
                    },
                    close: function(event, ui) {
                        $('#menu>ul>li').first().removeClass("menu_2");
                        $('#menu>ul>li').first().addClass("current");
                        $('#noteButton_browser').parent().removeClass("current");
                        $('#noteButton_browser').parent().addClass("menu_2");
                    }
                });
            }

            $(document).ready(function() {
                $('#noteDialog_browser_search_input').on("input", () => {
                    updateNoteList();
                });
                $('#noteDialog_browser_search_method').change(() => {
                    updateNoteList();
                });
                $(document).on("click", `#noteButton_browser`, function() {
                    openBrowser();
                });
                // HOTKEY
                addHotKey(BROWSER_KEY, openBrowser);
            });

        }

        addNoteManagementUI(_notebook) {
            var that = this;
            var button = htmlToElement(`
              <button id="noteButton_management">
                <span><img src="https://icons.iconarchive.com/icons/iconshock/real-vista-project-managment/32/task-notes-icon.png"></img></span>
              </button>
            `);

            // create dialog
            let dialog = htmlToElement(`
              <div id="noteDialog_management" style="display: none;">
                <h3>hipda-ID笔记 v${GM_info.script.version}</h3>
                <p style="margin: 10px auto 10px auto;">来自地板带着爱</p>
                <p id="noteStat" style="margin: 10px auto 10px auto;"></p>
                <div>
                  <button id="noteButton_import">导入</button>
                  <button id="noteButton_export">导出</button>
                  <button id="noteButton_reset">重置</button>
                  <button id="noteButton_migrate">4d4y</button>
                  <button id="noteButton_server">服务器</button>
                  <input type="hidden" autofocus="true" />
                </div>
              </div>
            `);
            $("body").append(dialog);

            function updateNoteStat() {
                let note_stat = _notebook.getNotebookStat();
                let synced = _notebook._synced;
                $(`#noteStat`).text(`共${note_stat.note_number}条ID笔记，大小为${(note_stat.size_kb).toFixed(2)}KB${synced ? " (已同步)" : ""}`);
            }

            function openManagement() {
                console.log("open notebook management dialog");
                // update statistics
                updateNoteStat();

                $(`#noteDialog_management`).dialog({
                    title: "ID笔记：管理面板",
                    height: 200,
                    width: 300,
                    closeOnEscape: true,
                });
            }

            $(document).ready(function() {
                $(document).on("click", "#noteButton_server", async function() {
                    let apiKey = await _notebook.getApiKey();
                    let data = prompt("请将 API链接 输入文本框：", apiKey ? apiKey : "");
                    if (data !== null) {
                        // try to load
                        try {
                            _notebook.setApiKey(data);
                        } catch (err) {
                            alert("格式错误！" + err);
                            return;
                        }
                        alert("导入成功！");
                    }
                });
                $(document).on("click", "#noteButton_migrate", function() {
                    let r = confirm("确定要从hi-pda迁移到4d4y吗？");
                    if (!r) {
                        return;
                    }
                    _notebook.migrate();
                    alert("迁移成功！");
                });
                $(document).on("click", "#noteButton_import", function() {
                    let r = confirm("确定要导入ID笔记吗？现有笔记将会被覆盖！");
                    if (!r) {
                        return;
                    }

                    // prompt cannot handle large file, extend it in the future
                    let data = prompt("请将 id笔记.json 中的文本复制粘贴入文本框：");
                    if (data !== null) {
                        // try to load
                        try {
                            let j = JSON.parse(data);
                            _notebook.importNotebook(j);
                        } catch (err) {
                            alert("格式错误！" + err);
                            return;
                        }
                        alert("导入成功！");
                        updateNoteStat();
                    }
                });
                $(document).on("click", "#noteButton_export", async function() {
                    let r = confirm("确定要导出ID笔记吗？");
                    if (!r) {
                        return;
                    }
                    let a = document.createElement("a");
                    let data = await _notebook.exportNotebook();
                    a.href = "data:text," + encodeURIComponent(data);
                    a.download = "id笔记.json";
                    a.click();
                });
                $(document).on("click", "#noteButton_reset", function() {
                    let r = confirm("确定要清空ID笔记吗？");
                    if (!r) {
                        return;
                    }
                    _notebook.resetNotebook();
                    alert("ID笔记已经清空！");
                    updateNoteStat();
                });
                $(document).on("click", `#noteButton_management`, function() {
                    openManagement();
                });
                // HOTKEY
                addHotKey(MANAGEMENT_KEY, openManagement);
            });

            // add UI
            let d = $("td.modaction").last();
            d.append(button);

        }

    }

    class HpPost {
        constructor(threadTid, threadTitle, postDiv) {
            this.threadTid = threadTid;
            this.threadTitle = threadTitle;
            this._post_div = postDiv;
        }

        getPostAuthorName() {
            return $(this._post_div).find("div.postinfo > a").first().text();
        }

        getPostAuthorUid() {
            return parseInt($(this._post_div).find("div.postinfo > a").first().attr("href").split("uid=")[1]);
        }

        getPostPid() {
            return parseInt($(this._post_div).attr("id").split("_")[1]);
        }

        getGotoUrl() {
            // return `https://www.hi-pda.com/forum/redirect.php?goto=findpost&ptid=${this.threadTid}&pid=${this.getPostPid()}`;
            return `https://www.4d4y.com/forum/redirect.php?goto=findpost&ptid=${this.threadTid}&pid=${this.getPostPid()}`;
        }

        getPostContent() {
            // get text without quotes
            let t = $(this._post_div).find("td.t_msgfont").first().clone();
            t.find('.quote').replaceWith("<p>【引用内容】</p>");
            t.find('.t_attach').replaceWith("<p>【附件】</p>");
            t.find('img').remove();
            let text = t.text().replace(/\n+/g, "\n").trim();
            return text;
        }

        getPostBrief(n) {
            let content = this.getPostContent();
            if (content.length <= n) {
                return content;
            }
            return content.slice(0, n) + "\n\n【以上为截取片段】";
        }

        getOriginalTimestamp(use_string = false) {
            let dt = $(this._post_div).find("div.authorinfo > em").text().trim().split(" ").slice(1, 3);
            if (use_string) {
                return dt.join(" ");
            }
            return getEpoch(dt[0], dt[1]);
        }

        getLastTimestamp(use_string = false) {
            let ele = $(this._post_div).find("i.pstatus").get();
            if (ele.length !== 0) {
                let dt = $(this._post_div).find("i.pstatus").text().trim().split(" ").slice(3, 5);
                if (use_string) {
                    return dt.join(" ");
                }
                return getEpoch(dt[0], dt[1]);
            }
            return null;
        }

        getTimestamp(use_string = false) {
            // get last edit time
            let lastTimestamp = this.getLastTimestamp(use_string);
            return lastTimestamp ? lastTimestamp : this.getOriginalTimestamp(use_string);
        }

        addNoteUI(_notebook) {
            let uid = this.getPostAuthorUid();
            let index = $(this._post_div).index();
            let userName = this.getPostAuthorName();

            var that = this;
            // create an UI element which contains data and hooks
            // button
            let button = htmlToElement(`
              <button id="noteButton_${index}" style="color:grey; margin-left:20px;">
                ID笔记
              </button>
            `);
            // note dialog
            let dialog = htmlToElement(`
              <div id="noteDialog_${index}" style="display: none;">
                <textarea rows="10" wrap="hard" placeholder="暂时没有笔记">
              </div>
            `);
            $("body").append(dialog);

            // add event to button
            $(document).ready(function() {
                $(document).on("click", `#noteButton_${index}`, async function() {
                    // try to sync DB
                    if (!_notebook._synced) {
                        try {
                            await _notebook.sync_server(uid);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    console.log("open note for", userName);
                    // freshly fetched from DB
                    $(`#noteDialog_${index}`).find('textarea').first().val(_notebook.get(uid));
                    $(`#noteDialog_${index}`).dialog({
                        title: `ID笔记：${userName}`,
                        dialogClass: "no-close",
                        closeText: "hide",
                        closeOnEscape: true,
                        height: Math.max(parseInt($(window).height() * 0.4), 350),
                        width: Math.max(parseInt($(window).width() * 0.4), 600),
                        buttons: [{
                                text: "插入当前楼层",
                                click: function() {
                                    let txt = $(`#noteDialog_${index}`).find('textarea').first();
                                    var caretPos = txt[0].selectionStart;
                                    var textAreaTxt = txt.val();
                                    var txtToAdd = `\n====\n引用: ${that.getGotoUrl()}\n【${that.getTimestamp(true)}】\n${that.getPostAuthorName()} 在《${that.threadTitle}》中说：\n ${that.getPostBrief(200)}\n====\n`;
                                    txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos));
                                }
                            },
                            {
                                text: "确认",
                                click: function() {
                                    // save the new note before close
                                    let newNote = $(`#noteDialog_${index}`).find('textarea').first().val();
                                    if (newNote.length === 0) {
                                        _notebook.delete(uid);
                                    } else {
                                        _notebook.put(uid, userName, newNote);
                                    }
                                    $(this).dialog("close");
                                }
                            },
                            {
                                text: "取消",
                                click: function() {
                                    // close without saving
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });
                });
            });

            // add UI
            let d = $(this._post_div).find("td[rowspan='2'].postauthor").first();
            d.append(button);
        }

    }

    class NotebookClient {
        // used to connect to the server
        constructor(UID, apiKey) {
            this.UID = String(UID);
            this.apiKey = apiKey;
        }

        get() {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: `${this.apiKey}`,
                    onload: function(response) {
                        let data = response.responseText;
                        if (response.status === 200) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    }
                });
            });
        }

        put(payload) {
            return new Promise((resolve, reject) => {
                let d = {
                    note: payload
                };
                GM.xmlHttpRequest({
                    method: "POST",
                    url: `${this.apiKey}`,
                    data: JSON.stringify(d),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        let data = response.responseText;
                        if (response.status === 200) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    }
                });
            });

        }

    }

    class Notebook {
        // notebook data structure:
        //     this._notebook[uid] = {uid, userName, note};
        constructor(UID) {
            // initialization
            this._name = "hipda-notebook";
            this._keyname = "hipda-notebook-key";
            this._timestamp_name = "hipda-notebook-timestamp";
            this._uid = UID;
            this._key = null;
            this._client = null;
            this._notebook = {};
            this._synced = false;
            return (async () => {
                this.loadFromLocalStorage();
                this._key = await this.getApiKey();
                return this;
            })();
        }

        async sync_server() {
            showLoader();
            await this._sync_server();
            hideLoader();
        }

        async _sync_server() {
            if (GM.xmlHttpRequest === undefined) {
                console.log("浏览器不支持连接服务器");
                return;
            }
            if (this._key === null) {
                return;
            }
            let client = new NotebookClient(this._uid, this._key);
            let data;
            try {
                data = await client.get();
            } catch (err) {
                console.log(err);
                this._synced = true;
            }
            function isServerDataValid(data) {
                if (data === undefined || data === '') {
                    return false;
                }
                try {
                    let serverVal = JSON.parse(JSON.parse(data).note)
                    if (serverVal.timestamp === undefined) {
                        return false
                    }
                } catch {
                    return false;
                }
                return true;
            }
            if (!isServerDataValid(data)) {
                // initialize in server
                let payload = await this.exportNotebook();
                let data = await client.put(payload);
                console.log("initialize record in server");
                console.log("server:", data);
            } else {
                // check timestamp
                let serverVal = JSON.parse(JSON.parse(data).note)
                let serverTimestamp = serverVal.timestamp;
                let localTimestamp = await this.getTimestamp();
                if (localTimestamp === null || localTimestamp < serverTimestamp) {
                    // import from server
                    this.importNotebook(serverVal);
                    console.log("import record from server");
                } else if (localTimestamp > serverTimestamp) {
                    // push to server
                    let payload = await this.exportNotebook();
                    let data = await client.put(payload);
                    console.log("update record in server");
                    console.log("server:", data);
                } else {
                    console.log("already up-to-date");
                }
            }
            this._synced = true;
        }

        async getTimestamp() {
            let data = await GM.getValue(this._timestamp_name, null);
            return data;
        }

        async setTimestamp() {
            await GM.setValue(this._timestamp_name, +new Date());
        }

        async getApiKey() {
            console.log("load ID Notebook API key from Local Storage");
            let data = await GM.getValue(this._keyname, null);
            return data;
        }

        async setApiKey(apiKey) {
            console.log("save ID Notebook API key to Local Storage");
            if (apiKey === "") {
                await GM.deleteValue(this._keyname);
                this._key = null;
            } else {
                await GM.setValue(this._keyname, apiKey);
                this._key = apiKey;
            }
        }

        async loadFromLocalStorage() {
            console.log("load ID Notebook from Local Storage");
            let data = await GM.getValue(this._name, null);
            if (data !== null) {
                this._notebook = JSON.parse(data);
            }
        }

        async saveToLocalStorage() {
            console.log("save ID Notebook to Local Storage");
            await GM.setValue(this._name, JSON.stringify(this._notebook));
            await this.setTimestamp();
            await this.sync_server();
        }

        put(uid, userName, note) {
            // we need userName here, so user can analyze notes even after export
            this._notebook[uid] = {
                uid,
                userName,
                note
            };
            this.saveToLocalStorage();
        }

        get(uid) {
            if (uid in this._notebook) {
                return this._notebook[uid].note;
            }
            return "";
        }

        delete(uid) {
            if (uid in this._notebook) {
                delete this._notebook[uid];
                this.saveToLocalStorage();
            }
        }

        getNotesByUsername(userName) {
            if (userName.length === 0) {
                return [];
            }

            function compareFn(a, b) {
                if (a.userName < b.userName) {
                    return -1;
                }
                if (a.userName > b.userName) {
                    return 1;
                }
                return 0;

            }
            return Object.values(this._notebook).filter(x => x.userName.toLocaleLowerCase().indexOf(userName.toLocaleLowerCase()) !== -1).sort(compareFn);
        }

        getNotesByKeyword(keyword) {
            if (keyword.length === 0) {
                return [];
            }

            function compareFn(a, b) {
                if (a.note < b.userName) {
                    return -1;
                }
                if (a.userName > b.userName) {
                    return 1;
                }
                return 0;

            }
            return Object.values(this._notebook).filter(x => x.note.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1).sort(compareFn);
        }

        async exportNotebook() {
            // can add meta data here
            let timestamp = await this.getTimestamp()
            let output = {
                notebook: this._notebook,
                version: GM_info.script.version,
                timestamp: timestamp
            };
            return JSON.stringify(output);
        }

        importNotebook(input) {
            let attrs = ['notebook', 'version', 'timestamp'];
            for (let i = 0; i < attrs.length; i++) {
                if (!input.hasOwnProperty(attrs[i])) {
                    throw (`bad format: ${attrs[i]} does not exist`);
                }
            }
            this._notebook = {
                ...input.notebook
            };
            this.saveToLocalStorage();
        }

        resetNotebook() {
            this._notebook = {};
            this.saveToLocalStorage();
        }

        getNotebookStat() {
            return {
                'note_number': Object.keys(this._notebook).length,
                'size_kb': (new TextEncoder().encode(this.exportNotebook())).length / 1024
            };
        }

        migrate() {
            // update all hi-pda urls to 4d4y urls
            Object.keys(this._notebook).forEach(uid => {
                let oldVal = this._notebook[uid].note;
                let newVal = oldVal.replace('www.hi-pda.com/forum/', 'www.4d4y.com/forum/');
                this._notebook[uid].note = newVal;
            });
        }
    }

    async function main() {

        // get a thread object
        var THIS_THREAD = new HpThread();
        var notebook = await new Notebook(THIS_THREAD.getUserUid());

        // notebook browser
        THIS_THREAD.addNoteBrowserUI(notebook);
        // management panel
        THIS_THREAD.addNoteManagementUI(notebook);

        // render UI below
        // ID notes
        var hp_posts = THIS_THREAD.getHpPosts();
        for (let i = 0; i < hp_posts.length; i++) {
            let hp_post = hp_posts[i];
            try {
                hp_post.addNoteUI(notebook);
            } catch (e) {
                // deleted post, simply pass it
                console.log("unable to parse the post, pass");
            }

        }



    }

    main();


})();