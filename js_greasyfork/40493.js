// ==UserScript==
// @name         bangumi 评分助手
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  评分助手
// @author       鈴宮華緋
// @include       /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)(\/subject.*)?/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/40493/bangumi%20%E8%AF%84%E5%88%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40493/bangumi%20%E8%AF%84%E5%88%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    /// == form转json函数 form http://jsfiddle.net/apougher/FhF4T/
    (function ($) {
        $.fn.serializeFormJSON = function () {

            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
    })(jQuery);
    /// ==
    // 获取用户名
    var _user = $(".avatar").attr("href").match(/user\/(.*)/)[1];
    // 用户主页的正则表达式
    var _homepageRE = new RegExp("https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/user\/" + _user + "$");
    // 初始化评分的参考
    var reference = {};
    // 获取在用户主页的评分参考数据，存放在 localStorage 中
    if(!localStorage.getItem("RatingAssistant-Reference")){
        $.ajax({
            url : $(".avatar").attr("href"),
            async : false,
            timeout : 1000,
            success : function(data) {
                reference = JSON.parse(data.match(/\$%(.*)%\$/)[1].replace(/&quot;/g,"\""));
                if (!reference) {
                    reference = {};
                }
                localStorage.setItem("RatingAssistant-Reference",JSON.stringify(reference));
            }
        });
    } else {
        reference = JSON.parse(localStorage.getItem("RatingAssistant-Reference"));
    }
    // 如果在 subject 页面
    if(location.href.match(/https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/subject.*/)) {
        // 获取在简评中的评分数据
        // 各项评分
        var variousScores = $(".SidePanel").text().match(/\$(.*)\$/);
        var singleValues = [];
        // 分数（原先的提交的分数或者计算后所得的分数）
        var realScore = $("input[name=rating]:checked").val() ? $("input[name=rating]:checked").val() : 0;
        console.log(realScore);
        if (variousScores) {
            variousScores = variousScores[1];
        }
        // 在 range 条后显示各项分数
        setvalueboxvalue = function() {
            let ranges = $(".RA-range");
            if(ranges) {
                for(let i = 0;i < ranges.length;i++) {
                    let nowvalue = ranges.eq(i).val();
                    let color = "green";
                    if(nowvalue <= 2) {
                        color = "black";
                    } else if (nowvalue <= 5) {
                        color = "red";
                    } else if (nowvalue <= 7) {
                        color = "orange";
                    } else if (nowvalue >= 9) {
                        color = "purple";
                    }
                    ranges.eq(i).next().find("span").css("background-color", color).text(nowvalue);
                }
            }
        };
        // 创建 range
        createRange = function(title, name, min, max, value, showValue, classname) {
            var h = 30;
            var box = $("<div></div>");
            box.height(h).css({
                "line-height" : h + 'px',
                "font-family" : "Microsoft Yahei",
                "font-size" : "14px"
            });
            if(title) {
                var titlespan = $("<span></span>");
                titlespan.css({
                    "display" : "inline-block",
                    "width" : "30%",
                    "text-align" : "center"
                });
                titlespan.text(title);
                box.append(titlespan);
            }
            name = name == null ? "range" : name;
            min = min == null ? 0 : min;
            max = max == null ? 10 : max;
            value = value == null ? 0 :value;
            var range = $("<input></input>");
            if(classname) {
                range.addClass(classname);
            }
            range.css({
                "vertical-align" : "middle",
                "width" : "50%",
                "border" : "none"
            });
            range.attr({
                "type" : "range",
                "name" : name,
                "min" : min,
                "max" : max,
                "value" : value
            });
            box.append(range);
            if(showValue) {
                var valuebox_box = $("<div></div>");
                valuebox_box.css({
                    "display" : "inline-block",
                    "width" : "20%",
                    "color" : "white",
                    "text-align" : "center",
                });
                var valuebox = $("<span></span>");
                valuebox.css({
                    "display" : "inline-block",
                    "width" : "20px",
                    "height" : "20px",
                    "border-radius" : "50%",
                    "color" : "white",
                    "vertical-align" : "middle",
                    "text-align" : "center",
                    "line-height" : '20px',
                    "margin" : "5px 0"
                });
                valuebox_box.append(valuebox);
                valuebox.text(range.val());
                box.append(valuebox_box);
                range.on("mousemove change", function(){
                    setvalueboxvalue();
                });
            }
            return box;
        };
        calculateScore = function(round) {
            var score = 0;
            let i = 0;
            for(var key in reference) {
                var singleValue = $("input[name=" + key + "]").val();
                var weight = reference[key];
                score += singleValue * weight / 10;
                i++;
            }
            // score = Math.round(score);
            // console.log(score);
            return score;
        };
        // 获取所有 range 的分数
        getRangeValue = function() {
            let ranges = $(".RA-range");
            for(let i = 0;i < ranges.length;i++) {
                singleValues[i] = ranges.eq(i).val();
            }
        };
        var rangeList = [$("#rate-tip").parent()];
        let i = 0;
        // 添加 range, button 等内容
        for(var key in reference) {
            if (variousScores) {
                var singleScore = variousScores[i] == "a" ? 10 : parseInt(variousScores[i]);
                rangeList[i + 1] = createRange(key, key, 0, 10, singleScore, true, "RA-range");
                rangeList[i].after(rangeList[i + 1]);
                i++;
            } else {
                rangeList[i + 1] = createRange(key, key, 0, 10, 5, true, "RA-range");
                rangeList[i].after(rangeList[i + 1]);
                i++;
            }
        }
        setvalueboxvalue();
        getRangeValue();
        var scoreBox = $("<div></div>");
        scoreBox.css({
            "height" : "25px",
            "background" : "green",
            "text-align" : "center",
            "font-size" : "16px",
            "line-height" : "25px",
            "color" : "white",
            "margin" : "10px 0",
            "cursor" : "pointer",
            "border-radius" : "5px"
        });
        // 显示最终评分
        setscoreBox = function(rangeinput) {
            if (variousScores || rangeinput) {
                var color = "green";
                var _score = calculateScore();
                // console.log(_score);
                if(Math.round(_score) <= 2) {
                    color = "black";
                } else if (Math.round(_score) <= 5) {
                    color = "red";
                } else if (Math.round(_score) <= 7) {
                    color = "orange";
                } else if (Math.round(_score) >= 9) {
                    color = "purple";
                }
                scoreBox.css("background",color);
                let calScore = Math.round(_score) == 0 ? 1 : Math.round(_score);
                let fixScore = _score.toFixed(2);
                scoreBox.text(calScore + " (" + fixScore + ")");
                realScore = calScore;
            } else if (realScore) {
                let fixScore = "未评分";
                scoreBox.text(realScore + " (" + fixScore + ")");
            } else {
                scoreBox.css("background","gray");
                scoreBox.text("未评分");
            }
        };
        rangeList[rangeList.length - 1].after(scoreBox);
        setscoreBox();
        // 获取 range 评分
        $(".RA-range").on("mousemove change",function(){
            setscoreBox(true);
            getRangeValue();
        });
        // 提交分数
        scoreBox.click(function() {
            // console.log("click");
            // $("a[title=" + realScore + "]").click();
            var formhash = $("html").html().match(/formhash" value="(.*?)"/)[1];
            var interest = $("input[name=interest]:checked").val();
            var rate = realScore || $("input[name=rating]:checked").val();
            var tags = $("input[name=tags]").val();
            var comment = $("textarea[name=comment]").val();
            var privacy = $("input[name=privacy]").attr("checked") ? 1 : 0;
            var singleValues_str = singleValues.join("");
            // console.log(singleValues_str);
            if(comment.match(/\$(.*)\$/)) {
                comment = comment.replace(/\$.*\$/,"$" + singleValues_str + "$");
            } else {
                comment += "$" + singleValues_str + "$";
            }
            var postDatas = {
                formhash : formhash,
                referer : "subject",
                interest : interest,
                rating : rate,
                tags : tags,
                comment : comment,
                privacy : privacy
            };
            let path = location.pathname;
            $.post(path + "/interest/update?gh=" + formhash, postDatas, function() {
                location.reload();
            });
            // console.log(postDatas);
        });
        // 重置评分按钮
        var reset = $("<div></div>");
        reset.css({
            "height" : "25px",
            "background" : "rgb(120,160,250)",
            "text-align" : "center",
            "font-size" : "16px",
            "line-height" : "25px",
            "color" : "white",
            "margin" : "10px 0",
            "cursor" : "pointer",
            "border-radius" : "5px"
        });
        reset.text("重置评分");
        reset.click(function() {
            if(variousScores) {
                let i = 0;
                for(var key in reference) {
                    let tempScore = variousScores[i] == "a" ? 10 : parseInt(variousScores[i]);
                    $("input[name=" + key + "]").val(tempScore);
                    i++;
                }
            } else {
                $("input.RA-range").val(5);
            }
            setvalueboxvalue();
            setscoreBox(true);
        });
        scoreBox.after(reset);
    } else if(location.href.match(_homepageRE)) {
        /// 如果在个人主页
        // 评分助手设置
        var RAbox = $("<div><p class='RA-title'>bangumi 评分助手设置</p><div class='content'></div></div>");
        // 创建 input
        var createInput = function(val1, val2) {
            let box = $("<div><div></div><p></p><span class='delete'>x</span></div>");
            box.addClass("inputBox");
            box.css({
                "position" : "relative",
                "padding-right" : "10px"
            });
            let nameInput = $("<input></input>");
            let weightInput = $("<input></input>");
            nameInput.css({
                "box-sizing" : "border-box",
                "width" : "100%",
                "height" : "20px",
                "border" : "solid 1px gray",
                "border-radius" : "5px",
                "display" : "inline-block",
                "line-height" : "25px",
                "text-align" : "center",
            });
            weightInput.css({
                "box-sizing" : "border-box",
                "width" : "100%",
                "height" : "20px",
                "border" : "solid 1px gray",
                "border-radius" : "5px",
                "display" : "inline-block",
                "line-height" : "25px",
                "text-align" : "center",
            });
            nameInput.on('input propertychange', function() {
                weightInput.attr("name", $(this).val());
            });
            weightInput.addClass("weight-input");
            if(val1) {
                nameInput.val(val1);
                weightInput.attr("name", val1);
            }
            if(val2) {
                weightInput.val(val2);
            }
            box.find("div").css({
                "box-sizing" : "border-box",
                "width" : "50%",
                "padding" : "5px",
                "float" : "left"
            });
            box.find("p").css({
                "box-sizing" : "border-box",
                "overflow" : "hidden",
                "padding" : "5px"
            });
            box.find("div").append(nameInput);
            box.find("p").append(weightInput);
            box.find("span.delete").css({
                "position" : "absolute",
                "top" : "0",
                "right" : "0",
                "font-family" : "Microsoft Yahei",
                "font-size" : "12px",
                "color" : "red",
                "cursor" : "pointer"
            });
            box.find("span.delete").click(function() {
                box.remove();
            });
            return box;
        };
        RAbox.css({
            "margin" : "10px 0",
        });
        RAbox.children(".RA-title").css({
            "background-color" : "rgb(20, 100, 200)",
            "color" : "white",
            "text-align" : "center",
            "font-size" : "20px",
            "font-family" : "Microsoft Yahei",
            "padding" : "5px 0",
            "margin-bottom" : "5px",
            "border-radius" : "5px"
        });
        RAbox.children(".content").css({
            "display" : "none"
        });
        $("#columnB").prepend(RAbox);
        var addInputBtn = $("<button>+</button>");
        addInputBtn.css({
            "width" : "100%",
            "height" : "25px",
            "background-color" : "rgb(170, 190, 240)",
            "color" : "white",
            "text-align" : "center",
            "font-size" : "20px",
            "border" : "none",
            "border-radius" : "5px",
            "margin-top" : "5px",
            "outline" : "none"
        });
        addInputBtn.hover(function() {
            $(this).css("background","rgb(150, 170, 220)");
        },function() {
            $(this).css("background","rgb(170, 190, 240)");
        });
        RAbox.children(".content").append(addInputBtn);
        var subbmitBtn = $("<button>提交</button>");
        subbmitBtn.css({
            "width" : "100%",
            "height" : "25px",
            "background-color" : "rgb(110, 150, 240)",
            "color" : "white",
            "text-align" : "center",
            "font-size" : "16px",
            "border" : "none",
            "border-radius" : "5px",
            "margin-top" : "5px",
            "outline" : "none"
        });
        subbmitBtn.hover(function() {
            $(this).css("background","rgb(80, 120, 210)");
        },function() {
            $(this).css("background","rgb(110, 150, 240)");
        });
        RAbox.children(".content").append(subbmitBtn);
        // 初始化 input
        var initInput = function() {
            for (var key in reference) {
                addInputBtn.before(createInput(key, reference[key]));
            }
        };
        RAbox.children(".RA-title").click(function() {
            RAbox.find(".content").slideToggle();
        });
        initInput();
        // 添加 input
        addInputBtn.click(function() {
            addInputBtn.before(createInput());
        });
        // 提交评分权重
        subbmitBtn.click(function() {
            let form = $("<form></form>");
            $(".weight-input").each(function() {
                form.append($(this).clone());
            });
            let formStr = JSON.stringify(form.serializeFormJSON());
            console.log(formStr);
            $.ajax({
                url : "/settings",
                dataType : "html",
                success : function(data) {
                    if ($(data).find("form[name=set]")) {
                        let setform = $(data).find("form[name=set]").serializeFormJSON();
                        localStorage.setItem("RatingAssistant-settingsform-backup", setform);
                        // console.log(setform);
                        if(setform.newbio.match(/\$%.*%\$/)) {
                            console.log("match");
                            setform.newbio = setform.newbio.replace(/\$%.*%\$/, "$%" + formStr + "%$");
                        } else {
                            setform.newbio += "\r\n[url=http://bangumi.tv/user/xduu?data=$%" + formStr + "%$]权重数据[/url] - [url=https://greasyfork.org/zh-CN/scripts/40493-bangumi-%E8%AF%84%E5%88%86%E5%8A%A9%E6%89%8B]评分助手[/url]";
                        }
                        $.post("/settings", setform, function() {
                            localStorage.setItem("RatingAssistant-Reference", formStr);
                            location.reload();
                        });
                    }
                }
            });
        });
    }
})();