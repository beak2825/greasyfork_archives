// ==UserScript==
// @name			超星便捷
// @description		视频解除鼠标限制，允许快进、拖动，PDF快速翻页、跳转，作业允许粘贴（请勿大量刷课，封号斗罗警告）
// @namespace       FuckChaoxingScript
// @author			涛之雨
// @version			1.4.8
// @grant			GM_addStyle
// @run-at			document-start
// @require			https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=661566
// @require         https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require			https://greasyfork.org/scripts/29782-docsready/code/docsReady.js?version=603417
// @require 		https://greasyfork.org/scripts/399356-dtoast/code/DToast.js?version=787349
// @match			*://*.fanya.chaoxing.com/*
// @match			*://i.mooc.chaoxing.com/*
// @match			*://*.chaoxing.com/space/*
// @match			*://*.chaoxing.com/mycourse/studentcourse*
// @match			*://*.chaoxing.com/mycourse/studentstudy*
// @match			*://*.chaoxing.com/ananas/modules/pdf/index.html*
// @match			*://*.chaoxing.com/ananas/modules/ppt/index.html*
// @match			*://*.chaoxing.com/ananas/modules/video/index.html*
// @match			*://*.chaoxing.com/ananas/modules/work/index.html*
// @match           *://*.chaoxing.com/work/doHomeWorkNew*
// @match           *://*.chaoxing.com/knowledge/cards*
// @license			BSD 2-Clause
// @icon            https://i.loli.net/2020/03/04/D3h1iWSFeyc8AKG.png
// @home-url	    https://greasyfork.org/zh-CN/scripts/403935
// @downloadURL https://update.greasyfork.org/scripts/403935/%E8%B6%85%E6%98%9F%E4%BE%BF%E6%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/403935/%E8%B6%85%E6%98%9F%E4%BE%BF%E6%8D%B7.meta.js
// ==/UserScript==


//借鉴：https://greasyfork.org/zh-CN/scripts/20059-chaoxing
//      Fuck Chaoxing
//新版本的是flash内的判断，上面的脚本已失效
/**************************\
 * V1.4.8
 * 修复了对新版ppt/pdf按钮的适配问题
 * V1.4.7
 * 对新版视频播放器的适配（怎么又更新了。。。）
 * V1.4.6
 * 新增Ctrl+左右键快速跳转首末页
 * 修复按键绑定事异常
 * 修复对于图片加载的判定报错问题
 * V1.4.5
 * 修复页面旧数据无效导致的bug
 * V1.4.4
 * 修复部分历史问题，增加稳定性和纠正语法错误
 * 新增考试/作业见面Ctrl+s随手保存功能（防止手滑）
 * 新增对新版的PPT页面支持
 * V1.4.3
 * 删除超星和腾讯课堂的签到支持，单独抽取出新的脚本
 * 参见：https://greasyfork.org/zh-CN/scripts/401115
 * V1.4.2
 * 适配新版超星的PDF/PPT翻页（天天要重新适配(╬￣皿￣)=○）
 * 顺便精简了部分的代码
 * V1.4.1
 * 增加了一个右下角的HOME图标（其实没啥用。。。）
 * 精简代码，删除臃肿部分
 * 优化了流程，（大更改。。。新旧版本的比较可以查看我的git小站）
 * 删除了所有注释。。。。（其实是不小心删除的。。。。。）
 * 如果需要看注释请查看旧版本（链接：http://taozhiyu.rthe.net/fuckcx_52_v1.3.11_backup.js）
 *
 * V1.3.12
 * 修改了部分遮挡文本的布局
 * 增加PDF/PPT页面左右按键快速翻页
 * 增加视频上下（音量增减）左右（快退进）空格（暂停/播放）的按键操作
 * 增加了一些奇怪的文字
 * V1.3.11
 * 增加对于非任务点的视频页面切换的支持（互相切换按钮）
 * V1.3.10
 * 修复了对于非任务PDF/PPT界面
 * 对部分流程进行了优化
 * 增加对于不同版本的适配，之前咱不知道啊(╬￣皿￣)=○
 * 增加了视屏倍速的选择框和视频实际倍速同步的功能
 * V1.3.9
 * 修复了对于视屏倍速的重新适配
 * 精简了部分代码
 * V1.3.8
 * 修复了新版ppt/pdf页面动态加载导致无法快速跳转的bug
 * 修复了【作业】界面提示文字不显示的bug
 * V1.3.7
 * 修复了部分ppt/pdf页面只有一页时跳转功能显示和点击跳转后出错的bug
 * 修复了对于部分学校视频界面显示不全的bug
 * V1.3.6
 * 增加了对于ppt页面的适配（参见pdf的功能）
 * V1.3.5
 * 增加了快速跳转到某一页
 * 增加了对于【拓展】页面视频的支持
 * V1.3.4
 * 增加了PDF快速跳转到某一页
 * V1.3.3
 * 增加了取消作业界面禁止粘贴的限制
 * 增加了对于PDF页面2分钟后显示上下页时间的修改（改为1秒）和渐隐插件未生效提醒
 * 增加了对于学习所有网页的图标支持
 * 多视频时视频同时自动播放，混乱，去除。
 * V1.3.2
 * 增加了对于PDF的时长强制改为1秒钟（我们学校为2分钟一页）
 * 增加了5秒后视频自动播放
 * V1.3.1
 * 增加了对于新版json的支持
\**************************/


(function () {
/*     if (location.href.match(/studentstudy/) !== null||location.href.match(/mooc/) !== null||location.href.match(/studentcourse/) !== null||location.href.match(/fanya/) !== null||location.href.match(/space/) !== null) {
        if(top.location==self.location){
            $(document).ready(function () {
                var home_btn = document.createElement("div");
                home_btn.id = 'home_tao';
                home_btn.title = "涛之雨的小站";
                home_btn.style = "transform: rotate(0deg);background: url('https:\/\/s1.ax1x.com/2020/03/30/GnMT6U.png') no-repeat center center;width: 60px;height: 60px;position: fixed;right: 0px;bottom: 10px;z-index: 999999999;cursor: pointer;border: 4px solid #00bdff96;border-radius: 50%;background-size: 100% 100%;box-sizing: border-box;";
                $("body")[0].append(home_btn);
                var TaoW = $('#home_tao')[0].offsetWidth;
                var TaoH = $('#home_tao')[0].offsetHeight;
                var cuntW = 0;
                var cuntH = 0;
                var wait_out;
                $('#home_tao')[0].onmouseover = function () {
                    this.style.transition = '0.5s';
                    move(0, 0);
                    rate(0);
                    if (!!wait_out) {
                        clearTimeout(wait_out);
                    }
                };
                $('#home_tao')[0].onmouseout = function () {
                    this.style.transition = '0.5s';
                    if (!!wait_out) {
                        clearTimeout(wait_out);
                    }
                    wait_out = setTimeout(function () {
                        move(TaoW / 2, TaoH / 2);
                        rate(-90);
                    }, 700);
                };
                window.onresize = function () {
                    var bodyH = document.body.offsetHeight;
                    var TaoT = $('#home_tao')[0].offsetTop;
                    var bodyW = document.body.offsetWidth;
                    var TaoL = $('#home_tao')[0].offsetLeft;
                    if (TaoT + TaoH > bodyH) {
                        $('#home_tao')[0].style.top = bodyH - TaoH + 'px';
                        cuntH++;
                    }
                    if (bodyH > TaoT && cuntH > 0) {
                        $('#home_tao')[0].style.top = bodyH - TaoH + 'px';
                    }
                    if (TaoL + TaoW > bodyW) {
                        $('#home_tao')[0].style.left = bodyW - TaoW + 'px';
                        cuntW++;
                    }
                    if (bodyW > TaoL && cuntW > 0) {
                        $('#home_tao')[0].style.left = bodyW - TaoW + 'px';
                    }
                    move(TaoW / 2, TaoH / 2);
                };
                function move(w, h) {
                    $('#home_tao')[0].style.left = document.body.offsetWidth - TaoW + w + 'px';
                }
                function rate(a) {
                    $('#home_tao')[0].style.transform = 'rotate(' + a + 'deg)';
                }
                setTimeout(function () {
                    var wait_out;
                    $('#home_tao')[0].style.transition = '0.5s';
                    move(TaoW / 2, TaoH / 2);
                    rate(-90);
                }				, 5000);
                $("#home_tao").click(function () {
                    alert("虽然啥都没有。。。但是既然把你骗来了，就看看吧\n");
                    var window_tab = window.open('');
                    window_tab.location = 'https://taozhiyu.gitee.io';
                });
                $(document).keydown(function (event) {
                    var e = event || window.event;
                    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
                        e.preventDefault();
                    }
                });
            });
        }
    } */
    function set_icon() {
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = 'https://i.loli.net/2020/03/04/D3h1iWSFeyc8AKG.png';
        document.getElementsByTagName('head')[0].appendChild(link);
        var link2 = document.createElement('link');
        link2.type = 'image/x-icon';
        link2.rel = 'shortcut icon';
        link2.href = 'https://i.loli.net/2020/03/04/D3h1iWSFeyc8AKG.png';
        document.getElementsByTagName('head')[0].appendChild(link2);
    }
    set_icon();
    if (location.href.match(/knowledge\/cards/) !== null) {
        window.onload = function () {
            $(document).keydown(function (event) {
                var e = event || window.event;
                if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
                    e.preventDefault();
                }
            });
            if ($("iframe").length !== 0) {
                console.log("%c当前界面有%c" + $("iframe").length + "个%c学习子页面","color:black","color:red;font-size:20px","color:black");
                $("iframe").each(function () {
                    var src_ = $(this)[0].src;
                    if (src_.match(/video/) !== null) {
                        var data_json = $.parseJSON($(this)[0].getAttribute('data').toString());
                        data_json.danmaku=0;
                        data_json.fastforward=false;
                        data_json.switchwindow=false;
                        $(this)[0].setAttribute('data', JSON.stringify(data_json));
                        $(this)[0].style.height = "645px";
                        $(this)[0].src=$(this)[0].src;
                    }
                    if (src_.match(/doHomeWorkNew/) !== null) {
                        $(".ans-job-icon")[0].style.width = "100%";
                        var homeWork_view = '<p style="color:blue;float:right;font-size: 13px;">允许粘贴&nbsp;：涛之雨&nbsp;&nbsp;如果失效，可以按【F5】键刷新（注意保存哦）</p>';
                        $(".ans-job-icon").append(homeWork_view);
                    }
                    if (src_.match(/pdf/) !== null || src_.match(/ppt/) !== null) {
                        top.window.scrollBy(0, 241);
                    }
                });
            }
        };
    }
    if (location.href.match(/pdf/) !== null || location.href.match(/ppt/) !== null) {
        $(document).ready(function() {
            GM_addStyle(".imglook{height:unset!important;}");});
        window.onload = function () {
            var check_page=function (page) {
                Number(page) != Number(endpage) ? $("#btn_r")[0].style.display = "" : $("#btn_r")[0].style.display = "none";
                Number(page) != 1 ? $("#btn_l")[0].style.display = "" : $("#btn_l")[0].style.display = "none";
            };
            var PDF_div, myDiv, mychooseDiv, choose_div,isok=false;
            function kbd_page(event) {
                var e = event || window.event, ev;
                if (e && e.keyCode === 37&&e.ctrlKey) {
                    $("#btn_l")[0].click();
                    return false;
                }
                else if (e && e.keyCode === 39&&e.ctrlKey) {
                    $("#btn_r")[0].click();
                    return false;
                }
                else if (e && e.keyCode === 37) {
                    if (Number($(".num")[0].innerHTML) > 1) {
                        $(".preBtn")[0].click();
                    }
                    else {
                        alert("这已经是第一页了。我怀疑你再搞事情但是我没有证据\n打洗你 （╬￣皿￣）＝○＃（￣＃）３￣） ");
                    }
                    return false;
                }
                else if (e && e.keyCode === 39) {
                    if (Number($(".num")[0].innerHTML) < endpage) {
                        $(".nextBtn")[0].click();
                    }
                    else {
                        alert("已经到最后了。。。。。\n学习也不至于这么投入吧。。。。");
                    }
                    return false;
                }
                else if (e && e.keyCode === 38) {
                    $(".imglook")[0].scrollTop -= 30;
                }
                else if (e && e.keyCode === 40) {
                    $(".imglook")[0].scrollTop += 30;
                }
            }
            var data_json = $.parseJSON(window.frameElement.getAttribute('data').toString());
            if (data_json.jobid || data_json.btime) {
                var endpage=-1;
                try{
                    endpage= window.data.pagenum;
                }catch(e){}
                if(endpage==-1){
                    var get_endpage = setInterval(function () {
                        //window.data.timing = 1;
                        if ($(".documentImg").length!==0&&$(".documentImg")[0]!==undefined&&$(".documentImg")[0].complete&&isok) {
                            clearInterval(get_endpage);
                            endpage = Number($(".all")[0].innerHTML);
                            check_page(Number($(".num")[0].innerHTML));
                        }
                    }, 10);
                }else{
                    setTimeout(()=>{check_page(endpage);},1000);
                }
                try{
                    window.data.timing = 0;
                }catch(w){}
                function newbutton(){
                    var setButton = setTimeout(function () {
                        if(document.querySelectorAll(".turnpage_Btn").length==0){
                            clearTimeout(setButton);
                            newbutton();
                        }
                        var pdf_i = 0, pdf_timeout = 0;
                        var pi_times = 0;
                        PDF_div = '<p style="color:red;position:fixed;top:0;left:0;width:100%;font-size: 10px;opacity:1">PDF上下页强制显示&第一页最后一页&页面跳转&nbsp;：涛之雨</br>第一次加载可能比较慢，如果页面加载完，“前后页”和“第一/最后一页”按钮5秒钟内没有出现，请按【F5】键刷新</p>';
                        myDiv = document.createElement("div");
                        myDiv.id = 'mysellectid';

                        document.querySelectorAll(".turnpage_Btn")[0].insertBefore(myDiv, document.querySelectorAll(".turnpage_Btn")[0].children[0].firstChild);
                        $("#mysellectid").append(PDF_div);
                        var btnl = document.createElement("div");
                        btnl.id = 'btn_l';
                        btnl.title = "第一页";
                        btnl.style = "display:none;background: url(https://s2.ax1x.com/2020/03/09/8pKLNQ.png) no-repeat;width: 60px;height: 60px;position: fixed;left: 20px;top: 50%;margin-top: -30px;z-index: 10;cursor: pointer;";
                        $(".imglook")[0].insertBefore(btnl, $(".imglook")[0].firstChild);
                        var btnr = document.createElement("div");
                        btnr.id = 'btn_r';
                        btnr.title = "最后一页";
                        btnr.style = "display:none;background: url(https://s2.ax1x.com/2020/03/09/8pKOhj.png) no-repeat;width: 60px;height: 60px;position: fixed;right: 20px;top: 50%;margin-top: -30px;z-index: 10;cursor: pointer;";
                        $(".imglook")[0].insertBefore(btnr, $(".imglook")[0].firstChild);
                        //$(".mkeLbtn")[0].style.marginTop = "-120px";
                        //$(".mkeRbtn")[0].style.marginTop = "-120px";
                        var mygotopage = document.createElement("span");
                        mygotopage.innerHTML = "跳转到第[<input id='goto_num' style='width:20px;BACKGROUND-COLOR:aliceblue;BORDER-RIGHT: 0px solid; BORDER-TOP: 0px solid; BORDER-LEFT: 0px solid; BORDER-BOTTOM: 0px solid;' type='editor'/>]页";
                        //$(".mkeNum")[0].insertBefore(mygotopage, $(".mkeNum")[0].lastChild);
                        var tip_keydown = document.createElement("span");
                        tip_keydown.innerHTML = "<span style='font-size:2px;color:blue'>   POWER BY：涛之雨</span>";//<font color='blue' style='font-size:2px;'>支持左右键翻页,Ctrl+左右键首/末页</font>";
                        $(".fl.pageInfo").append(tip_keydown);
                        isok=true;
                        var show_pdf=function () {
                            pi_times = 0;
                            clearInterval(pdf_i);
                            clearTimeout(pdf_timeout);
                            $("#mysellectid")[0].style.opacity = 1;
                            pdf_timeout = setTimeout(function () {
                                pdf_i = setInterval(function () {
                                    if ($("#mysellectid")[0].style.opacity <= 0) {
                                        $("#mysellectid")[0].style.opacity = 0;
                                        $("#mysellectid")[0].innerHTML = '<p style="color:blue;position:fixed;top:0;left:0;width:100%;font-size: 10px;opacity:1">PDF上下页强制显示&第一页最后一页&页面跳转&nbsp;：涛之雨</p>';
                                        clearInterval(pdf_i);
                                    }else{
                                        $("#mysellectid")[0].style.opacity -= 0.07;
                                    }
                                }, 100);
                            }, 5000);
                        };
                        $(".preBtn")[0].onclick = function () {
                            check_page(Number($(".num")[0].innerHTML));
                            show_pdf();
                        };
                        $(".nextBtn")[0].onclick = function () {
                            check_page(Number($(".num")[0].innerHTML));
                            show_pdf();
                        };
                        show_pdf();
                        var changePage=function (endnum = endpage) {
                            var isNext = true, a = Number(endnum) - Number($(".num")[0].innerHTML);
                            a === 0 ? alert("你自己看看你现在多少页？！\n有意思撒？") : (a > 0 ? isNext = true : (isNext = false, a = -a));
                            for (; !!a; a--) {
                                isNext ? $(".nextBtn")[0].click() : $(".preBtn")[0].click();
                            }
                        };
                        $("#btn_r").click(function () {
                            changePage();
                        });
                        $("#btn_l").click(function () {
                            changePage(1);
                        });
                        $("#goto_num").keydown(function (event) {
                            if (event.keyCode == 13) {
                                var page_num;
                                var pnum = $(this)[0].value;
                                var isnum = new RegExp("[0-9]+");
                                if (!isnum.test(pnum)) {
                                    shit(pnum, false);
                                    return false;
                                }
                                else {
                                    page_num = Number(pnum);
                                }
                                if (page_num <= 0 || page_num > endpage) {
                                    shit(page_num, true);
                                    return false;
                                }
                                else if (page_num == 1) {
                                    alert("你瞎啊，看不见左边有个“第一页”的图标啊！！！\n分不清哪一个？鼠标放上去等一会就有提醒了啊！\n虽然一行话就能解决跳转到第一页，但是我不愿意！");
                                }
                                else if (page_num == Number(endpage)) {
                                    alert("你瞎啊，看不见右边有个“最后一页”的图标啊！！！\n分不清哪一个？鼠标放上去等一会就有提醒了啊！\n虽然一行话就能解决跳转到第一页，但是我不愿意！");
                                }
                                else {
                                    changePage(page_num);
                                }
                                $(this)[0].value = "";
                                return true;
                            }
                            function shit(page_num, isnum) {
                                if (pi_times >= 3) {
                                    alert("皮皮皮！！！还皮！\n皮断腿了吧o(´^｀)o");
                                    window.top.location.href = "https://taozhiyu.gitee.io/bd?q=.";
                                    return;
                                }
                                else if (!isnum) {
                                    alert("不要皮好不好ヾ(｡｀Д´｡)ﾉ彡。。。\n你让我怎么跳到第" + page_num + "页 (╬￣皿￣)\n你告诉我那一页是第" + page_num + "页？！！\n你家页数不是数字啊！！！\n做脚本很累的好伐！！！");
                                }
                                else {
                                    alert("不要皮好不好ヾ(｡｀Д´｡)ﾉ彡。。。\n一共只有" + endpage + "页，你让我怎么跳到第" + page_num + "页 (╬￣皿￣)\n做脚本很累的好伐！！！");
                                }
                                $(this)[0].value = "";
                                pi_times++;
                                return false;
                            }
                        });
                        top.document.onkeydown=function(e){
                            kbd_page(e);
                            return 0;
                        }
                        parent.document.onkeydown=function(e){
                            kbd_page(e);
                            return 0;
                        }
                        document.onkeydown=function(e){
                            kbd_page(e);
                            return 0;
                        }
                        if (data_json.isTao == 1) {
                            choose_div = '<p style="width: 25px;height: 25px;line-height: 25px;text-align: center; font-size: 3px; color: #ffffff;">On</p>';
                            mychooseDiv = document.createElement("div");
                            mychooseDiv.id = 'My_choose';
                            mychooseDiv.style = 'border-radius: 50%;background-color:#d71345;width:25px;height:25px;position:fixed;right:2px;top:0%;z-index:10;cursor:pointer;-moz-background-size:100% 100%;-o-background-size:100% 100%;-webkit-background-size:100% 100%;background-size:100% 100%;';
                            $(".imglook")[0].insertBefore(mychooseDiv, $(".imglook")[0].firstChild);
                            $("#My_choose").append(choose_div);
                            $("#My_choose").click(function () {
                                data_json.isTao = 0;
                                data_json.jobid = "";
                                data_json.btime = "";
                                window.frameElement.setAttribute('data', JSON.stringify(data_json));
                                location.href = location.href + (location.href.indexOf("?") > -1 ? "&" : "?") + "wuai=" + (new Date()).getTime();
                            });
                        }
                    },100);
                }
                newbutton();
            }
            else {
                PDF_div = '<p style="color:red;position:fixed;top:0;left:0;width:100%;font-size:15px;">没有作业任务的PDF就不需要我了吧。（那我隐退了,右边有开关。自己玩吧）</p>';
                myDiv = document.createElement("div");
                myDiv.id = 'mysellectid';
                document.querySelectorAll(".turnpage_Btn")[0].insertBefore(myDiv, document.querySelectorAll(".turnpage_Btn")[0].children[0].firstChild);
                $("#mysellectid").append(PDF_div);
                choose_div = '<p style="width: 25px;height: 25px;line-height: 25px;text-align: center; font-size: 3px; color: #ffffff;">Off</p>';
                mychooseDiv = document.createElement("div");
                mychooseDiv.id = 'My_choose';
                mychooseDiv.style = 'border-radius: 50%;background-color:#ffc20e;width:25px;height:25px;position:fixed;right:20px;top:0%;z-index:10;cursor:pointer;-moz-background-size:100% 100%;-o-background-size:100% 100%;-webkit-background-size:100% 100%;background-size:100% 100%;';
                $(".imglook")[0].insertBefore(mychooseDiv, $(".imglook")[0].firstChild);
                $("#My_choose").append(choose_div);
                $("#My_choose").click(function () {
                    data_json.isTao = 1;
                    if (data_json._jobid !== "") {
                        data_json.jobid = data_json._jobid;
                    }
                    else {
                        data_json.btime = 1;
                    }
                    window.frameElement.setAttribute('data', JSON.stringify(data_json));
                    location.href = location.href + (location.href.indexOf("?") > -1 ? "&" : "?") + "time=" + (new Date()).getTime();
                });
                setTimeout(function () {
                    $("#mysellectid")[0].style.opacity = 1;
                    var pdf__ = setInterval(function () {
                        $("#mysellectid")[0].style.opacity -= 0.01;
                        if ($("#mysellectid")[0].style.opacity <= 0) {
                            clearInterval(pdf__);
                            $("#mysellectid")[0].style.opacity = 0;
                        }
                    }, 200);
                }, 1000);
            }
        };
    }
    if (location.href.match(/doHomeWorkNew/) !== null) {
        $(document).ready(function(){
            function keyDown(keydown){
                keydown.preventDefault();
                var currKey=0, e=keydown||event||window.event;
                currKey = e.keyCode||e.which||e.charCode;
                if(currKey == 83 && (e.ctrlKey||e.metaKey)){
                    noSubmit();
                    return false;
                }
            }
            document.onkeydown = keyDown;
            var cancel_paste = setInterval(function () {
                try {
                    window.myEditor_paste = "";
                    window.pasteText = "";
                }
                catch (e) { }
            }, 1);
            setTimeout(function () {
                clearInterval(cancel_paste);
            }, 5000);
        });
    }
    function fuck_CX_flash() {
        var fuck_CX = setInterval(function () {
            try {
                var str = window.frameElement.getAttribute('data').toString();
                if (str.indexOf("\"danmaku\":1")) {
                    window.frameElement.setAttribute('data', str.replace(/"danmaku":1/g, '"danmaku":0'));
                    console.log("danmaku拦截");
                }
                if (str.indexOf("\"fastforward\":false")) {
                    window.frameElement.setAttribute('data', str.replace(/"fastforward":false/g, '"fastforward":true'));
                    console.log("fastforward拦截");
                }
                if (str.indexOf("\"switchwindow\":1")) {
                    window.frameElement.setAttribute('data', str.replace(/"switchwindow":false/g, '"switchwindow":true'));
                    console.log("switchwindow拦截");
                }
                var mouse_times = 0;
                window.Ext.EventManager.mouseLeaveRe = {
                    'test': (e) => {
                        if (/mouseout/.test(e)) {
                            mouse_times++;
                            console.log("已为您过滤" + mouse_times + "次鼠标移出暂停");

                        }
                    }
                };
            }
            catch (e) { }
        }, 1);
        setTimeout(function () {
            clearInterval(fuck_CX);
        }, 5000);
        window.onload = function () {
            var quick_ddiv = "<font color='#238E23' size=2>播放速度：</font><select style='text-align:center;text-align-last:center;padding-left:6px;margin:-0.6rem 0;' class='select_class_name'><option value='0.5'>0.5</option><option value='1' selected='selected'>1</option><option value='1.25'>1.25（慢快推荐）</option><option value='1.5'>1.5</option><option value='2'>2</option><option value='2.6'>2.6（快推荐）</option><option value='3'>3</option><option value='4'>4</option></select><font color='blue' size=2>  POWER BY：涛之雨  </font><font style='background-color: rgb(255,165,0);color: white;position: fixed;right: 0px;' size=1>本页面上下左右空格已绑定视频，可以快进退、增减音量</font><br /><font color='red' size=2>如果未生效请刷新，多次刷新无效说明失效了，请认真学习，等我补吧(后面没有字了)</font><font color='azure' size=1>（那是不可能的）</font>";
            var btn_only_video = document.createElement("div");
            btn_only_video.id = 'mysellectid';
            $("body")[0].insertBefore(btn_only_video, $("body")[0].firstChild);
            $("#mysellectid").append(quick_ddiv);
            $(".select_class_name").change(function () {
                $("video")[0].playbackRate = $(this).val();
            });
            var rate_Interval = setInterval(function () {
                try {
                    $("video")[0].onratechange = function () {
                        $(".select_class_name").val($("video")[0].playbackRate);
                    };
                    clearInterval(rate_Interval);
                    set_ctrl();
                }
                catch (e) { }
            }, 1);
            function set_ctrl() {
                var vol = 0.1;
                var time = 10;
                var videoElement = $("video")[0];
                $(document).keydown(function (event) {
                    if (event.target.tagName.toLowerCase() == "input") {
                        return 1;
                    }
                    var e = event || window.event;
                    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
                        e.preventDefault();
                    }
                });
                document.onkeyup = function (event) {
                    if (event.target.tagName.toLowerCase() == "input") {
                        return 1;
                    }
                    var e = event || window.event;
                    if (e && e.keyCode === 38) {
                        videoElement.volume !== 1 ? videoElement.volume += vol : 1;
                        return false;
                    }
                    else if (e && e.keyCode === 40) {
                        videoElement.volume !== 0 ? videoElement.volume -= vol : 1;
                        return false;
                    }
                    else if (e && e.keyCode === 37) {
                        videoElement.currentTime !== 0 ? videoElement.currentTime -= time : 1;
                        return false;
                    }
                    else if (e && e.keyCode === 39) {
                        videoElement.volume !== videoElement.duration ? videoElement.currentTime += time : 1;
                        return false;
                    }
                    else if (e && e.keyCode === 32) {
                        videoElement.paused === true ? videoElement.play() : videoElement.pause();
                        return false;
                    }
                };
            }
        };
    }
    function hookCXPlayer(onPlayerInit, contextWindow) {
        if (undefined === contextWindow) {
            contextWindow = window;
        }
        Hooks.set(contextWindow, "jQuery", function (target, propertyName, ignored, jQuery) {
            Hooks.method(jQuery.fn, "cxplayer", function (target, methodName, method, thisArg, args) {
                var replyArgs = arguments, $globalPlayer, $player,
                    globalConfig = args[0];
                function createCXPlayer(config) {
                    if (undefined !== config) {
                        globalConfig = config;
                        args[0] = config;
                    }
                    $globalPlayer = Hooks.Reply.method(replyArgs);
                    return $globalPlayer;
                }
                $player = onPlayerInit(globalConfig, createCXPlayer);
                if (undefined !== $player) {
                    $globalPlayer = $player;
                }
                return $globalPlayer;
            });
            return Hooks.Reply.set(arguments);
        });
    }
    var globalVideoJs;
    function videoJsStudyUncontrolAndTimelineNull(contextWindow) {
        if (undefined === contextWindow) {
            contextWindow = window;
        }
        Hooks.set(contextWindow, "videojs", function (target, propertyName, ignored, videojs) {
            globalVideoJs = videojs;
            Hooks.method(videojs, "registerPlugin", function (target, methodName, method, thisArg, args) {
                if ("studyControl" === args[0]) {
                    method.call(thisArg, "studyControl", function () { });
                    return args[1];
                }
                else if ("timelineObjects" === args[0]) {
                    method.call(thisArg, "timelineObjects", function () { });
                    return args[1];
                }
                else {
                    return Hooks.Reply.method(arguments);
                }
            });
            return Hooks.Reply.set(arguments);
        });
    }
    function hookVideojs(onPlayerInit, contextWindow) {
        if (undefined === contextWindow) {
            contextWindow = window;
        }
        Hooks.set(contextWindow, "ans", function (target, propertyName, ignored, ans) {
            Hooks.method(ans, "VideoJs", function (target, methodName, method, thisArg, args) {
                var replyArgs = arguments, $globalPlayer, $player,
                    globalConfig = args[0].params;
                function createPlayer(config) {
                    var player;
                    if (undefined !== config) {
                        globalConfig = config;
                        args[0].params = config;
                    }
                    Hooks.Reply.method(replyArgs);
                    return globalVideoJs(args[0].videojs);
                }
                $player = onPlayerInit(globalConfig, createPlayer);
                if (undefined !== $player) {
                    $globalPlayer = $player;
                }
                return $globalPlayer;
            });
            return Hooks.Reply.set(arguments);
        });
    }
//     if ("/ananas/modules/video/index.html" === window.location.pathname) {
//         debugger;
//         hookCXPlayer(function (config, createCXPlayer) {
//             var $player;
//             config.datas.enableFastForward = true;
//             config.datas.enableSwitchWindow = 1;
//             config.datas.errorBackTime = false;
//             config.datas.isAutoPlayNext = true;
//             config.datas.isDefaultPlay = true;
//             config.datas.switchwindow = false;
//             config.datas.fastforward = false;
//             config.datas.pauseAdvertList = [];
//             config.datas.preAdvertList = [];
//             $player = createCXPlayer();
//             $player.unbind("onPause");
//             $player.pauseMovie = function () { };
//             $player.bind("onError", function () {
//                 if (4 === $player.getPlayState()) {
//                     window.location.reload();
//                 }
//             });
//             window.MoocPlayer.prototype.switchWindow = function () {
//                 return this;
//             };
//             window.jQuery.fn.pauseMovie = function () { };
//         });
//         videoJsStudyUncontrolAndTimelineNull();
//         hookVideojs(function (config, createPlayer) {
//             var $player;
//             config.enableFastForward = 1;
//             config.enableSwitchWindow = 1;
//             $player = createPlayer();
//         });
//     }
    if (location.href.match(/video/) !== null) {
        fuck_CX_flash();
    }
})();




