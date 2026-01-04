// ==UserScript==
// @name         CAPIG
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  CAPIG Tool For Saker!
// @author       Jimmy
// @include      */hub/capig/*
// @include      */auth/login/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439865/CAPIG.user.js
// @updateURL https://update.greasyfork.org/scripts/439865/CAPIG.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'top-end',
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
            console.log("url",url)
            console.log("data",data)
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



    let webhook_ddtoken = "c3bf17d87881d15c505f841d36760856ecf8fad9ad276098de7d91b5905a61d9";
    let hostname = $(location).attr('hostname');
    util.setStorage(hostname+".refresh",moment().valueOf())
    util.setStorage(hostname+".notify",0)

    setInterval(async function(){
        //登录
        if($("#login").length>0){
            console.log('111')
          $("#login_username").val("xujunbo@ycimedia.com")
          $("#login_username")[0].dispatchEvent(new Event('input'));
          $("#login_password").val("Xujunbo@123456")
          $("#login_password")[0].dispatchEvent(new Event('input'));
//           $("#login").submit();
       }

       let lasttime = util.getStorage(hostname+".refresh");
       let currenttime = moment().valueOf();
       if(currenttime - lasttime > 300000){
           util.setStorage(hostname+".refresh",moment().valueOf())
           console.log('refresh now')
           window.location.reload();
           return
       }

       let pixel_arr = new Array();
       $("iframe:first").contents().find("tbody.ant-table-tbody:first").children("tr.ant-table-row").each(function(i){
           let pixel_str = $(this).find("td.ant-table-cell:nth-child(1)").find(".ant-col:nth-child(2)").find(".ant-typography strong").html()
           let pixel = pixel_str.split(" ")[1];
           let status = $(this).find("td.ant-table-cell:nth-child(1)").find(".ant-col:nth-child(2)").find(".ant-typography-secondary").html()
           let total = $(this).find("td.ant-table-cell:nth-child(2) .ant-space-item").find(".ant-typography").html();

           pixel_arr.push({
               pixel:pixel,
               status:status,
               total:total
           })
       })

       let total = $("iframe:first").contents().find("#homeView_eventsCardParent").find("tbody.ant-table-tbody").find("tr.ant-table-row:nth-child(1)").find("td.ant-table-cell:nth-child(2)").find("div").html()
       if(total>0 && pixel_arr.length>0){
           console.log('works fine')
       }else{
           if(typeof(total) == 'undefined'){
               console.log('wait ready');
           }else{
               console.log(pixel_arr);
               let ifnotify = util.getStorage(hostname+".notify");
               if(ifnotify<1){
                   let msgtext = {
                       msgtype:'text',
                       text:{
                           content:"Capig Server: "+hostname+" is invalid, "+JSON.stringify(pixel_arr)
                       }
                   }
                   let headertype = {
                       "Content-Type":"application/json;charset=utf-8"
                   }
                   let msgres = await util.post("https://oapi.dingtalk.com/robot/send?access_token="+webhook_ddtoken,msgtext,headertype)
                   console.log('msgres',msgres)
               }
           }
       }

    }, 60000);

})();