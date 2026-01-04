// ==UserScript==
// @name         截图
// @namespace    http://tampermonkey.net/
// @version      0.0.01
// @description  直播商品截图
// @author       许大包
// @match        https://compass.jinritemai.com/talent/live-statement*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @run-at       document-end
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/495160/%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495160/%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    // 复制到粘贴板的方法
    function toast(text,time,id) {
        let $html1 = document.querySelector('html')
        let $toast = document.createElement('div')
        let timer = time || 2000
        let toastid = id || "ccc"
        $toast.style.position = 'fixed'
        $toast.style.left = '10px'
        $toast.style.top = '20%'
        if(toastid != "ccc") $toast.style.top = '40%'
        $toast.innerText = text
        $toast.style.padding = '6px 10px'
        $toast.style.borderRadius = '8px'
        $toast.style.opacity = 0
        $toast.style.color = '#fff'
        $toast.style.lineHeight = '30px'
        //$toast.style.background = 'rgba(100, 86, 247,.6)'
        $toast.style.background = 'rgb(169, 187, 267)'
        $toast.style.zIndex = 9999999999999999999
        $toast.setAttribute("id", toastid)
        $html1.appendChild($toast)
        let i = 0
        let aaaa = setInterval(() => {
            if(!document.querySelector('#'+toastid)) clearInterval(aaaa)
            i = i+0.05
            if(document.querySelector('#'+toastid)) document.querySelector('#'+toastid).style.opacity = i
            if(i>=1) {
                clearInterval(aaaa)
                setTimeout(() => {
                    if(document.querySelector('#'+toastid)) $html1.removeChild(document.querySelector('#'+toastid))
                }, timer);
            }
        }, 15)
        }
    function copyToClip(content, message) {
        var aux = document.createElement("input")
        aux.setAttribute("value", content)
        document.body.appendChild(aux)
        aux.select()
        document.execCommand("copy")
        document.body.removeChild(aux)
        if (message == null) {
            toast("复制成功");
        }else if (message == '') {
            return
        }else{
            toast(message+'复制成功');
        }
    }

    function AA(base64Data) {
        try {
            if (document.body.createControlRange) { //IE 11 需要有个img标签
                var controlRange;
                var imgs = document.getElementById('hidImag');
                imgs.onload = function () {
                    controlRange = document.body.createControlRange();
                    imgs.contentEditable = 'true';
                    controlRange.addElement(imgs);
                    try {
                        var successful = controlRange.execCommand('copy');
                        var msg = successful ? 'successful' : 'unsuccessful';
                        console.log('Copying text command was ' + msg);
                    } catch (err) {
                        console.log(err);
                    }
                }
                imgs.src =  'data:image/png;base64,'+base64Data;
            }
            else { //chrome
                const blobInput = convertBase64ToBlob(base64Data, 'image/png');
                const clipboardItemInput = new ClipboardItem({ 'image/png': blobInput });
                navigator.clipboard.write([clipboardItemInput]);
                toast('复制成功')
            }
        } catch (e) {
            console.log(e);
        }
    }

    function convertBase64ToBlob(base64, type) {
        var bytes = window.atob(base64);
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { type: type });
    }
    function a() {
        // 复制到table
        $('#table').append($('.ecom-spin-nested-loading .ecom-table-content').clone(true))
        $('#table .ecom-table-column-sort').next().remove()
        $('#table .ecom-table-cell-fix-right-first').remove()
        $('#table .ecom-table-content:last .ecom-table-row').find('.ecom-table-cell:last').remove()
        $('#table .ecom-table-content:last').find('.ecom-table-column-has-sorters:last').remove()
        $('#table .ecom-table-content:last').find('col:last').remove()
        $('#table .ecom-table-content:last').find('col:last').remove()
        $('#table .ecom-table-content:last').find('col:last').remove()
        $('#table .ecom-table-content:last').find('col').eq(1).width(340)
        $('#table .ecom-table-content').css({'box-shadow':'8px 2px 8px #9f97f9',
                                             'margin-right':'15px'})
    }
    window.addEventListener('keydown',function(e) {
        if(e.altKey && e.keyCode === 192) {
            // 点击核心数据
            document.querySelectorAll('.ecom-tabs-tab')[1].click()
            // 点击商品
            document.querySelectorAll('.coreIndexItemWrapper-ibEKPB')[3].click()
            setTimeout(() => {
                // 排序
                document.querySelectorAll('.ecom-table-column-sorter-inner')[0].click()
                setTimeout(() => {
                    a()
                    document.querySelectorAll('.ecom-pagination-item')[1].click()
                    setTimeout(() => {
                        a()
                        document.querySelectorAll('.ecom-pagination-item')[2].click()
                        setTimeout(() => {
                            a()
                            // 截图
                            domtoimage.toPng($('#table')[0],{}).then((dataUrl) => {
                                AA(dataUrl.split(',')[1])
                                setTimeout(() => {
                                    $('#table').empty()
                                },1500)
                            })
                        },1000)
                    },1000)
                },1500)
            },1000)
        }
    })
    let styleDom = `
        <style>
            #table {
                width: 90%;
                display: flex;
                background: #fff;
            }
        </style>
        <div id="table"></div>
        `
    document.body.insertAdjacentHTML("beforeend", styleDom)
    let dom1 = document.createElement('script')
    dom1.setAttribute('type','text/javascript')
    dom1.setAttribute('src','https://greasyfork.org/scripts/448541-dom-to-image-js/code/dom-to-imagejs.js?version=1074759')
    document.querySelector('html').appendChild(dom1)

})();