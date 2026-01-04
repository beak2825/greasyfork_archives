// ==UserScript==
// @name         我的推特工具箱
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.5
// @description  视频兼容修复。查看用户的永久链接。
// @author       LEORChn
// @include      *://twitter.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      download-twitter-videos.com
// @downloadURL https://update.greasyfork.org/scripts/381019/%E6%88%91%E7%9A%84%E6%8E%A8%E7%89%B9%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/381019/%E6%88%91%E7%9A%84%E6%8E%A8%E7%89%B9%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

var IntervalTime = 2000;
function onIntervalFunction(){
    //doAddEntry(); // 隐藏转推。不稳定，如有需要请自行取消注释
    //doHideRetweet(); // 隐藏转推。不稳定，如有需要请自行取消注释
    doAddVideoEntry();
    doAddUidViewer(); // 用户资料：永久链接
    adaptDoublePhotoHeight();
    doFixImageView();
}

var ID_HIDE_RETWEET_ENTRY = 'leorchn_action_hide_retweet',
    HIDE_RETWEET_ENABLED = false,
    HIDE_RETWEET_ENABLED_V2019 = false;
function doAddEntry(){
    if(fv(ID_HIDE_RETWEET_ENTRY)) return;
    var bar = $('.ProfileHeading-toggle');
    var li = ct('li'), a = ct('a', '隐藏转推');
    if(bar){ // 新布局，登录后强制启用的那种（不知道怎么返回旧布局，新布局真的用着太难过了）
        li.className='ProfileHeading-toggleItem  u-textUserColor';
        a.className='ProfileHeading-toggleLink js-nav';
        a.onclick=function(){
            this.parentNode.className='ProfileHeading-toggleItem  is-active';
            this.outerHTML=this.innerText;
            HIDE_RETWEET_ENABLED = true;
        };
        li.appendChild(a);
    }else{ // 旧布局
        bar = $('[aria-hidden]+div[role=tablist]');
        if(!bar) return; // 真的不知道是什么布局了，return
        li = bar.lastElementChild.cloneNode(true);
        a = li.lastElementChild;
        a.removeAttribute('href');
        a.onclick=function(){
            this.lastElementChild.style.color = 'rgb(29, 161, 242)';
            HIDE_RETWEET_ENABLED = HIDE_RETWEET_ENABLED_V2019 = true;
        };
        var span = li;
        while(span.lastElementChild != null) span = span.lastElementChild;
        span.innerText = '隐藏转推';
    }
    li.id = ID_HIDE_RETWEET_ENTRY;

    bar.appendChild(li);
}
function doHideRetweet(){
    if( ! HIDE_RETWEET_ENABLED ) return;
    try{
        var retweets = fc('js-retweet-text');
        while(retweets.length > 0)retweets[0].parentNode.parentNode.parentNode.parentNode.remove();
    }catch(e){
        pl(e);
    }
    if( ! HIDE_RETWEET_ENABLED_V2019) return;
    var tweetRoot, tweetRoot2, retweets19 = $$('article:not([isHideRetweet])'), alignH, retweetMarkRoot;
    try{
        for(var i=0; i<retweets19.length; i++){
            alignH = retweets19[i].firstElementChild;
            retweetMarkRoot = alignH.firstElementChild;
            if(retweetMarkRoot.innerText.includes('转推了')){
                tweetRoot2 = retweets19[i].parentNode;
                tweetRoot = tweetRoot2.parentNode;
                retweets19[i].setAttribute('isHideRetweet', '1');
                var hidehint = ct('div', '隐藏了一条转推。');
                hidehint.style.height = tweetRoot2.offsetHeight + 'px';
                hidehint.className = 'LEORChn_HIDE_RETWEET_HINT';
                tweetRoot2.style.display = 'none';
                tweetRoot.appendChild(hidehint);
            }
            pl('hide retweet is running');
        }
    }catch(e){
        pl(e);
        pl(retweets19);
    }
}
//-----
function doAddVideoEntry(){
    var r=$('.PlayableMedia--video:only-child'),
        pageType = 0;
    if(!r){
        r = $('video:not([blur]):not([hasvideoproxy])');
        pageType++;
    }
    if(!r) return;
    var v=ct('video'),
        a=ct('a', '视频无法播放？点此解决');
    if(pageType == 0){
        r=r.parentNode;
    }else if(pageType == 1){
        var rootPadding = r.parentElement,
            videoSlot, videoSlotPadding, videoHolderRoot;
        videoSlot = videoSlotPadding = videoHolderRoot = null;
        while(rootPadding.children.length <= 3){
            videoHolderRoot = videoSlotPadding;
            videoSlotPadding = videoSlot;
            videoSlot = rootPadding;
            rootPadding = rootPadding.parentElement;
        }
        v.setAttribute('blur', 'v2');
        var tweetsURL = getTweetsURL(videoHolderRoot);
        a.setAttribute('data-permalink-path', tweetsURL);// 适配旧版代码
        a.href = '/'+tweetsURL; // 鼠标放在文字上时，浏览器左下角显示原帖地址（但是并不是用于点击后跳转，所以在下文的onclick里return false）
        r.setAttribute('hasvideoproxy', '1');
        r=videoSlotPadding;//.appendChild(a); // 适配旧版代码
    }
    a.style.color = 'rgb(27, 149, 224)';
    a.style.cursor = 'help';
    v.style.cssText='position:absolute; width:100%; height:calc(100% - 20px); top:0; display:none';
    r.appendChild(v);
    r.appendChild(a);
    a.onclick=function(){
        if(v.getAttribute('blur') == 'v2')
            v.parentElement.children[0].style.cssText = '-webkit-filter:blur(20px); filter:blur(20px)';
        v.style.display='';
        var curTweet, curNode = this;
        while(!curNode.hasAttribute('data-permalink-path') && curNode != document.body) curNode = curNode.parentNode;
        if(curNode == document.body) return;
        curTweet = encodeURIComponent('https://twitter.com/'+curNode.getAttribute('data-permalink-path'));
        /*	- more tools:
            https://download-twitter-videos.com/
            https://mydowndown.com/twitter
        */
        http2('post', 'https://download-twitter-videos.com/zh/core/ajax.php', 'host=twitter&url='+curTweet, function(){
            var res=this.responseText,
                reg=new RegExp('http[^>]*\\.mp4[0-9a-zA-Z\?=%]{0,}','g'),
                rsl=reg.exec(res);
            pl(res); pl(rsl);
            v.autoplay = v.loop = v.controls = true;
            v.src = rsl[0];
            v.style.height = '100%';
            v.volume = 0.6;
        });
        return false; // 鼠标放在文字上时，浏览器左下角显示原帖地址（但是并不是用于点击后跳转，所以return false）
    }
    v.onplay = function(){
        if(a) a.remove();
    }
    v.onclick = function(e){
        if(v.duration == 0) return;
        if(v.paused) v.play(); else v.pause();
        e.stopPropagation();
    }
}
function getTweetsURL(element){ // 获取当前视频元素所在的帖子的真实URL
    var url = null,
        testcase = /[^\/]*?\/status\/[0-9]*/; // 一个用于测试是否是具体帖子URL的用例。【[用户ID]/status/[帖子ID_数字]】
    var testReplyRootUrl = (function(e){
         /* 已测试：
            进入一个回复帖页面，原帖中包含的视频 https://twitter.com/LEORChn/status/1230184640842829825
            进入一个主题帖页面，原帖和回复帖均包含视频 https://twitter.com/Chisen_Lupus/status/1229804782589706240
            进入一个帐号的空间页面，切换到“媒体”选项卡之后看到的每一个视频
         */
        var links = e.parentNode.parentNode.parentNode.firstElementChild.querySelectorAll('a');
        for(var i=0; i<links.length; i++)
            if(testcase.test(links[i].href))
                return testcase.exec(links[i])[0];
    })(element);
    if(testReplyRootUrl) return testReplyRootUrl;
    return testcase.exec(location.pathname)[0];
}

//----- 在用户资料页面添加一个视图以查看他的永久链接
var ID_USER_FOREVER_UID = 'leorchn_user_id';
function doAddUidViewer(){
    if(fv(ID_USER_FOREVER_UID)) return;
    var followbtn = $('main a+div a+div [data-testid*=follow]'); // 定位到资料页面本人的关注按钮，而不是其他的关注按钮
    if(followbtn == null){ // 自己的资料页面
        followbtn = $('a[href^="/settings/profile"]');
        if(followbtn == null){
            pl('永久链接显示失败，可能是功能已失效。');
            return;
        }
        var my_uid_testcase = /\"user_id\".*?(\d+)/,
            my_uid_source = $('script[nonce]').innerText,
            my_uid = my_uid_testcase.exec(my_uid_source)[1];
        followbtn.setAttribute('data-testid', my_uid);
        followbtn.parentNode.style.display = 'block'; // 不加这个会导致气泡与“编辑个人资料”按钮重叠在一起
    }
    var a = ct('a'),
        coret = ct('span'),
        text = ct('span', '用户的永久链接');

        a.style.cssText = 'position:absolute; right:0; width:120px; padding:5px; margin-top:10px; border:#1da1f2 solid 1px; border-radius:10px; text-align:center; color:#1da1f2; text-decoration:none';
    coret.style.cssText = 'position:absolute; right:25px; width:10px; height:10px; top:-6px;      border:#1da1f2 solid 1px; border-bottom:none; border-right:none; transform:rotate(45deg); background-color:#fff;';

    a.href = '/i/user/' + /\d*/.exec(followbtn.getAttribute('data-testid'))[0];
    a.target = '_blank';
    a.id = ID_USER_FOREVER_UID;
    a.appendChild(coret);
    a.appendChild(text);
    followbtn.parentNode.appendChild(a);

    var tmpView = followbtn, tmpView2;
    while(true){ // 把名称 margin 一下以免挡到链接点击
        tmpView2 = tmpView;
        tmpView = tmpView.parentNode;
        if(document.body == tmpView) break;
        var prev = tmpView.previousElementSibling
        if(prev == null) continue;
        //if(prev.tagName.toLowerCase() != 'a') continue; // 这个在自己的资料页面会测试失败
        if(tmpView.children.length < 3) continue;
        if( ! tmpView.innerText.includes('@')) continue;
        tmpView2.nextElementSibling.style.marginRight = '130px';
        break;
    }
}

//-----

function adaptDoublePhotoHeight(){
    var a = $('.permalink-container .AdaptiveMedia');
    if(a) a.style.maxHeight = '500%'; // 重置设置，突破界限

    a = $$('.permalink-container .AdaptiveMedia-doublePhoto');
    for(var i=0;i<a.length;i++){
        a[i].style.lineHeight = 0; // 修改后的双图底部会多出一点点边框很难看
        a[i].style.height = '100%'; // 重置掉原先固定的大小
    }
    a = $$('.permalink-container .AdaptiveMedia-doublePhoto img');
    for(var b=0;b<a.length;b++){
        a[b].style.top = a[b].style.left = 0; // 重置
        a[b].style.height = ''; // 重置固定高度
        a[b].style.position = 'static'; // 确保图片保持在边框里面
        a[b].style.maxWidth = '100%'; // 限制双图宽度（横向扩展度）
    }
}

function doFixImageView(){
    var t = $$('div[aria-label=上一个]');
    if(t.lengh == 0) return;
    for(var i=0; i<t.length; i++){
        t[i].parentElement.style.position = 'static';
    }
}
//-----
(function(){
    setInterval(onIntervalFunction, IntervalTime);
})();
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag, t){var d=document.createElement(tag); if(t)d.innerText=t; return d;}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function http(method,url,formed,dofun,dofail){
	var x = new XMLHttpRequest();
	if(location.protocol.includes('https')) url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.timeout=60000;
	x.responseType="text"; // IE要求先open才能设置timeout和responseType
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
function getHeaders(){
    return {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', // 如果没有这个，就会默认是 text/plain 并导致错误
        cookie: '__cfduid=d507d0eb58ae7839d11def0ca83e943631553697169',
        referer: 'https://download-twitter-videos.com/'
    };
}
function http2(_method,_url,formdata,dofun,dofail){
    pl('request cross-site http:\n\n'+_method+' '+_url+'\nform: '+formdata+'\n\n.');
    GM_xmlhttpRequest({
        method: _method.toUpperCase(),
        url: _url,
        data: formdata,
        headers: getHeaders(),
        onload: dofun,
        onerror: dofail
    });
}
function mkformdata(arr){
    var f = new FormData();
    for(var i in arr){
        var s = arr[i].split('=');
        pl(s);
        f.append(s[0], decodeURIComponent(s[1]));
    }
    return f;
}
