// ==UserScript==
// @name         115推送工具
// @namespace    unzipandreadtext
// @version      1.0.2
// @description  推送磁力或ed2k链接到115。需要当前浏览器已登录到115
// @author       sehuatang_chen
// @license      MIT

// @grant        GM_xmlhttpRequest
// ==/UserScript==

// call115.push_urls(arrlink).then( result => {
//     if (Array.isArray(result)) {
//         let succ = 0;
//         let error = 0;
//         let errortext = "";
//         result.map((item,index,arr) => {
//             if (item.state) {
//                 succ++
//             } else {
//                 error++;
//                 errortext += (item.error_msg + "：" + item.url + '<br/>')
//             }
//         })
//         if (error == 0) {
//             tools.tip(`成功推送${succ}条链接`)
//         } else {
//             tools.tip(`共推送${result.length}条链接，成功${succ}条，失败${error}条：<br/> ${errortext}`,1000*10)
//         }
//     }
// }).catch( msg => tools.tip(msg))
const call115 = {
    X_userID: 0,
    timeout: 5e3,
    push_urls: (links) => {
        if (!Array.isArray(links)) {
            links = [links]
        }
        links = Array.from(new Set(links))

        return new Promise((resolve, reject) => {
            try {
                call115._get_token()
                    .then( tokendata => call115._add_task_urls({...tokendata,urls: links}))
                    .then( res => {
                        console.log("_add_task_urls", res);
                        if (res.result != undefined) {
                            resolve(res.result)
                        }else {
                            resolve([res])
                        }
                        // resolve(res.result || [res]);
                    }).catch( (data) => {
                        console.log("_get_token", data);
                        reject(data.msg);
                    })
            } catch (err) {
                console.log("push",err);
                reject(err.errMsg || err.message);
            }
        })
    },
    _add_task_urls: (params) => new Promise( async (resolve, reject) => {
        let userid = await call115._get_userid()
        const { urls, sign, time, wp_path_id } = params;
        const pathId = wp_path_id ? wp_path_id : "";
        let datastr = `savepath=&wp_path_id=${pathId}&uid=${userid}&sign=${sign}&time=${time}`
        urls.map((url,index,arr) => {
            datastr += `&url%5B${index}%5D=${encodeURIComponent(url)}`
        })
        GM_xmlhttpRequest({
            method: "post",
            url: "http://115.com/web/lixian/?ct=lixian&ac=add_task_urls",
            timeout: call115.timeout,
            data: datastr,
            headers: {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Origin": "https://115.com",
                "X-Requested-With": "XMLHttpRequest"
            },
            onload: (res) => {
                resolve(JSON.parse(res.response))
            },
            onerror: (error) => reject(error)
        });
    }),
    _get_token: () => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://115.com/?ct=offline&ac=space&_=" + new Date().getTime(),
            timeout: call115.timeout,
            onload: (responseDetails) => (responseDetails.responseText.indexOf("html") >= 0) ? reject({
                code: 0,
                msg: "还没有登录",
                data: "还没有登录"
            }) : resolve(JSON.parse(responseDetails.response)),
            onerror: (error) => reject(error)
        })
    }),
    _get_userid: () => new Promise((resolve, reject) => {
        if (call115.X_userID != 0) {
            return resolve(call115.X_userID);
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://webapi.115.com/offine/downpath",
            timeout: call115.timeout,
            onload: (responseDetails) => {
                try {
                    call115.X_userID = JSON.parse(responseDetails.response).data[0].user_id;
                    resolve(call115.X_userID)
                } catch (error) {
                    reject(error)
                }
            },
            onerror: (error) => reject(error)
        });
    })
}