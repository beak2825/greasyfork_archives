// ==UserScript==
// @name         音乐歌词下载助手
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  咪咕音乐，QQ音乐歌词下载
// @author       Gandalf_jiajun
// @include      https://music.migu.cn/*
// @include      https://y.qq.com/*
// @icon         chrome://favicon/http://music.migu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438255/%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438255/%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let _div = document.createElement('_div');
    // 定义主流听歌网站
    const musicWebArr = [
        { url: 'https://music.migu.cn/', name: 'migu' },
        { url: 'https://y.qq.com/', name: 'qq' }
    ];
    let webUrl_now = window.location.href;
    // 生成面板内容
    let key_select = `<span>关键词：</span><input id="key_input" style="width:100px" value="" />
    <button id="search_btn">搜索</button></br>
    <span>选择歌曲：</span>
    <select id="search_select">
        <option value="123" selected="selected">请先搜索歌曲</option>
    </select>
    <button id="download_btn">下载歌词</button>`
    _div.innerHTML = '<div style="margin-top:20px">' + key_select + '</div>';
    // 生成控制面板
    let _groot = document.getElementsByTagName('html')[0];
    _groot.style.position = 'relactive';
    _div.style.backgroundColor = '#ffeaa7';
    _div.style.width = '250px';
    _div.style.height = '100px';
    _div.style.borderTopRightRadius = '10px';
    _div.style.borderBottomRightRadius = '10px';
    _div.style.position = 'fixed';
    _div.style.top = '40%';
    _div.style.left = '-230px';
    _div.style.zIndex = '999999';
    _div.style.transitionDuration = '0.6s';
    _div.style.transitionTimingFunction = 'easy-in-out';
    _div.onmouseover = () => {
        _div.style.left = "0";
    }
    _div.onmouseout = () => {
        _div.style.left = '-230px';
    }
    // 插入控制面板
    _groot.appendChild(_div);
    let key_input = document.getElementById('key_input');
    let search_select = document.getElementById('search_select');
    // 封装Xml
    const request = (type, url, params) => {
        return new Promise((resolve, reject) => {
            let paramsStr = "?";
            const newXml = new XMLHttpRequest();
            type.toLowerCase() === 'post' ? newXml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') : '';
            if (Object.keys(params).length > 0) {
                const keys = Object.keys(params);
                const values = Object.values(params);
                keys.map((value, index) => {
                    paramsStr += value + "=" + values[index] + ((index + 1) < keys.length ? '&' : '');
                });
            }
            const newUrl = type.toLowerCase() === 'post' ? url : url + paramsStr;
            // 异步调用接口
            newXml.open(type, newUrl, true);
            type.toLowerCase() === 'post' ? newXml.send(paramsStr) : newXml.send();
            newXml.onreadystatechange = () => {
                if (newXml.readyState === 4 && newXml.status === 200) {
                    resolve(JSON.parse(newXml.responseText));
                }
            }
        })
    };
    // 下载文件方法
    const downLoadFile = (fileName, fileContent) => {
        const tag_a = document.createElement('a');
        const blob = new Blob([fileContent]);
        const objUrl = URL.createObjectURL(blob);
        tag_a.href = objUrl;
        tag_a.download = fileName;
        tag_a.click();
        URL.revokeObjectURL(objUrl);
    };
    // 获取网址明细
    const getWebDetail = () => {
        for (let i of musicWebArr) {
            if (webUrl_now.indexOf(i.url) !== -1) {
                return i.name
            }
        }
    };
    // base64解密
    const base64Decode = (encodeStr) => {
        return decodeURIComponent(atob(encodeStr).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
    };
    // 咪咕关键词搜索
    const getMiguSongsDetailBykey = () => {
        let keyword = key_input.value;
        request('get', '/v3/api/search/suggest', { keyword }).then((res) => {
            let songsDom = '';
            res.data.songs.map((value, index, arr) => {
                let { copyrightId, name, singerName } = value;
                const songsName = name + '-' + singerName;
                songsDom += "<option value=" + copyrightId + ">" + songsName + "</option>";
            });
            search_select.innerHTML = songsDom;
        });
    };
    // 咪咕下载歌词
    const getLyricByMigu = () => {
        //获取选中的下拉选项的index
        const index = search_select.selectedIndex;
        const copyrightId = search_select.options[index].value;
        const songsName = search_select.options[index].text;
        request('get', '/v3/api/music/audioPlayer/getLyric', { copyrightId }).then((res) => {
            // console.log(res.lyric);
            downLoadFile(songsName, res.lyric);
        })
    };
    // qq关键词搜索
    const getQQSongsDetailByKey = () => {
        let key = key_input.value;
        request('get', 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg', { key }).then((res) => {
            let songsDom = '';
            res.data.song.itemlist.map((value, index, arr) => {
                let { id, mid, name, singer } = value;
                const songsName = name + '-' + singer;
                const id_mid = id + '_' + mid;
                songsDom += "<option value=" + id_mid + ">" + songsName + "</option>";
            });
            search_select.innerHTML = songsDom;
        });
    };
    // qq下载歌词
    const getLyricByQQ = () => {
        const index = search_select.selectedIndex;
        const id_mid = search_select.options[index].value;
        const songsName = search_select.options[index].text;
        const [musicid, songmid] = id_mid.split('_');
        request(
            'get',
            'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
            { musicid, songmid, format: 'json' }
        ).then((res) => {
            // console.log(base64Decode(res.lyric));
            downLoadFile(songsName, base64Decode(res.lyric));
        })
    };
    // 搜索关键词
    document.getElementById('search_btn').onclick = () => {
        const webName = getWebDetail();
        switch (webName)
        {
            case 'migu': getMiguSongsDetailBykey();
            break;
            case 'qq': getQQSongsDetailByKey();
            break;
        }
    };
    // 根据下拉所选下载歌词
    document.getElementById('download_btn').onclick = () => {
        const webName = getWebDetail();
        switch (webName)
        {
            case 'migu': getLyricByMigu();
            break;
            case 'qq': getLyricByQQ();
            break;
        }
    };
})();