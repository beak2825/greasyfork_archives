// ==UserScript==
// @name         YouTube不重看
// @namespace    蒋晓楠
// @version      20250909
// @description  删除首页看过一定进度的视频，只会记录最大进度，仅对以新窗口打开的页面有效，ctrl+i可导入记录
// @author       蒋晓楠
// @license      MIT
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/473344/YouTube%E4%B8%8D%E9%87%8D%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473344/YouTube%E4%B8%8D%E9%87%8D%E7%9C%8B.meta.js
// ==/UserScript==
//单位秒
const 清理视频记录延时 = 30;
//0到100的整数
const 清理视频记录几率 = 2;
//单位秒
const 移除视频间隔 = 1;

//以下不懂的不要修改
function 修改配置(键, 值) {
    GM_setValue("配置:" + 键, 值);
}

function 获取配置(键, 默认值) {
    return GM_getValue("配置:" + 键, 默认值);
}

function 获取当前时间() {
    return parseInt((new Date().getTime() / 86400000).toString());
}

function 获取视频数据() {
    return GM_getValue("数据", {});
}

function 设置视频数据(数据) {
    GM_setValue("数据", 数据);
}

function 获取移除百分比() {
    return 获取配置("移除百分比", 90);
}

function 设置移除百分比(值) {
    修改配置("移除百分比", parseInt(值))
}

function 获取有效天数() {
    return 获取配置("有效天数", 180);
}

function 设置有效天数(值) {
    修改配置("有效天数", parseInt(值))
}

function 获取视频记录进度(标识符) {
    let 视频 = 获取视频数据()[标识符];
    return 视频 === undefined ? 0 : 视频.百分比;
}

function 设置视频记录进度(标识符, 进度) {
    let 所有视频 = 获取视频数据();
    所有视频[标识符] = {百分比: 进度, 有效期: 获取新的过期时间()};
    设置视频数据(所有视频);
}

function 清理视频记录进度() {
    let 当前时间 = 获取当前时间();
    let 所有视频 = 获取视频数据();
    for (const 键 in 所有视频) {
        if (所有视频[键].有效期 < 当前时间) {
            delete 所有视频[键];
        }
    }
    设置视频数据(所有视频);
    console.log("已清理过期的播放记录");
}

function 获取新的过期时间() {
    return 获取当前时间() + 获取有效天数();
}

function 获取视频标识符(Url) {
    return Object.fromEntries((new URL(Url)).searchParams).v;
}

function 初始化首页() {
    let 移除阈值 = 获取移除百分比();
    setInterval(() => {
        document.querySelectorAll("ytd-rich-item-renderer:not(.JXNProcessed)").forEach((项) => {
            项.classList.add("JXNProcessed");
            //能用完事就别管写法标不标准了
            let Link = 项.__shady_native_querySelector("#content [class*=content-id-] a")
            if (Link !== null) {
                let 百分比 = 获取视频记录进度(获取视频标识符(Link.href));
                if (百分比 >= 移除阈值) {
                    console.log("删除[" + 项.querySelector(".yt-core-attributed-string").textContent + "]进度" + 百分比);
                    //用隐藏代替删除,因为删除了还会重新在原位置出现
                    项.style.display = "none";
                }
            }
        });
    }, 移除视频间隔 * 1000);
}


function 初始化视频页() {
    let 标识符 = 获取视频标识符(location.href);
    let 原进度 = 获取视频记录进度(标识符);
    let 视频元素 = document.querySelector(".video-stream.html5-main-video");
    //等待直到视频元素正确加载
    let 间隔检测 = setInterval(function () {
        if (!isNaN(视频元素.duration)) {
            clearInterval(间隔检测);
            let 持续时间 = 视频元素.duration;
            console.log("原进度", 原进度, "总时间", 持续时间);
            视频元素.ontimeupdate = () => {
                let 当前进度 = parseInt((视频元素.currentTime / 持续时间 * 100).toFixed());
                if (当前进度 > 原进度) {
                    console.log("新进度", 当前进度);
                    设置视频记录进度(标识符, 当前进度);
                    原进度 = 当前进度;
                }
            }
            视频元素.ended = () => {
                if (原进度 !== 100) {
                    设置视频记录进度(标识符, 100);
                }
            }
        }
    }, 1000);
}

function 初始化导入() {
    let 导入文件 = GM_addElement("input", {
        type: "file",
        hidden: true,
        accept: "application/json"
    });
    导入文件.onchange = () => {
        if (导入文件.files.length > 0) {
            let JsonList = 导入文件.files[0];
            let Reader = new FileReader();
            Reader.onload = (Result) => {
                try {
                    设置视频数据(JSON.parse(Result.target.result));
                    alert("导入完成");
                } catch (e) {
                    alert("读取的文件格式不正确");
                }
            };
            Reader.readAsText(JsonList);
        }
    };
    window.onkeydown = (e) => {
        if (e.ctrlKey && e.key === "i") {
            if (confirm("导入记录将会覆盖当前数据,是否继续?")) {
                导入文件.click();
            }
        }
    };
}

function 显示信息() {
    setTimeout(() => {
        console.log("当前时间", 获取当前时间());
        console.log("所有记录", 获取视频数据());
    }, 1000);
}

function 数据迁移() {
    //本来想获取版本号，可能是我用了去广告扩展导致GM_info用不了，那么就只能硬写了
    let 旧数据 = GM_getValue("Data");
    if (旧数据 !== undefined) {
        //配置
        设置移除百分比(GM_getValue("Config:RemovePercent", 90));
        设置有效天数(GM_getValue("Config:Duration", 180));
        //数据
        let 数据 = GM_getValue("Data"), 新数据 = {};
        //遍历每个数据，重新填充键值
        for (const 标识符 in 数据) {
            let 视频数据 = 数据[标识符];
            新数据[标识符] = {百分比: 视频数据.Percent, 有效期: 视频数据.Expire};
        }
        设置视频数据(新数据);
        GM_deleteValue("Config:RemovePercent");
        GM_deleteValue("Config:Duration");
        GM_deleteValue("Data");
        console.log("数据迁移完成");
    }
}

function 运行() {
    GM_registerMenuCommand("设置移除百分比", () => {
        let 移除百分比 = prompt("达到这个的才会删除", 获取移除百分比());
        if (移除百分比 !== null) {
            设置移除百分比(移除百分比);
        }
    });
    GM_registerMenuCommand("设置记录进度有效天数", () => {
        let 天数 = prompt("设置记录视频播放进度有效天数，超过这个时间的记录会被删除", "180");
        if (天数 !== null) {
            设置有效天数(天数);
        }
    });
    GM_registerMenuCommand("导出记录", () => {
        let 导出 = document.createElement("a");
        导出.download = "Youtube不重看.json";
        导出.href = URL.createObjectURL(new Blob([JSON.stringify(获取视频数据())]));
        导出.click();
    });
    初始化导入();
    setTimeout(() => {
        if (1 + Math.round(Math.random() * 99) <= 清理视频记录几率) {
            清理视频记录进度();
        }
    }, 清理视频记录延时 * 1000);
    显示信息();
    location.pathname === "/watch" ? 初始化视频页() : 初始化首页();
}

数据迁移();
运行();