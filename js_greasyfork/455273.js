// ==UserScript==
// @name         EasyWJXPro-自动填写企业版问卷，填写打乱顺序的问卷
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  EasyWJX的单独版本，用于自动填写问卷星企业版问卷的正确答案，可正确填写打乱顺序的问卷
// @author       MelonFish
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://www.layuicdn.com/layer/layer.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455273/EasyWJXPro-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%81%E4%B8%9A%E7%89%88%E9%97%AE%E5%8D%B7%EF%BC%8C%E5%A1%AB%E5%86%99%E6%89%93%E4%B9%B1%E9%A1%BA%E5%BA%8F%E7%9A%84%E9%97%AE%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455273/EasyWJXPro-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%81%E4%B8%9A%E7%89%88%E9%97%AE%E5%8D%B7%EF%BC%8C%E5%A1%AB%E5%86%99%E6%89%93%E4%B9%B1%E9%A1%BA%E5%BA%8F%E7%9A%84%E9%97%AE%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // name: EasyWJXPro-自动填写企业版问卷，填写打乱顺序的问卷

    // Your code here...
    // 问卷星自带了jquery，如需引用：https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
    console.log("EasyWJX is running. From xq.kzw.ink. Version 1.6.1")
    $(".textCont,input,textarea").off()
    if(window.location.protocol == 'https:') {
        window.location.href = window.location.href.replace('https', 'http')
    }
    if ($("#divTip").text().indexOf("最大填写次数")>=0) {
        var askClearCookie=confirm("发现你可能被问卷星作答次数限制。点击“确定”以尝试绕过该限制。如果没有效果，请尝试更换浏览器、重启路由器（或开关飞行模式）")
        if (askClearCookie==true){
            clearCookie();
        }
    }

    $('#spanPower').html('<a href="https://xq.kzw.ink" title="线圈_专为学生谋福利">线圈脚本</a><span>提供破解</span>')
    // 创建链接聊天室按钮
    var chat_btn = document.createElement("div");
    chat_btn.style.position = 'fixed';
    chat_btn.style.height = '3rem';
    chat_btn.style.width = '3rem';
    //chat_btn.style.background = '#000000';
    chat_btn.style.background = 'url(https://s1.ax1x.com/2022/11/17/zeW8XV.png)'
    chat_btn.style.backgroundSize = '3rem 3rem';
    chat_btn.style.borderRadius = '1.5rem'
    chat_btn.style.boxShadow = '0px 0px 20px 0.5px black'
    chat_btn.id = 'chat_btn'
    chat_btn.style.right = '1rem';
    chat_btn.style.bottom = '7rem';
    chat_btn.onclick = function (e) {
        layer.open({
            type: 2,
            title: 'EasyWJX问题反馈与讨论',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['30%', '75%'],
            content: 'https://xq.kzw.ink/?wjx',
            offset: 'rb',
            success: function(layero, index){
                chat_btn.style.display = 'none'
            },
            cancel: function (){
                chat_btn.style.display = 'block'
            }
        });
    }
    $('body').append(chat_btn)

    // 破解复制限制
    document.oncontextmenu = function () {return true;};
    document.onselectstart = function () {return true;};
    setTimeout(async function () {
        $(".textCont,input,textarea").off()

        while (true) {
            var all_textCont = document.querySelectorAll('.textCont')
            for (var i=0; i<all_textCont.length; i++) {
                var input = all_textCont[i].parentNode.previousSibling;
                input.value = all_textCont[i].innerText
            }
            await sleep(1)
        }

    },2000)
    /*
    $(".textCont,input,textarea").on({
        paste: function(e) {
            console.log(e.originalEvent.clipboardData)
            $(e.currentTarget).val(e.originalEvent.clipboardData.getData())
        }
    })
    */
    $("body").css("user-select", "text");
    // 创建按钮
    var addtrueans_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
    addtrueans_btn.textContent = "添加答对题目";
    addtrueans_btn.style.width = "6rem";
    addtrueans_btn.style.height = "1.5rem";
    addtrueans_btn.style.marginLeft = "1rem";
    addtrueans_btn.type = 'button';
    addtrueans_btn.onclick = function (e){
        var addtrueans_ls=prompt("请问需要将哪些题改为正确的？（输入题目ID，如需多个可用空格隔开，如需修改全部清输入“all”）")
        if (addtrueans_ls!=null && addtrueans_ls!="") {
            if (addtrueans_ls!='all') {
                addtrueans_ls = addtrueans_ls.split(' ')
                for (var i=0; i<addtrueans_ls.length; i++) {
                    changeAnsToTrue(addtrueans_ls[i])
                }
            } else if (addtrueans_ls=='all') {
                var ans_list = document.querySelectorAll('.data__items');
                for (var i=0; i<ans_list.length; i++) {
                    changeAnsToTrue(i)
                }
            }
        }
    };
    var server_ip='xq.kzw.ink:8800'
    var clear_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
    clear_btn.textContent = "我要截屏";
    clear_btn.style.width = "4rem";
    clear_btn.style.height = "1.5rem";
    clear_btn.style.marginLeft = "1rem";
    clear_btn.type = 'button';
    clear_btn.onclick = function (e){
        alert('该功能将清理所有页面上与脚本有关的元素方便截图')
        $('#spanPower').html('<a href="https://xq.kzw.ink" title="线圈_专为学生谋福利">问卷星</a><span>提供技术支持</span>')
        clear_btn.style.display = 'none';
        addtrueans_btn.style.display = 'none';
        var ques_titles = $('.data__tit_cjd');
        for (var i=0; i<ques_titles.length; i++) {
            ques_titles.eq(i).text(ques_titles.eq(i).text().split('  题目ID：')[0])
        }
    };
    // 以上为创建按钮
    $("#stop_jiexiTxt").append(addtrueans_btn).append(clear_btn)
    // 判断是否直接修改成绩
    if ($(".score-font-style").length>0) {
        if(window.location.protocol == 'https:') {
            window.location.href = window.location.href.replace('https', 'http')
        } else {
            setTimeout(function () {
                getAllAnswer_radio_input()
            },2000)
            // 放置题目ID
            var ques_titles = $('.data__tit_cjd');
            console.log(ques_titles.eq(0).text())
            for (var i=0; i<ques_titles.length; i++) {
                ques_titles.eq(i).text(ques_titles.eq(i).text()+'  题目ID：'+i)
            }


            var r=confirm("是否需要修改成绩？（可能出现问题，如修改效果不符合要求请刷新）")
            if (r==true)
            {
                var score=prompt("修改后的分数（注意不要大于总分）")
                if (score!=null && score!="")
                {
                    $(".score-font-style").eq(0).text(score)
                }
                var correct_num=prompt("修改后的正确题数（注意不要大于总题数）")
                if (correct_num!=null && correct_num!="")
                {
                    //$(".tbottom-title").eq(3).html('<span style="font-size:20px;">'+correct_num+'</span>')
                    //$("span[style$='font-size:20px;']").text(correct_num)
                    $(".score-form__list.clearfix .tht-content span").text(correct_num)
                }
                if ($(".score-form__list.clearfix .tht-content").text().indexOf('名')>=0) {
                    var rank=prompt("修改后的名次（如果没有排名或者排名修改后出错请点击取消或留空）")
                    if (rank!=null && rank!="")
                    {
                        //$(".tbottom-title").eq(3).html('<span style="font-size:20px;">'+correct_num+'</span>')
                        //$("span[style$='font-size:20px;']").text(correct_num)
                        $(".score-form__list.clearfix .tht-content").eq(1).text("第"+rank+"名")
                    }
                }
            }
        }
    } else {
        /*
        setTimeout(function () {
            writeAnswer_radio_input()
        },2000)
        */
        var writeAnswer_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
        writeAnswer_btn.id = "writeAnswer_btn";
        writeAnswer_btn.textContent = "自动填写";
        writeAnswer_btn.style.width = "4rem";
        writeAnswer_btn.style.height = "2rem";
        writeAnswer_btn.style.marginLeft = '1rem';
        writeAnswer_btn.type = 'button';
        writeAnswer_btn.onclick = function (e){
            writeAnswer_radio_input()
        }
        var clearCookie_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
        clearCookie_btn.id = "clearCookie_btn";
        clearCookie_btn.textContent = "清理数据";
        clearCookie_btn.style.width = "4rem";
        clearCookie_btn.style.height = "2rem";
        clearCookie_btn.style.marginLeft = '1rem';
        clearCookie_btn.type = 'button';
        clearCookie_btn.onclick = function (e){
            // 我也很迷惑但是这三个理论上都是一个方法，只是不知道哪个能成，就全加上了【哭笑脸】
            deleteAllCookies();
            clearCookie();
            clearStorage();
        }
        //writeLocalAnswer()
        /*
        var quickPass_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
        quickPass_btn.id = "quickPass_btn";
        quickPass_btn.textContent = "速通";
        quickPass_btn.style.width = "4rem";
        quickPass_btn.style.height = "2rem";
        quickPass_btn.style.marginLeft = '1rem';
        quickPass_btn.type = 'button';
        quickPass_btn.onclick = function (e){

        }
        */
        $('#toptitle h1').eq(0).append(writeAnswer_btn)
        $('#toptitle h1').eq(0).append(clearCookie_btn)
        //$('#toptitle h1').eq(0).append(quickPass_btn)
    }

    if ($(".wxtxt").length >0) {
        var r2=confirm("监测到微信限制。是否需要移除限制并查看题目（可以查看题目但无法提交）")
        if (r2==true) {
            $("#zhezhao2").remove();
            $("#divContent").removeClass('disabled').removeClass('isblur');
            $("#ctlNext").text('破解后可能无法提交')
            setTimeout(function () {
                alert("重要信息：破解只是删除遮挡，无法提交，建议搜索答案后用微信提交")
            },500)

        }
    }

    // 使用搜索的方式
    var div_list = $(".field-label");
    var btn_list = [];
    // var btn = $('<button type="button" style="height: 1.5rem; width: 2.3rem; margin-left: 1rem;" onclick="alert(102210);">搜索</button>')
    for (i=0; i<div_list.length; i++) {
        var btn = document.createElement("button"); //创建一个input对象（提示框按钮）
        btn.id = "search_btn_"+i;
        btn.textContent = "搜索";
        btn.style.width = "2.3rem";
        btn.style.height = "1.5rem";
        btn.style.marginLeft = "1rem";
        btn.type = 'button';
        //绑定按键点击功能
        btn_list.push(btn)
        console.log(btn)
        btn.onclick = function (e){
            console.log('点击了按键', e.srcElement.id);
            var btn_num = parseInt(e.srcElement.id.split('_')[2]);
            var url = window.location.href;
            var search_content = div_list.eq(btn_num).text().replace('搜索', '').replace('复制','').replace('✅','');
            console.log(btn_num, search_content)
            //iframe 层
            /*
            layer.msg('hello');
            layer.open({
                type: 2,
                title: '很多时候，我们想最大化看，比如像这个页面。',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: ['100%', '100%'],
                content: 'https://www.wjx.cn/',
                zIndex: layer.zIndex, //重点1
                success: function(layero){
                    layer.setTop(layero); //重点2
                }
            });
            */

            //window.open('https://www.bing.com/search?q='+search_content)
            if (e.srcElement.textContent=="搜索") {
                var iframe = document.createElement("iframe");
                iframe.id = "search_iframe"+btn_num;
                iframe.style.width = "100%";
                iframe.style.height = "20rem";
                iframe.style.marginTop = "2rem";
                iframe.src = 'https://www.bing.com/search?q='+search_content
                div_list.eq(btn_num).append(iframe)
                e.srcElement.textContent="收起";
            } else {
                e.srcElement.textContent="搜索";
                document.getElementById("search_iframe"+btn_num).remove();
            }
        };
        div_list.eq(i).append(btn)
    }
    for (var j=0; j<div_list.length; j++) {
        var copy_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
        copy_btn.id = "copy_btn_"+j;
        copy_btn.textContent = "复制";
        copy_btn.style.width = "2.3rem";
        copy_btn.style.height = "1.5rem";
        copy_btn.style.marginLeft = "1rem";
        copy_btn.type = 'button';
        copy_btn.onclick = function (e){
            console.log('点击了按键', e.srcElement.id);
            var btn_num = parseInt(e.srcElement.id.split('_')[2]);
            var search_content = div_list.eq(btn_num).text().replace('搜索', '').replace('复制','').replace('✅','');
            copy_to_clipboard(search_content)
            e.srcElement.textContent ="✅";
            setTimeout(function(){
                e.srcElement.textContent="复制";
            },2000)
        };
        div_list.eq(j).append(copy_btn)
    }


    function copy_to_clipboard(txt_str){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', txt_str);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
            //Alert(500,'复制成功');
        }
        document.body.removeChild(input);
    }
    // -----------------------------------------以下这一段都是用来清理cookie的-------------------------------------------
    // 根据实测，foreach毫无效果，deleteAllCookies有少量效果（只能破解一半），clearCookie完全可以
    function deleteAllCookies() { // 方法1
        var cookies = document.cookie.split(";");
        console.log(cookies)
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name +"=;";
            //document.cookie = null
        }
        var cookies2 = document.cookie.split(";");
        console.log(cookies2)
    }
    /*
    function DelCookie(name) { // 方法2，删除一个的
        var exp = new Date();
        exp.setTime (exp.getTime() - 1);
        var cval = GetCookie (name);
        document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
    }
    function foreach() {// 方法2，删除全部的
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; "); // 将多cookie切割为多个名/值对
        for(var i=0;i <arrCookie.length;i++)
        { // 遍历cookie数组，处理每个cookie对
            var arr=arrCookie[i].split("=");
            if(arr.length>0)
                DelCookie(arr[0]);
        }
    }
    function GetCookie(name) {// 方法2，这是获取的
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen)
        {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return GetCooki (j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    function GetCooki(offset) {// 方法2，这是获取的
        var endstr = document.cookie.indexOf (";", offset);
        if (endstr == -1)
            endstr = document.cookie.length;
        return decodeURIComponent(document.cookie.substring(offset, endstr));
    }
    */
    function clearCookie(){ //方法3
        // 这段代码来自其它脚本，为MIT协议，
        var keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString();
            }
        }
        console.log("cookie数据已清除");
        location.reload();
    }
    function clearStorage() {
       localStorage.clear()
       sessionStorage.clear()
    }
    // -----------------------------------------以上这一段都是用来清理cookie的-------------------------------------------

    function getAnswer_radio(str_id) {
        // 问卷星迷惑行为： 是已选radio标志， 是未选标志，真的它俩不一样，不要尝试修改不然可能出问题。或者说我改成unicode字符是不是会好一点
        // 好的我现在转换出来了，已选对应的unicode是\ue6df，未选对应的是\ue6e0，问卷星我真谢谢你
        // 然后接着就发现h5里只支持10进制的所以还得转一下，现在h5对应的就是：选中：59103 未选：59104
        // html里转译这种字符的方式就是：&#59103; &#59104;
        // 又是阴间操作：多选题：勾选答案：， 未勾选：
        var id = parseInt(str_id);
        console.log('开始检查',id)
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        //var ans_data_key = ans_list_html.querySelectorAll('.data__items')[id].querySelector('.data__key')
        var ans_data_key_ls = ans_list_html.querySelectorAll('.data__items');
        console.log(ans_data_key_ls)
        for (var i=0; i<ans_data_key_ls.length; i++) {
            console.log('准备获取题目id',ans_data_key_ls[i])
            try {
                var ques_id = ans_data_key_ls[i].querySelector('.data__tit_cjd').innerText.split('题目ID：')[1]
            } catch {
                var ques_id = -1
            }

            console.log('循环了一次',ques_id)
            if (ans_data_key_ls[i].querySelector('.data__tit_cjd') && ques_id==str_id) {
                var ans_data_key = ans_data_key_ls[i].querySelector('.data__key')
                console.log('radio找到题目ID')
                id = parseInt(ques_id)
                break
            }
        }
        if (ans_data_key && ans_data_key.querySelectorAll('.ulradiocheck').length !=0){
            var ans_span_txt = ans_data_key.querySelector('.judge_ques_right span').innerText;
            var ans_radio_list = ans_data_key.querySelectorAll('.ulradiocheck div')
            if (ans_radio_list[0].querySelector('i').innerText=='' || ans_radio_list[0].querySelector('i').innerText==''){
                // 普通radio单选
                var true_ans_num=-1
                var i=0
                if (ans_span_txt == '回答正确'){
                    true_ans_num = -1
                    for (i=0; i<ans_radio_list.length; i++) {
                        if (ans_radio_list[i].querySelector('i').innerText=='') {
                            true_ans_num = i
                            break
                        }
                    }
                    console.log(true_ans_num)
                } else {
                    var true_ans_txt = ans_data_key.querySelector('.answer-ansys div').innerText
                    console.log(true_ans_txt)
                    true_ans_num = -1
                    for (i=0; i<ans_radio_list.length; i++) {
                        console.log(ans_radio_list[i].querySelector('span').innerText)
                        if (ans_radio_list[i].querySelector('span').innerText==true_ans_txt) {
                            true_ans_num = i
                            break
                        }
                    }
                    console.log(true_ans_num)
                }
                return [ans_radio_list[true_ans_num].querySelector('span').innerText, 'radio']
            } else if (ans_radio_list[0].querySelector('i').innerText=='' || ans_radio_list[0].querySelector('i').innerText==''){
                // radio多选
                var true_ans_ls_txt = '';
                var i=0
                if (ans_span_txt == '回答正确'){
                    for (i=0; i<ans_radio_list.length; i++) {
                        if (ans_radio_list[i].querySelector('i').innerText=='') {
                            true_ans_ls_txt = true_ans_ls_txt+ans_radio_list[i].querySelector('span').innerText+'|';
                        }
                    }
                    true_ans_ls_txt = true_ans_ls_txt.slice(0,true_ans_ls_txt.length-1)
                } else {
                    true_ans_ls_txt = ans_data_key.querySelector('.answer-ansys div').innerText.replace('┋', '|');
                }
                console.log(true_ans_ls_txt)
                return [true_ans_ls_txt, 'checkbox']
            }

        } else {
            console.log('不是radio题目')
            return ["NOTRADIO", 'none']
        }
    }
    function getAnswer_input(str_id) { // 需要特别注意，后期修改的时候，因为这里获取的是div的直接文本，要判断不是其他题目类型，所以优先级最低，后期添加其他类型题目时，要在这里排除
        var id = parseInt(str_id);
        console.log('开始检查',id)
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        //var ans_data_key = ans_list_html.querySelectorAll('.data__items')[id].querySelector('.data__key')
        var ans_data_key_ls = ans_list_html.querySelectorAll('.data__items');
        console.log(ans_data_key_ls)
        for (var i=0; i<ans_data_key_ls.length; i++) {
            try {
                var ques_id = ans_data_key_ls[i].querySelector('.data__tit_cjd').innerText.split('题目ID：')[1]
            } catch {
                var ques_id = -1
            }
            if (ans_data_key_ls[i].querySelector('.data__tit_cjd') && ques_id==str_id) {
                var ans_data_key = ans_data_key_ls[i].querySelector('.data__key')
                id = parseInt(ques_id)
                break
            }
        }
        console.log(ans_data_key)
        if (ans_data_key && ans_data_key.querySelectorAll('div').length !=0 && ans_data_key.querySelector('div').innerText!='' && ans_data_key.querySelectorAll('.ulradiocheck').length==0){
            if (ans_data_key.querySelector('.judge_ques_right span')) {
                var ans_span_txt = ans_data_key.querySelector('.judge_ques_right span').innerText;
            } else {return 'NOTINPUT';}
            var ans_text = ans_data_key.querySelector('div').firstChild.nodeValue
            var true_ans = ''
            if (ans_span_txt == '回答正确'){
                true_ans = ans_text
            } else {
                true_ans = ans_data_key.querySelector('.answer-ansys div').innerText
            }
            console.log(true_ans)
            return true_ans
        } else {
            console.log('不是input题目')
            return "NOTINPUT"
        }
    }
    function getAnswer_manyInput(str_id){
        var id = parseInt(str_id);
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        var ans_data_key_ls = ans_list_html.querySelectorAll('.data__items');
        console.log(ans_data_key_ls)
        for (var i=0; i<ans_data_key_ls.length; i++) {
            try {
                var ques_id = ans_data_key_ls[i].querySelector('.data__tit_cjd').innerText.split('题目ID：')[1]
            } catch {
                var ques_id = -1
            }
            if (ans_data_key_ls[i].querySelector('.data__tit_cjd') && ques_id==str_id) {
                var ans_data_key = ans_data_key_ls[i]
                id = parseInt(ques_id)
                break
            }
        }
        var content = ans_data_key.querySelector('.data__tit_cjd').innerText
        console.log(content)
        if (content.indexOf('【')<0 && content.indexOf('】')<0){
            return 'NOTMANYINPUT'
        }
        return content
    }
    function sendUploadRequest(wj_id, content) {
        $.post('//'+server_ip+'/pro/upload', {wj_id: wj_id, content: JSON.stringify(content)}, function (result) {
            console.log(result)
        })
    }
    function getAllAnswer_radio_input() {
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        var ans_title_list = ans_list_html.querySelectorAll('.data__tit_cjd')
        var send_ls = []
        for (var i=0; i<ans_title_list.length; i++) {
            var title = ans_title_list[i].innerText;
            var id = title.split('题目ID：')[1]
            var question= title.split('题目ID：')[0].replace(/\s*/g,"");
            try {
                var [ans, kind] = getAnswer_radio(id);
            }catch{
                var [ans, kind] = ['NOTRADIO', 'none']
            }
            if (ans != 'NOTRADIO') {
                send_ls.push({question: question, answer: ans, kind: kind})
            } else if (ans == 'NOTRADIO') {
                /*
                // 这里是input的全部数据处理
                try{
                    ans = getAnswer_input(id);
                }catch{
                    ans = 'NOTINPUT'
                }
                if (ans!='NOTINPUT') {
                    send_ls.push({ques_id: id, answer: ans, kind: 'input'})
                } else if (ans == 'NOTINPUT'){
                    // 这里写的有点乱了，这里是manyinput的全部数据处理
                    try {
                        ans = getAnswer_manyInput(id);
                    } catch{
                        ans = 'NOTMANYINPUT'
                    }
                    if (ans != 'NOTMANYINPUT'){
                        send_ls.push({ques_id: id, answer: ans, kind: 'manyinput'})
                    }
                }
                */
                // 这里是处理manyinput数据，input优先级最低，radio最高
                try{
                    ans = getAnswer_manyInput(id);
                }catch{
                    ans = 'NOTMANYINPUT'
                }
                if (ans!='NOTMANYINPUT'){
                    send_ls.push({question: question, answer: ans, kind: 'manyinput'})
                }else if (ans == 'NOTMANYINPUT'){
                    try {
                        ans = getAnswer_input(id);
                    } catch {
                        ans = 'NOTINPUT'
                    }
                    if (ans != 'NOTINPUT'){
                        send_ls.push({question: question, answer: ans, kind: 'input'})
                    }
                }
            }

        }
        var wj_id = getQueryString('activityid')
        console.log(send_ls)
        sendUploadRequest(wj_id, send_ls)
    }
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function writeAnswer_radio_input() {
        var wj_id = window.location.pathname.replace('/vm/', '').replace('.aspx', '')
        console.log(wj_id)
        var answer_ls;
        $.post('//'+server_ip+'/pro', {wj_id: wj_id}, function (result) {
            if (result.length==0) {
                console.log('NONE_ANSWER')
                document.querySelector('#writeAnswer_btn').innerText = '暂无答案';
                setTimeout(function(){
                    document.querySelector('#writeAnswer_btn').innerText = '自动填写';
                }, 2000)
                return 'NONE_ANSWER';
            }
            answer_ls = result
            console.log(answer_ls)
            var ans_ls_html = document.querySelectorAll('.field.ui-field-contain');
            // 填写radio
            for (var i=0; i<ans_ls_html.length; i++) {
                var radios = ans_ls_html[i].querySelectorAll('.ui-radio')
                var this_question = ans_ls_html[i].querySelector('.field-label').innerText.replace('*','').replace('搜索','').replace('复制','').replace(/\s*/g,"")
                console.log(radios)
                if (radios.length!=0){
                    for (var j=0; j<answer_ls.length; j++) {
                        if (answer_ls[j].question.indexOf(this_question.split('.')[1])>=0 && answer_ls[j].kind=='radio') {
                            for (var l=0; l<radios.length; l++) {
                                if (answer_ls[j].answer.replace(/\s*/g,"").indexOf(radios[l].innerText.replace(/\s*/g,""))>=0) {
                                    radios[l].click()
                                }
                            }
                        }
                    }
                }
            }

            // 填写input
            for (i=0; i<ans_ls_html.length; i++) {
                var input = ans_ls_html[i].querySelector('.ui-input-text input')
                var this_question = ans_ls_html[i].querySelector('.field-label').innerText.replace('*','').replace('搜索','').replace('复制','').replace(/\s*/g,"")
                if (input) {
                    for (var j=0; j<answer_ls.length; j++) {
                        if (answer_ls[j].question.indexOf(this_question.split('.')[1])>=0 && answer_ls[j].kind=='input') {
                            input.value = answer_ls[j].answer.split('|')[0];
                        }
                    }
                }
            }

            // 填写checkbox（在上传答案的时候checkbox和radio是一类）
            for (i=0; i<ans_ls_html.length; i++) {
                var checkbox = ans_ls_html[i].querySelectorAll('.ui-checkbox');
                var this_question = ans_ls_html[i].querySelector('.field-label').innerText.replace('*','').replace('搜索','').replace('复制','').replace(/\s*/g,"")
                if (checkbox.length!=0){
                    console.log('找到一个checkbox')
                    for (var j=0; j<answer_ls.length; j++) {
                        if (answer_ls[j].question.indexOf(this_question.split('.')[1].replace('【多选题】', ''))>=0 && answer_ls[j].kind=='checkbox') {
                            var ans_txt_ls = answer_ls[j].answer.split('|')
                            for (var l=0; l<ans_txt_ls.length; l++) {
                                for (var k=0; k<checkbox.length; k++) {
                                    //if(ans_txt_ls[l] == checkbox[k].querySelector('.label').innerText) {
                                    if(ans_txt_ls[l].replace(/\s*/g,"").indexOf(checkbox[k].querySelector('.label').innerText.replace(/\s*/g,""))>=0) {
                                         checkbox[k].click();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*

            // 填写manyinput
            for (i=0; i<ans_ls_html.length; i++) {
                var original_input_group = ans_ls_html[i].querySelector('.field-label div');
                if (!original_input_group || original_input_group.querySelectorAll('.textEdit').length==0){
                    continue;
                }
                var copy_input_group_dom = parseDom(original_input_group.innerHTML)
                var input_group = document.querySelector('body').appendChild(copy_input_group_dom)
                //var input_group = document.querySelectorAll('div')[document.querySelectorAll('div').length-1]
                // 添加换行符方便分割
                var all_span = input_group.querySelectorAll('.textEdit');
                console.log('all_span',all_span)
                for (var v=0; v<all_span.length; v++){
                    var br = document.createElement("br");
                    insertAfter(br, all_span[v])
                }

                // 删除多余元素
                var e=0;
                var rm1_ls = input_group.querySelectorAll('.textEdit')
                var rm2_ls = input_group.querySelectorAll(".ui-input-text")
                for (e=0; e<rm1_ls.length; e++){
                    rm1_ls[e].remove()
                }
                for (e=0; e<rm2_ls.length; e++){
                    rm2_ls[e].remove()
                }
                // 拿到拆分的题目
                var ques_ls = input_group.innerHTML.split('<br>')
                for (e=0; e<ques_ls.length; e++) {
                    ques_ls[e] = parseDom(ques_ls[e]).innerText
                }
                console.log(ques_ls)

                // 删除这个复制元素
                input_group.remove()

                for (var j=0; j<answer_ls.length; j++) {
                    if (answer_ls[j].ques_id==i && answer_ls[j].kind=='manyinput') {
                        // 这里开始处理服务器上获取的整体题目，大致思路就是把现有内容replace掉然后就可以拿到两个带括号的答案内容。正确答案后面的括号没有内容，错误答案括号后有正确答案
                        var quesandans = answer_ls[j].answer.split('  题目ID：')[0];
                        console.log('quesandans::', answer_ls[j].answer)
                        for (var ij=0; ij<ques_ls.length-1; ij++){
                            quesandans = quesandans.replace(ques_ls[ij], '')
                        }
                        console.log(quesandans, ques_ls)
                        var quesandans_ls = quesandans.split('】'); // 这个变量里就是用户答案和标准答案了，用【分割
                        console.log('---------------', quesandans_ls)
                        for (var ij=0; ij<quesandans_ls.length; ij++){
                            console.log(quesandans_ls[ij])
                            if (quesandans_ls[ij]!=''){
                                var usr_ans = quesandans_ls[ij].split('【')[0]
                                var ans_res = quesandans_ls[ij].split('【')[1]
                                console.log(usr_ans,ans_res)
                                var true_ans = ''
                                if (ans_res == ''){
                                    true_ans = usr_ans
                                } else if (ans_res.indexOf('正确答案')>=0){
                                    true_ans = ans_res.replace('正确答案: ', '')
                                }
                                console.log(true_ans)
                                // 填入input内，这里可能会产生问题所以加上try
                                try{
                                    original_input_group.querySelectorAll('.ui-input-text')[ij].value = true_ans
                                    original_input_group.querySelectorAll('.textCont')[ij].innerText = true_ans
                                }catch{}
                            }
                        }
                    }
                }
            }


            // 填写完形填空，虽然这样直接复制上面的代码会很臃肿但是感觉分开可能会好一点，和上面的代码很相似
            for (i=0; i<ans_ls_html.length; i++) {
                var original_input_group = ans_ls_html[i].querySelector('.field-label div');
                if (!original_input_group || original_input_group.querySelectorAll('.bracket').length==0){
                    continue;
                }
                var copy_input_group_dom = parseDom(original_input_group.innerHTML)
                var input_group = document.querySelector('body').appendChild(copy_input_group_dom)
                //var input_group = document.querySelectorAll('div')[document.querySelectorAll('div').length-1]
                console.log(input_group)
                // 添加换行符方便分割
                var all_span = input_group.querySelectorAll('.bracket');
                console.log('all_span',all_span)
                for (var v=0; v<all_span.length; v++){
                    var br = document.createElement("br");
                    insertAfter(br, all_span[v])
                }

                // 删除多余元素
                var e=0;
                var rm1_ls = input_group.querySelectorAll('.bracket')
                var rm2_ls = input_group.querySelectorAll(".ui-input-text")
                for (e=0; e<rm1_ls.length; e++){
                    rm1_ls[e].remove()
                }
                for (e=0; e<rm2_ls.length; e++){
                    rm2_ls[e].remove()
                }
                // 拿到拆分的题目
                var ques_ls = input_group.innerHTML.split('<br>')
                for (e=0; e<ques_ls.length; e++) {
                    ques_ls[e] = parseDom(ques_ls[e]).innerText
                }
                console.log(ques_ls)

                // 删除这个复制元素
                input_group.remove()
                console.log(answer_ls)
                for (var j=0; j<answer_ls.length; j++) {
                    if (answer_ls[j].ques_id==i && answer_ls[j].kind=='manyinput') {
                        // 这里开始处理服务器上获取的整体题目，大致思路就是把现有内容replace掉然后就可以拿到两个带括号的答案内容。正确答案后面的括号没有内容，错误答案括号后有正确答案
                        var quesandans = answer_ls[j].answer.split('  题目ID：')[0];
                        for (var ij=0; ij<ques_ls.length-1; ij++){
                            quesandans = quesandans.replace(ques_ls[ij], '')
                        }
                        var quesandans_ls = quesandans.split('】'); // 这个变量里就是用户答案和标准答案了，用【分割
                        console.log('---------------', quesandans_ls)
                        for (var ij=0; ij<quesandans_ls.length; ij++){
                            console.log(quesandans_ls[ij])
                            if (quesandans_ls[ij]!=''){
                                var usr_ans = quesandans_ls[ij].split('【')[0]
                                var ans_res = quesandans_ls[ij].split('【')[1]
                                console.log(usr_ans,ans_res)
                                var true_ans = ''
                                if (ans_res == ''){
                                    true_ans = usr_ans
                                } else if (ans_res.indexOf('正确答案')>=0){
                                    true_ans = ans_res.replace('正确答案: ', '')
                                }
                                console.log(true_ans)
                                // 填入input内，这里可能会产生问题所以加上try
                                try{
                                    original_input_group.querySelectorAll('.ui-input-text')[ij].value = true_ans
                                    original_input_group.querySelectorAll('.bracket')[ij].querySelector('span .selection span span').innerText = true_ans
                                }catch{}
                            }
                        }
                    }
                }
            }
            */
        })

    }
    function changeAnsToTrue(str_id) {
        var id = parseInt(str_id);
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        console.log(ans_list_html);
        var ans_title_list = ans_list_html.querySelectorAll('.data__tit_cjd')
        for (var i=0; i<ans_title_list.length; i++) {
            var title = ans_title_list[i].innerText
            console.log(parseInt(title.split('题目ID：')[1]), id)
            if (parseInt(title.split('题目ID：')[1]) == id) {
                var num = i
                break;
            }
        }
        for (i=0; i<ans_title_list.length; i++) {
            try{
                ans_list_html.querySelectorAll('.data__items')[i].querySelector('.judge_ques_right font').innerText='';
            }catch{}
        }
        try{
            if (ans_list_html.querySelectorAll('.data__items')[num].querySelector('.judge_ques_right span').innerText=='回答错误') {
                console.log('修改成绩',num)
                ans_list_html.querySelectorAll('.data__items')[num].querySelector('.judge_ques_right').style.color='#01AD56';
                ans_list_html.querySelectorAll('.data__items')[num].querySelector('.judge_ques_right img').src = '//image.wjx.cn/images/newimg/score-form/ans-right@2x.png';
                ans_list_html.querySelectorAll('.data__items')[num].querySelector('.judge_ques_right font').innerText='';
                ans_list_html.querySelectorAll('.data__items')[num].querySelector('.answer-ansys').remove()
                ans_list_html.querySelectorAll('.data__items')[num].querySelector('.judge_ques_right span').innerText = '回答正确'
            }
        }catch{}
    }
    function saveAnswerToLocal(){
        var wj_id = window.location.pathname.replace('/vm/', '').replace('.aspx', '')

        var answer_html = document.querySelector('#fieldset1').innerHTML
        localStorage.setItem('answer_html',answer_html)
        localStorage.setItem('wj_id', wj_id)
    }
    function writeLocalAnswer(){
        var local_wj_id = localStorage.getItem('wj_id')
        var wj_id = window.location.pathname.replace('/vm/', '').replace('.aspx', '')
        if (wj_id!=local_wj_id){return "NOLOCALANSWER"}
        var answer_html = localStorage.getItem('answer_html')
        document.querySelector('#fieldset1').innerHTML = answer_html
    }
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }
    /*
    setTimeout(async function () {
        while(true){
            saveAnswerToLocal()
            await sleep(1)
            console.log('保存了一次答案')
        }
    }, 2000)
    */
    function insertAfter(newElement,targetElement){
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
            parent.appendChild(newElement);
        }else{
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }
    function parseDom(arg) {
        var objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE;
    };

})();