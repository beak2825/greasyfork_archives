// ==UserScript==
// @name         gd-tax-plugin
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  广东电子税局多账号管理插件
// @author       Dengguiling
// @license      MIT
// @match        https://*.guangdong.chinatax.gov.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdn.staticfile.org/xlsx/0.10.0/xlsx.core.min.js
// @downloadURL https://update.greasyfork.org/scripts/443095/gd-tax-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/443095/gd-tax-plugin.meta.js
// ==/UserScript==

/* -------------------------- 搜索框库代码 -------------------------- */
/**
* 搜索框初始化
* @param option: 初始化参数
* @return void
*/
$.fn.searchInit = function (option) {
    /* 默认配置 */
    var setting = $.extend({
        data: "",// 选择框数据
        emptyTips: "暂无数据",// 无数据提醒
        placeholder: "搜索公司名称",
        width: "300px",
        height: "36px"
    }, option);

    function updateList(data, emptyTips) {
        if ($this.find(".searchInput").attr("readonly") != "readonly") {
            var html = "";
            if (data && data.length > 0) {
                for (var i = 0; i < data.length && i < 20; i++) {
                    html += '<li style="position: relative; z-index:999; background-color: white;>' + data[i].name + "</li>"
                }
            } else {
                html += '<li class="searchSelectorEmpty" style="position: relative; z-index:999; background-color: white;>' + emptyTips + "</li>"
            }
            $this.find(".searchSelectorList").empty().append(html)
        }
    }

    var id = "#" + this.attr("id");
    var $this = this;
    var data = setting.data;
    var emptyTips = setting.emptyTips;
    var width = setting.width;
    var height = setting.height;
    if ($this.html().replace(/(^\s*)|(\s*$)/g, "") != "") {
        updateList(data, setting.emptyTips);
    } else {
        $this.append('<input class="searchInput" style="width: ' + width + ';" placeholder="' + setting.placeholder + ' "/>');
        $this.append('<ul class="searchSelectorList hide " style="background: white; padding: 0; margin: 0; list-style: none; position: absolute; z-index: 999; top: 60px;"></ul>');

        /* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
        /* New Some Control Button. */
        /* 按钮：删除数据库，用于清除缓存 */
        $this.append('<button id="clear_db" style="font-size: 14px;width: 100px;">清除缓存</button>');
        // $('<button id="clear_db" style="font-size: 14px;width: 100px;">清除缓存</button>').insertBefore($("#app > div > div.loginCls > div.headerCls > div:nth-child(2)"));
        $("#clear_db").click(function(e) {
            delete_database();// 删除数据库
            $("#file").val("");// 清空打开文件框的值，下次打开同一文件时依然解析。
            data = [];// 清空缓存
        })

        /* 按钮：刷新数据库，通过按钮触发文件框，然后打开excel文件读取。 */
        $this.append('<input type="file" id="file" style="display:none;">');
        // $('<input type="file" id="file" style="display:none;">').insertBefore($("#app > div > div.loginCls > div.headerCls > div:nth-child(3)"));
        $this.append('<button id="open_file" style="font-size: 14px;width: 100px;">导入数据</button>');
        // $('<button id="open_file" style="font-size: 14px;width: 100px;">导入数据</button>').insertBefore($("#app > div > div.loginCls > div.headerCls > div:nth-child(4)"));
        $("#open_file").click(function(e) {
            $("#file").click();
        });
        $("#file").change(function(e){
            var files = e.target.files;
            /* 没有打开文件（点击了取消），直接返回。 */
            if(files.length == 0) return;

            /* 校验文件后缀名，仅测试过xlsx文件！ */
            if(!/\.xlsx/g.test(files[0].name)) {
                alert('仅支持读取xlsx格式文件！');
                return;
            }

            /* 读取Excel文件 */
            read_workbook_from_local_file(files[0], function () {
                /* 每次更新数据库都需要刷新data数组 */
                data = [];
                var keys = GM_listValues();
                keys.forEach(key => {
                    data.push({"name": key});
                });

                /* 删除文件选择框的值，下次打开同一文件依然解析。 */
                $("#file").val("");
            });
        });
        /* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

        updateList(data, emptyTips);

        /* 清空下拉选择项，并设置高度和宽度。 */
        $this.find(".searchSelectorList").empty().css({
            "width": $this.find(".searchInput").outerWidth() + "px",
            "top": "60px"
        })
    }

    /* CSS: 选择时更容易看出鼠标位置。 */
    $(".searchSelectorList li").mouseover(function(e) {
        $(this).css("background-color","silver");
    })
    $(".searchSelectorList li").mouseout(function(e) {
        $(this).css("background-color","white");
    })

    // $('<input class="searchInput" style="width: ' + width + '; font-size: 10px;" placeholder="' + setting.placeholder + '"/>').insertBefore($(".list a:first"));

    /* 初始化下拉选择框点击事件 */
    $this.searchSelectorClick();

    /* 绑定点击事件：点击其它地方时隐藏选择框。 */
    $(document).click(function (event) {
        var _con = $(id + " .searchInput");
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $(id + " .searchSelectorList").hide()
        }
    })

};

/**
* 更新下拉选择框列表
* @param data: 下拉选择数据
* @param emptyTips: 无数据时，显示提示
* @param callback: 回调函数
* @return void
*/
$.fn.updatesearchSelectorList = function (data, emptyTips, callback) {
    var $this = this;
    emptyTips = emptyTips ? emptyTips : "暂无数据";// 默认：暂无数据

    /* 构建下拉选择框的HTML */
    var html = "";
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            html += '<li style="position: relative; z-index:999; background-color: white;">' + data[i].name + "</li>";
        }
    } else {
        html += '<li class="searchSelectorEmpty" style="position: relative; z-index:999; background-color: white;">' + emptyTips + "</li>";
    }
    $this.find(".searchSelectorList").html(html).show();

    /* CSS: 选择时更容易看出鼠标位置。 */
    $(".searchSelectorList li").mouseover(function(e) {
        $(this).css("background-color","silver");
    })
    $(".searchSelectorList li").mouseout(function(e) {
        $(this).css("background-color","white");
    })

    if (typeof (callback) == "function") {
        callback();
    }
};

/**
* 搜索输入框点击事件
* @param callback: 回调函数
* @return void
*/
$.fn.searchInputClick = function (callback) {
    this.delegate(".searchInput", "click", function (e) {
        if (typeof (callback) == "function") callback(e);
    })
};

/**
* 搜索输入框输入事件
* @param callback: 回调函数
* @return void
*/
$.fn.searchInputKeyup = function (callback) {
    this.delegate(".searchInput", "keyup", function (e) {
        if (typeof (callback) == "function") callback(e);
    })
};

/**
* 下拉选择框点击事件
* @param callback: 回调函数
* @return void
*/
$.fn.searchSelectorClick = function (callback) {
    var $this = this;
    /* 将所有的下来框都绑定事件 */
    $this.find("ul.searchSelectorList").delegate("li", "click", function (e) {
        var $input = $this.find(".searchInput");

        /* 禁用默认事件（兼容不同浏览器 */
        if (e && e.preventDefault) {
            e.preventDefault()
        } else {
            window.event.returnValue = false;
        }
        if (e.stopPropagation) {
            e.stopPropagation()
        } else {
            e.cancelBubble = true;
        }

        /* 无数据直接返回 */
        if ($(this).hasClass("searchSelectorEmpty")) return;

        /* 隐藏下拉框 */
        $this.find(".searchSelectorList").hide();
        /* 更新选择的数据到搜索框 */
        $input.val($(this).text());

        /* 回调函数，继续处理。 */
        if (typeof (callback) == "function") callback(e);
    })
};

/* -------------------------- xlsx库代码 -------------------------- */
/**
* 读取本地excel文件
* @param file: 读取数据的Excel文件
* @param callback: 回调函数
* @return void
*/
function read_workbook_from_local_file(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});

        /* 校验工作表名称是否正确 */
        var sheetNames = workbook.SheetNames;
        if (sheetNames.indexOf("客户信息表") == -1) {
            alert("导入数据库失败：请确认工作表名是否为 客户信息表 !");
            return ;
        }

        var worksheet = workbook.Sheets["客户信息表"];
        var csv = XLSX.utils.sheet_to_csv(worksheet);
        var accountData = csv.split("\n");
        var title = accountData.shift();
        title = title.split(",");

        /* 校验Excel标题名称是否正确 */
        if (title.indexOf("公司名称") == -1) {
            alert("导入数据库失败：没找到标题 公司名称！");
            return ;
        }
        if (title.indexOf("统一信用代码") == -1) {
            alert("导入数据库失败：没找到标题 统一信用代码！");
            return ;
        }
        if (title.indexOf("实名账号") == -1) {
            alert("导入数据库失败：没找到标题 实名账号！");
            return ;
        }
        if (title.indexOf("密码") == -1) {
            alert("导入数据库失败：没找到标题 密码！");
            return ;
        }

        /* 解析数据。并存入数据库。 */
        var count = 0;
        var re = RegExp("^[A-Za-z0-9]{18}$");
        accountData.forEach(data => {
            var ds = data.split(",");
            if (ds[title.indexOf("统一信用代码")]) {
                if (re.test(ds[title.indexOf("统一信用代码")].replace(/[ ]|[\r\n]/g,""))) {
                    write_database([
                        ds[title.indexOf("公司名称")],// 公司名称
                        ds[title.indexOf("统一信用代码")],// 统一信用代码
                        ds[title.indexOf("实名账号")],// 账户名
                        ds[title.indexOf("密码")]// 密码
                    ]);
                    count++;
                }
            }
        });

        /* 回调函数，继续处理。 */
        if (typeof (callback) == "function") callback(e);

        alert("成功导入 " + count + " 个数据！");
    };

    reader.readAsBinaryString(file);
}

/* -------------------------- GM数据库代码 -------------------------- */
/**
* 写入Tampermonkey的GM数据库
* @param data: 写入数据库的数据
* @return void
*/
function write_database(data) {
    var key = data.shift();
    if (!key) return ;
    // console.log(key);
    // console.log(data);
    GM_setValue(key, data);
}

/**
* 删除Tampermonkey的GM数据库
* @return void
*/
function delete_database() {
    if (confirm("【!!!】确认清空数据库吗？")) {
        var keys = GM_listValues();
        keys.forEach(key => {
            GM_deleteValue(key);
        });
    }
}

/**
* 在Tampermonkey的GM数据库中搜索
* @param data: 从数据库中搜索的键值
* @return void
*/
function searchDatabase(data, type) {
    var keys = GM_listValues();
    keys.forEach(key => {
        if (key.indexOf(data) >= 0) {
            /* 从数据库读取数据 */
            var accountData = GM_getValue(key);
            // console.log(key);
            // console.log(accountData);

            /* 将信息填充到登录框中 */
            /* 1: Old system, other: new system */
            if (type == 1) {
                document.getElementById("shxydmOrsbh").value = accountData[0];
                document.getElementById("userNameOrSjhm").value = accountData[1];
                document.getElementById("passWord").value = accountData[2];
            } else {
                var event = new Event('input')

                var code = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(1) > div > div > div > div.el-input > input")
                code.value = accountData[0]
                code.dispatchEvent(event)

                var account = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(2) > div > div > div > input")
                account.value = accountData[1]
                account.dispatchEvent(event)

                var pass = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(3) > div.el-form-item.is-required > div > div.el-row > div > input")
                pass.value = accountData[2]
                pass.dispatchEvent(event)
            }
        }
    });
}
/* ------------------------------------------------------------------------- */


(function() {
    'use strict';

    var url = document.location.toString();
    if (url === "https://etax.guangdong.chinatax.gov.cn/xxmh/" ||
        url === "https://etax.guangdong.chinatax.gov.cn/xxmh/html/index.html")
    {
        /* 跳转到登录页面 */
        setTimeout(function(){
            $(".layui-layer-btn:first").click();
            $(".loginico:first").click();
        }, 100);
    }
    else if (url.indexOf("https://etax.guangdong.chinatax.gov.cn/sso/login") == 0)
    {
        /* 功能1: 自动切换到登录页面的密码登录框。 */
        $(".layui-layer-btn1:first").click();
        document.getElementById("mmdl_QieHuan").click();

        /* 功能2：从excel中复制信用代码，账号，密码之后，在输入框粘贴自动填充。 */
        document.body.onpaste = function(event) {
            var clipboardData = (event.clipboardData || window.clipboardData);
            /* 没有数据直接返回 */
            if (!clipboardData) return ;
            /* 解析粘贴数据 */
            var accountData = clipboardData.getData("text").trim().split(/\s+/);
            /* 填充登录信息 */
            if (accountData.length == 3) {
                setTimeout(function(){
                    document.getElementById("shxydmOrsbh").value = accountData[0];
                    document.getElementById("userNameOrSjhm").value = accountData[1];
                    document.getElementById("passWord").value = accountData[2];
                }, 100);
            }
        }

        /* 功能3：将需要管理的税务账号从Excel中导入数据库，后面就无需打开Excel文件，直接搜索。 */
        var data = [];

        /* 调整顶栏样式 */
        $(".layui-row:first").attr("style", "display: flex;align-items: baseline;gap: 10px;");

//         /* 按钮：删除数据库，用于清除缓存 */
//         $('<button id="clear_db" style="font-size: 14px;width: 100px;">清除缓存</button>').insertBefore($(".layui-row .layui-col-md3:first"));
//         $("#clear_db").click(function(e) {
//             delete_database();// 删除数据库
//             $("#file").val("");// 清空打开文件框的值，下次打开同一文件时依然解析。
//             data = [];// 清空缓存
//         })

//         /* 按钮：刷新数据库，通过按钮触发文件框，然后打开excel文件读取。 */
//         $('<input type="file" id="file" style="display:none;">').insertBefore($(".layui-row .layui-col-md3:first"));
//         $('<button id="open_file" style="font-size: 14px;width: 100px;">导入数据</button>').insertBefore($(".layui-row .layui-col-md3:first"));
//         $("#open_file").click(function(e) {
//             $("#file").click();
//         });
//         $("#file").change(function(e){
//             var files = e.target.files;
//             /* 没有打开文件（点击了取消），直接返回。 */
//             if(files.length == 0) return;

//             /* 校验文件后缀名，仅测试过xlsx文件！ */
//             if(!/\.xlsx/g.test(files[0].name)) {
//                 alert('仅支持读取xlsx格式文件！');
//                 return;
//             }

//             /* 读取Excel文件 */
//             read_workbook_from_local_file(files[0], function () {
//                 /* 每次更新数据库都需要刷新data数组 */
//                 data = [];
//                 var keys = GM_listValues();
//                 keys.forEach(key => {
//                     data.push({"name": key});
//                 });

//                 /* 删除文件选择框的值，下次打开同一文件依然解析。 */
//                 $("#file").val("");
//             });
//         });

        /* 搜索框 */
        $('<div id="search" style="font-size: 14px; width: 800px"></div>').insertBefore($(".layui-row .layui-col-md3:first"));

        /* 搜索框控制代码 */

        /* 初始化data数组（存放搜索关键字：公司名称） */
        data = [];
        var keys = GM_listValues();
        keys.forEach(key => {
            data.push({"name": key});
        });

        /* 搜索框初始化 */
        $('#search').searchInit();

        /* 绑定搜索框点击事件 */
        $('#search').searchInputClick(function () {
            var searchData = [];

            /* 搜索需要搜索的键值 */
            for (var i = 0; i < data.length; i++) {
                /* 最大限制下拉选择框显示20个结果，太多结果证明搜索词不够准确。 */
                if (searchData.length >= 20) break;

                if ($(".searchInput:first").val()) {
                    /* 对比成功的话就插入到searchData */
                    if (data[i].name.indexOf($(".searchInput:first").val()) >= 0) {
                        searchData.push(data[i]);
                    }
                } else {
                    /* 没有输入就随便插入。 */
                    searchData.push(data[i]);
                }
            }
            /* 将搜索结果生成下拉选择框 */
            $('#search').updatesearchSelectorList(searchData, "暂无数据");
        });

        /* 绑定搜索框输入事件 */
        $('#search').searchInputKeyup(function (e) {
            var searchData = [];
            /* 搜索需要搜索的键值 */
            for (var i = 0; i < data.length; i++) {
                /* 最大限制下拉选择框显示20个结果，太多结果证明搜索词不够准确。 */
                if (searchData.length >= 20) break;

                if ($(".searchInput:first").val()) {
                    /* 对比成功的话就插入到searchData */
                    if (data[i].name.indexOf($(".searchInput:first").val()) >= 0) {
                        searchData.push(data[i]);
                    }
                } else {
                    /* 没有输入就随便插入。 */
                    searchData.push(data[i]);
                }
            }
            /* 将搜索结果生成下拉选择框 */
            $('#search').updatesearchSelectorList(searchData, "暂无数据");

            if (searchData.length) {
                let theEvent = e || window.event;
                let keyCode = theEvent.keyCode || theEvent.which || theEvent.charCode;
                /* 回车选择第一个搜索结果 */
                if (keyCode == 13) {
                    searchDatabase(searchData[0]["name"], 1);
                }
            }
        });

        /* 绑定下拉框点击事件，选择某家公司时，自动填充账户信息。 */
        $('#search').searchSelectorClick(function () {
            searchDatabase($(".searchInput:first").val(), 1);
        });
    } else if (url === "https://etax.guangdong.chinatax.gov.cn/xxmh/html/index_login.html") {
        /* 功能4：添加自定义图标。无需每个客户都添加。 */
        setTimeout(function(){
            var addItem;

            /* 违法违章查询 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(4) > div > div > div:nth-child(12)').clone(true);
            $('#cygnsz').after(addItem);

            /* 纳税信用状态信息查询 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(4) > div > div > div:nth-child(11)').clone(true);
            $('#cygnsz').after(addItem);

            /* 发票查询 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(4) > div > div > div:nth-child(3)').clone(true);
            $('#cygnsz').after(addItem);

            /* 一户式查询 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(4) > div > div > div:nth-child(1)').clone(true);
            $('#cygnsz').after(addItem);

            /* 纳税人信息 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(2) > div > div > div:nth-child(1)').clone(true);
            $('#cygnsz').after(addItem);

            /* 事项办理 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(3) > div > div > div:nth-child(1)').clone(true);
            $('#cygnsz').after(addItem);

            /* 税费申报 */
            addItem = $('#topTabs > div.layui-tab-content > div:nth-child(3) > div > div > div:nth-child(4)').clone(true);
            $('#cygnsz').after(addItem);
        }, 100);
    } else if (url.indexOf("https://tpass.guangdong.chinatax.gov.cn") == 0) {
        /* 功能2：从excel中复制信用代码，账号，密码之后，在输入框粘贴自动填充。 */
        document.body.onpaste = function(event) {
            var clipboardData = (event.clipboardData || window.clipboardData);
            /* 没有数据直接返回 */
            if (!clipboardData) return ;
            /* 解析粘贴数据 */
            var accountData = clipboardData.getData("text").trim().split(/\s+/);
            /* 填充登录信息 */
            if (accountData.length == 3) {
                setTimeout(function(){
                    var event = new Event('input')

                    var code = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(1) > div > div > div > div.el-input > input")
                    code.value = accountData[0]
                    code.dispatchEvent(event)

                    var account = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(2) > div > div > div > input")
                    account.value = accountData[1]
                    account.dispatchEvent(event)

                    var pass = document.querySelector("#app > div > div.loginCls > div.mainCls > div > div.login_box > div.password_ddd > div.formContentE > div > div:nth-child(1) > div:nth-child(1) > div > form > div:nth-child(3) > div.el-form-item.is-required > div > div.el-row > div > input")
                    pass.value = accountData[2]
                    pass.dispatchEvent(event)
                }, 100);
            }
        }

        setTimeout(function(){
            /* 功能3：将需要管理的税务账号从Excel中导入数据库，后面就无需打开Excel文件，直接搜索。 */
            var data = [];

            /* 搜索框 */
            $('<div id="search" style="font-size: 14px;"></div>').insertBefore($("#app > div > div.loginCls > div.headerCls > div:nth-child(2)"));

            /* 搜索框控制代码 */

            /* 初始化data数组（存放搜索关键字：公司名称） */
            data = [];
            var keys = GM_listValues();
            keys.forEach(key => {
                data.push({"name": key});
            });

            /* 搜索框初始化 */
            $('#search').searchInit();

            /* 绑定搜索框点击事件 */
            $('#search').searchInputClick(function () {
                var searchData = [];

                /* 搜索需要搜索的键值 */
                for (var i = 0; i < data.length; i++) {
                    /* 最大限制下拉选择框显示20个结果，太多结果证明搜索词不够准确。 */
                    if (searchData.length >= 20) break;

                    if ($(".searchInput:first").val()) {
                        /* 对比成功的话就插入到searchData */
                        if (data[i].name.indexOf($(".searchInput:first").val()) >= 0) {
                            searchData.push(data[i]);
                        }
                    } else {
                        /* 没有输入就随便插入。 */
                        searchData.push(data[i]);
                    }
                }
                /* 将搜索结果生成下拉选择框 */
                $('#search').updatesearchSelectorList(searchData, "暂无数据");
            });

            /* 绑定搜索框输入事件 */
            $('#search').searchInputKeyup(function (e) {
                var searchData = [];
                /* 搜索需要搜索的键值 */
                for (var i = 0; i < data.length; i++) {
                    /* 最大限制下拉选择框显示20个结果，太多结果证明搜索词不够准确。 */
                    if (searchData.length >= 20) break;

                    if ($(".searchInput:first").val()) {
                        /* 对比成功的话就插入到searchData */
                        if (data[i].name.indexOf($(".searchInput:first").val()) >= 0) {
                            searchData.push(data[i]);
                        }
                    } else {
                        /* 没有输入就随便插入。 */
                        searchData.push(data[i]);
                    }
                }
                /* 将搜索结果生成下拉选择框 */
                $('#search').updatesearchSelectorList(searchData, "暂无数据");

                if (searchData.length) {
                    let theEvent = e || window.event;
                    let keyCode = theEvent.keyCode || theEvent.which || theEvent.charCode;
                    /* 回车选择第一个搜索结果 */
                    if (keyCode == 13) {
                        searchDatabase(searchData[0]["name"], 2);
                    }
                }
            });

            /* 绑定下拉框点击事件，选择某家公司时，自动填充账户信息。 */
            $('#search').searchSelectorClick(function () {
                searchDatabase($(".searchInput:first").val(), 2);
            });
        }, 3000);
    }
})();