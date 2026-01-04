// ==UserScript==
// @name         TMGeneralTranslation
// @namespace    https://trophymanager.com/
// @version      1.0.20
// @author       提瓦特元素反应(https://trophymanager.com/club/4731723/)
// @description  通过翻译服务器对游戏内球员名字进行汉化
// @license      MIT
// @match        https://trophymanager.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493854/TMGeneralTranslation.user.js
// @updateURL https://update.greasyfork.org/scripts/493854/TMGeneralTranslation.meta.js
// ==/UserScript==

var VERSION = "1.0.20"
var DEBUG_MODE = true;
var BACK_END = "https://trans.tm.kit.ga";

//let LOCAL = []; //空表示全部翻译
let WISH_LOCAL = ['cn', 'hk', 'jp', 'tw'];
let LOCAL = JSON.parse(localStorage.getItem('LOCAL')) || WISH_LOCAL;
var DEFAULT_COUNTRY = getCountry(document.querySelector('.top_user_info .clubs_block img').getAttribute('src'));

function measureAjaxLoadTime(url, callback) {
    const startTime = performance.now(); // 请求开始的时间

    GM_xmlhttpRequest({
        method: 'GET',
        url: BACK_END,
        onload: function(response) {
            const endTime = performance.now(); // 请求完成的时间
            let roundedLoadTime = endTime - startTime; // 计算加载时间
            roundedLoadTime = Math.round(roundedLoadTime * 100) / 100;
            callback(roundedLoadTime);
        },
        onerror: function(error) {
            console.error('请求出错:', error);
        }
    });
}

(function() {
    'use strict';
    const newParagraph = document.createElement('a');
    const switchButton = document.createElement('a');
    const bodyEndElement = document.querySelector('.body_end');
    if (bodyEndElement && bodyEndElement.firstChild) {
        measureAjaxLoadTime(BACK_END, function(roundedLoadTime){
            newParagraph.textContent = 'TMGT已启动，有翻译错误/不满意/BUG/请联系作者 翻译服务器连接耗时:'+ roundedLoadTime + "ms";
            switchButton.textContent = `调整翻译国/地区籍 (Current: ${LOCAL.length === 0 ? "ALL" : LOCAL})`;
            switchButton.href = '#';
            switchButton.addEventListener('click', function(event) {
                event.preventDefault(); // 阻止默认链接行为

                // 切换 LOCAL 的值
                if (LOCAL.length === 0) {
                    LOCAL = WISH_LOCAL;
                } else {
                    LOCAL = [];
                }

                // 将新值保存到 localStorage
                localStorage.setItem('LOCAL', JSON.stringify(LOCAL));

                // 重新加载
                location.reload();
            });
            newParagraph.href = 'https://qm.qq.com/q/QIo7VakoYW'
             document.querySelector('.body_end').insertBefore(newParagraph, document.querySelector('.body_end').firstChild);
            document.querySelector('.body_end').insertBefore(document.createElement('br'), document.querySelector('.body_end').firstChild);
            document.querySelector('.body_end').insertBefore(switchButton, document.querySelector('.body_end').firstChild);
        })
    }
})();

function getCountry(str){
    if(str.includes('flag of') && str.split(' ').length >= 3){
        return str.split(' ')[2];
    }
    if(str.includes('/pics/flags/gradient/') && str.split('/').length >= 5){
        return str.split('/')[4].split('.')[0];
    }
    if(str.includes('/national-teams/') && str.split('/').length >= 4){
        return str.split('/')[2];
    }
}

// 请求翻译
function translateNumbers(players, callback, update) {
    players = players.filter(item => item.ID !== null && item.English !== null && item.English !== undefined && !item.English.includes('@'));

    let copyPlayers = [];

    for(let i = 0; i < players.length; i++){
        let player = {}
        if(filterCosName(players[i].English) !== ''){
            player.English = filterName(players[i].English);
        } else {
            player.English = players[i].English;
        }
        player.ID = players[i].ID
        player.Country = players[i].Country
        copyPlayers.push(player);
    }
    // 将输入的整数数组转换为JSON字符串

    const jsonData = JSON.stringify({"version": VERSION, "data": copyPlayers, "update":update, "local": LOCAL});
    console.log(jsonData);

    // console.log(jsonData);
    // 发送 POST 请求
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/translate",
        data: jsonData,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            // 解析返回的 JSON 数据
            const responseData = JSON.parse(response.responseText);
            console.log(responseData);

            // 获取翻译结果数组
            callback(responseData);
        }
    });
}

// 请求上传
function updateTranslation(player){
    let jsonData = JSON.stringify(player);
    // console.log(jsonData);
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/update-player",
        data: jsonData,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            console.log("Response received: ", response.responseText);
            alert("更新完成：" + response.responseText);
            location.reload();
        },
        onerror: function(error) {
            console.error("Error occurred: ", error);
        }
    });
}

function filterName(name){
    if(name.split('\'').length === 3){
        return name.split('\'')[0] + name.split('\'')[2];
    }
    return name;
}

function filterCosName(name){
    if(name.split('\'').length === 3){
        return name.split('\'')[1];
    }
    return '';
}

// 球员详情
(function() {
    'use strict';

    if (window.location.pathname === '/players' || window.location.pathname === '/players/' || !window.location.pathname.includes('/players/')) {
        return;
    }
    var player = {};

    // 检查国籍
    player.Country = getCountry(document.querySelector('.box_sub_header .country_link ib').getAttribute('alt'));

    // 查找包含 id 的元素
    const element = document.querySelector('#change_player_link');

    // 遍历每个元素并提取 id
    if(element.getAttribute('onclick').split(',').length === 3 && element.getAttribute('onclick').split(',')[0].split('(').length === 2){
        player.ID = parseInt(element.getAttribute('onclick').split(',')[0].split('(')[1]);
        player.English = document.querySelector("div.large").querySelector("strong").textContent.split(". ")[1];
    } else {
        return;
    }

    // 找到具有 'large' 类的 <div>，然后选择第一个 <strong> 元素
    var largeDiv = document.querySelector("div.large");
    if (largeDiv) {
        var strongElement = largeDiv.querySelector("strong");

        if (strongElement) {
            // 修改 <strong> 的文本内容
            // 调用函数并传入整数数组作为参数
            translateNumbers([player], function(translations) {
                if(filterCosName(player.English) !== ''){
                    strongElement.textContent = '\'' + filterCosName(player.English) + '\' '+ translations[0].Chinese;
                } else {
                    strongElement.textContent = document.querySelector("div.large").querySelector("strong").textContent.split(". ")[0] + ". " + translations[0].Chinese;
                }
            }, true);
        }
    }
})();

// 战术-列表
(function() {
    'use strict';

    if (!(window.location.pathname.includes('/tactics'))) {
        return;
    }
    let translationsResult = '';

    function modifyNamesAndExtractIdsForNames() {
        var players = [];
        document.querySelectorAll("span.player_name").forEach(element => {
            var player = {};

            // 检查国籍
            let parent = element.parentElement;
            if(parent.querySelectorAll('ib').length !== 0){
                player.Country = getCountry(parent.querySelector('ib').getAttribute('alt'));
            } else {
                player.Country = DEFAULT_COUNTRY;
            }

            player.English = element.textContent;
            player.ID = parseInt(element.getAttribute("player_id"));
            players.push(player);
        });

        document.querySelectorAll('.field_player_name').forEach(element => {
            var player = {};
            if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                player.English = element.firstChild.nodeValue;
            }

            // 检查国籍
            let parent = element.parentElement;
            if(parent.querySelectorAll('ib').length !== 0){
                player.Country = getCountry(parent.querySelector('ib').getAttribute('alt'));
            } else {
                player.Country = DEFAULT_COUNTRY;
            }

            const parentDiv = element.closest('.field_player');
            if (parentDiv) {
                player.ID = parseInt(parentDiv.getAttribute('player_id'));
            }
            players.push(player);
        });

        document.querySelectorAll('.bench_player_name').forEach(element => {
            var player = {};
            if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                player.English = element.firstChild.nodeValue;
            }

            // 检查国籍
            let parent = element.parentElement;
            if(parent.querySelectorAll('ib').length !== 0){
                player.Country = getCountry(parent.querySelector('ib').getAttribute('alt'));
            } else {
                player.Country = DEFAULT_COUNTRY;
            }

            const parentLi = element.closest('li.bench_player');
            if (parentLi) {
                player.ID = parseInt(parentLi.getAttribute('player_id'));
            }
            players.push(player);
        });

        function startTrans(translations){
            document.querySelectorAll("span.player_name").forEach(element => {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(element.getAttribute("player_id"))) {
                        element.textContent = translation.Chinese;
                    }
                })
            });
            document.querySelectorAll('.field_player_name').forEach(element => {
                const parentDiv = element.closest('.field_player');
                if (parentDiv) {
                    translations.forEach(function(translation) {
                        if (translation.ID === parseInt(parentDiv.getAttribute('player_id'))) {
                            if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                                element.firstChild.nodeValue = translation.Chinese;
                            }
                        }
                    })
                }
            });
            document.querySelectorAll('.bench_player_name').forEach(element => {
                const parentLi = element.closest('li.bench_player');
                if (parentLi) {
                    translations.forEach(function(translation) {
                        if (translation.ID === parseInt(parentLi.getAttribute('player_id'))) {
                            if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                                element.firstChild.nodeValue = translation.Chinese;
                            }
                        }
                    })
                }
            });
            document.querySelectorAll('.cond_order div[player_link]').forEach(element => {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(element.getAttribute('player_link'))) {
                        element.textContent = translation.Chinese;
                    }
                })
            });
        }

        if(translationsResult !== ''){
            startTrans(translationsResult);
        } else {
            translateNumbers(players, function(translations) {
                translationsResult = translations;
                startTrans(translationsResult);
            }, true);
        }
    }

    function modifyNamesForSubstitute() {
        let translations = translationsResult;
        document.querySelectorAll('.parm_select.player_select').forEach(element => {
            translations.forEach(function(translation) {
                if (translation.ID === parseInt(element.getAttribute('player_link'))) {
                    element.firstChild.nodeValue = translation.Chinese; // 修改第一个文本节点内容
                }
            })
        });
    }

    // 监控特定元素并应用回调函数
    function bindObserver(selector, callback) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 创建一个 MutationObserver 实例并应用给定的回调
            const observer = new MutationObserver(callback);
            observer.observe(element, {
                childList: true
            });
        });
    }

    // 处理 DOM 变化的函数
    const handleMutations = mutations => {
        mutations.forEach(mutation => {
            // 检查新增的节点
            mutation.addedNodes.forEach(node => {
                if (node.id === 'popup_action' || node.matches && node.matches('#popup_action')) {
                    modifyNamesForSubstitute();
                }
            });
        });
    };

    bindObserver('#tactics_list_list', modifyNamesAndExtractIdsForNames);
    bindObserver('#cond_orders_list', modifyNamesAndExtractIdsForNames);
    // 创建全局观察者来监控元素的删除和重建
    const globalObserver = new MutationObserver(handleMutations);
    globalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();


// 其他球队 && 工资 && 联赛最佳/统计
(function() {
    'use strict';

    if (!(
        window.location.pathname === '/finances/wages' || window.location.pathname === '/finances/wages/' ||
        window.location.pathname.includes('/league/team-of-the-round') ||
        window.location.pathname.includes('/statistics/league') ||
        window.location.pathname.includes('/club/') ||
        window.location.pathname.includes('/national-teams/')
    )) {
        return;
    }
    var players = [];
    var links = [];

    let canUpdate = (!window.location.pathname.includes('/club/') && !window.location.pathname.includes('/league/team-of-the-round') && !window.location.pathname.includes('/national-teams/')) || (window.location.pathname.includes('/club/') && (window.location.pathname.includes('squad/') || window.location.pathname.includes('statistics/')));
    let defaultCountry = (window.location.pathname.includes('/club/')) ? getCountry(document.querySelector(".box_sub_header a.country_link").getAttribute("href")) : DEFAULT_COUNTRY;
    defaultCountry = window.location.pathname.includes('/national-teams/') ? getCountry(document.querySelector(".box_sub_header ib").getAttribute("alt")) : defaultCountry;

    document.querySelectorAll("a[player_link]").forEach(function(element) {
        var link = element;
        var player = {};

        // 检查国籍
        let parent = element.parentElement;
        player.Country = defaultCountry;
        parent.querySelectorAll(`img[src]`).forEach(function(img){
            if(img.getAttribute("src").includes('/pics/flags/gradient/')){
                player.Country = getCountry(img.getAttribute("src"));
            }
            if(img.getAttribute("src").includes('/pics/flags/gradient/')){
                player.Country = getCountry(img.getAttribute("src"));
            }
        })
        parent.querySelectorAll(`a[href]`).forEach(function(a){
            if(a.getAttribute("href").includes('/national-teams/')){
                player.Country = getCountry(a.getAttribute("href"));
            }
            if(a.getAttribute("href").includes('/national-teams/')){
                player.Country = getCountry(a.getAttribute("href"));
            }
        })
        if (link) {
            player.English = link.textContent;
            player.ID = parseInt(link.getAttribute("player_link"));
            players.push(player)
            links.push(link);
        }
    });

    translateNumbers(players, function(translations) {
        links.forEach(function(link) {
            translations.forEach(function(translation) {
                if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                    if(filterCosName(link.textContent) !== ''){
                        link.textContent = '\'' + filterCosName(link.textContent) + '\' '+ translation.Chinese;
                    } else {
                        link.textContent = translation.Chinese;
                    }
                }
            })
        });
    }, canUpdate);
})();

function createTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.zIndex = '1000';
    tooltip.style.visibility = 'hidden';
    document.body.appendChild(tooltip);
    return tooltip;
}

function addHoverTooltip(element, message) {
    const tooltip = createTooltip(message);

    element.onmouseover = function(event) {
        tooltip.style.left = event.pageX + 'px';
        tooltip.style.top = event.pageY + 'px';
        tooltip.style.visibility = 'visible';
    };

    element.onmouseout = function() {
        tooltip.style.visibility = 'hidden';
    };
}

function createPopup(player_id) {
    const popup = document.createElement('div');
    popup.style.border = '2px solid #000000';
    popup.setAttribute('tabindex', '-1');
    popup.style.position = 'absolute';
    popup.style.display = 'none';
    popup.style.backgroundColor = '#41631F';

    const inputTitle = document.createElement('a');
    inputTitle.textContent = '修改翻译:';
    inputTitle.style.textDecoration = 'none'; // 禁用默认下划线
    inputTitle.onmouseover = () => {inputTitle.style.textDecoration = 'none'};
    inputTitle.onmouseleave = () => {inputTitle.style.textDecoration = 'none'};

    addHoverTooltip(inputTitle, '请确保你的翻译没有违背球员姓名的意思，禁止绰号/别名');

    const input = document.createElement('input');
    input.type = 'text';
    input.style.borderBottom = '3px solid black';
    input.style.backgroundColor = '#41631F';
    input.style.padding = '3px';
    input.style.color = 'white';
    input.style.fontFamily = ' Tahoma, Verdana, sans-serif';
    input.style.fontWeight = 'normal';
    input.style.border = 'none';

    const confirmBtn = document.createElement('a');
    confirmBtn.style = 'padding: 3px;';
    confirmBtn.textContent = '确认';
    confirmBtn.onclick = () => {
        let player = {}
        player.ID = player_id;
        player.Chinese = input.value;
        updateTranslation(player);
    };

    const closeBtn = document.createElement('a');
    closeBtn.style = 'padding: 3px;';
    closeBtn.textContent = '取消';
    closeBtn.onclick = () => {popup.style.display = 'none'};

    popup.appendChild(inputTitle);
    popup.appendChild(input);
    popup.appendChild(confirmBtn);
    popup.appendChild(closeBtn);


    return popup;
}

function addEditButton(element, player_id){
    element.parentNode.style.position = 'relative';
    const img = document.createElement('img');
    img.src = 'data:image/png;base64,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';
    img.width="20";
    img.style.position = 'absolute';
    img.style.top = '3px';
    img.style.cursor = 'pointer';
        img.onclick = (event) => {
            const popup = element.parentNode.querySelector('.notification_content') || createPopup(player_id);

            // 获取按钮的位置
            const rect = img.getBoundingClientRect();
            popup.style.top = rect.top + window.scrollY - 3 + 'px';
            popup.style.left = rect.right + window.scrollX + 'px';

            popup.style.display = 'block';
            document.body.appendChild(popup);
        };


    element.parentNode.appendChild(img);
}

// 球员列表
(function() {
    'use strict';

    if (!(
        window.location.pathname === '/players' || window.location.pathname === '/players/'
    )) {
        return;
    }
    var players = [];
    var links = [];

    let canUpdate = (!window.location.pathname.includes('/club/') && !window.location.pathname.includes('/league/team-of-the-round')) || (window.location.pathname.includes('/club/') && (window.location.pathname.includes('squad/') || window.location.pathname.includes('statistics/')));
    let defaultCountry = window.location.pathname.includes('/club/') ? getCountry(document.querySelector(".box_sub_header a.country_link").getAttribute("href")) : DEFAULT_COUNTRY;

    let translationsResult = "";
    let firstLoad = true;

    if(document.querySelector("#toggle_b_team") != undefined){
        document.querySelector("#toggle_b_team").addEventListener('click', function(event) {
            if(document.querySelector("#toggle_b_team img").getAttribute("src") == "/pics/sort_btn_gray_on.gif" && firstLoad){
                location.reload();
            }
            firstLoad = false;
        });
    }

    function startTranslate(){
        document.querySelectorAll("a[player_link]").forEach(function(element) {
            var link = element;
            var player = {};
            // 检查国籍

            let parent = element.parentElement;
            player.Country = defaultCountry;
            parent.querySelectorAll(`img[src]`).forEach(function(img){
                if(img.getAttribute("src").includes('/pics/flags/gradient/')){
                    player.Country = getCountry(img.getAttribute("src"));
                }
                if(img.getAttribute("src").includes('/pics/flags/gradient/')){
                    player.Country = getCountry(img.getAttribute("src"));
                }
            })
            parent.querySelectorAll(`a[href]`).forEach(function(a){
                if(a.getAttribute("href").includes('/national-teams/')){
                    player.Country = getCountry(a.getAttribute("href"));
                }
                if(a.getAttribute("href").includes('/national-teams/')){
                    player.Country = getCountry(a.getAttribute("href"));
                }
            })
            if (link) {
                player.English = link.textContent;
                player.ID = parseInt(link.getAttribute("player_link"));
                players.push(player)
                links.push(link);
            }
        });

        if(translationsResult == ""){
            translateNumbers(players, function(translations) {
                translationsResult = translations;
                links.forEach(function(link) {
                    translations.forEach(function(translation) {
                        if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                            link.textContent = translation.Chinese;
                            addEditButton(link, parseInt(link.getAttribute("player_link")));
                        }
                    })
                });
            }, canUpdate);
        } else {
            let translations = translationsResult;
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                        link.textContent = translation.Chinese;
                    }
                })
            });
        }}

    // Mutation Observer 实例化
    //const mutationObserver = new MutationObserver((mutations) => {
    //    startTranslate();
    //});

    // 监视整个文档的变化
    //mutationObserver.observe(document.querySelector('#sq'), {
    //    childList: true,
    //    subtree: true,
    //});
    startTranslate();
})();

// 转会
(function() {
    'use strict';

    if (!(
        window.location.pathname.includes('/transfer')
    )) {
        return;
    }

    var players = [];
    var links = [];


    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('table')) {
                    document.querySelectorAll("#transfer_list a[player_link]").forEach(function(element) {
                        var link = element;

                        // 检查国籍
                        var player = {};
                        if(true){
                            let parent = element.parentElement.parentElement.parentElement;
                            player.Country = getCountry(parent.querySelector('ib').getAttribute("alt"));
                        }

                        if (link) {
                            player.English = link.textContent;
                            player.ID = parseInt(link.getAttribute("player_link"));
                            players.push(player)
                            links.push(link);
                        }
                    });

                    translateNumbers(players, function(translations) {
                        links.forEach(function(link) {
                            translations.forEach(function(translation) {
                                if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                                    link.textContent = translation.Chinese;
                                }
                            })
                        });
                    }, true);
                }
            });
        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.querySelector('#transfer_list'), {
        childList: true,
        subtree: true,
    });

})();

// 训练
(function() {
    'use strict';

    if (!(
        window.location.pathname === '/training/' || window.location.pathname === '/training'
    )) {
        return;
    }

    let translationResults = "";

    function transTrain(){
        let players = [];
        let links = [];
        document.querySelectorAll(".team .player").forEach(function(element) {
            var link = element;
            if (link) {
                var player = {};
                player.English = link.querySelector(".player_name").textContent;
                player.ID = parseInt(link.getAttribute("player_link"));
                players.push(player)
                links.push(link);
            }
        });

        if(translationResults !== ""){
            let translations = translationResults;
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                        link.querySelector(".player_name").textContent = translation.Chinese;
                    }
                })
            })
        } else {
            translateNumbers(players, function(translations) {
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                        link.querySelector(".player_name").textContent = translation.Chinese;
                    }
                })
            });
        }, false);
        }
    }

    // 监控特定元素并应用回调函数
    function bindObserver(selector, callback) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 创建一个 MutationObserver 实例并应用给定的回调
            const observer = new MutationObserver(callback);
            observer.observe(element, {
                childList: true
            });
        });
    }

    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('#team1, #team2, #team3, #team4, #team5, #team6, #team7')) {
                    if(document.querySelectorAll("#team1, #team2, #team3, #team4, #team5, #team6, #team7").length === 7){
                        bindObserver("#team1, #team2, #team3, #team4, #team5, #team6, #team7", transTrain);
                        setTimeout(function(){
                            transTrain();
                        }, 1000);
                    }
                }
            });
        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.querySelector(".training"), {
        childList: true,
        subtree: true,
    });
})();



// 主页 && 俱乐部 && 联赛
(function() {
    'use strict';

    if (!(window.location.pathname === '/home/'||
        window.location.pathname === '/home'||
        window.location.pathname.includes('/club')||
        window.location.pathname === '/league' ||
        window.location.pathname === '/league/'
    )) {
        return;
    }

    function transBox(){
        var players = [];
        var links = [];

        document.querySelectorAll(".box_body span[onclick]").forEach(function(element) {
            var link = element;
            if (link && link.getAttribute("onclick").split('/').length === 5) {
                var player = {};
                player.English = link.textContent;
                player.ID = parseInt(link.getAttribute("onclick").split('/')[4]);
                players.push(player)
                links.push(link);
            }
        });
        translateNumbers(players, function(translations) {
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("onclick").split('/')[4])) {
                        link.textContent = translation.Chinese;
                    }
                })
            });
        }, false);
    }

    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('#feed .feed_content')) {
                    setTimeout(function(){
                        let players = [];
                        let links = [];

                        document.querySelectorAll("a[player_link]").forEach(function(element) {
                            let link = element;
                            if (link) {
                                let player = {};
                                player.English = link.textContent;
                                player.ID = parseInt(link.getAttribute("player_link"));
                                players.push(player)
                                links.push(link);
                            }
                        });

                        translateNumbers(players, function(translations) {
                            links.forEach(function(link) {
                                translations.forEach(function(translation) {
                                    if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                                        link.textContent = translation.Chinese;
                                    }
                                })
                            });
                        }, false);
                    }, 800);
                }
                if (node.matches && node.matches('.column3_a .box:nth-of-type(2)')) {
                    setTimeout(function(){
                        transBox();
                    }, 800);
                }
            });
        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();

// 关注名单
(function() {
    'use strict';

    if (!(
        window.location.pathname.includes('/shortlist')
    )) {
        return;
    }
    let players = [];
    let links = [];
    document.querySelectorAll("a[player_link]").forEach(function(link) {
        let parent = link.parentElement.parentElement.parentElement;
        // 检查国籍
        let player = {};
        parent.querySelectorAll("img[src]").forEach(function(img) {
            if(img.getAttribute('src').includes("/pics/flags/gradient")){
                player.Country = getCountry(img.getAttribute('src'));
            }
        })
        player.English = link.textContent;
        player.ID = parseInt(link.getAttribute("player_link"));
        players.push(player)
        links.push(link);
    });

    translateNumbers(players, function(translations) {
        links.forEach(function(link) {
            translations.forEach(function(translation) {
                if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                    link.textContent = translation.Chinese;
                }
            })
        });
    }, true);

})();

// 当前竞价
(function() {
    'use strict';

    if (!(
        window.location.pathname.includes('/bids')
    )) {
        return;
    }

    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('div')) {
                    let players = [];
                    let links = [];
                    document.querySelectorAll("a[player_link]").forEach(function(link) {
                        let parent = link.parentElement;
                        let player = {};
                        parent.querySelectorAll("a[href]").forEach(function(a) {
                            if(a.getAttribute('href').includes('/national-teams/')){
                                player.Country = getCountry(a.getAttribute('href'));
                            }
                        })
                        player.English = link.textContent;
                        player.ID = parseInt(link.getAttribute("player_link"));
                        players.push(player)
                        links.push(link);
                    });

                    translateNumbers(players, function(translations) {
                        links.forEach(function(link) {
                            translations.forEach(function(translation) {
                                if (translation.ID === parseInt(link.getAttribute("player_link"))) {
                                    link.textContent = translation.Chinese;
                                }
                            })
                        });
                    }, true);
                }
            });
        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.querySelector('.column2_c .box_body .transfer-box'), {
        childList: true,
        subtree: true,
    });

})();

// 比赛
(function() {
    'use strict';

    if (!(window.location.pathname.includes('/matches/')
    )) {
        return;
    }

    function translateBoard(){
        let players = [];
        let links = [];

        document.querySelectorAll("a.normal.no_hover").forEach(function(element) {
            var link = element;
            if (link) {
                var player = {};
                player.English = link.querySelector('.name').textContent;
                player.ID = parseInt(link.getAttribute("href").split('/')[2]);
                players.push(player)
                links.push(link);
            }
        });

        translateNumbers(players, function(translations) {
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("href").split('/')[2])) {
                        if(link.querySelector('.name').textContent.split('.').length > 1 && '9' >= link.querySelector('.name').textContent.split('.')[0][0] && link.querySelector('.name').textContent.split('.')[0][0] >= '0'){
                            link.querySelector('.name').textContent = link.querySelector('.name').textContent.split('.')[0] + ". " + translation.Chinese;
                        } else {
                            link.querySelector('.name').textContent = translation.Chinese;
                        }
                    }
                })
            });
        }, false);
    }

    function translateQuestionable(){
        let players = [];
        let links = [];

        document.querySelectorAll("a.white.normal").forEach(function(element) {
            var link = element;
            if (link) {
                var player = {};
                player.English = link.textContent;
                player.ID = parseInt(link.getAttribute("href").split('/')[2]);
                players.push(player)
                links.push(link);
            }
        });

        translateNumbers(players, function(translations) {
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("href").split('/')[2])) {
                        link.textContent = translation.Chinese;
                    }
                })
            });
        }, false);
    }

    function translateReport(){
        let players = [];
        let ids = new Set();
        let links = [];

        document.querySelectorAll(".report_list a[href], .event_list a[href]").forEach(function(element) {
            var link = element;
            if (link.getAttribute("href").split('/').length === 3) {
                var player = {};
                player.ID = parseInt(link.getAttribute("href").split('/')[2]);
                player.English = link.textContent;
                if(!ids.has(parseInt(link.getAttribute("href").split('/')[2]))){
                    ids.add(player.ID);
                    players.push(player)
                }
                links.push(link);
            }
        });

        translateNumbers(players, function(translations) {
            links.forEach(function(link) {
                translations.forEach(function(translation) {
                    if (translation.ID === parseInt(link.getAttribute("href").split('/')[2])) {
                        link.textContent = translation.Chinese;
                    }
                })
            });
        }, false);
    }

    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Mutation Observer 实例化
                if (node.matches && (node.matches('div[tab="field"]'))) {
                    translateBoard();
                    translateQuestionable();
                }
                if (node.matches && node.matches('.post_report')) {
                    setTimeout(function(){
                        translateBoard();
                        translateQuestionable();
                        translateReport();
                    }, 800);
                }
            });
        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();