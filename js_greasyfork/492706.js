// ==UserScript==
// @name         图片下载 | 页面所有图片打包下载 | 单张下载 | 图片预览放大,旋转,信息展示 | 简单有效，想要哪张点哪张
// @namespace    http://tampermonkey.net/
// @description  简单纯洁的网页图片下载工具，侵入性小不影响原网页显示，可集中展示页面所有图片，可点击预览放大，可旋转，可查看图片信息(尺寸，格式，图片大小) | （Ctrl+鼠标右键）下载单个图片
// @description:zh-CN  一个帮你快速捕获网页图片并打包下载、也可单张下载的小工具🔧
// @author       <shing0727@foxmail.com>
// @version      v4.1.0
// @license      GPLv3
// @icon         https://s21.ax1x.com/2024/05/14/pkmNM0s.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @match        *://*/*
// @connect      *
// @grant       GM_getValue
// @grant       GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/492706/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%7C%20%E5%8D%95%E5%BC%A0%E4%B8%8B%E8%BD%BD%20%7C%20%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7%2C%E6%97%8B%E8%BD%AC%2C%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA%20%7C%20%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88%EF%BC%8C%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/492706/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%7C%20%E5%8D%95%E5%BC%A0%E4%B8%8B%E8%BD%BD%20%7C%20%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7%2C%E6%97%8B%E8%BD%AC%2C%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA%20%7C%20%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88%EF%BC%8C%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0.meta.js
// ==/UserScript==


var isPackLoad = false
// 多图片打包下载
const downloadPackZipImgs = (all_imgs = []) => {
    if (!all_imgs.length || isPackLoad) return;
    isPackLoad = true
    isTopLoading(true, all_imgs.length)
    const zip = new JSZip();
    var currNum = 0;
    let total = all_imgs.length

    Promise.all(
        all_imgs.map((item, index) => {
            if (item.blob) {
                zip.file(item.imgName, item.blob, { binary: true });
                realTimeSchedule(++currNum, total)
                return Promise.resolve()
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: item.src,
                    responseType: "blob",
                    onload: function (response) {
                        if (response.status === 200) {
                            let blob = response.response;
                            item.blob = blob
                            if (blob.size > (1024 * 1024)) {
                                item.size = (blob.size / (1024 * 1024)).toFixed(1) + 'MB'
                            } else if (blob.size < (1024 * 1024) && blob.size > 1024) {
                                item.size = (blob.size / 1024).toFixed(1) + 'KB'
                            } else {
                                item.size = blob.size + '字节'
                            }
                            setItemImgsName(item)
                            updateNodeItem(item)
                            const filename = item.imgName;
                            zip.file(filename, blob, { binary: true });

                        } else {
                            console.error("请求报错，状态码： " + response.status);
                        }
                        realTimeSchedule(++currNum, total)
                        resolve();
                    },
                    onerror: function (e) {
                        console.error("请求失败: " + e.message);
                        realTimeSchedule(++currNum, total)
                        resolve();
                    },
                });
            });
        })
    )
        .then(() => {
            // let domain = window.location.href.replace(/^https?:\/\//i, "");
            zip.generateAsync({ type: "blob" }).then((blob) => {
                // saveAs(blob, `【${document.title}】【${domain}】.zip`);
                let str = $('#ccc_all_page_rename_val').val()
                str = str.length > 245 ? str.substring(0, 245) : str;
                saveAs(blob, `${str}.zip`);
            });
        }).finally(() => {
            isPackLoad = false
            isTopLoading(false)
        })

}
// 指定数组元素对象属性去重、去除宽高小于1的
function removeDuplicatesByProperty(arr = [], property) {
    const seenIds = new Set();
    return arr.filter(item => {
        const isUnique = !seenIds.has(item[property]);
        if (isUnique) {
            seenIds.add(item[property]);
        }
        return isUnique;
    });
}

// 根据blob设置图片后缀名
function setItemImgsName(item) {
    try {
        let { src = "", blob = {} } = item
        let name = src.match(/\/([^\/?#]+)(?:[?#]|$)/)[1].split('.')[0]
        if (blob?.type && blob?.type.includes('image')) {
            item.lastName = blob.type.match(/^image\/([a-zA-Z0-9]+)/)[1]
            item.isImg = true
        } else {
            item.isImg = false
        }
        item.imgName = decodeURIComponent(name + '.' + item.lastName)
    } catch (e) {
        console.log('e = ', e)
    }
}
// 更新节点显示信息
function updateNodeItem(item) {
    try {
        $('.ccc_image_item').each(function () {
            if ($(this).attr('data-imgsrc') == item.src) {
                let info = ''
                let imgDom = $(this).children('img')[0]
                if (imgDom.naturalWidth || imgDom.naturalHeight) {
                    info = imgDom.naturalWidth + ' x ' + imgDom.naturalHeight
                    item.width = imgDom.naturalWidth
                    item.height = imgDom.naturalHeight
                }
                if (item.lastName) {
                    info += (' | ' + item.lastName.toUpperCase())
                }
                if (item.size) {
                    info += (' | ' + item.size)
                }
                $(this).find('.ccc_imgItem_info').text(info)
                item.isFullInfo = true
            }
        })
    } catch (e) {
        console.log(e)
    }
}

// 获取单张图片blob
const getSingleBlob = (item) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: item.src,
            responseType: "blob",
            onload: function (response) {
                if (response.status === 200) {
                    let blob = response.response;
                    item.blob = blob
                    if (blob.size > (1024 * 1024)) {
                        item.size = (blob.size / (1024 * 1024)).toFixed(1) + 'MB'
                    } else if (blob.size < (1024 * 1024) && blob.size > 1024) {
                        item.size = (blob.size / 1024).toFixed(1) + 'KB'
                    } else {
                        item.size = blob.size + '字节'
                    }
                    setItemImgsName(item)
                    updateNodeItem(item)
                    resolve(item);
                } else {
                    console.error("请求报错，状态码： " + response.status);
                }
            },
            onerror: function (e) {
                console.error("请求失败: " + e.message);
                reject();
            },
        });
    })
}

// 根据svg元素返回{src，blob}
const getSvgAsFile = (svgElement) => {
    // 将 SVG 元素序列化为字符串
    const svgString = new XMLSerializer().serializeToString(svgElement);
    // 创建一个包含 SVG 数据的 Blob 对象
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    // 创建一个 URL 对象
    const src = URL.createObjectURL(blob);
    return {
        src,
        blob,
    }
}


// 获取页面所有图片
const loadAllImgUrls = async () => {
    all_imgs = []
    document.querySelectorAll("img").forEach((item) => {
        let src = item?.src || item.getAttribute("srcset");
        if (!src) return;
        if (origin_all_imageUrls.some(n => {
            if (n.src === src) {
                all_imgs.push(n)
                return true
            } else {
                false
            }
        })) return;

        let imgName = getImageFileNameFromUrl(src)
        let lastName = ''
        if (imgName.includes('.')) {
            let last = imgName.split('.').pop()
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'avif'].includes(last)) {
                lastName = last
            }
        }
        all_imgs.push({
            src,
            imgName,
            lastName,
            width: item.naturalWidth,
            height: item.naturalHeight,
        });
    });
    // 获取SVG标签图片
    // document.querySelectorAll("svg").forEach((svgDom, index) => {
    //     let {src, blob} = getSvgAsFile(svgDom)
    //     const { width, height } = svgDom.getBoundingClientRect();
    //     all_imgs.push({
    //         src,
    //         blob,
    //         imgName: `svg_${index}.svg`,
    //         lastName: 'svg',
    //         width,
    //         height
    //     });
    // })
    resetImgsObj(all_imgs)
}

const reFetchImgs = () => {
    loadAllImgUrls()
    let w_min = parseInt($('#ccc_w_min').val()) || 0
    let w_max = parseInt($('#ccc_w_max').val()) || 99999
    let h_min = parseInt($('#ccc_h_min').val()) || 0
    let h_max = parseInt($('#ccc_h_max').val()) || 99999
    all_imageUrls = valid_all_imageUrls.filter(item => {
        if (item.width < w_min || item.width > w_max) return false
        if (item.height < h_min || item.height > h_max) return false
        return true
    })
    reRender()
    showNotify('已刷新')
}

// 显示通知
var notifyTimer = null;
function showNotify(msg) {
    if (notifyTimer) {
        clearTimeout(notifyTimer)
        $('#ccc_notify').remove()
    }
    $('#ccc_popUps_container').append(`<div id="ccc_notify">${msg}</div>`)
    setTimeout(() => {
        $('#ccc_notify').addClass('active')
    }, 16);
    notifyTimer = setTimeout(() => {
        $('#ccc_notify').remove()
    }, 1000);
}



// 获取图片名称
function getImageFileNameFromUrl(url) {
    // 正则表达式匹配最后一个'/'和第一个'?'之间的内容（如果存在）
    // 或者最后一个'/'和字符串结尾之间的内容（如果不存在查询参数）
    const regex = /\/([^?\/]+?)(?:\?|$|@)/;
    const match = url.match(regex);
    if (match && match[1]) {
        // match[1] 是文件名（不包括查询参数及其后面的部分）
        return match[1];
    }
    return "default.jpg";
}

// 获取图片扩展名
function getImageExtension(url) {
    var extension = url.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif|avif)$/i);
    if (extension) {
        return '';
    }
    if (url.includes("data:image/png")) {
        return '.png'
    }
    if (url.includes("data:image/gif")) {
        return '.gif'
    }

    return '.jpg'
}

function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

var origin_all_imageUrls = []; // 所有图片
var valid_all_imageUrls = []; // 有效图片 = 所有图片 - 移除图片
var all_imageUrls = []; // 筛选后的图片
// 初始化加载图片数据
const resetImgsObj = (imgsObj = []) => {
    imgsObj = removeDuplicatesByProperty(imgsObj, 'src')
    if (imgsObj.length) {
        origin_all_imageUrls = deepClone(imgsObj)
        valid_all_imageUrls = deepClone(imgsObj)
        all_imageUrls = deepClone(imgsObj)
        $('.pop_title_num').text(all_imageUrls.length)
        $('#load_mask').css('display', 'none')
        $('#open_popUps_icon>.pop_title_num').css('display', 'block')
        reRender()
    } else {
    }
}


// blob图片下载
const blobDownload = (item = {}) => {
    let { blob, imgName } = item
    // 创建一个Blob UFRL
    const url = window.URL.createObjectURL(blob);
    // 创建一个<a>标签用于下载
    const a = document.createElement("a");
    a.href = url;
    a.download = imgName; // 设置下载的文件名
    a.style.display = "none";
    // 触发点击事件
    document.body.appendChild(a);
    a.click();
    // 释放URL对象
    window.URL.revokeObjectURL(url);
    // 清理<a>标签
    document.body.removeChild(a);
}

// 渲染图片列表
var viewer = null;
const reRender = () => {
    // // 去除宽高小于1
    // all_imageUrls = all_imageUrls.filter(item => {
    //     return item.width > 1 && item.height > 1
    // })
    $('.pop_title_num').text(all_imageUrls.length)
    var $newElements = $();
    all_imageUrls.forEach(item => {
        let addCss = item.isFullInfo === true ? 'hide_more' : ''
        var $el = $('<div>', { class: 'ccc_image_item ' + addCss, "data-imgsrc": item.src });
        var $img = $('<img>', { src: item.src, alt: item.imgName, title: '预览' });

        let info = '';
        if (item.width || item.height) {
            info = item.width + ' x ' + item.height
        }
        if (item.lastName) {
            let s = (item.width || item.height) ? ' | ' : ''
            info += (s + item.lastName.toUpperCase())
        }
        if (item.size) {
            info += (' | ' + item.size)
        }

        var $infoBox = $('<div>', { text: info, class: 'ccc_imgItem_info' });

        $img.appendTo($el);
        $infoBox.appendTo($el);

        $newElements = $.merge($newElements, $el);
    });
    $('#ccc_image_container').empty().append($newElements);
    $('.ccc_image_item').each(function () {
        $(this).append(`
            <div class="ccc_imgItem_ctrl">
               <div class="click_style" title="下载"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1723013152119" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="6158" width="200" height="200"><path d="M862.39 161.61A222.53 222.53 0 0 0 704 96H320A224 224 0 0 0 96 320v384a224 224 0 0 0 224 224h384a224 224 0 0 0 224-224V320a222.53 222.53 0 0 0-65.61-158.39zM704 736a32 32 0 0 1-32 32H352a32 32 0 0 1-32-32 32 32 0 0 1 32-32h320a32 32 0 0 1 32 32z m-8.88-211.62L529.75 634.63a32 32 0 0 1-35.5 0L328.88 524.38A32 32 0 0 1 320 480a32 32 0 0 1 44.38-8.88l103.18 68.8a8 8 0 0 0 12.44-6.66V288a32 32 0 0 1 32-32 32 32 0 0 1 32 32v245.26a8 8 0 0 0 12.44 6.66l103.18-68.8A32 32 0 0 1 704 480a32 32 0 0 1-8.88 44.38z" fill="#ffffff" p-id="6159"/></svg></div>
            </div>
            <div class="ccc_imgItem_delete click_style" title="移除"><span></span></div>
        `)
        $(this).find('.ccc_imgItem_info').append(`
            <span class="ccc_more"> ···</span>
        `)
    })

    viewer && viewer.destroy();
    viewer = new Viewer(document.getElementById('ccc_image_container'));
}

const setLoading = (target, isLoading = true) => {
    if (isLoading) {
        $(target).append(
            `
                <div id="ccc_itemImgLoading">
                    <div class="loader"></div>
                </div>
            `
        )
    } else {
        $(target).find('#ccc_itemImgLoading').remove();
    }
}

var ccc_currentVersion = 'v4.1.0';
var hasUpdate = false;
var onlineVersion = null; // 线上版本号
var online_homeUrl = 'https://greasyfork.org/zh-CN/scripts/492706-%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD-%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD-%E5%8D%95%E5%BC%A0%E4%B8%8B%E8%BD%BD-%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7-%E6%97%8B%E8%BD%AC-%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA-%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88-%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0'; // 脚本首页地址
var online_update_url = 'https://update.greasyfork.org/scripts/492706/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%7C%20%E5%8D%95%E5%BC%A0%E4%B8%8B%E8%BD%BD%20%7C%20%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7,%E6%97%8B%E8%BD%AC,%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA%20%7C%20%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88%EF%BC%8C%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0.user.js'; // 脚本首页地址
const loadUpdateTamp = () => {
    const extractVersion = (htmlString) => {
        // 使用正则表达式匹配 data-script-version 属性的值
        const versionMatch = htmlString.match(/data-script-version="([^"]+)"/);
        // 如果匹配成功，返回版本号；否则返回 null
        return versionMatch ? versionMatch[1] : null;
    }

    const isUpdateAvailable = (ccc_currentVersion, onlineVersion) => {
        const current = ccc_currentVersion.replace('v', '').split('.').map(Number);
        const online = onlineVersion.replace('v', '').split('.').map(Number);
        for (let i = 0; i < Math.max(current.length, online.length); i++) {
            const currentPart = current[i] || 0; // 如果当前版本号部分不存在，则默认为 0
            const onlinePart = online[i] || 0;   // 如果线上版本号部分不存在，则默认为 0
            if (onlinePart > currentPart) {
                return true;  // 如果线上版本号更高，则需要更新
            } else if (onlinePart < currentPart) {
                return false; // 如果线上版本号更低，则不需要更新
            }
            // 如果当前部分的版本号相等，继续比较下一部分
        }
        // 如果所有部分的版本号都相等，则不需要更新
        return false;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: online_homeUrl,
        onload: function (res) {
            if (res.status === 200) {
                onlineVersion = extractVersion(res.response)
                hasUpdate = isUpdateAvailable(ccc_currentVersion, onlineVersion)

                if (hasUpdate) {
                    GM_registerMenuCommand("有新版本啦~(♥ω", function () {
                        window.open(online_update_url, '_blank');
                    });
                    $('#ccc_gotoUpdate').append(`
                        <a href="${online_update_url}" target="_blank">有新版本啦，快去体验下吧~(♥ω</a>
                        `)
                }
            }
        },
        onerror: function (e) {
            console.error(e);
        },
    });

}

// 渲染展示筛选条件
function renderViewFilter() {
    let w_min = $('#ccc_w_min').val()
    let w_max = $('#ccc_w_max').val() || '∞'
    let h_min = $('#ccc_h_min').val()
    let h_max = $('#ccc_h_max').val() || '∞'

    let isView = false
    $('#ccc_view_filter_itembox').empty();
    if (w_min || $('#ccc_w_max').val()) {
        $('#ccc_view_filter_itembox').append(`
                <span>宽 ${w_min || 0} - ${w_max}</span>
            `)
        isView = true
    }
    if (h_min || $('#ccc_h_max').val()) {
        $('#ccc_view_filter_itembox').append(`
                <span>高 ${h_min || 0} - ${h_max}</span>
            `)
        isView = true
    }
    if (isView) {
        $('.ccc_view_filter').css({ display: 'flex' })
    } else {
        $('.ccc_view_filter').css({ display: 'none' })
    }
}

// 主要交互操作逻辑
const loadMainOperations = () => {

    GM_registerMenuCommand("打开图片列表（ALT + Q）", function () {
        handleOpenPopPus()
    });

    var isOpenPop = false;
    // 处理打开弹窗
    const handleOpenPopPus = () => {
        isOpenPop = true;
        document.querySelector('#ccc_popUps_out').style.display = 'block';
        setLayout();
    }
    // 处理关闭弹窗
    const handleClosePop = () => {
        isOpenPop = false
        document.querySelector('#ccc_popUps_out').style.display = 'none';
    }
    // 关闭弹窗
    document.querySelector('#ccc_close_popUps').onclick = function () {
        handleClosePop()
    }
    // 快捷键事件
    document.addEventListener('keydown', function (event) {
        // 按alt + ` 显隐弹窗
        if (event.altKey && (event.key === 'Q' || event.key === 'q')) {
            isOpenPop ? handleClosePop() : handleOpenPopPus()
        }
        // Esc键-关闭弹窗
        if (event.key === 'Escape' || event.key === 'Esc') {
            handleClosePop()
        }
    });

    const setLayout = () => {
        reRender() //渲染图片
        let container_h = ccc_popUps_container.offsetHeight - 30;
        ccc_image_container.style.height = (container_h - ccc_popUps_top.offsetHeight - 30) + 'px';
    }
    var isShowFilter = false;
    // 显示筛选
    const showHideFilter = (is, key) => {
        isShowFilter = is
        let speed = 300
        key === 'leave' && (speed = 500)
        if (key === 'enter') {
            $('#ccc_filter_container').stop();
            $('#ccc_filter_container').css('opacity', 1)
            return;
        }

        if (isShowFilter) {
            $('#ccc_filter_container').fadeIn(speed);
        } else {
            $('#ccc_filter_container').fadeOut(speed);
        }
    }


    $('#ccc_filter_btn').click(function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        isShowFilter = !isShowFilter
        showHideFilter(isShowFilter)
    })
    $('#ccc_filter_container').click(function (e) {
        e.stopPropagation(); // 阻止事件冒泡
    })
    $(document).click(function (e) {
        showHideFilter(false)
    })

    $('#ccc_filter_container').mouseleave(function () {
        showHideFilter(false, 'leave')
    });

    $('#ccc_filter_container').mouseenter(function () {
        showHideFilter(true, 'enter')
    });

    // 筛选input触发
    $('.ccc_filter_input').on('input', function () {
        let w_min = parseInt($('#ccc_w_min').val()) || 0
        let w_max = parseInt($('#ccc_w_max').val()) || 99999
        let h_min = parseInt($('#ccc_h_min').val()) || 0
        let h_max = parseInt($('#ccc_h_max').val()) || 99999
        all_imageUrls = valid_all_imageUrls.filter(item => {
            if (item.width < w_min || item.width > w_max) return false
            if (item.height < h_min || item.height > h_max) return false
            return true
        })
        reRender()
        renderViewFilter()
    });
    // 重置筛选触发
    $("#refilter_btn").click(function () {
        $('#ccc_w_min').val('')
        $('#ccc_w_max').val('')
        $('#ccc_h_min').val('')
        $('#ccc_h_max').val('')
        all_imageUrls = valid_all_imageUrls
        reRender()
        renderViewFilter()
    })


    // 点击按钮下载单张图片
    $('#ccc_image_container').on('click', '.ccc_imgItem_ctrl svg', function () {
        let url = $(this).closest('.ccc_image_item').attr('data-imgsrc')
        let item = all_imageUrls.filter(item => item.src === url)[0]
        if (item.lock) return;
        item.lock = true
        let target = $(this).closest('.ccc_image_item')
        setLoading(target, true)
        if (item.lastName && item.blob) {
            blobDownload(item)
            item.lock = false
            setLoading(target, false)
        } else {
            getSingleBlob(item).then(res => {
                blobDownload(res)
                item.lock = false
                setLoading(target, false)
            })
        }

    })
    // 移除图片
    $('#ccc_image_container').on('click', '.ccc_imgItem_delete', function () {
        let url = $(this).closest('.ccc_image_item').attr('data-imgsrc')
        valid_all_imageUrls = valid_all_imageUrls.filter(item => item.src !== url)
        all_imageUrls = all_imageUrls.filter(item => item.src !== url)
        reRender()
    })
    // 显示更多
    $('#ccc_image_container').on('click', '.ccc_imgItem_info', function () {
        let url = $(this).closest('.ccc_image_item').attr('data-imgsrc')
        let item = all_imageUrls.filter(item => item.src === url)[0]
        if (item.lock) return;
        item.lock = true
        $(this).find('.ccc_more').empty().append(`<div class="loader"></div>`);

        $(this).closest('.ccc_image_item').find('.ccc_imgItem_ctrl>div').css('cursor', 'no-drop').removeClass('click_style')
        getSingleBlob(item).then(res => {
        }).finally(() => {
            $(this).find('.ccc_more').remove();
            $(this).css('cursor', 'initial')
            $(this).closest('.ccc_image_item').find('.ccc_imgItem_ctrl>div').css('cursor', 'pointer').addClass('click_style')
            item.lock = false
        })
    })


    // 显隐主体icon
    var isShowMainIcon = GM_getValue('ccc_main_icon_isshow', true);
    $(document).on('click', '#showhide_main_btn', function () {
        isShowMainIcon = !isShowMainIcon
        handleShowHide()
    })

    const handleShowHide = () => {
        let speed = 600
        $('#ccc_main_icon_container').css({
            transition: `all ${speed}ms`
        })
        GM_setValue('ccc_main_icon_isshow', isShowMainIcon);
        if (isShowMainIcon) {
            $('#ccc_main_icon_container').css({
                'right': '20px',
            })
            $('#showhide_main_btn').css({
                left: 'auto',
                right: '0',
                opacity: '0',
            }).text('»')
        } else {
            $('#ccc_main_icon_container').css({
                'right': '-30px',
            })
            $('#showhide_main_btn').css({
                right: 'auto',
                left: '-40px',
                opacity: '1',
            }).text('«')
        }
        setTimeout(() => {
            $('#ccc_main_icon_container').css({
                transition: 'none'
            })
        }, speed);
    }
    handleShowHide()


    $('#ccc_popUps_container').click(function (e) {
        e.stopPropagation()
    })

    document.getElementById('ccc_popUps_out').addEventListener("mousedown", function (event) {
        if (event.target.id === 'ccc_popUps_out') {
            let flag = document.querySelector('.ccc_all_pack_down_container').classList.contains('ccc_focus_rename');
            if (flag) return;
            handleClosePop()
        }
    });



    // 声明拖动事件
    function bindHandleDrag() {
        let isMove = false
        let mouseToEleY;
        let mainContainerDom = document.querySelector('#ccc_main_icon_container')
        let iconDom = document.querySelector('#open_popUps_icon')
        let isOpen = true;
        // 拖动处理
        mainContainerDom.addEventListener("mousedown", function (e) {
            isMove = true
            // 获取鼠标相对于元素的位置
            mouseToEleY = e.clientY - mainContainerDom.getBoundingClientRect().top;
        });
        // 当鼠标移动时
        window.addEventListener('mousemove', (e) => {
            if (!isMove) return
            document.body.style.userSelect = 'none';
            iconDom.style.cursor = 'grabbing'
            // 防止默认的拖动选择文本行为
            e.preventDefault();
            let newTop = e.clientY - mouseToEleY;
            // 防止元素超出视口下方
            let maxTop = window.innerHeight - mainContainerDom.offsetHeight;
            if (newTop < 0) {
                newTop = 0;
            } else if (newTop > maxTop) {
                newTop = maxTop;
            }
            mainContainerDom.style.top = `${newTop}px`;
            mainContainerDom.style.bottom = 'auto';
            isOpen = false;
        })
        // 当鼠标松开时

        document.querySelector('#open_popUps_icon').addEventListener('mouseup', () => {
            isOpen && handleOpenPopPus() // 打开弹窗
        });
        window.addEventListener('mouseup', () => {
            isMove = false;
            iconDom.style.cursor = 'pointer'
            isOpen = true
            document.body.style.userSelect = 'auto';
        });
    }
    bindHandleDrag();
    // 刷新抓取
    document.querySelector('#ccc_fetch_btn').onclick = () => {
        reFetchImgs()
    }

    // 检测是否移除icon
    var isRemoveIcon = GM_getValue('ccc_main_icon_isRemoveIcon', true); 
    handleRemoveIcon(isRemoveIcon)
    GM_registerMenuCommand('（显示/移除）右下角图标', function () {
        isRemoveIcon = !isRemoveIcon
        GM_setValue('ccc_main_icon_isRemoveIcon', isRemoveIcon); 
        handleRemoveIcon(isRemoveIcon)
    });

    // 处理是否显示右下角图片及注册油猴Menu
    function handleRemoveIcon(flag){
        if(flag === true){
            $('#ccc_main_icon_container').show()
        }else{
            $('#ccc_main_icon_container').hide()
        }
    }

}
// 初始声明事件
const initEvents = () => {
    // ctrl+右键 下载图片
    document.addEventListener("mousedown", function (event) {
        if (event.ctrlKey && event.button === 2) {
            event.preventDefault();
            var targetElement = event.target;
            const getUrl = (dom) => {
                return dom.getAttribute("src") || dom.getAttribute("srcset") || "";
            };
            if (targetElement) {
                let url = getUrl(targetElement);
                let srcArr = [];
                if (url) {
                    srcArr = [url];
                } else {
                    let arrDom = targetElement.querySelectorAll("img");
                    arrDom.forEach((item) => {
                        srcArr.push(getUrl(item));
                    });
                }
                srcArr.forEach((url) => {
                    let item = {
                        src: url
                    }
                    getSingleBlob(item).then(res => {
                        blobDownload(res)
                    })
                });
            }
        }
    });
    document.querySelector('#ccc_all_pack_down_btn').onclick = function () {
        downloadPackZipImgs(all_imageUrls)
    }

    // 获取textarea元素
    var textareaDom = document.getElementById('ccc_all_page_rename_val')
    // 监听focus事件
    textareaDom.addEventListener('focus', function () {
        document.querySelector('.ccc_all_pack_down_container').classList.add('ccc_focus_rename');
    });
    // 监听blur事件
    textareaDom.addEventListener('blur', function () {
        setTimeout(() => {
            document.querySelector('.ccc_all_pack_down_container').classList.remove('ccc_focus_rename');
        }, 100);
    });
    var ccc_domain = window.location.href.replace(/^https?:\/\//i, "");
    var ccc_zipFileName = `【${document.title}】【${ccc_domain}】`
    $(textareaDom).val(ccc_zipFileName)
}
// 打包下载loading
function isTopLoading(flag, total) {
    if (flag) {
        if ($('#ccc_load_tip_style').length) {
            $('#ccc_load_tip_style').remove();
        }
        $('body').append(`
            <div id="ccc_load_tip_style">
                <div>稍等片刻，正在打包下载...</div>
                <div class="ccc_schedule_container">
                    <div class="ccc_schedule_bg"><div class="ccc_schedule_curr"></div></div>
                    <div class="ccc_schedule_text"><span id="curr_ing">0</span>/${total}</div>
                </div>
            </div>
        `)
        $('#ccc_all_pack_down_btn').css('cursor', 'no-drop').removeClass('click_style')
    } else {
        $('#ccc_load_tip_style').length && $('#ccc_load_tip_style').css('right', '-280px')
        $('#ccc_all_pack_down_btn').css('cursor', 'pointer').addClass('click_style')
        setTimeout(() => {
            $('#ccc_load_tip_style').remove();
        }, 800);
    }
}

// 实时计算进度条
const realTimeSchedule = (curr, total) => {
    try {
        if ($('#curr_ing').length) {
            $('#curr_ing').text(curr)
            let w = ((curr / total) * 100).toFixed(1) + '%'
            $('.ccc_schedule_curr').css('width', w)
        }
    } catch (e) {
        console.log(e)
    }
}


// 初始化加载页面
const init = () => {
    window.addEventListener("load", function () {
        if (window.self !== window.top) return;
        setTimeout(() => {
            loadCss()
            loadElementDOM()
            loadAllImgUrls();
            loadMainOperations();
            initEvents();
            // loadUpdateTamp()
        }, 300);
    });
};
(function () {
    init();
})();

const loadElementDOM = () => {
    $("body").append(`
        
    <!-- 主体Icom -->
    <div id="ccc_main_icon_container">
        <div id="showhide_main_btn" class="none_select">»</div>
        <div id="open_popUps_icon" title="ALT + Q">
            <span class="pop_title_num none_select">0</span>
            <svg t="1719977292759" class="icon" viewBox="0 0 1248 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="9887" width="256" height="256">
                <path
                    d="M0 159.430165V865.420028c0 65.985105 13.006679 78.509585 76.517343 78.509585h867.120413c62.977707 0 76.504653-12.029592 76.504653-78.458827v-706.040621c0-64.322788-11.991524-78.446138-76.504653-78.446138H76.504653C13.247779 80.984027 0 92.214184 0 159.430165z m900.02414 601.479609H120.638537c85.184232-127.389321 236.670806-339.721774 275.157887-339.721774 37.268895 0 163.693818 171.561272 220.796312 231.950332 0 0 73.484566-100.665353 111.984336-100.665353 39.261137 0 170.114676 207.358192 171.38362 208.398726zM671.017758 316.33513c0-53.295662 42.065504-96.439769 94.092221-96.439768s94.092222 43.144107 94.092222 96.439768-42.065504 96.439769-94.092222 96.439769-94.092222-43.144107-94.092221-96.439769zM478.39201 33.652403L329.265673 4.631647c-49.488829-9.631287-69.132087-6.167069-81.212437 29.020756z m702.792123 136.741441l-116.742877-22.714104c0 2.905882 0.076137 5.799076 0.076136 8.654201v710.050485c0 32.992552-2.131826 70.236068-27.536092 95.767228-24.706346 24.820551-60.503265 26.90162-92.099979 26.901619h-70.439099l149.824256 29.18572c61.873725 12.042282 77.405604 2.804367 89.435196-62.44475l128.379097-693.693793c11.699667-63.206117 2.537889-79.372467-60.909327-91.706606z"
                    p-id="9888" fill="#333333"></path>
            </svg>
        </div>
    </div>

    <!-- 弹窗 -->
    <div id="ccc_popUps_out">
        <div id="ccc_popUps_container">
            <div id="ccc_popUps_top">
                <div id="ccc_title_ctrl">
                    <div class="ccc_title_text">网页图片列表 (共 <span class="pop_title_num">0</span> 张)</div>
                    <div id="ccc_filter_out">
                        <svg id="ccc_filter_btn" class="click_style" t="1719976985515" class="icon"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6880"
                            width="256" height="256">
                            <path
                                d="M577.499296 1023.99875a99.999878 99.999878 0 0 1-47.999942-11.999985l-131.999839-72.999911a99.999878 99.999878 0 0 1-51.999936-87.999893V431.999473a19.999976 19.999976 0 0 0-7.99999-15.999981L32.499961 171.99979l-3.999995-3.999995C0.5 138.99983-6.499991 96.999882 9.499989 59.999927S60.499927 0 100.499878 0h821.998997c39.999951 0 75.999907 22.999972 91.999887 59.999927s8.999989 77.999905-17.999978 107.999868l-3.999995 3.999995-307.999624 246.999699a19.999976 19.999976 0 0 0-6.999991 15.99998v488.999403a99.999878 99.999878 0 0 1-99.999878 99.999878zM84.499897 111.999863l302.999631 241.999705a98.999879 98.999879 0 0 1 37.999953 77.999905v418.999488a19.999976 19.999976 0 0 0 9.999988 17.999978l131.999839 71.999912a19.999976 19.999976 0 0 0 29.999963-17.999978V434.999469a99.999878 99.999878 0 0 1 36.999955-77.999905l303.999629-244.999701a19.999976 19.999976 0 0 0-15.99998-31.999961H100.499878a19.999976 19.999976 0 0 0-15.999981 31.999961z m881.998924 28.999965z"
                                fill="#333333" p-id="6881"></path>
                            <path
                                d="M983.4988 520.999364H757.499076a39.999951 39.999951 0 0 1 0-79.999902h225.999724a39.999951 39.999951 0 0 1 0 79.999902zM983.4988 670.999181H757.499076a39.999951 39.999951 0 0 1 0-79.999902h225.999724a39.999951 39.999951 0 0 1 0 79.999902zM983.4988 819.998999H757.499076a39.999951 39.999951 0 0 1 0-79.999902h225.999724a39.999951 39.999951 0 0 1 0 79.999902z"
                                fill="#333333" p-id="6882"></path>
                        </svg>
                        <div id="ccc_filter_container">
                            <div>宽：<input id="ccc_w_min" class="ccc_filter_input" type="text"
                                    placeholder="0"><span>-</span><input id="ccc_w_max" class="ccc_filter_input"
                                    type="text" placeholder="∞">
                            </div>
                            <div>高：<input id="ccc_h_min" class="ccc_filter_input" type="text"
                                    placeholder="0"><span>-</span><input id="ccc_h_max" class="ccc_filter_input"
                                    type="text" placeholder="∞">
                            </div>
                            <div>
                                <div id="refilter_btn" class="click_style">重置</div>
                            </div>
                        </div>
                    </div>
                    <div class="ccc_view_filter">
                        <span style="font-weight: bold;">筛选条件：</span>
                        <div id="ccc_view_filter_itembox">
                        </div>
                    </div>
                </div>
                <div class="ccc_popUps_top_right">
                    <div id="ccc_gotoUpdate"></div>
                    <div id="ccc_fetch_pageImgs_text">
                        <div id="ccc_fetch_btn" class="click_style none_select">刷新抓取</div>
                        <div class="ccc_fetch_tips none_select">(非首屏载入网页的图片，需刷新抓取)</div>
                    </div>
                    <div class="ccc_all_pack_down_container">
                        <div id="ccc_all_pack_down_btn" class="none_select click_style"><span
                                class="pop_title_num">0</span>打包下载
                        </div>
                        <!-- 🖊✍ -->
                        <div id="ccc_all_page_rename"><span class="ccc_all_page_rename_icon">✍</span>
                            <div class="ccc_all_page_rename_out">
                                <div class="ccc_all_page_rename_container">
                                    <div class="ccc_all_page_rename_container_tips_font">重命名压缩包文件名称：</div>
                                    <textarea id="ccc_all_page_rename_val" maxlength="255"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="ccc_close_popUps" class="none_select" title="Esc">❌</div>
                </div>
            </div>
            <div id="load_mask">图片加载中...</div>

            <div id="ccc_image_container">
                <!-- <div class="ccc_image_item"></div> -->
            </div>
        </div>
    </div>

    `)
}
const loadCss = () => {
    GM.addStyle(
        `
/*!
 * Viewer.js v1.10.5
 * https://fengyuanchen.github.io/viewerjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2022-04-05T08:21:00.150Z
 */

.viewer-zoom-in::before, .viewer-zoom-out::before, .viewer-one-to-one::before, .viewer-reset::before, .viewer-prev::before, .viewer-play::before, .viewer-next::before, .viewer-rotate-left::before, .viewer-rotate-right::before, .viewer-flip-horizontal::before, .viewer-flip-vertical::before, .viewer-fullscreen::before, .viewer-fullscreen-exit::before, .viewer-close::before {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC");
    background-repeat: no-repeat;
    background-size: 280px;
    color: transparent;
    display: block;
    font-size: 0;
    height: 20px;
    line-height: 0;
    width: 20px;
}

.viewer-zoom-in::before {
    background-position: 0 0;
    content: "Zoom In";
}

.viewer-zoom-out::before {
    background-position: -20px 0;
    content: "Zoom Out";
}

.viewer-one-to-one::before {
    background-position: -40px 0;
    content: "One to One";
}

.viewer-reset::before {
    background-position: -60px 0;
    content: "Reset";
}

.viewer-prev::before {
    background-position: -80px 0;
    content: "Previous";
}

.viewer-play::before {
    background-position: -100px 0;
    content: "Play";
}

.viewer-next::before {
    background-position: -120px 0;
    content: "Next";
}

.viewer-rotate-left::before {
    background-position: -140px 0;
    content: "Rotate Left";
}

.viewer-rotate-right::before {
    background-position: -160px 0;
    content: "Rotate Right";
}

.viewer-flip-horizontal::before {
    background-position: -180px 0;
    content: "Flip Horizontal";
}

.viewer-flip-vertical::before {
    background-position: -200px 0;
    content: "Flip Vertical";
}

.viewer-fullscreen::before {
    background-position: -220px 0;
    content: "Enter Full Screen";
}

.viewer-fullscreen-exit::before {
    background-position: -240px 0;
    content: "Exit Full Screen";
}

.viewer-close::before {
    background-position: -260px 0;
    content: "Close";
}

.viewer-container {
    bottom: 0;
    direction: ltr;
    font-size: 0;
    left: 0;
    line-height: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    -webkit-tap-highlight-color: transparent;
    top: 0;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.viewer-container::-moz-selection, .viewer-container *::-moz-selection {
    background-color: transparent;
}

.viewer-container::selection,
.viewer-container *::selection {
    background-color: transparent;
}

.viewer-container:focus {
    outline: 0;
}

.viewer-container img {
    display: block;
    height: auto;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
}

.viewer-canvas {
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0
}

.viewer-canvas > img {
    height: auto;
    margin: 15px auto;
    max-width: 90% !important;
    width: auto;
}

.viewer-footer {
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    text-align: center;
}

.viewer-navbar {
    background-color: rgba(0, 0, 0, 50%);
    overflow: hidden;
}

.viewer-list {
    box-sizing: content-box;
    height: 50px;
    margin: 0;
    overflow: hidden;
    padding: 1px 0
}

.viewer-list > li {
    color: transparent;
    cursor: pointer;
    float: left;
    font-size: 0;
    height: 50px;
    line-height: 0;
    opacity: 0.5;
    overflow: hidden;
    transition: opacity 0.15s;
    width: 30px
}

.viewer-list > li:focus,
.viewer-list > li:hover {
    opacity: 0.75;
}

.viewer-list > li:focus {
    outline: 0;
}

.viewer-list > li + li {
    margin-left: 1px;
}

.viewer-list > .viewer-loading {
    position: relative
}

.viewer-list > .viewer-loading::after {
    border-width: 2px;
    height: 20px;
    margin-left: -10px;
    margin-top: -10px;
    width: 20px;
}

.viewer-list > .viewer-active,
.viewer-list > .viewer-active:focus,
.viewer-list > .viewer-active:hover {
    opacity: 1;
}

.viewer-player {
    background-color: #000;
    bottom: 0;
    cursor: none;
    display: none;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1
}

.viewer-player > img {
    left: 0;
    position: absolute;
    top: 0;
}

.viewer-toolbar > ul {
    display: inline-block;
    margin: 0 auto 5px;
    overflow: hidden;
    padding: 6px 3px
}

.viewer-toolbar > ul > li {
    background-color: rgba(0, 0, 0, 50%);
    border-radius: 50%;
    cursor: pointer;
    float: left;
    height: 24px;
    overflow: hidden;
    transition: background-color 0.15s;
    width: 24px
}

.viewer-toolbar > ul > li:focus,
.viewer-toolbar > ul > li:hover {
    background-color: rgba(0, 0, 0, 80%);
}

.viewer-toolbar > ul > li:focus {
    box-shadow: 0 0 3px #fff;
    outline: 0;
    position: relative;
    z-index: 1;
}

.viewer-toolbar > ul > li::before {
    margin: 2px;
}

.viewer-toolbar > ul > li + li {
    margin-left: 1px;
}

.viewer-toolbar > ul > .viewer-small {
    height: 18px;
    margin-bottom: 3px;
    margin-top: 3px;
    width: 18px
}

.viewer-toolbar > ul > .viewer-small::before {
    margin: -1px;
}

.viewer-toolbar > ul > .viewer-large {
    height: 30px;
    margin-bottom: -3px;
    margin-top: -3px;
    width: 30px
}

.viewer-toolbar > ul > .viewer-large::before {
    margin: 5px;
}

.viewer-tooltip {
    background-color: rgba(0, 0, 0, 80%);
    border-radius: 10px;
    color: #fff;
    display: none;
    font-size: 12px;
    height: 20px;
    left: 50%;
    line-height: 20px;
    margin-left: -25px;
    margin-top: -10px;
    position: absolute;
    text-align: center;
    top: 50%;
    width: 50px;
}

.viewer-title {
    color: #ccc;
    display: inline-block;
    font-size: 12px;
    line-height: 1.2;
    margin: 0 5% 5px;
    max-width: 90%;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.15s;
    white-space: nowrap
}

.viewer-title:hover {
    opacity: 1;
}

.viewer-button {
    -webkit-app-region: no-drag;
    background-color: rgba(0, 0, 0, 50%);
    border-radius: 50%;
    cursor: pointer;
    height: 80px;
    overflow: hidden;
    position: absolute;
    right: -40px;
    top: -40px;
    transition: background-color 0.15s;
    width: 80px
}

.viewer-button:focus,
.viewer-button:hover {
    background-color: rgba(0, 0, 0, 80%);
}

.viewer-button:focus {
    box-shadow: 0 0 3px #fff;
    outline: 0;
}

.viewer-button::before {
    bottom: 15px;
    left: 15px;
    position: absolute;
}

.viewer-fixed {
    position: fixed;
}

.viewer-open {
    overflow: hidden;
}

.viewer-show {
    display: block;
}

.viewer-hide {
    display: none;
}

.viewer-backdrop {
    background-color: rgba(0, 0, 0, 50%);
}

.viewer-invisible {
    visibility: hidden;
}

.viewer-move {
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab;
}

.viewer-fade {
    opacity: 0;
}

.viewer-in {
    opacity: 1;
}

.viewer-transition {
    transition: all 0.3s;
}

@-webkit-keyframes viewer-spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes viewer-spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.viewer-loading::after {
    -webkit-animation: viewer-spinner 1s linear infinite;
    animation: viewer-spinner 1s linear infinite;
    border: 4px solid rgba(255, 255, 255, 10%);
    border-left-color: rgba(255, 255, 255, 50%);
    border-radius: 50%;
    content: "";
    display: inline-block;
    height: 40px;
    left: 50%;
    margin-left: -20px;
    margin-top: -20px;
    position: absolute;
    top: 50%;
    width: 40px;
    z-index: 1;
}

@media (max-width: 767px) {
    .viewer-hide-xs-down {
        display: none;
    }
}

@media (max-width: 991px) {
    .viewer-hide-sm-down {
        display: none;
    }
}

@media (max-width: 1199px) {
    .viewer-hide-md-down {
        display: none;
    }
}



        // -------------- my-style ------------

        .viewer-backdrop {
            background-color: rgba(0, 0, 0, 0.75) !important;
        }
        
        #ccc_main_icon_container {
            position: fixed;
            bottom: 50px;
            right: 20px;
            opacity: 0.3;
            z-index: 88888;
            display: none;
        }
        
        #open_popUps_icon {
            position: relative;
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
        
        #open_popUps_icon>svg {
            width: 100%;
            height: 100%;
        }
        
        #open_popUps_icon>.pop_title_num {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            padding: 2px 4px;
            background-color: red;
            color: #ffffff;
            font-size: 10px;
            border-radius: 30px;
        }
        
        #showhide_main_btn {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            width: 20px;
            font-size: 26px;
            line-height: 30px;
            top: 0;
            right: 0;
            transform: translate(100%, 0%);
            cursor: pointer;
            transition: all 0.3s;
        
            font-weight: bold;
            background-image: linear-gradient(to right, #ffffff, #333333);
            -webkit-background-clip: text;
            color: transparent;
            opacity: 0;
        }
        
        #ccc_main_icon_container:hover {
            opacity: 1;
        }
        
        #ccc_main_icon_container:hover #showhide_main_btn {
            opacity: 1 !important;
        }
        
        #showhide_main_btn:hover {
            text-shadow:
                -0 -0 0 #333,
                0 -0 0 #333,
                -0 0 0 #333,
                0 0 0 #333;
        }
        
        
        
        /* 滚动条整体样式 */
        #ccc_image_container::-webkit-scrollbar {
            width: 6px;
            /* 宽度 */
            height: 6px;
            /* 高度（对于垂直滚动条） */
        }
        
        /* 滚动条滑块 */
        #ccc_image_container::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 6px;
        }
        
        /* 滚动条滑块:hover状态样式 */
        #ccc_image_container::-webkit-scrollbar-thumb:hover {
            background: #888;
        }
        
        /* 滚动条轨道 */
        #ccc_image_container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        
        /* 滚动条轨道:hover状态样式 */
        #ccc_image_container::-webkit-scrollbar-track:hover {
            background: #ddd;
        }
        
        /* 滚动条轨道:active状态样式 */
        #ccc_image_container::-webkit-scrollbar-track-piece:active {
            background: #eee;
        }
        
        /* 滚动条:角落样式（即两个滚动条交汇处） */
        #ccc_image_container::-webkit-scrollbar-corner {
            background: #535353;
        }
        
        .none_select {
            user-select: none;
            /* 禁止选中 */
            -webkit-user-select: none;
            /* 对 Safari 和旧版 Chrome 的支持 */
            -moz-user-select: none;
            /* 对 Firefox 的支持 */
            -ms-user-select: none;
            /* 对 Internet Explorer 的支持 */
        }
        
        #ccc_popUps_out {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.6);
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: 88888;
            display: none;
        }
        
        #ccc_popUps_container {
            position: absolute;
            width: 75vw;
            height: 75vh;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.2);
            padding: 15px;
        }
        
        #ccc_popUps_top {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 10px;
            margin-bottom: 10px;
            z-index: 10;
        }
        
        .pop_title_num {
            color: red;
        }
        
        .ccc_popUps_top_right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        
        #ccc_all_pack_down_btn, #ccc_all_page_screenShot {
            position: relative;
            cursor: pointer;
            background-color: #666666;
            color: #fff;
            padding: 6px 10px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 30px;
            transition: all 0.3s;
        }
        #ccc_all_page_screenShot{
            margin-right: 20px;
            background-color: #666666;
        }
        
        #ccc_all_page_screenShot:hover {
            background-color: #333333;
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
        }
        
        #ccc_all_pack_down_btn>.pop_title_num {
            /* position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%); */
            padding: 2px 4px;
            background-color: red;
            color: #ffffff;
            font-size: 10px;
            line-height: 10px;
            border-radius: 30px;
            margin-right: 2px;
        }
        
        #ccc_close_popUps {
            cursor: pointer;
            filter: grayscale(100%);
            font-size: 12px;
            margin-left: 30px;
        }
        
        #ccc_close_popUps:hover {
            filter: grayscale(0%);
        }
        
        #ccc_image_container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 10px;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
            padding: 10px;
            overflow: auto;
            align-content: start;
        }
        
        .ccc_image_item {
            position: relative;
            height: 120px;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            padding: 1px;
            box-sizing: border-box;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
        }
        
        .ccc_image_item:hover {
            box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
        }
        
        .ccc_image_item img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            cursor: zoom-in;
        }
        
        .ccc_imgItem_info,
        .ccc_imgItem_ctrl,
        .ccc_imgItem_delete {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            box-sizing: border-box;
            font-size: 10px;
            display: flex;
            align-items: center;
            opacity: 0;
            transition: all 0.3s;
        
        }
        
        .ccc_imgItem_info {
            left: 0;
            top: 0;
            padding: 3px 5px;
            border-bottom-right-radius: 5px;
            flex-wrap: wrap;
            max-width: 80%;
            line-height: 14px;
        }
        
        .ccc_imgItem_ctrl {
            right: 0;
            bottom: 0;
            color: #fff;
            padding: 3px 6px;
            border-top-left-radius: 5px;
        }
        
        .ccc_imgItem_delete {
            right: 0;
            top: 0;
            padding: 8px;
            background-color: transparent;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .ccc_imgItem_delete>span {
            width: 14px;
            height: 3px;
            border-radius: 6px;
            background-color: rgba(255, 0, 0, 1);
        }
        
        .ccc_imgItem_ctrl>div {
            width: 17px;
            height: 17px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .ccc_imgItem_ctrl svg {
            width: 100%;
            height: 100%;
        }
        
        .ccc_image_item:hover .ccc_imgItem_info,
        .ccc_image_item:hover .ccc_imgItem_ctrl,
        .ccc_image_item:hover .ccc_imgItem_delete {
            opacity: 1;
        }
        
        .viewer-container {
            z-index: 99999 !important;
        }
        
        #ccc_title_ctrl {
            display: flex;
            align-items: center;
        }
        
        #ccc_title_ctrl>.ccc_title_text {
            font-size: 14px;
        }
        
        #ccc_filter_out {
            position: relative;
            top: 1px;
            display: flex;
            width: 18px;
            height: 18px;
            margin-left: 20px;
        }
        
        #ccc_filter_out svg {
            width: 100%;
            height: 100%;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .ccc_view_filter {
            /* display: flex; */
            align-items: center;
            font-size: 12px;
            /* background-color: #fafafa; */
            /* padding: 10px 14px; */
            border-radius: 4px;
            margin-left: 14px;
            display: none;
        }
        
        #ccc_view_filter_itembox {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            max-width: 400px;
        }
        
        #ccc_view_filter_itembox>span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 3px 8px;
            font-size: 11px;
            border-radius: 4px;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
            background-color: #f5f5f5;
            margin-left: 8px;
        }
        
        #ccc_view_filter_itembox>span:first-of-type {
            margin-left: 0;
        }
        
        #ccc_filter_container {
            position: absolute;
            top: 50%;
            left: 40px;
            transform: translate(0, -50%);
            padding: 10px 15px;
            background: #fff;
            border: 1px solid #555;
            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.6);
            border-radius: 6px;
            z-index: 9;
            display: none;
            width: 160px;
            font-size: 14px;
            /* opacity: 0; */
        }
        
        #ccc_filter_container::before,
        #ccc_filter_container::after {
            position: absolute;
            content: '';
            top: 50%;
        }
        
        #ccc_filter_container::before {
            left: -23px;
            margin-top: -13px;
            border: 13px solid transparent;
            border-right: 12px solid #fff;
            z-index: 2;
        }
        
        #ccc_filter_container::after {
            left: -26px;
            margin-top: -13px;
            border: 13px solid transparent;
            border-right: 13px solid #555;
            z-index: 1;
        }
        
        #ccc_filter_container>div {
            width: 100%;
            display: flex;
            align-items: center;
            margin: 6px auto;
            align-items: center;
            justify-content: center;
        }
        
        #ccc_filter_container>div>span {
            width: 10%;
            text-align: center;
            display: block;
        }
        
        #ccc_filter_container>div input {
            width: 35%;
            height: 18px;
            font-size: 13px;
            text-align: center;
        }
        
        #ccc_filter_container>div input::placeholder {
            text-align: center;
            line-height: 18px;
        }
        
        #refilter_btn {
            width: 40px;
            height: 20px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2px;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
            color: #ffffff;
            background-color: #666666;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        #refilter_btn:hover {
            background-color: #333333;
            box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
        }
        
        #ccc_w_max::placeholder,
        #ccc_h_max::placeholder {
            position: relative;
            top: 5px;
            font-size: 26px;
        }
        
        #load_mask {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            letter-spacing: 1px;
            padding: 10px 20px;
            border-radius: 4px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 100;
        }
        
        .loader {
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            /* 边框的颜色 */
            border-top: 3px solid #3498db;
            /* 上边框颜色，旋转时的主要颜色 */
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
        
            100% {
                transform: rotate(360deg);
            }
        }
        
        .ccc_more {
            cursor: pointer;
            display: inline-block;
            margin-left: 4px;
        }
        
        .ccc_imgItem_info:hover .ccc_more {
            color: rgb(24, 144, 255)
        }
        
        .ccc_imgItem_info:hover {
            cursor: pointer;
        }
        
        .ccc_more>.loader {
            width: 12px;
            height: 12px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
        }
        
        
        #ccc_load_tip_style {
            position: fixed;
            width: 210px;
            padding: 12px 24px;
            top: 20px;
            right: 20px;
            color: #333;
            background-color: #fff;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
            border-radius: 5px;
            transition: all 0.5s ease-in-out 0s, transform 0.5s ease-in-out 0s;
            font-family: 'Damion', cursive;
            font-weight: 600;
            text-align: center;
            z-index: 999999;
        }
        
        #ccc_gotoUpdate {
            position: relative;
            margin-right: 20px;
            line-height: 24px;
        }
        
        #ccc_gotoUpdate>a {
            text-decoration: none;
            cursor: pointer;
            color: #909090;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        
        #ccc_gotoUpdate:hover>a {
            color: #007fff;
        }
        
        #ccc_gotoUpdate::before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 1px;
            width: 0;
            background-color: #007fff;
            transition: all 0.3s ease;
        }
        
        #ccc_gotoUpdate:hover::before {
            width: 100%;
        }
        
        .ccc_schedule_container {
            margin-top: 5px;
            display: flex;
            align-items: center;
        }
        
        .ccc_schedule_text {
            text-align: center;
            font-size: 14px;
            white-space: nowrap;
            padding-left: 10px;
        }
        
        .ccc_schedule_bg {
            position: relative;
            flex-grow: 1;
            height: 4px;
            border-radius: 2px;
            background-color: #ddd;
            margin: 2px auto;
            overflow: hidden;
        }
        
        .ccc_schedule_curr {
            height: 100%;
            background-color: #67C23A;
            width: 20%;
            transition: all 0.3s ease;
        }
        
        #curr_ing {
            color: #67C23A;
        }
        
        #ccc_fetch_pageImgs {
            display: flex;
            width: 20px;
            height: 20px;
            margin: auto 20px;
        }
        
        #ccc_fetch_pageImgs>svg {
            width: 100%;
            height: 100%;
        }
        #ccc_fetch_pageImgs_text{
            position: relative;
            font-size: 14px;
            margin-right: 20px;
        }
        #ccc_fetch_btn{
            cursor: pointer;
            padding: 3px 0;
            transition: all 0.1s ease;
        }
        #ccc_fetch_pageImgs_text>.ccc_fetch_tips{
            position: absolute;
            /* color: #F56C6C; */
            color: #999999;
            font-size: 11px;
            top: 100%;
            right: 0;
            width: 0%;
            text-align: right;
            letter-spacing: 1px;
            opacity: 0;
            white-space: nowrap;      /* 确保文本不会换行 */
            overflow: hidden;         /* 隐藏超出div的文本 */
            text-overflow: ellipsis;  /* 超出部分显示省略号 */
            transition: all 0.4s ease;
        }
        #ccc_fetch_btn:hover{
            color: #007fff;
        }
        #ccc_fetch_btn:hover + .ccc_fetch_tips{
            width: 400%;
            opacity: 1;
        }
        #ccc_fetch_btn:active{
            transform: translate3d(0, 1px, 0);
        }
        .click_style:active {
            transform: scale(0.9);
        }
        
        #ccc_notify{
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translate(-50%, 0);
            background-color: rgb(226, 244, 219);
            color: #67C23A;
            padding: 8px 20px;
            border-radius: 4px;
            font-size: 14px;
            letter-spacing: 1px;
            z-index: 8;
            opacity: 0;
            transition: all 0.3s ease;
        }
        #ccc_notify.active{
            top: 70px;
            opacity: 1;
        }
        
        .ccc_all_pack_down_container{
            display: flex;
            background-color: #666666;
            border-radius: 4px;
            transition: all 0.3s;
            cursor: pointer;
            
        }
        
        .ccc_all_pack_down_container:hover {
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
        }
        
        .ccc_all_pack_down_container> #ccc_all_pack_down_btn{
            margin-right: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            background-color: initial;
        }
        
        .ccc_all_pack_down_container>#ccc_all_pack_down_btn:hover{
            background-color: #333333;
        }
        #ccc_all_page_rename{
            position: relative;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            border-left: 1px solid #555;
            color: #eee;
            
        }
        #ccc_all_page_rename>.ccc_all_page_rename_icon{
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
            font-size: 12px;
            transition: all 0.3s;
        }
        .ccc_all_pack_down_container>#ccc_all_page_rename:hover .ccc_all_page_rename_icon, .ccc_focus_rename .ccc_all_page_rename_icon{
            font-size: 55px !important;
            z-index: 999 !important;
        }
        .ccc_all_pack_down_container>#ccc_all_page_rename:hover, .ccc_focus_rename #ccc_all_page_rename{
            background-color: #eee;
            color: red;
        }
        .ccc_all_page_rename_out{
            /* display: none; */
            visibility:hidden;
            position: absolute;
            top: 100%;
            padding: 10px 50px 50px 50px;
            cursor: initial;
        }
        .ccc_all_page_rename_container{
            opacity: 0;
            width: 0;
            /* width: 340px; */
            padding: 10px;
            border-radius: 10px;
            color: #333;
            /* background-color: #f5f5f5; */
            cursor: initial;
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
            background-color: rgba(255, 255, 255, 0.6); /* 设置半透明背景 */
            backdrop-filter: blur(10px); /* 应用背景模糊效果 */
            -webkit-backdrop-filter: blur(10px); /* 兼容老版本Safari */
            transition: all 0.3s;
        }
        .ccc_all_pack_down_container>#ccc_all_page_rename:hover .ccc_all_page_rename_out, .ccc_focus_rename .ccc_all_page_rename_out{
            display: block;
            visibility: visible;
        }
        .ccc_all_pack_down_container>#ccc_all_page_rename:hover .ccc_all_page_rename_container, .ccc_focus_rename .ccc_all_page_rename_container{
            width: 340px;
            opacity: 1;
        }
        
        .ccc_all_page_rename_container_tips_font{
            font-size: 13px;
            font-weight: 550;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            white-space: nowrap;
        }
        #ccc_all_page_rename_val{
            max-width: 100%;
            min-width: 100%;
            min-height: 100px;
            box-sizing: border-box;
            border: none;
            outline: none; /* 可选：移除聚焦时的轮廓 */
            padding: 4px 6px;
            border-radius: 6px;
            box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.7); /* 设置半透明背景 */
        
        }
`
    );
}