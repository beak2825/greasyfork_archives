// ==UserScript==
// @name         bilibiliClearDynamics
// @namespace    https://iconquestion.github.io
// @version      0.27
// @description  Delete specific type(s) of bilibili dynamics
// @author       ICONQUESTION
// @match        https://space.bilibili.com/delete
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456857/bilibiliClearDynamics.user.js
// @updateURL https://update.greasyfork.org/scripts/456857/bilibiliClearDynamics.meta.js
// ==/UserScript==

//-------!!!-------
//如果您是初次使用/重新安装了此脚本，请向下翻，补充相应的代码片段。
//-------!!!-------


var uid = document.cookie.match(/(?<=DedeUserID=).+?(?=;)/)[0];
var csrf = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];
var nextoffset = '';


//beginning
if (!uid || !csrf) {
    console.log('cookies中缺少uid或csrf, 无法继续运行。')
} else {
    var URLs = {
        'getDynamics': 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=' + uid + '&timezone_offset=-480&offset=',
        'DelDynamics': 'https://api.bilibili.com/x/dynamic/feed/operate/remove?csrf=' + csrf,
    }
    getDynamicContent()

}

async function getDynamicContent() {
    //请求动态内容
    await fetch(URLs.getDynamics + nextoffset, {
        credentials: 'include',
        headers: {
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
        },
    }).then(function (res) {
        var a = res.headers.get('Content-Type')
        //console.log(a)
        return (res.status == 200 && a.search('application/json') != -1) ? res.json() : res.status
    }).then(async function (data) {
        if (typeof (data) == 'number') {
            console.log('请求HTTP状态码异常。操作失败。状态码: ' + data)
            return
        } else if (data.code != 0) {
            console.log('Bilibili服务器返回状态码异常。状态码: ' + data.code)
            console.log('错误信息: ' + data.message)
        }
        else {

            if (!data.data || !data.data.items || !data.data.items.length) {
                console.log('没有任何动态了~');
                return
            } else {
                console.log('偏移位置: ' + nextoffset + ', 获取到 ' + data.data.items.length + ' 条动态');

                //遍历返回的动态数据，逐条处理
                for (var i = 0; i < data.data.items.length; i++) {

                    //-------!!!-------
                    //此处，您需要结合一定的JavaScript编程经验，补充所要删除动态的筛选条件。您可以修改下方的if判断语句来达到这个目的。

                    //1.data.data.items[i].modules.module_stat下有三个子项，分别为comment, forward和like，对应评论、转发和点赞，每个子项的count代表具体数值
                    //截取片段如下方所示
                    /*
                        "module_stat": {
                            "comment": {
                                "count": 233,
                                "forbidden": false
                            },
                            "forward": {
                                "count": 466,
                                "forbidden": false
                            },
                            "like": {
                                "count": 699,
                                "forbidden": false,
                                "status": false
                            }
                        }
                    */
                    //example: if(data.data.items[i].modules.module_stat.comment.count == 0) 这代表筛选评论数量为0的动态
                    
                    //2. 您需要补充要删除动态的类型。
                    //例如，转发类动态的类型是 DYNAMIC_TYPE_FORWARD 

                    var condition = ""

                    //-------!!!-------

                    if (data.data.items[i].type == condition) {
                        console.log('找到符合要求的动态，ID: ' + data.data.items[i].id_str);
                        console.log('动态类型: ' + data.data.items[i].type);
                        console.log('动态评论数量: ' + data.data.items[i].modules.module_stat.comment.count);
                        // noSpecificDynamic = false;
                        await removeDynamic(data.data.items[i].id_str);
                    }
                }

                if (data.data.has_more) {
                    nextoffset = data.data.offset;
                    //循环调用，直到遍历所有动态
                    getDynamicContent();
                } else {
                    console.log('遍历动态完成。最后一页动态处理完成。')
                }
            }
        }
    })
}

async function removeDynamic(dynamicId) {
    if (!dynamicId) {
        console.log('dynamicId参数异常!')
        return
    }

    console.log('正在删除动态: ' + dynamicId);

    await fetch(URLs.DelDynamics, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        },
        credentials: 'include',
        body: JSON.stringify({ 'dyn_id_str': dynamicId })
    }).then(function (res) {
        var a = res.headers.get('Content-Type')
        //console.log(a)
        return (res.status == 200 && a.search('application/json') != -1) ? res.json() : res.status
    }).then(function (data) {
        if (typeof (data) == 'number') {
            console.log('尝试删除动态时遇到错误。')
            return
        } else if (data.code != 0) {
            console.log('Bilibili服务器返回状态码异常。状态码: ' + data.code)
            console.log('错误信息: ' + data.message)
        } else {
            console.log('成功删除动态。')
            console.log(data)
        }
    })
} 