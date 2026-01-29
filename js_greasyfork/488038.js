// ==UserScript==
// @name         Feedly 优化
// @homepage     https://greasyfork.org/zh-CN/scripts/488038
// @namespace    https://feedly.com
// @version      2026.01.28
// @description  一些优化
// @author       Ejin
// @match        https://feedly.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488038/Feedly%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488038/Feedly%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 2025.03.29 简化左侧菜单，优化历史代码。
// 2025.03.06 屏蔽某些关键词的内容。
// 2025.02.25 消灭新特性提醒窗口(What's new，并且为漂浮状态)
// 2024.08.10 优化左侧UI，将上方无用导航链接移至下方
// 2024.07.14 弱化存档分类的加粗，隐藏未读数。
// 2024.02.23 First-read，跳转到第一个已读项
(function () {
'use strict';

//1.route 持续重复运行
setInterval(() => {
    // 1.1 First-read
    if (location.href.indexOf("feedly.com/i/subscription/feed") != -1) {
        if (document.querySelector(".count-followers") != null
            && document.querySelector(".count-followers").parentElement.parentElement.innerHTML.indexOf("First-read") == -1) {
            //开始匿名函数，一次性增加First-read链接并设置事件。
            (() => {
                document.querySelector(".count-followers").parentElement.parentElement.appendChild(document.createElement('span')).className = 'First-read-span';
                document.querySelector(".First-read-span").innerHTML = "<a href='javascript:;' id='First-read' style='color:#9e9e9e;'>First-read</a>";
                //统一格式
                document.querySelector(".First-read-span").className += " " + document.querySelector(".First-read-span").parentElement.children[0].className;
                //增加First-read链接后，为它赋予事件。
                document.querySelector("#First-read").addEventListener('click', () => {
                    //事件开始，隐藏First-read链接，设置工作标志。
                    document.querySelector("#First-read").parentElement.remove();
                    document.querySelector("article").setAttribute("auto_roll_page", "1");//正在自动滚动标志，切换其他RSS会自动消失
                    //隐藏链接后，开始自动滚动页面，开启计时器函数
                    ((/*setInterval*/ setInterval_index) => {
                        setInterval_index = setInterval(() => {
                            if (document.querySelector("article[auto_roll_page]") == null) {
                                //标志消失则停止滚动操作并退出
                                clearInterval(setInterval_index);
                                return;
                            }
                            //操作页面
                            if (document.querySelectorAll(".EntryTitleLink").length > 0 || document.querySelectorAll(".entry--read").length > 0) {
                                if (!document.querySelector(".entry--read")) {
                                    //未发现已读的内容，继续滚动页面
                                    document.querySelectorAll(".EntryTitleLink")[document.querySelectorAll(".EntryTitleLink").length - 1].scrollIntoView();
                                } else {
                                    //发现已读内容，停止滚动。并将未读内容放在合适位置
                                    document.querySelector('#feedlyFrame').scrollBy(0, -1000);//向上滚动
                                    document.querySelector(".entry--read").scrollIntoView();//滚动到第一个已读内容
                                    document.querySelector('#feedlyFrame').scrollBy(0,
                                        200 - document.querySelector('#feedlyFrame').clientHeight
                                    );//再往回滚动一点，即能看到一部分未读内容
                                    document.querySelector("article[auto_roll_page]").removeAttribute("auto_roll_page");//清理
                                    clearInterval(setInterval_index);//清理
                                }
                            }//结束页面操作
                        }, 1000);
                    })();//滚动计时器函数结束
                });//事件定义结束
            })();//整体匿名函数结束
        }//判断是否需要增加First-read链接，并确认页面是否准备好
    } //end First-read
    // 1.2 待增加
}, 500);//end 1.route

// 2 重复运行
// 2.1.点击、标记已读自动跳到returnALL后返回ALL页面
setInterval(() => {
    if (document.querySelector("#header-title") && document.querySelector("#header-title").innerText == "returnALL") {
        //文件夹和RSS有区别，如果进的是RSS会有一个链接，所以用innerText获取是通用的
        document.querySelectorAll("span").forEach(ele => {
            if (ele.innerHTML == "All") {
                ele.click();
            }
        });
    }
}, 1500);// end 跳到returnALL后返回ALL页面

// 2.2 清理列表、全文中标题的绿色广告
setInterval(() => {
    document.querySelectorAll('.InterestingMetadataWrapper--separator-right:not([blocked="1"]) , .EntryMetadataSeparator:not([blocked="1"])').forEach(ele => {
        ele.setAttribute("style", "height: 1px;width:1px; overflow: hidden;display:block;");
        ele.setAttribute("blocked", "1"); //检查过要打标签避免重复检查
        //console.log(ele);
    })
}, 1500);//end 清理列表、全文中标题的绿色广告

//清理右侧顶栏的升级按钮。
((setInterval_index, timecount = 1) => {
    setInterval_index = setInterval(() => {
        if (document.querySelector("#topHeaderBarFX button")) {
            if (document.querySelector("#topHeaderBarFX button").innerHTML.indexOf("Upgrade") != -1) {
                document.querySelector("#topHeaderBarFX button").parentElement.setAttribute("style", "height: 1px;width:1px; overflow: hidden;display:block;");
                clearInterval(setInterval_index);
            }
        }
        if (timecount == 30) { clearInterval(setInterval_index); } timecount++;
    }, 2000);
})(); //end 内容标题广告和顶部升级按钮

// 2.3 屏蔽某些关键词的内容(多个关键词用+号连接)。
var ADKeywords = ['总结', "Joe's Talk", '[写周报]', '[推广]', '[投资]', '[VXNA]', '[Faucet]', '[PRO]', '[Solana]', '万 0.85 免 5', '万 0.85 免五', '万 0.5 免五', '免 5', '免五', '免七', '生日', '靓号', 'XXL-', 'Pagespy', '老兵', '龟男', '龟龟', '🐢', '女朋友', '老婆', '女方', '岳父', '丈母娘', '屎', '大便', '小便', '尿'].map(item => item.toLowerCase());
setInterval(() => {
    if (location.href.indexOf("v2ex") == -1) {
        return;
    }
    document.querySelectorAll('article:not([scriptcheckkeyword="1"])').forEach(article => {
        article.setAttribute("scriptcheckkeyword", "1"); //检查过要打标签避免重复检查
        var articleContent = article.textContent.toLowerCase();
        // 检查是否包含关键词
        var hasKeyword = ADKeywords.some(keyword => {
            if (keyword.includes("+")) {
                return keyword.split("+").every(word => articleContent.includes(word));
            } else {
                return articleContent.includes(keyword);
            }
        });
        // 如果包含关键词，则隐藏并添加属性
        if (hasKeyword) {
            article.setAttribute("style", "position: fixed;top:1px; left: 1px; height: 1px;width:1px; overflow: hidden;display:block;");
        }
    });
}, 3000);//屏蔽带有关键字的内容

// 2.4 待增加

// 3 不重复运行
// 3.1 弱化存档分类，隐藏未读数。
((setInterval_index, timecount = 1) => {
    setInterval_index = setInterval(() => {
        if (document.querySelector('button[aria-label^="Mark 存档"')) {
            if (document.querySelector('button[aria-label^="Mark 存档"').style.opacity == "") {
                // 寻找存档文件夹的最上层元素，目的是设置透明，鼠标移动过去时取消透明
                var parEle = document.querySelector('button[aria-label^="Mark 存档"]');
                while (1) {
                    parEle = parEle.parentElement;
                    if (parEle.innerHTML.indexOf(">存档<") != -1) {
                        break;
                    }
                }
                //通过透明隐藏未读数
                parEle.onmouseover = () => {
                    document.querySelector('button[aria-label^="Mark 存档"').style.opacity = "1";
                };
                parEle.onmouseout = () => {
                    document.querySelector('button[aria-label^="Mark 存档"').style.opacity = "0.2";
                };
                parEle.onmouseout();
                // 顺便隐藏掉returnALL类别的未读数
                document.querySelector('button[aria-label^="Mark returnALL"').style.display = "none";
                clearInterval(setInterval_index);
            }
        }
        if (timecount == 30) { clearInterval(setInterval_index); } timecount++;
    }, 2000);
})(); //end 弱化存档分类

// 3.2 简化左侧 UI，无用导航菜单全部隐藏
((setInterval_index, timecount = 1) => {
    setInterval_index = setInterval(() => {
        if (document.querySelector(".LeftnavSection")
            && document.querySelector(".LeftnavSection").parentElement.innerHTML.indexOf(">Integrations &amp; API<") != -1) {
            setTimeout(() => {
                //判断最后一个菜单组已经加载，再演示一点时间，才开始隐藏不会报错。
                var menukeyword = [">Today<", ">Read Later<", ">Integrations &amp; API<"];
                document.querySelectorAll(".LeftnavSection").forEach(ele => {
                    menukeyword.forEach(word => {
                        if (ele.innerHTML.indexOf(word) != -1) {
                            ele.setAttribute("style", "display:none;");
                            ele.setAttribute("nemuhide", "1");
                        }
                    });
                });
                //隐藏左侧上方的显示用户信息和子菜单
                document.querySelector(".LeftnavProfileItem").setAttribute("style", "display:none;");
                document.querySelector(".LeftnavProfileItem").setAttribute("nemuhide", "1");
                //增加显隐菜单组的操作功能
                document.querySelector(".LeftnavSection").parentElement.appendChild(document.createElement('div')).className = 'menu_showhide';
                document.querySelector(".menu_showhide").innerText = "显示/隐藏菜单组";
                document.querySelector(".menu_showhide").addEventListener('click', () => {
                    document.querySelectorAll("div[nemuhide]").forEach(ele => {
                        ele.style.display = ele.style.display == "none" ? "block" : "none";
                    })
                });
            }, 500); //延迟执行结束
            clearInterval(setInterval_index);
        } //结束判断已准备好菜单
        if (timecount == 120) { clearInterval(setInterval_index); } timecount++;
    }, 300);
})();//end 优化左侧 UI

//3.3 消灭新特性提醒窗口(What's new，并且为漂浮状态)
((setInterval_index, timecount = 1) => {
    setInterval_index = setInterval(() => {
        if (document.querySelector(".AppDockedPopups")) {
            if (document.querySelector(".AppDockedPopups").innerHTML.indexOf("What's new") != -1) {
                document.querySelector(".AppDockedPopups").querySelector("button").click();
            }
        }
        if (timecount == 200) { clearInterval(setInterval_index); } timecount++;
    }, 300);
})(); //end

// 3.4 待增加

})(); //end all