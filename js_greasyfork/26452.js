// ==UserScript==
// @name         VK Post Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide/delete repost,adpost.
// @author       You
// @match        *://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26452/VK%20Post%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/26452/VK%20Post%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
function testui(){
  var bod = document.querySelector("body");
  var butt = document.createElement ("div");
      butt.id = "NS_button"; butt.style.backgroundImage = "url('http://images.vfl.ru/ii/1484157821/888aeeea/15629285.png')";
      butt.style.zIndex = "2147483646";butt.style.top = "0";
      butt.style.width = "30px"; butt.style.height = "30px";butt.style.margin = "5px";butt.style.position = "fixed";butt.style.cursor ="pointer";
      bod.appendChild(butt);
    //
  var menu = document.createElement ("div");
      menu.style.display = 'none'; menu.id = "NS_menu";
      bod.appendChild(menu);
    //
  var ilayer = document.createElement ("div");ilayer.style.backgroundColor = "white";ilayer.style.top = "0";ilayer.style.borderRadius = "5px";
      ilayer.style.zIndex = "2147483646";ilayer.style.position = "fixed";ilayer.style.margin = "3.5%";ilayer.style.boxShadow = "5px 5px 20px";
      menu.appendChild(ilayer);
    //
  var tr1 = document.createElement ("div");tr1.innerHTML = "Repost :";tr1.style.margin = "3%";
      ilayer.appendChild(tr1);
    //
  var null0 = document.createElement ("div");//
      null0.style.display = "block";null0.style.height = "5px";
      ilayer.appendChild(null0);
    //
  var check1 = document.createElement("input");check1.type = "radio";check1.name = "rep";check1.value="1";check1.checked="checked";
      ilayer.appendChild(check1);
    //
  var t1 = document.createTextNode("No block");
      ilayer.appendChild(t1);
    //
  var check2 = document.createElement("input");check2.type = "radio";check2.name = "rep";check2.value="2";
      ilayer.appendChild(check2);
    //
  var t2 = document.createTextNode("Hide");
      ilayer.appendChild(t2);
    //
  var check3 = document.createElement("input");check3.type = "radio";check3.name = "rep";check3.value="3";
      ilayer.appendChild(check3);
    //
  var t3 = document.createTextNode("Delete");
      ilayer.appendChild(t3);
    //
  var null1 = document.createElement ("div");
      null1.style.display = "block";null1.style.height = "10px";
      ilayer.appendChild(null1);
    //
  var tr2 = document.createElement ("div");tr2.innerHTML = "Keywords for blocking posts :";tr2.style.margin = "3%";
      ilayer.appendChild(tr2);
    //
  var inp = document.createElement("TEXTAREA"); inp.id = "inp_text"; inp.cols = "35"; inp.rows = "10";// inp.style = "width: 95%;";
      inp.placeholder="Вулкан|Ruletka";inp.style.margin = "5px";
      ilayer.appendChild(inp);
    //
  var null2 = document.createElement ("div");null2.text="ssss";
      null2.style.display = "block";null2.style.height = "10px";
      ilayer.appendChild(null2);
    //
  var check4 = document.createElement("input");check4.type = "radio";check4.name = "res";check4.value="1";check4.checked="checked";
      ilayer.appendChild(check4);
    //
  var t4 = document.createTextNode("No block");
      ilayer.appendChild(t4);
    //
  var check5 = document.createElement("input");check5.type = "radio";check5.name = "res";check5.value="2";
      ilayer.appendChild(check5);
    //
  var t5 = document.createTextNode("Hide");
      ilayer.appendChild(t5);
    //
  var check6 = document.createElement("input");check6.type = "radio";check6.name = "res";check6.value="3";
      ilayer.appendChild(check6);
    //
  var t6 = document.createTextNode("Delete");
      ilayer.appendChild(t6);
    //
  var null3 = document.createElement ("div");
      null3.style.display = "block";null3.style.height = "10px";
      ilayer.appendChild(null3);
    //

        butt.onclick = function() {OClick();};
          function OClick() {
            if (menu.style.display !== 'none') {
              menu.style.display = 'none';
            }else {
              menu.style.display = 'block';
            }
          }
  var rep = document.getElementsByName('rep');
    for (var i = 0; i < rep.length; i++) {
      rep[i].onclick = function() {
        localStorage.setItem('RepostConfig', this.value);
      };
    }
    if(localStorage.getItem('RepostConfig')) {
      var RepostConfig = localStorage.getItem('RepostConfig');
        document.querySelector('input[name="rep"][value="' + RepostConfig + '"]').setAttribute('checked','checked');
      }
      var elements = document.querySelectorAll('#inp_text');
        function checkText() {}
          for (i=0; i<elements.length; i++) {
            (function(element) {
              var id = element.getAttribute('id');
              element.value = localStorage.getItem(id); // обязательно наличие у элементов id
              element.oninput = function() {
                localStorage.setItem(id, element.value);
                checkText();
              };
            })(elements[i]);
    }
  var res = document.getElementsByName('res');
    for (var j = 0; j < res.length; j++) {
      res[j].onclick = function() {
        localStorage.setItem('SpamConfig', this.value);
      };
    }
    if(localStorage.getItem('SpamConfig')) {
      var SpamConfig = localStorage.getItem('SpamConfig');
        document.querySelector('input[name="res"][value="' + SpamConfig + '"]').setAttribute('checked','checked');
      }
}
function NoReposts(){
  var hider = localStorage.getItem('RepostConfig');
  var rp = ( 'div[data-copy].post:not([isrepost])' ),
      rppc = ('._post_content'),
      pw = ('#public_wall'),
      fr = ('#feed_rows'),
      gw = ('#group_wall'),
      repostfilter = function (e){
        e.setAttribute('isrepost', 'y');
        if (hider == 2){
          var buttr = document.createElement ("div"); buttr.className = "wr_header";//feed_new_posts page_block
            buttr.innerHTML = "<strong>Repost! </strong>Click to show." ;
          	e.insertBefore(buttr, e.firstChild);
         	  var pc = e.querySelector(rppc);
          	pc.style.display = "none";
          	console.log("repost(s) hide");
          		buttr.onclick = function OClick() { //function() {OClick();};
                if (pc.style.display !== 'none') {
                  pc.style.display = 'none';
                  buttr.innerHTML = "<strong>Repost! </strong>Click to show." ;
                }else {
                  pc.style.display = 'block';
                  buttr.innerHTML = "<strong>Repost! </strong>Click to hide." ;
                }
              };
        } if (hider == 3) {
          //e.style.backgroundColor = "red";//для тестов
          e.innerHTML = '';
          console.log("repost(s) delete");
        } else {
          console.log("not blocked repost(s)");
        }
      };
  if(document.body.querySelector(pw) || document.body.querySelector(fr) || document.body.querySelector(gw)){
    for (var repost = document.body.querySelectorAll(rp), i = repost.length - 1; i >= 0; --i){
      repostfilter (repost[i]);
    }
  }
}
function NoSpam() {
  var hidet = localStorage.getItem('SpamConfig');
  var z,
    	trash = localStorage.getItem('inp_text') || '.,.,.,.,.,.,.,',
    	regexp = new RegExp('(' + ((trash).replace(/у/g,'(у|y)').replace(/е/g,'(е|e)').replace(/х/g,'(х|x)').replace(/а/g,'(а|a)').replace(/р/g,'(р|p)').replace(/о/g,'(о|o)').replace(/с/g,'(с|c)').replace(/ /g,'([\\s]+)')) + ')', 'i'),
    	wt = ('.wall_text'),
    	wp = ('div[data-post-id].post:not([isTextAd])'),
    	rppc = ('._post_content'),
      filter = function (el) {
        el.setAttribute('isTextAd', 'scaned');
        var text = el.querySelector(wt);
        if (text && (regexp.test(text.textContent))) {
          if (hidet == 2) {
            var buttad = document.createElement ("div"); buttad.className = "wr_header";//feed_new_posts page_block
                buttad.innerHTML = "<strong>Text Ad! </strong>Click to show." ;
            el.insertBefore(buttad, el.firstChild);
            var pc = el.querySelector(rppc);
            pc.style.display = "none";
            console.log("text Ad hide");
              buttad.onclick = function OClick() {
                if (pc.style.display !== 'none') {
                  pc.style.display = 'none';
                  buttad.innerHTML = "<strong>Text Ad! </strong>Click to show." ;
                }else {
                  pc.style.display = 'block';
                  buttad.innerHTML = "<strong>Text Ad! </strong>Click to hide." ;
                }
              };
          } if (hidet == 3) {
          	//el.style.backgroundColor = "green";//для тестов
          	el.innerHTML = '';
          	console.log("text Ad delete");
           } else {
            console.log("text Ad");
           }
        }
      };
    for (var links = document.body.querySelectorAll(wp), i = links.length - 1; i >= 0; --i) {
      filter (links[i]);
    }
}
testui();
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
    //console.log(mutation.type);
    //console.log("+elements");
    NoReposts();
    NoSpam();
	});
});
var observerConfig = {childList: true, subtree:true};
var targetNode = document.body;
observer.observe(targetNode, observerConfig);
})();