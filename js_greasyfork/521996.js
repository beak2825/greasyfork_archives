// ==UserScript==
// @name bilibili时间线筛选——分组查看b站动态（布局优化版，原脚本作者hi94740）
// @namespace GZ2000COM
// @author GZ2000COM
// @version 2.0.3.3
// @license MIT
// @description 此脚本是在作者hi94740的脚本基础上作了一点点布局上的优化，这个脚本能帮你通过关注分组筛选b站时间线上的动态
// @icon https://www.bilibili.com//favicon.ico
// @include https://t.bilibili.com/*
// @run-at document-idle
// @noframes
// @grant unsafeWindow
// @grant GM.getResourceUrl
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require https://cdn.jsdelivr.net/npm/vant@2.8/lib/vant.min.js
// @resource css https://cdn.jsdelivr.net/npm/vant@2.8/lib/index.css
// @downloadURL https://update.greasyfork.org/scripts/521996/bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E7%AD%9B%E9%80%89%E2%80%94%E2%80%94%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81%EF%BC%88%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%8C%E5%8E%9F%E8%84%9A%E6%9C%AC%E4%BD%9C%E8%80%85hi94740%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521996/bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E7%AD%9B%E9%80%89%E2%80%94%E2%80%94%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81%EF%BC%88%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%8C%E5%8E%9F%E8%84%9A%E6%9C%AC%E4%BD%9C%E8%80%85hi94740%EF%BC%89.meta.js
// ==/UserScript==

if (document.URL == "https://t.bilibili.com/" || document.URL.startsWith("https://t.bilibili.com/?")) {

    var vmTab;
    var vmBWList;
    var validTagIDs;
    var tagged;
    var selectedUp;
    var cardObserver;
    var tabObserver;

    const darkStyle = '<style id="btf-dark-style" type="text/css">\
.van-collapse{background-color:#444!important}\
.van-cell__title{color:white!important}\
.van-switch__node{background-color:#444!important}\
.van-checkbox__label{color:white!important}\
.van-tab{color:#aaa!important}\
.van-tabs__nav{background-color:#444!important}\
.van-tab.van-tab--active{color:#00aeec!important}\
</style>';

    // 新增的用于存放dark模式状态的变量，初始设为false表示非dark模式
    //let isDarkMode = false;
    let isDarkMode = localStorage.getItem('isDarkMode') === 'true';

    if (isDarkMode) {
    document.head.appendChild(document.createRange().createContextualFragment(darkStyle));
} else {
    const darkStyleElement = document.getElementById('btf-dark-style');
    if (darkStyleElement) {
        darkStyleElement.remove();
    }
}

    // 新增的创建dark模式切换按钮的函数
    function createDarkModeSwitchButton() {
        const switchButton = document.createElement('button');
        switchButton.id = 'dark-mode-switch';
        switchButton.className = 'bili-dyn-sidebar__btn';
        switchButton.textContent = '暗黑模式';
        switchButton.style.border = 'none';
        switchButton.addEventListener('click', toggleDarkMode);

        // 设置一个延时函数，等待目标元素加载完成后再执行插入按钮操作
    const waitForElementAndInsertButton = () => {
        const interval = setInterval(() => {
            const biliDynSidebar = document.querySelector('.bili-dyn-sidebar');
            if (biliDynSidebar) {
                const firstChild = biliDynSidebar.firstChild;
                if (firstChild) {
                    biliDynSidebar.insertBefore(switchButton, firstChild);
                } else {
                    biliDynSidebar.appendChild(switchButton);
                }
                clearInterval(interval);  // 插入完成后清除定时器
            }
        }, 100);  // 每隔100毫秒检查一次元素是否加载完成，可根据实际情况调整这个时间间隔
    };

        // 根据当前的dark模式状态设置按钮的文本内容，直观展示当前模式
    if (isDarkMode) {
        switchButton.textContent = '暗黑模式';
    } else {
        switchButton.textContent = '明亮模式';
    }
       // 获取.bili-dyn-sidebar元素，确保其存在后插入按钮到其内部第一个子元素位置
    const biliDynSidebar = document.querySelector('.bili-dyn-sidebar');
    if (biliDynSidebar) {
        const firstChild = biliDynSidebar.firstChild;
        if (firstChild) {
            biliDynSidebar.insertBefore(switchButton, firstChild);
        } else {
            biliDynSidebar.appendChild(switchButton);
        }
    }
}

// 新增的切换dark模式的函数
function toggleDarkMode() {
    isDarkMode =!isDarkMode;
    // 将当前的dark模式状态保存到localStorage中
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    if (isDarkMode) {
        const darkStyleElement = document.getElementById('btf-dark-style');
        if (!darkStyleElement) {
            document.head.appendChild(document.createRange().createContextualFragment(darkStyle));
        }
        // 获取按钮元素并更新其文本内容为“关闭Dark模式”
        const switchButton = document.getElementById('dark-mode-switch');
        if (switchButton) {
            switchButton.textContent = '暗黑模式';
        }
    } else {
        const darkStyleElement = document.getElementById('btf-dark-style');
        if (darkStyleElement) {
            darkStyleElement.remove();
        }
        // 获取按钮元素并更新其文本内容为“切换Dark模式”
        const switchButton = document.getElementById('dark-mode-switch');
        if (switchButton) {
            switchButton.textContent = '明亮模式';
        }
    }
}

    // 调用函数创建dark模式切换按钮
    createDarkModeSwitchButton();

    // 新增的隐藏元素函数
    function hideElements() {
        const elementsToHide = ['.left', '.right', '.bili-dyn-home--member main section:first-of-type'];
        elementsToHide.forEach(selector => {
            $(selector).each((index, element) => {
                $(element).hide();
            });
        });
    }

    const filterDynamicWithTags = function(selections, excluded) {
        cardObserver.disconnect();
        if (selections == "shamiko") {
            clearFilters();
            autoPadding();
        } else {
            selections = _.castArray(selections).filter(t => validTagIDs.includes(t));
            excluded = _.castArray(excluded).filter(t => validTagIDs.includes(t));
            let excludedUp = excluded.map(t => (tagged[t] || { list: [] }).list).flat();
            let newSelectedUp = _.difference(_.uniq(selections.map(t => (tagged[t] || { list: [] }).list).flat()), excludedUp);
            if (newSelectedUp.length > 0) {
                selectedUp = newSelectedUp;
                console.log(selections);
                new Promise(res => {
                    let siid = setInterval(function () {
                        if ($(".bili-dyn-item").length > 0) {
                            clearInterval(siid);
                            res();
                        }
                    });
                }).then(function () {
                    clearFilters();
                    filterWorker();
                    cardObserver.observe($(".bili-dyn-item").parent().parent()[0], { childList: true, subtree: true });
                });
            }
        }
    };

    function filterWorker() {
        $(".bili-dyn-item").toArray().forEach(c => {
            let author = c.__vue__.author;
            if (!(selectedUp.some(up => up.mid == author.mid || author.label == "番剧"))) $(c)[0].hidden = true;
        });
        loadMoreDynamics();
        autoPadding();
    }

    function loadMoreDynamics() {
        if ($(window).height() / ($(document).height() - $(document).scrollTop()) > 0.2) {
            $(".load-more").click();
            setTimeout(loadMoreDynamics, 100);
        } else {
            if ($(".skeleton").length > 0) {
                if (($($(".skeleton")[0]).offset().top - $(document).scrollTop()) < ($(window).height() + 1000)) {
                    forceLoad();
                    setTimeout(loadMoreDynamics, 100);
                }
            }
        }
    }

    function forceLoad() {
        let currentY = $(document).scrollTop();
        $(document).scrollTop($(document).height());
        $(document).scrollTop(currentY);
    }

    function clearFilters() {
        $(".bili-dyn-item").toArray().forEach(c => c.hidden = false);
    }

    function autoPadding() {
        $("#btf-tab-area").css("padding", ($(".bili-dyn-item")[0] && $(".new-notice-bar").length == 0)? ($(".bili-dyn-item")[0].hidden? "0px 0px 0px 0px" : "0px 0px 0px 0px") : "0px 0px 0px 0px");
    }

    function isBangumiTimeline() {
        if ($(".selected").text().includes("番") || $(".selected").text().includes("剧")) {
            $("#btf-tab-area")[0].hidden = true;
            $("#btf-bwlist-area")[0].hidden = true;
            cardObserver.disconnect();
            clearFilters();
        } else {
            $("#btf-tab-area")[0].hidden = false;
            $("#btf-bwlist-area")[0].hidden = false;
            vmTab.activeName = "shamiko";
            if (vmTab.complexMode) vmBWList.changed();
        }
    }


    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));

    function ajaxWithCredentials(url) {
        return new Promise((res, rej) => {
            $.ajax({
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                success: res,
                error: rej
            });
        });
    }

    function fetchTags(requestWithCredentials) {
        let tags = {};
        return requestWithCredentials("https://api.live.bilibili.com/User/getUserInfo")
          .then(data => {
                let uid = data.data.uid;
                console.log("uid: " + uid);
                let followingsRequests = requestWithCredentials("https://api.bilibili.com/x/relation/followings?vmid=" + uid + "&pn=1&ps=50")
                  .then(data => {
                        let gf = range(2, Math.ceil(data.data.total / 50), 1)
                          .map(i => {
                                return requestWithCredentials("https://api.bilibili.com/x/relation/followings?vmid=" + uid + "&pn=" + i + "&ps=50")
                            });
                        gf.unshift(Promise.resolve(data));
                        return gf;
                    })
                return requestWithCredentials("https://api.bilibili.com/x/relation/tags?vmid=" + uid)
                  .then(data => {
                        let tagsList = data.data;
                        tagsList.map(tag => {
                            tag.list = [];
                            return tag;
                        }).forEach(tag => tags[tag.tagid] = tag);
                        return {
                            tags: tagsList,
                            tagged: followingsRequests.then(gf => {
                                return Promise.all(gf.map(request => {
                                    return request.then(data => {
                                        let followings = data.data.list;
                                        followings.forEach(f => {
                                            if (f.tag) {
                                                let noAliveTag = true;
                                                f.tag.forEach(t => {
                                                    if (tags[t]) {
                                                        tags[t].list.push(f);
                                                        noAliveTag = false;
                                                    } else console.log("迷之tag：" + t);
                                                });
                                                if (noAliveTag) tags[0].list.push(f);
                                            } else {
                                                tags[0].list.push(f);
                                            }
                                        });
                                    })
                                })).then(() => tags);
                            })
                        }
                    })
            })
    }



    Promise.all([
        fetchTags(ajaxWithCredentials),
        GM.getResourceUrl("css")
          .then(u => $("head").append([
                '<link rel="stylesheet" href="' + u + '">',
                '<style type="text/css">',
                '.van-collapse-item__title,.van-collapse-item__content {background-color:rgba(0,0,0,0)!important}',
                '.van-cell__value {height:24px;overflow:visible!important}',
                '.van-tab.van-tab--active{color:#00aeec!important}',
                '</style>'
            ].join("\n"))),
        new Promise(res => {
            cardObserver = new MutationObserver(filterWorker);
            tabObserver = new MutationObserver(isBangumiTimeline);
            Vue.use(vant.Tab);
            Vue.use(vant.Tabs);
            let siid = setInterval(function () {
                if ($(".bili-dyn-list-tabs").length == 1 && $(".bili-dyn-live-users").length == 1) {
                    clearInterval(siid);
                    res();
                }
            });
        }).then(function () {
            $(".bili-dyn-list-tabs").after('<div id="btf-tab-area"><div id="btf-tab"></div></div>');
            $(".bili-dyn-live-users").after('<div id="btf-bwlist-area" style="padding-top:8px"><div id="btf-bwlist"></div></div>');
            $("#btf-tab-area")[0].hidden = true;
            $("#btf-bwlist-area")[0].hidden = true;
            autoPadding();
            tabObserver.observe($(".bili-dyn-list-tabs")[0], { childList: true, subtree: true, attributes: true });

            // 使用事件委托，在document上监听点击事件（也可以选择更合适的父元素，比如包含这些元素的某个具体容器元素）
            $(document).on('click', '.bili-dyn-up-list__item__face.all', function () {
                location.reload();
            });
        })
    ]).then(data => {
        // 使用CSS方法添加样式，为van-tabs__line类设置width和margin-bottom属性
        $('<style type="text/css">.van-tabs__line{width: 13px!important;margin-bottom: 8px;}</style>').appendTo('head');
        $('<style type="text/css">.van-tabs__wrap--scrollable{height: 48px!important;}</style>').appendTo('head');
        $('<style type="text/css">.bili-dyn-list-tabs{border-radius: 6px 6px 0 0!important;}</style>').appendTo('head');
        $('<style type="text/css">#btf-tab-area{margin-top: 1px;}</style>').appendTo('head');
        // 使用CSS方法添加样式，为van-tab类设置flex-basis属性，并添加!important提高优先级（可根据实际情况决定是否添加!important）
        $('<style type="text/css">.van-tab{flex-basis: 7.1%!important;}</style>').appendTo('head');

        // 调用隐藏元素的函数
        hideElements();

        // 获取页面中的main元素并修改其宽度为60%
        $('main').css('width', '60%');

        let tagOptions = data[0].tags.filter(t => t.count!= 0);
        validTagIDs = tagOptions.map(t => t.tagid);
        let loadCompleted = false;
        vmTab = new Vue({
            el: "#btf-tab",
            template: '<van-tabs v-model="activeName" line-height="2px" color="#00aeec" title-inactive-color="#6d757a" swipe-threshold="10" :border="false" @click="onClick"><van-tab v-for="tag in (complexMode? [{tagid:\'shamiko\',name:\'已启用高级筛选\'}] : tags)" :title="tag.name" :name="tag.tagid"></van-tab></van-tabs>',
            data: {
                activeName: "shamiko",
                tags: [{ tagid: "shamiko", name: "全部" }].concat(tagOptions),
                complexMode: false
            },
            methods: { onClick: s => {
                if (loadCompleted) setTimeout(filterDynamicWithTags, 300, s);
                else {
                    setTimeout(() => { vmTab.activeName = "shamiko" }, 100);
                    vant.Toast.fail("分组名单尚未加载完成，请稍后再试！");
                }
            } }
        });
        vmBWList = new Vue({
            el: "#btf-bwlist",
            template: '<van-collapse v-model="nc" :border="false" style="border-radius:4px;background-color:white;" @change="switched"><van-collapse-item title="高级筛选" :border="true" :is-link="false" name="1"><template #value><van-switch :value="sw" size="22px"/></template><div style="display:flex"><van-checkbox-group v-model="blackList" checked-color="#ff2d55" style="padding-right:8px" @change="changed"><van-checkbox v-for="tag in tags" :name="tag.tagid" style="height:40px"><template #icon="{checked}"><van-icon name="cross" :color="checked?\'white\':\'#c8c9cc\'" style="line-height:19.9px" /></template></van-checkbox></van-checkbox-group><van-checkbox-group v-model="whiteList" style="flex-grow:1" @change="changed"><van-checkbox v-for="tag in tags" :name="tag.tagid" style="height:40px">{{tag.name}}<template #icon="{checked}"><van-icon name="success" :color="checked?\'white\':\'#c8c9cc\'" /></template></van-checkbox></van-checkbox-group></div></van-collapse-item></van-collapse>',
            data: {
                nc: [],
                tags: tagOptions,
                whiteList: tagOptions.map(t => t.tagid),
                blackList: []
            },
            methods: {
                switched: function (sw) {
                    console.log(sw);
                    if (sw.length > 0) {
                        console.log("on");
                        vmTab.activeName = "shamiko";
                        vmTab.complexMode = true;
                        this.changed();
                    } else {
                        console.log("off");
                        vmTab.complexMode = false;
                        filterDynamicWithTags("shamiko");
                    }
                },
                changed: function () {
                    setTimeout(filterDynamicWithTags, 300, this.whiteList, this.blackList);
                }
            },
            computed: {
                sw: function () {
                    return this.nc.length > 0;
                }
            },
            watch: {
                whiteList: function (n, o) {
                    if (n.length > o.length) this.blackList = this.blackList.filter(b => b!= n.filter(t =>!o.includes(t)));
                },
                blackList: function (n, o) {
                    if (n.length > o.length) this.whiteList = this.whiteList.filter(w => w!= n.filter(t =>!o.includes(t)));
                }
            }
        });
        isBangumiTimeline();
        data[0].tagged.then(data => {
            tagged = data;
            loadCompleted = true;
        });
        $(".van-tabs__wrap")[0].style["border-radius"] = "0 0 6px 6px";
        try {
            if (unsafeWindow.bilibiliEvolved.settings.useDarkStyle) $("head").append(darkStyle);
            unsafeWindow.bilibiliEvolved.addSettingsListener("useDarkStyle", value => value? $("head").append(darkStyle) : $("#btf-dark-style").remove());
        } catch (e) {
            console.log("dark mode error: ", e);
        }
    }).catch(err => {
        console.error(err);
        alert("【b站时间线筛选】脚本出错了！\n请查看控制台以获取错误信息");
    })

}