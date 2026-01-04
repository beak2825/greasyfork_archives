// ==UserScript==
// @name 			ThisAV 番号 + TAG翻译 + Porn Video下载
// @description                 Porn Video 下载
// @version
// @mod				2016.09.25
// @version                     2.0.0
// @icon			http://static-hw.xvideos.com/v3/img/skins/default/favicon.ico
// @include			/https?://www.caribbeancom(pr)?.com/moviepages/\d{6}[-_]\d{3}/index.html/
// @include			http://www.pacopacomama.com/moviepages/*/index.html
// @include			http://www.muramura.tv/moviepages/*/index.html
// @include			http://www.gachinco.com/moviepages/*/index.html
// @include			http://www.heyzo.com/moviepages/*/index.html
// @include			http://www.aventertainments.com/product_lists.aspx?*
// @include			http://www.mediafreakcity.com/product_lists.aspx?*
// @include			http://www.avfantasy.com/product_lists.aspx?*
// @include			http://www.dlsite.com/*/work/=/product_id/*
// @include			http://www.dmm.co.jp/*/-/detail/=/cid=*
// 
// include			http*://*.tumblr.com/
// include			http*://*.tumblr.com/post/*
// @include			http*://*.tumblr.com/video/*
// 
// Online Video
// @include     http*://www.pornhub.com/
// @include			http*://*.pornhub.com/view_video.php?viewkey=*
// @include			http*://*.pornhub.com/video/search?search=*
// @include     https://*.pornhub.com/playlist/*
// @include     http*://www.empflix.com/*/*/video*
// 
// @include			http://www.bravotube.net/videos/*
// @include			http://www.bravoporn.com/videos/*
// @include			http://www.tubewolf.com/movies/*
// @include			http://www.seemyporn.com/videos/*
// 
// @include			https://xhamster.com/movies/*
// @include			http://www.xvideos.com/video*
// @include			https://www.xvideos.com/video*
// @include			http://jinniumovie.be/a/content/*
// @include			http://pornfun.com/videos/*
// @include			http*://*.tube8.com/*/*/*/
// @include			http://www.gotporn.com/*/video-*
// @include			http://www.thisav.com/photo/*
// @include			http://www.thisav.com/video/*
// @include			http://v.jav101.com/play/*
// 
// 国产视频下载
// @include     /http://www.aotu2\d.com/\d+//
// @include     /http://www.aotu4\d.com/\d+//
// 
// 特殊支持的网站
// @include			https://openload.co/embed/*
// @include			https://*.chaturbate.com/*/
// @include     https://chaturbate.sexhd.pics/*/
// @include			http://ecchi.iwara.tv/videos/*
// @include			http://ecchi.iwara.tv/images/*
// 
// 系列网站
// @include			http://www.porntube.com/videos/*
// @include			http://www.4tube.com/videos/*/*
// @include			http://www.fux.com/video/*
// 
// @include			http://*91porn.com/*
// @include			http://91p0*.space/view_video*.php?*
// @include			http://91dizhi.at.gmail.com.*.club/view_video.php?viewkey=*
// @include			http://*.91dizhi.at.gmail.com.*.space/view_video.php?viewkey=*
// 
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @require			https://greasyfork.org/scripts/27614-html5%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6/code/HTML5%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @require https://greasyfork.org/scripts/35940-my-jquery-plugin/code/My%20jQuery%20Plugin.js?version=234478
// @grant			unsafeWindow
// @run-at			document-idle
// @grant			GM_addStyle
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/3128
// @downloadURL https://update.greasyfork.org/scripts/371658/ThisAV%20%E7%95%AA%E5%8F%B7%20%2B%20TAG%E7%BF%BB%E8%AF%91%20%2B%20Porn%20Video%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/371658/ThisAV%20%E7%95%AA%E5%8F%B7%20%2B%20TAG%E7%BF%BB%E8%AF%91%20%2B%20Porn%20Video%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var host=location.host.replace(/^www\./i,'').toLowerCase();
var hosts=location.origin;
var path=location.pathname;
var search=location.pathname;
var urls=location.href;
var webTitle=document.title;
//host=(/^www\./i.test(host))?host.replace(/^www\./i,''):host;

var site={
  VideoID : function(title,ID){
    return title+' '+ID;
  },
  "dmm.co.jp" : {
    Lang:'ja',
    Tag: $('A[href*="article=keyword"],ul.genreTagList'),
    callback:function(){
      //标签谈价翻译添加样式
      GM_addStyle('A[href*="article=keyword"]{background-color:#d6dae3;word-spacing:5px;padding:1px 5px;-webkit-border-radius:5px;display:inline-block;margin-bottom:3px;}');
      var DMM_TitleTXT={
        CheckMonoJump:function(){
          $('.others a').each(function(){
            if($(this).text()=='DVDを通販で購入する') return location.href=$(this).attr('href');
          });
        },
          'シリーズ：':'系列：','メーカー：':'制造商：','ジャンル：':'类型：','レーベル：':'出版商：',
          //.capt>:nth-child(1)>p
          'この商品を買った人はこんな商品も買っています':'购买该产品的客户还购买了',
          '最近チェックした商品':'最近浏览过的产品',
          'この作品に出演しているAV女優':'AV女优出演过的作品',
          //.headline>span.bold
          'サンプル画像':'样图',
          //.d-review__heading
          'ユーザーレビュー':'网友评论'
        }
        $('table.mg-b20 .nw').each(function(){
          $(this).text(DMM_TitleTXT[$(this).text().trim()]);
        })

        addMObserver('#recommend,#recommend_all',function(x){
          if(!/mono/i.test(path)){
            DMM_TitleTXT.CheckMonoJump();
          }
          
          $('.capt>:nth-child(1)>p,.headline>span.bold,.d-review__heading>h2').each(function(){
            //console.log($(this).text(),DMM_TitleTXT[$(this).text().trim()]);
            $(this).text(DMM_TitleTXT[$(this).text().trim()]);
          });
        });
    }
  },
  "dlsite.com": {
    callback:function(){
      Tran(/ecchi\-eng/i.test(urls)?'en':'ja',$('.main_genre a'));
    }
  },
  "caribbeancom.com":{
    ID:(function(){return 'Caribbean '+Movie.movie_id}),
    Lang : $('html').attr('lang'),
    LangFn : function(){return getQueryString('lang',$('A[href*="https://www.d2pass.com/sqa/edit?lang="]').attr('href'))},
    Tag: $('.movie-info-cat A'),
    callback:function(){
      $('<span><a href="http://www.caribbeancom.com/moviepages/'+Movie.movie_id+'/images/l_l.jpg" download="Caribbean '+Movie.movie_id+' Cover" target="blank">Cover</a></span>').css({'border':'#888 1px solid','background-color':'ccc','padding':'0 5px'}).appendTo($('.video-detail'));
      SearchRes(Movie.movie_id);
    }
  },
  "caribbeancompr.com":{
    ID:(function(){return 'CaribbeanPr '+Movie.movie_id}),
    Lang : 'ja',
    Tag: $('.movie-info-cat A'),
    callback:function(){
      $('<span><a href="http://www.caribbeancompr.com/moviepages/'+Movie.movie_id+'/images/l_l.jpg" download="CaribbeanP '+Movie.movie_id+' Cover" target="blank">Cover</a></span>').css({'border':'#888 1px solid','background-color':'ccc','padding':'0 5px'}).appendTo($('.video-detail'));
      SearchRes(Movie.movie_id);
    }
  },
  'heyzo.com' : {
    ID: (function(){return 'Heyzo-'+emid}),
    Tag: $('.tag_cloud A'),
    callback:function(){
      $('.tag_cloud A').appendTo($('.tagkeyword')).wrap('<dd style="display:inline"></dd>').each(function(){
        $(this).html('<span>'+$(this).text()+' </span>');
      });
    }
  },
  'pacopacomama.com':{
    Lang:'ja',
    ID: (function(){return 'pacopacomama '+movie_id}),
    Tag:$('.detail-info-l a'),
    callback:function(){
      
    }
  },
  'muramura.tv':{
    Lang:'ja',
    ID: (function(){return 'muramura '+movie_id}),
    Tag:$('.genre a'),
    callback:function(){
      
    }
  },
  'gachinco.com':{
    Lang:'ja',
    callback:function(){
      TitleMod(location.href.match(/gachi\d+/).toString(),'Gachinco',$('#middle_wrapper>.main_title_bar').text());
      var newTag=$('#movie_disc .movie_info>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().trim().split(' ');
      
      $('#movie_disc').append('<div id="tag" class="bx2"></div>');
      for(i=0;i<newTag.length;i++){
        var txt=newTag[i].trim();
        $('#tag').append($('<a>').attr({'href':'#'}).text(txt)).append(' ');
      }
      Tran('ja',$('#tag a'));
    }
  },
  //Online Video
  'tumblr.com2':{
    callback:function(e){
      //https://www.tumblr.com/video/hffcv/149324933439/700/
      $('video').attr({'preload':true,'loop':false});
      var VideoUrl=$('video>source[type^="video/"]').attr('src').replace(/\/\d+$/i,'');
      var VideoType=$('video>source[type^="video/"]').attr('type').replace(/video\//i,'');
      var VideoHost=VideoUrl.match(/https?:\/\/([^\.]+.tumblr.com)/i)[1];
      var VideoID=VideoUrl.match(/\/video_file\/[^\/]+\/(\d+)/i)[1];
      $('<div id="DownVideo">').insertBefore('video');
      $('<A>').attr({'href':VideoUrl,'download':"["+VideoHost+"]"+"["+VideoID+"]"+"."+VideoType}).css({'color':'red'}).text('下载视频').appendTo('#DownVideo');
    }
  },
  '91porn.com':{
    Lang:'cn',
    callback:function(e){
      //window.addEventListener('storage',function(){new watchVideoVisited($('.listchannel'),"getQueryString('viewkey',$(this).find('a').attr('href'))")},true);
      new watchVideoVisited($('.listchannel'),"getQueryString('viewkey',$(this).find('a').attr('href'))");
      
      
      if(/view_video/.test(path)){
        var viewkey=getQueryString('viewkey');
        var VideoID=$('a[href="#featureVideo"').attr('onclick').match(/\d+/g)[1];				//获取视频ID
        newTitles(VideoID,' -Chinese homemade video').Video();
        $('<A>').attr({'id':'Download','download':'[91Porn.com]'+webTitle}).text('下载视频').appendTo($('.boxPart'));
        $('<button>').attr('id','reDownLink').text('重新获取下载地址').appendTo($('.boxPart'));
        $('<div id="FavTools">').text('收藏工具：').appendTo($('.boxPart'));
        FavToolsFn(viewkey,$('#FavTools'));
        if(path=='/view_video.php'){
          var flashvars=$('#mpl').attr('flashvars');		//获取视频参数
          var MaxVID=getQueryString('max_vid',flashvars);	//获取视频MAXVID
          var seccode=getQueryString('seccode',flashvars);	//获取Key

          $('#reDownLink').click(LoadVideoLink);LoadVideoLink();
        } else if(path=='/view_video_hd.php'){
          var ShareUrl=$('#fm-video_link').val();				//取得视频分享地址
          var seccode;
          $('#Download').attr('download','HD'+webTitle);
          $('#reDownLink').click(HDLink);
          HDLink();
        }
      }
      
      function HDLink(){
        GM_xmlhttpRequest({ //获取列表
          method : "GET",
          url : ShareUrl,
          onload : function (e) {
            $(e.responseText).each(function(){
              if(this.id=='91') {
                //取得视频提取码
                seccode=getQueryString('video_id',this.src);
                console.log('视频提取码：'+seccode);
                //取得视频地址
                GM_xmlhttpRequest({
                  method : "GET",
                  url : 'http://91.9p91.com/getfile_jw.php?VID='+seccode,
                  onload :function(data){
                    var VideoUrl=getQueryString('file',data.responseText);
                    console.log(VideoUrl);
                    $('#Download').attr('href',VideoUrl);
                  }
                });
              }
            })
          }
        });
      }
      
      function LoadVideoLink(){
        $.ajax({
          type: 'get',
          url: hosts+'/getfile.php?VID='+VideoID+'&mp4=0&seccode='+seccode+'&max_vid='+MaxVID,
          success: function(data){
            var VideoUrl=getQueryString('file',data);
            console.log(VideoUrl);
            $('#Download').attr('href',VideoUrl);
          }
        });
      }
    }
  },
  'thisav.com':{
    callback:function(){
      $('body').removeAttr('oncontextmenu');
      if(/photo/.test(path)){
        var src=$('.photo img').attr('src');
        $('.photo img').attr('src',src.replace(/-m\.jpe?g$/,'.jpg'));
      } else {
        var VideoID=video_id;
        var VideoUrl=getQueryString('file',$('#mpl').attr('flashvars'))||$('#my-video_html5_api>source[type="video/mp4"],#my-video>source[type="video/mp4"]').attr('src');
        //console.log(VideoUrl);
        	//VideoUrl=VideoUrl?$('#my-video_html5_api>source["video/mp4"]').attr('src'):null;
        //console.log(VideoUrl,$('#my-video>source["video/mp4"]').attr('src'));
        document.title=webTitle='【'+VideoID+'】'+webTitle.replace(' - 視頻 - ThisAV.com-世界第一中文成人娛樂網站','');
        $('<div id="FavTools" class="">').text('收藏工具：').appendTo($('.video_info'));
        $('<a>').attr({'download':webTitle,'title':webTitle,'href':VideoUrl}).text('Download | ').appendTo('#FavTools');
        FavToolsFn(VideoID,$('#FavTools'));
      }
    }
  },
  'v.jav101.com':{
    callback:function(){
      var m3u8=data.video.specurl.m3u8;
      var mpd=data.video.specurl.mpd;
      var VideoID=data.video.id;
      var VideoUrl=data.video.specurl.dl;
        $('<div id="FavTools">').css({'font-size':'15px'}).text('收藏工具：').appendTo($('#msg-section_right30'));
        $('<a>').attr({'download':webTitle,'title':webTitle,'href':'PotPlayer://http:'+mpd}).text('PotPlayer | ').appendTo('#FavTools');
        $('<a>').attr({'download':webTitle,'title':webTitle,'href':m3u8}).text('m3u8 | ').appendTo('#FavTools');
        $('<a>').attr({'download':webTitle,'title':webTitle,'href':VideoUrl}).text('Download | ').appendTo('#FavTools');
        FavToolsFn(VideoID,$('#FavTools'));
    }
    
  },
  'bravotube.net':{
    Lang:'en',
    Tag:$('.categories A'),
    callback:function(){
      location.href="http://www.bravoporn.com/videos/"+params['video_id']+"/";
    }
  },
  'bravoporn.com':{
    Lang:'en',
    Tag:$('.categories A'),
    callback:function(e){
      var VideoID=flashvars['video_id'];
      var VideoHash=flashvars['video_url'].match(/\w{32}/i).toString();
      var VideoUrl=decodeURIComponent(flashvars['video_url']);
      var PreViewUrl=decodeURIComponent(flashvars['preview_url']);

      document.title=webTitle='【'+VideoID+'】'+webTitle;

      GM_addStyle('.newButton{float:left;padding-right:5px; margin: 0px 0 3px 0; display:inline-block; padding:11px 7px 12px; min-width:116px; border:1px solid #343434; background:#181818; color:#44A00E; text-align:center; font:300 12px/14px Nunito, sans-serif;}');
      $('<A>').attr({'class':'newButton','target':'blank','href':PreViewUrl,'download':'['+host+']'+webTitle}).text('PreView').insertBefore($('.fav-button'));
      $('<A>').attr({'class':'newButton','target':'blank','href':VideoUrl,'download':'['+host+']'+webTitle}).text('Download').insertBefore($('.fav-button'));
      $('<div id="FavTools" class="video_comments">').text('收藏工具：').css({'border':'1px solid #343434','font-size':'24px','text-align':'center','vertical-padding':'11px 7px 12px'}).insertBefore($('.video_comments'));
      FavToolsFn(VideoID,$('#FavTools'));
    }
  },
  'tubewolf.com':{
    Lang:'en',
    Tag:$('.movie-list-info A'),
    callback:function(){
      var VideoID=decodeURIComponent(flashvars['video_id']);
      var VideoUrl=decodeURIComponent(flashvars['video_url']);
      document.title=webTitle='【'+VideoID+'】'+webTitle.replace(/ - \w+ Porn/,'');
      $('.video-tools').append($('<li>').attr({'class':'tools-views'}).append($('<A>').attr({'href':VideoUrl,'target':'blank','download':'['+host+']'+webTitle}).text('download')));
      $('<div id="FavTools"></div>').text('收藏工具：').insertBefore($('.movie-list-info'));
      FavToolsFn(VideoID,$('#FavTools'));
      new watchVideoVisited($('.thumb'),"$(this).find('img').attr('src').match(/(\\d+)\\/240x140/)[1]");
    }
  },
  'seemyporn.com':{
    Lang:'en',
    Tag:$('.info A'),
    callback:function(){
      var VideoID=decodeURIComponent(flashvars['video_id']);
      var VideoUrl=decodeURIComponent(flashvars['video_url']);
      document.title=webTitle='【'+VideoID+'】'+webTitle.replace(/ - \w+ Porn/,'');
      $('.tabs-menu>ul').append($('<li>').append($('<A>').attr({'class':'toggle-button','href':VideoUrl,'target':'blank','download':'['+host+']'+webTitle}).css({'color':'red'}).text('download')));
      $('<div id="FavTools"></div>').text('收藏工具：').insertBefore($('.info'));
      FavToolsFn(VideoID,$('#FavTools'));
      new watchVideoVisited($('#list_videos_related_videos_items>.thumb'),"$(this).find('span').data('fav-video-id')");
    }
  },
  'xhamster.com':{
    Lang:'en',
    Tag:$('#channels A'),
    callback:function(){
      //var FlvUrl=decodeURIComponent($('[name="flashvars"]').val().match(/(http.+\.clients.cdn13.com(?!.flv).+?.flv.+?)%22%5D%7D/)[1]).replace(/\\/g,'').replace(/\.flv/i,'.mp4');
      var VideoID=js_vars['video_id'];
      var MP4Url=$('#playerSwf script').text().match(/file: '([^']*?)'/i)[1];
      document.title=webTitle='【'+VideoID+'】'+webTitle.replace(': xHamster','');
      $('#btnLoad').attr({'download':'[xhamster.com]'+webTitle,href:MP4Url});
      $('<div id="FavTools">').text('收藏工具：').insertBefore($('#videoInfo'));
      FavToolsFn(VideoID,$('#FavTools'));
      watchVideoVisited($('.video'),"$(this).attr('_vkey')");
      new watchVideoVisited($('.video'),"$(this).find('.hSprite').attr('id')");
    }
  },
  'xvideos.com':{
    Lang:'en',
    Tag:$('.video-tags A'),
    callback:function(){
      var VideoID=xv.conf['data']['id_video'];
      var Min=$('h2>.duration').text().replace(/- /,'');
      var Color={'Fav':'red','Cut':'springgreen','Visited':'#00edD5'};
      document.title=webTitle='【'+VideoID+'】【'+Min+'】'+webTitle.replace(' - XVIDEOS.COM','');
      $('.download').parent().attr({'href':html5player['url_high'],download:'[xvideos.com]'+webTitle}).text('Download').attr('background','red').click(function(){
        $('.download-ready>a').attr({download:'[xvideos.com]'+webTitle});
      });
      FavToolsFn(VideoID,$('.secondary-menu'));
      $(document).ready(function(){
        /*缩略图添加标记*/
        var thumbBlock=$('.thumb-block');
        thumbBlock.each(function(){
          var thumbID=$(this).attr('id').match(/\d+$/).toString();
          if(SotreDB('Favorites').find(thumbID)) $('<div style="background:red;position:absolute;width:100%;height:100%;opacity:0.3;"></div>').prependTo($(this));
          else if(SotreDB('Cut').find(thumbID)) $('<div style="background:plum;position:absolute;width:100%;height:100%;opacity:0.3;"></div>').prependTo($(this));
          else if(SotreDB('Vistied').find(thumbID)) $('<div style="background:paleturquoise;position:absolute;width:100%;height:100%;"></div>').prependTo($(this));
        })
      })
    }
  },
  'pornfun.com':{
    Lang:'en',
    Tag:$('.specification a'),
    callback:function(){
      var VideoID=params['video_id'];
      document.title=webTitle='【'+VideoID+'】'+webTitle;
      $('#download_link_1').attr({'download':'[pornfun.com]'+webTitle});
      $('<div id="FavTools">').text('收藏工具：').insertBefore($('.specification'));
      FavToolsFn(VideoID,$('#FavTools'));
    }
  },
  
  //在线视频
  'pornhub.com':{
    Lang:$('HTML').attr('lang'),
    Tag:$('.categoriesWrapper a, .tagsWrapper a'),
    AD : $('#js-abContainterMain'),
    callback:function(){
      GM_addStyle('div[data-tab="add-to-tab"]{color:red!important;font-weight:bold!important;}')
      if(path=='/view_video.php') {
        var VideoID=$('#main-container').data('next-shuffle');
        var embedId=ad_player_id;
        var quality=eval("qualityItems_"+ad_player_id);
        var VideoUrl=(quality[2]||quality[1])['url'];
        var VideoUrlLow=(quality[0]||quality[1])['url'];
        if(quality[3]!=null||quality[3]!='') console.log('1080 HD: ',quality[3]);

        document.title=webTitle='【'+embedId+'】'+webTitle;
        $('div[data-tab="download-tab"]').html('<i class="main-sprite-dark-2"></i><a id="Download">Download</a>');

        if($.getUrlParam('ip', VideoUrl)) {
          $('#Download').attr({'download':'[pornhub.com]'+webTitle.replace(' - Pornhub.com',''),'href':VideoUrl}).text('当前下载地址不可用，请刷新页面，或更换上网代理');
        } else {
          $('#Download').attr({'download':'[pornhub.com]'+webTitle.replace(' - Pornhub.com',''),'href':VideoUrl});
        }
        $('#Download').after($('<a>').attr({'title':webTitle,'href':'PotPlayer://'+VideoUrl}).text('PotPlayer').css({'color':'yellow','margin-left':'5px'}));
        $('<div class="tab-menu-wrapper-cell" id="FavTools" style="font-size:14px;">').text('收藏工具：').appendTo($('#js-shareData>.tab-menu-wrapper-row'));
        FavToolsFn(VideoID,$('#FavTools'));

        
        
        
        new watchVideoVisited($('.videoblock.videoBox'),"_vkey",VideoID);

        var JumpLang=this.Lang=='en'?'jp':'en';
        var JumpLangText=this.Lang=='en'?'日本语':'英语';
        $('<a href="'+$('.languages>.'+JumpLang+'>a').attr('href')+'" target="blank">'+JumpLangText+'</a>').appendTo('#js-shareData>.tab-menu-wrapper-row');
        $('#js-shareData').css({'width':'auto'});

        //插入H5视频
        String.prototype.test=function(regx){
          var regx=new RegExp(regx,"gi");
          if(this.search(regx)>-1) return true;
          else return false;
        }
        var H5width=VideoUrl.test("480P")?320:960;
        var H5PlayerFn = {
          tips : function(txt) {
            $('#VideoTips').text(txt);
          },
          progress : function(txt) {
            $('#VideoProgress').html($('<A>').text(txt).css({'cursor':'pointer'}).click(function(){
              var _H5Player=document.querySelector('#H5Player');
              _H5Player.currentTime=txt;
            }));
          },
          PlayerEvent : function(e, tips){
            console.log('PlayerTime', this, e, tips);
            //当前不是所记录的视频时，重新记录进度
            if(embedId != SotreDB('PlayerTime').find('VideoID')){
              SotreDB('PlayerTime').add('VideoID', embedId);
              SotreDB('PlayerTime').add('currentTime', e.currentTime);
              this.tips(tips+e.currentTime);
            }
          }
        }
        //生成视频对象
        $('<video>').attr({'id':'H5Player','src':VideoUrlLow,'controls':true,'autoplay':false,'preload':true,'width':H5width}).on({
          'dblclick' : function(e){this.paused ? this.play() : this.pause();},	//双击播放
          'click' : function(e){
            console.log('当前对象高度：',this.clientHeight , '鼠标点击对象的相对位置：', e.screenY);
            if(!this.paused && e.screenY<this.clientHeight*0.8) this.pause();//单击画面上部分80%的区域时，暂停画面
          },
          'keydown' : function(e){
            switch(e.keyCode){
              case '37' : this.currentTime-=3; H5PlayerFn.tips("后退：3秒"); break;
              case '39' : this.currentTime+=3; H5PlayerFn.tips("快进：3秒"); break;
              case '97' : this.width*=0.5;break;
              case '98' : this.width*=1;break;
              case '99' : this.width*=1.5;break;
              case '100' : this.width*=2;break;
            }
          }
        }).bind({
          'playing' : function(e){
            if(embedId != SotreDB('PlayerTime').find('VideoID')){
              SotreDB('PlayerTime').add('VideoID', embedId);
              H5PlayerFn.tips('开始播放：');
            } else {
              H5PlayerFn.tips('存在上一次播放进度：');
            }
            SotreDB('PlayerTime').add('currentTime', this.currentTime);
            H5PlayerFn.progress(this.currentTime);
            var _this=this;
            var t=window.setInterval(function(){
              console.log(this);
              SotreDB('PlayerTime').add('currentTime', _this.currentTime);
              H5PlayerFn.progress(_this.currentTime);
            },5000);
            $(this).bind('pause', function(e){ //在播放暂停时
              SotreDB('PlayerTime').add('currentTime', this.currentTime);
              H5PlayerFn.tips('暂停：');
              H5PlayerFn.progress(this.currentTime);
              clearInterval(t);
            })
          },  //在媒体开始播放时触发
          'seeked' : function(e){
            SotreDB('PlayerTime').add('currentTime', this.currentTime);
            H5PlayerFn.tips('跳转到：');
            H5PlayerFn.progress(this.currentTime);
          },
          'loadeddata' : function(e){
            H5PlayerFn.tips('视频加载完毕！');
          },
          'error':function(e){console.log('error', e)}
        }).insertBefore($('#player'));
        
        //位置调整
        $('.video-wrapper>.hd.clear').remove();//移除视屏下方的广告
        $('#player').remove();//移除原有的播放器
        $('.video-actions-menu').insertBefore('#H5Player');//动作菜单移动到视频上方
        $('div[data-tab="add-to-tab"]').click(function(){
          $('.video-actions-container').insertAfter('.video-actions-menu');
        });
        
        
        var _H5Player=document.querySelector('#H5Player');
        //对 video 增强
        $(document).on('keydown', function(e){
          switch(e.keyCode){
            case '37' : _H5Player.currentTime-=3;H5PlayerFn.tips("后退：3秒");break;
            case '39' : _H5Player.currentTime+=3;H5PlayerFn.tips("快进：3秒");break;
            case '97' : _H5Player.width*=0.5;break;
            case '98' : _H5Player.width*=1;break;
            case '99' : _H5Player.width*=1.5;break;
            case '100' : _H5Player.width*=2;break;
          }
        });
        //生成视频播放控制对象
        $('<div id="H5PlayerTools">').append('画面缩放：<button class="H5Size" value="0.5">0.5</button><button class="H5Size" value="1">1</button><button class="H5Size" value="1.5">1.5</button><button class="H5Size" value="2">2</button><button id="H5Player_Control_Add" value="39">快进3秒</button><button id="H5Player_Control_Less" value="37">后退3秒</button><button id="H5Player_Reload">重新加载</button><span id="VideoTips"></span><span id="VideoProgress"></span>').insertAfter('#H5Player');
        //播放控制工具
        $('#H5PlayerTools>button').click(function(){
          if(this.className=='H5Size') $('#H5Player').attr({'width':H5width*this.value});
          if(this.id=='H5Player_Control_Add') _H5Player.currentTime+=3, _H5Player.tips("快进：3秒");
          if(this.id=='H5Player_Control_Less') _H5Player.currentTime-=3, _H5Player.tips("后退：3秒");
          if(this.id=='H5Player_Reload') _H5Player.src=VideoUrlLow;
        });
        GM_addStyle('.H5Size{width:30px;}#H5PlayerTools>button{margin:1px;padding:2px;}');
        GM_addStyle('.tab-menu-wrapper-cell{padding-left:5px;}');
      } else {
        //对非视频页面
        new watchVideoVisited($('.videoblock.videoBox'),"_vkey",VideoID);
      }
    }
  },
  'empflix.com':{
    Lang:'en',
    Tag:$('._video_info a'),
    callback:function(){
      $('.zoneAds, .pspBanner, .rightBarBannersx').remove();
      $('.infoBlockUnderVid').insertBefore('.commentsBlockUnderVid');
    }
  },
  'gotporn.com':{
    Lang:'en',
    Tag:$('ul.tag-suggestions a'),
    callback:function(){
      var VideoID=$('#video-player').data('id');
      newTitles(VideoID,/ on GotPorn \(\d+\)/);
      $('[data-action="download"]>span').html($('<a>').attr({'href':'http://www.gotporn.com/video/'+VideoID+'/download','download':'[GotPorn]'+document.title}).css({'color':'red'}).text('Download'));
      $('<div id="FavTools" style="font-size:14px;">').text('收藏工具：').appendTo($('.info>.metas'));
      FavToolsFn(VideoID,$('#FavTools'));
      new watchVideoVisited($('.video-item'),"$(this).data('id')");
    }
  },
  'porntube.com':{
    LangFn:function(){return $('body').attr('id').replace('lang-','')},
    Tag:$('.tags a'),
    callback:function(){
      var VideoID=wm_video_uuid;
      //var VideoUrl=page_params.videoUrlJS;
      document.title=webTitle='【'+VideoID+'】'+webTitle.replace(' | PornTube ®','').replace('| 4tube','');
      var Quality=$('#download1080p').length==1?$('#download1080p'):$('#download720p').length==1?$('#download720p'):$('#download480p').length==1?$('#download480p'):$('#download360p').length==1?$('#download360p'):null;

      //http://tkn.porntube.com/249879/download/480
      var o = "http://tkn." + Quality.data("name") + ".com/" + Quality.data("id") + "/download/" + Quality.data('quality');
      $.post(o,function(n) {
        var VideoUrl=n.token;
        $('#download-button>span').html('<a href="'+VideoUrl+'" download="'+'['+host+']'+webTitle+'">Download</a>');
      });
      $('<div id="FavTools" style="font-size:14px;">').text('收藏工具：').insertBefore($('.user,.tags'));
      FavToolsFn(VideoID,$('#FavTools'));
    }
  },
  '4tube.com':{
    PreProcess:function(){
      site['4tube.com']=site['porntube.com'];
    }
  },
  'fux.com':{
    PreProcess:function(){
      site['fux.com']=site['porntube.com'];
    }
  },
  'tube8.com':{
    Lang:'en',
    Tag:$('.tag-list a, .tags a'),
    callback:function(){
      setCookie('adBlockClosed',true,365);
      var VideoID=page_params.videoidVar;
      var VideoUrl=page_params.videoUrlJS;
      newTitles(VideoID,/ - Porn Video \d+ \| Tube8/i);
      //document.title=webTitle='【'+VideoID+'】'+webTitle.replace(' - Porn Video 251 | Tube8','');
      $('#downloadButton').attr({'download':'[tube8.com]'+webTitle, href:VideoUrl});
      VideoFn(flashvars.quality_180p, flashvars.image_url, 885, 470, '#playerContainerWrapper', VideoID);
    
      //$('<video>').attr({id:'video','src':flashvars.quality_180p,'poster':flashvars.image_url,'controls':'controls'}).css({'width':'885px','height':'470px'}).insertBefore('#playerContainerWrapper');
      
      //收藏工具
      watchVideoVisited($('.thumb_box'),"$(this).attr('id').replace('video_i','')");
      
      //视频质量切换按钮
      var quality=[2160,1080,720,480,240,180];
      for(var i=0;i<quality.length;i++) {
        var thisQuality=eval("flashvars.quality_"+quality[i]+"p");
        console.log(thisQuality);
        if(thisQuality) {
          $('<a class="video-src" href="'+thisQuality+'" data-src="'+thisQuality+'">').text(quality[i]).attr({'download':'[tube8.com]'+webTitle}).click(function(){
            $('#H5Player').attr('src',$(this).data('src'));
            return false;
          }).appendTo('#FavTools');
        }
      }
      
      
      GM_addStyle('.video-src{font-size:18px;border:solid 1px #ccc;padding:2px;display:inline-block;} .gridList{display:block;}');
      //移除原视频
      $('#playerContainerWrapper').remove();
    }
  },
  'jinniumovie.be':{//FC2
    Lang:'jp',
    Tag:$(''),
    callback:function(){
      document.title=webTitle='【'+current_up_id+'】'+webTitle.replace(' - 成人视频 成人','');
    }
  },
  'openload.co':{
    callback:function(){
      var Videotitle=$('.title').text();
      var VideoUrlStr=$('#streamurl').text();
      var VideoUrl='https://openload.co/stream/'+VideoUrlStr;
      var VideoPlayer=$('#olvideo_html5_api').attr({'src':VideoUrl});
      $.ajax({'url':'https://openload.co/logpopup/n~'+shouldreport+'?adblock=1'});
      $('body').html($('<a>').attr({'href':VideoUrl,'download':'['+host+']'+Videotitle,'target':'blank'}).text('下载：'+Videotitle));
      $('body').append(VideoPlayer);
    }
  },
  'zh.chaturbate.com':{
    callback:function(){
      var swfPlayer=$('#xmovie').attr('data');
      var VideoUrl=$('#xmovie>param[name="FlashVars"]').val().replace(/pid=[^&]+&address=/i,'https://');
      var hlsVideoUrl=$('script:not([src]):not([id])[type]')[$('script:not([src]):not([id])[type]').length-2].innerHTML.match(/initHlsPlayer\(jsplayer, '([^']*?)'/)[1];
      $('<A>').attr({"href":"PotPlayer://"+hlsVideoUrl}).text("PotPlayer 播放：").insertBefore($('.token_balance'));
      $('<A>').attr({"href":"PotPlayer://"+hlsVideoUrl}).text(unsafeWindow.broadcaster).insertBefore($('.token_balance'));
      
      //$('<A>').attr({"href":"PotPlayer://"+hlsSourceSlow}).text("PotPlayer播放").insertBefore($('.token_balance'));
    }
  },
  'ecchi.iwara.tv':{
    callback:function(){
      var VideoTitle=$('.submitted>.title').text();
      $('[id^="node-"] .field-item.even>a').attr({'download':VideoTitle,'title':VideoTitle});
      addMObserver('.list-unstyled',function(){
        $('.list-unstyled a').attr({'download':VideoTitle,'title':VideoTitle});
        $('#download-options').removeClass();
      })
    }
  },
  //国产网站
  'aotu23.com':{
    callback:function(){
      $('body>center, div.ads-player, div.ads-footer').remove();
      
      var VideoHost="[aotu23.com]";
      var VideoID=$('input[name="video_id"]').val();
      var VideoUrl=$('source').attr('src');
      var VideoTitle=$('meta[property="og:title"]').attr('content');
      $('<li>').append($('<A>').attr({'download':VideoHost+"["+VideoID+"]"+VideoTitle,'href':VideoUrl,'target':'blank'}).css({'border':'2px #fff solid','color':'red','padding':'0px 5px'}).text('Download')).appendTo('#video-view-menu>ul');
      $('<li>').append($('<div id="FavTools">').text('收藏工具：')).appendTo('#video-view-menu>ul');
      
      FavToolsFn(VideoID,$('#FavTools'));
      new watchVideoVisited($('a.thumbnail'),"$(this).parent().parent().attr('id').replace('video-','')");
      window.addEventListener('storage',function(){new watchVideoVisited($('a.thumbnail'),"$(this).parent().parent().attr('id').replace('video-','')")});
    }
  }
}

var HostCom={
  'aotu40.com' : 'aotu23.com','aotu42.com' : 'aotu23.com',
  'aotu24.com' : 'aotu23.com',
  '91p01.space':'91porn.com',
  '91p02.space':'91porn.com',
  '91dizhi.at.gmail.com.9p3.space':'91porn.com',
  'email.91dizhi.at.gmail.com.t9i.club':'91porn.com',
  'email.91dizhi.at.gmail.com.7h1.space':'91porn.com',
  'jp.pornhub.com':'pornhub.com',
  'chaturbate.sexhd.pics':'zh.chaturbate.com'
}

var Tags={};

var zhLang=[
  {ja:'月額動画',en:'',zh:'包月视频'},{ja:'オリジナル動画',en:'',zh:'原始视频'},
  {ja:'コスプレ',en:'',zh:'角色扮演'},
  
  {ja:'クンニ',en:'',zh:'舔阴'},
  {ja:'ザーメン',en:'',zh:'精液'},{ja:'潮吹き',en:'',zh:'潮吹'},
  {ja:'手コキ',en:'',zh:'手交'},{ja:'指マン',en:'',zh:'指法'},{ja:'アナルセックス',en:'',zh:'肛交'},
  
  {ja:'顔射',en:'',zh:'颜射'},{ja:'集体颜射',en:'',zh:'集体颜射'},{ja:'口内発射',en:'',zh:'口内射精'},{ja:'フェラ抜き',en:'',zh:'口交射精'},
  {ja:'微乳',en:'',zh:'贫乳'},{ja:'',en:'',zh:''},
  {ja:'美尻',en:'',zh:'美臀'},{ja:'アナル',en:'',zh:'肛门'},
  
  {ja:'乱交',en:'',zh:'滥交'},{ja:'レイプ',en:'',zh:'强奸'},{ja:'近親相姦',en:'',zh:'乱伦'},
  
  
  {ja:'ブルマー',en:'',zh:'灯笼裤'},
  
  
  
  {ja:'放尿',en:'',zh:'放尿'},
  
  {ja:'断面図',en:'',zh:'断面图'},
  
  
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  
  
  
  {ja:'',en:'',zh:''},{ja:'寝取り・寝取られ',en:'',zh:'被私通'},
  {ja:'ミニ系・小柄',en:'',zh:'迷你系・娇小'},{ja:'ロリ系',en:'',zh:'萝莉系'},
  {ja:'ぶっかけ',en:'',zh:'集体颜射'},
  {ja:'お尻/ヒップ',en:'Buttocks',zh:'臀部'},
  /* -----===== 基础单词（英文） =====----- */
  {ja:'',en:'Busty',zh:'巨乳'},{ja:'',en:'Tits',zh:'乳头'},{ja:'おっぱい',en:'Breasts',zh:'乳房'},
  {ja:'',en:'Anal',zh:'肛门'},{ja:'',en:'Gangbang',zh:'轮奸'},
  {ja:'',en:'Bondage',zh:'奴役'},{ja:'',en:'Toys',zh:'玩具'},{ja:'',en:'Sex Toy',zh:'性爱玩具'},{ja:'',en:'Sex toys',zh:'性爱玩具'},
  {ja:'',en:'fingering',zh:'手指抚弄'},{ja:'',en:'Massage',zh:'按摩'},
  {ja:'',en:'Slut',zh:'荡妇'},
  
  {ja:'',en:'moaning',zh:'呻吟'},
  {ja:'',en:'peeing',zh:'小便'},
  {ja:'',en:'Suck',zh:'吸允'},{ja:'',en:'sucking',zh:'吸允'},
  
  {ja:'',en:'Teen',zh:'青少年'},{ja:'',en:'young',zh:'年轻'},
  {ja:'',en:'tattoo',zh:'纹身'},
  {ja:'',en:'cum on face',zh:'射精在脸上'},
  {ja:'',en:'beauty',zh:'漂亮'},{ja:'',en:'cute',zh:'可爱'},{jp:'',en:'romantic',zh:'浪漫'},{ja:'',en:'',zh:''},
  {ja:'',en:'Closeup',zh:'特写'},{jp:'',en:'close up',zh:'特写'},
  {ja:'',en:'uniform',zh:'制服'},{ja:'',en:'Uniforms',zh:'制服'},
  {ja:'',en:'School',zh:'学校'},
  {ja:'',en:'car',zh:'车'},
  /* -----===== 基础单词（日文） =====----- */
  {ja:'痴漢',en:'',zh:'痴汉'},
  {ja:'恥辱',en:'',zh:'耻辱'},
  {ja:'調教',en:'',zh:'调教'},{ja:'',en:'',zh:''},
  {ja:'クスコ',en:'',zh:'宫腔镜'},
  {ja:'局部アップ',en:'',zh:'局部特写'},
  {ja:'二穴ファック',en:'Double Penetration',zh:'二穴插入'},
  {ja:'AV女優',en:'Pornstar',zh:'色情明星'},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  {ja:'電車',en:'',zh:'电车'},{ja:'お嬢様',en:'',zh:'大小姐'},
  /* -----===== 日英对照 =====----- */
  {ja:'中出し',en:'Internal Cumshot',zh:'中出'},{ja:'射精',en:'Cumshots',zh:'射精'},
  {ja:'フェラ',en:'Blowjob',zh:'口交'},{ja:'パイズリ',en:'Breast Sex',zh:'乳交'},{ja:'手コキ',en:'Handjob',zh:'手交'},{ja:'フィストファック',en:'Fisting',zh:'拳交'},{ja:'オナニー',en:'Masturbation',zh:'自慰'},{ja:'母乳',en:'Breast Milk',zh:'母乳'},
  {ja:'レズ',en:'Lesbian',zh:'女同性恋'},{ja:'乱暴なセックス',en:'Rough Sex',zh:'暴力的性行为'}, {ja:'ストリップ', en:'Striptease',zh:'脱衣舞'},
  {ja:'ハードコア',en:'Hardcore',zh:'阴核'},
  {ja:'バイブ',en:'',zh:'振动棒'},{ja:'ディルド',en:'dildo',zh:'假阴茎'},
  {ja:'尻',en:'Ass',zh:'屁股'},{ja:'デカ尻',en:'Big Ass',zh:'大屁股'},{ja:'デカチン',en:'Big Dick',zh:'大阴茎'},
  {ja:'黒髪',en:'Brunet Hair',zh:'黑发'},{ja:'赤毛',en:'Red Head',zh:'红发'},{ja:'金髪',en:'Blonde',zh:'金发'},{ja:'茶髪',en:'Brunette',zh:'褐发'},
  {ja:'美女',en:'Babe',zh:'美女'},{ja:'熟女',en:'MILF',zh:'熟女'},{ja:'ニューハーフ',en:'Shemale',zh:'人妖'},
  //职业
  {ja:'ナース',en:'nurse',zh:'护士'},{ja:'看護婦',en:'nurse',zh:'护士'},
  
  
  {ja:'着衣',en:'Clothed',zh:'穿着衣服'},{ja:'パンツ',en:'Panties',zh:'内裤'},{ja:'ランジェリー',en:'Lingerie',zh:'情趣内衣'},{ja:'水着',en:'Swimwear',zh:'泳衣'},
  {ja:'パイパン',en:'',zh:'剃毛'},
  
  
  
  {ja:'フェチ',en:'Fetish',zh:'恋物癖'},
  
  {ja:'リアル',en:'Reality',zh:'现实'},{ja:'',en:'Exclusive',zh:'独家'},{ja:'ウェブカメラ',en:'Webcam',zh:'网络视讯'},{ja:'エロアニメ',en:'Hentai',zh:'成人动画'},{ja:'認証済みユーザー',en:'Verified Amateurs',zh:'认证用户'},
  {ja:'セクシー',en:'',zh:'性感的'},{ja:'スレンダー',en:'slim',zh:'苗条'},{ja:'',en:'Curvy',zh:'曲线玲珑'},
  {ja:'音楽',en:'Music',zh:'音乐'},{ja:'編集',en:'Compilation',zh:'编集'},{ja:'おもしろ映像',en:'Funny',zh:'有趣的视频'},{ja:'タバコ',en:'Smoking',zh:'抽烟'},
  {ja:'日本',en:'Japanese',zh:'日本人'},{ja:'フランス人',en:'French',zh:'法国人'},{ja:'韓国人',en:'Korean',zh:'韩国人'},{ja:'ロシア人',en:'Russian',zh:'俄罗斯人'},{ja:'ラテン人',en:'Latina',zh:'拉丁美洲女子'},{ja:'',en:'czech',zh:'捷克人'},
  {jp:'',en:'censored',zh:'马赛克'},
  /*====================================Other*/
  {ja:'ごっくん',en:'',zh:'喝精液'},
  {ja:'巨乳フェチ',en:'',zh:'恋乳癖'},{ja:'脚フェチ',en:'',zh:'恋脚癖'},{ja:'その他フェチ',en:'',zh:'其它恋物癖'},
  {ja:'マッサージ',en:'',zh:'按摩'},{ja:'パンチラ',en:'',zh:'走光'},
  {ja:'インストラクター',en:'',zh:'教练'},
  {ja:'アイドル・芸能人',en:'',zh:'偶像艺人'},{ja:'競泳・スクール水着',en:'',zh:'学校泳衣'},{ja:'電マ',en:'',zh:'电动棒'},
  
  {ja:'パンスト',en:'',zh:'连袜裤'},

  {ja:'辱め',en:'',zh:'羞辱'},{ja:'羞恥',en:'',zh:'羞耻'},{ja:'アクション・格闘',en:'',zh:'动作・格斗'},
  
  {ja:'ポルチオ',en:'',zh:'ポルチオ'},
  {ja:'学園もの',en:'',zh:'学校事件'},
  {ja:'デビュー作品',en:'',zh:'出道作品'},{ja:'ドキュメンタリー',en:'',zh:'纪录片'},
  
  {ja:'ギリモザ',en:'',zh:'马赛克'},{ja:'キャンペーン対象',en:'',zh:'活动对象'},

  {ja:'カテゴリー',en:'',zh:'类别'},
  /*==== DMM ====*/
  {ja:'不倫',en:'',zh:'不论'},{ja:'逆レイプ',en:'',zh:'反强奸'},
  {ja:'淫乱・ハード系',en:'',zh:'淫乱'},{ja:'ミニ系',en:'',zh:'萝莉',txt:'迷你'},
  {ja:'ドラッグ',en:'',zh:'药品'},
  {ja:'3P・4P',en:'',zh:'多P'},
  {ja:'ボディコン',en:'',zh:'紧身衣'},
  {ja:'尻フェチ',en:'',zh:'恋臀癖'},
  {ja:'4時間以上作品',en:'',zh:'4小时以上作品'},
  
  {ja:'ショタ',en:'',zh:'正太'},{ja:'ドラマ',en:'',zh:'戏剧性事件'},
  
  //角色
  {ja:'職業色々',en:'',zh:'各色职业'},{ja:'くノ一',en:'',zh:'女忍者'},
  
  {ja:'白人女優',en:'',zh:'白人女优'},
  {ja:'イメージビデオ',en:'',zh:'影像视频'},
  {ja:'エステ',en:'',zh:'美容院'},
  {ja:'単体作品',en:'',zh:'单体作品'},{ja:'独占配信',en:'',zh:'',txt:'独家'},{ja:'ブラウザ視聴',en:'',zh:'浏览器中查看'},{ja:'Android対応',en:'',zh:'',txt:'安卓对应'},{ja:'iPhone・iPad対応',en:'',zh:'',txt:'IOS对应'},
  {ja:'サンプル動画',en:'',zh:'',txt:'短片试看'},{ja:'DVDトースター',en:'',zh:'',txt:'DVD烧录'},{ja:'DVD',en:'',zh:'',txt:'DVD'},{ja:'デジモ',en:'',zh:'',txt:'数码'},{ja:'ハイビジョン',en:'',zh:'',txt:'高清电视'},
  
  {ja:'盗撮・のぞき',en:'',zh:'偷窥'},
  
      /*
		{jp:'ミニ系・小柄',zh:'€迷你系・娇小'},
		{jp:'フェラ',zh:'❤口交（フェラ）'},{jp:'ぶっかけ',zh:'❤集体颜射（ぶっかけ）'},{jp:'オナニー',zh:'❤手淫（オナニー）'},{jp:'手コキ',zh:'手交'},{jp:'アナル',zh:'❤肛门'},{jp:'アナルセックス',zh:'❤肛交'},
		{jp:'パイパン',zh:'€剃毛'},
		{jp:'ショタ',zh:'正太'},{jp:'お姉さん',zh:'大姐姐'},{jp:'メイド',zh:'€女仆'},{jp:'コンパニオン',zh:'♀礼仪小姐（コンパニオン）'},{jp:'花嫁・若妻',zh:'♀新娘子（花嫁・若妻）'},{jp:'キャバ嬢・風俗嬢',zh:'♀风俗娘（キャバ嬢・風俗嬢）'},{jp:'白人女優',zh:'白人女优'},
      
      
      {jp:'シックスナイン',zh:'69'},
		{jp:'ごっくん',zh:'❤喝精液（ごっくん）'},
		{jp:'巨乳フェチ',zh:'❤恋乳癖（巨乳フェチ）'},{jp:'尻フェチ',zh:'❤恋臀癖'},{jp:'脚フェチ',zh:'❤恋脚癖（脚フェチ）'},{jp:'その他フェチ',zh:'❤其它恋物癖'},
		{jp:'マッサージ',zh:'❥按摩（マッサージ）'},{jp:'パンチラ',zh:'❥走光（パンチラ）'},
		{jp:'インストラクター',zh:'★教练（インストラクター）'},
		{jp:'アイドル・芸能人',zh:'★偶像艺人（アイドル・芸能人）'},{jp:'セーラー服',zh:'㊛水手服（セーラー服）'},{jp:'競泳・スクール水着',zh:'㊛学校泳衣（競泳・スクール水着）'},{jp:'電マ',zh:'☆电动棒（電マ）'},{jp:'バイブ',zh:'☆振动（バイブ）'},{jp:'ドラマ',zh:'戏剧性剧情'},
		{jp:'セクシー',zh:'€性感的'},{jp:'スレンダー',zh:'€苗条（スレンダー）'},
		{jp:'パンスト',zh:'㊛连袜裤（パンスト）'},
		
		{jp:'辱め',zh:'€羞辱（辱め）'},{jp:'アクション・格闘',zh:'€动作・格斗（アクション・格闘）'},
		{jp:'局部アップ',zh:'€局部特写（局部アップ）'},
		{jp:'ポルチオ',zh:'€ポルチオ'},
		{jp:'学園もの',zh:'㊭学校事件（学園もの）'},{jp:'エステ',zh:'㊭美容院（エステ）'},
		{jp:'ローション',zh:'€沐浴露（ローション）'},{jp:'デビュー作品',zh:'○出道作品（デビュー作品）'},{jp:'ドキュメンタリー',zh:'€纪录片（ドキュメンタリー）'},
		{jp:'ギリモザ',zh:'€马赛克（ギリモザ）'},{jp:'キャンペーン対象',zh:'€活动对象（キャンペーン対象）'},
		
      {jp:'DVDトースター',zh:'',txt:'DVD烧录'},
      
		{jp:'イメージビデオ',zh:'€影像视频(イメージビデオ)'}
      */
  
  /*==== DLSite ====*/
  {ja:'汁/液大量',en:'Lots of White Cream/Juices',zh:'汁液大量'},{ja:'褐色/日焼け',en:'Tanned Skin/Suntan',zh:'褐色皮肤/晒黑'},
  
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  {ja:'アニメ',en:'',zh:'动画'},
  {ja:'貧乳/微乳',en:'',zh:'贫乳'},{ja:'巨乳/爆乳',en:'',zh:'巨乳'},
  {ja:'売春/援交',en:'',zh:'援交'},{ja:'複数プレイ/乱交',en:'',zh:'轮奸/滥交'},{ja:'輪姦',en:'',zh:'轮奸'},{ja:'和姦',en:'',zh:'和奸'},{ja:'獣姦',en:'',zh:'兽奸'},{ja:'機械姦',en:'',zh:'机械奸'},{ja:'妊娠/孕ませ',en:'',zh:'怀孕'},
  {ja:'着物/和服',en:'',zh:'和服'},
  {ja:'フェラチオ',en:'',zh:'口交'},{ja:'イラマチオ',en:'Forced Oral/Irrumatio',zh:'强制口交'},{ja:'ごっくん/食ザー',en:'Cum Swallow',zh:'吞精液'},
  {ja:'屋外',en:'',zh:'室外'},
  {ja:'ロリ',en:'',zh:'萝莉'},
  {ja:'ストッキング',en:'',zh:'丝袜'},{ja:'メガネ',en:'',zh:'眼睛'},
  {ja:'萌え',en:'Moe',zh:'萌'},
  {ja:'男性/おやじ',en:'',zh:'老男人'},
  {ja:'処女',en:'',zh:'处女'},
  {ja:'学校/学園',en:'',zh:'学校'},{ja:'先輩/後輩',en:'',zh:'前辈/后辈'},{ja:'男性/おやじ',en:'',zh:'男性'},
  {ja:'むちむち',en:'',zh:'丰满'},
  
  {ja:'ポリゴン',en:'',zh:'多角形'},
  
  //外观
  //角色
  {ja:'ナース',en:'',zh:'护士'},{ja:'女教師',en:'Female Teacher',zh:'女教师'},
  //
  {ja:'盗撮',en:'',zh:'偷拍'},
  {ja:'強制/無理矢理',en:'',zh:'强迫'},{ja:'退廃/背徳/インモラル',en:'',zh:'放荡'},
  //
  {ja:'きせかえ',en:'',zh:'换装'},{ja:'スーツ',en:'',zh:'套装'},{ja:'ニーソックス',en:'',zh:'过膝袜'},
  //
  {ja:'ハーレム',en:'',zh:'后宫'},
  
  {ja:'ファンタジー',en:'',zh:'奇幻'},
  
  {ja:'マニアック',en:'Maniac',zh:'色情狂'},
  
  {ja:'スカトロ',en:'',zh:'粪便'},
  {ja:'強制/無理矢理',en:'',zh:'强迫'},
  {ja:'変身ヒロイン',en:'',zh:'女主角变身'},{ja:'陵辱',en:'',zh:'凌辱'},{ja:'ラブラブ/あまあま',en:'',zh:'卿卿我我'},{ja:'',en:'',zh:''},
  /*Caribbean*/
  {ja:'ギャル',en:'',zh:'少女'},
  {ja:'人気シリーズ',en:'',zh:'人气系列'},{ja:'ハード系',en:'',zh:'激烈系'},
  {ja:'ベスト/オムニバス',en:'',zh:'精选集锦'},
  /**/
  {ja:'調教',en:'',zh:'调教'},
  {ja:'初裏',en:'',zh:'首次无码'},
  {ja:'シックスナイン',en:'',zh:'69式'},{ja:'69',en:'',zh:'69式'},
  
  
  
  
  
  {ja:'カメラ目線・主観映像',en:'',zh:'主观镜头'},
  {ja:'カテゴリ一覧',en:'',zh:'分类列表'},{ja:'サンプル画像',en:'',zh:'样图'},{ja:'おススメ関連作品',en:'',zh:'相关作品'},{ja:'',en:'',zh:''},
  {ja:'企画物',en:'',zh:'产品计划'},
  {ja:'アヘ顔',en:"ahegao",zh:"啊嘿颜"},
  
  /*==== gachinco.com ====*/
  {ja:'素人娘',en:'',zh:'素人'},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  
  /*==== pacopacomama.com ====*/
  {ja:'生ハメ・生姦',en:'',zh:'不戴套'},
  /*场景*/
  {ja:'ビーチ',en:'',zh:'海滩'},
  
  
  /*体位*/
  {ja:'',en:'Missionary',zh:'传教士体位'},
  {ja:'騎乗位',en:'',zh:'骑乘位'},{ja:'騎乗後背位',en:'',zh:'背对骑乘位'},{ja:'顔面騎乗',en:'',zh:'骑在脸上'},{ja:'バック',en:'',zh:'后入式'},{ja:'マングリ返し',en:'',zh:'打桩机'},
  
  /*==== 人物 ====*/
  {ja:'OL・オフィスレディ',en:'',zh:'OL'},{ja:'看護婦',en:'',zh:'护士'},
  {ja:'お姉さん',en:'',zh:'姐姐'},{ja:'メイド',en:'',zh:'女仆'},{ja:'コンパニオン',en:'',zh:'礼仪小姐'},{ja:'花嫁・若妻',en:'',zh:'新娘子'},{ja:'キャバ嬢・風俗嬢',en:'',zh:'风俗娘'},
  {ja:'マニアックコスプレ',en:'',zh:'狂热的角色扮演'},{ja:'アイドル',en:'',zh:'偶像'},
  
  
  /*==== 发型 ====*/
  {ja:'ポニーテール',en:'',zh:'马尾辫'},{ja:'ツインテール',en:'',zh:'双马尾'},
  
  /*==== 服装类型 ====*/
  {ja:'ビキニ',en:'',zh:'比基尼'},{ja:'スクール水着',en:'',zh:'学校泳衣'},
  {ja:'セーラー服',en:'',zh:'水手服'},{ja:'網タイツ',en:'',zh:'网袜'},
  
  
  /*==== heyzo.com ====*/
  {ja:'風呂',en:'',zh:'洗澡'},{ja:'シャワー',en:'',zh:'淋浴'},{ja:'石鹸',en:'',zh:'肥皂'},{ja:'ローション',en:'',zh:'沐浴露'},{ja:'泡',en:'',zh:'泡沫'},{ja:'おもちゃ',en:'',zh:'玩具'},
  {ja:'関西弁',en:'',zh:'',txt:'关西方言'},
  {ja:'ぽっちゃり',en:'',zh:'丰满'},{ja:'ハメ撮り',en:'',zh:'POV视角'},{ja:'Iカップ',en:'',zh:'I罩杯'},
  {ja:'連続イキ',en:'',zh:'连续高潮'},
  /*==== JaPron ====*/
  {ja:'生中出し',en:'',zh:'中出'},
  {ja:'生姦・ゴム無し',en:'',zh:'不戴套'},
  {ja:'美女・美人',en:'',zh:'美女'},{ja:'美少女・カワイイ系',en:'',zh:'美少女'},
  
  {ja:'背面騎乗位',en:'',zh:'背面骑乘位'},{ja:'グラインド騎乗位',en:'',zh:'扭腰骑乘位'},
  {ja:'カラダが柔らかい',en:'',zh:'柔体'},{ja:'細身・スレンダー',en:'',zh:'苗条'},{ja:'美肌・美白',en:'',zh:'美肌'},
  {ja:'巨乳・爆乳・超乳',en:'',zh:'巨乳'},{ja:'美乳・素敵なオッパイ',en:'',zh:'美乳'},{ja:'美尻・ケツがいい',en:'',zh:'美臀'},
  {ja:'ロリ声',en:'',zh:'萝莉声'},
  {ja:'ボンテージ',en:'',zh:'奴役'},{ja:'ぶっかけ・輪姦',en:'',zh:'轮奸'},
  {ja:'巨大電マ責め',en:'',zh:'巨大电动棒'},{ja:'ローションプレイ',en:'',zh:'润滑液'},
  {ja:'完全無修正',en:'',zh:'无码'},
  
  {ja:'強烈ピストンバック',en:'',zh:'激烈的活塞运动'},
  
  
  {ja:'立ちバック',en:'',zh:'',txt:'站立作背景'},
  {ja:'サンプル動画上映中',en:'',zh:'',txt:'样片上映中'},{ja:'店長推薦作品',en:'',zh:'',txt:'店长推荐'},{ja:'3D ブルーレイ・ディスク',en:'',zh:'',txt:'3D蓝光光盘'},
  {ja:'',en:'',zh:''},
  /*===== bravoporn.com =====*/
  {ja:'',en:'Big Tits',zh:'大乳头'},{ja:'',en:'Small Tits',zh:'小乳头'},
  {ja:'',en:'Natural Tits',zh:'自然乳头'},
  {ja:'',en:'Big Cock',zh:'大鸡巴'},{ja:'',en:'Big Cocks',zh:'大鸡巴'},{ja:'',en:'Big Black Cock',zh:'大黑鸡巴'},{ja:'',en:'Ball Licking',zh:'舔睾丸'},
  
  {ja:'',en:'Shaved Pussy',zh:'剃毛'},
  {ja:'',en:'Creampie',zh:'中出'},{ja:'',en:'Cumshot',zh:'射精'},{ja:'',en:'Orgasm',zh:'性高潮'},
  {ja:'',en:'Nice Ass',zh:'美臀'},
  {ja:'アジアン',en:'Asian',zh:'亚洲人'},{ja:'',en:'Pornstars',zh:'色情影星'},
  {ja:'',en:'Teens',zh:'青少年'},
  {ja:'',en:'Vibrator',zh:'振动器'},{ja:'',en:'Oiled',zh:'涂油'},
  {ja:'',en:'Brunettes',zh:'黑发'},{ja:'',en:'Blondes',zh:'金发'},{ja:'',en:'Redhead',zh:'红头发'},
  {ja:'',en:'Pigtails',zh:'辫子'},{ja:'',en:'Black Butt',zh:'黑屁股'},
  {ja:'',en:'Glasses',zh:'眼镜'},{ja:'',en:'Miniskirt',zh:'迷你裙'},
  {ja:'',en:'',zh:''},
  {ja:'',en:'Couple',zh:'二人'},{ja:'',en:'Threesome',zh:'三人'},
  {ja:'',en:'Public',zh:'公共场合'},
  {ja:'',en:'Erotic',zh:'色情'},{ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  /*===== xhamster.com =====*/
  {ja:'',en:'Cum on Pussy',zh:'内射'},
  {ja:'',en:'Girlfriend',zh:'女朋友'},{ja:'',en:'My Whore',zh:'我的妓女'},
  {ja:'',en:'Little Big',zh:'有点大'},
  
  
  {ja:'',en:'Hairy',zh:'毛茸茸'},
  
  {ja:'',en:'Big Clits',zh:'大屁股'},{ja:'',en:'Upskirts',zh:'裙底风光'},{ja:'',en:'Squirting',zh:'喷射'},{ja:'',en:'Gaping',zh:'张开'},
  
  {ja:'',en:'Amateur',zh:'业余'},{ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  /*===== xvideos.com =====*/
  {ja:'',en:'bigtits',zh:'大乳头'},
  {ja:'',en:'taiwan',zh:'台湾'},{ja:'',en:'',zh:''},
  {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
  {ja:'',en:'wife',zh:'老婆'},
  {ja:'',en:'',zh:''},
  
  /*===== pornfun.com =====*/
  {ja:'',en:'cum in mouth',zh:'射精在嘴里'},{ja:'',en:'mouth fucking',zh:'口交'},
  {ja:'',en:'deepthroat',zh:'深喉'},
  {ja:'',en:'hot girl',zh:'辣妹'},
  {ja:'',en:'doggy style',zh:'【体位】狗交式'},
  {ja:'',en:'bathroom',zh:'浴室'},
  
  {ja:'',en:'homemade',zh:'自拍'},{ja:'',en:'black hair',zh:'黑发'},
  /*===== pornhub.com =====*/
  {ja:'洋アニメ',en:'Cartoon',zh:'卡通'},{ja:'年の差',en:'Old/Young',zh:'年龄差'},
  {ja:'女性向け',en:'For Women',zh:'女性向'},{ja:'女性に人気',en:'Popular With Women',zh:'受欢迎的女性'},
  //{ja:'',en:'Verified Amateurs',zh:'业余验证'}
  /*===== porntube.com =====*/
  {ja:'毛深い陰部',en:'Hairy pussy',zh:'毛茸茸的阴部'},
  {ja:'マスターベーション',en:'',zh:'自慰'},
  {ja:'パンティー',en:'',zh:'内裤'},
  {ja:'Big dick',en:'',zh:'大鸡巴'},
  {ja:'異人種間の',en:'Interracial',zh:'种族间'},
  
  
  {ja:'ライディング',en:'Riding',zh:'【体位】骑马式'},{ja:'小犬スタイル',en:'Doggystyle',zh:'【体位】狗交式'},
  {ja:'剃毛',en:'Shaved',zh:'剃毛'},
  {ja:'猫なめる',en:'Pussy licking',zh:'舔阴'},{ja:'スキニー',en:'Skinny',zh:'苗条'},
  {ja:'ティーンエイジャー',en:'Teenager',zh:'青少年'},{ja:'女の子女の子',en:'Girl on girl',zh:'百合'},{ja:'スペルマ·スワップ',en:'Cum swap',zh:'精液交换'},
  {ja:'ブルネット',en:'Brunette',zh:'褐发'},{ja:'噴出',en:'Squirt',zh:'喷出'},{ja:'お尻クソ',en:'Ass fucking',zh:'肛交'},
  {ja:'Sucking',en:'吸い',zh:'吸允'},
  
  {ja:'フェイシャル',en:'Facial',zh:'面部'},{ja:'',en:'',zh:''},
]
console.log(hosts);
if(HostCom[host]) host=HostCom[host];
console.log(host);
var conf = site[host];													//设置主域名
if(conf){	//检查是否为匹配的网站
  if(conf.PreProcess) conf.PreProcess(),conf = site[host];
  if(conf.ID) TitleMod(conf.ID(),conf.Product||null,conf.newTitle);	//网页标题追加番号
  if(conf.Tag) Tran(conf.Lang||conf.LangFn()||'en',conf.Tag);       //标签的语言
  if(conf.callback) conf.callback();
  if(conf.AD) conf.AD.remove();   //移除广告
}

switch(host){
  case "aventertainments.com":
  case "mediafreakcity.com":
  case "avfantasy.com":
    TitleMod($('.top-title').text().match(/\w+-\d+$/i).toString(),null,$('.top-title~h2').text());
    var webLang=$('meta[property="og:locale"]').attr('content').match(/(ja|en)/i)[0];
    Tran(webLang,$('#detailbox A'));					//关键字翻译
    Tran(webLang,$('SPAN.title'));			//标题翻译
    Tran(webLang,$('li.TabbedPanelsTab'));	//导航翻译
    $('#detailbox A').each(function(){
      $(this).text(' '+$(this).text());
    })
    break;
}

var MOD={
  ID:function(str){
    return str;
  }
}

function TitleMod(number,Product,newTitle){
  newTitle=newTitle||webTitle;
  Product=Product||'';
  document.title=Product+"【"+number+"】"+newTitle;
}

function newTitles(ID,title,newTitle){
  console.log(ID);
  document.title=webTitle="【"+ID+"】"+webTitle.replace(title,newTitle||'');
  return {
    Video:function(){
      webTitle;
    },
    File:function(number,Product){
      Product=Product||'';
      document.title=Product+webTitle;
    }
  }
}

function Tran(webLang,obj){
  console.log(webLang);
  if(webLang=='ja') {
    for(i=0;i<zhLang.length;i++){
      Tags[zhLang[i].ja]={"zh":zhLang[i].zh,"en":zhLang[i].en.toLowerCase()}
    }
  } else {
    for(var i=0;i<zhLang.length;i++){
      Tags[zhLang[i].en.toLowerCase()]={"zh":zhLang[i].zh,"ja":zhLang[i].ja}
    }
  }
  obj.each(function(){//如果不是数组
    var txt=(webLang=='en'?$(this).text().toLowerCase():$(this).text()).trim();
    console.log(txt,Tags[txt]);
    if(Tags[txt]) {
      $(this).attr('data-text',$(this).text().trim());			//设置对象自身的 title 为当前文本
      $(this).text(Tags[txt]['zh']);		//设置对象的文本为中文翻译
    }
  })

	/*
	var SiteTag=Site[host]['Tag'];
	for(var i=0;i<SiteTag.length;i++){
		var str=SiteTag[i].textContent.toLowerCase();
		if(Tags[str]) SiteTag[i].textContent=Tags[str]['zh'];
	}
	
	var Class=Site[host]['Class'];
	if(!Class){
		for(var i=0;i<Class.length;i++){
			var str=Class[i].textContent.toLowerCase();
			if(Tags[str]) Class[i].textContent=Tags[str]['zh'];
		}
	}
    */
}

function SearchRes(oNumber){
  var TorrentSite=[
    {
      'name':'JavLib',
      'urls':'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword='+oNumber
    },
    {
      'name':'AVDB',
      'urls':'https://www.avmoo.com/cn/search/'+oNumber
    },
    {
      'name':'GavBus',
      'urls':'https://www.gavbus5.com/video/'+oNumber+'.html'
    },
    {
      'name':'TorrentKitty',
      'urls':'https://www.torrentkitty.tv/search/'+oNumber
    },
    {
      'name':'BTSpread',
      'urls':'http://btso.pw/search/'+oNumber
    }
  ]

  // <!----------------- 浮动工具模块 Begin
  $('<div id="BTLinks" style="position:fixed;right:10px;bottom:10px;background:#e3e3e3;font-size:14px;padding:5px;color:#000">\
<input id="titleMod" type="checkbox" title="使用标题作为搜索关键字">\
<label for="titleMod">使用标题作为搜索关键字</label> | <a id="eside" style="cursor:pointer;">显示/隐藏侧边栏</a>\
<br>\
</div>').appendTo(document.body);

  for(var i in TorrentSite){
    $('<A>').attr({'href':TorrentSite[i].urls,'target':'blank'}).css({'padding-left':'5px','color':'#000'}).text(TorrentSite[i].name).appendTo($('#BTLinks'));
  }
  
  $('#titleMod').change(function(){
    var tagA=$('#BTLinks A');
    if(this.checked){
      for(i=0;i<tagA.length;i++){
        tagA[i].href=tagA[i].href.replace(oNumber,oTitle);
      }
    } else if(!this.checked) {
      for(i=0;i<tagA.length;i++){
        tagA[i].href=tagA[i].href.replace(encodeURIComponent(oTitle),product_id);
      }
    }
  });
}

function SotreDB(collectionName) {
  //如果没有 集合名，则使用默认 default
  collectionName = collectionName ? collectionName : 'default';
  //创建JSON缓存，如果缓存存在，则转为JSON，否则新建
  var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : {};

  return {
    add : function(name, value) {
      cache[name]=value;
      localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
    },
    del:function(name,value) {
      delete cache[name];
      localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
    },
    insert: function(name,obj){
      cache.push(obj);
      localStorage.setItem(collectionName, JSON.stringify(cache));
    },
    find : function(name) {
      return cache[name];
    }
  }
}

function watchVideoVisited(obj, IDRule, watchVideoID, ready){
  try{
    localStorage['webVistied'].removeItem();
    if(watchVideoID) var webVistied=SotreDB('webVistied').add('VideoID',watchVideoID);
  } catch(e){
    if(watchVideoID) var webVistied=SotreDB('webVistied').add('VideoID',watchVideoID);
  }
  var watchVideo={
    watch : function(){
      //*缩略图添加标记
      var thumbBlock=obj;
      console.log('预览图：',thumbBlock);
      thumbBlock.each(function(){
        //console.log('this',this);
        var thumbID=$(this).attr(IDRule)||eval(IDRule);
        //console.log('预览图处理规则：', thumbID, IDRule);
        //console.log($(this).css('width'),$(this).width(),$(this).css('width')||$(this).width());

        //console.log(eval(IDRule),SotreDB('Cut').find(thumbID));
        //console.log(thumbID,$(this).find('.watchVideoVisited'),SotreDB('Vistied').find(thumbID),this);
        if(SotreDB('Favorites').find(thumbID)&&$(this).find('.watchVideoVisited').length==0) $('<div class="watchVideoVisited"></div>').css({'width':$(this).width(),'height':$(this).height(),'background':'red'}).prependTo($(this));
        else if(SotreDB('Cut').find(thumbID)&&$(this).find('.watchVideoVisited').length==0) $('<div class="watchVideoVisited" style=""></div>').css({'width':$(this).width(),'height':$(this).height(),'background':'springgreen'}).prependTo($(this));
        else if(SotreDB('Vistied').find(thumbID)&&$(this).find('.watchVideoVisited').length==0) $('<div class="watchVideoVisited" style=""></div>').css({'width':$(this).width(),'height':$(this).height(),'background':'paleturquoise'}).prependTo($(this));
      });
    },
    listen : function(){
      window.addEventListener('storage',function(){
        var watchVideoID=SotreDB('webVistied').find('VideoID');
        var target=$('['+IDRule+'='+watchVideoID+']');
        var targetFind=target.find('.watchVideoVisited').length==0;
        console.log(watchVideoID,targetFind,target.find('.watchVideoVisited'),target.find('.watchVideoVisited').length);
        if(SotreDB('Favorites').find(watchVideoID)) {
          if(target.find('.watchVideoVisited').length>0) target.find('.watchVideoVisited').css({'background':'red'});
          else $('<div class="watchVideoVisited"></div>').css({'width':target.width(),'height':target.height(),'background':'red'}).prependTo(target);
        }
        else if(SotreDB('Cut').find(watchVideoID)&&targetFind) $('<div class="watchVideoVisited" style=""></div>').css({'width':target.width(),'height':target.height(),'background':'springgreen'}).prependTo(target);
        else if(SotreDB('Vistied').find(watchVideoID)&&targetFind) $('<div class="watchVideoVisited"></div>').css({'width':target.width(),'height':target.height(),'background':'paleturquoise'}).prependTo(target);
      },true);
    },
    init: function(){
      GM_addStyle('.watchVideoVisited{background:red;position:absolute;opacity:0.3;z-index:9;}');
      this.watch();
      this.listen();
    }
  }
  if(ready) $(document).ready(watchVideo.init);
  else watchVideo.init();
  /*
  function watchVideoVisited(){
    //*缩略图添加标记
    var thumbBlock=obj;
    console.log('预览图：',thumbBlock);
    thumbBlock.each(function(){
      var thumbID=eval(IDRule);
      //console.log('预览图处理规则：',IDRule);
      console.log($(this).css('width'),$(this).width(),$(this).css('width')||$(this).width())
      GM_addStyle('\
.thumbBlockFav{width:'+($(this).css('width')||$(this).width()+'px')+';height:'+$(this).height()+'px'+';background:red;position:absolute;opacity:0.3;z-index:9}\
.thumbBlockCut{width:'+($(this).css('width')||$(this).width()+'px')+';height:'+$(this).height()+'px'+';background:plum;position:absolute;opacity:0.3;z-index:9}\
.thumbBlockVistied{width:'+($(this).css('width')||$(this).width()+'px')+';height:'+$(this).height()+'px'+';background:paleturquoise;position:absolute;opacity:0.3;z-index:9}\
');
      //console.log(eval(IDRule),SotreDB('Cut').find(thumbID));
      console.log(thumbID,!!$(this).find('.thumbBlockVistied'),SotreDB('Vistied').find(thumbID),this);
      if(SotreDB('Favorites').find(thumbID)&&$(this).find('.thumbBlockVistied')) $('<div class="thumbBlockFav"></div>').prependTo($(this));
      else if(SotreDB('Cut').find(thumbID)&&$(this).find('.thumbBlockVistied')) $('<div class="thumbBlockCut"></div>').prependTo($(this));
      else if(SotreDB('Vistied').find(thumbID)&&$(this).find('.thumbBlockVistied')) $('<div class="thumbBlockVistied"></div>').prependTo($(this));
    });
  }*/
}

function getQueryString(name,url) {//筛选参数
  url=url?url.replace(/^.+\?/,''):location.search;	//网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
	var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
	var str = url.replace(/^\?/,'').match(reg);
	//console.log(str[0]);		//所筛选的完整参数串
	//console.log(str[1]);		//所筛选的参数名
	//console.log(str[2]);		//所筛选的参数值
	if (str != null) return unescape(str[2]);
	return null;
}

function setCookie(CookieName, Cookievalue,CookieDays) {//添加Cookies
	var str = CookieName + "=" + escape(Cookievalue);
	if(CookieDays> 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = CookieDays*24*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}

function addMObserver(selector, callback, Kill) {
  var watch = document.querySelector(selector);
  console.log(watch);

  if (!watch) {
    return;
  }
  var observer = new MutationObserver(function(mutations){
    var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
    if (nodeAdded) {
      console.log(mutations);
      callback(mutations);
      if(Kill) console.log('停止'+selector+'的监控'),observer.disconnect();
    }
  });
  observer.observe(watch, {childList: true, subtree: true});
}


function FavToolsFn(VideoID, obj, mode, tips){
  if(tips) var tips=$('<span id="H5PlayerTips"></span><span id="H5PlayerProgress"></span>');
  var Color={'Fav':'red','Cut':'springgreen','Visited':'#00edD5'};
  var Tools=$('<span id="Cut" style="cursor:pointer;font-size:16px;">✄</span> | <span id="Favorites" style="cursor:pointer;font-size:16px;">❤</span> | <span id="Visited" class="Visited" style="cursor:pointer;font-size:16px;">ↂ</span>');
  switch(mode) {
    case 'insBefore': $('<div id="FavTools">').text('收藏工具：').append(Tools).append(tips).insertBefore(obj);break;
    case 'insAfter': $('<div id="FavTools">').text('收藏工具：').append(Tools).append(tips).insertAfter(obj);break;
    default : Tools.appendTo(obj);
  }
  
      $('#Favorites').click(function(){
        if(SotreDB('Favorites').find(VideoID)) {
          SotreDB('Favorites').del(VideoID,true);
          $(this).css('color','');
        } else {
          SotreDB('Favorites').add(VideoID,true);
          $(this).css('color',Color['Fav']);
        }
      });
      $('#Cut').click(function(){
        if(SotreDB('Cut').find(VideoID)) {
          SotreDB('Cut').del(VideoID,true);
          $(this).css('color','');
        } else {
          SotreDB('Cut').add(VideoID,true);
          $(this).css('color',Color['Cut']);
        }
      });
      $('#Vistied').click(function(){
        if(SotreDB('Vistied').find(VideoID)) {
          SotreDB('Vistied').del(VideoID,true);
          $(this).RemoveClass('Visited');
        } else {
          SotreDB('Vistied').add(VideoID,true);
          $(this).addClass('Visited');
        }
      });
        SotreDB('Vistied').add(VideoID,true);
        $('#Visited').css('color',Color['Visited']);
        if(SotreDB('Favorites').find(VideoID)) $('#Favorites').css('color',Color['Fav']);
        else if(SotreDB('Cut').find(VideoID)) $('#Cut').css('color',Color['Cut']);
}

function VideoFn(src, poster, width, height, target, VideoID){
  var H5PlayerFn = {
    tips : function(txt) {
      $('#H5PlayerTips').text(txt);
    },
    progress : function(txt) {
      $('#H5PlayerProgress').html($('<A>').text(txt).css({'cursor':'pointer'}).click(function(){
        document.querySelector('#H5Player')=txt;
      }));
    },
    PlayerEvent : function(e, tips){
      console.log('PlayerTime', this, e, tips);
      //当前不是所记录的视频时，重新记录进度
      if(VideoID != SotreDB('PlayerTime').find('VideoID')){
        SotreDB('PlayerTime').add('VideoID', VideoID);
        SotreDB('PlayerTime').add('currentTime', e.currentTime);
        this.tips(tips+e.currentTime);
      }
    }
  }
  //生成视频对象
  $('<video>').attr({'id':'H5Player','poster':poster,'src':src,'controls':true,'autoplay':false,'preload':true,'width':width}).on({
    'dblclick' : function(e){this.paused ? this.play() : this.pause();},	//双击播放
    'click' : function(e){
      console.log('当前对象高度：',this.clientHeight , '鼠标点击对象的相对位置：', e.screenY);
      if(!this.paused && e.screenY<this.clientHeight*0.8) this.pause();//单击画面上部分80%的区域时，暂停画面
    },
    'keydown' : function(e){
      switch(e.keyCode){
        case '37' : this.currentTime-=3; H5PlayerFn.tips("后退：3秒"); break;
        case '39' : this.currentTime+=3; H5PlayerFn.tips("快进：3秒"); break;
        case '97' : this.width*=0.5;break;
        case '98' : this.width*=1;break;
        case '99' : this.width*=1.5;break;
        case '100' : this.width*=2;break;
      }
    }
  }).bind({
    'playing' : function(e){
      if(VideoID!= SotreDB('PlayerTime').find('VideoID')){
        SotreDB('PlayerTime').add('VideoID', VideoID);
        H5PlayerFn.tips('开始播放：');
      } else {
        H5PlayerFn.tips('存在上一次播放进度：');
      }
      SotreDB('PlayerTime').add('currentTime', this.currentTime);
      H5PlayerFn.progress(this.currentTime);
      var _this=this;
      var t=window.setInterval(function(){
        console.log(this);
        SotreDB('PlayerTime').add('currentTime', _this.currentTime);
        H5PlayerFn.progress(_this.currentTime);
      },5000);
      $(this).bind('pause', function(e){ //在播放暂停时
        SotreDB('PlayerTime').add('currentTime', this.currentTime);
        H5PlayerFn.tips('暂停：');
        H5PlayerFn.progress(this.currentTime);
        clearInterval(t);
      });
    },  //在媒体开始播放时触发
    'seeked' : function(e){
      SotreDB('PlayerTime').add('currentTime', this.currentTime);
      H5PlayerFn.tips('跳转到：');
      H5PlayerFn.progress(this.currentTime);
    },
    'loadeddata' : function(e){
      H5PlayerFn.tips('视频加载完毕！');
    },
    'error':function(e){console.log('error', e)}
  }).insertBefore(target);
  
  FavToolsFn(VideoID, '#H5Player', 'insAfter', true);
}