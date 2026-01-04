// ==UserScript==
// @name         Jianshu.com 简书文章列表
// @namespace    https://www.jianshu.com/u/15893823363f
// @version      6.1
// @description  辅助简书跳转列表插件，简书的markdown过于简陋，没有目录结构，这里做了个插件辅助。 增加了缓动，修正了因为顶部遮挡导致标签遮挡的问题
//https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
//https://code.createjs.com/1.0.0/tweenjs.min.js
// @require https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @author       Zszen John
// @match        https://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381367/Jianshucom%20%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/381367/Jianshucom%20%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isDebug = 1
    let poolLink = [];
    let color_major = "#2B4D7C";
    document.title = '';
    document.oldFocus = null;
    resizeImg();
    copyCode();
    setTimeout(function () {
        //$('div.show-content-free').find('img').on('mouseover',()=>{
        //});
        //
        let div = $('<div id="zszen_jianshu" class="简书列表" style="border-radius:5px;font-size:13;line-height:17px;overflow:hidden; position:fixed; right:150px; top:9%; z-index:9999;height: 25px; width: 53px;border:3px solid '+color_major+';background-color:#ffffff"></div>');
        $('body').append(div);
        console.log(div);
        let title = $('<h4 id="title_jianshu" style="text-align:left;width:500%;line-height:13px;margin-bottom:2px;margin-top:2px;line-height:1;padding-left:2px;padding-top:0px;-webkit-margin-before:.3em;-webkit-margin-after:.3em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;font-weight: bold;"><font id="title" style="font-weight:800;color:#65E1FF;font-size:13px">目录</font></h4>');
        div.append(title);
        title.on('click',(evt)=>{
            let target = $('h1.title');
            $('body,html').animate({scrollTop: target.offset().top-60}, 'normal', 'swing');
        });
        let items = $('<ol id="itemList_jianshu" style="width:300%;align:left;line-height:16px;text-align:left;padding-left:7px;padding-top:0px;color:'+color_major+'"/>');//<font style="font-size:12px;color:#68ac10">{{item.title}}</font>
        div.append(items);
        document.title = beautySub($('h1.title').text(),6);
        //if(document.title.length>8){
        //    document.title = document.title.substr(0,8)+'..';
        //}
        // for(let i=1;i<=7;i++){
        //     $('h'+i).not('.title').not('#title_jianshu').each(function(idx,el){
        //         $(el).attr('id','h'+i+'_'+idx)
        //     });
        //     //DLOG('id','h'+i+'_'+idx);
		// }
        //let oldIndent = 999;
        let oldItems = [items];
        //DLOG($('h1').not((idx,el)=>{return false}));
        let maxLen = 25;
        let tags = ('h1,h2,h3,h4,h5,h6,h7,strong,b').split(',');
        let list = null;
        while(tags.length>0){
            let tagStr = tags.join(',');
            list = $(tagStr).not((idx,el)=>{return $(el).attr('class')!=undefined || $(el).attr('id')})
                //.not('.title').not('#title_jianshu').not('[align="center"]');
            if(list.length<=maxLen){
                break;
            }
            tags.pop();
        }
        if(list && list.length>0){
            list.each(function(idx,el){
                //poolLink.push($(el).html());
                let indent = getTagLevel(el);
                let idName = 'h'+indent+'_'+idx;
                // let indent = parseInt($(el)[0].tagName[1]);
                $(el).attr('id',idName)
                let unit = $('<li indent="'+indent+'" style="line-height:18px;align:left"></li>');//;font-size:12px
                //let link = $('<a href="#'+$(el).attr('id')+'">'+$(el).html()+'</a>');
                let lastEl = null;
                let indentReal = 0;
                for(let i=oldItems.length-1;i>=0;i--){
                    lastEl = oldItems[i];
                    let distance = (oldItems.length-1)*6
                    if(i>0){
                        let lastIndent = parseInt(lastEl.attr('indent'));
                        //DLOG(i,indent,lastIndent);
                        if(indent<=lastIndent){
                            oldItems.pop();
                            continue;
                        }else{
                            unit.css({'text-indent':distance+'px','font-size':Math.max(15-i*2,11)+'px','font-weight':'100'})
                            lastEl.append(unit);
                            oldItems.push(unit);
                        }
                    }else{
                        unit.css({'text-indent':distance+'px','font-size':Math.max(15-i*2,11)+'px','font-weight':'100'})
                        lastEl.append(unit);
                        oldItems.push(unit);
                    }
                    indentReal = i;
                    break;
                }
                //add link
                let link = $('<a focus="'+idName+'">'+beautySub($(el).text(),8+(indentReal-1))+'</a>');
                unit.append(link);
                link.on('mouseover',(evt)=>{
                    evt.currentTarget.style.color = '#0F839E';
                    evt.currentTarget.style.fontWeight = 600;
                });
                link.on('mouseout',(evt)=>{
                    evt.currentTarget.style.color = '#333333';
                    evt.currentTarget.style.fontWeight = 100;
                });
                link.on('click',(evt)=>{
                    let bt = $(evt.currentTarget);
                    let target = $('#'+bt.attr('focus'));
                    let motionTo = target.offset().top-60;
                    //createjs.Tween.get($(document)).to({alpha:1}, 1000);//.call(handleComplete);
                    $('body,html').animate({scrollTop: motionTo}, 'normal', 'swing');
                });
                //oldIndent = indent;
            });
        }

        //console.log([items]);
//        console.log([$('div.article').height()]);
  //      console.log([$('div.article').offset().top]);
        var el4Pot = $('div#note-page-comment');
        createUnit('评论 :p',items,el4Pot.offset().top+100);

        $(window).resize(updateWin);
        updateWin();
        //updateWin();
        //setTimeout(updateWin,500);

        //showList();
        //showList();
        // recursivelySelf(1);
        // DLOG(poolLink);
    },1000);

    // function recursivelySelf(level){
    //     if(level>6)return;
    //     $('h'+level).not('.title').each(function(idx,el){
    //         poolLink.push($(el).html());
    //         recursivelySelf(level+1);
    //     })
    // }
    function copyCode(){
        let div_copdsnip = $('<div id="codesnip" style="z-index:997;border-radius:5px;border:0px solid #65E1FF;background-color:#666666;position:absolute;left:50%; top:9%;padding-left:6px;padding-right:6px"><a id="codesnip" style="color:#ffffff;font-weight:800;" data-clipboard-target=".clipcoper">复制</a></div>');
        $('body').append(div_copdsnip);
        let clip = new ClipboardJS('a#codesnip');
        div_copdsnip.hide();
        //div_copdsnip.on('click',(evt)=>{
        //    div_copdsnip.hide(300);
        //});
        $('code,blockquote').on('mouseover',(evt)=>{
            if(document.oldFocus == evt.currentTarget){
                return;
            }
            document.oldFocus = evt.currentTarget;
            let target = $(evt.currentTarget);
            showCodesnip(target);
        });
        $('pre').on('mouseover',(evt)=>{
            let targetEl = $(evt.currentTarget).find('code')[0];
            if(document.oldFocus == targetEl){
                return;
            }
            document.oldFocus = targetEl;
            let target = $(targetEl);
            showCodesnip(target);
        });

        $(document).on('click',(evt)=>{
            let target = $(evt.target);
            //DLOG(target.attr('id')=='codesnip')
            if(target.attr('id')=='codesnip'){
                if(document.oldFocus){
                    //copy2Clipboard("123");
                    //target.attr('data-clipboard-target','.clipcoper');
                    target.text("已复制");
                }else{
                    target.text("未选择内容");
                }
                hideCodesnip(500);
            }else{
                document.oldFocus = null;
                hideCodesnip();
            }
        })
        //$('code').on('mouseout',(evt)=>{
        //    hideCodesnip();
        //});
        function showCodesnip(target){
            $(".clipcoper").removeClass('clipcoper');
            if(document.oldFocus){
                $(document.oldFocus).addClass('clipcoper');
            }
            div_copdsnip.hide();
            $('a#codesnip').text('复制')
            div_copdsnip.show(300);
            div_copdsnip.css({left:target.offset().left+target.width()+10,top:target.offset().top-5});
        }
        function hideCodesnip(delay){
            //document.oldFocus = null;
            $(".clipcoper").removeClass('clipcoper');
            div_copdsnip.delay(delay?delay:0).hide(300);
        }
    }



    function resizeImg(){
        //修正图片过大问题
        let maxImageSize = [550,320];
        $('div.show-content-free').find('img').css({'max-width':maxImageSize[0]+'px','max-height':maxImageSize[1]+'px','align':'center'});
        $('div.show-content-free').find('img').parent('div').prev('div').css('padding-bottom', maxImageSize[1]+'px');
        // $('div.show-content-free').find('img').parent('div').prev('div').each((idx,el)=>{
        //     $(el).css('padding-bottom',$(el).next('div').find('img').height()+'px');
        // })
        $('div.show-content-free').find('img').on('load',(evt)=>{
            // DLOG($(evt.currentTarget));
            let target = $(evt.currentTarget);
            target.parent('div').prev('div').css('padding-bottom', target.height()+'px');
        });
        $('div.show-content-free').find('img').css('display','inline')
    }
    function beautySub(str, len) {
        var reg = /[\u4e00-\u9fa5]/g,    //专业匹配中文
            slice = str.substring(0, len),
            chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
            realen = slice.length*2 - chineseCharNum;
        return str.substr(0, realen) + (realen < str.length ? "..." : "");
    }

    function createUnit(content,el, motionTo){
        let unit = $('<li style="line-height:18px;align:left;padding-top:4px;padding-bottom:4px;"></li>');
        let link = $('<a>'+content+'</a>');
        unit.append(link);
        link.on('mouseover',(evt)=>{
            evt.currentTarget.style.color = '#0F839E';
            evt.currentTarget.style.fontWeight = 600;
        });
        link.on('mouseout',(evt)=>{
            evt.currentTarget.style.color = '#333333';
            evt.currentTarget.style.fontWeight = 100;
        });
        link.on('click',(evt)=>{
            //let bt = $(evt.currentTarget);
            //let target = $('#'+bt.attr('focus'));
            // let motionTo = target.offset().top-60;
            $('body,html').animate({scrollTop: motionTo}, 'normal', 'swing');
        });
        unit.css({'text-indent':0+'px','font-size':Math.max(15-2*1,11)+'px','font-weight':'100'})
        el.append(unit);
    }

    function getTagLevel(el){
        let indent = 0;
        if($(el)[0].tagName=='STRONG'){
            indent = 6;
        }else if($(el)[0].tagName=='B'){
            indent = 7;
        }else if($(el)[0].tagName=='DIV'){
            indent = 1;
        }else{
            indent = parseInt($(el)[0].tagName[1]);
        }
        return indent;
    }

    function updateWin(){
        let div = $('div#zszen_jianshu');
        if($(window).width()<970){
            hideList();
            div.on('mouseover',showList)
            div.on('mouseout',hideList)
        }else{
            showList();
            div.off('mouseover',showList)
            div.off('mouseout',hideList)
        }
    }

    function showList(){
        //DLOG(document.title);
        let h = $('div#zszen_jianshu').find('ol#itemList_jianshu').height()+50;
        $('h4#title_jianshu').css({'text-align':'left',width:'500%'})
        $('h4#title_jianshu').children().html(document.title);
        $('div#zszen_jianshu').css({width:'155px',height:h+'px'})
        $('div#zszen_jianshu').find('font#title').css({'font-size':'16px'})
        $('div#zszen_jianshu').find('ol#itemList_jianshu').show();
    }

    function hideList(){
        $('h4#title_jianshu').children().html('目录');
        $('h4#title_jianshu').css({'text-align':'center',width:'100%'})
        $('div#zszen_jianshu').css({width:'53px',height:'30px'})
        $('div#zszen_jianshu').find('font#title').css({'font-size':'13px'})
        $('div#zszen_jianshu').find('ol#itemList_jianshu').hide();
	}

    function DLOG(...args){
        if(isDebug) console.log.apply(this,args);
    }

    // Your code here...
})();