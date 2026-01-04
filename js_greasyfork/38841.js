// ==UserScript==
// @name         NGA Subscribe Tool
// @namespace    https://greasyfork.org/zh-CN/scripts/38841-nga-subscribe-tool
// @version      0.1.2.20180413
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA 订阅工具，在打开页面时检测关注的作者是否发布了新帖，若是则在进入版面时弹出提醒（在帖子内不提醒）
// @author       AgLandy
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/(thread\.php\?(f|st)id|read).+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/38841/NGA%20Subscribe%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/38841/NGA%20Subscribe%20Tool.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=13525229

(function(){

    function init(usl){

        let $ = usl.$,
            st = commonui.subscribeTool = {
                init: function(){
                    let data = {s: 0};
                    if(localStorage.subscribeToolData)
                        data = JSON.parse(localStorage.subscribeToolData);
                    else{
                        data[8143443] = {'name': '奥妮酱', 'read': 1};
                        localStorage.subscribeToolData = JSON.stringify(data);
                    }
                    return data;
                },
                cache: {},
                f: function(ck){
                    let noti = commonui.notification,
                        go = function(){
                            for(let i = 0; i < ck.length; i++){
                                let t = st.cache[ck[i]],
                                    s = commonui.cutstrbylen(t[2],19);
                                if(s.length < t[2].length)
                                    s += '...';
                                $('<span><b style="color:blue">&#9632;</b> <span class="silver">' +
                                  commonui.time2dis(ck[i]) +
                                  ' <a class="b" target="_blank" href="/nuke.php?func=ucp&uid=' + t[1] + '">' +
                                  t[0] +
                                  '</a> 发布了主题 <nobr><a class="b" href="' + t[3] + '" title="' + t[2] + '" target="_blank">' +
                                  s +
                                  '</a></nobr><br></span></span>').prependTo('div.single_ttip2 div.div1:has(span.title:contains("提醒信息")) td:eq(0)');  //js_notification.js
                                st.data[t[1]].read = 1;
                                localStorage.subscribeToolData = JSON.stringify(st.data);
                            }
                            st.cache = {};
                        };
                    if(!noti.box)
                        noti.createBox();
                    if(noti.box.style.display != 'none')
                        return go();
                    if(!document.body)
                        return window.setTimeout(function(){st.f(ck);}, 3000);
                    if(noti.box.parentNode != document.body)
                        document.body.appendChild(noti.box);
                    noti.box._.show(0, 0);
                    if(noti.box.offsetHeight > __NUKE.position.get().ch){
                        if(noti.box.style.position != 'absolute')
                            noti.box.style.position = 'absolute';
                        if(noti.timeout)
                            window.clearInterval(noti.timeout);
                    }
                    else{
                        if(noti.box.style.position != 'fixed')
                            noti.box.style.position = 'fixed';
                        if(window.__UA && __UA[0] == 1 && __UA[1] <= 6)
                            noti.timeout = window.setInterval(function(){commonui.notification.checkPos();}, 3000);
                    }  //notification.js  commonui.notification.openBox
                    go();
                },
                r: function(){
                    //在帖子中为除自己以外的楼层添加关注按钮
                    if(usl.lS && $('a[name="uid"]')[0]){
                        $('a[name="uid"]').next().remove();  //去除已有的按钮
                        $('a[name="uid"]').closest('td').unbind('.stBtn');  //解绑悬停事件
                        $('a[name="uid"]').each(function(i, uid){
                            let a = $(uid),
                                u = a.text();
                            if(u == __CURRENT_UID)
                                return;
                            a.parent().css({'position':'relative'});
                            let d = $('<span style="font:15px/16px Serif;vertical-align:bottom;margin-left:3px;color:#ff7800;cursor:pointer;' + (st.data.s ? '' : 'display:none;') + '" />').html(st.data[u] ? '♥' : '♡').click(function(){
                                d.html(st.data[u] ? '♡' : '♥');
                                st.data[u] = st.data[u] ? null : {'name': commonui.posterInfo.uI.users[u].username, 'read': 1};
                                localStorage.subscribeToolData = JSON.stringify(st.data);
                            }).insertAfter(a);
                            if(!st.data.s)
                                a.closest('td').bind({
                                    'mouseenter.stBtn': function(){d.fadeIn();},
                                    'mouseleave.stBtn': function(){d.fadeOut();}
                                });
                        });  //添加按钮及绑定事件
                    }

                    //检测是否有关注作者的新帖
                    let n = 0;
                    if(usl.lS)
                        $.each(st.data, function(k, v){
                            if(v == null || k == 's'){
                                n++;
                                return;
                            }  //取消关注的作者跳过检测
                            if(commonui.postArg && commonui.postArg.data[0] && commonui.postArg.data[0].pAid == k && __CURRENT_TID > v.lastTid){
                                v.lastTid = __CURRENT_TID;
                                v.read = 1;
                                localStorage.subscribeToolData = JSON.stringify(st.data);
                                n++;
                                return;
                            }  //若当前页为关注作者的新帖首页则不再提示该帖
                            $.post('thread.php?order_by=postdatedesc&authorid=' + k, 'lite=xml', function(response){
                                let t = $(response).find('__T item:eq(0)'),
                                    tid = parseInt(t.find('tid').text()),
                                    postdate = parseInt(t.find('postdate').text()),
                                    author = t.find('author').text(),
                                    authorid = t.find('authorid').text(),
                                    subject = t.find('subject').text(),
                                    url = t.find('tpcurl').text();
                                if(tid > v.lastTid){
                                    v.read = 0;
                                    if(authorid != '0')
                                        st.cache[postdate] = [author, authorid, subject, url];
                                }
                                else if(authorid != '0' && v.read == 0){
                                    st.cache[postdate] = [author, authorid, subject, url];
                                }
                                v.lastTid = tid;
                                localStorage.subscribeToolData = JSON.stringify(st.data);
                                n++;
                            });
                        });

                    //版面中显示关注作者头像及新帖提醒
                    if(/\/thread\.php\?(f|st)id.+$/.test(window.location.href)){
                        //新帖提醒
                        if(usl.lS)
                            (function check(){
                                if(st.check){
                                    if(st.check > 20){
                                        st.lastCheck = 'timeout';
                                        delete st.check;
                                        st.cache = {};
                                        return;
                                    }
                                    else
                                        st.check++;
                                }
                                else
                                    st.check = 1;

                                if(n == Object.keys(st.data).length){
                                    st.lastCheck = st.check;
                                    delete st.check;
                                    let ck = Object.keys(st.cache);
                                    if(ck[0])
                                        if(commonui.notification)
                                            st.f(ck);
                                        else
                                            commonui.loadNotiScript(function(){
                                                st.f(ck);
                                            });
                                }
                                else
                                    setTimeout(function(){
                                        check();
                                    },150);
                            })();

                        //显示关注作者头像
                        let authors = $('div#mc a[href^="/nuke.php?func=ucp&uid="]');
                        if(!authors[0])
                            return;
                        authors.each(function(i, author){
                            let uid = author.title.replace(/\D/g, '');
                            if(!st.data[uid] || $(author).prev('div:has(img)')[0])
                                return;
                            $.post('nuke.php?__lib=ucp&__act=get&uid=' + uid, '__output=12', function(response){
                                if(!response.result.avatar)
                                    return;
                                let a = commonui.selectAvatar(response.result.avatar, __CURRENT_UID),
                                    td = author.parentNode,
                                    rp = td.getClientRects()[0],
                                    h = rp.bottom - rp.top,
                                    d = _$('/div').$0(
                                        'style', {
                                            borderRight: '1px solid ' + __COLOR.bg0,
                                            overflow: 'hidden',
                                            width: h + 'px',
                                            height: h + 'px',
                                            cssFloat: 'left',
                                            margin: '-6px 0 -6px -' + h + 'px'
                                        },
                                        _$('/img').$0(
                                            'onload', function(){
                                                let r;
                                                if(this.height > this.width){
                                                    r = h / this.width;
                                                    this.width = h;
                                                    this.height *= r;
                                                    this.style.marginTop = (Math.abs(h - this.height) / 3 * -1) + 'px';
                                                }
                                                else{
                                                    r = h / this.height;
                                                    this.height = h;
                                                    this.width *= r;
                                                    this.style.marginLeft = (Math.abs(h - this.width) / 2 * -1) + 'px';
                                                }
                                                this.style.opacity = 0.7;
                                                this.style.display = '';
                                            },
                                            'style', {display:'none'},
                                            'src', a
                                        )
                                    );
                                td.style.paddingLeft = h + 'px';
                                $(author).before(d);  //forum.js  commonui.loadThreadInfoSetAvatar
                            });
                        });
                    }
                }
            };

        commonui.mainMenu.data[402] = {innerHTML: '订阅按钮设置', on: {event: 'click', func: function(e){
            let o = __SETTING.o = commonui.createadminwindow(),
                k = _$('/input').$0('type','checkbox','checked',0)._.on('click', function(){
                    st.data.s = this.checked ? 0 : 1;
                    localStorage.subscribeToolData = JSON.stringify(st.data);
                    st.r();
                });
            o._.addContent(null);
            o._.addTitle('订阅按钮设置');
            o._.addContent(
                k,
                '悬停显示',
                _$('/br')
            );
            if(!st.data.s)
                k._.attr('checked', 1);
            o._.show(e);
        }}, parent: 18};
        commonui.mainMenu.data[18].subKeys.push(402);

        st.data = usl.lS ? st.init() : {'8143443':{'name':'奥妮酱'}, s: 0};

        st.r();

        if(!usl.userScriptData.stBtn)
            usl.userScriptData.stBtn = st.r;

    }

    (function check(){
        try{
            if(commonui.userScriptLoader.$)
                init(commonui.userScriptLoader);
            else
                setTimeout(check, 5);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();

})();
