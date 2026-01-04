// ==UserScript==
// @name        BILIBILI热度计算
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.1
// @author      Apollo Wang
// @description 2021/10/9 下午4:01:09
// @require     https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433618/BILIBILI%E7%83%AD%E5%BA%A6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/433618/BILIBILI%E7%83%AD%E5%BA%A6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==
let releaseTime = new Date(document.querySelector("#viewbox_report > div > span:nth-child(3)").innerText);
let nowTime = new Date();

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

var flushHotData = function() {
  const magicStr = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
  let table = {};
  for (let i = 0; i < magicStr.length; i++) table[magicStr[i]] = BigInt(i);
  let s = [11, 10, 3, 8, 4, 6, 2, 9, 5, 7];
  const XOR = 177451812n, ADD = 100618342136696320n;

  function decode(src) {
    if('av' == src.substr(0, 2))
      return src.substr(2);
    let r = 0n;
    for (let i = 0; i < 10; i++) {
      r += table[src[s[i]]] * (58n ** BigInt(i));
    }
    return (r - ADD) ^ XOR;
  }

  let url = document.URL;
  r = url.length - 1;
  if(url[r] === '/')
    url = url.substr(0, r);
  let bv = url.substr(url.lastIndexOf('/') + 1);
  let av = decode(bv)

  const Http = new XMLHttpRequest()
  Http.open("GET", "https://api.bilibili.com/archive_stat/stat?aid=" + av)
  Http.send()

  Http.onreadystatechange=(e)=>{
    if(Http.readyState === XMLHttpRequest.DONE && Http.status === 200){
      let json = JSON.parse(Http.responseText)['data'];
      let view = json['view'];
      let danmu = json['danmaku'];
      let reply = json['reply'];
      let collect = json['favorite'];
      let coin = json['coin'];
      let share = json['share'];
      let like = json['like'];

      let timel = document.querySelector("#viewbox_report > div > span:nth-child(3)");
      let hot = 0.6 * share + 0.4 * coin + 0.4 * danmu + 0.4 * reply + 0.4 * like + 0.3 * collect + 0.25 * view;
      if((nowTime - releaseTime) / 86400000 <= 1){
        var addString = "&nbsp;&nbsp;" + parseInt(hot * 1.5) + "热度(推广ing)";
      }else{
        var addString = "&nbsp;&nbsp;" + parseInt(hot) + "热度";
      }
      console.log(hot)
      timel.innerHTML += addString;
    }
  }
}

waitForKeyElements('#viewbox_report > div > span:nth-child(3)', flushHotData);
