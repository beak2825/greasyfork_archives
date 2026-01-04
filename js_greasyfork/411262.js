// ==UserScript==
// @name              兔兔兔区+
// @namespace         https://greasyfork.org/zh-CN/scripts/411262-%E5%85%94%E5%85%94%E5%85%94%E5%8C%BA
// @version           2.1.8
// @description       屏蔽用户|屏蔽帖子|ID统计|帖内搜索|发帖记录直达|快捷举报|楼主标记|只看TA|白色主题夜间主题去广告
// @author            chinshry
// @include           https://bbs.jjwxc.net/bindex.php*
// @include           https://bbs.jjwxc.net/board.php*
// @include           https://bbs.jjwxc.net/newpost.php*
// @include           https://bbs.jjwxc.net/showmsg.php*
// @include           https://bbs.jjwxc.net/search.php*
// @include           https://bbs.jjwxc.net/filterword.php*
// @include           https://bbs.jjwxc.net/backend/filterReader.php*
// @include           https://bbs.jjwxc.net/userinfo.php*
// @include           https://bbs.jjwxc.net/postbypolice.php*
// @license           GPL-3.0 License
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411262/%E5%85%94%E5%85%94%E5%85%94%E5%8C%BA%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/411262/%E5%85%94%E5%85%94%E5%85%94%E5%8C%BA%2B.meta.js
// ==/UserScript==


const IS_DARK_MODE = Boolean(Number(localStorage.getItem('themeJJ') == null ? 0 : localStorage.getItem('themeJJ')));
const bgColor = IS_DARK_MODE ? '#1A1A1A' : 'white';
const bgCss = { "background-color": bgColor };
const borderCss = { "border-color": bgColor, "border": "none" };

const pathname = window.location.pathname;
const IS_NEWPOST = pathname.indexOf('newpost') >= 0;
const IS_BOARD = IS_NEWPOST || pathname.indexOf('board') >= 0;
const IS_POST = pathname.indexOf('showmsg') >= 0;
const IS_SEARCH = pathname.indexOf('search') >= 0;
const IS_FILTER = pathname.indexOf('filterword') >= 0 || pathname.indexOf('filterReader') >= 0;

(function($) {
    'use strict';

    const BOARD_ID = IS_BOARD || IS_POST || IS_SEARCH ? getPageParams('board') : '';
    const POST_ID = IS_POST ? getPageParams('id') : '';
    const PAGE = IS_POST ? getPageParams('page') : '';
    const BOARD_TYPE = IS_BOARD ? getPageParams('type') : '';

    var page_count = 0
    var id_all = {}
    var reply_all = []
    var replyStrBody = ''
    var dataSortIndex = []

    console.log("BOARD_ID = " + BOARD_ID);
    console.log("POST_ID = " + POST_ID);

    var Style = {
        init() {
            if(IS_DARK_MODE){
                addGlobalStyle('*', { color: "#B2B2B2" });
            }
            addGlobalStyle('body', bgCss);
            addGlobalStyle('.blockUI.blockMsg', bgCss);
            addGlobalStyle('.blockUI.blockMsg', { border: "1px solid #000000" });
            addGlobalStyle('tr', bgCss);
            addGlobalStyle('td', bgCss);

            var themeChangeButton = document.createElement("div");
            themeChangeButton.className = "themeButton";
            themeChangeButton.style.cssText = "width:35px;height:35px;top: 20px;right: 15px;cursor:pointer;border:1px solid #666666;position: fixed;z-index: 10000; font-size: small;line-height: 35px;text-align: center;border-radius: 20px;";
            themeChangeButton.style.backgroundColor = 'white';
            themeChangeButton.style.color = 'black';
            themeChangeButton.textContent = "换肤";
            document.getElementsByTagName("body")[0].appendChild(themeChangeButton);
        },
        removeAD() {
            $('.width_300').parent().remove();
        },
        board() {
            Style.removeAD()
            const reportNode = document.createElement('script');
            reportNode.type = 'text/javascript';
            reportNode.src = '/scripts/userreport.js?ver=20200202';
            document.head.appendChild(reportNode);
            if (IS_NEWPOST){
                const blockUItNode = document.createElement('script');
                blockUItNode.type = 'text/javascript';
                blockUItNode.src = '//static.jjwxc.net/scripts/jquery.blockUI.pack.js';
                document.head.appendChild(blockUItNode);
            }

            addGlobalStyle('a:link', { color: IS_DARK_MODE ? '#b2b2b2' :'#161616' });
            addGlobalStyle('a:visited', { color: '#808080' });
            addGlobalStyle('a:hover', { color: '#bf7326' });

            addGlobalStyle('a.board-bam:link', { color: '#669900' });
            addGlobalStyle('a.board-bam:hover', { color: '#bf7326' });

            addGlobalStyle('a.board-report:link', { color: '#669900' });
            addGlobalStyle('a.board-report:hover', { color: '#bf7326' });
       },
        search() {
            Style.removeAD();
            addGlobalStyle('table', { "border-color": bgColor });
        },
        page() {
            addGlobalStyle('.page-reply:link', { color: IS_DARK_MODE ? '#b2b2b2' :'#000000' });
            addGlobalStyle('.page-reply:hover', { color: '#bf7326' });
            addGlobalStyle('.page-reply:visited', { color: '#808080' });
            addGlobalStyle('table', borderCss);
            addGlobalStyle('td', borderCss);
            for (var i = 1; i < 25; i++) {
                changeImgBg(i)
            }
            $('#imgurl').remove()
            $('.ad360_box').remove()
            $('.textbook').remove()
        },
        filter() {
            addGlobalStyle('b', { "margin-left": '15px' });
        },
        idCount(){
            var div_side_bar = document.createElement("div");
            div_side_bar.id = "countIDButton";
            div_side_bar.textContent = 'ID统计'
            div_side_bar.style.cssText = 'cursor: pointer;font-size: 12px;line-height: 20px;width: 56px;height: 20px;text-align: center;overflow: hidden;position: fixed;right: 0px;top: 70px;padding: 4px 4px;background-color: white;z-index: 10001;border-radius: 8px 0px 0px 8px;box-shadow: rgba(0, 85, 255, 0.0980392) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);';
            div_side_bar.style.color = 'black';
            $('#boardname').first().after(div_side_bar);

            var div_data = document.createElement("div");
            div_data.id = 'countIDList'
            div_data.style.cssText = 'display: none;position: fixed;height: 85%;width: 350px;right: 0px;top: 140px;z-index: 9999;';
            var div_data_inner = document.createElement("div");
            div_data_inner.id = 'countIDListInner'
            div_data_inner.style.cssText = 'display: block;overflow: hidden;height: inherit;border-radius: 8px;box-shadow: rgba(106, 115, 133, 0.219608) 0px 6px 12px 0px;border: 1px solid black ;background-color: white;overflow: auto; white-space: nowrap;';
            var div_data_text = document.createElement("div");
            div_data_text.id = 'countIDListText'
            div_data_text.style.cssText = 'padding: 10px; box-sizing: border-box;';

            div_data.append(div_data_inner);
            div_data_inner.append(div_data_text);

            document.body.appendChild(div_data);
        },
        postSearch(){
            var div_side_bar = document.createElement("div");
            div_side_bar.id = "postSearchButton";
            div_side_bar.textContent = '贴内搜索'
            div_side_bar.style.cssText = 'cursor: pointer;font-size: 12px;line-height: 20px;width: 56px;height: 20px;text-align: center;overflow: hidden;position: fixed;right: 0px;top: 105px;padding: 4px 4px;background-color: white;z-index: 10001;border-radius: 8px 0px 0px 8px;box-shadow: rgba(0, 85, 255, 0.0980392) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);';
            div_side_bar.style.color = 'black';
            $('#boardname').first().after(div_side_bar);


            var div_data = document.createElement("div");
            div_data.id = 'postSearchList'
            div_data.style.cssText = 'text-align:center; display: none;position: fixed;height: 85%;width: 710px;right: 0px;top: 140px;z-index: 9999;';
            var div_data_inner = document.createElement("div");
            div_data_inner.id = 'postSearchListInner'
            div_data_inner.style.cssText = 'padding: 10px; display: block;overflow: hidden;height: inherit;border-radius: 8px;box-shadow: rgba(106, 115, 133, 0.219608) 0px 6px 12px 0px;border: 1px solid black ;background-color: white;overflow: auto; white-space: nowrap;';
            var div_data_text = document.createElement("div");
            div_data_text.id = 'postSearchListText'
            div_data_text.style.cssText = 'box-sizing: border-box;';

            var div_data_input = document.createElement("input");
            div_data_input.id = 'postSearchInput'
            div_data_input.type = 'text'
            div_data_input.size = '10'
            var div_data_search_btn = document.createElement("input");
            div_data_search_btn.id = 'postSearchStart'
            div_data_search_btn.type = 'button'
            div_data_search_btn.style.cssText = 'margin: 10px 0px 20px 10px;';
            div_data_search_btn.value = '搜索'

            div_data.append(div_data_inner);
            div_data_inner.append(div_data_input);
            div_data_inner.append(div_data_search_btn);
            div_data_inner.append(div_data_text);

            document.body.appendChild(div_data);
        }
    }

    function addGlobalStyle(node, styleParams) {
        var styleStr = JSON.stringify(styleParams);
        var styleF = styleStr.replace(/"([^"]*)"/g, "$1").replace(/[,]/g, ' !important;').replace('}', ' !important}');
        var css = node + styleF;
        // console.log(css);
        var head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function changeImgBg(imgId) {
        var styleStr = JSON.stringify(styleParams)
        var styleParams = {
            "background-image": "url(img/grzx/" + imgId + ".png)",
            "background-size": "100%",
            "background-position": "0 0"
        }
        addGlobalStyle('.image' + imgId, styleParams);
    }

    function getPageParams(key, url) {
        var str = '';
        if (typeof (url) == "undefined") {
            var search = window.location.search;
            str = search.substring(1, search.length);
        } else {
            str = url.split("?")[1];
        }
        let arr = str.split("&");
        let obj = new Object();
        for (let i = 0; i < arr.length; i++) {
            let tmp_arr = arr[i].split("=");
            if (tmp_arr[0] == "keyword") {
                obj[tmp_arr[0]] = tmp_arr[1];
            } else {
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
        }
        return obj[key];
    }

    function initStyle() {
        Style.init();
        if (IS_BOARD) {
            Style.board();
        } else if (IS_POST) {
            Style.page();
            Style.idCount();
            Style.postSearch();
        } else if (IS_SEARCH) {
            Style.search();
        } else if (IS_FILTER) {
            Style.board();
            Style.filter();
        } else {
            Style.removeAD();
        }
    }

    $(function () {
        initStyle()
        var initNodes = {
            board() {
                $('#subidform_submit').find('button').eq(0).text("屏蔽设置");
                let nodes = $('#msglist').children().children().toArray();

                if (IS_NEWPOST){
                    nodes = $('body').find('table').eq(2).children().children().toArray();
                }
                let blockPosts = localStorage.BlockPosts || '';
                let blockUsers = localStorage.BlockUsers || '';
                nodes.shift();
                for (let node of nodes) {
                    let reportNode = $(node).find('td').eq(1);
                    let titleNode = $(node).find('td').eq(3);
                    let authorNode = $(node).find('td').eq(4);
                    let title = titleNode[0].innerText;
                    let url = $(titleNode).children().attr('href');
                    if (url == undefined) {
                        url = $(titleNode).children().eq(1).attr('href');
                    }
                    let id = getPageParams('id', url);
                    let authorName = $.trim($(authorNode).text())

                    $(reportNode).children().remove();
                    $(reportNode).append(`<a class="board-bam" id="${id}" board="${BOARD_ID}" data="${title}" href="javascript:void(0);" style = "font-size:14px">屏蔽</a>`);
                    $(reportNode).append(`<a class="board-report" href="javascript:;" onclick="userreportshow(${id}, 0, 0, ${BOARD_ID})" style = "font-size:14px">举报</a>`);
                    $(authorNode).html("");

                    $(authorNode).append(`<a class="board-author" href="https://bbs.jjwxc.net/search.php?act=search&board=${BOARD_ID}&keyword=${authorName}&topic=4" target="_blank">&nbsp${authorName}</font></a>`);

                    if (blockPosts !== '') {
                        var blockPostsJs = JSON.parse(blockPosts);
                        if (blockPostsJs.hasOwnProperty(id)) {
                            $(node).remove();
                            console.log("已隐藏帖子 " + title);
                        }
                    }
                    if (blockUsers !== '') {
                        var blockUsersJs = JSON.parse(blockUsers);
                        if (blockUsersJs.indexOf(authorName) != -1) {
                            $(node).remove();
                            console.log("已隐藏 " + authorName + " 发的帖子 " + title);
                        }
                    }
                }
            },
            page(start) {
                var lzIdenti = $('.authorname').eq(0).find('font').eq(2).text();
                console.log("楼主 " + lzIdenti);
                let title = $('#msgsubject').text().split("主题：")[1]
                let blockUsers = localStorage.BlockUsers || '';

                $('.authorname').each(function (index, node) {
                    if (index < start) {
                        return true;
                    }

                    var isNormalFloor = start == 0;
                    console.log("isNormalFloor = " + isNormalFloor);

                    var starNode;
                    if (isNormalFloor) {
                        starNode =  $(node).find('font').eq(-2);
                    } else {
                        starNode =  $(node).find('font').eq(-1);
                    }
                    $(starNode).text("  " + $(starNode).text().split("来自")[1]);

                    var replyIdNode;
                    var replyNameNode;
                    var replyName;

                    if (index == 0) {
                        var lzAuthornameNode = $('.authorname').eq(0);
                        replyIdNode = $(node).children().children().eq(2);
                        $(node).find('a').eq(0).after(`<a class="board-bam" id="${POST_ID}" board="${BOARD_ID}" data="${title}" href="javascript:void(0);" style = "font-size:14px; margin-left:8px">屏蔽该帖</a>`);
                        replyNameNode = $(replyIdNode).parent().contents()
                            .filter(function () {
                            return this.nodeType == Node.TEXT_NODE;
                        });
                    } else {
                        replyIdNode = $(node).children().eq(2);
                        replyNameNode = $(node).contents()
                            .filter(function () {
                            return this.nodeType == Node.TEXT_NODE;
                        });
                    }

                    if (index == 0) {
                        replyName = replyNameNode[0].wholeText.split("|")[0];
                        replyNameNode[1].replaceData(0, replyNameNode[1].length, replyNameNode[1].wholeText.split("留言")[0]);
                        $(replyNameNode)[0].remove();
                    } else if (!isNormalFloor) {
                        replyName = replyNameNode[2].wholeText.split("|")[0];
                        replyNameNode[3].replaceData(0, replyNameNode[3].length, replyNameNode[3].wholeText.split("留言")[0]);
                        $(replyNameNode)[2].remove();
                    } else {
                        replyName = replyNameNode[1].wholeText.split("|")[0];
                        replyNameNode[2].replaceData(0, replyNameNode[2].length, replyNameNode[2].wholeText.split("留言")[0]);
                        $(replyNameNode)[1].remove();
                    }

                    var displayName;

                    if ($(replyIdNode).text() == lzIdenti) {
                        displayName = "[楼主]" + replyName;
                        $(replyIdNode).prev().after(`<a class="page-reply" id="replyName_${replyName}" href="https://bbs.jjwxc.net/search.php?act=search&board=${BOARD_ID}&keyword=${replyName}&topic=4" target="_blank" style="text-decoration: underline; text-underline-offset: 4px;">${displayName}</a>`);
                    } else {
                        displayName = replyName;
                        $(replyIdNode).prev().after(`<a class="page-reply" id="replyName_${replyName}" href="https://bbs.jjwxc.net/search.php?act=search&board=${BOARD_ID}&keyword=${replyName}&topic=4" target="_blank">${displayName}</a>`);
                    }

                    if (index == 0) {
                        // $(".board-bam").after(`<a class="board-bam-user-temp" data="${replyName}" href="javascript:void(0);" style = "font-size:14px; margin-left:8px">隐藏TA</a>`);
                        // $(".board-bam").after(`<a class="board-bam-user" data="${replyName}" href="javascript:void(0);" style = "font-size:14px; margin-left:8px">屏蔽TA</a>`);
                    } else {
                        // $(node).next().prepend(`<a class="board-bam-user-temp" data="${replyName}" href="javascript:void(0);" style = "font-size:14px; margin-left:8px">隐藏TA</a>`);
                        // $(node).next().prepend(`<a class="board-bam-user" data="${replyName}" href="javascript:void(0);" style = "font-size:14px; margin-left:8px">屏蔽TA</a>`);
                        var authertParentNode = $(node).parent();
                        var buttonParentNode;
                        if (isNormalFloor) {
                            buttonParentNode = authertParentNode.next();
                        } else {
                            buttonParentNode = $(node).parent().clone();
                            authertParentNode.after(buttonParentNode);
                            authertParentNode.children().eq(1).remove();
                            buttonParentNode.children().eq(0).remove();
                            buttonParentNode.children().eq(0).attr("style", "text-align:right")
                        }
                        buttonParentNode.children().eq(0).append(`<a class="board-only-show-user" data="${replyName}" href="javascript:void(0);" style = "font-size:14px; margin-left:0px">只看TA</a>`);
                    }

                    if (blockUsers !== '') {
                        var blockUsersJs = JSON.parse(blockUsers);
                        if (blockUsersJs.indexOf(replyName) != -1) {
                            $(node).parent().prev().remove();
                            $(node).parent().prev().remove();
                            $(node).parent().next().remove();
                            $(node).parent().remove();
                            console.log("已屏蔽 " + replyName + " 的楼层 " + index);
                        }
                    }
                })
                page_count = $('.authorname').length
            },
            filter() {
                let oldTab = document.querySelector("body > center > b");
                $(oldTab).attr("class", "filter-bam-keyword");
                $(oldTab).attr("style", "font-size:20px");
                // $(oldTab).after(`<b class="filter-bam-user">屏蔽用户设置</b>`);
                $(oldTab).after(`<b class="filter-bam-post">屏蔽帖子设置</b>`);
            }
        }

        var Event = {
            addBlockPost(node) {
                let id = $(node).attr('id')
                let title = $(node).attr('data').split("[2]")[0]
                let board = $(node).attr('board')
                console.log($('#boardtr_' + id).length)
                if (IS_NEWPOST){
                    $(node).parent().parent().parent().parent().parent().parent().remove();
                } else {
                    $('#boardtr_' + id).remove();
                }

                let arr = localStorage.getItem('BlockPosts') ? JSON.parse(localStorage.getItem('BlockPosts')) : {};
                arr[id] = [board, title]
                localStorage.setItem('BlockPosts', JSON.stringify(arr));
            },
            onlyShowUser(node) {
                let name = $(node).attr('data')
                let newNode = $(".page-reply:not(#replyName_" + name + ")");
                $(newNode).parent().parent().prev().remove();
                $(newNode).parent().parent().prev().remove();
                $(newNode).parent().parent().next().remove();
                $(newNode).parent().parent().next().remove();
                $(newNode).parent().parent().remove();
            },
            addBlockUserTemp(node) {
                let name = $(node).attr('data')
                let newNode = $('#replyName_' + name);
                $(newNode).parent().parent().prev().remove();
                $(newNode).parent().parent().prev().remove();
                $(newNode).parent().parent().next().remove();
                $(newNode).parent().parent().next().remove();
                $(newNode).parent().parent().remove();
            },
            addBlockUser(node) {
                let name = $(node).attr('data')
                Event.addBlockUserTemp(node);

                let arr = localStorage.getItem('BlockUsers') ? JSON.parse(localStorage.getItem('BlockUsers')) : [];
                if (arr.indexOf(name) == -1) {
                    arr.unshift(name)
                    localStorage.setItem('BlockUsers', JSON.stringify(arr));
                }
            },
            showBlockUser(node) {
                $(node).attr("style", "font-size:20px");
                $(node).siblings().attr("style", "font-size:16px");
                let arr = localStorage.getItem('BlockUsers') ? JSON.parse(localStorage.getItem('BlockUsers')) : [];
                console.log(arr);

                $("table").eq(1).attr("style", "visibility:hidden");
                let blockTable = $("table").eq(2).children().toArray()[0]
                $(blockTable).parent().next().attr("style", "visibility:hidden");

                let tips = $(blockTable).parent().next().next().next().find('tr').eq(0)
                tips.html(`<td>温馨提示：<br>1、在帖子的楼层中点“屏蔽TA”的用户名会被添加到该列表，刷新仍旧有效。<br>2、而帖子的楼层中点“隐藏TA”只临时隐藏当前贴中该用户的回复楼层，刷新失效。<br>3、列表中的用户，会屏蔽该用户名所发的帖子，并屏蔽帖子中该用户名回复的楼层<br><br></td>`)

                let blockTrs = $(blockTable).children().toArray()
                let tableTab = '<tr align="center" id="filtertablehead">' +
                    '<td style="font-weight: 700;width: 70%">屏蔽用户名</td>' +
                    '<td style="font-weight: 700;width: 30%">操作</td>' +
                    '</tr>'
                for (let blockTr of blockTrs) {
                    blockTr.remove()
                }
                $(blockTable).append($(tableTab))
                if (arr.length != 0) {
                    let html =''
                    for(let userName of arr){
                        html += '<tr align="center" id="' + userName + '">' +
                            '     <td  style="width: 70%"><a href="https://bbs.jjwxc.net/search.php?act=search&board=2&keyword='+ userName + '&topic=4" target="_blank">' + userName + '</a></td>' +
                            '     <td style="width: 30%"><button class="filter-bam-user-del" data="' + userName + '">解除屏蔽</button></td>' +
                            '</tr>'
                    }
                    $(blockTable).append($(html))
                }
            },
            showBlockPost(node) {
                $(node).attr("style", "font-size:20px");
                $(node).siblings().attr("style", "font-size:16px");
                let arr = localStorage.getItem('BlockPosts') ? JSON.parse(localStorage.getItem('BlockPosts')) : {};
                console.log(arr);

                let tableIndex = 2
                if (pathname.indexOf('filterword') >= 0) {
                    tableIndex = 3
                    $("table").eq(tableIndex - 2).attr("style", "display:none");
                }

                $("table").eq(tableIndex - 1).attr("style", "display:none");
                let blockTable = $("table").eq(tableIndex).children().toArray()[0]
                $(blockTable).parent().next().attr("style", "visibility:hidden");
                let tips = $(blockTable).parent().next().next().next().find('tr').eq(0)
                tips.html(`<td>温馨提示：<br>在主页点击“屏蔽”和帖子首楼点击“屏蔽此贴”的帖子会被添加到该列表，刷新仍旧有效。<br><br></td>`)

                let blockTrs = $(blockTable).children().toArray()
                let tableTab = '<tr align="center" id="filtertablehead">' +
                    '<td style="font-weight: 700;width: 20%">帖子ID</td>' +
                    '<td style="font-weight: 700;width: 70%">帖子标题</td>' +
                    '<td style="font-weight: 700;width: 10%">操作</td>' +
                    '</tr>'
                for (let blockTr of blockTrs) {
                    blockTr.remove()
                }
                $(blockTable).append($(tableTab))
                if (arr.length != 0) {
                    let html =''
                    for(let postId in arr){
                        let boardId = arr[postId][0]
                        let postTitle = arr[postId][1]
                        html = '<tr align="center" id="' + postId + '">' +
                            '<td style="width: 20%">' + postId + '</td>' +
                            '<td style="width: 70%"><a href="https://bbs.jjwxc.net/showmsg.php?board=' +boardId + '&id=' + postId + '" target="_blank">' + postTitle + '</a></td>' +
                            '<td style="width: 10%"><button class="filter-bam-post-del" data="' + postId + '">解除</button></td>' +
                            '</tr>' + html
                    }
                    $(blockTable).append($(html))
                }

            },
            delBlockUser(node) {
                let name = $(node).attr('data')
                let arr = localStorage.getItem('BlockUsers') ? JSON.parse(localStorage.getItem('BlockUsers')) : [];
                for(let i=0;i<arr.length;i++){
                    if(arr[i] == name){
                        arr.splice(i,1)
                        localStorage.setItem('BlockUsers', JSON.stringify(arr));
                        $(node).parent().parent().remove()
                    }
                }
            },
            delBlockPost(node) {
                let postId = $(node).attr('data')
                let arr = localStorage.getItem('BlockPosts') ? JSON.parse(localStorage.getItem('BlockPosts')) : {};
                delete arr[postId];
                localStorage.setItem('BlockPosts', JSON.stringify(arr));
                $(node).parent().parent().remove()
            },
            switchSkin() {
                // 0是white 1是black
                var oldTheme = Boolean(Number(localStorage.getItem('themeJJ') == null ? 0 : localStorage.getItem('themeJJ')));
                var newTheme = Number(!oldTheme);
                localStorage.setItem('themeJJ', newTheme);
                location.reload();
            },
            countID() {
                // ID统计
                if ($("#countIDButton").text() == "ID统计") {
                    if (dataSortIndex.length != 0){
                        countIDListFinish()
                    } else {
                        getReplyList(0, 1)
                    }
                } else {
                    $("#countIDList").hide();
                    $("#countIDButton").text('ID统计');
                    $("#countIDButton").css('color', 'black');
                }
            },
            postSearch() {
                // 帖内搜索
                if ($("#postSearchButton").text() == "贴内搜索") {
                    if (reply_all.length != 0){
                        getReplyListFinish()
                    } else {
                        getReplyList(0, 2)
                    }
                } else {
                    $("#postSearchList").hide();
                    $("#postSearchButton").text('贴内搜索');
                    $("#postSearchButton").css('color', 'black');
                }
            },
            filterPost() {
                // 搜索过滤
                var searchKey = document.getElementById("postSearchInput").value

                var content = document.getElementById("postSearchListText")
                var values = replyStrBody.split(searchKey);
                content.innerHTML = values.join('<span style="background:yellow;">' + searchKey + '</span>');

                var FloatReplyArr = $('.FloatReplyBody');
                var searchResultNum = 0
                for(let item of FloatReplyArr){
                    if(item.innerHTML.search(searchKey) == -1){
                        $(item).parent().css('visibility', 'collapse')
                    } else {
                        $(item).parent().css('visibility', 'visible')
                        searchResultNum += 1
                    }
                }
                var titleStr = `搜索完毕 共${searchResultNum}层提及`
                $('#tableTitle').text(titleStr)
            },
            eventRegister() {
                $(document).on('click', '#countIDButton', function () {
                    Event.countID(this);
                })
                $(document).on('click', '#postSearchButton', function () {
                    Event.postSearch(this);
                })
                $(document).on('click', '#postSearchStart', function () {
                    Event.filterPost(this);
                })
                $(document).on('click', '.themeButton', function () {
                    Event.switchSkin(this);
                })
                $(document).on('click', '.board-bam', function () {
                    Event.addBlockPost(this);
                })
                $(document).on('click', '.board-only-show-user', function () {
                    Event.onlyShowUser(this);
                })
                $(document).on('click', '.board-bam-user-temp', function () {
                    Event.addBlockUserTemp(this);
                })
                $(document).on('click', '.board-bam-user', function () {
                    Event.addBlockUser(this);
                })
                $(document).on('click', '.filter-bam-keyword', function () {
                    location = 'https://bbs.jjwxc.net/filterword.php'
                })
                $(document).on('click', '.filter-bam-user', function () {
                    Event.showBlockUser(this);
                })
                $(document).on('click', '.filter-bam-post', function () {
                    Event.showBlockPost(this);
                })
                $(document).on('click', '.filter-bam-user-del', function () {
                    Event.delBlockUser(this);
                })
                $(document).on('click', '.filter-bam-post-del', function () {
                    Event.delBlockPost(this);
                })
            }
        }

        function initPages(start) {
            if (IS_BOARD) {
                initNodes.board()
                Event.eventRegister()
            } else if (IS_POST) {
                initNodes.page(start);
                Event.eventRegister()
            } else if (IS_FILTER) {
                initNodes.filter();
                Event.eventRegister()
            }
        }

        initPages(page_count);

        function countIDListFinish() {
            var strBody = ''
            var floorNum = 0
            dataSortIndex.forEach((key, index) =>{
                floorNum += id_all[key].num
                strBody += `<tr><td style="text-align: center;">NO.${index + 1}</td>
                <td style="text-align: center;">${key}</td>
                <td style="text-align: center;">${id_all[key].name}</td>
                <td style="text-align: center;">${id_all[key].num}</td></tr>`
            })
            var str =
                `<table style="background-color: #999933;">
                <caption style="font-size: large;font-weight: bold;">共${dataSortIndex.length}个ID ${floorNum}层楼</caption>` +
                `<tr><td style="text-align: center;">序号</td>
                <td style="text-align: center;">ID</td>
                <td style="text-align: center;">昵称</td>
                <td style="text-align: center;">楼层</td></tr>` +
                strBody + "</table>";
            $("#countIDListText").html(str);

            $("#countIDList").show();
            $("#countIDButton").text('隐藏窗口');
            $("#countIDButton").css('color', '#ff8e29');
        }

        function getReplyListFinish() {
            var strBody = ''
            reply_all.forEach((value) =>{
                strBody += `<tr style="vertical-align:top"><td style="text-align:center;">${value.floor}</td>
                <td class="FloatReplyBody" style="text-align:center;width: 120px;white-space:pre-line;">${value.author}</td>
                <td class="FloatReplyBody" style="text-align:left;white-space: pre-line;word-break: break-word;">${value.replybody}</td></tr>`
            })
            var str =
                `<table style="background-color: #999933;">
                <caption id="tableTitle" style="font-size:large;font-weight:bold;">初始化完毕 本帖共${reply_all.length}层楼</caption>` +
                `<tr><td style="text-align: center;">楼层</td>
                <td style="text-align:center;">昵称</td>
                <td style="text-align:center;">回复内容</td></tr>` +
                strBody + "</table>";
            $("#postSearchListText").html(str);
            var tableImgArr = $('#postSearchListText').find('img')
            for(let item of tableImgArr){
                $(item).css("max-height","150px")
                $(item).css("max-width","140px")
            }
            replyStrBody = $("#postSearchListText").html();

            $("#postSearchList").show();
            $("#postSearchButton").text('隐藏窗口');
            $("#postSearchButton").css('color', '#ff8e29');
        }

        function getReplyList(page=0, fun) {
            $.ajax({
                type: 'POST',
                url: "https://bbs.jjwxc.net/frameindex.php?c=showMsg&action=showMoreReply",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json'
                },
                data: {
                    'board': BOARD_ID,
                    'id': POST_ID,
                    'page': page
                },
                async:true,
                success: function (response) {
                    var result = JSON.parse(response);
                    console.log("=======getReplyList=======" + (page + 1))
                    switch (fun) {
                        case 1: {
                            countIDList(result, page)
                            break
                        }
                        case 2: {
                            postSearchList(result, page)
                            break
                        }
                    }
                },
                error: function (err) {
                    console.log("错误 " + err);
                }
            });
        }

        function countIDList(result, page){
            $("#countIDButton").text('第' + (page + 1) + '页');
            if (result.data.replies.length != 0) {
                var dataList = result.data.replies
                if(dataList instanceof Object){
                    Object.keys(dataList).forEach((key) =>{
                        getOutputList(dataList[key])
                    })
                } else {
                    dataList.forEach((value) =>{
                        getOutputList(value)
                    })
                }
                getReplyList(page + 1, 1)
            } else {
                dataSortIndex = Object.keys(id_all).sort(function(a,b){ return id_all[b].num-id_all[a].num;});
                countIDListFinish()
            }
        }

        function postSearchList(result, page){
            $("#postSearchButton").text('第' + (page + 1) + '页');
            if (result.data.replies.length != 0) {
                var dataList = result.data.replies
                if(dataList instanceof Object){
                    Object.keys(dataList).forEach((key) =>{
                        reply_all = reply_all.concat(dataList[key])
                    })
                } else {
                    reply_all = reply_all.concat(dataList)
                }
                getReplyList(page + 1, 2)
            } else {
                getReplyListFinish()
            }
        }

        function getOutputList(value) {
            var id = value.readerIdenti.split(">")[1].split("<")[0];
            if (id_all[id] != undefined) {
                id_all[id].num = id_all[id].num + 1;
                if (id_all[id].name.search("\\*") != -1 && value.author.search("\\*") == -1) {
                    id_all[id].name = value.author;
                }
            } else {
                id_all[id] = { name: value.author, num: 1 };
            }
        }

        $('#showmore_button').click(function() {
            setTimeout(function () {
                initPages(page_count);
                if ($('#showmore_button').length == 0) {
                    let newPage = Number(PAGE) + 1;
                    if (isNaN(newPage)) {
                        newPage = 1;
                    }
                    let newPageHref = "?board=" + BOARD_ID +"&id=" + POST_ID + "&page=" + newPage;
                    $('#pager_top').append(`<a href="${newPageHref}">${newPage + 1}</a>`);
                    $('#pager_bottom').append(`<a href="${newPageHref}">${newPage + 1}</a>`);
                }
            },2000)
        });

    })
})(jQuery);
