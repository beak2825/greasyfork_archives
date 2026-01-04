// ==UserScript==
// @name         商品比较
// @namespace    http://tampermonkey.net/
// @version      5.0.4
// @description  Get product information
// @match        https://*.jd.com/*
// @match        https://*.jd.hk/*
// @exclude      https://vsp.jd.com/*
// @exclude      https://passport.jd.com/*
// @exclude      https://www.jd.com/?d
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.js
// @resource     iziToastCSS https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.css
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      moreapi.vip.cpolar.cn
// @connect      item.jd.com
// @connect      update.greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495675/%E5%95%86%E5%93%81%E6%AF%94%E8%BE%83.user.js
// @updateURL https://update.greasyfork.org/scripts/495675/%E5%95%86%E5%93%81%E6%AF%94%E8%BE%83.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 检查更新
    GM_xmlhttpRequest({
        method: "GET",
        url: GM_info.script.updateURL,
        headers: {
            "Cache-Control": "no-cache",
            },
        onload: function(response) {
            var scriptText = response.responseText;
            // Extract latest version from the .meta.js content
            var latestVersionMatch = scriptText.match(/@version\s+([0-9.]+)/i);
            if (!latestVersionMatch) {
                console.error("Could not find version in the update URL response.");
                return;
            }
            var latestVersion = latestVersionMatch[1].trim();
            var currentVersion = GM_info.script.version;
            // Compare versions
            if (latestVersion !== currentVersion) {
                iziToast.warning({
                    title: '插件版本更新啦：',
                    message:currentVersion +'>>'+ latestVersion,
                    timeout: 0,
                    position: 'topRight',
                    buttons: [
                        ['<button><b>更新</b></button>', function (instance, toast) {
                            const tab = GM_openInTab(GM_info.script.downloadURL, { active: true, insert: true });
                        }],],});}}});

    // -------------------一些自定义设置-------------------
    // 添加 iziToast CSS 到页面
    const iziToastCSS = GM_getResourceText('iziToastCSS');
    GM_addStyle(iziToastCSS);
    GM_setValue('JS_ON', true);
    // 自定义功能菜单
    $(function () {
        GM_registerMenuCommand("设置", customSetting);
    });
    const API_GET = 'https://moreapi.vip.cpolar.cn/goods/V2/get?limit=';
    const API_POST = 'https://moreapi.vip.cpolar.cn/jdgoods/update';
    const API_SyncStatus = 'https://moreapi.vip.cpolar.cn/goods/V2/syncStatus/';
    let src = "https://cdn.gwdang.com/js/gwdang-notifier.js"
    let node = document.createElement("script");
    node.src = src;
    node.charset = "UTF-8";
    // -------------------一些关于当前状态的判断-------------------
    const isJDHomePage = /www.jd.com/.test(location.href);//京东首页
    const isJDDetailPage = /item.jd.com\/\d+\.html/.test(location.href); //商品详情页面
    const isJDAuthPage = /passport.jd.com/.test(location.href); // 登录页面
    const isJDMobilePage = /cfe.m.jd.com/.test(location.href); // 验证页面
    const isOFFHomePage = (window.location.href === "https://www.jd.com/?from=pc_item_sd");
    const isJDHKDetailPage = /npcitem.jd.hk\/\d+\.html/.test(location.href);//京东国际商品详情页面
    const isJDListPage = /^https:\/\/(search|list)\.jd\.com\/.*$/.test(location.href);//京东搜索结果页面或列表页面
    // 判断当前页面如果是登录、验证页面，则设置变量JS_ON为false，并弹窗提示需要验证或登录
    if (isJDAuthPage || isJDMobilePage || isOFFHomePage) {
        GM_setValue('JS_ON', false);
        iziToast.show({
            title: '提示',
            message: '需要验证或登录',
            timeout: 0,
            position: 'topLeft',
        });
    }
    // 只在首页自动加载列表（先注释掉，只允许手动激活）
    /*
    if(isJDHomePage){
        displayList();
    }
    */
    // 设置一个按钮来加载列表
    let lastClickTime = 0; // 添加一个变量记录上次点击时间戳
    iziToast.show({
        message: '加载更多数据?',
        image:'http://su.pngcdn.cn/2024/07/14/669342e2a36ac.png',
        imageWidth:50,
        close:false,
        timeout: 0,
        progressBar:false,
        position: 'bottomRight',
        transitionIn:'bounceInRight',
        color: '#eeeeeee6',
        buttons: [
            ['<button><b>确认</b></button>', function (instance, toast) {
                let currentTime = new Date().getTime();
                if (currentTime - lastClickTime < 10000) {
                    // 如果距离上次点击不到10秒，则显示错误提示
                    iziToast.error({
                        title: '错误',
                        balloon:true,
                        overlay: true,
                        message: '10秒内仅可请求一次',
                    });
                } else {
                    displayList();
                    lastClickTime = currentTime; // 更新最后点击时间
                }
            }],
            ['<button><b>设置</b></button>', function (instance, toast) {
                customSetting();
            }],
        ],
    });
    let AutoPage = !(isJDDetailPage || isJDAuthPage || isJDMobilePage);
    // -------------------逻辑代码开始-------------------
    // 加载任务商品清单
    function displayList(){
          getGoodsData(function(data) {
              let index = 0;
              const interval = 500; // 延迟一秒加载下一个
              function printNextItem() {
                  if (index < data.length) {
                      if(index==0){
                          console.log(data);
                      };
                      // 存储已生成的 delay 的数组
                      const generatedDelays = [];
                      // 生成 delay  5 到 60 秒之间的随机整数且没有重复项的逻辑
                      const autoOn = GM_getValue('Auto_ON', false);
                      const jsOn = GM_getValue('JS_ON', false);
                      if (!autoOn) {
                          // 自动关闭后提示
                          iziToast.error({
                              id:'autoOn',
                              title: '停止',
                              balloon:true,
                              overlay: true,
                              displayMode: 'once', // once, replace
                              message: '自动已关闭',
                          })};
                      if (!jsOn) {
                          // 自动关闭后提示
                          iziToast.error({
                              id:'jsOn',
                              displayMode: 'once', // once, replace
                              title: '停止',
                              balloon:true,
                              overlay: true,
                              message: '代码已停止',
                          })};
                      let delay = 0;
                      if (autoOn && jsOn) {
                        do {
                          const minSeconds = 5;
                          const maxSeconds = 60;
                          const randomSeconds = getRandomInt(minSeconds, maxSeconds);
                          delay = randomSeconds * 1000;
                        } while (generatedDelays.includes(delay));
                        // 将生成的 delay 添加到数组中
                        generatedDelays.push(delay);
                        } else {
                        delay = 0;
                        }
                      const thisjdsku = data[index].jd_sku;
                      const thisname = data[index].name || data[index].jd_name || '';
                      const thisurl = "https://item.jd.com/" + thisjdsku + ".html";
                      iziToast.show({
                          id: thisjdsku,
                          title: `【${index + 1}】${thisjdsku}`,
                          titleSize: '8px',
                          message: thisname,
                          messageSize: '8px',
                          timeout: delay,
                          position: 'bottomLeft',
                          resetOnHover:true,
                          close: false,
                          color: '#e7ff92f7',
                          buttons: [
                              ['<button><b>打开</b></button>', function (instance, toast) {
                                  syncStatus(thisjdsku,'start');
                                  instance.hide({ transitionOut: 'fadeOut' }, toast, '点击了打开');
                                  const tab = GM_openInTab(thisurl, { active: false, insert: true });
                                  checkPage(tab, thisjdsku);
                              }],
                              ['<button>关闭</button>', function (instance, toast) {
                                  instance.hide({transitionOut: 'fadeOutUp',onClosing: function(instance, toast, closedBy){
                              }}, toast, '点击了关闭');
                              }]
                          ],
                          onClosing: function(instance, toast, closedBy){
                          },
                          onClosed: function(instance, toast, closedBy){
                              if (closedBy === 'timeout'&& GM_getValue('Auto_ON', false) && GM_getValue('JS_ON', false)){
                                  const newTab = GM_openInTab(thisurl, { active: false, insert: true });
                                  syncStatus(thisjdsku,'start');
                                  checkPage(newTab, thisjdsku);
                                  setTimeout(function() {
                                      newTab.close();
                                      syncStatus(thisjdsku,'end');
                                  }, 20000);
                              }
                          }
                      });
                      index++;
                      setTimeout(printNextItem, interval);
                  }
              }
              printNextItem();
          });
    }
    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 判断当前页面，如果是搜索结果或列表页面则执行下面代码，否则跳过
        if (isJDListPage) {
            var observer;
            // 创建MutationObserver实例
            observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                  mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim() === '正在加载中，请稍后~~') {
                      // 在提示元素出现时启动一个新的MutationObserver观察其消失
                      observer.disconnect();
                      observer.observe(node.parentNode, { childList: true, subtree: true });
                    }
                  });
                } else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                  mutation.removedNodes.forEach(async function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim() === '正在加载中，请稍后~~') {
                        // 在提示元素消失后等待一秒，执行数据上传
                        await waitSecond(1);
                        updateGoods(getlist());
                    }
                  });
                }
              });
            });
            // 获取商品列表的父节点
            var productList = document.querySelector('.m-list');
            // 开始观察商品列表的变化
            observer.observe(productList, { childList: true, subtree: true });
            // 更新商品池的JSON数据,并重新上传数据库
            updateGoods(getlist());
            }
        // 判断当前页面，如果是商品详情页面则执行下面代码，否则跳过
        if (isJDDetailPage || isJDHKDetailPage) {
            //插入比价党代码
            document.body.appendChild(node);
            iziToast.info({
                id: 'Tooltip',
                title: '加载中',
                message: '数据加载中',
                position: 'topRight',
                displayMode: 'replace',
            });
            // 获取商品编码
            const itemCode = location.pathname.split('/')[1].split('.')[0];
            // 如果网页中包含‘该商品已下柜，欢迎挑选其他商品！’字符，则表明商品已下架，调用syncStatus函数同步状态
            if (document.body.innerText.includes('该商品已下柜，欢迎挑选其他商品！')) {
                syncStatus(itemCode,'off');
            }
            let checkCount = 0; // 用于计数检查的次数，需要获取到手价
            const maxChecks = 3; // 总共需要检查的次数
            function checkElement() {
                if(document.getElementById("gwd_minibar")){
                    document.getElementById("gwd_minibar").style.display = "none";
                }
                const element = document.querySelector('.dsj-sp2');
                if (element) {
                    clearInterval(intervalId); // 清除定时器，不再检查
                    updateGoods(getdetail());
                    syncStatus(itemCode,'end')
                } else {
                    // 元素不存在，继续检查
                }
                checkCount++; // 增加检查次数
                if (checkCount >= maxChecks) {
                    // 如果已经检查了足够的次数，清除定时器
                    clearInterval(intervalId);
                    updateGoods(getdetail()); // 调用获取商品详情函数，防止页面加载慢导致获取不到数据的情况发生。
                    syncStatus(itemCode,'end')
                }
            }
            // 设置定时器，每隔1秒调用一次checkElement函数
            const intervalId = setInterval(checkElement, 1000);
        }
    });

    // -----------------------下面定义了一些数据接口和函数------------------------
    /**
     * 更新商品池的JSON数据,并重新上传数据库
     */
    function updateGoods(goodsjson) {
        // 将 JSON 字符串解析为对象数组
        var goodsArray = JSON.parse(goodsjson);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const options = {method: 'POST',headers: myHeaders,body:goodsjson};
        fetch(API_POST, options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
        iziToast.success({
            id: 'Tooltip',
            title: '成功',
            message: '数据加载成功',
            position: 'topRight',
            displayMode: 'replace',
            timeout: 1000,
        });
    }
    /**
     * 定义一个获取待更新数据的函数，独立出来，方便后期扩展离线本地模式
     */
    function getGoodsData(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: API_GET + GM_getValue('limitpage', '1'),
            onload: function(response) {
                let goodsData = JSON.parse(response.responseText);
                callback(goodsData);
            }
        });
    }
    /**
     * 自定义设置菜单功能
     */
    function customSetting() {iziToast.info({
        id: 'inputs',
        title: '设置',
        timeout: 0,
        zindex: 999,
        close: false,// 关闭按钮
        closeOnEscape:true,
        overlay: true,
        resetOnHover:true,
        displayMode: 'once',
        message: '自动运行',
        progressBarColor:'#1F6DB7',
        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
        drag: false,
        inputs:[
            ['<input type="checkbox" style="margin-right: 10px;" checked = true>', 'change', function (instance, toast, input, e) {
                GM_setValue('Auto_ON', input.checked);
            }],// change 事件是回调函数
            ['<select style="font-size: 16px;"><option value="1">每次获取</option><option value="1">1</option><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option></select>', 'change', function(instance, toast, input, e) {
                GM_setValue("limitpage", input.value);
            }], // select 元素选中时，change 事件是回调函数
                ],
        buttons: [
            ['<button style="font-size: 16px;background-color: #1F6DB7; ">确认并关闭</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    onClosing: function(instance, toast, closedBy){
                    }
                }, toast, 'buttonName');
            }]
        ],
        onOpening: function(){
            document.querySelector('input[type="checkbox"]').checked = GM_getValue('Auto_ON',false);
        }
    })}
    /**
     * 定义一个同步状态的函数(商品编码,需要同步的状态： 'start', 'end', 'off', 'lose')状态分别对应进行中、完成、下架、失效
     */
    function syncStatus(itemCode,status) {
        const data = {
            jd_sku: itemCode,
            action: status,
        };
        const good_return_data = JSON.stringify(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const options = {method: 'POST',headers: myHeaders,body:good_return_data};
        fetch(API_SyncStatus, options)
          .then(response => response.json())
          .then(response => console.log(response))
          .catch(err => console.error(err));
    }
    /**
     * 定义一个函数，解析搜索和列表页面商品数据
     */
    function getlist() {
        var products = document.querySelectorAll('.gl-item');
        var results = [];
        products.forEach(function(item, index) {
            // 获取商品信息
            var itemCode = item.getAttribute('data-sku');
            var itemName = item.querySelector('.p-name a em').innerText;
            var itemPrice = item.querySelector('.p-price i').innerText;
            var commentCount = item.querySelector('.p-commit strong a').innerText;
            var storeNameElement = item.querySelector('.p-shop a');
            var sellerName = storeNameElement ? storeNameElement.getAttribute('title') : '';
            //判断是否有自营标签
            var isSelfOperatedElement = item.querySelector('.p-icons .goods-icons');
            var isSelfOperated = isSelfOperatedElement ? '是' : '否';
            var PriceArea = document.querySelector('.ui-areamini-text')?.title || '';
            const UserInfo = document.querySelector('.nickname')?.innerText || '';
            // 构建商品对象
            var product = {
                jd_sku: itemCode,
                jd_name: itemName,
                jd_price: itemPrice,
                jd_review: commentCount,
                jd_seller: sellerName,
                jd_self_owned: isSelfOperated,
                jd_city: PriceArea,
                userInfo: UserInfo,
                };
                // 将商品对象添加到结果数组
                results.push(product);
            });
        console.log(results);
        var goodsjson = JSON.stringify(results);
        return goodsjson;
    }
    /**
     * 定义一个函数，解析商品详情页面数据
     */
    function getdetail() {
        // 获取商品编码
        const itemCode = location.pathname.split('/')[1].split('.')[0];
        // 获取商品名称
        const itemName = document.querySelector('.sku-name').innerText.trim();
        // 获取商品价格
        const getItemPrice = () => document.querySelector("span.price.J-presale-price")?.innerText || (document.querySelector('.p-price .price')?.innerText || '未知').replace(/[^\d.]/g, '');
        // 获取评论数量
        const getCommentCount = () => document.querySelector('#comment-count a')?.innerText || document.querySelector('[data-anchor="#comment"] s').innerText.replace(/[\(\)]/g, '') ||'未知';
        // 判断是否自营
        const isSelfOperated = document.querySelector('.u-jd') ? '是' : '否';
        // 获取卖家名称
        const sellerName = document.querySelector('.J-hove-wrap .name a') ? document.querySelector('.J-hove-wrap .name a').innerText : null;
        // 获取到手价
        const final_price = document.querySelector('.dsj-sp2') ? document.querySelector('.dsj-sp2').innerText.replace(/[^\d.]/g, '') : null; // 获取到手价，并去除非数字字符，得到最终价格字符串。如果到手价不存在，则跳过。
        // 获取价格所在区域，如果不存在则显示为'未知'
        const getPriceArea = () => document.querySelector('.ui-areamini-text')?.title || '';
        // 获取提交人信息
        const getUserInfo =  () => document.querySelector('.nickname')?.innerText || '';
        //获取品牌信息
        const getBrand = () => document.querySelector('.p-parameter-list a')?.innerText || '';
        // 获取促销购买方案，网页中是一个table：document.querySelector('.gwd-promo-plan table') ，也可能没有，需要判断，没有则跳过，有则解析
        const table = document.querySelector('.gwd-promo-plan table') ? document.querySelector('.gwd-promo-plan table') : null; // 获取table元素，可能不存在，需要判断。
        const headerRow = table ? table.querySelector('thead tr') : null;
        const headers = table ? Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim()) : null;
        const dataRows = table ? Array.from(table.querySelectorAll('tbody tr')) : null;
        const jsonData = table ? dataRows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return headers.reduce((obj, header, index) => {
                obj[header] = cells[index].textContent.trim();
                return obj;
            }, {});
        }) : undefined;
        const jd_promotion_Info = jsonData ? JSON.stringify(jsonData) : undefined;
        // 转换为 JSON 格式
        const data = {
            jd_sku: itemCode,
            jd_name: itemName,
            jd_price: getItemPrice(),
            jd_review: getCommentCount(),
            jd_self_owned: isSelfOperated,
            jd_seller: sellerName,
            jd_final_price: final_price,
            jd_promotion_Info: jd_promotion_Info, // 促销组合方式，需要根据实际情况获取。
            jd_city: getPriceArea(),
            jd_brand: getBrand(),
            userInfo: getUserInfo(),
        };
        return JSON.stringify([data]);
    }
    // 等待1秒钟的异步函数
    function waitSecond(Time = 1) {
        return new Promise(function(resolve) {
          setTimeout(resolve, Time*1000);
        });
    };
    // 隐藏比价党创建的内容
    function hideGwdang() {
        'use strict';
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var addedNode = mutation.addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            if (addedNode.id === "tbsb-notifiers" || addedNode.id === "gwd_minibar" || addedNode.id === "gwd-price-protect" || (addedNode.classList.contains("gwd-row") && addedNode.classList.contains("gwd-align") && addedNode.classList.contains("gwd-coupon-bar"))) {
                                addedNode.style.display = "none";
                            }}}}});});
        // 配置观察选项
        var config = { childList: true, subtree: true };
        // 选择要观察变化的目标节点
        var targetNode = document.body;
        // 开始观察
        observer.observe(targetNode, config);
    }
    // 调用隐藏内容的函数
    hideGwdang();
    // 检查页面是否跳转到首页，用于判断商品编码是否失效
    function checkPage(tab, thisjdsku) {
        const checkInterval = setInterval(() => {
            if (tab.closed) {
                clearInterval(checkInterval);
                return;
            }

            // 通过向打开的页面注入JS代码来获取当前页面的URL
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://item.jd.com/" + thisjdsku + ".html",
                onload: function(response) {
                    try {
                        const currentURL = response.finalUrl;
                        if (currentURL == 'https://www.jd.com/?d') {
                            syncStatus(thisjdsku,'lose');
                            clearInterval(checkInterval);
                            tab.close();
                        } else {
                            // 在这里执行其他代码
                            clearInterval(checkInterval);
                        }
                    } catch (error) {
                        console.error('Error checking URL:', error);
                    }
                }
            });
        }, 2000); // 每2秒检查一次
    }
    /**
     * 生成指定区间内的随机整数
     */
    function getRandomInt(min, max) {
        // 确保参数是整数
        min = Math.ceil(min);
        max = Math.floor(max);

        // 生成随机整数
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();