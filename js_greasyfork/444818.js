// ==UserScript==
// @name         查排名插件
// @namespace    AndyLee
// @version      1.2
// @description  搜索引擎查排名插件
// @author       Andy Lee
// @connect    baidu.com
// @connect    winndoo.com
// @connect    winndoo.cn
// @match    *://www.baidu.com/
// @require https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @require https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant    GM_xmlhttpRequest
// @grant    GM_registerMenuCommand
// @grant    GM_log
// @grant    GM_notification
// @grant                       GM_addStyle
// @grant    GM_openInTab
// @grant              GM_getValue
// @grant              GM_setValue
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/444818/%E6%9F%A5%E6%8E%92%E5%90%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444818/%E6%9F%A5%E6%8E%92%E5%90%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const pages = [0, 10, 20, 30, 40]
    const urls = []
    let DBSite = {
        baidu: {
            SiteTypeID: 1,
            MainType: "#content_left>.c-container",
            UrlStyle: "h3 a",
            LinkAttr: "href",
            Index: "id",
            URLREGEX: "URL='([^']+)'",
        },
        sogou: {
            SiteTypeID: 2,
            MainType: "#main .results>div",
            UrlStyle: "h3 a"
        },
        haosou: {
            SiteTypeID: 3,
            MainType: ".res-list",
            UrlStyle: "h3 a"
        },
        google: {
            SiteTypeID: 4,
            MainType: "#rso .g",
            UrlStyle: "h3 a"
        },
        bing: {
            SiteTypeID: 5,
            MainType: "#b_results>li",
            UrlStyle: "h3 a"
        },
        duck: {
            SiteTypeID: 10,
            MainType: "#links_wrapper #links .results_links_deep",
            UrlStyle: "h3 a"
        },
        doge: {
            SiteTypeID: 11,
            MainType: "#links_wrapper #links .results_links_deep",
            UrlStyle: "h3 a"
        },
        mBaidu: {
            SiteTypeID: 6,
            MainType: ".c-result.result ",
            UrlStyle: ".c-result-content article",
            LinkAttr: 'rl-link-href',
            Index: "order",
            URLREGEX: "url=([^']+)\\\"",

        },
        zhihu: {
            SiteTypeID: 7,
        },
        baidu_xueshu: {
            SiteTypeID: 8,
            MainType: "#content_left .result",
            UrlStyle: "h3 a"
        },
        other: {
            SiteTypeID: 9,
        }
    };


    let curSite = {}
    if (location.host.includes("xueshu.baidu.com")) {
        curSite = DBSite.baidu_xueshu;
    } else if (location.host.includes(".baidu.com")) {
        if (navigator.userAgent.replace(/(android|mobile|iphone)/igm, "") !== navigator.userAgent) {
            curSite = DBSite.mBaidu;
        } else {
            curSite = DBSite.baidu;
        }
    } else if (location.host.includes("zhihu.com")) {
        curSite = DBSite.zhihu;
    } else if (location.host.includes("sogou")) {
        curSite = DBSite.sogou;
    } else if (location.host.includes("so.com")) {
        curSite = DBSite.haosou;
    } else if (location.host.includes("google")) {
        curSite = DBSite.google;
    } else if (location.host.includes("bing")) {
        curSite = DBSite.bing;
    } else if (location.host.includes("duckduckgo")) {
        curSite = DBSite.duck;
    } else if (location.host.includes("dogedoge")) {
        curSite = DBSite.doge;
    } else {
        curSite = DBSite.other;
    }


    function removeItems(arr, item) {
        const result = []
        for (var i = 0; i < item; i++) {
            result.push(arr.shift())
        }

        return result
    }

    async function getKeyword(url, username, password, pid) {

        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                // from: "acxhr",
                url: url + `?username=${username}&pid=${pid}`,
                headers: {
                    "Accept": "application/json",
                },
                method: "GET",
                timeout: 10000,
                onerror: err => reject(err),
                onreadystatechange: function(response) { // MARK 有时候这个函数根本不进来 - 调试的问题 - timeout
                    if (response.responseText || response.responseHeaders) {
                        if (response.status === 200) {
                            const res = JSON.parse(response.responseText)
                            resolve(res)
                        } else {
                            reject('授权失败')
                        }
                    }

                }
            });
        })

    }

    function openLinksOnDelay(linkArray) {
        var tabs = removeItems(linkArray, 5)
		let delaytime = 10000
        if (tabs)
            tabs.forEach(tab => GM_openInTab(tab, '_self'))
		$(".remain_tasks").html(linkArray.length)
		let remain_time = linkArray.length * (delaytime/1000)
		let tip = `预计${remain_time}秒后完成。`
		if (remain_time == 0 ) {
		    tip = `任务已经完成，如需重新执行，请刷新当前页面。`

		}
		$(".remain_tip").html(tip)
        if (linkArray.length) {
            setTimeout(function() {
                openLinksOnDelay(linkArray);
            }, delaytime);
        }
    }


    const cfg = new MonkeyConfig({
        title: '插件设置',
        menuCommand: true,
        params: {
            '用户名': {
                type: 'text',
                default: ''
            },
            '密码': {
                type: 'text',
                default: ''
            },
            '项目ID': {
                type: 'text',
                default: ''
            },
            'API': {
                type: 'text',
                default: ''
            },
            '是否运行': {
                type: 'checkbox',
                default: false,
                enable: false
            }
        }
    });


    const username = cfg.get('用户名')
    const password = cfg.get('密码')
    const pid = cfg.get('项目ID')
    const url = cfg.get('API')
    const switch_running = cfg.get('是否运行')

    if (switch_running) {

		var logo = document.createElement("div");
logo.innerHTML = '<div style="margin: 0 auto 0 auto; ' +
    'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
    'font-size: small; background-color: #000000; ' +
    'color: #ffffff;"><p style="margin: 2px 0 1px 0;"> ' +
    '查询的项目ID：<b class="total_pids"></b>，关键词总数： <b class="keys"></b>， 任务总数： <b class="tasks"></b>，剩余任务数： <b class="remain_tasks"></b>， <b class="remain_tip"></b> ' +
    '</p> <p style="margin: 2px 0 1px 0;">如果出现百度安全验证，请使用手机百度APP扫码验证 或者手动滑动验证码，成功后，关闭浏览器，重新打开当前页面。 </p></div>';
document.body.insertBefore(logo, document.body.firstChild);


        getKeyword(url, username, password, pid).then(res => {
                const data = res.data;
                console.log(res)
				let tasks = 0
                if (data.hasOwnProperty("pc")) {
					tasks += data["pc"].length
                    data["pc"].forEach(keyword => {
                        if(keyword.keyword != "") {
                           pages.forEach(page => {
                            let url = `https://baidu.com/s?wd=${keyword.keyword}&pn=${page}&wtf_id=${keyword.wtf_id}&keyyyyyy=${keyword.id}&pidddd=${keyword.customer_project_id}`
                            urls.push(url)
                        })
                        }
                     

                    })
                }

                if (data.hasOwnProperty("mb")) {
					 tasks += data["mb"].length

                    data["mb"].forEach(keyword => {
                        if(keyword.keyword != "") {
                               pages.forEach(page => {
                            let url = `https://m.baidu.com/s?wd=${keyword.keyword}&pn=${page}&wtf_id=${keyword.wtf_id}&keyyyyyy=${keyword.id}&pidddd=${keyword.customer_project_id}`
                            urls.push(url)
                        })
                        }
                     

                    })
                }

				$(".keys").html(tasks)
		    	$(".tasks").html(tasks*5)
 				$(".total_pids").html(pid)

                return urls
            }

        ).then(urls => {

              GM_log(urls.length)

              openLinksOnDelay(urls)

        }).catch(e => alert(e))




    }

})();