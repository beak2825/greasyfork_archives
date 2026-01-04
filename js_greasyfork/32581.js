// ==UserScript==
// @name         daum漫画图片下载
// @namespace    http://weibo.com/liangxiafengge/
// @version      0.4.2
// @description  一键下载Daum的整话漫画
// @author       CW2012
// @icon         http://s1.daumcdn.net/photo-section/-cartoon10/favicon/201312/favicon.ico
// @match        http*://webtoon.daum.net/webtoon/view/*
// @match        http*://webtoon.daum.net/webtoon/viewer/*
// @match        http*://webtoon.daum.net/league/viewer/*
// @match        http*://webtoon.daum.net/league/view/*
// @connect      http://webtoon.daum.net/
// @connect      http://t1.daumcdn.net/
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32581/daum%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32581/daum%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
/****************************************************************************
超级坑爹的一点：
千万不要在上面的配置区里使用tab键，否则会出现配置失败的情况
// @grant(tab)        GM_xmlhttpRequest
我就是无意中在这里点了一下tab键，它又不显示出来，导致我以为tab键被自动清除了
但是它居然还TM在！！！！！！！！！！！！！！！！！！！！！！！！！！！！
最后grant的是tab，而不是GM_xmlhttpRequest
还特么报错说“而不是GM_xmlhttpRequest is not defined”靠！
****************************************************************************/
let downloadCount = 0;    // 下载一话时，这一话的图片数目
let picCount;
let txt = '';
let finished = true; // 是否完成下载作业
let zip;
let eposideName;
let comicType;
(function() {
    'use strict';
    let tmpStr = location.href.split('#')[0];
    tmpStr = tmpStr.split('\/');
    comicType = tmpStr[3];
    if(tmpStr[4]=='view'){
        // 漫画列表页
        downloadFromEposideList();
    }else if(tmpStr[4]=='viewer'){
        // 漫画阅读页
        downloadFromRead();
    }
})();

function downloadFromEposideList(){
    // 考虑到页面加载数据还需要一段时间，如果需要依附的元素还没生成，下面的添加按钮的动作将无法执行
    if(document.querySelectorAll('.clear_g.list_update>li').length == 0){
        // 这里上列表还没加载进来时的逻辑

        // 奇怪，就算不请求任何数据，这个元素也是存在的，为什么没有触发元素改变的事件？？？
        let eposideList = document.querySelector(comicType =='league'?'#episodeList .list_update':'.clear_g.list_update');
        // 监听eposideList元素，如果数据加载进来了，它的li子元素的个数会大于0
        // 监听子元素变化需要开启childList，attributes是监听本元素的变化，如class变化等
        new MutationObserver(eposideListChanged).observe(eposideList, {
            attributes: false,
            childList: true,
            subtree: false
        });
        return;
    }
}

// 发生数据加载时，添加按钮
function eposideListChanged(){
    // 等待一秒钟，让元素全部添加到网页上后，再添加我们的按钮
    setTimeout(()=>{
        let smallPicList= document.querySelectorAll(comicType =='league'?'#episodeList .list_update>li':'.clear_g.list_update>li');
        if(smallPicList.length == 0){
            return;
        }
        // 按钮应该出现的位置:缩略图所在的元素
        smallPicList.forEach((item,index)=>{
            let btnParent = item.lastElementChild;
            btnParent.style.display='flex';
            btnParent.style.diapley = 'flex';
            btnParent.style.justifyContent = 'space-between';
            // 分割线
            let line = document.createElement('span');
            line.className = 'ico_comm ico_bar';
            btnParent.appendChild(line);
            // 问题来了，收费的篇章是不能下载的，那么，不如收费篇章就不要添加下载按钮好了
            if(btnParent.children.length>2){
                return;
            }
            // 创建一个“下载”锚点（a），并美化亿下
            let btn = document.createElement('a');
            btn.innerText = '下载这一话';
            btn.style.background ='#e83d3d';     //使用和原网页一样的配色，没有突兀感
            btn.style.color = '#fff';
            btn.style.padding = '3px';
            btn.style.borderRadius = '3px';
            btn.style.textDecoration='none';// 不显示下划线
            btn.style.cursor = 'pointer';       // 鼠标悬浮时，指针变成手形，让用户知道可以点击
            btn.addEventListener('click', e=>{
                // 获得这一话的ID,并根据ID下载
                if(!finished){
                    alert('上一个下载作业还未完成，请等待完成后继续');
                    return;
                }
                getEposideInfoAndDownload(item.firstElementChild.href.split('/')[5]);
            });
            btnParent.appendChild(btn);    //添加到网页中
        });
    },1000);
}

// 根据这一话的ID，下载一整话
function downloadEposide(eposideId){
    //  一话的链接，请求API
    let tmp = (comicType == 'league')?'leaguetoon':'webtoon';
    let url = `http://webtoon.daum.net/data/pc/${tmp}/viewer_images/${eposideId}`;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(res){
            if(res.status === 200){
                // 分析所得数据，并下载图片
                let response = JSON.parse(res.responseText); // 这里返加的是文本，需要转换成JSON对象才能用
                if(parseInt(response.result.status) == 200){
                    let data = response.data;
                    // data虽然是Array，但是不能用foreach??
                    picCount = data.length;
                    downloadCount = 0;
                    zip = new JSZip();
                    finished = false;
                    txt = '';
                    for(let i=0;i<data.length;i++){
                        // 下载单幅图片
                        let item = data[i];
                        if(item.mediaType == 'image') {
                            downloadSinglePic(item.url, item.imageOrder);
                        } else{
                            ++downloadCount;
                            txt +=`编号${i+1},`;
                            // downloadSingleMp4(item.url, item.imageOrder);
                        }
                    }
                }else{
                    console.log(`ID为${eposideId}的这一话下载失败`);
                }
            }else{ console.log(`ID为${eposideId}的这一话下载失败`); }
        },
        onerror : function(err){ console.log(`ID为${eposideId}的这一话下载失败,原因为${err}`);  }
    });
}

// 下载单幅图片
async function downloadSinglePic(picUrl, picNum){
    GM_xmlhttpRequest({
        method: "GET",
        url: picUrl,
        responseType:'blob',
        onload: function(res){
            const imageBlob = res.response;
            let picName = `${picNum<10? '0':''}${picNum}.jpg`;
            const imgData = new File([imageBlob], picName);
            zip.file(picName, imgData, { base64: true });
            zip.generateAsync({ type: 'blob' }).then(function(content) {
                progress(++downloadCount);
                if(downloadCount>=picCount){
                    if(txt!=''){
                        txt = txt.substr(0,txt.length-1);
                        zip.file('部分无法下载的文件（非图片）列表.txt', txt);
                        zip.generateAsync({type: 'blob'}).then(
                            contentWithTxt=>
                            downloadFileByBlob(contentWithTxt, eposideName)
                        );
                        return;
                    }
                    downloadFileByBlob(content, eposideName);
                    // delete(document.getElementById('progressBar'))
                }
            });
        },
        onerror: ()=>{console.error('下载图片出错')}
    });
}

// 其实是错误的
function downloadSingleMp4(picUrl, picNum){
    // tamperMonkey的官方文档，参数说明 https://www.tampermonkey.net/documentation.php

    // 下载失败、超时的每一张图片单独提醒用户
    // 下载成功不打开“另存为”窗口
    GM_download({
        url:picUrl,
        name: `${picNum<10? '0':''}${picNum}.mp4`,
        saveAs:false,
        onload:()=>{
            // 每下载成功一张图片减一，减到0时，表示这一话已经全部下载完成
            progress(++downloadCount);
            if(downloadCount>=picCount){
                // 但是alert弹窗的样式非常得不银杏化，因此我们来美化一下
                toast(1, '这一话的所有图片全部处理完成')
            }
        },
        onerror: ()=>{
            toast(-1, `下载第${picNum}个视频时出错，请按Ctrl+shift+I打开开发者工具自行下载`)
            console.log(`下载第${picNum}幅视频时出错，它的下载链接是：\n${picUrl}`);
        },
        ontimeout: ()=>{
            toast(-1,`下载第${picNum}幅视频时超时，请按Ctrl+shift+I打开开发者工具自行下载`)
            console.log(`下载第${picNum}幅视频时超时，它的下载链接是：\n${picUrl}`);
        }
    });
}

// 显示自定义的弹窗
// type 消息类型：1成功，0提示，-1错误
// msg消息体
const colors = ['rgba(7 123 11 / 73%)','rgb(8 99 3 / 73%)','rgba(7 135 247 / 73%)'];
function toast(type, msg){
    let toastBox = document.createElement('div');
    toastBox.style.position = 'fixed';
    toastBox.style.background='white';
    toastBox.style.borderRadius='10px';
    toastBox.style.background= colors[type+1];
    toastBox.style.boxShadow='rgb(25 25 25) 1px 1px 10px 1px';
    toastBox.innerText=msg;
    toastBox.style.color = '#fff';
    toastBox.style.bottom='12vh';     // 显示的位置不能离底部太低了，会被其他元素遮挡
    toastBox.style.left='2vh';
    toastBox.style.transition='1.5s';
    toastBox.style.padding = '10px';
    document.body.appendChild(toastBox);
    // 6秒后自动隐藏
    setTimeout(()=>{
        toastBox.style.opacity = '0';
        delete(toastBox);
    }, 6000);
}
// 显示下载进度
function progress(prog){
    let bar = document.getElementById('progressBar');
    if(bar){
        bar.innerText = `正在下载：${prog}/${picCount}`;
        if(prog == -1){
            bar.remove();
        }
        return;
    }
    let progressBox = document.createElement('div');
    progressBox.id = 'progressBar';
    progressBox.style.position = 'fixed';
    progressBox.style.background='white';
    progressBox.style.borderRadius='10px';
    progressBox.style.background= colors[2];
    progressBox.style.boxShadow='0 8px 16px 0 rgba(0,0,0,.2), 0 6px 20px 0 rgba(0,0,0,.19)';
    progressBox.innerText=`正在下载：0/${picCount}`;
    progressBox.style.color = '#fff';
    progressBox.style.bottom='200px';     // 显示的位置不能离底部太低了，会被其他元素遮挡
    progressBox.style.left='2vh';
    progressBox.style.transition='1.5s';
    progressBox.style.padding = '10px';
    document.body.appendChild(progressBox);
}

// 在阅读页上添加下载的功能
function downloadFromRead(){
    // 先添加一个悬浮按钮？？？
    // 创建一个“下载”锚点（a），并美化一下
    let btn = document.createElement('a');
    btn.innerText = '下载这一话';
    btn.style.position = 'fixed';
    btn.style.left = '20px';
    btn.style.top = '45vh';
    btn.style.background ='#e83d3d';     //使用和原网页一样的配色，没有突兀感
    btn.style.color = '#fff';
    btn.style.padding = '13px';
    btn.style.fontSize= '20px';
    btn.style.boxShadow='gray 1px 1px 35px 0';
    btn.style.borderRadius = '13px';
    btn.style.textDecoration='none';// 不显示下划线
    btn.style.cursor = 'pointer';       // 鼠标悬浮时，指针变成手形，让用户知道可以点击
    btn.addEventListener('click', e=>{
        // 获得这一话的ID,并根据ID下载,跟上面的逻辑是一模一样的
        if(!finished){
            alert('上一个下载作业还未完成，请等待完成后继续');
            return;
        }
        let eposideId = location.href.split('/')[5];
        getEposideInfoAndDownload(eposideId);
    });
    document.body.appendChild(btn);    //添加到网页中
}

// 获得这一话的信息
function getEposideInfoAndDownload(eposideId){
    picCount = '正在获取....';
    progress(0);
    let tmp = (comicType == 'league')?'leaguetoon':'webtoon';
    // http://webtoon.daum.net/data/pc/webtoon/viewer/93187?timeStamp=1607874553918
    GM_xmlhttpRequest({
        method: "GET",
        url: `http://webtoon.daum.net/data/pc/${tmp}/viewer/${eposideId}`,
        onload: function(res){
            if(res.status === 200){
                let data = JSON.parse(res.responseText);
                if(data.result.status == 200){
                    data = data.data;
                    let prop = (comicType == 'league')?'leaguetoon':'webtoonEpisode';
                    eposideName = data[prop].title;
                    downloadEposide(eposideId);
                }else{
                    alert('获取信息出错')
                }

            }
        }
    });
}

// 利用blob下载文件
function downloadFileByBlob(blobContent, filename) {
    const blobUrl = URL.createObjectURL(blobContent)
    const eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    eleLink.href = blobUrl
    eleLink.click();
    progress(-1);
    finished = true;
}