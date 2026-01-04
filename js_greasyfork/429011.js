// ==UserScript==
// @name         MCBBS 管理增强
// @version      1.0.0
// @description  MCBBS 管理增强脚本
// @author       我是绵羊Yang_g
// @match        https://*.mcbbs.net/*
// @run-at       document-end
// @namespace https://i.zapic
// @downloadURL https://update.greasyfork.org/scripts/429011/MCBBS%20%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429011/MCBBS%20%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    console.log("%c【SPR】MCBBS管理增强脚本已运行！", "color: green;");

    //console.log();

    const UID = document.cookie.split(';').map(item => item.split('=')).find(item => item[0].indexOf('st_p') > -1)[1].split('%')[0];

    if (document.getElementsByTagName('meta').viewport) {
        console.log("%c【SPR】MCBBS管理增强脚本:", "color: green;", "检测到手机版，已禁用脚本。");
        return false;
    }

    //初始化jQuery和基本封装方法
    let $ = jQuery;
    let getRequest = (variable, url = "") => {
        let query = url ? /\?(.*)/.exec(url)[1] : window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    var objMdm = document.getElementById("modmenu");

    if (objMdm != undefined) {
        //删除快捷键
        var objDel = document.getElementById("modmenu").firstElementChild;
        objDel.accessKey = "z";
        objDel.title = "[Alt + Z]";

        try {
            //关闭快捷键
            var objCls = objMdm.children[16];
            objCls.accessKey = "c";
            objCls.title = "[Alt + C]";
        } catch(err) {
            objDel.accessKey = "";
            objDel.title = "";
        }
    }

    //评分快捷键
    var objRat = document.getElementById("ak_rate");
    if (objRat != undefined) {
        objRat.accessKey = "p";
        objRat.title = "评分表立场 [Alt + P]";
    }

    /*
    function setIconColor(object, cR, cG, cB) {
        object.css("background-image","linear-gradient(to right, rgba("+cR+", "+cG+", "+cB+", 0.3), rgba("+cR+", "+cG+", "+cB+", 0))");
        object.css("border-left","3px solid rgb("+cR+", "+cG+", "+cB+")");
    }

    var objTieIcn = $('.icn');
    if (objTieIcn != undefined) {
        setIconColor(objTieIcn, 251, 242, 219);
    }

    var objNewRe = $('a[title*="有新回复"]').parent();
    if (objNewRe != undefined) {
        setIconColor(objNewRe, 255, 136, 0);
    }

    var objNew = $('img[alt="新人帖"]').parent().parent().children(".icn");
    if (objNew != undefined) {
        setIconColor(objNew, 110, 232, 115);
    }

    var objHotP = $('img[alt="热帖"]').parent().parent().children(".icn");
    if (objHotP != undefined) {
        setIconColor(objHotP, 235, 132, 132);
    }

    //精华
    var objDigest = $('img[alt="digest"]').parent().parent().children(".icn");
    if (objDigest != undefined) {
        setIconColor(objDigest, 0, 203, 214);
    }

    var objDigest2 = $('img[title="精华 2"]').parent().parent().children(".icn");
    if (objDigest2 != undefined) {
        setIconColor(objDigest2, 0, 161, 204);
    }

    var objDigest3 = $('img[title="精华 3"]').parent().parent().children(".icn");
    if (objDigest3 != undefined) {
        setIconColor(objDigest3, 0, 123, 194);
    }

    var objAbsmiddle = $('img[alt="原创"]').parent().parent().children(".icn");
    if (objAbsmiddle != undefined) {
        setIconColor(objAbsmiddle, 61, 222, 158);
    }

    var objCloss = $('a[title*="关闭的主题"]').parent();
    if (objCloss != undefined) {
        setIconColor(objCloss, 187, 187, 187);
    }

    var objTop1 = $('a[title*="本版置顶主题"]').parent();
    if (objTop1 != undefined) {
        setIconColor(objTop1, 161, 215, 252);
    }

    var objTop2 = $('a[title*="分类置顶主题"]').parent();
    if (objTop2 != undefined) {
        setIconColor(objTop2, 110, 171, 235);
    }

    var objTop3 = $('a[title*="全局置顶主题"]').parent();
    if (objTop3 != undefined) {
        setIconColor(objTop3, 33, 106, 207);
    }*/

    var objZj = $('.xg1:contains("中奖概率")');
    if (objZj != undefined) {
        objZj.addClass("spr-red");
    }

    var objSt = $('.t_fsz:contains("23333"), .t_fsz:contains("水一"), .t_fsz:contains("水水水"), .t_fsz:contains("mcbbs有你更精彩"), .t_fsz:contains("MCBBS有你更精彩"), .t_fsz:contains("。。。。。。。"), .t_fsz:contains("eeee"), .t_fsz:contains("氵氵氵"), .t_fsz:contains("完成任务"), .t_fsz:contains("过任务"), .t_fsz:contains("任务需要"), .t_fsz:contains("00000"), .t_fsz:contains("11111"), .t_fsz:contains("22222"), .t_fsz:contains("33333"), .t_fsz:contains("44444"), .t_fsz:contains("55555"), .t_fsz:contains("66666"), .t_fsz:contains("77777"), .t_fsz:contains("88888"), .t_fsz:contains("99999")');
    var objAuthi = $('.pi>.authi a.xw1');
    var objPlcPi = $('.plc .pi .authi');
    if (objPlcPi != undefined) {
        objPlcPi.append('<span class="clearbgr"><span class="pipe">|</span><a href="javascript: void(0);" class="clearbg">清除背景</a></span>');
    }

    $(".clearbg").click(function(){
        objSt.parent().parent().parent().parent().parent().css("background-color","");
        $(".clearbgr").remove();
    });


    if (objSt[0] != null) {
        console.log(objSt);
        objSt.parent().parent().parent().parent().parent().css("background-color","#FFE7E7");
        $("body").append($(`<div id="close_script_alert" style="width:430px;position: fixed; left: 20px; top: 80px; z-index: 9999; transform: matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025) translateX(-120%); background: rgba(228, 0, 0, 0.81); color: white; padding: 15px; transition-duration: 0.3s; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.66) 2px 2px 5px 0px;"><h1 style="font-size: 3em;float: left;margin-right: 12px;font-weight: 500;margin-top: 6px;">注意</h1><span style="font-size: 1.7em;">本主题内可能存在水贴</span><br>当前页面中有水贴迹象，请注意检查主题与回复内容，可疑内容已被红色高亮标记。</div>`));
        setTimeout(() => { $("#close_script_alert")[0].style.transform = "matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025)"; }, 10);
        setTimeout(() => { $("#close_script_alert")[0].style.transform = "none"; }, 300);
        setTimeout(() => { $("#close_script_alert")[0].style.transform = "translateX(-120%)"; }, 10000);
    } else if (objSt[1] != null) {
        if (objAuthi[0].text == objAuthi[1].text) {
            $("body").append($(`<div id="close_script_alert" style="width:430px;position: fixed; left: 20px; top: 80px; z-index: 9999; transform: matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025) translateX(-120%); background: rgba(228, 0, 0, 0.81); color: white; padding: 15px; transition-duration: 0.3s; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.66) 2px 2px 5px 0px;"><h1 style="font-size: 3em;float: left;margin-right: 12px;font-weight: 500;margin-top: 6px;">注意</h1><span style="font-size: 1.7em;">楼主可能自占二楼</span><br>当前页面中楼主可能自占了2楼，请注意检查！当然也有可能是有人重复发帖，这是个BUG！</div>`));
            setTimeout(() => { $("#close_script_alert")[0].style.transform = "matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025)"; }, 10);
            setTimeout(() => { $("#close_script_alert")[0].style.transform = "none"; }, 300);
            setTimeout(() => { $("#close_script_alert")[0].style.transform = "translateX(-120%)"; }, 10000);
        }
    }

    var urlS = document.URL.split("#");
    var urlJ = urlS[0];


    //载入面板////////////////////////////////////////////////////////////////////////////////////////////////////
    $('body').append('<iframe id="id_iframe" name="nm_iframe" style="display:none;"></iframe>');
    $('body').append('<div class="lb-block"><div id="spr-md-msglist"></div><div class="lb-box" id="spr-md-rate" style="display:none;"></div><div class="lb-box" id="spr-md-log-anl" style="display:none;"></div><div class="lb-box" id="spr-md-log"></div><div class="lb-box" id="spr-md-cmd" style="display:none; width: 197px;"><form action="" method="post" target="nm_iframe"><input type="text" name="sprtxtcmd" id="sprtxtcmd" class="lb-ipt" autocomplete="off" /><input type="submit" value="执行" id="spr-cmd-ok" style="display:none;" /></form></div></div>');
    var objLbBlk = $('.lb-block');
    var objMdLog = $('#spr-md-log');
    var objMsgList = $('#spr-md-msglist');
    objMdLog.append('<a href="javascript: void(0);" id="clossdebug">[关闭面板]</a> ')
    objMdLog.append('<a href="javascript: void(0);" id="sprcmd" accesskey="t" style="display:none;">[控制台]</a>')
    if (objPlcPi.length != 0) {
        objMdLog.append('<p>当前页面：主题</p>');
        objMdLog.append('<p>水贴计数：' + objSt.length + ' / ' + objPlcPi.length +'</p>')

        var objPstLst = $('#postlist>div[id*="post_"]');

        var objMdLogAnl = $('#spr-md-log-anl');
        objMdLogAnl.css('display','block');
        try {

            for (var i = 0; i < objAuthi.length; i++) {
                objMdLogAnl.append('<p><a href="' + urlJ +'#' + objPstLst[i].id + '">' + objAuthi[i].text + '</a></p>')
            }
        } catch(err) {
            objMdLogAnl.text("");
            logErr('获取目录发生错误！');
            for (i = 0; i < objAuthi.length; i++) {
                objMdLogAnl.append('<p>' + objAuthi[i].text + '</p>')
            }
        }

    } else {
        objMdLog.append('<p>当前页面暂无数据报告。</p>');
        /*
        $('#clossdebug').text('[关闭面板 (3秒)]')
        setTimeout(function () {
            $('#clossdebug').text('[关闭面板 (2秒)]')
        }, 1000);
        setTimeout(function () {
            $('#clossdebug').text('[关闭面板 (1秒)]')
        }, 2000);
        setTimeout(function () {
            $("#clossdebug").parent().parent().remove();
        }, 3000);
        */
    }

    $("#clossdebug").click(function(){
        $("#clossdebug").parent().parent().remove();
    });

    $("#sprcmd").click(function(){
        if ($("#spr-md-cmd").css('display') == "none") {
            $("#spr-md-cmd").css('display', 'block');
            $("#sprtxtcmd").focus();
        } else {
            $("#spr-md-cmd").css('display', 'none');
        }
    });

    /*
    $('#sprtxtcmd').bind('input propertychange', function() {
        $(this).css("background-color","#FFFFCC");
    });*/

    //控制台
    $("#spr-cmd-ok").click(function(){
        var cmdtxt = $("#sprtxtcmd").val().split(' ');
        $("#sprtxtcmd").val('');
        $("#spr-md-cmd").css('display', 'none');

        var cmdtext = cmdtxt[1];
        if (cmdtxt[2] != undefined) {
            for(var m = 2; m < cmdtxt.length; m++) {
                cmdtext = cmdtext + ' ' + cmdtxt[m];
            }
        }

        switch (cmdtxt[0]) {
            case '':
                break;
            case './':
                $("#spr-md-cmd").css('display', 'block');
                $("#spr-md-cmd").css('width', '1000px');
                $("#sprtxtcmd").focus();
                break;
            case '/.':
                $("#spr-md-cmd").css('display', 'block');
                $("#spr-md-cmd").css('width', '197px');
                $("#sprtxtcmd").focus();
                break;
            case 'cd':
                var doBlank;

                if (cmdtxt[1] != undefined) {
                    if (cmdtxt[3] == 'f') {
                        doBlank = '_self';
                    } else {
                        doBlank = '_blank';
                    }
                    switch (cmdtxt[1]) {
                        case '*':
                            window.open('https://www.mcbbs.net/', doBlank);
                            break;
                        case 'a':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/portal.php?mod=view&aid=' + cmdtxt[2], doBlank);
                            } else {
                                logErr("语法：cd a <文章ID> [是否新窗]");
                            }
                            break;
                        case 'f':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '*') {
                                    window.open('https://www.mcbbs.net/forum-' + cmdtxt[2] + '-1.html', doBlank);
                                } else {
                                    window.open('https://www.mcbbs.net/forum.php', doBlank);
                                }
                            } else {
                                logErr("语法：cd f <版块ID> [是否新窗]");
                            }
                            break;
                        case 'p':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/forum.php?mod=redirect&goto=findpost&ptid=0&pid=' + cmdtxt[2], doBlank);
                            } else {
                                logErr("语法：cd p <PID> [是否新窗]");
                            }
                            break;
                        case 'pg':
                            if (cmdtxt[2] != undefined) {
                                switch (cmdtxt[2]) {
                                    case 'blk':
                                        window.open('https://www.mcbbs.net/forum.php?mod=misc&action=showdarkroom', doBlank);
                                        break;
                                    case 'sta':
                                        window.open('https://www.mcbbs.net/misc.php?mod=stat', doBlank);
                                        break;
                                    case 'tag':
                                        window.open('https://www.mcbbs.net/misc.php?mod=tag', doBlank);
                                        break;
                                    default:
                                        logErr("语法：cd pg <页面> [是否新窗]");
                                }
                            } else {
                                logErr("语法：cd pg <页面> [是否新窗]");
                            }
                            break;
                        case 't':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '*') {
                                    window.open('https://www.mcbbs.net/thread-' + cmdtxt[2] + '-1-1.html', doBlank);
                                } else {
                                    window.open('https://www.mcbbs.net/forum.php?mod=guide&view=newthread', doBlank);
                                }
                            } else {
                                logErr("语法：cd t <帖子ID> [是否新窗]");
                            }
                            break;
                        case 'tag':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '*') {
                                    window.open('https://www.mcbbs.net/misc.php?mod=tag&id=' + cmdtxt[2], doBlank);
                                } else {
                                    window.open('https://www.mcbbs.net/misc.php?mod=tag', doBlank);
                                }
                            } else {
                                logErr("语法：cd tag <TAG ID> [是否新窗]");
                            }
                            break;
                        case 'tagn':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '*') {
                                    window.open('https://www.mcbbs.net/misc.php?mod=tag&name=' + cmdtxt[2], doBlank);
                                } else {
                                    window.open('https://www.mcbbs.net/misc.php?mod=tag', doBlank);
                                }
                            } else {
                                logErr("语法：cd tagn <TAG名称> [是否新窗]");
                            }
                            break;
                        case 'u':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '~') {
                                    window.open('https://www.mcbbs.net/?' + cmdtxt[2], doBlank);
                                } else {
                                    if (!UID) {
                                        logErr('您尚未登录！');
                                    } else {
                                        window.open('https://www.mcbbs.net/?' + UID, doBlank);
                                    }
                                }
                            } else {
                                logErr("语法：cd u <UID> [是否新窗]");
                            }
                            break;
                        case 'un':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/home.php?mod=space&username=' + cmdtxt[2], doBlank);
                            } else {
                                logErr("语法：cd un <用户名> [是否新窗]");
                            }
                            break;
                        case 'unm':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/forum.php?mod=modcp&action=thread&op=post&do=search&searchsubmit=1&users=' + cmdtxt[2], doBlank);
                            } else {
                                logErr("语法：cd unm <用户名> [是否新窗]");
                            }
                            break;
                        case 'uns':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/home.php?mod=spacecp&ac=search&username=' + cmdtxt[2] + '&searchsubmit=yes', doBlank);
                            } else {
                                logErr("语法：cd uns <用户名> [是否新窗]");
                            }
                            break;
                        case 'us':
                            if (cmdtxt[2] != undefined) {
                                if (cmdtxt[2] != '~') {
                                    window.open('https://www.mcbbs.net/home.php?mod=space&uid=' + cmdtxt[2] + '&do=index&view=admin', doBlank);
                                } else {
                                    if (!UID) {
                                        logErr('您尚未登录！');
                                    } else {
                                        window.open('https://www.mcbbs.net/home.php?mod=space&uid=' + UID + '&do=index&view=admin', doBlank);
                                    }
                                }
                            } else {
                                logErr("语法：cd us <UID> [是否新窗]");
                            }
                            break;
                        case 'usr':
                            if (cmdtxt[2] != undefined) {
                                window.open('https://www.mcbbs.net/home.php?mod=space&uid=' + cmdtxt[2] + '&do=index&view=admin&additional=removevlog', doBlank);
                            } else {
                                logErr("语法：cd usr <UID> [是否新窗]");
                            }
                            break;
                        default:
                            logErr("语法：cd <类别> ...");
                    }
                } else {
                    logErr("语法：cd <类别> ...");
                }

                break;
            case 'cls':
                try {$('#spr-md-log-msg').remove();} catch(err) {}
                break;
            case 'date':
                logMsg(Date(), 'msg', 'auto');
                break;
            case 'err':
                if (cmdtxt[1] != undefined) {
                    logErr(cmdtext);
                } else {
                    logErr("语法：err <消息...>");
                }
                break;
            case 'msg':
                if (cmdtxt[1] != undefined) {
                    logMsg(cmdtext, 'msg', 'auto');
                } else {
                    logErr("语法：msg <消息...>");
                }
                break;
            case 'open':
                var win = window.open(cmdtxt[1],'_blank');
                if (win) {
                    win.focus();
                } else {}
                break;
            case 'ps':
                subDivList();
                break;
            case 'rit':
                if (cmdtxt[1] != undefined) {
                    logMsg(cmdtext, 'rit', 'auto');
                } else {
                    logErr("语法：rit <消息...>");
                }
                break;
            default:
                logErr("未知的命令：'" + cmdtxt[0] + "'");
        }
    });

    $("#spr-md-rate").append('<p>评分：<a href="javascript: void(0);" id="rate-a" accesskey="q">[标准套餐 Alt + Q]</a></p>');
    $("#spr-md-rate").append('<p>评分：<a href="javascript: void(0);" id="rate-b" accesskey="w">[精简套餐 Alt + W]</a></p>');
    $("#spr-md-rate").append('<p>评分：<a href="javascript: void(0);" id="rate-c" accesskey="e">[转账套餐 Alt + E]</a></p>');
    $("#spr-md-rate").append('<p>评分：<a href="javascript: void(0);" id="rate-d" accesskey="a">[OK套餐 Alt + A]</a></p>');
    $("#spr-md-rate").append('<p>评分：<a href="javascript: void(0);" id="rate-e" accesskey="r">[补爱心套餐 Alt + R]</a></p>');

    $('a[onclick*="rate"]').click(function(){
        $("#spr-md-rate").css("display","block");
    });

    $('#rate-a').click(function(){
        var tst1 = $("input#score1");
        var tst2 = $("input#reason");
        var tst3 = $("textarea#reason");
        if (tst1.length != 0) {
            try {
                if ($("input#score1").val() == -1 && $("input#score2").val() == -20) {
                    $("input#reason, #reason_temp").val('请仔细阅读版规，不要灌水！');
                    $("input#reason, #reason_temp").select();
                    $("input#reason, #reason_temp").focus();
                } else {
                    $("input#score1").val('-1');
                    $("input#score2").val('-20');
                    $("input#reason, #reason_temp").focus();
                }
            } catch(err) {
                logErr('自动填写错误！');
                $("#spr-md-rate").css("display","none");
            }
        } else if (tst2.length != 0) {
            $("input#reason, #reason_temp").val('请仔细阅读版规，不要灌水！');
            $("input#reason, #reason_temp").select();
            $("input#reason, #reason_temp").focus();
        } else if (tst3.length != 0) {
            $("textarea#reason, #reason_temp").val('请仔细阅读版规，不要灌水！');
            $("textarea#reason, #reason_temp").select();
            $("textarea#reason, #reason_temp").focus();
        } else {
            logErr('未找到评分窗口！');
            $("#spr-md-rate").css("display","none");
        }
    });

    $('#rate-b').click(function(){
        var tst1 = $("input#score1");
        if (tst1.length != 0) {
            try {
                if ($("input#score1").val() == 0 && $("input#score2").val() == -10) {
                    $("input#reason").val('请善用编辑功能，不要连楼！');
                    $("input#reason").focus();
                } else {
                    $("input#score1").val('0');
                    $("input#score2").val('-10');
                    $("input#reason").focus();
                }
            } catch(err) {
                logErr('自动填写错误！');
                $("#spr-md-rate").css("display","none");
            }
        } else {
            logErr('未找到评分窗口！');
            $("#spr-md-rate").css("display","none");
        }
    });

    $('#rate-c').click(function(){
        var tst1 = $("input#score1");
        var tst2 = $("input#reason");
        var tst3 = $("textarea#reason");
        if (tst1.length != 0) {
            try {
                if ($("input#score1").val() == -4 && $("input#score2").val() == -40 && $("input#score6").val() == -1) {
                    $("input#reason, #reason_temp").val('违规转账');
                    $("input#reason, #reason_temp").select();
                    $("input#reason, #reason_temp").focus();
                } else {
                    $("input#score1").val('-4');
                    $("input#score2").val('-40');
                    $("input#score6").val('-1');
                    $("input#reason, #reason_temp").focus();
                }
            } catch(err) {
                logErr('自动填写错误！');
                $("#spr-md-rate").css("display","none");
            }
        } else if (tst2.length != 0) {
            $("input#reason, #reason_temp").val('违规转账');
            $("input#reason, #reason_temp").select();
            $("input#reason, #reason_temp").focus();
        } else if (tst3.length != 0) {
            $("textarea#reason, #reason_temp").val('违规转账');
            $("textarea#reason, #reason_temp").select();
            $("textarea#reason, #reason_temp").focus();
        } else {
            logErr('未找到评分窗口！');
            $("#spr-md-rate").css("display","none");
        }
    });

    $('#rate-d').click(function(){
        var tst1 = $("input#score1");
        if (tst1.length != 0) {
            try {
                if ($("input#score1").val() == 0 && $("input#score2").val() == 1) {
                    $("input#reason").val('ok');
                    $("input#reason").focus();
                } else {
                    $("input#score1").val('0');
                    $("input#score2").val('1');
                    $("input#reason").focus();
                }
            } catch(err) {
                logErr('自动填写错误！');
                $("#spr-md-rate").css("display","none");
            }
        } else {
            logErr('未找到评分窗口！');
            $("#spr-md-rate").css("display","none");
        }
    });

    $('#rate-e').click(function(){
        var tst1 = $("input#score1");
        if (tst1.length != 0) {
            try {
                if ($("input#score1").val() == 0 && $("input#score7").val() == 1) {
                    $("input#reason").val('补');
                    $("input#reason").focus();
                } else {
                    $("input#score1").val('0');
                    $("input#score7").val('1');
                    $("input#reason").focus();
                }
            } catch(err) {
                logErr('自动填写错误！');
                $("#spr-md-rate").css("display","none");
            }
        } else {
            logErr('未找到评分窗口！');
            $("#spr-md-rate").css("display","none");
        }
    });

    var cssStr = "";
    cssStr += ".pr {width: 25px; height: 25px;}";
    cssStr += ".pc {width: 25px; height: 25px;}";
    cssStr += ".checkbox {width: 50px!important; height: 50px!important;}";
    cssStr += ".infoBox { margin: 0 auto;}.infoBoxTitle { margin: 3px auto; padding: 0; text-align: center; font-weight: 700;}.infoBoxIcon { display: table-cell; padding: 2px 0 2px .5em; vertical-align: middle;}.infoBoxText { display: table-cell; padding: .25em .5em .25em 1.3em; width: 100%; vertical-align: middle;}.infoBoxContent { border: 1px solid #ddd; border-left-width: 0; background: #fbfbfb;}.infoBoxBelow { margin: 0 auto; padding: 0;} ";
    /* cssStr += ".tl th a:visited, .tl td.fn a:visited {color: #666; background: rgba(0,0,0,0.1);}"; */
    cssStr += "tr:hover{}";
    cssStr += ".tl th a:visited, .tl td.fn a:visited {color: #888;}";
    cssStr += ".spr-red{color:red!important;font-weight:bold;}";
    cssStr += ".lb-block{position: fixed; bottom: 5px; left: 5px; width: 217px; height: auto; color: #FFF;}";
    cssStr += ".lb-box{background: rgba(0,0,0,0.25); width: auto; height: auto; color: #FFF; padding: 10px; margin-top: 5px; text-shadow: 1px 1px 0px #000; transition: all .3s; max-height: 400px;overflow: overlay;}";
    cssStr += ".lb-box:hover{background: rgba(0,0,0,0.5);}";
    cssStr += ".lb-box-red{background: rgba(255,0,0,0.3);}";
    cssStr += ".lb-box-red:hover{background: rgba(255,0,0,0.5);}";
    cssStr += ".lb-box-green{background: rgba(0,150,0,0.3);}";
    cssStr += ".lb-box-green:hover{background: rgba(0,150,0,0.5);}";
    cssStr += ".lb-box a{color: #FFF;}";
    cssStr += ".lb-ipt{background: rgba(0,0,0,0.25); width: 98%; border: 0px; color: #FFF;}";
    cssStr += ".tl .icn{background-image: linear-gradient(90deg, transparent, transparent); border-left: 3px solid transparent;}";
    cssStr += "";

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = cssStr;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);

    function showInfoBox (text, type) {
        var objPgt = document.getElementById("pgt");
        if (objPgt != undefined) {
            objPgt.innerHTML += '</div><div class="infoBoxContent"><!--<div class="infoBoxTitle">{{{title}}}</div>--><div class="infoBoxIcon"></div><div class="infoBoxText">'+text+'</div><div class="infoBoxBelow"></div>'
        }
    }

    function clearBG () {
        objSt.parent().parent().parent().parent().css("background-color","");
    }

    function logErr (text) {
        logMsg('[ERROR] ' + text, 'err', 'auto');
    }

    function logRit (text) {
        logMsg( text, 'rit', 'auto');
    }

    function logMsg (text, type, times) {
        try {
            $('#spr-md-log-msg[style*=none]').remove();
        } catch(err) {}

        var classtype;

        switch (type) {
            case 'msg':
                classtype = '';
                break;
            case 'err':
                classtype = 'lb-box-red';
                break;
            case 'rit':
                classtype = 'lb-box-green';
                break;
        }

        var objLbMsg = $('<div class="lb-box ' + classtype + '" id="spr-md-log-msg"></div>');

        objMsgList.append(objLbMsg);
        objLbMsg.text(text);

        var timeout;
        if (times == 'auto') {
            timeout = text.length * 1000 / 8;
            if (timeout < 3000) {timeout = 3000;}
        } else if (!isNaN(times)) {
            timeout = times;
        } else {
            timeout = 3000;
        }
        setTimeout(function () {
            objLbMsg.fadeOut(1000);
        }, timeout);
    }

    function subDivList(){
        var txt1 = '';
        $('.lb-block>div').each(function(index){
            // alert(this + " " + index);
            // 打印DIV的id属性
            // alert($(this).attr('id'));
            txt1 += $(this).attr('id') + ' / ';
        });
        txt1 += '已列出所有元素。';
        logMsg(txt1, 'msg', '10000');
    }

    //var sprlist1 = document.querySelectorAll('.i.y>dl.cl');
    //var sprlist2 = document.querySelectorAll('dl.cl dd');
    //var sprlist3 = document.querySelectorAll('dl.pil.cl');
    //for(let i = 0 ; i < sprlist3.length ; i ++ ){
    //    sprlist3[i].appendChild(sprlist1[i]);
    //}

    }

)();