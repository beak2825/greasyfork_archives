// ==UserScript== 
// @name 	优酷vip播放器
// @namespace http://tampermonkey.net/ 
// @version 0.1 
// @description 	优酷vip去广告
// @author jswh 
// @match *://*.youku.com/* 
// @Grant none 
// @downloadURL https://update.greasyfork.org/scripts/31159/%E4%BC%98%E9%85%B7vip%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31159/%E4%BC%98%E9%85%B7vip%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==    


(function() {
    function newGuid() {
        var guid = '';
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)){
                guid +=  "-";
            }
        }
        return guid;
    }

    /*Direct Google*/
    

    function startFeaturesByConfig(){
        function videoFuck(){
            //PPTV
            var w = $('#pptv_playpage_box').width();
            var h = $('#pptv_playpage_box').height() - 50;
            //优酷
             var w1 = $('#playerBox').width();
            var h1 = $('#playerBox').height() - 50;
            
             //var w2 = $('#pptv_playpage_box').width();
            //var h2 = $('#pptv_playpage_box').height() - 50;
            var iframeSrc = 'http://www.0335haibo.com/tong.php?url='+ encodeURIComponent(location.href);//解析地址https://api.47ks.com/webcloud/?url=
            $('#pptv_playpage_box').html('<iframe src="'+iframeSrc+'" border="0" width="900px" height="500px"></iframe>');
             $('#module_basic_player').html('<iframe src="'+iframeSrc+'" border="0" width="'+w1+'" height="'+h1+'"></iframe>');
            // $('#tenvideo_player').html('<iframe src="'+iframeSrc+'" border="0" width="'+w2+'" height="'+h2+'"></iframe>');
          
            console.log(w+'。'+h);
        }

        if(true){
   
            //videoFuck();
             videoFuck();
        }

    }

    // View
    
    
    // 第1步
   // viewInit();
    // 第4步：功能启动
    var currentGuid = newGuid();
    startFeaturesByConfig();
    // Your code here...
})();