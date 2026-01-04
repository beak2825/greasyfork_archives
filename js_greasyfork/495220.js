// ==UserScript==
// @name         U2显示文件校验和
// @namespace    U2显示文件校验和
// @version      0.0.4
// @description  为文件列表添加校验和信息
// @author       kysdm
// @match        *://u2.dmhy.org/details.php?id=*
// @grant        none
// @license      MIT
// @icon         https://u2.dmhy.org/favicon.ico
// @require      https://unpkg.com/xhook@1.6.2/dist/xhook.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @downloadURL https://update.greasyfork.org/scripts/495220/U2%E6%98%BE%E7%A4%BA%E6%96%87%E4%BB%B6%E6%A0%A1%E9%AA%8C%E5%92%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/495220/U2%E6%98%BE%E7%A4%BA%E6%96%87%E4%BB%B6%E6%A0%A1%E9%AA%8C%E5%92%8C.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    xhook.before(async (request, callback) => {
        if (request.url.match(/viewfilelist\.php\?id=\d+/)) { await checkTorrentChecksum(); }
        callback();
    })

    xhook.after(function (request, response) {
        if (request.url.match(/viewfilelist\.php\?id=\d+/)) {
            if (torrent_checksum === 'null') return;
            const resp = response.text;
            const doc = $('<div></div>').html(resp);
            const f_ids = doc.find('[id^=f_id_]');
            const f_obj = new Object();
            const f_tmp = [];
            let f_id = '';

            f_ids.each(function () {
                const f_name = $(this).find('td').first().text();
                const f_name_trim = f_name.trimStart();
                const leadingSpaceCount = countLeadingSpaces(f_name);
                const _depth = leadingSpaceCount / 4;
                const f_depth = f_tmp.length - 1;

                if (_depth === f_depth + 1) {
                    // root
                } else if (_depth === f_depth) {
                    if (f_tmp.length !== 0) f_obj[f_tmp.join('/')] = f_id;
                    f_tmp.pop();
                } else {
                    f_obj[f_tmp.join('/')] = f_id;
                    f_tmp.splice(-(f_depth - _depth + 1));
                }

                f_tmp.push(f_name_trim);
                f_id = $(this).attr("id");
            });

            f_obj[f_tmp.join('/')] = f_id;

            if (torrent_checksum.length !== 0) {
                doc.append(`<style>.checksum { 
                    font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
                    text-align: center;
                    color: rgb(128, 128, 128);
                    border-left: none;
                    border-right: none;
                }</style>`);
                doc.find("td.rowfollow.dir_size").attr("colspan", "2");
                doc.find("tr:first").find("td.colhead:last").attr("colspan", "2");

                torrent_checksum[0].torrent_files_info.files.forEach(function (item) {
                    const path = item.path.split("/").slice(1).join("/");
                    const hash = item.hash;
                    const f_id = f_obj[path];
                    const td2 = doc.find(`#${f_id}`).find('td:last');
                    td2.css({ "border-left": "none" });
                    td2.before(`<td class="rowfollow checksum">&nbsp;${hash}&nbsp;</td>`)
                });
            }
            response.text = doc.html();
        }
    })

    var checkTorrentChecksumPromise, uid, tid, torrent_checksum;

    function checkTorrentChecksum() {
        return new Promise((resolve, reject) => {
            if (typeof torrent_checksum !== 'undefined') { resolve(); } else { checkTorrentChecksumPromise = resolve; }
        });
    }

    function assignTorrentChecksum() {
        if (checkTorrentChecksumPromise) checkTorrentChecksumPromise();
    }

    let em = /.*id=(?<tid>\d{3,5})/i.exec(location.search); if (em) tid = em.groups.tid; else tid = null; // 当前种子ID
    uid = $('#info_block').find('a:first').attr('href').match(/\.php\?id=(\d{3,5})/i) || ['', '']; if (uid[1] !== '') uid = uid[1]; // 当前用户ID
    const lang = new lang_init($('#locale_selection').val()); // 获取当前网页语言
    const db = localforage.createInstance({ name: "history" });
    const token = await db.getItem('token');
    if (token === null || token.length !== 96) { window.alert('未找到有效 API Token，将无法使用此脚本。') };

    torrent_checksum = await getApi(uid, token, tid);
    assignTorrentChecksum();

    if (torrent_checksum === 'null') {
        $("#closeall").after(`<span id="checksum">[校验和获取失败]</a></span>`);
        return;
    }

    if (torrent_checksum.length !== 0) {
        $("#closeall").after(`<span id="checksum"><a href="javascript:void(0)">[复制校验和]</a></span>`);

        const __checksum = [];
        torrent_checksum[0].torrent_files_info.files.forEach(function (item) { __checksum.push(`${item.hash} *${item.path}`); });

        $("#checksum").click(function () {
            navigator.clipboard.writeText(__checksum.join('\n')).then(() => {
                window.alert('成功')
            }).catch(() => {
                window.alert('失败 - 可能是你的浏览器太古老了')
            });
        });
    } else {
        $("#closeall").after(`<span id="checksum">[无校验和信息]</a></span>`);
    }

    if ($('#showfl').length === 0) {
        // 单文件种子
        const checksum = torrent_checksum.length !== 0 ? torrent_checksum[0].torrent_files_info.files[0].hash : '---';
        $(`td[class='rowhead nowrap']:contains('${lang['torrent_info']}')`).next('td').find('tr:first')
            .after(`<tr><td style="border: none;" colspan="4"><b>文件校验和:</b>&nbsp;${checksum}</td></tr>`);
        return;
    }

})();

async function getApi(uid, token, tid) {
    return new Promise(async (resolve) => {
        $.ajax({
            type: 'post',
            url: 'https://u2.kysdm.com/api/v1/torrent_checksum/',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({ "uid": uid, "token": token, "torrent_id": tid }),
            success: async function (d) {
                if (d.msg === 'success') {
                    return resolve(d.data.torrent);
                } else {
                    window.alert('checksum 获取失败')
                    return resolve('null');
                };
            },
            error: async function (d) {
                window.alert('checksum 获取失败')
                return resolve('null');
            },
        })
    })
};

function countLeadingSpaces(s) {
    return s.length - s.trimStart().length;
}

function lang_init(lang) {
    const lang_json = {
        "zh_CN": {
            "torrent_info": "种子信息",
        },
        "zh_TW": {
            "torrent_info": "種子訊息",
        },
        "zh_HK": {
            "torrent_info": "種子訊息",
        },
        "en_US": {
            "torrent_info": "Torrent Info",
        },
        "ru_RU": {
            "torrent_info": "Информация о торренте",
        }
    };
    return lang_json[lang];
};
