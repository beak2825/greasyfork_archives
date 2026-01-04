// ==UserScript==
// @name         115 网盘 SHA1 批量导出
// @version      1.0.4
// @description  从 115 网盘递归导出当前文件夹下所有文件的 SHA1 Hash 值，用于批量校验浏览器下载的文件完整性
// @author       FENGberd
// @match        https://115.com/?ct=file&ac=userfile*
// @namespace    https://greasyfork.org/en/scripts/400550-115-%E7%BD%91%E7%9B%98-sha1-%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/400550/115%20%E7%BD%91%E7%9B%98%20SHA1%20%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/400550/115%20%E7%BD%91%E7%9B%98%20SHA1%20%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    const $ = unsafeWindow.jQuery, TOP = unsafeWindow.TOP;

    const options = (function() {
        const opts = {
            format: 0,
        };
        try {
            return Object.assign(opts, JSON.parse(GM_getValue('options')) ?? {});
        } catch (e) {
            console.error(e);
        }
        return opts;
    })();

    function saveOptions() {
        GM_setValue('options', JSON.stringify(options));
    }

    function listFiles(cid, callback, prefix, result, pendingDirs) {
        pendingDirs.push(cid);

        TOP.Core.DataAccess.FileRead.GetFileList({
            aid: 1,
            cid,
            o: 'file_name',
            asc: '1',
            offset: '0',
            show_dir: 1,
            limit: '1150',
            code: '',
            scid: '',
            snap: 0,
            natsort: 1,
            record_open_time: 1,
            count_folders: 1,
            type: '',
        }, function ({ data }) {
            for (const item of data) {
                if (item.cid != cid) {
                    listFiles(item.cid, null, prefix + item.n + "/", result, pendingDirs);
                } else {
                    result[prefix + item.n] = item;
                }
            }
            pendingDirs.splice(pendingDirs.indexOf(cid), 1);

            if (!callback) {
                return;
            }
            const check = setInterval(function () {
                if (pendingDirs.length == 0) {
                    callback(result);
                    clearInterval(check);
                }
            }, 100);
        });
    }

    $(function () {
        const target = $('#js_filter_btn');
        if (!target.length) {
            return;
        }

        const a = $('<a href="javascript:;" class="button btn-line" hide_status="1"><i class="icon-operate ifo-prop"></i><span>导出 SHA1</span></a>');
        a.click(function () {
            listFiles(TOP.Main.GetCurWangPanCid(), function (data) {
                console.info(data);

                const content = $('<div class="dialog-input"><textarea id="result" rows="8"></textarea></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button btn-light" data-btn="switch-format">切换格式</a><a href="javascript:;" class="button btn-light" data-btn="copy">复制</a><a href="javascript:;" class="button" data-btn="close">关闭</a></div></div>'), textarea = content.find('#result');

                const update = () => textarea.val(Object.entries(data).map(([path, r]) => {
                    switch (options.format) {
                        case 0:
                            return `${r.sha} *${path}`;
                        case 1:
                            return `${r.sha}|${r.s}|${path}`;
                        case 2:
                            return `${r.sha}|${path}`;
                        case 3:
                            return `${r.sha} ${path}`;
                        case 4:
                            return `#SHA-1 *${r.sha} *${path}`;
                    }
                    return '未知格式';
                }).join('\n'));
                update();

                content.delegate("[data-btn]", "click", function () {
                    switch ($(this).attr("data-btn")) {
                        case "switch-format": {
                            if (++options.format > 4) {
                                options.format = 0;
                            }
                            saveOptions();

                            update();

                            let formatName = '未知格式';
                            switch (options.format) {
                                case 0:
                                    formatName = 'SHA1 *文件路径';
                                    break;
                                case 1:
                                    formatName = 'SHA1|文件大小|文件路径';
                                    break;
                                case 2:
                                    formatName = 'SHA1|文件路径';
                                    break;
                                case 3:
                                    formatName = 'SHA1 文件路径';
                                    break;
                                case 4:
                                    formatName = '#SHA-1 *SHA1 *文件路径';
                                    break;
                            }
                            TOP.Core.MinMessage.Show({
                                text: "当前格式<br/>" + formatName,
                                type: "suc",
                                timeout: 2000
                            });
                            break;
                        }
                        case "copy":
                            textarea[0].focus();
                            textarea[0].select();
                            console.info(TOP.document.execCommand('copy'));
                            break;
                        case "close":
                            _self.Close();
                            break;
                    }
                });
                const _self = new TOP.Core.DialogBase({ title: `SHA1 列表 (${Object.keys(data).length} 文件)`, content: content });
                _self.Open();
            }, '', [], []);
        });
        a.insertAfter(target[0]);
    });
})();
