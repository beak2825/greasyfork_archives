// ==UserScript==
// @name              网盘精灵
// @version           1.0.8
// @description       网盘精灵，云盘、网盘搜索工具，提供了资源搜索功能，支持百度云盘、新浪微盘、蓝奏云盘,城通网盘，彩云网盘，天翼云盘的提取码获取，自动填充，为你提供便捷的资源搜索服务。
// @license           AGPL
// @match             *://pan.baidu.com/*
// @match             *://yun.baidu.com/*
// @match             *://*.lanzoux.com/*
// @match             *://*.lanzous.com/*
// @match             *://*.lanzoui.com/*
// @match             *://vdisk.weibo.com/*
// @match             *://pan.ishare1.cn/file/*
// @match             *://sn9.us/file/*
// @match             *://545c.com/file/*
// @match             *://474b.com/file/*
// @match             *://n802.com/file/*
// @match             *://t00y.com/file/*
// @match             *://caiyun.139.com/*
// @match             *://cloud.189.cn/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.10.0/dist/sweetalert2.all.min.js
// @connect           *
// @run-at            document-idle
// @antifeature tracking We use the URL to get the extract code
// @namespace https://greasyfork.org/users/215071
// @downloadURL https://update.greasyfork.org/scripts/416915/%E7%BD%91%E7%9B%98%E7%B2%BE%E7%81%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/416915/%E7%BD%91%E7%9B%98%E7%B2%BE%E7%81%B5.meta.js
// ==/UserScript==

;(() => {

    'use strict'

    let Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    function search() {
        document.querySelector('#search').addEventListener('click', function () {
            if (window.document.querySelector('#searchValue').value != "") {
                var searchValue = document.querySelector('#searchValue').value;
                window.open("https://feiyu100.cn/search?q=" + searchValue)
            } else {
                window.open("https://feiyu100.cn/home")
            }
        });
    }

    var apiBase = 'https://pansoapi.feiyu100.cn';

    //百度网盘 获取提取码
    if ((window.location.href.indexOf('init') >= 0 && window.location.href.indexOf('pan.baidu.com') >= 0)
        || (window.location.href.indexOf('init') >= 0 && window.location.href.indexOf('yun.baidu.com') >= 0)) {
        var link = window.location.href;
        window.localStorage.setItem('link', link);

        $.ajax({
            url: `${apiBase}/api/index/getCodeFromUrl`,
            method: "POST",
            data: {
                link: link,
            },
            success: function (data) {
                console.log(data);
                if (data.status === 100) {
                    if (data.data.length > 0) {
                        //填充提取码
                        document.querySelector('#accessCode').value = data.data;

                        //插入提示
                        Toast.fire({
                            icon: 'success',
                            text: '获取提取码成功！'
                        })
                    } else {
                        //插入提示
                        Toast.fire({
                            icon: 'error',
                            text: '未能找到提取码！'
                        })
                    }
                }
            },
            error: function (e) {
                console.log("发生异常" + e);
            },
        });
        if (window.document.querySelectorAll("#doc").length > 0) {
            var doc = document.querySelector('#doc');
            var panel = document.createElement('div');
            panel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;margin-top:50px;">
            <input class="QKKaIE LxgeIt" id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            doc.appendChild(panel);
        }

        document.querySelector('#search').addEventListener('click', function () {
            if (window.document.querySelector('#searchValue').value != "") {
                var searchValue = document.querySelector('#searchValue').value;
                window.open("https://feiyu100.cn/search?q=" + searchValue)
            } else {
                window.open("https://feiyu100.cn/home")
            }
        });
        //监听点击提取按钮，存储提取码
        document.querySelector('#submitBtn a').addEventListener('click', function () {
            var code = document.getElementById('accessCode').value;
            if (code) {
                localStorage.setItem(link, code);
            }
        });
    }


    //微盘
    if (window.location.href.indexOf("vdisk.weibo.com") >= 0) {
        if (window.document.querySelectorAll('.my_vdisk_main').length > 0) {
            var vipanel = document.createElement('div');
            vipanel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var vidiv = document.querySelector('.breadcrumb');
            vidiv.parentNode.insertBefore(vipanel, vidiv);
        } else {
            var vipanel2 = document.createElement('div');
            vipanel2.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var vidiv2 = document.querySelector('.vdmain_part');
            vidiv2.parentNode.insertBefore(vipanel2, vidiv2);
        }


        document.querySelector('#search').addEventListener('click', function () {
            if (window.document.querySelector('#searchValue').value != "") {
                var searchValue = document.querySelector('#searchValue').value;
                window.open("https://feiyu100.cn/search?q=" + searchValue)
            } else {
                window.open("https://feiyu100.cn/home")
            }
        });
        var wbLink = '';
        var wbExtractCode = '';
        var wbTitle = '';
        var dirStruct = {
            name: '',
            size: '',
        };
        var wbDirStruct = [];
        var wbShareTime = '';
        var wbTotalSize = '';
        window.onload = function () {
            var interval = setInterval(function () {
                if (window.document.querySelectorAll('.page_down_filename').length > 0
                    || window.document.querySelectorAll('.page_down_filename').length > 0) {
                    clearInterval(interval);
                    wbLink = window.location.href;
                    if (window.document.querySelector('.btn_vdisk_size')) {
                        wbTotalSize = window.document.querySelector('.btn_vdisk_size').innerHTML;
                    } else {
                        wbTotalSize = '';
                    }

                    //文件夹
                    if (window.document.querySelector('.scroll_content')) {
                        for (let i = 0; i < document.querySelectorAll('#fileListBody tr').length; i++) {
                            var obj = {
                                name: '',
                                size: '',
                            };
                            obj.name = window.document.querySelectorAll('.sort_name_intro a')[i].innerText;
                            if (window.document.querySelectorAll('.sort_size_m')[i].innerText) {
                                obj.size = window.document.querySelectorAll('.sort_size_m')[i].innerText;
                            } else {
                                obj.size = '-';
                            }
                            wbDirStruct.push(obj)

                            wbTitle = window.document.querySelector('.page_down_filename').innerText;
                        }
                    } else { //不是文件夹
                        wbTitle = window.document.querySelector('.page_down_filename').innerHTML;
                        dirStruct.name = window.document.querySelector('.page_down_filename').innerHTML;
                        dirStruct.size = window.document.querySelector('.btn_vdisk_size').innerHTML;
                        wbDirStruct.push(dirStruct);
                    }
                }
            })
        }
    }


    //蓝奏云
    if (window.location.href.indexOf('lanzou') >= 0) {
        var lzTitle = '';
        var lzLink = '';
        var lzExtractCode = '';
        var lzDirStructItem = {
            name: '',
            size: '',
        };
        var lzDirStruct = [];
        var lzShareTime = '';
        var lzTotalSize = '';
        var code = '';
        //获取提取码
        $.ajax({
            url: `${apiBase}/api/index/getCodeFromUrl`,
            method: "POST",
            data: {
                link: window.location.href,
            },
            success: function (data) {
                console.log(data);
                if (data.status === 100) {
                    code = data.data;
                    if (window.document.querySelectorAll('#pwd').length > 0) {
                        if (window.document.querySelectorAll('#pwdload').length > 0) { //多文件
                            if (data.data.length > 0) {
                                window.document.querySelector('#pwd').value = data.data;
                                Toast.fire({
                                    icon: 'success',
                                    text: '获取提取码成功！'
                                })
                            } else {
                                Toast.fire({
                                    icon: 'error',
                                    text: '未能找到提取码！'
                                })
                            }
                        } else { //单文件
                            if (data.data.length > 0) {
                                window.document.querySelector('#pwd').value = data.data;
                                Toast.fire({
                                    icon: 'success',
                                    text: '获取提取码成功！'
                                })
                            } else {
                                Toast.fire({
                                    icon: 'error',
                                    text: '未能找到提取码！'
                                })
                            }
                        }
                    } else {
                        console.log('无需提取码');
                    }
                }
            },
            error: function (e) {
                console.log("发生异常" + e)
            },
        });


        if (window.document.querySelectorAll('.passwddiv-input .passwddiv-btn').length > 0) { //单文件(有提取码)
            var file = document.querySelector('#passwddiv');
            var ele = document.createElement('div');
            ele.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:30px;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            file.appendChild(ele);

            document.querySelector('#search').addEventListener('click', function () {
                if (window.document.querySelector('#searchValue').value != "") {
                    var searchValue = document.querySelector('#searchValue').value;
                    window.open("https://feiyu100.cn/search?q=" + searchValue)
                } else {
                    window.open("https://feiyu100.cn/home")
                }
            });

            window.document.querySelector('.passwddiv-input .passwddiv-btn').addEventListener('click', function () {
                var lzpanel = document.createElement('div');
                lzpanel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:70px;position:relative;">
            <input id="searchValue1" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
                var lzdiv = document.querySelector('.n_box');
                lzdiv.parentNode.insertBefore(lzpanel, lzdiv);

                document.querySelector('#search').addEventListener('click', function () {
                    if (window.document.querySelector('#searchValue1').value != "") {
                        var searchValue = document.querySelector('#searchValue1').value;
                        window.open("https://feiyu100.cn/search?q=" + searchValue)
                    } else {
                        window.open("https://feiyu100.cn/home")
                    }
                });

                window.localStorage.setItem(window.location.href, window.document.querySelector('#pwd').value);
                window.localStorage.setItem('lzLink', window.location.href);
                var a = setInterval(function () {
                    if (window.document.querySelector('#filenajax').innerText && window.document.querySelector('#filenajax').innerText != "文件") {
                        clearInterval(a);
                        if (window.location.href === window.localStorage.getItem('lzLink')) {
                            lzExtractCode = window.localStorage.getItem(window.localStorage.getItem('lzLink'));
                        } else {
                            lzExtractCode = '';
                        }
                        if (window.document.querySelector('#file')) {
                            lzTitle = window.document.querySelector('#filenajax').innerText;
                            lzLink = window.location.href;
                            if (window.document.querySelector('.n_file_info span.n_file_infos').innerText) {
                                lzShareTime = window.document.querySelector('.n_file_info span.n_file_infos').innerText;
                            } else {
                                lzShareTime = '';
                            }
                            if (window.document.querySelector('.n_filesize').innerText) {
                                lzTotalSize = window.document.querySelector('.n_filesize').innerText.match(/大小：(\S*)/)[1];
                                lzDirStructItem.name = window.document.querySelector('#filenajax').innerText;
                                lzDirStructItem.size = window.document.querySelector('.n_filesize').innerText.match(/大小：(\S*)/)[1];
                                lzDirStruct.push(lzDirStructItem);
                            } else {
                                lzTotalSize = '';
                                lzDirStructItem.name = window.document.querySelector('#filenajax').innerText;
                                lzDirStructItem.size = '-';
                                lzDirStruct.push(lzDirStructItem);
                            }
                        }

                    }
                }, 1);
            });
        } else if (window.document.querySelector('.btnpwd#sub')) { //多文件（有提取码）
            var lzpanel2 = document.createElement('div');
            lzpanel2.innerHTML = `
            <div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var lzdiv2 = document.querySelector('#pwdload');
            lzdiv2.parentNode.insertBefore(lzpanel2, lzdiv2);


            document.querySelector('#search').addEventListener('click', function () {
                if (window.document.querySelector('#searchValue').value != "") {
                    var searchValue = document.querySelector('#searchValue').value;
                    window.open("https://feiyu100.cn/search?q=" + searchValue)
                } else {
                    window.open("https://feiyu100.cn/home")
                }
            });
            window.document.querySelector('.btnpwd#sub').addEventListener('click', function () {
                window.localStorage.setItem(window.location.href, window.document.querySelector('#pwd').value);
                window.localStorage.setItem('lzLink', window.location.href);
                var interval = setInterval(function () {
                    if (window.document.querySelectorAll('.d div#sp_name').length > 0 && window.document.querySelectorAll('#infos #name a').length > 0) {
                        clearInterval(interval);
                        if (window.location.href === window.localStorage.getItem('lzLink')) {
                            lzExtractCode = window.localStorage.getItem(window.localStorage.getItem('lzLink'));
                        } else {
                            lzExtractCode = '';
                        }
                        lzTitle = window.document.querySelector('.d div#sp_name').innerText;
                        lzLink = window.location.href;
                        lzTotalSize = '';
                        lzDirStructItem.name = window.document.querySelector('#infos #name a').innerText;
                        if (window.document.querySelector('#infos #size').innerText) {
                            lzDirStructItem.size = window.document.querySelector('#infos #size').innerText;
                        } else {
                            lzDirStructItem.size = '-';
                        }
                        lzDirStruct.push(lzDirStructItem);
                        lzShareTime = '';

                    }
                }, 1);
            });
        }
        //单文件无提取码
        else if (window.document.querySelector('#filenajax').innerText && window.document.querySelector('#filenajax').innerText != "文件") {
            var lzpanel = document.createElement('div');
            lzpanel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:70px;position:relative;">
            <input id="searchValue1" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var lzdiv = document.querySelector('.n_box');
            lzdiv.parentNode.insertBefore(lzpanel, lzdiv);

            document.querySelector('#search').addEventListener('click', function () {
                if (window.document.querySelector('#searchValue1').value != "") {
                    var searchValue = document.querySelector('#searchValue1').value;
                    window.open("https://feiyu100.cn/search?q=" + searchValue)
                } else {
                    window.open("https://feiyu100.cn/home")
                }
            });
            var a = setInterval(function () {
                if (window.document.querySelector('#filenajax').innerText && window.document.querySelector('#filenajax').innerText != "文件") {
                    clearInterval(a);
                    if (window.location.href === window.localStorage.getItem('lzLink')) {
                        lzExtractCode = window.localStorage.getItem(window.localStorage.getItem('lzLink'));
                    } else {
                        lzExtractCode = '';
                    }
                    if (window.document.querySelector('#file')) {
                        lzTitle = window.document.querySelector('#filenajax').innerText;
                        lzLink = window.location.href;
                        if (window.document.querySelector('.n_file_info span.n_file_infos').innerText) {
                            lzShareTime = window.document.querySelector('.n_file_info span.n_file_infos').innerText;
                        } else {
                            lzShareTime = '';
                        }
                        if (window.document.querySelector('.n_filesize').innerText) {
                            lzTotalSize = window.document.querySelector('.n_filesize').innerText.match(/大小：(\S*)/)[1];
                            lzDirStructItem.name = window.document.querySelector('#filenajax').innerText;
                            lzDirStructItem.size = window.document.querySelector('.n_filesize').innerText.match(/大小：(\S*)/)[1];
                            lzDirStruct.push(lzDirStructItem);
                        } else {
                            lzTotalSize = '';
                            lzDirStructItem.name = window.document.querySelector('#filenajax').innerText;
                            lzDirStructItem.size = '-';
                            lzDirStruct.push(lzDirStructItem);
                        }
                    }
                    lzLink = window.location.href;
                    lzExtractCode = '';

                }
            }, 1);
        } else { //无提取码
            var lzpanel3 = document.createElement('div');
            lzpanel3.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;">
            <input id="searchValue2" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var lzdiv3 = document.querySelector('.d');
            lzdiv3.parentNode.insertBefore(lzpanel3, lzdiv3);
            document.querySelector('#search').addEventListener('click', function () {
                if (window.document.querySelector('#searchValue2').value != "") {
                    var searchValue = document.querySelector('#searchValue2').value;
                    window.open("https://feiyu100.cn/search?q=" + searchValue)
                } else {
                    window.open("https://feiyu100.cn/home")
                }
            });
            var lzinterval = setInterval(function () {
                if (window.document.querySelectorAll('.d div').length > 0) {
                    clearInterval(lzinterval);
                    lzTitle = window.document.querySelector('.d div').innerText;
                    lzLink = window.location.href;
                    if (window.document.querySelectorAll('.d2 table td')[0]) {
                        window.document.querySelectorAll('.d2 table td')[0].innerText.split('\n').forEach(function (item) {
                            if (item.includes('文件大小')) {
                                console.log(item);
                                var length = item.length
                                lzTotalSize = item.slice(5, length);
                                console.log(lzTotalSize);
                            }
                        })
                        lzDirStructItem.name = window.document.querySelector('.d div').innerText;
                        lzDirStructItem.size = lzTotalSize;
                        lzDirStruct.push(lzDirStructItem);
                    } else {
                        lzTotalSize = '-';
                        lzDirStructItem.name = window.document.querySelector('.d div').innerText;
                        lzDirStructItem.size = '-';
                        lzDirStruct.push(lzDirStructItem);
                        lzShareTime = "";
                    }
 
                }
            }, 1);
        }
    }


    //城通网盘
    if (window.location.href.indexOf('sn9.us/file') >= 0 || window.location.href.indexOf('pan.ishare1.cn/file') >= 0 || window.location.href.indexOf('545c.com/file') >= 0
        || window.location.href.indexOf("474b.com/file") >= 0 || window.location.href.indexOf('n802.com/file') >= 0 || window.location.href.indexOf('t00y.com/file') >= 0) {
        var ctLink = '';
        var ctExtractCode = '';
        var ctTitle = '';
        var ctDirStructItem = {
            name: '',
            size: '',
        };
        var ctDirStruct = [];
        var ctShareTime = '';
        var ctTotalSize = '';
        var ctInterval = setInterval(function () {
            if (window.document.querySelectorAll('h4.text-white').length > 0) {
                var card = document.querySelector('.card .card-body');
                var cardItem = document.createElement('div');
                cardItem.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;margin-top:10px;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
                card.appendChild(cardItem);

                document.querySelector('#search').addEventListener('click', function () {
                    if (window.document.querySelector('#searchValue').value != "") {
                        var searchValue = document.querySelector('#searchValue').value;
                        window.open("https://feiyu100.cn/search?q=" + searchValue)
                    } else {
                        window.open("https://feiyu100.cn/home")
                    }
                });
                clearInterval(ctInterval);
                ctLink = window.location.href;
                ctTitle = window.document.querySelector('h4.text-white').innerText.slice(5);
                var temp = window.document.querySelectorAll('.fs--1')[1].innerText;
                ctTotalSize = temp.split(' ')[0].match(/文件大小(\S*)/)[1] + temp.split(" ")[1];
                ctShareTime = temp.split(" ")[2].match(/上传时间(\S*)/)[1];
                ctDirStructItem.name = window.document.querySelector('h4.text-white').innerText.slice(5);
                ctDirStructItem.size = temp.split(' ')[0].match(/文件大小(\S*)/)[1] + temp.split(" ")[1];
                ctDirStruct.push(ctDirStructItem);

            }
        })
    }


    //彩云
    if (window.location.href.indexOf('caiyun.139.com') >= 0) {
        var cyInterval = setInterval(function () {
            if (window.document.querySelectorAll('.token-form .btn-token').length > 0 || document.querySelectorAll('#rowlist .list-row').length > 0) {
                clearInterval(cyInterval);
                var cyLink = '';
                var cyExtractCode = '';
                var cyTitle = '';
                var cyDirStruct = [];
                var cyShareTime = '';
                var cyTotalSize = '';
                //获取彩云链接提取码
                $.ajax({
                    url: `${apiBase}/api/index/getCodeFromUrl`,
                    method: "POST",
                    data: {
                        link: window.location.href,
                    },
                    success: function (data) {
                        if (data.status === 100) {
                            code = data.data;
                            if (window.document.querySelectorAll('.token-input-group input').length > 0) {
                                if (data.data.length > 0) {
                                    document.querySelector('.token-input-group input').value = data.data;
                                    Toast.fire({
                                        icon: 'success',
                                        text: '获取提取码成功！'
                                    })
                                } else {
                                    Toast.fire({
                                        icon: 'error',
                                        text: '未能找到提取码！'
                                    })
                                }
                            } else {
                                console.log('无需提取码');
                            }
                        }
                    },
                    error: function (e) {
                        console.log("发生异常" + e)
                    },
                });

                if (window.document.querySelectorAll('.token-input-group input').length > 0) { //有提取码
                    var cypanel = document.createElement('div');
                    cypanel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:0px;position:relative;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
                    var cydiv = document.querySelector('.token');
                    cydiv.parentNode.insertBefore(cypanel, cydiv);
                    search();
                    document.querySelector('.token-input-group input').addEventListener("input", function (e) {
                        console.log(e.target.value);
                        var link = window.location.href;
                        var code = e.target.value;
                        window.localStorage.setItem(link, code);
                        window.localStorage.setItem('cyLink', link);
                    });
                    document.querySelector('.btn-token').addEventListener('click', function () {
                        var cyInterval2 = setInterval(function () {
                            if (document.querySelectorAll('#rowlist .list-row').length > 0) {
                                clearInterval(cyInterval2);
                                if (window.location.href === window.localStorage.getItem('cyLink')) {
                                    cyLink = window.localStorage.getItem('cyLink');
                                    cyExtractCode = window.localStorage.getItem(cyLink);
                                } else {
                                    cyLink = window.location.href;
                                    cyExtractCode = '';
                                }
                                if (document.querySelectorAll('#rowlist .list-row').length > 0) {
                                    for (let i = 0; i < document.querySelectorAll('#rowlist .list-row').length; i++) {
                                        var obj = {
                                            name: '',
                                            size: '',
                                        };
                                        obj.name = document.querySelectorAll('.row-col-name a')[i].innerText;
                                        obj.size = document.querySelectorAll('#rowlist .row-col-4')[i].innerText;
                                        cyDirStruct.push(obj);

                                    }
                                    cyTitle = document.querySelectorAll('.row-col-name a')[0].innerText
                                }
                                cyShareTime = document.querySelectorAll('.share-info .s_info span')[0].innerText
            
                            }
                        }, 1)
                    })
                }
                if (document.querySelectorAll('#rowlist .list-row').length > 0) {
                    var cypanel1 = document.createElement('div');
                    cypanel1.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:0px;position:relative;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
                    var cydiv1 = document.querySelector('.main-top');
                    cydiv1.parentNode.insertBefore(cypanel1, cydiv1);
                    search();
                    var cyInterval3 = setInterval(function () {
                        if (document.querySelectorAll('#rowlist .list-row').length > 0) {
                            clearInterval(cyInterval3);
                            if (window.location.href === window.localStorage.getItem('cyLink')) {
                                cyLink = window.localStorage.getItem('cyLink');
                                cyExtractCode = window.localStorage.getItem(cyLink);
                            } else {
                                cyLink = window.location.href;
                                cyExtractCode = '';
                            }
                            if (document.querySelectorAll('#rowlist .list-row').length > 0) {
                                for (let i = 0; i < document.querySelectorAll('#rowlist .list-row').length; i++) {
                                    var obj = {
                                        name: '',
                                        size: '',
                                    };
                                    obj.name = document.querySelectorAll('.row-col-name a')[i].innerText;
                                    obj.size = document.querySelectorAll('#rowlist .row-col-4')[i].innerText;
                                    cyDirStruct.push(obj);

                                }
                                cyTitle = document.querySelectorAll('.row-col-name a')[0].innerText;
                            }
                            cyShareTime = document.querySelectorAll('.share-info .s_info span')[0].innerText
      
                        }
                    }, 1)
                }
            }
        }, 1)
    }


    //天翼云
    if (window.location.href.indexOf('cloud.189.cn') >= 0) {
        var tyLink = '';
        var tyExtractCode = '';
        var tyTitle = '';
        var tyDirStructItem = {
            name: '',
            size: '',
        }
        var tyDirStruct = [];
        var tyShareTime = '';
        var tyTotalSize = '';

        //获取提取码
        $.ajax({
            url: `${apiBase}/api/index/getCodeFromUrl`,
            method: "POST",
            data: {
                link: window.location.href,
            },
            success: function (data) {
                if (data.status === 100) {

                    if (window.document.querySelectorAll('#code_txt').length > 0) {
                        if (data.data.length > 0) {
                            window.document.querySelector('#code_txt').value = data.data;

                            Toast.fire({
                                icon: 'success',
                                text: '获取提取码成功！'
                            })
                        } else {
                            Toast.fire({
                                icon: 'error',
                                text: '未能找到提取码！'
                            })

                        }
                    } else {
                        console.log('无需提取码');
                    }
                }
            },
            error: function (e) {
                console.log("发生异常" + e)
            },
        });
        if (window.document.querySelectorAll('.access-code-item').length > 0) { //有提取码
            var typanel = document.createElement('div');
            typanel.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:60px;position:relative;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var tydiv = document.querySelector('.file-info');
            tydiv.parentNode.insertBefore(typanel, tydiv);
            search();
            window.document.querySelector('.access-code-item a').addEventListener('click', function () {
                window.localStorage.setItem(window.location.href, window.document.querySelector('#code_txt').value);
                window.localStorage.setItem('tyLink', window.location.href);
                var tyInterval = setInterval(function () {
                    if (window.document.querySelector('.info-detail .title').innerText.length > 0) {
                        clearInterval(tyInterval);
                        if (window.location.href === window.localStorage.getItem('tyLink')) {
                            tyExtractCode = window.localStorage.getItem(window.localStorage.getItem('tyLink'));
                        } else {
                            lzExtractCode = '';
                        }
                        tyLink = window.location.href;
                        tyTitle = window.document.querySelector('.info-detail .title span').innerText;
                        tyDirStructItem.name = window.document.querySelector('.info-detail .title span').innerText;
                        if (window.document.querySelectorAll('.info-detail .title span').length > 1) {
                            var length = window.document.querySelectorAll('.info-detail .title span')[1].innerText.length;
                            tyTotalSize = window.document.querySelectorAll('.info-detail .title span')[1].innerText.slice(1, length - 1);
                            tyDirStructItem.size = window.document.querySelectorAll('.info-detail .title span')[1].innerText.slice(1, length - 1);
                        } else {
                            tyTotalSize = '-';
                            tyDirStructItem.size = '-';
                        }
                        tyDirStruct.push(tyDirStructItem);
                        var long = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].length;
                        tyShareTime = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].slice(3, long);
       
                    }
                }, 1);
            });
        } else if (window.document.querySelector('.outlink-box-s')) {
            var typanel2 = document.createElement('div');
            typanel2.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:60px;position:relative;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var tydiv2 = document.querySelector('.outlink-box-s');
            tydiv2.parentNode.insertBefore(typanel2, tydiv2);
            search();
            var tyInterval2 = setInterval(function () {
                if (window.document.querySelector('.outlink-box-s .file-info h1').innerText.length > 0) {
                    clearInterval(tyInterval2);
                    if (window.location.href === window.localStorage.getItem('tyLink')) {
                        tyExtractCode = window.localStorage.getItem(window.localStorage.getItem('tyLink'));
                    } else {
                        lzExtractCode = '';
                    }
                    tyLink = window.location.href;
                    tyTitle = window.document.querySelector('.outlink-box-s .file-info h1 span').innerText;
                    tyDirStructItem.name = window.document.querySelector('.outlink-box-s .file-info h1 span').innerText;
                    if (window.document.querySelectorAll('.outlink-box-s .file-info h1 span').length > 1) {
                        var length = window.document.querySelectorAll('.outlink-box-s .file-info h1 span')[1].innerText.length;
                        tyTotalSize = window.document.querySelectorAll('.outlink-box-s .file-info h1 span')[1].innerText.slice(1, length - 1);
                        tyDirStructItem.size = window.document.querySelectorAll('.outlink-box-s .file-info h1 span')[1].innerText.slice(1, length - 1);
                    } else {
                        tyTotalSize = '-';
                        tyDirStructItem.size = '-';
                    }
                    tyDirStruct.push(tyDirStructItem);
                    var long = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].length;
                    tyShareTime = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].slice(3, long);
   
                }
            }, 1)
        } else if (window.document.querySelector('.info-detail .title').innerText.length > 0) {
            var typanel3 = document.createElement('div');
            typanel3.innerHTML = `
<div class="clearfix input-area" style="width:100%;display:flex;justify-content:center;padding-top:10px;top:0px;position:relative;">
            <input id="searchValue" tabindex="1" type="text" placeholder="资源搜索：请输入关键字" style="width:280px;border:1px solid #f2f2f2;padding:8px 10px;height:20px;line-height:20px;border-radius:4px;">
            <div>
            <button style="width: 100%;height: 100%;background: #09aaff;border: none;color: white;border-radius: 5px;margin: 0 20px;" id="search">搜索</button>
            </div>
        </div>
                    `;
            var tydiv3 = document.querySelector('.file-info');
            tydiv3.parentNode.insertBefore(typanel3, tydiv3);
            search();
            var tyInterval = setInterval(function () {
                if (window.document.querySelector('.info-detail .title').innerText.length > 0) {
                    clearInterval(tyInterval);
                    if (window.location.href === window.localStorage.getItem('tyLink')) {
                        tyExtractCode = window.localStorage.getItem(window.localStorage.getItem('tyLink'));
                    } else {
                        lzExtractCode = '';
                    }
                    tyLink = window.location.href;
                    tyTitle = window.document.querySelector('.info-detail .title span').innerText;
                    tyDirStructItem.name = window.document.querySelector('.info-detail .title span').innerText;
                    if (window.document.querySelectorAll('.info-detail .title span').length > 1) {
                        var length = window.document.querySelectorAll('.info-detail .title span')[1].innerText.length;
                        tyTotalSize = window.document.querySelectorAll('.info-detail .title span')[1].innerText.slice(1, length - 1);
                        tyDirStructItem.size = window.document.querySelectorAll('.info-detail .title span')[1].innerText.slice(1, length - 1);
                    } else {
                        tyTotalSize = '-';
                        tyDirStructItem.size = '-';
                    }
                    tyDirStruct.push(tyDirStructItem);
                    var long = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].length;
                    tyShareTime = window.document.querySelector('#J_ShareDate').innerText.split(" ")[0].slice(3, long);
   
                }
            }, 1);
        }
    }

})()



