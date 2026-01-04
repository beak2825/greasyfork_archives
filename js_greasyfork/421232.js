// ==UserScript==
// @name        导出动漫之家订阅漫画到Tachiyomi漫画阅读器
// @namespace   https://i.dmzj1.com//subscribe
// @match       https://i.dmzj.com//subscribe
// @match       https://i.dmzj1.com//subscribe
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @version     1.0
// @author      芜湖
// @description 打开指定网址：https://i.dmzj1.com//subscribe，登录动漫之家账号后，点击浏览器工具栏的用户脚本管理器图标，点击“开始导出动漫之家订阅”，或复制该脚本的所有内容，粘贴到浏览器控制台输入框，回车开始运行。
// @downloadURL https://update.greasyfork.org/scripts/421232/%E5%AF%BC%E5%87%BA%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%AE%A2%E9%98%85%E6%BC%AB%E7%94%BB%E5%88%B0Tachiyomi%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421232/%E5%AF%BC%E5%87%BA%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%AE%A2%E9%98%85%E6%BC%AB%E7%94%BB%E5%88%B0Tachiyomi%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

/*

导出动漫之家订阅漫画到[Tachiyomi漫画阅读器](https://tachiyomi.org/)
==
- 该脚本可在浏览器控制台或Violentmonkey、Tampermonkey等用户脚本管理器中运行。
- 用户脚本管理器：在用户脚本管理器内安装此脚本后，打开指定网址：https://i.dmzj1.com//subscribe，登录动漫之家账号后，点击浏览器工具栏的用户脚本管理器图标，点击“开始导出动漫之家订阅”即可运行此脚本。
- 控制台：打开指定网址：https://i.dmzj1.com//subscribe ，登录动漫之家账号后，复制该脚本的所有内容，粘贴到浏览器控制台输入框，回车开始运行。
- 导入tachiyomi：在 tachiyomi设置 → 备份 中点击“还原备份”，选择此脚本导出的JSON备份文件即可开始导入。

说明
--
- 一次性导出过多漫画到tachiyomi书架内会对你查找原有的书架条目带来不便，同时也会严重拖慢tachiyomi更新书架的速度，
    因此该脚本默认会把动漫之家导出的漫画放到名为"动漫之家备份"的书架分类下，你可以通过修改此脚本的代码来指定导出时使用的分类名称。
- 不需要提前在tachiyomi中创建该分类，导入时会自动创建。
- 导入tachiyomi后，建议在 tachiyomi设置 → 书架 中调整“默认分类”和“全局更新时包含的分类”：
    - 新加入书架的漫画会自动放入“默认分类”，不需要每次加入书架时手动选择。
    - “全局更新时包含的分类”，~~建议把“动漫之家备份”排除在外~~，请自行考虑，虽然漫画条目过多会严重拖慢更新书架的速度，但是导入JSON备份文件时会把原来就已经加入了书架，而且也存在于导出的JSON备份文件中的任何<strong>未分类的动漫之家漫画条目</strong>移到此脚本创建的"动漫之家备份"的书架分类下，如果你将“动漫之家备份”从“全局更新时包含的分类”中排除，那么你将需要每次都手动切换到“动漫之家备份”分类来更新这些漫画条目。
    - 当需要更新某个分类下的漫画条目时，在书架页面点击画面顶部的选择栏，选中某个分类后，在靠近屏幕中间做出下拉手势即可。

*/

(function () {
    try {
        if (GM_registerMenuCommand) {
            GM_registerMenuCommand("开始导出动漫之家订阅", exportToTachiyomi);
        }
    } catch (error) {
        exportToTachiyomi();
    }

    function exportToTachiyomi() {
        //--可自行修改---------------------------------------
        let categorieName = "动漫之家备份"; //指定分类名称，漫画会导出到这个分类下
        //-------------------------------------------------

        if (!(window.location.host.startsWith("i.dmzj"))) {
            console.log("网址错误：" + window.location.href);
            return;
        }

        // replaceAll 兼容性补丁
        if (!String.prototype.replaceAll) {
            String.prototype.replaceAll = function (str, newStr) {
                // If a regex pattern
                if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
                    return this.replace(str, newStr);
                }
                // If a string
                return this.replace(new RegExp(str, 'g'), newStr);
            };
        }

        let mangaList = new Map();
        let nodelist = document.querySelectorAll("#my_subscribe_id .dy_content_li");
        nodelist.forEach(element => {
            let name = element.querySelector("h3").textContent;
            let cid = element.querySelector("a.qx").getAttribute("value");
            mangaList.set(cid, name);
        });
        console.log("找到" + mangaList.size + "个订阅");

        class TachiyomiManga {
            constructor(name, cid) {
                this.manga = [
                    "/comic/comic_" + cid + ".json?version\u003d2.7.019",   //网址
                    name,                                                   //漫画名
                    "2884190037559093788",                                  //动漫之家插件识别ID
                    0,
                    0
                ]
                this.categories = [
                    categorieName,                                          //导出到特定分类
                ]
            }
        }

        let tachiyomiMangaList = {
            "version": 2,
            "mangas": [],
            "categories": [
                [
                    categorieName,
                    0
                ]
            ],
            "extensions": [
                "2884190037559093788:动漫之家"
            ]
        }

        mangaList.forEach((value, key, map) => {
            const m = new TachiyomiManga(value, key);
            tachiyomiMangaList.mangas.push(m);
        })
        let json = JSON.stringify(tachiyomiMangaList);
        json = json.replaceAll('"2884190037559093788"', '2884190037559093788');

        //保存成文件
        let elementA = document.createElement('a');
        elementA.download = "dmzj_export_to_tachiyomi_" + (new Date().toLocaleString()) + ".json";
        elementA.style.display = 'none';

        let blob = new Blob([json]);
        elementA.href = URL.createObjectURL(blob);
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA);
    }
})();
