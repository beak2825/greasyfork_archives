// ==UserScript==
// @name         Download NetEase Music
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  进入网易歌单,下载该歌单内的所有歌曲
// @homepage     https://github.com/san-qi/TampermonkeyScript/tree/main/DownloadNeteaseMusic
// @author       san-qi
// @license      GPLv3
// @match        *://music.163.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/handsontable/8.3.2/handsontable.full.min.js
// @resource     https://cdn.bootcdn.net/ajax/libs/handsontable/8.3.2/handsontable.full.min.css
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.32/dist/sweetalert2.all.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451477/Download%20NetEase%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/451477/Download%20NetEase%20Music.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var ui = {
        get_messenger: function(){
            // Avoid multiple messages at the same time
            var shown_message = false;

            return (title, content = "<div id='netEaseMusicWrapper'></div>", icon = "success", width = "32em") => {
                if(shown_message == false){
                    shown_message = true;
                    Swal.fire({
                        icon: icon,
                        backdrop: `rgba(0,0,123,0.4)
                              url("/images/nyan-cat.gif")
                              left top
                              no-repeat`,
                        allowOutsideClick: false,
                        position: 'center',
                        width: width,
                        showConfirmButton: true,
                        title: title,
                        html: content
                    }).then(function(isConfirm){
                        shown_message = false;
                    });
                }else{
                    // console.log("message cannot be shown");
                }
            }
        },

        show_table: function(wrapper_id, data, col_width, merge_cells = undefined){
            if(data === undefined){
                return;
            }

            var wrapper = document.getElementById(wrapper_id);
            var wrapper_width = wrapper.clientWidth;
            var table = new Handsontable(
                wrapper,
                {
                    className: "htCenter htMiddle",
                    data: data,
                    colWidths: col_width.map(item => Math.ceil(item*wrapper_width)),
                    autoWrapRow: true,
                    autoColumnSize: true,
                    height: 'auto',
                    width: wrapper_width,
                    mergeCells: merge_cells,
                    licenseKey: 'non-commercial-and-evaluation'
                });
            // Set the table is read-only and unchecked
            table.updateSettings({readOnly: true, disableVisualSelection: true});
            table.render();
        }
    }
    var messenger = ui.get_messenger();

    var network = {
        // Gets all the song information under the playlist page
        get_playlist_info(){
            var doc = document.getElementById("g_iframe").contentDocument;
            var info = {"ids":[], "names":[]};
            var names = doc.querySelectorAll(".m-table tbody b");
            var singers = doc.querySelectorAll(".m-table tbody td:nth-child(4) span[title]");
            var ids = doc.querySelectorAll(".m-table tbody td:nth-child(1) span.ply");
            names.forEach((item, i) => info.names.push(item.title+' - '+singers[i].title));
            ids.forEach(item => info.ids.push(item.getAttribute("data-res-id")));

            return info;
        },

        // Start Download
        // TODO Resend on failed
        download(id, name, on_succeed, on_error, on_intercept){
            // Construct a URL request
            var url = "http://music.163.com/song/media/outer/url?id="+id+".mp3";

            return new Promise(
                (resolve, reject) =>
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    binary: true,
                    responseType: "blob",
                    onload: function(r) {
                        // Determine if there is a downloader blocker
                        if(r.status == 204){
                            reject();
                        }
                        // Determine whether the resource you are pointing to is correct
                        else if(r.response.type != "text/html;charset=utf8"){
                            // Gets the URL after the jump, i.e. finalUrl
                            resolve(r.finalUrl);
                        }
                        else{
                            reject("that song not found");
                        }
                    },
                    onerror: err => reject(err)
                })
            ).then(
                // Save the resource locally
                // NOTE: When 'then' is used consecutively, only the return of 'Promise' can call the 'resolve' and 'reject' operations in it
                target_url => new Promise(
                    (resolve, reject) =>
                    GM_download({
                        url: target_url,
                        name: name+".mp3",
                        // TODO Use parameter to judge
                        saveAs: false,
                        onload: res => resolve(name),
                        onerror: err => reject("network fluctuations")
                    })
                )
            ).then(
                // On succeed
                data => {
                    on_succeed(data);
                }
            ).catch(
                err => {
                    // On error
                    if(err){
                        on_error(err);
                    }
                    // When the request is blocked
                    else{
                        on_intercept();
                    }
                }
            );
        }
    }

    // Sort and group the content
    function sort_then_generate(failure, column){
        if(failure === undefined){
            return {};
        }
        failure.sort((a, b) => b.length - a.length);

        var result = {};
        const len = failure.length;
        const row = Math.ceil(len/column);
        result.row_num = row;
        result.column_num = Math.min(column, failure.length);

        // Set data
        result.data = [];
        // Set one more row to prevent the bottom from being obscured
        for(let _=0; _<=row; _++){
            result.data.push([]);
        };
        for(let i=0; i<len; ++i){
            result.data[i%row].push(failure[i]);
        };

        // Set the percentage of each column width
        result.colWidths = [];
        var colSumWidths = 0;
        for(let i=0; i<result.column_num; ++i){
            let length = result.data[0][i].length;
            colSumWidths += length;
            result.colWidths.push(length);
        }
        result.colWidths = result.colWidths.map(item => item/colSumWidths);

        return result;
    }

    function main(){
        var info = network.get_playlist_info();
        var ids = info.ids;
        var names = info.names;
        var success = [];
        var failure = [];

        var url = window.location.href;
        // When located on the playlist page
        if (/https?:\/\/music\.163\.com\/.*\/playlist\?id=\d*/i.test(url)){
            Promise.all(
                // Start the download of all songs
                ids.map((item, i) => {
                    // ‘Return’ must be added, otherwise it will be executed directly in the production process
                    // This results in The Promise::all fails
                    // This will bias the results of the statistics
                    return network.download(
                        item, names[i],
                        (data) => {
                            success.push(names[i]);
                        },
                        (err) => {
                            failure.push(names[i]);
                        },
                        () => {
                            messenger(
                                "下载失败",
                                "<div id='netEaseMusicWrapper'>请暂时关闭 IDM 等下载器的拦截权限<br>或将 'http://*.126.net/*.mp3' 加入到下载器白名单</div>",
                                "error"
                            );
                        },
                    );
                })
            ).then(
                // After all executions are completed, the resources that failed to download are counted
                () => {
                    // Pop-up prompts
                    messenger(
                        "共" + success.length + "首曲目下载成功; " + failure.length + "首下载失败",
                        '<div id="netEaseMusicWrapper"></div>',
                        "success",
                        "90%"
                    );

                    // TODO Use parameter to judge
                    const column_num = 3;
                    var result = sort_then_generate(failure, column_num);
                    // A pop-up window contains an inline table that displays the download failure
                    ui.show_table("netEaseMusicWrapper", result.data, result.colWidths);
                }
            );
        }
        // When located on the song page
        else if (/https?:\/\/music\.163\.com\/.*\/song\?id=\d*/i.test(url)){
            var doc = document.getElementById("g_iframe").contentDocument;
            var song = doc.querySelector("div.g-bd4.f-cb > div.g-mn4 > div > div > div.m-lycifo > div.f-cb > div.cnt > div.hd > div > em").innerText;
            var singer = doc.querySelector("div.g-bd4.f-cb > div.g-mn4 > div > div > div.m-lycifo > div.f-cb > div.cnt > p > span").title;
            var id = /song\?id=(\d*)/i.exec(window.location.hash)[1];
            network.download(
                id, song + " - " + singer,
                (data) => {
                    messenger("下载成功");
                },
                (err) => {
                    messenger(
                        "下载失败",
                        "<div id='netEaseMusicWrapper'>网络产生波动或该歌曲资源未找到</div>",
                        "warning"
                    );
                },
                () => {
                    messenger(
                        "下载失败",
                        "<div id='netEaseMusicWrapper'>请暂时关闭 IDM 等下载器的拦截权限<br>或将 'http://*.126.net/*.mp3' 加入到下载器白名单</div>",
                        "error"
                    );
                }
            );
        }
        // When located on a different page
        else{
            messenger(
                "当前页面不能执行该操作",
                "<div id='netEaseMusicWrapper'>请于歌单页面或单曲页面下执行操作</div>",
                "warning"
            );
        }
    }

    function init(){
        // Remove the limit on the number of tracks on a playlist page
        document.cookie="os=pc";
        // Perform a page refresh if and only if it is located on a playlist page
        if (/https?:\/\/music\.163\.com\/.*\/playlist\?id=\d*/i.test(window.location.href)){
            document.getElementById('g_iframe').contentWindow.location.reload(true);
        }
    }

    function tips(){
        messenger(
            "用前须知",
            "<div id='netEaseMusicWrapper'></div>",
            "question"
        );
        ui.show_table(
            "netEaseMusicWrapper",
            [
                ["1. ", "网易云网页版会有20首曲目的限制"],
                ["1. ", "当歌单显示不全时请点击该脚本的第二条选项"],
                ["1. ", "否则脚本只能下载歌单前20首曲目"],
                ["~~~", "~~~"],
                ["2. ", "若你PC上安装有IDM等下载器"],
                ["2. ", "请对 'http://*.126.net/*.mp3' 放行"],
                ["2. ", "否则通过IDM下载文件命名会乱码"],
                ["~~~", "~~~"],
                ["3. ", "点击 '获取' 进行下载"],
                ["3. ", "下载时间可能很长"],
                ["3. ", "请耐心等候"],
                ["~~~", "~~~"],
                ["Enjoy those song!", "Enjoy those song!"],
            ],
            [0.1, 0.9],
            [
                { row: 0, col: 0, rowspan: 3, colspan: 1 },
                { row: 3, col: 0, rowspan: 1, colspan: 2 },
                { row: 4, col: 0, rowspan: 3, colspan: 1 },
                { row: 7, col: 0, rowspan: 1, colspan: 2 },
                { row: 8, col: 0, rowspan: 3, colspan: 1 },
                { row: 11, col: 0, rowspan: 1, colspan: 2 },
                { row: 12, col: 0, rowspan: 1, colspan: 2 },
            ],
        );
    }

    GM_registerMenuCommand("用前须知", tips, "");
    GM_registerMenuCommand("解除限制", init, "");
    GM_registerMenuCommand("获取", main, "");
})();
