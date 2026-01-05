// ==UserScript==
// @name        Filtr "Czy jesteś dobrym człowiekiem?"
// @namespace   Wykop scripts
// @description Usuwa z wykopu komentarze zawierające obrazek z tekstem zaczynającym się od słów: "Czy jesteś dobrym człowiekiem?" i jego kolejnymi odmianami.
// @include     http://www.wykop.pl/link/*
// @version     1.24
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5158/Filtr%20%22Czy%20jeste%C5%9B%20dobrym%20cz%C5%82owiekiem%22.user.js
// @updateURL https://update.greasyfork.org/scripts/5158/Filtr%20%22Czy%20jeste%C5%9B%20dobrym%20cz%C5%82owiekiem%22.meta.js
// ==/UserScript==

var analyseImg = true; // czy dodatkowo analizowac zawartość obrazka? [true/false]
var showButton = true; // czy w miejsce spamu umieszczac przycisk do przywrocenia ukrytej wiadomosci
var wait4Lazy = 400;
var picSignatureVals = [909,0,0,1470,30,31,60,   947,15,0,1533,0,1,4,   0,0,0,1894,186,420,0,
                        943,0,0,1460,22,22,53,   988,0,0,1375,19,43,75,  895,0,0,1547,22,9,27,
                        422,0,0,1771,170,54,83,  0,0,0,1792,247,461,0,   1097,14,0,1379,0,2,8,
                        746,13,0,1730,0,3,8,     647,12,0,1824,0,9,8,    600,0,0,1897,0,0,3,
                        1010,0,0,1490,0,0,0,     1151,6,0,1334,0,0,9,   1201,2,0,1276,0,7,14,
                        1190,6,0,1275,0,13,16];  // Redish,Greenish,Bluish,Whitish,Blackish,Greyish,Other, ... (vals for 14 imgs)for 13 imgs)
var username;

function btoa2(binData)
{
  var d = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, c, output = ''; i < binData.length; ) {
    c = ((binData.charCodeAt(i++) & 255) << 16)
    | ((binData.charCodeAt(i++) & 255) << 8)
    | (binData.charCodeAt(i++) & 255);
    output += d.charAt(c >> 18) + d.charAt((c >> 12) & 63)
    + (i - binData.length > 1 ? '=' : d.charAt((c >> 6) & 63))
    + (i > binData.length ? '=' : d.charAt(c & 63));
  }
  return output;
}

function countColors(imgData)
{
  var cr,cg,cb, redish, greenish, bluish, whitish, blackish, other, greyish;
  redish=greenish=bluish=whitish=blackish=other=greyish = 0;

  for(var i=0; i<imgData.length; i+=4)
  {
    cr = imgData[i];
    cg = imgData[i+1];
    cb = imgData[i+2];
    if(cr>cg+10 && cr>cb+10)
      ++redish;
    else if(cb>cg+10 && cb>cr+10)
      ++bluish;
    else if(cg>cr+10 && cg>cb+10)
      ++greenish;
    else if(cr>200 && cg>200 && cb>200)
      ++whitish;
    else if(cr<25 && cg<25 && cb<25)
      ++blackish;
    else if((cr>cg-10&&cr<cg+10 && cr>cb-10&&cr<cb+10) /* (cg>cr-7&&cg<cr+7 && cg>cb-7&&cg<cb+7) || (cb>cg-7&&cb<cg+7 && cb>cr-7&&cb<cr+7)*/)
      ++greyish;
    else
      ++other;
  }
  return(redish+","+greenish+","+bluish+","+whitish+","+blackish+","+greyish+","+other);
}

function filterSpam()
{
  var bigPics = document.getElementsByClassName("media-content too-long-pic");
  if(bigPics.length > 0)
  {
    for(var i=0; i<bigPics.length; ++i)
    {
      var bigImg = bigPics[i].getElementsByClassName("block lazy");
      if(bigImg.length > 0)
      {
        if( bigImg[0].width  > 366 && bigImg[0].width  <  380
         && bigImg[0].height > 830 && bigImg[0].height < 1640 )
        {
          var commentNode = bigPics[i].parentNode.parentNode.parentNode.parentNode;
          var commentVotesNode = commentNode.getElementsByClassName("vC")[0];
          var nickColorClass = commentNode.getElementsByClassName("showProfileSummary")[0].className;
          var commentTextNode = commentNode.getElementsByClassName("text")[0];
          var commentTextNodePs = commentTextNode.getElementsByTagName("p");
          var psLen = 0;
          for(var j=0; j<commentTextNodePs.length; ++j)
          {
            if(commentTextNodePs[j].className.length == 0)
            {
              psLen += commentTextNodePs[j].innerHTML.replace(/@<a [^>]*?>.*?<\/a>:\s*/gi,'').replace(/(<([^>]+)>)/ig,"").replace(/^\s+|\s+$/g,"").length;
            }
          }

          if(commentVotesNode.getAttribute("data-vc")<1
           && (nickColorClass.indexOf("color-0")>=0 || nickColorClass.indexOf("color-100")>=0) 
           && psLen<1 )
          {

//            commentNode.getElementsByClassName("fa fa-minus")[0].parentNode.click();

            if(!analyseImg)
            {

              var spamDiv = commentNode.getElementsByTagName('div')[0];
              if(showButton)
              {
                var preSpamDiv = document.createElement("div");
                preSpamDiv.className = 'wblock';
                preSpamDiv.innerHTML = '<a class="showSpoiler" onclick="this.parentNode.parentNode.getElementsByTagName(\'div\')[1].style.display=\'block\'"> . . . S P A M . . . </a>';
                spamDiv.parentNode.insertBefore(preSpamDiv, spamDiv);   
              }
              spamDiv.style.display='none';
              continue;
            }
            
            GM_xmlhttpRequest({
              method: 'GET',
//              binary: true,    // pre Fx39
              context: bigImg[0],
              url: bigImg[0].src,
              overrideMimeType: 'text/plain; charset=x-user-defined',
              onload: function (r) {
                try {
                   if (r.status != 200) r.context.src = '';
                   else
                   {
                    var contentType = r.responseHeaders.substr(r.responseHeaders.indexOf('Content-Type: ') + 14);
                    contentType = contentType.substr(0, (contentType + '\r').indexOf('\r'));
                    if(contentType.indexOf('jpeg') >= 0)
                    {
                      var o = btoa2(r.responseText);
                      var img = document.createElement('img');
                      var imgCtx, imgData;

                      img.addEventListener('load', function () {
                        try {
                          with (document.createElement('canvas'))
                          {

                            width = img.naturalWidth;
                            height = img.naturalHeight;
                            imgCtx = getContext('2d')
                            imgCtx.drawImage(img, 0, 0);

                            var blankSectors = [width-50,height-50,50,50, 0,height-34,55,34, width-20,0,20,20];       // most pixels should be white  // or white+red

                            var j;
                            var str='';  
                            var colStats;

                            // Analyse white rects
                            for(j=0; j<blankSectors.length; j+=4)
                            {
                              imgData = imgCtx.getImageData(blankSectors[j], blankSectors[j+1], blankSectors[j+2], blankSectors[j+3]).data;
                              colStats = countColors(imgData).split(',');
                              str +=("["+(j/4)+"] Red:"+colStats[0]+", Green:"+colStats[1]+", Blue:"+colStats[2]+", White:"+colStats[3]+", Black:"+colStats[4]+", Grey:"+colStats[5]+", Other:"+colStats[6]+"\n");

                              if(colStats[3]+colStats[0] < 0.97 * blankSectors[j+2]*blankSectors[j+3]) // break img analysis if too many not whitish/redish pixels
                              {
                                return;                    
                              }
                            }

                            // And finally analyse upper left rect
                            imgData = imgCtx.getImageData(0, 0, 50, 50).data;
                            colStats = countColors(imgData).split(',');
                            str +=("[3] Red:"+colStats[0]+", Green:"+colStats[1]+", Blue:"+colStats[2]+", White:"+colStats[3]+", Black:"+colStats[4]+", Grey:"+colStats[5]+", Other:"+colStats[6]+"\n");

                            var positiveMatch = false;
                            for(j=0; j<picSignatureVals.length; j+=7)
                            {
                               for(k=0; k<7; ++k)
                               {
                                 if(colStats[k] < picSignatureVals[j+k] - 50 || colStats[0+k] > picSignatureVals[j+k] + 50)
                                 { // if amount of pixels with specified color not in expected range
                                    break;
                                 }
                               }
                              if(k!=7)
                              {
                                continue;
                              }
                              else
                              {
                                positiveMatch = true;
                                break;
                              }
                            } // for(j)
                            if(positiveMatch)
                            {
///// // Automatyczne zgłaszanie pierwszego napotkanego spamu danego użytkownika
///// // (o ile masz możliwość zgłaszania komentarzy przez odpowiedni link pod komentarzem)
///// // Aby aktywować automatyczne zgłaszanie, na początku skryptu dodaj następujące uprawnienia:
// @grant       GM_getValue
// @grant       GM_setValue
///// // i odkomentuj poniższe wiersze zaczynające się od pięciu ukośników (/)
/////                                   username =  r.context.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("showProfileSummary")[0].getElementsByTagName('b')[0].innerHTML;
/////                                   var lr = GM_getValue('lastReport', '');
/////                                   var lra = lr.split('|');
/////                                   if(lr == '' || (lra.length>1 && !(username == lra[0] && lra[1]>new Date().getTime() - 36000000))) // przez 10h nie zgłaszamy ponownie już zgłoszonego
/////                                   {
/////                                     GM_setValue('lastReport', username + '|' + new Date().getTime());
/////                                     setTimeout(function(){r.context.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('fa fa-flag-o')[0].parentNode.click()}, 800);
/////                                     setTimeout(function(){document.getElementById('reason39').click()}, 1300); // spam/flood/...
/////                                     // setTimeout(function(){document.getElementById('somesubmit').click()}, 1800); // !!!!! Automatyczne wysłanie - używać tylko w przypadku pełnego zaufania co do nieomylności skryptu!!!!                       
/////                                   }
///// // Koniec automatycznego zgłaszania

                              // remove comment
                              var tmpNode = r.context.parentNode;
                              var l=0;
                              while(tmpNode!=null && l<10)
                              {
                                 if(tmpNode.tagName.toUpperCase() == "LI")
                                 {
                                   var spamDiv = tmpNode.getElementsByTagName('div')[0];
                                   if(showButton)
                                   {
                                     var preSpamDiv = document.createElement("div");
                                     preSpamDiv.className = 'wblock';
                                     preSpamDiv.innerHTML = '<a class="showSpoiler" onclick="this.parentNode.parentNode.getElementsByTagName(\'div\')[1].style.display=\'block\'"> . . . S P A M . . . </a>';
                                     spamDiv.parentNode.insertBefore(preSpamDiv, spamDiv);
                                   }
                                   spamDiv.style.display='none';
                                   break;
                                 }
                                 else
                                 {
                                   tmpNode = tmpNode.parentNode;
                                   ++l;
                                 }
                              } // while(tmpNode)
                            } // if(positiveMatch)

           
                          }
                        } catch (e) {
                          console.error(e.name + ': ' + e.message);
                        }
                      }); // img.eventListener(load)
                      img.src = 'data:' + contentType + ';base64,' + o;
                    }  // if jpeg
                  }  // else r.status
                } catch (e) {
                  console.error(e.name + ': ' + e.message);
                }
              }  // onload: function (r)
            }); // GM_xmlhttpRequest()
          } // if (nick-color && plusy+minusy && ...)
        } // if width & height in range
        else if(bigImg[0].width===0 && bigImg[0].height===0)
        {
          bigImg[0].addEventListener('load', function(){setTimeout(function(){filterSpam();}, wait4Lazy)}, false);
        }
      } // if(bigImg.length > 0)
    } // for(i)
  } // if(bigPics.length > 0)
}

//GM_registerMenuCommand("Usuń 'Czy jesteś ...'", filterSpam, "u");
//window.addEventListener("load", filterSpam, false);
document.addEventListener("DOMContentLoaded", function(event) {
  filterSpam();
}, false);
// Mt. 7,5 :-)
