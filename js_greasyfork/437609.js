// ==UserScript==
// @name              文库下载器
// @version           1.5.0
// @namespace         https://waahah.gitee.io
// @description       百度文库、淘豆网、豆丁网、道客巴巴、原创力文档解析下载功能 解除百度文库、淘豆网复制限制【保持原格式】界面简洁，脚本仅限学习，请大家支持正版。
// @author            waahah
// @antifeature       membership  百度文库需要输入验证码之后才能下载，淘豆网及豆丁网和道客巴巴等可直接导出PDF
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @require           https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require           https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @match             *://wenku.baidu.com/view/*
// @match             *://wenku.baidu.com/tfview/*
// @match             *://wenku.baidu.com/link?url*
// @match             *://wenku.baidu.com/share/*
// @match             *://www.doc88.com/p-*
// @match             *://www.docin.com/p-*
// @match             *://jz.docin.com/p-*
// @match             *://www.taodocs.com/p-*
// @match             *://file.taodocs.com/p-*
// @match             *://max.book118.com/html/*
// @license           Apache-2.0
// @icon              data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M13 13v5.585l1.828-1.828 1.415 1.415L12 22.414l-4.243-4.242 1.415-1.415L11 18.585V13h2zM12 2a7.001 7.001 0 0 1 6.954 6.194 5.5 5.5 0 0 1-.953 10.784v-2.014a3.5 3.5 0 1 0-1.112-6.91 5 5 0 1 0-9.777 0 3.5 3.5 0 0 0-1.292 6.88l.18.03v2.014a5.5 5.5 0 0 1-.954-10.784A7 7 0 0 1 12 2z'/%3E%3C/svg%3E
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/437609/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437609/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    /**
    * 遵循开源协议,转载请注明出处谢谢
    */
    'use strict';

    $(function () {

        let webUrl = window.location.href;
        let webUrl2;
        const path = window.location.pathname.split("/")[1];
        const host = location.host;
        const tfpath = location.href.split("/");
        const title = document.title.split(' - ')[0];
        const InterfaceList = [
            { "host": "wkdownload", "url": "http://www.mmhtml.com/zh/?url=" },
            { "host": "wenku.baidu.com", "func": "bdwk()", "el": "bdwk_ele" },
            { "host": "www.doc88.com", "func": "doc()", "el": "doc_ele" },
            { "host": "www.docin.com", "func": "docin()", "el": "docin_ele" },
            { "host": "jz.docin.com", "func": "docin()", "el": "docin_ele" },
            { "host": "www.taodocs.com", "func": "taodou()", "el": "taodou_ele" },
            { "host": "file.taodocs.com", "func": "taodou()", "el": "taodou_ele" },
            { "host": "max.book118.com", "func": "book118()", "el": "book118_ele" }
        ]
        function GMxmlhttpRequest(obj) {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest(obj);
            }
            else { GM.xmlhttpRequest(obj); }
        }
        function GMopenInTab(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            }
            else { GM.openInTab(url, open_in_background); }
        }
        const after = obj => {
            return obj.replace('/view/', '/share/').replace('.html', '') + '?share_api=1&width=800';
        }
        const css = css => {
            const myStyle = document.createElement('style');
            myStyle.textContent = css;
            const doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        }

        css(`#zuihuitao {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
			#zuihuitao .logo { position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: deepskyblue;}
			#zuihuitao .die {display:none; position:absolute; left:28px; top:0; text-align:center;background-color:#04B4AE; border:1px solid gray;}
			#zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 2px;list-style-type: none;}
			#zuihuitao .die li:hover{color:#fff;background:#FE2E64;}
            @media print {body {display: block !important;}}
            *{-webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text;}
			.add{background-color:#FE2E64;}
            .btn-success{position: fixed;font-weight: 400;color: #fff;background-color: #28a745;border-color: #28a745;text-align: center;vertical-align: middle;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;line-height: 1.5;border-radius: .25rem; z-index:2147483647;cursor: pointer;}`);


        const html = $(`<div id='zuihuitao'>
		    <div class='item_text'>
		        <div class="logo"><a id="m">文库下载</a></div>
		            <div class='die' >
		                <div style='display:flex;'>
		                    <div style='width:128px; padding:0px 0;'>
		                    <br>
		                        <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>bdwk解析</div>
		                        <ul style='margin:0 24px;'>
		                            <li id="li0">下载</li>
		                            <div style='clear:both;'></div>
		                        </ul>
		                        <br>
		                        <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>其它文库</div>
		                        <ul style='margin:0 25px;'>
		                            <li id="li2">导出PDF</li>
                                    <li id="li3">自动展开</li>
		                            <div style='clear:both;'></div>
		                        </ul>
		                        <br>
							</div>`);

        webUrl2 = after(webUrl);
        $("body").append(html);
        $(".item_text").on("mouseover", () => {
            $(".die").show();
        });
        $(".item_text").on("mouseout", () => {
            $(".die").hide();
        });
        console.log(document.lastModified);

        if (path == "link") {
            const base_url = "https://wenku.baidu.com/user/interface/layerpop?act=get&platform=pc&layer_id=8";
            const xhttp = new XMLHttpRequest();
            xhttp.open("GET", base_url);
            xhttp.send(null);
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('success');
                    let datas = xhttp.responseText;
                    //console.log(xhttp.responseText);
                    datas = JSON.parse(datas);
                    console.log(datas);
                    const have = datas.data[8].data.pageInfo;
                    if (have !== undefined) {
                        const url = have.referer;
                        console.log(url);
                        webUrl = url;
                        webUrl2 = after(url);
                    } else {
                        console.log('用户已登录账号 url为空,使用方案二');
                        const pageData = document.querySelector("body > script:nth-child(5)").innerText;
                        //console.log(pageData);
                        const DocId = pageData.indexOf('showDocId') + 12;
                        const StoreId = pageData.indexOf('showStoreId') - 3;
                        const showDocId = pageData.slice(DocId, StoreId);
                        const url = tfpath[0] + "//" + tfpath[2] + '/view/' + showDocId + ".html";
                        console.log(url);
                        webUrl = url;
                        webUrl2 = after(url);
                    }

                }
            }
        }
        if (path == "tfview") {
            const tfurl = tfpath[0] + "//" + tfpath[2] + "/view/" + tfpath[4];
            const tfurl2 = after(tfurl);
            console.log(tfurl);
            webUrl = tfurl;
            webUrl2 = tfurl2;
        }

        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const taodou_zhankai = () => {
            if (host == InterfaceList[5].host) {
                if (typeof inpmv != undefined) {
                    let btn = document.querySelector('.moreBtn.goBtn span');
                    if (btn) {
                        btn.click();
                    }
                }
            }
        }

        const share = () => {
            //console.log(webUrl);
            let FPS = 1000;
            let retime = setInterval(function () {
                let ph = document.body.scrollHeight;
                $(window).scrollTop(FPS, { behavior: 'smooth' });
                //ph = document.body.scrollHeight;
                FPS = FPS + 1000;
                taodou_zhankai();
                if (FPS > ph) {
                    clearInterval(retime);
                    /*setTimeout(function () {
                        window.print();
                        $(".logo").show();
                    }, 500);
                    */
                }
            }, 500)

        }

        const downloadPDF = (canvas, pdfName) => {
            /*
            window.scrollTo(0, 0);
            let eleW = ele.offsetWidth; // 获得该容器的宽
            let eleH = ele.offsetHeight; // 获得该容器的高
            let eleOffsetTop = ele.offsetTop; // 获得该容器到文档顶部的距离
            let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离

            var canvas = document.createElement("canvas");
            var abs = 0;

            let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
            let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

            if (win_out > win_in) {
                // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
                abs = (win_out - win_in) / 2; // 获得滚动条宽度的一半
                // console.log(a, '新abs');
            }
            canvas.width = eleW * 2; // 将画布宽&&高放大两倍
            canvas.height = eleH * 2;

            var context = canvas.getContext("2d");
            context.scale(2, 2);
            context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
            // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
            // translate 的时候，要把这个差值去掉

            html2canvas(ele, {
                dpi: 300,
                scale: 1,
                allowTaint: false,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
                useCORS: true, //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
            }).then((canvas) => {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 595.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 595.28 / contentWidth * contentHeight;
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jspdf.jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                // console.log('处理完画布高度：' + contentHeight)
                // console.log('每页高度：' + pageHeight)
                // console.log(imgWidth, imgHeight);

                if (leftHeight < pageHeight) {
                    //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                } else { // 分页
                    while (leftHeight > 10) {
                        // console.log(leftHeight)
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position -= 871.89;
                        //避免添加空白页
                        if (leftHeight > 10) {
                            pdf.addPage();
                        }
                    }
                }
                //可动态生成
                pdf.save(pdfName)
            })*/
            window.scrollTo(0, 0);
            let num = 0;
            let err_num = 0;
            let len_cas = canvas.length;
            var contentWidth = canvas[0].width;
            var contentHeight = canvas[0].height;
            //console.log(canvas);
            console.log(`canvas数据：宽: ${contentWidth}px，高: ${contentHeight}px`);

            const orientation = contentWidth > contentHeight ? 'l' : 'p';
            var pdf = new jspdf.jsPDF(orientation, 'px', [contentHeight, contentWidth]);
            for (const cas of canvas) {
                let pageData = cas;
                num += 1;
                try{
                    pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);
                }catch(err){
                    console.log(err);
                    err_num += 1;
                    //continue;
                }
                if (num < len_cas) {
                    pdf.addPage();
                }
            }

            pdf.save(`${pdfName}.pdf`);
            if(err_num){
                alert(`有 ${err_num} 页未加载！`);
            }
        }

        const clipboardCopy = text => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textarea.style.position = 'fixed';
                textarea.style.clip = 'rect(0 0 0 0)';
                textarea.style.top = '10px';
                textarea.value = text;
                textarea.select();
                document.execCommand('copy', true);
                document.body.removeChild(textarea);
            }
        }

        const replica = (selectText = true) => {
            /**
             * 灵感来源于https://greasyfork.org/zh-CN/scripts/445128
             */

            try {
                if (host == InterfaceList[1].host) {
                    let text = $('div.link')[0].outerText.split("”的文档")[0].split("查看全部包含“")[1];
                    clipboardCopy(text);
                    $('.dialog-mask').remove();
                    $('.copy-limit-dialog-v2').remove();
                } else if (host == InterfaceList[5].host) {
                    $('.sel_tips').remove();
                    let selectedText = window.getSelection().toString();
                    if (selectedText == '') {
                        clipboardCopy(selectText);
                    } else {
                        clipboardCopy(selectedText);
                    }
                }
            } catch (error) {
                console.log(error.stack)
                text = "出错啦，请通知作者修复";
                throw new Error(`Error: ${error}`);
            }

        }

        (() => {
            let oldtext = "";
            let count = 0;
            if (host == InterfaceList[1].host || host == InterfaceList[5].host) {
                $(document).unbind('keydown').bind('keydown', e => {
                    if (e.ctrlKey && e.keyCode == 67) {
                        replica();
                        $(".btn-success").text("复制成功").fadeOut(1000);
                        e.preventDefault();
                        count += 1;
                        //return false;
                    }
                })

                document.onmouseup = ev => {
                    let nowtext;
                    $(".btn-success").remove();
                    if (host == InterfaceList[1].host) {
                        nowtext = $('div.link')[0].outerText.split("”的文档")[0].split("查看全部包含“")[1];
                    } else if (host == InterfaceList[5].host) {
                        let selectedText = window.getSelection().toString();
                        if (selectedText) {
                            nowtext = selectedText;
                        }
                    }

                    if (nowtext != oldtext) {
                        const oEvent = ev || event;
                        const elbtn = $(`<div class="btn-success" style="left:${oEvent.clientX + 15 + 'px'}; top: ${oEvent.clientY - 10 + 'px'};">复制</div>`);
                        $("body").append(elbtn);
                        oldtext = nowtext;
                        $("#reader-helper").hide();
                    }

                    $(".btn-success").on("click", e => {
                        replica(nowtext);
                        count += 1;
                        console.info(`第${count}次为您复制,内容为：${nowtext}`);
                        //$(".btn-success").fadeOut(1000);
                    }).on("mouseup", e => {
                        $(".btn-success").text("复制成功");
                        $(".btn-success").fadeOut(1000);
                        e.stopPropagation();
                        e.preventDefault();
                    })
                }
            }
        })();

        const del = el => {
            $(el).remove();
        }

        const bdwk_ele = ['.read-all', '.header-wrapper', '.no-full-screen', '.no-full-screen', '.lazy-load',
            '.reader-topbar', '.content-wrapper+div', '.hx-warp', '.try-end-fold-page',
            '#page-footer', '#reader-container+div', '#passport-login-pop'
        ]
        const doc_ele = ['#continueButton', '#header', '#toolbar', '#box1', '#boxright', '#readEndDiv', '.commonbox1',
            '#commentDiv', '.clearfix', '#footer', '.dk-bg', '.toplayer-shop', '.activelist'
        ]
        const docin_ele = ['.model-fold-show', '.page_crubms clear', '.doc_header_mod', '.aside', '#j_isend',
            '#docinShareSlider', '.backToTop', '.reader_tools_bar_wrap.tools_bar_small.clear',
            '.page_crubms.clear', '.adBox', '#jControlDiv'
        ]
        const taodou_ele = ['span.fc2e', '.sel_tips']
        const book118_ele = ['#btn_preview_remain']

        const bdwk = () => {
            $(".logo").hide();
            $(".die").hide();
            share();
            setTimeout(() => {
                window.print();
                $(".logo").show();
            }, 1000);
        }

        const doc = () => {
            const ele = document.querySelectorAll('canvas.inner_page');
            try {
                downloadPDF(ele, title);
            } catch (error) {
                //TODO handle the exception
                console.log(error.stack);
            }
        }

        const docin = () => {
            const ele = document.querySelectorAll('canvas');
            try {
                downloadPDF(ele, title);

            } catch (error) {
                console.log(error.message);
            }
        }

        const taodou = () => {
            let ele = document.querySelectorAll('.textLayer_div canvas');
            if (ele.length == 0) {
                ele = document.querySelectorAll('img.errorimg');
                if (ele.length == 0) {
                    ele = document.querySelectorAll('img');
                }
            }
            try {
                downloadPDF(ele, title);

            } catch (error) {
                console.log(error.message);
            }
        }

        const book118 = () => {
            const ele = document.querySelectorAll('.webpreview-item img');
            try {
                downloadPDF(ele, title);

            } catch (error) {
                console.log(error);
            }
        }

        const main = () => {
            for (const even in InterfaceList) {
                if (host == InterfaceList[even].host) {
                    let ee = InterfaceList[even].el;
                    $(eval(ee)[0]).click();
                    for (const el of eval(ee)) {
                        del(el);
                    }
                    eval(InterfaceList[even].func);
                    break;
                }
            }
        }

        $("#li0").bind("click", e => {
            if (host == InterfaceList[1].host) {
                window.open(InterfaceList[0].url + webUrl);
            } else {
                e.preventDefault();
                alert('百度文库解析，其它文库请使用导出PDF');
            }
        });
        $("#li2").bind("click", () => {
            if (confirm('请确保每一页都加载完再打印，是否打印？')) {
                main();
            }
        });
        $("#li3").on("click", () => {
            for (const even in InterfaceList) {
                if (host == InterfaceList[even].host) {
                    let ee = InterfaceList[even].el;
                    $(eval(ee)[0]).click();
                    break;
                }
            }
            $('.die').hide();
            share();
        });

    });

})();