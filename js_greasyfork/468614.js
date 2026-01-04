// ==UserScript==
// @name         艾宾浩斯收藏夹
// @namespace    http://www.51gongjuxiang.com/
// @version      0.1
// @description  多终端同步收藏夹，支持艾宾浩斯提醒功能，防止在收藏夹中吃灰。
// @author       smoking
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      www.51gongjuxiang.com
// @connect      www.layuicdn.com
// @connect      npm.elemecdn.com
// @downloadURL https://update.greasyfork.org/scripts/468614/%E8%89%BE%E5%AE%BE%E6%B5%A9%E6%96%AF%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/468614/%E8%89%BE%E5%AE%BE%E6%B5%A9%E6%96%AF%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

var mainMenuDataOk = false;
var baseUrl = "http://www.51gongjuxiang.com/aib/";
var aibEditWindowId = '';
var currentCurr = 1;
var aibEditPrevData = {};
var mainPannelInit = false;


function updateAibTable(articles) {
	function genTable(articles) {
        var fuid = getFuid();
        var alertIcon = '<svg class="bell" version="1.1" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g class="bell__body" fill="none" fill-rule="evenodd"><g transform="translate(-135 -1900)"><g transform="translate(113 532)"><g transform="translate(22 1368)" fill="currentColor" fill-rule="nonzero"><path class="bell__hull" d="m19.192 13.581c-1.0751 0-1.9497-0.8615-1.9497-1.9204v-4.527c0-3.9334-3.2489-7.1335-7.2424-7.1335-3.9935 0-7.2424 3.2001-7.2424 7.1335v4.527c0 1.059-0.87465 1.9204-1.9497 1.9204-0.44617 0-0.80789 0.35628-0.80789 0.79579s0.36172 0.79575 0.80789 0.79575h18.384c0.44621 0 0.80789-0.35624 0.80789-0.79575s-0.36168-0.79579-0.80789-0.79579zm-15.4 0c0.36758-0.55224 0.58156-1.2122 0.58156-1.9204v-4.527c0-3.0559 2.5241-5.542 5.6266-5.542s5.6266 2.4861 5.6266 5.542v4.527c0 0.70822 0.21398 1.3682 0.58152 1.9204h-12.416z"/><path class="bell__clapper" d="m12.009 17.36c-0.38848-0.24401-0.88605-0.10076-1.1114 0.31983-0.28696 0.5357-0.92289 0.71866-1.4176 0.4079-0.15596-0.097953-0.28626-0.23903-0.37672-0.4079-0.22532-0.42063-0.72293-0.56375-1.1114-0.31983-0.38844 0.24397-0.52066 0.78277-0.29534 1.2034 0.23235 0.4337 0.56689 0.79593 0.96744 1.0475 0.41954 0.26355 0.87866 0.38875 1.332 0.38875 0.91932 0 1.8148-0.51505 2.3084-1.4363 0.22532-0.42055 0.093138-0.95935-0.29534-1.2033z"/></g></g></g></g></svg>';
		var ret = '<table class="layui-table" lay-even lay-skin="line"><thead><tr><th>日期</th><th>标题</th><th>提醒</th><th>操作</th></tr></thead><tbody>';
		for (var i = 0; i < articles.length; i++) {
			var article = articles[i];
            var url = getArticleUrl() + '?fuid=' + fuid + "&id=" + article.id;
			ret += '<tr aibid="' + article.id + '"><td style="width: 180px;min-width:180px;">' + createTime(article.createdate) + '</td>';
			ret += '<td style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:300px;max-width:300px"><span name="aibOpen" class="aibTitle"><a target="_blank" href="' + url + '">' + htmlEncode(article.title) + '</a></span></td>';
            if (article.isaib) {
                if (article.aibdate > 2145887000) {
                    ret += '<td style="text-align:center"><div class="aibAlertWrapper" data="提醒已完成">' + alertIcon + '</div></td>';
                } else {
                    if (article.alert) {
                        ret += '<td style="text-align:center"><div class="aibAlertWrapper aibAlertActive aibAlertShake" data="提醒日期：' + createDate(article.aibdate) + '">' + alertIcon + '</div></td>';
                    } else {
                        ret += '<td style="text-align:center"><div class="aibAlertWrapper aibAlertActive" data="提醒日期：' + createDate(article.aibdate) + '">' + alertIcon + '</div></td>';
                    }
                }
            } else {
                ret += '<td style="text-align:center"><div class="aibAlertStrikethrough aibAlertWrapper" + data="无提醒">' + alertIcon + '</div></td>';
            }
			ret += '<td><button name="aibEdit" type="button" class="layui-btn layui-btn-sm">编辑</button><button name="aibDelete" type="button" class="layui-btn layui-btn-sm layui-btn-danger">删除</button></td></tr>';
		}
		ret += "</tbody></table>";
		return ret;
	}
	var tableStr = genTable(articles);
	document.getElementById('aibtable').innerHTML = tableStr;
    function getAibId(event) {
        return layui.$(event.target).parents("tr").attr("aibid") * 1;
    }
    addTips("span[name='aibOpen'] a", function(event) {return event.target.innerHTML;});
    addTips("div.aibAlertWrapper", function(event) {return layui.$(event.target).closest('div').attr('data');});
    layui.$("span[name='aibOpen']").click(function(event) {onAibListOpen(getAibId(event));});
    layui.$("button[name='aibEdit']").click(function(event){onAibListEdit(getAibId(event));});
    layui.$("button[name='aibDelete']").click(function(event){onAibListDelete(getAibId(event));});
}

function onAibCircleClick() {
    initLayui(function(){
        var windowId = layui.layer.tips('<span name="menuWrapper"><ul><li><button name="menuAdd" style="width:100%;" class="layui-btn layui-btn-sm layui-btn-normal">新增收藏</button></li><li><button name="menuMain" style="width:100%;margin-top: 5px;" class="layui-btn layui-btn-sm layui-btn-normal">收藏列表</button></li><li><button name="menuStopAlert" style="width:100%;margin-top: 5px;" class="layui-btn layui-btn-sm layui-btn-normal">今日勿扰</button></li></ul></span>', '#circleWrapper', {
            tips: [4, '#fff'],
            time: 5000
        });
        setTimeout(function(){
            layui.$('span[name="menuWrapper"]').mouseleave(function(){closeMenu();});
            layui.$('button[name="menuAdd"]').click(function(){closeMenu();onAibMenuAdd();});
            layui.$('button[name="menuMain"]').click(function(){closeMenu();onAibMenuMain();})
            layui.$('button[name="menuStopAlert"]').click(function(){closeMenu();onAibMenuStopAlert();});
        }, 100);
        function closeMenu() {
            layui.layer.close(windowId);
        }
    });
}

function onAibMenuAdd() {
    initAibEdit();
    aibEditPrevData = {};
    layui.form.val('aibEdit', {aibId: "", aibType: "0", aibTitle: document.title, aibIsAib: "on", aibContent: document.location.href});
    layui.$('#aibIsAibWrapper').show();
    aibEditWindowId = layui.layer.open({type: 1,title: '新增',content: layui.$('#aibEdit')});
}

function onAibMenuMain() {
    if (!mainPannelInit) {
        mainPannelInit = true;
        layui.$('#aibid').click(function(){
            initAibSyncTable();
            var fuid = getFuid();
            layui.$("input[name='syncId']").val(fuid);
            layui.layer.open({
                type: 1,
                title: '同步',
                content: layui.$('#aibSyncWrapper')
            });
        });
        // 绑定搜索事件
        layui.$('input[name="aibSearch"]').keypress(function(e){
            if (e.which == 13) {
                currentCurr = 1;
                renderPage();
            }
        });
        layui.$('#aibSearchButton').click(function(){
            currentCurr = 1;
            renderPage();
        });
    }

    mainMenuDataOk = false;
    layui.$('input[name="aibSearch"]').val('');
    currentCurr = 1;
    renderPage();
    waitAndDo(function() {return mainMenuDataOk}, function() {
        layui.layer.open({
            type: 1,
            title: '全能收藏夹',
            content: layui.$('#aibcontainer')
        });
    });
    // 其他终端添加的条目，在这里异步更新。
    var oldTotal = GM_getValue('prefetchData').total;
    forcePrefetch(function() {
        var newTotal = GM_getValue('prefetchData').total;
        if (oldTotal != newTotal) {
            renderPage();
        }
    })
}

function onAibMenuStopAlert() {
    GM_setValue('notAlert', (new Date()).toDateString());
    document.getElementsByClassName("bigcircle2")[0].style.display="none";
}

function onAibListOpen(id) {
    forcePrefetch();
}

function onAibListEdit(id) {
    var fuid = getFuid();
    var postData = {fuid: fuid, id: id, method: 'GET'};
    post(getArticleUrl(), postData, function(res) {
        if (res && res.errMsg) {
            layui.layer.msg(res.errMsg, {icon: 5});
        } else {
            initAibEdit();
            layui.form.val('aibEdit', {aibId: res.id + "", aibType: res.type + "", aibTitle: res.title, aibContent: res.content});
            layui.$('#aibIsAibWrapper').hide();
            aibEditWindowId = layui.layer.open({type: 1,title: '编辑',content: layui.$('#aibEdit')});
        }
    });
}

function onAibListDelete(id) {
    var fuid = getFuid();
    var postData = {fuid: fuid, id: id, method: 'DELETE'};
    post(getArticleUrl(), postData, function(res) {
        if (res && res.errMsg) {
            layui.layer.msg(res.errMsg, {icon: 5});
        } else {
            forcePrefetch(function() {
                renderPage();
                layui.layer.msg('删除成功');
            });
        }
    });
}


(function() {
    if (self != top) { // 只在顶层窗口生效
        return;
    }
    // 添加style
    var style = document.createElement("style");
    style.type = "text/css";
    var styleStr = ".smallcircle2{width: 30px; height: 30px;background-color: #0062d4;border-radius: 50%;position: absolute;}";
    styleStr += ".bigcircle2{display:none;width: 30px;height: 30px;background-color: #0062d4;opacity: 0.4;border-radius: 50%;position: absolute;animation: scales 1s infinite cubic-bezier(0,0,0.49,1.02);}";
    styleStr += "@keyframes scales {0%{transform: scale(1);}50%,75%{transform: scale(3);}68%,100%{opacity: 0;}}";
    styleStr += ".aibTitle a{color: #333} .aibTitle a:visited{color: #333}";
    styleStr += ".aibAlertShake .bell__body {  animation: bell 1s infinite ease-in-out;  transform-origin: 50% 30%; } .aibAlertShake .bell__clapper {  animation: clapper 1s infinite ease-in-out;  transform-origin: center center; }   @keyframes bell {  0% {  transform: rotate(0);  }  20% {  transform: rotate(12.5deg);  }  40% {  transform: rotate(-12.5deg);  }  60% {  transform: rotate(12.5deg);  }  80% {  transform: rotate(2deg);  }  85% {  transform: rotate(0);  }  100% {  transform: rotate(0);  } }   @keyframes clapper {  0% {  transform: translateX(0);  }  25% {  transform: translateX(-3px);  }  50% {  transform: translateX(4px);  }  75% {  transform: translateX(-2px);  }  100% {  transform: translateX(0);  } }";
    styleStr += ".aibAlertActive {color: #16baaa}";
    styleStr += ".aibAlertWrapper {width: 20px;height:20px}";
    styleStr += ".aibAlertStrikethrough {position: relative;}.aibAlertStrikethrough:before {display: block;width: 22px;position: absolute;content:'';left: 0;top: 50%;right: 0;border-top: 2px solid;border-color: inherit;transform:rotate(-45deg);}";
    styleStr += ".layui-form-label{box-sizing: content-box;}";
    styleStr += ".layui-layer-page{text-align:left;}";
    style.innerHTML = styleStr;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);
    // 添加入口小圆圈
    var circleWrapper = document.createElement("div");
    circleWrapper.id = "circleWrapper";
    circleWrapper.style.position = "fixed";
    circleWrapper.style.right = "60px";
    circleWrapper.style.bottom = "120px";
    circleWrapper.style["z-index"]=999999999;
    circleWrapper.oncontextmenu = function(){return false;};
    circleWrapper.innerHTML = '<div class="bigcircle2"></div><div class="smallcircle2"></div>';
    document.body.appendChild(circleWrapper);
    // 小圆圈可拖动
    var circle = document.getElementById("circleWrapper");
    dragable(circle);
    // 主框
    var mainPannel = document.createElement("div");
    mainPannel.id = "aibcontainer";
    mainPannel.style.display = "none";
    mainPannel.style['min-width'] = "700px";
    mainPannel.innerHTML = '<div id="aibheader" style="box-sizing: content-box;height:25px;padding: 10px"><span style="float:left"><div class="layui-input-group"><input type="text" name="aibSearch" placeholder="搜索关键字" class="layui-input"><div id="aibSearchButton" class="layui-input-split layui-input-suffix" style="cursor: pointer;">搜索</div></div></span><span style="float:right;margin-top:10px">用户ID: <span id="aibid" style="cursor:pointer;text-decoration:underline"></span></span></div><div id="aibtable"></div><div id="aibfooter"></div>';
    document.body.appendChild(mainPannel);

    prefetch();
})();


function renderPage() {
    function jmp(obj) {
        var fuid = getFuid();
        currentCurr = obj.curr;
        var keyword = layui.$('input[name="aibSearch"]').val();
        post(baseUrl + "articles.php", {fuid: fuid, page: obj.curr - 1, size: obj.limit, keyword: keyword}, function(data) {
            updateAibTable(data['articles']);
            mainMenuDataOk = true;
        });
    }
    var keyword = layui.$('input[name="aibSearch"]').val();
    if (keyword !== "") {
        var fuid = getFuid();
        post(baseUrl + "articles.php", {fuid: fuid, keyword: keyword, countOnly: true}, function(data) {
            var cnt = data['count'];
            layui.laypage.render({
                elem: 'aibfooter',
                count: cnt,
                curr: currentCurr,
                jump: function(obj) {
                    jmp(obj);
                }
            });
        });
    } else {
        var prefetchData = GM_getValue('prefetchData');
        layui.laypage.render({
            elem: 'aibfooter',
            count: prefetchData.total,
            curr: currentCurr,
            jump: function(obj) {
                jmp(obj);
            }
        });
    }
}

var layuiInited = false;
function initLayui(callback) { // 延迟加载，只在打开列表的时候才加载layui
    if (layuiInited) {
        callback();
        return;
    }
    //CSP策略下初始化layui
    function initLayuiWithCSP(callback) {
        get("https://www.layuicdn.com/layui/css/layui.css", function(res) {
            var element = document.createElement('style');
            element.setAttribute('type', 'text/css');
            element.innerText = res;
            document.getElementsByTagName("HEAD").item(0).appendChild(element);
        });
        get("https://www.layuicdn.com/layui/layui.js", function(res) {
            eval(res);
            if (callback) {
                callback();
            }
        });
    }
    layuiInited = true;
    var element = document.createElement('script');
    element.setAttribute('type', 'text/javascript');
    element.src = "https://www.layuicdn.com/layui/layui.js";
    document.documentElement.appendChild(element);
    element = document.createElement('link');
    element.id = 'layuicss';
    element.setAttribute('rel', 'stylesheet');
    element.setAttribute('type', 'text/css');
    element.href = "https://www.layuicdn.com/layui/css/layui.css";
    document.documentElement.appendChild(element);
    waitAndDo(function() {
        try {
            layui.use(['layer', 'laypage', 'form'], callback);
            return true;
        } catch (e) {
            return false;
        }
    }, function(){}, 100, function(){
        // 如果0.1秒还没有加载layui的话，则认为被csp策略限制了。这时要使用另外的方式加载layui
        initLayuiWithCSP(function() {
            waitAndDo(function() {
                try {
                    layui.use(['layer', 'laypage', 'form'], callback);
                    return true;
                } catch (e) {
                    return false;
                }
            }, function(){});
        });
    });
}

var aibSyncTableInited = false;
function initAibSyncTable() {
    if (aibSyncTableInited) {
        return;
    }
    aibSyncTableInited = true;
    var syncStr = '<div style="display:none" id="aibSyncWrapper" class="aibSyncWrapper"><DIV style="text-align:center;color:red">输入其他电脑的同步ID，可实现内容的合并与同步。</DIV><div class="layui-form-item">';
    syncStr += '<div class="layui-inline"><label class="layui-form-label">同步ID: </label><div style="width:300px" class="layui-input-inline layui-input-wrap"><input type="text" name="syncId" class="layui-input"></div>';
    syncStr += '<div class="layui-form-mid" style="padding: 0!important;"> <button id="aibSyncBtn" type="button" class="layui-btn layui-btn-normal" >确认</button></div></div></div></div>';
    var doc = document.createElement('div');
    doc.innerHTML = syncStr;
    document.body.appendChild(doc);
    layui.form.render();
    layui.$("#aibSyncBtn").click(function(){
        var fuid = getFuid();
        var syncId = layui.$("input[name='syncId']").val();
        if (fuid == syncId) {
             layui.layer.msg('同步ID没有改动，无需同步');
        } else {
            post(baseUrl + "sync.php", {fuid: fuid, action: 'sync', syncId: syncId}, function(res) {
                if (res && res.errMsg) {
                    layui.layer.msg(res.errMsg, {icon: 5});
                } else {
                    GM_setValue('fuid', res.data);
                    forcePrefetch(function(){
                        renderPage();
                    });
                    layui.layer.msg('同步完成');
                }
            });
        }
    });
}


var aibEditInited = false;
function initAibEdit() {
    if (aibEditInited) {
        return;
    }
    aibEditInited = true;
    var aibEditStr = '<div style="display:none" id="aibEdit"><form class="layui-form" style="width:800px;padding:20px;display:inline-block" lay-filter="aibEdit">';
    aibEditStr += '<div style="display:none;"><input name="aibId" type="text"></input></div>';
    aibEditStr += '<div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><input type="radio" name="aibType" value="0" title="网址" checked="" lay-filter="aibTypeChange"></input><input type="radio" name="aibType" value="1" title="文本" lay-filter="aibTypeChange"></input></div></div>';
    aibEditStr += '<div class="layui-form-item"><label class="layui-form-label">标题</label><div class="layui-input-block"><input type="text" name="aibTitle" autocomplete="off" placeholder="请输入标题" class="layui-input"></input></div></div>';
    aibEditStr += '<div class="layui-form-item" id="aibIsAibWrapper"><label class="layui-form-label">艾宾浩斯</label><div class="layui-input-block"><input type="checkbox" checked="" name="aibIsAib" lay-skin="switch"  lay-text="开启|关闭"></input></div></div>';
    aibEditStr += '<div class="layui-form-item"><label class="layui-form-label">内容</label><div class="layui-input-block"><textarea name="aibContent" placeholder="请输入内容" class="layui-textarea"></textarea></div></div>';
    aibEditStr += '<div class="layui-form-item"><label class="layui-form-label"></label><div class="layui-input-block"><button id="aibSave" type="button" class="layui-btn">保存</button></div></div></form></div>';
    var doc = document.createElement('div');
    doc.innerHTML = aibEditStr;
    document.body.appendChild(doc);
    layui.form.render();
    layui.form.on('radio(aibTypeChange)', function(e){
        var formVal = layui.form.val('aibEdit');
        if (formVal.aibId == "") {
            var tmp = {aibTitle: formVal.aibTitle, aibContent: formVal.aibContent};
            layui.form.val('aibEdit', {aibTitle: aibEditPrevData.aibTitle, aibContent: aibEditPrevData.aibContent});
            aibEditPrevData = tmp;
        }
    });
    layui.$("#aibSave").click(function(){
        var formVal = layui.form.val('aibEdit');
        var fuid = getFuid();
        var postData = {fuid: fuid, title: formVal.aibTitle, content: formVal.aibContent, type: formVal.aibType * 1};
        if (formVal.aibId) {
            postData['method'] = 'UPDATE';
            postData['id'] = formVal.aibId * 1;
            post(getArticleUrl(), postData, function(res) {
                if (res && res.errMsg) {
                    layui.layer.msg(res.errMsg, {icon: 5});
                } else {
                    layui.layer.close(aibEditWindowId);
                    forcePrefetch(function() {
                        renderPage();
                        layui.layer.msg('修改成功');
                    });
                }
            });
        } else {
            postData['method'] = 'POST';
            postData['isaib'] = (formVal.aibIsAib == 'on' ? 1 : 0);
            post(getArticleUrl(), postData, function(res) {
                if (res && res.errMsg) {
                    layui.layer.msg(res.errMsg, {icon: 5});
                } else {
                    layui.layer.close(aibEditWindowId);
                    forcePrefetch();
                    layui.layer.msg('添加成功');
                }
            });
        }
    });
}

function forcePrefetch(callback) {
    GM_setValue('aibTTL', null);
    prefetch(callback);
}

function prefetch(callback) {
    function handleFetchData(fetchResult) {
        document.getElementById("aibid").innerHTML = fetchResult.id;
        if (fetchResult.alert > 0 && GM_getValue('notAlert') !== (new Date()).toDateString()) {
            document.getElementsByClassName("bigcircle2")[0].style.display="block";
        } else {
            document.getElementsByClassName("bigcircle2")[0].style.display="none";
        }
    }
    var ttl = GM_getValue('aibTTL');
    if (ttl && ttl > (new Date()).getTime()) {
        handleFetchData(GM_getValue('prefetchData'));
        if (callback) {
            callback();
        }
        return;
    }
	var fuid = getFuid();
	if (!fuid) {
		fuid = 'none';
	}

    var timer = -1;
    function timerFunc() {
        post(baseUrl + "prefetch.php", {fuid: fuid}, function(data){
            if (data.fuid != 'none') {
                if (timer != -1) {
                    clearInterval(timer);
                }
                GM_setValue('aibTTL', (new Date()).getTime() + data.ttl * 60000);
                GM_setValue('fuid', data.fuid);
                GM_setValue('prefetchData', data);
                handleFetchData(data);
                if (callback) {
                    callback();
                }
            } else {
                fuid = data.fuid;
            }
        });
    }
    timer = setInterval(timerFunc, 6000);
    timerFunc();
}

function dragable(obj) {
    function getScrollbarWidth() {
        var w1, w2, outer,inner;
        outer = document.createElement('div');
        inner = document.createElement('div');
        outer.appendChild(inner);
        outer.style.display = 'block';
        outer.style.position = 'absolute';
        outer.style.width = '50px';
        outer.style.height = '50px';
        outer.style.overflow = 'hidden';
        inner.style.height = '100px';
        inner.style.width = 'auto';
        document.body.appendChild(outer);
        w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        w2 = inner.offsetWidth;
        if (w1 === w2) {
            w2 = outer.clientWidth;
        }
        document.body.removeChild(outer);
        return w1 - w2;
    }
    function getScrollbarVisiable(){
        return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
    }
    var scrollbarWidth = getScrollbarWidth();
    var scrollbarVisiable = getScrollbarVisiable();
    var downX, downY;
    obj.onmousedown = function(event) {
        downX = event.clientX;
        downY = event.clientY;
        event = event || window.event;
        var ol = event.clientX - obj.offsetLeft;
        var ot = event.clientY - obj.offsetTop;
        document.onmousemove = function(event){
            event = event || window.event;
            var left = event.clientX - ol;
            var top = event.clientY - ot;
            if (scrollbarVisiable) {
                obj.style.right = (window.innerWidth - scrollbarWidth - left)+"px";
            } else {
                obj.style.right = (window.innerWidth - left)+"px";
            }
            obj.style.bottom = (window.innerHeight - top)+"px";
        };
        document.onmouseup = function(eventInner){
            document.onmousemove = null;
            document.onmouseup = null;
            if (eventInner.clientX == downX && eventInner.clientY == downY) {
                onAibCircleClick();
            }
        };
        return false;
    };
}

function waitAndDo(condition, callback, timeoutInMs, timeoutCallback) {
    var deadLine = 0;
    if (timeoutInMs) {
        deadLine = (new Date()).getTime() + timeoutInMs;
    }
    var timer = setInterval(function() {
        var now = (new Date()).getTime();
        if (deadLine != 0 && now > deadLine) {
            clearInterval(timer);
            timeoutCallback();
            return;
        }
        if (condition()) {
            clearInterval(timer);
            callback();
        }
    }, 20);
}

function post(url, data, callback) {
	GM.xmlHttpRequest({
		method: "POST",
		url: url,
        data: JSON.stringify(data),
		onload: function(res) {
            try {
                if (res.response) {
                    callback(JSON.parse(res.response));
                } else {
                    callback();
                }
            } catch (e) {
                console.log(res);
                console.log(res.response);
                layui.layer.msg("请稍后重试", {icon: 5});
            }
		}
	});
}

function get(url, callback) {
	GM.xmlHttpRequest({
		method: "GET",
		url: url,
		onload: function(res) {
			callback(res.response);
		}
	});
}

function createTime(v){
    var now = new Date(v * 1000);
    var yy = now.getFullYear();
    var mm = now.getMonth() + 1;
    var dd = now.getDate();
    var hh = now.getHours();
    var ii = now.getMinutes();
    var ss = now.getSeconds();
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (ii < 10) clock += '0';
    clock += ii + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

function createDate(v) {
    var now = new Date(v * 1000);
    var yy = now.getFullYear();
    var mm = now.getMonth() + 1;
    var dd = now.getDate();
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd;
    return clock;
}

function htmlEncode(rawStr) {
    return rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

function getFuid() {
    return GM_getValue('fuid');
}

function getArticleUrl() {
    return baseUrl + 'article.php';
}

function addTips(elementSelector, msgSupplier) {
    var tmpWindowId;
    var tmpWindowTimer;
    layui.$(elementSelector).mouseenter(function(event){
        tmpWindowTimer = setTimeout(function() {
            tmpWindowTimer = 0;
            tmpWindowId = layui.layer.tips(msgSupplier(event), event.target, {
                tips: [1, ''],
                time: 5000
            });
        }, 500);
    });
    layui.$(elementSelector).mouseleave(function(event){
        if (tmpWindowTimer) {
            clearTimeout(tmpWindowTimer);
        } else {
            layui.layer.close(tmpWindowId);
        }
    });
}