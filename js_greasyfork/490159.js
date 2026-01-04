// ==UserScript==
// @name         Facebook Ads Video
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Facebook Ads Video Tools For Saker!
// @author       Jimmy
// @include      *.facebook.com/ads/library/*
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
// @downloadURL https://update.greasyfork.org/scripts/490159/Facebook%20Ads%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/490159/Facebook%20Ads%20Video.meta.js
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

    let closeElementClass = ".x2lah0s.x13a6bvl"; //弹窗Close按钮
    let videoBox = ".x1plvlek.xryxfnj.x1gzqxud.x178xt8z" //"._7jvw.x2izyaf.x1hq5gj4.x1d52u69"; //列表页视频div
    let AdIdElement = '.x8t9es0.xw23nyj.xo1l8bm.x63nzvj.x108nfp6.xq9mrsl.x1h4wwuj.xeuugli'
    let videoBoxBtn = '.x193iq5w.xxymvpz.x78zum5.x1iyjqo2.xs83m0k.xyqm7xq.x1ys307a.x1yztbdb'
    let downloadBtn = '.downloadVideo'
    let q = util.getUrlParam('q') || ""
    let pageid = util.getUrlParam('view_all_page_id') || ""
    console.log('q',q);
    console.log('pageid',pageid);

    //新增页面元素内容
    let addhtml = '<div class="sakerHtml" style="display: flex;align-items: center; margin-left:8px;">'
    addhtml += '<button class="downloadVideo" style="width:112px; height:32.5px; padding: 8px 20px; border: none; border-radius: 5px; background: #034e96; color: #fff; cursor: pointer;">'
    addhtml += '<span style="display:none;" class="btnLoading"><svg style="height:16px;width:auto;" width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg></span>'
    addhtml += '<span class="btnText">下载高清视频</span>';
    addhtml += '</button>';
    addhtml += '</div>';

    setInterval(async function(){
        if((q != "" || pageid != "") && $(videoBox).length > 0){
            $(videoBox).each(function(i){
                if($(this).find(downloadBtn).length<1){
                    $(this).find(videoBoxBtn).append(addhtml);

                    var adidstr = $(this).find(AdIdElement+":first").html()
                    console.log("adidstr",adidstr)
                    var adid = "";

                    if(adidstr){
                        adid = adidstr.split(": ")[1];
                    }
                    console.log("adid",adid)
                    if(adid){
                        $(this).find(downloadBtn).attr('data-adid',adid);
                    }
                }
            })
        }else if($(downloadBtn).length <1 && $(closeElementClass).length > 0){
            $(closeElementClass).append(addhtml)
        }
    }, 1000);

    $('body').on('click',".downloadVideo",async function(){
        $(this).find('.btnLoading').show();
        $(this).find('.btnText').hide();
        var htmlContent = "";
        var adid = $(this).attr('data-adid') || util.getUrlParam('id') || "";
        if((q != "" || pageid != "") && $(videoBox).length > 0){
            if(adid){
                htmlContent = await fetch("https://www.facebook.com/ads/library/?id="+adid)
                    .then(response => response.text())
                    .then(data => {
                    return data
                }).catch(error => {
                    console.error('Error:', error);
                });
            }
        }else if($(closeElementClass).length > 0){
            htmlContent = document.documentElement.innerHTML;
        }
        var regExp = /\"video_hd_url\":\".*?\",\"video_sd_url\"/;
        var match = regExp.exec(htmlContent);
        console.log('match',match);
        if (match != null) {
            var videoInfo = match[0];
            if(videoInfo){
                var videoString = "{"+videoInfo+':""'+"}"
                var videoJson = JSON.parse(videoString)
                var videoUrl = videoJson.video_hd_url
                console.log('videoUrl',videoUrl)
                if(videoUrl){
                    //window.open(videoUrl, '_blank');
                    var fileName = adid+".mp4";
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
                    return util.message.error('此广告没有高清视频,请尝试其它广告.')
                    $(this).find('.btnLoading').hide();
                    $(this).find('.btnText').show();
                }
            }
        }else{
            return util.message.error('未找到广告的相应视频')
            $(this).find('.btnLoading').hide();
            $(this).find('.btnText').show();
        }
    })
})();