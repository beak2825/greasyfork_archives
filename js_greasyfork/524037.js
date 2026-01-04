// ==UserScript==
// @name         🦣🐘【HNTV】Plus🐾
// @namespace    https://www.tampermonkey.net/
// @version      1.0
// @description  用于hntv后台优化，仅自用，其他用户安装无用。
// @author       mystcrane
// @match        https://admin.hntv.tv/*
// @grant        GM_setClipboard
// @supportURL   https://www.tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/users/1424220-mystcrane
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/524037/%F0%9F%A6%A3%F0%9F%90%98%E3%80%90HNTV%E3%80%91Plus%F0%9F%90%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/524037/%F0%9F%A6%A3%F0%9F%90%98%E3%80%90HNTV%E3%80%91Plus%F0%9F%90%BE.meta.js
// ==/UserScript==



/* —————————— version 1.0 —————————

优化性能，减少资源占用
将循环计时器改为utationObserver监视
将settimeout封装为sleep函数
改变console.log输出样式
去空行按钮改为发稿页面添加
一键选择大象新闻来源
strong小标题一键加⭐
复制链接逻辑改为事件委托
——————————————————————————————— */

/* ————————— version 0.4  ————————

增加一键复制链接
复制链接框1.5s自动关闭
调整预览关闭按钮位置
修改img限制宽高后封面剪裁问题
——————————————————————————————— */

/*  ———————— version 0.3  ————————

视频边框改为虚线动态边框
新稿、已发布列表自动调整
列表宽度细调
右侧操作选项增加存在判断逻辑
—————————————————————————————— */

/*  ————————  version 0.2 ————————

视频彩色边框改为动态边框
去空行按钮增加适配条目
悬浮背景色、选中背景色适配升级后的后台
右侧操作选项由CSS改为JS函数，适配升级后的后台
————————————————————————————  */

/* ————————  version 0.1  ————————
【列表页】
调整列宽
标题全显
更改字体
span[lang]绿色
隐藏空白列、虚拟点击量
删除右侧固定选项
显示右侧隐藏的操作按钮
删除隐藏的重复列表
增加悬浮背景色、选中背景色

【编辑页】
更改字体
背景护眼色
缩小图片、视频占位大小
视频占位符改为显示封面+彩色边框
全屏编辑可上传图片
增加去空行按钮

【专题页】
排序图片不折行
放宽行数限制到20行
题添加稿件页左侧栏目树缩短
—————————————————————————————— */



/* —————————————————————— 主体函数  —————————————————————*/

(function () {
    'use strict';

    let url0 = window.location.href;
    log("当前url为:", `${url0}`);
    maintask();//初次执行

    // 检查URL是否变化
    function checkUrl() {
        //监控url
        let url1 = window.location.href;
        if (url1 !== url0) {
            url0 = url1;
            log("URL已改变为:", `${url1}`);
            // 在这里添加你的自定义逻辑，例如弹窗提醒
            maintask();
        }
    };

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(checkUrl);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();


/* ———————————————————————— 函数模块 —————————————————— */


//打包sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

//封装log
function log(title, detail) {
    console.log(
        `%c ${title} %c ${detail} `,
        'padding: 5px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
        'padding: 5px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
    )
};
//示例：log("标题","详情")



/* ———————————————————————— 主要函数 ———————————————————————*/
async function maintask() {
    var url = window.location.href;
    log("判断当前页面","…");
    await sleep(1000);
    if (url.indexOf("https://admin.hntv.tv/cpub/publish/docCenter") !== -1) {
        log("当前页面","稿件中心");
        removelist();
        operate();
        copy();
        cols();
    }
    if (url.indexOf("https://admin.hntv.tv/cpub/publish/docEditor") !== -1) {
        log("当前页面","编辑稿件");
        laiyuan();
        if (url.indexOf("docEditor/0") !== -1) {
            log("当前页面","图文稿件");
            ifmstyle();
            clearblank();
            star();
            ivideo();
        }
    }

};

/* ———————————————————— 发稿页面 ——————————————————————*/

//为iframe添加style
function ifmstyle() {
    let editCss = window.frames[0].document.getElementById("editCss");
    if (editCss) {
        return;
    } else {
        console.log("editCss目标不存在，创建editCss");
        var ihead = window.frames[0].document.head;
        var icss = document.createElement("style");
        icss.id = "editCss";
        icss.innerHTML = `
             .mce-content-body { max-width: 1450px !important; background:#C7EDCC }
             p,div { font-family: "Cascadia Code", "Source Han Serif SC"; }
             span { font-family: "Cascadia Code"; color: green; }
             img,video { max-width:500px; max-height:400px; }
             img:not(.mce-object) {max-width: 500px !important;}
             img.mce-object.mce-object-video {padding: 3px; border:none;
             animation: shine 30s infinite linear;
             background: repeating-linear-gradient(-45deg, transparent 0%, transparent 4px, #000 4px, green 8px);}
             @keyframes shine {0% { background-position: 0;} 100% { background-position: 0 450px;} }
        `;
        ihead.appendChild(icss);
    }
};


// 创建去空行按钮
function clearblank() {
    if (document.getElementById("cleanButton") !== null) {
        return;
    } else {
        const cleanButton = document.createElement("button");
        cleanButton.id = "cleanButton";
        cleanButton.textContent = ">_<";
        cleanButton.title = '去空行按钮';
        document.body.appendChild(cleanButton);
        //去空行函数
        [document.querySelector("div.inner-wrap > div.left > button:nth-child(1)"), document.getElementById("cleanButton")].forEach(item => {
            item.addEventListener('click', () => {
                let str = window.frames[0].document.body.innerHTML;
                str = str.replaceAll('<p>&nbsp;</p>', '');
                str = str.replaceAll('<p></p>', '');
                str = str.replaceAll('<p><br></p>', '');
                str = str.replaceAll(' class="MsoNormal"', '');
                str = str.replaceAll('<p><br data-mce-bogus="1"></p>', '');
                str = str.replaceAll('<p><span lang="EN-US">&nbsp;</span></p>', '');
                str = str.replaceAll('<p><span lang="EN-US"><o:p>&nbsp;</o:p></span></p>', '');
                window.frames[0].document.body.innerHTML = str;
            })
        });
    }
};


//一键选择来源
function laiyuan() {
    if (document.getElementById("来源btn") !== null) {
        return;
    }
    else {
        let 来源ul = document.querySelectorAll("input.el-input__inner")[3];
        let 来源btn = document.createElement("button");
        来源btn.textContent = "象";
        来源btn.id = "来源btn";
        来源btn.title = "一键选择大象新闻";
        //父级容器
        let 来源div = document.createElement("div");
        来源div.id = "来源div";
        document.querySelector("div.doc-editor > div.edit-wrap > div.edit-flex").appendChild(来源div);
        document.getElementById("来源div").appendChild(来源btn);

        来源btn.addEventListener('click', async function (event) {
            来源ul.click();
            await sleep(200);
            var ly = document.querySelectorAll("body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li");
            for (var i = 0; i < ly.length; i++) {
                if (ly[i].textContent === '大象新闻') {
                    ly[i].click();
                }
            }
        })
    }
};

//一键+⭐
function star() {
    if (document.getElementById("star") !== null) {
        return;
    } else {
        const star = document.createElement("button");
        star.id = "star";
        star.textContent = "✭";
        star.title = "一键+⭐";
        star.type = "button";
        star.style = "font-size: large; padding: 0 7px 7px 7px;";
        document.querySelector("div.tox-toolbar__group").appendChild(star);
        document.getElementById("star").addEventListener("click", () => {
            let str = window.frames[0].document.body.innerHTML;
            str = str.replaceAll('<p><strong>', '<p>⭐<strong>');
            window.frames[0].document.body.innerHTML = str;
        });
    }
};


//视频占位符改为显示封面--但不可播放
function ivideo() {
    log("查找","iframe");
    var iframe = document.querySelector("div.tox-edit-area > iframe");
    log("等待","iframe加载");
    var ifmdoc = iframe.contentDocument || iframe.contentWindow.document;
    log("获取","iframe内容");
    let nowimgs = ifmdoc.images.length;
    log("获取","img数量");
    log("运行","video显示poster");
    //函数-显示video封面，但不能播放
    function videoview() {
        ifmdoc.querySelectorAll("img.mce-object.mce-object-video").forEach(function (elem) {
            elem.setAttribute("src", elem.getAttribute("data-mce-p-poster"));
            elem.removeAttribute("width");
            elem.removeAttribute("height");
        });
    };
    videoview();//初始运行一次
    function checkimg() {
        log("检查","img数量变化");
        videoview();//每次检查都运行一次
        let newimgs = ifmdoc.images.length;
        if (newimgs !== nowimgs) {
            log(`img数量已变化`,`从 ${nowimgs} 变为 ${newimgs}`);
            nowimgs = newimgs; // 更新当前数量
        }
    };
    // 创建 MutationObserver 实例
    let observer1 = new MutationObserver(checkimg);
    // 监听 iframebody 下的所有子节点变化
    observer1.observe(ifmdoc.body, {
        childList: true,
        subtree: true
    });
    console.log('已启动监听，等待 img 数量变化...');
};


/* —————————————————— 稿件列表 —————————————————————— */


//删除重复列表
function removelist() {
    let rightlist = document.querySelectorAll(".el-table__fixed-right")[0];
    if (!rightlist) {
        return;
    } else {
        console.log("rightlist目标存在！删除…");
        document.querySelector("div.doc-list-wrap:nth-child(n+3)").remove();
        document.querySelector("div.doc-list-wrap:nth-child(n+2)").remove();
        document.querySelector("div.el-table__fixed-right").remove();
        document.querySelector("div.el-table__fixed-right-patch").remove();
    }
};


//显示右侧操作按钮
function operate() {
    var operate = document.querySelectorAll(".is-center.is-hidden.el-table__cell");
    if (operate.length == 0) {
        return;
    } else {
        operate.forEach(function (e) {
            e.classList.remove("is-hidden");
        })
    }
};



//成功复制链接提示
const copydone = document.createElement("div");
copydone.id = "copydone";
copydone.textContent = "链接已复制！";
copydone.style = "display:none";
document.body.appendChild(copydone);

//复制链接自动关闭
function copy() {
    log("一键复制链接","函数加载成功");
    // 事件委托--监听表格点击事件
    document.querySelector("table.el-table__body").addEventListener('click', async function(event) {
        log("点击","复制链接");
        // 检查点击的目标是否是 span 元素
        if (event.target.tagName.toLowerCase() === 'i') {
            // 获取 span 元素的父元素（td）
            var cell = event.target.closest('td');
            if (cell) {
                // 获取单元格所在的列索引（从 0 开始）
                const cellIndex = cell.cellIndex;
                // 检查是否是第 8 列（索引为 7）
                if (cellIndex === 7) {
                    await sleep(150);
                    //稿件链接
                    var link = document.querySelector("div.doc-list div.right > div.copy > a").getAttribute('href');
                    GM_setClipboard(link);
                    //显示复制提示
                    document.getElementById("copydone").style = "display:''";
                    await sleep(1500);
                    //寻找关闭按钮
                    var close = document.querySelector("div.doc-list > div:nth-child(3) > div > div.el-dialog__footer > span > button");
                    //关闭复制提示，关闭对话框
                    document.getElementById("copydone").style = "display:none";
                    close.click();
                    log("关闭","复制链接对话框");
                }
            }
        }
    });
};



//创建liststyle--不在主函数，开局即运行
let css = document.createElement("style");
css.id = "listCss";
setTimeout(() => {
    document.getElementById("app").appendChild(css);
}, 1000);
css.innerHTML = `
            #cleanButton {
                width: 45px;
                height: 45px;
                color: white;
                left: 5px;
                bottom: 45%;
                z-index:9990;
                position: fixed;
                border: none;
                background-color: chocolate;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 3px 5px 8px rgba(0, 0, 0, 0.5);
            }

            #来源btn {
                position: relative;
                cursor: pointer;
                right: 30px;
                top: 400px;
                color: white;
                background-color: #2b9cff;
                border-radius: 20%;
                border: none;
            }

            /* 字体 */
                p, p>span, input, .cell.el-tooltip {
                font-family: "Cascadia Code";
                }
                span[lang] { color: green; }

            /* 预览图片、视频缩小 */
                p img,.preview-container .body[data-v-b7ff5510] img{
                    max-width: 600px!important;
                    max-height: 500px !important;
                }
                video {
                    min-height: 300px !important;
                    max-height: 500px !important;
                }


            /* 预览关闭按钮 */
                div.preview-wrap div.close > button {
                position:fixed!important;
                top:50% !important;
                }


            /* 全屏编辑可上传图片 */
                div.el-select-dropdown.el-popper {
                    z-index:2002 !important
                    }
                div.el-message-box__wrapper {
                    z-index: 2001 !important;
                }
                div.edit-flex>div.center div.el-dialog__wrapper {
                    z-index: 2000 !important;
                }

            /*第3列标题文字宽度+换行 */
                div.doc-list td:nth-child(3)>div {
                    width: auto !important;
                    white-space: pre-wrap !important;
                }

            /*除标题外其他单元格不换行*/
                .cell {
                    white-space: nowrap !important;
                    padding-left: 5px !important;
                    padding-right: 1px !important;
                }
                .el-table th>.cell {
                    text-overflow:unset;
                }


            /* 悬浮背景色 */
                .el-table__row.hover-row>td,
                .el-table__row.hover-row.current-row>td,
                .el-table__row.hover-row.el-table__row--striped>td,
                .el-table__row.hover-row.el-table__row--striped.current-row>td {
                    background-color: rgb(240, 200, 140) !important;
                }

            /* 选中背景色 */
                .el-table__row.current-row td,
                .el-table__row.el-table__row--striped.current-row td {
                    background-color: rgba(204, 164, 227, 0.40) !important;
                }


            /*稿件id输入框缩短*/
                div.doc-search>form>div:nth-child(1)>div:nth-child(2)>div>div {
                    width: 150px!important;
                }


            /* 专题内列表框架 - 第一个为框架，第二个为框架内列表 */
                div.edit-flex>div.center div.tag-docs>div:nth-child(2),
                div.edit-flex>div.center div.tag-docs>div:nth-child(2)>div:nth-child(3) {
                    min-height: 600px !important;
                /*内联style设置了max-height，用min-height覆盖*/
                    max-height: 1000px !important;
                /*当列表长于min时可增长覆盖*/
                }

            /* 专题页删除按钮缩短 */
                button.el-button--danger.el-button--mini {
                    width: 30px;
                }

            /* 专题添加稿件页左侧栏目树缩短 */
                .tree {
                    flex: 0 0 200px;
                    max-width: 200px;
                }


            /* css改变list列宽  */
                div.doc-list col:nth-child(1) { width: 40px !important}
                div.doc-list col:nth-child(2) { width: 60px !important}
                div.doc-list col:nth-child(3) { width: 330px !important}
                div.doc-list col:nth-child(4) { display:none !important}
                div.doc-list th:nth-child(4) { display:none !important}
                div.doc-list td:nth-child(4) { display:none !important}

            /* 复制链接提示 */
                #copydone {
                    position: absolute; left: 40%; top: 41%; z-index: 3000;
                    padding: 5px 10px; border-radius: 3px; background: #42c02e;
                    color: #fff; letter-spacing: 3px; font-weight: bold;
                    animation: opacity 1.5s;
                }
                @keyframes opacity {
                      0% { opacity:0 }
                      50% { opacity:1 }
                      100% { opacity:1 }
                    }

            `;//css结束



//默认
var colstyle0 = `
                div.doc-list col:nth-child(5) { width: 90px !important}
                div.doc-list col:nth-child(6) { width: 80px !important}
                div.doc-list col:nth-child(7) { width: 45px !important}
                div.doc-list col:nth-child(8) { width: 60px !important}
                div.doc-list col:nth-child(9) { width: 60px !important}
                div.doc-list col:nth-child(11) { display:none !important}
                div.doc-list th:nth-child(11) { display:none !important}
                div.doc-list td:nth-child(11) { display:none !important}
                div.doc-list col:nth-child(10) { width: 70px !important}
                div.doc-list col:nth-child(12) { width: 70px !important}
                div.doc-list col:nth-child(13) { width: 70px !important}
                div.doc-list col:nth-child(14) { width: 70px !important}
                div.doc-list col:nth-child(15) { width: 70px !important}
                div.doc-list col:nth-child(16) { width: 250px !important}
                div.doc-list col:nth-child(17) { width: 200px !important}
                `;


//新稿、待发布
var colstyle1 = `
                div.doc-list col:nth-child(5) { width: 90px !important}
                div.doc-list col:nth-child(6) { width: 80px !important}
                div.doc-list col:nth-child(7) { width: 45px !important}
                div.doc-list col:nth-child(8) { width: 60px !important}
                div.doc-list col:nth-child(9) { width: 60px !important}
                div.doc-list col:nth-child(10) { width: 70px !important}
                div.doc-list col:nth-child(11) { width: 70px !important}
                div.doc-list col:nth-child(12) { width: 70px !important}
                div.doc-list col:nth-child(13) { width: 250px !important}
                div.doc-list col:nth-child(14) { width: 180px !important}
                `;

//融合号已发布，有审核状态
var colstyle3 = `
                div.doc-list col:nth-child(5) { width: 60px !important}
                div.doc-list col:nth-child(6) { width: 90px !important}
                div.doc-list col:nth-child(7) { width: 80px !important}
                div.doc-list col:nth-child(8) { width: 45px !important}
                div.doc-list col:nth-child(9) { width: 60px !important}
                div.doc-list col:nth-child(10) { width: 60px !important}
                div.doc-list col:nth-child(12) { display:none !important}
                div.doc-list th:nth-child(12) { display:none !important}
                div.doc-list td:nth-child(12) { display:none !important}
                div.doc-list col:nth-child(11) { width: 70px !important}
                div.doc-list col:nth-child(13) { width: 70px !important}
                div.doc-list col:nth-child(14) { width: 70px !important}
                div.doc-list col:nth-child(15) { width: 70px !important}
                div.doc-list col:nth-child(16) { width: 70px !important}
                div.doc-list col:nth-child(17) { width: 250px !important}
                div.doc-list col:nth-child(18) { width: 250px !important}
                `;

//调整col列宽
function cols() {

    //获取col数量
    var colgroup = document.getElementsByTagName("colgroup")[1].getElementsByTagName("col");
    var colcss = document.createElement("style");
    var colcss0 = document.getElementById("colcss0");
    var colcss1 = document.getElementById("colcss1");
    var colcss3 = document.getElementById("colcss3");

    //默认
    if (colgroup.length == 17) {

        if (colcss0) {
            return;
        } else {
            console.log("colcss0不存在，创建colcss0…");
            colcss.id = "colcss0";
            colcss.innerHTML = colstyle0;
        }
    } else {
        if (colcss0) {
            console.log("删除colcss0…");
            colcss0.remove();
        }
    };

    //新稿、待发布
    if (colgroup.length == 14) {
        if (colcss1) {
            return;
        } else {
            console.log("colcss1不存在，创建colcss1…");
            colcss.id = "colcss1";
            colcss.innerHTML = colstyle1;

        }
    } else {
        if (colcss1) {
            console.log("删除colcss1…");
            colcss1.remove();
        }
    };

    //融合号带审核
    if (colgroup.length == 18) {
        if (colcss3) {
            return;
        } else {
            console.log("colcss3不存在，创建colcss3…");
            colcss.id = "colcss3";
            colcss.innerHTML = colstyle3;

        }
    } else {
        if (colcss3) {
            console.log("删除colcss3…");
            colcss3.remove();
        }
    };

    document.getElementById("app").appendChild(colcss);

};




