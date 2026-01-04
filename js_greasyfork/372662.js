// ==UserScript==
// @name Poshmark Quick Script
// @namespace capnpolska
// @description Quickly share to all and follow people
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js 
// @version      2.0.0
// @include https://poshmark.com/closet/*
// @include https://poshmark.com/news
// @include https://poshmark.com/user/*/followers
// @downloadURL https://update.greasyfork.org/scripts/372662/Poshmark%20Quick%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/372662/Poshmark%20Quick%20Script.meta.js
// ==/UserScript==
// @requirex       https://gist.githubusercontent.com/spiralx/413525dc2511e1577b8f/raw/a71dc56f0b20accc5c33d792436aece5499e91eb/cache.js
//$(window).load(function () { 
    $("a.share").each(function() {
      qsAppend($(this));    
    });

    $("a.follow-action").each(function() {
      fAppend($(this));    
    });
    $("a.show-post-details").each(function() {
      fAppend($(this));    
    });

$(window).load(function () { 
 if(window.location.href.indexOf("/followers") > -1) { 
   
   
   var f=0; var not_f=0; var fc=0;
  $("a[data-pa-name='follow_user']").each(function(){  
      if($(this).hasClass('f-hide')){
        f++; 
      }else{
        not_f++;
      }
       fc++;
  });
   var msg="not following "+not_f+" of "+fc;
   $("#qslog").prepend("<input type='button' value='AutoFollow' class='blue btn' id='autofollowbtn'>"+msg+"<BR>");
  $("#qslog").prepend("Autofollow Delay: <input type='textbox' id='Xdelay' value='4' size='2'> secs<BR>");
   
  $("#qslog").prepend("Autofollow Max: <input type='textbox' id='Xmax' value='100' size='2'> people<BR>");
   
document.getElementById('autofollowbtn').addEventListener('click', autofollow, false);
    }
  
  
  
  
  
 if(window.location.href.indexOf("/closet") > -1) { 
  $("#qslog").prepend("<input type='button' value='AutoShare' class='blue btn' id='autosharebtn'> Scroll down to where you want to start.<BR>");
  $("#qslog").prepend("Autoshare Delay: <input type='textbox' id='Sdelay' value='4' size='2'> secs<BR>");
   
  $("#qslog").prepend("Autoshare Max: <input type='textbox' id='Smax' value='200' size='2'> items<BR>");
   
  document.getElementById('autosharebtn').addEventListener('click', autoShareBigList, false);
 }
  
  
});










jQuery.fn.reverse = [].reverse;
var asc=0;
var sold=0;
var autosharing=0;
function autoShareBigList(){
  var c=0;    
  if($("#Sdelay").val()>=2){}else{xLog("invalid share delay.."); return;}
  if($("#Smax").val()>0){}else{xLog("invalid share max..");return;}
  
  if(autosharing){
    xLog("ALREADY AUTO SHARED","Reload page to share again"); return;
  }autosharing=1;
   
  
    $("a.capnshare").reverse().each(function() {
  
      //console.log("capn share id="+$(this).attr('id'));
      var listing_id=$(this).attr('id').replace("qs_","");
      //var user_id=$(this).parent().parent().find("h5 a").html();
      
      var e=$("#"+listing_id);
      var title=e.find(".title").html(); 
      if(!title){
        console.log("no title found for id="+listing_id);
        return;
      }
      
        c++;      
      if(e.find('i.sold-tag').html()){
        //console.log("already sold "+title);
        sold++;
      }else{     
          
        if(asc<$("#Smax").val()){
            asc++;
          var asc_local=asc;
          var tt=this;
          setTimeout(function(){
            var clickEvent  = document.createEvent ("HTMLEvents");
            clickEvent.initEvent ("click", true, true);
            tt.dispatchEvent (clickEvent);
            //console.log("share "+title); 
            xLog("AutoShare #"+asc_local+"/"+$("#Smax").val(),title+"<BR>"+c+" total ("+sold+" sold/skipped)");
          
          },$("#Sdelay").val()*(asc-1)*1000, asc_local,tt);
        }

          
        
      }
     
      
    });
}

















var afc=0;
var following=0;
var afc_scrolldowns=0;
var afc_active=0; var af_clicked=0;

function autofollow(){
  if(0){
     autoFollowBigList();
  }else{
    af_clicked=1;
    xLog("Gathering list of followers","Scrolling down...");
    //scroll down and trigger it
    $("html, body").animate({ scrollTop: $(document).height() }, 100);
    afc_scrolldowns++;
  }
}
function autoFollowBigList(){
  
  if($("#Xdelay").val()>=2){}else{xLog("invalid follow delay.."); return;}
  if($("#Xmax").val()>0){}else{xLog("invalid follow max..");return;}
  
  afc_active=1;
   // loop through 
  var c=0; 
  $("a[data-pa-name='follow_user']").each(function(){ 
  
      var user_id=$(this).parent().parent().find("h5 a").html();
      if(!user_id)return;
      if($(this).hasClass('f-hide')){
        //console.log("already follow "+user_id);
        following++;
      }else{
        c++;
            //cSet('following',following);
            //$(this).trigger("click");
           
          
        if(afc<$("#Xmax").val()){
        
            afc++;
          var afc_local=afc;
          var tt=this;
          setTimeout(function(){
            
          
            var clickEvent  = document.createEvent ("HTMLEvents");
            clickEvent.initEvent ("click", true, true);
            tt.dispatchEvent (clickEvent);
            //console.log("follow "+user_id); 
            xLog("AutoFollow #"+afc_local+"/"+$("#Xmax").val(),user_id+"<BR>"+c+" total ("+following+" following)");
          
          },$("#Xdelay").val()*(afc-1)*1000, afc_local,tt);
        }

        //wait for it to load.. then re-check list?
          
        
      }
     
      
    });
}

function onElementHeightChange(elm, callback){
    var lastHeight = elm.clientHeight, newHeight;
    (function run(){
        newHeight = elm.clientHeight;
        if( lastHeight != newHeight )
            callback();
        lastHeight = newHeight;

        if( elm.onElementHeightChangeTimer )
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}


onElementHeightChange(document.body, function(){
    if(af_clicked){
  
        if(afc_scrolldowns<=5){
          afc_scrolldowns++;
				  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        }else{
           //recheck list?          
          autoFollowBigList();
          /*
            $("a[data-pa-name='follow_user']").each(function(){
              console.log("follow="+$(this).parent().parent().find("h5 a").html());
            });*/
        }
    }
});

function fAppend(t){
  var user_id=$(t).parent().attr('user_id')?$(t).parent().attr('user_id'):$(t).parent().attr('actor_id'); 
  if(user_id==undefined)return false;
  if(null){//following[user_id]){
    $(t).parent().append('<a style="color:#41a6de;" onclick="alert(\'Cant quick unfollow.. go to users profile to unfollow\')" class="btn white">Quick Followed</a>');

  }else{
	  $(t).parent().append('<a style="color:white" onclick="fFollowed($(this),\''+user_id+'\');return false" class="auth-required btn blue qf_'+user_id+'" data-ajax="true" data-ajax-href="/user/'+user_id+'/follow_user" data-ajax-method="post" data-pa-name="follow_user" id="follow-user">Quick Follow?</a>');
  }
}
function fFollowed(t,user_id){
  var uname=$(t).parent().attr('data-uname');
  xLog("Quick Follow:","<a href='/closet/"+uname+"' target='_NEW'>"+uname+"</a>");
  $('.qf_'+user_id).hide();
  var following=cGet('following');
  following[user_id]=1;
  cSet('following',following);
}


function onElementInserted(containerSelector, elementSelector, callback) {
    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var elements = $(mutation.addedNodes).find(elementSelector);
                for (var i = 0, len = elements.length; i < len; i++) {
                    callback(elements[i]);
                }
            }
        });
    };
    var target = $(containerSelector)[0];
    var config = { childList: true, subtree: true };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(onMutationsObserved);    
    observer.observe(target, config);

}
onElementInserted('body', 'a.share', function(element) {
  qsAppend(element);
});
onElementInserted('body', 'a.follow-action', function(element) {
  fAppend(element);
});
onElementInserted('body', 'a.show-post-details', function(element) {
  fAppend(element);
});
  
$("body").prepend( "<div id='qslogheader' style='opacity:.5;position:fixed;left:2px;width:300px;max-height:400px;top:10%;background-color:black;color:white;overflow-y:scroll;z-index:1000'><a onclick='$(\"#qslog\").toggle();'><b>Cap'n Polska</b> v"+GM_info.script.version+"</a><BR><div id='qslog' style='font-size:11px'>Started.</div></div>");
  

  var party=$(".party-name").html();
  if(party){
   xLog("Found party:","<a href='/party/"+$("a.pm-party-share-link").attr('eventid')+"/' target='_NEW'>"+party+"</a>"); 
  }
  
function qsAppend(t){
  //if sold.. skip?
  
  var party=$(".party-name").html();
  if(party){
    var event_id=$("a.pm-party-share-link").attr('eventid');
   // console.log("party="+party+" html="+$("a.pm-party-share-link").html());
    //<a href="/listing/share?post_id=5b5c95fcdf0307268b760f41&amp;event_id=5bae97ab5098a0ec59181a28" class="pm-party-share-link grey" data-ajax-method="post" data-ajax="true" data-pa-name="share_poshmark_poshparty" eventid="5bae97ab5098a0ec59181a28" targeturl="/listing/share"><div class="share-wrapper-con"><div class="icon-con"><i class="icon party-white"></i></div><div class="party-info"><div class="share-title">To Party Happening Now</div><div class="party-name">Designer: Michael Kors, Coach, Cole Haan &amp; More Party</div></div></div></a>
     $(t).parent().append('<a id="qsp_'+$(t).attr('data-pa-attr-listing_id')+'" onclick="qsShared($(this),\''+$(t).attr('data-pa-attr-listing_id')+'\',\''+event_id+'\');return false" href="/listing/share?post_id='+$(t).attr('data-pa-attr-listing_id')+'&event_id='+event_id+'" eventid="'+event_id+'" class="pm-party-share-link  grey" data-ajax-method="post" data-ajax="true" data-pa-name="share_poshmark_poshparty" targeturl="/listing/share">Share&nbsp;Party!</a>&nbsp;');

  }
   $(t).parent().append('<a id="qs_'+$(t).attr('data-pa-attr-listing_id')+'" onclick="qsShared($(this),\''+$(t).attr('data-pa-attr-listing_id')+'\');return false" href="/listing/share?post_id='+$(t).attr('data-pa-attr-listing_id')+'" class="capnshare pm-followers-share-link grey" data-ajax-method="post" data-ajax="true" data-pa-name="share_poshmark" targeturl="/listing/share">Share&nbsp;All!</a>');
}

function qsShared(t,listing_id,event_id){  
  var e=$("#"+listing_id);
  var title=e.find(".title").html(); 
  if(event_id==undefined){
    $("#qs_"+listing_id).hide().attr('hidden',1);
    if($("#qsp_"+listing_id).attr("hidden") || $(".party-name").html()==undefined){
      e.parent().hide(); 
    }else{
      console.log("party is visible..");
    }
  }else{ 
    title+=" to Party: "+$(".party-name").html();
    $("#qsp_"+listing_id).hide().attr('hidden',1);
    if($("#qs_"+listing_id).attr("hidden")){
      e.parent().hide(); 
    }else{
      
      console.log("share all is visible...");
    }
  }
  xLog("Shared:","<a href='/listing/"+listing_id+"' target='_NEW'>"+title+"</a>");
}


function xLog(what,what2){
   $(".flash-message").html(what+"<BR><div style='color:white!important'>"+what2+"</div>");
  $(".flash-con").show();
  setTimeout(function(){ $(".flash-con").hide();} ,3000);
  $("#qslog").prepend(what+" "+what2+"<BR>");
} 
addJS_Node (null,"https://beta.fish-wrangler.com/js/gm-cache.js?v3");
addJS_Node (xLog);
addJS_Node (qsShared); 
addJS_Node (fFollowed); 

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}