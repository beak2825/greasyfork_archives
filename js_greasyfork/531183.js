// ==UserScript==
// @name         115优化大师（精简版）
// @author       zxf10608
// @version      7.5.1
// @icon         https://115.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/408466
// @description  保留离线下载和其它功能，去掉文件管理和播放优化。
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/398240-gm-config-zh-cn/code/GM_config_zh-CN.js
// @require      https://greasyfork.org/scripts/412267-base64-v1-0/code/base64_v10.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource     toastrCss   https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @match        http*://*/*
// @match        http*://*.115.com/*
// @exclude      http*://*.115.com/bridge*
// @exclude      http*://*.115.com/*/static*
// @exclude      http*://*.baidu.com/*
// @exclude      http*://*.iqiyi.com/*
// @exclude      http*://*.qq.com/*
// @exclude      http*://*.youku.com/*
// @exclude      http*://*.bilibili.com/
// @exclude      http*://*.pptv.com/*
// @exclude      http*://*.fun.tv/*
// @exclude      http*://*.sohu.com/*
// @exclude      http*://*.le.com/*
// @exclude      http*://*.tudou.com/*
// @exclude      http*://*.bilibili.com/*
// @exclude      http*://music.163.com/*
// @exclude      http*://github.com/*
// @exclude      http*://gitee.com/*
// @exclude      http*://btcache.me/*
// @exclude      http*://*.jd.com/*
// @exclude      http*://*.taobao.com/*
// @exclude      http*://*.tmall.com/*
// @exclude      http*://*.vip.com/*
// @exclude      http*://*.pinduoduo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      115.com
// @connect      *
// @grant        unsafeWindow
// @grant        window.open
// @grant        window.close
// @run-at       document-start
// @compatible   chrome
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/531183/115%E4%BC%98%E5%8C%96%E5%A4%A7%E5%B8%88%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531183/115%E4%BC%98%E5%8C%96%E5%A4%A7%E5%B8%88%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newVersion = 'v7.5.1';

    if (typeof GM_config == 'undefined') {
        alert('115优化大师：\n网络异常，相关库文件加载失败，脚本无法使用，请刷新网页重新加载！');
        return;
    } else {
        console.log('115优化大师：相关库文件加载成功！');
    }

    function config() {
        var windowCss = '#Cfg .nav-tabs {margin: 20 2} #Cfg .config_var textarea{width: 310px; height: 50px;} #Cfg .inline {padding-bottom:0px;} #Cfg .config_header a:hover {color:#1e90ff;} #Cfg .config_var {margin-left: 10%;margin-right: 10%;} #Cfg input[type="checkbox"] {margin: 3px 3px 3px 0px;} #Cfg input[type="text"] {width: 53px;} #Cfg {background-color: lightblue;} #Cfg .reset_holder {float: left; position: relative; bottom: -1em;} #Cfg .saveclose_buttons {margin: .7em;} #Cfg .section_desc {font-size: 10pt;}';

        GM_registerMenuCommand('设置', opencfg);
        function opencfg() {
            GM_config.open();
        }

        GM_config.init({
            id: 'Cfg',
            title: GM_config.create('a', {
                href: 'https://greasyfork.org/zh-CN/scripts/408466',
                target: '_blank',
                className: 'setTitle',
                textContent: '115优化大师',
                title: '作者：zxf10608 版本：' + newVersion + ' 点击访问主页'
            }),
            isTabs: true,
            skin: 'tab',
            css: windowCss,
            frameStyle: {
                height: '550px',
                width: '445px',
                zIndex: '2147483648',
            },
            fields: {
                // 离线升级
                offline_Down: {
                    section: ['离线升级', '升级离线下载功能'],
                    label: '启用一键离线下载',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                offline_result: {
                    label: '任务添加后显示离线结果',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                open_List: {
                    label: '离线后自动打开任务列表',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                open_search: {
                    label: '离线成功后开启视频搜索',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                    line: 'start',
                },
                search_result: {
                    label: '显示视频搜索结果',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                open_Popup: {
                    label: '搜到视频自动播放',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                    line: 'end',
                },
                fuzzy_find: {
                    label: '启用下载地址模糊匹配',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                diy_folder: {
                    label: '自定义离线下载文件夹',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                    line: 'start',
                },
                save_folder: {
                    label: '设置文件夹',
                    labelPos: 'right',
                    type: 'button',
                    line: 'end',
                    click: function() {
                        setFolder();
                    }
                },
                reminder2: {
                    label: '温馨提示',
                    labelPos: 'right',
                    type: 'button',
                    click: function() {
                        alert('1、显示离线下载结果有10s延时，用于服务器响应时间。\n2、为避免通知弹窗过多，最多只显示3个视频搜索结果，更多请自行到115查看。\n3、“启用下载地址模糊匹配”后，能根据哈希值或纯文本模糊匹配磁力链接和迅雷专用链，如在磁力搜索引擎、资源网等有奇效，但在某些网页有一定几率误识别，请谨慎开启。');
                    }
                },
                // 其他设置
                hide_sidebar: {
                    section: ['更多设置', '优化浏览体验'],
                    label: '隐藏网盘侧边栏',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                show_Alidity: {
                    label: '显示上次登录时间',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                show_Star: {
                    label: '网盘顶部增加星标按钮',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                show_Offline: {
                    label: '网盘顶部增加云下载按钮',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                show_Task: {
                    label: '网盘顶部增加链接任务按钮',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                show_Update: {
                    label: '更新后弹出更新日志',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                toastr: {
                    label: '通知弹出位置',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['左上', '右上', '中上', '全铺'],
                    default: '右上',
                },
                http_ua: {
                    label: '数据请求UA标识（非必要勿改）',
                    type: 'textarea',
                    default: ''
                },
            },
            events: {
                save: function() {
                    GM_config.close();
                    location.reload();
                }
            },
        });
    }
    config();

    var G = GM_config;
    var localHref = window.location.href;
    var show_result = G.get('offline_result');
    var down_reg = /^(magnet|thunder|ftp|ed2k):/i;
    var UA = G.get('http_ua') != '' ? G.get('http_ua') : navigator.userAgent;
    var sign_url = 'http://115.com/?ct=offline&ac=space';
    var task_del = 'https://115.com/web/lixian/?ct=lixian&ac=task_del';
    var add_url = 'http://115.com/web/lixian/?ct=lixian&ac=add_task_url';
    var add_urls = 'http://115.com/web/lixian/?ct=lixian&ac=add_task_urls';
    var lists_url = 'http://115.com/web/lixian/?ct=lixian&ac=task_lists';
    var a_list = `<br><a target="_blank" class="openList" href="javascript:void(0);" style="color:blue;" title="点击打开离线链接任务列表">打开任务列表</a>`;
    console.log('115脚本UA：' + UA);

    function notice() {
        GM_addStyle(GM_getResourceText('toastrCss'));
        if (G.get('toastr') == '全铺' || localHref.indexOf('https://captchaapi.115.com') != -1) {
            GM_addStyle('.toast{font-size:15px!important;} .toast-title{font-size:16px!important;text-align:center}');
        } else {
            GM_addStyle('.toast{font-size:15px!important;width:360px!important;} .toast-title{font-size:16px!important;text-align:center}');
        }
        var place = { '左上': 'toast-top-left', '右上': 'toast-top-right', '中上': 'toast-top-center' }[G.get('toastr')] || 'toast-top-full-width';
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "timeOut": 8000,
            "extendedTimeOut": 8000,
            "positionClass": place,
            "allowHtml": true,
            "newestOnTop": false,
        };
    }
    notice();

    function AjaxCall(href, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: href,
            headers: {
                "User-Agent": UA,
                Origin: "https://115.com",
            },
            onload: function(data) {
                if (data.readyState == 4 && data.status == 200) {
                    var htmlTxt = data.responseText;
                    callback(null, htmlTxt);
                }
            },
            onerror: function(error) {
                callback(error);
            },
            ontimeout: function(error) {
                callback(error);
            },
        });
    }

    function setFolder() {
        var old_cid = GM_getValue('offlineFolder') || '';
        var new_cid = prompt('请输入离线下载保存文件夹的cid值：\n   ※ 获取cid值方法：打开需要保存到的网盘文件夹，复制地址栏中"cid="后面的一串数字，以"&"截止，如https://115.com/?cid=012345678912345678&...，cid值则为 012345678912345678。该项不填或填无效值则保存至默认文件夹（云下载）。※', old_cid);
        if (/^(\d{17,19}|0)$/.test(new_cid)) {
            GM_setValue('offlineFolder', new_cid);
            alert('设置成功，现cid值为：\n' + new_cid);
        } else if (new_cid == '') {
            GM_setValue('offlineFolder', '');
            alert('未输入cid值，保存至默认文件夹（云下载）。');
        } else if (new_cid == null) {
            console.log('已点击取消');
        } else {
            alert('设置失败，cid值无效，请重新输入！\n（该值除根目录为 0 外，其他文件夹均为17至19位纯数字）');
            setFolder();
        }
    }

    function getRightUrl(url) {
        var newUrl = url;
        if (/^thunder/i.test(url)) {
            var key = url.replace(/thunder:\/\//i, '');
            var temp = decode64(key);
            newUrl = decodeURIComponent(temp.slice(2, -2));
        }
        if (/^magnet/i.test(newUrl)) {
            var hash = newUrl.split('&')[0].substring(20) || newUrl.substring(20);
            if (hash.length == 32) {
                hash = base32To16(hash);
            }
            newUrl = 'magnet:?xt=urn:btih:' + hash;
        } else if (/^\/\//.test(url)) {
            newUrl = location.protocol + url;
        } else if (/^\/(?!\/)/.test(url)) {
            newUrl = location.protocol + '//' + location.host + url;
        }
        return newUrl;
    }

    function base32To16(str) {
        if (str.length % 8 !== 0 || /[0189]/.test(str)) {
            return str;
        }
        str = str.toUpperCase();
        var bin = "", newStr = "", i;
        for (i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            if (charCode < 65) charCode -= 24;
            else charCode -= 65;
            charCode = '0000' + charCode.toString(2);
            charCode = charCode.substr(charCode.length - 5);
            bin += charCode;
        }
        for (i = 0; i < bin.length; i += 4) {
            newStr += parseInt(bin.substring(i, i + 4), 2).toString(16);
        }
        return newStr;
    }

    function repeat(link) {
        var result = false;
        var A = link.slice(0, 60);
        if ($('.115offline').length == 0) return result;
        $('.115offline').each(function() {
            var B = $(this).data('href').slice(0, 60);
            if (A.toLowerCase() == B.toLowerCase()) {
                result = true;
                return false;
            }
        });
        return result;
    }

    function searchTask(json, link) {
        var dataEl = false;
        for (var i = 0; i < json.tasks.length; i++) {
            if (json.tasks[i].url == link || json.tasks[i].url == decodeURIComponent(link)) {
                dataEl = json.tasks[i];
                break;
            }
        }
        return dataEl;
    }

    function verify() {
        var time = new Date().getTime();
        var w = 335;
        var h = 500;
        var t = (window.screen.availHeight - h) / 2;
        var l = (window.screen.availWidth - w) / 2;
        var link = 'https://captchaapi.115.com/?ac=security_code&type=web&cb=Close911_' + time;
        var a = confirm('立即打开验证账号弹窗？');
        if (a) {
            var blocked = false;
            try {
                var wroxWin = window.open(link, '请验证账号', 'height=' + h + ',width=' + w + ',top=' + t + ',left=' + l + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
                if (wroxWin == null) {
                    blocked = true;
                }
            } catch (e) {
                blocked = true;
            }
            if (blocked) {
                alert('验证弹窗已被拦截，请允许本页面弹出式窗口！');
            }
        }
    }

    var offline = function() {
        return {
            getSign: function(key, save_name) {
                return new Promise(function(resolve, reject) {
                    if (/^\w+=/.test(key)) {
                        resolve(key);
                        return;
                    }

                    var UserID = GM_getValue('115ID') || '';
                    var cid = G.get('diy_folder') ? GM_getValue('offlineFolder') : '';
                    var title = save_name ? save_name : '';
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: sign_url,
                        responseType: 'json',
                        headers: {
                            "User-Agent": UA,
                            Origin: "https://115.com",
                        },
                        onload: function(result) {
                            if (result.responseText.indexOf('html') != -1) {
                                toastr.error('请先登录115网盘账号！', '离线任务添加失败。');
                                setTimeout(function() {
                                    var a = confirm('立即打开115网盘登录页面？');
                                    if (a) {
                                        GM_openInTab('https://115.com/?mode=login', false);
                                    }
                                }, 3000);
                                return;
                            }
                            var data = {
                                uid: UserID,
                                sign: result.response.sign,
                                time: result.response.time,
                                wp_path_id: cid,
                                savepath: title
                            };

                            if ($.isPlainObject(key)) {
                                var value = $.param($.extend(data, key));
                            } else {
                                var value = $.param(data) + `&url=${key}`;
                            }
                            resolve(value);
                        },
                        onerror: function(error) {
                            reject(error);
                        },
                    });
                });
            },

            getData: function(herf, key, save_name) {
                return offline.getSign(key, save_name).then(function(value) {
                    return new Promise(function(resolve, reject) {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            data: value,
                            url: herf,
                            responseType: 'json',
                            headers: {
                                "User-Agent": UA,
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "Accept": "application/json, text/javascript, */*; q=0.01",
                                Origin: "https://115.com",
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            onload: function(result) {
                                resolve(result.response);
                            },
                            onerror: function(error) {
                                reject(error);
                            },
                        });
                    });
                });
            },

            check: function(link, link2, one) {
                if (document.hidden) {
                    GM_setValue('noTimeOut', true);
                    toastr.options.timeOut = 0;
                } else {
                    GM_setValue('noTimeOut', false);
                    toastr.options.timeOut = 12000;
                }

                var c = 1;
                var retry = false;
                var txt2 = '5秒后自动重试，请稍等。';
                function add(retry, txt2) {
                    if (c == 6) {
                        console.log('离线结果查询异常。离线任务数量过多，请清空后再试。');
                        toastr.warning('离线任务数量过多，请清空后再试。', '离线结果查询异常！');
                        return;
                    }

                    var key = '';
                    var lists_url2 = lists_url + '&page=' + c;
                    console.log('离线任务数据地址：' + lists_url2);
                    offline.getData(lists_url2, key).then(function(json) {
                        console.log('离线任务列表第' + c + '页:');
                        console.log(json);
                        if (json.state) {
                            var dataEl = searchTask(json, link);
                            if (dataEl) {
                                var name = dataEl.del_path == '' ? dataEl.name : dataEl.del_path.slice(0, -1);
                                var a_del = `&nbsp;&nbsp;<a target="_blank" class="delTask" data=${dataEl.info_hash} href="javascript:void(0);" style="color:blue;" title="删除该离线任务">删除任务</a>`;
                                if (dataEl.status != -1) {
                                    if (dataEl.move == -1) {
                                        toastr.warning('空间不足，请到115扩容', '离线下载异常！');
                                        return;
                                    }
                                    var down_result = dataEl.percentDone.toFixed(0);
                                    var cid = dataEl.file_id || 0;
                                    if (down_result >= 99 && cid != 0) {
                                        var txt = `文件(夹)名：${name}，大小：${change(dataEl.size)}。`;
                                        resultMark(link2, 3);
                                        if (one) {
                                            console.log(txt + '离线下载已完成。');
                                            return;
                                        }

                                        if (show_result && !retry) {
                                            toastr.success(txt + a_list + a_del, '离线下载已完成', { timeOut: 5000 });
                                        }

                                        if (G.get('open_search')) {
                                            offline.search(dataEl.name, cid, function(search_result, video, j, num) {
                                                if (search_result) {
                                                    if (G.get('search_result')) {
                                                        var videoTxt = JSON.stringify(video);
                                                        var txt = `文件名：${video.name}，大小：${video.size}，时长：${tranTime(video.time)}。`;
                                                        var h1 = `<br><a target="_blank" class="115play" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="播放该视频">播放</a>`;
                                                        var h2 = `&nbsp;&nbsp;<a target="_blank" class="115down" data=${videoTxt} one="1" href="javascript:void(0);" style="color:blue;" title="下载该视频">下载</a>`;
                                                        var h3 = `&nbsp;&nbsp;<a target="_blank" class="115del" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="删除该视频文件夹">删除</a>`;
                                                        var h4 = `&nbsp;&nbsp;<a target="_blank" class="115newName" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="重命名该视频">重命名</a>`;
                                                        var h5 = `&nbsp;&nbsp;<a target="_blank" class="openFolder" data=${cid} href="javascript:void(0);" style="color:blue;" title="查看所属文件列表">查看</a>`;
                                                        toastr.success(txt + h1 + h2 + h3 + h4 + h5, `发现第 ${j} 个视频（共 ${num} 个）`);
                                                    }

                                                    if (G.get('open_Popup') && j == 1) {
                                                        setTimeout(function() {
                                                            var type = '115play';
                                                            palyData(video, type);
                                                        }, 500);
                                                    }
                                                } else {
                                                    if (dataEl.move == 2 || dataEl.move == 0 || dataEl.status == 0) {
                                                        var txt = '离线数据取回网盘中。';
                                                    } else {
                                                        var txt = '未发现任何视频文件。';
                                                    }
                                                    var h1 = `<br><a target="_blank" class="openFolder" data=${cid} href="javascript:void(0);" style="color:blue;" title="点击打开所属文件列表">打开文件列表</a>`;
                                                    toastr.warning(txt + txt2 + h1, '视频搜索无结果！');

                                                    if (!retry) {
                                                        setTimeout(function() {
                                                            retry = true;
                                                            txt2 = '';
                                                            toastr.clear();
                                                            console.log('重试搜索结果:');
                                                            add(retry, txt2);
                                                        }, 5000);
                                                    }
                                                }
                                            });
                                        }
                                    } else if (show_result) {
                                        resultMark(link2, 4);
                                        if (one) {
                                            console.log(`文件(夹)名：${name},已离线下载 ${down_result}%。`);
                                            return;
                                        }
                                        var txt = `文件(夹)名：${name}，下载进度为：<span style="color:purple;">${down_result}%</span>。`;
                                        toastr.warning(txt + a_list + a_del, '离线下载中...');
                                    }
                                } else if (show_result) {
                                    resultMark(link2, 4);
                                    if (one) {
                                        console.log(`文件(夹)名：${name},离线下载失败。`);
                                        return;
                                    } else if (dataEl.err == 10016) {
                                        var txt = '文件含违规内容，已自动拦截。';
                                    } else {
                                        var txt = '未知原因，请到115网盘查看。';
                                        var a_del = '';
                                    }
                                    toastr.error(txt + a_list + a_del, '离线下载失败！', { timeOut: 8000 });
                                    return;
                                }
                            } else {
                                console.log('第' + c + '页查询失败，无匹配数据');
                                if (c == json.page_count) {
                                    console.log('离线链接对比异常，已搜索所有离线列表页面，无返回结果。');
                                    toastr.warning('搜索参数错误。', '离线结果查询异常！', { timeOut: 5000 });
                                    return;
                                }
                                c++;
                                add();
                            }
                        } else {
                            toastr.error('查询离线结果失败。', '服务器错误！');
                            return;
                        }
                    });
                }
                add(retry, txt2);
            },

            addButton: function() {
                $('[href]').each(function() {
                    var url = $(this).attr('href');
                    var reg1 = /\.(torrent|rar|zip|7z|mp4|rmvb|mkv|avi)$/i;
                    var $El = $(this).parent().filter('li,td,th,:header').find('[Searched]');

                    if ((!down_reg.test(url) && !reg1.test(url)) || $(this).is('[Searched]') || $El.length > 1 || ($El.length = 1 && url.indexOf($El.attr('Searched')) != -1)) {
                        return;
                    }

                    if (down_reg.test(url)) {
                        $(this).attr('Searched', url.split(':')[0]);
                    } else if (/torrent$/i.test(url)) {
                        $(this).attr('Searched', 'torrent');
                    } else {
                        $(this).attr('Searched', 'other');
                    }

                    var link = getRightUrl(url);
                    if (repeat(link)) {
                        return;
                    }

                    $(this).css('display', 'inline-block');
                    $(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/115logo.ico" class="115offline" data-href=' + link + ' style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;" title="使用115网盘离线下载，右键复制地址\n' + link + '">');
                });
            },

            addLink: function() {
                $('a,button,span,li').each(function() {
                    var reg1 = /(^|\/|&|-|\.|\?|=|:|#|_|@)([a-f0-9]{40}|[a-z2-7]{32})(?!\w)/i;
                    var reg2 = /[a-z]{40}|[a-z]{32}/i;

                    if ($(this).next().addBack().is('[Searched],[href*="google"],[href*="motelppp.com"],[href*="bvmqkla.de"]') || $(this).find('img').length > 0) {
                        return;
                    }

                    var url = getAttribute(this);
                    if (url.length > 0) {
                        for (var i = 0; i < url.length; i++) {
                            if (down_reg.test(url[i]) || (reg1.test(url[i]) && !reg2.test(url[i].match(reg1)[2]))) {
                                if (down_reg.test(url[i])) {
                                    var value = url[i].split(':')[0];
                                    var templink = url[i];
                                } else {
                                    var value = 'magnet';
                                    var templink = 'magnet:?xt=urn:btih:' + url[i].match(reg1)[2];
                                }
                                var link = getRightUrl(templink);
                                if (repeat(link)) {
                                    return;
                                }
                                $(this).attr('Searched', value);
                                $(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/115logo.ico" class="115offline" data-href=' + link + ' style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;" title="使用115网盘离线下载2，右键复制地址\n' + link + '">');
                                return;
                            }
                        }
                    }
                });
            },

            addSelect: function() {
                if ($('.115offline').length < 3) return;

                $('.115offline:not([Sed])').each(function() {
                    $(this).attr('Sed', 1);
                    var url = $(this).data('href');
                    $(this).after('<input type="checkbox" class="115select" value=' + url + ' title="长按shift键，连续选择" style="z-index:9123456789;display:inline-block;cursor:pointer;height:16px!important;width:16px!important;margin:0px 2px 1px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;left:0px!important;top:0px!important;" />');
                });

                var sel = $('.115offline').length > 10 ? $('.115select:eq(-1),.115select:eq(0)') : $('.115select:eq(-1)');
                sel.each(function() {
                    if ($(this).is('[batched]')) return;
                    $(this).attr('batched', 1);
                    $(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/batch_down00.png" class="115offline_batch" style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 1px 2px;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:23px!important;width:23px!important;left:0px!important;top:0px!important;" title="使用115网盘批量离线下载所选地址，右键可全选等">');
                    $(this).parent().css('overflow', 'visible');
                });
            },

            search: function(name, cid, callback) {
                var title = new Array();
                title[0] = name.replace(/(\.|-|_)?(f?hd|sd|720p|1080p|full|mp4|avi|mkv|wmv|rmvb|rm|flv|f4v)/gi, ' ');
                title[1] = title[0].replace(/\/|&|-|\.|\?|=|:|#|_|@/g, ' ');
                title[2] = '.';

                var a = 0;
                function add2() {
                    if (a == 3) {
                        console.log('该文件夹无视频文件。');
                        callback(false);
                        return;
                    }
                    var searchLink = 'https://webapi.115.com/files/search?cid=' + cid + '&search_value=' + encodeURIComponent(title[a]) + '&type=4';
                    AjaxCall(searchLink, function(error, htmlTxt) {
                        if (typeof htmlTxt == 'undefined') {
                            a++;
                            add2();
                        } else {
                            var json = JSON.parse(htmlTxt);
                            if (a == 2 && json.folder.name == '云下载') {
                                callback(false);
                                return;
                            }

                            if (json.count > 0) {
                                var num = json.count;
                                for (var i = 0; i < num; i++) {
                                    var $dataEh = json.data[i];
                                    var video = {};
                                    video['name'] = name2($dataEh.n);
                                    video['pid'] = $dataEh.pc;
                                    video['cid'] = $dataEh.cid;
                                    video['fid'] = $dataEh.fid;
                                    video['size'] = change($dataEh.s);
                                    video['sha'] = $dataEh.sha;
                                    video['time'] = $dataEh.play_long;

                                    callback(true, video, i + 1, num);
                                    console.log('第' + a + '次搜索结果' + i + ':' + $dataEh.n + ' ' + video.size);
                                    if (i == 2) {
                                        return;
                                    }
                                }
                            } else {
                                a++;
                                add2();
                            }
                        }
                    });
                }
                add2();
            }
        };
    }();

    function change(number) {
        var size = "";
        if (number < 1024 * 1024 * 1024) {
            size = (number / (1024 * 1024)).toFixed(2) + "MB";
        } else {
            size = (number / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }
        var sizeStr = size + "";
        var index = sizeStr.indexOf(".");
        var dou = sizeStr.substr(index + 1, 2);
        if (dou == "00") {
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
        }
        return size;
    }

    function name2(txt) {
        var newName = txt.replace(/\.(?!\w{2,4}$)/g, '_').replace(/\s/g, '&nbsp;');
        return newName;
    }

    function tranTime(num) {
        var showTime = '';
        if (num > 3600) { showTime += ' ' + parseInt(num / 3600) + ' 小时'; num = num % 3600; }
        if (num > 60) { showTime += ' ' + parseInt(num / 60) + ' 分'; num = num % 60; }
        return showTime += ' ' + parseInt(num) + ' 秒';
    }

    function clickOne(el, t) {
        var time = t ? t : 5000;
        if (el.attr('clicked') == 1) {
            console.log('5s内不可点击该按钮');
            return false;
        } else {
            el.attr('clicked', 1);
            el.css('opacity', '0.2');
            setTimeout(function() {
                el.attr('clicked', 0);
                el.css('opacity', '0.7');
            }, time);
            return true;
        }
    }

    function resultMark(el, type) {
        if (el.length == 0 || !show_result) return;

        var urls = [];
        var color = { 1: '#00CCFF', 2: '#DA70D6', 3: '#AEDD81', 4: '#EB7347' }[type];
        for (var i = 0; i < el.length; i++) {
            urls.push(el[i].url);
            $('.115offline').each(function() {
                var link = $(this).data('href');
                var $al = $(this).prev();
                var m = $al.attr('marked');
                if ((el[i].url == link || el[i].url == decodeURIComponent(link)) && m != 3) {
                    $al.attr('marked', type).css('background-color', color);
                    $al.find('[style]').removeAttr('style');
                    return false;
                }
            });
        }
        return urls;
    }

    function getAttribute(e) {
        var data = [];
        $.each(e.attributes, function() {
            if (this.specified && this.value.length > 30) {
                data.push(this.value);
            }
        });
        if ($(e).text().length > 25) data.push($(e).text());
        return data;
    }

    function right_menu() {
        $('body').append(`
        <div class="115menu" style="width:97px;height:85px;z-index:9123456789;overflow:hidden;position:absolute;display:none;background-color:#D0D0D0">
            <ul style="padding:5px 7px;margin:0px;list-style:none;">
                <li><a href="javascript:;" class="right_menu00">全选</a></li>
                <li><a href="javascript:;" class="right_menu01">反选</a></li>
                <li><a href="javascript:;" class="right_menu02">复制所选</a></li>
                <li><a href="javascript:;" class="right_menu11">复制地址</a></li>
                <li><a href="javascript:;" class="right_menu12">种子下载1</a></li>
                <li><a href="javascript:;" class="right_menu13">种子下载2</a></li>
            </ul>
        </div>`);
        $('.115menu a').css({ 'line-height': '25px', 'text-decoration': 'none', 'color': '#2C3E50', 'padding': '1px 5px', 'font-size': '16px', 'font-family': 'arial' });
        $('.115menu a').hover(function() {
            $(this).css({ 'background-color': '#2777F8', 'color': '#FFF' });
        }, function() {
            $(this).css({ 'background-color': '', 'color': '#2C3E50' });
        });
    }

    function palyData(video, type) {
        var link = 'https://115.com/?ct=play&ac=location&pickcode=' + video.pid + '&hls=1';
        GM_openInTab(link, false);
    }

    $(document).ready(function() {
        if (localHref.indexOf('https://115.com/') != -1) {
            if (typeof (unsafeWindow.USER_ID) != 'undefined') {
                GM_setValue('115ID', unsafeWindow.USER_ID);
                console.log('115账号已登录，账号ID获取成功！');
            } else {
                console.log('115账号未登录，账号ID获取失败！');
            }

            var $topEl = $('#js_top_panel_box [id="js_filter_btn"]').addClass('btn-line');
            if (G.get('show_Star')) {
                $topEl.after('<a href="javascript:;" file_dialog_menu="star" class="button btn-line" id="js_star_list_btn"><i class="icon-operate"></i><span>星标</span></a>');
            }
            if (G.get('show_Offline')) {
                $topEl.after('<a href="javascript:;" file_dialog_menu="offline" class="button btn-line" id="js_offline_list_btn"><i class="icon-operate"></i><span>云下载</span></a>');
            }
            if (G.get('show_Task')) {
                $topEl.after('<a href="javascript:;" file_dialog_menu="task" class="button btn-line" id="js_task_list_btn"><i class="icon-operate"></i><span>链接任务</span></a>');
            }
            if (G.get('hide_sidebar')) {
                $('#js_left_panel_box').hide();
            }
        }

        if (localHref.indexOf('https://captchaapi.115.com') != -1) {
            var t_close;
            $('body').on('click', '.vcode-hint', function() {
                t_close = setTimeout(function() {
                    console.log('验证正确');
                    window.open('', '_self');
                    window.close();
                }, 200);
                return false;
            });
            $('.vcode-hint').on('DOMNodeInserted', function(e) {
                console.log('验证错误！');
                clearTimeout(t_close);
            });
        }

        if (localHref.indexOf('https://115.com/?cid=0&offset=0&mode=wangpan') != -1) {
            window.onload = function() {
                if (G.get('show_Alidity') && typeof unsafeWindow.USER_ID != 'undefined') {
                    var login_info = 'http://passportapi.115.com/app/1.0/web/9.2/login_log/login_devices';
                    AjaxCall(login_info, function(error, htmlTxt) {
                        var json = JSON.parse(htmlTxt);
                        if (json.state == 1) {
                            var time = json.data.last.utime;
                            var date = new Date(time * 1000);
                            var loginTime = formatDate(date, "yyyy年MM月dd日 HH:mm");
                            toastr.success('上次登录时间：' + loginTime, { timeOut: 5000 });
                            console.log('登录时间:\n' + loginTime);
                        } else {
                            var txt = json.error || '网络错误，未知时间！';
                            toastr.warning('上次登录时间：' + txt, { timeOut: 5000 });
                        }
                    });
                }
            }
        }

        var oldVer = GM_getValue('version') || '';
        if (G.get('show_Update') && oldVer != newVersion) {
            var txt = `115优化大师 ${newVersion} 更新日志：\n更新日期：2025年3月27日 \n1、优化“生成播放列表”功能；\n2、更新官方HTML5播放地址； \n3、升级部分依赖库版本;\n4、部分代码逻辑优化。`;
            setTimeout(function() {
                alert(txt);
            }, 2000);
            GM_setValue('version', newVersion);
        }
    });

    function formatDate(date, format) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return format;
    }

    $(document).ready(function() {
        $(document).on('click', function(e) {
            $('.115menu').hide();
        });

        $('body').on('click', '.115offline', function(e) {
            if (!clickOne($(this))) return;
            var link = $(this).data('href');
            var save_name = '';
            offline.getData(add_url, link, save_name).then(function(json) {
                console.log('离线任务添加结果:');
                console.log(json);
                var errNum = json.errcode || json.error_code || '';
                var link2 = [{'url': link}];
                if (json.state) {
                    if (show_result) {
                        var txt = '10秒后显示离线结果。';
                    } else {
                        var txt = link;
                        if (G.get('open_List')) {
                            setTimeout(function() {
                                GM_openInTab('https://115.com/?tab=offline&mode=wangpan', false);
                            }, 2000);
                        }
                    }
                    resultMark(link2, 1);
                    toastr.info(txt, '离线任务添加成功。', { timeOut: 10000 });
                    setTimeout(function() {
                        offline.check(link, link2);
                    }, 10000);
                } else if (errNum == 10008) {
                    toastr.warning('任务已存在，无需重复添加。', '离线任务添加无效!', { timeOut: 5000 });
                    if (G.get('open_List')) {
                        setTimeout(function() {
                            GM_openInTab('https://115.com/?tab=offline&mode=wangpan', false);
                        }, 2000);
                    }
                    resultMark(link2, 1);
                    offline.check(link, link2);
                } else if (errNum == 911) {
                    toastr.warning('账号异常，请验证账号。', '离线下载失败！', { timeOut: 5000 });
                    setTimeout(function() {
                        verify();
                    }, 1000);
                } else {
                    resultMark(link2, 2);
                    toastr.warning(json.error_msg, '离线任务添加失败!', { timeOut: 12000 });
                }
                console.log('离线链接:' + link + ' 添加结果:' + json.state + ' 原因:' + json.error_msg);
            }, function(error) {
                toastr.error('服务器繁忙，请稍后再试。', '离线任务添加异常!');
                console.log(error);
            });
            return false;
        });

        $('body').on('click', '.115offline_batch', function() {
            var l = $('.115select:checked').length;
            if (l < 10 && !clickOne($('.115offline_batch'))) {
                return;
            } else if (l < 2 || l > 100) {
                toastr.warning('单次选中数量限 <span style="color:red;">2-99</span> 个。', '批量离线操作无效！', { timeOut: 6000 });
                return;
            } else if (l > 10) {
                toastr.info('所选中地址较多，服务器需要较长时间响应，请稍等10s以上，未弹出结果前勿重复点击。', '温馨提示。', { timeOut: 10000 });
                if (!clickOne($('.115offline_batch'), 10000)) return;
            }

            var links = {};
            $('.115select:checked').each(function(e) {
                links['url[' + e + ']'] = $(this).attr('value');
            });

            offline.getData(add_urls, links).then(function(json) {
                console.log('批量离线任务添加结果:');
                console.log(json);
                var errNum = json.errcode || json.error_code || '';

                if (json.state) {
                    var s = 0, e = 0, f = 0;
                    var success_result = [], exist_result = [], all_result = [], fail_result = [];
                    for (var n = 0; n < json.result.length; n++) {
                        var dataEl = json.result[n];
                        if (dataEl.state) {
                            s++;
                            success_result.push(dataEl);
                            all_result.push(dataEl);
                        } else if (dataEl.errcode == 10008) {
                            e++;
                            exist_result.push(dataEl);
                            all_result.push(dataEl);
                        } else {
                            f++;
                            fail_result.push(dataEl);
                        }
                    }

                    var txt2 = '10秒后显示离线结果。';
                    var error = fail_result.length > 0 ? fail_result[0].error_msg : '任务已存在';
                    if (f + e == json.result.length) {
                        var txt1 = `有 <span style="color:red;">${f + e}</span> 个任务创建失败，原因：${error}。`;
                        toastr.warning(txt1 + a_list, '批量离线任务添加失败。', { timeOut: 10000 });
                    } else if (f + e > 0) {
                        if (e > 0) txt2 = '新建任务' + txt2;
                        var txt1 = `有 <span style="color:purple;">${s}</span> 个任务创建成功。有 <span style="color:red;">${f + e}</span> 个任务创建失败，原因：${error}。`;
                        toastr.info(txt1 + txt2 + a_list, '批量离线任务添加成功。', { timeOut: 10000 });
                    } else {
                        var txt1 = `有 <span style="color:purple;">${s}</span> 个任务创建成功。`;
                        toastr.info(txt1 + txt2 + a_list, '批量离线任务添加成功。', { timeOut: 10000 });
                    }

                    var success_links = resultMark(success_result, 1);
                    var exist_links = resultMark(exist_result, 1);
                    resultMark(fail_result, 2);

                    if (s + e > 20) {
                        toastr.warning('离线数量大于20，请自行到115查看。' + a_list, '未查询离线结果！', { timeOut: 6000 });
                        return;
                    }

                    if (s > 0) {
                        setTimeout(function() {
                            for (let h = 0; h < s; h++) {
                                var one = (all_result[0].url == success_links[h]) ? false : true;
                                var url2 = [{'url': success_links[h]}];
                                offline.check(success_links[h], url2, one);
                            }
                        }, 10000);
                    }
                    if (e > 0) {
                        for (let i = 0; i < e; i++) {
                            var one = (all_result[0].url == exist_links[i]) ? false : true;
                            var url2 = [{'url': exist_links[i]}];
                            offline.check(exist_links[i], url2, one);
                        }
                    }

                    if (f != json.result.length && G.get('open_List')) {
                        setTimeout(function() {
                            GM_openInTab('https://115.com/?tab=offline&mode=wangpan', false);
                        }, 2000);
                    }
                } else if (errNum == 911) {
                    toastr.warning('账号异常，请验证账号。', '批量离线下载失败！', { timeOut: 5000 });
                    setTimeout(function() {
                        verify();
                    }, 1000);
                } else {
                    toastr.warning(json.error_msg + a_list, '批量离线任务添加失败!', { timeOut: 12000 });
                }
            }, function(error) {
                toastr.error('服务器繁忙，请稍后再试。', '批量离线任务添加异常!');
                console.log(error);
            });
            return false;
        });

        $('body').on('click', '.115select', function(e) {
            if (e.shiftKey) {
                var first = $('.115select').index($('.115select:checked').first());
                var me = $('.115select').index($(this));
                var last = $('.115select').index($('.115select:checked').last());
                var Min = Math.min(first, me, last);
                var Max = Math.max(first, me, last);

                for (var i = Min; i <= Max; i++) {
                    $('.115select').eq(i).prop('checked', true);
                }
            }
        });

        $('body').on('click', '.openList:not([click="1"]), .openFolder:not([click="1"])', function() {
            $(this).attr('click', '1');
            if ($(this).is('.openList')) {
                var txt = 'tab=offline';
            } else {
                var fID = $(this).attr('data');
                var txt = 'cid=' + fID + '&offset=0';
            }
            GM_openInTab('https://115.com/?' + txt + '&mode=wangpan', false);
            return false;
        });

        $('body').on('contextmenu', '.115offline, .115offline_batch', function(e) {
            $('.115menu').css({ left: e.pageX + 'px', top: e.pageY + 'px' });
            $('.115menu').show();
            var link = $(this).data('href') || '';
            if ($(this).is('.115offline_batch')) {
                $('.115menu [class^="right_menu0"]').show();
                $('.115menu [class^="right_menu1"]').hide();
            } else if (/^magnet/i.test(link)) {
                $('.115menu').attr('data-href', link);
                $('.115menu [class^="right_menu1"]').show();
                $('.115menu [class^="right_menu0"]').hide();
            } else {
                $('.115menu').hide();
                GM_setClipboard(link);
                toastr.success('下载地址复制成功！');
            }
            return false;
        });

        $('body').on('click', '[class^="right_menu0"]', function() {
            if ($(this).is('.right_menu00')) {
                $('.115select').prop('checked', true);
            } else if ($(this).is('.right_menu01')) {
                $('.115select').each(function() {
                    if ($(this).prop('checked')) {
                        $(this).prop('checked', false);
                    } else {
                        $(this).prop('checked', true);
                    }
                });
            } else {
                if ($('.115select:checked').length == 0) {
                    toastr.warning('复制失败，未选中任何链接！');
                    return;
                }
                var urls = [];
                $('.115select:checked').each(function() {
                    urls.push($(this).attr('value'));
                });
                GM_setClipboard(urls.join('\r\n'));
                toastr.success(urls.length + ' 个下载地址复制成功！');
            }
            return false;
        });

        $('body').on('click', '[class^="right_menu1"]', function() {
            var link = $(this).parents('.115menu').data('href');
            var hash = link.match(/[a-f0-9]{40}/i)[0].toUpperCase();
            if ($(this).is('.right_menu11')) {
                GM_setClipboard(link);
                toastr.success('下载地址复制成功！');
            } else if ($(this).is('.right_menu12')) {
                GM_openInTab(`https://itorrents.org/torrent/${hash}.torrent`, false);
            } else if ($(this).is('.right_menu13')) {
                GM_openInTab(`https://btcache.me/torrent/${hash}`, false);
            }
            return false;
        });

        if (G.get('offline_Down') && localHref.indexOf('115.com') == -1) {
            if (localHref.match(/[0-9]mag\.net|yuhuage/) != null) {
                right_menu();
                var time1 = setInterval(function() {
                    offline.addButton();
                    if ($('.115offline').length >= 20) {
                        clearInterval(time1);
                    }
                }, 500);
                setTimeout(function() {
                    offline.addSelect();
                    $('.mag1').remove();
                    clearInterval(time1);
                }, 5000);
            } else if (localHref.match(/www\.gying\./) != null) {
                right_menu();
                if (localHref.match(/\/bt\//) != null) {
                    setTimeout(function() {
                        offline.addLink();
                        offline.addSelect();
                    }, 500);
                } else {
                    var time2 = setInterval(function() {
                        if ($('.torrent').length > 0) {
                            offline.addButton();
                            offline.addSelect();
                            clearInterval(time2);
                        }
                        if ($('.torrent').length == 0) {
                            clearInterval(time2);
                        }
                    }, 1500);
                }
            } else {
                var time3 = 300;
                if (localHref.match(/av/) != null) {
                    time3 = 3000;
                }
                setTimeout(function() {
                    offline.addButton();
                    if (localHref.match(/av/) != null) {
                        $('.movie td').removeAttr('onclick');
                    }
                }, time3);
                if (G.get('fuzzy_find')) {
                    setTimeout(function() {
                        offline.addLink();
                    }, time3 + 10);
                }
                setTimeout(function() {
                    right_menu();
                    offline.addSelect();
                    $('.mag1').remove();
                }, time3 + 20);
            }
        }
    });
})();