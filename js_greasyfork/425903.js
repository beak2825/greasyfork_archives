// ==UserScript==
// @name         iwara download
// @name:zh-CN   iwara 下载
// @description          Download videos from iwara.tv. NOTE: may need grant download privilege to browser extension like tampermonkey.
// @description:zh-CN    下载 iwara 视频。 注意：可能需要给 tampermonkey 等插件设置下载权限。
// @namespace    https://sleazyfork.org/zh-CN/scripts/425903-iwara-download
// @version      1.0.0
// @author       oajsdfk
// @match        https://*.iwara.tv/*
//
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/425903/iwara%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/425903/iwara%20download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!jQuery) { return; }

    const PARALLEL = 2;

    let downloaded_str = localStorage.getItem('downloaded');
    let downloaded = [];
    if (downloaded_str) {
        downloaded = downloaded_str.split(' ');
    }


    const is_downloaded = (id) => downloaded.indexOf(id) != -1;
    const add_downloaded = (id) => {
        if (is_downloaded(id)) return;
        let s = localStorage.getItem('downloaded');
        if (s != downloaded_str) {
            let n = s.indexOf(downloaded_str);
            if (n == 0) {
                let add = s.substr(downloaded_str.length + 1).split(' ');
                console.log("downloaded in other window:", add);
                downloaded.push(...add);
                downloaded_str = s;
            } else {
                s.split(' ').forEach((id) => {
                    if (is_downloaded(id)) return;
                    console.log("downloaded in other window:", id);
                    downloaded.push(id);
                    downloaded_str += ' ' + id;
                });
            }
        }
        if (is_downloaded(id)) return;
        downloaded.push(id);
        downloaded_str += ' ' + id;
        localStorage.setItem('downloaded', downloaded_str);
    };

    let downloading_str = '';
    let downloading = [];

    const remove_downloading = (vid) => {
        let n = downloading.indexOf(vid);
        if (n != -1) {
            downloading.splice(n, 1);
            downloading_str = downloading.join(' ');
            localStorage.setItem('downloading', downloading_str);
        }
    }

    const add_downloading = (vid) => {
        downloading.push(vid);
        downloading_str = downloading.join(' ');
        localStorage.setItem('downloading', downloading_str);
    }

    window.onstorage = (e) => {
        if (e.key == 'downloading') {
            downloading_str = e.newValue;
            downloading = downloading_str.split(' ');
            return;
        }
        if (e.key == 'downloaded') {
            let s = e.newValue;
            if (s != downloaded_str) {
                let n = s.indexOf(downloaded_str);
                if (n == 0) {
                    let add = s.substr(downloaded_str.length + 1).split(' ');
                    console.log("downloaded in other window:", add);
                    downloaded.push(...add);
                    downloaded_str = s;
                } else {
                    s.split(' ').forEach((id) => {
                        if (is_downloaded(id)) return;
                        console.log("downloaded in other window:", id);
                        downloaded.push(id);
                        downloaded_str += ' ' + id;
                    });
                    localStorage.setItem('downloaded', downloaded_str);
                }
            }
            return;
        }
    };

    var $ = jQuery.noConflict();

    var view_page = window.location.pathname.startsWith('/videos/')

    function fname(str) {
        return str.replace(/\\/g, '￥')
            .replace(/\//g, '／')
            .replace(/:/g, '：')
            .replace(/\*/g, '＊')
            .replace(/\?/g, '？')
            .replace(/"/g, '”')
            .replace(/</g, '＜')
            .replace(/>/g, '＞')
            .replace(/\|/g, '｜')
            .replace(/\t/g, '　')
            .replace(/~/g, '～');
    };


    $('.node-video').append('<input type="checkbox" class="dl_chk" checked/>');

    $('body').append(`<style>
#dlboxs input {
    background-color: transparent;
    padding: 0px;
    margin: 0px;
    border: 0px;
}

#dlboxs input:hover {
    background-color: limegreen;
    border: 1px;
}
</style><div id="dlboxs" style="position: fixed; left: 0px; bottom: 0px; z-index: 500; background-color:transparent;">
    <input id="set_downloaded" type="button" value="⚐"
        title="标记所选已被下载"> <input id="sel_dl_all" type="button" value="◼"
        title="全选"><input id="sel_dl_invert" type="button" value="⬗" title="反选"><input
        id="sel_dl_none" type="button" value="◻" title="空选"> <input id="download" type="button"
        value=" ⭳ " title="下载所选">
</div>`)
    $('#sel_dl_all').on('click', function (e) {
        $('.dl_chk:enabled').each(function () {
            this.checked = true;
        });
    });
    $('#sel_dl_invert').on('click', function (e) {
        $('.dl_chk:enabled').each(function () {
            this.checked = !this.checked;
        });
    });
    $('#sel_dl_none').on('click', function (e) {
        $('.dl_chk:enabled').each(function () {
            this.checked = false;
        });
    });

    $('#set_downloaded').on('click', function (e) {
        let vs = $('.node-video').has('.dl_chk:checked:enabled');
        //console.log("set_downloaded:", vs)

        if (vs.length === 0) { return; }

        vs.toArray().forEach(v => {
            let video = $(v)

            let b = parse_video(video)
            if (!b) return null
            let [like, view, vid, title, user] = b

            console.log('add_downloaded:', '♥' + like + ' 👁' + view + ' ' + user + '/' + title + ' [' + vid + ']');

            add_downloaded(vid)
            set_downloaded(video)
        })
    });


    function set_downloaded(video) {
        if (!view_page) {
            let i = video.find('.dl_chk');
            i.attr('disabled', true);
            i.removeClass('dl_chk');
        } else {
            $('#download').attr('disabled', true);
        }
    };

    function check_downloaded() {
        let vs = $('.node-video')//.has('.dl_chk:checked:enabled');

        if (vs.length === 0) { return; }

        $(this).val('checking');

        vs.toArray().forEach(v => {
            let video = $(v)
            let b = parse_video(video)
            if (!b) return null
            let [like, view, vid, title, user] = b

            if (is_downloaded(vid)) {
                set_downloaded(video)
                return;
            }

            if (downloading.indexOf(vid) != -1) {
                set_downloaded(video)
                return;
            }

            //console.log('check_downloaded:', '♥' + like + ' 👁' + view + ' ' + user + '/' + title + ' [' + vid + ']');
        })
    }
    check_downloaded()

    $('#download').on('click', function () {
        if (view_page) {
            download();
            return;
        }

        let checked = $('.node-video').has('.dl_chk:checked:enabled');
        if (checked.length === 0) return;

        async_pool(checked.toArray().map(v => $(v)), download, PARALLEL);
    });

    function parse_video(video) {
        let like;
        let view;
        let vid;
        let title;
        let user;
        if (!view_page) {
            let t = video.find('.field-item > a');
            if (t) {
                let href = t.attr('href')
                if (!href) return null
                vid = href.replace('/videos/', '');

                t = t.find('img')
                title = t.attr('title') || t.attr('title');
            }

            if (!title || !vid) {
                t = video.find('.title > a');
                vid = t.attr('href').replace('/videos/', '');
                title = t.text();
            }

            like = video.find('.likes-icon').has('.glyphicon-heart').text().trim();
            view = video.find('.likes-icon').has('.glyphicon-eye-open').text().trim();
            user = video.find('.username').text();
        } else {
            vid = window.location.pathname.replace('/videos/', '');
            title = $('.node-info').find('.title').text();
            let t = $('.node-views').has('.glyphicon-heart').has('.glyphicon-eye-open').text().trim().split(/\s+/);
            like = t[0];
            view = t[1];
            user = $('.node-info').find('.username').text();
        }

        if (user.endsWith('.')) {
            let n = user.replace(/\.$/, '_');
            console.log("rename user:", user, n)
            user = n
        }

        //console.log('download:', '♥' + like + ' 👁' + view + ' ' + user + '/' + title + ' [' + vid + ']');
        return [like, view, vid, title, user]
    }

    async function download(video) {
        let b = parse_video(video)
        if (!b) return null
        let [like, view, vid, title, user] = b

        console.log('download:', '♥' + like + ' 👁' + view + ' ' + user + '/' + title + ' [' + vid + ']');

        let filename = fname(user) + '/' + fname(title) + ' [' + vid + ']';

        if (is_downloaded(vid)) {
            console.log('already downloaded suc:', filename);
            set_downloaded(video);
            return;
        }

        if (downloading.indexOf(vid) != -1) {
            console.log(vid, 'is downloading');
            return;
        }

        add_downloading(vid);

        return new Promise((resolve, reject) => {

            $.get('/api/video/' + vid, function (res) {
                if (res[0]) {
                    console.log(vid, "urls: ", res[0]);
                    let t = res[0].mime.split('/');
                    let f = filename + '.' + t[t.length - 1];

                    let url = 'https:' + res[0].uri;
                    console.log('downloading file:', f, 'url:', url);

                    GM_download({
                        url: url,
                        name: 'iwara/' + f,
                        onload: () => {
                            console.log('download suc:', f);
                            set_downloaded(video);
                            add_downloaded(vid);
                            resolve();
                        },
                        onprogress: (e) => {
                            let v = e.loaded / e.total * 100;
                            console.log('downloading:', f, e, v + '%');
                        },
                        onerror: (e) => {
                            console.error('download failed:', f, e);
                            remove_downloading(vid);
                            reject(e);
                        },
                        ontimeout: (e) => {
                            console.error('download timeout:', f, e);
                            remove_downloading(vid);
                            reject(e);
                        },
                        saveAs: false
                    });

                } else {
                    console.error("no video:", vid);
                    remove_downloading(vid);
                    reject("no video");
                }
            }, 'JSON').fail(function (err) {
                console.error("get_url_failed", vid, err);
                remove_downloading(vid);
                reject(err);
            });

        });
    }

    async function async_pool(args, fn, limit) {
        return new Promise((resolve) => {
            const argQueue = [...args].reverse();
            let count = 0;
            const outs = [];
            const pollNext = () => {
                if (argQueue.length === 0 && count === 0) {
                    resolve(outs);
                } else {
                    while (count < limit && argQueue.length) {
                        const index = args.length - argQueue.length;
                        const arg = argQueue.pop();
                        count += 1;
                        const out = fn(arg);
                        const processOut = (out, index) => {
                            outs[index] = out;
                            count -= 1;
                            pollNext();
                        };
                        if (typeof out === 'object' && out.then && out.then) {
                            out.then(out => processOut({ status: 'fulfilled', value: out }, index))
                                .catch(err => processOut({ status: 'rejected', reason: err }, index));
                        } else {
                            processOut(out, index);
                        }
                    }
                }
            };
            pollNext();
        });
    }
})();