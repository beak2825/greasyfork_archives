// ==UserScript==
// @name         多分相关页面优化
// @namespace    http://tampermonkey.net/
// @version      3.49
// @description  多分相关页面优化改进
// @author       ds
// @match      www.moofen.net/*
// @match      http://47.92.71.131/*
// @match      http://140.210.192.246/*
// @match      www.1010jiajiao.com/*
// @downloadURL https://update.greasyfork.org/scripts/429360/%E5%A4%9A%E5%88%86%E7%9B%B8%E5%85%B3%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429360/%E5%A4%9A%E5%88%86%E7%9B%B8%E5%85%B3%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
//将同类别功能的代码进行了分类
var url = document.location.toString();
var m = null;
var temp = null;
var img = null;
var i;
//---------类别零：多分相关页面优化---------
//⭐多分新题库后台，选题组卷搜索页面，施工中
//2023-07-04_155327
//http://www.moofen.net/tkn/pages/paper/paper.html
if ((m = url.match(/^(https?:\/\/(47\.92\.71\.131|140\.210\.192\.246|www\.moofen\.net)\/)(tkn\/pages\/paper\/paper\.html)(.*)$/i))) {
    var paper_list, paper_list_length, sjbh_css, sjbh
    paper_list = document.querySelectorAll('div#paperList')[0];
    paper_list_length = paper_list.childElementCount;
    for (i = 0; i < paper_list_length; i++) {
        //🧩处理筛选后的列表
        sjbh_css = document.querySelectorAll('.text-muted')[2 * i];
        sjbh = sjbh_css.innerText;
        sjmc = document.querySelectorAll('h5')[2 * 1 + 1].innerText.replace(/(.+) +试题.+/g, '$1');
        alert(1);
        console.log(sjmc);
        (function () {
            sjbh_css.forEach(element => {
                console.log(element);
                let btn = document.createElement('button');
                btn.innerText = '复制';
                element.before(btn);
                element.addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log('点击了', element.innerText);
                    GM_setClipboard(element.innerText);
                })
            });
        })();
    }
}

//⭐多分新题库后台，试题录题结构管理
//http://47.92.71.131/tkn/pages/question/paper_item.html
else if ((m = url.match(/^(https?:\/\/(47\.92\.71\.131|140\.210\.192\.246|www\.moofen\.net)\/)(tkn\/pages\/question\/paper_item\.html)(.*)$/i))) {
    if (document.querySelectorAll('a.btn.btn-primary.pl-4.pr-4')[0].innerText = "录题结构管理") {
        //加载页面后自动增大CheckBox按钮尺寸，需要加上延迟才能生效
        setTimeout(function () {
            for (i = 0; i < document.querySelectorAll('input').length; i++) {
                if (document.querySelectorAll('input')[i].type == "checkbox") {
                    document.querySelectorAll('input')[i].style.zoom = 2;
                }
            }
        }, 1000);
        var sjmc, km, nj, glth, glth_start, glth_end, tmsl, nbth, nbth_start, nbth_end;
        //试卷名称，科目，年级，关联题号，关联题号起始，关联题号结束，题目数量，内部题号，内部题号起始，内部题号结束
        sjmc = document.querySelectorAll('h1#paperTitle.mb-4.text-center')[0].innerText;
        nj = sjmc.substr(sjmc.indexOf("年级") - 1, 1);
        switch (nj) {
            case "七":
                nj = 7;
                break;
            case "八":
                nj = 8;
                break;
            case "九":
                nj = 9;
                break;
            default:
                nj = ""
        }
        km = sjmc.slice(-2);
        console.log(nj + km);
        document.querySelectorAll('button.btn.btn-outline-danger.btn-sm.ml-2')[0].insertAdjacentHTML('afterEnd', '<button type="button" class="btn btn-outline-danger btn-sm ml-2" id="auto_link">【' + nj + km + '】自动关联</button>');
        document.querySelectorAll('#auto_link')[0].onclick = auto_link;
        document.querySelectorAll('#auto_link')[0].insertAdjacentHTML('beforeBegin', '<input id="auto_link_content" type="text" class="form-control form-control-sm" placeholder="请输入综合题关联题号" required="">');
        //17，关联17-1,17-2……，17-19，关联17-1,17-2,18,19
        //console.log(glth);
        function auto_link() {
            tmsl = document.querySelectorAll('tbody')[0].children.length;
            glth = document.querySelectorAll('#auto_link_content')[0].value;
            if (glth != "") {
                if (glth.indexOf("-") != -1) {
                    glth_start = parseInt(glth.slice(0, glth.indexOf("-")));
                    glth_end = parseInt(glth.slice(glth.indexOf("-") + 1));
                    for (i = 0; i < tmsl; i++) {
                        nbth = document.querySelectorAll('tbody')[0].children[i].children[1].innerText;
                        if (nbth.indexOf("-") != -1) {
                            nbth_start = parseInt(nbth.slice(0, nbth.indexOf("-")));
                            nbth_end = parseInt(nbth.slice(nbth.indexOf("-") + 1));
                            nbth = nbth_start;
                        }
                        if (nbth <= glth_end && nbth >= glth_start) {
                            document.querySelectorAll('tbody')[0].children[i].children[0].children[0].checked = true;
                        }
                    }
                } else {
                    for (i = 0; i < tmsl; i++) {
                        nbth = document.querySelectorAll('tbody')[0].children[i].children[1].innerText;
                        if (nbth.indexOf("-") != -1) {
                            nbth_start = parseInt(nbth.slice(0, nbth.indexOf("-")));
                            nbth_end = parseInt(nbth.slice(nbth.indexOf("-") + 1));
                            if (nbth_start == glth) {
                                document.querySelectorAll('tbody')[0].children[i].children[0].children[0].checked = true;
                            }
                        }
                    }
                }
            }
            //点击综合题关联按钮并输入关联题号
            setTimeout(function () {
                document.querySelectorAll('button.btn.btn-outline-primary.btn-sm.ml-5')[0].onclick();
            }, 100);
            setTimeout(function () {
                document.querySelectorAll('input.form-control.form-control-sm')[1].value = glth;
            }, 100);
            setTimeout(function () {
                document.querySelectorAll('div.dui-dialog-footer')[0].children[0].onclick();
            }, 100);
            /*
            //综合题关联，input的第0个是隐藏的，第1个是全选，第2个是第一题的，第17个是第二题的，第2+15n是第n题的
            for (i = 0; i < document.querySelectorAll('input').length; i++) {
                nbth=document.querySelectorAll('input')[2 + 15 * i].value;
                document.querySelectorAll('input')[2 + 15 * i].checked = true;
            }
            */
            document.querySelectorAll('#auto_link_content')[0].value = "";
        }
    }
}
//⭐多分新题库后台，试题编辑界面
//http://47.92.71.131/tkn/pages/question/question_content.html?errorCorrectionId=19005361
//http://140.210.192.246/tkn/pages/question/question_content.html?ver=1692076287885
//http://www.moofen.net/tkn/pages/question/question_content.html?ver=1688714384318
else if ((m = url.match(/^(https?:\/\/(47\.92\.71\.131|140\.210\.192\.246|www\.moofen\.net)\/)(tkn\/pages\/question\/question_content\.html)(.*)$/i))) {
    //window.onload = (event) => {
    //ESC键关闭弹出的窗口
    //document.querySelectorAll('span.dui-dialog-close')[0].click();
    //修改页面背景
    var img_url;
    img_url = "https://c-ssl.duitang.com/uploads/blog/202105/11/20210511074902_5a821.thumb.1000_0.jpg"
    img_url = "https://c-ssl.duitang.com/uploads/blog/202102/15/20210215131040_381d7.thumb.1000_0.jpg"
    img_url = "https://images.669pic.com/element_pic/48/73/51/67/9739cd7057d9b2fa46c79756dfbfc1af.jpg_w700wb"
    img_url = "https://hbimg.huabanimg.com/22816985639618e38bc8f3bb1810737b682e7dca44f0-QgCCPL_fw658/format/webp"
    img_url = "http://thepatternlibrary.com/img/aq.jpg"
    img_url = "http://bg-patterns.com/p/new0353/m_new03530.jpg"
    img_url = "https://c-ssl.duitang.com/uploads/blog/202104/21/20210421111142_e2667.thumb.1000_0.jpg"
    //document.querySelectorAll('div.widget')[0].style.backgroundImage = "url('" + img_url + "')";

    setTimeout(function () {
        /*
        //添加取消关联试卷的按钮
        document.querySelectorAll('button#saveQuestion')[0].insertAdjacentHTML('beforeBegin', '<button type="button" class="btn btn-success pl-4 pr-4" id="unlink_paper">取消关联</button>    ');
        document.querySelectorAll('#unlink_paper')[0].onclick = unlink_paper;
        //自动点击取消关联试卷的按钮与弹窗确认
        function unlink_paper() {
            document.querySelectorAll('span.ml-auto.close')[0].onclick();
            setTimeout(function () {
                document.querySelectorAll('a.alert_ok')[0].onclick(); //确认的按钮无法关闭
                //<a class="alert_ok" data-mark="87">确定</a>
                //报错，document.querySelectorAll(...)[0].onclick is not a function
            }, 100);
        }
        //添加关联试卷的按钮
        document.querySelectorAll('button#unlink_paper')[0].insertAdjacentHTML('beforeBegin', '<button type="button" class="btn btn-success pl-4 pr-4" id="link_paper">关联试卷</button>    ');
        document.querySelectorAll('#link_paper')[0].onclick = link_paper;
        document.querySelectorAll('button#link_paper')[0].insertAdjacentHTML('beforeBegin', '<input id="link_paper_number" tpye="text" class="form-control-sm" placeholder="内部题号">');
        //将试卷编号作为卷面题号
        var jmth = document.location.toString().match(/^(.*errorCorrectionId=)(.*)$/i)[2];
        document.querySelectorAll('input#link_paper_number')[0].value = jmth;
        //自动点击关联试卷的按钮并在弹窗输入试卷编号与题号保存
        function link_paper() {
            //nbth=parseInt(document.querySelectorAll('input#link_paper_number')[0].value);
            document.querySelectorAll('button.btn.btn-primary.btn-sm.mb-2')[0].onclick();
            setTimeout(function () {
                //输入试卷编号
                document.querySelectorAll('input.form-control.form-control-sm')[3].value = "2111001040480000";
                document.querySelectorAll('input.form-control.form-control-sm')[5].value = jmth;
                //document.querySelectorAll('input.form-control.form-control-sm')[6].value=nbth; //内部题号用此方法关联不上
                document.querySelectorAll('div.dui-dialog-footer')[0].firstChild.onclick(); //保存按钮
            }, 500);
        }
        */
        var stlb, xk, jmtx, div_edit, tgnr, nd, zsd;
        //试题类别、学科、卷面题型、可编辑框、题干内容、难度、知识点
        stlb = document.querySelectorAll('a.nav-link.active')[1].getAttribute("data-type");
        xk = document.querySelectorAll('select#subject')[0].value;
        jmtx = document.querySelectorAll('select#category')[0].value;
        //难度、知识点有时候在页面修改不了，被禁用了
        //nd = document.querySelectorAll('select#difficulty')[0].value;
        //zsd = document.querySelectorAll('textarea#knowledgePoint')[0].value;
        //alert(xk)
        //根据学科与试题类别调整卷面题型
        //语文
        if (xk == 1) {
            if (stlb == "C" && jmtx == "") {
                //选择题先统一设置成基础知识
                document.querySelectorAll('select#category')[0].value = 101;
            } else if (stlb == "W" && jmtx == "") {
                //写作题-作文
                document.querySelectorAll('select#category')[0].value = 108;
            } else {
                //其他题型先统一设成现代文阅读，问答题
                document.querySelectorAll('select#category')[0].value = 105;
                if (stlb !== "S" && jmtx == "") {
                    //不为综合题的情况才改试题类别
                    document.querySelectorAll('a#Q-tab.nav-link')[0].setAttribute("aria-selected", "true")
                    document.querySelectorAll('a#Q-tab.nav-link')[0].setAttribute("class", "nav-link active")
                    document.querySelectorAll('a#F-tab.nav-link')[0].setAttribute("aria-selected", "false")
                    document.querySelectorAll('a#F-tab.nav-link')[0].setAttribute("class", "nav-link")
                } else {
                    //子题的题型难度知识点为空的话，设成与综合题的题型难度知识点一样，
                    //一步到位的方法，未完善，子题后添加单个按钮，保存子题后原有的脚本子题添加按钮会消失
                    document.querySelectorAll('ul#typeTab')[0].children[5].insertAdjacentHTML('afterEnd', '<button type="button" class="btn btn-success pl-4 pr-4" id="complete_subtitle">完善子题</button>');
                    document.querySelectorAll('#complete_subtitle')[0].onclick = complete_subtitle;

                    function complete_subtitle() {
                        for (i = 0; i < document.querySelectorAll('button.btn.btn-danger.btn-xs.pl-3.pr-3').length; i++) {
                            document.querySelectorAll('button.btn.btn-danger.btn-xs.pl-3.pr-3')[i].insertAdjacentHTML('afterEnd', '<button type="button" class="btn btn-success btn-xs pl-3 pr-3" id="subtitle' + i + '">完善子题</button>');
                            document.querySelectorAll('button.btn.btn-success.btn-xs.pl-3.pr-3')[parseInt(i)].onclick = complete_subtitle0;
                        }
                        //子题背景变透明
                        var zt = document.querySelectorAll('div.card.card-extend');
                        for (i = 0; i < zt.length; i++) {
                            zt[i].style.backgroundColor = "rgb(0,0,0,0)";
                        }
                    }

                    function complete_subtitle0() {
                        jmtx = document.querySelectorAll('select#category')[0].value;
                        i = event.currentTarget.id.slice(-1);
                        console.log(event.currentTarget.id);
                        document.querySelectorAll('button.btn.btn-primary.btn-xs.pl-3.pr-3')[i].onclick();
                        setTimeout(function () {
                            document.querySelectorAll('select#subCategory')[0].value = jmtx;
                            document.querySelectorAll('select#subDifficulty')[0].value = nd;
                            document.querySelectorAll('textarea.form-control.form-control-sm')[2].value = zsd;
                        }, 500);
                    }
                }
                /*
                 */
                //一步到位的方法，未完善
                /*
                            document.querySelectorAll('ul#typeTab')[0].children[5].insertAdjacentHTML('afterEnd', '<button type="button" class="btn btn-success pl-4 pr-4" id="complete_subtitle">完善子题</button>');
                            document.querySelectorAll('#complete_subtitle')[0].onclick = complete_subtitle;
                            function complete_subtitle() {
                                jmtx=document.querySelectorAll('select#category')[0].value;
                                for (i=0; i<document.querySelectorAll('button.btn.btn-primary.btn-xs.pl-3.pr-3').length; i++){
                                    setTimeout(function () {
                                        document.querySelectorAll('button.btn.btn-primary.btn-xs.pl-3.pr-3')[i].onclick();
                                    setTimeout(function () {
                                        document.querySelectorAll('select#subCategory')[0].value=jmtx;
                                            document.querySelectorAll('select#subDifficulty')[0].value=nd;
                                            document.querySelectorAll('textarea.form-control.form-control-sm')[2].value=zsd;
                                        },500);
                                    },1500);
                                }
                            }
                        setTimeout(function () {
                        tgnr=document.querySelectorAll('body.cke_editable.cke_editable_themed.cke_contents_ltr.cke_show_borders')[0].innerText; //题干内容
                                    },500);
                        console.log(tgnr);
                        if (tgnr.indexOf("00字") !== -1){
                            document.querySelectorAll('select#category')[0].value=108;
                            document.querySelectorAll('a#W-tab.nav-link')[0].setAttribute("aria-selected","true");
                            document.querySelectorAll('a#W-tab.nav-link')[0].setAttribute("class", "nav-link active")
                            document.querySelectorAll('a#F-tab.nav-link')[0].setAttribute("aria-selected","false");
                            document.querySelectorAll('a#F-tab.nav-link')[0].setAttribute("class", "nav-link")
                            document.querySelectorAll('body.cke_editable.cke_editable_themed.cke_contents_ltr.cke_show_borders')[0].innerText="此题无标准答案";
                        }
                            */
            }
        }
        //数学
        if (xk == 2 && stlb == "C") {
            document.querySelectorAll('select#category')[0].value = 201;
        }
        if (xk == 2 && stlb == "F") {
            document.querySelectorAll('select#category')[0].value = 202;
        }
        if (xk == 2 && stlb == "Q" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 204;
        }
        //物理
        if (xk == 4 && stlb == "C" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 401;
        }
        if (xk == 4 && stlb == "F" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 403;
        }
        if (xk == 4 && stlb == "Q" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 406;
        }
        //化学
        if (xk == 5 && stlb == "C" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 501;
        }
        if (xk == 5 && stlb == "F" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 503;
        }
        if (xk == 5 && stlb == "Q" && jmtx == "") {
            document.querySelectorAll('select#category')[0].value = 504;
        }
        //document.querySelectorAll('select#category')[0].children[4].selected=true;
        //可编辑框高度调整
        document.querySelectorAll('div.cke_contents.cke_reset')[0].style.height = "200px";
        document.querySelectorAll('div.cke_contents.cke_reset')[1].style.height = "700px";
        document.querySelectorAll('div.cke_contents.cke_reset')[2].style.height = "500px";
        document.querySelectorAll('div.cke_contents.cke_reset')[3].style.height = "500px";
        document.querySelectorAll('div.cke_contents.cke_reset')[4].style.height = "300px";
        document.querySelectorAll('div.cke_contents.cke_reset')[5].style.height = "300px";
        div_edit = document.querySelectorAll('div.cke_contents.cke_reset');
        //alert(div_edit.length); //不知道为什么循环不成功，只有第一个生效
        for (i = 0; i < div_edit.length; i++) {
            div_edit[0].style.height = "500px";
        }
    }, 1500);
    //}
}
//⭐多分新题库后台，选题组卷-查看试卷界面
//http://47.92.71.131/tkn/pages/paper/paper_single.html?paperCode=1001598493637272
else if ((m = url.match(/^(https?:\/\/47\.92\.71\.131\/)(tkn\/pages\/paper\/paper_single\.html)(.*)$/i))) {
    setTimeout(function () {
        //添加难度合并的按钮
        document.querySelectorAll('button.btn.btn-outline-primary.btn-square.btn-sm')[0].insertAdjacentHTML('beforeBegin', '<button type="button" class="btn btn-outline-primary btn-square btn-sm " id="stndhb">试题难度合并</button>    ');
        document.querySelectorAll('#stndhb')[0].onclick = stndhb;
        document.querySelectorAll('button#stndhb')[0].insertAdjacentHTML('beforeBegin', '<input id="ndhb_content" tpye="text" class="form-control-sm" placeholder="小题难度">');

        function stndhb() {
            var ndhb = ""; //难度合并
            tmsl = document.querySelectorAll('div.card-footer.d-flex.justify-content-start').length; //题目数量
            for (i = 0; i < tmsl; i++) {
                var dfl = parseFloat(document.querySelectorAll('div.card-footer.d-flex.justify-content-start')[i].children[2].children[0].innerText); //得分率
                var nd = dfl < 40 ? 5 : dfl < 80 ? 3 : 1;
                ndhb = ndhb + " " + nd;
            }
            ndhb = ndhb.substring(1); //去掉开头多的一个空格
            console.log(ndhb);
            document.querySelectorAll('#ndhb_content')[0].value = ndhb;
        }
    }, 500);
}
//⭐多分题库后台，试题录题结构管理
//http://www.moofen.net/tk/pages/paper/paperItem_search.html?paperCode=
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(tk\/pages\/paper\/paperItem_search\.html)(.*)$/i))) {
    //添加让左侧的选择框按钮变大的按钮
    document.querySelectorAll('button.btn.btn-danger.btn-sm')[0].insertAdjacentHTML('afterEnd', '<button type="button" class="btn btn-success btn-sm" id="zoom_all_btn">CheckBox_Zoom</button>');

    function CheckBox_Zoom() {
        //页面前有2个input不是CheckBox的type
        for (i = 2; i < document.querySelectorAll('input').length; i++) {
            document.querySelectorAll('input')[i].style.zoom = 2;
        }
        //点击卷面题号的单元格，勾选左侧对应的选择框按钮，未完成
        for (i = 0; i < document.querySelectorAll('td').length / 6; i++) {
            document.querySelectorAll('td')[i * 6 + 3].insertAdjacentHTML('afterEnd', '')
        }
    }
    document.querySelectorAll('button#zoom_all_btn.btn.btn-success.btn-sm')[0].onclick = CheckBox_Zoom;
}
//⭐新版教师端学情分析系统
//http://www.moofen.net/school/web/pages/index.html
/*
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(school\/web\/pages\/index\.html)$/i))) {
    //教研组长试卷分析界面，下载试卷难度区分度分布表，未完成
    //获取考试与科目
    var ksmc, jsmc;
    document.querySelectorAll('i.iconfont.icon-home')[0].insertAdjacentHTML('beforeBegin', '<button id="ksxm">考试名称：</button><span id="ksmc"></span>');
    document.querySelectorAll('button#ksxm')[0].onclick = ksxm_show;

    function ksxm_show() {
        ksmc = document.querySelectorAll('select#questExam.form-control.form-control-sm')[0].innerText;
        jsmc = document.querySelectorAll('span#currRoleName.curr-role')[0].innerText;
        document.querySelectorAll('span#ksmc')[0].innerText = ksmc + "_" + jsmc;
    }
}
*/
//⭐试卷预览界面，点击刷新按钮，自动勾选显示所有信息
//http://www.moofen.net/tk/pages/paper/paper_preview.html
// @require        http://www.moofen.net/tk/assets/js/paper/paper_preview_single.js
// @require      http://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(tk\/pages\/paper\/paper_preview\.html.*)$/i))) {
    //位置调整，靠右以便于左右分屏对照
    document.querySelectorAll('div.head-nav')[0].insertAdjacentHTML('afterEnd', '　　　　　　　　　　　　　　　　　　　　　　　　 <button id="pos_adj" class="btn btn-success btn-sm">位置调整</a>');
    document.querySelectorAll('#pos_adj')[0].onclick = pos_adj;

    function pos_adj() {
        //点击刷新按钮
        document.querySelectorAll('button#reloadPaper')[0].click();
        setTimeout(function () {
            var sjbh = document.querySelectorAll('div.card.mb-3')[0].id
            var sjmc = document.querySelectorAll('div.card-body')[0].innerText
            //标题添加新题库链接，配合后续代码方便获取难度
            document.querySelectorAll('div#paperContent.question-check')[0].children[0].remove()
            document.querySelectorAll('div#paperContent.question-check')[0].children[0].insertAdjacentHTML('beforeBegin', '<h3 class="title"><a href=\"http://47.92.71.131/tkn/pages/paper/paper_single.html?paperCode=' + sjbh + '\" target=\"_blank\">' + sjmc + '</a></h3>');
            //document.querySelectorAll('input#paper_check_01')[0].Checked=1
            //document.querySelectorAll('div.height-auto.col-xl-10.col-md-8.col-sm-8')[0].class="height-auto.col-xl-6.col-md-8.col-sm-8"
            //document.querySelectorAll('div#paperContent.question-check')[0].style.right="0px"
            document.querySelectorAll('div#paperSingle.content')[0].style.position = "relative";
            document.querySelectorAll('div#paperSingle.content')[0].style.left = "623px";
            document.querySelectorAll('div#paperSingle.content')[0].style.width = "920px";
            document.querySelectorAll('#pos_adj')[0].style.left = "623px";
            //显示所有基础信息 显示所有分析 显示所有答案 显示所有点评
            for (i = 0; i < document.querySelectorAll('div.show-key').length; i = i + 2) {
                document.querySelectorAll('div.show-key')[i].style.display = "block";
            }
        }, 1000);
    }
}
//⭐编辑试题界面
//http://www.moofen.net/tk/pages/qb/question_edit.html?questionId=1615948988451
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(tk\/pages\/qb\/question_edit\.html.*)$/i))) {
    //位置调整，靠右以便于左右分屏对照
    document.querySelectorAll('#typeTab')[0].lastElementChild.insertAdjacentHTML('afterEnd', '<li class="nav-item"><a class="nav-link" id="pos_adj">位置调整</a></li>');
    //document.querySelectorAll('#pos_adj')[0].onclick = pos_adj;
    //function pos_adj() {
    document.querySelectorAll('section')[0].style.position = "relative";
    document.querySelectorAll('section')[0].style.left = "500px";
    document.querySelectorAll('section')[0].style.width = "920px";
    document.querySelectorAll('#question')[0].style.width = "900px";
    document.querySelectorAll('#tabContent')[0].style.width = "900px";
    //}
}
//⭐同步试卷界面，点击复制试卷编号，未完成
//http://www.moofen.net/tk/pages/sync/paper_sync.html
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(tk\/pages\/sync\/paper_sync\.html.*)$/i))) {
    document.querySelectorAll('input#oldPaperId.form-control')[0].insertAdjacentHTML('beforeBegin', '<div  id="btn1" class="btn btn-success">EhanceCOPY</div>');
    var btn1 = document.getElementById('btn1');

    function EhanceCOPY() {
        var matchs = document.getElementsByClassName('table-item');
        var clipBoardContent = "";
        for (var j = 0; j < matchs.length; j++) {
            var content_before = matchs[j].children[2].innerHTML
            var content = content_before.match(/^(<i.+\/i>)(.+)$/i);
            //var content_after = '<input type="button"> value="' + content_before + '" index="' + j + '" onclick="javascript:(function copyToClipBoard(){var clipBoardContent="";clipBoardContent+=' + content_before + ';window.clipboardData.setData("Text",clipBoardContent);})"';
            var content_after = '<button onclick="javascript:(function (){window.clipboardData.setData("Text",' + content_before + ');})">' + content_before + ' </button>';
            matchs[j].children[2].innerHTML = content_after;
        }
    }
    btn1.onclick = EhanceCOPY;
}
//⭐多分cube页面，因Ajax技术，所有功能都是这个网址
//http://www.moofen.net/cube/pages/cube.html
else if ((m = url.match(/^(https?:\/\/www\.moofen\.net\/)(cube\/pages\/cube\.html)$/i))) {
    //悬浮框添加，放置新增功能按钮
    $("body").append('<div id="cube_enhance_by_ds"  class="default_btn_small white_btn" style="left: 30px;bottom: 30px;overflow: hidden;z-index: 999999;position: fixed;"><button id="structure_enhance" class="default_btn_small yellow_btn">分析结构处理</button></div>')
    var cube_enhance, cube_enhance_count;
    cube_enhance = document.querySelectorAll("#cube_enhance_by_ds")[0];
    cube_enhance_count = cube_enhance.childElementCount;
    cube_enhance.lastChild.insertAdjacentHTML('beforeBegin', '<button id="exam_match" class="default_btn_small blue_btn">网阅项目匹配</button></br>');
    cube_enhance.lastChild.insertAdjacentHTML('afterEnd', '</br><button id="structure_enhance_basic" class="default_btn_small green_btn">基础填充</button>');
    cube_enhance.lastChild.insertAdjacentHTML('afterEnd', '</br><button id="img_sort" class="default_btn_small green_btn">切图重排</button>');
    //cube_enhance.lastChild.insertAdjacentHTML('afterEnd', '</br><button id="img_download" class="default_btn_small green_btn">切图下载</button>');
    //cube_enhance.lastChild.insertAdjacentHTML('afterEnd', '</br><button id="multi_funcion_switch" class="default_btn_small purple_btn">多功能切换</button>');
    //cube_enhance.lastChild.insertAdjacentHTML('afterEnd', '</br><button id="multi_funcion_call" class="default_btn_small blue_btn">多功能调用</button>');
    document.querySelectorAll('#exam_match')[0].onclick = exam_match;
    document.querySelectorAll('#structure_enhance')[0].onclick = structure_enhance;
    document.querySelectorAll('#structure_enhance_basic')[0].onclick = structure_enhance_basic;
    //document.querySelectorAll('#img_sort')[0].onclick = img_sort;
    //document.querySelectorAll('#img_download')[0].onclick = img_download;
    //document.querySelectorAll('#multi_funcion_switch')[0].onclick = multi_funcion_switch;

    //⭐网阅项目匹配
    function exam_match() {
        //功能：考试名称与网阅项目匹配，并自动获取对应科目的分析结构
        var ksmc, kmmc, wyxm, wyxm_length, wysj, wysj_legth, wyxmmc, wysjmc, wyxm_zjnc;
        //考试名称，科目名称，网阅项目，网阅项目数量，网阅试卷，网阅试卷数量，网阅项目名称，网阅试卷名称，网阅项目最近N次
        var is_equal_ksmc, is_equal_kmmc, is_empty_fxjg, is_select_wyxm, select_wyxm_text, select_wyxm_num;
        //考试名称是否相等，k科目名称是否相等，分析结构是否为空，是否选择网阅项目,所选网阅项目内容，所需网阅项目序号
        if (document.querySelectorAll('#examProjectList')[0].children.length == 0) {
            //网阅项目是否为空，空的话点击获取网阅项目
            document.querySelectorAll('span:nth-child(5) .blue_btn')[0].click();
        }
        is_empty_fxjg = document.querySelectorAll('#structure_tbody > tr').length == 0;
        if (is_empty_fxjg) {
            //分析结构是否为空，空的话点击获取分析结构
            wyxm = document.querySelectorAll('#examProjectList')[0];
            wyxm_length = wyxm.options.length;
            ksmc = document.querySelectorAll('#newwind > div > h3')[0].innerText;
            kmmc = document.querySelectorAll('li.hover')[0].innerText;
            //选择最后一项的两种写法
            //wyxm.lastElementChild.selected=true;
            wyxm[wyxm_length - 1].selected = true;
            //option选项切换，并触发change事件
            wyxm.dispatchEvent(new Event('change'));
            //初始化循环内的某些变量
            is_equal_ksmc = false;
            wyxm_zjnc = '';
            //网阅项目匹配
            for (i = wyxm_length - 1; i >= 0; i--) {
                wyxmmc = wyxm.options[i].text;
                //未匹配到是-1，完全相同是0
                is_equal_ksmc = ksmc.indexOf(wyxmmc.replace(/\(.+\)/g, '')) >= 0
                if (is_equal_ksmc) {
                    wyxm[i].selected = true;
                    wyxm.dispatchEvent(new Event('change'));
                    //按照时间由近至远，逆序查找，同名的话就退出循环
                    break;
                }
                //保存最近N次的网阅项目名称，以便未匹配到考试名称时，后续可以直接选择
                var n = 5;
                var j = wyxm_length - i; //正序循环次数
                if (j <= n) {
                    wyxm_zjnc = wyxm_zjnc + '\n【' + j + '】' + wyxmmc.replace(/\(.+\)/g, '');
                }
            }
            is_select_wyxm = false;
            if (!is_equal_ksmc) {
                select_wyxm_text = '\n请从最近' + n + '次的网阅项目中选择匹配此次考试的项目，并输入对应的编号确定，如果没有对应的网阅项目请不填写内容。\n\n' + ksmc + wyxm_zjnc;
                select_wyxm_num = prompt(select_wyxm_text, 1);
                is_select_wyxm = select_wyxm_num > 0 && select_wyxm_num <= 5;
                if (is_select_wyxm) {
                    wyxm[wyxm_length - select_wyxm_num].selected = true;
                    wyxm.dispatchEvent(new Event('change'));
                }
            }
            //网阅试卷匹配，不管前面是否匹配或者选择了网阅项目，都尝试进行科目名称的匹配
            wysj = document.querySelectorAll('#examPaperList')[0];
            wysj_legth = wysj.length;
            for (i = 0; i < wysj_legth; i++) {
                wysjmc = wysj.options[i].text;
                is_equal_kmmc = kmmc == wysjmc;
                if (is_equal_kmmc) {
                    wysj[i].selected = true;
                    wysj.dispatchEvent(new Event('change'));
                    break;
                }
            }
            //分析结构为空，并且之前找到了同名的考试名称或者从最近N次中选择了某一次，则自动获取分析结构
            if (is_empty_fxjg && (is_equal_ksmc || is_select_wyxm)) {
                //点击获取分析结构按钮
                document.querySelectorAll('.fl.width_btn.blue_btn')[0].click();
                //班级设置为全选，两个步骤确保为选中状态
                document.querySelectorAll('#allclass_check > input')[0].checked = false;
                document.querySelectorAll('#allclass_check > input')[0].click();
                //后续添加一个通过考试名称切换到文科班或者理科班的功能
            }
        }
    }
    //⭐分析结构处理
    function structure_enhance() {
        /*
        获取了分析结构之后，点击【分析结构处理】或者【基础填充】。
        第一步先判断内部题号是否有空的，点一下自动填写。（这时候可能有调整的，以及题目顺序有可能变。）

        第二步再判断卷面题型、分卷、是否有空的，有的话无类别的根据上一项进行填充。（常用的学科科目，预设了分析结构，全部自动填充，主要是初高中的主科。跟预设有冲突的话，回到上一步，【点击基础填充】。）

        第三步分析结构校验，根据卷面题型修改试题类别，比如填空题-填空题，不定项-选择题。（因为默认获取的都是是问答题，填空题要一个一个改）。

        最后在试卷总分后面，汇总统计一个AB卷各自得分的显示。
        */
        //分析结构智能处理
        //年级，学段，学科代码，小题数量，内部题号，卷面题号，试题类别，卷面题型，分卷，选择题选项，选择题数量，分数，总分
        var xxmc, xxid, nj, xd, subCode, xtsl, nbth, jmth, stlb, jmtx, fj, xztxx, xztsl, fs, zf;
        //学科代码：1语文，2数学，3英语，4物理，5化学，6历史，7地理，8政治，9生物
        xxmc = document.querySelectorAll(".structure_div:nth-child(2) .wid_span20")[0].innerText;
        xxid = xxmc.replace(/(.+)\((\d{6})\)/g, "$2");
        xxmc = xxmc.replace(/(.+)\((\d{6})\)/g, "$1");
        nj = document.querySelectorAll("#netExamSection .wid_span12")[0].innerText.replace(/年级/g, "");
        subCode = parseInt(document.querySelectorAll("input#currentsubCode")[0].value);
        xtsl = document.querySelectorAll("select.default_select.category").length;
        nbth = document.querySelectorAll("input.questionNo.form-control.form-control-sm.filter_region");
        jmth = document.querySelectorAll("input.scoreNo.form-control.form-control-sm.filter_region");
        stlb = document.querySelectorAll("select.default_select.type");
        jmtx = document.querySelectorAll("select.default_select.category");
        fj = document.querySelectorAll("select.default_select.section");
        xztxx = document.querySelectorAll("input.choice.form-control.form-control-sm.filter_region");
        fs = document.querySelectorAll('input.score');
        zf = parseInt(document.querySelectorAll('#paperScore')[0].innerText);
        if (nj == "七" || nj == "初一") { nj = 7 };
        if (nj == "八" || nj == "初二") { nj = 8 };
        if (nj == "九" || nj == "初三") { nj = 9 };
        if (nj == "高一" || nj == "十") { nj = 10 };
        if (nj == "高二" || nj == "十一") { nj = 11 };
        if (nj == "高三" || nj == "十二") { nj = 12 };
        nj = parseInt(nj);
        xxid = parseInt(xxid);
        if (!isNaN(nj)) {
            if (nj > 6 & nj < 10) { xd = "junior"; }
            if (nj > 9 & nj < 13) { xd = "senior"; }
        }
        var nbth_empty = 0, jmtx_empty = 0;
        for (i = 0; i < xtsl; i++) {
            if (nbth[i].value == "-" || nbth[i].value == "") {
                nbth_empty++;
            }
            if (jmtx[i].value == "") {
                jmtx_empty++;
            }
            if (stlb[i].value == "C") {
                xztsl++;
            }
        }
        //内部编号左侧添一个0，由默认的智能模式切换为简易模式，仅使用基础的填充功能，不智能替换题号与题型等
        var simple_mode = nbth[0].value.slice(0, 1) == "0";
        //内部题号有空的，先进行预设
        if (nbth_empty > 0) {
            //卷面题号区分了B卷以及带了“-”的，内部题号通用判断方式
            var jmth_current = "", jmth_B_exist = 0, jmth_B_num = 0, nbth_value = 0, nbth_start = 0, nbth_end;
            for (i = 0; i < xtsl; i++) {
                jmth_current = jmth[i].value.replace(/[AB]/g, "");
                if (jmth[i].value.slice(0, 1) == "B") {
                    jmth_B_exist = 1;
                }
                if (i > 0 && jmth[i].value.slice(0, 1) == "B" && jmth[i - 1].value.slice(0, 1) != "B") {
                    jmth_B_num = i;
                }
                if (jmth_current.indexOf("-") != -1 && !isNaN(parseInt(jmth_current))) {
                    nbth_start = parseInt(jmth_current.slice(0, jmth_current.indexOf("-")));
                    nbth_end = parseInt(jmth_current.slice(jmth_current.indexOf("-") + 1));
                    if (nbth_start < nbth_end) {
                        nbth_value = nbth_start + (jmth_B_num - 1) * jmth_B_exist;
                    }
                    if (nbth_start >= nbth_end) {
                        nbth_value = (jmth_B_num - 1) * jmth_B_exist + nbth_start + "-" + nbth_end;
                    }
                } else {
                    if (isNaN(parseInt(jmth_current))) {
                        //如果卷面题号为中文的话，内部题号的值就为上一项+1；
                        nbth_value = nbth_value + 1;
                    } else {
                        nbth_value = parseInt(jmth_current) + (jmth_B_num - 1) * jmth_B_exist;
                    }
                }
                nbth[i].value = nbth_value;
                if (jmth_B_num > 0) {
                    fj[1 - 1].value = "A";
                    fj[jmth_B_num].value = "B";
                }
            }
            if (!simple_mode) {
                //特殊规则替换，全部用循环，根据卷面题号判断内部题号
                var i, j, cznr_jmth, thnr_nbth, cz_jmth, th_nbth, cz_jmth_length, th_nbth_length, xztsl_max, cznr_jmth_xzt, thnr_jmth_xzt, cz_jmth_xzt, th_jmth_xzt, cz_jmth_xzt_length, th_jmth_xzt_length;
                //查找内容_卷面题号，替换内容_内部题号，选择题数量_max，查找内容_卷面题号_选择题，替换内容_卷面题号_选择题
                var bznr, cznr_xztxx, thnr_xztxx, th_xztxx, th_xztxx_length, thnr_jmtx, bznr_jmtx, th_jmtx, th_jmtx_length, jmth_value, jmtx_name;
                //判断内容初始化
                cznr_jmth = "";
                xztsl_max = "";
                cznr_jmth_xzt = "";
                //初中语文更新
                if (xd == "junior" && subCode == 1 && nbth_empty >= 10 && (xtsl >= 28 && xtsl <= 35)) {
                    cznr_jmth = "A9；A9-1；A9-2；A10；A11；A12；A13；作文；B1；B2；B3；16；B4-1；B4-2；B5；B6；19；B7；B8；B9；B9-1；B9-2；B10；B10-1；B10-2；B11；B12-1；B12-2；B12-3；B12；B13；B14；";
                    thnr_nbth = "9；9-1；9-2；10；11；12；13；13；14；15；16；16；17-1；17-2；18；19；19；20；21；22；22-1；22-2；23；23-1；23-2；24；25-1；25-2；25-3；25；26；27；";
                    cznr_jmth_xzt = "16；19；";
                    thnr_jmth_xzt = "B3；B6；";
                }
                //初中英语更新，适配B4A的五道选择题，为76-80与79-83两种情况；新增适配B4A为一道主观题，不是5道选择题的情况；
                if (xd == "junior" && subCode == 3 && nbth_empty >= 4 && (xtsl >= 75 && xtsl <= 81)) {
                    cznr_jmth = "B1；B2；B3；B4A；B4B；B5；作文；书面表达；";
                    if (jmth[xtsl - 3].value == "B4A") {
                        thnr_nbth = "76；77；78；79；80；81；81；81；";
                    } else {
                        thnr_nbth = "76；77；78；79；84；85；85；85；";
                    }
                    if (jmth[70].value == "76" || jmth[70].value == "79" && stlb[70].value == "C") {
                        for (i = 70; i < 75; i++) {
                            jmth[i].value = "B4A-" + parseInt(i - 69);
                            nbth[i].value = i + 9;
                        }
                    }
                }
                //初中物理
                if (xd == "junior" && subCode == 4 && (xtsl >= 25 && xtsl <= 45)) {
                    //倒数第三个题，即A卷最后一个题的内部题号
                    var nbhh_A_last = parseInt(nbth[xtsl - 3].value);
                    //物理B卷的五个选择题的序号以倒数第二个题+1为准，一般是30-34或者31-35
                    for (i = 15; i < 20; i++) {
                        jmth[i].value = "B" + parseInt(i - 14);
                        nbth[i].value = nbhh_A_last + i - 14;
                    }
                    //分卷
                    fj[15].value = "B";
                    //倒数两个题B6、B7的内部题号
                    nbth[xtsl - 2].value = nbhh_A_last + 7 - 1;
                    nbth[xtsl - 1].value = nbhh_A_last + 7;
                }
                //高中英语更新
                if (xd == "senior" && subCode == 3 && nbth_empty >= 2 && (xtsl >= 60 && xtsl <= 70)) {
                    cznr_jmth = "短文改错；书面表达；";
                    thnr_nbth = "71；72；";
                }
                //根据选择题的卷面题号数字序号替换实际的卷面题号，因为怀宇获取分析结构后，后面的选择题会排到主观题前面
                if (cznr_jmth_xzt != "") {
                    cz_jmth_xzt = cznr_jmth_xzt.split("；");
                    th_jmth_xzt = thnr_jmth_xzt.split("；");
                    cz_jmth_xzt_length = cz_jmth_xzt.length;
                    th_jmth_xzt_length = th_jmth_xzt.length;
                    if (cz_jmth_xzt_length == th_jmth_xzt_length) {
                        for (i = 0; i < xztsl_max; i++) {
                            for (j = 0; j < cz_jmth_xzt_length; j++) {
                                //卷面题号与设定的一致并且试题类别为选择题才进行替换
                                if (jmth[i].value == cz_jmth_xzt[j] && stlb[i].value == "C") {
                                    jmth[i].value = th_jmth_xzt[j];
                                }
                            }
                        }
                    }
                }
                //根据卷面题号替换内部题号
                if (cznr_jmth != "") {
                    cz_jmth = cznr_jmth.split("；");
                    th_nbth = thnr_nbth.split("；");
                    cz_jmth_length = cz_jmth.length;
                    th_nbth_length = th_nbth.length;
                    if (cz_jmth_length == th_nbth_length) {
                        for (i = 0; i < xtsl; i++) {
                            for (j = 0; j < cz_jmth_length; j++) {
                                if (jmth[i].value == cz_jmth[j]) {
                                    nbth[i].value = th_nbth[j];
                                }
                            }
                        }
                    }
                    //alert("内部题号已智能填写完毕，请检查确认后点击保存分析结构按钮重新排序。")
                    //保存分析结构
                    document.querySelectorAll("button.width_btn.green_btn")[1].click();
                }
            }
        } else {
            if (!simple_mode) {
                //特殊规则替换，全部用循环，根据卷面题号判断试题类别、卷面题型、分卷、选择题选项等
                if (jmtx_empty > 0) {
                    //卷面题型有空的才进行预设与填充
                    //固定格式的单独修改，初中语数外，高中语数外等
                    cznr_jmth = "";
                    cznr_xztxx = "";
                    //初中语文
                    if (xd == "junior" && subCode == 1 && (xtsl >= 28 && xtsl <= 35)) {
                        cznr_jmth = "1；5；9；A9；9-1；A9-1；10；A10；13；A13；作文；B1；B3；B4；B4-1；B5；B6；B8；B8-1；B12；B12-1；"
                        thnr_jmtx = "101；102；104；104；104；104；105；105；108；108；108；103；102；111；111；102；106；105；105；107；107；"
                        bznr_jmtx = "基础知识；文言文阅读；默写；现代文阅读；作文；诗歌阅读；文言文阅读；翻译；文言文阅读；名著阅读；现代文阅读；语言运用；"
                    }
                    //初中数学
                    if (xd == "junior" && subCode == 2 && (xtsl >= 18 && xtsl <= 28)) {
                        cznr_jmth = "1；9；9-13；14；19；19-23；24；"
                        thnr_jmtx = "201；202；202；204；202；202；204；"
                        bznr_jmtx = "选择题；填空题；解答题；填空题；解答题；"
                    }
                    //初中数学，(838001) 四川省德阳中学初中部、德阳七中(838007)
                    if (xd == "junior" && subCode == 2 && (xtsl >= 18 && xtsl <= 28) && xxmc.indexOf("德阳") != -1) {
                        cznr_jmth = "1；填空题；13；13-18；19；19-1；20；"
                        thnr_jmtx = "201；202；202；202；204；204；204；"
                        bznr_jmtx = "选择题；填空题；填空题；填空题；解答题；解答题；解答题；"
                    }
                    //初中物理
                    if (xd == "junior" && subCode == 4 && (xtsl >= 25 && xtsl <= 45)) {
                        cznr_jmth = "1；16-19；25；25+26；27；B1；B6；"
                        thnr_jmtx = "401；403；404；404；406；402；407；"
                        bznr_jmtx = "选择题；填空题；填空题；作图题；实验探究题；不定项选择题；综合能力题；"
                    }
                    //初中化学
                    if (xd == "junior" && subCode == 5 && (xtsl >= 15 && xtsl <= 30)) {
                        cznr_jmth = "1；15；15-1；"
                        thnr_jmtx = "501；503；503；"
                        bznr_jmtx = "选择题；填空题；填空题；"
                    }
                    //初中英语
                    if (xd == "junior" && subCode == 3 && (xtsl >= 75 && xtsl <= 81)) {
                        cznr_jmth = "1；31；41；46；61；B1；B2；B3；B4A；B4A-1；B5；作文；书面表达；"
                        thnr_jmtx = "301；302；306；303；304；305；306；308；309；309；311；311；311；"
                        bznr_jmtx = "听力；选择填空；补全对话；完形填空；阅读理解；首字母填空；补全对话；短文填空；阅读表达；阅读表达；书面表达；书面表达；书面表达；"
                    }
                    //初中英语，280150西川南区作业
                    // if (xd == "junior" && subCode == 3 && (xtsl < 30)) {
                    //     cznr_jmth = "一；二；三；四；五；B一；B三；B四；B五；B六；B七；"
                    //     thnr_jmtx = "302；305；307；307；304；302；305；303；304；304；308；"
                    //     bznr_jmtx = "选择填空；句型转换；首字母填空；补全对话；完形填空；阅读理解；选择填空；首字母填空；补全对话；完形填空；阅读理解；"
                    // }
                    //初中政治
                    if (xd == "junior" && subCode == 8 && ((xtsl >= 24 && xtsl <= 35) || xtsl == 8)) {
                        cznr_jmth = "1；25；25-1；"
                        thnr_jmtx = "801；802；802；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //初中历史
                    if (xd == "junior" && subCode == 6 && (xtsl >= 24 && xtsl <= 40)) {
                        cznr_jmth = "1；25；25-1；"
                        thnr_jmtx = "601；602；602；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //初中地理
                    if (xd == "junior" && subCode == 7 && (xtsl >= 25 && xtsl <= 40)) {
                        cznr_jmth = "1；26；26-1；"
                        thnr_jmtx = "701；704；704；"
                        bznr_jmtx = "选择题；填空题；填空题；"
                    }
                    //高中语文
                    if (xd == "senior" && subCode == 1 && (xtsl >= 22 && xtsl <= 25)) {
                        cznr_jmth = "1；10；13；13-1；14；16；17；19；21；"
                        thnr_jmtx = "105；102；111；111；103；104；107；106；108；"
                        bznr_jmtx = "现代文阅读；文言文阅读；翻译；翻译；诗歌阅读；默写；语言运用；名著阅读；作文；"
                    }
                    //高中数学
                    if (xd == "senior" && subCode == 2 && (xtsl >= 19 && xtsl <= 25)) {
                        cznr_jmth = "1；13；13-16；17；"
                        thnr_jmtx = "201；202；202；204；"
                        bznr_jmtx = "选择题；填空题；填空题；解答题；"
                    }
                    //高中英语
                    if (xd == "senior" && subCode == 3 && (xtsl >= 60 && xtsl <= 81)) {
                        cznr_jmth = "1；21；41；56；66；76；"
                        thnr_jmtx = "301；304；303；307；312；311；"
                        bznr_jmtx = "听力；阅读理解；完形填空；词汇运用；翻译；书面表达；"
                    }
                    //高中历史
                    if (xd == "senior" && subCode == 6 && (xtsl >= 24 && xtsl <= 34)) {
                        cznr_jmth = "1；25；25-1；"
                        thnr_jmtx = "601；602；602；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //高中地理
                    if (xd == "senior" && subCode == 7 && (xtsl >= 30 && xtsl <= 40)) {
                        cznr_jmth = "1；31；31-1；"
                        thnr_jmtx = "701；702；702；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //高中政治
                    if (xd == "senior" && subCode == 8 && (xtsl >= 30 && xtsl <= 40)) {
                        cznr_jmth = "1；31；31-1；"
                        thnr_jmtx = "801；802；802；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //高中生物
                    if (xd == "senior" && subCode == 9 && (xtsl >= 40 && xtsl <= 50)) {
                        cznr_jmth = "1；41；41-1；"
                        thnr_jmtx = "901；902；902；"
                        bznr_jmtx = "选择题；填空题；填空题；"
                    }
                    //高中历史-文综
                    if (xd == "senior" && subCode == 6 && (nbth[0].value == 24 && nbth[12].value.slice(0, 2) == 41)) {
                        cznr_jmth = "24；41；41-1；"
                        thnr_jmtx = "601；602；602；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //高中地理-文综
                    if (xd == "senior" && subCode == 7 && (nbth[0].value == 1 && nbth[11].value.slice(0, 2) == 36)) {
                        cznr_jmth = "1；36；36-1；"
                        thnr_jmtx = "701；702；702；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //高中政治-文综
                    if (xd == "senior" && subCode == 8 && (nbth[0].value == 12 && nbth[12].value.slice(0, 2) == 38)) {
                        cznr_jmth = "12；38；38-1；"
                        thnr_jmtx = "801；802；802；"
                        bznr_jmtx = "选择题；材料解析题；材料解析题；"
                    }
                    //根据卷面题号替换卷面题型
                    if (cznr_jmth != "") {
                        cz_jmth = cznr_jmth.split("；");
                        th_jmtx = thnr_jmtx.split("；");
                        cz_jmth_length = cz_jmth.length;
                        th_jmtx_length = th_jmtx.length;
                        if (cz_jmth_length == th_jmtx_length) {
                            for (i = 0; i < xtsl; i++) {
                                for (j = 0; j < cz_jmth_length; j++) {
                                    if (jmth[i].value == cz_jmth[j]) {
                                        jmtx[i].value = th_jmtx[j];
                                    }
                                }
                            }
                        }
                    }
                }
                if (subCode == 3) {
                    //英语科目才进行选择题选项数量修改
                    cznr_jmth = "";
                    //初中英语
                    if (xd == "junior" && subCode == 3 && (xtsl >= 75 && xtsl <= 81)) {
                        cznr_jmth = "1；6；11；31；41；46；61；66；76；79；B4A-1；"
                        thnr_xztxx = "ABC；ABCDE；ABC；ABC；ABCDE；ABC；AB；ABC；ABCDEF；ABCDEF；ABCDEF；"
                        bznr = "；；；；；；；；；；"
                    }
                    //高中英语
                    if (xd == "senior" && subCode == 3 && (xtsl >= 60 && xtsl <= 81)) {
                        cznr_jmth = "1；21；36；41；"
                        thnr_xztxx = "ABC；ABCD；ABCDEFG；ABCD；"
                        bznr = "；；；；"
                    }
                    //根据卷面题号替换选择题选项
                    if (cznr_jmth != "") {
                        cz_jmth = cznr_jmth.split("；");
                        th_xztxx = thnr_xztxx.split("；");
                        cz_jmth_length = cz_jmth.length;
                        th_xztxx_length = th_xztxx.length;
                        if (cz_jmth_length == th_xztxx_length) {
                            for (i = 0; i < xtsl; i++) {
                                //先将选择题选项置空
                                xztxx[i].value = "";
                                for (j = 0; j < th_xztxx_length; j++) {
                                    if (jmth[i].value == cz_jmth[j]) {
                                        xztxx[i].value = th_xztxx[j];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //分析结构的卷面题型、分卷、选择题选项依次填充
            for (i = 0; i < xtsl; i++) {
                if (i > 0) {
                    //卷面题型填充
                    if (jmtx[i].value == "") {
                        jmtx[i].value = jmtx[i - 1].value;
                    }
                    //分卷填充
                    if (fj[i].value == "") {
                        fj[i].value = fj[i - 1].value;
                    }
                }
                var xztxx_0, xztxx_1;
                if (subCode == 3 && stlb[i].value == "C") {
                    //当前选择题选项与下一个选择题选项获取
                    xztxx_0 = xztxx[i].value;
                    if (stlb[i + 1].value == "C") {
                        xztxx_1 = xztxx[i + 1].value;
                    }
                    //英语学科选择题选项，强制执行模式，0ABC+ABCD→0ABC+0ABC→ABC+0ABC
                    if (xztxx_0.slice(0, 1) == "0" && xztxx_1.slice(0, 1) != "0") {
                        xztxx[i + 1].value = xztxx_0;
                        xztxx[i].value = xztxx_0.replace("0", "");
                    }
                    //英语学科选择题选项，特殊执行模式，ABC+空+ABCDE→ABC+ABC+ABCDE
                    else if (xztxx_0 != "" && xztxx_1 == "") {
                        xztxx[i + 1].value = xztxx_0;
                    }
                }
            }
            //分析结构校验
            for (i = 0; i < xtsl; i++) {
                nbth_value = nbth[i].value;
                jmth_value = jmth[i].value;
                jmtx_name = jmtx[i].options[jmtx[i].selectedIndex].innerText;
                //分卷设置微调，根据内部题号修改分卷
                if (xxmc.indexOf("德阳") == -1 & xd == "junior" && subCode >= 1 && subCode <= 4 && zf > 50) {
                    //初中四科，并且为非作业，并且非德阳学校，才初始化设置AB卷
                    if (nbth_value == "1") fj[i].value = "A";
                    if (nbth_value == "19-23" && subCode == 2) fj[i].value = "B";
                }

                if ((xxid == 280141 || xxid == 280146) && xd == "junior" && subCode == 5) {
                    //化学全部设成A卷
                    if (nbth_value == "1") fj[i].value = "A";
                }
                //内部题号类别微调，根据内部题号修改内部题号
                if (subCode == 2) {
                    if (nbth_value == "9-13") nbth[i].value = "9";
                    if (nbth_value == "19-23") nbth[i].value = "19";
                    if (nbth_value == "13-16") nbth[i].value = "13";
                }
                if (subCode == 3) {
                    if (nbth_value == "26-30") nbth[i].value = "26";
                }
                if (subCode == 4) {
                    if (nbth_value == "16-19") nbth[i].value = "16";
                    if (nbth_value == "20-24") nbth[i].value = "20";
                    if (nbth_value == "25+26") nbth[i].value = "25";
                }
                //试题类别微调，根据卷面题型修改试题类别
                if (jmtx_name.indexOf("选择") != -1) {
                    //选择题、不定项选择题、选择填空
                    stlb[i].value = "C";
                }
                if (jmtx_name == "填空题") {
                    stlb[i].value = "F";
                }
                if (subCode == 1 && jmtx_name == "默写" && nbth_value == "9-1") {
                    stlb[i].value = "F";
                }
                if (subCode == 4 && jmtx_name == "作图题" && nbth_value == "25" || nbth_value == "25+26") {
                    stlb[i].value = "F";
                }
                if (subCode == 4 && jmtx_name == "实验探究题" && nbth_value >= "26" && nbth_value <= "31") {
                    stlb[i].value = "F";
                }
                if (subCode == 4 && jmtx_name == "综合能力题" && jmth_value == "B6") {
                    stlb[i].value = "F";
                }
                if (jmtx_name == "作文" || jmtx_name == "书面表达") {
                    stlb[i].value = "W";
                }
                //280150西川南区-初中语文数学英语作业-20231109更新
                if (xd == "junior" && subCode == 1 && zf <= 50 && jmtx_name == "基础知识") {
                    stlb[i].value = "C";
                }
                if (xd == "junior" && subCode == 1 && zf <= 50 && jmtx_name == "默写") {
                    stlb[i].value = "F";
                }
                if (xd == "junior" && subCode == 3 && zf <= 120 && xtsl <= 30 && jmtx_name.indexOf("选择") == -1) {
                    stlb[i].value = "F";
                }
                if (xd == "junior" && subCode == 3 && zf <= 120 && xtsl <= 30 && jmtx_name.indexOf("选择") != -1) {
                    stlb[i].value = "C";
                }
                //全部不分卷
                if (xd == "junior" && subCode == 3 && zf <= 120 && xtsl <= 30) {
                    fj[i].value = "";
                }
            }
            //分卷分数汇总，只统计了AB卷的
            var fj_A_score = 0, fj_B_score = 0, fj_score = 0, fj_AB_empty;
            for (i = 0; i < xtsl; i++) {
                fj_score = fs[i].value / 100; //运算之后就由字符串变成了数值
                if (fj[i].value == "A") fj_A_score += fj_score;
                if (fj[i].value == "B") fj_B_score += fj_score;
            }
            //通过文本样式的数量判断是否已经通过脚本添加了AB卷的文字，否则会重复添加
            fj_AB_empty = document.querySelectorAll('.structure_div')[1].childElementCount == 6
            if (fj_AB_empty) {
                //在分析结构的总分后面加上AB卷的分值
                document.querySelectorAll('#paperScore')[0].insertAdjacentHTML('afterEnd', '<label><b>A卷：</b></label><span class="wid_span12" id="paperScoreA">' + fj_A_score + '</span><label><b>B卷：</b></label><span class="wid_span12" id="paperScoreB">' + fj_B_score + '</span>');
            } else {
                document.querySelectorAll('#paperScoreA')[0].innerText = fj_A_score;
                document.querySelectorAll('#paperScoreB')[0].innerText = fj_B_score;
            }
            //保存分析结构
            document.querySelectorAll("button.width_btn.green_btn")[1].click();
        }
    }
    //⭐分析结构处理-基础填充
    function structure_enhance_basic() {
        //分析结构智能处理-基础填充
        //年级，学段，学科代码，小题数量，内部题号，卷面题号，试题类别，卷面题型，分卷，选择题选项，选择题数量，分数，总分
        var xxmc, xxid, nj, xd, subCode, xtsl, nbth, jmth, stlb, jmtx, fj, xztxx, xztsl, fs, zf;
        //学科代码：1语文，2数学，3英语，4物理，5化学，6历史，7地理，8政治，9生物
        xxmc = document.querySelectorAll(".structure_div:nth-child(2) .wid_span20")[0].innerText;
        xxid = xxmc.replace(/(.+)\((\d{6})\)/g, "$2");
        xxmc = xxmc.replace(/(.+)\((\d{6})\)/g, "$1");
        nj = document.querySelectorAll("#netExamSection .wid_span12")[0].innerText.replace(/年级/g, "");
        subCode = parseInt(document.querySelectorAll("input#currentsubCode")[0].value);
        xtsl = document.querySelectorAll("select.default_select.category").length;
        nbth = document.querySelectorAll("input.questionNo.form-control.form-control-sm.filter_region");
        jmth = document.querySelectorAll("input.scoreNo.form-control.form-control-sm.filter_region");
        stlb = document.querySelectorAll("select.default_select.type");
        jmtx = document.querySelectorAll("select.default_select.category");
        fj = document.querySelectorAll("select.default_select.section");
        xztxx = document.querySelectorAll("input.choice.form-control.form-control-sm.filter_region");
        fs = document.querySelectorAll('input.score');
        zf = parseInt(document.querySelectorAll('#paperScore')[0].innerText);
        if (nj == "七" || nj == "初一") { nj = 7 };
        if (nj == "八" || nj == "初二") { nj = 8 };
        if (nj == "九" || nj == "初三") { nj = 9 };
        if (nj == "高一" || nj == "十") { nj = 10 };
        if (nj == "高二" || nj == "十一") { nj = 11 };
        if (nj == "高三" || nj == "十二") { nj = 12 };
        nj = parseInt(nj);
        xxid = parseInt(xxid);
        if (!isNaN(nj)) {
            if (nj > 6 & nj < 10) { xd = "junior"; }
            if (nj > 9 & nj < 13) { xd = "senior"; }
        }
        var nbth_empty = 0, jmtx_empty = 0;
        for (i = 0; i < xtsl; i++) {
            if (nbth[i].value == "-" || nbth[i].value == "") {
                nbth_empty++;
            }
            if (jmtx[i].value == "") {
                jmtx_empty++;
            }
            if (stlb[i].value == "C") {
                xztsl++;
            }
        }
        //内部编号左侧添一个0，由默认的智能模式切换为简易模式，仅使用基础的填充功能，不智能替换题号与题型等
        var simple_mode = nbth[0].value.slice(0, 1) == "0";
        //分析结构的卷面题型、分卷、选择题选项依次填充
        for (i = 0; i < xtsl; i++) {
            if (i > 0) {
                //卷面题型填充
                if (jmtx[i].value == "") {
                    jmtx[i].value = jmtx[i - 1].value;
                }
                //分卷填充
                if (fj[i].value == "") {
                    fj[i].value = fj[i - 1].value;
                }
            }
        }
        //分卷分数汇总，只统计了AB卷的
        var fj_A_score = 0, fj_B_score = 0, fj_score = 0, fj_AB_empty;
        for (i = 0; i < xtsl; i++) {
            fj_score = fs[i].value / 100; //运算之后就由字符串变成了数值
            if (fj[i].value == "A") fj_A_score += fj_score;
            if (fj[i].value == "B") fj_B_score += fj_score;
        }
        //通过文本样式的数量判断是否已经通过脚本添加了AB卷的文字，否则会重复添加
        fj_AB_empty = document.querySelectorAll('.structure_div')[1].childElementCount == 6
        if (fj_AB_empty) {
            //在分析结构的总分后面加上AB卷的分值
            document.querySelectorAll('#paperScore')[0].insertAdjacentHTML('afterEnd', '<label><b>A卷：</b></label><span class="wid_span12" id="paperScoreA">' + fj_A_score + '</span><label><b>B卷：</b></label><span class="wid_span12" id="paperScoreB">' + fj_B_score + '</span>');
        } else {
            document.querySelectorAll('#paperScoreA')[0].innerText = fj_A_score;
            document.querySelectorAll('#paperScoreB')[0].innerText = fj_B_score;
        }
        //保存分析结构
        document.querySelectorAll("button.width_btn.green_btn")[1].click();

    }
    //⭐切图重排
    var bt_all, btsl, qtsl;
    //所有标题，标题数量，切图数量；
    function img_sort() {
        var img_all = document.querySelectorAll("ul#cutImage.cutImage_ul")[0];
        qtsl = img_all.children.length;
        var img_arr = new Array(qtsl);
        for (i = 0; i < qtsl; i++) {
            nbth = img_all.children[i].innerText.replace(".gif", "");
            nbth = nbth.replace("-", "."); //方便后续作为数组排序
            img_arr[i] = nbth;
            if (nbth.indexOf("-") != -1) {
                nbth_start = nbth.slice(0, nbth.indexOf("-"));
                nbth_end = nbth.slice(nbth.indexOf("-") + 1);
            }
        }
        img_arr.sort(function (a, b) {
            return a - b
        }); //按照数值大小排序
        for (i = 0; i < qtsl; i++) {
            img_arr[i] = img_arr[i].replace(".", "-");
            var img_url = document.querySelectorAll("img.img_pdf_view")[0].src.replace(img_all.children[0].innerText, "") + img_arr[i] + ".gif";
            img_all.lastElementChild.insertAdjacentHTML('afterEnd', img_arr[i] + '<img src="' + img_url + '" style="width:100%">');
        }
        console.log(img_arr);
        //img_all.insertBefore(img_all.children[1],img_all.children[0]) //排序方法
    }
    //⭐切图下载
    function img_download() {
        //http://www.moofen.net/res/res/paper/9/1001651029228864/s/4.gif
        //temp =document.querySelectorAll("img.img_pdf_view")[0].src;
        //var sjbh=temp.match(/^(https?:\/\/www\.moofen\.net\/)(res\/res\/paper\/\d+\/(\d{16})\/s\/.+)$/i)[3];
        var img_all = document.querySelectorAll("ul#cutImage.cutImage_ul")[0];
        qtsl = img_all.children.length;
        var img_arr = new Array(qtsl);
        for (i = 0; i < qtsl; i++) {
            img = document.querySelectorAll("img.img_pdf_view")[i].src;
            //批量下载多个文件，https://www.cnblogs.com/zhangym118/p/11352164.html
            let a = document.createElement('a') // 创建a标签
            let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
            e.initEvent('click', false, false) // 初始化事件对象
            a.href = img // 设置下载地址
            a.download = '' // 设置下载文件名
            a.dispatchEvent(e)
        }
    }
    //⭐分析增强
    //分析管理的界面，某一次考试，第三排年级日期后面新增一个按钮，触发成绩数据下载的动作
    //document.querySelectorAll('#ggg')[0].parentElement.parentElement.parentElement.children[2].children[3].onclick()
    //网阅系统，点击选择某一次的考试，自动汇总下载详分
    function analyze_enhance() {
        var exam_all, exam_num, school_id;
        exam_all = document.querySelectorAll("div.card-header");
        exam_num = exam_all.length;
        school_id = document.querySelectorAll("span#schoolName")[0].dataset.id;
        for (i = 0; i < exam_num; i++) { }
    }
    //⭐学校管理界面-配置-等级-得分率
    function grade_scoring_rate() {
        var input_box, subject_box, subject_num;
        //新增等级规则
        document.querySelectorAll("button#addLevel")[0].click();
        //方式改成得分率
        document.querySelectorAll("#selectLevelType")[0].value = 4;
        //规则等级添加并填入对应的值
        for (i = 0; i < 3; i++) {
            document.querySelectorAll("button.btn.btn-success.btn-sm.add")[0].click();
        }
        var dic = {
            A: 80,
            B: 70,
            C: 60,
            D: 0
        };
        i = 0;
        for (var key in dic) {
            input_box = document.querySelectorAll("input.form-control.form-control-sm.d-inline.w-auto");
            input_box[i * 2].value = dic[key];
            input_box[i * 2 + 1].value = key;
            i++;
        }
        //勾选所有学科
        subject_box = document.querySelectorAll("div#subject")[0];
        subject_num = subject_box.childElementCount;
        for (i = 0; i < subject_num; i++) {
            //subject_box.children[i].children[0].click(); //切换input-checkbox的选中状态
            subject_box.children[i].children[0].checked = true; //将input-checkbox设为选中状态
        }
    }
    //⭐多功能切换
    function multi_funcion_switch() {
        var multi_funcion_num = prompt("多功能切换-功能选择", "1");
        if (multi_funcion_num == "1") {
            var multi_funcion_call = grade_scoring_rate;
        }
        document.querySelectorAll('#multi_funcion_call')[0].onclick = multi_funcion_call;
    }
}
//可弃用，uBlock插件更容易实现
//青夏教育，试题搜索结果页面去掉干扰
//http://www.1010jiajiao.com/czsx/shiti_id_7d8dda54d23f54ee9d80e1a05b5eb272
else if ((m = url.match(/^(https?:\/\/www\.1010jiajiao\.com\/)(czsx\/shiti_id_.+)$/i))) {
    document.querySelectorAll('div.sublist')[2].remove();
    document.querySelectorAll('div.ndwz')[0].remove();
    document.querySelectorAll('div#daan_recommend')[0].remove();
    document.querySelectorAll('div.xt')[0].remove();
}