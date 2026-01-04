// ==UserScript==
// @name         B站搜索页美化
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/Trrrrw/UserScript
// @version      0.1.5
// @description  美化search.bilibili.com页面
// @author       Trrrrw
// @match        https://search.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.26.3/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.onload
// @grant        window.onurlchange
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/458903/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/458903/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==


(function () {
    'use strict';

    GM_addElement('link', {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.26.3/dist/sweetalert2.min.css'
    })

    //设置初始化
    let value = [{
        name: 'imgUrl',
        value: 'https://i0.hdslb.com/bfs/new_dyn/2e762660113a84fe20affb3ec16eba386823116.jpg'
    }, {
        name: 'imgFile',
        value: ''
    }, {
        name: 'videoUrl',
        value: ''
    }, {
        name: 'videoFile',
        value: ''
    }, {
        name: 'upBtnSwitch',
        value: true
    }, {
        name: 'bgType',
        value: 1
    }];
    value.forEach((v) => {
        GM_getValue(v.name) === undefined && GM_setValue(v.name, v.value);
    });



    GM_registerMenuCommand("⚙️设置", () => {
        Swal.fire({
            title: '⚙️设置',
            html: `<label for="bgType">设置背景类型：</label>` +
                `<select id="bgType" name="bgTypeSettings">
                 <option value="1" ${GM_getValue('bgType') == '1' ? 'selected' : ''}>网络图片</option>
                 <option value="2" ${GM_getValue('bgType') == '2' ? 'selected' : ''}>本地图片</option>
                 <option value="3" ${GM_getValue('bgType') == '3' ? 'selected' : ''}>网络视频</option>
                 <!--<option value="4" ${GM_getValue('bgType') == '4' ? 'selected' : ''}>本地视频</option>-->
             </select><br/>`+
                `<input id="up-button-checkbox" type="checkbox" ${GM_getValue('upBtnSwitch') ? 'checked' : ''}>是否显示投稿按钮</input><br/>` +
                `<div id = "setting1" style="display:${GM_getValue('bgType') != '1' ? 'none' : ''}">
                <label class="swal2-input-label">🖼️输入图片链接</label><input id="bgimg-url" class="swal2-input" type="url" placeholder="输入图片链接" value="${GM_getValue('imgUrl')}">
            </div>`+
                `<div id = "setting2" style="display:${GM_getValue('bgType') != '2' ? 'none' : ''}">
                <label class="swal2-input-label">🖼️选择图片文件</label><input id="bgimg-file" class="swal2-file" type="file" accept="image/*" aria-label="Upload your profile picture">
            </div>`+
                `<div id = "setting3" style="display:${GM_getValue('bgType') != '3' ? 'none' : ''}">
                <label class="swal2-input-label">🎬输入视频链接</label><input id="bgvideo-url" class="swal2-input" type="url" placeholder="输入视频链接" value="${GM_getValue('videoUrl')}">
            </div>`+
                `<div id = "setting4" style="display:${GM_getValue('bgType') != '4' ? 'none' : ''}">
                <label class="swal2-input-label">🎬选择视频文件</label><input id="bgvideo-file" class="swal2-file" type="file" accept="video/*" aria-label="Upload your profile picture">
            </div>`
        }).then((res) => {
            if (res.isConfirmed) {
                history.go(0)
            }
        })
        document.getElementById('up-button-checkbox').addEventListener('change', (e) => {
            GM_setValue('upBtnSwitch', e.currentTarget.checked);
        })
        document.getElementById('bgimg-url').addEventListener('change', (e) => {
            if (e.currentTarget.value) {
                GM_setValue('imgUrl', e.currentTarget.value);
            }
        })
        document.getElementById('bgimg-file').addEventListener('change', (e) => {
            if (e.isTrusted) {
                const selectedFile = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (f) => {
                    GM_setValue('imgFile', f.target.result)
                };
                reader.readAsDataURL(selectedFile);
            }
        })
        document.getElementById('bgvideo-url').addEventListener('change', (e) => {
            if (e.currentTarget.value) {
                GM_setValue('videoUrl', e.currentTarget.value);
            }
        })
        document.getElementById('bgvideo-file').addEventListener('change', (e) => {
            if (e.isTrusted) {
                const selectedFile = e.target.files[0];
                var url = URL.createObjectURL(selectedFile);
                GM_setValue('videoFile', url);
            }
        })
        document.getElementById('bgType').addEventListener('change', (e) => {
            GM_addStyle(`#setting${e.target.value}{display: unset !important}`);
            GM_addStyle(`#setting${GM_getValue('bgType')}{display: none !important}`);
            GM_setValue('bgType', e.target.value);
        })
    });

    //删除元素
    let del_dom = [
        '#biliMainFooter',//footer
        '.side-buttons',//右下客服按钮
        '.right-entry-text',//右上按钮文字
        '.vip-wrap',//右上大会员
        '.center-title-text',//搜索栏上方文字“搜索”
        '.left-entry > .v-popover-wrap:nth-of-type(n+2)',//左上元素
        '.mini-header__title',//左上bilibili图标右侧“首页”
        '.search-panel:last-child',
        'html::-webkit-scrollbar'//滚动条
    ];
    if (!GM_getValue('upBtnSwitch')) {
        del_dom.push('.right-entry-item--upload')//投稿按钮
    } else {
        GM_addStyle('.bili-header .header-upload-entry{background: #00aeec !important;border-radius: 30px;}')//投稿按钮颜色圆角
    }
    del_dom.forEach((dom) => {
        GM_addStyle(`${dom}{display:none !important}`)
    });

    //更改样式
    //添加背景
    switch (GM_getValue('bgType')) {
        case '1':
            GM_addStyle(`body{background: url( ${GM_getValue('imgUrl')} );}`)
            break;
        case '2':
            GM_addStyle(`body{background: url( ${GM_getValue('imgFile')} );}`)
            break;
        case '3': {
            const sourceTag = document.createElement("source");
            sourceTag.src = GM_getValue('videoUrl');
            sourceTag.type = "video/mp4";
            const videoTag = document.createElement("video");
            videoTag.id = "bg-video";
            videoTag.muted = true;
            videoTag.autoplay = true;
            videoTag.loop = true;
            videoTag.style.cssText = `position: absolute;object-fit: cover;height: 100%;width: 100%;top: 0;left: 0;`;
            videoTag.appendChild(sourceTag);
            document.body.appendChild(videoTag);
            break;
        }
        case '4': {
            const sourceTag = document.createElement("source");
            sourceTag.src = GM_getValue('videoFile');
            sourceTag.type = "video/mp4";
            const videoTag = document.createElement("video");
            videoTag.id = "bg-video";
            videoTag.muted = true;
            videoTag.autoplay = true;
            videoTag.loop = true;
            videoTag.style.cssText = `position: absolute;object-fit: cover;height: 100%;width: 100%;top: 0;left: 0;`;
            videoTag.appendChild(sourceTag);
            document.body.appendChild(videoTag);
            break;
        }
        default:
            GM_setValue('bgType', '1');
    }
    // if(GM_getValue('isUrl')){
    //     GM_addStyle(`body{background: url( ${GM_getValue('imgUrl')} );}`)
    // }else{
    //     GM_addStyle(`body{background: url( ${GM_getValue('imgFile')} );}`)
    // }
    GM_addStyle('#i_cecream{background: transparent;min-height:initial;}')
    GM_addStyle('body{background-attachment: fixed;background-size: cover;}')
    //header模糊效果
    GM_addStyle('#bili-header-container{background: transparent !important}')
    GM_addStyle('.bili-header{background: transparent !important;}')
    GM_addStyle('.bili-header__bar{background: transparent !important;backdrop-filter: blur(10px) !important;}')
    //header样式
    GM_addStyle('.left-entry{display: none !important}')
    GM_addStyle('.bili-header .bili-header__bar{width: auto;right: 60px;top: 20px;border-radius: 30px;}')
    GM_addStyle('.bili-header .right-entry{margin-left: 5px !important}')
    GM_addStyle('.mini-header{box-shadow: 0px 3px 5px 1px #00000038 !important;}')
    //搜索框模糊效果
    GM_addStyle('.search-input-wrap{background: transparent !important;backdrop-filter:blur(10px) !important;}')
    //搜索框圆角、阴影
    GM_addStyle('.search-input-wrap{border-radius: 30px !important;box-shadow: 0px 3px 5px 1px #00000038 !important;}')
    GM_addStyle('.vui_button{border-radius: 30px !important}')
    //动态等下拉框位置
    GM_addStyle('.v-popover{padding-top: 25px !important;}')
    //右上图标颜色
    GM_addStyle('.right-entry-icon{color: #00aeec !important;}')

    function searchResult() {
        const newUrl = event.state ? event.state.url : window.location.href;
        if (newUrl.includes('keyword')) {
            GM_addStyle('.left-entry{display:block !important}')
            GM_addStyle('#i_cecream{background: #ffffff !important;}')//移除背景模糊
            document.getElementsByClassName('left-entry__title')[0].href = 'https://search.bilibili.com/all'//设置顶栏图标返回链接
            GM_addStyle('#bg-video{display:none !important}')//移除背景视频
            GM_addStyle('#bili-header-container{background: var(--bg1) !important;}')//恢复顶栏颜色
            GM_addStyle('html::-webkit-scrollbar{display:unset !important;}')
        } else {
            //背景模糊
            GM_addStyle('#i_cecream{background: transparent !important;}')
            GM_addStyle('#bg-video{display:unset !important}')//恢复背景视频
            GM_addStyle('#bili-header-container{background: transparent !important;}')//移除顶栏颜色
        }
    }

    window.onload = function () {
        searchResult();
        //搜索框预览文字
        document.getElementsByClassName('search-input-el')[0].placeholder = ''
        //搜索结果
        window.addEventListener('urlchange', function (event) {
            searchResult();
        });
        //搜索栏选中模糊
        document.onmouseup = function (e) {
            if (e.button == 0) {
                if (e.srcElement.className == 'search-input-el' && document.body.style.backdropFilter == '') {
                    document.body.style.backdropFilter = 'blur(10px)';
                    if (GM_getValue('bgType') == '3' || GM_getValue('bgType') == '4') { GM_addStyle('#bg-video{filter: blur(5px);}') }
                } else if (e.srcElement.className != 'search-input-el' && document.body.style.backdropFilter == 'blur(10px)') {
                    document.body.style.backdropFilter = '';
                    if (GM_getValue('bgType') == '3' || GM_getValue('bgType') == '4') { GM_addStyle('#bg-video{filter: unset;}') }
                }
            }
        };
        //修复收藏按钮
        GM_addStyle('a.right-entry__outside.header-favorite-container__down{display: none !important}')
        let headerFavorite = document.querySelector("a.right-entry__outside.header-favorite-container__up").outerHTML
        headerFavorite = headerFavorite.replace("header-favorite-container__up", "")
        const favWrap = document.querySelector("#bili-header-container > div > div > ul.right-entry > li:nth-child(5)")
        favWrap.innerHTML = headerFavorite
    }
})();

