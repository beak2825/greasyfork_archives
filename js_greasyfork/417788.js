// ==UserScript==
// @name         Instagram Story Unmute | Instagram Stories Unmuter | Muted Instagram Story |
// @namespace    InstagramStoriesUnMuter
// @version      1.0.14
// @description  Instagram Stories Desktop Unmuter
// @author       Kirbe
// @include      https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417788/Instagram%20Story%20Unmute%20%7C%20Instagram%20Stories%20Unmuter%20%7C%20Muted%20Instagram%20Story%20%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/417788/Instagram%20Story%20Unmute%20%7C%20Instagram%20Stories%20Unmuter%20%7C%20Muted%20Instagram%20Story%20%7C.meta.js
// ==/UserScript==
(function() {
  (function() {
      var pushState = history.pushState;
      var replaceState = history.replaceState;

      history.pushState = function() {
          pushState.apply(history, arguments);
          window.dispatchEvent(new Event('pushstate'));
          window.dispatchEvent(new Event('locationchange'));
      };

      history.replaceState = function() {
          replaceState.apply(history, arguments);
          window.dispatchEvent(new Event('replacestate'));
          window.dispatchEvent(new Event('locationchange'));
      };

      window.addEventListener('popstate', function() {
          window.dispatchEvent(new Event('locationchange'))
      });
  })();
  //This is the event listener that triggers when url of the page change
  window.addEventListener('locationchange', function(){
      // Timer so it can let instagram charge the vid before clicking the button
      setTimeout(function()
      {
          let muteIcon = document.getElementsByClassName('_8-yf5');
          let windowLocation = window.location.href;
          let languages = ['El audio está silenciado.', 'Audo is muted.', 'Oudio is gedemp.', 'Zvuk je ztišený.', 'Lyden er slået fra.', 'Audio ist stummgeschaltet.', 'Έγινε σίγαση ήχου.', 'L’audio est mis en sourdine.', "L'audio non è attivo.", 'O áudio está silenciado.', 'Звук выключен.', '音声はミュート中です。', '오디오가 꺼져 있습니다.', '视频已静音。', '已靜音。']
          if ((windowLocation.startsWith('https://www.instagram.com/stories') || windowLocation.startsWith('https://www.instagram.com/p/' ) ) && document.querySelector('.aY6mA') == null){
              for (var i = 0; i <= 15; i++){
                  if ( document.querySelector(`svg._8-yf5[aria-label="${languages[i]}"]`) != null){
                      document.getElementsByClassName('FqZhB')[0].click();
                  }
              }
          }

          if (windowLocation.startsWith('https://www.instagram.com/') && (windowLocation.length > 'https://www.instagram.com/'.length) && (!document.querySelector(".-nal3").innerHTML.startsWith("<span style=")) )
          {
              document.querySelector(".glyphsSpriteFriend_Follow.u-__7").click();
              if(document.querySelector("._7UhW9.xLCgt.MMzan.KV-D4.uL8Hv").innerText.endsWith(`@${document.querySelector("._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl").innerText}.`))
              {
                  document.querySelector(".-nal3").innerHTML = "<span style='user-select:none;margin-left:10px;margin-right:15px;padding-top:4px;width:70px;height:20px;background-color:RGBA(255,0,46,0.83);display:inline-block;text-align:center;color:white;font-size:1rem;font-weight:600;border: 3px solid RGBA(0,0,0,0.3);border-radius:5%;margin-bottom:-2rem;margin-top:-1rem;'>PRIVATE</span>" + document.querySelector(".-nal3").innerHTML
              }
              else
              {
                  document.querySelector(".-nal3").innerHTML = "<span style='user-select:none;margin-left:10px;margin-right:15px;padding-top:4px;width:70px;height:20px;background-color:RGBA(0,250,0,0.83);display:inline-block;text-align:center;color:black;font-size:1rem;font-weight:600;border: 3px solid RGBA(0,0,0,0.3);border-radius:5%;margin-bottom:-2rem;margin-top:-1rem;'>PUBLIC</span>" + document.querySelector(".-nal3").innerHTML
              }
              document.querySelector(".aOOlW.HoLwm").click();
          }

          if ((windowLocation.startsWith('https://www.instagram.com/stories/') || windowLocation.startsWith('https://www.instagram.com/p/' ) ) && document.querySelector('.aY6mA') != null)
          {
            document.querySelector('.sqdOP.yWX7d.y1rQx.cB_4K').click();
            setTimeout(function(){
                for (var i = 0; i <= 15; i++)
                {
                    if ( document.querySelector(`svg._8-yf5[aria-label="${languages[i]}"]`) != null)
                    {
                        document.getElementsByClassName('FqZhB')[0].click();
                    }
                }
            }, 1000);
          }
      }, 1000);
  });
})()