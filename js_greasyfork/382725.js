// ==UserScript==
// @name            Seach All Free Image 【一键搜免费商用图JPG+PNG+ICO】
// @name:en         Seach All Free Image [JPG+PNG+ICO]
// @description     一键搜免费商用图片，JPG + PNG + ICO
// @description:en  One key search free commercial pictures, JPG + PNG + ICO
// @version         3.4
// @namespace       https://zhuanlan.zhihu.com/p/68705177
// @description     for Designer
// @author          pealpool
// @match           https://www.google.com/search?*
// @match           https://www.google.com.*/search?*
// @match           https://*.bing.com/images/search?*
// @require         https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382725/Seach%20All%20Free%20Image%20%E3%80%90%E4%B8%80%E9%94%AE%E6%90%9C%E5%85%8D%E8%B4%B9%E5%95%86%E7%94%A8%E5%9B%BEJPG%2BPNG%2BICO%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/382725/Seach%20All%20Free%20Image%20%E3%80%90%E4%B8%80%E9%94%AE%E6%90%9C%E5%85%8D%E8%B4%B9%E5%95%86%E7%94%A8%E5%9B%BEJPG%2BPNG%2BICO%E3%80%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var jh = false;//聚合标记
    var jhsum = 0;//聚合统计
    var eReg = /\s(\(site:).*/;
    var eReg_g = /https\:\/\/www\.google\.com.*(\/search?).*(tbm\=isch)/;
    var eReg_b = /https\:\/\/.*\.bing\.com\/images\/search\?/;
    var myConfig = {};
    var SearchEngine = '';
    var defConfig = {
        JhSelect:[
            "everypixel","freepik","pixabay",
        ],

        google:true,
        bing:true,
        chamber:true,
        colorhub:true,
        designerspics:true,
        everypixel:true,
        freeimages:true,
        freemagebank:true,
        freepik:true,
        foter:true,
        gratisography:true,
        hippopx:true,
        lifeofpix:true,
        pexels:true,
        picjumbo:true,
        pixabay:true,
        pxhere:true,
        shopify:true,
        stocksnap:true,
        unsplash:true,
        visualhunt:true,

        freepngimg:true,
        hiclipart:true,
        kisspng:true,
        pngmart:true,
        pixelsquid:true,
        pngall:true,
        pngimg:true,
        pngpix:true,
        snipstock:true,
        stickpng:true,

        easyicon:true,
        flaticon:true,
        icons8:true,
        iconfont:true,
        iconninja:true,
        iconshock:true,
    };

    var divStr_1 = "<div class='myK'><div class='mybtnWoW' id='myJPG'><span>M</span><span>o</span><span>r</span><span>e</span></div><label class='mybtnRight'><input name='onitpage' type='checkbox' value=''><span title='用本引擎搜索，最多选3个网站'>集合搜索</span></label><div class='lll'></div><div class='mybtnWoW' id='myPNG'>Png</div><div class='mybtnWoW' id='myICO'>Ico</div><a class='myhelp' target='_blank' href='https://zhuanlan.zhihu.com/p/68705177'><svg t='1561513273251' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='6576' width='28' height='28' xmlns:xlink='http://www.w3.org/1999/xlink'><defs><style type='text/css'></style></defs><path d='M512 96C282.4 96 96 282.4 96 512s186.4 416 416 416 416-186.4 416-416S741.6 96 512 96z m42 666h-84v-84h84v84z m-0.4-126h-83.2c0-134 124.8-124.4 124.8-207.6 0-45.8-37.4-83.4-83.2-83.4S428.8 384 428.8 428h-83.2c0-92 74.4-166 166.4-166s166.4 74.2 166.4 166.2c0 104-124.8 115.8-124.8 207.8z' p-id='6577' fill='#bfbfbf'></path></svg></a><div class='mylk myckJPG' style='display: none'><div class='myTopK'><div class='mylittleBm' id='mySelectAll_J'>全选</div><div class='mylittleBm' id='mySelectInv_J'>反选</div><div class='mylittleBm' id='mySave_J'>保存</div></div><form><label class='myinput'><input name='";
    var divStr_2 = "</label><label class='myinput'><input name='chamber' type='checkbox' value='' checked='checked'>chamber</label><label class='myinput myhot'><input name='colorhub' type='checkbox' value='' checked='checked'>colorhub</label><label class='myinput'><input name='designerspics' type='checkbox' value='' checked='checked'>designerspics</label><label class='myinput myhot'><input name='everypixel' type='checkbox' value='' checked='checked'>everypixel</label><label class='myinput myhot'><input name='freeimages' type='checkbox' value='' checked='checked'>freeimages</label><label class='myinput'><input name='freemagebank' type='checkbox' value='' checked='checked'>freemagebank</label><label class='myinput myhot'><input name='freepik' type='checkbox' value='' checked='checked'>freepik</label><label class='myinput'><input name='foter' type='checkbox' value='' checked='checked'>foter</label><label class='myinput'><input name='gratisography' type='checkbox' value='' checked='checked'>gratisography</label><label class='myinput'><input name='hippopx' type='checkbox' value='' checked='checked'>hippopx</label><label class='myinput'><input name='lifeofpix' type='checkbox' value='' checked='checked'>lifeofpix</label><label class='myinput' myhot><input name='pexels' type='checkbox' value='' checked='checked'>pexels</label><label class='myinput'><input name='picjumbo' type='checkbox' value='' checked='checked'>picjumbo</label><label class='myinput myhot'><input name='pixabay' type='checkbox' value='' checked='checked'>pixabay</label><label class='myinput'><input name='pxhere' type='checkbox' value='' checked='checked'>pxhere</label><label class='myinput'><input name='shopify' type='checkbox' value='' checked='checked'>shopify</label><label class='myinput'><input name='stocksnap' type='checkbox' value='' checked='checked'>stocksnap</label><label class='myinput myhot'><input name='unsplash' type='checkbox' value='' checked='checked'>unsplash</label><label class='myinput'><input name='visualhunt' type='checkbox' value='' checked='checked'>visualhunt</label></form></div><div class='mylk myckPNG' style='display: none'><div class='myTopK'><div class='mylittleBm' id='mySelectAll_P'>全选</div><div class='mylittleBm' id='mySelectInv_P'>反选</div><div class='mylittleBm' id='mySave_P'>保存</div></div><form><label class='myinput'><input name='freepngimg' type='checkbox' value='' checked='checked'>freepngimg</label><label class='myinput myhot'><input name='hiclipart' type='checkbox' value='' checked='checked'>hiclipart</label><label class='myinput myhot'><input name='kisspng' type='checkbox' value='' checked='checked'>kisspng</label><label class='myinput'><input name='pngmart' type='checkbox' value='' checked='checked'>pngmart</label><label class='myinput'><input name='pixelsquid' type='checkbox' value='' checked='checked'>pixelsquid</label><label class='myinput'><input name='pngall' type='checkbox' value='' checked='checked'>pngall</label><label class='myinput myhot'><input name='pngimg' type='checkbox' value='' checked='checked'>pngimg</label><label class='myinput'><input name='pngpix' type='checkbox' value='' checked='checked'>pngpix</label><label class='myinput'><input name='snipstock' type='checkbox' value='' checked='checked'>snipstock</label><label class='myinput'><input name='stickpng' type='checkbox' value='' checked='checked'>stickpng</label></form></div><div class='mylk myckICO' style='display: none'><div class='myTopK'><div class='mylittleBm' id='mySelectAll_I'>全选</div><div class='mylittleBm' id='mySelectInv_I'>反选</div><div class='mylittleBm' id='mySave_I'>保存</div></div><form><label class='myinput'><input name='easyicon' type='checkbox' value='' checked='checked'>easyicon</label><label class='myinput'><input name='flaticon' type='checkbox' value='' checked='checked'>flaticon</label><label class='myinput'><input name='icons8' type='checkbox' value='' checked='checked'>icons8</label><label class='myinput myhot'><input name='iconfont' type='checkbox' value='' checked='checked'>iconfont</label><label class='myinput'><input name='iconninja' type='checkbox' value='' checked='checked'>iconninja</label><label class='myinput'><input name='iconshock' type='checkbox' value='' checked='checked'>iconshock</label></form></div>";


    if (GM_getValue("Config") != null) {
        myConfig = GM_getValue("Config");
    } else {
        myConfig = defConfig;
    }
    for(var key in defConfig){
        if(typeof(myConfig[key]) == "undefined"){
            myConfig[key] = defConfig[key];
        }
    }
    GM_setValue("Config", myConfig);

    if(eReg_g.test(window.location.href)){
        SearchEngine = 'google';
        GMaddStyle(`
.myK{
    margin-left:860px;
	margin-top: -9px;
    position: absolute;
}
.mybtnWoW{
    height:44px;
    width:70px;
    border-radius: 24px;
    border: 1px solid #dfe1e5;
    text-align:center;
    line-height:45px;
    cursor:pointer;
    float:left;
    margin-top:-46px;
    background:#fff;
    font-size:16px;
    font-weight: bold;
    position: relative;
    z-index:500;
    color:#757575;
}
.mybtnWoW:hover{
    box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28);
    border-color: rgba(223,225,229,0);
}
#myPNG{
    margin-left:180px;
}
#myICO{
    margin-left:260px;
}
.mybtnRight{
    float:left;
    width:80px;
    height:20px;
    margin-left:76px;
    margin-top:-32px;
    position: relative;
    z-index: 500;
}
.myinput{
    float:left;
    width:125px;
    border-radius:6px;
    color: #3C4043;
}
.myinput:hover{
    background:#eee;
}
.mybtnWoW span:nth-child(1){
    color:#4285F4;
}
.mybtnWoW span:nth-child(2){
    color:#EA4335;
}
.mybtnWoW span:nth-child(3){
    color:#FBBD07;
}
.mybtnWoW span:nth-child(4){
    color:#34A853;
}
.myhot{
    color:#EA4335;
}
.lll{
    width:1px;
    height:35px;
    background-color:#dfe1e5;
    float:left;
    margin-top:-40px;
    margin-left:165px;
}
.myckPNG{
    margin-left:179px;
}
.myckICO{
    margin-left:259px;
}
.mylk{
    border-radius: 24px;
    border: 1px solid #dfe1e5;
    background: #fff;
    z-index: 70;
    box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28);
    position:absolute;
    padding:15px;
    width: 120px;
    margin-top:9px;
    font-size:12px;
}
.myhelp{
    float:left;
    margin-top:-34px;
    margin-left:340px;
}
.myhelp svg{
    width:22px;
    height:22px;
}
.myhelp svg:hover{
    width:24px;
    height:24px;
    margin-top:-1px;
    margin-left:-1px;
}
.myhelp svg:active{
    width:22px;
    height:22px;
    margin-top:0px;
    margin-left:0px;
}
.myTopK{
    height:25px;
}
.mylittleBm{
    cursor:pointer;
    margin-left:3px;
    width:35px;
    height:18px;
    line-height:20px;
    text-align:center;border-radius:7px;
    border: 1px solid #dfe1e5;
    float:left;
    color: #3C4043;
}
.mylittleBm:hover{
    color: #000;
    background:#eee;
}
.mylittleBm:active{
    color: #3C4043;
}
.mylittleBm.myBann{
    cursor:default;
    color:#bfbfbf;
}
.mylittleBm.myBann:hover{
    background:none;
}
        `);
        $("header").after(divStr_1 + "bing' type='checkbox' value='' checked='checked'/>bing" + divStr_2);
        var $baseAG = $('header input[title="Search"]');
        $baseAG.attr('value',$baseAG.val().replace(eReg,''));
    }else if(eReg_b.test(window.location.href)){
        SearchEngine = 'bing';
        GMaddStyle(`
.myK{
    margin-left:825px;
    margin-top:-45px;
    position: absolute;
}
.mybtnWoW{
    height:40px;
    width:70px;
    border-radius: 6px;
    border: 0px solid #eee;
    text-align:center;
    line-height:43px;
    cursor:pointer;
    float:left;
    margin-top:-46px;
    background:#fff;
    font-size:16px;
    font-weight: bold;
    position: relative;
    z-index:500;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1), 0 2px 4px 0 rgba(0,0,0,.16);
}
.mybtnWoW:hover{
    box-shadow: 0 0 0 1px rgba(0,0,0,.1), 0 2px 4px 1px rgba(0,0,0,.18);
}
#myPNG{
    margin-left:180px;
}
#myICO{
    margin-left:260px;
}
.myinput{
    float:left;
    border-radius:6px;
    color: #3C4043;
    width: 125px;
}
.myinput:hover{
    background:#f1f1f1;
}
.mybtnRight{
    float:left;
    width:80px;
    height:20px;
    margin-top:-33px;
    margin-left:75px;
}
.mybtnWoW span:nth-child(1){
    color:#00809d;
}
.mybtnWoW span:nth-child(2){
    color:#666666;
}
.mybtnWoW span:nth-child(3){
    color:#de3700;
}
.mybtnWoW span:nth-child(4){
    color:#666666;
}
.myhot{
    color:#de3700;
}
.lll{
    width:1px;
    height:35px;
    background-color:#d8d8d8;
    float:left;
    margin-top:-42px;
    margin-left:165px;
}
.myckPNG{
    margin-left:179px;
}
.myckICO{
    margin-left:259px;
}
.mylk{
    border-radius:6px;
    border: 1px solid #dfe1e5;
    background: #fff;
    z-index: 70;
    box-shadow: 2px 5px 6px rgba(32, 33, 36, 0.28);
    position:absolute;
    padding:10px;
    width: 125px;
    margin-top:5px;
    font-size:12px;
}
.myhelp{
    float:left;
    margin-top:-36px;
    margin-left:340px;
}
.myhelp svg{
    width:22px;
    height:22px;
}
.myhelp svg:hover{
    width:24px;
    height:24px;
    margin-top:-1px;
    margin-left:-1px;
}
.myhelp svg:active{
    width:22px;
    height:22px;
    margin-top:0px;
    margin-left:0px;
}
.myTopK{
    height:25px;
}
.mylittleBm{
    cursor:pointer;
    margin-left:4px;
    width:35px;
    height:18px;
    line-height:20px;
    text-align:center;border-radius:3px;
    border: 1px solid #dfe1e5;
    float:left;
    color: #3C4043;
}
.mylittleBm:hover{
    color: #000;
    background:#eee;
}
.mylittleBm:active{
    color: #3C4043;
}
.mylittleBm.myBann{
    cursor:default;
    color:#bfbfbf;
}
.mylittleBm.myBann:hover{
    background:none;
}
        `);
        $("#b_header").after(divStr_1 + "google' type='checkbox' value='' checked='checked'/>google" + divStr_2);
        $('#sb_form_q').attr('value',$('#sb_form_q').val().replace(eReg,''));
    }

    //console.log('print:' + GM_getValue('Config').google);
    //var abcdefghi = 'JhSelect';
    //console.log('print:' + myConfig[abcdefghi]);

    $('.myinput input').each(function(){
        if(myConfig[$(this).prop('name')] == false){
            $(this).prop('checked',false);
        }
    });


    function GMaddStyle(cssText){
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }
    function mySelectJPG(name,keyword){
        switch(name){
            case 'google':
                openNewWindow("https://www.google.com/search?q="+ keyword + "&tbm=isch");
                break;
            case 'bing':
                openNewWindow("https://cn.bing.com/images/search?q="+ keyword);
                break;
            case 'pixabay':
                openNewWindow("https://pixabay.com/images/search/"+ keyword);
                break;
            case 'pexels':
                openNewWindow("https://www.pexels.com/search/"+ keyword);
                break;
            case 'freeimages':
                openNewWindow("https://cn.freeimages.com/search/"+ keyword);
                break;
            case 'unsplash':
                openNewWindow("https://unsplash.com/search/photos/"+ keyword);
                break;
            case 'stocksnap':
                openNewWindow("https://stocksnap.io/search/"+ keyword);
                break;
            case 'picjumbo':
                openNewWindow("https://picjumbo.com/?s="+ keyword);
                break;
            case 'visualhunt':
                openNewWindow("https://visualhunt.com/search/instant/?q="+ keyword);
                break;
            case 'everypixel':
                openNewWindow("https://www.everypixel.com/search?q="+ keyword +"&stocks_type=free&meaning=&media_type=0&page=1");
                break;
            case 'gratisography':
                openNewWindow("https://gratisography.com/?s="+ keyword);
                break;
            case 'lifeofpix':
                openNewWindow("https://www.lifeofpix.com/search/"+ keyword + "?");
                break;
            case 'shopify':
                openNewWindow("https://burst.shopify.com/photos/search?&q="+ keyword);
                break;
            case 'chamber':
                openNewWindow("https://www.chamberofcommerce.org/findaphoto/search?q="+ keyword);
                break;
            case 'freemagebank':
                openNewWindow("http://www.freemagebank.com/?s="+ keyword);
                break;
            case 'designerspics':
                openNewWindow("http://www.designerspics.com/?s="+ keyword);
                break;
            case 'freepik':
                openNewWindow("https://www.freepik.com/search?query="+ keyword + '&selection=1&sort=popular');
                break;
            case 'foter':
                openNewWindow("https://foter.com/search/instant/?q="+ keyword);
                break;
            case 'hippopx':
                openNewWindow("https://www.hippopx.com/zh/search?q="+ keyword);
                break;
            case 'colorhub':
                openNewWindow("https://colorhub.me/search?tag="+ keyword);
                break;
            case 'pxhere':
                openNewWindow("https://pxhere.com/photos?q="+ keyword);
                break;
        }
    }
    function mySelectPNG(name,keyword){
        switch(name){
            case 'freepngimg':
                openNewWindow("https://freepngimg.com/search/?query="+ keyword);
                break;
            case 'pngmart':
                openNewWindow("http://www.pngmart.com/?s="+ keyword);
                break;
            case 'kisspng':
                openNewWindow("https://www.kisspng.com/free/"+ keyword + '.html');
                break;
            case 'pixelsquid':
                openNewWindow("https://www.pixelsquid.com/png/"+ keyword);
                break;
            case 'pngpix':
                openNewWindow("http://www.pngpix.com/?q="+ keyword);
                break;
            case 'snipstock':
                openNewWindow("https://www.snipstock.com/search?q="+ keyword);
                break;
            case 'hiclipart':
                openNewWindow("https://www.hiclipart.com/search?clipart="+ keyword);
                break;
            case 'pngall':
                openNewWindow("http://www.pngall.com/?s="+ keyword);
                break;
            case 'stickpng':
                openNewWindow("https://www.stickpng.com/search?q="+ keyword);
                break;
            case 'pngimg':
                openNewWindow("http://pngimg.com/search/?search="+ keyword);
                break;
        }
    }
    function mySelectICO(name,keyword){
        switch(name){
            case 'iconfont':
                openNewWindow("https://www.iconfont.cn/search/index?searchType=icon&q="+ keyword);
                break;
            case 'flaticon':
                openNewWindow("https://www.flaticon.com/search?word="+ keyword);
                break;
            case 'easyicon':
                openNewWindow("https://www.easyicon.net/iconsearch/"+ keyword);
                break;
            case 'iconshock':
                openNewWindow("https://www.iconshock.com/"+ keyword +"-icons");
                break;
            case 'icons8':
                openNewWindow("https://icons8.com/icons/set/"+ keyword);
                break;
            case 'iconninja':
                openNewWindow("http://www.iconninja.com/tag/"+ keyword +"-icon");
                break;
        }
    }
    function juhe(objkeyword,objbuttom){
        var w = new Array();
        var i = 0;
        $('.myckJPG .myinput input').each(function(){
            if($(this).prop('checked')==true){
                i++;
                switch($(this).prop('name')){
                    case 'pixabay':
                        var selectWord = "pixabay.com";
                        break;
                    case 'pexels':
                        selectWord = "www.pexels.com";
                        break;
                    case 'freeimages':
                        selectWord = "cn.freeimages.com";
                        break;
                    case 'unsplash':
                        selectWord = "unsplash.com";
                        break;
                    case 'stocksnap':
                        selectWord = "stocksnap.io";
                        break;
                    case 'picjumbo':
                        selectWord = "picjumbo.com";
                        break;
                    case 'visualhunt':
                        selectWord = "visualhunt.com";
                        break;
                    case 'everypixel':
                        selectWord = "www.everypixel.com";
                        break;
                    case 'gratisography':
                        selectWord = "gratisography.com";
                        break;
                    case 'lifeofpix':
                        selectWord = "www.lifeofpix.com";
                        break;
                    case 'shopify':
                        selectWord = "burst.shopify.com";
                        break;
                    case 'google':
                        selectWord = "www.google.com";
                        break;
                    case 'bing':
                        selectWord = "cn.bing.com";
                        break;
                    case 'chamber':
                        selectWord = "www.chamberofcommerce.org";
                        break;
                    case 'freemagebank':
                        selectWord = "www.freemagebank.com";
                        break;
                    case 'designerspics':
                        selectWord = "www.designerspics.com";
                        break;
                    case 'freepik':
                        selectWord = "www.freepik.com";
                        break;
                    case 'foter':
                        selectWord = "foter.com";
                        break;
                    case 'hippopx':
                        selectWord = "www.hippopx.com";
                        break;
                    case 'colorhub':
                        selectWord = "colorhub.me";
                        break;
                    case 'pxhere':
                        selectWord = "pxhere.com";
                        break;
                }
                w[i] = selectWord;
            }
        });

        //清除site
        w[0] = objkeyword.val().replace(eReg,'');
        switch(SearchEngine){
            case 'google':
                switch(i){
                    case 1:
                        objkeyword.attr('value',w[0] + ' site:'+ w[1] +')');
                        break;
                    case 2:
                        objkeyword.attr('value',w[0] + ' (site:'+ w[1] +' | site:'+ w[2] +')');
                        break;
                    case 3:
                        objkeyword.attr('value',w[0] + ' (site:'+ w[1] +' | site:'+ w[2] +' | site:'+ w[3] +')');
                        break;
                }
                break;
            case 'bing':
                switch(i){
                    case 1:
                        objkeyword.attr('value',w[0] + ' (site:'+ w[1] +')');
                        break;
                    case 2:
                        objkeyword.attr('value',w[0] + ' (site:'+ w[1] +' OR site:'+ w[2] +')');
                        break;
                    case 3:
                        objkeyword.attr('value',w[0] + ' (site:'+ w[1] +' OR site:'+ w[2] +' OR site:'+ w[3] +')');
                        break;
                }
                break;
        }
       objbuttom[0].click();
    }
    function openNewWindow(webstr) {
        let a = $("<a href='"+ webstr +"' target='_blank'></a>").get(0);
        let e = document.createEvent('MouseEvents');
        e.initEvent( 'click', true, true );
        a.dispatchEvent(e);
    }
    $.fn.hoverDelay = function(options){
        var defaults = {
            hoverDuring:200,
            outDuring:200,
            hoverEvent:function(){
                $.noop();
            },
            outEvent:function(){
                $.noop();
            }
        };
        var sets = $.extend(defaults,options || {});
        var hoverTimer,outTimer;
        return $(this).each(function(){
            $(this).hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(sets.hoverEvent,sets.hoverDuring);
            },function(){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(sets.outEvent,sets.outDuring);
            });
        });
    }
    $('body').on('click','#myJPG',function(){
        switch(SearchEngine){
            case 'google':
                var keyw = $baseAG;
                var objbuttom = $('header button[aria-label="Google Search"]');
                if(keyw != ''){
                    if(jh == true){
                        juhe(keyw,objbuttom);
                    }else{
                        $('.myckJPG .myinput input').each(function(){
                            if($(this).prop('checked')==true){
                                mySelectJPG($(this).prop('name'),keyw.val());
                            }
                        });
                    }
                }
                break;
            case 'bing':
                keyw = $('#sb_form_q');
                objbuttom = $('#sb_form_go');
                if(keyw != ''){
                    if(jh == true){
                        juhe(keyw,objbuttom);
                    }else{
                        $('.myckJPG .myinput input').each(function(){
                            if($(this).prop('checked')==true){
                                mySelectJPG($(this).prop('name'),keyw.val());
                            }
                        });
                    }
                }
                break;
        }
    });
    $('body').on('click','#myPNG',function(){
        switch(SearchEngine){
            case 'google':
                var keyw = $baseAG;
                var objbuttom = $('header button[aria-label="Google Search"]');
                if(keyw != ''){
                    $('.myckPNG .myinput input').each(function(){
                        if($(this).prop('checked')==true){
                            mySelectPNG($(this).prop('name'),keyw.val());
                        }
                    });
                }
                break;
            case 'bing':
                keyw = $('#sb_form_q');
                objbuttom = $('#sb_form_go');
                if(keyw != ''){
                    $('.myckPNG .myinput input').each(function(){
                        if($(this).prop('checked')==true){
                            mySelectPNG($(this).prop('name'),keyw.val());
                        }
                    });
                }
                break;
        }
    });
    $('body').on('click','#myICO',function(){
        switch(SearchEngine){
            case 'google':
                var keyw = $baseAG;
                var objbuttom = $('header button[aria-label="Google Search"]');
                if(keyw != ''){
                    $('.myckICO .myinput input').each(function(){
                        if($(this).prop('checked')==true){
                            mySelectICO($(this).prop('name'),keyw.val());
                        }
                    });
                }
                break;
            case 'bing':
                keyw = $('#sb_form_q');
                objbuttom = $('#sb_form_go');
                if(keyw != ''){
                    $('.myckICO .myinput input').each(function(){
                        if($(this).prop('checked')==true){
                            mySelectICO($(this).prop('name'),keyw.val());
                        }
                    });
                }
                break;
        }
    });
    $("#myJPG").hoverDelay({
        hoverDuring:500,
        outDuring:500,
        hoverEvent: function(){
            $('.myckJPG').css('display','inline');
            $('.myckPNG').css('display','none');
            $('.myckICO').css('display','none');
        },
        outEvent: function(){
        }
    });
    $("#myPNG").hoverDelay({
        hoverDuring:500,
        outDuring:500,
        hoverEvent: function(){
            $('.myckPNG').css('display','inline');
            $('.myckJPG').css('display','none');
            $('.myckICO').css('display','none');
        },
        outEvent: function(){
        }
    });
    $("#myICO").hoverDelay({
        hoverDuring:500,
        outDuring:500,
        hoverEvent: function(){
            $('.myckICO').css('display','inline');
            $('.myckPNG').css('display','none');
            $('.myckJPG').css('display','none');
        },
        outEvent: function(){
        }
    });
    $('body').click(function(){
        $('.myckJPG').css('display','none');
        $('.myckPNG').css('display','none');
        $('.myckICO').css('display','none');
    });
    $('body').on('click','.myckJPG',function(){
        return false;//JS阻止事件冒泡，及不触发外面click事件
    });
    $('body').on('click','.myckPNG',function(){
        return false;//JS阻止事件冒泡，及不触发外面click事件
    });
    $('body').on('click','.myckICO',function(){
        return false;//JS阻止事件冒泡，及不触发外面click事件
    });
    $('body').on('click','.myinput input',function(){
        return false;//JS阻止事件冒泡，及不触发外面click事件
    });
    $('body').on('click','.myckJPG .myinput',function(){
        if($(this).children('input').prop('checked')==true){
            $(this).children('input').prop('checked',false);
            jhsum--;
                if(jhsum<0){
                    jhsum = 0;
                }
        }else{
            if(jh == true){
                    if(jhsum<3){
                        $(this).children('input').prop('checked',true);
                        jhsum++;
                    }
                }else{
                    $(this).children('input').prop('checked',true);
                }
        }
    });
    $('body').on('click','.myckPNG .myinput',function(){
        if($(this).children('input').prop('checked')==true){
            $(this).children('input').prop('checked',false);
        }else{
            $(this).children('input').prop('checked',true);
        }
    });

    $('body').on('click','.myckICO .myinput',function(){
        if($(this).children('input').prop('checked')==true){
            $(this).children('input').prop('checked',false);
        }else{
            $(this).children('input').prop('checked',true);
        }
    });
    $('.myckJPG .myinput input').hover(function(){
        if($(this).prop('checked')==true){
            $(this).prop('checked',false);
            jhsum--;
            if(jhsum<0){
                jhsum = 0;
            }
        }else{
            if(jh == true){
                if(jhsum<3){
                    $(this).prop('checked',true);
                    jhsum++;
                }
            }else{
                $(this).prop('checked',true);
            }
        }
    },function(){
    });
    $('.myckPNG .myinput input').hover(function(){
        if($(this).prop('checked')==true){
            $(this).prop('checked',false);
        }else{
            $(this).prop('checked',true);
        }
    },function(){
    });
    $('.myckICO .myinput input').hover(function(){
        if($(this).prop('checked')==true){
            $(this).prop('checked',false);
        }else{
            $(this).prop('checked',true);
        }
    },function(){
    });
    $('body').on('click','.mybtnRight',function(){
        if($(this).find('input').prop('checked')==true){
            jh = true;
            jhsum = 3;
            $('.myckJPG .myinput input').prop('checked',false);
            $('#mySelectAll_J').addClass('myBann');
            $('#mySelectInv_J').addClass('myBann');
            $('input[name=' + myConfig.JhSelect[0] + ']').prop('checked',true);
            $('input[name=' + myConfig.JhSelect[1] + ']').prop('checked',true);
            $('input[name=' + myConfig.JhSelect[2] + ']').prop('checked',true);
            $('.myckJPG input[name="google"]').parent().css('display','none');
            $('.myckJPG input[name="bing"]').parent().css('display','none');
        }else{
            jh = false;
            $('#mySelectAll_J').removeClass('myBann');
            $('#mySelectInv_J').removeClass('myBann');
            $('.myckJPG input[name="google"]').parent().css('display','inline');
            $('.myckJPG input[name="bing"]').parent().css('display','inline');
            $('.myckJPG input').each(function(){
                $(this).prop('checked',myConfig[$(this).prop('name')]);
            });
        }
    });
    $('body').on('click','#mySelectAll_J',function(){
        if(jh == false){
            $('.myckJPG .myinput input').prop('checked',true);
        }
    });
    $('body').on('click','#mySelectAll_P',function(){
        $('.myckPNG .myinput input').prop('checked',true);
    });
    $('body').on('click','#mySelectAll_I',function(){
        $('.myckICO .myinput input').prop('checked',true);
    });
    $('body').on('click','#mySelectInv_J',function(){
        if(jh == false){
            $('.myckJPG .myinput input').each(function(){
                if($(this).prop('checked')==true){
                    $(this).prop('checked',false);
                }else{
                    $(this).prop('checked',true);
                }
            });
        }
    });
    $('body').on('click','#mySelectInv_P',function(){
        $('.myckPNG .myinput input').each(function(){
            if($(this).prop('checked')==true){
                $(this).prop('checked',false);
            }else{
                $(this).prop('checked',true);
            }
        });
    });
    $('body').on('click','#mySelectInv_I',function(){
        $('.myckICO .myinput input').each(function(){
            if($(this).prop('checked')==true){
                $(this).prop('checked',false);
            }else{
                $(this).prop('checked',true);
            }
        });
    });
    $('body').on('click','#mySave_J',function(){
        if(jh == false){
            $('.myckJPG .myinput input').each(function(){
                myConfig[$(this).prop('name')] = $(this).prop('checked');
            });
        }else{
            var jh_s = new Array();
            $('.myckJPG .myinput input').each(function(){
                if($(this).prop('checked') == true){
                    jh_s.push($(this).prop('name'));
                }
            });
            myConfig.JhSelect = jh_s;
        }
        GM_setValue("Config", myConfig);
    });
    $('body').on('click','#mySave_P',function(){
        $('.myckPNG .myinput input').each(function(){
            myConfig[$(this).prop('name')] = $(this).prop('checked');
        });
        GM_setValue("Config", myConfig);
    });
    $('body').on('click','#mySave_I',function(){
        $('.myckICO .myinput input').each(function(){
            myConfig[$(this).prop('name')] = $(this).prop('checked');
        });
        GM_setValue("Config", myConfig);
    });
})();