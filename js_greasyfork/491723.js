var data_objs = [];
var page = null;
var table_bq = document.getElementsByClassName("ui-jqgrid-htable ui-common-table");
var table1_bq = document.getElementById("grid_table");
var tr = table1_bq.getElementsByTagName("tr");
var tr_id;

//发送数据
var send_data = function (tag) {
    var button_json = document.getElementsByClassName("btn btn-sm btn-white btn-info");


    if (tag == 0) {
        for (tr_id = 0; tr_id < button_json.length; tr_id++) {
            button_json[tr_id].addEventListener("click", function (event) {

                var text = event.target.id;
                var parts = text.split("_");
                var status = parts[1];
                var id = parts[2];

                pass(status, id);
            })
        }
    } else if (tag == 1) {
        for (tr_id = 0; tr_id < button_json.length; tr_id++) {
            button_json[tr_id].removeEventListener("click", function (event) {
                var text = event.target.id;
                var parts = text.split("_");
                var status = parts[1];
                var id = parts[2];

                pass(status, id);
            })
        }
    }
    return "sunccess";
}

//发送请求
var pass = function (status, id) {
    var formData = new FormData();
    var add_formdata = function () {
        var xhr = new XMLHttpRequest();
        // console.log(data_objs.length)
        // console.log(data_objs)
        for (var i = 0; i < data_objs.length; i++) {
            // console.log(id)
            // console.log(data_objs[i].id)
            if (id == data_objs[i].id) {
                formData.append('id', data_objs[i].id);
                formData.append('packageName', data_objs[i].packageName);
                formData.append('appName', data_objs[i].appName);
                formData.append('appType', data_objs[i].appType);
                if (status == 1) {
                    var note = prompt("黑名单备注：");
                    formData.append('note', note);
                } else {
                    var note = prompt("白名单备注：");
                    if(note == null){
                        note = data_objs[i].note
                    }
                    formData.append('note', note);
                }
                formData.append('pool', data_objs[i].pool);
                formData.append('cardType', "不限");
                formData.append('status', 1);

                xhr.open("POST", "/mngt/rest/sys/bwlist/app/save", false);
                xhr.onreadystatechange = function () {
                    if (xhr.status === 200 && xhr.readyState === 4) {
                        var string_data = xhr.responseText;
                        console.log(string_data);

                    };

                };
                xhr.send(formData);

            }
        }
    }



    if (status == 0) {
        formData.append('bwFlag', 2);
        add_formdata();
    } else if (status == 1) {
        formData.append('bwFlag', 1);

        add_formdata();
        // console.log("不通过被点击")
    }

    //刷新当前页面,确保数据最新
    $("#grid_table").jqGrid('setGridParam', { page: page }).trigger("reloadGrid");
    setTimeout(function () {
        for (tr_id = 1; tr_id < tr.length; tr_id++) {
            var td = tr[tr_id].getElementsByTagName("td");
            td[11].textContent = null;
        }
        data_objs = []
        add_Tag();
        send_data(0);
    }, 500);


}

var kj_click = function () {
    var isClicked = false;
    var listener = document.querySelector("#grid_table_myac");
    listener.addEventListener("click", function (event) {
        var checkNums = document.querySelector("#jqgh_grid_table_checkNum");

        if (isClicked) {
            data_objs = []
            checkNums.textContent = "检测次数"
            var btns = document.getElementsByClassName("btn btn-sm btn-white btn-info");

            //移除button标签
            while (btns.length > 0) {
                btns[0].parentNode.removeChild(btns[0]);
            }
            for (tr_id = 1; tr_id < tr.length; tr_id++) {
                var td = tr[tr_id].getElementsByTagName("td");
                td[11].textContent = td[11].title;
            }
            console.log(send_data(1))
            isClicked = false;
        } else {
            for (tr_id = 1; tr_id < tr.length; tr_id++) {
                td = tr[tr_id].getElementsByTagName("td");
                td[11].textContent = null;
            }
            add_Tag();
            checkNums.textContent = "快捷处理"
            console.log(send_data(0))
            isClicked = true;
        }
    });
}

// 添加数据及按钮及改变标签
var add_Tag = function () {
    data_objs = []
    var isbutton = document.getElementsByClassName("btn btn-sm btn-white btn-info");
    if (isbutton.length == 0) {
        for (tr_id = 1; tr_id < tr.length; tr_id++) {
            var Numbers = 0;
            var data = {}
            var td = tr[tr_id].getElementsByTagName("td");
            data.id = td[1].textContent;
            data.packageName = td[2].textContent;
            data.appName = td[3].textContent;
            data.note = td[13].textContent;
            switch (td[5].textContent) {
                case "游戏":
                    data.appType = 1;
                    break;
                case "应用":
                    data.appType = 2;
                    break;
                case "辅助":
                    data.appType = 3;
                    break;
                case "工具":
                    data.appType = 4;
                    break;
                case "其他":
                    data.appType = 0;
                    break;
                default:
                    data.appType = 2;
            }
            // console.log(td[7].textContent);
            switch (td[7].textContent) {
                case "雷电-公共池":
                    data.pool = 0;
                    break;
                case "ToB池-小滴云":
                    data.pool = 10002;
                    break;
                case "通用":
                    data.pool = 10000;
                    break;
                default:
                    data.pool = 0;
            }

            // 添加对象到全局数组
            data_objs.push(data);
            // console.log(data_objs);


            var create_button = document.createElement('button');
            create_button.id = "tg_0_" + data.id
            create_button.textContent = "通过";
            create_button.className = "btn btn-sm btn-white btn-info";
            create_button.style.margin = "3px";
            create_button.style.display = "block"
            td[11].appendChild(create_button)

            var create_button1 = document.createElement('button');
            create_button1.id = "tg_1_" + data.id;
            create_button1.textContent = "不通过";
            create_button1.className = "btn btn-sm btn-white btn-info";
            create_button1.style.margin = "3px";
            create_button1.style.display = "block";
            td[11].appendChild(create_button1)
        }
    }
}

//获取当前所在页数
var get_page = function () {
    var input = document.querySelector('input.ui-pg-input[role="textbox"]');
    page = input.value;
    // console.log("当前所在页数:" + page);
}

if(window.location.href.includes("https://ldq.ldmnq.com/mngt/sys/bwlist/app/load.do?page=sys/bwlist")){
    var isFunctionExecuted = false;
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.removedNodes.length > 0) {
                for (var i = 0; i < mutation.removedNodes.length; i++) {
                    var removedNode = mutation.removedNodes[i];
                    if (removedNode.nodeName === 'TR') {
                        if (!isFunctionExecuted) {
                            show_btn();
                            isFunctionExecuted = true;
    
                        }
                    }
                }
            }
        });
        isFunctionExecuted = false
    });
    
    var config = { childList: true, subtree: true };
    
    observer.observe(table1_bq, config);
}


//显示按钮
function show_btn() {
    var isClicked = false;
    var checkNums = document.querySelector("#jqgh_grid_table_checkNum");

    if (isClicked) {
        data_objs = []
        checkNums.textContent = "检测次数"
        var btns = document.getElementsByClassName("btn btn-sm btn-white btn-info");

        //移除button标签
        while (btns.length > 0) {
            btns[0].parentNode.removeChild(btns[0]);
        }
        for (tr_id = 1; tr_id < tr.length; tr_id++) {
            var td = tr[tr_id].getElementsByTagName("td");
            td[11].textContent = td[11].title;
        }
        console.log(send_data(1))
        isClicked = false;
    } else {
        for (tr_id = 1; tr_id < tr.length; tr_id++) {
            td = tr[tr_id].getElementsByTagName("td");
            td[11].textContent = null;
        }
        if (td[6].title == "审核中") {
            add_Tag();
        }
        checkNums.textContent = "快捷处理"
        console.log(send_data(0))
        isClicked = true;
    }
}