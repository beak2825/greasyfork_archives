// Dentphoto nickname block script2
// 본 스크립트는 BSD License에 따라 누구나 개인적인 목적이나 상업적인 목적으로
// 사용이 가능합니다. - 익명의 제작자
// http://www.opensource.org/licenses/bsd-license.html
// ==UserScript==
// @name          DNBS2  secret
// @namespace     http://forum.dentphoto.com/*
// @description   hide some articles, replies
// @match       http://forum.dentphoto.com/*
// @exclude
// @version 4.3
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427268/DNBS2%20%20secret.user.js
// @updateURL https://update.greasyfork.org/scripts/427268/DNBS2%20%20secret.meta.js
// ==/UserScript==

 
var dent_filtnick = ["과기구","스윗소보로","루이비스똥","열혈청년","블ㄹ스카이","맑고바른하늘","본업에충실","참인간","코발트","다섯배만더먹자","배산임수의정신","운칠기삼","추천요정","멋있게","치킨이글","슈어드","티삼십사","칼발","치담","공동구매","이런들저런들","개소리사절","하루살이","덴도리스트","캬캬오","산체스","난잘될것이다","일리치","아비정전","컴터초보","밀워키","뾃뾁뾇뾊뽮뽪뽧뽥","골드조아","프린스턴","돈벌러가자","맛있는감귤","라면먹고갈래","코인대박치과는취미","나스닥황제","닷컴가이","온누리","케셔린","핑크공주들","침착하자","국짐당탈출양심순","마하라지","중경삼림","다좋은하루","스텔라루루","그냥가즈아","봉침이사","승사자","꼬르륵천둥", "조커","간이조아","강한남자","게이트맨","관심법","그냥사느거지","기레쓰베일","나도몰라","다시하루시작이다","대바권장","대왕족보","동틀무렵","리베라","러브젤교회","마이페","물피리","블링블링","비셔스","살살치과의원","샤덴프로이데","스스로세우자","5분후","아귀레","아트마샬","은퇴후회","은퇴후에","이젠다바꿔버렷","익게가좋아","인티그랄","제이에게","지구는유치원","진짜짜장","추억은방울방울","케서린","뽀송이아빠","카모마일향","이기다니끼가","앤더슨시일바","ㅇㅅㄱ","ㅏㅏ","만보걷기"];
 
 
//댓글 필터링
 
var temp = document.getElementsByClassName("cmt_hv");
//cmt_hv 클래스 전부 서칭,덴포토 게시글 닉 클래스
     for (var i = 0; i < temp.length; i++ )
     {
         var tmp = temp[i];
         var str = tmp.textContent;
//temp 변수에 서칭한거 전부 넣어두고, 잠시 tmp변수에 넣고 거기서 텍스트만 추출해서 str에 넣어둠
         for ( var k = 0; k < dent_filtnick.length; ++k )
                 {
                      if (str.match(dent_filtnick[k]) )
                            {
                                var tr = tmp;
                                tr.innerHTML = "<tr><td>Pizza! [" + dent_filtnick[k] + "]의 댓글 사라짐!!!</td><td></td><td></td><td></td></tr><tr><td></td></tr>";
                                break;
//str에서 필터링 닉네임이 발견되면 텍스트 날려버리고 필터링 시킴, 아니면 찾을때까지 for 문으로 반복
                            }
                 }
 
     }
 
//자게 필터링
 
var subtemp = document.getElementsByClassName("tbtr");
//tbtr 클래스 전부 서칭,덴포토 게시글 클래스
     for (var j = 0; j < subtemp.length; j++ )
     {
         var subtmp = subtemp[j];
         var substr = subtmp.textContent;
         for ( var l = 0; l < dent_filtnick.length; ++l)
         {
             if (substr.match(dent_filtnick[l]) )
             {
                 var subtr = subtmp;
                 subtr.innerHTML = "<tr><Td></td><Td></td><Td></td><Td></td>Pizza! [" + dent_filtnick[l] + "]의 글이 필터링 됨!!!<Td></td><Td></td><Td></td></tr>";
                 break;
             }
         }
     }
 