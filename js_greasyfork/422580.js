// ==UserScript==
// @name         BaiduYunHack
// @namespace    https://www.retzero.com
// @version      0.2
// @description  Hack
// @author       Jackjun
// @match        *://pan.baidu.com/disk/home*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422580/BaiduYunHack.user.js
// @updateURL https://update.greasyfork.org/scripts/422580/BaiduYunHack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const classMap = {
        'bar-search': 'OFaPaO',
        'list-tools': 'tcuLAu',
        'header': 'vyQHNyb'
    }

    function getSelectedFile() {
        return require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems()
    }

    function downloadFile(path, name) {
        $.ajax({
            url:`https://pan.baidu.com/api/mediainfo?app_id=250528&type=M3U8_FLV_264_480&path=${encodeURIComponent(path)}&clienttype=1&channel=android_6.0.1_oppo%20R11_bd-netdisk_1018849x&version=9.6.73&network_type=wifi&apn_id=1_0&freeisp=0&queryfree=0&nom3u8=1&dlink=1&media=1&origin=dlna`,
            success: function (response) {
                copy(response.info.dlink, name)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (thrownError === 'Bad Request') {
                    copy(xhr.responseJSON.info.dlink, name)
                } else {
                    console.error('Get Dlink Error', xhr, ajaxOptions, thrownError)
                }
            }
        });
    }

    function copy(dlink, name) {
        swal({
            title: `复制下面链接，用Motrix下载文件`,
            text: dlink,
            button: false
        });
    }

    function clickDownload() {
        let files = getSelectedFile().filter(i => i.isdir===0)
        if (files && files.length > 0) {
            if (files.length == 1) {
                console.log(files[0])
                downloadFile(files[0].path, files[0].server_filename)
            } else {
                swal("仅支持一个文件哦！", {
                    button: false,
                    timer: 2000,
                });
            }

        } else {
            console.log('请选择要下载的文件')
            swal("请选择要下载的文件！", {
                button: false,
                timer: 2000,
            });
        }
    }

    function addBtn () {
        $('.' + classMap['list-tools']).css('height', '40px')
        console.log($('.' + classMap['list-tools']));
        let $dropdownbutton_a = $('<a class="g-button g-button-blue" data-button-id="b200" data-button-index="200" href="javascript:;"></a>')
        let $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">高速下载</span></span>')
        $dropdownbutton_a.append($dropdownbutton_a_span)
        $dropdownbutton_a.click(clickDownload)
        $('.' + classMap['list-tools']).append($dropdownbutton_a)
    }

    let handler = setInterval(()=>{
        if ($('.' + classMap['list-tools']).length == 0) {
            return;
        }
        clearInterval(handler);
        addBtn()
    }, 100);

})();