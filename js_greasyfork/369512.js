// ==UserScript==
// @name         ST-Script
// @namespace    https://www.saintic.com/
// @version      0.5
// @description  修改google背景图、去除页脚；CSDN自动阅读全文、关闭页脚登录注册框、Github增加顶部导航、隐藏rtd侧边栏。
// @author       staugur
// @match        *://www.google.com/*
// @match        *://www.google.co.*/*
// @match        http*://blog.csdn.net/*/article/details/*
// @match        *://github.com/*
// @match        *://*.readthedocs.io/*
// @grant        none
// @icon         https://static.saintic.com/cdn/images/favicon-64.png
// @license      BSD 3-Clause License
// @date         2018-04-27
// @modified     2019-04-21
// @github       https://github.com/staugur/scripts/blob/master/userscripts/ST-Script.user.js
// @supportURL   https://github.com/staugur/scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/369512/ST-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/369512/ST-Script.meta.js
// ==/UserScript==

(function () {
        'use strict';
        //配置
        var conf = {
            google: {
                //此项设置是否开启修改google背景图功能
                enable: true,
                //此项设置是背景图地址，当上述项为true时有效
                bgUrl: "https://open.saintic.com/api/bingPic/",
                //此项设置隐藏google首页底部页脚
                hiddenFooter: true
            },
            csdn: {
                //此项设置自动展开全文
                auto_read_full: true,
                //此项设置关闭登录注册弹框
                auto_close_loginbox: true,
                //此项设置关闭左侧底部广告
                auto_remove_asidefooter: true
            },
            github: [
                /*设置你自己的导航，格式是：
                {
                    text: "显示名",
                    link: "链接地址"
                }
                */
            ],
            /*
                在docs列表中添加readthedocs文档的域名，另外在上面元数据添加match，例如：
                // @match  *://www.pycryptodome.org/*
                docs: ["www.pycryptodome.org"]

            */
            docs: []
        };
        //公共接口
        var api = {
            getDomain: function () {
                return document.domain;
            },
            getUrlRelativePath: function () {
                var url = document.location.toString();
                var arrUrl = url.split("//");
                var start = arrUrl[1].indexOf("/");
                var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
                if (relUrl.indexOf("?") != -1) {
                    relUrl = relUrl.split("?")[0];
                }
                return relUrl;
            },
            getUrlQuery: function (key, acq) {
                /*
                    获取URL中?之后的查询参数，不包含锚部分，比如url为http://passport.saintic.com/user/message/?status=1&Action=getCount
                    若无查询的key，则返回整个查询参数对象，即返回{status: "1", Action: "getCount"}；
                    若有查询的key，则返回对象值，返回值可以指定默认值acq：如key=status, 返回1；key=test返回acq
                */
                var str = location.search;
                var obj = {};
                if (str) {
                    str = str.substring(1, str.length);
                    // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
                    var arr = str.split("&");
                    //var obj = new Object();
                    // 将每一个数组元素以=分隔并赋给obj对象
                    for (var i = 0; i < arr.length; i++) {
                        var tmp_arr = arr[i].split("=");
                        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
                    }
                }
                return key ? obj[key] || acq : obj;
            },
            isContains: function (str, substr) {
                /* 判断str中是否包含substr */
                return str.indexOf(substr) >= 0;
            },
            arrayContains: function (arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }
        };
        //给Google™ 搜索页设置个背景图片、隐藏页脚
        if (conf.google.enable === true) {
            if (api.isContains(api.getDomain(), "www.google.co") && api.arrayContains(["/", "/webhp"], api.getUrlRelativePath())) {
                //设置body背景颜色、图片、重复性、起始位置
                document.body.style.backgroundColor = "inherit";
                document.body.style.backgroundImage = "url('" + conf.google.bgUrl + "')";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundPosition = "50% 50%";
                //隐藏页脚
                if (conf.google.hiddenFooter === true) {
                    document.getElementById('footer').style.display = 'none';
                }
                document.querySelector('.sfbg').style.display='none';
            }
        }
        //CSDN文章详情页自动展开全文并去除阅读更多按钮
        if (conf.csdn.auto_read_full === true) {
            if (api.isContains(api.getDomain(), "blog.csdn.net")) {
                var btnReadmore = $("#btn-readmore");
                var articleBox = $("div.article_content");
                //先去除阅读更多部分的style(隐藏)
                articleBox.removeAttr("style");
                //再删除越多更多按钮
                btnReadmore.parent().remove();
            }
        }
        //CSDN文章详情页关闭底部登录注册框
        if (conf.csdn.auto_close_loginbox === true) {
            if (api.isContains(api.getDomain(), "blog.csdn.net")) {
                var pb = $('.pulllog-box');
                //隐藏显示
                pb[0].style.display = 'none';
            }
        }
        //CSDN删除asideFooter-侧栏底部，如联系我们
        if (conf.csdn.auto_remove_asidefooter === true) {
            if (api.isContains(api.getDomain(), "blog.csdn.net")) {
                //删除左侧栏底部
                $('#asideFooter').remove();
            }
        }
        if (conf.github.length > 0) {
            if (api.isContains(api.getDomain(), "github.com") === true) {
                //添加导航
                var node, nav = document.getElementsByTagName("header")[0].getElementsByTagName("nav")[0].getElementsByTagName("a");
                for (var i in nav) {
                    if (nav[i].innerText === "Explore") {
                        node = nav[i];
                    }
                }
                if (node) {
                    var tmpHtml = '';
                    for (var i in conf.github) {
                        var gh = conf.github[i];
                        tmpHtml += '<a class="js-selected-navigation-item Header-link  mr-0 mr-lg-3 py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" href="' + gh.link + '">' + gh.text + '</a>';
                }
                if (tmpHtml) {
                    node.insertAdjacentHTML('afterEnd', tmpHtml);
                }
            }
        }
        if (api.isContains(api.getDomain(), "readthedocs.io") || api.arrayContains(conf.docs, api.getDomain())===true) {
            if (api.getUrlQuery("hide")==="0") {
                $('nav.wy-nav-side').css('display','none');
                $('div.rst-versions').css('display','none');
                $('section.wy-nav-content-wrap').css('margin-left', '0px');
                $('div.wy-nav-content').css('max-width','100%');
            }
        }
    }
})();
