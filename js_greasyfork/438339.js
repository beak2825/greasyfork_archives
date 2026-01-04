// ==UserScript==
// @name         CCAV Plus
// @namespace      https://greasyfork.org/users/3128
// @version      0.1.4
// @description    百度网盘特殊下载支持
// @author       Q1152521990
// @match        https://www.yuwox.com/*
// @match        https://www.xiurenji.net/*
// @match        https://www.xiurenb.net/*
// @match        https://www.xrmn5.cc/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/438339/CCAV%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/438339/CCAV%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let u=unsafeWindow,
        webHost=location.host.toLowerCase(),
        webDomain=webHost.replace(/^www\./i,''),
        GM_webDomain,
        webPath=location.pathname.toLowerCase();

    let HostRule={
        'xiurenji.net': {
            CSS: `a>img.waitpic{box-sizing:border-box;border:solid 5px #ccc;} a:visited>img.waitpic{box-sizing:border-box;border:solid 5px red!important;}
            .sousuo a:visited > span{color:#ccc!important;}`,
            callback: ()=>{
                let GM_values=StorageDB_GM(GM_webDomain, 'Favs').read();
                $('.i_list>a').map(function(){
                    let thisID=this.href.match(/(\d+)(?:_\d+)?.html/)[1];
                    if(GM_values[thisID]) {
                        console.log(thisID, this, $(this).hasClass('GM_Visited'));
                        if(!$(this).hasClass('GM_Visited')) $(this).addClass('GM_Visited');
                    }
                });


                if(/\/\w+\/\d+(?:_\d+)?\.html/i.test(location.href)) {
                    let currentPageID=location.href.match(/(\d+)(?:_\d+)?.html/)[1],
                        pageMax=$('.page>a:last').text()=='下页'?$('.page>a:last').prev().text():$('.page>a:last').text();
                    let ImgList=[];

                    if(/\/\w+\/\d+\.html/i.test(location.href)) { //只在第一页触发
                        StorageDB_GM(GM_webDomain, 'Favs').add(currentPageID, 'visited');

                        // $('.content>p').empty(); //清空内容
                        async function getImgUrl(array){
                            const ret = [];
                            return new Promise(async (resolve, reject) => {
                                try {
                                    for(let currentPage=0;currentPage<(+pageMax);currentPage++) {
                                        let PageID = currentPage==0 ? `/${currentPageID}.html` : `/${currentPageID}_${currentPage}.html`,
                                            PageUrl = location.pathname.replace(/\/[^/.]+\.html/i, PageID);

                                        await $.get(PageUrl, (res,s,e)=>{
                                            $('.content img', res).map(function(i, e){
                                                ImgList.push(this.src);
                                                //$('.content>p').append($('<img>').attr({'src': this.src}))
                                                //console.log(PageID, i, e, this.src)
                                            });
                                        })
                                    }
                                } catch(e){
                                    console.error(e);
                                } finally {//遍历完毕后执行
                                    let author=$('a[rel="author"]').text()
                                    startDownload(ImgList, `[${GM_webDomain}][${author}][${currentPageID}]${$('.item_title>h1').text()}`);
                                }
                            })
                        }
                        getImgUrl();
                    }
                }
            }
        },
        'yuwox.com': { //尤物偶像
            CSSRule: 'WP',
            callback: ()=>{
                let PostID=$('.go-down').data('id');
                $('.swal2-close').click(); //关闭公告
                $('.cao-cover').remove(); //移除封面点击阻挡
                if(PostID) {
                    let PanUrl, PanBox=$('<div>').text('下载地址：').append($('<a id="PanUrl" href="#" style="color:red;">').text('加载中...'));
                    $('.article-copyright').prepend(PanBox); //添加下载链接
                    $('.container>.entry-wrapper').parent().prepend($('.article-copyright')); //移动信息位置至内容顶部

                    $('h1.entry-title').click(function(e){
                        let unZip=$('.article-copyright').text().match(/解压密码：([\w.]+)/)[1];
                        GM_setClipboard(`[${unZip}][${PostID}]${$(this).text()}`);
                    });
                    $('.article-copyright').click(function(e){
                        let unZip=$('.article-copyright').text().match(/解压密码：([\w.]+)/)[1];
                        GM_setClipboard(`${unZip}`);
                    });

                    //获取下载地址，需权限
                    $.get(`/go?post_id=${PostID}`, (r,s,e)=>{
                        PanUrl=r.match(/window.location='([^']+?)';/i)[1];
                        $('#PanUrl').attr('href', PanUrl).text(PanUrl);
                        //嵌入网盘地址窗口
                        $('<iframe seamless style="height:400px;">').attr('src', PanUrl+"&pwd="+$('#refurl').text()).insertAfter('.article-copyright');
                        //sandbox="allow-same-origin allow-forms"
                    });

                    /*$.post('/wp-admin/admin-ajax.php', {action: 'user_down_ajax', post_id: PostID}, (r,s,e)=>{
                    console.log(s,e,r);
                })*/
                }
            }
        },
        'shoucangzhe.top': {}
    }
    let HostList={
        'xiurenji.net': ['xiurenji.top','xiurenb.net','xrmn5.cc']
    }
    for(let key in HostList)
        for(let site of HostList[key]) {
            HostRule[site]=HostRule[key];
            HostRule[site].clone=key; //标记规则克隆于哪个网站
        }

    if(HostRule[webDomain]) {
        let Conf=HostRule[webDomain];
        GM_webDomain=Conf.clone||webDomain; //GM数据接口域名
        Conf.callback();
        if(Conf.CSSRule) GM_addStyle(`${CSSRule[Conf.CSSRule]}`);
        if(Conf.CSS) GM_addStyle(`${Conf.CSS}`);
        GM_addStyle(`
            .GM_Visited > img {box-sizing:border-box;border:solid 5px #b90233!important;//#19c86b = 绿色
            }
            `);
    }

    let CSSRule={
        WP: `[id="post-"] a:visited>img{box-sizing:border-box;border:solid 5px red;}`
    }

    let padZero = (n) => (num) => {//n = 补充数量，num = 数值类型强制转换
        if (typeof num === 'number') {
            num += '';
        }
        return num.padStart(n, '0');//补0
    }

    function requestUrlBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: 'get',
                responseType : 'blob',
                onload :  res => resolve(res.response),
                onerror : e => reject(e)
            });
        })
    }

    async function startDownload(ImgList, zipName, poolLimit = 10) { // zipName = 压缩包名字，poolLimit = 并行现在限制，某些网站服务器可能会限制并发请求数量
        const zipPack = new window.JSZip();
        const urlObjList = ImgList.map((url, idx) =>({url, filename: padZero(3)(idx),}))
        const taskLength = ImgList.length;
        let download_Progress_Count=0;

        console.log('开始下载');
        console.time()
        await asyncPool(poolLimit, urlObjList, ({ url, filename }) => {//此处有问题，导致后续代码异常，此处结果需要为 Promise，poolLimit = 并行限制，0为不限制（推荐5~10）
            let task=downloadAndPackFile(zipPack, taskLength, url, filename);
            download_Progress_Count++;
            $('.download_progress_bar').css("width", `${download_Progress_Count/taskLength*100}%`);
            console.timeStamp(download_Progress_Count);
            return task; //返回的结果为 Promise
        }).then(()=>{
            console.timeEnd();
            zipPack.generateAsync({type: 'blob' }, function(metadata) {
                //let progress = metadata.percent / 100;
                 let prigress=parseInt(metadata.percent)
                //console.log(`zipPack：`, metadata, `完成进度：`, prigress);
                $('.pack_progress_bar').css('width', `${prigress}%`);
                $('.pack_Rrogress_percent').text(`${prigress}%`);
            }).then(
                function (data) {
                    console.log('触发保存操作', data)
                    // 1) generate the zip file
                    window.saveAs(data, `${zipName}.zip`); // 2) trigger the download
                },
                function (err) {
                    console.error('[批量下载] ERR', err);
                }
            );
            console.log('资源下载完成，开始打包资源', zipName);
        });

        console.log('等待资源下载...')
    }

    async function downloadAndPackFile(zipPack, taskLength, url, filename, extname) {
        if (!extname) {
            const urlExt = url.split('.').pop();
            extname = urlExt ? `.${urlExt}` : '';
        }

        console.log('正在下载', taskLength, filename, url);
        return await requestUrlBlob(url).catch(e=>{
            throw console.warn(`下载失败，重新下载`, url, filename, e);
            downloadAndPackFile(zipPack, taskLength, url, filename, extname);
        }).then(blob => {
            console.log(`下载完成`, url, blob, filename);
            zipPack.file(`${filename}${extname}`, blob);
        });
        return result;
    }

    async function asyncPool(poolLimit, array, iteratorFn) { //通过任务池限制并发数量，任务池 poolLimit=任务上限，array=任务对象，iteratorFn=任务内容
        const ret = [];
        const executing = [];

        for (const item of array) {
            /*此处需要改进，需要确认 blob 执行完成*/
            const task = Promise.resolve().then(() => { //iteratorFn = downloadAndPackFile，强制将下载线程转换为Promise
                return iteratorFn(item, array);//返回的结果需要为 Promise
            }); //返回的结果需要为 Promise，否则添加到任务队列 await 无法生效
            ret.push(task);

            if(poolLimit) {
                if (poolLimit <= array.length) { //限制并发数量
                    const e = task.then(() => executing.splice(executing.indexOf(e), 1));
                    executing.push(e);
                    if (executing.length >= poolLimit) {
                        await Promise.race(executing);
                    }
                }
            }
        }
        return Promise.all(ret); //等待任务队列完成
    }
    let downloadWrap=$('<div>'), downloadButton=$('<button value="下载套图">下载套图</button>').click(()=>{
        startDownload();
    }), Process=$('<div class="Download_Progress"><div class="download_progress_bar"><div class="pack_progress_bar"><span class="pack_Rrogress_percent">');
    downloadWrap.append(downloadButton, Process).prependTo('body')
    GM_addStyle(`
    .Download_Progress{display:inline-block;width:1000px;
    height: 30px;
    line-height: 35px;
    background: #809495;
    box-shadow: none;
    padding: 6px;
    overflow: visible;
    border-radius:10px;
}

.Download_Progress {
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1)
}
.Download_Progress:after{
    content: "";
    display: block;
    border-top: 4px dashed #fff;
    margin-top:8px;
}
.progressbar-title{
    color:#d8dedc;
    font-size:15px;
    margin:5px 0;
    font-weight: bold;
}
.Download_Progress .pack_progress_bar{
    position: relative;
    border-radius: 10px 0 0 10px;
    animation: animate-positive 2s;
}
.Download_Progress .pack_progress_bar span{
    position: absolute;
    top: -50px;
    right: -40px;
    color: #fff;
    display: block;
    font-size: 17px;
    font-weight: bold;
    padding: 5px 7px;
    background: #333;
    border-radius: 0 0 5px 5px;
}
.Download_Progress .pack_progress_bar span:before{
    content: "";
    position: absolute;
    bottom: -14px;
    left: 18px;
    border: 7px solid transparent;
    border-top: 7px solid #333;
}
.Download_Progress .pack_progress_bar span:after{
    content: "\f072";
    font-family: fontawesome;
    font-size: 48px;
    color: #333;
    position: absolute;
    top: 51px;
    right: 6px;
    transform: rotateZ(48deg);
}
@keyframes animate-positive {
    0% { width:0%; }
}

@keyframes pack_progress_bar-stripes {
    from {
        background-position: 40px 0
    }

    to {
        background-position: 0 0
    }
}

.download_progress_bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #51d837;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    transition: width .6s ease
}
.pack_progress_bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    transition: width .6s ease
}

.pack_progress_bar-striped,.progress-striped .pack_progress_bar {
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-size: 40px 40px
}

.pack_progress_bar.active,.progress.active .pack_progress_bar {
    -webkit-animation: pack_progress_bar-stripes 2s linear infinite;
    -o-animation: pack_progress_bar-stripes 2s linear infinite;
    animation: pack_progress_bar-stripes 2s linear infinite
}

.pack_progress_bar-success {
    background-color: #5cb85c
}

.progress-striped .pack_progress_bar-success {
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)
}

.pack_progress_bar-info {
    background-color: #5bc0de
}

.progress-striped .pack_progress_bar-info {
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)
}

.pack_progress_bar-warning {
    background-color: #f0ad4e
}

.progress-striped .pack_progress_bar-warning {
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)
}

.pack_progress_bar-danger {
    background-color: #d9534f
}

.progress-striped .pack_progress_bar-danger {
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)
}
    `);
    // Your code here...
    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

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
        } else {
            return null;
        }
    }

    function StorageDB_GM(collectionName, key) { //collectionName = 对应的 GM_value 表，key = 表中的键名
        let DB=GM_getValue(collectionName) ? GM_getValue(collectionName) : {};
        if(!key) {
            console.warn('缺乏 key 键值，无法进行数据添加');
            return false;
        }
        if(!DB[key]) {
            DB.length = DB.length ? DB.length++ : 1 ;
            DB[key]={};
            DB[key].length = DB[key].length ? DB[key].length++ : 0;
        }

        return {
            add : function(name, value) {
                if(!DB[key][name]) DB[key].length++; //已存在数据则不修改长度
                DB[key][name]=value;
                GM_setValue(collectionName, DB);
            },
            del : function(name) {
                if(DB[key][name]) {
                    delete DB[key][name];
                    DB[key].length--;
                    GM_setValue(collectionName, DB);
                }
            },
            replace : function(obj){ //整个 key 键值的数据进行替换
                console.log(key, obj);
                DB[key]=obj;
                GM_setValue(collectionName, DB);
            },
            insert : function(obj){ //整个 key 键值的数据进行替换
                console.log(key, obj);
                DB[key]=obj;
                GM_setValue(collectionName, DB);
            },
            query : function(name){
                return DB[key][name];
            },
            read : function(name){
                if(key) {
                    if(!$.isEmptyObject(DB[key])) { //检查对象是否不为空
                        if(name) return DB[key][name]; //如果查询指定键名
                        return DB[key]; //未指定键名，则返回整个对象
                    }
                    return null;
                }
                return $.isEmptyObject(DB)?null:DB;//如果为空，则返回 null
            },
            visited : function(target){
                if(!$(target).has('GM_Visited')) target.addClass('GM_Visited');
            },
            watch : function(PostID, obj){//监听 Storage 事件
                console.log(this);
                return false;
                var FindID=StorageDB_GM(host, key).find(PostID);
                console.log(PostID, obj, FindID);
                if(FindID) {
                    switch(FindID){
                        case 'Cut':
                            if($(obj).find('.watchCut').length==0) $('<div class="watchCut"></div>').prependTo(obj);
                            break;
                        case 'visited':
                            if($(obj).find('.watchVisited').length==0) $('<div class="watchVisited"></div>').prependTo(obj);
                            break;
                        default:
                            if($(obj).find('.watchLike').length==0) $('<div class="watchLike">❤</div>').prependTo(obj);
                            break;
                    }
                }
                GM_addStyle('.watchCut{position: absolute;width:180px;height: 170px;background-color: red;opacity: 0.5;} .watchVisited{position: absolute;width:180px;height: 170px;background-color: #7cc7f8;opacity: 0.5;} .watchLike{position: absolute;width:30px;height:30px;background-color: #ccc;font-size:30px;color:red;line-height:1.1;}');
            },
            listen : function(target_a, className, callback){ //该函数用于非 A 标签对象的监听
                console.log('开始监听');
                window.addEventListener('storage', function(e){
                    let monitor=localStorage['GM_Visited'];
                    console.log(monitor);
                    if(monitor) {
                        let monitor_JSON=JSON.parse(monitor);
                        if(monitor_JSON.id) {
                            let target_img=$('img', target_a);
                                    console.log(target_a);
                            switch(monitor_JSON.stats) {
                                case 'visited':
                                    if(!target_a.hasClass('Favorite')) target_a.addClass('thumb_Favorite');
                                case 'Favs':
                                    if(!target_a.hasClass('Favorite')) target_a.addClass('thumb_Favorite');
                                    break;
                                case 'dis':
                                    if(!target_a.hasClass('Favorite')) target_a.addClass('disBox');
                                case 'cancel':
                                    target_a.removeClass('Favorite');
                                    break;
                            }
                        }
                        //StorageDB_GM(host, 'Favs').watch(monitor_JSON, $('#p'+localStorage['Visited']));
                    }
                }, true);
                if(callback) callback();
            }
        }
    }
})();