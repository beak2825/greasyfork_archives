// ==UserScript==
// @name         快速查包
// @namespace    fsh
// @version      7.4
// @description  快速跳转至指定包或指定分支
// @author       xxtest
// @match        *://ci.meitu.city/*
// @match        *://omnibus.meitu-int.com/*
// @match        *://ios.meitu-int.com/ipa/*
// @match        *://jira.meitu.com/*
// @match        *://cf.meitu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js
// @homepage     https://greasyfork.org/zh-CN/scripts/454567-%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85
// @license MIT
// @note 7.4 回滚至7.2
// @note 7.2 logwork打卡标签新增社区
// @note 7.1 logwork打卡标签新增海外
// @note 7.0 logwork打卡标签新增证件照
// @note 6.9 logwork打卡标签新增订阅、商业化
// @note 6.8 logwork打卡弹窗选项，新增视频美化、视频美容
// @note 6.7 logwork打卡弹框，下拉框选型增加全部；一键复制需求bug修复
// @note 6.6 logwork打卡弹框，支持下拉框填入标签名
// @note 6.5 修复bug，解决鸿蒙和web平台影响版本判断问题
// @note 6.4 创建bug判断平台和影响版本是否一致
// @note 6.3 解决Jira获取分支，偶尔会填写错误的问题
// @note 6.2 解决iOS魔法屋跑图异常问题
// @note 6.1 解决跨年日期获取不到版本号问题
// @note 6.0 一键复制需求列表，增加容错
// @downloadURL https://update.greasyfork.org/scripts/454567/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/454567/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 设置刷新时间
    const refreshTime = 1000;
    // 添加CSS
    $('head').append($(`
  <style>
  .search{
    position: relative;
    width: 220px;
  }
  .search input{
    height: 40px;
    width: 220px;
    border-radius: 40px;
    border: 2px solid #324B4E;
    background: #F9F0DA;
    transition: .3s linear;
    float: left;
    text-indent: 10px;
  }

  .search input:focus::placeholder{
    opacity: 0;
  }
  .search button{
    height: 37px;
    border-radius: 37px;
    border-right: 1px solid #324B4E;
    border-left: 0px;
    background: #F9F0DA;
    right: 0;
    position: absolute;
  }

  .btn_find_build{
    width: 40px;
    text-align: center;
  }

  .search_span{
    /*border: 1px dashed #000;*/
    cursor: pointer;
    height: 16px;
    margin: 0px 10px;
    padding: 3px;
    border-radius: 25px;
  }

  .to_new_build{
    height: 30px;
    width: 120px;
    border-radius: 42px;
    border: 1px solid #324B4E;
    background: #fff;
    transition: .3s linear;
    color: #544d4d;
    margin: 0px 10px;
    font-size:14px;
  }

  .myimg{
    height:16px;
  }
  #input_last_build{
    border-radius: 30px;
    border: 1px solid #324B4E;
  }

  </style>`));
    // 当是ci域名时，才触发后续的操作，如果不是则不触发
    // CI
    // CI
    // CI
    if (location.href.indexOf('ci.meitu.city') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let input_find_build = document.getElementById('input_find_build');
            let to_new_build = document.getElementById('to_new_build');


            // 不存在输入框和跳转按钮则添加
            if (!input_find_build) {
                addFindButtonCicity();

                // 当用户按下键盘上的某个键时触发
                document.addEventListener("keyup", function (event) {
                    // 如果按下的是回车键
                    if (event.keyCode === 13) {
                        // 触发按钮的点击事件
                        $('#btn_find_build').click();
                    }
                });

                // 跳转按钮点击
                $('#btn_find_build').unbind("click").click(function () {
                    // 获取当前url, 用正则表达式获取项目名
                    let localUrl = window.location.href
                    let project = ''
                    let reg = /(?<=build\/)\w*/
                    project = localUrl.match(reg)[0]

                    if (project != null) {
                        let baseUrl = 'https://ci.meitu.city/build/' + project + '/'
                        // 获取用户输入
                        let input_build_content = document.getElementById("input_find_build").value.trim()
                        if (input_build_content === "") {
                            return false;
                        }
                        let targetUrl = ""
                        // 如果输入的是纯数字，视为build id
                        if (/^\d+$/.test(input_build_content)) {
                            targetUrl = baseUrl + 'number/' + input_build_content
                        } else {// 否则按输入的是分支处理
                            input_build_content = input_build_content.replaceAll("/", "%2F")
                            targetUrl = baseUrl + 'branch/' + input_build_content
                        }
                        // 跳转到指定页面
                        window.location.href = targetUrl
                    }
                    else {
                        input_find_build.value = "未能正确获取项目名称"
                    }
                });

            }

            // 不存在跳转至最新按钮则添加
            if (!to_new_build) {
                addToNewCicity();
                $('.to_new_build').unbind("click").click(function () {
                    // 判断当前所处的页面, 用正则表达式获取项目名
                    let localUrl = window.location.href
                    let project = ''
                    let reg = /(?<=build\/)\w*/
                    project = localUrl.match(reg)[0]
                    // 获取所要跳转的分支名
                    let full_build_name = this.parentNode.children[0].innerText.trim()
                    let targetUrl = ""
                    let baseUrl = 'https://ci.meitu.city/build/' + project + '/branch/'
                    full_build_name = full_build_name.replaceAll("/", "%2F")
                    targetUrl = baseUrl + full_build_name
                    // 跳转到指定页面
                    window.location.href = targetUrl
                });
            }
        }, refreshTime);
    }

    if (location.href.indexOf('omnibus.meitu-int.com') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let input_find_build = document.getElementById('input_find_build');
            let to_new_build = document.getElementById('to_new_build');
            let input_last_build = document.getElementById('input_last_build');
            let build_magichouse = document.getElementById('build_magichouse');

            // 不存在输入框和跳转按钮则添加
            if (!input_find_build) {
                addFindButtonOmnibus();

                // 当用户按下键盘上的某个键时触发
                document.addEventListener("keyup", function (event) {
                    // 如果按下的是回车键
                    if (event.keyCode === 13) {
                        // 触发按钮的点击事件
                        $('#btn_find_build').click();
                    }
                });

                // 跳转按钮点击
                $('#btn_find_build').unbind("click").click(function () {
                    // 获取当前url, 用正则表达式获取项目名
                    let localUrl = window.location.href
                    let project = ''
                    let platform = ''
                    let reg_platform = /:\/\/[^\/]+\/apps\/[^:]+:(\w+)/;
                    let reg = /\/apps\/([^/:]+)/
                    project = localUrl.match(reg)[1]

                    if (project != null) {
                        console.log(project.length)
                        let baseUrl = ""
                        if (project.length < 10) {
                            // 适配iOS的情况
                            platform = localUrl.match(reg_platform)[1]
                            console.log(platform)
                            baseUrl = ' https://omnibus.meitu-int.com/apps/' + project + ':' + platform + '/build'
                        }
                        else {
                            baseUrl = ' https://omnibus.meitu-int.com/apps/' + project + '/build'
                        }
                        console.log(baseUrl)
                        // 获取用户输入
                        let input_build_content = document.getElementById("input_find_build").value.trim()
                        if (input_build_content === "") {
                            return false;
                        }
                        let targetUrl = ""
                        // 如果输入的是纯数字，视为build id
                        if (/^\d+$/.test(input_build_content)) {
                            targetUrl = baseUrl + '/number/' + input_build_content
                        } else {// 否则按输入的是分支处理
                            input_build_content = input_build_content.replaceAll("/", "%2F")
                            targetUrl = baseUrl + '?branch=' + input_build_content
                        }
                        console.log(targetUrl)
                        // 跳转到指定页面
                        window.location.href = targetUrl
                    }
                    else {
                        input_find_build.value = "未能正确获取项目名称"
                    }
                });

            }

            // 不存在跳转至最新按钮则添加
            if (!to_new_build) {
                addToNewOmnibus();
                $('.to_new_build').unbind("click").click(function () {
                    let localUrl = window.location.href
                    // 项目名
                    let project = ''
                    // 平台
                    let platform = ''
                    let reg_platform = /:\/\/[^\/]+\/apps\/[^:]+:(\w+)/;
                    let reg = /\/apps\/([^/:]+)/
                    project = localUrl.match(reg)[1]
                    // 获取对应节点，因重复节点较多只能这么处理
                    let parent_node = this.parentNode.parentNode.parentNode
                    let bracnh_span = parent_node.children[2].children[0].children[1].querySelector('span.el-link__inner')
                    // 获取所要跳转的分支名
                    let full_build_name = bracnh_span.innerText.trim()
                    if (project != null) {
                        let baseUrl = ""
                        // 区分通过appuid还是通过项目:平台
                        if (project.length < 10) {
                            // 适配iOS的情况，获取对应平台
                            platform = localUrl.match(reg_platform)[1]
                            baseUrl = ' https://omnibus.meitu-int.com/apps/' + project + ':' + platform + '/build?branch=' + full_build_name
                        }
                        else {
                            baseUrl = ' https://omnibus.meitu-int.com/apps/' + project + '/build?branch=' + full_build_name
                        }
                        // 跳转到指定页面
                        window.location.href = baseUrl
                    }
                });
            }
            // 不存在魔法屋跑图按钮则添加
            if (!build_magichouse) {
                addOmnibusMagichouse();
                $('.build_magichouse').unbind("click").click(function () {
                    let buildIdB = document.getElementById("input_last_build").value.trim()
                    if (buildIdB === "") {
                        alert("请输入上个版本提交的build id");
                        return false;
                    }
                    let buildIdA = this.parentNode.parentNode.parentNode.children[0].children[0].children[0].innerText.trim()
                    // 获取请求的URL
                    let url = window.location.href
                    //分割，获取平台（可能是mtxx:ios，也可能是aze3897z9xi8g3dzvw8ce6thc5）
                    let path_url = url.split('/');
                    let platform = path_url.includes('apps') ? path_url[path_url.indexOf('apps') + 1] : null;
                    if (confirm("确定构建魔法屋任务吗？点击确定构建")) {
                        if (platform == "hydsriakywi7a4wtukhxh6zt6q" || platform.split(":")[1] == 'android') {
                            buildMagichouseTask(2, buildIdA, buildIdB);
                        }
                        else if (platform == "aze3897z9xi8g3dzvw8ce6thc5" || platform.split(":")[1] == 'ios') {
                            buildMagichouseTask(0, buildIdA, buildIdB);
                        }
                        else {
                            console.log(platform);
                            alert("出现错误，请联系阿德");
                        }
                    }
                });
            }
        }, refreshTime);
    }

    var project_android_omnibus = {
        "美图秀秀": "mtxx", "美颜相机": "beautycam",
        "美拍": "meipai", "美妆相机": "makeup",
        "潮自拍": "selfiecity", "设计室": "mtsjs",
        "wink": "wink", "BeautyPlus": "beautyplus",
        "AirBrush": "airbrush", "eve": "eve",
        "chic": "chic", "美图宜肤V": "eveking",
        "EveNetAssist": "evenetassist", "VChat": "vchatbeauty",
        "vcut": "vcut", "Vmake": "beautyplusvideo",
        "PixEngine": "pixengine", "智肤APP": "skinar",
        "美图秀秀Starii": "starii"
    }

    var appuid_android = {
        "美图秀秀": "hydsriakywi7a4wtukhxh6zt6q", "美颜相机": "afpqgy5mqyiyejvj7tu5pvkb3s",
        "美拍": "a3cat9d2fnieu5ghyjr6uvysd7", "美妆相机": "e69r7unz2bi2rm4d5hhmejunjt",
        "潮自拍": "au89qds8ipjnfmq6y36yxrwwqr", "设计室": "e57ixjbvhjj3pkjtqbircekw4g",
        "wink": "a7wb9ngehrjhs5s6kbc8jhpmut", "BeautyPlus": "b4ecchhcsgibw5kfamgxdr4z2f",
        "AirBrush": "ap6s3sujqjjze3nzd8e46sgwg8", "eve": "bqn9z5twij9d3jqjgpg6dvws3",
        "chic": "ajbmhzdremjtk5nkx9eezbc2ps", "美图宜肤V": "cprbcrdb58jwxjne7z5daitprd",
        "EveNetAssist": "epynw2drmbjyz5amwe4eirqm3f", "VChat": "envi6ei33biw7kn9zi42t2yqm2",
        "PixEngine": "pixengine", "智肤APP": "ecsgbwkuj5iffmjg3jzjq82ti4",
        "美图秀秀Starii": "enri33faz6ibwj5t7f9jpq4cvi"
    }

    var appuid_ios = {
        "美图秀秀": "aze3897z9xi8g3dzvw8ce6thc5", "美颜相机": "cd2z8rxy5uic9iaz6dbjv8xhw6",
        "美拍": "e79mtyimnwixp46e6hvspus6v2", "美妆相机": "ffp224ksztiqhi58ud7n33fvs2",
        "潮自拍": "etiv8nbxjpihni6cr9qhba4u3r", "设计室": "gki88wa2nfiqxi7vhyf2xux6cw",
        "wink": "bhks37k3uaizn4yvcspt4j3nma", "BeautyPlus": "eprvgz2kwujgvmyt7bvw92fae7",
        "AirBrush": "e8new3bg3eiximneygeizjyrn6", "eve": "b3huanjy32ipcmhkq6cfnvvspp",
        "chic": "hfkv4chfbgj56kuphtpe656t6g", "美图宜肤V": "dcjubb2t6ajvyjxaymkvtpp5az",
        "PixEngine": "pixengine", "智肤APP": "ecsgbwkuj5iffmjg3jzjq82ti4",
        "美图秀秀Starii": "hmeb767rjnjh8i3vmy3rwmkxn7"
    }

    var project_ios_omnibus = {
        "美图秀秀": "mtxx", "美颜相机": "beautycam",
        "美拍": "meipai", "美妆相机": "makeup",
        "潮自拍": "selfiecity", "设计室": "mtsjs",
        "wink": "wink", "BeautyPlus": "beautyplus",
        "AirBrush": "airbrush", "eve": "eve",
        "chic": "chic", "美图宜肤V": "eveking",
        "EveNetAssist": "evenetassist", "VChat": "vchatbeauty",
        "vcut": "vcut", "Vmake": "beautyplusvideo",
        "PixEngine": "pixengine", "智肤APP": "skinar",
        "美图秀秀Starii": "starii"
    }


    // omnibus页面,添加输入框和跳转按钮
    function addFindButtonOmnibus() {
        let span = $('<main class="search" style="display:inline-block;margin-left: 150px;" ></main>')
        let input_find_build = $('<input type="text" class="text" id="input_find_build" placeholder="  输入Build id或分支名">');
        let btn_find_build = $('<button type="submit" class="btn_find_build" id="btn_find_build">🔍</button>');
        span.append(input_find_build);
        span.append(btn_find_build);
        // jQuery不能直接插入，需要转一下格式，转成HTML才行
        let spanHtml = span.prop('outerHTML');
        // 获取第一个再插入；
        let firstDivWithTitleClass = document.querySelector('.is-plain');
        firstDivWithTitleClass.insertAdjacentHTML('beforebegin', spanHtml);
    }

    // omnibus页面,添加跳转至最新按钮
    function addToNewOmnibus() {
        let to_new_build = $('<button type="submit" class="to_new_build" id="to_new_build">跳转至最新➔</button>');
        $(".el-text--primary").after(to_new_build);
    }

    // omnibus页面,在其后方添加魔法屋跑图任务按钮
    function addOmnibusMagichouse() {
        let input_last_build = $('<input type="text" class="text" id="input_last_build" placeholder="  输入上个版本正式包">');
        let build_magichouse = $('<button  type="button" class="build_magichouse" id="build_magichouse">魔法屋跑图</button>');
        $(".to_new_build").after(build_magichouse);
        $(".to_new_build").after(input_last_build);
    }
    function buildMagichouseTask(osType, buildIdA, buildIdB) {
        let url = "http://mh-mng.meitu-int.com/xianyao/schedule/run/report";
        let module_list = [2, 3, 4, 5]
        for (var i = 0; i < module_list.length; i++) {
            var module = module_list[i]
            GM_xmlhttpRequest({
                url: url,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    osType: osType,
                    module: module,
                    buildIdA: buildIdA,
                    buildIdB: buildIdB,
                    creator: "ydr@meitu.com"
                }),
                onload: function (res) {
                    console.log(res)
                },
                onerror: function (err) {
                    result = '接口请求失败，建议重新关闭开启脚本再试试';
                }
            });
        }
        if (confirm("点击确定跳转魔法屋查看任务，如无任务联系阿德")) {
            window.open('https://magichouse.meitu-int.com/check/media/run/tasks', '_blank');
        }
    }

    // CI页面,添加输入框和跳转按钮
    function addFindButtonCicity() {
        let span = $('<span class="search"></span>')
        let input_find_build = $('<input type="text" class="text" id="input_find_build" placeholder="  输入Build id或分支名">');
        let btn_find_build = $('<button type="submit" class="btn_find_build" id="btn_find_build">🔍</button>');

        span.append(input_find_build);
        span.append(btn_find_build);
        $(".project-label__name").after(span);
    }

    // CI页面,在分支名后方添加跳转至最新按钮
    function addToNewCicity() {
        let to_new_build = $('<button type="submit" class="to_new_build" id="to_new_build">跳转至最新➔</button>');
        $(".message-card__subtitle").after(to_new_build);
    }

    // 当是granary域名时，才触发后续的操作，如果不是则不触发
    // Granary
    // Granary
    // Granary
    if (location.href.indexOf('ios.meitu-int.com') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let input_find_build = document.getElementById('input_find_build');
            let to_new_build = document.getElementById('to_new_build');
            let input_last_build = document.getElementById('input_last_build');
            let build_magichouse = document.getElementById('build_magichouse');

            // 项目名
            var project = ''
            var reg = /(?<=ipa\/)\w*/
            // 当前页面Url, 用正则表达式获取项目名
            var localUrl = window.location.href
            project = localUrl.match(reg)[0]

            // 不存在输入框和跳转按钮则添加
            if (!input_find_build) {
                addFindButtonGranary();

                // 当用户按下键盘上的某个键时触发
                document.addEventListener("keyup", function (event) {
                    // 如果按下的是回车键
                    if (event.keyCode === 13) {
                        // 触发按钮的点击事件
                        $('#btn_find_build').click();
                    }
                });

                // 按钮绑定点击事件
                $('#btn_find_build').unbind("click").click(function () {
                    if (project != null) {
                        // 获取用户输入
                        let input_build_content = document.getElementById("input_find_build").value.trim()
                        if (input_build_content === "") {
                            return false;
                        }
                        let targetUrl = ""
                        // 如果输入的是纯数字，视为build id
                        if (/^\d+$/.test(input_build_content)) {
                            let baseUrl = 'http://ios.meitu-int.com/ipa/' + project + '/build/'
                            targetUrl = baseUrl + input_build_content
                        } else {// 否则按分支处理
                            let baseUrl = 'http://ios.meitu-int.com/ipa/' + project + '/'
                            input_build_content = input_build_content.replaceAll("/", "%2F")
                            targetUrl = baseUrl + input_build_content
                        }
                        // 跳转到指定页面
                        window.location.href = targetUrl
                    }
                    else {
                        input_build_content.value = "未能正确获取项目名称"
                    }
                });
            }

            //不存在跳转至最新按钮则添加
            if (!to_new_build) {
                addToNewGranary();
                // 跳转按钮点击
                $('.to_new_build').unbind("click").click(function (event) {
                    // 分支名,去掉首尾的字符串，“/”转为“%2F”
                    let parentNode = event.target.parentNode;
                    let branchName = parentNode.querySelector("span.branch-name").innerText.trim()
                    branchName = branchName.substring(1, branchName.length - 1).replaceAll("/", "%2F");

                    // 跳转链接
                    let baseUrl = 'http://ios.meitu-int.com/ipa/' + project + '/'
                    let targetUrl = baseUrl + branchName

                    // 跳转
                    window.location.href = targetUrl
                });
            }

            if (!build_magichouse) {
                addGranaryMagichouse();
                $('.build_magichouse').unbind("click").click(function () {
                    let buildIdB = document.getElementById("input_last_build").value.trim()
                    if (buildIdB === "") {
                        alert("请输入上个版本提交的build id");
                        return false;
                    }
                    let parentNode = event.target.parentNode.children[0].innerText.trim();
                    let buildIdA = parentNode.match(/#Build\s+(\d+)/)[1].trim();
                    if (confirm("确定构建魔法屋任务吗？点击确定构建")) {
                        buildMagichouseTask(0, buildIdA, buildIdB)
                    }
                });
            }
        }, refreshTime);
    }

    // granary页面,添加输入框和跳转按钮
    function addFindButtonGranary() {
        let span = $('<span class="search"></span>')
        let input_find_build = $('<input type="text" class="text" id="input_find_build" placeholder=" 输入Build id或分支名">');
        let btn_find_build = $('<button type="submit" class="btn_find_build" id="btn_find_build">🔍</button>');

        span.append(input_find_build);
        span.append(btn_find_build);
        $("#myTab").append(span);
    }

    // granary页面,在分支名后方添加跳转至最新按钮
    function addToNewGranary() {
        let to_new_build = $('<button type="submit" class="to_new_build" id="to_new_build">跳转至最新➔</button>');
        $("div#list-home span.branch-name").after(to_new_build);
    }

    // granary页面,在其他后方添加魔法屋跑图任务按钮
    function addGranaryMagichouse() {
        let input_last_build = $('<input type="text" class="text" id="input_last_build" placeholder="  输入上个版本企业包">');
        let build_magichouse = $('<button  type="button" class="build_magichouse" id="build_magichouse">魔法屋跑图</button>');
        $(".to_new_build").after(build_magichouse);
        $(".to_new_build").after(input_last_build);
    }


    // 当是jira域名时，才触发后续的操作，如果不是则不触发
    // Jira
    // Jira
    // Jira
    if (location.href.indexOf('jira.meitu.com') > 0) {
        clearInterval(refreshTime);
        var counter = 0;
        // 定时器循环操作：页面元素添加等
        setInterval(function () {
            var search_span = document.getElementById('search_span_create');
            // 因为切至iOS按钮和切至Android按钮一般都会成对出现，所以这里只获取iOS按钮，用于判断按钮是否已存在
            var change_side_button = document.getElementById('change_side_ios');
            var create_input = document.getElementById('customfield_10303');
            var step_text = document.getElementById('customfield_10203');
            var create_issue_dialog = document.getElementById('create-issue-dialog');
            var close_bug_dialog = document.getElementById('workflow-transition-21-dialog');
            var reopen_bug_dialog = document.getElementById('workflow-transition-31-dialog');
            var comment_bug_toolbar = document.getElementById('wiki-edit-wikiEdit0');

            // 如果不存在bug跳转按钮则添加一个，需要判断url是bug页面而不是bug列表页，否则会报错
            if (!search_span) {
                addButtonJira();
                // 存储bug平台
                GM_setValue('platform', $('#customfield_10301-val').text().trim())
            }

            // 在创建问题dialog添加获取分支按钮组
            if (create_issue_dialog) {
                // 加个计时避免按钮显示不出来
                // Bug模版按钮
                if (change_side_button == undefined || change_side_button.length == 0) {
                    addChangeSideButton();
                }
                // 获取分支按钮
                if (create_input !== undefined || create_input.length !== 0) {
                    var branch_span = $('<label for="customfield_10304"></label>');
                    $("#customfield_10303").after(branch_span)
                    add_get_branch_btn($(branch_span));
                }
                // 重置步骤按钮
                if (step_text !== undefined || step_text.length !== 0) {
                    var step_span = $('<label for="customfield_10204"></label>');
                    $("#customfield_10203").after(step_span);
                    var step_btn = $('<input type="button" class="aui-button" value="重置步骤" id="reset_step">');
                    step_span.append(step_btn)
                }
                // 隐藏starii项目不必要的UI
                hideUI();
                // 自动填充build号
                fillBuildIdAuto();

            }

            // 自动往指定的input组件中填build号
            function fillBuildIdAuto() {
                // 获取输入框内容
                var inputContent = $("#customfield_10303").val();
                // 使用正则表达式检查当前文本内容是否是纯数字
                var isCurrentNumber = /^\d+$/.test(inputContent);
                if (isCurrentNumber) {
                    counter++;
                    console.log(counter)
                    // 如果当前文本内容是纯数字
                    if (counter % 6 === 0) {
                        // 往输入框内填写
                        set_branch('get_branch_btn', 'create-issue-dialog')
                        counter = 0;
                    }
                }
            }

            // 在关闭问题dialog 或 重新打开dialog 添加获取分支按钮组
            if (close_bug_dialog || reopen_bug_dialog) {
                var pre_text_button = $('<input class="aui-button" id="close-text" type="button" value="上次填写"></input>');
                var pre_text_btn = document.getElementById('close-text');
                var branch_span_close = $('<span id="close_text">输入id：</span>');
                var input_text_close = $('<input type="text" class="text medium-field" id="build_id_close">');
                setTimeout(function () {
                    if (!pre_text_btn) {
                        $(".jira-dialog-content .form-footer").append(branch_span_close).append(input_text_close);// buildid输入框
                        add_get_branch_btn($(".jira-dialog-content").find(".form-footer"));//获取分支按钮
                        $(".jira-dialog-content .form-footer").append(pre_text_button);//上次填写按钮
                    }
                }, 500);
            }

            // 在备注窗口添加获取分支按钮组
            if (comment_bug_toolbar) {
                var pre_text_span = $('<span id="pre_text">输入id：</span>');
                var pre_text_span_element = document.getElementById('pre_text');
                var input_text = $('<input type="text" class="text medium-field" id="input_text">');
                setTimeout(function () {
                    if (!pre_text_span_element && !close_bug_dialog) {
                        var branch_span = $('<span></span>');
                        branch_span.append(pre_text_span).append(input_text);
                        add_get_branch_btn($(branch_span));
                        $(".security-level .current-level").after(branch_span);
                    }
                }, 500);
            }


            // 获取分支按钮点击事件
            $('#get_branch_btn, #last_branch_btn').unbind("click").click(function (event) {
                setTimeout(function () {
                    // 当前节点的父节点
                    var parentNode = event.target.parentNode;

                    // 如果父节点没有Id属性，则往上遍历
                    while (parentNode != null) {
                        if (parentNode.hasAttribute("id")) {
                            // 找到第一个有id属性的父节点
                            var parentWithId = parentNode;
                            break;
                        }
                        parentNode = parentNode.parentNode;
                    }
                    //  第一个拥有Id的父节点的id
                    let parentId = parentWithId.getAttribute("id");

                    // 获取当前节点id
                    var selfId = event.target.id

                    // 往网页中填入分支名
                    set_branch(selfId, parentId);
                }, 500);
            });

            // 重置步骤按钮点击事件
            $('#reset_step').unbind('click').click(function (event) {
                let default_text = '[预置条件]\n\n[步骤]\n\n[结果]\n\n[期望]\n\n[备注机型]\n\n[BUG出现频次]\n\n\n'
                document.getElementById('customfield_10203').value = default_text;
            })

            function hideUI() {
                // 获取具有id为project-options的div元素
                var projectOptionsDiv = document.getElementById('project-options');
                if (projectOptionsDiv) {
                    // 获取data-suggestions属性的值
                    var dataSuggestionsValue = projectOptionsDiv.getAttribute('data-suggestions');
                    var jsonObject = JSON.parse(dataSuggestionsValue);
                    // 项目名
                    var project = jsonObject[0]['items'][0].label.trim();
                    var project_name = project.replace(/\s*\([^)]*\)\s*/, '').trim();
                } else {
                    var project_name = $('#project-name-val').text().trim(); // 项目名
                }
                if (project_name === "美图秀秀Starii") {
                    hideParentNodeById("customfield_10422");
                    hideParentNodeById("customfield_10202");
                    hideParentNodeById("customfield_10305");
                    hideParentNodeById("customfield_11100");
                    hideParentNodeById("customfield_11101");
                    hideParentNodeById("customfield_11102");
                    hideParentNodeById("customfield_10304");
                    hideParentNodeById("fixVersions");
                    hideParentNodeById("reporter");
                    hideParentNodeById("customfield_13601");
                }
            }

            // 隐藏指定ID节点的父节点
            function hideParentNodeById(childNodeId) {
                // 隐藏bug优先级
                var element = document.getElementById(childNodeId);
                // 检查是否找到了元素
                if (element) {
                    // 获取父节点并将其样式的display属性设置为"none"
                    element.parentNode.style.display = "none";
                }
            }

            // 往网页中填入分支名称
            async function set_branch(selfId, parentId) {
                if (selfId === "get_branch_btn") {
                    switch (parentId) {
                        // 创建Bug窗口填写分支
                        case "create-issue-dialog":
                            // bug平台节点和buildId节点
                            var $platform = $('input:radio[name="customfield_10301"]:checked');
                            var $buildId = $('#customfield_10303');

                            // 通过buildId节点（input）定位到bug平台节点（label）
                            var id = $platform.attr("id")
                            var label = document.querySelector("label[for='" + id + "']");

                            // bug平台和buildId
                            try {
                                var platform = label.textContent;
                            } catch (error) {
                                GM_setValue('branch_value', "#请先选择Bug平台");
                                fillInBranch('#customfield_10303');
                                return;
                            }
                            var buildId = $buildId.val();
                            if (buildId === undefined || buildId === '' || buildId === null) {
                                GM_setValue('branch_value', "#请先填写Build号");
                                fillInBranch('#customfield_10303');
                                return;
                            }
                            console.log(platform)
                            // 获取分支名
                            await get_branch(platform, buildId);
                            // 填入分支
                            await fillInBranch('#customfield_10303');
                            counter = 0;

                            break;

                        // 关闭||重新打开窗口填写分支
                        case "issue-workflow-transition":
                            var $platform = $('#customfield_10301-val');
                            var $buildId = $('#build_id_close');

                            // bug平台和buildId
                            var platform = $platform.text().trim();
                            var buildId = $buildId.val();

                            // 获取分支名
                            await get_branch(platform, buildId);

                            // 填入分支
                            await fillInBranchTextarea('div#comment-wiki-edit textarea#comment');

                            // 聚焦到输入框
                            sleep(500).then(() => {
                                $('#comment-wiki-edit textarea').focus();
                            })
                            break;
                        // 备注
                        case "issue-comment-add":
                            var $platform = $('#customfield_10301-val');
                            var $buildId = $('#input_text');

                            // bug平台和buildId
                            var platform = $platform.text().trim();
                            var buildId = $buildId.val();

                            // 获取分支名
                            await get_branch(platform, buildId);

                            // 填入分支
                            await fillInBranchTextarea('div#comment-wiki-edit textarea#comment');

                            // 聚焦到输入框
                            sleep(500).then(() => {
                                $('#comment-wiki-edit textarea').focus();
                            })
                            break;

                        default:

                    }
                } else if (selfId === "last_branch_btn") {
                    switch (parentId) {
                        case "create-issue-dialog":
                            // 填入分支
                            await fillInBranch('#customfield_10303');
                            break;

                        case "issue-workflow-transition":
                            // 填入分支
                            await fillInBranchTextarea('div#comment-wiki-edit textarea#comment');
                            break;
                        // 备注
                        case "issue-comment-add":
                            await fillInBranchTextarea('div#comment-wiki-edit textarea#comment');
                            break;
                        default:

                    }
                }
            }

            // 跳转到创建分支
            $('#search_span_create').unbind("click").click(function () {
                var build_id = getBuildId("customfield_10303-val");
                console.log(build_id)
                // 存储bug平台
                GM_setValue('platform', $('#customfield_10301-val').text().trim())
                sleep(500).then(() => {
                    var targetUrl = getBaseUrl() + build_id;
                    window.open(targetUrl);
                })

            });

            // 跳转到解决分支
            $('#search_span_solved').unbind("click").click(function () {
                var build_id = getBuildId("customfield_10304-val");
                // 存储bug平台
                GM_setValue('platform', $('#customfield_10301-val').text().trim())
                sleep(500).then(() => {
                    var targetUrl = getBaseUrl() + build_id;
                    window.open(targetUrl);
                })
            });

            // 切换到iOS bug模版
            $('.ios').unbind("click").click(function () {
                changeBugPlatform('iOS')
            });

            // 切换到Androidbug模版
            $('.android').unbind("click").click(function () {
                changeBugPlatform('Android')
            });

            // 切换到Webbug模版
            $('.web').unbind("click").click(function () {
                changeBugPlatform('Web')
            });

            // 点击关闭问题按钮，记录下填写的内容
            var text_area = $('.jira-dialog-content').find('#comment')
            $('#issue-workflow-transition-submit').unbind("click").click(function () {
                if ($('#issue-workflow-transition-submit').val().trim() == "关闭问题") {
                    // 存储bug平台
                    GM_setValue('closeText', text_area.val().trim())
                }
            })

            // 点击上次填写按钮，填充上次填写的内容
            $('#close-text').unbind("click").click(function () {
                text_area.val(GM_getValue('closeText'))
                text_area.focus()
            })

            // TODO:点击「创建」按钮时记录下所有的bug信息
            const $createBtn = $('#create-issue-submit');
            const $summary = $('#summary');
            const $business = $('input:radio[name="customfield_12903"]:checked');
            const $platform = $('input:radio[name="customfield_10301"]:checked');
            const $path0 = $("#selectCFLevel0 option:selected");
            const $path1 = $("#selectCFLevel1 option:selected");
            const $assignee = $("#assignee-field");
            const $severity = $("#customfield_10406 option:selected");
            const $version = $("#versions-multi-select .value-text");
            const $find = $("#customfield_10202 option:selected");
            const $frequency = $("#customfield_10204 option:selected");
            const $branch = $("#customfield_10303");
            const $step = $("#customfield_10203");
            const $tips = $("#labels-multi-select .representation .value-text");

            $createBtn.unbind('click').click(function () {
                const bugDict = {
                    'summary': $summary.val(),
                    'business': $business.attr("id"),
                    'platform': $platform.attr("id"),
                    'path0': $path0.text(),
                    'path1': $path1.text(),
                    'assignee': $assignee.val(),
                    'severity': $severity.text(),
                    'version': $version.text(),
                    'find': $find.attr("value"),
                    'frequency': $frequency.attr("value"),
                    'branch': $branch.val(),
                    'step': $step.val(),
                    'tips': $tips.text()
                };
                GM_setValue('bugDict', bugDict);
            });

            // 点击再提一个
            // 已知问题：1. 路径2无法填写
            $('#once-again').unbind('click').click(function () {
                const bugDict = GM_getValue('bugDict');

                function setValue(selector, value) {
                    $(selector).val(value);
                }
                function setChecked(selector, value) {
                    $(selector).attr("checked", value);
                }
                function setSelected(selector, value) {
                    $(selector).find(`option[value='${value}']`).attr("selected", true);
                }

                console.log(bugDict);
                setValue("#summary", bugDict.summary);
                setChecked(`input[id=${bugDict.business}]`, true);
                setChecked(`input[id=${bugDict.platform}]`, true);
                setValue("#selectCFLevel0", bugDict.path0);
                setValue("#selectCFLevel1", bugDict.path1);
                setValue("#assignee-field", bugDict.assignee);
                // $('#assignee').append($('<option>', {
                //     value: 'qwj@meitu.com',
                //     text: '丘文坚',
                //     title: "undefined",
                //     selected: "selected",
                //     style: "background-image: url(\"https://jira.meitu.com/secure/useravatar?size=xsmall&ownerId=qwj%40meitu.com&avatarId=13404\");"
                // }));
                setSelected("#customfield_10406", bugDict.severity);
                setValue("#versions-textarea", bugDict.version);
                setSelected("#customfield_10202", bugDict.find);
                //setSelected("#customfield_10204", bugDict.frequency);
                setValue("#customfield_10303", bugDict.branch);
                setValue("#customfield_10203", bugDict.step);
                //setValue("#labels-textarea",bugDict.tips)
            });

            // 点击创建按钮
            $('#create-issue-submit').unbind('click').click(function () {
                var $platform = $('input:radio[name="customfield_10301"]:checked');
                // 通过buildId节点（input）定位到bug平台节点（label）
                var id = $platform.attr("id")
                var label = document.querySelector("label[for='" + id + "']");
                try {
                    var platform = label.textContent;
                } catch (error) {
                    platform = "";
                    console.log("没选平台，不提示");
                    return;
                }
                var version = $("#versions-multi-select .value-text").text();
                platform = platform.toLowerCase();
                version = version.toLowerCase();
                if (platform && version && !version.includes(platform) && platform != 'harmony') {
                    console.log("存在不一致情况");
                    showtipsMessage("平台和影响版本不一致，请检查下！", "#F66666");
                };
            });
            // logWork添加打卡选项下拉框
            function addDropdownBeforeLogButton() {
                // 查找"记录"按钮
                const logButton = document.getElementById('log-work-submit');
                // 检查下拉框是否已存在
                const existingDropdown = document.getElementById('work-hours-dropdown');

                // 只有当按钮存在且下拉框不存在时才创建
                if (logButton && !existingDropdown) {
                    // 创建下拉框
                    const dropdown = document.createElement('select');
                    dropdown.id = 'work-hours-dropdown';
                    dropdown.className = 'aui-button';
                    dropdown.style.marginRight = '10px';

                    // 添加选项 - 替换为指定的类别
                    const categories = ['海外','闪传', 'AI垂类', '非AI垂类', '美化', '美容', '拼图', '相机', '视频美化', '视频美容',  '证件照' ,'素材中心', '订阅', '商业化', '社区','其他'];


                    // 添加一个默认空选项
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.text = '选择类别';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    dropdown.appendChild(defaultOption);

                    // 添加"全部"选项
                    const allOption = document.createElement('option');
                    allOption.value = 'all';
                    allOption.text = '全部';
                    dropdown.appendChild(allOption);

                    // 添加类别选项
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.text = category;
                        dropdown.appendChild(option);
                    });

                    // 将下拉框插入到按钮前面
                    logButton.parentNode.insertBefore(dropdown, logButton);

                    // 添加change事件监听器
                    dropdown.addEventListener('change', function () {
                        // 获取选中的值
                        const selectedValue = this.value;


                        // 更精确地定位当前工作记录对话框中的comment文本区域
                        // 首先找到当前对话框，然后在其中查找textarea
                        const dialogContainer = logButton.closest('.aui-dialog2, .jira-dialog');
                        if (dialogContainer) {
                            const commentTextarea = dialogContainer.querySelector('textarea.textarea.long-field.wiki-textfield#comment');
                            if (commentTextarea) {
                                // 获取当前光标位置
                                const startPos = commentTextarea.selectionStart;
                                const endPos = commentTextarea.selectionEnd;

                                // 获取当前文本内容
                                const currentText = commentTextarea.value;
                                // 构建要插入的文本
                                let insertedText;

                                // 如果选择"全部"，则插入所有类别
                                if (selectedValue === 'all') {
                                    insertedText = "";
                                    categories.forEach(category => {
                                        insertedText += "【" + category + "】" + ": h\n";
                                    });
                                    // 移除最后一个换行符
                                    insertedText = insertedText.trim();
                                } else {
                                    insertedText = "【" + selectedValue + "】" + ": h";
                                }

                                // 在光标位置插入选中的值
                                const newText = currentText.substring(0, startPos) +
                                    insertedText +
                                    currentText.substring(endPos);

                                // 更新文本区域的值
                                commentTextarea.value = newText;

                                // 设置光标位置在插入文本之后，-1可以定位到“h”之前
                                const newCursorPos = startPos + insertedText.length - 1;
                                commentTextarea.setSelectionRange(newCursorPos, newCursorPos);

                                // 聚焦文本区域
                                commentTextarea.focus();

                                // 重置下拉框为默认选项
                                this.selectedIndex = 0;
                            }
                        }
                    });
                }
            }
            // ... existing code ...
            addDropdownBeforeLogButton();
        }, refreshTime);



    }

    // 在输入框中填入分支
    // 这里必须加上700ms的延时，否则get_branch尚未填写完成时就会调用该方法，导致填写之前存储的内容
    async function fillInBranch(inputSelector) {
        // await sleep(700);
        var inputElement = $(inputSelector);
        inputElement.val("").val(GM_getValue('branch_value'));
    }

    // 在文本区域中填入分支
    async function fillInBranchTextarea(textareaSelector) {
        // await sleep(700);
        var textareaElement = $(textareaSelector);
        textareaElement.val("").val(GM_getValue('branch_value'));
    }

    // 在指定节点后添加获取分支按钮
    function add_get_branch_btn(targetElement) {
        var branch_btn = $('<input type="button" class="aui-button" value="获取分支" id="get_branch_btn">');
        var last_branch_btn = $('<input type="button" class="aui-button" value="上次分支" id="last_branch_btn">');
        targetElement.append(branch_btn).append(last_branch_btn)
    }

    // 根据build号，请求接口获取分支
    async function get_branch(platform, build_id) {
        return new Promise((resolve, reject) => {
            //console.log(platform+ "接收到的" + build_id)
            var url = '';
            var branch = '';
            var result = '';

            // 获取具有id为project-options的div元素
            var projectOptionsDiv = document.getElementById('project-options');
            if (projectOptionsDiv) {
                // 获取data-suggestions属性的值
                var dataSuggestionsValue = projectOptionsDiv.getAttribute('data-suggestions');
                var jsonObject = JSON.parse(dataSuggestionsValue);
                // 项目名
                var project = jsonObject[0]['items'][0].label.trim();
                var project_name = project.replace(/\s*\([^)]*\)\s*/, '').trim();
            } else {
                var project_name = $('#project-name-val').text().trim(); // 项目名
            }

            if (platform === 'iOS') {
                url = 'https://omnibus.meitu-int.com/api/apps/' + appuid_ios[project_name] + '/builds/' + build_id;
            } else if (platform === 'Android') {
                url = 'https://omnibus.meitu-int.com/api/apps/' + appuid_android[project_name] + '/builds/' + build_id;
            } else {
                url = 'https://omnibus.meitu-int.com/api/apps/' + appuid_android[project_name] + '/builds/' + build_id;
            }

            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                onload: function (res) {
                    if (res.status === 200) {
                        var r = '';
                        if (platform === 'iOS') {
                            r = 'refs/heads/(.*?)B';
                        } else if (platform === 'Android') {
                            r = 'refs/heads/(.*?)B';
                        } else {
                            r = 'refs/heads/(.*?)B';
                        }

                        branch = res.responseText.match(r)[1];
                    } else {
                        branch = ''
                    }
                    // branch的值存在$符时，设置为空
                    // branch的值为空时，设置返回结果为提示语
                    branch = branch.indexOf('$') != -1 ? '' : branch;

                    result = branch == '' ? "未找到该包的分支，" + build_id : branch + '#' + build_id;
                    if (result.indexOf("未找到") !== -1) {
                        GM_setValue('branch_value', result);
                        console.log(GM_getValue('branch_value'))
                    } else {
                        if (result.indexOf(build_id) !== -1) {
                            GM_setValue('branch_value', result);
                            console.log(GM_getValue('branch_value'))
                        }
                    }

                    // 处理完成后 resolve
                    resolve(GM_getValue('branch_value'));
                },
                onerror: function (err) {
                    result = '接口请求失败，建议重新关闭开启脚本再试试';
                    GM_setValue('branch_value', result);
                    reject(err);
                }
            });
        });
    }

    //在jira页面添加跳转到分支按钮
    function addButtonJira() {
        // 创建分支按钮添加
        var span_create = $('<span class="search_span" id="search_span_create" style=""></span>')
        // 添加图片
        var search_image = "data:image/png;base64,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"
        var img = document.createElement('img');
        img.className = "myimg"
        img.src = search_image;
        span_create.append(img);
        $("#customfield_10303-val").after(span_create);
        // 解决分支按钮添加
        var span_solved = $('<span class="search_span" id="search_span_solved"></span>')
        var img2 = document.createElement('img');
        img2.className = "myimg"
        img2.src = search_image;
        span_solved.append(img2);
        $("#customfield_10304-val").after(span_solved);
    }

    // 正则表达式获取build号
    function getBuildId(elementId) {
        var create_build_content = document.getElementById(elementId).textContent.trim();
        var reg = /\d{4,}/g;
        var build_id_array = create_build_content.match(reg);
        var build_id = '';
        if (build_id_array == null || build_id_array.length == 0) {
            console.log("未识别到 build 号");
        } else {
            build_id = build_id_array[0];
            var reg_num = /\d{4,}/g;
            build_id = build_id.match(reg_num)[0].replace('#', '');
        }
        return build_id
    }

    // 根据不同的项目，Bug平台拼接url
    function getBaseUrl() {
        var baseUrl = '';
        var project_name = $('#project-name-val').text().trim(); // 项目名
        var platform = $('#customfield_10301-val').text().trim(); //平台
        // TODO：兼容不同的项目
        switch (platform) {
            case 'iOS':
                baseUrl = 'https://omnibus.meitu-int.com/apps/' + project_ios_omnibus[project_name] + ':ios/build/number/'
                break;
            case 'Android':
                baseUrl = 'https://omnibus.meitu-int.com/apps/' + project_android_omnibus[project_name] + ':android/build/number/'
                break;
            default:
                baseUrl = 'https://omnibus.meitu-int.com/apps/' + project_android_omnibus[project_name] + ':android/build/number/'
        }
        return baseUrl;
    }

    // 在创建Bug页面添加Bug模版（iOS、Android、Web）按钮
    function addChangeSideButton() {
        // 创建分支按钮添加
        var btn_ios = $('<button class="ios aui-button" id="change_side_ios" type="button" style="">iOS</button>')
        var btn_android = $('<button class="android aui-button" id="change_side_android" type="button" style="">Android</button>')
        var btn_web = $('<button class="web aui-button" id="change_side_web" type="button" style="">Web</button>')
        var btn_once_again = $('<button class="once-again aui-button" id="once-again" type="button" style="">再提一个</button>')
        $(".jira-dialog-content").find(".form-footer").append(btn_ios).append(btn_android).append(btn_web).append(btn_once_again)
    }

    // 点击按钮更换Bug模版，如：iOS、Android、Web
    function changeBugPlatform(platform) {
        var project_name = $('#project-name-val').text().trim(); // 项目名
        switch (project_name) {
            case "美图秀秀":
                if (platform == "iOS") {
                    // document.getElementById('customfield_12903-1').checked = true
                    document.getElementById('customfield_10301-2').checked = true
                } else if (platform == "Android") {
                    // document.getElementById('customfield_12903-1').checked = true
                    document.getElementById('customfield_10301-1').checked = true
                } else if (platform == "Web") {
                    // document.getElementById('customfield_12903-1').checked = true
                    document.getElementById('customfield_10301-3').checked = true
                }
                break;
            case "美图秀秀Starii":
                if (platform == "iOS") {
                    document.getElementById('customfield_10301-2').checked = true
                } else if (platform == "Android") {
                    document.getElementById('customfield_10301-1').checked = true
                } else if (platform == "Web") {
                    document.getElementById('customfield_10301-3').checked = true
                }
                break;
            default:
                if (platform == "iOS") {
                    document.getElementById('customfield_10301-2').checked = true
                } else if (platform == "Android") {
                    document.getElementById('customfield_10301-1').checked = true
                } else if (platform == "Web") {
                    document.getElementById('customfield_10301-3').checked = true
                }
        }


        // 获取当前的月份和日期
        const date = new Date()
        const today = date.getDate()
        const curmonth = date.getMonth() + 1
        // 获取大于且最接近当前日期的版本
        let minNum = 99
        let similarDate = ""

        // 获取 <optgroup> 元素
        let optgroup = $('.aui-field-versionspicker').find('.multi-select-select').find('[label="未发布版本"]')[0]
        // 获取 <option> 元素集合
        let options = optgroup.getElementsByTagName("option");
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let text = option.textContent.trim();
            if (text.toLowerCase().indexOf(platform.toLowerCase()) < 0) {
                continue;
            } else {
                // console.log(text);//打印获取到的版本号
                let startNum = text.lastIndexOf("(") !== -1 ? text.lastIndexOf("(") : text.lastIndexOf("（");
                let endNum = text.lastIndexOf(")") !== -1 ? text.lastIndexOf(")") : text.lastIndexOf("）");
                // theDateStr是形似「1109」的日期形式，下面拆分出月份和日期; theMonth形如「02」,theDate形如「18」
                // theDateStr还有可能是「11.9」的形式，需要对有无小数点进行判断
                // 2024-11-05-调整，theDateStr改为[11/5]的形式
                let theDateStr = text.slice(startNum + 1, endNum)
                console.log(theDateStr)
                let theMonth = ""
                let theDate = ""
                if (theDateStr.includes('.')) {
                    // 使用 split 方法分割小数点前后的数字
                    let parts = theDateStr.split(".");
                    // 获取小数点前面的数字
                    theMonth = parts[0];
                    // 获取小数点后面的数字
                    theDate = parts[1];
                } else if (theDateStr.includes('/')) {
                    let parts = theDateStr.split("/");
                    theMonth = parts[0];
                    theDate = parts[1];
                } else {
                    theMonth = parseInt(theDateStr.slice(4, 6))// 2022-12-11调整，theDateStr变为20221109的形式，所以调整slice的区间；原本为（0，2）（2）
                    theDate = parseInt(theDateStr.slice(6))
                }
                if (theMonth < curmonth && theMonth !== "1") {
                    continue;
                } else if (theMonth == curmonth) {
                    if (theDate - today >= 0 && theDate - today < minNum) {
                        similarDate = theDateStr
                        minNum = theDate - today
                    }
                } else if (theMonth == curmonth + 1 || theMonth == curmonth - 11) {
                    let monthDuration = getDuration()
                    let daysToEnd = monthDuration - today
                    if ((Number(theDate) + Number(daysToEnd)) < minNum) {
                        similarDate = theDateStr
                        minNum = Number(theDate) + Number(daysToEnd)
                    }
                }
            }

        }

        // console.log(similarDate)
        // 删掉「影响版本」文本框中的内容
        let div = document.getElementsByClassName('representation')[0]
        let emarr = div.getElementsByTagName('em')
        for (let i = 0; i < emarr.length; i++) {
            // 这里全部都点击的emmarr[0]，是因为第一个节点被删除掉之后，后面的素材会顶上来成为新的第0位节点，加个200ms延时，避免点击不到
            sleep(200).then(() => {
                emarr[0].click()
            })
        }

        // 在「影响版本」文本框填入内容
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let text = option.textContent.trim();
            // 如果a节点当中，存在目标日期字段，且平台与点击的一致，就把a节点的text填入到文本框中
            if (text.indexOf(similarDate) > 0 && text.toLowerCase().indexOf(platform.toLowerCase()) > 0) {
                $("#versions-textarea").val(text)
                // 获取控件焦点
                $("#versions-textarea").focus()
                // 主动失去当前控件的焦点
                $("#versions-textarea").blur()
            }
        }
    }

    // 获取当前月份有多少天
    function getDuration() {
        let dt = new Date()
        var month = dt.getMonth()
        dt.setMonth(dt.getMonth() + 1)
        dt.setDate(0)
        return dt.getDate()
    }

    // sleep方法，用于延迟一些操作
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    // 当是CF域名时，才触发后续的操作，如果不是则不触发
    // CF
    // CF
    // CF
    if (location.href.indexOf('cf.meitu.com') > 0) {
        // 获取ul元素
        var menuBars = document.getElementsByClassName("ajs-menu-bar");
        var menuBar = menuBars[0];

        // 创建两个li元素
        var li1 = document.createElement("li");
        var li2 = document.createElement("li");
        li1.className = "ajs-button normal"
        li2.className = "ajs-button normal"

        // 创建两个button元素
        var button1 = document.createElement("button");
        var button2 = document.createElement("button");

        // 设置按钮文本
        button1.textContent = "复制Android需求";
        button2.textContent = "复制iOS需求";

        // 设置按钮ID
        button1.id = "Android"
        button2.id = "iOS"

        // 设置按钮Class
        button1.className = "aui-button aui-button-subtle edit"
        button2.className = "aui-button aui-button-subtle edit"

        // 将button元素添加到li元素中
        li1.appendChild(button1);
        li2.appendChild(button2);

        // 将li元素添加到ul元素中
        menuBar.appendChild(li1);
        menuBar.appendChild(li2);

        // 将li元素放在menuBar的最前
        menuBar.insertBefore(li2, menuBar.firstChild);
        menuBar.insertBefore(li1, menuBar.firstChild);

        getRequirementArray("Android");
        getRequirementArray("iOS");
    }


    /**
     * 为平台特定按钮添加点击事件监听器，根据表格中的复选框状态收集需求名称并复制到剪贴板。
     * 
     * @function getRequirementArray
     * @param {string} platform - 平台标识符（"Android"或"iOS"），用于查找按钮元素
     * @description 当指定平台按钮被点击时，此函数将：
     *   1. 扫描需求表格中的已勾选项目
     *   2. 将需求名称收集到特定平台的数组中
     *   3. 根据特定规则处理"中间架构"需求：
     *      - 排除包含"底层先行"的项目
     *      - 根据平台特定文本将项目路由到适当的平台数组
     *   4. 将收集的需求复制到剪贴板
     * @requires getArrayByCheckedLi - 根据复选框状态将需求添加到数组的辅助函数
     * @requires copyArrayToClipboard - 将数组复制到剪贴板的辅助函数
     */
    function getRequirementArray(platform) {
        // 获取相应的按钮
        var platformButton = document.getElementById(platform);
        // 添加点击事件处理程序
        platformButton.addEventListener("click", function (event) {
            // 创建一个空数组，用于存储每个需求名称
            var androidArray = [];
            var iosArray = [];
            // 记录每个需求所处的列数,用于获取打勾状态
            var androidTd = findColumnIndex('Android') + 1;
            var iosTd = findColumnIndex('iOS') + 1;
            var cppTd = findColumnIndex('中间架构') + 1;

            // 获取具有aria-live属性为"polite"的tbody元素
            var politeTbodies = document.querySelectorAll('tbody[aria-live="polite"]');
            politeTbodies.forEach(function (tbody) {
                // 获取tbody下的所有tr元素
                var rows = tbody.querySelectorAll('tr');
                // 遍历tr
                rows.forEach(function (row) {
                    // 从tr中找到a元素，直接获取需求名称
                    var anchorElement = row.querySelector('a');
                    const secondTdText = anchorElement ? anchorElement.textContent.trim() : undefined;

                    // Android有打勾的项目放入Android数组
                    getArrayByCheckedLi(row, androidTd, secondTdText, androidArray)
                    // iOS有打勾的项目放入iOS数组
                    getArrayByCheckedLi(row, iosTd, secondTdText, iosArray)
                    // 中间架构有打勾的项目放入双端数组
                    let blackWord = '底层先行';
                    // 需求名称中不含“底层先行”的可放入
                    if (secondTdText && secondTdText.indexOf(blackWord) === -1) {
                        let platformAndroid = "Android";
                        let platformiOS = "iOS";
                        // 不含Android含有iOS的，放入iOS数组
                        if (secondTdText.indexOf(platformAndroid) === -1 && secondTdText.indexOf(platformiOS) !== -1) {
                            getArrayByCheckedLi(row, cppTd, secondTdText, iosArray);
                            // 不含iOS，含有Android的放入Android数组
                        } else if (secondTdText.indexOf(platformAndroid) !== -1 && secondTdText.indexOf(platformiOS) === -1) {
                            getArrayByCheckedLi(row, cppTd, secondTdText, androidArray);
                        } else {
                            // 其余的两个数组都放入
                            getArrayByCheckedLi(row, cppTd, secondTdText, androidArray);
                            getArrayByCheckedLi(row, cppTd, secondTdText, iosArray);
                        }
                    }

                });
            });
            var buttonPlatform = event.target.id;
            if (buttonPlatform === "Android") {
                copyArrayToClipboard(androidArray);
            } else if (buttonPlatform === "iOS") {
                copyArrayToClipboard(iosArray);
            }
        });
    }

    /**
     * 查找表头中包含指定字符串的单元格位置
     * @param {string} columnName - 要查找的列名
     * @return {number} - 列的索引位置(从0开始)，如果未找到则返回-1
     */
    function findColumnIndex(columnName) {
        // 获取所有表头单元格
        const headerCells = document.querySelectorAll('th.confluenceTh');

        // 遍历查找匹配的列
        for (let i = 0; i < headerCells.length; i++) {
            // 获取表头单元格中的内部div
            const headerInner = headerCells[i].querySelector('.tablesorter-header-inner');
            if (headerInner && headerInner.textContent.trim() === columnName) {
                return i; // 返回索引位置（从0开始）
            }
        }

        // 未找到匹配列
        console.log(`未找到包含"${columnName}"的列`);
        return -1;
    }


    // 获取tr元素中的第N个td元素，并检查其中的li元素是否为选中状态，选中的话则添加需求名字段到数组
    function getArrayByCheckedLi(row, tdNum, requirementName, array) {
        var tdElement = row.querySelector('td:nth-child(' + tdNum + ')');
        var liElement = tdElement.querySelector('li.checked');
        if (liElement) {
            addToUniqueArray(array, requirementName)
        }
    }


    // 往数组内添加不重复的元素
    function addToUniqueArray(arr, element) {
        if (arr.indexOf(element) === -1) {
            arr.push(element);
        }
    }


    // 将数组转化为字符串进行拷贝
    function copyArrayToClipboard(arr) {
        // 将数组转换为字符串
        var arrayString = arr.join('\n');  // 使用逗号和空格分隔数组元素

        // 创建一个新的textarea元素
        var textarea = document.createElement('textarea');

        // 设置textarea的值为数组转换后的字符串
        textarea.value = arrayString;

        // 将textarea元素添加到DOM中
        document.body.appendChild(textarea);

        // 选中textarea中的文本
        textarea.select();

        try {
            // 尝试执行复制操作
            document.execCommand('copy');
            console.log('数组已复制到剪贴板');
        } catch (err) {
            console.error('复制到剪贴板失败: ', err);
        } finally {
            // 移除textarea元素
            document.body.removeChild(textarea);
            // js提示复制成功
            showCopySuccessMessage()
        }
    }

    /**
     * 复制成功提示
     */
    function showCopySuccessMessage() {
        // 创建一个提示框
        var messageBox = document.createElement('div');
        messageBox.textContent = '复制成功！';
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        messageBox.style.padding = '10px';
        messageBox.style.background = '#4CAF50';
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '5px';
        messageBox.style.zIndex = '9999';

        // 将提示框添加到DOM中
        document.body.appendChild(messageBox);

        // 2秒后移除提示框
        setTimeout(function () {
            document.body.removeChild(messageBox);
        }, 2000);
    }

    function showtipsMessage(textContent, background) {
        // 创建一个提示框
        var messageBox = document.createElement('div');
        messageBox.textContent = textContent;
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        messageBox.style.padding = '10px';
        messageBox.style.background = background;
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '5px';
        messageBox.style.zIndex = '9999';

        // 将提示框添加到DOM中
        document.body.appendChild(messageBox);

        // 3秒后移除提示框
        setTimeout(function () {
            document.body.removeChild(messageBox);
        }, 3000);
    }

    // Your code here...


})();