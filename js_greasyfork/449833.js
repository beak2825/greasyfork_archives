// ==UserScript==
// @name         酷狗在线听/下载/vip/2024
// @namespace    http://tampermonkey.net/
// @version      2.0
// @icon         https://i0.hdslb.com/bfs/album/0d58ba3462659867aa46633d4a4791e93160ffb5.jpg
// @description  无需登录在线听你想听的音乐
// @author       今天是充满希望的一天
// @match        *://www.kugou.com/mixsong/*
// @match        *://www.kugou.com/song/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @require      https://unpkg.com/nprogress@0.2.0/nprogress.js
// @resource css https://cdn.bootcdn.net/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css
// @connect      1.94.43.52
// @connect      m.kugou.com
// @downloadURL https://update.greasyfork.org/scripts/449833/%E9%85%B7%E7%8B%97%E5%9C%A8%E7%BA%BF%E5%90%AC%E4%B8%8B%E8%BD%BDvip2024.user.js
// @updateURL https://update.greasyfork.org/scripts/449833/%E9%85%B7%E7%8B%97%E5%9C%A8%E7%BA%BF%E5%90%AC%E4%B8%8B%E8%BD%BDvip2024.meta.js
// ==/UserScript==
console.log("==================================插件启动成功==================================")
// 2022-12-20新增批量下载，以及部分功能的优化
let loc = location.href;
var mp3_Name = "";
var download_hash = "";
var download_hash_list = "0";
var mp3_ecid = "";
var mp3_ecid_download = "";
if (loc.indexOf("www.kugou.com/song/") > 0 || loc.indexOf("www.kugou.com/mixsong/") > 0) {
    // 定义变量
    let mp3_Hash = "";
    let sq_hash = "";
    let g_hash = "";
    let albumid = "";
    // 当前播放的最高音质url
    let mp3_Url = "";

    // 删除加载客户端弹窗
    let close_div = document.getElementsByClassName("ui-dialog-grid")[0];
    if (close_div != undefined){
        close_div.style.display = "none"
    }

    // 添加按钮选择音质
    let down_load_div = document.getElementsByClassName("btnArea2 clearfix")[0];
    down_load_div.innerHTML = "";
   /**
    // 超高音质
    let button_ws = document.createElement("button");
    button_ws.id = "down_load_ws";
    button_ws.textContent = "下载超高音质(需设置flac为白名单)";
    button_ws.style.width = "230px";
    button_ws.style.height = "50px";
    button_ws.style.color = "#FFFFFF";
    button_ws.style.cursor = "pointer";
    button_ws.style.background = "#000000";
    down_load_div.appendChild(button_ws);
    $('#down_load_ws').hover(function () {
        $(this).css('background', '#232020')
        $(this).css('color', '#BCBBBB')
    }, function () {
        $(this).css('background', '#000000')
        $(this).css('color', '#FFFFFF')
    })
    // 高音质
    let button_g = document.createElement("button");
    button_g.id = "button_g";
    button_g.textContent = "下载高音质";
    button_g.style.width = "230px";
    button_g.style.height = "50px";
    button_g.style.color = "#FFFFFF";
    button_g.style.cursor = "pointer";
    button_g.style.background = "#000000";
    button_g.style.margin = "3px 0px";
    down_load_div.appendChild(button_g);
    $('#button_g').hover(function () {
        $(this).css('background', '#232020')
        $(this).css('color', '#BCBBBB')
    }, function () {
        $(this).css('background', '#000000')
        $(this).css('color', '#FFFFFF')
    })
    */
    // 普通音质
    let button_mp3 = document.createElement("button");
    button_mp3.id = "button_mp3";
    button_mp3.textContent = "下载普通音质";
    button_mp3.style.width = "230px";
    button_mp3.style.height = "50px";
    button_mp3.style.color = "#FFFFFF";
    button_mp3.style.cursor = "pointer";
    button_mp3.style.background = "#000000";
    down_load_div.appendChild(button_mp3);
    $('#button_mp3').hover(function () {
        $(this).css('background', '#232020')
        $(this).css('color', '#BCBBBB')
    }, function () {
        $(this).css('background', '#000000')
        $(this).css('color', '#FFFFFF')
    })


    // 点击下载按钮 超高音质
    // button_ws.onclick = function () {
    //     if (sq_hash == download_hash) {
    //         alert(mp3_Name + " 已在下载中！")
    //     } else {
    //         download_hash = sq_hash;
    //         downloadBySrc(mp3_Url,0);
    //     }
    // };
    // // 点击下载按钮 高音质
    // button_g.onclick = function () {
    //     if (g_hash == download_hash) {
    //         alert(mp3_Name + " 已在下载中！");
    //     } else {
    //         download_hash = g_hash;
    //         getMp3UrlSrc(g_hash, albumid, 0);
    //     }
    // };
    // 点击下载按钮 普通音质
    button_mp3.onclick = function () {
        // if (mp3_Hash == download_hash) {
        //     alert(mp3_Name + " 已在下载中！");
        // } else {
        //     download_hash = mp3_Hash;
        //     getMp3UrlSrc(mp3_Hash, albumid, 0);
        // }
        if (mp3_ecid == mp3_ecid_download) {
            alert(mp3_Name + " 已在下载中！");
        } else {
            mp3_ecid_download = mp3_ecid;
            getMp3UrlSrcVip();
        }

        // getMp3UrlSrc(mp3_Hash, albumid, 0);
    };

    // // 点击下载按钮 超高音质
    // document.getElementById('pb_download').onclick = function () {
    //     if (download_url == mp3_Url) {
    //         alert(mp3_Name + " 已在下载中！")
    //     } else {
    //         downloadBySrc(mp3_Url);
    //         setTimeout(function () {
    //             document.getElementsByClassName('ui-popup ui-popup-show ui-popup-focus')[0].style.display = "none"
    //         }, 50)
    //     }
    // };
    // 监听audio开始播放事件(事件在视频/音频（audio/video）开始播放时触发。)
    document.getElementById('myAudio').addEventListener("play", function () {
        let mp3_ecid_new = document.getElementById('myAudio').getAttribute("data-ecid");
        if (mp3_ecid != mp3_ecid_new){
            mp3_ecid = mp3_ecid_new;
        /**
        // 判断是否需要修改src属性
        if (document.getElementById('myAudio').getAttribute("data-hash") != mp3_Hash) {
            mp3_Hash = document.getElementById('myAudio').getAttribute("data-hash");
            let play_hash = mp3_Hash;
            let searchQualityUrl = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + play_hash;
            // 查询音质
            GM_xmlhttpRequest({
                method: "get",
                url: searchQualityUrl,
                onload: function (r) {
                    let jsonTxt = r.responseText;
                    let json = JSON.parse(jsonTxt);
                    albumid = json.albumid.toString();
                    g_hash = json.extra['320hash'];
                    if (g_hash == '') {
                        button_g.style.display = 'none';
                    } else {
                        button_g.style.display = 'block';
                        play_hash = g_hash;
                    }
                    sq_hash = json.extra.sqhash;
                    if (sq_hash == '') {
                        button_ws.style.display = 'none';
                    } else {
                        button_ws.style.display = 'block';
                        play_hash = sq_hash;
                    }
                    // 访问第三方解析无损接口
                    let get_sq_url = "https://xxxxx.xxx/api/tampermonkey/url/byhash?hash=" + play_hash + "&albumid=" + albumid;
                    console.log(get_sq_url);
                    // get请求获取无损音质的信息
                    GM_xmlhttpRequest({
                        method: "get",
                        url: get_sq_url,
                        onload: function (r) {
                            let jsonTxt = r.responseText;
                            let json = JSON.parse(jsonTxt);
                            mp3_Url = json.data.play_url;
                            mp3_Name = json.data.audio_name;
                            document.getElementById('myAudio').src = mp3_Url;
                            //document.getElementById('openKugou').href = mp3_Url;
                            if (document.getElementById('myAudio').paused) {
                                document.getElementById('myAudio').play();
                            }
                            console.log(mp3_Name + mp3_Url.substr(mp3_Url.lastIndexOf(".")) + "   加载完成");
                        }
                    })
                }
            })
        }
        */
         // 访问第三方解析接口
                    let get_sq_url = "http://1.94.43.52:5001//url/newVip?ecid=" + mp3_ecid;
                    console.log(get_sq_url);
                    // get请求获取音乐的信息
                    GM_xmlhttpRequest({
                        method: "get",
                        url: get_sq_url,
                        onload: function (r) {
                            let jsonTxt = r.responseText;
                            let json = JSON.parse(jsonTxt);
                            mp3_Url = json.data.play_url;
                            mp3_Name = json.data.audio_name;
                            document.getElementById('myAudio').src = mp3_Url;
                            //document.getElementById('openKugou').href = mp3_Url;
                            if (document.getElementById('myAudio').paused) {
                                document.getElementById('myAudio').play();
                            }
                            console.log(mp3_Name + mp3_Url.substr(mp3_Url.lastIndexOf(".")) + "   加载完成");
                        }
                    })
                }
    })
    // 直接用最暴力的方法，修改id
    document.getElementById("bar").id = 'new_bar';
    $("#new_bar").off("click").on("click", function(e) {
        let new_pre = e.offsetX / $("#progress_middle").width();
        document.getElementById('myAudio').currentTime = myAudio.duration * new_pre;
    });
} else if (loc.indexOf("/yy/rank/") > 0 || loc.indexOf("/yy/html/rank.html") > 0) {
    let download_div = document.getElementById("pc_temp_title");

    document.getElementsByClassName("pc_temp_btn_s02 pc_temp_bicon_play")[0].style.marginTop = "0px";
    $(".pc_rank_title .pc_temp_title").css("font-size", "12px");
    let form = document.createElement("form");
    let radio_sq = document.createElement("input");
    radio_sq.type = "radio";
    radio_sq.name = "choose_q";
    radio_sq.value = "0";
    radio_sq.style.marginLeft = "15px";
    let radio_sq_label = document.createElement('label');
    radio_sq_label.textContent = "超高音质";
    radio_sq_label.id = "radio_sq_label";
    radio_sq.style.cursor = "pointer";
    radio_sq_label.style.cursor = "pointer";
    let radio_g = document.createElement("input");
    radio_g.type = "radio";
    radio_g.name = "choose_q";
    radio_g.value = "1";
    radio_g.style.marginLeft = "15px";
    let radio_g_label = document.createElement('label');
    radio_g_label.textContent = "高音质";
    radio_g_label.id = "radio_g_label";
    radio_g.style.cursor = "pointer";
    radio_g_label.style.cursor = "pointer";
    let radio_d = document.createElement("input");
    radio_d.type = "radio";
    radio_d.name = "choose_q";
    radio_d.value = "2";
    radio_d.style.marginLeft = "15px";
    radio_d.defaultChecked = true;
    let radio_d_label = document.createElement('label');
    radio_d_label.textContent = "标准音质";
    radio_d_label.id = "radio_d_label";
    radio_d.style.cursor = "pointer";
    radio_d_label.style.cursor = "pointer";
    form.style.display = "inline";
    form.appendChild(radio_sq);
    form.appendChild(radio_sq_label);
    form.appendChild(radio_g);
    form.appendChild(radio_g_label);
    form.appendChild(radio_d);
    form.appendChild(radio_d_label);
    download_div.appendChild(form);
    // 点击label，模拟点击对应的radio
    $("#radio_sq_label").click(function () {
        $('[name="choose_q"]').eq(0).trigger("click");
    })
    $("#radio_g_label").click(function () {
        $('[name="choose_q"]').eq(1).trigger("click");
    })
    $("#radio_d_label").click(function () {
        $('[name="choose_q"]').eq(2).trigger("click");
    })
    // 下载所选按钮
    let download_button = document.createElement("button");
    download_button.id = "download_select";
    download_button.textContent = "下载所选音乐";
    download_button.style.width = "100px";
    download_button.style.height = "34px";
    download_button.style.color = "#fff";
    download_button.style.cursor = "pointer";
    download_button.style.background = "#169af3";
    download_button.style.marginLeft = "20px";
    download_div.appendChild(download_button);
    $('#download_select').hover(function () {
        $(this).css('background', '#158fe1')
    }, function () {
        $(this).css('background', '#169af3')
    })

    $('#download_select').click(function () {
        if (download_hash_list == "1") {
            alert("正在下载中，请稍后，如长时间无反应，请刷新后重试！");
            return;
        }
        download_hash_list = "1";
        // 全选
        if ($('.checkedAll').attr("class").indexOf("pc_temp_btn_checked") > 0) {
            $.confirm({
                title: '下载提示',
                content: '你确定要下载所有选中的音乐吗？',
                type: 'green',
                icon: 'glyphicon glyphicon-question-sign',
                buttons: {
                    ok: {
                        text: '确认',
                        btnClass: 'btn-primary',
                        action: function () {
                            global.features.forEach(function (song, index) {
                                if ($('[name="choose_q"]:checked').val() == 0) {
                                    // 使用同步方式
                                    (async function () {
                                        let sqhash = await getSqHashOrGHash(song.Hash, "sqhash");
                                        getMp3UrlSrc(sqhash, song.album_id, song.FileName);
                                    })()
                                } else if ($('[name="choose_q"]:checked').val() == 1) {
                                    (async function () {
                                        let ghash = await getSqHashOrGHash(song.Hash, '320hash');
                                        getMp3UrlSrc(ghash, song.album_id, song.FileName);
                                    })()
                                } else {
                                    getMp3UrlSrc(song.Hash, song.album_id, song.FileName);
                                }
                            })
                        }
                    },
                    cancel: {
                        text: '取消',
                        btnClass: 'btn-primary',
                        action: function() {
                            download_hash_list = "0";
                        }
                    }
                }
            })
        } else {
            $.confirm({
                title: '下载提示',
                content: '你确定要下载所有选中的音乐吗？',
                type: 'green',
                icon: 'glyphicon glyphicon-question-sign',
                buttons: {
                    ok: {
                        text: '确认',
                        btnClass: 'btn-primary',
                        action: function () {
                            // 获取选中的
                            $('.pc_temp_btn_checked').each(function () {
                                let song_index = $(this).attr("data-index");
                                let song = global.features[song_index];
                                mp3_Name = song.FileName;
                                if ($('[name="choose_q"]:checked').val() == 0) {
                                    // 使用同步方式
                                    (async function () {
                                        let sqhash = await getSqHashOrGHash(song.Hash, "sqhash");
                                        getMp3UrlSrc(sqhash, song.album_id, song.FileName);
                                    })()
                                } else if ($('[name="choose_q"]:checked').val() == 1) {
                                    (async function () {
                                        let ghash = await getSqHashOrGHash(song.Hash, '320hash');
                                        getMp3UrlSrc(ghash, song.album_id, song.FileName);
                                    })()
                                } else {
                                    // setTimeout(function () { getMp3UrlSrc(song.Hash, song.album_id, song.FileName); }, 5000);
                                    getMp3UrlSrc(song.Hash, song.album_id, song.FileName);
                                }
                            });
                        }
                    },
                    cancel: {
                        text: '取消',
                        btnClass: 'btn-primary',
                        action: function() {
                            download_hash_list = "0";
                        }
                    }
                }
            })
        }
        setTimeout(function () { download_hash_list = "0"; }, 5000);
    })

}

// 获取高音质或者超高音质的hash
function getSqHashOrGHash(hash, quality) {
    let searchQualityUrl = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + hash;
    let quality_hash = "";
    // 查询音质
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "get",
            url: searchQualityUrl,
            onload: function (r) {
                let jsonTxt = r.responseText;
                let json = JSON.parse(jsonTxt);
                quality_hash = json.extra[quality];
                if (quality_hash == "" && quality == "sqhash") {
                    quality_hash = json.extra['320hash'];
                }
                if (quality_hash == "") {
                    quality_hash = hash;
                }
                // 返回的值，quality_hash
                resolve(quality_hash);
            }
        })
    })
}

// 获取高音质或者普通音质的MP3地址并且下载
function getMp3UrlSrcVip() {

    downloadBySrc(document.getElementById('myAudio').src, document.getElementsByClassName("audioName")[0].title);
    // let get_url = "http://xx.xxx/api/tampermonkey/url/byhash?hash=" + d_hash + "&albumid=" + albumid;
    // GM_xmlhttpRequest({
    //     method: "get",
    //     url: get_url,
    //     onload: function (r) {
    //         let jsonTxt = r.responseText;
    //         let json = JSON.parse(jsonTxt);
    //         downloadBySrc(json.data.play_url, file_name);
    //     }
    // })
    mp3_ecid_download = ""
}

// 获取高音质或者普通音质的MP3地址并且下载   此方法不再用了
function getMp3UrlSrc(d_hash, albumid, file_name) {
    let get_url = "http://xxx.xxx/api/tampermonkey/url/byhash?hash=" + d_hash + "&albumid=" + albumid;
    GM_xmlhttpRequest({
        method: "get",
        url: get_url,
        onload: function (r) {
            let jsonTxt = r.responseText;
            let json = JSON.parse(jsonTxt);
            downloadBySrc(json.data.play_url, file_name);
        }
    })
}

// 点击下载 by url
function downloadBySrc(download_url_quality, file_name) {
    let down_name = file_name != 0 ? file_name : mp3_Name;
    let download_url = download_url_quality;
    let loaded = 0.0;
    NProgress.set(0.0);
    GM_download({
        url: download_url,
        name: down_name + download_url.substr(download_url.lastIndexOf(".")),
        saveAs: true,
        onerror: function (error) {
            //如果下载最终出现错误，则要执行的回调
            console.log(error)
            console.log(down_name + "  下载报错，请反馈！");
        },
        onprogress: (pro) => {
            //如果此下载取得了一些进展，则要执行的回调
            // console.log(pro.loaded) //文件加载量
            // console.log(pro.totalSize) //文件总大小
            let size = (pro.loaded / pro.totalSize).toFixed(1);
            if (loaded != size) {
                loaded = size;
                NProgress.inc(0.1);
            }
        },
        ontimeout: () => {
            //如果此下载由于超时而失败，则要执行的回调
            console.log(down_name + "下载超时，请反馈！");
        },
        onload: () => {
            //如果此下载完成，则要执行的回调
            console.log(down_name + "   下载完成！");
            download_hash = "";
            NProgress.done();
        }
    })
}
GM_addStyle(GM_getResourceText("css"));
//========================================= nprogress.min.css
GM_addStyle(`
#nprogress{pointer-events:none}#nprogress .bar{background:#f90;position:fixed;z-index:1031;top:0;left:0;width:100%;height:5px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;box-shadow:0 0 10px #f90,0 0 5px #f90;opacity:1;-webkit-transform:rotate(3deg) translate(0,-4px);-ms-transform:rotate(3deg) translate(0,-4px);transform:rotate(3deg) translate(0,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:#f90;border-left-color:#f90;border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
`);
//=========================================jq的confirm
GM_addStyle(`
.jconfirm-box-container .jconfirm-box{width: 281px;}
`);