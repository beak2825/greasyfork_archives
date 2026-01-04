// ==UserScript==
// @name         鸟坛辅助脚本
// @namespace    http://tampermonkey.net/combatsimbbs/
// @version      1.1.1
// @description  论坛帖子的折叠、展开、存储，未读帖子标红等功能
// @author       YY
// @match        http://combatsim.bbs.net/bbs/01/index.html*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/32707/%E9%B8%9F%E5%9D%9B%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/32707/%E9%B8%9F%E5%9D%9B%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function addLink(){
        var unfold = document.createElement('a');
        unfold.innerHTML = '全部展开';
        unfold.href = 'javascript:void(0)';
        unfold.addEventListener('click',()=>{
            unfold_all();
        });
        var fold = document.createElement('a');
        fold.innerHTML = '全部折叠';
        fold.href = 'javascript:void(0)';
        fold.addEventListener('click',()=>{
            fold_all();
        });
        var reset = document.createElement('a');
        reset.id = 'reset_btn';
        reset.innerHTML = '清空缓存(已读帖子' + GM_getValue('reads')?GM_getValue('reads').length:0  + '个)';
        reset.href = 'javascript:void(0)';
        reset.addEventListener('click',()=>{
            GM_setValue('reads',[]);
            check_current_screen();
        });
        var f = document.querySelector('form[name="login"]');
        f.appendChild(unfold);
        f.insertAdjacentHTML('beforeend','|');
        f.appendChild(fold);
        f.insertAdjacentHTML('beforeend','|');
        f.appendChild(reset);
    }
    
    function unfold_all(){
        // 全部展开所有主题        
        var top_ul = document.querySelector('body>ul');
        var num = top_ul.children.length;
        for(var i = 0;i<num;i++){
            var node = top_ul.children[i];
            if(node.nodeName === 'DIV'){
                if(!node.id)
                    continue;
                if(node.id.indexOf('fake')<0){
                    node.style = "";
                }
                else{
                    node.style = "display:none";
                }
                GM_setValue(node.id,true);
            }
        }
        //calculate_posts_offset_height();
    }
    function fold_all(){
        // 全部折叠所有主题
        var top_ul = document.querySelector('body>ul');
        var num = top_ul.children.length;
        for(var i = 0;i<num;i++){
            var node = top_ul.children[i];
            if(node.nodeName === 'DIV'){
                if(!node.id)
                    continue;
                if(node.id.indexOf('fake')<0){
                    node.style = "display:none";
                }
                else{
                    node.style = "";
                }
                GM_setValue(node.id,false);
            }
        }
        //calculate_posts_offset_height();
    }
    unsafeWindow.fold = function (id){
        var fake_div = document.querySelector('[id="' + id + '_fake"]');
        var real_div = document.querySelector('[id="' + id + '"]');
        real_div.style = "display:none";
        fake_div.style = "";
        GM_setValue(id,false);
        //calculate_posts_offset_height();
    };
    unsafeWindow.unfold = function (id){
        var fake_div = document.querySelector('[id="' + id + '_fake"]');
        var real_div = document.querySelector('[id="' + id + '"]');
        real_div.style = "";
        fake_div.style = "display:none";
        GM_setValue(id,true);
        //calculate_posts_offset_height();
    };
    function topics_handle(){
        // 将每个主题包裹在一个div中
        var top_ul = document.querySelector('body>ul');
        var ul_content = top_ul.innerHTML;
        ul_content = '<div>' + ul_content + '</div>';
        ul_content = ul_content.replace(/<hr align="LEFT" size="0" noshade="" width="80%">/g,'</div><hr align="LEFT" size="0" noshade="" width="80%"><div>');
        // top_ul_fake不添加进页面，全部处理完毕后再替换为原页面内容
        var top_ul_fake = document.createElement('ul');
        top_ul_fake.innerHTML = ul_content;
        var num = top_ul_fake.children.length;
        for(var i = num-1;i>=0;i--){
            var node = top_ul_fake.children[i];
            if(node.nodeName === 'DIV'){      // topic 的div标签，包含所有内容
                var title = node.children[0];    // li 元素
                var topic_url = title.querySelector('a').href;
                if(node.children.length > 1){
                    // 如果帖子只有标题没有内容，且没有回复的话，就不处理。 否则就添加一个额外的标题div
                    var topic_id = topic_url.substring(topic_url.lastIndexOf('/')+1,topic_url.indexOf('.html'));  // 截取到这个topic的id
                    node.id = topic_id;
                    var fold_btn = document.createElement('a');    // 添加折叠按钮
                    fold_btn.href = 'javascript:window.fold(' + topic_id + ')';
                    fold_btn.innerHTML = '<b style="font-size:16px">&nbsp;-&nbsp;</b>';
                    
                    var unfold_btn = document.createElement('a');    // 添加展开按钮
                    unfold_btn.href = 'javascript:window.unfold(' + topic_id + ')';
                    unfold_btn.innerHTML = '<b style="font-size:16px">&nbsp;+&nbsp;</b>';
                    var newTitle = document.createElement('div');
                    newTitle.id = topic_id + '_fake';
                    newTitle.innerHTML = '<li>' + title.innerHTML + '</li>';
                    newTitle.children[0].appendChild(unfold_btn);
                    title.appendChild(fold_btn);
                    top_ul_fake.insertBefore(newTitle,node);   // 在topic div标签前加一个title div
                    
                    // 获取浏览器存储数据，判断是否需要显示
                    var isShow = GM_getValue(topic_id) === false?false:true;
                    if(isShow){
                        node.style = "";
                        newTitle.style = "display:none";
                    }
                    else{
                        newTitle.style = "";
                        node.style = "display:none";
                    }
                }
            }
        }
        // 全部处理完毕后再替换为原页面内容
        top_ul.innerHTML = top_ul_fake.innerHTML;
    }

    // 简单的节流函数
    function throttle(func, wait, mustRun) {
        var timeout,
            startTime = new Date();

        return function() {
            var context = this,
                args = arguments,
                curTime = new Date();
            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if(curTime - startTime >= mustRun){
                func.apply(context,args);
                startTime = curTime;
                // 没达到触发间隔，重新设定定时器
            }else{
                timeout = setTimeout(func, wait);
            }
        };
    }

    function calculate_posts_offset_height(){
        var start = new Date();
        var posts = document.querySelectorAll('li>a:first-of-type');
        var last = 0;
        var num = 0;
        var href = '';
        var last_id = '';
        var temp_id = '';
        posts_offset_height = [];
        posts_ids = [];
        posts.forEach(function(post){
            var off = post.offsetTop;
            if(off === 0)
                off = last;
            else
                last = off;
            posts_offset_height.push(off);
            href = post.href;
            temp_id = 'post-' + href.slice(href.lastIndexOf('/')+1,href.lastIndexOf('.'));
            post.id = temp_id === last_id? temp_id+'-fake':temp_id;
            last_id = post.id;
            posts_ids.push(post.id);
        });
        //console.log('cal-time----' + (new Date() - start));  //35ms
        //console.log(posts_offset_height);
        //console.log(posts_ids);

    }

    function check_current_screen(){
        // 检查当前网页可见区域，返回在区域内的post id 范围
        var start = new Date();
        var top = document.body.scrollTop;
        var bottom = document.body.clientHeight + top;
        var top_id,bottom_id,length=posts_offset_height.length;
        for (var i = 0;i<length;i++){
            if (top < posts_offset_height[i]){
                top_id = i===0?0:i-1;
                break;
            }
        }
        for (var j = top_id;j<length;j++){
            if(bottom<posts_offset_height[j]){
                bottom_id = j;
                break;
            }
        }
        var post_in_screen = [];
        var reads = GM_getValue('reads') || [];
        if(top_id===0){
            post_in_screen.push(posts_ids[0]);
        }
        for(var k = top_id+1;k<(bottom_id?bottom_id:length-1);k++){
            post_in_screen.push(posts_ids[k]);
        }
        if(!bottom_id){
            post_in_screen.push(posts_ids[length-1]);
        }
        var new_reads = Array.from(new Set(reads.concat(post_in_screen)));
        // 将本屏幕还有上下两个20个帖子都设置好颜色,缓冲区
        var start_id = top_id > 20?top_id-20:0;
        var end_id = !bottom_id?length-1:(length-1-bottom_id>20?bottom_id+20:length-1);
        for(var m = start_id;m<=end_id;m++){
            if(new_reads.indexOf(posts_ids[m])<0){
                document.getElementById(posts_ids[m]).style.color = 'red';
            }
        }
        GM_setValue('reads',new_reads);
        var resetBtn = document.getElementById('reset_btn');
        resetBtn.innerHTML = '清空缓存(已读帖子' + new_reads.length  + '个)';
        //console.log('check-time----' + (new Date() - start));

    }
    //var s1 = new Date();
    // 折叠帖子功能
    if(!GM_getValue('reads'))
        GM_setValue('reads',[]);
    addLink();
    topics_handle();
    // 两个数组一一对应，一个是每个post的offsetHeight，一个是post的id
    var posts_offset_height = [];
    var posts_ids = [];
    //console.log('s3----' + (new Date() - s1));
    var scrollHeight = document.body.scrollHeight;
    //console.log('s3-1----' + (new Date() - s1));
    //setTimeout(function(){
        // 未阅读标红功能
        calculate_posts_offset_height();
        // 采用了节流函数
        unsafeWindow.addEventListener('scroll',throttle(check_current_screen,200,500));
        check_current_screen();
    //},2000);
    //console.log('s4----' + (new Date() - s1));
    setInterval(function(){
        // 为防止一开始加载大图片后缩小，还有手动展开收缩帖子导致的网页高度变化，每5秒中检测一下网页body的高度，如果变化则重新计算。
        //console.log(document.body.scrollHeight);
        if (scrollHeight !== document.body.scrollHeight){
            scrollHeight = document.body.scrollHeight;
            calculate_posts_offset_height();
        }
    },5000);
    //console.log('all-time----' + (new Date() - s1));
})();