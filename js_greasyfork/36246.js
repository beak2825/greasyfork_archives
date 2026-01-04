// ==UserScript==
// @name         NGA Pins
// @namespace    https://greasyfork.org/zh-CN/scripts/36246-nga-pins
// @version      0.1.4.20200528
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA Pins 可将顶部菜单、导航栏、页码栏固定在窗口顶部，亦可通过设置取消其中某项；主帖内容较长时将作者信息固定在主帖左侧（不包含回复）
// @author       AgLandy
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/36246/NGA%20Pins.user.js
// @updateURL https://update.greasyfork.org/scripts/36246/NGA%20Pins.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=13033636

(function(){

    function init(usl){

        let $ = usl.$,
            p = commonui.pins = {
                init: function(){
                    let args = {};
                    if(localStorage.pins)
                        args = JSON.parse(localStorage.pins);
                    else{
                        args = {a: 56, b: 42, c: 43};
                        localStorage.pins = JSON.stringify(args);
                    }
                    return args;
                },
                f: function(){

                    let args = p.args,
                        hA = args.a + 8,
                        hB = args.b && args.b + 8,
                        hC = args.c && args.c + 8,
                        a = $('#mainmenu'),
                        b = $('#m_nav'),
                        c = $('#m_pbtntop'),
                        t = $('#posterinfo0').closest('td'),
                        h = c[0] && c.offset().top - hA - hB || b.offset().top - hA,
                        o = $('body > #pinsPins')[0] ? $('body > #pinsPins') : $('<div id="pinsPins" style="margin:0px 10px" />').appendTo('body'),  //为导航栏和页码栏创建外部div
                        z = [[a, 'pinsTopBar'], [b, 'pinsNavBar'], [c, 'pinsPageBar'], [t, 'pinsAuthorInfo']],
                        newDiv = function(i){
                            return $('<div id="' + z[i][1] + '" />').append(z[i][0].children()).appendTo(z[i][0]);
                        };

                    //还原默认
                    for(let i = 0; i < z.length; i++){
                        if($('#' + z[i][1])[0])
                            if(i % 3 != 0 && o.find('#' + z[i][1])[0] && z[i][0].children()[0])
                                o.find('#' + z[i][1]).remove();
                            else
                                $('#' + z[i][1]).appendTo(z[i][0]).contents().unwrap();
                    }
                    $(window).unbind('.pins');

                    //顶部菜单
                    if(args.a){
                        let d = newDiv(0);
                        d.css({'height':a.css('height'), 'width':'100%', 'overflow':'hidden', 'position':'fixed', 'top':'0px', 'z-index':'3', 'opacity':'0.95'});
                        $(window).bind('scroll.pins', function(){
                            if($(window).scrollTop() > $('#custombg').height())
                                d.css({'border-bottom':'1px solid #' + __COLOR.shadow1.replace(/;.+;/,'').replace(/^.+#/,'')});
                            else
                                d.css({'border-bottom':''});
                        });
                    }

                    //导航栏
                    if(args.b){
                        let d = newDiv(1);
                        b.css({'height':b.css('height')});
                        b.find('.bbsinfo').prependTo(b);
                        $(window).bind('scroll.pins', function(){
                            if($(window).scrollTop() > h)
                                d.css({'position':'fixed', 'top':hA + 'px', 'z-index':'3', 'opacity':'0.95'}).appendTo(o);
                            else
                                d.css({'position':'', 'top':'', 'z-index':'', 'opacity':''}).appendTo(b);
                        });
                    }

                    //页码栏
                    if(args.c){
                        let d = newDiv(2);
                        c.css({'height':c.css('height')});
                        $(window).bind('scroll.pins', function(){
                            if($(window).scrollTop() > h)
                                d.css({'width':'calc(100% - 20px)', 'position':'fixed', 'top':(hA + hB) + 'px', 'z-index':'2', 'opacity':'0.95', 'pointer-events':'none'}).appendTo(o);
                            else
                                d.css({'width':'', 'position':'', 'top':'', 'z-index':'', 'opacity':'', 'pointer-events':''}).appendTo(c);
                        });
                    }

                    //作者信息
                    if($('#posterinfo0')[0] && $('#posterinfo0').closest('td').outerHeight() > 600){
                        t.css({'min-width':'197px'});
                        let d = newDiv(3),
                            h1 = hA + hB + hC + 6,
                            h2 = d.offset().top - h1,
                            w = function(){
                                d.css('width', t.css('width'));
                            };
                        if(/firefox/.test(navigator.userAgent.toLowerCase())){
                            $('.postcontent').bind('click.pins', function(){setTimeout(w,5);});
                            $(window).bind('transitionend.pins', function(){setTimeout(w,5);});
                        }
                        else{
                            let mo = new MutationObserver(w);
                            mo.observe($('#posterinfo0').closest('table')[0], {
                                childList: true,
                                subtree: true,
                                attributes: true
                            });
                        }
                        $(window).bind('resize.pins', w);
                        $(window).bind('scroll.pins', function(){
                            if($(window).scrollTop() > h2 && $(window).scrollTop() < t.height() - d.height() + h2)
                                d.css({'width':t.css('width'), 'position':'fixed', 'top':h1 + 'px'});
                            else if($(window).scrollTop() >= t.height() - d.height() + h2)
                                d.css({'width':t.css('width'), 'position':'fixed', 'top':(h1 - $(window).scrollTop() + t.height() - d.height() + h2) + 'px'});
                            else
                                d.css({'width':'', 'position':'', 'top':''});
                        });
                    }

                    $(window).triggerHandler('scroll.pins');

                }
            };

        commonui.mainMenu.data[401] = {innerHTML: 'Pins 设置', on: {event: 'click', func: function(e){
            let o = __SETTING.o = commonui.createadminwindow(),
                z = [['a', '56', '顶部菜单'], ['b','42', '导航栏'], ['c','43', '页码栏']];
            o._.addContent(null);
            o._.addTitle('Pins 设置');
            $.each(z, function(i, zi){
                let k = _$('/input').$0('type','checkbox','checked',0,'name',zi[0],'value',zi[1])._.on('click', function(){
                    p.args[this.name] = this.checked ? parseInt(this.value) : 0;
                    localStorage.pins = JSON.stringify(p.args);
                    p.f();
                });
                o._.addContent(
                    k,
                    zi[2],
                    _$('/br')
                );
                if(p.args[zi[0]])
                    k._.attr('checked', 1);
            });
            o._.show(e);
        }}, parent: 18};
        commonui.mainMenu.data[18].subKeys.push(401);

        $('div#mainmenu input[placeholder$="搜索"]')[0]._on = function(){
            var o = this.__w;
            if(!o){
                o = (this.__w = commonui.createCommmonWindow(2));
                o._.addContent(
                    _$('/span')._.add(
                        commonui.uniSearchInput(this)
                    )
                );
                o.firstChild.lastChild.style.backgroundColor = __COLOR.bg4;
                with(o.style){
                    left = top = '0';
                    visibility = 'hidden';
                    display = 'block';
                    boxShadow = 'none';
                    borderTop = 'none';
                    marginTop = '-1px';
                }
                document.body.appendChild(o);
                o._b = o.getBoundingClientRect();
                var se = this;
                commonui.aE(document.body, 'click', function(e){
                    var h = e.target || e.srcElement;
                    for(var i = 0; i < 7; i++){
                        if(h == o || h == se.parentNode.parentNode)
                            return;
                        h = h.parentNode;
                        if(!h)
                            break;
                    }
                    o._.hide();
                });
            }
            if(o.style.display == 'none' || o.style.visibility == 'hidden'){
                var p = this.parentNode.parentNode.getBoundingClientRect();
                if(commonui.pins.args.a != 0)
                    $(o).css({left: p.left + p.width - o._b.width + 'px', top: p.top + p.height + 'px', position: 'fixed', visibility: 'inherit'}).fadeIn('fast');
                else
                    o._.css('position','')._.show(p.left + p.width - o._b.width, p.top + p.height);
            }
        };  //default.js  commonui.mainMenuItems[162]

        $('<style type="text/css" />').html(' #pinsPins tbody {pointer-events:auto;} ').appendTo('head');

        p.args = usl.lS ? p.init() : {a: 56, b: 42, c: 43};

        p.f();

        if(!usl.userScriptData.pins)
            usl.userScriptData.pins = p.f;

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






