// ==UserScript==
// @name         TikTok Video
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  TikTok Video Tools For Saker!
// @author       Jimmy
// @include      *.tiktok.com/*/video/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-idle
// @connect      facebook.com
// @downloadURL https://update.greasyfork.org/scripts/533881/TikTok%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/533881/TikTok%20Video.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'center', // 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    //数据操作
    let util = {
        clog(c) {
            console.log(c);
        },
        getCookie(name) {
            let arr = document.cookie.replace(/\s/g, "").split(';');
            for (let i = 0, l = arr.length; i < l; i++) {
                let tempArr = arr[i].split('=');
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
            }
            return '';
        },
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getStorage(key) {
            return localStorage.getItem(key);
        },
        setStorage(key, value) {
            return localStorage.setItem(key, value);
        },
        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            }
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 404) {
                            requestObj.abort();
                        }
                        resolve(res.response || res.responseText);
                    },
                    onprogress: (res) => {
                    },
                    onloadstart() {
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    };

    let videoBox = ".css-cokcf3-DivContentFlexLayout.eogpv4e1" //列表页视频div
    let videoBoxBtn = '.css-cokcf3-DivContentFlexLayout.eogpv4e1'
    let downloadBtn = '.myDownloadVideoBtn'
    let q = util.getUrlParam('q') || ""
    let pageid = util.getUrlParam('view_all_page_id') || ""
    console.log('q',q);
    console.log('pageid',pageid);

    //新增页面元素内容
    let addhtml = '<div class="sakerHtml" style="display: flex;align-items: center;">'
    addhtml += '<button class="myDownloadVideoBtn" style="width:48px; margin-bottom: 20px; padding: 10px; border: none; border-radius: 5px; background: #034e96; color: #fff; cursor: pointer;">'
    addhtml += '<span style="display:none;" class="btnLoading"><svg style="height:16px;width:auto;" width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg></span>'
    addhtml += '<span class="btnText">下载视频</span>';
    addhtml += '</button>';
    addhtml += '</div>';

    setInterval(async function(){
        if($(videoBox).length > 0){
            $(videoBox).each(function(i){
                if($(this).find(downloadBtn).length<1){
                    console.log('33333',i);
                    $(this).prepend(addhtml);
                }
            })
        }
    }, 1000);

    $('body').on('click',".myDownloadVideoBtn", function(){
         var videoUrl = $(this).parents('.css-cokcf3-DivContentFlexLayout.eogpv4e1').find('video source').attr('src');
        if(!videoUrl){
            videoUrl = $(this).parents('.css-cokcf3-DivContentFlexLayout.eogpv4e1').find('video').attr('src');
        }
        console.log('videoUrl',videoUrl);
        if(videoUrl){
            var fileName = Math.floor(Date.now() / 1000)+".mp4";
            fetch(videoUrl)
                .then(resp => resp.blob())
                .then(blob => {
                var url = window.URL.createObjectURL(blob);
                saveAs(url, fileName);
                $(this).find('.btnLoading').hide();
                $(this).find('.btnText').show();
            }).catch((e)=>{
                return util.message.error('文件命名失败，点击<a href="'+videoUrl+'" target="_blank">这里</a>重新下载.')
                $(this).find('.btnLoading').hide();
                $(this).find('.btnText').show();
            });
        }else{
            return util.message.error('没有找到视频文件.')
            $(this).find('.btnLoading').hide();
            $(this).find('.btnText').show();
        }
    })
})();