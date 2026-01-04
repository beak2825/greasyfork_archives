// ==UserScript==
// @name         Elearning Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  download elearning files easier
// @author       Char不多得了
// @match        https://elearning.fudan.edu.cn/courses/*/files/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fudan.edu.cn
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/451370/Elearning%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451370/Elearning%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var course_id = /\d+/.exec(window.location.href)[0];

    // 适配不同版本的GM函数
    var _GM_registerMenuCommand;
    if(typeof GM_registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM_registerMenuCommand;
    }else if(typeof GM!='undefined' && typeof GM.registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM.registerMenuCommand;
    }
    if(typeof _GM_registerMenuCommand=='undefined')_GM_registerMenuCommand=(s,f)=>{};

    function getXHR(method,url,respType){
        let xhr = new XMLHttpRequest();
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01');
        xhr.setRequestHeader('Accept-Encoding','gzip, deflate, br');
        xhr.setRequestHeader('Accept-Language','zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2');
        xhr.setRequestHeader('Connection','keep-alive');
        xhr.setRequestHeader('DNT','1');
        xhr.setRequestHeader('Sec-Fetch-Dest','empty');
        xhr.setRequestHeader('Sec-Fetch-Mode','cors');
        xhr.setRequestHeader('Sec-Fetch-Site','same-origin');
        xhr.setRequestHeader('TE','trailers');
        xhr.withCredentials = true;
        xhr.responseType = respType;

        xhr.open(method,url)

        return xhr;
    }
    function getFolderid(course_id,callback){
        //此处回调为获得了root文件夹之后的处理函数
        //获得folderid后自动下载
        console.log("getFolderid")

        if(course_id == null){
            console.log("course_id 为null")
            return;
        }

        let folderidXHR = getXHR("get","https://elearning.fudan.edu.cn/api/v1/courses/"+course_id+"/folders/by_path/","json");
        folderidXHR.send()

        folderidXHR.onload = function() {
            if(folderidXHR.status=="304"||folderidXHR.status=="200"){
                let folderid = folderidXHR.response[0].id;
                // console.log(folderid);//debug
                if(callback) callback(folderid)
            }

        };
    }

    function getSubfolderidList(folderid,callback){
        // 获得subfolderList之后自动对每个folder发请求
        console.log("getSubfolderList")

        if(folderid == null){
            console.log("folderid 为null")
            return;
        }
        let subFolderidXHR = getXHR("GET","https://elearning.fudan.edu.cn/api/v1/folders/"+folderid+"/folders","json")
        let params = { // 此处的参数并没有真的传过去，但是居然也拿到数据了，离谱 todo
			"include[]": [
				"user",
				"usage_rights",
				"enhanced_preview_url",
				"context_asset_string"
			],
			"per_page": "20",
			"sort": "",
			"order": ""
		}
        subFolderidXHR.send(JSON.stringify(params))

        subFolderidXHR.onload = function() {
            if(subFolderidXHR.status=="304"||subFolderidXHR.status=="200"){
                let subFolderList = subFolderidXHR.response;
                for(let i in subFolderList){
                    if(callback) callback(subFolderList[i].id)
                }
            }
        };
    }
    function getFileidList(folderid,callback){
        // 获得fileList自动下载
        console.log("getFileList")
        if(folderid == null){
            console.log("folderid 为null")
            return;
        }
        let fileidXHR = getXHR("GET","https://elearning.fudan.edu.cn/api/v1/folders/"+folderid+"/files","json")
        let params = {
			"include[]": [
				"user",
				"usage_rights",
				"enhanced_preview_url",
				"context_asset_string"
			],
			"per_page": "20",
			"sort": "",
			"order": ""
		}
        fileidXHR.send(JSON.stringify(params))

        let fileidList = [];
        fileidXHR.onload = function() {
            if(fileidXHR.status=="304"||fileidXHR.status=="200"){
                let fileList = fileidXHR.response;
                for(let i in fileList){
                    fileidList.push(fileList[i].id)
                }
                // console.log(fileidList)//debug
                if(callback) callback(fileidList)
            }
        };
    }

    function getFilesOnPage(){
        let file_elem = document.getElementsByClassName("ef-name-col__link");
        if(file_elem==null||file_elem.length===0){
            console.log("当前页面未找到文件")
            return;
        }
        let fileidList = []

        for(let i=0;i<file_elem.length;i++){
            fileidList.push(/\d+/.exec(file_elem.item(i).href)[0])
        }
        return fileidList;
    }

    function downloadList(fileidList){
        let file_url_list = []

        for(let i=0;i<fileidList.length;i++){
            file_url_list.push("https://elearning.fudan.edu.cn/courses/"+course_id+"/files/"+ fileidList[i]+ "/download?download_frd=1")
        }

        for(let url in file_url_list){
            // 根据链接下载
            const a = document.createElement('a');
            a.setAttribute('href', file_url_list[url]);
            a.setAttribute('download', "");
            a.click();
        }
    }

    function downloadFolder(folderid){
        getFileidList(folderid,downloadList)
        getSubfolderidList(folderid,downloadFolder)
    }
    function downloadPage(){
        downloadList(getFilesOnPage())
    }
    function downloadAll(){
        getFolderid(course_id,downloadFolder)
    }

    _GM_registerMenuCommand("download the page",downloadPage);
    _GM_registerMenuCommand("download All",downloadAll);
})();