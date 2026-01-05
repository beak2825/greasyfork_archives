// ==UserScript==
// @name         自动屏蔽三无用户点赞超过50%的回答
// @namespace    http://bingkubei.cn/
// @version      0.93
// @description  自动屏蔽知乎三无用户点赞数>=50%的回答
// @author       flowfire
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/settings/filter
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/24106/%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E4%B8%89%E6%97%A0%E7%94%A8%E6%88%B7%E7%82%B9%E8%B5%9E%E8%B6%85%E8%BF%8750%25%E7%9A%84%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/24106/%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E4%B8%89%E6%97%A0%E7%94%A8%E6%88%B7%E7%82%B9%E8%B5%9E%E8%B6%85%E8%BF%8750%25%E7%9A%84%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

/*
依次获取每个回答的点赞用户
取前50位（太多怕卡，可以自己定义）
没有头像，0赞同，0感谢，0提问，0回答
只要其中超过三样，就算做三无用户
三无用户点赞数超过样本的一半则自动屏蔽
*/
(function() {
    "use strict";
    /*
    var maxcount = 50;//检查数量，默认50，如果网好可以多设一点、最大可以设置成Infinity
    var timer = 1000;//循环检查的时钟，默认一秒循环一次，已经检查的不会再次检查，所以保持1s即可。
    var filter = 0.5;// 阈值, 当三无用户占比超过这个值得时候，屏蔽之
    var autohide = true;// 是否自动隐藏，如果改为 false ，则回答默认不隐藏，只在答案前加一个标签说明
    */

    /*不需要再修改脚本。现在可以直接在知乎设置中的 【屏蔽】一栏找到设置选项。*/
    /*链接为  https://www.zhihu.com/settings/filter */

    var maxcount = GM_getValue("maxcount", 50);//检查数量，默认50，如果网好可以多设一点、最大可以设置成Infinity
    var timer = GM_getValue("timer", 1000);//循环检查的时钟，默认一秒循环一次，已经检查的不会再次检查，所以保持1s即可。
    var filter = GM_getValue("filter",0.5);// 阈值, 当三无用户占比超过这个值得时候，屏蔽之
    var autohide = GM_getValue("autohide",true);// 是否自动隐藏，如果改为 false ，则回答默认不隐藏，只在答案前加一个标签说明
    var power = GM_getValue("power","1,1,1,1,1,1,4");

    if($("#zh-setting-page-black-list-wrap").length!==0){
        $("#zh-setting-page-black-list-wrap").append('<div class="settings-section" id="filter-vote-people"></div>');
        var fil = $("#filter-vote-people");
        fil.append('<div class="settings-section-title"><h2>屏蔽答案设置</h2><p class="settings-section-desc">屏蔽三无用户点赞过多的答案,所有输入框按回车提交。</p></div>');
        fil.append('<div class="settings-item clearfix"><div class="settings-item-content"></div></div>');
        fil = fil.find(".settings-item-content");
        fil.append('<input class="zg-form-text-input zg-mr15 label-input-label" type="text" placeholder="最多检查用户数" aria-label="最多检查用户数" title="最多检查用户数" role="combobox" aria-autocomplete="list" value="'+maxcount+'" data-gmfilter="maxcount">');
        fil.append("<div>最多检查用户数量，当前值：<span>"+maxcount+"</span>。默认为50，设为Infinity则表示检查所有点赞用户（不建议，可能会导致加载缓慢）</div>");
        fil.append('<br/>');
        fil.append('<input class="zg-form-text-input zg-mr15 label-input-label" type="text" placeholder="循环检查的时间" aria-label="循环检查的时间" title="循环检查的时间" role="combobox" aria-autocomplete="list" value="'+timer+'" data-gmfilter="timer">');
        fil.append("<div>循环检查的时间（毫秒），当前值：<span>"+timer+"</span>。默认为1000，一般不需要修改。</div>");
        fil.append('<br/>');
        fil.append('<input class="zg-form-text-input zg-mr15 label-input-label" type="text" placeholder="阈值" aria-label="阈值" title="阈值" role="combobox" aria-autocomplete="list" value="'+filter+'" data-gmfilter="filter">');
        fil.append("<div>阈值，当前值：<span>"+filter+"</span>。默认为0.5，当三无用户占比超过这个值则屏蔽。</div>");
        fil.append('<br/>');
        fil.append('<input class="zg-form-text-input zg-mr15 label-input-label" type="text" placeholder="自动隐藏" aria-label="自动隐藏" title="自动隐藏" role="combobox" aria-autocomplete="list" value="'+power+'" data-gmfilter="power">');
        fil.append("<div>每个信息的权重，当前值：<span>"+power+"</span>。默认为 1,1,1,1,1,1,4 </div>");
        fil.append("<div>依次代表【头像，简介，赞同，感谢，提问，回答，阈值】。例如将第一个逗号前的值改为3，代表头像的权重为3</div>");
        fil.append("<div>判断时，一个用户的“三零属性”默认为0，每有一个属性为零（如没设置头像，没有简介，赞同为0），则将“三零属性”加上对应的权重值</div>");
        fil.append("<div>当一个用户的“三零属性”大于等于最后一位的阈值时，将该用户判定为三零用户</div>");
        fil.append("<div>例：将该项设置为 1,2,3,4,5,6,7 ，则没设置头像则+1，没有提问则+5，没有回答则+6，当最后的值>=7,则认为是三零</div>");
        
        fil.find("[data-gmfilter]").on("keypress",function(e){
            if(e.keyCode===13||e.keyCode===10){
                var value;
                switch($(this).attr("data-gmfilter")){
                    case "maxcount":
                        value = $(this).val();
                        value = Number(value);
                        if(value!==value){
                            alert("请输入数字");
                            return;
                        }
                        if(value<=10){
                            alert("点赞数小于10不会被标记或隐藏。");
                            return;
                        }
                        GM_setValue("maxcount",value);
                        break;
                    case "timer":
                        value = $(this).val();
                        value = Number(value);
                        if(value!==value){
                            alert("请输入数字");
                            return;
                        }
                        GM_setValue("timer",value);
                        break;
                    case "filter":
                        value = $(this).val();
                        value = Number(value);
                        if(value!==value){
                            alert("请输入数字");
                            return;
                        }
                        if(value>=1||value<=0){
                            alert("该值必须大于0小于1");
                            return;
                        }
                        GM_setValue("filter",value);
                        break;
                    case "autohide":
                        value = $(this).val();
                        if(value=="false"){
                            GM_setValue("autohide",false);
                        }else if(value=="true"){
                            GM_setValue("autohide",true);
                        }else{
                            alert("只能输入 true  或 false");
                        }
                        break;
                    case "power":
                        value = $(this).val();
                        var values = value.split(",");
                        if(values.length!=7){
                            alert("需要以六个英文逗号分隔");
                            return;
                        }
                        var errors = values.every(function(data){
                            var num = Number(data);
                            if(num!==num){
                                errors = true;
                                alert("被分割的每个部分都必须是数字");
                                return false;
                            }
                            return true;
                        });
                        if(!errors){
                            return;
                        }
                        GM_setValue("power",value);
                        break;
                }
                var name = $(this).attr("data-gmfilter");
                value = GM_getValue(name).toString();
                $(this).next().find("span").html(value);
            }
        });
    }
    //回答区域
    var box = $("#zh-question-answer-wrap");
    var check = function(){box.children().each(function(index,dom){

        //每个单独的回答
        if($(dom).attr("data-checked-user")=="true"){
            //如果该回答已经被标记过，则跳过
            return;
        }
        //标记
        $(dom).attr("data-checked-user","true");

        //获取回答id以及初始化一些值
        var aid = $(dom).attr("data-aid");
        var count = 0;//点赞用户数量
        var whiteuser = 0;//三零用户数量
        var calcUser = function(nexturl){

            //计算用户
            if(nexturl===""||count>=maxcount){//如果用户已经判断完或用户超过定义的数量，则结束
                if(count>10&&whiteuser/count>=filter){//如果点赞人数超过10并且三零用户超过阈值，则标记
                    $(dom).children().hide();
                    //$(dom).css("background","red");
                    var text = "(已统计赞数："+count+"，三无用户数："+whiteuser+")";
                    var html = "<div data-tag=\"hide-answer\" style=\"border:1px solid #c66;background:#fcc;color:#a33;padding:5px 10px;border-radius:4px;cursor:pointer;margin:5px 0;\">该回答由于三无用户的点赞数过多而被隐藏"+text+" 【点击显示】</div>";

                    $(html).insertBefore($(dom).find(".zm-item-rich-text"));
                    $(dom).find("[data-tag=\"hide-answer\"]").on("click",function(){
                        if($(this).parent().attr("data-hide")=="true"){
                            $(this).parent().children().hide();
                            $(this).show();
                            $(this).parent().removeAttr("data-hide");
                            $(this).html("该回答由于三无用户的点赞数过多而被隐藏"+text+" 【点击显示】");
                        }else{
                            $(this).parent().children().show();
                            $(this).parent().attr("data-hide","true");
                            $(this).html("给该回答点赞的三无用户过多"+text+" 【点击隐藏】");
                        }
                    });
                    if(!autohide){
                        $(dom).find("[data-tag=\"hide-answer\"]").click();
                    }
                }
                return;
            }

            //获取点赞用户信息，知乎居然不是返回数据而是直接返回html简直脑子有坑
            $.ajax({
                url : nexturl,
                method : "get",
                dataType : "json",
                success : function(data){
                    count += data.payload.length;//计算用户的数量
                    data.payload.forEach(function(data){
                        //依次判断每个用户是否为三零用户
                        var zero = 0;//信息为0的个数
                        var userinfo = $($.parseHTML(data));

                        //获取头像、点赞数等信息
                        var img = userinfo.find("img").attr("src");
                        var intro = userinfo.find(".bio.hidden-phone").html();
                        var zt = userinfo.find(".status li span:eq(0)").html();
                        var gx = userinfo.find(".status li span:eq(1)").html();
                        var tw = userinfo.find(".status li a:eq(0)").html();
                        var hd = userinfo.find(".status li a:eq(1)").html();
                        
                        //可以在此用自己的方法调整权重
                        var powers = power.split(",");
                        if(img == "https://pic1.zhimg.com/da8e974dc_m.jpg")
                            zero += Number(powers[0]);
                        if(intro=="")
                            zero += Number(powers[1]);
                        if(zt == "0 赞同")
                            zero += Number(powers[2]);
                        if(gx == "0 感谢")
                            zero += Number(powers[3]);
                        if(tw == "0 提问")
                            zero += Number(powers[4]);
                        if(hd == "0 回答")
                            zero += Number(powers[5]);
                        if(zero>=Number(powers[6]))
                            whiteuser += 1;
                    });
                    calcUser(data.paging.next);
                }
            });
        };
        setTimeout(function(){calcUser("/answer/"+aid+"/voters_profile");},0);
    });
                          };
    setInterval(check,timer);
    // Your code here...
})();