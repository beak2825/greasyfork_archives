// ==UserScript==
// @name         bangumi 回复排序
// @namespace    http://tampermonkey.net/
// @version      1.40
// @description  bangumi 回复排序，在小组话题页面或条目讨论页面的左下角有按钮，可以按照时间高亮回复，支持鼠标滚轮操作；input可以输入回复序号，最下方的数字是回复总数（可点击，回到最后一个回复的位置）。
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(((group|subject)\/topic.*/)|(ep\/.*))
// @require      http://code.jquery.com/jquery-latest.js
//require        https://greasyfork.org/scripts/12284-jquery-mousewheel-3-1-13/code/jQuery%20Mousewheel%203113.js?version=72961
// @downloadURL https://update.greasyfork.org/scripts/36986/bangumi%20%E5%9B%9E%E5%A4%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/36986/bangumi%20%E5%9B%9E%E5%A4%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    function postsort() {
        var maincolor = "rgb(240,145,155)";
        var idlist = [];
        var nowid = 0;
        var re = /post_\d*/;
        var divs = $("div");
        var len = divs.length;
        // console.log(len);
        function sortNumber(a,b)
        {
            return a - b;
        }
        function move() {
            // location.hash = "#post_" + nowid;
            // console.log($("#post_" + nowid).offset());
            divs.removeClass("reply_highlight");
            $("#post_" + nowid).addClass("reply_highlight");
            $('html').scrollTop($("#post_" + nowid).offset().top - 30);
        }
        for(var i = 0; i < len; i++){
            var id = divs.eq(i).attr("id");
            //console.log(id);
            if (re.test(id) && !divs.eq(i).hasClass("postTopic")){
                id = id.replace("post_","");
                id = parseInt(id);
                idlist.push(id);
            }
        }
        idlist.sort(sortNumber);
        // console.log(idlist);
        $("body").append("<div id='postsort_buttongroup'><button type='previous' class='postsort_button'>▲</button><button type='next' class='postsort_button'>▼</button><input id='postnumber'><div id='postcount'></div></div>");
        $("#postsort_buttongroup").css({
            "position" : "fixed",
            "bottom" : 40,
            "left" : 20,
            "width" : "40px",
            "background" : maincolor,
            "padding" : "2px"
        });
        $("#postnumber").css({
            "width" : "100%",
            "height" : "20px",
            "margin-top" : "2px",
            "color" : maincolor,
            "text-align" : "center",
            "border" : "none",
            "outline" : "none"
        }).bind('input propertychange', function() {
            if($(this).val() <= 0 || $(this).val() > idlist.length) {
                return;
            }
            nowid = idlist[$(this).val() - 1];
            move();
        });
        $("#postcount").css({
            "width" : "100%",
            "height" : "20px",
            "background" : maincolor,
            "color" : "white",
            "text-align" : "center",
            "cursor" : "pointer"
        }).text(idlist.length).click(function() {
            $("#postnumber").val(idlist.length).trigger('propertychange');
        });
        $(".postsort_button").css({
            "height" : "30px",
            "width" : "100%",
            "display" : "block",
            "background" : maincolor,
            "color" : "white",
            "border" : "none",
            "outline" : "none"
        }).hover(function() {
            $(this).css({
                "background" : "rgb(255,165,175)",
            });
        },function() {
            $(this).css({
                "background" : maincolor,
            });
        }).click(function() {
            var type = $(this).attr("type");
            if(nowid === 0) {
                nowid = idlist[idlist.length - 1];
            } else {
                if(type == "previous") {
                    for(var i = idlist.length - 1; i >= 0; i--) {
                        if(idlist[i] < nowid) {
                            nowid = idlist[i];
                            break;
                        }
                    }
                } else if(type == "next") {
                    for(var j = 0; j < idlist.length; j++) {
                        if(idlist[j] > nowid) {
                            nowid = idlist[j];
                            break;
                        }
                    }
                }
            }
            $("#postnumber").val($.inArray(nowid, idlist) + 1);
            move();
        }).bind("mousewheel", function(event) {
            // console.log(event.originalEvent.deltaY);
            let delta = event.originalEvent.deltaY;
            if(nowid === 0) {
                nowid = idlist[idlist.length - 1];
            } else {
                if(delta > 0) {
                    for(var i = idlist.length - 1; i >= 0; i--) {
                        if(idlist[i] < nowid) {
                            nowid = idlist[i];
                            break;
                        }
                    }
                } else {
                    for(var j = 0; j < idlist.length; j++) {
                        if(idlist[j] > nowid) {
                            nowid = idlist[j];
                            break;
                        }
                    }
                }
            }
            $("#postnumber").val($.inArray(nowid, idlist) + 1);
            move();
            return false;
        });
    }
    setTimeout(postsort,0);
})();