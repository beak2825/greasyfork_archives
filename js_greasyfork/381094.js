// ==UserScript==
// @name JAVBUS、javlib
// @namespace Violentmonkey Scripts
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @require https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js  
// @match https://www.javbus.com/*
// @match https://www.dmmsee.in/*
// @match https://www.dmmbus.com/*    
// @match http://www.javlibrary.com/*                             
// @version 1.0
// @description jav
// @grant none
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/381094/JAVBUS%E3%80%81javlib.user.js
// @updateURL https://update.greasyfork.org/scripts/381094/JAVBUS%E3%80%81javlib.meta.js
// ==/UserScript==
(function() {
	//icon图标
	var icon = GM_getResourceURL('icon');



/*
	GM_addStyle([
		'.min {width:66px;min-height: 233px;height:auto;cursor: pointer;}',
		'.container {width: 100%;float: left;}',
		'.col-md-3 {float: left;max-width: 260px;}',
		'.col-md-9 {width: inherit;}',
		'.footer {padding: 20px 0;background: #1d1a18;float: left;}',
		'#nong-table-new {margin: initial !important;important;color: #666 !important;font-size: 13px;text-align: center;background-color: #F2F2F2;float: left;}',
	].join(''));
*/
    var AVGLE_SEARCH_JAV_API_URL = 'https://api.avgle.com/v1/jav/';
    var page = 0;
    var limit = '?limit=2';
    var index =0;
    var a_array=[];
    var url='https://popjav.tv/?s=';
    var url2='https://www.javdoe.com/search/movie/';
      if ( $('.header').length) {
   var AVID = $('.header')[0].nextElementSibling.textContent;}
    var fanhao='' 
    //AVID = AVID[0];


	if(AVID.length){
//#########################################################################################################################################################################################
        $.getJSON(AVGLE_SEARCH_JAV_API_URL + encodeURIComponent(AVID) + '/' + page + limit, function (response) {
            console.log(response);
            if (response.success) {
                var videos = response.response.videos;
                if(response.response.total_videos>0){
                    console.log("番号输出:"+AVID);
                    var iframe='<iframe width="100%" id="avgoogle" height="500px" src='+videos[0].embedded_url+' frameborder="0" scrolling="auto" allowfullscreen></iframe>';
                    var btn='<button id="clickme">avgle源</button>'
                    $("div[id='star-div']").first().wrap('<div id="avgle"></div>');
                    $('div[class="col-md-3 info"]').append(btn)
                   $("#avgle").append(iframe);
                   $("#avgoogle").hide();
                  let check=false;
                   $('#clickme').click(function(){
                       if(check){
                             check=false;
                            $('#avgoogle').hide();
                         }else{
                             check=true;
                            $('#avgoogle').show();
                         }
                   
                      })
                }
            }
        });
//#########################################################################################################################################################################################
		//console.log("时间000000:"+ new Date().getTime());
	
//#########################################################################################################################################################################################
  url=url+AVID;
  url=encodeURI(url)
  
  GM_xmlhttpRequest({ //获取url列表
                method : "GET",           
                headers: {"origin": "https://popjav.tv"},
                url : url,
                onload : function (response) {
                    var reg0=/<a href="(https:\/\/popjav.tv\/\d+?\/.*?)" title="(.*?)" class="thumb">/;
                    let a=reg0.exec(response.responseText)
                    var suburl=a[1];
                    var title=a[2];
                GM_xmlhttpRequest({ //获取源
                method : "GET",           
                headers: {"origin": "https://popjav.tv"},
                url : suburl,
                  onload : function (response) {
                   let tit=/<title>.*?(\w+(?:-|_)\d+).*?<\/title>/.exec(response.responseText)
                   fanhao+='popjav:'+tit[1]+'<br><br>'
                    $('#mag-submit-show').text(tit[1])
                   var reg=/onclick="JavaScript:creatiframe\('(.*?)','(\w*)'\)">/g
                   var reg1=/onclick="JavaScript:creatiframe\('(.*?)','(\w*)'\)">/
                    let b = response.responseText.match(reg)
                    //console.log(b)
                    let str1='';
                    let arr1=[];
                    let iframe1='';
                    for(let i=0;i<b.length;i++){
                     let c=reg1.exec(b[i])
                      src=atob(c[1])
                    video=c[2]
                      
                      arr1.push(video)
                     str1+='<button id="'+video+'">'+video +'</button>'
                   //str1 += '<div  class="bs-example" style="float:left;margin :10px 15px 10px 5px"><button id='+video+' type="button" class="btn btn-primary" data-loading-text="Loading...">'+video+'</button></div>'
                    iframe1+='<iframe width="100%" id="popjav'+video+'" height="500px" style="display:none;margin:20px auto;" src='+src+' frameborder="0" scrolling="auto" allowfullscreen></iframe>'
                      console.log(src,video)
                    }

                  
                    $('div[class="col-md-3 info"]').append(str1).append("<br>")
                    $("div[id='star-div']").first().wrap('<div id="avgle"></div>');
                    $('#avgle').append(iframe1)
                    for(let i=0;i<arr1.length;i++){
                      $('#'+arr1[i]).click(function(){
                        for(let i=0;i<arr1.length;i++){
                          if(this.id!=arr1[i]){
                            $('#popjav'+arr1[i]).hide();
                          }
                        }
                        $('#popjav'+arr1[i]).show();
                      })

                    }

                    

                   
                                   
                }
             });                  
                }
             });
      
    
//#########################################################################################################################################################################################      
      
  url2=url2+AVID+'.html';
  url2=encodeURI(url2)
 // console.log(url2)
 
  GM_xmlhttpRequest({ //获取url列表
                method : "GET",           
                headers: {"origin": "https://www.javdoe.com"},
                url : url2,
                onload : function (response) {
                    var reg0=/<a\s+class="main-thumb"\s+href="(.*?)">/;
                    let a=reg0.exec(response.responseText)
                    temp_url='https://www.javdoe.com'+a[1]
                  //console.log(temp_url)
                  
                GM_xmlhttpRequest({ //获取源
                method : "GET",           
                headers: {"origin": "https://www.javdoe.com"},
                url : temp_url,
                  onload : function (response) {
                   let tit=/<title>.*?(\w+(?:-|_)\d+).*?<\/title>/.exec(response.responseText)
                   var reg1=/<iframe width="560" height="315" src="(.*?)" frameborder="0" allowfullscreen><\/iframe>/;
                    //console.log(b)
                    let str2='';
                    let arr2=[];
                    let iframe2='';
                    fanhao+='javdoe:'+tit[1]+'<br><br>'
                    $('#mag-submit-show').html(fanhao)
                     let c=reg1.exec(response.responseText)
                     src=c[1]
                      console.log()
                      arr2.push(src)
                     str2 ='<button id="btn2">javdeo</button>'
                   //str1 += '<div  class="bs-example" style="float:left;margin :10px 15px 10px 5px"><button id='+video+' type="button" class="btn btn-primary" data-loading-text="Loading...">'+video+'</button></div>'
                    iframe2 ='<iframe width="100%" id="javdoe" height="500px" style="display:none;margin:20px auto;" src='+src+' frameborder="0" scrolling="auto" allowfullscreen></iframe>'
                      //console.log(src)
                    
               
                    $('div[class="col-md-3 info"]').append(str2).append("<br>")
                    $("div[id='star-div']").first().wrap('<div id="avgle"></div>');
                    $('#avgle').append(iframe2)
                    let check=false;
                      $('#btn2').click(function(){
                         if(check){
                             check=false;
                            $('#javdoe').hide();
                         }else{
                             check=true;
                            $('#javdoe').show();
                         }    
                      })

                    

                    

                   
                                   
                }
             });               
                }
             });
 //######################################################################################################################################################################################### 
     
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    }
//######################################################################################################################################################################################### 
//######################################################################################################################################################################################### 
//javlib跳转
if(location.host=='www.javlibrary.com'){
  
  (function() {

    var AVID = "";
    AVID = $("title").text();
    var exp1 = /(\w)+(-|_)(\w)+/g;

    AVID = AVID.match(exp1);
    console.log(AVID)
    //AVID = AVID[0];
    to_url='https://www.javbus.com/'+AVID
  console.log(to_url)
var btn='<button id="clickme" style="width:15%;height:100%;cursor:pointer;margin:30px 0 0 80px;border-radius:7%;border:none;outline:none">开车</button>'
$('div[id="video_info"]').append(btn)
 $('#clickme').mousedown(function(){
   window.open(to_url)
 })
})();  
  
}
   
     

})();
