// ==UserScript==
// @name         ND_ERP_Help
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       99U_199505_738746223@qq.com
// @match        http://ioa.99.com/Main_Default.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412135/ND_ERP_Help.user.js
// @updateURL https://update.greasyfork.org/scripts/412135/ND_ERP_Help.meta.js
// ==/UserScript==


window.NDhelp_set_TaskInfoStr = function (id_code)
{

    if (id_code != null){
            var temp_id_code;
            try{
                temp_id_code = window.parent.Nd.Hr.Webs.Ajax.A0_frmAjaxOrder.getTaskInfoStr(id_code,"order/", 890).value;
            }catch(err){
                return "Null";
            }
            //日志填写时数
            var task_logs_time = "0";
            //单据预估时数
            var task_side_time = "0";
            //单据剩余时数
            var task_surplus_time = 0;
            //创建临时对象
            var wrapper= document.createElement('div');
            wrapper.innerHTML = temp_id_code[0];
            if (wrapper.children.length == 4)
            {
            	var task_side_item = wrapper.getElementsByClassName("task-side-item");
            	if (task_side_item.length == 4)
            	{
            		var task_side_item_conntent;
            		var task_logs_item_conntent;
            		task_side_item_conntent = task_side_item[2].children[1].getElementsByClassName("cell-list-content");
            		task_side_time = task_side_item_conntent[0].innerText;

            		//有填日志的情况
            		if (task_side_item[2].children.length == 3){
            			task_logs_item_conntent = task_side_item[2].children[0].getElementsByClassName("cell-list-content");
            			task_logs_time = task_logs_item_conntent[0].innerText;
            		}
            		//没填日志的情况
            		if (task_side_item[2].children.length == 2){
            			task_logs_time = "0"
            		}
            		//计算剩余时数
            		task_surplus_time = parseFloat(task_side_time) - parseFloat(task_logs_time);
            		var result1 = "分配预估时数: " + task_side_time +"   日志时数: " + task_logs_time + "   剩余时数：" + task_surplus_time.toString();
            		return result1;
            	}else{
            		wrapper = null;
            		return "Null";
            	}

            }else{
            	console.log("单据信息错误 ->" + id_code);
            	return "Null";
            }
        }
}
window.NDhelp_hello_button =function (str)
{
        var button = document.createElement("input"); //创建一个input对象（提示框按钮）
        button.setAttribute("type", "button");
        button.setAttribute("value", str);
        button.setAttribute("class", "ND_help_hello_buuton");
        button.style.width = "95%";
        button.style.align = "center";
        return button;
}
window.NDhelp_taskLogs = function ()
{
    var obj = window.parent[1];
    if (obj != null)
    {
        var work_item = obj.document.getElementsByClassName("work-affair-item-wrapper");
        for(var p=0;p<work_item.length;p++)
        {
            var the_node = work_item[p];
            if (the_node.children.length > 4){
                console.log("日志重复");
                break;
            }
            var id_string = the_node.getAttribute("data-reactid").split("$");
            var code_id =id_string[1].substr(0,id_string[1].length - 1);
            var temp_string  = window.NDhelp_set_TaskInfoStr(code_id);
            the_node.appendChild(window.NDhelp_hello_button(temp_string));
        }
    }else{
        console.log("日志 -> 不支持此页面");
    }
    obj = window.parent[1];
    if (obj != null)
    {
        var mod_con = obj.document.getElementsByClassName("mod_con");
        for(var i=0;i<mod_con.length;i++)
        {
            var element = mod_con[i];
            var width_click = element.querySelector("div.cm_qp.right > div.mod_con > table > tbody > tr > td:nth-child(2)");
            if (width_click == null){continue}else{
                //如果单据超时，也会是2
            	if (width_click.children.length > 1){
                    if(width_click.children[0].innerText != "已超时")
                    {
                        console.log("任务页面 重复");break//console.log("单据超时");
                    }
                }
                if (width_click.children.length > 2 ){
                    console.log("任务页面 重复");break
                }
            }
            var tbTask_id = width_click.getAttribute("onclick");
            //onclick="getTaskInfo(12787838)" 提取单据 ID
            var tbTask_id_num = tbTask_id.substring(12,tbTask_id.length - 1)
            if (tbTask_id_num != null) {
                //var temp_id_code = Nd.Hr.Webs.Ajax.A0_frmAjaxOrder.getTaskInfoStr(tbTask_id_num,"order/", 890).value;
                var temp_id_code = window.NDhelp_set_TaskInfoStr(tbTask_id_num);
                width_click.appendChild(window.NDhelp_hello_button(temp_id_code));
            }
        }
    }else{
        console.log("任务 -> 不支持此页面");
    }
}

    var work_div = document.getElementsByClassName("aspNetHidden");
    if (work_div != null){
        var button = window.NDhelp_hello_button("点击 显示单据时数") //document.createElement("input");
        //button.setAttribute("type", "button");
        //button.setAttribute("value", "点击 显示单据时数");
        //button.setAttribute("class", "ND_help_hello_buuton");
        button.style.width = "100%";
        button.style.height = "30px";
        button.style.align = "center";
        button.setAttribute("onclick","window.NDhelp_taskLogs()");
        button.style.background = "#66CDAA";
        button.style.color = "white";
        work_div[0].appendChild(button);

    }

    //setTimeout(function(){ window.NDhelp_taskLogs() }, 2500);

