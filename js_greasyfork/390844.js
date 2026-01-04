// ==UserScript==
// @name         A岛只看po
// @namespace   adidfilter
// @version      0.3.2
// @description  向网页端添加只看PO功能,需要跨域权限访问三酱api
// @match        https://adnmb2.com/t/*
// @grant GM_xmlhttpRequest
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/390844/A%E5%B2%9B%E5%8F%AA%E7%9C%8Bpo.user.js
// @updateURL https://update.greasyfork.org/scripts/390844/A%E5%B2%9B%E5%8F%AA%E7%9C%8Bpo.meta.js
// ==/UserScript==

(function () {
    var threadsIinfo = document.getElementsByClassName('h-threads-info')[0];
    var POid = threadsIinfo.getElementsByClassName('h-threads-info-uid')[0];
    var ubutton = threadsIinfo.getElementsByClassName('h-threads-info-report-btn')[0].cloneNode(true);
    var uhref = ubutton.childNodes[1];
    uhref.setAttribute('href', 'javascript:;');
    uhref.innerHTML = '只看PO';
    threadsIinfo.insertBefore(ubutton, threadsIinfo.getElementsByClassName('h-threads-info-report-btn')[0]);
    uhref.onclick = function () {
        ubutton.style.display = 'none';
        var uid = []; //需要过滤的id
        var total = 0; //当前展示的过滤后页面数量
        var endflag; //请求的最大数量
        var runCount = 0; //用来区分首次运行
        var locker = 0; //防止同时请求
        var reply = []; //存放得到的页面数据
        var replyPtr; //用来防止重复过滤
        var filtered = []; //存放过滤后的回复
        var gtot = 0; //当前已获得的页面计数

        //页面信息
        var url = document.URL.split('/')[4];
        var thread = url.substring(0, url.indexOf('?'));
        thread = thread ? thread : url;
        var page = url.substring(url.indexOf('=') + 1); //论坛的page从1开始计算，脚本内处理成0开始计算
        page = url.indexOf('r=') != -1 ? 1 : parseInt(page);
        gtot = page = page != thread && page != 1 ? (page - 1) : 0;
        var pageCount; //总页面数量
        var pageCur; //已经向服务器请求过的页面数量
        var p = document.getElementsByClassName('h-threads-item-reply');
        p[0].setAttribute('id', 'top');
        var defaultUid = POid.innerText.substring(3);
        //ui
        var imgbox = document.createElement('div');
        imgbox.setAttribute('class', 'h-threads-img-box');
        imgbox.innerHTML = `<div class="h-threads-img-tool uk-animation-slide-top">
    <span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span>
    <a href="" target="_blank" class="h-threads-img-tool-btn uk-button-link"><i class="uk-icon-search-plus"></i>查看大图</a>
    <span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span>
    <span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span>
    </div>
    <a href="" rel="_blank" target="_blank" class="h-threads-img-a" style="height: 0px;"><img data-src="" src="" align="left" border="0" hspace="20" class="h-threads-img" style="top: 0px; left: 0px;"></a>`;
        var ctrlpanel = document.createElement('div');
        ctrlpanel.style = 'margin: 5px';
        var selector = document.createElement('select');
        selector.style = 'width: 4rem; height: 2rem; border: 1px solid rgba(0,0,0,.06);';
        selector.id = 'id-filter-select';
        selector.onchange = function () {
            render(this.options.selectedIndex);
        };
        var navigationBef = document.createElement('p');
        navigationBef.style.display = 'inline-block';
        navigationBef.innerHTML = '第';
        var navigationAft = document.createElement('p');
        navigationAft.style.display = 'inline-block';
        var buttonStyle = 'margin-left: 5px; color: #07d; background: #fff; height: 2rem; border: 1px solid rgba(0,0,0,.06);';
        var loadMore = document.createElement('button');
        loadMore.style = buttonStyle;
        loadMore.innerText = '加载更多';
        loadMore.onclick = function () {
            if (pageCur == pageCount) {
                alert('已经加载最后一页');
                return;
            }
            if (locker + 1 == runCount) {
                locker++;
                loadNewPage(30);
            } else
                alert('加载中，请稍等');
        };
        var lastPage = document.createElement('button');
        lastPage.style = buttonStyle;
        lastPage.innerText = '上一页';
        lastPage.onclick = function () {
            let c = selector.options.selectedIndex;
            if (c > 0) {
                selector.options.selectedIndex = c - 1;
                render(c - 1);
                $('html, body').animate({
                    scrollTop: $('#top').offset().top
                }, 600);
            }
        };
        var nextPage = document.createElement('button');
        nextPage.style = buttonStyle;
        nextPage.innerText = '下一页';
        nextPage.onclick = function () {
            let c = selector.options.selectedIndex;
            if (c != total - 1) {
                selector.options.selectedIndex = c + 1;
                render(c + 1);
                $('html, body').animate({
                    scrollTop: $('#top').offset().top
                }, 600);
            }
        };
        ctrlpanel.appendChild(navigationBef);
        ctrlpanel.appendChild(selector);
        ctrlpanel.appendChild(navigationAft);
        ctrlpanel.appendChild(loadMore);
        ctrlpanel.appendChild(lastPage);
        ctrlpanel.appendChild(nextPage);
        var msgDiv = document.createElement('div');
        msgDiv.className = 'h-threads-content';
        msgDiv.style.backgroundColor = '#f0e0d6';
        msgDiv.style.padding = '10px';
        msgDiv.style.margin = '10px';
        var info = document.createElement('p');
        info.innerHTML = '正在加载更多页面';
        var warning = document.createElement('p');
        if (page != 0) {
            warning.innerHTML = '当前是第' + (page + 1) + '页，脚本不会加载前' + page + '页的内容<br/>要查看之前的回复，请回到串的第1页再打开只看Po功能';
        }
        var progress = document.createElement('div');
        progress.setAttribute('value', 0);
        progress.setAttribute('max', 30);
        progress.style = 'list-style: none;font-size: 12px;line-height: 2em;background: #e9e5e2;background-image: -webkit-gradient(linear,left top,left bottom,from(#e1ddd9), to(#e9e5e2));height: 20px;border-radius: 10px;box-shadow: 0 1px 0 #bebbb9 inset, 0 1px 0 #fcfcfc;';
        var innerBar = document.createElement('div');
        innerBar.style = 'height: 18px;margin: 1px 2px;position: relative;border-radius: 9px;-webkit-box-shadow:0 1px 0 #fcfcfc inset, 0 1px 0 #bebbb9;box-shadow:0 1px 0 #fcfcfc inset, 0 1px 0 #bebbb9;background-color: #009e0c;     width: 0%;';
        progress.appendChild(innerBar);
        progress.setProgress = function (v) {
            let max = this.getAttribute('max');
            innerBar.style.width = (v / max) * 100 + '%';
        }
        msgDiv.appendChild(info);
        msgDiv.appendChild(warning);
        msgDiv.appendChild(progress);
        document.getElementsByClassName('uk-container')[0].insertBefore(msgDiv, document.getElementsByClassName('h-threads-list')[0]);
        //清除原内容
        let i = 0;
        try {
            for (; i < p.length; i++) {
                let img = p[i].getElementsByClassName('h-threads-img-box')[0];
                if (img)
                    img.innerHTML = '';
                let po = p[i].getElementsByClassName('uk-text-primary uk-text-small')[0];
                if (po)
                    p[i].getElementsByClassName('h-threads-info')[0].removeChild(po);
                let cont = p[i].getElementsByClassName('h-threads-content')[0];
                if (cont)
                    cont.innerHTML = '';
            }
        } catch (error) {
            alert('重写网页出现问题,刷新重试');
            window.history.go(0);
        }
        for (; i < 20; i++) {
            p[p.length - 1].after(p[0].cloneNode(true));
        }
        var pagination = document.getElementsByClassName('uk-pagination uk-pagination-left h-pagination')[0];
        pagination.parentNode.removeChild(pagination);
        //首次请求
        GM_xmlhttpRequest({
            method: 'get',
            headers: {
                cookie: document.cookie
            },
            url: 'https://nmb.fastmirror.org/api/thread?id=' + thread + '&page=' + (page + 1),
            onload: function (res) {
                let con = JSON.parse(res.response);
                reply[page] = con;
                pageCount = Math.ceil(con.replyCount / 19);
                progress.setAttribute('max', pageCount > 30 ? 30 : pageCount);
                pageCur = page + 1;
                if (pageCount > 1)
                    loadNewPage(30);
                else
                    finished();
            }
        });
        //shift:向后读取的页面数量
        function loadNewPage(shift) {
            let i;
            endflag = Math.min(pageCount, pageCur + shift);
            for (i = pageCur; i < endflag; i++)
                fetch(i, i - pageCur);
            pageCur = i;
        }
        //网络请求
        function fetch(i, t) {
            setTimeout(function () {
                GM_xmlhttpRequest({
                    method: 'get',
                    headers: {
                        cookie: document.cookie
                    },
                    url: 'https://nmb.fastmirror.org/api/thread?id=' + thread + '&page=' + (i + 1),
                    onload: function (res) {
                        let con = JSON.parse(res.response);
                        reply[i] = con;
                        gtot++;
                        if (gtot == endflag - 1) finished();
                        if (!runCount)
                            progress.setProgress(i + 1 - page);
                        else
                            loadMore.innerText = '加载更多 (' + (i + 1) + '/' + pageCount + ')';
                    }
                });
            }, 70 * t);
        }

        function finished() {
            if (!runCount)
                dialog();
            else {
                loadMore.innerText = '加载更多 (' + endflag + '/' + pageCount + ')';
                p = document.getElementsByClassName('h-threads-item-reply');
                //过滤部分
                for (let i = replyPtr + 1; i < reply.length; i++) {
                    for (let j = 0; j < reply[i].replys.length; j++)
                        for (let k = 0; k < uid.length; k++)
                            if (reply[i].replys[j].userid == uid[k]) {
                                filtered.push(reply[i].replys[j]);
                                break;
                            }
                }
                replyPtr = i;
                for (i = total; i < Math.ceil(filtered.length / 20); i++) {
                    let u = document.createElement('option');
                    u.innerText = i + 1;
                    selector.appendChild(u);
                }
                selector.options.selectedIndex = total;
                render(total);
                $('html, body').animate({
                    scrollTop: $('#top').offset().top
                }, 600);
                total = i;
                navigationAft.innerHTML = '共' + total + '页';
            }
            runCount++;
        }

        function dialog() {
            let uidd = prompt("要显示的饼干(用分号分隔多个)", defaultUid);
            if (!uidd) window.history.go(0);
            uid = uidd.split(';');
            p = document.getElementsByClassName('h-threads-item-reply');
            msgDiv.parentNode.removeChild(msgDiv);
            for (let i in reply)
                for (let j = 0; j < reply[i].replys.length; j++)
                    for (let k = 0; k < uid.length; k++)
                        if (reply[i].replys[j].userid == uid[k]) {
                            filtered.push(reply[i].replys[j]);
                            break;
                        }
            replyPtr = parseInt(i);
            render(0);
            for (i = 0; i < Math.ceil(filtered.length / 20); i++) {
                let u = document.createElement('option');
                u.innerText = i + 1;
                selector.appendChild(u);
            }
            total = i;
            navigationAft.innerHTML = '页（共' + total + '页）';
            document.getElementsByClassName('uk-container')[0].insertBefore(ctrlpanel, document.getElementsByClassName('uk-pagination.uk-pagination-left.h-pagination')[0]);
        }
        //展示过滤后内容
        function render(index) {
            index = index * 20;
            for (let i = 0; i < 20; i++) {
                let cont = p[i].getElementsByClassName('h-threads-content')[0];
                let info = p[i].getElementsByClassName('h-threads-info')[0];
                let length = filtered.length;
                let imgb = p[i].children[1].getElementsByClassName('h-threads-img-box')[0];
                if (imgb) {
                    p[i].children[1].removeChild(imgb);
                }
                if (i + index < length) {
                    let f = filtered[i + index];
                    info.children[0].innerText = f.title;
                    info.children[1].innerText = f.name;
                    info.children[2].innerText = f.now;
                    info.children[3].innerText = 'ID:' + f.userid;
                    info.children[4].children[0].setAttribute('href', '/f/值班室?r=' + f.id);
                    info.children[5].setAttribute('href', '/t/' + thread + '?r=' + f.id);
                    info.children[5].innerText = 'No.' + f.id;
                    cont.innerHTML = f.content;
                    if (f.img) {
                        let imgb = imgbox.cloneNode(true);
                        imgb.children[0].children[1].setAttribute('href', 'https://nmbimg.fastmirror.org/image/' + f.img + f.ext);
                        imgb.children[1].setAttribute('href', 'https://nmbimg.fastmirror.org/image/' + f.img + f.ext);
                        imgb.children[1].children[0].setAttribute('data-src', 'https://nmbimg.fastmirror.org/thumb/' + f.img + f.ext);
                        imgb.children[1].children[0].setAttribute('src', 'https://nmbimg.fastmirror.org/thumb/' + f.img + f.ext);
                        p[i].children[1].insertBefore(imgb, info);
                    }
                } else {
                    let f = {
                        content: '',
                        id: '',
                        img: '',
                        name: '无内容-点击底部按钮加载更多',
                        now: '',
                        title: '无标题',
                        userid: ''
                    };
                    filtered.push(f);
                    cont.innerHTML = f.content;
                    info.children[0].innerText = f.title;
                    info.children[1].innerText = f.name;
                    info.children[2].innerText = f.now;
                    info.children[3].innerText = f.userid;
                    info.children[5].innerText = 'No.' + f.id;
                }
            }
            //三酱的api
            initImageBox();
            initContent();
        }
    }
})();

//感谢阅读 欢迎改进( ´∀`)