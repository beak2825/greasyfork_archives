// ==UserScript==
// @name        京东优惠券抢购
// @author      rjw
// @description 京东优惠券刷新测试
// @namespace   com.uestc.rjw
// @icon        https://raw.githubusercontent.com/babyrjw/StaticFiles/master/logo_jd.jpg
// @license     Apache Licence V2
// @encoding    utf-8
// @date        18/06/2017
// @modified    18/06/2017
// @noframes
// @match       *://sale.jd.com/act/*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @run-at      document-idle
// @connect     jd.com
// @version     1.0.6
// @downloadURL https://update.greasyfork.org/scripts/30716/%E4%BA%AC%E4%B8%9C%E4%BC%98%E6%83%A0%E5%88%B8%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/30716/%E4%BA%AC%E4%B8%9C%E4%BC%98%E6%83%A0%E5%88%B8%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==


/*
 * === 说明 ===
 *@作者:rjw
 *@Email:babyrjw@163.com
 * */
/*
 *优惠券一般是<a>标签内部嵌套一个<img>图片，<a>标签的href是领取优惠券的链接
 *
 * */
(function add_start(){
    function init_page(){
        console.log('handle all coupon link :'+unsafeWindow.location);
        //移除优惠券已抢完和倒计时的状态
        var all_coupon_state = $('a.coup-state');
        all_coupon_state.each(function(index, e){
            $(this).remove();
        });
        var all_a = $("a[href*='coupon.jd.com/ilink/']");
        console.log('all_a:'+all_a.length);
        all_a.each(function(index, e){
            //清理<a>标签的 href, target属性
            var item = $(this);
            var url = item.attr('href');
            item.attr('data-url',url);
            item.removeAttr('href');
            item.removeAttr('target');
            var children = $(this).children();
             //添加按钮
            var item_id = "retrive_coupon_msg"+index;
            var item_btn = "retrive_coupon_txt"+index;
            var ele_btn;
            if(children.length > 0){
                //计算加入按钮后<a>标签的高度
                //var height = 0;
                //for(var i = 0 ; i < children.length; ++i){
                //    console.log(children[i]+" "+i+" "+children[i].offsetHeight);
                //    height += children[i].offsetHeight;
                //}
                //height += 58;
                //如果<a>标签的高度或者它的父节点的高度不够，设置高度以保证按钮显示
                //var element = $(this);
                //console.log('***************');
                //console.log(this);
                //while(element[0] !== undefined && 'body' != element[0].tagName.toLowerCase()){
                //    if("static" == element.css('display')){
                //        element.css('display','inline-block');
                //    }
                    //console.log(element);
                    //console.log(element.height() + " "+element.css('height'));
                    //element.height(height);
                //   element.css('height','auto');
                //    element = $(element.parent());
                //    console.log(element[0].tagName);
                //}
                ele_btn = $("<button onclick='on_click_event()' style='opacity:0.9;display:block;width:100%;height:58px;font-size:1.5em;z-index:999'><span id='"+item_btn+"'>获取优惠券</span><br/><span id='"+item_id+"' style='font-size:0.5em'></span></button>");
                $(this).prepend(ele_btn);
            }else if($(this).attr('class').indexOf('hot-link') >= 0){
                console.log(this);
                var coupon_item = $(this);
                ele_btn = $("<button onclick='on_click_event()' style='opacity:0.9;display:block;position:absolute;left:"+coupon_item.position().left+"px;width:"+coupon_item.width()+"px;height:58px;top:"+(coupon_item.position().top)+"px;font-size:1.5em;z-index:999'><span id='"+item_btn+"'>获取优惠券</span><br/><span id='"+item_id+"' style='font-size:0.5em'></span></button>");
                $(this).before(ele_btn);
            }else{
                ele_btn = $("<button onclick='on_click_event()' style='opacity:0.9;display:block;width:100%;height:58px;font-size:1.5em;z-index:999'><span id='"+item_btn+"'>获取优惠券</span><br/><span id='"+item_id+"' style='font-size:0.5em'></span></button>");
                console.log($(this).attr('class'));
            }

            var click_count = 0;
            var is_continue = false;
            $(this).on('click',on_click_event);
            ele_btn.on('click',on_click_event);
            //点击按钮后循环请求领取优惠券的链接
            function on_click_event(){
                click_count = 0;
                is_continue = !is_continue;
                function get_coupon(){
                    click_count += 1;
                    GM_xmlhttpRequest({
                        url:url,
                        method:'GET',
                        onload:function(response){
                            var msg = '';
                            if(response.finalUrl.indexOf('passport.jd.com') >= 0){
                                msg = click_count+':已停止领取，请登录后重试';
                                is_continue = false;
                            }else{
                                var result = response.responseText;
                                var doc = $(result);
                                var contents = doc.find('.content');
                                if(contents.length > 0){
                                    var get_coupon_result = contents[0].innerText;
                                    if(get_coupon_result.indexOf('恭喜') >= 0){
                                        is_continue = false;
                                    }
                                    msg = click_count+":"+contents[0].innerText;
                                }else{
                                    msg = click_count+':领取优惠券出错，请查看console日志';
                                    console.log(response);
                                }
                            }
                            $('#'+item_id).text(msg);
                            if(is_continue){
                                setTimeout(function(){
                                    get_coupon();
                                },0);
                            }else{
                                $('#'+item_btn).text('开始获取优惠券');
                            }
                        }
                    });
                }
                if(is_continue){
                    if(url.indexOf("//") === 0){
                        url = unsafeWindow.location.protocol + url;
                    }
                    console.log('开始获取优惠券:'+ url);
                    $('#'+item_btn).text('停止获取优惠券');
                    get_coupon();
                }else{
                    console.log('停止获取优惠券:'+ url);
                    $('#'+item_btn).text('开始获取优惠券');
                }
            }
        });
    }
    //setTimeout(init_page, 100);
    var old_head_insertBefore = document.head.insertBefore;
    document.head.insertBefore = function(e){
        console.log('insertBefore');
        console.log(e);
        var argu = [];
        for(var index = 0 ; index < arguments.length ; ++index){
            argu.push(arguments[index]);
        }
        if(e.src.indexOf('passport') >= 0){
            init_page();
        }
        old_head_insertBefore.apply(document.head, argu);};
})();