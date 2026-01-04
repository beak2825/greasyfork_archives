// ==UserScript==
// @name         克拉TV(哈哩哈哩)_视频观看进度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  克拉TV_视频观看进度
// @author       You
// @match        https://www.kelatv.com/play/*.html
// @match        https://www.kelatv.com/detail/*.html
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.staticfile.org/axios/1.2.2/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/457447/%E5%85%8B%E6%8B%89TV%28%E5%93%88%E5%93%A9%E5%93%88%E5%93%A9%29_%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/457447/%E5%85%8B%E6%8B%89TV%28%E5%93%88%E5%93%A9%E5%93%88%E5%93%A9%29_%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==



// match        https://www.kelatv.com/api/haliapi.php*
(function () {
    'use strict';
    GM_addStyle(`
    .record-table {
        border: 4px solid #000;
        position: fixed;
        left: 0;
        top: 50%;
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        padding: 20px;
        line-height: 30px;
        font-size: 20px;
        z-index: 999;
        transition: all .4s;
        transform: translate3d(-90%,-50%,0);
    }
    .record-table:hover {
        transform: translate3d(0,-50%,0);
    }
    .record-table td {
        padding: 15px;
        border: 2px solid #000;
    }
    .show-class-name {
        position: fixed;
        left: 10px;
        top: 20px;
        background: #fff;
        border: 2px solid #ccc;
        color: #333;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        padding: 20px;
        line-height: 30px;
        font-size: 20px;
        min-width: 200px;
        min-height: 100px;
        z-index: 9999;
    }
    `)
    function loadData () {
        var d = GM_getValue('data', []);
        setTimeout(function () {
            axios.get('https://gitee.com/api/v5/gists/953tsm7e1qk4rcbxpv80w90?access_token=d813019bce8bf479472b058af251e5ae').then(function (response) {
                const gist = response.data
                const content = gist.files['kelatv_video_view_progress.json'].content
                data = JSON.parse(content);
                renderTable();
            })
        }, 1000)
        return d
    }
    var data = loadData()
    function saveData () {
        GM_setValue('data', data);
        axios.patch('https://gitee.com/api/v5/gists/953tsm7e1qk4rcbxpv80w90', {
            access_token: 'd813019bce8bf479472b058af251e5ae',
            files:{
                'kelatv_video_view_progress.json': {
                    content: JSON.stringify(data, null, 2)
                }
            }
        })
    }
    var table = document.createElement('table');
    var player = null
    table.className = 'record-table';
    document.body.appendChild(table);
    renderTable();
    setTimeout(function () {
        var saveBtn = document.getElementById('save-btn');
        saveBtn.addEventListener('click', save);
        table.addEventListener('click', function (evt) {
            var el = evt.target
            var isRemove = el.className === 'remove-btn'
            if (isRemove) {
                var i = parseInt(el.dataset.i);
                data.splice(i, 1)
                renderTable()
                saveData()
            }
        });

        table.addEventListener('change', function (evt) {
            var el = evt.target
            if (el.className==='jump-top') {
                let second = parseInt(el.value)
                let i = parseInt(el.dataset.i);
                let row = data[i]
                row['_跳过片头'] = isNaN(second) ? 0 : second;
                saveData()
            }
            if (el.className==='jump-end') {
                let second = parseInt(el.value)
                let i = parseInt(el.dataset.i);
                let row = data[i]
                row['_跳过片尾'] = isNaN(second) ? 0 : second;
                saveData()
            }
            if (el.className==='play-speed') {
                var playSpeed = parseInt(el.value);
                let i = parseInt(el.dataset.i);
                let row = data[i]
                row['_播放速度'] = isNaN(playSpeed) ? 0 : playSpeed;
                // 立即生效
                player.playbackRate = row['_播放速度']
                saveData()
            }
        })
    }, 1000);
    // 8分钟以上停留的话自动保存数据
    setTimeout(function () {
        save();
    }, 8 * 60 * 1000);

    function renderTable () {
        var rows = data.map(function (row, ri) {
            var cols = [];
            var header = [];
            var row_datas = [`data-i="${ri}"`];
            for (let key in row) {
                if (ri === 0 && !key.startsWith('_')) {
                    header.push(`<td>${key}</td>`)
                }
                let val = row[key];
                if (!key.startsWith('_')) {
                    cols.push(`<td><a href="${row._link}" target="_blank">${val}</a></td>`);
                }
                row_datas.push(`data-${key}="${val}"`)
            }
            header.push(`<td>跳过片头(s)</td>`)
            header.push(`<td>跳过片尾(s)</td>`)
            header.push(`<td>播放速度</td>`)
            cols.push(`<td><input class="jump-top" type="text" value="${row['_跳过片头'] || '0'}" data-i="${ri}" style="width: 80px;" /></td>`)
            cols.push(`<td><input class="jump-end" type="text" value="${row['_跳过片尾'] || '0'}" data-i="${ri}" style="width: 80px;" /></td>`)
            cols.push(`<td><input class="play-speed" type="text" value="${row['_播放速度'] || '1'}" data-i="${ri}" style="width: 80px;" /></td>`)

            cols.push(`<td><button class="remove-btn" ${row_datas.join(' ')}>删除</button></td>`)
            if (ri === 0) {
                return `
                <tr>${header.join('')}</tr>
                <tr>${cols.join('')}</tr>
                `
      }
            return `<tr>${cols.join('')}</tr>`
    });
        var colLength = 1;
        if (data.length) {
            colLength = Object.keys(data[0]).length;
        }
        rows.push(`<tr>
      <td colspan="${colLength}">
        <button id="save-btn">保存当前视频进度</button>
      </td>
    </tr>`);
        table.innerHTML = rows.join('');
    }

    function elems (s) {
        return [].slice.call(document.querySelectorAll(s))
    }

    function today () {
        let d = new Date();
        return [
            d.getFullYear(),
            f(d.getMonth() + 1),
            f(d.getDate())
        ].join('-')
    }
    function f (n) {
        return n < 10 ? '0' + n : n;
    }

    function save () {
        var $breadcrumb = elems('.detail-path .layui-breadcrumb a')
        $breadcrumb.pop()
        var $name = $breadcrumb.pop()
        var name = $name.innerText
        var $num = elems('.bt-playlist li.active')[0]
        var num = $num.innerText;
        var oldItem = data.find(function (item) {
            return item['名称'] === name
        });
        if (oldItem) {
            oldItem['集数'] = num;
            oldItem['日期'] = today();
            oldItem._link = location.href;
        } else {
            var newData = {
                '名称': name,
                '集数': num,
                _link: location.href,
                '日期': today(),
                '_跳过片头': 0,
                '_跳过片尾': 0,
                '_播放速度': 1
            };
            data.push(newData);
        }
        saveData()
        renderTable()
    }
    // 跳过片头设置的应用
    function applyJumpTop () {
        var $breadcrumb = elems('.detail-path .layui-breadcrumb a')
        $breadcrumb.pop()
        var $name = $breadcrumb.pop()
        var name = $name.innerText
        const curRow = data.find(x => x['名称'] === name)
        if (curRow) {
            const playerIframe = document.getElementById('haliplayer')
            const video = playerIframe.contentWindow.document.querySelector('video.dplayer-video.dplayer-video-current')
            player = video
            if (!video) {
                setTimeout(applyJumpTop,1000)
                return
            }
            if (curRow['_播放速度'] && curRow['_播放速度'] > 1) {
                video.playbackRate = curRow['_播放速度'];
            }
            // 快进x秒
            if (curRow['_跳过片头'] > 0) {
                video.currentTime = curRow['_跳过片头'];
            }
            // timeupdate
            if (curRow['_跳过片尾']) {
                function onPlaying() {
                    // 视频时长(s)
                    var videoDuration = video.duration
                    // 距离视频结束还有多长的时间
                    var videoEndDuration = videoDuration - video.currentTime
                    if (videoEndDuration < curRow['_跳过片尾']) {
                        video.removeEventListener("timeupdate", onPlaying)
                        lookNextVideo()
                    }
                }
                video.addEventListener("timeupdate", onPlaying, false)
            }
        }
    }

    setTimeout(applyJumpTop,10000)

    function lookNextVideo () {
        const $btns = elems('.but-ji')
        while($btns && $btns.length) {
            var $btn = $btns.pop();
            if ($btn.innerHTML === '下一集') {
                location.href = $btn.href
            }
        }
    }
    // tools
    /*
    var showClassName = document.createElement('textarea');
    showClassName.className = 'show-class-name';
    showClassName.innerHTML = 'start'
    document.body.appendChild(showClassName);
    renderTools();
    function log (...args) {
        showClassName.value = args.map(function (text, i) {
            return (i + 1) + ': ' + text
        }).join('\n')
    }
    function renderTools() {
        function getSelector (el) {
            if (!el) return '';
            var tagName = el.tagName.toLowerCase()
            var className = el.className ? `.${el.className.replace(/ /g, '.')}` : '';
            var id = el.id ? `#${el.id.replace(/ /g, '#')}` : '';
            // log('getSelector', el.tagName, `${tagName}${className}${id}`)
            return `${tagName}${className}${id}`
    }
        document.body.addEventListener('mouseover', (e) => {
            var el = e.target;
            el.style.outline = '4px solid red';
            if (e.altKey) {
                // log(e.path)
                log(
                    getSelector(el),
                    // e.path.reverse().slice(3).map(getSelector).join(' > ')
                )
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            var el = e.target;
            el.style.outline = ''
        });
    }
*/

})();