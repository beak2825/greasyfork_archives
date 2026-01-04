// ==UserScript==
// @name         hho-campfire-extension
// @namespace    https://camp-fire.jp/projects
// @version      0.1
// @description  hho-campfire-extension desc
// @author       bosiwan
// @match        https://camp-fire.jp/projects/*
// @icon         https://www.google.com/s2/favicons?domain=camp-fire.jp
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438259/hho-campfire-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/438259/hho-campfire-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var $ = window.$
     $(document).ready(function() {
         // 添加按钮
         const startButton = '<button style="position: fixed; top: 100px; right: 40px;z-index: 99999;background: yellow;color: #333;cursor: pointer;" id="hhoBtn">开始选品</button>'
         $('body').append(startButton);
         const yesButton = '<button style="position: fixed; top: 140px; right: 100px;z-index: 99999;background: green;color: #fff;cursor: pointer;" id="hhoYesBtn">要</button>'
         $('body').append(yesButton);
         const noButton = '<button style="position: fixed; top: 140px; right: 40px;z-index: 99999;background: red;color: #fff;cursor: pointer;" id="hhoNoBtn">不要</button>'
         $('body').append(noButton);
     })

    $(document).on('click',"#hhoBtn", function(){ startSelection() });
    $(document).on('click',"#hhoYesBtn", function(){ save() });
    $(document).on('click',"#hhoNoBtn", function(){ closeTab() });

    function startSelection() {
        if (window.location.pathname.indexOf('/projects/category') !== 0) {
            alert('不是列表页')
            return;
        }
        const urls = Array.prototype.slice.call(document.querySelectorAll('.boxes4 .box .box-title a')).map(d => d.href)
        localStorage.setItem('camp-fire-urls', JSON.stringify(urls))
        localStorage.setItem('camp-fire-index', 0)
        localStorage.setItem('camp-fire-max-index', urls.length - 1)
        window.open(urls[0])
    }

    function save() {
        if (window.location.pathname.indexOf('/projects/view') !== 0) {
            alert('不是详情页页')
            return;
        } else {
            const filename = window.dataLayer[1].dynx_itemid;
            $.ajax({
                url: "https://api.hhodata.com/v2/key-value-stores/campfire/records/" + filename,
                method: 'PUT',
                dataType: 'json',
                data: {
                    html: document.documentElement.innerHTML,
                    url: window.location.href,
                    item_code: filename
                },
                complete: function(data) {
                    if (data.status === 201) {
                        createItemId(filename)
                        // $('#hhoTips').text(`${filename} 上传成功`)
                    } else {
                        alert(`${filename} 上传失败`)
                    }
                },
                fail: function(err) {
                    alert(`${filename} 上传失败`)
                }
            })
        }
    }

    function closeTab() {
        if (window.location.pathname.indexOf('/projects/view') !== 0) {
            alert('不是详情页页')
            return;
        } else {
            const urls = JSON.parse(localStorage.getItem('camp-fire-urls'))
            const index = parseInt(localStorage.getItem('camp-fire-index')) + 1
            const maxIndex = parseInt(localStorage.getItem('camp-fire-max-index'))
            if (maxIndex >= index) {
                window.close()
                localStorage.setItem('camp-fire-index', index)
                window.open(urls[index])
            } else {
                alert('当前页已选完，请开始下一页')
                localStorage.setItem('camp-fire-urls', JSON.stringify([]))
                localStorage.setItem('camp-fire-index', 0)
                localStorage.setItem('camp-fire-max-index', 0)
            }
        }
    }

    // 向campfire表写入id
    function createItemId(itemId) {
        $.ajax({
            url: "https://api.hhodata.com/v2/datasets/campfire/items",
            method: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify([{"project_code": itemId}]),
            complete: function(data) {
                if (data.status === 200) {
                    closeTab()
                } else {
                    alert('报错')
                }
            }
        })
    }
})();