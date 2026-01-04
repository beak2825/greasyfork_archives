// ==UserScript==
// @name         csdn.net CSDN博客目录列表
// @namespace    https://www.jianshu.com/u/15893823363f
// @version      3.2
// @description  辅助CSDN跳转列表插件
//https://cdn.jsdelivr.net/npm/marked/marked.min.js
//https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
//https://code.createjs.com/1.0.0/tweenjs.min.js
// @author       Zszen John
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381410/csdnnet%20CSDN%E5%8D%9A%E5%AE%A2%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/381410/csdnnet%20CSDN%E5%8D%9A%E5%AE%A2%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("div#asideProfile").hide();
    $("aside").hide();
    $(".csdn-tracking-statistics").hide();
    $("a.article-footer-btn").click();
    $("div.recommend-box").hide();
    let isDebug = 1
    let poolLink = [];
    document.title = '';
    setTimeout(function () {
        let div = $('<div id="zszen_jianshu" class="CSDN列表" style="border-radius:5px;font-size:13;line-height:17px;overflow:hidden; position:fixed; left:10%; top:9%; z-index:9999;height: 25px; width: 53px;border:3px solid #00CBA0;background-color:#ffffff"></div>');
        $('body').append(div);
        let title = $('<h4 id="title_jianshu" style="text-align:left;width:500%;line-height:13px;margin-bottom:2px;margin-top:2pxpx;line-height:1;padding-left:2px;padding-top:0px;-webkit-margin-before:.3em;-webkit-margin-after:.3em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;font-weight: bold;"><font id="title" style="font-weight:800;color:#00CBA0;font-size:13px">目录</font></h4>');
        div.append(title);
        let items = $('<ol id="itemList_jianshu" style="width:300%;align:left;line-height:16px;text-align:left;padding-left:7px;padding-top:0px;color:#8B8E85"/>');//<font style="font-size:12px;color:#68ac10">{{item.title}}</font>
        div.append(items);
        document.title = $('h1.title-article').html();
        if(document.title.length>8){
            document.title = document.title.substr(0,10)+'..';
        }
        // for(let i=1;i<=7;i++){
        //     $('h'+i).not((idx,el)=>{return $(el).attr('class')!=undefined || $(el).attr('id')}).each(function(idx,el){
        //         $(el).attr('id','h'+i+'_'+idx)
        //     });
        //     //DLOG('id','h'+i+'_'+idx);
		// }
        //let oldIndent = 999;
        let oldItems = [items];
		//$('h1,h2,h3,h4,h5,h6,h7').not('.title').not('#title_jianshu').
        $('div.blog-content-box').find('h1,h2,h3,h4,h5,h6,h7,strong').not((idx,el)=>{return $(el).attr('class')!=undefined || $(el).attr('id')}).each(function(idx,el){
            let indent = getTagLevel(el);
			let idName = 'h'+indent+'_'+idx;
			$(el).attr('id',idName);
            DLOG(indent);
            let unit = $('<li indent="'+indent+'" style="line-height:18px;align:left"></li>');//;font-size:12px
            let link = $('<a focus="'+idName+'">'+$(el).text()+'</a>');
            unit.append(link);
            //DLOG('>>>',link);
            link.on('mouseover',(evt)=>{
                DLOG(evt.currentTarget);
                evt.currentTarget.style.color = '#00CBA0';
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
            DLOG(unit.attr('indent'))
            let lastEl = null;
            for(let i=oldItems.length-1;i>=0;i--){
                lastEl = oldItems[i];
                let distance = (oldItems.length-1)*6
                if(i>0){
                    let lastIndent = parseInt(lastEl.attr('indent'));
                    DLOG(i,indent,lastIndent);
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
                break;
            }
			//oldIndent = indent;
		});

        //$(window).resize(updateWin);
        updateWin();

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

    function getTagLevel(el){
        let indent = 0;
        if($(el)[0].tagName=='STRONG'){
            indent = 6;
        }else{
            indent = parseInt($(el)[0].tagName[1]);
        }
        return indent;
    }

    function updateWin(){
        let div = $('div#zszen_jianshu');
        if($(window).width()<0){
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
        let h = $('div#zszen_jianshu').find('ol#itemList_jianshu').height()+$('h4#title_jianshu').height()+30;
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
        args.unshift('[DEBUG]:')
        if(isDebug) console.log.apply(this,args);
    }

    // Your code here...
})();