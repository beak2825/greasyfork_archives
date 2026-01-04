// ==UserScript==
// @name         微博媒体下载
// @namespace    http://your.namespace.com
// @version      5.37
// @released     2024-04-18_08:43:54_346
// @description  读取微博媒体的链接，发送到下载下载，并保存
// @author       果心豆腐酱
// @license      MIT
// @run-at       document-start
// @match        https://*.weibo.com/*
// @match        https://*.weibo.cn/*
// @match        https://police.lanzouw.com/b01a8pxgj
// @icon         https://weibo.com/favicon.ico

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/485858/%E5%BE%AE%E5%8D%9A%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/485858/%E5%BE%AE%E5%8D%9A%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


//页面元素监测，判断小红书笔记列表是否出现
window.addEventListener('load', function () {
    设置服务器按钮();
    var pwdload = document.querySelector('[id="pwdload"] [name="pwd"]');
    if (pwdload) document.querySelector('[name="pwd"]').value = 'f4hz', document.querySelector('[id="sub"]').click();
});
添加样式();
// 创建一个 MutationObserver 实例
if (document.body) {
    启动元素检测();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        启动元素检测();
        处理监测元素(this.documentElement)
        document.querySelectorAll('[action-type="feed_list_item"]').forEach(function (element) {
            PC版按钮判断(element);
        });

    });
}

var messages = ["口腔健康","健康的饮食","房地产的","MBTI","智商测试入口","国外研究表明","潮人","拉塞尔","心理学老师","课上展示","催眠大师","互联网学霸","赶紧测测","预售时间","微博公开课",
"健康快乐","销量","测试研究所","减掉体重","储存脂肪","减肥失败","麦玲玲","情商测试","情商指数 ​​​"
];
function 启动元素检测() {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查每个变化的类型
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                // 循环遍历添加的节点
                mutation.addedNodes.forEach(function (addedNode) {
                    // 检查添加的节点是否为目标元素
                    if (addedNode.classList) {
                        处理监测元素(addedNode);
                    }
                });
            }
        });
    });
    // 开始观察父节点下的变化
    observer.observe(document.body, { childList: true, subtree: true });
}

function 设置服务器按钮() {
    const referenceElement = document.querySelector('[class="nav-right"]');
    if (referenceElement?.textContent === '\n      设置\n    ') {
        // 创建要插入的新元素
        const newElement = document.createElement('div');
        newElement.className = "mediaset"
        newElement.textContent = '服务set';
        // 获取参考元素
        // 插入新元素
        referenceElement.parentNode.insertBefore(newElement, referenceElement);
        newElement.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            保存目录设置();
        })
    }
}
function 设置登录框(登录, phone) {
    if (!document.querySelector('.cookie登录')) {
        var cookie = document.createElement('span');
        cookie.textContent = 'cookie登录';
        cookie.style.color = 'black';
        cookie.style.padding = '0 10px 0 10px';
        cookie.style.userSelect = 'none';
        登录.parentElement.appendChild(cookie);
        var cookiebox = document.createElement('div');
        cookiebox.style.display = 'none';
        cookiebox.className = 'cookiebox woo-box-alignCenter';
        var input = document.createElement('textarea');
        input.setAttribute('placeholder', '请输入 cookie 信息...\n第二行内容');
        if (!phone) {
            var box = document.querySelector('[class="woo-box-flex woo-box-column woo-box-alignCenter"]');
            cookiebox.style.height = box.clientHeight + 'px';
            cookiebox.style.width = box.clientWidth + 'px';
            input.style.height = box.clientHeight - 100 + 'px';
            input.style.width = box.clientWidth + 'px';
            box.parentElement.appendChild(cookiebox);
        } else {
            cookiebox.style.height = '30vh';
            cookiebox.style.width = '100vw';
            input.style.height = 'calc(100% - 90px)';
            input.style.width = ' 98%';
        }
        cookiebox.appendChild(input)
        var button = document.createElement('button');
        button.style.height = '30px';
        button.style.width = '60px';
        button.style.position = 'relative';
        button.style.left = 'calc(100% - 62px)';
        button.style.top = '10px';
        button.textContent = '登录';
        cookiebox.appendChild(button)
        var button2 = document.createElement('button');
        button2.style.height = '30px';
        button2.style.width = '60px';
        button2.style.position = 'relative';
        button2.style.top = '10px';
        button2.textContent = '登录';
        cookiebox.appendChild(button2)
        cookie.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!phone) box.style.display = 'none';
            cookiebox.style.display = 'block';
            document.body.innerHTML = '';
            document.body.appendChild(cookiebox);
        })
        button.addEventListener('click', function (event) {
            // 调用函数，并在请求完成后打印响应文本
            if (判断是否是手机设备()) {
                设置cookie(input.value, ".m.weibo.cn")
            } else {
                设置cookie(input.value, '.weibo.com')
            }
            sendTwitterAPIRequest();
            function sendTwitterAPIRequest() {
                var url = "https://weibo.com/ajax/favorites/all_fav?uid=7759419587&page=1&with_total=true";
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        if (response.status === 200) {
                            try {
                                var js = JSON.parse(response.responseText);
                                if (js.data.total_number !== 119353) {
                                    console.log('蜀黍');
                                    if (判断是否是手机设备()) {
                                        location.href = 'https://m.weibo.cn/';
                                    } else {
                                        location.href = 'https://weibo.com/';
                                    }
                                }
                            } catch { }

                        } else {
                            console.log('请求失败: ' + response.status);
                            showToast("cookie无效。");
                        }
                    },
                    onerror: function (error) {
                        console.error('请求错误: ', error);
                        showToast("cookie无效。");
                    }
                });
            }

        });

        function getCookieValue(cookieName) {
            var name = cookieName + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var cookieArray = decodedCookie.split(';');
            for (var i = 0; i < cookieArray.length; i++) {
                var cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return "";
        }

        function 设置cookie(cookieString, domain) {
            domain=location.host;
            // 将cookie字符串按分号和空格进行分割
            var cookieArray = cookieString.split(";");
            // 遍历每个cookie，设置其过期时间为一个月并导入到document.cookie中
            var expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1);
            for (var i = 0; i < cookieArray.length; i++) {
                var cookie = cookieArray[i].split("=");
                var name = cookie[0];
                var value = cookie[1];
                document.cookie = name + "=" + value + "; expires=" + expirationDate.toUTCString() + "; path=/; domain=" + domain;
            }
        }
    }
}

function 处理监测元素(addedNode) {

    var 私信 = addedNode.querySelector('[class="dm-btn"]');
    if (私信) {
        if (!addedNode.querySelector('homepage')) {
            var 主页 = document.createElement('div');
            主页.className = 'homepage';
            主页.setAttribute('style', "padding: 0 2px 0 10px;")
            主页.innerHTML = svg2;
            私信.parentElement.appendChild(主页);
            主页.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                location.href = location.href?.replace('/profile/', '/u/')
            })
        }
    }
    // console.log(addedNode.outerHTML)
    var 登录 = addedNode.querySelector('[class="box-center"]');
    if (登录) {
        设置登录框(登录, true);
    }
    var 登录 = addedNode.querySelector('[class="woo-box-flex LoginPop_t2_17nUx LoginPop_text_2_fRO"]');
    if (登录) {
        设置登录框(登录);
    }
    var 条幅栏 = addedNode.querySelector('[class="woo-box-flex woo-tab-nav"]');
    if (条幅栏) {
        var 设置 = document.createElement('div');
        设置.className = 'set';
        设置.innerHTML = ' <div class="set_svgbox"><svg class="set_svg IconBox_icon_1dS2Y"><use xlink:href="#woo_svg_nav_configFlat"></use></svg></div>'
        条幅栏.appendChild(设置);
        设置.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            //弹出设置服务器();
            保存目录设置();
        })
    }
    if (document.querySelector('[class="nav-right"]')) {
        if (!document.querySelector('[class="mediaset"]')) {
            设置服务器按钮();
        }
    }
    //手机版
    //一次性加载
    const 微博文列表 = addedNode.querySelectorAll('[class="wb-item-wrap"]');
    微博文列表.forEach(微博文 => {
        目标元素 = 微博文.querySelector('[class="m-box-dir m-box-col m-box-center"]');
        if (目标元素) {
            添加按钮(目标元素, 微博文, 1, 'list');
        }

    });
    //手机版，用户主页
    微博文 = addedNode.querySelector('.card.m-panel.card9');
    if (微博文) {
        let 目标元素 = 微博文.querySelector('[class="m-box-col m-box-dir m-box-center"]');
        if (目标元素) {
            添加按钮(目标元素, 微博文, 1, 'user');
        }
    }
    //手机版，用户主页2
    微博文 = addedNode.querySelectorAll('[class="card m-panel card9 f-weibo"]');
    if (微博文) {
        目标元素 = addedNode.querySelector('[class="m-box-dir m-box-col m-box-center"]');
        if (目标元素) {
            添加按钮(目标元素, addedNode, 1, 'user2')
        }
    }
    PC版按钮判断(addedNode);
}

function PC版按钮判断(addedNode) {
    let like = addedNode.querySelector('[class="woo-like-main toolbar_btn_Cg9tz"]') || addedNode.querySelector('[class="woo-like-main toolbar_btn"]');
    if (like) {
        //console.log(addedNode)
        let parentElement = like.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
        if (parentElement?.classList?.contains('woo-box-flex')) {
            if (!parentElement.querySelector('.go')) {//判断是否添加过元素
                添加按钮(parentElement, addedNode, 4, 'woo')
                let share = addedNode.querySelector('[class="toolbar_share_39C6P toolbar_cursor_34j5V"]');
                if (share) {
                    share.querySelector('span').textContent = '';
                    share.style.paddingRight = "30px";
                    share.style.paddingLeft = "30px";
                    share.style.marginRight = "15px";
                }
            }
        } else {
            if (parentElement?.classList?.contains('card')) {
                if (!parentElement.querySelector('.go')) {//判断是否添加过元素
                    添加按钮(like?.parentElement?.parentElement?.parentElement, addedNode, 4, 'talk')

                }
            }
        }
    } else {
        let copy = addedNode.querySelector('[class="copy-slide-fade-enter copy-slide-fade-enter-active"]')
        if (copy) {
            copy.textContent = ''
        } else {
            let share = addedNode.querySelector('[class="share-slide-fade-enter share-slide-fade-enter-active"]')
            if (share) {
                share.textContent = ''
            } else {
                //console.log(1, addedNode)
            }
        }
    }
}
function 判断是否是手机设备() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        return true;
    } else {
        return false;
    }
}

function 添加按钮(parentElement, addedNode, 类型, 备注) {
    var article = addedNode.querySelectorAll('article');
    if (article.length > 1) {
        //对内容解读，如果是多条博文，进行分解后单条微博处理
        for (let i = 0; i < article.length; i++) {
            console.log('article数量', addedNode.querySelectorAll('article').length)
            添加按钮(parentElement, article[i], 类型, 备注)
        }
        return;
    }
    if(addedNode.querySelector('.woo-button-wrap')){//关注按钮
        let desc=addedNode.textContent;
        messages.forEach((ele,index)=>{
            if(desc.includes(ele)){
                addedNode.style.filter = ' blur(4px)';
                return;
            }
        })
    }
    if(addedNode.querySelector('[class="title_title_1DVuO"]')?.textContent==='优选娱乐明星博主'){
        addedNode.style.filter = ' blur(4px)';
        return;
    }
    var href = addedNode.querySelector('[class="m-text-box"] a');
    if (href?.href?.includes('/profile/')) { href.href = href?.href?.replace('/profile/', '/u/') }
    var id = '';
    //return
    //广告元素
    // if (addedNode.querySelector('wbpro-tag head-info_tag_3iMJw')?.textContent === '原创') {
    //     addedNode.style.filter = ' blur(4px)';
    //     return;
    // }
    if (addedNode.querySelectorAll('[class="wbpro-tag-img head-info_tag_3iMJw"]')?.length > 0  ) {
        if(addedNode.querySelectorAll('.vue-recycle-scroller__item-view').length === 1){
            console.log(addedNode.querySelector('.detail_wbtext_4CRf9').textContent, addedNode.querySelectorAll('[class="wbpro-tag-img head-info_tag_3iMJw"]'));
            addedNode.style.filter = ' blur(6px)';
            return;
        }else{
            console.log('广告判断错误',addedNode)
        }

    }
    // if (addedNode.querySelector('.wbpro-tag head-info_tag_3iMJw')?.textContent === '热推') {
    //     addedNode.style.filter = ' blur(2px)';
    //     return;
    // }
    if (addedNode.querySelector('.wbpro-tag head-info_tag_3iMJw')?.textContent === '广告') {
        addedNode.style.filter = ' blur(2px)';
        return;
    }
    if (addedNode.querySelector('[class="wbpro-tag-img head-info_tag_3iMJw"]')) {//广告元素
        addedNode.style.filter = ' blur(2px)';
        return;
    }
    
    function 初次取ID(addedNode) {
        href = addedNode.querySelector('a[class="head-info_time_6sFQg"]')?.href;
        if (!href) {
            href = addedNode.querySelector('.f-bg-img')?.src;
        }
        if (!href) {
            href = addedNode.querySelector('.weibo-media-wraps img')?.src;
        }
        if (href) {
            id = 取文件名(href).id;
            if (!id) {
                showToast("获取不到微博文链接信息。")
                return '';
            } else {
                return id;
            }
        }
    }
    var local_down, svgparentElement;
    备注 === 'talk' ? local_down = document.createElement('li') : local_down = document.createElement('div');
    local_down.setAttribute('title', "下载");
    local_down.setAttribute('down_status', "download");
    local_down.className = 'loca_download ' + 备注;
    local_down.innerHTML = svg;
    备注 === 'talk' ? svgparentElement = document.createElement('li') : svgparentElement = document.createElement('div');
    // let 背景=addedNode.querySelectorAll('[class="picture picture-box_row_30Iwo"]');
    // 背景?.forEach(element => {
    //     console.log('博文', element)
    //     element.style.background='#e9f5ff';
    // });

    if (addedNode.querySelectorAll('.vue-recycle-scroller__item-view').length > 1) {
        console.log('有多条微博', addedNode)
    }
    let retweet = false;
    if (类型 === 1) {
        if (!parentElement.parentElement.querySelector('.personallike.type1')) {
            parentElement.parentElement.appendChild(local_down);
            parentElement.parentElement.appendChild(svgparentElement);
            svgparentElement.className = "personallike type1 " + 备注;
            local_down.classList.add('type2');
        }
    } else {
        if (类型 === 4) {
            if (parentElement.parentElement.parentElement?.classList.contains('Feed_retweetBar_3IHPj')) {
                //转发微博
                if (!parentElement.querySelector('.personallike.type2')) {
                    parentElement.appendChild(local_down);
                    parentElement.appendChild(svgparentElement);
                    addedNode = addedNode.querySelector('.retweet');
                    local_down.classList.add('type2');
                    svgparentElement.className = "personallike type2 " + 备注;
                    //addedNode.style.background='#e9f5ff';
                    // console.log(addedNode)
                    初次取ID(addedNode);
                    创建转发更多按钮(addedNode, href);
                    retweet = true
                }
            } else {
                if (!parentElement.querySelector('.personallike.type4')) {
                    //parentElement.insertAdjacentElement('afterend', svgparentElement);
                    parentElement.appendChild(local_down);
                    parentElement.appendChild(svgparentElement);
                    local_down.classList.add('type4');
                    svgparentElement.className = "personallike type4 " + 备注;
                }
            }
        } else {
            if (parentElement.parentElement.parentElement?.classList.contains('Feed_retweetBar_3IHPj')) {
                if (!parentElement.querySelector('.personallike.type2')) {
                    parentElement.appendChild(local_down);
                    parentElement.appendChild(svgparentElement);
                    local_down.classList.add('type2');
                    svgparentElement.className = "personallike type2 retweet_2" + 备注;
                    addedNode = addedNode.querySelector('.retweet');
                    初次取ID(addedNode);
                    创建转发更多按钮(addedNode, href);
                    //console.log(addedNode)
                    retweet = true
                }
                //转发微博
            } else {
                if (!parentElement.querySelector('.personallike.type3')) {
                    svgparentElement.className = "personallike type3 " + 备注;
                    local_down.classList.add('type3');
                }
            }
        }
    }
    if (!retweet) {
        初次取ID(addedNode);
    }

    lhref(addedNode, href);
    下载记录查询(id, local_down);
    下载记录查询_send(id, svgparentElement);
    local_down.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        获取信息发送(svgparentElement, local_down, id, 2);
    });
    svgparentElement.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        获取信息发送(svgparentElement, local_down, id);
    });
    svgparentElement.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // 阻止默认的右键菜单弹出
        // 在这里编写处理右键点击事件的代码
        保存目录设置();
    });
    function lhref(addedNode, url) {
        return;
        // if (addedNode.tagName.toLowerCase() === 'article') {
        //     addedNode.style.background = '#e9f5ff';
        //     addedNode.classList.add('locationhref')
        // }else{
        //     let article = addedNode.querySelector('article')
        //     if (article) {
        //         article.style.background = '#e9f5ff';
        //         addedNode.classList.add('locationhref')
        //     } else {
        //         if(retweet === true){
        //             addedNode.style.background = '#e9f5ff';
        //             addedNode.classList.add('locationhref')

        //         }else{
        //             console.log(addedNode)
        //         }
        //     }
        // }

        let Feed_body = addedNode.querySelector('[class="Feed_body_3R0rO"]');
        if (Feed_body) {
            Feed_body.style.background = '#e9f5ff';
            Feed_body?.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                location.href(url);
            })
        } else {
            console.log('Feed_body', addedNode)
        }



    }
    svgparentElement.classList.add('mouseover');
    svgparentElement.innerHTML += `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" >
    <g fill="none" stroke="rgb(0, 120, 201)" class="go">
    <path stroke-width="1.5" d="M23.324 5.709.329 11.747M15.27 18.599l8.145-13.088M.431 11.774l7.563 1.749"/>
    <path stroke-width=".8" d="M21.96 6.67 7.955 13.52"/>
    <path stroke-width="2.5" d="m15.421 18.294-4.983-3.153"/>
    <path stroke-width=".8" d="m10.45 15.066 13.176-9.699M7.186 20.564l.576-6.944"/>
    <path stroke-width="1.5" d="m10.46 15.033-3.194 5.789"/></g></svg>`
}
function 添加样式() {
    if (!document.querySelector('.svgstyle')) {
        /**/
        let css = `
          .haha{
            display:none;
          }
          .mediaset {
            position: absolute;
            font-size: 1rem;
            color: #0078f7;
            cursor: pointer;
            right: 60px;
          }
          .toolbar_share_39C6P.toolbar_cursor_34j5V {
            display: none;
          }
      
          .m-box-center .personallike {
            margin: 0px 15px 0 15px;
          }
      
          .personallike {
            width: 30px;
            height: 30px;
            cursor: pointer;
            user-select: none;
          }
      
          .personallike2 {
            width: 30px;
            height: 30px;
            cursor: pointer;
            user-select: none;
          }
      
  

      
          [down_status="eorro"] .go {
            stroke: #464646 !important;
          }
          
          [down_status="wait"] .go {
            stroke: #e5b800 !important;
          }
      
          [down_status="fail"] .go {
            stroke: #2C3227 !important;
          }
      
          [down_status="complete"] .go {
            stroke: #5CE500 !important;
          }
      
          .savedDirectoryPath {
            background: #bcbdc2cf;
            backdrop-filter: blur(5px);
            z-index: 999;
            position: fixed;
            border-radius: 10px;
            top: calc(30vw - 45px);
            left: calc(50vw - 175px);
            width: 360px;
            height: 90px;
            height: 140px;
            user-select: none;
          }
      
          .pathinput {
            outline: aquamarine;
            border: none;
            width: 310px;
            height: 40px;
            margin: 10px 15px 5px;
            border-radius: 10px;
            background: #e4e4e4;
            padding: 0 10px 0 10px;
          }
      
          .pathinput1 {
            outline: aquamarine;
            border: none;
            width: 310px;
            height: 20px;
            margin: 10px 15px 0px;
            border-radius: 10px;
            background: #e4e4e4;
            padding: 0 10px 0 10px;
          }
      
          .pathbutton {
            position: relative;
            right: -250px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            font-size: 14px;
          }
      
          .pathbutton1 {
            position: relative;
            right: -15px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            font-size: 14px;
          }
      
          .pathbutton:hover {
            background: #56c1c5;
          }
      
          .pathbutton:active {
            background: #ff9500;
          }
          .set_svgbox {
            width: 60px;
            height: 38px;
        }
        .set_svgbox:hover {
            border-radius: 4px;
            background-color: var(--weibo-top-nav-icon-bg-hover);
        }
        .set_svg {
            width: 30px;
            height: 30px;
            color: #3f9ad7;
            cursor: pointer;
            user-select: none;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .set {
            height: 57px;
            display: flex;
            width: 50px;
            justify-content: center;
            flex-direction: column;
        }
        .custom_more_button{
            position: absolute !important;
            right: 2.5%;
        }
        .loca_download {
            width: 30px;
            height: 30px;
            cursor: pointer;
            user-select: none;
            margin: 9px 10px 0;
        }

        .loca_download svg {
            width: 23px !important;
            height: 23px !important;
            color: #1DA1F2;
            cursor: pointer;
          }
          .loca_download svg:hover {
            color: #d48600;
          }
          .loca_download svg:active {
            color: rgb(231, 106, 4);
          }
          [down_status="download"] g.download, [down_status="fail"] g.failed, [down_status="success"] g.completed, [down_status="wait"] g.loading{
            display: unset;
          }
          [down_status="success"] g.completed{
            color:green;
          }
          .loca_download g {
            display: none;
          }
          [down_status="wait"] g.loading {
            transform-origin: center;
          }
          .loca_download.list{
            margin: 0px 10px 0 15px !important;
          }
          .loca_download.user{
            margin: 0px 10px 0 15px !important;
          }
          .loca_download.user2{
            margin: 0px 10px 0 15px !important;
          }
          .ceshi:before {
            content: "\E006";
            color: #282f3c;
            font-size: 1.625rem;
        }

        /* 在PC上悬停且鼠标处于悬停状态时应用样式 */
        @media only screen and (hover: hover) and (min-width: 768px) {
        .personallike:hover svg path {
            stroke: #ff6f00;
        }
        }
        .type1 {
            margin: 0px 0px 0 15px !important;
          }
      
          .type2 {
            margin: 0px 20px 0 20px !important;
          }
      
          .type3 {
            margin: 8px 30px 0 0; !important;
          }
          .type4 {
            margin: 10px 10px 0 !important;
          }
          .card-act li{
            width: 18.33% !important;
          }
        `
        let style = document.createElement('style')
        style.className = "svgstyle"
        style.textContent = css;
        document.head.appendChild(style);
    }
}

function copydec(title) {
    // 创建元素
    const toastElement = document.createElement('div');
    toastElement.className = 'woo-modal-main';
    toastElement.setAttribute('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);')
    toastElement.innerHTML = `
        <div class="woo-box-flex woo-box-column woo-box-alignCenter woo-box-justifyCenter woo-toast-main woo-toast--success" aria-modal="true" tabindex="0" role="alert">
            <div class="woo-toast-head">
                <svg viewBox="0 0 37 37" xmlns="http://www.w3.org/2000/svg" class="woo-toast-icon">
                    <path d="M18.5 37C8.283 37 0 28.717 0 18.5S8.283 0 18.5 0 37 8.283 37 18.5 28.717 37 18.5 37zm0-3C27.06 34 34 27.06 34 18.5 34 9.94 27.06 3 18.5 3 9.94 3 3 9.94 3 18.5 3 27.06 9.94 34 18.5 34zm-1.802-12.683l9.872-9.871c.946-.946 2.462-.965 3.384-.043.923.923.903 2.438-.043 3.384L18.487 26.21a2.447 2.447 0 01-1.59.718 2.357 2.357 0 01-1.945-.675l-7.797-7.797a2.363 2.363 0 013.341-3.341l6.202 6.202z" fill="#FFF"></path>
                </svg>
            </div>
            <div class="woo-toast-body">
                <span>${title}</span>
            </div>
        </div>
`;

    // 将元素添加到页面中
    document.body.appendChild(toastElement);

    // 3 秒后移除元素
    setTimeout(() => {
        toastElement.remove();
    }, 3000);

}

function 下载文件(url, filename, 链接id, id, 按钮_参数) {
    showToast("开始下载媒体信息", true);
    // 检查是否为手机浏览器
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        // showToast("检测为手机浏览器！");
        GM_download({
            url: url,                           // 下载文件的 URL 地址
            name: filename,                   // 不填则自动获取文件名
            headers: headers,
            saveAs: true,                         // 布尔值，显示"保存为"对话框
            onerror: function (error) {           // 如果下载最终出现错误，则要执行的回调
                console.log(error)
                showToast('文件下载出错：', false);
                按钮_参数.setAttribute('down_status', 'fail');
            },
            onprogress: (pro) => {                // 如果此下载取得了一些进展，则要执行的回调
                // console.log(pro.loaded)           // 文件加载量
                // console.log(pro.totalSize)
            },
            ontimeout: () => {
                showToast('文件下载出错：', false);
                按钮_参数.setAttribute('down_status', 'fail');
            },                  // 如果此下载由于超时而失败，则要执行的回调
            onload: () => {
                console.log('文件下载成功');
                showToast("文件预下载完成了", true);
                按钮_参数.setAttribute('down_status', 'success');
                添加成功下载文件(id);
                添加成功下载文件(链接id);
            }                      // 如果此下载完成，则要执行的回调
        })
    } else {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (xhr.response.size > 0) {
                    showToast("文件预下载完成了", true);
                    var a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    showToast("请选择保存位置，并保存文件", true)
                    a.click();
                    window.URL.revokeObjectURL(a.href);
                    document.body.removeChild(a);
                    按钮_参数.setAttribute('down_status', 'success');
                    // 按钮.className += ' completed';
                    添加成功下载文件(id);
                    添加成功下载文件(链接id);
                } else {
                    showToast("文件大小为 0", false);
                    按钮_参数.setAttribute('down_status', 'fail');
                }
            } else {
                showToast("请求失败", false);
                按钮_参数.setAttribute('down_status', 'fail');
                // 按钮.className += ' failed';
            }
        };
        xhr.onerror = function () {
            showToast("请求失败", true);
            按钮_参数.setAttribute('down_status', 'fail');
        };
        // 在桌面浏览器中使用 blob 下载
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send();
    }
    return false;
}
function 下载文件_备份(url, filename, 链接id, id, 按钮_参数) {
    showToast("开始下载媒体信息", true);
    按钮_参数.setAttribute('down_status', 'wait');
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        var fileSize = xhr.response.size; // 获取文件大小
        var maxSize = 10 * 1024; // 设置最大文件大小为5MB
        if (fileSize < maxSize) {
            // 如果文件大于5MB，显示警告并返回
            showToast("文件过小，疑似URL异常。", true);
            return; // 结束函数执行
        }
        showToast("文件预下载完成了", true)
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        showToast("请选择保存位置,并保存文件", true)
        a.click();
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
        添加成功下载文件(id);
        添加成功下载文件(链接id);
        按钮_参数.setAttribute('down_status', 'success');

    };

    // 处理下载错误
    xhr.onerror = function () {
        showToast("下载失败，请检查网络连接并重试", true);
        list_down_button.classList.remove('wait');
        list_down_button.classList.add('error'); // 可以添加一个错误的类来改变按钮的样式，表示下载失败
        wenjian.style.backgroundColor = ""; // 或设置为其他颜色，表示错误状态
    };

    xhr.open('GET', url);
    xhr.send();
    return false;
}
function 创建转发更多按钮(addedNode, sharp) {
    if (!addedNode.querySelector('.custom_more')) {

        var 展开 = document.createElement('div')
        展开.className = "woo-pop-wrap morepop_more_3ssan custom_more_button";
        展开.innerHTML = `<span class="woo-pop-ctrl "><div class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter morepop_moreIcon_1RvP9"><i class="woo-font woo-font--angleDown morepop_action_bk3Fq" title="更多"></i></div></span><div class="custom_more woo-pop-main woo-pop-down woo-pop-end" style="display: none"><!----><!----><div class="woo-pop-wrap-main"><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>帮上头条</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>收藏</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>屏蔽此条微博</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>屏蔽该博主</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>屏蔽关键词</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><div class="woo-box-flex woo-box-column" style="width: 100%;"><div class="woo-box-flex woo-box-justifyBetween"><div>投诉</div><!----><!----></div><div class="morepop_desc_a9Lfe"></div></div></div><div class="woo-pop-wrap sharp"><span class="woo-pop-ctrl"><div class="woo-box-flex woo-box-alignCenter woo-pop-item-main" role="button"><!----><span>分享</span><!----></div></span><!----></div></div></div>`
        addedNode.insertBefore(展开, addedNode?.firstChild);
        展开.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            var custom_more = 展开.querySelector('.custom_more');
            custom_more.style.display === 'none' ? custom_more.style.display = 'block' : custom_more.style.display = 'none';
        })
        var sharpcopy = 展开.querySelector('.sharp');
        sharpcopy.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            if (sharp) {
                // 创建一个新的 textarea 元素来存放需要复制的内容
                const textarea = document.createElement('textarea');
                textarea.value = sharp;
                document.body.appendChild(textarea);

                // 选中 textarea 中的内容并复制到剪贴板
                textarea.select();
                document.execCommand('copy');

                // 移除 textarea 元素
                document.body.removeChild(textarea);
                // showToast(`已经复制链接：${sharp}`);

                展开.click();

                copydec('复制成功');
            } else {
                copydec('链接不存在');
            }

        })
    }
}
function 下载记录查询(ID, 按钮_参数) {
    var mediajson = localStorage.getItem('mediacompleted');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    if (mediajson.includes(ID)) {
        按钮_参数.setAttribute('down_status', 'success');
    } else {
        按钮_参数.setAttribute('down_status', 'download');
    }
}
function 下载记录查询_send(ID, send_button_参数) {
    var mediajson = localStorage.getItem('mediacompleted2');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    if (mediajson.includes(ID)) {
        send_button_参数.setAttribute('down_status', 'complete');
    }
}
function 添加成功下载文件(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted', JSON.stringify(mediajson));
}
function 添加成功下载文件_send(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted2');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted2', JSON.stringify(mediajson));
}
function 获取信息发送(svgparentElement, local_down, 链接id, 下载方式) {
    try {
        let 匹配, js2, js3, js4, 发帖时间, 用户名, id, ip, 微博文案, mblogid, filename, url, savedDirectoryPath, 混合媒体, 单视频, 单视频2, 图片, 图片2, 图片id, 视频id, 清晰度, 码率, 文件类型;
        匹配 = false;
        js3 = [];
        js4 = {};
        if (typeof $render_data !== 'undefined') {
            // 在这里使用 $render_data 变量
            if ($render_data?.status?.page_info?.page_pic?.url?.includes(链接id) || $render_data?.status?.thumbnail_pic?.includes(链接id)) {
                匹配 = true;
                js2 = $render_data?.status;
            }
        } else {
            // console.error('$render_data 变量未定义');
        }
        if (!匹配) {
            for (let index = 0; index < js.length; index++) {
                js2 = js[index];
                if (!js2) {
                    continue;
                }
                if (js2.mblogid === 链接id || js2.bid === 链接id || js2.page_info?.page_pic?.url?.includes(链接id) || js2.thumbnail_pic?.includes(链接id) || js2.page_info?.media_info?.stream_url?.includes(链接id)) {
                    匹配 = true;
                    break;
                }
            }
        }
        if (匹配) {
            解读内容(js2);
        } else {
            showToast("当前微博ID" + 链接id + '未匹配到记录库的内容，请刷新页面');
            if (下载方式 === 2) {
                local_down.setAttribute("down_status", "fail");
            } else {
                svgparentElement.setAttribute("down_status", "fail");
            }
        }
        function 解读内容(js2) {
            发帖时间 = 转换时间(js2.created_at);
            用户名 = js2.user?.screen_name?.trim();
            用户id = js2.user?.id;
            id = (js2.idstr?.trim() || js2.id?.trim() || "");
            mblogid = js2.mblogid ? js2.mblogid.trim() : '';
            ip = js2.region_name ? js2.region_name.trim().split(' ')[1] : '';
            微博文案 = js2.text_raw?.trim() || js2.text?.trim();
            var dom = 元素转DOM对象(微博文案);
            微博文案 = dom.body.textContent.trim().slice(0, 110);
            下载方式 === 2 ? 微博文案 = dom.body.textContent.trim().slice(0, 100) : 微博文案 = dom.body.textContent.trim().slice(0, 110);
            savedDirectoryPath = localStorage.getItem('directoryPath');
            混合媒体 = js2.mix_media_info?.items;
            单视频 = js2.page_info?.media_info?.playback_list;
            单视频2 = js2.page_info?.urls?.[Object.keys(js2.page_info.urls)[0]];
            图片 = js2.pic_infos;
            图片2 = js2.pics;
            if (混合媒体?.length > 0) {
                for (let i2 = 0; i2 < 混合媒体?.length; i2++) {
                    if (混合媒体[i2].type === 'video') {
                        视频id = 混合媒体[i2].data?.media_info?.media_id;
                        文件ID = 视频id;
                        url = 混合媒体[i2].data?.media_info?.h265_mp4_hd;
                        filename = `${用户名}----${用户id}----${微博文案}----${id}----${视频id}----${ip}${发帖时间}----（${i2 + 1}）.mp4`;
                        文件类型 = 'mp4';
                    } else {
                        图片id = 混合媒体[i2].data?.pic_id;
                        文件ID = 图片id;
                        url = 混合媒体[i2].data?.largest?.url;
                        filename = `${用户名}----${用户id}----${微博文案}----${id}----${图片id}----${ip}${发帖时间}----（${i2 + 1}）.png`;
                        文件类型 = 'png';
                    }
                    filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
                    js3.push({ 用户名: 用户名, 文章ID: id, 文件ID: 文件ID, url: url, 文件名: filename, 文件类型: 文件类型 });
                }
            } else {
                if (单视频?.length > 0) {
                    url = 单视频[0].play_info?.url;
                    清晰度 = 单视频[0].play_info?.quality_desc;
                    码率 = 单视频[0].play_info?.quality_label;
                    视频id = 单视频[0].media_id;
                    filename = `${用户名}----${用户id}----${微博文案}----${id}----${视频id} ${清晰度}${码率}----${ip}${发帖时间}.mp4`;
                    filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
                    js3.push({ 用户名: 用户名, 文章ID: id, 文件ID: 视频id, url: url, 文件名: filename, 文件类型: 'mp4' });
                } else {
                    if (图片 && js2.hasOwnProperty('pic_infos')) {
                        let 图片ID集 = Object.keys(js2.pic_infos);
                        for (let i2 = 0; i2 < 图片ID集.length; i2++) {
                            图片id = 图片ID集[i2];
                            url = js2.pic_infos[图片ID集[i2]].largest?.url;
                            filename = `${用户名}----${用户id}----${微博文案}----${id}----${图片id}----${ip}${发帖时间}----（${i2 + 1}）.png`;
                            filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
                            js3.push({ 用户名: 用户名, 文章ID: id, 文件ID: 图片id, url: url, 文件名: filename, 文件类型: 'png' });
                        }
                    } else {
                        if (单视频2) {
                            url = 单视频2;
                            清晰度 = Object.keys(js2.page_info.urls)[0];
                            码率 = Object.keys(js2.page_info.urls)[0];
                            视频id = js2.fid;
                            filename = `${用户名}----${用户id}----${微博文案}----${id}----${视频id} ${清晰度}${码率}----${ip}${发帖时间}.mp4`;
                            filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
                            js3.push({ 用户名: 用户名, 文章ID: id, 文件ID: 视频id, url: url, 文件名: filename, 文件类型: 'mp4' });
                        } else {
                            if (图片2) {
                                for (let i2 = 0; i2 < 图片2.length; i2++) {
                                    图片id = 图片2[i2].pid;
                                    url = 图片2[i2].large?.url;
                                    filename = `${用户名}----${用户id}----${微博文案}----${id}----${图片id}----${ip}${发帖时间}----（${i2 + 1}）.png`;
                                    filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
                                    js3.push({ 用户名: 用户名, 文章ID: id, 文件ID: 图片id, url: url, 文件名: filename, 文件类型: 'png' });
                                }
                            } else {
                                showToast('未匹配到媒体内容', false)
                                return;
                            }
                        }
                    }
                }
                js4.media = js3;
                js4.mblogid = mblogid;
                js4.文章ID = id;
                js4.下载名称 = `《${用户名}》 \n ${微博文案}`;
                savedDirectoryPath = localStorage.getItem("directoryPath");
                if (savedDirectoryPath) {
                    js4.目录 = savedDirectoryPath + 用户名.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');

                    if (下载方式 === 2) {
                        下载文件主程序(js4, 链接id, id, local_down);
                    } else {
                        发送信息(JSON.stringify(js4), svgparentElement);
                    }
                } else {
                    svgparentElement.setAttribute("down_status", "error");
                    保存目录设置();
                }
                console.log(js4, JSON.stringify(js4))
            }
            // 去除特殊符 (发帖用户 ＋ “----” ＋ 类型 ＋ “----” ＋ 微博文案 ＋ “----”, )
            // 去除特殊符 (文件名 ＋ 微博ID ＋ “----” ＋ 发帖时间 ＋ “（” ＋ 到文本 (计次3) ＋ “）.JPG”, )
            // let filename = `${用户名}----${微博文案}----${id}----${发帖时间}----${js.ip}${js.postingtime}----${urlname}`
            // filename = filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
            return;
        }
    } catch (error) {
        console.log(error)
    }
};
function 下载文件主程序(js, 链接id, id, svgparentElement) {
    for (let i = 0; i < js.media.length; i++) {
        url = js.media[i].url;
        filename = js.media[i].文件名;
        下载文件(url, filename, 链接id, id, svgparentElement);
    }

}

function 去除特殊符(filename) {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
}

function 弹出设置服务器() {
    // 创建悬浮框来让用户填写服务器地址
    let 悬浮框 = document.createElement('div');
    悬浮框.style.position = 'fixed';
    悬浮框.style.top = '50%';
    悬浮框.style.left = '50%';
    悬浮框.style.transform = 'translate(-50%, -50%)';
    悬浮框.style.backgroundColor = '#fff';
    悬浮框.style.padding = '20px';
    悬浮框.style.border = '1px solid #ccc';
    悬浮框.style.zIndex = '9999';
    悬浮框.style.borderRadius = '10px';
    let 输入框 = document.createElement('input');
    var severip = localStorage.getItem('severip');
    if (severip) {
        输入框.value = severip;
    } else {
        输入框.value = 'http://127.0.0.1:5001/Mediadown';
    }
    输入框.type = 'text';
    输入框.style.width = '290px';
    输入框.style.height = '30px';
    输入框.style.margin = '0 5px 0 0';
    输入框.style.backgroundColor = '#c9c9c9';
    输入框.className = 'severinput'
    输入框.placeholder = '请输入服务器地址';
    悬浮框.appendChild(输入框);
    let 确认按钮 = document.createElement('button');
    确认按钮.textContent = '确认';
    确认按钮.className = 'severconfirm';
    确认按钮.style.width = '60px';
    确认按钮.style.height = '30px';
    确认按钮.style.cursor = 'pointer';
    确认按钮.style.borderRadius = '5px';
    确认按钮.style.background = 'antiquewhite';
    确认按钮.addEventListener('click', function () {
        severip = 输入框.value;
        localStorage.setItem('severip', severip);
        document.body.removeChild(悬浮框);
    });
    悬浮框.appendChild(确认按钮);
    document.body.appendChild(悬浮框);

}

function 保存目录设置() {
    let div = document.createElement('div')
    div.className = 'savedDirectoryPath';
    document.body.appendChild(div);
    const span = document.createElement('span');
    span.setAttribute('style', 'font-size: 12px; padding: 3px; border-radius: 5px;position: relative; top: 7px; padding: 8px 0 0 16px;');
    span.innerHTML = '请复制密码：<span  style="user-select: text;cursor: copy;">f4hz</span>，<a href="https://police.lanzouw.com/b01a8pxgj" target="_blank">点击这里</a>下载《网页下载器.exe》';
    var ipinput = document.createElement('input');
    ipinput.className = 'pathinput1';
    ipinput.type = 'text';
    ipinput.placeholder = '服务器地址：http://150.111.42.12:5001/Mediadown';
    div.appendChild(ipinput);
    ipinput.value = localStorage.getItem('severip');
    // 创建编辑框
    var input = document.createElement('input');
    input.className = 'pathinput';
    input.type = 'text';
    input.placeholder = '输入目录路径：I:\\微博影像\\';
    div.appendChild(input);
    input.value = localStorage.getItem('directoryPath');
    var closebutton = document.createElement('button');
    closebutton.className = 'pathbutton1';
    closebutton.innerHTML = '关闭';
    div.appendChild(closebutton);
    // 创建按钮
    var button = document.createElement('button');
    button.className = 'pathbutton';
    button.innerHTML = '保存';
    div.appendChild(button);
    closebutton.addEventListener('click', function (event) {
        event.stopPropagation();
        div.remove();
    })
    div.appendChild(document.createElement('br'));
    div.appendChild(span);
    // 监听按钮点击事件
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        var directoryPath = input.value;
        if (directoryPath) { // 检查输入框不为空
            let path = isValidDirectoryPath(directoryPath)
            if (path) { // 判断路径是否合法
                let severip = ipinput.value;
                localStorage.setItem("directoryPath", path);
                input.value = localStorage.getItem('directoryPath');
                if (isValidURL(severip)) {
                    localStorage.setItem("severip", severip);
                    showToast('服务器地址、目录路径已保存,当前目录' + path + '\n，右键下载点击按钮重新设置路径', true);
                    div.remove();
                } else {
                    alert('请填写服务器地址');
                }
            } else {
                alert(`输入的路径不合法，请重新输入,\\需要转换成\\\\`);
            }
        } else {
            alert('请输入目录路径');
        }
    });
}

function isValidDirectoryPath(path) {
    let path2 = path.replace(path.split("\\").pop(), "")
    if (path2 === '') {
        path2 = path.replace(path.split("/").pop(), "")
    }
    path2 = path2.replace(/\\/g, '/').replace(/\/\//g, '/');
    // 去掉前后的引号和双引号
    path2 = path2.replace(/^['"]|['"]$/g, '');
    return path2;
}

function 取文件名(url) {
    const parts = url.split('/');
    let js = {};
    js.id = parts[parts.length - 1]; // 获取最后一个部分，即 O1hetrtfY
    js.userid = parts[parts.length - 2];
    return js;
}

function 发送信息(信息, 按钮) {
    // 发送跨域 POST 请求
    console.log(localStorage.getItem("severip"))
    if (localStorage.getItem("severip") === '' || !localStorage.getItem("severip")) {
        showToast('请填写并保存你服务器地址。', false);
        保存目录设置()
        return;
    }
    按钮.setAttribute("down_status", "wait");
    GM_xmlhttpRequest({
        method: 'POST',
        url: localStorage.getItem("severip"),
        headers: {
            'Content-Type': 'application/json',
        },
        data: 信息, // 请求体数据
        onload: function (response) {
            try {
                var js = JSON.parse(response.responseText);

                console.log("请求完成", response.responseText);
                if (js?.msg?.下载?.下载状态 === 'true') {
                    showToast(js?.msg?.下载?.下载状况, true);
                    按钮.setAttribute("down_status", "complete");
                    添加成功下载文件_send(js.文章ID);
                    添加成功下载文件_send(js.mblogid);
                } else {
                    按钮.setAttribute("down_status", "fail");
                    showToast(js?.msg?.下载?.下载状况, true);
                }
            } catch {
                按钮.setAttribute("down_status", "fail");
                showToast(JSON.parse(信息)?.下载名称 + "网络请求错误,启动是否打开下载器服务，服务地址是否正确！", false);
            }
        },
        onerror: function (error) {
            console.error("请求失败", error);
            showToast(JSON.parse(信息) + '网络请求失败' + error.readydown_status, false);
            按钮.setAttribute("down_status", "fail");
        }
    });
}

function showToast(message, isError) {
    if (!message) {
        message = '传入信息为空。'
    }
    // 创建新的提示框
    const toastContainer = document.createElement('div');
    // 设置样式属性
    toastContainer.style.position = 'fixed';
    toastContainer.style.justifyContent = 'center';
    toastContainer.style.top = '30%';
    toastContainer.style.left = '50%';
    toastContainer.style.width = '65vw';
    toastContainer.style.transform = 'translate(-50%, -50%)';
    toastContainer.style.display = 'flex';
    toastContainer.style.padding = '5px';
    toastContainer.style.fontSize = '20px';
    toastContainer.style.background = '#e7f4ff';
    toastContainer.style.zIndex = '999';
    toastContainer.style.borderRadius = '15px';
    toastContainer.classList.add('PopupMessage'); // 设置 class 名称为 PopupMessage
    // 根据是否为错误提示框添加不同的样式
    if (isError) {
        toastContainer.classList.add('success');
        toastContainer.style.color = '#3fc91d';
    } else {
        toastContainer.classList.add('error');
        toastContainer.style.color = '#CC5500';
    }
    // 将提示框添加到页面中
    document.body.appendChild(toastContainer);
    // 获取页面高度的 20vh
    const windowHeight = window.innerHeight;
    //设置最低的高度。
    const height = windowHeight * 0.2;
    // 设置当前提示框的位置
    toastContainer.style.top = `${height}px`;
    // 在页面中插入新的信息
    const toast = document.createElement('div');
    // 使用 <br> 实现换行
    toast.innerHTML = message.replace(/\n/g, '<br>');
    toastContainer.appendChild(toast);
    // 获取所有的弹出信息元素，包括新添加的元素
    const popupMessages = document.querySelectorAll('.PopupMessage');
    // 调整所有提示框的位置
    let offset = 0;
    popupMessages.forEach(popup => {
        if (popup !== toastContainer) {
            popup.style.top = `${parseInt(popup.style.top) - toast.offsetHeight - 5}px`;
        }
        offset += popup.offsetHeight;
    });
    // 在 3 秒后隐藏提示框
    setTimeout(() => {
        toastContainer.classList.add('hide');
        // 过渡动画结束后移除提示框
        setTimeout(() => {
            toastContainer.parentNode.removeChild(toastContainer);
        }, 300);
    }, 3000);
};

监测页面请求()
function 监测页面请求() {


    // 保存原始的 XMLHttpRequest 对象
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    var originalXhrSend = XMLHttpRequest.prototype.send;
    // 重写 XMLHttpRequest 的 open 方法
    XMLHttpRequest.prototype.open = function (method, url) {
        //console.log('发起网络请求：', method, url);

        // 保存请求URL
        this.__url = url;

        // 调用原始的 open 方法
        originalXhrOpen.apply(this, arguments);
    };
    // 重写 XMLHttpRequest 的 send 方法
    XMLHttpRequest.prototype.send = function (data) {
        var xhr = this;

        // 监听请求完成事件
        xhr.addEventListener('load', function () {
            // console.log('请求URL：', xhr.__url);
            // console.log('请求头：', xhr.getAllResponseHeaders());
            // console.log('响应内容：', xhr.responseText);
            if (xhr.responseType === 'arraybuffer') {
                // 处理 ArrayBuffer 类型的响应
                var arrayBuffer = xhr.response;
                // 在这里进行 ArrayBuffer 类型响应的处理
            } else {
                // 处理 text 类型的响应
                // console.log('响应内容：', xhr.responseText);
                数据判断(xhr.__url, xhr.responseText);
            }
        });

        // 调用原始的 send 方法
        originalXhrSend.apply(this, arguments);
    };
    // 监听 fetch 请求
    if (window.fetch) {
        var originalFetch = window.fetch;

        window.fetch = function (url, options) {
            console.log('发起网络请求：', url, options);

            // 调用原始的 fetch 方法
            return originalFetch.apply(this, arguments)
                .then(function (response) {
                    //console.log('响应URL：', response.url);
                    //console.log('响应头：', response.headers);
                    return response.text().then(function (text) {
                        //console.log('响应内容：', text);
                        数据判断(response.url, text);
                        return new Response(text, response);
                    });
                });
        };
    }
}

var js = [];
function 数据判断(url, data) {
    try {
        // // 判断是否包含有 "comment/page" 和 "cursor=" 的 URL 请求
        // console.log('响应链接', currentUrl);
        // // 判断是否包含有 "comment/page" 和 "cursor=" 的 URL 请求
        // console.log('请求链接：', currentUrl);
        // console.log('请求协议头：', xhr.getAllResponseHeaders());
        // console.log('Cookie：', document.cookie);
        // console.log('提交数据：', data);
        // console.log('响应数据：', xhr.responseText);
        console.dir(url)
        ///
        if (url.includes('/ajax/feed/groupstimeline?list_id=') || url.includes('ajax/feed/unreadfriendstimeline?list_id=')) {
            let statuses = JSON.parse(data).statuses;
            statuses添加(statuses);
        }
        if (url.includes('friends?max_id=') || url.includes('feed/friends')) {
            let statuses = JSON.parse(data).data.statuses;
            statuses添加(statuses);
        }
        if (url.includes('ajax/statuses/mymblog?uid=')) {
            let statuses = JSON.parse(data).data?.list;
            statuses添加(statuses);
        }

        if (url.includes('ajax/feed/hottimeline?since_id')) {
            let statuses = JSON.parse(data)?.statuses;
            statuses添加(statuses);
        }
        if (url.includes('container/getIndex')) {
            let json = JSON.parse(data);
            if (json.data?.cards?.length > 0) {
                cards = json.data?.cards;
                for (let index = 0; index < cards.length; index++) {
                    let mblog = cards[index].mblog;
                    if (mblog) {
                        js.push(mblog.retweeted_status || mblog);
                    } else {
                        const mblog = cards[index]?.card_group;
                        if (mblog?.length > 0) {
                            js.push(mblog[0].mblog || mblog);
                        }
                    }
                }
            }
        }

        //收藏视频
        if (url.includes('ajax/favorites/all_fav?uid=')) {
            let statuses = JSON.parse(data).data?.status
            statuses添加(statuses)
        }

        //喜欢的视频
        if (url.includes('ajax/favorites/all_fav?uid=')) {
            let statuses = JSON.parse(data).data?.list;
            statuses添加(statuses);
        }
        if (url.includes('ajax/statuses/show?id=')) {
            let statuses = JSON.parse(data);
            statuses添加(statuses, 1);
        }
        if (url.includes('statuses/show?id=')) {
            let statuses = JSON.parse(data).data;
            statuses添加(statuses);
        }
        //我的视频
        if (url.includes('profile/info?uid=')) {
            let statuses = JSON.parse(data).data.statuses;
            statuses添加(statuses);
        }
        //热门微博
        if (url.includes('/ajax/feed/hottimeline?refresh=2&group_id=')) {
            let statuses = JSON.parse(data).statuses;
            statuses添加(statuses);
        }
        //手机分组
        if (url.includes('/feed/group?gid=')) {
            let statuses = JSON.parse(data).data.statuses;
            statuses添加(statuses);
        }
        //手机榜单
        if (url.includes('/api/feed/trendtop?containerid=')) {
            let statuses = JSON.parse(data).data.statuses;
            statuses添加(statuses);
        }
        //手机关注
        if (url.includes('/feed/friends?=')) {
            let statuses = JSON.parse(data).data.statuses;
            statuses添加(statuses);
        }
        function statuses添加(statuses, 类型) {
            if (!statuses) return;
            if (类型 === 1) {
                statuses.retweeted_status ? js.push(statuses.retweeted_status) : js.push(statuses);
            } else {
                if (statuses?.length > 0) {
                    for (let index = 0; index < statuses.length; index++) {
                        if (statuses[index].retweeted_status) {
                            js.push(statuses[index].retweeted_status);
                        } else {
                            js.push(statuses[index]);
                        }
                    }
                    console.log(js);
                }
            }

        }
    } catch (error) {
        console.log("错误信息", error);
    }

}

function 转换时间(inputDateString) {
    // 解析日期字符串
    const date = new Date(inputDateString);
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是从0开始的，需要加1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // 格式化输出
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
    return formattedDate;
}
(function () {
    'use strict';
})();
function 元素转DOM对象(data) {
    let htmlString = data;
    // 创建一个 DOMParser 实例
    let parser = new DOMParser();
    // 使用 DOMParser 的 parseFromString 方法将 HTML 文本解析为 DOM 对象
    return parser.parseFromString(htmlString, 'text/html');
}

function isValidURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // 协议
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // 域名
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // 或者 IP 地址
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // 端口号和路径
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // 查询字符串
        '(\\#[-a-z\\d_]*)?$', 'i'); // 锚点
    return pattern.test(url);
}

var svg = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">
<g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g>
<g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g>
<g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.4"></circle><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round"></path></g>
<g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"></circle><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none"></path></g>
</svg>`

var svg2 = `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 22L2 22" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M17 22V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V22" stroke="#1C274C" stroke-width="1.5"/>
<path d="M21 22V11.5C21 10.0955 21 9.39331 20.6629 8.88886C20.517 8.67048 20.3295 8.48298 20.1111 8.33706C19.6067 8 18.9045 8 17.5 8" stroke="#1C274C" stroke-width="1.5"/>
<path d="M3 22V11.5C3 10.0955 3 9.39331 3.33706 8.88886C3.48298 8.67048 3.67048 8.48298 3.88886 8.33706C4.39331 8 5.09554 8 6.5 8" stroke="#1C274C" stroke-width="1.5"/>
<path d="M12 22V19" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10 5H14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10 8H14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10 11H14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10 14H14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
</svg>`

var headers = {
    'Connection': 'keep-alive',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
    'sec-ch-ua-mobile': '?0',
    'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    'Accept': '*/*',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Accept-Encoding': 'gzip, deflate'
};