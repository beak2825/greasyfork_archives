// ==UserScript==
// @name         💖 引擎搜索 - 解析
// @namespace    https://viayoo.com/
// @version      1.1.3
// @description  引擎搜索切换，视频解析
// @author       You
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @include: 
// @createTime: 2019-11-10
// @updateTime: 2022-08-08
// @homepageURL  https://app.viayoo.com/addons/10
// @downloadURL https://update.greasyfork.org/scripts/528377/%F0%9F%92%96%20%E5%BC%95%E6%93%8E%E6%90%9C%E7%B4%A2%20-%20%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/528377/%F0%9F%92%96%20%E5%BC%95%E6%93%8E%E6%90%9C%E7%B4%A2%20-%20%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

/* 注释屏蔽符 */

(function() {
    let key = encodeURIComponent("Tiger:快速搜索");
    if (window.key === true) {
        return 0;
    }
    window.key = true;

    var menuDocHead = (document.head == null ? document.documentElement : document.head);
    var menuDocBody = (document.body == null ? document.documentElement : document.body);
    const menuAuthor = "wojiu10>";

    var isMenuTelephone = !isMenuComputer();
    if (!isMenuTelephone) {
        let vele = document.createElement("meta");
        vele.setAttribute("name", "viewport");
        vele.setAttribute("content", "user-scalable=yes");
        menuDocHead.appendChild(vele);
    }

    var menuColor = {
        "def": "rgba(0,100,255,0.9)",
        "search": "rgba(255,255,255,0.9)",
        "parse": "rgba(255,0,255,0.9)",
        "mov": "rgba(255,0,0,0.9)",
        "sniff": "rgba(255,255,0,0.9)"
    };

    var menuImg = {
        "def": "url(\"https://img13.360buyimg.com/ddimg/jfs/t1/121241/11/19612/181715/5fbac680E636138b5/267dd280e727aff4.jpg\")",
        "search": "url(\"https://img10.360buyimg.com/ddimg/jfs/t1/153995/32/6946/141735/5fbac69dE9534966e/907508a48ac02516.jpg\")",
        "parse": "url(\"https://img14.360buyimg.com/ddimg/jfs/t1/146509/11/15486/32336/5fbaff67E0fa63117/480e953b09719da1.jpg\")",
        "mov": "url(\"https://img10.360buyimg.com/ddimg/jfs/t1/154154/25/6891/307224/5fbac60fE5d3354e8/dd4d53ad75944cb3.png\")",
        "sniff": "url(\"https://img12.360buyimg.com/ddimg/jfs/t1/154429/37/6866/16041/5fbac649Eecdbd2ca/b7934a6a2243debb.jpg\")"
    };

    var menuShd = {
        "def": "0px 0px 6px 6px rgba(255,0,255,0.8)",
        "search": "0px 0px 6px 6px rgba(0,250,255,0.9)",
        "parse": "0px 0px 6px 6px rgba(50,255,100,0.9)",
        "mov": "0px 0px 6px 6px rgba(255,0,0,1)",
        "sniff": "0px 0px 6px 6px rgba(255,255,0,1)"
    };

var menuSize = {
    "ph2pc": innerWidth / 360,
    "font": 18,
    "btn": 12
};

var menuFlag = {
    "def": 1,
    "search": 2,
    "parse": 3,
    "mov": 4,
    "sniff": 5,
    "login": 6
};

var menuFunc = {
    "search": menuSearch,
    "parse": menuParse,
    "mov": menuMove,
    "sniff": menuSniff,
    "login": menuLogin
};

var menuTimeID = {
    "parse": 0,
    "mov": 0,
    "sniff": 0
};

var menuBtn = document.createElement("div");
menuBtn.style = "position:fixed; z-index:9999999999; right:4%; bottom:8.5%; box-sizing:border-box; opacity:1; background-size:auto 100%; background-repeat:no-repeat; background-position:center";
menuBtn.style.width = menuSize.btn + "%";
menuBtn.style.height = (innerWidth / innerHeight * menuSize.btn) + "%";
menuBtn.style.borderRadius = "100%";

menuBtn.addEventListener("click", menuClickJudge);
menuBtn.addEventListener("touchstart", menuLPStart);
menuBtn.addEventListener("touchmove", menuLPMove);
menuBtn.addEventListener("touchend", menuLPEnd);

window.addEventListener("resize", function() {
    if (innerHeight < menuOldInnerHeight) {
        if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 0) {
            menuDocBody.removeChild(menuBtn);
        }
    } else {
        if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 1) {
            menuDocBody.appendChild(menuBtn);
        }
    }
    menuBtn.style.height = (innerWidth / innerHeight * menuSize.btn) + "%";
});

var menuState;
var menuHidTimeID;
var menuHidTime = 20;
var menuBtnOpacity = 0.1;

// 假设menuDefState是一个已定义的函数
menuDefState();

// 将menuBtn添加到menuDocBody中
menuDocBody.appendChild(menuBtn);

// 为window对象添加devicemotion事件监听器
window.addEventListener("devicemotion", function() {
    // 检查加速度是否超过阈值
    if (event.acceleration.x > 30 || event.acceleration.y > 30 || event.acceleration.z > 30) {
        // 检查menuBtn是否在menuDocBody中
        if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 0) {
            // 根据menuState的值执行不同的操作
            if (menuState == menuFlag.search) {
                searchDocBody.removeChild(searchBgd);
                searchDocBody.appendChild(searchBgd);
            } else if (menuState == menuFlag.parse) {
                mediaParseDocBody.removeChild(videoParseBgd);
                mediaParseDocBody.appendChild(videoParseBgd);
            } else if (menuState == menuFlag.mov) {
                menuDocBody.removeChild(menuBtnMovBgd);
                menuDocBody.appendChild(menuBtnMovBgd);
            } else if (menuState == menuFlag.login) {
                loginDocBody.removeChild(loginBgd);
                loginDocBody.appendChild(loginBgd);
            }
            // 无论menuState的值是什么，都重新添加menuBtn到menuDocBody中
            menuDocBody.removeChild(menuBtn);
            menuDocBody.appendChild(menuBtn);
        }
    }
});

function menuClickJudge() {
    event.stopPropagation();
    
    if (menuBtn.style.opacity == menuBtnOpacity) {
        menuBtn.style.opacity = 1;
        menuHidTimeID = setTimeout(function() {
            menuBtn.style.opacity = menuBtnOpacity;
        }, menuHidTime * 1000);
        return 0;
    }

    if (menuState == menuFlag.def) {
        menuFunc.search();
    } else if (menuState != menuFlag.sniff) {
        if (menuState == menuFlag.search) {
            searchDocBody.removeChild(searchBgd);
        } else if (menuState == menuFlag.parse) {
            videoParseScrollTop = videoParseBgd.scrollTop;
            mediaParseDocBody.removeChild(videoParseBgd);
        } else if (menuState == menuFlag.mov) {
            menuDocBody.removeChild(menuBtnMovBgd);
        } else if (menuState == menuFlag.login) {
            loginDocBody.removeChild(loginBgd);
        }
        menuDefState();
    }
}

var menuLoginStr = "登录";
var menuWatchTv = "视频";
var menuVideoMode = menuAuthor + "video";

function watchVideo() {
    str = "";
    webEvolution(menuVideoMode, str, webPageRules.watchTV, "_blank");
}

var menuReadNoval = "小说";
var menuNovalMode = menuAuthor + "noval";

function menuNovalRead() {
    var str = "dmFyJTIwZWxlcz1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSglMjJBJTIyKTslMEFmb3IodmFyJTIwaT0wO2klM0NlbGVzLmxlbmd0aDtpKyspJTdCJTBBJTIwJTIwJTIwJTIwZWxlcyU1QmklNUQudGFyZ2V0PSUyMl9zZWxmJTIyOyUwQSU3RA==";
    webEvolution(menuNovalMode, str, webPageRules.noval, "_self");
}

var menuReadComic = "漫画";
var menuComicMode = menuAuthor + "comic";

function menuComicRead() {
    var str = "dmFyJTIwZWxlcz1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSglMjJBJTIyKTslMEFmb3IodmFyJTIwaT0wO2klM0NlbGVzLmxlbmd0aDtpKyspJTdCJTBBJTIwJTIwJTIwJTIwZWxlcyU1QmklNUQudGFyZ2V0PSUyMl9zZWxmJTIyOyUwQSU3RA==";
    webEvolution(menuComicMode, str, webPageRules.comic, "_blank");
}

var menuQuitMode = "退出";
var menuBtnMovBgd = document.createElement("div");
menuBtnMovBgd.style = "position:fixed;z-index:9999999999;top:0px;left:0px;box-sizing:border-box;width:100%;height:100%;";
menuBtnMovBgd.addEventListener("click", function() {
    event.stopPropagation();
    menuBtn.style.left = event.clientX - menuBtn.offsetWidth / 2 + "px";


menuBtn.style.top = event.clientY - menuBtn.offsetHeight / 2 + "px";
});

function menuMove() {
    clearTimeout(menuHidTimeID);
    menuDocBody.removeChild(videoParseBgd);
    menuDocBody.appendChild(menuBtnMovBgd);
    menuDocBody.removeChild(menuBtn);
    menuDocBody.appendChild(menuBtn);
    menuBtn.style.backgroundColor = menuColor.mov;
    menuBtn.style.backgroundImage = menuImg.mov;
    menuBtn.style.boxShadow = menuShd.mov;
    menuState = menuFlag.mov;
}

function menuSearch() {
    clearTimeout(menuHidTimeID);
    search();
    if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 0) {
        menuDocBody.removeChild(menuBtn);
        menuDocBody.appendChild(menuBtn);
    }
    menuBtn.style.backgroundColor = menuColor.search;
    menuBtn.style.backgroundImage = menuImg.search;
    menuBtn.style.boxShadow = menuShd.search;
    menuState = menuFlag.search;
}

function menuParse() {
    clearTimeout(menuHidTimeID);
    mediaParse();
    if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 0) {
        menuDocBody.removeChild(menuBtn);
        menuDocBody.appendChild(menuBtn);
    }
    menuBtn.style.backgroundColor = menuColor.parse;
    menuBtn.style.backgroundImage = menuImg.parse;
    menuBtn.style.boxShadow = menuShd.parse;
    menuState = menuFlag.parse;
}

function menuSniff() {
    clearTimeout(menuHidTimeID);
    menuDocBody.removeChild(menuBtnMovBgd);
    menuBtn.style.backgroundColor = menuColor.sniff;
    menuBtn.style.backgroundImage = menuImg.sniff;
    menuBtn.style.boxShadow = menuShd.sniff;
    menuState = menuFlag.sniff;
    setTimeout(function() {
        sourceSniff();
        menuDefState();
    }, 100);
}

function menuLogin() {
    if (autoLogin()) {
        if (menuDocBody.compareDocumentPosition(menuBtn) % 2 == 0) {
            menuDocBody.removeChild(menuBtn);
            menuDocBody.appendChild(menuBtn);
        }
        menuState = menuFlag.login;
        return true;
    }
    return false;
}

// 定义菜单默认状态函数
function menuDefState() {
    menuBtn.style.backgroundColor = menuColor.def; // 设置背景颜色
    menuBtn.style.backgroundImage = menuImg.def;   // 设置背景图片
    menuBtn.style.boxShadow = menuShd.def;         // 设置阴影效果
    menuState = menuFlag.def;                      // 设置菜单状态
    menuHidTimeID = setTimeout(function() {         // 设置延迟隐藏按钮的透明度
        menuBtn.style.opacity = menuBtnOpacity;
    }, menuHidTime * 1000);
}

// 定义菜单长按开始函数
function menuLPStart() {
    if (menuState == menuFlag.def && menuBtn.style.opacity != menuBtnOpacity) { // 检查菜单状态和按钮透明度
        clearTimeout(menuHidTimeID); // 清除隐藏按钮的延迟

        // 设置不同动作的延迟执行
        menuTimeID.parse = setTimeout(menuFunc.parse, 400);
        menuTimeID.mov = setTimeout(menuFunc.mov, 1000);
        menuTimeID.sniff = setTimeout(menuFunc.sniff, 1500);

        // 再次设置延迟隐藏按钮的透明度
        menuHidTimeID = setTimeout(function() {
            menuBtn.style.opacity = menuBtnOpacity;
        }, menuHidTime * 1000);
    }
}

// 定义菜单长按移动函数
function menuLPMove() {
    for (var time in menuTimeID) {
        clearTimeout(menuTimeID[time]); // 清除所有长按动作的延迟
    }
}

// 定义菜单长按结束函数
function menuLPEnd() {
    for (var time in menuTimeID) {
        clearTimeout(menuTimeID[time]); // 清除所有长按动作的延迟
    }
}

// 获取搜索文档的主体部分
var searchDocBody = (document.body == null ? document.documentElement : document.body);

// 定义搜索页面的尺寸配置
var searchSize = {
    "ph2pc": innerWidth / 360, // 页面宽度与360的比例
    "font": 16                // 字体大小
};

// 定义搜索引擎数组

var searchEngine = [
    {
        "*index": "#网址",
        "method": "get",
        "seaUrl": "https://fanyi.baidu.com/#en/zh/@seaKey",
        "name": "wd",
        "placeholder": "Translate"
    },
    {
        "index": "http://m.ibiquge.com/",
        "method": "get",
        "seaUrl": "http://www.ibiquge.com/search.php?q=@seaKey",
        "name": "wd",
        "placeholder": "笔 趣 阁"
    },
    {
        "index": "http://m.dict.cn/",
        "method": "get",
        "seaUrl": "http://apii.dict.cn/mini.php?q=@seaKey",
        "name": "wd",
        "placeholder": "海 词 翻 译"
    },
    {
        "index": "https://yr7ywq.smartapps.baidu.com/",
        "method": "get",
        "seaUrl": "https://www.doubao.com/chat/@seaKey",
        "name": "wd",
        "placeholder": "文心快码"
    },
    {
        "index": "https://byokpg.smartapps.cn/pages/enterpage/enterpage",
        "method": "get",
        "seaUrl": "https://tieba.baidu.com/f/search/res?ie=utf-8&qw=@seaKey",
        "name": "wd",
        "placeholder": "百 度 贴 吧"
    },
    {
        "index": "https://so.csdn.net/",
        "method": "get",
        "seaUrl": "https://so.csdn.net/wap?q=@seaKey",
        "name": "wd",
        "placeholder": "C S D N"
    },
    {
        "index": "https://greasyfork.org/zh-CN",
        "method": "get",
        "seaUrl": "https://greasyfork.org/zh-CN/scripts?q=@seaKey",
        "name": "wd",
        "placeholder": "油 猴"
    }
];

// 创建搜索背景div
var searchBgd = document.createElement("div");
// 创建搜索div
var searchDiv = document.createElement("div");
// 创建搜索表单
var searchForm = document.createElement("form");
// 创建搜索输入框
var searchText = document.createElement("input");
// 创建搜索引擎背景div
var searchEngBgd = document.createElement("div");
// 创建搜索引擎div
var searchEngDiv = document.createElement("div");

// 设置搜索背景样式
searchBgd.style = "position:fixed;z-index:999999999999999;top:0px;left:0px;box-sizing:border-box;width:100%;height:100%;";
// 设置搜索div样式
searchDiv.style = "position:fixed;left:10%;bottom:0px;box-sizing:inherit;width:80%;";
// 为搜索div添加点击事件监听器，阻止事件冒泡
searchDiv.addEventListener("click", function() {
    event.stopPropagation();
});
// 设置搜索表单样式
searchForm.style = "box-sizing:inherit;width:100%;";
// 设置表单提交的目标窗口为_blank，即在新窗口打开
searchForm.target = "_blank";
// 为搜索表单添加提交事件监听器
searchForm.addEventListener("submit", searchSubmit);

// 设置搜索输入框的类型、必填属性、自动完成属性及样式
searchText.type = "search";
searchText.required = "true";
searchText.autocomplete = "off";
searchText.style = "display:block;box-sizing:inherit;width:100%;padding:3% 8%;border-style:none;text-align:center;color:white;font-weight:bold;background-color:rgba(0,0,0,0.7);";
searchText.style.borderRadius = innerWidth * 6 / 100 + "px"; // 设置输入框的圆角
searchText.style.fontSize = searchSize.ph2pc * searchSize.font + "px"; // 设置输入框的字体大小
searchText.style.borderBottom = (searchSize.ph2pc * 5) + "px solid Black"; // 设置输入框的底部边框

// 定义变量engineID用于存储当前选中的搜索引擎ID
var engineID;

// 为搜索输入框添加点击事件监听器
searchText.addEventListener("click", function() {
    if (innerHeight < searchOldInnerHeight) {
        setSearch(nextSearchID(engineID, searchEngine.length)); // 切换搜索引擎
    }
});

// 设置搜索引擎背景div的样式
searchEngBgd.style = "box-sizing:inherit;width:100%;overflow:auto;";
searchEngBgd.style.maxHeight = innerHeight / 2 + "px"; // 设置最大高度

// 设置搜索引擎div的样式
searchEngDiv.style = "float:left;box-sizing:inherit;width:30%;padding:2%;margin-bottom:2%;overflow:auto;white-space:nowrap;text-align:center;color:white;font-weight:bold;background-color:rgb(0,0,0,0.7);box-shadow:0px 0px 1px #000000;";
searchEngDiv.style.borderRadius = innerWidth * 2 / 100 + "px"; // 设置圆角
searchEngDiv.style.fontSize = (searchSize.ph2pc * searchSize.font * 2 / 3) + "px"; // 设置字体大小
searchEngDiv.style.border = (searchSize.ph2pc * 3) + "px solid rgba(255,255,255,0)"; // 设置边框

// 循环创建搜索引擎div
for (let i = 0; i < searchEngine.length; i++) {
    makSearchEngDiv(i);
}

// 将搜索输入框添加到搜索表单中
searchForm.appendChild(searchText);
// 将搜索引擎背景和搜索表单添加到搜索div中
searchDiv.appendChild(searchEngBgd);
searchDiv.appendChild(searchForm);
// 将搜索div添加到搜索背景中
searchBgd.appendChild(searchDiv);

// 创建一个搜索引擎div并设置其点击事件
function makSearchEngDiv(id) {
    var ediv = searchEngDiv.cloneNode(); // 克隆一个搜索引擎div
    ediv.innerHTML = searchEngine[id].placeholder; // 设置div的文本内容为搜索引擎的placeholder

    // 如果id不是3的倍数减1，则设置div的左右外边距
    if (id % 3 != 1) {
        ediv.style.marginLeft = "2.5%";
        ediv.style.marginRight = "2.5%";
    }

    // 为div添加点击事件监听器
    ediv.addEventListener("click", function() {
        setSearch(id); // 设置当前选中的搜索引擎ID

        // 如果搜索引擎的index属性存在且搜索输入框为空，则打开搜索引擎的首页
        if (searchEngine[id].index != undefined && /^ *$/.test(searchText.value)) {
            window.open(searchEngine[id].index);
        } else {
            searchSubmit(); // 否则提交搜索表单
        }
    });

    // 将创建的div添加到搜索引擎背景div中
    searchEngBgd.appendChild(ediv);
}


// 显示搜索界面并设置初始搜索引擎
function search() {
    var id = searchEngineFunc() ? searchEngine.length - 1 : engineID == undefined ? 0 : engineID; // 确定初始搜索引擎ID
    searchDocBody.appendChild(searchBgd); // 将搜索背景添加到文档中
    setSearch(id); // 设置当前选中的搜索引擎
    searchText.focus(); // 使搜索输入框获得焦点
}

// 检查是否存在与页面内搜索表单匹配的搜索引擎，并可能添加新的搜索引擎
function searchEngineFunc() {
    var seaForms = document.getElementsByTagName("FORM"); // 获取页面内所有的表单
    var bool = false; // 标记是否找到了匹配的搜索引擎

    // 遍历所有的表单
    for (var i = 0; i < seaForms.length; i++) {
        if (isSearchHidden(seaForms[i])) {
            continue; // 如果表单被隐藏，则跳过
        }

        var ele; // 存储搜索输入框的元素
        var t = 0; // 统计搜索相关输入框的数量
        var eles = seaForms[i].querySelectorAll("input"); // 获取表单内的所有输入框

        // 遍历所有的输入框
        for (var j = 0; j < eles.length; j++) {
            if (!isSearchHidden(eles[j])) {
                if (eles[j].type == "search" || eles[j].type == "text") {
                    ele = eles[j]; // 找到搜索输入框
                }
                if (eles[j].type == "search" || eles[j].type == "text" || eles[j].type == "password" || eles[j].type == "tel" || eles[j].type == "email") {
                    t++; // 统计搜索相关输入框的数量
                }
            }
        }

        // 如果表单内只有一个搜索相关输入框，并且输入框的名称不为空
        if (t == 1 && ele !== undefined && !/^ *$/.test(ele.name)) {
            var action = seaForms[i].action; // 获取表单的提交地址

            // 如果表单的提交方法为get，则对提交地址进行处理，将搜索输入框的名称替换为@seaKey
            if (/get/i.test(seaForms[i].method)) {
                var patt1 = new RegExp("\\?|&" + ele.name + "=[^&]*");
                var patt2 = new RegExp("&" + ele.name + "=[^&]*");
                if (patt1.test(action)) {
                    action = action.replace(patt1, "?" + ele.name + "=@seaKey");
                } else if (patt2.test(action)) {
                    action = action.replace(patt2, "&" + ele.name + "=@seaKey");
                } else {
                    action += (/\?/.test(action) ? "&" : "?") + ele.name + "=@seaKey";
                }
            }

            var kk = true; // 标记是否找到了匹配的搜索引擎

            // 遍历所有的搜索引擎，检查是否存在与表单提交地址匹配的搜索引擎
            for (var j = 0; j < searchEngine.length; j++) {
                if (searchEngine[j].seaUrl.replace(/\/index\.[a-zA-z]{3,4}/, "") == action.replace(/\/index\.[a-zA-z]{3,4}/, "/")) {
                    kk = false;
                    break;
                }
            }

            // 如果没有找到匹配的搜索引擎，则添加一个新的搜索引擎
            if (kk) {
                if (/get/i.test(seaForms[i].method)) {
                    searchEngine[searchEngine.length] = {
                        "method": "get",
                        "seaUrl": action,
                        "placeholder": "页内搜索-" + i + (searchEngine.length + 1)
                    };
                } else {
                    searchEngine[searchEngine.length] = {
                        "method": seaForms[i].method,
                        "seaUrl": action,
                        "name": ele.name,
                        "placeholder": "页内搜索-" + i + (searchEngine.length + 1)
                    };
                }

                makSearchEngDiv(searchEngine.length - 1); // 创建并添加新的搜索引擎div
                searchText.value = ele.value; // 将搜索输入框的值设置为表单内搜索输入框的值
                bool = true; // 标记找到了匹配的搜索引擎或添加了新的搜索引擎
            }
        }
    }

    return bool; // 返回是否找到了匹配的搜索引擎或添加了新的搜索引擎
}

// 设置当前选中的搜索引擎，并更新搜索引擎div的边框颜色
function setSearch(id) {
    engineID = id; // 设置当前选中的搜索引擎ID

    var bgdChilds = searchEngBgd.children; // 获取搜索引擎背景div中的所有子元素

    // 遍历所有的子元素，更新边框颜色
    for (var i = 0; i < bgdChilds.length; i++) {
        if (i == engineID) {
            bgdChilds[i].style.borderColor = "rgba(0,255,255,0.9)"; // 设置当前选中的搜索引擎div的边框颜色为亮绿色
        } else {
            bgdChilds[i].style.borderColor = "rgba(50,255,50,0.9)"; // 设置其他搜索引擎div的边框颜色为淡绿色
        }
    }

    searchText.placeholder = searchEngine[id].placeholder; // 设置搜索输入框的占位符为当前选中的搜索引擎的placeholder
}

// 用于匹配URL的正则表达式
var searchPatt = /(http|https|ftp):\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([\w\-#\.%]+\/)*[\w\-#\.%]*(\?(([\w\-#\.%]+=[\w\-#\.%]*&)*[\w\-#\.%]+=[\w\-#\.%]*|[\w\-#\.%]*))?/im;

// 提交搜索表单的函数
function searchSubmit() {
    if (searchPatt.test(searchText.value)) {
        // 如果输入的文本是URL，则直接打开该URL
        window.open(searchText.value);
    } else if (!/^ *$/.test(searchText.value)) {
        // 如果输入的文本不是空字符串
        if (searchEngine[engineID]["method"] == "get") {
            // 如果当前选中的搜索引擎的提交方法为get
            window.open(searchEngine[engineID]["seaUrl"].replace("@seaKey", searchText.value));
        } else {
            // 如果当前选中的搜索引擎的提交方法不是get
            searchForm.method = searchEngine[engineID]["method"];
            searchForm.action = searchEngine[engineID]["seaUrl"];
            searchText.name = searchEngine[engineID]["name"];
            searchForm.submit(); // 提交搜索表单
        }
    } else {
        // 如果输入的文本是空字符串，则清空输入框并使其获得焦点
        searchText.value = "";
        searchText.focus();
    }

    // 阻止事件的默认行为（注意：此行代码可能需要根据实际情况进行调整，因为它在函数末尾可能会导致无法预期的行为）
    event.preventDefault();
}

// 获取下一个搜索引擎ID的函数
function nextSearchID(id, length) {
    id++;
    if (id == length) {
        id = 0;
    }
    return id;
}

// 初始化页面高度变量
var searchOldInnerHeight = innerHeight;
if (document.readyState == "complete") {
    searchOldInnerHeight = innerHeight;
} else {
    window.addEventListener("load", function() {
        searchOldInnerHeight = innerHeight;
    });
}

// 检查元素是否被隐藏的函数
function isSearchHidden(ele) {
    if (ele.scrollWidth != 0 && ele.scrollHeight != 0) {
        return false;
    }
    return true;
}

// 为搜索引擎背景div添加点击事件监听器
searchBgd.addEventListener("click", function() {
    event.stopPropagation(); // 阻止事件冒泡
    searchDocBody.removeChild(searchBgd); // 从文档中移除搜索引擎背景div

    // 处理特殊搜索文本的逻辑
    if (searchText.value == menuLoginStr && menuFunc.login()) {
        return 0;
    }
    menuDefState(); // 恢复菜单的默认状态

    // 根据输入的文本执行不同的功能
    if (searchText.value == menuQuitMode) {
        webQuitDIY(); // 退出DIY模式
    } else if (searchText.value == menuWatchTv) {
        watchVideo(); // 观看视频
    } else if (searchText.value == menuReadNoval) {
        menuNovalRead(); // 阅读小说
    } else if (searchText.value == menuReadComic) {
        menuComicRead(); // 阅读漫画
    }
});

// 初始化媒体解析相关变量
var mediaParseDocBody = (document.body == null ? document.documentElement : document.body);
var mediaParseSize = { "ph2pc": innerWidth / 360, "font": 11 };

// 视频解析URL列表
var videoParseUrl = [
    ["https://www.yemu.xyz/?url=", "夜幕解析"],
    ["https://jx.xmflv.cc/?url=", "虾米解析"],
    ["https://jx.xymp4.cc/?url=", "咸鱼解析"],
    ["https://www.8090g.cn/jiexi/?url=", "8090"],
    ["https://jx.2s0.cn/player/?url=", "极速(已挂)"],
    ["https://www.yemu.xyz/?url=", "夜幕解析"],
    ["https://am1907.top/?jx=", "1907解析"],
    ["https://jx.xmflv.cc/?url=", " • • • "]
];

// 初始化视频解析背景div和相关元素
var videoParseBgd = document.createElement("div");
var videoParseDiv = document.createElement("div");
var videoParseUrlDiv = document.createElement("div");
videoParseBgd.style = "position:fixed;z-index:999999999999999;top:0px;left:0px;box-sizing:border-box;width:100%;height:100%;overflow:auto";

// 注意：以下代码段缺少对videoParseBgd、videoParseDiv和videoParseUrlDiv的进一步操作，
// 可能需要在后续的代码中进行完善，以实现视频解析功能的具体界面和逻辑。

// 视频解析滚动位置变量
var videoParseScrollTop = 0;

// 为视频解析背景div添加点击事件监听器
videoParseBgd.addEventListener("click", function() {
    event.stopPropagation(); // 阻止事件冒泡
    videoParseScrollTop = videoParseBgd.scrollTop; // 记录滚动位置
    mediaParseDocBody.removeChild(videoParseBgd); // 从文档中移除视频解析背景div
    menuDefState(); // 恢复菜单的默认状态
});

// 设置视频解析div的样式
videoParseDiv.style = "position:relative;top:65%;left:10%;box-sizing:inherit;width:80%;";

// 为视频解析div添加点击事件监听器（阻止事件冒泡）
videoParseDiv.addEventListener("click", function() {
    event.stopPropagation();
});

// 设置视频解析URL div的样式
videoParseUrlDiv.style = "box-sizing:inherit;width:100%;padding:5%;margin:0px;font-weight:bold;text-align:center;color:#9bafcc;background-color:#262f3d;box-shadow:0px 0px 10px #000000;";
videoParseUrlDiv.style.borderRadius = innerWidth * 5 / 100 + "px"; // 设置边框圆角
videoParseUrlDiv.style.fontSize = mediaParseSize.ph2pc * mediaParseSize.font + "px"; // 设置字体大小

// 创建视频解析URL div并添加到视频解析div中
for (let i = 0; i < videoParseUrl.length; i++) {
    makVideoUrlDiv(i);
}

// 将视频解析div添加到视频解析背景div中
videoParseBgd.appendChild(videoParseDiv);

// 媒体解析函数（将视频解析背景div添加到文档中，并恢复到之前的滚动位置）
function mediaParse() {
    mediaParseDocBody.appendChild(videoParseBgd);
    videoParseBgd.scrollBy(0, videoParseScrollTop);
}

// 创建视频解析URL div的函数
function makVideoUrlDiv(id) {
    if (videoParseUrl[id].length == 2) {
        let vdiv = videoParseUrlDiv.cloneNode();
        vdiv.title = videoParseUrl[id][0]; // 设置标题为URL
        vdiv.innerHTML = videoParseUrl[id][1]; // 设置内容为解析器名称

        // 为视频解析URL div添加点击事件监听器
        vdiv.addEventListener("click", function() {
            window.open(this.title + location.href); // 打开URL（注意：这里可能需要根据实际情况调整URL的拼接方式）
        });

        // 将视频解析URL div添加到视频解析div中
        videoParseDiv.appendChild(vdiv);
    }
}

// 登录页面文档变量（用于后续操作）
var loginDocBody = (document.body == null ? document.documentElement : document.body);

// 设置登录页面元素的尺寸
var loginSize = {
    "ph2pc": innerWidth / 360,
    "font": 24
};

// 为登录页面文档添加点击事件监听器
loginDocBody.addEventListener("click", loginAutoFill);

// 创建登录背景div
var loginBgd = document.createElement("div");

// 创建登录内容div
var loginDiv = document.createElement("div");

// 创建用户名输入框
var loginName = document.createElement("input");
loginName.style = "display:block;box-sizing:inherit;width:100%;padding:3% 8%;border-style:none;margin-bottom:20px;text-align:center;color:white;font-weight:bold;background-color:rgba(0,0,0,0.7);";
loginName.style.borderRadius = innerWidth * 6 / 100 + "px"; // 设置边框圆角
loginName.style.fontSize = loginSize.ph2pc * loginSize.font + "px"; // 设置字体大小
loginName.style.borderBottom = (loginSize.ph2pc * 5) + "px solid red"; // 设置底部边框

// 创建密码输入框（克隆用户名输入框）
var loginPassword = loginName.cloneNode();

// 创建删除按钮div
var loginDel = document.createElement("div");
loginDel.style = "float:left;box-sizing:inherit;width:22%;padding:1.5% 2%;margin:0px 2.5%;text-align:center;font-weight:bold;color:white;background-color:rgba(88,141,134,1.0);";
loginDel.style.borderRadius = innerWidth * 2 / 100 + "px"; // 设置边框圆角
loginDel.style.fontSize = (loginSize.ph2pc * loginSize.font * 2 / 3) + "px"; // 设置字体大小
loginDel.style.border = (loginSize.ph2pc * 3) + "px solid blue"; // 设置边框

// 创建显示密码按钮div（克隆删除按钮div）
var loginPwdShow = loginDel.cloneNode();

// 创建填充按钮div（克隆删除按钮div）
var loginFill = loginDel.cloneNode();

// 设置登录背景div的样式
loginBgd.style = "position:fixed;z-index:999999999999999;top:0px;left:0px;box-sizing:border-box;width:100%;height:100%;";

// 为登录背景div添加点击事件监听器
loginBgd.addEventListener("click", function() {
    event.stopPropagation(); // 阻止事件冒泡
    loginDocBody.removeChild(loginBgd); // 从文档中移除登录背景div
    defState(); // 恢复默认状态
});

// 设置登录内容div的样式
loginDiv.style = "position:relative;left:10%;top:40%;box-sizing:inherit;width:80%;";

// 为登录内容div添加点击事件监听器，阻止事件冒泡
loginDiv.addEventListener("click", function() {
    event.stopPropagation();
});

// 设置用户名和密码输入框的类型
loginName.type = "text";
loginPassword.type = "password";

// 获取当前页面的URI，去除查询字符串
var loginURI = location.href.replace(location.search, "");

// 为删除按钮添加点击事件监听器
loginDel.addEventListener("click", function() {
    if (localStorage.getItem(loginURI)) {
        if (confirm("你确定要删除保存的密码吗？")) {
            localStorage.removeItem(loginURI);
            localStorage.removeItem(loginURI + "_user_name");
            localStorage.removeItem(loginURI + "_user_password");
            loginName.value = "";
            loginPassword.value = "";
            this.innerHTML = "关闭";
        }
    } else {
        loginDocBody.removeChild(loginBgd);
        defState();
    }
});

// 设置查看密码按钮的样式和内容
loginPwdShow.style.width = "41%";
loginPwdShow.innerHTML = "查看密码";

// 为查看密码按钮添加点击事件监听器
loginPwdShow.addEventListener("click", function() {
    if (loginPassword.type == "password") {
        loginPassword.type = "text";
        if (localStorage.getItem(loginURI)) {
            this.innerHTML = "重置密码";
        } else {
            this.innerHTML = "隐藏密码";
        }
    } else {
        if (localStorage.getItem(loginURI)) {
            loginName.value = localStorage.getItem(loginURI + "_user_name");
            loginPassword.value = localStorage.getItem(loginURI + "_user_password");
        }
        loginPassword.type = "password";
        this.innerHTML = "查看密码";
    }
});

// 设置填充按钮的内容
loginFill.innerHTML = "填写";

// 为填充按钮添加点击事件监听器
loginFill.addEventListener("click", function() {
    if (loginName.value == "" || loginPassword.value == "") {
        let str = "你确定填写吗？它将不会被保存！\n账号：" + loginName.value + "\n密码：" + loginPassword.value;
        if (confirm(str)) {
            if (!loginUserFill()) {
                alert("界面发生变化，无法填充密码！");
            }
        } else {
            return 0;
        }
    } else {
        if (localStorage.getItem(loginURI)) {
            var old_name = localStorage.getItem(loginURI + "_user_name");
            var old_password = localStorage.getItem(loginURI + "_user_password");
            if (!(old_name == loginName.value && old_password == loginPassword.value)) {
                var str = "是否修改密码并填写：\n账号：" + old_name + ">>>" + loginName.value + "\n密码：" + old_password + ">>>" + loginPassword.value;
                if (confirm(str)) {
                    localStorage.setItem(loginURI + "_user_name", loginName.value);
                    localStorage.setItem(loginURI + "_user_password", loginPassword.value);
                } else {
                    return 0;
                }
            }
        } else {
            let str = "是否记住密码并填写：\n账号：" + loginName.value + "\n密码：" + loginPassword.value;
            if (confirm(str)) {
                localStorage.setItem(loginURI, true);
                localStorage.setItem(loginURI + "_user_name", loginName.value);
                localStorage.setItem(loginURI + "_user_password", loginPassword.value);
            } else {
                return 0;
            }
        }
        if (!loginUserFill()) {
            alert("界面发生变化，无法填充密码！");
        }
    }
    loginDocBody.removeChild(loginBgd);
    defState();
});

// 将用户名、密码输入框和按钮添加到登录内容div中
loginDiv.appendChild(loginName);
loginDiv.appendChild(loginPassword);
loginDiv.appendChild(loginDel);
loginDiv.appendChild(loginPwdShow);
loginDiv.appendChild(loginFill);

// 将登录内容div添加到登录背景div中
loginBgd.appendChild(loginDiv);

// 自动登录函数
function autoLogin() {
    var is = isLoginFace(document);
    if (is.length > 0) {
        loginName.placeholder = is[0].placeholder == "" ? "用户名" : is[0].placeholder;
        loginPassword.placeholder = is[1].placeholder == "" ? "密码" : is[1].placeholder;
        loginName.value = is[0].value;
        loginPassword.value = is[1].value;

        if (localStorage.getItem(loginURI)) {
            loginDel.innerHTML = "删除";
            loginName.value = localStorage.getItem(loginURI + "_user_name");
            loginPassword.value = localStorage.getItem(loginURI + "_user_password");
        } else {
            loginDel.innerHTML = "关闭";
        }

        loginDocBody.appendChild(loginBgd);
        return true;
    }
    alert("当前页面不是登录界面！\n如果识别有误，请见谅?");
    return false;
}

// 自动填充登录信息函数
function loginAutoFill() {
    // 如果localStorage中存在loginURI对应的项
    if (localStorage.getItem(loginURI)) {
        // 如果loginUserFill函数调用失败，则延迟100毫秒后再次尝试
        if (!loginUserFill()) {
            setTimeout(loginUserFill, 100);
        }
    }
    // 移除loginDocBody上的click事件监听器loginAutoFill
    loginDocBody.removeEventListener("click", loginAutoFill);
}

// 填充用户登录信息函数
function loginUserFill() {
    // 判断当前文档是否为登录界面
    var is = isLoginFace(document);
    if (is.length > 0) {
        // 如果是登录界面，则填充用户名和密码
        is[0].value = localStorage.getItem(loginURI + "_user_name");
        is[1].value = localStorage.getItem(loginURI + "_user_password");
        return true; // 填充成功，返回true
    }
    return false; // 填充失败，返回false
}

// 判断当前文档是否为登录界面函数
function isLoginFace(doc) {
    // 获取文档中的所有iframe和input元素
    var eles = doc.querySelectorAll("iframe,input");
    for (var i = 0; i < eles.length; i++) {
        // 如果元素被隐藏，则跳过
        if (isLoginHidden(eles[i])) {
            continue;
        }
        // 如果元素是iframe，则递归检查iframe中的文档
        if (eles[i].tagName == "IFRAME") {
            var ifraDoc = eles[i].contentDocument;
            if (ifraDoc != null) {
                var result = isLoginFace(ifraDoc);
                if (result.length > 0) {
                    return result; // 找到登录界面，返回结果
                }
            }
        } else if (eles[i].type == "password" && eles[i].scrollHeight > 2) {
            // 如果元素是密码输入框且scrollHeight大于2（可能有显示值）
            for (var j = i - 1; j >= 0; j--) {
                // 从当前密码输入框的前一个元素开始向前查找
                if (eles[j].tagName == "INPUT" && (eles[j].type == "text" || eles[j].type == "tel" || eles[j].type == "email") && !isLoginHidden(eles[j])) {
                    // 找到对应的用户名输入框，返回用户名和密码输入框的数组
                    return [eles[j], eles[i]];
                }
            }
        }
    }
    return []; // 没有找到登录界面，返回空数组
}


// 判断元素是否被隐藏的函数
function isLoginHidden(ele) {
    // 如果元素的scrollWidth和scrollHeight都不为0，则认为元素未被隐藏
    if (ele.scrollWidth != 0 && ele.scrollHeight != 0) {
        return false;
    }
    return true; // 元素被隐藏，返回true
}

// 为menuDocBody添加click事件监听器，触发loginAutoFill函数
menuDocBody.addEventListener("click", loginAutoFill);

// 定义网页规则对象
var webPageRules = {
    "url": "/[.\\r\\n]+/i",
    "type": "folder",
    "current": {
        "url": "/.+/",
        "type": "rule",
        "addrule": {
            "element": "title",
            "css": "meta,link[href$=\".css\"],style",
            "js": "script"
        },
        "remrule": {}
    },
    "watchTV": {
        "url": "/.+/",
        "type": "rule",
        "addrule": {
            "element": "video",
            "css": "meta,link[href$=\".css\"],style"
        },
        "remrule": {}
    },
    "noval": {
        "url": "/.+/",
        "type": "folder",
        "www.booktxt.com": {
            "url": "/https:\\/\\/www\\.booktxt\\.com\\//",
            "type": "folder",
            "search": {
                "url": "/https:\\/\\/www\\.booktxt\\.com\\/search.php\\?keyword=/",
                "type": "rule",
                "addrule": {
                    "element": ".result-list .result-item.result-game-item",
                    "css": "meta,link[href$=\".css\"],style"
                },
                "remrule": {}
            },
            "chapter": {
                "url": "/https:\\/\\/www\\.booktxt\\.com\\/\\d+_\\d+\\/)/",
                "type": "rule",
                "addrule": {
                    "element": ".box_con,#list",
                    "css": "meta,link[href$=\".css\"],style"
                },
                "remrule": {
                    "element": "#listtj"
                }
            },
            "content": {
                "url": "/https:\\/\\/www\\.booktxt\\.com\\/\\d+_\\d+\\/\\d+\\.html/",
                "type": "rule",
                "addrule": {
                    "element": ".content_read",
                    "css": "meta,link[href$=\".css\"],style",
                    "js": "script[src]"
                },
                "remrule": {
                    "element": ".bookname .lm",
                    "js": "script[src*=\"m2.js\"]"
                }
            }
        },
        "m.booktxt.com": {
            "url": "/https:\\/\\/m\\.booktxt\\.com\\//",
            "type": "folder",
            "search": {
                "url": "/https:\\/\\/m\\.booktxt\\.com\\/search.php\\?keyword=/",
                "type": "rule",
                "addrule": {
                    "element": ".result-list .result-item.result-game-item",
                    "css": "meta,link[href$=\".css\"],style"
                },
                "remrule": {}
            },
            "chapter": {
                "url": "/https:\\/\\/m\\.booktxt\\.com\\/wapbook\\/(\\d+|\\d+\\/index_\\d+)\\.html/",
                "type": "rule",
                "addrule": {
                    "element": ".cover,.intro,.chapter",
                    "css": "meta,link[href$=\".css\"],style"
                },
                "remrule": {
                    "element": ".ablum_read"
                }
            },
            "content": {
                "url": "/https:\\/\\/m\\.booktxt\\.com\\/wapbook\\/\\d+_\\d+(_\\d+)?\\.html/",
                "type": "rule",
                "addrule": {
                    "element": ".head,.nr_set,.nr_title,.nr_page,.nr_nr",
                    "css": "meta,link[href$=\".css\"],style",
                    "js": "script[src*=\"reader\"]"
                },
                "remrule": {
                    "element": ".nr_nr .chapter-page-info,br:nth-child(2n+1)"
                }
            }
        }
    },
    "comic": {
        "url": "/.+/",
        "type": "folder",
        "m.bnmanhua.com": {
            "url": "/https:\\/\\/m\\.bnmanhua\\.com\\//",
            "type": "folder",
            "search": {
                "url": "/https:\\/\\/m\\.bnmanhua\\.com\\/index\\.php\\?m=vod-search/",
                "type": "rule",
                "addrule": {
                    "element": "title,.tbox,.menu",
                    "css": "meta,link[href*=\"m.bnmanhua.com\"]",
                    "js": "script[type=\"application/ld+json\"]"
                },
                "remrule": {}
            },
            "chapter": {
                "url": "/https:\\/\\/m\\.bnmanhua\\.com\\/comic\\/\\d+\\.html/",
                "type": "rule",
                "addrule": {
                    "element": "title,.dbox,.tbox.tabs",
                    "css": "meta,link[href*=\"m.bnmanhua.com\"]",
                    "js": "script[type=\"application/ld+json\"]"
                },
                "remrule": {}
            },
            "content": {
                "url": "/https:\\/\\/m\\.bnmanhua\\.com\\/comic\\/\\d+\\/\\d+\\.html/",
                "type": "rule",
                "addrule": {
                    "element": ".bo_tit,div+img,.bo_nav",
                    "css": "meta,link[href*=\"m.bnmanhua.com\"]",
                    "js": "script"
                },
                "remrule": {
                    "js": "script[src*=\"wojiu10\"],script[src*=\"/bd/\"],script[src*=\"mipcdn\"],script[async],script[src*=\"push\"],script[src*=\"video\"]"
                }
            }
        }
    }
};

// 定义webEvolution函数，用于根据规则净化网页
function webEvolution(mode, addition, rule, goal) {
    // 判断文档是否已加载完成，如果是则执行净化操作，否则监听文档加载状态
    if (document.readyState == "interactive" || document.readyState == "complete") {
        purifyWebPage(mode, addition, rule, goal);
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState == "interactive") {
                purifyWebPage(mode, addition, rule, goal);
            }
        });
    }
}

// 定义webQuitDIY函数，用于退出DIY模式
function webQuitDIY() {
    localStorage.removeItem("webMode");
}

// 定义purifyWebPage函数，用于净化网页
function purifyWebPage(mode, addition, rule, goal) {
    document.normalize(); // 标准化文档
    goal = (goal == undefined ? "_blank" : goal); // 设置新窗口的目标属性，默认为_blank

    // 如果localStorage中没有webMode，则设置webMode
    if (localStorage.getItem("webMode") == null) {
        localStorage.setItem("webMode", mode);
    }

    // 克隆文档的documentElement
    var doc = document.documentElement.cloneNode(true);
    // 根据规则运行网页净化操作，获取净化后的根节点
    var rootNode = runWebPageRule(doc, rule);

    if (rootNode != false) {
        // 打开一个新窗口
        var win = window.open("", goal);
        win.document.open("text/html", "replace");
        // 将净化后的内容写入新窗口的文档
        win.document.write(rootNode.innerHTML);

        // 添加额外的JavaScript脚本
        addition = "<script type=\"text/javascript\">(function(){eval(decodeURI(window.atob(\"" + addition + "\")));})();</script>";
        win.document.write(addition);
        win.document.close();
        return true; // 净化成功
    } else {
        alert("规则有误!或还没有适配该网页的规则"); // 净化失败，提示错误
        return false;
    }
}

// 定义runWebPageRule函数，用于根据规则运行网页净化操作
function runWebPageRule(doc, rules) {
    // 分析规则，获取要添加的CSS选择器和要移除的CSS选择器
    var addCssFinder = analysisWebPageRule(rules, "add");
    var remCssFinder = analysisWebPageRule(rules, "rem");

    try {
        var addNodes;
        // 如果存在要添加的CSS选择器，则获取对应的节点
        if (addCssFinder != "") {
            addNodes = doc.querySelectorAll(addCssFinder.substring(1));
        }

        if (addNodes != undefined) {
            var remNodes;
            // 如果存在要移除的CSS选择器，则获取对应的节点
            if (remCssFinder != "") {
                remNodes = doc.querySelectorAll(remCssFinder.substring(1));
            }
            // 执行网页净化操作，返回净化后的根节点
            return webExtractNode(doc, addNodes, remNodes, 0);
        }
        return false; // 如果没有要添加的节点，则返回false
    } catch (err) {
        alert(err); // 如果发生错误，则提示错误
        return false;
    }
}

// 定义analysisWebPageRule函数，用于分析网页规则
function analysisWebPageRule(rules, bool) {
    var cssFinder = "";
    var isMatch = eval(rules.url).test(location.href); // 判断当前URL是否匹配规则中的URL

    if (isMatch) {
        if (rules.type == "folder") {
            // 如果规则类型是文件夹，则递归分析子规则
            for (var rule in rules) {
                if (rule != "url" && rule != "type") {
                    cssFinder += analysisWebPageRule(rules[rule], bool);
                }
            }
        } else {
            // 如果规则类型不是文件夹，则分析添加和移除的规则
            for (var rule in rules[bool + "rule"]) {
                cssFinder += rules[bool + "rule"][rule] == "" ? "" : "," + rules[bool + "rule"][rule];
            }
        }
    }
    return cssFinder; // 返回CSS选择器字符串
}

// 定义webExtractNode函数，用于提取节点
function webExtractNode(doc, addNodes, remNodes, depth) {
    var doc2;
    if (depth == 0) {
        doc2 = document.createElement("div");
        doc2.appendChild(doc.cloneNode()); // 克隆文档元素并添加到新创建的div中
    } else {
        doc2 = doc.cloneNode(); // 克隆文档元素
    }

    var isAppend = false;
    var child = doc.firstChild;

    while (child != null) {
        if (!webNodeInList(child, addNodes)) {
            // 如果节点不在添加列表中
            if (child.hasChildNodes()) {
                // 如果节点有子节点，则递归提取子节点
                var child2 = webExtractNode(child, addNodes, remNodes, depth + 1);
                if (child2 !== false) {
                    doc2.appendChild(child2); // 将提取的子节点添加到新文档中
                    isAppend = true;
                }
            }
        } else {
            // 如果节点在添加列表中
            if (remNodes == undefined) {
                // 如果没有移除列表，则直接克隆并添加节点
                doc2.appendChild(child.cloneNode(true));
                isAppend = true;
            } else if (!webNodeInList(child, remNodes)) {
                // 如果节点不在移除列表中
                if (child.hasChildNodes()) {
                    // 如果节点有子节点，则递归提取子节点（但使用子节点的子节点和移除列表）
                    var child2 = webExtractNode(child, child.childNodes, remNodes, depth + 1);
                    if (child2 !== false) {
                        doc2.appendChild(child2); // 将提取的子节点添加到新文档中
                        isAppend = true;
                    }
                } else {
                    // 如果节点没有子节点，则直接克隆并添加节点
                    doc2.appendChild(child.cloneNode(true));
                    isAppend = true;
                }
            }
        }
        child = child.nextSibling; // 继续处理下一个兄弟节点
    }

    return isAppend ? doc2 : false; // 如果添加了节点，则返回新文档，否则返回false
}

// 定义webNodeInList函数，用于判断节点是否在列表中
function webNodeInList(node, list) {
    var len = list.length;
    for (var i = 0; i < len; i++) {
        if (node.isSameNode(list[i])) {
            return true; // 如果节点与列表中的某个节点相同，则返回true
        }
    }
    return false; // 如果节点不在列表中，则返回false
}

// 根据localStorage中的webMode执行不同的函数
if (localStorage.getItem("webMode") == menuNovalMode && !(/^\/(index\.[a-z]{3,4})?$/.test(location.pathname) && location.search == "")) {
    menuNovalRead(); // 如果webMode是menuNovalMode且URL符合条件，则执行menuNovalRead函数
}
if (localStorage.getItem("webMode") == menuComicMode && !(/^\/(index\.[a-z]{3,4})?$/.test(location.pathname) && location.search == "")) {
    menuComicRead(); // 如果webMode是menuComicMode且URL符合条件，则执行menuComicRead函数
}

// 定义sniffSuffixArr数组，包含不同类型的文件后缀名
var sniffSuffixArr = [
    [".m3u8", ".mp4", ".flv", ".rmvb", ".avi", ".3gp", ".wmv", ".webm", ".mpeg", ".ts"], // 视频文件后缀名
    [".mp3", ".ogg", ".aac", ".wma", ".flac", ".wav", ".mid"], // 音频文件后缀名
    [".ico", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".bmp", ".psd", ".psdx", ".tiff", ".tga", ".eps", ".dwg"], // 图像文件后缀名
    [".txt", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".epub", ".caj"], // 文档文件后缀名
    [".js", ".css", ".apk", ".zip", ".7z"] // 其他文件后缀名
];

var sniffListName=["视频&iframe","音频","图片","文档","其它","全部","源码"];var sniffUrlPattern=[];sniffUrlPattern[0]=/"((http|https|ftp):\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|([ \w\-#\.%]+\/)*[ \w\-#\.%]+\.\d*[a-z][a-z\d]*)(\?(([ \w\-#\.%]+=[ \w\-#\.%]*&)*[ \w\-#\.%]+=[ \w\-#\.%]*|[ \w\-#\.%]*))?"/igm;sniffUrlPattern[1]=/\(((http|https|ftp):\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|([ \w\-#\.%]+\/)*[ \w\-#\.%]+\.\d*[a-z][a-z\d]*)(\?(([ \w\-#\.%]+=[ \w\-#\.%]*&)*[ \w\-#\.%]+=[ \w\-#\.%]*|[ \w\-#\.%]*))?\)/igm;sniffUrlPattern[2]=/'((http|https|ftp):\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/\/(([\w\-]+\.)+[a-z]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|\/([ \w\-#\.%]+\/)*[ \w\-#\.%]*|([ \w\-#\.%]+\/)*[ \w\-#\.%]+\.\d*[a-z][a-z\d]*)(\?(([ \w\-#\.%]+=[ \w\-#\.%]*&)*[ \w\-#\.%]+=[ \w\-#\.%]*|[ \w\-#\.%]*))?'/igm;
var sniffEmptyEle=["!","area","base","br","col","embed","frame","hr","img","input","keygen","link","meta","param","polygon","source","track","wbr"];var sniffVsrc=[];var sniffSourceCode;function sourceSniff(){var vsrcq=[];var vsrc1=document.querySelectorAll("[src]");var vsrc2=document.querySelectorAll("[href]");for(var i=0;i<vsrc1.length;i++){vsrcq[vsrcq.length]=vsrc1[i].src;}for(var i=0;i<vsrc2.length;i++){vsrcq[vsrcq.length]=vsrc2[i].href;}sniffVsrc=sniffVsrc.concat(vsrcq);var vword=document.documentElement.innerHTML;var vsrcw=[];for(var i=0;i<sniffUrlPattern.length;i++){vsrcw[i]=vword.match(sniffUrlPattern[i]);if(vsrcw[i]==null){vsrcw[i]=[];}sniffAddr(vsrcw[i]);sniffVsrc=sniffVsrc.concat(vsrcw[i]);}sniffCnki(sniffVsrc);sniffVsrc[sniffVsrc.length]=vword;sniffMatch(sniffVsrc);sniffVsrc.pop();}

// 函数 sniffAddr 用于处理 vsrca 数组中的 URL 地址
function sniffAddr(vsrca) {
    for (var i = 0; i < vsrca.length; i++) {
        // 去掉 URL 地址字符串的首尾引号
        vsrca[i] = vsrca[i].substring(1, vsrca[i].length - 1);

        // 如果 URL 是以 // 开头的协议相对 URL
        if (/^\/\//.test(vsrca[i])) {
            // 将其补全为完整的 URL，添加当前页面的协议
            vsrca[i] = location.protocol + vsrca[i];
        } 
        // 如果 URL 是以 / 开头的路径相对 URL
        else if (/^\//.test(vsrca[i])) {
            // 将其补全为完整的 URL，添加当前页面的协议、主机名和路径的前缀
            vsrca[i] = location.protocol + "//" + location.host + vsrca[i];
        } 
        // 如果 URL 不是以 http、https 或 ftp 开头的绝对 URL
        else if (!(/^(http|https|ftp):/.test(vsrca[i]))) {
            // 将其补全为相对于当前页面路径的 URL
            var str = location.protocol + "//" + location.host + location.pathname;
            var h = str.lastIndexOf("/") + 1;
            vsrca[i] = str.substring(0, h) + vsrca[i];
        }
    }
}

// 函数 sniffCnki 用于从 vsrcc 数组中移除重复的元素
function sniffCnki(vsrcc) {
    var pos = 1;
    for (var i = 0; i < vsrcc.length;) {
        pos = vsrcc.indexOf(vsrcc[i], pos);
        if (pos != -1) {
            // 如果找到重复元素，则移除它
            vsrcc.splice(pos, 1);
        } else {
            // 如果没有找到重复元素，则继续检查下一个元素
            pos = (++i) + 1;
        }
    }
}

// 函数 sniffMatch 用于根据后缀名模式匹配 vsrcm 数组中的元素，并处理 iframe 的 src 属性
function sniffMatch(vsrcm) {
    var varr = [];
    var pattern = [];
    
    // 遍历后缀名模式数组 sniffSuffixArr
    for (var i = 0; i < sniffSuffixArr.length; i++) {
        varr[i] = [];
        pattern[i] = [];
        // 遍历每个后缀名模式，创建正则表达式并添加到 pattern 数组中
        for (var j = 0; j < sniffSuffixArr[i].length; j++) {
            pattern[i][j] = new RegExp("\\" + sniffSuffixArr[i][j] + "[^A-Za-z0-9][\\s\\S]*|\\" + sniffSuffixArr[i][j] + "$", "i");
        }
    }

    var k = sniffSuffixArr.length;
    varr[k] = [];
    
    // 遍历 vsrcm 数组（除了最后一个元素），进行模式匹配
    for (var t = 0; t < vsrcm.length - 1; t++) {
        var ff = true;
        for (var i = 0; ff && i < sniffSuffixArr.length; i++) {
            for (var j = 0; j < sniffSuffixArr[i].length; j++) {
                if (pattern[i][j].test(vsrcm[t])) {
                    // 如果匹配成功，将元素添加到对应的 varr 子数组中
                    varr[i][varr[i].length] = vsrcm[t];
                    ff = false;
                    break;
                }
            }
        }
        // 将未匹配的元素添加到最后一个 varr 子数组中
        varr[k][varr[k].length] = vsrcm[t];
    }

    // 获取页面中的所有 iframe 元素，并处理其 src 属性
    var iframes = document.getElementsByTagName("IFRAME");
    for (var i = 0; i < iframes.length; i++) {
        var ifraSrc = iframes[i].src;
        if (ifraSrc != null && ifraSrc != "") {
            // 将 iframe 的 src 属性添加到第一个 varr 子数组中
            varr[0][varr[0].length] = ifraSrc;
        }
    }

    varr[k + 1] = [];
    
    // 如果 sniffSourceCode 未定义，则通过 XMLHttpRequest 获取当前页面的源代码
    if (sniffSourceCode == undefined) {
        var xmlHttp;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                sniffSourceCode = xmlHttp.responseText;
                // 将源代码和最后一个 vsrcm 元素添加到 varr 数组的最后一个子数组中
                varr[k + 1][0] = sniffSourceCode;
                varr[k + 1][1] = "<! DOCTYPE html>\n<html>\n" + vsrcm[vsrcm.length - 1] + "\n</html>";
                // 调用 sniffShow 函数显示结果
                sniffShow(varr);
            }
        };
        xmlHttp.open("GET", location.href, false);
        xmlHttp.overrideMimeType("text/html;charset=" + document.characterSet);
        xmlHttp.send();
    } else {
        // 如果 sniffSourceCode 已定义，则直接调用 sniffShow 函数显示结果
        varr[k + 1][0] = sniffSourceCode;
        varr[k + 1][1] = "<! DOCTYPE html>\n<html>\n" + vsrcm[vsrcm.length - 1] + "\n</html>";
        sniffShow(varr);
    }
}

function sniffShow(varr){var str="<script type=\"text/javascript\">";str+="var sniffListName=[];var data=[];";for(var i=0;i<varr.length;i++){str+="sniffListName["+i+"]=\""+sniffListName[i]+"\";data["+i+"]=[];";var len=varr[i].length;for(var j=0;j<len;j++){str+="data["+i+"]["+j+"]=\""+(i<varr.length-1?varr[i][j]:escape(sniffFormatHTML(varr[i][j])))+"\";";}}str+="var vbox=document.createElement(\"DIV\");vbox.style=\"float:left;position:relative;left:0px;top:10%;box-sizing:border-box;width:100%;padding:10px;border:black 5px solid;margin-bottom:20px;text-align:center;\";var vtitle=document.createElement(\"H1\");vtitle.textContent=\"资源列表\";var vcatalog=document.createElement(\"DIV\");vcatalog.style=\"float:left;box-sizing:inherit;padding:5px 0px;text-decoration:underline\";vcatalog.style.width=100/sniffListName.length+\"%\";var vcontent=document.createElement(\"DIV\");vcontent.style=\"box-sizing:inherit;width:100%;\";vcontent.id=\"content\";var va=document.createElement(\"A\");va.style=\"display:block;box-sizing:inherit;width:100%;padding:10px;border:black 5px solid;margin:10px 0px;font-size:32px;font-weight:bold;white-space:pre;overflow:hidden;text-overflow:ellipsis\";va.target=\"_blank\";var vtextarea=document.createElement(\"DIV\");vtextarea.style=\"float:left;box-sizing:inherit;resize:horizontal;height:70%;border:red 3px solid;text-align:left;white-space:pre;overflow:auto;\";vtextarea.contentEditable=true;vbox.appendChild(vtitle);document.body.appendChild(vbox);var contents=[];init();function init(){var kk;for(var i=0;i<sniffListName.length;i++){if(kk==undefined&&data[i].length>0){kk=i;}var vdiv=vcatalog.cloneNode();vdiv.id=\"catalog\"+i;vdiv.dataset.id=i;vdiv.innerHTML=\"<h2>\"+sniffListName[i]+\"<br />(\"+(i<sniffListName.length-1?data[i].length:data[i][0].length)+\")\";vdiv.onclick=function(){deBox(this.dataset.id);};if(i==sniffListName.length-1){vdiv.ontouchstart=function(){lpStart(openUrl);};vdiv.ontouchmove=lpMove;vdiv.ontouchend=lpEnd;}vbox.appendChild(vdiv);var content=vcontent.cloneNode();var len=data[i].length;if(i<sniffListName.length-1){for(var j=0;j<len;j++){var vs=va.cloneNode();vs.href=data[i][j];vs.innerHTML=data[i][j];content.appendChild(vs);}}else{for(var j=0;j<len;j++){var vs=vtextarea.cloneNode();vs.style.width=(100-(len+1)/2)/len+\"%\";if(j==0){vs.style.marginLeft=\"0.5%\";}vs.style.marginRight=\"0.5%\";vs.id=\"textarea\"+j;vs.dataset.id=j;vs.textContent=unescape(data[i][j]);vs.onclick=function(){var ele=document.getElementById(\"catalog\"+(sniffListName.length-1));ele.dataset.value=this.dataset.id;ele.innerHTML=\"<h2>\"+sniffListName[sniffListName.length-1]+\"<br />(\"+data[sniffListName.length-1][this.dataset.id].length+\")\";for(var k=0;k<len;k++){var ele=document.getElementById(\"textarea\"+k);if(k==this.dataset.id){ele.style.width=((100-(len+1)/2)/(len*len)+(100-(len+1)/2)/len*(len-1))+\"%\";}else{ele.style.width=(100-(len+1)/2)/(len*len)+\"%\";}}};content.appendChild(vs);}}contents[i]=content;}vbox.appendChild(vcontent);deBox(kk);}function deBox(t){for(var i=0;i<sniffListName.length;i++){var ele=document.getElementById(\"catalog\"+i);if(i==t){ele.style.backgroundColor=\"#ffff00\";var ele1=document.getElementById(\"content\");vbox.replaceChild(contents[i],ele1);}else{ele.style.backgroundColor=\"#ffffff\";}}}function openUrl(){var ele=document.getElementById(\"catalog\"+(sniffListName.length-1));var ele1=document.getElementById(\"textarea\"+(ele.dataset.value==undefined?0:ele.dataset.value));var win=window.open();win.document.open(\"text/html\",\"replace\");win.document.write(ele1.textContent);win.document.close();}var timeID;function lpStart(func){timeID=setTimeout(func,1000);}function lpMove(){clearTimeout(timeID);}function lpEnd(){clearTimeout(timeID);}";str+="</script>";

var win=window.open();win.document.open("text/html","replace");win.document.write("<! DOCTYPE html><html><head><title>资源列表</title><meta name=\"viewport\" content=\"width=980px,height=1443px,user-scalable=no\" />");win.document.write("</head><body>");win.document.write(str);win.document.write("</body></html>");win.document.close();}function sniffFormatHTML(code){var len=code.length;var kkk;var vcode="";for(var i=0;i*1000<len;i++){kkk=code.substring(i*1000,(i+1)*1000>len?len:(i+1)*1000);kkk=kkk.replace(/>[\r\n\t ]*/g,">");kkk=kkk.replace(/[\r\n\t ]*</g,"<");vcode+=kkk;}var result=vcode;var patt=/<(\/)?([\da-z]+)( .*?)??( *\/)?>|<(!) ?doctype html>|<(!)--.*?-->/ig;var patter=patt.exec(vcode);var blankNum=0;var length=0;var str1;var str2;var blank1;var blank2;var invalid=null;while(patter!=null){if(invalid==null){str1=result.substring(0,length+patter.index);str2=result.substring(length+patt.lastIndex);if(!sniffIsEmptyEle(patter)){if(patter[1]!=undefined){blankNum=blankNum==0?0:blankNum-1;blank1=sniffBlankGenerator(blankNum);blank2=blank1;}else{blank1=sniffBlankGenerator(blankNum);blankNum++;blank2=blank1+"\t";}}else{blank1=sniffBlankGenerator(blankNum);blank2=blank1;}result=str1+blank1+patter[0]+blank2+str2;length+=blank1.length+blank2.length;if(patter[1]==undefined&&(patter[2]=="style"||patter[2]=="script")){invalid=patter[2];}else{patter=patt.exec(vcode);}}else{patter=patt.exec(vcode);if(patter[2]==invalid){invalid=null;}}}result=result.replace(/((\r\n|\n)[\t ]*)*<! ?DOCTYPE html>/i,"<! DOCTYPE html>");return result.replace(/>\n[\t ]*\n/g,">\n");}function sniffIsEmptyEle(patt){if(patt[4]!=undefined){return true;}var ele=patt[6]!=undefined?patt[6]:(patt[5]!=undefined?patt[5]:patt[2]);ele=ele.toLowerCase();for(var i=0;i<sniffEmptyEle.length;i++){if(ele==sniffEmptyEle[i]){return true;}}return false;}function sniffBlankGenerator(t){str="";for(var i=0;i<t;i++){str+="\t";}return "\n"+str;}var menuOldInnerHeight=innerHeight;if(document.readyState=="complete"){menuOldInnerHeight=innerHeight;}else{window.addEventListener("load",function(){menuOldInnerHeight=innerHeight;});}function isMenuComputer(){if(/android|iphone/i.test(navigator.userAgent)){let eles=menuDocHead.querySelectorAll("meta[name=\"viewport\"]");for(var i=0;i<eles.length;i++){if(/width=device-width|initial-scale=1(\.0)?/i.test(eles[i].content)){return false;}}}return true;}})();