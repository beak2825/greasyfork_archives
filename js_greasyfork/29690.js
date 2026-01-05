// ==UserScript==
// @name         hjj工具
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  去刷屏,楼层无图,工具栏,屏蔽字
// @author       miaomiao
// @match        *://bbs.jjwxc.net/board.php?board=*&type=*&page=*
// @match        *://bbs.jjwxc.net/showmsg.php?board=*&boardpagemsg=*&id=*
// @match        *://bbs.jjwxc.net/board.php?board=*&page=*
// @match        *://bbs.jjwxc.net/showmsg.php?board=*&id=*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29690/hjj%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/29690/hjj%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    function __main__() {
        //提交css
        GM_addStyle("#toolbar{opacity:0.6;z-index:999999;position:fixed;top:20px;left:80%;border:1px solid #a38a54;width:180px;background-color:#eddec2;border-radius:3px;}#keywordList{opacity:0.6;z-index:999999;position:fixed;top:300px;left:80%;border:1px solid #a38a54;width:180px;background-color:#eddec2;border-radius:3px;}.clickable a{cursor:pointer;}")


        //检查是否在版区页面
        let isBoard = location.href.indexOf("board.php") >= 0;
        Toolbar.init(isBoard);
        Keyword.init();

        if (isBoard) {
            Keyword.shieldBoardKeyword()
        } else {
            Spam.init();
            Picture.init();
            Quotereply.init();

            let mainElements = $("[id=topic]");
            window.topicWidth = mainElements.width();
            let keywords = localStorage["keywords"];
            mainElements.each(function(index) {
                let element = $(this);
                Spam.stopSpam(index, element);
                Picture.hidePictures(index, element);
                if (keywords != undefined && keywords.length != 0) {
                    Keyword.shieldKeyword(index, element, keywords);
                }
            });

            let floor = localStorage["jumpFloor"]
            if (floor != undefined) {
                Toolbar.scrollToFloor(floor);
                localStorage.removeItem("jumpFloor");
            }
        }
    }

    var Spam = {
        init() {
            Spam.eventRegister();
        },
        stopSpam(index, element) {
            let height = element.height();
            let lineHeight = parseInt(element.css("line-height"));
            let picHeight = Spam.calPicHeight(element);
            let rowsCount = (height - picHeight) / lineHeight;
            let maxRowsCount = localStorage["spamLine"] == undefined ? 40 : parseInt(localStorage["spamLine"]);
            let flag = rowsCount > maxRowsCount ? true : false;
            if (flag) {
                var rowNum = 0;
                var picHtml = "";
                element.find("img").each(function() {
                    picHtml += $(this).prop("outerHTML");
                });
                var allText = element.text().split("\n");
                var shownText = "";
                var hidenText = "";
                $.each(allText, function(index, value) {
                    let partTextWidth = Spam.getTextWidth(value);
                    // console.log(partTextWidth);
                    let rowNumInOnePart = 0;

                    if (partTextWidth > topicWidth) {
                        rowNumInOnePart += partTextWidth / topicWidth + 1;
                    } else {
                        rowNumInOnePart = 1;
                    }

                    if (rowNum + rowNumInOnePart > maxRowsCount) {
                        rowNum += rowNumInOnePart;
                        return true;
                    }
                    rowNum += rowNumInOnePart;
                });
                let elementText = element[0].innerHTML;
                element.html("");
                element.append("<p>本楼共" + parseInt(rowsCount) + "行</p><a href='javascript:;' class='shownText' data-index='" + index + "' textHidden='true'>点击显示全部</a> <span class='hideText' data-index='" + index + "' style='display:none'><br>" + elementText + "<a href='javascript:;' class='hideTextHref' data-index='" + index + "'>隐藏</a></span>" + picHtml);
            }
        },
        calPicHeight(element) {
            let height = 0;
            element.find("img").each(function() {
                height += $(this).height();
            });
            return height;
        },
        getTextWidth(str) {
            let width = $('body').append($('<span stlye="display:none;" id="textWidth"/>')).find('#textWidth').html(str).width();
            $('#textWidth').remove();
            return width;
        },
        eventRegister() {
            $(document).on("click", ".shownText", function(event) {
                console.log(event)
                let index = $(event.target).attr('data-index');
                let flag = $(event.target).attr('textHidden');
                if (flag == 'true') {
                    $(".shownText[data-index=" + index + "]").text("隐藏");
                    $(".hideText[data-index=" + index + "]").show();
                    $(event.target).attr('textHidden', "false")
                } else {
                    $(".shownText[data-index=" + index + "]").text("点击显示全部");
                    $(".hideText[data-index=" + index + "]").hide();
                    $(event.target).attr('textHidden', "true")
                }
            });

            $(document).on("click", ".hideTextHref", function(event) {
                let index = $(event.target).attr('data-index');
                $(".shownText[data-index=" + index + "]").text("点击显示全部");
                $(".hideText[data-index=" + index + "]").hide();
            });
        },
    }

    var Picture = {
        init() {
            Picture.eventRegister();
        },
        eventRegister() {
            $(document).on("click", ".hidePic", function(event) {
                const node = $(event.target)
                let flag = node.attr('picHidden');
                let index = node.attr('data-index');
                if (flag == "true") {
                    $(".hidePic[data-index=" + index + "]").text("隐藏此楼图片");
                    node.parent().parent().find("img").show()
                    $(event.target).attr('picHidden', "false")
                } else {
                    $(".hidePic[data-index=" + index + "]").text("显示此楼图片");
                    node.parent().parent().find("img").hide()
                    $(event.target).attr('picHidden', "true")
                }
            });
        },
        hidePictures(index, element) {
            let hideHtml = "<p><a href='javascript:;' class='hidePic' data-index='" + index + "' picHidden='true'>显示此楼图片</a></p>";
            let picHtml = "";
            let picNode = element.find("img");
            if (picNode.length !== 0) {
                element.html(hideHtml + element.html());
                picNode = element.find("img").hide();
            }
        }
    }

    var Toolbar = {
        isBoard: 0,
        init(isBoard) {
            Toolbar.showToolBar();
            Toolbar.eventRegister();
            $("#spamLineInput").attr("placeholder", `刷屏行数设置,当前${localStorage["spamLine"] == undefined ? 40 : localStorage["spamLine"]}`);

            if (isBoard) {
                Toolbar.isBoard = 1;
                $(".showmsg").hide();
            }
        },
        getPage() {
            const totalPage = parseInt($("#pager_top").text().replace(/共(\d*)页.*/, "$1"));
            const pageIndex = location.href.indexOf("page=");
            if (pageIndex < 0) {
                return [-1, -1, totalPage];
            }
            const page = parseInt(location.href.substring(pageIndex + 5));
            return [pageIndex, page, totalPage]
        },
        showToolBar() {
            $("body").append(`<div id='toolbar' class="clickable" style="display:flex;flex-direction:column ">
                            <div style="margin:2px auto">
                                <a id="top" style="margin:auto">回到顶部</a>
                            </div>
                            <div style="margin:2px auto" class="showmsg">
                                 <a id="showAllImg" ImgHidden='true'>显示全部图片</a>
                            </div>
                            <div style="margin:2px auto">
                                <a id="prePage" style="margin:auto">上一页</a>
                                <a id="nextPage" style="margin:auto">下一页</a>
                             </div>
                            <div style="margin:2px auto" class="showmsg">
                                <input id="floorJumpInput" style="font-size:15px;width:120px;height:20px" placeholder="楼层转跳" onkeypress="if(event.keyCode==13) {$("#floorJumpBtn").click();return false;}">
                                <a id="floorJumpBtn" >确定</a>
                            </div>
                            <div style="margin:2px auto">
                                 <input id="pageJumpInput" style="font-size:15px;width:120px;height:20px" placeholder="页码转跳">
                                 <a id="pageJumpBtn" >确定</a>
                            </div>
                            <div style="margin:2px auto" class="showmsg">
                                <input id="spamLineInput" style="font-size:10px;width:120px;height:20px" placeholder="刷屏行数设置">
                                <a id="spamLineBtn" >确定</a>
                           </div>
                            <div style="margin:2px auto">
                                 <input id="keywordInput" style="font-size:15px;width:120px;height:20px" placeholder="屏蔽字添加">
                                 <a id="keywordBtn">确定</a>                        
                            </div>
                            <div style="margin:2px auto">
                                <a id="keywordListBtn">打开屏蔽字列表</a>
                            </div>
                        </div>`);

            $("body").append(`<div style="display:none">
                                <div id="keywordList" class="clickable" style="display:flex;flex-direction:column">
                                </div>
                            </div>`)
        },
        scrollToFloor(floor) {
            let node = $(".authorname").toArray().filter(e => $(e).find("font")[0].innerHTML.indexOf(floor) >= 0);
            $('html, body').animate({ scrollTop: $(node).parent().prev().prev().offset().top }, 1000);
        },
        eventRegister() {
            $(document).on("click", "#top", function() {
                $('html, body').animate({ scrollTop: 0 }, 1000);
            })

            $(document).on("click", "#prePage", function() {
                let [pageIndex, page, totalPage] = Toolbar.getPage();
                if (pageIndex == -1 || page == 0) {
                    alert("当前为第一页");
                    return;
                }
                location.href = location.href.substring(0, pageIndex + 5) + (page - 1);

            })

            $(document).on("click", "#nextPage", function() {
                let [pageIndex, page, totalPage] = Toolbar.getPage();
                if (page + 1 == totalPage) {
                    alert("已是最后一页");
                    return;
                }
                if (pageIndex == -1) {
                    location.href = location.href + "&page=1";
                } else {
                    location.href = location.href.substring(0, pageIndex + 5) + (page + 1);
                }
            })

            $(document).on("click", "#showAllImg", function() {
                if ($("#showAllImg").attr("ImgHidden") == "true") {
                    $("img").show();
                    $("#showAllImg").html("隐藏全部图片")
                    $("#showAllImg").attr("ImgHidden", "false")
                    $(".hidePic").text("隐藏此楼图片")
                    $(".hidePic").attr("picHidden", "false")
                } else {
                    $("img").hide();
                    $("#showAllImg").html("显示全部图片")
                    $(".hidePic").text("显示此楼图片")
                    $(".hidePic").attr("picHidden", "true")
                    $("#showAllImg").attr("ImgHidden", "true")
                }
            });

            $(document).on("click", "#floorJumpBtn", function() {
                const pagesize = 300;
                let [pageIndex, page, totalPage] = Toolbar.getPage();
                let floor = $("#floorJumpInput").val();
                if (floor == "" || isNaN(floor)) {
                    alert("输入不合法");
                    return;
                }
                let jumpPage = floor % pagesize == 0 ? floor / pagesize : parseInt(floor / pagesize) + 1;
                if (jumpPage == page + 1) {
                    Toolbar.scrollToFloor(floor)
                    return;
                }
                localStorage["jumpFloor"] = floor;
                if (pageIndex == -1) {
                    location.href = `${location.href}&page=${jumpPage-1}`;
                } else {
                    location.href = location.href.substring(0, pageIndex + 5) + `${jumpPage - 1}`;
                }
            })

            $(document).on("click", "#pageJumpBtn", function() {
                let [pageIndex, page, totalPage] = Toolbar.getPage();
                let jumpPage = $("#pageJumpInput").val();
                if (jumpPage == "" || isNaN(jumpPage)) {
                    alert("输入不合法");
                    return;
                }
                if (jumpPage > totalPage) {
                    alert(`共${totalPage}页，请输入正确页码`);
                    return;
                }
                if (pageIndex == -1) {
                    location.href = `${location.href}&page=${jumpPage-1+Toolbar.isBoard}`;
                } else {
                    location.href = location.href.substring(0, pageIndex + 5) + (jumpPage - 1 + Toolbar.isBoard);
                }
            })

            $(document).on("click", "#spamLineBtn", function() {
                let spamLine = $("#spamLineInput").val();
                if (spamLine == "" || isNaN(spamLine)) {
                    alert("输入不合法");
                    return;
                }
                localStorage["spamLine"] = spamLine;
                location.reload();
            })

            $(document).on("click", "#keywordBtn", function() {
                let keyword = $("#keywordInput").val();
                if (keyword == "") {
                    alert("请输入屏蔽词");
                    return;
                }
                Keyword.addKeyword(keyword);
            })

            $(document).on("keypress", "#pageJumpInput", function(event) {
                if (event.keyCode == 13) {
                    $("#pageJumpBtn").click();
                }
            })

            $(document).on("keypress", "#floorJumpInput", function(event) {
                if (event.keyCode == 13) {
                    $("#floorJumpBtn").click();
                }
            })

            $(document).on("keypress", "#spamLineInput", function(event) {
                if (event.keyCode == 13) {
                    $("#spamLineBtn").click();
                }
            })

            $(document).on("keypress", "#keywordInput", function(event) {
                if (event.keyCode == 13) {
                    $("#keywordBtn").click();
                }
            })

            $(document).on("click", "#keywordListBtn", function(event) {
                if ($("#keywordList").parent().is(":hidden")) {
                    $("#keywordList").parent().show();
                    $("#keywordListBtn").html("关闭屏蔽字列表")
                } else {
                    $("#keywordList").parent().hide();
                    $("#keywordListBtn").html("打开屏蔽字列表")
                }
            })
        }
    }

    var Keyword = {
        init() {
            Keyword.eventRegister();
            Keyword.showKeywordList();
        },
        shieldKeyword(index, element, keywords) {
            let text = element.text();
            for (var keyword of keywords.split(" ")) {
                if (keyword.trim().length != 0 && text.indexOf(keyword) >= 0) {
                    element.text("已屏蔽");
                    break;
                }
            }
        },
        shieldBoardKeyword() {
            let msglist = $("#msglist").children().children().toArray();
            let keywords = localStorage["keywords"] || "";
            if (keywords.length == 0) {
                return;
            }
            for (let msg of msglist) {
                let titleNode = $(msg).find("td")[2];
                let title = titleNode.innerHTML;
                for (let keyword of keywords.split(" ")) {
                    if (keyword.trim().length != 0 && title.indexOf(keyword) >= 0) {
                        $(msg).remove()
                        break;
                    }
                }
            }
        },
        addKeyword(keyword) {
            let storageKeyword = localStorage["keywords"] || "";
            localStorage["keywords"] = storageKeyword + keyword + " ";
            alert("添加成功");
            location.reload();
            return;
        },
        showKeywordList() {
            let keywords = (localStorage["keywords"] || "").trim();
            if (keywords.length == 0) {
                $("#keywordList").html(`<div style="margin:2px auto">无屏蔽关键字</div>`)
                return;
            }

            let html = keywords.split(" ").map(keyword => {
                return `<div style="margin:2px auto">
                        <label>${keyword.trim()}</label>
                        <a class="deleteKeyword">删除</a>       
                        </div>`
            }).join(" ");
            $("#keywordList").html(html);
            return;
        },
        eventRegister() {
            $(document).on("click", ".deleteKeyword", function() {
                let keyword = $(this).prev().html();
                var re = new RegExp(`(.*)(${keyword}\\s)(.*)`)
                localStorage["keywords"] = localStorage["keywords"].replace(re, "$1$3");
                $(this).parent().remove();
                location.reload();
            })
        }
    }

    var Quotereply = {
        init() {
            Quotereply.hideButton();
        },
        hideButton() {
            $("a[class^='quotereply']").hide();
        }
    }

    __main__();
})();