// ==UserScript==
// @name         Baidu Jingyan 百度经验 目录列表
// @namespace    https://www.jianshu.com/u/15893823363f
// @version      1.0
// @description  百度经验 目录列表
// @author       Zszen John
// @match        https://jingyan.baidu.com/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381414/Baidu%20Jingyan%20%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%20%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/381414/Baidu%20Jingyan%20%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%20%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isDebug = 1
    let poolLink = [];
    document.title = '';
    setTimeout(function () {
        let div = $('<div id="zszen_jianshu" class="百度经验 列表" style="border-radius:5px;font-size:13;line-height:17px;overflow:hidden; position:fixed; right:2%; top:10%; z-index:9998;height: 25px; width: 53px;border:3px solid #C9C4CB;background-color:#ffffff"></div>');
        $('body').append(div);
        let title = $('<h4 id="title_jianshu" style="text-align:left;width:500%;line-height:13px;margin-bottom:2px;margin-top:2pxpx;line-height:1;padding-left:2px;padding-top:0px;-webkit-margin-before:.3em;-webkit-margin-after:.3em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;font-weight: bold;"><font id="title" style="font-weight:800;color:#8B8E85;font-size:13px">目录</font></h4>');
        div.append(title);
        let items = $('<ol id="itemList_jianshu" style="width:300%;align:left;line-height:16px;text-align:left;padding-left:7px;padding-top:0px;color:#8B8E85"/>');//<font style="font-size:12px;color:#68ac10">{{item.title}}</font>
        div.append(items);
        document.title = $('h1.exp-title-h1').text();
        if(document.title.length>8){
            document.title = document.title.substr(0,10)+'..';
        }
        let oldItems = [items];
        $('article#exp-article').find('h2,h3,h4,h5').attr('class','exp-content-head').each(function(idx,el){
			let indent = parseInt($(el)[0].tagName[1]);
			let idName = 'h'+indent+'_'+idx;
			$(el).attr('id',idName);
            //DLOG($(el),$(el).attr('id'));
            let unit = $('<li indent="'+indent+'" style="line-height:18px;align:left"></li>');//;font-size:12px
            let link = $('<a focus="'+idName+'" style="color:#333333">'+$(el).text()+'</a>');
            unit.append(link);
            //DLOG('>>>',link);
            link.on('mouseover',(evt)=>{
                DLOG(evt.currentTarget);
                evt.currentTarget.style.color = '#8B8E85';
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
            let lastEl = null;
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
                break;
            }
			//oldIndent = indent;
		});

        $(window).resize(updateWin);
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

    function updateWin(){
        let div = $('div#zszen_jianshu');
        if($(window).width()<900){
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
        let h = $('div#zszen_jianshu').find('ol#itemList_jianshu').height()+40;
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