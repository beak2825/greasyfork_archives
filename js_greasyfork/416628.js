// ==UserScript==
// @name         bilibiliPlayComment
// @namespace    http://tampermonkey.net/
// @version      0.1.4 
// @description  提取B站评论只B站播放器右侧,实现评论和播放器同时观看，拒绝下拉!
// @author       shepen
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416628/bilibiliPlayComment.user.js
// @updateURL https://update.greasyfork.org/scripts/416628/bilibiliPlayComment.meta.js
// ==/UserScript==
if (!window.jQuery){
    var jq = document.createElement('script');
    jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
}

var _style = ".bilibiliPlayer-comment::-webkit-scrollbar { width: 0 !important } .bilibiliPlayer-comment { -ms-overflow-style: none; } .bilibiliPlayer-comment-item-child-wrapper::-webkit-scrollbar { width: 0 !important } .bilibiliPlayer-comment-item-child-wrapper { -ms-overflow-style: none; } .rotate { animation-name:myfirst;animation-duration:1s;animation-timing-function:ease;animation-delay:0s;animation-iteration-count:infinite;animation-direction:normal;animation-play-state:running;}  @keyframes myfirst{from{transform:rotate(0deg);-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg)}to{transform:rotate(-360deg);-ms-transform:rotate(-360deg);-moz-transform:rotate(-360deg);-webkit-transform:rotate(-360deg);-o-transform:rotate(-360deg)}}@-webkit-keyframes myfirst{from{transform:rotate(0deg);-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg)}to{transform:rotate(-360deg);-ms-transform:rotate(-360deg);-moz-transform:rotate(-360deg);-webkit-transform:rotate(-360deg);-o-transform:rotate(-360deg)}} .bilibiliPlayer-comment { overflow: -moz-scrollbars-none; } .bilibiliPlayer-comment-item-child-wrapper { overflow: -moz-scrollbars-none; }"

var style =  document.createElement('style');
style.innerHTML = _style;
document.getElementsByTagName('head')[0].appendChild(style);

var bilibiliComment = {
	b_video:'',
	b_video_pos : '',
	page:1,
	data:[],
	append:false,
    replyPages:[],
	init:function(){
	    this.getVideoAid();
	    this.getBilibilPlayer();
	},
	getBilibilPlayer:function(){
	   var bilibiliPlayer = document.getElementById('bilibili-player');
	   this.b_video_pos = {'top':bilibiliPlayer.offsetTop,'left':bilibiliPlayer.offsetLeft,'width':bilibiliPlayer.offsetWidth,'height':bilibiliPlayer.offsetHeight}
	   this.createCommentShowLayer();
	   this.showLoading();
       this.addRefreshLoaingAnimattion('add');
	   this.commentGet();
	   this.bindEventListen();
	},
	createCommentShowLayer:function(){
        var bodyHeight =  document.documentElement.clientHeight || document.body.clientHeight;
        var bodyWidth =  document.documentElement.clientWidth || document.body.clientWidth;
		var _commentLayerStyle = "width:{width}px; height:{height}px; position:absolute; z-index:99999;top:{top}px;left:{left}px;background:rgba(0,0,0,.8)";
		var width = bodyWidth-this.b_video_pos['width']-(this.b_video_pos['left']+50);
		_commentLayerStyle = _commentLayerStyle.replace('{height}',bodyHeight-this.b_video_pos['top']).replace('{top}',this.b_video_pos['top']).replace('{left}',this.b_video_pos['left']+this.b_video_pos['width']).replace('{width}',width);
		if (_commentLayer = document.getElementById('bilibiliCommentPlay')){
			document.body.removeChild(_commentLayer);
		}
		var _commentLayerHtml = '<div style="height:40px;color:#fff; line-height:40px; font-size:15px; padding-left:10px;">哔哩哔哩评论插件 <span style="font-size:13px; color:#ff6600;">共 <i id="comment_count">(-)</i>条 评论</span><div class="bilibiliPlayer-comment-opration" style="float:right; height:30px; padding-top:5px; padding-top:5px; margin-right:10px;"><a href="javascript:;"  id="refresh-comment"  title="刷新评论" style="width:20px; height:20px; display:inline-block; margin-right:5px; background:url(http://chuantu.xyz/t6/741/1605963079x992249049.png)"></a><a href="javascript:;" id="close-comment" title="关闭插件" style="width:20px; height:20px; display:inline-block; background:url(http://chuantu.xyz/t6/741/1605962908x-1224475230.png)"></a></div></div>';
		_commentLayerHtml += '<div class="bilibiliPlayer-comment"id="bilibiliPlayer-comment"style="width:90%; margin:0 auto;height:'+(bodyHeight-this.b_video_pos['top']-50)+'px;min-height:60px; overflow-y:scroll;"><div class="bilibiliPlayer-comment-item"style="height:auto; min-height:60px;"><div class="bilibiliPlayer-comment-no-data"style="height:40px; line-height:40px; color:#ccc;">暂无评论数据</div></div></div>'
        var _commentLayer = document.createElement('div');
        _commentLayer.style = _commentLayerStyle;
        _commentLayer.id = 'bilibiliCommentPlay';
        _commentLayer.innerHTML = _commentLayerHtml;
        document.body.appendChild(_commentLayer);
	},
	commentGet:function(){
		console.log(this.ajax);
		if (this.ajax){
			return;
		}
		this.ajax = true;
		var api_url = "https://yunxingyu.wojiong.com/querycomment.php";
		var _this = this;
		$.ajax({
			url:api_url,
			type:'get',
			data:{'aid':this.aid,page:this.page},
			dataType:"jsonp",
			success:function(res){
	            if (res['code']!=0){
	           	  _this.outMessage('api服务器错误');
	            }else{
            	  if (!res.data['replies']){
            		 this.ajax = true;
                     _this.addRefreshLoaingAnimattion('remove');
	       			 _this.outEmptyNoData();
            	  }else{
	                     _this.addRefreshLoaingAnimattion('remove');
	            	  	 _this.setCommentNum(res.data['page']['acount']);
		           	  	 _this.commentData = res.data['replies'];
		           	  	 _this.merge(res.data['replies']);
		           	  	 _this.renderHtml();
		           	 	 _this.bindScrollEvent();
	       				 _this.bindShowReply();
            	  }

	            }
			}
		})
	},
	commentReplyGet:function(obj){
		if (this.ajax){
			return;
		}
		this.ajax = true;
		var api_url = "https://yunxingyu.wojiong.com/queryreplycomment.php";
		var _this = this;
		$.ajax({
			url:api_url,
			type:'get',
			data:{'aid':this.aid,'rootid':obj['datarootid'],page:this.replyPages[obj['index']]['page']},
			dataType:"jsonp",
			success:function(res){
	            if (res['code']!=0){
	           	  _this.outMessage('api服务器错误');
	            }else{
            	  if (!res.data['replies']){
            		 this.ajax = true;
            	  }else{
                     _this.addRefreshLoaingAnimattion('remove');
	           	  	 _this.commentData = res.data['replies'];
	           	  	 _this.renderMoreComment(obj['index']);
	           	  	 _this.mergeToCommentChild(res.data['replies'],obj['datarootid']);
            	  }
	            }
			}
		})
	},
	merge:function(data){
     	for (var k in data){
     		this.data.push(data[k]);
     	}
	},
	mergeToCommentChild:function(data,val){
        var index = this.getIndexInArr('rpid',val);
        for (var k in data){
     		this.data[index]['replies'].push(data[k]);
     	}
	},
	outEmptyNoData:function(){
         var _loading = '<div class="data-empty" style="font-size:14px; color:#ccc;">暂时没有任何评论^-^ o）</div>';
        document.getElementById('bilibiliPlayer-comment').innerHTML = _loading;
	},
	addRefreshLoaingAnimattion:function(type){
        var refreshComment = document.getElementById('refresh-comment');
        if (type=='add'){
        	refreshComment.className = 'rotate';
        }else{
        	refreshComment.className = '';
        } 
	},
	bindEventListen:function(){
		var _this = this;
        $("#refresh-comment").click(function(){
        	_this.data = [];
        	_this.replyPages = [];
        	_this.page = 1;
	   		_this.commentGet();
            _this.addRefreshLoaingAnimattion('add');
        });
        $("#close-comment").click(function(){
            // 关闭评论
            _this.commentLayCtr();
            _this.appendCommentIcon();
        });
        window.onresize = function(){
        	console.log('窗口大小改变');
        	_this.reRenderPos();
        }
        var _wr = function(type) {
            var orig = history[type];
            return function() {
                var rv = orig.apply(this, arguments);
                var e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
        window.addEventListener('pushState', function(e) {
        	 window.location.reload();
        });
        window.addEventListener('replaceState', function(e) {
        });
	},
	bindScrollEvent:function(){
       var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
       var nScrollTop = 0;   //滚动到的当前位置
       var _this = this;
       var nDivHight = $("#bilibiliPlayer-comment").height();
       $("#bilibiliPlayer-comment").scroll(function(){
         nScrollHight = $(this)[0].scrollHeight;
         nScrollTop = $(this)[0].scrollTop;
         if(nScrollTop + nDivHight >= nScrollHight){;
            _this.page = _this.page+1;
            _this.append = true;
            _this.addRefreshLoaingAnimattion('add');
            _this.commentGet();
         }
		})
	},
	reRenderPos:function(){
         var bilibiliPlayer = document.getElementById('bilibili-player');
	        this.b_video_pos = {'top':bilibiliPlayer.offsetTop,'left':bilibiliPlayer.offsetLeft,'width':bilibiliPlayer.offsetWidth,'height':bilibiliPlayer.offsetHeight}
	        var bodyHeight =  document.documentElement.clientHeight || document.body.clientHeight;
	        var bodyWidth =  document.documentElement.clientWidth || document.body.clientWidth;
	        var width = bodyWidth-this.b_video_pos['width']-(this.b_video_pos['left']+50);
	        var bilibiliCommentPlay = document.getElementById('bilibiliCommentPlay');
	        bilibiliCommentPlay.style.left = this.b_video_pos['left']+this.b_video_pos['width']+'px';
	        bilibiliCommentPlay.style.top = this.b_video_pos['top']+'px';
	        bilibiliCommentPlay.style.width = width+'px';
	        bilibiliCommentPlay.style.height = bodyHeight-this.b_video_pos['top']+'px'
	},
	bindShowReply:function(){
        $('.no-read-show').click(function(){
        	 var datarootid = $(this).attr('data-root');
        	 var rcount_str = $(this).find('span').html();
        	 console.log(rcount_str);
        	 var rcount = parseInt(rcount_str.replace(/[^0-9]/ig,""));
        	 var replyPages  = bilibiliComment.replyPages;
        	 var _page_config_index = false;
        	 if (replyPages.length>0){
	        	 for (k in replyPages){
	                  if (replyPages[k] == datarootid){
	                  	  _page_config_index = k;
	                  }
	        	 }
                 if (!_page_config_index) {
						var _page_config = {'rootid':datarootid,'page':1,allrcount:rcount+2};
	        	 	 	bilibiliComment.replyPages.push(_page_config);
	        	 	 	_page_config_index = bilibiliComment.replyPages.length-1;
                 }else{
	        	     bilibiliComment.replyPages[_page_config_index]['page'] = replyPages[_page_config_index]['page']+=1;
                 }
        	 }else{
        	 	 var _page_config = {'rootid':datarootid,'page':1,allrcount:rcount+2};
        	 	 bilibiliComment.replyPages.push(_page_config);
        	 	 _page_config_index = bilibiliComment.replyPages.length-1;
        	 }
             bilibiliComment.parent = $(this).parent();
             console.log('加载更多评论')
        	 bilibiliComment.commentReplyGet({'index':_page_config_index,'datarootid':datarootid});
        })
	},
	commentLayCtr:function(display){
		var block = display?'block':'none';
        document.getElementById('bilibiliCommentPlay').style.display = block;
	},
	appendCommentIcon:function(){
         var bilibiliPlayerCommentIcon = document.createElement('div');
         bilibiliPlayerCommentIcon.style = 'width:47px; height:39px; background:#f7f9fa; border:1px solid #e5e9ef; border-radius:3px; padding-top:8px; cursor: pointer; position:fixed;top:75%; right:6px; ';
         bilibiliPlayerCommentIcon.innerHTML = "<div style='width:30px; height:30px; margin:0 auto; background:url(http://chuantu.xyz/t6/741/1606024283x1700338641.png)'></div>"
         bilibiliPlayerCommentIcon.title = '打开哔哩哔哩评论插件';
         document.body.appendChild(bilibiliPlayerCommentIcon);
         bilibiliPlayerCommentIcon.onclick = function(){
         	bilibiliComment.commentLayCtr(true);
         	document.body.removeChild(bilibiliPlayerCommentIcon);
         }
	},
	showLoading:function(){
        var _loading = '<div class="loading" style="font-size:14px; color:#ccc;">正在加载评论（^-^ o）</div>';
        document.getElementById('bilibiliPlayer-comment').innerHTML = _loading;
	},
	renderHtml:function(){
       var html = "";
       var data = this.commentData;
       for (var k in data){
       	   html += '<div class="bilibiliPlayer-comment-item" style="height:auto; min-height:60px; margin-bottom:10px">'
                html += '<div class="bilibiliPlayer-comment-item-main"><div style="width:60px; height:60px; border-radius: 30px; background:#ff6600;overflow:hidden; display:inline-block; margin-right:10px;"><img src="'+data[k]['member']['avatar']+'" style="width:100%";></div><div class="bilibiliPlayer-comment-item-content"style="height:auto;  vertical-align: top; width:70%; display:inline-block;"><div class="user-name"style="font-size:14px;height:25px; line-height:25px;color:#ccc;">'+data[k]['member']['uname']+'</div><div class="bilibili-comment-con"style="padding:5px; color:#eee; padding-left:0;">'+data[k]['content']['message']+'</div></div></div>';
                if (data[k]['replies']){
                	var dataLen = data[k]['replies'].length>2?2:data[k]['replies'].length;
                	html += '<div class="bilibiliPlayer-comment-item-child-wrapper" style="position:relative; max-height:400px; overflow-y:scroll;">'
                    for (var i = 0; i < dataLen; i++) {
                      	 html += '<div class="bilibiliPlayer-comment-item-child"style="padding-left:60px"><div style="width:40px; height:40px; border-radius: 30px; background:#ff6600;overflow:hidden; display:inline-block; margin-right:10px;"><img src="'+data[k]['replies'][i]['member']['avatar']+'"style="width:100%";></div><div class="bilibiliPlayer-comment-item-content"style="height:auto;  vertical-align: top; width:70%; display:inline-block;"><div class="user-name"style="font-size:14px;height:20px; line-height:20px;color:#ccc;">'+data[k]['replies'][i]['member']['uname']+'</div><div class="bilibili-comment-con"style="padding:2px; color:#eee; padding-left:0;">'+data[k]['replies'][i]['content']['message']+'</div></div></div>';
                    }
                    if (data[k]['replies'].length>2){
                    	html+= '<div class="no-read-show" style="position:absolute; bottom:5px; right:10px; cursor:pointer; color:#ccc;" data-root="'+data[k]['rpid']+'">剩余<span style="color:#00CCCC;">'+(data[k]['rcount']-2)+'</span>条未看</div>' 
                    }
                    html += "</div>";
                }
       	   html += '</div>';
       };
       if (bilibiliComment.append){
       	 document.getElementById('bilibiliPlayer-comment').innerHTML += html;;
       }else{
         document.getElementById('bilibiliPlayer-comment').innerHTML = html;
       }
       bilibiliComment.ajax = false;
	},
	renderMoreComment:function(index){
       var data = this.commentData;
       console.log(this.replyPages);
       var html = '';
       for (var k in data) {
            html += '<div class="bilibiliPlayer-comment-item-child"style="padding-left:60px"><div style="width:40px; height:40px; border-radius: 30px; background:#ff6600;overflow:hidden; display:inline-block; margin-right:10px;"><img src="'+data[k]['member']['avatar']+'"style="width:100%";></div><div class="bilibiliPlayer-comment-item-content"style="height:auto;  vertical-align: top; width:70%; display:inline-block;"><div class="user-name"style="font-size:14px;height:20px; line-height:20px;color:#ccc;">'+data[k]['member']['uname']+'</div><div class="bilibili-comment-con"style="padding:2px; color:#eee; padding-left:0;">'+data[k]['content']['message']+'</div></div></div>';
            if (this.replyPages[index]['allrcount']>this.replyPages[index]['page']*data.length){
            	 html+= '<div class="no-read-show" style="position:absolute; bottom:5px; right:10px; cursor:pointer; color:#ccc;" data-root="'+data[k]['rpid']+'">剩余<span style="color:#00CCCC;">'+(this.replyPages[index]['allrcount']-this.replyPages[index]['page']*data.length)+'</span>条未看</div>' 
            }
       }
        bilibiliComment.parent.html(html);  
        bilibiliComment.ajax = false;
	},
	getIndexInArr:function(key,val){
       for (var i = 0; i < this.data.length; i++) {
       	   if (this.data[i][key]==val){
       	   	   return i;
       	   }
       }
	},
	setCommentNum:function(num){
       document.getElementById('comment_count').innerHTML = num;
	},
	getVideoAid:function(){
		this.aid = window.aid;
		console.log(this);
	}
}
window.onload = function(){
   console.log('bilibiliPlayComment 已加载');
   bilibiliComment.init();
}

