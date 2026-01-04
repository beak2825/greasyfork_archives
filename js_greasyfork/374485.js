// ==UserScript==
// @name         深圳大学OJ美化
// @namespace    https://www1.szu.edu.cn/szu.asp
// @version      1.1.3
// @description  Use a better user interface
// @author       LK
// @match        http://172.31.234.11/*
// @match        http://172.31.234.12/*
// @match        http://172.31.234.14/*
// @match        http://172.31.234.21/*
// @match        http://172.31.234.46/*
// @match        http://172.31.234.47/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374485/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6OJ%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/374485/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6OJ%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = window.location.href;
    let ip = /(172(\.\d{1,3}){3})/.exec(url)[1];


    let cssFontface = "@font-face{font-family:'iconfont';src:url('//at.alicdn.com/t/font_903081_3u0cf7ap816.eot');src:url('//at.alicdn.com/t/font_903081_3u0cf7ap816.eot?#iefix') format('embedded-opentype'),url('//at.alicdn.com/t/font_903081_3u0cf7ap816.woff') format('woff'),url('//at.alicdn.com/t/font_903081_3u0cf7ap816.ttf') format('truetype'),url('//at.alicdn.com/t/font_903081_3u0cf7ap816.svg#iconfont') format('svg')}";
    let cssGlobal = ".iconfont{font-family:'iconfont'!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.No_Select{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}body{font-family:'microsoft yahei'}*::selection{background-color:#3c3;color:#fff}html{min-width:1200px;min-height:100%;position:relative}body{min-height:100%;margin:0;padding:0;background-color:#EEE}ul{margin:0;padding:0}li{list-style:none;color:#555}a{text-decoration:none;color:inherit}i{color:inherit}input{font-family:inherit}.Navigation_Bar{width:100%;min-width:1200px;height:75px;box-shadow:0 0 10px #888;background-color:#FFF;z-index:9999999;position:fixed}.Navigation_Bar_UL{text-align:center;white-space:nowrap;z-index:123456789}.Navigation_Bar_UL>li{height:75px;display:inline-block;position:relative;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Navigation_Bar_UL>li>a{width:175px;height:75px;line-height:75px;text-align:center;position:relative;text-indent:1em;font-size:18px;display:block}.Navigation_Bar_UL>li>a:before{top:50%;left:50%;width:100%;border-bottom:2px transparent solid;content:'_';color:transparent;position:absolute;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transition:border-color .3s ease-in-out;-moz-transition:border-color .3s ease-in-out;-ms-transition:border-color .3s ease-in-out;-o-transition:border-color .3s ease-in-out;transition:border-color .3s ease-in-out}.Navigation_Bar_UL>li:hover>a:before,.Navigation_Bar_Selected a:before{border-color:#39f!important}.Navigation_Bar_UL>li:hover,.Navigation_Bar_Selected{color:#39f}.Navigation_Bar_UL>li i{top:50%;left:20%;position:absolute;font-size:1.3em;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.Navigation_Bar_Mine{width:75px;float:right}.Navigation_Bar_Mine_UL{background-color:#fff;box-shadow:0 0 10px #888;z-index:123456788;display:none;float:right}.Navigation_Bar_Mine_UL li{width:200px;height:50px;line-height:50px;text-align:center}.Navigation_Bar_Mine_UL li a{height:50px;display:block;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.Navigation_Bar_Mine_UL li a:hover{background-color:#39f;color:#fff}.Footer{top:100%;width:100%;height:90px;padding:15px 0;line-height:30px;background-color:#fff;box-shadow:0 0 10px #888;box-sizing:border-box;text-align:center;position:absolute;color:#555;-webkit-transform:translateY(-100%);-moz-transform:translateY(-100%);-ms-transform:translateY(-100%);-o-transform:translateY(-100%);transform:translateY(-100%)}.Footer p{margin:0;padding:0}.Footer a{color:#39f;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.Footer a:hover{color:#22f}";

    let jsNavMine = "<script>$(document).ready(function(){let navBarMine=false;$(\".Navigation_Bar_Mine\").hover(function(){navBarMine=true;$(\".Navigation_Bar_Mine_UL\").stop(true).show(500);},function(){navBarMine=false;setTimeout(function(){if(!navBarMine){$(\".Navigation_Bar_Mine_UL\").stop(true).hide(500);}},200);})});</script>";

    function addNavMine() {
        let iFrame = document.createElement("iframe");
        iFrame.src = "http://" + ip + "/JudgeOnline/";
        iFrame.style = "display: none";
        document.getElementsByTagName("body")[0].append(iFrame);
        iFrame.onload = function() {
            let navMine = iFrame.contentDocument.children[0].children[1].children[0].children[0].children[4];
            $(".Navigation_Bar_UL").append(navMine);
            iFrame.parentNode.removeChild(iFrame);
            activeNavMine();
        };
    }
    function activeNavMine() {
        let navBarMine = false;
        $(".Navigation_Bar_Mine").hover(function() {
            navBarMine = true;
            $(".Navigation_Bar_Mine_UL").stop(true).show(500);
        }, function() {
            navBarMine = false;
            setTimeout(function() {
                if (!navBarMine) {
                    $(".Navigation_Bar_Mine_UL").stop(true).hide(500);
                }
            }, 200);
        })
    }

    if (url.match(/status\.php/i)) {
    /*
     * ========================
     *           状态
     * ========================
     */
        console.log("状态");
        let x;

        let titles = ["运行编号", "用户", "问题", "结果", "内存", "耗时", "语言", "代码长度", "提交时间"];

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*(\w+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let trs = $(".content-box-header tbody").eq(1).children("tr");
        let tdas = [];
        let tds = [];
        for (let i = 0; i < trs.length; i++) {
            tdas[i] = [];
            tds[i] = [];
            let str = trs[i].innerHTML.replace(/(\n|<\/?td>)/g, "\t");
            // console.log(trs[i].innerHTML);
            let strs = str.split("\t");
            for (let j = 0, k = 0; j < titles.length; j++, k++) {
                if (strs[k] == "") {
                    j--;
                    continue;
                }
                tds[i][j] = strs[k];
            }
            tdas[i][0] = /href=\"([^<]*)\"/.exec(tds[i][1])[1];
            tdas[i][1] = /href=\"([^<]*)\"/.exec(tds[i][2])[1];
            if (tds[i][3].match(/(点击看详细|Click)/)) {
                tdas[i][2] = /href=\"([^<]*)\"/.exec(tds[i][3])[1];
            }
            if (tds[i][6] != "----" && tds[i][6].match(/<a/)) {
                tdas[i][3] = /href=\"([^<]*)\"/.exec(tds[i][6])[1];
                tdas[i][4] = /self\" href=\"([^<]*)\"/.exec(tds[i][6])[1];
            }
            for (let j = 0; j < tds[i].length; j++) {
                tds[i][j] = tds[i][j].replace(/<\/.*>/, "").replace(/<.*>/, "");
            }
        }

        let inputLanguageSelected = $("select[name='language']")[0].selectedIndex;
        let inputResultSelected = $("select[name='jresult']")[0].selectedIndex;

        x = $("#main").children("#center").eq(2).children("a");
        let pagePrev = x.eq(1).attr("href");
        let pageNext = x.eq(2).attr("href");
        let cid;
        if (url.match(/cid=/i)) {
            cid = /cid=(\d+)&?/i.exec(url)[1].trim();
        } else {
            cid = "";
        }

        /*for (let i = 0; i < tds.length; i++) {
        for (let j = 0; j < tds[i].length; j++) {
            console.log(titles[j], tds[i][j]);
        }
        console.log("\n");
    }*/

        let head = "";
        let body = "";
        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{width:90%;margin:0 auto}.Body_Search{height:75px;background-color:#fff;box-shadow:0 0 10px #888;border-radius:5px;color:#555}.Body_Search ul{width:100%;height:75px;white-space:nowrap;font-size:0}.Body_Search ul li{width:20%;height:100%;display:inline-block;letter-spacing:normal;word-spacing:normal;text-align:center;font-size:16px;zoom:1}.Body_Search input[type=text]{width:calc(100% - 6em);height:35px;max-width:120px;margin:18px 0;padding:0 10px;border:1px #888 solid;border-radius:5px;font-size:14px;color:#555!important;outline:0;-webkit-transition:border-color .3s ease-in-out;-moz-transition:border-color .3s ease-in-out;-ms-transition:border-color .3s ease-in-out;-o-transition:border-color .3s ease-in-out;transition:border-color .3s ease-in-out}.Body_Search input[type=text]:focus{border-color:#39f}.Body_Search input[type=submit]{width:120px;height:45px;margin:15px 0;background-color:#39f;border-radius:5px;cursor:pointer;color:#fff;outline:0;border:0;-webkit-transition:background-color .3s ease-in-out;-moz-transition:background-color .3s ease-in-out;-ms-transition:background-color .3s ease-in-out;-o-transition:background-color .3s ease-in-out;transition:background-color .3s ease-in-out}.Body_Search input[type=submit]:hover{background-color:rgba(51,153,255,0.8)}.Body_Search select{width:120px;height:37px;margin:18px 0;padding:0 10px;border:1px #888 solid;border-radius:5px;outline:0;-webkit-transition:border-color .3s ease-in-out;-moz-transition:border-color .3s ease-in-out;-ms-transition:border-color .3s ease-in-out;-o-transition:border-color .3s ease-in-out;transition:border-color .3s ease-in-out}.Body_Search select:focus{border-color:#39f}.Body_Main{width:100%;background-color:rgba(248,248,248,0.9);box-shadow:0 0 10px #888;border-radius:5px;color:#555;overflow:hidden}.Body_Title{width:100%;height:60px;background-color:#fff;box-shadow:0 0 10px #888;box-sizing:border-box;border-bottom:1px #ddd solid}.Body_Title ul li{width:10%;height:100%;line-height:60px;text-align:center;position:relative;float:left}.Body_Title ul li:before{left:0;content:'|';color:#DDD;position:absolute}.Body_Title ul li:first-child:before{content:none}.Body_Title ul li:nth-child(9){width:20%}.Body_Main_Div{width:100%;height:60px;border-bottom:1px #DDD solid;box-sizing:border-box;margin:0 auto}.Body_Main_Div:nth-child(2n+1){background-color:#fff}.Body_Main_Div:nth-child(2n){background-color:#fafafa}.Body_Main_Div ul li{width:10%;height:100%;line-height:60px;text-align:center;white-space:nowrap;float:left}.Body_Main_Div ul li a{color:#39f;display:block;position:relative;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.Body_Main_Div ul li a:hover{color:#22f!important}.Body_Main_Div ul li:nth-child(4){color:#3c3}.Body_Main_Div ul li:nth-child(9){width:20%;font-size:14px}.Body_Page{width:800px;height:65px;margin:0 auto}.Body_Page_Prev,.Body_Page_Next{width:150px;height:65px;line-height:65px;border-radius:5px;text-align:center;box-shadow:0 0 10px #888;background-color:#fff;color:#555;position:relative;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Page_Prev{float:left}.Body_Page_Next{float:right}.Body_Page_Prev a,.Body_Page_Next a{display:block}.Body_Page_Prev i,.Body_Page_Next i{top:50%;font-size:1.7em;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute}.Body_Page_Prev i{left:20%}.Body_Page_Next i{left:80%}.Body_Page_Prev:hover,.Body_Page_Next:hover{color:#39f}.Body_Page_Number{width:65px;height:65px;line-height:65px;margin-left:30px;border-radius:5px;text-align:center;box-shadow:0 0 10px #888;background-color:#fff;color:#555;float:left}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 状态</title>\n";
        head += "	</head>\n";
        head += "\n";
        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        if (pageNav[1] != undefined) {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
            body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        } else {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
            body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
            if (!logged) {
                body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
                body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
            } else {
                body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
                body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
                if (mailNumber != "0") {
                    body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                } else {
                    body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                }
                body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
                body += "				<li><a href=\"logout.php\">注销</a></li>\n";
            }
            body += "			</ul>\n";
            body += "			</li>\n";
        }
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<form id=\"simform\" action=\"status.php\" method=\"get\">\n";
        body += "			<div class=\"Body_Search\">\n";
        body += "				<ul>\n";
        body += "					<li>\n";
        body += "						<label>\n";
        body += "							题目编号：\n";
        body += "							<input type=\"text\" name=\"problem_id\" value=\"" + $("input[name='problem_id']")[0].value + "\" />\n";
        body += "						</label>\n";
        body += "					</li>\n";
        body += "					<li>\n";
        body += "						<label>\n";
        body += "							用户：\n";
        body += "							<input type=\"text\" name=\"user_id\" value=\"" + $("input[name='user_id']")[0].value + "\" />\n";
        body += "						</label>\n";
        body += "					</li>\n";
        body += "					<li>\n";
        body += "						<label>\n";
        body += "							语言：\n";
        body += "							<select name=\"language\">\n";
        body += "								<option value=\"-1\">All</option>\n";
        body += "								<option value=\"0\">C</option>\n";
        body += "								<option value=\"1\">C++</option>\n";
        body += "								<option value=\"2\">Pascal</option>\n";
        body += "								<option value=\"3\">Java</option>\n";
        body += "								<option value=\"4\">Ruby</option>\n";
        body += "								<option value=\"5\">Bash</option>\n";
        body += "								<option value=\"6\">Python</option>\n";
        body += "								<option value=\"7\">PHP</option>\n";
        body += "								<option value=\"8\">Perl</option>\n";
        body += "								<option value=\"9\">C#</option>\n";
        body += "							</select>\n";
        body += "						</label>\n";
        body += "					</li>\n";
        body += "					<li>\n";
        body += "						<label>\n";
        body += "							结果：\n";
        body += "							<select name=\"jresult\">\n";
        body += "								<option value=\"-1\">All</option>\n";
        body += "								<option value=\"4\">正确</option>\n";
        body += "								<option value=\"5\">格式错误</option>\n";
        body += "								<option value=\"6\">答案错误</option>\n";
        body += "								<option value=\"7\">时间超限</option>\n";
        body += "								<option value=\"8\">内存超限</option>\n";
        body += "								<option value=\"9\">输出超限</option>\n";
        body += "								<option value=\"10\">运行错误</option>\n";
        body += "								<option value=\"11\">编译错误</option>\n";
        body += "								<option value=\"0\">等待</option>\n";
        body += "								<option value=\"1\">等待重判</option>\n";
        body += "								<option value=\"2\">编译中</option>\n";
        body += "								<option value=\"3\">运行并评判</option>\n";
        body += "							</select>\n";
        body += "						</label>\n";
        body += "					</li>\n";
        body += "					<li>\n";
        if (cid != "") {
            body += "						<input type=\"hidden\" id=\"cid\" name=\"cid\" value=\"" + cid + "\" />\n";
        }
        body += "						<input type=\"submit\" value=\"查找\" />\n";
        body += "					</li>\n";
        body += "				</ul>\n";
        body += "			</div>\n";
        body += "			</form>\n";

        body += "\n";
        body += "			<div style=\"width: 100%; height: 20px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Main\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					<ul>\n";
        body += "						<li>运行编号</li>\n";
        body += "						<li>用户</li>\n";
        body += "						<li>问题</li>\n";
        body += "						<li>结果</li>\n";
        body += "						<li>内存</li>\n";
        body += "						<li>耗时</li>\n";
        body += "						<li>语言</li>\n";
        body += "						<li>代码长度</li>\n";
        body += "						<li>提交时间</li>\n";
        body += "					</ul>\n";
        body += "				</div>\n";
        for (let i = 0; i < tds.length; i++) {
            tds[i][6] = tds[i][6].replace(/\/Edit/g, "");
            if (tds[i][3] != "正确" && tds[i][3] != "Accepted") {
                if (tds[i][3].match(/\((点击看详细|Click)\)/i)) {
                    tds[i][3] = tds[i][3].replace(/\((点击看详细|Click)\)/i, "");
                    if (!tds[i][3].match(/(编译|Compile)/i)) {
                        tds[i][3] = "<a href=\"" + tdas[i][2] + "\" style=\"color: #FF3333;\">" + tds[i][3] + "</a>";
                    } else {
                        tds[i][3] = "<a href=\"" + tdas[i][2] + "\" style=\"color: #666666;\">" + tds[i][3] + "</a>";
                    }
                } else if (tds[i][3].match(/(等待|编译|评判|Pending|Compiling|Running)/i)) {
                    tds[i][3] = "<div style=\"color: #666666\">" + tds[i][3] + "</div>";
                } else {
                    tds[i][3] = "<div style=\"color: #FF3333\">" + tds[i][3] + "</div>";
                }
            }
            body += "				<div class=\"Body_Main_Div\">\n";
            body += "					<ul>\n";
            body += "						<li>" + tds[i][0] + "</li>\n";
            body += "						<li><a href=\"" + tdas[i][0] + "\">" + tds[i][1] + "</a></li>\n";
            body += "						<li><a href=\"" + tdas[i][1] + "\">" + tds[i][2] + "</a></li>\n";
            body += "						<li>" + tds[i][3] + "</li>\n";
            body += "						<li>" + tds[i][4] + "</li>\n";
            body += "						<li>" + tds[i][5] + "</li>\n";
            if (tds[i][6] != "----" && tdas[i][4] != undefined) {
                body += "						<li><a href=\"" + tdas[i][4] + "\">" + tds[i][6] + "</a></li>\n";
            } else {
                body += "						<li>" + tds[i][6] + "</li>\n";
            }
            if (tds[i][7] != "----") {
                if (tdas[i][3] != undefined) {
                    body += "						<li><a target=\"_blank\" href=\"" + tdas[i][3] + "\">" + tds[i][7] + "ytes</a></li>\n";
                } else {
                    body += "						<li>" + tds[i][7] + "ytes</a></li>\n";
                }
            } else {
                body += "						<li>----</li>\n";
            }
            body += "						<li>" + tds[i][8] + "</li>\n";
            body += "					</ul>\n";
            body += "				</div>\n";
        }
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Page\">\n";
        body += "				<div class=\"Body_Page_Prev\">\n";
        body += "					<i class=\"iconfont No_Select\">&#xe679;</i>\n";
        body += "					<a href=\"" + pagePrev + "\" id=\"Page_Prev\">&emsp;&emsp;上一页</a>\n";
        body += "				</div>\n";
        body += "				<!--<div class=\"Body_Page_Number\">\n";
        body += "					1\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Page_Number\">\n";
        body += "					2\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Page_Number\">\n";
        body += "					3\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Page_Number\">\n";
        body += "					4\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Page_Number\">\n";
        body += "					5\n";
        body += "				</div>-->\n";
        body += "				<div class=\"Body_Page_Next\">\n";
        body += "					<i class=\"iconfont No_Select\">&#xe6a3;</i>\n";
        body += "					<a href=\"" + pageNext + "\" id=\"Page_Next\">下一页&emsp;&emsp;</a>\n";
        body += "				</div>\n";
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";

        body += jsNavMine;

        $("head").html(head);
        $("body").html(body);

        $("select[name='language']")[0].selectedIndex = inputLanguageSelected;
        $("select[name='jresult']")[0].selectedIndex = inputResultSelected;

        if (pageNav[1] != undefined) {
            addNavMine();
        }
    }
    else if (url.match(/contest\.php\?cid=/i)) {
    /*
     * ========================
     *          问题列表
     * ========================
     */
        console.log("问题列表");

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let title = /\<title\>([^<>]*)\<\/title\>/.exec($("head").html())[1];
        let mainHTML = $("#main").html();

        let cid = /cid=(\d+)&?/i.exec(url)[1].trim();

        let head = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Head{width:90%;margin:0 auto;background-color:#fff;box-shadow:0 0 10px #888;border-radius:5px}.Body_Head_Title{height:100px;line-height:100px;text-align:center;font-size:26px}.Body_Status{margin:0 auto;padding:10px 0;box-sizing:border-box;border-top:1px #DDD solid;text-align:center;font-size:0}.Body_Status div{letter-spacing:normal;word-spacing:normal;display:inline-block;font-size:16px;position:relative}.Body_Status div:before{left:0;content:'|';position:absolute;color:#DDD}.Body_Status div:first-child:before{content:none}.Body_Status_Start,.Body_Status_End{width:35%}.Body_Status_Status,.Body_Status_Public{width:15%}.Body_Status_Status{color:#3C3}.Body_Status_Public{color:#F33}.Body_Note{width:90%;margin:0 auto;padding:20px;background-color:#fff;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center}.Body_Title{height:60px;background-color:#fff;border-bottom:1px #DDD solid;box-sizing:border-box}.Body_Title ul li,.Body_Problem_Set ul li{width:10%;height:60px;line-height:60px;white-space:nowrap;text-align:center;position:relative;float:left}.Body_Title ul li:before{left:0;content:'|';position:absolute;color:#DDD}.Body_Title ul li:first-child:before{content:none}.Body_Title ul li:first-child,.Body_Problem_Set ul li:first-child{width:7%}.Body_Title ul li:nth-child(2),.Body_Problem_Set ul li:nth-child(2){width:13%}.Body_Title ul li:nth-child(3),.Body_Problem_Set ul li:nth-child(3){width:50%}.Body_Problem_Set{width:90%;margin:0 auto;background-color:#fff;box-shadow:0 0 10px #888;border-radius:5px;overflow:hidden}.Body_Problem_Set ul li a:hover{color:#22f}.Body_Problem_Set_Div{height:60px;border-bottom:1px #ddd solid;box-sizing:border-box}.Body_Problem_Set_Div:nth-child(2n){background-color:#fafafa}.Body_Problem_Set_Div ul li i{font-size:24px}.Body_Problem_Set_Div ul li a{height:60px;color:#39f;display:block;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - " + title + "</title>\n";
        head += "	</head>\n";

        if (mainHTML.match(/Not invited or not login/i) || mainHTML.match(/Private Contest is used/i) || (title.match(/No Such Contest/i) && cid != "0")) {
            let body = "";

            body += "	<body>\n";
            body += "		<div class=\"Navigation_Bar\">\n";
            body += "			<ul class=\"Navigation_Bar_UL\">\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
            body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"discuss/discuss.php?cid=" + cid + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"contest.php?cid=" + cid + "\" id=\"Nav_Problem\">问题</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"contestrank.php?cid=" + cid + "\" id=\"Nav_Rank\">名次</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php?cid=" + cid + "\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"conteststatistics.php?cid=" + cid + "\" id=\"Nav_Statistics\">统计</a></li>\n";
            body += "			</ul>\n";
            body += "		</div>\n";
            body += "\n";
            body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
            body += "\n";
            body += "		<div class=\"Body\">\n";
            body += "			<div class=\"Body_Head\">\n";
            body += "				<div class=\"Body_Head_Title\">\n";
            body += "					" + title + "\n";
            body += "				</div>\n";
            body += "			</div>\n";
            body += "\n";
            body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
            body += "\n";
            body += "			<div class=\"Body_Note\" style=\"padding: 100px 0\">\n";
            if (mainHTML.match(/Not invited or not login/i)) {
                body += "			    <h1>没有权限查看或未登录</h1>";
            } else if (mainHTML.match(/Private Contest is used/i)) {
                body += "			    <h1>实验尚未开始</h1>";
            } else {
                body += "			    <h1>未找到该实验</h1>";
            }
            body += "			</div>\n";
            body += "\n";
            body += "		</div>\n";
            body += "\n";
            body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
            body += "\n";
            body += "		<div class=\"Footer\">\n";
            body += "			<p>All Copyright Reserved 2010-2011\n";
            body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
            body += "			<p>UI Modified By L.K.</p>\n";
            body += "		</div>\n";
            body += "	</body>\n";

            $("head").html(head);
            $("body").html(body);

            let iFrame = document.createElement("iframe");
            iFrame.src = "http://" + ip + "/JudgeOnline/";
            iFrame.style = "display: none";
            document.getElementsByTagName("body")[0].append(iFrame);
            iFrame.onload = function() {
                let navMine = iFrame.contentDocument.children[0].children[1].children[0].children[0].children[4];
                $(".Navigation_Bar_UL").append(navMine);
                iFrame.parentNode.removeChild(iFrame);

                let navBarMine = false;
                $(".Navigation_Bar_Mine").hover(function() {
                    navBarMine = true;
                    $(".Navigation_Bar_Mine_UL").stop(true).show(500);
                }, function() {
                    navBarMine = false;
                    setTimeout(function() {
                        if (!navBarMine) {
                            $(".Navigation_Bar_Mine_UL").stop(true).hide(500);
                        }
                    }, 200);
                })

                if ($(".Body_Note").html().match(/没有权限查看或未登录/)) {
                    if ($(".Navigation_Bar_Mine_UL").html().match(/登录/)) {
                        $(".Body_Note").children("h1").html("未登录");
                    } else {
                        $(".Body_Note").children("h1").html("没有权限查看");
                    }
                }
            };

            return;
        }

        let x = $("#main").children("center").children("div").text();
        let content = document.getElementById("main").children[1].children[0].innerHTML;
        let startTime = /Start Time:\s*([-0-9: ]*)\s*End Time/.exec(x)[1];
        let endTime = /End Time:\s*([-0-9: ]*)\s*Current/.exec(x)[1];
        let status = /Status:\s*([a-zA-Z]*)\s*([a-zA-Z]*)\s*\[Status/.exec(x);

        let problems = document.getElementById("problemset").children[1].children;

        content = content.substring(0, content.match(/\<br\>Start/).index)
                         .substring(content.match(/\<p\>/).index)
                         .replace(/\<p\>\s*\<\/p\>/g, "")
                         .replace(/\brn\b/g, "<br/>")
                         .replace(/^\s+$/g, "");

        let body = "";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
        body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<div class=\"Body_Head\">\n";
        body += "				<div class=\"Body_Head_Title\">\n";
        body += "					" + title + "\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Status\">\n";
        body += "					<div class=\"Body_Status_Start\">\n";
        body += "						开始时间：<span style=\"color: #33A;\">" + startTime + "</span>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Status_End\">\n";
        body += "						结束时间：<span style=\"color: #33A;\">" + endTime + "</span>\n";
        body += "					</div>\n";
        if (status[1].match(/Running/i)) {
            body += "					<div class=\"Body_Status_Status\">\n";
            body += "						进行中\n";
            body += "					</div>\n";
        } else {
            body += "					<div class=\"Body_Status_Status\" style=\"color: #F33;\">\n";
            body += "						已结束\n";
            body += "					</div>\n";
        }
        if (status[2].match(/Public/i)) {
            body += "					<div class=\"Body_Status_Public\" style=\"color: #39F;\">\n";
            body += "						公开\n";
            body += "					</div>\n";
        } else {
            body += "					<div class=\"Body_Status_Public\">\n";
            body += "						私密\n";
            body += "					</div>\n";
        }
        body += "				</div>\n";
        body += "			</div>\n";
        body += "\n";
        if (content.length > 0) {
            body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
            body += "\n";
            body += "			<div class=\"Body_Note\">\n";
            body += content;
            body += "			</div>\n";
        }
        body += "\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Problem_Set\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					<ul>\n";
        body += "						<li>状态</li>\n";
        body += "						<li>题目编号</li>\n";
        body += "						<li>标题</li>\n";
        body += "						<li>来源</li>\n";
        body += "						<li>正确</li>\n";
        body += "						<li>提交</li>\n";
        body += "					</ul>\n";
        body += "				</div>\n";
        for (let i = 0; i < problems.length; i++) {
            x = problems[i].children;
            x[1].innerText = x[1].innerText.replace(/\s+/g, " ");

            body += "				<div class=\"Body_Problem_Set_Div\">\n";
            body += "					<ul>\n";
            if (x[0].innerText.match(/Y/i)) {
                body += "						<li><i class=\"iconfont No_Select\" style=\"color: #3C3;\">&#xe645;</i></li>\n";
            } else if (x[0].innerText.match(/N/i)) {
                body += "						<li><i class=\"iconfont No_Select\" style=\"color: #F33;\">&#xe768;</i></li>\n";
            } else {
                body += "						<li><i class=\"iconfont No_Select\"></i></li>\n";
            }
            body += "						<li>" + x[1].innerText + "</li>\n";
            body += "						<li><a href=\"" + /a href=\"([^"]+)\"/.exec(x[2].innerHTML)[1] + "\">" + x[2].innerText + "</a></li>\n";
            body += "						<li>" + x[3].innerText + "</li>\n";
            body += "						<li>" + x[4].innerText + "</li>\n";
            body += "						<li>" + x[5].innerText + "</li>\n";
            body += "					</ul>\n";
            body += "				</div>\n";
        }
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";

        body += jsNavMine;

        $("head").html(head);
        $("body").html(body);

        addNavMine();
    }
    else if (url.match(/contest\.php/i)) {
    /*
     * ========================
     *          测验列表
     * ========================
     */
        console.log("测验列表");

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*([a-zA-Z0-9]+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let contests = document.getElementById("main").children[0].children[2].children[1].children;

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Head{width:90%;height:80px;margin:0 auto;line-height:80px;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:24px}.Body_Main{width:90%;margin:0 auto;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center}.Body_Title{height:60px;border-bottom:1px #ddd solid;box-sizing:border-box}.Body_Main_Div{height:60px;border-bottom:1px #DDD solid;box-sizing:border-box}.Body_Main_Div:nth-child(2n){background-color:#fafafa}.Body_Main_Div a{color:#39f;display:block;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Main_Div a:hover{color:#22f}.Body_Title ul li,.Body_Main_Div ul li{height:100%;line-height:60px;text-align:center;white-space:nowrap;position:relative;float:left}.Body_Title ul li:before{left:0;content:'|';position:absolute;color:#ddd}.Body_Title ul li:first-child:before{content:none}.Body_Title ul li:nth-child(1),.Body_Main_Div ul li:nth-child(1){width:10%}.Body_Title ul li:nth-child(2),.Body_Main_Div ul li:nth-child(2){width:60%}.Body_Title ul li:nth-child(3),.Body_Main_Div ul li:nth-child(3){width:20%}.Body_Title ul li:nth-child(4),.Body_Main_Div ul li:nth-child(4){width:10%}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 测验</title>\n";
        head += "	</head>\n";
        head += "\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
        body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
        if (!logged) {
            body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
            body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
        } else {
            body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
            body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
            if (mailNumber != "0") {
                body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            } else {
                body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            }
            body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
            body += "				<li><a href=\"logout.php\">注销</a></li>\n";
        }
        body += "			</ul>\n";
        body += "			</li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<div class=\"Body_Head\">\n";
        body += "				测验列表\n";
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Main\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					<ul>\n";
        body += "						<li>ID</li>\n";
        body += "						<li>测验名称</li>\n";
        body += "						<li>状态</li>\n";
        body += "						<li>公开性</li>\n";
        body += "					</ul>\n";
        body += "				</div>\n";
        body += "				\n";
        for (let i = 0; i < contests.length; i++) {
            let x = contests[i].children;
            body += "				<div class=\"Body_Main_Div\">\n";
            body += "					<ul>\n";
            body += "						<li>" + x[0].innerText + "</li>\n";
            body += "						<li><a href=\"" + /a href=\"([^"]*)\"/.exec(x[1].innerHTML)[1] + "\">" + x[1].innerText + "</a></li>\n";
            if (x[2].innerText.match(/Running/i)) {
                body += "						<li style=\"color: #3C3;\">进行中</li>\n";
            } else if (x[2].innerText.match(/Ended/i)) {
                body += "						<li style=\"color: #F33;\">已结束" + x[2].innerText.replace(/Ended/i, "") + "</li>\n";
            } else {
                body += "						<li style=\"color: #39F;\">未开始" + x[2].innerText.replace(/Start/i, "") + "</li>\n";
            }
            if (x[3].innerText.match(/Public/i)) {
                body += "						<li style=\"color: #39F\">公开</li>\n";
            } else {
                body += "						<li style=\"color: #F33\">私密</li>\n";
            }
            body += "					</ul>\n";
            body += "				</div>\n";
        }
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += jsNavMine;


        $("head").html(head);
        $("body").html(body);
    }
    else if (url.match(/loginpage\.php/i)) {
    /*
     * ========================
     *            登录
     * ========================
     */
        console.log("登录");

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += "@media only screen and (max-height:800px){html{min-height:800px}.Body{margin:0 auto}}@media only screen and (min-height:800px){html{min-height:100%}.Body{top:50%;left:50%;position:absolute;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}}.Body{width:500px;height:500px;margin:0 auto;background-color:#fff;box-shadow:0 0 10px #888;border-radius:5px;overflow:hidden;color:#555}.Body_Title{width:500px;height:100px;line-height:100px;text-align:center;font-size:30px;background-color:#39f;color:#fff}.Body_Username,.Body_Password,.Body_Vcode,.Body_Submit{width:400px;margin:40px auto;position:relative}.Body_Vcode img{top:50%;right:10px;position:absolute;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);-o-transform:translateY(-50%);transform:translateY(-50%);cursor:pointer}.Body input[type=text],.Body input[type=password]{width:400px;height:50px;line-height:50px;text-indent:10px;border:1px #888 solid;box-sizing:border-box;border-radius:3px;font-size:16px;outline:0;color:inherit;-webkit-transition:border-color .3s ease-in-out;-moz-transition:border-color .3s ease-in-out;-ms-transition:border-color .3s ease-in-out;-o-transition:border-color .3s ease-in-out;transition:border-color .3s ease-in-out}.Body input[type=text]:hover,.Body input[type=password]:hover{border-color:#000}.Body input[type=text]:focus,.Body input[type=password]:focus{border-color:#39f}.Body input[type=submit]{width:400px;height:50px;background-color:#39f;border-radius:3px;border:0;outline:0;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out;cursor:pointer;color:#fff}.Body input[type=submit]:hover{background-color:rgba(51,153,255,0.8)}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 登录</title>\n";
        head += "	</head>\n";
        head += "\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
        body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
        body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
        body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
        body += "			</ul>\n";
        body += "			</li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<form action=\"login.php\" method=\"post\">\n";
        body += "			<div class=\"Body\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					登录\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Username\">\n";
        body += "					<input type=\"text\" name=\"user_id\" placeholder=\"用户名（学号）\" />\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Password\">\n";
        body += "					<input type=\"password\" name=\"password\" placeholder=\"密码\" />\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Vcode\">\n";
        body += "					<input type=\"text\" size=\"4\" name=\"vcode\" id=\"vcode\" placeholder=\"验证码\" />\n";
        body += "					<img src=\"vcode.php\" id=\"vimg\" onclick=\"this.src='vcode.php#'+Math.random();\"/>\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Submit\">\n";
        body += "					<input name=\"submit\" type=\"submit\" value=\"登录\" />\n";
        body += "				</div>\n";
        body += "			</div>\n";
        body += "		</form>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "\n";
        body += "	</body>\n";

        body += jsNavMine;


        body += "	<script type=\"text/javascript\">\n";
        body += "		function judge(num, num1, num2) {\n";
        body += "			let delta1 = Math.abs(num - num1);\n";
        body += "			let delta2 = Math.abs(num - num2);\n";
        body += "			if (delta1 > delta2) {\n";
        body += "				return 1;\n";
        body += "			} else if (delta1 < delta2) {\n";
        body += "				return -1;\n";
        body += "			} else {\n";
        body += "				return 0;\n";
        body += "			}\n";
        body += "		}\n";
        body += "\n";
        body += "		let NUMS = [\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n";
        body += "			[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]\n";
        body += "		];\n";
        body += "\n";
        body += "		let vimg = document.getElementById(\"vimg\");\n";
        body += "		function identify() {\n";
        body += "			let canvas = document.createElement(\"canvas\");\n";
        body += "			let ctx = canvas.getContext('2d');\n";
        body += "			canvas.width = 48;\n";
        body += "			canvas.height = 20;\n";
        body += "			ctx.drawImage(vimg, -4, -1);\n";
        body += "\n";
        body += "			let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n";
        body += "\n";
        body += "			let map = [];\n";
        body += "\n";
        body += "			for (let i = 0; i < 4; i++) {\n";
        body += "				for (let j = 0; j < canvas.width; j++) {\n";
        body += "					let str = \"\";\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						str = str + imgData.data[(i * canvas.width + j) * 4 + k] + \",\";\n";
        body += "					}\n";
        body += "					if (map[str] == undefined) {\n";
        body += "						map[str] = 0;\n";
        body += "					}\n";
        body += "					map[str] = map[str] + 1;\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let minStr = \"\";\n";
        body += "			let maxStr = \"\";\n";
        body += "			let minNum = 2e9;\n";
        body += "			let maxNum = 0;\n";
        body += "\n";
        body += "			for (let i in map) {\n";
        body += "				if (map[i] < minNum) {\n";
        body += "					minNum = map[i];\n";
        body += "					minStr = i;\n";
        body += "				}\n";
        body += "				if (map[i] > maxNum) {\n";
        body += "					maxNum = map[i];\n";
        body += "					maxStr = i;\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let minStrs = minStr.split(\",\");\n";
        body += "			let maxStrs = maxStr.split(\",\");\n";
        body += "			let eps = 0;\n";
        body += "\n";
        body += "			for (let i = 0; i < canvas.height; i++) {\n";
        body += "				for (let j = 0; j < canvas.width; j++) {\n";
        body += "					let str = [];\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						str[k] = imgData.data[(i * canvas.width + j) * 4 + k];\n";
        body += "					}\n";
        body += "\n";
        body += "					let flag1 = true;\n";
        body += "\n";
        body += "					let flag = true;\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						if (Math.abs(parseInt(str[k]) - parseInt(minStrs[k])) > eps) {\n";
        body += "							flag = false;\n";
        body += "							break;\n";
        body += "						}\n";
        body += "					}\n";
        body += "					if (flag) {\n";
        body += "						for (let k = 0; k < 3; k++) {\n";
        body += "							imgData.data[(i * canvas.width + j) * 4 + k] = 255;\n";
        body += "						}\n";
        body += "						flag1 = false;\n";
        body += "					}\n";
        body += "\n";
        body += "					flag = true;\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						if (Math.abs(parseInt(str[k]) - parseInt(maxStrs[k])) > eps) {\n";
        body += "							flag = false;\n";
        body += "							break;\n";
        body += "						}\n";
        body += "					}\n";
        body += "					if (flag) {\n";
        body += "						for (let k = 0; k < 3; k++) {\n";
        body += "							imgData.data[(i * canvas.width + j) * 4 + k] = 255;\n";
        body += "						}\n";
        body += "						flag1 = false;\n";
        body += "					}\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let map2 = [];\n";
        body += "			for (let i = 0; i < canvas.height; i++) {\n";
        body += "				for (let j = 0; j < canvas.width / 4; j++) {\n";
        body += "					let str = \"\";\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						str = str + imgData.data[(i * canvas.width + j) * 4 + k] + \",\";\n";
        body += "					}\n";
        body += "					if (str == \"255,255,255,\") {\n";
        body += "						continue;\n";
        body += "					}\n";
        body += "					if (map2[str] == undefined) {\n";
        body += "						map2[str] = 0;\n";
        body += "					}\n";
        body += "					map2[str]++;\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let numStr = \"\";\n";
        body += "			maxNum = 0;\n";
        body += "			for (let i in map2) {\n";
        body += "				if (map2[i] > maxNum) {\n";
        body += "					maxNum = map2[i];\n";
        body += "					numStr = i;\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let numStrs = numStr.split(\",\");\n";
        body += "\n";
        body += "			for (let i = 0; i < canvas.height; i++) {\n";
        body += "				for (let j = 0; j < canvas.width; j++) {\n";
        body += "					let str = [];\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						str[k] = imgData.data[(i * canvas.width + j) * 4 + k];\n";
        body += "					}\n";
        body += "					if (str[0] == 255 && str[1] == 255 && str[2] == 255) {\n";
        body += "						continue;\n";
        body += "					}\n";
        body += "\n";
        body += "					let flag = true;\n";
        body += "					for (let k = 0; k < 3; k++) {\n";
        body += "						let delta = Math.abs(parseInt(str[k]) - parseInt(numStrs[k]));\n";
        body += "						//						if (Math.abs(delta - parseInt(numStrs[k])) < delta / 2) {\n";
        body += "						if (judge((parseInt(str[k]) + parseInt(numStrs[k])) / 2, parseInt(numStrs[k]), parseInt(str[k])) < 0) {\n";
        body += "							flag = false;\n";
        body += "							break;\n";
        body += "						}\n";
        body += "					}\n";
        body += "					if (flag) {\n";
        body += "						for (let k = 0; k < 3; k++) {\n";
        body += "							imgData.data[(i * canvas.width + j) * 4 + k] = 0;\n";
        body += "						}\n";
        body += "					} else {\n";
        body += "						for (let k = 0; k < 3; k++) {\n";
        body += "							imgData.data[(i * canvas.width + j) * 4 + k] = 255;\n";
        body += "						}\n";
        body += "					}\n";
        body += "				}\n";
        body += "			}\n";
        body += "\n";
        body += "			let w = canvas.width;\n";
        body += "			canvas.width = w / 4;\n";
        body += "\n";
        body += "			let imgDatas = [];\n";
        body += "\n";
        body += "			for (let i = 0; i < 4; i++) {\n";
        body += "				ctx.putImageData(imgData, -w / 4 * i, -3);\n";
        body += "				imgDatas[i] = ctx.getImageData(0, 0, canvas.width, canvas.height);\n";
        body += "				ctx.putImageData(imgDatas[i], 0, 0);\n";
        body += "			}\n";
        body += "\n";
        body += "			canvas.width = w;\n";
        body += "\n";
        body += "			let ans = \"\";\n";
        body += "\n";
        body += "			for (let i = 0; i < imgDatas.length; i++) {\n";
        body += "				let flag = false;\n";
        body += "				for (let j = 0; j < NUMS.length; j++) {\n";
        body += "					let cnt = 0;\n";
        body += "					for (let k = 0; k < imgDatas[i].data.length; k++) {\n";
        body += "						if (imgDatas[i].data[k] != NUMS[j][k]) {\n";
        body += "							cnt++;\n";
        body += "						}\n";
        body += "					}\n";
        body += "					if (cnt <= 50) {\n";
        body += "					    console.log('Result: ' + j, '\tError: ' + cnt);\n";
        body += "						flag = true;\n";
        body += "						ans = ans + j;\n";
        body += "						break;\n";
        body += "					}\n";
        body += "				}\n";
        body += "				if (!flag) {\n";
        body += "					ans = ans + \"?\";\n";
        body += "				}\n";
        body += "			}\n";
        body += "			console.log(ans);\n";
        body += "			$(\"#vcode\").val(ans);\n";
        body += "		};\n";
        body += "\n";
        body += "		vimg.onload = function() {\n";
        body += "			identify();\n";
        body += "		};\n";
        body += "	</script>\n";

        $("head").html(head);
        $("body").html(body);

    }
    else if (url.match(/contestrank\.php/i)) {
    /*
     * ========================
     *            名次
     * ========================
     */
        console.log("名次");

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let title = /\<h3\>Contest RankList -- ([^<>]*)\<\/h3\>/.exec(document.getElementById("main").children[4].innerHTML)[1];
        let contents = document.getElementById("main").children[5].children[0].children;

        let liWidth = "width: calc((100% - 610px) / " + (contents[0].children.length - 5) + ")";

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Head{width:90%;height:100px;margin:0 auto;line-height:100px;background-color:#FFF;box-shadow:0 0 10px #888;border-radius:5px;text-align:center;font-size:26px}.Body_Main{width:90%;margin:0 auto;background-color:#FFF;box-shadow:0 0 10px #888;border-radius:5px}.Body_Title{height:60px;line-height:60px;border-bottom:1px #DDD solid;box-sizing:border-box}.Body_Main_Div{height:60px;line-height:60px;border-bottom:1px #DDD solid;box-sizing:content-box}.Body_Main_Div:nth-child(2n){background-color:#fafafa}.Body_Title ul li,.Body_Main_Div ul li{width:10%;height:60px;word-spacing:normal;letter-spacing:normal;box-sizing:border-box;text-align:center;position:relative;overflow:hidden;float:left}.Body_Main_Div_UL ul li{overflow:hidden}.Body_Title ul li:before{left:0;content:'|';position:absolute;color:#DDD}.Body_Title ul li:first-child:before{content:none}.Body_Title ul li a,.Body_Main_Div ul li a{color:#39F;display:block;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Title ul li a:hover,.Body_Main_Div ul li a:hover{color:#22F}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 测验排名</title>\n";
        head += "	</head>\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
        body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";

        body += "			<div class=\"Body_Head\">\n";
        body += "				测验排名 -- " + title + "\n";
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "\n";
        body += "\n";
        body += "			<div class=\"Body_Main\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					<ul>\n";
        body += "						<li style=\"width: 80px\">名次</li>\n";
        body += "						<li style=\"width: 150px\">用户名</li>\n";
        body += "						<li style=\"width: 200px\">昵称</li>\n";
        body += "						<li style=\"width: 80px\">解决</li>\n";
        body += "						<li style=\"width: 100px\">罚时</li>\n";
        body += "\n";
        for (let i = 5; i < contents[0].children.length; i++) {
            body += "						<li style=\"" + liWidth + ";\">" + contents[0].children[i].innerHTML + "</li>\n";
        }
        body += "					</ul>\n";
        body += "				</div>\n";
        body += "\n";

        for (let i = 1; i < contents.length; i++) {
            let x = contents[i].children;
            body += "				<div class=\"Body_Main_Div\">\n";
            body += "					<ul>\n";
            body += "						<li style=\"width: 80px\">" + x[0].innerText + "</li>\n";
            body += "						<li style=\"width: 150px\" title=\"" + x[1].innerText + "\"><a href=\"" + /a href=\"([^"]+)\"/i.exec(x[1].innerHTML)[1] + "\">" + x[1].innerText + "</a></li>\n";
            body += "						<li style=\"width: 200px\" title=\"" + x[2].innerText + "\"><a href=\"" + /a href=\"([^"]+)\"/i.exec(x[2].innerHTML)[1] + "\">" + x[2].innerText + "</a></li>\n";
            body += "						<li style=\"width: 80px\"><a href=\"" + /a href=\"([^"]+)\"/i.exec(x[3].innerHTML)[1] + "\">" + x[3].innerText + "</a></li>\n";
            body += "						<li style=\"width: 100px\">" + x[4].innerText + "</li>\n";
            body += "					</ul>\n";
            body += "\n";
            body += "					<div class=\"Body_Main_Div_UL\">\n";
            body += "						<ul>\n";
            for (let j = 5; j < x.length; j++) {
                if (x[j].bgColor.match(/aaffaa/i)) {
                    body += "							<li style=\"" + liWidth + "; background-color: #9F9; color: #181;\" title=\"" + x[j].innerText +"\">" + x[j].innerText + "</li>\n";
                } else if (x[j].bgColor.match(/ffaaaa/i)) {
                    body += "							<li style=\"" + liWidth + "; background-color: #FBB; color: #A22;\" title=\"" + x[j].innerText +"\">" + x[j].innerText + "</li>\n";
                } else {
                    body += "							<li style=\"" + liWidth + "\"></li>\n";
                }
            }
            body += "						</ul>\n";
            body += "					</div>\n";
            body += "				</div>\n";
        }

        body += "\n";
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";

        $("head").html(head);
        $("body").html(body);

        addNavMine();
    }
    else if (url.match(/problem\.php/i)) {
    /*
     * ========================
     *            问题
     * ========================
     */
        console.log("问题");

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let title = /\<title\>([^<>]*)\<\/title\>/.exec($("head").html())[1];
        let mainHTML = $("#main").html();

        let contents = $("#main").children(".content");

        let submitHref = document.getElementById("main").children[1].children;

        let info = $("#main").children("center").html();
        let timeLimit = /\<\/span\>\s*(\d+)\s*Sec/i.exec(info)[1];
        let spaceLimit = /\<\/span\>\s*(\d+)\s*MB/i.exec(info)[1];
        let submitNum = /提交: \s*\<\/span\>\s*(\d+)\s*/i.exec(info)[1];
        let solvedNum = /解决: \s*\<\/span\>\s*(\d+)\s*/i.exec(info)[1];

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Head{width:90%;margin:0 auto;background-color:#fff;box-shadow:0 0 10px #888;border-radius:5px}.Body_Head_Title{height:100px;line-height:100px;text-align:center;font-size:26px}.Body_Status{margin:0 auto;padding:10px 0;box-sizing:border-box;border-top:1px #DDD solid;text-align:center;font-size:0}.Body_Status div{width:25%;word-spacing:normal;letter-spacing:normal;display:inline-block;position:relative;font-size:16px}.Body_Status div:before{left:0;content:'|';position:absolute;color:#DDD}.Body_Status div:first-child:before{content:none}.Body_Status div span{color:#33A}.Body_Main{width:90%;padding:30px 50px;margin:0 auto;background-color:#fff;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;font-size:18px}.Body_Main_Div_Title{height:75px;line-height:75px;font-size:30px;color:#39F}.Body_Main_Div_Title i{font-size:30px;cursor:pointer;color:#555;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Main_Div i:hover{color:#39F}.Body_Submit{width:90%;height:75px;margin:0 auto;line-height:75px;box-shadow:0 0 10px #888;border-radius:5px;text-align:center;overflow:hidden;cursor:pointer;color:#FFF}.Body_Submit a{background-color:#39F;display:block;-webkit-transition:background-color .3s ease-in-out;-moz-transition:background-color .3s ease-in-out;-ms-transition:background-color .3s ease-in-out;-o-transition:background-color .3s ease-in-out;transition:background-color .3s ease-in-out}.Body_Submit a:hover{background-color:rgba(51,153,255,0.8)}.sampledata{font-family:'Monaco','Consolas','Monospace';background:none repeat scroll 0 0 #8db8ff;white-space:pre;font-size:18px;color:#000}.Message_Box{top:50%;left:50%;width:150px;height:65px;line-height:65px;background-color:#FFF;box-shadow:0 0 10px #888;border-radius:5px;text-align:center;text-indent:20px;position:fixed;display:none;color:#555;z-index:2147483647;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.Message_Box i{left:20px;text-indent:0;position:absolute;font-size:20px;color:#3C3}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - " + title + "</title>\n";
        head += "	</head>\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
        body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<div class=\"Body_Head\">\n";
        body += "				<div class=\"Body_Head_Title\">\n";
        body += "					" + title + "\n";
        body += "				</div>\n";
        body += "				<div class=\"Body_Status\">\n";
        body += "					<div class=\"Body_Status_Time\">\n";
        body += "						时间限制：<span>" + timeLimit + " 秒</span>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Status_Space\">\n";
        body += "						内存限制：<span>" + spaceLimit + " MB</span>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Status_Submit\">\n";
        body += "						提交：<span>" + submitNum + "</span>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Status_Solved\">\n";
        body += "						解决：<span>" + solvedNum + "</span>\n";
        body += "					</div>\n";
        body += "				</div>\n";
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Main\">\n";
        body += "				<div class=\"Body_Main_Div\">\n";
        body += "					<div class=\"Body_Main_Div_Title\">\n";
        body += "						题目描述\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Main_Div_Content\">\n";
        body += contents[0].innerHTML;
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "				<hr color=\"#DDD\" size=\"1\" />\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main_Div\">\n";
        body += "					<div class=\"Body_Main_Div_Title\">\n";
        body += "						输入\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Main_Div_Content\">\n";
        body += contents[1].innerHTML;
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "				<hr color=\"#DDD\" size=\"1\" />\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main_Div\">\n";
        body += "					<div class=\"Body_Main_Div_Title\">\n";
        body += "						输出\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Main_Div_Content\">\n";
        body += contents[2].innerHTML;
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "				<hr color=\"#DDD\" size=\"1\" />\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main_Div\">\n";
        body += "					<div class=\"Body_Main_Div_Title\">\n";
        body += "						样例输入\n";
        body += "						<i class=\"iconfont\" title=\"复制\">&#xe706;</i>\n";
        body += "						<textarea class=\"Sample_Data\" style=\"opacity: 0; position: absolute; pointer-events: none;\">" + contents[3].innerText + "</textarea>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Main_Div_Content\">\n";
        body += contents[3].innerHTML + "<p></p>";
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "				<hr color=\"#DDD\" size=\"1\" />\n";
        body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main_Div\">\n";
        body += "					<div class=\"Body_Main_Div_Title\">\n";
        body += "						样例输出\n";
        body += "						<i class=\"iconfont\" title=\"复制\">&#xe706;</i>\n";
        body += "						<textarea class=\"Sample_Data\" style=\"opacity: 0; position: absolute; pointer-events: none;\">" + contents[4].innerText + "</textarea>\n";
        body += "					</div>\n";
        body += "					<div class=\"Body_Main_Div_Content\">\n";
        body += contents[4].innerHTML + "<p></p>";
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        if (contents[5].innerHTML.replace(/(\<\s*br\s*\/?\>|\<p\>\s*\<\/p\>|\s*)/ig, "").length > 0) {
            body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
            body += "				<hr color=\"#DDD\" size=\"1\" />\n";
            body += "				<div style=\"width: 100%; height: 15px;\"></div>\n";
            body += "\n";
            body += "				<div class=\"Body_Main_Div\">\n";
            body += "					<div class=\"Body_Main_Div_Title\">\n";
            body += "						提示\n";
            body += "					</div>\n";
            body += "					<div class=\"Body_Main_Div_Content\">\n";
            body += contents[5].innerHTML;
            body += "					</div>\n";
            body += "				</div>\n";
        }
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Submit\">\n";
        body += "				<a href=\"" + submitHref[submitHref.length - 3].href + "\">提交</a>\n";
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Message_Box\">\n";
        body += "			<i class=\"iconfont No_Select\">&#xe645;</i>复制成功\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";

        $("head").html(head);
        $("body").html(body);

        $(document).ready(function() {
            $(".Body_Main_Div_Title").children("i").click(function() {
                $(this).parent().children("textarea").get(0).select();
                document.execCommand("Copy");
                $(".Message_Box").stop(true).fadeIn(500);
                setTimeout(function() {
                    $(".Message_Box").stop(true).fadeOut(500);
                }, 1500);
            });
            addNavMine();
        });
    }
    else if (url.match(/\/JudgeOnline\/$/i)) {
    /*
     * ========================
     *            主页
     * ========================
     */
        // console.log("主页");

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*([a-zA-Z0-9]+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body_Title{width:90%;height:100px;margin:0 auto;line-height:100px;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:24px;color:#555}.Body_Main{width:90%;padding:150px 50px;margin:0 auto;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:20px;color:#555}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 测验</title>\n";
        head += "	</head>\n";
        head += "\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
        body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
        if (!logged) {
            body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
            body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
        } else {
            body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
            body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
            if (mailNumber != "0") {
                body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            } else {
                body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            }
            body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
            body += "				<li><a href=\"logout.php\">注销</a></li>\n";
        }
        body += "			</ul>\n";
        body += "			</li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<div class=\"Body_Title\">\n";
        body += "				公告\n";
        body += "			</div>\n";
        body += "			\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "			\n";
        body += "			<div class=\"Body_Main\">\n";
        body += document.getElementById("main").children[0].innerHTML;
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += jsNavMine;


        $("head").html(head);
        $("body").html(body);
    }
    else if (url.match(/faqs.\w+\.php/i)) {
    /*
     * ========================
     *          常见问答
     * ========================
     */
        console.log("常见问答");

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*([a-zA-Z0-9]+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{width:90%;padding:50px;margin:0 auto;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;font-size:20px;color:#555}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 常见问答</title>\n";
        head += "	</head>\n";
        head += "\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Selected\"><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
        body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
        if (!logged) {
            body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
            body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
        } else {
            body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
            body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
            if (mailNumber != "0") {
                body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            } else {
                body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            }
            body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
            body += "				<li><a href=\"logout.php\">注销</a></li>\n";
        }
        body += "			</ul>\n";
        body += "			</li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += document.getElementById("main").innerHTML;
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += jsNavMine;


        $("head").html(head);
        $("body").html(body);
    }
    else if (url.match(/showsource\.php\?id=/i)) {
    /*
     * ========================
     *           源代码
     * ========================
     */
        console.log("源代码");

        window.stop();

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*(\w+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let pre = document.getElementsByTagName("pre")[0];
        let codes = "";
        if (pre) {
            codes = pre.innerText.replace(/\s*$/, "");
        } else {
            codes = document.getElementsByClassName("code")[0].innerText.replace(/\s*$/, "");
        }

        let id = /id=(\d+)/.exec(url)[1];

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style type=\"text/css\">\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/neo.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/darcula.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/monokai.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/hint/show-hint.min.css\");\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Title{width:90%;height:100px;margin:0 auto;line-height:100px;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:26px;color:#555}.Body_Main{width:90%;margin:0 auto;border-radius:5px;box-shadow:0 0 10px #888;background-color:#272822;font-family:'Monaco','Consolas','Monospace';border-radius:5px;font-size:18px;overflow:hidden;position:relative}.Body_Theme{width:90%;height:75px;margin:0 auto;position:relative;background-color:#FFF;box-shadow:0 0 10px #888;border-radius:5px;position:relative;cursor:pointer}.Body_Theme:hover span{color:#39f}.Body_Theme_Span{width:100%;height:75px;line-height:75px;text-align:center;font-size:20px;cursor:inherit;display:block;color:inherit;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Theme i{top:50%;right:50px;position:absolute;font-size:24px;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.Body_Theme select{top:0;left:0;width:100%;height:75px;line-height:75px;border-radius:5px;text-align:center;position:absolute;cursor:inherit;outline:0;border:0;display:none}.Body_Select{top:calc(100% + 2px);left:0;width:100%;background-color:#FFF;box-shadow:0 5px 10px #888;position:absolute;z-index:999999;display:none}.Body_Select ul li{height:75px;line-height:75px;text-align:center;font-size:18px;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.Body_Select ul li:hover{background-color:#39F;color:#FFF}.Body_Textarea{min-width:100%;max-width:100%;margin:0 auto;border:1px #DDD solid;box-sizing:border-box;border-radius:5px;outline:0;color:#555;display:none}.CodeMirror{font-family:inherit!important}.CodeMirror-scroll{height:auto!important;}";
        head += "		</style>\n";
        head += "		<script src=\"http://libs.baidu.com/jquery/2.1.4/jquery.min.js\"></script>\n";
        head += "		<title>SZUOJ - 源代码</title>\n";
        head += "	</head>\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        if (pageNav[1] != undefined) {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
            body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        } else {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
            body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
            if (!logged) {
                body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
                body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
            } else {
                body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
                body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
                if (mailNumber != "0") {
                    body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                } else {
                    body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                }
                body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
                body += "				<li><a href=\"logout.php\">注销</a></li>\n";
            }
            body += "			</ul>\n";
            body += "			</li>\n";
        }
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					源代码 - ID " + id + "\n";
        body += "				</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Theme\">\n";
        body += "				<i class=\"iconfont No_Select\">&#xe661;</i>\n";
        body += "				<span class=\"Body_Theme_Span\">Darcula</span>\n";
        body += "				<div class=\"Body_Select\">\n";
        body += "					<ul>\n";
        body += "						<li>Darcula</li>\n";
        body += "						<li>Monokai</li>\n";
        body += "						<li>Neo</li>\n";
        body += "					</ul>\n";
        body += "				</div>\n";
        body += "				<select onchange=\"themeSelect(this)\">\n";
        body += "					<option value=\"0\" selected>Darcula</option>\n";
        body += "					<option value=\"1\">Monokai</option>\n";
        body += "					<option value=\"2\">Neo</option>\n";
        body += "				</select>\n";
        body += "			</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main\">\n";
        body += "					<textarea class=\"Body_Textarea\" name=\"source\" id=\"code\">" + codes + "</textarea>\n";
        body += "				</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += "\n";

        body += jsNavMine;

        $("head").html(head);
        $("body").html(body);

        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.min.js", function(data, status) {
            let cnt = 0;
            if (status.match(/success/i)) {
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/clike/clike.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/hint/show-hint.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/edit/matchbrackets.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/selection/active-line.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
            }
        });

        function loadEditor() {
            var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                indentUnit: 4,
                styleActiveLine: true,
                matchBrackets: true,
                mode: "text/x-c++src",
                lineWrapping: true,
                readOnly: true,
                theme: 'darcula'
            });
            editor.setOption("extraKeys", {
                Tab: function(cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            });
            editor.setSize('100%', 'auto');

            function themeSelect(obj) {
                let theme = obj.options[obj.selectedIndex].innerText;
                if (theme.match(/darcula/i)) {
                    editor.setOption("theme", "darcula");
                } else if (theme.match(/monokai/i)) {
                    editor.setOption("theme", "monokai");
                } else if (theme.match(/neo/i)) {
                    editor.setOption("theme", "neo");
                }
                document.getElementsByClassName("Body_Theme_Span")[0].innerText = theme;
            }

            let selectShow = false;
            $(".Body_Theme").hover(function() {
                selectShow = true;
                $(this).children(".Body_Select").stop(true).slideDown(500);
            }, function() {
                selectShow = false;
                setTimeout(function() {
                    if (!selectShow) {
                        $(this).children(".Body_Select").stop(true).slideUp(500);
                    }
                }.bind(this), 200);
            });

            $(".Body_Theme").children(".Body_Select").children("ul").children("li").click(function() {
                let x = $(this).parent().parent().parent().children("select").get(0);
                x.selectedIndex = $(this).index();
                themeSelect(x);
            });

            let x = document.getElementsByTagName("select")[0];
            if (codes.match(/\#include/)) {
                editor.setOption("mode", "text/x-c++src");
            } else if (codes.match(/(import java\.|public\s+class\s+Main)/)) {
                editor.setOption("mode", "text/x-java");
            }

            if (pageNav[1] != undefined) {
                addNavMine();
            } else {
                activeNavMine();
            }
        };

   }
    else if (url.match(/[cr]einfo\.php\?sid=/i)) {
    /*
     * ========================
     *          错误信息
     * ========================
     */
        console.log("错误信息");


        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*([a-zA-Z0-9]+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style>\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body_Title{width:90%;height:100px;margin:0 auto;line-height:100px;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:24px;color:#555}.Body_Main{width:90%;padding:50px;margin:0 auto;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;font-size:20px;color:#555}.Body_Back{width:90%;height:75px;margin:0 auto;line-height:75px;box-shadow:0 0 10px #888;border-radius:5px;text-align:center;overflow:hidden;cursor:pointer;color:#FFF}.Body_Back a{background-color:#39F;display:block;-webkit-transition:background-color .3s ease-in-out;-moz-transition:background-color .3s ease-in-out;-ms-transition:background-color .3s ease-in-out;-o-transition:background-color .3s ease-in-out;transition:background-color .3s ease-in-out}.Body_Back a:hover{background-color:rgba(51,153,255,0.8)}";
        head += "		</style>\n";
        head += "		<title>SZUOJ - 错误信息</title>\n";
        head += "	</head>\n";
        head += "\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
        body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
        body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
        body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
        if (!logged) {
            body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
            body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
        } else {
            body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
            body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
            if (mailNumber != "0") {
                body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            } else {
                body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
            }
            body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
            body += "				<li><a href=\"logout.php\">注销</a></li>\n";
        }
        body += "			</ul>\n";
        body += "			</li>\n";
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<div class=\"Body_Title\">\n";
        body += "				错误信息\n";
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Main\">\n";
        body += document.getElementById("main").innerHTML;
        body += "\n";
        body += "				<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "				\n";
        body += "				<hr color=\"#DDD\" size=\"1\" />\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "				\n";
        body += document.getElementById("errexp").innerHTML;
        body += "			</div>\n";
        body += "\n";
        body += "			<div style=\"width: 100%; height: 30px;\"></div>\n";
        body += "\n";
        body += "			<div class=\"Body_Back\">\n";
        body += "				<a href=\"javascript:history.back(-1)\">返回</a>\n";
        body += "			</div>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += jsNavMine;

        $("head").html(head);
        $("body").html(body);
    }
    else if (url.match(/submitpage\.php\?/i)) {
    /*
     * ========================
     *            提交
     * ========================
     */
        console.log("提交");

        window.stop();

        if (document.body.innerText.match(/Please Login/i)) {
            window.location.href = "loginpage.php";
        }

        let nav = $("table.toprow").children("tbody").children("tr").children("td").children("a");
        let pageNav = [];
        for (let i = 0; i < nav.length; i++) {
            pageNav[i] = nav[i].href;
        }

        let profile = $("#profile");
        let mailNumber = "";
        let userId = "";
        let logged;
        if (profile.text().match(/登录/)) {
            logged = false;
        } else if (profile.text().match(/注销/)) {
            logged = true;
            userId = /\s*(\w+)\s/.exec(profile.text())[1];
            mailNumber = /\((\d*)\)/.exec(profile.text())[1];
        }

        let codes = document.getElementsByTagName("textarea")[0].value;

        let cid = "";
        let pid = "";
        if (url.match(/cid=/i)) {
            cid = /cid=(\d+)/.exec(url)[1];
        }
        if (url.match(/pid=/i)) {
            pid = /pid=(\d+)/.exec(url)[1];
        }

        let head = "";
        let body = "";

        head += "	<head>\n";
        head += "		<meta charset=\"UTF-8\">\n";
        head += "		<style type=\"text/css\">\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/neo.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/darcula.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/theme/monokai.min.css\");\n";
        head += "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/hint/show-hint.min.css\");\n";
        head += cssFontface;
        head += cssGlobal;
        head += ".Body{color:#555}.Body_Title{width:90%;height:100px;margin:0 auto;line-height:100px;background-color:#FFF;box-shadow:0 0 10px #888;box-sizing:border-box;border-radius:5px;text-align:center;font-size:26px;color:#555}.Body_Main{width:90%;height:600px;margin:0 auto;border-radius:5px;box-shadow:0 0 10px #888;background-color:#272822;font-family:'Monaco','Consolas','Monospace';border-radius:5px;font-size:18px;overflow:hidden;position:relative}.Body_Control{width:90%;height:75px;margin:0 auto;position:relative}.Body_Language,.Body_Theme{width:47.5%;background-color:#FFF;box-shadow:0 0 10px #888;border-radius:5px;position:relative;cursor:pointer}.Body_Language{float:left}.Body_Theme{float:right}.Body_Language:hover span,.Body_Theme:hover span{color:#39f}.Body_Control_Span{width:100%;height:75px;line-height:75px;text-align:center;font-size:20px;cursor:inherit;display:block;color:inherit;-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;-ms-transition:color .3s ease-in-out;-o-transition:color .3s ease-in-out;transition:color .3s ease-in-out}.Body_Control i{top:50%;right:50px;position:absolute;font-size:24px;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.Body_Control select{top:0;left:0;width:100%;height:75px;line-height:75px;border-radius:5px;text-align:center;position:absolute;cursor:inherit;outline:0;border:0;display:none}.Body_Select{top:calc(100% + 2px);left:0;width:100%;background-color:#FFF;box-shadow:0 5px 10px #888;position:absolute;z-index:999999;display:none}.Body_Select ul li{height:75px;line-height:75px;text-align:center;font-size:18px;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.Body_Select ul li:hover{background-color:#39F;color:#FFF}.Body_Textarea{min-width:100%;max-width:100%;margin:0 auto;border:1px #DDD solid;box-sizing:border-box;border-radius:5px;outline:0;color:#555;display:none}.Body_Submit{width:90%;height:75px;margin:0 auto;line-height:75px;box-shadow:0 0 10px #888;border-radius:5px;text-align:center;overflow:hidden;cursor:pointer;color:#FFF}.Body_Submit input[type=submit]{width:100%;height:75px;border:0;outline:0;background-color:#39F;font-family:inherit;font-size:18px;cursor:pointer;display:block;color:#FFF;-webkit-transition:background-color .3s ease-in-out;-moz-transition:background-color .3s ease-in-out;-ms-transition:background-color .3s ease-in-out;-o-transition:background-color .3s ease-in-out;transition:background-color .3s ease-in-out}.Body_Submit input[type=submit]:hover{background-color:rgba(51,153,255,0.8)}.CodeMirror{font-family:inherit!important;position:absolute}.CodeMirror-scroll{height:100%!important}";
        head += "		</style>\n";
        head += "		<script src=\"http://libs.baidu.com/jquery/2.1.4/jquery.min.js\"></script>\n";
        head += "		<title>SZUOJ - 提交</title>\n";
        head += "	</head>\n";

        body += "	<body>\n";
        body += "		<div class=\"Navigation_Bar\">\n";
        body += "			<ul class=\"Navigation_Bar_UL\">\n";
        if (pageNav[1] != undefined) {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"contest.php\">主页</a></li>";
            body += "				<li><i class=\"iconfont No_Select\">&#xe667;</i><a href=\"" + pageNav[1] + "\" id=\"Nav_Discuss\">讨论版</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"" + pageNav[2] + "\" id=\"Nav_Problem\">问题</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe70f;</i><a href=\"" + pageNav[3] + "\" id=\"Nav_Rank\">名次</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"" + pageNav[4] + "\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe722;</i><a href=\"" + pageNav[5] + "\" id=\"Nav_Statistics\">统计</a></li>\n";
        } else {
            body += "				<li><i class=\"iconfont No_Select\">&#xe6b8;</i><a href=\"http://" + ip + "/JudgeOnline/\">主页</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe6e5;</i><a href=\"status.php\" id=\"Nav_Status\">状态</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe791;</i><a href=\"contest.php\" id=\"Nav_Statistics\">测验</a></li>\n";
            body += "				<li><i class=\"iconfont No_Select\">&#xe691;</i><a href=\"faqs.cn.php\" id=\"Nav_Statistics\">&emsp;常见问答</a></li>\n";
            body += "				<li class=\"Navigation_Bar_Mine\"><i class=\"iconfont No_Select\" style=\"left: 50%;\">&#xe735;</i><a href=\"javascript:void(0)\">&nbsp;</a>\n";
            body += "			<ul class=\"Navigation_Bar_Mine_UL\">\n";
            if (!logged) {
                body += "				<li><a href=\"loginpage.php\">登录</a></li>\n";
                body += "				<li><a href=\"registerpage.php\">注册</a></li>\n";
            } else {
                body += "				<li><a href=\"userinfo.php?user=" + userId + "\">" + userId + "</a></li>\n";
                body += "				<li><a href=\"modifypage.php\">修改账号</a></li>\n";
                if (mailNumber != "0") {
                    body += "				<li style=\"color: #39F\"><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                } else {
                    body += "				<li><a href=\"mail.php\">邮箱 (" + mailNumber + ")</a></li>\n";
                }
                body += "				<li><a href=\"status.php?user_id=" + userId + "\">最近提交</a></li>\n";
                body += "				<li><a href=\"logout.php\">注销</a></li>\n";
            }
            body += "			</ul>\n";
            body += "			</li>\n";
        }
        body += "			</ul>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 100px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Body\">\n";
        body += "			<form action=\"submit.php\" method=\"post\" onsubmit=\"return checksource(document.getElementById('source').value);\">\n";
        body += "				<div class=\"Body_Title\">\n";
        body += "					提交代码 - 问题 " + document.getElementsByTagName("form")[0].children[0].innerText + "\n";
        body += "				</div>\n";
        body += "\n";
        if (cid != "") {
            body += "				<input type=\"hidden\" name=\"cid\" value=\"" + cid + "\" />\n";
        }
        if (pid != "") {
            body += "				<input type=\"hidden\" name=\"pid\" value=\"" + pid + "\" />\n";
        }
        body += "\n";
        body += "				<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Control\">\n";
        body += "					<div class=\"Body_Language\">\n";
        body += "						<i class=\"iconfont No_Select\">&#xe661;</i>\n";
        body += "						<span class=\"Body_Control_Span\">C++</span>\n";
        body += "						<div class=\"Body_Select\">\n";
        body += "							<ul>\n";
        body += "								<li>C</li>\n";
        body += "								<li>C++</li>\n";
        body += "								<li>Java</li>\n";
        body += "							</ul>\n";
        body += "						</div>\n";
        body += "						<select name=\"language\" onchange=\"languageSelect(this)\">\n";
        body += "							<option value=\"0\">C</option>\n";
        body += "							<option value=\"1\" selected>C++</option>\n";
        body += "							<option value=\"3\">Java</option>\n";
        body += "						</select>\n";
        body += "					</div>\n";
        body += "\n";
        body += "					<div class=\"Body_Theme\">\n";
        body += "						<i class=\"iconfont No_Select\">&#xe661;</i>\n";
        body += "						<span class=\"Body_Control_Span\">Darcula</span>\n";
        body += "						<div class=\"Body_Select\">\n";
        body += "							<ul>\n";
        body += "								<li>Darcula</li>\n";
        body += "								<li>Monokai</li>\n";
        body += "								<li>Neo</li>\n";
        body += "							</ul>\n";
        body += "						</div>\n";
        body += "						<select onchange=\"themeSelect(this)\">\n";
        body += "							<option value=\"0\" selected>Darcula</option>\n";
        body += "							<option value=\"1\">Monokai</option>\n";
        body += "							<option value=\"2\">Neo</option>\n";
        body += "						</select>\n";
        body += "					</div>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Main\">\n";
        body += "					<textarea class=\"Body_Textarea\" name=\"source\" id=\"code\">" + codes + "</textarea>\n";
        body += "				</div>\n";
        body += "\n";
        body += "				<div style=\"width: 100%; height: 50px;\"></div>\n";
        body += "\n";
        body += "				<div class=\"Body_Submit\">\n";
        body += "					<input type=\"submit\" value=\"提交\" />\n";
        body += "				</div>\n";
        body += "			</form>\n";
        body += "		</div>\n";
        body += "\n";
        body += "		<div style=\"width: 100%; height: 130px;\"></div>\n";
        body += "\n";
        body += "		<div class=\"Footer\">\n";
        body += "			<p>All Copyright Reserved 2010-2011\n";
        body += "				<a href=\"http://" + ip + "/JudgeOnline/\">深圳大学在线判题教学平台</a> TEAM</p>\n";
        body += "			<p>UI Modified By L.K.</p>\n";
        body += "		</div>\n";
        body += "	</body>\n";
        body += "\n";

        body += jsNavMine;

        $("head").html(head);
        $("body").html(body);

        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.min.js", function(data, status) {
            let cnt = 0;
            if (status.match(/success/i)) {
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/clike/clike.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/hint/show-hint.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/edit/matchbrackets.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/selection/active-line.min.js", function(data, status) {
                    cnt += status.match(/success/i) ? 1 : 0;
                    if (cnt == 4) {
                        loadEditor();
                    }
                });
            }
        });

        function loadEditor() {
            var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                indentUnit: 4,
                styleActiveLine: true,
                matchBrackets: true,
                lineWrapping: true,
                theme: 'darcula',
                mode: "text/x-c++src"
            });
            editor.setOption("extraKeys", {
                Tab: function(cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            });
            editor.setSize('100%', '100%');

            function languageSelect(obj) {
                let lang = obj.options[obj.selectedIndex].innerText;
                if (lang.match(/C/i)) {
                    editor.setOption("mode", "text/x-csrc");
                } else if (lang.match(/C\+\+/i)) {
                    editor.setOption("mode", "text/x-c++src");
                } else if (lang.match(/Java/i)) {
                    editor.setOption("mode", "text/x-java");
                }
                document.getElementsByClassName("Body_Control_Span")[0].innerText = lang;
            }

            function themeSelect(obj) {
                let theme = obj.options[obj.selectedIndex].innerText;
                if (theme.match(/darcula/i)) {
                    editor.setOption("theme", "darcula");
                } else if (theme.match(/monokai/i)) {
                    editor.setOption("theme", "monokai");
                } else if (theme.match(/neo/i)) {
                    editor.setOption("theme", "neo");
                }
                document.getElementsByClassName("Body_Control_Span")[1].innerText = theme;
            }

            let selectShow = [false, false];
            $(".Body_Control").children("div").hover(function() {
                selectShow[$(this).index()] = true;
                $(this).children(".Body_Select").stop(true).slideDown(500);
            }, function() {
                selectShow[$(this).index()] = false;
                setTimeout(function() {
                    if (!selectShow[$(this).index()]) {
                        $(this).children(".Body_Select").stop(true).slideUp(500);
                    }
                }.bind(this), 200);
            });

            $(".Body_Language").children(".Body_Select").children("ul").children("li").click(function() {
                let x = $(this).parent().parent().parent().children("select").get(0);
                x.selectedIndex = $(this).index();
                languageSelect(x);
            });

            $(".Body_Theme").children(".Body_Select").children("ul").children("li").click(function() {
                let x = $(this).parent().parent().parent().children("select").get(0);
                x.selectedIndex = $(this).index();
                themeSelect(x);
            });

            let x = document.getElementsByTagName("select")[0];
            if (codes.match(/(\#include|int\s+main(\s+))/)) {
                x.selectedIndex = 1;
                languageSelect(x);
            } else if (codes.match(/(import\s+java\.|public\s+class\s+Main)/)) {
                x.selectedIndex = 2;
                languageSelect(x);
            }

            if (pageNav[1] != undefined) {
                addNavMine();
            } else {
                activeNavMine();
            }
        };
    }
})();