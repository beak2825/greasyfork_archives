// ==UserScript==
// @name         UPC-e站通批量操作
// @namespace    http://freell.top/
// @version      1.0.2
// @description  中国石油大学（华东）e站通辅导员批量操作脚本
// @author       Freell
// @match        https://service.upc.edu.cn/v2/matter/todo?*
// @match        https://service.upc.edu.cn/v2/matter/todo
// @icon         http://www.freell.top/back/Freell_logo.png
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/433735/UPC-e%E7%AB%99%E9%80%9A%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/433735/UPC-e%E7%AB%99%E9%80%9A%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function(){
    'use strict';

    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    let start = function(){
        let btnTodo = document.querySelector('[class=todo_top_tab]');

        // 创建按钮 START
        let btn = document.createElement('li');
        btn.id = 'piliang';
        btn.innerHTML = "批量操作";
        btn.addEventListener('click', function () {
            piliang();
        });
        // 创建按钮

        // 添加按钮 START
        let parent = null;
        if (btnTodo) {
            parent = btnTodo;
            parent.insertBefore(btn, btnTodo.nextElementSibling);
        }
        // 添加按钮 END
    };

    let get_departs = async function(){
        let departs ={}
        let res = await fetch('https://service.upc.edu.cn/site/department/auth-tree')
        let json = await res.json()
        let depart_info = json["d"][0]["children"][0]["children"][2]["children"]
        for (let depart of depart_info){
            departs[depart["name"]] = depart["id"];
        }
        return departs
    }

    let get_name = async function(){
        let res = await fetch('https://service.upc.edu.cn/site/user/get-name')
        let json = await res.json()
        let oname = json["d"]["name"]
        let name = encodeURI(oname)
        return name
    }

    let get_total = async function(){
        let res = await fetch('https://service.upc.edu.cn/site/my-task/todo?p=1&page_size=1&app_id=458&keyword=&keyword_type=user&time_type=0&time_lower=&time_upper=&y=&department_id=&orderby=createdAsc')
        let json = await res.json()
        let total = json["d"]["total"]
        return total
    }

    let get_info = async function(total,departs){
        let res = await fetch('https://service.upc.edu.cn/site/my-task/todo?p=1&page_size='+total+'&app_id=458&keyword=&keyword_type=user&time_type=0&time_lower=&time_upper=&y=&department_id=&orderby=createdAsc')
        let json = await res.json()
        let tasks = json["d"]["list"]
        let task_list = []
        for (let task of tasks){
            task_list.push([task["task_id"],task["inst_id"],departs[task["inst_creator_department"]]])
        }
        return task_list
    }

    let get_task_info = async function(task_id,inst_id){
        let res = await fetch('https://service.upc.edu.cn/site/form/deal-data?task_id='+String(task_id)+'&inst_id='+String(inst_id)+'&task_sign_id=')
        let json = await res.json()
        let tinfo = json["d"]["data"]["1259"]
        return tinfo
    }

    // 同意事件
    let plagree = async function(){
        let chk_value =[];
        $('input[class="plcheck"]:checked').each(function(){
            chk_value.push('["'+String($(this).val())+'","'+String($(this).attr('depart'))+'"]');
        });
        if (chk_value.length==0){
            alert("未选择任何表单");
        } else {
            $("#popback").show();
            $("#pop").show();
            $("#popsub").attr("name","agree");
            let task_str = "["+chk_value.join(",")+"]"
            $("#popsub").val(task_str);
        }
    }

    // 驳回事件
    let plreturn = async function(){
        let chk_value =[];
        $('input[class="plcheck"]:checked').each(function(){
            chk_value.push('["'+String($(this).val())+'","'+String($(this).attr('depart'))+'"]');
        });
        if (chk_value.length==0){
            alert("未选择任何表单");
        } else {
            $("#popback").show();
            $("#pop").show();
            $("#popsub").attr("name","return");
            let task_str = "["+chk_value.join(",")+"]"
            $("#popsub").val(task_str);
        }
    }

    // 拒绝事件
    let pldisagree = async function(){
        let chk_value =[];
        $('input[class="plcheck"]:checked').each(function(){
            chk_value.push('["'+String($(this).val())+'","'+String($(this).attr('depart'))+'"]');
        });
        if (chk_value.length==0){
            alert("未选择任何表单");
        } else {
            $("#popback").show();
            $("#pop").show();
            $("#popsub").attr("name","disagree");
            let task_str = "["+chk_value.join(",")+"]"
            $("#popsub").val(task_str);
        }
    }

    let cancelpop = function(){
        $("#popback").hide();
        $("#pop").hide();
        $("#popsub").removeAttr("name");
        $("#popsub").val("");
    }

    let plpost = async function(task_id,depart,poptext,name,sta,today){
        if (sta == "return"){
            fetch('https://service.upc.edu.cn/site/task/deal',{
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "task_id="+task_id+"&form_data=%7B%221259%22%3A%7B%22User_39%22%3A%22"+name+"%22%2C%22Calendar_41%22%3A%22"+today+"T00%3A00%3A00%2B08%3A00%22%7D%7D&deal_data=%7B%22require_claim%22%3A0%2C%22comment%22%3A%22"+poptext+"%22%2C%22attachment%22%3A%5B%5D%2C%22reader%22%3A%7B%7D%2C%22operation%22%3A%7B%22name%22%3A%22%E9%A9%B3%E5%9B%9E%22%2C%22value%22%3A2%7D%2C%22deal_depart_id%22%3A"+depart+"%2C%22oversee%22%3A%22no%22%7D&deal_depart_id="+depart
            })
        } else if (sta == "disagree"){
            fetch('https://service.upc.edu.cn/site/task/deal',{
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "task_id="+task_id+"&form_data=%7B%221259%22%3A%7B%22User_39%22%3A%22"+name+"%22%2C%22Calendar_41%22%3A%22"+today+"T00%3A00%3A00%2B08%3A00%22%7D%7D&deal_data=%7B%22require_claim%22%3A0%2C%22comment%22%3A%22"+poptext+"%22%2C%22attachment%22%3A%5B%5D%2C%22reader%22%3A%7B%7D%2C%22operation%22%3A%7B%22name%22%3A%22%E7%BB%88%E6%AD%A2%22%2C%22value%22%3A0%7D%2C%22deal_depart_id%22%3A"+depart+"%2C%22oversee%22%3A%22no%22%7D&deal_depart_id="+depart
            })
        } else {
            fetch('https://service.upc.edu.cn/site/task/deal',{
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "task_id="+task_id+"&form_data=%7B%221259%22%3A%7B%22User_39%22%3A%22"+name+"%22%2C%22Calendar_41%22%3A%22"+today+"T00%3A00%3A00%2B08%3A00%22%7D%7D&deal_data=%7B%22require_claim%22%3A0%2C%22comment%22%3A%22"+poptext+"%22%2C%22attachment%22%3A%5B%5D%2C%22reader%22%3A%7B%7D%2C%22operation%22%3A%7B%22name%22%3A%22%E5%90%8C%E6%84%8F%22%2C%22value%22%3A1%7D%2C%22deal_depart_id%22%3A"+depart+"%2C%22oversee%22%3A%22no%22%7D&deal_depart_id="+depart
            })
        }
    }

    let plpostfor = async function(task_list,poptext,name,sta,today){
        for (let task of task_list){
            plpost(task[0],task[1],poptext,name,sta,today)
        }
    }

    let popsub = async function(){
        if ($("#popsub").attr("name")){
            let nday = new Date()
            let today = String(nday.getFullYear())+"-"+String(nday.getMonth()+1)+"-"+String(nday.getDate())+"T00:00:00+08:00"
            let sta = $("#popsub").attr("name")
            let task_list = eval($("#popsub").val())
            let poptext = encodeURI($("#poptext").val())
            let name = GM_getValue("name")
            let success = await plpostfor(task_list,poptext,name,sta,today)
            alert("成功")
            location.reload()
        } else {
            alert("请刷新重试")
        }
    }

    let piliang = async function(){
        // 初始化信息

        Promise.all([get_departs(),get_name(),get_total()])
            .then(res => {
            GM_setValue("name",res[1]);
            get_info(res[2],res[0])
                .then(res => {
                for (let task of res){
                    get_task_info(task[0],task[1])
                        .then(res => {
                        $("#t_end").before('<tr>'+
                                           "<td><input class='plcheck' depart='"+task[2]+"' value='"+task[0]+"' type='checkbox'>"+task[0]+"</input></td>"+
                                           "<td>"+res["User_4"]+"</td>"+
                                           "<td>"+res["User_8"]+"</td>"+
                                           "<td>"+res["User_60"]+"</td>"+
                                           "<td>"+res["Calendar_20"].slice(0,10)+"</td>"+
                                           "<td>"+res["Input_22"]+"</td>"+
                                           "<td>"+res["Input_26"]+"</td>"+
                                           "<td>"+res["Input_28"]+"</td>"+
                                           "<td>"+res["Input_30"]+"</td>"+
                                           '</tr>')
                    })
                }
            })
        })
            .catch(res => {console.log(res)})


        // 生成界面
        $("head").append("<style>"+
                         ".plbutton {background-color: #2461A2;border: none;color: white;padding: 2px 5px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;margin: 4px 2px;cursor: pointer;transition-duration: 0.4s;}"+
                         ".plbutton_big {background-color: #2461A2;border: none;color: white;padding: 5px 12px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 10px 5px;cursor: pointer;transition-duration: 0.4s;}"+
                         ".plbutton:hover {box-shadow: 0 3px 6px 0 rgba(0,0,0,0.2),0 3px 8px 0 rgba(0,0,0,0.19);}"+
                         "</style>")
        $("body").append("<div id='backg' style='display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color:white;'> </div>"+
                         "<div style='margin-bottom: 40px;transform: translate(-50%,0);width: 95%;height: auto;border-radius: 1%;background-color: rgb(247, 247, 247);position: absolute;top: 80px;left: 50%;text-align: center;box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'>"+
                         "<div style='margin-bottom: 40px;'>"+
                         "<div style='margin-top: 28px;margin-bottom: 28px;font-size: 28px;'>批量操作</div>"+
                         "<table align='center' border='1px' width='95%'>"+
                         "<tr id='t_begin'>"+
                         "<th>选择(ID)</th>"+
                         "<th>姓名</th>"+
                         "<th>学号</th>"+
                         "<th>班级</th>"+
                         "<th>请假时间</th>"+
                         "<th>原因</th>"+
                         "<th>地点</th>"+
                         "<th>紧急联系人</th>"+
                         "<th>联系人电话</th>"+
                         "</tr>"+
                         "<tr id='t_end'>"+
                         "<th><button class='plbutton' id='select_all'>全选</button> <button class='plbutton' id='delect_all'>取消全选</button></th>"+
                         "<th align='right' colspan='8'><button class='plbutton' id='plagree'>同意</button> <button class='plbutton' id='plreturn'>驳回</button> <button class='plbutton' id='pldisagree'>拒绝</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>"+
                         "</tr>"+
                         "</table>"+
                         "</div>"+
                         "</div>"+
                         "<script>"+
                         "$('#select_all').click(function(){"+
                         "$('.plcheck').each(function() {"+
                         "this.checked = true;"+
                         "});"+
                         "});"+
                         "$('#delect_all').click(function(){"+
                         "$('.plcheck').each(function() {"+
                         "this.checked = false;"+
                         "});"+
                         "});"+
                         "</script>");
        $("body").append("<div id='popback' style='display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;opacity:0;display:none; '> </div>"+
                         "<div id='pop' style='transform: translate(-50%,-50%);width: 60%;height: 60%;border-radius: 1%;background-color: #FFFFFF;position: absolute;top: 50%;left: 50%;text-align: center;box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);display:none;'>"+
                         "<div style='margin-top: 5%;font-size: 28px;font-weight: bold;'>书写意见</div>"+
                         "<textarea id='poptext' style='width: 90%;margin-top: 18px;margin-bottom: 24px; height: 60%;font-size: 20px;'></textarea>"+
                         "<div><button id='popsub' class='plbutton_big'>提交</button> <button id='cancelpop' class='plbutton_big'>取消</button></div>"+
                         "</div>")
        document.querySelector('[id=popsub]').addEventListener('click', function () {
            popsub();
        });
        document.querySelector('[id=cancelpop]').addEventListener('click', function () {
            cancelpop();
        });
        document.querySelector('[id=plagree]').addEventListener('click', function () {
            plagree();
        });
        document.querySelector('[id=plreturn]').addEventListener('click', function () {
            plreturn();
        });
        document.querySelector('[id=pldisagree]').addEventListener('click', function () {
            pldisagree();
        });
    };


    let loops = function (){
        let btnPL = document.querySelector('[id=piliang]');
        sleep(3000).then(() => {
            if (!btnPL){
                start();
            }
            loops();
        })
    }

    window.onload = function(){
        start();
        loops();
    }

})();