// ==UserScript==
// @name         职教云题库导出脚本
// @namespace    https://schhz.cn
// @version      0.1.9
// @description  获取职教云题库的题目
// @license      MIT
// @author       schlibra
// @match        https://spoc-exam.icve.com.cn/student/exam/examrecord_recordDetail.action*
// @match        https://course.icve.com.cn/*
// @match        https://user.icve.com.cn/*
// @require      https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @grant        GM_listValues 
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/482611/%E8%81%8C%E6%95%99%E4%BA%91%E9%A2%98%E5%BA%93%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482611/%E8%81%8C%E6%95%99%E4%BA%91%E9%A2%98%E5%BA%93%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 脚本版本
const version = GM_info.script.version;
// 定义无用关键字，从题目和答案中替换
const answerUnuseWord = ["（1 分）", "（2 分）", "（3 分）", "（4 分）", "（5 分）", "（1分）", "（2分）", "（3分）", "（4分）", "（5分）", "\n", " ", "　", decodeURI("%C2%A0")];
// 存储标记前缀
const storagePrefix = "sch_ocs_export_";
// 创建按钮
let button = document.createElement("div");
// 定义数据存储函数
function setData(key = "", value = "") {
    GM_setValue(storagePrefix + key, value);
}
function getData(key = "", defaults = "") {
    return GM_getValue(storagePrefix + key, defaults);
}
+(function () {
    'use strict';
    checkVersion();
    createButton();
})();
// 检测脚本版本更新
function checkVersion(manual=false){
    $.get("https://search.schhz.cn/version/",res=>{
        if(res.code){
            if(res.version!=version&&(res.version!=getData("ignore_update_version")||manual)){
                swal({
                    title: "检测到版本更新",
                    text: `检测到新版本：${res.version}，当前脚本版本：${version}\n版本更新日志：${res.log}`,
                    icon: "info",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: {
                        ignore: {
                            text: "忽略此版本更新",
                            value: "ignore"
                        },
                        update: {
                            text: "立即更新",
                            value: "update"
                        },
                        cancel: {
                            text: "关闭",
                            value: "cancel",
                            visible: true
                        }
                    }
                }).then(value=>{
                    switch(value){
                        case "ignore":
                            setData("ignore_update_version", res.version);
                            break;
                        case "update":
                            let link = res.url[GM_info.scriptHandler];
                            window.open(link,"_blank");
                            break;
                    }
                })
            }else{
                if(manual){
                    swal({
                        title: "已经是最新版",
                        text: "您当前安装的脚本已经是最新版本了",
                        closeOnClickOutside: false,
                        closeOnEsc: false,
                        icon: "success",
                        buttons: {
                            back: {
                                text: "返回",
                                value: "back"
                            },
                            cancel: {
                                text: "关闭",
                                value: "cancel",
                                visible: true
                            }
                        }
                    }).then(value=>{
                        if(value=="back"){
                            settingsAboutWindow();
                        }
                    })
                }
            }
        }else{
            swal({
                title: "版本检查失败",
                text: "无法从更新服务器获取到版本信息，请稍后尝试",
                icon: "error",
                buttons: ["确定", "关闭"]
            })
        }
    })
}
// 创建脚本功能按钮，显示在左上角
function createButton() {
    // 设置按钮样式
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "white";
    button.style.boxShadow = "0 0 24px -12px #3f3f3f";
    button.style.position = "fixed";
    button.style.zIndex = "9999";
    button.style.left = `${getData("posX", 100)}px`;
    button.style.top = `${getData("posY",100)}px`;
    button.style.textAlign = "center";
    button.style.lineHeight = "50px";
    button.style.color = "#3624ff";
    button.style.fontSize = "20px";
    button.style.transition = "all .5s";
    button.innerText = getData("text", "S");
    // START: 设置鼠标悬浮效果
    button.onmouseover = e => {
        button.style.backgroundColor = "#eee"
        button.style.color = "deepskyblue"
    }
    button.onmouseout = e => {
        button.style.backgroundColor = "white"
        button.style.color = "#3624ff"
    }
    // END
    // START: 设置鼠标按住效果
    button.onmousedown = e => {
        button.style.backgroundColor = "#ccc"
        button.style.color = "blue"
    }
    button.onmouseup = e => {
        button.style.backgroundColor = "white"
        button.style.color = "#3624ff"
    }
    // END
    // 绑定点击事件，展示主窗口
    button.onclick = showMain
    // 追加按钮到页面
    document.body.appendChild(button);
}
// 显示主窗口
function showMain() {
    swal({
        title: "职教云题库导出工具",
        text: "请在下方选择一个操作",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            exp: {
                text: "导出题目",
                value: "export"
            },
            settings: {
                text: "脚本设置",
                value: "settings"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value => {
        switch (value) {
            case "export":
                exportWindow();
                break;
            case "settings":
                settingsWindow();
                break;
        }
    }
    )
}
// 导出题目确认窗口
function exportWindow() {
    if(location.href.startsWith("https://spoc-exam.icve.com.cn/student/exam/examrecord_recordDetail.action")){
        let length = $(".q_content").length;
        let rightLength = $("span[name='rightAnswer']").length;
        if (length == rightLength) {
            swal({
                title: "导出确认",
                text: `这套题一共有 ${length}道题，并且有正确答案，即将导出全部题目`,
                closeOnClickOutside: false,
                closeOnEsc: false,
                buttons: {
                    confirm: {
                        text: "导出",
                        value: "confirm"
                    },
                    back: {
                        text: "返回",
                        value: "back"
                    },
                    cancel: {
                        text: "关闭",
                        value: "cancel",
                        visible: true
                    }
                }
            }).then(value => {
                if (value == "confirm") {
                    exportWindowHasAnswer(length)
                }else if(value== "back"){
                    showMain()
                }
            })
        } else {
            swal({
                title: "导出确认",
                text: `这套题一共有 ${length}道题，但是没有正确答案，即将导出您选择正确的题目`,
                closeOnClickOutside: false,
                closeOnEsc: false,
                buttons: {
                    confirm: {
                        text: "导出",
                        value: "confirm"
                    },
                    back: {
                        text: "返回",
                        value: "back"
                    },
                    cancel: {
                        text: "关闭",
                        value: "cancel",
                        visible: true
                    }
                }
            }).then(value => {
                if (value == "confirm") {
                    exportWindowNoAnswer(length)
                }else if(value == "back"){
                    showMain()
                }
            })
        }
    }else{
        swal({
            title: "无法导出",
            text: "导出题目功能只能在作业详情中使用，该页面不支持导出题目",
            closeOnClickOutside: false,
            closeOnEsc: false,
            icon: "error",
            buttons: {
                back: {
                    text: "返回",
                    value: "back"
                },
                cancel: {
                    text: "关闭",
                    value: "cancel",
                    visible: true
                }
            }
        }).then(value=>{
            if(value=="back"){
                showMain();
            }
        })
    }
}
/**
 * 删除字符串中的无用字符
 * 例如（X 分）
 */
function removeUnuseWord(text) {
    answerUnuseWord.forEach(word => {
        text = text.replaceAll(word, "")
    }
    );
    for (let i = 65; i <= 90; ++i) {
        text = text.replaceAll(`${String.fromCharCode(i)}．`, "")
    }
    return text;
}
// 导出答案（有答案）确认窗口
function exportWindowHasAnswer(length) {
    let list = [];
    let work = $("#paperTitle").text();
    for (let i = 0; i < length; ++i) {
        let title = removeUnuseWord($(".divQuestionTitle")[i].innerText.replace(`${i + 1}、`, ""))
        let answer = []
        $("span[name='rightAnswer']")[i].innerText.split("").forEach(item => {
            answer.push($(".questionOptions")[i].children[item.charCodeAt(0) - 65].innerText)
        })
        answer = removeUnuseWord(answer.join("#"));
        list.push({
            title,
            answer,
            work
        });
    }
    console.log(list)
    exportBefotrResultWindow(list);
}
// 导出答案（无答案）确认窗口
function exportWindowNoAnswer(length) {
    let list = [];
    let work = $("#paperTitle").text();
    for (let i = 0; i < length; ++i) {
        let ans_obj = $(".exam_answers_tit")[i].children;
        console.log(ans_obj[1].classList[1]);
        if (ans_obj[1].classList[1] == "icon_examright") {
            console.log(ans_obj)
            let title = removeUnuseWord($(".divQuestionTitle")[i].innerText.replace(`${i + 1}、`, ""))
            let answer = []
            ans_obj[0].innerText.split("").forEach(item => {
                answer.push($(".questionOptions")[i].children[item.charCodeAt(0) - 65].innerText)
            })
            answer = removeUnuseWord(answer.join("#"))
            list.push({
                title,
                answer,
                work
            });
        }
    }
    console.log(list);
    exportBefotrResultWindow(list);
}
/**
 * 导出前处理，用于填写课程名称
 * 因为是后期想到的功能，所以中途加入，就命名了before
 */
function exportBefotrResultWindow(list=[]){
    let content = document.createElement("div");
    content.style.textAlign="left";
    content.innerHTML = `
        <label for="${storagePrefix}course_input">课程名称： </label><input id="${storagePrefix}course_input" placeholder="课程名称" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/><br />
    `;
    swal({
        title: "输入课程名",
        text: "请输入课程名称",
        closeOnClickOutside: false,
        closeOnEsc: false,
        content,
        buttons: {
            confirm: {
                text: "确定",
                value: "confirm"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "confirm":
                let course = $(`#${storagePrefix}course_input`).val();
                for(let i=0;i<list.length;++i){
                    list[i]["course"] = course;
                }
                exportResultWindow(list);
                break;
            case "back":
                exportWindow();
                break;
        }
    })
}
// 导出答案结果窗口
function exportResultWindow(list=[]){
    let count = list.length;
    let content = document.createElement("textarea");
    content.setAttribute("rows", 10);
    content.setAttribute("cols", 50);
    let text = JSON.stringify(list);
    content.value = text;
    swal({
        title: "导出结果",
        text: `题目导出完成，共导出${count}题，结果如下`,
        content,
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            upload: {
                text: "上传",
                value: "upload"
            },
            copy: {
                text: "复制",
                value: "copy",
                closeModal: false
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "copy":
                // content.select();
                // document.execCommand("copy");
                GM_setClipboard(text, "text");
                swal.stopLoading();
                break;
            case "back":
                showMain();
                break;
            case "upload":
                uploadFunction(list);
                break;
        }
    })
}
// 上传答案到服务器
function uploadFunction(list=[]){
    let server = getData("server", "");
    let token = getData("token", "");
    if(server === ""){
        swal({
            title: "上传失败",
            text: "还没有正确配置服务器地址，暂时不能上传题目",
            icon: "error",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                settings: {
                    text: "设置服务器",
                    value: "settings"
                },
                back: {
                    text: "返回",
                    value: "back"
                },
                cancel: {
                    text: "关闭",
                    value: "cancel",
                    visible: true
                }
            }
        }).then(value=>{
            switch(value){
                case "settings":
                    settingsUploadWindow();
                    break;
                case "back":
                    showMain();
                    break;
            }
        })
    }else{
        let data = JSON.stringify(list);
        $.post(`${server}/api/?action=import&type=multi&token=${token}`,{data},res=>{
            if(res.code){
                swal({
                    title: "上传成功",
                    text: res.msg,
                    icon: "success",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["确定", "关闭"]
                })
            }else{
                swal({
                    title:"上传失败",
                    text: res.msg  ?? "服务器没有正常返回",
                    icon: "error",
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    buttons: ["确定", "取消"]
                })
            }
        })
    }
}
// 脚本设置窗口
function settingsWindow() {
    swal({
        title: "设置页面",
        text: "在这里修改你的设置",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            about: {
                text: "关于脚本",
                value: "about"
            },
            upload: {
                text: "题库上传",
                value: "upload"
            },
            logo: {
                text: "按钮设置",
                value: "logo"
            },
            backup: {
                text: "备份恢复",
                value: "backup"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                visible: true,
                text: "关闭",
                value: "cancel"
            }
        }
    }).then(value => {
        switch (value) {
            case "about":
                settingsAboutWindow();
                break;
            case "upload":
                settingsUploadWindow();
                break;
            case "logo":
                settingsLogoWindow();
                break;
            case "back":
                showMain();
                break;
            case "backup":
                settingBackupWindow();
                break;
        }
    })
}
// 脚本备份与恢复设置页面
function settingBackupWindow(){
    swal({
        title: "备份与恢复",
        text: "备份或恢复该脚本的配置信息",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            backup: {
                text: "备份",
                value: "backup"
            },
            restore: {
                text: "恢复",
                value: "restore"
            },
            reset: {
                text: "重置",
                value: "reset"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "backup":
                backupData();
                break;
            case "restore":
                restoreData();
                break;
            case "reset":
                resetData();
                break;
            case "back":
                settingsWindow();
                break;
        }
    })
}
// 备份数据执行
function backupData(){
    let keys = GM_listValues();
    let data = {};
    keys.forEach(key=>{
        let value = GM_getValue(key);
        data[key] = value;
    })
    data = JSON.stringify(data);
    let content = document.createElement("div");
    content.innerHTML = `
        <textarea cols="30" rows="10">${data}</textarea>
    `;
    swal({
        title: "导出备份",
        text: "下面是该脚本的配置备份数据，请选择对应的操作",
        icon: "info",
        closeOnClickOutside: false,
        closeOnEsc: false,
        content,
        buttons: {
            copy: {
                text: "复制",
                value: "copy",
                closeModal: false
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "copy":
                GM_setClipboard(data, "text");
                swal.stopLoading();
                break;
            case "back":
                settingBackupWindow();
                break;
        }
    })
}
// 恢复数据输入框
function restoreData(){
    let content = document.createElement("div");
    content.innerHTML = `
        <textarea id="backupImportText" cols="30" rows="10"></textarea>
    `;
    swal({
        title: "导入备份",
        text: "导入数据以还原配置数据",
        content,
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            confirm: {
                text: "确定",
                value: "confirm"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel"
            }
        }
    }).then(value=>{
        switch(value){
            case "confirm":
                restoreImportData();
                break;
            case "back":
                settingBackupWindow();
                break;
        }
    })
}
// 导入数据后的提示窗口
function restoreImportData(){
    let text = $("#backupImportText").val();
    try{
        let data = Object.entries(JSON.parse(text));
        let count = 0;
        data.forEach(item=>{
            GM_setValue(item[0], item[1]);
            count+=1;
        })
        swal({
            title: "导入完成",
            text: `共导入${count}条数据`,
            icon: "success",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                back: {
                    text: "返回",
                    value: "back"
                },
                cancel: {
                    text: "关闭",
                    value: "cancel",
                    visible: true
                }
            }
        }).then(value=>{
            if(value=="back"){
                settingBackupWindow();
            }
        })
    }catch(e){
        swal({
            title: "导入失败",
            text: "数据格式有误",
            icon: "error",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                back: {
                    text: "返回",
                    value: "back"
                },
                cancel: {
                    text: "关闭",
                    value: "cancel",
                    visible: true
                }
                
            }
        }).then(value=>{
            if(value=="back"){
                restoreData();
            }
        })
    }
}
// 重置脚本数据
function resetData(){
    swal({
        title: "重置数据",
        text: "是否要重置脚本全部数据？该操作不可逆",
        icon: "info",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            confirm: {
                text: "确定",
                value: "confirm"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "confirm":
                doResetData();
                break;
            case "back":
                settingBackupWindow();
                break;
        }
    })
}
// 执行重置数据
function doResetData(){
    let count = 0;
    GM_listValues().forEach(key=>{
        GM_deleteValue(key)
        count+=1
    });
    swal({
        title: "重置成功",
        text: `已重置脚本所有数据，共删除了${count}条数据`,
        icon: "success",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            confirm: {
                text: "确定并刷新",
                value: "confirm"
            }
        }
    }).then(value=>{
        if(value=="confirm"){
            location.reload();
        }
    })
}
// 设置页面关于脚本窗口
function settingsAboutWindow() {
    swal({
        title: "关于脚本",
        text: `职教云题库导出脚本，用于一键将职教云题目导出，同时支持自建题库，并一键上传至自建题库中\n脚本版本：${version}\n脚本引擎：${GM_info.scriptHandler}`,
        icon: "info",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            check: {
                text: "检查更新",
                value: "check"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "back":
                settingsWindow();
                break;
            case "check":
                checkVersion(true);
                break;
        }
    })
}
// 设置上传服务器窗口
function settingsUploadWindow() {
    let server = getData("server", "");
    let token = getData("token","");
    let content = document.createElement("div");
    content.style.textAlign="left"
    content.innerHTML = `
        <label for="${storagePrefix}server_input">服务器地址： </label><input id="${storagePrefix}server_input" value="${server}" placeholder="https://example.com" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/><br />
        <p>token用于在调用上传接口时鉴权使用，如果自己实现了接口但是没有使用到token，可以不填写这个值</p>
        <label for="${storagePrefix}server_input">认证token： </label><input id="${storagePrefix}token_input" value="${token}" placeholder="token" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/>
    `;
    swal({
        title: "设置上传服务器",
        text: "设置题库上传服务器，将导出的题库一键上传到题库服务器中，在下面填写服务器地址，开头需要加协议名，链接结尾不需要加斜杠",
        content,
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            confirm: {
                text:"确定",
                value: "confirm"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value=>{
        switch(value){
            case "confirm":
                setData("token", $(`#${storagePrefix}token_input`).val());
                settingServer($(`#${storagePrefix}server_input`).val());
                break;
            case "back":
                settingsWindow();
                break;
        }
    })
}
// 设置服务器窗口
function settingServer(server=""){
    if(server.startsWith("https://") && (! server.endsWith("/"))){
        $.get(`${server}/status/`, data=>{
            if(data.code){
                setData("server", server);
                swal({
                    title: "设置成功",
                    text: `服务器设置成功，服务器返回消息：${data.msg}`,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: {
                        back: {
                            text: "返回",
                            value: "back"
                        },
                        cancel: {
                            text: "关闭",
                            visible: true,
                            value: "cancel"
                        }
                    }
                }).then(value=>{
                    if(value=="cancel"){
                        settingsWindow()
                    }
                })
            }else{
                swal({
                    title: "错误提示",
                    text: "服务器没有正常返回结果，您是否要继续设置该地址？",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: {
                        confirm: {
                            text: "确定",
                            value: "confirm"
                        },
                        back: {
                            text: "返回",
                            value: "back"
                        },
                        cancel: {
                            text: "关闭",
                            visible: true,
                            value: "cancel"
                        }
                    }
                }).then(value=>{
                    if(value=="confirm"){
                        setData("server", server)
                    }else if(value=="back"){
                        settingsUploadWindow()
                    }
                })
            }
        })
    }else{
        swal({
            title: "错误提示",
            text: "您设置的服务器地址不符合要求，请重新设置",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                back: {
                    text:"返回",
                    value: "back"
                },
                cancel: {
                    text: "关闭",
                    value: "cancel",
                    visible: true
                }
            }
        }).then(value=>{
            if(value=="back"){
                settingsUploadWindow();
            }
        })
    }
}
// 按钮设置
function settingsLogoWindow() {
    let text = getData("text", "S");
    let posX = getData("posX", 100);
    let posY = getData("posY", 100)
    let dom = document.createElement("div");
    dom.innerHTML = `
        <label for="${storagePrefix}text_input">&nbsp;&nbsp;按钮文本： </label><input id="${storagePrefix}text_input" value="${text}" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/><br />
        <label for="${storagePrefix}posX_input">按钮X坐标： </label><input id="${storagePrefix}posX_input" value="${posX}" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/><br />
        <label for="${storagePrefix}posY_input">按钮Y坐标： </label><input id="${storagePrefix}posY_input" value="${posY}" style="border: 1px solid #ccc;margin-left: 5px;padding: 3px;"/>
    `;
    swal({
        title: "按钮设置",
        text: "修改按钮文字和位置",
        content: dom,
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            confirm: {
                text: "确定",
                value: "confirm"
            },
            back: {
                text: "返回",
                value: "back"
            },
            cancel: {
                text: "关闭",
                value: "cancel",
                visible: true
            }
        }
    }).then(value => {
        if (value == "confirm") {
            setData("text", $(`#${storagePrefix}text_input`).val());
            setData("posX", $(`#${storagePrefix}posX_input`).val());
            setData("posY", $(`#${storagePrefix}posY_input`).val());
            button.innerText = getData("text");
            button.style.left = getData("posX")+"px";
            button.style.top = getData("posY")+"px";
        }else if(value == "back"){
            settingsWindow()
        }
    })
}