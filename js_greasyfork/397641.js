// ==UserScript==
// @name         课程资源助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量下载选中的课程资源
// @author       零度
// @match        *://course.ucas.ac.cn/portal/site/*/tool/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397641/%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397641/%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div_button = document.getElementsByClassName('col-lg-6 col-md-8 col-sm-8 col-xs-12 btn-group btn-group-sm')[0];
    if(div_button){
        var download_btn = document.createElement("input");
        download_btn.setAttribute('style', 'margin:0;margin-left:20px;');
        download_btn.setAttribute('type', 'button');
        download_btn.setAttribute('value', '下载');
        download_btn.setAttribute('class', 'btn btn-default');
        download_btn.setAttribute('id', 'download-button');
        download_btn.setAttribute('onclick', 'portal.download_selected_files();');
        div_button.append(download_btn)
        portal.download_selected_files = function download_selected_files(){
            var elements = document.getElementsByName('selectedMembers');
            var download_folder_warning_showed = false;
            var download_urls = new Array();
            if(elements)
			{
                var download_urls_amount = 0;
				for(var i = 0; i < elements.length; i++)
				{
					if(elements[i].checked){
                        if(elements[i].value.charAt(elements[i].value.length-1)=='/'){
                            if(!download_folder_warning_showed){
                                download_folder_warning_showed = true;
                                alert('暂不支持下载文件夹，将忽略选中的文件夹');
                            }
                        }
                        else{
                            download_urls[download_urls_amount] = 'https://course.ucas.ac.cn/access/content'+elements[i].value;
                            download_urls_amount = download_urls_amount+1;
                        }
                    }
				}
                var content = "file content!";
                var data = new Blob([content], {
                    type: "text/plain;charset=UTF-8"
                });
                var anchor = document.createElement("a");
                for(i = 0;i < download_urls.length; i++){
                    anchor.href = download_urls[i];
                    anchor.download = download_urls[i].match(/(?<=group\/.*\/).*$/)[0];
                    anchor.click();
                    window.URL.revokeObjectURL(data);
                }
			}
        }
    }
})();