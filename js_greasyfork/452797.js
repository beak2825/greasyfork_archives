// ==UserScript==
// @name         1688图片下载小助手
// @description	 1688图片下载(包含详情页)
// @author       dlswxy@qq.com(不能使用请联系我)
// @match        https://detail.1688.com/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant	 GM_addStyle
// @license MIT
// @version 0.1.4
// @namespace https://greasyfork.org/users/968663
// @downloadURL https://update.greasyfork.org/scripts/452797/1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452797/1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 根据之前大佬改编的：https://greasyfork.org/zh-CN/scripts/449704-1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B
// 之前的脚本没有详情页面的图片，本次增加
// 去除属性图片
// 详情页面需要将1688拉到最底部将图片全部加载完成才能下载

window.onload = async () => {
    await downloadFlow()
}

// 下载流程函数
function downloadFlow() {
    const props = getData()
    if (!props) { return }
    const downoadList = getLists(props) // 获得视频和图片
    // console.log('downoadList',downoadList)
    setDownBtn(downoadList, props) // 添加下载按钮
}


// 添加下载按钮
function setDownBtn(downoadList, props) {
    const btn = document.createElement("button"); //创建一个input对象（提示框按钮）
    btn.textContent = "下载图片/视频";
    btn.style.align = "center";
    btn.style.border = '1px solid #f60';
    btn.style.color = '#ff6444';
    btn.style.padding = '6px'
    btn.style.background = '#fff';
    btn.style.borderRadius = '6px';
    btn.style.margin = '10px';
    btn.style.cursor = 'pointer';

    btn.onclick = function () {
        downLoadFn(downoadList, props)
    }

    const wrapper = document.getElementsByClassName('gallery-fix-wrapper')[0] || document.getElementsByClassName('detail-gallery-wrapper')[0]
    GM_log(wrapper)
    wrapper.appendChild(btn)
}
// 获取数据方法
function getData() {
    // 全部变量
    const props = {}
    props.id = location.pathname.substr(7,12)
    return props
}

function getLists(props) {
    console.log('id: ', props)
    // 视频
    let videoSrc = document.getElementsByTagName('video')[0]?.getAttribute('src') || ''
    // if(videoSrc) GM_download(videoSrc, props.id + '.mp4')
    // 图片
    let [...picUlList] = document.querySelectorAll(('.detail-gallery-turn-outter-wrapper img')) // 获取图片列表
    // 获取详情页面图片
    let [...detailUrlList] = document.querySelectorAll(('.content-detail img'))

    let attrUrlList = [];
    let [...attrEleList1] = document.querySelectorAll(('.pc-sku-wrapper .sku-item-wrapper'))
    let [...attrEleList2] = document.querySelectorAll(('.pc-sku-wrapper .prop-item-inner-wrapper '))
    // 单一属性
    if (attrEleList2.length == 0) {
        attrEleList1.forEach((item, index)=>{
            let attrImgEle = item.querySelector(('.sku-item-image'))
            let attrImgUrl = getComputedStyle(attrImgEle, "style").backgroundImage.slice(5, -2)
            let attrNameEle = item.querySelector(('.sku-item-name'))
            let attrName = attrNameEle.innerText
            // 组装数据
            let attrInfo = {}
            attrInfo.src = attrImgUrl
            attrInfo.name = attrName
            attrUrlList.push(attrInfo)
        })
    // 2个属性
    } else {
        attrEleList2.forEach((item, index)=>{
            // 图片名规则
            let attrImgEle = item.querySelector(('.prop-img'))
            let attrImgUrl = getComputedStyle(attrImgEle, "style").backgroundImage.slice(5, -2)
            let attrNameEle = item.querySelector(('.prop-name'))
            let attrName = attrNameEle.innerText
            // 组装数据
            let attrInfo = {}
            attrInfo.src = attrImgUrl
            attrInfo.name = attrName
            attrUrlList.push(attrInfo)
        })
    }



    if (videoSrc) {
        picUlList.splice(0, 2)
    } // 去掉含视频的图片
    GM_log('picUlList', picUlList);
    return {
        videoSrc,
        picUlList,
        detailUrlList,
        attrUrlList
    }
}

function downLoadFn(downoadList, props) {
    const {videoSrc, picUlList, detailUrlList, attrUrlList} = downoadList
    // console.log(videoSrc,picUlList)
    if(videoSrc) GM_download(videoSrc, props.id + '.mp4') // 下载视频
    picUlList.forEach((item, index)=>{
        // 图片名规则
        let srcUrl = item.src
        // 主图最多五张
        if (index <= 4) {
            GM_download(srcUrl, 'main-' + index + '-' + props.id + '.jpg')
        }
    })
    detailUrlList.forEach((item, index)=>{
        // 图片名规则
        let srcUrl = item.src
        let imgName = ''
        if (index <= 9) {
            imgName = 'detail-0' + index + '-' + props.id + '.jpg'
        } else {
            imgName = 'detail-' + index + '-' + props.id + '.jpg'
        }
        GM_download(srcUrl, imgName)
    })
    attrUrlList.forEach((item, index)=>{
        // 图片名规则
        let srcUrl = item.src
        let srcName = item.name
        let imgName = ''
        if (index <= 9) {
            imgName = 'sku-0' + index + '-' + srcName + '-' + props.id + '.jpg'
        } else {
            imgName = 'sku-' + index + '-' + srcName + '-' + props.id + '.jpg'
        }
        GM_download(srcUrl, imgName)
    })
}