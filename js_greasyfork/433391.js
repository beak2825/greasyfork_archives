// ==UserScript==
// @name        Rating Grab - 17lands.com
// @namespace   Douxt Scripts
// @match       https://www.17lands.com/tier_list/*
// @grant       none
// @version     1.0
// @author      非瑞克西亚食尸鬼
// @description 2021/7/16下午6:58:30  抓取17lands评分，在console打印出来
// @downloadURL https://update.greasyfork.org/scripts/433391/Rating%20Grab%20-%2017landscom.user.js
// @updateURL https://update.greasyfork.org/scripts/433391/Rating%20Grab%20-%2017landscom.meta.js
// ==/UserScript==
// @requrie     https://libs.baidu.com/jquery/2.0.0/jquery.min.js


(function(){
  'use strict';
  console.log('hello world!');
  //makeBox();
  
  //setInterval(loopCheck,500);
  
  setTimeout(grabRating,5000);
  
  $(document).keydown(function (event) {
    console.log(event.keyCode);
    let key = event.keyCode;
    if(key == 72){
      toggleHide();
    } else if(key == 82){
      grabRating();
    }
    else {
      setTimeout(startWork,200);
    }
    
  });
})();


  let nt=0,nf=0,nb=0;

  let hide = false;

  let legend = ['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F','备','玄'];

  function grabRating(){
    console.log('grabRating');
    
    
    let bucks = document.getElementsByClassName('tier_bucket');
    
    
    
    console.log('bucks length:',bucks.length);
    //console.log('children:',buck.children);
    
    let rating = {};
    
    for(let i = 0; i < bucks.length; i++){
      
      let buck = bucks[i];
      for(let j = 0; j< buck.children.length; j++){
        let text = buck.children[j].children[0].innerHTML;
        console.log('text:',text,i,legend[i%15]);
        rating[text] = {Rate:legend[i%15],Desc:''};
      }      
      
    }
    
    console.log('rating:',JSON.stringify(rating));
  }

  function toggleHide(){
      hide = !hide;
      if(hide){
        $(".rate").hide();
        $(".rate2").hide();
        //$(".ref").hide();
        $(".fix-top").hide();
      } else {
        $(".rate").show();
        $(".rate2").show(); 
        //$(".ref").show();
        $(".fix-top").show();
        startWork();
      }
  }

  function loopCheck(){
    
    //return;
    //console.log('loopCheck');
    let nnt = $("img.card_slot_2").length;
    let nnf = $("img.card_slot_2.front").length;
    let nnb = $("img.card_slot_2.behind").length;
    
    if(nnt!=nt || nnf!=nf || nnb!= nb){
      console.log('changed!refresh!');
      startWork();
    }
    
    nt = nnt;nf = nnf; nb = nnb;
    //console.log(nnt,nnf,nnb);
  }

  function makeMap(){
    for(var i = 0; i < reviews.length; i ++){
      map[reviews[i][0]] = i;
    }
    //console.log('map:',map);
    for(var i = 0; i < reviews2.length; i ++){
      map2[reviews2[i][0]] = i;
    }
    //console.log('map2:',map);
  }

  function makeBox(){
    let bd = $("body");
    let div = $('<div class="fix-top" id="review-box"><div class="zone">MTGAZone:<span id="zone-review"></span></div><div class="white"><div id="close">[关闭]</div></div></div>');
    div.appendTo(bd[0]);
    //console.log('bd:',bd);
    
    let hd = $("head");
    let st = $('<style>.pre{height:100px;}.t1{color:#0F0;}.t2{color:#83fa4d;}.t3{color:#a8fb4e;}.t4{color:#ddfc52;}.t5{color:#fbe14c;}.t6{color:#f19c38;}.t7{color:#ed5e2a;}.t8{color:#FF0000;}.tno{color:#444;}.rate{position:absolute;left:5px;bottom:5px;width:20px;height:20px;background-color:black;text-align:center;line-height:20px;z-index:9;}.rate2{position:absolute;right:5px;bottom:5px;width:20px;height:20px;background-color:black;text-align:center;line-height:20px;z-index:9;}.white{color:white;float:right;width:34%;margin:5px;position:relative;}.zone{color:white;float:left;width:64%;border:1px solid yellow;margin:5px;}.fix-top{position:fixed;top:0;left:0;right:0;background:#000;}.ref{color:white;border:1px solid yellow;}#close{position:absolute;right:5px;bottom:-20px;color:yellow;}</style>');
    st.appendTo(hd[0]);
    
    $("#close").mouseover(function(){
      //console.log('mouseOverReview');
      $("#review-box").hide();
    });
    
    let ref = $('<div class="ref"><div>鼠标移动到牌面上显示评价，按方向键←→翻页，按h键隐藏/显示评分内容。有异常可以尝试浏览器刷新。&nbsp;&nbsp; ——非瑞克西亚食尸鬼<br/><br/></div>参考资料:<div><a target="_blank" href="https://mp.weixin.qq.com/s/AKVi2V5_vI8nS779f0aCzQ">大白:【限制】2天到秘稀——AFR限制攻略</a></div><div><a target="_blank" href="https://mtgazone.com/innistrad-midnight-hunt-limited-set-review-white/">MTGAZone:Innistrad: Midnight Hunt Limited Set Review</a></div><br /><br /></div>');
    ref.appendTo(bd[0]);
    
    let url = window.location.href;
    if(url.indexOf("site_draft")!=-1){
      let pre = $('<div class="pre"></div>');
      pre.prependTo($("div#site_draft_app"));
    }
  }


  

  function startWork(){
    //console.log('startWork');
    
    $("div.card_slot_2").each(function(){
      
      if(hide){
        return;
      }
      let ch = $(this).children("img");
      //console.log('ch:',ch[0].alt);
      //ch[0].info = ch[0].alt + 'is good';
      let name = ch[0].alt;
      
      let children = $(this).children(".rate");
      //console.log('children:',children.length,children);
      let zrt = getZoneRating(name);
      //console.log(name,":",zrt);
      
      if(zrt){
        let cc = getColorClass(zrt);
        if(children.length==0){
          let div = $('<div class="rate"><span class="' + cc + '">' + zrt + '</span></div>');
          div.appendTo($(this));      
        } else {
          children.html('<span class="' + cc + '">' + zrt + '</span>');
        }        
      }
      
      let children2 = $(this).children(".rate2");
      //console.log('children:',children.length,children);
      let brt = getBaiRating(name);
      //console.log(name,":",brt);
      
      if(brt){
        let cc = getColorClass(brt);
        if(children2.length==0){
          let div = $('<div class="rate2"><span class="' + cc + '">' + brt + '</span></div>');
          div.appendTo($(this));      
        } else {
          children2.html('<span class="' + cc + '">' + brt + '</span>');;
        }        
      }
      

      $(this).mouseover(function(){
        console.log('mouse over:',name);
        
        if(hide){
          return;
        }
        
        let text = showReviewText(name);

        $("#review-box").show();

      });
    });
  }

  function showReviewText(name){
    
    if(name in reviews){
      let rv = reviews[name];
      //console.log('review:',rv);
      $("#zone-review").text('Rating: ' + rv["Rate"] + '. ' + name + '. ' + rv["Desc"]); 
    } else {
      $("#zone-review").text('no comment!'); 
    }
    
    // if(name in map2){
    //   let idx = map2[name];
    //   let rv = reviews2[idx];
    //   //console.log('review2:',rv);
    //   $("#bai-review").text('第' + rv[1] + '梯队' + '。' + rv[2] + '。' + rv[3]); 
    // } else {
    //   $("#bai-review").text('此牌有玄机！欲知详情请备好礼物与我面谈！'); 
    // }
    
  }

  function getZoneRating(name){
    if(name in reviews){
      let rv = reviews[name];
      return rv["Rate"];
    } else {
      return '?';
    }  
  }

  function getBaiRating(name){
    return '';
    if(name in map2){
      let idx = map2[name];
      let rv = reviews2[idx];
      return rv[1];
    } else {
      return '玄';
    }  
  }

  function getColorClass(rate){
    let cc;
    switch(rate){
        case "A+":
        case "A":
        case "5.0":
        case "4.5":
          cc = "t1";
          break;
        case "A-":
        case "B+":
        case "4.0":
          cc = "t2";
          break;
        case "B-":
        case "C+":
        case "3.5":
          cc = "t3";
          break;
        case "C":
        case "C-":
        case "3.0":
          cc = "t4";
          break;
        case "D+":
        case "2.5":
          cc = "t5";
          break;
        case "D":
        case "2.0":
          cc = "t6";
          break;
        case "D-":
        case "1.5":
          cc = "t7";
          break;
        case "F":
        case "F+":
        case "F-":
        case "1.0":
        case "0.5":
        case "0.0":
          cc = "t8";
          break;
        
        default:
          cc = "tno";
    }
    //console.log('ColorClass:',cc);
    
    return cc;
  }


  






