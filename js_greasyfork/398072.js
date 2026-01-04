// ==UserScript==
// @name         Yinr's Vol.moe Helper
// @namespace    https://yinr.cc/
// @version      1.5
// @description  Yinr's Vol.moe Helper Script
// @author       Yinr
// @iconURL      https://vol.moe/favicon.ico
// @include      https://vol.moe/*
// @include      https://volmoe.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398072/Yinr%27s%20Volmoe%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/398072/Yinr%27s%20Volmoe%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = document.location.href;

    if (url.match(/https?:\/\/(vol\.moe|volmoe\.com)\/c(omic)?\/.*/)) {
        // 漫画详情页面
        let filetags = ['epub', 'mobi'];
        let checkboxtags = ['epub', 'push'];
        let voltags = ['1', '2', '3', '4'];

        (function() {
            GM_addStyle('.book_desc tr td { border: solid 1px lightgray; }');
        })();

        let getVoltagName = function(filetag, voltag) {
            let el = document.getElementById('checkbox_all_' + filetag + '_' + voltag);
            if (el !== null) {
                return el.parentNode.getElementsByTagName('b')[0].innerHTML;
            } else {
                return '';
            }
        };

        let getVolsInfo = function(filetag, voltag) {
            let checkboxtag = filetag;
            if (checkboxtag === 'mobi') {
                checkboxtag = 'push';
            }

            let els = document.querySelectorAll('[name^=size_' + checkboxtag + '_' + voltag + ']');

            let count = els.length;
            let size = 0.0;
            els.forEach(el => {
                size += parseFloat(el.value)
            });
            return {count, size};
        };

        let getVolsInfoString = function(filetag, voltag) {
            let name = getVoltagName(filetag, voltag);
            let {count, size} = getVolsInfo(filetag, voltag);
            size = Math.floor(size * 100) / 100;

            let infoStr = count === 0 ? '' : `${filetag} - ${name} 共 ${count} 本 / 約 ${size} M`;
            return {filetag, name, count, size, str: infoStr};
        };

        let allInfoArray = [];
        let fileTagSize = {'epub': '', 'mobi': ''};
        let fileTagCount = {'epub': '', 'mobi': ''};
        filetags.forEach(filetag => {
            voltags.forEach(voltag => {
                let info = getVolsInfoString(filetag, voltag);
                if (info.str !== '') {
                    console.log(info);
                    allInfoArray.push(info.str);
                    fileTagSize[info.filetag] += `+${info.size}`;
                    fileTagCount[info.filetag] += `+${info.count}`;
                }
            });
        });

        let desc = document.getElementById('desc_text');
        desc.innerHTML += '<br/><br/>';
        desc.innerHTML += allInfoArray.join('<br/>');
        desc.innerHTML += `<br/><table><tbody><tr>
                           <td>=${fileTagCount.epub.slice(1)}</td>
                           <td></td><td></td><td></td><td></td><td></td>
                           <td>=${fileTagSize.epub.slice(1)}</td>
                           <td>=${fileTagSize.mobi.slice(1)}</td>
                           <td></td></tr></tbody></table>`;

        // 更改下载全部函数
        function do_down_all( line, filetype ) {
            let i = 0, vol_id = 0;
            let file_count = 0, total_count= 0;
            let obj_checkbox, obj_size;
            let d_speed = 2 * 1024; // download speed in KB/s

            let file_size = 0, total_size = 0,
                remain_size = parseFloat(document.querySelector("#quota_login").innerText.match(/\s+([\d.]+)\s+M/)[1]);
            let comic_name = document.querySelector("#author > b").innerText;
            let html_title = document.title;

            if ( parseInt(is_vip) <= 0 ) {
                // None VIP
                // return( false );
                line = 0; // using default download line
                d_speed = 80; // download speed setting to 80 KB/s
                console.log('Not vip, use normal download now.');
            }
            if ( filetype == 1 ) {
                obj_checkbox = document.getElementsByName("checkbox_push");
                obj_size = document.querySelectorAll('[name^=size_mobi]');
            } else {
                obj_checkbox = document.getElementsByName("checkbox_epub");
                obj_size = document.querySelectorAll('[name^=size_epub]');
            }

            // Count Total Files
            for ( i=0; i<obj_checkbox.length; i++ ) {
                if ( obj_checkbox[i].checked ) {
                    total_count++;
                    total_size += parseFloat(obj_size[i].value);
                }
            }
            if ( total_count > 0 ) {
                _hmt.push(['_trackEvent', 'batch_down', 'batch_'+filetype+'_'+line, '批量' + comic_name, total_count]);
            }

            // Open Windows and Download
            /*
            for ( i=0; i<obj_checkbox.length; i++ ) {
                if ( obj_checkbox[i].checked ) {
                    if ( file_count > 0 ) {
                        // sleep(3);
                        for(var start = Date.now(); Date.now() - start <= 10 * 60 * 1000; ) { }
                    } // if
                    file_count++;
                    vol_id = obj_checkbox[i].value;
                    window.open( "/down/"+bookid+"/"+vol_id+"/"+line+"/"+filetype+"/"+file_count+"-"+total_count+"/" );
//                     if ( parseInt(is_vip) <= 0 ) {
//                         _hmt.push(['_trackEvent', 'down_1', 'down_web_epub_下載', '-', 1]);
//                     } else {
                    _hmt.push(['_trackEvent', 'batch_open', 'batch_'+filetype+'_'+line, '姐姐來了', 1]);
//                     }
                } // if
            } // for */

            // Open Windows and Download with SetTimeout
            let down_i = function(i) {
                if ( obj_checkbox[i].checked ) {
                    file_count++;
                    file_size += parseFloat(obj_size[i].value);

                    if (file_size > remain_size) {
                        document.title = `[!${file_count}/${total_count}]` + html_title;
                        return false;
                    }
                    vol_id = obj_checkbox[i].value;
                    if ( parseInt(is_vip) <= 0 ) {
//                         _hmt.push(['_trackEvent', 'down_1', 'down_web_epub_下載', '-', 1]);
                        window.open( "/down/"+bookid+"/"+vol_id+"/"+line+"/"+filetype+"/1-0/" );
                    } else {
                        window.open( "/down/"+bookid+"/"+vol_id+"/"+line+"/"+filetype+"/"+file_count+"-"+total_count+"/" );
                    }
                    _hmt.push(['_trackEvent', 'batch_open', 'batch_'+filetype+'_'+line, comic_name, 1]);
                    if ( i + 1 < obj_checkbox.length ) {
                        let filesize = parseFloat(obj_size[i].value);
                        setTimeout(() => down_i(i + 1), filesize * 1024 / d_speed / 3 * 1000);
                        document.title = `[${file_count}/${total_count}]` + html_title;
                    } else {
                        document.title = `[√${file_count}]` + html_title;
                    }
                } else {
                    if ( i + 1 < obj_checkbox.length ) {
                        down_i(i + 1);
                    } else {
                        document.title = `[√${file_count}]` + html_title;
                    }
                }
            }
            if (total_size > remain_size) {
                console.log(`Download size of ${total_size}M is more than remain size ${remain_size}M`);
            }
            down_i(0);

            return( false );
        }

        // setTimeout(() => {
            // Goto epub list
            unsafeWindow.display_cbz();
            unsafeWindow.volHelper = {
                getVoltagName,
                getVolsInfo,
                getVolsInfoString,
                allInfoArray
            };
            unsafeWindow.do_down_all = do_down_all;
        // }, 1000);

    } else if (url.match(/https?:\/\/(vol\.moe|volmoe\.com)\/myfollow\.php/)) {
        // 个人收藏页

        // 去除单元格多余空格
        document.querySelectorAll('td').forEach(el => {
            el.innerHTML = el.innerHTML.replace('&nbsp;', '');
        });
    }

})();