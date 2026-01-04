// ==UserScript==
// @name         启用NGA自动向后加载
// @namespace    https://yuyuyzl.github.io/
// @version      0.7.1
// @description  在进入NGA帖子时自动轮询最后一页的内容，并去重后添加到页面末尾
// @author       yuyuyzl
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.0/jquery.min.js
// @match        *://nga.178.com/read.php?tid=*
// @match        *://bbs.nga.cn/read.php?tid=*
// @match        *://bbs.ngacn.cc/read.php?tid=*
// @match        *://ngabbs.com/read.php?tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388125/%E5%90%AF%E7%94%A8NGA%E8%87%AA%E5%8A%A8%E5%90%91%E5%90%8E%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/388125/%E5%90%AF%E7%94%A8NGA%E8%87%AA%E5%8A%A8%E5%90%91%E5%90%8E%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
var needScroll=false;
function getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}
//文档的总高度
function getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}
function getWindowHeight(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}
jQuery.noConflict();
var jq=jQuery;
var currentPage=parseInt(jq("#pagebbtm td a.invert").text().replace(".",""));
(function(){
    var prog,progv=0,ti,cal
    function init(){
        prog = _$('/div','style','position:fixed;display:none;bottom:0;left:0;right:0;height:1em;background:silver;fontSize:0.3em;borderLeft:0 solid '+__COLOR.border0+';transition:border-left-width 0.3s linear 0s,0.3s')

    }//
    function progr(){
        progv = 0
        prog.style.borderLeftWidth=0
        prog.style.display = 'none'
        if(cal)cal()
    }//
    commonui.progbar = function(v,o,f){//progress/% hidetimeout/ms
        if(!prog)
            init()
        if(v!=progv){
            if(progv==0){
                prog.style.display = ''
                cal = null
            }
            progv = v, prog.style.borderLeftWidth = (prog.offsetWidth*v/100)+'px'
            if(ti)
                clearTimeout(ti)
            if(v==100)
                ti = window.setTimeout(function(){progr()},300)
            else if(o)
                ti = window.setTimeout(function(){progr()},o)
            if(f)
                cal = f
        }
    }//

})();

(function() {
    if (!XMLHttpRequest)
        return
    var pageStat = {}, //{页n:[贴1,2,3,...], 页n+1:[贴1,2,3,...], ...}
        $ = _$, HTTP = new XMLHttpRequest(), l = location, tmp, minp, //当前最小页
        maxp, //当前最大页
        iPo, //当前第一条
        iPc, ot = 0, count = 1, //当前显示的总页数
        progr = function() {
            commonui.loadReadHidden.lock = 0
        }, progt = function(v, o) {
            commonui.progbar(v * 10, o ? o : 5000, v == 10 ? progr : null)
        }, cs = document.characterSet || document.defaultCharset || document.charset;

    HTTP.onerror = function(e) {
        error('HTTP ERROR')
    }

    HTTP.onload = HTTP.onabout = function(e) {
        progt(10)
    }

    HTTP.onprogress = function(e) {
        /*
	if (e.lengthComputable)
		progv = (e.loaded / e.total)*prog.offsetWidth
	else if(progv = this.getResponseHeader('X-NGA-CONTENT-LENGTH'))
		progv = (e.loaded / progv)*prog.offsetWidth
	else{
		progv = e.loaded/100
		if(progv>prog.offsetWidth) progv = prog.offsetWidth
		}
		*/
        progt(3)
    }

    var ifp = function(o, opt) {
        if (opt & 1024) {
            if (o.nodeName == 'TBODY')
                return 1
        } else if (o.className == 'forumbox postbox')
            return 1
    }
    pr = function(txt, opt) {
        if (opt & 1024) {
            //console.log(txt)
            var x = cut(txt, ['<!--topicliststart-->', '<!--topiclistend-->', '//topicloadallstart', '//topicloadallend', ], 0, 1)
            if (x.length < 2)
                return error('parse page error')
            var y = cut(x[0], ["<script type='text/javascript'>", '</script>'], 0, 0)
            y.push(x[1])
            return [null, x[0], //内容
                    y//取出内容加载脚本
                   ]
        }
        var x = cut(txt, ['//userinfostart', '//userinfoend', '<!--postliststart-->', '<!--postlistend-->'], 0, 1)
        if (x.length < 2)
            return error('parse page error')

        //去重by yuyuyzl
        var newList=[];
        cut(x[1], ['<table', '</table>'], 0, 0).forEach(function(o,i){
            if(o==null)return;
            o='<table'+o+ '</table>';
            idList=o.match(/post[a-z_]+[0123456789]+/g)
            //console.log(idList)
            if(idList==null){newList.push(o);return;}
            for(var j=0;j<idList.length;j++)if( $(o.match(/post[a-z_]+[0123456789]+/g)[j])!=null)return;
            newList.push(o);
        });

        cut(x[1], ['<script>', '</script>'], 0, 0).forEach(function(o,i){
            if(o==null)return;
            o='<script>'+o+ '</script>';
            idList=o.match(/post[a-z_]+[0123456789]+/g)
            //console.log(idList)
            if(idList==null){newList.push(o);return;}
            for(var j=0;j<idList.length;j++)if( $(o.match(/post[a-z_]+[0123456789]+/g)[j])!=null)return;
            newList.push(o);
        });

        var filtereddata="\n\n\n"+newList.join("\n\n")+"\n";
        //console.log(newList)

        return [x[0], //用户信息脚本
                filtereddata, //内容
                cut(filtereddata, ['<script>', '</script>'], 0, 0)//取出内容加载脚本
               ]
    }

    commonui.loadReadHiddenNS = function(p, opt, recursiveCount) {

        // 页， &1替换加载指定页 &2连续加载下一页 &4连续加载上一页
        if (this.loadReadHidden.lock)
            return
        this.loadReadHidden.lock = 1
        if (!iPc) {
            iPc = $('m_posts_c')
            if (!iPc) {
                iPc = $('topicrows')
                ot |= 1024
            }
        }

        opt |= ot

        if (!minp) {
            minp = maxp = __PAGE[2]
            pageStat[maxp] = []
            for (var i = 0; i < iPc.childNodes.length; i++) {
                if (ifp(iPc.childNodes[i], opt))
                    pageStat[maxp].push(iPc.childNodes[i])
            }
        }


        var ugo = __PAGE[0] + '&page=' + p
        HTTP.__rep = 0
        HTTP.abort()
        HTTP.open('GET', ugo)
        HTTP.onreadystatechange = function() {
            if (HTTP.readyState !== HTTP.DONE)
                return
            var all = HTTP.responseText
            if (HTTP.status !== 200 || HTTP.getResponseHeader("X-NGA-CONTENT-TYPE") == 'short-message') {
                var c = all.match(/<!--msgcodestart-->(\d+)<!--msgcodeend-->/)
                if (c && c[1] == 15 && HTTP.__rep < 1) {
                    __COOKIE.setCookieInSecond('guestJs', __NOW, 1200)
                    HTTP.__rep++
                    return setTimeout(function() {
                        HTTP.abort()
                        HTTP.open('GET', ugo)
                        HTTP.send()
                    }, 500)
                }
                var c = all.match(/<!--msginfostart-->(.+?)<!--msginfoend-->/)
                if (c)
                    return error(c[1].replace(/<br\s*\/>/g, "\n").replace(/<\/?[A-Za-z]+(\s[^>]*)?>/g, " ").replace(/^\s+|\s+$/g, ''), 2)
                return error('HTTP ERROR ' + HTTP.status, 2);
            }

            progt(5)

            var data = pr(all, opt)

            if (commonui.eval.call(window, data[0]))
                return error('parse data 0 error')

            progt(6)
            currentPage=parseInt(all.match(/,2:[0-9]+,3:/)[0].replace(",2:","").replace(",3:",""));
            //console.log(currentPage)
            __PAGE[2] = p
            if (opt & 1) {
                minp = maxp = p
                pageStat = {}
                count = 1
                iPo = null
                for (var i = iPc.childNodes.length - 1; i >= 0; i--) {
                    //if(ifp(iPc.childNodes[i], opt) || iPc.childNodes[i].nodeName=='SCRIPT')
                    iPc.removeChild(iPc.childNodes[i])
                }
                if (history.replaceState)
                    history.replaceState('object or string', document.title, __PAGE[0] + '&page=' + p)
            } else if (opt & 6) {

                //count++
                if (count > 10) {
                    count--
                    if (opt & 2)
                        tmp = minp,
                            minp++
                    else if (opt & 4)
                        tmp = maxp,
                            maxp--
                    for (var i = 0; i < pageStat[tmp].length; i++) {
                        pageStat[tmp][i].parentNode.removeChild(pageStat[p][i])
                        pageStat[tmp][i] = null
                    }
                    pageStat[tmp] = null
                    delete pageStat[tmp]
                }

                if (opt & 2)
                    maxp = p,
                        iPo = null
                else if (opt & 4)
                    iPo = pageStat[minp][0],
                        minp = p
                commonui.topicArg.opt |= 1
                //console.log('replacehis '+p)
                //if(history.replaceState)
                //history.replaceState('object or string', document.title, __PAGE[0]+'&page='+p)
            }

            progt(7)

            var c = data[1].match(/\s*<tbody/) ? $('/table') : $('/span')
            c.innerHTML = data[1]

            pageStat[p] = []
            for (var i = 0; i < c.childNodes.length; i++) {
                if (ifp(c.childNodes[i], opt)) {
                    pageStat[p].push(c.childNodes[i])
                    iPc.insertBefore(c.childNodes[i], iPo)
                }
            }

            progt(8)

            for (var i = 0; i < data[2].length; i++) {
                if (commonui.eval.call(window, data[2][i]))
                    return error('parse data 2 error')
            }

            /*var c = document.getElementsByName('pageball')
            if (opt & 1) {
                commonui.pageBtn(c[0], {
                    0: __PAGE[0],
                    1: __PAGE[1],
                    2: p,
                    3: __PAGE[3]
                }, 16)
                commonui.pageBtn(c[1], {
                    0: __PAGE[0],
                    1: __PAGE[1],
                    2: p,
                    3: __PAGE[3]
                }, 8)
            } else {
                commonui.pageBtn(c[0], {
                    0: __PAGE[0],
                    1: __PAGE[1],
                    2: minp,
                    3: __PAGE[3]
                }, 4 | 16)
                commonui.pageBtn(c[1], {
                    0: __PAGE[0],
                    1: __PAGE[1],
                    2: maxp,
                    3: __PAGE[3]
                }, 2 | 8)
            }//*/

            progt(9)

            if (window._czc)
                //cnzz统计
                _czc.push(["_trackPageview", __PAGE[0] + '&page=' + p]);
            if(needScroll)window.scrollTo(0,getScrollHeight());
            console.log(p);
            console.log(currentPage);
            if(p==currentPage && recursiveCount>1)setTimeout(()=>commonui.loadReadHiddenNS(currentPage+1,2,recursiveCount-1),500);
        }

        HTTP.overrideMimeType("text/html; charset=" + cs);

        progt(1)

        HTTP.send()

    }
    //fe

    commonui.loadReadHidden.reset = function() {
        tmp = null
        minp = null
        maxp = null
        iPo = null
        iPc = null
        ot = 0
        count = 1
    }
    //

    var error = function(e, a) {
        progt(10)

        console.log(e)

    }

    var cut = function(txt, match, offset, opt) {
        var m, n, r = [], start = match.shift(), end = match.shift()
        while (1) {
            m = txt.indexOf(start, offset)
            if (m == -1)
                break
            n = txt.indexOf(end, m)
            if (n == -1)
                break
            r.push(txt.substr(m + start.length, n - m - start.length))
            offset = n + end.length
            if (opt & 1) {
                var start = match.shift()
                , end = match.shift()
                if (!start || !end)
                    break
            }
        }
        return r
    }
    //fe

    }
)();

jq("#pagebtop td a.invert").text("Auto").attr("href",jq("#pagebtop td a.invert").attr("href").replace(/\&page=[0-9]+/,"&page=9999"));
jq("#pagebbtm td a.invert").text("Auto").attr("href",jq("#pagebbtm td a.invert").attr("href").replace(/\&page=[0-9]+/,"&page=9999"));
jq("#fast_post_c>div>div>table>tbody").toggle();
jq("#footer").toggle();
jq("#fast_post_c>div>div>table>caption>h2").text("..:: 快速发贴(点我展开) ::..");
jq("#fast_post_c>div>div>table>caption").click(function(){
    jq("#fast_post_c>div>div>table>tbody").toggle();
    jq("#footer").toggle();
});
jq(":contains('>>>')").last().remove()
setInterval(function(){
    if((getScrollTop() + getWindowHeight()) == (getScrollHeight())){
            needScroll=true
        }else needScroll=false;
    commonui.loadReadHiddenNS(currentPage,2,5);
    //setTimeout(()=>{commonui.loadReadHiddenNS(currentPage+1,2)},500)
},10000)






