// ==UserScript==
// @name         pufa-sulen
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  哈哈哈哈 Try to take over the world!
// @author       sulen
// @match        https://*.gxpf.cn/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAMQOAADEDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACipNGgAmQ7/AJkO/wCZDv8AmQ7/HaQpnwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC50ZWQCZDv8AmQ7/AJkO/wCZDv8AmQ7/AJkO/wCZDv8AmQ7/AJkOtgAAAAAAAAAAAAAAAAAAAAAAAAAAAJkO/wCZDv8AmQ7/V7lf/////////////////wCZDv8AmQ7/AJkO/wCZDv8AmQ7/AAAAAAAAAAAAAAAAC50ZWQCZDv8AmQ7/AJkO////////////////////////////AJkO/wCZDv8AmQ7/AJkO/wCZDs4AAAAAAAAAAACZDv8AmQ7/AJkO/wCZDv//////AJkO/wCZDv///////////wCZDv8AmQ7/AJkO/wCZDv8AmQ7/AAAAACipNGj/////f8SF////////////PrBI/wCZDv8AmQ7///////////8AmQ7/HaEo/wCZDv8AmQ7//////wCZDusAmQ7//////wCZDv//////////////////////////////////////////////////////rtaw//////8AmQ7/AJkO//////8AmQ7/AJkO/wCZDv8AmQ7///////////+SzJb///////////8AmQ7/AJkO/wCZDv//////AJkO/wCZDv//////AJkO/wCZDv////////////////8AmQ7/AJkO/wCZDv///////////wCZDv8AmQ7//////wCZDv8AmQ7///////////8AmQ7///////////////////////////////////////////8AmQ7/AJkO//////8AmQ7/HaQpnwCZDv////////////////9Cq0r/AJkO/wCZDv8AmQ7/AJkO/wCZDv8AmQ7/AJkO////////////AJkO9QAAAAAAmQ7/AJkO/4jNjv//////////////////////////////////////////////////////AJkO/wAAAAAAAAAAAJkOtgCZDv8AmQ7//////+727/8AmQ7///////////8AmQ7///////////8AmQ7/AJkO/wCZDvwAAAAAAAAAAAAAAAAAmQ7/AJkO/w2dGv8AmQ7/AJkO////////////AJkO/wCZDv//////AJkO/wCZDv8AAAAAAAAAAAAAAAAAAAAAAAAAAACZDs4AmQ7/AJkO/wCZDv8AmQ7/AJkO/wCZDv8AmQ7/AJkO/wCZDvwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACZDusAmQ7/AJkO/wCZDv8AmQ7/AJkO9QAAAAAAAAAAAAAAAAAAAAAAAAAA/D8AAPAPAADAAwAAwAMAAIABAACAAQAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAMADAADwDwAA/D8AAA==
// @grant        none
// @require      https://code.jquery.com/jquery-3.0.0.min.js
// @require      https://exam.gxpf.cn/js/jquery.cookie.js
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/512673/pufa-sulen.user.js
// @updateURL https://update.greasyfork.org/scripts/512673/pufa-sulen.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';

    // Your code here...

    var auto_dati_timer = 0; //记录定时器，便于清除
    var action_type = localStorage.getItem('action_type');
    action_type = action_type?action_type:2;//默认使用方案2答题
    var contentElement = document.createElement('div');
    contentElement.innerHTML = "<div style='position: fixed; right:10px; bottom:10px; width:220px; background-color:#000; border-radius:10px; padding:10px; opacity:1; color:#fff;text-align:center;'><p style='height:28px;border-bottom:1px solid #333;padding-bottom: 5px;'><span style='float:left'>普法助手</span><span style='float:right' id='button_item'></span></p><div id='sulen_item' style=''></div></div>";
    document.body.appendChild(contentElement);
    const login_div = document.createElement('div');
    let pufa_sulen = localStorage.getItem('pufa_sulen');
    if(check_user(pufa_sulen)){
        pufa_app();
    }else{
        login_div.innerHTML = `<div style="display:inline-block;color:#000;">
                        <input type="number" oninput="if(this.value.length > 11) this.value = this.value.slice(0, 11)" id="code" placeholder="请输入授权码" style="width: 150px;">
                        <button style="">确定</button>
                        <p id='login_msg' style="color:#f00; padding:10px;"></p>
                    </div>`;
        $('#sulen_item').html(login_div);
    }

    var code_dom = $('#code');
    code_dom.next().click(function (){
        $("#login_msg").text('');
        if(check_user(code_dom.val())){
            localStorage.setItem('pufa_sulen', code_dom.val());
            pufa_sulen = code_dom.val();
            pufa_app();
        }else{
            //code.css('background-color', '#f00');
            $("#login_msg").text('授权码出错'+code_dom.val());
        }
    });

    //要改为远程服务器验证
    function check_user(code){
        var s='100866';
        if(code==s){
            //console.log(code+'程服务器验证通过');
            return true;
        }else if(code=='10086'){
            alert('授权码已过期');
        }else{
            //
            return false;
        }
    }

    function get_user(code){
        $.ajax({
            type: 'GET',
            url: 'https://xuefu.tech/crx/api/index.php?a=check',
            data: {'code':code},
            dataType: 'json',
            async: false,
            crossDomain: true,
            success: function(res) {
                console.log(res);
                if(res.errCode==0){
                    localStorage.setItem('pufa_sulen', code);
                    localStorage.setItem('pufa_f', res.data.f);
                    pufa_app();
                }else{
                    //code.css('background-color', '#f00');
                    $("#login_msg").text('授权码出错'+code_dom.val());
                }
            },
            failure:function (result) {
               console.log('网络错误');
           },
        });
    }

    function save_exam_log(){
        let userId = JSON.parse(localStorage.getItem('examLoginUserInfo')).userId;
        var user_data=JSON.parse(localStorage.getItem(userId+'_Info'));
        $.ajax({
            type: 'GET',
            url: 'https://xuefu.tech/crx/api/index.php?a=save_exam_log',
            data: {'useinf':JSON.stringify({'name':user_data.accounts,'user_code':pufa_sulen,'unit':user_data.orgFullNames})},
            dataType: 'json',
            async: false,
            crossDomain: true,
            success: function(res) {
                console.log(res);
                if(res.errCode==0){
                    //
                }else{
                    //code.css('background-color', '#f00');
                }
            },
            failure:function (result) {
               console.log('网络错误');
           },
        });
    }

    $('#setting').click(function (){
        $("#radio1").parent().css('display', 'block');
    });

    $('#logout').click(function (){
        localStorage.setItem('pufa_sulen', '');
        localStorage.setItem('pufa_f', '');

        const login_div = document.createElement('div');
        login_div.innerHTML = `<div style="display:inline-block;color:#000;">
                        <input type="number" oninput="if(this.value.length > 11) this.value = this.value.slice(0, 11)" id="code" placeholder="请输入授权码" style="width: 150px;">
                        <button style="">确定</button>
                        <p id='login_msg' style="color:#f00; padding:10px;"></p>
                    </div>`;
        $('#sulen_item').html(login_div);
        $("#button_item").html("");

    });

    function pufa_app(){
        const setting_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAw9JREFUWEfFl8urzVEUxz/fIVJS8ogiMwYGcokSeWXiUlyvS5kbkDtxDbgDpIjyB5A3d+AxkVduyjsDAwZKKfKY6JZQJstvaf9O++6zzzm/q9O9u06d3++31trfvdZ3f/faYhjDzCYAe4CNwNzE9StwFjgmabBqWFU1dDszWw9cb+GzQdKNqnGbAggT+qoHJH0ws4fF/2XAH+BJZhL/5rbLzWxmsB1sBigLwMzmAOeA+dEkv4v0jgnPHyTNigFE4Px1bOvPr4Cdkt6moOsAhMmvZWoc+z6VtLgJgFwF3gBdKYghADKT9wE/gOPAd+B2+D2T9D4BMBtYBKwNv4lADzC+oM/BYFsHIgXwHOgIxn2SDgXybQceOw+qkCvUf4mki8Hf45QgXkhaWMapATCzFcD9dPIqE1axMbMYxEpJD9wvBrAJ8Nr76JF0okrgqjZmti+U0l2cC/0pgOnAxyhgd5nCdBIzWxVIWu4SZ/kbSfdygMzMS3gh+jZD0qchAEKtfgJjA+E6UqIFm0vA1gYrvyxpWwawE/QF4MT8JWlcjQNmNqlA7+n3nwuJj4uSujOBrErKVbA34+sZ8Ez4GCgy6CXol5ntBk4nDnXpN7Ne4HBk1wU8Cs9LI/74qwOSjsQxM2Xwz3sdQCmvjqocu+ItZ2argTu1tGVWGMoTZ2hNIVZ3S5+wNc9Ec3i23zmA0umfhudSbGb7gXJFnZJuNbBbB9wM33olHW1gVy6aqgCuAJtDsGmSvjQIPBX4HL5dlbSlXQDOAyUpp0j61iDwZMD7Ah8Xil20o10AvAk5GYLVRCQNbmaxmO2VdKoKgPiM9/R5erclJHThqREqt80yJFwdC1MzElbdhqkAdQIvwwoXROTzV3WC1Gwbjq4QJWJRRYpTQYpD1AlQKE1jKY6EYjiHkQuTH0Tzgv9rb7ti4UkW1vowShg8Ksfx6DYkoVaj15IFAN6Oxx3xyDalDUDkxKzu4EruBTmf1m15tCNaXUxaAfj/i0myffwumLuaxb1D7NKeq1kuf6E8I3s5zZx2bb+e/wXE6c3KUDnSfgAAAABJRU5ErkJggg==";
        const logout_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAxVJREFUWEe9l02ITWEYx3//DVFIrMSEfJeFomjyVVN2NEnjI6F8DKWmfCwwociCiELGhlkgCVkYGxmmRBkLZaGU8bERSWRj8zjP9J7pzLnn3nvuPTPeOt17z30+/u/7Ph//R+RcZjYGaAJagFnARGAC8BfoSzxPJD3IaRZVEzSzucBeYD0wvpp8+P87cBPoktRVSaciADM7EZyPTRnxXX8Nz8jI2WxgRBlHpyUdLAeiLAAzewYsTSi+BvxoH0l6mTZoZg7CnznALmB6Qua5pMYsEJkAzOxbuGPX+RId/XnggiTfedVlZpOBdmBnUlhSib+SF2b2AZgaFHuAHZLeVfWaIWBm6wKQ+YBvapqkP4NAJX+Y2W3AlXwdjwAfq8dxyqYHrtvsldSbtjdwAiHgDgeBTklbijrPo98PIKTaC8Cj3e+8UdKnPAaKysQALkUptTsYOyDpTFHDsb6ZeTwdBZ5KulZyBWY2DvgI+Ken2pK80Z4HpJntAS4G2UOSTg0KQjPbHOVsZ3hZsWjkcZiWMbNVXjsS79skeVr3L5nZHWBt+L1SUnc9jirphHT0DItXq6QrMQA/9gXeVKLj8bI6LCsDxFZJ1/0EPNqnAJ8lNZTzbmYbQqktCtADMl4tDsAr02jglaRFWdajQD0HtBX1nKHflxdAK3B5GAB013IFTkImFQSxPNKPy7uTmGYH8L+C0B3H9/8LWOMZ5wBuBZrlm1uc1esL7tpLfdK5m2uWdD9Ow2bgbnAyJB0wCdjMkvb9r23Jkuwn4GTTS7G3zeEoxduBqwHUPklnkwD/RzNaAXh6v5d0L32d5dpxU70sqNZ4KUdIeiQtq9VYPfKDOGGKCQ9ZQJqZX8MPSW8yryAVtUlG7G26vV52ZGYLgf0hzX8CDZJ+lwRhGlWKGddDyz2j3LE/AwNLLloeg0kxZH/tKfoYeJjFGSL5eYCPcTMAJ7T+PV43JG3KipGhGM1GATMrjGYnJR0pF6C1DKcbA2/MG+wdUfPqyJoFqsZAlodAXld7EwlzXzyeW5h6PHjfOvsFuiV5t6u6/gFVZi5Ib4A1vwAAAABJRU5ErkJggg==";
        $("#button_item").html("<a style='margin-right:20px' href='#' id='setting' title='设置'><img style='width:16px' src='"+setting_img +"'></a><a href='#' id='logout' title='退出'><img style='width:16px' src='"+logout_img +"'></a>");
        const div = document.createElement('div');

        let module = document.URL.split("/")[3].split(".")[0];
        if(module == 'exam-new'){//login grade exam-new
            let userId = JSON.parse(localStorage.getItem('examLoginUserInfo')).userId;
            var user_data=JSON.parse(localStorage.getItem(userId+'_Info'));
            div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>当前页面：${module}</p>
                        <p>${user_data.accounts}</p>
                        <p>${user_data.orgFullNames}</p>

                    </div>`;

        }else if(module=='exam-ing-new'){
            function getAnswer(subId) {
                let answers = [];
                $.ajax({
                    type: 'GET',
                    url: 'https://exam.gxpf.cn/cdndata/question_bank/options/'+ subId + ".json", //api.getCndExamAnswerUrl + subId + ".json",
                    data: {},
                    dataType: 'json',
                    async: false,
                    crossDomain: true,
                    success: function(res) {
                        answers = res.id.split("_");
                    }
                });
                return answers;
            }
            var userId=$.cookie("cookie_a_userId");
            var examid=JSON.parse(localStorage.getItem('exams'))[0].id;
            var data=JSON.parse(localStorage.getItem('exam_info_'+userId+'_'+examid)).questionDetailArr;
            var ans_array=[];

            if(action_type==1){
                var ans=['A','B','C','D','E','F','G'];
                var anstrs = '';
                for(var i=0;i<data.length;i++){
                    var astr='';
                    var ansid = getAnswer(data[i].subjectId);
                    if( Array.isArray(ansid)){
                        for(k=0;k<ansid.length;k++){
                            for(var j=0; j<data[i].itemIds.length;j++){
                                if(data[i].itemIds[j]==ansid[k]){
                                    astr+=ans[j];
                                }
                            }
                        }
                    }else{
                        for(var k=0; k<data[i].itemIds.length;k++){
                            if(data[i].itemIds[k]==ansid){
                                astr+=ans[k];
                            }
                        }
                    }
                    //console.log(i+1,astr);
                    ans_array.push(astr);
                    anstrs += String(i+1)+'.'+astr+'<br>';
                }

                //题目显示答案，每秒更新一次，即使切换下一题能更新
                setInterval(function(){var ans_index = parseInt($("#subjectName").text().split("、")[0])-1;$("#subjectType").text("答案是："+ans_array[ans_index]);},1000);

                div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>答案如下，做满5分钟以上再交卷!!!</p>
                        <p id='action_msg' style='overflow: auto; max-height:200px;text-align:left'>${anstrs}</p>

                    </div>`;

            }else if(action_type==2){
                div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>全自动选择正确答案!!!</p>
                        <p id='jindu' style="color:#090"></p>
                        <p id='action_msg' style='overflow: auto; max-height:200px;text-align:left'></p>

                </div>`;

                ans=[];
                console.log('准备开始答题…');
                $('#action_msg').append('准备开始答题…<br>');
                for(var i=0;i<data.length;i++){
                    var ansid = getAnswer(data[i].subjectId);
                    ans.push(ansid);
                }

                var shiti_index=0;
                function zuoti(){
                    if(shiti_index>=data.length){
                        clearInterval(auto_dati_timer);//清除答题定时器
                        //for (var i = 1; i < 99999; i++) window.clearInterval(i);//会把原系统倒计时清除掉，所以不用
                        //alert("全部正确答案已勾选，请手动调整低得分，建议80分左右，考满5分钟再交卷！！！");
                        $('#action_msg').append('全部正确答案已勾选，请手动调整低得分，建议80分左右，考满5分钟再交卷！！！<br>');
                        throw new Error("结束"); // 抛出异常，终止脚本
                    }
                    var nowsid = $("#nowSubjectId")[0].defaultValue;//当前试题id
                    if(nowsid == data[shiti_index].subjectId){
                        var items=$(".mydefitems");//所有选项的dom
                        for(j=0;j<items.length;j++){
                            if(ans[shiti_index].length>1){//多选题
                                for(k=0;k<ans[shiti_index].length;k++){
                                    if($(items[j]).attr('itemid') == ans[shiti_index][k]){
                                        $(items[j]).trigger('click');
                                        //setTimeout(()=>{$(items[j]).trigger('click')}, 100*k);//错开点击时间，避免连续快速点击造成的失效
                                    }else{
                                        //还没考虑试题官方无答案的情况，偶尔有
                                    }
                                }
                            }else{//单选和判断
                                if($(items[j]).attr('itemid') == ans[shiti_index][0]){
                                    $(items[j]).trigger("click");
                                }else{
                                    //还没考虑试题官方无答案的情况，偶尔有
                                }
                            }
                        }
                        setTimeout("$('#btnConfirm').trigger('click')", 800);//稍晚一点再确认本题，让选项选中状态得以显示，此处时间要确保大于选项的总点击等待时间
                        console.log("第"+(shiti_index+1)+"题已完成");
                        $('#action_msg').append("第"+(shiti_index+1)+"题已完成<br>");
                    }else{//中途续做的情况
                        $('#action_msg').append("第"+(shiti_index+1)+"题跳过<br>");
                    }
                    shiti_index++;
                    $('#jindu').text(String(shiti_index)+' / '+data.length);
                }
                auto_dati_timer = setInterval(zuoti,2000);


            }else if(action_type==3){

                div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>全自动单选全正确，多项全选，判断全“对”，手动交卷!!!</p>
                        <p id='jindu' style="color:#090"></p>
                        <p id='action_msg' style='overflow: auto; max-height:200px;text-align:left'></p>

                    </div>`;

                ans=[];
                console.log('准备开始答题…');
                $('#action_msg').append('准备开始答题…<br>');
                for(var i=0;i<data.length;i++){
                    var ansid = getAnswer(data[i].subjectId);
                    ans.push(ansid);
                }

                var shiti_index=0;
                function zuoti(){
                    if(shiti_index>=data.length){
                        clearInterval(auto_dati_timer);//清除答题定时器
                        //for (var i = 1; i < 99999; i++) window.clearInterval(i);//会把原系统倒计时清除掉，所以不用
                        $('#action_msg').append('单选全正确，多项全选，判断全“对”，请确保总答题市场5分钟以上!!!<br>');
                        $("#btnHandPaper").click();//交卷
                        throw new Error("结束"); // 抛出异常，终止脚本
                    }
                    var nowsid = $("#nowSubjectId")[0].defaultValue;//当前试题id
                    if(nowsid == data[shiti_index].subjectId){
                        var items=$(".mydefitems");//所有选项的dom
                        for(j=0;j<items.length;j++){
                            if(data[shiti_index].subjectType==2){//多选题全选
                                //setTimeout(()=>{$(items[j]).trigger('click')}, Math.random()*500*j);//错开点击时间，避免连续快速点击造成的失效
                                $(items[j]).trigger('click');
                            }else if(data[shiti_index].subjectType==3){//判断
                                if($(items[j])[0].lastChild.textContent == '正确'){
                                    $(items[j]).trigger('click');
                                }
                            }else{//单选
                                if($(items[j]).attr('itemid') == ans[shiti_index][0]){
                                    $(items[j]).trigger('click');
                                }else{
                                    //还没考虑试题官方无答案的情况，偶尔有
                                }
                            }
                        }
                        setTimeout("$('#btnConfirm').trigger('click')", (3000+Math.random()*1000));//稍晚一点再确认本题，让选项选中状态得以显示，此处时间要确保大于选项的总点击等待时间
                        console.log("第"+(shiti_index+1)+"题已完成");
                        $('#action_msg').append("第"+(shiti_index+1)+"题已完成<br>");
                    }else{//中途续做的情况
                        $('#action_msg').append("第"+(shiti_index+1)+"题跳过<br>");
                    }
                    shiti_index++;
                    $('#jindu').text(String(shiti_index)+' / '+data.length);
                }
                auto_dati_timer = setInterval(zuoti,(4000+Math.random()*1000));
            }
            if(action_type>1){//模式2/3的信息滚动，默认显示最新
                document.addEventListener('DOMSubtreeModified', function() {
                    var scrollContainer = document.getElementById('action_msg');
                    // 检查内容高度是否超过了容器高度
                    if (scrollContainer.scrollHeight > scrollContainer.offsetHeight) {
                        // 内容超过容器高度，滚动到底部
                        scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    }
                });

            }

            //交卷按钮点击事件
            $("#btnHandPaper").click(function() {
                save_exam_log();
            })


        }else if(module == 'grade'){

                div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>当前页面：${module}</p>
                        <p>已去除7天打印限制</p>
                        <p style="color:#090;">可直接打印证书</p>

                    </div>`;

            setTimeout(function(){
                var list = document.getElementById('myScoreList').children;
                for(var i=0;i<list.length;i++){
                    var button_dom = list[i].lastChild;
                    var print_button_dom = list[i].lastChild.lastChild;
                    var even_str = String(print_button_dom.onclick);
                    var func_str = String(even_str.match(/print.+\)/g));
                    //console.log(even_str);
                    //console.log(func_str);
                    if(func_str){
                        var new_month = func_str.slice(90,92)-1;
                        var my_button_str = print_button_dom.outerHTML.replace(/-\d+-/, '-'+new_month+'-');
                        //console.log(my_button_str);
                        //console.log(print_button_dom.outerHTML);
                        var parser = new DOMParser();
                        var my_print_button = parser.parseFromString(my_button_str, 'text/html').body.lastChild;
                        button_dom.appendChild(my_print_button);
                        //console.log(parser.parseFromString(my_button_str, 'text/html').body.lastChild)
                        print_button_dom.style.display = "none";
                        //print_button_dom.addEventListener('click', func_str);
                    }
                };


            }, 1000);

        }else if(module == 'exercise'){
            $("#"+currSubjectDetailAnswer).show();
            $('#'+currSubjectDetailAnswer).removeClass('d-none');
            //console.log(rndCurrBatchList[rndCurrSubIdx].detail);

            $("#btnNext").click(function(){//在下一题点击函数上增加动作
                $("#"+currSubjectDetailAnswer).show();
                $('#'+currSubjectDetailAnswer).removeClass('d-none');
            })

            div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p>当前页面：${module}</p>
                        <p></p>
                        <p style="color:#090;">已直接显示练习答案</p>

                    </div>`;

        }else{
            div.innerHTML = `<div id="setting_item"style=""></div>
                    <div style="">
                        <p style="font-size: 14px;">当前页面：${module}</p>
                        <p style="color:#090;"></p>

                    </div>`;
        }
        $('#sulen_item').html(div);

        const setting_div = document.createElement('div');
        setting_div.innerHTML = `<div style="display:none;color:#fff;text-align: left;border-bottom: 1px solid #333;padding-left:6px;margin-bottom:10px;">
                        <input type="radio" name="action_type" id="radio1" value=1><label for="radio1">方案一</label>
                        <p style="color:#999; padding-left:10px;">显示答案，手工答题和交卷。</p>
                        <input type="radio" name="action_type" id="radio2" value=2><label for="radio2">方案二</label>
                        <p style="color:#999; padding-left:10px;">自动全选正确答案，然后手工修改得分和交卷。</p>
                        <input type="radio" name="action_type" id="radio3" value=3><label for="radio3">方案三</label>
                        <p style="color:#999; padding-left:10px;">保证单选全对，多项全选，判断全“对”，时长5-10分钟，然后自动交卷。</p>
                        <button onclick="javascript:this.parentNode.style.display='none';" style="border: 0;background-color: #333;border-radius: 3px;margin: 5px 0 10px 74px;">确定</button
                    </div>`;
        $('#setting_item').html(setting_div);


        //添加radio的监听
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
            if(button.value==action_type){
                button.checked=true;
            }
            button.addEventListener('change', (event) => {
                // 在这里执行你想要的操作
                localStorage.setItem('action_type', event.target.value);
                action_type = event.target.value
                console.log(action_type); // 打印选中的值
                $("#radio1").parent().css('display', 'none');
                if(module=='exam-ing-new') location.reload();//如果是考试时，直接刷新当前页面
            });
        });

    }

    //在JavaScript中，可以使用eval()函数来将字符串转为代码并执行。
    //let functionString = 'function() { return "Hello, World!"; }';
    //let func = eval(functionString);
    //console.log(func()); // 输出: Hello, World!


    //附加页面样式
    var head = document.getElementsByTagName("head")[0];
    //<link href="https://code.jquery.com/jquery-3.0.0.min.js" rel="preload" as="script">
    var sulen_css = `
        <style type="text/css">
            .sulen{
                position: fixed;
                right:10px;
                bottom:10px;
                width:220px;
                background-color:#000;
                border-radius:10px;
                padding:10px;
                opacity:1;
                color:#fff;
                text-align:center;
                z-index: 999;
            }

            .sulen .title{
                height:28px;border-bottom:1px solid #333;padding-bottom: 5px;
            }
            .sulen .item{
                margin: 1px 0;
                border-bottom: 1px solid #555;
                padding: 10px;
            }
            .sulen .item:hover{
                color:#fff; background-color:#006;
            }
            .sulen .item .item_t1{
                color:#aaa; display:block;
            }
            .sulen .item .item_t2{
                color:#f00;font-size:13px;text-align: left;display: inline-block;width: 50px;
            }
            .sulen .item .item_t3{
                color:#555; font-size:12px;text-align: right;display: inline-block;width: calc(100% - 60px);
            }
            .sulen #total_msg{
                margin:10px 0;
            }
            .sulen #action_msg{
                margin:10px 0;
                font-size: 12px;
            }
            .sulen #data_item{
                overflow: auto; max-height:250px;text-align:left;background-color: #333; font-size: 12px;
            }
            .operate{
                margin:10px 0;
                font-size: 12px;
            }
            .operate #action_msg2{
                color:#f00;
            }

           /* 滚动条 */
            #action_msg::-webkit-scrollbar {
                width: 1px; /* 滚动条的宽度 */
            }
            #action_msg::-webkit-scrollbar-thumb {
                border-radius: 1px;
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
                background: #338fff; /* 滑块的颜色 */
            }
            #action_msg::-webkit-scrollbar-track {
                border-radius: 3px;
                background: #aaa; /* 轨道的颜色 */
            }
        </style>`;
    var sulen_script = `
        <script type="text/javascript"></script>`;
    head.innerHTML += sulen_css;
    head.innerHTML += sulen_script;


})();