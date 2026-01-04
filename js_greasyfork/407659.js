// ==UserScript==
// @name         wordcreate2
// @namespace    https://greasyfork.org/zh-CN/scripts/407659-wordcreate2
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @version      1.7
// @description  新敏感词添加
// @author       zhousanfu
// @match        https://global-oss.zmqdez.com/front_end/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407659/wordcreate2.user.js
// @updateURL https://update.greasyfork.org/scripts/407659/wordcreate2.meta.js
// ==/UserScript==

function selstr(){
    let s1 = '';
    var buts = JSON.parse(localStorage.getItem('buts'));
    try {
        for(let i=0;i<buts.length;i++){
            s1 += '<option>'+ buts[i].name +'</option>';
        }
    }catch(err){
        var err = [{name:'biog_test',buts:['t1','t2']}]
        localStorage.setItem("buts",JSON.stringify(err))
    }
    return s1
}


window.onload = function(){
    //为所有的业务生成id键
    var time2 = setInterval(function(){
        if(document.getElementById("sel")){
        }
        else{
            var t = document.getElementsByTagName("td");
            var i = 1
            for (i = 0;i < t.length;i++){
                t[i].id = 't' + i;
            }
        };
    },500)

    //通道组：添加、删除、复制操作
    var time1 = setInterval(function(){
        if(document.getElementById("sel")){
        }
        else{
            var selbut = selstr();
            var butresel = document.createElement('select');
            butresel.innerHTML = selbut;
            butresel.id = 'sel'
            butresel.className = 'ant-btn';
            var form = document.querySelector("#app > section > section > section > main > div > div > div > div > div.ant-col.ant-col-15 > div:nth-child(1)");
            form.appendChild(butresel);

            var recording1 = "<slot>添加</slot>";
            var buttonRecording1 = document.createElement('button');
            buttonRecording1.innerHTML = recording1;
            buttonRecording1.id = 'but1';
            buttonRecording1.className = 'ant-btn';
            form.appendChild(buttonRecording1);

            var recording2 = "<slot>删除</slot>";
            var buttonRecording2 = document.createElement('button');
            buttonRecording2.innerHTML = recording2;
            buttonRecording2.id = 'but2';
            buttonRecording2.className = 'ant-btn';
            form.appendChild(buttonRecording2);

            var recording3 = "<slot>复制</slot>";
            var buttonRecording3 = document.createElement('button');
            buttonRecording3.innerHTML = recording3;
            buttonRecording3.id = 'but3';
            buttonRecording3.className = 'ant-btn';
            form.appendChild(buttonRecording3);


            var re1 = document.querySelector("#but1");
            re1.addEventListener("click",function(){
                var buts1 = JSON.parse(localStorage.getItem('buts'))
                var tb1 = document.getElementsByTagName("td")
                var tbs1 = []
                for(let i=0;i<tb1.length;i++){
                    if(tb1[i].firstChild.style['background-color'] == 'rgb(24, 144, 255)'){
                        tbs1.push(tb1[i].id)
                    }
                }
                var bs1_name = prompt("请为你选择的通道命名","")
                var appbut1 = {name:bs1_name,buts:tbs1}
                if(tbs1.length >= 1){
                    buts1.push(appbut1)
                    localStorage.setItem("buts",JSON.stringify(buts1))
                    location.reload();
                }else{
                    alert("没有选择业务通道")
                }
            },false);

            var re2 = document.querySelector("#but2");
            re2.addEventListener("click",function(){
                var selpath2 = document.querySelector("#sel");
                var selindex2 = selpath2.selectedIndex;
                var buts2 = JSON.parse(localStorage.getItem('buts'))
                buts2.splice(selindex2,1)
                localStorage.setItem("buts",JSON.stringify(buts2))
                location.reload();

            },false);

            var re3 = document.querySelector("#but3");
            re3.addEventListener("click",function(){
                var selpath = document.querySelector("#sel");
                var selindex = selpath.selectedIndex;
                var buts3 = JSON.parse(localStorage.getItem('buts'))
                var ts3 = buts3[selindex].buts;
                for(let i=0;i<ts3.length;i++){
                    document.querySelector("#"+ ts3[i] +" > div").click()
                }
            },false);
        }
    },1500)



    var reg_time = setInterval(function(){
        var word_text = document.querySelector("textarea").value;
        var str_array = new Array();
        str_array = word_text.split(/[(\r\n)\r\n]+/)
        //分割方法2 str_array = str.split("\n");
        console.log(str_array);

        var test_content = ["aaaa","12345678","_","abcese","你好","hello","s 123","s789"]
        var true_num = 0
        for(let x=0; x<str_array.length; x++){
            var x_re = str_array[x];
            console.log(x_re)
            var x_rep = new RegExp(x_re)
            for(let y=0; y<test_content.length; y++){
                console.log(x_re[x])
                if(x_re[x]!=null){
                    console.log(x_rep,x_rep.test(test_content[y]),test_content[y]);
                    if(x_rep.test(test_content[y])==true){
                        true_num += 1;
                    }
                }

            };
            console.log('for end', true_num)
            if(true_num > 1){
                var cf_info = confirm("敏感词拦截内容有点奇怪");
                if (cf_info == true) {
                    true_num = 0;
                } else {
                    alert(x + "敏感词拦截内容有点奇怪，检查一下吧");
                    true_num = 0;
                }
            }
        }
    },8000)



    }

