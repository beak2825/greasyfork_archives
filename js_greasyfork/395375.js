// ==UserScript==
// @name            Twitter PSPP
// @description     تجهيز صفحات تويتر للطباعة أو للحفظ كملف PDF
// @version         1.3
// @author          @RAKAN938
// @namespace       https://twitter.com/rakan938
// @match           https://twitter.com/*
// @match           https://mobile.twitter.com/*
// @require         https://code.jquery.com/jquery-latest.js
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/395375/Twitter%20PSPP.user.js
// @updateURL https://update.greasyfork.org/scripts/395375/Twitter%20PSPP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lng = checkLangAR();
    var bdy = "body",
        div = "div",
        sec = "section",
        svg = "svg",
        frs = "form[role='search']",
        hrb = "header[role='banner']",
        dds = "div[data-testid='sidebarColumn']",
        ddp = "div[data-testid='primaryColumn']",
        nrn = "nav[role='navigation']",
        dal = "div[aria-label='" + (lng ? 'رجوع' : 'Back') + "']",
        mor = "div[aria-label='" + (lng ? 'المزيد' : 'More') + "']",
        h2s = "h2 > span",
        pdd = "path[d^='M19.39 14.882c-1.58']",
        wwt = "a[href^='/compose/'][role='link']",
        thd = "span:contains('" + (lng ? 'سلسلة الموضوع' : 'Thread') + "')",
        twt = "span:contains('" + (lng ? 'تغريد' : 'Tweet') + "')",
        bkm = "span:contains('" + (lng ? 'العلامات المرجعية' : 'Bookmarks') + "')",
        bst = "a > div > span:contains('" + (lng ? 'الأفضل' : 'Top') + "')",
        msd = "div[id='layers']",
        mss = "span:contains('" + (lng ? 'الرسائل' : 'Messages') + "')",

        mxw = 200,
        mxr = 400,
        mir = 250,
        pdg = 15,
        rdu = 10,
        clr = "ivory",
        cdo = "darkorange",

        tim = 1000,
        ful = 100,
        dmw = 95,
        dmr = 17,
        fxd = "fixed",

        pos = "position",
        mwd = "maxWidth",
        mrg = (lng ? "margin-right" : "margin-left"),
        bbg = "background",
        lft = "left",
        top = "top",
        wdt = "width",
        hgt = "height",
        mlf = "margin-left",
        mtp = "margin-top",

        cph = "rakan938_pspp_posinh",
        sop = "rakan938_pspp_onclick",
        csh = "rakan938_pspp_show",
        ctp = "rakan938_pspp_tip",
        cto = "rakan938_pspp_tip_ok",
        ctz = "rakan938_pspp_tip_resize_ok",
        crs = "rakan938_pspp_resize",
        cbr = "rakan938_pspp_resize_b",
        cby = "rakan938_pspp_resize_b_size",
        cbm = "rakan938_pspp_resize_b_margin",
        cbo = "rakan938_pspp_resize_b_ok",
        cbc = "rakan938_pspp_resize_b_cancel",
        cmg = "rakan938_pspp_msg",

        sts = "/status/",
        ibk = "/i/bookmarks",
        evt = "/i/events/",

        ktt = "KeyTipTweet",
        kts = "KeyTipSearch",
        kth = "KeyTipThared",
        ktb = "KeyTipBookmarks",
        kte = "KeyTipEvents",
        ktr = "KeyTipReSize",
        kcs = "KeyContentSize",
        kcm = "KeyContentMargin",

        thr = "دائما أضغط هنا لتجهيز الصفحة قبل حفظها كملف PDF منسّـق، وأضغط مرة أخرى لاستعادة تصميم الصفحة الأصلي.",
        tok = "حسنا فهمت",
        thp = "لتعديل حجم العرض، أضغط دائما على هذه المساحة الفارغة التي تومض.",
        tsz = "⥃ الحجم",
        tmg = "⥆ الازاحة",
        tcl = "الغاء الأمر",
        tys = "موافق",

        cps = "<style>."+cph+"{position:inherit !important;}</style>",
        tip = '<div class="'+ctp+'" style="z-index:10000; position:absolute; opacity:1; background:'+cdo+'; max-width:'+mxw+'px; padding:'+pdg+'px; border-radius:'+rdu+'px; left:0; top:0;"><div style="position:absolute; border-width:6px; border-style:solid; border-color:transparent transparent '+cdo+'; border-image:initial; left:112px; top:-12px;"></div><div style="color:'+clr+'; font-size:large; text-align:justify; direction:rtl; font-weight:bold; line-height:150%;">'+thr+'<br><br><div style="text-align:left; font-weight:bold;"><span class="'+cto+'" style="cursor:pointer; border-style:solid; border-radius:'+rdu+'px; padding:4px;">'+tok+'</span></div></div></div>',
        rsz = '<div class= "'+crs+'" style="position:absolute; opacity:0; background:'+cdo+'; top:0; left:0;"></div>',
        rzz = '<div class="'+ctp+'" style="z-index:10000; position:absolute; opacity:1; background:'+cdo+'; max-width:'+mxw+'px; padding:'+pdg+'px; border-radius:'+rdu+'px; left:50%; top:50%;"><div style="color:'+clr+'; font-size:large; text-align:justify; direction:rtl; font-weight:bold; line-height:150%;">'+thp+'<br><br><div style="text-align:left; font-weight:bold;"><span class="'+ctz+'" style="cursor:pointer; border-style:solid; border-radius:'+rdu+'px; padding:4px;">'+tok+'</span></div></div></div>',
        bsz = '<div class="'+cbr+'" style="z-index:10000; position:fixed; background:'+cdo+'; max-width:'+mxr+'px; min-width:'+mir+'px; padding:'+pdg+'px; border-radius:'+rdu+'px; left:50%; top:50%; color:'+clr+'; font-size:large; text-align:right; font-weight:bold; direction:rtl;"><div>'+tsz+'</div><input type="range" class="vHorizon '+cby+'" min="30" max="100" step="1" style="width:100%;"><div style="margin-top:10px;">'+tmg+'</div><input type="range" class="vHorizon '+cbm+'" min="1" max="97" step="1" style="width:100%;"><div style="text-align:left; margin-top:20px;"><span class="'+cbc+'" style="cursor:pointer; border-style:solid; border-radius:'+rdu+'px; padding:4px; font-weight:normal;">'+tcl+'</span><span style="margin-left:5px; margin-right:5px;"></span><span class="'+cbo+'" style="cursor:pointer; border-style:solid; border-radius:'+rdu+'px; padding:4px;">'+tys+'</span><div></div>',

        copyCRS = null;

    /*(async () => {
        await GM.deleteValue(ktt);
        await GM.deleteValue(kts);
        await GM.deleteValue(kth);
        await GM.deleteValue(ktb);
        await GM.deleteValue(kte);
        await GM.deleteValue(ktr);
        await GM.deleteValue(kcs);
        await GM.deleteValue(kcm);
   })();*/

    function checkLangAR() {
        return document.documentElement.lang.toLowerCase() === "ar" ? true : false;
    }

    function applyStylePrint() {
        (async () => {
            dmw = await GM.getValue(kcs, 95);
            dmr = await GM.getValue(kcm, 17);
            $("."+ctp).hide();
            $(hrb).hide();
            $(dds).hide();
            $(ddp).css(mwd, dmw+"%").css(mrg, dmr+"%");
            $(nrn).hide();
            $(frs).parents().eq(10).addClass(cph);
            $(dal).parent().hide();
            $(pdd).parents().eq(4).hide();
            try{
                 $(ddp).children().children(2).css(mwd, ful+"%");
            }catch(_err) {}
            $("."+cmg).hide();
            applyResize();
        })();
    }

    function removeStylePrint() {
        $(hrb).show();
        $(dds).show();
        $(ddp).css(mwd, "").css(mrg, "");
        $(nrn).show();
        $(frs).parents().eq(10).removeClass(cph);
        $(dal).parent().show();
        $(pdd).parents().eq(4).show();
        $("."+crs).remove();
        $("."+cmg).show();
    }

    function setKeyContip(idx) {
        switch(idx) {
            case 0: GM.setValue(ktt, false); break;
            case 1: GM.setValue(kts, false); break;
            case 2: GM.setValue(kth, false); break;
            case 3: GM.setValue(ktb, false); break;
            case 4: GM.setValue(kte, false); break;
        }
    }

    function showContip(lf, idx, tpt) {
        $("."+ctp).remove();
        (async () => {
            var keyContip = false;
            switch(idx) {
                case 0: keyContip = await GM.getValue(ktt, true); break;
                case 1: keyContip = await GM.getValue(kts, true); break;
                case 2: keyContip = await GM.getValue(kth, true); break;
                case 3: keyContip = await GM.getValue(ktb, true); break;
                case 4: keyContip = await GM.getValue(kte, true); break;
            }
            if(keyContip){
                $(tpt).css(bbg, cdo);
                $(bdy).append(tip);
                var txp = (($(tpt).offset().top - $("."+ctp).offset().top) + $(tpt).height() + 6);
                $("."+ctp).css(lft, lf).css(top, txp).css(pos, fxd);
                (function anim (times){
                    $(tpt).animate({opacity:0},200).animate({opacity:1},200);
                    if(--times) return setTimeout(anim.bind(this, times), 400);
                }(5));
                $("."+cto).click(function() {
                    setKeyContip(idx);
                    $("."+ctp).remove();
                    $(tpt).css(bbg, "");
                });
            }
        })();
    }

    function resizeClickEmpty() {
        if(copyCRS == null) return;
        var hg = $(document).height(),
            rt = ($(window).width() - ($(ddp).offset().left + $(ddp).outerWidth()));
        $("."+crs).css(wdt, $(ddp).offset().left).css(hgt, hg);
        $(copyCRS).css(wdt, rt).css(hgt, hg).css(lft, ($(window).width() - rt));
    }

    function applyResize() {
        $("."+crs).remove();
        $(bdy).append(rsz);
        copyCRS = $("."+crs).clone();
        $(bdy).append(copyCRS);
        $("."+crs).click(function(){
            $("."+cbr).remove();
            $(bdy).append(bsz);
            $("."+cbr).css(mlf, -($("."+cbr).outerWidth() / 2) + 'px');
            $("."+cbr).css(mtp, -($("."+cbr).outerHeight() / 2) + 'px');
            $("."+cbr).css(pos,fxd);
            $("."+cby).val(dmw).on('change', function(){
                $(ddp).css(mwd, $(this).val()+"%");
                resizeClickEmpty();
            });
            $("."+cbm).val(dmr).on('change', function(){
                $(ddp).css(mrg, $(this).val()+"%");
                resizeClickEmpty();
            });
            $("."+cbc).click(function(){
                $("."+cbr).remove();
                $(ddp).css(mwd, dmw+"%").css(mrg, dmr+"%");
                var tm = setInterval(function(){resizeClickEmpty();clearInterval(tm);}, 400);
            });
            $("."+cbo).click(function(){
                GM.setValue(kcs, $("."+cby).val());
                GM.setValue(kcm, $("."+cbm).val());
                dmw = $("."+cby).val();
                dmr = $("."+cbm).val();
                $("."+cbr).remove();
            });
        });
        resizeClickEmpty();
        $("."+ctp).remove();
        (async () => {
            var keyContip = await GM.getValue(ktr, true);
            if(keyContip){
                (function anim (times){
                    $("."+crs).animate({opacity:1},200).animate({opacity:0},200);
                    if(--times) return setTimeout(anim.bind(this, times), 400);
                }(5));
                $(bdy).append(rzz);
                $("."+ctp).css(mlf, -($("."+ctp).outerWidth() / 2) + 'px');
                $("."+ctp).css(mtp, -($("."+ctp).outerHeight() / 2) + 'px');
                $("."+ctp).css(pos,fxd);
                $("."+ctz).click(function(){
                    GM.setValue(ktr, false);
                    $("."+ctp).remove();
                });
            }
        })();
    }

    function getEl(txt){
        var _el;
        $(mor).each(function(){
            var ths = $(this).parents().eq(1).find(txt);
            if(ths.size() > 0){
                _el = ths;
                return false;
            }
        });
        return _el;
    }

    function clickSearch(){
        showContip(
            ($(frs).find(svg).parent().offset().left - 105),
            1,
            $(frs).find(svg).parent()
        );
        $(frs).find(svg).parent().click(function() {
            if($(hrb).hasClass(csh)){
                $(hrb).removeClass(csh);
                removeStylePrint();
            }else{
                $(hrb).addClass(csh);
                applyStylePrint();
                $(this).css(bbg, "");
            }
        });
    }

    function clickTweets(txt, idx, typ){
        showContip(
            (($(txt).offset().left + ($(txt).width() / 2)) - 105),
            typ,
            $(txt)
        );
        $(txt).click(function() {
            if($(hrb).hasClass(csh)){
                $(hrb).removeClass(csh);
                removeStylePrint();
                $(this).parents().eq(8).removeClass(cph);
            }else{
                $(hrb).addClass(csh);
                applyStylePrint();
                $(this).parents().eq(8).addClass(cph);
                $(this).css(bbg, "");
            }
        });
    }

    function clickEvents(txt){
        showContip(txt.offset().left, 4, $(txt));
        $(txt).click(function() {
            if($(hrb).hasClass(csh)){
                $(hrb).removeClass(csh);
                removeStylePrint();
                $(this).parents().eq(8).removeClass(cph);
                $(sec).each(function(){$(this).parents().eq(1).css(mwd, "");});
                $(wwt).show().next(div).show();
            }else{
                $(hrb).addClass(csh);
                applyStylePrint();
                $(this).parents().eq(8).addClass(cph);
                $(sec).each(function(){$(this).parents().eq(1).css(mwd, ful+"%");});
                $(wwt).hide().next(div).hide();
                $(this).css(bbg, "");
            }
        });
    }

    $(bdy).append(cps);

    $(window).on('popstate', function() {
        removeStylePrint();
        $(sec).each(function(){$(this).parents().eq(1).css(mwd, "");});
        $(wwt).show().next(div).show();
        $("."+ctp).remove();
        $("."+cbr).remove();
    });

    $(document).mouseup(function(e){
        var cctp = $("."+ctp),
            ccbr = $("."+cbr);
        if(cctp.size() > 0) {
            if (!cctp.is(e.target) && cctp.has(e.target).length === 0){
                cctp.remove();
                $("."+sop).css(bbg, "");
            }
        }
        if(ccbr.size() > 0){
            if (!ccbr.is(e.target) && ccbr.has(e.target).length === 0){
                ccbr.remove();
                $(ddp).css(mwd, dmw+"%").css(mrg, dmr+"%");
                var tm = setInterval(function(){resizeClickEmpty();clearInterval(tm);}, 300);
            }
        }
    });

    setInterval(
        function(){
            if($(nrn).find(bst).size() > 0){
                if(! $(frs).find(svg).parent().hasClass(sop)){
                    $(frs).find(svg).parent().addClass(sop);
                    clickSearch();
                }
            }
            if(window.location.href.indexOf(sts) > -1 && $(dal).size() > 0){
                var vtwt = $(dal).parents().eq(2).find(twt);
                var vthd = $(dal).parents().eq(2).find(thd);
                if(vtwt.size() > 0){
                    if(! vtwt.hasClass(sop)){
                        vtwt.addClass(sop);
                        clickTweets(vtwt, 0, 0);
                    }
                }else if(vthd.size() > 0){
                    if(! vthd.hasClass(sop)){
                        vthd.addClass(sop);
                        clickTweets(vthd, 0, 2);
                    }
                }
            }
            if(window.location.href.indexOf(ibk) > -1 && $(mor).size() > 0){
                var vbkm = getEl(bkm);
                if(vbkm != undefined && vbkm != null && ! vbkm.hasClass(sop)){
                    vbkm.addClass(sop);
                    clickTweets(vbkm, 1, 3);
                }
            }
            if(window.location.href.indexOf(evt) > -1 && $(dal).size() > 0){
                var ths = $(dal).parents().eq(1).find(h2s);
                if(! ths.hasClass(sop)){
                    ths.addClass(sop);
                    clickEvents(ths);
                }
            }
            if($(msd).find(mss).size() > 0){
                 if(! $(msd).hasClass(cmg)){
                      console.log('msd = ' + $(msd).size());
                      $(msd).addClass(cmg);
                 }
            }
        }, tim
    );

})();
