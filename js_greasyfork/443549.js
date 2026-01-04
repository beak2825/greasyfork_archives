// ==UserScript==
// @name         Soul+Linker
// @name:en         Soul+Linker
// @name:zh         Soul+Linker
// @namespace    Xiccnd@qq.com
// @version      1.3.10
// @description  用于魂+和DLsite之间的快速跳转，同时让魂+使用起来更加方便
// @description:en  Used for quick jumps between Soul+ and DLsite, while making Soul+ more convenient to use
// @description:zh  用于魂+和DLsite之间的快速跳转，同时让魂+使用起来更加方便
// @author       Xiccnd

// @license      GPL-3.0 License

// @include        *://white-plus.net/*
// @include        *://snow-plus.net/*
// @include        *://level-plus.net/*
// @include        *://east-plus.net/*
// @include        *://south-plus.net/*
// @include        *://north-plus.net/*
// @include        *://spring-plus.net/*
// @include        *://summer-plus.net/*
// @include        *://imoutolove.me/*
// @include        *://blue-plus.net/*

// @include        *//www.dlsite.com*product_id/*

// @include        *://www.white-plus.net/*
// @include        *://www.snow-plus.net/*
// @include        *://www.level-plus.net/*
// @include        *://www.east-plus.net/*
// @include        *://www.south-plus.net/*
// @include        *://www.north-plus.net/*
// @include        *://www.spring-plus.net/*
// @include        *://www.summer-plus.net/*
// @include        *://bbs.imoutolove.me/*
// @include        *://www.blue-plus.net/*

// @exclude        *://www.white-plus.net/index.php
// @exclude        *://www.snow-plus.net/index.php
// @exclude        *://www.level-plus.net/index.php
// @exclude        *://www.east-plus.net/index.php
// @exclude        *://www.south-plus.net/index.php
// @exclude        *://www.north-plus.net/index.php
// @exclude        *://www.spring-plus.net/index.php
// @exclude        *://www.summer-plus.net/index.php
// @exclude        *://bbs.imoutolove.me/index.php
// @exclude        *://www.blue-plus.net/index.php

// @exclude        *://www.white-plus.net/
// @exclude        *://www.snow-plus.net/
// @exclude        *://www.level-plus.ne/
// @exclude        *://www.east-plus.net/
// @exclude        *://www.south-plus.net/
// @exclude        *://www.north-plus.net/
// @exclude        *://www.spring-plus.net/
// @exclude        *://www.summer-plus.net/
// @exclude        *://bbs.imoutolove.me/
// @exclude        *://www.blue-plus.net/

// @exclude        *://white-plus.net/index.php
// @exclude        *://snow-plus.net/index.php
// @exclude        *://level-plus.net/index.php
// @exclude        *://east-plus.net/index.php
// @exclude        *://south-plus.net/index.php
// @exclude        *://north-plus.net/index.php
// @exclude        *://spring-plus.net/index.php
// @exclude        *://summer-plus.net/index.php
// @exclude        *://imoutolove.me/index.php
// @exclude        *://blue-plus.net/index.php

// @exclude        *://white-plus.net/
// @exclude        *://snow-plus.net/
// @exclude        *://level-plus.ne/
// @exclude        *://east-plus.net/
// @exclude        *://south-plus.net/
// @exclude        *://north-plus.net/
// @exclude        *://spring-plus.net/
// @exclude        *://summer-plus.net/
// @exclude        *://imoutolove.me/
// @exclude        *://blue-plus.net/

// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://cdn.jsdelivr.net/gh/Xiccnd/Xiccnd-Pic@master/20220421113011992.1vh7zbll47r4.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443549/Soul%2BLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/443549/Soul%2BLinker.meta.js
// ==/UserScript==

$(function () {

    'use strict'

    /*
    * 设置全局变量,开头加前缀避免重名
    * */

    //设置检查规则
    const XICCND_CHECK_RJ = new RegExp('RJ[0-9]{6}')
    const XICCND_CHECK_DL = new RegExp('dlsite')
    const XICCND_CHECK_SEARCH = new RegExp('search.php[?]keyword-RJ[0-9]{6}')

    //设置跳转魂+域名
    const XICCND_WEBSITE = 'blue-plus.net'

    /*
    * 开关插件功能
    * */

    //开启跳转和图片预览功能
    xiccndRJ()

    //开启网站清爽模式,建议配合Soul+Cleaner和Soul++图墙自动打开一起使用
    //xiccndCleanMode()

    //开启去除文章广告，会导致无法列表模式观看，建议图墙用户开启
    //xiccndCleanList()

    //开启DLsite跳转魂+搜索
    xiccndRJSearch()

    //开启魂+内部跳转
    xiccndInnerJump()

    /*
    * 跳转
    * */
    function xiccndRJ() {
        //获取标题
        const XICCND_TITLE = $('h1#subject_tpc.fl').html()

        //创建复制按钮
        const COPY_BUTTON = "<button id='copy_button' style='display: none; margin-left: 10px; cursor: pointer' onclick='return false'>复制标题</button>"

        //标题后中添加复制按钮
        if ($('button#copy_button') > 0) {
            console.log('复制按钮已存在')
        } else {
            $('h1#subject_tpc.fl').append(COPY_BUTTON)
        }

        $('h1#subject_tpc.fl').on('click', function () {
            $('button#copy_button').stop().toggle(300)
        })

        $('button#copy_button').on('click', function () {
            // 创建元素用于复制
            const aux = document.createElement('input')
            // 获取复制内容
            let content = XICCND_TITLE.substr(0,XICCND_TITLE.indexOf('<div class'))
            //判断凛+div元素添加上没有
            if (XICCND_TITLE.indexOf('<div class') === -1) {
                content = XICCND_TITLE
            }
            // 设置元素内容
            aux.setAttribute('value', content)
            // 将元素插入页面进行调用
            document.body.appendChild(aux)
            // 复制内容
            aux.select()
            // 将内容复制到剪贴板
            document.execCommand('copy')
            // 删除创建元素
            document.body.removeChild(aux)

            alert('标题已复制\n' + content)
        })
        //检查标题是否含有RJ号
        if (XICCND_CHECK_RJ.test(XICCND_TITLE)) {//如果含有
            //获取RJ号
            let RJ = XICCND_TITLE.substr(XICCND_TITLE.indexOf("RJ"), 8)

            let RJPre
            let RJBody

            //如果RJ号10位
            if (RJ.substr(2, 1) === "0") {
                RJ = XICCND_TITLE.substr(XICCND_TITLE.indexOf("RJ"), 10)
                //合成路径
                RJPre = RJ.substr(0, 6)
                RJBody = parseInt(RJ.substr(6, 1)) + 1

                if (RJBody === 10) {//当RJBody为9时，RJBody要变为0，前一个数字加1
                    RJPre = RJPre.substr(0, 5) + (parseInt(RJPre.substr(5, 1)) + 1)
                    RJBody = 0
                }
            } else {//RJ号8位
                //合成路径
                RJPre = RJ.substr(0, 4)
                RJBody = parseInt(RJ.substr(4, 1)) + 1

                if (RJBody === 10) {//当RJBody为9时，RJBody要变为0，前一个数字加1
                    RJPre = RJPre.substr(0, 3) + (parseInt(RJPre.substr(3, 1)) + 1)
                    RJBody = 0
                }
            }


            const RJSRC = RJPre + RJBody + '000'
            //合成图片地址
            const SRC = '//img.dlsite.jp/modpub/images2/work/doujin/' + RJSRC + '/' + RJ + '_img_main.jpg'
            //创建图片
            const IMG = '<img id="xiccndImg" style="display: none; width: 15%; position: absolute; left: 1%;top: 10px;border: 5px dashed pink" alt= "NoImg" src= ' + '"' + SRC + '"' + '>'

            //网页中添加图片
            if ($('img#xiccndImg') > 0) {
                console.log('预览图已存在')
            } else {
                $('body').append(IMG)
            }

            $("h1#subject_tpc.fl").on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('color', 'pink')
            }).on('mouseout', function () {
                $(this).css('color', '#bbbbbb')
            }).on('click', function (event) {
                //获取当前鼠标的坐标
                const mouse_x = event.pageX + "px"
                const mouse_y = event.pageY + "px"

                //如果图片隐藏时可改变图片位置
                if ($('img#xiccndImg').css('display') === 'none') {
                    $('img#xiccndImg').css({
                        left: mouse_x,
                        top: mouse_y
                    })
                }

                $('img#xiccndImg').stop().toggle(300)
            })
            //跳转网页
            $('img#xiccndImg').on('click', function () {
                window.open("https://www.dlsite.com/maniax/work/=/product_id/" + RJ + ".html");
            }).on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('border', '5px dashed plum')
            }).on('mouseout', function () {
                $(this).css('border', '5px dashed pink')
            })
        } else {//如果不含有
            //检查是否已存在表单
            if (!($('form#xiccndSearchForm').size > 0)) {
                //生成跳转表单
                const SEARCHBAR = '<input id="xiccndSearchbar" type="text" value="RJ" placeholder="请输入RJ号" style="width: 100px; height: 20px; margin-left: 5px"/>'
                const BUTTON = '<input id="xiccndSearchbarButton" type="submit" value="跳转" style="height: 25px; margin-left: 5px"/>'
                const FORM = '<form id="xiccndSearchForm" action="" style="display: none">' + SEARCHBAR + BUTTON + '</form>'
                //添加生成表单
                $('div.h1.fl').append(FORM)
            }
            //标题点击效果
            $("h1#subject_tpc.fl").on('click', function () {
                $('form#xiccndSearchForm').stop().toggle(500)
            }).on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('color', 'plum')
            }).on('mouseout', function () {
                $(this).css('color', '#bbbbbb')
            })
            //跳转按钮效果
            $('input#xiccndSearchbarButton').on('mouseover', function () {
                $(this).css('cursor', 'pointer')
            }).on('click', function () {
                //获取搜索框内值
                let searchRJ = $('input#xiccndSearchbar').val()

                //判断RJ号
                while (!(XICCND_CHECK_RJ.test(searchRJ))) {
                    if (searchRJ === '') {
                        searchRJ = prompt('RJ号为空，请重新输入！')
                    } else if (searchRJ == null) {//点击取消
                        break
                    } else {
                        searchRJ = prompt('RJ号不规范，请重新输入！')
                    }
                }

                //判断是否点击取消，否的话跳转
                if (searchRJ != null) {
                    $('form#xiccndSearchForm').attr('action', 'https://www.dlsite.com/maniax/work/=/product_id/' + searchRJ + '.html')
                } else {
                    return false
                }
            })
        }
    }

    /*
    * 去除文章广告
    * */
    function xiccndCleanMode() {
        //去除页头广告
        $('div#header div').eq(-2).remove()
        //去除网页头部
        $('td.banner').remove()
        //去除网页底部
        $('div#main>div.t_one').remove()
        $('div#footer').remove()
        //去除公告
        $('div.gonggao').remove()
    }

    /*
    * 去除文章广告
    * */
    function xiccndCleanList() {
        $('table#ajaxtable>tbody').eq(1).remove()
    }

    /*
    * DLsite跳转魂+搜索
    * */
    function xiccndRJSearch() {
        //获取当前网址
        const URL = window.location.href

        //检查是否为DLsite网站
        if (XICCND_CHECK_DL.test(URL)) {
            //改作品名称可选
            $('#work_name').css('user-select', 'auto')

            //添加搜索按钮
            const SEARCH_BUTTON = "<button id='xiccnd_search_button' style='margin-left: 10px; background-color: white; border: pink dashed 3px; border-radius: 10px' >跳转搜索</button>"
            $('#work_name').append(SEARCH_BUTTON)

            //截取RJ号
            let RJ = URL.substr(URL.indexOf("RJ"), 8)

            //判断是否10位RJ号
            if (RJ.substr(2,1) === "0") {
                RJ = URL.substr(URL.indexOf("RJ"), 10)
            }

            //设置1s1check
            setInterval(skip_adult_check,1000)

            //如果出现成人检查直接切换网址
            function skip_adult_check() {
                if($('.adult_check_box').length != 0) {
                    window.location.replace('https://www.dlsite.com/maniax/work/=/product_id/' + RJ + '.html')
                }
            }

            $('button#xiccnd_search_button').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('border', 'plum dashed 3px')
            }).on('mouseout', function () {
                $(this).css('border', 'pink dashed 3px')
            }).on('click', function () {//带RJ号跳转搜索页面
                window.open('https://' + XICCND_WEBSITE + '/search.php?keyword-' + RJ)
            })
        } else if (XICCND_CHECK_SEARCH.test(URL)) {//检查是否为搜索界面
            //截取RJ号
            let SEARCH_RJ = URL.substr(URL.indexOf("RJ"), 8)

            //判断是否10位RJ号
            if (SEARCH_RJ.substr(2,1) === "0") {
                SEARCH_RJ = URL.substr(URL.indexOf("RJ"), 10)
            }

            //在搜索框填入RJ号
            $('input.input[name="keyword"]').val(SEARCH_RJ)
            //改搜索条件为所有主题帖
            $('select[name="sch_time"]>option[value="all"]').attr('selected', 'selected')
            //点击搜索按钮
            $('input.btn[value="提 交"]').trigger('click')
        }
    }

    /*
    * 魂+内部跳转
    * */
    function xiccndInnerJump() {
        //获取当前网址
        const URL = window.location.href

        //如果是同人音声
        if (URL.indexOf('fid-128.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">同人音声<span style="float: right; margin-top: 3px; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">COSPLAY</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是茶馆
        if (URL.indexOf('fid-9.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">茶馆<span style="float: right; margin-top: 3px; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">COSPLAY</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是询问&求物
        if (URL.indexOf('fid-48.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">询问&求物<span style="float: right; margin-top: 3px; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">COSPLAY</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是GALGAME
        if (URL.indexOf('fid-135.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">GALGAME<span style="float: right; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">COSPLAY</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是游戏资源
        if (URL.indexOf('fid-6.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">游戏资源<span style="float: right; margin-top: 3px; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">COSPLAY</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是COSPLAY
        if (URL.indexOf('fid-201.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">COSPLAY<span style="float: right; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border: pink dashed 3px; display: none">实用动画</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-4.html'
            })
        }

        //如果是实用动画
        if (URL.indexOf('fid-4.html') > 0) {
            const JUMP_DIV = '<div id="jump_div" style="position: fixed; left: 0; top: 10px; color: black; font-size: 2em; text-align: center; user-select: none">' +
                '<ul style="list-style-type: none; width: 200px">' +
                '<li style="border: pink dashed 3px">实用动画<span style="float: right; margin-top: 3px; margin-right: 7px; width: 17px">&#8711;</span></li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">茶馆</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">同人音声</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">询问&求物</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; border-bottom: pink dashed 3px; display: none">GALGAME</li>' +
                '<li style="border-left: pink dashed 3px; border-right: pink dashed 3px; display: none">游戏资源</li>' +
                '<li style="border: pink dashed 3px; display: none">COSPLAY</li>' +
                '</ul>' +
                '</div>'
            //判断跳转div元素是否存在
            if ($('div#jump_div').size > 0) {
                console.log('跳转列表已存在')
            } else {
                //添加div
                $('body').append(JUMP_DIV)
            }

            $('div#jump_div li').on('mouseover', function () {
                $(this).css('cursor', 'pointer').css('background-color', 'rgba(255,255,255,0.2)')
            }).on('mouseout', function () {
                $(this).css('background-color', 'transparent')
            }).eq(0).on('click', function () {
                if ($(this).next('li').css('display') === 'none') {
                    $('div#jump_div li').stop().slideDown(300)
                    $(this).find('span').html('&#916;')
                } else {
                    $('div#jump_div li').not(':first').stop().slideUp(300)
                    $(this).find('span').html('&#8711;')
                }
            }).end().eq(1).on('click', function () {
                window.location.href = 'thread_new.php?fid-9.html'
            }).end().eq(2).on('click', function () {
                window.location.href = 'thread_new.php?fid-128.html'
            }).end().eq(3).on('click', function () {
                window.location.href = 'thread_new.php?fid-48.html'
            }).end().eq(4).on('click', function () {
                window.location.href = 'thread_new.php?fid-135.html'
            }).end().eq(5).on('click', function () {
                window.location.href = 'thread_new.php?fid-6.html'
            }).end().eq(6).on('click', function () {
                window.location.href = 'thread_new.php?fid-201.html'
            })
        }

        /*
        * 实现拖动效果
        * */
        const DIV_DRAGABLE = $('div#jump_div')
        //绑定鼠标左键按住事件
        DIV_DRAGABLE.on('mousedown', function (event) {
            //获取需要拖动节点的坐标
            const offset_x = $(this)[0].offsetLeft//x坐标
            const offset_y = $(this)[0].offsetTop//y坐标
            //获取当前鼠标的坐标
            const mouse_x = event.pageX
            const mouse_y = event.pageY

            //绑定拖动事件
            $(document).on('mousemove', function (ev) {
                //拖动时禁用点击事件
                $('div#jump_div').css('pointer-events', 'none')
                //计算鼠标移动了的位置
                const _x = ev.pageX - mouse_x
                const _y = ev.pageY - mouse_y
                //设置移动后的元素坐标
                const now_x = (offset_x + _x) + "px";
                const now_y = (offset_y + _y) + "px";
                //改变目标元素的位置
                DIV_DRAGABLE.css({
                    top: now_y,
                    left: now_x
                })
            })
        })

        $(document).on('mouseup', function () {
            //恢复点击事件
            $('div#jump_div').css('pointer-events', 'auto')
            //当鼠标左键松开，解除事件绑定
            $(this).off('mousemove')
        })
    }
})

