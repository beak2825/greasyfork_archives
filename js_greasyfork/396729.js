// ==UserScript==
// @name           Naver Cafe kbass Blacklist Filter
// @namespace      http://www.-----.--.kr/
// @author         iamjucy9@gmail.com
// @include        https://cafe.naver.com/kbass*
// @include        http://cafe.naver.com/kbass*
// @run-at         document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @description    Naver Cafe kbass Blacklist Filtering

// @version 0.0.1.20200222084234
// @downloadURL https://update.greasyfork.org/scripts/396729/Naver%20Cafe%20kbass%20Blacklist%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/396729/Naver%20Cafe%20kbass%20Blacklist%20Filter.meta.js
// ==/UserScript==

function setBlackList(){
  

  var listBlack = "terox,id1,id2,id3,id4";				//차단할 id목록	,로 구분
	if(!listBlack) {
		return;
	}

  listBlack = listBlack.replace(' ','');
  var blockedID = listBlack.split(',');
  
  window.localStorage.setItem("blockedID", listBlack);
  //var blockedID = window.localStorage.getItem("blockedID").split(',');		//아직 사용 안함
  
  //alert ( blockedID.length);



	//var x = $('cafe_main');
	var x = document.getElementById('cafe_main');  
  
 	var y = (x.contentWindow || x.contentDocument);
  if (y.document) y = y.document;

  var article_bd = y.querySelectorAll('.article-board')[1];
  //alert('------3-----');
  if ( article_bd ){
    //alert('------4-----');
    var articlelist = article_bd.querySelector('table > tbody');
    //alert('------5-----');

    var ListInfo = [];
    if (articlelist)  {
      //alert('------6-----');
      for (i = 0; i < articlelist.childElementCount; i++) {
	      //alert(articlelist.childElementCount);
        
        var p_memberid, p_nickname, p_title, p_href, articlelistindex;
        var nicka = articlelist.children[i].querySelector('.p-nick a');
        if (nicka == null) continue;
        //alert(nicka);
          
        var str = nicka.getAttribute("onclick").split(',');
        //alert(str);

        p_memberid = str[1].trim().replace(/\'|\"/g,'');
        //alert(p_memberid);
        
        p_nickname = str[3].trim().replace(/\'|\"/g,'');
        //alert(p_nickname);

        p_titleElem = articlelist.children[i].querySelector('div.board-list > div.inner_list > a');
        p_title = p_titleElem.text;
        p_title_Head = "";
        if( p_titleElem.childElementCount != 0 ){						//헤드가 있으면 일단 헤드 제거 ( 헤드와 제목 사이에 공백을 제거 위해 )
        	p_title_Head = p_titleElem.children[0].innerText;
          p_title_Head = p_title_Head.trim();
          p_title = p_title.replace( p_title_Head, '');			//일단 헤드 제거
        }
        //p_title = p_title.replace( /(<([^>]+)>)/ig, '' );
        p_title = p_title.trim();														//공백제거
        //p_title = p_title.replace(/^\s*/,'').replace(/\s*$/, '');   //좌공백 제거, 우공백 제거
        p_title = p_title_Head + " " + p_title;							//헤드 다시 붙임
        //alert(p_title);
        
        p_href = articlelist.children[i].querySelector('div.board-list > div.inner_list > a').href;
        //alert(p_href);
        
        articlelistindex = i;
        ListInfo[ListInfo.length] =  {
          p_memberid: p_memberid,
          p_nickname: p_nickname,
          p_title: p_title,
          p_href: p_href,
          articlelistindex: articlelistindex
        };
        //alert( p_memberid );
      }
    }
  }
  	
  
  var nCnt = 0;		
  
  for (i = 0 ; i < ListInfo.length ; i++ ) {
	  //alert('------7-----');
    if (blockedID.indexOf(ListInfo[i].p_memberid) != -1) {	      //founded
	  	//alert('------founded-----');
      //articlelist.children[ListInfo[i].articlelistindex].style = 'background-color:#505050;';
      //articlelist.children[ListInfo[i].articlelistindex].style = 'display: none;';

      //alert( articlelist.children[ListInfo[i].articlelistindex].outerHTML );
      //alert( articlelist.children[ListInfo[i].articlelistindex].innerHTML );
      //alert( articlelist.children[ListInfo[i].articlelistindex].innerText );

      //articlelist.children[ListInfo[i].articlelistindex].outerHTML = '필터링 됨';
      //articlelist.children[ListInfo[i].articlelistindex].innerHTML = '필터링 됨';
      //articlelist.children[ListInfo[i].articlelistindex].innerHTML = '<tr><td bgcolor=DDDDDD colspan=5 >필터링 됨</td></tr>';
      
      var strMsg = "<tr><td bgcolor=DDDDDD colspan=5 >필터링 됨 ( id: " + ListInfo[i].p_memberid + ", 닉:" + ListInfo[i].p_nickname + " )</td></tr>";
      articlelist.children[ListInfo[i].articlelistindex].innerHTML = strMsg;
      
      //articlelist.children[ListInfo[i].articlelistindex].innerText = '필터링 됨';
      nCnt++;
    }
  }

  //alert(nCnt);

  window.localStorage.removeItem('blockedID');
}


var a = document.getElementById('cafe_main');

if (a) a.addEventListener("load", setBlackList);

