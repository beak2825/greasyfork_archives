// ==UserScript==
// @name         展开Swagger方便搜索|导出rd-http配置
// @namespace    SwaggerUI Tool
// @version      0.5
// @description  展开Swagger方便搜索|导出rd-http配置|swaggerUI工具
// @author       言灵
// @match        http://*/*/swagger-ui.html
// @match        http://*/swagger-ui.html
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411858/%E5%B1%95%E5%BC%80Swagger%E6%96%B9%E4%BE%BF%E6%90%9C%E7%B4%A2%7C%E5%AF%BC%E5%87%BArd-http%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/411858/%E5%B1%95%E5%BC%80Swagger%E6%96%B9%E4%BE%BF%E6%90%9C%E7%B4%A2%7C%E5%AF%BC%E5%87%BArd-http%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

// GM_setValue(name, value)
// GM_getValue(name, defaultValue)

;(function () {
    'use strict'
    let host = location.host
    let cacheName = 'cache://' + host
    let cache = GM_getValue(cacheName, {})
    function hasClass(el, name) {
        if (!el) return false
        if (!el.className) return false
        return el.className.split(' ').includes(name)
    }
    function getParent(el, pclass) {
        let p = el
        while (p && !hasClass(p, pclass)) {
            p = p.parentNode
        }
        return p
    }
    function find(el, name) {
        return el.querySelectorAll(name)
    }
    function findOne(el, name) {
        return el.querySelector(name)
    }
    function downloadString(text, fileType, fileName) {
        var blob = new Blob([text], { type: fileType })

        var a = document.createElement('a')
        a.download = fileName
        a.href = URL.createObjectURL(blob)
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(function () {
            URL.revokeObjectURL(a.href)
        }, 500)
    }
    var style = document.createElement('style')
    style.innerHTML = `
    .op-btn {
        position: fixed;
        top: 160px;
        right: 20px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: lightblue;
        cursor:pointer;
        border-radius: 8px;
    }
    .op-btn:hover {
        opacity: 0.8;
    }
    .message { position: fixed; top: 50px; background: lightblue;padding: 10px;left: 50%;transform: translateX(-50%); }
    #search-input{ height: 40px; width: 400px; }
    .search-result { position: fixed; top: 50px;left: 0; width: 240px; padding: 0 15px; box-shadow: 0 0 10px #444;background: #fff }
    .search-result-item { cursor: pointer;padding: 10px 0; margin: 0; }
.search-result-item:hover {background: #eee;}
    `
  document.body.appendChild(style)
    var btns = [
        {
            className: 'op-btn',
            style: 'top: 100px;',
            innerHTML: '展开第一级',
            onclick: function () {
                document.querySelectorAll('.opblock-tag>a').forEach(function (a) {
                    setTimeout(function () {
                        a.click()
                    }, 0)
                })
            },
        },
        {
            className: 'op-btn',
            style: 'top: 160px;',
            innerHTML: '展开第二级',
            onclick: function () {
                document
                    .querySelectorAll('.opblock-summary-path>a')
                    .forEach(function (a) {
                    setTimeout(function () {
                        a.click()
                    }, 0)
                })
            },
        },
        {
            className: 'op-btn',
            style: 'top: 220px;',
            innerHTML: '导出展开接口配置',
            onclick: function () {
                var data = []
                function checkName(name) {
                    var findDubbleName = data.find(function (x) {
                        return x.name === name
                    })
                    if (findDubbleName) {
                        console.log('这个居然TMD重名了', name)
                    }
                    return findDubbleName
                }
                function rename(_path, deep) {
                    var name = _path
                    .slice(deep)
                    .join('_')
                    .replace(/_([a-z])/g, function (_, $1) {
                        return $1.toUpperCase()
                    })
                    if (checkName(name)) {
                        return rename(_path, deep - 1)
                    }
                    return name
                }
                var exportString = 'export default [\r\n'
                document.querySelectorAll('.opblock-summary').forEach(function (block) {
                    var $path = block.querySelector('.opblock-summary-path span')
                    var $method = block.querySelector('.opblock-summary-method')
                    var $container = getParent(block, 'opblock-tag-section')
                    var $desc = block.querySelector('.opblock-summary-description')
                    var $header = $container.querySelector('h4 span')
                    var $customName = block.querySelector('.export-name-input')
                    var customName = $customName && $customName.value
                    var deep = -2
                    var path = $path.innerHTML
                    var method = $method.innerHTML
                    var desc = $desc.innerHTML
                    var pdesc = $header.innerHTML
                    var _path = path.split('/')
                    var name = customName || rename(_path, deep)
                    // 这里可以设置条件过滤掉不需要导出的api
                    if (path.includes('channel')) {
                        return
                    }
                    data.push({
                        desc: desc,
                        name: name,
                        method: method.toLowerCase(),
                        url: path,
                    })
                    exportString += '// @desc ' + pdesc + '\r\n'
                    exportString += '// @desc ' + desc + '\r\n'
                    exportString += JSON.stringify(
                        {
                            name: name,
                            method: method.toLowerCase(),
                            url: path,
                        },
                        null,
                        '  '
                    )
                    exportString += ',\r\n'
                })
                exportString += '\r\n];'
                console.log(data)
                console.log(exportString)
                downloadString(exportString, 'text/javascript', 'apiConfig.js')
            },
        },
    ]

    btns.forEach(function (conf) {
        var div = document.createElement('div')
        for (var key in conf) {
            div[key] = conf[key]
        }
        document.body.appendChild(div)
    })

    function createInput(key) {
        let input = document.createElement('input')
        input.className = 'export-name-input'
        input.onclick = function (e) {
            e.stopPropagation()
        }
        input.onkeyup = function (evt) {
            let value = input.value
            cache[key] = value
            GM_setValue(cacheName, cache)
        }
        let value = cache[key] || ''
        input.value = value
        return input
    }
    function giveName(_path, deep) {
        var name = _path
        .slice(deep)
        .join('_')
        .replace(/_([a-z])/g, function (_, $1) {
            return $1.toUpperCase()
        })
        return name
    }

    function createCopyBtn(path) {
        let btn = document.createElement('button')
        btn.innerHTML = '点击复制'
        btn.onclick = function (e) {
            var $container = getParent(btn, 'opblock-tag-section')
            var $row = getParent(btn, 'opblock')
            var $desc = $row.querySelector('.opblock-summary-description')
            var $header = $container.querySelector('h4 span')
            var $method = findOne($row, '.opblock-summary-method')
            var $customName = $row.querySelector('.export-name-input')
            var customName = $customName && $customName.value
            var desc = $desc.innerHTML
            var pdesc = $header.innerHTML
            var method = $method.innerHTML
            console.log('path', path)
            var name = customName || giveName(path.split('/'), -2)
            // 导出字符串
            var exportString = ''
            exportString += '// @desc ' + pdesc + '\r\n'
            exportString += '// @desc ' + desc + '\r\n'
            exportString += JSON.stringify(
                {
                    name: name,
                    method: method.toLowerCase(),
                    url: path,
                },
                null,
                '  '
            )
            exportString += ',\r\n'

            e.stopPropagation()
            const input = document.createElement('textarea')
            // input.setAttribute('readonly', 'readonly') // ios
            // input.setAttribute('value', exportString)
            document.body.appendChild(input)
            input.value = exportString;
            input.select()
            // input.setSelectionRange(0, 9999); // ios
            if (document.execCommand('copy')) {
                document.execCommand('copy')
                let tip = document.createElement('div')
                tip.className = 'message'
                tip.innerHTML = '已复制'
                document.body.appendChild(tip)
                setTimeout(function () {
                    document.body.removeChild(tip)
                }, 2000)
            }
            document.body.removeChild(input)
        }
        return btn
    }

    window.addEventListener('click', function (e) {
        var t = getParent(e.target, 'opblock-tag-section')
        var isChild = getParent(e.target, 'opblock')
        if (t && !isChild) {
            let classes = t.className.split(' ')
            if (classes.includes('is-open')) {
                find(t, '.opblock-summary').forEach(function (block) {
                    let path = findOne(block, '.opblock-summary-path span').innerHTML
                    if (!findOne(block, '.export-name-input')) {
                        let input = createInput(path)
                        block.appendChild(input)
                    }
                    let copyBtn = createCopyBtn(path)
                    findOne(block, '.opblock-summary-path a').appendChild(copyBtn)
                })
            }
        }
    })

    // 搜索功能
    $(function () {
        var swaggerData = {};

        function each (fn) {
            for(var path in swaggerData.paths) {
                for (var method in swaggerData.paths[path]) {
                    var item = swaggerData.paths[path][method];
                    fn && fn(item, path, method);
                }
            }
        }
        function initData () {
            var sr = location.pathname.replace('swagger-ui.html', 'swagger-resources')
            $.get(sr).done(function (res) {
                console.log(res[0].url)
                var url = res[0].url;
                var p = location.pathname.replace('/swagger-ui.html', url);
                $.get(p).done(function (res) {
                    swaggerData = res
                    console.log(res)
                });
            })
        }
        function initSearch(){
            var $searchInput = $('<input id="search-input" placeholder="搜索 path/tags/desc" />')
            $('.download-url-wrapper').before($searchInput);
            var $searchResult = $('<pre class="search-result">chenggongaaa</pre>')
            $searchResult.on('click', '.search-result-item', function (e) {
                var href = $(this).attr('href');
                var target = $(`a[href='${href}']`).last();
                // console.log(target.offset().top);
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 600);
                target.delay(600).hide(60).show(60).hide(60).show(60)
                target[0].click();
            })
            function uniq(arr) {
                var o = {}
                arr.forEach(function (key) {
                    o[key] = 1
                });
                return Object.keys(o)
            }
            function search() {
                $('.topbar').after($searchResult);
                $searchResult.html('');
                var keyword = $searchInput.val();
                var rs = [];
                each(function (item, path, method) {
                    var desc = item.description || '';
                    var tags = item.tags && item.tags.join();
                    tags = tags || '';
                    if (
                        path.includes(keyword) ||
                        desc.includes(keyword) ||
                        tags.includes(keyword)
                    ) {
                        rs.push(tags)
                    }
                });
                // rs 去重
                rs = uniq(rs);
                rs.forEach(function (tags) {
                    var $link = `<h4 class="search-result-item" href="#/${tags}">${tags}</h4>`;
                    $searchResult.append($link)
                })
            }
            $searchInput.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    search();
                }
            })
        }
        function init() {
            initSearch();
            initData();
        }
        setTimeout(init, 2000);
    })
})()
