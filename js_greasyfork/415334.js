// ==UserScript==
// @name         Steam创意工坊饥荒mod下载工具
// @namespace      https://greasyfork.org/users/3128
// @version      1.9.4
// @description    在创意工坊中注入一个MOD下载按钮，用于下载MOD
// @author       极品小猫
// @include      https://steamcommunity.com/sharedfiles/filedetails/*
// @include      https://steamcommunity.com/id/*/myworkshopfiles/*
// @include      https://steamcommunity.com/id/*/myworkshopfiles?*
// @match        https://t.vvwall.com/*
// @connect       5.5w.pw
// @connect       steamworkshopdownloader.io
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415334/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E9%A5%A5%E8%8D%92mod%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/415334/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E9%A5%A5%E8%8D%92mod%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let webHost=location.host, webPath=location.pathname;

    if(webHost=='steamcommunity.com') {
        let modDownloadStart, HostID=[3,2,1]; //mod 下载开始标记，防止重复请求下载
        if(webPath.search('myworkshopfiles')>-1) {
            GM_addStyle(`.download_Mod, .general_btn {text-align:center;}`)
            document.querySelectorAll('[id^="Subscription"]').forEach(function(e, i){
                console.log(i, e, e.id);
                let mid=e.id.replace(/^[^\d]+/i,''),
                    actionsCtn=e.querySelector('.actionsCtn');

                let down_A=document.createElement('a');
                down_A.className="download_Mod";
                down_A.target='_blank';
                down_A.textContent='下载 MOD';

                let down_span=document.createElement('span');
                down_span.className='general_btn';
                down_span.style.width='70px';
                down_span.appendChild(down_A);

                actionsCtn.appendChild(down_span);

                down_A.addEventListener('click', function(){
                    ModDownloadAjax(mid);
                    jQuery(this).html('<img src="https://community.cloudflare.steamstatic.com/public/images/login/throbber.gif" style="height:20px;vertical-align:middle;">');
                });
            });
        } else { //workshop详细页
            let down_A=document.createElement('a');
            //down_A.href="https://t.vvwall.com/#"+publishedfileid;
            down_A.id="download_Mod";
            down_A.target='_blank';
            down_A.textContent='下载 MOD';
            let down_span=document.createElement('span');
            down_span.className='general_btn share tooltip';
            down_span.id="download_ModBtn"
            down_span.appendChild(down_A);
            GM_addStyle('#download_Mod {line-height:30px;}')

            document.querySelector('#ItemControls').appendChild(down_span);
            let modTags=document.querySelector('span.workshopTagsTitle~a[href*="version"]');
            let modVersion=modTags?modTags.textContent.trim().replace('version:','v'):'';
            document.querySelector('#download_ModBtn').addEventListener('click', function(e){
                if(modDownloadStart) return false;
                ModDownloadAjax(publishedfileid, modVersion);
                jQuery(this).html('<img src="https://community.cloudflare.steamstatic.com/public/images/login/throbber.gif" style="height:20px;vertical-align:middle;">');
                //jQuery('<img src="https://community.cloudflare.steamstatic.com/public/images/login/throbber.gif" style="height:20px;vertical-align:middle;">').appendTo(this);
                //jQuery(this).replaceWith('<img src="https://community.cloudflare.steamstatic.com/public/images/login/throbber.gif" style="height:20px;vertical-align:middle;">');
            });
        }
        /*
        let down_A=$('<a>').text('下载MOD'),
            downBtn=$('<span class="general_btn report tooltip" data-tooltip-text="下载MOD">').append(down_A);
*/
        function ModDownloadAjax(mid, target){
            modDownloadStart=true; //标记 mod 下载线程已开始
            mid=Number(mid);
            let _HostID = HostID.shift();
            console.log(mid, [mid], JSON.stringify(mid), _HostID);

            GM_xmlhttpRequest({
                url:'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/details/file',
                method: 'post',
                timeout : 5000,
                data: JSON.stringify([mid]),
                responseType : 'json',
                headers : {
                    'content-type' : 'application/x-www-form-urlencoded',
                },
                onTimeout : function(e){
                    console.log(e);
                    modDownloadStart=false;
                    jQuery('#download_ModBtn').html('请求超时，请重试');
                },
                abort : function(e){
                    console.log('请求已取消')
                },
                onload: function(e){
                    console.log(e, e.response);
                    let modData, downloadTitle;
                    switch(e.status) {
                        case 200:
                            modData=e.response[0];
                            modData.tags.forEach(function(item){
                                if(/version:/i.test(item.tag)) {
                                    let modVersion=item.tag.trim().replace('version:','v');
                                    downloadTitle="[workshop-"+mid+"]"+modData.title+(modVersion?" "+modVersion:"")+".zip";
                                }
                            });

                            if(!modData.file_url) {
                                GM_xmlhttpRequest({
                                    url:'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/download/request',
                                    method: 'post',
                                    data : JSON.stringify({"publishedFileId": mid,"collectionId":null,"extract":true,"hidden":false,"direct":false,"autodownload":true}),
                                    responseType : 'json',
                                    headers : {
                                        'content-type' : 'application/x-www-form-urlencoded',
                                    },
                                    onload: function(re){
                                        console.log(re, re.response, 'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/download/transmit?uuid='+re.response.uuid);

                                        GM_xmlhttpRequest({
                                            url : 'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/download/status',
                                            method: 'post',
                                            data : JSON.stringify({"uuids": re.response.uuid}),
                                            responseType : 'json',
                                            headers : {
                                                'content-type' : 'application/x-www-form-urlencoded',
                                            },
                                            onload: function(se){
                                                console.log(se);
                                                GM_xmlhttpRequest({
                                                    url:'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/download/transmit?uuid='+re.response.uuid,
                                                    method: 'get',
                                                    headers : {
                                                        'content-type' : 'application/x-www-form-urlencoded',
                                                    },
                                                    onload : function(de){
                                                        console.log('下载开始', de);
                                                        GM_download({
                                                            url: 'https://backend-0'+_HostID + '-prd.steamworkshopdownloader.io/api/download/transmit?uuid='+re.response.uuid,
                                                            name: downloadTitle,
                                                            saveAs : true,
                                                        });
                                                    }
                                                });
                                                jQuery('#download_ModBtn').html('MOD 请求成功');
                                            }
                                        })
                                    }
                                });
                            } else {
                                //直链下载
                                modData.tags.forEach(function(item){
                                    if(/version:/i.test(item.tag)) {
                                        let modVersion=item.tag.trim().replace('version:','v');
                                        downloadTitle="[workshop-"+mid+"]"+modData.title+(modVersion?" "+modVersion:"")+".zip";
                                    }
                                });

                                GM_download({
                                    url: modData.file_url,
                                    name: downloadTitle,
                                    saveAs : true,
                                });
                                jQuery(target).html('直链MOD 请求成功');
                            }

                            break;
                        default :
                            jQuery('#download_ModBtn').text('请求失败 ' + e.status);
                    }
                    /*
                    let data=e.response, downloadTitle="[workshop-"+mid+"]"+data.title+(modVersion?" "+modVersion:"")+".zip";
                    GM_download({
                        url: data.url,
                        name: downloadTitle,
                        saveAs : true,
                    });
                    */
                },
                onerror: function(e){
                    console.error('error', e);
                }
            });

            /* API 已失效
            GM_xmlhttpRequest({
                url:'https://5.5w.pw/api?mid='+mid,
                method: 'get',
                responseType : 'json',
                onload: function(e){
                    console.log(e);
                    let data=e.response, downloadTitle="[workshop-"+mid+"]"+data.title+(modVersion?" "+modVersion:"")+".zip";
                    GM_download({
                        url: data.url,
                        name: downloadTitle,
                        saveAs : true,
                    });
                },
                onerror: function(e){
                    console.error('error', e);
                }
            });

            */
        }
    } else if(webHost=='t.vvwall.com') {
        GM_addStyle(`
input[name="mid"]{
padding: 0 10px;
}
`);
        $('button.starts').click(function(){
            addMObserver('#des', function(){
                console.log($('code#des').text());
                $('code#des').html(markdown.toHTML($('code#des').text()));
            });
        });
        let workshop_A=$('<a id="workshop">').text('创意工坊');
        let dlbtn=$('#dlbtn').removeAttr('onclick target').click(function(e){
            let inputText=$('input[name="mid"]').val().trim(),
                id=getUrlParam('id', inputText, inputText),
                modTitle=$('#modtitle').text().trim(),
                downloadTitle="[workshop-"+id+"]"+modTitle+".zip";
            workshop_A.attr({'href':'https://steamcommunity.com/sharedfiles/filedetails/?id='+id});

            GM_download({
                url: e.href,
                name: downloadTitle,
                saveAs : true,
            });
            e.preventDefault(); //阻止默认动作
            e.stopPropagation(); //阻止冒泡
        });
        $('.downloadbox').prepend(dlbtn);
        dlbtn.after(workshop_A);
    }

        if(location.hash) {
            $('input[name="mid"]').val(location.hash.replace('#',''));
            $('button.starts').click();
        }
    // Your code here...
    function addMObserver(selector, callback, Kill, option) {
        var watch = document.querySelector(selector);

        if (!watch) {
            return;
        }
        console.warn('watch:', watch, selector);
        var observer = new MutationObserver(function(mutations){
            console.log('mutations:', mutations);
            var nodeAdded = mutations.some(function(x){
                console.log(x);
                return x.addedNodes.length > 0;
            });
            console.log(nodeAdded);
            if (nodeAdded) {
                console.log(mutations, observer);
                callback(mutations, observer);
                if(Kill) {
                    console.log('停止'+selector+'的监控');
                    observer.disconnect();
                }
            }
        });
        observer.observe(watch, option||{childList: true, subtree: true});//
    }

    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

        console.log(str, option);

        if (str !== null) {
            switch(option) {
                case 0:
                    return unescape(str[0]);		//所筛选的完整参数串
                case 1:
                    return unescape(str[1]);		//所筛选的参数名
                case 2:
                    return unescape(str[2]);		//所筛选的参数值
                case 'new':
                    return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
                default:
                    return unescape(str[2]);        //默认返回参数值
            }
        } else if(!str && option) {
            return option;
        } else {
            return null;
        }
    }
})();