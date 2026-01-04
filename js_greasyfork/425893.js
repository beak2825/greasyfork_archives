// ==UserScript==
// @name              秒传链接提取
// @namespace         moe.cangku.mengzonefire
// @version           1.2.3
// @description       用于提取百度网盘秒传链接
// @author            mengzonefire
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require           https://cdn.jsdelivr.net/npm/js-base64
// @grant             GM_setValue
// @grant             GM_getValue
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/425893/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425893/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
!function () {
    'use strict';
    if (Base64.extendString) {
        Base64.extendString();
    }
    var dir;
    var codeInfo;
    var content;
    var file_id;
    var failed = 0;
    var html_btn = '<a class="g-button g-button-blue href="javascript:;" id="fast_link_btn" title="秒传链接" style="display: inline-block;"">';
    html_btn += '<span class="g-button-right">';
    html_btn += '<em class="icon icon-disk" title="秒传链接提取"></em>';
    html_btn += '<span class="text" style="width: auto;">秒传链接</span>'
    html_btn += '</span></a>';
    let loop = setInterval(() => {
        var html_tag = $("div.tcuLAu");
        if (!html_tag.length) return false;
        html_tag.append(html_btn);
        $("#fast_link_btn").click(function () {
            GetInfo();
        });
        clearInterval(loop);
    }, 500);
    /**
       * 一个简单的类似于 NodeJS Buffer 的实现.
       * 用于解析游侠度娘提取码。
       * @param {SimpleBuffer}
       */
    function SimpleBuffer(str) {
        this.fromString(str);
    }
    SimpleBuffer.toStdHex = function toStdHex(n) {
        return ('0' + n.toString(16)).slice(-2);
    };
    SimpleBuffer.prototype.fromString = function fromString(str) {
        var len = str.length;
        this.buf = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            this.buf[i] = str.charCodeAt(i);
        }
    };
    SimpleBuffer.prototype.readUnicode = function readUnicode(index, size) {
        if (size & 1){
            size++;
        }
        var bufText = Array.prototype.slice.call(this.buf, index, index + size).map(SimpleBuffer.toStdHex);
        var buf = [''];
        for (var i = 0; i < size; i += 2){
            buf.push(bufText[i + 1] + bufText[i]);
        }
        return JSON.parse('"' + buf.join('\\u') + '"');
    };
    SimpleBuffer.prototype.readNumber = function readNumber(index, size) {
        var ret = 0;
        for (var i = index + size; i > index;){
            ret = this.buf[--i] + (ret * 256);
        }
        return ret;
    };
    SimpleBuffer.prototype.readUInt = function readUInt(index) {
        return this.readNumber(index, 4);
    };
    SimpleBuffer.prototype.readULong = function readULong(index) {
        return this.readNumber(index, 8);
    };
    SimpleBuffer.prototype.readHex = function readHex(index, size) {
        return Array.prototype.slice.call(this.buf, index, index + size).map(SimpleBuffer.toStdHex).join('');
    };
    function DuParser() {}
    DuParser.parse = function generalDuCodeParse(szUrl) {
        var r;
        if (szUrl.indexOf('bdpan') === 0) {
            r = DuParser.parseDu_v1(szUrl);
            r.ver = 'PanDL';
        }
        else if (szUrl.indexOf('BDLINK') === 0) {
            r = DuParser.parseDu_v2(szUrl);
            r.ver = '游侠 v1';
        }
        else if (szUrl.indexOf('BaiduPCS-Go') ===0) {
            r = DuParser.parseDu_v3(szUrl);
            r.ver = 'PCS-Go';
        }
        else {
            r = DuParser.parseDu_v4(szUrl);
            r.ver = '梦姬标准';
        }
        return r;
    };
    DuParser.parseDu_v1 = function parseDu_v1(szUrl) {
        return szUrl.replace(/\s*bdpan:\/\//g, ' ').trim().split(' ').map(function(z) {
            return z.trim().fromBase64().match(/([\s\S]+)\|([\d]{1,20})\|([\da-f]{32})\|([\da-f]{32})/);
        }).filter(function(z) {
            return z;
        }).map(function(info) {
            return {
                md5: info[3].toLowerCase(),
                md5s: info[4].toLowerCase(),
                size: info[2],
                name: info[1]
            };
        });
    };
    DuParser.parseDu_v2 = function parseDu_v2(szUrl) {
        var raw = atob(szUrl.slice(6).replace(/\s/g, ''));
        if (raw.slice(0, 5) !== 'BDFS\x00'){
            return null;
        }
        var buf = new SimpleBuffer(raw);
        var ptr = 9;
        var arrFiles = [];
        var fileInfo, nameSize;
        var total = buf.readUInt(5);
        var i;
        for (i = 0; i < total; i++) {
            // 大小 (8 bytes)
            // MD5 + MD5S (0x20)
            // nameSize (4 bytes)
            // Name (unicode)
            fileInfo = {};
            fileInfo.size = buf.readULong(ptr + 0);
            fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
            fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
            nameSize = buf.readUInt(ptr + 0x28) << 1;
            fileInfo.nameSize = nameSize;
            ptr += 0x2C;
            fileInfo.name = buf.readUnicode(ptr, nameSize);
            arrFiles.push(fileInfo);
            ptr += nameSize;
        }
        return arrFiles;
    };
    DuParser.parseDu_v3 = function parseDu_v3(szUrl) {
        return szUrl.split('\n').map(function(z) {
            // unsigned long long: 0~18446744073709551615
            return z.trim().match(/-length=([\d]{1,20}) -md5=([\da-f]{32}) -slicemd5=([\da-f]{32})[\s\S]+"([\s\S]+)"/)
        }).filter(function(z) {
            return z;
        }).map(function(info) {
            return {
                md5: info[2],
                md5s: info[3],
                size: info[1],
                name: info[4]
            };
        });
    };
    DuParser.parseDu_v4 = function parseDu_v4(szUrl) {
        return szUrl.split('\n').map(function(z) {
            // unsigned long long: 0~18446744073709551615
            return z.trim().match(/([\dA-Fa-f]{32})#([\dA-Fa-f]{32})#([\d]{1,20})#([\s\S]+)/);
        }).filter(function(z) {
            return z;
        }).map(function(info) {
            return {
                md5: info[1].toLowerCase(),
                md5s: info[2].toLowerCase(),
                size: info[3],
                name: info[4]
            };
        });
    };

    function saveFile(i,try_flag) {
        if (i >= codeInfo.length) {
            console.log('save_file_finish');
            Swal.fire({
                title: `转存完毕 共${codeInfo.length}个 失败${failed}个!`,
                confirmButtonText: '确定',
                html: '',
                onBeforeOpen: () => {
                    const content = Swal.getContent();
                    for (var i = 0; i < codeInfo.length; i++) {
                        if('errno' in codeInfo[i]){
                            var file_name = codeInfo[i].name;
                            var errno = codeInfo[i].errno;
                            var errText = checkErrno(errno);
                            var str1 = `文件名：${file_name}`;
                            var str2 = `失败原因：${errText}(#${errno})`;
                            var ele1 = document.createElement('p');
                            var ele2 = document.createElement('p');
                            var text1 = document.createTextNode(str1);
                            var text2 = document.createTextNode(str2);
                            ele1.appendChild(text1);
                            ele2.appendChild(text2);
                            content.appendChild(ele1);
                            content.appendChild(ele2);
                        }
                    }

                }
            }).then(() => {
                require('system-core:system/baseService/message/message.js').trigger('system-refresh');
            });
            failed = 0;
            return;
        }
        var first_404 = false;
        var file = codeInfo[i];
        file_id.textContent = (i+1).toString() + ' / ' + codeInfo.length.toString();

        $.ajax({
            url: '/api/rapidupload',
            type: 'POST',
            data: {
                path: dir + file.name,
                'content-md5': try_flag?file.md5.toUpperCase():file.md5,
                'slice-md5': try_flag?file.md5s.toUpperCase():file.md5s,
                'content-length': file.size
            }
        }).success(function(r) {
            if (r && r.errno) {
                console.log(r);
                if(try_flag && r.errno===404){
                    codeInfo[i].errno = 404;
                    failed++;
                }
                else if(r.errno!==404){
                    codeInfo[i].errno = r.errno;
                    failed++;
                }
                else{
                    first_404 = true;
                }
            }
        }).fail(function(r) {
            console.log(r);
            codeInfo[i].errno = 114514;
            failed++;
        }).always(function (){
            if(!try_flag && first_404){
                console.log('try_UpperCase_md5');
                saveFile(i, true)
            }
            else{
                saveFile(i+1, false);
            }
        });
    }

    function checkErrno(errno) {
        switch(errno){
            case -8:
                return '文件已存在';
            case 404:
                return '文件不存在(秒传无效)';
            case 2:
                return '转存失败(重新登录/检查保存路径)';
            case -10:
            	return '网盘容量已满';
            case 114514:
                return '接口调用失败';
            default:
                return '未知错误';
        }
    }

    function GetInfo(str='') {
        Swal.fire({
            title: '请输入提取码',
            input: 'textarea',
            inputValue: str,
            showCancelButton: true,
            inputPlaceholder: '[支持 PanDL/梦姬/游侠/PCS-Go][支持批量]',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: (value) => {
                if (!value) {
                    return '链接不能为空';
                }
                codeInfo = DuParser.parse(value);
                if(!codeInfo.length){
                    return '未识别到正确的链接';
                }
            }
        }).then((result1)=>{
            if (result1.dismiss){
                return;
            }
            Process();
        });
    }

    function Process(){
        dir = GM_getValue('last_dir');
        if(!dir){dir = '';}
        Swal.fire({
            title: '请输入保存路径',
            input: 'text',
            inputPlaceholder: '格式示例：/GTA5/，默认保存在根目录',
            inputValue: dir,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then((result2)=>{
            if (result2.dismiss){
                return;
            }
            if(result2){
                dir = result2.value;
                GM_setValue('last_dir', dir);
                if (dir.charAt(dir.length - 1)!='/'){
                    dir=dir+'/';
                }
            }
            Swal.fire({
                title: '文件提取中',
                html: '正在转存第 <file_id></file_id> 个',
                onBeforeOpen: () => {
                    Swal.showLoading()
                    content = Swal.getContent();
                    if (content){
                        file_id = content.querySelector('file_id');
                        saveFile(0, false);
                    }
                }
            });
        });
    }

    function GetInfo_url(){
        var bdlink = href.match(/[\?#]bdlink=([\da-zA-Z/\+]+)&?/);
        if(bdlink){
            bdlink = bdlink[1].fromBase64();
            GetInfo(bdlink);
        }
    }

    const href = window.location.href;

    document.addEventListener('DOMContentLoaded', GetInfo_url);
}();