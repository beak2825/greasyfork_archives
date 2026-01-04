// ==UserScript==
// @name         Emery店查查
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.dianchacha.com/item/keyword/index/iid/*
// @exclude      http://www.dev/Show-Site-All-UserJS/ui.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377445/Emery%E5%BA%97%E6%9F%A5%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/377445/Emery%E5%BA%97%E6%9F%A5%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 店查查
    console.log('Emery 店查查你好哈')
    var $ = window.$ ;
    function getCurrentPageId(){ // 获取当前页
        var current = $('.ui-pager li span')
        if( current && current.length > 0){
            var ids = current[0].innerText.trim()
            return ids;
        }
        return false
    }
    function getNextPageHref(ids){
        var nextpageId =( parseInt(ids.trim()) +1 ).toString();
        // parseInt(li.innerText.trim())
        var links = $('.ui-pager li a');
        var i = 0 ;
        while( i< links.length){
            var li = links[i];
            if( li && typeof(li.innerText) == "string" && li.innerText.trim() == nextpageId ){
                if( typeof(li.href) == "string" && li.href.length > 10 ){
                    console.log( li.href);
                    return li.href;
                }
            }
            //console.log(i, links[i])
            i=i+1
        }
        return false ;
    }

    // 获取下一个tab的地址
    function getNextTabHref(){
        var tabs = $('.item-keyword-tabs a');
        for (var i =0 ;i< tabs.length;i++){
            var li = tabs[i]
            if( li.getAttribute('class') == "active" ){
                // 找到当前的tab
                if( i+1 <tabs.length){ //找到下一个tab
                    li = tabs[i+1]
                    if( typeof(li.href)=="string" && li.href.length> 10 ){
                        return li.href
                    }

                }

            }
            console.log(i,' ', tabs[i])

        }
        return false;

    }

    //
    function getKeywordData(){
        var rs = $('.vip-con table tbody tr') ;
        var i = 0;
        var keywordArray = [];
        while(i < rs.length ){
            if(typeof(rs[i].querySelectorAll)!="function" ){
                continue;
            }
            var b = rs[i].querySelectorAll('td');
            if( typeof(b)!="object" || b.length <2 ){
                continue;
            }
            var keyword = b[1].innerText.trim();
            keywordArray.push(keyword)

            var idx = b[0].innerText
            var rank = b[2].innerText
            console.log(idx,' ', keyword , ' ',rank )
            // console.log(i,' ', rs[i])
            i = i+1;

        }
        return keywordArray;

    }
    // keywordArray = getKeywordData()
    window.getKeywordData = getKeywordData




    function goNextPage(){
        var ids = getCurrentPageId() ;
        if( ids ){
            var url = getNextPageHref(ids) ;
            if( url ){
                // 跳转到下一页
                console.log('下页为',url)

                return;

            }
        }

        // 标记为已经做了
        console.log('只有当前页')
        // 准备调到下一个tab了
        var nextTab = getNextTabHref();
        if( nextTab ){
            console.log('下一个tab为',nextTab)
        }else{
            console.log('已经没有下一个tab了')
        }


    }

    function goNextPageUrl(){
        var ids = getCurrentPageId() ;
        if( ids ){
            var url = getNextPageHref(ids) ;
            if( url ){
                // 跳转到下一页
                console.log('下页为',url)

                return url;

            }
        }

        // 标记为已经做了
        console.log('只有当前页')
        // 准备调到下一个tab了
        var nextTab = getNextTabHref();
        if( nextTab ){
            console.log('下一个tab为',nextTab)
        }else{
            console.log('已经没有下一个tab了')
        }
        return nextTab ;
    }
    window.goNextPageUrl = goNextPageUrl

    function getPostDataParam(){

        var iid = window.location.pathname.split('index/iid/')[1];
        iid = iid.replace('/','');

        var urlx = new URL(window.location.href);
        var p = urlx.searchParams.get("p");
        var keywordArray = getKeywordData();

        var data ={
            'iid': iid,
            'p': p,
            'keywordArray': keywordArray
        }
        return data ;

    }


    function askForTask(urlAskForTask,callback){
        //var urlAskForTask = 'https://3000mac.ap.com/item_api/askForTask'
        var info = getItemInfo()
        $.post(urlAskForTask, info, function(result){
            console.log(result )
            callback(result)
        });
    }

    function getItemInfo(){
        var iid = window.location.pathname.split('index/iid/')[1];
        iid = iid.replace('/','');
        var info = {'iid': iid}

        var lis = $('.item-info-r li')
        if( lis && lis.length > 0 ){
            var title = lis[0].innerText.replace('：','').replace('宝贝名称','').trim()
            info.title= title
        }

        var ax = $('.item-info-r li .item-price')
        if( ax && ax.length > 0 ){
            var price = ax[0].innerText.replace('￥','').trim()
            info.price = price
        }

        return info
    }

    function TaskStatus(){
    }

    TaskStatus.prototype = {
      // 开始任务
      'start': function(){
        //start(){
        localStorage.setItem('doingTaskStatus','DoingNow')
      },
      // 结束任务
      //finished(){
      'finished': function(){
        localStorage.setItem('doingTaskStatus','Finshed')
      },

      //isNewTask(){
      'isNewTask': function(){
        var s = localStorage.getItem('doingTaskStatus');
        if( s == 'DoingNow' ){
          return false;
        }
        return true;
      }

    }
    /**
     * [HttpChat0 description]

     var task = new TaskStatus()
     // 如果是新任务则上传item的信息
     task.isNewTask()
     task.start()
     task.isNewTask()
     task.finished()
     task.isNewTask()
     */


    function HttpChat0(baseUrl) {

        this.urlQueryIsDug ='https://3000mac.ap.com/item_api/isDug'
        this.urlAskForTask = 'https://3000mac.ap.com/item_api/askForTask'
        this.urlFinishedTask = 'https://3000mac.ap.com/item_api/finishedTask'
        this.urlAddKeyword = 'https://3000mac.ap.com/item_api/addKeyword'

    }
    function HttpChat(baseUrl) {
        // baseUrl = 'https://3000mac.ap.com'
        this.urlQueryIsDug =baseUrl +'/item_api/isDug'
        this.urlAskForTask = baseUrl +'/item_api/askForTask'
        this.urlFinishedTask = baseUrl +'/item_api/finishedTask'
        this.urlAddKeyword = baseUrl +'/item_api/addKeyword'
        this.urlGetTask = baseUrl +'/item_api/getTask'


        this.taskStatus = new TaskStatus() ;//查看任务状态
    }
    HttpChat.prototype = {

        'hello': function(){
            return '你好';
        },

        // 查询是否已经有此商品
        //isExist(callback){// isExist(callback){
        'isExist':   function(callback){
            var iid = window.location.pathname.split('index/iid/')[1];
            iid = iid.replace('/','');
            var urlQueryIsDug = this.urlQueryIsDug+ '?iid='+iid

            var urlAskForTask = this.urlAskForTask ;
            // var urlQueryIsDug = 'https://3000mac.ap.com/item_api/isDug?iid='+iid
            $.get(urlQueryIsDug, function(result){
                // 'FALSE' 才需要提取数据
                console.log(result )
                if( result == 'FALSE' ){
                    askForTask(urlAskForTask,callback);
                }else{
                    callback('无需爬数据，等会再检测看看是否有新任务');
                }
            });
        },

        'getTask':   function(callback){
            $.get(this.urlGetTask, function(iid){
                // 'FALSE' 才需要提取数据
                console.log(iid );
                if( iid !== '' ){
                  var url = 'https://www.dianchacha.com/item/keyword/index/iid/'+iid;
                  callback( url );
                  // https://www.dianchacha.com/item/keyword/index/iid/548748941356
                    //askForTask(urlAskForTask,callback)
                }

            });
        },


        // 当完成任务的时候
        'sayFinished': function(){
            //sayFinished(){ // sayFinished(){
            //var urlFinishedTask = 'https://3000mac.ap.com/item_api/finishedTask'
            var urlFinishedTask = this.urlFinishedTask;
            var info = getItemInfo();
            $.post(urlFinishedTask, info, function(result){
                console.log('sayFinished服务器返回的结果',result );
            });
        },

        'crawKeywordData': function(){
            //craw_keyword_data(){
            //var urlAddKeyword = 'https://3000mac.ap.com/item_api/addKeyword'
            var urlAddKeyword = this.urlAddKeyword;
            var postData = getPostDataParam();
            console.log(' 当前页的关键词列表 postData', postData);
            $.post(urlAddKeyword, postData, function(result){
                console.log(result );
            });
        },


    };

    HttpChat.prototype.doTheWork = function() {
      this.crawKeywordData();
      var url = goNextPageUrl(); // 准备跳转
      if( url ){
        console.log('即将跳转到新的网址',url);
        window.location.href = url ;
      }else{
        this.taskStatus.finished() ;
        this.sayFinished();//在服务器上声明
      }
    };

    function setTimeoutFuncArg(callback,arg){
      console.log('执行',arg.title , arg);
      if( typeof(callback) != "function"){
          console.log('callback 不是函数！！',callback);
          return;
      }
      callback(arg);
      arg.n = arg.n+1;
      setTimeout( setTimeoutFuncArg,arg.time, callback,arg);
    }
    window.setTimeoutFuncArg = setTimeoutFuncArg;

    function onGetTask(arg){
      var urlGetTask = arg.url;
      if( urlGetTask === null){
        console.log('网址为空',arg);
        return;
      }

      $.get(urlGetTask, function(iid){
          // 'FALSE' 才需要提取数据
          console.log(iid );
          if( iid !== '' ){
            var url = 'https://www.dianchacha.com/item/keyword/index/iid/'+iid;

            // https://www.dianchacha.com/item/keyword/index/iid/548748941356
              //askForTask(urlAskForTask,callback)
          }

      });
    }
    window.onGetTask = onGetTask;


    HttpChat.prototype.checkNewWork = function() {

      // 检测是否有新任务。
      console.log('检测新任务 checkNewWork');
      //setTimeout( this.checkNewWork , 1000 );// 五分钟检测一次
      var arg = {'time': 5000,'n': 0,'title': 'checkNewWork定时任务',
      'url': this.urlGetTask};
      setTimeoutFuncArg(onGetTask,arg);

    };

    HttpChat.prototype.onLoad = function() {
      if( !this.taskStatus.isNewTask() ){
        //如果不是新任务，那么直接上传数据
        console.log('不是新任务，直接上传数据');
        this.doTheWork();
        return ;
      }
      console.log('当前无任务，需要检测是否有新任务');

      // 如果是新任务。
      // https://www.dianchacha.com/item/keyword/index/iid/548748941356
      // 没有尾巴网址
      if(location.search !== ''){// 不需要上报消息
        console.log('location.search=',location.search,'不需要上报消息');
        // 检测是否有任务
        setTimeout(this.checkNewWork,100);
        return;
      }
      console.log('【申请任务】需要检测当前任务item是否已经做过了');

      var task = this.taskStatus ;
      var that = this ;


      // 申请任务
      this.isExist(function(msg){
        console.log('申请开始任务 结果消息 msg：',msg);
        if(msg == 'OK'){ //
          task.start();
          that.doTheWork() ;
          console.log('当前任务无人做，需要开始做');
          return ;
        }
      });

      // 检测是否有任务
      setTimeout(this.checkNewWork,100);
    };

    window.HttpChat = HttpChat;


    //////////////////


    var baseUrl='https://3000mac.ap.com';
    var hw = new HttpChat(baseUrl);
    hw.onLoad();
    window.hw =hw;


    function myhi(n){
      console.log('你好哈',n);
      if( n >0){
        setTimeout( myhi,100, n -1 );
      }
    }
    window.myhi = myhi;


    //myhiArg({'n':5})



    //var postData = getPostDataParam();
    //console.log(' 当前页的关键词列表 postData', postData);
    //window.postData = postData;


    //goNextPage();

    // Your code here...
})();
