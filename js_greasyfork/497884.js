// ==UserScript==
// @name         apollo工作工具
// @version      1.0
// @description  apollo
// @author       hongxiangzhou
// @include      *apollo*
// @grant        GM_openInTab
// @run-at       document-start
// @namespace https://greasyfork.org/users/1317610
// @downloadURL https://update.greasyfork.org/scripts/497884/apollo%E5%B7%A5%E4%BD%9C%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/497884/apollo%E5%B7%A5%E4%BD%9C%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
var host_before

(async function () {
    'use strict';
    var popupContainer = build()
    function waitForjQuery() {
        if (typeof $ !== 'undefined') {
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    popupContainer.style.display = "none";
                }
            });
            monitor(popupContainer)
        } else {
            setTimeout(waitForjQuery, 100);
        }
    }
    waitForjQuery();
})();

function build() {
    // 创建弹窗的容器
    var popupContainer = document.createElement("div");
    popupContainer.style.display = "none"; // 初始时隐藏弹窗
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "50%";
    popupContainer.style.left = "50%";
    popupContainer.style.transform = "translate(-50%, -50%)";
    popupContainer.style.width = "50%";
    popupContainer.style.maxHeight = "70%";
    popupContainer.style.overflowY = "auto"; // 允许滚动内容
    popupContainer.style.backgroundColor = "#fff";
    popupContainer.style.padding = "20px";
    popupContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(popupContainer);
    // 弹窗内容
    var popupContent = document.createElement("pre");
    popupContainer.popupContent = popupContent
    popupContent.innerHTML = '';
    popupContainer.appendChild(popupContent);

    // 点击弹窗外部区域或关闭按钮来关闭弹窗
    popupContainer.addEventListener("click", function (event) {
        if (event.target === popupContainer) {
            popupContainer.style.display = "none";
        }
    });
    return popupContainer
}

function formatText(text) {
    if (text == '' || text == undefined)
        return '空'
    text=text.replace(/\r/g, "");
    const lines = text.split('\n'); // 将文本按行拆分成数组
    const numberedLines = lines.map((line, index) => `[${index}]   ${line}`); // 在每行前添加行号
    return numberedLines.join('\n'); // 将带有行号的行重新组合成文本
}


async function monitor(popupContainer) {
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var insertedElement = $(mutation.target);
                var insertedElementClass = insertedElement.attr('class');
                if (insertedElementClass != undefined && insertedElementClass.startsWith("panel namespace-panel")) {
                    $(insertedElement).off('dblclick').on('dblclick', function() {
                        var clipboardText = $(this).find(".ns_btn.clipboard.cursor-pointer").attr("data-clipboard-text");
                        if (false) {
                            popupContainer.style.display = "block";
                            popupContainer.popupContent.innerText = formatText(clipboardText);
                        } else {
                            popupContainer.style.display = "none";
                        }
                    });
                } else if (insertedElementClass != undefined && insertedElementClass == "nav navbar-nav navbar-right" && $("#direct").length < 1) {
                    var url = window.location.href.split("&")[0];
                    var suffix = url.replace(window.location.origin, "");
                    $(".nav.navbar-nav.navbar-right").append('<li class="dropdown" id="direct">  <a href="' + window.location.href + '" class="dropdown-toggle ng-binding" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">      <span class="glyphicon glyphicon-flash"></span>&nbsp;切换环境      <span class="caret"></span></a>  ' +
                        '<ul class="dropdown-menu">      ' +
                        '<li><a target="_blank" href="http://dev-apollo-portal.shalltry.com' + suffix + '" class="ng-binding">dev</a></li>  ' +
                        '<li><a target="_blank" href="https://test-apollo-portal.shalltry.com' + suffix + '" class="ng-binding">test</a></li>  ' +
                        '<li><a target="_blank" href="https://ind-apollo-gcp.trasre.com' + suffix + '" class="ng-binding">ind</a></li>  ' +
                        '<li><a target="_blank" href="https://apollo-portal.shalltry.com' + suffix + '" class="ng-binding">Ireland</a></li>  ' +
                        '<li><a target="_blank" href="https://ora-apollo-portal.trasre.com' + suffix + '" class="ng-binding">ee1</a></li>  ' +
                        '</ul>                ' +
                        '</li>');
                    $(".nav.navbar-nav.navbar-right").append('<li class="" id="search">  <a class=" ng-binding" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">      <span class="glyphicon glyphicon-search"></span>&nbsp;数据查找   </a>  ' +
                        '</li>');
                    $("#search").click(async function() {
                        if (popupContainer.popupContent.innerHTML != '' && host_before == window.location.href) {
                            popupContainer.style.display = "block";
                            return;
                        }
                        host_before = window.location.href;
                        var elements = $('[data-original-title="查看发布历史"]');
                        var text = "";
                        var namespaceNames = [];
                        for (let element of elements) {
                            var href = $(element).attr('href');
                            var url = new URL(href, window.location.origin);
                            var params = url.hash
                                .substring(url.hash.indexOf('?') + 1)
                                .split('&')
                                .reduce(function(res, item) {
                                    var parts = item.split('=');
                                    res[parts[0]] = parts[1];
                                    return res;
                                }, {});
                            var namespaceName = params['namespaceName'];
                            namespaceNames.push(namespaceName);
                        }
                        var results = await getAllInfo(namespaceNames);
                        for (let i = 0; i < namespaceNames.length; i++) {
                            text += `<b>${namespaceNames[i]}:</b> \n`;
                            text += results[i] + "END";
                        }
                        var sp = text.split('END');
                        var content = '';
                        for (let i = 0; i < sp.length - 1; i++) {
                            content += formatText(sp[i]) + '\n';
                        }
                        popupContainer.popupContent.innerHTML = content;
                        popupContainer.style.display = "block";
                    });
                }
            }
        }
    });

    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
}


async function getAllInfo(namespaceNames) {
     var env = await getEnv();
    const promises = namespaceNames.map(namespaceName => getInfo(namespaceName,env));
    const results = await Promise.all(promises);
    return results;
}

function copy(str) {
    // 创建一个Blob对象
    const blob = new Blob([str], {type: 'text/plain'});

    // 创建一个ClipboardItem对象
    const item = new ClipboardItem({'text/plain': blob});

    // 将ClipboardItem对象添加到剪贴板
    navigator.clipboard.write([item]).then(() => {
        console.log('复制成功');
    }).catch(err => {
        console.error('复制失败', err);
    });
}
async function getEnv(){
    var url = new URL(window.location.href);
    var domain = url.origin; // 获取域名
    var env
    try {
        const response = await fetch(`${domain}/apps/libra-feature/navtree`, {
            credentials: 'include'  // 这将使请求包含cookie
        })
        const data = await response.json()
        env = data['entities'][0]['body']['env']
    } catch (error) {
        console.error('Error:', error);
    }
    return env
}

async function getInfo(namespaceName,env){
    //https://test-apollo-portal.shalltry.com/config.html#/appid=libra-feature&env=TEST&cluster=default
    var data
    var url = new URL(window.location.href);
    var domain = url.origin; // 获取域名
    var params = url.hash
    .substring(url.hash.indexOf('?') + 1)
    .split('&')
    .reduce(function (res, item) {
        var parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});
    if(params['cluster']==undefined){
        params['cluster']='default'
    }
    var frul=`${domain}/apps/${params['#/appid']}/envs/${env}/clusters/${params['cluster']}/namespaces/${namespaceName}/releases/active?page=0&size=1`
    console.log(frul)
    try {
        const response = await fetch(frul, {
            credentials: 'include'  // 这将使请求包含cookie
        })
        data = await response.json()
    } catch (error) {
        console.error('Error:', error);
    }
    if(data.length >=1){
        var result = JSON.parse(data['0']['configurations'])['content']
        if(result == undefined){
            result= JSON.parse(data['0']['configurations'])
            let keyValuePairs = [];
            // 遍历 configurations 对象，拼接键值对
            for (const [key, value] of Object.entries(result)) {
                keyValuePairs.push(`${key}: ${value}`);
            }

            // 将数组中的每个元素拼接成一行一行的字符串
            result = keyValuePairs.join('\n');
        }
        return result
    }
    return ''
}