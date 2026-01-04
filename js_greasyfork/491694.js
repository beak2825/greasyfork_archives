// ==UserScript==
// @name         DS资料下载
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/xiashuangxi
// @version      1.0.1.2409050726
// @description  DS资料下载辅助工具
// @author       小孩子
// @match        *://*.szwangjiao.com/*
// @match        *://*.tv168.cn/*
// @license      MIT
// @icon         data:image/gif;base64,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
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491694/DS%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491694/DS%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = `
            .__DS_download_panel {
                display: flex;
                position: fixed;
                top: 0;
                right: 0;
                z-index: 2147483640;
                font-size: 12px;
                padding: 0px 8px;
                flex-flow: column;
            }

            .__DS_download_panel button{
                padding: 4px;
                margin-top: 4px;
                color: white;
            }

            .__DS_download_panel .default_but {
                background-color: #1b6ef3;
            }

           .__DS_download_panel .exit_but {
                background-color: red;
            }

            .__DS_download_ul {
                list-style: none;
                display: flex;
                margin: 0;
                padding: 0;
                user-select: none;
            }

            .__DS_download_toolbar {
                padding: 0px;
            }

            .__DS_download_toolbar ul{
                background-color: white;
                border: 1px solid #e1e1e1;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                padding: 4px 8px;
                 border-top: 4px solid #FF9800;
                border-bottom: 1px solid #FF9800;
                border-right: 1px solid #FF9800;
                border-left: 1px solid #FF9800;

                box-shadow: 1px 1px 1px #FF9800;
            }

            .__DS_download_toolbar li{
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 4px;
            }

            .__DS_download_toolbar li:hover {
                background-color: #1b6ef3;
                color: white;
            }

            .__DS_download_detail {
                top: 40px;
                user-select: none;
                background-color: white;
                border-top: 4px solid #FF9800;
                border-bottom: 1px solid #FF9800;
                border-right: 1px solid #FF9800;
                border-left: 1px solid #FF9800;
                padding: 0px;
                box-shadow: 1px 1px 1px #FF9800;

            }

            .__DS_download_detail ul {
                padding: 4px;
                display: flex;
                flex-flow: column;
                max-height: 400px;
                overflow-y: auto;
            }

            .__DS_download_detail li {
                padding: 4px;
            }

            .__DS_download_detail .progress {
                background-color: #009688;
                color: white;
            }
    `;

    const log_css = [
        {name: 'success', label: '成功', color: '#d1e7dd', border: '#a3cfbb', text:'#0a3622'},
        {name: 'danger', label: '危险', color: '#f8d7da', border: '#f1aeb5', text: '#664d03'},
        {name: 'warning', label: '警告', color: '#f1aeb5', border: '#ffe69c', text: '#055160'},
        {name: 'info', label: '信息', color: '#cff4fc', border: '#9eeaf9', text: '#055160'},
        {name: 'drak', label: '黑暗', color: '#055160', border: '#055160', text: '#495057'},
    ]

    let progress = null;
    let size = 0;
    let current = 0;
    let home = document.location.origin;

    const log = (text, type, label) => {
        let css = null;
        log_css.forEach( (n) => {
            if(type == n.name) {
                css = n;
            }
        } );


        if (css != null) {
            let l =  label ? label : css.name;
            console.log('%c' + l, 'color: ' + css.text + '; border: 1px solid ' + css.border + '; background-color: ' + css.color + '; padding: 2px 4px' , text);
        } else {
            let l =  label ? label + ':' : '';
            console.log(l , text );
        }
    }

    const uuid = ( e = 21 ) => {
        let a = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
        let t = "";
        let r = crypto.getRandomValues(new Uint8Array(e));
        for (let n = 0; n < e; n++) t += a[63 & r[n]];
        return t
    }

    const add_element = (parent, tag, content, clazz, id) => {
        let el_id = id ? id : uuid(10);
        let ex_el = document.getElementById(el_id);
        if (ex_el != null) {
            return ex_el
        } else {
            let el = document.createElement(tag);
            parent.appendChild(el);
            el.setAttribute('id', el_id);
            el.setAttribute('class', clazz);
            if (content) {
                let c = content.html ? content.html : content.text;
                if (content.html ? true : false) {
                    el.innerHTML = c;
                } else {
                    el.innerText = c;
                }
            }
            return el;
        }
    }

    let show_toolbar = () => {
        let old_toolbar = document.getElementById('__DS_download_toolbar');
        if (old_toolbar){
            old_toolbar.remove();
        }
        let toolbar_panel = add_element(document.body, 'div', null, '__DS_download_panel __DS_download_toolbar', '__DS_download_toolbar');
        let toolbar_menu = add_element(toolbar_panel, 'ul', null, '__DS_download_ul');
        let toolbar_video_but = add_element(toolbar_menu, 'li', {text: '视频'}, null);
        toolbar_video_but.onclick = () => {
            show_video_list_panel();
        };
        let toolbar_file_but = add_element(toolbar_menu, 'li', {text: '文件'}, null);
        toolbar_file_but.onclick = () => {
            show_file_list_panel();
        }

        let toolbar_que_but = add_element(toolbar_menu, 'li', {text: '题库'}, null);
        toolbar_que_but.onclick = () => {
            show_que_list_panel();
        }
    }

    let show_video_list_panel = () => {
        log('显示视频列表信息...','info','信息');
        let old_vlp = document.getElementById('__DS_download_detail');
        if (old_vlp){
            old_vlp.remove();
        }
        let video_list_panel = add_element(document.body, 'div', null, '__DS_download_panel __DS_download_detail', '__DS_download_detail');
        let video_list = add_element(video_list_panel, 'ul', null, '__DS_download_ul');
        let list = get_video_info_list();
        let urls = '';
        list.forEach( (n) => {
            urls = urls + n.url +'\r\n';
            let li = add_element(video_list, 'li', {html: n.name + '【'+ n.ext +'】'});
            let a = add_element(li, 'a', {text: ' [复制链接]'});
            a.onclick = () => {
                log('复制【' +n.name+ '】视频链接。','info','信息');
                GM_setClipboard(n.url , "text", () => alert('复制成功！') );
            }

        });
        let exit_but = add_element(video_list_panel, 'button', {text: '关闭'}, 'exit_but');
        exit_but.onclick = () => {
            video_list_panel.remove();
        }
        let copyall = add_element(video_list_panel, 'button', {text: '复制全部链接'}, 'default_but');
        copyall.onclick = () => {
            log('复制使用视频链接。','info','信息');
            GM_setClipboard(urls, "text", () => alert("复制成功！共【"+list.length+"条】"));
        }
    }

    let show_file_list_panel = async () => {
        log('显示文件列表信息。','info','信息');
        let old_flp = document.getElementById('__DS_download_detail');
        if (old_flp){
            old_flp.remove();
        }

        let file_list_panel = add_element(document.body, 'div', null, '__DS_download_panel __DS_download_detail', '__DS_download_detail');
        let kc_file_topic = add_element(file_list_panel, 'div', {html:'<b>课程附件</b>'});
        let kc_file_list = add_element(file_list_panel, 'ul', null, '__DS_download_ul');
        let kc_files = JSON.parse(await get_kc_file());
        kc_files.data.forEach( (n) => {
            let li = add_element(kc_file_list,'li',{text: n.fileName + '【'+ n.fileSuffix+'】'});
            let a = add_element(li, 'a', {text: ' [下载]'});

            a.onclick = () => {
                log('下载【' +n.fileName+ '】文件。','info','信息');
                download_file('/prod-api'+n.fileUrl, n.fileName,modify_file_format(n.fileSuffix));
            }
        });

        let kt_file_topic = add_element(file_list_panel, 'div', {html:'<b>课堂附件</b>'});
        let kt_file_list = add_element(file_list_panel, 'ul', null, '__DS_download_ul');
        let kt_files = JSON.parse(await get_kt_file());
        kt_files.data.forEach( (n) => {
            let li = add_element(kt_file_list,'li',{text: n.fileName + '【'+ n.fileSuffix+'】'});
            let a = add_element(li, 'a', {text: ' [下载]'});

            a.onclick = () => {
                log('下载【' +n.fileName+ '】文件。','info','信息');
                download_file('/prod-api'+n.fileUrl, n.fileName, modify_file_format(n.fileSuffix));
            }
        });

        let exit_but = add_element(file_list_panel, 'button', {text: '关闭'}, 'exit_but');
        exit_but.onclick = () => {
            file_list_panel.remove();
        }

        let download_all = add_element(file_list_panel, 'button', {text: '全部文件下载'}, 'default_but');
        download_all.onclick = () => {
            log('批量下载文件。','info','信息');
            kc_files.data.concat(kt_files.data).forEach( (n) => {
                download_file('/prod-api'+n.fileUrl, n.fileName, modify_file_format(n.fileSuffix));
            } );
        }
    }

    let show_que_list_panel = () => {
        log('显示题库列表信息。','info','信息');
        let old_qlp = document.getElementById('__DS_download_detail');
        if (old_qlp){
            old_qlp.remove();
        }
        let que_list_panel = add_element(document.body, 'div', null, '__DS_download_panel __DS_download_detail', '__DS_download_detail');
        progress = add_element(que_list_panel, 'div', {html:'下载进度：0/0'}, 'progress');
        let que_list = add_element(que_list_panel, 'ul', null, '__DS_download_ul');
        get_que_list().forEach( (n) => {
            let li = add_element(que_list, 'li', {html: n.name });
            let a = add_element(li, 'a', {html: ' [下载]' });
            a.onclick = () => {
                log('下载【'+n.name+'】题库信息。','info','信息');
                progress.innerHTML = '下载进度：0/1. 下载中..';
                download_que(n.id);

            }
        });
        let exit_but = add_element(que_list_panel, 'button', {text: '关闭'}, 'exit_but');
        exit_but.onclick = () => {
            que_list_panel.remove();
        }
        let download_all = add_element(que_list_panel, 'button', {text: '全部下载'}, 'default_but');
        download_all.onclick = () => {
            log('批量下载题库信息。','info','信息');
            progress.innerHTML = '下载进度：0/'+get_que_list().length+'. 下载中..';
            get_que_list().forEach( (n) => {
                //download_que(n.id);
                download_alltext(n.id);
            });
        }

        let download_ankizip = add_element(que_list_panel, 'button', {text: '全部下载Anki卡片，保存为Zip文件'}, 'default_but');
        download_ankizip.onclick = () => {
            log('批量下载题库信息。','info','信息');
            progress.innerHTML = '下载进度：0/'+get_que_list().length+'. 下载中..';
            //get_que_list().forEach( (n) => {
            download_all_anki_zip(get_que_list());
            //});
        }
    }

    let get_video_info_list = () => {
        let v_list = unsafeWindow.__NUXT__.data[0].videoList;
        let result = [];

        v_list.forEach( (n) => {
            let temp = n.playUrl.split('.');
            temp = temp[temp.length - 1];
            result.push({
                name: n.mediaName,
                ext: temp,
                url: n.playUrl
            });
        })
        return result;
    }

    let get_kc_file = () => {
        let fileid = unsafeWindow.__NUXT__.data[0].videoInfo.fileIds;
        return new Promise( (resolve, reject) => {
            //http://ee.szwangjiao.com/prod-api/videoPlayer/files/369?r=1712497010415
            let url = home + '/prod-api/videoPlayer/files/'+fileid;
            //console.log(url)
            GM_xmlhttpRequest({
                method: "GET",
                //url: 'http://ee.szwangjiao.com/prod-api/videoPlayer/files/'+fileid,
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        })
    }

    let get_kt_file = () => {
        let fileAccessory = unsafeWindow.__NUXT__.data[0].packInfo.fileAccessory;
        return new Promise( (resolve, reject) => {
            //http://ee.szwangjiao.com/prod-api/videoPlayer/files/2234,2235,2236,2237,2238,2239,2240,2241,22
            let url = home + '/prod-api/videoPlayer/files/'+fileAccessory;
            //console.log(url)
            GM_xmlhttpRequest({
                method: "GET",
                //url: 'http://ee.szwangjiao.com/prod-api/videoPlayer/files/'+fileAccessory,
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        })
    }

    let get_que_list = () => {
        let q_list = unsafeWindow.__NUXT__.data[0].packInfo.quizPackList;
        let result = [];

        q_list.forEach( (n) => {
            result.push({
                id: n.id,
                name: n.packName
            });
        } );
        return result;
    }

    var download_file = (url,name,type) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status == 200) {
                var file = new Blob([xhr.response], {
                    type: type? type: 'application/pdf'
                });
                saveAs(file, name);
            }
        }
        xhr.send();
    }

    var download_que = (id) => {
        //prod-api/app/quiz/examLog/exist?r=1712511408081&type=300&packId=712
        //prod-api/app/quiz/examLog/generate?r=1712510514666&type=300&packId=712&last=false
        //prod-api/app/quiz/examLog/info?r=1712510628484&id=2231235
        //prod-api/app/quiz/question/listByBody?r=1712510628698&pageNum=1&pageSize=1&examLogId=2231235

        //id --> 得到编号 --> 得到题号 --> 得到某一个题号的信息
        let get_que_exist = (_id) => {
            return new Promise( (resolve, reject) => {
                let url = home + '/prod-api/app/quiz/examLog/exist?type=300&packId='+_id;
                //console.log(url)
                GM_xmlhttpRequest({
                    method: "GET",
                    //url: 'http://ee.szwangjiao.com/prod-api/app/quiz/examLog/exist?type=300&packId='+_id,
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                    },
                    onload: function(response) {
                        resolve(response.responseText);
                    }
                });
            });
        }

        let get_que_number = (_id) => {
            return new Promise( (resolve, reject) => {
                let url = home + '/prod-api/app/quiz/examLog/generate?type=300&last=false&packId='+_id;
                //console.log(url)
                GM_xmlhttpRequest({
                    method: "GET",
                    //url: 'http://ee.szwangjiao.com/prod-api/app/quiz/examLog/generate?type=300&last=false&packId='+_id,
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                    },
                    onload: function(response) {
                        resolve(response.responseText);
                    }
                });
            });
        }
        let get_que_nos = (number) => {
            return new Promise( (resolve, reject) => {
                let url = home + '/prod-api/app/quiz/examLog/info?id='+number;
                //console.log(url)
                GM_xmlhttpRequest({
                    method: "GET",
                    //url: 'http://ee.szwangjiao.com/prod-api/app/quiz/examLog/info?id='+number,
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                    },
                    onload: function(response) {
                        resolve(response.responseText);
                    }
                });
            });
        }
        let get_que_detail = (number,no) => {
            return new Promise( (resolve, reject) => {
                let url =  home + '/prod-api/app/quiz/question/listByBody?&pageNum='+no+'&pageSize=1&examLogId='+number;
                //console.log(url)
                GM_xmlhttpRequest({
                    method: "GET",
                    url:url,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer '+unsafeWindow.__NUXT__.state.user.token
                    },
                    onload: function(response) {
                        resolve(response.responseText);
                    }
                });
            });
        }

        let download = async () => {
            let result = '';
            let exist = await get_que_exist(id);
            let number_obj = JSON.parse( await get_que_number(id));
            let nos= JSON.parse(await get_que_nos(number_obj.data.id));
            for(var i = 1 ; i <= nos.data.bodyIds.length; i++){
                result = result + await get_que_detail(number_obj.data.id, i) + '\r\n';
            }

            return {
                file_name: nos.data.quizPack.packName,
                content: result
            };
        }

        return download();
    }

    // txt
    let download_alltext = (id) => {
        download_que(id).then( (que) => {
            let blob = new Blob([que.content], {
                type: 'text/plain;charset=utf-8'
            });

            let finish_t = '下载中' + ((current&1)==0?'..':'....');
            if (progress) {
                let arr = /\d*\/\d*/.exec(progress.innerHTML)[0].split('/')
                size = parseInt(arr[1]);
                current = parseInt(arr[0]);

                if(current == size || current > size ) {
                    current = size;
                    //finish_t = '完成';
                } else {
                    current = current + 1;
                }
            }
            progress.innerHTML = '下载进度：'+current+'/'+size+'. '+ ( (current >= size)? '完成':finish_t );
            saveAs(blob, que.file_name);
        });
    }

    // anki zip
    let download_all_anki_zip = (ids) => {
        let files = {
            'zg': [],
            'kg': []
        };

        let size = ids.length;
        ids.forEach( id => {
            let que = download_que(id.id).then( (que) => {
                let kg_arr =[];
                let zg_arr =[];
                let json_arr_obj = que.content.split('\r\n');
                let biaoqiang = "";
                for (var j=0; j < json_arr_obj.length; j++) {
                    if (json_arr_obj[j].length == 0 ) {
                        continue;
                    }
                    let json_obj = JSON.parse(json_arr_obj[j]).rows[0];
                    let biaoti = json_obj.topic.replaceAll('\r\n','<br>');;
                    let daan ="";
                    let shuoming = json_obj.analysis.replaceAll('\r\n','<br>');
                    if (json_obj.type == '1' ||json_obj.type == '2') {
                        biaoqiang = '客观题';
                        let xuanxiang = json_obj.optionList;
                        let _xx = [];
                        let opt_char = ['A','B','C','D','E'];
                        for (var i = 0; i < xuanxiang.length; i++) {
                            let opt = xuanxiang[i];
                            _xx.push(opt.content.replaceAll('\r\n','<br>'));
                            if ('1' == opt.isAnswer) {
                                daan = daan + opt_char[i];
                            }
                        }
                        xuanxiang = _xx.join('\t');
                        if (json_obj.type == '2') {
                            kg_arr.push(`${biaoti}\t${xuanxiang}\t${daan}\t${shuoming}\t${biaoqiang}`)
                        } else {
                        kg_arr.push(`${biaoti}\t${xuanxiang}\t\t${daan}\t${shuoming}\t${biaoqiang}`)
                        }
                    } else {
                        biaoqiang = '主观题';
                        zg_arr.push(`${biaoti}\t${shuoming}\t${biaoqiang}`)
                    }
                }
                files.zg.push({
                    name: '【主观题】'+que.file_name + '.txt',
                    content: zg_arr.join('\r\n')
                });
                files.kg.push({
                    name: '【客观题】'+que.file_name + '.txt',
                    content: kg_arr.join('\r\n')
                });

                console.log('添加：' +'【客观题】'+que.file_name + '  |  ' + '【主观题】'+que.file_name + '  |  ' + files.zg.length +'/'+size);
            });
        });

        let run_count = 5;
        let check_count = 0;


        let t;

        let exec_gen_zip = () => {
            if (check_count == run_count) {
                clearInterval(t);
                console.log('zip')

                download_zip(files.zg.concat(files.kg));
            }

            let filesize =(files.zg.length > files.kg.length ? files.zg.length : files.kg.length);
            console.log('check', run_count ,check_count, filesize, size)

            if ( filesize >= size) {
                check_count = check_count + 1;
            }
        }
        t = setInterval(exec_gen_zip, 1000);

    }

    function download_zip (files) {
        var zip = new JSZip();
        files.forEach( f => {
            zip.file(f.name, f.content);
        });
        console.log(zip)

        // 将Zip打包成Blob对象
        zip.generateAsync({type: "blob"}).then(function (content) {
            saveAs(content, "example.zip");
        });
    }

    let modify_file_format = (type) => {
        if (type == 'pdf') {
            type = 'application/pdf';
        }
        if (type == 'docx') {
            type = 'application/msword';
        }
        return type;
    }

    window.onload = () => {
        console.log('\n'.concat(' %c ', GM_info.script.name, ' v' + GM_info.script.version)
                    .concat(' ', '%c'+GM_info.script.author, ':', GM_info.script.homepage).concat('%c \n\n'),
                    'background: #ffb580; padding: 5px','background: #50a095;padding: 5px','');

        GM_setValue('__DS_download_tag__', unsafeWindow.location.href);

        log('脚本启动。','info','信息');
        setInterval(() => {
            let location = unsafeWindow.location.href;
            let tag = GM_getValue('__DS_download_tag__');
            if (location != tag) {
                unsafeWindow.location.reload();
            }
        }, 1000);
        GM_addStyle(style);
        show_toolbar();
    }


})();