// ==UserScript==
// @name         书屋-手机版
// @namespace    http://tampermonkey.net/
// @description  对于书屋功能的一些优化
// @author       书山虫
// @version      2.1
// @match        https://wap.cool18.com/index.php?app=index&act=view&cid=*
// @icon         data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAIAAAB+eU8wAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAJESURBVEhL7ZexSgNBEIbzNla+hY8g+AA2tlZ2WllZCtZinc4iViLaiJBGQQQtRLQQ1MIiFkLOb+9f5y43e2dyMdpkGI7Z2dn/n52ZjdjJGmU4HEarUX4M62RbCzPXOU0L/T+aXxGHORXN6ePF4uFy7/4krk0c5lQ03dve0tEqTDevd9ElcZhj0Ty8P5Hy7uUB6UfXt2yc70ADX1xLRjF5vGmal8Fb//mKw9v9vZXjdYBMFWAimpa3IX1VwxSy/esufgWYTEWDgGgcEERvLhSQiw4+P7ChISH5C3GYTb2Bae1sU0zlrlBPPBBgc0toVFiapwCPWUsDFsdImS8Q5aLhFLcqJiWAJU0Nhx1m0whw2DokAyx2KZqcplbDKA4zTUNLUUEwbHwpmnJnFw82t5SnZW9UKAxQ6I34cAoUA49y17UIJgkuhEEGYcthJmiUuGhQzusSotHs0iT86nxFw1mHmaCp4ErplpY2eyjlIn3iaSQBcHO/MJMOs5amkilAZVbIgFPpEAjijEkcZi2N5lgaEsw7bwSwBrh8WORHMeT0mAkajbL1HBWNliSBUi7ysHE3VaTHTNCQIBUrPw6NrGgAKm8p0ho2wfNUHbiNNUklUu7sohhAW29Eo2cQxGEmaOgniECUp0CUKBwEYLCbQxY/CmzJ4zETNIh1hTS5inClCpBdaU8xbKOYtX/WVLEiuyzjd1O4WtocQkOF+aJko12PmabxQqaAGhB5cFFS0RKZ8N3MQuc0LfQPaWpkzP/TylJ7JMu+AMWUf3c+C6RtAAAAAElFTkSuQmCC
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432738/%E4%B9%A6%E5%B1%8B-%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/432738/%E4%B9%A6%E5%B1%8B-%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getdownloadlist() {
    var downloadlist = [];
    var n = $('option');
    var temp_list = [...window.pagelist]
    for (var i = 0; i < n.length; i++) {
        if (!n[i].selected) downloadlist.push(temp_list[i]);
    }
    return downloadlist
}

function whichtype(url) {
    return url.indexOf("act=view") > -1 ? 1 : 2
}

function dealhtml(html, type) {
    //确定版面类型
    let selector = ((type || window.pagetype) === 1) ? '.article-content' : 'div.con.setBody'
    //页面内容排版调整
    var t = $(html || document).find(selector).html().trim()
    //缩进与段落调整
    //1.不通用情况，预处理
    //t = t.replace(/(作者：.{1,20}?)<br>(.{1,15}?发表于：)/, '$1<br><br>$2');
    t = t.startsWith('<span id="shownewsc">.<br><br>') ? t.replace('.<br><br>', '') : t
    t = t.replace(/(<br>作者.{1,20}?<br>)/, "<br>$1<br>")
    t = t.replace(/(<br>.{1,20}?发表于.{1,20}?<br>)/, "<br>$1<br>")
    t = t.replace(/(<br>\s*?第.{1,10}?章.{0,50}?<br>)/g, '<br>$1<br>');
    t = t.replace(/(<br>＊+<br>)/, '<br>$1<br>')
    //2.分情况调整格式
    t = t.split('<br><br>').length > 20 ? t.replace(/<br><br>/g, 'asdf').replace(/<br>/g, '').replace(/asdf/g, '<br><span style="padding-left:2em"></span>') : t.replace(/<br><br>/g, '<br>').replace(/<br>/g, '<br><span style="padding-left:2em"></span>')
    //3.处理超链接
    t = t.replace(/<\/a>/g, '<\/a><br><span style="padding-left:2em"></span>').replace(/<strong>/g, '<strong><br><span style="padding-left:2em"></span>')
    //4.处理标点符号
    t = t.replace(/「/g, '“').replace(/」/g, '”').replace(/.未完待续./g, '').replace(/.待续./g, '').replace(/版主.*?编辑/g, '').replace(/贴主.*?编辑/g, '')
    //5.处理moz-extension失效链接
    t = t.replace(/<img src="moz-extension.*?>/g, '')
    //6.重写页面
    !html && $(selector).html(t)

    //.replace(/【/g, '“').replace(/】/g, '”')标题中可能含【，不予使用
    return t
}

function dealhtmlcontent(html, type) {
    //1.先得到html
    var t = dealhtml(html, type)
    //2.去除超链接
    t = t.replace(/<a href.*?<\/a><br>/g, '');
    //3.构造html
    t = '<div>' + t.replace(/<br>/g, 'asdf12345    ') + '</div>';
    //4.将html变成纯文本
    t = '    ' + $(t).text().replace(/asdf12345/g, '\n').trim()
    //console.log(t)
    return t
}

function copyToClipboard(content) {
    let $input = document.createElement('textarea')
    $input.style.opacity = '0'
    $input.value = content
    document.body.appendChild($input)
    $input.select()
    document.execCommand('copy')
    document.body.removeChild($input)
    $input = null
}

function showMessage(message, type) {
    let messageJQ;
    if (type === 0) {
        $('body').append("<div class='showMessageError'>" + message + "</div>")
        //messageJQ = $("<div class='showMessageError'>" + message + "</div>");
        messageJQ = $(".showMessageError:last");
    } else if (type === 1) {

        $('body').append("<div class='showMessageSuccess'>" + message + "</div>");
        //messageJQ = $("<div class='showMessageSuccess'>" + message + "</div>");
        messageJQ = $(".showMessageSuccess:last");
    }
    let hash = md5(message);
    messageJQ.attr("id", hash)
    let me = $('#' + hash)
    /**先将原始隐藏，然后添加到页面，最后以600秒的速度下拉显示出来*/
    me.slideDown();
    //messageJQ.show()
    /**3秒之后自动删除生成的元素*/


    window.setTimeout(function () {
        me.slideUp()
        me.remove();
    }, 3000);
}

function getbookname() {

    let title = window.pagetype === 1 ? $('head > meta').eq(3).attr("content") : $('div.news-replay-title').text().trim();
    let bookname;
    try {
        bookname = [title.split('【')[1].split('】')[0], 1];
    } catch (a) {
        if (a.message === "Cannot read property 'split' of undefined") {
            bookname = [title.split(' ')[0], 2];
        }
    }
    return bookname
}

function searchDownload() {
    $.ajax({
        url: window.domain + "/index.php?app=index&act=search&keyword=" + window.keyword + '&ajax=1' + ((window.maxtime === '') ? '' : ('&maxtime=' + window.maxtime)),
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            var x = data.threadlist,
                y = data.total
            if (x.length === 0 && y === 1) {
                window.pagelist.reverse();
                let hash = md5(window.bookname)
                if (location.href === window.pagelist[0].url) {
                    //将获得的数组插入pagelist
                    window.pagelist.splice(1, 0, ...getreplylist())
                    console.log(pagelist);
                    sessionStorage.setItem(hash + "isfind", "yes")
                }
                //获取后立即存储，避免重复访问网站
                sessionStorage.setItem(hash, JSON.stringify(window.pagelist));
                dealSearch()
            } else {
                for (var i = 0, l = x.length; i < l; i++) {
                    if (x[i].bbsid === '60') {
                        var hrefSrc = "/index.php?app=index&act=view&cid=" + x[i].cid;
                        window.pagelist.push({
                            title: x[i].title,
                            url: window.domain + hrefSrc,
                            status: ''
                        })
                    }


                }
                window.maxtime = x[x.length - 1].dateline;
                searchDownload()
            }
        }
    })


}

function getreplylist() {
    var commentlist = $('.con').toArray()
    var namelist = $('.namel').toArray()
    var replylist = [];
    for (var i = commentlist.length; i >= 0; i--) {
        var one = $(commentlist[i]).find('a');
        if (one.length === 1) {
            var text = one[0].innerText;
            (text.indexOf("点“赞”支持3银元奖励！！") === -1 && namelist[i].innerText === window.author) && replylist.push({
                title: text.replace("more", ''),
                url: one[0].href,
                status: ''
            })
        }
    }
    return replylist
}

function dealSearch() {
    let select = $('#showform > form > table > tbody > tr:nth-child(2) > td > select')
    let wenben = ''
    window.pagelist.forEach(item => {
            var option = '<option value="' + item.url + '">' + item.title + '</option>'
            select.append(option)
            if (window.bookname[1] === 1) {
                if (item.title.indexOf('【' + window.keyword + '】') > -1) {
                    wenben = wenben + '<a href="' + item.url + '">' + item.title + '<br>'
                } else $('option:last')[0].selected = true
            } else wenben = wenben + '<a href="' + item.url + '">' + item.title + '</a><br>'


        }
    )
    $('#wenbenkuang').append(wenben)
    showMessage("获取页面成功", 1)
    console.clear()

}

function simply() {

}

class Download {
    constructor(downloadlist, mime, filename, dealfile) {
        this.downloadList = downloadlist
        this.downloadIndex = 0
        this.errorNum = 0
        this.finishNum = 0
        this.downloading = false
        this.retryNum = 0
        this.mime = mime
        this.dealFile = dealfile
        this.fileName = filename
    }

    //初始化下载列表
    initial() {
        this.downloadList.forEach((item, index) => {
            item.title = item.title || index.toString()
            item.status = item.status || ''
        })
    }

    downloadAll() {
        this.downloading = true;
        let download = () => {
            let index = this.downloadIndex
            if (this.downloadList[index] && this.downloadList[index].status === '') {
                this.downloadIndex++
                $.ajax({
                    url: this.downloadList[index].url,
                    type: "GET",
                    contentType: "text/html",
                    success: (rep) => {
                        this.downloadList[index].content = dealhtmlcontent(rep, whichtype(this.downloadList[index].url));
                        this.finishNum++;
                        this.downloadList[index].status = 'success';
                        this.judgeFinish(download)
                    },
                    error: () => {
                        this.errorNum++
                        this.downloadList[index].status = 'error'
                        console.log(this.downloadList[index].title + '  下载出错')
                        this.judgeFinish(download)

                    }
                })
            } else if (this.downloadList[index]) {// 跳过已经成功的片段
                this.downloadIndex++
                download()
            }
        }

        // 建立多少个 ajax 线程
        for (let i = 0; i < Math.min(10, this.downloadList.length); i++) {
            download(i)
        }

    }

    judgeFinish(callback) {
        //当下载列表已遍历完成，检验是否每段都下载成功
        var templist = this.downloadList
        if ((function () {
            for (var i = 0; i < templist.length; i++) {
                if (templist[i].status === '') return false
            }
            return true
        })()
        ) {
            //下载成功
            if (this.finishNum === this.downloadList.length) {
                this.downloadFile()
                this.downloading = false
                showMessage('下载成功', 1)

            }
            //失败则重试五次
            else {
                this.retryNum++;
                if (this.retryNum <= 5) this.retryAll()
                else {
                    showMessage("下载失败", 0)
                    this.downloading = false
                }
            }
        }

        callback && callback()

    }

    downloadFile() {
        // 文件数据预处理
        let fileDataList = this.dealFile(this.downloadList)
        let a = document.createElement('a')
        let fileBlob = new Blob(fileDataList, {type: this.mime}) // 创建一个Blob对象，并设置文件的 MIME 类型
        a.download = this.fileName
        a.href = URL.createObjectURL(fileBlob)
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    retryAll() {
        this.downloadList.forEach((item) => { // 重置所有片段状态
            if (item.status === 'error') {
                item.status = ''
            }
        })
        this.errorNum = 0
        this.downloadIndex = 0
        this.downloadAll()

    }


}

var logourl = 'data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAIAAAB+eU8wAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAJESURBVEhL7ZexSgNBEIbzNla+hY8g+AA2tlZ2WllZCtZinc4iViLaiJBGQQQtRLQQ1MIiFkLOb+9f5y43e2dyMdpkGI7Z2dn/n52ZjdjJGmU4HEarUX4M62RbCzPXOU0L/T+aXxGHORXN6ePF4uFy7/4krk0c5lQ03dve0tEqTDevd9ElcZhj0Ty8P5Hy7uUB6UfXt2yc70ADX1xLRjF5vGmal8Fb//mKw9v9vZXjdYBMFWAimpa3IX1VwxSy/esufgWYTEWDgGgcEERvLhSQiw4+P7ChISH5C3GYTb2Bae1sU0zlrlBPPBBgc0toVFiapwCPWUsDFsdImS8Q5aLhFLcqJiWAJU0Nhx1m0whw2DokAyx2KZqcplbDKA4zTUNLUUEwbHwpmnJnFw82t5SnZW9UKAxQ6I34cAoUA49y17UIJgkuhEEGYcthJmiUuGhQzusSotHs0iT86nxFw1mHmaCp4ErplpY2eyjlIn3iaSQBcHO/MJMOs5amkilAZVbIgFPpEAjijEkcZi2N5lgaEsw7bwSwBrh8WORHMeT0mAkajbL1HBWNliSBUi7ysHE3VaTHTNCQIBUrPw6NrGgAKm8p0ho2wfNUHbiNNUklUu7sohhAW29Eo2cQxGEmaOgniECUp0CUKBwEYLCbQxY/CmzJ4zETNIh1hTS5inClCpBdaU8xbKOYtX/WVLEiuyzjd1O4WtocQkOF+aJko12PmabxQqaAGhB5cFFS0RKZ8N3MQuc0LfQPaWpkzP/TylJ7JMu+AMWUf3c+C6RtAAAAAElFTkSuQmCC'
var ul = `<ul id="functionlist" style="display: none;" tabindex="1">
    <li id="yqs1" title="可以在站内搜索本书其他章节，自由选择下载范围"><span style="background-color: darkorange;"><a
            style="color:darkgreen"></a><a>显示选择页面</a></span></li>
    <li id="yqs2" title="下载所选页面"><span style="background-color:darkorange"><a
            style="color:darkgreen"></a><a>下载</a></span></li>
    <li id="yqs3" title="跳转到页尾"><span style="background-color:darkorange"><a
            style="color:darkgreen"></a><a>转至页尾</a></span></li>
    <li id="yqs4" title="跳转到页首"><span style="background-color:hotpink"><a
            style="color:darkgreen"></a><a>转至页首</a></span></li>
    <li id="yqs5" title="省却手动翻页的烦恼"><span style="background-color:hotpink"><a
            style="color:darkgreen"></a><a>页面滚动</a></span></li>
    <li id="yqs6" title="有时候，复制页面也是一种需要"><span style="background-color:hotpink"><a
            style="color:darkgreen"></a><a>复制页面内容</a></span></li>
</ul>`
var div = `<div id="yqs" title="点击 此按钮 弹出 辅助功能"
            style="top:80px;left:10px;width:25px;height:25px;background-size:100% 100%;background-image:url(${logourl});
            overflow:hidden;user-select:none;position:fixed;z-index:963540817;"></div>`
var showdiv = `<div id="showform"
     style="width:300px;position:fixed;left:50%;top:15%;display: none;font-family: AMCSongGBK,serif;transform:translate(-50%)">
    <form style="z-index: 9999999;background: #ffffff">
        <table style="width: 300px">
            <tbody>
            <tr>
                <td height="22" style="text-align:left">选不需要的</td>
            </tr>
            <tr>
                <td style="text-align:center"><select size="10" multiple="multiple" class="wenbenkuang"></select></td>
            </tr>
            <tr>
                <td style="text-align:left;" height="22">剩下的就是需要的</td>
            </tr>
            <tr>
                <td>
                    <div style="height:300px;width:300px;overflow-y:auto;font-family: AMCSongGBK,serif;border:1px solid #F00;line-height: 150%"
                         id="wenbenkuang"></div>
                </td>
            </tr>
            </tbody>
        </table>
    </form>
</div>`
var style = `<style>
option {
    font-size: 10px
}

#wenbenkuang a:link {
    color: red;
}

#wenbenkuang a:visited {
    color: green;
}

#wenbenkuang a:hover {
    color: hotpink;
}

#wenbenkuang a:active {
    color: blue;
}

#wenbenkuang a {
    font-family: AMCSongGBK, serif;
    font-size: 10px;
}

.news-replay-title, .article-tit {
    font-family: AMCSongGBK, serif;
    text-align: center;
}

div.con.setBody, .article-content {
    font-family: AMCSongGBK, serif;
    line-height: 200%;
    text-indent: 2em;
    font-size: 12px;
    font-weight: bold
}

.showMessageSuccess,.showMessageError {
    padding: 5px 10px;
    border-radius: 5px;
    margin: 0 auto;
    position: fixed;
    top: 50%;
    left: 50%;
    color: #ffffff;
    font-family: AMCSongGBK, serif;
    font-size: 20px;
    z-index: 999;
    display: none;
    transform: translate(-50%, -50%)
}
.showMessageSuccess{
    background-color: #00B7EE;
}
.showMessageError {
    background-color: #ff0000;
}
ul#functionlist > li {
    margin: -4px 0;
    width: 100px
}

ul#functionlist {
    width: 120px;
    top: 120px;
    left: 0;
    position: fixed;
    z-index: 2147483647 !important;
    font-size: 13px;
    user-select: none;
    color: black;
    transition: all .5s ease 0s;
    overflow: hidden
}

ul#functionlist > li > span {
    text-align: center;
    font-weight: bold;
    color: black;
    display: inline-block;
    padding: 5px;
    margin: 5px;
    font-family: AMCSongGBK, serif;
    border: 1px solid #fcfcfc;
    border-radius: 10px;
    text-decoration: none;
    background-color: blanchedalmond;
    width: 100%;
    box-shadow: 1px 1px 4px #444, inset -2px -2px 4px #fff, inset 2px 2px 4px #aaa
}

ul#functionlist > li > span:hover {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAMAAACHgmeRAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURX//AIH8BobyGoT/CZP/J4nxIIL5C5T8LJj0PW2hJpgAAAAeSURBVAjXY2BlY4QABiZGBiigNouVGQoYONhZIAAAEpYAdsB2b4AAAAAASUVORK5CYII=)
}

ul#functionlist *:active {
    border-radius: 100%
}
</style>`
window.domain = "https://wap.cool18.com"
if ((location.href.indexOf(window.domain + '/index.php?app=index&') > -1) && ((/act=replylist&cid=/.test(location.href)) || (/act=view&cid=/.test(location.href)))) {
    $(function () {
        window.pagetype = whichtype(location.href)
        window.bookname = getbookname()
        window.author = $('.article-source > div > a').text().trim()
        window.keyword = window.bookname[0]
        window.pagelist = JSON.parse(sessionStorage.getItem(md5(window.bookname))) || []
        window.maxtime = ''
        $("head").append(style);
        $('body').append(ul, div, showdiv);
        dealhtml();
        var bottom_height = (window.pagetype === 1 ? $('.article-content') : $('div.con.setBody')).height() - screen.height;

        $("#yqs").click(function () {
            $('#functionlist').toggle()
        });
        $("#yqs1").click(function () {

            console.log("title----------" + window.bookname[0]);
            $("#showform").toggle()
            window.a1 = (window.a1 || 0) + 1
            var a1 = $('#yqs1 > span > a:nth-child(2)');
            if (window.a1 % 2 === 1) a1.text('收起选择页面')
            else a1.text('显示选择页面')
        });
        $("#yqs2").click(function () {
            D1 = D1 || new Download(getdownloadlist(), 'text/plain', window.bookname[0] + '.txt', List => {
                let fileDataList = ['书名：' + window.bookname[0] + '\n', '目录：\n'];
                List.forEach(item => {
                    fileDataList.push(item.title + '\n')

                })
                List.forEach(item => {
                    fileDataList.push(item.title + '\n\n' + item.content + '\n\n\n\n')

                })
                console.log(List.length)
                console.log((fileDataList.length - 2) / 2)
                return fileDataList
            })
            if (!D1.downloading) {
                //若已经下载，则重置下载器
                if (D1.downloadIndex > 0) {
                    D1 = new Download(getdownloadlist(), 'text/plain', window.bookname[0] + '.txt', List => {
                        let fileDataList = ['书名：' + window.bookname[0] + '\n', '目录：\n'];
                        List.forEach(item => {
                            fileDataList.push(item.title + '\n')
                            //item.content.length > 2000 && fileDataList.push(item.title + '\n')

                        })
                        List.forEach(item => {
                            fileDataList.push(item.title + '\n\n' + item.content + '\n\n\n\n')
                            //item.content.length > 2000 && fileDataList.push(item.title + '\n\n' + item.content + '\n\n\n\n')

                        })
                        console.log(List.length)
                        console.log((fileDataList.length - 2) / 2)
                        return fileDataList
                    })

                }
                showMessage("开始下载", 1);
                D1.downloadAll()
            } else showMessage("下载中，请稍等", 1)
        });
        $("#yqs3").click(function () {
            document.documentElement.scrollTop = bottom_height
        });
        $("#yqs4").click(function () {
            document.documentElement.scrollTop = 0
        });
        $("#yqs5").click(function () {
            var a5 = $('#yqs5 > span > a:nth-child(2)');
            var doc = document.documentElement;
            window.a5 = window.a5 || 0
            if (window.a5 % 2 === 0) {
                if (doc.scrollTop <= bottom_height - 100) {
                    window.a5++;
                    a5.text('滚动暂停');
                    window.isroll = true;
                    //window.date1=Date.now();
                    window.roll = setInterval(() => {
                        if (doc.scrollTop > bottom_height - 100) {
                            clearInterval(window.roll);
                            `window.date2=Date.now();
                            console.log(window.date2-window.date1);`
                            window.isroll = false;
                            a5.text('页面滚动');
                            window.a5++;
                        }
                        doc.scrollTop += 1;
                    }, 20)
                }

            } else {
                if (window.isroll) {
                    clearInterval(window.roll);
                    window.isroll = false;
                    a5.text('页面滚动');
                    window.a5++;
                }


            }


        });
        $("#yqs6").click(function () {
            copyToClipboard(dealhtmlcontent(document));
            showMessage("复制成功", 1);
        });
        $(".wenbenkuang").change(function () {
                var orderstring = "";
                var n = $('option').toArray();
                for (var i = 0; i < n.length; ++i) {
                    if (!n[i].selected) {
                        orderstring += '<a href="' + n[i].value + '">' + n[i].text + '</a><br>';
                    }
                }
                $('#wenbenkuang').html(orderstring);

            }
        )
        ;
        window.pagelist.length === 0 || (location.href === window.pagelist[0].url && (sessionStorage.getItem(md5(window.bookname) + "isfind") !== 'yes')) ? (window.pagelist = []) && searchDownload() : dealSearch()
        var D1
        //去广告
        $('iframe').remove()
    });

}




})();