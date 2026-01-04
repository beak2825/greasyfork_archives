// ==UserScript==
// @name         LOC-MJJ笔记
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  来自地板带着爱，记录上网冲浪的美好瞬间
// @author       屋大维
// @license      MIT
// @match        https://hostloc.com/thread-*.html
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @icon         https://icons.iconarchive.com/icons/iconshock/real-vista-project-managment/64/task-notes-icon.png
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436875/LOC-MJJ%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436875/LOC-MJJ%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // CSS
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    GM_addStyle(".no-close .ui-dialog-titlebar-close{display:none}.ui-button .ui-icon{background-image: url(https://hostloc.com/static/image/common/cls.gif);margin:-10px 0 0 -10px;width:18px;height:18px} .ui-icon-closethick {background-position: 0 0;} textarea{height:100%;width:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}");

    // Your code here...
    // helpers
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    // classes
    class HpPost {
        constructor() {
        }

        getPostTid() {
            return location.href.match(/thread-(\d+)/) ? parseInt(location.href.match(/thread-(\d+)/)[1]) : -999;
        }

        getUserUid() {
            return parseInt($(".avt > a").attr("href").replace(/.html/ig, '').split("uid-")[1]);
        }

        getHpThreads() {
            let postTid = this.getPostTid();
            let divs = $('#postlist > div').get();
            return divs.map(d => new Hpthread(postTid, d));
        }

        addNoteManagementUI(_notebook) {
            var that = this;
            var button = htmlToElement(`
              <span><a id="noteButton_management" href="javascript:;" class="returnlist" title="MJJ笔记"></a></span>
            `);

            // create dialog
            let dialog = htmlToElement(`
              <div id="noteDialog_management" style="display: none;">
                <h3>LOC-MJJ笔记 v${GM_info.script.version}</h3>
                <p style="margin: 10px auto 10px auto;">来自地板带着爱</p>
                <p id="noteStat" style="margin: 10px auto 10px auto;"></p>
                <div>
                  <button id="noteButton_import">导入</button>
                  <button id="noteButton_export">导出</button>
                  <button id="noteButton_reset">重置</button>
                </div>
              </div>
            `);
            $("body").append(dialog);

            function updateNoteStat() {
                let note_stat = _notebook.getNotebookStat();
                $(`#noteStat`).text(`共${note_stat.note_number}条ID笔记，大小为${(note_stat.size_kb).toFixed(2)}KB`);
            }

            $(document).ready( function () {
                $(document).on ("click", "#noteButton_import", function() {
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
                        } catch(err) {
                            alert("格式错误！" + err);
                            return;
                        }
                        alert("导入成功！");
                    }
                });
                $(document).on ("click", "#noteButton_export", function() {
                    let r = confirm("确定要导出ID笔记吗？");
                    if (!r) {
                        return;
                    }
                    let a = document.createElement("a");
                    a.href = "data:text," + _notebook.exportNotebook();
                    a.download = "id笔记.json";
                    a.click();
                });
                $(document).on ("click", "#noteButton_reset", function() {
                    let r = confirm("确定要清空ID笔记吗？");
                    if (!r) {
                        return;
                    }
                    _notebook.resetNotebook();
                    alert("ID笔记已经清空！");
                    updateNoteStat();
                });
                $(document).on ("click", `#noteButton_management`, function () {
                    console.log("open notebook management dialog");
                    // update statistics
                    updateNoteStat();

                    $(`#noteDialog_management`).dialog({
                        title: "ID笔记：管理面板",
                        height: 200,
                        width: 300,
                        closeOnEscape: true,
                    });
                });
            });

            // add UI
            // let d = $("td.pls").last();
            let d = $("#scrolltop");
            d.append(button);

        }

    }

    class Hpthread {
        constructor(postTid, threadDiv) {
            this.postTid = postTid;
            this._thread_div = threadDiv;
        }

        getThreadAuthorName() {
            return $(this._thread_div).find("div.authi > a").first().text();
        }

        getThreadAuthorUid() {
            return parseInt($(this._thread_div).find("div.authi > a").first().attr("href").replace(/.html/ig, '').split("uid-")[1]);
        }

        getThreadPid() {
            return parseInt($(this._thread_div).attr("id").split("_")[1]);
        }

        getGotoUrl() {
            return `https://hostloc.com/forum.php?mod=redirect&goto=findpost&ptid=${this.postTid}&pid=${this.getThreadPid()}`;
        }

        getThreadContent() {
            // get text without quotes
            let t = $(this._thread_div).find("td.t_f").first().clone();
            t.find('.quote').replaceWith( "<p>【引用内容】</p>" );
            t.find('.t_attach').replaceWith( "<p>【附件】</p>" );
            t.find('img').remove();
            let text = t.text().replace(/\n+/g, "\n").trim();
            return text;
        }

        getThreadBrief(n) {
            let content = this.getThreadContent();
            if (content.length <= n) {
              return content;
            }
            return content.slice(0, n) + "\n\n【以上为截取片段】" ;
        }

        addNoteUI(_notebook) {
            let uid = this.getThreadAuthorUid();
            let index = $(this._thread_div).index();
            let userName = this.getThreadAuthorName();

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
            $(document).ready( function () {
                $(document).on ("click", `#noteButton_${index}`, function () {
                    console.log("open note for", userName);
                    // freshly fetched from DB
                    $(`#noteDialog_${index}`).find('textarea').first().val(_notebook.get(uid));
                    $(`#noteDialog_${index}`).dialog({
                        title: `ID笔记：${userName}`,
                        dialogClass: "no-close",
                        closeText: "hide",
                        closeOnEscape: true,
                        height: 350,
                        width: 600,
                        buttons: [
                            {
                                text: "记录下当前楼层",
                                click: function() {
                                    let txt = $(`#noteDialog_${index}`).find('textarea').first();
                                    var caretPos = txt[0].selectionStart;
                                    var textAreaTxt = txt.val();
                                    var txtToAdd = `====\n引用: ${that.getGotoUrl()}\n${that.getThreadAuthorName()} 说：${that.getThreadBrief(200)}\n====`;
                                    txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
                                }
                            },
                            {
                                text: "确认",
                                click: function() {
                                    // save the new note before close
                                    let newNote = $(`#noteDialog_${index}`).find('textarea').first().val();
                                    _notebook.put(uid, userName, newNote);
                                    $(this).dialog( "close" );
                                }
                            },
                            {
                                text: "取消",
                                click: function() {
                                    // close without saving
                                    $(this).dialog( "close" );
                                }
                            }
                        ]
                    });
                });
            });

            // add UI
            let d = $(this._thread_div).find("td[rowspan='2'].pls").first();
            d.append(button);
        }

    }

    class Notebook {
        constructor(user_uid) {
            // initialization
            this._name = "LOC-notebook";
            this._user_uid = user_uid;
            this._notebook = {};
            return (async () => {
                this.loadFromLocalStorage();
                return this;
            })();
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
        }

        put(uid, userName, note) {
            // we need userName here, so user can analyze notes even after export
            this._notebook[uid] = {uid, userName, note};
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

        exportNotebook() {
            // can add meta data here
            let output = {
                notebook: this._notebook,
                version: GM_info.script.version,
                timestamp: + new Date()
            };
            return JSON.stringify(output);
        }

        importNotebook(input) {
            let attrs = ['notebook', 'version', 'timestamp'];
            for (let i=0; i<attrs.length; i++) {
                if (!input.hasOwnProperty(attrs[i])) {
                    throw(`bad format: ${attrs[i]} does not exist`);
                }
            }
            this._notebook = {...input.notebook};
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
    }




    // get a post object

    var THIS_POST = new HpPost();

    // get tid and uid; uid for future extension
    var tid = THIS_POST.getPostTid();
    var uid = THIS_POST.getUserUid();


    var notebook = await new Notebook(uid);

    // render UI below
    // ID notes
    var hp_threads = THIS_POST.getHpThreads();
    for (let i=0; i<hp_threads.length; i++) {
        let hp_thread = hp_threads[i];
        try {
            hp_thread.addNoteUI(notebook);
        } catch(e) {
            // deleted thread, simply pass it
            console.log("unable to parse the thread, pass");
        }

    }
    // management panel
    THIS_POST.addNoteManagementUI(notebook);


})();