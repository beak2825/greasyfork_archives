// ==UserScript==
// @name         ohmanhua下载
// @namespace    https://greasyfork.org/zh-CN/scripts/409471
// @homepageURL  https://greasyfork.org/zh-CN/scripts/409471
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @require      https://unpkg.com/jszip@3.5.0/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @include      http*://www.ohmanhua.com/*/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409471/ohmanhua%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/409471/ohmanhua%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 样式
    GM_addStyle(`
.my_download{
margin-left: 20px;
display: inline-block;
}
.my_input {
    width: 60px;
    border: 1px solid #ccc;
}
.my_btn_download{
padding: 2px;
}
.my_download_iframe{
/*display:none;*/
}

        .my_progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            background: #eee;
            max-height: 100%;
            overflow-y: auto;
            padding: 5px;
            z-index: 99999999;
            border: 1px solid #fff;
        }
        .my_page{
            margin-top: 5px;
            border-top: 1px dotted #000;
        }
        .my_page_pics{
            display: flex;
            flex-wrap: wrap;
        }
        .my_page_pic{
            width: 10%;
            text-align: center;
            box-sizing: border-box;
            position: relative;
        }
        .my_page_pic_box{
            margin: 1px;
	        position: relative;
	        overflow: hidden;
        }
        .my_page_pic_text{
            margin: 0px;
            padding: 2px;
            background: #fff;
        }
        .my_page_pic_loading .my_page_pic_text{
            margin: 2px;
            padding: 0px;
        }
        .my_page_pic_success .my_page_pic_text{
            background: lawngreen;
        }
        .my_page_pic_fail .my_page_pic_text{
            background: orangered;
        }

@keyframes rotate {
	100% {
		transform: rotate(1turn);
	}
}
.my_page_pic_loading .my_page_pic_box::before {
		content: '';
		position: absolute;
		z-index: -2;
		left: -50%;
		top: -50%;
		width: 200%;
		height: 200%;
		background-repeat: no-repeat;
		background-size: 50% 50%, 50% 50%;
		background-position: 0 0, 100% 0, 100% 100%, 0 100%;
		/*
        background-color: #399953;
		background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5);
        */
		background-color: #fff;
		background-image: linear-gradient(#aaa, #aaa), linear-gradient(#fff, #fff), linear-gradient(#aaa, #aaa), linear-gradient(#fff, #fff);
		animation: rotate 4s linear infinite;
}

.lds-dual-ring {
  display: inline-block;
  width: 14px;
  height: 14px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #aaa;
  border-color: #aaa transparent #aaa transparent;
  animation: lds-dual-ring 2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

`);

    var zip = new JSZip();

    // 下载进度界面
    function progress(){
        return `<div class="my_progress">
    <div class="my_title">
    </div>
    <div class="my_pages">
    </div>
</div>
`;
    }

    function progressPage(){
        return `
        <div class="my_page">
            <div class="my_page_title">
            </div>
            <div class="my_page_pics">
            </div>
        </div>
`;
    }
    function progressPagePic(){
        return `
                <div class="my_page_pic">
                    <div class="my_page_pic_box">
                        <div class="my_page_pic_text"></div>
                    </div>
                </div>
`;
    }


    // 添加下载按钮
    $('.website_add_to_fav').after(`
<div class="my_download">
<input id="my_begin" class="my_input" type="text" placeholder="起始" value="0"/>
<input id="my_end" class="my_input" type="text" placeholder="结束" value="${$('.all_data_list a').length - 1}"/>
<button class="my_btn_download">下载漫画</button>
</div>
`);

    // 下载按钮动作
    $('.my_btn_download').on('click', function () {
        $(this).attr('disabled',true);
        $('body').append(progress());
        $('.my_title').html('正在下载...');
        var begin = $('#my_begin').val();
        var end = $('#my_end').val();
        var queue = new Queue();
        // 设置连续阅读获取总页数
        document.cookie = "mh_readmode=3";
        // 获取漫画列表
        $('.all_data_list a').each(function (index) {
            var $this = $(this);
            if(index >= begin && index <= end){
                var url = $this.attr('href');
                // 进度
                var $progressPage = $(progressPage());
                $progressPage.attr('id',url);
                $progressPage.find('.my_page_title').html($this.text());
                $('.my_pages').append($progressPage);

                // 加入队列
                queue.queueAdd(index, queuePage({
                    url: $this.attr('href'),
                    progressPage: $progressPage
                }));
            }
        });

        // 开始任务;
        queue.queueStart().then(function(){
            //console.log('生成zip中');
            $('.my_title').html('生成zip中...');
            // 完成了就打包下载
            zip.generateAsync({type: "blob"}).then(function (content) {
                // content就是blob数据，这里以example.zip名称下载
                // 使用了FileSaver.js
                $('.my_title').html('完成');
                saveAs(content, $('[property="og:comic:book_name"]').attr('content') + ".zip");
            });
        }).catch(function(data){
            $(this).attr('disabled',false);
            $(this).html('重新下载');
            $('.my_title').html('部分集数保存失败');
        });;
    });

    // 漫画某一话的队列
    function queuePage(param){
        return function () {
            return new Promise(function (resolve, reject) {
                var $my_page_title = param.progressPage.find('.my_page_title');
                $my_page_title.append('<div class="lds-dual-ring"></div>')
                var $iframe = $(`<iframe class="my_download_iframe"></iframe>`);
                $iframe.on('load',function () {
                    var $iframe = $(this);
                    var cw = $iframe[0].contentWindow;
                    //console.log($iframe[0].contentWindow.mh_info);
                    //console.log($iframe[0].contentWindow.__cr.getPicUrl(1));
                    if(typeof cw === "undefined"){
                        reject('iframe的contentWindow不存在');
                        return;
                    }
                    if(typeof cw.mh_info === "undefined"){
                        reject('iframe.contentWindow.mh_info不存在');
                        return;
                    }
                    if(typeof cw.mh_info.pagename === "undefined"){
                        reject('iframe.contentWindow.mh_info.pagename不存在');
                        return;
                    }
                    if(typeof cw.__cr === "undefined"){
                        reject('iframe.contentWindow.__cr不存在');
                        return;
                    }
                    if(typeof cw.__cr.getPicUrl === "undefined"){
                        reject('iframe.contentWindow.__cr.getPicUrl不存在');
                        return;
                    }
                    var total_img = 0;

                    new Promise(function (resolve, reject) {
                        var times = 0;
                        var maxTimes = 100;
                        var timer1 = setInterval(function(){
                            times++;
                            total_img = $iframe.contents().find('.mh_comicpic').length;
                            //console.log(total_img);
                            if(total_img > 0){
                                clearInterval(timer1);
                                resolve();
                                return;
                            }
                            if(times > maxTimes){
                                clearInterval(timer1);
                                reject('total_img获取失败');
                                return;
                            }
                        },100);
                    }).then(function(){
                        var mh_info = cw.mh_info;
                        var __cr = cw.__cr;
                        //console.log('页的queue开始'+mh_info.pagename);
                        var queue = new Queue();
                        //console.log(mh_info);
                        for(var i=1;i<=total_img;i++){
                            // 进度
                            var $progressPagePic = $(progressPagePic());
                            $progressPagePic.find('.my_page_pic_text').html(i);
                            param.progressPage.find('.my_page_pics').append($progressPagePic);

                            // 加入队列
                            queue.queueAdd(i, queuePagePic({
                                url: __cr.getPicUrl(i),
                                zip: zip.folder(mh_info.pagename),
                                progressPagePic: $progressPagePic
                            }));
                        }
                        queue.queueStart().then(function(){
                            //console.log('页面完成');
                            resolve();
                        }).catch(function(data){
                            //console.log('页面失败');
                            //console.log(data);
                            //todo: 处理失败的页
                            reject(mh_info.pagename + '部分图片保存失败');
                        }).finally(function(){
                            $my_page_title.find('.lds-dual-ring').remove();
                            $iframe.remove();
                        });
                    }).catch(function(data){
                        reject(data);
                    });
                });
                $iframe.attr('src',param.url);
                $('body').append($iframe);
            });
        };
    }

    // 漫画某一张图的队列
    function queuePagePic(param){
        return function () {
            return new Promise(function (resolve, reject) {
                //console.log('图的queue开始'+param.url);
                param.progressPagePic.addClass('my_page_pic_loading');
                GM_xmlhttpRequest({
                    method: "GET",
                    responseType: "arraybuffer",
                    url: param.url,
                    onload: function (response) {
                        var filename = param.url.substring(param.url.lastIndexOf("/")+1);
                        var data = response.response;
                        //console.log('success:'+param.url);
                        //console.log(data);
                        param.zip.file(filename, data, {binary: true});
                        param.progressPagePic.addClass('my_page_pic_success');
                        param.progressPagePic.removeClass('my_page_pic_loading');
                        resolve();
                    },
                    onerror: function () {
                        //todo: 处理失败的图片
                        param.progressPagePic.addClass('my_page_pic_fail');
                        param.progressPagePic.removeClass('my_page_pic_loading');
                        reject(param);
                    }
                });
            });
        };
    }

    // 任务队列
    function Queue() {
        var that = this;
        that.queueNum = 5; // 同时进行的数量

        var queueList = {}; // 待运行任务列表
        var queueFail = {}; // 失败任务列表
        var queueNow = {}; // 进行中的任务列表
        var queueNum = that.queueNum; // 同时进行的数量

        // 消息队列
        that.queueAdd = function (k, q) {
            queueList[k] = q;
        };


        function queueRun(i) {
            return new Promise(function (resolve, reject) {
                if (Object.keys(queueList).length > 0) {
                    var key = Object.keys(queueList)[0];
                    var q = queueNow[key] = queueList[key];
                    delete queueList[key];
                    if (q instanceof Function) {
                        var p = q();
                        if (p instanceof Promise) {
                            p.then(function (value) {
                                delete queueNow[key];
                            }).catch(function (reason) {
                                queueFail[key] = q;
                            }).finally(function () {
                                //console.log('No.Promise:' + i);
                                if (Object.keys(queueList).length > 0) {
                                    queueRun(i).then(function (result) {
                                        resolve();
                                    });
                                } else {
                                    resolve();
                                }
                            });
                        }
                    }
                } else {
                    resolve();
                }
            })
        }

        // 开始 （逻辑上应该是只要queueList里的任务没有清0，queueAdd都有效，清零之后queueAdd就无效了，可以做个状态来判断queueAdd是否可以执行，不过懒得做了）
        that.queueStart = function () {
            return new Promise(function (resolve, reject) {
                var promises = [];
                for (var i = 0; i < that.queueNum; i++) {
                    promises.push(queueRun(i));
                }
                Promise.all(promises).then(function () {
                    //console.log('queue over');
                    if (Object.keys(queueList).length === 0 && Object.keys(queueNow).length === 0) {
                        if (Object.keys(queueFail).length === 0) {
                            //console.log('queue  resolve');
                            resolve();
                        } else {
                            //console.log('queue  reject');
                            reject(queueFail);
                        }
                    }
                });

            })
        };
    }
})();

