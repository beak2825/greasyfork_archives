// ==UserScript==
// @name         飞鸟下载器网页版批量导出磁力链接
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  飞鸟下载器批量导出链接（添加在鼠标右键点击文件夹的菜单内，还有头像下面的按钮）
// @author       Toddwu404
// @match        https://web.feiniaobt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feiniaobt.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519377/%E9%A3%9E%E9%B8%9F%E4%B8%8B%E8%BD%BD%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/519377/%E9%A3%9E%E9%B8%9F%E4%B8%8B%E8%BD%BD%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

let waitForLoaded = (parentNode, checkFuntion) => {
    let option = {
        'childList': true,
        'subtree': true
    };

    let promise = new Promise((resolve, reject) => {
        let mo = new MutationObserver((mutations, obs) => {
            try {
                if (checkFuntion(mutations)) {
                    resolve(obs);
                }
            } catch (e) {
                reject(e);
            }
        })

        mo.observe(parentNode, option);
    })

    return promise;
}

function createExportButton(){
    var li = document.createElement('li');
    li.classList.add('ctx_item', 'export');

    var div = document.createElement('div');
    div.classList.add('tip');
    div.textContent = '导出文件夹内磁力链接';

    li.appendChild(div);
    return li;
}

function addExportButton(){
    let menu_node = document.querySelector("#control_magnet_file > div > div > div.modal-body > div > ul")
    let rename_dir_item = document.querySelector("#control_magnet_file > div > div > div.modal-body > div > ul > li.ctx_item.rename_dir")
    let export_btn = createExportButton();
    export_btn.onclick = ()=>{onExportButtonClick()}

    if(rename_dir_item != null){
        menu_node.insertBefore(export_btn, rename_dir_item)
    }
}

let waitForFilesLoaded = (dir_key, last_page_num, is_last_page)=>{
    let result = ""
    return new Promise((resolve, reject)=>{
        wangpan.files_data = new Proxy(wangpan.files_data, {set(obj, prop, value){
            if(prop == dir_key){
                value = new Proxy(value, {set(obj, prop, value){
                    if(prop != "length"){
                        if(value.has_origin){
                            result += `${value.url}\n`
                        }
                    }
                    if(prop == "length" && value == 40){
                        resolve(result);
                    }
                    if(prop == "length" && value == last_page_num && is_last_page){
                        resolve(result);
                    }
                    return Reflect.set(...arguments);
                }})
            }
            return Reflect.set(...arguments);
        }})
    })
}

let onExportButtonClick = async ()=>{
    createDirInfoMap();

    const selected_dir = wangpan.selected_dir;
    let final_result = ""

    if(selected_dir){
        wangpan.open_dir(selected_dir.dir_key, selected_dir.dir_name);

        const total_page = Math.trunc(DIR_INFO_MAP[selected_dir.dir_key].file_counts / 40 + 1);
        const last_page_num = DIR_INFO_MAP[selected_dir.dir_key].file_counts % 40
        let cur_page = 1;

        let waitForLoaded = (is_last_page = false)=>{
            waitForFilesLoaded(selected_dir.dir_key, last_page_num, is_last_page).then(async (result) => {
                final_result += result

                if(++cur_page <= total_page){
                    waitForLoaded(cur_page == total_page);
                    wangpan.page = cur_page.toString();
                    wangpan.get_files();
                }else{
                    await navigator.clipboard.writeText(final_result);
                    alert(`${DIR_INFO_MAP[selected_dir.dir_key].file_counts}条磁力链接已复制到剪切板`)
                }
            });
        }

        waitForLoaded(cur_page == total_page);
        wangpan.page = cur_page.toString();
        wangpan.get_files();
    }
}

let createButtonAddObserver = ()=>{
    addExportButton()
    let menu_node = document.querySelector("#control_magnet_file")

    let option = {
        'childList': true,
        'subtree': true
    };

    let mo = new MutationObserver((mutations, obs)=>{
        if(menu_node.querySelectorAll(".export").length == 0){
            addExportButton()
        }
    })

    mo.observe(menu_node, option);
}

let DIR_INFO_MAP = {}

let createDirInfoMap = ()=>{
    let dir_data_obj = wangpan.dirs_data;
    for(let datas of Object.values(dir_data_obj)){
        for(let item of datas){
            DIR_INFO_MAP[item.dir_key] = item
        }
    }

    console.log(DIR_INFO_MAP)
}

let createExportDefaultButton = ()=>{
    const buttonHtml = `<button class="btn btn-default btn-sm btn-export-default" data-toggle="tooltip" data-placement="top" data-original-title="导出离线转存的所有磁链" id="export_default"><span class="inline v-middle">导出离线转存</span></button>`
    let path_items = document.querySelector("#path_bar > div.path_items")
    if(path_items){
        path_items.style.width = "calc(100% - 420px)"
    }

    let btns = document.querySelector("#path_bar > div.file_control_btns > div")
    btns.insertAdjacentHTML("afterbegin", buttonHtml)

    let export_default_btn = document.querySelector(".btn-export-default")
    export_default_btn.onclick = ()=>{
        const dirs_data = wangpan.dirs_data
        const root_dirs = dirs_data.root
        for(let item of root_dirs){
            if(item.dir_name == "离线转存"){
                wangpan.selected_dir.dir_key = item.dir_key;
                wangpan.selected_dir.dir_name = item.dir_name;
                onExportButtonClick();
                break;
            }
        }
    }
}

async function init() {
    //确保网盘信息加载完成
    await waitForLoaded(document, ()=>wangpan);
    createDirInfoMap();

    //确保导航条加载完成
    await waitForLoaded(document, ()=>document.querySelectorAll("#path_bar > div.path_items").length > 0);
    createExportDefaultButton();

    //确保菜单元素加载完成
    await waitForLoaded(document, ()=>document.querySelectorAll("#control_magnet_file > div > div > div.modal-body > div > ul").length > 0)
    createButtonAddObserver();
}

(function() {
    'use strict';

    init()
})();