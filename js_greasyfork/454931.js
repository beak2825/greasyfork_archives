// ==UserScript==
// @name 小黄书破解VIP-威力加强版
// @namespace http://tampermonkey.net/
// @version 1.0.1
// @description 破解VIP、一键打包下载和图片自适应
// @author kerry
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.0.0/jquery.min.js
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @match https://xchina.co/*
// @match *://*.xchina*.co*/*
// @include /^http[s]?:\/\/(\w*\.)?xchina[\d]*\.co.*$/
// @grant  GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454931/%E5%B0%8F%E9%BB%84%E4%B9%A6%E7%A0%B4%E8%A7%A3VIP-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454931/%E5%B0%8F%E9%BB%84%E4%B9%A6%E7%A0%B4%E8%A7%A3VIP-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('.push-bottom').remove();
    $('.ad').remove();
    var lists = document.querySelectorAll('.main .body div.list>.item');
    if (lists.length > 0) {
        for (const item of lists) {
            const link = item.querySelector('a:first-child')
            const img = item.querySelector('img:first-child')
            const href = link.getAttribute("href");
            link.removeAttribute("href");
            link.setAttribute("id", href.replace('.html', '').split("id-")[1])

            img.onclick = function () {
                const id = link.getAttribute("id")
                const num = item.querySelector('.tag>div:first-child').innerText.split("P")[0];
                const tags = item.querySelectorAll('.tag>div:not(:first-child)')
                const title = item.querySelector('img:first-child').getAttribute('alt');
                console.log('id, num, title, tags', id, num, title, tags)
                show(id, num, title, tags);
            };

        } //批量下载
        var flag = false;
        $(document).on('click', '#xiazai', function () {
            if (!flag) {
                flag = true;
                download()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '已创建下载任务',
                    showConfirmButton: false,
                    timer: 1000
                  })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: '努力打包中, 请耐心等待！',
                    showConfirmButton: false,
                    timer: 1000
                  })
            }
        });
        //快速回顶
        $(document).on('click', '#huiding', function () {
            scrollTo(0, 0);
        });
    }
})();

var pic_template = "<img style='width:100%' loading='lazy' class='lazy' filename='{title}-{num}.jpg' src='https://img2.xchina.pics/photos/{pic_id}/{num}.jpg' data-src='https://img2.xchina.pics/photos/{pic_id}/{num}.jpg'>";

function asyncGet(zip, filename, url) {
    var defered = $.Deferred();

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "referer": window.location.href
        },
        responseType: "blob",
        onload: function (response) {
            zip.file(filename, response.response);
            defered.resolve('success')
            // console.log(filename + 'download completed~')
        },
        onerror: function () {
            console.log(filename + '(' + url + ') download failed!')
        }
    });
    return defered
}


//下载文件
function download() {
    var start = performance.now();
    var zip = new JSZip();
    var list = document.querySelectorAll('#kbox>img');
    console.log('start download... ' + list.length + ' task');

    let arr = []
    for (const item of list) {
        var filename = item.getAttribute('filename');
        var url = item.getAttribute('src');
        arr.push(asyncGet(zip, filename, url))
    }

    var filename = $('title').text();
    $.when.apply(this, arr)
        .then(function (...args) {
            console.log('download completed... ' + args.length + ' task')
            console.log('start generate zip files, timely: ', `${(performance.now() - start) / 1000} s`)
            //生成zip文件
            zip.generateAsync({
                type: 'blob'
            }).then(function (content) {
                saveAs(content, filename + '.zip');
                console.log('all completed: ', `${(performance.now() - start) / 1000} s`)
            });
        })
}


function show(id, num, title, tags) {
    //劫持返回(后退)事件，以刷新代替后退
    var state = {
        url: window.location.href
    };
    window.history.pushState(state, '', window.location.href);
    window.addEventListener("popstate", function (e) {
        window.location.reload();
    }, false);
    //修改标题
    $('title').html(title)


    //删除无用元素
    $('.top').remove();
    $('.breadcrumb').remove();
    $('.main').remove();
    $('.push-bottom').remove();

    //头部信息
    var tuji = $("<div class='tuji'></div>");
    tuji.append('<h1>' + title + '</h1>');
    tuji.append(tags);
    $('footer').before(tuji);

    //右下角按钮
    var mulu = $("<div style='position: fixed;bottom: 4rem;right: 1rem;'></div>");
    mulu.append("<button id='huiding' title='回顶'>回顶</button>")
    mulu.append("<button onclick='location.reload();' title='返回'>返回 </button>")
    mulu.append("<button id='xiazai' title='打包下载'>下载 </button>")
    $('footer').before(mulu);

    //图片
    var kbox = $("<div id='kbox'></div>");
    var pic_item = pic_template.replaceAll('{pic_id}', id).replaceAll('{title}', title);
    for (var i = 1; i <= num; i++) {
        kbox.append($(pic_item.replaceAll('{num}', String(i).padStart(4, '0'))))
    }
    $('footer').before(kbox);
}