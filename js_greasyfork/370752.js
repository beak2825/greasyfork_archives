// ==UserScript==
// @name 			DMM Url Filter
// @description   DMM 辅助脚本
// @author        极品小猫
// @dete          2018.09.29
// @version       2.0.11
// @include			http://www.dmm.co.jp/mono/dvd/-/*
// @include			http://www.dmm.co.jp/mono/pcgame/-/detail/=/*
// @include			http://www.dmm.co.jp/digital/videoa/*
// @include			http://www.dmm.co.jp/ppm/video/*
// @include			http://www.dmm.co.jp/rental/ppr/*
// @include			http://www.dmm.co.jp/rental/-/*
// @include			http://www.dmm.co.jp/*/-/detail/=/cid=*
// @include			http://www.dmm.com/mono/dvd/-/detail/=/*
// @include			http://www.dmm.co.jp/search/*
// @include			http://www.dmm.co.jp/netgame/social/-/gadgets/=/app_id=*
// @include			http://osapi.dmm.com/gadgets/ifr?*&aid=*&*
// @include			http://sp.dmm.co.jp/*/detail/*
// @icon			http://p.dmm.co.jp/p/common/pinned/favicon.ico
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @run-at			document-idle
// @grant			unsafeWindow
// @grant			GM_registerMenuCommand
// @grant           GM_setClipboard
// @namespace https://greasyfork.org/users/3128
// @downloadURL https://update.greasyfork.org/scripts/370752/DMM%20Url%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/370752/DMM%20Url%20Filter.meta.js
// ==/UserScript==
//http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=2wdi051x/
//http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=2wdi051r/
var urls=location.href;
var host=location.hostname;
var page=location.pathname;
var path=location.pathname;
var webTitle, VendorID, VideoID;

var CoverNumber={//编号对照表
    "":{id:"",rule:/(\d+)/i},
    "APNS":{id:"APNS",rule:/APNS-?(\d+)/i},"AVOP":{id:"AVOP",rule:/AVOP-?(\d+)/i},
    "BF":{id:"BF",rule:/BF-?(\d+)/i},"BMW":{id:"BMW",rule:/BMW-?(\d+)/i},
    "CJOD":{id:"CJOD",rule:/CJOD-?(\d+)/i},
    "DASD":{id:"DASD",rule:/DASD-?(\d+)/i},"DVAJ":{id:"DVAJ",rule:/DVAJ-?(\d+)/i},
    "EBOD":{id:"EBOD",rule:/EBOD-?(\d+)/i},"EYAN":{id:"EYAN",rule:/EYAN-?(\d+)/i},
    "FINH":{id:"FINH",rule:/FINH-?(\d+)/i},
    "HND":{id:"HND",rule:/HND-?(\d+)/i},"HUNTA":{id:"HUNTA",rule:/HUNTA-?(\d+)/i},
    "IPX":{id:"IPX",rule:/IPX-?(\d+)/i},"IPZ":{id:"IPZ",rule:/IPZ-?(\d+)/i},
    "JUFD":{id:"JUFD",rule:/JUFD-?(\d+)/i},"JUY":{id:"JUY",rule:/JUY-?(\d+)/i},
    "KAWD":{id:"KAWD",rule:/KAWD-?(\d+)/i},
    "SSNI":{id:"SSNI",rule:/SSNI-?(\d+)/i},
    "SNIS":{id:"SNIS",rule:/SNIS-?(\d+)/i},
"TOMN":{id:"TOMN",rule:/TOMN-?(\d+)/i},
    "MEYD":{id:"MEYD",rule:/MEYD-?(\d+)/i},
    "MIDE":{id:"MIDE",rule:/MIDE-?(\d+)/i},"MIFD":{id:"MIFD",rule:/MIFD-?(\d+)/i},"MIZD":{id:"MIZD",rule:/MIZD-?(\d+)/i},"MIMK":{id:"MIMK",rule:/MIMK-?(\d+)/i},"MVSD":{id:"MVSD",rule:/MVSD-?(\d+)/i},

    "OFJE":{id:"OFJE",rule:/OFJE-?(\d+)/i},"ONSD":{id:"ONSD",rule:/ONSD-?(\d+)/i},
    "PPPD":{id:"PPPD",rule:/PPPD-?(\d+)/i},"PRED":{id:"PRED",rule:/PRED-?(\d+)/i},
    "RBB":{id:"RBB",rule:/RBB-?(\d+)/i},
    "TEK":{id:"TEK",rule:/TEK-?(\d+)/i},"TYOD":{id:"TYOD",rule:/TYOD-?(\d+)/i},
    "URE":{id:"URE",rule:/URE-?(\d+)/i},
    "VICD":{id:"VICD",rule:/VICD-?(\d+)/i},
    "1HAWA":{id:"HAWA",rule:/1HAWA-?(\d+)/i},
    "WANZ":{id:"WANZ",rule:/WANZ-?(\d+)/i},
    "1OKM":{id:"OKM",rule:/1okm-?00(\d+)/i},
    "1NHDTB":{id:"NHDTB",rule:/1NHDTB-?(\d+)/i},
    "1SDSI":{id:"SDSI",rule:/1sdsi-?(\d+)re/i},"1STAR":{id:"STAR",rule:/1STAR-?(\d+)/i},"1SDMU":{id:"SDMU",rule:/1SDMU-?(\d+)/i},"1SDNM":{id:"SDNM",rule:/1SDNM-?(\d+)/i},
    "41HODV":{id:"HODV",rule:/41HODV-?(\d+)/i},
    "49EKDV":{id:"EKDV",rule:/49EKDV-?(\d+)/i},
    "55T":{id:"T28",rule:/55T28-?(\d+)/i},//55T28
    "57MCSR":{id:"MCSR",rule:/57MCSR-?(\d+)/i},
    "59SHE":{id:"SHE",rule:/59SHE-?(\d+)/i},
    "118ABP":{id:"ABP",rule:/118ABP-?(\d+)/i},"118CHN":{id:"CHN",rule:/118CHN-?(\d+)/i},"118MVT":{id:"MVT",rule:/118MVT-?(\d+)/i},"118PPT":{id:"PPT",rule:/118PPT-?(\d+)/i},
    
    "433NEO":{id:"NEO",rule:/433NEO-?(\d+)/i},
    "H_068MXGS":{id:"MXGS",rule:/H_068MXGS-?(\d+)/i},
    "H_455AVOP":{id:"AVOP",rule:/H_455AVOP-?(\d+)/i},
    "H_467ICD":{id:"ICD",rule:/H_467ICD-?(\d+)/i},
    "N_1428AP":{id:"AP",rule:/N_1428AP-?(\d+)/i},
    /*VR*/
    "AJVR":{id:"AJVR",rule:/ajvr-?00(\d+)/i},
    "EBVR":{id:"EBVR",rule:/EBVR-?00(\d+)/i},
    "MAXVR":{id:"MAXVR",rule:/MAXVR00-?(\d+)/i},"MDVR":{id:"MDVR",rule:/MDVR-?00(\d+)/i},"MIAE":{id:"MIAE",rule:/MIAE-?(\d+)/i},
    "NNPJ":{id:"NNPJ",rule:/NNPJ-?(\d+)/i},
    "SIVR":{id:"SIVR",rule:/SIVR-?00(\d+)/i},
    "HUNVR":{id:"HUNVR",rule:/hunvr00-?(\d+)/i},"HUNVRC":{id:"HUNVRC",rule:/HUNVRC00-?(\d+)/i},
    "OYCVR":{id:"OYCVR",rule:/oycvr00(\d+)/i},
    "1NHVR":{id:"NHVR",rule:/1NHVR00-?(\d+)/i},
    "2WPVR":{id:"WPVR",rule:/2wpvr00(\d+)/i},
    "11VARM":{id:"VARM",rule:/11VARM00(\d+)/i},
    "13DSVR":{id:"DSVR",rule:/13DSVR00(\d+)/i},
    "55TMAVR":{id:"TMAVR",rule:/55TMAVR-?00(\d+)/i},
    "118DOCVR":{id:"DOCVR",rule:/118DOCVR00-?(\d+)/i},"118PRDVR":{id:"PRDVR",rule:/118PRDVR00-?(\d+)/i},"118SGA":{id:"SGA",rule:/118SGA-?(\d+)/i},
    "H_093R18":{id:"R18",rule:/h_093r18(\d+)/i},
    "H_491FSTA":{id:"FSTA",rule:/H_491FSTA-?(\d+)/},
    "H_1127VOVS":{id:"VOVS",rule:/h_1127vovs-?00(\d+)/i},
    "H_1155CRVR":{id:"CRVR",rule:/h_1155crvr-?00(\d+)/i},
    "H_1186ETVCO":{id:"ETVCO",rule:/h_1186etvco-?00(\d+)/i},
    "H_1241KBVR":{id:"KBVR",rule:/H_1241KBVR00-?(\d+)/i},
    "H_1248KOLVR":{id:"KOLVR",rule:/H_1248KOLVR-?00(\d+)/i}
};

var TagCN={}, TagTran=[
  /*==== DMM ====*/
    {ja:'中出し',en:'Internal Cumshot',zh:'中出'},{ja:'パイズリ',en:'Breast Sex',zh:'乳交'},
    {ja:'パイパン',en:'',zh:'剃毛'},


  {ja:'不倫',en:'',zh:'不论'},{ja:'逆レイプ',en:'',zh:'反强奸'},
  {ja:'淫乱・ハード系',en:'',zh:'淫乱'},{ja:'ミニ系',en:'',zh:'萝莉',txt:'迷你'},{ja:'羞恥',en:'',zh:'羞耻'},
  {ja:'ドラッグ',en:'',zh:'药品'},
  {ja:'3P・4P',en:'',zh:'多P'},
  {ja:'ボディコン',en:'',zh:'紧身衣'},
  {ja:'尻フェチ',en:'',zh:'恋臀癖'},
  {ja:'4時間以上作品',en:'',zh:'4小时以上作品'},

  {ja:'ショタ',en:'',zh:'正太'},{ja:'ドラマ',en:'',zh:'戏剧性事件'},
{ja:'アイドル・芸能人',en:'',zh:'偶像艺人'},
  //角色
  {ja:'コスプレ',en:'',zh:'角色扮演'},{ja:'職業色々',en:'',zh:'各色职业'},{ja:'看護婦・ナース',en:'',zh:'护士'},{ja:'くノ一',en:'',zh:'女忍者'},{ja:'痴漢',en:'',zh:'痴汉'},
    //形容人
    {ja:'スレンダー',en:'',zh:'苗条'},
    //事情
    {ja:'マッサージ',en:'',zh:'按摩'},

  {ja:'白人女優',en:'',zh:'白人女优'},
  {ja:'イメージビデオ',en:'',zh:'影像视频'},
  {ja:'エステ',en:'',zh:'美容院'},
  {ja:'単体作品',en:'',zh:'单体作品'},{ja:'独占配信',en:'',zh:'',txt:'独家'},{ja:'ブラウザ視聴',en:'',zh:'浏览器中查看'},{ja:'Android対応',en:'',zh:'',txt:'安卓对应'},{ja:'iPhone・iPad対応',en:'',zh:'',txt:'IOS对应'},
  {ja:'サンプル動画',en:'',zh:'',txt:'短片试看'},{ja:'DVDトースター',en:'',zh:'',txt:'DVD烧录'},{ja:'DVD',en:'',zh:'',txt:'DVD'},{ja:'デジモ',en:'',zh:'',txt:'数码'},{ja:'ハイビジョン',en:'',zh:'',txt:'高清电视'},
    {ja:'Blu-ray（ブルーレイ）',en:'',zh:'蓝光'},

  {ja:'盗撮・のぞき',en:'',zh:'偷窥'}
];

function BTLinks(){
    if(/anime/.test(page)) $('<a href="http://www.dlsite.com/maniax/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/'+VideoID+'/per_page/30/from/fs.header">DLSite</a>').appendTo($('#BTLinks'));

    var TorrentSite=[
        {
            'name':'JavLib',
            'urls':'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword='+VideoID
        },
        {
            'name':'AVDB',
            'urls':'https://www.avmoo.com/cn/search/'+VideoID
        },
        {
            'name':'GavBus',
            'urls':'https://www.gavbus5.com/video/'+VideoID+'.html'
        },
        {
            'name':'BT樱桃',
            'urls':'http://www.btcherry.info/search?keyword='+VideoID
        },
        {
            'name':'TorrentKitty',
            'urls':'http://www.torrentkitty.tv/search/'+VideoID
        },
        {
            'name':'BTSpread',
            'urls':'http://btso.pw/search/'+VideoID
        }
    ];


    // <!----------------- 浮动工具模块 Begin
    $('<div id="BTLinks" style="position:fixed;right:10px;bottom:10px;background:#e3e3e3;font-size:14px;padding:5px;">\
<input id="titleMod" type="checkbox" title="使用标题作为搜索关键字">\
<label for="titleMod">使用标题作为搜索关键字</label> | <a id="eside" style="cursor:pointer;">显示/隐藏侧边栏</a>\
<br>\
</div>').appendTo(document.body);

    for(var i in TorrentSite){
        $('<A>').attr({'href':TorrentSite[i].urls,'target':'blank'}).css({'padding-left':'5px'}).text(TorrentSite[i].name).appendTo($('#BTLinks'));
    }

    $('#titleMod').change(function(){
        var tagA=$('#BTLinks A');
        if(this.checked){
            for(i=0;i<tagA.length;i++){
                tagA[i].href=tagA[i].href.replace(VideoID,webTitle);
            }
        } else if(!this.checked) {
            for(i=0;i<tagA.length;i++){
                tagA[i].href=tagA[i].href.replace(encodeURIComponent(webTitle),product_id);
            }
        }
    });
    //if(!VideoID) $('#titleMod').click();

    //显示隐藏变量函数
    $('#eside').click(function(){
        if($(".vline").css('display')!=='none') {
            $(".vline").css('display','none');
            $(".vline").next().css('display','none');
        } else {
            $(".vline").css('display','');
            $(".vline").next().css('display','');
        }
    });
    // 浮动工具模块 End ----------------->

    /*侧边栏隐藏*/
    $(".vline").css('display','none');
    $(".vline").next().css('display','none');

    //链接移除
    $('.pd-3>A[href*="package_info_html"]').remove();			//删除封面图片下的捆绑打包链接
    $('.ttl_bskt_mp').next().remove();$('.ttl_bskt_mp').remove();	//DMMマーケットプレイス
}



console.log(getQueryString('checked'));
if(/cid=/i.test(location.href) && getQueryString('checked')!=true) window.history.pushState('state','', urls.replace(location.search,''));

var DMM={
    TagTranFn : function(){
        console.log('日文标签');
        //转换日文 Key 的标签
        for(var i in TagTran){
            TagCN[TagTran[i].ja]=TagTran[i].zh;
        }
        console.log(TagCN);
        $('a[href*="article=keyword"]').each(function(){
            var txt=$(this).text();
            console.log(txt);
            $(this).text(TagCN[txt]);
        });
    },
    VideoIDFn : function(number){
        number=number.toUpperCase().replace('\\U005F','_');				//Videoa番号
        VendorID=number.replace(/\d+(?:re)?$/i,'');
        VideoID=VideoID=CoverNumber[VendorID] ? CoverNumber[VendorID]['id']+"-"+number.replace(CoverNumber[VendorID]['rule'],'$1') : '';
        if(!VideoID) {
            //取得番号长度
            var VideoID_NumberLength=number.replace(/(?:(?:[nh]_)?\d+)?[A-Z]+(\d+)/i,'$1');
            //如果番号长度大于3，则使用00111规则，否则取得全部番号
            VideoID=VideoID_NumberLength.length>3?number.replace(/(?:(?:[nh]_)?\d+)?([A-Z]+)(?:00)?(\d{1,3})(?:[A-Z]+)?/i, '$1-$2'):number.replace(/(?:(?:[nh]_)?\d+)?([A-Z]+)(\d+)(?:[A-Z]+)?/i,'$1-$2');//处理后的标题
            var VideoJSON=number.replace(/((?:(?:[nh]_)?\d+)?([A-Z]+))((00)?)\d{3}(?:[A-Z]+)?$/i, '"$1":{id:"$2",rule:/$1$3-?(\\d+)/i},');
            console.log(number, VideoID, VideoJSON);
            $('<input>').css({"float":"left","width":"300px"}).click(function(){$(this).select();GM_setClipboard(this.value.trim());}).val(VideoJSON).insertBefore('.hreview');
        }
        console.log(number, VideoID);
        document.title='【'+VideoID+'】'+webTitle;
        return VideoID;
    },
    ChangeTitle : function(){
        /*网页标题显示番号*/
        webTitle=document.title=document.title.replace(/- (?:アダルトDVD通販|アダルトVR動画|エロアニメ動画|アダルト美少女ゲーム(?:通販)?|アダルトビデオ動画|アダルトDVD・ブルーレイ通販) - (FANZA通販（旧DMM.R18）|DMM.R18|^DMM\.com | DVD通販)$/ig,'').replace(/【(?:(?:DMM|数量)限定|アダルト|アウトレット)】/,'');

        this.VideoIDFn(unsafeWindow.gaContentId||$('[name="package-image"]').attr('id')||getQueryString('cid'));

        console.log('更改标题为：', webTitle);

        window.addEventListener('load',function(){$('[name="package-image"').off("click").attr({'download':VideoID});});


        /*影片信息插入片名*/
        var table=$(".mg-b20")[1];
        var x=table.insertRow(0);		//插入新行在表头
        var y=x.insertCell(0)					//设置第一个单元格的内容
        var z=x.insertCell(1)					//设置第二个单元格的内容
        y.innerHTML="片名："						//第一个单元格的内容
        y.align="right";
        z.innerHTML=webTitle;				//第二个单元格的内容
        table.deleteRow(table.rows.length-1)	//删除最后一行

        var table=$(".mg-b20")[1];
        var A=table.rows[10].innerHTML;			//记录品番数据
        var newA=table.insertRow(1)				//插入第二行
        newA.innerHTML=A;					//第二行中添加品番数据
        table.deleteRow(10+1);					//删除频繁数据

        //内容标题处理
        $('h1#title').remove();
        $('<input style="width: 900px; font-size: 16px; font-weight: bold; border: none;">').attr({'id':'title'}).val(document.title).focus(function(){
            this.select();
            GM_setClipboard(this.value);
        }).appendTo('.hreview');

        if(/[A-Z]/.test(urls)){//地址栏大写字母转小写
            window.history.pushState('','', urls.toLowerCase());
        }
    },
    CheckMonoJump : function(){
        console.log('检查是否可以跳转');
        /*$('#ajax_contents').load('http://www.dmm.co.jp/misc/-/mutual-link/ajax-index/=/cid=snis00918/service=digital/shop=videoa/',function(e){
console.log(e);
    });*/
        addMutationObserver('#ajax_contents',function(){
            if($('.others a:contains(DVDを通販で購入する)').length>0) location.href=$('.others a:contains(DVDを通販で購入する)').attr('href');
            /*
            $('.others a').each(function(){
                if($(this).text()=='DVDを通販で購入する') {
                    console.log($(this).attr('href'));
                    location.href=$(this).attr('href');
                    return;
                }
            });*/
        });
        addMutationObserver('#mutual-link',function(){
            if($('.others a:contains(DVDを通販で購入する)').length>0) location.href=$('.others a:contains(DVDを通販で購入する)').attr('href');
            else location.href=$('.others a:contains(動画で購入する)').attr('href');
            /*
            if(/DVDを通販で購入する/.test($('.others a').text())) {

            }
            $('.others a').each(function(){
                if($(this).text()=='DVDを通販で購入する') {
                    console.log($(this).attr('href'));
                    location.href=$(this).attr('href');
                    return;
                }
            });*/
        });
        //http://www.dmm.co.jp/ppm/video/-/detail/=/cid=snis00936/
        addMutationObserver('.page-detail',function(){
            $('table div.lh4.pd-6.bx-gra a').each(function(){
                if($(this).text()=='DVDを通販で購入する') {
                    console.log($(this).attr('href'));
                    location.href=$(this).attr('href');
                    return;
                }
            });
        });
    },
    init : function(){
        switch(host){
            case "www.dmm.co.jp":
                if(/\/product_id=/i.test(page)) {
                    location.href=location.href.replace(/product_id=.+/i,'');
                } else if(!/mono/i.test(page)&&!/dc/i.test(page)){
                    this.CheckMonoJump();
                    if(/videoa/i.test(page)) this.ChangeTitle();
                } else if(/monthly\/vr/i.test(page)){

                } else if(/cid=/i.test(urls)){
                    //检查是否有特典组合
                    if($('#rltditem').length>0&&getQueryString('checked')!==true) {
                        var This_CID=getQueryString('cid', path);
                        //如果当前网址是特典链接
                        if(This_CID.search('tk')>-1) {
                            $('#rltditem a').each(function(){//遍历该片的其它信息
                                var rltd_itemID=getQueryString('cid', this.href.replace(/^https?:\/\/[^/]+/i,''));
                                if(rltd_itemID.search('tk')==-1 && This_CID.search(rltd_itemID)>-1) location.href=this.href;
                            });
                        } else {
                            $('#rltditem a').each(function(){//遍历该片的其它信息
                                this.href+="?check=true";
                            });
                        }
                    }
                    addMutationObserver('#recommend',function(){
                        //特典链接转换为通贩链接
                        $('#recommend a[href*="/mono/dvd/-/detail/"]').each(function(){
                            var url=this.href.replace(/\?.+$/,'');
                            var Cid=getQueryString('cid', url);
                            console.log(url, Cid);
                            var rCid=Cid.replace(/(^tk|tk$)/i, '');
                            this.href=url.replace(Cid, rCid);
                        });
                    });
                    urls=location.href.replace(location.hash,'');	//重新保存一次URL
                    this.ChangeTitle();
                    this.TagTranFn();
                }

                    BTLinks();
                break;
        }
    }
};
DMM.init();

function QQ(obj) {//ID, Class选择器
    var objF=obj.replace(/^[#\.]/,'');
    return (/^#/.test(obj)) ? document.getElementById(objF):(/^\./.test(obj)) ? document.getElementsByClassName(objF) : document.querySelectorAll(obj);
}

function getQueryString(name, url) {//筛选参数
    url=url||location.search||location.pathname;	//网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
	var reg = new RegExp("(?:^|[&/])(" + name + ")=([^&/]*)(?:[&/]|$)", "i");		//正则筛选参数
	var str = url.substr(1).match(reg);
	//console.log(str[0]);		//所筛选的完整参数串
	//console.log(str[1]);		//所筛选的参数名
	//console.log(str[2]);		//所筛选的参数值
	if (str != null) return unescape(str[2]);
	return null;
}

function addMutationObserver(selector, callback, Kill) {
    var watch = document.querySelector(selector);
    //console.log(watch);

    if (!watch) {
        return;
    }
    var observer = new MutationObserver(function(mutations){
        var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
        if (nodeAdded) {
            //console.log(mutations);
            callback(mutations);
            if(Kill) {
                console.log('停止'+selector+'的监控');
                observer.disconnect();
            }
        }
    });
    observer.observe(watch, {childList: true, subtree: true});
}

function WindowSearch(str) {//Window中查找内容
    var FindCode=new RegExp(str,'igm');
    console.log(FindCode);
    for(var p in window){
        if(typeof window[p]!=='function') {
            if(FindCode.test(window[p])) {
                console.log(p+'----'+typeof window[p]+'---'+window[p]);
            }
        }
    }
}