// ==UserScript==
// @name         KYCtools
// @namespace    stevexie
// @version      0.5
// @description  KYC辅助工具
// @author       Steve
// @include      *://kygl.jgsu.edu.cn/kygl/*
// @include      *://www.webofscience.com/wos/woscc/*
// @include      *://www.cnki.net/*
// @include      *://navi.cnki.net/*
// @include      *://kns.cnki.net/*
// @include      *://www.fenqubiao.com/*
// @include      *://pss-system.cnipa.gov.cn/*
// @include      *://cpquery.cnipa.gov.cn/*
// @match        https://www.fenqubiao.com/Core/Search.aspx
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/431862/KYCtools.user.js
// @updateURL https://update.greasyfork.org/scripts/431862/KYCtools.meta.js
// ==/UserScript==

// 存在问题
// 1、著作管理和专利管理页面显示不正常，是因为有window.resize事件在起作用，不知如何取消
// 2、SCI分区查询可否变为自动

// 让控制台支持jq  ;(function(d,s){d.body.appendChild(s=d.createElement('script')).src='https://code.jquery.com/jquery-latest.js'})(document);

(function() {
    var href = window.location.href;

    //判断字符串是不是全英
    String.prototype.isAllEnglish = function () {
        // var reg = /[^\x00-\xff]/ig;//判断是否存在中文和全角字符
        var reg = /^[a-zA-Z &/-]+$/;
        return reg.test(this);
    }

    function addBtn(){
        // 文章管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managelw")) {
            var lwssyq0, lwssdz0, lwssyq1, lwssdz1, lwssyq2, lwssdz2;// 论文搜索引擎，搜索地址
            var kmssyq0, kmssdz0, kmssyq1, kmssdz1, kmssyq2, kmssdz2;// 刊名搜索引擎，搜索地址

            if ($("#KanwuName").val().isAllEnglish()) {
                lwssyq0 = "WOS查询";
                lwssdz0 = "https://www.webofscience.com/wos/woscc/basic-search";
                lwssyq1 = "谷歌学术";
                lwssdz1 = "https://scholar.google.com.hk";
                lwssyq2 = "复制题目";
                lwssdz2 = "";
                kmssyq0 = "分区表";
                kmssdz0 = "https://www.fenqubiao.com/Core/Search.aspx";
                kmssyq1 = "LetPub";
                kmssdz1 = "https://www.letpub.com.cn/index.php?page=journalapp";
                kmssyq2 = "复制刊名";
                kmssdz2 = "";
            }
            else{
                lwssyq0 = "知网查询";
                lwssdz0 = "https://kns.cnki.net/kns8/AdvSearch";
                lwssyq1 = "谷歌学术";
                lwssdz1 = "https://scholar.google.com.hk";
                lwssyq2 = "复制题目";
                lwssdz2 = "";
                kmssyq0 = "知网查刊";
                kmssdz0 = "https://navi.cnki.net/knavi/journals/index";
                kmssyq1 = "LetPub";
                kmssdz1 = "https://www.letpub.com.cn/index.php?page=journalapp";
                kmssyq2 = "复制刊名";
                kmssdz2 = "";
            }

            var lunwen0 = "<div id='lunwen0'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:480px;top:127px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(lunwen0);
            $("#lunwen0 > p").text(lwssyq0);
            addBtnEvent($("#lunwen0"), $("#LwName").val(), lwssdz0);
            var lunwen1 = "<div id='lunwen1'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:580px;top:127px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(lunwen1);
            $("#lunwen1 > p").text(lwssyq1);
            addBtnEvent($("#lunwen1"), $("#LwName").val(), lwssdz1);
            var lunwen2 = "<div id='lunwen2'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:680px;top:127px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(lunwen2);
            $("#lunwen2 > p").text(lwssyq2);
            addBtnEvent($("#lunwen2"), $("#LwName").val(), lwssdz2);
            var fenqu0 = "<div id='fenqu0'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:380px;top:155px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(fenqu0);
            $("#fenqu0 > p").text(kmssyq0);
            addBtnEvent($("#fenqu0"), $("#KanwuName").val(), kmssdz0);
            var fenqu1 = "<div id='fenqu1'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:480px;top:155px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(fenqu1);
            $("#fenqu1 > p").text(kmssyq1);
            addBtnEvent($("#fenqu1"), $("#KanwuName").val(), kmssdz1);
            var fenqu2 = "<div id='fenqu2'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:580px;top:155px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(fenqu2);
            $("#fenqu2 > p").text(kmssyq2);
            addBtnEvent($("#fenqu2"), $("#KanwuName").val(), kmssdz2);
        }


        // 专利管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managezl")) {
            // 检测能否生成专利号，能则复制，不能则复制专利名称
            let zlh = $("#Certificate_Num").val().match(/[\d|x|X]+/g);
            if (zlh && zlh.toString().replaceAll(",","").length == 13) {
                // 此时是专利号
                zlh = zlh.toString().replaceAll(",","");
                zlh = "CN" +　zlh.slice(0,zlh.length-1) + "." + zlh[zlh.length-1];
            }
            else {
                // 此时是专利名称
                zlh = $("#ZLName").val();
            }

            let zl1 = "<div id='zl1'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:480px;top:127px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(zl1);
            $("#zl1 > p").text("专利审查");
            addBtnEvent($("#zl1"), zlh, "http://cpquery.cnipa.gov.cn/txnPantentInfoList.do");
            var zl2 = "<div id='zl2'style='cursor:pointer;z-index:98;display:block;width:100px;height:20px;line-height:30px;position:absolute;left:580px;top:127px;text-align:center;overflow:visible'><p style='font-size:18px;color:orange'></p></div>";
            $("body").append(zl2);
            $("#zl2 > p").text("知网专利");
            addBtnEvent($("#zl2"), zlh, "https://kns.cnki.net/kns8?dbcode=SCOD");
        }

        // 优秀成果管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managejl")) {
            ;
        }
    }


    function addBtnEvent(btn, val, url){
        btn.click(function(){
            GM_setValue('name', val);
            GM_setClipboard(val);
            if(url != ""){window.open(url);}
        });
    }

    function clearPara() {
        $("#info > table > tbody > tr").each(function(){
            GM_deleteValue(this.children[1].children[0].id);
        });
    }

    function refreshInfo() {
        $("#info > table > tbody > tr").each(function(){
            $(this.children[1].children[0]).val(GM_getValue(this.children[1].children[0].id));
            if ($("#" + $(this.children[1].children[0]).attr("ref")).val() == $(this.children[1].children[0]).val()) {
                $(this.children[2]).text("一致");
            }
            else {
                $(this.children[2]).text("不同");
            }
        });


        setTimeout(refreshInfo, 1000);
    }


    function addTable() {
        var info = "<div id='info'style='cursor:pointer;z-index:98;display:block;width:400px;height:500px;line-height:20px;position:fixed;left:865px;top:20px;text-align:left;overflow:visible'><table style='table-layout:fixed;'><tbody></tbody></table></div>";
        $("body").append(info);

        var dic_lw = {
            "lw_wzm":["文章名","LwName"],
            "lw_qkm":["期刊名","KanwuName"],
            "lw_qkly":["期刊来源",""],
            "lw_fbnf":["发表年份","PublishYear"],
            "lw_fbyf":["发表月份","PublishMonth"],
            "lw_qs":["期数","PublishIssue"],
            "lw_jh":["卷号","PublishVol"],
            "lw_ym":["页码","PublishPage"],
            "lw_zrs":["总人数","AuthorCount"],
            "lw_xpm":["校排名","SchoolRanking"],
            "lw_zz":["作者","AllAuthor"],
        };

        var dic_zl = {
            "zl_cgm":["成果名","ZLName"],
            "zl_xpm":["校排名","SchoolRanking"],
            "zl_zrs":["总人数","AuthorCount"],
            "zl_cglb":["成果类别","ZLType_List"],
            "zl_sqzsh":["授权证书号","Certificate_Num"],
            "zl_sqr":["申请人",""],
            "zl_sqnd":["授权年度","ZLYear"],
            "zl_sqyf":["授权月份","ZLMonth"],
            "zl_zz":["作者","ZLAllAuthor"],
        };

        // 文章管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managelw")) {
            let dic = dic_lw;
            for(let key in dic){
                $("#info table tbody").append("<tr><td style='width:80px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'valign='middle'>" + dic[key][0] + "：</td><td><input id='" + key + "' type='text' border='none' outline='none' maxlength='200' readonly='readonly' ref='" + dic[key][1] + "' style='width:400px;' value=''></td><td style='width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'valign='right'></td></tr>" );
            }
        }

        // 专利管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managezl")) {
            let dic = dic_zl;
            for(let key in dic){
                $("#info table tbody").append("<tr><td style='width:80px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'valign='middle'>" + dic[key][0] + "：</td><td><input id='" + key + "' type='text' border='none' outline='none' maxlength='200' readonly='readonly' ref='" + dic[key][1] + "' style='width:400px;' value=''></td><td style='width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'valign='right'></td></tr>" );
            }
        }


    }


    function getFQ(year, issn) {
        year = year||"";
        issn = issn||"";
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://www.fenqubiao.com/Core/JournalDetail.aspx?",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: "y=" + year + "&t=" + issn,
            onload: function(response) {
                var re = /<td style="border:1px #DDD solid; border-collapse:collapse; text-align:left; padding:8px 8px 8px 8px;">(\S*)<\/td>/g;
                var result = response.responseText.match(re)[2].replace(re, "$1");
                if(result) {
                    var fenqu = "<div id='fenqu'style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:150px;text-align:center;overflow:visible'><p style='font-size:25px;color:blue'>" + result + "</p></div>";
                    $("body").append(fenqu);
                    $("#fenqu").click(function(){
                        window.open("http://letpub.com.cn/index.php?page=journalapp&view=search");
                    });
                }
            }
        });
    }



    //html加载完成
    $(document).ready(function(){
        console.log(href);

        // 文章管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managelw")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                addBtn();
                addTable();

                let lwxh = $("#Lwid").val();
                // 检查是否同一论文序号，若不同参数清零
                if (lwxh != GM_getValue('lwxh')) {
                    GM_setValue('lwxh', lwxh);
                    clearPara();
                }

                setTimeout(refreshInfo, 1000);
            }
        }

        // 专利管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managezl")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                addBtn();
                addTable();

                let zlxh = $("#ZLnumber").val()
                // 检查是否同一专利序号，若不同参数清零
                if (zlxh != GM_getValue('zlxh')) {
                    GM_setValue('zlxh', zlxh);
                    clearPara();
                }

                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","600");}, true);
                                      $("#ext-gen21").css("height","700");}, 50);

                setTimeout(refreshInfo, 1000);
            }
        }


        // 著作管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managezz")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                let zzxh = $("#Zznumber").val()
                // 检查是否同一论文序号，若不同参数清零
                if (zzxh != GM_getValue('zzxh')) {
                    GM_setValue('zzxh', zzxh);
                    clearPara();
                }

                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","800");}, true);
                                     $("#ext-gen21").css("height","800");
                                     $("#PanelMember").css("margin-top","300");}, 50);


//                 addBtn();
//                 addTable();
//                 setTimeout(refreshInfo, 1000);
            }
        }

        // 优秀成果管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managejl")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","800");}, true);
                                     $("#ext-gen21").css("height","800");
                                     $("#PanelMember").css("margin-top","300");}, 50);;
            }
        }

        // 成果鉴定管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/managejd")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","800");}, true);
                                     $("#ext-gen21").css("height","800");
                                     $("#PanelMember").css("margin-top","300");}, 50);;
            }
        }

        // 论文工作量管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/workmanage_Lw2021")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","450");}, true);
                                     $("#ext-gen21").css("height","450");
                                     $("#PanelMember").css("margin-top","300");}, 50);;
            }
        }


        // 著作工作量管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/workmanage_zz")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","350");}, true);
                                     $("#ext-gen21").css("height","350");
                                     $("#PanelMember").css("margin-top","300");}, 50);;
            }
        }


        // 专利工作量管理系统查看页面
        if (href.match("kygl.jgsu.edu.cn/kygl/workmanage_zl")) {
            let btn_fh = $("#GoToBack");
            // 判断是否出现返回按钮，表示此刻页面为具体查看页面
            if (btn_fh.val() == '返回') {
                // 在css渲染后再添加一个resize事件，显示出完整内容
                setTimeout(function(){ window.addEventListener("resize", function() { $("#ext-gen21").css("height","600");}, true);
                                     $("#ext-gen21").css("height","600");
                                     $("#PanelMember").css("margin-top","300");}, 50);;
            }
        }

        // WOS文章详细信息页面
        if (href.match("www.webofscience.com/wos/woscc/full-record/")) {
            setTimeout(function(){

                GM_setValue("lw_wzm", $("#FullRTa-fullRecordtitle-0").text());
                console.log($("#FullRTa-fullRecordtitle-0").text());
                GM_setValue("lw_qkm", $("#snMainArticle > app-jcr-overlay > span > button").text());
                GM_setValue("lw_fbnf", $("#FullRTa-pubdate").text().split(" ")[$("#FullRTa-pubdate").text().split(" ").length - 1]);
                GM_setValue("lw_fbyf", $("#FullRTa-pubdate").text().split(" ")[0]);
                GM_setValue("lw_qs", $("#FullRTa-issue").text());
                GM_setValue("lw_jh", $("#FullRTa-volume").text());
                GM_setValue("lw_ym", $("#FullRTa-pageNo").text());

                GM_setValue("lw_xpm", 0);
                let dz_num = $("#snMainArticle > app-full-record-addresses > div").children("div").length;
                let jgsu_xh = [];
                for (let i=0;i<dz_num;i++) {
                    if ($("#address_" + (dz_num-i) + " > span.value.padding-right-5--reversible").text().match("Jinggangshan Univ")) {
                        GM_setValue("lw_xpm", dz_num-i);
                        jgsu_xh.push(dz_num-i);
                    }
                }

                // 通讯作者
                let txzz = $("#AiiTa-RepAddrTitle-0 > span").text();

                let zz_num = $("#SumAuthTa-MainDiv-author-en").children("span").length;
                GM_setValue("lw_zrs", zz_num);

                let jgsu_zz = [];
                let zzgr = "";
                for (let j=0;j<zz_num;j++) {
                    zzgr = $("#author-" + j).text()
                    for (let k=0;k<jgsu_xh.length;k++) {
                        if (zzgr.match(jgsu_xh[k])) {
                            if (txzz == zzgr.match(/\((.+)\)/)[1]) {
                                zzgr = "0: " + zzgr.match(/\((.+)\)/)[1];
                            }
                            else {
                                zzgr = (j+1) + ": " + zzgr.match(/\((.+)\)/)[1];
                            }
                            break;
                        }
                    }
                    if (zzgr.match(":")) {
                        let pass = 0;
                    }
                    else {
                        zzgr =  (j+1) + ": 校外人员";
                    }
                    jgsu_zz.push(zzgr);
                }
                GM_setValue("lw_zz", jgsu_zz);

            }, 2000);

        }

        // 分区表页面
        if (href.match(/www.fenqubiao.com/)) {
            $("#ContentPlaceHolder1_tbxTitleorIssn").val(GM_getValue('name'));
        }

        // 知网查文章页面
        if (href.match(/kns.cnki.net\/kcms\/detail\/detail\.aspx\?dbcode=CJFD/)) {
            GM_setValue("lw_wzm", $("body > div.wrapper > div.main > div.container > div > div > div.brief > div > h1").text());
            GM_setValue("lw_qkm", $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a:nth-child(1)").text());

            let qkly_num = $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip").children("a").length;
            let qkly = [];
            for (let i=0;i<qkly_num;i++) {
                qkly.push($("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > a:nth-child(" + (i+2) + ")").text());
            }
            GM_setValue("lw_qkly", qkly);

            GM_setValue("lw_fbnf", $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a:nth-child(2)").text().split(",")[0]);
            GM_setValue("lw_fbyf", $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a:nth-child(2)").text().split(",")[1]);
            GM_setValue("lw_qs", $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a:nth-child(2)").text().split(",")[1].match(/\((\d+)\)/)[1]);
            GM_setValue("lw_jh", $("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a:nth-child(2)").text().split(",")[1].split("(")[0]);
            GM_setValue("lw_ym", $("#DownLoadParts > div.operate-left > div > div.fl.info > p > span:nth-child(2)").text().replace("页码：", "") + "（" + $("#DownLoadParts > div.operate-left > div > div.fl.info > p > span:nth-child(3)").text() + "）");

            GM_setValue("lw_xpm", 0); // 校排名
            let dz = $("body > div.wrapper > div.main > div.container > div > div > div.brief > div > h3:nth-child(3)").text().match(/\d\..[\u4e00-\u9fa5]+/gi);
            let dz_num = 1;
            let jgsu_xh = []; // 记录井冈山大学对应的单位序号
            if (dz) { // 有多个单位
                dz_num = dz.length;
                for (let i=0;i<dz_num;i++) {
                    if (dz[dz_num-1-i].match("井冈山大学")) {
                        GM_setValue("lw_xpm", dz_num-i);
                        jgsu_xh.push(dz_num-i);
                    }
                }
            }
            else { // 只有一个单位
                if ($("body > div.wrapper > div.main > div.container > div > div > div.brief > div > h3:nth-child(3)").text().match("井冈山大学")) {
                    GM_setValue("lw_xpm", 1);
                }
            }


            let zz_num = $("#authorpart").children().length;
            GM_setValue("lw_zrs", zz_num);

            let jgsu_zz = [];
            let zzgr = "";
            for (let j=0;j<zz_num;j++) {
                zzgr = $("#authorpart > span:nth-child(" + (j+1) + ")").text()
                if (dz_num > 1) { // 多个单位的情况
                    for (let k=0;k<jgsu_xh.length;k++) {
                        if (zzgr.match(jgsu_xh[k])) {
                            zzgr = (j+1) + ": " + zzgr.match(/[^\x00-\xff]+/ig)[0];
                            break;
                        }
                    }
                    if (zzgr.match(":")) {
                        let pass = 0;
                    }
                    else {
                        zzgr =  (j+1) + ": 校外人员";
                    }
                    jgsu_zz.push(zzgr);
                }
                else { // 只有一个单位的情况
                    if (GM_getValue("lw_xpm") == 1) {
                        zzgr = (j+1) + ": " + zzgr.match(/[^\x00-\xff]+/ig)[0];
                    }
                    else {
                        zzgr =  (j+1) + ": 校外人员";
                    }
                    jgsu_zz.push(zzgr);
                }
            }
            GM_setValue("lw_zz", jgsu_zz);

        }

        // 知网专利搜索页面
        if (href.match("kns.cnki.net/kns8?")) {
            // 检测复制的是专利名称还是专利申请号
            let zlh = GM_getValue("name").match(/[\d+|x|X]/g);
            if (zlh && zlh.toString().replaceAll(",","").length == 13) {
                // 此时是专利号
                $("body > div.search-box > div > div.search-main > div.input-box > div.sort.reopt > div.sort-default > span").val("SQH$=|??");
                $("body > div.search-box > div > div.search-main > div.input-box > div.sort.reopt > div.sort-default > span").text("申请号");
                $("#selectfield").attr({"value":"SQH$=|??", "korder":"SQH"});
                let num = zlh.toString().replaceAll(",","");
            }
            else {
                // 此时是专利名称
                $("body > div.search-box > div > div.search-main > div.input-box > div.sort.reopt > div.sort-default > span").val("TI=|??");
                $("body > div.search-box > div > div.search-main > div.input-box > div.sort.reopt > div.sort-default > span").text("专利名称");
                $("#selectfield").attr({"value":"TI=|??", "korder":"TI"});
            }
            if(GM_getValue("name")){
                ;
            }
        }

         // 知网专利详细信息索页面
        if (href.match(/kns.cnki.net\/kcms\/detail\/detail\.aspx\?dbcode=SCPD/)) {
            GM_setValue("zl_cgm", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div.wx-tit > h1").text());

            // 授权单位名称及校排名
            let sqr = $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(6) > p").text().replace(/\s/g,"");
            GM_setValue("zl_sqr", sqr);
            if (sqr.match("井冈山大学")) {
                sqr.split(";").some(function(val,index){
                    if (val.match("井冈山大学")) {
                        GM_setValue("zl_xpm", index+1);
                        return true;
                    }
                });
            }
            else {
                GM_setValue("zl_xpm", 0);
            }


            // 作者及总人数
            GM_setValue("zl_zz", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(8) > p").text().replace(/\s/g,"").split(";"));
            GM_setValue("zl_zrs", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(8) > p").text().replace(/\s/g,"").split(";").length);

            // 成果类别及授权证书号
            GM_setValue("zl_cglb", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(2) > p").text());
            GM_setValue("zl_sqzsh", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(3) > div.row-1 > p").text());

            // 授权年度及月份
            GM_setValue("zl_sqnd", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(4) > div.row-2 > p").text().split("-")[0]);
            GM_setValue("zl_sqyf", $("body > div.wrapper > div > div.container > div.doc > div > div.brief > div:nth-child(4) > div.row-2 > p").text().split("-")[1]);
        }

        // 知网查刊页面
        if (href.match("navi.cnki.net/knavi/journals/")) {
            var ly = [];
            var ly_num = $("#qk > div.bodymain > dl > dd > p").children("span").length;
            for (let i=0;i<ly_num;i++) {
                ly.push($("#qk > div.bodymain > dl > dd > p > span:nth-child(" + (i+1) + ")").text());
            }
            GM_setValue("qkly", ly);
        }

        // 中科院分区表查刊界面
        if (href.match("www.fenqubiao.com/Core/JournalDetail.aspx")) {
            var fq = 5;
            var fq_num = $("#categorylist > tbody").children("tr").length;
            for (let i=0;i<fq_num;i++) {
                if ($("#categorylist > tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(1)").text() == "大类") {
                    if (parseInt($("#categorylist > tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(3)").text()) < fq) {
                        fq = parseInt($("#categorylist > tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(3)").text());
                    }
                }
            }
            GM_setValue("qkly", "中科院" + fq + "区");
        }

        // 中国知识产权局专利审查搜索界面
        if (href.match("cpquery.cnipa.gov.cn/txnPantentInfoList.do")) {
            let zlh = GM_getValue("name").match(/[\d+|x|X]/g);
            if (zlh && zlh.toString().replaceAll(",","").length == 13) {
                // 此时是专利号
                zlh = zlh.toString().replaceAll(",","");
                GM_setClipboard(zlh);
            }
        }

        // 中国知识产权局专利详情界面
        if (href.match("cpquery.cnipa.gov.cn/txnQueryBibliographicData")) {
            GM_setValue("zl_cgm", $("#zlxid > div.imfor_box2 > table > tbody > tr:nth-child(1) > td:nth-child(2)").text());

            // 授权单位名称及校排名
            GM_setValue("zl_xpm", 0);
            for (let i=1;i<$("#sqrid > table > tbody").children("tr").length;i++) {
                let xuexiao = $("#sqrid > table > tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(1) > span").attr("title");
                if (xuexiao.match("井冈山大学")) {
                    GM_setValue("zl_xpm", 1);
                    break;
                }
            }


            // 作者及总人数
            GM_setValue("zl_zz", $("#fmrid > table > tbody > tr > td:nth-child(2) > span").attr("title").replace(/\s/g,"").split("、"));
            GM_setValue("zl_zrs", $("#fmrid > table > tbody > tr > td:nth-child(2) > span").attr("title").replace(/\s/g,"").split("、").length);

            // 成果类别及授权证书号
//             GM_setValue("zl_cglb", $("").text());
            GM_setValue("zl_sqzsh", $("#zlxid > div.imfor_box > table > tbody > tr:nth-child(1) > td:nth-child(2) > span").text());

//             $("#gbgg > p").click();

//             // 授权年度及月份
//             GM_setValue("zl_sqnd", $("#gkggid > table > tbody > tr:nth-child(2) > td:nth-child(5) > span").attr("title").split("-")[0]);
//             GM_setValue("zl_sqnd", $("#gkggid > table > tbody > tr:nth-child(2) > td:nth-child(5) > span").attr("title").split("-")[1]);
        }
    })


})();