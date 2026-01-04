// ==UserScript==
// @name         Pixiv 辅助翻译
// @namespace    https://greasyfork.org/users/159546
// @version      1.1.7
// @description  现已支持标签TAG、作品详情页对标题和说明，以及评论区翻译！
// @author       LEORChn
// @include      *://www.pixiv.net/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      translate.google.cn
// @downloadURL https://update.greasyfork.org/scripts/372551/Pixiv%20%E8%BE%85%E5%8A%A9%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/372551/Pixiv%20%E8%BE%85%E5%8A%A9%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
var tag_trans=[
// 图型类
    '漫画','漫画',
    'うごイラ','动图',
    '厚塗り','多层上色',
    'オリジナル','原创',
// 角色类型类
    'UTAU獣人','兽人虚拟歌手',
    'ケモノ','野兽',
    'wolf','狼',
    'オオカミ','狼',
    'ハスキー','哈士奇',
    'kemono','毛怪',
    'furry','兽人',
    '獣人','兽人', // 这个是日文的
    '獸人','兽人', // 这个是繁体的
    'オスケモ','雄兽',
    'デブケモ','胖兽',
    'ケモホモ','兽人同性向',
    'ケモ交尾','兽性',
// 作品名称类
    '東京放課後サモナーズ','东京放课后召唤师', // 我在2018年9月初玩过，几号来着忘了
    '放サモ','东放',
    'housamo','东放',
    'あらしのよるに','翡翠森林狼与羊（暴风雨之夜）', // 我在2019年3月初左右观看完了这个动画
    'ひみつのともだち','秘密的朋友',
    'ゼロから始める魔法の書','从零开始的魔法书', // 我在2019年5月8日14时观看完了这个动画，17时35分开始观看第12话，17时58分观看完毕撒花
// 人物名称类
    '狼音アロ','狼音阿罗',
    'モリタカ','犬塚戍孝',
    '犬塚モリタカ','犬塚戍孝',
    'ホロケウカムイ','狼神神威', //ID为 20880639 的作者似乎打错了这个标签所以替换不到
    'テムジン','铁木真',
    'ガルム','加姆',
    'ノーマッド(放サモ)','诺曼德（东放）', // 东京放课后里的虎兽人所用的化名
    '主5','5号主人公（东放）',
    '獣の傭兵','佣兵（零书）',
// 着装类
    'ふんどし','兜裆布',
    '褌','兜裆布',
    'ラバースーツ','橡胶紧身衣',
    '靴下','袜子',
// 器官类
    '腹筋','腹肌',
    'ㄋㄟㄋㄟ','胸部',
// 行为类
    '金的','捣蛋',
    '猿轡','封口',
    '目隠し','蒙眼',
    '拘束','捆绑Play'
];
(function(){
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    if(ft('body').length==0) return;
    main_daemon();
    //inited=true; //
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        main_daemon();// write code here
        return true;
    }
}
var daemonLauncher;
function main_daemon(){
    if(daemonLauncher) return;
    daemonLauncher = setInterval(main_do, 3000);
    main_do();
}
function main_do(){
    tagTranslate_illust();             // 个人空间 > 作品列表页面 - 标签
    tagTranslate_illust_single();      // 作品页面 - 标签
    tagTranslate_bookmark();           // 个人空间 > 我的收藏页面 - 标签
    tagTranslate_addBookmark();        // 作品页面 > 编辑心页面 - 添加收藏时的可选择标签
    tagTranslate_member_tag_all();     // 个人空间 - 所有绘制的作品包含的标签（包含频率降序）
    detailTranslate_illust();          // 作品页面 - 自动翻译作品标题和简介
    button_trans_comment();            // 作品页面 - 添加评论翻译的按钮
    unblock_popular_illust_overlay();  // 搜索页面 - 有作品在“查看更多「xxx」的热门作品”面板的下方，点击该面板提示开通会员，用这个隐藏会员面板
    popup_popular_order();             // 【预想】搜索页面 - 突破会员限制
    delete_illust_expanded_ad();       // 作品页面 - 在展开多页作品后最底部会出现广告，删除它以节省滚动操作
}
// ========== 功能性
function unblock_popular_illust_overlay(){ // 搜索页面 热门作品提示
    var v = $$('.popular-introduction-overlay');
    for(var i=0; i<v.length; i++) v[i].style.display = 'none';
}
function delete_illust_expanded_ad(){ // 作品页面 广告
    var v = $('main section div iframe');
    if(v) v.remove();
}
function popup_popular_order(){ // 【预想测试】【失败】突破会员限制实现某些功能
    var v = $('.require-premium-popular_d'),
        v2 = $('._popular-search-select-popup-container');
    if(v && v2){
        v.onmousemove = v2.onmousemove = function(){
            v2.style.setProperty('display', 'block', 'important');
            v2.style.marginTop = '-5px';
        }
        v.onmouseleave = v2.onmouseleave = function(){
            v2.style.display = '';
        }
    }
}
// ========== 作品页面标签（单图预览和评论区） 以下
function tagTranslate_illust_single(){
    if(!location.pathname.startsWith('/artworks/')) return;
    var tags=$$('figcaption footer>ul>li');
    if(tags.length==0)return;
    for(var li=0;li<tags.length;li++){
        var c=tags[li].childNodes,
            tt=tagDict(c[0].innerText);
        tags[li].style.display='inline-block';
        if(tt){
            c[0].childNodes[0].innerText=tt;
            if(c.length>1) c[1].remove();
        }
    }
}
// ----- 作品页标题和说明 以下
var ID_TRANSLATION_SOURCE='leorchn_icon_google_translate', ICON_TRANSLATION_SOURCE='https://translate.google.cn/favicon.ico',
    ID_TRANSLATED_TITLE = 'leorchn_translated_title',
    ID_TRANSLATED_DESC = 'leorchn_translated_desc',
    block_detail_root;
function detailTranslate_illust(){
    if(!location.pathname.startsWith('/artworks/')) return;
    // if(!location.href.includes('mode=medium')) return;
    var detail_block_post_time = $('figcaption div[title]');
    if(!detail_block_post_time) return;
    block_detail_root = detail_block_post_time.parentElement;
    if(!fv(ID_TRANSLATION_SOURCE)){
        var img=ct('img'); img.id=ID_TRANSLATION_SOURCE; img.src=ICON_TRANSLATION_SOURCE; img.style.cssText='width:24px; float:right';
        block_detail_root.insertBefore(img, block_detail_root.children[0]);
    }
    trans_title();
    trans_desc();
}
function trans_title(){ // 作品标题
    var p=$('figcaption div>h1'), d=fv(ID_TRANSLATED_TITLE);
    if(!p) return;
    if(d){
        if(d.title == d.innerText){ // 标题块中缓存的原文与自身内容一致，表示翻译完成但与原文一致或无法翻译
            p.style.backgroundColor='#c0e0ff'; // 译文等于原文自身，给原文块加蓝底表示无需翻译
            d.style.display='none';
        }
        if(d.title == p.innerText) return; // 标题块中缓存的与原文一致，表示页面没有变化，取消翻译
        p.style.backgroundColor=''; // 页面有变化，如果修改过蓝底的就重置它
        d.parentElement.remove();
        d = undefined;
    }
    /* 要解释为什么不能在这两个if之间用else连起来，先看看进入下一个if的两种情况：
       1.新建页面，没有找到翻译块
       2.页面更改，并进入了上一个if。并且没有触碰到return，导致d被设为undefined
       很明显，2号情况决定了这俩if不能用else连起来
    */
    if(!d){ // 因为标题块没有双层嵌套，二次读取会导致缓存文字块被误翻译
        var q = ct('h1'); d = trans_create_block('');
        q.className = p.className;
        d.id=ID_TRANSLATED_TITLE;
        d.title=p.innerText; // 标题块中缓存原文
        q.appendChild(d);
        p.parentElement.insertBefore(q, p.nextElementSibling);
    }
    googleTranslateProxy(p.innerText, fv(ID_TRANSLATED_TITLE), trans_title);
}
function trans_desc(){ // 作品描述
    var p=$('figcaption div>h1+div>div'), d=fv(ID_TRANSLATED_DESC);
    if(!p) return;
    if(d){
        if(p.innerText.replace(/\s/g,'') == d.innerText.replace(/\s/g,'')){ // 标题块中缓存的原文与自身内容一致，表示翻译完成但与原文一致或无法翻译
            p.style.backgroundColor='#c0e0ff'; // 译文等于原文自身，给原文块加蓝底表示无需翻译
            d.style.display='none';
        }
        if(d.title == p.innerText) return; // 标题块中缓存的与原文一致，表示页面没有变化，取消翻译
        p.style.backgroundColor=''; // 页面有变化，如果修改过蓝底的就重置它
        d.remove();
        d = undefined;
    }
    // 这里还用复制一遍解释么，标题块那个方法里有过了
    if(!d){
        d = trans_create_block('')
        d.id=ID_TRANSLATED_DESC;
        d.title=p.innerText; // 标题块中缓存原文
        p.parentElement.appendChild(d);
    }
    googleTranslateProxy(p.innerText.replace(/\n/g, CRLF), fv(ID_TRANSLATED_DESC), trans_desc);
}
// ----- 评论区翻译按钮 以下
var ID_COMMENT_TRANSLATE_TRIGGER = 'leorchn_comment_translate_trigger',
    ID_COMMENT_TRANSLATION_BLOCK = 'leorchn_comment_translation_block';
function button_trans_comment(){
    var p=$$('main section li div>span+span+span');
    for(var i=0;i<p.length;i++){
        var parent = p[i].parentElement;
        if(parent.getElementsByClassName(ID_COMMENT_TRANSLATE_TRIGGER).length == 0){
            var d=ct('span', '翻译');
            d.className=p[i].className + ' ' + ID_COMMENT_TRANSLATE_TRIGGER;
            d.style.marginLeft='16px';
            d.onclick=function(){
                var _this=this,
                    commentRoot=this.parentElement.previousElementSibling;
                if(commentRoot.getElementsByClassName(ID_COMMENT_TRANSLATION_BLOCK).length == 0){
                    var tb = trans_create_block('')
                    tb.className = ID_COMMENT_TRANSLATION_BLOCK;
                    commentRoot.appendChild(tb);
                }
                googleTranslateProxy(commentRoot.children[0].innerText, commentRoot.getElementsByClassName(ID_COMMENT_TRANSLATION_BLOCK)[0]);
            }
            parent.appendChild(d);
        }
    }
}
// ========== 作品页面（单图预览和评论区） 以上
// ========== 自己和其他画师空间 以下
// ----- 主页（显示全部作品、筛选其中一个标签）
function tagTranslate_illust(){
    if(location.pathname != '/member_illust.php')return;
    var tags=$$('div>nav+div>div>div>ul>li');
    if(tags.length==0)return;
    for(var li=0;li<tags.length;li++){
        var c=tags[li].children,
            tt=tagDict(c[0].innerText);
        if(tt){
            c[0].innerText=tt;
        }
    }
}
// ----- 所有已加心的作品 页面
function tagTranslate_bookmark(){
    if(location.pathname != '/bookmark.php')return;
    tagTranslate_mode_tagCloud();
}
// ----- 所有绘制的作品包含的标签（包含频率降序）
function tagTranslate_member_tag_all(){
    if(location.pathname != '/member_tag_all.php')return;
    tagTranslate_mode_tagCloud();
    var tags=fc('tag-list');
    if(tags.length==0)return;
    tags=tags[0].getElementsByTagName('dd');
    for(var dd=0;dd<tags.length;dd++){
        var c=tags[dd].childNodes[0].childNodes;
        for(var li=0;li<c.length;li++){
            var tt=tagDict(c[li].innerText);
            if(tt){
                var atag= c[li].getElementsByTagName('a')[0];
                atag.innerText=tt;
                atag.style.backgroundColor='#ffd040';
            }
        }
    }
}
// ----- 加心/编辑心 页面
function tagTranslate_addBookmark(){
    if(location.pathname != '/bookmark_add.php')return;
    var tags=fc('tag-cloud');
    if(tags.length==0)return;
    for(var g=0,gt=tags;g<gt.length;g++){
        tags=gt[g].childNodes;
        for(var li=0;li<tags.length;li++){
            try{ // 作品自带标签的列表中，“原创”后面竟然跟一个空白的元素不知道为啥
                var c=tags[li].childNodes[0].childNodes,
                    cl=c.length-1,
                    tt=tagDict(c[cl].nodeValue);
                if(tt) c[cl].nodeValue=tt;
            }catch(e){}
        }
    }
}
// ========== 自己和其他画师空间 以上
// ----- 模板：标签云
function tagTranslate_mode_tagCloud(){
    var tags=fc('tagCloud');
    if(tags.length==0)return;
    tags=tags[0].childNodes;
    for(var li=0;li<tags.length;li++){
        try{
            if(tags[li].className.includes('level0')) continue;
        }catch(e){ continue; }
        tags[li].style.display='inline-block';
        var c=tags[li].childNodes[0].childNodes,
            tt=tagDict(c[0].nodeValue);
        if(tt) c[0].nodeValue=tt;
    }
}
// ----- 标签 字典翻译
function tagDict(origin){
    for(var i=0;i<tag_trans.length;i+=2)
        if(origin==tag_trans[i])
            return tag_trans[i+1];
}
var CRLF = '<br>', CRLF_REGEX_ESCAPE = '&lt;br&gt;';
// ----- 创建和编辑外部翻译块
function trans_create_block(oriText, existsBlock){
    var n=existsBlock? existsBlock: ct('p');
    n.innerHTML=oriText? googleTranslate_get(oriText).replace(new RegExp(CRLF_REGEX_ESCAPE, 'g'), CRLF): '翻译中';
    n.style.backgroundColor='#d0ffd0';
    return n;
}
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
function googleTranslateProxy(origText, postTo, invokeWhenFinish){
    /* 如果此处判定成功则是原文过长，感觉没有翻译成功的希望，暂时隐藏它。
       此处的 4500字节 = 500亚洲文字 或者 4500英文字母和数字
       空格和某些需要转义的字符和标点每个占 3字节
       亚洲文字及标点每个占 9字节。例如“我”这个字转义后是 %E6%88%91 即占用 9字节
    */
    if(encodeURI(origText).length > 4500){
        postTo.style.display = 'none';
    }
    googleTranslate(origText, function(r){
        if(!r.responseText || r.responseText.length<20) if(googleTranslateProxy(origText, postTo) || true) return;
        trans_create_block(r.responseText, postTo);
        if(postTo.style.display == 'none') postTo.style.display = ''; // 已翻译完成，取消隐藏（如果之前觉得这个翻译块没有翻译成功的希望并被隐藏的话）
        if(invokeWhenFinish) try{ invokeWhenFinish(); }catch(e){}
    });
}
function googleTranslate_get(origin){
    return new RegExp('<div\\s.{0,15}class=\\"t0\\".{0,15}>(.*)<\\/div><f').exec(origin)[1];
}
function googleTranslate(word,dofun,dofail){
    http('get','https://translate.google.cn/m?hl=zh-CN&sl=auto&tl=zh-CN&ie=UTF-8&prev=_m&q='+encodeURI(word),'',dofun,dofail);
}
function http(_method,_url,formdata,dofun,dofail){
    GM_xmlhttpRequest({
        method: _method.toUpperCase(),
        url: _url,
        data: formdata,
        headers:{},
        onload: dofun,
        onerror: dofail
    });
}
