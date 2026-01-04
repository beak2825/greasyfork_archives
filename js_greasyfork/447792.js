// ==UserScript==
// @name        SDUer Helper 兼容Chrome自动评教、成绩助手
// @name:zh     SDUer Helper 兼容Chrome自动评教、成绩助手

// @namespace   https://service.sdu.edu.cn/

// @description 一键查询成绩、兼容Chrome、一键评教、解决非兼容模式下无法查看平时分的问题

// @author      bz2021
// @version     3.0
// @license MIT

// @match       *jwxt.wh.sdu.edu.cn/*
// @match       https://service.sdu.edu.cn/*
// @exclude		*xsxk*
// @grant       GM_xmlhttpRequest
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/447792/SDUer%20Helper%20%E5%85%BC%E5%AE%B9Chrome%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E3%80%81%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447792/SDUer%20Helper%20%E5%85%BC%E5%AE%B9Chrome%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E3%80%81%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {

    var JsMod = (htmlurl,tmpWidth,tmpHeight) => {
        htmlurl=getRandomUrl(htmlurl);
        var newwin = window.open("http://jwxt.wh.sdu.edu.cn" + htmlurl,window,"dialogWidth:"+tmpWidth+"px;status:no;dialogHeight:"+tmpHeight+"px");

        if(newwin == "refresh" || newwin == "ok"){
            if(getOs() == "chrome"){
                window.location.reload();// 谷歌浏览器要用此方法刷新
            }else{
                window.location.href = window.location.href;
            }
        }
    }

    var getRandomUrl = (htmlurl) => {
        var count =htmlurl.indexOf("?");
        var  date=new Date();
        var t=Date.parse(date);    
        if(count<0){
            htmlurl=htmlurl+"?tktime="+t;
        }else{
            htmlurl=htmlurl+"&tktime="+t;
        }
        return htmlurl;
    }

    //在主菜单添加一个名为“我的成绩”的按钮
    function AddMenuButton() {

        //复制一个Menu里的元素
        var element = document.querySelector("#mobile_header_container > div > div:nth-child(2)");
        var copy = element.cloneNode(true);
        var dest = document.querySelector("#mobile_header_container > div");
        dest.insertBefore(copy, dest.children[4]);

        //将复制的元素内容改为‘我的成绩’
        var New_tit = document.querySelector("#mobile_header_container > div > div:nth-child(5) > a > span.tit");
        New_tit.textContent = "我的成绩";

        //禁用原标签点击后的链接跳转
        var New_a = document.querySelector("#mobile_header_container > div > div:nth-child(5) > a");
        New_a.href = "javascript:void(0);";

        //添加点击事件
        var New_button = document.querySelector("#mobile_header_container > div > div:nth-child(5)");
        New_button.addEventListener("click", function () {
            LoginRequst();

        });

    };

    //进行‘教务管理（威海）’页面的登陆请求
    function LoginRequst() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://jwxt.wh.sdu.edu.cn/jsxsd/caslogin.jsp',
            data: 'typeName=XXX&content=XXX&options=XXX',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function (r) {
                SiteRequst();
            }
        });
    };

    //创建一个div来显示成绩信息
    function CopyOneDiv() {
        var element = document.querySelector("#page-content > div > ul:nth-child(3) > li:nth-child(1)")
        var copy = element.cloneNode(true);
        var dest = document.querySelector("#page-content > div > ul:nth-child(3)");
        dest.insertBefore(copy, dest.children[1]);
    }

    //进行成绩单页面的请求，执行成绩单的重要内容解析
    function SiteRequst() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://jwxt.wh.sdu.edu.cn/jsxsd/kscj/cjcx_list',
            data: 'typeName=XXX&content=XXX&options=XXX',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function (r) {
                CopyOneDiv();
                document.querySelector("#swiper_db_content > div > div").innerHTML = '<div id = "999888"></div>';

                $("#999888").append(r.responseText);

                document.querySelector(`#dataList > tbody > tr:nth-child(1) > th:nth-child(${10})`).style.width = "200px";
                document.querySelector(`#dataList > tbody > tr:nth-child(1) > th:nth-child(${2})`).style.width = "100px";

                Judge();

                var TobeDel = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 9, 8, 6];

                var x;
                for (x of TobeDel) {
                    DeleteUselessElement(x);
                }
                unsafeWindow.JsMod = JsMod;
                unsafeWindow.getRandomUrl = getRandomUrl;
                ShitMountain();
            }
        });
    };

    //移除无用的元素
    function DeleteUselessElement(m) {
        var t = document.querySelector(`#dataList > tbody > tr:nth-child(1) > th:nth-child(${m})`);
            t.parentNode.removeChild(t);
        for (var i = 2; ; i++) {
            t = document.querySelector(`#dataList > tbody > tr:nth-child(${i}) > td:nth-child(${m})`)
            if (t == null) {
                break;
            }
            else {
                t.parentNode.removeChild(t);
            }
        }
    }

    function Judge(){
        var art = 0;
        var tra = 0;
        var sci = 0;
        var soc = 0;
        var cre = 0;
        var nor = 0;
        for (var i = 2; ; i++) {
            var t = document.querySelector(`#dataList > tbody > tr:nth-child(${i}) > td:nth-child(${10})`) // 课程属性
            if (t == null)  break;
            var num = document.querySelector(`#dataList > tbody > tr:nth-child(${i}) > td:nth-child(${3})`).textContent;
            var number = num.substr(3, 2);
            var course;
            switch(number){
                case "11" :
                    course = "国学修养类";
                    tra += 2;
                    break;
                case "12" :
                    course = "创新创业类";
                    cre += 2;
                    break;
                case "13" :
                    course = "艺体审美类";
                    art += 2;
                    break;
                case "14" :
                    course = "人文学科类";
                    soc += 2;
                    break;
                case "15" :
                    course = "社会科学类";
                    soc += 2;
                    break;
                case "16" :
                    course = "自然科学类";
                    sci += 2;
                    break;
                case "17" :
                    course = "工程技术类";
                    sci += 2;
                    break;
                case "93" :
                    course = "信息社会类";
                    sci += 2;
                    break;
                case "91" :
                    course = "稷下创新";
                    cre += 2;
                    break;
                case "92" :
                    course = "齐鲁创业";
                    cre += 2;
                    break;
                case "18" :
                    course = "通识教育选修课";
                    nor += 2;
                    break;
            }
            if(t.textContent == "任选" && !document.querySelector(`#dataList > tbody > tr:nth-child(${i}) > td:nth-child(${4})`).textContent.includes("CET")){
                t.textContent = t.textContent + " (" + course + ")";
            }
        }
        //$("#swiper_db_content > div > div").append(`<h3>您已修读艺体审美类共${art}学分，要求2学分` + art >= 2 ? "<b>您已达标</b>" : "<b><font color='#FF0000'>您未达标</font></b></h3>");
        $("#swiper_db_content > div > div").append(`<h3>您已修读艺体审美类共${art}学分，要求2学分<b><font color='#FF0000'>您未达标</font></b></h3>`);
        $("#swiper_db_content > div > div").append(`<h3>国学修养类共${tra}学分，要求2学分</h3>`)
        $("#swiper_db_content > div > div").append(`<h3>自然科学、工程技术、信息社会类共${sci}学分，要求4学分</h3>`)
        $("#swiper_db_content > div > div").append(`<h3>人文学科、社会科学类共${soc}学分，要求2学分</h3>`)
        $("#swiper_db_content > div > div").append(`<h3>稷下创新、齐鲁创新类共${cre}学分，要求4学分</h3>`)
    }

    //删除不必要元素的屎山代码
    function ShitMountain() {
        document.querySelector("#Footer1_divCopyright > div").remove();
        document.querySelector("#\\39 99888").parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].textContent = "我的成绩";
        document.querySelector("#\\39 99888 > div:nth-child(17) > div > div.Nsb_top_logo").remove()
        document.querySelector("#Top1_divLoginName").remove()
        document.querySelector("#\\39 99888 > div:nth-child(17) > div > div.Nsb_top_menu > ul > li:nth-child(1)").remove()
        document.querySelector("#divFirstMenuClass > ul").remove()
        document.querySelector("#\\39 99888 > div:nth-child(19) > div").remove()
        document.querySelector("#btn_back").remove()
        document.querySelector("#\\39 99888 > div.Nsb_menu_pw").remove()
        document.querySelector("#\\39 99888 > div:nth-child(17)").remove()
        document.querySelector("#\\39 99888 > div:nth-child(17) > br:nth-child(3)").remove()
        document.querySelector("#\\39 99888 > div:nth-child(17) > br:nth-child(2)").remove()
        document.querySelector("#\\39 99888 > div:nth-child(17) > br:nth-child(1)").remove()
    }

    //成绩单内容读入，提取关键信息并生成一个html文件
    function GetInfo() {
        var t = [];
        for (var i = 2; ; i++) {
            t[i - 2] = $(`#dataList > tbody > tr:nth-child(${i}) > td:nth-child(4)`);
            if (t == null) {
                break;
            }
            else {
                console.log(t);
            }
        }
    };


    //页面加载完成后执行此代码
    $(document).ready(function () {
        var nowURl = window.location.href;
        if(nowURl.includes("service.sdu.edu.cn")){
            AddMenuButton();
        }
        if(nowURl.includes("jwxt.wh.sdu.edu.cn")){
            if(nowURl.includes("xspj_list") || nowURl.includes("jsxsd/kscj/") ){
                unsafeWindow.JsMod = JsMod;
            }
            if(nowURl.includes("xspj_edit")){

                unsafeWindow.saveData = (obj, status) => {
                    var pj06xhs = document.getElementsByName("pj06xh");

                    var flag = true;
                    for (i = 0; i < pj06xhs.length; i++) {
                        if(jQuery("input[name='pj0601id_"+ pj06xhs[i].value+"']:checked").length == 0) {
                            flag = false;
                            break;
                        }
                    }
                    if (!flag) {
                        alert("评价的每项指标都必须选择!");
                        return false;
                    }
                    flag = false;
                    var minZb = 0;//取到最小指标数
                    for (i = 0; i < pj06xhs.length; i++) {
                        var pj0601s = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
                        minZb = pj0601s.length;
                        break;
                    }

                    for(j = 0; j < minZb; j++) {
                        var _ind = 0;
                        for (i = 0; i < pj06xhs.length; i++) {
                            var pj0601s = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
                            if (j < pj0601s.length && pj0601s[j].checked) {
                                _ind++;
                            }
                        }
                    if (_ind == pj06xhs.length) {
                        flag = true;
                        break;
                    }
                }

                if(flag){
                    alert("请不要选相同一项！");
                    return false;
                }

                if (status == "1") {
                    document.getElementById("issubmit").value = "1";
                } else {
                    document.getElementById("issubmit").value = "0";
                }
                obj.disabled = true;
                document.getElementById("Form1").submit();

            }
                var courselist = document.querySelector("#table1 > tbody");
                let len = courselist.children.length;
                let i = 1;
                var ss = setInterval(()=>{
                    var ele = document.querySelector(`#table1 > tbody > tr:nth-child(${i + 1}) > td:nth-child(2)`);
                    let ran = Math.floor(Math.random() * 3);
                    ele.children[ran * 2].click();
                    i ++;
                    if(i >= len) {
                        console.log(666);
                        clearInterval(ss);
                        setTimeout(()=>{
                            //document.querySelector("#tj").click();
                        }, 2000);
                    }
                }, Math.floor(Math.random() * 20) + 20);
            }

        }
    });

})();
