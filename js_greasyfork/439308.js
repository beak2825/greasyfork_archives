// ==UserScript==
// @name         Gelbooru 无限滚动
// @namespace    https://greasyfork.org/zh-CN/scripts/439308
// @version      1.5
// @description  实现 Gelbooru 图片浏览页面无限滚动，支持 post、pool、favorites 以及 saved search 页
// @description_en Gelbooru infinite scrolling
// @author       ctrn43062
// @include      *://gelbooru.com/index.php*
// @icon         https://gelbooru.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @note         1.5 修复 token 过期导致保存 artists 失败的问题
// @note         1.4 修复无 artist tag 时的显示问题
// @note         1.3 1.添加快捷保存 artist 功能；2.修复 notice block 显示问题
// @note         1.2 实现导出图片信息功能
// @note         1.1 点击图片后会在新窗口打开
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/439308/Gelbooru%20%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439308/Gelbooru%20%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

// 是否正在加载下一页数据 flag
let loadingNextPage = false;

// 是否显示分页栏
const showPaginator = true;

// 当滚动条距离页面底部多少像素的时候触发加载下一页数据功能；调大这个值以更提前地加载下一页数据
const scrollBuffer = 500;

const baseURLObj = new URL(location.href);
const searchParams = baseURLObj.searchParams;

let currentPage = parseInt(searchParams.get('pid')) || 0;

// Gelbooru 的 pid 增长值（无需修改）
let pageSize = 42;
// 获取页面的类型，目前支持的页面有 post pool favorites
// 不同的页面的 pageSize 和 html 结构可能有所不同
const pageType = searchParams.get('page');

// 页面有 s=view 表示正在查看单图，无需显示加载提示
const showTip = !(searchParams.get('s') === 'view');

// 因为 favorite 页的 html 结构不同所以需要特判当前页面是否是 favorite 页
// 这个列表维护所有无需特判的页
const PAGES_WITHOUT_FAVORITE = ['post', 'pool'];
const imageList = [] // 选中图片的列表

// SVG Icon
const PREVIEW_SVG = `<?xml version="1.0"encoding="utf-8"?><!--Uploaded to:SVG Repo,www.svgrepo.com,Generator:SVG Repo Mixer Tools--><svg width="800px"height="800px"viewBox="0 0 18 18"xmlns="http://www.w3.org/2000/svg"><path fill="#494c4e"d="M17.707 16.288l-3.43-3.43a4.47 4.47 0 1 0-1.418 1.42l3.43 3.43a1 1 0 1 0 1.417-1.42zM8 10.478a2.48 2.48 0 1 1 2.48 2.48A2.48 2.48 0 0 1 8 10.48z"/><path fill="#494c4e"d="M10 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h6.1a6.53 6.53 0 0 1-2.587-3H3a1 1 0 0 1 0-2h1.034C4.02 10.825 4 10.654 4 10.478A6.447 6.447 0 0 1 4.177 9H3a1 1 0 0 1 0-2h2.022a6.526 6.526 0 0 1 2.014-2H3a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1 .913.913 0 0 1-.038.187A6.437 6.437 0 0 1 10.478 4c.176 0 .348.013.52.026V1A1 1 0 0 0 10 0z"/></svg>`
const EXPORT_SVG = `<?xml version="1.0"encoding="UTF-8"standalone="no"?><!--Uploaded to:SVG Repo,www.svgrepo.com,Generator:SVG Repo Mixer Tools--><svg width="800px"height="800px"viewBox="0 -0.5 21 21"version="1.1"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"><title>download[#1453]</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1"stroke="none"stroke-width="1"fill="none"fill-rule="evenodd"><g id="Dribbble-Light-Preview"transform="translate(-339.000000, -480.000000)"fill="#000000"><g id="icons"transform="translate(56.000000, 160.000000)"><path d="M297.92575,332.227 L294.9427,334.913 C294.13315,335.641 292.86685,335.641 292.0573,334.913 L289.07425,332.227 C288.65215,331.848 288.6343,331.215 289.03225,330.813 L289.03225,330.813 C289.4302,330.412 290.09485,330.394 290.51695,330.773 L291.5638,331.716 C291.89875,332.018 292.45,331.792 292.45,331.353 L292.45,326 C292.45,325.448 292.9204,325 293.5,325 C294.0796,325 294.55,325.448 294.55,326 L294.55,331.353 C294.55,331.792 295.10125,332.018 295.43515,331.716 L296.48305,330.773 C296.9041,330.394 297.56875,330.412 297.96775,330.813 L297.96775,330.813 C298.3657,331.215 298.3468,331.848 297.92575,332.227 M300.85,338 L286.15,338 C285.5704,338 285.1,337.553 285.1,337 L285.1,323 C285.1,322.448 285.5704,322 286.15,322 L300.85,322 C301.4296,322 301.9,322.448 301.9,323 L301.9,337 C301.9,337.553 301.4296,338 300.85,338 M283,322 L283,338 C283,339.105 283.93975,340 285.1,340 L301.9,340 C303.0592,340 304,339.105 304,338 L304,322 C304,320.896 303.0592,320 301.9,320 L285.1,320 C283.93975,320 283,320.896 283,322"id="download-[#1453]"></path></g></g></g></svg>`

const SELECTED_IMAGE_CLASS = 'gelinf-selected'


GM_addStyle(`
  .select-container {
    position: fixed;
    right: 5px;
    top: 45%;
  }

  .select-container div {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: rgb(224,224,224);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    cursor: pointer;
    box-shadow: 0 0 3px rgba(0,0,0,0.3);
    overflow: hidden;
  }
`)

// 获取数据
function getPage() {
    const url = baseURLObj.origin + baseURLObj.pathname + '?' + searchParams;
    return fetch(url).then(resp => resp.text())
}

function getPageSize() {
    switch (pageType) {
        case 'post':
            return 42;
        case 'pool':
            return 45;
        case 'favorites':
            return 50;
        case 'tags':
            return 5;
        case 'comment':
            return 10;
    }
}

// 显示页面加载提示
function showLoadingTip(tip = '') {
    if (!showTip) {
        return {
            remove: () => {}
        }
    }

    const loadingTip = document.createElement('center');
    const paginator = document.querySelector('#paginator')
    const pagination = paginator.parentElement;

    // 加载下一页数据的提示文本
    loadingTip.textContent = tip || `Loading Page ${Math.floor(currentPage / pageSize) + 1}`
    loadingTip.style.margin = '30px 0';
    loadingTip.style.color = '#888';
    loadingTip.style.fontSize = '0.85rem';
    loadingTip.style.fontWeight = 'bold';
    loadingTip.style.clear = 'both';

    pagination.insertBefore(loadingTip, paginator);

    return loadingTip;
}

function getScrollHeight() {
    const scrollTop =
          document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;

    const scrollHeight =
          document.documentElement.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight;

    const innerHeight = window.innerHeight;

    return {
        scrollTop: scrollTop,
        scrollHeight: scrollHeight,
        innerHeight: innerHeight
    };
}

function download(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 0)
}

function initExportImageElement() {
    function getSelectedImages() {
        return [...document.querySelectorAll('.' + SELECTED_IMAGE_CLASS)]
    }

    const elementsMap = {
        'previewEle': {
            callback() {

            },
            html: PREVIEW_SVG
        },
        'exportEle': {
            callback() {
                const selectedImages = getSelectedImages()
                console.log(selectedImages)
                if(!selectedImages.length) {return ;}

                const json = JSON.stringify(selectedImages.map(img => ({url: img.src, id: img.parentElement.id, tags: img.alt.replace('Rule 34 | ', '')})))
                const fileURL = URL.createObjectURL(new Blob([json]))
                console.log(fileURL)
                const searchEl = document.querySelector('#tags-search')
                const defaultFilename = searchEl ? searchEl.value : ''
                let filename = prompt('filename:', defaultFilename)

                if(filename && !filename.endsWith('.json')) {
                    filename = filename + '.json'
                }

                download(fileURL, filename.trim() || 'output.json')
            },
            html: EXPORT_SVG
        }
    }

    const elements = Object.keys(elementsMap).map(elName => {
        const el = document.createElement('div')
        const { callback, html } = elementsMap[elName]

        el.classList.add('select__item')

        el.innerHTML = html
        el.onclick = callback || (() => { console.error(`${elName} havn't click callback`)})

        return el
    })

    const container = document.createElement('div')
    container.classList.add('select-container')

    for(const el of elements) {
        container.appendChild(el)
    }

    document.body.appendChild(container)
}


function saveTagSearch2(token) {
    $.post(`index.php?page=tags&s=saved_search&csrf-token=${token}`, {
        save_tag_search: $('#tags-search').val()
    }).done(function(data) {
        if (data && !data.includes('Invalid')) {
            window.notice("Saved this search successfully! You can access these via the Tags link in the header.");
        } else {
            window.notice("There was an error saving this search. Perhaps it already existed or you are not logged in?");
        }
    });
    ;
}


function addFavoriteAndSelect(container) {
    container.querySelectorAll('a > img[alt]').forEach(img => {
        const fav = document.createElement('center');
        const parentEle = img.parentElement;
        const href = parentEle.href;
        const postId = new URL(href).searchParams.get('id');

        fav.innerHTML = `
        <a href="#" onclick="post_vote('${postId}', 'up'); addFav('${postId}'); return false;">Fav</a>
        <a href="#" class="fav-artist">FavArtist<a/>
        <a href="#" class="select">Select</a>
        `;


        fav.querySelector('.fav-artist').onclick = function(e) {
            e.preventDefault()
            const id = new URLSearchParams(href).get('id')
            if(!id) { return }
            // Get artist tag
            fetch(`https://gelbooru.com/index.php?page=post&s=view&id=${id}`).then(resp => resp.text()).then(text => {
                const parser = new DOMParser()
                const html = parser.parseFromString(text, 'text/html')
                const artistList = [...(html.querySelectorAll('.tag-type-artist > a') || [])].map(node => new URLSearchParams(node.href).get('tags'))
                const csrfToken = text.match(/&csrf-token=(\w+)/)

                if(!csrfToken) {
                    window.notice('Invalid Token. Please refresh this page.')
                }



                if(!artistList.length) {
                    window.notice(`Can\'t find artist tag for post: ${id}`)
                } else if (artistList.length > 1) {
                    window.notice(`Post ${id} has multiple artist tags" ${artistList.join(', ')}, please manually select which tag to save`)
                } else {
                    // 原版 savedSearch 通过 $('#tags-search').val() 获取要保存的 tag，这里写死了，要修改参数有两种方法：1。临时修改 #tags-search 的值；2.修改 #tags-search 替换成自己的元素，然后改回去，这里选用第一种方法
                    const tagsSearch = document.querySelector('#tags-search')
                    if(tagsSearch) {
                        const oldValue = tagsSearch.value
                        const artist = tagsSearch.value = artistList[0]
                        window.notice(`Adding artist:${artist}`)

                        setTimeout(() => {
                            saveTagSearch2(csrfToken[1])
                            setTimeout(() => {
                                tagsSearch.value = oldValue
                            }, 0)
                        }, 50)
                    }
                }
            }).catch(e => console.error(e))
        }

        fav.querySelector('.select').onclick = function(e) {
            e.preventDefault()

            let imgIndex = imageList.findIndex(id => id === postId)
            if(imgIndex < 0) {
                imageList.push(postId)
                img.classList.add(SELECTED_IMAGE_CLASS)
                img.style.outline = `4px solid red`
          } else {
              imageList.splice(imgIndex, 1)
              img.style.outline = 'none'
              img.classList.remove(SELECTED_IMAGE_CLASS)
          }

            return false;
        }

        parentEle.style.position = 'relative';
        fav.style.position = 'absolute';
        fav.style.bottom = 0;
        fav.style.transform = 'translate(-50%, 100%)';
        fav.style.left = '50%';
        Object.assign(fav.style, {
            display: 'inline-block',
            width: '100%'
        })
        img.parentElement.appendChild(fav);
    })
}



function _addFav(a) {
    $.get("public/addfav.php?id=" + a, function(b) {
        if (b == "1") {
            notice(`Post <strong>${a}</strong> already in your favorites`)
        } else {
            if (b == "2") {
                notice("You are not logged in")
            } else {
                notice(`Post <strong>${a}</strong> added to favorites`)
            }
        }
    })
}


function g_notice() {
    let timer = null;
    const noticeEle = document.querySelector('#notice');

    return (message) => {
        noticeEle.style.display = 'block';
        noticeEle.innerHTML = `<span>${message}</span>`;

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            noticeEle.style.display = ' none';
            timer = null;
        }, 3000);
    }
}


// 初始化基本功能
function init() {
    pageSize = getPageSize();

    if (!showPaginator) {
        const paginator = document.querySelector('#paginator');
        paginator.style.display = 'none';
    }

    // 仅支持 post 页显示快速 fav 按钮
    if (pageType === 'post') {
        addFavoriteAndSelect(document);
    }

    // 添加自定义 fav 函数，原本功能不变，修改的主要是 notice 的提示
    window.addFav = unsafeWindow.addFav = _addFav;

    // 添加自定义 notice
    window.notice = unsafeWindow.notice = g_notice();

    document.querySelectorAll('.thumbnail-container a').forEach(item => {
        item.setAttribute('target', '_blank');
    })

    // 导出
    initExportImageElement()
}

(function() {
    'use strict';
    init();

    window.addEventListener('scroll', () => {
        const scroll = getScrollHeight();
        const scrollTop = scroll['scrollTop'],
              scrollHeight = scroll['scrollHeight'],
              innerHeight = scroll['innerHeight'];

        // 当滚动条触底且没有正在加载数据的时候，加载下一页数据
        if (scrollTop + innerHeight >= scrollHeight - scrollBuffer && !loadingNextPage) {
            loadingNextPage = true;
            currentPage = parseInt(currentPage) + pageSize;
            searchParams.set('pid', currentPage);

            // 地址栏的 pid 会跟随滚动更新
            history.replaceState({}, '', baseURLObj);

            const loadingTip = showLoadingTip();

            getPage().then(text => {
                let container, nodes;
                const dummyHTML = document.createElement('html');
                dummyHTML.innerHTML = text;

                const postOrPoolPage = ['post', 'pool'].includes(pageType)

                if (postOrPoolPage) {
                    container = document.querySelector('.thumbnail-container');
                    nodes = dummyHTML.querySelector('.thumbnail-container').children;
                    if (pageType === 'post') {
                        addFavoriteAndSelect(dummyHTML);
                    }
                } else if (pageType === 'favorites') {
                    container = document.querySelector('#paginator');
                    nodes = dummyHTML.querySelectorAll('.thumb');
                } else if (pageType === 'tags') { // 适配 saved search 页   粪代码
                    container = document.querySelector('#paginator');
                    const node = dummyHTML.querySelector('main');
                    node.querySelector('.mainBodyPadding').remove();
                    node.querySelector('#paginator').remove();
                    nodes = node.children;
                } else if (pageType === 'comment') {
                    container = document.querySelector('.mainBodyPadding');
                    const node = dummyHTML.querySelector('.mainBodyPadding');
                    // node.querySelector('.pagination').remove();
                    nodes = node.children;
                }

                // 没有数据了
                if (nodes.length === 0) {
                    loadingTip.textContent = 'Nobody here but us chickens!';
                    return;
                } else {
                    const dummyPaginator = dummyHTML.querySelector('#paginator');
                    document.querySelector('#paginator').innerHTML = dummyPaginator.innerHTML;
                }

                Array.from(nodes).forEach((node) => {
                    // console.log(node, 'node');
                    node.querySelectorAll('a').forEach(item => {
                        item.setAttribute('target', '_blank');
                    })

                    if (postOrPoolPage || pageType === 'comment') {
                        container.appendChild(node);
                    } else if (pageType === 'favorites' || pageType === 'tags') {
                        container.parentElement.insertBefore(node, container)
                    }
                })

                loadingNextPage = false;
                loadingTip.remove();
            })
        }
    })
})();