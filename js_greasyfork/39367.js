// ==UserScript==
// @name        BYRBT Bangumi Info
// @author      Deparsoul
// @description 一键生成新番信息
// @namespace   https://greasyfork.org/users/726
// @include     http*://bt.byr.cn*/upload.php?type=404*
// @include     http*://bt.byr.cn*/details.php*
// @include     http*://bt.byr.cn*/edit.php*
// @icon        http://bt.byr.cn/favicon.ico
// @require     https://cdn.jsdelivr.net/gh/deparsoul/torrent-info-hash@2.0/bundle.js
// @require     https://cdn.jsdelivr.net/npm/resemblejs@2.10.0/resemble.min.js
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @connect     mikanani.me
// @connect     bgm.tv
// @connect     movie.douban.com
// @connect     anydb.depar.cc
// @connect     *
// @version     20200105
// @downloadURL https://update.greasyfork.org/scripts/39367/BYRBT%20Bangumi%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/39367/BYRBT%20Bangumi%20Info.meta.js
// ==/UserScript==

let GM_scriptVersion = '';
if (GM_info && GM_info.script) {
    GM_scriptVersion = GM_info.script.version || GM_scriptVersion;
}

(function ($) {
    //$('form').attr('action', 'test'); // 测试用，防止意外提交表单

    let type = $('#type,#browsecat>option:selected,#oricat>option:selected').text();
    if (type !== '动漫') return;

    $('#kdescr, .ckeditor').closest('tr').before('<tr id="bangumi_info_row"><td class="rowhead nowrap">生成新番信息</td><td><input type="button" id="bangumi_info_process" value="开始"></td></tr>');

    $('#bangumi_info_process').click(function () {
        $('head').prepend('<meta name="referrer" content="no-referrer">'); // 防止在引用外链图片时发送 referrer

        $(this).replaceWith(`当前状态：<span id="bangumi_info_global_status"></span><br>
<div id="bangumi_info_filename"></div>
<br>
第一阶段：由种子文件猜测 mikanani.me 网址，如果没有使用原种发种，可能无法正确获得网址，你可以手动填入类似 https://mikanani.me/Home/Episode/* 的网址，点击继续<br>
<input type="text" id="bangumi_info_source" class="bangumi_info_url bangumi_info_reference"><button id="bangumi_info_source_process">继续</button><br>
<div id="bangumi_info_source_preview"></div>
<br>
第二阶段：由 mikanani.me 获取新番封面，以及 bgm.tv 网址，你可以手动填入 bgm.tv 网址，点击继续<br>
<input type="text" id="bangumi_info_bgm" class="bangumi_info_url bangumi_info_reference"><button id="bangumi_info_bgm_process">继续</button><br>
<div id="bangumi_info_bgm_preview"></div>
<br>
可选阶段：如果你对由 bgm.tv 获取的新番【STORY】部分不满意（空白或未翻译等），你可以尝试从 douban.com 获取这些信息，点击继续<br>
<input type="text" id="bangumi_info_douban" class="bangumi_info_url"><button id="bangumi_info_douban_process">继续</button><br>
<div id="bangumi_info_douban_preview"></div>
<br>
封面（优先使用 <a id="bangumi_info_cover_source" class="bangumi_info_cover_link">种子封面</a>，否则尝试使用 <a id="bangumi_info_cover_bgm" class="bangumi_info_cover_link">bgm.tv 封面</a>）：<span id="bangumi_info_cover_status"></span><br>
<input type="text" id="bangumi_info_cover" class="bangumi_info_url">文件名：<input type="text" id="bangumi_info_cover_filename"><button id="bangumi_info_cover_check">检查</button><button id="bangumi_info_cover_upload" style="display: none;">上传</button><br>
<img src="" alt="封面预览" id="bangumi_info_cover_preview"><br>
<div id="bangumi_info_auto_fields_wrapper"></div>
<br>
预览<br>
<div id="bangumi_info_preview"></div>
<button class="bangumi_info_fill">点击用以上内容覆盖简介</button><br>
<style>
#bangumi_info_row button {
    font-size: 9pt;
}
input.bangumi_info_url {
    width: 40em;
}
#bangumi_info_cover_preview {
    max-width: 200px;
    max-height: 200px;
}
#bangumi_info_preview {
    border: 1px solid;
    padding: 1em;
}
.bangumi_info_cover_link[href],
.bangumi_info_auto_field {
    cursor: pointer;
    border: 1px solid #999999;
    display: inline-block;
    margin: 0 2px 2px 0;
    padding: 2px 5px;
}
.bangumi_info_auto_field_name {
    color: gray;
}
.bangumi_info_auto_field_new .bangumi_info_auto_field_val {
    font-weight: bold;
    color: red;
}
</style>`.replace(/(<button )/g, '$1type="button" ')); // 将 type 指定为 button 避免触发表单提交

        // URL 文本框
        $('.bangumi_info_url').click(function () {
            // 单击全选
            $(this).select();
        }).dblclick(function () {
            // 双击在新窗口打开
            let url = $(this).val().trim();
            if (url) window.open(url, '_blank');
        });

        let coverBlob;
        let coverReady;

        let autoFields = new AutoFields(renderPreview);
        autoFields.init('#bangumi_info_auto_fields_wrapper');

        // 点击填充封面链接
        $('#bangumi_info_row').on('click', '.bangumi_info_cover_link', function () {
            let href = $(this).attr('href');
            if (href) $('#bangumi_info_cover').val(href).change();
            return false;
        });

        $('#bangumi_info_cover').change(function () {
            let src = $(this).val().trim();
            coverReady = false;
            renderPreview();
            if (src) {
                let match = src.match(/^(?:https?:\/\/([^\/]+))?.*?([^\/]+)$/i);
                if (!match) return log('网址无效', -1, 'cover');
                $('#bangumi_info_cover_filename').val(match[2]).change();
                log('正在读取', 0, 'cover');
                GM_request(src, 'blob').then(blob => {
                    log('读取完成', 1, 'cover');
                    coverBlob = blob;
                    $('#bangumi_info_cover_preview').attr('src', URL.createObjectURL(blob));
                    if (match[1] && match[1] !== 'bt.byr.cn') {
                        $('#bangumi_info_cover_check').click();
                    } else {
                        log('bt.byr.cn 上存存在以下图片，你可以使用该图片发种', 1, 'cover');
                        coverReady = true;
                        renderPreview();
                    }
                }).catch(error => {
                    console.error(error);
                    log('读取失败', -1, 'cover');
                });
            }
        });

        $('#bangumi_info_cover_filename').change(function () {
            let input = $('#bangumi_info_cover_filename');
            let filename = input.val();
            // 过滤文件名
            filename = filename.replace(/[^A-Za-z0-9._]/g, '');
            filename = filename.replace(/0x/ig, '');
            input.val(filename);
            $('#bangumi_info_cover_upload').hide(); // 需要先检查才能判断是否需要上传
        });

        $('#bangumi_info_cover_check').click(function () {
            let filename = $('#bangumi_info_cover_filename').val();
            log('正在检查 bt.byr.cn 上是否有已有该图片', 0, 'cover');
            let byr = `https://bt.byr.cn/ckfinder/userfiles/images/${filename}`;
            GM_request(`${byr}?ModPagespeed=off`, 'blob').then(blob => {
                // 检查文件内容是否一致
                if (!coverBlob) {
                    notSame();
                } else {
                    log('正在对比图片，这可能需要一段时间，请稍等', 0, 'cover');
                    resemble(coverBlob).compareTo(blob).scaleToSameSize().ignoreAntialiasing().onComplete(result => {
                        console.log(result);
                        if (result.rawMisMatchPercentage < 1) {
                            $('#bangumi_info_cover').val(byr).change();
                        } else {
                            notSame();
                        }
                    });
                }
                function notSame() {
                    log('bt.byr.cn 存在同名文件，但是内容不同（或者无法确定是否相同），你可以尝试改名上传，或者 ', -1, 'cover');
                    $('<a class="bangumi_info_cover_link">尝试使用该文件</a>').attr('href', byr).appendTo('#bangumi_info_cover_status');
                }
            }).catch(() => {
                log('bt.byr.cn 上没有同名文件，请尝试上传', -1, 'cover');
                $('#bangumi_info_cover_upload').show();
            });
        });

        $('#bangumi_info_cover_upload').click(function () {
            if (!coverBlob)
                return log('没有可上传的图片', -1, 'cover');
            log('正在上传图片', 0, 'cover');
            uploadImage(coverBlob, $('#bangumi_info_cover_filename').val(), src => {
                log('上传完成', 1, 'cover');
                $('#bangumi_info_cover').val(src).change();
            });
        });

        let useHashOriginal = true;
        let id = location.href.match(/id=\d+/);
        if (id) {
            log('正在读取种子文件');
            GM_request(`https://bt.byr.cn/download.php?${id}`, 'arraybuffer').then(processTorrent);
        }
        let file = $('input#torrent');
        if (file.length) {
            log('请选择种子文件，可以通过种子文件自动生成新番信息，或者你可以按照下方提示手动操作');
            useHashOriginal = false;
            file.change(function () {
                let f = this.files[0];
                if (f) reader(f, 'arraybuffer').then(processTorrent);
            }).change();
        }

        function processTorrent(torrent) {
            torrent = parseTorrent(torrent);
            let hash = useHashOriginal ? torrent.infoHashOriginal : torrent.infoHash;
            $('#bangumi_info_source').val(`https://mikanani.me/Home/Episode/${hash}`);
            $('#bangumi_info_source_process').click();

            // parse file name
            let filename = torrent.name;
            $('#bangumi_info_filename').text(`种子文件名：${filename}`).prepend('<br>');
            autoFields.reset();
            autoFields.add('subteam', getMatch(filename, /^\[([^\]]+)]/), 'torrent');
            autoFields.add('comic_cname');
            autoFields.add('comic_ename', getMatch(filename, /^\[[^\]]+]\[([^\]]+)]/).replace(/_/g, ' '), 'torrent');
            autoFields.add('comic_episode', getMatch(filename, /\[(\d{2,3}(?:\.\d)?)(?:v\d|\s*end)?]/i), 'torrent');
            autoFields.add('comic_quality', getMatch(filename, /(720|1080)/).replace(/(\d+)/, '$1p'), 'torrent');
            autoFields.add('comic_filetype', getMatch(filename, /(mp4|mkv)/i).toUpperCase(), 'torrent');
            autoFields.log('已分析文件名');
        }

        $('#bangumi_info_source_process').click(function () {
            log('正在读取 mikanani.me episode');
            let preview = $('#bangumi_info_source_preview');
            preview.text('');
            GM_request($('#bangumi_info_source').val()).then(parsePage).then(page => {
                if (!page.find('.episode-desc').length) throw 'mikanani.me 302'; // 判断是否为种子页面，还是被重定向到了首页
                preview.text(page.find('.episode-title').text());
                let cover = page.find('.episode-desc img:eq(0)').data('src');
                if (cover && !cover.startsWith('/'))  // 如果以斜杠开头表明该种子本来没有封面
                    $('#bangumi_info_cover_source').attr('href', cover).click();
                let href = page.find('.bangumi-title a').attr('href');
                if (!href) return log('无法获取 bgm.tv 网址', -1);
                href = `https://mikanani.me${href}`;
                log('正在读取 mikanani.me bangumi');
                GM_request(href).then(parsePage).then(page => {
                    $('#bangumi_info_bgm').val(page.find('[href^="http://bgm.tv/subject/"],[href^="https://bgm.tv/subject/"]').attr('href').replace('http:', 'https:'));
                    $('#bangumi_info_bgm_process').click();
                });
            }).catch(error => {
                console.error(error);
                log('mikanani.me 网址无效', -1);
            });
        });

        let descr = {};

        $('#bangumi_info_bgm_process').click(function () {
            log('正在读取 bgm.tv');
            let preview = $('#bangumi_info_bgm_preview');
            preview.text('');
            let url = $('#bangumi_info_bgm').val();
            GM_request(url).then(parsePage).then(page => {
                let cover = page.find('.infobox>div>a').attr('href');
                if (cover) {
                    $('#bangumi_info_cover_bgm').attr('href', `https:${cover}`);
                    if (!$('#bangumi_info_cover').val()) $('#bangumi_info_cover_bgm').click();
                }

                let title = page.find('.nameSingle>a');
                preview.text([title.attr('title'), title.text()].join(' / '));

                $('#bangumi_info_douban').removeClass('bangumi_info_reference');
                // 将 html 按照换行分割成数组，并提取文本
                descr.STORY = (page.find('#subject_summary').html() || '').split('<br>').map(html => $('<p>').html(html).text());

                let staff = page.find('#infobox');
                autoFields.reset('bgm');
                autoFields.add('bgmtv_url', url, 'bgm');
                autoFields.add('comic_cname', getMatch(staff.text(), /中文名:\s*(.*)/), 'bgm');
                let date = staff.text().match(/放送开始:\s*(\d+)年(\d+)月(\d+)日/);
                if (date) {
                    date.shift();
                    autoFields.addDate(new Date(date.join('-')), 'bgm');
                }
                autoFields.log('已分析 bgm.tv');
                autoFields.lookup();
                let li = staff.find('a').closest('li'); // 找出包含链接的行
                // 将 title 中的中文填入
                staff.find('a').each(function () {
                    let a = $(this);
                    let t = a.attr('title');
                    if (t) a.text(t.trim());
                });
                descr.STAFF = staff.find('li').slice(li.first().index(), li.last().index() + 1).map(function () {
                    let li = $(this);
                    let tip = li.find('.tip');
                    let key = tip.text().replace(': ', '');
                    tip.remove();
                    let val = li.text();
                    return `${key}：${val}`;
                }).get().slice(0, 9); // 数量限制

                log('正在读取 bgm.tv characters');
                GM_request('https://bgm.tv' + page.find('a.more:contains("更多角色")').attr('href')).then(parsePage).then(page => {
                    descr.CAST = page.find('#columnInSubjectA>div>div.clearit').map(function () {
                        let div = $(this);
                        let h2 = div.find('>h2');
                        let char = h2.find('span.tip').text().trim().replace('/ ', '') || h2.find('>a').text().trim();
                        let cv = div.find('>div.clearit>p').map(function () {
                            let p = $(this);
                            return (p.find('small').text() || p.find('>a').text()).trim() || null;
                        }).get().join('、');
                        if (char && cv)
                            return `${char}：${cv}`;
                        else
                            return null;
                    }).get();
                    renderPreview();
                    log('生成完成', 1);
                });
            });
        });

        $('#bangumi_info_douban_process').click(function () {
            log('正在读取 douban.com');
            let preview = $('#bangumi_info_douban_preview');
            preview.text('');
            let url = $('#bangumi_info_douban').addClass('bangumi_info_reference').val();
            console.log(url);
            GM_request(url).then(parsePage).then(page => {
                let title = page.find('h1').text();
                preview.text(title);
                descr.STORY = page.find('span[property="v:summary"]').text().trim().split(/\n\s*/);
                renderPreview();
                log('已根据 douban.com 填写了【STORY】部分，如果希望换回 bgm.tv 的信息，请点击第二阶段中的 继续 按钮', 1);
            });
        });

        let fill = $('.bangumi_info_fill');
        fill.hide();
        let preview = $('#bangumi_info_preview');
        fill.click(function () {
            CKEDITOR.instances.descr.setData(preview.html());
        });

        function renderPreview() {
            preview.html('');
            let row = autoFields.row();
            if (row) {
                preview.append(`<div><img src="${row}"></div>`);
            }
            let cover = $('#bangumi_info_cover').val();
            if (coverReady) preview.append(`<img src="${cover}" style="max-width: 80%;">`);
            for (let key in descr) {
                $(`<p>【${key}】</p>`).appendTo(preview);
                $(`<p></p>`).html(descr[key].map(escapeHtml).join('<br>')).appendTo(preview);
            }
            let meta = $(`<p class="byrbt_bangumi_info" data-version="${GM_scriptVersion}" style="font-size: 0.8em; opacity: 0.5; margin-bottom: 0;">以上内容由 BYRBT Bangumi Info 自动生成</p>`);
            let reference = $('.bangumi_info_reference').map(function () {
                let href = $(this).val().trim();
                if (!href) return null;
                let a = $(`<a target="_blank" rel="noopener noreferrer"></a>`).attr('href', href).text(href);
                let c = 'byrbt_bangumi_info_reference';
                a.addClass(c).addClass($(this).attr('id').replace('bangumi_info', c));
                return a[0].outerHTML;
            }).get();
            if (reference.length) {
                reference = reference.join('，');
                meta.append(`，信息来自：${reference}`);
            }
            meta.appendTo(preview);
            if ($('.ckeditor').length)
                fill.show();
            else
                fill.hide();
        }
    });

    // 封装 GM 的 xhr 函数，返回 Promise
    function GM_request(url, responseType, method) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: method || 'GET',
                url,
                responseType,
                onload: xhr => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr);
                    }
                },
                onerror: xhr => {
                    reject(xhr);
                }
            });
        });
    }

    function reader(blob, as) {
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();
            if (as === 'arraybuffer')
                reader.readAsArrayBuffer(blob);
            else
                reader.readAsDataURL(blob);
            reader.onload = function () {
                resolve(reader.result);
            };
        });
    }

    function uploadImage(blob, filename, callback) {
        let formData = new FormData();
        formData.append('upload', blob, filename);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&CKEditor=descr&CKEditorFuncNum=2&langCode=zh-cn');
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let match = xhr.responseText.match(/:\/\/bt\.byr\.cn\/ckfinder\/userfiles\/images\/[^']+/);
                if (match) callback(`https${match[0]}`);
            }
        };
    }

    function escapeHtml(html) {
        return $('<p>').text(html).html();
    }

    function parsePage(html) {
        html = html.replace(/\s+src=/ig, ' data-src='); // 避免在解析 html 时加载其中的图片
        return $(html);
    }

    // 显示当前状态
    function log(msg, state, type) {
        type = type || 'global';
        let elem = $(`#bangumi_info_${type}_status`);
        let color = 'blue';
        if (state > 0) color = 'green';
        if (state < 0) color = 'red';
        elem.text(msg).css('color', color);
    }

    function getMatch(str, reg, group) {
        group = group || 1;
        let match = str.match(reg);
        if (match && match[group])
            return match[group];
        else
            return '';
    }

    function AutoFields(renderPreview) {
        let names = {
            "subteam": "字幕组",
            "comic_cname": "中文名",
            "comic_ename": "英文名",
            "comic_episode": "集数",
            "comic_quality": "分辨率",
            "comic_source": "片源",
            "comic_filetype": "动漫文件格式",
            "comic_year": "发行时间",
            "comic_country": "动漫国别",
            "small_descr": "副标题",
            "url": "IMDb链接",
            "dburl": "豆瓣链接",
            "bgmtv_url": "Bangumi 番组计划链接",
        };
        let fields = {};
        let lastDate;
        let wrapper, div;
        let row = null, rowFlag = true;
        return {
            init(selector) {
                wrapper = $(selector);
                wrapper.html('<br>字段填写建议，不一定准确，请注意检查，点击自动填写（仅限发布页面，<span class="bangumi_info_auto_field_new"><span class="bangumi_info_auto_field_val">高亮</span></span>表示与目前填写的内容不同），Ctrl+点击复制到剪贴板：<span id="bangumi_info_auto_fields_status"></span><div id="bangumi_info_auto_fields"></div><button type="button" id="bangumi_info_row_toggle"></button>');
                div = $('#bangumi_info_auto_fields');
                div.on('click', '.bangumi_info_auto_field', function (e) {
                    let span = $(this);
                    if (e.ctrlKey || e.altKey) {
                        GM_setClipboard(span.data('val'));
                    } else {
                        let input = $('[name=' + span.data('key') + ']');
                        input.val(span.data('val')).keyup();
                    }
                });
                $('input').keyup(() => {
                    this.render();
                });
                wrapper.hide();
                $('#bangumi_info_row_toggle').click(() => {
                    rowFlag = !rowFlag;
                    this.render();
                });
            },
            log(msg, state) {
                log(msg, state, 'auto_fields');
            },
            reset(source) {
                if (!source) {
                    fields = {};
                } else {
                    for (let key in fields) {
                        fields[key] = fields[key].filter(current => current.s !== source);
                    }
                }
                this.render();
            },
            get(key) {
                if(!fields.hasOwnProperty(key))
                    return [];
                return fields[key].reduce((result, current) => result.indexOf(current.v) < 0 ? result.concat(current.v) : result, []);
            },
            add(key, val, source) {
                if (!fields.hasOwnProperty(key))
                    fields[key] = [];
                if (!val) return;
                fields[key].push({v: val, s: source});
                this.render();
            },
            addDate(date, source) {
                lastDate = new Date(date.getTime());
                this.add('comic_year', format(date), source);
                let month = date.getMonth() + 1;
                //console.log(month);
                if (month % 3 === 0) {
                    date.setMonth(month);
                    this.add('comic_year', format(date), source);
                }
                function format(date) {
                    return date.toISOString().replace(/(\d+)-(\d+).*/, '$1.$2');
                }
            },
            lookup() {
                row = null;
                let date = lastDate;
                this.reset('anydb');
                let titles = this.get('comic_cname').concat(this.get('comic_ename'));
                if (date && titles.length) {
                    date = date.getTime() / 1000;
                    let query = titles.map(function (title) {
                        return 'titles[]=' + encodeURIComponent(title);
                    });
                    query.push('date=' + date);
                    let url = 'https://anydb.depar.cc/anime/query?_cf_cache=1&_titles=1&' + query.join('&');
                    console.log(url);
                    this.log('正在从 anydb 查询更多信息');
                    GM_request(url).then(JSON.parse).then(data => {
                        if (!data.success) return;
                        let m = data.matched;
                        if (m.bgm)
                            row = 'https://anydb.depar.cc/anime/bar.svg?bgm=' + m.bgm.url.match(/(\d+)/)[1];
                        if (m.douban)
                            this.add('dburl', m.douban.url.replace(/https:(.*)\//, 'http:$1'), 'anydb');
                        if (m.douban)
                            $('#bangumi_info_douban').val(m.douban.url);
                        m._titles.forEach(t => {
                            if (t.l === 'zh')
                                this.add('comic_cname', t.t, 'anydb');
                            if (t.l === 'en' || t.l === 'x-jat')
                                this.add('comic_ename', t.t, 'anydb');
                        });
                        this.log('分析完成', 1);
                    });
                }
            },
            row() {
                return rowFlag && row;
            },
            render() {
                //console.log(fields);
                div.html('');
                for (let key in fields) {
                    this.get(key).forEach(val => {
                        let input = $('[name=' + key + ']');
                        let name = names[key] || key;
                        let span = $('<span class="bangumi_info_auto_field"><span class="bangumi_info_auto_field_name"></span>：<span class="bangumi_info_auto_field_val"></span></span>');
                        span.children().eq(0).text(name);
                        span.children().eq(1).text(val);
                        span.data('key', key);
                        span.data('val', val);
                        if (input.length && input.val() !== val) span.addClass('bangumi_info_auto_field_new');
                        div.append(span);
                    });
                }
                wrapper.hide();
                if ($('.bangumi_info_auto_field').length)
                    wrapper.show();
                $('#bangumi_info_row_toggle').text((rowFlag ? '关闭' : '启用') + '分数条（测试版）').toggle(row !== null);
                renderPreview();
            }
        };
    }

})(jQuery);